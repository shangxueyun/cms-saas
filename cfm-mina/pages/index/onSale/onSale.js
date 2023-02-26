/*
 * @Descripttion: 
 * @version: 
 * @Author: Pedia.Xu
 * @Date: 2021-09-16 10:44:39
 * @LastEditors: Pedia.Xu
 * @LastEditTime: 2021-09-27 20:42:21
 */

import HttpService from '../../../utils/http.js'
import Util from '../../../utils/util.js'
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'
// 获取应用实例
const app = getApp()
var timer
var countDown
Page({
  data: {
    projectManagementId: null,
    page: 0,
    size: 10,
    loadBottom: false,
    onsaleData: [],
    loadAll: false,
    saleStatus: null,
    hour: '00',
    minute: '00',
    second: '00',
    tag: '',
    endState: false,
  },

  onLoad (e) {
    if (e.projectManagementId) {
      this.setData({ projectManagementId: e.projectManagementId })
      this.getOnSale()
    }
  },
  onShow (e) {
  },
  goBack () {
    wx.navigateBack()
  },
  async getOnSale () {
    let loadAll = this.data.loadAll
    if (loadAll) {
      return
    }
    let subObj = {
      projectManagementId: this.data.projectManagementId,
      page: this.data.page,
      size: this.data.size,
      sort: 'createdDate,desc',
    }
    let result = await HttpService.get('/gos/api/tenant-goods/discount', subObj)
    if (result.statusCode === 200) {
      var width = parseInt(wx.getStorageSync('systemInfo').screenWidth / 375 * 160)
      result.data.forEach((e, index) => {
        e.gImgurl = e.gImgurl + '?x-oss-process=image/resize,m_fixed,h_' + width + ',w_' + width
      })
      let onsaleData = this.data.onsaleData
      onsaleData = onsaleData.concat(result.data)
      let saleStatus = result.header['status']
      countDown = result.header['time']
      if (onsaleData.length === Number(result.header['X-Total-Count'])) {
        this.setData({ loadAll: true })
      }
      let page = this.data.page
      if (result.data.length > 0) {
        page = page + 1
      } else {
        page = page - 1
      }
      this.formStatus(saleStatus)
      this.timeInterval(countDown)
      this.setData({ onsaleData, saleStatus, page })
      wx.stopPullDownRefresh()
    }
  },
  // 页面相关事件处理函数–监听用户下拉动作
  onPullDownRefresh () {
    this.setData({
      page: 0,
      loadAll: false,
      onsaleData: [],
      endState: false,
    })
    this.getOnSale()
  },
  //  页面上拉触底事件的处理函数
  onReachBottom () {
    this.getOnSale()
  },
  // 马上抢
  addShopCar (e) {
    let index = e.currentTarget.dataset.index
    // let salesNum = e.currentTarget.dataset.salesNum
    // let lineStock = e.currentTarget.dataset.lineStock
    let saleStatus = this.data.saleStatus
    let endState = this.data.endState
    if (saleStatus !== 'ING' || endState) return
    // if (salesNum >= lineStock) {
    //   wx.showToast({
    //     title: '购买数量超出范围',
    //     icon: 'none',
    //     duration: 1500
    //   })
    //   return
    // }
    this.postShopCar(index)
    // this.getShopStop(index)
  },
  // 商家商品展示加减
  postShopCar (index) {
    let good = this.data.onsaleData[index]
    let obj = {
      tenantId: good.tenantId,
      tenantName: good.tenantName,
      projectManagementId: good.projectManagementId,
      imgUrl: good.gImgurl,
      goodsCode: good.goodsNumber,
      goodsId: good.gId,
      price: good.price,
      unitName: good.unitName,
      goodsName: good.lineName,
      specification: good.specification,
      resourcePrice: good.resourcePrice || null,
      value: 1
    }
    HttpService.post('/gos/api/shopping-carts/updateShoppingCarts', obj).then(res => {
      if (res.statusCode === 201) {
        Toast.success('已加入购物车')
      } else if (res.statusCode === 400) {
        Toast(res.data.message)
      }
    }).catch(error => {
      wx.showModal({
        title: '温馨提示',
        content: '网络出现了一点问题',
        showCancel: false
      })
    })
  },
  formStatus (status) {
    if (status === 'WAIT') {
      this.setData({ tag: '开始' })
    } else {
      this.setData({ tag: '结束' })
    }
  },
  formTime (countDown) {
    // console.log(countDown)
    let result = parseInt(countDown)
    let saleStatus = this.data.saleStatus
    let h
    let m
    let s
    if (result <= 0) {
      h = '00'
      m = '00'
      s = '00'
      clearInterval(timer)
      if (result === 0 && saleStatus === 'WAIT') {
        this.setData({
          page: 0,
          loadAll: false,
          onsaleData: [],
          endState: false,
        })
        this.getOnSale()
      } else if (saleStatus === 'ING') {
        this.setData({ endState: true })
      }
      this.setData({
        hour: h,
        minute: m,
        second: s,
      })
      return
    }
    if (this.data.saleStatus === 'END') {
      h = '00'
      m = '00'
      s = '00'
      this.setData({
        hour: h,
        minute: m,
        second: s,
      })
      clearInterval(timer)
      return
    }
    h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
    m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
    s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));

    this.setData({
      hour: h,
      minute: m,
      second: s,
    })
  },
  timeInterval (countDown) {
    timer = setInterval(() => {
      countDown--
      this.formTime(countDown)
    }, 1000)
  },
  onUnload: function () {
    clearInterval(timer)
  },
  onHide: function () {
    clearInterval(timer)
  },


})