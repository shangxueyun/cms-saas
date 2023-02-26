<template>
  <div id="industryCAD">
    <span class="page_head_title">客户管理</span>
    <ul class="default_tab_block">
      <li v-if="hasAuthority('02030101')"
          class="active">
        <span>客户平面图</span>
      </li>
      <li v-if="hasAuthority('02030106')"
          @click="switchover('overview')">
        <span>租控图</span>
      </li>
      <li v-if="hasAuthority('02030102')"
          @click="switchover('list')">
        <span>客户列表</span>
      </li>
    </ul>
    <!--<h2 class="title" style="font-weight: normal;color:#333">平面图</h2>-->
    <div class="search-bar">
      <div class="searbar-left">
        <el-select v-model="organizeId"
                   @change="organizesChange"
                   placeholder="管理企业">
          <el-option v-for="item in organizesOptions"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="projectManagementId"
                   filterable
                   @change="projectChange"
                   placeholder="选择项目">
          <el-option v-for="item in projectManagementsList"
                     :key="item.id"
                     :label="item.projectName"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="buildingId"
                   placeholder="请选择资产"
                   @change="projectChanged">
          <el-option v-for="item in buildingOptions"
                     :key="item.id"
                     :label="item.buildingName"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="floorName"
                   placeholder="楼层"
                   @change="checkFun">
          <el-option v-for="item in floorList"
                     :key="item.name"
                     :label="item.sortNumber"
                     :value="item.name">
          </el-option>
        </el-select>
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
    <div class="content">
      <div class="saclBtn">
        <div class="tips">
          <!-- <div class="colorBox">
            <span v-for="(item,index) in industryOptions"
                  :key="index"><i :style="`backgroundColor:${item.description}`"></i>{{item.value}}</span>
          </div> -->
          <div v-for="(item, index) in useDTOS"
               :key="index"
               class="colorBox">
            <!-- <span>{{item.tenantUseDescription}}</span> -->
            <span>行业</span>
            <span v-for="(items, index) in item.value"
                  :key="index"><i :style="`backgroundColor:${items.description}`"></i>{{items.value}}</span>
          </div>
        </div>
        <div style="display:flex;align-items:center">

          <el-button size="mini"
                     class="iconfont icon-fangda  up"
                     :disabled="defaultScale>1.5"
                     @click="up"> 放大</el-button>

          <el-button size="mini"
                     class="iconfont icon-suoxiao shrink"
                     :disabled="defaultScale<0.3"
                     style="margin-left:10px"
                     @click="shrink"> 缩小</el-button>
          <el-button size="mini"
                     class="iconfont icon-yuanshidaxiao  up"
                     :disabled="defaultScale===initScale"
                     style="margin-left:10px"
                     @click="resetScal"> 原始大小</el-button>

        </div>
      </div>
      <div id="svgDiv"
           @scroll="handleScroll">
        <span class="svgHtml"
              id="svgHtml"
              v-html="svgHtml"
              v-show="svgHtmlShow"
              @click="editFn($event)"
              @contextmenu.prevent='editFn($event)'></span>
      </div>
      <span class="noData"
            v-if="svgHtml==='' ||  !svgHtml? true :false">暂无平面图</span>
      <!--<div class="showBox" id="showBox" v-show="showBox">
          <p>房源号：{{roomInfo.list[0].shopNumber}}</p>
          <p>面积：{{roomInfo.list[0].buildingArea}}m²</p>
          <p v-if="roomInfo.list[0].referred">客户：{{roomInfo.list[0].referred}}</p>
        </div>-->
    </div>
    <!-- 客户详情 -->
    <tenantDetails :detailsdrawershow="detailsShow"
                   :tenantDetail="detailData"
                   :tenantList="tenantList"
                   :checkData='checkData'
                   ref="tenantDetails"
                   @riskDetailsShowFn="riskDetailsShowFn"
                   @queryExportResult="queryExportResult"
                   @updateTenant="updateTenant"
                   @handleEdit="handleEdit"
                   @affirmDialog="affirmDialog"
                   @drawerClose="detailsClose"
                   v-if="detailsShow" />
    <!-- 风险详情 -->
    <riskDetails :detailsdrawershow="riskDetailsShow"
                 :tenantDetail="detailData"
                 :riskTab="riskTab"
                 @drawerClose="riskDetailsClose" />
    <!-- 合同详情 -->
    <contractsDetails :detailsdrawershow="contractsDetailsShow"
                      :detailData="contractsDetailData"
                      :withdrawalData="withdrawalData"
                      ref="contractsDetails"
                      @openAddDialog="openAddDialog"
                      @drawerClose="detailsCloses"
                      @showTenant="showTenant"
                      @handleEdit="handleEdit" />
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
                 @change="imageChange('addapp', $event)"
                 id="imageChange">
        </span>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import context from '@/service'
