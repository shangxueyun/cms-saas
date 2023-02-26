import HttpService from '../../../utils/http.js'
import {
  convertDate,
  checkTime,
  toPayHandler
} from '../common/index'
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
var timer
var dateValue = 5000
Page({
  data: {
    show: false,
    actions: [{
        name: '选项',
      },
      {
        name: '选项',
      }
    ],
    steps: [],
    orderId: '',
    subOrderId: '',
    status: '',
    orderData: '',
    show: false,
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
    selectedIndex: '',
    markers: [],
    longitude: 121.381653,
    latitude: 31.183169,
    scale: 18,
    marketInfor: {},
    polyline: [],
    includePoints: [],
    tenantImage: '',
    orderProcess: []
  },
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '订单详情'
    })
    this.setData({
      orderId: options.id,
      status: options.status
    })
  },
  onShow() {
    if (this.data.status === 'WAIT_PAY') {
      this.loadWAITPAY()
    } else {
      this.loadDetails()
    }
  },
  onReady: function () {
    //获得DeliveryTime组件
    this.DeliveryTime = this.selectComponent("#DeliveryTime");
  },
  _querylEvent() {
    this.loadWAITPAY()
  },
  actionSheetShow(e) {
    // || this.data.orderData.orderProcess
    const orderProcess = e.currentTarget.dataset.id
    if (!orderProcess) return
    this.setData({
      orderProcess: orderProcess,
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  onSelect(event) {
    console.log(event.detail);
  },
  loadWAITPAY() {
    if (timer > -1) {
      clearInterval(timer)
    }
    // HttpService.get(`/ord/api/orders/${this.data.orderId}`).then(res => {
    HttpService.get(`/ord/api/order/V2/${this.data.orderId}`).then(res => {
      if (res.statusCode === 200) {
        // dateValue = new Date(res.header.Date) - (new Date())
        // console.log(dateValue)
        var arr = res.data
        this.circle(arr)
        timer = setInterval(() => {
          this.circle(arr)
        }, 1000)
        // this.setData({
        //   orderData: res.data
        // })
      }
    })
  },
  loadDetails() {
    if (timer > -1) {
      clearInterval(timer)
    }
    HttpService.get(`/ord/api/order/V2/${this.data.orderId}`).then(res => {
      // HttpService.get(`/ord/api/tenantOrders/${this.data.orderId}`).then(res => {
      if (res.statusCode === 200) {
        var arr = res.data
        this.circle(arr)
        timer = setInterval(() => {
          this.circle(arr)
        }, 1000)

        this.setData({
          tenantImage: res.data.tenantImageUrl
        })
        this.loadMap()
      }
    })
  },
  loadMap() {
    let orderData = this.data.orderData
    // if (orderData.orderStatus !== 'DISTRIBUTION') {
    //   return
    // }
    if (wx.getStorageSync('marketInfor')) {
      this.setData({
        marketInfor: wx.getStorageSync('marketInfor')
      })
    }
    let lat = orderData.lat
    let lng = orderData.lng
    let lat1 = this.data.marketInfor.latitude
    let lng1 = this.data.marketInfor.longitude
    // 标记点
    let markers = [{
      id: 1,
      latitude: lat,
      longitude: lng,
      joinCluster: true,
      iconPath: "../../../img/global/point.png",
      width: 34,
      height: 34,
      anchor: {
        x: .5,
        y: .5
      },
      customCallout: {
        anchorX: 0,
        anchorY: 0,
        display: "ALWAYS"
      }
    }, {
      id: 2,
      latitude: lat1,
      longitude: lng1,
      joinCluster: true,
      iconPath: "../../../img/global/yuan.png",
      width: 1,
      height: 1,
      anchor: {
        x: 0,
        y: 0
      },
      customCallout: {
        anchorX: 0,
        anchorY: 0,
        display: "ALWAYS"
      }
    }]
    let lati
    let lngi
    if (lat >= lat1) {
      lati = (lat - lat1) / 2 + lat1
    } else {
      lati = (lat1 - lat) / 2 + lat
    }
    if (lng >= lng1) {
      lngi = (lng - lng1) / 2 + lng1
    } else {
      lngi = (lng1 - lng) / 2 + lng
    }
    // 线路坐标点
    let polyline = [{
      points: [{
        latitude: lat,
        longitude: lng,
      }, {
        latitude: lat1,
        longitude: lng1,
      }],
      color: '#1CC296',
      level: 'aboveroads',
      width: 6,
    }]
    // 地图缩放
    let includePoints = [{
      latitude: lat,
      longitude: lng,
    }, {
      latitude: lat1,
      longitude: lng1,
    }]
    this.setData({
      longitude: lng,
      latitude: lat,
      polyline,
      markers,
      latitude: lati,
      longitude: lngi,
      includePoints,
    })
  },
  showTenantImage() {
    let tenantImage = this.data.tenantImage
    this.setData({
      tenantImage,
    })
  },
  showCancelHandler(e) {
    let orderData = e.target.dataset.item
    let status = orderData.orderStatus
    var _this = this
    if (status === 'WAIT_PAY') {
      Dialog.confirm({
          title: '提示',
          message: '是否取消订单',
          confirmButtonColor: '#1CC296'
        })
        .then(() => {
          const postData = {
            cancelReason: '',
            orderId: orderData.id
          }
          HttpService.post(`/ord/api/orders/cancle`, postData).then(res => {
            if (res.statusCode === 200) {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        })
        .catch(() => {
          // on cancel
        })
    } else {
      this.setData({
        showCancel: true,
        subOrderId: orderData.id
      })
    }
  },
  selectReason(option) {
    const index = option.currentTarget.dataset.index
    this.setData({
      selectedIndex: index
    })
    const reasonList = this.data.reasonList
    this.cancelReason = reasonList[index].name
  },
  cancelOrder() {
    var orderData = this.data.orderData
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

    console.log(this.cancelReason)
    const cancelReason = this.cancelReason
    let cancelOrderRecord = {}
    if (orderData.orderStatus === 'WAIT_PAY') {
      cancelOrderRecord = {
        cancelReason: cancelReason,
        orderId: orderData.id
      }
      HttpService.post(`/ord/api/orders/cancle`, postData).then(res => {
        if (res.statusCode === 200) {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    } else {
      cancelOrderRecord = {
        cancelReason: cancelReason,
        tenantOrderId: this.data.subOrderId
      }
      HttpService.get(`/ord/api/tenantOrders/cancle/user`, cancelOrderRecord).then(res => {
        if (res.statusCode === 200) {
          wx.navigateBack({
            delta: 1
          })
        } else {
          Toast(res.data.message)
          this.loadDetails()
        }
      })
    }
  },
  getCurrentTime(e) {
    this.setData({
      orderData: e.detail.data
    })
  },
  onCloseCancel() {
    this.setData({
      showCancel: false
    })
  },
  delHandler(e) {
    var id = e.currentTarget.dataset.id
    Dialog.confirm({
        title: '提示',
        message: '是否删除订单',
      })
      .then(() => {
        HttpService.delete(`/ord/api/order/V2/user/${id}`).then(res => {
          if (res.statusCode === 200) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      })
      .catch(() => {
        // on cancel
      })
  },
  circle(item) {
    if (item.createOrderTime && item.orderStatus === 'WAIT_PAY') {
      if ((new Date()) - convertDate(item.createOrderTime) - dateValue < 5 * 60 * 1000) {
        let leftTime1 = 5 * 60 * 1000 - ((new Date()) - convertDate(item.createOrderTime) - dateValue)
        let minutes1 = parseInt(leftTime1 / 1000 / 60 % 60, 10)
        let seconds1 = parseInt(leftTime1 / 1000 % 60, 10)
        minutes1 = checkTime(minutes1)
        seconds1 = checkTime(seconds1)
        item.payTimeDeadLine = minutes1 + ':' + seconds1
      } else {
        clearInterval(timer)
        wx.navigateBack({
          delta: 1
        })
      }
    }
    this.setData({
      orderData: item
    })
  },
  callPhone(e) {
    var phoneNumber = e.currentTarget.dataset.id
    console.log('phoneNumber', phoneNumber)
    wx.makePhoneCall({
      phoneNumber: phoneNumber
    })
  },
  showModal() {
    const item = this.data.orderData
    this.DeliveryTime._showModal(item)
  },
  toPay(e) {
    const item = this.data.orderData
    toPayHandler(item)
  },
  onUnload: function () {
    clearInterval(timer)
  },
  onHide: function () {
    clearInterval(timer)
  }
})