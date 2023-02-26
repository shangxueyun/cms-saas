<template>
  <div class="membershipTag">
    会员信息
    <div class="menuTab">
      <div>
        <span @click="roterTo('membershipList')" v-if="hasAuthority('050101')">会员列表</span>
        <span @click="roterTo('membershipLevel')" v-if="hasAuthority('050102')">会员等级</span>
        <span class="active" >会员标签</span>
      </div>
      <div class="addbtn"  @click="dialogVisible = true;dialogTitle = '新增标签';create={}" v-if="hasAuthority('05010301')"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>新增标签</div>
    </div>
    <div class="ct-content">
      <div class="ctc-table">
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column prop="name"
                           label="标签名称"
                           align="center">
          </el-table-column>
          <el-table-column prop="number"
                           label="用户数量"
                           align="center">
          </el-table-column>
          <el-table-column label="操作"
                           align="center">
            <template slot-scope="scope" v-if="scope.row.roleName !== 'ADMIN'">
              <el-button class="el-button--primary editbtn"
                         size="mini"
                         v-if="hasAuthority('05010302')"
                         @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button class="el-button--primary"
                         size="mini"
                         v-if="hasAuthority('05010303')"
                         type="danger"
                         plain
                         @click="delTag(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="ctc-foot">
        <div class="pagingnum">
          显示 <select v-model="pgSize"
                  @change="currentSel">
            <option v-for="item in pgNumoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </option>
          </select>
          条目 <span style="padding-left: 30px">显示从{{pgSize*(currentPage - 1) + 1}}到{{pgSize*currentPage}}项结果，共<span class="style: red">{{total}}</span>条</span>
        </div>
        <el-pagination v-if="total > 0"
                       background
                       layout="prev, pager, next"
                       :page-size=pgSize
                       :total="total"
                       :current-page="currentPage"
                       @current-change="current_change">
        </el-pagination>
      </div>
    </div>

    <el-dialog :title="dialogTitle"
               :visible.sync="dialogVisible">
      <el-form :model="create"
               ref="accountRole"
               :rules="AccountRoleRules">
        <el-form-item :label-width="formLabelWidth"
                      style="margin-bottom: 30px"
                      prop="name">
          <div style="padding: 20px 0 10px 0">标签名称<i class="required">*</i></div>
          <el-input v-model="create.name"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogVisible = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="createTag"
                   class="defaultbtn dialog-confirmBtn">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
window.repeatCode = false
export default {
  name: 'membershipTag',
  components: {
  },
  data () {
    return {
      dialogTitle: '新增标签',
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
          label: '停用'
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
        name: ''
      },
      AccountRoleRules: {
        name: [
          { required: true, message: '请输入标签名称', trigger: 'blur' }
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
      roleData: []
    }
  },
  created () {
  },
  mounted () {
    this.query()
  },
  methods: {
    roterTo (name) {
      this.$router.push({name: name, params: {projectManagementId: this.projectManagementId}})
    },
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
    enableData () {
      console.log('启用')
    },
    createTag () {
      if (this.dialogTitle === '编辑标签') {
        context.http.put('/crm/api/member-labels', this.create).then(res => {
          if (res.status === 200) {
            this.dialogVisible = false
            this.query()
          }
        })
      } else {
        context.http.post('/crm/api/member-labels', this.create).then(res => {
          if (res.status === 201) {
            this.dialogVisible = false
            this.query()
          }
        })
      }
    },
    async query () {
      let result = await context.http.get('/crm/api/member-labels'
        , { page: (this.currentPage - 1), size: this.pgSize, sort: 'desc', eagerload: false })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
    },
    async handleEdit (index, row) {
      let result = await context.http.get(`/crm/api/member-labels/${row.id}`)
      this.create = result.data
      this.dialogTitle = '编辑标签'
      this.dialogVisible = true
    },
    delTag (index, row) {
      context.http.delete(`/crm/api/member-labels/${row.id}`).then(res => {
        if (res.status === 200) {
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
<style lang="scss" scoped>
.membershipTag{
  .menuTab{
    height: 60px;
    margin-top: 15px;
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 4px 4px 4px 1px #eee;
    justify-content: space-between;
    div{
      >span{
        position: relative;
        display: inline-block;
        width: 120px;
        text-align: center;
        height: 60px;
        line-height: 60px;
        cursor: pointer;
        font-size: 14px;
        &.active{
          color: #3577F6;
          border-bottom: 2px solid #3577F6;
        }
        >span{
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
}
</style>
<style lang="scss">
@import "../../../style/config";
.membershipTag {
  font-size: 16px;
  background-color: #f9f9f9;
  .addbtn {
    margin-top: 0;
  }
  .ct-content {
    width: 100%;
    margin: 0 auto;
    padding-top: 15px;
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
    .ctc-table {
      margin-top: 15px;
      position: relative;
      .enable {
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
    .el-button--stop {
      background-color: #fff;
      color: #ac8959;
      border: 1px solid #ac8959;
      &:hover {
        background-color: #ac8959;
        color: #fff;
      }
    }
    .el-pagination {
      width: 446px;
      margin-right: 20px;
    }
    .ctc-foot {
      background-color: #ffffff;
      display: flex;
      justify-content: space-between;
      padding: 60px 0 30px 20px;
      .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #2f3f48;
        color: #fff;
      }
      .el-pagination.is-background .el-pager li:not(.disabled):hover {
        color: #999;
      }
    }
    .pagingnum {
      font-size: 14px;
      text-align: center;
      color: #777;
      select {
        width: 70px;
        height: 28px;
        border-radius: 2px;
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
  .editbtn {
    background-color: #fff !important;
    border-color: #3577f6 !important;
    color: #3577f6;
    &:hover {
      background-color: #3577f6 !important;
      border-color: #3577f6 !important;
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
    .editbtn {
      width: 88px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background-color: #ebebeb;
      border-radius: 4px;
      cursor: pointer;
      right: 0;
      i {
        font-size: 16px;
        margin-right: 2px;
        vertical-align: middle;
      }
      .icon-edit {
        width: 15px;
        height: 20px;
        margin-right: 4px;
        background: url(../../../assets/edit.png) no-repeat;
        background-size: contain;
      }
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
