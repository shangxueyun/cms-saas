<template>
  <div id="industryCAD"
       @click="showBox=false">
    <span class="page_head_title">房源招租</span>
    <ul v-if="approvalShow"
        class="default_tab_block">
      <li v-if="hasAuthority('02020204')"
          class="active">
        <span>房源平面图</span>
      </li>
      <li v-if="hasAuthority('02020205')"
          @click="switchover('charts')">
        <span>租控图</span>
      </li>
      <li v-if="hasAuthority('02020201') || hasAuthority('02020202') || hasAuthority('02020203')"
          @click="switchover('housingList')">
        <span>房源列表</span>
      </li>
    </ul>
    <!--<h2 class="title" style="font-weight: normal;color:#333">平面图</h2>-->
    <div v-if="approvalShow"
         class="search-bar">
      <div>
        <span>
          <el-select v-model="projectManagementId"
                     placeholder="项目"
                     @change='getBuliding'>
            <el-option v-for="item in projectOptions"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
        </span>
        <span>
          <el-select v-model="buildingName"
                     placeholder="层/楼平面图"
                     @change="getFloorList">
            <el-option v-for="item in options2"
                       :key="item.id"
                       :label="item.buildingName"
                       :value="item.id">
            </el-option>
          </el-select>
        </span>
        <span>
          <el-select v-model="floorName"
                     placeholder="楼层">
            <el-option v-for="item in options3"
                       :key="item.name"
                       :label="item.name"
                       :value="item.name">
            </el-option>
          </el-select>
        </span>
        <span class="upload">
          <span @click="checkFun"
                v-if="hasAuthority('02020204')"
                class="query-btn">查询</span>
          <el-button type="info"
                     v-else>暂无查看平面图权限</el-button>
        </span>
      </div>
    </div>
    <!--<div class="menu">
        <span @click="switchover">招商进度</span>
        <span class="active">业态分布</span>
      </div>-->
    <div class="content"
         id="content">
      <div class="saclBtn">
        <div class="tips">
          <div v-for="(item, index) in useDTOS"
               :key="index"
               class="colorBox">
            <span>{{item.tenantUseDescription}}</span>
            <span v-for="(items, index) in item.value"
                  :key="index"><i :style="`backgroundColor:${items.description}`"></i>{{items.value}}</span>
          </div>
        </div>
        <div class="btn-wrap">
          <el-button size="mini"
                     class="iconfont icon-fangda  up"
                     style="margin-left:15px"
                     :disabled="defaultScale>1.5"
                     @click="up"> 放大</el-button>
          <el-button size="mini"
                     class="iconfont icon-suoxiao shrink"
                     :disabled="defaultScale<0.3"
                     @click="shrink"> 缩小</el-button>
          <el-button size="mini"
                     class="iconfont icon-yuanshidaxiao  up"
                     :disabled="defaultScale===initScale"
                     style="margin-left:10px"
                     @click="resetScal"> 原始大小</el-button>
        </div>
      </div>
      <div v-if="!approvalShow"
           class="approval_back"
           @click="approvalBack"><span class="iconfont icon-Left"></span><span>返回审批页面</span></div>
      <div id="svgDiv"
           @scroll="handleScroll">
        <span class="svgHtml"
              id="svgHtml"
              v-html="svgHtml"
              v-show="svgHtmlShow"
              @click.stop="clickFun($event)"
              @contextmenu.prevent='editFn($event)'></span>
      </div>
      <span class="noData"
            v-if="svgHtml==='' ? true :false">暂无平面图</span>
      <div class="showBox"
           id="showBox"
           v-show="showBox">
        <div v-for="item in svgListInfo.tenants"
             style="margin-bottom:10px"
             :key="item.id">
          <p>客户：{{item.referred}}</p>
          <p>房源号：
            <!-- <span v-for="itm in item.roomsList"
                  :key="itm.id">{{itm.shopNumber}}、</span> -->
            <span>{{shopNumberFormatter(item.roomsList)}}</span>
          </p>
          <p>面积：<span>{{setArea(item.roomsList)}}m²</span></p>
          <p>实时单价：{{formatContractPrice(item.contractPrice, 'M2DAYS')}}</p>
        </div>

        <div v-for="item in svgListInfo.noTenantRooms"
             style="margin-bottom:10px"
             :key="item.id">
          <p>房源号：<span>{{item.shopNumber}}</span></p>
          <p>面积：<span>{{item.buildingArea}}m²</span></p>
          <p>招商指导价：{{formatContractPrice(item.expectedUnitPrice, item.priceUnit)}}</p>
        </div>
      </div>
    </div>
    <storeDetailis :detailsdrawershow="storeDetailisShow"
                   :detailData="storeDetailisData"
                   :options1="projectOptions1"
                   :roomInfo="roomInfo"
                   :defaultAuthority="true"
                   ref="storeDetailis"
                   @shopDetails="storeDetailisShowFn"
                   @showStoreDetails="showStoreDetails"
                   @tenantHandleEdit='tenantHandleEdit'
                   @upDateStoreDetails="upDateStoreDetails"
                   @drawerClose="storeDetailisHide" />

    <!-- 客户详情 -->
    <tenantDetails :detailsdrawershow="tenantDetailsShow"
                   :tenantDetail="tenantDetailData"
                   ref="tenantDetails"
                   @affirmDialog="affirmDialog"
                   @drawerClose="tenantDetailsClose"
                   @query="tenantQuery"
                   @handleEdit="tenantHandleEdit"
                   @riskDetailsShowFn="riskDetailsShowFn"
                   @queryExportResult="queryExportResult"
                   v-if="tenantDetailsShow" />
    <!-- 风险详情 -->
    <riskDetails :detailsdrawershow="riskDetailsShow"
                 :tenantDetail="tenantDetailData"
                 :riskTab="riskTab"
                 @drawerClose="riskDetailsClose" />
    <!-- 合同详情 -->
    <contractsDetails :detailsdrawershow="contractsDetailsShow"
                      :detailData="contractsDetailData"
                      :withdrawalData="withdrawalData"
                      ref="contractsDetails"
                      @openAddDialog="openAddDialog"
                      @drawerClose="contractDrawerClose"
                      @showTenant="showTenant" />
    <!-- 客户详情导入 -->
    <el-dialog title="提示"
               :visible.sync="centerDialogVisible"
               class="turnoverDialog"
               width="30%"
               center>
      <span>该客户目前可能未租赁房源，是否继续导入</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <span class="UpBtn1">
          <i>确 定</i>
          <input type="file"
                 @change="importTenant('addapp', $event)"
                 id="importTenant">
        </span>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import context from '@/service'
