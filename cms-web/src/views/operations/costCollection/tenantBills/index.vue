<template>
  <div class="tenantBills tenantBills1">
    <span class="page_head_title">费用收缴</span>
    <ul class="default_tab_block">
      <li v-if="hasAuthority('02030301')"
          @click="switchover('financial')">
        <span>费用收缴统计</span>
      </li>
      <li v-if="hasAuthority('02030320')"
          class="active">
        <span>客户账单</span>
      </li>
      <li v-if="hasAuthority('02030302')"
          @click="switchover('billList')">
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
    <div class="search-bar">
      <div class="searbar-left">
        <el-select v-model="seachParams.organizeId"
                   placeholder="选择企业"
                   style="width:250px;"
                   @change="getProject">
          <el-option v-for="item in organizesOptions"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="seachParams.projectManagementId"
                   placeholder="选择项目"
                   style="width:250px;"
                   @change="getBuilding">
          <el-option v-for="item in projectOptions"
                     :key="item.id"
                     :label="item.projectName"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="seachParams.buildingId"
                   placeholder=""
                   style="width:250px">
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
    <div class="floorChart">
      <div class="chartContent"
           v-if="floorChartArr.length>0">
        <div class="floorList"
             style="padding-bottom: 10px;">
          <div class="tenInfoItems">
            <div class="tenInfo"
                 v-for="(item1,index1) in floorChartArr"
                 :key="index1"
                 @click="showDetails(item1.id)">
              <div class="tenname">{{item1.brandName}}</div>
              <div class="status">
                <span v-if="item1.billStatus?item1.billStatus[0]:false"
                      style="background: rgb(42, 165, 44, 0.15);color: #2AA52C">
                      <i class="yuan" style="background-color: #67ab17;"></i>
                      待缴({{item1.billStatus[0]}})</span>
                <span v-if="item1.billStatus?item1.billStatus[1]:false"
                      style="background: rgb(237,55,83, 0.15);color: #ED3753">
                      <i class="yuan" style="background-color: #e70010;"></i>
                      逾期({{item1.billStatus[1]}})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="nodata"
           v-else>暂无数据</div>
    </div>
    <!-- |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| -->
    <el-drawer :visible.sync="detailsdrawershow"
               :append-to-body="true"
               size="1500px"
               @close="onHide"
               class="tenantBillsDraw">
      <div slot="title"
           class="drawerTitle">
        <p>客户账单详情</p>
      </div>
      <div class="drawBody content">
        <div class="sidebar">
          <el-collapse v-model="activeNames"
                       @change="collapseChange"
                       accordion>
            <el-collapse-item v-for="(item,index) in contractsPrevList"
                              :key="index"
                              :name="item.id+''">
              <template slot="title">
                <div class="collapseTitle">
                  <span>
                    <i></i>
                    {{item.tenant.teantName}}
                    <span v-if="item.prevId">（续）</span>
                  </span>
                </div>
              </template>
              <div class="collapseContent">
                <div class="item">
                  <div>合同编号:</div>
                  <div>{{item.contractNo}}</div>
                </div>
                <div class="item">
                  <div>合同开始时间:</div>
                  <div>{{item.startDate}}</div>
                </div>
                <div class="item">
                  <div>合同结束时间:</div>
                  <div>{{item.endDate}}</div>
                </div>
                <div class="item">
                  <div>项目:</div>
                  <div>{{item.projectManagement.referred}}</div>
                </div>
                <div class="item">
                  <div>楼宇:</div>
                  <div>{{formatBuildingName(item.buildings)}}</div>
                </div>
                <!-- <div class="item">
                  <div>房源号:</div>
                  <div :title="shopNumber">{{formatshopNumber(item.rooms)}}</div>
                </div> -->
                <div class="item">
                  <div>客户联系人:</div>
                  <div>{{item.tenant.contact}}</div>
                </div>
                <div class="item">
                  <div>联系电话:</div>
                  <div>{{item.tenant.telephone}}</div>
                </div>
                <div class="item">
                  <div>开户银行:</div>
                  <div>{{item.tenant.depositBank}}</div>
                </div>
                <div class="item">
                  <div>银行账号:</div>
                  <div>{{item.tenant.bankAccount}}</div>
                </div>
                <div class="item">
                  <div>纳税人识别号:</div>
                  <div>{{item.tenant.taxNo}}</div>
                </div>
                <div class="item">
                  <div>电话:</div>
                  <div>{{item.tenant.phone}}</div>
                </div>
                <div class="item">
                  <div>开票地址:</div>
                  <div :title="item.tenant.taxAddress">{{item.tenant.taxAddress}}</div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="min_content">
          <div class="currentBill">
            <p class="title"
               style="width:100%">
              <span>
                <i></i>
                当前账单
              </span>
              <span>
                <span class="produceBtn"
                      @click="onlineNotification">在线通知</span>
                <span class="produceBtn"
                      @click="OrderListShow"
                      v-if="hasAuthority('02030321')">生成通知单</span>
              </span>
            </p>
            <div class="tableList details_table">
              <el-table :data="tableData"
                        style="width: 100%"
                        @selection-change="handleSelectionChange"
                        ref="multipleTable">
                <!-- <el-table :data="tableData" 
                        style="width: 100%"
                        ref="multipleTable">-->
                <el-table-column type="selection"
                                 width="55"></el-table-column>
                <el-table-column prop="code"
                                 label="账单编号"
                                 align="center"
                                 show-overflow-tooltip
                                 width="180px"></el-table-column>
                <el-table-column prop="feeTypeName"
                                 label="费用类型"
                                 align="center"></el-table-column>
                <el-table-column label="账单金额"
                                 align="center">
                  <template slot-scope="scope">{{ scope.row.amount | toLocaleString }}</template>
                </el-table-column>
                <el-table-column label="计费周期"
                                 align="center"
                                 width="180px">
                  <template slot-scope="scope">
                    <div>{{ scope.row.startDate }}~{{ scope.row.endDate }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="finalPaymentDate"
                                 label="应收时间"
                                 align="center"
                                 show-overflow-tooltip
                                 width="100px">
                  <template slot-scope="scope">
                    <div>{{ scope.row.finalPaymentDate }}</div>
                    <div v-if="scope.row.onExpected"
                         style="color:red">已逾期{{scope.row.expectedDay}}天</div>
                  </template>
                </el-table-column>
                <el-table-column label="账单状态"
                                 align="center"
                                 :formatter="formatStatus"></el-table-column>
                <el-table-column label="打印次数"
                                 align="center"
                                 width="80px"
                                 prop="noticeNum"></el-table-column>
                <el-table-column label="最后推送时间"
                                 align="center"
                                 width="140px"
                                 :formatter="formatterTime"
                                 prop="pushTime"></el-table-column>
                <el-table-column label="操作"
                                 align="center">
                  <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.$index, scope.row)"
                               class="el-button--primary operation-btn"
                               size="mini">查看</el-button>
                    <!-- <el-button v-if="hasAuthority('02030321')"
                               @click="OrderListShow(scope.row)"
                               class="el-button--primary operation-btn"
                               size="mini">生成通知单</el-button> -->
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="ctc-foot">
              <span><span style="margin-right:10px">{{currentPage}}/{{totalPages}}页</span> 共{{total}}条记录</span>
              <el-pagination v-if="total > 0"
                             background
                             layout="prev, pager, next"
                             :page-size="pgSize"
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
          <div class="historyBill">
            <p class="title"
               style="width:100%">
              <span :class="{'active':billTime==='HISTORY'}"
                    @click="billTypeChange('HISTORY')">历史账单</span>
              <span :class="{'active':billTime==='FUTURE'}"
                    @click="billTypeChange('FUTURE')">预期账单</span>
            </p>
            <div class="seachDiv">
              <div style="display: flex;align-items: center;">
                <el-select v-model="billsType"
                           style="width:250px;margin-right:20px;"
                           clearable
                           placeholder="选择费用类型">
                  <el-option v-for="item in options3"
                             :key="item.id"
                             :label="item.value"
                             :value="item.id">
                  </el-option>
                </el-select>
                <div class="marginRights marginNone">
                  <el-date-picker v-model="startDate"
                                  v-if="billTime==='HISTORY'"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  placeholder="开始时间"
                                  :editable="false"
                                  :clearable="false"
                                  :picker-options="pickerBeginDateBefore">
                  </el-date-picker>
                  <el-date-picker v-model="startDate1"
                                  v-if="billTime==='FUTURE'"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  placeholder="开始时间"
                                  :editable="false"
                                  :picker-options="pickerBeginDateBefore1"
                                  :clearable="false">
                  </el-date-picker>
                </div>
                <div class="split"
                     style="margin:0 4px;color:#e5e5e5">-</div>
                <div class="marginRights">
                  <el-date-picker v-model="endDate"
                                  v-if="billTime==='HISTORY'"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  placeholder="结束时间"
                                  :editable="false"
                                  :clearable="false"
                                  :picker-options="pickerBeginDateAfter">
                  </el-date-picker>
                  <el-date-picker v-model="endDate1"
                                  type="date"
                                  v-if="billTime==='FUTURE'"
                                  value-format="yyyy-MM-dd"
                                  placeholder="结束时间"
                                  :editable="false"
                                  :clearable="false">
                  </el-date-picker>
                </div>
                <div class="query-btn"
                     @click="querySeach"
                     style="margin-top:0;width:70px">查询</div>
              </div>
              <!-- <div class="btnDiv">
                <span class="iconfont icon-liebiao401" :class="{'active':showType === 1}" title="展示表格" @click="changeShowType(1)"></span>
                <span class="iconfont icon-tubiao" :class="{'active':showType === 2}" title="展示柱状图" @click="changeShowType(2)"></span> 
              </div> -->
            </div>
            <div class="tableList details_table"
                 style="margin-top:0"
                 v-show="showType===1">
              <el-table :data="tableData1"
                        style="width: 100%">
                <el-table-column prop="code"
                                 label="账单编号"
                                 align="center"
                                 show-overflow-tooltip
                                 width="200px"></el-table-column>
                <el-table-column prop="feeTypeName"
                                 label="费用类型"
                                 align="center"></el-table-column>
                <el-table-column label="账单金额"
                                 align="center">
                  <template slot-scope="scope">{{ scope.row.amount | toLocaleString }}</template>
                </el-table-column>
                <el-table-column label="计费周期"
                                 align="center"
                                 width="200px">
                  <template slot-scope="scope">
                    <div>{{ scope.row.startDate }}~{{ scope.row.endDate }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="finalPaymentDate"
                                 label="应收时间"
                                 align="center"
                                 width="200px"
                                 show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div>{{ scope.row.finalPaymentDate }}</div>
                    <div v-if="scope.row.onExpected"
                         style="color:red">已逾期{{scope.row.expectedDay}}天</div>
                  </template>
                </el-table-column>
                <el-table-column prop="receivedDate"
                                 v-if="billTime==='HISTORY'"
                                 label="实收时间"
                                 align="center"
                                 width="200px"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="账单状态"
                                 align="center"
                                 :formatter="formatStatus"></el-table-column>
                <el-table-column label="操作"
                                 align="center"
                                 v-if="hasAuthority('02030306')">
                  <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.$index, scope.row)"
                               class="el-button--primary operation-btn"
                               size="mini">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="ctc-foot"
                 v-show="showType===1">
              <span><span style="margin-right:10px">{{currentPage1}}/{{totalPages1}}页</span> 共{{total1}}条记录</span>
              <el-pagination v-if="total > 0"
                             background
                             layout="prev, pager, next"
                             :page-size="pgSize1"
                             :total="total1"
                             :current-page="currentPage1"
                             @current-change="current_change1">
              </el-pagination>
              <div class="pagingnum">
                显示 <select v-model="pgSize1"
                        @change="currentSel1">
                  <option v-for="item in pgNumoptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                  </option>
                </select>
                条目
              </div>
            </div>
            <div class="chart"
                 v-show="showType===2">
              <div id="myChart"
                   :style="{width: '100%', height: '90%'}"></div>
            </div>
            <div style="min-height:200px;position:relative"
                 v-show="chartData.length===0 && showType===2">
              <div class="nodata">暂无数据</div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
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
           style="border:1px solid #eee;">
        <el-table :data="orderListData"
                  style="width: 100%"
                  :row-key="getRowKeys"
                  :expand-row-keys="expands">
          <el-table-column type="expand"
                           width="40px">
            <template slot-scope="props">
              <div v-for="(item,index) in props.row.custom"
                   :key=index
                   style="height:40px;padding:0 10px;margin-bottom: 10px;">
                <span>{{nameFoemat(item.name)}}<i style="color:red">*</i> ：</span>
                <el-input v-model="item.val"
                          style="width:200px"
                          onkeyup="this.value=this.value.replace(/^\s+|\s+$/g,'')"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name"
                           label="通知单名称"
                           align="center"></el-table-column>
          <el-table-column label="操作"
                           align="center">
            <template slot-scope="scope">
              <span @click="creatModel(scope.$index, scope.row)"
                    class="el-button--primary generate-btn">逐条生成</span>
              <span class="left-border"
                    v-if="scope.row.billNoticeType === 'MERGE'"></span>
              <span @click="creatModel(scope.$index, scope.row, 'merge')"
                    v-if="scope.row.billNoticeType === 'MERGE'"
                    class="el-button--primary generate-btn">合并生成</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div @click="onHideOrderList"
           class="onHideOrderList">关闭</div>
    </el-drawer>
    <!-- 账单详情 -->
    <billDetails :detailsdrawershow="billDetailsdrawershow"
                 :detailsData="builddetailsData"
                 :queryBillId="queryBillId"
                 :reductionData="reductionData"
                 @drawerClose="drawerClose"
                 @billsSubSuccess="billsSubSuccess"
                 @handleEdit="handleEditEmit"
                 @showFlow="showFlow"
                 ref="billDetail" />
    <!-- 流水详情 -->
    <flowBankDetails v-if="flowdrawershow"
                     :detailsdrawershow="flowdrawershow"
                     :detailsData="flowDetailsData"
                     :payTypeList="payTypeList"
                     :billId="billId"
                     @drawerClose="flowDrawerClose"
                     @handleEdit="flowHandleEdit"
                     @showBill="showBill"
                     @query='flowQuery' />

    <!-- 提示 -->
    <el-dialog v-if="showNotif"
               title="提示"
               width="500px"
               :visible.sync="showNotif"
               :close-on-click-modal="false"
               class="flowDialog1 el_dialog_new">
      <div class="dialog_content">
        <div>您已选择：</div>
        <div v-for="(item, index) in multipleSelection"
             :key="index">
          {{item.feeTypeName}}，{{item.startDate}}~{{item.endDate}}，已逾期<span>{{item.expectedDay || 0}}</span>天；
        </div>
        <div>是否确认推送？</div>
      </div>
      <div slot="footer"
           class="slotfooter">
        <span @click="showNotif = false"
              class="details_cannelBtn">取消</span>
        <span @click="determineNotif"
              class="details_submitBtn">确定</span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
