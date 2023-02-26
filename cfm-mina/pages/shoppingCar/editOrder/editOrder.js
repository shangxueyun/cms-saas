
import HttpService from '../../../utils/http'
Page({
  data: {
    address: {},
    allAddress: [],
    projectManagementId: wx.getStorageSync('projectManagementId'),
    tenantOrders: [],
    account: wx.getStorageSync('account'),
    orderId: '',
    fanelPrice: 0,
    totalPrice: 0,
    salseNmu: 0,
    onOff: true,
    currentDate: 0,
    currentTime: {
      parentIndex: -1,
      index: -1
    },
    deadLine: '',
    tabInx: 1,
    currentTable: '',
    tmplIds: [],
    showModalStatus: false,
    detailId: [],
    dateList: [],
    totalFee: 0,
    payTurn: false,
    isScroll: true,
    inputBottom: 0,
    showSubscribeMessage: true,
    scroTop: 0,
    reasonHeight:0,
    bottomStyle:false,
    usingCouponNum: 0,
    couponAmount: {
      amount: 0,
      couponId: -1,
    },
  },
  onLoad: function (options) {
    this.setData({
      projectManagementId: wx.getStorageSync('projectManagementId')
    })
    if (options.totalPrice) {
      this.setData({
        totalPrice: options.totalPrice - 0,
      })
    }
  },
  onHide: function () {
  },
  onShow: function () {
    this.getOrderInfo()
    this.getDateList()
    this.getCouponNub()
    if (wx.getStorageSync('couponAmount')) {
      let couponAmount = wx.getStorageSync('couponAmount')
      this.setData({couponAmount})
      // console.log(wx.getStorageSync('couponAmount'))
    }
    if (wx.getStorageSync('currentTime')) {
      this.setData({
        currentTime: wx.getStorageSync('currentTime')
      })
      wx.removeStorageSync('currentTime')
    } else {
      this.setData({
        currentTime: {
          index: 0,
          parentIndex: 0
        }
      })
    }
    // 已加购购物车商品  
    if (wx.getStorageSync('tenantOrders')) {
      var tenantOrders = JSON.parse(wx.getStorageSync('tenantOrders'))
      this.setData({ tenantOrders: tenantOrders })
    }
    if (wx.getStorageSync('detailId')) {
      var detailId = JSON.parse(wx.getStorageSync('detailId'))
      this.setData({ detailId: detailId })
    }

  },
  getDateList: function () {
    HttpService.get('/ord/api/marketConfigs/deliverys', {
      projectManagementId: this.data.projectManagementId
    }
    ).then(res => {
      if (res.statusCode === 200) {
        if (wx.getStorageSync('dateList') && wx.getStorageSync('dateList').length !== 0) {
          this.setData({
            dateList: wx.getStorageSync('dateList')
          })
        } else {
          res.data.map(item => {
            item.child.map(e => {
              e.planDeliveryTime = e.startTime.substring(e.startTime.indexOf('T') + 1, e.startTime.lastIndexOf(':'))
              e.planLastDeliveryTime = e.endTime.substring(e.endTime.indexOf('T') + 1, e.startTime.lastIndexOf(':'))
            })
          })
          this.setData({
            dateList: res.data
          })
        }
        let dateList = this.data.dateList
        let currentTime = this.data.currentTime
        let distributionFee = dateList[currentTime.parentIndex].child[currentTime.index].distributionFee
        let totalPrice = this.data.totalPrice
        let totalFee = this.accAdd(distributionFee, totalPrice)
        if (this.data.couponAmount.amount > 0) {
          totalFee = this.accSub(totalFee, this.data.couponAmount.amount)
        }
        // console.log(this.data.totalFee,this.data.couponAmount)
        this.setData({ totalFee })
      }
    }).catch(error => {
      console.log(error)
    })
  },
  getOrderInfo: function () {
    HttpService.get('/ord/api/addresss/all'
    ).then(res => {
      let allAddress = res.data
      if (res.statusCode === 200) {
        this.setData({
          allAddress: allAddress
        })
        if (wx.getStorageSync('address')) {
          let address = wx.getStorageSync('address')
          this.setData({
            address: wx.getStorageSync('address')
          })
        } else {
          allAddress.map(item => {
            if (item.onDefault && item.projectManagementId == wx.getStorageSync('projectManagementId')) {
              this.setData({
                address: item
              })
            }
          })
        }
      }
    }).catch(error => {
      console.log(error)
    })
  },
  getCouponNub () {
    let projectManagementId = this.data.projectManagementId
    let totalPrice = this.data.totalPrice
    HttpService.get(`/ord/api/userSureReceiveRecords?projectManagementId=${projectManagementId}&payment=${totalPrice}&px=true`).then(res => {
      let now = new Date().getTime()
      if (res.statusCode === 200) {
        let usingCouponNum = 0
        res.data.forEach(e => {
          let startTime = new Date(e.couponStartTime).getTime()
          let endTime = new Date(e.couponEndTime).getTime()
          if (now >= startTime && now < endTime) {
            let number = e.haveSum - e.usedSum
            usingCouponNum = number + usingCouponNum
            // console.log(usingCouponNum)
          }
        })
        this.setData({usingCouponNum})
      }
    }).catch(error => {
      console.log(error)
    })
  },
  toAddress: function () {
    var currentPage = getCurrentPages().pop().route
    if (this.data.address) {
      var addressId = this.data.address.id
    } else {
      var addressId = 'null'
    }
    wx.setStorageSync('tenantOrders', JSON.stringify(this.data.tenantOrders))
    wx.setStorageSync('currentTime', this.data.currentTime)
    wx.navigateTo({
      url: '../../mine/addressManage/addressManage?currentPage=' + currentPage + '&mode=choose&addressId=' + addressId
    })
  },
  goAllCoupon () {
    wx.setStorageSync('tenantOrders', JSON.stringify(this.data.tenantOrders))
    wx.setStorageSync('currentTime', this.data.currentTime)
    wx.navigateTo({
      url: '../usingCoupon/usingCoupon?totalPrice=' + this.data.totalPrice
    })
  },
  getText: function (e) {
    let index = e.currentTarget.dataset.index
    let tenantOrders = this.data.tenantOrders
    let val = e.detail.value
    let reg = /([^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n])|(\s)/g
    if (reg.test(e.detail.value)) {
      tenantOrders[index].remark = e.detail.value.replace(reg, '')
    } else {
      tenantOrders[index].remark = e.detail.value
    }
    this.setData({
      tenantOrders: tenantOrders
    })
  },
  async formSubmit(e) {
    if (this.data.payTurn) return
    if (!this.data.address.id) {
      wx.showToast({
        title: '请添加收货地址',
        icon: 'error',
        duration: 1500
      })
      return
    }
    let currentTime = this.data.currentTime
    let that = this
    var addressInfo = this.data.address
    if (!addressInfo.buildingNumber) {
      wx.showToast({
        title: '收货地址失效 请重新编辑！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    // 判断小区是否在配送范围内
    let result = await HttpService.get(`/ord/api/marketConfigs/${this.data.projectManagementId}`)
    let marketDistributionScopes = result.data.marketDistributionScopes
    let temp = marketDistributionScopes.some(item => {
      return item.poiname === addressInfo.address
    })
    if (!temp) {
      wx.showToast({
        title: '当前所选地址不在配送范围内',
        icon: 'none',
        duration: 1500
      })
      return
    }

    if (currentTime.parentIndex === -1 && currentTime.index === -1) {
      wx.showToast({
        title: '请选择配送时间',
        icon: 'error',
        duration: 1500
      })
      return
    }
    // console.log(this.data.totalPrice)
    var totalFee = this.data.totalPrice
    var userId = this.data.account.id
    let dateList = this.data.dateList
    let freigh = dateList[currentTime.parentIndex].child[currentTime.index].distributionFee
    let planDeliveryTime = dateList[currentTime.parentIndex].child[currentTime.index].startTime.substring(0,19)
    let planLastDeliveryTime = dateList[currentTime.parentIndex].child[currentTime.index].endTime.substring(0,19)
    let actualPayment = this.data.totalFee
    // actualPayment = this.accSub(totalFee, this.data.couponAmount)
    var orderObj = {
      tenantOrders: this.data.tenantOrders,
      totalFee: this.data.totalPrice,
      address: addressInfo.address + ' ' + addressInfo.buildingNumber + '栋' + addressInfo.streetNumber + '室',
      contactNumber: addressInfo.contactNumber,
      contactPerson: addressInfo.contactPerson,
      lat: addressInfo.lat,
      lng: addressInfo.lng,
      freigh: freigh,
      userId: userId,
      projectManagementId: this.data.projectManagementId,
      planDeliveryTime: planDeliveryTime,
      actualPayment: actualPayment,
      planLastDeliveryTime: planLastDeliveryTime,
      couponAmount: this.data.couponAmount.amount,
      receiveRecordId: this.data.couponAmount.couponId != -1 ? this.data.couponAmount.couponId : null,
    }
    let subTotal = actualPayment
    HttpService.post('/ord/api/orders', orderObj).then(res => {
      that.setData({ payTurn: true })
      let items = res
      if (items.statusCode === 200) {
        if (wx.getStorageSync('goodsCheckedSelectId')) {
          wx.removeStorageSync('goodsCheckedSelectId')
        }
        if (wx.getStorageSync('tenantOrders')) {
          wx.removeStorageSync('tenantOrders')
        }
        // 删除购物车
        let detailId = that.data.detailId
        HttpService.post('/gos/api/shopping-carts/ids', detailId).then(res => {
          if (res.statusCode === 200) {
          }
        })
        if (items.data.actualPayment != subTotal) {
          wx.showModal({
            title: '提示',
            content: '商品价格变动，是否确认支付？',
            success (res) {
              if (res.confirm) {
                that.wxPayment(items)
              } else if (res.cancel) {
                wx.navigateBack({
                  delta: 1
                })
                return
              }
            }
          })
        } else {
          that.wxPayment(items)
        }
      } else if (res.statusCode === 400) {
        this.setData({ payTurn: false })
        if (res.data.message) {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
              }
            },
            complete: res => {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '网路发生了点小状况，请重新提交订单！',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
              }
            },
            complete: res => {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      } else {
        this.setData({ payTurn: false })
      }
    }).catch(error => {
      this.setData({ payTurn: false })
    })
  },
  wxPayment (res) {
    let that = this
    let prepayId = res.data.prepayId
    let orderId = res.data.id
    let actualPayment = res.data.actualPayment
    HttpService.get('/pay/api/tradeSeting/prepayIdSign?prepayId=' + prepayId).then(e => {
      wx.setStorageSync('formPay',true)
      wx.requestPayment({
        timeStamp: e.data.timeStamp,
        nonceStr: e.data.nonceStr,
        package: e.data.package,
        signType: e.data.signType,
        paySign: e.data.paySign,
        success: function (res) {
          wx.showLoading({
            title: '加载中',
            mask: true
          })
          let count = 10
          let timer = setInterval(() => {
            count--
            HttpService.get('/ord/api/orders/checkPay?orderId=' + orderId).then(e => {
              that.setData({ payTurn: false })
              if ((e.statusCode === 200 && e.data) || count === 0) {
                wx.hideLoading()
                clearInterval(timer)
                wx.redirectTo({
                  url: '../payResult/payResult?orderId=' + orderId + '&payResult=' + e.data + '&fanelPrice=' + actualPayment + '&prepayId=' + prepayId
                })
              }
            })
          }, 2000)
        },
        fail: function (res) {
          that.setData({ payTurn: false })
          HttpService.get('/ord/api/orders/checkPay?orderId=' + orderId).then(e => {
            if (e.statusCode === 200) {
              wx.redirectTo({
                url: '../payResult/payResult?orderId=' + orderId + '&payResult=' + e.data + '&fanelPrice=' + actualPayment + '&prepayId=' + prepayId
              })
            }
          })
        },
      })
    }).catch(error => {
      this.setData({ payTurn: false })
      wx.showModal({
        title: '提示',
        content: res.data.message,
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        },
        complete: res => {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    })
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 100)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 100)
  },
  tabChange: function (e) {
    this.setData({ currentDate: e.currentTarget.dataset.index })
  },
  chooseDate: function (e) {
    this.setData({
      currentTime: {
        index: e.currentTarget.dataset.index,
        parentIndex: e.currentTarget.dataset.parentindex
      }
    })
    this.hideModal()
  },
  onUnload: function () {
    if (wx.getStorageSync('address')) {
      wx.removeStorageSync('address')
    }
    if (wx.getStorageSync('couponAmount')) {
      wx.removeStorageSync('couponAmount')
    }
  },
  // 两个浮点数求和
  accAdd: function (num1, num2) {
    var r1, r2, m;
    try {
      r1 = num1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = num2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    // return (num1*m+num2*m)/m;
    return Math.round(num1 * m + num2 * m) / m;
  },
  // 两个浮点数相减
  accSub: function (num1, num2) {
    var r1, r2, m, n;
    try {
      r1 = num1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = num2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return (Math.round(num1 * m - num2 * m) / m).toFixed(n);
  },
  // 两个浮点数相除
  accDiv: function (num1, num2) {
    var t1, t2, r1, r2;
    try {
      t1 = num1.toString().split('.')[1].length;
    } catch (e) {
      t1 = 0;
    }
    try {
      t2 = num2.toString().split(".")[1].length;
    } catch (e) {
      t2 = 0;
    }
    r1 = Number(num1.toString().replace(".", ""));
    r2 = Number(num2.toString().replace(".", ""));
    return (r1 / r2) * Math.pow(10, t2 - t1);
  },
  // 两个浮点数相乘
  accMul: function (num1, num2) {
    var m = 0, s1 = num1.toString(), s2 = num2.toString();
    try { m += s1.split(".")[1].length } catch (e) { };
    try { m += s2.split(".")[1].length } catch (e) { };
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
  }
})