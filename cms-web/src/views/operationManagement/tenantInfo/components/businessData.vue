<template>
  <div class="business-data">
    <div class="pl-content">
      <div class="clearfix"
           style="display: flex;align-items: center;justify-content: space-between;">
        <div class="plc-search clearfix"
             style="flex: 1"
             v-show="showType === 1">
          <!-- <el-select v-model="contractId"
                     placeholder="请选择"
                     @change="shopNameTabChange"
                     style="margin-right: 10px;">
            <el-option v-for="item in tenantDetail.contractDTOS"
                       :key="item.id"
                       :label="item.contractNo"
                       :title='item.startDate + "—" + item.endDate'
                       :value="item.id">
            </el-option>
          </el-select> -->
          <el-date-picker type="date"
                          class="screen"
                          value-format="yyyy-MM-dd"
                          v-model="startTime"
                          :editable="false"
                          :clearable="false"
                          placeholder="开始时间">
          </el-date-picker>
          <span style="color: #dadada;padding: 0 4px;">-</span>
          <el-date-picker type="date"
                          class="screen"
                          value-format="yyyy-MM-dd"
                          v-model="endTime"
                          :editable="false"
                          :clearable="false"
                          placeholder="结束时间">
          </el-date-picker>
          <div class="query-btn"
               style="height: 32px;line-height: 32px;width:70px;margin-right: 10px"
               @click="query">查询</div>
          <div class="btnDiv">
            <el-button style="display:block"
                       @click="dialogFormVisible = true"
                       class="tban tban1"><i class="iconfont icon-crm_xinzeng-"></i> 新增营业额</el-button>
            <el-dropdown trigger="hover">
              <div class="morebtn1 el-dropdown-link">
                <i class="icon-daochu"
                   style="font-size: 12px;margin-left:5px;"></i>
                <span>导入营业额</span>
                <i class="el-icon-caret-bottom"
                   style="font-size: 14px;"></i>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <span class="disBlock"
                        @click="downLoadModel">下载模版</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span class="disBlock"
                        style="postion: relative">导入营业额
                    <input type="file"
                           style="position: absolute;opacity: 0;left: 0;width: 100%;height: 100%;font-size: 0;top: -3px;cursor: pointer;"
                           @change="importModel($event)">
                    <!-- <p class="shade"
                       v-if="isImport"
                       @click="affirmFn"></p> -->
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="plc-search clearfix"
             style="flex: 1"
             v-show="showType === 2">
          <div class="switch-btn">
            <span @click="changeCondition('DAY')"
                  :class="{'switch-select': condition === 'DAY'}">日</span>
            <span @click="changeCondition('MONTH')"
                  :class="{'switch-select': condition === 'MONTH'}">月</span>
          </div>
          <!-- <el-select v-model="contractId"
                     placeholder="请选择"
                     style="margin-right: 20px;">
            <el-option v-for="item in tenantDetail.contractDTOS"
                       :key="item.id"
                       :label="item.contractNo"
                       :title='item.startDate + "—" + item.endDate'
                       :value="item.id">
            </el-option>
          </el-select> -->
          <el-date-picker type="month"
                          class="screen"
                          v-show="condition === 'DAY'"
                          value-format="yyyy-MM"
                          v-model="bsStartDate"
                          :clearable="false"
                          :editable="false"
                          placeholder="开始时间">
          </el-date-picker>
          <el-date-picker :clearable="false"
                          v-show="condition === 'MONTH'"
                          style="display: inline-flex;width: 140px"
                          v-model="recordStartDate"
                          type="month"
                          value-format="yyyy-MM"
                          :editable="false"
                          :picker-options="pickerBeginMonthBefore"
                          placeholder="开始月份">
          </el-date-picker>
          <span style="color: #dadada;padding: 0 4px;"
                v-show="condition === 'MONTH'">—</span>
          <el-date-picker :clearable="false"
                          v-show="condition === 'MONTH'"
                          style="display: inline-flex;width: 140px"
                          v-model="recordEndDate"
                          :editable="false"
                          type="month"
                          value-format="yyyy-MM"
                          :picker-options="pickerBeginMonthAfter"
                          placeholder="结束月份">
          </el-date-picker>
          <div class="query-btn"
               style="height: 32px;line-height: 32px;width:70px;"
               @click="getBusinessData">查询</div>
        </div>
        <div class="changeBtnDiv">
          <span class="iconfont icon-liebiao401"
                :class="{'active':showType === 1}"
                title="展示表格"
                @click="changeShowType(1)"></span>
          <span class="iconfont icon-tubiao"
                :class="{'active':showType === 2}"
                title="展示柱状图"
                @click="changeShowType(2)"></span>
        </div>
      </div>
      <div label="列表"
           v-if="showType === 1">
        <div class="plc-table details_table">
          <el-table :data="tableData"
                    style="width: 100%">
            <el-table-column prop="recordDate"
                             label="日期"
                             align="center"></el-table-column>
            <el-table-column label="营业额"
                             align="center">
              <template slot-scope="scope">
                <div style="width: 100px;text-align: right;margin: 0 168px;">{{scope.row.turnoverAmount}}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="plc-table-bottom"
             v-if="tableData.length > 0">
          <ul>
            <li>本页合计</li>
            <li></li>
            <li>{{pageAmount | toLocaleString}}</li>
          </ul>
          <ul>
            <li>商户总计</li>
            <li></li>
            <li>{{totalTurnover | toLocaleString}}</li>
          </ul>
        </div>
        <div class="ctc-foot"
             v-if="pager.total > 0">
          <span><span style="margin-right:10px">{{pager.currentPage}}/{{pager.totalPages}}页</span> 共{{pager.total}}条记录</span>
          <el-pagination background
                         v-if="pager.total > 0"
                         layout="prev, pager, next"
                         :page-size="pager.pgSize"
                         :total="pager.total"
                         :current-page="pager.currentPage"
                         @current-change="current_change">
          </el-pagination>
          <div class="pagingnum">
            显示 <select v-model="pager.pgSize"
                    @change="currentSel">
              <option v-for="item in pager.pgNumoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </option>
            </select>
            条目
            <!-- <span style="padding-left: 30px">显示从{{pgSize*(currentPage - 1) + 1}}到{{pgSize*currentPage}}项结果，</span> -->
          </div>
        </div>
      </div>
      <div label="图表"
           v-else>
        <div id="charts"
             class="chart"
             style="display:none;">
          <div id="drawLineEnergy"
               :style="{width: '100%', height: '90%'}"></div>
        </div>
        <div class="chart"
             v-show="!hasAmountOfBill">
          <div class="nodata">暂无数据</div>
        </div>
      </div>
    </div>
    <el-dialog title="提示"
               :visible.sync="centerDialogVisible"
               class="turnoverDialog"
               width="30%"
               center
               append-to-body>
      <span>该客户目前可能未租赁房源，是否继续导入</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <span class="UpBtn1">
          <i>确 定</i>
          <input type="file"
                 @change="importModel($event)"
                 id="imageChange">
        </span>
      </span>
    </el-dialog>
    <!-- 新增单日营业额 -->
    <el-dialog class="el_dialog_new addBusinessVolumeDialog"
               title="新增营业额"
               center
               width="400px"
               append-to-body
               @close="businessVolumeClose('ruleForm')"
               :visible.sync="dialogFormVisible"
               :close-on-click-modal="false">
      <div class="dialog_content">
        <el-form :model="addParam"
                 ref="ruleForm"
                 :rules="rules">
          <el-form-item>
            <div>日期<i class="required">*</i></div>
            <el-date-picker type="date"
                            style="width:100%"
                            value-format="yyyy-MM-dd"
                            v-model="addParam.recordDate"
                            size="small"
                            :editable="false"
                            :clearable="false"
                            placeholder="开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="turnoverAmount">
            <div>营业额<i class="required">*</i></div>
            <el-input v-model="addParam.turnoverAmount"
                      type="number"
                      size="small">></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"
           class="slotfooter">
        <span @click="businessVolumeClose('ruleForm')"
              class="details_cannelBtn">关闭</span>
        <span @click="addBusinessVolume('ruleForm')"
              class="details_submitBtn">确定</span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
