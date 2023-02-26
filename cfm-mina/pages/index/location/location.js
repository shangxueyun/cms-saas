/*
 * @Description: 
 * @verbose: 
 * @Author: shangXueYun
 * @Date: 2021-07-23 16:28:04
 * @LastEditors: shangXueYun
 * @LastEditTime: 2022-08-17 17:56:36
 */
// index.js
// import Dialog from '../../components/dialog/dialog'
// import Notify from '../../components/notify/notify'
// 获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    tenantId: '',
    projectManagementId: '',
    type: '',
    showAddressSetting: false
  },
  onLoad (options) {
    if (options.tenantId) {
      this.setData({ tenantId: options.tenantId, projectManagementId: options.projectManagementId, type: options.changeType })
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let time = setInterval(() => {
      if (wx.getStorageSync('account')) {
        wx.hideLoading()
        wx.switchTab({
          url: '/pages/index/index/index'
        })
        clearInterval(time)
      }
    }, 500)
    return
    // if (wx.getStorageSync('projectManagementId') && wx.getStorageSync('fromShare')) {
    //   wx.switchTab({
    //     url: '/pages/index/index/index'
    //   })
    //   return
    // }
  },
  onShow (e) {
    // if (!(wx.getStorageSync('projectManagementId') && wx.getStorageSync('fromShare'))) {
    //   this.setData({
    //     showAddressSetting: false
    //   })
    //   wx.getSetting({
    //     success: (res) => {
    //       console.log(res)
    //       // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
    //       // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
    //       // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
    //       var _this = this
    //       if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
    //         wx.showModal({
    //           content: '需要获取您的地理位置，请确认授权',
    //           cancelText: '拒绝授权',
    //           confirmText: '设置授权',
    //           cancelColor: '#ccc',
    //           confirmColor: '#fd3c3c',
    //           success: function (res) {
    //             if (res.cancel) {
    //               // _this.setData({
    //               //   showAddressSetting: true
    //               // })
    //               _this.getLocation()
    //             } else if (res.confirm) {
    //               wx.openSetting({
    //                 success: function (setting) {
    //                   if (setting.authSetting["scope.userLocation"] == true) {
    //                     _this.getLocation()
    //                   } else {
    //                     wx.showToast({
    //                       title: '授权失败',
    //                       icon: 'none',
    //                       duration: 1000
    //                     })
    //                   }
    //                 }
    //               })
    //             }
    //           }
    //         })
    //       } else if (res.authSetting['scope.userLocation'] == undefined) {
    //         this.getLocation()
    //       }
    //       else {
    //         // this.getLocation()
    //       }
    //     }
    //   })
    // }
  },
  getLocation (e) {

  },
  closeAddressTip () {
    // this.setData({
    //   showAddressSetting: false
    // })
  }
})
