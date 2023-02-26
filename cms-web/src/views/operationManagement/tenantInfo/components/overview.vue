<template>
  <div>
    <div class="fee-Payment">
      <div>费用缴纳信息</div>
      <div>费用缴纳情况：总付款账单{{leaseRate.all}}，逾期付款账单{{leaseRate.lease}}，占比：{{leaseRate.rate}}%</div>
    </div>
    <div class="trend">
      <div style="background-color: #fafafa;">电费趋势</div>
      <div class="chart">
        <div id="myChart" :style="{width: '100%', height: '90%'}"></div>
      </div>
    </div>
  </div>
</template>
<script>
import context from '@/service'
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
      leaseRate: {},
      billReport: {}
    }
  },
  watch: {
    tenantDetail: {
      handler: function () {
        this.getBill_lease_rate()
        this.bill_report()
      }
    }
  },
  created () {
    this.getBill_lease_rate()
    this.bill_report()
  },
  mounted () {
    let dateArray = ['2019.01', '2019.02', '2019.03', '2019.04', '2019.05', '2019.06', '2019.07', '2019.08', '2019.09', '2019.10', '2019.11', '2019.12']
    this.drawLine(dateArray, [])
  },
  methods: {
    drawLine (dateArray, shishou) {
        // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      myChart.clear()
        // 绘制图表
      var colors = ['#3175D2']
      let option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          },
          formatter: function (params) {
            return '<p>电费:' + shishou[params[0].dataIndex] + '</p>'
          }
        },
        grid: {
          top: '50px',
          left: '6%',
          right: '15px',
          bottom: '50px'
        },
        legend: {
          x: 'center',
          y: 'bottom',
          data: ['电费趋势']
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            data: dateArray
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '金额(元)',
            min: 0,
            position: 'left',
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '电费趋势',
            type: 'bar',
            data: shishou
          }
        ]
      }
      myChart.setOption(option)
    },
    getBill_lease_rate () {
      context.http.get('/cms/api/bill_lease_rate', {tenantId: this.tenantDetail.id}).then(res => {
        this.leaseRate = res.data
      })
    },
    bill_report () {
      context.http.get('/cms/api/bill_report', {tenantId: this.tenantDetail.id}).then(res => {
        this.billReport = res.data
        let x = []
        let y = []
        this.billReport.forEach(ele => {
          x.push(ele.date)
        })
        this.billReport.forEach(ele => {
          y.push(ele.amount)
        })
        this.drawLine(x, y)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .fee-Payment{
    font-size: 12px;
    border: 1px solid rgba(241,241,241,1);
    div {
      padding: 10px;
      &:first-child {
        background-color: #fafafa;
      }
      &:last-child {
        // border-top: 1px solid rgba(241,241,241,1);
        padding: 15px 10px;
      }
    }
  }
  .trend{
    border: 1px solid rgba(241,241,241,1);
    margin-top: 20px;
    div {
      padding: 10px;
      &:last-child {
        // border-top: 1px solid #eeeeee;
      }
    }
    .chart{
      margin-top:25px;
      width:100%;
      height:500px;
      background: #fff;
    }
  }
</style>