import storeDetailis from '../../project/housingList/components/storeDetailis'
import tenantDetails from '@/views/operationManagement/tenantInfo/components/tenantDetails.vue'
import contractsDetails from '@/views/contractManagement/contractsList/components/contractsDetails.vue'
import riskDetails from '@/views/operationManagement/tenantInfo/components/riskDetails'
// import storeDetails from './components/storeDetails'
export default {
  name: 'industryCAD2',
  components: {
    // storeDetails
    storeDetailis,
    tenantDetails,
    contractsDetails,
    riskDetails
  },
  data () {
    return {
      riskDetailsShow: false,
      riskTab: 0,
      svgListInfo: {
        tenants: [],
        noTenantRooms: []
      },
      storeDetailisShow: false,
      storeDetailisData: {
        imgUrls: [],
        projectManagement: {
          projectName: ''
        },
        building: {},
        floor: {}
      },
      industryOptions: [], // 行业
      detailsShow: false, // 侧边弹窗
      planeType: 'FLOOR', // 平面图类型
      projectManagementId: '', // 商圈
      floorName: '', // 楼层
      buildingName: '', // 楼号
      berthPlan: 'ROOM', // 房源平面
      options1: [],
      options2: [],
      options3: [],
      svgHtml: '',
      svgHtmlShow: false,
      roomList: '', // 所有房间列表信息
      roomInfo: [{
        building: { projectManagementDTO: { previewImage: '', projectName: '' } },
        contractDTOS: { startDate: '', endDate: '' },
        floor: { name: '' },
        shopNumber: null,
        buildingArea: null,
        referred: null,
        tenants: [],
        noTenantRooms: [],
        list: [{
          show: false
        }]
      }], // 单个房间信息
      showBox: false, // 选中展示详情信息
      maxScale: 1,
      maxScaleX: 1,
      maxScaleY: 1,
      roomContractsList: [],
      lastTag: null,
      defaultScale: 1,
      initScale: 1,
      roomInvestment: {
        'roomsDTO': {
          'building': { 'projectManagementDTO': { 'previewImage': '', 'projectName': '' } },
          'projectManagement': { 'projectName': '' },
          'imgUrls': []
        }
      },
      roomInvestmentFlag: false,
      projectOptions: [],
      projectOptions1: [],
      tenantDetailsShow: false,
      centerDialogVisible: false,
      contractsDetailsShow: false,
      tenantDetailData: {},
      contractsDetailData: {},
      withdrawalData: {},
      useDTOS: [],
      approvalShow: true
    }
  },
  created () {
    if (this.$route.params.detailsData) {
      this.approvalShow = false
      this.projectManagementId = this.$route.params.projectManagementId
      this.buildingName = this.$route.params.buildingName
      this.floorName = this.$route.params.floorName
      this.checkFun()
      this.getDataAuthorityOptions1()
    } else {
      this.getDataAuthorityOptions()
    }
    this.industry()
    this.options1 = this.$store.state.projectManagementsList
  },
  mounted () {

  },
  methods: {
    approvalBack () {
      this.$router.push({ name: 'approverCenterDetails', params: { ...this.$route.params } })
    },
    riskDetailsClose () {
      this.riskDetailsShow = false
    },
    riskDetailsShowFn (i) {
      this.riskTab = i
      this.riskDetailsShow = true
    },
    queryExportResult (id, flag) { // flag  true代表经营数据 false税收数据
      this.flag = flag
      console.log(id)
      const loading = this.$loading({
        lock: true,
        text: '导入中',
        spinner: 'el-icon-loading el-import-loading',
        customClass: 'loading-icon',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let url = ''
      if (flag) {
        url = `/cms/api/tenantBusiness-excel/detail?excelId=${id}`
      } else {
        url = `/cms/api/tenantTax-excel/detail?excelId=${id}`
      }
      context.http.get(url).then(res => {
        if (res.data.excelResult === '审核中') {
          setTimeout(res => {
            this.queryExportResult(id, flag)
          }, 5000)
        } else if (res.data.excelResult === '失败') {
          this.errorPrompt = true
          this.gridData = [{
            fileName: res.data.name,
            result: res.data.remark,
            id: res.data.id
          }]
          loading.close()
        } else {
          this.$message({
            message: '导入成功！',
            type: 'success'
          })
          console.log(this.$refs['tenantDetails'].$refs['dynamicComponent1'])
          this.$refs['tenantDetails'].$refs['dynamicComponent1'].queryFn()
          loading.close()
          // this.query()
        }
      })
    },
    shopNumberFormatter (shopNumList) {
      let str = ''
      shopNumList.forEach((item, index) => {
        str += item.shopNumber + '、'
      })
      return str.substring(0, str.length - 1)
    },
    storeDetailisShowFn (storeId) {
      this.roomsRowId = storeId
      context.http.get('/cms/api/rooms/' + storeId).then(res => {
        // this.detailData = res.data
        // this.detailsShow = true
        this.storeDetailisData = res.data
        this.storeDetailisShow = true
      })
    },
    async getDataAuthorityOptions () {
      let result = await context.http.get('cms/api/project-managements', { page: 0, size: 100, sort: 'desc', useStatus: 'USING' })
      this.projectOptions = result.data
      this.projectManagementId = this.$route.params.projectId ? this.$route.params.projectId : this.projectOptions[0].id
      // 楼宇
      this.getbuilding(this.projectManagementId)
    },
    async getDataAuthorityOptions1 () {
      let result = await context.http.get('cms/api/project-managements', { page: 0, size: 100, sort: 'desc', useStatus: 'USING' })
      this.projectOptions1 = result.data
    },
    getbuilding (projectManagementId) {
      context.http.get(`cms/api/project/${projectManagementId}/buildings`, { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING' }).then(res => {
        this.options2 = res.data
        this.options2.unshift({ id: null, buildingName: '层平面图' })
        if (this.$route.params.buildingId) {
          this.buildingName = this.$route.params.buildingId
        } else {
          if (this.options2.length) {
            this.buildingName = this.options2[0].id
          } else {
            this.buildingName = null
          }
        }
        // 楼层
        // console.log(this.projectManagementId, this.buildingName)
        context.http.get('cms/api/floors/svg', { projectManagementId: projectManagementId, buildingId: this.buildingName }).then(res => {
          this.options3 = res.data
          // if (this.$route.params.floorId) {
          //   this.floorName = this.$route.params.floorId
          // } else {
          if (this.options3.length) {
            this.floorName = this.options3[0].name
          } else {
            this.floorName = null
          }
          // }
          this.checkFun()
        })
      })
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
    upDateStoreDetails (storeId) {
      this.storeDetailisShowFn(storeId)
    },
    storeDetailisHide () {
      this.storeDetailisShow = false
    },
    setReferred (val) {
      // console.log(val)
      //        let arr = []
      //        val.forEach(item => {
      //          if (item.referred) {
      //            arr.push(item.referred)
      //          }
      //        })
      //        return arr.join('、')
      return val[0].referred
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
    handleScroll (el) {
      this.showBox = false
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    isBind (svgid) { // 右键选中 判断该房源是否已经绑定
      for (var i = 0; i < this.roomList.length; i++) {
        if (svgid === this.roomList[i].svgId) {
          return true
        }
      }
      return false
    },
    clickFun (event) { // 左键展示房间详情
      let self = event.target
      let _this = this
      let top = parseInt($('#svgHtml').css('marginTop'))
      let left = parseInt($('#svgHtml').css('marginLeft'))
      this.showBox = false
      if (self.tagName === 'path' || self.tagName === 'polygon' || self.tagName === 'rect') {
        if (this.lastTag) {
          $(this.lastTag).attr({ 'stroke-width': $(self).attr('stroke-width'), 'stroke': '#000000' })
        }
        $(self).attr({ 'stroke-width': '2px', 'stroke': '#00ff00' })
        this.lastTag = self
        this.roomList.forEach(item => {
          if (self.id === item.svgId) {
            this.showBox = true
            $('#showBox').css({ top: event.clientY - $('#content').offset().top, left: event.clientX - $('#content').offset().left }) // 计算tips位置
            this.roomInfo = item.list
            this.svgListInfo = item
            console.log(this.roomInfo)
          }
        })
      }
    },
    editFn (event) { // 右键查看详情
      this.showBox = false
      let self = event.target
      if (self.tagName === 'path' || self.tagName === 'polygon' || self.tagName === 'rect') {
        if (this.lastTag) {
          $(this.lastTag).attr({ 'stroke-width': $(self).attr('stroke-width'), 'stroke': '#000000' })
        }
        $(self).attr({ 'stroke-width': '2px', 'stroke': '#00ff00' })
        this.lastTag = self
        for (var i = 0; i < this.roomList.length; i++) {
          if (self.id === this.roomList[i].svgId) {
            this.roomInfo = this.roomList[i].list
            this.storeDetailisShowFn(this.roomInfo[0].id)
          }
        }
      }
    },
    async getRoomContracts (id) { // 单独接口获取房间合同列表
      let result = await context.http.get('cms/api/contracts/rooms', { roomsId: id })
      this.roomContractsList = result.data
    },
    async getRoominvestment (id) { // 单独接口获取房源详情
      let result = await context.http.get(`cms/api/rooms/investment/${id}`)
      this.roomInvestment = result.data
      this.roomInvestmentFlag = true
      this.detailsShow = true
    },
    async checkFun () { // 查看对应平面图
      if (this.floorName === '' || this.projectManagementId === '') {
        this.$message({
          type: 'error',
          message: '请选择项目和楼层'
        })
        return
      }
      let _this = this
      if (this.buildingName) {
        this.planeType = 'BUILDING'
      } else {
        this.planeType = 'FLOOR'
      }
      let result = await context.http.get('cms/api/plan', { floorName: this.floorName, planeType: this.planeType, projectManagementId: this.projectManagementId, planeStyle: this.berthPlan, buildingName: this.buildingName })
      this.svgHtml = result.data.svg
      this.useDTOS = result.data.useDTOS
      this.svgId = result.data.id
      result.data.svgList ? this.roomList = result.data.svgList : this.roomList = []
      this.svgHtmlShow = false
      this.showBox = false
      this.$nextTick(() => {
        $('#svgDiv svg  title').remove()
        _this.renderSVG()
        // _this.SVGAutoscale()
      })
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
    renderSVG () { // 重新渲染svg
      // $("#svgHtml polygon[id^='svg_'],#svgHtml rect[id^='svg_'],#svgHtml path[id^='svg_']").attr('fill', '#ffffff') // 渲染默认填充白色 去掉text
      // $("#svgHtml text[id^='shopTextId_'],#svgHtml text[id^='shopNb_']").remove()
      let arr = this.roomList
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
          $('#svgHtml svg').find($('#' + eleId)).parent().append(shopTextDom)
          // $('#svgHtml svg').find($('#' + eleId)).parent().append(referredDom)   //根据测试要求 房源招租-房源平面图上只展示房源号
          this.svgHtml = $('#svgHtml').html()
        }
      })
      this.SVGAutoscale()
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
    async getFloorList () {
      let result = await context.http.get('cms/api/floors/svg', { projectManagementId: this.projectManagementId, buildingId: this.buildingName })
      this.options3 = result.data
      if (this.options3.length) {
        this.floorName = this.options3[0].name
      } else {
        this.floorName = null
      }
    },
    async getBuliding () {
      let result = await context.http.get(`cms/api/project/${this.projectManagementId}/buildings`, { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING' })
      this.options2 = result.data
      this.options2.unshift({ id: null, buildingName: '层平面图' })
      if (this.options2.length) {
        this.buildingName = this.options2[0].id
      } else {
        this.buildingName = null
      }
      this.getFloorList()
    },
    switchover (state) { // 平面图切换
      if (state === 'housingList') {
        this.$router.push({ name: 'housingList', params: { projectId: this.projectManagementId, buildingId: this.buildingName, floorId: this.floorName } })
      } else {
        this.$router.push({ name: 'charts', params: { projectId: this.projectManagementId, buildingId: this.buildingName, floorId: this.floorName } })
      }
    },
    async industry () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=行业')
      this.industryOptions = result.data
    },
    affirmDialog (contractId, tenantId) {
      this.centerDialogVisible = true
      this.contractId = contractId
      this.tenantId = tenantId
      console.log(contractId, tenantId)
    },
    tenantHandleEdit (index, row) {
      console.log(row)
      this.storeDetailisShow = false
      context.http.get('/cms/api/tenant/' + row.id).then(res => {
        this.tenantDetailData = res.data
        this.tenantDetailsShow = true
      })
    },
    contractDrawerClose (state) {
      console.log(state)
      this.contractsDetailsShow = false
      this.tenantDetailsShow = true
    },
    tenantDetailsClose (id) {
      if (!id) {
        this.tenantDetailsShow = false
        context.http.get('/cms/api/rooms/' + this.roomsRowId).then(res => {
          if (res.status === 200) {
            this.storeDetailisData = res.data
            this.storeDetailisShow = true
          }
        })
        return
      }
      context.http.get(`/cms/api/contracts/${id}`).then(res => {
        if (res.status === 200) {
          this.contractsDetailData = res.data
          this.tenantDetailsShow = false
          this.contractsDetailsShow = true
        }
      })
    },
    tenantQuery () { },
    showTenant (index, row) {
      this.tenantHandleEdit(0, row)
      this.contractsDetailsShow = false
    },
    openAddDialog () {
      this.$router.push({ name: 'contractsList', params: { pageFrom: 'TenantInformation' } })
    },
    showStoreDetails (storeId) {
      this.roomInfo = null
      this.storeDetailisShowFn(storeId)
    },
    importTenant (state, event) {
      let files = event.target.files
      let form = new FormData()
      form.append('file', files[0])
      form.append('contractId', this.contractId)
      form.append('tenantId', this.tenantId)
      let name = files[0].name
      let index = name.lastIndexOf('.')
      let type = name.substr(index + 1).toLowerCase()
      if (index > 0 && type !== 'xlsx' && type !== 'xls') {
        this.$message({
          message: '格式错误，请上传xlsx格式文件',
          type: 'error'
        })
      } else {
        context.http.post('/cms/api/tenantTurnover/file', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          this.centerDialogVisible = false
          this.$message({
            message: '导入成功！',
            type: 'success'
          })
          this.$refs.tenantDetails.getTurnoverList()// 调用子组件方法从新请求列表
          document.getElementById('importTenant').value = ''
          // this.getTurnoverList()
        }).catch(error => {
          document.getElementById('importTenant').value = ''
          console.info(error)
        })
      }
    }
  }
}
</script>
<style lang="scss">
// 覆盖element样式
#industryCAD {
  .el-button {
    &.iconfont {
      padding: 11px 10px;
      background-color: #ffffff;
      font-size: 14px !important;
      &.editBtn {
        border-color: #b3bcfc;
        color: #4155f5;
        &:hover {
          background-color: #f6f7ff;
        }
      }
      &.deleteBtn {
        border-color: #ffabb9;
        color: #ed3753;
        &:hover {
          background-color: #fff7f8;
        }
      }
      &.up {
        padding: 7px 8px;
      }
      &.shrink {
        padding: 7px 8px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
#industryCAD {
  .approval_back {
    text-align: right;
    padding-right: 20px;
    color: #3575f6;
    font-size: 14px;
    cursor: pointer;
    span:last-child {
      margin-left: 5px;
      text-decoration: underline;
    }
  }
  .tips {
    display: block;
    color: #666666;
    width: 80%;
    align-items: center;
    .colorBox {
      border: none;
      color: #000000;
      padding-left: 0px;
    }
    span {
      display: inline-block;
      // width: 50%;
      height: 32px;
      line-height: 32px;
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
.saclBtn {
  display: flex;
  padding: 10px 20px 20px 20px;
  justify-content: space-between;
  .btn-wrap {
    display: flex;
    button {
      height: 30px;
    }
  }
  .tipBox {
    flex: 1;
    .tips {
      width: 97%;
      display: flex;
      border: 1px solid #eeeeee;
      color: #666666;
      padding-left: 15px;
      border-radius: 3px;
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
  .tipBtnBox {
    padding-top: 10px;
  }
}
.menu {
  height: 62px;
  line-height: 62px;
  border-bottom: 1px solid #eeeeee;
  margin-top: 15px;
  margin-bottom: 20px;
  background-color: #ffffff;
  // padding-left: 20px;
  span {
    display: inline-block;
    width: 200px;
    height: 62px;
    text-align: center;
    cursor: pointer;
    &.active {
      border-bottom: 3px solid #3577f6;
      color: #3577f6;
    }
  }
}
.seachDiv {
  height: 80px;
  background-color: #ffffff;
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
  min-height: 750px;
  background-color: #ffffff;
  position: relative;
  padding-bottom: 50px;
}
#svgDiv {
  height: 750px;
  position: relative;
  overflow: auto;
  display: flex;
  justify-content: center;
  // align-items: center;
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
svg {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
.showBox {
  // width: 145px;
  /*height: 80px;*/
  padding: 10px;
  position: absolute;
  top: 0px;
  left: 100px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  color: #fff;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
