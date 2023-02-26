/*
 * @Descripttion: 
 * @version: 
 * @Author: Pedia.Xu
 * @Date: 2021-10-18 15:28:52
 * @LastEditors: Pedia.Xu
 * @LastEditTime: 2021-10-25 11:54:00
 */

import HttpService from '../../../utils/http.js'
import Util from '../../../utils/util.js'
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  data: {
    showTip: false,
    projectManagementId: wx.getStorageSync('projectManagementId'),
    allCoupon: [],
    showAllCoupon: [],
  },
  onLoad: function (option) {
    if (wx.getStorageSync('projectManagementId')) {
      this.setData({ projectManagementId: wx.getStorageSync('projectManagementId') })
    }
    wx.setNavigationBarTitle({ title: '优惠券' })
    this.getAllCoupon()
  },
  onShow () {
  },
  showTip (e) {
    let index = e.currentTarget.dataset.index
    let showTip1 = e.currentTarget.dataset.showtip
    let showAllCoupon = this.data.showAllCoupon
    showAllCoupon[index].showTip = !showTip1
    this.setData({ showAllCoupon })
  },
  getAllCoupon () {
    HttpService.get(`/ord/api/userSureReceiveRecords?projectManagementId=${this.data.projectManagementId}&px=false`).then(res => {
      if (res.statusCode == 200) {
        let now = new Date().getTime()
        res.data.forEach(e => {
          e.showTip = false
          let startTime = new Date(e.couponStartTime).getTime()
          let endTime = new Date(e.couponEndTime).getTime()
          if (now >= startTime && now < endTime) {
            e.showButtom = true
          } else {
            e.showButtom = false
          }
        })
        this.setData({ allCoupon: res.data })
        let showAllCoupon = []
        if (res.data.length > 0) {
          showAllCoupon = this.formatCouponList(res.data)
          showAllCoupon = JSON.parse(JSON.stringify(showAllCoupon))
        }
        this.setData({ showAllCoupon })
      }
    })
  },
  goexpiredCoupon () {
    wx.navigateTo({
      url: '/pages/mine/expireCoupon/expireCoupon'
    })
  },
  goShopping () {
    wx.switchTab({ url: '/pages/index/index/index' })
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

})
