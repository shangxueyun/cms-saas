<template>
  <div class="GatewayConfiguration">
    <div class="search-bar">
      <div style="display: flex;flex-wrap: wrap;align-items:center"></div>
      <div class="btnDiv">
        <el-button class="tban tban1"
                   v-if="hasAuthority('03080102')"
                   @click="addRepFn"><i class="iconfont icon-crm_xinzeng-"></i> 新增网关</el-button>
      </div>
    </div>
    <div class="table">
      <el-table :data="tableData"
                style="width: 100%">
        <el-table-column prop="projectManagementName"
                         label="项目简称"
                         align="center"></el-table-column>
        <el-table-column prop="name"
                         label="网关名称"
                         align="center"></el-table-column>
        <el-table-column prop="ipAddress"
                         label="IP地址"
                         align="center"></el-table-column>
        <el-table-column prop="port"
                         label="端口地址"
                         align="center"></el-table-column>
        <el-table-column :formatter="formatter"
                         label="状态"
                         align="center"></el-table-column>
        <el-table-column label="操作"
                         align="center"
                         v-if="hasAuthority('03080104')||hasAuthority('03080105')">
          <template slot-scope="scope">
            <el-button class="el-button--primary operation-btn"
                       size="mini"
                       v-if="hasAuthority('03080104')"
                       @click="handleEdit(scope.$index, scope.row)">查看</el-button>
            <el-button type="danger"
                       size="mini"
                       plain
                       v-if="hasAuthority('03080105')"
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
    <!-- 新增网关-->
    <el-dialog class="addRep"
               title="新增网关"
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
                    <el-form-item prop="name"
                                  style="margin-left: 40px">
                      <span>网关名称<i class="required">*</i></span>
                      <el-input v-model="addData.name"
                                @blur="repeatQuery"
                                maxlength="50"></el-input>
                    </el-form-item>
                    <el-form-item prop="ipAddress">
                      <span>IP地址<i class="required">*</i></span>
                      <el-input v-model="addData.ipAddress"
                                @blur="ipPortRepeatQuery"
                                maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item prop="port"
                                  style="margin-left: 40px">
                      <span>端口地址<i class="required">*</i></span>
                      <el-input v-model="addData.port"
                                @blur="ipPortRepeatQuery"
                                maxlength="20"></el-input>
                    </el-form-item>
                  </div>
                </div>
              </div>

              <!-- <div class="basInfo">
                <p class="title"><span class="vertical"></span>其他信息</p>
                <div class="content">
                  <div class="ct-header">
                    <span>已添加{{addData.lightingControllerDTOList.length}}台控制器</span>
                    <span @click="addController"><i class="iconfont icon-crm_xinzeng-"></i> 新增控制器</span>
                  </div>
                  <div class="ct-table">
                    <div class="ct-tableheader">
                      <span>控制器ID</span>
                      <span>类型</span>
                      <span>操作</span>
                    </div>
                    <div class="ct-tablebody">
                        <div class="ct-item" v-for="(item, index) in addData.lightingControllerDTOList">
                          <el-input v-model="item.identifier" placeholder="请填写控制器ID"></el-input>
                          <el-select v-model="item.controllerType" placeholder="选择类型">
                            <el-option :label="item.name" :value="item.value" v-for="(item, index) in controllerType" :key="item.name"></el-option>
                          </el-select>
                          <span @click="delControl(item, index)" v-if="index !== 0">删除</span>
                        </div>
                    </div>
                  </div>
                </div>
              </div> -->
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
          <span>删除操作将置空该网关下所有回路的网关和TagID信息，将影响回路正常工作，请谨慎操作！确认删除？</span>
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
    <el-drawer title="网关详情"
               :visible.sync="DetailShow"
               :wrapperClosable="false"
               @close="detailClose"
               direction="rtl"
               size="746px"
               class="getway-drawer newDrawer">
      <span slot="title"
            style="position: relative;color: #262626;font-size: 16px;font-weight: bold;">
        网关详情
        <span style="position: absolute;right: 0;cursor: pointer;color: #3575F6;font-size: 12px;font-weight: normal;"
              @click="editDetails"
              v-if="readOnly&&hasAuthority('03080103')"><i class="iconfont icon-edit1"></i>编辑</span>
      </span>
      <getway-details :detailData="getWayDetailData"
                      :DetailShow.sync="DetailShow"
                      @setreadOnly="setreadOnly"
                      @handleEdit="handleEdit"
                      @query="query"
                      ref="getwayDetails"></getway-details>
    </el-drawer>
  </div>
