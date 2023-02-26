import HttpService from '../../../utils/http.js'
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import {
  convertDate,
  checkTime,
  toPayHandler
} from '../common/index'
var count = 10
var arr = []
var waitPayList = []
var timer
var dateValue = 5000
Page({
  data: {
    processStatus: 2,
    tabSwitchStatus: 'ALL',
    orderList: [],
    waitPayOrderList: [],
    size: 10,
    page: 0,
    scrollTopType: 0,
    showCancel: false,
    reasonList: [{
      name: '操作有误（商品、地址、送达时间选错）',
      selected: false
    },
    {
      name: '重复下单',
      selected: false
    },
    {
      name: '不想买了',
      selected: false
    },
    {
      name: '其他原因',
      selected: false
    }
    ],
    tip: false,
    selectedIndex: '',
    projectManagementId: wx.getStorageSync('projectManagementId')
  },
  onLoad: function (options) {
    this.setData({
      tabSwitchStatus: options.status
    })
    wx.setNavigationBarTitle({
      title: '我的订单'
    })
  },
  onShow: function () {
    this.loadOrderFn(this.data.tabSwitchStatus)
  },
  onReady: function () {
    //获得DeliveryTime组件
    this.DeliveryTime = this.selectComponent("#DeliveryTime");
  },
  tabSwitch: function (e) {
    var status = e.currentTarget.dataset.tab
    this.setData({
      tabSwitchStatus: status,
      size: 10,
      page: 0
    })
    this.loadOrderFn(status)
  },
  loadWaitPayOrder () {
    if (timer > -1) {
      clearInterval(timer)
    }
    waitPayList = []
    HttpService.get('/ord/api/orders/waitPay').then(res => {
      if (res.statusCode === 200) {
        if (res.data.length === 0) {
          this.setData({
            waitPayOrderList: waitPayList
          })
          clearInterval(timer)
          return
        }
        // dateValue = new Date(res.header.Date) - (new Date())
        waitPayList = res.data
        this.circle(waitPayList)
        timer = setInterval(() => {
          this.circle(waitPayList)
        }, 1000)
      }
    })
  },
  loadOrder (page, size, status) {
    if (timer > -1) {
      clearInterval(timer)
    }
    // HttpService.get('/ord/api/tenantOrders/user', {
      HttpService.get('/ord/api/order/V2/user', {
      page: page,
      size: size,
      sort: 'id,desc',
      onAll: status
    }).then(res => {
      if (res.statusCode === 200) {
        if (res.data.length === 0) {
          var total = this.data.total
          total -= count
          var page = this.data.page
          page--
          this.setData({
            total: total,
            page: page
          })
        }
        if (res.data.length > 0) {
          res.data.forEach(item => {
            item.totalNumber = 0
            item.tenantOrders.forEach(item2 => {
              item2.details.forEach(item3 => {
                item.totalNumber += item3.number
              })
            })
          })
        }

        arr = arr.concat(res.data)
        this.setData({
          orderList: arr
        })
        this.circle(arr, 'orderListAll')
        timer = setInterval(() => {
          this.circle(arr, 'orderListAll')
        }, 1000)

        if (res.data.length < size) {
          this.setData({
            tip: true
          })
        }
        
      }
    })
  },
  loadOrderFn (status) {
    arr = []
    this.setData({
      tip: false
    });
    if (status === 'WAIT_PAY') {
      this.loadWaitPayOrder()
    } else if (status === 'WAITORDER') {
      this.loadOrder(0, this.data.size, false)
    } else {
      this.loadOrder(0, this.data.size, true)
    }
  },
  goOrderDetail (e) {
    clearInterval(timer)
    var id = e.currentTarget.dataset.id
    var status = e.currentTarget.dataset.status
    wx.navigateTo({
      url: '../orderDetail/orderDetail?id=' + id + '&status=' + status + '&type=backHome',
    })
  },
  delOrder (e) {
    var id = e.currentTarget.dataset.id
    var _this = this
    Dialog.confirm({
      title: '提示',
      message: '是否删除该订单',
    })
      .then(() => {
        // HttpService.delete(`/ord/api/tenantOrders/user/${id}`).then(res => {
          HttpService.delete(`/ord/api/order/V2/user/${id}`).then(res => {
          if (res.statusCode === 200) {
            _this.loadOrderFn(_this.data.tabSwitchStatus)
          }
        })
      })
      .catch(() => {
        // on cancel
      })

  },
  cancelOrder (e) {
    var item = e.currentTarget.dataset.item
    var _this = this
    Dialog.confirm({
      title: '提示',
      message: '是否取消订单',
      confirmButtonColor: '#1CC296'
    })
      .then(() => {
        // this.setData({showCancel: true})
        const postData = {
          cancelReason: '',
          orderId: item.id
        }
        HttpService.post(`/ord/api/orders/cancle`, postData).then(res => {
          if (res.statusCode === 200) {
            _this.loadOrderFn(_this.data.tabSwitchStatus)
          }
        })
      })
      .catch(() => {
        // on cancel
      })
  },
  cancelOrder2 (e) {
    this.setData({
      showCancel: true
    })
    this.data.currentOrder = e.currentTarget.dataset.item
  },
  scrollBottom: function () {
    if (this.data.tip) {
      return
    }
    var total = this.data.total
    total += count
    var page = this.data.page
    page++
    this.setData({
      total: total,
      page: page
    })
    var status = false
    if (this.data.tabSwitchStatus === 'WAITORDER') {
      status = false
    } else {
      status = true
    }
    this.loadOrder(page, 10, status)
  },
  scrollEvent () { },
  onCloseCancel () {
    this.setData({
      showCancel: false
    })
  },
  selectReason (option) {
    const index = option.currentTarget.dataset.index
    this.setData({
      selectedIndex: index
    })
    const reasonList = this.data.reasonList
    this.cancelReason = reasonList[index].name
  },
  cancelOrderHandler () {
    var currentOrder = this.data.currentOrder
    if (this.cancelReason.length === 0) {
      wx.showToast({
        title: '请选择取消原因！',
        icon: 'error',
        duration: 1500
      })
      return
    }
    this.setData({
      showCancel: false
    })

    const cancelOrderRecord = {
      cancelReason: this.cancelReason,
      tenantOrderId: currentOrder.id,
    }

    HttpService.get(`/ord/api/tenantOrders/cancle/user`, cancelOrderRecord).then(res => {
      if (res.statusCode !== 200) {
        Toast(res.data.message)
      }
      this.loadOrderFn(this.data.tabSwitchStatus)
    })
  },
  circle (data, type) {
    if (data.length === 0) {
      clearInterval(timer)
    }
    var sumNumber = []
    data.forEach((item, index) => {
      if (item.createOrderTime && item.orderStatus === 'WAIT_PAY') {
        let allNum = 0
        let num = 0
        item.tenantOrders.forEach(ite => {
          ite.details.forEach(it => {
            num += it.number
          })
        })
        allNum += num
        sumNumber.push(allNum)
        if ((new Date()) - convertDate(item.createOrderTime) - dateValue < 5 * 60 * 1000) {
          let leftTime1 = 5 * 60 * 1000 - ((new Date()) - convertDate(item.createOrderTime) - dateValue)
          let minutes1 = parseInt(leftTime1 / 1000 / 60 % 60, 10)
          let seconds1 = parseInt(leftTime1 / 1000 % 60, 10)
          minutes1 = checkTime(minutes1)
          seconds1 = checkTime(seconds1)
          item.payTimeDeadLine = minutes1 + ':' + seconds1
        } else {
          // clearInterval(timer)
          // this.loadWaitPayOrder()
          data.splice(index, 1)
        }
      }
    })
    if (type === 'orderListAll') {
      this.setData({
        orderList: data,
        sumNumber
      })
      return;
    }
    this.setData({
      waitPayOrderList: data,
      sumNumber
    })
    // console.log(this.data.waitPayOrderList,sumNumber)
  },
  toPay (e) {
    const item = e.currentTarget.dataset.item
    toPayHandler(item)
  },
  showModal: function (e) {
    var item = e.currentTarget.dataset.item
    this.DeliveryTime._showModal(item)
  },
  onUnload: function () {
    if (wx.getStorageSync('currentTime')) {
      wx.removeStorageSync('currentTime');
    }
    clearInterval(timer)
  },
  onHide: function () {
    clearInterval(timer)
  }
})