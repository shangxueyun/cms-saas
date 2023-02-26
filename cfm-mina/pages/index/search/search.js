/*
 * @Description:
 * @verbose:
 * @Author: shangXueYun
 * @Date: 2021-08-02 10:06:35
 * @LastEditors: Pedia.Xu
 * @LastEditTime: 2021-09-06 13:20:30
 */
// index.js
import HttpService from '../../../utils/http'
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog'
// 获取应用实例
const app = getApp()

Page({
  data: {
    lineName: '',
    projectManagementId: wx.getStorageSync('projectManagementId'),
    historyList: [],
  },
  onLoad (query) {
    // 页面加载时触发。一个页面只会调用一次，可以在 onLoad 的参数中获取打开当前页面路径中的参数。
    if (wx.getStorageSync('projectManagementId')) {
      this.setData({ projectManagementId: wx.getStorageSync('projectManagementId') })
    }
    if (query.query) {
      this.setData({
        lineName: query.query,
      })
    }
    // console.log(query.query)
    let pages = getCurrentPages()
    let fromRoute = pages[pages.length - 2].route
  },
  onReady (option) {
    // 页面初次渲染完成时触发。一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互
  },
  onShow (e) {
    // 页面显示/切入前台时触发。
    var pages = getCurrentPages()
    let currPage = pages[pages.length - 1]
    this.getHistoryList()
  },
  onHide (e) {
    // 页面隐藏/切入后台时触发。 如 wx.navigateTo 或底部 tab 切换到其他页面，小程序切入后台等。
  },
  // 自定义方法
  onSearch (e) {
    let searchType = wx.getStorageSync('searchType')
    if ((typeof e.detail === 'string' || e.target.dataset.value) && searchType === 'search') {
      let url = `/pages/index/searchResult/searchResult?query=${typeof e.detail === 'string' ? e.detail : e.target.dataset.value}`
      wx.navigateTo({
        url,
      })
    } else if (searchType === 'searchResult' || searchType === 'searchResultIndex') {
      wx.setStorageSync('searchType', 'searchResultIndex')
      let pages = getCurrentPages()
      let prevPage = pages[pages.length - 2]
      let val
      if (e.currentTarget.dataset.value) {
        val = e.currentTarget.dataset.value
      } else {
        val = e.detail
      }
      prevPage.setData({
        lineName: val,
      })
      wx.navigateBack()

    }
  },
  onCancel (e) {
    // wx.reLaunch({
    //   url: '/pages/index/index/index'
    // })
    wx.navigateBack()
  },
  // 搜索历史记录接口
  getHistoryList () {
    HttpService.get('/gos/api/sreach-records/all', {
      projectManagementId: this.data.projectManagementId,
    })
      .then((res) => {
        // console.log(res)
        if (res.statusCode === 200) {
          let historyList = []
          res.data.forEach((e) => {
            if (e.sreachName !== '') {
              historyList.push(e)
            }
          })
          this.setData({
            historyList: historyList,
          })
        }
      })
      .catch((error) => {
        // console.log(error)
      })
  },
  // 删除搜索历史
  onDelete () {
    let historyList = this.data.historyList
    let that = this
    if (historyList.length === 0) return
    wx.showModal({
      title: '提示',
      content: '确认删除搜索历史？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          HttpService.delete(
            '/gos/api/sreach-records/all?projectManagementId=' +
            that.data.projectManagementId
          )
            .then((res) => {
              if (res.statusCode === 200) {
                that.getHistoryList()
              }
            })
            .catch((error) => {
              // console.log(error)
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
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
