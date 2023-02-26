<template>
  <div class="contractCalculator">
   <span class="page_head_title">合同金额计算器</span>
   <el-form :model="LeaseClauseData" :rules="addFlowRules" ref="LeaseClauseData">
    <div class="part1">
        <div>
          <span style="margin:10px 0">计租面积/m²</span>
          <el-form-item prop="area">
            <el-input placeholder="请输入面积" style="width:220px" v-model="LeaseClauseData.area" type="number"></el-input>
          </el-form-item>
        </div>
        <div>
          <span style="margin:10px 0">计算进位方式<i class="required">*</i></span>
          <el-form-item prop="carryModeRent">
            <el-select style="width:220px" v-model="LeaseClauseData.carryModeRent">
              <el-option label="四舍五入" value="ROUNDING" id="1"></el-option>
              <el-option label="无条件进位" value ="UNCONDITIONAL" id="2" ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
    <!-- 2 -->
    <div class="part2">
      <div class="header">
        <i class="classifi"></i>
        <span>租赁条款</span>
        <span class="btn fr" @click="rentConcessions = true" v-if="!rentConcessions">+ 租金优惠</span>
        <span class="btn fr" @click="rentIncrements = true" v-if="!rentIncrements">+ 租金递增</span>
      </div>
      <div class="form1">
        <el-form-item :label-width="formLabelWidth" style="margin-bottom: 20px;"  prop="startDate">
          <div class="cttitle">开始时间<i class="required">*</i></div>
          <el-date-picker v-model="LeaseClauseData.startDate" type="date" value-format="yyyy-MM-dd"  placeholder="选择日期" style="width:220px" :picker-options="contractStart"></el-date-picker>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" style="margin-bottom: 20px;" prop="endDate">
          <div class="cttitle">结束时间<i class="required">*</i></div>
          <el-date-picker v-model="LeaseClauseData.endDate"  type="date" value-format="yyyy-MM-dd"   placeholder="选择日期" style="width:220px" :picker-options="contractEnd"></el-date-picker>
        </el-form-item>
        <el-form-item prop="price">
          <div class="cttitle">初始单价<i class="required">*</i></div>
          <el-input v-model="LeaseClauseData.price" type="number"  style="width: 43%;margin-right: 10px"  placeholder="请输入内容"></el-input>
          <el-select v-model="LeaseClauseData.priceUnit" @change="priceUnitChange"  style="width: 27%;" placeholder="请选择">
            <el-option label="元/㎡天" value="M2DAYS"></el-option>
            <!-- <el-option label="元/㎡月"  value="M2MONTH" disabled></el-option>
            <el-option label="元/天" value="DAY" disabled></el-option> -->
            <el-option label="元/月" value="MONTH"></el-option>
            <el-option label="元/年" value="YEAR"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" style="margin-bottom: 20px;" prop="billingType">
          <div class="cttitle">计费类型<i class="required">*</i></div>
          <el-select v-model="LeaseClauseData.billingType" placeholder="请选择" style="width:220px">
            <el-option v-for="item in billingTypeOptions" :key="item.value" :label="item.name" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth"  prop="yearDay"  style="margin-bottom: 20px;">
          <div class="cttitle">年天数<i class="required">*</i></div>
          <el-select v-model="LeaseClauseData.yearDay" placeholder="请输入内容" style="width:220px">
            <el-option label="365" value="365"> </el-option>
            <el-option label="360" value="360"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" style="margin-bottom: 20px;"  prop="month">
          <div class="cttitle">付款周期/月<i class="required">*</i></div>
          <!-- <el-select v-model="LeaseClauseData.month" placeholder="请选择" style="width:220px">
            <el-option v-for="item in paymentCycleOptions"  :key="item.value" :label="item.value" :value="item.value">
            </el-option>
          </el-select> -->
          <el-input v-model="LeaseClauseData.month" placeholder="请输入内容" style="width:220px" @input="monthChange(LeaseClauseData.month)"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth"  style="margin-bottom: 20px;" prop="billDivision">
          <div class="cttitle">账单划分方式<i class="required">*</i></div>
          <el-select v-model="LeaseClauseData.billDivision" placeholder="请选择" style="width:275px">
            <el-option label="首期开始，按付款周期划分" value="NO"></el-option>
            <el-option label="首期三个月，第三笔开始按季度划分" value="QUARTER" :disabled="LeaseClauseData.month !== '3'"></el-option>
            <el-option label="第二笔开始，按季度划分" value="QUARTER_TWO" :disabled="LeaseClauseData.month !== '3'"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item :label-width="formLabelWidth"  style="margin-bottom: 20px;"  prop="dayNumber">
          <div class="cttitle">提前付款时间<i class="required">*</i></div>
          <el-input v-model="LeaseClauseData.dayNumber" style="width:180px" type="number" placeholder="请输入内容"></el-input><span>自然日</span>
        </el-form-item> -->
        <el-form-item :label-width="formLabelWidth" style="margin-bottom: 20px;" prop="onBillContainFirstOfferReocrd">
          <div class="cttitle">首个免租期是否包含在租金账单内<i class="required">*</i></div>
          <el-select v-model="LeaseClauseData.onBillContainFirstOfferReocrd" placeholder="请选择" style="width:220px">
            <el-option v-for="item in offerReocrdOptions" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="addData.rentalMethod === 'RENT'"
                      :label-width="formLabelWidth"
                      style="margin-bottom: 20px;"
                      prop="dayNumber">
          <div class="cttitle">账单应收日期<i class="required">*</i></div>
          <el-select v-model="LeaseClauseData.dayType"
                      style="width: 57%;margin-right: 10px"
                      @change="dayNumberRest"
                      placeholder="请选择">
            <el-option label="固定日期"
                        value="FIXED"></el-option>
            <el-option label="提前天数"
                        value="TOP"></el-option>
          </el-select>
          <el-input v-model="LeaseClauseData.dayNumber"
                    type="number"
                    style="width: 37%;"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
      </div>
    </div>
    <!-- 3 -->
    <div class="dc-right part3" v-if="rentIncrements">
      <div class="dr-head">
        租金递增
        <span class="iconfont icon-bottom" :class="{'icon-top': !showRentIncrements}" @click="showRentIncrements = !showRentIncrements"></span>
        <span class="iconfont icon-add"  @click="rentIncrementsAdd"></span>
        <span class="iconfont icon-reduce" @click="rentIncrementsReduce"  v-if="LeaseClauseData.incrementRates.length > 1"></span>
        <div class="right-btn"> <i class="iconfont icon-cha"  @click="rentIncrementsDel"></i>
        </div>
      </div>
      <div class="selected-housing" v-for="(item, index) in LeaseClauseData.incrementRates" :key="index" v-if="showRentIncrements">
        <el-form-item :label-width="formLabelWidth"  style="margin-bottom: 20px;">
          <div class="cttitle">递增开始时间<i class="required">*</i></div>
          <el-date-picker v-model="item.startDate" type="date"  @change="changeEnd(index)" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:220px">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" style="margin-bottom: 20px;">
          <div class="cttitle">递增结束时间<i class="required">*</i></div>
          <el-date-picker v-model="item.endDate" type="date" @change="changeStart(index)"  value-format="yyyy-MM-dd" placeholder="选择日期" style="width:220px">
          </el-date-picker>
        </el-form-item>
        <!-- v-if="rentalMethod === 'RENT'"  -->
        <el-form-item :label-width="formLabelWidth" style="margin-bottom: 20px;margin-right: 5px;">
          <div class="cttitle">租金单价递增<i class="required">*</i></div>
          <el-input v-model="item.number" type="number" style="width: 38%" placeholder="请输入内容"></el-input>
          <el-select v-model="item.incrementUnit" style="width: 15%;" placeholder="请选择">
            <el-option label="%" value="P"></el-option>
            <el-option label="元" value="Y"></el-option>
          </el-select>
        </el-form-item>
      </div>
    </div>
    <!-- 4 -->
    <div class="dc-right part3" v-if="rentConcessions">
      <div class="dr-head">
        租金优惠
        <span class="iconfont icon-bottom" :class="{'icon-top': !showRentConcessions}" @click="showRentConcessions = !showRentConcessions"></span>
        <span class="iconfont icon-add" @click="rentConcessionsAdd"></span>
        <span class="iconfont icon-reduce" @click="rentConcessionsReduce" v-if="LeaseClauseData.offerRecords.length > 1"></span>
        <div class="right-btn"> <i class="iconfont icon-cha"  @click="rentConcessionsDel"></i>
        </div>
      </div>
      <div class="selected-housing" v-for="(item, index) in LeaseClauseData.offerRecords" :key="index" v-if="showRentConcessions">
        <el-form-item :label-width="formLabelWidth" style="margin-bottom: 20px;margin-right: 5px;">
          <div class="cttitle">优惠类型<i class="required">*</i></div>
          <el-select v-model="item.offerType"  placeholder="请选择" style="width:220px">
            <el-option label="免租期" value="RENT"></el-option>
            <el-option label="装修期" value="DECORATION"></el-option>
            <el-option label="物业免租期" value="PROPERTY"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" style="margin-bottom: 20px;">
          <div class="cttitle">优惠开始时间<i class="required">*</i></div>
          <el-date-picker v-model="item.yhStartDate" type="date" @change="yhChangeEnd(index)" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:220px">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" style="margin-bottom: 20px;">
          <div class="cttitle">优惠结束时间<i class="required">*</i></div>
          <el-date-picker v-model="item.yhEndDate"  type="date"  @change="yhChangeStart(index)" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:220px">
          </el-date-picker>
        </el-form-item>
      </div>
    </div>
    <div class="generated-btn">
      <span @click="generatedRentDetails('addData')">生成账单明细</span>
    </div>
    <!-- v-if="rentBillDetails.length>0" -->
    <div class="dc-right part4" v-if="rentBillDetails.length>0">
      <div class="dr-head">账单明细
        <div class="right-btn">
          <!-- <span style="width: 70px;" @click="BillEdit=true" v-if="BillEdit===false">编辑</span>
              <span style="width: 70px;" @click="BillEdit=false" v-else>保存</span> -->
        </div>
      </div>
      <div class="selected-housing">
        <ul style="display: flex;">
          <li>日期</li>
          <li>付款日</li>
          <li>最终单价</li>
          <li>最终金额(元)</li>
        </ul>
        <ul v-for="(item, index) in rentBillDetails" :key="index" style="display: flex;">
          <li>{{item.startDate}}～{{item.endDate}}</li>
          <li>{{item.finalPaymentDate}}</li>
          <li>{{item.finalPrice}}{{priceUnitFormat(item.priceUnit)}}</li>
          <li>
            <!-- <input type="text" v-model="item.amount" /> -->
            <div class="overflow-style">{{item.amount}}元
              <!-- <span v-if="item.remake && item.feeTypeName === '租金保证金'" style="color: red">({{item.remake}})</span> -->
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- v-if="rentBillDetails.length>0" -->
    <div class="part5" v-if="rentBillDetails.length>0">
      <span @click="exportBill" class="lastBtn">导出明细账单</span>
      <span @click="clearData" class="firstBtn">清空数据</span>     
    </div>
   </el-form>
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
export default {
  name: 'contractCalculator',
  components: {

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
      rentBillDetails: [],
      showRentConcessions: true,
      showRentIncrements: true,
      rentIncrements: false, // 租金递增
      rentConcessions: false, // 租金优惠
      value1: null,
      rentalMethod: '',
      formLabelWidth: '',
      LeaseClauseData: {
        billDivision: 'NO',
        priceUnit: 'M2DAYS',
        termType: 'RENT',
        billingType: 'MONTH',
        onBillContainFirstOfferReocrd: true,
        offerRecords: [{
          termType: 'RENT',
          'yhStartDate': '',
          'yhEndDate': '',
          'offerType': ''
        }],
        incrementRates: [{
          'termType': 'RENT',
          'startDate': '',
          'endDate': '',
          'number': '',
          'incrementUnit': 'P',
          'priceUnit': 'M2DAYS'
        }]
      },
      addData: {
        areaTypeRent: 'BUILDING',
        rentalMethod: 'RENT',
        rentClauses: [{
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
        }],
        startDate: ''
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
      offerReocrdOptions: [
        { name: '不包括', value: false },
        { name: '包括', value: true }
      ],
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
      addFlowRules: {
        carryModeRent: [{
          required: true,
          message: '请选择计费进位方式',
          trigger: 'change'
        }],
        area: [{
          required: true,
          message: '请输入计租面积',
          trigger: 'change'
        }],
        startDate: [{
          required: true,
          message: '请选择开始时间',
          trigger: 'change'
        }],
        endDate: [{
          required: true,
          message: '请选择结束时间',
          trigger: 'change'
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
        onBillContainFirstOfferReocrd: [{
          required: true,
          message: '首个免租期是否包含在租金账单内',
          trigger: 'change'
        }],
        yearDay: [{
          validator: validateYearDay,
          trigger: 'blur'
        }]
      }
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    contractStartDate () {
      if (this.LeaseClauseData.startDate > this.LeaseClauseData.endDate) {
        this.$message.error('开始时间不能大于结束时间')
        this.LeaseClauseData.startDate = ''
        return
      }
    },
    contractEndDate () {
      if (this.LeaseClauseData.startDate > this.LeaseClauseData.endDate) {
        this.$message.error('结束时间不能小于开始时间')
        this.LeaseClauseData.endDate = ''
        return
      }
    },
    clearData () {
      this.rentBillDetails = []
      this.rentIncrementsDel()
      this.rentConcessionsDel()
      this.$refs['LeaseClauseData'].resetFields()
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
    exportBill () {
      axios({
        method: 'POST',
        url: `/cms/api/bills/business/report/`,
        data: this.addData,
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
    generatedRentDetails () {
      this.$refs['LeaseClauseData'].validate((valid) => {
        if (valid) {
          if (!this.icVerification()) {
            return
          }
          delete this.addData.annexName
          delete this.addData.annexURL
          this.addData.area = this.LeaseClauseData.area
          this.addData.areaTypeRent = 'BUILDING'
          this.addData.rentClauses[0] = this.LeaseClauseData
          this.addData.carryModeRent = this.LeaseClauseData.carryModeRent
          let postData = JSON.parse(JSON.stringify(this.addData))
            // postData.rentClauses[1] = this.propertyClauseData
            // postData.rentClauses[1] = {}
          postData.rentClauses.splice(1, 1)
          context.http.post('/cms/api/bills/business', postData).then(res => {
            this.rentBillDetails = res.data
            // this.LeaseClauseData.incrementRates = [{
            //   termType: 'RENT',
            //   'startDate': '',
            //   'endDate': '',
            //   'number': '',
            //   'incrementUnit': 'P'
            // }]
            // this.LeaseClauseData.offerRecords = [{
            //   termType: 'RENT',
            //   'yhStartDate': '',
            //   'yhEndDate': '',
            //   'offerType': ''
            // }]
          })
        } else {
          return false
        }
      })
    },
    changeEnd (index) {
      if (index > 0) {
        if (this.LeaseClauseData.incrementRates[index].startDate < this.LeaseClauseData.incrementRates[index - 1].endDate) {
          this.$message.error('开始时间不能大于上个阶段结束时间')
          this.LeaseClauseData.incrementRates[index].startDate = ''
          return
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
        return
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
          return
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
        return
      }
      if (this.LeaseClauseData.offerRecords[index].yhEndDate > this.LeaseClauseData.endDate || this.LeaseClauseData.offerRecords[index].yhEndDate < this.LeaseClauseData.startDate) {
        this.$message.error('时间必须在合同时间范围内')
        this.LeaseClauseData.offerRecords[index].yhEndDate = ''
      }
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
    rentConcessionsAdd () {
      this.LeaseClauseData.offerRecords.push({
        termType: 'RENT',
        'yhStartDate': '',
        'yhEndDate': '',
        'offerType': ''
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
      if (this.LeaseClauseData.areaTypeRent === 'BUILDING' && Number(this.addData.area) === 0) {
        this.$message.error('计租面积为0')
        result = false
      } else if (this.LeaseClauseData.areaTypeRent === 'USING' && Number(this.addData.useArea) === 0) {
        this.$message.error('计租面积为0')
        result = false
      }
      return result
    },
    priceUnitChange () {
      for (var i = 0; i < this.LeaseClauseData.incrementRates.length; i++) {
        this.LeaseClauseData.incrementRates[i].priceUnit = this.LeaseClauseData.priceUnit
      }
    },
    dayNumberRest () {
      this.$set(this.LeaseClauseData, 'dayNumber', '')
    },
    monthChange (month) {
      if (month === 3 || month === '3') {
        // this.billDivisionDisabledL = false
      } else {
        this.LeaseClauseData.billDivision = 'NO'
        // this.billDivisionDisabledL = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.contractCalculator{
  font-size: 14px;
  color: #666666;
  .el-input__inner {
    height: 32px;
    margin-right: 10px;
  }

  .el-input__icon {
    line-height: 32px;
  }

  .el-select {
    height: 32px;
    line-height: 32px;
  }
  .part1{
    display: flex;
    justify-content: space-between;
    border-radius: 5px;
    >div{
      height: 120px;
      background-color: #fff;
      width: 49.3%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 20px;
      border-radius: 5px;
    }
  }
  .part2{
    background-color: #fff;
    margin-top: 20px;
    .header{
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      border-bottom:1px solid #eee; 
      .classifi{
        display: inline-block;
        width: 4px;
        height: 14px;
        position: relative;
        border-radius: 2px;
        vertical-align: middle;
        background: #3575f6;
        top: -1px;
      }
      .btn{
        margin-left: 10px;
        display: inline-block;
        width: 70px;
        height: 22px;
        line-height: 19px;
        text-align: center;
        color: #0F75FF;
        border: 1px solid #0F75FF;
        border-radius: 4px;
        margin-right: 6px;
        font-size: 12px;
        cursor: pointer;
        margin-top: 7px;
        &:hover{
          background-color: #0f75ff;
          color:#fff;
          border: 1px solid #0f75ff;
        }
      }
      .fr{
        float: right;
      }
    }
    .form1 {
      padding: 30px 10px;
      .el-form-item{
        display: inline-block;
        width: 23% !important;
        margin-left: 16px;
      }
    }
  }
  .part3{
    background-color: #fff;
    margin-top: 20px;
    .dr-head{
      border-bottom:1px solid #eee; 
      height: 40px;
      line-height: 40px;
      padding-left: 12px;
      font-size: 14px;
      margin-bottom: 24px;
      .icon-add {
          font-size: 16px;
          color: #0073ff;
          margin-left: 40px;
      }
      .right-btn {
        float: right;
        margin-right: 15px;
      }
    }
    .selected-housing{
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      .el-form-item{
        width: 30%;
      }
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
  .part4{
      background-color: #fff;
      margin-top: 20px;
    .dr-head {
      border-bottom:1px solid #eee; 
      height: 40px;
      line-height: 40px;
      padding-left: 12px;
      font-size: 14px;
      margin-bottom: 24px;
    }
    .selected-housing ul:first-child {
      border-bottom: 1px solid #e7e7e7;
    }
    .selected-housing ul li {
      width: 24%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      overflow: hidden;
      font-size: 12px;
    }
  }
  .part5{
    margin-top: 20px;
    display: flex;
    flex-direction: row-reverse;
    .firstBtn{
      &:hover{
        background-color: #0f75ff;
        color: #fff;
        border: 1px solid #0f75ff;
      }
    }
    .lastBtn{
      &:hover{
        background-color: #4675cc;
        color: #fff;
      }
    }
    span{
      border-radius:3px; 
      cursor: pointer;
      &:last-child{
        color: #0F75FF;
        border: 1px solid #0F75FF;
        padding: 5px 8px;
      }
      &:first-child{
        color: #fff;
        background-color: #0073ff;
        padding: 5px 8px;
        margin-left: 15px;
      }
    }
  }
}
</style>
<style lang="scss">
  .contractCalculator{
    font-size: 14px;
    color: #666666;
    .el-input__inner {
      height: 32px;
      margin-right: 10px;
    }

    .el-input__icon {
      line-height: 32px;
    }

    .el-select {
      height: 32px;
      line-height: 32px;
    }
  }
</style>
