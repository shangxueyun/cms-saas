
<template>
  <div class="floorManagement">
    <span class="page_head_title">小程序设置</span>
    <ul class="default_tab_block"
        v-if="hasAuthority('050801') && hasAuthority('050802') ">
      <li @click="changeNav(0)"><span>轮播图设置</span></li>
      <li class="active"
          @click="changeNav(1)"><span>基本设置</span></li>
    </ul>
    <div class="search-bar">
      <div>
        <el-select v-model="projectManagementId"
                   clearable
                   placeholder="项目">
          <el-option v-for="item in options1"
                     :key="item.id"
                     :label="item.referred"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="useStatus"
                   clearable>
          <el-option label="上线"
                     value="USING"></el-option>
          <el-option label="下线"
                     value="DISABLE"></el-option>
        </el-select>
        <span class="query-btn"
              @click="queryList()">查询</span>
      </div>
      <div v-if="hasAuthority('05080201')">
        <el-button class="tban tban1"
                   @click="addbasicSetting"><i class="iconfont icon-crm_xinzeng-"></i> 新增设置</el-button>
      </div>
    </div>
    <div class="plc-table">
      <el-table :data="tableData"
                :key="tableKey"
                style="width: 100%"
                ref="multipleTable">
        <el-table-column prop="referred"
                         label="项目"
                         align="center"></el-table-column>
        <el-table-column prop="name"
                         label="小程序中显示的项目名称"
                         align="center"></el-table-column>
        <el-table-column prop="customerTelephone"
                         label="客服电话"
                         align="center"></el-table-column>
        <el-table-column label="状态"
                         align="center">
          <template slot-scope="scope">
            <span>{{reviewStatus(scope.row.useStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column width="200"
                         label="操作"
                         v-if="hasAuthority('05080202')"
                         style="padding-left: 50px;"
                         align="left">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.$index, scope.row)"
                       class="el-button--primary operation-btn"
                       size="mini">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="ctc-foot1"
         v-if="total > 0">
      <span><span style="margin-right:10px">{{currentPage}}/{{Math.ceil(total/pgSize)}}页</span> 共{{total}}条记录</span>
      <el-pagination background
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
    <!-- 新增基础设置 -->
    <el-dialog class="el_dialog_new basicSetDialog"
               title="基本设置"
               width="400px"
               @close="basicSettingClose"
               :visible.sync="basicSettingVisible"
               :close-on-click-modal="false">
      <div class="dialog_content">
        <el-form :model="createForm"
                 :rules="createRulese"
                 ref="createaccount">
          <el-form-item prop="projectManagementId">
            <div class="itemtitle"
                 style="margin-bottom:10px">项目<i class="required">*</i></div>
            <el-select v-model="createForm.projectManagementId"
                       size="small"
                       @change="projectChange"
                       style="width:370px"
                       placeholder="请选择">
              <el-option v-for="item in options1"
                         :key="item.id"
                         :label="item.referred"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="name">
            <div class="itemtitle"
                 style="margin-bottom:10px">小程序中显示的项目名称<i class="required">*</i></div>
            <el-input v-model="createForm.name"
                      style="width:370px"
                      size="small"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="itemtitle"
                 style="margin-bottom:10px">客服电话</div>
            <el-input v-model="createForm.customerTelephone"
                      style="width:370px"
                      @input="createForm.customerTelephone=createForm.customerTelephone.replace(/[^0-9]/g,'')"
                      size="small"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"
           class="slotfooter">
        <span class="details_cannelBtn"
              @click="basicSettingClose">取消</span>
        <span class="details_submitBtn"
              @click="addBasicSetting">确定</span>
      </div>
    </el-dialog>
    <!-- 详情/编辑 -->
    <el-drawer class="newDrawer basicSetDraw"
               :visible.sync="detailsdrawershow"
               :wrapperClosable="false"
               size="500px"
               @close="drawerClose"
               :append-to-body="true">
      <div slot="title"
           class="drawerTitle">
        <p class="title">基本设置</p>
        <span class="editBtn"
              @click="onEdit"
              v-if="hasAuthority('05080203') && readOnly">
          <i class="iconfont icon-edit1"></i>
          编辑
        </span>
      </div>
      <div class="main_content">
        <div class="el_drawer_body">
          <div class="dr-head"><span class="vertical"></span>基础信息</div>
          <div class="main_body">
            <el-form :model="detalisForm"
                     :rules="createRulese"
                     ref="detalisForm">
              <el-form-item prop="projectManagementId">
                <div class="itemtitle">项目<i class="required">*</i></div>
                <div v-if="readOnly">{{detalisForm.referred}}</div>
                <el-select v-model="detalisForm.projectManagementId"
                           @change="projectChange"
                           size="small"
                           v-else
                           placeholder="请选择">
                  <el-option v-for="item in options1"
                             :key="item.id"
                             :label="item.referred"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="name">
                <div class="itemtitle">小程序中显示的项目名称<i class="required">*</i></div>
                <div v-if="readOnly">
                   {{detalisForm.name}}
                </div>
                <el-input v-model="detalisForm.name"
                          size="small"
                          v-else
                          placeholder="请输入内容">
                </el-input>
              </el-form-item>
              <el-form-item>
                <div class="itemtitle">客服电话</div>
                <div v-if="readOnly">{{detalisForm.customerTelephone}}</div>
                <el-input v-model="detalisForm.customerTelephone"
                          size="small"
                          v-else
                          placeholder="请输入内容">
                </el-input>
              </el-form-item>
              <el-form-item>
                <div class="itemtitle">状态</div>
                <div v-if="readOnly">{{detalisForm.useStatus==='USING'?'上线':'下线'}}</div>
                <el-select v-model="detalisForm.useStatus"
                           v-else
                           size="small">
                  <el-option label="上线"
                             value="USING"></el-option>
                  <el-option label="下线"
                             value="DISABLE"></el-option>

                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="el_drawer_foot"
             v-if="!readOnly">
          <span class="details_submitBtn"
                @click="submitFun">保存</span>
          <span class="details_cannelBtn"
                @click="cannelFun">取消</span>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import context from '@/service'
export default {
  name: 'floorManagement',
  components: {

  },
  data () {
    return {
      tableKey: 0,
      detailsdrawershow: false,
      projectManagementId: '',
      useStatus: 'USING',
      createForm: {
        projectManagementId: '',
        name: '',
        customerTelephone: ''
      },
      detalisForm: {
        projectManagementId: '',
        name: '',
        customerTelephone: ''
      },
      createRulese: {
        projectManagementId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入小程序中显示的项目名称', trigger: 'change' }
        ]
      },
      basicSettingVisible: false,
      title: '查看',
      dialogVisible: false,
      options1: [],
      tableData: [1],
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
      ],
      readOnly: true,
      floorData: {},
      floorOptions: [],
      floorName: '',
      dialogStep1: true,
      isToExamine: false
    }
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
    this.query()
  },
  mounted () {

  },
  methods: {
    cannelFun () {
      context.http.get(`crm/api/projectManagementSetups/${this.detalisForm.id}`).then(res => {
        if (res.status === 200) {
          this.readOnly = true
          this.detalisForm = res.data
        }
      })
    },
    projectChange (id) { // 选择项目后应自动将项目全称带入小程序中显示的项目名称
      this.options1.forEach((item, index) => {
        if (id === item.id) {
          this.createForm.name = item.projectName
          this.detalisForm.name = item.projectName
          this.detalisForm.referred = item.referred
        }
      })
    },
    submitFun () {
      this.$refs['detalisForm'].validate((valid) => {
        if (valid) {
          context.http.put(`crm/api/projectManagementSetups`, this.detalisForm).then(res => {
            if (res) {
              this.$message.success('修改成功')
              this.detalisForm = res.data
              this.query()
              console.log(this.detalisForm)
              this.readOnly = true
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
    drawerClose () {
      this.detailsdrawershow = false
      this.readOnly = true
    },
    handleEdit (index, row) {
      context.http.get(`crm/api/projectManagementSetups/${row.id}`).then(res => {
        if (res.status === 200) {
          this.detalisForm = res.data
          this.detailsdrawershow = true
        }
      })
    },
    reviewStatus (val) {
      let res = ''
      if (val === 'USING') {
        res = '上线'
      } else {
        res = '下线'
      }
      return res
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    async query () {
      let result = await context.http.get('crm/api/projectManagementSetups', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        projectManagementId: this.projectManagementId,
        useStatus: this.useStatus,
        sort: 'id,desc'
      })
      this.tableData = result.data
      this.tableKey++
      this.total = Number(result.headers['x-total-count'])
    },
    queryList () {
      this.currentPage = 1
      this.query()
    },
    addBasicSetting () { // 新增设置
      this.$refs['createaccount'].validate((valid) => {
        if (valid) {
          context.http.post(`crm/api/projectManagementSetups`, this.createForm).then(res => {
            if (res) {
              this.$message.success('新增成功')
              this.query()
              this.basicSettingClose()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addbasicSetting () {
      this.basicSettingVisible = true
    },
    basicSettingClose () {
      this.createForm = {
        projectManagementId: '',
        name: '',
        customerTelephone: ''
      }
      this.$refs['createaccount'].resetFields()
      this.basicSettingVisible = false
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    changeNav (inx) {
      if (inx === 0) {
        this.$router.push('/home/AppletSetup')
      } else if (inx === 1) {
        this.$router.push('/home/BasicSettings')
      }
    },
    changeStep (inx) {
      if (inx === 0) {
        this.dialogStep1 = true
      } else {
        this.dialogStep1 = false
      }
    },
    nextStep () {
      this.dialogStep1 = false
      this.$refs.floorDetail.nextStep()
    },
    previousStep () {
      this.dialogStep1 = true
      this.$refs.floorDetail.previousStep()
    },
    formatTime (row, column) {
      return row.updateTime.replace('T', ' ')
    },
    close () {
      this.query()
      this.dialogVisible = false
    },
    adopt () {
      this.$refs.floorDetail.adopt()
    },
    Reject () {
      this.$refs.floorDetail.Reject()
    },
    saveEdit (type) {
      this.$refs.floorDetail.saveEdit(type)
    },
    confirm (type) {
      this.$refs.addRule.confirm(type)
    }
  }
}
</script>
<style lang="scss">
.basicSetDialog {
  .el-dialog__header {
    margin-bottom: 0 !important;
    border-bottom: 1px solid #f7f7f7 !important;
  }
  .el-dialog__footer {
    margin-top: 0 !important;
    > .slotfooter {
      margin-top: 0 !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.floorManagement {
  .dl-head {
    margin-bottom: 20px !important;
  }
  .info_tab {
    height: 48px;
    display: -ms-flexbox;
    display: flex;
    background-color: #fff;
    box-shadow: 1px 2px 5px #eee;
    border-radius: 3px;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -ms-flex-align: center;
    align-items: center;
    padding-right: 44px;
    border-bottom: 1px solid #ecedef;
    margin-top: 15px;
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
  .plc-search {
    min-height: 70px;
    line-height: 0;
    background-color: #fff;
    margin: 20px 0;
    padding-left: 18px;
    padding-right: 18px;
    box-shadow: 1px 2px 5px #eee;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -ms-flex-pack: justify;
    justify-content: space-between;
    align-items: center;
    position: relative;
    > div {
      > div {
        margin-right: 15px;
      }
    }
  }
  .storage-button {
    background: rgba(242, 245, 250, 1) !important;
    border: 1px solid #3575f6 !important;
    color: #3575f6 !important;
  }
  .btndiv {
    .storage-button {
      background: rgba(242, 245, 250, 1) !important;
      border: 1px solid #3575f6 !important;
      color: #3575f6 !important;
      margin: 0 10px;
    }
  }
  .offlineBtn {
    display: inline-block;
    width: 56px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    border: 1px solid #f3af2c;
    border-radius: 3px;
    color: #f3af2c;
    cursor: pointer;
    // margin-top: 3px;
    // margin-left: 10px;
  }
}
.drawBody {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
<style lang="scss">
.floorManagement {
  .el-dialog__footer {
    padding-top: 20px;
  }
  .el-dialog__header {
    padding-left: 0;
  }
  .butwarp {
    .cell {
      text-align: left;
    }
  }
}
</style>
