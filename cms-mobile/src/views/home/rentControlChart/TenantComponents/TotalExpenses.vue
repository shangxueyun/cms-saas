<template>
  <div class="TotalExpenses">
    <div class="title">
      <span>{{feeType}}
        <i class="iconfont iconcms_shaixuan-xia" @click="showDatetime = true"></i>
      </span>
      <span class="tab">
        <span @click="changeTab(1)" class="" :class="{'active': active === 1}">月</span>
        <span @click="changeTab(2)" class="" :class="{'active': active === 2}">年</span>
      </span>
    </div>
    <div class="date-warp">
      <span v-if="active === 1">
        <span @click="showStartPicker = true">{{startDate}}</span> ～ <span @click="showEndPicker = true">{{endDate}}</span>
        <i class="iconfont iconcms_shaixuan-xia"></i>
      </span>
      <span @click="showcalendarHandler" v-if="active === 2">{{dateYStart}} ～ {{dateYEnd}}
        <i class="iconfont iconcms_shaixuan-xia"></i>
      </span>
    </div>
    <div>
      <canvas id="myChartForFYTJ"
              class="myChart"></canvas>
    </div>
    <div v-show="!hasAmountOfBill">
      <div class="nodata">暂无数据</div>
    </div>

    <!-- 类型 -->
    <van-popup v-model="showDatetime"
               position="bottom"
               :style="{ height: '50%' }">
      <van-picker show-toolbar
                  :columns="columns"
                  :default-index="0"
                  title="请选择费用类型"
                  @confirm="onConfirmFYTJ"
                  @cancel="oncancelFYTJ" />
    </van-popup>
    <!-- 按月 -->
    <!-- 开始 -->
    <van-popup v-model="showStartPicker"
               position="bottom"
               :style="{ height: '50%' }">
    <!-- <van-calendar v-model="showCalendar" type="range" :default-date="defaultDate" @confirm="onConfirm" :min-date="minDate" /> -->
      <van-datetime-picker
        v-model="currentDateStart"
        type="date"
        title="选择开始时间"
        :min-date="startMonthMinDate"
        :max-date="startMonthMaxDate"
        @confirm="onDateStart"
        @cancel="showStartPicker = false"
      />
    </van-popup>
    <!-- 结束 -->
    <van-popup v-model="showEndPicker"
               position="bottom"
               :style="{ height: '50%' }">
    <!-- <van-calendar v-model="showCalendar" type="range" :default-date="defaultDate" @confirm="onConfirm" :min-date="minDate" /> -->
      <van-datetime-picker
        v-model="currentDateEnd"
        type="date"
        title="选择结束时间"
        :min-date="endMonthMinDate"
        :max-date="endMonthMaxDate"
        @confirm="onDateEnd"
        @cancel="showEndPicker = false"
      />
    </van-popup>
    <!-- 按年 -->
    <van-popup v-model="showcalendar"
               position="bottom"
               :style="{ height: '50%' }">
      <van-picker show-toolbar
                  title="选择时间"
                  :columns="yearColumns"
                  @confirm="onConfirmYear"
                  @cancel="showcalendar = false" />
    </van-popup>
  </div>
