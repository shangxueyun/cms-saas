<template>
  <div class="tenantList"
       :class="{'focus':focus}">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="onGoBack"></i>
      <div class="headTab">
        <!-- <span @click="tabChange(item)"
              v-for="item in tabList"
              :key="item"
              :class="tabActive === item ? 'active' : ''">{{item}}</span> -->
        <span :class="tabActive === '客户平面图' ? 'active' : ''"
              @click="tabChange('客户平面图')"
              v-if="hasAuthority('02030101')"
              >客户平面图</span>
        <span :class="tabActive === '租控图' ? 'active' : ''" 
              @click="tabChange('租控图')"
              v-if="hasAuthority('02030106')"
              >租控图</span>
        <span :class="tabActive === '客户列表' ? 'active' : ''"
              @click="tabChange('客户列表')"
              v-if="hasAuthority('02030102')"
              >客户列表</span>
      </div>
      <div class="addBtn"
           @click="showActionSheet">
        <i class="iconfont iconcms_shaixuan"></i>
      </div>
    </div>
    <div class="seachInput">
      <form @submit.prevent
            action="#">
        <input class="input"
               id="seachInput"
               results="5"
               focus
               placeholder="请输入客户名称"
               type="search"
               v-model="inputValue"
               @input="onKeyInput"
               @compositionstart="compositions(false)"
               @compositionend="compositions(true)"
               @keyup.13="onKeyInput"
               @keypress="search" />
      </form>
      <i class="mintui mintui-search"></i>
    </div>
    <div v-if="currentOrganize.name"
         class="selectResult"
         @click="showActionSheet">
      <span>{{currentOrganize.name}}</span>
      <span>{{currentProject.referred}}</span>
      <span>{{currentBuilding.buildingName}}</span>
      <span>{{currentOptions4.label}}</span>
    </div>
    <div class="content common_list ">
      <mt-loadmore ref="loadmore"
                   :bottom-method="loadBottom"
                   :autoFill="false"
                   :bottom-all-loaded="allLoaded">
        <ul>
          <li v-for="(item,index) in tableData"
              :key="index"
              @click="toTenantDetails(item.id)">
            <div>
              <span class="shopNb">{{item.teantName}}</span>
            </div>
            <!-- <div>
              <span>品牌：{{item.referred}}</span>
              <span>合约状态：{{tenantContractType(item.tenantContractStatus)}}</span>
            </div> -->
            <div>
              <span>联系人：{{item.contact}}
                <span v-show="item.telephone">({{item.telephone}})</span></span>
            </div>
            <span class="iconfont iconright"></span>
          </li>
        </ul>
      </mt-loadmore>

      <div class="loadAll"
           v-if="allLoaded && tableData.length!==0">
        <span>-</span>
        <p>已经到底了</p>
        <span>-</span>
      </div>
      <div class="noData"
           v-if="tableData.length===0 && dataReady">
        <img src="../../../../assets/nores.png">
        <p>暂无数据</p>
      </div>
    </div>
    <!-- 右侧筛选 -->
    <van-popup v-model="popupShow"
               class="popup_common"
               :overlay-style="{'background-color': 'rgba(0,0,0,.4)'}"
               :style="{ height: '100%' }"
               position="right">
      <p class="popup_title">筛选</p>
      <div class="popup_container">
        <div class="popup_list">
          <p>管理企业</p>
          <ul>
            <li v-for="(item, index) in organizesList"
                :key="item.id"
                @click="selectOrganizes(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>项目</p>
          <ul>
            <li v-for="(item, index) in projectManagementList"
                :key="index"
                @click="selectProject(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.referred }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>楼宇</p>
          <ul>
            <li v-for="(item, index) in buildingList"
                :key="item.id"
                @click="selectBuilding(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.buildingName }}</span>
            </li>
          </ul>
        </div>
        <!-- <div class="popup_list">
          <p>类型</p>
          <ul>
            <li v-for="(item, index) in options1"
                :key="index"
                @click="selectOption1(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>用途</p>
          <ul>
            <li v-for="(item, index) in options2"
                :key="index"
                @click="selectOption2(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list"
             v-if="options22.length">
          <p>行业</p>
          <ul>
            <li v-for="(item, index) in options22"
                :key="index"
                @click="selectOption22(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>合约状态</p>
          <ul>
            <li v-for="(item, index) in options3"
                :key="index"
                @click="selectOption3(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </div> -->
        <div class="popup_list">
          <p>状态</p>
          <ul>
            <li v-for="(item, index) in options4"
                :key="index"
                @click="selectOption4(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="popup_buttons">
        <div @click="submit('reset')"
             class="popup_default">重置</div>
        <div @click="submit"
             class="popup_active">确定</div>
      </div>
    </van-popup>
    <div v-show="shadeBox"
         @touchmove.prevent
         class="shadeBox"></div>
  </div>
