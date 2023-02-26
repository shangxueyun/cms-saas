let _this = this
class Common {
  GetQueryValue (queryName) {
    console.log('x')
    var query = decodeURI(this.$route.query[queryName])
    var vars = query.split('&')
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=')
      if (pair[0] === queryName) { return pair[1] }
    }
    return null
  }
  imageRatio (width, height) {
    height = height || document.body.clientHeight
    let windowWidth = parseInt(document.body.clientWidth)
    let ratio = windowWidth / 375
    let imageWidth = parseInt(ratio * width * 2)
    let imageHeight = parseInt(ratio * height * 2)
    return { width: imageWidth, height: imageHeight }
  }
  getformat (str) { // 获取文件格式
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
}
export default new Common()
