<template>
  <div :class="[hourseList === 'on' ? 'tenant paddingLeft' : 'tenant', hourseList === 'off' ? 'tenant paddingRight' : 'tenant']">
    <span class="page_head_title">客户管理</span>
    <ul class="default_tab_block">
      <li v-if="hasAuthority('02030101')"
          @click="switchover('CAD')">
        <span>客户平面图</span>
      </li>
      <li v-if="hasAuthority('02030106')"
          @click="switchover('overview')">
        <span>租控图</span>
      </li>
      <li v-if="hasAuthority('02030102')"
          class="active">
        <span>客户列表</span>
      </li>
    </ul>
    <div class="hourse_container">
      <div class="search-bar">
        <div class="searbar-left">
          <el-select clearable
                     v-model="seachParams.organizeId"
                     @change="organizesChange"
                     placeholder="管理企业">
            <el-option v-for="item in organizesOptions"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-select clearable
                     v-model="seachParams.id"
                     filterable
                     @change="projectChange"
                     placeholder="选择项目">
            <el-option v-for="item in projectManagementsList"
                       :key="item.id"
                       :label="item.projectName"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-select clearable
                     v-model="seachParams.buildingId"
                     filterable
                     placeholder="选择楼宇">
            <el-option v-for="item in buildingOptions"
                       :key="item.id"
                       :label="item.buildingName"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-input v-model="seachParams.queryWord"
                    placeholder="客户名称"></el-input>
          <el-select v-model="seachParams.useStatus"
                     placeholder="状态">
            <el-option v-for="item in options4"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <span @click="search"
                class="query-btn">查询</span>
        </div>
        <div v-if="hasAuthority('02030103')">
          <el-button class="tban tban1"
                     @click="hourseVisible = true"><i class="iconfont icon-crm_xinzeng-"></i> 新增客户</el-button>
          <!-- <el-dropdown @command="toLead"
                       trigger="click"
                       style="margin-left: 10px">
            <el-button class="tban toLead"
                       style="background: rgba(255,255,255);border-color: rgba(64,158,255);color: rgba(64,158,255);">导入税收数据</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="download">下载模板</el-dropdown-item>
              <el-dropdown-item command="toLead">
                <span style="cursor: pointer;">
                  导入税收数据
                  <input @change="importModel($event)"
                         type="file"
                         style="position: absolute;opacity: 0;bottom: 17px;left: 0;width: 98px;cursor: pointer;" />
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
        </div>
      </div>
      <div class="hourse-table">
        <div class="table">
          <el-table :data="tableData.content">
            <el-table-column prop="teantName"
                             width="300px"
                             label="客户名称"
                             align="center"></el-table-column>
            <el-table-column prop="creditCode"
                             label="统一社会信用代码"
                             align="center"></el-table-column>
            <el-table-column prop="customerType"
                             label="企业类型"
                             align="center">
              <template slot-scope="scope">
                {{customerTypeState(scope.row.customerType)}}
              </template>
            </el-table-column>
            <el-table-column prop="companyNatureDescription"
                             label="企业性质"
                             width="120px"
                             align="center">
            </el-table-column>
            <el-table-column prop="standardIndustryName"
                             label="行业"
                             align="center"></el-table-column>
            <el-table-column prop="contact"
                             label="客户联系人"
                             align="center">
            </el-table-column>
            <el-table-column prop="telephone"
                             label="联系电话"
                             align="center">
            </el-table-column>
            <el-table-column prop="useStatus"
                             width="120"
                             label="状态"
                             align="center">
              <template slot-scope="scope">
                {{useStatusType(scope.row.useStatus)}}
              </template>
            </el-table-column>
            <el-table-column label="操作"
                             width="120"
                             align="center">
              <template slot-scope="scope">
                <el-button @click="handleEdit(scope.$index, scope.row)"
                           class="el-button--primary operation-btn"
                           size="mini"
                           v-if="hasAuthority('02030104')">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </div>
      <div class="ctc-foot1">
        <span><span style="margin-right:10px">{{pager.currentPage}}/{{Math.ceil(pager.total/pager.pgSize)}}页</span> 共{{pager.total}}条记录</span>
        <el-pagination v-if="pager.total > 0"
                       background
                       layout="prev, pager, next"
                       :page-size="pager.pgSize"
                       :total="pager.total"
                       :current-page.sync="pager.currentPage"
                       @current-change="current_change">
        </el-pagination>
        <div class="pagingnum">
          显示 <select v-model="pager.pgSize"
                  @change="currentSel">
            <option v-for="item in pager.pgNumoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </option>
          </select>
          条目
        </div>
      </div>
    </div>
    <el-dialog class="addHourse el_dialog_new"
               title="新增客户"
               @close="addDialogClose"
               :visible.sync="hourseVisible"
               :close-on-click-modal="false">
      <addTenant ref="addTenant"
                 @query="query"
                 @dialogClose="addDialogClose"
                 :addDialogShow="hourseVisible"
                 :seachParams="seachParams"
                 :organizesOptions="organizesOptions" />
      <div slot="footer"
           class="slotfooter">
        <span @click="addDialogClose"
              class="details_cannelBtn">取消</span>
        <span class="details_submitBtn"
              @click="addTenant('addData')">确定</span>
      </div>
    </el-dialog>
    <!-- 客户详情 -->
    <tenantDetails :detailsdrawershow="detailsShow"
                   :tenantDetail="detailData"
                   :checkData='checkData'
                   ref="tenantDetails"
                   @riskDetailsShowFn="riskDetailsShowFn"
                   @queryExportResult="queryExportResult"
                   @affirmDialog="affirmDialog"
                   @drawerClose="detailsClose"
                   @query="query"
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
    <!-- 导入错误 -->
    <el-dialog v-if="errorPrompt"
               title="错误提示"
               :visible.sync="errorPrompt">
      <el-table :data="gridData"
                style="min-height: 200px;border-left: 1px solid #eee;border-right: 1px solid #eee;">
        <el-table-column property="fileName"
                         label="导入文件"
                         align="center"></el-table-column>
        <el-table-column label="导入结果"
                         align="center"
                         width="220px">
          <template slot-scope="scope">
            <span style="color: red">{{scope.row.result}}</span>
          </template>
        </el-table-column>
        <el-table-column property="address"
                         label="操作"
                         align="center"
                         width="140px">
          <template slot-scope="scope">
            <span class="export-error"
                  @click="downLoadModel(scope.$index, scope.row,'home')">导出错误提示</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="errorPrompt = false"
                   class="close-button">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import context from '@/service'
