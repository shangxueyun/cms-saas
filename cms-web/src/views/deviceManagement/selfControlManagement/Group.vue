<template>
  <div class="group">
    <div class="search-bar">
      <div style="display: flex;flex-wrap: wrap;align-items:center">
        <el-select placeholder="选择计划"
                   v-model="lightingPlanId"
                   clearable
                   style="width:200px;margin-right:10px">
          <el-option v-for="(item,index) in lightingPlanList"
                     :key="index"
                     :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
        <span style="background-color:#3575f6"
              @click="querySeach"
              class="query-btn">查询</span>
      </div>
      <div class="btnDiv">
        <el-button class="tban tban1"
                   v-if="hasAuthority('03080112')"
                   @click="addRepFn"><i class="iconfont icon-crm_xinzeng-"></i> 新增群组</el-button>
      </div>
    </div>
    <div class="table">
      <el-table :data="tableData"
                style="width: 100%">
        <el-table-column prop="projectManagementName"
                         label="项目简称"
                         align="center"></el-table-column>
        <el-table-column prop="name"
                         label="群组名称"
                         align="center"></el-table-column>
        <el-table-column prop="lightingLoopNumber"
                         label="已添加回路数量"
                         align="center"></el-table-column>
        <el-table-column prop="lightingPlan.name"
                         label="计划名称"
                         align="center"></el-table-column>
        <el-table-column label="操作"
                         align="center"
                         v-if="hasAuthority('03080114')||hasAuthority('03080115')">
          <template slot-scope="scope">
            <el-button class="el-button--primary operation-btn"
                       size="mini"
                       v-if="hasAuthority('03080114')"
                       @click="handleEdit(scope.$index, scope.row)">查看</el-button>
            <el-button type="danger"
                       v-if="hasAuthority('03080115')"
                       size="mini"
                       plain
                       @click="deleteFn(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="ctc-foot">
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
    <!-- 新增群组-->
    <el-dialog class="addRep addGroup"
               title="新增群组"
               :visible.sync="detailsShow"
               @close="drawerClose">
      <div class="tenant-details addFrom">
        <div class="tenant-details details-content">
          <div class="main-content"
               style="border:none">
            <el-form :model="addData"
                     ref="addData"
                     :rules="addDataRules">
              <div class="basInfo">
                <p class="title"><span class="vertical"></span>基本信息</p>
                <div class="content">
                  <div class="form">
                    <el-form-item prop="projectManagementId">
                      <span>项目简称<i class="required">*</i></span>
                      <el-select v-model="addData.projectManagementId"
                                 @change="patrolTypeChange"
                                 size="small"
                                 placeholder="请选择">
                        <el-option v-for="item in projectManagementsList"
                                   :key="item.id"
                                   :label="item.referred"
                                   :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item prop="name">
                      <span>群组名称<i class="required">*</i></span>
                      <el-input v-model="addData.name"
                                @blur="nameExist(addData.name)"
                                maxlength="50"></el-input>
                    </el-form-item>
                    <el-form-item prop="remark"
                                  style="width: 92%">
                      <span>群组说明</span>
                      <el-input v-model="addData.remark"
                                type="textarea"
                                placeholder="您可输入此群组包含的回路数量，具体位置等信息(50字内）"
                                maxlength="50"></el-input>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="basInfo">
                <p class="title">已添加回路{{addData.lightingLoops.length}}条</p>
                <div class="content">
                  <div class="table">
                    <el-table :data="loopList"
                              @selection-change="handleSelectionChange"
                              style="width: 100%">
                      <el-table-column type="selection"
                                       width="55">
                      </el-table-column>
                      <el-table-column prop="name"
                                       label="回路名称"
                                       align="center"></el-table-column>
                      <el-table-column prop="lightingGatewayName"
                                       label="网关"
                                       align="center"></el-table-column>
                      <el-table-column prop="interfaces"
                                       label="TagID"
                                       align="center"></el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
            </el-form>
          </div>
        </div>
        <div slot="footer"
             style="text-align: right;padding: 8px 20px 8px;"
             class="dialog-footer">
          <el-button @click="drawerClose"
                     class="close-button">取消</el-button>
          <el-button type="primary"
                     class="defaultbtn dialog-confirmBtn"
                     @click="addFrom('addData')">确定</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 确认删除弹窗 -->
    <el-dialog :visible.sync="DELDialogVisible"
               class="delaffirm"
               width="400px"
               center>
      <div class="deleteDialog">
        <img src="../../../assets/delete1.png"
             style="width: 64px;height: 64px" />
        <div>
          <p>提示</p>
          <span>确认删除？</span>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="DELDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="delFun">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 详情 -->
    <el-drawer title="群组详情"
               :visible.sync="DetailShow"
               :wrapperClosable="false"
               @close="detailClose"
               direction="rtl"
               size="746px"
               class="getway-drawer newDrawer">
      <span slot="title"
            style="position: relative;color: #262626;font-size: 16px;font-weight: bold;">
        群组详情
        <span style="position: absolute;right: 0;cursor: pointer;color: #3575F6;font-size: 12px;font-weight: normal;"
              @click="editDetails"
              v-if="readOnly&&hasAuthority('03080113')"><i class="iconfont icon-edit1"></i>编辑</span>
      </span>
      <group-details :detailData="groupDetailsData"
                     :DetailShow.sync="DetailShow"
                     @setreadOnly="setreadOnly"
                     @handleEdit="handleEdit"
                     @query="query"
                     ref="groupDetails"></group-details>
    </el-drawer>
  </div>
