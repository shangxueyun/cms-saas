/*
 * @Description: 
 * @verbose: 
 * @Author: shangXueYun
 * @Date: 2021-07-23 16:28:04
 * @LastEditors: shangXueYun
 * @LastEditTime: 2022-08-18 17:04:38
 */
// index.js
import HttpService from '../../../utils/http.js'
import Util from '../../../utils/util.js'
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'
// 获取应用实例
const app = getApp()

Page({
  data: {
    areaCurrent: 0,
    index: 0,
    showAreaName: [],
    swiperImage: [],
    classificationList: [],
    kindList: [],
    scrollLeft: 0,
    currentIndex: 0,
    currentTaB: 0,
    scrollTopType: 0,
    shopData2: [],
    tip: false,
    projectManagementId: '',
    marketConfigsAll: [],
    countDown: 10,
    showOverlay: false,
    couponData: [],
    touchEndTime: 0,
  },
  // 事件处理函数
  bindViewTap () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad (option) {

  },
  onShow (e) {
    //  高度自适应
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth,
          ratio = res.screenWidth / 375
        that.setData({
          rpxR: rpxR,
          goodsPic: parseInt(336 * ratio)
        });
      }
    })
    this.checkReady()
  },
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      console.log(ops.target)
    }
    return {
      title: '小象买菜到家',
      path: 'pages/index/location/location',
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '转发失败',
          duration: 2000
        })
      }
    }
  },
  checkReady () {
    HttpService.get(`/uaa/api/paramet-managements/name?name=菜场业态&status=USING`).then(res => {
      if (res.statusCode === 200) {
        console.log((res))
        this.setData({
          classificationList: res.data
        })
      }
    })
  },
  getSearch () {
    wx.navigateTo({
      url: '/pages/index/search/search'
    })
    wx.setStorageSync('searchType', 'search') // 从首页 - 搜索 - 搜索结果
  },
  goSearchReault (e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    // let projectManagementId = this.data.projectManagementId
    wx.navigateTo({
      url: `/pages/index/searchResult/searchResult?id=${id}`
    })
  },
  toMake () {
    wx.navigateTo({
      url: `/pages/index/subscribe/subscribe`
    })
  },
  uploadClaimCode () {
    // 测试核酸上传参数id=项目id,buildingId=楼宇id
    wx.navigateTo({
      url: `/pages/index/uploadClaimCode/uploadClaimCode?id=1&amp;buildingId=2`
    })
  },
  toCode () {
    wx.navigateTo({
      url: `/pages/index/reservationCode/reservationCode`
    })
  },
  toRecord () {
    wx.navigateTo({
      url: `/pages/index/reservationRecord/reservationRecord`
    })
  },
  getLocation (e) {

  },
  goService (e) {
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `/pages/index/serviceArea/serviceArea?type=${type}`
    })
  },
  loadMarketConfigs () {
    // HttpService.get('/ord/api/marketConfigsAll').then(res => {
    //   if (res.statusCode === 401 && this.data.countNum >= 0) {
    //     let countNumber = this.data.countNumber
    //     countNumber--
    //     this.setData({ countNumber })
    //     this.loadMarketConfigs()
    //   }
    //   if (res.statusCode === 200) {
    //     this.setData({
    //       marketConfigsAll: res.data
    //     })
    //     wx.setStorageSync('marketConfigsAll', res.data)
    //     this.checkDistributionScope(res.data)
    //   }
    // })
    let marketConfigsAll = {
      startGiveFee: 0.01,
      name: '七宝农贸市场',
      id: 1,
      projectManagementId: 1,
    }
    this.setData({marketConfigsAll})
    wx.setStorageSync('marketConfigsAll', marketConfigsAll)
    this.checkDistributionScope(marketConfigsAll)
  },
  checkDistributionScope (resData) {
    // let isInside, turn = true
    // let areaCurrentIndex = 0
    // var marketInfor = {}
    // for (let i = 0; i < resData.length; i++) {
    //   isInside = Util.isInside(location2, resData[i].marketDistributionScopes)
    //   if (isInside) {
    //     turn = false
    //     areaCurrentIndex = i
    //     marketInfor = {
    //       longitude: resData[i].lng,
    //       latitude: resData[i].lat,
    //     }
    //     wx.setStorageSync('projectManagementId', resData[i].projectManagementId)
    //     wx.setStorageSync('startGiveFee', resData[i].startGiveFee)
    //     wx.setStorageSync('marketInfor', marketInfor)
    //     this.setData({
    //       projectManagementId: resData[i].projectManagementId
    //     })
    //     break
    //   }
    // }
    // if (turn) {
    //   marketInfor = {
    //     longitude: resData[0].lng,
    //     latitude: resData[0].lat,
    //   }
    //   wx.setStorageSync('projectManagementId', resData[0].projectManagementId)
    //   wx.setStorageSync('startGiveFee', resData[0].startGiveFee)
    //   wx.setStorageSync('marketInfor', marketInfor)
    //   this.setData({
    //     projectManagementId: resData[0].projectManagementId
    //   })
    // } else {
    //   // var areaCurrentIndex = resData.indexOf(this.data.projectManagementId)
    //   this.setData({
    //     areaCurrent: areaCurrentIndex
    //   })
    // }
    // var distanceMinIndex
    // if (wx.getStorageSync('projectManagementId') && wx.getStorageSync('fromShare')) {
    //   var projectManagementId = wx.getStorageSync('projectManagementId')
    //   resData.forEach((e, index) => {
    //     if (e.projectManagementId == projectManagementId) {
    //       distanceMinIndex = index
    //       marketInfor = {
    //         longitude: resData[distanceMinIndex].lng,
    //         latitude: resData[distanceMinIndex].lat,
    //       }
    //       return
    //     }
    //   })
    // } else {
    //   let {
    //     latitude,
    //     longitude
    //   } = app.globalData.location
    //   let location2 = {
    //     lat: latitude,
    //     lng: longitude
    //     // lat: 31.183169,
    //     // lng: 121.381653
    //   }
    //   let distanceArr = []
    //   let distanceIndexArr = []
    //   for (let i = 0; i < resData.length; i++) {
    //     let distance = Util.getFlatternDistance(location2.lat, location2.lng, resData[i].lat, resData[i].lng).toFixed(1)
    //     distanceArr.push(distance)
    //     distanceIndexArr.push(distance)
    //     console.log(distanceIndexArr)
    //   }
    //   distanceArr.sort(function (a, b) {
    //     return a - b
    //   })
    //   console.log(distanceArr)
    //   let distanceMin = distanceArr[0]
    //   distanceMinIndex = distanceIndexArr.indexOf(distanceMin);

    //   marketInfor = {
    //     longitude: resData[distanceMinIndex].lng,
    //     latitude: resData[distanceMinIndex].lat,
    //   }
    //   wx.setStorageSync('projectManagementId', resData[distanceMinIndex].projectManagementId)
    // }
    // wx.setStorageSync('startGiveFee', resData[distanceMinIndex].startGiveFee) // 起送费
    // wx.setStorageSync('marketInfor', marketInfor) // 经纬度
    // this.setData({
    //   projectManagementId: resData[distanceMinIndex].projectManagementId,
    //   areaCurrent: distanceMinIndex
    // })

    wx.setStorageSync('startGiveFee', resData.startGiveFee) // 起送费
    // wx.setStorageSync('marketInfor', marketInfor) // 经纬度
    this.setData({
      projectManagementId: resData.projectManagementId
    })

    // this.loadSwiperImage()
    // this.loadGoodsBigType()
    // this.loadGoodsSmallType()
    // this.getOnSale()
    // this.getCoupon()
  },
  // 轮播图
  loadSwiperImage: function () {
    HttpService.get(`/ord/api/marketConfigs/${this.data.projectManagementId}`).then(res => {
      let imgs = []
      if (res.statusCode === 200) {
        wx.setStorageSync('marketDistributionScopes', JSON.stringify(res.data.marketDistributionScopes))
        // let temp =  JSON.parse(wx.getStorageSync('marketDistributionScopes'))
        // console.log(temp)
        if (res.data.bannerPicture && res.data.bannerPicture.length > 0) {
          imgs = res.data.bannerPicture
        } else {
          imgs = ['../../../img/index/newbg.png']
        }
      }
      this.setData({
        swiperImage: imgs
      })
    })
  },
  // 商品种类
  loadGoodsBigType: function () {
    HttpService.get(`/gos/api/tenant-goods/queryGoodsBigTypePid?projectManagementId=${this.data.projectManagementId}`).then(res => {
      if (res.statusCode === 200) {
        this.setData({
          classificationList: res.data
        })
      }
    })
  },
  // 店铺分类
  loadGoodsSmallType: function () {
    // let mallId = this.data.area.idArr[this.data.areaCurrent]
    HttpService.get(`/gos/api/tenant-goods/queryGoodsByTentantType?projectManagementId=${this.data.projectManagementId}`).then(res => {
      if (res.statusCode === 200) {
        this.setData({
          kindList: res.data
        })
      }
    })
  },
  swichNav: function (e) {
    var cur = e.target.dataset.current
    this.setData({
      currentTab: cur
    })
  },
  switchTab (e) {
    this.setData({
      currentIndex: e.detail.current
    });
    this.checkCor()
  },
  scrollEvent: function (e) {
    // if (e.detail.scrollTop > 50) {
    //   let heightScroll = 558
    //   wx.pageScrollTo({
    //     scrollTop: heightScroll / this.data.rpxR,
    //     duration: 0
    //   })
    // }
  },
  scrollBottom: function () {
    if (this.data.tip) {
      return
    }
    var total = this.data.total
    total += count
    var page = this.data.page
    page++
    this.setData({
      total: total,
      page: page
    })
    this.loadShopType(this.data.page, 10, 'down')
  },
  toShopGoods2: function (e) {
    let projectManagementId = this.data.projectManagementId
    let tenantId = e.currentTarget.dataset.tenantid
    let subObj = {
      projectManagementId,
      tenantId
    }
    HttpService.get('/gos/api/tenant-goods/sreachByGoods', subObj).then(res => {
      if (res.statusCode === 400) {
        Toast({
          type: 'fail',
          message: res.data.message,
          onClose: () => {
            this.loadGoodsSmallType()
          },
        })
        return
      } else {
        wx.setStorageSync('shopInfo', JSON.stringify(res))
        wx.navigateTo({
          url: `/pages/shop/storeShopp/storeShopp?tenantId=${tenantId}&projectManagementId=${projectManagementId}&fromHome=true`
        })
      }
    })
  },
  searchHandler () {
    wx.navigateTo({
      url: '/pages/index/reservationCode/reservationCode'
    })
  },
  goActive () { },
  async getOnSale (size) {
    let subObj = {
      projectManagementId: this.data.projectManagementId,
      page: 0,
      size: size || 2,
      sort: 'createdDate,desc',
    }
    let that = this
    let result = await HttpService.get('/gos/api/tenant-goods/discount', subObj)
    if (result.statusCode === 200) {
      let onsaleData = result.data
      let countDown = result.header['time']
      this.setData({
        onsaleData,
        countDown
      })
      if (onsaleData.length === 0 && size == 4) {
        return
      } else if (onsaleData.length === 0) {
        that.getCheapMarket(4)
      } else if (size == 4) {
        return
      } else {
        that.getCheapMarket()
      }
    } else if (size == 4) {
      return
    } else if (result.statusCode === 400) {
      that.getCheapMarket(4)
    }
  },
  async getCheapMarket (size) {
    let subObj = {
      projectManagementId: this.data.projectManagementId,
      page: 0,
      size: size || 2,
      sort: 'createdDate,desc',
    }
    let that = this
    let result = await HttpService.get('/gos/api/tenant-goods/SpecialOffer', subObj)
    if (result.statusCode === 200) {
      let cheapMarketData = result.data
      this.setData({
        cheapMarketData
      })
      if (cheapMarketData.length === 0) {
        that.getOnSale(4)
      }
    }
  },
  goOnSale () {
    wx.navigateTo({
      url: `/pages/index/onSale/onSale?projectManagementId=${this.data.projectManagementId}`
    })
  },
  goCheapMarket () {
    wx.navigateTo({
      url: `/pages/index/cheapMarket/cheapMarket?projectManagementId=${this.data.projectManagementId}`
    })
  },
  checkCor: function () {
    if (this.data.currentIndex > 3 && this.data.currentIndex <= 6) {
      this.setData({
        scrollLeft: 200
      })
    } else if (this.data.currentIndex > 6) {
      this.setData({
        scrollLeft: 400
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  async getCoupon () {
    let isClose = wx.getStorageSync('isClose')
    this.setData({ showOverlay: false })
    if (!isClose) {
      return
    }
    let result = await HttpService.get(`/ord/api/queryUserWaitReceive?projectManagementId=${this.data.projectManagementId}`)
    if (result.statusCode == 200) {
      wx.setStorageSync('isClose', false)
      this.setData({ couponData: result.data })
      if (result.data.length > 0) {
        this.setData({ showOverlay: true })
      }
    }
  },
  closeOverlay () {
    this.setData({ showOverlay: false })
  },
  pullCoupon () {
    var lastTime = this.data.touchEndTime;
    var that = this
    // 记录当前函数触发的时间        
    var nowTime = Date.now()
    if (nowTime - lastTime > 1000) {
      that.pullGetCoupon()
      // 同步时间          
      this.setData({ touchEndTime: nowTime })
    }
  },
  pullGetCoupon () {
    let couponData = this.data.couponData
    let subObj = []
    couponData.forEach((e, index) => {
      subObj.push({
        cId: e.cId,
        receiveNum: e.receiveNum,
      })
    })
    // return
    HttpService.post(`/ord/api/userReceiveCouponUpdate`, subObj).then(res => {
      if (res.statusCode == 200) {
        let tip = '领取成功'
        let type = 'success'
        if (res.data.length > 0) {
          type = 'fail'
          tip = '' + res.data.length + '张优惠券领取失败'
          // if (res.data.length == 1) {
          //   tip = res.data[0].msg
          // } else {
          //   tip = '您领取的优惠券有部分已失效，以实际领取情况为准'
          // }
        }
        Toast({
          type: type,
          message: tip,
        })
        this.setData({ showOverlay: false })
      }
    })
  }
})