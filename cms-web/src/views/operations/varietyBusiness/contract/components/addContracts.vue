<template>
  <div class="addMultipleContracts">
    <div class="dl-head">
      <span class="step"
            :class="{stepActive: newlystep1, stepActivePast: newlystep2}"><span style="font-size: 20px;">1</span>. 基本资料</span>
      <span class="step"
            :class="{stepActive: newlystep2}"><span style="font-size: 20px;">2</span>. 费用条款</span>
      <span class="step"
            :class="{stepActive: newlystep3}"><span style="font-size: 20px;">3</span>. 其他资料</span>
    </div>
    <div class="dl-content clearfix">
      <el-form :model="addData"
               ref="addData1"
               :rules="addDataRules1">
        <div class="step1"
             v-show="newlystep1">
          <div class="dc-left float-left"
               v-if="houseReadOnly">
            <div class="dr-head"
                 style="text-align: left">多经点位</div>
            <div class="basic-select" style="height: auto">
              <div class="clearfix selectInput"
                   style="border: none"
                   v-if="detailData.managementPoints">
                <img :src="detailData.projectManagement.previewImage" />
                <span style="float: none">{{detailData.projectManagement.projectName}}</span>
              </div>
              <div class="bd-number">
                <!-- 1号楼 -->
              </div>
              <div class="layer"
                   v-for="(item, index) in detailData.managementPoints"
                   :key="index">
                <div>
                  <span v-if="item.floor">{{item.floor.name}}层</span>
                  <span class="showTitle" :title="item.buildingArea" v-if="item.shopNumber">{{item.shopNumber}}</span>
                  <span v-if="item.buildingArea">{{item.buildingArea}}m²</span>
                </div>
              </div>
            </div>
          </div>
          <div class="dc-left float-left"
               v-else>
            <div class="dr-head"
                 style="text-align: left">多经点位</div>
            <div class="basic-select">
              <div @click="choose('project')"
                   class="clearfix"
                   :class="selProject ? 'selectInput selectActive' : 'selectInput'">
                <img :src="chooseObj.previewImage" v-if="chooseObj"/>
                <span v-if="chooseObj">{{chooseObj.referred}}</span>
                <span class="iconfont icon-xiala-"></span>
              </div>
              <ul v-if="selProject"
                  class="selectBox">
                <li @click="chooseItem('project', item)"
                    v-for="(item, index) in projectList"
                    :key="index">
                  <img :src="item.previewImage" />
                  <span>{{item.referred}}</span>
                </li>
              </ul>
            </div>
            <div v-if="errorProject"
                 class="errorpjTip">请选择项目</div>
            <div class="pointListHead">
              <span>编号</span>
              <span>点位名称</span>
              <span>点位类型</span>
            </div>
            <ul class="buildList">
              <dl>
                <dd>
                  <el-checkbox-group v-model="checkIdList"
                                      class="select"
                                       @change="handleChecked">
                    <el-checkbox v-for="items in pointPositionList"
                                  :key="items.id"
                                  :label="items.id" class="checkboxwarp">
                      <span style="text-align: left;overflow: hidden;" :title="items.pointCode">{{items.pointCode}}</span>
                      <span style="text-align: left;overflow: hidden;" :title="items.pointName">{{items.pointName}}</span>
                      <span style="overflow: hidden;" :title="items.pointTypeName">{{items.pointTypeName}}</span>
                    </el-checkbox>
                  </el-checkbox-group>
                </dd>
              </dl>
            </ul>
          </div>
          <div class="dc-right float-right">
            <div class="dr-head">合同信息</div>
            <el-form-item :label-width="formLabelWidth"
                          style="margin-bottom: 20px;"
                          prop="rentalMethod">
              <div class="cttitle">租赁方式<i class="required">*</i></div>
              <el-select v-model="addData.rentalMethod"
                         placeholder="请选择">
                <el-option label="固定租金"
                           value="RENT"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          style="margin-bottom: 20px;"
                          prop="contractNo">
              <div class="cttitle">合同编号<i class="required">*</i></div>
              <el-input v-model="addData.contractNo"
                        @input.native="changeCode"
                        maxlength="20"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item prop="startDate"
                          :label-width="formLabelWidth"
                          style="margin-bottom: 20px;">
              <div class="cttitle">合同开始时间<i class="required">*</i></div>
              <el-date-picker v-model="addData.startDate"
                              value-format="yyyy-MM-dd"
                              type="date"
                              :picker-options="contractStart"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          prop="endDate"
                          style="margin-bottom: 20px;">
              <div class="cttitle">合同结束时间<i class="required">*</i></div>
              <el-date-picker v-model="addData.endDate"
                              type="date"
                              :picker-options="contractEnd"
                              value-format="yyyy-MM-dd"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          style="margin-bottom: 20px;"
                          prop="signtDate">
              <div class="cttitle">合同签订时间<i class="required">*</i></div>
              <el-date-picker v-model="addData.signtDate"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth">
              <div class="cttitle">多经用途</div>
              <el-input v-model="addData.purpose"
                        style="margin-right: 10px"
                        maxlength="20"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
          </div>
          <div class="dc-right float-right tenantinfo">
            <div class="dr-head">客户信息</div>
            <el-form-item :label-width="formLabelWidth"
                          prop="tenant"
                          style="margin-bottom: 20px;vertical-align: top;">
              <div class="cttitle">客户名称<i class="required">*</i></div>
              <el-select filterable
                         v-model="addData.tenant"
                         value-key="id"
                         placeholder="请选择">
                <el-option v-for="item in tenantNameeOptions"
                           :key="item.id"
                           :label="item.teantName"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth">
              <div class="cttitle">品牌</div>
              <span>{{addData.tenant?addData.tenant.referred:''}}</span>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" style="vertical-align: top;">
              <div class="cttitle">法人</div>
              <span>{{addData.tenant?addData.tenant.operName:''}}</span>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth">
              <div class="cttitle">行业</div>
              <span>{{addData.tenant?addData.tenant.industry:''}}</span>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth">
              <div class="cttitle">签订人</div>
              <el-input v-model="addData.signer"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth">
              <div class="cttitle">签订人联系方式</div>
              <el-input v-model="addData.signerPhone"
                        type="number"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <el-form>
        <div class="step2 dl-content"
             v-show="newlystep2">
          <div class="dc-right float-right">
            <div class="dr-head">已选中点位</div>
            <div class="selected-housing"
                 v-for="(item, index) in checkList"
                 :key="index">
              <span>{{item.projectName}}</span>
              <span>{{item.pointCode}}</span>
              <span>{{item.pointName}}</span>
              <span>{{item.pointTypeName}}</span>
            </div>
          </div>
          <el-form ref="LeaseClauseForm"
                   :model="LeaseClauseData"
                   :rules="LeaseClauseRules"
                   label-width="80px">
            <div class="dc-right float-right">
              <div class="dr-head">
                租赁条款
                <span class="iconfont icon-bottom"
                      :class="{'icon-top': !showLeaseTerms}"
                      @click="showLeaseTerms = !showLeaseTerms"></span>
              </div>
              <div class="selected-housing"
                   v-if="showLeaseTerms">
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;"
                              prop="startDate">
                  <div class="cttitle">开始时间<i class="required">*</i></div>
                  <el-date-picker v-model="LeaseClauseData.startDate"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  disabled="disabled"
                                  placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;"
                              prop="endDate">
                  <div class="cttitle">结束时间<i class="required">*</i></div>
                  <el-date-picker v-model="LeaseClauseData.endDate"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  disabled="disabled"
                                  placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;margin-right: 5px;width: 28%!important;"
                              >
                  <div class="cttitle">保证金金额</div>
                  <el-input @input.native="changeAmount"
                            maxlength="15"
                            v-model="LeaseClauseData.deposit"
                            placeholder="请输入内容"></el-input>
                </el-form-item>元
                <el-form-item v-if="addData.rentalMethod !== 'RENT'"
                              :label-width="formLabelWidth"
                              style="margin-bottom: 20px;"
                              prop="point">
                  <div class="cttitle">租金抽成比例(按营业额抽成)<i class="required">*</i></div>
                  <el-input v-model="LeaseClauseData.point" style="width: 83%!important"
                            type="number"
                            placeholder="请输入内容"></el-input>
                            <span>%/月</span>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">付款周期(几个月一付)<i class="required">*</i></div>
                  <el-select v-model="onPayClear"
                              @change="onPayClearChange"
                             placeholder="请选择">
                    <el-option label="一次性付清" value="onPayClear"></el-option>
                    <el-option v-for="item in paymentCycleOptions"
                               :key="item.value"
                               :label="item.value"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-show="onPayClear === 'onPayClear'"
                              :label-width="formLabelWidth"
                              style="margin-bottom: 20px;"
                              prop="price">
                  <div class="cttitle">租赁金额<i class="required">*</i></div>
                  <el-input v-model="LeaseClauseData.price" style="width: 83%!important"
                            @input="getPeriodicAmount"
                            maxlength="15"
                            placeholder="请输入内容"></el-input>
                  <span>元</span>
                </el-form-item>
                <el-form-item v-show="onPayClear !== 'onPayClear'"
                              :label-width="formLabelWidth"
                              style="margin-bottom: 20px;"
                              prop="price">
                  <div class="cttitle">租赁单价/月<i class="required">*</i></div>
                  <el-input v-model="LeaseClauseData.price" style="width: 83%!important"
                            maxlength="15"
                            @input="getPeriodicAmount"
                            placeholder="请输入内容"></el-input>
                  <span>元</span>
                </el-form-item>
                <el-form-item v-if="onPayClear !== 'onPayClear'"
                              :label-width="formLabelWidth"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">周期金额</div>
                  <el-input v-model="periodicAmount" style="width: 83%!important"
                            type="number"
                            disabled="disabled"
                            placeholder="周期金额"></el-input>
                  <span>元</span>
                </el-form-item>
                <el-form-item v-if="addData.rentalMethod === 'RENT'"
                              :label-width="formLabelWidth"
                              style="margin-bottom: 20px;"
                              prop="dayNumber">
                  <div class="cttitle">账单应收日期<i class="required">*</i></div>
                  <!-- <el-input v-model="LeaseClauseData.dayNumber" style="width: 83%!important"
                            @input.native="changeDate"
                            max="99"
                            maxlength="2"
                            placeholder="请输入内容"></el-input>
                  <span>自然日</span> -->
                  <el-select v-model="LeaseClauseData.dayType"
                            style="width: 58%;margin-right: 10px"
                            placeholder="请选择">
                  <el-option label="固定日期"
                              value="FIXED"></el-option>
                  <el-option label="提前天数"
                              value="TOP"></el-option>
                  </el-select>
                  <el-input v-model="LeaseClauseData.dayNumber"
                            type="number"
                            style="width: 36%;"
                            placeholder="请输入内容"></el-input>
                </el-form-item>
              </div>
            </div>
          </el-form>
          <div class="generated-btn">
            <span @click="generatedRentDetails">生成租金明细</span>
          </div>
          <div class="dc-right float-right">
            <div class="dr-head">租金账单明细
              <div class="right-btn">
                <!-- <span style="width: 70px;" @click="BillEdit=true" v-if="BillEdit===false">编辑</span>
                    <span style="width: 70px;" @click="BillEdit=false" v-else>保存</span> -->
							</div>
						</div>
						<div class="selected-housing">
							<ul>
								<li>日期</li>
								<li>费用类型</li>
								<li>付款日</li>
								<li v-if="addData.rentalMethod === 'RENT'">最终单价</li>
								<li v-if="addData.rentalMethod === 'GUARANTEEPOINT'">保底租金(元)</li>
								<li v-if="addData.rentalMethod !== 'RENT'">租金抽成比例</li>
								<li>最终金额(元)</li>
							</ul>
							<ul v-for="(item, index) in rentBillDetails" :key="index">
								<li>
									<el-checkbox v-model="checked" v-if="BillEdit"></el-checkbox>
									{{item.startDate}}～{{item.endDate}}
								</li>
								<li>{{item.feeTypeName}}</li>
								<li>{{item.finalPaymentDate}}</li>
								<li v-if="addData.rentalMethod === 'RENT'">{{item.finalPrice}}{{priceUnitFormat(item.priceUnit)}}</li>
								<li v-if="addData.rentalMethod === 'GUARANTEEPOINT'">{{item.bdAmount}}</li>
								<li v-if="addData.rentalMethod !== 'RENT'">
									<span v-if="item.feeTypeName === '租金'">{{item.finalPrice}}%</span>
									<span v-else>-</span>
								</li>
								<li v-if="addData.rentalMethod === 'RENT'">
									<input type="text" v-model="item.amount" v-if="BillEdit" />
									<div v-else class="overflow-style">{{item.amount}}元
										<span v-if="item.remake && item.feeTypeName === '租金保证金'" style="color: red">({{item.remake}})</span>
									</div>
								</li>
								<li v-if="addData.rentalMethod === 'POINTS'">
									<span v-if="item.feeTypeName === '租金'">营业额的{{item.finalPrice}}%</span>
									<span v-else>{{item.amount}}</span>
								</li>
								<li v-if="addData.rentalMethod === 'GUARANTEEPOINT'">
									<span v-if="item.feeTypeName === '租金'">{{item.bdAmount}}或者营业额的{{item.finalPrice}}%</span>
									<span v-else>{{item.amount}}</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</el-form>
			<div class="step3 dl-content" v-show="newlystep3">
				<div class="dc-right float-right" style="width: 100%">
					<div class="dr-head" style="margin-bottom: 0">备注</div>
					<div class="other-info" v-for="(item, index) in addData.remark" :key="index">
						<el-input type="textarea" :rows="2" resize="none" maxlength="200" v-model="item.content">
						</el-input>
					</div>
				</div>
				<div class="dc-right float-right" style="width: 100%">
					<div class="enclosure">
						<div class="enclosure-head">
              <div>附件</div>             
							<!-- <div class="upload">
								上传附件
								<input type="file" @change="imageChange('addapp', $event)">
							</div> -->
              <aliUpload
                :upLoadText="upLoadText"
                :fileType="fileType"
                @setAnnex="setAnnex"
              />
						</div>
						<div class="enclosure-head" style="border-bottom: 1px solid #D8DCE3;background-color:#fff">
							<span>文件名</span>
							<span>操作</span>
						</div>
						<!-- <div class="enclosure-list" v-if="houseReadOnly">
							<div class="el-item">
								<span>{{addData.annexName}}</span>
								<span v-if="addData.annexName">
									<i @click="downloadFile(addData, 0)" class="iconfont icon-xiazaidaoru" style="margin-right: 10px;"></i>
									<i @click="deleFile2()" class="iconfont icon-lajixiang"></i>
								</span>
							</div>
						</div> -->
						<div class="enclosure-list" v-for="(item, index) in addData.annexes" :key="index">
							<div class="el-item">
								<span>{{item.annexName}}</span>
								<span v-if="item.annexName">
									<i @click="downloadFile(item, index)" class="iconfont icon-xiazaidaoru" style="margin-right: 10px;"></i>
									<i @click="deleFile(item, index)" class="iconfont icon-lajixiang"></i>
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button @click="closeAddDialog" class="close-button" v-if="newlystep1">关 闭</el-button>
			<el-button type="primary" @click="previousStep" class="close-button" v-if="newlystep2 || newlystep3">上一步</el-button>
			<el-button @click="newlystepNoe('addData')" type="primary" class="defaultbtn dialog-confirmBtn" v-if="newlystep1 || newlystep2">下一步</el-button>
			<el-button type="primary" class="defaultbtn dialog-confirmBtn" v-if="newlystep3" @click="initiateApproval()">
				确 认
			</el-button>
		</div>
	</div>
