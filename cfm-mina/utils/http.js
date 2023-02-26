// var baseUrl = 'https://www.ecams.pro'
var baseUrl = 'https://qibao-dev.yunwutech.com'
var defaultHeader = { 'content-type': 'application/json', 'Authorization': 'Basic d2ViX2FwcDpjaGFuZ2VpdA==', 'tenantKey': ''}
var formHeaderUrl = ['/uaa/oauth/token']
var timeOut
const hideLoadingUrl = ['/uaa/oauth/token', '/ywm/api/customerApps/tenantKey', '/uaa/api/users/wx', '/crm/api/userCoupons/receive']
const appId = wx.getAccountInfoSync().miniProgram.appId
const systemInfo = wx.getSystemInfoSync()

class HttpService {
  request(method, url, data) {
    if (hideLoadingUrl.indexOf(url) === -1 ) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
    }
    var header = Object.assign({}, defaultHeader);
    if (formHeaderUrl.indexOf(url) >= 0) {
      header['Content-Type'] = 'application/x-www-form-urlencoded'
    }
    if (['/zuul/obs/api/image-multipart'].indexOf(url) >= 0) {
      header['Content-Type'] = 'multipart/form-data'
    }
    var token  = wx.getStorageSync("token")
    var tenantKey = wx.getStorageSync("tenantKey")
    if (url !== "/uaa/oauth/token" && token) {
      header['Authorization'] = token.token_type + ' ' + token.access_token
    }
    if (tenantKey) {
      header['tenantKey'] = tenantKey
    }
    // console.info(`http.${method}('${url}')`, data)
    return new Promise(function (resolve, reject) {
      wx.request({
        url: baseUrl + url,
        data: data,
        method: method,
        header: header,
        success: function (res) {
          console.log(res)
          resolve(res)
        },
        fail: function (res) {
          console.log(res)
          reject(res)
        },
        complete: function(res){
          console.log(res)
          if (res.errMsg === 'request:ok'){
            console.log(res)
            // clearTimeout(timeOut)
            // timeOut = setTimeout(() => {
            //   wx.hideLoading()
            // }, 200) 
            wx.hideLoading()
          }else{
            console.log(res)
            wx.showToast({
              title: '网络异常',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    })
  }
  get(url, params) {
    return this.request('get', url, params)
  }
  post(url, body) {
    return this.request('post', url, body)
  }
  put(url, body) {
    return this.request('put', url, body)
  }
  patch(url, body) {
    return this.request('patch', url, body)
  }
  delete(url, params) {
    return this.request('delete', url, { params })
  }
  setToken () {
    wx.setStorageSync('systemInfo', systemInfo)
    wx.setStorageSync('appId', appId)
    wx.setStorageSync('baseUrl', baseUrl)
  }
  login (app) {
    // console.info('开始登录......')
    if (wx.getStorageSync('projectManagementId')) {
      let projectManagementId = wx.getStorageSync('projectManagementId')
      wx.clearStorageSync()
      wx.setStorageSync('projectManagementId', projectManagementId)
    }else{
      wx.clearStorageSync()
    }
    // 登陆前存储本地信息
    this.setToken()
    wx.login({
      success: res => {
        let code = {
          appId: appId,
          code: `{"appId": "${appId}","code": "${res.code}"}`,
          grant_type: 'authorization_code',
          client_id: 'web_app'
        }
        this.get('/ywm/api/customerApps/tenantKey', {appId: appId}).then(key => {
          wx.setStorageSync('tenantKey', key.data)
          this.post('/uaa/oauth/token', code).then(res => {
            if (res.statusCode === 200) {
              wx.setStorageSync('token', res.data)
              this.get('/uaa/api/users/wx').then(detail => {
                wx.setStorageSync('account', detail.data)
                app.globalData.account = detail.data
              })
            }
          })
        })
      },
      fail: function (error) {
        console.info(error)
      }
    })
  }
  checkToken(app) {
    //console.info('检查 oauthToken......')
    let token = wx.getStorageSync('token')
    if (token) {
      this.get('/uaa/api/users/wx').then(res => {
        if (res.data.error == 'unauthorized' || res.statusCode == 401) {
          this.login(app)
        } else {
          wx.setStorageSync('account', res.data)
          app.globalData.account = res.data
        }
      })
    } else {
      this.login(app)
    }
  }
}
export default new HttpService()
