/*
 * @Descripttion:
 * @version:
 * @Author: Pedia.Xu
 * @Date: 2021-08-05 18:30:07
 * @LastEditors: Pedia.Xu
 * @LastEditTime: 2021-10-12 11:36:30
 */

import HttpService from '../../../utils/http.js'
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'

var shoppingCar, goodsChecked, goodsCheckedTurn, shopPrice, blanceTurn
const app = getApp()
let userData = {}
Page({
  data: {
    conShopping: false,
    projectManagementId: wx.getStorageSync('projectManagementId'),
    shoppingCar: [],
    goodsChecked: [],
    allCheckedTurn: false,
    totalPrice: 0,
    shopPrice: [],
    isShowDel: [],
    transport: 0,
    changeTurn: false,
    yzmTurn: true,
    bindPhoneTurn: false,
    bindPhoneErrTip: '',
    invalidationGoods: [],
    goodsNumber: 0,
    showDiscount: true,
    discountAmount: 0,
    totaldiscount: 0,
    invalGoodsLength: 0,
    goodsCheckedSelectId: [],
    loadCar: true,
    startGiveFee: 0,
    tagPrice: '去结算',
    hasUserInfo: false,
    userInfo: {},
    countNum: 10,
  },
  onLoad: function (options) {
    if (wx.getStorageSync('projectManagementId')) {
      this.setData({
        projectManagementId: wx.getStorageSync('projectManagementId')
      })
    }
    if (wx.getStorageSync('startGiveFee')) {
      this.setData({
        startGiveFee: wx.getStorageSync('startGiveFee')
      })
    }
  },
  onShow: function () {
    this.loadUserInfo()
    this.loadShoppingCar()
  },
  async goBalance () {
    return
    if (!this.data.userInfo.facialPhoto) {
      wx.navigateTo({
        url: '/pages/mine/accredit/accredit',
      })
      return
    }

    let totalPrice = this.data.totalPrice
    let startGiveFee = this.data.startGiveFee
    if (totalPrice < startGiveFee) {
      let spread = this.accSub(startGiveFee, totalPrice)
      wx.showToast({
        title: `差${spread}元起送`,
        icon: 'none',
        duration: 1500
      })
      return
    }
    wx.setStorageSync('goodsCheckedSelectId', this.data.goodsCheckedSelectId)
    let resData = await this.reloadShoppingCar()
    this.setData({ shoppingCar: resData })
    this.reGoodsCheckedTurn()
    var tenantOrders = []
    let disgoods = this.data.shoppingCar.expier
    let goods = this.data.shoppingCar.valid
    let goodsCheckedTurn = this.data.goodsCheckedTurn

    let disgoodsId = false
    disgoods.forEach(ite => {
      if (!disgoodsId) {
        disgoodsId = this.data.goodsCheckedSelectId.some(item => {
          return item === ite.goodsId
        })
      } else {
        return
      }
    })
    if (disgoodsId) {
      disgoods.forEach(item => {
        let index = this.data.goodsCheckedSelectId.indexOf(item.goodsId)
        if (index !== -1) {
          this.data.goodsCheckedSelectId.splice(index, 1)
        }
      })
      wx.showToast({
        title: '勾选商品存在已失效商品！',
        icon: 'none',
        duration: 1500
      })
      return
    }

    let controlItem = true
    if (goodsCheckedTurn && goodsCheckedTurn.length > 0) {
      goodsCheckedTurn.forEach(item => {
        item.goodsTurn.forEach(item => {
          item ? controlItem = false : null
          if (!controlItem) {
            return
          }
        })
      })
    }
    if (controlItem) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none',
        duration: 1500
      })
      return
    }

    var detailId = []
    for (var k = 0; k < this.data.goodsCheckedTurn.length; k++) {
      var details = []
      for (var l = 0; l < this.data.goodsCheckedTurn[k].goodsTurn.length; l++) {
        if (this.data.goodsCheckedTurn[k].goodsTurn[l]) {
          let goodsTotal = this.accMul(goods[k].shoppingCart[l].price, goods[k].shoppingCart[l].salesNum)
          details.push({
            goodsName: goods[k].shoppingCart[l].goodsName,
            goodsNumber: goods[k].shoppingCart[l].goodsCode,
            goodsPrice: goods[k].shoppingCart[l].price,
            goodsSpecification: goods[k].shoppingCart[l].specification,
            goodsSpecificationUnit: goods[k].shoppingCart[l].unitName,
            imageUrl: goods[k].shoppingCart[l].imgUrl,
            number: goods[k].shoppingCart[l].salesNum,
            primaryPrice: goods[k].shoppingCart[l].resourcePrice || null,
            showDiscount: goods[k].shoppingCart[l].showDiscount,
            goodsTotal: goodsTotal
          })
          detailId.push({
            id: goods[k].shoppingCart[l].id
          })
        }
      }
      if (details && details.length > 0) {
        let shopTotal = 0
        details.map(item => {
          shopTotal = this.accAdd(shopTotal, item.goodsTotal)
        })
        tenantOrders.push({
          details: details,
          remark: '',
          projectManagementId: this.data.projectManagementId,
          tenantId: goods[k].tenantId,
          tenantReferred: goods[k].tenantName,
          totalFee: shopTotal,
          actualPayment: shopTotal,
          // tenantImageUrl:
        })
      }
    }
    console.log(tenantOrders)
    wx.setStorageSync('tenantOrders', JSON.stringify(tenantOrders))
    wx.setStorageSync('detailId', JSON.stringify(detailId))
    wx.setStorageSync('goodsCheckedSelectId', this.data.goodsCheckedSelectId)
    wx.navigateTo({
      url: '../editOrder/editOrder?totalPrice=' + this.data.totalPrice
    })
  },
  async loadUserInfo () {
    let info
    let countNum = this.data.countNum
    let res = await HttpService.get('/uaa/api/users/wx')
    countNum--
    this.setData({ countNum })
    if (res.statusCode === 401 && countNum >= 0) {
      this.loadUserInfo()
    } else if (res.statusCode === 200) {
      info = res.data
      this.setData({
        userInfo: info,
        hasUserInfo: true,
        // imageUrl: info.facialPhoto,
        // name: info.name
      })
    }
  },
  reGoodsCheckedTurn () {
    let goodsCheckedSelectId = this.data.goodsCheckedSelectId
    let goodsCheckedTurn = []
    this.data.shoppingCar.valid.forEach((item, index) => {
      goodsCheckedTurn.push({ shopTurn: false, goodsTurn: [] })
      goodsCheckedTurn[index].shopTurn = false
      item.shoppingCart.forEach((e, ind) => {
        goodsCheckedTurn[index].goodsTurn[ind] = false
        let id = e.goodsId
        if (id && goodsCheckedSelectId.indexOf(id) !== -1) {
          goodsCheckedTurn[index].goodsTurn[ind] = true
        }
      })
    })
    goodsCheckedTurn.forEach((item, index) => {
      let turn = item.goodsTurn.every(e => {
        return e === true
      })
      if (turn) {
        goodsCheckedTurn[index].shopTurn = true
      }
    })
    this.setData({
      goodsCheckedTurn: goodsCheckedTurn
    })
    this.reckonPrice()
  },
  async reloadShoppingCar () {
    const res = await HttpService.get('/gos/api/shopping-carts/ByUserAll', { projectManagementId: this.data.projectManagementId })
    if (res.statusCode == 200) {
      return res.data
    }
  },
  loadShoppingCar: function () {
    if (wx.getStorageSync('goodsCheckedSelectId')) {
      this.setData({
        goodsCheckedSelectId: wx.getStorageSync('goodsCheckedSelectId')
      })
    } else {
      this.setData({
        goodsCheckedSelectId: []
      })
    }
    let goodsCheckedTurn = []
    let goodsCheckedSelectId = this.data.goodsCheckedSelectId
    let resData = {}
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    HttpService.get('/gos/api/shopping-carts/ByUserAll', { projectManagementId: this.data.projectManagementId }).then(res => {
      wx.hideLoading()
      if (res.statusCode === 200) {
        this.setData({
          shoppingCar: res.data
        })
      }
      let allChecked = true
      this.data.shoppingCar.valid.forEach((item, index) => {
        goodsCheckedTurn.push({ shopTurn: false, goodsTurn: [] })
        goodsCheckedTurn[index].shopTurn = false
        item.shoppingCart.forEach((e, ind) => {
          goodsCheckedTurn[index].goodsTurn[ind] = false
          let id = e.goodsId
          if (id && goodsCheckedSelectId.indexOf(id) !== -1) {
            goodsCheckedTurn[index].goodsTurn[ind] = true
          } else if (goodsCheckedSelectId.indexOf(id) === -1) {
            allChecked = false
          }
        })
      })
      this.data.shoppingCar.valid.length === 0 ? allChecked = false : null
      goodsCheckedTurn.forEach((item, index) => {
        let turn = item.goodsTurn.every(e => {
          return e === true
        })
        if (turn) {
          goodsCheckedTurn[index].shopTurn = true
        }
      })
      this.setData({
        goodsCheckedTurn: goodsCheckedTurn,
        allCheckedTurn: allChecked
      })
      this.reckonPrice()
    }).catch(error => {
    })
  },
  delInvalidGoods () {
    var that = this
    wx.showModal({
      title: '温馨提示',
      content: '您确定清空失效商品？',
      success: res => {
        if (res.confirm) {
          let obj = {}
          let expier = that.data.shoppingCar.expier
          HttpService.post('/gos/api/shopping-carts/ids', expier).then(res => {
            if (res.statusCode == 200) {
              wx.setStorageSync('goodsCheckedSelectId', that.data.goodsCheckedSelectId)
              // wx.setStorageSync('allCheckedTurn', that.data.allCheckedTurn)
              that.loadShoppingCar()
            }
          })
        } else if (res.cancel) {
        }
      }
    })
    return
  },
  shopDel: function (e) {
    var item = e.currentTarget.dataset.item
    wx.showModal({
      title: '温馨提示',
      content: '清空购物车中所有商品？',
      success: res => {
        if (res.confirm) {
          HttpService.delete('/gos/api/shopping-carts/deleteShoppingCartByTenantId?tenantId=' + item.tenantId + '&projectManagementId=' + this.data.projectManagementId).then(res => {
            if (res.statusCode == 200) {
              let goodsCheckedSelectId = this.data.goodsCheckedSelectId
              item.shoppingCart.forEach(ite => {
                if (goodsCheckedSelectId.indexOf(ite.goodsId) !== -1) {
                  goodsCheckedSelectId.splice(goodsCheckedSelectId.indexOf(ite.goodsId), 1)
                }
              })
              this.setData({ goodsCheckedSelectId })
              wx.setStorageSync('goodsCheckedSelectId', this.data.goodsCheckedSelectId)
              if (goodsCheckedSelectId.length === 0) {
                this.setData({ allCheckedTurn: false })
              }
              this.loadShoppingCar()
            }
          })
        } else if (res.cancel) {
        }
      }
    })
  },
  plus: function (e) {
    var shopIndex = e.currentTarget.dataset.shopindex - 0
    var index = e.currentTarget.dataset.index - 0
    var good = this.data.shoppingCar.valid[shopIndex].shoppingCart[index]
    let lineStock = good.lineStock
    let salesNum = good.salesNum
    if (salesNum >= lineStock) {
      wx.showToast({
        title: '购买数量超出范围',
        icon: 'none',
        duration: 1500
      })
      return
    }
    // if (this.data.changeTurn || !good.onSale) return
    this.changeShopCar(index, shopIndex, true)
  },
  reduce: function (e) {
    var shopIndex = e.currentTarget.dataset.shopindex - 0
    var index = e.currentTarget.dataset.index - 0
    var good = this.data.shoppingCar.valid[shopIndex].shoppingCart[index]
    var that = this
    if (good.salesNum === 1) {
      // 删除单个购物车单个商品
      wx.showModal({
        title: '提示',
        content: '确认删除当前商品？',
        success: function (res) {
          if (res.confirm) {
            that.changeShopCar(index, shopIndex, false)
          }
        }
      })
    } else {
      this.changeShopCar(index, shopIndex, false)
    }
  },
  getShoppingCar () {
    HttpService.get('/gos/api/shopping-carts/ByUserAll', { projectManagementId: this.data.projectManagementId }).then(res => {
      if (res.statusCode === 200) {
        this.setData({
          shoppingCar: res.data
        })
        this.reckonPrice()
      }
    }).catch(error => {
    })
  },
  changeShopCar: function (index, shopIndex, bol) {
    let good = this.data.shoppingCar.valid[shopIndex].shoppingCart[index]
    let goodsId = good.goodsId
    let that = this
    if (bol) {
      // 新增
      good.value = 1
    } else {
      // 减少
      good.value = -1
    }
    HttpService.post('/gos/api/shopping-carts/updateShoppingCarts', good).then(res => {
      if (res.statusCode === 201) {
        // 减购物车 且 购物车商品只剩一个 去除 已选中问题
        if (!bol && good.salesNum === 1) {
          that.data.goodsCheckedTurn[shopIndex].goodsTurn.splice(index, 1);
          let ind = that.data.goodsCheckedSelectId.indexOf(goodsId)
          if (ind !== -1) {
            that.data.goodsCheckedSelectId.splice(ind, 1)
          }
          wx.setStorageSync('goodsCheckedSelectId', that.data.goodsCheckedSelectId)
        }
        this.setData({
          goodsCheckedTurn: this.data.goodsCheckedTurn
        })
        if (this.data.goodsCheckedSelectId.length === 0) {
          this.setData({ allCheckedTurn: false })
        }
        this.data.shoppingCar.valid.forEach((item, shopIdx) => {
          if (shopIndex === shopIdx) {
            item.shoppingCart.forEach((items, idx) => {
              if (idx === index) {
                items.salesNum = res.data.salesNum
              }
            })
          }
        })
        this.loadShoppingCar()

      } else if (res.statusCode === 400) {
        Toast.fail(res.data.message)
      }
    }).catch(error => {
      // this.setData({ changeTurn: false })
      wx.showModal({
        title: '温馨提示',
        content: '网络出现了一点问题',
        showCancel: false
      })
    })
  },
  showDel: function (e) {
    var index = e.currentTarget.dataset.index - 0
    var arr = this.data.isShowDel
    arr[index] = !arr[index]
    this.setData({
      isShowDel: arr
    })
  },
  reckonPrice: function () {
    let startGiveFee = this.data.startGiveFee
    var allTotal = 0
    var goodsNumber = 0
    let goodsCheckedTurn = this.data.goodsCheckedTurn
    goodsCheckedTurn.forEach((shopItem, shopIndex) => {
      var total = 0
      shopItem.goodsTurn.forEach((goodsItem, goodsIndex) => {
        if (goodsItem) {
          var goods = this.data.shoppingCar.valid[shopIndex].shoppingCart[goodsIndex]
          // 总价 = 已勾选总价 + （商品单价*商品数量）
          total = this.accAdd(total, this.accMul(goods.price, goods.salesNum))
          goodsNumber++
        }
      })
      allTotal = this.accAdd(allTotal, total)
    })
    allTotal = allTotal
    let tagPrice = '去结算'
    if (allTotal < startGiveFee) {
      let spread = this.accSub(startGiveFee, allTotal)
      tagPrice = `差${spread}元起送`
    }
    this.setData({
      totalPrice: allTotal,
      tagPrice
    })
  },
  checkedGoods: function (e) {
    var shopIndex = e.currentTarget.dataset.shopindex - 0
    var index = e.currentTarget.dataset.index - 0
    var goods = e.currentTarget.dataset.goods
    var id = goods.goodsId
    var goodsCheckedSelectId = this.data.goodsCheckedSelectId
    var spliceIndex = goodsCheckedSelectId.indexOf(id)
    var goodsCheckedTurn = this.data.goodsCheckedTurn
    var arr = goodsCheckedTurn[shopIndex].goodsTurn
    if (arr[index]) {
      arr[index] = false
      if (spliceIndex !== -1) {
        goodsCheckedSelectId.splice(spliceIndex, 1)
      }
    } else {
      arr[index] = true
      if (spliceIndex === -1) {
        goodsCheckedSelectId.push(id)
      }
    }
    goodsCheckedTurn[shopIndex].goodsTurn = arr
    if (this.isShopAllChecked(shopIndex)) {
      goodsCheckedTurn[shopIndex].shopTurn = true
    } else {
      goodsCheckedTurn[shopIndex].shopTurn = false
    }
    this.setData({
      goodsCheckedTurn: goodsCheckedTurn,
      goodsCheckedSelectId: goodsCheckedSelectId
    })
    wx.setStorageSync('goodsCheckedSelectId', this.data.goodsCheckedSelectId)
    if (this.isAllChecked()) {
      this.setData({
        allCheckedTurn: true
      })
    } else {
      this.setData({
        allCheckedTurn: false
      })
    }
    this.reckonPrice()
  },
  shopChecked: function (e) {
    var index = e.currentTarget.dataset.index - 0
    let shoppingCart = this.data.shoppingCar.valid[index].shoppingCart
    let goodsCheckedTurn = this.data.goodsCheckedTurn
    let goodsCheckedSelectId = this.data.goodsCheckedSelectId
    if (!shoppingCart.length) {
      return
    }
    if (goodsCheckedTurn[index].shopTurn) {
      goodsCheckedTurn[index].shopTurn = false
      goodsCheckedTurn[index].goodsTurn.forEach((item, idx) => {
        goodsCheckedTurn[index].goodsTurn[idx] = false
      })
      shoppingCart.forEach(item => {
        let id = item.goodsId
        let spliceIndex = goodsCheckedSelectId.indexOf(id)
        if (spliceIndex !== -1) {
          goodsCheckedSelectId.splice(spliceIndex, 1)
        }
      })
    } else {
      goodsCheckedTurn[index].shopTurn = true
      goodsCheckedTurn[index].goodsTurn.forEach((item, idx) => {
        goodsCheckedTurn[index].goodsTurn[idx] = true
      })
      shoppingCart.forEach(item => {
        let id = item.goodsId
        let spliceIndex = goodsCheckedSelectId.indexOf(id)
        if (spliceIndex === -1) {
          goodsCheckedSelectId.push(id)
        }
      })
    }
    this.setData({
      goodsCheckedTurn: goodsCheckedTurn,
      goodsCheckedSelectId: goodsCheckedSelectId
    })
    wx.setStorageSync('goodsCheckedSelectId', this.data.goodsCheckedSelectId)
    if (this.isAllChecked()) {
      this.setData({
        allCheckedTurn: true
      })
    } else {
      this.setData({
        allCheckedTurn: false
      })
    }
    this.reckonPrice()
  },
  allChecked: function () {
    let valid = this.data.shoppingCar.valid
    let goodsCheckedTurn = this.data.goodsCheckedTurn
    let goodsCheckedSelectId = this.data.goodsCheckedSelectId
    if (!valid.length) {
      this.setData({ allCheckedTurn: false })
      return
    }
    var turn
    if (this.data.allCheckedTurn) {
      turn = false
      goodsCheckedSelectId = []
    } else {
      turn = true
      valid.forEach(item => {
        item.shoppingCart.forEach(ite => {
          goodsCheckedSelectId.push(ite.goodsId)
        })
      })
    }
    this.data.goodsCheckedTurn.forEach((item, index) => {
      item.shopTurn = turn
      item.goodsTurn.forEach((items, idx) => {
        item.goodsTurn[idx] = turn
      })
    })
    this.setData({
      allCheckedTurn: turn,
      goodsCheckedTurn: goodsCheckedTurn,
      goodsCheckedSelectId: goodsCheckedSelectId
    })
    wx.setStorageSync('goodsCheckedSelectId', this.data.goodsCheckedSelectId)
    this.reckonPrice()
  },
  isAllChecked: function () {
    var turn = true
    let goodsCheckedTurn = this.data.goodsCheckedTurn
    goodsCheckedTurn.forEach(item => {
      if (!item.shopTurn) {
        turn = false
      }
    })
    return turn
  },
  isShopAllChecked: function (index) {
    var turn = true
    let goodsCheckedTurn = this.data.goodsCheckedTurn
    goodsCheckedTurn[index].goodsTurn.forEach((item, idx) => {
      if (!item) {
        turn = false
      }
    })
    return turn
  },
  isInShop: function (id) {
    var turn = -1
    this.data.shoppingCar.valid.forEach((item, index) => {
      if (item.tenantId == id) {
        turn = index
      }
    })
    return turn
  },
  onUnload: function () {
  },
  onHide: function () {
    // 页面隐藏时加载  一个页面跳转到另外一个页面也会触发onHide事件
    wx.setStorageSync('goodsCheckedSelectId', this.data.goodsCheckedSelectId)
  },
  goShop: function (e) {
    var tenantId = e.currentTarget.dataset.tenantid
    let projectManagementId = this.data.projectManagementId
    let subObj = { projectManagementId, tenantId }
    wx.setStorageSync('goodsCheckedSelectId', this.data.goodsCheckedSelectId)
    HttpService.get('/gos/api/tenant-goods/sreachByGoods', subObj).then(res => {
      if (res.statusCode === 400) {
        Toast.fail(res.data.message)
        return
      } else {
        wx.setStorageSync('shopInfo', JSON.stringify(res))
        wx.navigateTo({
          url: `/pages/shop/storeShopp/storeShopp?tenantId=${tenantId}&projectManagementId=${projectManagementId}&fromHome=true`
        })
      }
    })
  },
  onHide: function () {
    wx.setStorageSync('goodsCheckedSelectId', this.data.goodsCheckedSelectId)
  },
  setYzm: function (e) {
    let yzm = e.detail.value
    this.setData({
      yzm: yzm
    })
  },
  bindPhone: function (e) {
    this.setData({
      phoneValue: e.detail.value
    })
  },
  goHome () {
    wx.switchTab({
      url: '../../home/index/index',
    })
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