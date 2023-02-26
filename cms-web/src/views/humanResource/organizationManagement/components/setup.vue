<template>
  <drawer :class="readonly ? 'organizeRight organizeRight2' : 'organizeRight'"
          :show="setupdrawershow"
          :title="drawerTitle"
          @on-hide="onHide('close')">
    <div class="setup-organization details-content"
         slot="drawer">
      <div class="editbtnwarp">
        <div class="dweditbtn"
             v-if="readonly"
             @click="readonly = false"><i class="iconfont icon-edit2 icon-edit1"></i>编辑</div>
      </div>
      <div class="main-content">
        <!-- <div class="dl-head">
          <span class="step"
                :class="{stepActive: newlystep1, stepActivePast: newlystep2}"><span style="font-size: 20px;">1</span>. 基本信息</span>
          <span class="step"
                :class="{stepActive: newlystep2}"><span style="font-size: 20px;">2</span>. 编制设置</span>
        </div> -->

        <div class="drawer-content">
          <div class="step1">
            <p class="title"><i></i>基本信息</p>
            <el-form :model="detailData"
                     ref="step1"
                     :rules="setp1Rules">
              <el-form-item prop="name">
                <div class="cttitle">组织名称<i class="required">*</i></div>
                <span v-if="readonly">{{detailData.name}}</span>
                <el-input v-model="detailData.name"
                          v-else
                          maxlength="30"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item prop="code"
                            style="margin-bottom: 20px;">
                <div class="cttitle">组织代码</div>
                <span v-if="readonly">{{detailData.code}}</span>
                <el-input v-model="detailData.code"
                          v-else
                          maxlength="30"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item style="margin-bottom: 20px;">
                <div class="cttitle">组织类型<i class="required">*</i></div>
                <span v-if="readonly">{{formatOrganizeType(detailData.organizeType)}}</span>
                <el-radio-group v-model="detailData.organizeType"
                                v-else>
                  <el-radio label='COMPANY'>企业</el-radio>
                  <el-radio label='PROJECT'>项目</el-radio>
                  <el-radio label='DEPARTMENT'>部门</el-radio>
                  <el-radio label='ENTERPRISE'>管理企业</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item style="margin-bottom: 20px;"
                            v-if="detailData.organizeType === 'PROJECT'">
                <div class="cttitle">关联项目</div>
                <span v-if="readonly">{{detailData.referred}}</span>
                <el-select v-model="detailData.projectManagementId"
                           placeholder="请选择"
                           v-else>
                  <el-option v-for="item in projectOptions"
                             :key="item.id"
                             :label="item.projectName"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="margin-bottom: 20px;">
                <div class="cttitle">上级组织</div>
                <span v-if="readonly">{{detailData.parent.name}}</span>
                <el-cascader v-else
                             change-on-select
                             :options="organizesOptions"
                             :show-all-levels="false"
                             v-model="organizeIdSelected"
                             @change="handleChange"
                             style="width: 100%"></el-cascader>
              </el-form-item>
              <el-form-item prop="staffing">
                <div style="margin-bottom:9px;"
                     class="cttitle">
                  人员编制
                  <el-tooltip class="item"
                              effect="dark"
                              placement="right-start">
                    <div slot="content">当该组织下的员工数量，超过设置的人员编制数值时，<br />组织列表中出现提示</div>
                    <i class="icon question-mark-icon"></i>
                  </el-tooltip>
                </div>
                <span v-if="readonly">{{detailData.staffing}}</span>
                <el-input v-model="detailData.staffing"
                          v-else
                          type="number"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
              <!-- <el-form-item style="margin-bottom: 20px;">
                <div class="cttitle">关联已有岗位</div>
                <span v-if="detailData.userPosts && detailData.userPosts.length">
                  <span v-for="(item, index) in detailData.userPosts"
                        :key="index"> {{item.name}}</span>
                </span>
                <span v-else>-</span>
              </el-form-item> -->
              <el-form-item style="margin-bottom: 20px;">
                <div class="cttitle">负责人岗位</div>
                <span v-if="readonly">{{detailData.userPost.name}}</span>
                <el-select v-model="detailData.userPost.id"
                           v-else
                           placeholder="请选择"
                           filterable
                           clearable>
                  <el-option v-for="item in ogleaderoptions"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="margin-bottom: 20px;">
                <div class="cttitle">组织排序</div>
                <span v-if="readonly">{{detailData.sortNumber}}</span>
                <el-input v-model="detailData.sortNumber"
                          v-else
                          maxlength="30"
                          type="number"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item style="margin-bottom: 20px;"
                            prop="useStatus">
                <div class="cttitle">组织状态<i class="required">*</i></div>
                <span v-if="readonly">{{formatUseStatus(detailData.useStatus)}}</span>
                <el-select v-model="detailData.useStatus"
                           v-else
                           placeholder="请选择">
                  <el-option v-for="item in stateOptions"
                             :key="item.value"
                             :label="item.name"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="el-drawer1">
            <p class="title"><i></i>组织描述</p>
            <el-form style="padding:15px 20px;"
                     :model="detailData"
                     ref="step1"
                     :rules="setp1Rules">
              <el-form-item class="textareaDes"
                            prop="description"
                            style="width:100%;margin:0">
                <el-input v-if="!readonly"
                          type="textarea"
                          resize='none'
                          maxlength="500"
                          :rows='5'
                          placeholder="请输入内容"
                          v-model="detailData.description">
                </el-input>
                <div class="readOnlyTxt"
                     v-else
                     style="width:100%;word-wrap: break-word;word-break: normal;"
                     v-html="formatreplace(detailData.description)"></div>
              </el-form-item>
            </el-form>
          </div>
          <div class="el-drawer1">
            <p class="title"><i></i>岗位信息</p>
            <div class="tableBox">
              <table cellpadding="0"
                     cellspacing="0"
                     border="0">
                <tr>
                  <th width="35%">岗位名称</th>
                  <th width="35%">员工</th>
                  <th>操作</th>
                </tr>
                <tr v-for="(item, i) in detailData.userPosts"
                    :key="i">
                  <td>{{item.name}}</td>
                  <td>{{formaterUsers(item.users)}}</td>
                  <td><span @click="userPostsDetail(item.id)"
                          class="staffButton">查看</span></td>
                </tr>
              </table>
            </div>
          </div>
          <div class="el-drawer1">
            <p class="title"><i></i>员工信息</p>
            <div class="tableBox">
              <table cellpadding="0"
                     cellspacing="0"
                     border="0">
                <tr>
                  <th width="25%">姓名</th>
                  <th width="25%">岗位</th>
                  <th width="25%">手机号</th>
                  <th>操作</th>
                </tr>
                <tr v-for="(item, i) in staffList"
                    :key="i">
                  <td>{{item.name}}</td>
                  <td>
                    <p v-for="(itm, index) in item.userPostManagements"
                       :key="index">
                      {{ itm.organize.name }}-{{ itm.userPostName }}
                      <span v-if="!itm.onMaster">(兼)</span>
                    </p>
                  </td>
                  <td>{{item.telephone}}</td>
                  <td><span @click="staffDetail(item.id)"
                          class="staffButton">查看</span></td>
                </tr>
              </table>
              <div v-if="pager.total>0"
                   class="ctc-foot">
                <el-pagination background
                               layout="prev, pager, next"
                               :page-size=pager.pgSize
                               :total="pager.total"
                               :current-page="pager.currentPage"
                               @current-change="current_change">
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer"
         v-if="!readonly"
         class="dialog-footer">
      <el-button style="background: rgb(255, 255, 255) !important; border: 0px;"
                 @click="onHide"
                 class="close-button"
                 v-if="newlystep1">取消</el-button>
      <!-- <el-button type="primary"
                  @click="newlystepNoe()"
                  class="defaultbtn dialog-confirmBtn"
                  v-if="newlystep1">下一步</el-button>
      <el-button @click="previousStep()"
                  class="close-button"
                  v-if="newlystep2">上一步</el-button> -->
      <el-button style="margin-left: 0px; width: 90px !important;"
                 type="primary"
                 @click="confirm()"
                 class="defaultbtn dialog-confirmBtn">保存</el-button>
    </div>
  </drawer>
