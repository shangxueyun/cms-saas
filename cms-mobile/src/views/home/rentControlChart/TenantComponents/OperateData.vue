<template>
  <div class="OperateData">
    <div class="title">
      <span>{{parametType}}
        <i class="iconfont iconcms_shaixuan-xia"
           @click="showDatetime = true"></i>
      </span>
      <span @click="showcalendarHandler">{{dateYStart}}
        <i class="iconfont iconcms_shaixuan-xia"></i>
      </span>
    </div>
    <div>
      <canvas id="myChartForJYSJ"
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
import { dateYearJson1 } from './date'
import moment from 'moment-timezone'
export default {
  name: 'OperateData',
  props: ['tenantID'],
  data () {
    return {
      active: 1,
      hasAmountOfBill: false,
      showDatetime: false,
      showCalendar: false,
      showcalendar: false,
      columns: [],
      yearColumns: [],
      dateYStart: moment().get('year'),
      parametId: 'businessIncome',
      parametType: '营业收入',
      condition: 'MONTH',
      currentDateEnd: '',
      collectionProjectList: [
        { value: '营业收入', id: 'businessIncome' },
        { value: '净利润', id: 'netProfit' },
        { value: '总资产', id: 'totalAssets' },
        { value: '净资产', id: 'netAssets' },
        { value: '净利率', id: 'netRate' },
        { value: '毛利率', id: 'grossRate' }
      ]
    }
  },
  computed: {

  },
  created () {
    this.getCollectionProject()
  },
  mounted () {
    this.$nextTick(() => {
      this.initChar()
    })
  },
  methods: {
    showcalendarHandler () {
      this.yearColumns = [
        // 第一列
        {
          values: dateYearJson1,
          defaultIndex: this.getdefaultIndex(this.dateYStart)
        }
      ]
      this.showcalendar = true
    },
    getdefaultIndex (val) {
      return dateYearJson1.indexOf(val)
    },
    onConfirmYear (date) {
      const start = date
      const startIdx = dateYearJson1.indexOf(start)
      this.dateYStart = start[0]
      this.showcalendar = false
      this.getBusinessData()
    },
    numberToMoney (n) {
      return String(Math.floor(n * 100) / 100).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    async getCollectionProject () {
      this.columns = this.collectionProjectList
      this.columns.forEach(ele => {
        ele.text = ele.value
      })
      this.parametType = this.columns[0].value
      this.parametId = this.columns[0].id
      this.getBusinessData()
    },
    oncancelFYTJ () {
      this.showDatetime = false
      this.getBusinessData()
    },
    onConfirmFYTJ (value, index) {
      this.showDatetime = false
      this.parametType = value.value
      this.parametId = value.id
      this.getBusinessData()
    },
    formatDate (date) {
      return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate()}`
    },
    // 费用收缴图表
    initChar (data) {
      const chart = new this.$F2.Chart({
        id: 'myChartForJYSJ',
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
        content: _this.unitFormat(),
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
        .color('name', ['#3F79F7'])
        .adjust({
          type: 'dodge',
          marginRatio: 0.4 // 设置分组间柱子的间距
        })
      chart.render()
    },
    unitFormat () {
      let unit = this.parametId === 'netRate' || this.parametId === 'grossRate' ? '单位：%' : '单位：元'
      return unit
    },
    getBusinessData () {
      context.http.get('cms/api/tenantBusiness/chart', {
        tenantId: this.tenantID,
        year: this.dateYStart
        // parametId: this.parametId
      }).then(res => {
        let charts = document.getElementById('myChartForJYSJ')
        if (res.status === 200 && res.data.length > 0) {
          charts.style.display = 'block'
          this.hasAmountOfBill = true
          const data = res.data
          let unit = this.parametId === 'netRate' || this.quarter === 'grossRate' ? '%' : '元'
          data.forEach(ele => {
            ele.name = this.parametType
            ele.x = ele.year + '-' + ele.quarter + '季度'
            ele.y = ele[this.parametId]
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
  height: rem(190) !important;
}
.nodata {
  color: #666;
  padding: rem(40);
  text-align: center;
  font-size: rem(14);
}
.OperateData {
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
