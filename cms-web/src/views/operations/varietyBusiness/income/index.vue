<template>
  <div class="income-list">
    <span class="page_head_title">多种经营</span>
    <ul class="default_tab_block">
      <li v-if="hasAuthority('02030501')"
          class="active">
        <span>多经账单</span>
      </li>
      <li v-if="hasAuthority('02030510')"
          @click="switchover('contract')">
        <span>多经合同</span>
      </li>
      <li v-if="hasAuthority('02030515')"
          @click="switchover('point')">
        <span>多经点位</span>
      </li>
    </ul>
    <div class="pl-content">
      <div class="search-bar">
        <div style="display: flex;flex-wrap: wrap;align-items:center">
          <div class="marginRights">
            <el-select :clearable="true"
                       v-model="projectManagementId"
                       placeholder="项目简称">
              <el-option v-for="item in projectManagement"
                         :key="item.id"
                         :label="item.referred"
                         :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="marginRights">
            <el-input v-model="referred"
                      style="width: 150px!important;"
                      placeholder="客户名称/品牌名称"></el-input>
          </div>
          <div class="marginRights marginNone">
            <el-date-picker style="margin-right:0;"
                            v-model="startDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="开始时间">
            </el-date-picker>
          </div>
          <div class="split">-</div>
          <div class="marginRights">
            <el-date-picker v-model="endDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="结束时间">
            </el-date-picker>
          </div>
          <div class="marginRights">
            <el-select :clearable="true"
                       v-model="feeType"
                       placeholder="费用类型">
              <el-option v-for="item in options1"
                         :key="item.id"
                         :label="item.value"
                         :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="marginRights">
            <el-select :clearable="true"
                       v-model="billStatus"
                       placeholder="账单状态">
              <el-option v-for="item in options2"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="query-btn"
               @click="querySearch">查询</div>
        </div>
        <div v-if="hasAuthority('02030502')"
             style="display:flex;align-items:center">
          <el-dropdown trigger="hover">
            <div style="height:32px;"
                 class="el-dropdown-link">
              <el-button style="display:block"
                         class="tban tban1"><i class="iconfont icon-crm_xinzeng-"></i> 新增账单</el-button>
            </div>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span class="disBlock"
                      @click="addBill('R')">添加收款账单</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span class="disBlock"
                      @click="addBill('P')">添加付款账单</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="plc-table">
        <div v-if="hasAuthority('02030503')"
             class="export">
          <el-dropdown>
            <span><i class="iconfont el-icon-more"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><span style="display: block;width:100%;height:100%"
                      @click="exportData">导出</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-table show-summary
                  :summary-method="getSummaries"
                  :data="tableData"
                  style="width: 100%">
          <el-table-column prop="projectManagement.referred"
                           label="项目简称"
                           align="center"></el-table-column>
          <el-table-column label="点位名称"
                           align="center">
            <template slot-scope="scope"
                      v-if="scope.row.managementPointDTOS">
              <span v-for="(item, index) in scope.row.managementPointDTOS"
                    :key="index">
                {{item.pointName}}<span v-if="scope.row.managementPointDTOS.length !== index + 1">、</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="tenantName"
                           label="客户名称"
                           align="center"></el-table-column>
          <el-table-column prop="referred"
                           label="品牌名称"
                           align="center"></el-table-column>
          <el-table-column prop="finalPaymentDate"
                           label="应收/应付时间"
                           align="center"></el-table-column>
          <el-table-column prop="feeTypeName"
                           label="费用类型"
                           align="center"></el-table-column>
          <el-table-column :formatter="formatterAmount"
                           prop="amount"
                           label="账单金额"
                           align="center"></el-table-column>
          <el-table-column :formatter="formatterWriteOffAmount"
                           prop="writeOffAmount"
                           label="核销金额"
                           align="center"></el-table-column>
          <el-table-column :formatter="formatterArrearsAmount"
                           prop="arrearsAmount"
                           label="欠收金额"
                           align="center"></el-table-column>
          <el-table-column width="200"
                           label="计费周期"
                           align="center">
            <template slot-scope="scope">
              {{scope.row.startDate}}~{{scope.row.endDate}}
            </template>
          </el-table-column>
          <el-table-column prop="billStatus"
                           width="100"
                           label="账单状态"
                           align="center"
                           :formatter="formatterBillStatus"></el-table-column>
          <el-table-column width="150"
                           label="操作"
                           align="center"
                           v-if="hasAuthority('02030504')">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.$index, scope.row)"
                         class="el-button--primary operation-btn"
                         size="mini">查看</el-button>
            </template>
          </el-table-column>

        </el-table>

      </div>
      <div v-if="statistics.length"
           class="plc-table-bottom">
        <table class="ctable"
               border="0"
               cellspacing="0"
               cellpadding="0">
          <tr align="center">
            <td>本页小计</td>
            <td width="120"></td>
            <td width="120"></td>
            <td width="120"></td>
            <td width="120">{{statistics[0].amount}}</td>
            <td width="120">{{statistics[0].writeOffAmount}}</td>
            <td width="120">{{statistics[0].arrearsAmount}}</td>
            <td></td>
            <td width="120"></td>
            <td width="250"></td>
          </tr>
          <tr align="center">
            <td width="120">总计</td>
            <td width="120"></td>
            <td width="120"></td>
            <td width="120"></td>
            <td width="120">{{statistics[1].amount}}</td>
            <td width="120">{{statistics[1].writeOffAmount}}</td>
            <td width="120">{{statistics[1].arrearsAmount}}</td>
            <td></td>
            <td width="120"></td>
            <td width="250"></td>
          </tr>
        </table>
      </div>
      <div class="ctc-foot1">
        <span><span style="margin-right:10px">{{currentPage}}/{{Math.ceil(total/pgSize)}}页</span> 共{{total}}条记录</span>
        <el-pagination v-if="total > 0"
                       background
                       layout="prev, pager, next"
                       :page-size=pgSize
                       :total="total"
                       :current-page="currentPage"
                       @current-change="current_change">
        </el-pagination>
        <div class="pagingnum">
          显示 <select v-model="pgSize"
                  @change="currentSel">
            <option v-for="item in pgNumoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </option>
          </select>
          条目
        </div>
      </div>
    </div>
    <incomeDetails v-if="detailsdrawershow"
                   :detailsdrawershow="detailsdrawershow"
                   :detailsData="builddetailsData"
                   :queryBillId="queryBillId"
                   :reductionData="reductionData"
                   @drawerClose="drawerClose"
                   @handleEdit="handleEdit"
                   @query='query'
                   ref="billDetail" />

    <el-dialog v-if="billDialogVisible"
               :title="addData.billType === 'R' ? '添加收款账单' : '添加付款账单'"
               :visible.sync="billDialogVisible"
               @close="addHide"
               class="flowDialog">
      <el-form :model="addData"
               :rules="addBillRules"
               ref="addBillform">

        <div class="dl-subtitle">项目简称<span class="required">*</span>
          <el-form-item prop="projectManagement.id">
            <el-select v-model="addData.projectManagement.id"
                       value-key="id"
                       @change="changeProject"
                       placeholder="请选择">
              <el-option value="">请选择</el-option>
              <el-option v-for="item in projectManagements"
                         :key="item.id"
                         :label="item.referred"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="dl-subtitle">品牌名称<span class="required">*</span>
          <el-form-item prop="tenandId">
            <el-select v-model="addData.tenandId"
                       value-key="id"
                       @change="changeTenant"
                       placeholder="请选择">
              <el-option value="">请选择</el-option>
              <el-option v-for="item in referredArr"
                         :key="item.id"
                         :label="item.referred"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="dl-subtitle">合同编号
          <el-form-item>
            <el-select v-model="addData.businessId"
                       value-key="id"
                       placeholder="请选择">
              <el-option value="">请选择</el-option>
              <el-option v-for="item in contractsArr"
                         :key="item.id"
                         :label="item.contractNo"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="dl-subtitle">费用类型<span class="required">*</span>
          <el-form-item prop="feeType">
            <el-select v-model="addData.feeType"
                       value-key="id"
                       placeholder="请选择">
              <el-option value="">请选择</el-option>
              <el-option v-for="item in options1"
                         :key="item.id"
                         :label="item.value"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="dl-subtitle dateInputBox">计费周期<span class="required">*</span>
          <div class="dateInput">
            <el-form-item prop="startDate">
              <el-date-picker type="date"
                              value-format="yyyy-MM-dd"
                              v-model="addData.startDate"
                              :picker-options="pickerBeginDateBefore"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="endDate">
              <el-date-picker type="date"
                              value-format="yyyy-MM-dd"
                              v-model="addData.endDate"
                              :picker-options="pickerBeginDateAfter"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </div>
        </div>

        <div class="dl-subtitle">账单金额<span class="required">*</span>
          <el-form-item prop="amount">
            <el-input @input="changeCode"
                      maxlength="13"
                      v-model="addData.amount">
            </el-input>
          </el-form-item>
        </div>
        <div class="dl-subtitle">{{addData.billType === 'R' ? '应收时间' : '应付时间'}}<span class="required">*</span>
          <el-form-item class="finalPaymentDate"
                        prop="finalPaymentDate">
            <el-date-picker type="date"
                            value-format="yyyy-MM-dd"
                            v-model="addData.finalPaymentDate"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="inlinediv">
          <div class="dl-subtitle">备注</div>
          <el-form-item style="width: 100%;margin-bottom: 20px;">
            <el-input v-model="addData.remake"
                      resize="none"
                      maxlength="70"
                      placeholder="70字以内"
                      type="textarea">
            </el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="addHide"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="addBillSave('addBillform')"
                   class="defaultbtn dialog-confirmBtn">保 存</el-button>
      </div>
    </el-dialog>

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
                  @click="downLoadModel(scope.$index, scope.row)">导出错误提示</span>
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
import context from '@/service'
import axios from 'axios'
import incomeDetails from './components/incomeDetails'
import { toLocaleString, toLocaleFixed } from '@/utils/validate.js'
import * as JSOG from 'jsog'
export default {
  name: 'incomeLists',
  components: {
    incomeDetails
  },
  data () {
    return {
      navList: [{ label: '本期未结清', value: true }, { label: '逾期未结清', value: false }, { label: '退租未结清', value: false }, { label: '自建未结清', value: false }],
      referred: '',
      tenantName: '',
      checkList: ['USING'],
      adddialogVisible: false,
      addProjectShow: false,
      detailsdrawershow: false,
      tableData: [],
      currentPage: 1,
      pgNum: 1,
      total: 0,
      pgSize: 15,
      builddetailsData: {
        billAndFlows: []
      },
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
      ],
      onRent: false,
      queryBillId: '',
      reductionData: {},
      projectManagementId: '', // 商圈
      projectManagement: [],
      projectManagements: [],
      feeType: '',
      options1: [],
      billStatus: '',
      options2: [{ value: 'NO', label: '未付款' }, { value: 'OK', label: '结清' }, { value: 'SECTION', label: '部分结清' }],
      startDate: '',
      endDate: '',
      billDialogVisible: false,
      addData: {
        billType: '',
        projectManagement: {
          id: ''
        },
        billCategory: 'DIVERSIFICATION',
        businessType: 'DIVERSIFICATION'
      },
      addBillRules: {
        'projectManagement.id': [
          { required: true, message: '请选择项目简称', trigger: 'change' }
        ],
        tenandId: [
          { required: true, message: '请选择品牌名称', trigger: 'change' }
        ],
        feeType: [
          { required: true, message: '请选择费用类型', trigger: 'change' }
        ],
        startDate: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '请填写账单金额', trigger: 'blur' }
        ],
        finalPaymentDate: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ]
      },
      errorPrompt: false,
      gridData: [{
        fileName: '',
        result: '',
        id: ''
      }],
      referredArr: [],
      contractsArr: [],
      showAdd: false,
      statistics: [],
      pickerBeginDateBefore: {
        disabledDate: time => {
          let endDateVal = this.addData.endDate
          if (endDateVal) {
            let temp = new Date(endDateVal).getTime()
            return time.getTime() > temp
          }
        }
      },
      pickerBeginDateAfter: {
        disabledDate: time => {
          let beginDateVal = this.addData.startDate
          if (beginDateVal) {
            let temp = new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            return time.getTime() < temp
          }
        }
      },
      showbillType: true
    }
  },
  created () {
    this.getProjectOptions()
    this.getFeeType()
    this.query()
    this.getDataAuthorityOptions()
  },
  mounted () {
    let billId = this.$route.query.billId
    if (billId) {
      context.http.get(`cms/api/bills/${billId}`).then(res => {
        this.builddetailsData = res.data
        this.detailsdrawershow = true
        this.queryBillId = billId.toString()
      })
    }
  },
  methods: {
    async getProjectOptions () {
      let result = await context.http.get('cms/api/project-managements', { page: 0, size: 100, sort: 'desc', useStatus: 'USING' })
      this.projectManagement = result.data
    },
    changeCode () {
      this.$nextTick(() => {
        let deposit = this.addData.amount
        let obj = this.addData
        if (deposit) {
          if (obj.amount !== '' && obj.amount.substr(0, 1) === '.') {
            obj.amount = ''
          }
          obj.amount = obj.amount.replace(/^0*(0\.|[1-9])/, '$1')// 粘贴不生效
          obj.amount = obj.amount.replace(/[^\d.]/g, '')  // 清除“数字”和“.”以外的字符
          obj.amount = obj.amount.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
          obj.amount = obj.amount.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
          obj.amount = obj.amount.replace(/^(\\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')// 只能输入两个小数
          if (obj.amount.indexOf('.') < 0 && obj.amount !== '') { // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
            if (obj.amount.substr(0, 1) === '0' && obj.amount.length === 2) {
              this.addData.amount = obj.amount.substr(1, obj.amount.length)
            }
          }
        }
      })
    },
    getDataAuthorityOptions () {
      context.http.get('/cms/api/project-managements', { useStatus: 'USING' }).then(res => {
        this.projectManagements = res.data
      })
    },
    querySearch () {
      this.currentPage = 1
      this.query()
    },
    addHide () {
      this.showbillType = true
      this.billDialogVisible = false
      this.addData = {
        projectManagement: {
          id: ''
        },
        feeType: ''
      }
    },
    choosefeeType (val) {
      console.log(val)
      this.showbillType = true
      this.options1.forEach(item => {
        if (Number(item.id) === Number(val)) {
          if (item.value === '装修保证金' || item.value === '租金保证金' || item.value === '物业费保证金') {
            this.showbillType = false
          }
        }
      })
    },
    async getFeeType () {
      let result1 = await context.http.get('/uaa/api/paramet-managements/name', { name: '多经费用类型' })
      this.options1 = result1.data
    },
    changeProject () {
      if (!this.addData.projectManagement.id || this.addData.projectManagement.id === '') {
        this.referredArr = []
        this.contractsArr = []
        return
      }
      context.http.get('/cms/api/tenant/projectManagement/' + this.addData.projectManagement.id).then(res => {
        this.referredArr = res.data
        this.$set(this.addData, 'tenandId', null)
        this.$set(this.addData, 'businessId', null)
      })
    },
    changeTenant () {
      if (!this.addData.tenandId || this.addData.tenandId === '') {
        this.contractsArr = []
        return
      }
      context.http.get('/cms/api/management-contracts/tenant', { tenantId: this.addData.tenandId }).then(res => {
        this.contractsArr = res.data
        this.$set(this.addData, 'businessId', null)
      })
    },
    addBill (state) {
      this.addData.billType = state
      this.billDialogVisible = true
    },
    addBillSave (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('add', this.addData)
          let _this = this
          this.addData.billCategory = 'DIVERSIFICATION'
          this.addData.businessType = 'DIVERSIFICATION'
          context.http.post('/cms/api/bills', this.addData).then(res => {
            if (res) {
              _this.billDialogVisible = false
              _this.showbillType = true
              _this.query()
              _this.addData = {
                projectManagement: {
                  id: ''
                },
                feeType: '',
                billCategory: 'DIVERSIFICATION',
                businessType: 'DIVERSIFICATION'
              }
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    switchover (state) {
      if (state === 'contract') {
        this.$router.push({ name: 'MultipleContract' })
      } else if (state === 'point') {
        this.$router.push({ name: 'point' })
      }
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
      this.currentPage = 1
      this.query()
    },
    formatterBillType (row, column) {
      return row.billType === 'R' ? '收款' : '付款'
    },
    formatterAmount (row, column) {
      return toLocaleString(row.amount)
    },
    formatterWriteOffAmount (row, column) {
      return toLocaleString(row.writeOffAmount)
    },
    formatterArrearsAmount (row, column) {
      return toLocaleString(row.arrearsAmount)
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
    projectDetails () {
      this.addProjectShow = true
    },
    drawerClose () {
      this.detailsdrawershow = false
    },
    dialogHide () {
      this.adddialogVisible = false
    },
    getSummaries (param) {
      const { columns, data } = param
      let sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '本页小计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          if (index === 6 || index === 7 || index === 8) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                let num = (prev * 100 + curr * 100) / 100
                return num
              } else {
                return prev
              }
            }, 0)
          }
        }
      })
      sums[6] = toLocaleString(sums[6])
      sums[7] = toLocaleString(sums[7])
      sums[8] = toLocaleString(sums[8])
      // test
      return sums
    },
    async query (type, index) {
      if (index) this.currentPage = index
      let result = await context.http.get('cms/api/bills/v1?sort=finalPaymentDate,asc&sort=id,desc', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        referred: this.referred,
        tenantName: this.tenantName,
        projectManagementId: this.projectManagementId,
        startDate: this.startDate,
        endDate: this.endDate,
        feeType: this.feeType,
        billStatus: this.billStatus,
        billCategory: 'DIVERSIFICATION'
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
    },
    bindCheckBox (value) {
      this.checkList = []
      this.checkList.push(value[1])
      this.currentPage = 1
      this.query()
    },
    async handleEdit (index, row) {
      let result = await context.http.get(`cms/api/bills/${row.id}`)
      this.builddetailsData = JSOG.decode(result.data)
      this.detailsdrawershow = true
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    goCharts (index, row) {
      this.$router.push({ path: '/home/charts', query: { buildingId: row.id } })
    },
    async exportData () {
      axios({ method: 'GET', url: '/cms/api/bills/report', params: { referred: this.referred, page: (this.currentPage - 1), size: this.pgSize, sort: 'id,desc', projectManagementId: this.projectManagementId, startDate: this.startDate, endDate: this.endDate, feeType: this.feeType, billStatus: this.billStatus, billCategory: 'DIVERSIFICATION' }, responseType: 'blob' }).then(res => {
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
    async downLoadModel (index, row) {
      let url = ''
      url = '/cms/api/bill-excel/file'
      if (row) {
        url = `/cms/api/bill-excel/upload?excelId=${row.id}`
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
        context.http.post('/cms/api/bill-excel/file', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          if (res.status === 200) {
            this.queryExportResult(res.data.id)
            event.target.value = ''
          }
        }).catch(error => {
          event.target.value = ''
          console.info(error)
        })
      }
    },
    queryExportResult (id) {
      const loading = this.$loading({
        lock: true,
        text: '导入中',
        spinner: 'el-icon-loading el-import-loading',
        customClass: 'loading-icon',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      context.http.get(`/cms/api/bill-excel/detail?excelId=${id}`).then(res => {
        if (res.data.excelResult === '审核中') {
          setTimeout(res => {
            this.queryExportResult(id)
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
          loading.close()
          this.query()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.income-list {
  font-size: 14px;
  background-color: #f9f9f9;

  .pl-content {
    width: 100%;
    margin: 0 auto;
    .search-bar {
      .morebtn {
        border-radius: 4px;
        background-color: #65ac69;
        color: #f3af2c;
        height: 32px;
        width: 100px;
        line-height: 32px;
        font-size: 14px;
        color: #fff;
        margin-left: 0;
        .icon-daochu {
          display: inline-block;
          width: 16px;
          height: 16px;
          background: url(../../../../assets/add.png) no-repeat;
          background-size: contain;
          vertical-align: middle;
          margin-right: 4px;
          margin-left: 6px;
        }
      }
      .morebtn1 {
        border: 1px solid #f3af2c;
        color: #f3af2c;
        height: 30px;
        width: 105px;
        margin-left: 16px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        .icon-daochu {
          display: block;
          width: 16px;
          height: 16px;
          margin-right: 4px;
          background: url(../../../../assets/daochu1.png) no-repeat;
          background-size: contain;
          margin-right: 4px;
        }
        span {
          display: block;
          line-height: 30px;
        }
        .el-icon-caret-bottom {
          display: block;
          width: 16px;
          height: 30px;
          line-height: 30px;
          font-size: 18px;
          margin-left: 2px;
        }
      }
      .addbtn {
        margin: 0;
        margin-left: 24px;
        float: left;
        margin-top: 15px;
      }
      .marginRights {
        float: left;
        .el-input {
          width: 140px !important;
        }
        .el-select {
          width: 144px !important;
        }
      }
      .marginNone {
        float: left;
        margin-right: 0;
      }
      .split {
        color: #333;
        display: block;
        width: 20px;
        height: 40px;
        line-height: 40px;
        float: left;
        text-align: center;
        /*line-height: 70px;*/
      }
      div {
        /*float: none;*/
        /*display: inline-block;*/
      }
      .swbtn {
        margin-left: 16px;
        font-size: 18px;
        width: 100px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        font-size: 18px;
        color: #000;
        background-color: #fff;
        margin-left: 16px;
        border-radius: 10px;
        cursor: pointer;
      }
      .btnselect {
        color: #fff;
        background-color: #42506c;
      }
      div {
        cursor: pointer;
      }
      position: relative;
    }
    .bd-statistics {
      background-color: #fff;
      margin-bottom: 10px;
      box-shadow: 1px 2px 5px #eee;
      .statistics-title {
        font-size: 14px;
        height: 30px;
        line-height: 30px;
        color: #333;
        font-weight: bold;
        padding-left: 20px;
        border-bottom: 1px solid #ededef;
      }
      .statistics-content {
        .contentItem {
          display: inline-block;
          padding: 20px 0 20px 20px;
        }
        .bd-number {
          margin-left: 6px;
          padding-right: 20px;
          font-size: 14px;
          font-weight: 400;
          font-family: PingFangSC;
          color: #353b4b;
          display: inline-block;
          min-width: 90px;
          .ci-title {
            font-weight: 400;
            height: 25px;
            line-height: 25px;
            color: #828692;
            font-size: 12px;
          }
          .ci-value {
            display: inline-block;
            font-size: 20px;
            margin-top: 4px;
          }
        }
        .borderstrip {
          width: 2px;
          height: 35px;
          background-color: #ecedef;
          display: inline-block;
          margin-top: 6px;
        }
      }
    }
    .plc-table {
      position: relative;
      .export {
        position: absolute;
        right: 0px;
        top: 5px;
        z-index: 9;
        span {
          display: inline-block;
          width: 60px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          /*background: rgba(222, 235, 254, 1);
            color: #5b9af8;
            opacity:0.9;
            border-radius:4px;*/
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
    .rent-control {
      border: 1px solid #96d050;
      background-color: #fff;
      color: #96d050;
      &:hover {
        background-color: #96d050;
        color: #fff;
      }
    }
    .editbtn {
      color: #3175d2;
      &:hover {
        color: #fff;
      }
    }
    .hourse_tab {
      height: 60px;
      display: flex;
      background-color: #fff;
      margin: 10px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      justify-content: space-between;
      align-items: center;
      padding-right: 44px;
      border-bottom: 1px solid #ecedef;
      .nav {
        display: flex;
        li {
          width: 160px;
          text-align: center;
          font-size: 14px;
          color: #666;
          height: 58px;
          line-height: 58px;
          border-bottom: 2px solid #fff;
          cursor: pointer;
          &.select_active {
            border-bottom: 2px solid #3175d2;
            color: #3175d2;
            font-weight: bolder;
          }
        }
      }
      .export {
        span {
          display: inline-block;
          width: 60px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background: rgba(222, 235, 254, 1);
          opacity: 0.9;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
  }
  .ctc-foot {
    background-color: #f9f9f9;
    display: flex;
    justify-content: space-between;
    padding: 60px 0 30px 20px;
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      background-color: #2f3f48;
      color: #fff;
    }
    .el-pagination.is-background .el-pager li:not(.disabled):hover {
      color: #999;
    }
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
  .addProjectdialog .el-dialog {
    width: 1000px;
    margin-top: 5vh !important;
  }
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #d9dce2;
  }
  .el-table__row div {
    white-space: nowrap;

    img {
      width: 97px;
      height: 80px;
    }
    .buildingImage {
      width: 120px;
      margin: 0 auto;
    }
  }
  .finalPaymentDate {
    .el-input {
      width: 100%;
    }
  }
  .dateInputBox {
    vertical-align: top;
    .dateInput {
      display: block;
      height: 40px;
      .el-form-item {
        float: left;
        width: 37.5%;
        .el-input {
          width: 100%;
        }
      }
      .el-form-item:last-child {
        margin-left: 5%;
      }
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
.plc-table-bottom {
  background: #fff;
  margin-top: 10px;
  border: 1px solid rgba(238, 238, 238, 1);
  overflow-x: auto;
  .ctable {
    width: 100%;
    overflow-x: hidden;
    td {
      font-size: 12px;
      padding: 10px 0;
      border-top: 1px solid rgba(238, 238, 238, 1);
    }
  }
}

.flowDialog {
  .dl-subtitle {
    display: inline-block;
    width: 49%;
    margin-top: 20px;
  }
  .el-form-item {
    margin: 10px 0 0 0;
    width: 81%;
    .el-select {
      width: 100%;
    }
  }
  .aliUpload {
    width: 100%;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    .oss_file {
      border: none;
      width: 100%;
      height: 100%;
      input {
        position: absolute;
        right: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }
    }
  }
}
.disBlock {
  display: block;
  width: 100%;
  height: 100%;
}
.unitlateFeeRate {
  .el-input {
    width: 80%;
  }
}
.export-error {
  display: inline-block;
  width: 90px;
  height: 26px;
  line-height: 24px;
  text-align: center;
  border: 1px solid rgba(53, 119, 246, 1);
  color: #3577f6;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: rgba(53, 119, 246, 1);
    color: #fff;
  }
}
.clearing:after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}
.clearing {
  zoom: 1;
}
</style>