</template>
<script>
import context from '@/service'
import { dateYearJson } from './date'
import moment from 'moment-timezone'
export default {
  name: 'TotalExpenses',
  props: ['tenantID'],
  data () {
    return {
      active: 1,
      hasAmountOfBill: false,
      showDatetime: false,
      showCalendar: false,
      showcalendar: false,
      showStartPicker: false,
      showEndPicker: false,
      columns: ['全部', '电费', '水费'],
      yearColumns: [],
      minDate: new Date(2010, 0, 1),
      startDate: moment(new Date()).format('YYYY') + '-01' + '-01',
      endDate: moment(new Date()).format('YYYY-MM-DD'),
      startDateFormat: new Date(),
      endDateFormat: new Date(),
      defaultDate: [],
      dateYStart: moment(new Date()).format('YYYY'),
      dateYEnd: moment(new Date()).format('YYYY'),
      feeTypeId: '',
      feeType: '全部',
      condition: 'MONTH',
      currentDateStart: '',
      currentDateEnd: ''
    }
  },
  computed: {
    startMonthMinDate () {
      return new Date(this.endDateFormat.getTime() - 10 * 365 * 24 * 60 * 60 * 1000)
    },
    startMonthMaxDate () {
      return this.endDateFormat
    },
    endMonthMinDate () {
      return this.startDateFormat
    },
    endMonthMaxDate () {
      return new Date(this.startDateFormat.getTime() + 10 * 365 * 24 * 60 * 60 * 1000)
    }
  },
  created () {
    this.getFeeType()
    this.getAmountOfBill()
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    // this.defaultDate = [new Date(year, 0, 1), new Date(year, month, day)]
    this.currentDateStart = new Date(year, 0, 1)
    this.currentDateEnd = new Date(year, month, day)
    this.startDateFormat = this.currentDateStart
    this.endDateFormat = this.currentDateEnd
  },
  mounted () {
    this.$nextTick(() => {
      this.initChar()
    })
  },
  methods: {
    changeTab (index) {
      this.active = index
      if (index === 1) {
        this.condition = 'MONTH'
      } else {
        this.condition = 'YEAR'
      }
      this.getAmountOfBill()
    },
    showcalendarHandler () {
      this.yearColumns = [
        // 第一列
        {
          values: dateYearJson,
          defaultIndex: this.getdefaultIndex(this.dateYStart)
        },
        // 第二列
        {
          values: dateYearJson,
          defaultIndex: this.getdefaultIndex(this.dateYEnd)
        }
      ]
      this.showcalendar = true
    },
    getdefaultIndex (val) {
      return dateYearJson.indexOf(val)
    },
    onConfirmYear (date) {
      const [start, end] = date
      const startIdx = dateYearJson.indexOf(start)
      const endIdx = dateYearJson.indexOf(end)
      if (startIdx > endIdx) {
        this.$toast('结束日期不能小于开始日期')
        return
      }
      this.dateYStart = start
      this.dateYEnd = end
      this.showcalendar = false
      this.getAmountOfBill()
    },
    numberToMoney (n) {
      return String(Math.floor(n * 100) / 100).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    oncancelFYTJ () {
      this.showDatetime = false
      this.feeType = '全部'
      this.getAmountOfBill()
    },
    onConfirmFYTJ (value, index) {
      this.showDatetime = false
      this.feeType = value.value
      this.feeTypeId = value.id
      this.getAmountOfBill()
    },
    formatDate (date) {
      return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate()}`
    },
    onConfirm (date) {
      const [start, end] = date
      this.showCalendar = false
      this.startDate = this.formatDate(start)
      this.endDate = this.formatDate(end)
      this.date = `${this.formatDate(start)} - ${this.formatDate(end)}`
      this.getAmountOfBill()
    },
    onDateStart (date) {
      this.startDateFormat = date
      this.startDate = moment(date).format('YYYY-MM-DD')
      this.showStartPicker = false
      this.getAmountOfBill()
    },
    onDateEnd (date) {
      this.endDateFormat = date
      this.endDate = moment(date).format('YYYY-MM-DD')
      this.showEndPicker = false
      this.getAmountOfBill()
    },
    async getFeeType () {
      let result1 = await context.http.get('uaa/api/paramet-managements/name', { name: '费用类型' })
      let result2 = await context.http.get('uaa/api/paramet-managements/name', { name: '多经费用类型' })
      let df = [{id: '', value: '全部'}]
      this.columns = [...df, ...result1.data, ...result2.data]
      this.columns.forEach(ele => {
        ele.text = ele.value
      })
    },
    // 费用收缴图表
    initChar (data) {
      const chart = new this.$F2.Chart({
        id: 'myChartForFYTJ',
        pixelRatio: window.devicePixelRatio
      })
      const _this = this
      chart.source(data, {
        x: {
          // tickCount: 6 // 区间，写几个就有几个区间
        },
        y: {
          formatter: function formatter (val) {
            return _this.numberToMoney(val)
          }
        }
      })
      chart.legend({
        align: 'right',
        itemWidth: null // 图例项按照实际宽度渲染
      })
      chart.tooltip({
        triggerOn: ['touchstart'],
        showTitle: true, // 展示  tooltip 的标题
        layout: 'vertical',
        offsetY: 20,
        background: {
          radius: 2,
          fill: '#656464',
          opacity: 0.1,
          padding: [6, 10]
        },
        titleStyle: {
          fill: '#656464'
        }, // tooltip 标题的文本样式配置，showTitle 为 false 时不生效
        nameStyle: {
          fill: '#656464'
        }, // tooltip name 项的文本样式配置
        valueStyle: {
          fill: '#656464'
        } // tooltip value 项的文本样式配置
      })
      // 辅助标记
      chart.guide().text({
        position: ['min', 'max'],
        content: '单位：元',
        style: {
          fill: '#858C94', // 文本颜色
          textBaseline: 'middle',
          textAlign: 'start'
        },
        offsetY: -20,
        offsetX: -25
      })
      chart
        .interval()
        .position('x*y')
        .style({ radius: [2, 2, 0, 0] })
        .size(10)
        .color('name', ['#52C5CD'])
        .adjust({
          type: 'dodge',
          marginRatio: 0.4 // 设置分组间柱子的间距
        })
      chart.render()
    },
    getAmountOfBill () {
      let startDate = ''
      let endDate = ''
      if (this.condition === 'MONTH') {
        startDate = this.startDate
        endDate = this.endDate
      } else {
        startDate = this.dateYStart
        endDate = this.dateYEnd
      }
      context.http.get('cms/api/bills/statistics/byTenant', {tenantId: this.tenantID,
        feeTypeId: this.feeTypeId,
        dateType: this.condition,
        startDate: startDate,
        endDate: endDate}).then(res => {
          let charts = document.getElementById('myChartForFYTJ')
          if (res.status === 200 && res.data.length > 0) {
            charts.style.display = 'block'
            this.hasAmountOfBill = true
            const data = res.data
            data.forEach(ele => {
              ele.name = '账单金额'
              if (ele.x.length > 5) {
                ele.x = ele.x.substring(5) + '月'
              }
            })
            this.initChar(data)
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
@import "../../../../style/config";
  .myChart {
    width: 100%;
    height: rem(190)!important;
  }
  .nodata{
    color: #666;
    padding: rem(40);
    text-align: center;
    font-size: rem(14);
  }
  .TotalExpenses{
    background: #fff;
    margin-bottom: rem(10);
  }
  .title {
    display: flex;
    justify-content: space-between;
    padding: 0.25rem 0.35rem;
    >span {
      &:first-child {
        font-size: rem(17);
        font-weight: bold;
      }  
    }
  }
  .tab {
    display: flex;
    span {
      display: inline-block;
      width: rem(40);
      text-align: center;
      height: rem(20);
      line-height: rem(20);
      cursor: pointer;
      background-color: #fff;
      color: #18191A;
      font-size: rem(14);
      border-radius: rem(2);
      border: rem(1) solid #D9D9D9;
      &:last-child {
        margin-left: rem(-1);
      }
    }
    .active {
      color: #0139A4;
      font-weight: bold;
      background-color: #eef4ff;
      border: rem(1) solid #C7D9FF;
    }
  }
  .date-warp{
    font-size: rem(12);
    text-align: right;
    margin-right: rem(14);
    margin-bottom: rem(10);
    i {
      font-size: rem(12);
    }
  }
  .title{
    i {
      font-size: rem(12);
    }
  }
</style>
