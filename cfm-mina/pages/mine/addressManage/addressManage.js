// pages/mine/addressManage/addressManage.js
import HttpService from '../../../utils/http.js'
import Util from '../../../utils/util.js'
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  data: {
    mode:'',
    items: [],
    startX: 0, //开始坐标
    startY: 0,
    checked: -1,
    location: {},
    backUrl: ''
  },
  onLoad: function (option) {
    if (option.manage){
      this.setData({ manage: option.manage })
    }
    if (option.addressId){
      this.setData({ addressId: option.addressId })
    }
    if (option.currentPage){
      this.setData({ currentPage: option.currentPage})
    }
    if (option.mode) {
      this.setData({
        mode: option.mode
      })
    }
    if (option.backUrl) {
      this.setData({
        backUrl: option.backUrl
      })
    }
    wx.setNavigationBarTitle({ title: '收货地址' })
    this.setData({
      items: this.data.items
    })
    // this.loadAddress()
  },
  // onShareAppMessage: function (ops) {
  //   if (ops.from === 'button') {
  //     console.log(ops.target)
  //   }
  //   return {
  //     title: '满天星生活广场',
  //     path: 'pages/authorize/index/index',
  //     success: function (res) {
  //       // 转发成功
  //       wx.showToast({
  //         title: '转发成功',
  //         icon: 'success',
  //         duration: 2000
  //       })
  //     },
  //     fail: function (res) {
  //       // 转发失败
  //       wx.showToast({
  //         title: '转发失败',
  //         duration: 2000
  //       })
  //     }
  //   }
  // },
  checkAddress:function(){
    var items = this.data.items
    for (var i = 0; i < this.data.items.length;i++){
      if (this.data.items[i].projectManagementId == wx.getStorageSync('projectManagementId')){
        this.data.items[i].showAddress=false
      }else{
        this.data.items[i].showAddress = true
      }
    }
    this.setData({ items: items})
  },
  clickRadio: function (e) {
    if (!this.data.manage){
      var that = this;
      that.setData({
        checked: e.currentTarget.dataset.num
      })
      var itemList = this.data.items
      for (let i in itemList){
        itemList[i].checkedR = false
      }
      itemList[e.currentTarget.dataset.num].checkedR = true
      that.setData({
        items: itemList
      })
      var address = this.data.items[this.data.checked]
      wx.setStorageSync('address', address)
      // var location = wx.getStorageSync('location')
      // location.address = address.address + ' ' + address.streetNumber
      // location.isInside = true
      // wx.setStorageSync('location', location)
      wx.setStorageSync('projectManagementId', address.projectManagementId)
      var currentMall = wx.getStorageSync('marketConfigsAll').filter(item => {
        return item.projectManagementId == address.projectManagementId
      })[0]
      var distance = Util.getFlatternDistance(address.lat, address.lng, currentMall.lat, currentMall.lng).toFixed(1)
      wx.setStorageSync('shopPosition', { isShow: true, distance: distance })
      wx.navigateBack({
        delta: 1
      })
      // HttpService.put('/ocs/api/addresses/default/' + address.id).then(res => {
      //   var prePage = getCurrentPages()[1]
      //   prePage.onLoad(prePage.options)
      //   wx.navigateBack({
      //     delta: 1
      //   })
      // })
    }
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.items.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: this.data.items
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    if (this.data.mode == 'choose') {
      return
    }
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY }   );
    that.data.items.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      items: that.data.items
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    var index = e.currentTarget.dataset.index
    var targetAddress = this.data.items[index]
    var _this = this
    Dialog.confirm({
      title: '提示',
      message: '确认删除该地址?',
    })
    .then(() => {
      HttpService.delete('/ord/api/addresss/' + targetAddress.id).then(res => {
        var address = wx.getStorageSync('address')
        if (address.id == targetAddress.id) {
          wx.removeStorageSync('address')
        }
        _this.data.items.splice(index, 1)
        _this.setData({
          items: _this.data.items
        })
      })
    })
    .catch(() => {
      // on cancel
    })
  },
  edit (e) {
    var index = e.currentTarget.dataset.index
    var id = this.data.items[index].id
    wx.navigateTo({
      url: '../addAddress/addAddress?id=' + id
    })
  },
  toAddAddress:function(){
    wx.navigateTo({
      url: '../addAddress/addAddress'
    })
  },
  //加载数据
  loadAddress: function () {
    var that=this
    HttpService.get('/ord/api/addresss/all').then(res => {
      if (!Array.isArray(res.data)) return
      var projectManagementId = wx.getStorageSync('projectManagementId')
      var addId = this.data.addressId
  
      this.setData({
        items: res.data
      })
      for (let i in res.data) {
        res.data[i].checkedR = false
        if (res.data[i].projectManagementId == projectManagementId && res.data[i].id == addId) {
          // res.data[i].checkedR = true
          this.defaultClick(res.data[i].id)
        }
      }
      if (this.data.currentPage){
        this.checkAddress()
      }
    })
  },
  defaultClick: function (checked) {
    var itemList = this.data.items
    for (let i in itemList) {
      itemList[i].checkedR = false
      if (itemList[i].id == checked) {
        itemList[i].checkedR = true
        var address = itemList[i]
      }
    }
    this.setData({
      items: itemList
    })
    wx.setStorageSync('address', address)
    wx.setStorageSync('projectManagementId', address.projectManagementId)
    var currentMall = wx.getStorageSync('marketConfigsAll').filter(item => {
      return item.projectManagementId == address.projectManagementId
    })[0]
    var distance = Util.getFlatternDistance(address.lat, address.lng, currentMall.lat, currentMall.lng).toFixed(1)
    wx.setStorageSync('shopPosition', { isShow: true, distance: distance })
    // HttpService.put('/ocs/api/addresses/default/' + address.id).then(res => {
    // })
  },
  onShow:function(){
    // HttpService.get('/bdm/api/business-districts/all').then(res => {
    //   wx.setStorageSync('mall', res.data)
    //   this.loadAddress()
    // }) 
    this.loadAddress()
  }
})
