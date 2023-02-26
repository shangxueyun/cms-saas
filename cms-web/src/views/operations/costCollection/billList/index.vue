<template>
  <div class="bill-list bill-list1">
    <span class="page_head_title">费用收缴</span>
    <ul class="default_tab_block">
      <li v-if="hasAuthority('02030301')"
          @click="switchover('financial')">
        <span>费用收缴统计</span>
      </li>
      <li v-if="hasAuthority('02030320')"
          @click="switchover('tenantBills')">
        <span>客户账单</span>
      </li>
      <li v-if="hasAuthority('02030302')"
          class="active">
        <span>账单列表</span>
      </li>
      <li v-if="hasAuthority('02030323')"
          @click="switchover('flow')">
        <span>客户流水</span>
      </li>
      <li v-if="hasAuthority('02030314')"
          @click="switchover('flowBank')">
        <span>银行流水</span>
      </li>
    </ul>
    <div class="pl-content">
      <div class="search-bar bill_search_new">
        <div style="display: flex; align-items: center; flex-wrap: wrap">
          <!-- <el-select v-model="projectManagementId"
                     placeholder="项目简称"
                     multiple
                     collapse-tags
                     style="width:180px"
                     clearable>
            <el-option v-for="item in projectManagement"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select> -->
          <el-cascader :show-all-levels="false"
                       :options="options"
                       :props="props"
                       v-model="projectData"
                       @change="cascaderChange"
                       collapse-tags></el-cascader>
          <el-input v-model="referred"
                    placeholder="输入客户名称"></el-input>
          <el-select v-model="dateType"
                     class="dateType">
            <el-option label="应收时间"
                       value="finalPaymentDate"></el-option>
            <el-option label="计费周期开始时间"
                       value="startDate"></el-option>
          </el-select>
          <el-date-picker class="datePickerRadius"
                          v-model="timeArr"
                          type="daterange"
                          style="width: 250px; margin-right: 10px"
                          range-separator="-"
                          value-format="yyyy-MM-dd"
                          @change="timeChange"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
          <el-select v-model="feeType"
                     placeholder="选择费用类型"
                     clearable>
            <el-option v-for="item in options1"
                       :key="item.id"
                       :label="item.value"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="billStatus"
                     style="width: 160px"
                     multiple
                     collapse-tags
                     placeholder="账单状态"
                     clearable>
            <el-option v-for="item in options2"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <div class="query-btn"
               @click="querySearch">查询</div>
        </div>
        <div style="display: flex; align-items: center">
          <!-- <el-button
            style="margin-right: 10px"
            class="tban tban3"
            @click="OrderListShow"
            v-if="hasAuthority('02030321')"
            ><i class="iconfont icon-cms_shengcheng-"></i> 生成通知单</el-button
          > -->

          <div v-if="hasAuthority('02030303')">
            <el-dropdown trigger="hover">
              <div style="height: 32px"
                   class="el-dropdown-link">
                <el-button style="display: block"
                           class="tban tban1"><i class="iconfont icon-crm_xinzeng-"></i>
                  新增账单</el-button>
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
          <!-- <div v-if="hasAuthority('02030304')">
            <el-dropdown trigger="hover">
              <div class="morebtn1 el-dropdown-link">
                <i
                  class="icon-daochu"
                  style="font-size: 12px; margin-left: 5px"
                ></i>
                <span>导入账单</span>
                <i class="el-icon-caret-bottom" style="font-size: 14px"></i>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <span class="disBlock" @click="downLoadModel"
                    >下载收款账单模板</span
                  >
                </el-dropdown-item>
                <el-dropdown-item>
                  <span class="export-info" style="postion: relative"
                    >导入收款账单模板
                    <input
                      type="file"
                      style="
                        position: absolute;
                        opacity: 0;
                        bottom: 17px;
                        left: 0;
                        width: 123px;
                      "
                      @change="importModel($event)"
                    />
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div> -->
        </div>
      </div>
      <div class="plc-table">
        <el-table show-summary
                  :summary-method="getSummaries"
                  :data="tableData"
                  class="bill_table"
                  style="width: 100%"
                  @selection-change="handleSelectionChange"
                  ref="multipleTable">
          <el-table-column type="selection"
                           width="30"></el-table-column>
          <el-table-column prop="projectManagement.organizeName"
                           width="120"
                           label="管理企业"
                           align="center" />
          <el-table-column width="150"
                           prop="projectManagement.referred"
                           label="项目简称"
                           align="center"></el-table-column>
          <!-- <el-table-column prop="projectManagement.address"
                           label="地址"
                           align="center"></el-table-column>
          <el-table-column label="房源号"
                           align="center">
            <template slot-scope="scope"
                      v-if="scope.row.rooms">
              <span v-for="(item, index) in scope.row.rooms"
                    :key="index">
                {{item.shopNumber}}<span v-if="scope.row.rooms.length !== index + 1">、</span>
              </span>
            </template>
          </el-table-column> -->
          <el-table-column width="160"
                           prop="tenantName"
                           label="客户名称"
                           align="center"></el-table-column>
          <el-table-column width="150"
                           label="计费周期"
                           align="center">
            <template slot-scope="scope">
              {{ scope.row.startDate }}~{{ scope.row.endDate }}
            </template>
          </el-table-column>
          <el-table-column width="100"
                           prop="finalPaymentDate"
                           label="应收/应付时间"
                           align="center"></el-table-column>
          <el-table-column width="85"
                           prop="feeTypeName"
                           label="费用类型"
                           align="center"></el-table-column>
          <el-table-column :formatter="formatterAmount"
                           prop="amount"
                           label="账单金额"
                           align="center"></el-table-column>
          <!-- <el-table-column width="100"
                           :formatter="formatterWriteOffAmount"
                           prop="writeOffAmount"
                           label="已收金额"
                           align="center"></el-table-column> -->
          <el-table-column :formatter="formatterSjAmount"
                           prop="sjAmount"
                           label="已收账单金额"
                           align="center"></el-table-column>
          <el-table-column :formatter="formatterSjLateFee"
                           prop="sjLateFee"
                           label="已收滞纳金"
                           align="center"></el-table-column>
          <el-table-column :formatter="formatterArrearsAmount"
                           prop="arrearsAmount"
                           label="账单待收"
                           align="center"></el-table-column>
          <el-table-column :formatter="formatterLateFee"
                           prop="qsLateFee"
                           label="滞纳金待收"
                           align="center"></el-table-column>
          <el-table-column width="70"
                           prop="billStatus"
                           label="账单状态"
                           align="center"
                           :formatter="formatterBillStatus"></el-table-column>
          <!-- <el-table-column label="打印次数"
                           align="center"
                           prop="noticeNum"></el-table-column> -->
          <el-table-column width="70"
                           label="操作"
                           align="center"
                           v-if="hasAuthority('02030306')">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.$index, scope.row)"
                         class="el-button--primary operation-btn"
                         size="mini">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column v-if="hasAuthority('02030305')"
                           width="71"
                           align="center">
            <template slot="header"
                      slot-scope="scope">
              <el-tooltip class="item"
                          :data="scope.row"
                          effect="dark"
                          content="点击导出费用账单"
                          placement="top">
                <div @click="exportData"
                     class="export_btn">
                  <i class="iconfont icon-cms_daochushuju-1"></i><span>导出</span>
                </div>
              </el-tooltip>
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
            <td width="120">本页小计</td>
            <td width="120"></td>
            <td width="120"></td>
            <td width="120"></td>
            <td width="120">{{ statistics[0].amount }}</td>
            <td width="120">{{ statistics[0].writeOffAmount }}</td>
            <td width="120">{{ statistics[0].arrearsAmount }}</td>
            <td></td>
            <td width="120"></td>
            <td width="250"></td>
          </tr>
          <tr align="center">
            <td width="120">总计</td>
            <td width="120"></td>
            <td width="120"></td>
            <td width="120"></td>
            <td width="120">{{ statistics[1].amount }}</td>
            <td width="120">{{ statistics[1].writeOffAmount }}</td>
            <td width="120">{{ statistics[1].arrearsAmount }}</td>
            <td></td>
            <td width="120"></td>
            <td width="250"></td>
          </tr>
        </table>
      </div>

      <div class="ctc-foot1">
        <span><span style="margin-right: 10px">{{ currentPage }}/{{ Math.ceil(total / pgSize) }}页</span>
          共{{ total }}条记录</span>
        <el-pagination v-if="total > 0"
                       background
                       layout="prev, pager, next"
                       :page-size="pgSize"
                       :total="total"
                       :current-page.sync="currentPage"
                       @current-change="current_change">
        </el-pagination>
        <div class="pagingnum">
          显示
          <select v-model="pgSize"
                  @change="currentSel">
            <option v-for="item in pgNumoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"></option>
          </select>
          条目
        </div>
      </div>
    </div>
    <billDetails v-if="detailsdrawershow"
                 :detailsdrawershow="detailsdrawershow"
                 :detailsData="builddetailsData"
                 :queryBillId="queryBillId"
                 :reductionData="reductionData"
                 @drawerClose="drawerClose"
                 @handleEdit="handleEdit"
                 @query="query"
                 @showFlow="showFlow"
                 ref="billDetail" />
    <!-- 流水详情 -->
    <!-- <flowDetails v-if="flowdrawershow"
                 :detailsdrawershow="flowdrawershow"
                 :detailsData="flowDetailsData"
                 :payTypeList="payTypeList"
                 :billId="billId"
                 @drawerClose="flowDrawerClose"
                 @handleEdit="flowHandleEdit"
                 @showBill="showBill"
                 @query='flowQuery' /> -->
    <!-- 流水详情 -->
    <flowBankDetails v-if="flowdrawershow"
                     :detailsdrawershow="flowdrawershow"
                     :detailsData="flowDetailsData"
                     :payTypeList="payTypeList"
                     :billId="billId"
                     @drawerClose="flowDrawerClose"
                     @handleEdit="flowHandleEdit"
                     @showBill="showBill"
                     @query="flowQuery" />
    <!-- 选择通知单-->
    <el-drawer :visible.sync="orderListdrawershow"
               :append-to-body="true"
               size="600px"
               @close="onHideOrderList"
               class="orderListdrawer">
      <div slot="title"
           class="drawerTitle">
        <p>选择通知单</p>
      </div>
      <div class="orderList_content"
           style="border: 1px solid #eee">
        <el-table :data="orderListData"
                  style="width: 100%"
                  :row-key="getRowKeys"
                  :expand-row-keys="expands">
          <el-table-column type="expand"
                           width="40px">
            <template slot-scope="props">
              <div v-for="(item, index) in props.row.custom"
                   :key="index"
                   style="height: 40px; padding: 0 10px; margin-bottom: 10px">
                <span>{{ nameFoemat(item.name)
                  }}<i style="color: red">*</i> ：</span>
                <el-input v-model="item.val"
                          style="width: 200px"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name"
                           label="通知单名称"
                           align="center"></el-table-column>
          <el-table-column label="操作"
                           align="center">
            <template slot-scope="scope">
              <el-button @click="creatModel(scope.$index, scope.row)"
                         class="el-button--primary operation-btn"
                         size="mini">生成</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div @click="onHideOrderList"
           class="onHideOrderList">关闭</div>
    </el-drawer>
    <!-- 添加收款账单||添加付款账单 -->
    <el-dialog v-if="billDialogVisible"
               :title="addData.billType === 'R' ? '添加收款账单' : '添加付款账单'"
               :visible.sync="billDialogVisible"
               :close-on-click-modal="false"
               @close="addHide"
               class="flowDialog1 el_dialog_new">
      <div class="dialog_content">
        <el-form :model="addData"
                 :rules="addBillRules"
                 ref="addBillform">
          <div class="dl-subtitle">
            管理企业<span class="required">*</span>
            <el-form-item prop="organizeId">
              <el-select v-model="addData.organizeId"
                         placeholder="选择管理企业"
                         @change="getProject">
                <el-option v-for="item in organizesOptions"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="dl-subtitle">
            项目简称<span class="required">*</span>
            <el-form-item prop="projectManagementId">
              <el-select v-model="addData.projectManagementId"
                         @change="changeProject()"
                         placeholder="选择项目">
                <el-option v-for="item in projectOptions"
                           :key="item.id"
                           :label="item.projectName"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="dl-subtitle">
            客户名称<span class="required">*</span>
            <el-form-item prop="tenandId">
              <el-select v-model="addData.tenandId"
                         filterable
                         remote
                         :remote-method="changeProject"
                         @change="changeTenant"
                         placeholder="选择客户名称">
                <el-option v-for="item in referredArr"
                           :key="item.id"
                           :label="item.desc"
                           :value="item.id" />
              </el-select>
            </el-form-item>
          </div>
          <div class="dl-subtitle">
            合同编号
            <el-form-item>
              <el-select v-model="addData.businessId"
                         size="small"
                         value-key="id"
                         placeholder="请选择">
                <!-- <el-option value="">请选择</el-option> -->
                <el-option v-for="item in contractsArr"
                           :key="item.id"
                           :label="formatContractInfo(item)"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="dl-subtitle">
            费用类型<span class="required">*</span>
            <el-form-item prop="feeType">
              <el-select @change="choosefeeType"
                         size="small"
                         v-model="addData.feeType"
                         value-key="id"
                         placeholder="请选择">
                <!-- <el-option value="">请选择</el-option> -->
                <el-option v-for="item in options1"
                           :key="item.id"
                           :label="item.value"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </div>

          <div class="dl-subtitle dateInputBox">
            计费周期<span class="required">*</span>
            <div class="dateInput">
              <el-form-item prop="startDate">
                <el-date-picker type="date"
                                size="small"
                                value-format="yyyy-MM-dd"
                                v-model="addData.startDate"
                                :picker-options="pickerBeginDateBefore"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item prop="endDate">
                <el-date-picker type="date"
                                size="small"
                                value-format="yyyy-MM-dd"
                                v-model="addData.endDate"
                                :picker-options="pickerBeginDateAfter"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </div>

          <div class="dl-subtitle">
            账单金额<span class="required">*</span>
            <el-form-item prop="amount">
              <el-input v-model="addData.amount"
                        size="small"
                        type="number">
              </el-input>
            </el-form-item>
          </div>
          <div class="dl-subtitle">
            {{ addData.billType === "R" ? "应收时间" : "应付时间"
            }}<span class="required">*</span>
            <el-form-item class="finalPaymentDate"
                          prop="finalPaymentDate">
              <el-date-picker type="date"
                              size="small"
                              value-format="yyyy-MM-dd"
                              v-model="addData.finalPaymentDate"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="dl-subtitle"
               v-if="addData.billType === 'R' && showbillType">
            滞纳金比例
            <el-form-item class="unitlateFeeRate"
                          prop="lateFeeRate">
              <el-input v-model="addData.lateFeeRate"
                        size="small"
                        type="number">
              </el-input>
              <span>%/天</span>
            </el-form-item>
          </div>
          <div class="inlinediv"
               style="width: 100%">
            <div>备注</div>
            <el-form-item style="width: 100%; margin-bottom: 20px">
              <el-input v-model="addData.manualRemake"
                        resize="none"
                        maxlength="70"
                        placeholder="70字以内"
                        type="textarea">
              </el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer"
           class="slotfooter">
        <span @click="addHide"
              class="details_cannelBtn">关闭</span>
        <span @click="addBillSave('addBillform')"
              class="details_submitBtn">确定</span>
      </div>
    </el-dialog>
    <!-- 错误提示 -->
    <el-dialog v-if="errorPrompt"
               title="错误提示"
               :visible.sync="errorPrompt">
      <el-table :data="gridData"
                style="
          min-height: 200px;
          border-left: 1px solid #eee;
          border-right: 1px solid #eee;
        ">
        <el-table-column property="fileName"
                         label="导入文件"
                         align="center"></el-table-column>
        <el-table-column label="导入结果"
                         align="center"
                         width="220px">
          <template slot-scope="scope">
            <span style="color: red">{{ scope.row.result }}</span>
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
import billDetails from './components/billDetails'
import flowBankDetails from '../flowBank/components/flowBankDetails'
import { toLocaleString, toLocaleFixed } from '@/utils/validate.js'
import * as JSOG from 'jsog'
export default {
  name: 'billList',
  components: {
    billDetails,
    flowBankDetails
  },
  data () {
    return {
      billId: '',
      payTypeList: [],
      flowDetailsData: {},
      flowdrawershow: false,
      dateType: 'finalPaymentDate',
      timeArr: [],
      expands: [],
      loading: false,
      jobOrderIds: [], // 生成通知单的账单对应ids
      orderListData: [],
      multipleSelection: [],
      orderListdrawershow: false,
      navList: [{ label: '本期未结清', value: true }, { label: '逾期未结清', value: false }, { label: '退租未结清', value: false }, { label: '自建未结清', value: false }],
      referred: '',
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
        projectManagement: {
          organizeName: ''
        }
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
      projectManagementId: [], // 商圈
      projectManagement: [],
      feeType: '',
      options1: [],
      billStatus: [],
      options2: [{ value: 'NO', label: '未付款' }, { value: 'SECTION', label: '部分结清' }, { value: 'STAY_SETTLE', label: '待结清' }, { value: 'OK', label: '已结清' }],
      startDate: '',
      endDate: '',
      billDialogVisible: false,
      organizesOptions: [],
      projectOptions: [],
      addData: {
        organizeId: '',
        projectManagementId: '',
        tenandId: '',
        businessId: '',
        feeType: '',
        startDate: '',
        endDate: '',
        amount: '',
        finalPaymentDate: '',
        lateFeeRate: '',
        manualRemake: '',
        billType: ''
      },
      addBillRules: {
        organizeId: [
          { required: true, message: '请选择管理企业', trigger: 'change' }
        ],
        projectManagementId: [
          { required: true, message: '请选择项目简称', trigger: 'change' }
        ],
        tenandId: [
          { required: true, message: '请选择客户名称', trigger: 'change' }
        ],
        feeType: [
          { required: true, message: '请选择费用类型', trigger: 'change' }
        ],
        startDate: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        amount: [
          { required: true, message: '请填写账单金额', trigger: 'blur' }
        ],
        finalPaymentDate: [
          { required: true, message: '请选择时间', trigger: 'change' }
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
      showbillType: true,
      projectData: [],
      props: { multiple: true, emitPath: false, children: 'child', value: 'id', label: 'referred' },
      options: [],
      handleEditFlag: null
    }
  },
  created () {
    const billStatus = localStorage.getItem('billStatus')
    if (!billStatus) {
      this.billStatus = []
    } else {
      this.billStatus = billStatus.split(',')
    }
    this.getProjectOptions()
    this.getFeeType()
    this.query()
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
    let reductionId = this.$route.query.reductionId
    if (reductionId) { // 减免信息
      context.http.get(`/cms/api/reductions/${reductionId}`).then(res => {
        this.reductionData = res.data
        context.http.get(`cms/api/bills/${this.reductionData.billId}`).then(res => {
          if (res.data) {
            this.builddetailsData = res.data
            this.detailsdrawershow = true
          }
        })
        this.$refs.billDetail.exemptionVisible('edit')
      })
    }
  },
  methods: {
    formatContractInfo (item) {
      let txt = item.townContractNo ? item.townContractNo + '/' + item.startDate + '至' + item.endDate : item.startDate + '至' + item.endDate
      return txt
    },
    async getOrganizes () { // 管理企业获取接口
      // 管理企业
      let organizes = await context.http.get('/uaa/api/organizes/enterprise/user', { useStatus: 'USING', organizeType: 'ENTERPRISE' })
      this.organizesOptions = organizes.data
    },
    // 项目
    async getProject (value) {
      this.projectOptions = []
      this.addData.projectManagementId = ''
      this.addData.tenandId = ''
      this.addData.businessId = ''
      this.referredArr = []
      this.contractsArr = []
      if (!this.addData.organizeId || this.addData.organizeId.length === 0) return
      let project = await context.http.get('/cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: this.addData.organizeId })
      this.projectOptions = project.data
    },
    showBill (id) {
      let row = {}
      row.id = id
      this.flowdrawershow = false
      this.handleEdit(0, row)
    },
    showFlow (id) {
      let row = {}
      row.id = id
      this.flowHandleEdit(0, row)
    },
    flowQuery () { },
    async flowHandleEdit (index, row) {
      let result = await context.http.get(`cms/api/billFlows/${row.id}`)
      this.flowDetailsData = result.data
      this.flowdrawershow = true
      this.detailsdrawershow = false
    },
    flowDrawerClose () {
      this.flowdrawershow = false
      this.detailsdrawershow = true
      this.handleEdit(0, this.handleEditFlag)
    },
    appendUploadTips () {
      let style = 'position: fixed; left: 0; right: 0; top: 0; bottom: 0; margin: auto; display: inline-block; width: 260px; height: 50px; line-height: 50px; text-align: center; background-color: rgba(0, 0, 0, .6); color: #fff; border-radius: 5px;font-size: 16px;'
      let tipDom = `<div id="tipDom" class="tipDom" style="position: fixed; left: 0; right: 0; top: 0; bottom: 0; margin: auto;z-index: 9999999999; "><span class="pulseAni" style="${style}"><i class="el-icon-loading" style="margin-right:15px"></i>生成中... 请稍等</span></div>`
      $('body').append(tipDom)
    },
    timeChange (time) {
      if (time) {
        this.startDate = time[0]
        this.endDate = time[1]
      } else {
        this.startDate = ''
        this.endDate = ''
      }
    },
    // 获取row的key值
    getRowKeys (row) {
      return row.id
    },
    nameFoemat (name) {
      return name.substring(2, name.length - 1)
    },
    isAllEqual (array) {
      if (array.length > 0) {
        return !array.some(function (value, index) {
          return value !== array[0]
        })
      } else {
        return true
      }
    },
    creatModel (index, row) {
      if (this.loading) {
        return
      }
      this.loading = true
      let params = {}
      let keywords = []
      row.custom.forEach(res => {
        keywords.push({ 'name': res.name, 'val': res.val })
      })
      for (var i = 0; i < keywords.length; i++) {
        if (!keywords[i].val || keywords[i].val === '') {
          this.$message({
            type: 'error',
            message: '请输入关键词的值'
          })
          this.expands = []
          this.expands.push(this.orderListData[index].id)
          this.loading = false
          return
        }
      }
      this.appendUploadTips()
      params.keywords = keywords
      params.billIds = this.jobOrderIds
      context.http.post(`/cms/api/billNoticeRecord/${row.id}/produce`, params).then(res => {
        if (res.status === 200) {
          this.creatModelResult(res.data.id)
        }
      }).catch(error => {
        $('#tipDom').remove()
        this.loading = false
        console.log(error)
      })
    },
    creatModelResult (id) {
      context.http.get(`/cms/api/bill-excel/detail?excelId=${id}`).then(res => {
        if (res.data.excelResult === '审核中') {
          setTimeout(res => {
            this.creatModelResult(id)
          }, 5000)
        } else if (res.data.excelResult === '失败') {
          $('#tipDom').remove()
          this.loading = false
          this.$message({
            type: 'error',
            message: res.data.remark
          })
        } else {
          this.loading = false
          context.http.get(`/cms/api/file/getUrl?fileName=${res.data.remark}`).then(result => {
            this.query()
            $('#tipDom').remove()
            window.open(result.data)
          })
        }
      })
    },
    OrderListShow () { // 获取对应项目通知单列表
      let arr = []
      this.multipleSelection.forEach(ele => {
        arr.push(ele.projectManagement.id)
      })
      if (!this.isAllEqual(arr)) {
        this.$message({
          type: 'error',
          message: '只能选择一个项目'
        })
        return
      }
      if (!this.multipleSelection.length) {
        this.$message({
          type: 'error',
          message: '请先选择账单，再点击生成通知单'
        })
        return
      }
      this.jobOrderIds = []
      this.multipleSelection.forEach(ele => {
        this.jobOrderIds.push(ele.id)
      })
      context.http.get('/cms/api/billNoticeTemp?sort=projectManagement,asc&sort=createdDate,desc',
        {
          projectManagementId: arr[0], billNoticeStatus: 'USING', billNoticeType: 'DEFAULT'
        }).then(res => {
          this.orderListData = res.data
          this.orderListdrawershow = true
        })
    },
    onHideOrderList () { // 通知单关闭
      this.orderListdrawershow = false
    },
    handleSelectionChange (rows) {
      if (rows.length < 30 || rows.length === 30) {
        this.multipleSelection = rows
      } else {
        this.$refs.multipleTable.toggleRowSelection(rows[rows.length - 1], false)// 超出指定选择个数后，把第一个选中的selection设为false
        rows.splice(rows.length - 1, 1)// 同时要把选中第一项移除
        this.$message.error(`生成通知单数量最大不得超过${this.multipleSelection.length}条`)
        return
      }
      console.log(this.multipleSelection)
    },
    async getProjectOptions () {
      let result1 = await context.http.get('cms/api/project-managements', { useStatus: 'USING' })
      this.projectManagement = result1.data
      let result = await context.http.get('cms/api/project-managements/types/tree?useStatus=USING')
      result.data.forEach(item => {
        item.id = item.projectManagementTypeId
        item.referred = item.projectManagementTypeName
      })
      this.options = result.data
    },
    cascaderChange (val) {
      console.log(val)
    },
    querySearch () {
      console.log(this.projectData)
      this.currentPage = 1
      this.query()
    },
    addHide () {
      this.showbillType = true
      this.billDialogVisible = false
      this.addData = {
        organizeId: '',
        projectManagementId: '',
        tenandId: '',
        businessId: '',
        feeType: '',
        startDate: '',
        endDate: '',
        amount: '',
        finalPaymentDate: '',
        lateFeeRate: '',
        manualRemake: '',
        billType: ''
      }
      this.organizesOptions = []
      this.projectOptions = []
      this.referredArr = []
      this.contractsArr = []
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
      let result1 = await context.http.get('/uaa/api/paramet-managements/name', { name: '费用类型' })
      this.options1 = result1.data
      let result2 = await context.http.get('/uaa/api/paramet-managements/name', { name: '付款方式' })
      this.payTypeList = result2.data
    },
    changeProject (value) {
      if (!this.addData.projectManagementId || this.addData.projectManagementId === '') {
        this.referredArr = []
        this.contractsArr = []
        return
      }
      context.http.get('/cms/api/tenant/nameLike', { name: value || '' }).then(res => {
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
      context.http.get('/cms/api/contracts/tenant?contractType=RENT', { tenantId: this.addData.tenandId }).then(res => {
        this.contractsArr = res.data
        this.$set(this.addData, 'businessId', null)
      })
    },
    addBill (state) {
      this.addData.billType = state
      this.billDialogVisible = true
      this.getOrganizes()
    },
    addBillSave (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _this = this
          this.addData.projectManagement = {
            id: this.addData.projectManagementId
          }
          context.http.post('/cms/api/bills', this.addData).then(res => {
            if (res) {
              _this.addHide()
              _this.$message({
                message: '新增成功！',
                type: 'success'
              })
              _this.query()
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
      if (state === 'financial') {
        this.$router.push({ name: 'financialState' })
      } else if (state === 'billList') {
        this.$router.push({ name: 'billList' })
      } else if (state === 'tenantBills') {
        this.$router.push({ name: 'tenantBills' })
      } else if (state === 'flow') {
        this.$router.push({ name: 'flow' })
      } else if (state === 'flowBank') {
        this.$router.push({ name: 'flowBank' })
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
    formatterSjLateFee (row, column) {
      return toLocaleString(row.sjLateFee)
    },
    formatterWriteOffAmount (row, column) {
      return toLocaleString(row.writeOffAmount)
    },
    formatterSjAmount (row, column) {
      return toLocaleString(row.sjAmount)
    },
    formatterArrearsAmount (row, column) {
      return toLocaleString(row.arrearsAmount)
    },
    formatterLateFee (row, column) {
      return toLocaleString(row.qsLateFee)
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
        if (index === 1) {
          sums[index] = '本页小计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          // if (index === 9 || index === 10 || index === 11 || index === 12) {
          //   sums[index] = values.reduce((prev, curr) => {
          //     const value = Number(curr)
          //     if (!isNaN(value)) {
          //       let num = (prev * 100 + curr * 100) / 100
          //       return num
          //     } else {
          //       return prev
          //     }
          //   }, 0)
          // }
          if (index === 7 || index === 8 || index === 9 || index === 10 || index === 11) {
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
      sums[7] = toLocaleString(sums[7])
      sums[8] = toLocaleString(sums[8])
      sums[9] = toLocaleString(sums[9])
      sums[10] = toLocaleString(sums[10])
      sums[11] = toLocaleString(sums[11])
      return sums
    },
    async query (type, index) {
      localStorage.setItem('billStatus', this.billStatus)
      if (index) this.currentPage = index
      let result = await context.http.get('cms/api/bills/v1?sort=finalPaymentDate,asc&sort=id,desc', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        referred: this.referred,
        projectManagementId: this.projectData.toString(),
        startDate: this.startDate,
        endDate: this.endDate,
        dateType: this.dateType,
        feeType: this.feeType,
        billStatus: this.billStatus.toString()
      })
      this.tableData = result.data
      //    this.tableData.forEach(ele => {
      //      ele.amount = toLocaleString(ele.amount)
      //    })
      this.total = Number(result.headers['x-total-count'])
      //    let result1 = await context.http.get('cms/api/bills/statistics', { page: (this.currentPage - 1),
      //      size: this.pgSize,
      //      sort: 'id,desc',
      //      referred: this.referred,
      //      projectManagementId: this.projectManagementId,
      //      startDate: this.startDate,
      //      endDate: this.endDate,
      //      feeType: this.feeType,
      //      billStatus: this.billStatus})
      //    this.statistics = result1.data
    },
    bindCheckBox (value) {
      this.checkList = []
      this.checkList.push(value[1])
      this.currentPage = 1
      this.query()
    },
    async handleEdit (index, row) {
      this.handleEditFlag = row
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
      axios({
        method: 'GET',
        url: '/cms/api/bills/report',
        params: {
          referred: this.referred,
          page: (this.currentPage - 1),
          size: this.pgSize,
          sort: 'id,desc',
          projectManagementId: this.projectData.toString(),
          startDate: this.startDate,
          endDate: this.endDate,
          feeType: this.feeType,
          dateType: this.dateType,
          billStatus: this.billStatus.toString()
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
    async downLoadModel (index, row) {
      if (this.projectData.length === 0) {
        this.$message.error('请选择项目再下载模板')
        return
      } else if (this.projectData.length > 1) {
        this.$message.error('请选择单个项目再下载模板')
        return
      }
      let url = ''
      let projectId = this.projectData[0]
      url = `/cms/api/bill-excel/file?projectManagementId=${projectId}`
      if (row) {
        url = `/cms/api/bill-excel/upload?excelId=${row.id}&projectManagementId=${projectId}`
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
      if (this.projectData.length === 0) {
        event.target.value = ''
        this.$message.error('请选择项目再导入')
        return
      } else if (this.projectData.length > 1) {
        event.target.value = ''
        this.$message.error('请选择单个项目再导入')
        return
      }
      let projectId = this.projectData[0]
      if (index > 0 && type !== 'xlsx' && type !== 'xls') {
        this.$message({
          message: '格式错误，请上传xlsx、xls格式文件',
          type: 'error'
        })
      } else {
        context.http.post(`/cms/api/bill-excel/file?projectManagementId=${projectId}`, form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
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
.el-select {
  &.dateType {
    .el-input__inner {
      padding: 0 25px 0 5px;
      background-color: #f5f7fa;
      color: #909399;
    }
  }
}
.bill_search_new {
  .el-date-editor .el-range__icon,
  .el-range-separator {
    line-height: 26px !important;
  }
  .el-dropdown {
    display: block;
  }
  .datePickerRadius {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .el-cascader {
    width: 180px;
    height: 32px;
    line-height: 32px;
    margin-right: 10px;
    .el-cascader__tags {
      flex-wrap: nowrap;
      .el-tag:first-child > span {
        width: 60px;
      }
    }
    .el-input__inner {
      height: 32px !important;
    }
  }
}
.bill_table .cell {
  padding: 0 2px !important;
  .el-checkbox {
    margin-left: 5px;
  }
}
</style>
<style lang="scss" scoped>
.bill-list {
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
        margin-left: 10px;
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
        margin-left: 10px;
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
      .createOrder {
        background-color: #169bd5;
        &:hover {
          background-color: #31b4ee;
        }
      }
      .split {
        color: #dcdfe6;
        display: block;
        width: 20px;
        height: 40px;
        line-height: 40px;
        float: left;
        text-align: center;
        margin-top: 15px;
      }
      .el-select,
      .el-input {
        width: 140px;
      }
      .dateType {
        width: 88px !important;
        margin-right: -10px;
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
      margin-top: 10px;
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
        width: 47%;
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

.flowDialog1 {
  .dl-subtitle {
    display: inline-block;
    width: 45%;
    margin-bottom: 20px;
    margin-top: 0;
  }
  .el-form-item {
    margin: 10px 0 0 0;
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
.el-table th div.export_btn {
  display: flex;
  width: 56px;
  height: 26px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(229, 229, 229, 1);
  border-radius: 3px;
  font-size: 12px;
  cursor: pointer;
  i {
    display: block;
    line-height: 26px;
    font-size: 14px;
    margin-right: 3px;
    color: #262626;
  }
  span {
    display: block;
    line-height: 26px;
    color: #262626;
  }
  &:hover {
    i,
    span {
      color: #3575f6;
    }
  }
}
</style>
