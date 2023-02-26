<template>
  <div class="roleManage">
    <span class="page_head_title">角色配置</span>
    <div class="search-bar">
      <span class="searbar-left">
        <el-input v-model="name"
                  placeholder="角色名称"
                  style="width:200px"></el-input>
        <el-select v-model="useStatus"
                   placeholder="角色状态"
                   style="width:200px">
          <el-option label="使用中"
                     value="USING"></el-option>
          <el-option label="已停用"
                     value="DISABLE"></el-option>
        </el-select>
        <div class="query-btn"
             @click="querybtn">查询</div>
      </span>
      <el-button class="tban tban1"
                 v-if="hasAuthority('01020201')"
                 @click="dialogVisible = true"><i class="iconfont icon-crm_xinzeng-"></i> 新增角色</el-button>
    </div>
    <div class="ct-content">
      <div class="ctc-table"
           style="margin-top: 0;">
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column prop="roleName"
                           label="角色名称"
                           align="center">
          </el-table-column>
          <el-table-column prop="organizeName"
                           label="组织"
                           align="center">
          </el-table-column>
          <el-table-column prop="useStatus"
                           :formatter="formatUseStatus"
                           label="角色状态"
                           align="center">
          </el-table-column>
          <el-table-column label="操作"
                           v-if="hasAuthority('01020202')||hasAuthority('01020203')"
                           align="center">
            <template slot-scope="scope"
                      v-if="scope.row.roleName !== 'ADMIN'">
              <el-button class="el-button--primary operation-btn"
                         size="mini"
                         v-if="hasAuthority('01020202')"
                         @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini"
                         class="el-button--stop"
                         v-if="hasAuthority('01020203')"
                         @click="configAuthority(scope.$index, scope.row)">配置权限</el-button>
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

    <el-dialog title="创建账户角色"
               :visible.sync="dialogVisible">
      <el-form :model="create"
               ref="accountRole"
               :rules="AccountRoleRules">
        <el-form-item :label-width="formLabelWidth"
                      prop="roleName">
          <div>角色名称<i class="required">*</i></div>
          <el-input v-model="create.roleName"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth"
                      prop="organizeId"
                      style="margin-bottom: 20px;">
          <div>组织<i class="required">*</i></div>
          <el-select v-model="create.organizeId"
                     placeholder="请选择">
            <el-option v-for="item in organizesOptions"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogVisible = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="createRoles"
                   class="defaultbtn dialog-confirmBtn">确 认</el-button>
      </div>
    </el-dialog>
    <!-- 配置权限 -->
    <configurationAuthority ref="authority"
                            :permissiondrawershow="jurisdictionShow"
                            :roleObj="configureRole"
                            :roleData="roleData"
                            :existingAuthority="existingAuthority"
                            @drawerClose="permissionClose" />

    <!-- 编辑角色 -->
    <drawer :show="drawerShow"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="mainlayout details-content"
           slot="drawer">
        <el-form :model="detailsData"
                 ref="detailsData"
                 :rules="AccountRoleRules">
          <el-form-item :label-width="formLabelWidth"
                        prop="roleName">
            <div>角色名称<i class="required">*</i></div>
            <el-input v-model="detailsData.roleName"
                      maxlength="20"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth"
                        prop="organizeId"
                        style="margin-bottom: 20px;">
            <div>组织<i class="required">*</i></div>
            <el-select v-model="detailsData.organizeId"
                       placeholder="请选择">
              <el-option v-for="item in organizesOptions"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth"
                        style="margin-bottom: 20px;">
            <div>角色状态</div>
            <el-select v-model="detailsData.useStatus"
                       placeholder="请选择">
              <el-option v-for="item in stateOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-footer"
           slot="footer">
        <el-button @click="drawerShow = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="editorialRole"
                   class="defaultbtn dialog-confirmBtn">确 认</el-button>
      </div>
    </drawer>
  </div>
