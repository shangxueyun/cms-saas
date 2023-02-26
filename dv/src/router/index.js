import Vue from 'vue'
import Router from 'vue-router'
import businessOperation from '../views/businessOperation/index.vue'
import businessChj from '../views/businessOperation/chj.vue'
import businessTemplate3 from '../views/businessOperation/template3.vue'
import businessTemplate3Park from '../views/businessOperation/template3Park.vue'
import switchScreen from '../views/switchScreen/index.vue'
import projectlist from '../views/switchScreen/ProjectList.vue'
import comprehensive from '../views/comprehensive/index.vue'
import estateManagement from '../views/estateManagement/index.vue'
import monitor from '../views/monitor/index.vue'
import VegetableMarket from '../views/VegetableMarket/index.vue'
import tenantDetailsBusiness from '../views/businessOperation/tenantDetailsBusiness.vue'
import tenantDetailsWork from '../views/businessOperation/tenantDetailsWork.vue'
import AgriculturalTrade from '../views/AgriculturalTrade/index.vue'
import park from '../views/park/index.vue'
import digitizationHQ from '../views/digitizationHQ/index.vue'
// import Layout from '@/views/layout/Layout'
// import context from '../service'
Vue.use(Router)
const router = new Router({
  routes: [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/businessForChj',
    name: 'businessChj',
    component: businessChj,
    meta: {
      title: 'businessChj'
    }
  },
  {
    path: '/businessOperation',
    name: 'businessOperation',
    component: businessOperation,
    meta: {
      title: 'businessOperation'
    }
  },
  {
    path: '/VegetableMarket',
    name: 'VegetableMarket',
    component: () => import('@/views/VegetableMarket/index.vue'),
    meta: {
      title: '七宝镇数字化菜场管理'
    }
  }, {
    path: '/businessForTemplate3',
    name: 'businessTemplate3',
    component: businessTemplate3,
    meta: {
      title: '商业经营数据模版3'
    }
  }, {
    path: '/businessTemplate3Park',
    name: 'businessTemplate3Park',
    component: businessTemplate3Park,
    meta: {
      title: '园区商业经营数据'
    }
  }, {
    path: '/switchScreen',
    name: 'switchScreen',
    component: switchScreen,
    meta: {
      title: 'switchScreen'
    }
  }, {
    path: '/projectlist',
    name: 'projectlist',
    component: projectlist,
    meta: {
      title: 'projectlist'
    }
  }, {
    path: '/comprehensive',
    name: 'comprehensive',
    component: comprehensive,
    meta: {
      title: 'comprehensive'
    }
  }, {
    path: '/estateManagement',
    name: 'estateManagement',
    component: estateManagement,
    meta: {
      title: 'estateManagement'
    }
  }, {
    path: '/monitor',
    name: 'monitor',
    component: monitor,
    meta: {
      title: 'Monitor'
    }
  }, {
    path: '/VegetableMarket',
    name: 'VegetableMarket',
    component: VegetableMarket,
    meta: {
      title: 'VegetableMarket'
    }
  }, {
    path: '/tenantDetailsBusiness',
    name: 'tenantDetailsBusiness',
    component: tenantDetailsBusiness,
    meta: {
      title: 'tenantDetailsBusiness'
    }
  }, {
    path: '/tenantDetailsWork',
    name: 'tenantDetailsWork',
    component: tenantDetailsWork,
    meta: {
      title: 'tenantDetailsWork'
    }
  }, {
    path: '/agriculturalTrade',
    name: 'AgriculturalTrade',
    component: AgriculturalTrade,
    meta: {
      title: 'AgriculturalTrade'
    }
  }, {
    path: '/park',
    name: 'park',
    component: park,
    meta: {
      title: '园区经营数据'
    }
  },
  {
    path: '/visualization',
    name: 'visualization',
    component: () => import('@/views/visualization/index.vue'),
    meta: {
      title: '七宝镇数字化管理'
    }
  }, {
    path: '/digitizationHQ',
    name: 'digitizationHQ',
    component: digitizationHQ,
    meta: {
      title: '虹桥镇数字化管理'
    }
  }
  ]
})
// router.beforeEach((to, from, next) => {
//   // 登录验证
//   if (localStorage.getItem('user') || to.name === 'login') {
//     next()
//   } else {
//     next({name: 'login'})
//   }
// })
export default router
