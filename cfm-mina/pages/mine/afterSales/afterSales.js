import HttpService from '../../../utils/http.js'

var arr = []
Page({
  data: {
    tabSwitchStatus: 'refund',
    orderList: [],
    afterSaleList: [],
    tip: false,
    size: 10,
    page: 0
  },
  onLoad () {
    wx.setNavigationBarTitle({ title: '售后/退款' })
  },
  onShow () {
    this.loadafterSale()
  },
  tabSwitch: function (e) {
    var status = e.currentTarget.dataset.tab
    this.setData({
      tabSwitchStatus: status
    })
    if (status === 'refund') {
      this.loadafterSale()
    } else {
      arr = []
      this.data.tip = false
      this.data.page = 0
      this.loadOrder(0)
    }
  },
  loadafterSale () {
    // HttpService.get('/ord/api/tenantOrders/user/afterSale').then(res => {
    //   if (res.statusCode === 200) {
    //     this.setData({
    //       afterSaleList: res.data
    //     })
    //   }
    // })
    HttpService.get('/ord/api/order/V2/user/afterSale').then(res => {
      if (res.statusCode === 200) {
        this.setData({
          afterSaleList: res.data
        })
      }
    })
  },
  loadOrder (page) {
    HttpService.get('/ord/api/applyRefundRecords/user', {
      page: page,
      size: 10
    }).then(res => {
      if (res.statusCode === 200) {
        if (res.data.length === 0) {
          var page = this.data.page
          page--
          this.setData({
            page: page
          })
        }
        arr = arr.concat(res.data)
        this.setData({
          orderList: arr
        })
        if (res.data.length < 10) {
          this.setData({
            tip: true
          })
        }
      }
    })
  },
  scrollBottom: function () {
    if (this.data.tip) {
      return
    }
    var page = this.data.page
    page++
    this.setData({
      page: page
    })
    this.loadOrder(page, 10)
  },
  goDetails (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../refundDetails/refundDetails?orderId=' + id,
    })
  },
  toApplyService (e) {
    let item = e.currentTarget.dataset.item
    let item2 = e.currentTarget.dataset.item2
    let status = item2.applyStatus
    if (!status) {
      if (item2.refundAmount && (item2.goodsPrice * item2.number).toFixed(2) === item2.refundAmount) {
        wx.showToast({
          title: '该商品无可退款数量',
          icon: 'none',
          duration: 2000
        })
        return
      }
      item2 = JSON.stringify(item2)
      wx.navigateTo({
        url: '../applyService/applyService?orderObj=' + item2 + '&tenantOrderId=' + item.id,
      })
    } else {
      wx.navigateTo({
        url: '../refundDetails/refundDetails?orderId=' + item2.applyRefundRecordId,
      })
    }
  }
})