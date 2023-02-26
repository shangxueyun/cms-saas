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
           style="opacity: 1;">
        <img :src="companyImage">
      </div>
      <div class="ct-title shop-data">
        财务数据
      </div>
      <div class="data-wrap fleft">
        <div class="basic-data content-bg fleft">
        </div>
        <div class="financial-number">
          <div class="fn-left">
            <div class="bn-item">
              <div class="bi-yellow">{{financeCountData.revenueRate | toLocaleString}}<span class="unit">%</span></div>
              <div>{{getYear}}年预算达成率</div>
            </div>
            <div class="bn-item">
              <div class="bi-order bi-blue">{{financeCountData.amount | toLocaleString}}<span class="unit">元</span></div>
              <div>预算目标</div>
            </div>
            <div class="bn-item">
              <div class="bi-newMember bi-blue">{{financeCountData.sjYearAmount | toLocaleString}}<span class="unit">元</span></div>
              <div>已收金额</div>
            </div>
          </div>
          <div class="fn-center">
            <div class="bn-item">
              <div class="bi-yellow">{{financeCountData.rate | toLocaleString}}<span class="unit">%</span></div>
              <div>本年累计收缴率（账期）</div>
            </div>
            <div class="bn-item">
              <div class="bi-newMember bi-blue">{{financeCountData.ysAmount | toLocaleString}}<span class="unit">元</span></div>
              <div>应收金额</div>
            </div>
            <div class="fn-bottom">
              <div class="bn-item">
                <div class="bi-blue">{{financeCountData.sjAmount | toLocaleString}}<span class="unit">元</span></div>
                <div>已收金额</div>
              </div>
              <div class="bn-item">
                <div class="bi-blue" style="color: #E93CA7">{{financeCountData.qsAmnount | toLocaleString}}<span class="unit">元</span></div>
                <div>欠收金额</div>
              </div>
            </div>
          </div>
          <div class="fn-right">
            <!-- <div class="bn-item">
              <div class="bi-yellow">{{financeCountData.seasonRate | toLocaleString}}<span class="unit">%</span></div>
              <div>当季收缴率（账期）</div>
            </div>
            <div class="bn-item">
              <div class="bi-newMember bi-blue">{{financeCountData.ysSeasonAmount | toLocaleString}}<span class="unit">元</span></div>
              <div>应收金额</div>
            </div>
            <div class="fn-bottom">
              <div class="bn-item">
                <div class="bi-blue">{{financeCountData.sjSeasonAmount | toLocaleString}}<span class="unit">元</span></div>
                <div>已收金额</div>
              </div>
              <div class="bn-item">
                <div class="bi-blue" style="color: #E93CA7">{{financeCountData.qsSeasonAmnount | toLocaleString}}<span class="unit">元</span></div>
                <div>欠收金额</div>
              </div>
            </div> -->
            <div class="current-season" v-for="(item, index) in financeCountData.seasons" :key="index" :class="{'currQuarter': currQuarter === index + 1}">
              <p>第{{index + 1}}季度收缴率 :
                <span class="bi-yellow">
                  {{item.seasonRate | toLocaleString}}<span class="unit">%</span>
                </span>
              </p>
              <p>
                应收金额 :
                <span class="bi-blue">{{item.ysSeasonAmount | toLocaleString}}<span class="unit">元</span></span>
              </p>
              <p>已收金额 :
                <span class="bi-blue">
                  {{item.sjSeasonAmount | toLocaleString}}<span class="unit">元</span>
                </span>
              </p>
              <p>欠收金额 :
                <span class="bi-pink">
                  {{item.qsSeasonAmnount | toLocaleString}}<span class="unit">元</span>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-content clearfix">
      <div class="btc-title" style="position: relative">招商数据
        <div class="timeselect"
            @mouseenter="showPDpanel = true">
          <span>{{selectedArticle}}</span>
          <span class="time-select" style="margin: 2px 0"></span>
        </div>
        <div class="itempanel"
            v-if="showPDpanel">
          <span v-for="(item, index) in articleList"
                :key="index"
                @click="selectArticle(item)">{{item.name}}</span>
        </div>
      </div>
      <div class="delivery-data-bg"></div>
      <div class="delivery-data">
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
          </div>
          <div class="dly-number">
            <div class="dn-item"
                style="border-right: 1px solid #7480aa">
              <div style="font-size: 0.5rem">{{businessData.rentRate | toLocaleString}}<span style="font-size: 0.24rem;">%</span></div>
              <div>出租率</div>
            </div>
            <div class="dn-item">
              <div style="font-size: 0.5rem">{{businessData.rentPrice | toLocaleString}}<span style="font-size: 0.24rem;">元/㎡·天</span></div>
              <div>平均租金</div>
            </div>
          </div>
        </div>
        <div class="basic-number">
          <div class="bn-item">
            <div class="bi-order">{{shopData.allArea | toLocaleString}}<span class="unit">㎡</span></div>
            <div>全部面积</div>
          </div>
          <div class="bn-item">
            <div class="bi-gmv">{{shopData.rentArea | toLocaleString}}<span class="unit">㎡</span></div>
            <div>已租面积</div>
          </div>
          <div class="bn-item">
            <div class="bi-price">{{shopData.readyArea | toLocaleString}}<span class="unit">㎡</span></div>
            <div>可租面积</div>
          </div>
          <div class="bn-item noborder">
            <div class="bi-price" style="color: #E93CA7">{{shopData.getRoomsRate | toLocaleString}}<span class="unit">%</span></div>
            <div>得房率</div>
          </div>
          <div class="bn-item margintop">
            <div class="bi-visit">{{shopData.allShop}}</div>
            <div>全部房源</div>
          </div>
          <div class="bn-item margintop">
            <div class="bi-newVisit">{{shopData.rentShop}}</div>
            <div>已租房源</div>
          </div>
          <div class="bn-item margintop noborder">
            <div class="bi-newMember">{{shopData.readyShop}}</div>
            <div>可租房源</div>
          </div>
        </div>
        <div class="chartwrap">
          <div class="item-title">商铺面积分布</div>
          <div id="areaRatio"
                style="width: 100%;height:100%;"></div>
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
      selectedArticle: '使用面积',
      articleList: [{name: '使用面积', value: 'USING'}, {name: '建筑面积', value: 'BUILDING'}],
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
      currQuarter: 0,
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
    const myDate = new Date()
    const currMonth = myDate.getMonth()
    this.currQuarter = Math.floor((currMonth % 3 === 0 ? (currMonth / 3) : (currMonth / 3 + 1)))
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
      service.http.get(`/rts/api/company/distributionMap?companyCode=${tenantKey}&dataType=${this.dataType}&projectManagementId=${this.mallId}&projectManagementTypeId=${this.TypeId}`).then(res => {
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
                barBorderRadius: [2, 2, 0, 0],
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#39DBF0' },
                    { offset: 1, color: '#5576C3' }
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
    getNowTime (type) {
      var now = new Date()
      var year = now.getFullYear()
      var month = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)
      var day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
      var hour = now.getHours()
      var minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
      var second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()
      var nowdate = ''
      if (type === 'date') {
        nowdate = year + '-' + month + '-' + day
      } else {
        nowdate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      }
      return nowdate
    },
    getShopData () {
      let areaType = this.areaType || 'USING'
      service.http.get('/cms/api/statistics/shopData', { projectManagementId: this.mallId, areaType: areaType, projectManagementTypeId: this.TypeId }).then(res => {
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
      let areaType = this.areaType || 'USING'
      service.http.get('/cms/api/statistics/businessData', { projectManagementId: this.mallId, areaType: areaType, projectManagementTypeId: this.TypeId }).then(res => {
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
      // 默认总计时间
      this.selectedPDtime = this.timeList[0].name
      this.selectPDType = this.timeList[0].type
      this.selectedTime = this.timeList[0].val
      this.selectedBStime = this.timeList[0].name
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
    selectArticle (item) {
      this.selectedArticle = item.name
      this.areaType = item.value
      this.getBusinessData()
      this.getShopData()
    },
    getFinanceCounts () {
      let data = this.getNowTime('date')
      service.http.get('/cms/api/financeCounts/rent', { date: data, projectManagementId: this.mallId, projectManagementTypeId: this.TypeId }).then(res => {
        this.financeCountData = res.data
      })
    },
    getFinanceCounts2 () {
      service.http.get('/cms/api/financeCounts', { date: this.selectedTime, financeType: this.selectPDType, projectManagementId: this.mallId }).then(res => {
        this.financeCountData = res.data
      })
    },
    tenantTurnover () {
      service.http.get('/cms/api/tenantTurnover/tenant', { date: this.selectedTime,
        financeType: this.selectPDType,
        projectManagementId: this.mallId,
        projectManagementTypeId: this.TypeId }).then(res => {
          this.shopList = res.data
          this.selectShop(this.shopList[0])
        })
    },
    selectShop (item) {
      if (item) {
        this.selectedShopItem = item
        this.selectedShop = item.teantName ? item.teantName : item.referred
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
  border: 1px solid #6c81aa!important;
  img {
    width: 100%;
    height: 100%;
  }
}
#container {
  width: px2rem(896);
  height: vh(876);
}
.shop-data {
  left: px2rem(950);
}
.finance-data {
  left: px2rem(2484);
}
.data-wrap {
  width: 72.6%;
  position: relative;
  .basic-data {
    width: 100%;
    height: vh(880);
  }
  .financial-number{
    position: absolute;
    top: vh(50);
    width: 100%;
    border: none!important;
    background-color: transparent;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    margin-left: px2rem(48);
    &:before,
    &:after {
      content: '';
      display: block;
    }
    >div {
      background:rgba(54,64,104,1);
      // border: 2px solid rgba(108,130,170,1);
      border-radius: 4px;
    }
    .fn-left {
      width: px2rem(624);
      height: vh(780);
      .bn-item{
        &:first-child {
          margin: vh(40) 0 vh(140) 0;
        }
      }
    }
    .fn-center {
      width: px2rem(960);
      height: vh(780);
      >.bn-item{
        &:first-child {
          margin: vh(40) 0 vh(140) 0;
        }
      }
    }
    .fn-right {
      width: px2rem(960);
      height: vh(780);
      >.bn-item{
        &:first-child {
          margin: vh(40) 0 vh(140) 0;
        }
      }
      background: none;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      .current-season{
        width: 48%;
        height: 48%;
        border: 1px solid #6c81aa;
        border-radius: 2px;
        background: #364068;
        color: #fff;
        p {
          margin-top: vh(26);
          margin-left: vh(20);
          font-size: px2rem(14);
        }
        .bi-yellow {
          font-size: px2rem(48)!important;
        }
        .bi-blue{
          color: #439AFF;
          font-size: px2rem(32)!important;
        }
        .bi-pink{
          color: rgb(233, 60, 167);
          font-size: px2rem(32)!important;
        }
        .unit{
          font-size: px2rem(18)!important;
        }
        &.currQuarter{
          border: 1px solid #7FBFFF;
          background: rgba(12, 21, 48, 0.5);
        }
      }
    }
    .fn-bottom{
      display: flex;
      justify-content: space-around;
    }
    .bn-item {
      width: 100%;
      height: vh(200);
      // border-right: 1px solid rgba(108,129,170, 0.7);
      text-align: center;
      border-radius: px2rem(4);
      div {
        &:first-child {
          font-size: px2rem(54);
        }
        &:last-child {
          margin-top: vh(20);
          margin-bottom: vh(10);
          font-size: px2rem(26);
        }
      }
      .bi-blue{
        color: #439AFF;
        .unit{
          font-size: px2rem(36);
        }
      }
    }
    .margintop{
      margin-top: vh(80);
    }
    .noborder {
      border: none;
    }
    .unit{
      font-size: px2rem(48);
    }
    .bi-yellow{
      color: #FEB200;
      font-size: px2rem(88)!important;
      +div {
       font-size: px2rem(40)!important; 
      }
    }
  }
}
.bottom-content{
  position: relative;
  margin: vh(75) 0 0 vh(80);
  .timeselect{
    left: 0px;
    top: 0;
    position: relative;
    display: inline-block;
    cursor: pointer;
  }
  .itempanel{
    left: px2rem(200);
    top: px2rem(60);
    position: absolute;
    display: inline-block;
    font-size: px2rem(14);
  }
}
.delivery-data-bg{
  width: 98%;
  // height: px2rem(750);
  height: vh(750);
  background-color: #354068;
  opacity: 0.7;
  position: relative;
  margin-top: vh(30);
  border-radius: px2rem(10);
}
.delivery-data{
  display: flex;
  top: px2rem(30);
  position: absolute;
  top: vh(120);
  .basic-number {
    width: px2rem(1810);
    height: vh(370);
    border: none;
    background-color: transparent;
    display: flex;
    flex-wrap: wrap;
    margin-top: vh(100);
    .bn-item {
      width: px2rem(450);
      height: vh(118);
      border-right: 1px solid rgba(108,129,170, 0.7);
      text-align: center;
      border-radius: px2rem(4);
      div {
        &:first-child {
          font-size: px2rem(50);
        }
        &:last-child {
          margin-top: px2rem(20);
          margin-bottom: px2rem(10);
        }
      }
    }
    .margintop{
      margin-top: vh(260);
    }
    .noborder {
      border: none;
    }
  }
  .unit{
    font-size: px2rem(36);
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
    height: px2rem(650);
    padding-top: vh(250);
    margin-top: 0;
    .flleft {
      width: 50%;
    }
    .item-title{
    }
  }
  .areameasure{
    position: relative;
    .item-title{
      margin-bottom: vh(16);
      text-align: left;
      margin-left: 30px;
      color: #8187E5;
    }
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
  }
  .content-bg{
    background: none;
    opacity: 1;
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
  height: vh(170);
}
.chartwrap {
  width: px2rem(940);
  height: px2rem(500);
  margin: 0 auto;
  margin-top: vh(110);
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
.item-title{
  font-size: px2rem(26);
  color: #fff;
}
</style>

