<template>
  <div class="statistical-reportForms">
    <div class="search-condition">
      <div class="switch-btn">
        <span @click="changeCondition('MONTH')" :class="{'switch-select': condition === 'MONTH'}">月</span>
        <span @click="changeCondition('YEAR')" :class="{'switch-select': condition === 'YEAR'}">年</span>
      </div>
      <el-select v-model="feeTypeId" placeholder="请选择" style="width: 180px;margin-right: 20px;" clearable>
        <el-option
          v-for="item in costTypeOptions"
          :key="item.id"
          :label="item.value"
          :value="item.id">
        </el-option>
      </el-select>
      <el-date-picker v-model="costStartDate"
                      v-show="condition === 'MONTH'"
                      style="width: 180px"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="开始时间"
                      :editable="false"
                      :clearable="false"
                      :picker-options="pickerBeginDateBefore">
      </el-date-picker>
      <div class="split" v-show="condition === 'MONTH'" style="display: inline-block;color: #dcdfe6;padding: 0 4px">—</div>
      <el-date-picker v-model="costEndDate"
                      v-show="condition === 'MONTH'"
                      style="width: 180px"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="结束时间"
                      :editable="false"
                      :clearable="false"
                      :picker-options="pickerBeginDateAfter">
      </el-date-picker>
      <!-- <el-date-picker
        :clearable="false"
        v-show="condition === 'MONTH'"
        v-model="recordDate"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="daterangeChange">
      </el-date-picker> -->
      <el-date-picker
        :clearable="false"
        style="width: 180px"
        v-show="condition === 'YEAR'"
        v-model="yearStart"
        value-format="yyyy"
        type="year"
        :picker-options="pickerBeginYearBefore"
        placeholder="开始年份">
      </el-date-picker>
      <span style="color: #dadada;padding: 0 4px;" v-show="condition === 'YEAR'">—</span>
      <el-date-picker
        :clearable="false"
        style="width: 180px"
        v-show="condition === 'YEAR'"
        v-model="yearEnd"
        value-format="yyyy"
        type="year"
        :picker-options="pickerBeginYearAfter"
        placeholder="结束年份">
      </el-date-picker>
      <span @click="getAmountOfBill" class="query-btn tenant-btn" 
      style="display: inline-block; margin-left: 10px;height: 32px;line-height: 32px;width:70px;margin-top: 0">查询</span>
    </div>
    <div class="trend">
      <!-- <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="费用概况" name="first">
          <div class="chart" style="height: 500px;">
          	<div id="myChart" :style="{width: '100%', height: '90%'}"></div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="缴费分析" name="second">
          <div class="chart">
          	<div id="myChart2" :style="{width: '100%', height: '90%'}"></div>
          </div>
          <div class="fee-Payment">
            <div>费用缴纳情况：总付款账单{{leaseRate.all}}，逾期付款账单{{leaseRate.lease}}，占比：{{leaseRate.rate}}%</div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="能耗分析" name="third">
          <div class="chart">
          	<div id="myChart3" :style="{width: '100%', height: '90%'}"></div>
          </div>
        </el-tab-pane>
      </el-tabs> -->
      <div id="charts" class="chart" style="display:none;">
        <div id="amountOfBill" :style="{width: '100%', height: '90%'}"></div>
      </div>
      <div v-show="!hasAmountOfBill">
        <div class="nodata">暂无数据</div>
      </div>
    </div>
  </div>
