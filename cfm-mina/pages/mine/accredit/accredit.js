/*
 * @Descripttion: 
 * @version: 
 * @Author: Pedia.Xu
 * @Date: 2021-09-23 16:04:36
 * @LastEditors: Pedia.Xu
 * @LastEditTime: 2021-10-12 18:29:52
 */

import HttpService from '../../../utils/http'
Page({
  data: {
    projectManagementId: wx.getStorageSync('projectManagementId'),
    selected: false,
    userInfo: null,
    hasUserInfo: false,
    imageUrl: null,
    name: null,
    touchEndTime: 0,
  },
  onLoad: function (options) {

  },
  onHide: function () {
  },
  onShow: function () {

  },
  selectAgree () {
    let selected = !this.data.selected
    this.setData({ selected })
  },
  goProtocol () {
    wx.navigateTo({
      url: '/pages/mine/protocol/protocol',
    })
  },
  throttle () {    // 记录上一次函数触发的时间    
    var lastTime = this.data.touchEndTime;
    var that = this
    // 记录当前函数触发的时间        
    var nowTime = Date.now()
    if (nowTime - lastTime > 1000) {
      that.getUserProfile()
      // 同步时间          
      this.setData({ touchEndTime: nowTime })
    }
  },
  getUserProfile (e) {
    if (!this.data.selected) {
      wx.showToast({
        title: '请阅读并勾选页面底部协议',
        icon: 'none',
        duration: 1500
      })
      return
    }
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({ hasUserInfo: true })
        let userInfo = res.userInfo
        let sex = 'MAN'
        var putData = {
          name: userInfo.nickName,
          sex,
          facialPhoto: userInfo.avatarUrl,
        }
        HttpService.put(`/uaa/api/users/wx`, putData).then(res => {
          wx.navigateBack()
        })
      },
      complete: () => {
      }
    })
  },

})