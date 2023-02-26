/*
 * @Description: 
 * @verbose: 
 * @Author: shangXueYun
 * @Date: 2021-07-23 16:28:04
 * @LastEditors: Pedia.Xu
 * @LastEditTime: 2021-10-20 13:48:35
 */
// index.js
// 获取应用实例
import { showLoading, hideLoading } from '../../../utils/Global'
// import { getUserInfo } from '../../../utils/userInfo'
import HttpService from '../../../utils/http.js'
const app = getApp()
let userInfo = null

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    imageUrl: '../../../img/mine/head-icon.png',
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    // canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    showMessage: true,
    showCount: true,
    // imageUrl: '../../../img/head-icon.png',
    name: '',
    inte: 0,
    cardsNum: 0,
    couponList: [],
    orderNum: {
      WAIT_PAY: 0,
      PREPAREGOODS: 0,
      DISTRIBUTION: 0,
      WAITORDER: 0
    },
    exData: {
      userName: '张三'
    },
    countNum: 10,
    touchEndTime: 0,
  },
  onLoad () {
    showLoading()
    console.log(app.globalData);
  },
  onShow () {
    hideLoading()
    this.loadUserInfo()
  },
  async loadUserInfo () {
    let info
    let countNum = this.data.countNum
    let res = await HttpService.get('/uaa/api/users/wx')
    countNum--
    this.setData({ countNum })
    if (res.statusCode === 401 && countNum >= 0) {
      this.loadUserInfo()
    } else if (res.statusCode === 200) {
      info = res.data
      this.setData({
        userInfo: info,
        hasUserInfo: true,
        imageUrl: info.facialPhoto || '../../../img/mine/head-icon.png',
        name: info.name
      })
    }
  },
  // 事件处理函数
  bindViewTap () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  throttle () {    // 记录上一次函数触发的时间   
    return 
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
  async getUserIndex (e) {
    let info
    let countNum = this.data.countNum
    let res = await HttpService.get('/uaa/api/users/wx')
    countNum--
    this.setData({ countNum })
    if (res.statusCode === 401 && countNum >= 0) {
      this.loadUserInfo()
    } else if (res.statusCode === 200) {
      info = res.data
      this.setData({
        userInfo: info,
        hasUserInfo: true,
        imageUrl: info.facialPhoto || '../../../img/mine/head-icon.png',
        name: info.name
      })
    }
  },
  getUserProfile (e) {
    let _this = this
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
          _this.getUserIndex()
        })
      },
      complete: () => {
      }
    })
  },
  goAccredit () {
    return
    if (this.data.userInfo.facialPhoto) {
      return
    }
    wx.navigateTo({
      url: '/pages/mine/accredit/accredit',
    })
  },
  loadUser: function () {

  },
  goProtocol () {
    wx.navigateTo({
      url: '/pages/mine/protocol/protocol',
    })
  },
  toAddress: function () {
    return
    if (!this.data.userInfo.facialPhoto) {
      wx.navigateTo({
        url: '/pages/mine/accredit/accredit',
      })
      return
    }
    wx.navigateTo({
      url: '../addressManage/addressManage?manage=true'
    })
  },
  toCoupon: function () {
    return
    if (!this.data.userInfo.facialPhoto) {
      wx.navigateTo({
        url: '/pages/mine/accredit/accredit',
      })
      return
    }
    wx.navigateTo({
      url: '/pages/mine/coupon/coupon'
    })
  },
  goOrder: function (e) {
    return
    if (!this.data.userInfo.facialPhoto) {
      wx.navigateTo({
        url: '/pages/mine/accredit/accredit',
      })
      return
    }
    var status = e.currentTarget.dataset.status
    wx.navigateTo({
      url: '../order/order?status=' + status,
    })
  },
  toAfterSales: function () {
    return
    wx.navigateTo({
      url: '../afterSales/afterSales?manage=true'
    })
  },
  goUserInfo () { }
})
