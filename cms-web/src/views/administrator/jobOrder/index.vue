<template>
  <div class="jobOrder">
    <span class="page_head_title">通知单配置</span>
    <div class="search-bar">
      <span>
        <el-select v-model="projectManagementId"
                   placeholder="选择项目"
                   style="width:200px;"
                   clearable>
          <el-option v-for="item in options1"
                     :key="item.id"
                     :label="item.referred"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="status"
                   placeholder=""
                   style="width:200px"
                   clearable>
          <el-option value="USING"
                     label="使用中"></el-option>
          <el-option value="DISABLE"
                     label="已停用"></el-option>
        </el-select>
        <div class="query-btn"
             @click="query">查询</div>
      </span>
      <el-button class="tban tban1"
                 @click="addJobOrder"
                 v-if="hasAuthority('01020601')"><i class="iconfont icon-crm_xinzeng-"></i> 新增通知单</el-button>
    </div>
    <div class="table">
      <el-table :data="tableData"
                style="width: 100%">
        <el-table-column label="项目简称"
                         prop="projectManagementRefferd"
                         align="center"></el-table-column>
        <el-table-column label="通知单名称"
                         prop="name"
                         align="center"></el-table-column>
        <el-table-column label="通知单模版"
                         align="center">
          <template slot-scope="scope">
            <span style="position:relative;display: block;color:#3577f6;"
                  title="点击下载附件">
              <span>{{scope.row.annexName}}</span>
              <aliDownLoad class="aliDownLoad1"
                           :item="scope.row"
                           :encrypt="true" />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="通知单状态"
                         prop="billNoticeStatus"
                         align="center"
                         :formatter="formatterBillNoticeStatus"></el-table-column>
        <el-table-column label="操作"
                         align="center"
                         v-if="hasAuthority('01020602')">
          <template slot-scope="scope">
            <el-button @click="checkDetails(scope.$index, scope.row)"
                       class="el-button--primary operation-btn"
                       size="mini">查看</el-button>
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
    <!-- 新增通知单 -->
    <el-dialog title="设置通知单"
               :visible.sync="addJobOrderDialogVisible"
               class="addJobOrderDialog"
               width="900px"
               @close="addJobOrderClose">
      <el-form :model="addData"
               :rules="addFlowRules"
               ref="addData">
        <div class="content">
          <div class="header">
            <span>
              项目简称<span class="required">*</span>
              <el-form-item prop="projectManagementId">
                <el-select v-model="addData.projectManagementId"
                           placeholder="选择项目"
                           size="small"
                           style="width:250px;margin-right:50px;"
                           clearable>
                  <el-option v-for="item in options1"
                             :key="item.id"
                             :label="item.referred"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </span>
            <span>
              通知单名称<span class="required">*</span>
              <el-form-item prop="name">
                <el-input style="width:250px;margin-right:50px;"
                          size="small"
                          v-model="addData.name"></el-input>
              </el-form-item>
            </span>
          </div>
          <div class="keyword">
            <div>关键词复制</div>
            <div class="keywordCOntent">
              <input type="text"
                     id="copyInput"
                     class="copyInput">
              <span class="item"
                    @click="copyInputFn(item.name)"
                    v-for="(item,index) in copyList.auto"
                    :key="index">{{item.name}}</span>
            </div>
          </div>
          <div class="customKeyword">
            <div class="title">
              <span>自定义关键词</span>
            </div>
            <div class="customKeywordContent">
              <div class="newItem noBorder">
                <i class="icon-add iconfont"></i>
                <span>新增关键词</span>
                <span class="sep"></span>
                <el-input style="width:208px"
                          class="newKeyWord"
                          max-length="20"
                          size="small"
                          placeholder="请输入关键词"
                          v-model="newKeyWord"
                          onkeyup="this.value=this.value.replace(/^\s+|\s+$/g,'')"></el-input>
                <div @click="addKeyword"
                     class="addKeyword">添加</div>
              </div>
              <span style="font-size:12px;color:#999;">（Tips:如‘${客户名称}’则输入‘客户名称’即可）</span>
              <div class="keywordCOntent"
                   style="background:none">
                <span class="item"
                      @click="copyInputFn(item.name)"
                      v-for="(item,index) in copyList.custom"
                      :key="index">{{item.name}}</span>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-top:15px;background-color: #fff; padding-bottom: 20px;">
          <div class="half_page_title">
            <div>
              <i></i>模版<span class="required">*</span>
              <span style="color:#999;font-style: normal; font-size: 12px;font-weight: normal;">
                （word模版中的字体只支持等线、微软雅黑、宋体）
              </span>
            </div>
          </div>
          <div v-if="addData.annexName"
               class="costFile"
               style="margin:5px 15px">
            <span style="font-size:12px">{{addData.annexName}}</span>
            <i class="el-icon-delete"
               @click="delCostFile"></i>
          </div>
          <div class="aliUpload_cost"
               v-else>
            <aliUpload class="aliUpload"
                       style="margin-top:10px;"
                       :encrypt="true"
                       :upLoadText="upLoadText_cost"
                       :fileType="fileType_cost"
                       :iconShow="false"
                       :iconImg="iconImg"
                       :uploadIcon="true"
                       @setAnnex="setAnnex" />
          </div>
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer" style="padding-right: 15px;">
        <span @click="saveaddJobOrderFrom('addData')"
              class="details_submitBtn">确定</span>
        <span @click="addJobOrderClose"
              class="details_cannelBtn">取消</span>
      </div>
    </el-dialog>
    <!-- 通知单详情/编辑 -->
    <el-drawer :visible.sync="detailsdrawershow"
               :append-to-body="true"
               size="700px"
               @close="onHide"
               class="jobOrerDetails">
      <div slot="title"
           class="drawerTitle">
        <p>查看通知单</p>
        <span class="editBtn"
              @click="onEdit"
              v-if="readOnly && hasAuthority('01020603')">
          <i data-v-9c1f67fc=""
             aria-hidden="true"
             class="icon icon-edit2"></i>
          编辑
        </span>
      </div>
      <div class="drawBody content">
        <el-form :model="detailsData"
                 :rules="detailsDataRules"
                 ref="detailsData">
          <div class="item">
            <span>项目简称<i class="required">*</i></span>
            <el-form-item v-if="!readOnly"
                          prop="projectManagementId">
              <el-select v-model="detailsData.projectManagementId"
                         placeholder="选择项目"
                         style="width:200px"
                         clearable>
                <el-option v-for="item in options1"
                           :key="item.id"
                           :label="item.referred"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <p v-else
               class="readOnlyTxt">{{detailsData.projectManagementRefferd}}</p>
          </div>
          <div class="item">
            <span>通知单名称<i class="required">*</i></span>
            <el-form-item v-if="!readOnly"
                          prop="name">
              <el-input v-model="detailsData.name"
                        style="width:200px"></el-input>
            </el-form-item>
            <p v-else
               class="readOnlyTxt">{{detailsData.name}}</p>
          </div>
          <div class="item">
            <span>通知单状态<i class="required">*</i></span>
            <el-form-item v-if="!readOnly"
                          prop="billNoticeStatus">
              <el-select v-model="detailsData.billNoticeStatus"
                         style="width:200px">
                <el-option value="USING"
                           label="使用中"></el-option>
                <el-option value="DISABLE"
                           label="已停用"></el-option>
              </el-select>
            </el-form-item>
            <p v-else
               class="readOnlyTxt">{{formatterBillNoticeStatus(detailsData,'')}}</p>
          </div>
          <div class="item jobOrder">
            <span>通知单模版<i class="required">*</i></span>
            <el-form-item v-if="!detailsData.annexName">
              <div class="aliUpload_cost"
                   style="width:100px">
                <i class="el-icon-upload2"></i>
                <aliUpload class="aliUpload"
                           style="margin-top:10px;"
                           :encrypt="true"
                           :upLoadText="upLoadText_cost"
                           :fileType="fileType_cost"
                           :iconShow="false"
                           @setAnnex="setAnnex1" />
              </div>
            </el-form-item>
            <div v-else
                 class="costFile"
                 style="margin:5px;height: 40px;line-height: 40px;display: flex; align-items: center;">
              <span style="font-size:12px;white-space: nowrap; text-overflow: ellipsis; overflow: hidden;"
                    class="readOnlyTxt">{{detailsData.annexName}}</span>
              <i class="el-icon-delete"
                 @click="delCostFile1"
                 v-if="!readOnly"></i>
              <aliDownLoad v-else
                           class="aliDownLoad2"
                           :item="detailsData"
                           :encrypt="true" />
            </div>
          </div>
        </el-form>
        <div class="btndiv"
             style="margin-top: 50px; display: flex; flex-direction: row-reverse;padding-right: 30px;"
             v-if="!readOnly">
          <el-button type="primary"
                     style="width:100px;margin-left: 25px;"
                     @click="editSave('detailsData')">确认</el-button>
          <el-button style="width:100px"
                     @click="onHide">取消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import context from '@/service'
