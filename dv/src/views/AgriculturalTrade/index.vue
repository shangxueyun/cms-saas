<template>
  <div class="agriculturalTrade-wrap">
    <div class="bw-header">
      <a href="javascript:void(0)">
        <div class="home-button" @click="$router.back()"></div>
      </a>
      <div class="bw-title">
        <span>{{titleName}}菜场数据中心</span>
      </div>
      <div class="bw-timewarp">
        <span id="time">{{date}}</span>
      </div>
    </div>
    <div class="bw-content1">
      <div class="bwc-left">
        <div class="common-head">
          <i class="iconfont icon-biaoti"></i>菜场销售统计
          <el-cascader
            filterable
            size="small"
            v-model="value"
            ref="refSubCat"
            :options="options"
            :show-all-levels="false"
            popper-class="at-warp-cascader"
            @change="handleChange"></el-cascader>
          <span class="underline"
                style="width: 40%"></span>
          <!-- <span class="timer">
            <i :class="{'activated': selectIndexSD === 1}"
                @click="toggleTimer(1, 'DAY', 'saleData')">日</i>|
            <i :class="{'activated': selectIndexSD === 2}"
                @click="toggleTimer(2, 'MONTH', 'saleData')">月</i>
          </span> -->
        </div>
        <div id="MarketSalesStatistics" style="width: 100%;height:90%;"></div>
      </div>
      <div class="bwc-center">
        <div class="common-head">
          <i class="iconfont icon-biaoti"></i>今日市场概况
          <span class="underline"
                style="width: 79%"></span>
        </div>
        <div class="market-overview">
          <div class="mo-item1">
            <p class="moi-title">交易笔数</p>
            <p class="moi-num">{{saleNumber}}</p>
          </div>
          <div class="mo-item2">
            <p class="moi-title">销售金额（元）</p>
            <p class="moi-num">{{saleAmount | toLocaleString}}</p>
          </div>
          <div class="mo-item3">
            <p class="moi-title">客单价（元）</p>
            <p class="moi-num">{{perAmount | toLocaleString}}</p>
          </div>
        </div>
      </div>
      <div class="bwc-right">
        <div class="common-head">
          <i class="iconfont icon-biaoti"></i>今日入库
          <span class="underline"
                style="width: 74%"></span>
        </div>
        <div class="table">
          <ul class="tableHead">
            <li style="width: 74%">商品名称</li>
            <li>入库数量(kg）</li>
          </ul>
          <ul class="tableBody todayPurchase">
            <li v-for="(item,index) in todayPurchaseData" :key="index">
              <span style="width: 74%">{{item.name}}</span>
              <span>{{item.number | toLocaleFixed}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="bw-content2">
      <div class="bwc-left">
        <div class="common-head">
          <i class="iconfont icon-biaoti"></i>菜场销售统计
          <el-cascader
           filterable
            size="small"
            v-model="valueNum"
            ref="refSubCat"
            :options="options"
            :show-all-levels="false"
            popper-class="at-warp-cascader"
            @change="handleChange2"></el-cascader>
          <span class="underline"
                style="width: 40%"></span>
          <!-- <span class="timer">
            <i :class="{'activated': selectIndex === 1}"
                @click="toggleTimer(1, 'DAY')">日</i>|
            <i :class="{'activated': selectIndex === 2}"
                @click="toggleTimer(2, 'MONTH')">月</i>
          </span> -->
          <!-- <span class="show-time">{{showTime}}</span> -->
        </div>
        <div id="NumberOfTransactions" style="width: 100%;height:90%;"></div>
      </div>
      <div class="bwc-center">
        <div class="common-head">
          <i class="iconfont icon-biaoti"></i>今日销售种类占比
          <span class="underline"
                style="width: 74%"></span>
        </div>
        <div id="ProportionOfSpecies" style="width: 100%;height:90%;"></div>
      </div>
      <div class="bwc-right">
        <div class="common-head">
          <i class="iconfont icon-biaoti"></i>今日出库
          <span class="underline"
                style="width: 74%"></span>
        </div>
        <div class="table">
          <ul class="tableHead">
            <li style="width: 54%">商品名称</li>
            <li>出库数量(kg)</li>
            <li>均价(元）</li>
          </ul>
          <ul class="tableBody todaySale">
            <li v-for="(item,index) in todaySaleData" :key="index">
              <span style="width: 54%">{{item.name}}</span>
              <span>{{item.number | toLocaleFixed}}</span>
              <span>{{item.price | toLocaleString}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="bw-content3">
      <div class="bwc-left">
        <div class="common-head">
          <i class="iconfont icon-biaoti"></i>溯源信息
          <span class="underline"
                style="width: 74%"></span>
        </div>
        <div class="traceability-information">
          <div class="ti-Yidian">
            <div class="ti-left">仪电</div>
            <div>
              最近上传时间：{{traceInfoData[0]}}
            </div>
          </div>
          <div class="ti-Tracingcloud">
            <div class="ti-left">追溯云</div>
            <div>
              最近上传时间：{{traceInfoData[1]}}
            </div>
          </div>
        </div>
      </div>
      <div class="bwc-center">
        <div class="common-head">
          <i class="iconfont icon-biaoti"></i>今日检测信息
          <span class="underline"
                style="width: 78%"></span>
        </div>
        <div class="table">
          <ul class="tableHead">
            <li style="width: 30%">客户名称</li>
            <li>商品名称</li>
            <li>检测项目</li>
            <li>结果</li>
          </ul>
          <ul class="tableBody stock">
            <li v-for="(item,index) in foodCheckData" :key="index">
              <span style="width: 30%">{{item.tenantName}}</span>
              <span>{{item.goodsName}}</span>
              <span>{{item.foodCheckTypeDescription}}</span>
              <span>{{item.checkResultDescription}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="bwc-right">
        <div class="common-head">
          <i class="iconfont icon-biaoti"></i>市场库存
          <span class="underline"
                style="width: 74%"></span>
        </div>
        <div class="table">
          <ul class="tableHead">
            <li style="width: 74%">商品名称</li>
            <li>当前库存(kg）</li>
          </ul>
          <ul class="tableBody stock">
            <li v-for="(item,index) in stockData" :key="index">
              <span style="width: 74%">{{item.name}}</span>
              <span>{{item.number | toLocaleFixed}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 折线图
require('echarts/lib/chart/line')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
import { getNowTime } from '@/utils/validate'
import service from '@/service'
export default {
  name: 'AgriculturalTrade',
  data () {
    return {
      titleName: '',
      date: '',
      selectIndexSD: 1,
      dateTypeSD: 'DAY',
      selectIndex: 1,
      dateType: 'DAY',
      todayPurchaseData: [],
      todaySaleData: [],
      stockData: [],
      traceInfoData: [],
      foodCheckData: [],
      saleAmount: '',
      saleNumber: '',
      perAmount: '',
      showTime: '',
      value: '',
      valueNum: '',
      options: []
    }
  },
  created () {
    this.projectManagementId = this.$route.query.projectManagementId || this.$route.query.id
    this.titleName = this.$route.query.name
    this.goodsDepotTree()
  },
  mounted () {
    var _this = this
    this.timer = setInterval(function () {
      _this.date = _this.getNowTime()
    }, 1000)

    this.todayData()
    this.proportionOfSpeciesAPI()
    this.todayPurchase()
    this.stock()
    this.foodCheck()
    this.traceInfo()
    this.todaySale()
  },
  methods: {
    getNowTime () {
      return getNowTime()
    },
    toggleTimer (index, dateType, types) {
      if (types === 'saleData') {
        this.selectIndexSD = index
        this.dateTypeSD = dateType
        this.marketSalesStatisticsAPI()
      } else {
        this.selectIndex = index
        this.dateType = dateType
        this.numberOfTransactionsAPI()
      }
    },
    // 商品Cascader
    goodsDepotTree () {
      service.http.get(`/gos/api/statistics/goodsDepotTree?projectManagementId=${this.projectManagementId}`).then(res => {
        if (res.status === 200) {
          this.options = res.data
          if (this.options.length > 0) {
            const value = res.data[0].children[0].children[0].value
            this.value = value
            this.valueNum = value
            this.goodsDepotId = value
            this.goodsDepotIdNumber = value
            this.marketSalesStatisticsAPI()
            this.numberOfTransactionsAPI()
          }
        }
      })
    },
    handleChange (value) {
      this.goodsDepotId = value[value.length - 1]
      this.marketSalesStatisticsAPI()
    },
    handleChange2 (value) {
      this.goodsDepotIdNumber = value[value.length - 1]
      this.numberOfTransactionsAPI()
    },
    marketSalesStatisticsAPI () {
      const goodsDepotId = this.goodsDepotId || ''
      service.http.get(`/gos/api/statistics/goodsDepotMonth/price?projectManagementId=${this.projectManagementId}&goodsDepotId=${goodsDepotId}`).then(res => {
        if (res.status === 200) {
          const resData = res.data
          const dateArray = []
          const amount = []
          if (resData && resData.length.length === 0) return
          resData.forEach(ele => {
            dateArray.push(ele.time.substring(5))
            amount.push(ele.amount)
          })
          this.marketSalesStatistics(dateArray, amount)
        }
      })
    },
    numberOfTransactionsAPI () {
      const goodsDepotIdNumber = this.goodsDepotIdNumber || ''
      service.http.get(`/gos/api/statistics/goodsDepotMonth/num?projectManagementId=${this.projectManagementId}&goodsDepotId=${goodsDepotIdNumber}`).then(res => {
        if (res.status === 200) {
          const resData = res.data
          const dateArray = []
          const amount = []
          if (resData && resData.length.length === 0) return
          resData.forEach(ele => {
            dateArray.push(ele.time.substring(5))
            amount.push(ele.amount)
          })
          this.numberOfTransactions(dateArray, amount)
        }
      })
    },
    todayData () {
      service.http.get(`/gos/api/statistics/visual/todayData?projectManagementId=${this.projectManagementId}`).then(res => {
        if (res.status === 200) {
          const {saleAmount, saleNumber, perAmount} = res.data
          this.saleAmount = saleAmount
          this.saleNumber = saleNumber
          this.perAmount = perAmount
        }
      })
    },
    proportionOfSpeciesAPI () {
      service.http.get(`/gos/api/statistics/visual/todaySaleType?projectManagementId=${this.projectManagementId}`).then(res => {
        if (res.status === 200) {
          const resData = res.data
          const dateArray = []
          const legend = []
          const colorArr = []
          if (resData && resData.length.length === 0) return
          resData.forEach(ele => {
            dateArray.push({ value: ele.amount, name: ele.name })
            legend.push(ele.name)
            colorArr.push(ele.colorArr)
          })
          this.proportionOfSpecies(dateArray, legend, colorArr)
        }
      })
    },
    todayPurchase () {
      service.http.get(`/gos/api/statistics/visual/todayPurchase?projectManagementId=${this.projectManagementId}`).then(res => {
        if (res.status === 200) {
          this.todayPurchaseData = res.data
        }
      })
    },
    todaySale () {
      service.http.get(`/gos/api/statistics/visual/todaySale?projectManagementId=${this.projectManagementId}`).then(res => {
        if (res.status === 200) {
          this.todaySaleData = res.data
        }
      })
    },
    stock () {
      service.http.get(`/gos/api/statistics/visual/stock?projectManagementId=${this.projectManagementId}`).then(res => {
        if (res.status === 200) {
          this.stockData = res.data
        }
      })
    },
    foodCheck () {
      service.http.get(`/gos/api/statistics/visual/foodCheck?projectManagementId=${this.projectManagementId}`).then(res => {
        if (res.status === 200) {
          this.foodCheckData = res.data
        }
      })
    },
    traceInfo () {
      service.http.get(`/gos/api/statistics/visual/traceInfo?projectManagementId=${this.projectManagementId}`).then(res => {
        if (res.status === 200) {
          let traceInfoData = res.data
          let traceInfo = []
          traceInfoData.forEach(ele => {
            const eleval = ele ? ele.replace('T', '  ') : ' '
            traceInfo.push(eleval)
          })
          this.traceInfoData = traceInfo
        }
      })
    },
    // 菜场销售统计
    marketSalesStatistics (dateArray, orderCount) {
      let myChart = echarts.init(document.getElementById('MarketSalesStatistics'))
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['水'],
          itemHeight: 1,
          icon: 'none',
          textStyle: {
            color: '#E9F0FD'
          }
        },
        grid: {
          // left: '3%',
          // right: '4%',
          // bottom: '0%',
          // top: 24
          // containLabel: true
          top: '40px',
          left: '50px',
          right: '30px',
          bottom: '50px'
        },
        xAxis: [
          {
            type: 'category',
            // name: this.dateType === 'Month' ? '月' : '日',
            boundaryGap: false,
            axisLabel: {
              textStyle: {
                color: '#c1cce2',
                fontSize: 10
              }
            },
            axisLine: {
              lineStyle: {
                color: '#c1cce2'
              }
            },
            data: dateArray
            // data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '均价（元/kg）',
            min: 0,
            // max: orderCount,
            // splitNumber: 10,
            minInterval: 1,
            axisLabel: {
              textStyle: {
                color: '#c1cce2',
                fontSize: 10
              }
            },
            axisLine: {
              lineStyle: {
                color: '#c1cce2'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: ['#c1cce2']
              }
            }
          }
        ],
        series: [
          {
            // name: '水',
            type: 'line',
            // stack: '总量',
            // symbol: 'none',
            smooth: true,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(2, 141, 254, 0.2)'
                }, {
                  offset: 1,
                  color: 'rgba(2, 141, 254, 0)'
                }])
              }
            },
            itemStyle: {
              normal: {
                color: '#028DFE'
              }
            },
            data: orderCount
            // data: [100, 210, 130, 140, 350, 160, 170, 380, 190, 200, 210, 220, 330, 240, 150, 140, 350, 160, 170, 380, 190, 200, 210, 220, 330, 240, 150]
          }
        ]
      }
      myChart.setOption(option)
    },
    // 交易笔数排行
    numberOfTransactions (dateArray, data) {
      let myChart = echarts.init(document.getElementById('NumberOfTransactions'))
      let option = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        // tooltip: {
        //   trigger: 'axis',
        //   axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        //     type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        //   },
        //   // 自定义hover效果
        //   formatter: function (params, ticket, callback) {
        //     return tenantName[params[0].dataIndex] + '<br />' + params[0].seriesName + '：' + params[0].value
        //   }
        // },
        grid: {
          // containLabel: true
          top: '36px',
          left: '50px',
          right: '30px',
          bottom: '50px'
        },
        xAxis: [
          {
            type: 'category',
            // name: '月',
            data: dateArray,
            // data: ['2016', '2016', '2016', '2016', '2016'],
            axisPointer: {
              type: 'shadow'
            },
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              // rotate: 40,
              textStyle: {
                color: '#c1cce2',
                fontSize: 11
              }
            },
            axisLine: {
              lineStyle: {
                color: '#c1cce2'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '销量（kg）',
            // min: 0,
            // max: visitmax,
            // minInterval: 1,
            axisLabel: {
              textStyle: {
                color: '#c1cce2',
                fontSize: 12
              }
            },
            axisLine: {
              lineStyle: {
                color: '#c1cce2'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: ['#c1cce2']
              }
            }
          }
        ],
        series: [
          {
            name: '',
            type: 'bar',
            barWidth: '12',
            itemStyle: {
              normal: {
                barBorderRadius: [0, 0, 0, 0],
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#0180FF' },
                    { offset: 1, color: '#07F6F9' }
                  ]
                )
              }
            },
            label: { show: false, color: '#fff' },
            data: data
            // data: [10, 52, 20, 33, 39]
          }
        ]
      }
      myChart.setOption(option)
    },
    // 今日销售种类占比
    proportionOfSpecies (data, legend, colorArr) {
      let myChart = echarts.init(document.getElementById('ProportionOfSpecies'))
      myChart.clear()
      let itemGap = 30
      // if (legend && legend.length > 7) {
      //   itemGap = 15
      // }
      // let data = [
      //   { value: 30, name: '餐饮' },
      //   { value: 20, name: '零售' },
      //   { value: 10, name: '教育' },
      //   { value: 20, name: '生活配套' },
      //   { value: 20, name: '其他' }
      // ]
      let option = {
        tooltip: {
          trigger: 'item',
          // position: ['0%', '50%'],
          // formatter: '{a} <br/>{b}: {c}' + '㎡' + '({d}%)'
          formatter: '{a} <br/>{b}:  ' + ' {d}%'
        },
        title: {
          show: true,
          text: '种类',
          x: 'left',
          // y: 'center',
          left: '17%',
          top: '40%',
          textStyle: {
            fontSize: 20,
            fontWeight: 'normal',
            color: ['#E9F0FD'],
            padding: [20, 20]
          },
          subtextStyle: {
            color: '#666',
            fontSize: 12
          }
        },
        // color: ['#01FFA0', '#43FFFF', '#6BFDFF', '#1EADFD', '#007FFF'],
        // color: colorArr,
        legend: {
          selectedMode: false, // 取消图例上的点击事件
          orient: 'vertical',
          left: '45%',
          top: 20,
          icon: 'circle', // 这个字段控制形状
          itemWidth: 8,  // 设置宽度
          itemHeight: 8, // 设置高度
          textStyle: {// 图例文字的样式
            color: '#ccc',
            fontSize: 12
          },
          itemGap: itemGap,
          data: legend,
          // data: ['餐饮', '零售', '教育', '生活配套', '其他'],
          formatter: function (name) {
            var total = 0
            var target
            for (var i = 0, l = data.length; i < l; i++) {
              total += data[i].value
              if (data[i].name === name) {
                target = data[i].value
              }
            }
            let percentage = isNaN(target / total) ? 0 : (target / total)
            return name + '       ' + target + '元' + '  (' + ((percentage) * 100).toFixed(2) + '%' + ')'
          }
        },
        series: [
          {
            name: '占比',
            type: 'pie',
            stillShowZeroSum: true,
            radius: ['55%', '70%'],
            center: ['20%', '45%'],
            avoidLabelOverlap: false,
            itemStyle: {
              normal: {
                borderWidth: 1,
                borderColor: '#231E4A'
              },
              emphasis: {
                borderWidth: 0,
                shadowBlur: 3,
                shadowOffsetX: 0,
                shadowColor: '#231E4A'
              }
            },
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: '12',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            outline: {
              itemStyle: {
                borderColor: '#000',
                borderWidth: 0
              },
              borderDistance: 0
            },
            data: data
          }
        ]
      }
      myChart.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../style/mixins.scss";
@import "../../style/config.scss";
.agriculturalTrade-wrap {
  position: relative;
  height: px2rem(1080 * 2);
  background: url(../../assets/bg3.png) no-repeat;
  background-size: 100% 100%;
  .common-head {
    position: relative;
    color: #e9f0fd;
    font-size: px2rem(32);
    margin: px2rem(30) 0 0 px2rem(30);
    i {
      color: #06e6fa;
      font-size: px2rem(40);
      vertical-align: middle;
      margin-right: px2rem(20);
    }
    .underline {
      width: 75%;
      height: 1px;
      border-top: 1px solid #7e769a;
      opacity: 0.5;
      margin-bottom: px2rem(10);
      margin-left: px2rem(16);
    }
    span {
      display: inline-block;
    }
    .timer {
      margin-left: px2rem(40);
      color: #5f81d6;
      > i {
        font-size: px2rem(30);
        font-weight: 600;
        font-style: normal;
        margin-right: px2rem(10);
        cursor: pointer;
        color: #5f81d6;
        &.activated {
          color: #e9f0fd;
        }
      }
    }
    .show-time{
      font-size: px2rem(24);
      position: absolute;
      right: px2rem(50);
      top: px2rem(80);
    }
  }
  .bw-header {
    display: flex;
    justify-content: space-between;
    a {
      width: px2rem(450);
    }
    .home-button {
      background: url("../../assets/tgbtn.png") no-repeat;
      background-size: 100% 100%;
      width: px2rem(100);
      height: px2rem(100);
      margin: px2rem(110) 0 0 px2rem(80);
    }
    .bw-title {
      font-size: px2rem(80);
      font-weight: bold;
      color: #e9f0fd;
      text-align: center;
      margin-top: px2rem(114);
    }
    .bw-timewarp {
      font-size: px2rem(36);
      color: #c1cce2;
      margin: px2rem(130) px2rem(100) 0 0;
      min-width: px2rem(355);
    }
  }
  .bw-content1{
    display: flex;
    .bwc-left {
      width: px2rem(1030);
      height: px2rem(520);
      margin: px2rem(100) 0 0 px2rem(90);
      background: url(../../assets/divsBg.png) no-repeat;
      background-size: 100% 100%;
      color: #e9f0fd;
    }
    .bwc-center{
      width: px2rem(1500);
      height: px2rem(520);
      margin: px2rem(100) 0 0 px2rem(40);
      background: url(../../assets/divbBg.png) no-repeat;
      background-size: 100% 100%;
      color: #e9f0fd;
      .market-overview{
        display: flex;
        justify-content: space-evenly;
        margin-top: px2rem(100);
        > div {
          height: px2rem(220);
          background: url(../../assets/wordsBg.png) no-repeat;
          background-size: 100% 100%;
          padding-left: px2rem(25);
          .moi-title{
            color: #05E5FA;
            font-size: px2rem(30);
            font-weight: bold;
            padding: px2rem(40) 0 px2rem(16) 0;
          }
          .moi-num {
            color: #fff;
            font-weight: bold;
            font-size: px2rem(64);
          }
        }
        .mo-item2 {
          width: px2rem(550);
        }
        .mo-item1,.mo-item3{
          width: px2rem(400);
        }
      }
    }
    .bwc-right {
      width: px2rem(1030);
      height: px2rem(520);
      margin: px2rem(100) 0 0 px2rem(40);
      background: url(../../assets/divsBg.png) no-repeat;
      background-size: 100% 100%;
      color: #e9f0fd;
    }
  }
  .bw-content2{
    display: flex;
    .bwc-left {
      width: px2rem(1030);
      height: px2rem(610);
      margin: px2rem(40) 0 0 px2rem(90);
      background: url(../../assets/divsBg.png) no-repeat;
      background-size: 100% 100%;
      color: #e9f0fd;
    }
    .bwc-center{
      width: px2rem(1500);
      height: px2rem(610);
      margin: px2rem(40) 0 0 px2rem(40);
      background: url(../../assets/divbBg.png) no-repeat;
      background-size: 100% 100%;
      color: #e9f0fd;
    }
    .bwc-right {
      width: px2rem(1030);
      height: px2rem(610);
      margin: px2rem(40) 0 0 px2rem(40);
      background: url(../../assets/divsBg.png) no-repeat;
      background-size: 100% 100%;
      color: #e9f0fd;
    }
  }
  .bw-content3{
    display: flex;
    .bwc-left {
      width: px2rem(1030);
      height: px2rem(510);
      margin: px2rem(40) 0 0 px2rem(90);
      background: url(../../assets/divsBg.png) no-repeat;
      background-size: 100% 100%;
      color: #e9f0fd;
    }
    .bwc-center{
      width: px2rem(1500);
      height: px2rem(510);
      margin: px2rem(40) 0 0 px2rem(40);
      background: url(../../assets/divbBg.png) no-repeat;
      background-size: 100% 100%;
      color: #e9f0fd;
    }
    .bwc-right {
      width: px2rem(1030);
      height: px2rem(510);
      margin: px2rem(40) 0 0 px2rem(40);
      background: url(../../assets/divsBg.png) no-repeat;
      background-size: 100% 100%;
      color: #e9f0fd;
    }
    .traceability-information{
      padding: px2rem(90) 0 0 px2rem(130);
      .ti-Yidian{
        margin-bottom: px2rem(90);
      }
      .ti-Yidian,.ti-Tracingcloud{
        display: flex;
      }
      .ti-left{
        color: #06E6FA;
        font-size: px2rem(36);
        width: px2rem(150);
        height: px2rem(70);
        text-align: center;
        background: url(../../assets/underline.png) no-repeat left bottom;
        background-size: contain;
        margin-right: px2rem(90);
      }
    }
  }
  .table {
    border: none;
    font-size: px2rem(24);
    margin-top: px2rem(30);
    > .tableHead {
      height: px2rem(50);
      line-height: px2rem(50);
      padding-left: px2rem(40);
      display: flex;
      background: #2b2570;
      color: #b1a8d1;
      li {
        text-align: center;
        &:nth-child(1) {
          width: 20%;
          text-align: left;
        }
        &:nth-child(2) {
          width: 20%;
        }
        &:nth-child(3) {
          width: 25%;
        }
        &:nth-child(4) {
          width: 15%;
        }
        &:nth-child(5) {
          width: 20%;
        }
      }
    }
    > .tableBody {
      color: #e9f0fd;
      height: px2rem(366);
      padding-left: px2rem(40);
      font-size: px2rem(24);
      overflow-y: scroll;
      @include scrollBarStyle;
      > li {
        height: px2rem(70);
        line-height: px2rem(70);
        display: flex;
        cursor: pointer;
        > span {
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &:nth-child(1) {
            width: 20%;
            text-align: left;
          }
          &:nth-child(2) {
            width: 20%;
          }
          &:nth-child(3) {
            width: 25%;
            /* color: #06e6fa; */
          }
          &:nth-child(4) {
            width: 15%;
          }
          &:nth-child(5) {
            width: 20%;
            display: flex;
            align-items: center;
            padding-left: px2rem(20);
            .star {
              display: inline-block;
              width: px2rem(18);
              height: px2rem(18);
              background: url(../../assets/star.png) no-repeat;
              background-size: 100% 100%;
              margin-right: px2rem(8);
            }
          }
        }
      }
      &.todayPurchase{
        height: px2rem(360);
      }
      &.todaySale{
        height: px2rem(450);
      }
      &.stock{
        height: px2rem(345);
      }
    }
  }
}
</style>
<style lang="scss">
@import "../../style/config.scss";
.agriculturalTrade-wrap{
  .el-cascader {
    .el-input--small {
      font-size: px2rem(22);
      .el-input__inner {
        padding-right: 26;
        background-color: transparent;
        border: none;
        color: #e9f0fd;
        width: px2rem(280);
        font-size: px2rem(28)!important;
      }
    }
    .el-cascader__label{
      color: #fff;
      span {
        color: #fff;
      }
    }
  }
}
.at-warp-cascader{
    background: #231E4A!important;
    border: 1px solid #AEAEFF!important;
    .el-cascader-menu{
      background: #231E4A!important;
      /* border: 1px solid #AEAEFF!important; */
    }
    .el-cascader-menu__item.is-active {
      color: #fff!important;
    }
    .el-cascader-menu__item:focus:not(:active), .el-cascader-menu__item:hover {
      background-color: #264BB8!important;
    }
    .el-cascader-menu__item {
      color: #B1A8D1;
    }
    .el-popper[x-placement^=bottom] .popper__arrow {
      border-bottom-color: #AEAEFF!important;
    }
    .el-popper[x-placement^=bottom] .popper__arrow::after {
      border-bottom-color: #AEAEFF!important;
    }
    .el-cascader-node:not(.is-disabled):focus, .el-cascader-node:not(.is-disabled):hover {
      background-color: #264BB8!important;
      color: #fff!important;
      .el-cascader-node__label{
        color: #fff!important;
      }
    }
    .el-cascader-node__label {
      color: #B1A8D1;
    }
    .el-input--small {
      .el-input__inner {
        width: auto;
        font-size: px2rem(32)!important;
      }
    }
}

.at-warp-cascader {
  .el-cascader__suggestion-item>span {
    color: #fff;
  }
  .el-cascader__suggestion-item:focus, .el-cascader__suggestion-item:hover {
    background-color: #264BB8!important;
  }
}

</style>
