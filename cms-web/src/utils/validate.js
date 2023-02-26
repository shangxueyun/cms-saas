/* eslint-disable space-before-function-paren */
/**
 * Created by jiachenpan on 16/11/18.
 */

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

export function toLocaleString(value) { // 金额
  if (!value || value === 0) {
    return 0
  }
  let str = value + ''
  if (str.indexOf('.') > 0) {
    // str = Number(str).toFixed(2) + ''
    // let parseInt = str.substring(0, str.indexOf('.'))
    // let floatNum = str.substring(str.indexOf('.'), str.length)
    // return Number(parseInt).toLocaleString() + floatNum
    let newstr = Number(str).toFixed(2)
    let before = newstr.split('.')[0]
    let after = newstr.split('.')[1]
    return Number(before).toLocaleString() + '.' + after
  } else {
    return Number(str).toLocaleString() + '.00'
  }
}

export function toLocaleFixed(value) { // 面积
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
 *  数组多维不就规则递归 ArrayRecursion
 * @param {arr} 数组递归
 * @param {obj} 条件对象
 * @param {child} 子集判断依据
 * @param {func} 回调函数
 */
export function ArrayRecursion(arr, sassCodeArr) {
  return JSON.stringify(arr, (key, value) => (Array.isArray(value) && value.map(v => {
    let label
    // 记录多个值
    if (sassCodeArr && v.parent) {
      if (window.sassCodeArr) {
        sassCodeArr.forEach(o => {
          if (v.sassCode === o) {
            window.sassCodeArr.push([v.parent.sassCode, v.sassCode])
          }
        })
      } else {
        window.sassCodeArr = []
        sassCodeArr.forEach(o => {
          if (v.sassCode === o) {
            window.sassCodeArr.push([v.parent.sassCode, v.sassCode])
          }
        })
      }
    }
    if (v.child && v.child.length) {
      v.onDisable = true
      label = v.name
    } else {
      v.child = null
      label = `${v.sassCode} (${v.name})`
    }
    v = Object.assign(v, {
      value: v.sassCode,
      label,
      disabled: v.onDisable,
      children: v.child
    })
  }), value), arr)
}

export var Calculator = (function () {
  /***************************************************************************
   * 计算生肖
   *
   * 支持简写生日，比如01，转换为2001，89转换为1989； 支持任何可以进行时间转换的格式，比如'1989/01/01','1989 01'等
   *
   */
  function getShengXiao(birth) {
    birth += ''
    var len = birth.length
    if (len < 4 && len !== 2) {
      return ''
    }
    if (len === 2) {
      birth - 0 > 30 ? birth = '19' + birth : birth = '20' + birth
    }
    var year = (new Date(birth)).getFullYear()
    var arrs = ['猴', '鸡', '狗', '猪', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊']
    var arr = ['MONKEY', 'ROOSTER', 'DOG', 'BOAR', 'RAT', 'OX', 'TIGER', 'HARE', 'DRAGON', 'SNAKE', 'HORSE', 'SHEEP']
    return /^\d{4}$/.test(year) ? arr[year % 12] : ''
  }

  /***************************************************************************
   * 计算星座
   *
   *
   */
  function getAstro(y, m, d) {
    var constellations = [{
      'Start': 121,
      'End': 220,
      'Name': '水瓶座',
      value: 'AQUARIUS'
    }, {
      'Start': 221,
      'End': 320,
      'Name': '双鱼座',
      value: 'PISCES'
    }, {
      'Start': 321,
      'End': 420,
      'Name': '白羊座',
      value: 'ARIES'
    }, {
      'Start': 421,
      'End': 520,
      'Name': '金牛座',
      value: 'TAURUS'
    }, {
      'Start': 521,
      'End': 620,
      'Name': '双子座',
      value: 'GEMINI'
    }, {
      'Start': 621,
      'End': 720,
      'Name': '巨蟹座',
      value: 'CANCER'
    }, {
      'Start': 721,
      'End': 820,
      'Name': '狮子座',
      value: 'LEO'
    }, {
      'Start': 821,
      'End': 920,
      'Name': '处女座',
      value: 'VIRGO'
    }, {
      'Start': 921,
      'End': 1020,
      'Name': '天秤座',
      value: 'LIBRA'
    }, {
      'Start': 1021,
      'End': 1120,
      'Name': '天蝎座',
      value: 'SCORPIO'
    }, {
      'Start': 1121,
      'End': 1220,
      'Name': '射手座',
      value: 'SAGITTATIUS'
    }, {
      'Start': 1221,
      'End': 1320,
      'Name': '摩羯座',
      value: 'CAPRICORN'
    }]
    /*
     * 判断日期有效性 1,3,5,7,8,10,12为31天 2月润年29，非润年28 4,6,9,11为30天
     */
    var daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    // 检测年份
    if (y < 1950 || y > 2099) {
      return ''
    }

    // 检测月份
    if (m < 1 || m > 12) {
      return ''
    }

    // 检测日期
    var mDays = daysInMonth[m - 1]
    // 如果是二月，要根据年份计算天数，不是二月时略过此计算
    if (m === 2) {
      mDays = GetSpecialDays(y)
    }

    // 判断日数据是不是在月份的有效天范围
    if (d < 0 || d > mDays) {
      return ''
    }

    // 好了，走到这一步，说明上面的验证都TM过了。
    // 这才判断是哪一个星座
    // 星座座标等于m*100 + d
    var pos = parseInt(m * 100) + parseInt(d)
    for (var i in constellations) {
      if (pos >= constellations[i].Start && pos <= constellations[i].End) {
        return constellations[i].value
      }
    }
  }
  // 根据年份计算二月天数
  function GetSpecialDays(y) {
    if (y % 400 === 0 || (y % 4 === 0 && y % 100 !== 0)) {
      return 29
    }
    return 28
  }

  /***************************************************************************
   * 计算年龄
   *
   * 支持传递["yyyy-MM-dd"]等格式的字符串
   *
   */
  function getAge(str) {
    var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/)
    if (r == null) {
      return false
    }
    var d = new Date(r[1], r[3] - 1, r[4])
    if (d.getFullYear() === r[1] && (d.getMonth() + 1) === r[3] && d.getDate() === r[4]) {
      var Y = new Date().getFullYear()
      return (Y - r[1])
    }
    return ''
  }

  /***************************************************************************
   * 计算指定时间与当前时间之间相差的年月日
   *
   * 参数：日期
   * 返回：x年x月x日 或 x年x日 或 x年x月
   */
  function dateBetween(start) {
    let end = new Date()
    let totalMonths = getProlepticMonth(end) - getProlepticMonth(start)
    let days = end.getDate() - start.getDate()
    if (totalMonths > 0 && days < 0) {
      totalMonths--
      let calcDate = start
      calcDate.setMonth(calcDate.getMonth() + totalMonths)
      days = toEpochDay(end) - toEpochDay(calcDate)
    } else if (totalMonths < 0 && days > 0) {
      totalMonths++
      days -= lengthOfMonth(end)
    }
    let years = parseInt(totalMonths / 12)
    let months = totalMonths % 12
    return (years > 0 ? years + '年' : '') + (months > 0 ? months + '月' : '') + (days > 0 ? days + '天' : '')
  }

  // 获取总月份数
  function getProlepticMonth(date) {
    return date.getFullYear() * 12 + date.getMonth()
  }

  // 获取总天数
  function toEpochDay(date) {
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    let day = date.getDate()
    let total = 0
    total += 365 * y
    if (y >= 0) {
      total += parseInt((y + 4) / 4) - parseInt((y + 100) / 100) + parseInt((y + 400) / 400)
    } else {
      total -= parseInt(y / -4) - parseInt(y / -100) + parseInt(y / -400)
    }
    total += parseInt((367 * m - 362) / 12)
    total += day - 1
    if (m > 2) {
      total--
      if (isLeapYear(date) === false) {
        total--
      }
    }
    return total - ((146097 * 5) - (30 * 365 + 7))
  }

  // 获取指定日期当月份的天数
  function lengthOfMonth(date) {
    let prolepticYear = date.getFullYear()
    let month = date.getMonth() + 1
    switch (month) {
      case 2:
        return ((isLeapYear(date)) ? 29 : 28)
      case 4:
      case 6:
      case 9:
      case 11:
        return 30
      default:
        return 31
    }
  }
  // 判断闰年、平年
  function isLeapYear(date) {
    let prolepticYear = date.getFullYear()
    return (prolepticYear % 4 === 0) && (prolepticYear % 100 !== 0 || prolepticYear % 400 === 0)
  }

  return {
    shengxiao: getShengXiao,
    astro: getAstro,
    age: getAge,
    dateBetween: dateBetween

  }
}())

// console.log(Calculator.shengxiao('2016-11-11'))
// console.log(Calculator.astro(2016, 11, 11))
// console.log(Calculator.age('2016-11-11'))

export function getLocalTime(nS) {
  // var date1 = '2015/05/01 00:00:00'  // 开始时间
  // var date2 = new Date()    // 结束时间
  // var date3 = date2.getTime() - new Date(date1).getTime()   // 时间差的毫秒数
  let date3 = nS
  // ------------------------------
  var subMinutes = Math.floor(date3 / (60 * 1000)) // 获取总共的分钟差

  // 计算出相差年数
  var year = Math.floor(date3 / (365 * 24 * 60 * 60 * 1000))
  // 计算年数后剩余的月
  var months1 = date3 % (365 * 24 * 60 * 60 * 1000)
  var months = Math.floor(months1 / (30 * 24 * 3600 * 1000))
  // 计算月数后剩余的天
  var days1 = date3 % (30 * 24 * 3600 * 1000)
  var days = Math.floor(days1 / (24 * 3600 * 1000))
  // 计算出小时数
  var leave1 = days1 % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000))
  // 计算相差分钟数
  var leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000))
  // 计算相差秒数
  var leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000)
  // let differDays = ' 相差 ' + year + '年' + months + '月' + days + '天 ' + hours + '小时 ' + minutes + ' 分钟' + seconds + ' 秒'
  let slyear = year === 0 ? '' : year + '年'
  let slmonths = months === 0 ? '' : months + '年'
  let sldays = days === 0 ? '' : days + '天'
  let differDays = slyear + slmonths + sldays
  console.log('differDays', differDays)
  return differDays
}

