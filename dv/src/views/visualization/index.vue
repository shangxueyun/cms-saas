/* eslint-disable no-unused-vars */
<template>
  <div class="park-warp">
    <!-- 新的 -->
    <div class="bigScreenInfo">
      <div class="view-content">
        <div class="view-header">
          <div class="view-header-content">
            <div class="view-header-content-left"></div>
            <div class="view-header-content-right">
              <div class="view-header-content-right-item"></div>
              <div class="view-header-content-right-right">
                <div class="view-header-cascader">

                </div>
                <div class="view-header-itemChild">
                  <span id="time">{{date}}</span>
                </div>
              </div>

            </div>
            <div class="view-header-content-flex-h3">
              <!-- <div class="view-header-content-flex-h3-iocn"></div> -->
              <h3>七宝生态商务区可视化平台</h3>
            </div>

            <div class="bjAction"></div>
          </div>
          <!-- <router-link to="/switchScreen"
                       class="returnBtn" /> -->
        </div>
        <div ref="left-animation"
             class="view-content-left">
          <div class="view-content-left-top">
            <div class="left-top-title">
              <h3>租售率</h3>
            </div>
            <div class="left-top-add">
              <div class="add-arr">
                <vue-ellipse-progress :progress="bigScreenInfo.investment.progress"
                                      :angle="-90"
                                      :color="progress.color"
                                      :colorFill="'#111839'"
                                      emptyColor="#111839"
                                      :emptyColorFill="'rgb(228,232,235,0.3)'"
                                      :size="124"
                                      :thickness="5"
                                      emptyThickness="0%"
                                      lineMode="in 0"
                                      :legend="true"
                                      :legendValue="bigScreenInfo.investment.progress"
                                      animation="rs 500 1000"
                                      :noData="false"
                                      :loading="false"
                                      fontColor="#FFFFFF"
                                      :half="false"
                                      :gap="10"
                                      dot="14 #E64267"
                                      reverse
                                      fontSize="0.48rem">
                  <span slot="legend-value">%</span>
                  <p slot="legend-caption"
                     style="color: #fff;font-size: 0.22rem">出租率</p>
                </vue-ellipse-progress>
              </div>
              <div class="chear">
                <vue-ellipse-progress :progress="bigScreenInfo.economicBenefit.progress"
                                      :angle="-90"
                                      :color="progress.color"
                                      :colorFill="'#111839'"
                                      emptyColor="#111839"
                                      :emptyColorFill="'rgb(228,232,235,0.3)'"
                                      :size="124"
                                      :thickness="5"
                                      emptyThickness="0%"
                                      lineMode="in 0"
                                      :legend="true"
                                      :legendValue="bigScreenInfo.economicBenefit.progress"
                                      animation="rs 500 1000"
                                      :noData="false"
                                      :loading="false"
                                      fontColor="#FFFFFF"
                                      :half="false"
                                      :gap="10"
                                      dot="14 #E64267"
                                      reverse
                                      fontSize="0.48rem">
                  <span slot="legend-value">%</span>
                  <p slot="legend-caption"
                     style="color: #fff;font-size: 0.22rem">出售率</p>
                </vue-ellipse-progress>
              </div>
            </div>
            <!-- <div class="right_text">2022年，6月</div> -->
          </div>
          <div class="view-content-left-center">
            <div class="left-center-title">
              <h3>当年税收</h3>
            </div>
            <div class="columnar"
                 id="technologicalDevelopment"
                 ref="technologicalDevelopment"></div>
          </div>
          <div class="view-content-left-bottom">
            <div class="left-bottom-title">
              <h3>项目概况</h3>
            </div>
            <div class="left-bottom-table">
              <TableScroll class="TableScroll"
                           :config="TableScroll.config"
                           :parame="TableScroll.parame"
                           projectKey="project"
                           :tableData="projectData" />
            </div>
          </div>
        </div>
        <div class="view-content-center">
          <div class="view-content-center-item"
               v-for="(item, index) in centerData"
               :key="index">
            <h3 v-if="item.type === '3'">
              <NumberGrow v-if="NumberFlag && !setIntervalTime[item.type]"
                          :overKey="item.type"
                          @overHtml="overHtml"
                          :time="NumberTime"
                          :value="item.value"></NumberGrow>
              <template v-else-if="!NumberFlag && !setIntervalTime[item.type]">
                <div class="number-grow-warp">
                  {{ Numberitems }}
                </div>
              </template>
              <template v-if="setIntervalTime[item.type]">
                <div class="number-grow-warp">
                  {{ thousands(item.value) }}
                </div>
              </template>
            </h3>
            <h3 v-else>
              <NumberGrow v-if="NumberFlag && !setIntervalTime[item.type]"
                          :overKey="item.type"
                          @overHtml="overHtml"
                          :time="NumberTime"
                          :value="item.value"></NumberGrow>
              <template v-else-if="!NumberFlag && !setIntervalTime[item.type]">
                <div class="number-grow-warp">
                  {{ Numberitems }}
                </div>
              </template>
              <template v-if="setIntervalTime[item.type]">
                <div class="number-grow-warp">
                  {{ thousands(item.value) }}
                </div>
              </template>
            </h3>
            <p v-if="item.type === '1'">总面积(万㎡)</p>
            <p v-if="item.type === '2'">可出租面积(万㎡)</p>
            <p v-if="item.type === '3'">可出售面积(万㎡)</p>
            <p v-if="item.type === '4'">楼宇数</p>
            <p v-if="item.type === '5'">企业数</p>
            <p v-if="item.type === '6'">税收(亿)</p>
          </div>
        </div>
        <div ref="right-animation"
             class="view-content-right">
          <div class="view-content-right-top">
            <div class="right-top-title">
              <h3>行业占比</h3>
            </div>
            <div class="columnar"
                 id="IndustryAccounted"
                 style="height: 88%"
                 ref="IndustryAccounted"></div>
            <!-- <div class="right_text">2022年，6月</div> -->
          </div>
          <div class="view-content-right-center">
            <div class="right-center-title">
              <h3>税收</h3>
              <el-dropdown trigger="click"
                           class="dropdown"
                           @command="handleCommand">
                <span class="el-dropdown-link">
                  {{ dropdownModel }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(item, index) in collectionProjectList"
                                    :key="index"
                                    :command="item">
                    {{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="columnar" >
              <div class="item">
                <!-- <NumberGrow v-if="NumberFlag && !setIntervalTime['domesticEnterprise']"
                            :overKey="'domesticEnterprise'"
                            :time="NumberTime"
                            @overHtml="overHtml"
                            :value="bigScreenInfo.revenue.YoY"></NumberGrow>
                <template v-else-if="!NumberFlag && !setIntervalTime['domesticEnterprise']">
                  <div class="number-grow-warp">
                    {{ Numberitems }}
                  </div>
                </template>
                <template v-if="setIntervalTime['domesticEnterprise']">
                  <h4 style="color: #fff">{{ bigScreenInfo.revenue.YoY }}%</h4>
                </template> -->

                      <!-- <NumberGrow v-if="NumberFlag && !setIntervalTime['domesticEnterprise']"
                                  :overKey="'domesticEnterprise'"
                                  :time="NumberTime"
                                  @overHtml="overHtml"
                                  :value="bigScreenInfo.investment.domesticEnterprise"></NumberGrow>
                      <template v-else-if="!NumberFlag && !setIntervalTime['domesticEnterprise']">
                        <div class="number-grow-warp">
                          {{ Numberitems }}
                        </div>
                      </template>
                      <template v-if="setIntervalTime['domesticEnterprise']">
                        <h4 style="color: #fff">{{ bigScreenInfo.revenue.QoQ }}%</h4>
                      </template> -->
                <h4 >{{ bigScreenInfo.revenue.YoY }}%</h4>
                <span>同比</span>
              </div>
              <div class="item">
                <h4 >{{ bigScreenInfo.revenue.QoQ }}%</h4>
                <span>环比</span>
              </div>     
            </div>
          </div>
          <div class="view-content-right-bottom">
            <div class="right-bottom-title">
              <h3>重点企业</h3>
            </div>
            <div class="right-bottom-table">
              <TableScroll class="TableScroll"
                           :config="TableScroll.config"
                           :parame="TableScroll.parame"
                           projectKey="table"
                           :tableData="tableData" />
            </div>
          </div>
        </div>
        <div class="digitizationHQ">
          <!-- <digitizationHQ ref="digitizationHQ"
                          @afterRender="afterRender"
                          :coordsPATHData="coordsPATHData" /> -->
        </div>
        <!-- 全局阴影遮罩shadow-left.png -->
        <div class="bigScreen-shadow-left"></div>
        <!-- <div class="bigScreen-shadow-top"></div>
        <div class="bigScreen-shadow-bottom"></div> -->
        <div class="bigScreen-shadow-right"></div>
      </div>
    </div>
    <!-- <div class="bw-header">
      <router-link to="/switchScreen">
        <div class="home-button"></div>
      </router-link>
      <div class="bw-title"> -->
    <!-- <span>{{titleName}}园区经营数据</span> -->
    <!-- <span>虹桥镇数字化管理平台 - 楼宇经济</span>
      </div>
      <div class="bw-timewarp">
        <span id="time">{{date}}</span>
      </div>
    </div> -->
    <!-- <div class="pw-container1">
      <div class="pwc-left">
        <div class="pwl-top">
          <div class="common-head">
            <i class="iconfont icon-biaoti"></i>现状
            <span class="underline"
                  style="width: 74%"></span>
          </div>
          <div class="economic-indicators">
            <div class="ei-item"
                 style="width: 25%">
              <div>楼宇数量</div>
              <div class="color_green">280</div>
            </div>
            <div class="ei-item"
                 style="width: 35%">
              <div>总面积 (m²)­­</div>
              <div class="color_green">324万</div>
            </div>
            <div class="ei-item"
                 style="width: 40%">
              <div>实际出租率（%）</div>
              <div class="color_green">81.8</div>
            </div>
            <div class="ei-item"
                 style="width: 25%">
              <div>入驻企业数</div>
              <div class="color_green">6,089</div>
            </div>
            <div class="ei-item"
                 style="width: 35%">
              <div>单位面积产税（元/m²）</div>
              <div class="color_green">787</div>
            </div>
            <div class="ei-item"
                 style="width: 40%">
              <div>当年税收总额（万元）</div>
              <div class="color_green">215,424</div>
            </div>
          </div>
        </div>
        <div class="pwl-bottom">
          <div class="common-head">
            <i class="iconfont icon-biaoti"></i>招商引资
            <span class="underline"
                  style="width: 74%"></span>
          </div>
          <div class="economic-indicators attract-investment">
            <div class="ei-item"
                 style="width: 25%">
              <div>新增内资企业</div>
              <div class="color_green">3691</div>
            </div>
            <div class="ei-item"
                 style="width: 35%">
              <div>税务新开户企业数</div>
              <div class="color_green">2514</div>
            </div>
            <div class="ei-item"
                 style="width: 40%">
              <div>新增企业纳税率（%）</div>
              <div class="color_green">30</div>
            </div>
            <div class="ei-item"
                 style="width: 25%">
              <div>新增外资企业</div>
              <div class="color_green">182</div>
            </div>
            <div class="ei-item"
                 style="width: 35%">
              <div>新增合同外资（万美元）</div>
              <div class="color_green">37,924</div>
            </div>
            <div class="ei-item"
                 style="width: 40%">
              <div>新增实际到位外资（万美元）</div>
              <div class="color_green">14,256</div>
            </div>
          </div>
        </div>
      </div>
      <div class="pwc-center">
        <div class="common-head">
          <i class="iconfont icon-biaoti"
             style="margin-right: 0"></i>
          <span class="underline centerunderline"
                style="width: 44%"></span>
        </div>
        <div class="img-container">
          <img :src="pictureUrl"
               alt="">
        </div>
      </div>
      <div class="pwc-right flex-end">
        <div class="pwl-top">
          <div class="common-head">
            <i class="iconfont icon-biaoti"></i>概况
            <span class="underline"
                  style="width: 64%;"></span>
          </div>
          <div class="table">
            <ul class="tableHead">
              <li>管理企业</li>
              <li>楼宇数量</li>
              <li>总面积(㎡)</li>
              <li>企业数</li>
            </ul>
            <ul class="tableBody">
              <li v-for="(item,index) in tableData"
                  :key="index">
                <span>{{item.organizeName}}</span>
                <span>{{item.buildingAmount}}</span>
                <span>{{item.area}}</span>
                <span>{{item.tatolAmount}}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="pwl-bottom">
          <div class="common-head">
            <i class="iconfont icon-biaoti"></i>运营
            <span class="underline"
                  style="width: 51%;"></span>
            <el-select v-model="kpiName"
                       size="small"
                       popper-class="park-warp-select"
                       @change="collectionProjectChange">
              <el-option v-for="item in collectionProjectList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div id="occupancyRate"
               style="width: 100%;height:90%;"></div>
        </div>
      </div>
    </div> -->

    <!-- <div class="bw-content3">
      <div class="item1">
        <div class="common-head">
          <i class="iconfont icon-biaoti"></i>经济效益
          <span class="underline"
                style="width: 74%"></span>
        </div>
        <div class="content">
          <div>
            <div>
              <p>社会消费品零售额（亿元）</p>
              <span>863</span>
            </div>
          </div>
          <div>
            <div>
              <p>商品销售总额（亿元）</p>
              <span>1614</span>
            </div>
          </div>
          <div>
            <div>
              <p>规上工业总产值（亿元）</p>
              <span>152</span>
            </div>
          </div>
          <div>
            <div>
              <p>营利性服务业收入（亿元）</p>
              <span>612</span>
            </div>
          </div>
        </div>
      </div>
      <div class="item2">
        <div class="common-head">
          <i class="iconfont icon-biaoti"></i>当年租金收缴率
          <span class="underline"
                style="width: 74%"></span>
        </div>
        <div id="rentRate"
             style="width: 100%;height:90%;"></div>
      </div>
      <div class="item3">
        <div class="common-head">
          <i class="iconfont icon-biaoti"></i>科技发展
          <span class="underline"
                style="width: 74%"></span>
        </div>
        <div id="technology"
             style="width: 100%;height:90%;"></div>
      </div>
    </div> -->
  </div>
</template>
<script>

// eslint-disable-next-line no-unused-vars
import { getNowTime, toLocaleFixed } from '@/utils/validate'
import pictureUrl from '@/assets/hongqiaoImg.png'
import service from '@/service'
import NumberGrow from './component/NumberGrow.vue'
import TableScroll from './component/TableScroll.vue'
import digitizationHQ from '../digitizationHQ/index.vue'
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 引入柱状图组件
require('echarts/lib/chart/pie')
// 折线图
require('echarts/lib/chart/line')
// custom
require('echarts/lib/chart/custom')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
export default {
  name: 'visualization',
  components: {
    NumberGrow,
    TableScroll,
    digitizationHQ
  },
  data () {
    return {
      titleName: '虹桥镇',
      date: '',
      selectIndex: 1,
      electric: [],
      water: [],
      gas: [],
      tableData: [],
      projectData: [],
      collectionProjectList: [],
      TableScroll: {
        config: {
          head: [
            { title: '管理企业', width: '7%' },
            { title: '楼宇数量', width: '7%' },
            { title: '总面积(㎡)', width: '7%' },
            { title: '企业数', width: '7%' }
          ],
          object: ['name', 'flag', 'num', 'info']
        },
        parame: {}
      },
      NumberFlag: true,
      NumberTime: 0.5,
      animationFlag: true,
      Numberitems: '-',
      progress: {
        data: [
          {
            progress: 50
          }
        ],
        // 颜色
        color: {
          radial: false,
          colors: [
            {
              color: '#6CE9ED',
              offset: '2',
              opacity: '1'
            },
            {
              color: '#6C76D0',
              offset: '100',
              opacity: '1'
            }
          ]
        },
        colorFill: '', // 定义进度圈的填充颜色
        emptyColor: '', // 定义空圆线的颜色。
        emptyColorFill: '' // 定义空圆的填充颜色。
      },
      bigScreenInfo: {
        investment: {
          progress: 0 // 出租率
        },
        economicBenefit: {
          progress: 0 // 出售率
        },
        revenue: {
          YoY: '-',
          QoQ: '-'
        }
      },
      // 解决多定时器卡顿问题
      setIntervalTime: {
        'domesticEnterprise': false,
        'overseasEnterprise': false,
        'numberEnterprise': false,
        'disbursementForeign': false,
        'contractualForeign': false,
        'socialConsumption': false,
        'merchandiseSales': false,
        'industrialEnterprises': false,
        'profitService': false,
        '1': false,
        '2': false,
        '3': false,
        '4': false,
        '5': false,
        '6': false
      },
      centerData: [
        { value: 0, type: '1' },
        { value: 0, type: '2' },
        { value: 0, type: '3' },
        { value: 0, type: '4' },
        { value: 0, type: '5' },
        { value: 0, type: '6' }
      ],
      dropdownModel: '历史税收总额',
      coordsPATHData: [],
      digitizationHQFlag: false,
      value: [],
      options: [],
      parkNewInfoData: {},
      attractData: {},
      kpiName: 3,
      pictureUrl: pictureUrl,
      haveCycle: true,
      yAxisName: ''
    }
  },
  watch: {
    // value (New, old) {
    //   this.handleChange(New)
    // }
  },
  created () {
    // this.titleName = this.$route.query.name
    // this.projectConfig(this.$route.query.id, this.$route.query.dataType)
    this.getTree()
  },
  mounted () {
    this.date = this.getNowTime()// 修改数据date
    // matrix3d(0, 0, 1, 0.002, 0, 1, 0, 0, 0, 0, 1, 0, -397, 16, 0, 1)
    // matrix3d(1, 0, 1, 0.001, 0, 1, 0, 0, 0, 0, 1, 0, 98, 128, 0, 1)
    // 图表渲染
    // this.getHistogramData()
    // this.getGradientLineChartData()
    // this.getPillars3DChartData()
  },
  methods: {
    collectionProjectChange () {
      this.parkRun(this.projectManagementId, this.parkRunDataIdType)
    },
    // 新的start
    // 全局接口数据
    getBigScreenInfo (ids) {
      // 3D动画
      // this.animation3DShow()
      // // 中间六个数据加出租率出售率
      // this.getInvestment(ids)
      // 行业占比
      this.getHistogramData()
      // 当年税收
      this.getrentalRateCharData(ids)
      // 税收
      this.getRevenueData()
    },
    //
    animation3DShow () {
      let vm = this
      if (!this.animationFlag) {
        this.$refs['left-animation'].className = 'view-content-left'
        this.$refs['right-animation'].className = 'view-content-right'
        this.$nextTick(() => {
          setTimeout(() => {
            vm.$refs['left-animation'].className = 'view-content-left left-animation'
            vm.$refs['right-animation'].className = 'view-content-right right-animation'
          }, 0)
        })
      } else {
        this.animationFlag = false
      }
    },
    // 中间六个数据加出租率出售率
    getInvestment (ids, max) {
      this.setIntervalTime = {
        'domesticEnterprise': false,
        'overseasEnterprise': false,
        'numberEnterprise': false,
        'disbursementForeign': false,
        'contractualForeign': false,
        'socialConsumption': false,
        'merchandiseSales': false,
        'industrialEnterprises': false,
        'profitService': false,
        '1': false,
        '2': false,
        '3': false,
        '4': false,
        '5': false,
        '6': false
      }
      this.bigScreenInfo.investment = {
        progress: 0 // 出租率
      }
      this.bigScreenInfo.economicBenefit = {
        progress: 0 // 出售率
      }
      this.centerData = [
        { value: 0, type: '1' },
        { value: 0, type: '2' },
        { value: 0, type: '3' },
        { value: 0, type: '4' },
        { value: 0, type: '5' },
        { value: 0, type: '6' }
      ]
      this.NumberFlag = false
      // let time = 300
      this.NumberTime = 0.5
      let vm = this
      service.http.get(`/cms/api/getOrganiz/stat?useStatus=USING&authority=false&ids=${ids}`).then(res => {
        if (res.status === 200) {
          vm.$nextTick(() => {
            // 后台让前端转后续缺精准度问题不要改
            vm.centerData = [
              { value: (res.data.area / 10000).toFixed(2), type: '1' },
              { value: (res.data.rentFm / 10000).toFixed(2), type: '2' },
              { value: (res.data.sellFm / 10000).toFixed(2), type: '3' },
              { value: res.data.buildingAmount, type: '4' },
              { value: res.data.tatolAmount, type: '5' },
              { value: (max / 10000).toFixed(2), type: '6' }
            ]
            vm.bigScreenInfo.investment = {
              progress: res.data.rentRate // 出租率
            }
            vm.bigScreenInfo.economicBenefit = {
              progress: res.data.sellRate // 出售率
            }
            vm.NumberFlag = true
          })
        }
      })
    },
    // 税收
    getRevenueData () {
      let row = this.collectionProjectList[this.collectionProjectList.length - 1]
      service.http.get(`/cms/api/tenantTax/statistics/QOQ?date=${row.value}`).then(res => {
        if (res.status === 200) {
          this.bigScreenInfo.revenue.YoY = res.data[0]
          this.bigScreenInfo.revenue.QoQ = res.data[1]
        }
      })
    },
    // 税收
    handleCommand (value) {
      this.actionshuiShouo(value)
      this.bigScreenInfo.revenue.YoY = '-'
      this.bigScreenInfo.revenue.QoQ = '-'
      service.http.get(`/cms/api/tenantTax/statistics/QOQ?date=${value.value}`).then(res => {
        if (res.status === 200) {
          this.bigScreenInfo.revenue.YoY = res.data[0]
          this.bigScreenInfo.revenue.QoQ = res.data[1]
        }
      })
    },
    // 行业占比
    getHistogramData () {
      // 接口数据
      let vm = this
      service.http.get(`/cms/api/staging/tenantIndustry/V2`).then(res => {
        if (res.status === 200) {
          let yArr = []
          let obj = {
            data1: [],
            data2: []
          }
          res.data.tenantIndustryDTOList.forEach(v => {
            yArr.push(v.industry)
            obj.data1.push({
              value: v.area,
              name: '',
              itemStyle: { color: '#282C37' }
            })
            obj.data2.push({
              value: v.area,
              name: v.industry
            })
          })
          vm.$nextTick(() => {
            vm.histogramChart(
              obj,
              yArr,
              [ '#6147AA', '#554BFB', '#357DF6', '#5EC0FB', '#29CAB1', '#50D883', '#EC8A5D', '#E5617B' ],
              'IndustryAccounted',
              '',
              '',
              res.data.allArea
            )
          })
        }
      })
      this.$nextTick(() => {
      })
    },
    getrentalRateCharData (ids) {
      let VM = this
      let Year = new Date().getFullYear()
      let start = `${Year}-01-01`
      let end = `${Year}-12-31`
      service.http.get(`/cms/api/tenantTax/statistics?startDate=${start}&endDate=${end}&dateType=MONTH`).then(res => {
        if (res.status === 200) {
          let max = 0
          let yArr = res.data.map((item, index) => {
            max = max + item.y
            return item.y
          })
          VM.getInvestment(ids, max)
          VM.$nextTick(() => {
            VM.rentalRateChar(
              [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12' ],
              yArr,
              'technologicalDevelopment',
              '税收',
              '万元',
              max.toFixed(2)
            )
          })
        }
      })
    },
    // 运营
    getGradientLineChartData () {
      // 接口数据
      this.dropdownModel = this.collectionProjectList[2].label
      this.gradientLineChart(
        [
          '2017',
          '2018',
          '2019',
          '2020',
          '2021'
        ],
        [
          688582,
          768533,
          668618,
          633494,
          692600
        ],
        'operationLine',
        this.dropdownModel,
        '万元'
      )
    },
    getPillars3DChartData () {
      // 接口数据
      let dateArray = ['工业公司', '外资公司', '上虹公司', '资产公司', '虹桥村', '虹二村', '虹四村', '虹五村', '虹六村', '红春村', '新桥村', '西郊村', '先锋村', '井亭村', '科技园区', '紫晶公司']
      let crData = ['50.7', 71.7, 42.8, 115.3, 46.0, 34.1, 50.2, '60.9', '45.1', 52.3, 52.4, 112.5, 61.9, 49.3, 130.5, 34.0]
      this.pillars3DChart(
        dateArray,
        crData,
        'collectionRate',
        '',
        ''
      )
    },
    // 双柱状渐变图
    // 参数 dateArray=> x轴数据
    // seriesData=> y轴数据
    // DomName=> dom id或者ref Dom
    // Note=> 提示title名称
    // YName=> 提示子集名称
    // animation=> 动画渲染时间  默认1秒
    // 饼状
    // resData=> 类型数据
    // legend=> 指示图例
    // color=> 颜色
    // DomName=> dom id或者ref Dom
    // text=> 底部文字数据显示
    // subtext=> 底部数据显示
    histogramChart (resData, legend, color, DomName, text, subtext, total, animation = 1000) {
      let myChart = echarts.init(document.getElementById(`${DomName}`))
      myChart.clear()
      let itemGap = 15
      if (legend && legend.length > 7) {
        itemGap = 10
      }
      let data1 = resData.data1
      let data2 = resData.data2
      let vm = this
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: function (Obj) {
            let prant = ((Obj.value / total).toFixed(4)) * 100
            prant = prant.toFixed(2)
            if (Obj.name) {
              return `${Obj.name}<br/>${Obj.value}（${prant}%）`
            }
          }
        },
        color: color,
        title: {
          show: false,
          text,
          subtext,
          x: '30%',
          y: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal',
            color: ['#333'],
            padding: [50, 10]
          },
          subtextStyle: {
            color: '#666',
            fontSize: 16
          }
        },
        legend: {
          orient: 'vertical',
          itemWidth: 20, // 标志图形的长度
          itemHeight: 10, // 标志图形的宽度
          right: '7%',
          top: legend.length > 7 ? '10%' : '18%',
          itemGap: itemGap,
          data: legend,
          textStyle: {
            color: '#9BA5B5'
          },
          formatter: function (name) {
            // var total = 0
            var target
            for (var i = 0, l = data2.length; i < l; i++) {
              // total += data[i].value
              if (data2[i].name === name) {
                target = data2[i].value
              }
            }
            let Space = ''
            if (name.length < 10) {
              let le = (10 - name.length) * 2
              if (name.length < 5) {
                le = le + name.length - 5
              }
              if (name.length === 6) {
                le--
              }
              for (let i = 0; i < le; i++) {
                Space += '  '
              }
              // '高新技术企业', '商会企业'
              if (name === '高新技术企业') {
                Space += ' '
              }
            } else {
              name = vm.strlengthMax(name, 10)
              Space += '  '
            }
            let prant = ((target / total).toFixed(4)) * 100
            prant = prant.toFixed(2)
            // let percentage = isNaN(target / total) ? 0 : (target / total)
            return name + Space + prant + '%'
          }
        },
        series: [
          {
            type: 'pie',
            center: ['30%', '50%'],
            radius: ['50%', '60%'],
            emphasis: {
              show: false,
              label: {
                show: true,
                fontSize: 10,
                fontWeight: '100'
              }
            },
            itemStyle: {
              normal: {
                borderWidth: 2, // 间距的宽度
                borderColor: '#203E58' // 背景色
              }
            },
            label: {
              normal: {
                position: 'inner',
                show: false
              }
            },
            labelLine: {
              show: false
            },
            animationDuration: animation,
            animationEasing: 'cubicInOut',
            data: data1
          },
          {
            type: 'pie',
            radius: ['70%', '80%'],
            center: ['30%', '50%'],
            emphasis: {
              label: {
                show: true,
                fontSize: 18,
                fontWeight: 'bold'
              }
            },
            itemStyle: {
              normal: {
                borderWidth: 2, // 间距的宽度
                borderColor: '#203E58' // 背景色
              }
            },
            label: {
              show: false,
              position: 'center'
            },
            labelLine: {
              show: false
            },
            animationDuration: animation,
            animationEasing: 'cubicInOut',
            data: data2
          }
        ]
      }
      myChart.setOption(option)
    },
    // 柱状图
    // 参数 dateArray=> x轴数据
    // seriesData=> y轴数据
    // DomName=> dom id或者ref Dom
    // Note=> 提示title名称
    // YName=> 提示子集名称
    rentalRateChar (dateArray, seriesData, DomName, Note, YName, num, animation = 1000) {
      var dataShadow = []
      for (var i = 0; i < seriesData.length; i++) {
        dataShadow.push(seriesData[i])
      }
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById(`${DomName}`))
      myChart.clear()
      // 绘制图表
      var colors = ['#DD6243', '#54B0E8', '#62CA6D', '#66CEB5', '#9F88F3']
      let text = `当年总税收：${num}${YName}`
      let name = `单位：${YName}`
      let option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            const item = params[1] ? params[1] : params[0]
            if (item) {
              if (Note === '出租率' || Note === '收缴率') {
                return item.axisValue + '<br>' + Note + '：' + item.data + '%'
              } else {
                return item.axisValue + '月<br>' + Note + '：' + item.data + YName
              }
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        title: {
          show: true,
          text,
          x: 'right',
          y: '12%',
          textStyle: {
            fontSize: 12,
            fontWeight: 'normal',
            color: ['#9BA5B5'],
            padding: [50, 10]
          },
          subtextStyle: {
            color: '#9BA5B5',
            fontSize: 14
          }
        },
        xAxis: [
          {
            type: 'category',
            data: dateArray,
            axisTick: {
              alignWithLabel: true,
              show: false
            },
            axisLine: {
              lineStyle: {
                show: false,
                color: '#2A4065', // 颜色
                width: 1 // 粗细
              }
            },
            axisLabel: {// x轴文字的配置
              interval: 0,
              // rotate: 40,
              show: true,
              textStyle: {
                color: '#F3F8FC'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name,
            'axisLine': {       // y轴
              'show': true,
              lineStyle: {
                color: '#9BA5B5', // 颜色
                width: 1 // 粗细
              }
            },
            'axisTick': {       // y轴刻度线
              'show': true
            },
            splitLine: {// 分割线配置
              show: false,
              lineStyle: {
                color: '#9BA5B5'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#9BA5B5'
              }
            }
          }
        ],
        series: [{
          type: 'bar',
          barWidth: '10',
          itemStyle: {
            normal: {
              barBorderRadius: [4, 4, 0, 0],
              label: {
                show: false,
                formatter: function (params) {
                  if (params) {
                    return params.data + '%'
                  }
                },
                // 开启显示
                position: 'top',
                // 在上方显示
                textStyle: { // 数值样式
                  color: '#262626',
                  fontSize: 12
                }
              },
              color: function (params) {
                return new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#07F6F9' },
                    { offset: 1, color: '#0180FF' }
                  ]
                )
              }
            }
          },
          animationDuration: animation,
          animationEasing: 'cubicInOut',
          data: dataShadow
          // data: [10, 52, 20, 33, 39]
        }]
      }

      myChart.setOption(option)
    },
    // 立体柱状图
    // 参数 dateArray=> x轴数据
    // seriesData=> y轴数据
    // DomName=> dom id或者ref Dom
    // Note=> 提示title名称
    // YName=> 提示子集名称
    pillars3DChart (dateArray, seriesData, DomName, animation = 1000, YName) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById(`${DomName}`))
      myChart.clear()
      // 从这里开始 创建自定义图形 —— 长方体的正面
      let fontSize = 4
      let MyCubeRect = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0,
          width: 30, // 柱宽
          zWidth: 2, // 阴影折角宽
          zHeight: 0 // 阴影折角高
        },
        buildPath: function (ctx, shape) {
          const api = shape.api
          const xAxisPoint = api.coord([shape.xValue, 0])
          const p0 = [shape.x, shape.y]
          const p1 = [shape.x - fontSize, shape.y]
          const p4 = [shape.x + fontSize, shape.y]
          const p2 = [xAxisPoint[0] - fontSize, xAxisPoint[1]]
          const p3 = [xAxisPoint[0] + fontSize, xAxisPoint[1]]

          ctx.moveTo(p0[0], p0[1]) // 0
          ctx.lineTo(p1[0], p1[1]) // 1
          ctx.lineTo(p2[0], p2[1]) // 2
          ctx.lineTo(p3[0], p3[1]) // 3
          ctx.lineTo(p4[0], p4[1]) // 4
          ctx.lineTo(p0[0], p0[1]) // 0
          ctx.closePath()
        }
      })
      // 创建第二个自定义图形 —— 长方体的上面和侧面
      let MyCubeShadow = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0,
          width: 30,
          zWidth: 2,
          zHeight: 2
        },
        buildPath: function (ctx, shape) {
          const api = shape.api
          const xAxisPoint = api.coord([shape.xValue, 0])
          // const p0 = [shape.x, shape.y]
          const p1 = [shape.x - fontSize, shape.y]
          const p4 = [shape.x + fontSize, shape.y]
          const p6 = [shape.x + fontSize + 8, shape.y - 4]
          const p7 = [shape.x - fontSize + 8, shape.y - 4]
          const p3 = [xAxisPoint[0] + fontSize, xAxisPoint[1]]
          const p5 = [xAxisPoint[0] + fontSize + 8, xAxisPoint[1] - 4]

          ctx.moveTo(p4[0], p4[1]) // 4
          ctx.lineTo(p3[0], p3[1]) // 3
          ctx.lineTo(p5[0], p5[1]) // 5
          ctx.lineTo(p6[0], p6[1]) // 6
          ctx.lineTo(p4[0], p4[1]) // 4

          ctx.moveTo(p4[0], p4[1]) // 4
          ctx.lineTo(p6[0], p6[1]) // 6
          ctx.lineTo(p7[0], p7[1]) // 7
          ctx.lineTo(p1[0], p1[1]) // 1
          ctx.lineTo(p4[0], p4[1]) // 4
          ctx.closePath()
        }
      })
      echarts.graphic.registerShape('MyCubeRect', MyCubeRect)
      echarts.graphic.registerShape('MyCubeShadow', MyCubeShadow)
      // dateArray长度
      dateArray.forEach((v, i) => {
        let str
        if (v.length > 5) {
          str = v.substr(0, 3) + '...'
        } else {
          str = v
        }
        dateArray[i] = str
      })
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        title: {
          text: '2022年，6月',
          top: '0%',
          right: '8%',
          textStyle: {
            color: '#fff',
            fontSize: 12,
            fontFamily: 'Arial',
            fontWeight: '400'
          }
        },
        grid: {
          // containLabel: true
          top: '36px',
          left: '66px',
          right: '40px',
          bottom: '70px'
        },
        xAxis: [
          {
            type: 'category',
            name: '',
            data: dateArray,
            axisPointer: {
              type: 'shadow',
              snap: false
            },
            axisTick: {
              show: false,
              alignWithLabel: false
            },
            axisLabel: {
              rotate: 40,
              textStyle: {
                color: '#F3F8FC',
                fontSize: 11
              }
            },
            axisLine: {
              lineStyle: {
                color: '#2A4065'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '单位： %',
            // min: 0,
            // max: visitmax,
            // minInterval: 1,
            axisLabel: {
              textStyle: {
                color: '#fff',
                fontSize: 12
              }
            },
            axisTick: { // y轴刻度线
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#fff',
                opacity: 0
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#2A4065']
              }
            }
          }
        ],
        series: [
          {
            type: 'custom',
            data: seriesData,
            barWidth: 50, // 柱图宽度
            renderItem: function (params, api) {
              let location = api.coord([api.value(0), api.value(1)])
              return {
                type: 'group',
                children: [
                  {
                    type: 'MyCubeRect',
                    shape: {
                      api,
                      xValue: api.value(0), // 表示取出当前 dataItem 中第一个维度的数值
                      yValue: api.value(0),
                      x: location[0],
                      y: location[0.2]
                    },
                    style: {
                      stroke: 'rgba(0,0,0,0)',
                      fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#62cfe4' },
                        { offset: 0.2, color: '#62cfe4' },
                        { offset: 0.6, color: '#4da3c6' },
                        { offset: 0.9, color: '#4da3c6' },
                        { offset: 1, color: '#4da3c6' }
                      ])
                    }
                  },
                  {
                    type: 'MyCubeRect', // shape 属性描述了这个矩形的像素位置和大小
                    shape: {
                      api,
                      xValue: api.value(0), // 表示取出当前 dataItem 中第一个维度的数值
                      yValue: api.value(0),
                      x: location[0],
                      y: location[1]
                    },
                    style: {
                      stroke: 'rgba(0,0,0,0)', // 边框颜色
                      fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#62cfe4' },
                        { offset: 0.2, color: '#62cfe4' },
                        { offset: 0.6, color: '#4da3c6' },
                        { offset: 0.9, color: '#4da3c6' },
                        { offset: 1, color: '#4da3c6' }
                      ])
                    }
                  },
                  {
                    type: 'MyCubeShadow',
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1]
                    },
                    style: {
                      stroke: 'rgba(0,0,0,0)', // 边框颜色
                      fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#62cfe4' },
                        { offset: 0.2, color: '#62cfe4' },
                        { offset: 0.6, color: '#4da3c6' },
                        { offset: 0.9, color: '#4da3c6' },
                        { offset: 1, color: '#4da3c6' }
                      ])
                    }
                  }
                ]
              }
            },
            animation: true,
            animationDuration: animation,
            animationEasing: 'cubicInOut',
            itemStyle: {
              normal: {
                barBorderRadius: [0, 0, 0, 0],
                color: function (params) {
                  if (params.value > 75 && params.value < 90) { // 大于75 小90 橙色
                    return new echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [
                        { offset: 0, color: '#FF001E' },
                        { offset: 1, color: '#EEB548' }
                      ]
                    )
                  } else if (params.value < 75) { // 红色
                    return new echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [
                        { offset: 0, color: '#f00f00' },
                        { offset: 1, color: '#FF001E' }
                      ]
                    )
                  } else {
                    return new echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [
                        { offset: 0, color: '#007FFF' },
                        { offset: 1, color: '#07F6F9' }
                      ]
                    )
                  }
                }
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    },
    // 渐变实体折线图
    // 参数 dateArray=> x轴数据
    // seriesData=> y轴数据
    // DomName=> dom id或者ref Dom
    // Note=> 提示title名称
    // YName=> 提示子集名称
    gradientLineChart (dateArray, seriesData, DomName, Note, YName, animation = 1000) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById(`${DomName}`))
      myChart.clear()
      let option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: Note,
          show: false,
          right: '20px',
          itemWidth: 10,
          itemHeight: 5,
          textStyle: {
            color: '#ffffff',
            fontSize: '10px'
          }
        },
        grid: {
          // containLabel: true
          top: '36px',
          left: '90px',
          right: '40px',
          bottom: '50px'
        },
        xAxis: [
          {
            type: 'category',
            name: '',
            data: dateArray,
            boundaryGap: false,
            axisPointer: {
              type: 'shadow',
              snap: false
            },
            axisTick: {
              show: false,
              alignWithLabel: false
            },
            axisLabel: {
              // rotate: 40,
              textStyle: {
                color: '#fff',
                fontSize: 11
              }
            },
            axisLine: {
              lineStyle: {
                color: '#2A4065'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: YName ? `单位： ${YName}` : '',
            // min: 0,
            // max: visitmax,
            // minInterval: 1,
            axisLabel: {
              textStyle: {
                color: '#fff',
                fontSize: 12
              }
            },
            axisTick: { // y轴刻度线
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#fff',
                opacity: 0
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#2A4065']
              }
            }
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 5
          }
        ],
        series: [
          {
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            itemStyle: {
              normal: {
                // 线条渐变色
                lineStyle: { // 系列级个性化折线样式
                  width: 1,
                  type: 'solid',
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgb(223,125,96)'
                  }, {
                    offset: 1,
                    color: '#F08753'
                  }])
                }
              },
              emphasis: {
                // 线条渐变色
                lineStyle: { // 系列级个性化折线样式
                  width: 2,
                  type: 'dotted',
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgb(223,125,96)'
                  }, {
                    offset: 1,
                    color: '#F08753'
                  }])
                }
              }
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgb(223,125,96,0.5)' },
                { offset: 0.5, color: 'rgb(223,125,96,0.5)' },
                { offset: 0.8, color: 'rgb(236,187,87,0.4)' },
                { offset: 1, color: 'rgb(0,0,0,0)' }
              ])
            },
            animationDuration: animation,
            animationEasing: 'cubicInOut',
            data: seriesData
          }
        ]
      }

      myChart.setOption(option)
    },
    //
    overHtml (key) {
      this.setIntervalTime[key] = true
    },
    coordsPATHDataDispose (data) {
      this.coordsPATHData = []
      // 主数据
      data.forEach(organize => {
        let projectManagementDTO = organize.projectManagementDTO
        if (projectManagementDTO.length) {
          let projectObj
          projectManagementDTO.forEach((obj) => {
            let { projectName, lat, lot, scopes } = obj
            projectObj = {
              center: [lot, lat],
              name: projectName,
              path: []
            }
            var regionArr = []
            scopes.forEach(region => {
              region.forEach(lat => {
                regionArr.push([lat.lng, lat.lat])
              })
            })
            if (regionArr.length && regionArr.length > 0) {
              projectObj.path = regionArr
              this.coordsPATHData.push(projectObj)
            }
          })
        }
      })
      // if (this.coordsPATHData.length) {
      //   this.digitizationHQFlag = true
      //   let vm = this
      //   console.log(JSON.stringify(this.coordsPATHData))
      //   this.$nextTick(() => {
      //     vm.$refs['digitizationHQ'].switchUpdateCoords(this.coordsPATHData)
      //   })
      // } else {
      //   // 数据为空处理地图渲染
      // }
    },
    // end
    // 园区运营
    parkRun (id, level) {
      let crData = []
      let dateArray = [2017, 2018, 2019, 2020, 2021]
      if (this.kpiName === 1) {
        crData = [0, 0, 0, 0, 6089]
        this.yAxisName = ''
      } else if (this.kpiName === 2) {
        crData = [0, 0, 0, 0, 787]
        this.yAxisName = ''
      } else if (this.kpiName === 3) {
        crData = [688582, 768533, 668618, 633494, 660293]
        this.yAxisName = '万元'
      }
      this.occupancyRate(dateArray, crData)
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
          left: '66px',
          right: '40px',
          bottom: '50px'
        },
        xAxis: [
          {
            type: 'category',
            name: '年',
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
            name: this.yAxisName,
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
            name: '数据',
            type: 'bar',
            barWidth: '16',
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
    getTree () {
      service.http.get(`/uaa/api/organizes/all/simple?organizeType=ENTERPRISE&useStatus=USING`).then(res => {
        if (res.status === 200) {
          // this.options = res.data.map((item, index) => { // 只保留两级children
          //   item.children.forEach((itm, idx) => {
          //     delete itm.children
          //   })
          //   return item
          // })
          // console.log(this.options)
          this.handleChange(res.data)
        }
      })
    },
    handleChange (value) {
      // console.log(value)
      let ids = value.map((item, index) => {
        return item.id
      })
      ids = ids.toString()
      // 项目概况
      service.http.get(`/cms/api/stat/projectByOid?useStatus=USING&authority=false&ids=${ids}`).then(res => {
        if (res.status === 200) {
          this.projectData = []
          res.data.forEach(v => {
            v.organizeName = this.strlengthMax(v.organizeName, 7)
            v.area = this.thousands(v.area)
            this.projectData.push(v)
          })
        }
      })
      // 重点企业
      service.http.get(`/cms/api/tenantTax/statistics/tenantRank`).then(res => {
        if (res.status === 200) {
          this.tableData = []
          res.data.forEach(v => {
            v.teantName = this.strlengthMax(v.teantName, 7)
            v.address = this.strlengthMax(v.address, 7)
            v.companyIndustry = this.strlengthMax(v.companyIndustry, 7)
            v.taxAmount = this.thousands(v.taxAmount)
            this.tableData.push(v)
          })
        }
      })
      // 税收数据
      this.collectionProjectList = []
      for (let i = 0; i < 12; i++) {
        this.collectionProjectList.push(this.timeDate(12, i))
      }
      this.actionshuiShouo(this.collectionProjectList[12 - 1])
      // 渲染完成调用
      this.$nextTick(() => {
        this.getBigScreenInfo(ids)
      })
    },
    thousands (str) {
      let num = str.toString()
      let intNum = num
      let float = ''
      if (num.includes('.')) {
        intNum = num.substr(0, num.indexOf('.'))
        float = num.substr(num.indexOf('.'))
      }
      intNum = intNum.replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, '$1,')
      return `${intNum}${float}`
    },
    timeDate (le, i) {
      let time = this.monthAddSubtract(new Date(), le - i)
      let date = new Date(time.$d)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      // let y = time
      m = m.toString().length === 2 ? m : `0${m}`
      let obj = {
        value: `${y}-${m}-01`, label: `${y}年${m}月`
      }
      return obj
    },
    // 月份加减
    monthAddSubtract (time, le, flag) {
      if (flag) {
        return this.dayjs(time).add(le, 'month')
      } else {
        return this.dayjs(time).subtract(le, 'month')
      }
    },
    strlengthMax (str, num) {
      let le = str.length
      let str1
      if (le >= num) {
        str1 = str.substr(0, num - 1) + '...'
      } else {
        str1 = str
      }
      return str1
    },
    actionshuiShouo (row) {
      this.dropdownModel = row.label
    },
    getTechnology () {
      // let dateArray = [2017, 2018, 2019, 2020, 2021]
      // let crData = [97.2, 95.2, 100.4, 99.0, 86.1, 104.8, 98.6, 139.0, 108.4, 100.8]
      this.technologyChart()
    },
    technologyChart (dateArray, data) {
      let myChart = echarts.init(document.getElementById('technology'))
      let option = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['科技企业数', '高新技术企业数'],
          right: '20px',
          itemWidth: 10,
          itemHeight: 5,
          textStyle: {
            color: '#ffffff',
            fontSize: '10px'
          }
        },
        grid: {
          // containLabel: true
          top: '36px',
          left: '66px',
          right: '40px',
          bottom: '50px'
        },
        xAxis: [
          {
            type: 'category',
            name: '',
            data: ['2018', '2019', '2020', '2021', '2022'],
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
            name: '',
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
            name: '科技企业数',
            type: 'bar',
            stack: 'Ad',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#4285DB' },
                { offset: 0.2, color: '#4285DB' },
                { offset: 0.4, color: '#4285DB' },
                { offset: 0.4, color: '#4285DB' },
                { offset: 0.6, color: '#587FC0' },
                { offset: 0.8, color: 'rgba(0,0,0,0)' },
                { offset: 1, color: 'rgba(0,0,0,0)' }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: [400, 500, 700, 400, 550]
          },
          {
            name: '高新技术企业数',
            type: 'bar',
            stack: 'Ad',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#F6807C' },
                { offset: 0.2, color: '#F6807C' },
                { offset: 0.4, color: '#F6807C' },
                { offset: 0.4, color: '#F6807C' },
                { offset: 0.6, color: '#E16A66' },
                { offset: 0.8, color: 'rgba(0,0,0,0)' },
                { offset: 1, color: 'rgba(0,0,0,0)' }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: [600, 790, 1100, 600, 800]
          }
        ]
      }
      myChart.setOption(option)
    },
    getRentdata (id, level) {
      // service.http.get(`/cms/api/parkRun`, { level: level, id: id, kpiName: this.kpiName }).then(res => {
      //   if (res.status === 200 && res.data.length > 0) {
      //     const resData = res.data
      let dateArray = ['工业公司', '外资公司', '上虹公司', '资产公司', '虹桥村', '虹二村', '虹四村', '虹五村', '虹六村', '红春村', '新桥村', '西郊村', '先锋村', '井亭村', '科技园区', '紫晶公司']
      let crData = [114.4, 104.0, 101.3, 103.0, 101.0, 102.8, 100.8, 104.2, 98.9, 110.8, 100.9, 134.3, 103.9, 105.7, 117.2, 100.0]

      //     resData.forEach(ele => {
      //       dateArray.push(ele.time)
      //       let val = ele.value
      //       if (this.kpiName === 'LNSS' || this.kpiName === 'LNZCZJ') {
      //         val = toLocaleFixed(val)
      //       }
      //       crData.push(val)
      //     })
      // if (this.kpiName === 'LNJYRS') {
      //   this.yAxisName = '人数'
      // } else if (this.kpiName === 'LNRYQY') {
      //   this.yAxisName = '家'
      // } else {
      //   this.yAxisName = '万元'
      // }
      this.rentRateChart(dateArray, crData)
      //   }
      // })
    },
    rentRateChart (dateArray, data) { // 当年租金收率缴
      let myChart = echarts.init(document.getElementById('rentRate'))
      let option = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            var relVal = params[0].name
            for (var i = 0, l = params.length; i < l; i++) {
              // relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + params[i].value + '%'
              relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + '%'
            }
            return relVal
          }
        },
        grid: {
          // containLabel: true
          top: '36px',
          left: '66px',
          right: '40px',
          bottom: '50px'
        },
        xAxis: [
          {
            type: 'category',
            name: '',
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
            name: '收缴率',
            type: 'bar',
            barWidth: '16',
            itemStyle: {
              normal: {
                barBorderRadius: [0, 0, 0, 0],
                color: function (params) {
                  if (params.value > 75 && params.value < 90) { // 大于75 小90 橙色
                    return new echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [
                        { offset: 0, color: '#FF001E' },
                        { offset: 1, color: '#EEB548' }
                      ]
                    )
                  } else if (params.value < 75) { // 红色
                    return new echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [
                        { offset: 0, color: '#f00f00' },
                        { offset: 1, color: '#FF001E' }
                      ]
                    )
                  } else {
                    return new echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [
                        { offset: 0, color: '#007FFF' },
                        { offset: 1, color: '#07F6F9' }
                      ]
                    )
                  }
                }
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
    getNowTime () {
      return getNowTime('time')
    },
    toggleTimer (index, type) {
      this.selectIndex = index
      this.dateType = type
      this.energyConsumptionAPI()
    },
    // 图表
    electricityConsumption (dateArray, orderCount) {
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
          data: ['电'],
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
          left: '45px',
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
            name: '电',
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
            data: orderCount
            // data: [100, 210, 130, 140, 350, 160, 170, 380, 190, 200, 210, 220, 330, 240, 150, 140, 350, 160, 170, 380, 190, 200, 210, 220, 330, 240, 150]
          }
        ]
      }
      myChart.setOption(option)
    },
    useWater (dateArray, orderCount) {
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
          left: '45px',
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
            name: '水',
            type: 'line',
            // stack: '总量',
            symbol: 'none',
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
    }
  }
}
</script>
<style lang="scss">
@import "../../style/config.scss";
.park-warp {
  .el-select {
    width: px2rem(260);
  }
  .el-select,
  .el-cascader {
    .el-input--small {
      font-size: px2rem(22);
      .el-input__inner {
        padding-right: 26;
        background-color: transparent;
        border: none;
        color: #e9f0fd;
      }
    }
    .el-cascader__label {
      color: #fff;
      span {
        color: #fff;
      }
    }
  }
  .el-cascader {
    .el-input--small {
      .el-input__inner {
        min-width: px2rem(700);
        /* min-width: px2rem(300); */
        font-size: px2rem(32) !important;
      }
    }
  }
  .view-header-cascader {
    .el-input--small .el-input__inner {
      min-width: px2rem(286);
      color: #66def9;
    }
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
}
.park-warp-cascader {
  background: #231e4a !important;
  border: 1px solid #aeaeff !important;
  .el-cascader-menu {
    background: #231e4a !important;
    /* border: 1px solid #AEAEFF!important; */
  }
  .el-cascader-menu__item.is-active {
    color: #fff !important;
  }
  .el-cascader-menu__item:focus:not(:active),
  .el-cascader-menu__item:hover {
    background-color: #264bb8 !important;
  }
  .el-cascader-menu__item {
    color: #b1a8d1;
  }
  .el-popper[x-placement^="bottom"] .popper__arrow {
    border-bottom-color: #aeaeff !important;
  }
  .el-popper[x-placement^="bottom"] .popper__arrow::after {
    border-bottom-color: #aeaeff !important;
  }
  .el-cascader-node:not(.is-disabled):focus,
  .el-cascader-node:not(.is-disabled):hover {
    background-color: #264bb8 !important;
    color: #fff !important;
    .el-cascader-node__label {
      color: #fff !important;
    }
  }
  .el-cascader-node__label {
    color: #b1a8d1;
  }
  .el-input--small {
    .el-input__inner {
      width: auto;
      font-size: px2rem(32) !important;
    }
  }
}
.park-warp-select {
  background: #231e4a !important;
  border: 1px solid #aeaeff !important;
  .el-select-dropdown__item.selected {
    color: #fff;
  }
  .el-select-dropdown__item.hover,
  .el-select-dropdown__item:hover {
    background-color: #264bb8;
  }
  .el-select-dropdown__item {
    color: #b1a8d1;
  }
}
</style>
<style lang="scss" scoped>
@import "../../style/config.scss";
@import "../../style/mixins.scss";
.park-warp {
  position: relative;
  // height: px2rem(1080 * 2);
  // background: url(../../assets/bg3.png) no-repeat;
  // background-size: 100% 100%;

  .color_green {
    color: #07ffa4 !important;
    height: px2rem(50);
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
    .centerunderline {
      /* width: calc(100% - 10); */
    }
    span {
      display: inline-block;
    }
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
  }

  .flex-end {
    align-self: flex-end;
  }

  .pw-container1 {
    display: flex;
    .pwl-top,
    .pwl-bottom {
      width: px2rem(1030);
      height: px2rem(520);
      margin: px2rem(100) 0 0 px2rem(90);
      // background: url(../../assets/divsBg.png) no-repeat;
      // background-size: 100% 100%;
      color: #e9f0fd;
      overflow: hidden;
    }
    .pwl-bottom {
      height: px2rem(610);
      margin-top: px2rem(40);
    }
    .economic-indicators {
      display: flex;
      flex-wrap: wrap;
      .ei-item {
        width: 33.3%;
        margin-top: px2rem(60);
        padding-left: px2rem(40);
        div {
          &:first-child {
            color: #fff;
            font-size: px2rem(28);
            margin-bottom: px2rem(30);
          }
          &:last-child {
            color: #fff;
            font-size: px2rem(38);
          }
        }
      }
    }
    .attract-investment {
      margin-top: px2rem(30);
      .ei-item {
        width: 30%;
      }
    }
    .pwc-center {
      width: px2rem(1500);
      height: px2rem(1170);
      margin: px2rem(100) 0 0 px2rem(40);
      background: url(../../assets/pwc-centerBG.png) no-repeat;
      background-size: 100% 100%;
      color: #e9f0fd;
      /* overflow: hidden; */
      .img-container {
        height: px2rem(1040);
        margin: px2rem(20) px2rem(10) px2rem(10) px2rem(10);
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    .pwc-right {
      position: relative;
      .bwctl-bg,
      .pwl-top {
        width: px2rem(1030);
        height: px2rem(520);
        margin-left: px2rem(40);
      }
      .pwl-bottom {
        width: px2rem(1030);
        height: px2rem(610);
        margin-left: px2rem(40);
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
              width: 20%;
            }
            &:nth-child(4) {
              width: 20%;
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
                justify-content: center;
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
  .bw-content3 {
    // margin-top: px2rem(48);
    display: flex;
    > div {
      &.item1 {
        width: px2rem(1030);
        height: px2rem(560);
        margin: px2rem(48) 0 0 px2rem(90);
        background: url(../../assets/divsBg.png) no-repeat;
        background-size: 100% 100%;
        color: #e9f0fd;
        overflow: hidden;
        .content {
          display: flex;
          flex-wrap: wrap;
          margin: px2rem(56) auto 0;
          width: 90%;
          justify-content: space-between;
          > div {
            width: px2rem(400);
            height: px2rem(150);
            border: px2rem(2) solid rgba(234, 236, 239, 0.3);
            border-radius: px2rem(10);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: px2rem(20);
            &:nth-child(1),
            &:nth-child(2) {
              margin-bottom: px2rem(60);
            }
            > div {
              &:nth-child(1) {
                > p {
                  font-size: px2rem(28);
                  color: #e9f0fd;
                }
                > span {
                  font-size: px2rem(38);
                  font-weight: 600;
                  color: #07ffa4;
                }
              }
              &:nth-child(2) {
                height: px2rem(120);
                line-height: px2rem(120);
                font-size: px2rem(44);
                font-weight: 600;
                color: #ffca2c;
              }
            }
          }
        }
      }
      &.item2 {
        width: px2rem(1500);
        height: px2rem(560);
        margin: px2rem(48) 0 0 px2rem(40);
        background: url(../../assets/pwc-centerBG.png) no-repeat;
        background-size: 100% 100%;
        color: #e9f0fd;
      }
      &.item3 {
        width: px2rem(1030);
        height: px2rem(560);
        margin: px2rem(48) 0 0 px2rem(40);
        background: url(../../assets/divsBg.png) no-repeat;
        background-size: 100% 100%;
        color: #e9f0fd;
        overflow: hidden;
      }
    }
  }
  .bw-content2 {
    display: flex;
    .bwc2-energy-consumption {
      width: px2rem(3649);
      height: px2rem(520);
      position: relative;
      margin: px2rem(70) 0 0 px2rem(90);
      background: url(../../assets/energy-consumption.png) no-repeat;
      background-size: 100% 100%;
      .bwcec-bg,
      .chartwrap {
        width: px2rem(3660);
        height: px2rem(520);
      }
      .ec-content {
        display: flex;
        .item1 {
          width: px2rem(1216);
          color: #e9f0fd;
          > div {
            margin: px2rem(70) 0 0 px2rem(40);
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
          .water-div {
            margin-top: px2rem(140);
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
          margin: 0 px2rem(3);
        }
        .item2 {
          width: px2rem(1216);
          height: px2rem(500);
          margin-top: px2rem(20);
        }
        .item3 {
          width: px2rem(1216);
          height: px2rem(500);
          margin-top: px2rem(20);
        }
        .item4 {
          width: px2rem(710);
          height: px2rem(500);
          margin-top: px2rem(20);
        }
        .item5 {
          width: px2rem(780);
          height: px2rem(500);
          margin-top: px2rem(20);
          position: relative;
          .i5title {
            position: absolute;
            color: #fff;
            font-size: px2rem(24);
            top: 0;
            left: px2rem(300);
          }
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
      width: px2rem(846);
      height: px2rem(520);
      position: relative;
      margin: px2rem(70) 0 0 px2rem(40);
      .bwcecc-bg,
      .chartwrap {
        width: px2rem(846);
        height: px2rem(520);
      }
    }
  }
  .bigScreenInfo {
    position: absolute;
    top: 0;
    width: 100%;
    height: 21.6rem;
    z-index: 1;
  }
  // 地图等级1
  .digitizationHQ {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: url('../../assets/bg.png') no-repeat;
    background-size: 100% 100%;
  }
  // 遮罩等级2
  .bigScreen-shadow-left {
    position: absolute;
    top: 0;
    width: 30%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(1, 6, 21, 1) 0%,
      rgba(0, 0, 0, 0)
    );
    z-index: 11;
  }
  .bigScreen-shadow-top {
    position: absolute;
    top: 0;
    width: 40%;
    left: 30%;
    height: 20%;
    // background: linear-gradient(to bottom,rgba(1, 6, 21, 0.8) ,rgba(0,0,0,0));
    z-index: 11;
  }
  .bigScreen-shadow-right {
    position: absolute;
    top: 0;
    width: 30%;
    right: 0;
    height: 100%;
    background: linear-gradient(
      to left,
      rgba(1, 6, 21, 1) 0%,
      rgba(0, 0, 0, 0)
    );
    z-index: 11;
  }
  .bigScreen-shadow-bottom {
    position: absolute;
    width: 40%;
    left: 30%;
    bottom: 0;
    height: 20%;
    // background: linear-gradient(to top,rgba(1, 6, 21, 0.8) ,rgba(0,0,0,0));
    z-index: 11;
  }
  // 内容等级3
  .view-header {
    width: 100%;
    padding: px2rem(52) 0;
    position: absolute;
    top: 0;
    z-index: 111;
    padding-top: px2rem(120);
    &-content {
      position: relative;
      display: flex;
      align-items: start;
      flex-direction: row;
      justify-content: left;
      width: 100%;
      &-left {
        width: 50%;
        height: px2rem(124);
        background-image: url("../../assets/new/head-left.png");
        background-size: 100% 100%;
      }
      &-right {
        width: 50%;
        height: px2rem(124);
        background-image: url("../../assets/new/head-right.png");
        background-size: 100% 100%;
        display: flex;
        align-items: start;
        flex-direction: row;
        justify-content: left;
        &-item {
          width: 46%;
        }
        &-right {
          width: 54%;
          display: flex;
          align-items: start;
          flex-direction: row;
          justify-content: left;
        }
        .view-header-cascader {
          width: 28%;
          margin: px2rem(44) 0;
          color: #66def9;
        }
        .view-header-itemChild {
          width: 72%;
          padding-right: 7%;
          text-align: right;
          font-size: px2rem(40);
          line-height: px2rem(148);
          letter-spacing: px2rem(4);
          color: #fff;
        }
      }
      &-flex-h3 {
        width: 35%;
        position: absolute;
        left: calc(100% - 67.5%);
        height: px2rem(124);
        text-align: left;
        &-iocn {
          background-image: url("../../assets/new/logo.png");
          background-size: 100% 100%;
          position: absolute;
          left: 0;
          top: px2rem(8);
          height: 78%;
          width: px2rem(92);
        }
        h3 {
          width: 100%;
          padding-left: px2rem(128);
          height: 100%;
          font-size: px2rem(80);
          background-image: -webkit-linear-gradient(
            bottom,
            #7899d2,
            #fefefe,
            #ffffff
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
      .bjAction{
        position: absolute;
        bottom: px2rem(-72);
        left: 36%;
        width: 24%;
        height: px2rem(176);
        background-image: url('../../assets/light.png');
        background-size: 100%;
      }
    }
    .returnBtn {
      position: absolute;
      left: 2%;
      top: 45%;
      display: block;
      width: px2rem(120);
      height: px2rem(120);
      background-image: url("../../assets/new/returnHome.png");
      background-size: 100% 100%;
    }
  }
  .view-content {
    position: relative;
    display: flex;
    align-items: start;
    flex-direction: row;
    justify-content: left;
    width: 100%;
    height: 21.6rem;
    overflow: hidden;
    &-left {
      width: px2rem(1076);
      position: relative;
      display: flex;
      align-items: start;
      flex-direction: column;
      justify-content: start;
      padding: 0 px2rem(80);
      padding-top: px2rem(140);
      padding-right: px2rem(40);
      height: 100%;
      position: absolute;
      top: px2rem(260);
      z-index: 111;
      &-top {
        width: 100%;
        height: px2rem(552);
        background: rgba(26, 47, 86, 0.3);
        padding-top: px2rem(40);
        margin-bottom: px2rem(20);
        position: relative;
        .left-top-title {
          width: 50%;
          padding-left: px2rem(88);
          background-image: url("../../assets/new/title.png");
          background-size: 100%;
          h3 {
            color: #66def9;
            font-size: px2rem(32);
            line-height: px2rem(60);
          }
        }
        .left-top-add {
          width: 100%;
          display: flex;
          justify-content: space-around;
          height: 100%;
          padding: px2rem(48) 0;
          .add-arr {
            width: 34%;
            height: px2rem(308);
            border-radius: px2rem(154);
            background: #111839;
            text-align: center;
            padding: px2rem(30);
            padding-left: px2rem(34);
            .add-arr-item {
              width: 100%;
              padding-left: 6%;
              padding-top: px2rem(40);
              display: flex;
              .iocn {
                width: px2rem(110);
                height: px2rem(80);
                margin-right: px2rem(32);
                background-image: url("../../assets/new/attractInvestment.png");
                background-size: 100% 100%;
              }
              .number {
                width: 100%;
                line-height: px2rem(48);
                .num {
                  color: #ffffff;
                  font-size: px2rem(48);
                  letter-spacing: px2rem(2.34);
                }
                .text {
                  color: #e9f0fd;
                  font-size: px2rem(24);
                }
              }
              .describe {
                width: 100%;
              }
            }
          }
          .chear {
            width: 34%;
            height: px2rem(308);
            border-radius: px2rem(154);
            background: #111839;
            text-align: center;
            padding: px2rem(30);
            padding-left: px2rem(34);
          }
        }
        .left-top-bottom {
          width: 100%;
          display: flex;
          justify-content: start;
          .top-bottom-item {
            width: 33%;
            padding-top: px2rem(14);
            display: flex;
            .iocn {
              width: px2rem(148);
              height: px2rem(80);
              margin-right: px2rem(28);
              margin-left: 8%;
              background: url("../../assets/new/attractInvestment.png")
                no-repeat;
              background-size: 100% 100%;
            }
            .number {
              width: px2rem(344);
              line-height: px2rem(48);
              .num {
                color: #ffffff;
                font-size: px2rem(48);
                letter-spacing: px2rem(2.34);
              }
              .text {
                color: #e9f0fd;
                font-size: px2rem(24);
              }
            }
            .describe {
              margin-left: px2rem(40);
            }
          }
        }
        .right_text{
          position: absolute;
          top: 14px;
          right: 14px;
          color: #fff;
        }
      }
      &-center {
        width: 100%;
        height: px2rem(500);
        background: rgba(26, 47, 86, 0.3);
        padding-top: px2rem(40);
        margin-bottom: px2rem(20);
        .left-center-title {
          width: 50%;
          padding-left: px2rem(88);
          background-image: url("../../assets/new/title.png");
          background-size: 100%;
          h3 {
            color: #66def9;
            font-size: px2rem(32) 16px;
            line-height: px2rem(60);
          }
        }
        .columnar {
          width: 100%;
          margin-top: px2rem(-32);
          height: 93%;
        }
      }
      &-bottom {
        width: 100%;
        height: px2rem(540);
        background: rgba(26, 47, 86, 0.3);
        padding-top: px2rem(40);
        .left-bottom-title {
          width: 50%;
          padding-left: px2rem(88);
          background-image: url("../../assets/new/title.png");
          background-size: 100%;
          h3 {
            color: #66def9;
            font-size: px2rem(32);
            line-height: px2rem(60);
          }
        }
        .left-bottom-table {
          width: 100%;
          padding: 0 px2rem(28);
          padding-top: px2rem(40);
          height: 86%;
          .TableScroll {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    &-center {
      width: 45.4%;
      height: px2rem(248);
      display: flex;
      justify-content: center;
      position: absolute;
      position: absolute;
      top: px2rem(336);
      left: calc(100% - 72.5%);
      z-index: 111;
      &-item {
        width: 16.5%;
        font-size: px2rem(28);
        margin-right: px2rem(10);
        text-align: center;
        h3 {
          width: 94%;
          line-height: px2rem(84);
          color: #ffff;
          font-size: px2rem(32);
          overflow: hidden;
          display: flex;
          justify-content: center;
          margin: 0 auto;
          .number-grow-warp {
            font-size: px2rem(72);
            width: 100%;
            span {
              width: 100%;
              overflow: hidden;
              display: block;
            }
          }
        }
        p {
          width: 100%;
          line-height: px2rem(48);
          font-size: px2rem(28);
          color: #d0d7d9;
        }
      }
      &-item:nth-child(1) {
        background-image: url("../../assets/new/building.png");
        background-size: 100% 100%;
      }
      &-item:nth-child(2) {
        background-image: url("../../assets/new/company.png");
        background-size: 100% 100%;
      }
      &-item:nth-child(3) {
        background-image: url("../../assets/new/totalArea.png");
        background-size: 100% 100%;
      }
      &-item:nth-child(4) {
        background-image: url("../../assets/new/occupancyRate.png");
        background-size: 100% 100%;
      }
      &-item:nth-child(5) {
        background-image: url("../../assets/new/revenue.png");
        background-size: 100% 100%;
      }
      &-item:nth-child(6) {
        background-image: url("../../assets/new/area.png");
        background-size: 100% 100%;
      }
    }
    &-right {
      width: px2rem(1076);
      height: 100%;
      position: relative;
      display: flex;
      align-items: start;
      flex-direction: column;
      justify-content: start;
      padding: 0 px2rem(80);
      padding-top: px2rem(140);
      padding-left: px2rem(40);
      position: absolute;
      right: 0;
      top: px2rem(260);
      z-index: 111;
      &-top {
        width: 100%;
        height: px2rem(552);
        background: rgba(26, 47, 86, 0.3);
        padding-top: px2rem(40);
        margin-bottom: px2rem(20);
        position: relative;
        .right-top-title {
          width: 50%;
          padding-left: px2rem(88);
          background-image: url("../../assets/new/title.png");
          background-size: 100%;
          h3 {
            color: #66def9;
            font-size: px2rem(32);
            line-height: px2rem(60);
          }
        }
        .right-top-content {
          width: 100%;
          position: relative;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-evenly;
          height: 88%;
          .right-top-content-item {
            width: 44%;
            background: linear-gradient(
              to right,
              rgba(1, 28, 46, 0.6),
              rgba(31, 77, 142, 0.6)
            );
            color: #fff;
            font-size: px2rem(30);
            padding: px2rem(10) px2rem(30);
            border: px2rem(2) transparent solid;
            border-image: linear-gradient(
                to left top,
                #498fe9,
                #04030a,
                #5783dc,
                #498fe9
              )
              14 1 22;
            margin-bottom: px2rem(24);
            height: px2rem(140);
            .item-text {
              width: 100%;
              line-height: px2rem(60);
              font-size: px2rem(26);
            }
            .item-number {
              width: 100%;
              color: #e06a66;
              font-size: px2rem(48);
              line-height: px2rem(44);
              text-shadow: 0px px2rem(3) rgb(16, 25, 80);
              font-weight: 600;
            }
          }
          .iocn-fled {
            width: px2rem(156);
            height: px2rem(156);
            top: px2rem(160);
            position: absolute;
            border-radius: px2rem(100);
            background: #060b1a;
            div {
              width: px2rem(128);
              height: px2rem(128);
              margin: 0 auto;
              background: url("../../assets/new/economics.png") no-repeat;
              background-size: 70% 70%;
              background-position: center center;
              margin-top: px2rem(12);
              border-radius: px2rem(100);
              border: px2rem(2) solid #498fe9;
            }
          }
        }
        .right_text{
          position: absolute;
          top: 14px;
          right: 14px;
          color: #fff;
        }
      }
      &-center {
        width: 100%;
        height: px2rem(500);
        background: rgba(26, 47, 86, 0.3);
        padding-top: px2rem(40);
        margin-bottom: px2rem(20);
        .right-center-title {
          width: 100%;
          display: flex;
          justify-content: space-between;
          h3 {
            width: 50%;
            color: #66def9;
            font-size: px2rem(32);
            line-height: px2rem(60);
            padding-left: px2rem(88);
            background-image: url("../../assets/new/title.png");
            background-size: 100%;
          }
          .dropdown {
            width: 32%;
            line-height: px2rem(36);
            text-align: right;
            span {
              color: #f3f8fc;
            }
          }
        }
        .columnar {
          width: 100%;
          height: 94%;
          padding-top: px2rem(60);
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
          .item{
            width: 50%;
            background: url('../../assets/new/center-bottom.png') no-repeat;
            background-position: center px2rem(72);
            background-size: 100%;
            h4{
              font-size: px2rem(120);
              color: #fff;
              padding-bottom: px2rem(40);
              text-align: center;
            }
            span{
              display: block;
              line-height: px2rem(120);
              color: #9ba5b5;
              font-size: px2rem(28);
              text-align: center;
            }
          }
        }
      }
      &-bottom {
        width: 100%;
        height: px2rem(540);
        background: rgba(26, 47, 86, 0.3);
        padding-top: px2rem(40);
        .right-bottom-title {
          width: 50%;
          padding-left: px2rem(88);
          background-image: url("../../assets/new/title.png");
          background-size: 100%;
          h3 {
            color: #66def9;
            font-size: 16px;
            line-height: px2rem(60);
          }
        }
        .right-bottom-table {
          width: 100%;
          padding: 0 px2rem(28);
          padding-top: px2rem(40);
          height: 86%;
          .TableScroll {
            width: 100%;
            height: 100%;
          }
        }
        .columnar {
          width: 100%;
          height: 94%;
          padding-top: px2rem(56);
        }
      }
    }
    // .left-animation{
    //   animation: leftAnimation leftAnimation 0.1s linear;
    //   -moz-animation: leftAnimation 0.1s linear; /* Firefox */
    //   -webkit-animation: leftAnimation 0.1s linear; /* Safari and Chrome */
    //   -o-animation: leftAnimation 0.1s linear; /* Opera */
    // }
    // .right-animation{
    //   animation: rightAnimation 0.1s linear;
    //   -moz-animation: rightAnimation 0.1s linear; /* Firefox */
    //   -webkit-animation: rightAnimation 0.1s linear; /* Safari and Chrome */
    //   -o-animation: rightAnimation 0.1s linear; /* Opera */
    // }
    // left
      @keyframes leftAnimation {
      0% {
        transform: matrix3d(0,0,1,0,0,1,0,0,0,0,1,0,-154,-56,0,1)
      }

      10% {
        transform: matrix3d(.1,0,1,0,0,1,0,0,0,0,1,0,-136,84,0,1)
      }

      20% {
        transform: matrix3d(.2,0,1,.001,0,1,0,0,0,0,1,0,-117,88,0,1)
      }

      30% {
        transform: matrix3d(.3,0,1,.001,0,1,0,0,0,0,1,0,-92,92,0,1)
      }

      40% {
        transform: matrix3d(.4,0,1,.001,0,1,0,0,0,0,1,0,-68,96,0,1)
      }

      50% {
        transform: matrix3d(.5,0,1,.001,0,1,0,0,0,0,1,0,-45,96,0,1)
      }

      60% {
        transform: matrix3d(.6,0,1,.001,0,1,0,0,0,0,1,0,-22,94,0,1)
      }

      70% {
        transform: matrix3d(.7,0,1,.001,0,1,0,0,0,0,1,0,0,94,0,1)
      }

      80% {
        transform: matrix3d(.8,0,1,.001,0,1,0,0,0,0,1,0,22,95,0,1)
      }

      90% {
        transform: matrix3d(.9,0,1,.001,0,1,0,0,0,0,1,0,46,95,0,1)
      }
    }

    @-moz-keyframes leftAnimation {
      0% {
        transform: matrix3d(0,0,1,0,0,1,0,0,0,0,1,0,-154,-56,0,1)
      }

      10% {
        transform: matrix3d(.1,0,1,0,0,1,0,0,0,0,1,0,-136,84,0,1)
      }

      20% {
        transform: matrix3d(.2,0,1,.001,0,1,0,0,0,0,1,0,-117,88,0,1)
      }

      30% {
        transform: matrix3d(.3,0,1,.001,0,1,0,0,0,0,1,0,-92,92,0,1)
      }

      40% {
        transform: matrix3d(.4,0,1,.001,0,1,0,0,0,0,1,0,-68,96,0,1)
      }

      50% {
        transform: matrix3d(.5,0,1,.001,0,1,0,0,0,0,1,0,-45,96,0,1)
      }

      60% {
        transform: matrix3d(.6,0,1,.001,0,1,0,0,0,0,1,0,-22,94,0,1)
      }

      70% {
        transform: matrix3d(.7,0,1,.001,0,1,0,0,0,0,1,0,0,94,0,1)
      }

      80% {
        transform: matrix3d(.8,0,1,.001,0,1,0,0,0,0,1,0,22,95,0,1)
      }

      90% {
        transform: matrix3d(.9,0,1,.001,0,1,0,0,0,0,1,0,46,95,0,1)
      }
    }

    @-webkit-keyframes leftAnimation {
      0% {
        transform: matrix3d(0,0,1,0,0,1,0,0,0,0,1,0,-154,-56,0,1)
      }

      10% {
        transform: matrix3d(.1,0,1,0,0,1,0,0,0,0,1,0,-136,84,0,1)
      }

      20% {
        transform: matrix3d(.2,0,1,.001,0,1,0,0,0,0,1,0,-117,88,0,1)
      }

      30% {
        transform: matrix3d(.3,0,1,.001,0,1,0,0,0,0,1,0,-92,92,0,1)
      }

      40% {
        transform: matrix3d(.4,0,1,.001,0,1,0,0,0,0,1,0,-68,96,0,1)
      }

      50% {
        transform: matrix3d(.5,0,1,.001,0,1,0,0,0,0,1,0,-45,96,0,1)
      }

      60% {
        transform: matrix3d(.6,0,1,.001,0,1,0,0,0,0,1,0,-22,94,0,1)
      }

      70% {
        transform: matrix3d(.7,0,1,.001,0,1,0,0,0,0,1,0,0,94,0,1)
      }

      80% {
        transform: matrix3d(.8,0,1,.001,0,1,0,0,0,0,1,0,22,95,0,1)
      }

      90% {
        transform: matrix3d(.9,0,1,.001,0,1,0,0,0,0,1,0,46,95,0,1)
      }
    }
    
    @keyframes rightAnimation {
      0%{transform: matrix3d(-.211,0,1,-.001,0,1,0,0,0,0,1,0,208,102,0,1)
    }

    10% {
      transform: matrix3d(.1,0,1,-.001,0,1,0,0,0,0,1,0,154,102,0,1)
    }

    20% {
      transform: matrix3d(.2,0,1,-.001,0,1,0,0,0,0,1,0,132,96,0,1)
    }

    30% {
      transform: matrix3d(.3,0,1,-.001,0,1,0,0,0,0,1,0,108,96,0,1)
    }

    40% {
      transform: matrix3d(.4,0,1,-.001,0,1,0,0,0,0,1,0,84,96,0,1)
    }

    50% {
      transform: matrix3d(.5,0,1,-.001,0,1,0,0,0,0,1,0,62,96,0,1)
    }

    60% {
      transform: matrix3d(.6,0,1,-.001,0,1,0,0,0,0,1,0,40,96,0,1)
    }

    70% {
      transform: matrix3d(.7,0,1,-.001,0,1,0,0,0,0,1,0,16,96,0,1)
    }

    80% {
      transform: matrix3d(.8,0,1,-.001,0,1,0,0,0,0,1,0,-6,96,0,1)
    }

    90% {
      transform: matrix3d(.9,0,1,-.001,0,1,0,0,0,0,1,0,-28,96,0,1)
    }}

    @-moz-keyframes rightAnimation {
      0% {
        transform: matrix3d(-.211,0,1,-.001,0,1,0,0,0,0,1,0,208,102,0,1)
      }

      10% {
        transform: matrix3d(.1,0,1,-.001,0,1,0,0,0,0,1,0,154,102,0,1)
      }

      20% {
        transform: matrix3d(.2,0,1,-.001,0,1,0,0,0,0,1,0,132,96,0,1)
      }

      30% {
        transform: matrix3d(.3,0,1,-.001,0,1,0,0,0,0,1,0,108,96,0,1)
      }

      40% {
        transform: matrix3d(.4,0,1,-.001,0,1,0,0,0,0,1,0,84,96,0,1)
      }

      50% {
        transform: matrix3d(.5,0,1,-.001,0,1,0,0,0,0,1,0,62,96,0,1)
      }

      60% {
        transform: matrix3d(.6,0,1,-.001,0,1,0,0,0,0,1,0,40,96,0,1)
      }

      70% {
        transform: matrix3d(.7,0,1,-.001,0,1,0,0,0,0,1,0,16,96,0,1)
      }

      80% {
        transform: matrix3d(.8,0,1,-.001,0,1,0,0,0,0,1,0,-6,96,0,1)
      }

      90% {
        transform: matrix3d(.9,0,1,-.001,0,1,0,0,0,0,1,0,-28,96,0,1)
      }
    }

    @-webkit-keyframes rightAnimation {
      0% {
        transform: matrix3d(-.211,0,1,-.001,0,1,0,0,0,0,1,0,208,102,0,1)
      }

      10% {
        transform: matrix3d(.1,0,1,-.001,0,1,0,0,0,0,1,0,154,102,0,1)
      }

      20% {
        transform: matrix3d(.2,0,1,-.001,0,1,0,0,0,0,1,0,132,96,0,1)
      }

      30% {
        transform: matrix3d(.3,0,1,-.001,0,1,0,0,0,0,1,0,108,96,0,1)
      }

      40% {
        transform: matrix3d(.4,0,1,-.001,0,1,0,0,0,0,1,0,84,96,0,1)
      }

      50% {
        transform: matrix3d(.5,0,1,-.001,0,1,0,0,0,0,1,0,62,96,0,1)
      }

      60% {
        transform: matrix3d(.6,0,1,-.001,0,1,0,0,0,0,1,0,40,96,0,1)
      }

      70% {
        transform: matrix3d(.7,0,1,-.001,0,1,0,0,0,0,1,0,16,96,0,1)
      }

      80% {
        transform: matrix3d(.8,0,1,-.001,0,1,0,0,0,0,1,0,-6,96,0,1)
      }

      90% {
        transform: matrix3d(.9,0,1,-.001,0,1,0,0,0,0,1,0,-28,96,0,1)
      }
    }

    @-o-keyframes leftAnimation {
      0% {
        transform: matrix3d(-.211,0,1,-.001,0,1,0,0,0,0,1,0,208,102,0,1)
      }

      10% {
        transform: matrix3d(.1,0,1,-.001,0,1,0,0,0,0,1,0,154,102,0,1)
      }

      20% {
        transform: matrix3d(.2,0,1,-.001,0,1,0,0,0,0,1,0,132,96,0,1)
      }

      30% {
        transform: matrix3d(.3,0,1,-.001,0,1,0,0,0,0,1,0,108,96,0,1)
      }

      40% {
        transform: matrix3d(.4,0,1,-.001,0,1,0,0,0,0,1,0,84,96,0,1)
      }

      50% {
        transform: matrix3d(.5,0,1,-.001,0,1,0,0,0,0,1,0,62,96,0,1)
      }

      60% {
        transform: matrix3d(.6,0,1,-.001,0,1,0,0,0,0,1,0,40,96,0,1)
      }

      70% {
        transform: matrix3d(.7,0,1,-.001,0,1,0,0,0,0,1,0,16,96,0,1)
      }

      80% {
        transform: matrix3d(.8,0,1,-.001,0,1,0,0,0,0,1,0,-6,96,0,1)
      }

      90% {
        transform: matrix3d(.9,0,1,-.001,0,1,0,0,0,0,1,0,-28,96,0,1)
      }
    }
  }
}
</style>
<style>
.el-dropdown-menu {
  background-color: rgba(77,163,198,0.4) !important;
  border: 1px solid #4e89d2 !important;
  color: #9ba5b5 !important;
}
.el-dropdown-menu__item{
  color: #fff !important;
}
.el-popper .popper__arrow::after {
  border-bottom-color: transparent !important;
}
.el-popper .popper__arrow {
  border-bottom-color: transparent !important;
}
.el-dropdown-menu__item:not(.is-disabled):hover {
  background-color: #3770bb !important;
  color: #fff !important;
}
</style>
