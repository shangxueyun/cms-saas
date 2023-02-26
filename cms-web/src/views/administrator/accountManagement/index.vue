<template>
  <div class="accountManage">
    <span class="page_head_title">账号配置</span>
    <!-- <ul class="default_tab_block">
        <li class="active"
            v-if="hasAuthority('01020303')">
          <span>账号配置</span>
        </li>
        <li @click="changeTab('teantAccountSet')"
            v-if="hasAuthority('01020304')">
          <span>客户账号配置</span>
        </li>
      </ul> -->
    <div class="search-bar">
      <span>
        <el-cascader :options="organizationOptions"
                     v-if="onGroupPersonnel"
                     v-model="organizeId"
                     :props="{ checkStrictly: true, expandTrigger: 'hover'}"
                     clearable
                     style="width:200px"
                     placeholder="请选择组织"></el-cascader>
        <el-cascader :options="enterpriseUser"
                     v-else
                     change-on-select
                     clearable
                     style="width:200px"
                     expand-trigger="hover"
                     v-model="organizeId">
        </el-cascader>
        <el-input v-model="queryName"
                  placeholder="姓名/岗位/角色"
                  style="width:200px"></el-input>
        <el-select v-model="useStatus"
                   placeholder="账户状态"
                   style="width:200px">
          <el-option label="使用中"
                     value="USING"></el-option>
          <el-option label="已停用"
                     value="DISABLE"></el-option>
        </el-select>
        <div class="query-btn"
             @click="queryUsersbtn"
             style="margin-top:0">查询</div>
      </span>
      <el-button class="tban tban1"
                 v-if="hasAuthority('01020301')"
                 @click="createAccount"><i class="iconfont icon-crm_xinzeng-"></i> 创建账号</el-button>
    </div>
    <div class="ct-content">
      <div class="ctc-table">
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column prop="name"
                           label="姓名"
                           align="center">
          </el-table-column>
          <el-table-column label="岗位"
                           align="center">
            <template slot-scope="scope">
              <span v-for="(item, index) in scope.row.userPostManagements"
                    :key="index">
                {{item.userPostName}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="组织"
                           align="center">
            <template slot-scope="scope">
              <!-- <span v-if="scope.row.userPostManagements.length > 0 && scope.row.userPostManagements[0].organize.parent">
                {{scope.row.userPostManagements[0].organize.parent.name}} /
              </span> -->
              <span v-if="scope.row.userPostManagements.length > 0">
                {{scope.row.userPostManagements[0].organize.name}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="角色"
                           align="center">
            <template slot-scope="scope">
              <span v-for="(item, index) in scope.row.roleDTOS"
                    :key="index">
                {{item.roleName}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="account"
                           label="账号"
                           align="center">
          </el-table-column>
          <el-table-column prop="telephone"
                           label="手机号"
                           align="center">
          </el-table-column>
          <!-- <el-table-column prop="email"
                           label="邮箱"
                           align="center">
          </el-table-column> -->
          <el-table-column prop="createAccountDate"
                           label="创建时间"
                           :formatter="formatTime"
                           align="center">
          </el-table-column>
          <el-table-column prop="useStatus"
                           label="账户状态"
                           :formatter="useStatusFormater"
                           align="center">
          </el-table-column>
          <el-table-column label="操作"
                           v-if="hasAuthority('01020302')"
                           align="center">
            <template slot-scope="scope">
              <el-button class="el-button--primary operation-btn"
                         size="mini"
                         @click="handleEdit(scope.row.id)">查看</el-button>
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

    <!-- <el-dialog title="创建账号"
               :visible.sync="dialogVisible"
               class="createaccount">
      <el-form :model="createForm"
               :rules="createRulese"
               ref="createaccount">
        <el-form-item :label-width="formLabelWidth"
                      prop="organizeSelected">
          <div>选择组织<i class="required">*</i></div>
          <el-cascader expand-trigger="hover"
                       change-on-select
                       :options="organizeOptions"
                       v-model="createForm.organizeSelected"
                       @change="organizeChange">
          </el-cascader>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth"
                      prop="postNameSelect"
                      style="margin-bottom: 20px;">
          <div>选择岗位<i class="required">*</i></div>
          <el-select v-model="createForm.postNameSelect"
                     placeholder="请选择"
                     @change="postNameChange">
            <el-option v-for="item in postNameOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth"
                      prop="userSelected"
                      style="margin-bottom: 20px;">
          <div>姓名<i class="required">*</i></div>
          <el-select v-model="createForm.userSelected"
                     placeholder="请选择"
                     @change="userChange">
            <el-option v-for="item in userOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth"
                      style="margin-bottom: 20px;">
          <div>手机号</div>
          <span style="display: inline-block;">{{telephone}}</span>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth"
                      prop="account"
                      style="margin-bottom: 20px;">
          <div>账号<i class="required">*</i></div>
          <el-input v-model="createForm.account"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth"
                      prop="roleSelected"
                      style="margin-bottom: 20px;">
          <div>角色<i class="required">*</i></div>
          <el-select v-model="createForm.roleSelected"
                     multiple
                     placeholder="请选择">
            <el-option v-for="item in roleOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth"
                      prop="dataAuthoritySelected"
                      style="margin-bottom: 20px;">
          <div>数据权限<i class="required">*</i></div>
          <el-select v-model="createForm.dataAuthoritySelected"
                     multiple
                     filterable
                     remote
                     reserve-keyword
                     placeholder="请输入关键词"
                     :remote-method="getDataAuthorityOptions"
                     :loading="loading">
            <el-option v-for="item in dataAuthorityOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogVisible = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   :disabled="disabledPost"
                   @click="openAccount('createaccount')"
                   class="defaultbtn dialog-confirmBtn">确 认</el-button>
      </div>
    </el-dialog> -->
    <!-- <el-dialog :visible.sync="editdialogVisible"
               class="accountinfo">
      <div slot="title"
           style="font-size: 20px;">账号信息
        <el-tooltip class="item"
                    effect="dark"
                    content="编辑当前页面"
                    placement="right">
          <i class="fa fa-pencil-square-o"
             aria-hidden="true"
             v-if="hasAuthority('01020301')"
             @click="editAccount"
             style="cursor: pointer;vertical-align: baseline!important;"></i>
        </el-tooltip>
      </div>
      <div class="accountinfo-content">
        <div class="acleft">
          <div class="achead"
               v-if="detailsData.facialPhoto">
            <img :src="detailsData.facialPhoto">
          </div>
          <div class="achead default-hportrait"
               v-else>
            <span class="">{{formatName(detailsData.name)}}</span>
          </div>
          <p>{{detailsData.name}}</p>
          <p>{{detailsData.englishName}}</p>
        </div>
        <div>
          <p class="ac-title">岗位</p>
          <p class="ac-content">{{userPostManagements}}</p>
          <p class="ac-title">账户角色</p>
          <p class="ac-content"
             v-if="readonly">
            <span v-for="(item, index) in detailsData.roleDTOS"
                  :key="index">
              {{item.roleName}}
            </span>
          </p>
          <el-select v-else
                     v-model="roleHasSelected"
                     multiple
                     placeholder="请输入关键词">
            <el-option v-for="item in roleOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <p class="ac-title">手机号</p>
          <p class="ac-content">{{detailsData.telephone}}</p>
          <p class="ac-title">数据权限</p>
          <p class="ac-content"
             v-if="readonly"
             style="width: 200px;">{{projectManagements}}</p>
          <el-select v-model="projectManagementsArr"
                     placeholder="请选择"
                     multiple
                     filterable
                     remote
                     reserve-keyword
                     v-else>
            <el-option v-for="item in dataAuthorityOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="margin-left: 160px;">
          <p class="ac-title">组织</p>
          <p class="ac-content">
            {{organizeNameStr}}
          </p>
          <p class="ac-title">账号</p>
          <p class="ac-content">{{detailsData.account}}</p>
          <p class="ac-title">账号状态</p>
          <p class="ac-content"
             v-if="readonly">{{formatUseStatus(detailsData.useStatus)}}</p>
          <el-select v-model="detailsData.useStatus"
                     placeholder="请选择"
                     v-else>
            <el-option v-for="item in stateOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <p class="ac-title">集团人事权限</p>
          <p class="ac-content"
             v-if="readonly">{{formatUseonGP(detailsData.onGroupPersonnel)}}</p>
          <el-select v-model="detailsData.onGroupPersonnel"
                     placeholder="请选择"
                     v-else>
            <el-option v-for="item in psjdOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="editdialogVisible = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="editAccountSave()"
                   class="defaultbtn dialog-confirmBtn"
                   v-show="!readonly">保 存</el-button>
      </div>
    </el-dialog> -->
    <el-dialog title="创建账号"
               :visible.sync="dialogVisible"
               class="flowDialog el_dialog_new addFlow_new"
               width="750px"
               @close="hideDialogVisible"
               :close-on-click-modal="false">
      <el-form :model="createForm"
                 :rules="createRulese"
                 ref="createaccount">
            <div class="half_page_title"
                 style="width:100%">
              <div><i></i>基本信息</div>
            </div>
            <div class="part">
              <div class="dl-subtitle">
                <span>组织<i class="required">*</i></span>
                <el-form-item prop="organizeSelected">
                  <el-cascader :props="{ checkStrictly: true, expandTrigger: 'hover'}"
                              v-if="onGroupPersonnel"
                              :options="organizeOptions"
                              v-model="createForm.organizeSelected"
                              @change="organizeChange">
                  </el-cascader>
                  <!-- <el-select v-model="createForm.organizeSelected"
                           v-else
                           clearable
                           placeholder="请选择"
                           size="small">
                  <el-option v-for="item in enterpriseUser"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id">
                  </el-option>
                </el-select> -->
                  <el-cascader :options="enterpriseUser"
                              v-else
                              change-on-select
                              clearable
                              style="width:300px;margin-right:15px"
                              expand-trigger="hover"
                              v-model="createForm.organizeSelected">
                  </el-cascader>
                </el-form-item>
              </div>
              <div class="dl-subtitle">
                <span>岗位<i class="required">*</i></span>
                <el-form-item :label-width="formLabelWidth"
                              prop="postNameSelect">
                  <el-select v-model="createForm.postNameSelect"
                            placeholder="请选择"
                            @change="postNameChange">
                    <el-option v-for="item in postNameOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="dl-subtitle">
                <span>员工<i class="required">*</i></span>
                <el-form-item :label-width="formLabelWidth"
                              prop="userSelected">
                  <el-select v-model="createForm.userSelected"
                            placeholder="请选择"
                            @change="userChange">
                    <el-option v-for="item in userOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="dl-subtitle">
                <span>手机号<i class="required">*</i></span>
                <el-form-item :label-width="formLabelWidth">
                  <span style="display: inline-block;">{{telephone}}</span>
                </el-form-item>
              </div>
            </div>
            <div style="height: 12px;background-color: #f7f7f7;width: 100%;"></div>
            <div class="half_page_title"
                 style="width:100%">
              <div><i></i>账号信息</div>
            </div>
            <div class="part">
              <div class="dl-subtitle">
                <span>账号<i class="required">*</i></span>
                <el-form-item :label-width="formLabelWidth"
                              prop="account">
                  <el-input v-model="createForm.account"
                            placeholder="请输入内容"></el-input>
                </el-form-item>
              </div>
              <div class="dl-subtitle">
                <span>角色<i class="required">*</i></span>
                <el-form-item :label-width="formLabelWidth"
                              prop="roleSelected">
                  <el-select v-model="createForm.roleSelected"
                            placeholder="请选择"
                            multiple
                            @change="userChange">
                    <el-option v-for="item in roleOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item prop="roleSelected">
                  <el-select v-model="createForm.roleSelected"
                            multiple
                            placeholder="请选择">
                    <el-option v-for="item in roleOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item> -->
              </div>
            </div>
            <div style="height: 12px;background-color: #f7f7f7;width: 100%;"></div>
            <div class="half_page_title"
                 style="width:100%">
              <div><i></i>数据权限</div>
            </div>
            <div class="part" style="max-height: 420px;overflow-y: auto;">
              <div class="dl-subtitle">
                <!-- <span>项目</span> -->
                <el-form-item>
                  <el-tree :data="dataAuthorityOptions"
                            show-checkbox
                            node-key="id"
                            :default-checked-keys='projectManagementsArr'
                            :default-expanded-keys='defaultExpandIds'
                            @check="handleCheckChange"
                            :props="treeProps">
                          </el-tree>
                  <!-- <el-cascader :options="dataAuthorityOptions"
                              :key='cascaderIdx'
                              placeholder="请选择项目"
                              :props="{ expandTrigger:'hover', multiple: true, label: 'name', value: 'id', children: 'child' }"
                              v-model="createForm.dataAuthoritySelected"
                              @remove-tag='removeTag'
                              @change="accountChange">
                  </el-cascader> -->
                </el-form-item>
              </div>
            </div>
      </el-form>
      <div slot="footer"
           class="slotfooter">
        <span @click="hideDialogVisible"
              class="details_cannelBtn">取消</span>
        <span class="details_submitBtn"
              @click="openAccount('createaccount')">确定</span>
      </div>
    </el-dialog>
    <accountDetails :editdialogVisible='editdialogVisible'
              @drawerClose='drawerClose'
              :detailsData="detailsData"
              :roleOptions="roleOptions"
              :userPostManagements='userPostManagements'
              @handleEdit="handleEdit"
              ref="accountDetails"
              ></accountDetails>
              <!-- :projectManagementsArr="projectManagementsArr" -->

    

  </div>
</template>
<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import accountDetails from './components/accountDetails.vue'
window.repeatCode = false

export default {
  name: 'accountManage',
  components: {
    accountDetails
  },
  data () {
    return {
      organizationOptions: [],
      organizeId: [],
      useStatus: '',
      queryName: '',
      defaultExpandIds: [],
      projectManagements: '', // 账号信息-数据权限
      projectManagementsArr: [], // 编辑选中数据权限ID
      projectManagementsArrData: [], // 处理后的数据
      tableData: [{
        userPostManagements: [{ organize: { name: '' } }]
      }],
      treeProps: { label: 'name', children: 'child' },
      cascaderIdx: 1,
      organizeOptions: [],
      roleOptions: [],
      userOptions: [],
      organizeSelected: [],
      postNameSelect: '',
      roleHasSelected: [],
      postNameOptions: [],
      dataAuthorityOptions: [],
      userPostManagements: '',
      telephone: '',
      roles: '',
      psjdOptions: [
        {
          value: true,
          label: '开启'
        },
        {
          value: false,
          label: '关闭'
        }
      ],
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
      newAccount: {
        account: ''
      },
      createForm: {
        account: '',
        organizeSelected: [],
        postNameSelect: '',
        userSelected: '',
        roleSelected: [],
        dataAuthoritySelected: []
      },
      createRulese: {
        organizeSelected: [
          { required: true, message: '请选组织', trigger: 'change' }
        ],
        postNameSelect: [
          { required: true, message: '请选择岗位', trigger: 'change' }
        ],
        userSelected: [
          { required: true, message: '请选择员工', trigger: 'change' }
        ],
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        roleSelected: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        dataAuthoritySelected: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ]
      },
      detailsData: {
        userPostManagements: [{
          userPostName: '',
          userPostcode: ''
        }],
        roleSelected: [],
        organizeDTO: { name: '', code: '' },
        roleDTOS: [{
          id: '',
          roleName: '',
          organizeId: null

        }],
        onGroupPersonnel: false
      },
      name: '',
      organizeNameStr: '',
      parentOrganizeNameStr: '',
      readonly: true,
      dialogVisible: false,
      editdialogVisible: false,
      loading: false,
      formLabelWidth: '120px',
      tableDataLength: 0,
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
      disabledPost: false,
      onGroupPersonnel: false,
      enterpriseUser: []
    }
  },
  created () {
  },
  mounted () {
    // let user = JSON.parse(sessionStorage.getItem('user'))
    this.onGroupPersonnel = true
    if (this.onGroupPersonnel) {
      this.getOrganization()
    } else {
      this.getEnterpriseuser()
    }
    this.queryUsers()
  },
  methods: {
    drawerClose () {
      this.editdialogVisible = false
      this.queryUsers()
    },
    handleChange (val) {
      console.log(val)
    },
    hideDialogVisible () {
      this.dialogVisible = false
      this.telephone = ''
      this.userOptions = []
      this.roleOptions = []
      this.postNameOptions = []
      this.createForm = {
        account: '',
        organizeSelected: [],
        postNameSelect: '',
        userSelected: '',
        roleSelected: [],
        dataAuthoritySelected: []
      }
      this.$refs['createaccount'].resetFields()
    },
    async getOrganization () {
      let result = await context.http.get('uaa/api/organizes/tree', { postFlg: false })
      let organizationOptions = result.data.organizeTree
      let cascaderData = []
      organizationOptions.forEach(item => {
        cascaderData.push(this.parseOrganize(item))
      })
      this.organizationOptions = cascaderData
    },
    async getEnterpriseuser () { // 非集团人士权限 组织列表
      let result = await context.http.get('uaa/api/organizes/enterprise/user?onTree=true')
      let organizationOptions = result.data
      let cascaderData = []
      organizationOptions.forEach(item => {
        cascaderData.push(this.parseOrganize2(item))
      })
      this.enterpriseUser = cascaderData
    },
    parseOrganize2 (organizeTree) {
      if (organizeTree.child.length === 0) {
        return { value: organizeTree.id ? organizeTree.id : organizeTree.userPostId ? organizeTree.userPostId : organizeTree.userId, label: organizeTree.name }
      } else {
        return {
          value: organizeTree.id ? organizeTree.id : organizeTree.userPostId ? organizeTree.userPostId : organizeTree.userId,
          label: organizeTree.name,
          children: organizeTree.child.map(item => {
            return this.parseOrganize2(item)
          })
        }
      }
    },
    changeTab (name) {
      this.$router.push({
        name: name,
        params: {}
      })
    },
    formatTestArr (arr) {
      let n = ''
      if (arr) {
        for (let i = 0; i < arr.length; i++) {
          n += arr[i]
        }
      }
      return n
    },
    handleClose () {
      this.createForm.account = ''
      this.createForm.organizeSelected = []
      this.createForm.postNameSelect = ''
      this.createForm.userSelected = ''
      this.createForm.roleSelected = []
      this.telephone = ''
      this.createForm.dataAuthoritySelected = []
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    formatName (name) {
      if (name) {
        return name.length > 2 ? name.substring(name.length - 2) : name
      }
    },
    queryUsersbtn () {
      this.currentPage = 1
      this.queryUsers()
    },
    async queryUsers () {
      let organizeId = ''
      organizeId = this.organizeId.length ? this.organizeId[this.organizeId.length - 1] : ''
      let result = await context.http.get('uaa/api/account', { page: (this.currentPage - 1), size: this.pgSize, sort: 'desc', queryName: this.queryName, useStatus: this.useStatus, organizeId: organizeId })
      if (this.currentPage !== 1 && result.data.length === 0) {
        this.currentPage = 1
        this.queryUsers()
      }
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      this.tableDataLength = this.tableData.length
    },
    // 获取组织
    async getOrganizeOptions () {
      let result = await context.http.get('uaa/api/organizes/tree', { postFlg: false })
      this.formatOrganize(result.data)
    },
    formatOrganize (result) {
      this.organizeOptions.splice(0, this.organizeOptions.length)
      result.organizeTree.forEach(item => {
        this.organizeOptions.push(this.parseOrganize(item))
      })
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
    // editAccount () {
    //   this.readonly = false
    //   let roleSelected = []
    //   this.detailsData.roleDTOS.map(item => {
    //     roleSelected.push(item.id)
    //   })
    //   this.roleHasSelected = roleSelected
    // },
    organizeChange () {
      this.createForm.postNameSelect = ''
      this.createForm.userSelected = ''
      this.telephone = ''
      this.createForm.roleOptions = ''
      this.userOptions = []
      this.getPostNameOptions(this.createForm.organizeSelected[this.createForm.organizeSelected.length - 1])
      this.getRoleOptions(this.createForm.organizeSelected[this.createForm.organizeSelected.length - 1])
      this.createForm.roleSelected = []
    },
    // 获取岗位
    async getPostNameOptions (currentorganizeId) {
      let result = await context.http.get('uaa/api/user-posts/organize', { organizeId: currentorganizeId })
      this.postNameOptions = result.data.map(item => {
        return { value: item.id, label: item.name }
      })
    },
    projectManagementsFarmat (arr) {
      this.projectManagementsArrData = arr.map(item => {
        return { id: item }
      })
    },
    async editAccountSave () {
      this.projectManagementsFarmat(this.projectManagementsArr)
      let putData = {
        id: this.detailsData.id,
        roleId: this.roleHasSelected,
        useStatus: this.detailsData.useStatus,
        projectManagementDTOS: this.projectManagementsArrData,
        onGroupPersonnel: this.detailsData.onGroupPersonnel
      }
      let result = await context.http.put('uaa/api/account', putData)
      if (result.data) {
        this.editdialogVisible = false
        this.queryUsers()
      }
    },
    postNameChange () {
      this.createForm.userSelected = ''
      this.telephone = ''
      this.createForm.roleSelected = []
      this.getRoleOptions(this.createForm.organizeSelected[this.createForm.organizeSelected.length - 1])
      this.getUserOptions()
    },
    // 获取数据权限
    // async getDataAuthorityOptions (searchKey) {
    //   let result = await context.http.get('cms/api/project-managements/all', { page: 0, size: 100, sort: 'desc' })
    //   this.formatAuthority(result.data)
    // },
    // 获取角色
    async getRoleOptions (currentorganizeId) {
      let result = await context.http.get('uaa/api/roles/organize', { organizeId: currentorganizeId })
      this.formatRole(result.data)
    },
    async getUserOptions () {
      let result = await context.http.get(`uaa/api/users/post/${this.createForm.postNameSelect}`)
      this.formatUser(result.data)
    },
    userChange (selectValue) {
      this.userOptions.forEach(item => {
        if (item.value === selectValue) {
          this.telephone = item.telephone
        }
      })
    },
    // formatAuthority (result) {
    //   this.dataAuthorityOptions = result.map(item => {
    //     return { value: item.id, label: item.projectName }
    //   })
    // },
    formatUser (result) {
      this.userOptions = result.map(item => {
        return { value: item.id, label: item.name, telephone: item.telephone }
      })
    },
    formatRole (result) {
      this.roleOptions = result.map(item => {
        return { value: item.id, label: item.roleName }
      })
    },

    createAccount () {
      this.dialogVisible = true
      this.getOrganizeOptions()
      // this.getDataAuthorityOptions() 旧
      this.getProjectOpitons()
    },
    // 获取项目树
    async getProjectOpitons () {
      let result = await context.http.get('cms/api/project-managements/organize/tree')
      // 默认展开id
      this.defaultExpandIds = []
      this.defaultExpandIds.push(result.data.id)
      result.data.disabled = false
      result.data.child.forEach(item => {
        item.id = 'a' + '' + item.id
        if (item.child.length !== 0) {
          item.disabled = false
          item.child.forEach(ite => {
            ite.disabled = false
            if (ite.child.length === 0) {
              delete ite.child
            }
          })
        } else {
          item.disabled = true
        }
      })
      this.dataAuthorityOptions = [result.data]
      // 默认选中id
      this.projectManagementsArr = []
    },
    removeTag (val) {
      let temp = val[2]
      let dataSelected = JSON.parse(JSON.stringify(this.createForm.dataAuthoritySelected))
      dataSelected.forEach((item, index) => {
        if (item[2] === temp) {
          dataSelected.splice(index, 1)
        }
      })
      // console.log(dataSelected)
      // this.$delete(this.createForm, 'dataAuthoritySelected')
      // this.createForm.dataAuthoritySelected = JSON.parse(JSON.stringify(dataSelected))
      // this.createForm.dataAuthoritySelected = Object.assign({}, this.createForm.dataAuthoritySelected)
      this.$set(this.createForm, dataAuthoritySelected, JSON.parse(JSON.stringify(dataSelected)))
      // this.createForm.dataAuthoritySelected = JSON.parse(JSON.stringify(dataSelected))
      // console.log(this.createForm.dataAuthoritySelected)
    },
    accountChange (val) {
      // console.log(val)
      // console.log(this.createForm.dataAuthoritySelected)
    },
    userPostManagementFormater (row, column) {
      return row.userPostManagent.postname
    },
    useStatusFormater (row, column) {
      return this.formatUseStatus(row.useStatus)
    },
    formatUseStatus (status) {
      if (status === 'USING') {
        return '使用中'
      } else if (status === 'DISABLE') {
        return '已停用'
      } else {
        return '其他'
      }
    },
    formatUseonGP (status) {
      if (status === true) {
        return '开启'
      } else if (status === false) {
        return '关闭'
      }
    },
    formatTime (row, column) {
      if (row.createdDate) {
        return row.createdDate.substring(0, 10)
      } else {
        return ''
      }
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.queryUsers()
    },
    currentSel () {
      this.currentPage = 1
      this.queryUsers()
    },
    async handleEdit (id) { // 查看
      // this.projectManagements = ''
      // this.projectManagementsArr = []
      this.parentOrganizeNameStr = ''
      this.editdialogVisible = true
      // this.getDataAuthorityOptions() 旧
      let result = await context.http.get(`uaa/api/users/${id}`)
      // this.oldonGroupPersonnel = result.data.onGroupPersonnel
      this.detailsData = result.data
      this.$refs.accountDetails.getProjectOpitons()
      this.readonly = true
      this.userPostManagements = ''
      if (this.detailsData.userPostManagements) {
        this.detailsData.userPostManagements.forEach(element => {
          this.userPostManagements += element.userPostName + ' '
          // this.userPostManagements += element.userPostName + ' ' + (element.userPostcode || '') + ' '
        })
      } else {
        this.userPostManagements = ''
      }
      if (this.detailsData.roleDTOS) {
        this.detailsData.roleDTOS.forEach(item => {
          this.roles += item.roleName + ' '
        }
        )
      } else {
        this.roles = ''
      }
      this.getRoleOptions(this.detailsData.userPostManagements[0].organize.id)
      this.getOrganizeSelected(this.detailsData.userPostManagements[0].organize)
    },
    getOrganizeSelected (organize) {
      let parentStr = this.getOrganizeId(organize)
      this.organizeNameStr = organize.name + parentStr
    },
    getOrganizeId (organize) {
      if (organize.parent) {
        let organizeName = organize.parent.name
        this.parentOrganizeNameStr += '/' + organizeName
        if (organize.parent.parent) {
          this.getOrganizeId(organize.parent)
        }
      }
      return this.parentOrganizeNameStr
    },
    dataAuthoritySelectedFarmat (arr) { // 数据权限入参处理
      this.createForm.projectManagementDTOS = arr.map(item => {
        return { id: item[2] }
      })
    },
    handleCheckChange (data, nodeData) {
      // console.log(data, nodeData)
      let selectedId = []
      nodeData.checkedKeys.forEach(item => {
        let temp = typeof item === 'number' && !isNaN(item)
        if (temp) {
          selectedId.push(item)
        }
      })
      selectedId = [...new Set(selectedId)]
      this.projectManagementsArr = JSON.parse(JSON.stringify(selectedId))
    },
    // handleCheckChange (checked, data) {
    //   this.projectManagementsArr = [...new Set(this.projectManagementsArr)]
    //   if (!checked) {
    //     this.projectManagementsArr.forEach((ele, index) => {
    //       if (data.child) {
    //         data.child.forEach(item => {
    //           if (ele === item.id) {
    //             this.projectManagementsArr.splice(index, 1)
    //           }
    //         })
    //       } else {
    //         if (ele === data.id) {
    //           this.projectManagementsArr.splice(index, 1)
    //         }
    //       }
    //     })
    //   } else {
    //     if (data.child) {
    //       data.child.forEach(item => {
    //         this.projectManagementsArr.push(item.id)
    //       })
    //     } else {
    //       this.projectManagementsArr.push(data.id)
    //     }
    //   }
    //   // console.log(this.projectManagementsArr)
    // },
    openAccount (formName) { // 创建账号
      // this.dataAuthoritySelectedFarmat(this.createForm.dataAuthoritySelected)
      let projectManagementsArrData = this.projectManagementsArr.map(item => {
        return { id: item }
      })
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.newAccount.id = this.createForm.userSelected
          this.newAccount.roleId = this.createForm.roleSelected
          this.newAccount.account = this.createForm.account
          this.newAccount.projectManagementDTOS = projectManagementsArrData
          context.http.post('uaa/api/account', this.newAccount).then(res => {
            this.disabledPost = true
            if (res.status === 200 || res.status === 201) {
              this.dialogVisible = false
              this.disabledPost = false
              // this.handleClose()
              this.hideDialogVisible()
              this.queryUsers()
            }
          })
        } else {
          console.log('create account fail!')
          return false
        }
      })
    }

  }
}
</script>
<style lang="scss">
@import "../../../style/config";
.accountManage {
  font-size: 16px;
  background-color: #f9f9f9;
  .search-bar {
    .el-cascader {
      width: 180px;
      height: 32px;
      line-height: 32px;
      margin-right: 10px;
      .el-cascader__tags {
        flex-wrap: nowrap;
        .el-tag:first-child > span {
          width: 60px;
        }
      }
      .el-input__inner {
        height: 32px !important;
      }
    }
  }
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
  .fa-pencil-square-o {
    background: url(../../../assets/edit.png) no-repeat;
    background-size: contain;
  }
  .addbtn {
    margin-top: 0;
    i {
      display: inline-block;
      width: 16px;
      height: 16px;
      font-size: 20px;
      margin-right: 6px;
      vertical-align: middle;
      background: url(../../../assets/editwhite.png) no-repeat;
      background-size: contain;
    }
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
  .drawer {
    .el-dialog__body {
      height: 85%;
    }
    .drawer-content {
      width: 848px;
      height: 94%;
      -moz-box-shadow: 0 0 10px #e5e5e5;
      -webkit-box-shadow: 0 0 10px #e5e5e5;
      box-shadow: 0 0 10px #e5e5e5;
      .drawer-title {
        height: 50px;
        line-height: 50px;
        margin-left: 20px;
        font-size: 16px;
        font-weight: bold;
      }
      .permission-list {
        height: 100%;
        .pl-left {
          width: 20%;
          height: 94%;
          border-right: 1px solid #eee;
          p {
            height: 7%;
            background-color: #3577f6;
            color: #fff;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            border-bottom: 1px solid #eee;
            cursor: pointer;
          }
        }
        .pl-right {
          width: 78%;
          height: 94%;
          padding-top: 26px;
          .plr-item:nth-of-type(2) {
            margin-top: 40px;
          }
        }
      }
      .permission-role {
        height: 60%;
        margin: 40px 20px 0 20px;
        p {
          margin-bottom: 20px;
        }
        .el-select {
          width: 100%;
        }
        .pr-bottom {
          margin-top: 25%;
          p {
            margin-bottom: 10px;
          }
          p:last-child {
            color: #898989;
          }
        }
      }
    }
    .checkAll {
      font-size: 16px;
      .el-checkbox__label {
        font-size: 16px;
      }
    }
  }
  .createaccount {
    .el-dialog {
      width: 80%;
      .el-form-item {
        width: 22%;
        display: inline-block;
        margin-right: 33px;
        &:nth-of-type(4n) {
          margin-right: 0;
        }
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
    // margin-left: 15px!important;
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
    vertical-align: middle;
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
        .el-cascader {
          width: 180px;
          height: 32px;
          line-height: 32px;
          margin-right: 10px;
          .el-cascader__tags {
            flex-wrap: nowrap;
            .el-tag:first-child > span {
              width: 60px;
            }
          }
          .el-input__inner {
            height: 32px !important;
          }
        }
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
  .accountinfo {
    .el-dialog {
      width: 800px;
    }
    .accountinfo-content {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 35px;
      .acleft {
        margin-right: 40px;
        text-align: center;
        .achead {
          border: 1px solid #dadada;
          width: 100px;
          height: 100px;
          margin: 20px 0;
          border-radius: 50%;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .default-hportrait {
          background-color: #409eff;
          line-height: 90px;
          text-align: center;
          color: #fff;
          font-size: 24px;
        }
      }
      div {
        .ac-title {
          font-size: 16px;
          margin: 30px 0 4px 0;
          color: #333;
        }
        .ac-content {
          font-size: 14px;
          color: #666;
          min-height: 30px;
        }
        .input {
          border: 1px solid #dcdfe6;
          border-radius: 3px;
          height: 30px;
        }
      }
    }
  }
  .resdialog {
    .el-dialog__header,
    .el-dialog__body {
      border-bottom: none;
    }
    .el-dialog {
      width: 500px;
      height: 300px;
      border-radius: 8px;
    }
    .success-icon {
      text-align: center;
    }
    .rescontent {
      text-align: center;
      margin-top: 20px;
      h3 {
        color: #333;
      }
      p {
        font-size: 14px;
        margin: 20px 0;
      }
      span {
        display: inline-block;
        width: 140px;
        height: 40px;
        line-height: 40px;
        background-color: #3577f6;
        color: #fff;
        border-radius: 4px;
        margin-bottom: 10px;
        cursor: pointer;
      }
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
