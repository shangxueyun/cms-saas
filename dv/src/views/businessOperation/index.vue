<template>
  <div class="busOperation-wrap"
       @click="hidepanel">
    <div class="toggle-button" @click="$router.back()"></div>
    <div class="title">
      <span style="left: 8.24rem;">{{titleName}}商业经营数据</span>
    </div>
    <div class="timewarp">
      <span id="time">{{date}}</span>
    </div>
    <div class="top-content clearfix">
      <div class="ct-title"
           @click="login">
        集团案场分布图
      </div>
      <div class="map fleft content-bg"
           id="container"
           style="opacity: 1;border: 1px solid #6c81aa;">
        <img :src="companyImage">
      </div>
      <div class="ct-title shop-data">
        商铺数据
      </div>
      <div class="data-wrap fleft">
        <div class="basic-data content-bg fleft">
          <div class="chartwrap">
            <div class="item-title">商铺面积分布</div>
            <div id="areaRatio"
                 style="width: 90%;height:100%;"></div>
          </div>
        </div>
        <div class="basic-number">
          <div class="bn-item">
            <div class="bi-order">{{shopData.allArea | toLocaleString}}㎡</div>
            <div>全部面积</div>
          </div>
          <div class="bn-item">
            <div class="bi-gmv">{{shopData.rentArea | toLocaleString}}㎡</div>
            <div>已租面积</div>
          </div>
          <div class="bn-item">
            <div class="bi-price">{{shopData.readyArea | toLocaleString}}㎡</div>
            <div>可租面积</div>
          </div>
          <div class="bn-item">
            <div class="bi-visit">{{shopData.allShop | toLocaleString}}</div>
            <div>全部房源</div>
          </div>
          <div class="bn-item">
            <div class="bi-newVisit">{{shopData.rentShop | toLocaleString}}</div>
            <div>已租房源</div>
          </div>
          <div class="bn-item">
            <div class="bi-newMember">{{shopData.readyShop | toLocaleString}}</div>
            <div>可租房源</div>
          </div>
        </div>
      </div>
      <div class="ct-title finance-data">
        财务数据
      </div>
      <div class="timeselect"
           style="left: 27rem;top: -0.67rem;"
           @mouseenter="showPDpanel = true">
        <span>{{selectedPDtime}}</span>
        <span class="time-select"></span>
      </div>
      <div class="itempanel"
           v-if="showPDpanel"
           style="left: 27rem;top: -0.10rem;">
        <span v-for="(item, index) in timeList"
              :key="index"
              @click="selectTime('financeCount', item)">{{item.name}}</span>
      </div>
      <div class="data-wrap2 fleft">
        <div class="dw-bg content-bg"></div>
        <div class="dw-data">
          <span>
            <div style="color: #feb100">{{financeCountData.amount && (financeCountData.amount).toLocaleString()}}元</div>
            <div>{{getYear}}年营收目标</div>
          </span>
          <span>
            <div style="color: #439aff">{{financeCountData.revenueRate | toLocaleString}}%</div>
            <div>{{getYear}}年营收目标达成率</div>
          </span>
          <span>
            <div style="color: #439aff">{{financeCountData.ysAmount && (financeCountData.ysAmount).toLocaleString()}}元</div>
            <div>应收金额</div>
          </span>
          <span>
            <div style="color: #439aff">{{financeCountData.sjAmount && (financeCountData.sjAmount).toLocaleString()}}元</div>
            <div>已收金额</div>
          </span>
          <span>
            <div style="color: #439aff">{{financeCountData.qsAmnount && (financeCountData.qsAmnount).toLocaleString()}}元</div>
            <div>欠收金额</div>
          </span>
          <span>
            <div style="color: #e93ca7">{{financeCountData.rate | toLocaleString}}%</div>
            <div>收缴率</div>
          </span>
          <ul class="ultitle">
            <li>费项</li>
            <li>应收/元</li>
            <li>已收/元</li>
            <li>欠收/元</li>
            <li>收缴率/%</li>
          </ul>
          <ul>
            <li>租金</li>
            <li>{{financeCountData.rentYsAmount && (financeCountData.rentYsAmount).toLocaleString()}}</li>
            <li>{{financeCountData.rentSjAmount && (financeCountData.rentSjAmount).toLocaleString()}}</li>
            <li>{{financeCountData.rentQsAmount && (financeCountData.rentQsAmount).toLocaleString()}}</li>
            <li>{{financeCountData.rentRate}}</li>
          </ul>
          <ul>
            <li>物业费</li>
            <li>{{financeCountData.propertyYsAmount && (financeCountData.propertyYsAmount).toLocaleString()}}</li>
            <li>{{financeCountData.propertySjAmount && (financeCountData.propertySjAmount).toLocaleString()}}</li>
            <li>{{financeCountData.propertyQsAmount && (financeCountData.propertyQsAmount).toLocaleString()}}</li>
            <li>{{financeCountData.propertyRate}}</li>
          </ul>
          <ul style="border: none">
            <li>保证金</li>
            <li>{{financeCountData.depositYsAmount && (financeCountData.depositYsAmount).toLocaleString()}}</li>
            <li>{{financeCountData.depositSjAmount && (financeCountData.depositSjAmount).toLocaleString()}}</li>
            <li>{{financeCountData.depositQsAmount && (financeCountData.depositQsAmount).toLocaleString()}}</li>
            <li>{{financeCountData.depositRate}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="bottom-content clearfix">
      <div class="delivery-data fleft">
        <div class="btc-title">招商数据</div>
        <div class="dly-wrap">
          <div class="dly-content content-bg clearfix">
            <div style="width: 100%" class="areameasure">
              <ul class="type-ul" v-show="showAreaType">
                <li v-for="(item, index) in areaTypeList" @click="selectType(item)">{{item.name}}</li>
              </ul>
              <div class="item-title">
                {{currentAreaType}}面积占比
                <span class="time-select" style="margin: 2px 0px;" @mouseenter="showAreaType = true" v-if="areaTypeList.length > 1"></span>
              </div>
              <div id="operationArea"
                   style="width: 100%;height:90%;"></div>
            </div>
            <!-- <div class="flleft">
              <div class="item-title">业态数量占比</div>
              <div id="operationQuantity" style="width: 100%;height:90%;"></div>
            </div> -->
          </div>
          <div class="dly-number">
            <div class="dn-item"
                 style="border-right: 1px solid #7480aa">
              <div style="font-size: 0.5rem">{{businessData.rentRate}}<span style="font-size: 0.24rem;">%</span></div>
              <div>出租率</div>
            </div>
            <div class="dn-item">
              <div style="font-size: 0.5rem">{{businessData.rentPrice}}<span style="font-size: 0.24rem;">元/㎡·天</span></div>
              <div>平均租金</div>
            </div>
          </div>
        </div>
      </div>
      <div class="business-data fleft">
        <div class="btc-title">商户数据</div>
        <div class="timeselect"
             style="left: 2.08rem;top: 0.16rem;width: 1.50rem;"
             @mouseenter="showBSpanel = true">
          <span>{{selectedBStime}}</span>
          <span class="time-select"></span>
        </div>
        <div class="itempanel"
             v-if="showBSpanel"
             style="left: 2rem;top: 0.6rem">
          <span v-for="(item, index) in timeList"
                :key="index"
                @click="selectTime('business', item)">{{item.name}}</span>
        </div>
        <div class="business-content content-bg">
          <div class="business-wrap">
            <!-- <div class="bw-img">
              <img :src="selectedShopLogo">
            </div> -->
            <div class="bw-name">
              <span>{{selectedShop}}</span>
              <span class="time-select"
                    @mouseenter="showShopList = true"></span>
            </div>
            <div class="itempanel"
                 v-if="showShopList"
                 style="width: 4rem;left: 2.08rem;top: 1.62rem;height: 2rem;overflow-y: scroll;overflow-x: hidden">
              <span v-for="(item, index) in shopList"
                    :key="index"
                    @click="selectShop(item)">
                {{item.teantName ? item.teantName : item.referred}}
              </span>
            </div>
          </div>
          <div style="display: inline-block;">
            <div class="item-title"
                 style="margin-top: 0.8rem;margin-left: 0.5rem;text-align: left;padding-left: 2.22rem;">营业额</div>
            <div class="bw-chart">
              <div id="turnover"
                   style="width: 80%;height:100%;"></div>
              <div class="bw-order">
                <div style="font-size: 0.50rem">{{turnoverNum | toLocaleString}}<span style="font-size: 0.24rem">元</span></div>
                <div style="font-size: 0.26rem">营业额</div>
              </div>
            </div>
          </div>
          <div style="display: inline-block;">
            <div class="item-title"
                 style="margin-top: 0.8rem;margin-left: 0.5rem;text-align: left;padding-left: 2.22rem;">坪效(月)</div>
            <div class="bw-chart">
              <div id="effect"
                   style="width: 80%;height:100%;"></div>
              <div class="bw-order">
                <div style="font-size: 0.50rem">{{turnoverAmountSum | toLocaleString}}<span style="font-size: 0.24rem">元/㎡</span></div>
                <div style="font-size: 0.26rem">坪效(月)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import map from '../../assets/map_mq.png'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
import service from '@/service'
export default {
  name: 'businessOperation',
  data () {
    return {
      mallId: '',
      titleName: '',
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
      selectedALLtime: '近1月',
      shopId: '',
      tabIndex: 0,
      polygonArray: [],
      center: '',
      Message: {
        nickname: '',
        shopOrderDTOS: [{
          orderDetailsDTOS: [{ goodsName: '', goodsNum: '' }]
        }]
      },
      showMessage: false,
      timer: '',
      date: new Date(),
      shopData: { allArea: '' },
      businessData: { rentRate: '' },
      industryData: [],
      financeCountData: { amount: '' },
      selectedTime: '',
      selectedShopItem: '',
      turnoverNum: '',
      turnoverAmountSum: '',
      dataType: '',
      companyImage: map,
      shopNum: [],
      areaTypeList: [],
      currentAreaType: '业态',
      showAreaType: false
    }
  },
  created () {
    this.TypeId = this.$route.query.TypeId
    this.mallId = this.$route.query.id
    this.titleName = this.$route.query.name
    this.dataType = this.$route.query.dataType
    this.companyImage = this.$route.query.pictureUrl
    this.getShopData()
    this.getBusinessData()
    this.financeDate()
    this.getFinanceCounts()
    this.tenantTurnover()
  },
  mounted () {
    // this.areaRatio()
    // this.operationArea()
    // this.operationQuantity()
    var _this = this // 声明一个变量指向vue实例this,保证作用域一致
    this.timer = setInterval(function () {
      _this.date = _this.getNowTime()// 修改数据date
    }, 1000)
  },
  computed: {
    getYear () {
      var myDate = new Date()
      var tYear = myDate.getFullYear()
      return tYear
    }
  },
  methods: {
    login () {
      sessionStorage.removeItem('token')
      service.user.login('admin', 'admin')
    },
    hidepanel () {
      this.showBSpanel = false
      this.showPDpanel = false
      this.showShopList = false
      this.showAreaType = false
    },
    getCorporateDatatype () {
      let tenantKey = localStorage.getItem('tenantKey')
      // let tenantKey = 'danran'
      service.http.get(`/rts/api/company/distributionMap?companyCode=${tenantKey}&dataType=${this.dataType}&projectManagementId=${this.mallId}`).then(res => {
        console.log('res', res.data)
        if (res.data.map) {
          this.companyImage = res.data.map
        }
      })
    },
    areaRatio (dateArray, visit, visitmax) {
      let myChart = echarts.init(document.getElementById('areaRatio'))
      let option = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          show: false,
          data: [
            {
              name: '商铺数量',
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
          left: '10%',
          top: 55,
          bottom: '10%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['0-50', '50-100', '100-200', '200-500', '500-800', '800-1000', '1000以上'],
            // data: dateArray,
            axisPointer: {
              type: 'shadow'
            },
            axisTick: {
              alignWithLabel: true
            },
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
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: 0,
            // max: visitmax,
            minInterval: 1,
            // max: 100,
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
            name: '商铺数量',
            type: 'bar',
            barWidth: '20%',
            itemStyle: {
              normal: {
                barBorderRadius: [4, 4, 0, 0],
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#94f2d2' },
                    { offset: 1, color: '#3db6f3' }
                  ]
                )
              }
            },
            label: { show: false, color: '#fff' },
            // data: [10, 52, 20, 33, 39, 33, 22]
            data: this.shopNum
          }
        ]
      }
      myChart.setOption(option)
    },
    operationArea (name, dateArray) {
      let myChart = echarts.init(document.getElementById('operationArea'))
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}㎡ ({d}%)'
        },
        series: [
          {
            name: name + '面积占比',
            type: 'pie',
            radius: ['50%', '40%'],
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: true,
                color: '#c1cce2',
                formatter: '{b}: {d}%'
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
              show: true,
              length: 20,
              length2: 20
            },
            data: dateArray
            // data: [
            //   {value: 30,
            //     name: '娱乐',
            //     itemStyle: {
            //       color: {
            //         colorStops: [{
            //           offset: 0, color: '#ff8489' // 0% 处的颜色
            //         }, {
            //           offset: 1, color: '#f06165' // 100% 处的颜色
            //         }]
            //       }
            //     }},
            //   {value: 70,
            //     name: '生活配套',
            //     itemStyle: {
            //       color: {
            //         colorStops: [{
            //           offset: 0, color: '#6f8eff' // 0% 处的颜色
            //         }, {
            //           offset: 1, color: '#5e74ec' // 100% 处的颜色
            //         }]
            //       }
            //     }},
            //   {value: 70,
            //     name: '亲子',
            //     itemStyle: {
            //       color: {
            //         colorStops: [{
            //           offset: 0, color: '#fa397a' // 0% 处的颜色
            //         }, {
            //           offset: 1, color: '#fa397a' // 100% 处的颜色
            //         }]
            //       }
            //     }},
            //   {value: 70,
            //     name: '零售',
            //     itemStyle: {
            //       color: {
            //         colorStops: [{
            //           offset: 0, color: '#ff8282' // 0% 处的颜色
            //         }, {
            //           offset: 1, color: '#ff9393' // 100% 处的颜色
            //         }]
            //       }
            //     }},
            //   {value: 70,
            //     name: '餐饮',
            //     itemStyle: {
            //       color: {
            //         colorStops: [{
            //           offset: 0, color: '#86a1fe' // 0% 处的颜色
            //         }, {
            //           offset: 1, color: '#7679ec' // 100% 处的颜色
            //         }]
            //       }
            //     }}
            // ]
            // color: {
            //   colorStops: [{
            //     offset: 0, color: '#068cff' // 0% 处的颜色
            //   }, {
            //     offset: 1, color: '#4549ff' // 100% 处的颜色
            //   }]
            // }
          }
        ]
      }
      myChart.setOption(option)
    },
    operationQuantity (dateArray) {
      let myChart = echarts.init(document.getElementById('operationQuantity'))
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '业态数量占比',
            type: 'pie',
            radius: ['50%', '40%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                color: '#c1cce2',
                formatter: '{b}: {d}%'
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
              show: true,
              length: 10,
              length2: 10
            },
            data: dateArray
            // data: [
            //   {value: 30,
            //     name: '娱乐',
            //     itemStyle: {
            //       color: {
            //         colorStops: [{
            //           offset: 0, color: '#ff8489' // 0% 处的颜色
            //         }, {
            //           offset: 1, color: '#f06165' // 100% 处的颜色
            //         }]
            //       }
            //     }},
            //   {value: 70,
            //     name: '生活配套',
            //     itemStyle: {
            //       color: {
            //         colorStops: [{
            //           offset: 0, color: '#6f8eff' // 0% 处的颜色
            //         }, {
            //           offset: 1, color: '#5e74ec' // 100% 处的颜色
            //         }]
            //       }
            //     }},
            //   {value: 70,
            //     name: '亲子',
            //     itemStyle: {
            //       color: {
            //         colorStops: [{
            //           offset: 0, color: '#fa397a' // 0% 处的颜色
            //         }, {
            //           offset: 1, color: '#fa397a' // 100% 处的颜色
            //         }]
            //       }
            //     }},
            //   {value: 70,
            //     name: '零售',
            //     itemStyle: {
            //       color: {
            //         colorStops: [{
            //           offset: 0, color: '#ff8282' // 0% 处的颜色
            //         }, {
            //           offset: 1, color: '#ff9393' // 100% 处的颜色
            //         }]
            //       }
            //     }},
            //   {value: 70,
            //     name: '餐饮',
            //     itemStyle: {
            //       color: {
            //         colorStops: [{
            //           offset: 0, color: '#86a1fe' // 0% 处的颜色
            //         }, {
            //           offset: 1, color: '#7679ec' // 100% 处的颜色
            //         }]
            //       }
            //     }}
            // ]
            // color: {
            //   colorStops: [{
            //     offset: 0, color: '#068cff' // 0% 处的颜色
            //   }, {
            //     offset: 1, color: '#4549ff' // 100% 处的颜色
            //   }]
            // }
          }
        ]
      }
      myChart.setOption(option)
    },
    turnover (dateArray, order, max) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('turnover'))
      // 绘制图表
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          top: 24,
          bottom: '10%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
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
            // data: ['3.1', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2']
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: 0,
            // max: max,
            // max: 500,
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
            name: '营业额',
            type: 'line',
            stack: '总量',
            smooth: true,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(255,86,97,0.6)'
                }, {
                  offset: 1,
                  color: 'rgba(255,86,97,0)'
                }])
              }
            },
            itemStyle: {
              normal: {
                color: '#ff5661'
              }
            },
            data: order
            // data: [100, 210, 130, 140, 350, 160, 170, 380, 190, 200, 210, 220, 330, 240, 150, 140, 350, 160, 170, 380, 190, 200, 210, 220, 330, 240, 150]
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () { myChart.resize() })
    },
    effect (dateArray, order, max) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('effect'))
      // 绘制图表
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          top: 24,
          bottom: '10%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
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
            // data: ['3.1', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2', '3.2']
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: 0,
            // max: max,
            // max: 500,
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
            name: '坪效(月)',
            type: 'line',
            stack: '总量',
            smooth: true,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(0,109,243,0.6)'
                }, {
                  offset: 1,
                  color: 'rgba(47,56,99,0)'
                }])
              }
            },
            itemStyle: {
              normal: {
                color: '#1c72d5'
              }
            },
            data: order
            // data: [100, 210, 130, 140, 350, 160, 170, 380, 190, 200, 210, 220, 330, 240, 150, 140, 350, 160, 170, 380, 190, 200, 210, 220, 330, 240, 150]
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () { myChart.resize() })
    },
    getNowTime () {
      var now = new Date()
      var year = now.getFullYear()
      var month = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)
      var day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
      var hour = now.getHours()
      var minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
      var second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()
      var nowdate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      return nowdate
    },
    getShopData () {
      service.http.get('/cms/api/statistics/shopData', { projectManagementId: this.mallId, projectManagementTypeId: this.TypeId }).then(res => {
        this.shopData = res.data
        this.shopNum = []
        this.shopData.shopAreas.forEach(item => {
          this.shopNum.push(item.shopNum)
        })
        this.areaRatio()
        // console.log(this.shopNum)
      })
    },
    getBusinessData () {
      service.http.get('/cms/api/statistics/businessData', { projectManagementId: this.mallId, projectManagementTypeId: this.TypeId }).then(res => {
        this.businessData = res.data
        this.industryData = res.data.industryData
        this.FormatAnalysisData = res.data.useDTOS
        let areaArray = []
        let operationArray = []
        this.FormatAnalysisData[0].value.forEach(ele => {
          areaArray.push(
            {
              value: ele.area,
              name: ele.industryName,
              itemStyle: {
                color: ele.color
              }
            }
          )
          operationArray.push(
            {
              value: ele.num,
              name: ele.industryName,
              itemStyle: {
                color: ele.color
              }
            }
          )
        })
        let colorStops = [
          {
            offset: 0, color: '#ff8489' // 0% 处的颜色
          }, {
            offset: 1, color: '#f06165' // 100% 处的颜色
          },
          {
            offset: 0, color: '#6f8eff' // 0% 处的颜色
          }, {
            offset: 1, color: '#5e74ec' // 100% 处的颜色
          },
          {
            offset: 0, color: '#fa397a' // 0% 处的颜色
          }, {
            offset: 1, color: '#fa397a' // 100% 处的颜色
          },
          {
            offset: 0, color: '#ff8282' // 0% 处的颜色
          }, {
            offset: 1, color: '#ff9393' // 100% 处的颜色
          },
          {
            offset: 0, color: '#86a1fe' // 0% 处的颜色
          }, {
            offset: 1, color: '#7679ec' // 100% 处的颜色
          }]
        console.log(colorStops)
        let areaTypeList = []
        res.data.useDTOS.forEach(ele => {
          areaTypeList.push({name: ele.tenantUseIndustry})
        })
        this.areaTypeList = areaTypeList
        this.currentAreaType = this.areaTypeList[0].name
        this.operationArea(this.currentAreaType, areaArray)
        // this.operationQuantity(operationArray)
      })
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
      console.log('timeList', this.timeList)
      // 默认总计时间
      this.selectedPDtime = this.timeList[0].name
      this.selectPDType = this.timeList[0].type
      this.selectedTime = this.timeList[0].val
      this.selectedBStime = this.timeList[0].name
      console.log(this.timeList)
    },
    selectTime (type, item) {
      this.selectedTime = item.val
      if (type === 'financeCount') {
        this.selectPDType = item.type
        this.selectedPDtime = item.name
        this.getFinanceCounts()
        this.showPDpanel = false
      }
      if (type === 'business') {
        this.selectBSType = item.type
        this.selectedBStime = item.name
        this.showBSpanel = false
        this.selectShop(this.selectedShopItem)
      }
    },
    getFinanceCounts () {
      service.http.get('/cms/api/financeCounts', { date: this.selectedTime, financeType: this.selectPDType, projectManagementId: this.mallId }).then(res => {
        console.log(res)
        this.financeCountData = res.data
      })
    },
    tenantTurnover () {
      service.http.get('/cms/api/tenantTurnover/tenant', { date: this.selectedTime,
        financeType: this.selectPDType,
        projectManagementId: this.mallId,
        projectManagementTypeId: this.TypeId }).then(res => {
          console.log(res)
          this.shopList = res.data
          this.selectShop(this.shopList[0])
        })
    },
    selectShop (item) {
      if (item) {
        this.selectedShopItem = item
        this.selectedShop = item.shopName ? item.teantName : item.referred
        this.tenantTurnoverDetail(item.id)
      }
    },
    tenantTurnoverDetail (contractId) {
      service.http.get('/cms/api/tenantTurnover/tenant/detail', { date: this.selectedTime,
        financeType: this.selectBSType,
        tenantId: contractId,
        projectManagementTypeId: this.TypeId }).then(res => {
          let dateArray = []
          let turnoverAmount = []
          let rentRate = []
          if (res.data && res.data.length > 0) {
            this.turnoverNum = res.data[0].turnoverAmountSum
            this.turnoverAmountSum = res.data[0].rentRateSum
            res.data.forEach(ele => {
              if (this.selectBSType === 'Month') {
                dateArray.push(ele.recordDate.substring(5))
              } else {
                dateArray.push(ele.recordDate.substring(5, 7))
              }
              turnoverAmount.push(ele.turnoverAmount)
              rentRate.push(ele.rentRate)
            })
          }
          let turmax = Math.max.apply(null, turnoverAmount)
          let rentmax = Math.max.apply(null, rentRate)
          this.turnover(dateArray, turnoverAmount, turmax)
          this.effect(dateArray, rentRate, rentmax)
        })
    },
    selectType (item) {
      this.currentAreaType = item.name
      let resData = this.FormatAnalysisData.filter(ele => {
        return item.name === ele.tenantUseIndustry
      })
      let areaArray = []
      resData[0].value.forEach(ele => {
        areaArray.push(
          {
            value: ele.area,
            name: ele.industryName,
            itemStyle: {
              color: ele.color
            }
          }
        )
      })
      this.operationArea(this.currentAreaType, areaArray)
      this.showAreaType = false
    }
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../style/mqO2O.scss";
ul li {
  list-style: none;
}
.busOperation-wrap {
  position: relative;
  .toggle-button {
    position: absolute;
    width: px2rem(114);
    height: px2rem(114);
    top: px2rem(20);
    left: px2rem(80);
    cursor: pointer;
    background: url(../../assets/tgbtn.png) no-repeat;
    background-size: cover;
  }
}
.title {
  background: url(../../assets/titlebg.png) no-repeat;
  background-position: px2rem(20);
  background-size: contain;
  text-align: center;
  > span {
    position: static !important;
    font-size: px2rem(100);
    font-family: MicrosoftYaHei-Bold;
    font-weight: bold;
    color: rgba(255, 255, 255, 0);
    line-height: px2rem(180);
    -webkit-text-stroke: 1px rgba(255, 255, 255, 1);
    text-stroke: 1px rgba(255, 255, 255, 1);
    color: #e7f0ff;
    left: px2rem(900);
    // top: px2rem(66);
  }
}
.map {
  border: none;
  img {
    width: 100%;
    height: 100%;
  }
}
#container {
  width: px2rem(900);
}
.shop-data {
  left: px2rem(950);
}
.finance-data {
  left: px2rem(2484);
}
.data-wrap {
  width: px2rem(1483);
  .basic-data {
    width: 100%;
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
  margin-left: px2rem(65);
  .dw-bg {
    width: px2rem(1177);
    height: px2rem(896);
    margin-left: px2rem(48);
  }
  .dw-data {
    position: absolute;
    // width: px2rem(1182);
    height: 100%;
    top: 0;
    left: px2rem(48);
    span {
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
    }
    ul {
      display: flex;
      border-bottom: 1px solid#6070a3;
      li {
        color: #fff;
        width: 20%;
        text-align: center;
        font-size: px2rem(30);
        height: px2rem(100);
        line-height: px2rem(100);
      }
    }
    .ultitle {
      margin-top: px2rem(50);
      background-color: #354068;
      border: none;
      li {
        color: #92a0c0;
        height: px2rem(80);
        line-height: px2rem(80);
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
  .areameasure{
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
    .item-title{
      margin-bottom: vh(16);
      text-align: left;
      margin-left: 30px;
      color: #8187E5;
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
  width: px2rem(940);
  height: px2rem(400);
  margin: 0 auto;
  margin-top: px2rem(450);
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
</style>

