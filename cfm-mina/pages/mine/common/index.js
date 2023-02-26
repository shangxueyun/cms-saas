/*
 * @Descripttion: 
 * @version: 
 * @Author: Pedia.Xu
 * @Date: 2021-08-25 08:41:54
 * @LastEditors: Pedia.Xu
 * @LastEditTime: 2021-10-29 13:05:19
 */
import HttpService from '../../../utils/http.js'

const convertDate = function (dateStr) {
  var str = dateStr
  str = str.replace('T', '-')
  var arr = str.replace(/:/g, '-').split('-')
  var date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5])
  return date
}

const checkTime = function (i) {
  if (i < 10) {
    i = "0" + i
  }
  return i
}

const toPayHandler = function (item) {
  var prepayId = item.prepayId
  var totalFee = item.actualPayment
  var orderId = item.id
  HttpService.get('/pay/api/tradeSeting/prepayIdSign?prepayId=' + prepayId).then(e => {
    wx.setStorageSync('formPay', true)
    wx.requestPayment({
      timeStamp: e.data.timeStamp,
      nonceStr: e.data.nonceStr,
      package: e.data.package,
      signType: e.data.signType,
      paySign: e.data.paySign,
      success: function (res) {
        let count = 10
        let timer = setInterval(() => {
          count--
          HttpService.get('/ord/api/orders/checkPay?orderId=' + orderId).then(e => {
            if ((e.statusCode === 200 && e.data) || count === 0) {
              // if (e.statusCode === 200 || count === 0) {
              clearInterval(timer)
              wx.redirectTo({
                url: '../../shoppingCar/payResult/payResult?orderId=' + orderId + '&payResult=' + e.data + '&fanelPrice=' + totalFee + '&prepayId=' + prepayId
              })
            }
          })
        }, 2000)
      },
      fail: function (res) {
        HttpService.get('/ord/api/orders/checkPay?orderId=' + orderId).then(e => {
          if (e.statusCode === 200) {
            wx.redirectTo({
              url: '../../shoppingCar/payResult/payResult?orderId=' + orderId + '&payResult=' + e.data + '&fanelPrice=' + totalFee + '&prepayId=' + prepayId
            })
          }
        })
      },
      complete: function (res) { }
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

export {
  convertDate,
  checkTime,
  toPayHandler
}