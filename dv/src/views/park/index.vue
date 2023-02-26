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
                  <el-cascader size="small"
                               v-model="value"
                               ref="refSubCat"
                               :options="options"
                               :props="{value: 'id', label: 'name', checkStrictly: true}"
                               popper-class="park-warp-cascader"
                               @change="handleChange"></el-cascader>
                </div>
                <div class="view-header-itemChild">
                  <span id="time">{{date}}</span>
                </div>
              </div>

            </div>
            <div class="view-header-content-flex-h3">
              <div class="view-header-content-flex-h3-iocn"></div>
              <h3>{{ titleName }}数字化管理平台 - 楼宇经济</h3>
            </div>
          </div>
          <router-link to="/switchScreen"
                       class="returnBtn" />
        </div>
        <div ref="left-animation"
             class="view-content-left">
          <div class="view-content-left-top">
            <div class="left-top-title">
              <h3>招商引资</h3>
            </div>
            <div class="left-top-add">
              <div class="add-arr">
                <div class="add-arr-item">
                  <div class="iocn"></div>
                  <p class="number">
                    <span class="num">
                      <NumberGrow v-if="NumberFlag && !setIntervalTime['domesticEnterprise']"
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
                        <div class="number-grow-warp">
                          {{bigScreenInfo.investment.domesticEnterprise.toString().replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, '$1,')}}
                        </div>
                      </template>
                    </span>
                    <span class="text">新增内资企业</span>
                  </p>
                </div>
                <div class="add-arr-item">
                  <div class="iocn"></div>
                  <p class="number">
                    <span class="num">
                      <NumberGrow v-if="NumberFlag && !setIntervalTime['overseasEnterprise']"
                                  :overKey="'overseasEnterprise'"
                                  @overHtml="overHtml"
                                  :time="NumberTime"
                                  :value="bigScreenInfo.investment.overseasEnterprise"></NumberGrow>
                      <template v-else-if="!NumberFlag && !setIntervalTime['overseasEnterprise']">
                        <div class="number-grow-warp">
                          {{ Numberitems }}
                        </div>
                      </template>
                      <template v-if="setIntervalTime['overseasEnterprise']">
                        <div class="number-grow-warp">
                          {{ bigScreenInfo.investment.overseasEnterprise.toString().replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, '$1,') }}
                        </div>
                      </template>
                    </span>
                    <span class="text">新增外资企业</span>
                  </p>
                </div>
              </div>
              <div class="chear">
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
                     style="color: #fff;font-size: 0.22rem">新增企业纳税率</p>
                </vue-ellipse-progress>
              </div>
            </div>
            <div class="left-top-bottom">
              <div class="top-bottom-item"
                   style="width: 36%;">
                <div class="iocn"></div>
                <p class="number">
                  <span class="num">
                    <NumberGrow v-if="NumberFlag"
                                :overKey="'numberEnterprise'"
                                :time="NumberTime"
                                :value="bigScreenInfo.investment.numberEnterprise"></NumberGrow>
                    <template v-else-if="!NumberFlag">
                      <div class="number-grow-warp">
                        {{ Numberitems }}
                      </div>
                    </template>
                    <template v-if="setIntervalTime['numberEnterprise']">
                      <div class="number-grow-warp">
                        {{ bigScreenInfo.investment.numberEnterprise.toString().replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, '$1,') }}
                      </div>
                    </template>
                  </span>
                  <span class="text">税务新开户企业数</span>
                </p>
              </div>
              <div class="top-bottom-item"
                   style="width: 29%;">
                <p class="number describe">
                  <span class="num">
                    <NumberGrow v-if="NumberFlag && !setIntervalTime['contractualForeign']"
                                :overKey="'contractualForeign'"
                                @overHtml="overHtml"
                                :time="NumberTime"
                                :value="bigScreenInfo.investment.contractualForeign"></NumberGrow>
                    <template v-else-if="!NumberFlag && !setIntervalTime['contractualForeign']">
                      <div class="number-grow-warp">
                        {{ Numberitems }}
                      </div>
                    </template>
                    <template v-if="setIntervalTime['contractualForeign']">
                      <div class="number-grow-warp">
                        {{ bigScreenInfo.investment.contractualForeign }}
                      </div>
                    </template>
                  </span>
                  <span class="text">新增合同外资(亿美元)</span>
                </p>
              </div>
              <div class="top-bottom-item"
                   style="width: 34%;">
                <p class="number describe">
                  <span class="num">
                    <NumberGrow v-if="NumberFlag && !setIntervalTime['disbursementForeign']"
                                :overKey="'disbursementForeign'"
                                @overHtml="overHtml"
                                :time="NumberTime"
                                :value="bigScreenInfo.investment.disbursementForeign"></NumberGrow>
                    <template v-else-if="!NumberFlag && !setIntervalTime['disbursementForeign']">
                      <div class="number-grow-warp">
                        {{ Numberitems }}
                      </div>
                    </template>
                    <template v-if="setIntervalTime['disbursementForeign']">
                      <div class="number-grow-warp">
                        {{ bigScreenInfo.investment.disbursementForeign }}
                      </div>
                    </template>
                  </span>
                  <span class="text">新增实际到位外资(亿美元)</span>
                </p>
              </div>
            </div>
            <div class="right_text">2022年，6月</div>
          </div>
          <div class="view-content-left-center">
            <div class="left-center-title">
              <h3>企业荣誉</h3>
            </div>
            <div class="columnar"
                 id="technologicalDevelopment"
                 ref="technologicalDevelopment"></div>
          </div>
          <div class="view-content-left-bottom">
            <div class="left-bottom-title">
              <h3>概况</h3>
            </div>
            <div class="left-bottom-table">
              <TableScroll class="TableScroll"
                           :config="TableScroll.config"
                           :parame="TableScroll.parame"
                           :tableData="tableData" />
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
                  {{ item.value.toString().replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, '$1,') }}
                </div>
              </template>
            </h3>
            <h3 v-else>
              <NumberGrow v-if="NumberFlag && !setIntervalTime[item.type]"
                          :overKey="item.type"
                          @overHtml="overHtml"
                          :time="NumberTime"
                          :value="item.value?item.value:100"></NumberGrow>
              <template v-else-if="!NumberFlag && !setIntervalTime[item.type]">
                <div class="number-grow-warp">
                  {{ Numberitems }}
                </div>
              </template>
              <template v-if="setIntervalTime[item.type]">
                <div class="number-grow-warp">
                  {{ (item.value?item.value:100).toString().replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, '$1,') }}
                </div>
              </template>
            </h3>
            <p v-if="item.type === '1'">楼宇数量</p>
            <p v-if="item.type === '2'">企业数</p>
            <p v-if="item.type === '3'">总面积(万㎡)</p>
            <p v-if="item.type === '4'">实际出租率(%)</p>
            <p v-if="item.type === '5'">当年税收总额(亿元)</p>
            <p v-if="item.type === '6'">单位面积产税(元/㎡)</p>
          </div>
        </div>
        <div ref="right-animation"
             class="view-content-right">
          <div class="view-content-right-top">
            <div class="right-top-title">
              <h3>经济效益</h3>
            </div>
            <div class="right-top-content">
              <div class="right-top-content-item">
                <p class="item-text">社会消费品零售额(亿元)</p>
                <p class="item-number"
                   style="color: #E06A66">
                  <NumberGrow v-if="NumberFlag && !setIntervalTime['socialConsumption']"
                              :overKey="'socialConsumption'"
                              @overHtml="overHtml"
                              :time="NumberTime"
                              :value="bigScreenInfo.economicBenefit.socialConsumption"></NumberGrow>
                  <template v-else-if="!NumberFlag && !setIntervalTime['socialConsumption']">
                    <div class="number-grow-warp">
                      {{ Numberitems }}
                    </div>
                  </template>
                  <template v-if="setIntervalTime['socialConsumption']">
                    <div class="number-grow-warp">
                      {{ bigScreenInfo.economicBenefit.socialConsumption.toString().replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, '$1,') }}
                    </div>
                  </template>
                </p>
              </div>
              <div class="right-top-content-item"
                   style="text-align: right;">
                <p class="item-text">商品销售总额(亿元)</p>
                <p class="item-number"
                   style="color: #E06A66">
                  <NumberGrow v-if="NumberFlag && !setIntervalTime['merchandiseSales']"
                              :overKey="'merchandiseSales'"
                              @overHtml="overHtml"
                              :time="NumberTime"
                              :value="bigScreenInfo.economicBenefit.merchandiseSales"></NumberGrow>
                  <template v-else-if="!NumberFlag && !setIntervalTime['merchandiseSales']">
                    <div class="number-grow-warp">
                      {{ Numberitems }}
                    </div>
                  </template>
                  <template v-if="setIntervalTime['merchandiseSales']">
                    <div class="number-grow-warp">
                      {{ bigScreenInfo.economicBenefit.merchandiseSales.toString().replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, '$1,') }}
                    </div>
                  </template>
                </p>
              </div>
              <div class="right-top-content-item">
                <p class="item-text">规上工业总产值(亿元)</p>
                <p class="item-number"
                   style="color: #E06A66">
                  <NumberGrow v-if="NumberFlag && !setIntervalTime['industrialEnterprises']"
                              :overKey="'industrialEnterprises'"
                              @overHtml="overHtml"
                              :time="NumberTime"
                              :value="bigScreenInfo.economicBenefit.industrialEnterprises"></NumberGrow>
                  <template v-else-if="!NumberFlag && !setIntervalTime['industrialEnterprises']">
                    <div class="number-grow-warp">
                      {{ Numberitems }}
                    </div>
                  </template>
                  <template v-if="setIntervalTime['industrialEnterprises']">
                    <div class="number-grow-warp">
                      {{ bigScreenInfo.economicBenefit.industrialEnterprises.toString().replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, '$1,') }}
                    </div>
                  </template>
                </p>
              </div>
              <div class="right-top-content-item"
                   style="text-align: right;">
                <p class="item-text">营利性服务业收入(亿元)</p>
                <p class="item-number"
                   style="color: #E06A66">
                  <NumberGrow v-if="NumberFlag && !setIntervalTime['profitService']"
                              :overKey="'profitService'"
                              @overHtml="overHtml"
                              :time="NumberTime"
                              :value="bigScreenInfo.economicBenefit.profitService"></NumberGrow>
                  <template v-else-if="!NumberFlag && !setIntervalTime['profitService']">
                    <div class="number-grow-warp">
                      {{ Numberitems }}
                    </div>
                  </template>
                  <template v-if="setIntervalTime['profitService']">
                    <div class="number-grow-warp">
                      {{ bigScreenInfo.economicBenefit.profitService.toString().replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, '$1,') }}
                    </div>
                  </template>
                </p>
              </div>
              <div class="iocn-fled">
                <div></div>
              </div>
            </div>
            <div class="right_text">2022年，6月</div>
          </div>
          <div class="view-content-right-center">
            <div class="right-center-title">
              <h3>运营</h3>
              <el-dropdown trigger="click"
                           class="dropdown"
                           @command="handleCommand">
                <span class="el-dropdown-link">
                  {{ dropdownModel }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(item, index) in collectionProjectList"
                                    :key="index"
                                    :command="item.value">
                    {{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="columnar"
                 id="operationLine"
                 ref="operationLine"></div>
          </div>
          <div class="view-content-right-bottom">
            <div class="right-bottom-title">
              <h3>当年租金收缴率</h3>
            </div>
            <div class="columnar"
                 id="collectionRate"
                 ref="collectionRate"></div>
          </div>
        </div>
        <div class="digitizationHQ"
             v-if="digitizationHQFlag">
          <digitizationHQ ref="digitizationHQ"
                          @afterRender="afterRender"
                          :coordsPATHData="coordsPATHData" />
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
// 折线图
require('echarts/lib/chart/line')
// custom
require('echarts/lib/chart/custom')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
export default {
  name: 'park',
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
      collectionProjectList: [
        { value: 1, label: '历年入驻企业数' },
        { value: 2, label: '历年面积产税' },
        { value: 3, label: '历年税收总额' }
      ],
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
          domesticEnterprise: 0, // 新增内资企业
          progress: 0, // 新增企业纳税率
          overseasEnterprise: 0, // 新增外资企业
          numberEnterprise: 0, // 税务新开户企业数
          disbursementForeign: 0, // 新增实际到位外资
          contractualForeign: 0 // 新增合同外资
        },
        economicBenefit: {
          socialConsumption: 0, // 社会消费品零售额
          merchandiseSales: 0, // 商品销售总额
          industrialEnterprises: 0, // 规上工业总产值
          profitService: 0 // 营利性服务业收入
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
        { value: 316, type: '1' },
        { value: 7433, type: '2' },
        { value: 511, type: '3' },
        { value: 81.8, type: '4' },
        { value: '10.70', type: '5' },
        { value: 1374, type: '6' }
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
    //   debugger
    //   this.handleChange(New)
    // }
  },
  created () {
    // this.titleName = this.$route.query.name
    // this.projectConfig(this.$route.query.id, this.$route.query.dataType)
    this.getTree()
  },
  mounted () {
    var _this = this // 声明一个变量指向vue实例this,保证作用域一致
    this.timer = setInterval(function () {
      _this.date = _this.getNowTime()// 修改数据date
    }, 1000)
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
    getBigScreenInfo (request, rType) {
      // 3D动画
      // this.animation3DShow()
      //
      this.getInvestment(request, rType)
      //
      this.getHistogramData()
      //
      this.getGradientLineChartData()
      //
      this.getPillars3DChartData()
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
    // 数据渲染
    getInvestment (request, rType) {
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
        domesticEnterprise: 0, // 新增内资企业
        progress: 0, // 新增企业纳税率
        overseasEnterprise: 0, // 新增外资企业
        numberEnterprise: 0, // 税务新开户企业数
        disbursementForeign: 0, // 新增实际到位外资
        contractualForeign: 0 // 新增合同外资
      }
      this.bigScreenInfo.economicBenefit = {
        socialConsumption: 0, // 社会消费品零售额
        merchandiseSales: 0, // 商品销售总额
        industrialEnterprises: 0, // 规上工业总产值
        profitService: 0 // 营利性服务业收入
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
      let time = 300
      if (rType) {
        this.NumberTime = 0.5
        time = 300
      } else {
        this.NumberTime = 0.3
      }
      let vm = this
      this.$nextTick(() => {
        setTimeout(() => {
          vm.bigScreenInfo.investment = {
            domesticEnterprise: 186, // 新增内资企业
            progress: 22.6, // 新增企业纳税率
            overseasEnterprise: 15, // 新增外资企业
            numberEnterprise: 51, // 税务新开户企业数
            disbursementForeign: '0.1012', // 新增实际到位外资
            contractualForeign: 1.7 // 新增合同外资
          }
          vm.bigScreenInfo.economicBenefit = {
            socialConsumption: 345, // 社会消费品零售额
            merchandiseSales: 646, // 商品销售总额
            industrialEnterprises: 61, // 规上工业总产值
            profitService: 245 // 营利性服务业收入
          }
          vm.centerData = [
            { value: 316, type: '1' },
            { value: 7433, type: '2' },
            { value: 526, type: '3' },
            { value: 81.8, type: '4' },
            { value: '29.63', type: '5' },
            { value: 1374, type: '6' }
          ]
          vm.NumberFlag = true
          vm.digitizationHQFlag = true
          setTimeout(() => {
            if (rType) {
              vm.$nextTick(() => {
                vm.$refs['digitizationHQ'].initMap(request.data)
              })
            } else {
              vm.$nextTick(() => {
                vm.$refs['digitizationHQ'].switchUpdateCoords(request.data)
              })
            }
          }, time)
        }, 100)
      })
    },
    handleCommand (row) {
      let crData = []
      let dateArray = [
        '2017',
        '2018',
        '2019',
        '2020',
        '2021'
      ]
      let yAxisName
      if (row === 1) {
        crData = [
          688582,
          768533,
          668618,
          633494,
          692600
        ]
        yAxisName = ''
      } else if (row === 2) {
        crData = [
          688582,
          768533,
          668618,
          633494,
          692600
        ]
        yAxisName = ''
      } else if (row === 3) {
        crData = [
          688582,
          768533,
          668618,
          633494,
          692600
        ]
        yAxisName = '万元'
      } else if (!row) {
        yAxisName = '万元'
      }
      this.dropdownModel = this.collectionProjectList[row - 1].label
      this.gradientLineChart(dateArray, crData, 'operationLine', this.dropdownModel, yAxisName)
    },
    // 科技发展
    getHistogramData () {
      // 接口数据
      this.$nextTick(() => {
        this.histogramChart(
          [
            { value: 6, name: '上市公司' },
            { value: 22, name: '总部型企业' },
            { value: 6, name: '文创载体' },
            { value: 9, name: '专精特新' },
            { value: 11, name: '科技小巨人、研发机构' },
            { value: 96, name: '高新技术企业' },
            { value: 186, name: '商会企业' }
          ],
          [ '上市公司', '总部型企业', '文创载体', '专精特新', '科技小巨人、研发机构', '高新技术企业', '商会企业' ],
          [ '#A60AE7', '#FE6085', '#FDB87E', '#26EEA0', '#1AF5FF', '#0E94FE', '#1554D7' ],
          'technologicalDevelopment',
          '',
        )
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
    histogramChart (resData, legend, color, DomName, text, subtext, animation = 1000) {
      let myChart = echarts.init(document.getElementById(`${DomName}`))
      myChart.clear()
      let itemGap = 10
      if (legend && legend.length > 7) {
        itemGap = 15
      }
      let data = resData
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: function (name) {
            var total = 0
            var target
            // for (var i = 0, l = data.length; i < l; i++) {
            //   total += data[i].value
            //   if (data[i].name === name.name) {
            //     target = data[i].value
            //   }
            // }
            data.forEach(v => {
              total += v.value
              if (v.name === name.name) {
                target = v.value
              }
            })
            let percentage = isNaN(target / total) ? 0 : (target / total)
            if (text === '税收总金额') {
              return `
                  ${name.name}<br/>
                  税收金额：${name.value}万元<br/>
                  占比：${(percentage * 100).toFixed(2)}%
              `
            } else {
              return `
                  ${name.name}<br/>
                  占比：${(percentage * 100).toFixed(2)}%
              `
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
          top: '0%',
          itemGap: itemGap,
          data: legend,
          textStyle: {
            color: '#fff'
          },
          formatter: function (name) {
            // var total = 0
            var target
            for (var i = 0, l = data.length; i < l; i++) {
              // total += data[i].value
              if (data[i].name === name) {
                target = data[i].value
              }
            }
            let Space = ''
            if (name.length < 10) {
              let le = (10 - name.length) * 2 - 1
              if (target.toString().length > 2) {
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
              Space += '  '
            }
            // let percentage = isNaN(target / total) ? 0 : (target / total)
            if (name === '科技小巨人、研发机构') {
              return name + Space + target
            } else {
              return name + Space + target
            }
          }
        },
        series: [
          {
            type: 'pie',
            radius: ['60%', '80%'],
            center: ['25%', '40%'],
            avoidLabelOverlap: false,
            label: {
              show: false
            },
            hoverAnimation: false,
            labelLine: {
              normal: {
                show: false
              }
            },
            animationDuration: animation,
            animationEasing: 'cubicInOut',
            data: data
          }
        ]
      }
      myChart.setOption(option)
    },
    // histogramChart (dateArray, seriesData, DomName, Note, YName, animation = 1000) {
    //   // 基于准备好的dom，初始化echarts实例
    //   let myChart = echarts.init(document.getElementById(`${DomName}`))
    //   myChart.clear()
    //   let option = {
    //     tooltip: {
    //       trigger: 'axis'
    //     },
    //     legend: {
    //       data: Note,
    //       right: '8%',
    //       itemWidth: 15,
    //       itemHeight: 15,
    //       selectedMode: false,
    //       textStyle: {
    //         color: '#ffffff',
    //         fontSize: 10
    //       }
    //     },
    //     grid: {
    //       // containLabel: true
    //       top: '36px',
    //       left: '66px',
    //       right: '40px',
    //       bottom: '50px'
    //     },
    //     xAxis: [
    //       {
    //         type: 'category',
    //         name: '',
    //         data: dateArray,
    //         axisPointer: {
    //           type: 'shadow',
    //           snap: false
    //         },
    //         axisTick: {
    //           show: false,
    //           alignWithLabel: false
    //         },
    //         axisLabel: {
    //           // rotate: 40,
    //           textStyle: {
    //             color: '#F3F8FC',
    //             fontSize: 11
    //           }
    //         },
    //         axisLine: {
    //           lineStyle: {
    //             color: '#2A4065'
    //           }
    //         }
    //       }
    //     ],
    //     yAxis: [
    //       {
    //         type: 'value',
    //         name: '',
    //         // min: 0,
    //         // max: visitmax,
    //         // minInterval: 1,
    //         axisLabel: {
    //           textStyle: {
    //             color: '#9BA5B5',
    //             fontSize: 12
    //           }
    //         },
    //         axisLine: {
    //           lineStyle: {
    //             color: 'rgba(0,0,0,0)'
    //           }
    //         },
    //         splitLine: {
    //           show: true,
    //           lineStyle: {
    //             color: ['#2A4065']
    //           }
    //         }
    //       }
    //     ],
    //     series: [
    //       {
    //         name: YName[0],
    //         type: 'bar',
    //         stack: 'Ad',
    //         barWidth: 24,
    //         itemStyle: {
    //           color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    //             { offset: 0, color: '#4284da' },
    //             { offset: 0.6, color: '#4284da' },
    //             { offset: 1, color: '#0f213f' }
    //           ])
    //         },
    //         emphasis: {
    //           focus: 'series'
    //         },
    //         animationDuration: animation,
    //         animationEasing: 'cubicInOut',
    //         data: seriesData[0]
    //       },
    //       {
    //         name: YName[1],
    //         type: 'bar',
    //         stack: 'Ad',
    //         barWidth: 24,
    //         itemStyle: {
    //           color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    //             { offset: 0, color: '#e06a66' },
    //             { offset: 0.6, color: '#e06a66' },
    //             { offset: 1, color: '#3c3c5e' }
    //           ])
    //         },
    //         emphasis: {
    //           focus: 'series'
    //         },
    //         animationDuration: animation,
    //         animationEasing: 'cubicInOut',
    //         data: seriesData[1]
    //       }
    //     ]
    //   }

    //   myChart.setOption(option)
    // },
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
    afterRender () {
      // 渲染完成调用
      // this.$nextTick(() => {
      //   this.getBigScreenInfo()
      // })
    },
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
      if (this.coordsPATHData.length) {
        this.digitizationHQFlag = true
        let vm = this
        console.log(JSON.stringify(this.coordsPATHData))
        this.$nextTick(() => {
          vm.$refs['digitizationHQ'].switchUpdateCoords(this.coordsPATHData)
        })
      } else {
        // 数据为空处理地图渲染
      }
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
          this.options.push({
            id: 1,
            name: '虹桥镇',
            children: res.data
          })
          this.value = [this.options[0].id]
          this.handleChange(this.value)
        }
      })
    },
    handleChange (value) {
      // console.log(value)
      if (value.length === 1) { // 只选第一级
        service.http.get(`/cms/api/project-managements-scope`).then(res => {
          if (res.status === 200) {
            // 渲染完成调用
            this.$nextTick(() => {
              this.getBigScreenInfo(res, true)
            })
          }
        })
        let id = value[0]
        let curr = this.options.filter((item, index) => item.id === id)
        let ids = curr[0].children.map((item, index) => {
          return item.id
        })
        ids = ids.toString()
        service.http.get(`/cms/api/getOrganiz/infoByids/all?ids=${ids}`).then(res => {
          if (res.status === 200) {
            this.tableData = res.data
            // 渲染完成调用
            // this.$nextTick(() => {
            //   this.getBigScreenInfo(res)
            // })
          }
        })
      } else if (value.length > 1) {
        let ids = value[1]
        service.http.get(`/cms/api/getOrganiz/infoByids/all?ids=${ids}`).then(res => {
          if (res.status === 200) {
            this.tableData = res.data
            // 渲染完成调用
            // this.$nextTick(() => {
            //   this.getBigScreenInfo(res)
            // })
          }
        })
        service.http.get(`/cms/api/project-managements-scope?organizeId=${ids}`).then(res => {
          if (res.status === 200) {
            // 渲染完成调用
            this.$nextTick(() => {
              this.getBigScreenInfo(res, false)
            })
          }
        })
      }
      // this.getRentdata()
      // this.getTechnology()
      // this.parkRun()
      // const id = value[value.length - 1]
      // const dataIdType = this.$refs['refSubCat'].getCheckedNodes()[0].data.dataIdType
      // this.pictureUrl = this.$refs['refSubCat'].getCheckedNodes()[0].data.pictureUrl
      // this.projectManagementId = this.$refs['refSubCat'].getCheckedNodes()[0].data.businessId
      // this.parkRunDataIdType = dataIdType
      // switch (dataIdType) {
      //   case 'COMPANY':
      //     this.type = 1
      //     break
      //   case 'PROJECTTYPE':
      //     this.type = 2
      //     break
      //   case 'PROJECT':
      //     this.type = 3
      //     break
      //   case 'BUILDING':
      //     this.type = 4
      //     break
      //   default:
      //     this.type = 1
      //     break
      // }
      // this.parkNewInfo(id, dataIdType)
      // this.attract(id, dataIdType)
      // this.parkRun(id, dataIdType, this.kpiName)
      // this.surveyPlanning(id, dataIdType)
      // this.energyConsumptionAPI()
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
      return getNowTime()
    },
    toggleTimer (index, type) {
      this.selectIndex = index
      this.dateType = type
      this.energyConsumptionAPI()
    },
    // 园区现状
    parkNewInfo (id, level) {
      service.http.get(`/cms/api/parkNewInfo`, { level: level, id: id }).then(res => {
        if (res.status === 200) {
          this.parkNewInfoData = res.data
        }
      })
    },
    // 园区招商
    attract (id, level) {
      service.http.get(`/cms/api/attract`, { level: level, id: id }).then(res => {
        if (res.status === 200) {
          this.attractData = res.data
        }
      })
    },
    // 园区概况
    surveyPlanning (id, level) {
      service.http.get(`/cms/api/surveyPlanning`, { level: level, id: id }).then(res => {
        if (res.status === 200) {
          this.tableData = res.data
          if (res.data.length && (this.type === 3 || this.type === 4)) {
            this.haveCycle = res.data[0].haveCycle
          } else {
            this.haveCycle = true
          }
        }
      })
    },
    // 项目Cascader
    projectConfig (id, largeConfigType) {
      service.http.get(`/rts/api/initConfigBylargeId/${id}?largeConfigType=${largeConfigType}`).then(res => {
        if (res.status === 200) {
          // this.options = [res.data.enterpriseCascadeDto]
          // eslint-disable-next-line no-useless-escape
          const jsondata = JSON.parse(JSON.stringify(res.data.enterpriseCascadeDto).replace(/\"enterpriseCascadeDtos"\:\[]/g, '"no":0'))
          this.options = [jsondata]
          this.titleName = res.data.enterpriseCascadeDto.name
          this.value = res.data.enterpriseCascadeDto.businessId
          this.parkNewInfo(res.data.enterpriseCascadeDto.businessId, res.data.enterpriseCascadeDto.dataIdType)
          this.attract(res.data.enterpriseCascadeDto.businessId, res.data.enterpriseCascadeDto.dataIdType)
          this.parkRun(res.data.enterpriseCascadeDto.businessId, res.data.enterpriseCascadeDto.dataIdType)
          this.surveyPlanning(res.data.enterpriseCascadeDto.businessId, res.data.enterpriseCascadeDto.dataIdType)
          this.projectManagementId = res.data.enterpriseCascadeDto.businessId
          this.parkRunDataIdType = res.data.enterpriseCascadeDto.dataIdType
          this.pictureUrl = res.data.enterpriseCascadeDto.pictureUrl
          this.energyConsumptionAPI()
          // ===========================
          this.getRentdata()
          this.getTechnology()
        }
      })
    },
    // 能耗用量
    energyConsumptionAPI () {
      this.dateType = this.dateType || 'Month'
      this.type = this.type || 1
      const reportUse = 'WORK'
      if (this.parkRunDataIdType === 'COMPANY') this.projectManagementId = ''
      service.http.get(`/cms/api/statistics/energyConsumption/project?projectManagementId=${this.projectManagementId}&reportUse=${reportUse}&dateType=${this.dateType}&type=${this.type}&carryNumber=1`).then(res => {
        if (res.status === 200) {
          const resData = res.data
          this.electric = (resData.electric).toString().split('')
          this.gas = (resData.gas).toString().split('')
          this.water = (resData.water).toString().split('')

          const dateArray = []
          const electric = []
          const gas = []
          const water = []
          resData.data.forEach(ele => {
            dateArray.push(ele.x)
            electric.push(ele.electric)
            water.push(ele.water)
            gas.push(ele.gas)
          })
          this.electricityConsumption(dateArray, electric)
          this.useWater(dateArray, water)
        }
      })
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
  height: px2rem(1080 * 2);
  background: url(../../assets/bg3.png) no-repeat;
  background-size: 100% 100%;

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
      background: url(../../assets/divsBg.png) no-repeat;
      background-size: 100% 100%;
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
          justify-content: start;
          .add-arr {
            width: 51.5%;
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
          padding-top: px2rem(36);
          height: 94%;
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
          padding-top: 8.5%;
          position: relative;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-evenly;
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
  background-color: rgba(16, 39, 75, 0.2) !important;
  border: 1px solid #4e89d2 !important;
  color: #9ba5b5 !important;
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
