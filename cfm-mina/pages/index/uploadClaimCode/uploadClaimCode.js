// pages/mine/parkingPayment/parkingPayment.js
import HttpService from '../../../utils/http.js'
const app = getApp()
let userData = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mallId: '',
    buildingId: '',
    checked: false,
    TradingDol: false,
    NameDol: false,
    fromDataBle: false,
    nucleaseFlag: false,
    succeeShow: false,
    Trading: '请选择',
    TradingDolcolumns: [

    ],
    NameDolcolumns: [

    ],
    from: {
      trading: '请选择',
      name: '请选择',
      buildingId: '',
      berthNo: '',
      roomId: '',
      tenantPersonnelId: '',
      idCard: '',
      fileList: [],
      checked: false
    },
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`
      }
      if (type === 'month') {
        return `${value}月`
      }
      return value
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    for (let i in options) {
      options[i.replace(/amp;/g, '')] = options[i]
    }
    wx.hideHomeButton()
    wx.setNavigationBarTitle({ title: '上传随申码截屏' })
    this.setData({
      mallId: options ? options.id : '' || this.data.mallId,
      buildingId: options ? options.buildingId : '' || this.data.buildingId
    })
    this.login(app)
  },

  onShow () {
  },
  login (app) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const appId = wx.getAccountInfoSync().miniProgram.appId
    let vm = this
    wx.login({
      success: res => {
        let code = {
          appId: appId,
          code: `{"appId": "${appId}","code": "${res.code}"}`,
          grant_type: 'authorization_code',
          client_id: 'web_app'
        }
        console.log(appId)
        HttpService.get('/ywm/api/customerApps/tenantKey', {appId: appId}).then(key => {
          console.log(key)
          wx.setStorageSync('tenantKey', key.data)
          HttpService.post('/uaa/oauth/token', code).then(res => {
            console.log(res)
            if (res.statusCode === 200) {
              wx.setStorageSync('token', res.data)
              HttpService.get('/uaa/api/users/wx').then(detail => {
                console.log(detail)
                wx.hideLoading()
                wx.setStorageSync('account', detail.data)
                app.globalData.account = detail.data
                vm.getTradingData(vm.data.mallId, vm.data.buildingId)
                vm.IsNullData()
              })
            }
          })
        })
      },
      fail: function (error) {
        console.info(error)
      }
    })
  },

  TradingDolCancel (e) {
    this.setData({
      TradingDol: false
    })
  },
  TradingDolConfirm (e) {
    this.setData({
      TradingDol: false,
      'from.trading': e.detail.value.value,
      'from.projectManagementId': e.detail.value.projectManagementId,
      'from.buildingId': e.detail.value.id
    })
    let { trading, buildingId, projectManagementId } = this.data.from
    let obj = {
      trading,
      buildingId,
      projectManagementId,
      name: '请选择',
      berthNo: '',
      roomId: '',
      tenantPersonnelId: '',
      idCard: '',
      fileList: [],
      checked: false
    }
    this.setData({
      from: obj
    })
    this.IsNullData()
  },
  SelectTradingDol () {
    this.setData({
      TradingDol: true
    })
  },
  TradingonClose () {
    this.setData({
      TradingDol: false
    })
  },

  berthInput(e) {
    this.setData({
      'from.berthNo': e.detail.value,
      'from.idCard': '',
      'from.name': '请选择'
    })
    this.IsNullData()
    this.getBerthData(e.detail.value)
  },
  getBerthData (value) {
    let buildingId = this.data.from.buildingId
    if (!buildingId) {
      return false
    }
    HttpService.get(`/gos/api/tenantPersonnel/byBuildingAndRoomName?buildingId=${buildingId}&roomName=${value}`).then(res => {
      let arr = []
      if (res.data && value) {
        res.data.forEach(v => {
          let { id, roomId } = v
          arr.push({
            id,
            value: v.name,
            roomId
          })
        })
      }
      this.setData({
        NameDolcolumns: arr
      })
    })
  },
  getTradingData (id, buildingId) {
    HttpService.get(`/cms/api/buildings/list?projectId=${id}&useStatus=USING`).then(res => {
      let data = res.data
      let TradingDolcolumns = []
      for (let i in data) {
        TradingDolcolumns.push({
          value: data[i],
          id: i,
          projectManagementId: id
        })
        if (i === buildingId) {
          this.actionbuildingId({ 
            projectManagementId: id,
            value: data[i],
            id: i
          }, buildingId)
        }
      }
      this.setData({
        TradingDolcolumns
      })
    })
  },
  actionbuildingId (trading, id) {
    this.setData({
      TradingDol: false,
      'from.trading': trading.value,
      'from.projectManagementId': trading.projectManagementId,
      'from.buildingId': trading.id
    })
    // 回显数据
    let nuclease = wx.getStorageSync('nuclease')
    if (nuclease) {
      nuclease.fileList = []
      // 扫码楼宇id等于不等于缓存数据id
      if (id === nuclease.buildingId && trading.projectManagementId === nuclease.projectManagementId) {
        this.setData({
          from: nuclease,
          nucleaseFlag: true
        })
        this.getBerthData(nuclease.berthNo)
      } else {
        // if () 清空
        let { trading, buildingId, projectManagementId } = this.data.from
        let obj = {
          trading,
          buildingId,
          projectManagementId,
          name: '请选择',
          berthNo: '',
          roomId: '',
          tenantPersonnelId: '',
          idCard: '',
          fileList: [],
          checked: false
        }
        this.setData({
          from: obj
        })
      }
      this.IsNullData()
    }
  },
  idCardVlaue (e) {
    this.setData({
      'from.idCard': e.detail.value
    })
    this.IsNullData()
  },
  idCardblur () {
    // let { idCard } = this.data.from
    // if (!(idCard.length === 6)) {
    //   wx.showModal({
    //     title: '',
    //     content: '身份证输入有误',
    //     showCancel: false
    //   })
    //   this.setData({
    //     'from.idCard': ''
    //   })
    // }
    // this.IsNullData()
  },

  SelectNameDol () {
    this.setData({
      NameDol: true
    })
  },
  NameDolCancel (e) {
    this.setData({
      NameDol: false
    })
  },
  NameDolConfirm (e) {
    this.setData({
      NameDol: false,
      'from.name': e.detail.value.value,
      'from.idCard': '',
      'from.tenantPersonnelId': e.detail.value.id,
      'from.roomId': e.detail.value.roomId
    })
    this.IsNullData()
  },
  NameonClose () {
    this.setData({
      NameDol: false
    })
  },

  imageDelete (e) {
    let data = this.data.from.fileList
    data.splice(e.detail.idnex, 1)
    this.setData({
      'from.fileList': data
    })
    this.IsNullData()
  },
  imageAfter (e) {
    const { file } = e.detail
    let _this = this
    let baseUrl = wx.getStorageSync('baseUrl')
    let token = wx.getStorageSync("token")
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.showLoading({
      title: '上传中...',
      mask: true
    })
    wx.uploadFile({
      url: `${baseUrl}/ywm/api/image-multipart`,
      filePath: file.url,
      type: 'nuclease',
      name: 'file',
      header: { "Content-Type": "multipart/form-data", "Authorization": token.token_type + ' ' + token.access_token, tenantKey: 'qibao' },
      success(res) {
        if (res.statusCode === 201 || res.statusCode === 200) {
          wx.hideLoading()
          // 上传完成需要更新 fileList
          let fileList = _this.data.from.fileList
          fileList.push({ ...file, url: res.data })
  
          _this.setData({
            'from.fileList': fileList
          })
          _this.IsNullData()
  
          console.log(_this.data.fileList)
        }
      }
    })
  },
  onChange (e) {
    this.setData({
      'from.checked': e.detail
    })
    this.IsNullData()
  },

  IsNullData () {
    let data = this.data.from
    let flag = []
    Object.entries(data).forEach(v => {
      if (v[1] === '请选择') {
        flag.push(false)
        return false
      }
      if (typeof v[1] === 'object' ? !v[1].length : !v[1]) {
        flag.push(false)
      } else {
        flag.push(true)
      }
    })
    let le = flag.length
    if (flag.filter(v => v).length === le) {
      this.setData({
        fromDataBle: true
      })
    } else {
      this.setData({
        fromDataBle: false
      })
    }
  },

  submit() {
    let { from } = this.data
    let vm = this
    if (!(from.idCard.length === 6)) {
      wx.showModal({
        title: '',
        content: '身份证输入有误',
        showCancel: false
      })
      this.setData({
        'from.idCard': ''
      })
      this.IsNullData()
      return false
    }
    from.url = from.fileList[0].url
    HttpService.post('/gos/api/nucleicAcidRecord', from).then(res => {
      if (res.statusCode === 201) {
        wx.setStorageSync('nuclease', vm.data.from)
        vm.setData({
          succeeShow: true
        })
      } else if (res.statusCode === 400) {
        wx.showModal({
          content: res.data.message,
          showCancel: false
        })
      }
    }).catch(error => {
      wx.showModal({
        title: '温馨提示',
        content: '网络出现了一点问题',
        showCancel: false
      })
    })
  },

  again () {
    this.setData({
      succeeShow: false
    })
    this.onLoad()
  },

  exit () {
    wx.exitMiniProgram()
  },

  afterRead(event) {
    const { file } = event.detail;
    let _this = this
    let baseUrl = wx.getStorageSync('baseUrl')
    let token = wx.getStorageSync("token")
    let tenantKey = wx.getStorageSync("tenantKey")
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: `${baseUrl}/ywm/api/image-multipart`,
      filePath: file.url,
      name: 'file',
      header: { "Content-Type": "multipart/form-data", "Authorization": token.token_type + ' ' + token.access_token, tenantKey: tenantKey },
      success(res) {
        // 上传完成需要更新 fileList
        const { fileList = [],refundImageUrls } = _this.data;
        fileList.push({ ...file, url: res.data });
        refundImageUrls.push(res.data);

        _this.setData({ 
          fileList, 
          refundImageUrls
        })

        console.log(_this.data.fileList)
        console.log(_this.data.refundImageUrls)
      }
    })
  }
})