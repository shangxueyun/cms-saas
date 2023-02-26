<template>
  <div class="storeList"
       :class="{'focus':focus}">
         <!-- v-show="index===0||!isHeadShow" -->
         <!-- v-if="!focus" -->
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
           @click="showVanpopup">
        <i class="iconfont iconcms_shaixuan"></i>
      </div>
    </div>
    <div class="storeChart">
      <div class="content"
          ref="content">
        <div class="selectResult" v-if="currentOrganize.name" @click="showVanpopup">
          <span>{{currentOrganize.name}}</span>
          <span>{{currentProject.referred}}</span>
          <span>{{currentBuilding.buildingName}}</span>
          <span>{{currentfloors.name}}</span>
        </div>
        <div class="planTip">提示：双击房源进入详情</div>
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
        </div>
        <div class="empty"
            v-else>暂无平面图</div>
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
        <!-- <div class="popup_list">
          <p>状态</p>
          <ul>
            <li v-for="(item, index) in useStatusList"
                :key="index"
                @click="selectUseStatusList(index, item)"
                :class="{ selected: item.value === useStatus}">
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </div> -->
      </div>
      <div class="popup_buttons">
        <div @click="submit('reset')"
             class="popup_default">重置</div>
        <div @click="submit"
             class="popup_active">确定</div>
      </div>
    </van-popup>
  </div>