</template>
<script>
// import AppHeader from '@/components/appHead'
import context from '@/service'
import { toLocaleFixed } from '@/utils/validate.js'
import Vue from 'vue'
import { Popup } from 'vant'
import { Toast } from 'mint-ui'
Vue.use(Popup)
let roterFrom = null
const allOrganizesObj = {
  id: '',
  name: '全部企业',
  checked: false
}
const allProjectObj = {
  id: '',
  referred: '全部项目',
  checked: false
}
const allBuildingsObj = {
  id: '',
  buildingName: '全部楼宇',
  checked: true
}
const allFloorsObj = {
  id: '',
  name: '全部楼层',
  checked: true
}
export default {
  name: 'tenantList',
  footVisible: true,
  components: {},
  props: ['scrollTop'],
  watch: {
    scrollTop (val) {
      this.scrollVal = val
    }
  },
  data () {
    return {
      scrollVal: 0,
      inputValue: '',
      flag: true,
      shadeBox: false,
      focus: false,
      popupShow: false,
      organizesList: [],
      projectManagementList: [],
      buildingList: [],
      currentOrganize: {},
      currentProject: {},
      currentBuilding: {},
      tabList: ['客户平面图', '租控图', '客户列表'],
      tabActive: '客户列表',
      options4: [ // 数据状态
        { value: 'USING', label: '使用中', checked: true },
        { value: 'DISABLE', label: '已停用', checked: false }
      ],
      currentOptions4: {
        label: '使用中',
        value: 'USING'
      },
      onRent: null,
      investmentStatus: '',
      dataReady: false,
      allLoaded: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pgSize: 15
    }
  },
  beforeRouteEnter (to, from, next) {
    roterFrom = from.name
    next()
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'index') {
      window.sessionStorage.removeItem('scrollVal')
    }
    next()
  },
  activated () {
    if (roterFrom === 'TenantDetails') {
      let scrollVal = window.sessionStorage.getItem('scrollVal')
      if (scrollVal) {
        this.$emit('changeScroll', scrollVal)
      }
    } else {
      window.sessionStorage.removeItem('scrollVal')
      this.$emit('changeScroll', 0)
      // this.getOrganizes('init')
      this.inputValue = ''
      this.getOrganizesInit()
    }
  },
  created () {
    // this.queryProjectManagement()
    let currObj = JSON.parse(sessionStorage.getItem('currObj'))
    if (sessionStorage.getItem('currObj')) {
      this.currentProject = currObj.currentProject
      // this.currentOptions1 = currObj.currentOptions1
      // this.currentOptions2 = currObj.currentOptions2
      // this.currentOptions22 = currObj.currentOptions22
      // this.currentOptions3 = currObj.currentOptions3
      this.currentOptions4 = currObj.currentOptions4
    }
  },
  beforeDestroy () {
  },
  mounted () {

  },
  methods: {
    async getOrganizesInit () { // 管理企业获取接口
      // 管理企业
      let res = await context.http.get('uaa/api/organizes/enterprise/user', { useStatus: 'USING', organizeType: 'ENTERPRISE' })
      this.organizesList = res.data
      this.organizesList.unshift(allOrganizesObj)
      if (this.organizesList && this.organizesList[1]) {
        this.organizesList[1].checked = true
        this.currentOrganize = this.organizesList[1]
      }
      if (this.organizesList.length && this.$route.params && this.$route.params.organizeId) {
        let temp
        let id = this.$route.params.organizeId
        this.organizesList.forEach((item, index) => {
          if (item.id === id) {
            temp = index
          }
        })
        if (temp) {
          this.currentOrganize = this.organizesList[temp]
          this.organizesList[1].checked = false
          this.organizesList[temp].checked = true
        }
      }
      // 项目
      this.projectManagementList = []
      this.currentProject = {}
      let id = this.currentOrganize.id ? this.currentOrganize.id : ''
      let res1 = await context.http.get('cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: id })
      this.projectManagementList = res1.data
      this.projectManagementList.unshift(allProjectObj)
      if (this.projectManagementList && this.projectManagementList[1]) {
        this.projectManagementList[1].checked = true
        this.currentProject = this.projectManagementList[1]
        this.currentProjectId = this.projectManagementList[1].id
      }
      if (this.projectManagementList.length && this.$route.params && this.$route.params.projectManagementId) {
        let temp
        let id = this.$route.params.projectManagementId
        this.projectManagementList.forEach((item, index) => {
          if (item.id === id) {
            temp = index
          }
        })
        if (temp) {
          this.currentProject = this.projectManagementList[temp]
          this.currentProjectId = this.projectManagementList[temp].id
          this.projectManagementList[1].checked = false
          this.projectManagementList[temp].checked = true
        }
      }
      this.buildingList = []
      // 楼宇
      this.currentBuilding = {}
      let result = await context.http.get(`cms/api/project/${this.currentProject.id}/buildings`, { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING' })
      let listOptions = result.data.filter((item, index) => {
        return item.assetsType === 'BUILDING'
      })
      listOptions.unshift(allBuildingsObj)
      if (listOptions[0]) listOptions[0].checked = true
      this.buildingList = listOptions
      this.currentBuilding = this.buildingList[0] ? this.buildingList[0] : {}
      if (this.buildingList.length && this.$route.params && this.$route.params.buildingId) {
        let temp
        let id = this.$route.params.buildingId
        this.buildingList.forEach((item, index) => {
          if (item.id === id) {
            temp = index
          }
        })
        if (temp) {
          this.currentBuilding = this.buildingList[temp]
          this.buildingList[0].checked = false
          this.buildingList[temp].checked = true
        }
      }
      // 楼层
      this.floorsList = []
      this.currentfloors = {}
      let result1 = await context.http.get(`cms/api/floors/svg/`, { projectManagementId: this.currentProject.id, buildingId: this.currentBuilding.id })
      result1.data.unshift(allFloorsObj)
      if (result1.data[0]) result1.data[0].checked = true
      this.floorsList = result1.data
      this.currentfloors = result1.data[0] ? result1.data[0] : {}
      if (this.floorsList.length) {
        let defultFloorName = ''
        let ind = 0
        this.floorsList.forEach((item, index) => {
          if (item.name === '1' || item.name === '一层' || item.name === '一' || item.name === '1层') {
            defultFloorName = item.name
            ind = index
          }
        })
        this.floorsList[0].checked = false
        this.floorsList[ind].checked = true
        this.currentfloors = this.floorsList[ind]
      }
      this.selectOption4(0, this.options4[0])
      this.currentOptions4 = {
        label: '使用中',
        value: 'USING'
      }
      this.query(true)
    },
    tabChange (item) {
      let searchObj = {
        organizeId: this.currentOrganize.id,
        projectManagementId: this.currentProject.id,
        buildingId: this.currentBuilding.id,
        floorId: null
      }
      if (item === '客户平面图') {
        this.$router.replace({ name: 'customerPlan', params: searchObj })
        return
      } else if (item === '租控图') {
        this.$router.replace({ name: 'rentControlChart', params: searchObj })
        return
      } else if (item === '客户列表') {
        return
      }
    },
    toTenantDetails (id) {
      if (this.hasAuthority('02030104')) {
        let obj = {}
        obj.currentProject = this.currentProject
        // obj.currentOptions1 = this.currentOptions1
        // obj.currentOptions2 = this.currentOptions2
        // obj.currentOptions22 = this.currentOptions22
        // obj.currentOptions3 = this.currentOptions3
        obj.currentOptions4 = this.currentOptions4
        sessionStorage.setItem('currObj', JSON.stringify(obj))
        window.sessionStorage.setItem('scrollVal', this.scrollVal)
        setTimeout(() => {
          this.$router.push({ name: 'TenantDetails', query: { 'tenantID': id } })
          console.log('xxxx')
        }, 200)
      } else {
        Toast({
          message: '你的账号没有查看客户详情的权限',
          position: 'top'
        })
      }
    },
    async showActionSheet () {
      if (this.currentOrganize.id && this.currentOrganize.id !== '') {
        this.organizesList = this.organizesList.map((item, index) => {
          item.checked = false
          if (item.id === this.currentOrganize.id) item.checked = true
          return item
        })
      } else {
        this.organizesList[0].checked = true
      }
      if (this.currentOrganize.id) {
        let res1 = await context.http.get('cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: this.currentOrganize.id })
        res1.data.unshift(allProjectObj)
        this.projectManagementList = res1.data.map((item, index) => {
          item.checked = false
          if (item.id === this.currentProject.id) item.checked = true
          return item
        })
      } else {
        this.projectManagementList = []
        this.projectManagementList.unshift(allProjectObj)
        this.projectManagementList[0].checked = true
      }
      if (this.currentProject.id) {
        let res2 = await context.http.get(`cms/api/project/${this.currentProject.id}/buildings`, { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING' })
        this.buildingList = res2.data.filter((item, index) => {
          return item.assetsType === 'BUILDING'
        })
        this.buildingList.unshift(allBuildingsObj)
        this.buildingList = this.buildingList.map(item => {
          item.checked = false
          if (item.id === this.currentBuilding.id) item.checked = true
          return item
        })
      } else {
        this.buildingList = []
        this.buildingList.unshift(allBuildingsObj)
        this.buildingList[0].checked = true
      }
      this.options4 = this.options4.map(item => {
        item.checked = false
        if (item.value === this.currentOptions4.value) item.checked = true
        return item
      })
      this.popupShow = !this.popupShow
    },
    query (flag) {
      this.dataReady = false
      if (flag) this.currentPage = 1; this.allLoaded = false
      context.http.get('cms/api/tenant',
        {
          page: (this.currentPage - 1),
          size: this.pgSize,
          sort: 'id,desc',
          id: this.currentProject.id,
          organizeId: this.currentOrganize.id,
          buildingId: this.currentBuilding.id,
          useStatus: this.currentOptions4.value,
          queryWord: this.inputValue
        }).then(res => {
          this.dataReady = true
          if (flag) {
            this.tableData = res.data.content
          } else {
            this.tableData = this.tableData.concat(res.data.content)
          }
          this.total = res.data.totalElements
          // this.total = Number(res.headers['x-total-count'])
          if (this.currentPage === Math.ceil(this.total / this.pgSize) || this.currentPage > Math.ceil(this.total / this.pgSize)) {
            this.allLoaded = true// 若数据已全部获取完毕
            console.log('全部获取完毕')
          }
        })
    },
    async getOrganizes () { // 管理企业获取接口
      let res = await context.http.get('uaa/api/organizes/enterprise/user', { useStatus: 'USING', organizeType: 'ENTERPRISE' })
      res.data.unshift(allOrganizesObj)
      this.organizesList = res.data
      let orgId
      if (this.organizesList && this.organizesList[1]) {
        this.organizesList[1].checked = true
        orgId = this.organizesList[1].id
      } else {
        this.organizesList[0].checked = true
      }
      this.organizesChange(orgId)
    },
    async organizesChange (id) { // 管理企业查名下项目
      this.projectManagementList = [{
        id: '',
        referred: '全部项目',
        checked: true
      }]
      this.buildingList = [{
        id: '',
        buildingName: '全部楼宇',
        checked: true
      }]
      let res = await context.http.get('cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: id })
      res.data.unshift(allProjectObj)
      this.projectManagementList = res.data
      let proId = ''
      this.projectManagementList[0].checked = true
      if (this.projectManagementList && this.projectManagementList[1]) {
        this.projectManagementList[1].checked = true
        this.projectManagementList[0].checked = false
        proId = this.projectManagementList[1].id
      }
      this.getBuliding(proId)
    },
    async getBuliding (id) { // 楼宇
      this.buildingList = [{
        id: '',
        buildingName: '全部楼宇',
        checked: true
      }]
      let result = await context.http.get(`cms/api/project/${id}/buildings`, { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING' })
      let listOptions = result.data.filter((item, index) => {
        return item.assetsType === 'BUILDING'
      })
      listOptions.unshift({
        id: '',
        buildingName: '全部楼宇',
        checked: true
      })
      this.buildingList = listOptions
      if (listOptions[1]) {
        listOptions[1].checked = true
        listOptions[0].checked = false
      }
      this.selectOption4(0, this.options4[0])
    },
    async selectOrganizes (index, item) {
      this.organizesList = this.checkedFormat(index, this.organizesList)
      this.organizesChange(this.organizesList[index].id)
    },
    async selectProject (index, item) {
      this.projectManagementList = this.checkedFormat(index, this.projectManagementList)
      this.getBuliding(this.projectManagementList[index].id)
    },
    async selectBuilding (index, item) {
      this.buildingList = this.checkedFormat(index, this.buildingList)
      this.selectOption4(0, this.options4[0])
    },
    async queryProjectManagement () {
      const res = await context.http.get('cms/api/project-managements', { useStatus: 'USING' })
      res.data.unshift({ id: '', referred: '全部项目' })
      res.data[1].checked = true
      this.projectManagementList = res.data
      let currObj = JSON.parse(sessionStorage.getItem('currObj'))
      if (sessionStorage.getItem('currObj')) {
        this.currentProject = currObj.currentProject
      } else {
        this.currentProject = res.data[1]
      }
      this.query()
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    tenantContractType (val) {
      if (val) {
        if (val === 'NO_CONTRACT') {
          return '无合约'
        } else if (val === 'WITHDRAWAL') {
          return '已退租'
        } else if (val === 'IN_THE_CONTRACT') {
          return '合约中'
        }
      }
    },
    loadBottom () {
      this.currentPage++
      this.query()
      this.$refs.loadmore.onBottomLoaded()
    },
    onKeyInput (event) { // 输入
      if (event.keyCode !== 13 && this.flag) {
        this.shadeBox = false
        this.currentPage = 0
        this.tableData = []
        this.$nextTick(() => {
          this.query(true)
        })
      }
    },
    compositions (flag) {
      this.flag = flag
    },
    search (event) { // 键盘完成事件
      if (event.keyCode === 13) {
        event.preventDefault() // 禁止默认事件（默认是换行）
        this.inputValue = event.target.value
        this.currentPage = 0
        this.tableData = []
        this.query(true)
      }
    },
    selectOption1 (index, item) {
      this.options1 = this.checkedFormat(index, this.options1)
    },
    selectOption2 (index, item) {
      this.options2 = this.checkedFormat(index, this.options2)
      // this.options22ShowFn()
      if (item.value) {
        // this.industry(item.value)
      }
    },
    options22ShowFn () {
      let c = this.options2.find((item, index) => {
        return item.checked
      })
      // console.log(c)
      if (c.value === '' || c.label === '全部用途') {
        this.options22Show = false
        this.options22 = []
        this.currentOptions22 = { value: '', label: '' }
      } else {
        this.options22Show = true
      }
    },
    selectOption22 (index, item) {
      this.options22 = this.checkedFormat(index, this.options22)
    },
    selectOption3 (index, item) {
      this.options3 = this.checkedFormat(index, this.options3)
    },
    selectOption4 (index, item) {
      this.options4 = this.checkedFormat(index, this.options4)
    },
    checkedFormat (i, arr) {
      arr = arr.map(item => {
        item.checked = false
        return item
      })
      arr[i].checked = true
      return arr
    },
    async industry (name) {
      let result = await context.http.get(`uaa/api/paramet-managements/name?name=${name}`)
      this.options22 = result.data.map((item, index) => {
        let c = !index
        return { value: item.id, label: item.value, checked: c }
      })
      this.currentOptions22 = this.options22[0]
      // console.log(this.currentOptions22)
    },
    async submit (state) {
      if (state === 'reset') {
        if (this.organizesList && this.organizesList[1]) {
          this.selectOrganizes(1, this.organizesList[1])
        } else {
          this.selectOrganizes(0, this.organizesList[0])
        }
        return
      } else {
        // if (!this.organizesList.length || !this.projectManagementList.length || !this.buildingList.length) {
        //   this.popupShow = false
        //   return
        // }
        this.currentOrganize = this.organizesList.filter(item => item.checked)[0] ? this.organizesList.filter(item => item.checked)[0] : {id: ''}
        this.currentProject = this.projectManagementList.filter(item => item.checked)[0] ? this.projectManagementList.filter(item => item.checked)[0] : {id: ''}
        this.currentBuilding = this.buildingList.filter(item => item.checked)[0] ? this.buildingList.filter(item => item.checked)[0] : {id: ''}
        this.currentOptions4 = this.options4.filter(item => item.checked)[0]
        this.tableData = []
        this.query()
        this.popupShow = false
      }
    },
    onGoBack () { // 返回首页
      sessionStorage.removeItem('currObj')
      this.$router.push({ name: 'index' })
    }
  }
}
</script>
<style scoped lang="scss" >
@import "../../../../style/config";
.tenantList {
  &.focus {
    .input {
      width: rem(300) !important;
    }
    .seachInput {
      top: 0 !important;
      border-top: 0;
    }
    .selectResult {
      top: rem(50);
    }
    .common_list {
      padding-top: rem(78);
    }
    .shadeBox {
      height: calc(100% - #{$foot-height});
      position: fixed;
      left: 0;
      top: $foot-height;
      width: 100%;
      background: rgba(0, 0, 0, 0.2);
      z-index: 2;
    }
  }
  .common_list {
    padding-top: rem(118);
    li {
      padding: rem(14);
      background-color: #ffffff;
      margin-bottom: rem(10);
      position: relative;
      > div {
        display: flex;
        flex-wrap: wrap;
        &:first-child {
          justify-content: space-between;
          margin-bottom: rem(8);
          font-size: rem(15);
          color: #444547;
          .shopNb {
            font-weight: bold;
            color: #18191a;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .shopType {
            &.weizu {
              color: #fc5159;
            }
            &.yizu {
              color: #1cc296;
            }
            &.ziyong {
              color: #444547;
            }
          }
        }
        &:nth-child(2) {
          flex-direction: column;
          color: #858c94;
          font-size: rem(14);
          > span {
            margin-bottom: rem(8);
          }
        }
      }
      .iconright {
        position: absolute;
        right: rem(14);
        top: 50%;
        margin-top: rem(-10);
        font-size: rem(14);
        color: #c6c6c6;
      }
    }
  }
  .seachInput {
    height: $foot-height;
    width: 100%;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    padding: 0 rem(15);
    position: fixed;
    top: rem(40);
    z-index: 3;
    #seachInput::-webkit-search-cancel-button {
      display: none;
    }
    .mintui-search {
      position: absolute;
      left: rem(20);
      top: rem(18);
      color: #666666;
    }
    .input {
      // width: rem(300);
      width: rem(345);
      height: rem(30);
      background: rgba(244, 244, 244, 1);
      border-radius: rem(2);
      padding-left: rem(25);
      font-size: rem(13);
    }
    .cannelBtn {
      color: #0139a4;
      font-size: rem(15);
      margin-left: rem(10);
    }
  }
  .head {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: rem(40);
    line-height: rem(40);
    overflow: hidden;
    text-align: center;
    font-size: rem(16);
    background: #fff;
    display: flex;
    justify-content: space-between;
    z-index: 9;
    box-shadow: 0px 1px 4px 0px rgba(230, 230, 230, 0.5);
    .headTab {
      color: #444547;
      font-size: rem(16);
      max-width: rem(230);
      display: flex;
      justify-content: space-between;
      > span {
        position: relative;
        margin-right: rem(10);
        &.active {
          color: #0139a4;
          border-bottom: rem(3) solid #0139a4;
          font-weight: bold;
        }
      }
      >span:last-child {
        margin-right: 0;
      }
    }
    .back {
      width: rem(40);
      height: rem(40);
      font-size: rem(18);
      color: #000000;
      &:first-child {
        float: left;
      }
    }
    .addBtn {
      width: rem(40);
      height: rem(40);
      position: relative;
      i {
        font-size: rem(18);
        color: #444547;
        font-size: rem(18);
      }
    }
    .selected {
      color: #0139a4;
    }
  }
  .selectResult {
    width: 100%;
    padding: 0 rem(14);
    position: fixed;
    z-index: 2;
    left: 0;
    top: rem(90);
    background: #f0f1f2;
    font-size: rem(13);
    color: #444547;
    height: rem(28);
    line-height: rem(28);
    overflow-x: auto;
    white-space: nowrap;
    span {
      // margin-right: rem(20);
    }
  }
}
</style>
