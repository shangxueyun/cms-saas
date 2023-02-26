import HttpService from '../../../utils/http.js'
Page({
  data: {
    fileList: [],
    show: false,
    reasonList: [{
      name: '商品质量有问题',
      value: '1',
      selected: false
    },{
      name: '实物与描述不符',
      value: '2',
      selected: false
    },{
      name: '没收到此商品',
      value: '3',
      selected: false
    },{
      name: '包装问题',
      value: '4',
      selected: false
    },{
      name: '配送问题',
      value: '5',
      selected: false
    },{
      name: '保质期问题',
      value: '6',
      selected: false
    },{
      name: '其他',
      value: '7',
      selected: false
    }],
    selectedList: [],
    selectedListSTR: '',
    applyData: {
      orderDetail: {},
      refundRenson: '',
      buyersRemark: ''
    },
    orderObj: {},
    refundImageUrls: [],
    selectedIndex: '',
    estimateRefundAmount: 0,
    refundNumber: 0
  },
  onLoad(option) {
    const orderObj = JSON.parse(option.orderObj)
    const tenantOrderId = option.tenantOrderId
    this.data.applyData.tenantOrderId = tenantOrderId
    this.data.applyData.orderDetail.id = orderObj.id
    this.getAoodsPrice(orderObj)
    wx.setNavigationBarTitle({ title: '申请售后' })
  },
  getAoodsPrice (orderObj) {
    HttpService.get(`/ord/api/tenantOrders/user/afterSale/compute?orderDetailId=${this.data.applyData.orderDetail.id}`).then(res => {
      if (res.statusCode === 200) {
        const AoodsPrice = res.data // 实际可退金额
        this.setData({AoodsPrice})
        let payAmount = 0 // 实付金额
        let estimateRefundAmount // 退款金额
        let refundNumber = 0
        if (orderObj.refundAmount) {
          refundNumber = orderObj.goodsSpecification != '0' ? orderObj.number - Math.floor(orderObj.refundNumber/Number(orderObj.goodsSpecification)) : orderObj.number - orderObj.refundNumber
          estimateRefundAmount = (AoodsPrice / refundNumber).toFixed(2)
          payAmount = (AoodsPrice + orderObj.refundAmount).toFixed(2)
        } else {
          estimateRefundAmount = (AoodsPrice / orderObj.number).toFixed(2)
          refundNumber = orderObj.number
          payAmount = AoodsPrice
        }
        this.data.applyData.refundNumber = 1
        this.estimateRefundAmount = Number(estimateRefundAmount)
        estimateRefundAmount = Number(estimateRefundAmount)
        this.setData({
          refundNumber: refundNumber,
          'applyData.estimateRefundAmount': estimateRefundAmount,
          orderObj: orderObj,
          payAmount: payAmount
        })
      }
    })
  },
  showAction () {
    this.setData({
      show: true
    })
  },
  onChange(event) {
    this.data.applyData.refundNumber = event.detail
    let estimateRefundAmount = (event.detail * this.estimateRefundAmount).toFixed(2)
    const AoodsPrice = this.data.AoodsPrice
    if (estimateRefundAmount > AoodsPrice) {
      estimateRefundAmount = AoodsPrice
    }
    if (this.data.refundNumber === event.detail && estimateRefundAmount < AoodsPrice) {
      estimateRefundAmount = AoodsPrice
    }
    this.setData({
      'applyData.estimateRefundAmount': estimateRefundAmount
    })
  },
  selectReason (option) {
    const index = option.currentTarget.dataset.index
    const reasonList = this.data.reasonList
    this.selectedListSTR = reasonList[index].name
    this.setData({
      selectedIndex: index,
      selectedListSTR: this.selectedListSTR
    })
  },
  onClose() {
    if (!this.selectedListSTR) {
      wx.showToast({
        title: '请选择退款原因！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    this.setData({ 
      show: false
    })
    this.data.applyData.refundRenson = this.selectedListSTR
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
    });
  },
  deleteImg(event){
    const index= event.detail.index
    console.log(index)//输出的就是图片所在fileList的下标，自己根据需要进行操作就行
    const { fileList,refundImageUrls } = this.data;
    fileList.splice(index, 1);
    refundImageUrls.splice(index, 1);
    this.setData({ fileList,refundImageUrls });
  },
  bindTextAreaBlur: function(e) {
    this.data.applyData.buyersRemark = e.detail.value
  },
  Submit () {
    if (this.data.applyData.refundRenson === '') {
      wx.showToast({
        title: '请选择退款原因',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.data.applyData.refundImageUrlArr = this.data.refundImageUrls
    // console.log(this.data.applyData)
    HttpService.post('/ord/api/applyRefundRecords', this.data.applyData).then(res => {
      if (res.statusCode === 201) {
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 2000
        })
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
})