</template>
<script>
import context from '@/service'
import GroupDetails from './GroupDetails.vue'
export default {
  name: 'group',
  components: {
    GroupDetails
  },
  props: {
    projectId: {
      type: Number,
      default: ''
    }
  },
  watch: {
    projectId: {
      handler (newValue, oldValue) {
        if (newValue) {
          this.lightingPlanId = ''
          this.query()
          this.getLightingPlanList()
          this.addData.projectManagementId = this.projectId
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      tableData: [],
      lightingGroup: [],
      detailsShow: false,
      addData: {
        projectManagementId: '',
        name: '',
        remark: '',
        lightingLoops: []
      },
      addDataRules: {
        projectManagementId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入群组名称', trigger: 'blur' }
        ],
        remark: [
          { required: false, message: '请输入群组说明', trigger: 'blur' }
        ]
      },
      patrolType: '',
      useStatus: '',
      projectManagementId: '',
      lightingPlanId: '',
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
      DELDialogVisible: false,
      groupDetailsData: {},
      DetailShow: false,
      readOnly: true,
      lightingPlanList: [],
      loopList: []
    }
  },
  created () {
    this.projectManagementsList = this.$store.state.projectManagementsList
    this.addData.projectManagementId = this.projectId
    // this.query()
    // this.getLightingPlanList()
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
      // return true
    },
    setreadOnly () {
      this.readOnly = true
    },
    detailClose () {
      this.DetailShow = false
      this.readOnly = true
      this.$refs.groupDetails.close()
    },
    editDetails () {
      this.readOnly = false
      this.$refs.groupDetails.edit()
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    async nameExist (name) {
      context.http.get(`/rms/api/lightingGroup/nameExist?projectManagementId=${this.projectId}&name=${name}`).then(res => {
      }).catch(error => {
        console.log(error)
        this.addData.name = ''
      })
    },
    async getLightingPlanList (index, row) {
      context.http.get(`/rms/api/lightingPlan/all`, { projectManagementId: this.projectId }).then(res => {
        this.lightingPlanList = res.data
      })
    },
    async getLoopList (id) {
      const _id = id || this.projectId
      context.http.get(`/rms/api/lightingLoop/all`, { groupFlg: true, projectManagementId: _id }).then(res => {
        this.loopList = res.data
      })
    },
    handleSelectionChange (val) {
      this.addData.lightingLoops = val
    },
    async query (flag) {
      let param = {
        page: (this.currentPage - 1),
        size: this.pgSize,
        projectManagementId: this.projectId,
        lightingPlanId: this.lightingPlanId,
        sort: 'createdDate,desc'
      }
      let result = await context.http.get('rms/api/lightingGroup', param)
      if (result.status === 200) {
        this.tableData = result.data
        this.total = Number(result.headers['x-total-count'])
      }
    },
    async handleEdit (index, row) {
      context.http.get(`/rms/api/lightingGroup/${row.id}`).then(res => {
        this.groupDetailsData = res.data
        this.DetailShow = true
      })
    },
    deleteFn (row) {
      this.DELDialogVisible = true
      this.deleteRow = row
    },
    delFun () {
      const row = this.deleteRow
      context.http.delete(`/rms/api/lightingGroup/${row.id}`).then(res => {
        this.DELDialogVisible = false
        this.query()
      })
    },
    patrolTypeChange () {
      this.getLoopList(this.addData.projectManagementId)
    },
    addRepFn () {
      this.detailsShow = true
      this.$nextTick(() => {
        this.$refs['addData'].resetFields()
        this.addData = {
          projectManagementId: this.projectId,
          name: '',
          remark: '',
          lightingLoops: []
        }
      })
      this.getLoopList()
    },
    drawerClose () {
      this.detailsShow = false
    },
    addFrom (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          context.http.post(`/rms/api/lightingGroup`, this.addData).then(res => {
            if (res.status === 201) {
              this.$message.success('新增成功')
              this.detailsShow = false
              this.query()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    querySeach () {
      this.currentPage = 1
      this.query()
    }
  }
}
</script>
<style lang="scss">
.group {
  .delaffirm {
    .el-dialog__header {
      border: none;
    }
    .el-dialog__body {
      margin: 0 35px !important;
      border-bottom: none;
      padding: 30px 0 !important;
      background-color: #fff;
    }
    .el-dialog__footer {
      text-align: right !important;
    }
  }
  .el-dialog__body {
    .deleteDialog {
      display: flex;
      div {
        margin-left: 15px;
        display: flex;
        flex-wrap: wrap;
        p {
          color: #666666;
          font-size: 20px;
          font-weight: 600;
          width: 100%;
        }
      }
    }
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
  .el-dialog {
    width: 746px;
    /* margin-top: 3vh !important; */
  }
  .el-dialog__header {
    margin: 0 20px !important;
    padding: 15px 0 15px 0 !important;
    border: none;
  }
  .el-dialog__title {
    font-weight: bold;
    border: none;
    font-size: 16px;
  }
  .el-dialog__body {
    margin: 0 !important;
    background-color: #f7f7f7;
    border: none;
  }
  .basInfo {
    border: none !important;
    background-color: #fff;
  }
  .readOnlyTxt {
    color: #262626 !important;
  }
  .el-form-item__content {
    > span {
      color: #777 !important;
    }
  }
  .el-input__icon {
    line-height: 34px;
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
</style>
<style lang="scss" scoped>
@import "../../../style/mixins.scss";
.search-bar {
  > div {
    > span {
      display: inline-block;
      width: 110px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      cursor: pointer;
      // color: #fff;
      border-radius: 3px;
      &:first-child {
        // background-color: #3577f6;
      }
      &:first-child:hover {
        background-color: #2a6ef0;
      }
      &:last-child {
      }
      &:last-child:hover {
        background-color: #f0f9f3;
      }
    }
  }
}
.addGroup{
  .table {
    height: 200px;
    overflow-y: scroll;
    @include scrollBarStyle;
  }
}
.table {
  padding-top: 1px;
  .el-button--primary {
    color: #409eff;
  }
}
.btnDiv {
  display: flex;
  align-items: center;
  span {
    border: 1px solid #44af69;
    color: #44af69;
    background-color: #fff;
    line-height: 31px !important;
  }
}
.tenant-details.addFrom {
  .el-input__inner {
    height: 32px;
  }
  .el-input__icon {
    line-height: 32px;
  }
}
.addFrom {
  .ctc-foot {
    padding: 20px 20px 30px 20px;
  }
  .frequency {
    display: flex;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    .el-input {
      width: 55%;
    }
    .el-select {
      width: 45% !important;
      .el-input {
        width: 100%;
      }
    }
    .el-input__inner {
      border: none;
    }
  }
  .textarea {
    border: none;
  }
  .el-select {
    width: 100%;
  }
}
.addFrom {
  .table {
    .normal {
      color: #49af61;
    }
    .abnormal {
      color: #ff6665;
    }
  }
  .el-select {
    width: 100%;
  }
  .main-content {
    padding-top: 20px;
    margin: 0;
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
      border: 1px solid #dadada;
      padding: 1px 0;
      // min-height: 500px;
      // width: 900px;
      margin-bottom: 20px;
      .queryParams {
        padding: 10px 0 0 15px;
        .query-btn {
          display: inline-block;
          width: 80px;
          margin: 0;
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
          width: 45%;
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
            /* .seachDeviceIcon {
                display: inline-block;
                width: 20px;
                height: 20px;
                background: url(../../../../assets/seachDeviceIcon.png) no-repeat;
                position: absolute;
                right: 10px;
                top: 33px;
                cursor: pointer;
              } */
            .el-textarea__inner {
              resize: none !important;
            }
          }
        }
      }
    }
  }
  .dialog-footer {
    background-color: #fff;
  }
  .close-button {
    color: #666 !important;
    background-color: #fff !important;
    border: none !important;
    &:hover {
      color: #3575f6 !important;
    }
  }
  .defaultbtn {
    width: 90px !important;
    margin-left: 0;
  }
}
</style>
