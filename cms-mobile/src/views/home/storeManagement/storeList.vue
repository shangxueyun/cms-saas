<template>
  <div class="storeList"
       :class="{'focus':focus}">
    <div class="head"
         @click.stop="closeTpis"
         v-show="index===0||!isHeadShow"
         v-if="!focus">
      <i class="back mintui mintui-back"
         @click="onGoBack"></i>
      <div class="headTab">
        <span @click="cutTab('storeList',0)"
              v-if="hasAuthority('02020204')"
              :class="{ active: index === 0 }">房源平面图</span>
        <span @click="cutTab('storeChart',1)"
              v-if="hasAuthority('02020205')">租控图</span>
        <span @click="cutTab('storeList',2)"
              v-if="hasAuthority('02020201') ||hasAuthority('02020202') || hasAuthority('02020203')"
              :class="{ active: index === 2 }">房源列表</span>
      </div>
      <div class="addBtn"
           @click="showActionSheet">
        <i class="iconfont iconcms_shaixuan"></i>
      </div>
    </div>
    <div class="seachInput"
         v-if="index===2">
      <form @submit.prevent
            action="#">
        <input class="input"
               id="seachInput"
               results="5"
               focus
               placeholder="请输入房源号"
               type="search"
               v-model="inputValue"
               @input="onKeyInput"
               @compositionstart="compositions(false)"
               @compositionend="compositions(true)"
               @keyup.13="onKeyInput"
               @focus="inputFocus"
               @keyup.enter.native="onKeyInput"
               @keypress="search" />
      </form>
      <i class="mintui mintui-search"></i>
      <span class="cannelBtn"
            v-if="focus"
            @click="toContacts">取消</span>
    </div>
    <div v-if="index===2"
         @click="showActionSheet"
         class="selectResult">
      <span>{{currentOrganize2.name}}</span>
      <span>{{currentProject2.referred}}</span>
      <span>{{currentBuilding2.buildingName}}</span>
      <span>{{currentfloors2.name}}</span>
      <span>{{currentStatus.label}}</span>
    </div>
    <div class="content common_list "
         v-if="index===2">
      <mt-loadmore ref="loadmore"
                   :bottom-method="loadBottom"
                   :autoFill="false"
                   :bottom-all-loaded="allLoaded">
        <ul>
          <li v-for="(item,index) in tableData"
              :key="index"
              @click="toStoreDetails(item.id)">
            <div>
              <span class="shopNb">{{item.shopNumber}}</span>
              <span class="shopType"
                    :class="{'weizu':formatShopType(item)==='空置','yizu':formatShopType(item)==='已租','ziyong':formatShopType(item)==='自用'}">{{formatShopType(item)}}</span>
            </div>
            <div>
              <span>{{item.projectManagement.referred}} - {{item.building.buildingName}} - {{item.floor.name}}</span>
              <!-- <span>招商指导价：{{item.priceAndUnit}}</span> -->
              <span>建筑面积：{{item.buildingArea}}㎡</span>
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
           v-if="tableData.length===2 && dataReady">
        <img src="../../../assets/nores.png">
        <p>暂无数据</p>
      </div>
    </div>
    <div class="storeChart"
         v-show="index==0">
      <!-- <storeChart ref="storeChart"
                  :index="index"
                  :projectManagemantId="currentProject.id"
                  :buildingId="currentBuilding.id"
                  :floorId="currentfloors.id"
                  @headShow='headShow' /> -->
      <div class="contentChart"
           @click.stop="closeTpis"
           ref="content">
        <div class="selectResult"
             @click="showVanpopup">
          <span>{{currentOrganize.name}}</span>
          <span>{{currentProject.referred}}</span>
          <span>{{currentBuilding.buildingName}}</span>
          <span>{{currentfloors.name}}</span>
        </div>
        <div class="planTip">提示：双击房源进入详情、长按预览客户信息</div>
        <div class="finger"
             id="svgBox"
             ref="svgBox"
             :style="{transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale3d(${scale}, ${scale}, 1)`}"
             v-finger:pinch="pinchHandler"
             v-finger:press-move="pressMoveHandler"
             v-finger:multipoint-start="multipointStartHandler"
             v-finger:rotate="rotateHandler"
             v-finger:tap="tapHandler"
             v-finger:multipoint-end="multipointEndHandler"
             v-finger:double-tap="doubleTapHandler"
             v-finger:long-tap="longTapHandler"
             v-finger:swipe="swipeHandler"
             v-finger:single-tap="singleTapHandler"
             v-html="svg"
             v-if="svg">
          <!-- <img src="../../../assets/logo.png"> -->
        </div>
        <div class="empty"
             v-else>暂无平面图</div>
        <!-- 房源详情TIPs -->
        <div class="showBox"
             :class="[svgListInfo.noTenantRooms.length?'noTenant':'tenants']"
             id="showBox"
             v-show="showBox">
          <i class="iconfont iconcms_guanbi"
             @click.stop="closeTpis"></i>
          <div v-for="item in svgListInfo.tenants"
               style="margin-bottom:10px"
               :key="item.id">
            <p><span>客户：</span><span>{{item.referred}}</span></p>
            <p>房源号：<span>{{shopNumberFormatter(item.roomsList)}}</span></p>
            <p><span>面积：</span><span>{{setArea(item.roomsList)}}m²</span></p>
          </div>
          <div v-for="item in svgListInfo.noTenantRooms"
               style="margin-bottom:10px"
               :key="item.id">
            <i class="iconfont iconcms_guanbi"
               @click.stop="closeTpis"></i>
            <p><span>房源号：</span><span>{{item.shopNumber}}</span></p>
            <p><span>面积：</span><span>{{item.buildingArea}}m²</span></p>
          </div>
        </div>
      </div>
    </div>
    <!-- index=0房源平面图右侧筛选 -->
    <van-popup v-model="popupShowChart"
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
                :key="item.id"
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
        <div class="popup_list">
          <p>楼层</p>
          <ul>
            <li v-for="(item, index) in floorsList"
                :key="item.id"
                @click="selectfloors(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="popup_buttons">
        <div @click="submitChart('reset')"
             class="popup_default">重置</div>
        <div @click="submitChart"
             class="popup_active">确定</div>
      </div>
    </van-popup>
    <!-- index=2房源列表右侧筛选 -->
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
            <li v-for="(item, index) in organizesList2"
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
            <li v-for="(item, index) in projectManagementList2"
                :key="item.id"
                @click="selectProject(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.referred }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>楼宇</p>
          <ul>
            <li v-for="(item, index) in buildingList2"
                :key="item.id"
                @click="selectBuilding(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.buildingName }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>楼层</p>
          <ul>
            <li v-for="(item, index) in floorsList2"
                :key="item.id"
                @click="selectfloors(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </div>
        <!-- <div class="popup_list">
          <p>分类</p>
          <ul>
            <li v-for="(item, index) in statusList"
                :key="index"
                @click="selectStatus(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </div> -->
        <div class="popup_list">
          <p>状态</p>
          <ul>
            <li v-for="(item, index) in useStatusList"
                :key="index"
                @click="selectUseStatusList(index, item)"
                :class="{ selected: item.checked}">
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
    <!-- <div v-show="shadeBox"
         @touchmove.prevent
         class="shadeBox"></div> -->
  </div>
