import Vue from 'vue'
import Vuex from 'vuex'
// import * as getters from './getters' // 导入响应的模块，*相当于引入了这个组件下所有导出的事例
import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)
const state = {
  projectManagementsList: '', // 项目列表
  staffInfo: {}, // 员工信息
  usersList: '', // 员工列表
  industryList: '', // 行业列表
  projectList: '', // 工程条件列表
  wareHouseData: {     //
    orderTime: ''
  }
}

const store = new Vuex.Store({
  state, // 共同维护的一个状态，state里面可以是很多个全局状态
  // getters, // 获取数据并渲染
  actions, // 数据的异步操作
  mutations // 处理数据的唯一途径，state的改变或赋值只能在这里
})

export default store
