/*
 * @Descripttion: 
 * @version: 
 * @Author: Pedia.Xu
 * @Date: 2021-09-23 16:41:57
 * @LastEditors: Pedia.Xu
 * @LastEditTime: 2021-10-12 14:53:06
 */

import HttpService from '../../../utils/http'
Page({
  data: {
    url: '',
  },
  onLoad: function (options) {
    // var baseUrl = 'https://www.ecams.pro'
    // var baseUrl = 'https://crm-dev.yunwutech.com'
    var baseUrl = wx.getStorageSync('baseUrl')
    this.setData({
      url: baseUrl + '/h5/src/CustomerRegistryPrivacyAgreement.html'
    })
  },
  onHide: function () {
  },
  onShow: function () {

  },


})