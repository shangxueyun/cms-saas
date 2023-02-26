/* eslint-disable space-before-function-paren */
import context from './index'
import mockService from './mockService'
import axios from 'axios'
import Qs from 'qs'
import * as hub from './eventHub'
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
axios.defaults.withCredentials = true
// http请求拦截器
axios.interceptors.request.use(config => {
  if (qichachaUrl.indexOf(config.url) >= 0) {

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
    let token = localStorage.getItem('token')
    if (token) {
      token = JSON.parse(token)
      config.headers['Authorization'] = token.token_type + ' ' + token.access_token
    } else {
      config.headers['Authorization'] = 'Basic d2ViX2FwcDpjaGFuZ2VpdA=='
    }
    // let baseUrl = config.url.substring(0, 4)
    // if (baseUrl === '/ywm') {
    //   config.headers['tenantKey'] = 'platform'
    // } else {
    //   // let tenantKey = localStorage.getItem('tenantKey')
    //   config.headers['tenantKey'] = 'danran'
    // }

    let tenantKey = localStorage.getItem('tenantKey')
    // let tenantKey = 'danran'
    // localStorage.tenantKey = tenantKey
    config.headers['tenantKey'] = tenantKey
  }
  return config
}, error => {
  return Promise.reject(error)
})
// http响应拦截器
let isRefreshing = true
axios.interceptors.response.use(config => {
  context.system.stopLoading()
  if (config.url === '/ywm/api/module-applies') {
    hub.eventHub.$emit('loading', 'finish')
  }
  return config
}, error => {
  let config = error.config
  let message = error
  context.system.stopLoading()
  // refreshToken过期刷新页面跳登录
  if (error.response && error.response.status === 401 && error.response.config.url === '/uaa/oauth/token' && window.location.hash !== '#/login') {
    window.location.href = '/'
    return
  }
  if (error.response && error.response.status === 401 && error.response.config.url !== '/uaa/oauth/token') {
    if (window.location.hash.match('login') !== null) return
    if (isRefreshing) {
      isRefreshing = false
      context.user.reLogin().then(res => {
        if (res) {
          config.isRetryRequest = true
          // 重新请求
          return onAccessTokenFetched()
        }
      })
    }
    const retryOriginalRequest = new Promise((resolve) => {
      addSubscriber(() => {
        resolve(axios(config))
      })
    })
    return retryOriginalRequest
  }
  if (error.response && error.response.config.url === '/uaa/oauth/token') return
  // if (error.response.status === 500 || error.response.status === 504) {
  //   message = '服务器错误，请稍后重试'
  // } else {
  //   message = error.response.data.message || error.response.data
  // }
  console.log(message)
  return Promise.reject(error)
})

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