import moment from 'moment'
import axios from 'axios'
import * as JSOG from 'jsog'
import { toLocaleString } from '@/utils/validate.js'
export default {
  name: 'businessData',
  props: {
    tenantDetail: {
      type: Object,
      default: {}
    },
    tabActive: {
      type: Number,
      default: 0
    }
  },
  watch: {
    tabActive: {
      handler: function () {
        // if (this.tenantDetail.contractDTOS.length > 0) {
        //   this.contractId = this.tenantDetail.contractDTOS[0].id // 初始化默认第一个合同id
        //   this.isImportFn()// 判断此条合同能否直接导入营业额
        // }
        this.getTurnoverList()
      },
      immediate: true
    }
  },
  data () {
    return {
      dialogFormVisible: false,
      addParam: {
        recordDate: new Date(moment().add(-1, 'DAY').format('YYYY-MM-DD')),
        turnoverAmount: '',
        tenantId: ''
      },
      rules: {
        turnoverAmount: [
          { required: true, message: '营业额不能为空', trigger: 'change' }
        ]
      },
      hasAmountOfBill: false,
      recordStartDate: '',
      recordEndDate: '',
      showType: 1,
      bsStartDate: '',
      bsEndDate: '',
      recordDate: [],
      condition: 'DAY',
      activeName: 'first',
      tableData: [],
      costTypeOptions: [],
      statusOptions: [],
      endTime: '',
      startTime: '',
      cost: '',
      billStatus: '',
      pageAmount: '',
      totalTurnover: '',
      pager: {
        currentPage: 1,
        totalPages: 1,
        pgNum: 1,
        total: 0,
        pgSize: 15,
        flowDetailsData: {},
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
        ]
      },
      shopNameTabIndex: 0,
      contractId: '',
      isImport: false,
      centerDialogVisible: false,
      endMonthTime: '',
      pickerBeginMonthBefore: {
        disabledDate: time => {
          let endDateVal = this.recordEndDate
          if (endDateVal) {
            let temp = new Date(endDateVal).getTime() - 11 * 365 * 24 * 60 * 60 * 1000
            return time.getTime() < new Date(temp).getTime() || time.getTime() > new Date(endDateVal).getTime()
          }
        }
      },
      pickerBeginMonthAfter: {
        disabledDate: time => {
          let beginDateVal = this.recordStartDate
          if (beginDateVal) {
            let temp = new Date(beginDateVal).getTime() + 12 * 365 * 24 * 60 * 60 * 1000
            return time.getTime() > new Date(temp).getTime() || time.getTime() < new Date(beginDateVal).getTime()
          }
        }
      }
    }
  },
  created () {
    this.getNowDate()
  },
  methods: {
    addBusinessVolume (formName) { // 新增单日营业额
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addParam.tenantId = this.tenantDetail.id
          context.http.post(`cms/api/turnovers/app`, this.addParam).then(res => {
            if (res.status === 200) {
              this.$message.success('新增成功')
              this.addParam.turnoverAmount = ''
              this.query()
              this.businessVolumeClose('ruleForm')
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    businessVolumeClose (formName) {
      this.$refs[formName].resetFields()
      this.dialogFormVisible = false
    },
    query () {
      this.pager.currentPage = 1
      this.getTurnoverList()
    },
    handleEdit () { },
    current_change (currentPage) {
      this.pager.currentPage = currentPage
      this.getTurnoverList()
    },
    currentSel () {
      this.query()
    },
    changeCondition (type) {
      this.condition = type
      this.getNowDate()
      this.getBusinessData()
    },
    handleClick (tab, event) {
      if (this.activeName === 'first') {
        this.$nextTick(() => {
        })
      } else if (this.activeName === 'second') {
        this.$nextTick(() => {
          // this.paymentAnalysis()
        })
      }
    },
    changeShowType (n) {
      this.getNowDate()
      this.getBusinessData()
      this.showType = n
    },
    getNowDate () {
      var now = new Date()
      var myyear = now.getFullYear()
      var mymonth = now.getMonth() + 1
      mymonth = mymonth < 10 ? '0' + mymonth : mymonth
      let bsStartDate = myyear + '-' + mymonth
      this.bsStartDate = this.endMonthTime || bsStartDate
      this.recordDate = [myyear + '-01', this.endMonthTime || bsStartDate]
      this.recordStartDate = myyear + '-01'
      this.recordEndDate = this.endMonthTime || bsStartDate
    },
    getTurnoverList () {
      // 获取营业额
      context.http.get('cms/api/tenantTurnover', {
        sort: 'recordDate,desc',
        startDate: this.startTime,
        endDate: this.endTime,
        tenantId: this.tenantDetail.id,
        // contractId: this.contractId,
        page: (this.pager.currentPage - 1),
        size: this.pager.pgSize
      }).then(result => {
        if (result.status === 200) {
          this.tableData = JSOG.decode(result.data)
          this.tableData.forEach(ele => {
            ele.turnoverAmount = toLocaleString(ele.turnoverAmount)
          })
          this.pager.total = Number(result.headers['x-total-count'])
          this.pager.totalPages = Math.ceil(this.pager.total / this.pager.pgSize)
          this.totalTurnover = Number(result.headers['amount'])
          this.pageAmount = Number(result.headers['pageamount'])
          if (result.data.length > 0) {
            this.endMonthTime = this.tableData[0].recordDate.substring(0, 7)
          }
        }
      })
    },
    drawLineEnergy (dateArray, dataArray) {
      let myChart = this.$echarts.init(document.getElementById('drawLineEnergy'))
      let colors = ['#3173E6']
      let option = {
        color: colors,
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          x: 'right',
          data: ['营业额'],
          formatter: function (name) {
            return name + '(元)'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#DCDCDC', // 颜色
              width: 1 // 粗细
            }
          },
          axisLabel: {// x轴文字的配置
            // rotate: 40,
            show: true,
            textStyle: {
              color: '#666666'
            }
          },
          data: dateArray
          // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value',
          axisLine: {       // y轴
            lineStyle: {
              color: '#DCDCDC', // 颜色
              width: 1 // 粗细
            }
          },
          axisLabel: {// y轴文字的配置
            textStyle: {
              color: '#666666'
            }
          }
        },
        // series: dataArray
        series: [{
          name: '营业额',
          data: dataArray,
          // data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
        }]
      }
      myChart.setOption(option)
    },
    getBusinessData () {
      let condition = this.condition
      let bsStartDate = ''
      let bsEndDate = ''
      if (condition === 'DAY') {
        bsStartDate = this.bsStartDate
      } else {
        bsStartDate = this.recordStartDate
        bsEndDate = this.recordEndDate
      }
      context.http.get('/cms/api/turnovers/statistics/byTenant', {
        tenantId: this.tenantDetail.id,
        // contractId: this.contractId,
        dateType: this.condition,
        startDate: bsStartDate,
        endDate: bsEndDate
      }).then(res => {
        let charts = document.getElementById('charts')
        let legendData = []
        let seriesData = []
        let energyLegendData = [] // 能耗分析数据
        let energyAmounts = []
        if (res.status === 200 && res.data.length > 0) {
          charts.style.display = 'block'
          this.hasAmountOfBill = true
          let billReport = res.data
          let dateArray = []
          let dataArray = []
          billReport.forEach(ele => {
            dateArray.push(ele.x)
            dataArray.push(ele.y)
          })
          this.drawLineEnergy(dateArray, dataArray)
        } else {
          charts.style.display = 'none'
          this.hasAmountOfBill = false
        }
      })
    },
    async downLoadModel () {
      axios({ method: 'GET', url: '/cms/api/tenantTurnover/file', responseType: 'blob' }).then(res => {
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
      // form.append('contractId', this.contractId)
      form.append('tenantId', this.tenantDetail.id)
      let name = files[0].name
      let index = name.lastIndexOf('.')
      let type = name.substr(index + 1).toLowerCase()
      event.target.value = ''
      if (index > 0 && type !== 'xlsx' && type !== 'xls') {
        this.$message({
          message: '格式错误，请上传xlsx格式文件',
          type: 'error'
        })
      } else {
        context.http.post('/cms/api/tenantTurnover/file', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          this.$message({
            message: '导入成功！',
            type: 'success'
          })
          this.getTurnoverList()
          this.centerDialogVisible = false
        }).catch(error => {
          console.info(error)
        })
      }
    },
    shopNameTabChange () {
      this.pager.currentPage = 1
      // this.shopNameTabIndex = index
      // this.contractId = item.id
      this.getTurnoverList()
      this.isImportFn()
    },
    async isImportFn () {
      let result = await context.http.get('/cms/api/tenantTurnover/isImport', { contractId: this.contractId })
      this.isImport = result.data
    },
    affirmFn () {
      this.centerDialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.addBusinessVolumeDialog {
  .el-form {
    .el-form-item {
      width: 100%;
    }
  }
}
.disBlock {
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
  .shade {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
}
.business-data {
  .pl-content {
    width: 98%;
    margin: 0 auto;
    .plc-search {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      // height: 100px;
      // line-height: 100px;
      margin-bottom: 20px;
      background-color: #fff;
      padding-left: 5px;
      font-size: 14px;
      .el-input {
        width: 120px;
        input {
          height: 32px;
          line-height: 32px;
        }
        .el-input__prefix,
        .el-input__suffix {
          top: 10px;
        }
      }
      .screen {
        width: 140px;
      }
      div {
        // float: left;
        display: inline-block;
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
      .btnDiv {
        display: flex;
        margin: 0 10px;
        .morebtn1 {
          border: 1px solid #f3af2c;
          color: #f3af2c;
          height: 30px;
          width: 120px;
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
        // span {
        //   display: inline-block;
        //   width: 90px;
        //   height: 34px;
        //   line-height: 34px;
        //   text-align: center;
        //   color: #ffffff;
        //   background-color: #78aa6f;
        //   margin-right: 15px;
        //   cursor: pointer;
        //   border-radius: 4px;
        //   &:last-child {
        //     background-color: #3577f6;
        //   }
        // }
      }
      .switch-btn {
        display: inline-flex;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        margin-right: 10px;
        span {
          display: inline-block;
          width: 42px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          cursor: pointer;
          border-radius: 4px;
          &:first-child {
            border-right: none;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          }
          &:last-child {
            border-left: none;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
        }
      }
      .switch-select {
        background-color: #3577f6;
        color: #fff;
      }
    }
    .el-date-editor {
      .el-input__prefix,
      .el-input__suffix {
        top: 0 !important;
      }
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
      border: none;
      .export {
        position: absolute;
        right: 20px;
        top: 5px;
        z-index: 9;
        span {
          display: inline-block;
          width: 60px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background: rgba(222, 235, 254, 1);
          color: #5b9af8;
          opacity: 0.9;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
    .plc-table-bottom {
      ul {
        height: 35px;
        background-color: #eff4fe;
        &:first-child {
          background-color: #fafbff;
        }
        li {
          display: inline-block;
          width: 30%;
          line-height: 35px;
          text-align: center;
          color: #262626;
          font-size: 14px;
          &:first-child {
            text-align: left;
            padding-left: 20px;
          }
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
    }
    .el-textarea {
      width: 178px;
    }
    .shopNameTab {
      height: 40px;
      background-color: #fafafa;
      border: 1px solid #eeeeee;
      display: flex;
      justify-content: flex-start;
      span {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        text-align: center;
        padding: 0 8px;
        cursor: pointer;
        &.active {
          color: #ffffff;
          background-color: #3577f6;
        }
      }
    }
    .changeBtnDiv {
      margin-right: 5px;
      position: relative;
      top: -10px;
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
  }
  // .ctc-foot {
  //   background-color: #ffffff;
  //   display: flex;
  //   justify-content: space-between;
  //   padding: 60px 0 30px 20px;
  //   .el-pagination.is-background .el-pager li:not(.disabled).active {
  //     background-color: #2f3f48;
  //     color: #fff;
  //   }
  //   .el-pagination.is-background .el-pager li:not(.disabled):hover {
  //     color: #999;
  //   }
  // }
  // .pagingnum {
  //   font-size: 14px;
  //   text-align: center;
  //   color: #777;
  //   select {
  //     width: 70px;
  //     height: 28px;
  //     border-radius: 2px;
  //   }
  // }
  .query-btn {
    margin-left: 20px;
    margin-top: 0;
  }
  .turnoverDialog {
    .el-dialog--center .el-dialog__body {
      padding: 25px 25px 30px !important;
    }
  }
  .chart {
    width: 100%;
    height: 400px;
    background: #fff;
  }
  .nodata {
    color: #666;
    padding: 30px;
    text-align: center;
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
</style>
<style lang="scss">
.business-data {
  .cell {
    color: #262626;
  }
}
</style>

