<template>
  <div class="comprehensive" @click="hidepanel">
    <a href="javascript:void(0)">
      <div class="toggle-button" @click="$router.back()"></div>
    </a>
    <div class="title">
      <span>{{titleName}}综合数据</span>
    </div>
    <div class="timewarp">
      <span id="time">{{date}}</span>
    </div>
    <div class="ch-wrap">
      <div class="cw-left-bg">
      </div>
      <div class="cw-left">
        <div class="cl-title">
          <span class="spot"></span>
          <span>商业经营数据</span>
        </div>
        <div class="clt-content">
          <span>商铺数据</span>
          <div class="clt-wrap">
            <div>
              <div>{{shopData.allArea | toLocaleString}}</div>
              <div>全部面积/㎡</div>
            </div>
            <div>
              <div>{{shopData.rentArea | toLocaleString}}</div>
              <div>已租面积/㎡</div>
            </div>
            <div>
              <div>{{shopData.readyArea | toLocaleString}}</div>
              <div>可租面积/㎡</div>
            </div>
            <div>
              <div>{{shopData.allShop | toLocaleString}}</div>
              <div>全部房源</div>
            </div>
            <div>
              <div>{{shopData.rentShop | toLocaleString}}</div>
              <div>已租房源</div>
            </div>
            <div>
              <div>{{shopData.readyShop | toLocaleString}}</div>
              <div>可租房源</div>
            </div>
          </div>
          <div class="underline"></div>
          <span>招商数据</span>
          <div class="clt-att-wrap">
            <div>
              <div class="caw-data">
                <div>{{businessData.rentRate}}<span style="font-size: 0.24rem;">%</span></div>
                <div>
                  <div class="underline sm-underline"></div>
                </div>
                <div>出租率</div>
              </div>
              <div class="caw-char" style="width: 140%;position: relative;left: 20%;">
                <div id="operation" style="width: 100%;height:70%;"></div>
                <div style="text-align:center;padding-right: 0;padding-top: 0.2rem">
                  <span style="color: #C0CDE2">业态面积占比</span>
                </div>
              </div>
            </div>
            <div>
              <div class="caw-data">
                <div style="color: #439AFF">{{businessData.rentPrice}}</div>
                <div>
                  <div class="underline sm-underline"></div>
                </div>
                <div>平均租金/元/㎡·天</div>
              </div>
              <!-- <div class="caw-char" style="width: 100%">
                <div id="operationNum" style="width: 100%;height:70%;"></div>
                <div style="text-align:center;padding-right: 0.96rem;padding-top: 0.2rem">
                  <span style="color: #C0CDE2">业态数量占比</span>
                </div>
              </div> -->
            </div>
          </div>
          <div class="underline"></div>
          <span style="position: relative;">财务数据
            <div class="timeselect" style="left: 2.08rem;top: -0.67rem;" @mouseenter="showPDpanel = true">
              <span>{{selectedPDtime}}</span>
              <span class="time-select"></span>
            </div>
            <div class="itempanel" v-if="showPDpanel" style="left: 2.08rem;top: -0.1rem;">
              <span v-for="(item, index) in fnTimeList" :key="index" @click="selectTime('financeCount', item)">{{item.name}}</span>
            </div>
          </span>
          <div class="clt-fa-wrap">
            <div>
              <div>
                <div style="color: #FEB100" v-if="financeCountData.amount">{{(financeCountData.amount).toLocaleString()}}</div>
                <div>年度营收目标/元</div>
              </div>
              <div class="border-left"></div>
              <div>
                <div>{{financeCountData.revenueRate | toLocaleString}}%</div>
                <div>年度营目标达成率</div>
              </div>
              <div class="border-left"></div>
              <div>
                <div>{{financeCountData.rate | toLocaleString}}%</div>
                <div>收缴率</div>
              </div>
            </div>
            <div>
              <div>
                <div v-if="financeCountData.ysAmount">{{(financeCountData.ysAmount).toLocaleString()}}</div>
                <div>应收金额/元</div>
              </div>
              <div class="border-left"></div>
              <div>
                <div v-if="financeCountData.sjAmount">{{(financeCountData.sjAmount).toLocaleString()}}</div>
                <div>已收金额/元</div>
              </div>
              <div class="border-left"></div>
              <div>
                <div style="color: #E93CA7" v-if="financeCountData.qsAmnount">{{(financeCountData.qsAmnount).toLocaleString()}}</div>
                <div>欠收金额/元</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="cw-center" v-bind:style="{backgroundImage: 'url(' + backgroundImg + ')'}">
      </div>
      <div class="cw-right">
        <div class="cr-o2o-bg"></div>
        <div class="cr-o2o">
          <div class="cl-title">
            <span class="spot"></span>
            <span style="position: relative;">O2O业务数据
              <div class="timeselect" style="left: 3.35rem;top: -0.67rem;" @mouseenter="showO2Opanel = true">
                <span>{{selectedO2Otime}}</span>
                <span class="time-select"></span>
              </div>
              <div class="itempanel" v-if="showO2Opanel" style="left: 3.35rem;top: -0.1rem;">
                <span v-for="(item, index) in timeList" :key="index" @click="selectTime('O2O', item)">{{item.name}}</span>
              </div>
            </span>
            <div class="clt-wrap">
              <div>
                <div>{{basicData.order | toLocaleString}}</div>
                <div>订单量</div>
              </div>
              <div>
                <div>{{basicData.gmv | toLocaleString}}</div>
                <div>GMV/元</div>
              </div>
              <div>
                <div>{{basicData.price | toLocaleString}}</div>
                <div>客单价/元</div>
              </div>
              <div>
                <div>{{basicData.visit | toLocaleString}}</div>
                <div>访客数</div>
              </div>
              <div>
                <div>{{basicData.newVisit | toLocaleString}}</div>
                <div>新访客数</div>
              </div>
              <div>
                <div>{{basicData.newMember | toLocaleString}}</div>
                <div>新增会员数</div>
              </div>
            </div>
            <div class="cro-char" style="margin: 0.1rem 0 0 -0.16rem">
              <div class="chart-item mg-bottom">
                <div class="item-title">订单量</div>
                <div id="orderQuantity" style="width: 100%;height:100%;"></div>
              </div>
              <div class="chart-item mg-bottom">
                <div class="item-title">GMV</div>
                <div id="GMV" style="width: 100%;height:100%;"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="cr-o2o-bg cr-property-bg"></div>
        <div class="cr-o2o cr-property">
          <div class="cl-title" style="margin-right: 0.6rem;">
            <span class="spot"></span>
            <span>物业管理数据</span>
            <div class="clt-wrap">
              <div>
                <div>{{fireControlCount}}</div>
                <div>监控总数</div>
              </div>
              <div>
                <div>{{fireControlData.warn}}</div>
                <div>告警总数</div>
              </div>
              <div>
                <div>{{fireControlData.issue}}</div>
                <div>离线总数</div>
              </div>
              <div>
                <div>{{fireControlData.normalRate}}%</div>
                <div>状态正常率</div>
              </div>
              <div>
                <div>{{fireControlData.alarmRate}}%</div>
                <div>设备告警率</div>
              </div>
              <div>
                <div>{{fireControlData.OfflineRate}}%</div>
                <div>设备离线率</div>
              </div>
            </div>
            <div class="cro-char ept-prop">
              <div>
                <div id="fireControl" style="width: 100%;height:70%;"></div>
                <div style="text-align:center;height: 0.2rem;line-height: 0.2rem;">
                  <span style="color: #C0CDE2;font-size: 0.2rem;">消防设备数量占比</span>
                </div>
              </div>
              <div>
                <div id="fault" style="width: 100%;height:70%;"></div>
                <div style="text-align:center;height:0.2rem;line-height:0.2rem;">
                  <span style="color: #C0CDE2;font-size: 0.2rem;">故障设备占比</span>
                </div>
              </div>
              <div>
                <div id="police" style="width: 100%;height:70%;"></div>
                <div style="text-align:center;height: 0.2rem;line-height: 0.2rem;">
                  <span style="color: #C0CDE2;font-size: 0.2rem;">设备报警占比</span>
                </div>
              </div>
            </div>
            <div class="legend">
              <span>
                <i class="ygbj"></i>烟感报警器
              </span>
              <span>
                <i class="xfs"></i>消防栓
              </span>
              <span>
                <i class="xfsx"></i>消防水箱
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import backgroundImg from '../../assets/comprehensive1.png'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')
import service from '@/service'
export default {
  name: 'comprehensive',
  data () {
    return {
      fireControlCount: 1516,
      fireControlData: {},
      titleName: '',
      selectedPDtime: '',
      showPDpanel: false,
      showO2Opanel: false,
      selectedO2Otime: '近6月',
      selectO2OType: 'HALFYEAR',
      timeList: [
        {val: 'MONTH', name: '近1月'},
        {val: 'HALFYEAR', name: '近6月'}
      ],
      fnTimeList: [],
      selectedTime: '',
      mallId: '',
      shopData: {allArea: ''},
      businessData: {rentRate: ''},
      industryData: [],
      financeCountData: {},
      basicData: {order: ''},
      timer: null,
      date: new Date(),
      dataType: '',
      backgroundImg: backgroundImg
    }
  },
  created () {
    this.mallId = this.$route.query.id
    this.titleName = this.$route.query.name
    this.dataType = this.$route.query.dataType
    this.backgroundImg = this.$route.query.pictureUrl
    // this.mallId = '17'
    this.financeDate()
    this.getShopData()
    this.getFinanceCounts()
    this.getBusinessData()
    this.bascData()
    this.device_status_num() // 各类设备当前状态数量统计
  },
  mounted () {
    this.police()
    var _this = this // 声明一个变量指向vue实例this,保证作用域一致
    this.timer = setInterval(function () {
      _this.date = _this.getNowTime()// 修改数据date
    }, 1000)
  },
  methods: {
    getCorporateDatatype () {
      let tenantKey = localStorage.getItem('tenantKey')
      // let tenantKey = 'danran'
      service.http.get(`/rts/api/company/distributionMap?companyCode=${tenantKey}&dataType=${this.dataType}&projectManagementId=${this.mallId}`).then(res => {
        if (res.data.map) {
          this.backgroundImg = res.data.map
        }
      })
    },
    hidepanel () {
      this.showO2Opanel = false
      this.showPDpanel = false
    },
    getNowTime () {
      var now = new Date()
      var year = now.getFullYear()
      var month = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)
      var day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
      var hour = now.getHours()
      var minute = now.getMinutes()
      var second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()
      var nowdate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      return nowdate
    },
    operationArea (dateArray) {
      let myChart = echarts.init(document.getElementById('operation'))
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '业态面积占比',
            type: 'pie',
            radius: ['50%', '60%'],
            center: ['49%', '54%'],
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: true,
                color: '#c1cce2',
                fontSize: '10',
                formatter: '{b}: {d}%'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '10',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              show: true,
              length: 4,
              length2: 8
            },
            data: dateArray
            // data: [
            //   {value: 30,
            //     name: '男',
            //     itemStyle: {
            //       color: {
            //         colorStops: [{
            //           offset: 0, color: '#068cff' // 0% 处的颜色
            //         }, {
            //           offset: 1, color: '#4549ff' // 100% 处的颜色
            //         }]
            //       }
            //     }},
            //   {value: 70,
            //     name: '女',
            //     itemStyle: {
            //       color: {
            //         colorStops: [{
            //           offset: 0, color: '#702ffe' // 0% 处的颜色
            //         }, {
            //           offset: 1, color: '#b611e9' // 100% 处的颜色
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
      let myChart = echarts.init(document.getElementById('operationNum'))
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '业态面积占比',
            type: 'pie',
            radius: ['30%', '40%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: true,
                color: '#c1cce2',
                fontSize: '10',
                formatter: '{b}: {d}%'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '10',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              show: true,
              length: 4,
              length2: 8
            },
            data: dateArray
            // data: [
            //   {value: 30,
            //     name: '男',
            //     itemStyle: {
            //       color: {
            //         colorStops: [{
            //           offset: 0, color: '#068cff' // 0% 处的颜色
            //         }, {
            //           offset: 1, color: '#4549ff' // 100% 处的颜色
            //         }]
            //       }
            //     }},
            //   {value: 70,
            //     name: '女',
            //     itemStyle: {
            //       color: {
            //         colorStops: [{
            //           offset: 0, color: '#702ffe' // 0% 处的颜色
            //         }, {
            //           offset: 1, color: '#b611e9' // 100% 处的颜色
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
    fireControl (dataArray) {
      let myChart = echarts.init(document.getElementById('fireControl'))
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        title: {
          text: '',
          x: 'center',
          y: 'center',
          textStyle: {
            color: '#fff',
            fontSize: '10em',
            fontWeight: 'normal'
          },
          subtextStyle: {
            color: 'rgba(255,255,255,.45)',
            fontSize: 12,
            fontWeight: 'normal'
          }
        },
        series: [
          {
            name: '消防设备数量占比',
            type: 'pie',
            radius: ['50%', '60%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                color: '#c1cce2',
                formatter: '{b}: {d}%'
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
            data: dataArray
            // data: [
            //   {value: 16,
            //     name: '',
            //     itemStyle: {
            //       color: {
            //         colorStops: [{
            //           offset: 0, color: '#068cff' // 0% 处的颜色
            //         }, {
            //           offset: 1, color: '#4549ff' // 100% 处的颜色
            //         }]
            //       }
            //     }},
            //   {value: 84,
            //     name: '',
            //     itemStyle: {
            //       color: {
            //         colorStops: [{
            //           offset: 0, color: '#702ffe' // 0% 处的颜色
            //         }, {
            //           offset: 1, color: '#b611e9' // 100% 处的颜色
            //         }]
            //       }
            //     }}
            // ]
          }
        ]
      }
      myChart.setOption(option)
    },
    fault (dataArray) {
      let myChart = echarts.init(document.getElementById('fault'))
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        title: {
          text: '',
          x: 'center',
          y: 'center',
          textStyle: {
            color: '#fff',
            fontSize: '10em',
            fontWeight: 'normal'
          },
          subtextStyle: {
            color: 'rgba(255,255,255,.45)',
            fontSize: 14,
            fontWeight: 'normal'
          }
        },
        series: [
          {
            name: '故障设备占比',
            type: 'pie',
            radius: ['50%', '60%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                color: '#c1cce2',
                formatter: '{b}: {d}%'
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
            data: dataArray
            // data: [
            //   {value: 16,
            //     name: '故障设备占比',
            //     itemStyle: {
            //       color: {
            //         colorStops: [{
            //           offset: 0, color: '#068cff' // 0% 处的颜色
            //         }, {
            //           offset: 1, color: '#4549ff' // 100% 处的颜色
            //         }]
            //       }
            //     }},
            //   {value: 84,
            //     name: '故障设备占比',
            //     itemStyle: {
            //       color: {
            //         colorStops: [{
            //           offset: 0, color: '#702ffe' // 0% 处的颜色
            //         }, {
            //           offset: 1, color: '#b611e9' // 100% 处的颜色
            //         }]
            //       }
            //     }}
            // ]
          }
        ]
      }
      myChart.setOption(option)
    },
    police (dataArray) {
      let myChart = echarts.init(document.getElementById('police'))
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        title: {
          text: '',
          x: 'center',
          y: 'center',
          textStyle: {
            color: '#fff',
            fontSize: '10em',
            fontWeight: 'normal'
          },
          subtextStyle: {
            color: 'rgba(255,255,255,.45)',
            fontSize: 14,
            fontWeight: 'normal'
          }
        },
        series: [
          {
            name: '设备报警占比',
            type: 'pie',
            radius: ['50%', '60%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                color: '#c1cce2',
                formatter: '{b}: {d}%'
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
            data: dataArray
            // data: [
            //   {value: 16,
            //     name: '故障设备占比',
            //     itemStyle: {
            //       color: {
            //         colorStops: [{
            //           offset: 0, color: '#068cff' // 0% 处的颜色
            //         }, {
            //           offset: 1, color: '#4549ff' // 100% 处的颜色
            //         }]
            //       }
            //     }},
            //   {value: 84,
            //     name: '故障设备占比',
            //     itemStyle: {
            //       color: {
            //         colorStops: [{
            //           offset: 0, color: '#702ffe' // 0% 处的颜色
            //         }, {
            //           offset: 1, color: '#b611e9' // 100% 处的颜色
            //         }]
            //       }
            //     }}
            // ]
          }
        ]
      }
      myChart.setOption(option)
    },
    orderQuantity (dateArray, order, max) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('orderQuantity'))
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
          right: '12%',
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
            // min: 0,
            // max: max,
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
            name: '总订单量',
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
    GMV (dateArray, gmv, max) {
      let myChart = echarts.init(document.getElementById('GMV'))
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
          right: '12%',
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
            // min: 0,
            // max: max,
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
            name: 'GMV',
            type: 'line',
            stack: '总量',
            smooth: true,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(116,65,204,0.8)'
                }, {
                  offset: 1,
                  color: 'rgba(180,150,230,0)'
                }])
              }
            },
            itemStyle: {
              normal: {
                color: '#7e43dc'
              }
            },
            data: gmv
            // data: [100, 210, 130, 140, 350, 160, 170, 380, 190, 200, 210, 220, 330, 240, 150, 140, 350, 160, 170, 380, 190, 200, 210, 220, 330, 240, 150]
          }
        ]
      }
      myChart.setOption(option)
    },
    selectTime (type, item) {
      if (type === 'O2O') {
        this.selectO2OType = item.val
        this.selectedO2Otime = item.name
        this.bascData()
        this.showO2Opanel = false
      }
      if (type === 'financeCount') {
        this.selectPDType = item.type
        this.selectedPDtime = item.name
        this.selectedTime = item.val
        this.getFinanceCounts()
        this.showPDpanel = false
      }
    },
    financeDate () {
      let timeList = []
      var now = new Date()
      var year = now.getFullYear()
      var month = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)
      var timeListLength = Number(now.getMonth() + 1)
      timeList.push({val: year + '-' + month + '-01', name: year + '至今', type: 'Year'})
      for (let i = 1; i < timeListLength; i++) {
        if (i < 10) {
          i = '0' + i
        }
        timeList.push({val: year + '-' + i + '-01', name: year + '-' + i, type: 'Month'})
      }
      this.fnTimeList = timeList
      // 默认总计时间
      this.selectedPDtime = this.fnTimeList[0].name
      this.selectPDType = this.fnTimeList[0].type
      this.selectedTime = this.fnTimeList[0].val
    },
    getFinanceCounts () {
      service.http.get('/cms/api/financeCounts', {date: this.selectedTime, financeType: this.selectPDType, projectManagementId: this.mallId}).then(res => {
        this.financeCountData = res.data
      })
    },
    getShopData () {
      service.http.get('/cms/api/statistics/shopData', {projectManagementId: this.mallId}).then(res => {
        this.shopData = res.data
      })
    },
    getBusinessData () {
      service.http.get('/cms/api/statistics/businessData', {projectManagementId: this.mallId}).then(res => {
        this.businessData = res.data
        this.industryData = res.data.industryData
        let areaArray = []
        let operationArray = []
        this.industryData.forEach(ele => {
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
        this.operationArea(areaArray)
        this.operationQuantity(operationArray)
      })
    },
    bascData () {
      service.http.get('/rts/api/statistics', {'statisticsVM': this.selectO2OType, 'mallId': this.mallId}).then(res => {
        if (res.status === 200) {
          this.basicData.order = res.data.order
          this.basicData.gmv = res.data.gmv
          this.basicData.price = res.data.price
          this.basicData.visit = res.data.visit
          this.basicData.newVisit = res.data.newVisit
          this.basicData.newMember = res.data.newMember
          let dateArray = []
          let order = []
          let gmv = []
          let visit = []
          let newVisit = []
          let newMember = []
          res.data.reportForms.forEach(ele => {
            // if (ele.mallId === Number(this.mallId)) {
            if (this.selectO2OType === 'MONTH') {
              dateArray.push(ele.countDate.substring(5))
            } else {
              dateArray.push(ele.countDate.substring(5, 7))
            }
            order.push(ele.order)
            gmv.push(ele.gmv)
            visit.push(ele.visit)
            newVisit.push(ele.newVisit)
            newMember.push(ele.newMember)
            // }
          })
          let max = Math.max.apply(null, order)
          let GMVmax = Math.max.apply(null, gmv)
          this.orderQuantity(dateArray, order, max)
          this.GMV(dateArray, gmv, GMVmax)
        }
      })
    },
    device_status_num () {
      service.http.get('/tmg/rest/firepm/device_status_num').then(res => {
        if (res.status === 200) {
          let fireControlData = {count: 0, warn: 0, issue: 0, plmdCount: 0, xfsxCount: 0, dqCount: 0}
          let deviceStatusNum = res.data.ret.value
          let colorArr = ['#1c7ef6', '#f9387f', '#04e0f9']
          let xfsbData = []
          let gzsbData = []
          let sbbjData = []
          for (let i = 0; i < deviceStatusNum.length; i++) {
            for (let j = 0; j < colorArr.length; j++) {
              if (i === j) {
                deviceStatusNum[i].color = colorArr[j]
              }
            }
          }
          deviceStatusNum.forEach(ele => {
            if (ele.appid === 9) {
              this.fhmztData = ele
            }
            if (ele.appid === 16) {
              this.dqhzData = ele
              fireControlData.dqCount = ele.count
            }
            if (ele.appid === 2) {
              fireControlData.plmdCount = ele.count
            }
            if (ele.appid === 5) {
              fireControlData.xfsxCount = ele.count
            }
            fireControlData.count += Number(ele.count)
            fireControlData.warn += Number(ele.warn)
            fireControlData.issue += Number(ele.issue)
            if (ele.appid === 2 || ele.appid === 5 || ele.appid === 9) {
              xfsbData.push(
                {
                  value: ele.count,
                  name: ele.appName,
                  itemStyle: {
                    color: ele.color
                  }
                }
            )
            }
            gzsbData.push(
              {
                value: ele.warn,
                name: ele.appName,
                itemStyle: {
                  color: ele.color
                }
              }
            )
            sbbjData.push(
              {
                value: ele.issue,
                name: ele.appName,
                itemStyle: {
                  color: ele.color
                }
              }
            )
          })
          fireControlData.normalRate = ((this.fireControlCount - fireControlData.warn - fireControlData.issue) / this.fireControlCount * 100).toFixed(2)
          fireControlData.alarmRate = (fireControlData.warn / this.fireControlCount * 100).toFixed(2)
          fireControlData.OfflineRate = (fireControlData.issue / this.fireControlCount * 100).toFixed(2)
          this.fireControlData = fireControlData
          this.fireControl(xfsbData)
          this.fault(gzsbData)
          this.police(sbbjData)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../style/mqO2O.scss";
  .comprehensive{
    position: relative;
    height: 100%;
    // background: url(../../assets/comprehensive1.png) no-repeat;
    // background-size: cover;
    .toggle-button{
      position: absolute;
      width: px2rem(114);
      height: px2rem(114);
      top: px2rem(20);
      left: px2rem(80);
      cursor: pointer;
      background: url(../../assets/tgbtn.png) no-repeat;
      background-size: contain;
    }
    .title{
      background: url(../../assets/titlebg.png) no-repeat;
      background-position: px2rem(20);
      background-size: contain;
      span {
        position: absolute;
        font-size: px2rem(100);
        font-family:MicrosoftYaHei-Bold;
        color:rgba(255,255,255,0);
        line-height: px2rem(56);
        -webkit-text-stroke:1px rgba(255,255,255,1);
        text-stroke:1px rgba(255,255,255,1);  
        color: #e7f0ff;
        left: px2rem(900);
        top: px2rem(66);
      }
    }
    .ch-wrap{
      display: flex;
      justify-content: space-between;
      position: relative;
      .cw-left-bg{
        position: absolute;
        width: px2rem(1136);
        height: px2rem(1948);
        background:rgba(12,21,48,0.5);
        border: 1px solid #5d75a1;
        box-shadow:0px 0px px2rem(40) 0px rgba(12,21,48,0.3);
        border-radius: px2rem(8);
        left: px2rem(80);
        top: px2rem(-100);
        // -moz-border-top-color: rgba(96,170,255,0.5);
        // border-top-color: rgba(96,170,255,0.5);
      }
      .cw-left{
        position: absolute;
        width: px2rem(1136);
        height: px2rem(1948);
        left: px2rem(80);
        top: px2rem(-100);
        .cl-title{
          font-size: px2rem(50);
          color:rgba(255,255,255,1);
          margin: px2rem(58) 0 0 px2rem(60);
          .spot{
            display: inline-block;
            width: px2rem(20);
            height: px2rem(20);
            background:#932d78;
            border-radius: 50%;
            margin-right: px2rem(20);
          }
        }
        .clt-content{
          margin: px2rem(50) 0 0 px2rem(55);
          > span{
            font-size: px2rem(46);
            color:rgba(255,255,255,1);
          }
          .clt-wrap{
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            margin-top: px2rem(40);
            > div{
              width: px2rem(280);
              height: px2rem(118);
              margin-bottom: px2rem(50);
              div{
                &:first-child{
                  font-size: px2rem(50);
                  color:rgba(254,177,0,1);
                  margin-bottom: px2rem(20);
                }
                font-size: px2rem(26);
                color:rgba(255,255,255,1);
              }
            }
          }
          .underline{
            width: px2rem(962);
            height: px2rem(2);
            background:rgba(67,154,255,1);
            opacity: 0.3;
            margin-bottom: px2rem(50);
            background: -webkit-linear-gradient(left, rgba(96,170,255, 0.1), rgba(96,170,255,1), rgba(96,170,255,0.1)); /* Safari 5.1 - 6.0 */
            background: -o-linear-gradient(left, rgba(96,170,255,0.1), rgba(96,170,255,1), rgba(96,170,255,0.1)); /* Opera 11.1 - 12.0 */
            background: -moz-linear-gradient(left, rgba(96,170,255,0.1), rgba(96,170,255,1), rgba(96,170,255,0.1)); /* Firefox 3.6 - 15 */
            background: linear-gradient(to right, rgba(96,170,255,0.1), rgba(96,170,255,1), rgba(96,170,255,0.1)); /* 标准的语法（必须放在最后） */
          }
          .sm-underline {
            width: px2rem(188);
            height: 1px;
            margin: 0 auto;
            margin-bottom: px2rem(10);
          }
          .border-left{
            width: 1px!important;
            height: px2rem(110);
            border: 1px solid rgba(69,92,137,1);
            margin-right: px2rem(28);
          }
          .clt-att-wrap{
            display: flex;
            justify-content: space-between;
            > div {
              width: 50%;
              .caw-data{
                margin: px2rem(50) 0 0 0;
                padding-right: px2rem(200);
                div{
                  text-align: center;
                  &:first-child{
                    font-size: px2rem(50);
                    color:rgba(254,177,0,1);
                  }
                }
                font-size: px2rem(26);
                color:rgba(255,255,255,1);
              }
              .caw-char{
                height: px2rem(440);
                width: 100%;
              }
            }
          }
          .clt-fa-wrap{
            > div{
              width: px2rem(1036);
              height: px2rem(170);
              background:rgba(19,30,72,1);
              border: 1px solid rgba(93,117,161,1);
              border-radius: px2rem(6);
              margin-top: px2rem(30);
              display: flex;
              padding: px2rem(30) 0 0 px2rem(24);
              div{
                justify-content: space-between;
                width: px2rem(330);
                &:nth-child(2) {
                  width: px2rem(320);
                }
                &:nth-child(3) {
                  // width: px2rem(290);
                }
                div{
                  font-size: px2rem(26);
                  color:rgba(255,255,255,1);
                  &:first-child{
                    font-size: px2rem(35);
                    margin-bottom: px2rem(10);
                  }
                }
              }
            }
          }
        }
      }
      .cw-center{
        position: absolute;
        width: px2rem(1345);
        height: px2rem(1880);
        top: px2rem(-67);
        left: px2rem(1230);
        // background: url(../../assets/comprehensive1.png) no-repeat;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: 0 40px;
      }
      .cw-right{
        position: absolute;
        width: px2rem(1136);
        height: px2rem(1948);
        right: px2rem(80);
        top: px2rem(-100);
        .cr-o2o-bg{
          position: absolute;
          width: px2rem(1135);
          height: px2rem(911);
          background: rgba(12, 21, 48, 0.5);
          border: 1px solid #5d75a1;
          box-shadow: 0px 0px px2rem(40) 0px rgba(12, 21, 48, 0.3);
          border-radius: px2rem(8);
        }
        .cr-o2o{
          width: px2rem(1135);
          height: px2rem(911);
          position: absolute;
          .cl-title{
            font-size: px2rem(50);
            color: white;
            margin: px2rem(58) 0 0 px2rem(60);
            .spot{
              display: inline-block;
              width: px2rem(20);
              height: px2rem(20);
              background: #932d78;
              border-radius: 50%;
              margin-right: px2rem(20);
            }
          }
          .clt-wrap{
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            margin-top: px2rem(40);
            > div{
              width: px2rem(280);
              height: px2rem(118);
              margin-bottom: px2rem(50);
              div{
                &:first-child{
                  font-size: px2rem(45);
                  color:rgba(254,177,0,1);
                  margin-bottom: px2rem(20);
                }
                font-size: px2rem(26);
                color:rgba(255,255,255,1);
              }
            }
          }
          .cro-char{
            display: flex;
            justify-content: space-between;
            > div{
              width: 50%;
              height: px2rem(260);
            }
          }
        }
        .cr-property-bg{
          top: px2rem(1000);
          height: px2rem(940);
        }
        .cr-property{
          top: px2rem(1000);
          height: px2rem(940);
          .clt-wrap{
            > div{
              width: px2rem(301);
              height: px2rem(155);
              border: 1px solid rgba(108,129,170,1);
              background:rgba(20,33,86,1);
              border-radius: px2rem(6);
              padding: px2rem(20) 0 0 px2rem(30);
              div{
                &:first-child{
                  margin-bottom: px2rem(10);
                  color: #fff;
                }
              }
            }
          }
          .legend{
            font-size: px2rem(16);
            color:rgba(137,149,203,1);
            text-align: center;
            i{
              display: inline-block;
              width: px2rem(21);
              height: px2rem(8);
              border-radius: px2rem(4);
              margin: 0 px2rem(10);
            }
            i.ygbj{
              background:rgba(28,126,246,1);
            }
            i.xfs{
              background:rgba(249,56,127,1);
            }
            i.xfsx{
              background:rgba(4,224,249,1);
            }
          }
        }
      }
    }
    .timeselect{
      width: px2rem(200);
      top: px2rem(10)!important;
    }
    .itempanel{
      top: px2rem(50)!important;
      font-size: px2rem(26);
      height: auto;
    }
    .ept-prop{
      > div{
        width: 33%;
      }
    }
  }
</style>
