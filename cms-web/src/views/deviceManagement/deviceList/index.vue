<template>
  <div class="device-list deviceLlist deviceLlist_new">
    <span class="page_head_title">设施设备</span>
    <div class="search-bar">
      <div style="display: flex;flex-wrap: wrap;align-items:center">
        <el-select v-model="queryParams.projectValue"
                   placeholder="项目"
                   class="screen"
                   style="width:200px;"
                   @change="projectManagementsChange">
          <el-option v-for="item in projectManagementsList"
                     :key="item.id"
                     :label="item.referred"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-cascader :options="cascaderList"
                     placeholder="设备大小类"
                     v-model="equirementTypeIds"
                     @change="handleChange"
                     clearable
                     :props="{ checkStrictly: true }"
                     style="margin-right:10px;width: 200px">
        </el-cascader>
      </div>
    </div>
    <ul class="default_tab_block">
      <li @click="roterTo('deviceCAD')"
          v-if="hasAuthority('03040101')">
        <span>设施设备平面图</span>
      </li>
      <li class="active"
          v-if="hasAuthority('03040102')">
        <span>设备列表</span>
      </li>
    </ul>
    <div class="pl-content">
      <div class="search-bar">
        <div style="display: flex;flex-wrap: wrap;align-items:center">
          <el-input v-model="queryParams.name"
                    style="width: 200px"
                    placeholder="设备名称"></el-input>
          <el-select v-model="queryParams.useStatus"
                     placeholder="全部状态"
                     class="screen"
                     style="width:200px;margin-right:10px;">
            <el-option label="全部"
                       value=""></el-option>
            <el-option label="在用"
                       value="USING"></el-option>
            <el-option label="停用"
                       value="DISABLE"></el-option>
          </el-select>
          <div class="query-btn"
               @click="queryseach">查询</div>
        </div>
        <div style="display:flex;align-items:center">
          <el-button style="margin-right:10px;display:block"
                     class="tban tban1"
                     v-if="hasAuthority('03040103')"
                     @click="newPipeline"><i class="iconfont icon-crm_xinzeng-"></i> 新增设备</el-button>
          <el-dropdown style="display:block;height:32px;"
                       v-if="hasAuthority('03040103') || hasAuthority('03040104')">
            <el-button plain
                       style="font-size: 14px!important;display:block">
              <i class="el-icon-folder-add"></i>
              批量操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">

              <el-dropdown-item v-if="hasAuthority('03040103')"
                                style="font-size: 12px"><span @click="downLoadModel">下载模板</span></el-dropdown-item>
              <el-dropdown-item style="position:relative;font-size: 12px"
                                v-if="hasAuthority('03040103')">
                上传文件
                <input type="file"
                       @change="imageChange($event)"
                       style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0;">
              </el-dropdown-item>
              <el-dropdown-item v-if="hasAuthority('03040104')"
                                style="font-size: 12px"><span @click="changeUseStatusBatch('USING')">全部启用</span></el-dropdown-item>
              <el-dropdown-item v-if="hasAuthority('03040104')"
                                style="font-size: 12px"><span @click="changeUseStatusBatch('DISABLE')">全部停用</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  style="width: 100%"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection"
                           width="55"></el-table-column>
          <el-table-column prop="projectManagement.referred"
                           label="项目简称"
                           align="center"></el-table-column>
          <el-table-column prop="code"
                           label="设备编号"
                           align="center"></el-table-column>
          <el-table-column prop="equirementType.parent.name"
                           label="设备大类"
                           align="center"></el-table-column>
          <el-table-column prop="equirementType.name"
                           label="设备小类"
                           align="center"></el-table-column>
          <el-table-column prop="name"
                           label="设备名称"
                           align="center"></el-table-column>
          <el-table-column prop="personLiable"
                           label="责任人"
                           align="center"></el-table-column>
          <el-table-column prop="useStatus"
                           label="设备状态"
                           align="center"
                           :formatter="formatBillStatus"></el-table-column>
          <el-table-column label="更新时间"
                           align="center"
                           :formatter="formatLastModifiedDate"></el-table-column>
          <el-table-column label="操作"
                           v-if="hasAuthority('03040105')||hasAuthority('03040104')"
                           align="center"
                           width="200px">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.$index, scope.row)"
                         class="el-button--primary operation-btn"
                         plain
                         size="mini"
                         v-if="hasAuthority('03040105')">查看</el-button>
              <!-- <el-button @click="repairRecord(scope.$index, scope.row)" class="el-button--primary" plain size="mini" v-if="hasAuthority('03010106')" type="warning">维修记录</el-button> -->
              <el-button @click="useStatusChange(scope.$index, scope.row,'DISABLE')"
                         class="stopBtn"
                         size="mini"
                         v-if="scope.row.useStatus==='USING' && hasAuthority('03040104')">停用</el-button>
              <el-button @click="useStatusChange(scope.$index, scope.row,'USING')"
                         class="useBtn"
                         size="mini"
                         v-if="scope.row.useStatus==='DISABLE' && hasAuthority('03040104')">启用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="ctc-foot">
        <span><span style="margin-right:10px">{{currentPage}}/{{totalPages}}页</span> 共{{total}}条记录</span>
        <el-pagination v-if="total > 0"
                       background
                       layout="prev, pager, next"
                       :page-size=pgSize
                       :total="total"
                       :current-page="currentPage"
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
    <!-- 新增设备组件 -->
    <el-dialog title="新增设备"
               :visible.sync="addEquipmentShow"
               class="el_dialog_new"
               width="750px"
               @close="addEquipmentClose"
               :close-on-click-modal="false">
      <addEquipment :equirementTypes="equirementTypes"
                    ref="addEquipment"
                    equirementClass="common"
                    :equirementChildId="equirementTypeIds"
                    :projectManagementId="queryParams.projectValue"
                    :addEquipmentShow="addEquipmentShow"
                    @refresh="query"
                    @addEquipmentClose="addEquipmentClose" />
    </el-dialog>
    <!-- 查看详情 -->
    <!-- equirementClass 设施设备 通用 common  能耗消防弱电other  区分详情编辑大类-->
    <deviceDetails ref="deviceDetails"
                   :detailsdrawershow="detailsdrawershow"
                   :detailsData="flowDetailsData"
                   equirementClass="common"
                   :equirementTypes="equirementTypes"
                   :projectManagementsList="projectManagementsList"
                   :tenantList="tenantList"
                   @emitOpenbaoxiu="emitOpenbaoxiu1"
                   @emitOpenweixiu="emitOpenweixiu1"
                   @emitOpenbaoyang="emitOpenbaoyang"
                   @cannelFn="cannelFn"
                   @updateTenantList="updateTenantList"
                   @drawerClose="drawerClose"
                   @query='query' />
    <!-- 重构后保修单 、维修单详情 -->
    <addRepair ref="addRepair"
               :detailsdrawershow="detailsShow"
               :repairDetails="repairDetails"
               hasAddBtn="none"
               :drawerTitle="drawerTitle"
               @drawerClose="addRepairdrawerClose" />
    <!-- 报修单详情 -->
    <baoxiu :detailsdrawershow="baoxiuShow"
            :equirementId="equirementId"
            :repairDetailsData="repairDetailsData"
            @drawerClose="baoxiuClose" />
    <!-- 维修详情 -->
    <weixiu :detailsdrawershow="weixiuShow"
            :drawerTitle="weixiuTitle"
            :isBaoxiudan="isBaoxiudan"
            :equirementId="equirementId"
            :repairDetailsData="repairDetailsData"
            @drawerClose="weixiuClose" />
    <!-- 保养详情 -->
    <baoyang :detailsdrawershow="baoyangShow"
             :drawerTitle="baoyangTitle"
             :equirementId="equirementId"
             :repairDetailsData="repairDetailsData"
             @drawerClose="baoyangClose" />
    <el-dialog title="错误提示"
               :visible.sync="errorPrompt">
      <el-table :data="gridData"
                style="min-height: 200px;border-left: 1px solid #eee;border-right: 1px solid #eee;">
        <el-table-column property="fileName"
                         label="导入文件"
                         align="center"></el-table-column>
        <el-table-column label="导入结果"
                         align="center"
                         width="220px">
          <template slot-scope="scope">
            <span style="color: red">{{scope.row.result}}</span>
          </template>
        </el-table-column>
        <el-table-column property="address"
                         label="操作"
                         align="center"
                         width="140px">
          <template slot-scope="scope">
            <span class="export-error"
                  @click="downLoadModel1(scope.$index, scope.row)">导出错误提示</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="errorPrompt = false"
                   class="close-button">关 闭</el-button>
      </span>
    </el-dialog>

    <!-- 消防检测报告详情 -->
    <!-- 详情 -->
    <el-drawer title="消防检测报告"
               :visible.sync="energyDataDetailShow"
               class="energyDataDetailShow"
               direction="rtl"
               size="900px">
      <div class="energyDataDetail">
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
                          style="width:100%"
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
        <div class="dc-right float-right conDetail firecontrolChart">
          <div class="dr-head details_table"
               style="margin-bottom: 0">检测设备</div>
          <el-table :data="fcReDetails"
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
            <el-pagination v-if="detailsPager.total > 0"
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
    </el-drawer>
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import * as JSOG from 'jsog'
import deviceDetails from './components/deviceDetails'
import addRepair from '../../operations/repairManagement/components/addRepair'
import addEquipment from './components/addEquipment' // 新增设备
import weixiu from './components/weixiu' // 维修详情
import baoyang from './components/baoyang' // 保养详情
import baoxiu from './components/baoxiu' // 保养详情
import aliUpload from '@/components/aliUpload.vue'
import { error } from 'util'
export default {
  name: 'deviceList',
  components: {
    addEquipment,
    aliUpload,
    deviceDetails,
    weixiu,
    baoyang,
    baoxiu,
    addRepair
  },
  data () {
    return {
      equirementTypeIds: [],
      repairDetails: {}, // 根据报修单id查询报修单详情
      drawerTitle: '报修单详情',
      detailsShow: false,
      baoxiuShow: false,
      weixiuShow: false,
      isBaoxiudan: false,
      weixiuTitle: '维修单详情',
      baoyangShow: false,
      baoyangTitle: '保养单详情',
      drawerTitle2: '',
      radio: '',
      equirementId: null,
      repairDetailsData: {
        imgs: []
      }, // 维修记录详情
      repairRecordList: [], // 维修记录列表
      deviceInfo: {}, // 单条维保信息
      queryParams: { // 条件查询入参
        projectValue: '',
        equirementType: '',
        name: '',
        useStatus: ''
      },
      cascaderList: [], // 设备类型二级联选择器
      multipleSelection: [],
      gridData: [{
        fileName: '',
        result: '',
        id: ''
      }],
      errorPrompt: false,
      equirementTypes: [], // 设备大小类枚举
      equirementTypesChild: [], // 设备小类
      addDevMenuTab: 1, // 新增设备菜单栏
      pageType: 'add',
      projectManagementsList: [],
      repairRecordModelshow: false,
      projecOptions: [],
      accountEntry: true,
      adddialogVisible: false,
      addProjectShow: false,
      detailsdrawershow: false,
      addEquipmentShow: false,
      flowExplain: '',
      addform: {},
      tableData: [],
      tenantNameeOptions: [],
      currentPage: 1,
      totalPages: 1,
      pgNum: 1,
      total: 0,
      pgSize: 15,
      flowDetailsData: {
        imageUrls: [],
        annexes: [],
        equirementType: {
          name: '',
          id: '',
          parent: {
            id: '',
            name: ''
          }
        },
        projectManagement: {
          projectName: ''
        },
        building: {
          buildingName: ''
        }
      },
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
      reportId: '',
      detailsPager: {
        total: 0,
        pgSize: 15,
        currentPage: 1
      },
      fcReDetails: [],
      detailData: [],
      formLabelWidth: '',
      energyDataDetailShow: false,
      tenantList: [],
      repairRdNum: {}
    }
  },
  created () {
    this.projectManagementsList = this.$store.state.projectManagementsList
    this.queryParams.projectValue = this.$route.params.projectManagementId ? this.$route.params.projectManagementId : this.projectManagementsList[0].id
    this.query()
    this.getEquirementTypes()
    // this.repairRecordNum()
  },
  methods: {
    addEquipmentClose () {
      this.$refs.addEquipment.addEquipmentClose(true)
      this.addEquipmentShow = false
    },
    addRepairdrawerClose () {
      this.detailsShow = false
    },
    async cannelFn (equirementsId) { // 设备id
      let result = await context.http.get(`cms/api/equirements/${equirementsId}`)
      this.equirementId = equirementsId
      this.flowDetailsData = result.data
      if (!this.flowDetailsData.tenant) {
        this.flowDetailsData.tenant = { id: null }
      }
    },
    emitOpenbaoxiu1 (id) {
      context.http.get(`cms/api/repair-forms/${id}`).then(res => { // 报修信息详情repairForms   维保记录详情repairRecords
        this.drawerTitle = '报修单详情'
        this.repairDetails = res.data
        this.detailsShow = true
      }).catch(error => {
        console.info(error)
      })
    },
    emitOpenweixiu1 (id) {
      context.http.get(`cms/api/repair-forms/${id}`).then(res => { // 报修信息详情repairForms   维保记录详情repairRecords
        this.drawerTitle = '维修单详情'
        this.repairDetails = res.data
        this.detailsShow = true
      }).catch(error => {
        console.info(error)
      })
    },
    emitOpenbaoxiu (id) { // 查看报修单信息详情
      context.http.get(`cms/api/repair-forms/${id}`).then(res => { // 报修信息详情repairForms   维保记录详情repairRecords
        this.repairDetailsData = res.data
        this.baoxiuShow = true
      }).catch(error => {
        console.info(error)
      })
    },
    emitOpenweixiu (id, baoxiudan) { // 查看 维修 baoxiudan维修详情是否有报修单模块
      context.http.get(`cms/api/repair-records/${id}`).then(res => {
        this.repairDetailsData = res.data
        this.isBaoxiudan = baoxiudan
        this.weixiuShow = true
      }).catch(error => {
        console.info(error)
      })
    },
    emitOpenbaoyang (id) { // 查看 维修 baoxiudan维修详情是否有报修单模块
      context.http.get(`cms/api/repair-records/${id}`).then(res => {
        this.repairDetailsData = res.data
        this.baoyangShow = true
      }).catch(error => {
        console.info(error)
      })
    },
    baoxiuClose () {
      this.baoxiuShow = false
    },
    weixiuClose () {
      this.weixiuShow = false
    },
    baoyangClose () {
      this.baoyangShow = false
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
    deCurrentSel () {
      this.detailsPager.currentPage = 1
      this.firecontrolDetails(this.reportId)
    },
    deCurrent_change (currentPage) {
      this.detailsPager.currentPage = currentPage
      this.firecontrolDetails(this.reportId)
    },
    energyDataDetailCLose () {
      this.detailsPager.currentPage = 1
      this.energyDataDetailShow = false
    },
    firecontrolDetails (reportId) { // 查看消防报告详情
      this.reportId = reportId
      context.http.get(`cms/api/fcReports/${this.reportId}`).then(res => {
        this.detailData = res.data
        context.http.get(`cms/api/fcReports/${this.reportId}/details`, {
          page: (this.detailsPager.currentPage - 1),
          size: this.detailsPager.pgSize
        }).then(result => {
          this.energyDataDetailShow = true
          this.fcReDetails = result.data
          this.detailsPager.total = Number(result.headers['x-total-count'])
        }).catch(error => {
          console.info(error)
        })
      }).catch(error => {
        console.info(error)
      })
    },
    updateTenantList (list) {
      this.tenantList = list
    },
    async handleEdit (index, row) { // 查看
      let result = await context.http.get(`cms/api/equirements/${row.id}`)
      this.equirementId = row.id
      this.flowDetailsData = result.data
      if (!this.flowDetailsData.tenant) {
        this.flowDetailsData.tenant = { id: null }
      }
      this.detailsdrawershow = true
    },
    async repairRecordNum () {
      let repairRdNum = await context.user.repairRecordNum(this.queryParams.projectValue)
      this.repairRdNum = repairRdNum.data
    },
    queryseach () {
      this.currentPage = 1
      this.repairRecordNum()
      this.query()
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    handleChange (value) { // 设备类型二级联选择器
      this.queryParams.equirementType = value[value.length - 1]
      this.queryseach()
      // console.log(this.queryParams.equirementType)
    },
    changeUseStatusBatch (status) { // 批量启用停用
      if (this.multipleSelection.length === 0) {
        this.$notify.warning({
          title: '警告',
          duration: '2000',
          message: '请勾选设备'
        })
        return
      }
      let ids = []
      this.multipleSelection.forEach(item => {
        ids.push(item.id)
      })
      ids = ids.join(',')
      context.http.put(`cms/api/equirements/useStatus?ids=${ids}&useStatus=${status}`).then(res => {
        this.$message({
          type: 'success',
          message: '批量操作成功'
        })
        this.query()
      }).catch(error => {
        console.info(error)
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    useStatusChange (index, row, status) {
      context.http.put(`cms/api/equirements/useStatus?ids=${row.id}&useStatus=${status}`).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.query()
      }).catch(error => {
        console.info(error)
      })
    },
    async imageChange (event) {
      let files = event.target.files
      let form = new FormData()
      form.append('file', files[0])
      let name = files[0].name
      let index = name.lastIndexOf('.')
      let type = name.substr(index + 1).toLowerCase()
      if (files[0].size > (1024 * 1024 * 20)) {
        this.$message({
          message: '文件大小不能超过20M',
          type: 'error'
        })
        return
      }
      if (index > 0 && type !== 'xlsx' && type !== 'xls') {
        this.$message({
          message: '格式错误，请上传xlsx、xls格式文件',
          type: 'error'
        })
      } else {
        context.http.post('/cms/api/equriment-excel/file', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          // this.$message({
          //   message: '上传成功！',
          //   type: 'success'
          // })
          event.target.value = ''
          this.queryExportResult(res.data.id)
        }).catch(error => {
          event.target.value = ''
          console.info(error)
        })
      }
    },
    queryExportResult (id) {
      const loading = this.$loading({
        lock: true,
        text: '导入中',
        spinner: 'el-icon-loading el-import-loading',
        customClass: 'loading-icon',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      context.http.get(`/cms/api/equriment-excel/detail?excelId=${id}`).then(res => {
        if (res.data.excelResult === '审核中') {
          setTimeout(res => {
            this.queryExportResult(id)
          }, 5000)
        } else if (res.data.excelResult === '失败') {
          this.errorPrompt = true
          this.gridData = [{
            fileName: res.data.name,
            result: res.data.remark,
            id: res.data.id
          }]
          console.log(this.gridData)
          loading.close()
        } else {
          this.$message({
            message: '导入成功！',
            type: 'success'
          })
          this.query()
          loading.close()
          // this.query()
        }
      })
    },
    async downLoadModel1 (index, row) { // 下载错误文件
      axios({ method: 'GET', url: `/cms/api/equriment-excel/upload?excelId=${row.id}`, responseType: 'blob' }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        let fileName = res.headers['content-disposition'].substring(20)
        fileName = decodeURI(fileName)
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(url)
      })
    },
    async downLoadModel () { // 下载模板
      // let id = this.queryParams.equirementType
      axios({ method: 'GET', url: `/cms/api/equriment-excel/file?typeId=1`, responseType: 'blob' }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        let fileName = res.headers['content-disposition'].substring(20)
        fileName = decodeURI(fileName)
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(url)
      })
    },
    async query () {
      let result = await context.http.get('cms/api/equirements?bol=false', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'id,desc',
        projectManagementId: this.queryParams.projectValue,
        equirementTypeChildId: this.queryParams.equirementType,
        name: this.queryParams.name,
        useStatus: this.queryParams.useStatus
      })
      this.tableData = JSOG.decode(result.data)
      this.total = Number(result.headers['x-total-count'])
      this.totalPages = Math.ceil(this.total / this.pgSize)
    },
    projectManagementsChange () { // 项目改变
      this.queryseach()
      // this.repairRecordNum()
    },
    formatLastModifiedDate (row, column) {
      return row.updateTime.replace('T', ' ').replace('Z', ' ')
    },
    async getEquirementTypes () { // 请求设备大小类
      let result = await context.http.get('/cms/api/equirementTypes/tree?bol=true')
      this.equirementTypes = result.data
      this.equirementTypes.forEach((element, index) => {
        this.cascaderList.push({ value: element.id, label: element.name, children: [] })
        element.child.forEach(item => {
          this.cascaderList[index].children.push({ value: item.id, label: item.name })
        })
      })
      this.equirementTypeIds = this.$route.params.equipmentType ? this.$route.params.equipmentType : []
      if (this.equirementTypeIds.length) {
        this.handleChange(this.equirementTypeIds)
      }
    },
    repairRecordModelclose () {
      this.repairRecordModelshow = false
    },
    repairRecordUpdate (deviceInfo) {
      this.repairRecord('', deviceInfo)
    },
    repairRecord (index, row) { // 维修记录
      this.deviceInfo = row
      context.http.get(`/cms/api/equirements/${row.id}/repair-records`).then(res => {
        this.repairRecordList = res.data
        this.repairRecordModelshow = true
      }).catch(error => {
        console.info(error)
      })
    },
    roterTo (name, isestate) {
      if (name === 'repairManagement1') {
        sessionStorage.setItem('isestate', true)
        this.$router.push({ name: name, params: { projectManagementId: this.queryParams.projectValue } }) // isestate 是否是物业模块报修列表
      } else {
        this.$router.push({ name: name, params: { projectManagementId: this.queryParams.projectValue, equipmentType: this.equirementTypeIds } })
      }
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
      // return true
    },
    drawerClose () {
      this.detailsdrawershow = false
    },
    dialogHide () {
      this.adddialogVisible = false
    },
    formatBillType (val) {
      return val === 'R' ? '收款' : '付款'
    },
    formatBillStatus (row, column) {
      let res = '-'
      if (row.useStatus === 'USING') {
        res = '在用'
      } else if (row.useStatus === 'DISABLE') {
        res = '停用'
      }
      return res
    },
    async newPipeline () {
      this.addEquipmentShow = true
    },
    formatStatus () {
    },
    addFlow () {
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    goCharts (index, row) {
      this.$router.push({ path: '/home/charts', query: { buildingId: row.id } })
    },
    getformat (str) { // 获取文件格式
      let i = str.lastIndexOf('.')
      if (i > -1) {
        let str1 = str.slice(i + 1).toLowerCase()
        switch (str1) {
          case 'pdf':
            return '#iconcms_PDF'
          case 'docx':
            return '#iconcms_word'
          case 'doc':
            return '#iconcms_word'
          case 'xlsx':
            return '#iconcms_excel'
          case 'xls':
            return '#iconcms_excel'
          case 'ppt':
            return '#iconcms_ppt'
          case 'pptx':
            return '#iconcms_ppt'
          case 'svg':
            return '#iconcms_shilianggeshi'
          case 'mp4':
            return '#iconcms_shipingeshi'
          case 'rmvb':
            return '#iconcms_shipingeshi'
          case 'mpeg':
            return '#iconcms_shipingeshi'
          case 'avi':
            return '#iconcms_shipingeshi'
          case 'mov':
            return '#iconcms_shipingeshi'
          case 'wmv':
            return '#iconcms_shipingeshi'
          case 'png':
            return '#iconcms_tupiangeshi'
          case 'jpg':
            return '#iconcms_tupiangeshi'
          case 'jpeg':
            return '#iconcms_tupiangeshi'
          case 'rar':
            return '#iconcms_yasuogeshi'
          case 'zip':
            return '#iconcms_yasuogeshi'
          case '7z':
            return '#iconcms_yasuogeshi'
          default:
            return '#iconcms_morenwenjian'
        }
      } else {
        return '#iconcms_morenwenjian'
      }
    }
  }
}
</script>
<style lang="scss">
.deviceLlist {
  &.deviceLlist_new {
    .el-dialog__wrapper.el_dialog_new .el-dialog {
      .annexList {
        width: 100%;
        flex: 1;
        > div {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          border-bottom: 1px solid #eaeaea;
          padding-bottom: 5px;
          i {
            cursor: pointer;
          }
        }
      }
      .deviceDetails {
        width: 100px;
        height: 100px;
        margin-right: 25px !important;
        .oss_file {
          width: 100%;
          height: 100%;
          border: none;
          background-color: rgba(247, 249, 253, 1);
          border: 1px solid rgba(234, 234, 234, 1);
          border-radius: 4px;
          color: #3575f6;
          > i {
            font-size: 20px;
            position: absolute;
            top: -5px;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
          }
          > span {
            position: absolute;
            top: 18px;
            left: 0;
            right: 0;
            font-size: 12px;
          }
          > input {
            right: 0;
            top: 0;
            opacity: 0;
            cursor: pointer;
            width: 100%;
            height: 100%;
            position: absolute;
          }
        }
      }
      .el-dialog__body .dialog_content form.el-form {
        padding: 0;
        .content {
          padding: 15px;
          width: 100%;
        }
      }
      // .el-input__inner {
      //   height: 32px;
      //   line-height: 32px;
      // }
      .el-select {
        width: 100%;
      }
      .el-radio {
        margin-right: 15px;
      }
      .el-dialog__header {
        margin-bottom: 0;
      }
    }

    .ctc-foot {
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
  }
}
.energyDataDetailShow {
  .el-drawer .el-drawer__header {
    margin: 20px 20px 0px 20px;
  }
}
.el-textarea__inner {
  resize: none !important;
}
.el_dialog_new {
  .el-dialog__title {
    font-size: 16px;
  }
}
.firecontrolChart {
  .el-table__header thead tr th {
    background-color: #ffffff;
  }
}
</style>
<style lang="scss" scoped>
.conDetail {
  border: 1px solid #ebebeb;
  .normal {
    color: #49af61;
  }
  .abnormal {
    color: #ff6665;
  }
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
  }
  .el-form {
    display: flex;
    flex-wrap: wrap;
    .el-form-item__content {
      span {
        color: #888;
        font-size: 12px;
      }
    }
    .enclosure-list {
      .el-item {
        > span {
          color: #888;
          font-size: 12px;
        }
      }
    }
  }
  .contract-rules {
    span {
      display: inline-block;
      background-color: #fff;
      color: #0f75ff;
      border: 1px solid #0f75ff;
      cursor: pointer;
      height: 24px;
      line-height: 23px;
      border-radius: 4px;
      font-size: 12px;
      padding: 0 4px;
      float: right;
      margin: 7px 10px 0 0;
      &:hover {
        background-color: #0f75ff;
        color: #fff;
      }
    }
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

  .dc-right_div {
    border: 1px solid #e7e7e7;
    margin-top: 20px;

    .cttitle span:nth-of-type(2) {
      color: #0f75ff;
      font-size: 12px;
      float: right;
      cursor: pointer;
    }

    .psotmaster span {
      color: #666 !important;
    }
  }
}
.device-list {
  font-size: 16px;
  background-color: #f9f9f9;
  .el-button--warning.is-plain {
    color: #e06e30;
    background: #fff;
    border-color: #e06e30;
  }
  .el-button--warning.is-plain:hover {
    color: #fff;
    background: #e06e30;
    border-color: #e06e30;
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

  .pl-content {
    width: 100%;
    margin: 0 auto;
    .search-bar {
      .el-dropdown {
        button {
          padding: 8px 5px;
        }
      }
      .swbtn {
        margin-left: 16px;
        font-size: 18px;
        width: 100px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        font-size: 18px;
        color: #000;
        background-color: #fff;
        margin-left: 16px;
        border-radius: 10px;
        cursor: pointer;
      }
      .btnselect {
        color: #fff;
        background-color: #42506c;
      }
      div {
        cursor: pointer;
      }
    }
    .bd-statistics {
      background-color: #fff;
      margin-bottom: 10px;
      box-shadow: 1px 2px 5px #eee;
      .statistics-title {
        font-size: 14px;
        height: 30px;
        line-height: 30px;
        color: #333;
        font-weight: bold;
        padding-left: 20px;
        border-bottom: 1px solid #ededef;
      }
      .statistics-content {
        .contentItem {
          display: inline-block;
          padding: 20px 0 20px 20px;
        }
        .bd-number {
          margin-left: 6px;
          padding-right: 20px;
          font-size: 14px;
          font-weight: 400;
          font-family: PingFangSC;
          color: #353b4b;
          display: inline-block;
          min-width: 90px;
          .ci-title {
            font-weight: 400;
            height: 25px;
            line-height: 25px;
            color: #828692;
            font-size: 12px;
          }
          .ci-value {
            display: inline-block;
            font-size: 20px;
            margin-top: 4px;
          }
        }
        .borderstrip {
          width: 2px;
          height: 35px;
          background-color: #ecedef;
          display: inline-block;
          margin-top: 6px;
        }
      }
    }
    .plc-table {
      position: relative;
      .stopBtn {
        color: #947f6dff;
        border: 1px solid #947f6dff;
      }
      .useBtn {
        color: #00954dff;
        border: 1px solid #00954dff;
      }
      .export {
        position: absolute;
        right: 20px;
        top: 5px;
        z-index: 9;
        span {
          display: inline-block;
          width: 60px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background: rgba(222, 235, 254, 1);
          color: #5b9af8;
          opacity: 0.9;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
    .rent-control {
      border: 1px solid #96d050;
      background-color: #fff;
      color: #96d050;
      &:hover {
        background-color: #96d050;
        color: #fff;
      }
    }
    .editbtn {
      color: #3175d2;
      &:hover {
        color: #fff;
      }
    }
  }
  .el-dialog {
    width: 900px !important;
    .basicInfo {
      border: 1px solid #f1f1f1;
      margin: 15px 0;
      .bi-title {
        height: 40px;
        background: #fafafa;
        line-height: 40px;
        padding: 0 15px;
        font-size: 14px;
        color: #666666;
      }
    }
  }
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #d9dce2;
  }
  .el-table__row div {
    white-space: nowrap;

    img {
      width: 97px;
      height: 80px;
    }
    .buildingImage {
      width: 120px;
      margin: 0 auto;
    }
  }
  .el_dialog_new {
    .content {
      .main_content {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .item {
          width: 32%;
          // margin-right: 15px;
          // margin-bottom: 22px;
          span {
            color: #787878;
            width: 100%;
            display: inline-block;
            // margin-bottom: 8px;
            height: 35px;
            display: flex;
            align-items: center;
            > .toolTips {
              display: inline-block;
              font-style: normal;
              font-size: 12px;
              padding: 8px 2px;
              background-color: rgba(0, 0, 0, 0.7);
              color: #fff;
              border-radius: 5px;
              margin-left: 15px;
              position: relative;
              white-space: nowrap;
              > .icon {
                width: 0;
                height: 0;
                border-width: 8px;
                border-style: solid;
                border-color: transparent rgba(0, 0, 0, 0.7) transparent
                  transparent;
                position: absolute;
                left: -16px;
                top: 9px;
              }
            }
          }
        }
      }
    }
    .menuTab {
      height: 60px;
      margin-top: 0;
      box-shadow: none;
      border-radius: 0;
      display: flex;
      justify-content: space-between;
      padding: 0 20px;

      > span {
        width: 210px;
        height: 40px;
        line-height: 40px;
        display: inline-block;
        background-color: #f9f9f9;
        border-radius: 5px;
        color: #777;
        text-align: left;
        padding-left: 15px;
        &.active {
          background-color: #4476cc;
          color: #fff;
        }
      }
    }
  }
  .dev-img {
    display: inline-block;
    width: 80px;
    height: 80px;
    border: 1px solid #dadada;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .upload {
    display: inline-block;
    width: 100px;
    vertical-align: top;
    position: relative;
    margin-left: 5px;
    input {
      position: absolute;
      top: 34px;
      left: 0;
      width: 88px;
      height: 34px;
      opacity: 0;
      cursor: pointer;
    }
    .uploadbtn {
      display: inline-block;
      width: 88px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      border: 1px solid #5e72e4;
      border-radius: 8px;
      color: #5e72e4;
      margin: 34px 0 10px 0;
      cursor: pointer;
      .icon-upload {
        background: url(../../../assets/upload.png) no-repeat;
        position: relative;
        top: 2px;
      }
    }
    p {
      font-size: 12px;
    }
  }
  .el-form-item__label {
    width: 80px;
  }
  .el-form-item__error {
    margin-left: 80px;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    // width: 178px!important;
  }
  .dl-warn {
    .el-dialog {
      .el-dialog__header,
      .el-dialog__body {
        border: none;
      }
      .el-dialog__footer {
        padding-top: 20px;
        .el-button {
          width: 100px;
          height: 30px;
          line-height: 0px;
          &:first-child {
            background-color: #a0a0a0;
            color: #fff;
            border-color: #a0a0a0;
          }
          background-color: #3577f6;
          border-color: #3577f6;
        }
      }
    }
    .dl-content {
      text-align: center;
      img {
        width: 60px;
        height: 60px;
        margin-bottom: 10px;
      }
      p {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
