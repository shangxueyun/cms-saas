import context from '../index'
import JSEncrypt from 'jsencrypt/bin/jsencrypt'

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
    // let user = context.local.getUser()
    // if (user) {
    //   let account = await this.getCurrentAccount()
    //   if (account) {
    //     return true
    //   }
    // }
    return true
  }

  async login (username, password) {
    try {
      let encryptor = new JSEncrypt()
      let publicKey = context.local.get('publicKey')
      encryptor.setPublicKey(publicKey)
      let rsaPassWord = encryptor.encrypt(password)

      let result = await context.http.post(LOGIN, {username, rsaPassWord, client_id: 'web_app', grant_type: 'password'})
      let refreshToken = result.data.refresh_token
      // context.local.setUser({username, password})
      context.local.set('refreshToken', refreshToken)
      this.setToken(result.data)
      // this.getCurrentAccount()
      return true
    } catch (e) {
      this.logout()
    }
  }

  async reLogin () {
    try {
      let token = localStorage.getItem('token')
      let refreshToken = ''
      if (token) {
        token = JSON.parse(token)
        refreshToken = token.refresh_token
      }
      localStorage.removeItem('token')
      // let refreshToken = context.local.get('refreshToken')
      let result = await context.http.post(LOGIN, {grant_type: 'refresh_token', refresh_token: refreshToken})
      // context.local.set('refreshToken', refreshToken)
      this.setToken(result.data)
      this.getCurrentAccount()
      return true
    } catch (e) {
      this.logout()
    }
  }
  logout () {
    context.local.setUser({})
    localStorage.removeItem('token')
  }
  async getCurrentAccount () {
    let result = await context.http.get(ACCOUNT)
    this.store.current = result.data
    localStorage.setItem('user', JSON.stringify(result.data))
    return this.store.current
  }
  async corporateCustomers (code) {
    let result = await context.http.get(CUSTOMERS, {companyCode: code})
    context.local.set('publicKey', result.data.publicKey)
    return result
  }
  sendCode (phone) {
    context.http.get('/mps/api/sms/code?telephone=' + phone + '&smsEnum=K')
  }

  async submitForgetPassword ({phone, code, password}) {
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

  async loadNewsType1 ({page, size, sort}) {
    return await context.http.get('/saa/api/users', {page, size, sort})
  }

  async loadUserByRoleNames (names) {
    return await context.http.get('/uaa/api/roles/name', {roleVM: names})
  }

  hasAuthority (code) {
    let user = this.store.current
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
  setToken (data) {
    console.log('data', data)
    localStorage.setItem('token', JSON.stringify(data))
  }
}
export default UserService