</template>
<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import configurationAuthority from './components/configurationAuthority'
window.repeatCode = false
export default {
  name: 'roleManage',
  components: {
    Drawer,
    configurationAuthority
  },
  data () {
    return {
      name: '',
      useStatus: '',
      existingAuthority: [],
      drawerShow: false,
      drawerTitle: '编辑角色',
      jurisdictionShow: false,
      configureRole: {},
      organizesOptions: [],
      value: '',
      roleName: '',
      stateOptions: [
        {
          value: 'USING',
          label: '使用中'
        },
        {
          value: 'DISABLE',
          label: '已停用'
        }
      ],
      areaprops: {
        value: 'label',
        children: 'cities'
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
      tableData: [{
        companyShortName: '1',
        industryValue: '1',
        addrProvince: '1'
      }],
      currentPage: 1,
      total: 0,
      pgSize: 15,
      formLabelWidth: '120px',
      dialogVisible: false,
      create: {
        organizeId: '',
        roleName: ''
      },
      AccountRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        organizeId: [
          { required: true, message: '请选择组织', trigger: 'change' }
        ]
      },
      detailsData: {
        customerContacts: [{
          position: '',
          name: '',
          telephone: '',
          email: '',
          remark: ''
        }]
      },
      addData: {
        customerContacts: [{
          position: '',
          name: '',
          telephone: '',
          email: '',
          remark: ''
        }]
      },
      repeatCode: false,
      dataLength: 0,
      roleData: []
    }
  },
  created () {
  },
  mounted () {
    this.query()
    this.queryOrganization()
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    onHide () {
      this.jurisdictionShow = false
      this.drawerShow = false
    },
    permissionClose (data) {
      this.jurisdictionShow = false
    },
    async queryOrganization () {
      let res = await context.http.get('uaa/api/organizes/all/simple')
      this.organizesOptions = res.data
    },
    async createRoles () {
      let orgcode = this.create.organizeId
      let postData
      if (orgcode) {
        var organize = this.organizeFilter(orgcode)[0]
        postData = {
          roleName: this.create.roleName,
          organizeName: organize.name,
          organizeCode: organize.code,
          organizeId: organize.id
        }
      }
      this.$refs['accountRole'].validate((valid) => {
        if (valid) {
          context.http.post('uaa/api/roles', postData).then(res => {
            if (res) {
              this.dialogVisible = false
              this.create = {}
              this.query()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    formatUseStatus (row, column) {
      if (row.useStatus === 'USING') {
        return '使用中'
      } else {
        return '已停用'
      }
    },
    querybtn () {
      this.currentPage = 1
      this.query()
    },
    async query () {
      let result = await context.http.get('/uaa/api/roles'
        , { page: (this.currentPage - 1), size: this.pgSize, sort: 'desc', eagerload: false, name: this.name, useStatus: this.useStatus })
      this.tableData = result.data
      this.dataLength = result.data.length
      this.total = Number(result.headers['x-total-count'])
    },
    async handleEdit (index, row) {
      this.drawerShow = true
      let result = await context.http.get(`/uaa/api/roles/${row.id}`)
      this.detailsData = result.data
    },
    organizeFilter (organizeId) {
      return this.organizesOptions.filter(item => item.id === organizeId)
    },
    async editorialRole () {
      var orgcode = this.detailsData.organizeId
      let putData
      if (orgcode) {
        var organize = this.organizeFilter(orgcode)[0]
        putData = {
          authorities: this.detailsData.authorities,
          id: this.detailsData.id,
          organizeCode: organize.code,
          organizeId: organize.id,
          organizeName: organize.name,
          roleName: this.detailsData.roleName,
          useStatus: this.detailsData.useStatus
        }
      }
      this.$refs['detailsData'].validate((valid) => {
        if (valid) {
          context.http.put('uaa/api/roles', putData).then(res => {
            if (res.statusText === 'OK') {
              this.drawerShow = false
              this.query()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async configAuthority (index, row) {
      this.configureRole = row
      let res = await context.http.get(`uaa/api/roles/${row.id}`)
      this.existingAuthority = res.data.authorities
      let result = await context.http.get('/uaa/api/authorities/module', { moduleNames: '' })
      this.roleData = result.data
      this.jurisdictionShow = true
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
.roleManage {
  font-size: 16px;
  background-color: #f9f9f9;
  .seachDiv {
    height: 80px;
    background-color: #ffffff;
    margin-top: 15px;
    border-radius: 5px;
    box-shadow: 4px 4px 4px 1px #eee;
    display: flex;
    align-items: center;
    padding-left: 20px;
    justify-content: space-between;
    > span {
      margin-right: 40px;
      display: flex;
      align-items: center;
      > div {
        margin-right: 20px;
      }
    }
  }
  .addbtn {
    margin-top: 0;
  }
  .ct-content {
    .ctc-search {
      height: 88px;
      background-color: #fff;
      margin-top: 20px;
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
  }
  .el-form-item__content {
    .el-input {
      font-size: 12px;
      width: 100%;
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
  .see {
    .el-tabs__item {
      width: 160px !important;
      text-align: center;
    }
    .editbtnwarp {
      display: flex;
      justify-content: flex-end;
    }
    .operationtips {
      font-size: 12px;
      padding-top: 10px;
      text-align: left;
      float: left;
    }
    .read-only {
      height: 40px;
      line-height: 40px;
      width: 200px;
      margin-left: 15px;
    }
    .step4 {
      p {
        padding: 10px;
      }
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
    width: 500px;
    border-top: 1px solid #ddd;
    .el-form {
      padding-top: 10px;
    }
  }
}
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
</style>
