<template>
  <div class="estate-wrap"
       style="overflow: hidden;">
    <a href="javascript:void(0)">
      <div class="toggle-button" @click="$router.back()"></div>
    </a>
    <div class="title">
      <span style="left: 8.24rem;">{{titleName}}物业管理数据</span>
    </div>
    <div class="timewarp">
      <span id="time">{{date}}</span>
    </div>
    <div class="top-content clearfix">
      <div class="ct-title">
        消防管道图
      </div>
      <div class="map fleft content-bg wulw"
           id="container"
           style="opacity: 1;">
        <span class="fullScreen"><a href="http://xxsc.njdtwise.com/fp/"
             target="_blank">全屏</a></span>
        <iframe src="http://xxsc.njdtwise.com/fp/"
                style="width: 100%;height: 100%"></iframe>
      </div>
      <!-- <div class="ct-title shop-data">
        商铺数据
      </div> -->
      <div class="data-wrap fleft">
        <div class="basic-data content-bg fleft wulw"
             style="opacity: 1;">
          <span class="fullScreen"><a href="http://xxsc.njdtwise.com/FirePM/html/xxscindex.html?account=xxsc\admin&password=Data@123"
               target="_blank">全屏</a></span>
          <iframe src="http://xxsc.njdtwise.com/FirePM/html/xxscindex.html?account=xxsc\admin&password=Data@123"
                  style="width: 100%;height: 100%"></iframe>
        </div>
        <div class="chartwrap"
             :class="{slideUp: isSlideUp}">
          <div class="item-list">
            <span v-if="showMessage"
                  style="display: inline-block;width: 80%;position: relative">
              <span class="msg-content"
                    style="display: inline-block;width: 98%;line-height: 0.6rem;"
                    v-if="Message.seuid!==''&& Message.seuid">
                <!-- <i class="news"></i> -->
                编号{{Message.seuid}}：{{Message.address}}，出现故障，请立即前往处理!</span>
              <span style="color:#fff;position: absolute;right: -1.9rem;top: 0.1rem;"
                    v-if="Message.time">{{(Message.time).substring(11)}}
              </span>
            </span>
            <span style="position: absolute;right: 0rem;cursor: pointer;color:#fff;top: 0.2rem;"
                  @click="saasMessage()">》</span>
          </div>
          <div class="item-list" v-if="saasList.length > 0 && saasList[0].seuid!==''" v-for="(item, index) in saasList" :key='index' >
            <span class="msg-content">编号{{item.seuid}}：{{item.address}}，出现故障，请立即前往处理!</span>
            <span style="color:#fff;position: absolute;right: 0.2rem;">{{(item.time).substring(11)}}</span>
          </div>
        </div>
      </div>
      <div class="ct-title finance-data">
        设备平面图
      </div>
      <div class="timeselect"
           style="left: 28rem;top: -0.8rem;">
        <span @click="queryFloors();showPDpanel = !showPDpanel;showPDpanelChildren=false">选项</span>
      </div>
      <div class="itempanelbd"
           v-if="showPDpanel"
           style="left: 28rem;top: -0.10rem;min-width: 1.66rem;max-height: 5rem;overflow-y: scroll;">
        <span v-for="(item, index) in floorsList"
              :key="index"
              @click="selectTime('financeCount', item)"
              style="text-align: center">{{item.name}}
          <!-- <span style="width: auto">></span> -->
        </span>
      </div>
      <!-- <div class="itempanel" v-if="showPDpanelChildren" style="left: 29.6rem;top: -0.10rem;max-height: 5rem;overflow-y: scroll">
        <span v-for="(item, index) in floorsList" :key="index" @click="selectTime('financeCount2', item)">{{item.name}}</span>
      </div> -->
      <div class="data-wrap2 fleft">
        <div class="dw-bg content-bg"></div>
        <div class="dw-data">
          <span class=""
                style="color: #fff;font-size: 0.28rem">{{selectBuild + selectFloors}}</span>
          <div id="svgDiv">
            <span id="svgHtml"
                  v-show="svgHtmlShow"
                  v-html="svgHtml"
                  @click="clickFun($event)"
                  style="overflow: hidden;"></span>
          </div>
        </div>
        <div class="showmore"
             @click="queryAllRepairs">《</div>
        <div class="repairRecord"
             v-if="showRep">
          <div class="rc-title">
            <span @click="showRep = false">》</span>
            <span v-if="!showAllList">一号楼电梯</span>
          </div>
          <div class="rc-list"
               v-if="showAllList">
            <ul style="background-color: #192646">
              <li>报修时间</li>
              <li>设备名称</li>
              <li>维修状态</li>
            </ul>
            <div style="">
              <ul v-for="(item, index) in repairsList"
                  :key="index">
                <li>{{formatterDate(item.reportTime)}}</li>
                <li>{{item.equirementDTO.name}}</li>
                <li>{{formatterRpstas(item.repairStatus)}}</li>
              </ul>
            </div>
          </div>
          <div class="rc-list"
               v-else>
            <ul style="background-color: #192646">
              <li>报修时间</li>
              <li>故障类型</li>
              <li>维修状态</li>
            </ul>
            <div style="">
              <ul v-for="(item, index) in repairsDetailsList"
                  :key="index">
                <li>{{formatterDate(item.reportTime)}}</li>
                <li>{{formatterfaultType(item.faultType)}}</li>
                <li>{{formatterRpstas(item.repairStatus)}}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-content clearfix">
      <div class="fire-control fleft">
        <div class="btc-title">消防</div>
        <div class="dly-wrap">
          <div class="dly-content content-bg clearfix">
            <div class="cro-char ept-prop">
              <div>
                <div id="fireControl"
                     style="width: 100%;height:70%;"></div>
                <div style="text-align:center;height: 0.2rem;line-height: 0.2rem;">
                  <span style="color: #C0CDE2;font-size: 0.2rem;">消防设备数量占比</span>
                </div>
              </div>
              <div>
                <div id="fault"
                     style="width: 100%;height:70%;"></div>
                <div style="text-align:center;height:0.2rem;line-height:0.2rem;">
                  <span style="color: #C0CDE2;font-size: 0.2rem;">故障设备占比</span>
                </div>
              </div>
              <div>
                <div id="police"
                     style="width: 100%;height:70%;"></div>
                <div style="text-align:center;height: 0.2rem;line-height: 0.2rem;">
                  <span style="color: #C0CDE2;font-size: 0.2rem;">设备离线数量占比</span>
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
          <div class="basic-number">
            <div class="bn-item">
              <!-- <div class="bi-order">{{fireControlData.count}}</div> -->
              <div class="bi-order">{{fireControlCount}}</div>
              <div>监控总数</div>
            </div>
            <div class="bn-item">
              <div class="bi-gmv">{{fireControlData.warn}}</div>
              <div>告警总数</div>
            </div>
            <div class="bn-item">
              <div class="bi-price">{{fireControlData.issue}}</div>
              <div>离线总数</div>
            </div>
            <div class="bn-item">
              <div class="bi-visit">{{fireControlData.normalRate}}%</div>
              <div>状态正常率</div>
            </div>
            <div class="bn-item">
              <div class="bi-newVisit">{{fireControlData.alarmRate}}%</div>
              <div>设备告警率</div>
            </div>
            <div class="bn-item">
              <div class="bi-newMember">{{fireControlData.OfflineRate}}%</div>
              <div>设备离线率</div>
            </div>
          </div>
        </div>
      </div>
      <div class="business-data fleft">
        <div class="btc-title">设备实时监控</div>
        <div class="business-content content-bg">
        </div>
        <div class="equipment-left">
          <div style="margin-bottom: 1rem;">
            <div class="el-item">
              {{fireControlData.plmdCount}}个喷淋末端
              <div>
                <span v-if="plmdData.min"
                      :class="{warn: plmdData.min < 0.05}">{{(plmdData.min).toFixed(2)}}Mpa~</span>
                <span v-if="plmdData.max"
                      :class="{warn: plmdData.max > 6}">{{(plmdData.max).toFixed(2)}}Mpa</span>
              </div>
              <span class="security">安全范围：0.05Mpa-6Mpa</span>
            </div>
            <p>喷淋末端水压实时监测</p>
          </div>
          <div style="margin-bottom: 1rem;">
            <div class="el-item">
              {{fireControlData.xfsxCount}}个消防水箱
              <div>
                <span v-if="xfsxData.min"
                      :class="{warn: xfsxData.min < 1}">{{(xfsxData.min).toFixed(2)}}m~</span>
                <span v-if="xfsxData.max"
                      :class="{warn: xfsxData.max > 2}">{{(xfsxData.max).toFixed(2)}}m</span>
              </div>
              <span class="security">安全范围：1m-2m</span>
            </div>
            <p>消防水箱水压实时监测</p>
          </div>
          <div>
            <div class="el-item">
              {{fireControlData.dqCount}}个电器火灾设备
              <div>
                <span v-if="dqsxData.min"
                      :class="{warn: dqsxData.min < 0}">{{(dqsxData.min).toFixed(2)}}℃~</span>
                <span v-if="dqsxData.max"
                      :class="{warn: dqsxData.max > 70}">{{(dqsxData.max).toFixed(2)}}℃</span>
              </div>
              <span class="security">安全范围：0℃-70℃</span>
            </div>
            <p>设备温度实时监测</p>
          </div>
          <div>
            <div class="el-item">
              {{fireControlData.dqCount}}个电器火灾设备
              <div>
                <!-- <span v-if="dqData.min" :class="{warn: dqData.min < 0}">{{(dqData.min).toFixed(2)}}<span style="font-size: 0.28rem">mA~</span></span>
                <span v-if="dqData.max" :class="{warn: dqData.max > 500}">{{(dqData.max).toFixed(2)}}<span style="font-size: 0.28rem">mA</span></span> -->
                <span>0mA～0mA</span>
              </div>
              <span class="security">安全范围：0-50mA</span>
            </div>
            <p>设备剩余电流实时监测</p>
          </div>
        </div>
        <div class="equipment-right">
          <div>
            <div id="fireProof"
                 style="width: 100%;height:100%;"></div>
            <div class="er-title">防火门状态占比</div>
            <div class="legend">
              <span>
                <i class="ygbj"></i>正常
              </span>
              <span>
                <i class="xfs"></i>门开警告
              </span>
              <span>
                <i class="xfsx"></i>离线
              </span>
            </div>
          </div>
          <div style="margin-top: 0.6rem">
            <div id="appliance"
                 style="width: 100%;height:100%;"></div>
            <div class="er-title">电器火灾监控设备占比</div>
            <div class="legend">
              <span>
                <i class="ygbj"></i>正常
              </span>
              <span>
                <i class="xfs"></i>设备报警
              </span>
              <span>
                <i class="xfsx"></i>离线
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="business-data fleft">
        <div class="btc-title"
             style="padding-left: 0.5rem">
          <span @click="ocxinit1()">安防</span>
          <span class="choice"
                @click="JumpToIe()">
            <a>选择监控</a>
          </span>
        </div>
        <div class="business-content content-bg"
             style="width: 11.77rem;">
          <div style="overflow: scroll;">
            <el-menu default-active="2"
                     class="el-menu-vertical-demo"
                     @open="handleOpen"
                     @close="handleClose"
                     background-color="#545c64"
                     text-color="#fff"
                     active-text-color="#ffd04b">
              <el-submenu :index="index+''"
                          v-for="(item, index) in channelList"
                          :key="index">
                <template slot="title">
                  <i class="el-icon-house"></i>
                  <span>{{item.name}}</span>
                </template>
                <el-menu-item-group v-for="(item2, index2) in item.monitorChannels"
                                    :key="index2">
                  <el-menu-item :index="index2+''"
                                @click="JumpToIe()">
                    <i class="el-icon-location"></i>
                    <a>{{item2.name}}</a>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </div>
        </div>
        <div class="monitor-number">
          <div class="mn-item">
            <div class="mi-num">{{MonitorTotal}}</div>
            <div>监控视频总数</div>
          </div>
          <!-- <div class="mn-item">
            <div class="mi-num" style="color: #00c9a8">155</div>
            <div>正常工作监控视频</div>
          </div>
          <div class="mn-item">
            <div class="mi-num" style="color: #f9387f">4</div>
            <div>无法工作监控视频</div>
          </div> -->
        </div>
      </div>
    </div>
    <!-- <div class="v-modal" style="z-index: 2003" v-if="showDialog"></div> -->
  </div>
