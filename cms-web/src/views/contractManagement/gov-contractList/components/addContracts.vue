<template>
  <div class="gov-addContracts">
    <div class="ga-head">
      <span class="step"
            :class="{stepActive: newlystep1, stepActivePast: newlystep2}"><span style="font-size: 20px;">1</span>. 基本资料</span>
      <span class="step"
            :class="{stepActive: newlystep2}"><span style="font-size: 20px;">2</span>. 费用条款</span>
      <span class="step"
            :class="{stepActive: newlystep3}"><span style="font-size: 20px;">3</span>. 其他资料</span>
    </div>
    <div class="dl-content clearfix">
      <el-form :model="addData"
               ref="addData"
               label-position="top"
               :inline="true"
               label-width="270px"
               :rules="addDataRules1">
        <div class="step1"
             v-show="newlystep1">
          <div class="dc-block">
            <div class="dc-head"><span class="vertical"></span>楼宇</div>
            <el-form-item prop="organizeId"
                          label="管理企业"
                          style="margin-bottom: 20px;vertical-align: top;">
              <el-select v-model="addData.organizeId"
                         filterable
                         size="small"
                         @change="getProject(addData.organizeId)"
                         placeholder="请选择">
                <el-option v-for="item in enterpriseOptions"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="projectManagement"
                          label="项目">
              <el-select v-model="addData.projectManagement"
                         size="small"
                         value-key="id"
                         @change="getBuliding();"
                         placeholder="请选择">
                <el-option v-for="item in optionsProject"
                           :key="item.id"
                           :label="item.projectName"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <div class="assets-header">
              <span style="padding-bottom: 10px;">
                <span v-show="!selecting">已</span>选择楼宇<span class="reqriud">*</span>
              </span>
              <span v-if="!selecting"
                    class="operation"
                    @click="selectHandler()">选择楼宇</span>
              <span v-else
                    class="operation"
                    @click="selecting = false">完成<span class="scNumber"
                      v-if="multipleSelectionAll.length > 0">{{multipleSelectionAll.length}}</span></span>
            </div>
            <div style="margin-bottom: 10px;"
                 v-show="selecting">
              <el-input v-model="buildingName"
                        size="small"
                        style="width: 250px"
                        @input="getBuliding2()"
                        placeholder="搜索名称/地址"></el-input>
            </div>
            <el-table :data="multipleSelectionAll"
                      tooltip-effect="dark"
                      v-if="!selecting"
                      style="width: 100%"
                      key="1">
              <el-table-column label="楼宇名称"
                               align="center">
                <template slot-scope="scope">{{ scope.row.buildingName }}</template>
              </el-table-column>
              <el-table-column prop="address"
                               align="center"
                               label="地址"
                               width="260">
              </el-table-column>
              <el-table-column align="center"
                               label="楼宇类型"
                               show-overflow-tooltip>
                <template slot-scope="scope">{{ assetsTypeFormte(scope.row.assetsType) }}</template>
              </el-table-column>
              <el-table-column align="center"
                               label="总面积"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  {{scope.row.buildingArea}} {{scope.row.assetsType === 'LAND' ? '亩' : '㎡'}}
                </template>
              </el-table-column>
            </el-table>
            <el-table ref="multipleTable"
                      :data="tableData"
                      tooltip-effect="dark"
                      style="width: 100%"
                      key="2"
                      v-else
                      @select="openDetails"
                      @select-all="selectAll"
                      @selection-change="handleSelectionChange">
              <el-table-column type="selection"
                               width="55">
              </el-table-column>
              <el-table-column label="楼宇名称"
                               align="center">
                <template slot-scope="scope">{{ scope.row.buildingName }}</template>
              </el-table-column>
              <el-table-column prop="address"
                               align="center"
                               label="地址"
                               width="260">
              </el-table-column>
              <el-table-column align="center"
                               label="楼宇类型"
                               show-overflow-tooltip>
                <template slot-scope="scope">{{ assetsTypeFormte(scope.row.assetsType) }}</template>
              </el-table-column>
              <el-table-column prop="buildingArea"
                               align="center"
                               label="总面积 ㎡/亩"
                               show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </div>
          <div class="dc-block">
            <div class="dc-head"><span class="vertical"></span>租赁方式</div>
            <el-form-item label="租赁方式"
                          prop="contractType">
              <el-select v-model="addData.contractType"
                         size="small"
                         placeholder="请选择">
                <el-option label="一手租赁"
                           value="RENT"></el-option>
                <el-option label="转租"
                           value="SUBLET">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="parentContractId"
                          label="转租权利人"
                          v-if="addData.contractType === 'SUBLET'">
              <el-select v-model="addData.parentContractId"
                         filterable
                         remote
                         size="small"
                         style="width: 550px"
                         placeholder="请选择">
                <el-option v-for="(item, index) in subleaseObligeeOptions"
                           :key="item.id + `${index}`"
                           :label="`${item.tenant.teantName}` + '   ' + `${item.startDate}` + '~' + `${item.endDate}`"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="dc-block">
            <div class="dc-head"><span class="vertical"></span>承租方</div>
            <el-form-item prop="tenant"
                          label="名称">
              <el-select v-model="addData.tenant"
                         filterable
                         remote
                         :remote-method="remoteMethod"
                         value-key="id"
                         size="small"
                         placeholder="请选择">
                <el-option v-for="item in tenantNameOptions"
                           :key="item.id"
                           :label="item.desc"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用途"
                          prop="shopName">
              <el-input v-model="addData.shopName"
                        size="small"
                        placeholder="如：办公、餐饮、酒店等">
              </el-input>
            </el-form-item>
          </div>
          <div class="dc-block">
            <div class="dc-head"><span class="vertical"></span>合同信息</div>
            <el-form-item label="合同签订时间"
                          prop="signtDate">
              <el-date-picker v-model="addData.signtDate"
                              type="date"
                              size="small"
                              value-format="yyyy-MM-dd"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="合同起始日"
                          prop="startDate">
              <el-date-picker v-model="addData.startDate"
                              type="date"
                              size="small"
                              value-format="yyyy-MM-dd"
                              @change="contractChange"
                              :picker-options="contractStart"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="合同终止日"
                          prop="endDate">
              <el-date-picker v-model="addData.endDate"
                              type="date"
                              size="small"
                              value-format="yyyy-MM-dd"
                              @change="contractChange"
                              :picker-options="contractEnd"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="合同编号"
                          prop="contractNo">
              <el-input v-model="addData.contractNo"
                        size="small"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="镇统一合同编号"
                          prop="townContractNo">
              <el-input v-model="addData.townContractNo"
                        size="small"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="合同性质"
                          prop="contractNature">
              <el-select v-model="addData.contractNature"
                         size="small"
                         clearable
                         placeholder="请选择">
                <el-option label="租赁"
                           value="RENT">
                </el-option>
                <el-option label="使用"
                           value="USE">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="step1 step2"
           v-show="newlystep2">
        <el-form :model="addData2"
                 ref="rentClauses"
                 label-position="top"
                 :inline="true"
                 :rules="rentClausesRules">
          <div class="dc-block">
            <div class="dc-head"><span class="vertical"></span>租金</div>
            <div class="form-group"
                 v-for="(item, index) in addData2.rentClauses"
                 :key="index">
              <div class="fg-header"
                   v-if="multipleSelectionAll[index]">
                <p><span>楼宇：{{multipleSelectionAll[index].buildingName}}</span> 地址：{{multipleSelectionAll[index].address}} </p>
                <p><span>类型：{{assetsTypeFormte(multipleSelectionAll[index].assetsType)}}</span> 总面积：{{multipleSelectionAll[index].buildingArea}}
                  <span>{{multipleSelectionAll[index].assetsType ==='LAND'? '亩' : 'm²'}}</span>
                </p>
              </div>
              <div class="fg-content">
                <div class="ct-left">
                  <el-form-item :prop="'rentClauses.'+ index + '.area'"
                                :rules="rentClausesRules.area"
                                label="租赁面积"
                                style="margin-bottom: 20px;vertical-align: top;">
                    <el-input v-model.number="item.area"
                              type="number"
                              size="small"
                              :min="0"
                              style="width: 50%"
                              placeholder="请输入内容"></el-input>
                  </el-form-item>
                  <el-form-item label="租金"
                                :prop="'rentClauses.'+ index + '.price'"
                                :rules="rentClausesRules.price">
                    <el-select v-model="item.priceUnit"
                               filterable
                               size="small"
                               style="width: 50%"
                               placeholder="请选择">
                      <el-option label="面积单价(每天)"
                                 value="M2DAYS"></el-option>
                      <el-option label="月租金"
                                 value="MONTH"></el-option>
                      <el-option label="年租金"
                                 value="YEAR"></el-option>
                    </el-select>
                    <el-input v-model="item.price"
                              type="number"
                              size="small"
                              :min="0"
                              oninput="if (value < 0) value = 0"
                              @input="priceChange(index)"
                              style="width: 30%"
                              placeholder=""></el-input>
                  </el-form-item>
                </div>
                <div class="ct-right">
                  <span class="increase-btn"
                        v-if="item.area && item.price"
                        @click="openDialog(item, index)">
                    <i class="iconfont icon-add-new"></i>
                    递增
                  </span>
                  <div class='stepsProcess pre'>
                    <div class='stepsProcessCon yw-setps'>
                      <div class='processItem yw-setp'>
                        <div class='step__head'>
                          <div class="step__line lined"></div>
                          <div class="step__icon circle circle1"></div>
                          <div class="step__icon circle circle2"
                               v-if="item.incrementRates.length === 0"></div>
                        </div>
                        <div class='processItemCon step__main'>
                          <div>{{addData.startDate}}</div>
                          <div style="margin: 6px 0 15px 0">
                            <span class="date-wrap">
                              {{priceUnitFormat(item.priceUnit)}}：
                              {{item.price}} 元
                            </span>
                          </div>
                          <div v-if="item.incrementRates.length === 0">{{addData.endDate}}</div>
                        </div>
                      </div>
                      <div class='processItem yw-setp'
                           v-for="(item2, index2) in item.incrementRates"
                           :key="'index1' + index2">
                        <div class='step__head'>
                          <div class="step__line lined"></div>
                          <div class="step__icon circle circle1"
                               v-if="index2 === 0"></div>
                          <div class="step__icon circle circle2"></div>
                        </div>
                        <div class='processItemCon step__main'>
                          <div>{{item2.startDate}}
                            <i class="iconfont icon-lajixiang"
                               @click="delStep(item, index2, index)"></i>
                          </div>
                          <div style="margin: 6px 0 15px 0">
                            <span class="date-wrap">
                              {{priceUnitFormat(item.priceUnit)}}：
                              <!-- {{item2.number}} -->
                              <!-- {{item2.incrementUnit === 'P' ? '%' : '天'}} -->
                              {{item2.point}}
                              元
                            </span>
                          </div>
                          <div v-if="index2 === item.incrementRates.length - 1">{{addData.endDate}}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-form>
        <el-form :model="LeaseClauseData"
                 ref="LeaseClauseData"
                 label-position="top"
                 :inline="true"
                 :rules="LeaseClauseDataRules">
          <div class="dc-block">
            <div class="dc-head"><span class="vertical"></span>付款条件</div>
            <el-form-item label="付款周期/月"
                          prop="month">
              <el-input v-model="LeaseClauseData.month"
                        size="small"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item prop="dayNumber"
                          label="账单应收日期">
              <el-select v-model="LeaseClauseData.dayType"
                         size="small"
                         style="width: 57%;margin-right: 10px"
                         @change="addData.dayNumber = ''"
                         placeholder="请选择">
                <el-option label="固定日期"
                           value="FIXED"></el-option>
                <el-option label="提前天数"
                           value="TOP"></el-option>
              </el-select>
              <el-input v-model="LeaseClauseData.dayNumber"
                        type="number"
                        size="small"
                        style="width: 37%;"
                        placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="滞纳金比例"
                          prop="lateFeeRate">
              <el-input v-model="LeaseClauseData.lateFeeRate"
                        type="number"
                        size="small"
                        placeholder="请输入内容">
                <template slot="append">%/天</template>
              </el-input>
            </el-form-item>
          </div>
          <div class="dc-block">
            <div class="dc-head rent-free">
              <span><span class="vertical"></span>免租期</span>
              <span class="add-btn"
                    @click="addOfferRecord">
                <i class="iconfont icon-add-new"></i>
                继续添加
              </span>
            </div>
            <template v-for="(item, index) in LeaseClauseData.offerRecords">
              <el-form-item label="免租开始日期">
                <el-date-picker v-model="item.yhStartDate"
                                type="date"
                                size="small"
                                @change="yhChangeEnd(index)"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="免租结束日期">
                <el-date-picker v-model="item.yhEndDate"
                                type="date"
                                size="small"
                                @change="yhChangeStart(index)"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item style="vertical-align: bottom">
                <i class="iconfont icon-lajixiang"
                   @click="delOfferRecord(index)"></i>
              </el-form-item>
            </template>
          </div>
        </el-form>
      </div>
      <div class="step1"
           v-show="newlystep3">
        <div class="dc-block">
          <div class="dc-head"><span class="vertical"></span>备注</div>
          <div class="other-info">
            <el-input type="textarea"
                      :rows="2"
                      resize="none"
                      style="width: 97%;"
                      maxlength="200"
                      placeholder="请输入相关内容"
                      v-model="addData.remarks[0].content">
            </el-input>
          </div>
        </div>
        <div class="dc-block">
          <div class="enclosure-head2">
            <div class="dc-head"><span class="vertical"
                    style="border: none;"></span>附件</div>
            <aliUpload upLoadText="上传附件"
                       @setAnnex="setAnnex" />
          </div>
          <div class="enclosure">
            <div class="enclosure-head">
              <span>文件名</span>
              <span style="text-align: right;padding-right: 30px;">操作</span>
            </div>
            <div class="enclosure-list"
                 v-for="(item, index) in addData.annexes"
                 :key="index">
              <div class="el-item">
                <span><svg class="icon"
                       v-if="item.annexName"
                       style="margin-right: 6px"
                       aria-hidden="true">
                    <use :xlink:href="getformat2(item.annexName)"></use>
                  </svg>{{item.annexName}}</span>
                <span v-if="item.annexName"
                      class="operation">
                  <aliDownLoad :item="item"
                               :encrypt="true" />
                  <i @click="deleFile(index)"
                     class="iconfont icon-lajixiang"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="closeAddDialog"
                 class="close-button closebutton"
                 v-if="newlystep1">取 消</el-button>
      <el-button type="primary"
                 @click="previousStep"
                 class="close-button closebutton"
                 v-if="newlystep2 || newlystep3">上一步</el-button>
      <el-button @click="newlystepNoe('addData')"
                 type="primary"
                 class="defaultbtn dialog-confirmBtn"
                 v-if="newlystep1 || newlystep2">下一步</el-button>
      <el-button type="primary"
                 @click="previewContract('temporary')"
                 class="close-button"
                 v-if="newlystep3">暂 存</el-button>
      <el-button type="primary"
                 class="defaultbtn dialog-confirmBtn"
                 v-if="newlystep3"
                 @click="previewContract('initiateApproval')">
        发起审批
      </el-button>
    </div>
    <el-dialog title="递增"
               :visible.sync="dialogVisible"
               :append-to-body="true"
               :close-on-click-modal="false"
               :inline="true"
               width="400px"
               class="govcontract-increasedialog">
      <el-form label-position="top"
               label-width="80px"
               :model="increaseForm"
               :rules="increaseFormRules"
               ref="increaseForm">
        <el-form-item label-width="160px"
                      label="递增开始日期"
                      prop="startDate"
                      style="margin-bottom: 20px;width: 160px;">
          <el-date-picker v-model="increaseForm.startDate"
                          type="date"
                          size="small"
                          :picker-options="contractStartLimit"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="递增"
                      prop="number"
                      label-width="85px">
          <el-input v-model.number="increaseForm.number"
                    type="number"
                    oninput="if (value < 0) value = ''"
                    size="small"></el-input>
        </el-form-item>
        <el-form-item label=""
                      prop="incrementUnit"
                      label-width="85px">
          <el-select v-model="increaseForm.incrementUnit"
                     size="small">
            <el-option label="%"
                       value="P"></el-option>
            <el-option label="元"
                       value="Y"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button class="close-button"
                   @click="dialogVisible = false">取 消</el-button>
        <el-button class="defaultbtn"
                   type="primary"
                   @click="increaseDetermine('increaseForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
