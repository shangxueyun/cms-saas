/*
 * @Description: 
 * @verbose: 
 * @Author: shangXueYun
 * @Date: 2022-08-18 16:39:30
 * @LastEditors: shangXueYun
 * @LastEditTime: 2022-08-18 17:02:39
 */
// components/nav/nav.js
import HttpService from '../../utils/http.js'
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: { 
      type: String,
      value: "自定义标题",
    },
    bgColor: {
      type: String,
      value: ""
    }
  },
  /**
   * 组件的生命周期
   */
  lifetimes: {
    attached: function () {
      this.checkReady()
      const systemInfo = wx.getSystemInfoSync();
      // 状态栏的高度
      let statusBarHeight = systemInfo.statusBarHeight;
      // 获取胶囊按钮位置信息
      let boundingClientRect = this.getMenuButtonBoundingClientRect(systemInfo);
      // 导航栏高度
      let navigationHeight = boundingClientRect.height + (boundingClientRect.top - statusBarHeight) * 2;
      this.setData({
        statusBarHeight: statusBarHeight,
        navigationHeight: navigationHeight,
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    bgColor: '',
    areaCurrent: 0,
    cardPage: true,
    projectManagementId: '',
    marketConfigsAll: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取胶囊
    getMenuButtonBoundingClientRect(systemInfo) {
      const ios = !!(systemInfo.system.toLowerCase().search('ios') + 1)
      let rect
      try {
        rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null
        if (rect === null) {
          throw new Error('getMenuButtonBoundingClientRect error')
        }
        // 取值为0的情况  有可能width不为0 top为0的情况
        if (this.checkRect(rect)) {
          throw new Error('getMenuButtonBoundingClientRect error')
        }
      } catch (error) {
        let gap = '' // 胶囊按钮上下间距 使导航内容居中
        let width = 96 // 胶囊的宽度
        if (systemInfo.platform === 'android') {
          gap = 8
          width = 96
        } else if (systemInfo.platform === 'devtools') {
          if (ios) {
            gap = 5.5 // 开发工具中ios手机
          } else {
            gap = 7.5 // 开发工具中android和其他手机
          }
        } else {
          gap = 4
          width = 88
        }
        if (!systemInfo.statusBarHeight) {
          // 开启wifi的情况下修复statusBarHeight值获取不到
          systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20
        }
        rect = {
          // 获取不到胶囊信息就自定义重置一个
          bottom: systemInfo.statusBarHeight + gap + 32,
          height: 32,
          left: systemInfo.windowWidth - width - 10,
          right: systemInfo.windowWidth - 10,
          top: systemInfo.statusBarHeight + gap,
          width
        }
      }
      return rect
    },
    checkReady () {
      HttpService.get(`/gos/api/visualConfig/all`).then(res => {
        if (res.statusCode === 200) {
          this.setData({
            marketConfigsAll: res.data,
            projectManagementId: res.data[this.data.areaCurrent].projectManagementId
          })
          wx.setStorageSync('projectManagementId', res.data[this.data.areaCurrent].projectManagementId)
        }
      })
    },
  }
})