</template>
<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
export default {
  name: 'setup',
  components: {
    Drawer
  },
  props: {
    setupdrawershow: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Object
    },
    projectManagementId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      drawerTitle: '组织详情',
      options: [],
      readonly: true,
      newlystep1: true,
      newlystep2: false,
      setp1Rules: {
        name: [
          { required: true, message: '请输入组织名称', trigger: 'blur' }
        ],
        code: [
          { required: false, pattern: /^[0-9a-zA-Z]+$/, message: '组织代码必须为数字或字母', trigger: 'blur' }
        ],
        useStatus: [
          { required: true, message: '请选择组织状态', trigger: 'change' }
        ],
        staffing: [
          { pattern: /^[0-9]+$/, message: '人员编制必须为数字', trigger: 'blur' }
        ]
      },
      stateOptions: [{
        name: '使用中',
        value: 'USING'
      }, {
        name: '已停用',
        value: 'DISABLE'
      }],
      formLabelWidth: '120px',
      organizationName: '',
      organizationType: '',
      organizesOptions: [],
      ogleaderoptions: [],
      parentId: '',
      organizeIdList: [],
      organizeIdSelected: [],
      projectOptions: [],
      staffList: [],
      pager: {
        currentPage: 1,
        total: 0,
        pgSize: 5
      }
    }
  },
  watch: {
    detailData: {
      handler: function () {
        this.pager.currentPage = 1
        this.organizeIdList = []
        this.queryOrganization()
        this.organizationLeader()
        this.getOrganizeSelected()
        this.getStaffList()
        this.readonly = true
        this.projectOptions = this.$store.state.projectManagementsList
      }
    }
  },
  methods: {
    formaterUsers (users) {
      if (!users.length) return
      let names = users.map((item, index) => {
        return item.name
      })
      names = names.join('、')
      return names
    },
    userPostsDetail (id) { // 岗位
      this.$emit('showUserPosts', id)
    },
    staffDetail (id) { // 员工
      this.$emit('handleEdit', id)
    },
    getStaffList () {
      context.http.get('uaa/api/organizes/users', { organizeId: this.detailData.id, page: (this.pager.currentPage - 1), size: this.pager.pgSize }).then(res => {
        this.staffList = res.data
        this.pager.total = Number(res.headers['x-total-count'])
      })
    },
    current_change (currentPage) {
      this.pager.currentPage = currentPage
      this.getStaffList()
    },
    formatreplace (description) {
      if (!description) {
        return
      }
      let html = description.replace(/\n/g, '<br/>')
      return html
    },
    formatOrganizeType (val) {
      let res = ''
      if (val === 'COMPANY') {
        res = '企业'
      } else if (val === 'PROJECT') {
        res = '项目'
      } else if (val === 'ENTERPRISE') {
        res = '管理企业'
      } else {
        res = '部门'
      }
      return res
    },
    formatUseStatus (val) {
      let res = ''
      if (val === 'USING') {
        res = '使用中'
      } else {
        res = '已停用'
      }
      return res
    },
    onHide (state) {
      this.readonly = true
      if (state === 'close') {
        this.$emit('drawerClose', false)
      } else {
        this.$emit('detail', this.detailData.id)
      }
    },
    newlystepNoe () {
      this.$refs['step1'].validate((valid) => {
        if (valid) {
          this.newlystep1 = false
          this.newlystep2 = true
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    previousStep () {
      this.newlystep1 = true
      this.newlystep2 = false
    },
    getOrganizeSelected () {
      let parentId = this.getOrganizeId(this.detailData.parents)
      parentId.reverse()
      this.organizeIdSelected = [...parentId, this.detailData.parent.id]
      let value = this.organizeIdSelected
      this.parentId = value[(value.length) - 1]
    },
    getOrganizeId (organize) {
      if (organize && organize.parents) {
        let organizeId = organize.parents.id
        this.organizeIdList.push(organizeId)
        if (organize.parents.parents) {
          this.getOrganizeId(organize.parents)
        }
      }
      // if (this.organizeIdList.length > 2) {
      //   this.organizeIdList.reverse()
      // }
      return this.organizeIdList
    },
    handleChange (value) {
      if (value.length === 1 && value[(value.length) - 1] === '') {
        this.parentId = null
      } else {
        this.parentId = value[(value.length) - 1]
      }
    },
    async queryOrganization () {
      let result = await context.http.get('uaa/api/organizes/tree', { postFlg: false })
      let organizesOptions = result.data.organizeTree
      organizesOptions.unshift({ leaf: true, data: { id: '', name: '无上级组织' }, children: [] })
      let cascaderData = []
      organizesOptions.forEach(item => {
        cascaderData.push(this.parseOrganize(item))
      })
      this.organizesOptions = cascaderData
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
    async organizationLeader () {
      let res = await context.http.get('uaa/api/user-posts/parent', { useStatus: 'USING' })
      this.ogleaderoptions = res.data
    },
    async confirm () {
      this.$refs['step1'].validate((valid) => {
        if (valid) {
          let postData = JSON.parse(JSON.stringify(this.detailData))
          let userPostId = this.detailData.userPost.id
          if (!userPostId) {
            postData.userPost = null
          } else {
            postData.userPost = { id: userPostId }
          }
          if (!this.parentId) {
            postData.parent = null
          } else {
            postData.parent = { id: this.parentId }
          }
          context.http.put('uaa/api/organizes', postData).then(res => {
            if (res.data) {
              this.$message({
                offset: 80,
                showClose: true,
                message: '信息修改成功',
                type: 'success'
              })
              this.onHide()
              this.$emit('query', this.projectManagementId)
              this.$emit('getOrganization1')
              this.newlystep1 = true
              this.newlystep2 = false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
.el-drawer1 .el-textarea textarea {
  height: auto;
}
.organizeRight {
  .el-cascader {
    line-height: 34px;
  }
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #3175f6 !important;
    background: #3175f6 !important;
  }
  .ctc-foot {
    justify-content: normal;
    flex-direction: row-reverse;
    align-items: center;
    color: #3f5fbf;
    font-size: 12px;
    padding: 20px 20px 10px 20px;
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
  .el-input__inner {
    height: 34px;
    line-height: 34px;
  }
  .el-input__icon {
    line-height: 34px;
  }
  .textareaDes {
    .el-textarea__inner {
      padding: 0;
      border: 0;
    }
  }
  .dialog-footer {
    background: #fff;
    text-align: right;
    margin: 0;
    height: 65px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 20px;
    .close-button:hover {
      color: #3577f6 !important;
    }
  }
  > .drawer-right {
    background-color: #f7f7f7 !important;
    .wrap {
      min-height: 0;
      height: calc(100% - 65px);
      .drawer-head {
        background: #ffffff;
        margin: 0;
        padding: 18px 20px;
      }
    }
  }
}
.organizeRight2 {
  > .drawer-right {
    .wrap {
      height: 100%;
    }
  }
}
</style>
<style lang="scss" scoped>
.setup-organization {
  width: 750px;
  margin: 0;
  height: calc(100% - 57px);
  overflow: auto;
  padding: 0;
  .tableBox {
    padding: 16px 20px;
    table {
      width: 100%;
      th {
        background: #f7f8fa;
        height: 45px;
        color: #777777;
        line-height: 45px;
        font-size: 14px;
        font-weight: 500;
        text-align: center;
      }
      td {
        text-align: center;
        padding: 14px 0;
        font-size: 12px;
        line-height: 12px;
        color: #777;
        .staffButton {
          color: #3575f6;
          cursor: pointer;
        }
      }
    }
  }
  .editbtnwarp {
    position: absolute;
    top: 19px;
    right: 20px;
    .dweditbtn {
      text-align: center;
      font-size: 12px;
      border-radius: 4px;
      color: #3575f6;
      cursor: pointer;
      right: 0;
      i {
        width: 15px;
        height: 20px;
        margin-right: 4px;
        vertical-align: text-top;
      }
    }
  }
  .main-content {
    margin: 0 auto;
    .drawer-content {
      padding-top: 15px;
      > div {
        margin-bottom: 15px;
        background-color: #fff;
        .title {
          font-size: 16px;
          font-weight: bolder;
          padding-left: 30px;
          height: 40px;
          line-height: 40px;
          background-color: #fff;
          border-bottom: 1px solid #f6f6f6;
          position: relative;
          color: #262626;
          i {
            display: block;
            position: absolute;
            left: 20px;
            top: 12px;
            width: 4px;
            height: 16px;
            border-radius: 2px;
            background: #3575f6;
          }
        }
        .el-form {
          display: flex;
          flex-wrap: wrap;
          padding: 20px 20px 0;
          justify-content: space-between;
          .el-form-item {
            width: 48%;
            margin: 0 0 20px;
            .el-radio-group {
              margin-top: 8px;
            }
            .textareaDes {
              .el-textarea__inner {
                padding: 0;
              }
            }
          }
        }
      }
    }
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
    background-color: #3175d2;
  }
  .stepActivePast {
    color: #fff;
    background-color: #789ed2;
  }
  .el-dialog__header,
  .el-dialog__body {
    border-bottom: none;
  }
  .drawer-content {
  }
  .checkAll {
    font-size: 16px;
    .el-checkbox__label {
      font-size: 16px;
    }
  }
  .el-form-item {
    margin-top: 20px;
  }
  .cttitle {
    margin-bottom: 10px;
    color: #777777;
  }
  span {
    color: #262626;
  }
  .el-select {
    width: 100%;
  }
}
.setup-organization::-webkit-scrollbar {
  width: 4px !important;
  height: 4px !important;
}
.setup-organization::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px #fff;
  background-color: #fff;
}
.setup-organization::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px #cccccc;
}
</style>