import aliUpload from '@/components/aliUpload.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import { getformat } from '@/utils/validate.js'
export default {
  name: 'addContracts',
  components: {
    aliUpload,
    aliDownLoad
  },
  props: {
    projectList: {
      type: Array,
      default: []
    },
    detailData: {
      type: Object,
      default: {}
    }
  },
  watch: {
    projectListParent: {
      handler: function (newVal, oldVal) {
        if (localStorage.STORAGE === 'true') {
          this.storage = true
          this.queryTreeAll()
          const detailData = JSON.parse(JSON.stringify(this.detailData))
          this.addData = detailData
          this.getProject(this.addData.projectManagement.organizeId, 'STORAGE')
          this.addData.organizeId = this.detailData.projectManagement.organizeId
          this.addData.parentContractId = this.detailData.parentContractId
          this.addData2.rentClauses = detailData.rentClauses
          this.LeaseClauseData.carryModeRent = detailData.carryModeRent
          this.LeaseClauseData.billingType = detailData.billingType
          this.LeaseClauseData.yearDay = detailData.yearDay
          this.LeaseClauseData.billDivision = detailData.billDivision
          this.LeaseClauseData.onBillContainFirstOfferReocrd = detailData.onBillContainFirstOfferReocrd

          this.$set(this.LeaseClauseData, 'month', detailData.rentClauses[0].month)
          this.$set(this.LeaseClauseData, 'dayType', detailData.rentClauses[0].dayType)
          this.$set(this.LeaseClauseData, 'dayNumber', detailData.rentClauses[0].dayNumber)
          this.$set(this.LeaseClauseData, 'lateFeeRate', detailData.rentClauses[0].lateFeeRate)
          this.$set(this.LeaseClauseData, 'offerRecords', detailData.rentClauses[0].offerRecords)
        } else {
          this.storage = false
        }
      }
    }
  },
  data () {
    return {
      projectListParent: [],
      enterpriseOptions: [],
      optionsProject: [],
      dialogVisible: false,
      newlystep1: true,
      newlystep2: false,
      newlystep3: false,
      addData: {
        tenant: '',
        tenantry: '',
        purpose: '',
        remarks: [{
          content: ''
        }],
        annexes: []
      },
      addDataRules1: {
        organizeId: [
          { required: true, message: '请选择管理企业', trigger: 'change' }
        ],
        projectManagement: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        contractType: [
          { required: true, message: '请选择租赁方式', trigger: 'change' }
        ],
        parentContractId: [
          { required: true, message: '请选择转租权利人', trigger: 'change' }
        ],
        tenant: [
          { required: true, message: '请选择名称', trigger: 'change' }
        ],
        shopName: [
          { required: true, message: '请选择用途', trigger: 'blur' }
        ],
        signtDate: [
          { required: false, message: '请选择合同签订日', trigger: 'change' }
        ],
        startDate: [
          { required: true, message: '请选择合同起始日', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择合同终止日', trigger: 'change' }
        ],
        contractNo: [
          { required: false, message: '请输入合同编号', trigger: 'blur' }
        ],
        townContractNo: [
          { required: false, message: '请输入镇统一合同编号', trigger: 'blur' }
        ],
        contractNature: [
          { required: false, message: '请选择合同性质', trigger: 'change' }
        ]
      },
      addData2: {
        rentClauses: []
      },
      rentClausesRules: {
        area: [
          { required: true, message: '请输入租赁面积', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ]
      },
      LeaseClauseDataRules: {
        month: [
          { required: true, message: '请输入付款周期', trigger: 'blur' }
        ],
        dayNumber: [
          { required: true, message: '请输入账单应收日期', trigger: 'blur' }
        ],
        lateFeeRate: [
          { required: false, message: '请输入滞纳金比例', trigger: 'blur' }
        ]
      },
      LeaseClauseData: {
        incrementRates: [],
        offerRecords: []
      },
      selecting: true,
      tableData: [],
      increaseForm: {
        startDate: '',
        number: '',
        incrementUnit: 'P'
      },
      increaseFormRules: {
        startDate: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        number: [
          { required: true, message: '请输入递增', trigger: 'blur' }
        ]
      },
      tenantNameOptions: [],
      subleaseObligeeOptions: [],
      contractStartLimit: {
        disabledDate: time => {
          if (this.addData.startDate) {
            return time.getTime() < new Date(this.addData.startDate).getTime()
          } else {
            return
          }
        }
      },
      contractEnd: {
        disabledDate: time => {
          if (this.addData.startDate) {
            return time.getTime() < new Date(this.addData.startDate).getTime()
          } else {
            return
          }
        }
      },
      contractStart: {
        disabledDate: time => {
          if (this.addData.endDate) {
            return time.getTime() > new Date(this.addData.endDate).getTime()
          } else {
            return
          }
        }
      },
      buildingName: '',
      multipleSelectionAll: []
    }
  },
  created () {
    this.projectListParent = this.projectList
    this.queryTreeAll()
    this.getTenant()
  },
  methods: {
    queryTreeAll () {
      context.http.get('uaa/api/organizes/enterprise/user', {
        useStatus: 'USING',
        organizeType: 'ENTERPRISE'
      }).then(result => {
        if (result.status === 200 && result.data.length > 0) {
          this.enterpriseOptions = result.data
        } else {
          this.enterpriseOptions = []
        }
      })
    },
    getProject (organizeId, type) {
      context.http.get('/cms/api/project-managements/byOrganizeId', {
        useStatus: 'USING',
        organizeId: organizeId
      }).then(res => {
        if (res.status === 200) {
          this.optionsProject = res.data
        }
      })
      if (!type) {
        this.multipleSelectionAll = []
        this.$set(this.addData, 'projectManagement', '')
      }
      this.getBuliding(type)
    },
    async getBuliding (type) {
      this.$set(this.addData, 'parentContractId', '')
      this.subleaseObligeeOptions = []
      this.tableData = []
      let result = await context.http.get('/cms/api/buildings', {
        page: 0,
        size: 100,
        sort: 'sortNumber,asc',
        useStatus: 'USING',
        organizeId: this.addData.organizeId,
        projectId: this.addData.projectManagement.id,
        addressOrName: ''
      })
      this.originalTableData = result.data.buildingListDTOS
      if (result.data.buildingListDTOS.length === 0) {
        this.tableData = []
        this.multipleSelectionAll = []
        // this.$set(this.addData, 'tenant', '')
        return
      }
      this.tableData = result.data.buildingListDTOS
      if (type) {
        let multipleSelectionAll = this.detailData.buildings
        console.log('multipleSelectionAll', multipleSelectionAll)
        let tableData = this.tableData
        let selected = []
        tableData.forEach(ele => {
          multipleSelectionAll.forEach(ele2 => {
            if (ele.id === ele2.id) {
              selected.push(ele)
            }
          })
        })
        this.multipleSelectionAll = this.compare(selected)
        this.selectHandler()
        this.getTenant(this.addData.tenant.teantName, type)
        this.getSubleaseObligeeOptions(type)
      } else {
        // this.$set(this.addData, 'tenant', '')
        this.multipleSelectionAll = []
      }
    },
    getBuliding2 () {
      let berthInputVal = this.buildingName
      let roomsDTOS = []
      if (berthInputVal === '') {
        this.tableData = this.originalTableData
        this.selectHandler()
        return
      }
      this.tableData.forEach(ele => {
        if (ele.buildingName.indexOf(berthInputVal) >= 0 || ele.address && ele.address.indexOf(berthInputVal) >= 0) {
          roomsDTOS.push(ele)
        }
      })
      this.tableData = roomsDTOS
      this.selectHandler()
    },
    getTenant (name = '', type) {
      context.http.get(`/cms/api/tenant/nameLike?name=${name}`, {
        size: 20
      }).then(res => {
        this.tenantNameOptions = res.data
      })
    },
    // 转租权利人
    getSubleaseObligeeOptions (type) {
      if (!type) {
        this.$set(this.addData, 'parentContractId', '')
      }
      this.subleaseObligeeOptions = []
      let bulidingId = []
      if (this.multipleSelectionAll.length > 0) {
        this.multipleSelectionAll.forEach(ele => {
          bulidingId.push(ele.id)
        })
        bulidingId = bulidingId.join(',')
      } else {
        return
      }
      context.http.get(`/cms/api/contracts/building/all`, {
        buildingId: bulidingId
      }).then(res => {
        this.subleaseObligeeOptions = res.data
      })
    },
    remoteMethod (query) {
      this.getTenant(query)
    },
    remoteMethod2 (query) {
      // this.getTenant(query)
    },
    priceUnitFormat (val) {
      const amap = {
        'M2DAYS': '面积单价(每天)',
        'MONTH': '月租金',
        'YEAR': '年租金'
      }
      return amap[val]
    },
    assetsTypeFormte (val) {
      const amap = {
        'BUILDING': '楼宇',
        'LAND': '土地',
        'FIELD': '场地'
      }
      return amap[val]
    },
    getformat2 (str) {
      return getformat(str)
    },
    contractChange () {
      for (let i = 0; i < this.LeaseClauseData.offerRecords.length; i++) { // 租金优惠
        this.LeaseClauseData.offerRecords[i].yhStartDate = ''
        this.LeaseClauseData.offerRecords[i].yhEndDate = ''
      }
      for (let i = 0; i < this.LeaseClauseData.incrementRates.length; i++) { // 租金递增
        this.LeaseClauseData.incrementRates[i].startDate = ''
        this.LeaseClauseData.incrementRates[i].endDate = ''
      }
    },
    yhChangeEnd (index) {
      if (index > 0) {
        if (this.LeaseClauseData.offerRecords[index].yhStartDate < this.LeaseClauseData.offerRecords[index - 1].yhEndDate) {
          this.$message.error('开始时间不能大于上个阶段开结束时间')
          this.LeaseClauseData.offerRecords[index].yhStartDate = ''
        }
      }
      if (this.LeaseClauseData.offerRecords[index].yhStartDate < this.addData.startDate || this.LeaseClauseData.offerRecords[index].yhStartDate > this.addData.endDate) {
        this.$message.error('时间必须在合同时间范围内')
        this.LeaseClauseData.offerRecords[index].yhStartDate = ''
      }
    },
    yhChangeStart (index) {
      if (this.LeaseClauseData.offerRecords[index].yhEndDate < this.LeaseClauseData.offerRecords[index].yhStartDate) {
        this.$message.error('结束时间不能小于开始时间')
        this.LeaseClauseData.offerRecords[index].yhEndDate = ''
      }
      if (this.LeaseClauseData.offerRecords[index].yhEndDate > this.addData.endDate || this.LeaseClauseData.offerRecords[index].yhEndDate < this.addData.startDate) {
        this.$message.error('时间必须在合同时间范围内')
        this.LeaseClauseData.offerRecords[index].yhEndDate = ''
      }
    },
    closeAddDialog () {
      this.$emit('addDialogClose')
    },
    handleSelectionChange (val) { },
    selectHandler () {
      this.selecting = true
      this.$nextTick(() => {
        const rows = this.multipleSelectionAll
        if (rows && rows.length > 0) {
          this.$refs.multipleTable.clearSelection()
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row, true)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      })
    },
    openDetails (selection, row) {
      let multipleSelectionAll = this.multipleSelectionAll
      if (event.target.checked) {
        multipleSelectionAll.push(row)
      } else {
        multipleSelectionAll.forEach(function (item, index, arr) {
          if (item.id === row.id) {
            arr.splice(index, 1)
          }
        })
      }
      this.multipleSelectionAll = multipleSelectionAll
      this.multipleSelectionAll = this.compare(this.multipleSelectionAll)
      this.initRentClauses()
      console.log(this.multipleSelectionAll)
      this.getSubleaseObligeeOptions()
    },
    selectAll (selection) {
      if (selection.length > 0) {
        let multipleSelectionAll = [...this.multipleSelectionAll, ...this.tableData]
        let multipleSelectionAll2 = [...new Set(multipleSelectionAll)]
        this.multipleSelectionAll = multipleSelectionAll2
      } else {
        this.multipleSelectionAll = []
      }
      this.multipleSelectionAll = this.compare(this.multipleSelectionAll)
      this.initRentClauses()
      this.getSubleaseObligeeOptions()
    },
    compare (data) {
      data.sort((a, b) => {
        return a.id - b.id > 0 ? 1 : -1
      })
      return data
    },
    array_diff (a, b) {
      for (var i = 0; i < b.length; i++) {
        for (var j = 0; j < a.length; j++) {
          if (a[j].id === b[i].id) {
            a.splice(j, 1)
            j = j - 1
          }
        }
      }
      return a
    },
    previousStep () {
      if (this.newlystep2) {
        this.newlystep1 = true
        this.newlystep2 = false
        this.newlystep3 = false
      } else if (this.newlystep3) {
        this.newlystep1 = false
        this.newlystep2 = true
        this.newlystep3 = false
      }
    },
    newlystepNoe () {
      if (this.newlystep1) {
        this.$refs['addData'].validate((valid) => {
          if (valid) {
            if (this.multipleSelectionAll.length === 0) {
              this.$message.error('请选择楼宇')
              return
            }
            this.newlystep1 = false
            this.newlystep2 = true
            this.newlystep3 = false
          } else {
            return false
          }
        })
      } else if (this.newlystep2) {
        this.$refs['rentClauses'].validate((valid) => {
          if (valid) {
            this.$refs['LeaseClauseData'].validate((valid) => {
              if (valid) {
                if (!this.icVerification()) {
                  return
                }
                this.newlystep1 = false
                this.newlystep2 = false
                this.newlystep3 = true
              } else {
                return false
              }
            })
          } else {
            return false
          }
        })
      }
    },
    icVerification () {
      let result = true
      if (this.LeaseClauseData.offerRecords.length > 0) {
        let incrementRates3 = this.LeaseClauseData.offerRecords
        let incrementRatesLength = this.LeaseClauseData.offerRecords.length
        for (let i = 0; i < incrementRatesLength; i++) {
          if (!incrementRates3[i].yhStartDate || !incrementRates3[i].yhEndDate) {
            this.$message.error('免租期信息请输入完整')
            result = false
          }
        }
      } else {
        this.LeaseClauseData.offerRecords = []
      }
      return result
    },
    initRentClauses () {
      let area = 0 // 总建筑面积
      let rentClauses = []
      this.multipleSelectionAll.forEach(ele => {
        area += ele.useArea
        rentClauses.push({
          buildingId: ele.id,
          area: '',
          priceL: '',
          incrementRates: []
        })
      })
      this.addData.area = area.toFixed(2)
      // 记住上次选中内容不被清空
      let addData2RentClauses = this.addData.rentClauses
      let buildings = this.addData.buildings
      let sameBuildings = []
      if (addData2RentClauses && addData2RentClauses.length > 0) {
        for (var i = 0; i < buildings.length; i++) {
          for (var j = 0; j < rentClauses.length; j++) {
            if (buildings[i].id === rentClauses[j].buildingId) {
              sameBuildings.push(buildings[i])
            }
          }
        }
        addData2RentClauses.forEach(ele => {
          sameBuildings.forEach(ele2 => {
            if (ele.buildingId === ele2.id) {
              ele2.incrementRates = ele.incrementRates
              ele2.area = ele.area
              ele2.price = ele.price
              ele2.priceUnit = ele.priceUnit
            }
          })
        })
        sameBuildings.forEach(ele => {
          rentClauses.forEach(ele2 => {
            if (ele.id === ele2.buildingId) {
              ele2.incrementRates = ele.incrementRates
              ele2.area = ele.area
              ele2.price = ele.price
              ele2.priceUnit = ele.priceUnit
            }
          })
        })
      }
      this.addData2.rentClauses = rentClauses
    },
    openDialog (item, index) {
      this.increaseForm = {
        startDate: '',
        number: '',
        incrementUnit: 'P',
        point: ''
      }
      this.dialogVisible = true
      this.selectIndex = index
      this.setContractStartLimit(item)
    },
    setContractStartLimit (item) {
      const itemIncrementRates = item.incrementRates
      if (itemIncrementRates.length > 0) {
        this.contractStartLimit = {
          disabledDate: time => {
            if (itemIncrementRates[itemIncrementRates.length - 1].startDate) {
              if (time.getTime() < new Date(itemIncrementRates[itemIncrementRates.length - 1].startDate).getTime()) {
                return true
              }
              if (time.getTime() > new Date(this.addData.endDate).getTime()) {
                return true
              }
            } else {
              return
            }
          }
        }
      } else {
        this.contractStartLimit = {
          disabledDate: time => {
            if (this.addData.startDate) {
              if (time.getTime() < new Date(this.addData.startDate).getTime()) {
                return true
              }
              if (time.getTime() > new Date(this.addData.endDate).getTime()) {
                return true
              }
            } else {
              return
            }
          }
        }
      }
    },
    increaseDetermine (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.increaseForm.number === 0) {
            this.$message.error('递增数值需大于0')
            return
          }
          this.addData2.rentClauses[this.selectIndex].incrementRates.push(this.increaseForm)
          let rentClauses = this.addData2.rentClauses[this.selectIndex]
          let incrementRates = rentClauses.incrementRates
          if (incrementRates.length === 1) {
            incrementRates[0].point = Number(rentClauses.price)
            if (this.increaseForm.incrementUnit === 'Y') {
              incrementRates[incrementRates.length - 1].point += Number(this.increaseForm.number)
              incrementRates[incrementRates.length - 1].point = (incrementRates[incrementRates.length - 1].point).toFixed(2)
            } else {
              incrementRates[incrementRates.length - 1].point += Number((Number(incrementRates[incrementRates.length - 1].point) * (Number(this.increaseForm.number) / 100)).toFixed(2))
              incrementRates[incrementRates.length - 1].point = (incrementRates[incrementRates.length - 1].point).toFixed(2)
            }
          } else {
            if (this.increaseForm.incrementUnit === 'Y') {
              incrementRates[incrementRates.length - 1].point = (Number(incrementRates[incrementRates.length - 2].point) + Number(this.increaseForm.number)).toFixed(2)
            } else {
              incrementRates[incrementRates.length - 1].point =
                (Number(incrementRates[incrementRates.length - 2].point) +
                  Number(incrementRates[incrementRates.length - 2].point) * (Number(this.increaseForm.number) / 100)).toFixed(2)
            }
          }
          this.dialogVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    calculationIncrementToNumber () {
      let rentClauses = this.addData2.rentClauses[this.currentIndex]
      let incrementRates = rentClauses.incrementRates
      if (incrementRates.length === 0) {
        return
      }
      incrementRates.forEach((ele, index) => {
        ele.point = Number(ele.point)
        if (index === 0) {
          if (ele.incrementUnit === 'Y') {
            ele.point = (Number(rentClauses.price) + incrementRates[index].number).toFixed(2)
          } else {
            ele.point = (Number(rentClauses.price) + Number((Number(rentClauses.price) * (Number(incrementRates[index].number) / 100)).toFixed(2))).toFixed(2)
          }
        } else {
          if (ele.incrementUnit === 'Y') {
            ele.point = (Number(incrementRates[index - 1].point) + incrementRates[index].number).toFixed(2)
          } else {
            ele.point = (Number(incrementRates[index - 1].point) + Number((Number(incrementRates[index - 1].point) * (Number(incrementRates[index].number) / 100)).toFixed(2))).toFixed(2)
          }
        }
      })
    },
    priceChange (index) {
      this.currentIndex = index
      this.calculationIncrementToNumber()
    },
    addOfferRecord () {
      this.LeaseClauseData.offerRecords.push({
        yhStartDate: '',
        yhEndDate: ''
      })
    },
    delOfferRecord (index) {
      this.LeaseClauseData.offerRecords.splice(index, 1)
    },
    delStep (itme, index, cindex) {
      itme.incrementRates.splice(index, 1)
      this.setContractStartLimit(itme)
      this.currentIndex = cindex
      this.calculationIncrementToNumber()
    },
    setAnnex (annexURL, annexName) {  // 子组件上传成功返回文件url 和名字
      this.addData.annexes.push({
        'annexName': annexName,
        'annexURL': annexURL
      })
    },
    deleFile (index) {
      this.addData.annexes.splice(index, 1)
    },
    previewContract (type) {
      this.LeaseClauseData.carryModeRent = 'ROUNDING'
      this.LeaseClauseData.billingType = 'MONTH'
      this.LeaseClauseData.yearDay = '365'
      this.LeaseClauseData.billDivision = 'NO'
      this.LeaseClauseData.onBillContainFirstOfferReocrd = 'false'
      this.addData.buildings = this.multipleSelectionAll
      this.addData.contractNature = this.addData.contractNature || null
      this.addData.contractType = this.addData.contractType || null
      if (this.addData.contractType === 'RENT') {
        this.addData.parentContractId = ''
      }
      let array = this.addData2.rentClauses
      let rentClauses = []
      for (let index = 0; index < array.length; index++) {
        const ele = array[index]
        const incrementRates = ele.incrementRates
        rentClauses.push({ ...ele, ...this.LeaseClauseData })
        rentClauses[index].incrementRates = incrementRates
      }
      this.addData.rentClauses = rentClauses
      if (type === 'temporary') {
        context.http.post('/cms/api/contracts/temporary', this.addData).then(res => {
          if (res.status === 201) {
            this.closeAddDialog()
            this.$emit('query')
          }
        })
      } else {
        context.http.post('/cms/api/contracts', this.addData).then(res => {
          if (res.status === 201) {
            this.closeAddDialog()
            this.$emit('query')
          }
        })
      }
    }
  }
}
</script>
<style lang="scss">
.gov-addContracts {
  .el-button {
    font-size: 14px !important;
  }
  .el-table {
    padding-right: 20px;
  }
  .el-form-item {
    width: 270px;
    margin-bottom: 20px;
    vertical-align: top;
  }
  .el-date-editor {
    width: 100% !important;
  }
  .dialog-footer {
    padding: 10px 20px 20px;
    text-align: right;
    background-color: #ffffff;
  }
  .el-textarea__inner {
    border: none;
    padding: 0;
    padding-top: 10px;
  }
  .aliDownload {
    height: auto !important;
  }
  .step2 {
    .form-group {
      .el-form-item {
        width: 400px;
      }
    }
  }
  .el-form--label-top .el-form-item__label {
    padding: 0;
  }
  .oss_file {
    width: 80px;
    height: 24px;
    line-height: 20px;
  }
  .closebutton {
    background-color: #fff !important;
    border: none;
    &:hover {
      background-color: transparent !important;
    }
  }
}
.govcontract-increasedialog {
  .el-dialog__header {
    border: none;
    margin: 0;
  }
  .el-dialog__body {
    margin: 0 20px;
    border: none;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 160px;
  }
  .el-form-item {
    width: 85px;
    display: inline-block;
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
  }
  .el-form--label-top .el-form-item__label {
    padding: 0;
  }
  .close-button {
    margin-left: 0 !important;
    background-color: #fff !important;
    border: none;
    &:hover {
      background-color: #ffffff !important;
    }
  }
  .defaultbtn {
    width: 90px !important;
    height: 34px !important;
    line-height: 9px !important;
  }
}
</style>
<style lang="scss" scoped>
.ga-head {
  display: flex;
  justify-content: space-start;
  padding: 10px 20px;
  background-color: #fff;
}
.step {
  display: inline-block;
  width: 49%;
  height: 40px;
  line-height: 40px;
  padding-left: 14px;
  font-size: 16px;
  background-color: #f9f9f9;
  color: #777;
  border-radius: 6px;
  margin-right: 20px;
  &:last-child {
    margin-right: 0;
  }
}
.stepActive {
  color: #fff;
  background-color: #3175d2;
}
.stepActivePast {
  color: #fff;
  background-color: #789ed2;
}
.drawer-content {
  margin-top: 10px;
}
.el-textarea__inner {
  height: 100px;
}
.checkAll {
  font-size: 16px;
  .el-checkbox__label {
    font-size: 16px;
  }
}
.cttitle {
  margin-bottom: 10px;
}
.el-select {
  width: 100%;
}
.el-form-item__content {
  .el-cascader {
    width: 100%;
  }
  span {
    color: #666;
  }
}
.dl-content {
  width: 100%;
  margin-bottom: 12px !important;
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
          /* background: url(../../../assets/upload.png) no-repeat; */
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
      margin-bottom: 24px;
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
      margin-bottom: 24px;
    }
    .el-form-item {
      display: inline-block;
      width: 45%;
      margin-left: 16px;
      margin-right: 10px;
      &:nth-of-type(odd) {
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
.step1 {
  .dc-block {
    width: 100%;
    margin-top: 12px;
    background-color: #fff;
    > div {
      padding-left: 20px;
    }
    .dc-head {
      background-color: #fff;
      color: #262626;
      height: 40px;
      line-height: 40px;
      /* padding-left: 20px; */
      font-size: 14px;
      font-weight: 700;
      border-bottom: 1px solid #f6f6f6;
    }
    .rent-free {
      display: flex;
      justify-content: space-between;
      padding-right: 20px;
      .add-btn {
        font-weight: normal;
        color: #3575f6;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .vertical {
      display: inline-block;
      width: 4px;
      height: 17px;
      background-color: #3575f6;
      border-radius: 2px;
      vertical-align: sub;
      margin-right: 5px;
    }
    .reqriud {
      color: #eb6a5b;
      margin-left: 5px;
    }
    .scNumber {
      display: inline-block;
      width: 16px;
      height: 16px;
      line-height: 16px;
      text-align: center;
      border-radius: 50%;
      background-color: #eb6a5b;
      color: #ffffff !important;
      margin: 0;
    }
    .assets-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 20px;
      .operation {
        color: #3575f6;
        &:hover {
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
    .icon-lajixiang {
      color: #ff0000;
      cursor: pointer;
    }
  }
}
.form-group {
  padding-left: 0 !important;
  .fg-header {
    background-color: #eef9fb;
    color: #333333;
    padding: 10px 20px;
    p {
      padding: 2px 0;
      span {
        margin-right: 20px;
      }
    }
  }
  .fg-content {
    padding-left: 20px;
    display: flex;
    justify-content: space-between;
    .ct-left {
      display: flex;
      flex-direction: column;
      width: 50%;
    }
    .ct-right {
      width: 50%;
      position: relative;
      .increase-btn {
        position: absolute;
        left: 50%;
        top: 10px;
        cursor: pointer;
        z-index: 99;
        color: #3575f6;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
.enclosure-head2 {
  height: 40px;
  line-height: 40px;
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f6f6f6;
  span {
    display: inline-block;
    width: 60%;
    padding-left: 0px;
  }
  .upload {
    position: relative;
    float: right;
    display: inline-block;
    width: 60px;
    height: 24px;
    line-height: 23px;
    opacity: 0.9;
    border-radius: 2px;
    font-size: 12px;
    text-align: center;
    border: 1px solid rgba(15, 117, 255, 1);
    color: rgba(15, 117, 255, 1);
    border-radius: 4px;
    margin: 8px;
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
}
.enclosure {
  width: 96%;
  margin-bottom: 0 !important;
  padding-left: 0 !important;
  margin-left: 20px;
  padding-bottom: 20px;
  margin-top: 10px;
  .enclosure-head {
    border-bottom: 1px solid #d8dce3;
    background-color: #f7f8fa;
  }
  .enclosure-list {
    border-bottom: 1px solid #ebebeb;
    border-left: 1px solid #ebebeb;
    border-right: 1px solid #ebebeb;
  }
  .el-item {
    height: 30px;
    line-height: 30px;
    span {
      display: inline-flex;
      align-items: center;
      width: 48%;
      padding-left: 40px;
    }
    .operation {
      justify-content: flex-end;
      padding-right: 20px;
      > i {
        margin-left: 20px;
        cursor: pointer;
      }
    }
  }
}
/* steps start */
.stepsProcess {
  padding: 30px 24px 20px 24px;
  position: relative;
  background: #fff;
}
.pre {
  height: auto;
}
.stepsProcessCon {
  display: flex;
  flex-flow: column;
}
.pre .processItem {
  position: relative;
  display: flex;
  flex-shrink: 1;
}
.lined {
  width: 1px;
  /* height: 50px; */
  background: #eee;
  position: absolute;
  left: 6px;
  top: 18px;
}
.step__head {
  flex-grow: 0;
  width: 24px;
  position: relative;
}
.step__line {
  width: 1px;
  top: 0;
  bottom: 0;
  left: 6px;
  position: absolute;
  border-color: inherit;
  background-color: #c0c4cc;
}
.step__icon {
  position: relative;
  z-index: 1;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  font-size: 14px;
  box-sizing: border-box;
  background: #fff;
  transition: 0.15s ease-out;
  border-radius: 50%;
  border: 2px solid;
  border-color: inherit;
}

.step__main {
  padding-left: 10px;
  flex-grow: 1;
  white-space: normal;
  text-align: left;
}

.circle {
  width: 12px;
  height: 12px;
  border: 3px solid #d3dbeb;
  margin-right: 20px;
  border-radius: 50%;
}
.circle1 {
  position: absolute;
  top: 0;
}
.circle2 {
  position: absolute;
  bottom: 0;
}
.processItemCon {
  position: relative;
}
.date-wrap {
  display: inline-block;
  width: 200px;
  height: 30px;
  line-height: 30px;
  background: #ffffff;
  border: 1px solid #ebebeb;
  border-radius: 4px;
  margin-top: 6px;
  padding-left: 8px;
}

/* steps end */
</style>
