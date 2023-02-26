/* eslint-disable space-before-function-paren */
export function isvalidUsername(str) {
  const validmap = ['admin', 'editor']
  return validmap.indexOf(str.trim()) >= 0
}

/* 合法uri */
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母 */
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母 */
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母 */
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

/**
 * 获取当前时间
 * @param type
 */

export function getNowTime(type) {
  var now = new Date()
  var year = now.getFullYear()
  var month = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)
  var day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
  var hour = now.getHours()
  var minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
  var second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()
  var nowdate = ''
  if (type === 'date') {
    nowdate = year + '-' + month + '-' + day
  } else if (type === 'time') {
    nowdate = year + '年' + month + '月' + day + '日'
  } else if (type === 'newtime') {
    nowdate = year + '-' + month + '-' + day + '\xa0\xa0\xa0' + hour + ':' + minute + ':' + second
  } else {
    nowdate = year + ' \xa0' + month + ' \xa0' + day + '\xa0\xa0\xa0' + hour + ':' + minute
  }
  return nowdate
}

/**
 * 金额格式化
 * @param value
 */

export function toLocaleString(value) { // 金额
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

/**
 * 保留两位小数
 * @param value
 */
export function toLocaleFixed (value) { // 面积
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

/**

*

* 给定一个精度值，计算某一项在一串数据中占据的百分比，确保百分比总和是1（100%）

* 使用最大余额法

* @param {Array.} valueList a list of all data 一列数据

* @param {number} idx index of the data to be processed in valueList 索引值（数组下标）

* @param {number} precision integer number showing digits of precision 精度值

* @return {number} percent ranging from 0 to 100 返回百分比从0到100

*/

export function getPercentWithPrecision (valueList, idx, precision) {
  if (!valueList[idx]) {
    return 0
  }

  var sum = valueList.reduce(function (acc, val) {
    return acc + (isNaN(val) ? 0 : val)
  }, 0)

  if (sum === 0) {
    return 0
  }

  console.log('sum', sum)

  // sum 9

  var digits = Math.pow(10, precision)// digits 100

  console.log('digits', digits)

  var votesPerQuota = valueList.map(function (val) {
    return (isNaN(val) ? 0 : val) / sum * digits * 100 // 扩大比例，这样可以确保整数部分是已经确定的议席配额，小数部分是余额
  })

  console.log('votesPerQuota', votesPerQuota)

  // votesPerQuota [ 2222.222222222222, 4444.444444444444, 3333.333333333333 ] 每一个项获得的议席配额，整数部分是已经确定的议席配额，小数部分是余额

  var targetSeats = digits * 100 // targetSeats 10000 全部的议席

  console.log('targetSeats', targetSeats)

  var seats = votesPerQuota.map(function (votes) {
  // Assign automatic seats.

    return Math.floor(votes)
  })

  console.log('seats', seats)

  // seats [ 2222, 4444, 3333 ] 获取配额的整数部分

  var currentSum = seats.reduce(function (acc, val) {
    return acc + val
  }, 0)

  console.log('currentSum', currentSum)

  // 9999 表示已经配额了9999个议席，还剩下一个议席

  var remainder = votesPerQuota.map(function (votes, idx) {
    return votes - seats[idx]
  })

  console.log('remainder', remainder)

  // [ 0.2222222222221717, 0.4444444444443434, 0.33333333333303017 ]得到每一项的余额

  // Has remainding votes. 如果还有剩余的坐席就继续分配

  while (currentSum < targetSeats) {
  // Find next largest remainder. 找到下一个最大的余额

    var max = Number.NEGATIVE_INFINITY

    var maxId = null

    for (var i = 0, len = remainder.length; i < len; ++i) {
      if (remainder[i] > max) {
        max = remainder[i]

        maxId = i
      }
    }

  // max: 0.4444444444443434, maxId 1

  // Add a vote to max remainder.

    ++seats[maxId]// 第二项，即4的占比的坐席增加1

    remainder[maxId] = 0

    ++currentSum// 总的已分配的坐席数也加1
  }

  return seats[idx] / digits
}
