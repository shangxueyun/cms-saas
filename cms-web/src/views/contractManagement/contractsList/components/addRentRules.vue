<template>
  <div class="add-rent-rules">
    <el-form class="clearfix">
      <el-form ref="LeaseClauseForm"
               :model="LeaseClauseData"
               :rules="LeaseClauseRules"
               class="clearfix"
               label-width="80px">
        <div class="dc-right float-right"
             style="margin-top: 20px">
          <div class="dr-head">
            租赁条款
            <span class="iconfont icon-bottom"
                  :class="{'icon-top': !showLeaseTerms}"
                  @click="showLeaseTerms = !showLeaseTerms"></span>
            <div class="right-btn">
              <span @click="rentIncrements = true"
                    v-if="!rentIncrements">+租金递增</span>
              <span @click="rentConcessions = true"
                    v-if="!rentConcessions">+租金优惠</span>
              <!-- <span @click="decorationBond = true"
                        v-if="!decorationBond">+装修保证金</span> -->
            </div>
          </div>
          <div class="selected-housing"
               v-if="showLeaseTerms">
            <el-form-item :label-width="formLabelWidth"
                          style="margin-bottom: 20px;"
                          prop="startDate">
              <div class="cttitle">开始时间<i class="required">*</i></div>
              <el-date-picker v-model="LeaseClauseData.startDate"
                              type="date"
                              :picker-options="contractStart"
                              value-format="yyyy-MM-dd"
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
                              :picker-options="contractEnd"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          style="margin-bottom: 20px;margin-right: 5px;"
                          prop="deposit">
              <div class="cttitle">租金保证金金额/元<i class="required">*</i></div>
              <el-input type="number"
                        v-model="LeaseClauseData.deposit"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item prop="price"
                          v-if="rentalMethod === 'RENT'">
              <div class="cttitle">初始单价<i class="required">*</i></div>
              <el-input v-model="LeaseClauseData.price"
                        type="number"
                        style="width: 48%;margin-right: 10px"
                        placeholder="请输入内容"></el-input>
              <el-select v-model="LeaseClauseData.priceUnit"
                         @change="priceUnitChange"
                         style="width: 45%;"
                         placeholder="请选择">
                <el-option label="元/㎡天"
                           value="M2DAYS"></el-option>
                <!-- <el-option label="元/㎡月"
                           value="M2MONTH"
                           disabled></el-option>
                <el-option label="元/天"
                           value="DAY"
                           disabled></el-option> -->
                <el-option label="元/月"
                           value="MONTH"></el-option>
                <el-option label="元/年"
                           value="YEAR"></el-option>
              </el-select>
            </el-form-item>
            <!-- v-if="rentalMethod !== 'POINTS' && LeaseClauseData.priceUnit !== 'YEAR'" -->
            <el-form-item :label-width="formLabelWidth"
                          style="margin-bottom: 20px;"
                          v-if="rentalMethod !== 'POINTS'"
                          prop="billingType">
              <div class="cttitle">计费类型<i class="required">*</i></div>
              <el-select v-model="LeaseClauseData.billingType"
                         placeholder="请选择">
                <el-option v-for="item in billingTypeOptions"
                           :key="item.value"
                           :label="item.name"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- v-if="LeaseClauseData.billingType === 'MONTH' && rentalMethod !== 'POINTS' && LeaseClauseData.priceUnit !== 'YEAR'" -->
            <el-form-item :label-width="formLabelWidth"
                          prop="yearDay"
                          v-if="rentalMethod !== 'POINTS'"
                          style="margin-bottom: 20px;">
              <div class="cttitle">年天数<i class="required">*</i></div>
              <!-- <el-input v-model="LeaseClauseData.yearDay"
                        type="number"
                        placeholder="请输入内容"></el-input> -->
              <el-select v-model="LeaseClauseData.yearDay"
                         placeholder="请选择">
                <el-option label="365"
                           value="365">
                </el-option>
                <el-option label="360"
                           value="360">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          style="margin-bottom: 20px;"
                          prop="month">
              <!-- <div v-if="LeaseClauseData.priceUnit === 'YEAR'"
                   class="cttitle">付款周期/年<i class="required">*</i></div> -->
              <div class="cttitle">付款周期/月<i class="required">*</i></div>
              <!-- <el-select v-model="LeaseClauseData.month"
                             placeholder="请选择">
                    <el-option v-for="item in paymentCycleOptions"
                               :key="item.value"
                               :label="item.value"
                               :value="item.value">
                    </el-option>
                  </el-select> -->
              <el-input v-model="LeaseClauseData.month"
                        placeholder="请输入内容" @input="monthChange(LeaseClauseData.month)"></el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          prop="billDivision"
                          style="margin-bottom: 20px;">
              <div class="cttitle">账单划分方式</div>
              <el-select v-model="LeaseClauseData.billDivision"
                         placeholder="请选择">
                <el-option label="首期开始，按付款周期划分"
                           value="NO"></el-option>
                <el-option label="首期三个月，第三笔开始按季度划分"
                           value="QUARTER" :disabled="billDivisionDisabledL"></el-option>
                <el-option label="第二笔开始，按季度划分"
                           value="QUARTER_TWO" :disabled="billDivisionDisabledL"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="rentalMethod !== 'RENT'"
                          :label-width="formLabelWidth"
                          style="margin-bottom: 20px;"
                          prop="point">
              <div class="cttitle">租金抽成比例(按营业额抽成)<i class="required">*</i></div>
              <el-input v-model="LeaseClauseData.point"
                        style="width: 83%!important"
                        type="number"
                        placeholder="请输入内容"></el-input>
              <span>%/月</span>
            </el-form-item>
            <el-form-item prop="price"
                          v-if="rentalMethod === 'GUARANTEEPOINT'">
              <div class="cttitle">保底价<i class="required">*</i></div>
              <el-input v-model="LeaseClauseData.price"
                        style="width: 48%;margin-right: 10px"
                        placeholder="请输入内容"></el-input>
              <el-select v-model="LeaseClauseData.priceUnit"
                         @change="priceUnitChange"
                         style="width: 45%;"
                         placeholder="请选择">
                <el-option label="元/㎡天"
                           value="M2DAYS"></el-option>
                <!-- <el-option label="元/㎡月"
                           value="M2MONTH"
                           disabled></el-option>
                <el-option label="元/天"
                           value="DAY"
                           disabled></el-option> -->
                <el-option label="元/月"
                           value="MONTH"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="rentalMethod !== 'RENT'"
                          :label-width="formLabelWidth"
                          style="margin-bottom: 20px"
                          prop="dayNumber">
              <div class="cttitle">账单应收日期，次月<i class="required">*</i></div>
              <el-input v-model="LeaseClauseData.dayNumber"
                        style="width: 76%!important"
                        type="number"
                        min="1"
                        max="31"
                        placeholder="请输入内容"></el-input>
              <span>日</span>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          style="margin-bottom: 20px;">
              <div class="cttitle">首个免租期是否包含在租金账单内<i class="required">*</i></div>
              <el-select v-model="LeaseClauseData.onBillContainFirstOfferReocrd"
                         placeholder="请选择">
                <el-option v-for="item in offerReocrdOptions"
                           :key="item.value"
                           :label="item.name"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="rentalMethod === 'RENT'"
                          :label-width="formLabelWidth"
                          style="margin-bottom: 20px;"
                          prop="dayNumber">
              <div class="cttitle">账单应收日期<i class="required">*</i></div>
              <!-- <div class="cttitle">提前付款时间<i class="required">*</i></div>
                  <el-input v-model="LeaseClauseData.dayNumber" style="width: 76%!important"
                            type="number"
                            placeholder="请输入内容"></el-input> -->
              <el-select v-model="LeaseClauseData.dayType"
                         style="width: 48%;margin-right: 10px"
                         placeholder="请选择">
                <el-option label="固定日期"
                           value="FIXED"></el-option>
                <el-option label="提前天数"
                           value="TOP"></el-option>
              </el-select>
              <el-input v-model="LeaseClauseData.dayNumber"
                        type="number"
                        style="width: 45%;"
                        placeholder="请输入内容"></el-input>
              <!-- <span>自然日</span> -->
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          style="margin-bottom: 20px;margin-right: 5px;width: 30%!important;">
              <div class="cttitle">滞纳金比例</div>
              <el-input type="number"
                        style="width: 82%!important;"
                        v-model="LeaseClauseData.lateFeeRate"
                        placeholder="请输入内容"></el-input> %/天
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="dc-right float-right"
           v-if="rentIncrements">
        <div class="dr-head">
          租金递增
          <span class="iconfont icon-bottom"
                :class="{'icon-top': !showRentIncrements}"
                @click="showRentIncrements = !showRentIncrements"></span>
          <span class="iconfont icon-add"
                @click="rentIncrementsAdd"></span>
          <span class="iconfont icon-reduce"
                @click="rentIncrementsReduce"
                v-if="LeaseClauseData.incrementRates.length > 1"></span>
          <div class="right-btn">
            <i class="iconfont icon-cha"
               @click="rentIncrementsDel"></i>
          </div>
        </div>
        <div class="selected-housing"
             v-for="(item, index) in LeaseClauseData.incrementRates"
             :key="index"
             v-if="showRentIncrements">
          <el-form-item :label-width="formLabelWidth"
                        style="margin-bottom: 20px;">
            <div class="cttitle">递增开始时间</div>
            <el-date-picker v-model="item.startDate"
                            type="date"
                            @change="changeEnd(index)"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth"
                        style="margin-bottom: 20px;">
            <div class="cttitle">递增结束时间</div>
            <el-date-picker v-model="item.endDate"
                            type="date"
                            @change="changeStart(index)"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth"
                        v-if="rentalMethod === 'RENT'"
                        style="margin-bottom: 20px;margin-right: 5px;">
            <div class="cttitle">租金单价递增</div>
            <el-input v-model="item.number"
                      type="number"
                      style="width: 55%"
                      placeholder="请输入内容"></el-input>
            <el-select v-model="item.incrementUnit"
                       style="width: 35%;"
                       placeholder="请选择">
              <el-option label="%"
                         value="P"></el-option>
              <el-option label="元"
                         value="Y"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="rentalMethod !== 'RENT'"
                        :label-width="formLabelWidth"
                        style="margin-bottom: 20px;"
                        prop="point">
            <div class="cttitle">租金抽成比例(按营业额抽成)<i class="required">*</i></div>
            <el-input v-model="item.point"
                      style="width: 83%!important"
                      type="number"
                      placeholder="请输入内容"></el-input>
            <span>%/月</span>
          </el-form-item>
          <!-- v-if="rentalMethod === 'GUARANTEEPOINT'" -->
          <el-form-item v-if="rentalMethod === 'GUARANTEEPOINT'">
            <div class="cttitle">保底价<i class="required">*</i></div>
            <el-input v-model="item.number"
                      style="width: 55%;margin-right: 10px"
                      placeholder="请输入内容"></el-input>
            <el-select v-model="item.priceUnit"
                       style="width: 35%;"
                       placeholder="请选择">
              <el-option label="元/㎡天"
                         value="M2DAYS"></el-option>
              <!-- <el-option label="元/㎡月"
                         value="M2MONTH"
                         disabled></el-option>
              <el-option label="元/天"
                         value="DAY"
                         disabled></el-option> -->
              <el-option label="元/月"
                         value="MONTH"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
      <div class="dc-right float-right"
           v-if="rentConcessions">
        <div class="dr-head">
          租金优惠
          <span class="iconfont icon-bottom"
                :class="{'icon-top': !showRentConcessions}"
                @click="showRentConcessions = !showRentConcessions"></span>
          <span class="iconfont icon-add"
                @click="rentConcessionsAdd"></span>
          <span class="iconfont icon-reduce"
                @click="rentConcessionsReduce"
                v-if="LeaseClauseData.offerRecords.length > 1"></span>
          <div class="right-btn">
            <i class="iconfont icon-cha"
               @click="rentConcessionsDel"></i>
          </div>
        </div>
        <div class="selected-housing"
             v-for="(item, index) in LeaseClauseData.offerRecords"
             :key="index"
             v-if="showRentConcessions">
          <el-form-item :label-width="formLabelWidth"
                        style="margin-bottom: 20px;margin-right: 5px;">
            <div class="cttitle">优惠类型</div>
            <el-select v-model="item.offerType"
                       placeholder="请选择">
              <el-option label="免租期"
                         value="RENT"></el-option>
              <el-option label="装修期"
                         value="DECORATION"></el-option>
              <el-option label="物业免租期"
                         value="PROPERTY"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth"
                        style="margin-bottom: 20px;">
            <div class="cttitle">优惠开始时间</div>
            <el-date-picker v-model="item.yhStartDate"
                            type="date"
                            @change="yhChangeEnd(index)"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth"
                        style="margin-bottom: 20px;">
            <div class="cttitle">优惠结束时间</div>
            <el-date-picker v-model="item.yhEndDate"
                            type="date"
                            @change="yhChangeStart(index)"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div>
      </div>
      <!-- <div class="dc-right float-right"
               v-if="decorationBond">
            <div class="dr-head">
              装修保证金
              <span class="iconfont icon-bottom"
                    :class="{'icon-top': !showRentBond}"
                    @click="showRentBond = !showRentBond"></span>
              <div class="right-btn">
                <i class="iconfont icon-cha"
                   @click="decorationBondDel();decorationBond = false"></i>
              </div>
            </div>
            <div class="selected-housing"
                 v-if="showRentBond">
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;">
                <div class="cttitle">开始时间</div>
                <el-date-picker v-model="addData.zxStartDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;">
                <div class="cttitle">结束时间</div>
                <el-date-picker v-model="addData.zxEndtDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;margin-right: 5px;">
                <div class="cttitle">装修保证金金额</div>
                <el-input v-model="addData.zxDeposit"
                          type="number"
                          style="width: 86%;margin-right: 11px;"
                          placeholder="请输入内容"></el-input>元
              </el-form-item>
            </div>
          </div> -->
    </el-form>
  </div>
