<template>
  <div class="add-rent-rules">
    <div class="dc-right">
      <el-form ref="LeaseClauseForm"
               :model="addData"
               :rules="addDataRules">
        <div class="dc-block">
          <div class="dr-head"><span class="vertical"></span>规则起止日期</div>
          <div>
            <el-form-item label="开始日期"
                          prop="startDate">
              <el-date-picker v-model="addData.startDate"
                              type="date"
                              size="small"
                              value-format="yyyy-MM-dd"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <span style="display: inline-block;margin: 0 10px">-</span>
            <el-form-item label="结束日期">
              <el-date-picker v-model="addData.endDate"
                              type="date"
                              size="small"
                              disabled
                              value-format="yyyy-MM-dd"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </div>
        </div>
      </el-form>
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
            <div class="fg-header">
              <p><span>楼宇：{{item.building.buildingName}}</span> 地址：{{item.building.address}} </p>
              <p><span>类型：{{assetsTypeFormte(item.building.assetsType)}}</span> 总面积：{{item.building.buildingArea}}
                <span>{{item.building.assetsType ==='LAND'? '亩' : 'm²'}}</span>
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
                        style="width: 270px;margin-right: 20px"
                        prop="month">
            <el-input v-model="LeaseClauseData.month"
                      size="small"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item prop="dayNumber"
                        style="width: 270px;margin-right: 20px"
                        label="账单应收日期">
            <el-select v-model="LeaseClauseData.dayType"
                       size="small"
                       style="width: 57%;margin-right: 10px"
                       @change="LeaseClauseData.dayNumber = ''"
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
            <el-form-item style="vertical-align: bottom;width: 270px">
              <i class="iconfont icon-lajixiang"
                 @click="delOfferRecord(index)"></i>
            </el-form-item>
          </template>
        </div>
      </el-form>
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
      addData: {
        startDate: ''
      },
      addDataRules: {
        startDate: [
          { required: true, message: '请选择开始日期', trigger: 'change' }
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
        month: '',
        dayType: '',
        dayNumber: '',
        offerRecords: []
      },
      dialogVisible: false,
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
      contractStartLimit: {
        disabledDate: time => {
          if (this.addData.startDate) {
            return time.getTime() < new Date(this.addData.startDate).getTime()
          } else {
            return
          }
        }
      }
    }
  },
  methods: {
    initLeaseClauseData () {
      this.addData.endDate = this.LeaseClauseDataes.endDate
      let startDate = this.LeaseClauseDataes.startDate
      let buildings = this.LeaseClauseDataes.buildings
      let newRentClauses = []
      buildings.forEach(ele => {
        newRentClauses.push({
          building: ele,
          buildingId: ele.id,
          area: '',
          priceL: '',
          incrementRates: []
        })
      })
      this.addData2.rentClauses = newRentClauses
      this.contractEnd = {
        disabledDate: time => {
          if (startDate) {
            return time.getTime() < new Date(startDate).getTime()
          } else {
            return
          }
        }
      }
    },
    resetData () {
      this.addData = {
        startDate: '',
        endDate: ''
      }
      this.addData2 = {
        rentClauses: []
      }
      this.LeaseClauseData = {
        month: '',
        dayType: '',
        dayNumber: '',
        offerRecords: []
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
    closeRules () {
      this.LeaseClauseData = {
        month: '',
        dayType: '',
        dayNumber: '',
        offerRecords: []
      }
    },
    saveRules () {
      this.LeaseClauseData.contractId = this.contractId
      delete this.LeaseClauseData.id
      this.$refs['LeaseClauseForm'].validate((valid) => {
        if (valid) {
          this.$refs['rentClauses'].validate((valid) => {
            if (valid) {
              this.$refs['LeaseClauseData'].validate((valid) => {
                if (valid) {
                  if (!this.icVerification()) {
                    return
                  }
                  let array = this.addData2.rentClauses
                  let rentClauses = []
                  for (let index = 0; index < array.length; index++) {
                    const ele = array[index]
                    const incrementRates = ele.incrementRates
                    rentClauses.push({ ...ele, ...this.LeaseClauseData, ...this.addData })
                    rentClauses[index].incrementRates = incrementRates
                  }
                  console.log(rentClauses)
                  let _this = this
                  context.http.post('/cms/api/rent-clauses', rentClauses).then(res => {
                    if (res) {
                      _this.$emit('closeDialog', false)
                      _this.$emit('resetData', false)
                      this.resetData()
                    }
                  })
                } else {
                  return false
                }
              })
            } else {
              return false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
    addOfferRecord () {
      this.LeaseClauseData.offerRecords.push({
        yhStartDate: '',
        yhEndDate: ''
      })
    },
    delOfferRecord (index) {
      this.LeaseClauseData.offerRecords.splice(index, 1)
    },
    priceChange (index) {
      this.currentIndex = index
      this.calculationIncrementToNumber()
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
            } else {
              incrementRates[incrementRates.length - 1].point += Number((Number(incrementRates[incrementRates.length - 1].point) * (Number(this.increaseForm.number) / 100)).toFixed(2))
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
    delStep (itme, index, cindex) {
      itme.incrementRates.splice(index, 1)
      this.setContractStartLimit(itme)
      this.currentIndex = cindex
      this.calculationIncrementToNumber()
    },
    assetsTypeFormte (val) {
      const amap = {
        'BUILDING': '楼宇',
        'LAND': '土地',
        'FIELD': '场地'
      }
      return amap[val]
    },
    priceUnitFormat (val) {
      const amap = {
        'M2DAYS': '面积单价(每天)',
        'MONTH': '月租金',
        'YEAR': '年租金'
      }
      return amap[val]
    }
  }
}
</script>
<style lang="scss" scoped>
.add-rent-rules {
  .el-select {
    width: 100%;
  }
  .el-form-item {
    display: inline-block;
  }
  .dc-right {
    width: 100% !important;
    margin-bottom: 15px;
    overflow: hidden;
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
  .dr-head11 {
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
  .dr-head {
    background-color: #fff;
    height: 40px;
    line-height: 40px;
    padding-left: 15px;
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: bold;
    border-bottom: 1px solid #f6f6f6;
    div,
    span {
      font-weight: 400;
    }
    .vertical {
      display: inline-block;
      width: 4px;
      height: 18px !important;
      background-color: #3575f6;
      border-radius: 2px;
      vertical-align: sub;
      margin-right: 5px;
    }
  }
  .dc-block {
    width: 100%;
    margin-top: 12px;
    background-color: #fff;
    > div {
      padding-left: 15px;
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
      height: 16px;
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
    }
    .assets-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 15px;
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
    .form-group {
      padding-left: 0 !important;
      .fg-header {
        background-color: #EEF9FB;
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
        padding-left: 15px;
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
<style lang="scss">
.newRulesDialog {
  .el-dialog__header {
    margin: 0 15px !important;
    padding: 20px 0 10px 0 !important;
    border-bottom: none;
  }
  .el-dialog__body {
    margin: 0 !important;
    background-color: #f7f7f7;
    border: none;
  }
  .add-rent-rules {
    overflow: hidden;
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
