/*
 * @Descripttion: 
 * @version: 
 * @Author: Pedia.Xu
 * @Date: 2021-10-18 15:28:52
 * @LastEditors: Pedia.Xu
 * @LastEditTime: 2021-10-22 18:36:38
 */

import HttpService from '../../../utils/http.js'
import Util from '../../../utils/util.js'
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  data: {
    showTip: false,
    expireCoupon: [],
    projectManagementId: wx.getStorageSync('projectManagementId'),
    showexpireCoupon: [],
    showTip: '没有更多了',
    page: 0,
    size: 10,
    loadBottom: false,
    loadAll: false,
  },
  onLoad: function (option) {
    if (wx.getStorageSync('projectManagementId')) {
      this.setData({ projectManagementId: wx.getStorageSync('projectManagementId') })
    }
    wx.setNavigationBarTitle({ title: '不可用优惠券' })
    this.getexpireCoupon()
  },
  onShow () {
  },
  showTip (e) {
    let index = e.currentTarget.dataset.index
    let showTip = e.currentTarget.dataset.showtip
    let expireCoupon = this.data.expireCoupon
    expireCoupon[index].showTip = !showTip
    this.setData({ expireCoupon })
  },
  //  页面上拉触底事件的处理函数
  onReachBottom () {
    this.getexpireCoupon()
  },
  getexpireCoupon () {
    let loadAll = this.data.loadAll
    if (loadAll) {
      return
    }
    let subObj = {
      projectManagementId: this.data.projectManagementId,
      page: this.data.page,
      size: this.data.size,
      // sort: 'createdDate,desc',
    }
    HttpService.get('/ord/api/userNotSureReceiveRecords', subObj).then(res => {
      if (res.statusCode == 200) {
        console.log(res.data)
        if (res.data.length === 0) {
          this.setData({ showTip: '暂无不可用优惠券' })
        }
        res.data.forEach(e => {
          e.showTip = false
        })
        let expireCoupon = this.data.expireCoupon
        expireCoupon = expireCoupon.concat(res.data)
        if (expireCoupon.length === Number(res.header['X-Total-Count'])) this.setData({ loadAll: true })
        let page = this.data.page
        if (res.data.length > 0) {
          page = page + 1
        } else {
          page = page - 1
        }
        console.log(expireCoupon)
        this.setData({ expireCoupon })
      }
    })
  },
  formatCouponList (data) {
    let shuowList = []
    data.forEach(e => {
      let loop = e.multiple
      console.log(loop)
      if (loop > 1) {
        for (var i = loop; i >= 1; i--) {
          shuowList.push(e)
          console.log(e)
        }
      } else {
        shuowList.push(e)
      }
    })
    return shuowList
  },

})