import addTenant from './components/addTenant'
import tenantDetails from './components/tenantDetails'
import riskDetails from './components/riskDetails'
import contractsDetails from '@/views/contractManagement/contractsList/components/contractsDetails'
import { decrypt } from '@/utils/validate'
export default {
  name: 'tenantInfo',
  components: {
    addTenant,
    tenantDetails,
    riskDetails,
    contractsDetails
  },
  data () {
    return {
      seachParams: {
        organizeId: '',
        id: '',
        buildingId: '',
        queryWord: '',
        useStatus: 'USING'
      },
      organizesOptions: [],
      projectManagementsList: [],
      buildingOptions: [],
      gridData: [{
        fileName: '',
        result: '',
        id: ''
      }],
      errorPrompt: false,
      riskTab: 0,
      riskDetailsShow: false,
      withdrawalData: {},
      contractsDetailData: {},
      contractsDetailsShow: false,
      centerDialogVisible: false,
      navList: [{ label: '未租房源', value: true }, { label: '已租房源', value: false }, { label: '所有房源', value: false }],
      pager: {
        currentPage: 1,
        pgNum: 1,
        total: 0,
        pgSize: 15,
        pgNumoptions: [
          {
            value: 15,
            label: '15'
          },
          {
            value: 30,
            label: '30'
          },
          {
            value: 50,
            label: '50'
          }
        ]
      },
      tableData: {
      },
      addData: {
        projectManagement: {},
        building: {},
        floor: null,
        industry: null,
        decorationId: null,
        investmentStatus: null,
        expectedUnitPrice: null,
        priceUnit: 'M2DAYS'
      },
      fieldsList: [],
      formLabelWidth: '120px',
      hourseVisible: false,
      selProject: false,
      selHourse: false,
      hourseList: '',
      detailsShow: false,
      detailData: {},
      projectList: [],
      hourList: [],
      decorate: '',
      buildingList: [],
      onRent: false,
      statisicsData: {},
      tenantName: '',
      queryShopNumber: '',
      queryShopNumber_: '',
      projectArr: [],
      buildsList: [],
      ids: [],
      projectManagementId: '',
      id: '',
      industryId: '',
      industryIdArr: [],
      useStatus: 'USING',
      queryWord: '',
      options3: [{ value: 'NO_CONTRACT', label: '无合约' }, { value: 'WITHDRAWAL', label: '已退租' }, { value: 'IN_THE_CONTRACT', label: '合约中' }],
      options4: [{ value: 'DISABLE', label: '已停用' }, { value: 'USING', label: '使用中' }],
      flag: false, // flag  true代表经营数据 false税收数据
      shopOption: [],
      workOption: [],
      checkData: [],
      marketOption: []
    }
  },
  mounted () {
    this.getOrganizes()
    // this.loadProject()
    this.query()
  },
  methods: {
    async getOrganizes () { // 管理企业获取接口
      let res = await context.http.get('/uaa/api/organizes/enterprise/user', { useStatus: 'USING', organizeType: 'ENTERPRISE' })
      this.organizesOptions = res.data
      this.seachParams.organizeId = this.$route.params.organizeId ? this.$route.params.organizeId : this.organizesOptions[0].id
      this.organizesChange(this.seachParams.organizeId)
    },
    async organizesChange (id) { // 管理企业查名下项目
      this.seachParams.id = ''
      this.seachParams.buildingId = ''
      this.projectManagementsList = []
      this.buildingOptions = []
      if (!id) {
        return
      }
      let res = await context.http.get('/cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: id })
      if (res.data && res.data.length) {
        this.projectManagementsList = res.data
        this.seachParams.id = this.projectManagementsList[0].id
        if (this.$route.params && this.$route.params.projectManagementId) {
          let temp = this.projectManagementsList.some(item => {
            return item.id === this.$route.params.projectManagementId
          })
          if (temp) {
            this.seachParams.id = this.$route.params.projectManagementId
          }
        }
        this.projectChange(this.seachParams.id)
      } else {
        this.projectManagementsList = []
        this.seachParams.id = null
        this.buildingOptions = []
        this.seachParams.buildingId = null
        this.search()
      }
    },
    async projectChange (id) { // 项目下楼宇
      this.seachParams.buildingId = null
      this.buildingOptions = []
      if (!id) {
        return
      }
      let res = await context.http.get('/cms/api/buildings/newList', { useStatus: 'USING', projectId: id, page: 0, size: 9999, sort: 'id,asc' })
      if (res.data && res.data.length > 0) {
        this.buildingOptions = res.data
        this.buildingOptions = res.data.filter((item, index) => {
          return item.assetsType === 'BUILDING'
        })
        // if (this.$route.searchObj.projectManagementId)
        this.seachParams.buildingId = this.buildingOptions[0].id
        if (this.$route.params && this.$route.params.buildingId) {
          this.buildingOptions.forEach((item, index) => {
            if (item.id === this.$route.params.buildingId) {
              this.seachParams.buildingId = this.$route.params.buildingId
            }
          })
        }
        this.search()
      }
    },
    addDialogClose () {
      this.$refs.addTenant.resetFields()
      this.hourseVisible = false
    },
    addTenant () {
      this.$refs.addTenant.addTenant()
      // this.$refs.addTenant.checkName()
    },
    switchover (state) { // 平面图切换
      let searchObj = {
        organizeId: this.seachParams.organizeId,
        projectManagementId: this.seachParams.id,
        buildingId: this.seachParams.buildingId,
        floorName: null,
        floorList: []
      }
      if (state === 'overview') {
        this.$router.push({ name: 'tenantOverview', params: searchObj })
      } else {
        this.$router.push({ name: 'tenantCAD', params: searchObj })
      }
    },
    async loadProject () {
      let res = await context.http.get('/cms/api/project-managements', { useStatus: 'USING' })
      this.options = res.data
      this.id = this.$route.params.projectManagementId ? this.$route.params.projectManagementId : this.options[0].id
      console.log(this.id)
      res.data.forEach(item => {
        item.show = false
        res.data[0].show = true
        if (item.buildingListDTOSet) {
          item.buildingListDTOSet.forEach(items => {
            items.choose = false
          })
        }
      })
      this.fieldsList = res.data
      this.query()
    },
    async query () {
      let result = await context.http.get('/cms/api/tenant', {
        page: (this.pager.currentPage - 1),
        size: this.pager.pgSize,
        sort: 'id,desc',
        organizeId: this.seachParams.organizeId,
        id: this.seachParams.id,
        buildingId: this.seachParams.buildingId,
        queryWord: this.seachParams.queryWord,
        useStatus: this.seachParams.useStatus
      })
      this.tableData = result.data
      this.pager.total = Number(result.data.totalElements)
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
    async downLoadModel (index, row, isHome) { // isHome首页导入租户报错
      let url = ''
      if (row) { // flag  true代表经营数据 false税收数据
        // if (isHome === 'home') {
        //   url = `/cms/api/tenant-excel/upload?excelId=${row.id}`
        // } else {
        url = this.flag ? `/cms/api/tenantBusiness-excel/upload?excelId=${row.id}` : `/cms/api/tenantTax-excel/upload?excelId=${row.id}`
        // }
      }
      axios({ method: 'GET', url: url, responseType: 'blob' }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        let fileName = res.headers['content-disposition'].substring(20)
        fileName = decodeURI(fileName)
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(url)
      })
    },
    riskDetailsClose () {
      this.riskDetailsShow = false
    },
    riskDetailsShowFn (i) {
      this.riskTab = i
      this.riskDetailsShow = true
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
    useStatusType (val) {
      if (val) {
        if (val === 'DISABLE') {
          return '已停用'
        } else if (val === 'USING') {
          return '使用中'
        }
      }
    },
    customerTypeState (val) {
      if (val) {
        if (val === 'COMPANY') {
          return '法人单位'
        } else if (val === 'PERSONAL') {
          return '个体户'
        } else if (val === 'BRANCH') {
          return '分支机构'
        } else if (val === 'OTHER') {
          return '其他单位'
        } else {
          return ''
        }
      }
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
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    changeNav (inx) {
      this.navList.forEach(item => {
        item.value = false
      })
      this.navList[inx].value = true
      if (inx === 0) {
        this.onRent = false
      } else if (inx === 1) {
        this.onRent = true
      } else {
        this.onRent = null
      }
      this.pager.currentPage = 1
      this.query()
    },
    search () {
      this.pager.currentPage = 1
      this.queryShopNumber_ = this.queryShopNumber
      this.query()
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
    handleEdit (index, row) {
      context.http.get('/cms/api/tenant/' + row.id).then(res => {
        if (!res.data.building) {
          res.data.building = { id: '', buildingName: '' }
        }
        context.http.get('/cms/api/enterpriseRooms/tenantId/' + row.id).then(result => {
          this.checkData = result.data
        })
        this.detailData = res.data
        this.detailData.industryIdid = []
        // this.detailData.iDNumber = this.decryptMsg(this.detailData.iDNumber)
        this.detailsShow = true
        this.$nextTick(() => {
          // console.log(this.$refs.tenantDetails)
        })
      })
    },
    decryptMsg (val) {
      return decrypt(val)
    },
    current_change (currentPage) {
      this.pager.currentPage = currentPage
      this.query()
    },
    currentSel () {
      this.pager.currentPage = 1
      this.query()
    },
    choose (state) {
      if (state === 'project') {
        this.selHourse = false
        this.selProject = !this.selProject
      } else {
        this.selProject = false
        this.selHourse = !this.selHourse
      }
    },
    chooseItem (state, item) {
      if (state === 'project') {
        this.selProject = !this.selProject
        this.addData.projectManagement = item
        this.addData.building = {}
        this.buildingList = []
        if (this.addData.floor) {
          this.addData.floor = null
        }
        context.http.get('/cms/api/buildings', { projectId: item.id, useStatus: 'USING' }).then(res => {
          //        this.addData.building = res.data.buildingListDTOS[0]
          this.hourList = res.data.buildingListDTOS
        })
      } else {
        this.selHourse = !this.selHourse
        this.addData.building = item
        if (this.addData.floor) {
          this.addData.floor = null
        }
        context.http.get('/cms/api/floors/building/' + this.addData.building.id).then(res => {
          this.buildingList = res.data
        })
      }
    },
    addLabel (e) {
      if (!e.target.value) return
      this.addData.label.push(e.target.value)
      e.target.value = ''
    },
    deleteLabel (inx) {
      this.addData.label.splice(inx, 1)
    },
    changeHourse () {
      if (this.hourseList === '') {
        this.hourseList = 'on'
      } else if (this.hourseList === 'on') {
        this.hourseList = 'off'
      } else {
        this.hourseList = 'on'
      }
    },
    toLead (row) {
      if (row === 'download') {
        axios({ method: 'GET', url: '/cms/api/tenantTax-excel/file', responseType: 'blob' }).then(res => {
          let url = window.URL.createObjectURL(new Blob([res.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          let fileName = res.headers['content-disposition'].substring(20)
          fileName = decodeURI(fileName)
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          window.URL.revokeObjectURL(url)
        })
      }
    },
    importModel (event) {
      let files = event.target.files
      let form = new FormData()
      form.append('file', files[0])
      let name = files[0].name
      let index = name.lastIndexOf('.')
      let type = name.substr(index + 1).toLowerCase()
      if (files[0].size > (1024 * 1024 * 20)) {
        this.$message({
          message: '文件大小不能超过20M',
          type: 'error'
        })
        return
      }
      if (index > 0 && type !== 'xlsx' && type !== 'xls') {
        this.$message({
          message: '格式错误，请上传xlsx、xls格式文件',
          type: 'error'
        })
      } else {
        context.http.post('/cms/api/tenant-excel/file', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          if (res.status === 200) {
            this.queryExportDetail(res.data.id)
            event.target.value = ''
          }
        }).catch(error => {
          event.target.value = ''
          console.info(error)
        })
      }
    },
    queryExportDetail (id) {
      const loading = this.$loading({
        lock: true,
        text: '导入中',
        spinner: 'el-icon-loading el-import-loading',
        customClass: 'loading-icon',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      // context.http.get(`/cms/api/tenant-excel/detail?excelId=${id}`).then(res => {
      context.http.get(`/cms/api/tenantTax-excel/detail`).then(res => {
        if (res.data.excelResult === '审核中') {
          setTimeout(res => {
            this.queryExportDetail(id)
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
          this.errorPrompt = false
          this.$message({
            message: '导入成功！',
            type: 'success'
          })
          loading.close()
          this.query()
        }
      })
    },
    spread (inx) {
      this.fieldsList.forEach((item, index) => {
        if (inx !== index) {
          item.show = false
        }
      })
      this.fieldsList[inx].show = !this.fieldsList[inx].show
    },
    deleBuild (index) {
      if (this.buildsList[index].id) {
        this.fieldsList.forEach(item => {
          if (item.buildingListDTOSet) {
            item.buildingListDTOSet.forEach(items => {
              if (items.id === this.buildsList[index].id) {
                items.choose = false
              }
            })
          }
        })
      }
      this.buildsList.splice(index, 1)
      let arr = []
      this.buildsList.forEach(item => {
        arr.push(item.id)
      })
      this.ids = arr
      this.pager.currentPage = 1
      this.query()
    },
    chooseSoread (i, inx) {
      this.fieldsList[i].buildingListDTOSet[inx].choose = !this.fieldsList[i].buildingListDTOSet[inx].choose
      if (this.fieldsList[i].buildingListDTOSet[inx].choose) {
        this.buildsList.push(this.fieldsList[i].buildingListDTOSet[inx])
      } else {
        this.buildsList.splice(this.buildsList.indexOf(this.fieldsList[i].buildingListDTOSet[inx]), 1)
      }
      let arr = []
      this.buildsList.forEach(item => {
        arr.push(item.id)
      })
      this.ids = arr
      this.pager.currentPage = 1
      this.query()
    },
    parseOrganize (organizeTree) {
      if (organizeTree.child.length === 0) {
        return { value: organizeTree.id ? organizeTree.id : organizeTree.userPostId ? organizeTree.userPostId : organizeTree.userId, label: organizeTree.name }
      } else {
        return {
          value: organizeTree.id ? organizeTree.id : organizeTree.userPostId ? organizeTree.userPostId : organizeTree.userId,
          label: organizeTree.name,
          children: organizeTree.child.map(item => {
            return this.parseOrganize(item)
          })
        }
      }
    }
  }
}
</script>
<style lang="scss">
@import "../../../style/config";
ul,
li {
  list-style: none;
}
.export-error {
  display: inline-block;
  width: 90px;
  height: 26px;
  line-height: 24px;
  text-align: center;
  border: 1px solid #3577f6;
  color: #3577f6;
  border-radius: 4px;
  cursor: pointer;
}
.hourse_search .el-input .el-input__inner {
  width: 150px;
  height: 32px;
  line-height: 32px;
  position: absolute;
  left: 0;
  top: 0;
}
.tenant {
  font-size: 16px;
  background-color: #f9f9f9;
  .hourse_container {
    background-color: #f9f9f9;
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
    .search-bar {
      .tenant-btn {
        width: 70px;
        height: 38px;
        line-height: 40px;
        margin-left: 0;
      }
      .tenant-addbtn {
        height: 38px;
        line-height: 40px;
      }
      .el-select {
        width: 146px;
      }
      .el-input {
        width: 146px;
      }
      div {
        cursor: pointer;
      }
    }

    .hourse_statistical {
      background-color: #fff;
      margin: 15px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      .statistical_top {
        padding: 15px 30px;
        font-size: 15px;
        color: #747474;
        line-height: 15px;
        border-bottom: 1px solid #ecedef;
      }
      .statistical_bot {
        padding: 32px 30px 40px;
        display: flex;
        li {
          list-style: none;
          padding-right: 45px;
          padding-left: 20px;
          height: 45px;
          border-right: 2px solid #ecedef;
          &:first-child {
            padding-left: 0;
          }
          &:last-child {
            border-right: 0;
          }
          &:nth-child(3) {
            border-right: 0;
            margin-right: 115px;
          }
          p {
            color: #adadad;
            font-size: 14px;
            line-height: 14px;
            margin-top: -8px;
            &:last-child {
              color: #333;
              font-size: 20px;
              margin-top: 30px;
            }
          }
        }
      }
    }
    .hourse-table {
      background-color: #fff;
      margin: 10px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
    }
  }
  .hourseList {
    position: fixed;
    right: -350px;
    top: 50px;
    z-index: 10;
    width: 350px;
    height: 100%;
    background: #fff;
    box-shadow: -5px 0 20px -5px #ddd;
    .closeHourse {
      position: absolute;
      left: -40px;
      top: 50%;
      margin-top: -60px;
      width: 40px;
      height: 50px;
      background: #5482f7;
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
      cursor: pointer;
      z-index: 10;
      line-height: 50px;
      text-align: center;
      font-size: 18px;
      color: #fff;
    }
    .content {
      position: relative;
      width: 100%;
      height: 100%;
      overflow-y: auto;
      .list {
        dl {
          dt {
            border-bottom: 1px solid #efefef;
            height: 90px;
            padding: 20px 16px;
            cursor: pointer;
            &.act {
              height: 50px;
              padding: 0px 16px;
              span {
                &.over-hiden {
                  width: 280px;
                  white-space: nowrap;
                  word-break: break-all;
                  text-overflow: ellipsis;
                  overflow: hidden;
                }
                margin-left: 0;
              }
            }
            img {
              display: block;
              width: 100px;
              height: 50px;
              float: left;
            }
            span {
              float: left;
              display: block;
              line-height: 50px;
              color: #333;
              margin-left: 16px;
              &.over-hiden {
                width: 180px;
                white-space: nowrap;
                word-break: break-all;
                text-overflow: ellipsis;
                overflow: hidden;
              }
              &:last-child {
                float: right;
                color: #6473cb;
                margin-left: 0;
              }
            }
          }
          dd {
            overflow: hidden;
            .ddbox {
              width: 315px;
              border: 1px solid #efefef;
              border-radius: 6px;
              margin: 0 auto;
              padding: 15px;
              display: flex;
              margin-top: 16px;
              cursor: pointer;
              &.active {
                border: 1px solid #6473cb;
                background: #f7f7f7;
              }
              &.animateDown {
                animation: slideInDown 0.4s 0s ease-out forwards;
              }
              img {
                width: 100px;
                height: 50px;
              }
              p {
                margin-left: 14px;
                span {
                  display: block;
                  color: #737373;
                  font-size: 14px;
                  line-height: 14px;
                  &:first-child {
                    margin-top: 16px;
                    margin-bottom: 6px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .marginLeft {
    animation: cloud-on 0.2s 0s ease-out forwards;
  }
  .marginRight {
    animation: cloud-on2 0.2s 0s ease-out forwards;
  }
  .addHourse {
    .el-dialog {
      width: 700px;
    }
  }
  .page {
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    padding: 60px 30px 30px 30px;
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      background-color: #2f3f48;
      color: #fff;
    }
    .el-pagination.is-background .el-pager li:not(.disabled):hover {
      color: #999;
    }
    .pagingnum {
      font-size: 14px;
      text-align: center;
      color: #777;
      select {
        width: 70px;
        height: 28px;
        border-radius: 2px;
      }
    }
  }
}
.paddingLeft {
  animation: cloud-in 0.2s 0s ease-out forwards;
}
.paddingRight {
  animation: cloud-in2 0.2s 0s ease-out forwards;
}
@keyframes cloud-in {
  0% {
    padding-right: 0;
  }
  100% {
    padding-right: 350px;
  }
}
@keyframes cloud-in2 {
  0% {
    padding-right: 350px;
  }
  100% {
    padding-right: 0;
  }
}
@keyframes cloud-on {
  0% {
    right: -350px;
  }
  100% {
    right: 0;
  }
}
@keyframes cloud-on2 {
  0% {
    right: 0;
  }
  100% {
    right: -350px;
  }
}
@-webkit-keyframes slideInDown {
  0% {
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
    visibility: visible;
  }

  100% {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes slideInDown {
  0% {
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
    visibility: visible;
  }

  100% {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
.UpBtn1 {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  font-size: 14px;
  border-radius: 4px;
  width: 75px;
  height: 40px;
  line-height: 40px;
  position: relative;
  input {
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}
.turnoverDialog {
  .el-dialog--center .el-dialog__body {
    padding: 25px 25px 30px !important;
  }
}
</style>
<style>
@font-face {
  font-family: 'ali';
  src: url(../../../../static/ali/Alibaba-PuHuiTi-Bold.ttf),
       url(../../../../static/ali/Alibaba-PuHuiTi-Heavy.ttf),
       url(../../../../static/ali/Alibaba-PuHuiTi-Light.ttf),
       url(../../../../static/ali/Alibaba-PuHuiTi-Medium.ttf),
       url(../../../../static/ali/Alibaba-PuHuiTi-Regular.ttf);
  font-weight: normal;
  font-style: normal;
}
</style>
