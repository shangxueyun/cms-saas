<template>
  <div id="firecontrolEquipment"
       class="firecontrolEquipment">
    <span class="page_head_title">消防系统</span>
    <div class="search-bar">
      <div class="searbar-left">
        <el-select v-model="projectManagementId"
                   @change='currentSel'
                   placeholder="项目">
          <el-option v-for="item in projectManagementsList"
                     :key="item.id"
                     :label="item.referred"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="chartType"
                   @change='currentSel'
                   placeholder="设备小类"
                   clearable>
          <el-option v-for="(item,index) in getEquirementTypes2List"
                     :key="index"
                     :value="item.id"
                     :label="item.name"></el-option>
        </el-select>
      </div>
    </div>
    <ul class="default_tab_block">
      <li @click="roterTo('firecontrolChart')"
          v-if="hasAuthority('03020101')">
        <span>消防平面图</span>
      </li>
      <li class="active"
          v-if="hasAuthority('03020102')">
        <span>设备列表</span>
      </li>
    </ul>
    <div class="search-bar">
      <div style="display: flex;flex-wrap: wrap;align-items:center">
        <el-input v-model="tenName"
                  placeholder="设备名称"
                  style="width:220px"></el-input>
        <el-select v-model="useStatus"
                   placeholder="全部"
                   clearable>
          <el-option label="在用"
                     value="USING"></el-option>
          <el-option label="停用"
                     value="DISABLE"></el-option>
        </el-select>

        <div class="query-btn"
             @click="currentSel">查询</div>
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
    <div class="content">
      <div class="table">
        <el-table :data="tableData"
                  @selection-change="handleSelectionChange"
                  style="width: 100%">
          <el-table-column type="selection"
                           width="55"></el-table-column>
          <el-table-column prop="code"
                           label="设备编号"
                           align="center"></el-table-column>
          <el-table-column prop="name"
                           label="设备名称"
                           align="center"></el-table-column>
          <el-table-column prop="personLiable"
                           label="责任人"
                           align="center"></el-table-column>
          <el-table-column prop="installPosition"
                           label="安装位置"
                           align="center"></el-table-column>
          <el-table-column prop="useStatus"
                           label="设备状态"
                           align="center"
                           :formatter="formatBillStatus"></el-table-column>
          <el-table-column label="更新时间"
                           align="center"
                           :formatter="formatupdateTime"></el-table-column>
          <el-table-column label="操作"
                           v-if="hasAuthority('03040105')||hasAuthority('03040104')"
                           align="center">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.$index, scope.row)"
                         class="el-button--primary operation-btn"
                         plain
                         size="mini"
                         v-if="hasAuthority('03040105')">查看</el-button>
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
    <!-- 设备详情 -->
    <deviceDetails ref="deviceDetails"
                   :detailsdrawershow="devicesDetailsShow"
                   :detailsData="deviceDetailsData"
                   equirementClass="other"
                   :equirementTypes="getEquirementTypes2List"
                   :projectManagementsList="projectManagementsList"
                   :tenantList="tenantList"
                   @emitOpenbaoxiu="emitOpenbaoxiu1"
                   @emitOpenweixiu="emitOpenweixiu1"
                   @emitOpenbaoyang="emitOpenbaoyang"
                   @cannelFn="cannelFn"
                   @drawerClose="deviceDetailsClose" />
    <!-- 重构后保修单 、维修单详情 -->
    <addRepair ref="addRepair"
               :detailsdrawershow="detailsShow1"
               :repairDetails="repairDetails"
               hasAddBtn="none"
               :drawerTitle="drawerTitle"
               @drawerClose="addRepairdrawerClose" />
    <!-- 维修详情、报修单 -->
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
    <!-- 报修单详情 -->
    <baoxiu :detailsdrawershow="baoxiuShow"
            :equirementId="equirementId"
            :repairDetailsData="repairDetailsData"
            @drawerClose="baoxiuClose" />

    <!-- 消防检测报告详情 -->
    <el-drawer title="消防检测报告"
               @close="energyDataDetailCLose"
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
                          prop="yxContractNo">
              <div class="cttitle">创建时间</div>
              <span v-if="detailData.createTime">{{detailData.createTime.replace('T', ' ')}}</span>
            </el-form-item>
            <div style="margin-left: 16px;width:100%">
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
          <div class="dr-head"
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
    <!-- 新增设备组件 -->
    <el-dialog title="新增设备"
               :visible.sync="addEquipmentShow"
               class="el_dialog_new"
               width="750px"
               @close="addEquipmentClose"
               :close-on-click-modal="false">
      <addEquipment :equirementTypes="getEquirementTypes2List"
                    ref="addEquipment"
                    equirementTypeName="消防系统"
                    :equirementChildId="chartType"
                    equirementClass="other"
                    :projectManagementId="projectManagementId"
                    :addEquipmentShow="addEquipmentShow"
                    @refresh="query"
                    @addEquipmentClose="addEquipmentClose" />
    </el-dialog>
    <!-- 设备导入错误提示 -->
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
  </div>
