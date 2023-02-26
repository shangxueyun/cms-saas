<template>
  <div class="tenantOverview">
    <span class="page_head_title">客户管理</span>
    <ul class="default_tab_block">
      <li v-if="hasAuthority('02030101')"
          @click="switchover('CAD')">
        <span>客户平面图</span>
      </li>
      <li v-if="hasAuthority('02030106')"
          class="active">
        <span>租控图</span>
      </li>
      <li v-if="hasAuthority('02030102')"
          @click="switchover('list')">
        <span>客户列表</span>
      </li>
    </ul>
    <div class="overTop">
      <!-- <ul class="overtab">
        <li :class="tabState === 'berth' ? 'overActive' : ''" @click="switchTab('berth')">房源</li>
        <li :class="tabState === 'variety' ? 'overActive' : ''" @click="switchTab('variety')">多经</li>
      </ul> -->
      <div style="box-shadow:none;height: 60px;"
           class="search-bar">
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
                     placeholder="选择项目"
                     style="width:200px;"
                     @change="projectChange">
            <el-option v-for="item in projectManagementsList"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="buildingId"
                     placeholder=""
                     style="width:200px"
                     @change="getContractItemList">
            <el-option v-for="item in buildingOptions"
                       :key="item.id"
                       :label="item.buildingName"
                       :value="item.id">
            </el-option>
          </el-select>
          <div class="query-btn"
               @click="getContractItemList"
               style="margin-top:0">查询</div>
        </div>
      </div>
    </div>
    <!-- <div v-if="useDTOS.length" class="format-list">
      <span v-for="(item,index) in industryOptions" :key="index"><i :style="`backgroundColor:${item.description}`"></i>{{item.value}}</span>
      <div v-for="(item, index) in useDTOS" :key="index" class="colorBox">
        <span>{{item.tenantUseDescription}}</span>
        <span>行业</span>
        <span v-for="(items, index) in item.value"
              :key="index"><i :style="`backgroundColor:${items.description}`"></i>{{items.value}}</span>
      </div>
    </div> -->
    <div v-show="tabState === 'berth'"
         class="floorChart">
      <div class="topInfor">
        <p v-if="floorChartArr.length>0">楼层</p>
        <div v-if="useDTOS.length"
             class="format-list">
          <div v-for="(item, index) in useDTOS"
               :key="index"
               class="colorBox">
            <!-- <span>{{item.tenantUseDescription}}</span> -->
            <span>行业</span>
            <span v-for="(items, index) in item.value"
                  :key="index"><i :style="`backgroundColor:${items.description}`"></i>{{items.value}}</span>
          </div>
        </div>
      </div>
      <div class="chartContent"
           v-if="floorChartArr.length>0">
        <div class="floorList"
             v-for="(item,index) in floorChartArr"
             :key="index">
          <div class="floorName">
            <div><span>{{item.name}}</span></div>
          </div>
          <div class="tenInfoItems">
            <!-- style="border: #0f75fe 2px solid" -->
            <!-- <div class="tenInfo" v-for="(item1,index1) in item.graphDTOS" style="backgroundColor: rgba(98,133,245,0.1)" :key="index1" @click="handleEdit(index1, item1)"> -->
            <div class="tenInfo"
                 v-for="(item1,index1) in item.graphDTOS"
                 :style="{borderColor: item1.industryColor, backgroundColor: colorRgba(item1.industryColor) }"
                 :key="index1"
                 @click="handleEdit(index1, item1)">
              <!-- <svg fill="#333E5F" class="svg-1" version="1.1"  id="图层_1" x="0px" y="0px"
                viewBox="0 0 200 200" style="enable-background:new 0 0 200 200;" xml:space="preserve">
              <path class="st0" d="M185.9,68.8c-0.1-0.4-0.2-0.9-0.4-1.3l-14.7-36.7c-2.6-7.7-10-12.6-19-12.6H48.6c-8.8,0-15.8,4.7-18.4,12.3
                L14.4,67.8v0c-0.1,0.3-0.2,0.6-0.2,0.9c-2.6,7.8-2.3,16.3,0.8,24c3.1,7.7,8.8,14,16.1,17.9c4.7,2.5,10.3,3.8,16.5,3.8
                c10.1,0,19.7-4.4,26.3-12c6.6,7.6,16.1,11.9,26.2,11.9c10-0.1,19.5-4.4,26.1-12c6.6,7.6,16.2,11.9,26.3,11.9h0.1
                c6.4,0,12-1.4,16.8-4C184.1,102.3,191,84.8,185.9,68.8L185.9,68.8z M133.6,89.1c-1.2-1.3-3.2-2.8-6.7-2.8c-2.7,0-5.2,1.1-6.7,2.9
                c-0.7,0.8-1.3,1.8-1.8,2.8c-4,6.5-10.9,10.4-18.5,10.5c-7.6,0-14.7-4.1-18.7-10.5c-0.3-0.6-0.8-1.7-1.6-2.5
                c-1.5-1.8-4.1-2.9-6.9-2.9c-2.7,0-5.1,1-6.5,2.6c-1.1,1.2-1.6,2.4-1.9,3c-4,6.5-11.1,10.4-18.7,10.4c-4.1,0-7.6-0.8-10.4-2.3
                c-9.7-5.1-14.1-16.4-10.5-26.7c0.1-0.2,0.1-0.4,0.2-0.6L41,35v0c0.3-1,1.2-3.5,5.8-3.5h106.7c2.5,0.2,5.3,0.7,6.3,3.8v0l15.1,37.5
                c0.1,0.3,0.1,0.5,0.2,0.7v0c3.5,10.2-0.8,21.4-10.3,26.6c-2.8,1.6-6.4,2.4-10.6,2.4h-0.1c-7.6,0-14.7-4-18.7-10.5
                C134.9,90.9,134.3,90,133.6,89.1L133.6,89.1z M168,122.6c-3.6,0-6.4,2.9-6.4,6.9l0,36.3c0,1.6-1.3,2.9-2.9,2.9l-119.5,0.1
                c-1.6,0-2.9-1.3-2.9-2.9l0-36.5c0-3.9-2.8-6.9-6.4-6.9c-1.6,0-3.1,0.6-4.2,1.7c-1.3,1.2-2,3.1-1.9,5.2l0,35.7
                c0,4.5,1.6,8.6,4.6,11.7c3,3.1,7.1,4.9,11.5,4.9l118-0.1c9.1,0,16.2-7.3,16.2-16.7l0-35.6C174.1,125.4,171.6,122.6,168,122.6
                L168,122.6z"/>
              <path class="st0" d="M68.3,162.4c-3.4,0-6.2-2.8-6.2-6.2v-27.4c0-3.4,2.8-6.2,6.2-6.2s6.2,2.8,6.2,6.2v27.4
                C74.5,159.6,71.7,162.4,68.3,162.4z"/>
              </svg> -->
              <!-- <div class="format-type" :style="{backgroundColor: item1.industryColor}"></div> -->
              <div class="roomNb"
                   :title="item1.shopNums">{{item1.shopNums}}</div>
              <div class="tenname">{{item1.reffered}}</div>
              <!-- <div class="status">
                <span v-if="item1.delayDay>=7 && item1.delayDay<15"
                      style="backgroundColor: rgba(44,167,44,0.1); color:#2ca72c">
                  <i style="background:#2ca72c"></i>超过7天未跟进</span>
                <span v-if="item1.delayDay>=15 && item1.delayDay<30"
                      style="backgroundColor: rgba(249,154,18,0.1); color:#f99a12">
                  <i style="background:#f99a12"></i>超过15天未跟进</span>
                <span v-if="item1.delayDay>=30"
                      style="backgroundColor: rgba(237,55,83,0.1); color:#ED3753">
                  <i style="background:#ED3753"></i>超过30天未跟进</span>
                <span v-if="item1.delayDay==-1"
                      style="backgroundColor: rgba(119,119,119,0.1); color:#777777">
                  <i style="background:#777777"></i>暂无跟进记录</span>
              </div> -->
            </div>
          </div>
        </div>
      </div>
      <div class="nodata"
           v-else>暂无数据</div>
    </div>
    <div v-show="tabState === 'variety'"
         class="floorChart">
      <p v-if="floorChartArr.length>0">点位类型</p>
      <div class="chartContent"
           v-if="floorChartArr.length>0">
        <div class="floorList"
             v-for="(item,index) in floorChartArr"
             :key="index">
          <div class="floorName">
            <div><span>{{item.name}}</span></div>
          </div>
          <div class="tenInfoItems">
            <div class="tenInfo"
                 v-for="(item1,index1) in item.tenantGraphDTOS"
                 :key="index1"
                 @click="handleEdit(index1, item1)">
              <!-- <img src="../../../assets/svgShop.svg" alt=""> -->
              <svg fill="#333E5F"
                   class="svg-1"
                   version="1.1"
                   id="图层_1"
                   x="0px"
                   y="0px"
                   viewBox="0 0 200 200"
                   style="enable-background:new 0 0 200 200;"
                   xml:space="preserve">
                <path class="st0"
                      d="M185.9,68.8c-0.1-0.4-0.2-0.9-0.4-1.3l-14.7-36.7c-2.6-7.7-10-12.6-19-12.6H48.6c-8.8,0-15.8,4.7-18.4,12.3
                L14.4,67.8v0c-0.1,0.3-0.2,0.6-0.2,0.9c-2.6,7.8-2.3,16.3,0.8,24c3.1,7.7,8.8,14,16.1,17.9c4.7,2.5,10.3,3.8,16.5,3.8
                c10.1,0,19.7-4.4,26.3-12c6.6,7.6,16.1,11.9,26.2,11.9c10-0.1,19.5-4.4,26.1-12c6.6,7.6,16.2,11.9,26.3,11.9h0.1
                c6.4,0,12-1.4,16.8-4C184.1,102.3,191,84.8,185.9,68.8L185.9,68.8z M133.6,89.1c-1.2-1.3-3.2-2.8-6.7-2.8c-2.7,0-5.2,1.1-6.7,2.9
                c-0.7,0.8-1.3,1.8-1.8,2.8c-4,6.5-10.9,10.4-18.5,10.5c-7.6,0-14.7-4.1-18.7-10.5c-0.3-0.6-0.8-1.7-1.6-2.5
                c-1.5-1.8-4.1-2.9-6.9-2.9c-2.7,0-5.1,1-6.5,2.6c-1.1,1.2-1.6,2.4-1.9,3c-4,6.5-11.1,10.4-18.7,10.4c-4.1,0-7.6-0.8-10.4-2.3
                c-9.7-5.1-14.1-16.4-10.5-26.7c0.1-0.2,0.1-0.4,0.2-0.6L41,35v0c0.3-1,1.2-3.5,5.8-3.5h106.7c2.5,0.2,5.3,0.7,6.3,3.8v0l15.1,37.5
                c0.1,0.3,0.1,0.5,0.2,0.7v0c3.5,10.2-0.8,21.4-10.3,26.6c-2.8,1.6-6.4,2.4-10.6,2.4h-0.1c-7.6,0-14.7-4-18.7-10.5
                C134.9,90.9,134.3,90,133.6,89.1L133.6,89.1z M168,122.6c-3.6,0-6.4,2.9-6.4,6.9l0,36.3c0,1.6-1.3,2.9-2.9,2.9l-119.5,0.1
                c-1.6,0-2.9-1.3-2.9-2.9l0-36.5c0-3.9-2.8-6.9-6.4-6.9c-1.6,0-3.1,0.6-4.2,1.7c-1.3,1.2-2,3.1-1.9,5.2l0,35.7
                c0,4.5,1.6,8.6,4.6,11.7c3,3.1,7.1,4.9,11.5,4.9l118-0.1c9.1,0,16.2-7.3,16.2-16.7l0-35.6C174.1,125.4,171.6,122.6,168,122.6
                L168,122.6z" />
                <path class="st0"
                      d="M68.3,162.4c-3.4,0-6.2-2.8-6.2-6.2v-27.4c0-3.4,2.8-6.2,6.2-6.2s6.2,2.8,6.2,6.2v27.4
                C74.5,159.6,71.7,162.4,68.3,162.4z" />
              </svg>
              <div class="format-type"
                   :style="{backgroundColor: item1.industryColor}"></div>
              <div class="roomNb"
                   :title="item1.shopNums">{{item1.shopNums}}</div>
              <div class="tenname">{{item1.reffered}}</div>
              <!-- <div class="status">
                <span v-if="item1.delayDay>7 && item1.delayDay<=15" style="background:#6285F5">超过7天未跟进</span>
                <span v-if="item1.delayDay>15 && item1.delayDay<=30" style="background:#69B38B">超过15天未跟进</span>
                <span v-if="item1.delayDay>=30"
                      style="color:#F3AF3D;border: 1px solid #F3AF3D">超过30天未跟进</span>
                <span v-if="item1.delayDay==-1"
                      style="color:#A065D9;border: 1px solid #A065D9">暂无跟进记录</span>
              </div> -->
            </div>
          </div>
        </div>
      </div>
      <div class="nodata"
           v-else>暂无数据</div>
    </div>
    <!-- 客户详情 -->
    <tenantDetails :detailsdrawershow="detailsShow"
                   :tenantDetail="detailData"
                   :checkData='checkData'
                   ref="tenantDetails"
                   @riskDetailsShowFn="riskDetailsShowFn"
                   @queryExportResult="queryExportResult"
                   @affirmDialog="affirmDialog"
                   @drawerClose="detailsClose"
                   @query="getContractItemList"
                   @handleEdit="handleEdit"
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
  name: 'tenantOverview',
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
      industryOptions: [],
      organizeId: '', // 管理企业
      projectManagementId: '', // 项目
      buildingId: '', // 楼宇
      projectManagementsList: [],
      buildingOptions: [],
      options1: [],
      options2: [],
      floorChartArr: [],
      tabState: 'berth',
      detailData: {},
      detailsShow: false,
      centerDialogVisible: false,
      useDTOS: [],
      organizesOptions: [],
      checkData: []
    }
  },
  created () {
    this.industry()
    this.getOrganizes()
  },
  mounted () {
  },
  methods: {
    filterColor (delayDay) {
      if (delayDay >= 7 && delayDay < 15) {
        return '#6285F5'
      } else if (delayDay >= 15 && delayDay < 30) {
        return '#69B38B'
      } else if (delayDay >= 30) {
        return '#F3AF3D'
      } else if (delayDay === -1) {
        return '#A065D9'
      }
    },
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
      if (res.data && res.data.length) {
        this.projectManagementsList = res.data
        this.projectManagementId = this.projectManagementsList[0].id
        if (this.$route.params && this.$route.params.projectManagementId) {
          let temp = this.projectManagementsList.some(item => {
            return item.id === this.$route.params.projectManagementId
          })
          if (temp) {
            this.projectManagementId = this.$route.params.projectManagementId
          }
        }
        this.projectChange(this.projectManagementId)
      } else {
        this.projectManagementsList = []
        this.projectManagementId = null
        this.buildingOptions = []
        this.seachParams.buildingId = null
        this.getContractItemList()
      }
    },
    async projectChange (id) { // 项目下资产
      this.buildingId = ''
      this.buildingOptions = []
      if (!id) {
        return
      }
      let res = await context.http.get('/cms/api/buildings/newList', { useStatus: 'USING', projectId: this.projectManagementId, page: 0, size: 9999, sort: 'id,asc' })
      if (res.data && res.data.length) {
        // this.buildingOptions = res.data
        this.buildingOptions = res.data.filter((item, index) => {
          return item.assetsType === 'BUILDING'
        })
        this.buildingId = this.buildingOptions[0].id
        if (this.$route.params && this.$route.params.buildingId) {
          let temp = this.buildingOptions.some(item => {
            return item.id === this.$route.params.buildingId
          })
          if (temp) {
            this.buildingId = this.$route.params.buildingId
          }
        }
        this.getContractItemList()
      } else {
        this.buildingOptions = []
        this.buildingId = null
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
    switchTab (state) {
      this.tabState = state
      this.getContractItemList()
    },
    querySeach () {
      if (this.showType === 1) {
        this.getBiils_history(this.contractId)
      } else {
        this.query()
      }
    },
    async industry () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=行业')
      this.industryOptions = result.data
    },
    async getBuliding () { // 楼宇
      // let result = await context.http.get('cms/api/buildings?sort=sortNumber,asc&sort=id,asc', { page: 0, size: 100, useStatus: 'USING', projectId: this.projectManagementId })
      let result = await context.http.get(`cms/api/project/${this.projectManagementId}/buildings?sort=sortNumber,asc&sort=id,asc`, { page: 0, size: 100, useStatus: 'USING' })
      if (result.data.length === 0) {
        this.options2 = []
        this.buildingId = null
        this.getContractItemList()
        return
      }
      this.options2 = result.data
      this.buildingId = result.data[0].id
      this.getContractItemList()
    },
    async getBuliding2 () { // 楼宇
      // let result = await context.http.get('cms/api/buildings?sort=sortNumber,asc&sort=id,asc', { page: 0, size: 100, useStatus: 'USING', projectId: this.projectManagementId })
      let result = await context.http.get(`cms/api/project/${this.projectManagementId}/buildings?sort=sortNumber,asc&sort=id,asc`, { page: 0, size: 100, useStatus: 'USING' })
      if (result.data.length === 0) {
        this.options2 = []
        this.buildingId = this.$route.params.buildingName
        this.getContractItemList()
        return
      }
      this.options2 = result.data
      this.buildingId = this.$route.params.buildingName
      this.getContractItemList()
    },
    async getContractItemList () { // 根据项目、楼层查询合同http://localhost:9002/api/tenant/graph/managementContract?projectId=7
      if (this.tabState === 'berth') {
        if (this.buildingId) {
          let result = await context.http.get(`cms/api/tenant/graph/businessContract?buildingId=${this.buildingId}&sort=true`)
          this.useDTOS = result.data.useDTOS
          this.floorChartArr = result.data.floorTenantDTOS
          // this.floorChartArr.forEach((item, index) => {
          //   if (index === 1) {
          //     item.graphDTOS.forEach(item => {
          //       item.delayDay = 31
          //     })
          //   }
          // })
        } else {
          this.floorChartArr = []
        }
      } else {
        let result = await context.http.get(`cms/api/tenant/graph/managementContract?projectId=` + this.projectManagementId)
        this.useDTOS = result.data.useDTOS
        this.floorChartArr = result.data.managementPointTenantDTOS
      }
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    switchover (state) {
      let searchObj = {
        organizeId: this.organizeId,
        projectManagementId: this.projectManagementId,
        buildingId: this.buildingId,
        floorName: null,
        floorList: []
      }
      if (state === 'list') {
        this.$router.push({ name: 'tenantInfo', params: searchObj })
      } else {
        this.$router.push({ name: 'tenantCAD', params: searchObj })
      }
    },
    handleEdit (index, contracts) {
      context.http.get('/cms/api/tenant/' + contracts.id).then(res => {
        context.http.get('/cms/api/enterpriseRooms/tenantId/' + contracts.id).then(result => {
          this.checkData = result.data
        })
        this.detailData = res.data
        this.detailsShow = true
      })
    },
    detailsClose (id) {
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
    affirmDialog (contractId, tenantId) {
      this.centerDialogVisible = true
      this.contractId = contractId
      this.tenantId = tenantId
      console.log(contractId, tenantId)
    },
    imageChange (state, event) {
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
          document.getElementById('imageChange').value = ''
          // this.getTurnoverList()
        }).catch(error => {
          document.getElementById('imageChange').value = ''
          console.info(error)
        })
      }
    },
    colorRgba (sHex) {
      if (!sHex) return
      // 十六进制颜色值的正则表达式
      var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{4}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/
      /* 16进制颜色转为RGB格式 */
      var sColor = sHex.toLowerCase()
      var alpha = 1
      if (sColor && reg.test(sColor)) {
        if (sColor.length === 4 || sColor.length === 5) {
          var sColorNew = '#'
          for (var i = 1; i < sColor.length; i += 1) {
            sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
          }
          sColor = sColorNew
        }
        // 如果有透明度再执行
        // if (sColor.length === 9) {
        //   alpha = (parseInt('0x' + sColor.slice(7, 9)) / 255).toFixed(2)
        // }
        //  处理六位的颜色值
        var sColorChange = []
        for (var j = 1; j < 7; j += 2) {
          sColorChange.push(parseInt('0x' + sColor.slice(j, j + 2)))
        }
        return 'rgba(' + sColorChange.join(',') + ',' + 0.06 + ')'
      } else {
        return rgba(253, 254, 255, 1)
      }
    }
  }
}
</script>
<style lang="scss">
</style>>
<style lang="scss" scoped>
.tenantOverview {
  .floorChart {
    min-height: 650px;
    background-color: #ffffff;
    // padding-right: 40px;
    margin-top: 12px;
    box-shadow: 4px 4px 4px 1px #eee;
    padding-bottom: 50px;
    position: relative;
    .nodata {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 15px 30px;
      background-color: rgba(0, 0, 0, 0.71);
      color: #fff;
      border-radius: 5px;
    }
    .floorList {
      display: flex;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
      .tenInfoItems {
        flex-wrap: wrap;
        display: flex;
        width: 93%;
      }
      .floorName {
        width: 6.5%;
        display: flex;
        align-items: center;
        justify-content: center;
        div {
          width: 100%;
          img {
            margin: 0 auto;
            margin-bottom: 12px;
            width: 14px;
            height: 16px;
            display: block;
          }
          span {
            display: block;
            text-align: center;
            font-size: 16px;
            font-weight: bold;
          }
        }
      }
      .tenInfo {
        width: 220px;
        height: 100px;
        font-size: 14px;
        // justify-content: space-between;
        // display: flex;
        // flex-direction: column;
        padding: 18px 10px 0 18px;
        background-color: #fdfeff;
        border: #0f75fe 1px solid;
        cursor: pointer;
        margin: 10px 10px 10px 0;
        // box-shadow:0px 0px 6px 0px rgba(143,143,143,0.2);
        border-radius: 4px;
        position: relative;
        // opacity: 0.08;
        z-index: 1;
        background: rgba(255, 255, 255, 0.7);
        > .tenname {
          font-size: 12px;
          color: #666666;
          margin-top: 10px;
          margin-bottom: 10px;
          line-height: 12px;
        }
        > .roomNb {
          line-height: 14px;
        }
        &:hover {
          // background-color: #0f75fe;
          // color: #ffffff;
          // >.tenname{
          //   color:#fff;
          // }
          // >.svg-1{
          //   fill:#fff;
          // }
          box-shadow: 0px 0px 12px 2px rgba(0, 61, 183, 0.15);
        }
        > .svg-1 {
          display: block;
          width: 16px;
          height: 14px;
          position: absolute;
          top: 17px;
          left: 10px;
        }
        > div {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .format-type {
          width: 100%;
          height: 6px;
          position: absolute;
          left: 0;
          bottom: 0;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
      .status {
        font-size: 12px;
        overflow: inherit !important;
        > span {
          height: 20px;
          line-height: 20px;
          padding: 4px 8px;
          // color: #ffffff;
          border-radius: 10px;
          // border: 1px solid #6285F5;
          // opacity: 0.08;
          > i {
            display: inline-block;
            width: 6px;
            height: 6px;
            background: #2ca72c;
            border-radius: 50%;
            margin-bottom: 0px;
            margin-right: 2px;
          }
          &:first-child {
            // background-color: #67ab17;
          }
          &:last-child {
            // background-color: #e70010;
          }
        }
      }
    }
    .topInfor {
      display: flex;
      justify-content: space-between;
      padding: 0 15px;
      border-bottom: 1px solid #eee;
      > p {
        height: 50px;
        // padding-left: 15px;
        line-height: 50px;
        font-size: 14px;
      }
    }
  }
  .typeTab {
    height: 50px;
    line-height: 50px;
    background-color: #ffffff;
    margin-top: 15px;
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
  .overTop {
    background-color: #ffffff;
    margin-top: 12px;
    border-radius: 5px;
    box-shadow: 4px 4px 4px 1px #eee;
    // padding-top:20px;
    .overtab {
      display: flex;
      padding-left: 20px;
      li {
        width: 90px;
        height: 36px;
        text-align: center;
        line-height: 36px;
        background: rgba(247, 248, 250, 1);
        color: rgba(15, 117, 255, 1);
        border-radius: 4px;
        font-size: 16px;
        color: #666666;
        margin-right: 10px;
        cursor: pointer;
        &.overActive {
          background: rgba(15, 117, 255, 1);
          color: #fff;
        }
      }
    }
    .seachDiv {
      height: 80px;
      display: flex;
      align-items: center;
      padding-left: 20px;
      // justify-content: space-between;
      span {
        margin-right: 40px;
      }
      .query-btn {
        display: inline-block;
        width: 110px;
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
    }
  }
  .format-list {
    background-color: #ffffff;
    margin-top: 10px;
    border-radius: 5px;
    // box-shadow: 4px 4px 4px 1px #eee;
    min-height: 40px;
    line-height: 40px;
    color: #666;
    span {
      margin-left: 20px;
      i {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 6px;
      }
      .qzjy {
        background-color: #ffc186;
      }
      .ls {
        background-color: #ff3700;
      }
      .cy {
        background-color: #589ed9;
      }
      .shpt {
        background-color: #ffeab6;
      }
      .xxyl {
        background-color: #ffbd8b;
      }
      .qt {
        background-color: #92e883;
      }
    }
  }
}
</style>

