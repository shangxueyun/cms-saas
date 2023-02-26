<template>
  <div class="contracts-info">
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="mainlayout"
           style="width: 1000px;"
           slot="drawer">
        <div class="main-content">
          <div class="billDetails">
            <!-- <div class="head-right">
              <span @click="showRemarks=true">备注</span>
              <span @click="showEnclosure=true">附件</span>
            </div> -->
            <div class="dl-content clearfix">
              <el-form :model="addData"
                       ref="addData"
                       :rules="addDataRules">
                <div class="step1">
                  <div class="dc-left float-left"
                       style="text-align: left;">
                    <div class="dr-head">客户信息</div>
                    <div class="basic-select">
                      <div class="clearfix"
                           style="border: none;margin-bottom: 10px;height: 30px;"
                           v-if="detailsData.rooms">
                        <img :src="detailsData.rooms[0].building.buildingImage" />
                        <span>{{detailsData.rooms[0].building.buildingName}}</span>
                      </div>
                      <div class="bd-number">1号楼</div>
                      <div class="layer">
                        <div v-for="(item, index) in detailsData.rooms"
                             :key="index">
                          <span v-if="item.floor">{{item.floor.name}}层</span>
                          <span>{{item.shopNumber}}室</span>
                          <span>{{item.buildingArea}}m²</span>
                        </div>
                      </div>
                    </div>
                    <div class="dr-head">客户信息</div>
                    <div class="tenant-info">
                      <span>
                        <p>品牌</p>
                        <p>{{detailsData.referred}}</p>
                      </span>
                      <span>
                        <p>客户全称</p>
                        <p>{{detailsData.tenantName}}</p>
                      </span>
                      <!-- <span>
                        <p>合同名称</p>
                        <p>{{detailsData.contractName}}</p>
                      </span> -->
                      <span>
                        <p>合同编号</p>
                        <p>{{detailsData.contractNo}}</p>
                      </span>
                    </div>
                  </div>
                  <div class="dc-right float-right"
                       style="height: 430px">
                    <div class="dr-head">账单信息</div>
                    <el-form-item :label-width="formLabelWidth"
                                  prop="yxContractNo">
                      <div class="cttitle">账单编号</div>
                      <span>{{detailsData.code}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">租赁方式</div>
                      <span>{{formatRentalMethod(detailsData.rentalMethod)}}</span>
                    </el-form-item>
                    <el-form-item prop="startDate"
                                  :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">费用类型</div>
                      <span>{{formatFeeType(detailsData.feeType)}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  prop="endDate"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">计费周期</div>
                      <span>{{detailsData.startDate}}~{{detailsData.endDate}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  prop="area"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">账单类型</div>
                      <span>{{formatBillType(detailsData.billType)}}</span>
                    </el-form-item>
                    <el-form-item v-if="detailsData.rentalMethod !== 'RENT'"
                                  :label-width="formLabelWidth"
                                  prop="iDNumber">
                      <div class="cttitle">租金抽成比例</div>
                      <span v-if="detailsData.feeType === 'RENT'">{{detailsData.finalPrice}}%</span>
                      <span v-else></span>
                    </el-form-item>
                    <el-form-item v-if="detailsData.rentalMethod === 'GUARANTEEPOINT'"
                                  :label-width="formLabelWidth"
                                  prop="iDNumber">
                      <div class="cttitle">保底租金/元</div>
                      <span>{{detailsData.bdAmount}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  prop="iDNumber">
                      <div class="cttitle">账单金额</div>
                      <span>{{detailsData.amount | toLocaleString}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px">
                      <div class="cttitle">账单状态</div>
                      <span>{{formatBillStatus(detailsData.billStatus)}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">应收时间</div>
                      <span>{{detailsData.finalPaymentDate}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">滞纳金比例</div>
                      <span>{{detailsData.proportion}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">滞纳金金额</div>
                      <span>{{detailsData.proportion}}</span>
                    </el-form-item>
                  </div>
                  <div class="dc-right float-right tenantinfo"
                       style="width: 100%">
                    <div class="dr-head clearfix"
                         style="margin-bottom: 0">收支流水
                      <div class="btn-wrap" v-if="detailsData.billStatus !== 'OK' && detailsData.rentalMethod ==='POINTS' && detailsData.feeType === 'RENT' && detailsData.turnoverStatus === 'OK' || 
                      detailsData.billStatus !== 'OK' && detailsData.rentalMethod ==='POINTS' && detailsData.feeType !== 'RENT'  ||
                      detailsData.billStatus !== 'OK' && detailsData.rentalMethod !=='POINTS'">
                        <span class=""
                              @click="newPipeline()" v-if="hasAuthority('02050102')">新增流水</span>
                        <span class=""
                              @click="matchflow()" v-if="hasAuthority('02050103')">匹配流水</span>
                      </div>
                    </div>
                    <ul class="">
                      <li>品牌</li>
                      <li>账单类型</li>
                      <li>入账时间</li>
                      <li>发生额</li>
                      <li>匹配金额</li>
                    </ul>
                    <ul v-for="(item, index) in detailsData.billAndFlows"
                        :key="index">
                      <li>
                        <span>{{detailsData.referred}}</span>
                      </li>
                      <li>{{formatBillType(item.billFlowType)}}</li>
                      <li>{{item.recordDate}}</li>
                      <li>{{item.billFlowAmount | toLocaleString}}</li>
                      <li>{{item.amount | toLocaleString}}</li>
                    </ul>
                  </div>
                  <div class="dc-right float-right tenantinfo reduction"
                       style="width: 100%">
                    <div class="dr-head clearfix"
                         style="margin-bottom: 0">减免
                      <div class="btn-wrap">
                        <span v-if="detailsData.billStatus !== 'OK' && hasAuthority('02050104')"
                              class=""
                              @click="exemptionVisible('add')">减免</span>
                      </div>
                    </div>
                    <ul class="">
                      <li>减免金额</li>
                      <li>减免时间</li>
                      <li>减免类型</li>
                      <li>备注</li>
                    </ul>
                    <ul  v-for="(item, index) in detailsData.reductions" :key="index">
                      <li>{{item.amount | toLocaleString}}</li>
                      <li>{{item.timeReduction}}</li>
                      <li>{{formatReliefType(item.reliefType)}}</li>
                      <li>{{item.remake}}</li>
                    </ul>
                  </div>
                  <div class="turnoverBtn" v-if="detailsData.rentalMethod !== 'RENT' && detailsData.feeType === 'RENT' && detailsData.turnoverStatus !== 'OK'">
                    <span class="" @click="showAmountCalculation()">输入营业额</span>
                  </div>
                </div>
              </el-form>
              <div class="step2 dl-content"
                   v-show="newlystep2">
                <div class="dc-right float-right">
                  <div class="dr-head">其他信息</div>
                  <div class="other-info">
                    <div style="margin-bottom: 10px;">备注</div>
                    <el-input type="textarea"
                              :rows="2"
                              resize="none">
                    </el-input>
                    <div style="margin: 40px 0 10px;">附件
                      <span class="upload">
                        上传附件
                        <input type="file"
                               @change="imageChange('addapp', $event)"
                               accept="image/png, image/jpeg">
                      </span>
                    </div>
                    <div class="enclosure">
                      <div class="enclosure-head">
                        <span>文件名</span>
                        <span>操作</span>
                      </div>
                      <div v-if="reduction.annexURL"
                           class="enclosure-list">
                        <div class="el-item">
                          <span>{{reduction.annexName}}</span>
                          <span>
                            <i @click="downloadFile"
                               class="iconfont icon-xiazaidaoru"
                               style="margin-right: 10px;"></i>
                            <i @click="deleFile"
                               class="iconfont icon-lajixiang"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <!-- <div slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                    @click="previousStep"
                    class="close-button">关 闭</el-button>
        <el-button type="primary"
                    class="defaultbtn dialog-confirmBtn"
                    @click="billDetails()">保 存</el-button>
      </div> -->
    </drawer>
    <div class="contracts-remarks"
         v-show="showRemarks">
      <div class="rektitle">备注
        <span @click="showRemarks=false">关闭</span>
      </div>
      <el-input type="textarea"
                :rows="4"
                resize="none"
                placeholder="请输入内容">
      </el-input>
      <div class="operation">
        <span>确定</span>
      </div>
      <div class="remarks-list">
        <div class="remarks-item">
          <div>备注记录：</div>
          <div>
            <span>该商户租房源用于餐饮店铺</span>
            <span>2018.12.29</span>
          </div>
        </div>
      </div>
    </div>
    <div class="contracts-enclosure"
         v-show="showEnclosure">
      <div class="rektitle">附件管理
        <span @click="showEnclosure=false">关闭</span>
      </div>
      <div class="upload">
        <span>上传文件</span>
        <input type="file"
               @change="imageChange('addapp', $event)"
               accept="image/png, image/jpeg">
      </div>
      <div class="enclosure-list">
        <div class="enclosure-item">
          <span>商务条款.pdf</span>
          <span>删除</span>
          <span>下载</span>
        </div>
      </div>
    </div>

    <el-dialog title="新增流水"
               :visible.sync="flowDialogVisible"
               class="flowDialog" append-to-body>
      <el-form :model="addData"
               :rules="addFlowRules"
               ref="addFlowform">
        <div class="dl-subtitle">流水类型
          <el-form-item>
            <span v-if="accountEntry">收款</span>
            <span v-else>付款</span>
          </el-form-item>
        </div>
        <div class="dl-subtitle">发生额/元<span class="required">*</span>
          <el-form-item prop="amount">
            <el-input v-model="addData.amount" type="number">
            </el-input>
          </el-form-item>
        </div>
        <div class="dl-subtitle">客户名称
          <el-form-item prop="tenant">
            <el-select v-model="addData.tenant"
                       value-key="id"
                       placeholder="请选择">
              <el-option value="">请选择</el-option>
              <el-option v-for="item in tenantNameeOptions"
                         :key="item.id"
                         :label="item.teantName"
                         :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="dl-subtitle">
          <!-- <el-form-item v-if="addData.tenant">
            <span style="display: inline-block;line-height: 20px;">{{addData.tenant.referred}}</span>
          </el-form-item> -->
          <p>品牌</p>
          <span style="display: inline-block;height: 35px;line-height: 60px;">
            <span v-if="addData.tenant">{{addData.tenant.referred}}</span>
          </span>
        </div>
        <div class="dl-subtitle">
          <span v-if="accountEntry">入账时间</span>
          <span v-else>出账时间</span>
          <span class="required">*</span>
          <el-form-item prop="recordDate">
            <el-date-picker type="date"
                            value-format="yyyy-MM-dd"
                            v-model="addData.recordDate"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="inlinediv">
          <div class="dl-subtitle">备注</div>
          <el-form-item style="width: 100%;margin-bottom: 20px;">
            <el-input type="textarea"
                      :rows="4"
                      resize="none"
                      v-model="addData.remake"
                      maxlength="200">
            </el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="flowDialogVisible = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="addPipeline('addFlowform')"
                   class="defaultbtn dialog-confirmBtn">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="匹配流水"
               :visible.sync="matchflowDialogVisible"
               class="matchingflow" append-to-body>
      <el-table ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column label="入账日期"
                         width="120">
          <template slot-scope="scope">{{ scope.row.recordDate }}</template>
        </el-table-column>
        <el-table-column 
                         label="发生额/元"
                         width="120">
                         <template slot-scope="scope">{{ scope.row.amount | toLocaleString }}</template>
        </el-table-column>
        <el-table-column 
                         label="已匹配金额/元"
                         show-overflow-tooltip>
                         <template slot-scope="scope">{{ scope.row.ypAmount | toLocaleString }}</template>
        </el-table-column>
        <el-table-column label="流水类型"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{ formatBillType(scope.row.billType) }}</template>
        </el-table-column>
        <el-table-column label="匹配状态"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{ formatBillStatus(scope.row.flowState) }}</template>
        </el-table-column>
      </el-table>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="matchflowDialogVisible = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="saveFlow('addform')"
                   class="defaultbtn dialog-confirmBtn">保 存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="减免申请"
               :visible.sync="exemptionDialogVisible"
               class="exemptionDialog" append-to-body>
      <el-form :model="reduction"
               :rules="reductionRules"
               ref="reductionform">
        <div class="dl-subtitle">减免金额<span class="required">*</span>
          <el-form-item prop="amount">
            <el-input v-model="reduction.amount">
            </el-input>
          </el-form-item>
        </div>
        <div class="dl-subtitle">减免时间<span class="required">*</span>
          <el-form-item prop="timeReduction">
            <el-date-picker type="date"
                            value-format="yyyy-MM-dd"
                            v-model="reduction.timeReduction"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="dl-subtitle">减免类型<span class="required">*</span>
          <el-form-item prop="reliefType"
                        style="margin-right: 0">
            <el-select v-model="reduction.reliefType"
                       placeholder="请选择"
                       @change="selectName">
              <el-option v-for="item in reliefTypeOptions"
                         :key="item.value"
                         :label="item.name"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="inlinediv"
             style="margin-top: 20px;">
          <div class="inline-subtitle">备注</div>
          <el-form-item style="width: 100%;margin: 0 0 20px; 0">
            <el-input v-model="reduction.remake">
            </el-input>
          </el-form-item>
        </div>
        <div class="inlinediv"
             style="margin: 20px 0;">
          <div class="inline-subtitle">附件
            <span class="upload">上传附件
              <input type="file"
                     @change="imageChange('reduction', $event)">
            </span>
          </div>
          <div class="enclosure">
            <div class="enclosure-head">
              <span>文件名</span>
              <span>操作</span>
            </div>
            <div v-if="reduction.annexURL"
                 class="enclosure-list">
              <div class="el-item">
                <span>{{reduction.annexName}}</span>
                <span>
                  <i @click="downloadFile"
                     class="iconfont icon-xiazaidaoru"
                     style="margin-right: 10px;"></i>
                  <i @click="deleFile"
                     class="iconfont icon-lajixiang"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="exemptionDialogVisible = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="reductions('reductionform')"
                   class="defaultbtn dialog-confirmBtn">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="账单金额计算"
                center
               :visible.sync="calculationDialogVisible"
               class="calculationDialog" append-to-body>
      <el-form :model="reduction"
               :rules="reductionRules"
               ref="reductionform">
        <div class="inlinediv"
             style="margin-top: 20px;">
          <div class="inline-subtitle">账单信息</div>
          <div class="bill-information">
            <span>计费周期</span>
            <span>租金抽成比例</span>
            <span>保底金额/元</span>
            <span>{{detailsData.startDate}}~{{detailsData.endDate}}</span>
            <span>{{detailsData.finalPrice}}%</span>
            <span>{{detailsData.bdAmount}}</span>
            <ul>
              <span>时间</span>
              <span>营业额/元<span class="required">*</span></span>
              <span>营业额抽成金额/元</span>
            </ul>
            <ul v-for="(item, index) in detailsData.turnovers" :key="index">
              <span>{{item.startDate}}~{{item.endDate}}</span>
              <span><input type="number" v-model="item.turnoverAmount" @input="queryTurnover(item, item.id, item.turnoverAmount)" /></span>
              <span>{{item.amountDrawn}}</span>
            </ul>
          </div>
        </div>
        <div class="btn">
          <span @click="finalBillAmount">生成最终账单金额</span>
        </div>
        <div class="inlinediv"
             style="margin: 20px 0;">
          <div class="enclosure">
            <div>账单金额/元</div>
            <div>{{BillAmount}}</div>
          </div>
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer" style="text-align: right">
        <el-button @click="calculationDialogVisible = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="amountCalculation()"
                   class="defaultbtn dialog-confirmBtn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import Drawer from '@/components/drawer.vue'
import {toLocaleString, toLocaleFixed} from '@/utils/validate.js'
import * as JSOG from 'jsog'
export default {
  name: 'billDetails',
  components: {
    Drawer
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    detailsData: {
      type: Object
    },
    queryBillId: {
      type: String
    },
    reductionData: {
      type: Object
    }
  },
  data () {
    // var validateAmount = (rule, value, callback) => {
    //   if (!value) {
    //     callback(new Error('请输入金额'))
    //   } else if (Number(value) > Number(this.amountTotal)) {
    //     callback(new Error('新增流水金额不能大于账单金额'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      BillAmount: 0,
      addData: {},
      addform: {},
      newlystep1: true,
      newlystep2: false,
      drawerTitle: '账单详情',
      formLabelWidth: '',
      documentTypeOptions: [],
      nationalityOptions: [],
      tenantNameeOptions: [],
      projectList: [],
      chooseObj: {},
      accountEntry: true,
      selHourse: false,
      selProject: false,
      errorProject: false,
      flowDialogVisible: false,
      matchflowDialogVisible: false,
      exemptionDialogVisible: false,
      calculationDialogVisible: false,
      reduction: {},
      reliefTypeOptions: [
        { name: '特批调整', value: 'SPECIAL' },
        { name: '福利减免', value: 'WELFARE' },
        { name: '补偿减免', value: 'COMPENSATE' }
      ],
      addDataRules: {},
      addFlowRules: {
        amount: [
          { required: true, message: '请输入金额', trigger: 'blur' }
          // { validator: validateAmount, trigger: 'blur' }
        ],
        tenant: [
          { required: false, message: '请选择客户', trigger: 'change' }
        ],
        recordDate: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ]
      },
      reductionRules: {
        amount: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ],
        timeReduction: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ],
        reliefType: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ]
      },
      showRemarks: false,
      showEnclosure: false,
      amountTotal: 0,
      options: {},
      flowExplain: '',
      tableData: [
        {
          date: '2016-05-03',
          name: '入账日期',
          address: '上海市普陀区'
        },
        {
          date: '2016-05-03',
          name: '入账日期',
          address: '上海市普陀区'
        }
      ],
      multipleSelection: '',
      exemptionType: ''
    }
  },
  watch: {
    detailsData: {
      handler: function () {
        if (this.detailsData.billType === 'R') {
          this.accountEntry = true
        } else {
          this.accountEntry = false
        }
        if (this.exemptionType === 'edit') {
          this.reduction = this.reductionData
        } else {
          this.reduction = {}
        }
      }
    }
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    exemptionVisible (type) {
      this.exemptionDialogVisible = true
      this.exemptionType = type
      if (type === 'add') {
        this.reduction = {}
      }
    },
    queryTurnover (item, id, amount) {
      if (!amount) {
        return
      }
      context.http.get('/cms/api/bill/turnover', {'turnoverId': id, 'turnoverAmount': amount}).then(res => {
        this.$set(item, 'amountDrawn', res.data)
        this.$forceUpdate()
      }).catch(error => {
        console.info(error)
      })
    },
    finalBillAmount () {
      let turnovers = this.detailsData.turnovers
      let billAmount = 0
      this.detailsData.turnovers.forEach(ele => {
        billAmount += Number(!ele.amountDrawn ? 0 : ele.amountDrawn)
      })
      this.BillAmount = billAmount
    },
    amountCalculation () {
      let data = JSOG.decode(this.detailsData)
      this.detailsData.amount = this.BillAmount
      delete this.detailsData.rooms
      context.http.put('/cms/api/bill/turnover', this.detailsData).then(res => {
        this.calculationDialogVisible = false
        this.$emit('handleEdit', 0, data)
      }).catch(error => {
        console.info(error)
      })
    },
    onHide () {
      this.$emit('drawerClose', false)
      this.$emit('query', false)
      this.readonly = true
    },
    formatRentalMethod (val) {
      return val === 'RENT' ? '固定租金' : val === 'POINTS' ? '扣点' : '保底扣点'
    },
    formatBillType (val) {
      return val === 'R' ? '收款' : '付款'
    },
    formatBillStatus (val) {
      let res = ''
      if (val === 'APPROVAL') {
        res = '减免审核中'
      } else if (val === 'UPDATE') {
        res = '减免驳回待修改'
      } else if (val === 'NO') {
        res = '未付款'
      } else if (val === 'OK') {
        res = '已结清'
      } else if (val === 'SECTION') {
        res = '部分结清'
      } else if (val === 'STAY_SETTLE') {
        res = '待结清'
      }
      return res
    },
    formatFeeType (val) {
      let feeType
      switch (val) {
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
    formatReliefType (val) {
      let res = ''
      if (val === 'SPECIAL') {
        res = '特批调整'
      } else if (val === 'WELFARE') {
        res = '福利减免'
      } else if (val === 'COMPENSATE') {
        res = '补偿减免'
      }
      return res
    },
    previousStep () {
      this.onHide()
    },
    imageChange () {
      let files = event.target.files
      let form = new FormData()
      form.append('file', files[0])
      let name = files[0].name
      context.http.post('/ywm/api/image-multipart', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
        this.$set(this.reduction, 'annexName', name)
        this.$set(this.reduction, 'annexURL', res.data)
      }).catch(error => {
        console.info(error)
      })
    },
    downloadFile () {
      axios({ method: 'GET', url: '/ywm/api/annex/download', params: { annexURL: this.reduction.annexURL, annexName: this.reduction.annexName }, responseType: 'blob' }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', this.reduction.annexName)
        document.body.appendChild(link)
        link.click()
      })
    },
    deleFile () {
      this.reduction.annexName = null
      this.reduction.annexURL = null
    },
    billDetails () {
    },
    selectName () { },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    saveFlow () {
      let detailsData = JSOG.decode(this.detailsData)
      if (this.multipleSelection === '') {
        return false
      }
      detailsData.billFlows = this.multipleSelection
      delete detailsData.rooms
      context.http.put('/cms/api/bills/flow', detailsData).then(res => {
        if (res) {
          this.matchflowDialogVisible = false
          this.$emit('handleEdit', 0, detailsData)
        }
      })
    },
    async newPipeline () {
      this.flowDialogVisible = true
      let result = await context.http.get('/cms/api/tenant/all', { tenantName: '' })
      this.tenantNameeOptions = result.data.filter(ele => {
        return ele.id === this.detailsData.tenandId
      })
      // this.tenantNameeOptions = result.data.tenantListDTOSet
    },
    addPipeline (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addData.billType = 'R'
          this.addData.bills = [this.detailsData]
          if (!this.addData.tenant) {
            this.addData.tenant = null
          }
          let _this = this
          context.http.post('/cms/api/bill/billFlow', this.addData).then(res => {
            if (res.status === 200 || res.status === 201) {
              _this.flowDialogVisible = false
              _this.$emit('handleEdit', 0, this.detailsData)
              this.addData.tenant = ''
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    matchflow () {
      this.matchflowDialogVisible = true
      context.http.get('/cms/api/billFlows/nomate', {billId: this.detailsData.id, billType: this.detailsData.billType, tenantId: this.detailsData.tenandId}).then(res => {
        if (res) {
          this.tableData = res.data
          // this.tableData.forEach(ele => {
          //   ele.amount = toLocaleString(ele.amount)
          // })
        }
      })
    },
    reductions (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let postData = this.reduction
          let _this = this
          postData.billId = this.detailsData.id
          let taskId = this.$route.query.taskId
          if (taskId && this.exemptionType === 'edit') {
            postData.taskId = taskId
            context.http.put('/cms/api/reductions', postData).then(res => {
              if (res) {
                _this.exemptionDialogVisible = false
                _this.$emit('handleEdit', 0, this.detailsData)
              }
            })
          } else {
            context.http.post('/cms/api/reductions', postData).then(res => {
              if (res) {
                _this.exemptionDialogVisible = false
                _this.$emit('handleEdit', 0, this.detailsData)
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showAmountCalculation () {
      this.calculationDialogVisible = true
    }
  }
}
</script>
<style lang="scss">
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
            &:first-child {
              width: 70%;
            }
            &:last-child {
              width: 28%;
              text-align: right;
            }
          }
        }
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
      input {
        position: absolute;
        right: 0;
        width: 100%;
        height: 100px;
        opacity: 0;
        cursor: pointer;
      }
    }
    .enclosure-list {
      width: 90%;
      margin: 0 auto;
      margin-top: 40px;
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
  }
  .matchingflow {
    .el-dialog {
      width: 800px;
    }
    .el-dialog__body {
      min-height: 300px;
      margin-top: 20px;
    }
  }
  .exemptionDialog {
    .el-dialog__body {
      margin-top: 20px;
    }
    .dl-subtitle {
      display: inline-block;
      width: 32.5%;
    }
    .el-form-item {
      margin-top: 10px;
      margin-right: 10px;
    }
    .inlinediv {
      border: 1px solid rgba(231, 231, 231, 1);
      .inline-subtitle {
        padding: 6px 10px;
        background: rgba(250, 250, 250, 1);
        .upload {
          display: inline-block;
          font-size: 12px;
          width: 60px;
          height: 24px;
          line-height: 23px;
          text-align: center;
          border: 1px solid rgba(15, 117, 255, 1);
          color: #0f75ff;
          border-radius: 4px;
          float: right;
          cursor: pointer;
          position: relative;
          input {
            position: absolute;
            right: 0;
            width: 60px;
            height: 24px;
            opacity: 0;
            cursor: pointer;
          }
        }
      }
      .enclosure-head {
        height: 40px;
        line-height: 40px;
        span {
          display: inline-block;
          width: 48%;
          padding-left: 40px;
        }
        border-bottom: 1px solid rgba(231, 231, 231, 1);
      }
      .enclosure-list {
        width: 90%;
        margin: 0 auto;
        .el-item {
          height: 40px;
          padding-top: 10px;
          font-size: 14px;
          span {
            display: inline-block;
            width: 25%;
            &:first-child {
              width: 55%;
              overflow: hidden;
            }
          }
        }
      }
      .el-input__inner {
        border: none;
      }
    }
    .el-date-editor {
      width: 100%;
    }
  }
  .calculationDialog{
    .el-dialog{
      width: 800px;
    }
    .el-dialog__body {
      margin-top: 20px;
    }
    .dl-subtitle {
      display: inline-block;
      width: 32.5%;
    }
    .el-form-item {
      margin-top: 10px;
      margin-right: 10px;
    }
    .inlinediv {
      border: 1px solid rgba(231, 231, 231, 1);
      .inline-subtitle {
        padding: 6px 10px;
        background: rgba(250, 250, 250, 1);
        .upload {
          display: inline-block;
          font-size: 12px;
          width: 60px;
          height: 24px;
          line-height: 23px;
          text-align: center;
          border: 1px solid rgba(15, 117, 255, 1);
          color: #0f75ff;
          border-radius: 4px;
          float: right;
          cursor: pointer;
          position: relative;
          input {
            position: absolute;
            right: 0;
            width: 60px;
            height: 24px;
            opacity: 0;
            cursor: pointer;
          }
        }
      }
      .enclosure-head {
        height: 40px;
        line-height: 40px;
        span {
          display: inline-block;
          width: 48%;
          padding-left: 40px;
        }
        border-bottom: 1px solid rgba(231, 231, 231, 1);
      }
      .enclosure-list {
        width: 90%;
        margin: 0 auto;
        .el-item {
          height: 40px;
          padding-top: 10px;
          font-size: 14px;
          span {
            display: inline-block;
            width: 25%;
            &:first-child {
              width: 55%;
              overflow: hidden;
            }
          }
        }
      }
      .el-input__inner {
        border: none;
      }
      .enclosure{
        margin: 20px;
      }
    }
    .el-date-editor {
      width: 100%;
    }
    .bill-information{
      padding-bottom: 20px;
      span{
        display: inline-block;
        width: 32%;
        padding: 10px 0 0 10px;
      }
      input {
        border: 1px solid #dadada;
        height: 30px;
        border-radius: 3px;
      }
    }
    .btn {
      text-align: center;
      span{
        display: inline-block;
        width: 120px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #0f75ff;
        border-radius: 4px;
        font-size: 12px;
        color: #fff;
        background-color: #0f75ff;
        cursor: pointer;
        margin-top: 20px;
      }
    }
  }
  .cttitle + span {
    display: inline-block;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
  }
  .turnoverBtn{
    span {
      display: inline-block;
      width: 90px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border: 1px solid #0f75ff;
      border-radius: 4px;
      font-size: 12px;
      color: #fff;
      background-color: #0f75ff;
      cursor: pointer;
      margin: 20px 10px;
      float: right;
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
.billDetails {
  position: relative;
  .head-right {
    position: absolute;
    top: -40px;
    right: 0;
    font-size: 12px;
    span {
      cursor: pointer;
    }
  }
  .dialog-footer {
    border-top: 1px solid #e5e5e5;
    padding: 20px 0;
    text-align: right;
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
      width: 60px;
      height: 24px;
      opacity: 0;
      cursor: pointer;
    }
  }
  .enclosure {
    border: 1px solid #e7e7e7;
    margin-bottom: 20px;
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
        font-size: 16px;
        margin-bottom: 20px;
      }
    }
    .tenantinfo {
      .el-form-item {
        width: 29% !important;
        margin-right: 0;
      }
      .cttitle + span {
        display: inline-block;
        height: 40px;
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
        font-size: 16px;
        margin-bottom: 24px;
        .btn-wrap {
          float: right;
          span {
            display: inline-block;
            width: 60px;
            height: 24px;
            line-height: 23px;
            text-align: center;
            border: 1px solid rgba(15, 117, 255, 1);
            border-radius: 4px;
            font-size: 12px;
            color: #0f75ff;
            cursor: pointer;
            margin-right: 10px;
            &:hover {
              background: rgba(15, 117, 255, 1);
              color: #fff;
            }
          }
        }
      }
      .el-form-item {
        display: inline-block;
        width: 29%;
        margin-left: 16px;
        margin-right: 10px;
        &:nth-of-type(3n) {
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
      ul {
        display: flex;
        border-bottom: 1px solid #d8dce3;
        &:last-child {
          border: none;
        }
        li {
          width: 20%;
          text-align: center;
          font-size: 14px;
          color: #666;
          height: 40px;
          line-height: 40px;
        }
      }
    }
    .reduction {
      ul li {
        width: 25%;
      }
    }
    .basic-select {
      min-height: 200px;
      .bd-number {
        height: 20px;
        line-height: 20px;
        padding-left: 12px;
        background: rgba(250, 250, 250, 1);
      }
      .layer {
        padding-bottom: 20px;
        font-size: 14px;
        div {
          padding: 12px 0 0 12px;
          span {
            display: inline-block;
            width: 30%;
            vertical-align: top;
          }
        }
      }
      img {
        width: 30px;
        height: 20px;
        margin: 0 40px 0 20px;
      }
    }
    .tenant-info {
      margin: 0 12px;
      span {
        display: inline-block;
        width: 45%;
        font-size: 14px;
        p {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          padding: 6px 0;
          &:first-child {
            color: #7085a1;
            padding: 0;
          }
          &:last-child {
            min-height: 30px;
          }
        }
      }
    }
  }
}
</style>
