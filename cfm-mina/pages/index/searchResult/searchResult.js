/*
 * @Description:
 * @verbose:
 * @Author: shangXueYun
 * @Date: 2021-08-02 10:06:35
 * @LastEditors: shangXueYun
 * @LastEditTime: 2022-08-18 16:23:06
 */
// index.js
import HttpService from '../../../utils/http'
// 获取应用实例
const app = getApp()

Page({
  data: {
    lineName: '',
    subclassDis: false,
    active: 0,
    switchClass: 'subclass',
    projectManagementId: wx.getStorageSync('projectManagementId'),
    activeId: null,
    tenantId: 1,
    currentParIndex: -1,
    currentIndex: 0,
    checkgoodsList: true,
    checkturnList: false,
    bigName: null,
    fromInfo: null,
    scrollLeft: 0,
    classificationList: [],
  },
  onLoad (query) {
    if (wx.getStorageSync('projectManagementId')) {
      this.setData({ projectManagementId: wx.getStorageSync('projectManagementId') })
    }
    // 页面加载时触发。一个页面只会调用一次，可以在 onLoad 的参数中获取打开当前页面路径中的参数。
    if (query.id) {
      this.setData({
        activeId: Number(query.id),
      })
    }
    console.log(this.data.activeId)
  },
  onReady (option) {
    // 页面初次渲染完成时触发。一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互
    // console.log(this.data.kindList)
  },
  onShow (e) {
    this.getKindList()
  },
  onHide (e) {
    // 页面隐藏/切入后台时触发。 如 wx.navigateTo 或底部 tab 切换到其他页面，小程序切入后台等。
  },
  getKindList () {
    HttpService.get('/uaa/api/paramet-managements/name?name=菜场业态')
    .then((res) => {
      if (res.statusCode == 200) {
        let kindList = res.data
        this.setData({
          kindList: kindList,
        })
        if (this.data.activeId === null) {
          this.setData({
            activeId: kindList[0].id
          })
        }
        kindList.forEach((item, index) => {
          if (item.id === this.data.activeId) {
            this.moveTo(index)
          }
        })
        this.getListData()
      }
    })
    .catch((error) => {
      console.log(error)
    })
  },
  getListData () {
    HttpService.get(`/cms/api/tenant/projectManagement/list`, {
      id: this.data.projectManagementId,
      industryId: this.data.activeId,
      tenantUse: 'MARKET',
      useStatus: 'USING'
      // buildingId: this.data.activeId,
    }).then(res => {
      if (res.statusCode === 200) {
        console.log((res))
        res.data.forEach((v, i) => {
          res.data[i].buildingName = v.buildingName ? v.buildingName.split(',')[0] : ''
          res.data[i].shopNo = v.shopNo[0] ? v.shopNo[0].split(',')[0] : ''
        })
        this.setData({
          classificationList: res.data
        })
      }
    })
  },
  selectAll () {
    this.setData({
      activeId: -1,
      currentParIndex: -1,
      currentIndex: 0,
      subclassDis: false,
      checkgoodsList: true,
      checkturnList: false,
    })
  },
  selectKind (e) {
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    this.moveTo(index)
    this.setData({
      activeId: id,
    })
    this.getListData()
  },
  moveTo (index) {
    if (index < 2) return
    this.setData({
      scrollLeft: (index - 2) * 70,
    })
  },
  onGoodsScroll (e) {
  },
  selectKindScroll () {
  },
  selectTab (e) {
    let index = e.currentTarget.dataset.index
    if (index === 0) {
      this.setData({
        currentIndex: 0,
        checkgoodsList: false,
        checkturnList: true,
      })
      return
    }
    if (this.data.switchClass != 'subclass') {
      this.setData({
        switchClass: 'subclass',
      })
    }
    this.setData({
      currentIndex: index,
      checkgoodsList: false,
      checkturnList: false,
    })
  },
  compare (salesNum) {
    return function (a, b) {
      var val1 = a[salesNum]
      var val2 = b[salesNum]
      return val2 - val1
    }
  },
  returnBack () {
    let searchType = wx.getStorageSync('searchType')
    if (searchType === 'search') {
      // 搜索结果页带搜索内容至搜索页
      var pages = getCurrentPages()
      let prevPage = pages[pages.length - 2]
      let lineName = this.data.lineName
      prevPage.setData({
        lineName,
      })
    }
    wx.navigateBack()
  },
  returnSearch (e) {
    let searchType = wx.getStorageSync('searchType')
    if (searchType === 'search') {
      var pages = getCurrentPages()
      let prevPage = pages[pages.length - 2]
      let lineName = this.data.lineName
      prevPage.setData({
        lineName,
      })
      wx.navigateBack()
    } else if (
      searchType === 'searchResult' ||
      searchType === 'searchResultIndex'
    ) {
      // let pages = getCurrentPages()
      // console.log(pages)
      // let type = e.currentTarget.dataset.type
      wx.navigateTo({
        url: `../search/search?query=${this.data.lineName}`,
      })
    }
  },
  filterGoodsCategory (e) {
    let kindList = this.data.kindList
    // console.log(e)
    if (e.detail.title) {
      this.setData({
        // active: e.detail.index,
        activeId: e.currentTarget.dataset.id,
        subclassDis: true,
      })
      kindList[0].flag = false
    } else {
      kindList[0].flag = true
      this.setData({
        active: 0,
        subclassDis: false,
      })
    }
    this.setData({
      kindList,
    })
  },
  moreSwitch () {
    if (this.data.switchClass == 'subclass') {
      this.setData({
        switchClass: 'switchClass',
      })
    } else {
      this.setData({
        switchClass: 'subclass',
      })
    }
  },
  switchTab (e) {
    let kindList = this.data.kindList
    kindList.forEach((v) => (v.flag = false))
    kindList[e.target.dataset.index].flag = true
    this.setData({
      kindList,
    })
  },
  gostoreShopp (e) {
    let { tenantid, obj } = e.currentTarget.dataset
    let projectManagementId = this.data.projectManagementId
    // console.log(e)
    let url = `/pages/shop/storeShopp/storeShopp?tenantId=${tenantid}&projectManagementId=${projectManagementId}&detail=${JSON.stringify(obj)}`
    wx.navigateTo({
      url,
    })
  },

  onUnload (res) {
    // 页面卸载时触发。如wx.redirectTo或wx.navigateBack到其他页面时。
  },
  onPageScroll (scrollTop) {
    // 监听用户滑动页面事件。
  },
  onTabItemTap (object) {
    // 点击 tab 时触发
  },
  // 需要在app.json的window选项中或页面配置中开启enablePullDownRefresh。
  // 可以通过wx.startPullDownRefresh触发下拉刷新，调用后触发下拉刷新动画，效果与用户手动下拉刷新一致。
  // 当处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新。
  onPullDownRefresh (res) {
    // 监听用户下拉刷新事件。
  },
  onReachBottom (object) {
    // 监听用户上拉触底事件。
  },
  // end
  // 监听用户点击页面内转发按钮（button 组件 open-type="share"）或右上角菜单“转发”按钮的行为，并自定义转发内容。
  onShareAppMessage (from, target, webViewUrl) {
    // from转发事件来源。
    // target如果 from 值是 button，则 target 是触发这次转发事件的 button，否则为 undefined
    // webViewUrl页面中包含web-view组件时，返回当前web-view的url
  },
  // 监听右上角菜单“分享到朋友圈”按钮的行为，并自定义分享内容
  onShareTimeline (title, query, imageUrl) {
    // title	自定义标题，即朋友圈列表页上显示的标题
    // query	自定义页面路径中携带的参数，如 path?a=1&b=2 的 “?” 后面部分
    // imageUrl	自定义图片路径，可以是本地文件或者网络图片。支持 PNG 及 JPG，显示图片长宽比是 1:1
  },
  // 监听用户点击右上角菜单“收藏”按钮的行为，并自定义收藏内容。
  onAddToFavorites (title, imageUrl, query) { },
})
