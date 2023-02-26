<template>
    <div class="top-content clearfix TEMP2">
      <!-- <div class="ct-title"
           @click="login">
      </div> -->
      <div class="map fleft"
           id="container">
        <div class='dw-bg content-bg'></div>
        <div class="real-time-data">
          <div class="common-head">
            <i class="iconfont icon-biaoti"></i>实时数据
            <span class="underline"></span>
          </div>
          <div class="content">
            <div class="item">
              <img src="../../../assets/Numberoftransactions.png"/>
              <div>
                <p>{{realTimeData.orderNumber}}</p>
                <p>交易笔数</p>
              </div>
            </div>
            <div class="item">
              <img src="../../../assets/Tradingvolume.png"/>
              <div>
                <p>{{realTimeData.goodsNumber}}</p>
                <p>交易量(kg)</p>
              </div>
            </div>
            <div class="item">
              <img src="../../../assets/Passrate.png"/>
              <div>
                <p>{{visualConfigData.passRate}}%</p>
                <p>抽检合格率</p>
              </div>
            </div>
            <div class="item">
              <img src="../../../assets/Commoditytype.png"/>
              <div>
                <p>{{realTimeData.goodsTypeNumber}}</p>
                <p>商品种类数量</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="data-wrap fleft">
        <div class="dw-bg content-bg basic-data"
             style="margin: 0"></div>
        <!-- </div><div class="basic-data content-bg fleft"> -->
        <div class="chartwrap dw-data">
          <!-- <div class="common-head">
            <i class="iconfont icon-biaoti"></i>摊位分布图
            <span class="underline"
                  style="width: 70%;"></span>
          </div> -->
          <div class="swiper-container" id="swiper-containertype2">
            <div class="swiper-wrapper">
              <div class="swiper-slide"
                   v-for="(item, i) in visualConfigData.images"
                   :key="i">
                <div class="project-item">
                  <div class="pi-img">
                    <img :src="item" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="data-wrap2 fleft"
           id="container">
        <div class='dw-bg content-bg'></div>
        <div class="new-products">
          <div class="common-head">
            <i class="iconfont icon-biaoti"></i>近期新品
            <span class="underline"></span>
          </div>
          <div class="content1">
            <!-- <vue-seamless-scroll :data="tenantGoodsDTOData" :class-option="classOption1" class="seamless-warp2"> -->
            <div class="content">
              <div class="item"
                   v-for="(item, index) in tenantGoodsDTOData" :key="index">
                <img :src="item.imgUrl" />
                <div>
                  <p  class="ellipsis">{{item.name}}</p>
                  <p>{{item.unitPrice | toLocaleString}}元/{{item.unitName}}</p>
                </div>
              </div>
            </div>
            <!-- </vue-seamless-scroll> -->
          </div>
        </div>
      </div>
      <div class="data-wrap fleft marginTop" style="margin-left: 0">
        <div class="basic-data content-bg fleft"
             style="margin: 0"></div>
        <div class="chartwrap">
          <div class="common-head">
            <i class="iconfont icon-biaoti"></i>商户近7天交易笔数
            <span class="underline"
                  style="width: 55%;"></span>
          </div>
          <div id="dayTrading"
               style="width: 100%;height:86%;"></div>
        </div>
      </div>
      <div class="data-wrap2 fleft marginTop">
        <div class="dw-bg content-bg"></div>
        <div class="dw-data transaction-records">
          <div class="common-head">
            <i class="iconfont icon-biaoti"></i>实时交易记录
            <span class="underline"
                  style="width: 68%;"></span>
          </div>
          <ul class="ultitle">
            <li style="width:30%;">商户名称</li>
            <li style="width:17.5%">摊位类型</li>
            <li style="width:17.5%">支付方式</li>
            <li style="width:17.5%">金额(元)</li>
            <li style="width:17.5%">交易时间</li>
          </ul>
          <vue-seamless-scroll :data="realTimeOrderDTOData"
                               class="seamless-warp"
                               :class-option="classOption">
            <ul style="border: none"
                v-for="(item, index) in realTimeOrderDTOData" :key="index">
              <li style="width:30%;" class="ellipsis">{{tenantNameFormat(item.tenantName)}}</li>
              <li style="width:17.5%" class="ellipsis">{{item.type}}</li>
              <li style="width:17.5%">{{item.payMethod}}</li>
              <li style="width:17.5%" class="price-li2">{{item.price | toLocaleString}}</li>
              <li style="width:17.5%">{{item.time}}</li>
            </ul>
          </vue-seamless-scroll>
        </div>
      </div>
      <div class="data-wrap fleft marginTop">
        <div class="basic-data content-bg fleft"
             style="margin: 0"></div>
        <div class="chartwrap">
          <div class="common-head">
            <i class="iconfont icon-biaoti"></i>部分商品今日交易量
            <span class="underline"
                  style="width: 55%;"></span>
          </div>
          <div id="areaRatio"
               style="width: 100%;height:86%;"></div>
        </div>
      </div>
    </div>
