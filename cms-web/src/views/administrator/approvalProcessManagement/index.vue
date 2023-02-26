<template>
  <div class="approvalProcess-manage">
    <span class="page_head_title">审批流程配置</span>
    <div class="search-bar">
      <div>
        <!-- <el-select v-model="projectManagementId"
                   style="width:200px"
                   clearable
                   placeholder="项目简称">
          <el-option v-for="item in options2"
                     :key="item.id"
                     :label="item.referred"
                     :value="item.id">
          </el-option>
        </el-select> -->
        <el-cascader :options="organizationOptions1"
                      change-on-select
                      clearable
                      style="width:200px;margin-right:15px"
                      expand-trigger="hover"
                      v-model="organizeId"
                      @change="handleChange1(organizeId)">
        </el-cascader>
        <el-select v-model="approvalType"
                   filterable
                   style="width:200px"
                   clearable
                   placeholder="审批类型">
          <el-option v-for="item in approvalTypeOptions"
                     :key="item.id"
                     :label="item.value"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="useStatus"
                  placeholder="请选择"
                  style="width:100px"
                  size="small">
          <el-option v-for="item in statusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
          </el-option>
        </el-select>
        <div class="query-btn"
             @click="queryHandler">查询</div>
      </div>
      <router-link to="/home/addProcess">
        <el-button class="tban tban1"
                   v-if="hasAuthority('01020501')"><i class="iconfont icon-crm_xinzeng-"></i> 新增审批流程</el-button>
      </router-link>
    </div>
    <!-- <div class="ctc-search">
      <el-checkbox-group v-model="checkList"
                         @change="bindCheckBox">
        <el-checkbox label="USING">使用中</el-checkbox>
        <el-checkbox label="DISABLE">已停用</el-checkbox>
        <el-checkbox label="">全部</el-checkbox>
      </el-checkbox-group>
    </div> -->
    <div class="ct-content">
      <div class="ctc-table">
        <el-table :data="tableData"
                  style="width: 100%"
                  @sort-change="sortChange">
          <el-table-column prop="organizeName"
                           label="组织"
                           align="center"
                           sortable="custom">
          </el-table-column>
          <el-table-column prop="typeCn"
                           label="审批类型"
                           align="center"
                           sortable="custom">
          </el-table-column>
          <el-table-column prop="name"
                           label="审批流程名称"
                           align="center">
          </el-table-column>
          <el-table-column prop="processVersion"
                           label="流程编号"
                           align="center">
          </el-table-column>
          <el-table-column :formatter="formatTime"
                           label="创建时间"
                           align="center">
          </el-table-column>
          <el-table-column prop="useStatus"
                           :formatter="formatUseStatus"
                           label="状态"
                           align="center">
          </el-table-column>
          <el-table-column label="操作"
                           v-if="hasAuthority('01020502')"
                           align="center"
                           width="180px">
            <template slot-scope="scope"
                      v-if="scope.row.roleName !== 'ADMIN'">
              <el-button class="el-button--primary operation-btn"
                         size="mini"
                         @click="handleEdit(scope.$index, scope.row)">查看</el-button>
              <el-button class="el-button-stop"
                         v-if="scope.row.useStatus === 'USING'"
                         size="mini"
                         @click="changeUseStatus(scope.$index, scope.row, 'DISABLE')">停用</el-button>
              <el-button class="el-button--primary el-button--start"
                         v-else
                         size="mini"
                         @click="changeUseStatus(scope.$index, scope.row, 'USING')">启用</el-button>
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
  </div>
