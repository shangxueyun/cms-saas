
import HttpService from '../../../utils/http.js'
const app = getApp()
let userData = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeDetails: {
      date: '-',
      time: '-',
      buildingName: '-',
    },
    dataTime: '-',
    seconds: '-',
    codeImg: '../../../img/index/code.png',
    flagTime: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ mallId: wx.getStorageSync('projectManagementId') })
    this.gethome(this.data.mallId, options.id)
    this.getQRcode()
    let vm = this
    let flagTime = setInterval(() => {
      vm.timeSetunpdateSeconds()
      vm.timeSetunpdate()
    }, 1000)
    this.setData({ flagTime })
    // url = 'data:image/png;base64,' + btoa(new Uint8Array(res).reduce((res, byte) => res + String.fromCharCode(byte), ''))
  },

  gethome (mallId, id) {
    if (id) {
      HttpService.get(`/gos/api/makeRecord/${id}/`).then(res => {
        if (res.data) {
          this.setData({
            'codeDetails.date': res.data.recordDate,
            'codeDetails.time': `${res.data.startTime} ~ ${res.data.endTime }`,
            'codeDetails.buildingName': res.data.buildingName,
          })
        }
        this.getQRcode(res.data.recordDate)
      })
    } else {
      HttpService.get(`/gos/api/makeRecord/home?projectManagementId=${mallId}`).then(res => {
        if (res.data) {
          this.setData({
            'codeDetails.date': res.data.recordDate,
            'codeDetails.time': `${res.data.startTime} ~ ${res.data.endTime }`,
            'codeDetails.buildingName': res.data.buildingName,
          })
        }
        this.getQRcode(res.data.recordDate)
      })
    }
  },
  getQRcode (time) {
    let str = encodeURI('二维码测试')
    HttpService.get(`/cms/api/QRcode/download?name=${time ? time : str}&width=${1000}&height=${1000}`).then(res => {
      if (res.data) {
        let codeImg = 'data:image/png;base64,' + res.data
        this.setData({
          codeImg
        })
      }
    })
  },

  timeSetunpdate () {
    let date = new Date()

    let m = date.getMonth() + 1
    m = m.toString().length === 2 ? m : `0${m}`

    let d = date.getDate()
    d = d.toString().length === 2 ? d : `0${d}`
    
    let Mi = date.getMinutes()
    Mi = Mi.toString().length === 2 ? Mi : `0${Mi}`

    let str = `${date.getFullYear()}-${m}-${d} ${date.getHours()}:${Mi}`
    this.setData({ dataTime: str })
  },
  timeSetunpdateSeconds () {
    let date = new Date()
    let seconds = date.getSeconds()
    this.setData({ seconds })
  },
  onUnload: function () {
    wx.switchTab({
      url: '/pages/index/index/index'
    })
  },
})