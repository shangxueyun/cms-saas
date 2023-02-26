import HttpService from '../../../utils/http.js'

Page({
  data: {
    steps: [
      {
        text: '步骤一',
        desc: '描述信息',
      },
      {
        text: '步骤二',
        desc: '描述信息',
      },
      {
        text: '步骤三',
        desc: '描述信息',
      },
      {
        text: '步骤四',
        desc: '描述信息',
      },
    ],
    orderDetail: {}
  },
  onLoad (options) {
    console.log(options.orderId)
    this.loadOrderDetails(options.orderId)
    wx.setNavigationBarTitle({ title: '退款详情' })
  },
  withdraw () {},
  loadOrderDetails (id) {
    HttpService.get(`/ord/api/applyRefundRecords/${id}`).then(res => {
      if (res.statusCode === 200) {
        this.setData({
          orderDetail: res.data
        })
      }
    })
  }
})