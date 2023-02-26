
<template>
  <div class="tenant-details patrolPollingRecord repairFromdata1 patrolPollingRecord1">
    <drawer :show="show"
            title="巡更巡检详情"
            :showEditBtn="hasAuthority('03050103')&&readOnly&&tabIndex===0"
            @on-edit="onEdit"
            @on-hide="onHide">
      <div class="tenant-details details-content repairDetails_content details_content"
           slot="drawer">
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
        <div v-show="tabIndex===0">
          <div class="main-content collapse_list main_content"
               style="background-color: #fff;margin-top:15px;">
            <el-form :model="recordDetails"
                     ref="recordDetails"
                     :rules="addDataRules">
              <div class="basInfo">
                <p class="title"><span class="vertical"></span>基本信息</p>
                <!-- <span @click="editFn" style="position: absolute; top: -35px; right: 0;">编辑</span> -->
                <div class="content">
                  <div class="form"
                       style="padding: 15px;">
                    <el-form-item prop="projectManagementId">
                      <span>项目简称<i class="required">*</i></span>
                      <p v-if="readOnly">{{recordDetails.projectManagementName}}</p>
                      <el-select v-model="recordDetails.projectManagementId"
                                 disabled
                                 v-else
                                 size="small"
                                 placeholder="请选择">
                        <el-option v-for="item in projectManagementsList"
                                   :key="item.id"
                                   :label="item.referred"
                                   :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item prop="patrolType">
                      <span>类型<i class="required">*</i></span>
                      <p v-if="readOnly">{{patrolTypeFormat(recordDetails.patrolType)}}</p>
                      <el-select v-model="recordDetails.patrolType"
                                 disabled
                                 v-else
                                 size="small">
                        <el-option label="巡更"
                                   value="PATROL"></el-option>
                        <el-option label="巡检"
                                   value="POLLING"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item prop="name">
                      <span>巡更巡检表名称<i class="required">*</i></span>
                      <p v-if="readOnly">{{recordDetails.name}}</p>
                      <el-input v-model="recordDetails.name"
                                v-else
                                size="small"
                                maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item prop="number">
                      <span>频次<i class="required">*</i></span>
                      <p v-if="readOnly">{{numberFormat(recordDetails)}}</p>
                      <div class="frequency"
                           v-else>
                        <el-input v-model="recordDetails.number"
                                  disabled
                                  onkeyup="value=value.replace(/[^0-9]/g,'')"
                                  onpaste="value=value.replace(/[^0-9]/g,'')"
                                  oncontextmenu="value=value.replace(/[^0-9]/g,'')"
                                  size="small"
                                  maxlength="5"></el-input>
                        <el-select v-model="recordDetails.frequencyUnit"
                                   disabled
                                   size="small">
                          <el-option label="次/天"
                                     value="DAY"></el-option>
                          <el-option label="天/次"
                                     value="ONCE"></el-option>
                        </el-select>
                      </div>
                    </el-form-item>
                    <el-form-item prop="number">
                      <span>状态<i class="required">*</i></span>
                      <p v-if="readOnly">{{useStatusFormat(recordDetails.useStatus)}}</p>
                      <el-select v-model="recordDetails.useStatus"
                                 v-else
                                 size="small">
                        <el-option label="使用中"
                                   value="USING"></el-option>
                        <el-option label="已停用"
                                   value="DISABLE"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
              </div>

              <div class="basInfo"
                   v-if="!readOnly">
                <p class="title"><span class="vertical"></span>设备列表</p>
                <div class="queryParams">
                  <el-cascader :options="cascaderList"
                               @change="handleChange"
                               v-model="cascaderVal"
                               placeholder="设备分类"
                               :props="{ checkStrictly: true }"
                               style="width: 200px"></el-cascader>
                  <el-input v-model="queryParams.name"
                            style="width: 200px"
                            placeholder="设备名称"></el-input>
                  <el-input v-model="queryParams.installPosition"
                            style="width: 200px"
                            placeholder="安装位置"></el-input>
                  <div class="query-btn"
                       @click="querySeach">查询</div>
                </div>
                <div class="content">
                  <el-table :data="tableData"
                            class="table tableData"
                            max-height="350px"
                            style="width: 100%"
                            empty-text="请先选择设备分类进行查询">
                    <el-table-column prop="name"
                                     label="设备名称"
                                     align="center"> </el-table-column>
                    <el-table-column prop="code"
                                     label="设备编号"
                                     align="center"> </el-table-column>
                    <el-table-column prop="equirementType.parent.name"
                                     label="设备大类"
                                     align="center"> </el-table-column>
                    <el-table-column prop="installPosition"
                                     label="安装位置"
                                     align="center"> </el-table-column>
                    <el-table-column label="是否需要巡更"
                                     :formatter="onPatrolFormat"
                                     align="center"></el-table-column>
                    <el-table-column :formatter="onMaintainFormat"
                                     label="是否需要巡检"
                                     align="center"></el-table-column>
                    <el-table-column label="操作"
                                     align="center">
                      <template slot-scope="scope">
                        <span class="addequipment"
                              v-if="!scope.row.isAdd"
                              @click="addequipment(scope.$index, scope.row)">添加</span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="ctc-foot"
                       v-if="tableData.length>0">
                    <el-col :span="24">
                      <span class="flex">
                        <el-pagination v-if="total > 0"
                                       background
                                       layout="prev, pager, next"
                                       :page-size="pgSize"
                                       :total="total"
                                       :current-page="currentPage"
                                       @current-change="current_change">
                        </el-pagination>
                      </span>
                    </el-col>
                  </div>
                </div>
              </div>
              <div class="basInfo">
                <p class="title">
                  <span class="vertical"></span>
                  <span v-if="!readOnly">已选中设备{{multipleSelection.length}}项</span>
                  <span v-else>巡更&巡检设备{{multipleSelection.length}}项</span>
                </p>
                <div class="content">
                  <el-table :data="multipleSelection"
                            class="table tableData"
                            max-height="350px"
                            style="width: 100%">
                    <el-table-column prop="name"
                                     label="设备名称"
                                     align="center"> </el-table-column>
                    <el-table-column prop="code"
                                     label="设备编号"
                                     align="center"> </el-table-column>
                    <el-table-column prop="equirementType.parent.name"
                                     label="设备大类"
                                     align="center"> </el-table-column>
                    <el-table-column prop="installPosition"
                                     label="安装位置"
                                     align="center"> </el-table-column>
                    <el-table-column label="是否需要巡更"
                                     :formatter="onPatrolFormat"
                                     align="center"></el-table-column>
                    <el-table-column :formatter="onMaintainFormat"
                                     label="是否需要巡检"
                                     align="center"></el-table-column>
                    <el-table-column label="操作"
                                     v-if="!readOnly"
                                     align="center">
                      <template slot-scope="scope">
                        <span class="addequipment"
                              v-if="scope.row.isAdd"
                              @click="delequipment(scope.$index, scope.row)">删除</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-form>
          </div>
        </div>
        <div v-show="tabIndex===1">
          <div class="main-content collapse_list"
               style="background-color: #fff;margin-top:15px;">
            <div class="content">
              <p class="title"
                 style="justify-content: space-between;">
                <i></i>
                <span>巡更巡检记录</span>

                <el-button class="tban tban1"
                           @click="addRepFn"
                           v-if="hasAuthority('03050105') && recordDetails.useStatus ==='USING'"><span class="iconfont icon-crm_xinzeng-"
                        style="position: relative;"></span> 新增记录</el-button>
              </p>
              <div class="table">
                <el-table :data="recordTableData"
                          style="width: 100%">
                  <el-table-column prop="totalNum"
                                   label="巡更&巡检设备数"
                                   align="center"></el-table-column>
                  <el-table-column :formatter="errorNumFormat"
                                   label="异常设备数"
                                   align="center"></el-table-column>
                  <el-table-column prop="person"
                                   label="责任人"
                                   align="center"></el-table-column>
                  <el-table-column :formatter="formatTime"
                                   label="实际完成时间"
                                   align="center"></el-table-column>
                  <el-table-column label="操作"
                                   align="center"
                                   >
                    <template slot-scope="scope">
                      <span class="operation-btn"
                            @click="handleEdit(scope.$index, scope.row)">查看</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="ctc-foot"
                   style="padding-top: 30px">
                <span><span style="margin-right:10px">{{RCcurrentPage}}/{{Math.ceil(rdTotal/pgSize)}}页</span> 共{{rdTotal}}条记录</span>
                <el-pagination v-if="rdTotal > 0"
                               background
                               layout="prev, pager, next"
                               :page-size=pgSize
                               :total="rdTotal"
                               :current-page.sync="RCcurrentPage"
                               @current-change="current_change2">
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
          </div>
        </div>
      </div>

      <div slot="footer"
           v-if="!readOnly && tabIndex===0"
           class="dialog-footer">
        <el-button @click="onHide1"
                   class="close-button">取消</el-button>
        <el-button type="primary"
                   class="defaultbtn dialog-confirmBtn"
                   @click="editFrom('recordDetails')">确定</el-button>
      </div>
    </drawer>
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>

    <!-- 新增巡更巡检记录-->
    <el-dialog class="addRep"
               title="新增巡更巡检记录"
               :visible.sync="detailsShow"
               @close="drawerClose">
      <addRecord @query="querySeachRecord"
                 ref="addRecord"
                 :detailsShow="detailsShow"
                 :patrolInspection="patrolInspection"
                 @drawerClose="addRecordClose" />
    </el-dialog>
    <!-- 巡更巡检记录 -->
    <patrol-polling-record-d :show="recordShow"
                             :recordDetails="recordDetailsD"
                             @close="recordClose" />
  </div>
