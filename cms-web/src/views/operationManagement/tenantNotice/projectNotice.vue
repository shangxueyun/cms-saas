<template>
  <div class="projectNotice">
    <p class="page_head_title">客户通知</p>
    <div class="hourse_container">
      <ul class="default_tab_block">
        <li class="active" v-if="hasAuthority('02030601')">项目公告</li>
        <li @click="toActivityNotice" v-if="hasAuthority('02030604')">活动通知</li>
      </ul>
      <div class="search-bar">
        <div>
          <el-select v-model="projectId"
                     style="width:200px;">
            <el-option v-for="(item,index) in projectManagementsList"
                       :key="index"
                       :label="item.referred"
                       :value="item.id"></el-option>
          </el-select>
          <el-input v-model="name"
                    size="small"
                    placeholder="请输入标题"
                    maxlength="50"></el-input>
          <el-date-picker style="margin-right: 0"
                          size="small"
                          v-model="startDate"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="开始日期">
          </el-date-picker>
          <span style="color: #999;padding: 0 5px">-</span>
          <el-date-picker style="margin-right: 20px;"
                          size="small"
                          v-model="endDate"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="结束日期">
          </el-date-picker>
          <div style="margin-left:0;margin-top: 0;display: inline-block"
               @click="search"
               class="query-btn">查询</div>
        </div>
        <div>
          <el-button class="tban tban1"
                     v-if="hasAuthority('02030602')"
                     @click="openDialog"><i class="iconfont icon-crm_xinzeng-"></i> 新增公告</el-button>
        </div>
      </div>
      <div class="hourse-table">
        <div class="table">
          <el-table :data="tableData"
                    style="width: 100%">
            <el-table-column label="项目"
                             prop="projectManagementName"
                             align="center">
            </el-table-column>
            <el-table-column prop="title"
                             label="标题"
                             align="center"></el-table-column>
            <!-- <el-table-column prop="content"
                             label="内容"
                             align="center"></el-table-column> -->
            <el-table-column label="公告显示起止时间"
                             align="center">
              <template slot-scope="scope">
                {{formateData(scope.row.startTime)}}至{{formateData(scope.row.endTime)}}
              </template>
            </el-table-column>
            <el-table-column label="状态"
                             align="center">
              <template slot-scope="scope">
                {{formateStatus(scope.row.useStatus)}}
              </template>
            </el-table-column>
            <el-table-column label="操作"
                             v-if="hasAuthority('02030603')"
                             align="left">
              <template slot-scope="scope">
                <el-button @click="projectNoticeDetails(scope.$index, scope.row)"
                           class="operation-btn"
                           size="mini">
                  <span>查看</span>
                </el-button>
                <!-- <el-button @click="centerDialogHandler(scope.$index, scope.row,'USING')"
                         class="stopBtn"
                         size="mini"
                         v-if="hasAuthority('02030603') && scope.row.useStatus === 'DISABLE'">启用</el-button> -->
                <el-button @click="centerDialogHandler(scope.$index, scope.row,'DISABLE')"
                         class="stopBtn"
                         size="mini"
                         v-if="hasAuthority('02030603') && scope.row.useStatus === 'USING'|| scope.row.useStatus === null">停用</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="ctc-foot1"
             v-if="tableData.length > 0">
          <span><span style="margin-right:10px">{{pager.currentPage}}/{{Math.ceil(pager.total/pager.pgSize)}}页</span> 共{{pager.total}}条记录</span>
          <el-pagination v-if="pager.total > 0"
                         background
                         layout="prev, pager, next"
                         :page-size="pager.pgSize"
                         :total="pager.total"
                         :current-page.sync="pager.currentPage"
                         @current-change="current_change">
          </el-pagination>
          <div class="pagingnum">
            显示 <select v-model="pager.pgSize"
                    @change="pgSizeSelectFn">
              <option v-for="item in pager.pgNumoptions"
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
    <el-dialog title="新增公告"
               class="el_dialog_new"
               :close-on-click-modal="false"
               :visible.sync="dailyDialog"
               @close="dailyDialogClose"
               width="600px">
      <div class="dialog_content">
        <el-form :model="addData"
                 :rules="rules"
                 ref="addData">
          <el-form-item prop="projectManagementId"
                        style="width:100%">
            <div style="padding: 10px 0;">项目<span style="color: red">*</span></div>
            <el-select v-model="addData.projectManagementId">
              <el-option v-for="(item,index) in projectManagementsList"
                         :key="index"
                         :label="item.referred"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="title"
                        style="width:100%">
            <div style="padding: 10px 0;">标题<span style="color: red">*</span></div>
            <el-input v-model="addData.title"
                      maxlength="50"
                      placeholder="请输入标题"
                      style="display: inline-block"></el-input>
          </el-form-item>
          <el-form-item prop="startTime" style="width:100%">
            <div style="padding: 10px 0;"><span>公告显示起止时间<i class="required">*</i></span></div>
            <el-date-picker v-model="timePicker"
                            style="width: 100%"
                            type="datetimerange"
                            size="small"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            @change="timePickerChange"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="content"
                        style="width:100%">
            <div style="padding: 10px 0;">内容<span style="color: red">*</span></div>
            <richTextEditor @setEditor="setEditor"
                            :dialogFormVisible="dailyDialog"
                            ref="richTextEditor" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"
           class="slotfooter">
        <span @click="dailyDialogClose"
              class="details_cannelBtn">取消</span>
        <span @click="addProjectNotice('addData')"
              class="details_submitBtn">确定</span>
      </div>
    </el-dialog>
    <el-dialog
      title=""
      :visible.sync="centerDialogVisible"
      class="lockDialogClose"
      width="20%"
      center>
      <div class="lockDialogContent">
        <img src="../../../assets/delete1.png">
        <div>
          <p>公告停用</p>
          <span>确认停用该公告吗？</span>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <span @click="centerDialogVisible = false">取 消</span>
        <span @click="useStatusChange">确 定</span>
      </span>
    </el-dialog>
    <ProjectNoticeDetails :showDrawer="showDetails"
                          :detailsData="detailsData"
                          @drawerClose='drawHandleClose'>
    </ProjectNoticeDetails>
  </div>
