
import HttpService from '../../../utils/http.js'
const app = getApp()
let userData = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mallId: '',
    page: 0,
    size: 10,
    tool: 0,
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '预约记录' })
    this.setData({ mallId: wx.getStorageSync('projectManagementId') })
    this.getDataList()
  },

  onReachBottom (e) {
    let page = this.data.page
    page++
    this.setData({ page })
    this.getDataList()
  },

  getDataList () {
    HttpService.get(`/gos/api/makeRecord/list?page=${this.data.page}&size=${this.data.size}&sort=id,desc`).then(res => {
      let dataList = this.data.dataList
      if (res.data) {
        res.data.forEach((v, i) => {
          res.data[i].createdDateTime = v.createdDateTime.replace(/T/g, ' ')
        })
        if (this.data.page > 0) {
          dataList = dataList.concat(res.data)
        } else {
          dataList = res.data
        }
        this.setData({ dataList })
      }
    })
  },
  cancel (e) {
    HttpService.delete(`/gos/api/makeRecord/${e.currentTarget.dataset.id}/`).then(res => {
      if (res.statusCode === 200) {
        this.setData({ page: 0 })
        this.onLoad()
      } else if (res.statusCode === 400) {
        wx.showModal({
          content: res.data.message,
          showCancel: false
        })
      }
    })
  },
  
})