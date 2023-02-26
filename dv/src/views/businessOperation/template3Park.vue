<template>
  <div class="busOperation-wrap-park">
    <div class="bw-header">
      <router-link to="/switchScreen">
        <div class="home-button">
          <!-- <i class="iconfont icon-kfd_shouyeL"></i>
          商业经营数据 -->
        </div>
      </router-link>
      <div class="bw-title">
        <span>{{titleName}}园区管理数据</span>
      </div>
      <div class="bw-timewarp">
        <span id="time">{{date}}</span>
      </div>
    </div>
    <div class="bw-content1">
      <div class="bwc-left">
        <div class="bwcl-bg bwc-bg box-border"></div>
        <div class="actual-content bwcl-content">
          <img :src="projectDetail.previewImage" />
          <div class="common-head">
            <i class="iconfont icon-biaoti"></i>主要经济指标
            <span class="underline"
                  style="width: 64%"></span>
          </div>
          <div class="economic-indicators">
            <div class="ei-item">
              <div>总用地面积(㎡)</div>
              <div class="color_green">{{projectDetail.totalLandArea | toLocaleString}}</div>
            </div>
            <div class="ei-item">
              <div>建筑占地面积(㎡)</div>
              <div class="color_green">{{projectDetail.newBuildingArea | toLocaleString}}</div>
            </div>
            <div class="ei-item">
              <div>总计容建筑面积(㎡)</div>
              <div class="color_green">{{projectDetail.totalCapacityBuildingArea | toLocaleString}}</div>
            </div>
            <div class="ei-item">
              <div>总建筑面积(㎡)</div>
              <div class="color_green">{{projectDetail.totalBuildingArea | toLocaleString}}</div>
            </div>
            <div class="ei-item">
              <div>地上建筑面积(㎡)</div>
              <div class="color_green">{{projectDetail.upBuildingArea | toLocaleString}}</div>
            </div>
            <div class="ei-item">
              <div>地下建筑面积(㎡)</div>
              <div class="color_green">{{projectDetail.downBuildingArea | toLocaleString}}</div>
            </div>
            <div class="ei-item">
              <div>建筑高度(m)</div>
              <div>{{projectDetail.buildingHeight | toLocaleString}}</div>
            </div>
            <div class="ei-item">
              <div>容积率(%)</div>
              <div>{{projectDetail.plotRatio | toLocaleString}}</div>
            </div>
            <div class="ei-item">
              <div>绿化率(%)</div>
              <div>{{projectDetail.greeningRate | toLocaleString}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="bwc-right">
        <!-- 出租率 -->
        <div class="bwcr-occupancy-rate">
          <div class="bwcor-bg bwc-bg box-border"></div>
          <div class="chartwrap">
            <div class="common-head">
              <i class="iconfont icon-biaoti"></i>出租率
              <span class="underline"
                    style="width: 70%;"></span>
            </div>
            <div id="occupancyRate"
                 style="width: 100%;height:90%;"></div>
          </div>
        </div>
        <!-- 业态/业态租金贡献占比 -->
        <div class="bwcr-contribution-ratio">
          <div class="bwcr-bg bwc-bg box-border"></div>
          <div class="chartwrap">
            <div class="common-head">
              <i class="iconfont icon-biaoti"></i>行业面积/行业租金贡献/行业税收占比
              <span class="underline"
                    style="width: 66%;"></span>
            </div>
            <div id="contributionRatio"
                 style="width: 33%;height:60%;display: inline-block"></div>
            <div id="contributionRatio2"
                 style="width: 33%;height:60%;display: inline-block"></div>
            <div id="contributionRatio3"
                 style="width: 33%;height:60%;display: inline-block"></div>
            <div class="chartlegend">
              <span class="noleftmargin"
                    v-for="item in industryData">
                {{item.industryName}}
                <span><i class="icon"
                     :style="{'background-color': item.color}"></i>{{item.areaPercentage}}%</span>
              </span>
            </div>
          </div>
        </div>
        <!-- 平均租金 -->
        <div class="bwcr-collection-rate flex-end">
          <div class="bwccr-bg bwc-bg box-border"></div>
          <div class="chartwrap">
            <div class="common-head">
              <i class="iconfont icon-biaoti"></i>平均租金
              <span class="underline"
                    style="width: 71%;"></span>
            </div>
            <div id="averageRent"
                 style="width: 100%;height:90%;"></div>
          </div>
        </div>
        <!-- 财务数据 -->
        <div class="bwcr-financial-data flex-end">
          <div class="bwcfd-bg bwc-bg box-border"></div>
          <div class="chartwrap">
            <div class="common-head">
              <i class="iconfont icon-biaoti"></i>财务数据
              <span class="underline"
                    style="width: 72%;"></span>
            </div>
            <div id="financialData"
                 style="width: 100%;height:90%;"></div>
          </div>
        </div>
        <!-- 客户列表 -->
        <div class="bwcr-tenant-list flex-end">
          <div class="bwctl-bg bwc-bg box-border"></div>
          <div class="chartwrap">
            <div class="common-head">
              <i class="iconfont icon-biaoti"></i>客户列表
              <span class="underline"
                    style="width: 54%;"></span>
              <span class="more"
                    @click="checkMore">查看更多</span>
            </div>
            <div class="table">
              <ul class="tableHead">
                <li>品牌</li>
                <li>行业</li>
                <li>租金单价(元/㎡天)</li>
                <li>房间号</li>
                <li>等级</li>
              </ul>
              <ul class="tableBody"
                  @click="checkMore">
                <li v-for="(item,index) in tableData"
                    :key="index">
                  <span>{{item.referred}}</span>
                  <span>{{item.industry}}</span>
                  <span>{{item.unitPrice | toLocaleString}}</span>
                  <span>{{item.shopNo}}</span>
                  <span>
                    <i class="star"
                       v-for="(k,j) in item.grade"
                       :key="j"></i>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bw-content2">
      <div class="bwc2-energy-consumption">
        <div class="bwcec-bg bwc-bg box-border"></div>
        <div class="chartwrap">
          <div class="common-head">
            <i class="iconfont icon-biaoti"></i>能耗用量
            <span class="underline"
                  style="width: 80%;"></span>
            <span class="timer">
              <i :class="{'activated': selectIndex === 1}"
                 @click="toggleTimer(1, 'Month')">月</i>|
              <i :class="{'activated': selectIndex === 2}"
                 @click="toggleTimer(2, 'Year')">年</i>
            </span>
          </div>
          <div class="ec-content">
            <div class="item1">
              <div>
                <span>电表(kw·h)</span>
                <span class="dbg"
                      v-for="item in electric">{{item}}</span>
              </div>
              <div>
                <span class="water-meter">水表(m³)</span>
                <span class="dbg"
                      v-for="item in water">{{item}}</span>
              </div>
            </div>
            <div class="item2">
              <div id="electricityConsumption"
                   style="width: 100%;height:90%;"></div>
            </div>
            <div class="item3">
              <div id="water"
                   style="width: 100%;height:90%;"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="bwc2-energy-consumption-cost">
        <div class="bwcecc-bg bwc-bg box-border"></div>
        <div class="chartwrap">
          <div class="common-head">
            <i class="iconfont icon-biaoti"></i>能耗费用
            <span class="underline"
                  style="width: 84%;"></span>
          </div>
          <div id="electricityFees"
               style="width: 49%;height:90%;display: inline-block"></div>
          <div id="chargeForWater"
               style="width: 49%;height:90%;display: inline-block"></div>
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
import { getNowTime, toLocaleString } from '@/utils/validate'
import service from '@/service'
export default {
  name: 'businessTemplate3Park',
  data () {
    return {
      titleName: '',
      timer: '',
      timer1: null,
      date: '',
      tableData: [],
      selectIndex: 1,
      reportUse: 'WORK',
      dateType: 'Month',
      electric: [],
      water: [],
      projectDetail: '',
      industryData: {}
    }
  },
  created () {
    this.projectManagementId = this.$route.query.id
    this.titleName = this.$route.query.name
  },
  mounted () {
    var _this = this // 声明一个变量指向vue实例this,保证作用域一致
    this.timer = setInterval(function () {
      _this.date = _this.getNowTime()// 修改数据date
    }, 1000)

    this.mainEconomicIndicators()
    this.reportRoomRentedAPI()
    this.avgRentPriceAPI()
    this.financialDataAPI()
    this.tenantListAPI()
    this.energyConsumptionAPI()
    this.energyAPI()
    this.industryDataAPI()
    // this.timer1 = setInterval(function () {
    //   if (_this.selectIndex === 1) {
    //     _this.selectIndex = 2
    //     _this.dateType = 'Year'
    //   } else {
    //     _this.selectIndex = 1
    //     _this.dateType = 'Month'
    //   }
    //   _this.energyConsumptionAPI(_this.projectManagementId)
    // }, 10000)
  },
  beforeDestroy () {
    // clearInterval(this.timer)
    // clearInterval(this.timer1)
  },
  computed: {
    getYear () {
      var myDate = new Date()
      var tYear = myDate.getFullYear()
      return tYear
    }
  },
  methods: {
    checkMore () { // 跳转详情
      this.$router.push({
        name: 'tenantDetailsWork',
        query: {
          projectManagementId: this.projectManagementId,
          referred: this.titleName
        }
      })
    },
    getNowTime () {
      return getNowTime()
    },
    toggleTimer (index, type) {
      this.selectIndex = index
      this.dateType = type
      this.energyConsumptionAPI(this.projectManagementId)
    },
    // 主要经济指标
    mainEconomicIndicators () {
      service.http.get(`/cms/api/project-managements/${this.projectManagementId}`).then(res => {
        if (res.status === 200) {
          this.projectDetail = res.data
        }
      })
    },
    // 出租率
    reportRoomRentedAPI () {
      service.http.get(`/cms/api/statistics/reportRoomRented?projectId=${this.projectManagementId}&reportUse=${this.reportUse}`).then(res => {
        if (res.status === 200 && res.data.length > 0) {
          const resData = res.data
          let dateArray = []
          let crData = []

          resData.forEach(ele => {
            dateArray.push(ele.x)
            crData.push(ele.y)
          })
          this.occupancyRate(dateArray, crData)
        }
      })
    },
    // 平均租金
    avgRentPriceAPI () {
      service.http.get(`/cms/api/statistics/avgRentPrice?projectId=${this.projectManagementId}&reportUse=${this.reportUse}`).then(res => {
        if (res.status === 200 && res.data.length > 0) {
          const resData = res.data
          let datearr = []
          let data = []
          resData[0].data.forEach(ele => {
            datearr.push(ele.x)
            data.push(toLocaleString(ele.y))
          })
          this.averageRent(datearr, data)
        }
      })
    },
    // 财务数据统计
    financialDataAPI () {
      service.http.get(`/cms/api/financeCounts/all?projectManagementId=${this.projectManagementId}&reportUse=${this.reportUse}`).then(res => {
        if (res.status === 200 && res.data.length > 0) {
          const resData = res.data
          const target = []
          const netReceipts = []
          const ToBeCollected = []
          let dateArray = []
          resData[0].data.forEach(ele => {
            dateArray.push(ele.x)
          })
          resData.forEach(ele => {
            if (ele.name === '营收目标') {
              ele.data.forEach(ele2 => {
                target.push(ele2.y)
              })
            } else if (ele.name === '实收') {
              ele.data.forEach(ele2 => {
                netReceipts.push(ele2.y)
              })
            } else if (ele.name === '待收') {
              ele.data.forEach(ele2 => {
                ToBeCollected.push(ele2.y)
              })
            }
          })
          this.financialData(dateArray, target, netReceipts, ToBeCollected)
        }
      })
    },
    // 客户列表
    async tenantListAPI () {
      let result = await service.http.get('/cms/api/statistics/tenantList', {
        page: 0,
        size: 5,
        tenantUse: this.reportUse,
        projectManagementId: this.projectManagementId
      })
      this.tableData = result.data
    },
    // 能耗用量
    energyConsumptionAPI () {
      service.http.get(`/cms/api/statistics/energyConsumption/project?projectManagementId=${this.projectManagementId}&reportUse=${this.reportUse}&dateType=${this.dateType}`).then(res => {
        if (res.status === 200) {
          const resData = res.data
          this.electric = (resData.electric).toString().split('')
          this.gas = (resData.gas).toString().split('')
          this.water = (resData.water).toString().split('')

          const dateArray = []
          const electric = []
          const water = []
          resData.data.forEach(ele => {
            dateArray.push(ele.x)
            electric.push(ele.electric)
            water.push(ele.water)
          })
          this.electricityConsumption(dateArray, electric)
          this.useWater(dateArray, water)
        }
      })
    },
    // 能耗费用
    energyAPI () {
      service.http.get(`/cms/api/financeCounts/energy?projectManagementId=${this.projectManagementId}&reportUse=${this.reportUse}`).then(res => {
        if (res.status === 200 && res.data.length > 0) {
          const resData = res.data
          const target = []
          const netReceipts = []
          let dateArray = []
          resData[0].data.forEach(ele => {
            dateArray.push(ele.x)
          })
          resData.forEach(ele => {
            if (ele.name === '电费') {
              ele.data.forEach(ele2 => {
                target.push(ele2.y)
              })
            } else if (ele.name === '水费') {
              ele.data.forEach(ele2 => {
                netReceipts.push(ele2.y)
              })
            }
          })
          this.electricityFees(dateArray, target)
          this.chargeForWater(dateArray, netReceipts)
        }
      })
    },
    // 行业面积/行业租金贡献/行业税收占比
    industryDataAPI () {
      service.http.get(`/cms/api/statistics/industryData?projectId=${this.projectManagementId}&reportUse=${this.reportUse}`).then(res => {
        if (res.status === 200) {
          const resData = res.data
          let area = []
          let rentAmount = []
          let taxAmount = []
          let colorArr = []
          let areaTotal = 0
          resData.forEach(ele => {
            area.push({ value: ele.area, name: ele.industryName })
            rentAmount.push({ value: ele.rentAmount, name: ele.industryName })
            taxAmount.push({ value: ele.taxAmount, name: ele.industryName })
            colorArr.push(ele.color)
            areaTotal += ele.area
          })
          resData.forEach(ele => {
            ele.areaPercentage = (ele.area / areaTotal * 100).toFixed(2)
          })
          this.industryData = resData
          this.contributionRatio(area, colorArr)
          this.contributionRatio2(rentAmount, colorArr)
          this.contributionRatio3(taxAmount, colorArr)
        }
      })
    },
    occupancyRate (dateArray, data) {
      let myChart = echarts.init(document.getElementById('occupancyRate'))
      let option = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          // containLabel: true
          top: '36px',
          left: '40px',
          right: '40px',
          bottom: '50px'
        },
        xAxis: [
          {
            type: 'category',
            name: '年',
            // data: ['2016', '2016', '2016', '2016', '2016'],
            data: dateArray,
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
            name: '%',
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
            name: '出租率',
            type: 'bar',
            barWidth: '20%',
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
            // data: [10, 52, 20, 33, 39]
            data: data
          }
        ]
      }
      myChart.setOption(option)
    },
    averageRent (dateArray, data) {
      let myChart = echarts.init(document.getElementById('averageRent'))
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
          show: false,
          data: ['平均租金'],
          itemHeight: 1,
          icon: 'none',
          textStyle: {
            color: '#E9F0FD'
          }
        },
        grid: {
          top: '36px',
          left: '40px',
          right: '40px',
          bottom: '50px'
        },
        xAxis: [
          {
            type: 'category',
            name: '年',
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
            // data: ['2016', '2016', '2016', '2016', '2016']
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '元/㎡·天',
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
            name: '平均租金',
            type: 'line',
            // stack: '总量',
            symbol: 'none',
            smooth: true,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(0, 127, 255, 0.2)'
                }, {
                  offset: 1,
                  color: 'rgba(0, 127, 255, 0)'
                }])
              }
            },
            itemStyle: {
              normal: {
                color: '#007FFF'
              }
            },
            data: data
            // data: [100, 210, 130, 140, 350, 160, 170, 380, 190, 200, 210, 220, 330, 240, 150, 140, 350, 160, 170, 380, 190, 200, 210, 220, 330, 240, 150]
          }
        ]
      }
      myChart.setOption(option)
    },
    financialData (dateArray, target, netReceipts, ToBeCollected) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('financialData'))
      // myChart.clear()
      // 绘制图表
      var colors = ['#68DF92', '#3F79F7']
      let option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          // left: '3.6%',
          // right: '5%',
          // bottom: '0',
          // containLabel: true
          top: '36px',
          left: '60px',
          right: '40px',
          bottom: '50px'
        },
        legend: {
          x: 'right',
          y: 'top',
          bottom: '0',
          padding: [5, 20, 0, 0],
          icon: 'circle', // 这个字段控制形状
          itemWidth: 8,  // 设置宽度
          itemHeight: 8, // 设置高度
          // itemGap: 40, // 设置间距
          textStyle: {
            color: '#E9F0FD'
          },
          data: ['营收目标', '实收', '待收']
        },
        xAxis: [
          {
            type: 'category',
            name: '年',
            data: dateArray,
            // data: ['2016', '2016', '2018', '2019', '2019'],
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: '#c1cce2'
              }
            },
            axisLabel: {// x轴文字的配置
              show: true,
              textStyle: {
                color: '#c1cce2'
              }
            }
          }
        ],
        yAxis: [
          {
            name: '万元',
            nameTextStyle: {
              color: '#B1A8D1'
            },
            position: 'left',
            type: 'value',
            'axisLine': {       // y轴
              'show': true,
              lineStyle: {
                color: '#DCDCDC', // 颜色
                width: 1 // 粗细
              }
            },
            'axisTick': {       // y轴刻度线
              'show': true
            },
            splitLine: {// 分割线配置
              show: false,
              lineStyle: {
                color: '#B1A8D1'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#B1A8D1'
              }
            }
          }
        ],
        series: [
          {
            name: '营收目标',
            type: 'bar',
            data: target,
            // data: ['2000', '3000', '2200', '2040', '2100'],
            barMaxWidth: '6',
            barGap: '1',
            itemStyle: {
              normal: {
                // barBorderRadius: [2, 2, 0, 0],
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#007FFF' },
                    { offset: 1, color: '#07F6F9' }
                  ]
                )
              }
            }
          },
          {
            name: '实收',
            type: 'bar',
            data: netReceipts,
            // data: ['2000', '3000', '2200', '2040', '2100'],
            barMaxWidth: '6',
            barGap: '1',
            itemStyle: {
              normal: {
                // barBorderRadius: [2, 2, 0, 0],
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#FFFFFF' },
                    { offset: 1, color: '#E5EDFF' }
                  ]
                )
              }
            }
          },
          {
            name: '待收',
            type: 'bar',
            data: ToBeCollected,
            // data: ['2000', '3000', '2200', '2040', '2100'],
            barMaxWidth: '6',
            barGap: '1',
            itemStyle: {
              normal: {
                // barBorderRadius: [2, 2, 0, 0],
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#00F2CE' },
                    { offset: 1, color: '#EFF2BC' }
                  ]
                )
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    },
    contributionRatio (data, colorArr) {
      let myChart = echarts.init(document.getElementById('contributionRatio'))
      myChart.clear()
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
          // formatter: '{a} <br/>{b}: {c}' + '㎡' + '({d}%)'
          formatter: '{a} <br/>{b}：' + '{d}%'
        },
        title: {
          show: true,
          text: '行业',
          x: 'center',
          y: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal',
            color: ['#E9F0FD'],
            padding: [50, 10]
          },
          subtextStyle: {
            color: '#666',
            fontSize: 16
          }
        },
        // color: ['#01FFA0', '#43FFFF', '#6BFDFF', '#1EADFD', '#007FFF'],
        color: colorArr,
        legend: {
          show: false,
          orient: 'vertical',
          itemWidth: 20, // 标志图形的长度
          itemHeight: 10, //
          right: '7%',
          top: 100,
          itemGap: 50,
          data: ['已租', '未租'],
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
            return name + '       ' + target + '㎡' + '  (' + ((percentage) * 100).toFixed(2) + '%' + ')'
          }
        },
        series: [
          {
            name: '行业',
            type: 'pie',
            radius: ['50%', '65%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            stillShowZeroSum: true,
            itemStyle: { // 此配置
              normal: {
                borderWidth: 3,
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
                show: true,
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
    },
    contributionRatio2 (data, colorArr) {
      let myChart = echarts.init(document.getElementById('contributionRatio2'))
      myChart.clear()
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
          formatter: '{a} <br/>{b}：' + '{d}%'
        },
        title: {
          show: true,
          text: '租金',
          x: 'center',
          y: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal',
            color: ['#E9F0FD'],
            padding: [50, 10]
          },
          subtextStyle: {
            color: '#666',
            fontSize: 16
          }
        },
        // color: ['#01FFA0', '#43FFFF', '#6BFDFF', '#1EADFD', '#007FFF'],
        color: colorArr,
        legend: {
          show: false,
          orient: 'vertical',
          itemWidth: 20, // 标志图形的长度
          itemHeight: 10, //
          right: '7%',
          top: 100,
          itemGap: 50,
          data: ['已租', '未租'],
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
            return name + '       ' + target + '㎡' + '  (' + ((percentage) * 100).toFixed(2) + '%' + ')'
          }
        },
        series: [
          {
            name: '租金',
            type: 'pie',
            radius: ['50%', '65%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            stillShowZeroSum: true,
            itemStyle: { // 此配置
              normal: {
                borderWidth: 3,
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
                show: true,
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
    },
    contributionRatio3 (data, colorArr) {
      let myChart = echarts.init(document.getElementById('contributionRatio3'))
      myChart.clear()
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
          formatter: '{a} <br/>{b}：' + '{d}%'
        },
        title: {
          show: true,
          text: '税收',
          x: 'center',
          y: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal',
            color: ['#E9F0FD'],
            padding: [50, 10]
          },
          subtextStyle: {
            color: '#666',
            fontSize: 16
          }
        },
        // color: ['#01FFA0', '#43FFFF', '#6BFDFF', '#1EADFD', '#007FFF'],
        color: colorArr,
        legend: {
          show: false,
          orient: 'vertical',
          itemWidth: 20, // 标志图形的长度
          itemHeight: 10, //
          right: '7%',
          top: 100,
          itemGap: 50,
          data: ['已租', '未租'],
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
            return name + '       ' + target + '㎡' + '  (' + ((percentage) * 100).toFixed(2) + '%' + ')'
          }
        },
        series: [
          {
            name: '税收',
            type: 'pie',
            radius: ['50%', '65%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            stillShowZeroSum: true,
            itemStyle: { // 此配置
              normal: {
                borderWidth: 3,
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
                show: true,
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
    },
    electricityConsumption (dateArray, data) {
      let myChart = echarts.init(document.getElementById('electricityConsumption'))
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
          data: ['用电'],
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
          left: '35px',
          right: '40px',
          bottom: '50px'
        },
        xAxis: [
          {
            type: 'category',
            name: this.dateType === 'Month' ? '月' : '年',
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
            name: '万ｋｗ·ｈ',
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
            name: '用电',
            type: 'line',
            // stack: '总量',
            symbol: 'none',
            smooth: true,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(7, 255, 164,0.2)'
                }, {
                  offset: 1,
                  color: 'rgba(7, 255, 164,0)'
                }])
              }
            },
            itemStyle: {
              normal: {
                color: '#07FFA4'
              }
            },
            data: data
            // data: [100, 210, 130, 140, 350, 160, 170, 380, 190, 200, 210, 220, 330, 240, 150, 140, 350, 160, 170, 380, 190, 200, 210, 220, 330, 240, 150]
          }
        ]
      }
      myChart.setOption(option)
    },
    useWater (dateArray, data) {
      let myChart = echarts.init(document.getElementById('water'))
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
          data: ['用水'],
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
          left: '35px',
          right: '40px',
          bottom: '50px'
        },
        xAxis: [
          {
            type: 'category',
            name: this.dateType === 'Month' ? '月' : '年',
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
            name: '万m³',
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
            name: '用水',
            type: 'line',
            // stack: '总量',
            symbol: 'none',
            smooth: true,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(6, 230, 250, 0.2)'
                }, {
                  offset: 1,
                  color: 'rgba(6, 230, 250, 0)'
                }])
              }
            },
            itemStyle: {
              normal: {
                color: '#06E6FA'
              }
            },
            data: data
            // data: [100, 210, 130, 140, 350, 160, 170, 380, 190, 200, 210, 220, 330, 240, 150, 140, 350, 160, 170, 380, 190, 200, 210, 220, 330, 240, 150]
          }
        ]
      }
      myChart.setOption(option)
    },
    electricityFees (dateArray, data) {
      let myChart = echarts.init(document.getElementById('electricityFees'))
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
          data: ['电费'],
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
          left: '40px',
          right: '40px',
          bottom: '50px'
        },
        xAxis: [
          {
            type: 'category',
            name: '月',
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
            name: '万元',
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
            name: '电费',
            type: 'line',
            // stack: '总量',
            symbol: 'none',
            smooth: true,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(7, 255, 164, 0.2)'
                }, {
                  offset: 1,
                  color: 'rgba(7, 255, 164, 0)'
                }])
              }
            },
            itemStyle: {
              normal: {
                color: '#07FFA4'
              }
            },
            data: data
            // data: [100, 210, 130, 140, 350, 160, 170, 380, 190, 200, 210, 220, 330, 240, 150, 140, 350, 160, 170, 380, 190, 200, 210, 220, 330, 240, 150]
          }
        ]
      }
      myChart.setOption(option)
    },
    chargeForWater (dateArray, data) {
      let myChart = echarts.init(document.getElementById('chargeForWater'))
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
          data: ['水费'],
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
          left: '40px',
          right: '40px',
          bottom: '50px'
        },
        xAxis: [
          {
            type: 'category',
            name: '月',
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
            name: '万元',
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
            name: '水费',
            type: 'line',
            // stack: '总量',
            symbol: 'none',
            smooth: true,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(6, 230, 250, 0.2)'
                }, {
                  offset: 1,
                  color: 'rgba(6, 230, 250, 0)'
                }])
              }
            },
            itemStyle: {
              normal: {
                color: '#06E6FA'
              }
            },
            data: data
            // data: [100, 210, 130, 140, 350, 160, 170, 380, 190, 200, 210, 220, 330, 240, 150, 140, 350, 160, 170, 380, 190, 200, 210, 220, 330, 240, 150]
          }
        ]
      }
      myChart.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../style/config.scss";
