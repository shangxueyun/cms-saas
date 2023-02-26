<template>
  <div class="contracts-info contracts-detailsss">
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="mainlayout"
           style="width: 1000px;"
           slot="drawer">
        <div class="main-content">
          <div class="addIntentionContracts">
            <div class="head-right">
              <span @click="contractBill()">
                <span class="iconfont icon-dingdan"></span>
                合同账单
              </span>
              <span @click="showRemarks=true;showEnclosure=false">
                <span class="iconfont icon-post"></span>
                备注</span>
              <span @click="showEnclosure=true;showRemarks=false">
                <span class="iconfont icon-attachment"></span>
                附件</span>
            </div>
            <div class="dl-head info_tab">
              <ul class="nav">
                <li @click="changeNav(index)"
                    v-for="(item, index) in navList"
                    :key="index"
                    :class="item.value ? 'select_active' : ''">{{item.label}}</li>
              </ul>
            </div>
            <div class="dl-content clearfix">
              <el-form :model="detailData"
                       ref="detailData"
                       :rules="detailDataRules">
                <div class="step1"
                     v-if="essentialInformation">
                  <div class="dc-left float-left">
                    <div class="dr-head"
                         style="text-align: left">多经点位</div>
                    <div class="basic-select">
                      <div class="clearfix selectInput condetail"
                           style="border: none;height: 40px;">
                        <img v-if="detailData.projectManagement"
                             :src="detailData.projectManagement.previewImage" />
                        <span v-if="detailData.projectManagement"
                              :title="detailData.projectManagement.referred">{{detailData.projectManagement.referred}}</span>
                      </div>
                      <div class="bd-number">
                        <span>编号</span>
                        <span>点位名称</span>
                        <span>点位类型</span>
                      </div>
                      <div class="layer"
                           v-for="(item, index) in detailData.managementPoints"
                           :key="index">
                        <div>
                          <span :title="item.pointCode">{{item.pointCode}}</span>
                          <span class="showTitle"
                                :title="item.pointName">{{item.pointName}}</span>
                          <span :title="item.pointTypeName">{{item.pointTypeName}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="dc-right float-right conDetail">
                    <div class="dr-head">合同信息</div>
                    <el-form-item :label-width="formLabelWidth"
                                  prop="yxContractNo">
                      <div class="cttitle">租赁方式</div>
                      <span>{{formatRentalMethod(detailData.rentalMethod)}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">合同编号<i class="required">*</i></div>
                      <span>{{detailData.contractNo}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">合同状态</div>
                      <span>{{formatterStatus(detailData.contractStatus)}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;margin-right:0">
                      <div class="cttitle">合同开始时间<i class="required">*</i></div>
                      <span>{{detailData.startDate}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  prop="area"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">合同结束时间<i class="required">*</i></div>
                      <span>{{detailData.endDate}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  prop="iDNumber">
                      <div class="cttitle">合同签订时间<i class="required">*</i></div>
                      <span>{{detailData.signtDate}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">多经用途</div>
                      <span>{{detailData.purpose}}</span>
                    </el-form-item>
                  </div>
                  <div class="dc-right float-right tenantinfo conDetail">
                    <div class="dr-head">客户信息</div>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">客户名称</div>
                      <span v-if="detailData.tenant">{{detailData.tenant.teantName}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">品牌</div>
                      <span v-if="detailData.tenant">{{detailData.tenant.referred}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">法人</div>
                      <span v-if="detailData.tenant">{{detailData.tenant.operName}}</span>
                    </el-form-item>
                    <el-form-item style="margin-right:0"
                                  :label-width="formLabelWidth">
                      <div class="cttitle">行业</div>
                      <span v-if="detailData.tenant">{{detailData.tenant.industry}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">签订人</div>
                      <span v-if="detailData.signer">{{detailData.signer}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">签订人联系方式</div>
                      <span v-if="detailData.signerPhone">{{detailData.signerPhone}}</span>
                    </el-form-item>
                  </div>
                </div>
                <div class="step2 dl-content clearfix"
                     v-else>
                  <div class="dc-right float-right">
                    <div class="dr-head">已选中点位</div>
                    <div class="selected-housing"
                         v-for="(item, index) in detailData.managementPoints"
                         :key="index">
                      <span>{{item.projectName}}</span>
                      <span>{{item.pointCode}}</span>
                      <span>{{item.pointName}}</span>
                      <span>{{item.pointTypeName}}</span>
                    </div>
                  </div>
                  <div class="dc-right float-right">
                    <div class="dr-head contract-rules clearfix">租赁条款
                    </div>
                    <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">开始时间<i class="required">*</i></div>
                      <span v-if="detailData.rentClauses.length > 0">{{detailData.rentClauses[0].startDate}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;margin-right: 0">
                      <div class="cttitle">结束时间<i class="required">*</i></div>
                      <span v-if="detailData.rentClauses.length > 0">{{detailData.rentClauses[0].endDate}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">保证金金额</div>
                      <span v-if="detailData.rentClauses.length > 0">{{detailData.rentClauses[0].deposit}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;margin-right:0">
                      <div class="cttitle">付款周期<i class="required">*</i></div>
                      <span v-if="detailData.rentClauses.length > 0">{{detailData.rentClauses[0].onPayClear ? '一次性付清' : detailData.rentClauses[0].month + '个月'}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  v-if="detailData.rentClauses.length > 0 && detailData.rentClauses[0].onPayClear"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">租赁金额<i class="required">*</i></div>
                      <span v-if="detailData.rentClauses.length > 0">{{detailData.rentClauses[0].price}} 元</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  v-else
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">租赁单价/月<i class="required">*</i></div>
                      <span v-if="detailData.rentClauses.length > 0">{{detailData.rentClauses[0].price}} 元</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  v-if="detailData.rentClauses.length > 0 && !detailData.rentClauses[0].onPayClear">
                      <div class="cttitle">周期金额</div>
                      <span v-if="detailData.rentClauses.length > 0">{{detailData.rentClauses[0].price * detailData.rentClauses[0].month }} 元</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                      <!-- <div class="cttitle">提前付款时间<i class="required">*</i></div> -->
                      <!-- <span v-if="detailData.rentClauses.length > 0">{{detailData.rentClauses[0].dayNumber}} 自然日</span> -->
                      <div class="cttitle">账单应收日期<i class="required">*</i></div>
                      <span v-if="detailData.rentClauses.length > 0 && detailData.rentClauses[0].dayType==='FIXED'"> 固定{{detailData.rentClauses[0].dayNumber}}日</span>
                      <span v-if="detailData.rentClauses.length > 0 && detailData.rentClauses[0].dayType==='TOP'"> 提前{{detailData.rentClauses[0].dayNumber}}天</span>
                    </el-form-item>
                  </div>
                </div>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer"
           style="margin-right: 38px;">
        <el-button type="primary"
                   v-if="hasAuthority('02020505')"
                   @click="onHide"
                   class="close-button">关闭</el-button>
        <el-button type="primary"
                   class="close-button"
                   v-if="detailData.contractStatus !== 'WITHDRAWAL' && hasAuthority('02030514')"
                   @click="contractWithdrawal('add')">合同退租</el-button>
        <!-- v-if="hasAuthority('02020504') && (detailData.contractStatus === 'PENDING' || detailData.contractStatus === 'MATURITY' || detailData.contractStatus === 'EXECUTING')" -->
      </div>
    </drawer>
    <div class="contracts-remarks"
         v-show="showRemarks">
      <div class="rektitle">备注
        <span @click="showRemarks=false">关闭</span>
      </div>
      <el-input v-if="hasAuthority('02030512')"
                type="textarea"
                :rows="4"
                resize="none"
                v-model="remarkContent"
                placeholder="请输入内容">
      </el-input>
      <div class="operation"
           v-if="hasAuthority('02030512')">
        <span @click="addRemarks">确定</span>
      </div>
      <div class="remarks-list">
        <div class="remarks-item">
          <div>备注记录：</div>
          <div v-for="(item, index) in detailData.remark"
               :key="index">
            <span style="width: 100%;text-align: left">{{item.content}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="contracts-enclosure"
         v-show="showEnclosure">
      <div class="rektitle">附件管理
        <span @click="showEnclosure=false">关闭</span>
      </div>
      <div class="upload"
           v-if="hasAuthority('02030512')">
        <span>
          <i class="icon icon-adds"></i>
          <p style="line-height: 0;position: relative;top: -28px;">上传文件</p>
        </span>
        <!-- <input type="file" style="top: 0" @change="imageChange('addapp', $event)"> -->
        <aliUpload class="aliUpload"
                   :upLoadText="upLoadText"
                   :fileType="fileType"
                   :iconShow="false"
                   @setAnnex="setAnnex" />
      </div>
      <div class="enclosure-list"
           v-for="(item, index) in enclosureList"
           :key="index">
        <div class="el-item clearfix">
          <span>{{item.annexName}}</span>
          <span v-if="item.annexName"
                style="float: right;display:flex;">
            <aliDownLoad :item="item" />
            <!-- <i @click="downloadFile(item, index)" class="iconfont icon-xiazaidaoru" style="margin-right: 10px;"></i> -->
            <i @click="deleFile(item, index)"
               class="iconfont icon-lajixiang"
               style="margin-left:10px"></i>
          </span>
        </div>
      </div>
      <div class="operation"
           v-if="hasAuthority('02030512')">
        <span @click="addAnnexes">确定</span>
      </div>
      <div class="enclosure-list"
           v-for="(item, index) in detailData.annexes"
           :key="item.id">
        <div class="el-item clearfix">
          <span>{{item.annexName}}</span>
          <span v-if="item.annexName"
                style="float: right;display:flex;">
            <aliDownLoad :item="item" />
            <!-- <i @click="downloadFile(item, index)" class="iconfont icon-xiazaidaoru" style="margin-right: 10px;"></i> -->
            <i @click="deleteAnnex(item, index)"
               class="iconfont icon-lajixiang"
               style="margin-left:10px"></i>
          </span>
        </div>
      </div>
    </div>
    <el-dialog title="合同账单"
               :show-close="false"
               :visible.sync="contractBillDialogVisible"
               class="contract-bill"
               append-to-body>
      <div class="export"
           @click="exportBill">
        <span class="iconfont icon-xiazaidaoru"></span>
        导出账单
      </div>
      <div class="amount clearfix">
        <div>
          <p>合同账单总金额/元</p>
          <p>{{amount | toLocaleString}}</p>
        </div>
        <div>
          <p>实收总金额/元</p>
          <p>{{sjAmount | toLocaleString}}</p>
        </div>
      </div>
      <el-table ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%">
        <el-table-column prop="feeTypeName"
                         label="费用类型"
                         width="120">
        </el-table-column>
        <el-table-column label="账单金额/元"
                         width="120">
          <template slot-scope="scope">{{ scope.row.amount | toLocaleString }}<span v-if="scope.row.remake && scope.row.feeTypeName === '租金保证金'">{{ scope.row.remake }}</span></template>
        </el-table-column>
        <el-table-column label="实收金额/元"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.sjAmount | toLocaleString }}</template>
        </el-table-column>
        <el-table-column label="计费周期"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.startDate }}~{{ scope.row.endDate }}</template>
        </el-table-column>
        <el-table-column prop="finalPaymentDate"
                         label="应收时间"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="billStatus"
                         label="账单状态"
                         :formatter="formatterBillStatus"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="billType"
                         label="账单类型"
                         :formatter="formatterBillType"
                         show-overflow-tooltip>
        </el-table-column>
        <!-- <el-table-column
          prop="address"
          label="滞纳金金额"
          show-overflow-tooltip>
        </el-table-column> -->
        <el-table-column label="操作"
                         align="center">
          <template slot-scope="scope">
            <el-button @click="billDetails(scope.$index, scope.row)"
                       v-if="detailData.contractStatus !== 'ZH_APPROVAL' && detailData.contractStatus !== 'XQ_APPROVAL'"
                       class="el-button--primary"
                       size="mini">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="contractBillDialogVisible = false"
                   class="close-button">关 闭</el-button>
        <!-- <el-button type="primary"
                   @click="addPara('addform')"
                   class="defaultbtn dialog-confirmBtn">保 存</el-button> -->
      </div>
    </el-dialog>
    <el-dialog title="合同退租申请"
               :visible.sync="withdrawalDialogVisible"
               class="contract-bill rent-withdrawal"
               append-to-body>
      <contractWithdrawal :withdrawalVisible="withdrawalDialogVisible"
                          :withdrawalType="withdrawalType"
                          :detailData="detailData"
                          :withdrawalData="withdrawalData"
                          ref="contractWithdrawal"
                          @withdrawalClose="withdrawalClose"
                          @onHide="onHide" />
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="withdrawalDialogVisible = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="initiateApproval('addform')"
                   class="defaultbtn dialog-confirmBtn">
          确认退租
        </el-button>
      </div>
    </el-dialog>
    <!-- 账单详情 -->
    <billDetails :detailsdrawershow="billDetailsdrawershow"
                 :detailsData="builddetailsData"
                 :queryBillId="queryBillId"
                 :reductionData="reductionData"
                 @drawerClose="drawerClose"
                 @handleEdit="handleEdit"
                 @query='query'
                 ref="billDetail" />
  </div>
</template>
<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import billDetails from '@/views/operations/varietyBusiness/income/components/incomeDetails.vue'
import contractWithdrawal from './contractWithdrawal.vue'
import aliUpload from '@/components/aliUpload.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import axios from 'axios'
export default {
  name: 'contractsDetails',
  components: {
    Drawer,
    contractWithdrawal,
    billDetails,
    aliUpload,
    aliDownLoad
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    withdrawalData: {
      type: Object
    },
    detailData: {
      type: Object,
      default: () => {
        return {
          rooms: [{
            'projectManagement': {
              'previewImage': '',
              'projectManagement': ''
            }
          }],
          rentClauses: [{
            startDate: '',
            endDate: '',
            deposit: '',
            proportion: '',
            month: '',
            dayNumber: '',
            billingType: '',
            yearDay: ''
          }, {
            startDate: '',
            endDate: '',
            deposit: '',
            proportion: '',
            month: '',
            dayNumber: '',
            billingType: '',
            yearDay: ''
          }]
        }
      }
    }
  },
  data () {
    return {
      showTips: false,
      newRulesDialog: false,
      newPropertyDialog: false,
      createdbillDialog: false,
      contractId: '',
      billStart: '',
      billEnd: '',
      upLoadText: '',
      billTableData: [],
      fileType: [],
      tableData: [],
      remarkContent: '',
      sjAmount: '',
      amount: '',
      newlystep1: true,
      newlystep2: false,
      refundDialog: false,
      essentialInformation: true,
      showLeaseTerms: true,
      showRentIncrements: true,
      showRentConcessions: true,
      showPropertyIncrements: true,
      showProperty: true,
      withdrawalDialogVisible: false,
      contractBillDialogVisible: false,
      renewalDialogVisible: false,
      drawerTitle: '多经合同',
      navList: [{
        label: '基本信息',
        value: true
      }, {
        label: '费用条款',
        value: false
      }],
      refundform: {
        amount: '',
        billDate: ''
      },
      formLabelWidth: '',
      documentTypeOptions: [],
      nationalityOptions: [],
      projectList: [],
      chooseObj: {},
      selHourse: false,
      selProject: false,
      errorProject: false,
      sexOptions: [
        {
          name: '男',
          value: 'MAN'
        },
        {
          name: '女',
          value: 'WOMAN'
        }
      ],
      detailDataRules: {
        yxContractNo: [{
          required: true,
          message: '请输入合同编号',
          trigger: 'blur'
        }],
        startDate: [{
          required: true,
          message: '请选择开始时间',
          trigger: 'blur'
        }],
        endDate: [{
          required: true,
          message: '请选择结束时间',
          trigger: 'blur'
        }],
        area: [{
          required: true,
          message: '请输入租赁面积',
          trigger: 'blur'
        }]
      },
      showRemarks: false,
      showEnclosure: false,
      renewBill: {},
      marginBill: [],
      enclosureList: [],
      enclosure: '',
      withdrawalType: '',
      billDetailsdrawershow: false,
      builddetailsData: {},
      queryBillId: '',
      reductionData: {},
      LeaseClauseDataes: {},
      ruleId: '',
      pager: {
        currentPage: 1,
        pgNum: 1,
        total: 0,
        pgSize: 15
      }
    }
  },
  watch: {
    projectList: {
      handler: function () {
        this.chooseObj = this.projectList[0]
      }
    },
    detailData: {
      handler: function () {
      }
    }
  },
  methods: {
    openNewRulesDialog () {
      this.contractId = this.detailData.id
      this.LeaseClauseDataes = this.detailData
      this.newRulesDialog = true
    },
    openPropertyDialog () {
      this.contractId = this.detailData.id
      this.newPropertyDialog = true
    },
    resetData () {
      this.LeaseClauseDataes = {}
    },
    setAnnex (annexURL, annexName) {  // 子组件上传成功返回文件url 和名字
      this.enclosureList.push({
        'annexName': annexName,
        'annexURL': annexURL
      })
      this.enclosure = 'name'
    },
    addAnnexes () {
      if (this.enclosureList.length === 0 || !this.enclosure) {
        return
      }
      let obj = {
        managementContractId: this.detailData.id,
        annexs: this.enclosureList
      }
      context.http.post('/cms/api/annexes/list', obj).then(res => {
        if (res.data) {
          this.$emit('handleEdit', 0, this.detailData)
          this.showEnclosure = false
          this.enclosure = ''
          this.enclosureList = []
        }
      })
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
    current_change (currentPage) {
      this.pager.currentPage = currentPage
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    closeDialog () {
      this.newRulesDialog = false
      this.newPropertyDialog = false
    },
    queryContractRules () {
      context.http.get('/cms/api/rent-clauses?sort=termType,desc&sort=createdDate,desc', { contractId: this.detailData.id, page: (this.pager.currentPage - 1), size: this.pager.pgSize }).then(res => {
        this.contractRulesData = res.data
        this.pager.total = Number(res.headers['x-total-count'])
      })
    },
    drawerClose () {
      this.billDetailsdrawershow = false
    },
    async handleEdit (index, row) {
      let result = await context.http.get(`cms/api/bills/${row.id}`)
      this.builddetailsData = JSOG.decode(result.data)
      this.billDetailsdrawershow = true
    },
    billDetails (index, row) {
      context.http.get(`cms/api/bills/${row.id}`).then(res => {
        this.builddetailsData = res.data
        this.billDetailsdrawershow = true
        this.queryBillId = row.id.toString()
        this.contractBillDialogVisible = false
      })
    },
    query () {

    },
    onHide () {
      this.enclosureList = []
      this.$emit('drawerClose')
      this.$emit('query')
      this.readonly = true
      this.showRemarks = false
      this.showEnclosure = false
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
      } else {
        this.selHourse = !this.selHourse
      }
      this.chooseObj = item
    },
    changeNav (inx) {
      this.navList.forEach(item => {
        item.value = false
      })
      this.navList[inx].value = true
      if (inx === 0) {
        this.essentialInformation = true
      } else if (inx === 1) {
        this.essentialInformation = false
      }
    },
    newlystepNoe (formName) {
      if (!this.chooseObj) {
        this.errorProject = true
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.newlystep1 = false
          this.newlystep2 = true
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    previousStep () {
      this.essentialInformation = false
    },
    withdrawalClose () {
      this.withdrawalDialogVisible = false
    },
    formatBillType (val) {
      return val === 'MONTH' ? '按月计费' : '按天计费'
    },
    formatUnit (val) {
      return val === 'P' ? '%' : '元'
    },
    formatOfferType (val) {
      return val === 'RENT' ? '免租期' : val === 'DECORATION' ? '装修期' : '物业免租期'
    },
    formatRentalMethod (val) {
      return val === 'RENT' ? '固定租金' : val === 'POINTS' ? '扣点' : '保底扣点'
    },
    formatOfferReocrd (val) {
      return val === true ? '包括' : '不包括'
    },
    formatonRentBill (val) {
      return val === false ? '不同步' : '同步'
    },
    formatterStatus (val) {
      let contractStatus
      if (val === 'STORAGE') {
        contractStatus = '暂存'
      } else if (val === 'PENDING') {
        contractStatus = '待执行'
      } else if (val === 'EXECUTING') {
        contractStatus = '执行中'
      } else if (val === 'ZH_APPROVAL') {
        contractStatus = '招商审核中'
      } else if (val === 'TZ_APPROVAL') {
        contractStatus = '退租审核中'
      } else if (val === 'WITHDRAWAL') {
        contractStatus = '已退租'
      } else if (val === 'XQ_APPROVAL') {
        contractStatus = '续签审核中'
      } else if (val === 'NO') {
        contractStatus = '审核未通过'
      } else if (val === 'MATURITY') {
        contractStatus = '到期未处理'
      }
      return contractStatus
    },
    feeTypeFormat (val) {
      let feeType
      if (val === 'RENT') {
        feeType = '租金'
      } else if (val === 'RENT_DEPOSIT') {
        feeType = '租金保证金'
      } else if (val === 'DECORATION') {
        feeType = '装修保证金'
      } else if (val === 'F_INTENTION') {
        feeType = '返还意向金'
      } else if (val === 'F_DECORATION') {
        feeType = '返还装修保证金'
      } else if (val === 'WITHDRAWAL') {
        feeType = '退租结算'
      } else if (val === 'PROPERTY') {
        feeType = '物业费'
      } else if (val === 'PROPERTY_DEPOSIT') {
        feeType = '物业费保证金'
      } else if (val === 'WITHDRAWAL') {
        feeType = '退租结算'
      } else if (val === 'RELEASE') {
        feeType = '合同解除结算'
      }
      return feeType
    },
    priceUnitFormat (val) {
      let priceUnit
      if (val === 'M2DAYS') {
        priceUnit = '元/㎡天'
      } else if (val === 'M2MONTH') {
        priceUnit = '元/㎡月'
      } else if (val === 'DAY') {
        priceUnit = '元/天'
      } else if (val === 'MONTH') {
        priceUnit = '元/月'
      } else if (val === 'YEAR') {
        priceUnit = '元/年'
      }
      return priceUnit
    },
    returnDecorationDeposit () {
      this.refundDialog = true
      if (this.detailData.decorationBills.length > 0) {
        this.refundform.amount = this.detailData.decorationBills[0].sjAmount
      }
    },
    imageChange (state, event) {
      this.enclosureList = []
      let files = event.target.files
      let form = new FormData()
      form.append('file', files[0])
      let name = files[0].name
      event.target.value = ''
      context.http.post('/ywm/api/image-multipart', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        this.enclosureList = [{
          'annexName': name,
          'annexURL': res.data
        }]
        this.enclosure = 'name'
      }).catch(error => {
        console.info(error)
      })
    },
    addIntentionContracts () { },
    contractRenewal () {
      this.marginBill = []
      this.renewalDialogVisible = true
      context.http.get('/cms/api/bills/renew', {
        id: this.detailData.id
      }).then(res => {
        this.renewBill = res.data
      })
      // context.http.get(`/cms/api/bills/business/${this.detailData.id}`).then(res => {
      //   this.marginBill = res.data
      // })
    },
    getBillDetails () {
      this.marginBill = []
      context.http.get(`/cms/api/bills/business/${this.detailData.id}`).then(res => {
        this.marginBill = res.data
      })
    },
    contractWithdrawal (type) {
      this.withdrawalDialogVisible = true
      this.withdrawalType = type
    },
    initiateApproval () {
      this.$refs.contractWithdrawal.initiateApproval()
    },
    agreement () {
      console.log('退租协议')
    },
    confirmRenewal () {
      localStorage.contractStatus = 'renewal'
      localStorage.contract = JSON.stringify(this.detailData)
      this.renewalDialogVisible = false
      this.onHide()
      this.$emit('openAddDialog')
    },
    contractBill () {
      this.contractBillDialogVisible = true
      context.http.get(`/cms/api/bills/business/statisics/${this.detailData.id}?sort=startDate,asc&sort=endDate,asc&sort=finalPaymentDate,asc&sort=feeType,asc`, { businessType: 'DIVERSIFICATION' }).then(res => {
        this.tableData = res.data.list
        this.amount = res.data.statisics.amount
        this.sjAmount = res.data.statisics.sjAmount
      })
    },
    exportBill () {
      axios({
        method: 'GET',
        url: `/cms/api/bills/business/report/${this.detailData.id}`,
        params: {
          businessType: 'DIVERSIFICATION'
        },
        responseType: 'blob'
      }).then(res => {
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
    deleFile (item, index) {
      this.enclosureList.splice(index, 1)
    },
    deleteAnnex (item, index) {
      context.http.delete(`/cms/api/annexes/${item.id}`).then(res => {
        this.detailData.annexes.splice(index, 1)
      })
    },
    addRemarks () {
      if (!this.remarkContent) {
        return
      }
      context.http.post('/cms/api/remarks', {
        content: this.remarkContent,
        managementContractId: this.detailData.id
      }).then(res => {
        if (res.data) {
          this.$emit('handleEdit', 0, this.detailData)
          this.showRemarks = false
        }
      })
    },
    formatterBillType (row, column) {
      return row.billType === 'R' ? '收款' : '付款'
    },
    formatterBillStatus (row, column) {
      let res = ''
      if (row.billStatus === 'APPROVAL') {
        res = '减免审核中'
      } else if (row.billStatus === 'UPDATE') {
        res = '减免驳回待修改'
      } else if (row.billStatus === 'NO') {
        res = '未付款'
      } else if (row.billStatus === 'OK') {
        res = '已结清'
      } else if (row.billStatus === 'SECTION') {
        res = '部分结清'
      } else if (row.billStatus === 'STAY_SETTLE') {
        res = '待结清'
      }
      return res
    },
    formatterFeeType (row, column) {
      let feeType
      switch (row.feeType) {
        case 'RENT':
          feeType = '租金'
          break
        case 'RENT_DEPOSIT':
          feeType = '租金保证金'
          break
        case 'PROPERTY':
          feeType = '物业费'
          break
        case 'PROPERTY_DEPOSIT':
          feeType = '物业费保证金'
          break
        case 'INTENTION':
          feeType = '意向金'
          break
        case 'DECORATION':
          feeType = '装修保证金'
          break
        case 'F_INTENTION':
          feeType = '返还意向金'
          break
        case 'F_DECORATION':
          feeType = '返还装修保证金'
          break
        case 'WITHDRAWAL':
          feeType = '退租结算'
          break
        case 'RELEASE':
          feeType = '合同解除结算'
          break
      }
      return feeType
    },
    refund (formName) {
      this.$refs['refundform'].validate((valid) => {
        if (valid) {
          this.refundform.businessId = this.detailData.id
          this.refundform.businessType = 'CONTRACT'
          this.refundform.feeTypeName = '装修保证金'
          this.refundform.finalPaymentDate = this.refundform.billDate
          this.refundform.referred = this.detailData.tenant.referred
          this.refundform.tenandId = this.detailData.tenant.id
          this.refundform.projectManagement = this.detailData.projectManagement
          let _this = this
          context.http.post('/cms/api/bills/restore', this.refundform).then(res => {
            if (res.status === 201) {
              _this.refundDialog = false
              _this.showRemarks = false
              _this.showEnclosure = false
              this.$emit('handleEdit', 0, this.detailData)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    previewBills () {
      if (!this.billStart[0] || !this.billStart[1]) {
        this.$message({
          message: '请选择时间',
          type: 'warning'
        })
        return
      }
      context.http.get(`/cms/api/rent-clauses/business/${this.ruleId}?startDate=${this.billStart[0]}&endDate=${this.billStart[1]}`).then(res => {
        if (res.status === 200) {
          this.billTableData = res.data.newBills
          if (res.data.oldBills && res.data.oldBills.length > 0 && res.data.newBills.length !== 0) {
            this.showTips = true
          }
        }
      })
    },
    cretaedBills () {
      if (!this.billStart[0] || !this.billStart[1] || this.billTableData.length === 0) {
        return
      }
      context.http.post(`/cms/api/rent-clauses/business/${this.ruleId}?startDate=${this.billStart[0]}&endDate=${this.billStart[1]}`).then(res => {
        if (res.status === 200) {
          this.$message({
            message: '生成成功',
            type: 'success'
          })
          this.createdbillDialog = false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.contracts-info {
  position: relative;
  .contracts-remarks {
    position: fixed;
    z-index: 999;
    width: 500px;
    height: 100%;
    right: 0;
    top: 57px;
    background-color: rgba(250, 250, 250, 1);

    .rektitle {
      margin: 20px;

      span {
        float: right;
        font-size: 12px;
        cursor: pointer;
      }
    }

    .el-textarea {
      width: 90%;
      margin-left: 20px;
    }

    .operation {
      text-align: right;

      span {
        display: inline-block;
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background-color: #0f75ff;
        color: #fff;
        border-radius: 4px;
        font-size: 12px;
        margin: 20px 28px 0 0;
        cursor: pointer;
      }
    }
  }
  .contracts-enclosure {
    position: fixed;
    z-index: 999;
    width: 500px;
    height: 100%;
    right: 0;
    top: 57px;
    background-color: rgba(250, 250, 250, 1);

    .rektitle {
      margin: 20px;

      span {
        float: right;
        font-size: 12px;
        cursor: pointer;
      }
    }

    .upload {
      width: 90%;
      text-align: center;
      height: 100px;
      line-height: 100px;
      margin: 0 auto;
      color: rgba(15, 117, 255, 1);
      border: 1px solid rgba(231, 231, 231, 1);
      border-radius: 4px;
      background-color: #fff;
      position: relative;
      .aliUpload {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        .oss_file {
          border: none;
          width: 100%;
          height: 100%;
          input {
            position: absolute;
            right: 0;
            width: 100%;
            height: 100px;
            opacity: 0;
            cursor: pointer;
          }
        }
      }
      .icon-adds {
        background: url(../../../../../assets/plus.png) no-repeat;
        background-size: contain;
        margin-bottom: 6px;
      }
    }

    .enclosure-list {
      width: 90%;
      margin: 0 auto;
      margin-top: 40px;
      font-size: 12px;

      .enclosure-item {
        font-size: 14px;

        span {
          display: inline-block;
          width: 10%;

          &:first-child {
            width: 70%;
          }
        }
      }
    }
  }
  .contract-bill {
    .el-dialog {
      width: 1000px;
    }

    .el-dialog__body {
      border-bottom: none;
    }

    .el-table {
      border: 1px solid rgba(241, 241, 241, 1);
    }

    .amount {
      > div {
        display: inline-block;
        margin: 20px 60px 20px 0;
        float: left;

        p {
          &:first-child {
            margin-bottom: 10px;
            color: #7085a1;
          }
        }
      }
    }

    .export {
      position: absolute;
      right: 35px;
      top: 23px;
      color: #0f75ff;
      cursor: pointer;

      span {
        color: #0f75ff;
      }
    }
  }
  .rent-withdrawal {
    .el-dialog {
      margin-top: 5vh !important;
    }
  }
  .generate-bills {
    .query-wrap {
      margin: 10px 0;
      display: flex;
      align-content: center;
      > div {
        margin-top: 18px;
        margin-bottom: 10px;
        margin-right: 10px;
      }
      .query-btn {
        width: 80px;
        margin-top: 22px;
        margin-left: 10px;
      }
    }
  }
}
.contracts-detailsss {
  .basic-select {
    .selectInput {
      img {
        margin: 0;
        width: 60px;
        height: 30px;
      }
      span {
        font-size: 14px;
      }
    }
    .condetail {
      > span {
        float: left !important;
        line-height: 30px;
        margin-left: 20px;
        color: #666 !important;
      }
    }
  }

  .cttitle + span {
    font-size: 12px;
    display: inline-block;
  }

  .remarks-list {
    width: 90%;
    margin: 20px auto 0;

    div {
      &:first-child {
        color: #333;
        font-size: 14px;
        margin-bottom: 10px;
      }

      &:last-child {
        color: #666;

        span {
          display: inline-block;
          font-size: 14px;
          width: 100%;
          text-align: left;
        }
      }
    }
  }
  .textleft {
    text-align: left !important;
    white-space: nowrap;
    overflow: hidden;
  }
  .addIntentionContracts {
    position: relative;

    .head-right {
      position: absolute;
      top: -40px;
      right: 0;
      font-size: 12px;

      > span {
        margin-right: 10px;
      }

      span {
        cursor: pointer;
      }

      .iconfont {
        vertical-align: middle;
      }
    }

    .dl-head {
      margin-top: 10px;
    }

    .info_tab {
      height: 48px;
      display: -ms-flexbox;
      display: flex;
      background-color: #fff;
      margin: 10px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      -ms-flex-pack: justify;
      justify-content: space-between;
      -ms-flex-align: center;
      align-items: center;
      padding-right: 44px;
      border-bottom: 1px solid #ecedef;

      .nav {
        display: -ms-flexbox;
        display: flex;

        li.select_active {
          border-bottom: 2px solid #3175d2;
          color: #3175d2;
          font-weight: bolder;
        }

        li {
          width: 140px;
          text-align: center;
          font-size: 14px;
          color: #666;
          height: 46px;
          line-height: 46px;
          border-bottom: 2px solid #fff;
          cursor: pointer;
        }
      }
    }

    .dialog-footer {
      border-top: 1px solid #e5e5e5;
      padding: 20px 0;
      text-align: right;
      margin-top: 0;
      margin-right: 38px;
    }

    .errorpjTip {
      color: red !important;
      font-size: 12px;
      width: 100%;
      float: left;
    }

    .step2 {
      .dc-right {
        width: 100% !important;
        border: 1px solid #e7e7e7;
        .cttitle {
          vertical-align: top;
        }
        .other-info {
          width: 98%;
          margin: 0 auto;
        }
      }
    }

    .upload {
      position: relative;
      float: right;
      display: inline-block;
      width: 60px;
      height: 24px;
      line-height: 24px;
      background: rgba(222, 235, 254, 1);
      opacity: 0.9;
      border-radius: 2px;
      font-size: 12px;
      text-align: center;
      cursor: pointer;

      input {
        position: absolute;
        right: 0;
        top: 0;
        width: 60px;
        height: 24px;
        opacity: 0;
        cursor: pointer;
      }
    }

    .enclosure {
      border: 1px solid #e7e7e7;
      margin-bottom: 20px;
      font-size: 12px;

      .enclosure-head {
        background-color: #fafafa;
        height: 30px;
        line-height: 30px;

        span {
          display: inline-block;
          width: 48%;
          padding-left: 40px;
        }
      }

      .el-item {
        height: 30px;
        line-height: 30px;
        font-size: 12px;

        span {
          display: inline-block;
          width: 48%;
          padding-left: 40px;
        }
      }
    }

    .dl-content {
      width: 100%;
      margin-bottom: 20px;

      .head-portrait {
        padding-top: 36px;
        text-align: center;

        .hp-img {
          width: 100px;
          height: 100px;
          border: 1px dashed #dfdfdf;
          border-radius: 50%;
          margin-left: 22%;

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }

        .upload {
          vertical-align: top;
          position: relative;

          .uploadbtn {
            display: inline-block;
            width: 88px;
            height: 34px;
            line-height: 34px;
            text-align: center;
            border: 1px solid #5e72e4;
            border-radius: 8px;
            color: #5e72e4;
            margin-top: 14px;
            cursor: pointer;

            .icon-upload {
              //  background: url(../../../assets/upload.png) no-repeat;
              position: relative;
              top: 2px;
              width: 14px;
            }
          }

          input {
            position: absolute;
            top: 14px;
            right: 41px;
            width: 88px;
            height: 34px;
            opacity: 0;
            cursor: pointer;
          }
        }

        p {
          font-size: 12px;
          margin-top: 10px;
          color: #666;
        }
      }
      .dc-left {
        width: 30%;
        text-align: center;
        border: 1px solid #e7e7e7;
        margin-top: 20px;
        .dr-head {
          background-color: #fafafa;
          height: 40px;
          line-height: 40px;
          padding-left: 12px;
          font-size: 14px;
          margin-bottom: 20px;
        }
        .basic-select {
          width: 100%;
          .bd-number {
            text-align: left;
            height: 20px;
            line-height: 20px;
            background: #fafafa;
            span {
              display: inline-block;
              width: 32%;
              text-align: center;
            }
          }
          .layer {
            padding-bottom: 10px;
            font-size: 14px;
            div {
              padding: 12px 0 0 0;
              span {
                display: inline-block;
                width: 32%;
                vertical-align: top;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
      }
      .tenantinfo {
        .el-form-item {
          width: 29% !important;
          margin-right: 0;
        }

        .cttitle + span {
          display: inline-block;
          height: 25px;
          line-height: 40px;
        }
      }

      .dc-right {
        width: 68%;
        border: 1px solid #e7e7e7;
        margin-top: 20px;

        .dr-head {
          background-color: #fafafa;
          height: 40px;
          line-height: 40px;
          padding-left: 12px;
          font-size: 14px;
          margin-bottom: 20px;
        }
        .cttitle {
          vertical-align: top;
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
          width: 30%;
          margin-left: 16px;
          margin-right: 10px;
          vertical-align: top;
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
    }

    .selected-housing {
      margin-bottom: 15px;
      font-size: 12px;

      span {
        display: inline-block;
        width: 23%;
        padding-left: 40px;
        vertical-align: top;
      }

      ul {
        display: flex;

        &:first-child {
          border-bottom: 1px solid #e7e7e7;
        }

        li {
          width: 20%;
          height: 30px;
          line-height: 30px;
          text-align: center;
        }
      }

      input {
        border: 1px solid rgba(231, 231, 231, 1);
        border-radius: 4px;
      }

      .cttitle {
        float: left;
        display: inline-block;
        width: 33%;
        padding-left: 20px;
        margin-bottom: 20px;
        vertical-align: top;
        div {
          padding-top: 10px;
        }
      }
      .operation-li {
        span {
          cursor: pointer;
          color: #0f75ff;
          display: inline-block;
          width: 60px !important;
        }
      }
    }

    .bill-details {
      ul {
        &:first-child {
          li {
            height: 40px;
            line-height: 40px;
          }
        }

        li {
          span {
            padding-left: 0 !important;
            width: 100% !important;
          }
        }
      }
    }
    .iconfont {
      cursor: pointer;
    }
  }
  .dl-warn {
    .el-dialog {
      .el-dialog__header,
      .el-dialog__body {
        border: none;
      }
      .el-dialog__footer {
        padding-top: 20px;
        .el-button {
          width: 100px;
          height: 30px;
          line-height: 0px;
          &:first-child {
            background-color: #a0a0a0;
            color: #fff;
            border-color: #a0a0a0;
          }
          background-color: #3577f6;
          border-color: #3577f6;
        }
      }
    }
    .dl-content {
      text-align: center;
      img {
        width: 60px;
        height: 60px;
        margin-bottom: 10px;
      }
      p {
        margin-bottom: 10px;
      }
    }
  }
}
.main-content {
  position: relative;
}
.contracts-info .wrap {
  .drawer-head {
    border-bottom: 1px solid #ddd;
  }
}
.conDetail {
  .el-form-item {
    margin-right: 0 !important;
  }
}
</style>