/* 正整数或两位小数 */

export function amountFormat(amount) {
  if (amount) {
    if (amount !== '' && amount.substr(0, 1) === '.') {
      amount = ''
    }
    amount = amount.replace(/^0*(0\.|[1-9])/, '$1') // 粘贴不生效
    amount = amount.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
    amount = amount.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
    amount = amount.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
    amount = amount.replace(/^(\\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
    if (amount.indexOf('.') < 0 && amount !== '') { // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      if (amount.substr(0, 1) === '0' && amount.length === 2) {
        amount = amount.substr(1, amount.length)
      }
    }
  }
  return amount
}

// 加密公钥
const key = `----`

// 加密
export function setEncrypt(msg) {
  const jsencrypt = new JSEncrypt()
  jsencrypt.setPublicKey(key)
  return jsencrypt.encrypt(msg)
}

// 解密私钥
// const privateKey = `---`
// let privateKey = localStorage.getItem('publicKey')

// 解密
export function decrypt(msg) {
  if (!msg) return
  // 解密私钥
  // const privateKey = `---`
  let privateKey = localStorage.getItem('publicKey')
  var verify = new JSEncrypt()
  // 替换为公钥，格式为：-----BEGIN PUBLIC KEY----- 公钥 -----END PUBLIC KEY-----
  verify.setPublicKey(privateKey)
  var verified = verify.decrypt(msg)
  return verified
}

export function getformat(str) { // 获取文件格式
  let i = str.lastIndexOf('.')
  if (i > -1) {
    let str1 = str.slice(i + 1).toLowerCase()
    switch (str1) {
      case 'pdf':
        return '#iconcms_PDF'
      case 'docx':
        return '#iconcms_word'
      case 'doc':
        return '#iconcms_word'
      case 'xlsx':
        return '#iconcms_excel'
      case 'xls':
        return '#iconcms_excel'
      case 'ppt':
        return '#iconcms_ppt'
      case 'pptx':
        return '#iconcms_ppt'
      case 'svg':
        return '#iconcms_shilianggeshi'
      case 'mp4':
        return '#iconcms_shipingeshi'
      case 'rmvb':
        return '#iconcms_shipingeshi'
      case 'mpeg':
        return '#iconcms_shipingeshi'
      case 'avi':
        return '#iconcms_shipingeshi'
      case 'mov':
        return '#iconcms_shipingeshi'
      case 'wmv':
        return '#iconcms_shipingeshi'
      case 'png':
        return '#iconcms_tupiangeshi'
      case 'jpg':
        return '#iconcms_tupiangeshi'
      case 'jpeg':
        return '#iconcms_tupiangeshi'
      case 'rar':
        return '#iconcms_yasuogeshi'
      case 'zip':
        return '#iconcms_yasuogeshi'
      case '7z':
        return '#iconcms_yasuogeshi'
      default:
        return '#iconcms_morenwenjian'
    }
  } else {
    return '#iconcms_morenwenjian'
  }
}

/**
 *  数组多维不就规则递归 ArrayRecursion
 * @param {arr} 数组递归
 * @param {obj} 条件对象
 * @param {child} 子集判断依据
 * @param {func} 回调函数
 */

// export function ArrayRecursion(arr, obj) {
//   return JSON.stringify(arr,
//       (key, value) => (Array.isArray(value) && value.map(v => {
//         var newobj = {}
//         for (let i in obj) {
//           if (obj[i] === 'code') {
//             let str = ''
//             for (let o in obj) {
//               str += `${v[obj[o]]},`
//             }
//             str = str.split(',')
//             str.pop()
//             newobj[i] = str.toString()
//           } else {
//             newobj[i] = v[obj[i]]
//           }
//         }
//         v = Object.assign(v, newobj)
//       }), value), arr)
// }

// /**
//  *  数组多维不就规则递归 ArrayRecursion
//  * @param {value} 匹配的值
//  * @param {arr} 数据
//  * @param {name} 判断对象字段名可以为逗号多字段 注意匹配的值固定是name[0]
//  * @param {child} 判断对象子集字段名
//  * @param {func} 回调函数
//  * @param {historyArr} 暂存数据
//  */
// export function upArrayRecursion(value, arr, name, child, func, historyArr) {
//   if (!historyArr) {
//     var historyArr = []
//   }
//   for (var i = 0; i < arr.length; i++) {
//     var itemArr = historyArr.concat()
//     if (typeof name === 'object') {
//       var str = ''
//       name.forEach((v, key) => {
//         if (key !== (name.length - 1))
//         str += `${arr[i][v]},`
//         else
//         str += `${arr[i][v]}`
//       })
//       itemArr.push(str)

//       if (value === arr[i][name[0]]) {
//         return itemArr
//       }
//     }
//     else {
//       itemArr.push(arr[i][name])
//       if (value === arr[i][name]) {
//         return itemArr
//       }
//     }
//     if (arr[i][child]) {
//       var returnFlg = func(value, arr[i][child], name, child, func, itemArr)
//       if (returnFlg)
//       return returnFlg
//     }
//   }
//   // if(path === undefined) {
//   //   path = [];
//   // }
//   // for(var i = 0; i < nodes.length; i++) {
//   //     var tmpPath = path.concat();
//   //     tmpPath.push(nodes[i].code);
//   //     if(leafId == nodes[i].code) {
//   //        return tmpPath;
//   //     }
//   //     if(nodes[i].children) {
//   //       var findResult = func(leafId, nodes[i].children, func, tmpPath);
//   //       if(findResult) {
//   //         return findResult;
//   //       }
//   //     }
//   // }
// }

// 商品类型拼接规则
export function goodTypeName(obj) {
  if (obj.goodsDepot) {
    return `${obj.goodsDepot.goodsType.parent.name}-${obj.goodsDepot.goodsType.name}-${obj.goodsDepot.goodsKind}`
  } else {
    return ''
  }

}
export function ArabiaToSimplifiedChinese(Num) {
  // for (i = Num.length - 1; i >= 0; i--) {
  //   Num = Num.replace(",", "") //替换Num中的“,”
  //   Num = Num.replace(" ", "") //替换Num中的空格
  // }
  if (isNaN(Num)) { //验证输入的字符是否为数字
    //alert("请检查小写金额是否正确");
    return;
  }
  //字符处理完毕后开始转换，采用前后两部分分别转换
  var part = String(Num).split(".");
  var newchar = "";
  //小数点前进行转化
  for (var i = part[0].length - 1; i >= 0; i--) {
    if (part[0].length > 10) {
      //alert("位数过大，无法计算");
      return "";
    } //若数量超过拾亿单位，提示
    var tmpnewchar = ""
    var perchar = part[0].charAt(i);
    switch (perchar) {
      case "0":
        tmpnewchar = "零" + tmpnewchar;
        break;
      case "1":
        tmpnewchar = "一" + tmpnewchar;
        break;
      case "2":
        tmpnewchar = "二" + tmpnewchar;
        break;
      case "3":
        tmpnewchar = "三" + tmpnewchar;
        break;
      case "4":
        tmpnewchar = "四" + tmpnewchar;
        break;
      case "5":
        tmpnewchar = "五" + tmpnewchar;
        break;
      case "6":
        tmpnewchar = "六" + tmpnewchar;
        break;
      case "7":
        tmpnewchar = "七" + tmpnewchar;
        break;
      case "8":
        tmpnewchar = "八" + tmpnewchar;
        break;
      case "9":
        tmpnewchar = "九" + tmpnewchar;
        break;
    }
    switch (part[0].length - i - 1) {
      case 0:
        tmpnewchar = tmpnewchar;
        break;
      case 1:
        if (perchar != 0) tmpnewchar = tmpnewchar + "十";
        break;
      case 2:
        if (perchar != 0) tmpnewchar = tmpnewchar + "百";
        break;
      case 3:
        if (perchar != 0) tmpnewchar = tmpnewchar + "千";
        break;
      case 4:
        tmpnewchar = tmpnewchar + "万";
        break;
      case 5:
        if (perchar != 0) tmpnewchar = tmpnewchar + "十";
        break;
      case 6:
        if (perchar != 0) tmpnewchar = tmpnewchar + "百";
        break;
      case 7:
        if (perchar != 0) tmpnewchar = tmpnewchar + "千";
        break;
      case 8:
        tmpnewchar = tmpnewchar + "亿";
        break;
      case 9:
        tmpnewchar = tmpnewchar + "十";
        break;
    }
    newchar = tmpnewchar + newchar;
  }
  //替换所有无用汉字，直到没有此类无用的数字为止
  while (newchar.search("零零") != -1 || newchar.search("零亿") != -1 || newchar.search("亿万") != -1 || newchar.search("零万") != -1) {
    newchar = newchar.replace("零亿", "亿");
    newchar = newchar.replace("亿万", "亿");
    newchar = newchar.replace("零万", "万");
    newchar = newchar.replace("零零", "零");
  }
  //替换以“一十”开头的，为“十”
  if (newchar.indexOf("一十") == 0) {
    newchar = newchar.substr(1);
  }
  //替换以“零”结尾的，为“”
  if (newchar.lastIndexOf("零") == newchar.length - 1) {
    newchar = newchar.substr(0, newchar.length - 1);
  }
  return newchar;
}