</template>
<script>
import context from '@/service'
import GetwayDetails from './GetwayDetails.vue'
export default {
  name: 'GatewayConfiguration',
  components: {
    GetwayDetails
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
          this.addData.projectManagementId = this.projectId
          this.query()
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      tableData: [],
      detailsShow: false,
      addData: {
        projectManagementId: '',
        name: '',
        ipAddress: '',
        port: ''
      },
      addDataRules: {
        projectManagementId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入网关名称', trigger: 'blur' }
        ],
        ipAddress: [
          { required: true, message: '请输入IP地址', trigger: 'blur' }
        ],
        port: [
          { required: true, pattern: /(^[0-9]\d*$)/, message: '请输入端口地址', trigger: 'blur' }
        ]
      },
      controllerType: [
        { name: '4', value: 'FOUR' },
        { name: '6', value: 'SIX' },
        { name: '8', value: 'EIGHT' },
        { name: '12', value: 'TWELVE' }
      ],
      DELDialogVisible: false,
      getWayDetailData: {},
      DetailShow: false,
      readOnly: true,
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
      ]
    }
  },
  created () {
    this.projectManagementsList = this.$store.state.projectManagementsList
    this.addData.projectManagementId = this.projectId
    // this.query()
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    formatter (row, column) {
      return row.loopType === 'NORMAL' ? '正常' : '异常'
    },
    query () {
      const param = {
        projectManagementId: this.projectId,
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'createdDate,desc'
      }
      context.http.get(`/rms/api/lightingGateway`, param).then(res => {
        this.tableData = res.data
        this.total = Number(res.headers['x-total-count'])
      })
    },
    async handleEdit (index, row) {
      context.http.get(`/rms/api/lightingGateway/${row.id}`).then(res => {
        this.getWayDetailData = res.data
        this.DetailShow = true
      })
    },
    patrolTypeChange () {

    },
    addRepFn () {
      this.detailsShow = true
      this.$nextTick(() => {
        this.$refs['addData'].resetFields()
        this.addData = {
          projectManagementId: this.projectId,
          name: '',
          ipAddress: '',
          port: ''
        }
      })
    },
    drawerClose () {
      this.detailsShow = false
    },
    addController () {
      this.addData.lightingControllerDTOList.push({ 'identifier': '', 'controllerType': '' })
    },
    delControl (item, index) {
      this.addData.lightingControllerDTOList.splice(index, 1)
    },
    addFrom (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          context.http.post(`/rms/api/lightingGateway`, this.addData).then(res => {
            this.$message.success('新增成功')
            this.query()
            this.detailsShow = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
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
    deleteFn (row) {
      this.DELDialogVisible = true
      this.deleteRow = row
    },
    delFun () {
      const row = this.deleteRow
      context.http.delete(`/rms/api/lightingGateway/${row.id}`).then(res => {
        this.DELDialogVisible = false
        this.query()
      })
    },
    detailClose () {
      this.DetailShow = false
      this.readOnly = true
      this.$refs.getwayDetails.close()
    },
    editDetails () {
      this.readOnly = false
      this.$refs.getwayDetails.edit()
    },
    setreadOnly () {
      this.readOnly = true
    },
    repeatQuery () {
      context.http.get(`/rms/api/lightingGateway/nameExist?projectManagementId=${this.addData.projectManagementId}&name=${this.addData.name}`).then(res => {
      }).catch(err => {
        console.log(err)
        this.addData.name = ''
      })
    },
    ipPortRepeatQuery () {
      if (!this.addData.ipAddress || !this.addData.port) return
      context.http.get(`/rms/api/lightingGateway/ipPortExist?projectManagementId=${this.addData.projectManagementId}&ipAddress=${this.addData.ipAddress}&port=${this.addData.port}`).then(res => {
      }).catch(err => {
        console.log(err)
        // this.addData.ipAddress = ''
        this.addData.port = ''
      })
    }
  }
}
</script>
<style lang="scss">
.GatewayConfiguration {
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
  .addRep {
    .el-dialog {
      width: 746px;
      margin-top: 3vh !important;
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
.getway-drawer {
  .el-drawer__body {
    padding: 0;
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
  .content {
    font-size: 14px;
    .ct-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      span {
        &:first-child {
          color: #4677ee;
        }
        color: #44af69;
        cursor: pointer;
        &:last-child {
          border-bottom: 1px solid #fff;
          &:hover {
            border-bottom: 1px solid #44af69;
          }
        }
      }
    }
    .ct-table {
      .ct-tableheader {
        background-color: #f7f8fa;
        color: #777777;
        display: flex;
        span {
          text-align: center;
          height: 40px;
          line-height: 40px;
          &:nth-child(1) {
            width: 50%;
          }
          &:nth-child(2) {
            width: 25%;
          }
          &:nth-child(3) {
            width: 25%;
          }
        }
      }
      .ct-tablebody {
        max-height: 360px;
        overflow-y: scroll;
        @include scrollBarStyle;
        .ct-item {
          display: flex;
          align-items: center;
          .el-input {
            width: 252px;
            margin: 10px 20px 20px 50px;
          }
          .el-select {
            width: 185px;
            margin: 10px 20px 20px 30px;
          }
          span {
            color: #bf2f2d;
            margin: 10px 0 20px 56px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
