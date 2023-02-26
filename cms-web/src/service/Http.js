/* eslint-disable space-before-function-paren */
import context from './index'
import mockService from './mockService'
import axios from 'axios'
import Qs from 'qs'
import {
  Message
} from 'element-ui'
import * as hub from './eventHub'
import md5 from 'js-md5'
import moment from 'moment-timezone'
const userMock = false
// 轮询接口不开启loading
const qichachaUrl = [
  '/qichacha/ECIV4/Search',
  '/qichacha/ECIV4/GetFullDetailsByName',
  '/qichacha/ECICreditCode/GetCreditCodeNew'
]
// const toISO = Date.prototype.toISOString
// 超时时间
axios.defaults.timeout = 10000
axios.defaults.isRetryRequest = false
// http请求拦截器
axios.interceptors.request.use(config => {
  context.system.startLoading()
  if (config.url === '/ywm/api/image-multipart') {
    config.timeout = 30000
  }
  if (config.url === '/elasticsearch/_msearch') {
    config.headers['Content-Type'] = 'application/x-ndjson'
    config.headers['kbn-version'] = '6.2.3'
  }
  if (qichachaUrl.indexOf(config.url) >= 0) {
    let key = '2f3415aa9d1c4201837f8ca4215b91eb'
    let SecretKey = '6778893187242A2A3CD91034953288B7'
    let Timespan = Math.round(new Date() / 1000)
    let Token = md5(key + Timespan + SecretKey)
    config.headers['Token'] = Token.toUpperCase()
    config.headers['Timespan'] = Timespan
  } else {
    if (config.method === 'post' && config.url.indexOf('/uaa/oauth/token') >= 0) {
      // config.data = Qs.stringify(config.data)
      config.data = Qs.stringify(config.data, {
        serializeDate: (date) => {
          // 用moment处理日期比较方便，自己写格式化方法也可以
          return moment(date).format('YYYY-MM-DD HH:mm:ss')
        }
      })
    }
    if (config.method === 'get') {
      if (config.url.indexOf('?') > 0) {
        config.url += '&time=' + new Date().getTime()
      } else {
        config.url += '?time=' + new Date().getTime()
      }
    }
    let token = sessionStorage.getItem('token')
    let refreshToken = context.local.get('refreshToken')
    if (token && token !== 'undefined') {
      token = JSON.parse(token)
      config.headers['Authorization'] = token.token_type + ' ' + token.access_token
    } else if (config.url === '/uaa/oauth/token') {
      config.headers['Authorization'] = 'Basic d2ViX2FwcDpjaGFuZ2VpdA=='
    } else if (config.url.indexOf('/ywm/api/corporate-customers/companyCode') >= 0) {
      config.headers['Authorization'] = 'Basic d2ViX2FwcDpjaGFuZ2VpdA=='
    } else {
      if (refreshToken) {
        config.headers['Authorization'] = 'Bearer  ' + refreshToken
      } else {
        // location.href = '/#/login'
        // return false
        // return Promise.reject('no token')
      }
    }
    let baseUrl = config.url.substring(0, 4)
    if (baseUrl === '/ywm') {
      config.headers['tenantKey'] = 'platform'
    } else {
      let tenantKey = localStorage.getItem('tenantKey')
      config.headers['tenantKey'] = tenantKey
    }
    if (config.url === 'https://dm-51.data.aliyun.com/rest/160601/ocr/ocr_idcard.json' || config.url === 'https://dm-58.data.aliyun.com/rest/160601/ocr/ocr_business_license.json') {
      config.headers['Authorization'] = 'APPCODE b5165303e84148b68639d04a94c32f51'
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})
// http响应拦截器
let isRefreshing = true
//
let firstRequestError = true
axios.interceptors.response.use(config => {
  context.system.stopLoading()
  if (config.url === '/ywm/api/module-applies') {
    hub.eventHub.$emit('loading', 'finish')
  }
  return config
}, error => {
  firstRequestError = true
  let config = error.config
  let message = ''
  context.system.stopLoading()
  // refreshToken过期刷新页面跳登录
  if (error.response && error.response.status === 401 && error.response.config.url === '/uaa/oauth/token' && window.location.hash !== '#/login') {
    window.location.href = '/'
    return
  }
  if (error.response && error.response.status === 401 && (error.response.config.url.indexOf('/uaa/api/account/user') < 0) && error.response.config.url !== '/uaa/oauth/token') {
    if (isRefreshing) {
      isRefreshing = false
      context.user.reLogin().then(res => {
        if (res) {
          config.isRetryRequest = true
          // 重新请求
          onAccessTokenFetched()
          isRefreshing = true
          return false
        } else {
          firstRequestError = false
          isRefreshing = true
          onAccessTokenFetched()
          return false
        }
      })
    }
    const retryOriginalRequest = new Promise((resolve, reject) => {
      if (firstRequestError) {
        addSubscriber(() => {
          resolve(axios(config))
        })
      } else {
        console.log('retryOriginalRequest reject.............................')
      }
    })
    return retryOriginalRequest
  }
  // if (error.response.config.url === '/uaa/oauth/token') return
  if (error.response && (error.response.status === 400)) {
    if (config.url.indexOf('corporate-customers/companyCode') > -1) {
      return Promise.reject(error)
    }
    if (error && error.response.data && error.response.data.message) {
      message = error.response.data.message
      showMessage(message)
    }
  } else if (error.response && error.response.status === 401) {
    return Promise.reject(error)
  } else if (error.response && error.config.method === 'post') {
    if (error.response.status === 500 && config.url.indexOf('condition/import') > -1) {
      message = '导入失败，请核对后重新导入'
      showMessage(message)
    } else if (config.url.indexOf('https://dm-58.data.aliyun.com') > -1 || config.url.indexOf('https://dm-51.data.aliyun.com') > -1) {
      console.log(message)
    } else {
      message = '服务器繁忙，请稍后重试'
      showMessage(message)
    }
  }
  return Promise.reject(error.config)
})

function showMessage(message) {
  Message({
    showClose: true,
    message: message,
    type: 'error'
  })
}

let subscribers = []

function onAccessTokenFetched() {
  isRefreshing = true
  subscribers.forEach((callback) => {
    callback()
  })
  subscribers = []
}

function addSubscriber(callback) {
  subscribers.push(callback)
}

class HttpService {
  async request(method, url, ...args) {
    let mock = (userMock && mockService && mockService.execute(method, url))
    if (mock) {
      context.system.stopLoading()
      return Promise.resolve(mock)
    }
    return axios[method](url, ...args).then(response => {
      return Promise.resolve(response)
    }, error => {
      return Promise.reject(error)
    })
  }
  // setToken (value) {
  //   if (value) {
  //     axios.defaults.headers.common['Authorization'] = value.token_type + ' ' + value.access_token
  //   } else {
  //     axios.defaults.headers.common['Authorization'] = 'Basic d2ViX2FwcDpjaGFuZ2VpdA=='
  //   }
  // }
  get(url, params) {
    return this.request('get', url, {
      params
    })
  }
  post(url, body, config) {
    return this.request('post', url, body, config)
  }
  put(url, body) {
    return this.request('put', url, body)
  }
  patch(url, body) {
    return this.request('patch', url, body)
  }
  delete(url, params) {
    return this.request('delete', url, {
      params
    })
  }
}
export default HttpService
