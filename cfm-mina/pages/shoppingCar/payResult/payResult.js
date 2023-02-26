/*
 * @Descripttion:
 * @version:
 * @Author: Pedia.Xu
 * @Date: 2021-08-05 18:30:07
 * @LastEditors: Pedia.Xu
 * @LastEditTime: 2021-10-25 18:12:09
 */

import HttpService from '../../../utils/http.js'

const app = getApp()
Page({
  data: {
    button: ['返回首页', '查看订单'],
    orderStatus: false,
    payMessage: '',
    prepayId: null,
    orderId: null,
    payNumber: 0.00
  },
  onLoad: function (options) {
    let orderId = options.orderId
    let payResult = options.payResult
    let fanelPrice = options.fanelPrice
    this.fanelPrice = fanelPrice
    if (options.prepayId) {
      this.setData({
        prepayId: options.prepayId
      })
    }
    if (options.orderId) {
      this.setData({
        orderId: options.orderId
      })
    }
    if (payResult == 'true') {
      this.setData({
        payMessage: '支付成功',
        orderStatus: true,
        button: [{ name: '返回首页', check: false, id: 1 }],
        payNumber: fanelPrice
      })
      wx.setNavigationBarTitle({
        title: '支付成功'
      })
    } else {
      this.setData({
        payMessage: '支付失败',
        orderStatus: false,
        button: [{ name: '重新支付', check: true, id: 3 }]
      })
      wx.setNavigationBarTitle({
        title: '支付失败'
      })
    }
  },
  onShow: function () {

  },
  goButton: function (e) {
    let id = e.currentTarget.dataset.id
    if (id === 1) {
      wx.switchTab({ url: '/pages/index/index/index' })
    } else if (id === 3) {
      let prepayId = this.data.prepayId
      if (prepayId) {
        this.payAgin(prepayId)
      }
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
  },
  payAgin (prepayId) {
    let that = this
    HttpService.get('/pay/api/tradeSeting/prepayIdSign?prepayId=' + prepayId).then(e => {
      wx.requestPayment({
        timeStamp: e.data.timeStamp,
        nonceStr: e.data.nonceStr,
        package: e.data.package,
        signType: e.data.signType,
        paySign: e.data.paySign,
        success: function (res) {
          wx.showLoading({
            title: '加载中',
            mask: true
          })
          let count = 10
          let timer = setInterval(() => {
            count--
            HttpService.get('/ord/api/orders/checkPay?orderId=' + that.data.orderId).then(e => {
              if ((e.statusCode === 200 && e.data) || count === 0) {
                wx.hideLoading()
                clearInterval(timer)
                that.setData({
                  payMessage: '支付成功',
                  orderStatus: true,
                  button: [{ name: '返回首页', check: false, id: 1 }],
                  payNumber: that.fanelPrice
                })
                wx.setNavigationBarTitle({
                  title: '支付成功'
                })
                // wx.showModal({
                //   title: '温馨提示',
                //   content: '支付成功！',
                //   showCancel: false,
                //   success: function (res) {
                //     if (res.confirm) {
                //     }
                //   },
                //   complete: res => {
                //     wx.navigateBack({
                //       delta: 1
                //     })
                //   }
                // })
              }
            })
          }, 2000)
        },
        fail: function (res) {
          // wx.showModal({
          //   title: '温馨提示',
          //   content: '发生了点小状况，请去订单管理页面查看订单支付状态！',
          //   showCancel: false,
          //   success: function (res) {
          //     if (res.confirm) {
          //     }
          //   },
          //   complete: res => {
          //     wx.navigateBack({
          //       delta: 2
          //     })
          //   }
          // })
        },
        complete: function (res) {
        }
      })
    }).catch(error => {
      wx.showModal({
        title: '提示',
        content: res.data.message,
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        },
        complete: res => {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    })
  }

})