// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import plugin from './utils/plugin'
import context from './service'
import Mint from 'mint-ui'
import md5 from 'js-md5'
import './style/base.scss'
import VueDND from 'awe-dnd'
import '@babel/polyfill'
// import store from './store'
import 'mint-ui/lib/style.css'
// import F2 from '@antv/f2'
import F2 from './utils/F2config'
import {
  Step,
  Steps,
  Dialog,
  Switch,
  RadioGroup,
  Radio,
  Cell,
  Picker,
  Toast
} from 'vant'
import vueMiniPlayer from 'vue-mini-player'
import 'vue-mini-player/lib/vue-mini-player.css'
import VueDragResize from 'vue-drag-resize' // 缩放、拖拽
import AlloyFinger from 'alloyfinger'
import AlloyFingerPlugin from 'alloyfinger/vue/alloy_finger_vue'
Vue.use(AlloyFingerPlugin, {
  AlloyFinger
})
Vue.component('vue-drag-resize', VueDragResize)
Vue.use(vueMiniPlayer)

Vue.prototype.$F2 = F2
Vue.config.productionTip = false
Vue.use(plugin)
Vue.use(VueDND)
Vue.use(Mint)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Switch)
Vue.use(Dialog)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Cell)
Vue.use(Picker)
Vue.use(Toast)
Vue.prototype.md5 = md5;
(async function () {
  await context.initialize()
  // let online = await context.initialize()
  /* eslint-disable no-new */
  document.title = context.local.get('companyShortName') ? context.local.get('companyShortName') + '-小象商业管理系统' : '' + '-小象商业管理系统'

  // app扫描结果
  window.scanResult = function (code) {
    if (!navigator.onLine) {
      let code = '网络延迟'
      window.location.href = `#/WriteOffFailure?res=${code}`
    } else if (code) {
      window.location.href = `#/WriteOff?code=${code}`
    } else {
      let code = '网络延迟'
      window.location.href = `#/WriteOffFailure?res=${code}`
    }
  }
  // scanResult()
  // app消息推送全局函数
  window.onCidReady = function (cid) {
    let postData = {
      clientId: cid
    }
    if (context.user.current.id) {
      postData.userId = context.user.current.id
    }
    // Mint.Toast(`userId:${postData.userId}---clientId:${postData.clientId}`)
    context.http.post('mps/api/user-devices', postData)
  }
})()
new Vue({
  el: '#app',
  router,
  // store,
  template: '<App/>',
  components: {
    App
  }
})