</template>
<script>
import axios from 'axios'
import $ from 'jquery'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
import service from '@/service'
import * as JSOG from 'jsog'
export default {
  name: 'businessOperation',
  data () {
    return {
      fireControlCount: 1516,
      selIndex: '',
      ismtActived: false,
      showDialog: false,
      svgId: '',
      showRep: false,
      mallId: '',
      titleName: '',
      buildList: [],
      floorsList: [],
      mgAry: [],
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
      selectBSType: 'month',
      selectPDType: 'MONTH',
      selectedBStime: '',
      selectedPDtime: '',
      selectedALLtime: '近1月',
      shopId: '',
      tabIndex: 0,
      polygonArray: [],
      center: '',
      Message: {
        seuid: '',
        time: '',
        address: ''
      },
      showMessage: false,
      timer: '',
      date: new Date(),
      shopData: { allArea: '' },
      businessData: { rentRate: '' },
      industryData: [],
      financeCountData: { amount: '' },
      selectedTime: '',
      isSlideUp: false,
      deviceStatusNum: [],
      deviceParamRange: [],
      fireControlData: {},
      saasList: [],
      gWndId: '',
      plmdData: {},
      xfsxData: {},
      dqsxData: {},
      dqData: {},
      fhmztData: {},
      dqhzData: {},
      repairsList: [],
      showAllList: false,
      showPDpanelChildren: false,
      svgHtml: '',
      repairsDetailsList: '',
      selectBuild: '',
      selectFloors: '',
      channelList: [],
      MonitorTotal: 0,
      href: '',
      svgHtmlShow: false,
      defaultProps: {
        children: 'channelList',
        label: 'name'
      },
      checkedKeys: [],
      mointerList: []
    }
  },
  created () {
    this.mallId = this.$route.query.id
    this.titleName = this.$route.query.name
    this.financeDate()
    this.getFinanceCounts()
    this.device_status_num() // 各类设备当前状态数量统计
    this.device_param_range() // 2.2各类设备当前监指标测数值范围
    this.saasMessage('init')
    // let token = localStorage.getItem('token')
    // let tenantKey = localStorage.getItem('tenantKey')
    // this.href = `dahua://&token=${token}&mallId=${this.mallId}&tenantKey=${tenantKey}`
    this.mallDeploy()
  },
  mounted () {
    this.longPol()
    var _this = this // 声明一个变量指向vue实例this,保证作用域一致
    this.timer = setInterval(function () {
      _this.date = _this.getNowTime()// 修改数据date
    }, 1000)
    // setTimeout(this.ocxinit(), 500)
    this.queryFloors()
    this.queryPlan({ name: 1 })
    this.selectBuild = '1层'
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
    handleOpen (key, keyPath) {
    },
    handleClose (key, keyPath) {
    },
    handleCheckChange (data, checked, indeterminate) {
      if (checked) {
        this.mgAry.push(data.id)
      } else {
        let index = this.mgAry.indexOf(data.id)
        this.mgAry.splice(index, 1)
      }
    },
    queryBuildings () {
      service.http.get('/cms/api/project-managements', { projectId: this.mallId, useStatus: 'USING' }).then(res => {
        // this.buildList = res.data.buildingListDTOS
        this.buildList = res.data
      })
    },
    queryAllRepairs () {
      this.showRep = true
      this.showAllList = true
      service.http.get('/cms/api/repairs', { page: 0, pageSize: 1000, sort: 'createdDate,desc', projectManagementId: this.mallId }).then(res => {
        this.repairsList = res.data
      })
    },
    queryRepairs () {
      this.showRep = true
      this.showAllList = false
      service.http.get('/cms/api/repairs/svg', { svgId: 1 }).then(res => {
        this.repairsList = res.data
      })
    },
    queryFloors (id) {
      service.http.get(`/cms/api/floors/svg`, { projectManagementId: this.mallId }).then(res => {
        this.floorsList = res.data
      })
    },
    queryPlan (item) {
      this.svgHtmlShow = false
      let _this = this
      service.http.get('/cms/api/plan', { floorName: item.name, planeStyle: 'DEVICE', planeType: 'FLOOR', projectManagementId: this.mallId }).then(result => {
        this.svgHtml = result.data.svg
        if (result.data === '') {
          $('#svgHtml').css({
            width: '100%'
          })
          return
        }

        this.svgId = result.data.id
        setTimeout(function () {
          $('#svgDiv svg  title').remove()
          console.log('svg', $('#svgDiv svg'))
          // $('#svgDiv svg').css({'transform': 'scale(0.5)', 'position': 'relative', 'left': '-5.93rem'})
          _this.SVGAutoscale()
        }, 500)
      })
    },
    clickFun (event) {
      let self = event.target
      this.selfTarget = self
      console.log('self.id', self.id)
      if (!self.id) {
        return
      }
      console.log($(self).parent())// 当前指针点击的元素
      service.http.get('/cms/api/repairs/svg', { svgId: self.id, planId: this.svgId, page: 0, pageSize: 1000, sort: 'createdDate,desc' }).then(res => {
        console.log(res)
        if (res.status === 200) {
          this.showRep = true
          this.showAllList = false
          this.repairsDetailsList = res.data
        }
      })
    },
    formatterDate (date) {
      date = date.replace('T', ' ')
      return date
    },
    formatterRpstas (val) {
      let res = ''
      if (val === 'WAIT') {
        res = '等待维修'
      } else if (val === 'COMPLETE') {
        res = '维修完成'
      } else {
        res = '维修中'
      }
      return res
    },
    formatterfaultType (val) {
      let res = ''
      if (val === 'MANMADE') {
        res = '人为损坏'
      } else if (val === 'ABRASION') {
        res = '正常磨损'
      } else if (val === 'DEFECT') {
        res = '设备/备件缺陷'
      }
      return res
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
        // this.getFinanceCounts()
        this.showPDpanel = false
        // this.showPDpanelChildren = true
        this.queryPlan(item)
        this.selectBuild = item.name + '层'
      }
      // if (type === 'financeCount2') {
      //   this.showPDpanel = false
      //   this.showPDpanelChildren = false
      //   this.queryPlan(item)
      //   this.selectFloors = item.name + '层'
      // }
    },
    getFinanceCounts () {
      service.http.get('/cms/api/financeCounts', { date: this.selectedTime, financeType: this.selectPDType, projectManagementId: this.mallId }).then(res => {
        this.financeCountData = res.data
      })
    },
    fireControl (dataArray) {
      let myChart = echarts.init(document.getElementById('fireControl'))
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          position: function (pos, params, dom, rect, size) {
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
            var obj = { top: 60 }
            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5
            return obj
          }
        },
        title: {
          text: '',
          x: 'center',
          y: 'center',
          textStyle: {
            color: '#fff',
            fontSize: '30em',
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
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          position: function (pos, params, dom, rect, size) {
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
            var obj = { top: 60 }
            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5
            return obj
          }
        },
        title: {
          text: '',
          x: 'center',
          y: 'center',
          textStyle: {
            color: '#fff',
            fontSize: '30em',
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
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          position: function (pos, params, dom, rect, size) {
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
            var obj = { top: 60 }
            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5
            return obj
          }
        },
        title: {
          text: '',
          x: 'center',
          y: 'center',
          textStyle: {
            color: '#fff',
            fontSize: '30em',
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
    fireProof () {
      let myChart = echarts.init(document.getElementById('fireProof'))
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '防火门状态',
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            data: [
              {
                value: this.fhmztData.normal,
                name: '正常',
                itemStyle: {
                  color: '#00dbdf'
                }
              },
              {
                value: this.fhmztData.warn,
                name: '门开警告',
                itemStyle: {
                  color: '#f9387f'
                }
              },
              {
                value: this.fhmztData.issue,
                name: '离线',
                itemStyle: {
                  color: '#946bff'
                }
              }
            ],
            label: {
              normal: {
                // show: false,
                formatter: '{c}',
                position: 'inner'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    },
    appliance () {
      let myChart = echarts.init(document.getElementById('appliance'))
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '防火门状态',
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            data: [
              {
                value: this.dqhzData.normal,
                name: '正常',
                itemStyle: {
                  color: '#00dbdf'
                }
              },
              {
                value: this.dqhzData.warn,
                name: '设备报警',
                itemStyle: {
                  color: '#f9387f'
                }
              },
              {
                value: this.dqhzData.issue,
                name: '离线',
                itemStyle: {
                  color: '#946bff'
                }
              }
            ],
            label: {
              normal: {
                // show: false,
                formatter: '{c}',
                position: 'inner'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    },
    device_status_num () {
      service.http.get('/tmg/rest/firepm/device_status_num').then(res => {
        if (res.status === 200) {
          let fireControlData = { count: 0, warn: 0, issue: 0, plmdCount: 0, xfsxCount: 0, dqCount: 0 }
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
          fireControlData.OfflineRate = ((fireControlData.issue / this.fireControlCount).toFixed(4) * 100).toFixed(2)
          this.fireControlData = fireControlData
          this.fireControl(xfsbData)
          this.fault(gzsbData)
          this.police(sbbjData)
          this.fireProof()
          this.appliance()
        }
      })
    },
    device_param_range () {
      service.http.get('/tmg/rest/firepm/device_param_range').then(res => {
        if (res.status === 200) {
          let deviceParamRange = res.data.ret.value
          let plmdData = {}
          let xfsxData = {}
          let dqsxData = {}
          let dqData = {}
          deviceParamRange.forEach(ele => {
            if (ele.appid === 2) {
              plmdData = ele
            } else if (ele.appid === 5) {
              xfsxData = ele
            } else if (ele.appid === 16 && ele.param === 'temperature') {
              dqsxData = ele
            } else if (ele.appid === 16 && ele.param === 'current') {
              dqData = ele
            }
          })
          this.plmdData = plmdData
          this.xfsxData = xfsxData
          this.dqsxData = dqsxData
          this.dqData = dqData
        }
      })
    },
    longPol () {
      if (this.$route.path !== '/estateManagement') {
        return
      }
      // service.http.get(`/mps/api/saasMessage/push?mallId=${this.mallId}`, {timeout: 40000}).then(res => {
      axios({ method: 'GET', url: `/mps/api/saasMessage/push?mallId=${this.mallId}`, timeout: 40000 }).then(res => {
        if (res.data.message === 'timeOut') {
          this.Message = {
            seuid: '',
            time: '',
            address: ''
          }
          this.longPol()
        } else if (res.data.address) {
          this.longPol()
          this.showMessage = true
          this.Message = res.data
        }
      }).catch(res => {
        setTimeout(res => {
          this.longPol()
        }, 15000)
      })
    },
    saasMessage (param) {
      service.http.get(`/mps/api/saasMessage?mallId=${this.mallId}`).then(res => {
        if (res.status === 200) {
          if (res.data.length === 0) {
            this.saasList = [{ seuid: '', time: '', address: '' }]
          } else {
            this.saasList = res.data
          }
          if (this.showMessage === false) {
            this.showMessage = true
            if (res.data.length === 0) {
              this.Message = { seuid: '', time: '', address: '' }
            } else {
              this.Message = res.data[0]
            }
          }
        }
      })
      if (!param) {
        this.isSlideUp = !this.isSlideUp
      }
    },
    SVGAutoscale () { // sgv自适应页面大小
      // let DIVw = $('#svgDiv').width()
      let DIVh = $('#svgDiv').height()
      if (!$('#svgHtml svg').attr('width') || !$('#svgHtml svg').attr('height')) {
        $('#svgHtml svg').attr('width', '1980')
        $('#svgHtml svg').attr('height', '1080')
      }

      let svgW = parseInt($('#svgHtml svg').attr('width'))
      let svgH = parseInt($('#svgHtml svg').attr('height'))
      let defaultScale = 1
      let translateX = 0
      let translateY = 0
      if (svgH > DIVh) {
        defaultScale = DIVh / svgH  // 大屏幕为显示效果svg大小*1.2倍 出现页面滚动条
        translateX = -(svgW - svgW * defaultScale) / 2 / defaultScale + 'px'
        translateY = -(svgH - svgH * defaultScale) / 2 / defaultScale + 'px'
      } else {
        translateX = (DIVh - svgH) / 2 + 'px'
      }
      // $('#svgDiv').height(svgH * defaultScale)
      $('#svgHtml svg').css('transform', `scale(${defaultScale}) translate(${translateX},${translateY})`)
      $('#svgHtml').width(svgW * defaultScale)
      $('#svgHtml').height(svgH * defaultScale)
      $('#svgDiv').css('overflow-x', 'scroll')
      this.svgHtmlShow = true
    },
    JumpToIe () {
      axios({ method: 'GET', url: `/rms/api/mallDeploy/tree?mallId=${this.mallId}`, timeout: 20000 }).then(res => {
        if (res.status === 200) {
          let token = sessionStorage.getItem('token')
          let tenantKey = localStorage.getItem('tenantKey')
          window.location.href = `dahua://&token=${token}&mallId=${this.mallId}&tenantKey=${tenantKey}`
        }
      }).catch(err => {
        console.log(err)
      })
    },
    mallDeploy () {
      axios({ method: 'GET', url: `/rms/api/mallDeploy/tree?mallId=${this.mallId}`, timeout: 20000 }).then(res => {
        if (res.status === 200) {
          this.channelList = JSOG.decode(res.data)
          this.MonitorTotal = Number(res.headers['x-total-count'])
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
</script>
<style lang="scss">
@import "../../style/mqO2O.scss";
ul li {
  list-style: none;
}
.estate-wrap {
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
  .dly-wrap {
    width: px2rem(1150);
    height: px2rem(730);
    margin-top: px2rem(30);
    .dly-content {
      width: px2rem(1150);
      height: px2rem(730);
      padding-top: px2rem(400);
      .flleft {
        width: 50%;
      }
      .cro-char {
        display: flex;
        justify-content: space-between;
        > div {
          width: 50%;
          height: px2rem(260);
        }
      }
      .ept-prop {
        > div {
          width: 33%;
        }
      }
      .legend {
        font-size: px2rem(16);
        color: rgba(137, 149, 203, 1);
        text-align: center;
        i {
          display: inline-block;
          width: px2rem(21);
          height: px2rem(8);
          border-radius: px2rem(4);
          margin: 0 px2rem(10);
        }
        i.ygbj {
          background: rgba(28, 126, 246, 1);
        }
        i.xfs {
          background: rgba(249, 56, 127, 1);
        }
        i.xfsx {
          background: rgba(4, 224, 249, 1);
        }
      }
    }
    .basic-number {
      position: absolute;
      margin: 0 auto;
      width: px2rem(1050);
      height: px2rem(370);
      top: px2rem(46);
      left: px2rem(50);
      border: none;
      background-color: transparent;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .bn-item {
        width: px2rem(300);
        height: px2rem(150);
        background-color: #354068;
        border: 1px solid #6c81aa;
        text-align: left;
        padding-left: px2rem(45);
        border-radius: px2rem(4);
        div {
          &:first-child {
            margin-top: px2rem(10);
            font-size: px2rem(50);
            color: #fff;
          }
        }
      }
    }
  }
  .business-data {
    // width: px2rem(1200);
    .business-content {
      width: px2rem(1250);
    }
    .equipment-left {
      position: absolute;
      margin: 0 auto;
      width: px2rem(750);
      height: 3.7rem;
      top: px2rem(150);
      left: 0.5rem;
      border: none;
      background-color: transparent;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      -ms-flex-pack: justify;
      justify-content: space-between;
      .el-item {
        width: 3.4rem;
        height: 2rem;
        overflow: hidden;
        background-color: #354068;
        border: 1px solid #6c81aa;
        text-align: left;
        padding-left: 0.2rem;
        padding-top: 0.2rem;
        border-radius: 0.04rem;
        color: #fff;
        div {
          margin-top: px2rem(20);
          span {
            &:first-child {
              color: #00c9a8;
            }
            color: #00c9a8;
            font-size: px2rem(30);
          }
        }
        .security {
          font-size: px2rem(8);
          color: #b9c6db;
        }
      }
      p {
        color: #fff;
        margin-top: px2rem(20);
        margin-left: px2rem(20);
      }
    }
    .equipment-right {
      position: absolute;
      right: 0;
      top: 1.5rem;
      width: px2rem(500);
      height: px2rem(210);
      .er-title {
        color: #aab6cc;
        text-align: center;
        font-size: px2rem(10);
      }
      .legend {
        font-size: px2rem(16);
        color: rgba(137, 149, 203, 1);
        text-align: center;
        margin-top: px2rem(30);
        i {
          display: inline-block;
          width: px2rem(21);
          height: px2rem(8);
          border-radius: px2rem(4);
          margin: 0 px2rem(10);
        }
        i.ygbj {
          background: #00d8dc;
        }
        i.xfs {
          background: #f9387f;
        }
        i.xfsx {
          background: #946bff;
        }
      }
    }
    .monitor-number {
      padding-top: 1rem;
      position: absolute;
      margin: 0 auto;
      width: 10.5rem;
      height: 2.7rem;
      top: 0.46rem;
      left: 0.5rem;
      border: none;
      background-color: transparent;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      -ms-flex-pack: justify;
      justify-content: space-between;
      .mn-item {
        color: #fff;
        width: 3rem;
        height: 1.5rem;
        background-color: #354068;
        border: 1px solid #6c81aa;
        text-align: center;
        border-radius: 0.04rem;
        font-size: px2rem(20);
        .mi-num {
          font-size: px2rem(48);
          padding: px2rem(10) 0 px2rem(20) 0;
        }
      }
    }
    .choice {
      display: inline-block;
      width: 80px;
      height: 25px;
      line-height: 25px;
      background-color: #354068;
      border: 1px solid #6a6ec1;
      color: #fff;
      text-align: center;
      font-size: 12px;
      border-radius: 4px;
      cursor: pointer;
    }
  }
  .timeselect {
    > span {
      display: inline-block;
      width: px2rem(110);
      height: px2rem(60);
      line-height: px2rem(60);
      text-align: center;
      background-color: #243357;
      color: #fff;
      border-radius: 4px;
      border: 1px solid #6a6ec1;
      cursor: pointer;
    }
  }
  .title {
    background: url(../../assets/titlebg.png) no-repeat;
    background-position: px2rem(20);
    background-size: contain;
    > span {
      position: absolute;
      font-size: px2rem(100);
      font-family: MicrosoftYaHei-Bold;
      font-weight: bold;
      color: rgba(255, 255, 255, 0);
      line-height: px2rem(56);
      -webkit-text-stroke: 1px rgba(255, 255, 255, 1);
      color: #e7f0ff;
      left: px2rem(900);
      top: px2rem(66);
    }
  }
  .map {
    border: none;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .wulw {
    position: relative;
    .fullScreen {
      position: absolute;
      display: inline-block;
      width: 1rem;
      height: 0.5rem;
      line-height: 0.45rem;
      text-align: center;
      right: 0;
      top: 0;
      border: 1px solid #6a6ec1;
      background-color: #243357;
      color: #fff;
      border-radius: 4px;
    }
  }
  #container {
    width: px2rem(1150);
    position: relative;
  }
  .shop-data {
    left: px2rem(950);
  }
  .finance-data {
    left: px2rem(2500);
  }
  .data-wrap {
    width: px2rem(1250);
    .basic-data {
      width: 100%;
    }
  }
  .data-wrap2 {
    position: relative;
    margin-left: px2rem(40);
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
      #svgDiv {
        // display: -ms-flexbox;
        // display: flex;
        // -ms-flex-pack: center;
        // justify-content: center;
        width: 11.8rem;
        height: 8rem;
        overflow-y: hidden;
        background-color: #fff;
        span {
          width: 100%;
          height: 100%;
          padding: 0;
          svg {
            transform: scale(0.5);
          }
        }
      }
    }
    .showmore {
      position: absolute;
      width: px2rem(50);
      height: px2rem(50);
      line-height: px2rem(50);
      background-color: #35466f;
      color: #8491ae;
      top: px2rem(20);
      right: 0;
      cursor: pointer;
    }
    .repairRecord {
      position: absolute;
      width: px2rem(800);
      height: px2rem(900);
      top: 0;
      right: 0;
      background-color: #060c1d;
      .rc-title {
        background-color: #0a1632;
        span:first-child {
          display: inline-block;
          width: px2rem(50);
          height: px2rem(50);
          line-height: px2rem(50);
          text-align: center;
          cursor: pointer;
          background-color: #35466f;
          color: #8491ae;
        }
        span {
          display: inline-block;
          width: 90%;
          color: #dbdcdf;
          text-align: center;
        }
      }
      .rc-list {
        ul {
          display: flex;
          li {
            color: #fff;
            width: 33.3%;
            text-align: center;
            font-size: 0.3rem;
            height: px2rem(85);
            line-height: px2rem(85);
            font-size: px2rem(12);
            overflow: hidden;
          }
        }
        > div {
          height: px2rem(760);
          overflow-y: scroll;
        }
      }
    }
  }
  .dly-number {
    width: px2rem(806);
  }
  .chartwrap {
    position: absolute;
    // top: px2rem(80);
    bottom: px2rem(10);
    left: px2rem(48);
    width: 100%;
    background-color: #24315d;
    border: 1px solid #da3779;
    border-radius: 4px;
    height: px2rem(80);
    margin: 0 auto;
    margin-top: px2rem(100);
    overflow: hidden;
    .item-list {
      min-height: px2rem(74);
      // line-height: px2rem(74);
      color: #da3779;
      margin-left: px2rem(20);
      font-size: px2rem(14);
      width: 100%;
      padding-top: px2rem(10);
      .msg-content {
        display: inline-block;
        width: 80%;
      }
      .news {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url(../../assets/news.png) no-repeat;
        background-size: contain;
        position: relative;
        top: px2rem(10);
        margin-right: px2rem(20);
      }
    }
  }
  .slideUp {
    height: px2rem(380);
    overflow-y: scroll;
  }

  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar {
    width: 4px;
    height: 6px;
    background-color: rgb(25, 38, 70);
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: rgb(25, 38, 70);
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #8187e5;
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
  .itempanelbd {
    border: 1px solid #8187e5;
    background-color: #223366;
    border-radius: 0.04rem;
    position: absolute;
    z-index: 1;
    height: auto;
    right: 6.6rem;
  }
  .itempanelbd {
    > span {
      display: inline-block;
      width: 100%;
      height: px2rem(70);
      line-height: px2rem(70);
      text-align: center;
      cursor: pointer;
      color: #8187e5;
      text-align: left;
      padding-left: px2rem(20);
      position: relative;
      span {
        position: absolute;
        right: px2rem(10);
      }
    }
  }
  .itempanelbd span:hover {
    color: #fff;
    background-color: #3368b9;
  }
  .warn {
    color: #f9387f !important;
  }
  .dialog__wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
    z-index: 2004;
  }
  .v-modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: #000;
  }
  .el-menu-vertical-demo.el-menu {
    // background: #354068;
    // color: #fff;
    // opacity: 0.9;
    width: 100%;
    position: absolute;
    top: 3.46rem;
    height: 5rem;
    overflow: scroll;
  }
  .el-tree:focus > .el-tree-node__content {
    background-color: #20263f;
    opacity: 0.9;
  }
  .el-tree-node:focus > .el-tree-node__content {
    background-color: #20263f;
    opacity: 0.9;
  }
  .el-tree .el-tree-node__content:hover {
    background-color: #20263f;
    opacity: 0.9;
  }
  .el-tree-node__children .el-tree-node__content {
    &:hover {
      background-color: #20263f;
      opacity: 0.9;
    }
  }
  .is-current {
    .el-tree-node__content {
      &:hover {
        background-color: #20263f;
        opacity: 0.9;
      }
    }
  }
  .el-icon-house {
    display: inline-block;
    width: 24px;
    height: 18px;
    background: url(../../assets/building.png) no-repeat;
    background-size: contain;
  }
}
</style>

