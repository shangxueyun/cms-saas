import context from '../index'
import { Toast } from 'mint-ui'

const LOGIN = 'uaa/oauth/token'
const ACCOUNT = 'uaa/api/account/user'
const SETACCOUNT = 'uaa/api/users/updateTelephone'
const CUSTOMERS = 'ywm/api/corporate-customers/companyCode'

class UserService {
  constructor (store) {
    this.store = store
    this.store.current = {}
  }

  get current () {
    return this.store.current
  }

  async start () {
    let user = context.local.getUser()
    if (user) {
      let account = await this.getCurrentAccount()
      if (account) {
        return true
      }
    }
  }

  async login (username, password) {
    try {
      let result = await context.http.post(LOGIN, { username, password, client_id: 'web_app', grant_type: 'password' })
      let refreshToken = result.data.refresh_token
      const onNotice = result.data.onNotice
      context.local.set('refreshToken', refreshToken)
      this.setToken(result.data)
      let res = await this.getCurrentAccount()
      return {res, onNotice}
    } catch (e) {
      let res = this.logout()
      const err = e.response && e.response.data
      return {res, err}
    }
  }

  async reLogin () {
    try {
      localStorage.removeItem('token')
      let refreshToken = context.local.get('refreshToken')
      if (refreshToken) {
        let result = await context.http.post(LOGIN, { grant_type: 'refresh_token', refresh_token: refreshToken })
        context.local.set('refreshToken', refreshToken)
        this.setToken(result.data)
        this.getCurrentAccount()
        return true
      } else {
        this.logout()
        return false
      }
    } catch (e) {
      this.logout()
      return false
    }
  }
  logout () {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    if (location.hash !== '#/login') {
      window.location.href = '/ids/#/ids/login'
    }
    return false
  }
  async getCurrentAccount () {
    if (localStorage.getItem('user')) {
      this.store.current = JSON.parse(JSON.parse(localStorage.getItem('user')).value)
    } else {
      let result = await context.http.get(ACCOUNT)
      this.store.current = result.data
      context.storage.setItem({
        name: 'user',
        value: JSON.stringify(result.data),
        expires: 1000 * 60 * 60 * 24 * 7
      })
    }
    this.pushClientId(this.store.current.id)
    return this.store.current
  }
  async setCurrentAccount (userInfo) {
    const { id, englishName, englishSurname, facialPhoto, telephone } = userInfo
    const data = { id, englishName, englishSurname, facialPhoto, telephone }
    await context.http.put(SETACCOUNT, data)
    let result = await context.http.get(ACCOUNT)
    this.store.current = result.data
    context.storage.setItem({
      name: 'user',
      value: JSON.stringify(result.data),
      expires: 1000 * 60 * 60 * 24 * 7
    })
  }
  async corporateCustomers (code) {
    let flag = false
    try {
      let result = await context.http.get(CUSTOMERS, { companyCode: code })
      context.local.set('companyShortName', result.data.companyShortName)
      context.local.set('companyName', result.data.companyName)
      context.local.set('publicKey', result.data.publicKey)
      document.title = context.local.get('companyShortName') + '-小象商业管理系统'
      flag = true
    } catch (error) {
      // eslint-disable-next-line eqeqeq
      if (error == 'Error: Network Error') {
        Toast({
          message: '网络错误',
          position: 'top'
        })
      } else {
        Toast({
          message: '企业代码不存在',
          position: 'top'
        })
      }
      flag = false
    }
    return flag
  }
  sendCode (phone) {
    context.http.get('mps/api/sms/code?telephone=' + phone + '&smsEnum=K')
  }

  async submitForgetPassword ({ phone, code, password }) {
    return await context.http.post('uaa/api/account/forget_password', {
      userTag: 'BDM',
      emailOrPhone: phone,
      verificationCode: code,
      password: password
    })
  }

  async submitResetPassword (password) {
    return await context.http.post('uaa/api/account/change_password', password)
  }

  async submitSuggest (content) {
    return await context.http.post('saa/api/feedbacks', {
      applicant: this.current.id,
      content
    })
  }

  async loadNewsType1 ({ page, size, sort }) {
    return await context.http.get('saa/api/users', { page, size, sort })
  }

  async loadUserByRoleNames (names) {
    return await context.http.get('uaa/api/roles/name', { roleVM: names })
  }

  hasAuthority (code) {
    let user = {}
    if (localStorage.getItem('user')) {
      user = JSON.parse(localStorage.getItem('user'))
    } else {
      user = this.store.current
    }
    let userVal = user.value && JSON.parse(user.value)
    if (userVal && userVal.authorities) {
      return userVal.authorities.some(function (auth) {
        return auth === code
      })
    }
    return false
  }
  async pushClientId (uid) {
    let postData = {
      userId: uid,
      systemType: 'CMS_APP'
    }
    if (!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) === false) {
      window.webkit.messageHandlers.jsbridge.postMessage('cid')
    } else {
      window.messageHandlers.postMessage('cid')
    }
    // window.onCidReady()
    // if (localStorage.getItem('clientId')) {
    //   postData.clientId = localStorage.getItem('clientId')
    // }
    // localStorage.removeItem('clientId')
    // Toast(`userId:${uid}---clientId:${postData.clientId}`)
    // return await context.http.post('/mps/api/user-devices', postData)
  }
  async repairRecordNum (projectId) { // 获取维保/保养列表未完成数量
    return await context.http.get(`cms/api/repair-records/num/${projectId}`)
  }
  setToken (data) {
    // token from data
    localStorage.setItem('token', JSON.stringify(data))
  }
}
export default UserService
