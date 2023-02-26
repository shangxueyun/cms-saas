/*
 * @Descripttion: 
 * @version: 
 * @Author: Pedia.Xu
 * @Date: 2021-08-04 18:24:34
 * @LastEditors: shangXueYun
 * @LastEditTime: 2022-08-17 11:45:07
 */
import HttpService from '../../../utils/http'
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'
const app = getApp()
const systemInfo = wx.getSystemInfoSync()
const appId = wx.getAccountInfoSync().miniProgram.appId
var timer

Page({
  data: {
    animationData: {},
    shopCarMess: [{}, {}],
    foodsName: [],
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0
    },
    navbar: [
      { id: 1, label: '全部商品' },
      { id: 2, label: '商家' }
    ],
    buildingName: '',
    shopNo: '',
    currentTab: 1,
    goodsList: [],
    kindList: [],
    showPost: true,
    onOffa: true,
    scrollTop: 0,
    scrollTop2: 0,
    shopInfo: {},
    shopNumber: {
      totalPrice: 0,
      totalNumber: 0,
    },
    scrollTop: 0,
    scrollTop2: 0,
    shopCarInfo: [], // 左侧小类件数数组
    fromName: [],
    projectManagementId: wx.getStorageSync('projectManagementId'),
    goodsId: null,
    tenantId: null,
    parentId: null,
    showModalStatus: false,
    goodsCheckedSelect: [],
    goodsCheckedSelectId: [],
    selectAll: false,
    onGoodsScroll: [],
    checkShopNumber: 20,
    idArrs: [],
    fromShare: '',
  },
  onLoad: function (options) {
    // options = {
    //   tenantId: 668,
    //   projectManagementId: 13,
    //   fromShare: 'true'
    // }
    if (options.detail) {
      options.detail = JSON.parse(options.detail)
      this.setData({
        buildingName: options.detail.buildingName,
        shopNo: options.detail.shopNo
      })
    }
    // 获取商家商品
    if (options.tenantId) {
      this.setData({
        tenantId: options.tenantId
      })
    }
    if (options.projectManagementId) {
      this.setData({
        projectManagementId: options.projectManagementId
      })
      wx.setStorageSync('projectManagementId', options.projectManagementId)
    }
  },
  onShow () {
    this.getShopInfo()
  },
  // 页面初始化加载
  onReady: function () {
  },
  checkShopStatus () {
    // 店铺打烊跳转首页
    let that = this
    let projectManagementId = this.data.projectManagementId
    let tenantId = this.data.tenantId
    let subObj = {
      projectManagementId,
      tenantId
    }
    let checkShopNumber = this.data.checkShopNumber
    timer = setInterval(() => {
      checkShopNumber--
      HttpService.get('/gos/api/tenant-goods/sreachByGoods', subObj).then(res => {
        wx.hideLoading()
        if (res.statusCode === 400) {
          HttpService.get('/ord/api/marketConfigsAll').then(res => {
            const projectManagementIdOpen = res.data.some(e => {
              return e.projectManagementId == projectManagementId
            })
            clearInterval(timer)
            if (!projectManagementIdOpen) {
              wx.showModal({
                title: '提示',
                content: '该菜场已暂停线上配送服务',
                showCancel: false,
                success (res) {
                  if (res.confirm) {
                    wx.exitMiniProgram({})
                  }
                }
              })
            } else {
              // clearInterval(timer)
              Toast({
                type: 'fail',
                message: res.data.message,
                onClose: () => {
                  wx.switchTab({ url: '/pages/index/index/index' })
                },
              })
              return
            }
          })
        } else if (res.statusCode === 401 && this.data.checkShopNumber <= 0) {
          // checkShopNumber--
          // that.setData({ checkShopNumber })
          // // this.checkShopStatus()
          // setinterval(that.checkShopStatus(), 2000)
          clearInterval(timer)
        } else {
          clearInterval(timer)
          that.initShop()
        }
      })
    }, 2000)
    // HttpService.get('/gos/api/tenant-goods/sreachByGoods', subObj).then(res => {
    // })
  },
  // 分享
  onShareAppMessage: function () {
    // if (ops.from === 'button') {`                                                                                    
    //   console.log(ops.target)
    // }
    return {
      title: this.data.shopInfo.referred,
      path: 'pages/shop/storeShopp/storeShopp?tenantId=' + this.data.tenantId + '&fromShare=true&projectManagementId=' + this.data.projectManagementId,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '分享失败',
          duration: 2000
        })
      }
    }
  },
  goBack () {
    wx.navigateBack({delta: 1})
  },
  // 获取商家详情
  getShopInfo: function () {
    HttpService.get('/cms/api/tenant/' + this.data.tenantId).then(res => {
      if (res.statusCode) {
        console.log(res)
        this.setData({
          shopInfo: res.data
        })
      }
    }).catch(error => {
      console.log(error)
    })
  },
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.shopInfo.telephone,
      success: function () {
      },
      fail: function () {
      }
    })
  },
  // 销毁页面计算购物车数量
  onUnload: function () {
  },
  // 点击商家图片放大
  previewImage (e) {
    let url = e.currentTarget.dataset.url
    wx.previewImage({
      urls: [url]
    })
  },
})
