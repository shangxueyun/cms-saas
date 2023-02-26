// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import context from './service'
import '@babel/polyfill'
import plugin from './utils/plugin'
import './style/base.scss'
import VueDND from 'awe-dnd'
import 'swiper/dist/css/swiper.css'
import ElementUI from 'element-ui'
import vueSeamless from 'vue-seamless-scroll'
import VueEllipseProgress from 'vue-ellipse-progress'

Vue.use(VueEllipseProgress)

Vue.use(vueSeamless)
// import { Tree, Submenu, Menu } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import './assets/ocxfun'

Vue.config.productionTip = false
// Vue.use(Tree)
// Vue.use(Submenu)
Vue.use(ElementUI)
Vue.use(plugin)
Vue.use(VueDND);
(async function () {
  await context.initialize()
  // let online = await context.initialize()
  /* eslint-disable no-new */
  // document.title = context.local.get('companyShortName') + '-小象商业管理系统'

  const dvToken = sessionStorage.getItem('token')
  if (dvToken) {
    localStorage.setItem('token', dvToken)
  }
})()

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
