// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import plugin from './utils/plugin'
import context from './service'
import ElementUI from 'element-ui'
import md5 from 'js-md5'
import './style/base.scss'
import './style/common.scss'
import $ from 'jquery'
import 'element-ui/lib/theme-chalk/index.css'
import Video from 'video.js'
import 'video.js/dist/video-js.css'
import VueDND from 'awe-dnd'
import echarts from 'echarts'
import '@babel/polyfill'
import store from './store'
import Vue2OrgTree from 'vue2-org-tree'
import 'vue2-org-tree/dist/style.css'
import Socket from './utils/socket'
import XLSX from 'xlsx/dist/xlsx.full.min'
import './utils/protocolcheck.js'
Vue.prototype.$video = Video
Vue.config.productionTip = false
Vue.prototype.$Socket = Socket
Vue.use(plugin)
Vue.use(ElementUI)
Vue.use(VueDND)
Vue.use(Vue2OrgTree)
Vue.prototype.$echarts = echarts
Vue.prototype.md5 = md5;
(async function () {
  await context.initialize()
  // let online = await context.initialize()
  /* eslint-disable no-new */
  document.title = context.local.get('companyShortName') ? context.local.get('companyShortName') + '-小象商业管理系统' : '' + '-小象商业管理系统'
})()
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
