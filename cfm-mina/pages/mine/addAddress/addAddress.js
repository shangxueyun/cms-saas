// pages/mine/addAddress/addAddress.js
import HttpService from '../../../utils/http.js'
import Util from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipShow: false,
    tip: '',
    address: {
      isInside: false,
      checked: true,
      contactPerson: '',
      contactNumber: '',
      streetNumber: '',
      address: '',
      onDefault: false,
      lat: '',
      lng: '',
      sex: '',
      activated: false,
      projectManagementId: ''
    },
    map: {
      polyline: [{
        points: [],
        color: "#FF0000DD",
        width: 2,
        dottedLine: true
      }]
    },
    switch1Checked: false,
    mall: {
      name: '选择配送菜场'
    },
    malls: [],
    distributionScope: [],
    distributionScopesIndex:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var account = wx.getStorageSync('account')
    this.setData({
      'address.userId': account.id
    })
    if (option.id) {
      wx.setNavigationBarTitle({
        title: '编辑地址'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '新增地址'
      })
    }
    this.loadMarketConfigs(option.id)
    
    var that = this;
    // wx.getLocation({
    //   type: 'gcj02',
    //   success: function (res) {
    //     that.setData({
    //       ldata: true
    //     })
    //   },
    //   fail: function (res) {
    //     that.setData({
    //       ldata: false
    //     })
    //   }
    // })

    let projectManagementId = wx.getStorageSync('projectManagementId')
    let address = this.data.address
    address.projectManagementId = wx.getStorageSync('projectManagementId')
    this.setData({address})
    this.loadDistributionScope(projectManagementId)
  },
  setTip: function (tip) {
    this.setData({
      tip: tip,
      tipShow: true
    })
  },
  clearTip: function () {
    this.setData({
      tip: '',
      tipShow: false
    })
  },
  checkContactPerson: function (e) {
    if (e.detail.value.length == 0) {
      this.setTip('联系人不能为空！')
    } else {
      this.clearTip()
    }
    // console.log(this.data.address)
    return !this.data.tipShow
  },
  checkContactNumber: function (e) {
    var contactNumber = e.detail.value
    if (contactNumber.length == 0) {
      this.setTip('手机号不能为空！')
    } else if (!contactNumber.match(/^1[0-9]{10}$/)) {
      this.setTip('手机号格式不正确！')
    } else {
      this.clearTip()
    }
    return !this.data.tipShow
  },
  checkedAddress: function (e) {
    if (e.detail.value.length == 0) {
      this.setTip('请选择收货地址!')
    } else {
      this.clearTip()
    }
    return !this.data.tipShow
  },
  checkBuildingNumber: function (e) {
    if (e.detail.value.length == 0) {
      this.setTip('楼栋不能为空！')
    } else if (e.detail.value.match(/[^\w_]/g)) {
      this.setTip('楼栋格式错误！')
    } else {
      this.clearTip()
    }
    return !this.data.tipShow
  },
  checkStreetNumber: function (e) {
    if (e.detail.value.length == 0) {
      this.setTip('门牌号不能为空！')
    } else if (e.detail.value.match(/[^\w_]/g)) {
      this.setTip('门牌号格式错误！')
    } else {
      this.clearTip()
    }
    return !this.data.tipShow
  },
  loadMarketConfigs(optionId) {
    HttpService.get('/ord/api/marketConfigsAll').then(res => {
      if (res.statusCode === 200) {
        this.setData({
          malls: res.data
        })
        if (optionId) {
          this.loadAddressDetails(optionId)
        } else {
          // 新增地址
          const resData = this.data.malls.filter((item, index) => {
            return item.projectManagementId === wx.getStorageSync('projectManagementId')
          })
          // this.setPolyline(resData[0].marketDistributionScopes)
          this.setData({
            mall: resData[0],
            'address.projectManagementId': resData[0].projectManagementId,
            'map.longitude': resData[0].lng,
            'map.latitude': resData[0].lat,
            'map.markers': [{
              iconPath: "/img/mine/location.png",
              id: 0,
              latitude: resData[0].lat,
              longitude: resData[0].lng,
              width: 50,
              height: 50
            }],
          })
        }
      }
    })
  },
  // 编辑地址
  loadAddressDetails (optionId) {
    HttpService.get('/ord/api/addresss/' + optionId).then(res => {
      this.setData({
        address: res.data,
        addressOld: res.data,
        switch1Checked: res.data.onDefault
      })
      if (res.data.projectManagementId) {
        const resData = this.data.malls.filter((item, index) => {
          return item.projectManagementId === res.data.projectManagementId
        })
        // this.setPolyline(resData[0].marketDistributionScopes)
        // this.checkAddress(this.data.address, resData[0].marketDistributionScopes)

        this.setData({
          mall: resData[0],
          'map.longitude': resData[0].lng,
          'map.latitude': resData[0].lat,
          'map.markers': [{
            iconPath: "/img/mine/location.png",
            id: 0,
            latitude: resData[0].lat,
            longitude: resData[0].lng,
            width: 50,
            height: 50
          }],
        })
      }
    })
  },
  loadDistributionScope (optionId) {
    let distributionScopes = []
    HttpService.get('/ord/api/marketConfigs/distributionScope/' ,{projectManagementId:optionId} ).then(res => {
      if (res.statusCode === 200) {
        distributionScopes = res.data
        this.setData({
          distributionScopes,
        })
      }
    })
  },
  // bindPickerChange(e) {
  //   var index = e.detail.value
  //   const resData = this.data.malls[index].marketDistributionScopes
  //   this.setPolyline(resData)
  //   this.setData({
  //     mall: this.data.malls[index],
  //     'map.longitude': this.data.malls[index].lng,
  //     'map.latitude': this.data.malls[index].lat,
  //     'address.projectManagementId': this.data.malls[index].projectManagementId,
  //     'map.markers': [{
  //       iconPath: "/img/mine/location.png",
  //       id: 0,
  //       latitude: this.data.malls[index].lat,
  //       longitude: this.data.malls[index].lng,
  //       width: 50,
  //       height: 50
  //     }],
  //   })
  //   this.checkAddress(this.data.address, resData)
  // },
  bindPickerAddress(e) {
    var index = e.detail.value
    const resData = this.data.distributionScopes[index]
    this.setData({
      'address.address': resData.poiname,
      'address.lat': resData.lat,
      'address.lng': resData.lng,
      'address.projectManagementId': resData.marketConfig.projectManagementId,
    })
  },
  //表单验证
  formBindsubmit: function (e) {
    if (e.detail.value.contactPerson.length == 0) {
      this.setData({
        tip: '联系人不能为空！',
        tipShow: true
      })
    } 
    // else if (!this.data.mall.projectManagementId) {
    //   this.setData({
    //     tip: '请选择配送菜场！',
    //     tipShow: true
    //   })
    // } 
    else if (e.detail.value.contactNumber.length == 0) {
      this.setData({
        tip: '手机号不能为空！',
        tipShow: true
      })
    } else if (!e.detail.value.contactNumber.match(/^1[0-9]{10}$/)) {
      this.setData({
        tip: '手机号格式不正确！',
        tipShow: true
      })
    } else if (this.data.address.address.length == 0) {
      this.setData({
        tip: '请选择收货地址!',
        tipShow: true
      })
    } else if (e.detail.value.buildingNumber.length == 0) {
      this.setData({
        tip: '楼栋不能为空！',
        tipShow: true
      })
    } else if (e.detail.value.buildingNumber.match(/[^\w_]/g)) {
      this.setData({
        tip: '楼栋格式错误！',
        tipShow: true
      })
    } else if (e.detail.value.streetNumber.length == 0) {
      this.setData({
        tip: '门牌号不能为空！',
        tipShow: true
      })
    } else if (e.detail.value.streetNumber.match(/[^\w_]/g)) {
      this.setData({
        tip: '门牌号格式错误！',
        tipShow: true
      })
    } 
    // else if (!this.data.address.isInside) {
    //   this.setData({
    //     tip: '所选地址不在该菜场配送范围',
    //     tipShow: true
    //   })
    // } 
    else {
      this.setData({
        tip: '',
        tipShow: false,
        'address.contactPerson': e.detail.value.contactPerson,
        'address.contactNumber': e.detail.value.contactNumber,
        'address.buildingNumber': e.detail.value.buildingNumber,
        'address.streetNumber': e.detail.value.streetNumber
      })
      this.loadAddress()
    }

  },
  //加载数据
  loadAddress: function () {
    if (this.data.address.id) {
      if (this.data.addressOld.address !== this.data.address.address || 
        this.data.addressOld.contactNumber !== this.data.address.contactNumber || 
        this.data.addressOld.contactPerson !== this.data.address.contactPerson || 
        this.data.addressOld.streetNumber !== this.data.address.streetNumber ||
        this.data.addressOld.projectManagementId !== this.data.address.projectManagementId || 
        this.data.addressOld.onDefault !== this.data.address.onDefault) {
        var addressCurrent = this.data.address
        this.setData({
          address: addressCurrent
        })
      }
      HttpService.put('/ord/api/addresss', this.data.address).then(res => {
        var address = wx.getStorageSync('address')
        if (address.id == this.data.address.id) {
          wx.setStorageSync('address', res.data)
        }
        wx.navigateBack();
      })
    } else {
      HttpService.post('/ord/api/addresss', this.data.address).then(res => {
        wx.navigateBack();
      })
    }
  },
  btnTap(e) {
    var that = this
    // wx.chooseLocation({
    //   success: function (data) {
    //     if (data.address == data.name) {
    //       data.name = ''
    //     }
    //     that.setData({
    //       'address.address': data.address + ' ' + data.name,
    //       'address.lat': data.latitude,
    //       'address.lng': data.longitude
    //     })
    //     if (that.data.mall.projectManagementId) {
    //       const resData = that.data.malls.filter((item, index) => {
    //         return item.projectManagementId === that.data.mall.projectManagementId
    //       })
    //       // that.checkAddress(that.data.address, resData[0].marketDistributionScopes)
    //     }
    //   }
    // })
  },
  // mapLocate: function (e) {
  //   var that = this
  //   if (!e.detail.authSetting['scope.userLocation']) {
  //     that.setData({
  //       ldata: false
  //     })
  //   } else {
  //     that.setData({
  //       ldata: true,
  //     })
  //     wx.chooseLocation({
  //       success: function (data) {
  //         if (data.address == data.name) {
  //           data.name = ''
  //         }
  //         that.setData({
  //           'address.address': data.address + ' ' + data.name,
  //           'address.lat': data.latitude,
  //           'address.lng': data.longitude
  //         })
  //         if (that.data.mall.projectManagementId) {
  //           const resData = that.data.malls.filter((item, index) => {
  //             return item.projectManagementId === that.data.mall.projectManagementId
  //           })
  //           that.checkAddress(that.data.address, resData[0].marketDistributionScopes)
  //         }
  //       }
  //     })
  //   }
  // },
  regionchange: function (e) {},
  // setPolyline: function (scopeData) {
  //   var polyline = this.data.map.polyline
  //   polyline[0].points = []
  //   scopeData.forEach(point => {
  //     polyline[0].points.push({
  //       latitude: point.lat,
  //       longitude: point.lng
  //     })
  //   })
  //   polyline[0].points.push(polyline[0].points[0])
  //   this.setData({
  //     'map.polyline': polyline,
  //     'map.include-points': polyline[0].points
  //   })
  // },
  checkAddress: function (p, points) {
    if (!p.lat) {
      return
    }
    var isInside = Util.isInside(p, points)
    if (!isInside) {
      this.setData({
        tip: '所选地址不在菜场配送范围',
        tipShow: true,
        'address.isInside': false
      })
    } else {
      this.setData({
        tip: '',
        tipShow: false,
        'address.isInside': true
      })
    }
  },
  switch1Change(e) {
    // console.log(e)
    this.data.address.onDefault = e.detail.value
  }
})