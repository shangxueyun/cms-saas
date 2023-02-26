/*
 * @Descripttion: 
 * @version: 
 * @Author: Pedia.Xu
 * @Date: 2021-09-16 10:45:26
 * @LastEditors: Pedia.Xu
 * @LastEditTime: 2021-09-27 20:41:46
 */

import HttpService from '../../../utils/http.js'
import Util from '../../../utils/util.js'
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'
// 获取应用实例
const app = getApp()

Page({
  data: {
    projectManagementId: null,
    page: 0,
    size: 10,
    loadBottom: false,
    cheapMarketData: [],
    loadAll: false,
  },
  onLoad (e) {
    if (e.projectManagementId) {
      this.setData({ projectManagementId: e.projectManagementId })
      this.getCheapMarket()
    }
  },
  onShow (e) {
  },
  async getCheapMarket () {
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
    let result = await HttpService.get('/gos/api/tenant-goods/SpecialOffer', subObj)
    if (result.statusCode === 200) {
      var width = parseInt(wx.getStorageSync('systemInfo').screenWidth / 375 * 160)
      result.data.forEach((e, index) => {
        e.gImgurl = e.gImgurl + '?x-oss-process=image/resize,m_fixed,h_' + width + ',w_' + width
      })
      let cheapMarketData = this.data.cheapMarketData
      cheapMarketData = cheapMarketData.concat(result.data)
      if (cheapMarketData.length === Number(result.header['X-Total-Count'])) this.setData({ loadAll: true })
      let page = this.data.page
      if (result.data.length > 0) {
        page = page + 1
      } else {
        page = page - 1
      }
      this.setData({ cheapMarketData, page })
    }
  },
  // 页面相关事件处理函数–监听用户下拉动作
  onPullDownRefresh () {
    this.setData({
      page: 0,
      loadAll: false,
      cheapMarketData: [],
    })
    this.getCheapMarket()
  },
  //  页面上拉触底事件的处理函数
  onReachBottom () {
    this.getCheapMarket()
  },
  addShopCar (e) {
    let index = e.currentTarget.dataset.index
    // let havaNum = e.currentTarget.dataset.havaNum
    // let lineStock = e.currentTarget.dataset.lineStock
    // let saleStatus = this.data.saleStatus
    // if (saleStatus !== 'ING') return
    // if (havaNum >= lineStock) {
    //   wx.showToast({
    //     title: '购买数量超出范围',
    //     icon: 'none',
    //     duration: 1500
    //   })
    //   return
    // }
    this.postShopCar(index)
  },
  // 商家商品展示加减
  postShopCar (index) {
    let good = this.data.cheapMarketData[index]
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

})