</template>

<script>
import context from '@/service'
import * as JSOG from 'jsog'
import axios from 'axios'
import addEquipment from '../deviceList/components/addEquipment' // 新增设备
import deviceDetails from '../deviceList/components/deviceDetails'
import addRepair from '../../operations/repairManagement/components/addRepair'
import weixiu from '../deviceList/components/weixiu' // 维修详情
import baoyang from '../deviceList/components/baoyang' // 保养详情
import baoxiu from '../deviceList/components/baoxiu' // 保养详情
export default {
  name: 'energy',
  components: {
    addEquipment,
    addRepair,
    weixiu,
    baoyang,
    baoxiu,
    deviceDetails
  },
  data () {
    return {
      multipleSelection: [],
      gridData: [{
        fileName: '',
        result: '',
        id: ''
      }],
      addEquipmentShow: false,
      errorPrompt: false,
      getEquirementTypes2List: [],
      drawerTitle: '报修单详情',
      repairDetails: {},
      detailsShow1: false,
      baoxiuShow: false,
      weixiuShow: false,
      isBaoxiudan: false,
      weixiuTitle: '维修单详情',
      baoyangShow: false,
      baoyangTitle: '保养单详情',
      drawerTitle2: '',
      equirementId: null,
      energyType: '',
      fcReDetails: [],
      detailData: [],
      formLabelWidth: '',
      energyDataDetailShow: false,
      useStatus: 'USING',
      repairDetailsShow: false,
      repairDetailsShow2: false,
      devicesDetailsShow: false,
      tableData: [],
      equipmentType: '',
      tenName: '',
      chartType: '',
      projectManagementsList: [],
      buildingName: '',
      repairDetailsData: {
        img: []
      }, // 维修记录详情1
      projectManagementId: '', // 商圈
      options2: [],
      floorsItem: null,
      svgHtmlShow: false,
      equirementTypeTxt: '',
      currentPage: 1,
      total: 0,
      pgSize: 15,
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
      deviceDetailsData: {
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
      detailsName: '',
      equirementTypes: [], // 设备大小类枚举
      equirementTypesChild: [], // 设备小类
      cascaderList: [], // 设备类型二级联选择器
      tenantList: []
    }
  },
  created () {
    this.projectManagementsList = this.$store.state.projectManagementsList
    this.projectManagementId = this.$route.params.projectManagementId ? this.$route.params.projectManagementId : this.projectManagementsList[0].id
    this.getEquirementTypes2()
    // this.getEquirementTypes()
  },
  mounted () {
  },
  methods: {
    addEquipmentClose () {
      this.$refs.addEquipment.addEquipmentClose(true)
      this.addEquipmentShow = false
    },
    async newPipeline () {
      this.addEquipmentShow = true
    },
    async downLoadModel () { // 下载设备模板
      axios({ method: 'GET', url: '/cms/api/equriment-excel/file?typeId=2', responseType: 'blob' }).then(res => {
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
    async downLoadModel1 (index, row) { // 下载错误文件
      axios({ method: 'GET', url: `/cms/api/equriment-excel/upload?excelId=${row.id}&typeId=2`, responseType: 'blob' }).then(res => {
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
    async imageChange (event) { // 上传设备信息
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
          this.errorType = 'equipment'
          event.target.value = ''
          this.queryExportResult(res.data.id)
        }).catch(error => {
          event.target.value = ''
          console.info(error)
        })
      }
    },
    queryExportResult (id) { // 设备导入错误
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
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    getEquirementTypes2 () {
      context.http.get('/cms/api/equirementTypes/2').then(res => {
        this.getEquirementTypes2List = res.data
        console.log(this.$route.params.equipmentType)
        this.chartType = this.$route.params.equipmentType ? this.$route.params.equipmentType : ''
        this.query()
      })
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
    addRepairdrawerClose () {
      this.detailsShow1 = false
    },
    deviceDetailsClose () {
      this.query()
      this.devicesDetailsShow = false
    },
    async cannelFn (equirementsId) { // 设备id
      let result = await context.http.get(`cms/api/equirements/${equirementsId}`)
      this.equirementId = equirementsId
      this.deviceDetailsData = result.data
      if (!this.deviceDetailsData.tenant) {
        this.deviceDetailsData.tenant = { id: null }
      }
    },
    emitOpenbaoxiu1 (id) {
      context.http.get(`cms/api/repair-forms/${id}`).then(res => { // 报修信息详情repairForms   维保记录详情repairRecords
        this.drawerTitle = '报修单详情'
        this.repairDetails = res.data
        this.detailsShow1 = true
      }).catch(error => {
        console.info(error)
      })
    },
    emitOpenweixiu1 (id) {
      context.http.get(`cms/api/repair-forms/${id}`).then(res => { // 报修信息详情repairForms   维保记录详情repairRecords
        this.drawerTitle = '维修单详情'
        this.repairDetails = res.data
        this.detailsShow1 = true
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
    emitOpenbaoxiu (id) { // 查看报修单信息详情
      context.http.get(`cms/api/repair-forms/${id}`).then(res => { // 报修信息详情repairForms   维保记录详情repairRecords
        this.repairDetailsData = res.data
        this.baoxiuShow = true
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
    getTenantList (id) {
      context.http.get(`cms/api/tenant/projectManagement/${id}`, { size: 10000 }).then(res => { // 根据项目id查所有客户
        this.tenantList = res.data
        this.devicesDetailsShow = true
      }).catch(error => {
        console.info(error)
      })
    },
    async getEquirementTypes () { // 请求设备大小类
      let result = await context.http.get('/cms/api/equirementTypes/tree')
      this.equirementTypes = result.data
      this.equirementTypes.forEach((element, index) => {
        this.cascaderList.push({ value: element.id, label: element.name, children: [] })
        element.child.forEach(item => {
          this.cascaderList[index].children.push({ value: item.id, label: item.name })
        })
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
    repairDetailsClose1 () {
      this.repairDetailsShow2 = false
    },
    repairDetailsClose () {
      this.repairDetailsShow = false
    },
    showRepairDetails (id) { // 查看维修记录详情
      context.http.get(`cms/api/repair-records/${id}`).then(res => {
        this.repairDetailsData = res.data
        this.repairDetailsShow2 = true
      }).catch(error => {
        console.info(error)
      })
    },
    showRepairDetails_forms (id) { // 查看维修记录详情
      context.http.get(`cms/api/repair-forms/${id}`).then(res => {
        this.repairDetailsData = res.data
        this.repairDetailsShow = true
      }).catch(error => {
        console.info(error)
      })
    },
    formatreferred (row, column) {
      let tenantName = row.tenant ? row.tenant.referred : '-'
      return tenantName
    },
    formatupdateTime (row, column) {
      return row.updateTime.replace('T', ' ')
    },
    formatinstrumentType (row, column) {
      switch (row.instrumentType) {
        case 'ORDINARY_TABLE':
          return '普通表'
        case 'PUBLIC_TABLE':
          return '公共表'
        case 'SUMMARY_TABLE':
          return '总表'
        default:
          return '-'
      }
    },
    query () {
      context.http.get('/cms/api/equirements', {
        projectManagementId: this.projectManagementId,
        equirementTypeId: 2,
        equirementTypeChildId: this.chartType,
        name: this.tenName,
        useStatus: this.useStatus,
        sort: 'lastModifiedDate,desc',
        page: (this.currentPage - 1),
        size: this.pgSize
      }).then(res => {
        this.tableData = JSOG.decode(res.data)
        this.total = Number(res.headers['x-total-count'])
      })
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    async handleEdit (index, row) { // 查看
      this.equirementId = row.id
      this.showDevicesDetails(row.id)
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    devicesDetailsClose () {
      // this.detailsShow = false
      this.devicesDetailsShow = false
    },
    showDevicesDetails (id) { // 查看设备详情
      context.http.get(`cms/api/equirements/${id}`).then(res => {
        this.deviceDetailsData = res.data
        this.equirementId = res.data.id
        this.getTenantList(this.projectManagementId)
      }).catch(error => {
        console.info(error)
      })
    },
    roterTo (name, isestate) {
      this.$router.push({ name: name, params: { projectManagementId: this.projectManagementId, equipmentType: this.chartType } })
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    handleClose () {
      this.dialogFromIsShow = false
    }
  }
}
</script>
<style lang="scss">
.firecontrolEquipment {
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
  .energyDataDetailShow {
    .el-drawer .el-drawer__header {
      margin: 20px 20px 0px 20px;
    }
  }
  .firecontrolChart {
    .el-table__header thead tr th {
      background-color: #ffffff;
    }
  }
}
</style>
<style lang="scss" scoped>
.firecontrolEquipment {
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
    .morebtn1 {
      border: 1px solid #f3af2c;
      color: #f3af2c;
      height: 30px;
      width: 140px;
      margin-left: 10px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      .icon-daochu {
        display: block;
        width: 16px;
        height: 16px;
        margin-right: 4px;
        background: url(../../../assets/daochu1.png) no-repeat;
        background-size: contain;
        margin-right: 4px;
      }
      span {
        display: block;
        line-height: 30px;
      }
      .el-icon-caret-bottom {
        display: block;
        width: 16px;
        height: 30px;
        line-height: 30px;
        font-size: 18px;
        margin-left: 2px;
      }
    }
  }
}

svg polygon.bind,
svg path.bind,
svg rect.bind {
  stroke-width: "2px" !important;
  stroke: "#00ff00" !important;
  fill: "rgba(0,0,0,0.2)" !important;
}
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
.energySystem {
  .query-btn {
    display: inline-block;
  }
}
.seachDiv {
  height: 80px;
  background-color: #ffffff;
  margin-top: 15px;
  border-radius: 5px;
  box-shadow: 4px 4px 4px 1px #eee;
  display: flex;
  align-items: center;
  padding-left: 20px;
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
  #svgDiv {
    height: 750px;
    position: relative;
  }
  #svgDiv > span {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    display: inline-block;
  }
  .noData {
    background-color: rgba(0, 0, 0, 0.5);
    color: #ffffff;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 150px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-radius: 5px;
  }
}
svg {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
svg path:hover {
  fill: #000;
  fill-opacity: 0.1;
}
svg polygon:hover {
  fill: #000;
  fill-opacity: 0.1;
}
svg rect:hover {
  fill: #000;
  fill-opacity: 0.1;
}
.upload {
  position: relative;
  display: inline-block;
  border-radius: 2px;
  cursor: pointer;
  margin-left: 20px;
  input {
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}
</style>
<style>
#projectId .el-dialog__body {
  border-bottom: none;
  padding: 25px 25px 30px !important;
}
</style>