</template>
<script>
import vueSeamlessScroll from 'vue-seamless-scroll'
import map from '../../../assets/map_mq.png'
import Swiper from 'swiper/dist/js/swiper.js'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
import service from '@/service'
export default {
  name: 'TemplateType',
  components: {
    vueSeamlessScroll
  },
  data () {
    return {
      basicData: {
        order: ''
      },
      timeList: [],
      dlycList: ['配送车辆', '配送员', '保温箱'],
      shopList: [],
      showShopList: false,
      showBSpanel: false,
      showPDpanel: false,
      showALLpanel: false,
      selectedShop: '',
      selectedShopLogo: '',
      orderCount: '',
      selectBSType: 'Year',
      selectPDType: 'MONTH',
      selectedBStime: '',
      selectedPDtime: '',
      shopId: '',
      tabIndex: 0,
      center: '',
      Message: {
        nickname: '',
        shopOrderDTOS: [{
          orderDetailsDTOS: [{ goodsName: '', goodsNum: '' }]
        }]
      },
      timer: '',
      date: new Date(),
      shopData: { allArea: '' },
      financeCountData: { amount: '' },
      selectedTime: '',
      selectedShopItem: '',
      turnoverNum: '',
      companyImage: map,
      showAreaType: false,
      CardPartsStatisticsList: [],
      visualConfigData: this.visualConfig,
      realTimeData: {},
      realTimeOrderDTOData: [],
      tenantGoodsDTOData: [],
      templateType: 'TEMP1' // 模板类型字段
    }
  },
  props: {
    ProjectId: {
      type: String,
      default: ''
    },
    Id: {
      type: String,
      default: ''
    },
    visualConfig: {
      type: Object,
      default: {}
    }
  },
  watch: {
    visualConfig (o, l) {
      this.visualConfigData = o
      this.$set(this.visualConfigData)
    }
  },
  created () {
    this.initData()
  },
  mounted () {
    var _this = this // 声明一个变量指向vue实例this,保证作用域一致

    this.timer2 = setInterval(function () {
      _this.initData()
    }, 30000)

    this.$nextTick(() => {
      this.swiperInit()
    })
  },
  computed: {
    classOption () {
      return {
        step: 0.5, // 数值越大速度滚动越快
        singleHeight: 50,
        waitTime: 5000 // 单步运动停止的时间(默认值1000ms)
      }
    }
  },
  methods: {
    tenantNameFormat (str) {
      if (str.length > 6) {
        return str.substring(0, 6) + '...'
      } else {
        return str
      }
    },
    initData () {
      this.timingData(this.ProjectId)
      this.todayNumber(this.ProjectId)
      this.realTimeOrderDTO(this.ProjectId)
      this.tenantGoodsDTO(this.ProjectId)
      this.nearSevenDays(this.ProjectId)
    },
    swiperInit () {
      let isLoop = this.visualConfigData.images && this.visualConfigData.images.length > 1
      // eslint-disable-next-line no-unused-vars
      var mySwiper = new Swiper('.swiper-container', {
        autoplay: {
          delay: 10000,
          disableOnInteraction: false
        },
        observeParents: true,
        observer: true,
        loop: isLoop // 循环模式选项
      })
    },
    areaRatio (goodsName, goodsWeight, integrityName, type) {
      let myChart
      if (type) {
        myChart = echarts.init(document.getElementById('areaRatio'))
      } else {
        myChart = echarts.init(document.getElementById('dayTrading'))
      }
      let option = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          // 自定义hover效果
          formatter: function (params, ticket, callback) {
            return integrityName[params[0].dataIndex] + '<br />' + params[0].seriesName + '：' + params[0].value
          }
        },
        legend: {
          show: false,
          data: [
            {
              name: '交易量',
              textStyle: {
                fontSize: 12,
                color: '#fff'
              },
              icon: 'image://../img/violet.png'
            }
          ],
          bottom: 16,
          padding: 0
        },
        grid: {
          // containLabel: true
          top: '36px',
          left: '40px',
          right: '10px',
          bottom: '40px'
        },
        xAxis: [
          {
            type: 'category',
            // data: ['0-50', '50-100', '100-200', '200-500', '500-800', '800-1000', '1000以上'],
            data: goodsName,
            axisPointer: {
              type: 'shadow'
            },
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              rotate: 40,
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
            name: 'kg',
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
            name: '交易量',
            type: 'bar',
            barWidth: '20%',
            barMaxWidth: '14',
            itemStyle: {
              normal: {
                barBorderRadius: [4, 4, 0, 0]
              }
            },
            label: { show: false, color: '#fff' },
            // data: [10, 52, 20, 33, 39, 33, 22]
            data: goodsWeight
          }
        ]
      }

      if (type) {
        // 部分商品今日交易量
        option.series[0].itemStyle.normal.color = function (params) {
          // build a color map as your need.

          var colorList = [
            ['#0F5C7F', '#99DFFF'],
            ['#8D3510', '#FFA783'],
            ['#651180', '#D099FF'],
            ['#4B8D10', '#83FFC0'],
            ['#8D104B', '#FF83D8'],
            ['#7F610F', '#FFE899'],
            ['#108D89', '#83FFE9']
          ]
          // return colorList[params.dataIndex % colorList.length];

          var colorItem = colorList[params.dataIndex % colorList.length]
          return new echarts.graphic.LinearGradient(
            0, 0, 0, 1,
            [
              { offset: 0, color: colorItem[0] },
              { offset: 1, color: colorItem[1] }
            ]
          )
        }
        option.series[0].itemStyle.normal.color1 = new echarts.graphic.LinearGradient(
          0, 0, 0, 1,
          [
            { offset: 0, color: '#94f2d2' },
            { offset: 1, color: '#3db6f3' }
          ]
        )
        option.yAxis[0].name = 'kg'
        option.series[0].name = '交易量'
      } else {
        // 商户近7天交易笔数
        option.series[0].itemStyle.normal.color = '#5DC7C9'
        option.yAxis[0].name = '笔'
        option.series[0].name = '交易笔数'
      }
      myChart.setOption(option)
    },
    getNowTime () {
      var now = new Date()
      var year = now.getFullYear()
      var month = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)
      var day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
      var hour = now.getHours()
      var minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
      var second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()
      var nowdate = year + '-' + month + '-' + day + '   \xa0   ' + '  \xa0  ' + '\xa0' + hour + ':' + minute + ':' + second
      return nowdate
    },
    timingData (id) {
      service.http.get(`/gos/api/statistics/timingData?projectManagementId=${id}`).then(res => {
        this.realTimeData = res.data
      })
    },
    // 部分商品今日交易量
    todayNumber (id) {
      service.http.get(`/gos/api/statistics/todayNumber?projectManagementId=${id}`).then(res => {
        let todayNumberData = res.data
        let goodsName = []
        let goodsWeight = []
        let integrityName = []
        todayNumberData.forEach(item => {
          let itemName = item.name
          itemName = itemName.length > 3 ? itemName.substring(0, 4) : itemName
          goodsName.push(itemName)
          goodsWeight.push(item.number)
          integrityName.push(item.name)
        })
        this.areaRatio(goodsName, goodsWeight, integrityName, true)
      })
    },
    // 商户近7天交易笔数
    nearSevenDays (id) {
      service.http.get(`/gos/api/statistics/nearSevenDays?projectManagementId=${id}`).then(res => {
        let nearSevenDaysData = res.data
        let goodsName = []
        let goodsWeight = []
        let integrityName = []
        nearSevenDaysData.forEach(item => {
          let itemName = item.tenantName
          itemName = itemName.length > 3 ? itemName.substring(0, 4) : itemName
          goodsName.push(itemName)
          goodsWeight.push(item.orderNumbers)
          integrityName.push(item.tenantName)
        })
        this.areaRatio(goodsName, goodsWeight, integrityName)
      })
    },
    realTimeOrderDTO (id) {
      service.http.get(`/gos/api/statistics/realTimeOrderDTO?projectManagementId=${id}`).then(res => {
        this.realTimeOrderDTOData = res.data
      })
    },
    tenantGoodsDTO (id) {
      service.http.get(`/gos/api/statistics/tenantGoodsDTO?projectManagementId=${id}`).then(res => {
        this.tenantGoodsDTOData = res.data
      })
    }
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)
    }
    if (this.timer2) {
      clearInterval(this.timer2)
    }
  }
}
</script>
<style lang="scss">
@import "../../../style/config.scss";
  .TEMP2 #swiper-containertype2 {
    margin-top: px2rem(53) !important;
    height: px2rem(700);
    img {
      border-radius: px2rem(8);
    }
  }
  .TEMP2 .basic-data{
    width: 12rem !important;
    height: 8rem !important;
  }
  .TEMP2 .data-wrap2{
    margin-top: 0 !important
  }
  .TEMP2 .marginTop {
    margin-top: 1rem !important;
  }
  .TEMP2 .swiper-container{
    width: px2rem(1100) !important;
  }
  .TEMP2 .chartwrap {
    width: px2rem(1100) !important;
    left: px2rem(52) !important;
    overflow: hidden;
  }
</style>

