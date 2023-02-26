<template>
  <div class="rentControl-char">
    <span class="page_head_title">房源招租</span>
    <ul class="default_tab_block">
      <!-- <li v-if="hasAuthority('02020204')"
          @click="switchover('industryCAD')">
        <span>房源平面图</span>
      </li> -->
      <li v-if="hasAuthority('02020205')"
          class="active">
        <span>租控图</span>
      </li>
      <li v-if="hasAuthority('02020201') || hasAuthority('02020202') || hasAuthority('02020203')"
          @click="switchover('housingList')">
        <span>房源列表</span>
      </li>
    </ul>
    <div class="rechar-content">
      <div class="search-bar">
        <div>
          <el-select v-model="seachParams.organizeId"
                     @change="organizesChange"
                     placeholder="管理企业">
            <el-option v-for="item in organizesOptions"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="seachParams.projectManagementId"
                     placeholder="项目"
                     @change='getBuliding'>
            <el-option v-for="item in projectOptions"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>

          <el-select v-model="seachParams.buildingId"
                     @change='queryChart'
                     placeholder="楼宇">
            <el-option v-for="item in options2"
                       :key="item.id"
                       :label="item.buildingName"
                       :value="item.id">
            </el-option>
          </el-select>
          <span class="upload">
            <span @click="queryChart"
                  class="query-btn">查询</span>
          </span>
        </div>
      </div>
      <div class="rc-head">
        <!-- <div class="head-nav">
          <span @click="selectProject(item, index)" :class="{'navActive': activeClass === index}" v-for="(item, index) in projectList" :key="index">
            {{item.projectName}}
          </span>
          <div class="hn-content">
            <el-radio-group v-model="radioId">
              <el-radio :label="item.id" @change="queryChart(item.id)" v-for="(item, index) in buildingList" :key="index">{{item.buildingName}}</el-radio>
            </el-radio-group>
          </div>
        </div> -->
        <div class="head-statistics">
          <div class="project-img">
            <div class="project-name-bg"
                 v-if="buildingPreviewImage"></div>
            <div class="project-name"
                 v-if="projectManagement">{{projectName}}</div>
            <img :src="buildingPreviewImage"
                 v-if="buildingPreviewImage">
            <img src="../../../assets/default-project.png"
                 v-else>
          </div>
          <div class="statistics-content"
               style="width:1000px">
            <div class="sc-item"
                 style="margin-top: 0;">
              <div class="item-name">楼宇数量</div>
              <div class="item-val">
                {{floorData.statisics.buildingAmount}}
              </div>
            </div>
            <div class="sc-item">
              <div class="item-name">总可租面积（m²）</div>
              <div class="item-val">
                {{floorData.statisics.rentFm | toLocaleFixed}}
              </div>
            </div>
            <div class="sc-item">
              <div class="item-name">已租面积（m²）</div>
              <div class="item-val">
                {{floorData.statisics.rentFz | toLocaleFixed}}
              </div>
            </div>
            <div class="sc-item">
              <div class="item-name">剩余可租面积（m²）</div>
              <div class="item-val">
                {{(floorData.statisics.rentFm-floorData.statisics.rentFz) | toLocaleFixed}}
              </div>
            </div>
            <div class="sc-item">
              <div class="item-name">出租率</div>
              <div class="item-val">
                {{floorData.statisics.rentRate | toLocaleFixed}}
                <span v-if="floorData.statisics.rentRate">%</span>
              </div>
            </div>
            <div class="sc-item">
              <div class="item-name">总可售面积（m²）</div>
              <div class="item-val">
                {{floorData.statisics.sellFm | toLocaleFixed}}
              </div>
            </div>
            <div class="sc-item">
              <div class="item-name">已售面积（m²）</div>
              <div class="item-val">
                {{floorData.statisics.sellFz | toLocaleFixed}}
              </div>
            </div>
            <div class="sc-item">
              <div class="item-name">剩余可售面积（m²）</div>
              <div class="item-val">
                {{(floorData.statisics.sellFm-floorData.statisics.sellFz) | toLocaleFixed}}
              </div>
            </div>
            <div class="sc-item">
              <div class="item-name">出售率</div>
              <div class="item-val">
                {{floorData.statisics.sellRate | toLocaleFixed}}
                <span v-if="floorData.statisics.sellRate">%</span>
              </div>
            </div>
            <div class="sc-item">
              <div class="item-name">总自用面积（m²）</div>
              <div class="item-val">
                {{floorData.statisics.selfUseArea | toLocaleFixed}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="char-content">
        <div class="cont-head">
          <div>
            <div>
              <div v-if="(buildingBusiness!=='SELF_USE' ) || (buildingBusiness==='SELF_USE' && floorData.statisics.bulidingRoomsCount > 0)">
                <i class="sign gray"></i>
                <div>
                  <span>{{buildingBusiness==='SELL'?'可售':'空置'}}房源</span><span>{{floorData.statisics.buildingVacantArea }}m²</span>
                </div>
              </div>
              <div v-if="(buildingBusiness!=='SELF_USE' ) || (buildingBusiness==='SELF_USE' && floorData.statisics.bulidingRoomsCount > 0)">
                <i class="sign green"></i>
                <div>
                  <span>{{buildingBusiness==='SELL'?'已售':'已租'}}房源</span><span>{{floorData.statisics.bulidingRoomsCount}}/{{floorData.statisics.buildingUseArea}}m²</span>
                </div>
              </div>
            </div>
            <div>
              <div>
                <i class="sign "></i>
                <div>
                  <span>全部房源</span><span>{{floorData.statisics.buildingArea}}m²</span>
                </div>
              </div>
              <div v-if="(buildingBusiness!=='SELF_USE' ) || (buildingBusiness==='SELF_USE' && floorData.statisics.bulidingRoomsCount > 0)">
                <i class="sign "></i>
                <div>
                  <span v-if="buildingBusiness!=='SELL'">出租率</span><span v-if="buildingBusiness!=='SELL'">{{floorData.statisics.buildingRentRate}}%</span>
                  <span v-if="buildingBusiness==='SELL'">出售率</span><span v-if="buildingBusiness==='SELL'">{{floorData.statisics.buildingRentRate}}%</span>
                </div>
              </div>
            </div>
          </div>
          <i class="iconfont icon-fangda2"
             style="float: right;cursor: pointer;"
             @click="openChar = !openChar"></i>
        </div>
        <div class="cont-sub"
             v-if="floorData.list">
          <div class="floorlist"
               v-for="(item, index) in floorData.list"
               v-if="item.roomsDTOS.length || item.useArea"
               :key="index">
            <div class="floor-num">
              <p>{{item.name}}</p>
              <!-- buildingArea是否显示楼层总面积 -->
              <p v-if="item.buildingArea">{{item.buildingArea}}㎡</p>
            </div>
            <div class="floor-wrap"
                 :class="{'flex-wrap': openChar}">
              <!-- :style="{width: + (item2.buildingArea/item.area) * 100 +'%'}" -->
              <div class="floor-item"
                   @click="storeDetails(item2.id)"
                   :class="{'rent-zy': item2.investmentStatus === 'NO', 'rent-already': item2.onRent, 'expire': item2.expire, 'open-char': openChar && item.roomsDTOS.length < 5, 'open-char2': openChar && item.roomsDTOS.length >= 5}"
                   v-for="(item2, index2) in item.roomsDTOS"
                   :key="index2"
                   v-show="item2.buildingArea"
                   :style="{width: + (item2.buildingArea/item.area) * 100 +'%'}">
                <el-popover placement="top-start"
                            :title="item2.shopNumber + formatNull(item2.tenantName)"
                            width="200"
                            trigger="hover">
                  <div class="tooltip">
                    <div id="triangle-up"></div>
                    <p>{{item2.buildingArea | toLocaleFixed}}㎡</p>
                    <!-- <p v-if="item2.onRent">{{item2.contractEndDate}}到期</p>
                    <p v-else>招商指导价：{{item2.expectedUnitPrice}}{{priceUnit(item2.priceUnit)}}</p> -->
                  </div>
                  <div class=""
                       slot="reference">
                    <div class="fi-content">
                      <p>{{item2.shopNumber}} {{item2.tenantName}}</p>
                      <p v-if="item.buildingArea">{{item2.buildingArea | toLocaleFixed}}㎡</p>
                      <!-- <p v-if="item2.onRent">{{item2.contractEndDate}}到期</p>
                      <p v-else>招商指导价：{{item2.expectedUnitPrice}}{{priceUnit(item2.priceUnit)}}</p> -->
                    </div>
                  </div>
                </el-popover>
              </div>
              <!-- useArea是够显示楼层空置面积 -->
              <div class="floor-item open-char"
                   v-show="item.useArea"
                   :style="{width: + (item.useArea/item.area) * 100 +'%'}">
                <el-popover placement="top-start"
                            width="200"
                            trigger="hover">
                  <div class="tooltip">
                    <div id="triangle-up"></div>
                    <p>{{item.useArea | toLocaleFixed}}㎡</p>
                  </div>
                  <div class=""
                       slot="reference">
                    <div class="fi-content">
                      <p></p>
                      <p>{{item.useArea | toLocaleFixed}}㎡</p>
                    </div>
                  </div>
                </el-popover>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!floorData.list"
           style="text-align: center;margin-top: 50px">
        暂无房源
      </div>
    </div>

    <storeDetailis :detailsdrawershow="storeDetailisShow"
                   :detailData="storeDetailisData"
                   :options2="projectOptions"
                   :defaultAuthority="true"
                   ref="storeDetailis"
                   @tenantHandleEdit='tenantHandleEdit'
                   @shopDetails="shopDetails"
                   @showStoreDetails="showStoreDetails"
                   @drawerClose="storeDetailisHide"
                   @queryList="search" />

    <!-- 客户详情 -->
    <tenantDetails :detailsdrawershow="tenantDetailsShow"
                   :tenantDetail="tenantDetailData"
                   ref="tenantDetails"
                   @affirmDialog="affirmDialog"
                   @drawerClose="tenantDetailsClose"
                   @query="tenantQuery"
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
import storeDetailis from '../housingList/components/storeDetailis'
import tenantDetails from '@/views/operationManagement/tenantInfo/components/tenantDetails.vue'
import contractsDetails from '@/views/contractManagement/contractsList/components/contractsDetails.vue'
import riskDetails from '@/views/operationManagement/tenantInfo/components/riskDetails'
export default {
  components: {
    storeDetailis,
    tenantDetails,
    contractsDetails,
    riskDetails
  },
  data () {
    return {
      buildingBusiness: null, // 当前楼宇类型 buildingBusiness;    RENT("出租"), SELL("出售"), SELF_USE("自用")
      seachParams: {
        organizeId: '',
        projectManagementId: '',
        buildingId: ''
      },
      organizesOptions: [],
      projectOptions: [],
      options2: [],
      riskDetailsShow: false,
      riskTab: 0,
      openChar: false,
      storeDetailisShow: false,
      storeDetailisData: {
        imgUrls: [],
        projectManagement: {
          projectName: ''
        },
        building: {},
        floor: {}
      },
      radioId: '',
      bgColor: '#ee7873',
      isRentAlready: false,
      expire: false,
      activeLeft: '20',
      activeClass: 0,
      buildingPreviewImage: '',
      floorData: {
        list: [],
        statisics: {
          buildingAmount: 0,
          buildingArea: 0,
          buildingRentRate: 0,
          buildingUseArea: 0,
          buildingVacantArea: 0,
          bulidingRoomsCount: 0,
          rentFm: 0,
          rentFz: 0,
          rentRate: 0,
          selfUseArea: 0,
          sellFm: 0,
          sellFz: 0,
          sellRate: 0
        }
      },
      projectManagement: {},
      projectName: '',
      tenantDetailsShow: false,
      centerDialogVisible: false,
      contractsDetailsShow: false,
      tenantDetailData: {},
      contractsDetailData: {},
      withdrawalData: {}
    }
  },
  watch: {
    'seachParams.buildingId' (newValue, oldValue) { // RENT("出租"), SELL("出售"), SELF_USE("自用") 监听当前楼宇类型
      this.buildingBusiness = this.options2.filter(item => item.id === newValue)[0].buildingBusiness
      // console.log(newValue, this.buildingBusiness)
    }
  },
  created () {
    this.getOrganizes()
  },
  computed: {
    computedStyle: function (buildingArea, area) {
      return { width: +(buildingArea / area) * 100 + '%' }
    }
  },
  methods: {
    filterImg (id) {
      this.buildingPreviewImage = this.projectOptions.filter((item, index) => {
        return id === item.id
      })[0].previewImage
    },
    async getProjectZc (id) {
      let res = await context.http.get('/cms/api/stat/thisProjectZc', { id: id, UseStatus: 'USING' })
      this.projectZcObj = res.data
    },
    async organizesChange (id) { // 管理企业查名下项目
      this.seachParams.projectManagementId = ''
      this.seachParams.buildingId = ''
      this.projectOptions = []
      this.options2 = []
      let res = await context.http.get('/cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: id })
      this.projectOptions = res.data
      if (!this.projectOptions.length) {
        this.floorData = {
          list: [],
          statisics: {
            buildingAmount: 0,
            buildingArea: 0,
            buildingRentRate: 0,
            buildingUseArea: 0,
            buildingVacantArea: 0,
            bulidingRoomsCount: 0,
            rentFm: 0,
            rentFz: 0,
            rentRate: 0,
            selfUseArea: 0,
            sellFm: 0,
            sellFz: 0,
            sellRate: 0
          }
        }
      } else {
        this.seachParams.projectManagementId = this.projectOptions[0].id
        this.filterImg(this.seachParams.projectManagementId)
        // this.getProjectZc(this.seachParams.projectManagementId)
        this.getBuliding()
      }
    },
    async getBuliding () { // 是否首次进入页面
      let result = await context.http.get(`cms/api/project/${this.seachParams.projectManagementId}/buildings`, { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING' })
      this.options2 = result.data.filter((item, index) => {
        return item.assetsType === 'BUILDING'
      })
      if (this.options2.length) {
        this.seachParams.buildingId = this.options2[0].id
      } else {
        this.seachParams.buildingId = null
      }
      // this.getProjectZc(this.seachParams.projectManagementId)
      this.queryChart()
    },
    async getOrganizes () { // 管理企业获取接口
      // 管理企业
      let res = await context.http.get('/uaa/api/organizes/enterprise/user', { useStatus: 'USING', organizeType: 'ENTERPRISE' })
      this.organizesOptions = res.data
      this.seachParams.organizeId = this.$route.params.organizeId ? this.$route.params.organizeId : this.organizesOptions[0].id
      // 项目
      let res1 = await context.http.get('/cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: this.seachParams.organizeId })
      this.projectOptions = res1.data
      if (!this.projectOptions.length) return
      this.seachParams.projectManagementId = this.$route.params.projectManagementId ? this.$route.params.projectManagementId : this.projectOptions[0].id
      this.filterImg(this.seachParams.projectManagementId)
      // this.getProjectZc(this.seachParams.projectManagementId)
      // 楼宇
      let res2 = await context.http.get(`cms/api/project/${this.seachParams.projectManagementId}/buildings`, { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING' })
      this.options2 = res2.data.filter((item, index) => {
        return item.assetsType === 'BUILDING'
      })
      if (!this.options2.length) return
      this.seachParams.buildingId = this.$route.params.buildingId ? this.$route.params.buildingId : this.options2[0].id
      this.queryChart()
    },
    async queryChart () {
      this.filterImg(this.seachParams.projectManagementId)
      let result = await context.http.get('cms/api/rooms/chart?useStatus=USING', {
        organizeId: this.seachParams.organizeId,
        buildingIds: this.seachParams.buildingId,
        projectManagemantId: this.seachParams.projectManagementId
      })
      this.floorData = result.data
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
    shopDetails (roomId) {
      context.http.get('/cms/api/rooms/' + roomId).then(res => {
        if (res.status === 200) {
          this.storeDetailisData = res.data
          this.storeDetailisShow = true
        }
      })
    },
    storeDetails (storeId) {
      this.roomsRowId = storeId
      context.http.get('/cms/api/rooms/' + storeId).then(res => {
        this.storeDetailisData = res.data
        this.storeDetailisShow = true
      })
    },
    showStoreDetails (storeId) {
      this.storeDetails(storeId)
    },
    storeDetailisHide (storeId) {
      this.storeDetailisShow = false
    },
    search () {
      this.queryChart()
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    formatNull (val) {
      let res = val
      if (!val) {
        res = ''
      }
      return res
    },
    priceUnit (val) {
      if (val === 'M2DAYS') {
        return '元/㎡天'
      } else if (val === 'M2MONTH') {
        return '元/㎡月'
      } else if (val === 'DAY') {
        return '元/天'
      } else if (val === 'MONTH') {
        return '元/月'
      }
    },
    switchover (state) { // 平面图切换
      let params = {
        organizeId: this.seachParams.organizeId,
        projectManagementId: this.seachParams.projectManagementId,
        buildingId: this.seachParams.buildingId
      }
      if (state === 'industryCAD') {
        this.$router.push({ name: 'industryCAD', params: params })
      } else {
        this.$router.push({ name: 'housingList', params: params })
      }
    },
    affirmDialog (contractId, tenantId) {
      this.centerDialogVisible = true
      this.contractId = contractId
      this.tenantId = tenantId
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
.rentControl-char {
  font-size: 14px;
  background-color: #f9f9f9;
  .seachDiv {
    height: 80px;
    background-color: #ffffff;
    border-radius: 5px;
    box-shadow: 4px 4px 4px 1px #eee;
    display: flex;
    align-items: center;
    padding-left: 20px;
    margin-bottom: 20px;
    > span {
      margin-right: 40px;
    }
  }
  .menu {
    margin-bottom: 20px;
    height: 62px;
    line-height: 62px;
    border-bottom: 1px solid #eeeeee;
    margin-top: 15px;
    background-color: #ffffff;
    // padding-left: 20px;
    span {
      display: inline-block;
      width: 200px;
      height: 62px;
      text-align: center;
      cursor: pointer;
      font-size: 14px;
      &.active {
        border-bottom: 3px solid #3577f6;
        color: #3577f6;
      }
    }
  }
  .rc-head {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 10px;
    background-color: #fff;
    box-shadow: 0px 2px 3px 0px rgba(190, 199, 208, 0.2);
    .head-nav {
      margin-right: 80px;
      margin-bottom: 10px;
      > span {
        display: inline-block;
        width: auto;
        padding: 6px;
        text-align: center;
        font-size: 14px;
        cursor: pointer;
        margin-right: 10px;
      }
      .hn-content {
        margin-top: 20px;
        width: 580px;
        .el-radio {
          margin: 16px 25px 10px 0;
        }
      }
    }
    .head-statistics {
      display: flex;
      justify-content: flex-start;
      width: 100%;
      .project-img {
        position: relative;
        width: 140px;
        height: 180px;
        margin-right: 30px;
        .project-name-bg {
          width: 100%;
          height: 24px;
          position: absolute;
          background: -webkit-linear-gradient(
            rgba(51, 51, 51, 0.8),
            rgba(255, 255, 255, 0)
          ); /* Safari 5.1 - 6.0 */
          background: -o-linear-gradient(
            rgba(51, 51, 51, 0.8),
            rgba(255, 255, 255, 0)
          ); /* Opera 11.1 - 12.0 */
          background: -moz-linear-gradient(
            rgba(51, 51, 51, 0.8),
            rgba(255, 255, 255, 0)
          ); /* Firefox 3.6 - 15 */
          background: linear-gradient(
            rgba(51, 51, 51, 0.8),
            rgba(255, 255, 255, 0)
          ); /* 标准的语法（必须放在最后） */
        }
        .project-name {
          position: absolute;
          width: 100%;
          height: 24px;
          color: #fff;
          padding: 6px;
          font-size: 12px;
          overflow: hidden;
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
    @media (max-width: 1490px) {
      .head-statistics {
        margin-top: 30px;
      }
    }
    .statistics-content {
      // width: 608px;
      .sc-item {
        display: inline-block;
        width: 19%;
        &:nth-of-type(6n + 1) {
          margin-top: 50px;
        }
      }
      .item-name {
        height: 25px;
        line-height: 25px;
        color: #828692;
        font-size: 12px;
      }
      .item-val {
        display: inline-block;
        font-size: 20px;
        margin-top: 10px;
      }
    }
  }
  .navActive {
    background-color: #5b9af8;
    color: #fff;
    border-radius: 4px;
  }
  .char-content {
    background-color: #fff;
    font-size: 14px;
    flex: auto;
    .cont-head {
      margin: 0 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #e8e8e8;
      display: -ms-flexbox;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 20px;
      margin-top: 15px;
      > div {
        display: flex;
        align-items: center;
        > div {
          display: flex;
          flex-wrap: nowrap;
          > div {
            display: flex;
            align-items: center;
            cursor: pointer;
            > div {
              display: flex;
              flex-direction: column;
              color: #666666;
              > span {
                &:last-child {
                  color: #333;
                  margin-top: 5px;
                }
              }
            }
          }
          &:nth-child(1) {
            border-right: 1px solid #ecedef;
            margin-right: 15px;
          }
        }
      }
      span {
        display: inline-block;
        margin-right: 20px;
      }
      i {
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 4px;
        vertical-align: sub;
        margin-right: 10px;
      }
      .gray {
        background-color: #f3f5f6;
      }
      .green {
        background-color: #96d050;
      }
      .red {
        background-color: #ec6964;
      }
      .blue {
        background-color: #87b0f1;
      }
      .icon-fangda2 {
        width: 20px !important;
        height: 20px !important;
        background: url(../../../assets/icon-fangda.png) no-repeat;
        background-size: contain;
        border-radius: 0 !important;
        margin: 10px 20px;
      }
    }
    .cont-sub {
      .floorlist {
        display: flex;
        justify-content: flex-start;
        border-bottom: 1px solid #e3e3e3;
        position: relative;
        .floor-num {
          width: 100px;
          height: 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          > i {
            transform: rotate(90deg);
            display: inline-block;
            margin-top: 15px;
            color: #858585;
          }
          p:nth-child(1) {
            font-size: 16px;
            font-weight: bold;
            margin: 10px 0 5px;
          }
          p:last-child {
            font-size: 12px;
            color: #858585;
          }
        }
      }
      .floor-wrap {
        width: calc(100% - 100px);
        display: flex;
        justify-content: flex-start;
        position: relative;
        .floor-item {
          position: relative;
          background-color: #f3f5f6;
          margin: 4px 4px 0 0;
          height: 100px;
          z-index: 1;
          cursor: pointer;
          // border-right: 1px solid #c6c6c6;
          &:last-child {
            margin-right: 0;
            // border-right: none;
          }
          &:hover .tooltip {
            display: block;
          }
          .fi-content {
            overflow: hidden;
            height: 78px;
          }
          p {
            color: #000;
            padding-left: 10px;
            &:first-child {
              margin-top: 20px;
            }
          }
          transition: width 0.5s;
          -moz-transition: width 0.5s; /* Firefox 4 */
          -webkit-transition: width 0.5s; /* Safari 和 Chrome */
          -o-transition: width 0.5s; /* Opera */
        }
        .tooltip {
          display: none;
          position: absolute;
          z-index: 2;
          width: 160px;
          height: 110px;
          background-color: #fff;
          top: 113px;
          left: 10px;
          border-radius: 4px;
          p {
            color: #666 !important;
            &:nth-of-type(1) {
              color: #000 !important;
              padding-top: 10px;
              padding-bottom: 15px;
            }
          }
          #triangle-up {
            width: 0;
            height: 0;
            top: -6px;
            left: 10px;
            border-width: 0 6px 6px;
            border-style: solid;
            border-color: transparent transparent #fff; /*透明 透明  灰*/
            position: relative;
          }
        }
        .rent-already {
          background-color: #96d050;
          p {
            color: #fff;
          }
        }
        .rent-zy {
          background-color: #87b0f1;
          p {
            color: #fff;
          }
        }
        .expire {
          background-color: #ee7873 !important;
          p {
            color: #fff;
          }
        }
        .open-char {
          flex: 1 !important;
        }
        .open-char2 {
          width: 18% !important;
          flex-grow: 1;
          // min-width: 240px;
        }
      }
      .flex-wrap {
        flex-wrap: wrap;
      }
    }
  }
}
</style>
