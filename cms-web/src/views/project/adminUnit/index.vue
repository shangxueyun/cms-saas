<template>
  <div class="adminUnit"
       id="adminUnit">
    <el-row>
      <el-col :span="20"
              class="page_head_title"
              style="display: flex;">
        <div class="page_head_title"
             style="display: flex;"><i @click="toRouteReturn"
             class="el-icon-arrow-left"
             style=""></i> 关联单位列表</div>
      </el-col>
      <el-col :span="4">
        <el-button style="float:right"
                   @click="showAdminUnit"
                   class="tban tban1"><i class="iconfont icon-crm_xinzeng-"></i> 新增关联单位</el-button>
      </el-col>
    </el-row>
    <div class="adminUnit_table">
      <el-table :data="tableData"
                style="width: 100%">
        <el-table-column prop="deptName"
                         label="关联单位"
                         align="center"></el-table-column>
        <el-table-column prop="address"
                         label="办公地址"
                         align="center"></el-table-column>
        <el-table-column prop="deptTel"
                         label="联系电话"
                         align="center"></el-table-column>
        <el-table-column prop="contacts[0].name"
                         label="联系人"
                         align="center"></el-table-column>
        <el-table-column prop="contacts[0].post"
                         label="职务"
                         align="center"></el-table-column>
        <el-table-column prop="contacts[0].telephone"
                         label="手机"
                         align="center"></el-table-column>
        <el-table-column label="操作"
                         align="center">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.$index, scope.row)"
                       class="el-button--primary operation-btn"
                       size="mini">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="pager.total>0"
         class="ctc-foot">
      <span><span style="margin-right:10px">{{pager.currentPage}}/{{pager.totalPages}}页</span> 共{{pager.total}}条记录</span>
      <el-pagination v-if="pager.total > 0"
                     background
                     layout="prev, pager, next"
                     :page-size=pager.pgSize
                     :total="pager.total"
                     :current-page="pager.currentPage"
                     @current-change="current_change">
      </el-pagination>
      <div class="pagingnum">
        显示 <select v-model="pager.pgSize"
                @change="currentSel">
          <option v-for="item in pager.pgNumoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
          </option>
        </select>
        条目
      </div>
    </div>
    <el-dialog class="addadminUnit"
               title="新增关联单位"
               :visible.sync="adminUnitDialogVisible"
               :close-on-click-modal="false"
               width="500px"
               @close="adminUnitDialogcClose">
      <div class="content">
        <el-form :model="addData"
                 ref="addData"
                 :rules="addDataRules">
          <div class="form_item">
            <el-form-item prop="deptName">
              <div class="cttitle">关联单位<i class="required">*</i></div>
              <el-input v-model="addData.deptName"
                        placeholder="请输入内容"
                        style="flex:1"
                        maxlength="20"></el-input>
            </el-form-item>
            <el-form-item prop="address">
              <div class="cttitle">办公地址<i class="required">*</i></div>
              <el-input v-model="addData.address"
                        placeholder="请输入内容"
                        style="flex:1"
                        maxlength="50"></el-input>
            </el-form-item>
            <el-form-item>
              <div class="cttitle">联系电话</div>
              <el-input v-model="addData.deptTel"
                        placeholder="请输入内容"
                        style="flex:1"></el-input>
            </el-form-item>
            <el-form-item prop="introduction">
              <div class="cttitle">简介</div>
              <el-input type="textarea"
                        placeholder="请输入500字以内"
                        resize="none"
                        maxlength="500"
                        v-model="addData.introduction"
                        style="flex:1"></el-input>
            </el-form-item>
          </div>
          <div class="form_item form_table">
            <div class="table_content">
              <div class="table_header">
                <div>联系人<span style="color:red">*</span></div>
                <div>职务</div>
                <div>手机</div>
              </div>
              <div v-for="(item,index) in addData.contacts"
                   :key="index"
                   class="table_body">
                <el-form-item>
                  <el-input v-model="item.name"
                            placeholder="请输入内容"
                            maxlength="10"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input placeholder="请输入内容"
                            v-model="item.post"
                            maxlength="10"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input style="width:154px!important"
                            v-model="item.telephone"
                            placeholder="请输入内容"
                            maxlength="20"
                            onkeyup="value=value.replace(/[^0-9]/g,'')"></el-input>
                  <div class="toolContent">
                    <i class="iconfont icon-lajixiang"
                       v-if="index>0"
                       @click="subItem(item,index)"></i>
                  </div>
                </el-form-item>
              </div>
              <div class="addItem">
                <span @click="addItem()"><span class="iconfont icon-add-new"></span><span>继续添加</span></span>
              </div>
            </div>
          </div>

        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button style="background:#fff!important;border:0"
                   @click="adminUnitDialogcClose"
                   class="close-button">取消</el-button>
        <el-button style="margin-left:0;width:90px!important"
                   @click="addadminUnit('addData')"
                   type="primary"
                   class="defaultbtn dialog-confirmBtn">确定</el-button>
      </div>
    </el-dialog>
    <adminUnitDetails v-if="detailsShow"
                      :detailsdrawershow="detailsShow"
                      :tenantDetail="detailData"
                      :timeLineListData="timeLineListData"
                      ref="adminUnitDetails"
                      @refreshQuery="refreshQuery"
                      @showflowListDialoag="showflowListDialoag"
                      @detail="detail"
                      @drawerClose="detailsClose" />
    <el-dialog class="flowListDialoag"
               title="新增记录"
               :visible.sync="flowListDialoagVisible"
               :close-on-click-modal="false"
               width="400px"
               @close="showflowLisClose">
      <div class="dialog_content">
        <el-form :model="addList"
                 ref="addList"
                 :rules="addListRules">
          <el-form-item style="width:100%;"
                        prop="recordDate">
            <div class="cttitle">发生时间<i class="required">*</i></div>
            <el-date-picker style="width:100%"
                            v-model="addList.recordDate"
                            type="datetime"
                            value-format="yyyy-MM-ddTHH:mm:ss"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item style="width:100%;">
            <div class="cttitle">标题<i class="required">*</i></div>
            <el-input v-model="addList.title"
                      style="width:100%"
                      maxlength="20"></el-input>
          </el-form-item>
          <el-form-item prop="content">
            <div class="cttitle">内容<i class="required">*</i></div>
            <el-input class="adminTextarea"
                      v-model="addList.content"
                      maxlength="500"
                      placeholder="500字以内"
                      type="textarea"
                      resize="none"></el-input>
          </el-form-item>
          <div style="width:100%">
            <div class="enclosure"
                 style="width:100%">
              <div class="enclosure-head"
                   style="width: 130px;">附件
                <div style="opacity:1;margin-left:0;"
                     class="iconfont icon-shangchuanfujianicon upload">
                  <aliUpload class="aliUpload emergencyAliUpload"
                             style="display: inline-block;"
                             :upLoadText="upLoadText_data"
                             :fileSize="fileSize"
                             :fileType="fileType_data"
                             :iconShow="false"
                             @setAnnex="setAnnex_data" />
                </div>
              </div>
              <div class="enclosure-list enclosure-list-flow"
                   v-for="(item, index) in addList.annexes"
                   :key="index">
                <div class="el-item">
                  <span style="padding-left: 0">{{item.annexName}}</span>
                  <span v-if="item.annexName">
                    <i style="cursor:pointer"
                       @click="dataDel(item, index)"
                       class="iconfont icon-lajixiang"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <!-- 跟进里的消息推送 -->
          <el-form-item style="margin: 0 !important;">
            <div class="cttitle">消息推送</div>
            <span class="sendIfo">不发送</span>
            <el-switch style="margin:0 12px;"
                       v-model="switchTurn"
                       active-color="#91CF48"
                       inactive-color="#EAECF0"
                       @change="changeSwitch">
            </el-switch>
            <span class="sendIfo">发送</span>
          </el-form-item>
          <el-form-item v-if="switchTurn">
            <div class="cttitle">收件人<i class="required">*</i></div>
            <div class="select-wrap">
              <div class="select-span">
                <span v-for="(item, index) in selectSpan"
                      :key="index">{{item.userName ? item.userName : item.userPostName}} <i class="iconfont icon-cha"
                     @click="delSelect(item)"></i></span>
              </div>
              <i class="iconfont icon-bottom"
                 @click="organizationShow=!organizationShow"
                 :class="{'icon-top': organizationShow}"></i>
            </div>
            <transition name="sub-comments">
              <div class="organization"
                   v-show="organizationShow">
                <el-input placeholder="请输入组织名称/员工姓名"
                          prefix-icon="el-icon-search"
                          v-model="filterText"
                          class=""></el-input>
                <el-tree :data="orgListCopy"
                         show-checkbox
                         node-key="nodeId"
                         :render-after-expand="false"
                         :default-checked-keys="checkedKeys"
                         :filter-node-method="filterNode"
                         @check-change="handleCheckChange"
                         ref="treeForm"
                         :props="defaultProps">
                </el-tree>
              </div>
            </transition>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button style="color: #333;margin-right: 24px;"
                   @click="showflowLisClose"
                   type="text">取消</el-button>
        <el-button style="width: 90px !important;"
                   @click="addflowLis('addList')"
                   type="primary"
                   class="defaultbtn dialog-confirmBtn">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
