<template>
  <div class="contract">
    <span class="page_head_title">合同列表</span>
    <div class="intention_container">
      <div class="">
        <div class="search-bar">
          <div>
            <el-select clearable
                       v-model="organizeId"
                       placeholder="管理企业"
                       @change='getProject(organizeId)'>
              <el-option v-for="item in enterpriseOptions"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
            <el-select clearable
                       filterable
                       v-model="projectId"
                       placeholder="项目名称">
              <el-option v-for="item in optionsProject"
                         :key="item.id"
                         :label="item.projectName"
                         :value="item.id">
              </el-option>
            </el-select>
            <el-input v-model="queryContract"
                      placeholder="合同编号"></el-input>
            <el-input v-model="tenantName"
                      placeholder="地址/客户名称"></el-input>
            <el-date-picker style="width:150px!important;"
                            clearable
                            v-model="dateContract"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="合同到期日">
            </el-date-picker>
            <el-select clearable
                       v-model="contractType"
                       placeholder="租赁方式">
              <el-option label="一手租赁"
                         value="RENT">
              </el-option>
              <el-option label="转租"
                         value="SUBLET">
              </el-option>
            </el-select>
            <el-select clearable
                       multiple
                       collapse-tags
                       v-model="contractStatus"
                       placeholder="合同状态(多选)">
              <el-option v-for="item in options2"
                         :key="item.value"
                         :label="item.text"
                         :value="item.value">
              </el-option>
            </el-select>
            <span @click="search"
                  class="query-btn">查询</span>
          </div>
          <div style="">
            <div>
              <el-button class="tban tban1"
                         v-if="hasAuthority('02020502')"
                         @click="addHoursing"><i class="iconfont icon-crm_xinzeng-"></i> 新增合同</el-button>
            </div>
          </div>
        </div>
        <div v-if="buildsList.length"
             class="search-bottom">
          <dl>
            <dt>选择楼宇：</dt>
            <dd v-for="(item, index) in buildsList"
                :key="index"><span>{{item.buildingName}}</span><span @click="deleBuild(index)"
                    class="iconfont icon-jinakangbaoicons18"></span></dd>
          </dl>
        </div>
      </div>
      <div class="hourse-table">
        <div class="table">
          <el-table :data="tableData"
                    style="width: 100%">
            <el-table-column prop="organizeName"
                             label="管理企业"
                             width="110px;"
                             align="center"></el-table-column>
            <el-table-column prop="referred"
                             label="项目名称"
                             width="110px;"
                             align="center"></el-table-column>
            <el-table-column prop="contractNo"
                             label="合同编号"
                             width="110px;"
                             align="center"></el-table-column>
            <el-table-column label="楼宇名称"
                             align="center">
              <template slot-scope="scope">
                {{toStringShop(scope.row.shopNo)}}
              </template>
            </el-table-column>
            <el-table-column prop="address"
                             label="地址"
                             align="center">
            </el-table-column>
            <el-table-column prop="tenantName"
                             label="客户名称"
                             align="center"></el-table-column>
            <el-table-column label="合同起止日"
                             width="200px;"
                             align="center">
              <template slot-scope="scope">
                {{scope.row.startDate}}~{{scope.row.endDate}}
              </template>
            </el-table-column>
            <el-table-column prop="areaDescription"
                             label="租赁面积 m²/亩"
                             align="center"
                             width="130px;"></el-table-column>
            <el-table-column prop="contractStatus"
                             label="合同状态"
                             width="100px;"
                             align="center"
                             :formatter="formatterStatus"></el-table-column>
            <el-table-column label="操作"
                             width="100px;"
                             v-if="hasAuthority('02020503')"
                             align="center">
              <template slot-scope="scope">
                <el-button @click="handleEdit(scope.$index, scope.row)"
                           class="el-button--primary operation-btn"
                           size="mini">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="ctc-foot1"
             style="padding-right:15px;">
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
                    @change="pgSizeSelectFn">
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
    </div>
    <!-- 新增合同 -->
    <el-dialog class="addintentionContracts"
               :title="addDialogTitle"
               :visible.sync="addVisible"
               :show-close="true"
               :before-close="handleClose"
               :close-on-press-escape="false"
               :close-on-click-modal="false">
      <addContracts :projectList='projectList'
                    :contractState="contractState"
                    :detailData="detailDataIC"
                    :intentionToFormalize="intention"
                    :approvalReject="approval"
                    :queryObj="queryObj"
                    v-if="addVisible"
                    @resetParameters="resetParameters"
                    @addDialogClose="addDialogClose"
                    @query="query"
                    ref="addContracts" />
    </el-dialog>

    <el-dialog title="根据合同批量生成账单"
               width="800px"
               :visible.sync="billDialogVisible"
               class="batch-production">
      <div class="query-wrap">
        <el-select v-model="projectManagementId"
                   placeholder="项目">
          <el-option v-for="item in projectOptions"
                     :key="item.id"
                     :label="item.referred"
                     :value="item.id">
          </el-option>
        </el-select>
        <div class="query-btn"
             @click="queryContractList">查询</div>
      </div>
      <el-table ref="multipleTable"
                :data="billTableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column label="项目简称"
                         width="120">
          <template slot-scope="scope">{{ scope.row.projectManagement.referred }}</template>
        </el-table-column>
        <el-table-column label="合同编号">
          <template slot-scope="scope">{{ scope.row.contractNo }}</template>
        </el-table-column>
        <el-table-column label="品牌简称"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.tenant.referred }}</template>
        </el-table-column>
        <el-table-column label="合同起止日"
                         width="200px;"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.startDate }} ~ {{ scope.row.endDate }}</template>
        </el-table-column>
        <el-table-column label="合同状态"
                         prop="contractStatus"
                         :formatter="formatterStatus"
                         show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <div class="page"
           style="margin-bottom: 10px;">
        <el-pagination v-if="billPager.total > 0"
                       background
                       layout="prev, pager, next"
                       :page-size=billPager.pgSize
                       :total="billPager.total"
                       :current-page="billPager.currentPage"
                       @current-change="bill_current_change">
        </el-pagination>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="billDialogVisible = false"
                   class="close-button">取 消</el-button>
        <el-button type="primary"
                   @click="generateBills()"
                   class="defaultbtn dialog-confirmBtn">生成账单</el-button>
      </div>
    </el-dialog>

    <el-dialog title="生成账单时间"
               :visible.sync="billTimeDialog"
               width="40%">
      <div class="bill-time-wrap">
        <el-date-picker v-model="billTime"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="billTimeDialog = false"
                   class="close-button">取 消</el-button>
        <el-button type="primary"
                   @click="confirmGenerate"
                   class="defaultbtn dialog-confirmBtn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 合同详情 -->
    <contractsDetails :detailsdrawershow="detailsShow"
                      :detailData="detailData"
                      :withdrawalData="withdrawalData"
                      ref="contractsDetails"
                      @openAddDialog="openAddDialog"
                      @drawerClose="detailsClose"
                      @handleEdit="handleEdit"
                      @showTenant="showTenant"
                      @query="query" />
    <!-- 客户详情 -->
    <tenantDetails :detailsdrawershow="tenantDetailsShow"
                   :tenantDetail="tenantDetailData"
                   ref="tenantDetails"
                   @riskDetailsShowFn="riskDetailsShowFn"
                   @queryExportResult="queryExportResult"
                   @affirmDialog="affirmDialog"
                   @drawerClose="tDetailsClose"
                   @query="handleEdit"
                   @handleEdit="getTenantDetails"
                   v-if="tenantDetailsShow" />
    <!-- 风险详情 -->
    <riskDetails :detailsdrawershow="riskDetailsShow"
                 :tenantDetail="tenantDetailData"
                 :riskTab="riskTab"
                 @drawerClose="riskDetailsClose" />
  </div>
