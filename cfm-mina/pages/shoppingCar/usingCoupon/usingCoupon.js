/*
 * @Descripttion: 
 * @version: 
 * @Author: Pedia.Xu
 * @Date: 2021-10-18 15:28:52
 * @LastEditors: Pedia.Xu
 * @LastEditTime: 2021-10-25 12:06:53
 */

import HttpService from '../../../utils/http.js'
import Util from '../../../utils/util.js'
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  data: {
    showTip: false,
    // chooseIndex: -1,
    projectManagementId: wx.getStorageSync('projectManagementId'),
    allCoupon: [],
    usingCoupon: [],
    unUsingCoupon: [],
    totalPrice: 0,
    couponAmount: { chooseIndex: -1 }
  },
  onLoad: function (option) {
    if (option.totalPrice) {
      this.setData({ totalPrice: option.totalPrice })
    }
    if (wx.getStorageSync('projectManagementId')) {
      this.setData({ projectManagementId: wx.getStorageSync('projectManagementId') })
    }
    wx.setNavigationBarTitle({ title: '使用优惠券' })
    this.getAllCoupon()
  },
  onShow () {
    if (wx.getStorageSync('couponAmount')) {
      let couponAmount = wx.getStorageSync('couponAmount')
      this.setData({ couponAmount })
    }
  },
  choose (e) {
    let index = e.currentTarget.dataset.index
    let chooseIndex = this.data.couponAmount.chooseIndex
    if (index == chooseIndex) {
      index = -1
    }
    this.setData({
      'couponAmount.chooseIndex': index,
    })
  },
  showTip (e) {
    let index = e.currentTarget.dataset.index
    let showTip = e.currentTarget.dataset.showtip
    let showUsingCoupon = this.data.showUsingCoupon
    showUsingCoupon[index].showTip = !showTip
    this.setData({ showUsingCoupon })
  },
  showTip2 (e) {
    let index = e.currentTarget.dataset.index
    let showTip = e.currentTarget.dataset.showtip
    let showUnUsingCoupon = this.data.showUnUsingCoupon
    showUnUsingCoupon[index].showTip = !showTip
    this.setData({ showUnUsingCoupon })
  },
  goBack () {
    let chooseIndex = this.data.couponAmount.chooseIndex
    let couponAmount = {
      amount: 0,
      couponId: null,
      chooseIndex: -1,
    }
    if (chooseIndex != -1) {
      let amount = this.data.showUsingCoupon[chooseIndex].denomination
      let couponId = this.data.showUsingCoupon[chooseIndex].id
      couponAmount = {
        amount,
        couponId,
        chooseIndex,
      }
    }
    wx.setStorageSync('couponAmount', couponAmount);
    wx.navigateBack()

  },
  async getAllCoupon () {
    HttpService.get(`/ord/api/userSureReceiveRecords?projectManagementId=${this.data.projectManagementId}&px=true`).then(res => {
      if (res.statusCode == 200) {
        this.setData({ allCoupon: res.data })
      }
      HttpService.get(`/ord/api/userSureReceiveRecords?projectManagementId=${this.data.projectManagementId}&payment=${this.data.totalPrice}&px=true`).then(result => {
        if (result.statusCode == 200) {
          let now = new Date().getTime()
          let usingCoupon = []
          result.data.forEach(e => {
            // 默认不展开
            e.showTip = false
            let startTime = new Date(e.couponStartTime).getTime()
            let endTime = new Date(e.couponEndTime).getTime()
            // 判断是否处于优惠券使用时效内
            if (now >= startTime && now < endTime) {
              usingCoupon.push(e)
            }
          })
          this.setData({ usingCoupon })
          let showUsingCoupon = []
          if (usingCoupon.length > 0) {
            showUsingCoupon = this.formatCouponList(usingCoupon)
            showUsingCoupon = JSON.parse(JSON.stringify(showUsingCoupon))
          }
          this.setData({ showUsingCoupon })
          let unUsingCoupon = []
          unUsingCoupon = res.data.filter(e => {
            return usingCoupon.every(item => {
              return item.id !== e.id
            })
          })
          this.setData({ unUsingCoupon })
          let showUnUsingCoupon = []
          if (unUsingCoupon.length > 0) {
            showUnUsingCoupon = this.formatCouponList(unUsingCoupon)
            showUnUsingCoupon = JSON.parse(JSON.stringify(showUnUsingCoupon))
          }
          this.setData({ showUnUsingCoupon })
        }
      })
    })
  },
  formatCouponList (data) {
    let shuowList = []
    data.forEach(e => {
      let loop = e.haveSum - e.usedSum
      if (loop > 1) {
        for (var i = loop; i >= 1; i--) {
          shuowList.push(e)
        }
      } else {
        shuowList.push(e)
      }
    })
    return shuowList
  },
  onUnload () {
    // let chooseIndex = this.data.couponAmount.chooseIndex
    // let couponAmount = {
    //   amount: -1,
    //   couponId: null,
    //   chooseIndex: -1,
    // }
    // if (chooseIndex != -1) {
    //   let amount = this.data.showUsingCoupon[chooseIndex].denomination
    //   let couponId = this.data.showUsingCoupon[chooseIndex].id
    //   couponAmount = {
    //     amount,
    //     couponId,
    //     chooseIndex,
    //   }
    // }
    // wx.setStorageSync('couponAmount', couponAmount);
    // console.log(couponAmount)
  }

})
