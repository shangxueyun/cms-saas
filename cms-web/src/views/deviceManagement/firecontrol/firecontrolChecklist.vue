<template>
  <div id="energySystem"
       class="energySystem firecontrolChecklist">
    <span class="page_head_title">维护管理</span>
    <ul class="default_tab_block">
      <!-- <li @click="roterTo('firecontrolChart')"
          v-if="hasAuthority('03050101')">
        <span>消防平面图</span>
      </li>
      <li @click="roterTo('firecontrolEquipment')"
          v-if="hasAuthority('03050102')">
        <span>消防设施设备列表</span>
      </li>
      <li @click="roterTo('firecontrolTest')"
          v-if="hasAuthority('03050103')">
        <span>消防检测</span>
      </li> -->
      <li @click="roterTo('patrolPollingRecord')"
          v-if="hasAuthority('03050101')">
        <div class="tab_badge">
          <span>巡更巡检</span>
        </div>
      </li>
      <li class="active">
        <span>消防检查</span>
      </li>
      <li @click="roterTo('maintain')" v-if="hasAuthority('03050111')">
        <div class="tab_badge">
          <span>保养列表</span>
          <span v-if="repairRdNum.maintain > 0">{{repairRdNum.maintain}}</span>
        </div>
      </li>
    </ul>
    <div class="search-bar">
      <div style="display: flex;flex-wrap: wrap;align-items:center">
        <span>
          <el-select v-model="projectManagementId"
                     placeholder="项目">
            <el-option v-for="item in projectManagementsList"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
        </span>
        <span>
          <el-select v-model="useStatus"
                     placeholder="状态"
                     clearable>
            <el-option v-for="(item,index) in stateTypeList"
                       :value="item.value"
                       :label="item.name"
                       :key="index"></el-option>
          </el-select>
        </span>
        <div class="query-btn"
             style="margin-top:0"
             @click="queryBtn">查询</div>
      </div>
      <el-button class="tban tban1"
                 @click="showAddenergyDataDialog"
                 v-if="hasAuthority('03050107')"><i class="iconfont icon-crm_xinzeng-"></i> 新增检查表</el-button>
    </div>
    <div class="content">
      <div class="table">
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column prop="projectName"
                           label="项目简称"
                           align="center"></el-table-column>
          <el-table-column prop="name"
                           label="检查表名称"
                           align="center"></el-table-column>
          <el-table-column prop="checkAmount"
                           label="检查设备数"
                           align="center"></el-table-column>
          <el-table-column label="数据状态"
                           align="center"
                           :formatter="formatinstrumentType"></el-table-column>
          <el-table-column label="操作"
                           align="center"
                           v-if="hasAuthority('03050109')">
            <template slot-scope="scope">
              <el-button @click="checkListDetail(scope.$index, scope.row)"
                         class="el-button--primary operation-btn"
                         plain
                         size="mini">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="ctc-foot1">
        <span><span style="margin-right:10px">{{currentPage}}/{{Math.ceil(total/pgSize)}}页</span> 共{{total}}条记录</span>
        <el-pagination v-if="total > 0"
                       background
                       layout="prev, pager, next"
                       :page-size=pgSize
                       :total="total"
                       :current-page.sync="currentPage"
                       @current-change="current_change">
        </el-pagination>
        <div class="pagingnum">
          显示 <select v-model="pgSize"
                  @change="currentSel">
            <option v-for="item in pgNumoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </option>
          </select>
          条目
        </div>
      </div>
    </div>
    <!-- 新增消防器材检查表 -->
    <el-dialog title="新增消防器材检查表"
               :visible.sync="addenergyDataShow"
               width="800px"
               @close="addenergyDataClose">
      <el-form :model="addData"
               :rules="addFlowRules"
               ref="addData">
        <div class="energyDataHtml">
          <div class="dc-right float-right conDetail">
            <div class="dr-head">基本信息</div>
            <div class="item"
                 style="width:342px;margin-right:30px;display: inline-block;">
              <div style="margin: 0 0 10px 20px;">项目简称<i class="required">*</i></div>
              <el-select v-model="projectManagementId"
                         placeholder="项目"
                         @change='getUnEquirements'
                         style="margin-left: 16px;width: 310px;">
                <el-option v-for="item in projectManagementsList"
                           :key="item.id"
                           :label="item.referred"
                           :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="item"
                 style="width:330px;margin-right:20px;display: inline-block;">
              <div style="margin: 0 0 10px 20px;">检查表名称<i class="required">*</i></div>
              <el-form-item prop="name">
                <el-input style="width:310px;"
                          v-model="addData.name"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="dc-right float-right conDetail">
            <div class="dr-head">已选中设备{{multipleS.length}}项</div>
            <div class="item"
                 style="width:240px;display: inline-block;">
              <el-select clearable
                         v-model="addData.equirementTypeId"
                         placeholder="设备小类"
                         @change='getUnEquirements'
                         style="margin-left: 16px;width: 200px;">
                <el-option v-for="(item, index) in getEquirementTypes2List"
                           :key="index"
                           :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="item"
                 style="width:240px;display: inline-block;">
              <el-form-item>
                <el-input style="width:200px;"
                          placeholder="设备编号/名称"
                          @input="getUnEquirements"
                          v-model="addData.nameAndCode"></el-input>
              </el-form-item>
            </div>
            <div class="item"
                 style="width:230px;display: inline-block;">
              <el-form-item>
                <el-input style="width:200px;"
                          placeholder="安装位置"
                          @input="getUnEquirements"
                          v-model="addData.onstallationLocation"></el-input>
              </el-form-item>
            </div>
          </div>
          <el-table class="el-scrollbar"
                    ref="equipmentList"
                    :data="equipmentSearchList"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @select="openDetails"
                    @select-all="selectAll"
                    @selection-change="handleSelectionChange">
            <el-table-column align="center"
                             type="selection"
                             width="55">
            </el-table-column>
            <el-table-column align="center"
                             label="设备小类"
                             width="120">
              <template slot-scope="scope">{{ scope.row.equirementType.name }}</template>
            </el-table-column>
            <el-table-column align="center"
                             prop="code"
                             label="设备编号"
                             width="120">
            </el-table-column>
            <el-table-column align="center"
                             prop="name"
                             label="设备名称"
                             width="120">
            </el-table-column>
            <el-table-column align="center"
                             prop="installPosition"
                             label="安装位置"
                             width="120">
            </el-table-column>
            <el-table-column align="center"
                             label="是否需要巡检"
                             show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.onMaintain ? '是' : '否' }}</template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="addenergyDataClose"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="addCmsFireControlCheckList('addData')"
                   class="defaultbtn dialog-confirmBtn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑消防器材检查表 -->
    <el-drawer :visible.sync="energyDataDetailShow"
               direction="rtl"
               @close="energyDataDetailCLose"
               size="900px">
      <span slot="title"
            style="position: relative">
        <!-- <span v-if="readOnly">查看</span><span v-else>编辑</span>消防检查详情 -->
        消防检查详情
        <span style="position: absolute;right: 0;cursor: pointer;color: #3575F6;"
              @click="readOnly = false"
              v-if="hasAuthority('03050108') && readOnly && tabIndex === 0"><i class="iconfont icon-edit1"></i>编辑</span>
      </span>
      <div style="display: flex;flex-direction: column;height: 100%;">
        <div>
          <div class="tab">
            <div class="dl-head info_tab">
              <ul class="nav">
                <li @click="changeNav(index)"
                    v-for="(item, index) in navList"
                    :key="index"
                    :class="item.value ? 'select_active' : ''">{{item.label}}</li>
              </ul>
            </div>
          </div>
          <div class="energyDataDetail"
               v-show="tabIndex === 0"
               style="flex: 1">
            <div class="dc-right conDetail">
              <div class="dr-head">基本信息</div>
              <elForm :model="detailData"
                      :rules="rules"
                      ref="ruleForm">
                <el-form-item style="margin-bottom: 20px;">
                  <div class="cttitle">项目简称<i class="required">*</i></div>
                  <span>{{detailData.projectName}}</span>
                </el-form-item>
                <el-form-item prop="name"
                              style="margin-bottom: 20px;margin-left: 30px">
                  <div class="cttitle">检查表名称<i class="required">*</i></div>
                  <span v-if="readOnly">{{detailData.name}}</span>
                  <el-input v-else
                            v-model="detailData.name"
                            placeholder="请输入检查表名称"></el-input>
                </el-form-item>
                <el-form-item prop="area"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">数据状态<i class="required">*</i></div>
                  <span v-if="readOnly">{{detailData.useStatus === 'DISABLE' ? '已停用' : '使用中'}}</span>
                  <el-select v-else
                             v-model="detailData.useStatus"
                             placeholder="项目"
                             style="width: 260px;">
                    <el-option v-for="(item, index) in stateTypeList"
                               :key="index"
                               :label="item.name"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </elForm>
            </div>
            <div class="dc-right conDetail">
              <div class="dr-head"
                   style="margin-bottom: 0">
                <!-- 检测设备{{eqPager.total}}项 -->
                检测设备{{inspectionEqData.length}}项
                <span class="newEqBtn"
                      v-if="!readOnly"
                      @click="addequipment = true;addEquipmentList = [];addequipmentData.equirementTypeId = '';getUnEquirements2()">
                  新增设备
                </span>
              </div>
            </div>
            <el-table :row-class-name="tableRowClassName"
                      :data="inspectionEqData"
                      class="checklist-detail details_table el-collapse"
                      style="width: 100%;border-left:1px solid #E7E7E7;border-right:1px solid #E7E7E7;max-height: 500px;">
              <el-table-column align="center"
                               prop="equirementType.name"
                               label="设备小类"
                               width="180">
              </el-table-column>
              <el-table-column align="center"
                               prop="code"
                               label="设备编号"
                               width="180">
              </el-table-column>
              <el-table-column align="center"
                               prop="name"
                               label="设备名称">
              </el-table-column>
              <el-table-column align="center"
                               prop="installPosition"
                               label="安装位置">
              </el-table-column>
              <el-table-column align="center"
                               prop="address"
                               label="是否需要巡检">
                <template slot-scope="scope">
                  {{ scope.row.onMaintain ? '是' : '否' }}
                  <!-- <i class="iconfont icon-lajixiang"
                     @click="delEquipment(scope.row, scope.row.id)"
                     v-if="!readOnly"
                     style="cursor: pointer;margin-left: 40px;"></i> -->
                </template>
              </el-table-column>
              <el-table-column align="center"
                               prop="installPosition"
                               width="50px"
                               label="" v-if="!readOnly">
                <template slot-scope="scope">
                  <i class="iconfont icon-lajixiang"
                     @click="delEquipment(scope.row, scope.row.id)"
                     v-if="!readOnly && inspectionEqData.length > 1"
                     style="cursor: pointer;"></i>
                </template>
              </el-table-column>
            </el-table>
            <!-- <div class="ctc-foot1">
              <span><span style="margin-right:10px">{{eqPager.currentPage}}/{{Math.ceil(eqPager.total/eqPager.pgSize)}}页</span> 共{{eqPager.total}}条记录</span>
              <el-pagination v-if="eqPager.total > 0"
                             background
                             layout="prev, pager, next"
                             :page-size=eqPager.pgSize
                             :total="eqPager.total"
                             :current-page.sync="eqPager.currentPage"
                             @current-change="eqCurrent_change">
              </el-pagination>
              <div class="pagingnum">
                显示 <select v-model="eqPager.pgSize"
                        @change="eqCurrentSel">
                  <option v-for="item in pgNumoptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                  </option>
                </select>
                条目
              </div>
            </div> -->
          </div>
          <div class="energyDataDetail"
               v-show="tabIndex === 1"
               style="flex: 1">
            <div class="content">
              <p class="title"
                 style="justify-content: space-between;">
                <i></i>
                <span>消防检测记录</span>

                <el-button class="tban tban1"
                           @click="addRepFn"
                           v-if="hasAuthority('03050110') && detailData.useStatus === 'USING'"><span class="iconfont icon-crm_xinzeng-"
                        style="position: relative;"></span> 新增报告</el-button>
              </p>
              <div class="table">
                <el-table :data="tableData1"
                          style="width: 100%">
                  <el-table-column prop="reportName"
                                   label="报告名称"
                                   align="center"></el-table-column>
                  <el-table-column prop="checkTypeValue"
                                   label="检测类型"
                                   align="center"></el-table-column>
                  <el-table-column prop="checkDate"
                                   label="检测时间"
                                   align="center"></el-table-column>
                  <el-table-column prop="principal"
                                   label="负责人"
                                   align="center"></el-table-column>
                  <el-table-column prop="eqptAmount"
                                   label="检测设备"
                                   align="center"></el-table-column>
                  <el-table-column prop="errorAmount"
                                   label="异常设备"
                                   align="center"></el-table-column>
                  <el-table-column label="操作"
                                   align="center"
                                   v-if="hasAuthority('03050105')">
                    <template slot-scope="scope">
                      <el-button @click="reportDetails(scope.$index, scope.row)"
                                 class="el-button--primary operation-btn"
                                 plain
                                 size="mini">查看</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="ctc-foot1">
                <span><span style="margin-right:10px">{{currentPage1}}/{{Math.ceil(total1/pgSize1)}}
                    页</span> 共{{total1}}条记录</span>
                <el-pagination v-if="total1 > 0"
                               background
                               layout="prev, pager, next"
                               :page-size=pgSize1
                               :total="total1"
                               :current-page.sync="currentPage1"
                               @current-change="current_change1">
                </el-pagination>
                <div class="pagingnum">
                  显示 <select v-model="pgSize1"
                          @change="currentSel1">
                    <option v-for="item in pgNumoptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </option>
                  </select>
                  条目
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer"
             style="border-top: 1px solid #ddd;">
          <el-button @click="energyDataDetailCLose1"
                     class="close-button"
                     v-if="!readOnly"
                     style="margin-top: 20px;">取 消</el-button>
          <el-button v-if="!readOnly"
                     type="primary"
                     @click="preservation('ruleForm')"
                     class="defaultbtn dialog-confirmBtn">保 存</el-button>
        </div>
      </div>
    </el-drawer>
    <!-- 新增设备 -->
    <el-dialog title="新增设备"
               :visible.sync="addequipment"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :before-close="addequipmentClose"
               width="800px">
      <el-form :model="addequipmentData"
               :rules="addqeFlowRules"
               ref="addeqData">
        <div class="energyDataHtml">
          <div class="dc-right float-right conDetail">
            <div class="dr-head">已选中设备{{inspectionEqData.length}}项</div>
            <div class="item"
                 style="width:240px;display: inline-block;">
              <el-select v-model="addequipmentData.equirementTypeId"
                         clearable
                         placeholder="设备小类"
                         @change='getUnEquirements2'
                         style="margin-left: 16px;width: 200px;">
                <el-option v-for="(item, index) in getEquirementTypes2List"
                           :key="index"
                           :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="item"
                 style="width:240px;display: inline-block;">
              <el-form-item>
                <el-input style="width:200px;"
                          placeholder="设备编号/名称"
                          @input='getUnEquirements2'
                          v-model="addData.nameAndCode2"></el-input>
              </el-form-item>
            </div>
            <div class="item"
                 style="width:230px;display: inline-block;">
              <el-form-item>
                <el-input style="width:200px;"
                          placeholder="安装位置"
                          @input='getUnEquirements2'
                          v-model="addData.onstallationLocation2"></el-input>
              </el-form-item>
            </div>
          </div>
          <el-table class="el-collapse"
                    ref="addEquipmentList"
                    :data="addEquipmentList"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @select="openDetails2"
                    @select-all="selectAll2">
            <el-table-column type="selection"
                             width="55">
            </el-table-column>
            <el-table-column align="center"
                             label="设备小类"
                             width="120">
              <template slot-scope="scope">{{ scope.row.equirementType.name }}</template>
            </el-table-column>
            <el-table-column align="center"
                             prop="code"
                             label="设备编号"
                             width="120">
            </el-table-column>
            <el-table-column align="center"
                             prop="name"
                             label="设备名称"
                             width="120">
            </el-table-column>
            <el-table-column align="center"
                             prop="installPosition"
                             label="安装位置"
                             width="120">
            </el-table-column>
            <el-table-column align="center"
                             label="是否需要巡检"
                             show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.onMaintain ? '是' : '否' }}</template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="addequipment = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="addenergyDataFn('addData')"
                   class="defaultbtn dialog-confirmBtn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 确认删除弹窗 -->
    <el-dialog title="删除确认"
               :visible.sync="DELDialogVisible"
               width="520px"
               center
               class="delDialog">
      <div class="delDialog_content">
        <i class="el-icon-warning-outline"></i>
        <span>确认删除设备？</span>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="DELDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="delFun">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增消防检测报告 -->
    <el-dialog title="新增消防检测报告"
               :visible.sync="addenergyDataShow1"
               width="800px"
               @close="addenergyDataClose1"
               class="addenergyDataShow1">
      <new-report ref="newReport"
                  :detailData='detailData'
                  :addenergyDataShow1='addenergyDataShow1'
                  @addenergyClose="addenergyDataClose1" />
    </el-dialog>
    <!-- 详情 -->
    <el-drawer title="消防检测报告"
               :visible.sync="energyDataDetailShow1"
               @close="energyDataDetailClose"
               direction="rtl"
               size="900px">
      <report-details :detailData="reportDetailData"
                      :energyDataDetailShow1.sync="energyDataDetailShow1"></report-details>
    </el-drawer>
  </div>
