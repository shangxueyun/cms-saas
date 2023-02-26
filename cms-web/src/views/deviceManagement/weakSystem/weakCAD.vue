<template>
  <div id="energySystem"
       class="energySystem">
    <span class="page_head_title">弱电系统</span>
    <div class="search-bar">
      <div class="searbar-left">
        <el-select v-model="projectManagementId"
                   placeholder="项目"
                   @change='getBuliding'>
          <el-option v-for="item in projectManagementsList"
                     :key="item.id"
                     :label="item.referred"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="equipmentType"
                   placeholder="设备小类"
                   clearable
                   @change="handleChange">
          <el-option v-for="(item,index) in getEquirementTypes4List"
                     :key="index"
                     :value="item.id"
                     :label="item.name"></el-option>
        </el-select>
      </div>
    </div>
    <ul class="default_tab_block">
      <li class="active"
          v-if="hasAuthority('03030101')">
        <span>弱电平面图</span>
      </li>
      <li @click="roterTo('weakEquipment')"
          v-if="hasAuthority('03030102')">
        <span>设备列表</span>
      </li>
    </ul>
    <div class="content">
      <div style="box-shadow:none;padding: 0 20px;"
           class="saclBtn search-bar">
        <div class="searbar-left">
          <span>
            <el-select v-model="buildingName"
                       placeholder="楼平面图"
                       @change="projectChanged">
              <el-option v-for="item in options1"
                         :key="item.id"
                         :label="item.buildingName"
                         :value="item.id">
              </el-option>
            </el-select>
          </span>
          <span>
            <el-select v-model="floorName"
                       placeholder="楼层"
                       @change="checkFun">
              <el-option v-for="item in options3"
                         :key="item.name"
                         :label="item.name"
                         :value="item.name">
              </el-option>
            </el-select>
          </span>
          <div class="query-btn"
               @click="checkFun"
               style="margin-top:0">查询</div>
        </div>
        <div>
          <el-button size="mini"
                     class="iconfont icon-fangda  up"
                     :disabled="defaultScale>1.5"
                     @click="up"> 放大</el-button>
          <el-button size="mini"
                     class="iconfont icon-suoxiao shrink"
                     :disabled="defaultScale<0.3"
                     style="margin-left:15px"
                     @click="shrink"> 缩小</el-button>
          <el-button size="mini"
                     class="iconfont icon-yuanshidaxiao  up"
                     :disabled="defaultScale===initScale"
                     style="margin-left:15px"
                     @click="resetScal"> 原始大小</el-button>
        </div>
      </div>
      <div id="svgDiv">
        <span class="svgHtml"
              id="svgHtml"
              v-html="svgHtml"
              v-show="svgHtmlShow"
              @contextmenu.prevent='editFn($event)'
              @click="editFn($event)"></span>
      </div>
      <span class="noData"
            v-if="svgHtml==='' ? true :false">暂无平面图</span>
    </div>
    <div class="svgIcon-label">
      <ul class="clearing">
        <li v-if="item.id == equipmentType ||equipmentType===''"
            v-for="(item, index) in svgIconOptions"
            :key="index">
          <img :src="item.url">
          <span>{{item.name}}</span>
        </li>
      </ul>
    </div>

    <!-- 关联房源信息 设备信息 -->
    <relevanDetails ref="relevanDetails"
                    :detailsdrawershow="detailsShow"
                    :detailType="planeStyle"
                    :menuTab="menuTabType"
                    :detailsList="detailsList"
                    :detailsName="detailsName"
                    @emitOpenbaoxiu="emitOpenbaoxiu1"
                    @emitOpenweixiu="emitOpenweixiu1"
                    @emitOpenbaoyang="emitOpenbaoyang"
                    @showDevicesDetails="showDevicesDetails"
                    @drawerClose="detailsClose" />
    <!-- 设备详情 -->
    <deviceDetails ref="deviceDetails"
                   :detailsdrawershow="devicesDetailsShow"
                   :detailsData="deviceDetailsData"
                   equirementClass="other"
                   :equirementTypes="getEquirementTypes4List"
                   :projectManagementsList="projectManagementsList"
                   :tenantList="tenantList"
                   @bindSuccessFun="bindSuccessFun"
                   @emitOpenbaoxiu="emitOpenbaoxiu1"
                   @emitOpenweixiu="emitOpenweixiu1"
                   @emitOpenbaoyang="emitOpenbaoyang"
                   @cannelFn="cannelFn"
                   @drawerClose="deviceDetailsClose" />
    <!-- 重构后保修单 、维修单详情 -->
    <addRepair ref="addRepair"
               :detailsdrawershow="detailsShow1"
               :repairDetails="repairDetails"
               hasAddBtn="none"
               :drawerTitle="drawerTitle"
               @drawerClose="addRepairdrawerClose" />
    <!-- 维修详情、报修单 -->
    <weixiu :detailsdrawershow="weixiuShow"
            :drawerTitle="weixiuTitle"
            :isBaoxiudan="isBaoxiudan"
            :equirementId="equirementId"
            :repairDetailsData="repairDetailsData"
            @drawerClose="weixiuClose" />
    <!-- 保养详情 -->
    <baoyang :detailsdrawershow="baoyangShow"
             :drawerTitle="baoyangTitle"
             :equirementId="equirementId"
             :repairDetailsData="repairDetailsData"
             @drawerClose="baoyangClose" />
    <!-- 报修单详情 -->
    <baoxiu :detailsdrawershow="baoxiuShow"
            :equirementId="equirementId"
            :repairDetailsData="repairDetailsData"
            @drawerClose="baoxiuClose" />
  </div>