</template>
<script>
// import AppHeader from '@/components/appHead'
import context from '@/service'
import { toLocaleFixed } from '@/utils/validate.js'
import storeChart from './storeChart.vue'
import Vue from 'vue'
import { Popup } from 'vant'
import { Toast } from 'mint-ui'
Vue.use(Popup)
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
  buildingName: '层平面图',
  checked: true
}
const allBuildingsObj2 = {
  id: '',
  buildingName: '全部楼宇',
  checked: true
}
const allFloorsObj = {
  id: '',
  name: '全部楼层',
  checked: true
}
let roterFrom = null
export default {
  name: 'storeList',
  props: ['scrollTop'],
  footVisible: true,
  components: {
    storeChart
  },
  watch: {
    scrollTop (val) {
      this.scrollVal = val
    }
  },
  data () {
    return {
      isHeadShow: false,
      scrollVal: 0,
      index: 0,
      inputValue: '',
      flag: true,
      shadeBox: false,
      focus: false,
      popupShow: false,
      projectManagementList: [],
      projectManagementList2: [],
      organizesList: [],
      organizesList2: [],
      buildingList: [],
      buildingList2: [],
      floorsList: [],
      floorsList2: [],
      currentOrganize: { id: null },
      currentOrganize2: { id: null },
      currentProject: { id: null },
      currentProject2: { id: null },
      currentBuilding: { id: null },
      currentBuilding2: { id: null },
      currentfloors: { id: null },
      currentfloors2: { id: null },
      currentStatus: {
        label: '使用中', value: 'USING', checked: true
      },
      statusList: [
        { label: '所有房源', checked: true },
        { label: '未租房源', checked: false },
        { label: '已租房源', checked: false },
        { label: '自用房源', checked: false }
      ],
      useStatusList: [
        { label: '全部', value: '', checked: false },
        { label: '使用中', value: 'USING', checked: false },
        { label: '已停用', value: 'DISABLE', checked: false }
      ],
      useStatus: 'USING',
      onRent: null,
      investmentStatus: '',
      dataReady: false,
      allLoaded: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pgSize: 15,
      svgListInfo: {
        tenants: [],
        noTenantRooms: []
      },
      showBox: false,
      popupShowChart: false,
      initScale: 1,
      deltaX: 0,
      deltaY: 0,
      scale: 1,
      svg: '',
      svgList: [],
      defaultScale: 1,
      projectManagementId: 13,
      buildingId: {},
      floorId: '1层',
      lastTag: null,
      currentProjectId: '',
      routerParams: {},
      planeType: 'FLOOR' //  平面图类型
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
    this.svg = ''
    next()
  },
  activated () {
    // 房源平面图 房源列表index
    if (this.hasAuthority('02020204')) {
      this.index = 0
    } else if (!this.hasAuthority('02020204') && (this.hasAuthority('02020201') || this.hasAuthority('02020202') || this.hasAuthority('02020203'))) {
      this.index = 2
    }
    if (this.$route.params && this.$route.params.index) {
      this.$route.params.index === 2 ? this.index = 2 : this.index = 0
    } else if (window.sessionStorage.getItem('storeIndex')) {
      this.index = Number(window.sessionStorage.getItem('storeIndex'))
      window.sessionStorage.removeItem('storeIndex')
    }
    // routerParams
    if (sessionStorage.getItem('routerParams')) {
      this.routerParams = JSON.parse(sessionStorage.getItem('routerParams'))
      sessionStorage.removeItem('routerParams')
    } else {
      this.routerParams = this.$route.params || {}
    }
    // 数据初始化
    if (this.index === 2) {
      this.getOrganizesInit2()
    } else {
      this.getOrganizesInit()
    }
    // 跳转
    if (roterFrom === 'storeDetails' && this.index === 2) {
      let scrollVal = window.sessionStorage.getItem('scrollVal')
      if (scrollVal) {
        this.$emit('changeScroll', scrollVal)
      }
    } else {
      this.$emit('changeScroll', 0)
    }
  },
  created () {
    // 搜索框重置
    this.focus = false
    this.inputValue = ''
  },
  mounted () {

  },
  methods: {
    headShow (flag) {
      this.isHeadShow = flag
    },
    formatUseStatus (status) {
      let temp = ''
      if (status === 'USING') {
        temp = '使用中'
      } else if (status === 'DISABLE') {
        temp = '已停用'
      } else {
        temp = '全部'
      }
      return temp
    },
    cutTab (name, index) {
      if (index === 1) {
        let params = {}
        if (this.index === 0) {
          params = {
            organizeId: this.currentOrganize.id,
            projectManagementId: this.currentProject.id,
            buildingId: this.currentBuilding.id,
            index: index
          }
        } else {
          params = {
            organizeId: this.currentOrganize2.id,
            projectManagementId: this.currentProject2.id,
            buildingId: this.currentBuilding2.id,
            index: index
          }
        }
        this.$router.push({ name: name, params: params })
      } else if (index === 0) {
        this.index = index
        this.getOrganizesInit()
      } else if (index === 2) {
        this.index = index
        this.getOrganizesInit2()
      }
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    toStoreDetails (id) {
      if (this.hasAuthority('02020203')) {
        let searchObj = {
          organizeId: this.currentOrganize2.id,
          projectManagementId: this.currentProject2.id,
          buildingId: this.currentBuilding2.id,
          floorId: this.currentfloors2.id,
          status: this.currentStatus.value
        }
        sessionStorage.setItem('routerParams', JSON.stringify(searchObj))
        window.sessionStorage.setItem('storeIndex', this.index)
        window.sessionStorage.setItem('scrollVal', this.scrollVal)
        this.$router.push({ name: 'storeDetails', params: { id: id } })
      } else {
        Toast({
          message: '你的账号没有查看房源信息的权限',
          position: 'top'
        })
      }
    },
    loadBottom () {
      this.currentPage++
      this.query()
      this.$refs.loadmore.onBottomLoaded()
    },
    formatShopType (item) {
      if (item.onRent) {
        return '已租'
      } else {
        return '空置'
      }
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
    inputFocus () { // 获取焦点
      this.focus = true
      this.shadeBox = true
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
    toContacts () { // 取消
      this.focus = false
      this.shadeBox = false
      this.inputValue = ''
      this.currentPage = 0
      this.tableData = []
      this.query(true)
    },
    async getOrganizesInit2 () {
      // 管理企业
      let res = await context.http.get('uaa/api/organizes/enterprise/user', { useStatus: 'USING', organizeType: 'ENTERPRISE' })
      res.data.unshift(allOrganizesObj)
      this.organizesList2 = res.data
      if (this.organizesList2 && this.organizesList2[1]) {
        this.organizesList2[1].checked = true
        this.currentOrganize2 = this.organizesList2[1]
      }
      if (this.organizesList2.length && ((this.routerParams && this.routerParams.organizeId) || this.currentOrganize.id)) {
        let temp
        let id = ''
        if (roterFrom === 'storeChart' || roterFrom === 'storeDetails') {
          id = this.routerParams.organizeId
        } else {
          id = this.currentOrganize.id ? this.currentOrganize.id : this.routerParams.organizeId
        }
        this.organizesList2.forEach((item, index) => {
          if (item.id === id) {
            temp = index
          }
        })
        if (temp) {
          this.currentOrganize2 = this.organizesList2[temp]
          this.organizesList2[1].checked = false
          this.organizesList2[temp].checked = true
        }
      }
      // 项目
      this.projectManagementList2 = []
      this.currentProject2 = {}
      let id = this.currentOrganize2.id ? this.currentOrganize2.id : ''
      let res2 = await context.http.get('cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: id })
      res2.data.unshift(allProjectObj)
      this.projectManagementList2 = res2.data
      if (this.projectManagementList2 && this.projectManagementList2[1]) {
        this.projectManagementList2[1].checked = true
        this.currentProject2 = this.projectManagementList2[1]
      }
      if (this.projectManagementList2.length && ((this.routerParams && this.routerParams.projectManagementId) || this.currentProject.id)) {
        let temp
        let id
        if (roterFrom === 'storeChart' || roterFrom === 'storeDetails') {
          id = this.routerParams.projectManagementId
        } else {
          id = this.currentProject.id ? this.currentProject.id : this.routerParams.projectManagementId
        }
        this.projectManagementList2.forEach((item, index) => {
          if (item.id === id) {
            temp = index
          }
        })
        if (temp) {
          this.currentProject2 = this.projectManagementList2[temp]
          this.projectManagementList2[1].checked = false
          this.projectManagementList2[temp].checked = true
        }
      }
      // 楼宇
      this.buildingList2 = []
      this.currentBuilding2 = {}
      let result = await context.http.get(`cms/api/project/${this.currentProject2.id}/buildings`, { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING' })
      let listOptions = result.data.filter((item, index) => {
        return item.assetsType === 'BUILDING'
      })
      listOptions.unshift(allBuildingsObj2)
      if (listOptions[0]) listOptions[0].checked = true
      this.buildingList2 = listOptions
      this.currentBuilding2 = this.buildingList2[0] ? this.buildingList2[0] : {}
      if (this.buildingList2.length && ((this.routerParams && this.routerParams.buildingId) || this.currentBuilding.id)) {
        let temp
        let id
        if (roterFrom === 'storeChart' || roterFrom === 'storeDetails') {
          id = this.routerParams.buildingId
        } else {
          id = this.currentBuilding.id ? this.currentBuilding.id : this.routerParams.buildingId
        }
        this.buildingList2.forEach((item, index) => {
          if (item.id === id) {
            temp = index
          }
        })
        if (temp) {
          this.currentBuilding2 = this.buildingList2[temp]
          this.buildingList2[0].checked = false
          this.buildingList2[temp].checked = true
        }
      }
      this.floorsList2 = []
      this.currentfloors2 = {}
      if (this.currentBuilding2.id === '' || !this.currentBuilding2.id) {
        this.floorsList2 = []
        this.floorsList2.push(allFloorsObj)
        this.currentfloors2 = {
          id: '',
          name: '全部楼层',
          checked: true
        }
      } else {
        let result = await context.http.get(`cms/api/floors/building/${this.currentBuilding2.id}`)
        result.data.unshift(allFloorsObj)
        if (roterFrom === 'storeDetails' && this.routerParams.floorId) {
          result.data.forEach(item => {
            if (item.id === this.routerParams.floorId) {
              this.currentfloors2 = item
              item.checked = true
            } else {
              item.checked = false
            }
          })
        } else if (result.data[0]) {
          result.data[0].checked = true
          this.currentfloors2 = result.data[0]
        }
        this.floorsList2 = result.data
      }
      // 详情页返回floorId status默认选中处理...
      if (roterFrom === 'storeDetails' && this.routerParams.status) {
        this.useStatusList.forEach(item => {
          if (item.value === this.routerParams.status) {
            this.currentStatus = item
            item.checked = true
          } else {
            item.checked = false
          }
        })
      } else {
        this.currentStatus = { label: '使用中', value: 'USING', checked: true }
      }
      if (roterFrom) roterFrom = ''
      this.query(true)
    },
    async getOrganizes2 (init) { // 管理企业获取接口
      let res = await context.http.get('uaa/api/organizes/enterprise/user', { useStatus: 'USING', organizeType: 'ENTERPRISE' })
      res.data.unshift(allOrganizesObj)
      this.organizesList2 = res.data
      let orgId
      if (this.organizesList2 && this.organizesList2[1]) {
        this.organizesList2[1].checked = true
        orgId = this.organizesList2[1].id
      } else {
        this.organizesList2[1].checked = false
        this.organizesList2[0].checked = true
        orgId = this.organizesList2[0].id
      }
      this.organizesChange2(orgId)
    },
    async getOrganizesInit () { // 管理企业获取接口
      // 管理企业
      let res = await context.http.get('uaa/api/organizes/enterprise/user', { useStatus: 'USING', organizeType: 'ENTERPRISE' })
      this.organizesList = res.data
      if (this.organizesList && this.organizesList[0]) {
        this.organizesList[0].checked = true
        this.currentOrganize = this.organizesList[0]
      }
      // 从首页进入不勾选默认值
      if (roterFrom !== 'index' && this.organizesList.length && ((this.routerParams && this.routerParams.organizeId) || this.currentOrganize2.id)) {
        let temp
        let id
        if (roterFrom === 'storeDetails') {
          id = this.routerParams.organizeId
        } else {
          id = this.currentOrganize2.id ? this.currentOrganize2.id : this.routerParams.organizeId
        }
        this.organizesList.forEach((item, index) => {
          if (item.id === id) {
            temp = index
          }
        })
        if (temp) {
          this.currentOrganize = this.organizesList[temp]
          this.organizesList[0].checked = false
          this.organizesList[temp].checked = true
        }
      }
      // 项目
      this.projectManagementList = []
      this.currentProject = {}
      let id = this.currentOrganize.id ? this.currentOrganize.id : ''
      let res1 = await context.http.get('cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: id })
      this.projectManagementList = res1.data
      if (this.projectManagementList && this.projectManagementList[0]) {
        this.projectManagementList[0].checked = true
        this.currentProject = this.projectManagementList[0]
        this.currentProjectId = this.projectManagementList[0].id
      }
      if (roterFrom !== 'index' && this.projectManagementList.length && ((this.routerParams && this.routerParams.projectManagementId) || this.currentProject2.id)) {
        let temp
        let id
        if (roterFrom === 'storeDetails') {
          id = this.routerParams.projectManagementId
        } else {
          id = this.currentProject2.id ? this.currentProject2.id : this.routerParams.projectManagementId
        }
        this.projectManagementList.forEach((item, index) => {
          if (item.id === id) {
            temp = index
          }
        })
        if (temp) {
          this.currentProject = this.projectManagementList[temp]
          this.currentProjectId = this.projectManagementList[temp].id
          this.projectManagementList[0].checked = false
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
      if (roterFrom !== 'index' && this.buildingList.length && ((this.routerParams && this.routerParams.buildingId) || this.currentBuilding2.id)) {
        let temp
        let id
        if (roterFrom === 'storeDetails') {
          id = this.routerParams.buildingId
        } else {
          id = this.currentBuilding2.id ? this.currentBuilding2.id : this.routerParams.buildingId
        }
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
      // result.data.unshift(allFloorsObj)
      if (result1.data[0]) result1.data[0].checked = true
      this.floorsList = result1.data
      this.currentfloors = result1.data[0] ? result1.data[0] : {}
      if (this.floorsList.length) {
        let defultFloorName = ''
        let ind = 0
        this.floorsList.forEach((item, index) => {
          if (this.routerParams.floorId && item.name === this.routerParams.floorId) {
            ind = index
          } else if (item.name === '1' || item.name === '一层' || item.name === '一' || item.name === '1层') {
            // defultFloorName = item.name
            ind = index
          }
        })
        this.floorsList[0].checked = false
        this.floorsList[ind].checked = true
        this.currentfloors = this.floorsList[ind]
      }
      if (roterFrom) roterFrom = ''
      this.queryChart()
    },
    async getOrganizes (init) { // 管理企业获取接口
      let res = await context.http.get('uaa/api/organizes/enterprise/user', { useStatus: 'USING', organizeType: 'ENTERPRISE' })
      this.organizesList = res.data
      let orgId
      if (this.organizesList && this.organizesList[0]) {
        this.organizesList[0].checked = true
        orgId = this.organizesList[0].id
      }
      this.organizesChange(orgId)
    },
    async organizesChange2 (id) { // 管理企业查名下项目
      this.projectManagementList2 = []
      let res = await context.http.get('cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: id })
      res.data.unshift(allProjectObj)
      this.projectManagementList2 = res.data
      let builId = ''
      if (this.projectManagementList2 && this.projectManagementList2[1]) {
        this.projectManagementList2[1].checked = true
        builId = this.projectManagementList2[1].id
        this.projectManagementList2[0].checked = false
      } else {
        // this.projectManagementList2[1].checked = false
        this.projectManagementList2[0].checked = true
        builId = this.projectManagementList2[0].id
      }
      this.getBuliding2(builId)
    },
    async organizesChange (id) { // 管理企业查名下项目
      this.projectManagementList = []
      let res = await context.http.get('cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: id })
      if (res.data && res.data.length) {
        this.projectManagementList = res.data
        let proId = ''
        if (this.projectManagementList && this.projectManagementList[0]) {
          this.projectManagementList[0].checked = true
          proId = this.projectManagementList[0].id
        }
        this.currentProjectId = proId
        this.getBuliding(proId)
      }
    },
    async getBuliding (id) { // 楼宇
      this.buildingList = []
      let result = await context.http.get(`cms/api/project/${id}/buildings`, { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING' })
      let listOptions = result.data.filter((item, index) => {
        return item.assetsType === 'BUILDING'
      })
      listOptions.unshift(allBuildingsObj)
      if (listOptions[0]) listOptions[0].checked = true
      this.buildingList = listOptions
      let builId = this.buildingList[0] ? this.buildingList[0].id : ''
      this.getFloorList(id, builId)
    },
    async getBuliding2 (id) { // 楼宇
      this.buildingList2 = []
      this.buildingList2.unshift(allBuildingsObj2)
      // this.currentBuilding2 = {}
      let result = await context.http.get(`cms/api/project/${id}/buildings`, { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING' })
      let listOptions = result.data.filter((item, index) => {
        return item.assetsType === 'BUILDING'
      })
      listOptions.unshift(allBuildingsObj2)
      if (listOptions[0]) listOptions[0].checked = true
      this.buildingList2 = listOptions
      let builId = this.buildingList2[0] ? this.buildingList2[0].id : ''
      this.getFloorList2(builId)
    },
    async getFloorList (id, builId) {
      this.floorsList = []
      let result = await context.http.get(`cms/api/floors/svg/`, { projectManagementId: id, buildingId: builId })
      if (result.data[0]) result.data[0].checked = true
      this.floorsList = result.data
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
      }
    },
    async getFloorList2 (id) {
      this.floorsList2 = []
      if (id === '' || !id) {
        this.floorsList2 = []
        this.floorsList2.push(allFloorsObj)
      } else {
        let result = await context.http.get(`cms/api/floors/building/${id}`)
        result.data.unshift(allFloorsObj)
        if (result.data[0]) result.data[0].checked = true
        this.floorsList2 = result.data
      }
      this.selectUseStatusList(1, this.useStatusList[1])
    },
    async selectOrganizes (index, item) {
      if (this.index === 0) {
        this.organizesList = this.checkedFormat(index, this.organizesList)
        this.organizesChange(this.organizesList[index].id)
      } else {
        this.organizesList2 = this.checkedFormat(index, this.organizesList2)
        this.organizesChange2(this.organizesList2[index].id)
      }
    },
    async selectProject (index, item) {
      if (this.index === 0) {
        this.projectManagementList = this.checkedFormat(index, this.projectManagementList)
        this.currentProjectId = this.projectManagementList[index].id
        this.getBuliding(this.projectManagementList[index].id)
      } else {
        this.projectManagementList2 = this.checkedFormat(index, this.projectManagementList2)
        this.getBuliding2(this.projectManagementList2[index].id)
      }
    },
    async selectBuilding (index, item) {
      if (this.index === 0) {
        this.buildingList = this.checkedFormat(index, this.buildingList)
        this.getFloorList(this.currentProjectId, this.buildingList[index].id)
      } else {
        this.buildingList2 = this.checkedFormat(index, this.buildingList2)
        this.getFloorList2(this.buildingList2[index].id)
      }
    },
    selectfloors (index, item) {
      if (this.index === 0) {
        this.floorsList = this.checkedFormat(index, this.floorsList)
        // this.currentfloors = this.floorsList[index]
      } else {
        this.floorsList2 = this.checkedFormat(index, this.floorsList2)
        // this.currentfloors2 = this.floorsList2[index]
      }
    },
    selectStatus (index, item) {
      this.statusList.forEach(item => {
        item.checked = false
      })
      this.statusList[index].checked = true
      this.investmentStatus = null
      if (index === 0) {
        this.onRent = null
      } else if (index === 1) {
        this.onRent = false
      } else if (index === 2) {
        this.onRent = true
      } else if (index === 3) {
        this.onRent = null
        this.investmentStatus = 'NO'
      }
    },
    selectUseStatusList (index, item) {
      this.useStatusList = this.checkedFormat(index, this.useStatusList)
    },
    checkedFormat (i, arr) {
      arr = arr.map(item => {
        item.checked = false
        return item
      })
      arr[i].checked = true
      return arr
    },
    async showActionSheet () {
      if (this.index === 0) {
        this.showVanpopup()
        return
      }
      if (this.currentOrganize2.id) {
        this.organizesList2 = this.organizesList2.map((item, index) => {
          item.checked = false
          if (item.id === this.currentOrganize2.id) item.checked = true
          return item
        })
      }
      if (this.organizesList2.filter(item => item.checked === true).length === 0) {
        this.organizesList2[0].checked = true
      }
      // console.log(this.organizesList2[0].checked)
      // console.log((this.organizesList2.filter(item => item.checked === true).length === 0))
      if (this.currentOrganize2.id) {
        let res1 = await context.http.get('cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: this.currentOrganize2.id })
        res1.data.unshift(allProjectObj)
        this.projectManagementList2 = res1.data.map((item, index) => {
          item.checked = false
          if (item.id === this.currentProject2.id) item.checked = true
          return item
        })
      } else {
        this.projectManagementList2 = []
        this.projectManagementList2.unshift(allProjectObj)
        this.projectManagementList2[0].checked = true
      }
      if (this.currentProject2.id) {
        let res2 = await context.http.get(`cms/api/project/${this.currentProject2.id}/buildings`, { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING' })
        this.buildingList2 = res2.data.filter((item, index) => {
          return item.assetsType === 'BUILDING'
        })
        this.buildingList2.unshift(allBuildingsObj2)
        this.buildingList2 = this.buildingList2.map(item => {
          item.checked = false
          if (item.id === this.currentBuilding2.id) item.checked = true
          return item
        })
      } else {
        this.buildingList2 = []
        this.buildingList2.unshift(allBuildingsObj2)
        this.buildingList2[0].checked = true
      }
      if (this.currentBuilding2.id) {
        let result = await context.http.get(`cms/api/floors/building/${this.currentBuilding2.id}`)
        result.data.unshift(allFloorsObj)
        this.floorsList2 = result.data.map(item => {
          item.checked = false
          if (item.id === this.currentfloors2.id) item.checked = true
          return item
        })
      } else {
        this.floorsList2 = []
        this.floorsList2.unshift(allFloorsObj)
        this.floorsList2[0].checked = true
      }
      this.useStatusList.map(item => {
        item.checked = false
        if (item.label === this.currentStatus.label) item.checked = true
        return item
      })
      this.popupShow = !this.popupShow
    },
    async submit (state) {
      if (state === 'reset') {
        if (this.organizesList2[1]) {
          this.selectOrganizes(1, this.organizesList2[1])
        } else {
          this.selectOrganizes(0, this.organizesList2[0])
        }
      } else {
        this.currentOrganize2 = this.organizesList2.filter(item => item.checked)[0] ? this.organizesList2.filter(item => item.checked)[0] : {id: ''}
        this.currentProject2 = this.projectManagementList2.filter(item => item.checked)[0] ? this.projectManagementList2.filter(item => item.checked)[0] : {id: ''}
        this.currentBuilding2 = this.buildingList2.filter(item => item.checked)[0] ? this.buildingList2.filter(item => item.checked)[0] : {id: ''}
        this.currentfloors2 = this.floorsList2.filter(item => item.checked)[0] ? this.floorsList2.filter(item => item.checked)[0] : {id: ''}
        this.currentStatus = this.useStatusList.filter(item => item.checked)[0] ? this.useStatusList.filter(item => item.checked)[0] : {value: ''}
        this.query(true)
        this.popupShow = false
      }
    },
    query (flag) {
      this.dataReady = false
      if (flag === 'reset') return
      if (flag) this.currentPage = 1; this.allLoaded = false
      context.http.get('cms/api/rooms',
        {
          onRent: this.onRent,
          organizeId: this.currentOrganize2.id,
          projectManagemantId: this.currentProject2.id,
          buildingId: this.currentBuilding2.id,
          floorId: this.currentfloors2.id,
          queryShopNumber: this.inputValue,
          useStatus: this.currentStatus.value,
          page: (this.currentPage - 1),
          size: this.pgSize
          // investmentStatus: this.investmentStatus
        }).then(res => {
          res.data.list.forEach(item => {
            if (item.priceUnit === 'DAY') {
              item.priceAndUnit = item.expectedUnitPrice ? item.expectedUnitPrice + '元/天' : '-'
            } else if (item.priceUnit === 'MONTH') {
              item.priceAndUnit = item.expectedUnitPrice ? item.expectedUnitPrice + '元/月' : '-'
            } else if (item.priceUnit === 'M2DAYS') {
              item.priceAndUnit = item.expectedUnitPrice ? item.expectedUnitPrice + '元/㎡天' : '-'
            } else if (item.priceUnit === 'M2MONTH') {
              item.priceAndUnit = item.expectedUnitPrice ? item.expectedUnitPrice + '元/㎡月' : '-'
            }
          })
          if (flag) {
            this.tableData = res.data.list
          } else {
            this.tableData = this.tableData.concat(res.data.list)
          }
          // this.tableData.forEach(ele => {
          //   ele.buildingArea = toLocaleFixed(ele.buildingArea)
          // })
          this.total = Number(res.headers['x-total-count'])
          if (this.currentPage === Math.ceil(this.total / this.pgSize) || this.currentPage > Math.ceil(this.total / this.pgSize)) {
            this.allLoaded = true// 若数据已全部获取完毕
            console.log('全部获取完毕')
          }
          this.dataReady = this.tableData.length === 0
        })
    },
    onGoBack () { // 返回首页
      window.sessionStorage.removeItem('scrollVal')
      window.sessionStorage.removeItem('currObj')
      this.index = 0
      this.$router.push({ name: 'index' })
    },
    closeTpis () {
      this.showBox = false
    },
    initStoreChart () {
      this.initChart()
      this.getOrganizes()
    },
    setArea (val) {
      // console.log(val)
      let count = 0
      val.forEach(item => {
        if (item.buildingArea) {
          count += item.buildingArea
        }
      })
      return count.toFixed(2)
    },
    shopNumberFormatter (shopNumList) {
      let str = ''
      shopNumList.forEach((item, index) => {
        str += item.shopNumber + '、'
      })
      return str.substring(0, str.length - 1)
    },
    formatContractPrice (price, val) {
      let priceUnit
      let priceNum = price || 0
      if (val === 'M2DAYS') {
        priceUnit = '元/㎡天'
      } else if (val === 'M2MONTH') {
        priceUnit = '元/㎡月'
      } else if (val === 'DAY') {
        priceUnit = '元/天'
      } else if (val === 'MONTH') {
        priceUnit = '元/月'
      }
      return priceNum.toFixed(2) + priceUnit
      // return priceNum + priceUnit
    },
    async showVanpopup () {
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
        this.projectManagementList = res1.data.map((item, index) => {
          item.checked = false
          if (item.id === this.currentProject.id) item.checked = true
          return item
        })
      } else {
        this.projectManagementList = []
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
      if (this.currentProject.id) {
        let result = await context.http.get(`cms/api/floors/svg/`, { projectManagementId: this.currentProject.id, buildingId: this.currentBuilding.id })
        this.floorsList = result.data.map(item => {
          item.checked = false
          if (item.name === this.currentfloors.name) item.checked = true
          return item
        })
      }
      this.popupShowChart = !this.popupShowChart
    },
    async submitChart (state) {
      if (state === 'reset') {
        this.getOrganizes('reset')
      } else {
        this.currentOrganize = this.organizesList.filter(item => item.checked)[0] ? this.organizesList.filter(item => item.checked)[0] : {id: ''}
        this.currentProject = this.projectManagementList.filter(item => item.checked)[0] ? this.projectManagementList.filter(item => item.checked)[0] : {id: ''}
        this.currentBuilding = this.buildingList.filter(item => item.checked)[0] ? this.buildingList.filter(item => item.checked)[0] : {id: ''}
        this.currentfloors = this.floorsList.filter(item => item.checked)[0] ? this.floorsList.filter(item => item.checked)[0] : {id: ''}
        this.queryChart()
        this.popupShowChart = false
      }
    },
    initChart () {
      this.initScale = 1
      this.deltaX = 1
      this.deltaY = 1
      this.scale = 1
    },
    queryChart (reset) {
      if (reset === 'reset') return
      if (this.currentBuilding.id) {
        this.planeType = 'BUILDING'
      } else {
        this.planeType = 'FLOOR'
      }
      let floorId = null
      if (this.currentfloors) {
        floorId = this.currentfloors.name
      }
      this.showBox = false
      this.svg = ''
      this.svgList = []
      context.http.get(`cms/api/plan`,
        {
          planeType: this.planeType,
          planeStyle: 'ROOM',
          organizeId: this.currentOrganize.id,
          projectManagementId: this.currentProject.id,
          buildingName: this.currentBuilding.id,
          floorName: floorId
        }
      ).then(res => {
        if (res.status === 200) {
          if (!res.data) return
          this.svg = res.data.svg
          this.svgList = res.data.svgList
          this.$nextTick(() => {
            this.renderSVG()
          })
        }
      })
    },
    renderSVG () { // 重新渲染svg
      // $("#svgHtml polygon[id^='svg_'],#svgHtml rect[id^='svg_'],#svgHtml path[id^='svg_']").attr('fill', '#ffffff') // 渲染默认填充白色 去掉text
      // $("#svgHtml text[id^='shopTextId_'],#svgHtml text[id^='shopNb_']").remove()
      let arr = this.svgList
      let eleId, shopTextId, x, y, y1, textArr, texts, referreds, shopTextDom, referredArr, referredDom
      arr.forEach(item => {
        eleId = item.svgId
        shopTextId = eleId.replace('svg', 'shopTextId')
        x = !item.svgx || item.svgx === 'null' ? $('#' + eleId).attr('data-x') : item.svgx
        y = !item.svgy || item.svgy === 'null' ? $('#' + eleId).attr('data-y') : item.svgy
        y1 = Number(y) + 15
        textArr = []// 房源名拼接
        referredArr = []// 品牌名拼接
        texts = ''
        referreds = ''
        item.list.forEach(list => {
          textArr.push(list.shopNumber)
          referredArr.push(list.referred)
        })
        texts = textArr.join('/')
        referreds = referredArr.join('/')
        texts = texts.length > 5 ? texts.substring(0, 5) + '...' : texts
        referreds = referreds.length > 5 ? referreds.substring(0, 5) + '...' : referreds
        shopTextDom = $('<text id="' + shopTextId + '"  x="' + x + '"  y="' + y + '" font-size="13px"  font-family="MicrosoftYaHei, Microsoft YaHei">' + texts + '</text>')
        referredDom = $('<text id="' + shopTextId + '_referred"  x="' + x + '"  y="' + y1 + '" font-size="13px"  font-family="MicrosoftYaHei, Microsoft YaHei">' + referreds + '</text>')
        let color = '#eeeeee'
        if (item.tenants.length) {
          color = item.tenants[0].industryDescription
        }
        $('#' + eleId).attr('fill', color)
        if ($('#' + shopTextId).length === 0) {
          $('#svgBox svg').find($('#' + eleId)).parent().append(shopTextDom)
          // $('#svgHtml svg').find($('#' + eleId)).parent().append(referredDom)   //根据测试要求 房源招租-房源平面图上只展示房源号
          // this.svgHtml = $('#svgHtml').html()
        }
      })
      this.svg = $('#svgBox').html()
      this.SVGAutoscale()
    },
    SVGAutoscale () {
      let w = window.screen.width
      let DIVw = w
      let DIVh = 300
      if (!$('#svgBox svg').attr('width') || !$('#svgBox svg').attr('height')) {
        $('#svgBox svg').attr('width', '1980')
        $('#svgBox svg').attr('height', '1080')
      }
      let svgW = parseInt($('#svgBox svg').attr('width'))
      let svgH = parseInt($('#svgBox svg').attr('height'))
      let defaultScale = 1
      if (svgW > DIVw) {
        defaultScale = DIVw / svgW
      }
      this.defaultScale = defaultScale
      $('#svgBox').css({
        'height': svgH * defaultScale,
        'overflow': 'inherit'
      })
      this.$nextTick(() => {
        $('#svgBox svg').css({
          'transform': `scale(${this.defaultScale})`,
          'transform-origin': '0 0 0'
        })
      })
    },
    pointStartHandler (e) {
      // 手指触摸屏幕触发
    },
    multipointStartHandler (e) {
      // 一个手指以上触摸屏幕触发
      this.initScale = this.scale
    },
    rotateHandler (evt) {
      // evt.angle代表两个手指旋转的角度
      console.log(evt.angle)
    },
    pinchHandler (evt) {
      // evt.scale代表两个手指缩放的比例
      if (evt.zoom * this.initScale > 3) {
        this.scale = 3
      } else {
        this.scale = evt.zoom * this.initScale
      }

      // this.defaultScale = this.scale * this.defaultScale
      if (this.scale < 0.8) {
        this.deltaX = 0
        this.deltaY = 0
      }
    },
    multipointEndHandler (e) {
      // 当手指离开，屏幕只剩一个手指或零个手指触发
      if (this.scale < 0.8 || this.scale === 0.8) {
        this.scale = 0.8
        this.deltaX = 0
        this.deltaY = 0
      }
    },
    pressMoveHandler (evt) {
      // evt.deltaX和evtdeltaY代表在屏幕上移动的距离
      this.deltaX += evt.deltaX
      this.deltaY += evt.deltaY
    },
    tapHandler (evt) {
      // 点按触发
    },
    doubleTapHandler (evt) {
      // 双击屏幕触发
      let self = evt.target
      if (self.tagName === 'path' || self.tagName === 'polygon' || self.tagName === 'rect') {
        // if (this.lastTag) {
        //   $(this.lastTag).attr({ 'stroke-width': $(self).attr('stroke-width'), 'stroke': '#000000' })
        // }
        // $(self).attr({ 'stroke-width': '2px', 'stroke': '#00ff00' })
        // this.lastTag = self
        for (var i = 0; i < this.svgList.length; i++) {
          if (self.id === this.svgList[i].svgId) {
            let id = this.svgList[i].list[0].id
            // this.storeDetailisShowFn(this.svgList[i].list[0].id)
            let searchObj = {
              organizeId: this.currentOrganize.id,
              projectManagementId: this.currentProject.id,
              buildingId: this.currentBuilding.id,
              floorId: this.currentfloors.name
            }
            sessionStorage.setItem('routerParams', JSON.stringify(searchObj))
            window.sessionStorage.setItem('scrollVal', this.scrollVal)
            this.$router.push({ name: 'storeDetails', params: { id: id } })
          }
        }
      }
    },
    longTapHandler (evt) {
      // 长按屏幕750ms触发
      let self = evt.target
      this.showBox = false
      if (self.tagName === 'path' || self.tagName === 'polygon' || self.tagName === 'rect') {
        // $(self).attr({ 'stroke-width': '2px', 'stroke': '#00ff00' })
        this.svgList.forEach(item => {
          if (self.id === item.svgId) {
            this.showBox = true
            this.svgListInfo = item
            console.log(this.svgListInfo)
          }
        })
      }
    },
    swipeHandler (evt) {
      // evt.direction代表滑动的方向
      // console.log('swipe' + evt.direction)
    },
    singleTapHandler (evt) {
      // 单击
    }
  }
}
</script>
<style scoped lang="scss" >
@import "../../../style/config";
.storeList {
  .storeChart {
    z-index: 10;
    position: relative;
  }
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
    z-index: 11;
    box-shadow: 0px 1px 4px 0px rgba(230, 230, 230, 0.5);
    .headTab {
      color: #444547;
      font-size: rem(16);
      display: flex;
      justify-content: space-between;
      > span {
        margin: 0 rem(10);
        font-size: rem(15);
        &.active {
          font-weight: bolder;
          color: #0139a4;
          border-bottom: rem(2) solid #0139a4;
        }
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
      margin-right: rem(20);
    }
  }
}
// * {
//   -webkit-touch-callout: none;
//   -webkit-user-select: none;
//   -khtml-user-select: none;
//   -moz-user-select: none;
//   -ms-user-select: none;
//   user-select: none;
// }
.contentChart {
  margin: rem(40) 0 0 0;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 11;
  .selectResult {
    top: rem(40);
  }
  .planTip {
    margin: rem(34) rem(14) rem(0) rem(0);
    float: right;
    color: #0139a4;
    font-size: rem(12);
    font-weight: 400;
  }
  .empty {
    margin-top: rem(100);
    position: absolute;
    width: 100%;
    text-align: center;
  }
  .test {
    width: 100%;
    min-height: 100px;
    position: fixed;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.65);
    color: #fff;
    height: 200px;
    overflow-y: auto;
  }
  .finger {
  }
  #svgBox {
    width: 100%;
    overflow: auto;
    height: 300px;
    margin-top: rem(100);
    border: 1px solid #eee;
    position: absolute;
  }
  .showBox {
    width: rem(260);
    background: rgba(0, 0, 0, 0.7);
    border-radius: rem(4);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #ffffff;
    padding-top: rem(30);
    &.noTenant {
      // height: rem(140);
    }
    &.tenants {
      // height: rem(380);
      overflow-y: auto;
    }
    .iconfont {
      position: absolute;
      right: rem(10);
      top: rem(10);
    }
    > div {
      &:not(:last-child) {
        border-bottom: rem(1) solid #c6c6c6;
      }
      > p {
        height: rem(40);
        line-height: rem(40);
        > span {
          &:first-child {
            width: 30%;
          }
          &:last-child {
            width: 70%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
        &:not(.title) {
          display: flex;
          justify-content: space-between;
          padding: 0 rem(10);
        }
        &.title {
          margin: 0 rem(8);
          border-bottom: rem(1) solid #656873;
          font-size: 17px;
          font-weight: bold;
          text-align: center;
        }
      }
    }
  }
}
</style>