</template>

<script>
import context from '@/service'
import * as JSOG from 'jsog'
import axios from 'axios'
import NewReport from './components/NewReport'
import ReportDetails from './components/ReportDetails.vue'
export default {
  name: 'firecontrolChecklist',
  components: {
    NewReport,
    ReportDetails
  },
  data () {
    return {
      tabIndex: 0,
      repairRdNum: {},
      addequipmentData: {},
      DELDialogVisible: false,
      inspectionEqData: [],
      equirementsLength: 0,
      projectId: '',
      useStatus: 'USING',
      addequipment: false,
      readOnly: true,
      formLabelWidth: '',
      equirementTypeChildId: '',
      myChart: null,
      tableData2: [],
      endDate1: '',
      startDate1: '',
      endDate2: '',
      startDate2: '',
      energyDataDetailShow: false,
      energyDataDetailShow1: false,
      editenergyDataShow: false,
      addenergyDataShow: false,
      stateTypeList: [{ name: '使用中', value: 'USING' }, { name: '已停用', value: 'DISABLE' }],
      addData: {
        equirementTypeId: ''
      },
      addqeFlowRules: {},
      addFlowRules: {
        name: [
          { required: true, message: '请输入检查表名称', trigger: 'blur' }
        ]
      },
      tableData: [],
      tableData1: [],
      chartType: '',
      projectManagementsList: [],
      buildingName: '',
      detailData: {},
      reportDetailData: {},
      projectManagementId: '', // 商圈
      color: '',
      dialogFromIsShow: false,
      currentPage: 1,
      pgNum: 1,
      total: 0,
      pgSize: 15,
      currentPage2: 1,
      pgSize1: 15,
      currentPage1: 1,
      total1: 0,
      pgNumoptions: [
        {
          value: 15,
          label: '15'
        },
        {
          value: 30,
          label: '30'
        },
        {
          value: 50,
          label: '50'
        }
      ],
      multipleSelection: [],
      getEquirementTypes2List: [],
      equirementId: '',
      rules: {
        name: [
          { required: true, message: '请输入检查表名称', trigger: 'blur' }
        ]
      },
      addEquipmentList: [],
      addEquirementsLength: 0,
      equipmentList: [],
      multipleS: [],
      multipleS2: [],
      equipmentSearchList: [],
      multipleSelection2: [],
      calculationData: [],
      eqPager: {
        pgNum: 0,
        total: 0,
        pgSize: 15,
        currentPage: 1
      },
      navList: [
        {
          label: '消防器材检测表',
          value: true
        }, {
          label: '消防检测记录',
          value: false
        }
      ],
      addenergyDataShow1: false
    }
  },
  created () {
    this.projectManagementsList = this.$store.state.projectManagementsList
    this.projectManagementId = this.$route.params.projectManagementId ? this.$route.params.projectManagementId : this.projectManagementsList[0].id
    this.getEquirementTypes25()
    this.repairRecordNum()
  },
  mounted () {

  },
  methods: {
    changeNav (inx) {
      this.navList.forEach(item => {
        item.value = false
      })
      this.navList[inx].value = true
      if (inx === 0) {
        this.tabIndex = inx
      } else if (inx === 1) {
        this.tabIndex = inx
        this.queryFireDetection()
      }
    },
    energyDataDetailClose () {
      this.energyDataDetailShow1 = false
    },
    formatupdateTime (row, column) {
      return row.createTime.replace('T', ' ')
    },
    async repairRecordNum () {
      let repairRdNum = await context.user.repairRecordNum(this.projectManagementId)
      this.repairRdNum = repairRdNum.data
    },
    tableRowClassName ({ row, rowIndex }) {
      if (row.useStatus === 'DISABLE') {
        return 'warning-row'
      }
      return ''
    },
    preservation (formName) {
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // _this.detailData.equirements = _this.postMultipleS2 || _this.inspectionEqDataCopy || _this.inspectionEqData
          _this.detailData.equirements = _this.inspectionEqData
          if (this.detailData.equirements.length === 0) {
            this.$message.error('请添加设备')
            return
          }
          context.http.put('/cms/api/cmsFireControlCheckList', this.detailData).then(res => {
            if (res.status === 200) {
              // this.energyDataDetailShow = false
              this.energyDataDetailCLose1()
              this.query()
              this.$message.success('保存成功')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    delEquipment (row, id) {
      this.DELDialogVisible = true
      this.delEquipmentId = id
      this.delEqRow = row
    },
    delFun () {
      this.DELDialogVisible = false
      let inseq = this.inspectionEqData
      let inseqIndex = inseq.indexOf(this.delEqRow)
      inseq.splice(inseqIndex, 1)

      const multipleS2 = this.multipleS2
      let multipleIndex = multipleS2.indexOf(this.delEqRow)
      multipleS2.splice(multipleIndex, 1)

      // context.http.delete('/cms/api/cmsFireControlCheckList', { equirementId: this.delEquipmentId, fireControlCheckListId: this.detailData.id }).then(res => {
      //   if (res.status === 200) {
      //     this.DELDialogVisible = false
      //     this.getEquirements(this.detailData.id)
      //   }
      // }).catch(err => {
      //   console.log(err)
      //   this.DELDialogVisible = false
      //   let inseq = this.inspectionEqData
      //   let inseqIndex = inseq.indexOf(this.delEqRow)
      //   inseq.splice(inseqIndex, 1)
      // })
    },
    getUnEquirements () {
      if (!this.projectManagementId) { return }
      context.http.get('/cms/api/cmsFireControlCheckList/unEquirements', {
        equirementTypeId: 2,
        equirementTypeChildId: this.addData.equirementTypeId,
        nameAndCode: this.addData.nameAndCode,
        address: this.addData.onstallationLocation,
        useStatus: 'USING',
        projectManagementId: this.projectManagementId
      }).then(res => {
        if (res.status === 200) {
          this.equipmentList = JSOG.decode(res.data)
          this.equipmentSearchList = JSOG.decode(res.data)
          this.equirementsLength = res.data.length
          this.$nextTick(() => {
            this.toggleSelection(this.multipleS)
          })
        }
      })
    },
    getUnEquirements2 () {
      context.http.get('/cms/api/cmsFireControlCheckList/unEquirements', {
        equirementTypeId: 2,
        equirementTypeChildId: this.addequipmentData.equirementTypeId,
        // fireControlCheckListId: this.detailData.id,
        nameAndCode: this.addData.nameAndCode2,
        useStatus: 'USING',
        address: this.addData.onstallationLocation2,
        projectManagementId: this.detailData.projectId
      }).then(res => {
        if (res.status === 200) {
          this.addEquipmentList = JSOG.decode(res.data)
          this.addEquirementsLength = res.data.length
          this.$nextTick(() => {
            const inspectionEqData = this.inspectionEqData
            let totalData = [...inspectionEqData]
            this.toggleSelection2(totalData)
            // this.toggleSelection2(this.multipleS2)
          })
        }
      })
    },
    addCmsFireControlCheckList (formName) {
      if (this.multipleS.length === 0) {
        this.$message({
          message: '请选择设备',
          type: 'warning'
        })
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          context.http.post('/cms/api/cmsFireControlCheckList', { projectId: this.projectManagementId, name: this.addData.name, equirements: this.multipleS }).then(res => {
            if (res.status === 201) {
              this.addenergyDataShow = false
              this.$message.success('保存成功')
              this.query()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    searchEq (type, val) {
      if (val === '') {
        this.equipmentSearchList = this.equipmentList
        this.toggleSelection(this.multipleSelection)
        return
      }
      let resList = this.equipmentList
      // let searchList = this.equipmentSearchList
      if (type === 'codeName') {
        let res = []
        resList.forEach(ele => {
          if (ele.codeName.indexOf(val) > 0) {
            res.push(ele)
          }
        })
        this.equipmentSearchList = res
      } else if (type === 'address') {
        let res = []
        resList.forEach(ele => {
          if (ele.installPosition.indexOf(val) > 0) {
            res.push(ele)
          }
        })
        this.equipmentSearchList = res
      }
      this.toggleSelection(this.multipleSelection)
    },
    toggleSelection (rows) {
      if (rows) {
        let RoomsDTOS = [...this.equipmentSearchList]
        let rowsRes = this.obj_diff(RoomsDTOS, rows)
        rowsRes.forEach(row => {
          this.$refs.equipmentList.toggleRowSelection(row, true)
        })
      }
    },
    toggleSelection2 (rows) {
      if (rows) {
        let RoomsDTOS = [...this.addEquipmentList]
        let rowsRes = this.obj_diff(RoomsDTOS, rows)
        rowsRes.forEach(row => {
          this.$refs.addEquipmentList.toggleRowSelection(row, true)
        })
      }
    },
    obj_diff (a, b) {
      let c = []
      for (var i = 0; i < b.length; i++) {
        for (var j = 0; j < a.length; j++) {
          if (a[j].id === b[i].id) {
            c.push(a[j])
            a.splice(j, 1)
            j = j - 1
          }
        }
      }
      return c
    },
    openDetails (selection, row) {
      let multipleSelectionAll = this.multipleS
      this.multipleSelection = selection
      if (event.target.checked) {
        multipleSelectionAll.push(row)
      } else {
        multipleSelectionAll.forEach(function (item, index, arr) {
          if (item.id === row.id) {
            arr.splice(index, 1)
          }
        })
      }
    },
    selectAll (selection) {
      this.multipleSelection = selection
      let multipleSelectionAllss = this.multipleS
      if (selection.length > 0) {
        let multipleSelectionAll = [...multipleSelectionAllss, ...this.multipleSelection]
        let multipleSelectionAll2 = this.distinct(multipleSelectionAll)
        this.multipleS = multipleSelectionAll2
      } else {
        this.multipleS = []
      }
    },
    handleSelectionChange (val) {
    },
    openDetails2 (selection, row) {
      // let inspectionEqDataCopy = this.inspectionEqDataCopy || this.inspectionEqData.slice(0)
      let inspectionEqDataCopy = this.inspectionEqData
      let multipleSelectionAll = this.multipleS2
      this.multipleSelection2 = selection
      if (event.target.checked) {
        multipleSelectionAll.push(row)
      } else {
        multipleSelectionAll.forEach(function (item, index, arr) {
          if (item.id === row.id) {
            arr.splice(index, 1)
          }
        })
        inspectionEqDataCopy.forEach(function (item, index, arr) {
          if (item.id === row.id) {
            arr.splice(index, 1)
          }
        })
        // this.inspectionEqDataCopy = inspectionEqDataCopy
      }
    },
    selectAll2 (selection) {
      this.multipleSelection2 = selection
      let multipleSelectionAllss = this.multipleS2
      if (selection.length > 0) {
        let multipleSelectionAll = [...multipleSelectionAllss, ...this.multipleSelection2]
        let multipleSelectionAll2 = this.distinct(multipleSelectionAll)
        this.multipleS2 = multipleSelectionAll2
      } else {
        let multipleSelectionAll2 = this.array_diff(this.inspectionEqData, this.multipleS2)
        this.inspectionEqData = multipleSelectionAll2
        this.multipleS2 = []
      }
    },
    array_diff (a, b) {
      for (var i = 0; i < b.length; i++) {
        for (var j = 0; j < a.length; j++) {
          if (a[j].id === b[i].id) {
            a.splice(j, 1)
            j = j - 1
          }
        }
      }
      return a
    },
    formatreferred (row, column) {
      let referred = row.referred ? row.referred : '-'
      return referred
    },
    getEquirementTypes25 () {
      context.http.get('/cms/api/equirementTypes/2').then(res => {
        this.getEquirementTypes2List = res.data
        this.chartType = this.$route.params.equipmentType ? this.$route.params.equipmentType : this.getEquirementTypes2List[0].id
        this.query()
      })
    },
    showAddenergyDataDialog () { // 打开新增弹窗
      this.addenergyDataShow = true
      this.$nextTick(() => {
        this.addData = {
          equirementTypeId: ''
        }
        this.$refs['addData'].resetFields()
        this.multipleSelection = []
        this.multipleS = []
        this.getUnEquirements()
      })
    },
    addenergyDataClose () { // 关闭新增弹窗
      this.$refs['addData'].resetFields()
      this.addenergyDataShow = false
    },
    addenergyDataClose1 () {
      this.addenergyDataShow1 = false
      this.$refs.newReport.restData()
      this.currentSel1()
    },
    energyDataDetailCLose () {
      this.multipleS2 = []
      this.currentPage2 = 1
      this.eqPager.currentPage = 1
      this.energyDataDetailShow = false
      this.query()
    },
    energyDataDetailCLose1 () {
      this.readOnly = true
      this.multipleS2 = []
      this.equipmentTotal = []
      this.checkListDetail(0, this.equirementRow)
    },
    checkListDetail (index, row) {
      this.readOnly = true
      this.energyDataDetailShow = true
      this.equirementId = row.equirementId
      this.equirementRow = row
      this.multipleSelection2 = []
      this.changeNav(0)
      context.http.get(`cms/api/cmsFireControlCheckList/${row.id}`).then(res => {
        if (res.status === 200) {
          this.detailData = res.data
          this.getEquirements(res.data.id)
        }
      })
    },
    getEquirements (id) {
      context.http.get(`cms/api/cmsFireControlCheckList/equirements`, {
        fireControlCheckListId: id,
        page: (this.eqPager.currentPage - 1),
        // size: this.eqPager.pgSize,
        size: 1000,
        sort: 'desc'
      }).then(res => {
        if (res.status === 200) {
          this.calculationData = JSOG.decode(res.data)
          this.inspectionEqData = JSOG.decode(res.data)
          this.eqPager.total = Number(res.headers['x-total-count'])
          if (this.eqPager.total <= 16) {
            this.eqPager.currentPage = 1
          }
        }
      })
    },
    eqCurrentSel () {
      this.eqPager.currentPage = 1
      this.getEquirements(this.detailData.id)
    },
    eqCurrent_change (currentPage) {
      this.eqPager.currentPage = currentPage
      this.getEquirements(this.detailData.id)
    },
    formatinstrumentType (row, column) {
      switch (row.useStatus) {
        case 'USING':
          return '使用中'
        case 'DISABLE':
          return '已停用'
      }
    },
    queryBtn () {
      this.currentPage = 1
      this.query()
    },
    query () {
      context.http.get('/cms/api/cmsFireControlCheckList',
        {
          projectManagementId: this.projectManagementId,
          useStatus: this.useStatus,
          page: (this.currentPage - 1),
          size: this.pgSize,
          sort: 'createdDate,desc'
        }).then(res => {
          this.tableData = res.data
          this.total = Number(res.headers['x-total-count'])
        })
    },
    queryFireDetection () {
      // let startDate = this.dateValue && this.dateValue[0] ? this.dateValue[0] : ''
      // let endDate = this.dateValue && this.dateValue[1] ? this.dateValue[1] : ''
      context.http.get('/cms/api/fcReports?sort=checkDate,desc&sort=createdDate,desc',
        {
          projectId: this.projectManagementId,
          startDate: '',
          endDate: '',
          page: (this.currentPage1 - 1),
          size: this.pgSize1,
          checkType: '',
          fireControlCheckListId: this.detailData.id
        }).then(res => {
          this.tableData1 = res.data
          this.total1 = Number(res.headers['x-total-count'])
        })
    },
    addequipmentClose () {
      this.addequipment = false
    },
    addenergyDataFn () {
      if (this.multipleS2.length > 0 || this.inspectionEqData && this.inspectionEqData.length > 0) {
        this.inspectionEqData = this.inspectionEqDataCopy || this.inspectionEqData
        let inspectionEqData = [...this.inspectionEqData, ...this.multipleS2]
        this.inspectionEqData = this.distinct(inspectionEqData)
        this.addequipment = false
        let calculationData = [...this.calculationData]
        let inspection = [...this.inspectionEqData]
        // this.postMultipleS2 = this.array_diff(inspection, calculationData)
        this.postMultipleS2 = this.inspectionEqData
      } else {
        // this.$message.error('请勾选设备')
        this.addequipment = false
      }
      this.$set(this.addData, 'nameAndCode2', '')
      this.$set(this.addData, 'onstallationLocation2', '')
    },
    distinct (arr) {
      let result = []
      for (let i = 0, len = arr.length; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          if (arr[i].id === arr[j].id) {
            arr.splice(j, 1)
            len--
            j--
          }
        }
      }
      return arr
    },
    current_change1 (currentPage) {
      this.currentPage1 = currentPage
      this.queryFireDetection()
    },
    currentSel1 () {
      this.currentPage1 = 1
      this.queryFireDetection()
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    roterTo (name, isestate) {
      this.$router.push({ name: name, params: { projectManagementId: this.projectManagementId, equipmentType: this.chartType } })
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    handleClose () {
      this.dialogFromIsShow = false
    },
    reportDetails (index, row) { // 查看消防检测记录详情
      this.equirementId = row.equirementId
      context.http.get(`cms/api/fcReports/${row.id}`).then(res => {
        if (res.status === 200) {
          this.energyDataDetailShow1 = true
          this.reportDetailData = res.data
        }
      })
    },
    addRepFn () {
      this.addenergyDataShow1 = true
      this.newlystep1 = true
      this.newlystep2 = false
      this.newlystep3 = false
      this.$nextTick(() => {
        this.addData = {
          annexes: []
        }
        // this.$refs['ruleForm'].resetFields()
        this.equirementsallList = []
        this.eqAllList = []
        this.checkListId = ''
        this.equirementTypeId = ''
        this.eqsearchList = []
        this.$set(this.addData, 'projectId', this.projectManagementId)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.firecontrolChecklist{
  .checklist-detail{
    max-height: 500px;
    overflow-y: scroll;
  }
}
.el-collapse {
  max-height: 300px;
  overflow-y: scroll;
  border-bottom: none;
}
.el-collapse::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  background-color: rgb(25, 38, 70);
}
/*定义滚动条轨道 内阴影+圆角*/
.el-collapse::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px #fff;
  border-radius: 10px;
  background-color: #fff;
}
/*定义滑块 内阴影+圆角*/
.el-collapse::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px #3175d2;
  background-color: 3175d2;
}
.energyDataDetail {
  .el-table::before {
    height: 0;
  }
  .el-form-item {
    width: 30%;
  }
  .vertical {
    display: inline-block;
    width: 4px;
    height: 16px;
    background-color: #3575f6;
    border-radius: 2px;
    vertical-align: middle;
    margin-right: 5px;
  }
  .title {
    padding-left: 20px;
    font-size: 16px;
    font-weight: bolder;
    padding-left: 26px;
    height: 40px;
    line-height: 40px;
    background-color: #fff;
    border-bottom: 1px solid #f6f6f6;
    position: relative;
    color: #262626;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .tban1 {
      margin-right: 10px;
      border: none;
      &:hover {
        background-color: #fff;
        text-decoration: underline;
      }
    }
    i {
      display: block;
      position: absolute;
      left: 15px;
      top: 12px;
      width: 4px;
      height: 16px;
      border-radius: 2px;
      background: #3575f6;
    }
  }
}
.dc-right {
  width: 100%;
  border: 1px solid #e7e7e7;
  margin-top: 20px;

  .dr-head {
    background-color: #fafafa;
    height: 40px;
    line-height: 40px;
    padding-left: 12px;
    font-size: 14px;
    margin-bottom: 20px;
  }
  .el-form-item {
    display: inline-block;
    margin-left: 16px;
    margin-right: 10px;
    &:nth-of-type(2n) {
      margin-right: 0;
    }
  }
  .cttitle {
    vertical-align: top;
  }
}
.energySystem {
  .ctc-foot,
  .ctc-foot1 {
    justify-content: normal;
    flex-direction: row-reverse;
    align-items: center;
    color: #3f5fbf;
    font-size: 12px;
    padding: 60px 20px 30px 20px;
    .pagingnum {
      color: #3f5fbf;
      font-size: 12px;
      select {
        width: 65px;
        height: 28px;
        border-radius: 2px;
        border-color: #f6f6f7;
        color: #3577f6;
      }
    }
    .el-pagination.is-background .btn-next,
    .el-pagination.is-background .btn-prev,
    .el-pagination.is-background .el-pager li {
      margin: 0 5px;
      background-color: transparent;
      color: #3f5fbf;
      min-width: 30px;
      border-radius: 2px;
      font-size: 14px;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      border-radius: 50%;
      background-color: #3f5fbf !important;
      color: #fff !important;
    }
  }
  .export-error {
    display: inline-block;
    width: 90px;
    height: 26px;
    line-height: 24px;
    text-align: center;
    border: 1px solid #3577f6;
    color: #3577f6;
    border-radius: 4px;
    cursor: pointer;
  }
  .energyDataHtml {
    margin-top: 20px;
    > .item {
    }
    .seachDeviceIcon {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: url(../../../assets/seachDeviceIcon.png) no-repeat;
      position: absolute;
      right: 15px;
      top: 12px;
      cursor: pointer;
    }
  }
  .query-btn {
    display: inline-block;
  }
  .menuTab {
    height: 60px;
    margin-top: 15px;
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 4px 4px 4px 1px #eee;
    > span {
      position: relative;
      display: inline-block;
      width: 120px;
      text-align: center;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
      font-size: 14px;
      &.active {
        color: #3577f6;
        border-bottom: 2px solid #3577f6;
      }
      > span {
        display: block;
        position: absolute;
        top: 20px;
        right: 6px;
        min-width: 16px;
        height: 16px;
        line-height: 16px;
        padding: 0 3px;
        font-weight: normal;
        color: white;
        text-align: center;
        text-shadow: 0 1px rgba(0, 0, 0, 0.2);
        border-radius: 16px;
        background: #cb444a;
        font-size: 12px;
      }
    }
  }
}
.morebtn {
  border-radius: 4px;
  background-color: #65ac69;
  color: #f3af2c;
  height: 32px;
  width: 108px;
  line-height: 32px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  .icon-daochu {
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url(../../../assets/add.png) no-repeat;
    background-size: contain;
    vertical-align: middle;
    margin-right: 4px;
    margin-left: 6px;
  }
}
.seachDiv {
  position: relative;
  height: 80px;
  background-color: #ffffff;
  margin-top: 15px;
  border-radius: 5px;
  // box-shadow: 4px 4px 4px 1px #eee;
  display: flex;
  align-items: center;
  // padding-left: 20px;
  span {
    margin-right: 20px;
  }
}
.content {
  min-height: 750px;
  background-color: #ffffff;
  position: relative;
  padding-bottom: 50px;
  .saclBtn {
    display: flex;
    padding: 10px 20px 10px;
    justify-content: space-between;
  }
}
.conDetail {
  .newEqBtn {
    float: right;
    margin: 10px 10px 0 0;
    cursor: pointer;
    display: inline-block;
    width: 80px;
    height: 24px;
    line-height: 24px;
    border: 1px solid rgba(101, 172, 105, 1);
    border-radius: 4px;
    color: #65ac69;
    text-align: center;
  }
}
.dialog-footer {
  // margin-top: -100px;
  clear: both;
  margin-right: 20px;
  text-align: right;
  height: 100px;
  position: relative;
}
.el-scrollbar {
  max-height: 300px;
  overflow-y: scroll;
  border-bottom: none;
}
.el-scrollbar::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  background-color: rgb(25, 38, 70);
}
/*定义滚动条轨道 内阴影+圆角*/
.el-scrollbar::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px #fff;
  border-radius: 10px;
  background-color: #fff;
}
/*定义滑块 内阴影+圆角*/
.el-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px #3175d2;
  background-color: 3175d2;
}

.tab {
  // margin: 10px 0;
  // padding: 0 30px;
  display: flex;
  justify-content: space-between;
  span {
    display: inline-block;
    width: 175px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border: 1px solid #3175f6;
    color: #596483;
    cursor: pointer;
    font-size: 16px;
  }
  .active {
    color: #ffffff;
    background-color: #3175f6;
  }
  div:first-child {
    /* display: flex; */
    // :first-child {
    //   border-right: none;
    //   border-top-left-radius: 8px;
    //   border-bottom-left-radius: 8px;
    // }
    // :last-child {
    //   border-left: none;
    //   border-top-right-radius: 8px;
    //   border-bottom-right-radius: 8px;
    // }
  }
  /* div:last-child {
    font-size: 12px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    .icon-edit2 {
      width: 15px;
      height: 20px;
      margin-right: 4px;
      background: url(../../../../assets/edit.png) no-repeat;
      background-size: contain;
    }
  } */
  .info_tab {
    height: 48px;
    width: 100%;
    padding: 0 20px;
    display: -ms-flexbox;
    display: flex;
    background-color: #fff;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -ms-flex-align: center;
    align-items: center;
    border-bottom: 1px solid #ecedef;

    .nav {
      display: -ms-flexbox;
      display: flex;

      li.select_active {
        border-bottom: 2px solid #3175d2;
        color: #3175d2;
        font-weight: bolder;
      }

      li {
        width: 140px;
        text-align: center;
        font-size: 14px;
        color: #666;
        height: 46px;
        line-height: 46px;
        border-bottom: 2px solid #fff;
        cursor: pointer;
      }
    }
  }
}
</style>
<style lang="scss">
.energyDataHtml {
  .el-table::before {
    background-color: transparent;
  }
}

.checklist-detail .el-table__header thead tr th {
  background-color: #fff;
}
.el-table .warning-row {
  color: #d92e20;
}
#projectId .el-dialog__body {
  border-bottom: none;
  padding: 25px 25px 30px !important;
}
.addenergyDataShow1 {
  .el-dialog {
    background-color: #f7f7f7;
  }
  .el-dialog__header {
    background-color: #fff;
    margin: 0;
  }
  .el-dialog__body {
    margin: 0;
    padding: 0 20px;
  }
}
</style>

