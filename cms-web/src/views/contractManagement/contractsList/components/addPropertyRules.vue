<template>
  <div class="add-pro-rules">
    <el-form>
      <el-form ref="propertyClauseForm"
               :model="propertyClauseData"
               :rules="propertyClauseRules"
               label-width="80px">
        <div class="dc-right float-right"
             style="margin-top: 20px">
          <div class="dr-head">物业条款
            <span class="iconfont icon-bottom"
                  :class="{'icon-top': !showPropertyClause}"
                  @click="showPropertyClause = !showPropertyClause"></span>
            <div class="right-btn">
              <span @click="increasingProperty = true"
                    v-if="!increasingProperty">+物业费递增</span>
              <span @click="propertyFee = true"
                    v-if="!propertyFee">+物业费优惠</span>
            </div>
          </div>
          <div class="selected-housing"
               v-if="showPropertyClause">
            <el-form-item :label-width="formLabelWidth"
                          style="margin-bottom: 20px;"
                          prop="startDate">
              <div class="cttitle">开始时间<i class="required">*</i></div>
              <el-date-picker v-model="propertyClauseData.startDate"
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
              <el-date-picker v-model="propertyClauseData.endDate"
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
              <div class="cttitle">物业费保证金金额/元<i class="required">*</i></div>
              <el-input v-model="propertyClauseData.deposit"
                        type="number"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item prop="price">
              <div class="cttitle">物业费单价<i class="required">*</i></div>
              <el-input v-model="propertyClauseData.price"
                        type="number"
                        style="width: 48%;margin-right: 10px"
                        placeholder="请输入内容"></el-input>
              <el-select v-model="propertyClauseData.priceUnit"
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
            <el-form-item :label-width="formLabelWidth"
                          style="margin-bottom: 20px;"
                          prop="month">
              <!-- <div v-if="propertyClauseData.priceUnit === 'YEAR'"
                   class="cttitle">付款周期/年<i class="required">*</i></div> -->
              <div class="cttitle">付款周期/月<i class="required">*</i></div>
              <el-input v-model="propertyClauseData.month"
                        placeholder="请输入内容" @input="monthChange(propertyClauseData.month)"></el-input>
              <!-- <el-select v-model="propertyClauseData.month"
                          placeholder="请选择">
                <el-option v-for="item in paymentCycleOptions"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value">
                </el-option>
              </el-select> -->
            </el-form-item>

            <el-form-item :label-width="formLabelWidth"
                          prop="billDivision"
                          style="margin-bottom: 20px;">
              <div class="cttitle">账单划分方式<i class="required">*</i></div>
              <el-select v-model="propertyClauseData.billDivision"
                         placeholder="请选择">
                <el-option label="首期开始，按付款周期划分"
                           value="NO"></el-option>
                <el-option label="首期三个月，第三笔开始按季度划分"
                           value="QUARTER" :disabled="billDivisionDisabledL"></el-option>
                <el-option label="第二笔开始，按季度划分"
                           value="QUARTER_TWO" :disabled="billDivisionDisabledL"></el-option>
              </el-select>
            </el-form-item>

            <!-- v-if="propertyClauseData.priceUnit !== 'YEAR'" -->
            <el-form-item :label-width="formLabelWidth"
                          style="margin-bottom: 20px;"
                          prop="billingType">
              <div class="cttitle">计费类型<i class="required">*</i></div>
              <el-select v-model="propertyClauseData.billingType"
                         placeholder="请选择">
                <el-option v-for="item in billingTypeOptions"
                           :key="item.value"
                           :label="item.name"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- v-if="propertyClauseData.billingType === 'MONTH' && propertyClauseData.priceUnit !== 'YEAR'" -->
            <el-form-item :label-width="formLabelWidth"
                          prop="yearDay"
                          style="margin-bottom: 20px;">
              <div class="cttitle">年天数<i class="required">*</i></div>
              <!-- <el-input v-model="propertyClauseData.yearDay"
                        type="number"
                        placeholder="请输入内容"></el-input> -->
              <el-select v-model="propertyClauseData.yearDay"
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
                          prop="dayNumber">
              <div class="cttitle">账单应收日期<i class="required">*</i></div>
              <!-- <el-input v-model="propertyClauseData.dayNumber" type="number"
                        placeholder="请输入内容"></el-input> -->
              <el-select v-model="propertyClauseData.dayType"
                         style="width: 47%;margin-right: 10px"
                         placeholder="请选择">
                <el-option label="固定日期"
                           value="FIXED"></el-option>
                <el-option label="提前天数"
                           value="TOP"></el-option>
              </el-select>
              <el-input v-model="propertyClauseData.dayNumber"
                        type="number"
                        style="width: 46%;"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          style="margin-bottom: 20px;margin-right: 5px;width: 30%!important;">
              <div class="cttitle">滞纳金比例</div>
              <el-input type="number"
                        style="width: 82%!important;"
                        v-model="propertyClauseData.lateFeeRate"
                        placeholder="请输入内容"></el-input> %/天
            </el-form-item>
            <el-form-item v-if="LeaseClauseData.onBillContainFirstOfferReocrd === false && LeaseClauseData.month === propertyClauseData.month"
                          :label-width="formLabelWidth"
                          style="margin-bottom: 20px;">
              <div class="cttitle">物业费的账单日期是否同步租金账单<i class="required">*</i></div>
              <el-select v-model="propertyClauseData.onRentBill"
                         placeholder="请选择">
                <el-option v-for="item in onRentBillOptions"
                           :key="item.value"
                           :label="item.name"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="dc-right float-right"
           v-if="increasingProperty">
        <div class="dr-head">
          物业费递增
          <span class="iconfont icon-bottom"
                :class="{'icon-top': !showProperty}"
                @click="showProperty = !showProperty"></span>
          <span class="iconfont icon-add"
                @click="propertyFeeAdd"></span>
          <span class="iconfont icon-reduce"
                @click="propertyFeeReduce"
                v-if="propertyClauseData.incrementRates.length > 1"></span>
          <div class="right-btn">
            <i class="iconfont icon-cha"
               @click="propertyFeeDel"></i>
          </div>
        </div>
        <div class="selected-housing"
             v-for="(item, index) in propertyClauseData.incrementRates"
             :key="index"
             v-if="showProperty">
          <el-form-item :label-width="formLabelWidth"
                        style="margin-bottom: 20px;"
                        prop="startDate">
            <div class="cttitle">递增开始时间</div>
            <el-date-picker v-model="item.startDate"
                            type="date"
                            @change="wyChangeEnd(index)"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth"
                        style="margin-bottom: 20px;"
                        prop="endDate">
            <div class="cttitle">递增结束时间</div>
            <el-date-picker v-model="item.endDate"
                            type="date"
                            @change="wyChangeStart(index)"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth"
                        style="margin-bottom: 20px;margin-right: 5px;"
                        prop="RentalMethod">
            <div class="cttitle">物业费单价递增</div>
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
        </div>
      </div>
      <div class="dc-right float-right"
           v-if="propertyFee">
        <div class="dr-head">
          物业费优惠
          <span class="iconfont icon-bottom"
                :class="{'icon-top': !showPropertyDiscount}"
                @click="showPropertyDiscount = !showPropertyDiscount"></span>
          <span class="iconfont icon-add"
                @click="preferentialPropertyAdd"></span>
          <span class="iconfont icon-reduce"
                @click="preferentialPropertyReduce"
                v-if="propertyClauseData.offerRecords.length > 1"></span>
          <div class="right-btn">
            <i class="iconfont icon-cha"
               @click="preferentialPropertyDel"></i>
          </div>
        </div>
        <div class="selected-housing"
             v-for="(item, index) in propertyClauseData.offerRecords"
             :key="index"
             v-if="showPropertyDiscount">
          <el-form-item :label-width="formLabelWidth"
                        style="margin-bottom: 20px;"
                        prop="RentalMethod">
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
                        style="margin-bottom: 20px;"
                        prop="RentalMethod">
            <div class="cttitle">优惠开始时间</div>
            <el-date-picker v-model="item.yhStartDate"
                            type="date"
                            @change="wyyhChangeEnd(index)"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth"
                        style="margin-bottom: 20px;margin-right: 5px;"
                        prop="RentalMethod">
            <div class="cttitle">优惠结束时间</div>
            <el-date-picker v-model="item.yhEndDate"
                            type="date"
                            @change="wyyhChangeStart(index)"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import context from '@/service'
