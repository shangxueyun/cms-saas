// import {Toast} from 'mint-ui'
import service from '../service'
import moment from 'moment-timezone'

const n2 = function (value) {
  return value < 10 ? ('0' + value) : value
}

const formatDate = function (value) {
  if (!value) {
    return '--'
  }
  try {
    let date = new Date(moment.tz(value, 'Asia/Shanghai').format())
    return date.getFullYear() + '.' + n2(date.getMonth() + 1) + '.' + n2(date.getDate())
  } catch (e) {
    return '--'
  }
}

const formatDate2 = function (value) {
  if (!value) {
    return '--'
  }
  try {
    // eslint-disable-next-line
    let date = new Date(moment.tz(value, "Asia/Shanghai").format())
    return date.getFullYear() + '-' + n2(date.getMonth() + 1) + '-' + n2(date.getDate()) + ' ' + n2(date.getHours()) + ':' + n2(date.getMinutes())
  } catch (e) {
    return '--'
  }
}
const formatDate3 = function (value) {
  return value ? value.replace(/-/g, '.') : '--'
}
const formatDate4 = function (value, type) {
  if (!value) {
    return '--'
  }
  try {
    console.info(value)
    // eslint-disable-next-line
    let date = new Date(moment.tz(value, "Asia/Shanghai").format())
    if (type === 'year') {
      return date.getFullYear()
    } else if (type === 'date') {
      return n2(date.getMonth() + 1) + '.' + n2(date.getDate())
    }
  } catch (e) {
    return '--'
  }
}
const formatNumber = function (value, count = 2) {
  if (!value) {
    return '--'
  }
  if (count > 0) {
    value = value.toFixed(count)
    return (Math.floor(value * Math.pow(10, count)) / Math.pow(10, count)).toFixed(count)
  } else {
    return Math.floor(value)
  }
}
const formatPercent = function (value, count = 2) {
  return formatNumber(value * 100, count)
}
const shortNumber = function (value, count = 0) {
  if (value > 10000) {
    return formatNumber(value / 10000, count) + 'W'
  } else {
    return value
  }
}
const industry = function (value, suffix = '') {
  if (!value) {
    return '--'
  }
  let item = service.industry.getByName(value)
  return item ? (item.label + suffix) : value
}
const Liquidation = function (value, suffix = '') {
  if (!value) {
    return '--'
  }
  let item = service.liquidation.getByName(value)
  return item ? (item.label + suffix) : value
}
const contractType = function (value, suffix = '') {
  if (!value) {
    return '--'
  }
  let item = service.contractType.getByName(value)
  return item ? (item.label + suffix) : value
}
const shopStatus = function (value, suffix = '') {
  let item = service.shop.config.find(item => item.name === value)
  return item ? (item.label + suffix) : value
}
const shopStatus2 = function (value, suffix = '') {
  let item = service.shop.config2.find(item => item.name === value)
  return item ? (item.label + suffix) : value
}
const sanitary = function (value, suffix = '') {
  let item = service.shop.config3.find(item => item.name === value)
  return item ? (item.label + suffix) : value
}
const shopStatus4 = function (value, suffix = '') {
  let item = service.shop.config4.find(item => item.name === value)
  return item ? (item.label + suffix) : value
}
const contractStatus = function (value) {
  let item = service.contract.config.find(item => item.name === value)
  return item ? item.label : value
}
const customerStatus = function (value) {
  let item = service.customer.config.find(item => item.name === value)
  return item ? item.label : value
}
const shopStatus5 = function (value) {
  let item = service.shop.config5.find(item => item.name === value)
  return item ? item.label : value
}

const leaseIntention = function (value, type = 0) {
  let item = service.lead.leaseIntention.find(item => item.name === value)
  if (item) {
    value = item.label
  }
  if (value) {
    if (type === 1) {
      value = value.substr(value.indexOf('%') + 1)
    } else if (type === 2) {
      value = value.substr(0, value.indexOf('%') + 1)
    }
  }
  return value
}

const paymentPeriod = function (value) {
  let item = service.contract.paymentPeriod.find(item => item.name === value)
  return item ? item.label : value
}
const certificateType = function (value) {
  let item = service.contract.certificateType.find(item => item.name === value)
  return item ? item.label : value
}
const partyType = function (value) {
  let item = service.contract.partyType.find(item => item.name === value)
  return item ? item.label : value
}
const leaseMode = function (value) {
  let item = service.contract.leaseMode.find(item => item.name === value)
  return item ? item.label : value
}
const toLocaleString = function (value) { // 金额
  if (!value || value === 0) {
    return 0
  }
  let str = value + ''
  if (str.indexOf('.') > 0) {
    // return (Number(str).toFixed(2)).toLocaleString()
    let newstr = Number(str).toFixed(2)
    let before = newstr.split('.')[0]
    let after = newstr.split('.')[1]
    return Number(before).toLocaleString() + '.' + after
  } else {
    return Number(str).toLocaleString() + '.00'
  }
}
const toLocaleFixed = function (value) { // 面积
  if (!value || value === 0) {
    return 0
  }
  let str = value + ''
  if (str.indexOf('.') > 0) {
    let arr = str.split('.')
    let strnumber = Number('0.' + arr[1]).toFixed(2)
    let split1 = strnumber + ''
    return arr[0] + '.' + split1.split('.')[1]
  } else {
    return str + '.00'
  }
}
const toLocaleStringRent = function (value) { // 租金
  if (!value || value === 0) {
    return null
  }
  let str = value + ''
  if (str.indexOf('.') > 0) {
    // return (Number(str).toFixed(2)).toLocaleString()
    let newstr = Number(str).toFixed(2)
    let before = newstr.split('.')[0]
    let after = newstr.split('.')[1]
    return Number(before).toLocaleString() + '.' + after
  } else {
    return Number(str).toLocaleString() + '.00'
  }
}

class Plugin {
  install (Vue) {
    Vue.prototype.$toast = function (message) {
      // Toast(message).
      console.log('message', message)
    }
    Vue.filter('n2', n2)
    Vue.filter('number', formatNumber)
    Vue.filter('percent', formatPercent)
    Vue.filter('shortNumber', shortNumber)
    Vue.filter('industry', industry)
    Vue.filter('shopStatus', shopStatus)
    Vue.filter('shopStatus2', shopStatus2)
    Vue.filter('sanitary', sanitary)
    Vue.filter('shopStatus4', shopStatus4)
    Vue.filter('contractStatus', contractStatus)
    Vue.filter('formatDate', formatDate)
    Vue.filter('formatDate2', formatDate2)
    Vue.filter('formatDate3', formatDate3)
    Vue.filter('paymentPeriod', paymentPeriod)
    Vue.filter('customerStatus', customerStatus)
    Vue.filter('leaseIntention', leaseIntention)
    Vue.filter('formatDate4', formatDate4)
    Vue.filter('shopStatus5', shopStatus5)
    Vue.filter('certificateType', certificateType)
    Vue.filter('partyType', partyType)
    Vue.filter('leaseMode', leaseMode)
    Vue.filter('Liquidation', Liquidation)
    Vue.filter('contractType', contractType)
    Vue.filter('toLocaleString', toLocaleString)
    Vue.filter('toLocaleFixed', toLocaleFixed)
    Vue.filter('toLocaleStringRent', toLocaleStringRent)
  }
}

export default new Plugin()
