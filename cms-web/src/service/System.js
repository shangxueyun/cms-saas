// import {Toast} from 'mint-ui'
const n2 = function (value) {
  return value < 10 ? ('0' + value) : value
}
class SystemService {
  constructor (store) {
    this.store = store
    this.store.loading = false
    this.store.footVisible = false
    this.store.isPush = false
  }

  startLoading () {
    this.store.loading = true
  }

  stopLoading () {
    this.store.loading = false
  }

  set footVisible (value) {
    this.store.footVisible = value
  }

  get isPush () {
    return this.store.isPush
  }

  set isPush (value) {
    this.store.isPush = value
  }

  toast (message) {
    // Toast(message)
    console.log('message', message)
  }

  now () {
    let date = new Date()
    return date.getFullYear() + '-' + n2(date.getMonth() + 1) + '-' + n2(date.getDate())
  }
}
export default SystemService