import aliDownLoad from '@/components/aliDownLoad.vue'
import aliUpload from '@/components/aliUpload.vue'
export default {
  name: 'jobOrder',
  components: {
    aliDownLoad,
    aliUpload
  },
  data () {
    return {
      iconImg: 'icon-shangchuanfujianicon',
      newKeyWord: null, // 新增自定义关键词
      readOnly: true,
      detailsData: {
        name: null,
        status: null,
        annexDTO: {
          annexName: null,
          annexURL: null,
          billNoticeStatus: null,
          name: null,
          projectManagementId: null
        }
      },
      detailsDataRules: {
        projectManagementId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入通知单名称', trigger: 'change' }
        ]
      },
      detailsdrawershow: false,
      fileType_cost: ['docx'],
      upLoadText_cost: '上传模板',
      copyList: [],
      addJobOrderpName: null,
      addJobOrderpProjectId: null, // 新增通知单项目id
      addData: {
        annexName: null,
        annexURL: null,
        billNoticeStatus: 'USING',
        name: null,
        projectManagementId: null
      },
      addFlowRules: {
        projectManagementId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入通知单名称', trigger: 'change' }
        ]
      },
      addJobOrderDialogVisible: false,
      projectManagementId: null,
      options1: [],
      status: 'USING',
      tableData: [],
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
    this.options1 = this.$store.state.projectManagementsList
    this.query()
  },
  mounted () {

  },
  methods: {
    addKeyword () {
      if (!this.newKeyWord || this.newKeyWord === '' || this.newKeyWord === ' ') {
        this.$message({
          type: 'error',
          message: '请输入关键词'
        })
        return
      }
      context.http.post('/cms/api/billNoticeKeyword', { name: '${' + this.newKeyWord + '}', KeyWordType: 'CUSTOM' }).then(res => {
        this.$message({
          type: 'success',
          message: '关键词新增成功'
        })
        this.newKeyWord = null
        this.addJobOrder()
      })
    },
    editSave (formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.detailsData.annexName || !this.detailsData.annexURL) {
            this.$message({
              type: 'error',
              message: '请上传附件'
            })
            return
          }
          delete this.detailsData.billNoticeKeywords
          context.http.put('/cms/api/billNoticeTemp', this.detailsData).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
              _this.onHide()
              _this.query()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onEdit () {
      this.readOnly = false
    },
    addJobOrder () {
      context.http.get(`cms/api/billNoticeKeyword`).then(res => {
        this.copyList = res.data
        this.addJobOrderDialogVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    delCostFile () {
      this.addData.annexURL = null
      this.addData.annexName = null
    },
    delCostFile1 () {
      this.detailsData.annexURL = null
      this.detailsData.annexName = null
    },
    setAnnex (annexURL, annexName) {
      this.addData.annexURL = annexURL
      this.addData.annexName = annexName
    },
    setAnnex1 (annexURL, annexName) {
      this.detailsData.annexURL = annexURL
      this.detailsData.annexName = annexName
    },
    copyInputFn (text) {
      var input = document.getElementById('copyInput')
      input.value = text
      input.select()
      document.execCommand('copy')
      this.$notify({
        title: '成功',
        duration: 1000,
        message: '复制成功',
        type: 'success'
      })
    },
    query () {
      context.http.get('/cms/api/billNoticeTemp?sort=projectManagement,asc&sort=createdDate,desc', { page: (this.currentPage - 1), size: this.pgSize, projectManagementId: this.projectManagementId, billNoticeStatus: this.status }).then(res => {
        this.tableData = res.data
        this.total = Number(res.headers['x-total-count'])
      })
    },
    saveaddJobOrderFrom (formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.addData.annexName || !this.addData.annexURL) {
            this.$message({
              type: 'error',
              message: '请上传附件'
            })
            return
          }
          context.http.post('/cms/api/billNoticeTemp', this.addData).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '新增成功'
              })
              _this.addJobOrderClose()
              _this.query()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addJobOrderClose () {
      this.addJobOrderDialogVisible = false
      this.addData.annexURL = null
      this.addData.annexName = null
      this.newKeyWord = null
      this.$refs['addData'].resetFields()
    },
    checkDetails (index, row) {
      context.http.get(`/cms/api/billNoticeTemp/${row.id}`).then(res => {
        this.detailsData = res.data
        this.detailsdrawershow = true
      }).catch(error => {
        console.log(error)
      })
    },
    onHide () {
      this.readOnly = true
      this.detailsdrawershow = false
    },
    formatterBillNoticeStatus (row, column) {
      if (row.billNoticeStatus === 'USING') {
        return '使用中'
      } else {
        return '已停用'
      }
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    }
  }
}
</script>
<style lang="scss">
.noBorder {
  .el-input__inner {
    border: none;
  }
}
.addJobOrderDialog {
  .el-dialog {
    background-color: #faf7fa;
    .el-dialog__header {
      padding: 0;
      margin: 0;
      height: 60px;
      line-height: 60px;
      background-color: #ffffff;
      padding-left: 15px;
      font-weight: bold;
      border: none;
      margin-bottom: 15px;
      .el-dialog__title {
        color: #262626;
        font-size: 16px;
      }
    }
    .el-dialog__body {
      margin: 0;
      height: 800px;
      overflow: auto;
      border: none;
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
    .el-dialog__footer {
      padding: 0;
      background-color: #ffffff;
      margin-top: 15px;
      .dialog-footer {
        height: 56px;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
      }
    }
  }
}
.jobOrerDetails {
  .aliDownLoad2 {
    width: auto !important;
    height: auto !important;
    color: #999;
    .icon-xiazaidaoru {
      display: block;
      width: 100%;
      height: 100%;
      color: #3a8ee6;
    }
    .icon-xiazaidaoru::before {
      content: "\e8c6";
    }
  }
}
.jobOrder {
  .aliUpload_cost {
    position: relative;
    margin-left: 15px;
    .el-icon-upload2 {
      position: absolute;
      top: 10px;
      left: 10px;
      color: #3577f6;
    }
    .oss_file {
      height: 30px;
      width: 100px;
      line-height: 30px;
      color: #3577f6;
      font-size: 12px;
      padding: 0;
      border: 1px solid #3577f6;
      border-radius: 3px;
    }
  }
  .aliDownLoad1 {
    // width: 100%!important;
    // height: 100%!important;
    // position: absolute;
    // top: 0;
    // left: 0;
    display: inline-block;
    margin-left: 15px;
    cursor: pointer;
    .icon-xiazaidaoru {
      display: block;
      width: 100%;
      height: 100%;
    }
    .icon-xiazaidaoru::before {
      // content: "";
    }
  }
}
</style>
<style lang="scss" scoped>
.jobOrerDetails {
  .drawBody {
    .el-form {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      // margin-bottom: 200px;
      > .item {
        width: 250px;
        flex-direction: column;
        margin-bottom: 30px;
        > span {
          display: block;
          margin-bottom: 5px;
        }
        .readOnlyTxt {
          font-size: 12px;
          color: #999;
          // height: 40px;
          // line-height: 40px;
          width: 300px;
          padding: 8px;
        }
      }
    }
  }
}
.jobOrder {
  .addJobOrderDialog {
    .content {
      color: #777777;
      background-color: #fff;
      padding: 15px;
      .header {
        display: flex;
      }
      .customKeyword {
        margin-top: 20px;
        .title {
          height: 40px;
          line-height: 40px;
          display: flex;
          align-items: center;
          i {
            margin-left: 30px;
            font-size: 30px;
            color: #999;
            cursor: pointer;
          }
        }
        .customKeywordContent {
          padding: 10px 0;
          .newItem {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            width: 350px;
            padding-left: 8px;
            > span {
              font-size: 12px;
              color: #777777;
              &:not(.sep) {
                margin: 0 5px;
              }
              &.sep {
                display: inline-block;
                width: 1px;
                height: 20px;
                background-color: #eeeeee;
              }
            }
            .addKeyword {
              height: 32px;
              line-height: 32px;
              border-top-right-radius: 4px;
              border-bottom-right-radius: 4px;
              background-color: #3575f6;
              color: #ffffff;
              width: 45px;
              cursor: pointer;
              text-align: center;
            }
          }
        }
      }
      .keywordCOntent {
        background-color: #f2f2f2;
        margin-top: 10px;
        padding: 15px;
        .copyInput {
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
          z-index: -10;
        }
        > span.item {
          border: 1px solid #d7d7d7;
          display: inline-block;
          height: 40px;
          line-height: 40px;
          font-size: 12px;
          text-align: center;
          padding: 0 10px;
          cursor: pointer;
          background-color: #fff;
          margin-right: 15px;
          margin-bottom: 10px;
          color: #262626;
          &:hover {
            color: #0066ff;
            border: 1px solid #0066ff;
          }
        }
      }
    }
  }
  .seachDiv {
    height: 80px;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    padding: 0 20px;
    justify-content: space-between;
    margin-top: 15px;
    .query-btn {
      display: inline-block;
      width: 120px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      cursor: pointer;
      color: #fff;
      border-radius: 3px;
      background-color: #3577f6;
    }
    .query-btn:hover {
      background-color: #2a6ef0;
    }
    .addbtn {
      margin-top: 0;
    }
  }
}
</style>