import billDetails from '@/views/operations/costCollection/billList/components/billDetails.vue'
import flowBankDetails from '../flowBank/components/flowBankDetails'
export default {
  name: 'financialState',
  components: {
    billDetails,
    flowBankDetails
  },
  data () {
    return {
      showNotif: false,
      shopNumber: '',
      billTime: 'HISTORY', // 历史未来账单
      expands: [],
      loading: false,
      jobOrderIds: [], // 生成通知单的账单对应ids
      orderListData: [],
      orderListdrawershow: false,
      multipleSelection: [],
      chartData: [],
      contractsPrevList: [], // 续签合同列表
      contractId: '', // 合同
      builddetailsData: {
        projectManagement: {
          organizeName: ''
        }
      }, // 账单详情
      billDetailsdrawershow: false,
      queryBillId: '',
      reductionData: {},
      showType: 1,
      billsType: '',
      startEndTime: [],
      startDate: '',
      endDate: '',
      startDate1: '',
      endDate1: '',
      tableData: [],
      tableData1: [],
      currentPage: 1,
      currentPage1: 1,
      total: 0,
      total1: 0,
      pgSize: 15,
      pgSize1: 15,
      totalPages: 1,
      totalPages1: 1,
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
      activeNames: '0',
      detailsdrawershow: false,
      projectManagementId: '', // 项目
      buildingId: '', // 楼宇
      options1: [],
      organizesOptions: [],
      projectOptions: [],
      buildingOptions: [],
      seachParams: {
        organizeId: '',
        projectManagementId: '',
        buildingId: ''
      },
      seachParamsFlag: false,
      options2: [],
      options3: [],
      floorChartArr: [],
      pickerBeginDateBefore: {
        disabledDate: time => {
          let endDateVal = this.endDate
          if (endDateVal) {
            let temp = new Date(endDateVal).getTime() - 365 * 24 * 60 * 60 * 1000
            return time.getTime() < new Date(temp).getTime()
          }
        }
      },
      pickerBeginDateAfter: {
        disabledDate: time => {
          let beginDateVal = this.startDate
          if (beginDateVal) {
            let temp = new Date(beginDateVal).getTime() + 364 * 24 * 60 * 60 * 1000
            return time.getTime() > new Date(temp).getTime()
          }
        }
      },
      pickerBeginDateBefore1: {
        disabledDate: time => {
          let endDateVal = this.startDate1
          if (endDateVal) {
            let temp = new Date(endDateVal).getTime()
            return time.getTime() < new Date(temp).getTime() - 24 * 60 * 60 * 1000
          }
        }
      },
      flowDetailsData: {},
      flowdrawershow: false,
      billId: '',
      payTypeList: [],
      showMergeGeneration: true
      // pickerBeginDateAfter1: {
      //   disabledDate: time => {
      //     let beginDateVal = this.startDate1
      //     if (beginDateVal) {
      //       let temp = new Date(beginDateVal).getTime() + 364 * 24 * 60 * 60 * 1000
      //       return time.getTime() > new Date(temp).getTime()
      //     }
      //   }
      // }
    }
  },
  created () {
    // this.options1 = this.$store.state.projectManagementsList
    // this.projectManagementId = this.options1[0].id
    this.getOrganizes()
    let now = new Date()
    let next = new Date()
    this.startDate = now.getFullYear() + '-01-01'
    this.endDate = this.getCurrentMonthLastDay()
    this.startDate1 = this.getNextMonth(this.formatDate(now))
    // this.endDate1 = this.getCurrentMonthLastDay1()
    this.getFeeType()
  },
  mounted () {

  },
  methods: {
    formatDate (date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      return y + '-' + m + '-' + d
    },
    getNextMonth (date) {
      var arr = date.split('-')
      var year = arr[0] // 获取当前日期的年份
      var month = arr[1] // 获取当前日期的月份
      var day = arr[2] // 获取当前日期的日
      var days = new Date(year, month, 0)
      days = days.getDate() // 获取当前日期中的月的天数
      var year2 = year
      var month2 = parseInt(month) + 1
      if (month2 === 13) {
        year2 = parseInt(year2) + 1
        month2 = 1
      }
      var day2 = day
      var days2 = new Date(year2, month2, 0)
      days2 = days2.getDate()
      if (day2 > days2) {
        day2 = days2
      }
      if (month2 < 10) {
        month2 = '0' + month2
      }

      var t2 = year2 + '-' + month2 + '-' + '01'
      var year3 = Number(year2) + 1
      this.endDate1 = year3 + '-' + month2 + '-' + '01'
      return t2
    },
    async getOrganizes () { // 管理企业获取接口
      // 管理企业
      let organizes = await context.http.get('/uaa/api/organizes/enterprise/user', { useStatus: 'USING', organizeType: 'ENTERPRISE' })
      this.organizesOptions = organizes.data
      this.seachParams.organizeId = this.organizesOptions[0].id
      if (this.seachParams.organizeId) {
        // 项目
        this.getProject()
      } else {
        this.query()
      }
    },
    // 项目
    async getProject () {
      this.projectOptions = []
      this.seachParams.projectManagementId = ''
      this.buildingOptions = []
      this.seachParams.buildingId = ''
      let project = await context.http.get('/cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: this.seachParams.organizeId })
      this.projectOptions = project.data
      this.seachParams.projectManagementId = this.projectOptions[0].id
      // 楼宇
      this.getBuilding()
    },
    // 楼宇
    async getBuilding () {
      this.buildingOptions = []
      this.seachParams.buildingId = ''
      let building = await context.http.get(`cms/api/project/${this.seachParams.projectManagementId}/buildings`, { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING' })
      this.buildingOptions = building.data
      this.seachParams.buildingId = this.buildingOptions[0].id
      if (!this.seachParamsFlag) {
        this.getContractItemList()
        this.seachParamsFlag = true
      }
    },
    getCurrentMonthLastDay1 () {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      var day = date.getDate()
      return year + '-' + month + '-' + day
    },
    billsSubSuccess (contractsId, show) { // 在账单详情页面编辑成功接收事件
      this.getContractsPrev(contractsId, show)
    },
    appendUploadTips () {
      let style = 'position: fixed; left: 0; right: 0; top: 0; bottom: 0; margin: auto; display: inline-block; width: 260px; height: 50px; line-height: 50px; text-align: center; background-color: rgba(0, 0, 0, .6); color: #fff; border-radius: 5px;font-size: 16px;'
      let tipDom = `<div id="tipDom" class="tipDom" style="position: fixed; left: 0; right: 0; top: 0; bottom: 0; margin: auto;z-index: 9999999999; "><span class="pulseAni" style="${style}"><i class="el-icon-loading" style="margin-right:15px"></i>生成中... 请稍等</span></div>`
      $('body').append(tipDom)
    },
    // 获取row的key值
    getRowKeys (row) {
      return row.id
    },
    nameFoemat (name) {
      return name.substring(2, name.length - 1)
    },
    creatModel (index, row, type) { // 生成通知单
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
      if (type === 'merge') {
        context.http.post(`/cms/api/billNoticeRecord/${row.id}/merge`, params).then(res => {
          if (res.status === 200) {
            this.queryExportResult(res.data.id)
          }
        }).catch(error => {
          $('#tipDom').remove()
          this.loading = false
          console.log(error)
        })
      } else {
        context.http.post(`/cms/api/billNoticeRecord/${row.id}/produce`, params).then(res => {
          if (res.status === 200) {
            this.queryExportResult(res.data.id)
          }
        }).catch(error => {
          $('#tipDom').remove()
          this.loading = false
          console.log(error)
        })
      }
    },
    queryExportResult (id) {
      context.http.get(`/cms/api/bill-excel/detail?excelId=${id}`).then(res => {
        if (res.data.excelResult === '审核中') {
          setTimeout(res => {
            this.queryExportResult(id)
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
            this.getBiils(this.contractId)
            $('#tipDom').remove()
            window.open(result.data)
          })
        }
      })
    },
    OrderListShow (row) { // 获取对应项目通知单列表
      if (!this.multipleSelection.length) {
        this.$message({
          type: 'error',
          message: '请先选择账单，再点击生成通知单'
        })
        return
      }
      // console.log(row)
      this.jobOrderIds = []
      this.multipleSelection.forEach(ele => {
        this.jobOrderIds.push(ele.id)
      })
      // this.jobOrderIds.push(row.id)
      context.http.get('/cms/api/billNoticeTemp?sort=projectManagement,asc&sort=createdDate,desc',
        { projectManagementId: this.projectManagementId, billNoticeStatus: 'USING' }).then(res => {
          this.orderListData = res.data
          this.orderListdrawershow = true
        })
    },
    formatBuildingName (buildingNameArr) {
      let arr = []
      let ids = []
      buildingNameArr.forEach(item => {
        if (ids.indexOf(item.id) === -1) {
          arr.push(item.buildingName)
          ids.push(item.id)
        }
      })
      return arr.join('、')
    },
    formatshopNumber (shopNumberArr) {
      let arr = []
      shopNumberArr.forEach(item => {
        arr.push(item.shopNumber)
      })
      this.shopNumber = arr.join('、')
      return arr.join('、')
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
    },
    querySeach () {
      if (this.showType === 1) {
        this.getBiils_history(this.contractId)
      } else {
        this.query()
      }
    },
    changeShowType (n) {
      if (n === 2) {
        this.query()
      } else {
        this.getBiils(this.contractId)
        this.getBiils_history(this.contractId)
      }
      this.showType = n
    },
    async getFeeType () {
      let result = await context.http.get('/uaa/api/paramet-managements/name', { name: '费用类型' })
      this.options3 = result.data
      let result2 = await context.http.get('/uaa/api/paramet-managements/name', { name: '付款方式' })
      this.payTypeList = result2.data
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
    async getContractItemList () { // 根据项目、楼层查询合同
      let result = await context.http.get(`cms/api/contracts/graph`, {
        buildId: this.seachParams.buildingId,
        projectId: this.seachParams.projectManagementId
      })
      this.floorChartArr = result.data.graphDTOS
    },
    getContractsPrev (contractsId, show) { // 根据合同id查询存在续签关系的合同
      context.http.get(`cms/api/contracts/prev`, { contractId: contractsId }).then(res => {
        this.contractsPrevList = []
        res.data.forEach(v => {
          if (v.tenant.teantName.length >= 15) {
            v.tenant.teantName = v.tenant.teantName.substring(0, 12) + '. . .'
          }
          this.contractsPrevList.push(v)
        })
        this.contractId = res.data[0].id
        this.activeNames = res.data[0].id + ''
        this.getBiils(this.contractId)
        this.getBiils_history(this.contractId)
        if (show !== 'showFalse') this.detailsdrawershow = true
      }).catch(error => {
        console.log(error)
      })
    },
    collapseChange (contractsId) {
      if (contractsId === '') {
        return
      }
      this.showType = 1
      this.contractId = contractsId
      let id = contractsId + ''
      this.getBiils(id)
      this.getBiils_history(id)
    },
    showDetails (contractsId) {
      this.getContractsPrev(contractsId)
    },
    handleEdit (index, row) { // 账单详情
      context.http.get(`cms/api/bills/${row.id}`).then(res => {
        this.builddetailsData = res.data
        this.billDetailsdrawershow = true
        this.queryBillId = row.id.toString()
        this.detailsdrawershow = false
      })
    },
    async handleEditEmit (index, row) {
      let result = await context.http.get(`cms/api/bills/${row.id}`)
      this.builddetailsData = JSOG.decode(result.data)
      this.billDetailsdrawershow = true
    },
    drawerClose (contractsId) { // 账单详情关闭
      this.getContractsPrev(contractsId)
      this.billDetailsdrawershow = false
      this.detailsdrawershow = true
      this.currentPage1 = 1
      this.currentPage = 1
    },
    async getBiils (id) {
      let result = await context.http.get('cms/api/bills/contract', {
        contractId: id,
        queryType: 'CURRENT',
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'finalPaymentDate,asc'
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      this.totalPages = Math.ceil(this.total / this.pgSize)
    },
    async getBiils_history (id) {
      let startDate, endDate
      if (this.billTime === 'HISTORY') {
        startDate = this.startDate
        endDate = this.endDate
      } else {
        startDate = this.startDate1
        endDate = this.endDate1
      }
      let result = await context.http.get('cms/api/bills/contract',
        {
          contractId: id,
          queryType: this.billTime,
          feeType: this.billsType,
          startDate: startDate,
          endDate: endDate,
          sort: 'finalPaymentDate,asc',
          page: (this.currentPage1 - 1),
          size: this.pgSize1
        })
      this.tableData1 = result.data
      this.total1 = Number(result.headers['x-total-count'])
      this.totalPages1 = Math.ceil(this.total1 / this.pgSize1)
    },
    billTypeChange (n) {
      this.billTime = n
      this.getBiils_history(this.contractId)
    },
    getCurrentMonthLastDay () {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      var day = new Date(year, month, 0)
      return year + '-' + month + '-' + day.getDate()
    },
    formatStatus (row, column) {
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
    formatterTime (row, column) {
      if (row.pushTime) {
        return row.pushTime.replace('T', '  ')
      }
    },
    currentSel () {
      this.currentPage = 1
      this.getBiils(this.contractId)
    },
    currentSel1 () {
      this.currentPage1 = 1
      this.getBiils_history(this.contractId)
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.getBiils(this.contractId)
    },
    current_change1 (currentPage) {
      this.currentPage1 = currentPage
      this.getBiils_history(this.contractId)
    },
    onHide () {
      this.currentPage1 = 1
      this.currentPage = 1
      this.showType = 1
      this.detailsdrawershow = false
      this.getContractItemList()
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
      // return true
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
    async query () {
      let result = await context.http.get('cms/api/bills/finance', {
        billStatus: 'OK',
        businessId: this.contractId,
        businessType: 'CONTRACT',
        startDate: this.startDate,
        endDate: this.endDate,
        feeType: this.billsType
      })
      this.chartData = result.data
      if (result.data.length === 0) {
        $('.chart').hide()
        return
      }
      $('.chart').show()
      let dateArray = []
      let shishou = []
      let shouru = []
      let completeRate = []
      let max = ''
      result.data.forEach(ele => {
        dateArray.push((ele.date).substring(0, 7).replace('-', '.'))
        shishou.push(ele.sjAmount)
        shouru.push(ele.amount)
        completeRate.push(ele.rate)
      })
      let allAry = [...shishou, ...shouru]
      let totalMax = Math.max.apply(null, allAry)
      if (dateArray.length === 0) {
        dateArray = ['2019.01', '2019.02', '2019.03', '2019.04', '2019.05', '2019.06', '2019.07', '2019.08', '2019.09', '2019.10', '2019.11', '2019.12']
        totalMax = 50000
      }
      this.drawLine(dateArray, shishou, shouru, completeRate, totalMax)
    },
    drawLine (dateArray, shishou, shouru, completeRate, max) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      myChart.clear()
      // 绘制图表
      var colors = ['#3175D2']
      let option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
          // formatter: function (params) {
          //   return '<p>' + dateArray[params[0].dataIndex] + '</p>' + '<p>账单金额:' + completeRate[params[0].dataIndex] + '</p>'
          // }
        },
        grid: {
          top: '50px',
          left: '100px',
          right: '60px',
          bottom: '50px'
        },
        legend: {
          x: 'center',
          y: 'bottom',
          bottom: '0px',
          data: ['账单金额']
        },
        xAxis: [
          {
            type: 'category',
            name: '日期',
            axisTick: {
              alignWithLabel: true
            },
            data: dateArray
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '金额(元)',
            min: 0,
            position: 'left',
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '账单金额',
            type: 'bar',
            data: shouru,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top',
                  textStyle: {
                    color: '#333333',
                    fontSize: 12
                  }
                }
              }
            }
          }
          // {
          //   name: '应收',
          //   type: 'bar',
          //   data: shouru,
          //   itemStyle: {
          //     normal: {
          //       label: {
          //         show: true,
          //         position: 'top',
          //         textStyle: {
          //           color: '#333333',
          //           fontSize: 12
          //         }
          //       }
          //     }
          //   }
          // }
        ]
      }
      myChart.setOption(option)
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
    async flowHandleEdit (index, row) {
      let result = await context.http.get(`cms/api/billFlows/${row.id}`)
      console.log('1')
      this.flowDetailsData = result.data
      this.flowdrawershow = true
      this.billDetailsdrawershow = false
    },
    flowQuery () { },
    flowDrawerClose () {
      this.flowdrawershow = false
      this.billDetailsdrawershow = true
    },
    onlineNotification () {
      if (!this.multipleSelection.length) {
        this.$message({
          type: 'error',
          message: '请先选择账单，再点击在线通知'
        })
        return
      }
      this.showNotif = true
    },
    determineNotif () {
      let jobOrderIds = []
      this.multipleSelection.forEach(ele => {
        jobOrderIds.push(ele.id)
      })
      context.http.get(`/cms/api/bills/expireNotice?billIds=${jobOrderIds}`).then(res => {
        if (res.status === 200) {
          this.$message.success('操作成功')
          this.showNotif = false
          this.multipleSelection = []
          this.$refs.multipleTable.clearSelection()
          this.getBiils(this.contractId)
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
.tenantBills1 {
  .vue-drawer {
    // z-index: 5999;
  }
}
.orderListdrawer {
  .onHideOrderList {
    position: absolute;
    bottom: 25px;
    height: 40px;
    line-height: 40px;
    border: 1px solid #888;
    padding: 0 50px;
    cursor: pointer;
    right: 20px;
  }
}
.tenantBillsDraw {
  > div {
    > .el-drawer {
      background-color: #faf7fa !important;
      .el-drawer__header {
        padding: 0;
        margin: 0;
        height: 60px;
        line-height: 60px;
        background-color: #ffffff;
        padding-left: 15px;
        font-weight: bold;
        border: none;
        display: flex;
        align-items: center;
        color: #262626;
        .el-drawer__close-btn {
          font-size: 24px;
          color: #b9b9b9;
        }
        .drawerTitle {
          color: #262626;
          font-size: 16px;
        }
      }

      .el-drawer__body {
        margin: 0;
        height: calc(100% - 60px);
        overflow: auto;
        margin-top: 12px;
        &::-webkit-scrollbar {
          width: 4px !important;
          height: 4px !important;
        }
        &::-webkit-scrollbar-track {
          box-shadow: inset 0 0 6px #fff;
          background-color: #fff;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          box-shadow: inset 0 0 6px #cccccc;
        }
        .shopList {
          padding: 10px;
          border-top: 1px solid #f2f2f2;
          margin: 0;
          background-color: #ffffff;
        }
        .el-collapse-item {
          .el-collapse-item__header {
            background-color: #ffffff;
            &.is-active {
              border-bottom-color: #f6f6f6;
            }
            .collapseTitle {
              padding-left: 15px;
              > span {
                display: flex;
                align-items: center;
                > i {
                  display: inline-block;
                  width: 4px;
                  height: 16px;
                  background: rgba(53, 117, 246, 1);
                  border-radius: 2px;
                  margin-right: 5px;
                }
              }
            }
          }
        }
      }
      .el-dialog__footer {
        padding: 0;
        background-color: #ffffff;
        margin-top: 15px;

        .dialog-footer {
          height: 80px;
          display: flex;
          flex-direction: row-reverse;
          align-items: center;

          > span {
            display: inline-block;
            width: 90px;
            height: 34px;
            line-height: 34px;
            text-align: center;
            cursor: pointer;
            color: #666666;

            &.subBtn {
              background-color: #3577f6;
              color: #ffffff;
              border-radius: 4px;
            }
          }
        }
      }
    }
  }

  .ctc-foot {
    justify-content: normal;
    flex-direction: row-reverse;
    align-items: center;
    color: #3f5fbf;
    font-size: 12px;
    padding: 60px 20px 30px 20px;

    .pagingnum {
      color: #3f5fbf;
      font-size: 12px;

      select {
        width: 65px;
        height: 28px;
        border-radius: 2px;
        border-color: #f6f6f7;
        color: #3577f6;
      }
    }

    .el-pagination.is-background .btn-next,
    .el-pagination.is-background .btn-prev,
    .el-pagination.is-background .el-pager li {
      margin: 0 5px;
      background-color: transparent;
      color: #3f5fbf;
      min-width: 30px;
      border-radius: 2px;
      font-size: 14px;
    }

    .el-pagination.is-background .el-pager li:not(.disabled).active {
      border-radius: 50%;
      background-color: #3f5fbf !important;
      color: #fff !important;
    }
  }
}
.generate-btn {
  background-color: #fff !important;
  border-color: #3577f6 !important;
  color: #3577f6 !important;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    background: none;
  }
}
.left-border {
  display: inline-block;
  height: 10px;
  width: 1px;
  border-left: 1px solid #3577f6;
  position: relative;
  top: 1px;
  margin: 0 4px;
}
</style>
<style lang="scss" scoped>
.tenantBillsDraw {
  .drawBody {
    // border: 1px solid #eee;
    min-height: 600px;
    display: flex;
    .min_content {
      width: 1160px;
      margin-left: 12px;
      .tableList {
        margin-top: 20px;
        border-top: 1px solid #eee;
        padding: 1px;
      }
      .currentBill {
        min-height: 400px;
        margin-bottom: 12px;
        background-color: #ffffff;
        .title {
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          padding-left: 15px;
          border-bottom: 1px solid #f4f4f4;
          display: flex;
          justify-content: space-between;
          padding-right: 15px;
          align-items: center;
          > span {
            display: flex;
            align-items: center;
            i {
              display: inline-block;
              width: 4px;
              height: 16px;
              background: rgba(53, 117, 246, 1);
              border-radius: 2px;
              margin-right: 5px;
            }
          }
          .produceBtn {
            padding: 5px 10px;
            cursor: pointer;
            background-color: #fff !important;
            border-color: #3577f6 !important;
            color: #3577f6 !important;
            border-radius: 3px;
            border: 1px solid;
            height: 30px;
            line-height: 30px;
            padding: 0 10px;
            font-size: 12px;
            margin-left: 10px;
            &:hover {
              background-color: #3577f6 !important;
              border-color: #3577f6 !important;
              color: #fff !important;
            }
          }
        }
      }
      .historyBill {
        min-height: 400px;
        background-color: #ffffff;
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
        .chart {
          height: 500px;
        }
        .title {
          height: 46px;
          line-height: 46px;
          font-size: 14px;
          padding-left: 15px;
          border-bottom: 1px solid #f4f4f4;
          > span {
            display: inline-block;
            padding: 0 10px;
            height: 45px;
            color: #777777;
            cursor: pointer;
            &.active {
              color: #3175f6;
              border-bottom: 2px solid #3175f6;
              cursor: pointer;
            }
          }
        }
        .seachDiv {
          height: 80px;
          background-color: #ffffff;
          display: flex;
          align-items: center;
          padding: 0 20px;
          justify-content: space-between;
          .btnDiv {
            span {
              margin-right: -5px;
              display: inline-block;
              width: 30px;
              height: 25px;
              font-size: 16px;
              background-color: #ffffff;
              border: 1px solid #eee;
              text-align: center;
              line-height: 25px;
              cursor: pointer;
              box-shadow: inset -1px -1px 3px #dadada;
              &:first-child {
                border-top-left-radius: 5px;
                border-bottom-left-radius: 5px;
              }
              &:last-child {
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
              }
              &.active {
                background-color: #f2f2f2ff;
              }
            }
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
          span {
            margin-right: 40px;
          }
        }
      }
    }
    .sidebar {
      width: 300px;
      min-height: 600px;
      background-color: #ffffff;
      border-top: none;
    }
    .collapseContent {
      > .item {
        height: 40px;
        // line-height: 40px;
        display: flex;
        padding: 0 10px;
        > div {
          &:first-child {
            font-size: 12px;
            font-weight: bold;
            // width: 80px;
            text-align: left;
            white-space: nowrap;
          }
          &:last-child {
            font-size: 12px;
            color: #808080;
            // width: 200px;
            text-align: left;
            padding-left: 5px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
.tenantBills {
  .floorChart {
    min-height: 650px;
    background-color: #ffffff;
    padding-right: 40px;
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
      margin: 10px 0;
      border-bottom: 1px solid #eee;
      .tenInfoItems {
        flex-wrap: wrap;
        display: flex;
        width: 93%;
        padding: 20px;
      }
      .floorName {
        width: 6.5%;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: bold;
      }
      .tenInfo {
        width: 220px;
        height: 100px;
        font-size: 14px;
        padding: 0 16px;
        background-color: #fdfeff;
        cursor: pointer;
        margin: 10px 10px 10px 0;
        border-radius: 6px;
        border: 1px solid #589fd9;
        line-height: 44px;
        text-align: left;
        &:hover {
          box-shadow: 0px 0px 18px 0px rgba(0, 61, 183, 0.15);
        }
        > div {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #666;
          // line-height: 34px;
        }
        >.roomNb{
          line-height: 14px;
          height: 14px;
        }
        >.tenname{
          color:#666666;
          font-weight: 500;
        }
      }
      .status {
        > span {
          padding: 4px 12px;
          color: #ffffff;
          border-radius: 16px;
          padding-bottom: 6px;
          position: relative;
          padding-left: 18px;
          font-size: 12px;
          >i {
            width: 6px;
            height: 6px;
            display: inline-block;
            border-radius: 50%;
            position: absolute;
            top: 42%;
            left: 8px;
          }
          &:first-child {
            background-color: #67ab17;
            // >i {
            //   background-color: #67ab17;
            // }
          }
          &:last-child {
            background-color: #e70010;
            // >i {
            //   background-color: #e70010;
            // }
          }
        }
      }
    }
    > p {
      height: 50px;
      padding-left: 15px;
      line-height: 50px;
      font-size: 14px;
      border-bottom: 1px solid #eee;
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
    margin-top: 15px;
    border-radius: 5px;
    box-shadow: 4px 4px 4px 1px #eee;
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
  .flowDialog1 {
    .el-dialog {
      background: #faf7fa;
    }
    .el-dialog__header {
      background: #fff;
      margin: 0 !important;
      padding-left: 15px !important;
      border-bottom: none;
      padding-top: 15px !important;
    }
    .dialog_content {
      margin: 10px 0 0 15px;
      background-color: #fff;
      > div {
        color: #262626;
        margin: 10px 0;
        span {
          color: #d91616;
        }
      }
    }
    .el-form {
      background-color: #fff;
      padding: 15px;
    }
    .dl-subtitle {
      display: inline-block;
      width: 45%;
      margin-bottom: 20px;
      margin-top: 0;
    }
    .el-form-item {
      display: block;
      margin: 10px 0 0 0;
      .el-select {
        width: 100%;
      }
    }
    .dl-subtitle {
      &:nth-of-type(2n) {
        margin-left: 40px;
      }
    }
    .el-textarea textarea {
      height: 100px !important;
    }
    .el-dialog__footer {
      padding: 0 !important;
    }
  }
}
</style>

