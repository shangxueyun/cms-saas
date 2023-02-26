<template>
  <div id="vegetableMarket"
       class="vegetableMarket-wrap"
       @click="hidepanel">
    <div class="logo toggle-button">
      <i class="iconfont icon-cms_logo"></i>
      小象智慧农贸
    </div>
    <div class="vm-title">
      <span style="left: 8.24rem;">{{visualConfigData.title}}</span>
    </div>
    <div class="timewarp">
      <span id="time">{{date}}</span>
      <div class="business-hours">营业时间：{{visualConfigData.startTime}}～{{visualConfigData.endTime}}</div>
    </div>
    <div class="top-content clearfix TEMP1"
         v-if="templateType == 'TEMP1'">
      <div class="ct-title"
           @click="login">
      </div>
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
              <img src="../../assets/Numberoftransactions.png" />
              <div>
                <p>{{realTimeData.orderNumber}}</p>
                <p>交易笔数</p>
              </div>
            </div>
            <div class="item">
              <img src="../../assets/Tradingvolume.png" />
              <div>
                <p>{{realTimeData.goodsNumber}}</p>
                <p>交易量(kg)</p>
              </div>
            </div>
            <div class="item">
              <img src="../../assets/Passrate.png" />
              <div>
                <p>{{visualConfigData.passRate}}%</p>
                <p>抽检合格率</p>
              </div>
            </div>
            <div class="item">
              <img src="../../assets/Commoditytype.png" />
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
          <div class="swiper-container">
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
      <div class="data-wrap2 fleft">
        <div class="dw-bg content-bg"></div>
        <div class="dw-data public-price">
          <div class="common-head">
            <i class="iconfont icon-biaoti"></i>今日检测信息
            <span class="underline"
                  style="width: 71%;"></span>
          </div>
          <ul class="ultitle">
            <li>商品名称</li>
            <li>检测项目</li>
            <li>结果</li>
          </ul>
          <vue-seamless-scroll :data="testingInformationData"
                               class="seamless-warp"
                               :class-option="classOption">
            <ul v-for="(item, index) in testingInformationData"
                :key="index">
              <li>{{ item.goodsName }}</li>
              <li class="price-li">{{ item.foodCheckTypeDescription }}</li>
              <li>{{ item.checkResult == 'OK' ? '合格' : '不合格'}}</li>
            </ul>
          </vue-seamless-scroll>
        </div>
      </div>
      <div class="data-wrap fleft marginTop"
           style="margin-left: 0">
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
                v-for="(item, index) in realTimeOrderDTOData"
                :key="index">
              <li style="width:30%;"
                  class="ellipsis">{{tenantNameFormat(item.tenantName)}}</li>
              <li style="width:17.5%"
                  class="ellipsis">{{item.type}}</li>
              <li style="width:17.5%">{{item.payMethod}}</li>
              <li style="width:17.5%"
                  class="price-li2">{{item.price | toLocaleString}}</li>
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
    <TemplateType v-else-if="templateType == 'TEMP2'"
                  :ProjectId="ProjectManagement"
                  :Id="ProjectManagementId"
                  :visualConfig="visualConfigData" />
  </div>
