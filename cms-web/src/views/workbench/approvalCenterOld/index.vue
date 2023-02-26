<template>
  <div :class="[hourseList === 'on' ? 'approvalCenter paddingLeft' : 'approvalCenter', hourseList === 'off' ? 'approvalCenter paddingRight' : 'approvalCenter']">
    <p class="page_head_title">审批中心</p>
    <div class="hourse_container">
      <!-- <div class="hourse_search">
        <div class="search-top clearing">
          <el-input v-model="contractName"
                    placeholder="合同编号/合同名称"></el-input>
          <div @click="search"
               class="query-btn">查询</div>
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
      </div> -->
      <div class="hourse_tab1 tab_block_wrap">
        <ul class="default_tab_block">
          <li @click="changeNav(index)"
              v-for="(item, index) in navList"
              :key="index"
              :class="item.value ? 'active' : ''">{{item.label}}
            <span class="newsSpot"
                  v-if="NumData.processTaskNumber !== 0 && item.label === '待审批' ">
              {{NumData.processTaskNumber}}
            </span>
            <span class="newsSpot"
                  v-if="NumData.processCcTaskNumber !== 0 && item.label === '抄送我的'">
              {{NumData.processCcTaskNumber}}
            </span>
          </li>
        </ul>
        <div>
          <div class="addbtn addApproval">
            <router-link :to="{ name: 'provisionalApproval', params: { onRent: onRent } }">
              <i class="fa fbxp"
                 aria-hidden="true"></i>发起非标审批
            </router-link>
          </div>
        </div>
      </div>
      <div class="plc-search search-bar"
           v-if="this.onRent===0">
        <div>
          <el-select v-model="projectManagementId"
                     clearable
                     placeholder="项目简称"
                     size="small">
            <el-option v-for="item in options1"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="approvalType"
                     style="width:200px"
                     clearable
                     placeholder="审批类型">
            <el-option v-for="item in approvalTypeOptions"
                       :key="item.id"
                       :label="item.value"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-input placeholder="审批流程名称"
                    v-model="approvalProcessName"
                    size="small"
                    style="width:200px"></el-input>
          <div class="query-btn"
               @click="AppCurrentSel">查询</div>
        </div>
      </div>
      <div class="plc-search search-bar"
           v-if="this.onRent!==0">
        <div>
          <el-select v-model="projectManagementId"
                     clearable
                     placeholder="项目简称"
                     size="small">
            <el-option v-for="item in options1"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-input :placeholder="this.onRent===1?'审批标题/品牌':'审批标题/品牌/发起人'"
                    v-model="title"
                    size="small"
                    style="width:200px"></el-input>
          <div class="query-btn"
               @click="currentSel">查询</div>
        </div>
      </div>
      <div class="hourse-table"
           v-if="newApproval">
        <div class="table">
          <el-table :data="newApprovalTableData"
                    :key="0"
                    style="width: 100%"
                    @sort-change="sortChange">
            <el-table-column prop="typeCn"
                             label="审批类型"
                             align="center"
                             sortable='custom'></el-table-column>
            <el-table-column prop="projectManagementName"
                             label="项目"
                             align="center"
                             sortable='custom'></el-table-column>
            <el-table-column prop="name"
                             label="审批流程名称"
                             align="center"></el-table-column>
            <!-- <el-table-column label="状态" :formatter="formatApprovalStatus" align="center"></el-table-column> -->
            <el-table-column label="操作"
                             align="center">
              <template slot-scope="scope">
                <el-button @click="launchApproval(scope.$index, scope.row)"
                           class="operation-btn"
                           size="mini">
                  <span>发起审批</span>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="ctc-foot1"
             v-if="newApprovalTableData.length > 0">
          <span><span style="margin-right:10px">{{newApager.currentPage}}/{{Math.ceil(newApager.total/newApager.pgSize)}}页</span> 共{{newApager.total}}条记录</span>
          <el-pagination v-if="newApager.total > 0"
                         background
                         layout="prev, pager, next"
                         :page-size="newApager.pgSize"
                         :total="newApager.total"
                         :current-page.sync="newApager.currentPage"
                         @current-change="current_change">
          </el-pagination>
          <div class="pagingnum">
            显示 <select v-model="newApager.pgSize"
                    @change="pgSizeSelectFn">
              <option v-for="item in newApager.pgNumoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </option>
            </select>
            条目
          </div>
        </div>
      </div>
      <div class="hourse-table"
           v-else>
        <div class="table" style="min-height: 80px;" v-loading="!tableDataEle">
          <el-table :data="tableData"
                    v-if="tableDataEle"
                    :key="1"
                    style="width: 100%">
            <el-table-column label="审批编号"
                             align="center">
              <template slot-scope="scope">
                <span class="readOnly"
                      :class="{ noRead: String(scope.row.onRead) ==='false'}"></span>
                <span>{{scope.row.processTaskVersion}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="projectReffer"
                             label="项目"
                             align="center"></el-table-column>
            <el-table-column prop="processDefineName"
                             label="审批流程名称"
                             align="center"></el-table-column>
            <el-table-column prop="content"
                             label="审批标题/品牌"
                             align="center"></el-table-column>
            <el-table-column v-if="this.onRent===2||this.onRent===3||this.onRent===4"
                             prop="startUser"
                             label="发起人"
                             align="center"></el-table-column>
            <!-- <el-table-column prop="user"  label="当前操作人" align="center"></el-table-column> -->
            <el-table-column label="发起时间"
                             :formatter="formatterTime"
                             align="center"></el-table-column>
            <el-table-column v-if="this.onRent!=2" label="最近跟进记录"
                             prop="followContent"
                             align="center"></el-table-column>
            <el-table-column label="状态"
                             :formatter="formatStatus"
                             align="center"></el-table-column>
            <el-table-column label="操作"
                             align="center">
              <template slot-scope="scope">
                <el-button @click="handleEdit(scope.$index, scope.row)"
                           class="el-button--primary operation-btn"
                           size="mini">
                  <!-- <span v-if="(scope.row.type === 'CONTRACT_SIGN' || scope.row.type === 'CONTRACT_RELET') && scope.row.status === 'REJECT' && !finshed">修改</span> -->
                  <span>查看</span>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="ctc-foot1"
             v-if="tableData.length > 0">
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
    <el-dialog title="合同审批"
               :visible.sync="approvalDialogVisible"
               :close-on-click-modal="false"
               class="approvalDialog">
      <!-- :closed="approvalDialogClose"> -->
      <contractApproval :detailsData="detailsData"
                        :processInstanceInfo="processInstanceInfo"
                        :approvalOperation="approvalOperation"
                        :newlystep1="true"
                        :newlystep2="false"
                        :newlystep3="false"
                        :newlystep4="false"
                        :contractInfo="contractInfo"
                        :billList="billList"
                        :contractStatus="contractStatus"
                        :finshed="finshed"
                        :taskId="taskId" />
      <!-- @approvalDialogClose="approvalDialogClose" /> -->
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
import contractApproval from './components/contractApproval'
import projectSidebar from '@/components/projectSidebar'
let changeNavFlag = false
export default {
  name: 'approvalCenter',
  components: {
    contractApproval,
    projectSidebar
  },
  data () {
    return {
      options1: [],
      tableDataEle: true,
      approvalTypeOptions: [],
      projectManagementId: '',
      title: '',
      navList: [{ label: '新建审批', value: false }, { label: '我发起的', value: false }, { label: '待审批', value: true }, { label: '已处理', value: false }, { label: '抄送我的', value: false }],
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
      newApager: {
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
      sort: 'id,desc',
      tableData: [],
      newApprovalTableData: [],
      contractStatus: '',
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
      addDataRules: {
        floor: [
          { required: true, message: '请选择楼层', trigger: 'change' }
        ],
        shopNumber: [
          { required: true, message: '请输入房源号', trigger: 'blur' }
        ],
        industry: [
          { required: true, message: '请选择预期业态', trigger: 'change' }
        ],
        buildingArea: [
          { required: true, message: '请输入建筑面积', trigger: 'blur' }
        ],
        expectedUnitPrice: [
          { required: true, message: '请输入预期单价', trigger: 'blur' }
        ]
      },
      fieldsList: [],
      formLabelWidth: '120px',
      hourseVisible: false,
      selProject: false,
      selHourse: false,
      hourseList: '',
      detailsShow: false,
      approvalDialogVisible: false,
      detailsData: [
        {}
      ],
      projectList: [],
      hourList: [],
      decorate: '',
      buildingList: [],
      statisicsData: {},
      queryShopNumber: '',
      queryShopNumber_: '',
      projectArr: [],
      buildsList: [],
      contractName: '',
      onRent: 2,
      processInstanceInfo: {},
      approvalOperation: false, // 判断流程是否可以处理(有处理按钮)
      contractInfo: {
        tenant: '',
        projectManagement: {
          previewImage: ''
        }
      },
      billList: [{}],
      finshed: false,
      taskId: '',
      newApproval: false,
      NumData: { processTaskNumber: 0, processCcTaskNumber: 0 },
      processDefineName: null,
      contractNo: null,
      approvalType: '',
      approvalProcessName: '',
      brandTitle: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'workbench') {
      localStorage.removeItem('newApprovalPmId')
      localStorage.removeItem('newApprovalApprovalType')
      localStorage.removeItem('newApprovalPcName')
      localStorage.removeItem('newApprovalTitle')
    }
    if (from.name === 'launchApproval' || from.name === 'provisionalApproval') {
      changeNavFlag = true
    }
    next()
  },
  created () {
    if (sessionStorage.getItem('approvalCenterPage')) {
      this.pager = JSON.parse(sessionStorage.getItem('approvalCenterPage'))
      this.$set(this.pager)
      sessionStorage.removeItem('approvalCenterPage')
    }
    this.options1 = this.$store.state.projectManagementsList
    this.getApprovalType()
    this.queryNum()
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    setQueryCriteria () {
      this.projectManagementId = Number(localStorage.getItem('newApprovalPmId')) || ''
      this.approvalType = Number(localStorage.getItem('newApprovalApprovalType')) || ''
      this.approvalProcessName = localStorage.getItem('newApprovalPcName') || ''
      this.title = localStorage.getItem('newApprovalTitle') || ''
    },
    queryNum () {
      context.http.get('/cms/api/staging').then(res => {
        this.NumData = res.data
      })
    },
    formatterTime (row, column) {
      if (row.time) {
        return row.time.substring(0, 10)
      }
    },
    changeNav (inx) {
      if (!changeNavFlag) return
      this.navList.forEach(item => {
        item.value = false
      })
      this.navList[inx].value = true
      this.onRent = inx
      if (inx === 0) {
        this.newApproval = true
        // this.onRent = false
      } else if (inx === 1) {
        // this.onRent = true
        this.newApproval = false
      } else {
        // this.onRent = null
        this.newApproval = false
      }
      this.pager.currentPage = 1
      this.newApager.currentPage = 1
      this.query()
      // this.query()
    },
    pgSizeSelectFn () { // 切换显示条数
      this.pager.currentPage = 1
      this.newApager.currentPage = 1
      this.query()
    },
    search () {
      this.pager.currentPage = 1
      this.queryShopNumber_ = this.queryShopNumber
      this.query()
    },
    detailsClose () {
      this.detailsShow = false
    },
    handleEdit (index, row) {
      context.http.get(`/cms/api/process-instances/${row.id}`).then(result => { // 请求合同号和流程名称
        this.processDefineName = result.data.processDefineName
        this.contractNo = result.data.contractNo
        this.brandTitle = result.data.title
        // 存数据
        sessionStorage.setItem('approvalCenterPage', JSON.stringify(this.pager))
        if (row.typeCN === '合同新增' || row.typeCN === '合同签订' || row.typeCN === '合同续签') { // 合同签订 or 合同续签
          if (row.ccTaskId) {
            context.http.get(`/cms/api/process-cctask/now/${row.ccTaskId}`).then(res => { // 请求流程图
              this.detailsData = res.data
              this.processInstanceInfo = row
              this.queryContractInfo(row)
              this.contractStatus = row.processDetailType
              this.taskId = row.taskId // taskId 任务id  用于提交任务（审核通过、驳回 重新发起等）
              // test
            })
          } else {
            context.http.get('/cms/api/process-task-versions/now/' + row.id).then(res => { // 请求流程图
              this.detailsData = res.data
              this.processInstanceInfo = row
              this.queryContractInfo(row)
              this.contractStatus = row.processDetailType
              this.taskId = row.taskId // taskId 任务id  用于提交任务（审核通过、驳回 重新发起等）
              // test
            })
          }
        } else if (row.typeCN === '合同退租') { // 合同退租
          this.$router.push({ name: 'contractTenancy', params: { row: row, approvalOperation: this.approvalOperation, finshed: this.finshed, taskId: this.taskId, processDefineName: this.processDefineName, contractNo: this.contractNo, onRent: this.onRent, brandTitle: this.brandTitle } })
        } else if (row.typeCN === '减免') { // 减免
          this.$router.push({ name: 'derate', params: { row: row, approvalOperation: this.approvalOperation, finshed: this.finshed, taskId: this.taskId, processDefineName: this.processDefineName, contractNo: this.contractNo, onRent: this.onRent } })
        } else if ((row.processApproval === 'REJECT' || row.processApproval === 'WITHDRAW') && row.processDetailType === 'START') { // 通用审批再次发起
          this.$router.push({ name: 'relaunch', params: { row: row, approvalOperation: this.approvalOperation, finshed: this.finshed, taskId: this.taskId, processDefineName: this.processDefineName, contractNo: this.contractNo, onRent: this.onRent, brandTitle: this.brandTitle } })
        } else { // 通用审批
          this.$router.push({ name: 'customApproval', params: { row: row, approvalOperation: this.approvalOperation, finshed: this.finshed, taskId: this.taskId, processDefineName: this.processDefineName, contractNo: this.contractNo, onRent: this.onRent, brandTitle: this.brandTitle } })
        }
      })
    },
    launchApproval (index, row) {
      console.log(this.onRent)
      let appSearchInfo = {
        currentPage: this.pager.currentPage,
        pgSize: this.pager.pgSize,
        sort: this.sort,
        approvalProcessName: this.approvalProcessName,
        projectManagementId: this.projectManagementId,
        approvalType: this.approvalType
      }
      console.log(appSearchInfo)
      sessionStorage.setItem('appSearchInfo', JSON.stringify(appSearchInfo))
      this.$router.push({ name: 'launchApproval', params: { row: row, onRent: this.onRent } })
    },
    queryContractInfo (row) {
      context.http.get('/cms/api/contracts/' + this.processInstanceInfo.businessId).then(res => { // businessId业务合同详情id 用于请求合同详情
        this.contractInfo = res.data
        // this.queryBill(row)
        this.$router.push({
          name: 'approverCenterDetails',
          params: {
            row: row,
            detailsData: this.detailsData,
            processInstanceInfo: this.processInstanceInfo,
            approvalOperation: this.approvalOperation,
            contractInfo: this.contractInfo,
            billList: this.billList,
            contractStatus: this.contractStatus,
            finshed: this.finshed,
            taskId: this.taskId,
            processDefineName: this.processDefineName,
            contractNo: this.contractNo,
            onRent: this.onRent,
            brandTitle: this.brandTitle
          }
        })
      })
    },
    async queryApproval () {
      if (sessionStorage.getItem('appSearchInfo')) {
        let appSearchInfo = JSON.parse(sessionStorage.getItem('appSearchInfo'))
        this.newApager.currentPage = appSearchInfo.currentPage
        this.newApager.pgSize = appSearchInfo.pgSize
        this.sort = appSearchInfo.sort
        this.approvalProcessName = appSearchInfo.approvalProcessName
        this.projectManagementId = appSearchInfo.projectManagementId
        this.approvalType = appSearchInfo.approvalType
        sessionStorage.removeItem('appSearchInfo')
      }
      let result = await context.http.get('/cms/api/process-defines'
        , {
          page: (this.newApager.currentPage - 1),
          size: this.newApager.pgSize,
          sort: this.sort,
          useStatus: 'USING',
          flag: true,
          name: this.approvalProcessName,
          projectId: this.projectManagementId,
          processType: this.approvalType
        })
      this.newApprovalTableData = result.data
      this.newApager.total = Number(result.headers['x-total-count'])
    },
    queryBill (row) {
      context.http.get(`/cms/api/bills/business/approve/${this.contractInfo.id}?businessType=`).then(res => {
        this.billList = res.data
        this.$router.push({
          name: 'approverCenterDetails',
          params: {
            row: row,
            detailsData: this.detailsData,
            processInstanceInfo: this.processInstanceInfo,
            approvalOperation: this.approvalOperation,
            contractInfo: this.contractInfo,
            billList: this.billList,
            contractStatus: this.contractStatus,
            finshed: this.finshed,
            taskId: this.taskId,
            processDefineName: this.processDefineName,
            contractNo: this.contractNo,
            onRent: this.onRent,
            brandTitle: this.brandTitle
          }
        })
      })
    },
    current_change (currentPage) {
      this.pager.currentPage = currentPage
      this.newApager.currentPage = currentPage
      this.query()
    },
    currentSel () {
      this.pager.currentPage = 1
      this.newApager.currentPage = 1
      this.query()

      localStorage.setItem('newApprovalPmId', this.projectManagementId)
      localStorage.setItem('newApprovalTitle', this.title)
    },
    AppCurrentSel () {
      this.pager.currentPage = 1
      this.newApager.currentPage = 1
      this.queryApproval()

      localStorage.setItem('newApprovalPmId', this.projectManagementId)
      localStorage.setItem('newApprovalApprovalType', this.approvalType)
      localStorage.setItem('newApprovalPcName', this.approvalProcessName)
    },
    deleBuild (index) {
      this.$refs.projectSidebar.deleBuild(index)
    },
    async queryTaskStarterOfSelf () {
      this.finshed = false
      let user = JSON.parse(sessionStorage.getItem('user'))
      context.http.get('/cms/api/process-instance?' + typeArr, { startedBy: user.id, contractName: this.contractName, page: (this.pager.currentPage - 1), size: this.pager.pgSize, sort: 'desc' }).then(res => {
        if (res.status === 200) {
          this.tableData = res.data
          this.pager.total = Number(res.headers['x-total-count'])
        }
      })
    },
    async queryTask (finshed) {
      this.finshed = finshed
      context.http.get('/cms/api/process-task?' + typeArr, { contractName: this.contractName, finshed: finshed, page: (this.pager.currentPage - 1), size: this.pager.pgSize, sort: 'desc' }).then(res => {
        if (res.status === 200) {
          this.tableData = res.data
          this.pager.total = Number(res.headers['x-total-count'])
        }
      })
    },
    async getProcessList (url, type) { // 请求列表封装
      this.tableData = []
      this.tableDataEle = false
      this.pager.total = 0
      let sort = '?sort=lastModifiedDate,desc&sort=id,desc'
      if (type === 'cc') {
        sort = '?sort=createdDate,desc&sort=id,desc'
      }
      let result = await context.http.get(`/cms/api/${url}` + sort, { page: (this.pager.currentPage - 1), size: this.pager.pgSize, title: this.title, projectManagementId: this.projectManagementId })
      if (result.status === 200) {
        this.tableData = result.data
        this.tableDataEle = true
        this.pager.total = Number(result.headers['x-total-count'])
        changeNavFlag = true
      }
    },
    async query () {
      if (this.onRent === 0) {
        this.queryApproval()
      } else if (this.onRent === 1) {
        // this.queryTaskStarterOfSelf()
        this.finshed = true
        this.getProcessList('process-instances/myStart') // 我发起的
        this.approvalOperation = false // approvalOperation 是否出现操作按钮  待处理菜单才出现按钮
      } else if (this.onRent === 2) {
        // this.queryTask(false)
        this.finshed = false
        this.getProcessList('process-tasks/undeal') // 待处理
        this.approvalOperation = true
      } else if (this.onRent === 3) {
        // this.queryTask(true)
        this.finshed = true
        this.getProcessList('process-tasks/deal') // 已处理
        this.approvalOperation = false
      } else if (this.onRent === 4) {
        this.finshed = true
        this.getProcessList('process-tasks/cc', 'cc') // 抄送我的
        this.approvalOperation = false
      }
    },
    formatStatus (row, column) {
      switch (this.onRent) {
        case 1:
          if (row.processStatus === 'RUNING') {
            return '审核中'
          } else if (row.processStatus === 'REJECT') {
            return '已驳回'
          } else if (row.processStatus === 'CLOSED') {
            return '已关闭'
          } else if (row.processStatus === 'FINISHED') {
            return '已通过'
          }
          break
        case 2:
          if (!row.processApproval) {
            return '待处理'
          } else if (row.processApproval === 'REJECT') {
            return '已驳回'
          } else if (row.processApproval === 'WITHDRAW') {
            return '已撤回'
          }
          break
        case 3:
          if (row.processApproval === 'AGREED') {
            return '已通过'
          } else if (row.processApproval === 'REJECT') {
            return '已驳回'
          } else if (row.processApproval === 'CLOSE') {
            return '已关闭'
          } else if (row.processApproval === 'AUTO') {
            return '自动处理'
          } else if (row.processApproval === 'REPOST') {
            return '已提交'
          } else if (row.processApproval === 'WITHDRAW') {
            return '已撤回'
          }
          break
        case 4:
          if (!row.processStatus) {
            return '审核中'
          } else if (row.processStatus === 'REJECT') {
            return '已驳回'
          } else if (row.processStatus === 'CLOSED') {
            return '已关闭'
          } else if (row.processStatus === 'AGREED') {
            return '已通过'
          }
      }
    },
    formatApprovalStatus (row, column) {
      let res = ''
      if (row.useStatus === 'USING') {
        res = '使用中'
      } else {
        res = '已停用'
      }
      return res
    },
    formatProcessType (row, column) {
      switch (row.processType) {
        case 'CONTRACT_SIGN':
          return '合同签订'
        case 'CONTRACT_RELET':
          return '合同续签'
        case 'CONSTRACT_RELEASE':
          return '合同退租'
        case 'DERATE':
          return '减免'
      }
    },
    // approvalDialogClose () {
    //   this.query()
    //   this.approvalDialogVisible = false
    // },
    setpdleft (val) {
      this.hourseList = val
    },
    sortChange (column, prop, order) {
      if (column.prop === 'projectManagementName') {
        if (this.sort !== 'projectManagementId,desc') {
          this.sort = 'projectManagementId,desc'
        } else {
          this.sort = 'id,desc'
        }
      } else {
        if (this.sort !== 'processType,desc') {
          this.sort = 'processType,desc'
        } else {
          this.sort = 'id,desc'
        }
      }
      this.query()
    },
    async getApprovalType () {
      // let result = await context.http.get('uaa/api/paramet-managements/name?name=审批类型')
      let result = await context.http.get('cms/api/process-defines/processType?flag=true')
      this.approvalTypeOptions = result.data
    }
  },
  mounted () {
    console.log(this.$route.params.onRent)
    if (this.$route.params.onRent !== undefined) {
      if (Number(this.$route.params.onRent) === 0) this.newApproval = true
      this.onRent = Number(this.$route.params.onRent)
      console.log(this.onRent)
      this.navList.forEach(item => {
        item.value = false
      })
      this.navList[this.onRent].value = true
    }
    this.setQueryCriteria()
    this.query()
    this.queryNum()
  }
}
</script>
<style lang="scss">
@import "../../../style/config";
ul,
li {
  list-style: none;
}
.hourse_search .el-input .el-input__inner {
  width: 180px;
  height: 32px;
  line-height: 32px;
  position: absolute;
  left: 0;
  top: 0;
}
.approvalCenter {
  background-color: #f9f9f9;
  .hourse_container {
    background-color: #f9f9f9;
    .plc-search {
      padding-left: 20px;
      padding-right: 20px;
      box-shadow: 1px 2px 5px #eee;
      justify-content: space-between;
      align-items: center;
      position: relative;
      > div {
        > div {
        }
      }
      .query-btn {
        display: inline-block;
      }
    }
    .hourse_search {
      background-color: #fff;
      margin: 20px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      .search-top {
        border-bottom: 1px solid #ecedef;
        padding-bottom: 18px;
        padding-left: 18px;
        .el-input {
          width: 180px;
          height: 32px;
          display: block;
          margin-top: 18px;
        }
        div {
          float: left;
          display: inline-block;
        }
        div {
          cursor: pointer;
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
    .hourse_tab1 {
      .newsSpot {
        display: inline-block;
        min-width: 16px;
        width: auto;
        height: 16px;
        line-height: 16px;
        text-align: center;
        border-radius: 50%;
        background-color: red;
        color: #fff;
        font-size: 12px;
      }
      .addApproval {
        width: 130px;
        height: 34px;
        background-color: #fff;
        color: #44af69;
        border: 1px solid #44af69;
        margin: 0;
        .fbxp {
          display: inline-block;
          width: 20px;
          height: 20px;
          background: url(../../../assets/fbsp1.png) no-repeat;
          background-size: contain;
        }
      }
      .active {
        color: #3575f6;
        font-weight: 600;
      }
    }
    .hourse-table {
      background-color: #fff;
      margin: 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      .readOnly {
        display: inline-block;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        margin-right: 10px;
        &.noRead {
          background-color: #f00f00;
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
  }
  .addHourse {
    .el-dialog {
      width: 1000px;
      margin-top: 8vh !important;
    }
    .basicInfo {
      border: 1px solid #f1f1f1;
      margin: 15px 0;
      h5 {
        height: 40px;
        background: #fafafa;
        line-height: 40px;
        padding: 0 15px;
        font-size: 14px;
        color: #666666;
      }
      .basic-content {
        display: flex;
        justify-content: space-between;
        padding: 15px;
        .basic-item {
          width: 46%;
          p {
            font-size: 14px;
            color: #333;
            line-height: 14px;
            margin-bottom: 15px;
          }
          .basic-select {
            position: relative;
            cursor: pointer;
            .selectInput {
              height: 110px;
              border: 1px solid #e7e7e7;
              border-radius: 5px;
              padding: 0 15px;
              &.selectActive {
                border: 1px solid #6473cb;
              }
              img {
                float: left;
                display: block;
                width: 150px;
                height: 80px;
                margin-right: 10px;
                margin-top: 15px;
              }
              span {
                float: left;
                color: #666666;
                display: block;
                line-height: 110px;
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
                }
              }
            }
            .selectBox {
              width: 100%;
              border: 1px solid #e7e7e7;
              border-radius: 3px;
              background: #fff;
              position: absolute;
              left: 0;
              top: 115px;
              z-index: 9;
              padding: 15px 0px;
              box-shadow: 1px 2px 5px #ddd;
              height: 210px;
              overflow-y: auto;
              li {
                border-bottom: 1px solid #e7e7e7;
                padding: 10px 15px;
                display: flex;
                &:hover {
                  background: #eee;
                }
                img {
                  display: block;
                  width: 50px;
                  height: 21.3px;
                  margin-right: 20px;
                }
                span {
                  display: block;
                  line-height: 20px;
                  font-size: 14px;
                }
              }
            }
          }
        }
      }
    }
    .associatedInfo {
      border: 1px solid #f1f1f1;
      margin: 15px 0;
      h5 {
        height: 40px;
        background: #fafafa;
        line-height: 40px;
        padding: 0 15px;
        font-size: 14px;
        color: #666666;
      }
      .form {
        padding: 10px 0px 10px 15px;
        .el-form-item {
          width: 265px;
          margin-right: 30px;
          margin-bottom: 10px;
          display: inline-block;
          &:nth-child(4),
          &:nth-child(5),
          &:nth-child(6),
          &:nth-child(7) {
            width: 415px;
          }
          &:nth-child(8) {
            width: 865px;
          }
          .el-form-item__content {
            line-height: 30px;
          }
          .el-select {
            width: 100%;
          }
          .form-box {
            display: flex;
            justify-content: space-between;
            .el-input {
              width: 300px;
            }
            .el-select {
              width: 100px;
              .el-input {
                width: 100px;
              }
            }
          }
        }
        .addLabel {
          border: 1px solid #dcdfe6;
          padding: 10px;
          border-radius: 4px;
          input {
            width: 100px;
            height: 25px;
            display: block;
            float: left;
          }
          p {
            float: left;
            margin-right: 15px;
            margin-bottom: 20px;
            height: 25px;
            padding: 0 0px 0 6px;
            background: #3577f6;
            color: #fff;
            line-height: 25px;
            display: flex;
            border-radius: 4px;
            span {
              display: block;
              font-size: 12px;
              &:last-child {
                width: 25px;
                height: 25px;
                text-align: center;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
  .caret-wrapper {
    margin-left: 5px;
    display: inline-block;
    width: 19px !important;
    height: 15px !important;
    background-image: url(../../../assets/sortIcon.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .sort-caret.ascending {
      border-bottom-color: transparent !important;
      border-top-color: transparent !important;
    }
    .sort-caret.descending {
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
    }
    .el-icon-arrow-down {
      display: inline-block;
      width: 19px;
      height: 15px;
      background-image: url(../../../assets/sortIcon.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
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
.approvalDialog {
  .el-dialog {
    width: 1000px !important;
  }
}
</style>