</template>
<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import ailPreview from '@/components/ailPreview.vue'
import addRecord from './addRecord' // 巡更巡检记录
import patrolPollingRecordD from './patrolPollingRecordD' // 巡更巡检记录
export default {
  components: {
    Drawer,
    aliDownLoad,
    ailPreview,
    picturePrevie,
    addRecord,
    patrolPollingRecordD
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    recordDetails: {
      type: Object,
      default: {

      }
    }
  },
  watch: {
    show: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.changeNav(0)
          this.queryRecord()
          this.query()
          this.recordDetails.equirements.forEach((item, index) => {
            item.isAdd = true
          })
          this.multipleSelection = this.recordDetails.equirements

          this.patrolInspection.projectManagementId = this.recordDetails.projectManagementId
          this.patrolInspection.projectManagementName = this.recordDetails.projectManagementName
          this.patrolInspection.id = this.recordDetails.id
          this.patrolInspection.name = this.recordDetails.name
          this.patrolInspection.equirements = this.recordDetails.equirements
        }
      },
      immediate: true
    },
    recordDetails: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.patrolInspection.name = this.recordDetails.name
        }
      }
    }
  },
  created () {
    this.projectManagementsList = this.$store.state.projectManagementsList
  },
  mounted () {
  },
  data () {
    return {
      cascaderVal: [],
      readOnly: true,
      recordShow: false,
      detailsShow: false,
      imgArr: [],
      num: 0,
      showPicture: false,
      RCcurrentPage: 1,
      currentPage: 1,
      pgSize: 15,
      total: 0,
      rdTotal: 0,
      navList: [
        {
          label: '巡更巡检表',
          value: true
        }, {
          label: '巡更巡检记录',
          value: false
        }
      ],
      tabIndex: 0,
      recordTableData: [],
      tableData: [],
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
      projectManagementsList: [],
      recordDetailsD: {},
      addDataRules: {
        patrolType: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入巡更巡检表名称', trigger: 'change' }
        ],
        number: [
          { required: true, message: '请输入频次', trigger: 'change' }
        ]
      },
      cascaderList: [], // 设备类型二级联选择器
      queryParams: { // 条件查询入参
        equirementType: '',
        name: '',
        installPosition: ''
      },
      patrolInspection: {}
    }
  },
  methods: {
    useStatusFormat (useStatus) {
      if (useStatus === 'USING') {
        return '使用中'
      } else if (useStatus === 'DISABLE') {
        return '已停用'
      }
    },
    recordClose () {
      this.recordShow = false
    },
    addRepFn () {
      this.detailsShow = true
    },
    querySeach () {
      this.currentPage = 1
      this.query()
      // this.repairRecordNum()
    },
    querySeachRecord () {
      this.RCcurrentPage = 1
      this.queryRecord()
    },
    addRecordClose () {
      this.detailsShow = false
    },
    drawerClose () {
      this.$refs.addRecord.onHide_parent()
      this.detailsShow = false
    },
    errorNumFormat (row, column) {
      return row.errorNum || '0'
    },
    formatTime (row, column) {
      return row.completeTime && row.completeTime.replace('T', '   ')
    },
    onPatrolFormat (row, column) {
      if (row.onPatrol) {
        return '是'
      } else {
        return '否'
      }
    },
    onMaintainFormat (row, column) {
      if (row.onMaintain) {
        return '是'
      } else {
        return '否'
      }
    },
    numberFormat1 (row, column) {
      if (row.frequencyUnit === 'ONCE') {
        return row.patrolInspection.number + '天/次'
      } else if (row.frequencyUnit === 'DAY') {
        return row.number + '次/天'
      }
    },
    patrolTypeFormat1 (row, column) {
      if (row.patrolType === 'PATROL') {
        return '巡更'
      } else if (row.patrolType === 'POLLING') {
        return '巡检'
      }
    },
    changeNav (inx) {
      this.navList.forEach(item => {
        item.value = false
      })
      this.navList[inx].value = true
      if (inx === 0) {
        this.tabIndex = inx
      } else if (inx === 1) {
        this.tabIndex = inx
      } else if (inx === 2) {
        this.tabIndex = inx
        this.getAnnexesList('btn')
      }
    },
    getAnnexesList () { },
    patrolTypeFormat (patrolType) {
      if (patrolType === 'PATROL') {
        return '巡更'
      } else if (patrolType === 'POLLING') {
        return '巡检'
      }
    },
    numberFormat (row) {
      if (row.frequencyUnit === 'ONCE') {
        return row.number + '天/次'
      } else if (row.frequencyUnit === 'DAY') {
        return row.number + '次/天'
      }
    },
    async queryRecord () { // 根据筛选条件查询报修单列表（分页）
      let param = {
        page: (this.RCcurrentPage - 1),
        size: this.pgSize,
        projectManagementId: this.recordDetails.projectManagementId,
        name: '',
        patrolType: '',
        startTime: '',
        endTime: '',
        patrolInspectionId: this.recordDetails.id,
        sort: 'completeTime,desc'
      }
      let result = await context.http.get('/cms/api/patrolInspectionRecord', param)
      this.recordTableData = result.data
      // this.patrolInspection = result.data.patrolInspection
      this.rdTotal = Number(result.headers['x-total-count'])
    },
    async query () {
      let result = await context.http.get('cms/api/patrolInspection/equirement', {
        // page: (this.currentPage - 1),
        // size: this.pgSize,
        sort: 'id,desc',
        projectManagementId: this.recordDetails.projectManagementId,
        equirementTypeId: this.queryParams.equirementType,
        patrolType: this.recordDetails.patrolType,
        name: this.queryParams.name,
        installPosition: this.queryParams.installPosition
      })
      result.data = JSOG.decode(result.data)
      result.data.forEach((item, index) => {
        item.isAdd = false
        this.multipleSelection.forEach((itm, idx) => {
          if (item.id === itm.id) {
            item.isAdd = true
          }
        })
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      this.totalPages = Math.ceil(this.total / this.pgSize)
    },
    setFile (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    pictureClose () {
      this.showPicture = false
    },
    showImg (item, index) {
      let imgArr = []
      this.repairDetailsData.imageUrls.forEach(item => {
        imgArr.push(item)
      })
      this.imgArr = imgArr
      this.num = index
      this.showPicture = true
    },
    current_change (currentPage) { // 切换页码
      this.currentPage = currentPage
      this.query()
    },
    currentSel () {
      this.RCcurrentPage = 1
      this.queryRecord()
    },
    current_change2 (currentPage) {
      this.RCcurrentPage = currentPage
      this.queryRecord()
    },
    onHide () {
      this.multipleSelection = []
      this.tableData = []
      this.RCcurrentPage = 1
      this.rdTotal = 1
      this.currentPage = 1
      this.total = 1
      this.readOnly = true
      this.queryParams = { // 条件查询入参
        equirementType: '',
        name: '',
        installPosition: ''
      }
      this.$refs['recordDetails'].resetFields()
      this.$emit('close', false)
    },
    onHide1 () {
      this.readOnly = true
      this.$emit('handleEdit', 0, this.recordDetails)
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
      // return true
    },
    handleChange (value) { // 设备类型二级联选择器
      this.queryParams.equirementType = value[value.length - 1]
      console.log(this.queryParams.equirementType)
    },
    async handleEdit (index, row) {
      context.http.get(`/cms/api/patrolInspectionRecord/${row.id}`).then(res => {
        this.recordDetailsD = res.data
        this.recordShow = true
      })
    },
    addequipment (index, row) {
      row.isAdd = true
      this.multipleSelection.push(row)
      console.log(this.multipleSelection)
      this.$forceUpdate()
    },
    delequipment (index, row) {
      let id = row.id
      this.tableData.forEach((itm, idx) => {
        if (itm.id === id) {
          itm.isAdd = false
        }
      })
      this.multipleSelection.splice(index, 1)
      this.$forceUpdate()
    },
    onEdit () {
      this.readOnly = false
      this.getEquirementTypes()
    },
    async getEquirementTypes () { // 请求设备大小类
      this.cascaderList = []
      let result = await context.http.get('/cms/api/equirementTypes/tree')
      this.equirementTypes = result.data
      this.equirementTypes.forEach((element, index) => {
        this.cascaderList.push({ value: element.id, label: element.name, children: [] })
        element.child.forEach(item => {
          this.cascaderList[index].children.push({ value: item.id, label: item.name })
        })
      })
      this.cascaderVal = [result.data[0].id]
      // this.handleChange(this.cascaderVal)
      this.queryParams.equirementType = result.data[0].id
      this.query()
    },
    editFrom (formName) { // 编辑巡更巡检表
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.multipleSelection.length) {
            this.recordDetails.equirementIds = this.multipleSelection.map((item, index) => {
              return item.id
            })
            delete this.recordDetails.equirements
            context.http.put('/cms/api/patrolInspection', this.recordDetails).then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
                this.onHide1()
                this.$emit('query')
              }
            })
          } else {
            this.$message.error('请选择设备')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" >
.patrolPollingRecord1 {
  .wrap {
    height: calc(100% - 56px) !important;
    min-height: auto !important;
    background-color: #f7f7f7 !important;
  }
  .dialog-footer {
    margin-top: 0;
    margin-right: 0;
    height: 56px;
    line-height: 56px;
    background-color: #fff;
    padding-right: 20px;
  }
  .dweditbtn {
    top: 18px !important;
    right: 20px !important;
    line-height: normal;
  }
  .tableData {
    .el-table__body-wrapper {
      &::-webkit-scrollbar {
        width: 4px !important;
        height: 4px !important;
      }

      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px #fff;
        background-color: #fff;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 6px #cccccc;
      }
    }
  }
  .el-input__inner {
    height: 32px;
  }
  .el-input__icon {
    line-height: 32px;
  }
  .ctc-foot {
    padding: 20px 20px 30px 20px;
  }
  .el-form-item {
    .frequency {
      display: flex;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      .el-input {
        width: 65%;
      }
      .el-select {
        width: 35% !important;
        .el-input {
          width: 100%;
        }
      }
      .el-input__inner {
        border: none !important;
      }
    }
  }
  .textarea {
    border: none;
  }
  .el-select {
    width: 100%;
  }
}
</style>
<style lang="scss" scoped>
.patrolPollingRecord {
  .table {
    .normal {
      color: #49af61;
    }
    .abnormal {
      color: #ff6665;
    }
  }
  .main-content {
    width: 900px;
    .content {
      .upLoadDiv {
        padding-left: 20px;
        > div {
          display: flex;
          flex-wrap: wrap;
          margin: 15px 0;
        }
        .imgList {
          margin-right: 10px;
          margin-bottom: 10px;
          .item {
            width: 150px;
            height: 130px;
            position: relative;
            border: 1px solid #cecdcd;
            &:hover > .bottomTips {
              height: 25px;
            }
            .bottomTips {
              display: inline-block;
              height: 0px;
              position: absolute;
              left: 0px;
              bottom: 0px;
              width: 100%;
              text-align: center;
              background: rgba(38, 38, 38, 0.6);
              line-height: 25px;
              font-size: 12px;
              padding: 0 5px;
              cursor: pointer;
              color: #fefefe;
              text-align: center;
              transition: height 0.5s;
              overflow: hidden;
            }
            img {
              width: 148px;
              height: 128px;
            }
            > div {
              height: 30px;
              line-height: 30px;
              display: flex;
              justify-content: space-between;
              padding: 0 10px;
              align-items: center;
              position: absolute;
              width: 100%;
              left: 0;
              bottom: 0;
              background-color: rgba(255, 255, 255, 0.7);
              > span {
                display: inline-block;
                width: 70%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              > i {
                cursor: pointer;
              }
            }
          }
        }
        .upLoadComponents {
          width: 150px;
          height: 130px;
          border: 1px dashed #d0d0d0ff;
          background: url(../../../../assets/plus.png) no-repeat center;
          .aliUpload {
            .oss_file {
              border: none !important;
              height: 130px;
              width: 100%;
              line-height: 195px;
              color: #3577f6;
            }
          }
        }
      }
      .itemContent {
        padding: 15px 10px;
        display: flex;
        flex-wrap: wrap;
        .item {
          width: 33%;
          min-height: 70px;
          padding-left: 20px;
          > .annexesList {
            display: flex;
            font-size: 14px;
            color: #262626;
            height: 35px;
            line-height: 35px;
            border-bottom: 1px solid #eaeaea;
            > span {
              width: 80%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          > p {
            font-size: 14px;
            margin-bottom: 10px;
            color: #777777;
          }
          > span {
            display: inline-block;
            width: 100%;
            font-size: 14px;
            color: #262626;
          }
        }
      }
    }
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
  .operation-btn {
    cursor: pointer;
    &:hover {
      background-color: #fff !important;
      color: #3175f6 !important;
    }
  }
  .tenant-details {
    .title {
      .tban1 {
        margin-right: 10px;
        border: none;
        &:hover {
          background-color: #fff;
          text-decoration: underline;
        }
      }
    }
  }
  .form {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 30%;
      margin-left: 15px;
      .el-form-item__content {
        > span {
          margin-bottom: 5px;
          display: inline-block;
        }
        > .readOnlyTxt {
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          color: #262626;
        }
        .seachDeviceIcon {
          display: inline-block;
          width: 20px;
          height: 20px;
          background: url(../../../../assets/seachDeviceIcon.png) no-repeat;
          position: absolute;
          right: 10px;
          top: 33px;
          cursor: pointer;
        }
        .el-textarea__inner {
          resize: none !important;
        }
      }
    }
  }
  .dialog-footer {
    background-color: #fff;
  }
  .details_content {
    height: 100%;
    .main_content {
      padding: 0 !important;
      margin: 0;
      width: 900px;
      height: calc(100% - 80px);
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
      }
      .mainInfo {
        height: 60px;
        border: 1px solid #dadada;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        padding: 0 20px;
        justify-content: space-between;
        font-size: 14px;
      }
      .basInfo {
        padding: 10px 0 0 0;
        /* margin-bottom: 20px; */
        .queryParams {
          padding: 10px 0 0 15px;
          .query-btn {
            display: inline-block;
            width: 80px;
            margin: 0;
          }
        }
      }
      .upLoadDiv {
        padding-left: 20px;
        padding-bottom: 20px;
        > div {
          display: flex;
          flex-wrap: wrap;
          margin: 15px 0;
        }
        .imgList {
          margin-right: 10px;
          margin-bottom: 10px;
          .item {
            width: 160px;
            height: 120px;
            position: relative;
            border: none;
            &:hover > .bottomTips {
              height: 25px;
            }
            > i.deleteBtn {
              position: absolute;
              right: -8px;
              top: -8px;
              cursor: pointer;
            }
            .bottomTips {
              display: inline-block;
              height: 0px;
              position: absolute;
              left: 0px;
              bottom: 0px;
              width: 100%;
              text-align: center;
              background: rgba(38, 38, 38, 0.6);
              line-height: 25px;
              font-size: 12px;
              padding: 0 5px;
              cursor: pointer;
              color: #fefefe;
              text-align: center;
              transition: height 0.5s;
              overflow: hidden;
            }
            img {
              width: 160px;
              height: 120px;
            }
            > div {
              height: 30px;
              line-height: 30px;
              display: flex;
              justify-content: space-between;
              padding: 0 10px;
              align-items: center;
              position: absolute;
              width: 100%;
              left: 0;
              bottom: 0;
              background-color: rgba(255, 255, 255, 0.7);
              > span {
                display: inline-block;
                width: 70%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              > i {
                cursor: pointer;
              }
            }
          }
        }
        .upLoadComponents {
          width: 160px;
          height: 120px;
          border: 1px solid #d0d0d0ff;
          position: relative;
          // background: url(../../../../assets/plus.png) no-repeat center;
          > i {
            font-size: 36px;
            color: #3575f6;
            position: absolute;
            top: 30%;
            left: 40%;
          }
          .aliUpload {
            height: 100%;
            background: #f7f9fd;
            .oss_file {
              border: none !important;
              height: 120px !important;
              width: 100%;
              line-height: 195px;
              color: #3577f6;
            }
          }
        }
      }
      .content {
        padding: 15px;
        .addequipment {
          color: #3575f6;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
        .form {
          display: flex;
          flex-wrap: wrap;
          .el-form-item {
            width: 30%;
            margin-left: 15px;
            .el-form-item__content {
              > span {
                margin-bottom: 5px;
                display: inline-block;
              }
              > .readOnlyTxt {
                height: 40px;
                line-height: 40px;
                font-size: 14px;
                color: #262626;
              }
              .seachDeviceIcon {
                display: inline-block;
                width: 20px;
                height: 20px;
                background: url(../../../../assets/seachDeviceIcon.png)
                  no-repeat;
                position: absolute;
                right: 10px;
                top: 33px;
                cursor: pointer;
              }
              .el-textarea__inner {
                resize: none !important;
              }
            }
          }
        }
      }
    }
  }
}
</style>

