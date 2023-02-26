<template>
  <div class="mq-wrap"
       @click="hidepanel">
    <a href="javascript:void(0)">
      <div class="toggle-button"
           @click="$router.back()"></div>
    </a>
    <div class="title">
      <span style="left: 7.6rem">{{titleName}}O2O业务数据</span>
      <div class="timeselect"
           @mouseenter="showALLpanel = true">
        <span>{{selectedALLtime}}</span>
        <span class="time-select"></span>
      </div>
      <div class="itempanel"
           v-if="showALLpanel">
        <span v-for="(item, index) in timeList"
              :key="index"
              @click="selectTime('all', item)">{{item.name}}</span>
      </div>
    </div>
    <div class="timewarp">
      <span id="time">{{date}}</span>
    </div>
    <transition name="fade">
      <div class="message-push"
           v-if="showMessage">
        <div class="mp-img"
             style="margin-left: 0.5rem">
          <img :src="Message.imageUrl"
               v-if="Message.user && Message.user.imageUrl">
          <img src="../../assets/imageUrl.png"
               v-else>
        </div>
        <div style="">
          <p style="margin-bottom: 0.1rem"
             v-if="Message.user">{{Message.user.nickname}}</p>
          <p>{{Message.contactNumber}}</p>
        </div>
        <div style="color: #1e5a8e;width: 5.7rem;">
          <p style="height: 0.8rem;overflow: hidden;"
             v-if="Message.shopOrderDTOS">{{Message.shopOrderDTOS[0].orderDetailsDTOS[0].goodsName}}等{{Message.shopOrderDTOS[0].orderDetailsDTOS[0].goodsNum}}件商品</p>
          <p>订单金额{{Message.totalFee}}元</p>
        </div>
        <div style="color: #666666">1分钟前</div>
      </div>
    </transition>
    <div class="top-content clearfix">
      <div class="ct-title"
           @click="login">
        平台数据
      </div>
      <div class="timeselect"
           style="left: 2.08rem;top: -0.67rem;width: 100px;"
           @mouseenter="showPDpanel = true">
        <span>{{selectedPDtime}}</span>
        <span class="time-select"></span>
      </div>
      <div class="itempanel"
           v-if="showPDpanel"
           style="left: 2.08rem;top: -0.10rem;">
        <span v-for="(item, index) in timeList"
              :key="index"
              @click="selectTime('platform', item)">{{item.name}}</span>
      </div>
      <div class="map fleft"
           id="container"
           style="border: 1px solid #5d75a1;">
      </div>
      <div class="data-wrap fleft">
        <div class="basic-data content-bg fleft">
          <div class="chart-wrap">
            <div class="chart-item mg-bottom">
              <div class="item-title">订单量</div>
              <div id="orderQuantity"
                   style="width: 100%;height:100%;"></div>
            </div>
            <div class="chart-item mg-bottom">
              <div class="item-title">GMV</div>
              <div id="GMV"
                   style="width: 100%;height:100%;"></div>
            </div>
            <div class="chart-item mg-bottom"
                 style="position: relative;">
              <div class="item-title">各类型订单</div>
              <div id="variousTypes"
                   style="width: 100%;height:100%;"></div>
              <div class="item-title"
                   style="position: absolute;left: 15%;bottom: -15%;white-space:nowrap;">
                <span style="color: #ff9156;margin: 0 3px;font-size: 0.12rem">美丽餐桌</span>
                <span style="color: #007efa;margin: 0 3px;font-size: 0.12rem">外卖</span>
                <span style="color: #007efa;margin: 0 3px:font-size: 0.12rem">生鲜</span>
                <span style="color: #e4bb15;margin: 0 3px:font-size: 0.12rem">卡券</span>
                <span style="color: #ae36ff;margin: 0 3px:font-size: 0.12rem">其他零售</span>
              </div>
            </div>
            <div class="chart-item">
              <div class="item-title">访客数</div>
              <div id="Visitor"
                   style="width: 100%;height:100%;"></div>
            </div>
            <div class="chart-item">
              <div class="item-title">新增访客数</div>
              <div id="newVisitor"
                   style="width: 100%;height:100%;"></div>
            </div>
            <div class="chart-item">
              <div class="item-title">新客户数</div>
              <div id="NewClient"
                   style="width: 100%;height:100%;"></div>
            </div>
          </div>
        </div>
        <div class="basic-number"
             style="z-index: 0;">
          <div class="bn-item">
            <div class="bi-order">{{basicData.order | toLocaleString}}</div>
            <div>订单量</div>
          </div>
          <div class="bn-item">
            <div class="bi-gmv">{{basicData.gmv | toLocaleString}}</div>
            <div>GMV/元</div>
          </div>
          <div class="bn-item">
            <div class="bi-price">{{basicData.price | toLocaleString}}</div>
            <div>客单价</div>
          </div>
          <div class="bn-item">
            <div class="bi-visit">{{basicData.visit | toLocaleString}}</div>
            <div>访客数</div>
          </div>
          <div class="bn-item">
            <div class="bi-newVisit">{{basicData.newVisit | toLocaleString}}</div>
            <div>新访客数</div>
          </div>
          <div class="bn-item">
            <div class="bi-newMember">{{basicData.newMember | toLocaleString}}</div>
            <div>新增会员数</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-content clearfix">
      <div class="delivery-data fleft">
        <div class="btc-title">配送数据</div>
        <div class="dly-wrap">
          <div class="dly-content content-bg">
            <div class="dlyc-left">
              <span v-for="(item, index) in dlycList"
                    :key="index"
                    @click="selectDlyc(index)"
                    :class="{active:  index === tabIndex}"
                    class="activeSelect">{{item}}</span>
            </div>
          </div>
          <div class="dlyc-right">
            <span class="dr1"
                  v-if="tabIndex === 0">
              <img src="../../assets/car.png">
              <p>全国首家采用汽车进行外卖配送，保证食物快速送达到顾客，又保证了配送员的安全</p>
            </span>
            <span class="dr2"
                  v-if="tabIndex === 1">
              <img src="../../assets/people.png"
                   style="height: 90%">
              <p>经过国内知名物业绿城集团，严格的培训包括：电话沟通礼仪、见面礼仪等，并且公司内部对配送员采取严格的打分制，保证配送员的服务质量。</p>
            </span>
            <span class="dr3"
                  v-if="tabIndex === 2">
              <img src="../../assets/box.png"
                   style="height: 90%">
              <p>采用高密度EPP泡沫箱，保证食物的温度。并且满天星O2O外卖平台为了保证品质，配送不同的类型的食物采用不同的保温箱，比如有只配送生鲜、只配送饮品的、只配送饭的。</p>
            </span>
          </div>
          <div class="dly-number">
            <div class="dn-item"
                 style="border-right: 1px solid #7480aa">
              <div>7</div>
              <div>配送员数量</div>
            </div>
            <div class="dn-item">
              <div>34.5<span style="font-size: 0.24rem;">min</span></div>
              <div>平均配送时长</div>
            </div>
          </div>
        </div>
      </div>
      <div class="user-data fleft">
        <userData />
      </div>
      <div class="business-data fleft">
        <div class="btc-title">商家数据</div>
        <div class="timeselect"
             style="left: 2.08rem;top: 0.16rem;width: 1.31rem;"
             @mouseenter="showBSpanel = true">
          <span>{{selectedBStime}}</span>
          <span class="time-select"></span>
        </div>
        <div class="itempanel"
             v-if="showBSpanel"
             style="left: 2.08rem;top: 0.62rem">
          <span v-for="(item, index) in timeList"
                :key="index"
                @click="selectTime('business', item)">{{item.name}}</span>
        </div>
        <div class="business-content content-bg">
          <div class="business-wrap">
            <div class="bw-img">
              <img :src="selectedShopLogo">
            </div>
            <div class="bw-name">
              <span>{{selectedShop}}</span>
              <span class="time-select"
                    @mouseenter="showShopList = true"></span>
            </div>
            <div class="itempanel"
                 v-if="showShopList"
                 style="width: 4rem;left: 2.08rem;top: 0.62rem;height: 2rem;overflow-y: scroll;overflow-x: hidden">
              <span v-for="(item, index) in shopList"
                    :key="index"
                    @click="selectShop(item)">
                {{item.shopName}}
              </span>
            </div>
          </div>
          <div class="item-title"
               style="margin-top: 1.40rem;margin-left: 0.50rem;text-align: left;padding-left: 2.22rem;">订单量</div>
          <div class="bw-chart">
            <div id="orderQuantity2"
                 style="width: 80%;height:100%;"></div>
            <div class="bw-order">
              <div style="font-size: 0.64rem">{{orderCount | toLocaleString}}</div>
              <div style="font-size: 0.26rem;white-space:nowrap;">订单量</div>
            </div>
          </div>
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
import service from '@/service'
import AMap from 'AMap'
import userData from './components/userData'
import ellipseImg from '@/assets/ellipse.png'
let map
export default {
  name: 'O2O',
  components: {
    userData
  },
  data () {
    return {
      mallId: '',
      titleName: '',
      ellipse: ellipseImg,
      basicData: {
        order: ''
      },
      timeList: [
        { val: 'MONTH', name: '近1月' },
        { val: 'HALFYEAR', name: '近6月' }
      ],
      dlycList: ['配送车辆', '配送员', '保温箱'],
      shopList: [],
      showShopList: false,
      showBSpanel: false,
      showPDpanel: false,
      showALLpanel: false,
      selectedShop: '',
      selectedShopLogo: '',
      orderCount: '',
      selectBSType: 'HALFYEAR',
      selectPDType: 'HALFYEAR',
      selectedBStime: '近6月',
      selectedPDtime: '近6月',
      selectedALLtime: '近6月',
      shopId: '',
      tabIndex: 0,
      polygonArray: [],
      center: '',
      centerlist: [],
      Message: {
        nickname: '',
        contactNumber: '',
        shopOrderDTOS: [{
          orderDetailsDTOS: [{ goodsName: '', goodsNum: '' }]
        }]
      },
      showMessage: false,
      timer: null,
      date: new Date()
    }
  },
  created () {
    this.mallId = this.$route.query.id
    this.titleName = this.$route.query.name
    this.getshop()
    // if (this.mallId) {
    //   this.businessFind(this.mallId)
    // }
    this.businessFind(this.mallId)
    this.getNowTime()
    this.bascData()
  },
  mounted () {
    this.longPol()
    var _this = this // 声明一个变量指向vue实例this,保证作用域一致
    this.timer = setInterval(function () {
      _this.date = _this.getNowTime()// 修改数据date
    }, 1000)
    // this.orderQuantity2()
  },
  methods: {
    login () {
      service.user.corporateCustomers('hongqiao')
      sessionStorage.removeItem('token')
      service.user.login('admin', '123456')
    },
    hidepanel () {
      this.showBSpanel = false
      this.showPDpanel = false
      this.showALLpanel = false
      this.showShopList = false
    },
    businessFind (id) {
      service.http.get(`/rts/api/business-districts/${id}`).then(res => {
        if (res.data.length >= 0) {
          this.center = [121.472644, 31.231706]
          this.centerlist = res.data
        } else {
          this.center = [res.data.lng, res.data.lat]
        }
        this.getDistributionScope(id)
      })
    },
    getDistributionScope (id) {
      this.polygonArray = []
      service.http.get('/rts/api/business-districts/distribution-scope?id=' + id).then(res => {
        if (res.status === 200 && res.data.length > 0) {
          this.polygonArray = []
          res.data.forEach(item => {
            this.polygonArray.push([item.lng, item.lat])
          })
        } else {
          // this.polygonArray.push([this.center[0] - 0.005, this.center[1] + 0.005])
          // this.polygonArray.push([this.center[0] + 0.005, this.center[1] + 0.005])
          // this.polygonArray.push([this.center[0] + 0.005, this.center[1] - 0.005])
          // this.polygonArray.push([this.center[0] - 0.005, this.center[1] - 0.005])
        }
        this.initMap()
      })
    },
    initMap () {
      map = new AMap.Map('container', {
        resizeEnable: true,
        center: this.center,
        zoom: 9
      })
      // this.markCenter(map)
      this.villageAdress(map)
      var polygonArray = this.polygonArray
      var editor = ''
      editor = { _polygonEditor: {}, _polygon: {} }
      editor._polygon = new AMap.Polygon({
        map: map,
        path: polygonArray,
        strokeColor: '#0000ff',
        strokeOpacity: 1,
        strokeWeight: 3,
        fillColor: '#f5deb3',
        fillOpacity: 0.35
      })
      map.setFitView()
      editor._polygonEditor = new AMap.PolyEditor(map, editor._polygon)
    },
    markCenter (map) {
      const marker = new AMap.Marker({
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
        position: this.center
      })
      marker.setMap(map)
    },
    selectDlyc (index) {
      this.tabIndex = index
    },
    villageAdress (map) {
      service.http.get('/rts/api/villageAdress', { 'mallId': this.mallId, 'type': this.selectPDType }).then(res => {
        let provinces = res.data
        if (!this.mallId) {
          provinces = this.centerlist
        }
        let markerList = []
        if (provinces.length === 0) {
          return
        }
        for (let i = 0; i < provinces.length; i++) {
          let marker
          var icon = new AMap.Icon({
            image: this.ellipse,
            size: new AMap.Size(24, 24)
          })
          var content = ''
          if (provinces[i].orderCount >= 0) {
            // content = "<div class = 'pointer'>" + provinces[i].orderCount + '</div>'
            content = "<div class = 'pointer'>" + '' + '</div>'
          }
          marker = new AMap.Marker({
            icon: icon,
            content: content,
            position: [provinces[i].lng, provinces[i].lat],
            offset: new AMap.Pixel(-12, -12),
            zIndex: 101,
            title: provinces[i].name,
            map: map
          })
          if (provinces[i].orderCount >= 0) {
            marker.setLabel({
              offset: new AMap.Pixel(20, 10),  // 设置文本标注偏移量
              content: "<div class='info'>" + provinces[i].orderCount + '单' + '</div>', // 设置文本标注内容
              direction: 'top' // 设置文本标注方位
            })
          }
          markerList.push(marker)
        }
        map.add(markerList)
      })
    },
    bascData () {
      service.http.get('/rts/api/statistics', { 'statisticsVM': this.selectPDType, 'mallId': this.mallId }).then(res => {
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
            if (this.selectPDType === 'MONTH') {
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
          let visitmax = Math.max.apply(null, visit)
          let NVmax = Math.max.apply(null, newVisit)
          let NMmax = Math.max.apply(null, newMember)
          this.orderQuantity(dateArray, order, max)
          this.GMV(dateArray, gmv, GMVmax)
          this.Visitor(dateArray, visit, visitmax)
          this.newVisitor(dateArray, newVisit, NVmax)
          this.NewClient(dateArray, newMember, NMmax)
          // 各类型订单
          let odDateArray = []
          let mlcz = []
          let wm = []
          let sx = []
          let kq = []
          let qtls = []
          res.data.orderTypes.forEach(ele => {
            // if (ele.mallId === Number(this.mallId)) {
            if (ele.statisticsType === 'BEAUTIFULTABLE') {
              if (this.selectPDType === 'MONTH') {
                odDateArray.push(ele.countDate.substring(5))
              } else {
                odDateArray.push(ele.countDate.substring(5, 7))
              }
              mlcz.push(ele.value === null ? 0 : ele.value)
            } else if (ele.statisticsType === 'TAKEOUT') {
              wm.push(ele.value === null ? 0 : ele.value)
            } else if (ele.statisticsType === 'FRESH') {
              sx.push(ele.value === null ? 0 : ele.value)
            } else if (ele.statisticsType === 'TICKET') {
              kq.push(ele.value === null ? 0 : ele.value)
            } else if (ele.statisticsType === 'OTHER') {
              qtls.push(ele.value === null ? 0 : ele.value)
            }
            // }
          })
          let allAry = [...mlcz, ...wm, ...sx, ...kq, ...qtls]
          let orderMax = Math.max.apply(null, allAry)
          this.variousTypes(odDateArray, mlcz, wm, sx, kq, qtls, orderMax)
        }
      })
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
          right: '6%',
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
            // max: 500,
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
          right: '6%',
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
    variousTypes (odDateArray, mlcz, wm, sx, kq, qtls, orderMax) {
      let myChart = echarts.init(document.getElementById('variousTypes'))
      let option = {
        tooltip: {
          trigger: 'axis',
          position: function (pos, params, dom, rect, size) {
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
            var obj = { top: 60 }
            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5
            return obj
          },
          extraCssText: 'z-index: 10',
          axisPointer: {
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          show: false,
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 10,
          data: [
            {
              name: '美丽餐桌',
              textStyle: {
                fontSize: 12,
                color: '#ff9156'
              },
              icon: 'image://../../assets/mlcz.png'
            },
            {
              name: '外卖',
              textStyle: {
                fontSize: 12,
                color: '#007efa'
              },
              icon: 'image://../../assets/wm.png'
            },
            {
              name: '生鲜',
              textStyle: {
                fontSize: 12,
                color: '#007efa'
              },
              icon: 'image://../../assets/sx.png'
            },
            {
              name: '卡券',
              textStyle: {
                fontSize: 12,
                color: '#e4bb15'
              },
              icon: 'image://../../assets/kq.png'
            },
            {
              name: '其他零售',
              textStyle: {
                fontSize: 12,
                color: '#ae36ff'
              },
              icon: 'image://../../assets/qtls.png'
            }
          ],
          x: 'center',
          y: 'bottom'
        },
        grid: {
          left: '3%',
          right: '8%',
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
            // data: ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9', '3.10', '3.11', '3.12', '3.13', '3.14', '3.15', '3.16', '3.17', '3.18', '3.19', '3.20', '3.21', '3.22', '3.23', '3.24', '3.25', '3.26', '3.27', '3.28']
            data: odDateArray
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: 0,
            // max: orderMax,
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
            name: '美丽餐桌',
            type: 'line',
            smooth: true,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(255,145,86,0.6)'
                }, {
                  offset: 1,
                  color: 'rgba(255,28,223,0)'
                }])
              }
            },
            itemStyle: {
              normal: {
                // color: '#0ef8d4',
                color: '#ff9156'
              }
            },
            // data: [5110, 4557, 6117, 5998, 4778, 5789, 4765, 3987, 4634, 4615, 5115, 6115, 4777, 5555, 5134, 4518, 5781, 6751, 4416, 5616, 4616, 5617, 4617, 5616, 4455, 5555, 6615, 5544]
            data: mlcz
          },
          {
            name: '外卖',
            type: 'line',
            smooth: true,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(0,126,250,0.6)'
                }, {
                  offset: 1,
                  color: 'rgba(140,54,248,0)'
                }])
              }
            },
            itemStyle: {
              normal: {
                color: '#007efa'
              }
            },
            // data: [1122, 1105, 1122, 1217, 1234, 1241, 1333, 1213, 1121, 1314, 1178, 1415, 1333, 1278, 1114, 1123, 1189, 1278, 1166, 1168, 1198, 1178, 1178, 1156, 1367, 1288, 1112, 1116, 1112, 1116]
            data: wm
          },
          {
            name: '生鲜',
            type: 'line',
            smooth: true,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(2,182,215,0.6)'
                }, {
                  offset: 1,
                  color: 'rgba(140,54,248,0)'
                }])
              }
            },
            itemStyle: {
              normal: {
                color: '#02b6d7'
              }
            },
            // data: [1122, 1105, 1122, 1217, 1234, 1241, 1333, 1213, 1121, 1314, 1178, 1415, 1333, 1278, 1114, 1123, 1189, 1278, 1166, 1168, 1198, 1178, 1178, 1156, 1367, 1288, 1112, 1116, 1112, 1116]
            data: sx
          },
          {
            name: '卡券',
            type: 'line',
            smooth: true,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(228,187,21,0.6)'
                }, {
                  offset: 1,
                  color: 'rgba(140,54,248,0)'
                }])
              }
            },
            itemStyle: {
              normal: {
                color: '#e4bb15'
              }
            },
            // data: [1122, 1105, 1122, 1217, 1234, 1241, 1333, 1213, 1121, 1314, 1178, 1415, 1333, 1278, 1114, 1123, 1189, 1278, 1166, 1168, 1198, 1178, 1178, 1156, 1367, 1288, 1112, 1116, 1112, 1116]
            data: kq
          },
          {
            name: '其他零售',
            type: 'line',
            smooth: true,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(174,54,255,0.6)'
                }, {
                  offset: 1,
                  color: 'rgba(140,54,248,0)'
                }])
              }
            },
            itemStyle: {
              normal: {
                color: '#ae36ff'
              }
            },
            // data: [1122, 1105, 1122, 1217, 1234, 1241, 1333, 1213, 1121, 1314, 1178, 1415, 1333, 1278, 1114, 1123, 1189, 1278, 1166, 1168, 1198, 1178, 1178, 1156, 1367, 1288, 1112, 1116, 1112, 1116]
            data: qtls
          }
        ]
      }
      myChart.setOption(option)
    },
    Visitor (dateArray, visit, visitmax) {
      let myChart = echarts.init(document.getElementById('Visitor'))
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
              name: '访客数',
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
          left: '3%',
          top: 24,
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            // data: ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9', '3.10', '3.11', '3.12', '3.13', '3.14', '3.15', '3.16', '3.17', '3.18', '3.19', '3.20', '3.21', '3.22', '3.23', '3.24', '3.25', '3.26', '3.27', '3.28'],
            data: dateArray,
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
            name: '客单价',
            type: 'bar',
            barWidth: '50%',
            itemStyle: {
              normal: {
                barBorderRadius: [10, 10, 0, 0],
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#3a7bf6' },
                    { offset: 1, color: '#74cffd' }
                  ]
                )
              }
            },
            label: { show: false, color: '#fff' },
            // data: [10, 52, 20, 33, 39, 33, 22, 10, 52, 20, 33, 39, 33, 22, 10, 52, 20, 33, 39, 33, 22, 10, 52, 20, 33, 39, 33, 22, 22]
            data: visit
          }
        ]
      }
      myChart.setOption(option)
    },
    newVisitor (dateArray, newVisit, NVmax) {
      let myChart = echarts.init(document.getElementById('newVisitor'))
      let option = {
        color: ['#c1cce2'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 24,
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            // data: ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9', '3.10', '3.11', '3.12', '3.13', '3.14', '3.15', '3.16', '3.17', '3.18', '3.19', '3.20', '3.21', '3.22', '3.23', '3.24', '3.25', '3.26', '3.27', '3.28'],
            data: dateArray,
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
            // max: NVmax,
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
            name: '新增访客数',
            type: 'bar',
            barWidth: '50%',
            itemStyle: {
              normal: {
                barBorderRadius: [10, 10, 0, 0],
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#1dcebe' },
                    { offset: 1, color: '#76e098' }
                  ]
                )
              }
            },
            label: { show: false, color: '#fff' },
            // data: [12, 16, 5, 7, 11, 9, 8, 8, 7, 6, 4, 7, 12, 14, 21, 15, 16, 14, 13, 19, 17, 12, 11, 9, 6, 5, 3, 2]
            data: newVisit
          }
        ]
      }
      myChart.setOption(option)
    },
    NewClient (dateArray, newMember, NMmax) {
      let myChart = echarts.init(document.getElementById('NewClient'))
      let option = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 24,
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: dateArray,
            // data: ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9', '3.10', '3.11', '3.12', '3.13', '3.14', '3.15', '3.16', '3.17', '3.18', '3.19', '3.20', '3.21', '3.22', '3.23', '3.24', '3.25', '3.26', '3.27', '3.28'],
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
            // max: NMmax,
            minInterval: 1,
            axisLabel: {
              textStyle: {
                color: '#fff',
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
            name: '新增访客数',
            type: 'bar',
            barWidth: '50%',
            itemStyle: {
              normal: {
                barBorderRadius: [10, 10, 0, 0],
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#ff6f51' },
                    { offset: 1, color: '#ffc533' }
                  ]
                )
              }
            },
            label: { show: false, color: '#fff' },
            // data: [12, 16, 5, 7, 11, 9, 8, 8, 7, 6, 4, 7, 12, 14, 21, 15, 16, 14, 13, 19, 17, 12, 11, 9, 6, 5, 3, 2]
            data: newMember
          }
        ]
      }
      myChart.setOption(option)
    },
    getshop () {
      // 商铺订单统计
      service.http.get('/rts/api/shopOrderReports/shop', { mallId: this.mallId, type: this.selectBSType }).then(res => {
        if (res.status === 200) {
          this.shopList = res.data
          let shop = []
          shop = this.shopList.filter(function (e, i, arr) {
            return e.shopName === 'CoCo都可'
          })
          this.selectShop(shop[0])
        }
      })
    },
    orderQuantity2 (dateArray, dataArray, orderCount) {
      let myChart = echarts.init(document.getElementById('orderQuantity2'))
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
          bottom: '0%',
          top: 24,
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
            data: dataArray
            // data: [100, 210, 130, 140, 350, 160, 170, 380, 190, 200, 210, 220, 330, 240, 150, 140, 350, 160, 170, 380, 190, 200, 210, 220, 330, 240, 150]
          }
        ]
      }
      myChart.setOption(option)
    },
    selectTime (type, time) {
      if (type === 'business') {
        this.selectBSType = time.val
        this.selectedBStime = time.name
        this.getshop()
        this.shopDetails()
        this.showBSpanel = false
      }
      if (type === 'platform') {
        this.selectPDType = time.val
        this.selectedPDtime = time.name
        this.initMap()
        // this.villageAdress(map)
        this.bascData()
        this.showPDpanel = false
      }
      if (type === 'all') {
        this.selectBSType = time.val
        this.selectedBStime = time.name
        this.shopDetails()
        this.selectPDType = time.val
        this.selectedPDtime = time.name
        this.bascData()
        this.showALLpanel = false
        this.selectedALLtime = time.name
        this.initMap()
        // this.villageAdress(map)
      }
    },
    selectShop (item) {
      if (!item) {
        return
      }
      this.selectedShop = item.shopName
      this.selectedShopLogo = item.logo
      this.orderCount = item.orderCount
      this.showShopList = false
      this.shopId = item.shopId
      this.shopDetails()
    },
    shopDetails () {
      // 商铺订单详情
      service.http.get(`/rts/api/shopOrderReports/${this.shopId}`, { type: this.selectBSType }).then(res => {
        if (res.status === 200) {
          let dateArray = []
          let dataArray = []
          // let orderCount = ''
          res.data.forEach(ele => {
            if (this.selectBSType === 'MONTH') {
              dateArray.push((ele.countDate).substring(5))
            } else {
              dateArray.push((ele.countDate).substring(5, 7))
            }
            dataArray.push(ele.orderCount)
            // orderCount = ele.orderCount
          })
          // this.orderCount = orderCount
          this.orderQuantity2(dateArray, dataArray, this.orderCount)
        }
      })
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
    longPol () {
      if (this.$route.path !== '/O2O') {
        return
      }
      service.http.get(`/rts/api/orders/time?mallId=${this.mallId}`, { timeout: 40000 }).then(res => {
        if (res.data.message === 'timeOut' || res.data.length === 0) {
          this.showMessage = false
          setTimeout(res => {
            this.longPol()
          }, 60000)
        } else if (res.data.length > 0) {
          this.showMessage = true
          this.Message = res.data[0]
          setTimeout(res => {
            this.longPol()
          }, 60000)
        }
      }).catch(res => {
        setTimeout(res => {
          this.longPol()
        }, 15000)
      })
    }
  },
  beforeDestroy () {
    // clearInterval(this.timer)
    // this.timer = null
  }
}
</script>
<style lang="scss">
@import "../../style/mqO2O.scss";
.mq-wrap {
  position: relative;
  .toggle-button {
    position: absolute;
    width: px2rem(114);
    height: px2rem(114);
    top: px2rem(20);
    left: px2rem(80);
    cursor: pointer;
    background: url(../../assets/tgbtn.png) no-repeat;
    background-size: contain;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.dlyc-right {
  img {
    // width: 100%;
    // height: 100%;
  }
}
.activeSelect {
  font-size: px2rem(26);
}
.pointer {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #f9387f;
  text-align: center;
  color: #fff;
}
.amap-marker-label {
  border: 0;
  background-color: #7ea8ee;
}
.info {
  position: relative;
  top: 0;
  right: 0;
  min-width: 0;
  color: #fff;
  text-align: center;
  padding-right: 4px;
}
</style>

