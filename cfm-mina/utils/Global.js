/*
 * @Author: your name
 * @Date: 2021-07-27 10:35:02
 * @LastEditTime: 2021-07-29 15:43:53
 * @LastEditors: shangXueYun
 * @Description: In User Settings Edit
 * @FilePath: \cfm-mina\utils\Global.js
 */
import Toast from '@vant/weapp/toast/toast'


/**
 * @description: 
 * @param {*} option
 * @return {*}
 */
const showLoading = function (option) {
  let config = Object.assign({
    type: 'loading', // loading success fail html
    message: '加载中...',
    duration: 0,
    selector: '#van-toast',
    forbidClick: true,
    loadingType: 'spinner',
  }, option)
  // 自定义加载图标
  Toast.loading(config)
} 

/**
 * @description: hideLoading
 * @param {*}
 * @return {*}
 */
const hideLoading = function () {
  Toast.clear()
}

/**
 * @description: 
 * @param {*} option
 * @return {*}
 */
const showInfo = function (option) {
  let config = Object.assign({
    type: 'text', // loading success fail html
    position: 'top', // top middle bottom
    message: '消息提示'
  }, option)
  config.selector = `Global_message-${option ? option.style : 'info'}`
  // 自定义加载图标
  Toast.loading(config)
}

export {
  showLoading,
  hideLoading,
  showInfo
}

export const isUndefined = (val)=> {
  return val === void 0
}