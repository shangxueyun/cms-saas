<template>
  <div class="flow-list financialStatements">
    <span class="page_head_title">费用收缴</span>
    <ul class="default_tab_block">
      <li v-if="hasAuthority('02030301')"
          class="active">
        <span>费用收缴统计</span>
      </li>
      <li v-if="hasAuthority('02030320')"
          @click="switchover('tenantBills')">
        <span>客户账单</span>
      </li>
      <li v-if="hasAuthority('02030302')"
          @click="switchover('billList')">
        <span>账单列表</span>
      </li>
      <li v-if="hasAuthority('02030323')"
          @click="switchover('flow')">
        <span>客户流水</span>
      </li>
      <li v-if="hasAuthority('02030314')"
          @click="switchover('flowBank')">
        <span>银行流水</span>
      </li>
    </ul>
    <div class="pl-content">
      <div class="search-bar">
        <div>
          <div class="switch-btn">
            <span @click="changeCondition('MONTH')"
                  :class="{'switch-select': condition === 'MONTH'}">月</span>
            <span @click="changeCondition('YEAR')"
                  :class="{'switch-select': condition === 'YEAR'}">年</span>
          </div>
          <!-- <el-select style="margin-right:0;"
                     clearable
                     multiple
                     collapse-tags
                     v-model="projectManagementId"
                     placeholder="项目">
            <el-option v-for="item in projectManagement"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select> -->
          <el-cascader :show-all-levels="false"
                       :options="options"
                       :props="props"
                       v-model="projectData"
                       @change="cascaderChange"
                       collapse-tags></el-cascader>
          <el-date-picker style="margin-right:10px;"
                          v-show="condition === 'MONTH'"
                          v-model="monthDateArr"
                          type="monthrange"
                          value-format="yyyy-MM"
                          start-placeholder="开始月份"
                          end-placeholder="结束月份"
                          :editable="false"
                          :clearable="false">
          </el-date-picker>
          <el-date-picker style="margin-right:0;"
                          v-show="condition === 'YEAR'"
                          v-model="startYear"
                          type="year"
                          value-format="yyyy"
                          placeholder="开始年份"
                          :editable="false"
                          :clearable="false">
          </el-date-picker>
          <div class="split">-</div>
          <el-date-picker v-show="condition === 'YEAR'"
                          v-model="endYear"
                          type="year"
                          value-format="yyyy"
                          placeholder="结束年份"
                          :editable="false"
                          :clearable="false">
          </el-date-picker>

          <el-select style="margin-right:0;"
                     :clearable="true"
                     multiple
                     collapse-tags
                     v-model="feeType"
                     placeholder="选择费用类型">
            <el-option v-for="item in options1"
                       :key="item.id"
                       :label="item.value"
                       :value="item.id">
            </el-option>
          </el-select>
          <div @click="searchBill"
               class="query-btn">查询</div>
        </div>
      </div>
      <div class="financial-ctn">
        <!--<div class="changeTab">
          <span v-for="item in tabList" @click="currentTab = item.value" :class="currentTab === item.value ? 'active' : ''">{{item.label}}</span>
        </div>-->
        <div class="financial">
          <div class="chart">
            <div id="myChart"
                 :style="{width: '100%', height: '90%'}"></div>
          </div>
        </div>
        <div class="financial">
          <div class="plc-table">
            <el-table :data="tableData"
                      show-summary
                      :summary-method="getSummaries"
                      style="width: 100%">

              <el-table-column prop="x"
                               label="时间"
                               align="center"></el-table-column>
              <el-table-column prop="amount"
                               label="账单金额"
                               align="center"
                               :formatter="formatterAmount"></el-table-column>
              <el-table-column prop="reductionAmount"
                               label="减免金额"
                               align="center"
                               :formatter="formatterReductionAmount"></el-table-column>
              <el-table-column prop="sjAmount"
                               label="已收金额"
                               align="center"
                               :formatter="formatterSjAmount"></el-table-column>
              <el-table-column prop="qsAmount"
                               label="欠收金额"
                               align="center"
                               :formatter="formatterQsAmount"></el-table-column>
              <el-table-column prop="rate"
                               label="收缴率"
                               align="center"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import context from '@/service'
