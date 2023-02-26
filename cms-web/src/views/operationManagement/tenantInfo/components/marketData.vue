<template>
  <div class="marketData">
    <div class="pl-content">
      <div class="clearfix"
           style="display: flex;align-items: center;justify-content: space-between;">
        <div class="plc-search clearfix"
             style="flex: 1">
          <div class="switch-btn">
            <span @click="changeCondition('DAY')"
                  :class="{'switch-select': condition === 'DAY'}">日</span>
            <span @click="changeCondition('MONTH')"
                  :class="{'switch-select': condition === 'MONTH'}">月</span>
          </div>
          <el-date-picker type="date"
                          v-show="condition === 'DAY' && showType === 1"
                          class="screen"
                          :editable="false"
                          value-format="yyyy-MM-dd"
                          v-model="startTime"
                          :clearable="false"
                          :picker-options="pickerBeginDayBefore"
                          placeholder="开始时间">
          </el-date-picker>
          <span style="color: #dadada;padding: 0 4px;"
                v-show="condition === 'DAY'  && showType === 1">—</span>
          <el-date-picker type="date"
                          v-show="condition === 'DAY'  && showType === 1"
                          class="screen"
                          :editable="false"
                          value-format="yyyy-MM-dd"
                          v-model="endTime"
                          :clearable="false"
                          :picker-options="pickerBeginDayAfter"
                          placeholder="结束时间">
          </el-date-picker>
          <el-date-picker :clearable="false"
                          v-show="condition === 'MONTH'"
                          style="display: inline-flex;width: 140px"
                          v-model="startTime1"
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
                          v-model="endTime1"
                          type="month"
                          :editable="false"
                          value-format="yyyy-MM"
                          :picker-options="pickerBeginMonthAfter"
                          placeholder="结束月份">
          </el-date-picker>
          <el-date-picker :clearable="false"
                          v-show="condition === 'DAY'&&showType === 2"
                          style="display: inline-flex;width: 140px"
                          :editable="false"
                          v-model="monthTime"
                          type="month"
                          value-format="yyyy-MM">
          </el-date-picker>
          <div class="query-btn"
               style="height: 32px;line-height: 32px;width:70px;"
               @click="inquire">查询</div>
        </div>
        <div class="changeBtnDiv">
          <span class="iconfont icon-liebiao401"
                :class="{'active':showType === 1}"
                title="展示表格"
                @click="changeShowType(1)"></span>
          <span class="iconfont icon-tubiao"
                :class="{'active':showType === 2}"
                title="展示折线图"
                @click="changeShowType(2)"></span>
        </div>
      </div>
      <div label="列表"
           v-if="showType === 1">
        <div class="plc-table details_table">
          <el-table :data="tableData"
                    style="width: 100%">
            <el-table-column prop="recordDate"
                             label="订单时间"
                             :formatter="recordDateFormat"
                             align="center"></el-table-column>
            <el-table-column prop="saleNumber"
                             label="销售单数"
                             align="center"></el-table-column>
            <el-table-column prop="saleAmount"
                             label="销售金额/元"
                             align="center"></el-table-column>
            <el-table-column prop="refundNumber"
                             label="退货单数"
                             align="center"></el-table-column>
            <el-table-column prop="refundAmount"
                             label="退货金额/元"
                             align="center"></el-table-column>
            <el-table-column prop="turnoverAmount"
                             label="实销售额/元"
                             align="center"></el-table-column>
          </el-table>
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
  </div>
