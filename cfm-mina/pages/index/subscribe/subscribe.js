// pages/mine/parkingPayment/parkingPayment.js
import HttpService from '../../../utils/http.js'
const app = getApp()
let userData = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parkingBanner: [],
    plateNo: ['沪', '', '', '', '', '', ''],
    currentIndex: 0,
    isSubmit: false,
    mallPark: {
      name: [],
      id: []
    },
    mallId: '',
    malls: [],
    showNewNo: true,
    TradingDol: false,
    NameDol: false,
    timeDol: false,
    currentDate: new Date().getTime(),
    currentDate1: '',
    minDate: new Date().getTime(),
    minDate1: 0,
    maxDate2: 24,
    fromDataBle: false,
    Trading: '请选择',
    TradingDolcolumns: [

    ],
    timeDolcolumns: [

    ],
    from: {
      buildingName: '请选择',
      buildingId: '',
      recordDate: '请选择',
      time: '请选择',
      radio7: null,
      radio: null,
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
    wx.setNavigationBarTitle({ title: '入场预约登记' })
    this.setData({ mallId: wx.getStorageSync('projectManagementId') })
    this.dateFormat()
    this.getTradingData(this.data.mallId) // 测试
  },

  dateFormat () {
    // 日期格式
    let date = new Date()
    let start = date.getTime()

    let end = new Date(new Date().getTime() + (86400000 * 6))
    end = end.getTime()

    this.setData({
      minDate1: start,
      maxDate2: end
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
      'from.buildingName': e.detail.value.value,
      'from.projectManagementId': e.detail.value.projectManagementId,
      'from.buildingId': e.detail.value.id
    })
    let { buildingName, buildingId, projectManagementId } = this.data.from
    let obj = {
      buildingName,
      buildingId,
      projectManagementId,
      recordDate: '请选择',
      time: '请选择',
      radio7: null,
      radio: null,
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
  getTimeData (time) {
    let buildingId = this.data.from.buildingId
    if (!buildingId) {
      return false
    }
    HttpService.get(`/gos/api/makeRecord/date?buildingId=${buildingId}`).then(res => {
      let arr = []
      if (res.data) {
        res.data.forEach(v => {
          if (v.date === time) {
            v.child.forEach(o => {
              // 判断显示
              let disabled = false
              if (typeof o.surplusCount === 'number' && o.surplusCount === 0 ) {
                disabled = true
              }
              arr.push({
                disabled,
                strat: o.startTime,
                end: o.endTime,
                show: `${o.startTime} ~ ${o.endTime}`
              })
            })
          }
        })
      }
      this.setData({
        timeDolcolumns: arr
      })
    })
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
    let date = new Date(e.detail)

    let m = date.getMonth() + 1
    m = m.toString().length === 2 ? m : `0${m}`

    let d = date.getDate()
    d = d.toString().length === 2 ? d : `0${d}`

    this.setData({
      NameDol: false,
      'from.recordDate': `${date.getFullYear()}-${m}-${d}`
    })

    this.setData({
      timeDol: false,
      'from.time': '请选择',
      'from.strat': '',
      'from.end': ''
    })
    this.getTimeData(`${date.getFullYear()}-${m}-${d}`)
    this.IsNullData()
  },

  SelectValue () {
    this.setData({
      timeDol: true
    })
  },
  timeDolCancel (e) {
    this.setData({
      timeDol: false
    })
  },
  timeDolConfirm (e) {
    let { strat, end, show } = e.detail.value
    this.setData({
      timeDol: false,
      'from.time': show,
      'from.strat': strat,
      'from.end': end
    })
    this.IsNullData()
  },

  onChange7 (e) {
    this.setData({
      'from.radio7': e.detail
    })
    this.IsNullData()
  },
  onChange (e) {
    this.setData({
      'from.radio': e.detail
    })
    this.IsNullData()
  },
  checkbox (e) {
    this.setData({
      'from.checked': e.detail
    })
    this.IsNullData()
  },

  getTradingData (id) {
    HttpService.get(`/cms/api/buildings/list?projectId=${id}&useStatus=USING`).then(res => {
      let data = res.data
      let TradingDolcolumns = []
      for (let i in data) {
        TradingDolcolumns.push({
          value: data[i],
          id: i,
          projectManagementId: id
        })
      }
      this.setData({
        TradingDolcolumns
      })
    })
  },

  IsNullData () {
    let data = this.data.from
    let flag = []
    Object.entries(data).forEach(v => { 
      if (!v[1] || v[1] === '请选择') {
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


  newNo: function() {
    let plateNo = this.data.plateNo
    plateNo.push('')
    this.setData({
      plateNo: this.data.plateNo, showNewNo: !this.data.showNewNo, currentIndex: 7, isShow: true,
      keyBoardType: 2})
  },

  //开启 车牌选择键盘
  open: function (e) {
    let inx = e.currentTarget.dataset.index
    if (inx == 0) {
      this.setData({
        isShow: true,
        keyBoardType: 1,
        currentIndex: inx
      })
    } else {
      this.setData({
        isShow: true,
        keyBoardType: 2,
        currentIndex: inx
      })
    }
  },

  //点击了删除
  delete: function (e) {
    let plateNo = this.data.plateNo
    if (plateNo[this.data.currentIndex] == '') {
      if (this.data.currentIndex > 0) {
        this.setData({
          currentIndex: this.data.currentIndex - 1
        });
        plateNo[this.data.currentIndex] = ''
      }
    } else {
      plateNo[this.data.currentIndex] = ''
    }
    if (this.data.currentIndex == 0) {
      this.setData({
        keyBoardType: 1
      });
    } else {
      this.setData({
        keyBoardType: 2
      });
    }
    this.setData({
      plateNo: plateNo
    });
    this.checkSubmit()
  },

  //点击键盘
  click: function (e) {
    var val = e.detail;
    if (!val) return;
    let plateNo = this.data.plateNo
    let currentIndex = this.data.currentIndex
    plateNo[currentIndex] = val
    let noLength = this.data.showNewNo ? 6 : 7
    if (currentIndex < noLength) {
      this.setData({
        currentIndex: currentIndex + 1
      });
    }
    if (this.data.currentIndex == 0) {
      this.setData({
        keyBoardType: 1
      });
    } else {
      this.setData({
        keyBoardType: 2
      });
    }
    this.setData({
      plateNo: plateNo
    });
    this.checkSubmit()
  },

  //点击了 小键盘确认
  inputOk: function (e) {
    this.setData({
      isShow: false
    });
  },

  submit () {
    let { from } = this.data
    let vm = this
    let { buildingId, buildingName, projectManagementId, recordDate } = from
    let par = {
      buildingId,
      buildingName,
      projectManagementId ,
      recordDate,
      carNumber: from.carNumber,
      startTime: from.strat,
      endTime: from.end
    }
    HttpService.post('/gos/api/makeRecord', par).then(res => {
      if (res.statusCode === 201) {
        wx.navigateTo({
          url: '/pages/index/reservationCode/reservationCode?id=' + res.data.id
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

  checkSubmit: function () {
    let sub = true
    let plateNoStr = this.data.plateNo.join('')
    if (plateNoStr.length < 7){
      sub = false
    }
    this.setData({
      isSubmit: sub,
      'from.carNumber': plateNoStr
    });
  }
})