.busOperation-wrap-park {
  position: relative;
  height: px2rem(1080 * 2);
  background: url(../../assets/bg3.png) no-repeat;
  background-size: 100% 100%;
  .box-border {
    border: 1px solid #5b5379;
  }
  .bwc-bg {
    background-color: #231e4a;
    opacity: 0.6;
  }
  .flex-end {
    align-self: flex-end;
  }
  .actual-content {
    position: absolute;
    top: 0;
  }
  .common-head {
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
  }
  .color_green {
    color: #07ffa4 !important;
  }
  .noleftmargin {
    margin-left: 0 !important;
  }
  .chartwrap {
    /* width: px2rem(1200);
    height: px2rem(800); */
    margin: 0 auto;
    position: absolute;
    top: 0;
    left: 0;
    color: #e9f0fd;
  }

  .bw-header {
    display: flex;
    justify-content: space-between;
    a {
      width: px2rem(450);
    }
    .home-button {
      // margin: px2rem(100) 0 0 px2rem(100);
      // color: #cfcbdd;
      // font-size: px2rem(36);
      // i {
      //   color: #fff;
      //   font-size: px2rem(42);
      //   margin-right: px2rem(10);
      // }
      background: url("../../assets/tgbtn.png") no-repeat;
      background-size: 100% 100%;
      width: px2rem(100);
      height: px2rem(100);
      margin: px2rem(110) 0 0 px2rem(80);
    }
  }

  .bw-title {
    font-size: px2rem(80);
    font-weight: bold;
    color: #e9f0fd;
    /* width: 78%; */
    text-align: center;
    margin-top: px2rem(114);
  }

  .bw-timewarp {
    font-size: px2rem(36);
    color: #c1cce2;
    margin: px2rem(130) px2rem(100) 0 0;
    min-width: px2rem(355);
  }

  .bw-content1 {
    display: flex;
    .bwc-left {
      width: px2rem(930);
      height: px2rem(1122);
      margin: px2rem(140) 0 0 px2rem(90);
      position: relative;
      .bwcl-bg,
      .bwcl-content {
        width: px2rem(930);
        height: px2rem(1122);
      }
      .bwcl-content {
        img {
          margin: px2rem(40);
          width: px2rem(850);
          height: px2rem(478);
        }
        .economic-indicators {
          display: flex;
          flex-wrap: wrap;
          .ei-item {
            width: 33.3%;
            margin-top: px2rem(40);
            padding-left: px2rem(40);
            div {
              &:first-child {
                color: #fff;
                font-size: px2rem(28);
                margin-bottom: px2rem(10);
              }
              &:last-child {
                color: #fff;
                font-size: px2rem(38);
              }
            }
          }
        }
      }
    }
    .bwc-right {
      display: flex;
      flex-wrap: wrap;
      margin: px2rem(140) 0 0 0;
      > div {
        margin: 0 0 0 px2rem(40);
      }
      .bwcr-occupancy-rate {
        width: px2rem(724);
        height: px2rem(530);
        position: relative;
        .bwcor-bg {
          width: px2rem(724);
          height: px2rem(530);
        }
        .chartwrap {
          width: px2rem(724);
          height: px2rem(530);
        }
      }
      .bwcr-average-rent {
        width: px2rem(882);
        height: px2rem(530);
        position: relative;
        .bwcar-bg,
        .chartwrap {
          width: px2rem(882);
          height: px2rem(530);
        }
      }
      .bwcr-contribution-ratio {
        width: px2rem(1930);
        height: px2rem(530);
        position: relative;
        overflow: hidden;
        .bwcr-bg,
        .chartwrap {
          width: px2rem(1930);
          height: px2rem(530);
        }
        .chartlegend {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          margin: 0 px2rem(40);
          color: #e9f0fd;
          > span {
            width: px2rem(270);
            display: flex;
            justify-content: space-between;
            margin-right: px2rem(40);
            &:nth-of-type(6n) {
              margin-right: 0;
            }
          }
          i {
            display: inline-block;
            width: px2rem(16);
            height: px2rem(16);
            border-radius: 50%;
            margin-right: px2rem(20);
          }
        }
      }
      .bwcr-financial-data {
        width: px2rem(910);
        height: px2rem(522);
        position: relative;
        .bwcfd-bg {
          width: px2rem(910);
          height: px2rem(522);
        }
        .chartwrap {
          width: px2rem(910);
          height: px2rem(522);
        }
      }
      .bwcr-collection-rate {
        width: px2rem(850);
        height: px2rem(522);
        position: relative;
        .bwccr-bg {
          width: px2rem(850);
          height: px2rem(522);
        }
        .chartwrap {
          width: px2rem(850);
          height: px2rem(522);
        }
      }
      .bwcr-tenant-list {
        width: px2rem(850);
        height: px2rem(522);
        position: relative;
        .bwctl-bg,
        .chartwrap {
          width: px2rem(850);
          height: px2rem(522);
        }
        .more {
          color: #5f81d6;
          font-size: px2rem(24);
          cursor: pointer;
          margin-left: px2rem(20);
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
            font-size: px2rem(28);
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
                  color: #06e6fa;
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
          }
        }
      }
    }
  }

  .bw-content2 {
    display: flex;
    .bwc2-energy-consumption {
      width: px2rem(2100);
      height: px2rem(520);
      position: relative;
      margin: px2rem(70) 0 0 px2rem(90);
      .bwcec-bg,
      .chartwrap {
        width: px2rem(2100);
        height: px2rem(520);
      }
      .ec-content {
        display: flex;
        .item1 {
          width: px2rem(720);
          padding-top: px2rem(50);
          > div {
            margin: px2rem(50) 0 0 px2rem(40);
            span {
              &:first-child {
                color: #e9f0fd;
                font-size: px2rem(30);
                margin-right: px2rem(20);
              }
              &.gas-meter {
                margin-right: px2rem(16);
              }
              &.water-meter {
                margin-right: px2rem(45);
              }
            }
          }
        }
        .dbg {
          display: inline-block;
          width: px2rem(42);
          height: px2rem(74);
          line-height: px2rem(74);
          text-align: center;
          font-size: px2rem(40);
          background: linear-gradient(0deg, #26206e, #342c95, #018dfe);
          border: 1px solid;
          border-radius: px2rem(10);
        }
        .item2 {
          width: px2rem(700);
          height: px2rem(500);
          margin-top: px2rem(20);
        }
        .item3 {
          width: px2rem(700);
          height: px2rem(500);
          margin-top: px2rem(20);
        }
        .item4 {
          width: px2rem(700);
          height: px2rem(500);
          margin-top: px2rem(20);
        }
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
    }
    .bwc2-energy-consumption-cost {
      width: px2rem(1520);
      height: px2rem(520);
      position: relative;
      margin: px2rem(70) 0 0 px2rem(40);
      .bwcecc-bg,
      .chartwrap {
        width: px2rem(1520);
        height: px2rem(520);
      }
    }
  }
}
</style>
