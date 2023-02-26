<template>
  <div class="tenant-details devicesDetails">
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="tenant-details details-content"
           slot="drawer">
        <!-- <span class="backBtn" @click="backFn"><i class="el-icon-back"></i></span> -->
        <div class="main-content">
          <div class="leftPart">
            <div class="imgContant">
              <p class="title">基本信息</p>
              <div class="carousel-itemImg clearfix">
                <div class="carousel float-left">
                  <img v-if="!detailsData.imageUrls"
                       :src="berthImg"
                       alt=""
                       style="width: 100%;height: 100%;">
                  <el-carousel trigger="click"
                               height="240px"
                               ref="carousel"
                               v-else>
                    <el-carousel-item v-for="item in detailsData.imageUrls"
                                      :key="item">
                      <img :src="item"
                           alt=""
                           style="width:100%;height:100%">
                    </el-carousel-item>
                  </el-carousel>
                </div>
                <div class="itemImg float-left listBox"
                     id="listBox">
                  <div class="cf">
                    <!-- <div v-if="(!detailsData.imageUrls || detailsData.imageUrls&&detailsData.imageUrls.length < 5) && !readonly" class="itemImg-div">
                    <aliUpload class="aliUpload deviceDetails"
                          :upLoadText="upLoadText_cost"
                          :fileType="fileType_cost"
                          :iconShow="false"
                          @setAnnex="setAnnex"
                        /> 
                        <i class="iconfont icon-add" style="top: 24%;left: 43%;width: 0; height: 0;"></i>
                  </div> -->
                    <div v-for="(item,index) in detailsData.imageUrls"
                         :key="index"
                         class="itemImg-div">
                      <img :src="item"
                           @click="setActiveItem(index)">
                      <!-- <i class="iconfont icon-jinakangbaoicons18" @click="deleteImg(index)" v-if="!readonly"></i> -->
                    </div>
                  </div>
                </div>
                <span id="prev"
                      class="btn prev"
                      @click="prevClick"
                      v-if="detailsData.imageUrls&&detailsData.imageUrls.length >= 3"><i class="el-icon-arrow-right"></i></span>
                <span id="next"
                      class="btn next"
                      @click="nextClick"
                      v-if="detailsData.imageUrls&&detailsData.imageUrls.length >= 3"><i class="el-icon-arrow-left"></i></span>
              </div>
            </div>
            <div class="tabContent">
              <div class="menuTab">
                <span :class="{'active':menuTab===1}"
                      @click="menuTabChange(1)">基本信息</span>
                <span :class="{'active':menuTab===2}"
                      @click="menuTabChange(2)">维保&巡检信息</span>
                <span :class="{'active':menuTab===3}"
                      @click="menuTabChange(3)">其他信息</span>
              </div>
              <div class="content"
                   v-if="menuTab===1"
                   style="min-height: 140px;">
                <div class="itemContent">
                  <div class="item">
                    <p>设备大类<i class="required">*</i></p>
                    <span>{{detailsData.equirementType.parent.name}}</span>
                  </div>
                  <div class="item">
                    <p>设备小类<i class="required">*</i></p>
                    <span>{{detailsData.equirementType.name}}</span>
                  </div>
                  <div class="item"
                       v-if="detailsData.equirementType.parent.id===25">
                    <p>能耗类型<i class="required">*</i></p>
                    <span>{{formatenergyType(detailsData.energyType)}}</span>
                  </div>
                  <div class="item"
                       v-if="detailsData.energyType==='METER'">
                    <p>仪表类型<i class="required">*</i></p>
                    <span>{{formatinstrumentType(detailsData.instrumentType)}}</span>
                  </div>
                </div>
              </div>
              <div class="content"
                   v-if="menuTab===1">
                <!-- <p class="title">基本信息</p> -->
                <div class="itemContent">
                  <div class="item">
                    <p>项目简称<i class="required">*</i></p>
                    <span>{{detailsData.projectManagement.referred}}</span>
                  </div>
                  <div class="item">
                    <p>楼宇名称<i class="required">*</i></p>
                    <span>{{detailsData.building.buildingName}}</span>
                  </div>
                  <div class="item"
                       v-if="detailsData.instrumentType==='ORDINARY_TABLE' && detailsData.energyType==='METER'">
                    <p>关联商户<i class="required">*</i></p>
                    <span>{{detailsData.tenant.teantName}}</span>
                  </div>
                  <div class="item">
                    <p>设备编号<i class="required">*</i></p>
                    <span>{{detailsData.code}}</span>
                  </div>
                  <div class="item">
                    <p>设备名称<i class="required">*</i></p>
                    <span>{{detailsData.name}}</span>
                  </div>
                  <div class="item">
                    <p>责任人<i class="required">*</i></p>
                    <span>{{detailsData.personLiable}}</span>
                  </div>
                  <div class="item">
                    <p>责任人手机号<i class="required">*</i></p>
                    <span>{{detailsData.personLiableTelephone}}</span>
                  </div>
                  <div class="item">
                    <p>当前状态<i class="required">*</i></p>
                    <span>{{detailsData.useStatus==='USING'?'在用':'停用'}}</span>
                  </div>
                  <div class="item">
                    <p>品牌</p>
                    <span>{{detailsData.brand}}</span>
                  </div>
                  <div class="item">
                    <p>制造厂商</p>
                    <span>{{detailsData.manufacturer}}</span>
                  </div>
                  <div class="item">
                    <p>产地</p>
                    <span>{{detailsData.produced==='IMPORTED'?'进口':'国产'}}</span>
                  </div>
                  <div class="item">
                    <p>供应商</p>
                    <span>{{detailsData.supplier}}</span>
                  </div>
                  <div class="item">
                    <p>出厂日期</p>
                    <span>{{detailsData.productionDate}}</span>
                  </div>
                  <div class="item">
                    <p>年检日期</p>
                    <span>{{detailsData.annualInspectionDate}}</span>
                  </div>
                  <div class="item">
                    <p>交付日期</p>
                    <span>{{detailsData.deliveryDate}}</span>
                  </div>
                  <div class="item">
                    <p>始用日期</p>
                    <span>{{detailsData.useDate}}</span>
                  </div>
                  <div class="item">
                    <p>质保结束日期</p>
                    <span>{{detailsData.warrantyEndDate}}</span>
                  </div>
                  <div class="item">
                    <p>安装日期</p>
                    <span>{{detailsData.installDate}}</span>
                  </div>
                  <div class="item">
                    <p>安装位置<i class="required">*</i></p>
                    <span>{{detailsData.installPosition}}</span>
                  </div>
                  <div class="item">
                    <p>备注</p>
                    <span>{{detailsData.remake}}</span>
                  </div>
                </div>
              </div>
              <div class="content"
                   v-if="menuTab===2">
                <!-- <p class="title">维保信息</p> -->
                <div class="itemContent">
                  <div class="item">
                    <p>是否需要维保<i class="required">*</i></p>
                    <span>{{detailsData.onMaintenance?'是':'否'}}</span>
                  </div>
                  <div class="item">
                    <p>维保周期<i class="required">*</i></p>
                    <span>{{formatMaintenancePeriod(detailsData.maintenancePeriod)}}</span>
                  </div>
                  <div class="item">
                    <p>维保单位</p>
                    <span>{{detailsData.maintenanceUnit}}</span>
                  </div>
                  <div class="item">
                    <p>维保联系人</p>
                    <span>{{detailsData.maintenanceContacts}}</span>
                  </div>
                  <div class="item">
                    <p>维保手机号</p>
                    <span>{{detailsData.maintenanceTelephone}}</span>
                  </div>
                  <div class="item">
                    <p>维保单位分类字段</p>
                    <span>{{formatMaintenanceType(detailsData.maintenanceType)}}</span>
                  </div>
                  <div class="item">
                    <p>外包类型</p>
                    <span>{{formatoutsourceType(detailsData.outsourceType)}}</span>
                  </div>
                  <div class="item">
                    <p>维保合同开始时间</p>
                    <span>{{detailsData.maintenanceStartDate}}</span>
                  </div>
                  <div class="item">
                    <p>维保合同结束时间</p>
                    <span>{{detailsData.maintenanceEndDate}}</span>
                  </div>
                </div>
              </div>
              <div class="content"
                   v-if="menuTab===2">
                <!-- <p class="title">巡检信息</p> -->
                <div class="itemContent">
                  <div class="item">
                    <p>是否需要巡检<i class="required">*</i></p>
                    <span>{{detailsData.onMaintain?'是':'否'}}</span>
                  </div>
                  <div class="item">
                    <p>巡检周期（天）<i class="required">*</i></p>
                    <span>{{detailsData.maintainPeriodDay}}</span>
                  </div>
                  <div class="item">
                    <p>首次巡检时间</p>
                    <span>{{detailsData.firstMaintainDate}}</span>
                  </div>
                  <div class="item">
                    <p>是否抄表<i class="required">*</i></p>
                    <span>{{detailsData.onMeterReading?'是':'否'}}</span>
                  </div>
                </div>
              </div>
              <div class="content"
                   v-if="menuTab===3">
                <!-- <p class="title">其他信息</p> -->
                <div class="itemContent">
                  <div class="item">
                    <p>设备注册代码号</p>
                    <span>{{detailsData.equirementRegisterCode}}</span>
                  </div>
                  <div class="item">
                    <p>出厂编号</p>
                    <span>{{detailsData.productionCode}}</span>
                  </div>
                  <div class="item">
                    <p>规格型号</p>
                    <span>{{detailsData.specificationModel}}</span>
                  </div>
                  <div class="item">
                    <p>主要技术参数</p>
                    <span>{{detailsData.technicalParameter}}</span>
                  </div>
                  <div class="item">
                    <p>额定电压</p>
                    <span>{{detailsData.ratedVoltage}}</span>
                  </div>
                  <div class="item">
                    <p>额定电流</p>
                    <span>{{detailsData.ratedCurrent}}</span>
                  </div>
                  <div class="item">
                    <p>点位数（消防总点位数）</p>
                    <span>{{detailsData.locationNumber}}</span>
                  </div>
                  <div class="item">
                    <p>系统数（消防分几个系统</p>
                    <span>{{detailsData.systemNumber}}</span>
                  </div>
                  <div class="item">
                    <p>频率</p>
                    <span>{{detailsData.frequency}}</span>
                  </div>
                  <div class="item">
                    <p>总功率</p>
                    <span>{{detailsData.totalPower}}</span>
                  </div>
                  <div class="item">
                    <p>梯速</p>
                    <span>{{detailsData.ladderSpeed}}</span>
                  </div>
                  <div class="item">
                    <p>载重</p>
                    <span>{{detailsData.carrying}}</span>
                  </div>
                  <div class="item">
                    <p>站（电梯的停靠站数）</p>
                    <span>{{detailsData.station}}</span>
                  </div>
                  <div class="item">
                    <p>门（电梯开门数）</p>
                    <span>{{detailsData.door}}</span>
                  </div>
                  <div class="item">
                    <p>层（电梯的楼层数）</p>
                    <span>{{detailsData.floor}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="rightPart">
            <div class="rightTab"
                 v-if="detailsData.equirementType.parent.id===25 || detailsData.equirementType.parent.id===2">
              <span :class="{active:rightPartShow===1}"
                    @click="changerightPartShow(1)">报修维保信息</span>
              <span :class="{active:rightPartShow===2}"
                    @click="changerightPartShow(2)"
                    v-if="detailsData.energyType==='METER'">能耗数据</span>
              <span :class="{active:rightPartShow===3}"
                    @click="changerightPartShow(3)"
                    v-if="detailsData.equirementType.parent.id===2">检测记录</span>
            </div>
            <div class="table1"
                 v-if="rightPartShow===1">
              <p class="title">报修信息</p>
              <div class="table">
                <el-table :data="table1Data"
                          style="width: 100%"
                          ref="multipleTable">
                  <el-table-column prop="repairFormCode"
                                   label="报修编号"
                                   align="center"> </el-table-column>
                  <el-table-column prop="title"
                                   label="问题简述"
                                   align="center"> </el-table-column>
                  <el-table-column label="报修单状态"
                                   align="center"
                                   :formatter="formatRepairStatus"> </el-table-column>
                  <el-table-column label="操作"
                                   align="center">
                    <template slot-scope="scope">
                      <el-button class="el-button--primary editbtn"
                                 size="mini"
                                 @click="handleEdit1(scope.$index, scope.row)">查看</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="ctc-foot">
                <el-col :span="24">
                  <span class="flex">
                    <el-pagination v-if="total > 0"
                                   background
                                   layout="prev, pager, next"
                                   :page-size=15
                                   :total="total"
                                   :current-page="currentPage"
                                   @current-change="current_change">
                    </el-pagination>
                  </span>
                </el-col>
              </div>
            </div>
            <div class="table2"
                 v-if="rightPartShow===1">
              <p class="title">维保记录</p>
              <div class="table">
                <el-table :data="table2Data"
                          style="width: 100%"
                          ref="multipleTable">
                  <el-table-column prop="repairRecordCode"
                                   label="维保编号"
                                   align="center"> </el-table-column>
                  <el-table-column prop="repairDate"
                                   label="维保日期"
                                   align="center"> </el-table-column>
                  <el-table-column label="维保方式"
                                   align="center"
                                   :formatter="formatmaintenanceClassify"> </el-table-column>
                  <el-table-column label="维保结果"
                                   align="center"
                                   :formatter="formatRepairStatus1"></el-table-column>
                  <el-table-column label="操作"
                                   align="center">
                    <template slot-scope="scope">
                      <el-button class="el-button--primary editbtn"
                                 size="mini"
                                 @click="handleEdit2(scope.$index, scope.row)">查看</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="ctc-foot">
                <el-col :span="24">
                  <span class="flex">
                    <el-pagination v-if="total1 > 0"
                                   background
                                   layout="prev, pager, next"
                                   :page-size=15
                                   :total="total1"
                                   :current-page="currentPage1"
                                   @current-change="current_change1">
                    </el-pagination>
                  </span>
                </el-col>
              </div>
            </div>
            <div class="eChart"
                 v-if="rightPartShow===2">
              <p class="title">曲线图</p>
              <div class="seachDiv">
                <el-date-picker v-model="startDate"
                                type="month"
                                :editable="false"
                                :clearable="false"
                                style="width:180px"
                                value-format="yyyy-MM-dd"
                                :picker-options="pickerBeginDateBefore"
                                placeholder="起始月份">
                </el-date-picker>
                <span> - </span>
                <el-date-picker v-model="endDate"
                                type="month"
                                :editable="false"
                                style="width:180px"
                                :clearable="false"
                                value-format="yyyy-MM-dd"
                                :picker-options="pickerBeginDateAfter"
                                placeholder="结束月份">
                </el-date-picker>
                <span class="query-btn"
                      @click="chartDetails">查询</span>
              </div>
              <div id="myChart"
                   style="width:100%;height:500px"
                   v-if="rightPartShow===2"></div>
            </div>
            <div class="historyTable"
                 v-if="rightPartShow===2">
              <p class="title">历史数据</p>
              <div class="seachDiv">
                <el-date-picker v-model="startDate1"
                                type="month"
                                :editable="false"
                                :clearable="false"
                                style="width:180px"
                                value-format="yyyy-MM-dd"
                                placeholder="起始月份">
                </el-date-picker>
                <span> - </span>
                <el-date-picker v-model="endDate1"
                                type="month"
                                :editable="false"
                                :clearable="false"
                                style="width:180px"
                                value-format="yyyy-MM-dd"
                                placeholder="结束月份">
                </el-date-picker>
                <span class="query-btn"
                      @click="searchHistoryTable">查询</span>
              </div>
              <div class="table3">
                <el-table :data="table3Data"
                          style="width: 100%"
                          ref="multipleTable">
                  <el-table-column prop="equirement.code"
                                   label="设备编号"
                                   align="center"> </el-table-column>
                  <el-table-column prop="equirement.name"
                                   label="设备名称"
                                   align="center"> </el-table-column>
                  <el-table-column label="时间"
                                   align="center"
                                   :formatter="formatconsumerTime"> </el-table-column>
                  <el-table-column label="用量"
                                   align="center"
                                   :formatter="formatconsumption"></el-table-column>
                </el-table>
              </div>
              <div class="ctc-foot">
                <el-col :span="24">
                  <span class="flex">
                    <el-pagination v-if="total2 > 0"
                                   background
                                   layout="prev, pager, next"
                                   :page-size=pgSize2
                                   :total="total2"
                                   :current-page="currentPage2"
                                   @current-change="current_change2">
                    </el-pagination>
                  </span>
                </el-col>
              </div>
            </div>
            <div class="cheackRecord"
                 v-if="rightPartShow===3">
              <p class="title">历史检测记录</p>
              <div class="seachDiv">
                <el-select v-model="cheackRes"
                           clearable
                           placeholder="检测结果"
                           style="width:140px;">
                  <el-option label="正常"
                             value="NORMAL"></el-option>
                  <el-option label="异常"
                             value="ERROR"></el-option>
                </el-select>
                <el-date-picker v-model="startDate2"
                                type="date"
                                :editable="false"
                                :clearable="false"
                                style="width:140px;"
                                value-format="yyyy-MM-dd"
                                placeholder="起始月份">
                </el-date-picker>
                <span> - </span>
                <el-date-picker v-model="endDate2"
                                type="date"
                                :editable="false"
                                :clearable="false"
                                style="width:140px"
                                value-format="yyyy-MM-dd"
                                placeholder="结束月份">
                </el-date-picker>
                <span class="query-btn"
                      @click="searcCheackRecord">查询</span>
              </div>

              <div class="table3">
                <el-table :data="table4Data"
                          style="width: 100%"
                          ref="multipleTable">
                  <el-table-column type="expand">
                    <template slot-scope="props">
                      <span style="padding-left:20px">备注：{{props.row.comment}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="checkDate"
                                   label="日期"
                                   align="center"> </el-table-column>
                  <el-table-column prop="checkTypeValue"
                                   label="检测类型"
                                   align="center"> </el-table-column>
                  <el-table-column prop="checkStatusValue"
                                   label="检测结果"
                                   align="center">
                    <template slot-scope="props">
                      <span class="normal"
                            :class="{'abnormal' : props.row.checkStatusValue !== '正常'}">{{props.row.checkStatusValue}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作"
                                   align="center"
                                   v-if="hasAuthority('03050105')">
                    <template slot-scope="scope">
                      <el-button class="el-button--primary"
                                 size="mini"
                                 @click="handleEdit3(scope.$index, scope.row)">查看</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="ctc-foot">
                <el-col :span="24">
                  <span class="flex">
                    <el-pagination v-if="total3 > 0"
                                   background
                                   layout="prev, pager, next"
                                   :page-size=pgSize3
                                   :total="total3"
                                   :current-page="currentPage3"
                                   @current-change="current_change3">
                    </el-pagination>
                  </span>
                </el-col>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer"
           style="margin-top:20px;">
        <el-button @click="onHide"
                   class="close-button">关闭</el-button>
        <!-- <el-button type="primary"  class="defaultbtn dialog-confirmBtn" @click="bindFun">确 定</el-button> -->
      </div>
    </drawer>
  </div>
</template>
<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import * as JSOG from 'jsog'
export default {
  components: {
    Drawer
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    detailsData: { // 设备详情
      type: Object,
      default: {}
    }
  },
  watch: {
    detailsdrawershow: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          context.http.get(`/cms/api/equirements/${this.detailsData.id}/repair-records`, {
            page: (this.currentPage1 - 1),
            size: this.pgSize1          }).then(res => { // 根据设备id 查维保记录列表
            if (res) {
              this.table2Data = res.data
              this.total1 = Number(res.headers['x-total-count'])
            }
          })
          context.http.get('/cms/api/repair-forms',
            {              equirementId: this.detailsData.id,
              page: (this.currentPage - 1),
              size: this.pgSize            }).then(res => { // 根据设备id 查报修信息列表
              if (res) {
                this.table1Data = res.data
                this.total = Number(res.headers['x-total-count'])
              }
            })
          this.dateInit()
        }
      },
      immediate: true
    }
  },
  created () {

  },
  mounted () {
  },
  data () {
    return {
      cheackRes: '',
      startDate: '',
      endDate: '',
      startDate1: '',
      endDate1: '',
      startDate2: '',
      endDate2: '',
      myChart: null,
      rightPartShow: 1,
      berthImg: require('../../../../assets/berth-default.png'),
      table1Data: [],
      table2Data: [],
      table3Data: [],
      table4Data: [],
      menuTab: 1,
      drawerTitle: '设备详情',
      currentPage: 1,
      total: 1,
      pgSize: 15,
      currentPage1: 1,
      total1: 1,
      pgSize1: 15,
      currentPage2: 1,
      total2: 1,
      pgSize2: 15,
      currentPage3: 1,
      total3: 1,
      pgSize3: 15,
      index: 0,
      len2: 0,
      pickerBeginDateBefore: {
        disabledDate: time => {
          let endDateVal = this.endDate
          if (endDateVal) {
            let temp = new Date(endDateVal).getTime() - 365 * 24 * 60 * 60 * 1000
            return time.getTime() < new Date(temp).getTime()
          }
        }
      },
      pickerBeginDateAfter: {
        disabledDate: time => {
          let beginDateVal = this.startDate
          if (beginDateVal) {
            let temp = new Date(beginDateVal).getTime() + 364 * 24 * 60 * 60 * 1000
            return time.getTime() > new Date(temp).getTime()
          }
        }
      }
    }
  },
  computed: {

  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    searchHistoryTable () {
      this.currentPage2 = 1
      this.tableData2Details()
    },
    searcCheackRecord () {
      this.currentPage3 = 1
      this.getCheackRecord()
    },
    dateInit () {
      let now = new Date()
      let next = new Date()
      this.startDate = now.getFullYear() + '-01-01'
      this.startDate1 = now.getFullYear() + '-01-01'
      this.endDate = this.getCurrentMonthLastDay()
      this.endDate1 = this.getCurrentMonthLastDay()
    },
    getCurrentMonthLastDay () {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      var day = new Date(year, month, 0)
      return year + '-' + month + '-' + day.getDate()
    },
    formatinstrumentType (n) {
      switch (n) {
        case 'ORDINARY_TABLE':
          return '普通表'
        case 'PUBLIC_TABLE':
          return '公共表'
        case 'SUMMARY_TABLE':
          return '总表'
      }
    },
    formatenergyType (n) {
      switch (n) {
        case 'METER':
          return '仪表'
        case 'SWITCH':
          return '开关'
      }
    },
    drawLine (dateArray, useLevel) {
      this.myChart = this.$echarts.init(document.getElementById('myChart'))
      this.myChart.clear()
      let option = {
        xAxis: {
          axisLabel: {
            // interval: 0
          },
          axisTick: {
            alignWithLabel: true
          },
          type: 'category',
          data: dateArray
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: useLevel,
          type: 'line',
          areaStyle: {},
          smooth: true
        }]
      }
      this.myChart.setOption(option)
    },
    formatconsumption (row, column) {
      if (row.equirement.equirementType.name === '电') {
        return row.consumption + 'kw.h'
      } else {
        return row.consumption + 'm³'
      }
    },
    formatconsumerTime (row, column) {
      return row.consumerTime.substring(0, 7)
    },
    chartDetails () { // 详情图标
      if (!this.startDate || !this.endDate) {
        this.$message.error('请输入时间区间')
        return
      }
      context.http.get(`cms/api/energyData/diagram`, { equirementId: this.detailsData.id, from: this.startDate, to: this.endDate }).then(res => {
        let data = JSOG.decode(res.data)
        let dateArray = [] // 时间
        let useLevel = [] // 用量
        data.forEach(ele => {
          dateArray.push((ele.consumerTime).substring(0, 7))
          useLevel.push(ele.consumption)
        })
        if (dateArray.length === 0) {
          dateArray = ['2019.01', '2019.02', '2019.03', '2019.04', '2019.05', '2019.06', '2019.07', '2019.08', '2019.09', '2019.10', '2019.11', '2019.12']
        }
        setTimeout(() => {
          this.drawLine(dateArray, useLevel)
        }, 200)
      })
    },
    tableData2Details () { // 详情历史数据
      if (!this.startDate1 || !this.endDate1) {
        this.$message.error('请输入时间区间')
        return
      }
      context.http.get(`cms/api/energyData/equirementId`, {
        equirementId: this.detailsData.id,
        from: this.startDate1,
        to: this.endDate1,
        page: (this.currentPage2 - 1),
        sort: 'consumerTime,desc',
        size: this.pgSize2
      }).then(res => {
        this.table3Data = JSOG.decode(res.data)
        this.total2 = Number(res.headers['x-total-count'])
      })
    },
    getEnergyData () { // 请求能耗数据
      context.http.get(`cms/api/energyData/equirementId`, {
        equirementId: this.detailsData.id,
        from: this.startDate,
        to: this.endDate,
        sort: 'consumerTime,desc',
        page: (this.currentPage2 - 1),
        size: this.pgSize2
      }).then(res => {
        this.table3Data = JSOG.decode(res.data)
        this.total2 = Number(res.headers['x-total-count'])
        context.http.get(`cms/api/energyData/diagram`, { equirementId: this.detailsData.id, from: this.startDate, to: this.endDate }).then(result => {
          let data = result.data
          let dateArray = [] // 时间
          let useLevel = [] // 用量
          data.forEach(ele => {
            dateArray.push((ele.consumerTime).substring(0, 7))
            useLevel.push(ele.consumption)
          })
          if (dateArray.length === 0) {
            dateArray = ['2019.01', '2019.02', '2019.03', '2019.04', '2019.05', '2019.06', '2019.07', '2019.08', '2019.09', '2019.10', '2019.11', '2019.12']
          }
          setTimeout(() => {
            this.drawLine(dateArray, useLevel)
          }, 200)
        })
      }).catch(error => {
        console.info(error)
      })
    },
    getCheackRecord () { // 检测记录
      context.http.get('cms/api/fcReportsDetails?sort=fireControlReport.checkDate,desc&sort=createdDate,desc',
        {          equipmentId: this.detailsData.id,
          checkStatus: this.cheackRes,
          startDate: this.startDate2,
          endDate: this.endDate2,
          page: (this.currentPage3 - 1),
          size: this.pgSize3
        }).then(res => {
          this.table4Data = res.data
          this.total3 = Number(res.headers['x-total-count'])
        }).catch(error => {
          console.info(error)
        })
    },
    changerightPartShow (n) { // 能耗数据tab切换
      this.rightPartShow = n
      if (n === 2) {
        this.$nextTick(function () {
          this.getEnergyData()
        })
      } else if (n === 3) {
        this.getCheackRecord()
      } else {
        if (this.myChart) {
          this.myChart.dispose()
        }
      }
    },
    deleteImg (index) {
      this.detailsData.imageUrls.splice(index, 1)
    },
    G (s) {
      return document.getElementById(s)
    },
    getStyle (obj, attr) {
      if (obj.currentStyle) {
        return obj.currentStyle[attr]
      } else {
        return getComputedStyle(obj, false)[attr]
      }
    },
    Change () {
      var oList = this.G('listBox')
      var oPrev = this.G('prev')
      var oNext = this.G('next')
      var oListLi = oList.getElementsByClassName('itemImg-div')
      var len2 = oListLi.length
      var oListUl = document.getElementsByClassName('cf')[0]
      var w2 = oListLi[0].offsetHeight
      oListUl.style.height = w2 * len2 + 'px'
      var index = this.index

      var num = 3
      // var num2 = Math.ceil(3 / 2)
      // if (index + num2 >= len2) {
      //   $(oListUl).animate({top: 0})
      //   index = 0
      // } else if (index < len2) {
      //   $(oListUl).animate({top: -(index) * w2 - index * 10})
      // }
      if (index === 0) {
        $(oListUl).animate({ top: 0 })
      } else {
        $(oListUl).animate({ top: -(index) * w2 - index * 10 })
      }
      this.index = index
      this.len2 = len2
    },
    prevClick () {
      var oList = this.G('listBox')
      var oListLi = oList.getElementsByClassName('itemImg-div')
      var len2 = oListLi.length
      if (this.index === 0) {
        return
      }
      this.index--
      // this.index = this.index === -1 ? len2 - 1 : this.index
      this.Change()
    },
    nextClick () {
      var oList = this.G('listBox')
      var oListLi = oList.getElementsByClassName('itemImg-div')
      var len2 = oListLi.length
      if (this.index === len2 - 3) {
        return
      }
      this.index++
      // this.index = this.index === len2 ? 0 : this.index
      this.Change()
    },
    formatRepairStatus (row, column) {
      switch (row.repairStatus) {
        case 'REFERED':
          return '待处理'
        case 'WAIT':
          return '处理中'
        case 'OVER':
          return '已处理'
      }
    },
    formatRepairStatus1 (row, column) {
      switch (row.repairStatus) {
        case 'COMPLETE':
          return '维保完成'
        case 'NO':
          return '维保未完成'
      }
    },
    formatmaintenanceClassify (row, column) {
      if (row.maintenanceClassify === 'REPAIR') {
        return '维修'
      } else if (row.maintenanceClassify === 'MAINTAIN') {
        return '保养'
      } else {
        return '-'
      }
    },
    handleEdit1 (index, row) {
      this.$emit('showRepairDetails_forms', row.id)
    },
    handleEdit2 (index, row) {
      this.$emit('showRepairDetails', row.id)
    },
    handleEdit3 (index, row) {
      this.$parent.firecontrolDetails(row.reportId)
    },
    current_change2 (currentPage) { // 切换页码
      this.currentPage2 = currentPage
      this.tableData2Details()
    },
    current_change3 (currentPage) { // 切换页码
      this.currentPage3 = currentPage
      this.getCheackRecord()
    },
    current_change1 (currentPage) { // 切换页码
      this.currentPage1 = currentPage
      context.http.get(`/cms/api/equirements/${this.detailsData.id}/repair-records`, {
        page: (this.currentPage1 - 1),
        size: this.pgSize1      }).then(res => { // 根据设备id 查维保记录列表
        if (res) {
          this.table2Data = res.data
          this.total1 = Number(res.headers['x-total-count'])
        }
      })
    },
    current_change (currentPage) { // 切换页码
      this.currentPage = currentPage
      context.http.get('/cms/api/repair-forms',
        {          equirementId: this.detailsData.id,
          page: (this.currentPage - 1),
          size: this.pgSize        }).then(res => { // 根据设备id 查报修信息列表
          if (res) {
            this.table1Data = res.data
            this.total = Number(res.headers['x-total-count'])
          }
        })
    },
    setActiveItem (i) {
      this.$refs.carousel.setActiveItem(i)
    },
    formatoutsourceType (n) {
      if (n === 'WARRANTY') {
        return '质保期内'
      } else if (n === 'PARTY_A') {
        return '甲方外包'
      } else if (n === 'CLEAR_BIG') {
        return '清包'
      } else if (n === 'TUNDISH') {
        return '中包'
      } else if (n === 'BUNDLE') {
        return '小包'
      } else if (n === 'NO') {
        return '无'
      }
    },
    formatMaintenanceType (n) {
      if (n === 'FACTORY_MADLE') {
        return '原厂维保'
      } else if (n === 'SUB_CONTRACTOR') {
        return '外委维保'
      } else if (n === 'GROUP') {
        return '集团维保'
      } else if (n === 'NO') {
        return '无'
      }
    },
    formatMaintenancePeriod (n) {
      if (n === 'WEEK') {
        return '周'
      } else if (n === 'DAY') {
        return '天'
      } else if (n === 'MONTH') {
        return '月'
      } else if (n === 'YEAR') {
        return '年'
      }
    },
    menuTabChange (n) {
      this.menuTab = n
    },
    backFn () {
      this.$emit('backFn')
    },
    onHide () {
      this.menuTab = 1
      if (this.myChart) {
        this.myChart.dispose()
      }
      this.currentPage1 = 1
      this.currentPage2 = 1
      this.currentPage3 = 1
      this.rightPartShow = 1
      this.cheackRes = ''
      this.startDate2 = ''
      this.endDate2 = ''
      this.$emit('drawerClose', false)
    }
  }
}
</script>
<style lang="scss">
.devicesDetails {
  .el-button--primary {
    color: #3175f6 !important;
    background-color: #ffffff !important;
    border-color: #3175f6 !important;
  }
  .el-button--primary:hover {
    background-color: #3577f6 !important;
    border-color: #3577f6 !important;
    color: #ffffff !important;
  }
  .drawer-title {
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
    margin-bottom: 5px;
  }
}
</style>
<style lang="scss" scoped>
.devicesDetails {
  .backBtn {
    display: inline-block;
    width: 30px;
    height: 30px;
    font-size: 20px;
    color: #666;
    position: absolute;
    top: 18px;
    left: 60px;
    padding-left: 10px;
    border-left: 1px solid #eee;
    cursor: pointer;
  }
  .main-content {
    width: 1300px;
    display: flex;
    justify-content: space-between;
    .leftPart {
      width: 680px;
      .imgContant {
        border: 1px solid #f6f6f6;
        margin: 0 15px;
        padding-bottom: 25px;
        .title {
        }
        .carousel-itemImg {
          position: relative;
          .listBox {
            width: 130px;
            height: 250px;
            margin: 20px 0 0 10px;
            position: relative;
            overflow: hidden;
            position: relative;
          }
          .btn {
            position: absolute;
            width: 20px;
            height: 20px;
            line-height: 20px;
            cursor: pointer;
            z-index: 99;
            font-size: 20px;
            font-weight: bold;
            // background-color: rgba(31,45,61,.23);
            i {
              color: #777;
            }
          }
          .prev {
            top: 270px;
            right: 90px;
            transform: rotate(90deg);
          }
          .next {
            top: 270px;
            right: 50px;
            transform: rotate(90deg);
          }
        }
        .carousel {
          margin: 29px auto;
          width: 400px;
          height: 240px;
          margin-left: 100px;
        }
        .itemImg {
          width: 400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          .cf {
            width: 120px;
            position: absolute;
            div {
              width: 120px;
              height: 72px;
              margin-right: 10px;
              position: relative;
              margin-bottom: 13px;
              img {
                width: 120px;
                height: 72px;
              }
              i {
                position: absolute;
                top: -8px;
                right: -8px;
                cursor: pointer;
                color: #105cee;
              }
            }
          }
          .itemImg-div {
            &:first-child {
              margin-top: 8px;
            }
          }
          div {
            width: 60px;
            height: 60px;
            margin-right: 10px;
            position: relative;
            img {
              width: 60px;
              height: 60px;
            }
            i {
              position: absolute;
              top: -8px;
              right: -8px;
              cursor: pointer;
              color: #105cee;
            }
          }
        }
      }
      .tabContent {
        .menuTab {
          height: 60px;
          align-items: center;
          display: flex;
          margin: 0 30px;
          > span {
            display: inline-block;
            text-align: center;
            cursor: pointer;
            font-size: 14px;
            height: 30px;
            padding: 0 10px;
            margin-right: 15px;
            line-height: 30px;
            border-radius: 3px;
            &.active {
              color: #fff;
              background-color: #3175f6;
            }
          }
        }
        .content {
          padding-top: 1px;
          border: 1px solid #eeeeee;
          margin: 0 30px 15px;
          min-height: 200px;
          .title {
            padding-left: 15px;
          }
          .itemContent {
            padding: 15px 10px;
            display: flex;
            flex-wrap: wrap;
            .item {
              width: 33%;
              min-height: 70px;
              padding-left: 20px;
              > p {
                font-size: 14px;
                margin-bottom: 10px;
              }
              > span {
                display: inline-block;
                width: 100%;
                font-size: 12px;
                color: #8e8e8e;
                word-break: break-all;
              }
            }
          }
        }
      }
    }
  }
  .rightPart {
    width: 600px;
    padding-right: 30px;
    .seachDiv {
      padding: 15px 0 15px 15px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      flex-wrap: wrap;
      .query-btn {
        display: inline-block;
        width: 70px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        cursor: pointer;
        color: #fff;
        border-radius: 3px;
        background-color: #3577f6;
        margin: 0;
      }
      .query-btn:hover {
        background-color: #2a6ef0;
      }
    }
    .rightTab {
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      color: #666;
      border: 1px solid rgba(238, 238, 238, 1);
      box-shadow: 0px 2px 3px 0px rgba(190, 199, 208, 0.2);
      margin-bottom: 20px;
      > span {
        padding: 0 15px;
        cursor: pointer;
        display: inline-block;
        height: 48px;
        &.active {
          color: #3175f6;
          border-bottom: 2px solid #3175f6;
        }
      }
    }
    .eChart {
      border: 1px solid #f7f7f7;
      min-height: 410px;
      margin-bottom: 20px;
    }
    .historyTable {
      border: 1px solid #f7f7f7;
      min-height: 410px;
    }
    .cheackRecord {
      border: 1px solid #f7f7f7;
      min-height: 410px;
      .normal {
        color: #49af61;
      }
      .abnormal {
        color: #ff6665;
      }
    }
    .table1 {
      border: 1px solid #f7f7f7;
      min-height: 410px;
      margin-bottom: 20px;
    }
    .table2 {
      border: 1px solid #f7f7f7;
      min-height: 410px;
    }
  }
}
</style>
