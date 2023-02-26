/*
 * @Description: 
 * @verbose: 
 * @Author: shangXueYun
 * @Date: 2022-08-16 11:06:47
 * @LastEditors: shangXueYun
 * @LastEditTime: 2022-08-19 14:35:31
 */

import HttpService from '../../../utils/http.js'
import Util from '../../../utils/util.js'
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'
// 获取应用实例
const app = getApp()

Page({
  data: {
    projectManagementId: null,
    type: 'building',
    title: ''
  },
  onLoad (e) {
    if (e.type) {
      this.setData({ type: e.type})
    }
    let title = '行政大楼'
    let temp = '行政大楼'
    if (e.type === 'dining') {
      title = '八号桥大食堂'
      temp = '大食堂'
    } else if (e.type === 'building') {
      title = '行政大楼'
      temp = '行政大楼'
    } else if (e.type === 'account') {
      title = '结算中心'
      temp = '结算中心'
    } else if (e.type === 'safety') {
      title = '食安检测'
      temp = '食安检测'
    }
    this.setData({title})
    wx.setNavigationBarTitle({
      title: temp
    })
  },
  onShow (e) {
  },
  // 点击商家图片放大
  previewImage (e) {
    let url = e.currentTarget.dataset.url
    wx.previewImage({
      urls: [url]
    })
  }
})