</template>
<script>
import context from '@/service'
import aliUpload from '@/components/aliUpload.vue'
import ailPreview from '@/components/ailPreview.vue'
import contractsDetails from './components/contractsDetails'
import addContracts from './components/addContracts'
import projectSidebar from '@/components/projectSidebar'
import { toLocaleFixed, getformat } from '@/utils/validate.js'
import { setTimeout } from 'timers'
import tenantDetails from '../../operationManagement/tenantInfo/components/tenantDetails.vue'
import riskDetails from '../../operationManagement/tenantInfo/components/riskDetails.vue'
export default {
  name: 'contractsList',
  components: {
    projectSidebar,
    addContracts,
    contractsDetails,
    riskDetails,
    tenantDetails,
    aliUpload,
    ailPreview
  },
  data () {
    return {
      contractType: '',
      templateKey: 0,
      newKeyWord: null, // 新增自定义关键词
      copyList: [],
      temDialogVisible: false,
      tempName: '',
      enclosureList: [{
        annexName: '',
        annexURL: ''
      }],
      fileType: ['doc', 'docx'],
      templateData: [],
      customersData: {},
      riskDetailsShow: false,
      riskTab: 0,
      recordRow: {},
      tenantDetailsShow: false,
      tenantDetailData: {},
      queryObj: {
        projectId: '',
        tenantId: ''
      },
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
      billPager: {
        currentPage: 1,
        pgNum: 1,
        total: 0,
        pgSize: 15
      },
      addDialogTitle: '新增合同',
      billDialogVisible: false,
      billTimeDialog: false,
      billTime: '',
      tableData: [],
      billTableData: [],
      projectOptions: [],
      addVisible: false,
      hourseList: '',
      detailsShow: false,
      detailData: {
        onFileAnnexes: []
      },
      detailDataIC: {},
      projectList: [],
      queryContract: '',
      tenantName: '',
      buildsList: [],
      contractState: '',
      intention: '',
      approval: '',
      withdrawalData: {},
      projectManagementId: '',
      selectData: [],
      select_orderId: [],
      select_order_number: '',
      getRowKeys (row) {
        return row.id
      },
      multipleSelectionAll: [], // 所有选中的数据包含跨页数据
      multipleSelection: [], // 当前页选中的数据
      idKey: 'id', // 标识列表数据中每一行的唯一键的名称(需要按自己的数据改一下)
      dateContract: '',
      projectId: '', // 商圈
      buildingName: '', // 楼号
      contractStatus: ['STORAGE', 'PENDING', 'EXECUTING', 'ZH_APPROVAL', 'TZ_APPROVAL', 'WITHDRAWAL', 'XQ_APPROVAL', 'MATURITY'],
      options1: [],
      options2: [{ text: '暂存', value: 'STORAGE' }, { text: '待执行', value: 'PENDING' }, { text: '执行中', value: 'EXECUTING' },
      { text: '招商审核中', value: 'ZH_APPROVAL' }, { text: '退租审核中', value: 'TZ_APPROVAL' }, { text: '已退租', value: 'WITHDRAWAL' },
      { text: '续签审核中', value: 'XQ_APPROVAL' }, { text: '到期未处理', value: 'MATURITY' }],
      enterpriseOptions: [],
      optionsProject: [],
      organizeId: ''
    }
  },
  created () {
    this.queryTreeAll()
    if (localStorage.contractStatusList) {
      this.contractStatus = JSON.parse(localStorage.contractStatusList)
    }
    let pageFrom = this.$route.params.pageFrom
    let row = this.$route.params.row
    if (pageFrom === 'industryCAD') { // 如果从指定页面进入自动打开合同详情
      this.handleEdit('', row)
    }
    if (pageFrom === 'TenantInformation') {
      this.openAddDialog2()
    }
    // this.getDataAuthorityOptions()

    // 客户信息页发起合同
    let projectObj = this.$route.query.project
    let tenantId = this.$route.query.tenant
    if (projectObj && tenantId) {
      this.queryObj.projectObj = projectObj
      this.queryObj.tenantId = tenantId
      this.addHoursing()
    }
  },
  mounted () {
    this.query(this.idsArray)
    let intention = this.$route.query.intention
    if (intention) {
      context.http.get(`/cms/api/yx-contracts/toBeContract/${intention}`).then(res => {
        this.detailDataIC = res.data
        // console.log('intentionData', this.detailData)
        this.intention = 'intentionToFormalize'
        this.addVisible = true
      })
    }
    // 工作台合同到期跳转
    let contractDetails = this.$route.query.contractIdForDetails
    if (contractDetails) {
      context.http.get(`/cms/api/contracts/${contractDetails}`).then(res => {
        this.detailData = res.data
        // this.detailDataIC = res.data
        this.detailsShow = true
      })
    }
    let contractId = this.$route.query.contractId
    let rejectedType = this.$route.query.type
    if (contractId && rejectedType === 'surrender') { // 合同退租驳回
      context.http.get(`/cms/api/lease-contracts/${contractId}`).then(res => {
        this.detailsShow = true
        this.detailData = res.data.contractDTO
        this.withdrawalData = res.data
        this.$refs.contractsDetails.contractWithdrawal('edit')
      })
    }
    if (contractId && rejectedType === 'contractSign') { // 合同签订驳回
      context.http.get(`/cms/api/contracts/${contractId}`).then(res => {
        if (res.status === 200) {
          this.approval = 'approvalReject'
          this.addVisible = true
          this.detailData = res.data
        }
      })
    }
  },
  methods: {
    getformat2 (str) {
      return getformat(str)
    },
    deleteAnnex () {
      this.enclosureList = [{
        annexName: '',
        annexURL: ''
      }]
    },
    getTemplateDetails (id) {
      context.http.get(`/cms/api/billNoticeTemp/${id}`).then(res => {
        this.templateDetail = res.data
      })
    },
    useStatusFormat (state) {
      let res = ''
      res = state === 'USING' ? '使用中' : '已停用'
      return res
    },
    setAnnex (annexURL, annexName) {  // 子组件上传成功返回文件url 和名字
      this.enclosureList = [{
        'annexName': annexName,
        'annexURL': annexURL
      }]
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
      this.getTenantDetails(0, row)
      this.detailsShow = false
    },
    getTenantDetails (index, row) {
      context.http.get('/cms/api/tenant/' + row.id).then(res => {
        this.tenantDetailData = res.data
        this.tenantDetailsShow = true
      })
    },
    tDetailsClose (id) {
      this.tenantDetailsShow = false
      let recordRow
      if (id) {
        recordRow = {}
        recordRow.id = id
      } else {
        recordRow = this.recordRow
      }
      this.handleEdit(0, recordRow)
    },
    affirmDialog (contractId, tenantId) {
      console.log(contractId, tenantId)
    },
    async getBuliding () {
      if (!this.projectId) {
        this.options1 = []
        this.buildingName = null
        return
      }
      let result = await context.http.get('cms/api/buildings/newList', { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING', projectId: this.projectId })
      if (result.data.length === 0) {
        this.options1 = []
        this.buildingName = null
        return
      }
      this.options1 = result.data
      this.buildingName = null
    },
    toStringShop (val) {
      if (val) {
        let stringVal = ''
        val.forEach((item, index) => {
          if ((index + 1) === val.length) {
            stringVal = stringVal + item
          } else {
            stringVal = stringVal + (item + '、')
          }
        })
        return stringVal
      }
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    async getDataAuthorityOptions () {
      let result = await context.http.get('cms/api/project-managements', { page: 0, size: 100, sort: 'desc', useStatus: 'USING' })
      this.projectOptions = result.data
      this.projectManagementId = this.projectOptions[0].id
    },
    queryContractList () {
      context.http.get('/cms/api/contracts/pending', { projectManagementId: this.projectManagementId, page: (this.billPager.currentPage - 1), size: this.billPager.pgSize, sort: 'id,desc' }).then(res => {
        this.billTableData = res.data
        this.billPager.total = Number(res.headers['x-total-count'])
        setTimeout(() => {
          this.setSelectRow()
        }, 20)
      })
    },
    generateBills () {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择合同',
          type: 'warning'
        })
        return
      }
      this.billTimeDialog = true
    },
    handleClose (done) {
      localStorage.contractStatus = ''
      done()
    },
    search () {
      this.pager.currentPage = 1
      localStorage.contractStatusList = JSON.stringify(this.contractStatus)
      this.query(this.idsArray)
    },
    filterHandler (value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    detailsClose () {
      this.detailsShow = false
    },
    resetParameters () {
    },
    openAddDialog () {
      localStorage.STORAGE = 'false'
      if (localStorage.contractStatus === 'renewal') {
        this.addDialogTitle = '合同续签'
        this.contractState = 'renewal'
      } else {
        this.addDialogTitle = '新增合同'
        this.contractState = ''
      }
      context.http.get('/cms/api/project-managements', { useStatus: 'USING' }).then(res => {
        if (res.status === 200) {
          this.projectList = res.data
          this.addVisible = true
        }
      })
      this.detailData = JSON.parse(localStorage.contract)
      this.detailDataIC = JSON.parse(localStorage.contract)
    },
    openAddDialog2 () {
      localStorage.STORAGE = 'false'
      this.addDialogTitle = '合同续签'
      this.contractState = 'renewal'
      this.detailDataIC = JSON.parse(localStorage.contract)
      this.addVisible = true
    },
    handleEdit (index, row) {
      this.recordRow = row
      context.http.get('/cms/api/contracts/' + row.id).then(res => {
        this.detailData = res.data
        this.detailDataIC = res.data
        if (row.contractStatus === 'STORAGE') {
          localStorage.STORAGE = 'true'
          context.http.get('/cms/api/project-managements', { useStatus: 'USING' }).then(res => {
            if (res.status === 200) {
              this.projectList = res.data
              this.addVisible = true
            }
          })
        } else {
          this.detailsShow = true
        }
      })
      this.addDialogTitle = '新增合同'
    },
    current_change (currentPage) {
      this.pager.currentPage = currentPage
      this.query(this.idsArray)
    },
    bill_current_change (currentPage) {
      // 改变页的时候调用一次
      this.changePageCoreRecordData()
      this.billPager.currentPage = currentPage
      this.queryContractList()
    },
    sidebarQuery (ids) {
      this.pager.currentPage = 1
      this.query(ids)
    },
    pgSizeSelectFn () { // 切换显示条数
      this.pager.currentPage = 1
      this.query(this.idsArray)
    },
    addHoursing () {
      this.detailDataIC = {}
      localStorage.STORAGE = 'false'
      localStorage.contractStatus = ''
      this.contractState = ''
      this.addDialogTitle = '新增合同'
      context.http.get('/cms/api/project-managements', { useStatus: 'USING' }).then(res => {
        if (res.status === 200) {
          this.projectList = res.data
          this.addVisible = true
        }
      })
    },
    deleBuild (index) {
      this.$refs.projectSidebar.deleBuild(index)
    },
    query (ids) {
      // let idArray = []
      // if (ids && ids.length > 0) {
      //   idArray = ids
      // }
      // let typeArr = ''
      // idArray.forEach((item, index) => {
      //   if (index === idArray.length - 1) {
      //     typeArr += 'buildingId=' + item
      //   } else {
      //     typeArr += 'buildingId=' + item + '&'
      //   }
      // })
      // let contractStatus = JSON.parse(JSON.stringify(this.contractStatus))
      context.http.get('/cms/api/contracts?sort=projectManagementSortNumber,asc&sort=contractNo,asc&sort=id,asc', {
        name: this.queryContract,
        tenantName: this.tenantName,
        projectManagementId: this.projectId,
        buildingId: this.buildingName,
        contractStatus: this.contractStatus.toString(),
        contractType: this.contractType,
        endDate: this.dateContract,
        page: (this.pager.currentPage - 1),
        size: this.pager.pgSize,
        organizeId: this.organizeId
      }).then(res => {
        this.tableData = res.data
        this.tableData.forEach(ele => {
          ele.area = toLocaleFixed(ele.area)
        })
        this.pager.total = Number(res.headers['x-total-count'])
      })
    },
    formatterStatus (row, column) {
      let contractStatus
      if (row.contractStatus === 'STORAGE') {
        contractStatus = '暂存'
      } else if (row.contractStatus === 'PENDING') {
        contractStatus = '待执行'
      } else if (row.contractStatus === 'EXECUTING') {
        contractStatus = '执行中'
      } else if (row.contractStatus === 'ZH_APPROVAL') {
        contractStatus = '招商审核中'
      } else if (row.contractStatus === 'TZ_APPROVAL') {
        contractStatus = '退租审核中'
      } else if (row.contractStatus === 'WITHDRAWAL') {
        contractStatus = '已退租'
      } else if (row.contractStatus === 'XQ_APPROVAL') {
        contractStatus = '续签审核中'
      } else if (row.contractStatus === 'NO') {
        contractStatus = '审核未通过'
      } else if (row.contractStatus === 'MATURITY') {
        contractStatus = '到期未处理'
      }
      return contractStatus
    },
    setpdleft (val) {
      this.hourseList = val
    },
    setBuildsList (val) {
      this.buildsList = val
      let idsArray = []
      this.buildsList.forEach(ele => {
        idsArray.push(ele.id)
      })
      this.idsArray = idsArray
    },
    addDialogClose () {
      this.addVisible = false
      this.contractState = ''
      localStorage.contractStatus = ''
    },
    addbill () {
      this.billTableData = []
      this.billPager = {
        currentPage: 1,
        pgNum: 1,
        total: 0,
        pgSize: 15
      }
      this.getDataAuthorityOptions()
      this.billDialogVisible = true
    },
    handleSelectionChange (val) {
      // table组件选中事件,记得加上@selection-change="handleSelectionChange"
      this.multipleSelection = val
    },
    // 设置选中的方法
    setSelectRow () {
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
        return
      }
      // 标识当前行的唯一键的名称
      let idKey = this.idKey
      let selectAllIds = []
      let that = this
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey])
      })
      this.$refs.multipleTable.clearSelection()
      for (var i = 0; i < this.billTableData.length; i++) {
        if (selectAllIds.indexOf(this.billTableData[i][idKey]) >= 0) {
          // 设置选中，记住table组件需要使用ref="table"
          this.$refs.multipleTable.toggleRowSelection(this.billTableData[i], true)
        }
      }
    },
    // 记忆选择核心方法
    changePageCoreRecordData () {
      // 标识当前行的唯一键的名称
      let idKey = this.idKey
      let that = this
      // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
      if (this.multipleSelectionAll.length <= 0) {
        this.multipleSelectionAll = this.multipleSelection
        return
      }
      // 总选择里面的key集合
      let selectAllIds = []
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey])
      })
      let selectIds = []
      // 获取当前页选中的id
      this.multipleSelection.forEach(row => {
        selectIds.push(row[idKey])
        // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
        if (selectAllIds.indexOf(row[idKey]) < 0) {
          that.multipleSelectionAll.push(row)
        }
      })
      let noSelectIds = []
      // 得到当前页没有选中的id
      this.billTableData.forEach(row => {
        if (selectIds.indexOf(row[idKey]) < 0) {
          noSelectIds.push(row[idKey])
        }
      })
      noSelectIds.forEach(id => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < that.multipleSelectionAll.length; i++) {
            if (that.multipleSelectionAll[i][idKey] === id) {
              // 如果总选择中有未被选中的，那么就删除这条
              that.multipleSelectionAll.splice(i, 1)
              break
            }
          }
        }
      })
    },
    confirmGenerate () {
      if (this.billTime.length < 1) {
        this.$message({
          message: '请选择时间',
          type: 'warning'
        })
        return
      }
      // console.log(this.multipleSelection)
      let multipleSelectionAll = this.multipleSelectionAll.concat(this.multipleSelection)
      let newArr = multipleSelectionAll.map((item, index, arr) => {
        return item.id
      })
      let ids = newArr.filter((x, index, self) => self.indexOf(x) === index)
      context.http.post('/cms/api/rent-clauses/business/contract', { contractId: ids, startDate: this.billTime[0], endDate: this.billTime[1] }).then(res => {
        if (res.status === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.billTime = []
          this.billTableData = []
          this.billTimeDialog = false
          this.billPager = {
            currentPage: 1,
            pgNum: 1,
            total: 0,
            pgSize: 15
          }
        }
      })
    },
    queryTreeAll () {
      context.http.get('/uaa/api/organizes/enterprise/user', { useStatus: 'USING', organizeType: 'ENTERPRISE' }).then(result => {
        if (result.status === 200 && result.data.length > 0) {
          this.enterpriseOptions = result.data
        } else {
          this.enterpriseOptions = []
        }
      })
    },
    getProject (organizeId) {
      this.optionsProject = []
      this.projectId = ''
      if (!organizeId || organizeId.length === 0) return
      context.http.get('/cms/api/project-managements/byOrganizeId', {
        useStatus: 'USING',
        organizeId: organizeId
      }).then(res => {
        if (res.status === 200) {
          this.optionsProject = res.data
        }
      })
      this.projectId = ''
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
.contract_search .el-input .el-input__inner {
  width: 150px;
  height: 32px;
  line-height: 32px;
  position: absolute;
  left: 0;
  top: 0;
}
.contract {
  font-size: 16px;
  background-color: #f9f9f9;
  .intention_container {
    background-color: #f9f9f9;
    .search-bar {
      > div {
        display: inline-flex;
        align-items: center;
      }
      .el-input,
      .el-input__inner {
        width: 150px;
      }
      .el-select {
        margin-right: 0;
      }
    }
    .contract_search {
      background-color: #fff;
      margin: 20px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      .search-top {
        border-bottom: 1px solid #ecedef;
        padding-bottom: 18px;
        padding-left: 18px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .el-input__icon {
          line-height: 32px;
        }
        .el-input {
          width: 150px;
          height: 32px;
          display: block;
          margin-top: 18px;
        }
        > div {
          display: inline-block;
          &:first-child {
            display: flex;
            flex-wrap: wrap;
          }
        }
        .batchbtn {
          float: right;
          width: 128px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          font-size: 14px;
          color: #6b6b6b;
          background-color: #eaf1fa;
          border-radius: 4px;
          cursor: pointer;
          margin: 18px 30px 0 0px;
          i {
            display: inline-block;
            width: 24px;
            height: 16px;
            background: url(../../../assets/piliangsc.png) no-repeat;
            background-size: contain;
            vertical-align: middle;
          }
        }
      }
      .search-bottom {
        padding-left: 18px;
        padding: 20px 18px 20px;
        dl {
          display: flex;
          font-size: 12px;
          line-height: 18px;
          dt {
            color: #333333;
          }
          dd {
            display: flex;
            color: #666;
            margin-right: 16px;
            span {
              display: block;
              &:first-child {
                margin-right: 5px;
              }
              &:last-child {
                font-size: 18px;
                cursor: pointer;
              }
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
  }
  .addintentionContracts {
    .el-dialog {
      width: 900px !important;
      margin-top: 3vh !important;
    }
    .el-dialog__header {
      margin: 0 0 !important;
      padding: 20px 20px 10px 20px !important;
    }
    .el-dialog__body {
      margin: 0 !important;
      background-color: #f7f7f7;
      border: none;
    }
    .el-table__header {
      border-bottom: none !important;
    }
  }
  .el-dialog__body {
    color: #333;
  }
  .addContracts {
    .el-date-editor {
      width: 100% !important;
    }
  }
  .batch-production {
    .query-wrap {
      display: flex;
      .el-select {
        margin: 18px 0 20px 0;
      }
      .query-btn {
        height: 38px;
        line-height: 38px;
        margin-top: 18px;
        margin-left: 20px;
      }
    }
  }
  .bill-time-wrap {
    display: flex;
    align-items: center;
    > div {
      margin: 20px 10px 20px 0;
    }
  }
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
.paddingLeft {
  animation: cloud-in 0.2s 0s ease-out forwards;
}
.paddingRight {
  animation: cloud-in2 0.2s 0s ease-out forwards;
}

.configure-dialog {
  .el-dialog__header {
    margin: 0 20px !important;
    padding: 20px 0 10px !important;
    border: none !important;
  }
  .el-dialog__body {
    margin: 0 !important;
    background-color: #f7f7f7;
    border: none;
    overflow: hidden;
  }
  .content-wrapper {
    width: 100%;
    margin-bottom: 15px;
    .query-wrap {
      padding: 0 20px;
      display: flex;
      justify-content: flex-start;
      .query-item {
        margin-right: 40px;
        width: 246px;
        &:last-child {
          margin-right: 0;
        }
      }
      .query-item-title {
        margin-bottom: 10px;
      }
      .required {
        color: red;
      }
    }
    .edit {
      color: #3575f6;
      font-size: 12px;
    }
    .save {
      background-color: #2a6ef0;
      color: #fff;
    }
    .add {
      color: #44af69;
      background-color: transparent;
      font-weight: normal;
      &:hover {
        text-decoration: underline;
      }
    }
    .wrapper1 {
      margin-top: 15px;
      background-color: #fff;
    }
  }
  .dr-head {
    background-color: #fff;
    color: #262626;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    font-size: 14px;
    margin-bottom: 10px;
    font-weight: bold;
    border-bottom: 1px solid #f6f6f6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .vertical {
      display: inline-block;
      width: 4px;
      height: 16px;
      background-color: #3575f6;
      border-radius: 2px;
      vertical-align: sub;
      margin-right: 5px;
    }
  }
  .btn {
    display: inline-block;
    padding: 0 10px;
    height: 30px;
    line-height: 28px;
    text-align: center;
    cursor: pointer;
    border-radius: 4px;
    font-weight: normal;
    &.blue {
      color: #4677ee;
    }
    &.grey {
      color: #777777;
    }
    &.red {
      color: #e91515;
    }
  }
}
.tem-dialog {
  .el-dialog__header {
    margin: 0 20px !important;
    padding: 12px 0 10px !important;
    border: none !important;
    font-weight: bold;
  }
  .el-dialog__body {
    margin: 0 !important;
    background-color: #f7f7f7;
    border: none;
    overflow: hidden;
  }
  .dr-head {
    background-color: #fff;
    color: #262626;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    margin-bottom: 10px;
    font-weight: bold;
    border-bottom: 1px solid #f6f6f6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .vertical {
      display: inline-block;
      width: 4px;
      height: 16px;
      background-color: #3575f6;
      border-radius: 2px;
      vertical-align: sub;
      margin-right: 5px;
    }
  }
  .tem-wrap {
    background: #ffffff;
    padding: 0 15px;
    margin: 11px 0;
    .tw-div {
      display: flex;
      align-items: center;
      margin: 16px 0;
      > span {
        width: 100px;
      }
      .tips {
        width: 200px;
        color: red;
        font-size: 12px;
      }
    }
    .enclosure-warp {
      display: flex;
      align-items: center;
      padding-left: 100px;
      margin: 10px 0;
      color: #333333;
      > div {
        margin-left: 20px;
      }
    }
  }
  .keywordCOntent {
    background-color: #f7f8fa;
    margin-top: 10px;
    padding: 15px;
    .copyInput {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      z-index: -10;
    }
    > span.item {
      position: relative;
      border: 1px solid #d7d7d7;
      display: inline-block;
      height: 40px;
      line-height: 40px;
      font-size: 12px;
      text-align: center;
      padding: 0 10px;
      cursor: pointer;
      background-color: #fff;
      margin-right: 15px;
      margin-bottom: 10px;
      color: #262626;
      &:hover {
        i {
          display: inline-block;
        }
      }
      i {
        position: absolute;
        right: -8px;
        top: -20px;
        display: none;
      }
    }
  }
  .keywordCOntent1 {
    > span.item {
      &:hover {
        color: #0066ff;
        border: 1px solid #0066ff;
      }
    }
  }
  .customKeyword {
    margin-top: 20px;
    .title {
      height: 40px;
      line-height: 40px;
      display: flex;
      align-items: center;
      i {
        margin-left: 30px;
        font-size: 30px;
        color: #999;
        cursor: pointer;
      }
    }
    .customKeywordContent {
      padding: 10px 0;
      .newItem {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        width: 350px;
        padding-left: 8px;
        > span {
          font-size: 12px;
          color: #777777;
          &:not(.sep) {
            margin: 0 5px;
          }
          &.sep {
            display: inline-block;
            width: 1px;
            height: 20px;
            background-color: #eeeeee;
          }
        }
        .addKeyword {
          height: 32px;
          line-height: 32px;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
          background-color: #3575f6;
          color: #ffffff;
          width: 45px;
          cursor: pointer;
          text-align: center;
        }
      }
    }
  }
}
</style>
