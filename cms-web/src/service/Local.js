const USER = 'user'
const getCookie = function (key) {
  if (document.cookie.length > 0) {
    let start = document.cookie.indexOf(key + '=')
    if (start !== -1) {
      start = start + key.length + 1
      let end = document.cookie.indexOf(';', start)
      if (end === -1) end = document.cookie.length
      return unescape(document.cookie.substring(start, end))
    }
  }
  return ''
}

const setCookie = function (key, value) {
  let dt = new Date()
  dt.setDate(dt.getDate() + 30)
  document.cookie = key + '=' + escape(value) + ';expires=' + dt.toGMTString()
}

// 操作Cookie
var Cookies = {}
Cookies.set = function (name, value) {
  var argv = arguments
  var argc = arguments.length
  var expires = (argc > 2) ? argv[2] : null
  var path = (argc > 3) ? argv[3] : '/'
  var domain = (argc > 4) ? argv[4] : null
  var secure = (argc > 5) ? argv[5] : false
  document.cookie = name + '=' + escape(value) +
        ((expires == null) ? '' : ('; expires=' + expires.toGMTString())) +
        ((path == null) ? '' : ('; path=' + path)) +
        ((domain == null) ? '' : ('; domain=' + domain)) +
        ((secure === true) ? '; secure' : '')
}

Cookies.get = function (name) {
  var arg = name + '='
  var alen = arg.length
  var clen = document.cookie.length
  var i = 0
  var j = 0
  while (i < clen) {
    j = i + alen
    if (document.cookie.substring(i, j) === arg) { return Cookies.getCookieVal(j) }
    i = document.cookie.indexOf(' ', i) + 1
    if (i === 0) { break }
  }
  return null
}

Cookies.clear = function (name) {
  if (Cookies.get(name)) {
    document.cookie = name + '=' + '; expires=Thu, 01-Jan-70 00:00:01 GMT'
  }
}

Cookies.getCookieVal = function (offset) {
  var endstr = document.cookie.indexOf(';', offset)
  if (endstr === -1) {
    endstr = document.cookie.length
  }
  return unescape(document.cookie.substring(offset, endstr))
}
class LocalService {
  get (key) {
    if (window.localStorage) {
      return window.localStorage.getItem(key)
    } else {
      return getCookie(key)
    }
  }

  set (key, value) {
    if (window.localStorage) {
      window.localStorage.setItem(key, value)
    } else {
      setCookie(key, value)
    }
  }

  getJson (key) {
    let value = this.get(key)
    return value ? JSON.parse(value) : null
  }

  setJson (key, value) {
    this.set(key, JSON.stringify(value))
  }

  getUser () {
    return this.getJson(USER)
  }

  setUser (user) {
    this.setJson(USER, user)
  }

  setCookie (name, value) {
    Cookies.set(name, value)
  }
}
export default LocalService