</template>

<script>
import context from '@/service'
import axios from 'axios'
import EquipmentConfigJSON from '@/utils/global'
import relevanDetails from '../industryCAD/components/relevanDetails'
import addRepair from '../../operations/repairManagement/components/addRepair'
import deviceDetails from '../deviceList/components/deviceDetails'
import weixiu from '../deviceList/components/weixiu' // 维修详情
import baoyang from '../deviceList/components/baoyang' // 保养详情
import baoxiu from '../deviceList/components/baoxiu' // 保养详情
export default {
  name: 'energy',
  components: {
    addRepair,
    weixiu,
    baoyang,
    baoxiu,
    relevanDetails,
    deviceDetails
  },
  data () {
    return {
      equipmentType: '',
      getEquirementTypes4List: [],
      drawerTitle: '报修单详情',
      repairDetails: {},
      detailsShow1: false,
      baoxiuShow: false,
      weixiuShow: false,
      isBaoxiudan: false,
      weixiuTitle: '维修单详情',
      baoyangShow: false,
      baoyangTitle: '保养单详情',
      drawerTitle2: '',
      equirementId: null,
      energyType: '',
      fcReDetails: [],
      detailData: [],
      formLabelWidth: '',
      energyDataDetailShow: false,
      deviceOption: [
        { color: '#D92E20', value: '报警系统' },
        { color: '#3F5FBF', value: '灭火系统' },
        { color: '#F3AF2C', value: '联动分区系统' }
      ],
      repairDetailsShow: false,
      repairDetailsShow2: false,
      projectManagementsList: [],
      buildingName: '',
      repairDetailsData: {
        img: []
      }, // 维修记录详情1
      devicesDetailsShow: false,
      bindedList: [], // 平面图接口返回的已绑定信息
      detailsShow: false,
      roomList: [], // 房间列表
      planeType: 'FLOOR', // 平面图类型
      projectManagementId: '', // 商圈
      floorName: '', // 楼层
      firstTenant: null, // 默认第一栋楼数据
      svgId: null, // 当前楼层整张svg图的id
      options1: [
        { label: '楼平面图', value: 'BUILDING' }
      ],
      options2: [],
      options3: [],
      svgHtml: '',
      color: '',
      selfTarget: '',
      event: '',
      dialogFromIsShow: false,
      shopInfo: {
        shopName: '',
        id: '',
        shopNum: ''
      },
      pevDocment: { // 选中的DOm 和之前的样式
        target: null,
        style: null
      },
      offset: {
        offsetX: null,
        offsetY: null
      },
      floorsItem: null,
      svgHtmlShow: false,
      equirementTypeTxt: '',
      currentPage: 1,
      total: 0,
      pgSize: 15,
      defaultScale: '1',
      translateX: '0',
      translateY: '0',
      initScale: 1,
      planeStyle: '', // 详情类型 店铺详情ROOM  设备详情DEVICE
      menuTabType: 'ROOM', // 关联页tab类型
      detailsList: [], // 区域已绑定房源或设备信息列表svgList-list
      deviceDetailsData: {
        annexes: [],
        equirementType: {
          name: '',
          id: '',
          parent: {
            name: '',
            id: ''
          }
        },
        projectManagement: {
          projectName: ''
        },
        building: {
          buildingName: {

          }
        }
      },
      detailsName: '',
      repairRdNum: {},
      equirementTypes: [], // 设备大小类枚举
      equirementTypesChild: [], // 设备小类
      cascaderList: [], // 设备类型二级联选择器
      tenantList: [],
      svgIconOptions: [
        {
          url: require('../../../assets/equipmentIcon/cms_1110.png'),
          id: 17,
          name: '监控室'
        },
        {
          url: require('../../../assets/equipmentIcon/cms_车辆管理设备.png'),
          id: 18,
          name: '车辆管理设备'
        },
        {
          url: require('../../../assets/equipmentIcon/cms_115.png'),
          id: 19,
          name: '道闸'
        },
        {
          url: require('../../../assets/equipmentIcon/cms_网络机房.png'),
          id: 20,
          name: '网络机房'
        },
        {
          url: require('../../../assets/equipmentIcon/cms_音乐设备.png'),
          id: 21,
          name: '音乐设备'
        },
        {
          url: require('../../../assets/equipmentIcon/cms_1127.png'),
          id: 21,
          name: '弱电间'
        },
        {
          url: require('../../../assets/equipmentIcon/cms_1128.png'),
          id: 21,
          name: '弱电机房'
        }
      ],
      flag: false
    }
  },
  created () {
    this.projectManagementsList = this.$store.state.projectManagementsList
    this.projectManagementId = this.$route.params.projectManagementId ? this.$route.params.projectManagementId : this.projectManagementsList[0].id
    this.getEquirementTypes4() // 弱电系统
    this.getBuliding()
  },
  mounted () {
  },
  methods: {
    equirementTypeFillter (activeArr, isClear) { // activeArr选中设备类型name合集
      $('#svgDiv image').each(function () {
        if ($(this).attr('class') && $(this).attr('class').includes('cms_')) {
          let typeClass = $(this).attr('class').replace('cms_', '')
          let isInclude = activeArr.includes(typeClass)
          if (isInclude) {
            $(this).css('display', 'block')
          } else {
            $(this).css('display', 'none')
          }
        }
      })
    },
    handleChange (val) { // 设备类型二级联选择器
      let value = val ? [4, val] : [] // 消防设备大类id2 小类val
      if (!value.length) {
        $('#svgDiv image').each(function () {
          if ($(this).attr('class') && $(this).attr('class').includes('cms_')) {
            $(this).css('display', 'block')
          }
        })
        return
      }
      let arrLabel = []
      if (value.length === 1) { // 选中节点是第几级
        EquipmentConfigJSON.forEach((item, index) => { // cascaderList设备大小类数组
          if (value[0] === item.value) {
            item.children.forEach((nodes, i) => {
              arrLabel = arrLabel.concat(nodes.key)
            })
          }
        })
      } else if (value.length === 2) {
        let cascaderList = []
        EquipmentConfigJSON.forEach((item, index) => {
          if (value[0] === item.value) {
            cascaderList = item.children
          }
        })
        cascaderList.forEach((nodes, i) => {
          if (value[1] === nodes.value) {
            arrLabel = nodes.key
          }
        })
      }
      console.log(arrLabel)
      this.equirementTypeFillter(arrLabel)
    },
    getEquirementTypes4 () {
      context.http.get('/cms/api/equirementTypes/4').then(res => {
        this.getEquirementTypes4List = res.data
        this.equipmentType = this.$route.params.equipmentType ? this.$route.params.equipmentType : ''
      })
    },
    addRepairdrawerClose () {
      this.detailsShow1 = false
    },
    detailsClose () {
      this.detailsShow = false
      if (this.pevDocment.target) {
        if (!this.pevDocment.style.stroke) {
          $(this.pevDocment.target).attr({ 'stroke': '#000', 'stroke-widtn': '0.75px' })
        } else {
          $(this.pevDocment.target).attr(this.pevDocment.style)
        }
      }
    },
    deviceDetailsClose () {
      this.devicesDetailsShow = false
    },
    async cannelFn (equirementsId) { // 设备id
      let result = await context.http.get(`cms/api/equirements/${equirementsId}`)
      this.equirementId = equirementsId
      this.deviceDetailsData = result.data
      if (!this.deviceDetailsData.tenant) {
        this.deviceDetailsData.tenant = { id: null }
      }
    },
    emitOpenbaoxiu1 (id) {
      context.http.get(`cms/api/repair-forms/${id}`).then(res => { // 报修信息详情repairForms   维保记录详情repairRecords
        this.drawerTitle = '报修单详情'
        this.repairDetails = res.data
        this.detailsShow1 = true
      }).catch(error => {
        console.info(error)
      })
    },
    emitOpenweixiu1 (id) {
      context.http.get(`cms/api/repair-forms/${id}`).then(res => { // 报修信息详情repairForms   维保记录详情repairRecords
        this.drawerTitle = '维修单详情'
        this.repairDetails = res.data
        this.detailsShow1 = true
      }).catch(error => {
        console.info(error)
      })
    },
    emitOpenweixiu (id, baoxiudan) { // 查看 维修 baoxiudan维修详情是否有报修单模块
      context.http.get(`cms/api/repair-records/${id}`).then(res => {
        this.repairDetailsData = res.data
        this.isBaoxiudan = baoxiudan
        this.weixiuShow = true
      }).catch(error => {
        console.info(error)
      })
    },
    emitOpenbaoyang (id) { // 查看 维修 baoxiudan维修详情是否有报修单模块
      context.http.get(`cms/api/repair-records/${id}`).then(res => {
        this.repairDetailsData = res.data
        this.baoyangShow = true
      }).catch(error => {
        console.info(error)
      })
    },
    emitOpenbaoxiu (id) { // 查看报修单信息详情
      context.http.get(`cms/api/repair-forms/${id}`).then(res => { // 报修信息详情repairForms   维保记录详情repairRecords
        this.repairDetailsData = res.data
        this.baoxiuShow = true
      }).catch(error => {
        console.info(error)
      })
    },
    baoxiuClose () {
      this.baoxiuShow = false
    },
    weixiuClose () {
      this.weixiuShow = false
    },
    baoyangClose () {
      this.baoyangShow = false
    },
    getTenantList (id) {
      context.http.get(`cms/api/tenant/projectManagement/${id}`, { size: 10000 }).then(res => { // 根据项目id查所有客户
        this.tenantList = res.data
        this.devicesDetailsShow = true
      }).catch(error => {
        console.info(error)
      })
    },
    async getEquirementTypes () { // 请求设备大小类
      let result = await context.http.get('/cms/api/equirementTypes/tree')
      this.equirementTypes = result.data
      this.equirementTypes.forEach((element, index) => {
        this.cascaderList.push({ value: element.id, label: element.name, children: [] })
        element.child.forEach(item => {
          this.cascaderList[index].children.push({ value: item.id, label: item.name })
        })
      })
    },
    resetScal () {
      let svgW = parseInt($('#svgHtml svg').attr('width'))
      let svgH = parseInt($('#svgHtml svg').attr('height'))
      this.defaultScale = this.initScale
      $('#svgHtml svg').css({
        'transform': `scale(${this.defaultScale})`,
        'transform-origin': '0 0 0'
      })
      $('#svgDiv').css({
        'overflow': 'inherit',
        'justify-content': 'center'
      })
      $('#svgHtml').width(svgW * this.defaultScale)
      $('#svgHtml').height(svgH * this.defaultScale)
    },
    downloadFile (item, index) {
      axios({
        method: 'GET',
        url: '/ywm/api/annex/download',
        params: {
          annexURL: item.annexURL,
          annexName: item.annexName
        },
        responseType: 'blob'
      }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', item.annexName)
        document.body.appendChild(link)
        link.click()
      })
    },
    repairDetailsClose1 () {
      this.repairDetailsShow2 = false
    },
    repairDetailsClose () {
      this.repairDetailsShow = false
    },
    showRepairDetails (id) { // 查看维修记录详情
      context.http.get(`cms/api/repair-records/${id}`).then(res => {
        this.repairDetailsData = res.data
        this.repairDetailsShow2 = true
      }).catch(error => {
        console.info(error)
      })
    },
    showRepairDetails_forms (id) { // 查看维修记录详情
      context.http.get(`cms/api/repair-forms/${id}`).then(res => {
        this.repairDetailsData = res.data
        this.repairDetailsShow = true
      }).catch(error => {
        console.info(error)
      })
    },
    devicesDetailsClose () {
      // this.detailsShow = false
      this.devicesDetailsShow = false
    },
    backFn () {
      this.devicesDetailsShow = false
    },
    showDevicesDetails (id) { // 查看设备详情
      context.http.get(`cms/api/equirements/${id}`).then(res => {
        this.deviceDetailsData = res.data
        this.equirementId = res.data.id
        this.getTenantList(this.projectManagementId)
      }).catch(error => {
        console.info(error)
      })
    },
    roterTo (name, isestate) {
      this.$router.push({ name: name, params: { projectManagementId: this.projectManagementId, equipmentType: this.equipmentType } })
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    bindSuccessFun () {
      this.checkFun('refreshSvg')
    },
    floorDataFn (n) {
      this.firstTenant = n
    },
    async getBuliding () { // 楼宇
      let result = await context.http.get('cms/api/buildings/newList?sort=sortNumber,asc&sort=id,asc', { page: 0, size: 100, useStatus: 'USING', projectId: this.projectManagementId })
      if (result.data && result.data.length) {
        this.options1 = result.data
        // this.options1.unshift({id: null, buildingName: '层平面图'})
        this.buildingName = this.options1[0].id
        this.projectChanged()
      }
    },
    async projectChanged () { // 楼层
      let result = await context.http.get('cms/api/floors/svg', { projectManagementId: this.projectManagementId, buildingId: this.buildingName })
      this.options3 = result.data
      if (this.options3.length > 0) {
        let defultFloorName = ''
        this.options3.forEach((item, index) => {
          if (item.name === '1' || item.name === '一层' || item.name === '一' || item.name === '1层') {
            defultFloorName = item.name
          }
        })
        defultFloorName = defultFloorName === '' ? this.options3[0].name : defultFloorName
        this.floorName = defultFloorName
        this.checkFun()
      }
    },
    async checkFun (state) { // 查看对应平面图
      if (this.flag) return
      this.flag = true
      this.svgHtmlShow = false
      let _this = this
      if (this.buildingName) {
        this.planeType = 'BUILDING'
      } else {
        this.planeType = 'FLOOR'
      }
      let result = await context.http.get('cms/api/plan', {
        floorName: this.floorName,
        planeType: this.planeType,
        projectManagementId: this.projectManagementId,
        planeStyle: 'WEAK_CURRENT',
        buildingName: this.buildingName
      })
      if (result.data === '') {
        this.svgHtml = ''
        this.flag = false
        return
      }
      this.svgHtml = result.data.svg
      this.svgId = result.data.id
      this.bindedList = result.data.svgList
      if (state === 'refreshSvg') {
        for (var i = 0; i < this.bindedList.length; i++) {
          if (this.editSvgId === this.bindedList[i].svgId) {
            this.detailsList = this.bindedList[i].list
          }
        }
      }
      this.$nextTick(() => {
        $('#svgDiv svg  title').remove()
        _this.renderSVG()
        _this.SVGAutoscale()
      })
    },
    renderSVG () {
      this.handleChange(this.equipmentType)
      $('#svgDiv image').each(function () {
        if ($(this).attr('class') && $(this).attr('class').includes('cms_')) $(this).attr('xlink:href', $(this).attr('xlink:href') + '.png')
      })
      let bindedList = this.bindedList
      bindedList.forEach(item => {
        if (item.planeStyle === 'DEVICE') {
          let eleId = item.svgId
          let url = $('#' + eleId).attr('xlink:href')
          if ($('#' + eleId).attr('class') && $('#' + eleId).attr('class').includes('cms_')) $('#' + eleId).attr('xlink:href', url.substring(0, url.lastIndexOf('.png')))
        }
      })
      this.svgHtml = $('#svgHtml').html()
      this.flag = false
    },
    SVGAutoscale () { // sgv自适应页面大小
      let DIVw = $('#svgDiv').width()
      let DIVh = $('#svgDiv').height()
      if (!$('#svgHtml svg').attr('width') || !$('#svgHtml svg').attr('height')) {
        $('#svgHtml svg').attr('width', '1980')
        $('#svgHtml svg').attr('height', '1080')
      }
      let svgW = parseInt($('#svgHtml svg').attr('width'))
      let svgH = parseInt($('#svgHtml svg').attr('height'))
      let defaultScale = 1
      if (svgW > DIVw) {
        defaultScale = DIVw / svgW
      }
      this.defaultScale = defaultScale
      this.initScale = defaultScale // 默认缩放比例 =》是否展示滚动条
      $('#svgDiv').css({
        'height': svgH * defaultScale,
        'overflow': 'inherit'
      })
      $('#svgHtml').width(svgW * defaultScale)
      $('#svgHtml').height(svgH * defaultScale)
      this.svgHtmlShow = true
      this.$nextTick(() => {
        $('#svgHtml svg').css({
          'transform': `scale(${this.defaultScale})`,
          'transform-origin': '0 0 0'
        })
      })
    },
    shrink () {
      if (this.defaultScale < 0.3) {
        return
      }
      this.defaultScale = this.defaultScale - 0.1
      let DIVw = $('#svgDiv').width()
      let DIVh = $('#svgDiv').height()
      let svgW = parseInt($('#svgHtml svg').attr('width'))
      let svgH = parseInt($('#svgHtml svg').attr('height'))
      if (this.defaultScale > this.initScale) { // 如果当前比例大于默认比例则出现滚动条
        $('#svgDiv').css({
          'overflow': 'scroll',
          'justify-content': 'flex-start'
        })
      } else {
        $('#svgDiv').css({
          'overflow': 'inherit',
          'justify-content': 'center'
        })
      }
      $('#svgHtml svg').css({
        'transform': `scale(${this.defaultScale})`,
        'transform-origin': '0 0 0'
      })
      $('#svgHtml').width(svgW * this.defaultScale)
      $('#svgHtml').height(svgH * this.defaultScale)
    },
    up () {
      if (this.defaultScale > 1.3) {
        return
      }
      this.defaultScale += 0.1
      let DIVw = $('#svgDiv').width()
      let DIVh = $('#svgDiv').height()
      let svgW = parseInt($('#svgHtml svg').attr('width'))
      let svgH = parseInt($('#svgHtml svg').attr('height'))
      if (this.defaultScale > this.initScale) { // 如果当前比例大于默认比例则出现滚动条
        $('#svgDiv').css({
          'overflow': 'scroll',
          'justify-content': 'flex-start'
        })
      } else {
        $('#svgDiv').css({
          'overflow': 'inherit',
          'justify-content': 'center'
        })
      }
      $('#svgHtml svg').css({
        'transform': `scale(${this.defaultScale})`,
        'transform-origin': '0 0 0'
      })
      $('#svgHtml').width(svgW * this.defaultScale)
      $('#svgHtml').height(svgH * this.defaultScale)
    },
    editFn (event) { // 右键编辑事件
      if (this.svgHtml !== '') {
        let self = event.target || event.srcElement
        this.selfTarget = self
        this.offset.offsetX = event.offsetX
        this.offset.offsetY = event.offsetY
        // if (self.tagName === 'image' || self.tagName === 'path' || self.tagName === 'polygon' || self.tagName === 'rect') {
        if (self.tagName === 'image' && $(self).attr('class').includes('cms_')) {
          if (this.isBind(self.id)) { // 区域已绑定房源或设备
            if (this.detailsList.length > 1) { // 区分绑定区域是单个/多个设备
              this.editSvgId = self.id
              this.detailsShow = true
            } else {
              this.showDevicesDetails(this.detailsList[0].id)
            }
          } else { // 未绑定房源
            this.$message({
              type: 'error',
              message: '该区域暂未绑定设备'
            })
          }
        }
      }
    },
    isBind (svgid) { // 右键选中 判断该房源是否已经绑定
      for (var i = 0; i < this.bindedList.length; i++) {
        if (svgid === this.bindedList[i].svgId) {
          this.planeStyle = this.bindedList[i].planeStyle // 区块绑定的类型 房源or 设备
          this.menuTabType = this.bindedList[i].planeStyle // 区块绑定的类型 房源or 设备
          this.detailsList = this.bindedList[i].list
          this.detailsName = this.bindedList[i].name
          return true
        }
      }
      return false
    },
    handleClose () {
      this.dialogFromIsShow = false
    }
  }
}
</script>
<style lang="scss">
.firecontrolChart {
  .el-table__header thead tr th {
    background-color: #ffffff;
  }
}
.energyDataDetailShow {
  .el-drawer .el-drawer__header {
    margin: 20px 20px 0px 20px;
  }
}
</style>
<style lang="scss" scoped>
svg polygon.bind,
svg path.bind,
svg rect.bind {
  stroke-width: "2px" !important;
  stroke: "#00ff00" !important;
  fill: "rgba(0,0,0,0.2)" !important;
}
.conDetail {
  border: 1px solid #ebebeb;
  .normal {
    color: #49af61;
  }
  .abnormal {
    color: #ff6665;
  }
}
.dc-right {
  width: 100%;
  margin-top: 20px;
  .dr-head {
    background-color: #fafafa;
    height: 40px;
    line-height: 40px;
    padding-left: 12px;
    font-size: 14px;
    margin-bottom: 20px;
  }
  .el-form {
    display: flex;
    flex-wrap: wrap;
    .el-form-item__content {
      span {
        color: #888;
        font-size: 12px;
      }
    }
    .enclosure-list {
      .el-item {
        > span {
          color: #888;
          font-size: 12px;
        }
      }
    }
  }
  .contract-rules {
    span {
      display: inline-block;
      background-color: #fff;
      color: #0f75ff;
      border: 1px solid #0f75ff;
      cursor: pointer;
      height: 24px;
      line-height: 23px;
      border-radius: 4px;
      font-size: 12px;
      padding: 0 4px;
      float: right;
      margin: 7px 10px 0 0;
      &:hover {
        background-color: #0f75ff;
        color: #fff;
      }
    }
  }

  .el-form-item {
    display: inline-block;
    width: 29%;
    margin-left: 16px;
    margin-right: 10px;

    &:nth-of-type(2n) {
      margin-right: 0;
    }
  }

  .dc-right_div {
    border: 1px solid #e7e7e7;
    margin-top: 20px;

    .cttitle span:nth-of-type(2) {
      color: #0f75ff;
      font-size: 12px;
      float: right;
      cursor: pointer;
    }

    .psotmaster span {
      color: #666 !important;
    }
  }
}
.energySystem {
  .query-btn {
    display: inline-block;
    width: 120px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
    color: #fff;
    border-radius: 3px;
    background-color: #3577f6;
  }
  .query-btn:hover {
    background-color: #2a6ef0;
  }
  .menuTab {
    height: 60px;
    margin-top: 15px;
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 4px 4px 4px 1px #eee;
    > span {
      position: relative;
      display: inline-block;
      width: 120px;
      text-align: center;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
      font-size: 14px;
      &.active {
        color: #3577f6;
        border-bottom: 2px solid #3577f6;
      }
      > span {
        display: block;
        position: absolute;
        top: 20px;
        right: 6px;
        min-width: 16px;
        height: 16px;
        line-height: 16px;
        padding: 0 3px;
        font-weight: normal;
        color: white;
        text-align: center;
        text-shadow: 0 1px rgba(0, 0, 0, 0.2);
        border-radius: 16px;
        background: #cb444a;
        font-size: 12px;
      }
    }
  }
}
.seachDiv {
  height: 80px;
  background-color: #ffffff;
  margin-top: 15px;
  border-radius: 5px;
  box-shadow: 4px 4px 4px 1px #eee;
  display: flex;
  align-items: center;
  padding-left: 20px;
  span {
    margin-right: 40px;
  }
}
.content {
  min-height: 720px;
  background-color: #ffffff;
  position: relative;
  padding-bottom: 20px;
  padding-top: 10px;
  box-shadow: 0px 2px 3px 0px rgba(190, 199, 208, 0.2);
  .saclBtn {
    display: flex;
    padding: 10px 20px 10px 0;
    align-items: center;
    justify-content: space-between;

    .tips {
      display: flex;
      color: #666666;
      width: 70%;
      span {
        display: inline-block;
        // width: 50%;
        height: 46px;
        line-height: 46px;
        padding: 0 10px;
        i {
          margin-right: 10px;
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
      }
    }
  }
  #svgDiv {
    height: 750px;
    position: relative;
    overflow: auto;
    display: flex;
    justify-content: center;
    // align-items: center;
  }
  #svgDiv::-webkit-scrollbar {
    width: 4px !important;
    height: 4px !important;
  }
  #svgDiv::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px #ffffff;
    background-color: #ffffff;
  }
  #svgDiv::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px #cccccc;
  }
  #svgDiv > span {
    // position: absolute;
    // left: 0;
    // right: 0;
    // top: 0;
    // bottom: 0;
    // margin: auto;
    display: inline-block;
  }
  .noData {
    background-color: rgba(0, 0, 0, 0.5);
    color: #ffffff;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 150px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-radius: 5px;
  }
}
svg {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
svg path:hover {
  fill: #000;
  fill-opacity: 0.1;
}
svg polygon:hover {
  fill: #000;
  fill-opacity: 0.1;
}
svg rect:hover {
  fill: #000;
  fill-opacity: 0.1;
}
.upload {
  position: relative;
  display: inline-block;
  border-radius: 2px;
  cursor: pointer;
  margin-left: 20px;
  input {
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}
</style>
<style>
#projectId .el-dialog__body {
  border-bottom: none;
  padding: 25px 25px 30px !important;
}
</style>

