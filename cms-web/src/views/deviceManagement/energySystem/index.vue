<template>
  <div id="energySystem"
       class="energySystem">
    <span class="page_head_title">能耗系统</span>
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
                   placeholder="类型"
                   @change="checkFun">
          <el-option v-for="(item,index) in getEquirementTypes25List"
                     :key="index"
                     :value="item.id"
                     :label="item.name"></el-option>
        </el-select>
      </div>
      <!-- <div class="query-btn" @click="checkFun" style="margin-top:0">查询</div> -->
    </div>
    <!--  -->
    <ul class="default_tab_block">
      <li class="active"
          v-if="hasAuthority('03010101')">
        <span>能耗管线图</span>
      </li>
      <li @click="roterTo('energyEquipment')"
          v-if="hasAuthority('03010102')">
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
        <li v-if="item.id === equipmentType"
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
                   :equirementTypes="getEquirementTypes25List"
                   equirementClass="other"
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
import relevanDetails from '../industryCAD/components/relevanDetails'
import deviceDetails from '../deviceList/components/deviceDetails'
import addRepair from '../../operations/repairManagement/components/addRepair'
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
      getEquirementTypes25List: [],
      equipmentType: '',
      projectManagementsList: [],
      buildingName: '',
      repairDetailsData: {
        img: []
      }, // 维修记录详情1
      devicesDetailsShow: false,
      bindedList: [], // 平面图接口返回的已绑定信息
      detailsShow: false,
      detailData: [],
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
          url: require('../../../assets/equipmentIcon/cms_1122.png'),
          name: '水表',
          id: 26
        },
        {
          url: require('../../../assets/equipmentIcon/cms_1121.png'),
          name: '水阀门开关',
          id: 26
        },
        {
          url: require('../../../assets/equipmentIcon/cms_1114.png'),
          name: '生活水箱',
          id: 26
        },
        {
          url: require('../../../assets/equipmentIcon/cms_1123.png'),
          name: '水泵房',
          id: 26
        },
        {
          url: require('../../../assets/equipmentIcon/cms_1111.png'),
          name: '电表',
          id: 27
        },
        {
          url: require('../../../assets/equipmentIcon/cms_1112.png'),
          name: '电箱控制柜',
          id: 27
        },
        {
          url: require('../../../assets/equipmentIcon/cms_111.png'),
          name: '高配间',
          id: 27
        },
        {
          url: require('../../../assets/equipmentIcon/cms_1126.png'),
          name: '强电间',
          id: 27
        },
        {
          url: require('../../../assets/equipmentIcon/cms_114.png'),
          name: '配电柜',
          id: 27
        },
        {
          url: require('../../../assets/equipmentIcon/cms_照明设备.png'),
          name: '照明设备',
          id: 27
        },
        {
          url: require('../../../assets/equipmentIcon/cms_117.png'),
          name: '空调机房',
          id: 27
        },
        {
          url: require('../../../assets/equipmentIcon/cms_118.png'),
          name: '空调室外机',
          id: 27
        },
        {
          url: require('../../../assets/equipmentIcon/cms_119.png'),
          name: '空调室内机',
          id: 27
        },
        {
          url: require('../../../assets/equipmentIcon/cms_燃气阀门.png'),
          name: '燃气阀门',
          id: 28
        },
        {
          url: require('../../../assets/equipmentIcon/cms_燃气表.png'),
          name: '燃气表',
          id: 28
        },
        {
          url: require('../../../assets/equipmentIcon/cms_燃气设备.png'),
          name: '燃气设备',
          id: 28
        }
      ],
      flag: false
    }
  },
  created () {
    this.projectManagementsList = this.$store.state.projectManagementsList
    this.projectManagementId = this.$route.params.projectManagementId ? this.$route.params.projectManagementId : this.projectManagementsList[0].id
    this.getEquirementTypes25()
    // this.getEquirementTypes()
  },
  mounted () {
  },
  methods: {
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
        console.log(this.deviceDetailsData)
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
    getEquirementTypes25 () {
      context.http.get('/cms/api/equirementTypes/25').then(res => {
        this.getEquirementTypes25List = res.data
        this.equipmentType = this.$route.params.equipmentType ? this.$route.params.equipmentType : this.getEquirementTypes25List[0].id
        this.getBuliding()
      })
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
      console.log(n)
    },
    async getDataAuthorityOptions (searchKey) { // 项目
      let result = await context.http.get('cms/api/project-managements', { page: 0, size: 100, sort: 'desc', useStatus: 'USING' })
      this.options2 = result.data
      this.projectManagementId = this.options2[0].id
      this.getBuliding()
    },
    async getBuliding () { // 楼宇
      let result = await context.http.get('cms/api/buildings/newList?sort=sortNumber,asc&sort=id,asc', { page: 0, size: 100, useStatus: 'USING', projectId: this.projectManagementId })
      console.log(result)
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
    checkFun (state) { // 查看对应平面图
      if (this.flag) return
      this.flag = true
      this.svgHtmlShow = false
      let _this = this
      if (this.buildingName) {
        this.planeType = 'BUILDING'
      } else {
        this.planeType = 'FLOOR'
      }
      context.http.get('cms/api/plan', {
        floorName: this.floorName,
        planeType: this.planeType,
        projectManagementId: this.projectManagementId,
        planeStyle: 'ENERGY_CONSUMPTION',
        buildingName: this.buildingName,
        equirementTypeChildId: this.equipmentType
      }).then(result => {
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
      }).catch(error => {
        this.flag = false
        console.log(error)
      })
    },
    renderSVG () {
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
        console.log(this.selfTarget.id)
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
<style lang="scss" scoped>
svg polygon.bind,
svg path.bind,
svg rect.bind {
  stroke-width: "2px" !important;
  stroke: "#00ff00" !important;
  fill: "rgba(0,0,0,0.2)" !important;
}
.energySystem {
  .query-btn {
    display: inline-block;
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
}
.content {
  min-height: 720px;
  background-color: #ffffff;
  position: relative;
  padding-top: 10px;
  padding-bottom: 20px;
  box-shadow: 0px 2px 3px 0px rgba(190, 199, 208, 0.2);
  .saclBtn {
    display: flex;
    padding: 10px 20px 10px;
    justify-content: space-between;
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