</template>
<script>
import context from '@/service'
export default {
  name: 'addRentRules',
  props: {
    rentalMethod: {
      type: String
    },
    LeaseClauseDataes: {
      type: Object
    },
    contractId: {
      type: Number
    }
  },
  watch: {
    'LeaseClauseData.dayNumber': {
      handler: function (newName, oldName) {
        if (this.LeaseClauseData.dayType === 'TOP') return
        var reg = /^([1-9]|1[0-9]|2[0-8])$/
        if (!reg.test(newName)) {
          this.LeaseClauseData.dayNumber = ''
        } else {
          this.LeaseClauseData.dayNumber = newName
        }
      }
    }
    //  LeaseClauseDataes: {
    //    handler: function (newVal, oldVal) {
    //      if (newVal && newVal.rentClauses[0]) {
    //        this.LeaseClauseData.endDate = newVal.rentClauses[0].endDate
    //      }
    //    },
    //    immediate: true,
    //    deep: true
    //  }
  },
  created () {
    this.initLeaseClauseData()
  },
  data () {
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
    var validateMonth = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请输入付款周期'))
      } else if (!(/(^[1-9]\d*$)/.test(value))) {
        callback(new Error('只能输入数字'))
      } else {
        callback()
      }
    }
    return {
      contractEnd: {
        disabledDate: time => {
          if (this.LeaseClauseData.startDate) {
            return time.getTime() < new Date(this.LeaseClauseData.startDate).getTime()
          } else {
            return
          }
        }
      },
      contractStart: {
        disabledDate: time => {
          if (this.LeaseClauseData.endDate) {
            return time.getTime() > new Date(this.LeaseClauseData.endDate).getTime()
          } else {
            return
          }
        }
      },
      showLeaseTerms: true,
      rentIncrements: false,
      rentConcessions: false,
      decorationBond: false,
      showRentIncrements: true,
      showRentConcessions: true,
      showRentBond: true,
      formLabelWidth: '',
      addData: {},
      offerReocrdOptions: [
        { name: '不包括', value: false },
        { name: '包括', value: true }
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
      ],
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
      LeaseClauseData: {
        onBillContainFirstOfferReocrd: false,
        billDivision: 'NO',
        billingType: 'MONTH',
        priceUnit: 'M2DAYS',
        termType: 'RENT',
        offerRecords: [{
          termType: 'RENT',
          'yhStartDate': '',
          'yhEndDate': '',
          'offerType': ''
        }],
        incrementRates: [{
          termType: 'RENT',
          'startDate': '',
          'endDate': '',
          'number': '',
          'incrementUnit': 'P',
          'priceUnit': 'M2DAYS'
        }],
        dayType: 'TOP'
      },
      LeaseClauseRules: {
        startDate: [{
          required: true,
          message: '请选择开始时间',
          trigger: 'change'
        }],
        endDate: [{
          required: false,
          message: '请选择结束时间',
          trigger: 'change'
        }],
        deposit: [{
          required: true,
          message: '请输入租金保证金金额',
          trigger: 'blur'
        }],
        price: [{
          required: true,
          message: '请输入价格',
          trigger: 'blur'
        }],
        month: [{
          validator: validateMonth,
          trigger: 'change'
        }],
        dayNumber: [{
          required: true,
          message: '请输入账单应收日期',
          trigger: 'blur'
        }],
        billDivision: [{
          required: true,
          message: '请选择账单划分方式',
          trigger: 'change'
        }],
        billingType: [{
          required: true,
          message: '请选择计费类型',
          trigger: 'change'
        }],
        yearDay: [{
          validator: validateYearDay,
          trigger: 'blur'
        }],
        point: [{
          required: true,
          message: '请输入租金抽成比例',
          trigger: 'blur'
        }]
      },
      billDivisionDisabledL: true
    }
  },
  methods: {
    initLeaseClauseData () {
      this.$nextTick(() => {
        this.$set(this.LeaseClauseData, 'onBillContainFirstOfferReocrd', false)
        this.$set(this.LeaseClauseData, 'billDivision', 'NO')
        this.$set(this.LeaseClauseData, 'priceUnit', 'M2DAYS')
        this.$set(this.LeaseClauseData, 'termType', 'RENT')
        this.$set(this.LeaseClauseData, 'dayType', 'TOP')
        this.$set(this.LeaseClauseData, 'billingType', 'MONTH')
        this.LeaseClauseData.endDate = this.LeaseClauseDataes.rentClauses[0].endDate
        // this.LeaseClauseData.onBillContainFirstOfferReocrd = false
        console.log(this.LeaseClauseData)
      })
    },
    priceUnitChange () {
      for (var i = 0; i < this.LeaseClauseData.incrementRates.length; i++) {
        this.LeaseClauseData.incrementRates[i].priceUnit = this.LeaseClauseData.priceUnit
      }
    },
    rentIncrementsAdd () {
      // this.addData.rentClauses[0].incrementRates.push({'startDate': '', 'endDate': '', 'number': '', 'incrementUnit': ''})
      this.LeaseClauseData.incrementRates.push({
        termType: 'RENT',
        'startDate': '',
        'endDate': '',
        'number': '',
        'incrementUnit': 'P',
        'priceUnit': this.LeaseClauseData.incrementRates.length ? this.LeaseClauseData.incrementRates[0].priceUnit : 'M2DAYS'
      })
    },
    rentIncrementsDel () {
      this.rentIncrements = false
      this.LeaseClauseData.incrementRates = [{
        termType: 'RENT',
        'startDate': '',
        'endDate': '',
        'number': '',
        'incrementUnit': 'P'
      }]
    },
    rentIncrementsReduce () {
      this.LeaseClauseData.incrementRates.pop()
    },
    rentConcessionsAdd () {
      this.LeaseClauseData.offerRecords.push({
        termType: 'RENT',
        'yhStartDate': '',
        'yhEndDate': '',
        'offerType': ''
      })
    },
    rentConcessionsDel () {
      this.rentConcessions = false
      this.LeaseClauseData.offerRecords = [{
        termType: 'RENT',
        'yhStartDate': '',
        'yhEndDate': '',
        'offerType': ''
      }]
    },
    rentConcessionsReduce () {
      this.LeaseClauseData.offerRecords.pop()
    },
    decorationBondDel () {
      this.addData.zxStartDate = ''
      this.addData.zxEndtDate = ''
      this.addData.zxDeposit = ''
    },
    changeEnd (index) {
      if (index > 0) {
        if (this.LeaseClauseData.incrementRates[index].startDate < this.LeaseClauseData.incrementRates[index - 1].endDate) {
          this.$message.error('开始时间不能大于上个阶段开结束时间')
          this.LeaseClauseData.incrementRates[index].startDate = ''
        }
      }
      if (this.LeaseClauseData.incrementRates[index].startDate < this.LeaseClauseData.startDate || this.LeaseClauseData.incrementRates[index].startDate > this.LeaseClauseData.endDate) {
        this.$message.error('时间必须在合同时间范围内')
        this.LeaseClauseData.incrementRates[index].startDate = ''
      }
    },
    changeStart (index) {
      if (this.LeaseClauseData.incrementRates[index].endDate < this.LeaseClauseData.incrementRates[index].startDate) {
        this.$message.error('结束时间不能小于开始时间')
        this.LeaseClauseData.incrementRates[index].endDate = ''
      }
      if (this.LeaseClauseData.incrementRates[index].endDate > this.LeaseClauseData.endDate || this.LeaseClauseData.incrementRates[index].endDate < this.LeaseClauseData.startDate) {
        this.$message.error('时间必须在合同时间范围内')
        this.LeaseClauseData.incrementRates[index].endDate = ''
      }
    },
    yhChangeEnd (index) {
      if (index > 0) {
        if (this.LeaseClauseData.offerRecords[index].yhStartDate < this.LeaseClauseData.offerRecords[index - 1].yhEndDate) {
          this.$message.error('开始时间不能大于上个阶段开结束时间')
          this.LeaseClauseData.offerRecords[index].yhStartDate = ''
        }
      }
      if (this.LeaseClauseData.offerRecords[index].yhStartDate < this.LeaseClauseData.startDate || this.LeaseClauseData.offerRecords[index].yhStartDate > this.LeaseClauseData.endDate) {
        this.$message.error('时间必须在合同时间范围内')
        this.LeaseClauseData.offerRecords[index].yhStartDate = ''
      }
    },
    yhChangeStart (index) {
      if (this.LeaseClauseData.offerRecords[index].yhEndDate < this.LeaseClauseData.offerRecords[index].yhStartDate) {
        this.$message.error('结束时间不能小于开始时间')
        this.LeaseClauseData.offerRecords[index].yhEndDate = ''
      }
      if (this.LeaseClauseData.offerRecords[index].yhEndDate > this.LeaseClauseData.endDate || this.LeaseClauseData.offerRecords[index].yhEndDate < this.LeaseClauseData.startDate) {
        this.$message.error('时间必须在合同时间范围内')
        this.LeaseClauseData.offerRecords[index].yhEndDate = ''
      }
    },
    icVerification () {
      let result = true
      if (this.LeaseClauseData.incrementRates.length > 0 && this.rentIncrements) {
        let incrementRates1 = this.LeaseClauseData.incrementRates
        let incrementRatesLength = this.LeaseClauseData.incrementRates.length
        for (let i = 0; i < incrementRatesLength; i++) {
          if (!incrementRates1[i].startDate || !incrementRates1[i].endDate || (this.addData.rentalMethod === 'RENT' && (
            incrementRates1[i].number === '' || incrementRates1[i].numbe === null)) ||
            (this.addData.rentalMethod === 'POINTS' && (incrementRates1[i].point === '' || incrementRates1[i].point === null)) ||
            (this.addData.rentalMethod === 'GUARANTEEPOINT' && (incrementRates1[i].number === '' || incrementRates1[i].number ===
              null))) {
            this.$message.error('递增信息请输入完整')
            result = false
          }
        }
      } else {
        this.LeaseClauseData.incrementRates = []
      }
      if (this.LeaseClauseData.offerRecords.length > 0 && this.rentConcessions) {
        let incrementRates3 = this.LeaseClauseData.offerRecords
        let incrementRatesLength = this.LeaseClauseData.offerRecords.length
        for (let i = 0; i < incrementRatesLength; i++) {
          if (!incrementRates3[i].offerType || !incrementRates3[i].yhStartDate || !incrementRates3[i].yhEndDate) {
            this.$message.error('递增信息请输入完整')
            result = false
          }
        }
      } else {
        this.LeaseClauseData.offerRecords = []
      }
      return result
    },
    closeRules () {
      this.LeaseClauseData = {
        onBillContainFirstOfferReocrd: false,
        billDivision: 'NO',
        endDate: this.LeaseClauseDataes.rentClauses[0].endDate,
        priceUnit: 'M2DAYS',
        termType: 'RENT',
        offerRecords: [{
          termType: 'RENT',
          'yhStartDate': '',
          'yhEndDate': '',
          'offerType': ''
        }],
        incrementRates: [{
          priceUnit: 'M2DAYS',
          termType: 'RENT',
          'startDate': '',
          'endDate': '',
          'number': '',
          'incrementUnit': 'P'
        }],
        dayType: 'TOP'
      }
    },
    saveRules () {
      this.LeaseClauseData.contractId = this.contractId
      delete this.LeaseClauseData.id
      this.$refs['LeaseClauseForm'].validate((valid) => {
        if (valid) {
          if (!this.icVerification()) {
            return
          }
          let _this = this
          context.http.post('/cms/api/rent-clauses', this.LeaseClauseData).then(res => {
            if (res.status === 201) {
              _this.$emit('closeDialog', false)
              _this.$emit('resetData', false)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    monthChange (month) {
      if (month === 3 || month === '3') {
        this.billDivisionDisabledL = false
      } else {
        this.LeaseClauseData.billDivision = 'NO'
        this.billDivisionDisabledL = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.add-rent-rules {
  .el-select{
    width: 100%;
  }
  .el-form-item {
    display: inline-block;
    width: 30% !important;
    margin-left: 16px;
    &:nth-of-type(3n) {
      // margin-right: 10px !important;
    }
  }
  .dc-right {
    width: 100% !important;
    border: 1px solid #e7e7e7;
    margin-bottom: 20px;
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

    > span {
      display: inline-block;
      width: 19%;
      padding-left: 40px;
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
  .dr-head {
    background-color: #fafafa;
    height: 40px;
    line-height: 40px;
    padding-left: 12px;
    font-size: 14px;
    margin-bottom: 24px;
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
}
</style>