import moment from 'moment'
import { toLocaleString } from '@/utils/validate.js'
export default {
  name: 'financialState',
  components: {},
  data () {
    return {
      monthDateArr: [],
      tableData: [],
      projectManagementId: [], // 商圈
      projectManagement: [],
      currentPage: 1,
      pgNum: 1,
      total: 0,
      pgSize: 15,
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
      ],
      tabList: [
        {
          value: 'chart',
          label: '图表视图'
        },
        {
          value: 'list',
          label: '列表视图'
        }
      ],
      currentTab: 'chart',
      feeType: [],
      options1: [],
      startYear: '',
      endYear: '',
      condition: 'MONTH',
      projectData: [],
      props: { multiple: true, emitPath: false, children: 'child', value: 'id', label: 'referred' },
      options: []
    }
  },
  created () {
    this.initTime()
    let now = new Date()
    let next = new Date()
    this.startYear = (Number(now.getFullYear()) - 4) + ''
    this.endYear = now.getFullYear() + ''
    this.getProjectOptions()
    this.getFeeType()
    this.query()
  },
  mounted () {
    let dateArray = ['2019.01', '2019.02', '2019.03', '2019.04', '2019.05', '2019.06', '2019.07', '2019.08', '2019.09', '2019.10', '2019.11', '2019.12']
    this.drawLine(dateArray, [], [], [], 50000)
  },
  methods: {
    initTime () {
      let s = moment().startOf('year').format('YYYY-MM-DD')
      let e = moment().endOf('month').format('YYYY-MM-DD')
      this.monthDateArr = [s, e]
      // console.log(this.monthDateArr)
    },
    async query () {
      let startTime
      let endTime
      let dateType
      if (this.condition === 'MONTH') {
        dateType = 'MONTH'
        startTime = moment(this.monthDateArr[0]).startOf('month').format('YYYY-MM-DD')
        endTime = moment(this.monthDateArr[1]).endOf('month').format('YYYY-MM-DD')
        console.log(moment(endTime).diff(moment(startTime), 'months'))
        if (moment(endTime).diff(moment(startTime), 'months') >= 12) {
          this.$message.error('时间范围不可超过一年，请重新选择')
          return
        }
      } else {
        dateType = 'YEAR'
        startTime = this.startYear
        endTime = this.endYear
        if (moment(endTime).diff(moment(startTime), 'years') >= 12) {
          this.$message.error('时间范围超过12年，请重新选择')
          return
        }
      }
      let result = await context.http.get('cms/api/reportColl/statistics/byProject', { projectId: this.projectData.toString(), startDate: startTime, endDate: endTime, feeTypeId: this.feeType.toString(), dateType: dateType })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      let dateArray = []
      let shishou = []
      let shouru = []
      let jianmian = []
      let completeRate = []
      let max = ''
      result.data.forEach(ele => {
        dateArray.push((ele.x).substring(0, 7))
        shishou.push(ele.sjAmount)
        shouru.push(ele.amount)
        jianmian.push(ele.reductionAmount)
        completeRate.push(ele.rate)
      })
      let allAry = [...shishou, ...shouru]
      let totalMax = Math.max.apply(null, allAry)
      if (dateArray.length === 0) {
        dateArray = ['2019.01', '2019.02', '2019.03', '2019.04', '2019.05', '2019.06', '2019.07', '2019.08', '2019.09', '2019.10', '2019.11', '2019.12']
        totalMax = 50000
      }
      this.drawLine(dateArray, shishou, shouru, jianmian, completeRate, totalMax)
    },
    drawLine (dateArray, shishou, shouru, jianmian, completeRate, max) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      myChart.clear()
      // 绘制图表
      var colors = ['#57BD93', '#FBB947', '#4179F5']
      let option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function (params) {
            return '<p>' + dateArray[params[0].dataIndex] + '</p>' + '<p>账单金额：' + toLocaleString(shouru[params[0].dataIndex]) + '</p>' + '<p>已收金额：' + toLocaleString(shishou[params[0].dataIndex]) + '</p>' + '<p>减免金额：' + toLocaleString(jianmian[params[0].dataIndex]) + '</p>' + '<p>收缴率：' + completeRate[params[0].dataIndex] + '</p>'
          }
        },
        grid: {
          top: '8%',
          left: '1%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          x: 'right',
          y: 'top',
          bottom: '0px',
          data: ['已收金额', '减免金额', '账单金额']
        },
        xAxis: [
          {
            type: 'category',
            name: '日期',
            axisTick: {
              alignWithLabel: true
            },
            data: dateArray,
            nameTextStyle: {
              color: '#666666'
            },
            axisLabel: {
              color: '#666666'
            },
            axisLine: {
              lineStyle: {
                color: '#EEEEEE'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '金额(元)',
            min: 0,
            position: 'left',
            nameTextStyle: {
              color: '#666666'
            },
            axisLabel: {
              formatter: '{value}',
              color: '#666666'
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#EEEEEE'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#EEEEEE'
              }
            }
          }
        ],
        series: [
          {
            name: '已收金额',
            type: 'bar',
            stack: 'num',
            data: shishou,
            barMaxWidth: '30',
            itemStyle: {
              normal: {
                barBorderRadius: [0, 0, 0, 0]
              }
            }
          },
          {
            name: '减免金额',
            type: 'bar',
            stack: 'num',
            data: jianmian,
            barMaxWidth: '30',
            itemStyle: {
              normal: {
                barBorderRadius: [4, 4, 0, 0]
              }
            }
          },
          {
            name: '账单金额',
            type: 'bar',
            data: shouru,
            barMaxWidth: '30',
            itemStyle: {
              normal: {
                barBorderRadius: [4, 4, 0, 0]
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      const sumsNum = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          // sums[index] += ' 元'
          sumsNum[index] = sums[index]
          sums[index] = toLocaleString(sums[index])
        } else {
          sums[index] = 'N/A'
        }
        if (index === 5) { // 收缴率总计
          let reductionAmountArr = data.map((item, index) => { // 总的减免
            return item.reductionAmount
          })
          if (reductionAmountArr.length > 0) {
            let total = reductionAmountArr.reduce((a, b) => {
              return a + b
            })
            if (Number(sumsNum[3]) / Number(sumsNum[1])) {
              // sums[index] = ((Number(sumsNum[3]) / (Number(sumsNum[1]) - total)) * 100).toFixed(2) + '%'
              sums[index] = parseInt(Math.floor((Number(sumsNum[3]) / (Number(sumsNum[1]) - total)) * 10000)) / 100 + '%'
            } else {
              sums[index] = '0.00%'
            }
            return
          }
        }
      })
      return sums
    },
    formatterAmount (row, column) {
      return toLocaleString(row.amount)
    },
    formatterSjAmount (row, column) {
      return toLocaleString(row.sjAmount)
    },
    formatterQsAmount (row, column) {
      return toLocaleString(row.qsAmount)
    },
    formatterReductionAmount (row, column) {
      return toLocaleString(row.reductionAmount)
    },
    changeCondition (type) {
      this.condition = type
      this.query()
    },
    async getProjectOptions () {
      // let result = await context.http.get('cms/api/project-managements', { page: 0, size: 100, sort: 'desc', useStatus: 'USING' })
      // this.projectManagement = result.data
      let result = await context.http.get('cms/api/project-managements/types/tree?useStatus=USING')
      result.data.forEach(item => {
        item.id = item.projectManagementTypeId
        item.referred = item.projectManagementTypeName
      })
      this.options = result.data
    },
    getCurrentMonthLastDay () {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      var day = new Date(year, month, 0)
      return year + '-' + month + '-' + day.getDate()
    },
    checkedDate (row, column) {
      if (row.date) {
        return row.date.substring(0, 7)
      }
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    switchover (state) {
      if (state === 'financial') {
        this.$router.push({ name: 'financialState' })
      } else if (state === 'billList') {
        this.$router.push({ name: 'billList' })
      } else if (state === 'tenantBills') {
        this.$router.push({ name: 'tenantBills' })
      } else if (state === 'flow') {
        this.$router.push({ name: 'flow' })
      } else if (state === 'flowBank') {
        this.$router.push({ name: 'flowBank' })
      }
    },
    searchBill () {
      console.log(this.projectData)
      this.query()
    },
    cascaderChange (val) {
      console.log(val)
    },
    async getFeeType () {
      let result1 = await context.http.get('/uaa/api/paramet-managements/name', { name: '费用类型' })
      let result2 = await context.http.get('/uaa/api/paramet-managements/name', { name: '多经费用类型' })
      this.options1 = result1.data.concat(result2.data)
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    }
  }
}
</script>
<style lang="scss">
.financialStatements {
  .el-range-separator,
  .el-date-editor .el-range__icon {
    height: auto !important;
  }
}
.flow-list {
  .el-cascader {
    height: 32px;
    line-height: 32px;
    .el-cascader__tags {
      flex-wrap: nowrap;
      .el-tag:first-child > span {
        width: 60px;
      }
    }
    .el-input__inner {
      height: 32px !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.flow-list {
  font-size: 14px;
  background-color: #f9f9f9;
  .pl-content {
    width: 100%;
    margin: 0 auto;
    .search-bar {
      .switch-btn {
        display: inline-flex;
        margin-right: 10px;
        span {
          display: inline-block;
          width: 42px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          cursor: pointer;
          border: 1px solid #dcdfe6;
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
        border: 1px solid #3577f6 !important;
        color: #fff;
      }
      .split {
        color: #333333;
        display: block;
        width: 20px;
        text-align: center;
        margin: 0;
        /*line-height: 70px;*/
      }
      > div {
        display: flex;
        align-items: center;
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
      .el-cascader {
        height: 32px;
        line-height: 32px;
        .el-input__inner {
          height: 32px !important;
        }
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
      margin-top: -20px;
      position: relative;
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
  }
  .ctc-foot {
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    padding: 40px 0 30px 0px;
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      background-color: #2f3f48;
      color: #fff;
    }
    .el-pagination.is-background .el-pager li:not(.disabled):hover {
      color: #999;
    }
  }
  .pagingnum {
    font-size: 14px;
    text-align: center;
    color: #777;
    select {
      width: 70px;
      height: 28px;
      border-radius: 2px;
    }
  }
  .addProjectdialog .el-dialog {
    width: 1000px;
    margin-top: 5vh !important;
  }
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #d9dce2;
  }
  .el-table__row div {
    white-space: nowrap;

    img {
      width: 97px;
      height: 80px;
    }
    .buildingImage {
      width: 120px;
      margin: 0 auto;
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
}
.menu {
  height: 62px;
  line-height: 62px;
  border-bottom: 1px solid #eeeeee;
  margin-top: 15px;
  margin-bottom: 20px;
  background-color: #ffffff;
  // padding-left: 20px;
  span {
    display: inline-block;
    width: 200px;
    height: 62px;
    text-align: center;
    cursor: pointer;
    &.active {
      border-bottom: 3px solid #3577f6;
      color: #3577f6;
    }
  }
}
.financial-ctn {
  width: 100%;
  background: #fff;
  padding: 18px;
  box-sizing: border-box;
  box-shadow: 1px 2px 5px #eee;
  .changeTab {
    width: 100%;
    height: 38px;
    display: flex;
    span {
      display: block;
      width: 176px;
      height: 36px;
      border: 1px solid #3577f6;
      border-radius: 5px;
      color: #3577f6;
      text-align: center;
      line-height: 36px;
      font-size: 14px;
      background: #fff;
      cursor: pointer;
    }
    span:first-child {
      border-right: 0;
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
    }
    span:last-child {
      border-left: 0;
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
    }
    .active {
      background: #3577f6;
      color: #fff;
    }
  }
  .financial {
    .chart {
      width: 100%;
      height: 600px;
      background: #fff;
    }
  }
}
</style>

