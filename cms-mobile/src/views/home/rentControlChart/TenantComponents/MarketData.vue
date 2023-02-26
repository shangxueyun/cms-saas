<template>
  <div class="BusinessData">
    <div class="title">
      <span>
        <!-- {{contractNO}}
        <i class="iconfont iconcms_shaixuan-xia"
           @click="showDatetime = true"></i> -->
      </span>
      <span class="tab">
        <span @click="changeTab(1)"
              class=""
              :class="{'active': active === 1}">日</span>
        <span @click="changeTab(2)"
              class=""
              :class="{'active': active === 2}">月</span>
      </span>
    </div>
    <div class="date-warp">
      <span @click="showDatetime2 = true"
            v-if="active === 1">{{dateMonth}}
        <i class="iconfont iconcms_shaixuan-xia"></i>
      </span>
      <span @click="showcalendarHandler"
            v-if="active === 2">{{dateYStart}} ～ {{dateYEnd}}
        <i class="iconfont iconcms_shaixuan-xia"></i>
      </span>
    </div>
    <div class=""
         v-show="hasAmountOfBill">
      <canvas id="myChartForYYSJ"
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
                  title="请选择合同"
                  @confirm="onConfirmFYTJ"
                  @cancel="showDatetime = false" />
    </van-popup>
    <!-- 按日 -->
    <van-popup v-model="showDatetime2"
               position="bottom"
               :style="{ height: '50%' }">
      <van-datetime-picker v-model="currentDate"
                           type="year-month"
                           title="选择年月"
                           :min-date="minDate"
                           :max-date="maxDate"
                           :formatter="formatter"
                           @cancel="showDatetime2 = false"
                           @confirm="confirmSelect" />
    </van-popup>
    <!-- 按月 -->
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
import { dateJson, dateYearJson } from './date'
import { toLocaleString } from '@/utils/validate.js'
import moment from 'moment-timezone'
export default {
  name: 'BusinessData',
  props: ['tenantID', 'contractDTOS'],
  watch: {
    // contractDTOS: {
    //   handler: function (val, oldval) {
    //     this.columns = val
    //     this.columns.forEach(ele => {
    //       ele.text = ele.contractNo
    //     })
    //     this.contractId = this.columns[0].id
    //     this.contractNO = this.columns[0].contractNo
    //     this.getBusinessData()
    //   },
    //   deep: true// 对象内部的属性监听，也叫深度监听
    // }
  },
  data () {
    return {
      active: 1,
      hasAmountOfBill: true,
      showDatetime: false,
      showDatetime2: false,
      showcalendar: false,
      columns: [],
      yearColumns: [],
      minDate: new Date(2000, 0, 1),
      maxDate: new Date(2030, 11, 1),
      currentDate: new Date(),
      dateMonth: moment(new Date()).format('YYYY-MM'),
      dateYStart: moment(new Date()).format('YYYY') + '-01',
      dateYEnd: moment(new Date()).format('YYYY-MM'),
      condition: 'DAY',
      contractNO: ''
    }
  },
  created () {
    console.log(this.contractDTOS)
    if (this.contractDTOS.length) {
      this.columns = this.contractDTOS
      this.columns.forEach(ele => {
        ele.text = ele.contractNo
      })
      this.contractId = this.columns[0].id
      this.contractNO = this.columns[0].contractNo
    }
    this.getBusinessData()
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
        this.condition = 'DAY'
      } else {
        this.condition = 'MONTH'
      }
      this.getBusinessData()
    },
    formatter (type, val) {
      if (type === 'year') {
        return `${val}年`
      } else if (type === 'month') {
        return `${val}月`
      }
      return val
    },
    confirmSelect (val) {
      this.showDatetime2 = false
      const val2 = moment(val).format('YYYY-MM')
      console.log(val2)
      this.dateMonth = val2
      this.getBusinessData()
    },
    showcalendarHandler () {
      this.yearColumns = [
        // 第一列
        {
          values: dateJson,
          defaultIndex: this.getdefaultIndex(this.dateYStart)
        },
        // 第二列
        {
          values: dateJson,
          defaultIndex: this.getdefaultIndex(this.dateYEnd)
        }
      ]
      this.showcalendar = true
    },
    getdefaultIndex (val) {
      return dateJson.indexOf(val)
    },
    onConfirmYear (date) {
      const [start, end] = date
      const startIdx = dateJson.indexOf(start)
      const endIdx = dateJson.indexOf(end)
      if (startIdx > endIdx) {
        this.$toast('结束日期不能小于开始日期')
        return
      }
      this.dateYStart = start
      this.dateYEnd = end
      this.showcalendar = false
      this.getBusinessData()
    },
    numberToMoney (n) {
      return String(Math.floor(n * 100) / 100).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    onConfirmFYTJ (value, index) {
      this.showDatetime = false
      this.contractNO = value.contractNo
      this.contractId = value.id
      this.getBusinessData()
    },
    formatDate (date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    },
    // 费用收缴图表
    initChar (data) {
      const chart = new this.$F2.Chart({
        id: 'myChartForYYSJ',
        pixelRatio: window.devicePixelRatio
      })
      const _this = this
      const defs = {
        x: {
          tickCount: 6,
          range: [0, 1],
          formatter: function formatter (time) {
            if (_this.condition === 'DAY') {
              return time.substring(5)
            } else if (_this.condition === 'MONTH') {
              return time
            }
          }
        },
        y: {
          tickCount: 5,
          alias: '实销售额',
          formatter: function formatter (val) {
            return toLocaleString(val) + '元'
          }
        }
      }
      chart.source(data, defs)
      chart.axis('x', {
        label: function label (text, index, total) {
          var textCfg = {}
          if (index === 0) {
            textCfg.textAlign = 'left'
          } else if (index === total - 1) {
            textCfg.textAlign = 'right'
          }
          return textCfg
        }
      })
      // Tooltip 配置
      chart.tooltip({
        triggerOn: ['touchstart'],
        showCrosshairs: true,
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
        offsetY: -23,
        offsetX: -20
      })
      chart
        .line()
        .position('x*y')
        .shape('smooth')
      chart
        .point()
        .position('x*y')
        .shape('smooth')
        .style({
          stroke: '#fff',
          lineWidth: 1
        })
      chart.render()
    },
    getBusinessData () {
      let condition = this.condition
      let bsStartDate = ''
      let bsEndDate = ''
      if (condition === 'DAY') {
        bsStartDate = this.dateMonth
      } else {
        bsStartDate = this.dateYStart
        bsEndDate = this.dateYEnd
      }
      context.http.get('cms/api/turnovers/statistics/byTenant', {
        tenantId: this.tenantID,
        dateType: this.condition,
        startDate: bsStartDate,
        endDate: bsEndDate
      }).then(res => {
        let charts = document.getElementById('myChartForYYSJ')
        if (res.status === 200 && res.data.length > 0) {
          charts.style.display = 'block'
          this.hasAmountOfBill = true
          const data = res.data
          // data.forEach(ele => {
          //   ele.x = ele.x.substring(0, 7)
          // })
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
  height: rem(190) !important;
}
.nodata {
  color: #666;
  padding: rem(40);
  text-align: center;
  font-size: rem(14);
}
.BusinessData {
  background: #fff;
}
.title {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0.35rem;
  > span {
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
    color: #18191a;
    font-size: rem(14);
    border-radius: rem(2);
    border: rem(1) solid #d9d9d9;
    &:last-child {
      margin-left: rem(-1);
    }
  }
  .active {
    color: #0139a4;
    font-weight: bold;
    background-color: #eef4ff;
    border: rem(1) solid #c7d9ff;
  }
}
.date-warp {
  font-size: rem(12);
  text-align: right;
  margin-right: rem(14);
  margin-bottom: rem(10);
  i {
    font-size: rem(12);
  }
}
.title {
  i {
    font-size: rem(12);
  }
}
</style>