import adminUnitDetails from './components/adminUnitDetails'
import { error } from 'util'
import axios from 'axios'
import aliUpload from '@/components/aliUpload.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
export default {
  components: {
    adminUnitDetails,
    aliDownLoad,
    aliUpload
  },
  data () {
    var validateTel = (rule, value, callback) => {
      let reg = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/
      if (value === '' || value === undefined) {
        // callback(new Error('请输入部门电话'))
        callback()
      } else if (!reg.test(value)) {
        callback(new Error('格式错误'))
      } else {
        callback()
      }
    }
    var validateUrl = (rule, value, callback) => {
      let reg = new RegExp(/^[hH][tT][tT][pP]([sS]?):\/\/(\S+\.)+\S{2,}$/)
      if (value === '' || value === undefined) {
        // callback(new Error('请输入官方网址'))
        callback()
      } else if (!reg.test(value)) {
        callback(new Error('格式错误'))
      } else {
        callback()
      }
    }
    return {
      adminUnitDialogVisible: false, // 新增关联单位信息
      flowListDialoagVisible: false, // 添加记录
      detailsShow: false,
      detailData: {

      },
      addData: {
        projectId: '', // 项目id
        deptName: '',
        address: '',
        deptTel: '',
        contacts: [
          { name: '', post: '', telephone: '' }
        ]
      },
      addList: { // 新增记录信息
        chargeDeptId: null,
        recordDate: '',
        title: '',
        content: '',
        annexes: []
      },
      addDataRules: { // 新增关联单位信息
        officialUrl: [
          { validator: validateUrl, trigger: 'blur' }
        ],
        deptTel: [
          { validator: validateTel, trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '请输入关联单位', trigger: 'blur' }
        ],
        department: [
          { required: true, message: '请输入关联单位', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入办公地址', trigger: 'blur' }
        ]
      },
      addListRules: {
        recordDate: [
          { required: true, message: '请输入发生时间', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ]
      },
      tableData: [],
      pager: {
        currentPage: 1,
        totalPages: 1,
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
      projectMmanagementId: null,
      activeNames: '1',
      fileType_data: [],
      fileSize: 100,
      upLoadText_data: '上传附件',
      switchTurn: false,
      selectSpan: [],
      organizationShow: false,
      filterText: '',
      orgListCopy: [],
      checkedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.treeForm.filter(val)
    }
  },
  created () {
    if (this.$route.params.projectId) {
      this.addData.projectId = this.$route.params.projectId // 项目id
      this.projectMmanagementId = this.$route.params.projectId
      window.sessionStorage.setItem('projectId', this.$route.params.projectId)
    } else {
      this.addData.projectId = window.sessionStorage.getItem('projectId')
      this.projectMmanagementId = window.sessionStorage.getItem('projectId')
    }
    this.query(this.addData.projectId)
    this.queryOrganizeList()
  },
  // 进
  beforeRouteEnter (to, from, next) {
    next()
  },
  methods: {
    setAnnex_data (annexURL, annexName) { // 资料存档上传
      this.addList.annexes.push({
        annexURL: annexURL,
        annexName: annexName
      })
    },
    toRouteReturn () {
      window.history.back()
    },
    dataDel (index) {
      this.addList.annexes.splice(index, 1)
    },
    refreshQuery (id) {
      this.query(id)
    },
    showflowListDialoag (id) { // 添加记录弹窗
      this.addList.chargeDeptId = id // 子组件拿到新增记录 关联单位id
      this.flowListDialoagVisible = true
      this.switchTurn = false
      this.selectSpan = []
    },
    showflowLisClose () {
      this.addList = { // 新增记录信息
        chargeDeptId: null,
        recordDate: '',
        title: '',
        content: '',
        annexes: []
      }
      this.filterText = ''
      this.$refs['addList'].resetFields()
      this.flowListDialoagVisible = false
    },
    addflowLis () {
      if (this.selectSpan.length === 0 && this.switchTurn) {
        this.$message.error('请选择收件人！')
        return
      }
      let arr = []
      this.selectSpan.forEach(ele => {
        arr.push(ele.userId)
      })
      arr = [...new Set(arr)]
      this.addList.messageFlg = this.switchTurn
      this.addList.userIds = arr
      this.$refs['addList'].validate((valid) => {
        if (valid) {
          context.http.post('/cms/api/chargeDept/record', this.addList).then(res => {
            let row = { id: this.addList.chargeDeptId }
            this.showflowLisClose()
            this.handleEdit('', row)
            this.$message({
              type: 'success',
              message: '添加成功'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addItem (item, index) { // 加减联系人
      // if (this.addData.contacts.length === 5) {
      //   this.$message({
      //     type: 'error',
      //     message: '最多添加5名联系人'
      //   })
      //   return
      // }
      this.addData.contacts.push(
        { name: '', post: '', telephone: '' }
      )
    },
    subItem (item, index) {
      this.addData.contacts.splice(index, 1)
    },
    adminUnitDialogcClose () {
      this.addData = {
        projectId: '', // 项目id
        deptName: '',
        address: '',
        officialUrl: '',
        deptTel: '',
        contacts: [
          { name: '', post: '', telephone: '' }
        ]
      }
      this.$refs['addData'].resetFields()
      this.adminUnitDialogVisible = false
    },
    addadminUnit () { // 新增关联单位信息
      let contactsTurn = false
      this.addData.contacts.forEach(item => {
        if (!item.name) {
          contactsTurn = true
        }
      })
      if (contactsTurn) {
        this.$message({
          type: 'error',
          message: '请完善联系人'
        })
        return
      }
      this.$refs['addData'].validate((valid) => {
        if (valid) {
          this.addData.projectId = this.projectMmanagementId
          context.http.post('/cms/api/chargeDept', this.addData).then(res => {
            this.adminUnitDialogcClose()
            this.query(this.projectMmanagementId)
            this.$message({
              type: 'success',
              message: '新增成功'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showAdminUnit () {
      this.addData.projectId = this.projectMmanagementId
      this.adminUnitDialogVisible = true
    },
    async query (id) {
      let result = await context.http.get(`/cms/api/projectManager/${this.projectMmanagementId}/chargeDepts/pages`, { page: (this.pager.currentPage - 1), size: this.pager.pgSize })
      this.tableData = result.data
      this.pager.total = Number(result.headers['x-total-count'])
      this.pager.totalPages = Math.ceil(this.pager.total / this.pager.pgSize)
      // this.pager.totalPages = Number(result.data.page.totalPages)
    },
    handleEdit (index, row) {
      context.http.get(`/cms/api/chargeDept/${row.id}`).then(res => {
        this.detailData = res.data
        this.timeLineListData = res.data.chargeDeptRecords
        this.detailsShow = true
      }).catch(error => {
        console.info(error)
      })
    },
    detail (id) {
      context.http.get(`/cms/api/chargeDept/${id}`).then(res => {
        this.detailData = res.data
        this.timeLineListData = res.data.chargeDeptRecords
      })
    },
    currentSel () {
      this.pager.currentPage = 1
      this.query(this.addData.projectId)
    },
    current_change (currentPage) {
      this.pager.currentPage = currentPage
      this.query(this.addData.projectId)
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    detailsClose () {
      this.detailsShow = false
    },
    changeSwitch (val) {
      this.selectSpan = []
      this.$message({
        message: '切换成功',
        type: 'success'
      })
    },
    // 收件人
    delSelect (data) {
      let selectSpan = this.selectSpan
      selectSpan.forEach((ele, index) => {
        if (ele.nodeId === data.nodeId) {
          this.selectSpan.splice(index, 1)
          this.$refs.treeForm.setChecked(ele, false)
        }
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleCheckChange (data, checked, indeterminate) {
      let selectSpan = this.selectSpan
      if (checked && !data.disabled && data.userId !== null) {
        selectSpan.push(data)
      } else {
        selectSpan.forEach((ele, index) => {
          if (ele.nodeId === data.nodeId) {
            selectSpan.splice(index, 1)
          }
        })
      }
      this.selectSpan = selectSpan
    },
    async queryOrganizeList () {
      this.orgListCopy = []
      context.http.get('/uaa/api/organizes/report').then(res => {
        if (res.status === 200) {
          this.orgList = res.data
          this.orgListCopy = JSON.parse(JSON.stringify(res.data))
          let cascaderData = []
          this.orgListCopy.forEach(item => {
            cascaderData.push(this.parseOrganize(item))
          })
          this.orgListCopy = cascaderData
        }
      })
    },
    parseOrganize (organizeTree) {
      if (organizeTree.reporterDTOList.length === 0) {
        return {
          userPostId: organizeTree.postId,
          userPostName: organizeTree.name,
          userName: organizeTree.userName,
          userId: organizeTree.userId,
          nodeId: organizeTree.nodeId,
          // label: (organizeTree.userName === null ? '' : organizeTree.userName) + '(' + (organizeTree.name === null ? '' : organizeTree.name) + ')',
          label: this.formateName(organizeTree),
          disabled: organizeTree.name === ''
        }
      } else {
        return {
          userPostId: organizeTree.postId,
          label: this.formateName(organizeTree),
          userPostName: organizeTree.name,
          userName: organizeTree.userName,
          userId: organizeTree.userId,
          nodeId: organizeTree.nodeId,
          disabled: organizeTree.name === '',
          children: organizeTree.reporterDTOList.map(item => {
            return this.parseOrganize(item)
          })
        }
      }
    },
    formateName (organizeTree) {
      let str = ''
      if (organizeTree.userName === null) {
        str = ''
      } else {
        str += organizeTree.userName
      }
      if (organizeTree.userName === null && organizeTree.name === null) {
        str += ''
      } else if (organizeTree.userName === null && organizeTree.name !== null) {
        str += organizeTree.name
      } else if (organizeTree.userName !== null && organizeTree.name !== null) {
        str += '(' + organizeTree.name + ')'
      }
      return str
    }
  }
}
</script>
<style lang="scss" scope>
@import "../../../style/mixins";
.adminUnit {
  .el-input__inner {
    height: 34px;
  }
  .enclosure-list-flow {
    .el-item {
      display: flex;
      justify-content: space-between;
      span {
        display: block !important;
      }
      span:last-child {
        width: auto;
      }
    }
  }
  .el-dialog__wrapper.el_dialog_new .el-dialog .el-dialog__header {
    padding: 0;
    margin: 0;
    height: 50px;
    line-height: 50px;
    padding-left: 15px;
    font-weight: bold;
    border: none;
    margin-bottom: 10px;
  }
  .el-dialog__wrapper.el_dialog_new .el-dialog .el-dialog__footer {
    padding: 0;
    margin-top: 10px;
    padding: 0 !important;
  }
  .close-button:hover {
    color: #3577f6 !important;
  }
  .dialog-footer {
    background: #fff;
    text-align: right;
    margin: 0;
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 16px;
    button {
      display: block;
    }
  }
  .el-dialog {
    position: relative;
    margin: 0 auto 50px;
    border-radius: 2px;
    box-shadow: 0 1px 3px 0px rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
    width: 50%;
    background: #faf7fa;
  }
  .el-dialog__header {
    color: #262626;
    padding: 0;
    margin: 0;
    height: 50px;
    line-height: 50px;
    padding-left: 16px;
    font-weight: bold;
    border: none;
    margin-bottom: 10px;
    background: #fff;
    .el-dialog__title {
      font-size: 16px;
      font-weight: bolder;
    }
  }
  .el-dialog__body {
    // padding: 0px 16px !important;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
    background: #f7f7f7;
    border-bottom: none;
    border-bottom: none;
    margin: 0;
  }
  .el-dialog__footer {
    padding: 0;
    text-align: right;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-top: 10px;
    background: #fff;
    padding: 4px 0;
  }
  .adminTextarea {
    height: 100px;
    textarea {
      height: 100px;
    }
  }
  .adminUnit_table {
    margin-top: 8px;
    border: 1px solid #eeeeee;
  }
  .addadminUnit {
    .el-dialog__header,
    .el-dialog__body {
      margin: 0;
      border: 0;
    }
    .el-dialog__footer {
      padding: 0 !important;
    }
    .el-textarea {
      height: 70px;
      textarea {
        height: 100%;
      }
    }
    .form_item {
      background: #fff;
      padding: 10px;
      margin-bottom: 15px;
    }
    .content {
      max-height: 600px;
      overflow-y: auto;
      overflow-x: hidden;
      background: #fff;
      padding: 15px;
      margin-top: 15px;
      .el-form-item {
        margin-bottom: 25px;
      }
      .el-form-item__content {
        display: flex;
        align-items: center;
        .cttitle {
          margin-bottom: 0px;
          width: 80px;
        }
        .toolContent {
          position: absolute;
          right: -62px;
          top: 10px;
          cursor: pointer;
          i {
            font-size: 18px;
            color: #d92e20;
          }
        }
        .el-form-item__error {
          width: 100%;
          text-align: center;
        }
      }
      .addItem {
        text-align: right;
        padding-right: 25px;
        width: 100%;
        height: 20px;
        display: flex;
        justify-content: flex-end;
        span {
          display: flex;
          cursor: pointer;
          span {
            color: #3575f6;
            line-height: 20px;
            font-size: 16px;
            display: block;
            height: 20px;
          }
          span:last-child {
            font-size: 12px;
            margin-left: 4px;
            line-height: 18px;
            text-decoration: underline;
          }
        }
      }
    }
    .content::-webkit-scrollbar {
      width: 4px !important;
      height: 4px !important;
    }
    .content::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px #fff;
      background-color: #fff;
    }
    .content::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 6px #cccccc;
    }
    .form_table {
      .el-form-item__content {
        display: block;
      }
    }
    .table_content {
      width: 100%;
      .table_header {
        width: 100%;
        display: flex;
        margin-bottom: 10px;
        > div {
          width: 120px;
          margin-right: 18px;
        }
      }
      .table_body {
        width: 100%;
        display: flex;
        margin-bottom: 18px;
        > .el-form-item {
          width: 120px;
          margin-right: 18px;
          margin-bottom: 0;
          position: relative;
          .el-input {
            width: 100% !important;
          }
        }
      }
      .table_body:last-child {
        margin-bottom: 0;
      }
    }
  }
  .flowListDialoag {
    .oss_file {
      line-height: 22px;
    }
    .el-collapse-item__header {
      height: 40px;
      line-height: 40px;
      background-color: #fafafa;
      font-size: 14px;
    }
    .collapse {
      border-left: 1px solid #eeeeee;
      border-right: 1px solid #eeeeee;
      .collapseTitle {
        padding: 0 15px;
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
      .collapseContent {
        > div {
          padding: 0 15px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #eeeeee;
          > span {
            i {
              cursor: pointer;
            }
            &:first-child {
              display: inline-block;
              width: 300px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          // &:last-child{
          //   border-bottom:0;
          // }
        }
      }
    }
    .dialog_content {
      padding: 16px 0 16px;
      .el-form-item {
        margin-bottom: 25px !important;
      }
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
  .sendIfo {
    color: #666666;
    line-height: 24px;
    height: 24px;
    vertical-align: top;
    font-size: 12px;
    display: inline-block;
  }
}
.select-wrap {
  position: relative;
  i.icon-bottom {
    position: absolute;
    right: 10px;
    top: 9px;
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
  @include scrollBarStyle;
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
    i {
      font-size: 12px;
      float: right;
      cursor: pointer;
    }
  }
}
.organization {
  border: 1px solid transparent;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  height: 280px;
  overflow-y: scroll;
  @include scrollBarStyle;
  > .el-input {
    width: 90%;
    margin: 10px 0 10px 25px;
    input {
      border: none;
      background-color: #fafafa;
    }
  }
}
</style>
<style lang="scss">
.adminUnit {
  .page_head_title {
    height: 26px;
    line-height: 26px;
    margin-bottom: 12px;
    color: rgb(51, 51, 51);
    font-size: 16px;
    display: flex;
    i {
      font-size: 28px;
      padding-right: 6px;
      cursor: pointer;
    }
  }
}
</style>
