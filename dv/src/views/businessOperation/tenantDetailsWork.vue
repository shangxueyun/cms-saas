<template>
  <div class="tenantDetailsWork">
    <div class="head">
      <div class="home"
           @click="back"><i class="iconfont icon-kfd_shouyeL"></i> 园区管理数据</div>
      <div class="titleTxt">{{referred}}园区管理数据</div>
      <div class="time">{{date}}</div>
      <div class="back"
           @click="back">返回</div>
    </div>
    <div class="body">
      <div class="tenantList">
        <div class="tableHead">
          <i></i>
          <span class="name">客户列表</span>
          <span class="line"></span>
        </div>
        <div class="seach">
          <input type="text"
                 v-model="queryWord"
                 placeholder="请输入品牌名称">
          <span class="btn"
                @click="queryFn">查询</span>
        </div>
        <div class="table">
          <ul class="tableHead">
            <li>品牌</li>
            <li>业态</li>
            <li>租金单价(元/㎡天)</li>
            <li>房源号</li>
            <li>等级</li>
          </ul>
          <ul class="tableBody">
            <li v-for="(item,index) in tableData"
                :class="{'active':item.id===activeTenantId}"
                @click="changeTennet(item.id)"
                :key="index">
              <span>{{item.referred}}</span>
              <span>{{item.industry}}</span>
              <span class="green">{{item.unitPrice | toLocaleString}}</span>
              <span>{{item.shopNo}}</span>
              <span>
                <i class="star"
                   v-for="(k,j) in item.grade"
                   :key="j"></i>
              </span>
            </li>
          </ul>
        </div>
        <div class="table-foot"
             v-if="total > 0">
          <el-pagination background
                         layout="prev, pager, next"
                         :page-size=pgSize
                         :total="total"
                         :current-page="currentPage"
                         @current-change="current_change">
          </el-pagination>
        </div>
      </div>
      <div class="tenantInfo">
        <div class="info">
          <img :src="tenantDetails.image||berthImg">
          <div>
            <div class="item"><span class="tenantName">{{tenantDetails.teantName}}</span></div>
            <div class="item">
              <i class="star"
                 v-for="(k,j) in tenantDetails.grade"
                 :key="j"></i>
            </div>
            <div class="item">
              <span>业态： </span>
              <span>{{tenantDetails.industry}}</span>
            </div>
            <div class="item">
              <span>租金单价：</span>
              <span v-if="tenantDetails.unitPrice">{{tenantDetails.unitPrice | toLocaleString}} 元/㎡天</span>
              <span v-else> - </span>
            </div>
          </div>
          <div>
            <div class="item">
              <span>当前待缴账单：</span>
              <span>{{tenantDetails.billNumber || ' - '}}</span>
            </div>
            <div class="item">
              <span>待缴金额合计：</span>
              <span v-if="tenantDetails.billAmount ">{{tenantDetails.billAmount | toLocaleString}} 元</span>
              <span v-else> - </span>
            </div>
            <div class="item">
              <span>当前逾期账单：</span>
              <span>{{tenantDetails.overNumber  || ' - '}}</span>
            </div>
            <div class="item">
              <span>当前逾期金额合计：</span>
              <span v-if="tenantDetails.overAmount">{{tenantDetails.overAmount | toLocaleString}} 元</span>
              <span v-else> - </span>
            </div>
          </div>
          <div>
            <div class="item">
              <span>租赁面积：</span>
              <span>{{tenantDetails.area  || ' - '}} {{tenantDetails.area?'㎡':''}}</span>
            </div>
            <div class="item">
              <span>合同起止时间：</span>
              <span>{{tenantDetails.startEndTime || ' - '}} </span>
            </div>
          </div>
        </div>
        <div class="dataEchars">
          <!-- 客户租金 -->
          <div class="chartItem chart1">
            <div class="chartBg"></div>
            <div class="chartwrap">
              <div class="common-head">
                <i class="iconfont icon-biaoti"></i>客户租金
                <span class="underline"
                      style="width: 60%;"></span>
              </div>
              <div id="tenantRent"
                   style="width: 100%;height:90%;"></div>
            </div>
          </div>
          <!-- 营业收入  -->
          <div class="chartItem chart2">
            <div class="chartBg"></div>
            <div class="chartwrap">
              <div class="common-head">
                <i class="iconfont icon-biaoti"></i>营业收入
                <span class="underline"
                      style="width: 50%;"></span>
                <span class="timer">
                  <i :class="{'active':dateType==='MONTH'}"
                     @click="dateTypeChange('MONTH')">季</i>
                  |
                  <i :class="{'active':dateType==='YEAR'}"
                     @click="dateTypeChange('YEAR')">年</i>
                </span>
              </div>
              <div id="tenantTurnover"
                   style="width: 100%;height:90%;"></div>
              <div class="dataDiv">
                <span>本{{dateType==='MONTH'?'季':'年'}}营业收入</span>
                <span>{{nowAmount}}万元</span>
              </div>
              <div class="dataDiv dataDiv2">
                <span>上{{dateType==='MONTH'?'季':'年'}}营业收入</span>
                <span>{{lastAmount}}万元</span>
              </div>
            </div>
          </div>
          <!-- 税收数据  -->
          <div class="chartItem chart3">
            <div class="chartBg"></div>
            <div class="chartwrap">
              <div class="common-head">
                <i class="iconfont icon-biaoti"></i>税收数据
                <span class="underline"
                      style="width: 40%;"></span>
                <el-select v-model="paramId"
                           placeholder="征收项目"
                           size="small"
                           @change="collectionProjectChange">
                  <el-option v-for="item in collectionProjectList"
                             :key="item.id"
                             :label="item.value"
                             :value="item.id">
                  </el-option>
                </el-select>
              </div>
              <div id="tenantTax"
                   style="width: 100%;height:90%;"></div>
            </div>
          </div>
          <!-- 能耗用量 -->
          <div class="chartItem chart4">
            <div class="chartBg"></div>
            <div class="common-head">
              <i class="iconfont icon-biaoti"></i>能耗用量
              <span class="underline"
                    style="width: 75%;"></span>
              <div class="timerType">
                <span :class="{'active':dateType1==='MONTH'}"
                      @click="dateTypeChange1('MONTH')">月</span>
                |
                <span :class="{'active':dateType1==='YEAR'}"
                      @click="dateTypeChange1('YEAR')">年</span>
              </div>
            </div>
            <div class="chartwrap">
              <div id="energyamountPower"
                   style="width: 100%;height:90%;"></div>
            </div>
            <div class="chartwrap chartwrap2">
              <div id="energyamountWater"
                   style="width: 100%;height:90%;"></div>
            </div>
          </div>
          <!-- 能耗费用  -->
          <div class="chartItem chart5">
            <div class="chartBg"></div>
            <div class="chartwrap">
              <div class="common-head">
                <i class="iconfont icon-biaoti"></i>能耗费用
                <span class="underline"
                      style="width: 60%;"></span>
              </div>
              <div id="tenantEnergy"
                   style="width: 100%;height:90%;"></div>
            </div>
            <!-- <div class="legend">
              <div>电费</div>
              <div>水费</div>
            </div> -->
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
// eslint-disable-next-line no-unused-vars
import toLocaleString from '@/utils/validate'
import service from '@/service'
import moment from 'moment'
export default {
  name: 'tenantDetailsWork',
  components: {

  },
  data () {
    return {
      berthImg: require('../../assets/berth-default1.png'),
      paramId: 148,
      collectionProjectList: [],
      projectManagementId: '',
      referred: '',
      queryWord: '',
      activeTenantId: null,
      tenantDetails: {
        area: null,
        billAmount: null,
        billNumber: null,
        grade: null,
        id: 290,
        image: '',
        industry: '',
        overAmount: null,
        overNumber: null,
        startEndTime: null,
        teantName: '',
        unitPrice: null
      },
      dateType: 'MONTH', // 营业额类型  MONTH或者YEAR
      dateType1: 'MONTH', // 营业额类型  MONTH或者YEAR
      lastAmount: '',
      nowAmount: '',
      timer: null,
      date: '',
      infoItem: { name: '星巴克', yetai: '餐饮', price: '3.26', shopNum: '1-101', star: 4 },
      tableData: [],
      currentPage: 1,
      total: 0,
      pgSize: 15
    }
  },
  created () {
    this.projectManagementId = this.$route.query.projectManagementId
    this.referred = this.$route.query.referred
    this.getCollectionProject() // 税收类型下拉
    this.query(true)
  },
  mounted () {
    let _this = this
    this.timer = setInterval(function () {
      _this.date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')// 修改数据date
    }, 1000)
  },
  computed: {

  },
  methods: {
    back () {
      this.$router.back(-1)
      // this.$router.push({
      //   name: 'businessTemplate3Park',
      //   query: {
      //     projectManagementId: this.projectManagementId,
      //     referred: this.referred
      //   }
      // })
    },
    collectionProjectChange () {
      this.getTenantTax(this.activeTenantId)
    },
    async getCollectionProject () {
      let result = await service.http.get('/uaa/api/paramet-managements/name?name=征收项目')
      this.collectionProjectList = result.data.map((item) => {
        // if (item.value.length > 5) {
        //   item.value = item.value.slice(0, 4) + '...'
        // }
        return item
      })
      this.paramId = this.collectionProjectList[0].id
      // this.query()
    },
    async getDetails (tenantId) {
      let result = await service.http.get(`/cms/api/statistics/tenant/${tenantId}`)
      this.tenantDetails = result.data
      // -----------------------------------------------
      this.getTenantRentData(tenantId) // 租户租金
      this.getTenantTurnoverData(tenantId) // 营业收入
      this.getTenantTax(tenantId)// 税收数据
      this.getEnergyamount(tenantId) // 能耗用量电水气
      this.getTenantEnergy(tenantId) // 能耗费用
    },
    getTenantTax (tenantId) { // 税收数据
      service.http.get(`/cms/api/statistics/tenantTax/`, {
        tenantId: tenantId,
        paramId: this.paramId
      }).then(result => {
        let data = result.data
        let amount = data.map((item) => item.amount)
        let dateArray = data.map((item) => item.x)
        this.tenantTax(dateArray, amount)
      })
    },
    tenantTax (dateArray, amount) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('tenantTax'))
      // myChart.clear()
      // 绘制图表
      var colors = ['#68DF92', '#3F79F7']
      let option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            var showHtm = ''
            for (let i = 0; i < params.length; i++) {
              // 值
              var value = params[i].data
              showHtm += value
            }
            return showHtm
          }
        },
        grid: {
          top: '40px',
          left: '50px',
          right: '40px',
          bottom: '50px'
        },
        xAxis: [
          {
            type: 'category',
            name: '月',
            data: dateArray,
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
            type: 'bar',
            data: amount,
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
          }
        ]
      }
      myChart.setOption(option)
    },
    dateTypeChange (type) {
      this.dateType = type
      this.getTenantTurnoverData(this.activeTenantId)
    },
    dateTypeChange1 (type) {
      this.dateType1 = type
      this.getEnergyamount(this.activeTenantId)
    },
    changeTennet (tenantId) {
      this.activeTenantId = tenantId
      this.getDetails(this.activeTenantId)
    },
    queryFn () {
      this.currentPage = 1
      this.query()
    },
    async query (isCreated) {
      let result = await service.http.get('/cms/api/statistics/tenantList', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        tenantUse: 'WORK',
        projectManagementId: this.projectManagementId,
        queryWord: this.queryWord
      })
      this.tableData = result.data
      if (isCreated && this.tableData.length) {
        this.activeTenantId = this.tableData[0].id
        this.getDetails(this.activeTenantId)
      }
      this.total = Number(result.headers['x-total-count'])
    },
    getTenantRentData (tenantId) { // 租户租金
      service.http.get(`/cms/api/statistics/tenantRent/${tenantId}`).then(result => {
        let data = result.data
        let amount = data.map((item) => item.amount)
        let sjAmount = data.map((item) => item.sjAmount)
        let x = data.map((item) => item.x)
        this.tenantRent(x, amount, sjAmount)
      })
    },
    tenantRent (dateArray, amount, sjAmount) { // 租户租金
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('tenantRent'))
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
          top: '36px',
          left: '60px',
          right: '40px',
          bottom: '50px'
        },
        legend: {
          x: 'right',
          y: 'top',
          bottom: '0',
          padding: [2, 20, 0, 0],
          icon: 'circle', // 这个字段控制形状
          itemWidth: 8,  // 设置宽度
          itemHeight: 8, // 设置高度
          // itemGap: 40, // 设置间距
          textStyle: {
            color: '#E9F0FD'
          },
          data: ['应收', '已收']
        },
        xAxis: [
          {
            type: 'category',
            name: '年',
            data: dateArray,
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
            name: '应收',
            type: 'bar',
            data: amount,
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
            name: '已收',
            type: 'bar',
            data: sjAmount,
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
          }
        ]
      }
      myChart.setOption(option)
    },
    getTenantTurnoverData (tenantId) { // 营业收入
      service.http.get(`/cms/api/statistics/tenantTurnover/work`, {
        tenantId: tenantId,
        dateType: this.dateType
      }).then(result => {
        let data = result.data
        let amount = data.list.map((item) => item.amount)
        let x = data.list.map((item) => item.x)
        this.lastAmount = data.lastAmount
        this.nowAmount = data.nowAmount
        this.tenantTurnover(amount, x)
      })
    },
    tenantTurnover (dataArr, datearr) { // 营业收入
      // 基于准备好的dom，初始化echarts实例
      // let _this = this
      let series = {
        type: 'line',
        symbol: 'none',
        // smooth: 0.3,
        itemStyle: {
          normal: {   // 颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0.3,
              color: 'rgba(80,141,255,0.39)'
            },
            {
              offset: 0.5,
              color: 'rgba(56,155,255,0.25)'
            },
            {
              offset: 1,
              color: 'rgba(38,197,254,0.00)'
            }]
            ),  // 背景渐变色
            lineStyle: {        // 系列级个性化折线样式
              width: 2,
              type: 'solid',
              color: '#0BBEDB'
            }
          },
          emphasis: {
            color: '#000000',
            lineStyle: {        // 系列级个性化折线样式
              width: 2,
              type: 'dotted',
              color: '#000000'// 折线的颜色
            }
          }
        }, // 线条样式
        areaStyle: { normal: {} },
        data: dataArr
      }
      let myChart = echarts.init(document.getElementById('tenantTurnover'))
      myChart.clear()
      // 绘制图表
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            var showHtm = ''
            for (let i = 0; i < params.length; i++) {
              // 值
              var value = params[i].data
              showHtm += value
            }
            return showHtm
          }
        },
        grid: {
          top: '36px',
          left: '50px',
          right: '100px',
          bottom: '50px'
        },
        xAxis: [
          {
            type: 'category',
            name: '月',
            boundaryGap: false,
            data: datearr,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: '#B1A8D1', // 颜色
                width: 1 // 粗细
              }
            },
            axisLabel: {// x轴文字的配置
              show: true,
              textStyle: {
                color: '#B1A8D1'
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
                color: '#B1A8D1', // 颜色
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
              interval: 3,
              show: true,
              textStyle: {
                color: '#B1A8D1'
              }
            }
          }
        ],
        series: series
      }
      myChart.setOption(option)
    },
    getEnergyamount (tenantId) { // 用量电水气
      service.http.get(`/cms/api/statistics/energyConsumption`, {
        tenantId: tenantId,
        dateType: this.dateType1
      }).then(result => {
        let data = result.data
        let dateArray = data.map((item) => item.x)
        let electric = data.map((item) => item.electric)
        let water = data.map((item) => item.water)
        this.energyamountPower(dateArray, electric)
        this.energyamountWater(dateArray, water)
      })
    },
    energyamountPower (dateArray, dataArray) { // 用量电
      let myChart = echarts.init(document.getElementById('energyamountPower'))
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
          left: '40px',
          right: '30px',
          bottom: '40px'
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
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: 'ｋｗ·ｈ',
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
            data: dataArray
          }
        ]
      }
      myChart.setOption(option)
    },
    energyamountWater (dateArray, dataArray) { // 用量水
      let myChart = echarts.init(document.getElementById('energyamountWater'))
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
          left: '40px',
          right: '30px',
          bottom: '40px'
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
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: 'm³',
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
            data: dataArray
          }
        ]
      }
      myChart.setOption(option)
    },
    energyamountGas (dateArray, dataArray) { // 用量气
      let myChart = echarts.init(document.getElementById('energyamountGas'))
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
          data: ['用气'],
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
          bottom: '40px'
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
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: 'm³',
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
            name: '用气',
            type: 'line',
            // stack: '总量',
            symbol: 'none',
            smooth: true,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(238, 80, 127, 0.2)'
                }, {
                  offset: 1,
                  color: 'rgba(238, 80, 127, 0)'
                }])
              }
            },
            itemStyle: {
              normal: {
                color: '#EE507F'
              }
            },
            data: dataArray
          }
        ]
      }
      myChart.setOption(option)
    },
    getTenantEnergy (tenantId) { // 能耗费用
      service.http.get(`/cms/api/statistics/tenantEnergy/${tenantId}`).then(result => {
        let data = result.data
        let water = data.map((item) => item.water)
        let electric = data.map((item) => item.electric)
        let datearr = data.map((item) => item.x)
        this.tenantEnergy(electric, water, datearr)
      })
    },
    tenantEnergy (electric, water, datearr) { // 能耗费用
      // 基于准备好的dom，初始化echarts实例
      // let _this = this
      let series = [
        {
          name: '电费',
          type: 'line',
          symbol: 'none',
          smooth: true,
          itemStyle: {
            normal: {   // 颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0.3,
                  color: 'rgba(7,255,164,0.3)'
                },
                {
                  offset: 0.5,
                  color: 'rgba(144,242,206,0)'
                },
                {
                  offset: 1,
                  color: 'rgba(7,255,164,0)'
                }]
                ) // 背景渐变色
              },
              lineStyle: {        // 系列级个性化折线样式
                width: 2,
                type: 'solid',
                color: '#07FFA4'
              }
            }
          }, // 线条样式
          areaStyle: { normal: {} },
          data: electric
        },
        {
          name: '水费',
          type: 'line',
          symbol: 'none',
          smooth: true,
          itemStyle: {
            normal: {   // 颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0.3,
                  color: 'rgba(6,230,250,0.3)'
                },
                {
                  offset: 0.5,
                  color: 'rgba(6,230,250,0)'
                },
                {
                  offset: 1,
                  color: 'rgba(6,230,250,0)'
                }]
                )  // 背景渐变色
              },
              lineStyle: {        // 系列级个性化折线样式
                width: 2,
                type: 'solid',
                color: '#06E6FA'
              }
            }
          }, // 线条样式
          areaStyle: { normal: {} },
          data: water
        }
      ]
      let myChart = echarts.init(document.getElementById('tenantEnergy'))
      myChart.clear()
      // 绘制图表
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            var showHtm = ''
            for (let i = 0; i < params.length; i++) {
              // 值
              var value = params[i].seriesName + ':' + params[i].value + '</br>'
              showHtm += value
            }
            return showHtm
          }
        },
        color: ['#07FFA4', '#06E6FA'],
        legend: {
          data: ['电费', '水费'],
          top: '8%',
          left: '85%',
          textStyle: {
            color: '#E9F0FD'
          },
          itemHeight: 14,
          itemWidth: 3,
          icon: 'rect',
          // x: 'right',
          orient: 'vertical',  // 垂直显示
          y: 'center',    // 延Y轴居中
          x: 'left' // 居右显示
        },
        grid: {
          top: '36px',
          left: '50px',
          right: '100px',
          bottom: '50px'
        },
        xAxis: [
          {
            type: 'category',
            name: '月',
            boundaryGap: false,
            data: datearr,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: '#B1A8D1', // 颜色
                width: 1 // 粗细
              }
            },
            axisLabel: {// x轴文字的配置
              show: true,
              textStyle: {
                color: '#B1A8D1'
              }
            }
          }
        ],
        yAxis: [
          {
            name: '元',
            nameTextStyle: {
              color: '#B1A8D1'
            },
            position: 'left',
            type: 'value',
            'axisLine': {       // y轴
              'show': true,
              lineStyle: {
                color: '#B1A8D1', // 颜色
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
              interval: 3,
              show: true,
              textStyle: {
                color: '#B1A8D1'
              }
            }
          }
        ],
        series: series
      }
      myChart.setOption(option)
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    login () {
      sessionStorage.removeItem('token')
      service.user.login('admin', 'admin')
    }
  },
  beforeDestroy () {
  }
}
</script>
<style lang="scss">
@import "../../style/mqO2O.scss";
// .el-select-dropdown {
//   background-color: rgba(63, 56, 138, 0.4) !important;
//   .el-select-dropdown__item {
//     color: #fff;
//   }
// }
.tenantDetailsWork {
  .el-select {
    width: px2rem(200);
    .el-input--small {
      font-size: px2rem(22);
      .el-input__inner {
        padding-right: 26;
        background-color: transparent;
        border: none;
        color: #e9f0fd;
      }
    }
  }
  .table-foot {
    margin-right: px2rem(50);
    .el-pagination.is-background .btn-prev,
    .el-pagination.is-background .btn-next {
      width: px2rem(60);
      height: px2rem(60);
      background: #2e4983;
      border-radius: 50%;
      color: #acf9fc;
      &:disabled {
        opacity: 0.6;
      }
    }
    .el-pagination.is-background .el-pager li {
      background-color: transparent;
      color: #3687d2;
      min-width: px2rem(60);
      font-size: px2rem(30);
      border-radius: 0;
      &:not(.disabled).active {
        background-color: transparent;
        color: #acf9fc;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
@import "../../style/mqO2O.scss";
.tenantDetailsWork {
  height: px2rem(1080 * 2);
  background: url(../../assets/bg3.png) no-repeat;
  background-size: 100% 100%;
  position: relative;
  .body {
    display: flex;
    // align-items: center;
    .tenantList {
      width: px2rem(1200);
      height: px2rem(1684);
      background: url(../../assets/listBg.png) no-repeat;
      background-size: 100% 100%;
      margin: 0 px2rem(103) 0 px2rem(90);
      color: #e9f0fd;
      .table {
        border: none;
        font-size: px2rem(30);
        > .tableHead {
          height: px2rem(80);
          line-height: px2rem(80);
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
          height: px2rem(1200);
          > li {
            padding-left: px2rem(40);
            height: px2rem(80);
            line-height: px2rem(80);
            display: flex;
            cursor: pointer;
            &.active {
              background: #26206e;
            }
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
                &.green {
                  color: #06e6fa;
                }
              }
              &:nth-child(4) {
                width: 15%;
              }
              &:nth-child(5) {
                width: 20%;
                display: flex;
                align-items: center;
                padding-left: px2rem(40);
                .star {
                  display: inline-block;
                  width: px2rem(22);
                  height: px2rem(22);
                  background: url(../../assets/star.png) no-repeat;
                  background-size: 100% 100%;
                  margin-right: px2rem(8);
                }
              }
            }
          }
        }
      }
      .seach {
        margin: px2rem(60) 0 px2rem(40) 0;
        padding: 0 px2rem(40);
        input {
          width: px2rem(450);
          height: px2rem(60);
          background: #221e64;
          border: px2rem(2) solid #252468;
          color: #e9f0fd;
          border-radius: px2rem(2);
          font-size: px2rem(28);
          text-indent: px2rem(20);
        }
        .btn {
          margin-left: px2rem(30);
          display: inline-block;
          width: px2rem(200);
          height: px2rem(60);
          text-align: center;
          line-height: px2rem(60);
          background: #242e5f;
          border: px2rem(2) solid #273a6d;
          border-radius: px2rem(4);
          cursor: pointer;
        }
      }
      > .tableHead {
        padding: 0 px2rem(40);
        margin-top: px2rem(40);
        display: flex;
        align-items: center;
        > i {
          display: inline-block;
          width: px2rem(30);
          height: px2rem(30);
          background: url(../../assets/titleIcon.png) no-repeat;
          background-size: 100% 100%;
        }
        > .name {
          font-size: px2rem(32);
          margin: 0 px2rem(18);
        }
        > .line {
          display: inline-block;
          width: px2rem(920);
          height: px2rem(1);
          background-color: #7e769a;
        }
      }
    }
    .tenantInfo {
      width: px2rem(2350);
      height: px2rem(1316);
      background: url(../../assets/ListBg2.png) no-repeat;
      background-size: 100% 100%;
      .dataEchars {
        display: flex;
        flex-wrap: wrap;
        margin: px2rem(64) px2rem(40) px2rem(70);
        .chartItem {
          position: relative;
          .legend {
            position: absolute;
            top: px2rem(120);
            right: px2rem(32);
            > div {
              color: #e9f0fd;
              height: px2rem(50);
              border-left: px2rem(4) solid;
              padding-left: px2rem(15);
              margin-bottom: px2rem(20);
              &:nth-child(1) {
                border-color: #07ffa4;
              }
              &:nth-child(2) {
                border-color: #06e6fa;
              }
              &:nth-child(3) {
                border-color: #ee507f;
              }
            }
          }
          .dataDiv {
            min-width: px2rem(150);
            max-width: px2rem(180);
            height: px2rem(90);
            font-size: px2rem(20);
            color: #b1a8d1;
            background: rgba(63, 56, 138, 0.4);
            border-radius: px2rem(4);
            display: flex;
            flex-wrap: wrap;
            padding: 0 px2rem(15);
            align-items: center;
            position: absolute;
            top: px2rem(100);
            right: px2rem(20);
            > span {
              display: inline-block;
              width: 100%;
              &:nth-child(2) {
                font-size: px2rem(24);
                font-weight: 600;
                color: #e9f0fd;
              }
            }
            &.dataDiv2 {
              top: px2rem(200);
            }
          }
          &.chart1 {
            margin-left: px2rem(0) !important;
          }
          &.chart1,
          &.chart2,
          &.chart3 {
            width: px2rem(730);
            height: px2rem(380);
            margin-left: px2rem(40);
          }
          &.chart3 {
            .common-head {
              display: flex;
              align-items: center;
            }
          }
          &.chart5 {
            width: px2rem(730);
            height: px2rem(450);
            margin-left: px2rem(40);
            margin-top: px2rem(70);
            .chartwrap {
              width: px2rem(730);
              height: px2rem(450);
            }
          }
          &.chart4 {
            width: px2rem(1500);
            height: px2rem(450);
            margin-top: px2rem(70);
            .common-head {
              position: absolute;
              width: 100%;
              top: 0;
              left: 0;
              .timerType {
                position: absolute;
                right: 35px;
                top: 0;
                font-size: px2rem(24);
                font-weight: 600;
                color: #5f81d6;
                > span {
                  cursor: pointer;
                  &.active {
                    color: #e9f0fd;
                  }
                }
              }
            }
            .chartwrap {
              width: px2rem(730);
              height: px2rem(450);
              top: px2rem(70);
              &.chartwrap2 {
                left: px2rem(780);
              }
              &.chartwrap3 {
                left: px2rem(1562);
              }
            }
          }
          .chartBg {
            width: 100%;
            height: 100%;
            // width: px2rem(730);
            // height: px2rem(380);
            background-color: #201a61;
            opacity: 0.6;
          }
          .chartwrap {
            width: px2rem(730);
            height: px2rem(380);
            margin: 0 auto;
            position: absolute;
            top: 0;
            left: 0;
            color: #e9f0fd;
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
            .timer {
              color: #5f81d6;
              > i {
                font-size: px2rem(24);
                font-weight: 600;
                color: #5f81d6;
                font-style: normal;
                margin-right: px2rem(10);
                cursor: pointer;
                &.active {
                  color: #e9f0fd;
                }
              }
            }
          }
        }
      }
      .info {
        margin: px2rem(50) 0 px2rem(65) px2rem(50);
        display: flex;
        img {
          width: px2rem(410);
          height: px2rem(230);
          border-radius: px2rem(4);
          object-fit: cover;
        }
        > div {
          min-width: px2rem(450);
          max-width: px2rem(550);
          margin-left: px2rem(40);
          text-align: left;
          font-size: px2rem(30);
          color: #e9f0fd;
          > .item {
            margin-bottom: px2rem(20);
            > span {
              &:nth-child(1) {
              }
              &:nth-child(2) {
                color: #fff94a;
              }
            }
            .star {
              display: inline-block;
              width: px2rem(22);
              height: px2rem(22);
              background: url(../../assets/star.png) no-repeat;
              background-size: 100% 100%;
              margin-right: px2rem(8);
            }
          }
          &:nth-child(4) {
            min-width: px2rem(550);
            max-width: px2rem(800);
          }
        }
      }
    }
  }

  .head {
    height: px2rem(350);
    position: relative;
    font-size: px2rem(36);
    color: #cfcbdd;
    .home {
      height: px2rem(44);
      line-height: px2rem(44);
      position: absolute;
      left: px2rem(100);
      top: px2rem(140);
      cursor: pointer;
    }
    .titleTxt {
      font-size: px2rem(80);
      font-weight: bold;
      color: #e9f0fd;
      top: px2rem(114);
      margin: 0 auto;
      left: 0;
      right: 0;
      width: px2rem(1200);
      text-align: center;
      position: absolute;
    }
    .time {
      position: absolute;
      right: px2rem(100);
      top: px2rem(140);
    }
    .back {
      width: px2rem(140);
      height: px2rem(84);
      line-height: px2rem(84);
      background: #242e5f;
      border: 1px solid #273a6d;
      border-radius: 2px;
      text-align: center;
      color: #e9f0fd;
      position: absolute;
      bottom: px2rem(40);
      right: px2rem(90);
      cursor: pointer;
    }
  }
}
</style>