</template>
<script>
import context from '@/service'
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
        if (this.tenantDetail.contractDTOS.length > 0) {
          this.contractId = this.tenantDetail.contractDTOS[0].id // 初始化默认第一个合同id
        }
        this.getNowDate()
        this.getTurnoverList()
      },
      immediate: true
    }
  },
  data () {
    return {
      hasAmountOfBill: false,
      startTime: '',
      endTime: '',
      startTime1: '',
      endTime1: '',
      monthTime: '',
      showType: 1,
      bsStartDate: '',
      bsEndDate: '',
      recordDate: [],
      condition: 'DAY',
      activeName: 'first',
      tableData: [],
      costTypeOptions: [],
      statusOptions: [],
      cost: '',
      billStatus: '',
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
      endMonthTime: '',
      pickerBeginDayBefore: {
        disabledDate: time => {
          let endDateVal = this.endTime
          if (endDateVal) {
            let temp = new Date(endDateVal).getTime() - 31 * 24 * 60 * 60 * 1000
            return time.getTime() > new Date(endDateVal).getTime()
          }
        }
      },
      pickerBeginDayAfter: {
        disabledDate: time => {
          let beginDateVal = this.startTime
          if (beginDateVal) {
            let temp = new Date(beginDateVal).getTime() + 30 * 24 * 60 * 60 * 1000
            let oneDay = 24 * 60 * 60 * 1000
            return time.getTime() < new Date(beginDateVal).getTime() - oneDay
          }
        }
      },
      pickerBeginMonthBefore: {
        disabledDate: time => {
          let endDateVal = this.endTime1
          if (endDateVal) {
            let temp = new Date(endDateVal).getTime() - 365 * 24 * 60 * 60 * 1000
            return time.getTime() < new Date(temp).getTime() || time.getTime() > new Date(endDateVal).getTime()
          }
        }
      },
      pickerBeginMonthAfter: {
        disabledDate: time => {
          let beginDateVal = this.startTime1
          if (beginDateVal) {
            let temp = new Date(beginDateVal).getTime() + 365 * 24 * 60 * 60 * 1000
            return time.getTime() > new Date(temp).getTime() || time.getTime() < new Date(beginDateVal).getTime()
          }
        }
      }
    }
  },
  created () {

  },
  methods: {
    inquire () {
      if (this.showType === 1) {
        this.getTurnoverList()
      } else {
        this.getBusinessData()
      }
    },
    recordDateFormat (row, column) {
      if (this.condition === 'DAY') {
        return row.recordDate
      } else {
        return row.recordDate.substring(0, 7)
      }
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
    changeCondition (type) { // 切换日月
      this.condition = type
      // this.startTime = ''
      // this.endTime = ''
      if (this.showType === 1) {
        this.getTurnoverList()
      } else {
        this.getBusinessData()
      }
    },
    changeShowType (n) { // 切换折线图  列表
      this.showType = n
      if (this.showType === 1) {
        this.getTurnoverList()
      } else {
        this.getBusinessData()
      }
    },
    getNowDate () {
      var now = new Date()
      var myyear = now.getFullYear()
      var mymonth = now.getMonth() + 1
      var day = now.getDate()
      mymonth = mymonth < 10 ? '0' + mymonth : mymonth
      day = day < 10 ? '0' + day : day
      let bsStartDate = myyear + '-' + mymonth
      this.monthTime = bsStartDate
      this.startTime1 = myyear + '-01'
      this.endTime1 = bsStartDate
      this.startTime = myyear + '-' + mymonth + '-01'
      this.endTime = bsStartDate + '-' + day
    },
    getTurnoverList () {
      let startTime = ''
      let endTime = ''
      if (this.condition === 'DAY') {
        startTime = this.startTime
        endTime = this.endTime
      } else {
        startTime = this.startTime1
        endTime = this.endTime1
      }
      // 获取营业额
      context.http.get('cms/api/turnovers/market', {
        sort: 'recordDate,desc',
        dateType: this.condition,
        startDate: startTime,
        endDate: endTime,
        tenantId: this.tenantDetail.id,
        // contractId: this.contractId,
        page: (this.pager.currentPage - 1),
        size: this.pager.pgSize
      }).then(result => {
        if (result.status === 200) {
          this.tableData = JSOG.decode(result.data)
          // this.tableData.forEach(ele => {
          //   ele.turnoverAmount = toLocaleString(ele.turnoverAmount)
          // })
          this.pager.total = Number(result.headers['x-total-count'])
          this.pager.totalPages = Math.ceil(this.pager.total / this.pager.pgSize)
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
          data: ['实销售额'],
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
          name: '实销售额',
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
        bsStartDate = this.monthTime
      } else {
        bsStartDate = this.startTime1
        bsEndDate = this.endTime1
      }
      context.http.get('/cms/api/turnovers/statistics/byTenant', {
        tenantId: this.tenantDetail.id,
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
    }
  }
}
</script>
<style lang="scss" scoped>
.marketData {
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
        float: right;
        margin: 0 10px;
        span {
          display: inline-block;
          width: 90px;
          height: 34px;
          line-height: 34px;
          text-align: center;
          color: #ffffff;
          background-color: #78aa6f;
          margin-right: 15px;
          cursor: pointer;
          border-radius: 4px;
          &:last-child {
            background-color: #3577f6;
          }
        }
        .shade {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
        }
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
.marketData {
  .cell {
    color: #262626;
  }
}
</style>