</template>
<script>
import { amountFormat } from '@/utils/validate.js'
import context from '@/service'
import axios from 'axios'
import aliUpload from '@/components/aliUpload.vue'
window.repeatCode = false
export default {
  name: 'addContracts',
  components: {
    aliUpload
  },
  props: {
    projectList: {
      type: Array,
      default: []
    },
    detailData: {
      type: Object,
      default: {}
    },
    contractState: {
      type: String,
      default: ''
    },
    intentionToFormalize: {
      type: String,
      default: ''
    },
    approvalReject: {
      type: String,
      default: ''
    },
    queryObj: {
      type: Object,
      default: {}
    }
  },
  data () {
    var validateCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入合同编号'))
      } else if (window.repeatCode) {
        callback(new Error('合同编号已存在,请更换'))
      } else {
        callback()
      }
    }
    var validateYearDay = (rule, value, callback) => {
      if (this.LeaseClauseData.billingType === 'MONTH') {
        if (value === '' || value === undefined) {
          callback(new Error('请输入年天数'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      upLoadText: '上传附件',
      fileType: [],
      houseReadOnly: false,
      approvalAgain: false,
      pickerOptionsStart: {},
      pickerOptionsEnd: {},
      pointPositionList: [],
      onPayClear: '',
      addData: {
        tenant: {
          industry: '',
          contact: ''
        },
        rentClauses: [{
          termType: 'RENT',
          offerRecords: [],
          incrementRates: []
        }],
        remark: [{content: ''}],
        annexes: [],
        startDate: ''
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
      LeaseClauseData: {
        price: '',
        priceUnit: 'MONTH',
        termType: 'RENT',
        onPayClear: true,
        offerRecords: [],
        incrementRates: [],
        dayType: 'TOP'
      },
      offerReocrdOptions: [
        { name: '不包括', value: false },
        { name: '包括', value: true }
      ],
      onRentBillOptions: [
        { name: '不同步', value: false },
        { name: '同步', value: true }
      ],
      rentBillDetails: [],
      annexesList: [],
      newlystep1: true,
      newlystep2: false,
      newlystep3: false,
      rentIncrements: false,
      rentConcessions: false,
      decorationBond: false,
      increasingProperty: false,
      propertyFee: false,
      showLeaseTerms: true,
      showPropertyClause: true,
      showRentIncrements: true,
      showRentConcessions: true,
      showRentBond: true,
      showProperty: true,
      showPropertyDiscount: true,
      checked: true,
      BillEdit: false,
      formLabelWidth: '',
      documentTypeOptions: [],
      tenantNameeOptions: [],
      chooseObj: {},
      building: {},
      checkList: [],
      checkIdList: [],
      selHourse: false,
      selProject: false,
      errorProject: false,
      contractStatus: '',
      contractNumber: '',
      taskId: '',
      periodicAmount: '',
      addDataRules1: {
        rentalMethod: [{
          required: true,
          message: '请选择租赁方式',
          trigger: 'change'
        }],
        contractNo: [{
          validator: validateCode,
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
        signtDate: [{
          required: true,
          message: '请选择签订时间',
          trigger: 'blur'
        }],
        tenant: [{
          required: true,
          message: '请选择客户',
          trigger: 'change'
        }]
      },
      LeaseClauseRules: {
        startDate: [{
          required: false,
          message: '请选择开始时间',
          trigger: 'change'
        }],
        endDate: [{
          required: false,
          message: '请选择结束时间',
          trigger: 'change'
        }],
        price: [{
          required: true,
          message: '请输入价格',
          trigger: 'blur'
        }],
        month: [{
          required: true,
          message: '请选择付款周期',
          trigger: 'change'
        }],
        dayNumber: [{
          required: true,
          message: '请输入时间',
          trigger: 'blur'
        }]
      },
      billingTypeOptions: [
        {
          name: '按月计费',
          value: 'MONTH'
        },
        {
          name: '按实际天数计费',
          value: 'DAY'
        }
      ],
      paymentCycleOptions: [
        {
          value: 1
        }, {
          value: 2
        }, {
          value: 3
        }, {
          value: 4
        }, {
          value: 5
        }, {
          value: 6
        }, {
          value: 7
        }, {
          value: 8
        }, {
          value: 9
        }, {
          value: 10
        }, {
          value: 11
        }, {
          value: 12
        }
      ]
    }
  },
  watch: {
    projectList: {
      handler: function () {
        if (this.queryObj.projectObj) {
          let projectId = this.queryObj.projectObj
          let chooseObj = this.projectList.filter(ele => {
            return ele.id === projectId
          })
          this.chooseObj = chooseObj[0]
        } else {
          this.chooseObj = this.projectList[0]
        }
        this.approvalAgain = false
        this.checkIdList = []
        this.rentBillDetails = []
        this.getPoints(this.chooseObj.id)
        this.houseReadOnly = false
        this.addData = {
          tenant: {
            industry: '',
            contact: ''
          },
          rentClauses: [{
            termType: 'RENT',
            offerRecords: [],
            incrementRates: []
          }],
          remark: [{content: ''}],
          annexes: []
        }
        this.LeaseClauseData = {
          price: '',
          priceUnit: 'MONTH',
          termType: 'RENT',
          onPayClear: true,
          offerRecords: [],
          incrementRates: [],
          dayType: 'TOP'
        }
        this.newlystep1 = true
        this.newlystep2 = false
        this.newlystep3 = false
      }
    },
    contractState: { // 续签
      handler: function (newName, oldName) {
      },
      immediate: true
    },
    detailData: {
      handler: function (newName, oldName) {},
      immediate: true,
      deep: true
    },
    intentionToFormalize: { // 意向合同转正式合同
      handler: function (newVal, old) {
        console.log('newVal', newVal, old)
      },
      immediate: true
    },
    approvalReject: { // 审核驳回查看
      handler: function (newVal, old) {
        console.log('newVal', newVal, old)
      },
      immediate: true
    }
  },
  created () {},
  mounted () {},
  methods: {
    changeAmount () {
      this.$nextTick(() => {
        let amountVal = amountFormat(this.LeaseClauseData.deposit)
        this.LeaseClauseData.deposit = amountVal
      })
    },
    changeDate () {
      this.$nextTick(() => {
        if (this.LeaseClauseData.dayNumber === '0') {
          this.LeaseClauseData.dayNumber = 0
        }
        if (this.LeaseClauseData.dayNumber) {
          this.LeaseClauseData.dayNumber = this.LeaseClauseData.dayNumber.replace(/^(0+)|[^\d]+/g, '')
        }
      })
    },
    changeCode () {
      this.$nextTick(() => {
        if (this.addData.contractNo) {
          this.addData.contractNo = this.addData.contractNo.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g, '')
        }
      })
    },
    setAnnex (annexURL, annexName) {  // 子组件上传成功返回文件url 和名字
      this.addData.annexes.push({
        'annexName': annexName,
        'annexURL': annexURL
      })
      // console.log(annexURL, annexName)
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
    imageChange (state, event) {
      if (state === 'addapp') {
        let files = event.target.files
        let form = new FormData()
        form.append('file', files[0])
        let name = files[0].name
        let annexes = this.addData.annexes
        for (let i = 0; i < annexes.length; i++) {
          if (annexes[i].annexName === name) {
            return false
          }
        }
        event.target.value = ''
        context.http.post('/ywm/api/image-multipart', form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          this.$set(this.addData, 'annexName', name)
          this.$set(this.addData, 'annexURL', res.data)
          this.addData.annexes.push({
            'annexName': name,
            'annexURL': res.data
          })
        }).catch(error => {
          console.info(error)
        })
        // this.addData.annexes = this.annexesList
        // this.$forceUpdate()
      }
    },
    getPeriodicAmount () {
      this.$nextTick(() => {
        let amountVal = amountFormat(this.LeaseClauseData.price)
        this.LeaseClauseData.price = amountVal
      })
      if (this.onPayClear !== 'onPayClear') {
        this.periodicAmount = Number(this.onPayClear) * Number(this.LeaseClauseData.price)
      }
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
      this.addData.tenant = {
        referred: '',
        operName: '',
        industry: ''
      }
      this.addData.managementPoints = []
      this.checkList = []
      this.checkIdList = []
      if (state === 'project') {
        this.selProject = !this.selProject
      } else {
        this.selHourse = !this.selHourse
      }
      this.chooseObj = item
      this.getPoints(item.id)
    },
    formatCheckboxData () {
      let checkIdList = this.checkIdList
      let roomsList = []
      this.pointPositionList.forEach(ele => {
        roomsList.push(ele)
      })
      let newArr = []
      for (let i = 0; i < roomsList.length; i++) {
        for (let j = 0; j < checkIdList.length; j++) {
          if (checkIdList[j] === roomsList[i].id) {
            newArr.push(roomsList[i])
          }
        }
      }
      this.checkList = newArr
    },
    handleChecked (val) {
      this.formatCheckboxData()
    },
    newlystepNoe (formName) {
      if (this.newlystep1) {
        this.rentBillDetails = []
        let _this = this
        this.$refs['addData1'].validate((valid) => {
          if (valid) {
            if (_this.checkList.length === 0) {
              _this.$message.error('请选择多经点位')
              return false
            }
            // if (this.contractNumber === this.addData.contractNo) { // 判断合同编号是否改变
            //   _this.$message.error('请输入合同编号')
            //   return false
            // }
            if (!_this.addData.tenant.teantName) {
              _this.$message.error('请选择客户')
              return false
            }
            // this.formatCheckboxData()
            this.LeaseClauseData.startDate = this.addData.startDate
            this.LeaseClauseData.endDate = this.addData.endDate
            this.newlystep1 = false
            this.newlystep2 = true
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else if (this.newlystep2) {
        if (!this.showLeaseTerms) {
          return
        }
        if (this.onPayClear === '') {
          this.$message.error('请选择付款周期')
          return
        }
        this.$refs['LeaseClauseForm'].validate((valid) => {
          if (valid) {
            this.newlystep1 = false
            this.newlystep2 = false
            this.newlystep3 = true
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
      this.addData.managementPoints = this.checkList
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
    deleFile (item, index) {
      this.addData.annexes.splice(index, 1)
    },
    deleFile2 () {
      this.addData.annexName = null
      this.addData.annexURL = null
    },
    onPayClearChange () {
      if (this.onPayClear === 'onPayClear') {
        this.LeaseClauseData.month === ''
        this.LeaseClauseData.onPayClear = true
      }
      this.getPeriodicAmount()
    },
    getPoints (id) {
      context.http.get('/cms/api/tenant/projectManagement/' + id).then(res => {
        this.tenantNameeOptions = res.data
        if (this.queryObj.tenantId) {
          let tenant = this.tenantNameeOptions.filter(ele => {
            return ele.id === this.queryObj.tenantId
          })
          this.addData.tenant = tenant[0]
        } else {
          this.addData.tenant = {
            referred: '',
            operName: '',
            industry: ''
          }
        }
      })
      context.http.get('/cms/api/management-points?page=0&size=999&sort=pointCode,asc', {projectId: id, useStatus: 'USING'}).then(res => {
        this.pointPositionList = res.data
      })
    },
    closeAddDialog () {
      this.$emit('addDialogClose')
    },
    generatedRentDetails () {
      if (!this.showLeaseTerms) {
        return
      }
      if (this.onPayClear === '') {
        this.$message.error('请选择付款周期')
        return
      }
      this.$refs['LeaseClauseForm'].validate((valid) => {
        if (valid) {
          delete this.addData.annexName
          delete this.addData.annexURL
          if (this.onPayClear === '') {
            this.LeaseClauseData.month === ''
            this.$message.error('请选择付款周期')
            return
          } else if (this.onPayClear === 'onPayClear') {
            this.LeaseClauseData.onPayClear = true
            this.LeaseClauseData.month = ''
          } else {
            this.LeaseClauseData.onPayClear = false
            this.LeaseClauseData.month = this.onPayClear
          }
          this.addData.rentClauses[0] = this.LeaseClauseData
          context.http.post('/cms/api/management-contracts/bill', this.addData).then(res => {
            this.rentBillDetails = res.data
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    initiateApproval () {
      delete this.addData.annexName
      delete this.addData.annexURL
      if (this.onPayClear === '') {
        this.LeaseClauseData.month === ''
        this.$message.error('请选择付款周期')
        return
      } else if (this.onPayClear === 'onPayClear') {
        this.LeaseClauseData.onPayClear = true
        this.LeaseClauseData.month = ''
      } else {
        this.LeaseClauseData.onPayClear = false
        this.LeaseClauseData.month = this.onPayClear
      }
      this.addData.rentClauses[0] = this.LeaseClauseData
      this.addData.projectManagement = this.addData.tenant.projectManagement
      context.http.post('/cms/api/management-contracts', this.addData).then(res => {
        this.closeAddDialog()
        this.$emit('query')
      })
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
    async queryContractNo () {
      if (!this.addData.contractNo) {
        return false
      }
      let result = await context.http.get(`/cms/api/contracts/isRepeat?contractNo=${this.addData.contractNo}`)
      if (result.data) {
        window.repeatCode = true
      } else {
        window.repeatCode = false
      }
    }
  },
  destroyed () {
  }
}
</script>
<style lang="scss" scoped>
	.addMultipleContracts {
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
			.el-form-item {
				width: 30% !important;

				&:nth-of-type(odd) {
					margin-right: 10px !important;
				}
			}

			.dc-right {
				width: 100% !important;
				border: 1px solid #e7e7e7;

				.other-info {
					width: 98%;
					margin: 0 auto;

					.el-textarea {
						.el-textarea__inner {
							border: none;
						}
					}
				}
			}

			.selected-housing {
				margin-bottom: 20px;

				>span {
					display: inline-block;
					width: 24%;
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
						overflow: hidden;
						font-size: 12px;
					}
				}

				input {
					border: 1px solid rgba(231, 231, 231, 1);
					border-radius: 4px;
				}
			}

			.generated-btn {
				text-align: center;

				span {
					display: inline-block;
					width: 110px;
					height: 36px;
					line-height: 36px;
					margin-top: 20px;
					text-align: center;
					color: #fff;
					background: rgba(15, 117, 255, 1);
					border-radius: 4px;
					cursor: pointer;
				}
			}
		}

		.step3 {
			.other-info {
				.el-textarea {
					width: 100%;
					margin: 0 auto;

					.el-textarea__inner {
						border: none;
					}
				}
			}
		}

		.enclosure {
			margin-bottom: 20px;

			.enclosure-head {
				background-color: #fafafa;
				height: 40px;
				line-height: 40px;
				padding:0 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
				span {
					display: inline-block;
					width: 48%;
					padding-left: 40px;
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

			.el-item {
				height: 30px;
				line-height: 30px;

				span {
					display: inline-block;
					width: 48%;
					padding-left: 60px;
				}
			}
		}

		.dr-head {
			.iconfont {
				cursor: pointer;
				font-size: 12px;
			}

			.icon-add {
				font-size: 16px;
				color: #0073ff;
				margin-left: 40px;
			}

			.icon-reduce {
				font-size: 16px;
			}

			.right-btn {
				float: right;

				span {
					display: inline-block;
					width: 84px;
					height: 26px;
					line-height: 23px;
					text-align: center;
					color: #0f75ff;
					border: 1px solid rgba(15, 117, 255, 1);
					border-radius: 4px;
					margin-right: 6px;
					font-size: 12px;
					cursor: pointer;
				}

				.icon-cha {
					margin-right: 10px;
				}
			}
		}

		.tenantinfo {
			.el-form-item {
				width: 29% !important;
				margin-right: 0;
			}

			.cttitle+span {
				display: inline-block;
				height: 26px;
				line-height: 40px;
			}
		}
    .pointListHead{
      display: flex;width: 95%;
      margin: 0 auto;
      justify-content: space-around;
      margin-top: 10px;
      span {
        display: inline-block;
        width: 25%;
      }
    }
		.buildList {
			width: 95%;
			margin: 10px auto;
			height: 480px;
			overflow-y: scroll;
      .el-checkbox__input {
        margin-top: 4px;
      }
			li {
				width: 100%;

				p {
					width: 100%;
					display: flex;
					justify-content: space-between;
					background: #fafafa;
					padding: 0 15px;

					span {
						display: block;
						height: 30px;
						line-height: 30px;
					}
				}

				dl {
					width: 100%;
					padding: 0 15px;

					dd {
						width: 100%;
						border-bottom: 1px solid #e7e7e7;

						.select {
							width: 100%;

							.el-checkbox {
								width: 100%;
								margin: 0;
								display: flex;
								// height: 30px;
								padding-top: 10px;

								.el-checkbox__input {
									margin-top: 4px;
								}

								.el-checkbox__label {
									span {
										width: 66px;
										height: auto;
										display: inline-block;
										text-align: center;
										vertical-align: top;
										white-space: normal;
									}
								}
							}
						}
					}
				}
			}
      .checkboxwarp {
        display: flex;
        align-items: center;
        span {
          display: inline-block;
          width: 74px;
        }
      }
		}

		.enclosure-list {
			.iconfont {
				cursor: pointer;
			}
		}

		.basic-select {
			.layer {
				span {
					display: inline-block;
					width: 32%;
					margin-bottom: 10px;
					overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
				}
			}
		}

		.overflow-style {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
    }
    .basic-select {
      position: relative;
      cursor: pointer;
      width: 95%;
      margin: 0 auto;
      .selectInput {
        height: 40px;
        border: 1px solid #e7e7e7;
        border-radius: 5px;
        padding: 0 15px;
        &.selectActive {
          border: 1px solid #6473cb;
        }
        img {
          float: left;
          display: block;
          width: 30px;
          height: 20px;
          margin-right: 10px;
          margin-top: 10px;
        }
        span {
          float: left;
          color: #666666;
          display: block;
          line-height: 40px;
          font-size: 14px;
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
        top: 45px;
        z-index: 9;
        padding: 15px 0px;
        box-shadow: 1px 2px 5px #ddd;
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
    .dl-head {
      display: flex;
      justify-content: space-start;
      margin-top: 20px;
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
              background: url(../../../../../assets/upload.png) no-repeat;
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
	}
	/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
	.buildList::-webkit-scrollbar {
		width: 4px;
		height: 4px;
		background-color: #fff;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }

	/*定义滚动条轨道 内阴影+圆角*/
	.buildList::-webkit-scrollbar-track {
		-webkit-box-shadow: inset 0 0 6px #fff;
		border-radius: 10px;
		background-color: #fff;
	}

	/*定义滑块 内阴影+圆角*/
	.buildList::-webkit-scrollbar-thumb {
		border-radius: 10px;
		-webkit-box-shadow: inset 0 0 6px #3175d2;
		background-color: 3175d2;
	}
</style>