</template>
<script>
// import AppHeader from '@/components/appHead'
import context from '@/service'
import { toLocaleFixed } from '@/utils/validate.js'
// import customerChart from './TenantComponents/customerChart.vue'
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
const allFloorsObj = {
  id: '',
  name: '全部楼层',
  checked: true
}
let roterFrom = null
export default {
  name: 'customerPlan',
  props: ['scrollTop'],
  footVisible: true,
  components: {},
  watch: {
    scrollTop (val) {
      this.scrollVal = val
    },
    // index: function () {
    //   this.$nextTick(() => {
    //     if (this.index) {
    //       this.initChart()
    //       // this.queryProjectManagement()
    //       this.getOrganizes()
    //     }
    //   })
    // },
    popupShow: function () {
      this.headShow(this.popupShow)
      // this.$emit('headShow', this.popupShow)
      // console.log(this.popupShow)
    }
  },
  data () {
    return {
      isHeadShow: false,
      scrollVal: 0,
      // index: 1,
      inputValue: '',
      flag: true,
      shadeBox: false,
      focus: false,
      popupShow: false,
      projectManagementList: [],
      organizesList: [],
      buildingList: [],
      floorsList: [],
      currentOrganize: {
        name: ''
      },
      currentProject: {},
      currentBuilding: {},
      currentfloors: {},
      currentStatus: {
        label: '所有房源', checked: true
      },
      statusList: [
        { label: '所有房源', checked: true },
        { label: '未租房源', checked: false },
        { label: '已租房源', checked: false },
        { label: '自用房源', checked: false }
      ],
      useStatusList: [
        { label: '全部', value: '' },
        { label: '使用中', value: 'USING' },
        { label: '已停用', value: 'DISABLE' }
      ],
      useStatus: 'USING',
      tabList: ['客户平面图', '租控图', '客户列表'],
      tabActive: '客户平面图',
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
      initScale: 1,
      deltaX: 0,
      deltaY: 0,
      scale: 1,
      svg: '',
      svgList: [],
      defaultScale: 1,
      projectManagementId: 13,
      paramsObj: {},
      buildingId: {},
      floorId: '1层',
      routerParams: {},
      currentProjectId: '',
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
  activated () {
    if (roterFrom === 'TenantDetails' && sessionStorage.getItem('routerParams')) {
      this.routerParams = JSON.parse(sessionStorage.getItem('routerParams'))
      sessionStorage.removeItem('routerParams')
    } else {
      this.routerParams = this.$route.params || {}
    }
    this.$emit('changeScroll', 0)
    this.getOrganizesInit()
  },
  created () {
    // this.queryProjectManagement()
    // let currObj = JSON.parse(sessionStorage.getItem('currObj'))
    // if (sessionStorage.getItem('currObj')) {
    //   this.currentProject = currObj.currentProject
    //   this.currentBuilding = currObj.currentBuilding
    //   this.currentfloors = currObj.currentfloors
    //   this.currentStatus = currObj.currentStatus
    // }
  },
  beforeDestroy () {
  },
  mounted () {

  },
  methods: {
    // closeTpis () {
    //   this.showBox = false
    // },
    setArea (val) {
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
      this.popupShow = !this.popupShow
    },
    async getOrganizesInit (init) { // 管理企业获取接口
      // 管理企业
      let res = await context.http.get('uaa/api/organizes/enterprise/user', { useStatus: 'USING', organizeType: 'ENTERPRISE' })
      this.organizesList = res.data
      if (this.organizesList && this.organizesList[0]) {
        this.organizesList[0].checked = true
        this.currentOrganize = this.organizesList[0]
      }
      if (this.organizesList.length && this.routerParams && this.routerParams.organizeId) {
        let temp
        let id = this.routerParams.organizeId
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
      if (this.projectManagementList.length && this.routerParams && this.routerParams.projectManagementId) {
        let temp
        let id = this.routerParams.projectManagementId
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
      if (this.buildingList.length && this.routerParams && this.routerParams.buildingId) {
        let temp
        let id = this.routerParams.buildingId
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
            defultFloorName = item.name
            ind = index
          }
        })
        this.floorsList[0].checked = false
        this.floorsList[ind].checked = true
        this.currentfloors = this.floorsList[ind]
      }
      this.query()
    },
    async getOrganizes () { // 管理企业获取接口
      let res = await context.http.get('uaa/api/organizes/enterprise/user', { useStatus: 'USING', organizeType: 'ENTERPRISE' })
      this.organizesList = res.data
      let orgId
      if (this.organizesList && this.organizesList[0]) {
        this.organizesList[0].checked = true
        orgId = this.organizesList[0].id
      }
      if (this.routerParams && this.routerParams.organizeId && this.organizesList && this.organizesList.length) {
        let temp
        this.organizesList.forEach((item, index) => {
          if (item.id === this.routerParams.organizeId) {
            temp = index
          }
        })
        if (temp) {
          orgId = this.organizesList[temp].id
          this.organizesList[0].checked = false
          this.organizesList[temp].checked = true
        }
      }
      this.organizesChange(orgId)
    },
    async organizesChange (id) { // 管理企业查名下项目
      let res = await context.http.get('cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: id })
      if (res.data && res.data.length) {
        this.projectManagementList = res.data
        let proId
        if (this.projectManagementList && this.projectManagementList[0]) {
          this.projectManagementList[0].checked = true
          proId = this.projectManagementList[0].id
        }
        this.currentProjectId = proId
        this.getBuliding(proId)
      }
    },
    async getBuliding (id) { // 楼宇
      let result = await context.http.get(`cms/api/project/${id}/buildings`, { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING' })
      let listOptions = result.data.filter((item, index) => {
        return item.assetsType === 'BUILDING'
      })
      listOptions.unshift({ id: '', buildingName: '层平面图', checked: true })
      this.buildingList = listOptions
      let builId
      builId = listOptions[0] ? listOptions[0].id : ''
      this.getFloorList(id, builId)
    },
    async getFloorList (id, builId) {
      let result = await context.http.get('cms/api/floors/svg', { projectManagementId: id, buildingId: builId })
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
    async selectOrganizes (index, item) {
      this.organizesList = this.checkedFormat(index, this.organizesList)
      // this.currentOrganize = this.organizesList[index]
      this.organizesChange(this.organizesList[index].id)
    },
    async selectProject (index, item) {
      this.projectManagementList = this.checkedFormat(index, this.projectManagementList)
      this.currentProjectId = this.projectManagementList[index].id
      this.getBuliding(this.projectManagementList[index].id)
    },
    async selectBuilding (index, item) {
      this.buildingList = this.checkedFormat(index, this.buildingList)
      this.getFloorList(this.currentProjectId, this.buildingList[index].id)
    },
    selectfloors (index, item) {
      this.floorsList = this.checkedFormat(index, this.floorsList)
      // this.currentfloors = this.floorsList.filter(item => item.checked)[0]
    },
    checkedFormat (i, arr) {
      arr = arr.map(item => {
        item.checked = false
        return item
      })
      arr[i].checked = true
      return arr
    },
    async submit (state) {
      if (state === 'reset') {
        if (!this.projectManagementList.length) return
        this.selectOrganizes(0, this.organizesList[0])
      } else {
        // if (!this.organizesList.length || !this.projectManagementList.length || !this.buildingList.length || !this.floorsList.length) {
        //   this.popupShow = false
        //   return
        // }
        this.currentOrganize = this.organizesList.filter(item => item.checked)[0] ? this.organizesList.filter(item => item.checked)[0] : {id: ''}
        this.currentProject = this.projectManagementList.filter(item => item.checked)[0] ? this.projectManagementList.filter(item => item.checked)[0] : {id: ''}
        this.currentBuilding = this.buildingList.filter(item => item.checked)[0] ? this.buildingList.filter(item => item.checked)[0] : {id: ''}
        this.currentfloors = this.floorsList.filter(item => item.checked)[0] ? this.floorsList.filter(item => item.checked)[0] : {name: ''}
        this.query()
        this.popupShow = false
      }
    },
    initChart () {
      this.initScale = 1
      this.deltaX = 1
      this.deltaY = 1
      this.scale = 1
    },
    query (reset) {
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
      this.svg = ''
      this.svgList = []
      context.http.get(`cms/api/plan`,
        {
          planeType: this.planeType,
          planeStyle: 'ROOM',
          // organizeId: this.currentOrganize.organizeId,
          projectManagementId: this.currentProject.id,
          buildingName: this.currentBuilding.id,
          floorName: floorId
        }
      ).then(res => {
        if (res.status === 200) {
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
        // $(self).attr({ 'stroke': '#00ff00' })
        // this.lastTag = self
        for (var i = 0; i < this.svgList.length; i++) {
          if (self.id === this.svgList[i].svgId) {
            let id = this.svgList[i].tenants[0].id
            let searchObj = {
              organizeId: this.currentOrganize.id,
              projectManagementId: this.currentProject.id,
              buildingId: this.currentBuilding.id,
              floorId: this.currentfloors.name
            }
            sessionStorage.setItem('routerParams', JSON.stringify(searchObj))
            this.$router.push({ name: 'TenantDetails', query: { 'tenantID': id } })
          }
        }
      }
    },
    longTapHandler (evt) {
      // 长按屏幕750ms触发
      // let self = evt.target
      // this.showBox = false
      // if (self.tagName === 'path' || self.tagName === 'polygon' || self.tagName === 'rect') {
      //   // $(self).attr({ 'stroke-width': '2px', 'stroke': '#00ff00' })
      //   this.svgList.forEach(item => {
      //     if (self.id === item.svgId) {
      //       this.showBox = true
      //       this.svgListInfo = item
      //       // console.log(this.svgListInfo)
      //     }
      //   })
      // }
    },
    swipeHandler (evt) {
      // evt.direction代表滑动的方向
      // console.log('swipe' + evt.direction)
    },
    singleTapHandler (evt) {
      // 单击
    },
    headShow (flag) {
      this.isHeadShow = flag
    },
    tabChange (item) {
      let searchObj = {
        organizeId: this.currentOrganize.id,
        projectManagementId: this.currentProject.id,
        buildingId: this.currentBuilding.id,
        floorId: null
      }
      if (item === '客户平面图') {
        return
      } else if (item === '租控图') {
        this.$router.replace({ name: 'rentControlChart', params: searchObj })
        return
      } else if (item === '客户列表') {
        this.$router.replace({ name: 'tenantList', params: searchObj })
        return
      }
    },
    formatUseStatus (status) {
      let temp = ''
      if (status === 'USING') {
        temp = '使用中'
      } else if (status === 'USING') {
        temp = '已停用'
      }
      return temp
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    toStoreDetails (id) {
      if (this.hasAuthority('02020203')) {
        let obj = {}
        obj.currentProject = this.currentProject
        obj.currentBuilding = this.currentBuilding
        obj.currentfloors = this.currentfloors
        obj.currentStatus = this.currentStatus
        window.sessionStorage.setItem('currObj', JSON.stringify(obj))
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
      if (item.investmentStatus === 'OK' && !item.onRent) {
        return '未租'
      } else if (item.investmentStatus === 'OK' && item.onRent) {
        return '已租'
      } else if (item.investmentStatus === 'NO' && !item.onRent) {
        return '自用'
      } else if (item.investmentStatus === 'FICTITIOUS') {
        return '虚拟房源'
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
      this.useStatus = this.useStatusList[index].value
    },
    async showActionSheet () {
      this.showVanpopup()
    },
    onGoBack () { // 返回首页
      window.sessionStorage.removeItem('scrollVal')
      window.sessionStorage.removeItem('currObj')
      // this.index = 0
      this.$router.push({ name: 'index' })
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
    // span {
    //   margin-right: rem(20);
    // }
  }
  .planTip {
    margin: rem(34) rem(14) rem(0) rem(0);
    float: right;
    color: #0139A4;
    font-size: rem(12);
    font-weight: 400;
  }
}
* {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.content {
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
    width: rem(230);
    background: rgba(0, 0, 0, 0.7);
    border-radius: rem(4);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    color: #ffffff;
    &.noTenant {
      height: rem(140);
    }
    &.tenants {
      height: rem(380);
      overflow-y: auto;
    }
    .iconfont {
      position: absolute;
      right: rem(10);
      top: rem(10);
    }
    > div {
      > p {
        height: rem(40);
        line-height: rem(40);
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