import tenantDetails from './components/tenantDetails'
import riskDetails from './components/riskDetails'
import contractsDetails from '@/views/contractManagement/contractsList/components/contractsDetails'
export default {
  name: 'tenantCAD',
  components: {
    tenantDetails,
    riskDetails,
    contractsDetails
  },
  data () {
    return {
      riskDetailsShow: false,
      riskTab: 0,
      contractsDetailsShow: false,
      contractsDetailData: {},
      withdrawalData: {},
      industryOptions: [], // 行业
      planeType: 'FLOOR', // 平面图类型
      projectManagementId: '', // 商圈
      organizeId: '', // 管理企业
      floorName: '', // 楼层
      buildingName: '', // 楼号
      buildingId: '', // 资产id
      berthPlan: 'ROOM', // 房源平面
      projectManagementsList: [],
      buildingOptions: [],
      options1: [],
      options2: [],
      floorList: [],
      svgHtml: '',
      svgHtmlShow: false,
      roomList: '', // 所有房间列表信息
      roomInfo: {
        building: { projectManagementDTO: { previewImage: '', projectName: '' } },
        contractDTOS: { startDate: '', endDate: '' },
        floor: { name: '' },
        shopNumber: null,
        buildingArea: null,
        referred: null
      }, // 单个房间信息
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
      detailsShow: false,
      detailData: {},
      centerDialogVisible: false,
      tenantList: [],
      useDTOS: [],
      checkData: [],
      organizesOptions: []
    }
  },
  created () {
    this.getOrganizes()
    if (this.$route.params.buildingName) {
      this.getBuliding2()
    } else {
      this.getBuliding()
    }
    this.industry()
  },
  mounted () {
  },
  methods: {
    async getOrganizes () { // 管理企业获取接口
      let res = await context.http.get('/uaa/api/organizes/enterprise/user', { useStatus: 'USING', organizeType: 'ENTERPRISE' })
      this.organizesOptions = res.data
      this.organizeId = this.$route.params.organizeId ? this.$route.params.organizeId : this.organizesOptions[0].id
      this.organizesChange(this.organizeId)
    },
    async organizesChange (id) { // 管理企业查名下项目
      this.projectManagementId = ''
      this.buildingId = ''
      this.projectManagementsList = []
      this.buildingOptions = []
      if (!id) {
        return
      }
      let res = await context.http.get('/cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: id })
      // debugger
      if (res.data && res.data.length) {
        this.projectManagementsList = res.data
        this.projectManagementId = this.projectManagementsList[0].id
        if (this.$route.params && this.$route.params.projectManagementId) {
          let temp = this.projectManagementsList.some(item => {
            return item.id === this.$route.params.projectManagementId
          })
          if (temp) {
            this.projectManagementId = this.$route.params.projectManagementId
          } else {
            this.projectManagementId = this.projectManagementsList[0].id
          }
        }
        this.projectChange(this.projectManagementId)
      } else {
        this.projectManagementsList = []
        this.projectManagementId = null
        this.buildingOptions = []
        this.buildingOptions.unshift({ id: null, buildingName: '层平面图' })
        this.buildingId = null
        this.floorList = []
        this.floorName = null
      }
      // this.projectManagementId = this.$route.params.projectManagementId ? this.$route.params.projectManagementId : this.projectManagementsList[0].id
    },
    async projectChange (id) { // 项目下资产
      this.buildingId = null
      this.buildingOptions = []
      this.floorName = null
      this.floorList = []
      if (!this.projectManagementId) {
        return
      }
      let res = await context.http.get('/cms/api/buildings/newList', { useStatus: 'USING', projectId: this.projectManagementId, page: 0, size: 9999, sort: 'id,asc' })
      if (res.data && res.data.length) {
        this.buildingOptions = res.data.filter((item, index) => {
          return item.assetsType === 'BUILDING'
        })
        this.buildingOptions.unshift({ id: null, buildingName: '层平面图' })
        this.buildingId = this.buildingOptions[0].id
        if (this.$route.params && this.$route.params.buildingId) {
          this.buildingOptions.forEach((item, index) => {
            if (item.id === this.$route.params.buildingId) {
              this.buildingId = this.$route.params.buildingId
            }
          })
          if (!this.buildingId) {
            this.buildingId = this.buildingOptions[0].id
          }
        }
        this.projectChanged()
      } else {
        this.buildingOptions = [{ id: null, buildingName: '层平面图' }]
        this.buildingId = null
        this.projectChanged()
      }
    },
    async projectChanged (id) {
      this.floorName = null
      this.floorList = []
      // let selectBuilding = this.buildingOptions.filter(item => {
      //   return item.id === id
      // })
      // this.floorList = selectBuilding[0].floorDTOSet
      // // console.log(this.floorList)
      // this.floorList.forEach((item, index) => {
      //   if (item.sortNumber === 1) {
      //     this.floorName = item.name
      //   }
      // })
      let result = await context.http.get('cms/api/floors/svg', { projectManagementId: this.projectManagementId, buildingId: this.buildingId })
      this.floorList = result.data
      if (this.floorList.length > 0) {
        let defultFloorName = ''
        this.floorList.forEach((item, index) => {
          if (item.sortNumber === 1) {
            defultFloorName = item.name
          }
        })
        defultFloorName = defultFloorName === '' ? this.floorList[0].name : defultFloorName
        this.floorName = defultFloorName
        this.checkFun()
      }
    },
    compare (sortNumber) {
      return function (a, b) {
        var val1 = a[sortNumber]
        var val2 = b[sortNumber]
        return val2 - val1
      }
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
    showTenant (index, row) {
      this.handleEdit(0, row)
      this.contractsDetailsShow = false
    },
    openAddDialog () {
      this.$router.push({ name: 'contractsList', params: { pageFrom: 'TenantInformation' } })
    },
    detailsCloses () {
      this.contractsDetailsShow = false
      this.detailsShow = true
    },
    affirmDialog (contractId, tenantId) {
      this.centerDialogVisible = true
      this.contractId = contractId
      this.tenantId = tenantId
      console.log(contractId, tenantId)
    },
    detailsClose (id) {
      this.checkFun()
      if (!id) {
        this.detailsShow = false
        return
      }
      context.http.get(`/cms/api/contracts/${id}`).then(res => {
        if (res.status === 200) {
          this.contractsDetailData = res.data
          this.detailsShow = false
          this.contractsDetailsShow = true
        }
      })
    },
    //      handleEdit (e) {
    //        console.log(e)
    //        context.http.get('/cms/api/tenant/' + row.id).then(res => {
    //          this.detailData = res.data
    //          this.detailsShow = true
    //        })
    //      },
    switchover (state) { // 平面图切换
      this.buildingOptions.shift()
      // if (!this.buildingId) {
      //   this.buildingId = this.buildingOptions[0].id
      // }
      let searchObj = {
        organizeId: this.organizeId,
        projectManagementId: this.projectManagementId,
        buildingId: this.buildingId,
        floorName: this.floorName,
        floorList: this.floorList
      }
      // sessionStorage.setItem('searchObj', JSON.stringify(searchObj))
      if (state === 'overview') {
        this.$router.push({ name: 'tenantOverview', params: searchObj })
      } else {
        this.$router.push({ name: 'tenantInfo', params: searchObj })
      }
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
        for (var i = 0; i < this.roomList.length; i++) {
          if (self.id === this.roomList[i].svgId) {
            this.showBox = true
            $('#showBox').css({ top: event.offsetY * this.zoom + 80 - $('#svgDiv').scrollTop(), left: event.offsetX * this.zoom - $('#svgDiv').scrollLeft() })
            this.roomInfo = this.roomList[i]
            console.log(this.roomInfo)
          }
        }
      }
    },
    editFn (event) { // 右键查看详情
      this.showBox = false
      let self = event.target
      if (self.tagName === 'path' || self.tagName === 'polygon' || self.tagName === 'rect') {
        if (this.lastTag) {
          $(this.lastTag).attr({ 'stroke-width': $(self).attr('stroke-width'), 'stroke': '#000000' })
        }
        $(self).attr({ 'stroke': '#00ff00' })
        this.lastTag = self
        for (var i = 0; i < this.roomList.length; i++) {
          if (self.id === this.roomList[i].svgId) {
            this.roomInfo = this.roomList[i]
            this.tenantList = this.roomList[i].tenants
            let id = this.roomList[i].tenants[0].id
            context.http.get('/cms/api/tenant/' + id).then(res => {
              this.getCheckData(id)
              this.detailData = res.data
              this.detailsShow = true
            })
          }
        }
      }
    },
    updateTenant (tenantid) { // 切换客户 更新详情页面客户信息
      context.http.get('/cms/api/tenant/' + tenantid).then(res => {
        this.detailData = res.data
        this.getCheckData(tenantid)
      })
    },
    getCheckData (id) {
      context.http.get('/cms/api/enterpriseRooms/tenantId/' + id).then(result => {
        this.checkData = result.data
      })
    },
    handleEdit (index, row) {
      context.http.get('/cms/api/tenant/' + row.id).then(res => {
        this.detailData = res.data
        this.detailsShow = true
      })
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
      if (this.floorSortNumber === '' || this.projectManagementId === '') {
        this.$message({
          type: 'error',
          message: '请选择项目和楼层'
        })
        return
      }
      let _this = this
      if (this.buildingId) {
        this.planeType = 'BUILDING'
      } else {
        this.planeType = 'FLOOR'
      }
      let result = await context.http.get('cms/api/plan', {
        floorName: this.floorName,
        planeType: this.planeType,
        projectManagementId: this.projectManagementId,
        planeStyle: this.berthPlan,
        buildingName: this.buildingId
      })
      this.svgHtml = result.data.svg
      this.useDTOS = result.data.useDTOS
      this.svgId = result.data.id
      result.data.svgList ? this.roomList = result.data.svgList : this.roomList = []
      this.svgHtmlShow = false
      // setTimeout(function () {
      // _this.SVGAutoscale()
      // }, 300)
      this.$nextTick(function () {
        $('#svgDiv svg  title').remove()
        _this.renderSVG()
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
      // $('#svgHtml svg').css({
      //   'transform': `scale(${this.defaultScale})`,
      //   'transform-origin': '0 0 0'
      // })
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
      let eleId, shopTextId, x, y, textArr, texts, shopTextDom
      arr.forEach(item => {
        eleId = item.svgId
        shopTextId = eleId.replace('svg', 'shopTextId')
        x = !item.svgx || item.svgx === 'null' ? $('#' + eleId).attr('data-x') : item.svgx
        y = !item.svgy || item.svgy === 'null' ? $('#' + eleId).attr('data-y') : item.svgy
        textArr = []// 房源名拼接
        texts = ''
        item.tenants.forEach(list => {
          textArr.push(list.referred)
        })
        texts = textArr.join('、')
        texts = texts.length > 5 ? texts.substring(0, 5) + '...' : texts
        shopTextDom = $('<text id="' + shopTextId + '"  x="' + x + '"  y="' + y + '" font-size="13px"  font-family="MicrosoftYaHei, Microsoft YaHei">' + texts + '</text>')
        let color = '#eeeeee'
        if (item.tenants.length) {
          color = item.tenants[0].industryDescription
        }
        $('#' + eleId).attr('fill', color)
        if ($('#' + shopTextId).length === 0) {
          $('#svgHtml svg').find($('#' + eleId)).parent().append(shopTextDom)
          // this.svgHtml = $('#svgHtml').html()
        }
      })
      this.svgHtml = $('#svgHtml').html()
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
    async getBuliding () {
      let result = await context.http.get('cms/api/buildings/newList', { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING', projectId: this.projectManagementId })
      if (result.data.length === 0) {
        this.options1 = []
        this.buildingName = null
        // this.projectChanged()
        return
      }
      this.options1 = result.data
      this.options1.unshift({ id: null, buildingName: '层平面图' })
      this.buildingName = null
      // this.projectChanged()
    },
    async getBuliding2 () {
      let result = await context.http.get('cms/api/buildings/newList', { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING', projectId: this.projectManagementId })
      if (result.data.length === 0) {
        this.options1 = []
        this.buildingName = this.$route.params.buildingName
        // this.projectChanged()
        return
      }
      this.options1 = result.data
      this.options1.unshift({ id: null, buildingName: '层平面图' })
      this.buildingName = this.$route.params.buildingName
      // this.projectChanged()
    },
    // async projectChanged () { // 选定商圈请求楼层
    //   let result = await context.http.get('cms/api/floors/svg', { projectManagementId: this.projectManagementId, buildingId: this.buildingName })
    //   this.options3 = result.data
    //   this.floorName = null
    //   if (this.options3.length > 0) {
    //     let defultFloorName = ''
    //     this.options3.forEach((item, index) => {
    //       if (item.name === '1' || item.name === '一层' || item.name === '一' || item.name === '1层') {
    //         defultFloorName = item.name
    //       }
    //     })
    //     defultFloorName = defultFloorName === '' ? this.options3[0].name : defultFloorName
    //     this.floorName = this.$route.params.floorName ? this.$route.params.floorName : defultFloorName
    //     this.checkFun()
    //     this.$route.params.floorName = null
    //   } else {
    //     this.floorName = null
    //     this.checkFun()
    //   }
    // },
    async industry () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=行业')
      this.industryOptions = result.data
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
  .tips {
    display: block;
    color: #666666;
    align-items: center;
    padding-left: 15px;
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
</style>
<style lang="scss" scoped>
.saclBtn {
  display: flex;
  padding: 10px 20px 10px 0;
  justify-content: space-between;
}
.typeTab {
  height: 50px;
  line-height: 50px;
  background-color: #ffffff;
  margin-top: 15px;
  margin-bottom: 20px;
  box-shadow: 4px 4px 4px 1px #eee;
  display: flex;
  > span {
    display: block;
    width: 120px;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
    &.active {
      color: #3175d2;
      border-bottom: 2px solid #3175d2;
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
    margin-right: 20px;
  }
}
.content {
  min-height: 750px;
  background-color: #ffffff;
  margin-top: 10px;
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
  width: 145px;
  height: 80px;
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
  padding-left: 10px;
}
</style>