</template>
<script>
import axios from 'axios'
import context from '@/service'
import * as hub from '@/service/eventHub'
import richTextEditor from '@/components/richTextEditor.vue'
import ProjectNoticeDetails from './components/ProjectNoticeDetails'
import aliUpload from '@/components/aliUpload.vue'
import { type } from 'os'
export default {
  name: 'projectNotice',
  components: {
    richTextEditor,
    ProjectNoticeDetails,
    aliUpload
  },
  data () {
    return {
      projectId: '',
      name: '',
      startDate: '',
      endDate: '',
      projectManagementsList: [],
      tableData: [],
      showDetails: false,
      showPicture: false,
      addData: {
        projectManagementId: '',
        title: '',
        startTime: '',
        content: ''
      },
      pager: {
        currentPage: 1,
        pgNum: 1,
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
      },
      rules: {
        projectManagementId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      detailsData: {},
      dailyDialog: false,
      timePicker: '',
      centerDialogVisible: false
    }
  },
  watch: {

  },
  created () {
    this.projectManagementsList = this.$store.state.projectManagementsList
  },
  mounted () {
    this.query()
  },
  methods: {
    openDialog (type) {
      this.dailyDialog = true
    },
    current_change (currentPage) {
      this.pager.currentPage = currentPage
      this.query()
    },
    pgSizeSelectFn () {
      this.pager.currentPage = 1
      this.query()
    },
    search () {
      this.pager.currentPage = 1
      this.query()
    },
    addProjectNotice () {
      this.$refs['addData'].validate((valid) => {
        if (valid) {
          const postData = JSON.parse(JSON.stringify(this.addData))
          postData.startTime = postData.startTime.replace(' ', 'T') + 'Z'
          postData.endTime = postData.endTime.replace(' ', 'T') + 'Z'
          context.http.post('/cms/api/projectNotice', postData).then(res => {
            if (res.status === 201 || res.status === 200) {
              this.$message({
                type: 'success',
                message: '新增成功'
              })
              this.dailyDialogClose()
              this.query()
            }
          }).catch(error => {
            console.info(error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    query () {
      context.http.get('/cms/api/projectNotice', {
        projectId: this.projectId,
        name: this.name,
        startDate: this.startDate ? this.startDate.replace(' ', 'T') : '',
        endDate: this.endDate ? this.endDate.replace(' ', 'T') : '',
        page: (this.pager.currentPage - 1),
        size: this.pager.pgSize,
        sort: 'createdDate,desc'
      }).then(res => {
        if (res.status === 200) {
          this.tableData = res.data
          this.pager.total = Number(res.headers['x-total-count'])
        }
      })
    },
    toActivityNotice () {
      this.$router.replace({ name: 'activityNotice' })
    },
    dailyDialogClose () {
      this.$refs['addData'].resetFields()
      this.timePicker = ''
      this.dailyDialog = false
    },
    drawHandleClose () {
      this.showDetails = false
    },
    projectNoticeDetails (index, row) {
      context.http.get(`/cms/api/projectNotice/${row.id}`).then(res => {
        if (res.status === 200) {
          this.detailsData = res.data
          this.showDetails = true
        }
      })
    },
    setEditor (html) {
      this.addData.content = html
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    formateData (val) {
      if (val) {
        return val.replace('T', '  ')
      } else {
        return '-'
      }
    },
    formateStatus (val) {
      if (val === null || val === 'USING') {
        return '使用中'
      } else {
        return '已停用'
      }
    },
    delEnclosure (index) {
      this.addData.annexes.splice(index, 1)
    },
    timePickerChange (timeArr) {
      if (timeArr && timeArr.length) {
        if (timeArr[0] === timeArr[1]) {
          this.$message({
            type: 'error',
            message: '开始时间不能等于结束时间'
          })
          this.timePicker = ''
          this.addData.startTime = ''
          this.addData.endTime = ''
        } else {
          this.addData.startTime = timeArr[0]
          this.addData.endTime = timeArr[1]
        }
      } else {
        this.addData.startTime = ''
        this.addData.endTime = ''
      }
    },
    centerDialogHandler (index, row, status) {
      this.dialogRow = row
      this.dialoStatus = status
      if (status === 'USING') {
        this.useStatusChange()
      } else {
        this.centerDialogVisible = true
      }
    },
    useStatusChange () {
      const row = this.dialogRow
      const status = this.dialoStatus
      context.http.put(`cms/api/projectNotice/useStatus?id=${row.id}&useStatus=${status}`).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.centerDialogVisible = false
        this.query()
      }).catch(error => {
        console.info(error)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
// @import "../../../../style/mixins";
ul,
li {
  list-style: none;
}
.hourse_search .el-input .el-input__inner {
  width: 180px;
  height: 32px;
  line-height: 32px;
  position: absolute;
  left: 0;
  top: 0;
}
.projectNotice {
  font-size: 16px;
  background-color: #f9f9f9;
  .hourse_container {
    background-color: #f9f9f9;
    .default_tab_block {
      font-size: 14px;
    }
    .hourse_search {
      background-color: #fff;
      margin: 20px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      .search-top {
        border-bottom: 1px solid #ecedef;
        padding-bottom: 18px;
        padding-left: 18px;
        .el-input {
          width: 180px;
          height: 32px;
          display: block;
          margin-top: 18px;
        }
        div {
          float: left;
          display: inline-block;
        }
        div {
          cursor: pointer;
        }
      }
      .search-bottom {
        padding-left: 18px;
        padding: 20px 18px 20px;
        dl {
          display: flex;
          font-size: 12px;
          line-height: 18px;
          dt {
            color: #333333;
          }
          dd {
            display: flex;
            color: #666;
            margin-right: 16px;
            span {
              display: block;
              &:first-child {
                margin-right: 5px;
              }
              &:last-child {
                font-size: 18px;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
    .hourse_tab {
      height: 60px;
      display: flex;
      background-color: #fff;
      margin: 10px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      justify-content: space-between;
      align-items: center;
      padding-right: 44px;
      border-bottom: 1px solid #ecedef;
      .nav {
        display: flex;
        li {
          width: 160px;
          text-align: center;
          font-size: 14px;
          color: #666;
          height: 58px;
          line-height: 58px;
          border-bottom: 2px solid #fff;
          cursor: pointer;
          &.select_active {
            border-bottom: 2px solid #3175d2;
            color: #3175d2;
            font-weight: bolder;
          }
        }
      }
    }
    .search-bar {
      flex-wrap: wrap;
      background-color: #fff;
      .navSelected {
        background-color: #0f75ff !important;
        color: #fff !important;
      }
      > div {
        display: inline-flex;
        align-items: center;
        .el-input {
          display: inline-block;
          width: 195px;
        }
      }
    }
    .report-list {
      background-color: #fff;
      padding: 30px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(249, 249, 249, 1);
      box-shadow: -3px 0px 6px 0px rgba(184, 184, 184, 0.2);
      border-radius: 0px 4px 4px 4px;
      margin-top: 4px;
      position: relative;
      .label {
        position: absolute;
        top: 0;
        left: 0;
        display: inline-block;
        width: 30px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        border-radius: 0px 2px 2px 0px;
        font-size: 12px;
        color: #fff;
      }
      .public {
        background-color: #65ac69;
      }
      .private {
        background-color: #5e72e4;
      }
      .rl-content {
        display: flex;
        justify-content: flex-start;
        font-size: 14px;
        p {
          margin-bottom: 6px;
        }
        .head-portrait {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 1px solid #dadada;
          img {
            border-radius: 50%;
          }
        }
        .usinfo {
          margin: 4px 0 0 30px;
          p {
            &:first-child {
              font-size: 14px;
            }
            font-size: 12px;
            color: #333;
          }
        }
        .content {
          width: 510px;
          margin: 4px 0 0 140px;
        }
        .enclosure {
          margin: 4px 0 0 20px;
        }
        .reportImg {
          width: 100px;
          height: 100px;
          margin-left: 10px;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .msg-operation {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        margin: 20px 0 20px 0;
        color: #656565;
        font-size: 12px;
        .icon {
          display: inline-block;
          width: 20px;
          height: 20px;
          margin-right: 4px;
          cursor: pointer;
        }
        .qrcode {
          background: url(../../../assets/qrcode.png) no-repeat;
          background-size: contain;
        }
        .pinglun {
          background: url(../../../assets/pinglun.png) no-repeat;
          background-size: contain;
        }
      }
      .comment {
        border-top: 1px solid #eaeaea;
        font-size: 12px;
        color: #333;
        div {
          padding: 10px 0 10px 10px;
          border-top: 1px solid #f3f3f3;
        }
      }
    }
  }
  .el-dialog {
    width: 520px !important;
    .el-select {
      width: 100%;
    }
  }
  .add-adily {
    .addEnclosure {
      display: inline-block;
      width: 70px;
      height: 24px;
      line-height: 22px;
      text-align: center;
      border: 1px solid rgba(53, 119, 246, 1);
      color: #3577f6;
      border-radius: 4px;
      background-color: #fff;
      font-size: 12px;
      cursor: pointer;
      position: relative;
      .flinput {
        width: 70px;
        height: 24px;
      }
    }
    .enclosure-list {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      border-bottom: 1px solid #ebebeb;
      span {
        margin-bottom: 6px;
      }
      i {
        cursor: pointer;
      }
    }
    .addimg {
      display: inline-block;
      width: 130px;
      height: 102px;
      line-height: 102px;
      text-align: center;
      border: 1px dashed rgba(204, 204, 204, 1);
      border-radius: 6px;
      font-size: 20px;
      color: #0f75ff;
      cursor: pointer;
      position: relative;
      .flinput {
        width: 130px;
        height: 102px;
      }
      img {
        width: 100%;
        height: 100%;
      }
      .icon-shanchu {
        position: absolute;
        top: -9px;
        right: -10px;
        color: #cccccc;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        line-height: 18px;
        text-align: center;
        font-size: 16px;
        z-index: 1;
        background: url(../../../assets/closed.png) no-repeat;
        background-size: contain;
        border: 1px solid #dadadd;
      }
    }
    .flinput {
      position: absolute;
      top: 0;
      right: 0;
      opacity: 0;
      cursor: pointer;
    }
  }
  .default-hportrait {
    background-color: #409eff;
    line-height: 80px;
    text-align: center;
    color: #fff;
  }
  .page {
    display: flex;
    justify-content: space-between;
  }
  .select-wrap {
    padding: 10px 0 0 0;
    position: relative;
    i.icon-bottom {
      position: absolute;
      right: 10px;
      top: 47px;
      cursor: pointer;
    }
  }
  .select-span {
    min-height: 33px;
    max-height: 66px;
    overflow-y: scroll;
    margin-bottom: 10px;
    border: 1px solid #e7e7e7;
    border-radius: 4px;
    margin-top: 10px;
    padding-right: 24px;
    span {
      display: inline-block;
      min-width: 78px;
      height: 25px;
      line-height: 25px;
      background-color: #eaf1fe;
      color: #487ff7;
      border-radius: 8px;
      text-align: center;
      padding: 0 6px;
      margin: 6px 0 6px 6px;
      font-size: 12px;
      i {
        font-size: 12px;
        float: right;
        cursor: pointer;
      }
    }
  }
  .disable {
    background-color: #e7e7e7;
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px #e7e7e7;
      box-shadow: inset 0 0 6px #e7e7e7;
      border-radius: 10px;
      background-color: #e7e7e7;
    }
  }
  .organization {
    border: 1px solid transparent;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
    height: 280px;
    overflow-y: scroll;
    > .el-input {
      width: 90%;
      margin: 10px 0 10px 25px;
      input {
        border: none;
        background-color: #fafafa;
      }
    }
  }
  .textarea textarea {
    height: 160px;
  }
  .sub-comments-leave-active,
  .sub-comments-enter-active {
    transition: max-height 0.3s;
  }
  .sub-comments-enter,
  .sub-comments-leave-to {
    max-height: 0;
  }
  .sub-comments-enter-to,
  .sub-comments-leave {
    max-height: 280px;
  }
}
.red-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 8px;
  background-color: #eb605b;
  position: relative;
  left: -50px;
}
@media (min-width: 1400px) and (max-width: 1600px) {
  .query-btn {
    margin-top: 0 !important;
  }
}
@media screen and (max-width: 1600px) {
  .add-notice,
  .add-news {
    margin-bottom: 15px !important;
  }
  .el-input__inner {
    line-height: 40px !important;
  }
}
.lockDialogClose {
  .el-dialog__body{
    background: #fff;
  }
  .lockDialogContent {
    display: -ms-flexbox;
    display: flex;
    justify-content: center;
    div {
      margin-left: 15px;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      flex-direction: column;
      justify-content: space-evenly;
      p {
        color: #666666;
        font-size: 20px;
        font-weight: 600;
        width: 100%;
      }
    }
  }
  .el-dialog__footer {
    .dialog-footer {
      border: none;
      margin-right: 0;
    }
  }
}
</style>