</template>
<script>
import context from '@/service'
import imgurl from '@/assets/pin.svg'
export default {
  name: 'overview',
  props: {
    tenantDetail: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      hasAmountOfBill: true,
      costStartDate: '',
      costEndDate: '',
      costTypeOptions: [],
      condition: 'MONTH',
      yearStart: '',
      yearEnd: '',
      feeTypeId: '',
      recordDate: '',
      leaseRate: {},
      billReport: {},
      startDate: '',
      endDate: '',
      activeName: 'first',
      energyDates: [],
      energyLegendData: [],
      energyAmounts: [],
      pickerBeginYearBefore: {
        disabledDate: time => {
          let endDateVal = this.yearEnd
          if (endDateVal) {
            let temp = new Date(endDateVal).getTime() - 11 * 365 * 24 * 60 * 60 * 1000
            return time.getTime() < new Date(temp).getTime() || time.getTime() > new Date(endDateVal).getTime()
          }
        }
      },
      pickerBeginYearAfter: {
        disabledDate: time => {
          let beginDateVal = this.yearStart
          if (beginDateVal) {
            let temp = new Date(beginDateVal).getTime() + 12 * 365 * 24 * 60 * 60 * 1000
            return time.getTime() > new Date(temp).getTime() || time.getTime() < new Date(beginDateVal).getTime()
          }
        }
      },
      pickerBeginDateBefore: {
        disabledDate: time => {
          let endDateVal = this.costEndDate
          if (endDateVal) {
            let temp = new Date(endDateVal).getTime() - 365 * 24 * 60 * 60 * 1000
            return time.getTime() < new Date(temp).getTime() || time.getTime() > new Date(endDateVal).getTime()
          }
        }
      },
      pickerBeginDateAfter: {
        disabledDate: time => {
          let beginDateVal = this.costStartDate
          if (beginDateVal) {
            let temp = new Date(beginDateVal).getTime() + 364 * 24 * 60 * 60 * 1000
            return time.getTime() > new Date(temp).getTime() || time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
          }
        }
      }
    }
  },
  watch: {
    tenantDetail: {
      handler: function (val, oldVal) {
        if (val) {
          this.restVal()
          this.getBill_lease_rate()
          // this.costProfile()
          this.getFeeType()
          this.getAmountOfBill()
          this.activeName = 'first'
        }
      }
    }
  },
  created () {
    this.restVal()
    this.getBill_lease_rate()
    this.getFeeType()
    // this.costProfile()
    this.getAmountOfBill()
  },
  mounted () {
    let dateArray = ['2019.01', '2019.02', '2019.03', '2019.04', '2019.05', '2019.06', '2019.07', '2019.08', '2019.09', '2019.10', '2019.11', '2019.12']
    // this.drawLine(dateArray, [])
  },
  methods: {
    restVal () {
      let date = new Date()
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      let d = date.getDate()
      m = m < 10 ? '0' + m : m
      d = d < 10 ? '0' + d : d
      let startDate = y + '-' + '01' + '-' + '01' + 'T00:00:00.000Z'
      let endDate = y + '-' + m + '-' + d + 'T23:59:59.000Z'
      this.recordDate = [startDate, endDate]
      this.startDate = startDate.substring(0, 10)
      this.endDate = endDate.substring(0, 10)
      this.costStartDate = startDate.substring(0, 10)
      this.costEndDate = endDate.substring(0, 10)
    },
    changeCondition (type) {
      this.condition = type
      this.getAmountOfBill()
    },
    daterangeChange (d) {
      if (!d) {
        this.startDate = ''
        this.endDate = ''
      } else {
        this.startDate = d[0]
        this.endDate = d[1]
      }
    },
    async getFeeType () {
      let result1 = await context.http.get('/uaa/api/paramet-managements/name', { name: '费用类型' })
      let result2 = await context.http.get('/uaa/api/paramet-managements/name', { name: '多经费用类型' })
      this.costTypeOptions = [...result1.data, ...result2.data]
    },
    query () {
      if (this.activeName === 'first') {
        this.getAmountOfBill()
      } else if (this.activeName === 'second') {
        this.paymentAnalysis()
      } else {
        this.getAmountOfBill()
      }
    },
    getBill_lease_rate () {
      context.http.get('/cms/api/bill_lease_rate', {tenantId: this.tenantDetail.id}).then(res => {
        this.leaseRate = res.data
      })
    },
    getAmountOfBill () {
      let startDate = ''
      let endDate = ''
      if (this.condition === 'MONTH') {
        startDate = this.costStartDate
        endDate = this.costEndDate
      } else {
        startDate = this.yearStart
        endDate = this.yearEnd
      }
      context.http.get('/cms/api/bills/statistics/byTenant', {tenantId: this.tenantDetail.id,
        feeTypeId: this.feeTypeId,
        dateType: this.condition,
        startDate: startDate,
        endDate: endDate}).then(res => {
          let charts = document.getElementById('charts')
          if (res.status === 200 && res.data.length > 0) {
            charts.style.display = 'block'
            this.hasAmountOfBill = true
            let datearr = []
            let collectionRate = []
            res.data.forEach(ele => {
              datearr.push(ele.x)
              collectionRate.push(ele.y)
            })
            this.amountOfBill(datearr, collectionRate)
          } else {
            charts.style.display = 'none'
            this.hasAmountOfBill = false
          }
        })
    },
    amountOfBill (dateArray, seriesData) {
        // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('amountOfBill'))
      myChart.clear()
        // 绘制图表
      var colors = ['#52C5CD']
      let option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          x: 'right',
          itemWidth: 20, // 标志图形的长度
          itemHeight: 10, // 标志图形的宽度
          data: ['账单金额'],
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
        xAxis: [
          {
            type: 'category',
            data: dateArray,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: '#DCDCDC', // 颜色
                width: 1 // 粗细
              }
            },
            axisLabel: {// x轴文字的配置
              interval: 0,
              // rotate: 40,
              show: true,
              textStyle: {
                color: '#666666'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            // max: 100,
            // min: 0,
            // scale: true,
            // interval: 1000,
            // splitNumber: 4,
            axisLine: {       // y轴
              'show': true,
              lineStyle: {
                color: '#DCDCDC', // 颜色
                width: 1 // 粗细
              }
            },
            axisLabel: {// x轴文字的配置
              interval: 0,
              // rotate: 40,
              show: true,
              textStyle: {
                color: '#666666'
              }
            },
            axisTick: {       // y轴刻度线
              'show': true,
              alignWithLabel: true
            },
            splitLine: {// 分割线配置
              show: true,
              lineStyle: {
                color: '#DCDCDC'
              }
            }
          }
        ],
        series: [
          {
            name: '账单金额',
            type: 'bar',
            barMaxWidth: '20',
            data: seriesData
          }
        ]
      }
      myChart.setOption(option)
    },
    costProfile () {
      context.http.get('/cms/api/bill_report/statisics', {tenantId: this.tenantDetail.id, startDate: this.startDate, endDate: this.endDate}).then(res => {
        let billReport = res.data
        let legendData = []
        let seriesData = []
        let energyLegendData = [] // 能耗分析数据
        let energyAmounts = []
        if (res.status === 200) {
          billReport.data.forEach(ele => {
            legendData.push(ele.feeTypeName)
            seriesData.push({
              name: ele.feeTypeName,
              type: 'bar',
              stack: '总量',
              label: {
                normal: {
                  show: true,
                  position: 'inside'
                }
              },
              height: '24px',
              data: ele.amounts
            })
            if (ele.feeTypeName === '电费' || ele.feeTypeName === '水费') {
              energyLegendData.push(ele.feeTypeName)
              energyAmounts.push({
                name: ele.feeTypeName,
                type: 'line',
                stack: '总量',
                data: ele.amounts,
                smooth: true
              })
            }
          })
          this.drawLine(billReport.dates, legendData, seriesData)
          this.energyDates = billReport.dates
          this.energyLegendData = energyLegendData
          this.energyAmounts = energyAmounts
        }
      })
    },
    paymentAnalysis () {
      context.http.get('/cms/api/bill_report/payStatisics', {tenantId: this.tenantDetail.id, startDate: this.startDate, endDate: this.endDate}).then(res => {
        if (res.status === 200) {
          let resData = res.data
          let seriesData = []
          let dateArray = []
          let expectedBillData = []
          let billNumberData = []
          let markPointData = []
          resData.forEach((ele, index) => {
            dateArray.push(ele.date)
            expectedBillData.push(ele.expectedBillNumber)
            billNumberData.push(ele.billNumber)
            if (ele.expectedBillNumber > 0) {
              markPointData.push({name: '逾期', value: '逾期' + ele.expectedDay + '天', xAxis: index, yAxis: ele.expectedBillNumber + ele.billNumber})
            }
          })
          this.drawLinePay(dateArray, billNumberData, expectedBillData, markPointData)
        }
      })
    },
    handleClick (tab, event) {
      if (this.activeName === 'first') {
        this.$nextTick(() => {
        })
      } else if (this.activeName === 'second') {
        this.$nextTick(() => {
          this.paymentAnalysis()
        })
      } else {
        this.$nextTick(() => {
          this.drawLineEnergy()
        })
      }
    },
    drawLine (dateArray, legendData, seriesData) {
        // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      myChart.clear()
        // 绘制图表
      var colors = ['#DD6243', '#54B0E8', '#62CA6D', '#66CEB5', '#9F88F3']
      let option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          x: 'right',
          data: legendData
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: dateArray
        },
        series: seriesData}
      myChart.setOption(option)
    },
    drawLinePay (dateArray, billNumberData, expectedBillData, markPointData) {
      let myChart = this.$echarts.init(document.getElementById('myChart2'))
      let colors = ['#54B0E8', '#E36849']
      let option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
          // formatter: function (params) {
          //   return '<p>' + dateArray[params[0].dataIndex] + '账单' + '</p>' + '<p>逾期:' + expectedBillData[params[0].dataIndex] + '笔' + '</p>' + '<p>未逾期:' + billNumberData[params[0].dataIndex] + '笔' + '</p>'
          // }
        },
        legend: {
          x: 'right',
          data: ['未逾期', '逾期']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: dateArray
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '未逾期',
            type: 'bar',
            stack: '广告',
            barWidth: 30,
            label: {
              normal: {
                show: true,
                position: 'inside',
                formatter: function (params) {
                  if (params.value > 0) {
                    return params.value
                  } else {
                    return ''
                  }
                }
              }
            },
            data: billNumberData
          },
          {
            name: '逾期',
            type: 'bar',
            stack: '广告',
            barWidth: 30,
            data: expectedBillData,
            label: {
              normal: {
                show: true,
                position: 'inside',
                formatter: function (params) {
                  if (params.value > 0) {
                    return params.value
                  } else {
                    return ''
                  }
                }
              }
            },
            markPoint: {
              symbol: 'image://' + imgurl, // 标记(气泡)的图形
              symbolSize: [80, 30], // 标记(气泡)的大小
              symbolOffset: [0, -18],
              data: markPointData
            }
          }
        ]
      }
      myChart.setOption(option)
    },
    drawLineEnergy () {
      let myChart = this.$echarts.init(document.getElementById('myChart3'))
      let colors = ['#F45727', '#3577F6']
      let option = {
        color: colors,
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          x: 'right',
          data: this.energyLegendData
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
          data: this.energyDates
        },
        yAxis: {
          type: 'value'
        },
        series: this.energyAmounts
      }
      myChart.setOption(option)
    }
  }
}
</script>

<style lang="scss">
  .statistical-reportForms{
    .fee-Payment{
      font-size: 12px;
      div {
        text-align: center;
      }
    }
    .trend{
      > div {
        padding: 20px;
      }
      .chart{
        width: 100%;
        height: 400px;
        background: #fff;
      }
      .nodata{
        color: #666;
        padding: 91px;
        text-align: center;
        font-size: 14px;
      }
    }
    .search-condition{
      div {
        &:first-child {
          margin: 0 0 0 15px;
        }
      }
    }
    .switch-select{
      background-color: #3577f6;
      border: 1px solid #3577f6!important;
      color: #fff;
    }
    .switch-btn{
      display: inline-flex;
      margin-right: 10px;
      span {
        display: inline-block;
        width: 42px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        cursor: pointer;
        border: 1px solid #DCDFE6;
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
    .el-tabs__item{
      color: #666!important;
    }
    .el-tabs__item.is-active {
      color: #3577f6!important;
    }
  }
</style>