</template>
<script>
import vueSeamlessScroll from 'vue-seamless-scroll'
import TemplateType from './components/templateType'
import map from '../../assets/map_mq.png'
import Swiper from 'swiper/dist/js/swiper.js'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
import service from '@/service'
export default {
  name: 'businessOperation',
  components: {
    vueSeamlessScroll,
    TemplateType
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
      visualConfigData: {},
      realTimeData: {},
      realTimeOrderDTOData: [],
      tenantGoodsDTOData: [],
      testingInformationData: [],
      templateType: '', // 模板类型字段
      ProjectManagement: null,
      ProjectManagementId: null
    }
  },
  created () {
    // this.login()
    this.financeDate()
    this.initData()
  },
  mounted () {
    var _this = this // 声明一个变量指向vue实例this,保证作用域一致
    this.timer = setInterval(function () {
      _this.date = _this.getNowTime()// 修改数据date
    }, 1000)

    this.timer2 = setInterval(function () {
      _this.initData()
    }, 30000)

    this.$nextTick(() => {
      this.swiperInit()
    })
  },
  computed: {
    getYear () {
      var myDate = new Date()
      var tYear = myDate.getFullYear()
      return tYear
    },
    classOption () {
      return {
        step: 0.5, // 数值越大速度滚动越快
        singleHeight: 50,
        waitTime: 5000 // 单步运动停止的时间(默认值1000ms)
      }
    },
    classOption1 () {
      return {
        step: 0.5, // 数值越大速度滚动越快
        singleHeight: 86,
        waitTime: 2000 // 单步运动停止的时间(默认值1000ms)
      }
    }
  },
  methods: {
    login () {
      sessionStorage.removeItem('token')
      service.user.login('admin', 'admin')
    },
    tenantNameFormat (str) {
      if (str.length > 6) {
        return str.substring(0, 6) + '...'
      } else {
        return str
      }
    },
    initData () {
      this.ProjectManagement = this.$route.query.projectManagementId
      this.ProjectManagementId = this.$route.query.id
      this.templateType = this.$route.query.templateType
      // this.login()
      this.visualConfig(this.ProjectManagementId)

      if (this.templateType === 'TEMP1') {
        this.timingData(this.ProjectManagement)
        this.todayNumber(this.ProjectManagement)
        this.realTimeOrderDTO(this.ProjectManagement)
        this.tenantGoodsDTO(this.ProjectManagement)
        this.nearSevenDays(this.ProjectManagement)
        this.testingInformation(this.ProjectManagement)
      }
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
    hidepanel () {
      this.showBSpanel = false
      this.showPDpanel = false
      this.showShopList = false
      this.showAreaType = false
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
    financeDate () {
      let timeList = []
      var now = new Date()
      var year = now.getFullYear()
      var month = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)
      var timeListLength = Number(now.getMonth() + 1)
      timeList.push({ val: year + '-' + month + '-01', name: year + '至今', type: 'Year' })
      for (let i = 1; i < timeListLength; i++) {
        if (i < 10) {
          i = '0' + i
        }
        timeList.push({ val: year + '-' + i + '-01', name: year + '-' + i, type: 'Month' })
      }
      this.timeList = timeList
      // 默认总计时间
      this.selectedPDtime = this.timeList[0].name
      this.selectPDType = this.timeList[0].type
      this.selectedTime = this.timeList[0].val
      this.selectedBStime = this.timeList[0].name
    },
    visualConfig (id) {
      service.http.get(`/gos/api/visualConfig/${id}`).then(res => {
        this.visualConfigData = res.data
        // this.$nextTick(() => {
        //   this.swiperInit()
        // })
      })
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
    // 今日检测信息
    testingInformation (id) {
      service.http.get(`/gos/api/statistics/foodCheck?projectManagementId=${id}`).then(res => {
        this.testingInformationData = res.data
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
@import "../../style/mqO2O.scss";
body {
  background: none;
}
ul li {
  list-style: none;
}
#vegetableMarket {
  width: 100%;
  height: 100%;
  position: relative;
  background: url(../../assets/bg2.png) no-repeat;
  /* background: url(../../assets/bg.png) no-repeat; */
  width: 100vw;
  min-height: 100vh;
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  .toggle-button {
    position: absolute;
    width: px2rem(500);
    height: px2rem(114);
    top: px2rem(110);
    left: px2rem(80);
    color: #fff;
    i {
      font-size: px2rem(100);
      margin-right: px2rem(20);
      margin-top: px2rem(10);
      vertical-align: middle;
    }
    font-size: px2rem(50);
  }
  .timewarp {
    font-size: px2rem(50);
    top: px2rem(80);
  }
  .vm-title {
    background-position: px2rem(20);
    background-size: contain;
    text-align: center;
    height: px2rem(240);
    > span {
      position: static !important;
      font-size: px2rem(100);
      font-weight: 700;
      color: rgba(255, 255, 255, 0);
      line-height: px2rem(180);
      -webkit-text-stroke: 1px rgba(255, 255, 255, 1);
      text-stroke: 1px rgba(255, 255, 255, 1);
      color: #e9f0fd;
      left: px2rem(900);
      display: inline-block;
      margin-top: px2rem(60);
    }
  }
  .map {
    border: none !important;
    border-radius: 0 !important;
  }
  #container {
    width: px2rem(1200);
    height: px2rem(800);
  }
  .common-head {
    color: #e9f0fd;
    font-size: px2rem(40);
    margin: px2rem(30) 0 0 px2rem(30);
    i {
      color: #06e6fa;
      font-size: px2rem(48);
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
  }
  .real-time-data {
    position: absolute;
    width: px2rem(1200);
    height: px2rem(800);
    top: 0;
    color: #e9f0fd;
    .content {
      display: flex;
      flex-wrap: wrap;
      .item {
        width: 50%;
        padding-left: px2rem(20);
        display: flex;
        padding: px2rem(100) 0 px2rem(60) px2rem(60);
        div {
          margin-left: px2rem(20);
          p {
            min-height: px2rem(52);
            &:first-child {
              font-size: px2rem(68);
              margin-bottom: px2rem(20);
            }
            &:last-child {
              font-size: px2rem(40);
              color: #bdb6d6;
            }
          }
        }
        img {
        }
      }
    }
    img {
      width: px2rem(180);
      height: px2rem(180);
    }
  }
  .shop-data {
    left: px2rem(950);
  }
  .finance-data {
    left: px2rem(2484);
  }
  .data-wrap {
    margin-left: px2rem(50);
    .basic-data {
      width: px2rem(1200);
      height: px2rem(800);
    }
    .basic-number {
      width: px2rem(1220);
      height: px2rem(370);
      top: px2rem(46);
      left: px2rem(170);
      border: none;
      background-color: transparent;
      display: flex;
      flex-wrap: wrap;
      .bn-item {
        width: px2rem(368);
        height: px2rem(168);
        background-color: #354068;
        border: 1px solid #6c81aa;
        text-align: left;
        padding-left: px2rem(45);
        border-radius: px2rem(4);
        div {
          &:first-child {
            margin-top: px2rem(10);
            font-size: px2rem(50);
          }
        }
      }
    }
  }
  .data-wrap2 {
    position: relative;
    margin-left: px2rem(50);
    width: px2rem(1200);
    margin-top: px2rem(100);
    .dw-bg {
      width: px2rem(1200);
      height: px2rem(800);
    }
    .dw-data {
      position: absolute;
      // width: px2rem(1182);
      width: 100%;
      height: 100%;
      top: 0;
      /* span {
      display: inline-block;
      width: 48%;
      height: px2rem(100);
      padding: px2rem(45) 0 0 px2rem(80);
      div:first-child {
        font-size: px2rem(50);
        margin-bottom: px2rem(10);
      }
      div {
        font-size: px2rem(26);
        color: #fff;
      }
    } */
      ul {
        display: flex;
        li {
          color: #fff;
          width: 20%;
          text-align: center;
          font-size: px2rem(40);
          height: px2rem(100);
          line-height: px2rem(100);
        }
      }
      .ultitle {
        margin-top: px2rem(30);
        background-color: #2b2570;
        border: none;
        li {
          color: #92a0c0;
          height: px2rem(80);
          line-height: px2rem(80);
          font-weight: 700;
        }
      }
    }
    .transaction-records {
      ul li {
        &:first-child {
          text-align: left;
          padding-left: px2rem(40);
        }
      }
    }
  }
  .dly-wrap {
    width: px2rem(900);
    .dly-content {
      width: px2rem(900);
      padding-top: px2rem(260);
      .flleft {
        width: 50%;
      }
    }
    .areameasure {
      position: relative;
      .type-ul {
        position: absolute;
        left: 20px;
        top: 20px;
        width: 120px;
        color: #8187e5;
        font-size: 12px;
        border: 1px solid #8187e5;
        background-color: #223366;
        border-radius: 2px;
        z-index: 999;
        li {
          height: 30px;
          line-height: 30px;
          padding: 0 4px;
          cursor: pointer;
          &:hover {
            color: #fff;
            background-color: #3368b9;
          }
        }
      }
      .item-title {
        margin-bottom: vh(16);
        text-align: left;
        margin-left: 30px;
        color: #8187e5;
      }
    }
  }
  .business-data {
    width: px2rem(2700);
    .business-content {
      width: px2rem(2700);
    }
  }
  .dly-number {
    width: px2rem(806);
  }
  .chartwrap {
    width: px2rem(1200);
    height: px2rem(800);
    margin: 0 auto;
    position: absolute;
    top: 0;
    left: 0;
    color: #e9f0fd;
    .img-container {
      border-radius: 4px;
      text-align: center;
      img {
        margin: 0 auto;
        border-radius: 4px;
      }
    }
  }
  .bw-chart {
    width: px2rem(1200);
    height: px2rem(380);
  }
  .bw-order {
    width: px2rem(500);
  }
  .itempanel {
    height: auto;
  }
  .top-content {
    margin-top: px2rem(40);
  }
  .public-price {
    ul {
      li {
        width: 28% !important;
        &:first-child {
          width: 44% !important;
          text-align: left;
          padding-left: px2rem(40);
        }
      }
    }
  }
  .content-bg {
    width: px2rem(1200);
    height: px2rem(800);
    border: 2px solid #5b5379;
    border-radius: 0 !important;
    background-color: #231e4a;
    opacity: 0.6;
  }
  .new-products {
    position: absolute;
    width: px2rem(1200);
    height: px2rem(800);
    top: 0;
    color: #e9f0fd;
    img {
      width: px2rem(120);
      height: px2rem(120);
    }
    .content1 {
      padding-left: px2rem(20);
      .item,
      .div {
        overflow: hidden;
      }
    }
    .content {
      display: flex;
      flex-wrap: wrap;
      padding-left: px2rem(20);
      margin-top: px2rem(20);
      .item {
        width: 50%;
        display: flex;
        padding: px2rem(10) 0 px2rem(10) px2rem(10);
        margin-top: px2rem(20);
        div {
          margin-left: px2rem(20);
          p {
            font-size: px2rem(40);
            color: #e9f0fd;
            &:first-child {
              margin-bottom: px2rem(20);
            }
            /*&:last-child {
            font-size: px2rem(40);
            color: #BDB6D6;
          } */
          }
        }
      }
    }
  }
  .seamless-warp {
    height: px2rem(580);
    overflow: hidden;
    .price-li {
      text-align: right !important;
      padding-right: px2rem(100);
    }
    .price-li2 {
      text-align: right !important;
      padding-right: px2rem(20);
    }
  }
  .seamless-warp2 {
    height: 330px;
    /* width: 600px; */
    overflow: hidden;
  }

  .swiper-container {
    width: px2rem(1150);
    height: px2rem(700);
    margin-top: px2rem(53) !important;
    position: relative;
    .swiper-slide {
      text-align: center;
      font-size: 18px;
      // background: #fff;
      /* height: calc((100% - 30px) / 2); */
      /* Center slide text vertically */
      height: 100%;
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;
      // width: 100%;
      // height: px2rem(1300);
      .project-item {
        display: inline-block;
        width: px2rem(1100);
        /* height: px2rem(800); */
        height: 100%;
        border-radius: 5px;
        .pi-img {
          width: 100%;
          height: 100%;
          img {
            width: 100%;
            height: 100%;
            border-radius: px2rem(8);
          }
        }
      }
    }
    .swiper-wrapper {
      padding: 0 !important;
    }
    .swiper-slide-next {
      .project-item {
        //  box-shadow:0px 0px px2rem(30) px2rem(10) #27aebd;
      }
    }
  }
  .swiper-button-prev,
  .swiper-container-rtl .swiper-button-next {
    width: px2rem(130) !important;
    height: px2rem(200) !important;
    left: px2rem(-30) !important;
    background: url(../../assets/arrow-left.png) no-repeat !important;
    background-size: cover !important;
  }
  .swiper-button-next,
  .swiper-container-rtl .swiper-button-prev {
    width: px2rem(130) !important;
    height: px2rem(200) !important;
    right: px2rem(-50) !important;
    background: url(../../assets/arrow-right.png) no-repeat !important;
    background-size: cover !important;
  }

  .business-hours {
    margin-top: 10px;
  }
}
</style>
<style>
.TEMP1 .basic-data {
  width: 12rem !important;
  height: 8rem !important;
}
.TEMP1 .data-wrap2 {
  margin-top: 0 !important;
}
.TEMP1 .marginTop {
  margin-top: 1rem !important;
}
</style>
