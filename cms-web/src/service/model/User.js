import context from '../index'
import { Message } from 'element-ui'

const LOGIN = '/uaa/oauth/token'
const ACCOUNT = '/uaa/api/account/user'
const CUSTOMERS = '/ywm/api/corporate-customers/companyCode'

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
      sessionStorage.removeItem('token')
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
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    if (location.hash !== '#/login') {
      location.href = '/#/login'
    }
    return false
  }
  async getCurrentAccount () {
    if (sessionStorage.getItem('user')) {
      this.store.current = JSON.parse(sessionStorage.getItem('user'))
    } else {
      let result = await context.http.get(ACCOUNT)
      this.store.current = result.data
      sessionStorage.setItem('user', JSON.stringify(result.data))
    }
    return this.store.current
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
      Message({
        showClose: true,
        message: '企业代码不存在',
        type: 'error'
      })
      flag = false
    }
    return flag
  }
  sendCode (phone) {
    context.http.get('/mps/api/sms/code?telephone=' + phone + '&smsEnum=K')
  }

  async submitForgetPassword ({ phone, code, password }) {
    return await context.http.post('/uaa/api/account/forget_password', {
      userTag: 'BDM',
      emailOrPhone: phone,
      verificationCode: code,
      password: password
    })
  }

  async submitResetPassword (password) {
    return await context.http.post('/uaa/api/account/change_password', password)
  }

  async submitSuggest (content) {
    return await context.http.post('/saa/api/feedbacks', {
      applicant: this.current.id,
      content
    })
  }

  async loadNewsType1 ({ page, size, sort }) {
    return await context.http.get('/saa/api/users', { page, size, sort })
  }

  async loadUserByRoleNames (names) {
    return await context.http.get('/uaa/api/roles/name', { roleVM: names })
  }

  hasAuthority (code) {
    let user = {}
    if (sessionStorage.getItem('user')) {
      user = JSON.parse(sessionStorage.getItem('user'))
    } else {
      user = this.store.current
    }
    // let user = this.store.current
    if (user.authorities) {
      return user.authorities.some(function (auth) {
        return auth === code
      })
    }
    return false
  }
  async pushClientId (uid) {
    let postData = {
      userId: uid,
      systemType: 'BDM'
    }
    if (localStorage.getItem('clientId')) {
      postData.clientId = localStorage.getItem('clientId')
    }
    return await context.http.post('/mps/api/user-devices', postData)
  }
  async repairRecordNum (projectId) { // 获取维保/保养列表未完成数量
    return await context.http.get(`/cms/api/repair-records/num/${projectId}`)
  }
  setToken (data) {
    // token from data
    sessionStorage.setItem('token', JSON.stringify(data))
  }
}
export default UserService
