<template>
  <div id="energySystem"
       class="energySystem">
    <span class="page_head_title">消防系统</span>
    <ul class="default_tab_block">
      <li @click="roterTo('firecontrolChart')"
          v-if="hasAuthority('03050101')">
        <span>消防平面图</span>
      </li>
      <li @click="roterTo('firecontrolEquipment')"
          v-if="hasAuthority('03050102')">
        <span>消防设施设备列表</span>
      </li>
      <li class="active">
        <span>消防检测</span>
      </li>
      <li @click="roterTo('firecontrolChecklist')"
          v-if="hasAuthority('03050106')">
        <span>消防器材检查表</span>
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
          <el-select v-model="chartType"
                     placeholder="检测类型"
                     clearable>
            <el-option v-for="(item,index) in monitorTypeList"
                       :key="index"
                       :value="item.value"
                       :label="item.name"></el-option>
          </el-select>
        </span>
        <el-date-picker size="small"
                        v-model="dateValue"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间">
        </el-date-picker>
        <div class="query-btn"
             @click="queryBtn">查询</div>
      </div>
      <el-button class="tban tban1"
                 @click="showAddenergyDataDialog"
                 v-if="hasAuthority('03050104')"><i class="iconfont icon-crm_xinzeng-"></i> 新增报告</el-button>

    </div>
    <div class="content">
      <div class="table">
        <el-table :data="tableData1"
                  style="width: 100%">
          <el-table-column prop="projectName"
                           label="项目简称"
                           align="center"></el-table-column>
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
          <el-table-column prop="createTime"
                           label="创建时间"
                           align="center"
                           :formatter="formatupdateTime"></el-table-column>
          <el-table-column prop="eqptAmount"
                           label="检测设备"
                           align="center"></el-table-column>
          <el-table-column prop="normalAmount"
                           label="正常设备"
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
        <span><span style="margin-right:10px">{{currentPage}}/{{Math.ceil(total/pgSize)}}
            页</span> 共{{total}}条记录</span>
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
    <!-- 新增消防检测报告 -->
    <el-dialog title="新增消防检测报告"
               :visible.sync="addenergyDataShow"
               width="800px"
               @close="addenergyDataClose"
               class="addenergyDataShow">
      <el-form>
        <div class="fire-report">
          <div class="dl-head">
            <span class="step"
                  :class="{stepActive: newlystep1, stepActivePast: newlystep2}"><span style="font-size: 20px;">1</span>. 基本资料</span>
            <span class="step"
                  :class="{stepActive: newlystep2}"><span style="font-size: 20px;">2</span>. 设备选择</span>
            <span class="step"
                  :class="{stepActive: newlystep3}"><span style="font-size: 20px;">3</span>. 生成预览</span>
          </div>
          <div class="fire-report-content"
               style="border:1px solid #EBEBEB;margin: 20px 0"
               v-show="newlystep1">
            <el-form :model="addData"
                     :rules="addDataRules"
                     ref="ruleForm">
              <el-form-item :label-width="formLabelWidth"
                            prop="projectId"
                            style="margin-bottom: 20px;margin-top: 10px;">
                <div class="cttitle">项目简称<i class="required">*</i></div>
                <el-select v-model="addData.projectId"
                           placeholder="项目"
                           @change="cmsFireControlCheckList(addData.projectId)"
                           style="width: 220px;">
                  <el-option v-for="item in projectManagementsList"
                             :key="item.id"
                             :label="item.referred"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="reportName"
                            :label-width="formLabelWidth"
                            style="margin-top: 10px;">
                <div class="cttitle">报告名称<i class="required">*</i></div>
                <el-input v-model="addData.reportName"
                          maxlength="20"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item prop="checkType"
                            :label-width="formLabelWidth"
                            style="margin-top: 10px;">
                <div class="cttitle">检测类型<i class="required">*</i></div>
                <el-select v-model="addData.checkType"
                           placeholder="检查表选择"
                           style="width: 210px;">
                  <el-option v-for="item in monitorTypeList"
                             :key="item.value"
                             :label="item.name"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="checkDate"
                            :label-width="formLabelWidth">
                <div class="cttitle">检测时间<i class="required">*</i></div>
                <el-date-picker value-format="yyyy-MM-dd"
                                v-model="addData.checkDate"
                                type="date"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            v-if="addData.checkType === 'CONNECTION'">
                <div class="cttitle">维保单位</div>
                <el-input v-model="addData.checkDept"
                          maxlength="20"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item prop="principal"
                            :label-width="formLabelWidth">
                <div class="cttitle">负责人<i class="required">*</i></div>
                <el-input v-model="addData.principal"
                          maxlength="10"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-form>
            <div class="dc-right"
                 style="width: 96%;margin: 0 auto 20px">
              <div class="enclosure"
                   style="margin: 0">
                <div class="enclosure-head">
                  <div style="margin-left: 20px;">附件</div>
                  <aliUpload :upLoadText="upLoadText"
                             :fileType="fileType"
                             @setAnnex="setAnnex" />
                </div>
                <div class="enclosure-head"
                     style="border-bottom: 1px solid #D8DCE3;background-color:#fff">
                  <span>文件名</span>
                  <span>操作</span>
                </div>
                <div class="enclosure-list"
                     v-for="(item, index) in addData.annexes"
                     :key="index">
                  <div class="el-item">
                    <span>{{item.annexName}}</span>
                    <span v-if="item.annexName"
                          style="padding-left: 60px">
                      <i @click="downloadFile(item, index)"
                         class="iconfont icon-xiazaidaoru"
                         style="margin-right: 10px;"></i>
                      <i @click="deleFile(item, index)"
                         class="iconfont icon-lajixiang"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="fire-report-content"
               style="border:1px solid #EBEBEB;margin: 20px 0"
               v-show="newlystep2">
            <el-select v-model="checkListId"
                       placeholder="检查表选择"
                       style="width: 210px;margin: 20px;">
              <el-option v-for="item in checkList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
            <span class="determine-btn"
                  @click='equirementsall'>确定</span>
            <div class="dc-right conDetail"
                 style="border-left: none;border-right: 0">
              <div class="dr-head">检测设备{{equirementsallList.length}}项</div>
              <div class="item"
                   style="width:240px;display: inline-block;">
                <el-select clearable
                           v-model="equirementTypeId"
                           placeholder="设备小类"
                           @change="queryEquipment('TypeId', equirementTypeId)"
                           style="margin-left: 16px;width: 200px;">
                  <el-option v-for="item in getEquirementTypes25List"
                             :key="item.id"
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
                            @input="queryEquipment('code', equirementCode)"
                            v-model="equirementCode"></el-input>
                </el-form-item>
              </div>
              <div class="item"
                   style="width:230px;display: inline-block;">
                <el-form-item>
                  <el-input style="width:200px;"
                            placeholder="安装位置"
                            @input="queryEquipment('installation', equirementInstallation)"
                            v-model="equirementInstallation"></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="equipment-table">
              <ul>
                <li>设备小类</li>
                <li>设备编号</li>
                <li>设备名称</li>
                <li>安装位置</li>
                <li>检查结果</li>
              </ul>
            </div>
            <el-collapse accordion
                         class="el-collapse">
              <el-collapse-item class="collapse-item"
                                v-for="(item, index) in eqsearchList"
                                :key="index">
                <template slot="title">
                  <span style="width: 145px;">{{item.equirementType.name}}</span>
                  <span style="width: 145px;">{{item.code}}</span>
                  <span style="width: 145px;">{{item.name}}</span>
                  <span style="width: 145px;">{{item.installPosition}}</span>
                  <span>
                    <el-switch style="display: block"
                               v-model="item.checkStatus"
                               active-color="#91CF48"
                               inactive-color="#FF6665"
                               active-text="正常"
                               inactive-text="异常">
                    </el-switch>
                  </span>
                </template>
                <el-form label-position="left"
                         inline
                         class="demo-table-expand">
                  <el-form-item label="">
                    <el-input type="textarea"
                              maxlength="200"
                              style="width: 695px"
                              :autosize="{ minRows: 3}"
                              placeholder="请输入备注内容"
                              v-model="item.remarks">
                    </el-input>
                  </el-form-item>
                </el-form>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div class="fire-report-content"
               style="border:1px solid #EBEBEB;margin: 20px 0"
               v-show="newlystep3">
            <div class="dc-right conDetail"
                 style="margin-top: 0;border: none">
              <div class="dr-head"
                   style="margin-bottom: 0">检测设备{{eqAllList.length}}项</div>
            </div>
            <el-table class="el-collapse"
                      :data="eqAllList"
                      style="width: 100%;border: none">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="left"
                           inline
                           class="demo-table-expand">
                    <el-form-item label="备注:">
                      <span style="display: inline-block;margin-top: 10px;">{{props.row.remarks}}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column align="center"
                               label="设备小类"
                               prop="equirementType.name">
              </el-table-column>
              <el-table-column align="center"
                               label="设备编号"
                               prop="code">
              </el-table-column>
              <el-table-column align="center"
                               label="设备名称"
                               prop="name">
              </el-table-column>
              <el-table-column align="center"
                               label="安装位置"
                               prop="installPosition">
              </el-table-column>
              <el-table-column align="center"
                               label="检查结果"
                               prop="installPosition">
                <template slot-scope="scope">
                  <span :class="{'abnormal': !scope.row.checkStatus }"
                        class="normal">{{scope.row.checkStatus ? '正常' : '异常'}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="addenergyDataClose"
                   v-if="newlystep1"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="previousStep"
                   class="close-button"
                   v-if="newlystep2 || newlystep3">上一步</el-button>
        <el-button @click="newlystepNoe('ruleForm')"
                   type="primary"
                   class="defaultbtn dialog-confirmBtn"
                   v-if="newlystep1 || newlystep2">下一步</el-button>
        <el-button type="primary"
                   @click="DELDialogVisible = true"
                   v-if="newlystep3"
                   class="defaultbtn dialog-confirmBtn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 详情 -->
    <el-drawer title="消防检测报告"
               :visible.sync="energyDataDetailShow"
               @close="energyDataDetailClose"
               direction="rtl"
               size="900px">
      <div style="display: flex;flex-direction: column;height: 100%">
        <div class="energyDataDetail clearfix"
             style="flex: 1;">
          <div class="dc-right float-right conDetail">
            <div class="dr-head">基本信息</div>
            <elForm>
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;">
                <div class="cttitle">项目简称</div>
                <span>{{detailData.projectName}}</span>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;margin-right:0">
                <div class="cttitle">报告名称</div>
                <span>{{detailData.reportName}}</span>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            prop="area"
                            style="margin-bottom: 20px;">
                <div class="cttitle">检测类型</div>
                <span>{{detailData.checkTypeValue}}</span>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            prop="iDNumber">
                <div class="cttitle">检测时间</div>
                <span>{{detailData.checkDate}}</span>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            v-if="detailData.checkType === 'CONNECTION'">
                <div class="cttitle">维保单位</div>
                <span>{{detailData.checkDept}}</span>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;">
                <div class="cttitle">负责人</div>
                <span>{{detailData.principal}}</span>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            prop="yxContractNo">
                <div class="cttitle">创建时间</div>
                <span v-if="detailData.createTime">{{detailData.createTime.replace('T', ' ')}}</span>
              </el-form-item>
              <div style="margin-left: 16px;">
                <div class="cttitle">附件</div>
                <div class="enclosure-list"
                     v-for="(item, index) in detailData.annexes"
                     :key="index"
                     style="margin-bottom: 10px;">
                  <div class="el-item">
                    <span>{{item.annexName}}</span>
                    <span v-if="item.annexName"
                          style="padding-left: 60px">
                      <i @click="downloadFile(item, index)"
                         class="iconfont icon-xiazaidaoru"
                         style="margin-right: 10px;cursor: pointer;"></i>
                    </span>
                  </div>
                </div>
              </div>
            </elForm>
          </div>
          <div class="dc-right float-right conDetail">
            <div class="dr-head"
                 style="margin-bottom: 0">检测设备</div>
            <el-table :data="fcReDetails"
                      class="fcReDetails"
                      style="width: 100%">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="left"
                           inline
                           class="demo-table-expand"
                           style="width: 99%">
                    <el-form-item label="备注："
                                  style="width: 100%">
                      <span style="display: inline-block;margin-top: 10px;">{{ props.row.comment }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column label="设备小类"
                               prop="equipmentType">
              </el-table-column>
              <el-table-column label="设备编号"
                               prop="equipmentNo">
              </el-table-column>
              <el-table-column label="设备名称"
                               prop="equipmentName">
              </el-table-column>
              <el-table-column label="安装位置"
                               prop="installPosition">
              </el-table-column>
              <el-table-column label="检测结果"
                               prop="checkStatusValue">
                <template slot-scope="props">
                  <span class="normal"
                        :class="{'abnormal' : props.row.checkStatusValue !== '正常'}">{{props.row.checkStatusValue}}</span>
                </template>
              </el-table-column>
            </el-table>
            <div class="ctc-foot">
              <div class="pagingnum">
                显示 <select v-model="detailsPager.pgSize"
                        @change="deCurrentSel">
                  <option v-for="item in pgNumoptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                  </option>
                </select>
                条目 <span style="padding-left: 30px">显示从{{detailsPager.pgSize*(detailsPager.currentPage - 1) + 1}}到{{detailsPager.pgSize*detailsPager.currentPage}}项结果，共<span class="style: red">{{detailsPager.total}}</span>条</span>
              </div>
              <el-pagination v-if="total > 0"
                             background
                             layout="prev, pager, next"
                             :page-size=detailsPager.pgSize
                             :total="detailsPager.total"
                             :current-page.sync="detailsPager.currentPage"
                             @current-change="deCurrent_change">
              </el-pagination>
            </div>
          </div>
        </div>
        <div class="report-footer">
          <el-button @click="energyDataDetailClose"
                     class="close-button">关 闭</el-button>
        </div>
      </div>
    </el-drawer>
    <!-- 确认新增 -->
    <el-dialog title="生成预览"
               :visible.sync="DELDialogVisible"
               width="520px"
               center
               class="delDialog">
      <div class="delDialog_content">
        <i class="el-icon-warning-outline"></i>
        <span>确定后设备数量及状态不可变更！</span>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="DELDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addReport">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import context from '@/service'
import * as JSOG from 'jsog'
import axios from 'axios'
import aliUpload from '@/components/aliUpload.vue'
export default {
  name: 'energy',
  components: {
    aliUpload
  },
  data () {
    return {
      equirementCode: '',
      equirementInstallation: '',
      DELDialogVisible: false,
      checkListId: '',
      upLoadText: '上传附件',
      fileType: [],
      newlystep1: true,
      newlystep2: false,
      newlystep3: false,
      formLabelWidth: '',
      dateValue: [],
      endDate1: '',
      startDate1: '',
      energyDataDetailShow: false,
      addenergyDataShow: false,
      monitorTypeList: [{ name: '物业巡检', value: 'PROPERTY' }, { name: '维保单位消防联动检测', value: 'CONNECTION' }, { name: '消防检查', value: 'FIRE' }],
      addData: {
        annexes: []
      },
      addDataRules: {
        projectId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        reportName: [
          { required: true, message: '请输入报告名称', trigger: 'blur' }
        ],
        checkType: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        checkDate: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        checkDept: [
          { required: true, message: '请输入维保单位', trigger: 'blur' }
        ],
        principal: [
          { required: true, message: '请输入负责人', trigger: 'blur' }
        ]
      },
      chosseDevDialogVisible: false,
      tableData: [
        {
          equirement: {
            id: null,
            code: '',
            name: '',
            equirementType: {
              name: ''
            },
            projectManagement: {
              referred: ''
            },
            tenant: {
              teantName: ''
            },
            building: {
              buildingName: ''
            }
          }
        }
      ],
      tableData1: [],
      chartType: '',
      projectManagementsList: [],
      buildingName: '',
      detailData: [],
      projectManagementId: '', // 商圈
      color: '',
      dialogFromIsShow: false,
      zoom: 1,
      currentPage: 1,
      pgNum: 1,
      total: 0,
      pgSize: 15,
      currentPage1: 1,
      total1: 0,
      pgSize1: 15,
      currentPage2: 1,
      total2: 0,
      pgSize2: 15,
      detailsPager: {
        total: 0,
        pgSize: 15,
        currentPage: 1
      },
      fcReDetails: [],
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
      equirementTypeId: '',
      getEquirementTypes25List: [],
      checkList: [],
      equirementsallList: [],
      eqsearchList: [],
      eqAllList: [],
      equirementId: '',
      pickerBeginDateBefore: {
        disabledDate: time => {
          let endDateVal = this.endDate1
          if (endDateVal) {
            let temp = new Date(endDateVal).getTime() - 365 * 24 * 60 * 60 * 1000
            return time.getTime() < new Date(temp).getTime()
          }
        }
      },
      pickerBeginDateAfter: {
        disabledDate: time => {
          let beginDateVal = this.startDate1
          if (beginDateVal) {
            let temp = new Date(beginDateVal).getTime() + 364 * 24 * 60 * 60 * 1000
            return time.getTime() > new Date(temp).getTime()
          }
        }
      }
    }
  },
  created () {
    this.projectManagementsList = this.$store.state.projectManagementsList
    this.projectManagementId = this.$route.params.projectManagementId ? this.$route.params.projectManagementId : this.projectManagementsList[0].id
    this.getEquirementTypes25()
    this.query()
  },
  mounted () {

  },
  methods: {
    energyDataDetailClose () {
      this.detailsPager.currentPage = 1
      this.energyDataDetailShow = false
    },
    queryEquipment (type, val) {
      if (val === '') {
        this.eqsearchList = this.equirementsallList
        return
      }
      let eqsearchList = this.equirementsallList
      if (type === 'TypeId') {
        var searchList = eqsearchList.filter(item => {
          return item.equirementType.id === val
        })
        this.eqsearchList = searchList
      } else if (type === 'code') {
        let searchList2 = []
        eqsearchList.forEach(ele => {
          if (ele.code.indexOf(val) >= 0 || ele.name.indexOf(val) >= 0) {
            searchList2.push(ele)
          }
        })
        this.eqsearchList = searchList2
      } else if (type === 'installation') {
        let searchList3 = []
        eqsearchList.forEach(ele => {
          if (ele.installPosition.indexOf(val) >= 0) {
            searchList3.push(ele)
          }
        })
        this.eqsearchList = searchList3
      }
    },
    fcReportsDetails (id) {
      context.http.get(`/cms/api/fcReports/${id}/details`,
        {
          sort: 'checkStatus',
          page: (this.detailsPager.currentPage - 1),
          size: this.detailsPager.pgSize
        }).then(res => {
          this.fcReDetails = res.data
          this.detailsPager.total = Number(res.headers['x-total-count'])
        })
    },
    deCurrent_change (currentPage) {
      this.detailsPager.currentPage = currentPage
      this.fcReportsDetails(this.detailData.id)
    },
    deCurrentSel () {
      this.detailsPager.currentPage = 1
      this.fcReportsDetails(this.detailData.id)
    },
    addReport () {
      let additionDTOS = []
      this.eqAllList.forEach(ele => {
        additionDTOS.push({ checkStatus: ele.checkStatus ? 'NORMAL' : 'ERROR', comment: ele.remarks, id: ele.id })
      })
      this.addData.additionDTOS = additionDTOS
      context.http.post('/cms/api/fcReports', this.addData).then(res => {
        if (res.status === 201) {
          this.addenergyDataShow = false
          this.DELDialogVisible = false
          this.$message({
            type: 'success',
            message: '新增成功'
          })
          this.query()
        }
      })
    },
    newlystepNoe (formName) {
      if (this.newlystep1) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.newlystep1 = false
            this.newlystep2 = true
            this.newlystep3 = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        if (this.equirementsallList.length === 0) {
          this.$message.error('请选择检测设备')
          return
        }
        let equirementsallList = this.equirementsallList
        let left = []
        let right = []
        let result = []
        equirementsallList.forEach(ele => {
          if (ele.checkStatus) {
            right.push(ele)
          } else {
            left.push(ele)
          }
        })
        result = left.concat(right)

        this.eqAllList = result
        this.newlystep1 = false
        this.newlystep2 = false
        this.newlystep3 = true
      }
    },
    previousStep () {
      if (this.newlystep2) {
        this.newlystep1 = true
        this.newlystep2 = false
        this.newlystep3 = false
      } else {
        this.newlystep1 = false
        this.newlystep2 = true
        this.newlystep3 = false
      }
    },
    cmsFireControlCheckList (id) {
      let projectId = id || this.projectManagementId
      this.checkListId = ''
      context.http.get('/cms/api/cmsFireControlCheckList/all', { projectManagementId: projectId, useStatus: 'USING' }).then(res => {
        this.checkList = res.data
      })
    },
    equirementsall () {
      this.equirementTypeId = ''
      context.http.get('/cms/api/cmsFireControlCheckList/equirementsall', { fireControlCheckListId: this.checkListId, useStatus: 'USING' }).then(res => {
        res.data.forEach(ele => {
          ele.checkStatus = true
        })
        this.equirementsallList = res.data
        this.eqsearchList = res.data
      })
    },
    getEquirementTypes25 () {
      context.http.get('/cms/api/equirementTypes/2').then(res => {
        this.getEquirementTypes25List = res.data
      })
    },
    showAddenergyDataDialog () { // 打开新增弹窗
      this.addenergyDataShow = true
      this.newlystep1 = true
      this.newlystep2 = false
      this.newlystep3 = false
      this.$nextTick(() => {
        this.addData = {
          annexes: []
        }
        this.$refs['ruleForm'].resetFields()
        this.equirementsallList = []
        this.eqAllList = []
        this.checkListId = ''
        this.equirementTypeId = ''
        this.eqsearchList = []
        this.$set(this.addData, 'projectId', this.projectManagementId)
        this.cmsFireControlCheckList()
      })
    },
    addenergyDataClose () { // 关闭新增弹窗
      this.addenergyDataShow = false
    },
    reportDetails (index, row) { // 查看
      this.energyDataDetailShow = true
      this.equirementId = row.equirementId
      context.http.get(`cms/api/fcReports/${row.id}`).then(res => {
        if (res.status === 200) {
          this.detailData = res.data
          this.fcReportsDetails(this.detailData.id)
        }
      })
    },
    formatupdateTime (row, column) {
      return row.createTime.replace('T', ' ')
    },
    queryBtn () {
      this.currentPage = 1
      this.query()
    },
    query () {
      let startDate = this.dateValue && this.dateValue[0] ? this.dateValue[0] : ''
      let endDate = this.dateValue && this.dateValue[1] ? this.dateValue[1] : ''
      context.http.get('/cms/api/fcReports?sort=checkDate,desc&sort=createdDate,desc',
        {
          projectId: this.projectManagementId,
          startDate: startDate,
          endDate: endDate,
          page: (this.currentPage - 1),
          size: this.pgSize,
          checkType: this.chartType
        }).then(res => {
          this.tableData1 = res.data
          this.total = Number(res.headers['x-total-count'])
        })
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
    setAnnex (annexURL, annexName) {  // 子组件上传成功返回文件url 和名字
      this.addData.annexes.push({
        'annexName': annexName,
        'annexURL': annexURL
      })
    },
    downloadFile (item, index) {
      axios({
        method: 'GET',
        url: '/ywm/api/annex/download',
        params: {
          annexURL: item.annexURL,
          annexName: item.annexName
        },
        responseType: 'blob'
      }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', item.annexName)
        document.body.appendChild(link)
        link.click()
      })
    },
    deleFile (item, index) {
      this.addData.annexes.splice(index, 1)
    }
  }
}
</script>
<style lang="scss">
.addenergyDataShow {
  .el-collapse-item__header {
    line-height: inherit;
  }
}
</style>
<style lang="scss" scoped>
.tableBox {
  td {
    height: 25px;
  }
}
.conDetail {
  border: 1px solid rgb(235, 235, 235);
  .normal {
    color: #49af61;
  }
  .abnormal {
    color: #ff6665;
  }
}
.fire-report {
  .dl-head {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: space-start;
    justify-content: space-start;
    margin-top: 20px;
  }
  .step {
    display: inline-block;
    width: 49%;
    height: 40px;
    line-height: 40px;
    padding-left: 14px;
    font-size: 16px;
    background-color: #f9f9f9;
    color: #777;
    border-radius: 6px;
    margin-right: 20px;
  }
  .stepActive {
    color: #fff;
    background-color: #3175d2;
  }
  .el-form-item {
    display: inline-block;
    width: 29%;
    margin-left: 16px;
    margin-right: 10px;
  }
  .enclosure-head {
    background-color: #fafafa;
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -ms-flex-align: center;
    align-items: center;
  }
  .determine-btn {
    display: inline-block;
    width: 80px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
    color: #fff;
    border-radius: 3px;
    background-color: #3577f6;
  }
}
svg polygon.bind,
svg path.bind,
svg rect.bind {
  stroke-width: "2px" !important;
  stroke: "#00ff00" !important;
  fill: "rgba(0,0,0,0.2)" !important;
}
.dc-right {
  width: 100%;
  margin-top: 20px;
  .dr-head {
    background-color: #fafafa;
    height: 40px;
    line-height: 40px;
    padding-left: 12px;
    font-size: 14px;
    margin-bottom: 20px;
    border-bottom: 1px solid #ebebeb;
  }
  .el-form-item {
    display: inline-block;
    width: 29%;
    margin-left: 16px;
    margin-right: 10px;

    &:nth-of-type(2n) {
      margin-right: 0;
    }
  }
}
.energySystem {
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
    display: flex;
    margin-top: 20px;
    flex-wrap: wrap;
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
  .chosseDevDialogVisible {
    .seachDiv {
      height: 80px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .secrchBtn {
        width: 120px;
        height: 32px;
        line-height: 32px;
        padding: 0;
      }
    }
    .table {
      margin-top: 0;
      margin-bottom: 20px;
    }
    .ctc-foot {
      padding: 0px 0 30px 20px;
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
  width: 100px;
  line-height: 32px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  right: 70px;
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
  justify-content: space-between;
  flex-wrap: wrap;
  // padding-left: 20px;
  span {
    margin-right: 10px;
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
.report-footer {
  text-align: right;
  border-top: 1px solid #ddd;
  margin-top: 20px;
  .el-button {
    margin-top: 20px;
  }
}
.equipment-table {
  ul {
    display: flex;
    background: #fafafa;
    li {
      width: 20%;
      font-size: 12px;
      font-weight: bold;
      text-align: center;
      height: 35px;
      line-height: 35px;
    }
  }
}
.collapse-item {
  span {
    display: inline-block;
    text-align: center;
    font-size: 12px;
  }
}
.normal {
  color: #49af61;
}
.abnormal {
  color: #ff6665;
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
</style>
<style>
.fcReDetails .el-table__header thead tr th {
  background-color: #fff;
}
.fire-report-content .cell {
  /* height: 25px;  */
}
#projectId .el-dialog__body {
  border-bottom: none;
  padding: 25px 25px 30px !important;
}
</style>