</template>
<script>
import context from '@/service'
window.repeatCode = false
window.isBack = false
export default {
  name: 'approvalProcessManage',
  components: {
  },
  data () {
    return {
      sort: 'id,desc',
      projectManagementId: '',
      checkList: ['USING'],
      existingAuthority: [],
      addreadOnly: false,
      readOnly: true,
      drawerShow: false,
      jurisdictionShow: false,
      configureRole: {},
      organizesOptions: [],
      options2: [],
      options1: [],
      value: '',
      roleName: '',
      stateOptions: [
        {
          value: 'USING',
          label: '使用中'
        },
        {
          value: 'DISABLE',
          label: '停用'
        }
      ],
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
      tableData: [],
      currentPage: 1,
      total: 0,
      pgSize: 15,
      formLabelWidth: '120px',
      dialogVisible: false,
      create: {
        organizeCode: '',
        roleName: ''
      },
      detailsData: {},
      repeatCode: false,
      dataLength: 0,
      roleData: [],
      approvalType: '',
      organizationOptions1: [], // 组织树
      organizeId: '',
      statusOptions: [
        {
          value: 'USING',
          label: '使用中'
        },
        {
          value: 'DISABLE',
          label: '已停用'
        },
        {
          value: '',
          label: '全部'
        }
      ],
      useStatus: 'USING',
      approvalTypeOptions: []
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'addProcess') {
      isBack = true
    } else {
      isBack = false
    }
    next()
  },
  created () {
    this.options2 = JSON.parse(JSON.stringify(this.$store.state.projectManagementsList))
    // this.options2.unshift({ id: '', referred: '请选择项目' })
    if (isBack) {
      this.getParamsSession()
    }
    // this.getApprovalType()
    this.getOrganization1()
    this.handleChange1([])
  },
  mounted () {
    this.query()
    // this.queryOrganization()
  },
  beforeDestroy () {
    this.setParamsSession()
    console.log('beforeDestroy')
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    async handleChange1 (organizeId) {
      let result = await context.http.get('cms/api/process-defines/processType?flag=false', { organizeId: organizeId[organizeId.length - 1] })
      this.approvalTypeOptions = result.data
    },
    sortChange (column, prop, order) {
      if (column.prop === 'organizeId') {
        if (this.sort !== 'organizeId,desc') {
          this.sort = 'organizeId,desc'
        } else {
          this.sort = 'id,desc'
        }
      } else {
        if (this.sort !== 'processType,desc') {
          this.sort = 'processType,desc'
        } else {
          this.sort = 'id,desc'
        }
      }
      this.query()
    },
    bindCheckBox (value) {
      this.checkList = []
      this.checkList.push(value[1])
      this.currentPage = 1
      this.query()
    },
    queryHandler () {
      this.currentPage = 1
      this.query()
    },
    async getOrganization1 () { // 集团人士账号树
      let result = await context.http.get('uaa/api/organizes/tree', { postFlg: false })
      let organizationOptions1 = result.data.organizeTree
      let cascaderData = []
      organizationOptions1.forEach(item => {
        cascaderData.push(this.parseOrganize(item))
      })
      this.organizationOptions1 = cascaderData
    },
    parseOrganize (organizeTree) {
      if (organizeTree.leaf) {
        return { value: organizeTree.data.id, label: organizeTree.data.name }
      } else {
        return {
          value: organizeTree.data.id,
          label: organizeTree.data.name,
          children: organizeTree.children.map(item => {
            return this.parseOrganize(item)
          })
        }
      }
    },
    async getApprovalType () {
      let result = await context.http.get('uaa/api/paramet-managements/name?name=审批类型')
      let options1 = result.data
      // options1.unshift({ id: '', value: '请选择审批类型' })
      this.options1 = options1
    },
    dialogClose () {
      this.dialogVisible = false
    },
    drawerClose () {
      this.drawerShow = false
    },
    permissionClose (data) {
      this.jurisdictionShow = false
    },
    addApprovalProcess () {
      this.$refs.approvalProcess.approvalProcess()
    },
    formatUseStatus (row, column) {
      if (row.useStatus === 'USING') {
        return '使用中'
      } else {
        return '已停用'
      }
    },
    formatTime (row, column) {
      return row.createDateTime.replace('T', ' ')
    },
    formatTime2 (row, column) {
      return row.lastModifiedDate.substring(0, 10)
    },
    setParamsSession () {
      let parms = {}
      parms.checkList = this.checkList
      parms.useStatus = this.useStatus
      parms.projectManagementId = this.projectManagementId
      parms.organizeId = this.organizeId
      parms.approvalType = this.approvalType
      parms.pgSize = this.pgSize
      parms.currentPage = this.currentPage
      sessionStorage.setItem('seachParms', JSON.stringify(parms))
    },
    getParamsSession () {
      let params = JSON.parse(sessionStorage.getItem('seachParms'))
      this.checkList = params.checkList
      this.useStatus = params.useStatus
      this.projectManagementId = params.projectManagementId
      this.organizeId = params.organizeId
      this.pgSize = params.pgSize
      this.currentPage = params.currentPage
      this.approvalType = params.approvalType
    },
    async query () {
      let result = await context.http.get('/cms/api/process-defines'
        , { page: (this.currentPage - 1), size: this.pgSize, sort: this.sort, useStatus: this.useStatus, flag: false, organizeId: this.organizeId[this.organizeId.length - 1], processType: this.approvalType })
      this.tableData = result.data
      this.dataLength = result.data.length
      this.total = Number(result.headers['x-total-count'])
    },
    async handleEdit (index, row) {
      this.$router.push({ name: 'addProcess', query: { processId: row.id } })
    },
    changeUseStatus (index, row, useStatus) {
      context.http.put(`/cms/api/process-defines/${row.id}/status/${useStatus}`).then(res => {
        if (res.data) {
          this.query()
        }
      })
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    currentSel () {
      this.contactStatus = 'TOBECONTACTED'
      this.currentPage = 1
      this.query()
    }
  }
}
</script>
<style lang="scss">
@import "../../../style/config";
.approvalProcess-manage {
  font-size: 16px;
  background-color: #f9f9f9;
  .addbtn {
    margin-top: 0;
    width: 120px;
    position: absolute;
    right: 0;
  }
  .ctc-search {
    height: 60px;
    line-height: 60px;
    background-color: #fff;
    padding-left: 20px;
    margin-bottom: 10px;
    div {
      float: left;
    }
    .cs-smalldiv {
      font-size: 18px;
      margin: 30px 10px 0 18px;
    }
    .el-input {
      width: 15%;
      margin-top: 22px;
    }
    .el-select {
      width: 15%;
      .el-input {
        width: 100%;
      }
    }
    .yubtn {
      width: 196px;
      height: 46px;
      line-height: 46px;
      text-align: center;
      font-size: 14px;
      color: #fff;
      background-color: #5e72e4;
      margin-left: 96px;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 22px;
      &:hover {
        background-color: #3349c8;
      }
    }
  }
  .ct-content {
    width: 100%;
    margin: 0 auto;
    .openbtn {
      background-color: #65ac69 !important;
      border-color: #65ac69 !important;
      &:hover {
        background-color: #00954d !important;
        border-color: #00954d !important;
      }
    }
    .el-button--stop {
      background-color: #fff;
      color: #ac8959;
      border: 1px solid #ac8959;
      &:hover {
        background-color: #ac8959;
        color: #fff;
      }
    }
  }
  .el-cascader {
    width: 100%;
    font-size: 12px;
  }
  .el-dialog__header,
  .el-dialog__body {
    border-bottom: 1px solid #e5e5e5;
    margin: 0 35px;
    padding-left: 0;
    padding-right: 0;
    padding-top: 20px;
  }
  .line {
    display: inline-block;
    width: 36px;
    border-bottom: 1px solid #bbbbbd;
    margin-left: 70px;
    margin-right: 36px;
  }
  .el-dialog {
    width: 700px;
    height: 600px;
  }
  .el-dialog__footer {
    margin-top: 40px;
  }
  .el-form-item__content {
    .el-input {
      font-size: 12px;
      width: 100%;
    }
  }
  .el-button-stop {
    background-color: #fff;
    color: #ac8959;
    border: 1px solid #ac8959;
    &:hover {
      background-color: #ac8959;
      color: #fff;
    }
  }
  .el-button--start {
    background-color: #65ac69 !important;
    border-color: #65ac69 !important;
    &:hover {
      background-color: #009944 !important;
      border-color: #009944 !important;
    }
  }
  .defaultbtn {
    background-color: #3577f6 !important;
    border-color: #3577f6 !important;
    color: #fff;
    &:hover {
      background-color: #3577f6 !important;
      border-color: #3577f6 !important;
    }
  }
  .el-dialog__header {
    padding-left: 0;
  }
  .required {
    color: $color-red-1;
    font-size: 16px;
    position: relative;
    top: 4px;
    left: 1px;
  }
  .newly {
    .province .el-form-item__content {
      margin-left: 8px !important;
    }
    .el-dialog {
      width: 1029px;
      margin-top: 2vh !important;
    }
    .dl-head {
      display: flex;
      justify-content: space-between;
    }
    .step {
      display: inline-block;
      width: 218px;
      height: 50px;
      line-height: 50px;
      padding-left: 14px;
      font-size: 16px;
      background-color: #f9f9f9;
      color: #777;
      border-radius: 6px;
    }
    .stepActive {
      color: #fff;
      background-color: #5e72e4;
    }
    .stepActivePast {
      color: #fff;
      background-color: #b1bbf1;
    }
    .formdiv {
      border: 1px solid #e7e7e7;
      margin-top: 15px;
    }
    .fd-head {
      background-color: #fafafa;
      height: 40px;
      line-height: 40px;
      padding-left: 12px;
      font-size: 16px;
      margin-bottom: 24px;
    }
    .inlinediv {
      display: inline-block;
      margin-right: 20px;
      height: 91px;
      vertical-align: bottom;
      .dl-subtitle {
        margin-left: 14px;
        font-size: 14px;
        margin-bottom: 8px;
      }
      .el-select {
        width: 100%;
      }
    }
    .longdiv {
      width: 46%;
      .el-form-item {
        width: 100%;
        .el-form-item__content {
          width: 100%;
          .el-select {
            width: 100%;
          }
        }
      }
    }
    .dateline {
      display: inline-block;
      width: 10px;
      border-bottom: 1px solid #bbbbbd;
      position: relative;
      left: 7px;
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 200px;
    }
    .el-form-item__content {
      margin-left: 0;
    }
    .step2 {
      .el-textarea {
        width: 96%;
        font-size: 12px;
      }
    }
    .op-result {
      width: 100%;
      height: 106px;
      line-height: 106px;
      border: 1px solid #62be40;
      color: #62be40;
      margin-top: 18px;
      background-color: #e2fed8;
      img {
        vertical-align: middle;
        margin-left: 22px;
      }
      span {
        margin-left: 20px;
        font-size: 20px;
      }
    }
    .op-fail {
      border: 1px solid #fd2f14;
      color: #fd2f14;
    }
  }
  .el-form-item.is-success .el-input__inner,
  .el-form-item.is-success .el-input__inner:focus,
  .el-form-item.is-success .el-textarea__inner,
  .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #c0c4cc;
  }
  .el-select {
    width: 100%;
  }
  .mainlayout {
    margin: 0 30px 0;
    width: 940px;
    border-top: 1px solid #ddd;
    .el-form {
      padding-top: 10px;
    }
  }
  .seachDiv {
    height: 80px;
    background-color: #ffffff;
    border-radius: 5px;
    box-shadow: 4px 4px 4px 1px #eee;
    display: flex;
    align-items: center;
    padding-left: 20px;
    position: relative;
    margin-top: 20px;
    > span {
      margin-right: 40px;
    }
  }
  .caret-wrapper {
    margin-left: 5px;
    display: inline-block;
    width: 19px !important;
    height: 15px !important;
    background-image: url(../../../assets/sortIcon.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .sort-caret.ascending {
      border-bottom-color: transparent !important;
      border-top-color: transparent !important;
    }
    .sort-caret.descending {
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
    }
    .el-icon-arrow-down {
      display: inline-block;
      width: 19px;
      height: 15px;
      background-image: url(../../../assets/sortIcon.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
}
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
.add-approval-process {
  .el-dialog {
    width: 1000px !important;
  }
}
</style>