import { deepStrictEqual } from 'assert'
export default {
  name: 'addPropertyRules',
  props: {
    contractId: {
      type: Number
    },
    propertyClauseDataes: {
      type: Object
    }
  },
  watch: {
    'propertyClauseData.dayNumber': {
      handler: function (newName, oldName) {
        if (this.propertyClauseData.dayType === 'TOP') return
        var reg = /^([1-9]|1[0-9]|2[0-8])$/
        if (!reg.test(newName)) {
          this.propertyClauseData.dayNumber = ''
        } else {
          this.propertyClauseData.dayNumber = newName
        }
      }
    }
    //  propertyClauseDataes: {
    //    handler: function (newVal, oldVal) {
    //      if (newVal && newVal.rentClauses[0]) {
    //        this.propertyClauseData.endDate = newVal.rentClauses[0].endDate
    //      }
    //    },
    //    immediate: true,
    //    deep: true
    //  }
  },
  created () {
    this.initPropertyClauseData()
  },
  data () {
    var validateYearDay2 = (rule, value, callback) => {
      if (this.propertyClauseData.billingType === 'MONTH') {
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
          if (this.propertyClauseData.startDate) {
            return time.getTime() < new Date(this.propertyClauseData.startDate).getTime()
          } else {
            return
          }
        }
      },
      contractStart: {
        disabledDate: time => {
          if (this.propertyClauseData.endDate) {
            return time.getTime() > new Date(this.propertyClauseData.endDate).getTime()
          } else {
            return
          }
        }
      },
      showPropertyClause: true,
      increasingProperty: false,
      propertyFee: false,
      showProperty: true,
      showPropertyDiscount: true,
      formLabelWidth: '',
      propertyClauseRules: {
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
          message: '请输入物业费保证金金额',
          trigger: 'blur'
        }],
        price: [{
          required: true,
          message: '请输入物业费单价',
          trigger: 'blur'
        }],
        month: [{
          validator: validateMonth,
          trigger: 'change'
        }],
        billDivision: [{
          required: true,
          message: '请选择账单划分方式',
          trigger: 'change'
        }],
        dayNumber: [{
          required: true,
          message: '请输入应收日期',
          trigger: 'blur'
        }],
        billingType: [{
          required: true,
          message: '请选择计费类型',
          trigger: 'change'
        }],
        yearDay: [{
          validator: validateYearDay2,
          trigger: 'blur'
        }]
      },
      propertyClauseData: {
        priceUnit: 'M2DAYS',
        termType: 'PROPERTY',
        onRentBill: true,
        billDivision: 'NO',
        offerRecords: [{
          termType: 'PROPERTY',
          'yhStartDate': '',
          'yhEndDate': '',
          'offerType': ''
        }],
        incrementRates: [{
          termType: 'PROPERTY',
          'startDate': '',
          'endDate': '',
          'number': '',
          'incrementUnit': 'P'
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
      LeaseClauseData: {
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
          'incrementUnit': 'P'
        }]
      },
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
      billDivisionDisabledL: true
    }
  },
  methods: {
    initPropertyClauseData () {
      this.$nextTick(function () {
        this.propertyClauseData.endDate = this.propertyClauseDataes.rentClauses[0].endDate
      })
    },
    propertyFeeAdd () {
      this.propertyClauseData.incrementRates.push({
        termType: 'PROPERTY',
        'startDate': '',
        'endDate': '',
        'number': '',
        'incrementUnit': 'P'
      })
    },
    propertyFeeReduce () {
      this.propertyClauseData.incrementRates.pop()
    },
    propertyFeeDel () {
      this.increasingProperty = false
      this.propertyClauseData.incrementRates = [{
        termType: 'PROPERTY',
        'startDate': '',
        'endDate': '',
        'number': '',
        'incrementUnit': 'P'
      }]
    },
    preferentialPropertyAdd () {
      this.propertyClauseData.offerRecords.push({
        termType: 'PROPERTY',
        'yhStartDate': '',
        'yhEndDate': '',
        'offerType': ''
      })
    },
    preferentialPropertyReduce () {
      this.propertyClauseData.offerRecords.pop()
    },
    preferentialPropertyDel () {
      this.propertyFee = false
      this.propertyClauseData.offerRecords = [{
        termType: 'PROPERTY',
        'yhStartDate': '',
        'yhEndDate': '',
        'offerType': ''
      }]
    },
    wyChangeEnd (index) {
      if (index > 0) {
        if (this.propertyClauseData.incrementRates[index].startDate < this.propertyClauseData.incrementRates[index - 1].yhEndDate) {
          this.$message.error('开始时间不能大于上个阶段开结束时间')
          this.propertyClauseData.incrementRates[index].startDate = ''
        }
      }
      if (this.propertyClauseData.incrementRates[index].startDate < this.propertyClauseData.startDate || this.propertyClauseData.incrementRates[index].startDate > this.propertyClauseData.endDate) {
        this.$message.error('时间必须在合同时间范围内')
        this.propertyClauseData.incrementRates[index].startDate = ''
      }
    },
    wyChangeStart (index) {
      if (this.propertyClauseData.incrementRates[index].endDate < this.propertyClauseData.incrementRates[index].startDate) {
        this.$message.error('结束时间不能小于开始时间')
        this.propertyClauseData.incrementRates[index].endDate = ''
      }
      if (this.propertyClauseData.incrementRates[index].endDate > this.propertyClauseData.endDate || this.propertyClauseData.incrementRates[index].endDate < this.propertyClauseData.startDate) {
        this.$message.error('时间必须在合同时间范围内')
        this.propertyClauseData.incrementRates[index].endDate = ''
      }
    },
    wyyhChangeEnd (index) {
      if (index > 0) {
        if (this.propertyClauseData.offerRecords[index].yhStartDate < this.propertyClauseData.offerRecords[index - 1].yhEndDate) {
          this.$message.error('开始时间不能大于上个阶段开结束时间')
          this.propertyClauseData.offerRecords[index].yhStartDate = ''
        }
      }
      if (this.propertyClauseData.offerRecords[index].yhStartDate < this.propertyClauseData.startDate || this.propertyClauseData.offerRecords[index].yhStartDate > this.propertyClauseData.endDate) {
        this.$message.error('时间必须在合同时间范围内')
        this.propertyClauseData.offerRecords[index].yhStartDate = ''
      }
    },
    wyyhChangeStart (index) {
      if (this.propertyClauseData.offerRecords[index].yhEndDate < this.propertyClauseData.offerRecords[index].yhStartDate) {
        this.$message.error('结束时间不能小于开始时间')
        this.propertyClauseData.offerRecords[index].yhEndDate = ''
      }
      if (this.propertyClauseData.offerRecords[index].yhEndDate > this.propertyClauseData.endDate || this.propertyClauseData.offerRecords[index].yhEndDate < this.propertyClauseData.startDate) {
        this.$message.error('时间必须在合同时间范围内')
        this.propertyClauseData.offerRecords[index].yhEndDate = ''
      }
    },
    icVerification () {
      let result = true
      if (this.propertyClauseData.incrementRates.length > 0 && this.increasingProperty) {
        let incrementRates2 = this.propertyClauseData.incrementRates
        let incrementRatesLength = this.propertyClauseData.incrementRates.length
        for (let i = 0; i < incrementRatesLength; i++) {
          if (!incrementRates2[i].startDate || !incrementRates2[i].endDate || incrementRates2[i].number === '' ||
            incrementRates2[i].number === null) {
            this.$message.error('递增信息请输入完整')
            result = false
          }
        }
      } else {
        this.propertyClauseData.incrementRates = []
      }
      if (this.propertyClauseData.offerRecords.length > 0 && this.propertyFee) {
        let incrementRates4 = this.propertyClauseData.offerRecords
        let incrementRatesLength = this.propertyClauseData.offerRecords.length
        for (let i = 0; i < incrementRatesLength; i++) {
          if (!incrementRates4[i].offerType || !incrementRates4[i].yhStartDate || !incrementRates4[i].yhEndDate) {
            this.$message.error('递增信息请输入完整')
            result = false
          }
        }
      } else {
        this.propertyClauseData.offerRecords = []
      }
      return result
    },
    closeRules () {
      this.propertyClauseData = {
        endDate: this.propertyClauseDataes.rentClauses[0].endDate,
        priceUnit: 'M2DAYS',
        termType: 'PROPERTY',
        onRentBill: true,
        billDivision: 'NO',
        offerRecords: [{
          termType: 'PROPERTY',
          'yhStartDate': '',
          'yhEndDate': '',
          'offerType': ''
        }],
        incrementRates: [{
          termType: 'PROPERTY',
          'startDate': '',
          'endDate': '',
          'number': '',
          'incrementUnit': 'P'
        }]
      }
    },
    saveRules () {
      this.propertyClauseData.contractId = this.contractId
      delete this.propertyClauseData.id
      this.$refs['propertyClauseForm'].validate((valid) => {
        if (valid) {
          if (!this.icVerification()) {
            return
          }
          let _this = this
          context.http.post('/cms/api/rent-clauses', this.propertyClauseData).then(res => {
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
        this.propertyClauseData.billDivision = 'NO'
        this.billDivisionDisabledL = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.add-pro-rules {
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

