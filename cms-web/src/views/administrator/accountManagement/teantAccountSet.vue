<template>
  <div class="teantAccountSet">
    <span class="page_head_title">账号配置</span>
    <ul class="default_tab_block">
      <li @click="changeTab('accountManage')"
          v-if="hasAuthority('01020303')">
        <span>账号配置</span>
      </li>
      <li class="active"
          v-if="hasAuthority('01020304')">
        <span>客户账号配置</span>
      </li>
    </ul>
    <div class="search-bar">
      <span>
        <el-select v-model="projectManagementId"
                   style="width:200px"
                   clearable
                   placeholder="项目简称">
          <el-option v-for="item in options1"
                     :key="item.id"
                     :label="item.referred"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-input v-model="queryName"
                  placeholder="姓名/职位"
                  style="width:200px"></el-input>
        <el-select v-model="useStatus"
                   clearable
                   placeholder="账号状态"
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
                 v-if="hasAuthority('01020305')"
                 @click="createAccount"><i class="iconfont icon-crm_xinzeng-"></i> 新增客户账号</el-button>
    </div>
    <div class="ct-content">
      <div class="ctc-table">
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column prop="name"
                           label="姓名"
                           align="center">
          </el-table-column>
          <el-table-column prop="telephone"
                           label="手机号"
                           align="center">
          </el-table-column>
          <el-table-column prop="jobTitle"
                           label="职位"
                           align="center">
          </el-table-column>
          <el-table-column prop="updateTime"
                           label="更新时间"
                           :formatter="formatTime"
                           align="center">
          </el-table-column>
          <el-table-column prop="projectReferred"
                           label="关联项目"
                           align="center">
          </el-table-column>
          <el-table-column prop="useStatus"
                           label="账号状态"
                           :formatter="useStatusFormater"
                           align="center">
          </el-table-column>
          <el-table-column label="操作"
                           align="center">
            <template slot-scope="scope">
              <el-button class="el-button--primary operation-btn"
                         size="mini"
                         v-if="hasAuthority('01020306')"
                         @click="editAccount(scope.$index, scope.row)">编辑</el-button>
              <span class="onlineBtn"
                    v-if="scope.row.useStatus==='DISABLE' && hasAuthority('01020307')"
                    @click="changeUseStatus(scope.row.id,'USING')">启用</span>
              <span class="offlineBtn"
                    v-if="scope.row.useStatus==='USING' && hasAuthority('01020307')"
                    @click="changeUseStatus(scope.row.id,'DISABLE')">禁用</span>
              <span class="setBtn"
                    @click="setPermiss(scope.$index, scope.row)"
                    v-if="hasAuthority('01020308')">配置权限</span>
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
    <!-- 新增客户账号 -->
    <el-dialog :title="title"
               :visible.sync="dialogVisible"
               class="addTenantGoodsDialog el_dialog_new "
               width="750px"
               @close="addTenantGoodsClose('createForm')"
               :close-on-click-modal="false">
      <div class="dialog_content">
        <el-form :model="createForm"
                 :rules="createRulese"
                 ref="createForm"
                 style="padding:0">
          <div class="content content2">
            <div class="half_page_title"
                 style="width:100%">
              <div><i></i>基本信息</div>
            </div>
            <div class="baseInfo">
              <div class="item">
                <span>姓名<i class="required">*</i></span>
                <el-form-item prop="name">
                  <el-input size="small"
                            v-if="createType==='add'"
                            v-model="createForm.name"></el-input>
                  <p v-else>{{createForm.name}}</p>
                </el-form-item>
              </div>
              <div class="item">
                <span>手机号<i class="required">*</i></span>
                <el-form-item prop="telephone">
                  <el-input size="small"
                            v-model="createForm.telephone"
                            maxlength="11"
                            v-if="createType==='add'"></el-input>
                  <p v-else>{{createForm.telephone}}</p>
                </el-form-item>
              </div>
              <div class="item">
                <span>职位<i class="required">*</i></span>
                <el-form-item prop="jobTitle">
                  <el-input size="small"
                            v-model="createForm.jobTitle"
                            v-if="createType==='add'"></el-input>
                  <p v-else>{{createForm.jobTitle}}</p>
                </el-form-item>
              </div>
            </div>
            <div class="half_page_title"
                 style="width:100%">
              <div><i></i>关联商户</div>
            </div>
            <div class="gooodsList">
              <div class="items">
                <div class="item"
                     v-for="(item,index) in createForm.projectTenantsDTOS"
                     :key="index">
                  <span>{{item.projectReferred}}-{{item.referred||item.tenantReferred}}</span>
                  <i class="iconfont icon-cms_cuowu"
                     @click="deleTenant(item,index)"></i>
                </div>
              </div>
              <div class="seach">
                <el-select v-model="getTenantParams.id"
                           style="width:160px"
                           clearable
                           size="small"
                           @change="currentSel1"
                           placeholder="项目简称">
                  <el-option v-for="item in options1"
                             :key="item.id"
                             :label="item.referred"
                             :value="item.id">
                  </el-option>
                </el-select>
                <el-input size="small"
                          @input="currentSel1"
                          v-model="getTenantParams.queryWord"
                          style="width:160px;margin-left15px"
                          placeholder="客户名称/品牌名称"></el-input>
              </div>
              <div class="goodsTable">
                <el-table :data="addTableData.content"
                          style="width: 100%">
                  <el-table-column prop="projectReferred"
                                   label="项目简称"
                                   align="center"></el-table-column>
                  <el-table-column prop="teantName"
                                   label="客户名称"
                                   align="center"></el-table-column>
                  <el-table-column prop="referred"
                                   label="品牌名称"
                                   align="center"></el-table-column>
                  <el-table-column label="行业"
                                   prop="industry"
                                   align="center"></el-table-column>
                  <el-table-column label="操作"
                                   align="center">
                    <template slot-scope="scope">
                      <span class="addTenant"
                            v-if="!scope.row.isAdd"
                            @click="addTenant(scope.$index, scope.row)">添加</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="ctc-foot1">
                <span><span style="margin-right:10px">{{pager.currentPage}}/{{Math.ceil(pager.total/pager.pgSize)}}页</span> 共{{pager.total}}条记录</span>
                <el-pagination v-if="pager.total > 0"
                               background
                               layout="prev, pager, next"
                               :page-size="pager.pgSize"
                               :total="pager.total"
                               :current-page.sync="pager.currentPage"
                               @current-change="current_change1">
                </el-pagination>
                <div class="pagingnum">
                  显示 <select v-model="pager.pgSize"
                          @change="currentSel1">
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
        </el-form>
      </div>
      <div slot="footer"
           class="slotfooter">
        <span @click="addTenantGoodsClose('createForm')"
              class="details_cannelBtn">取消</span>
        <span class="details_submitBtn"
              @click="createAccountSubmit('createForm')"
              v-if="createType==='add'">确定</span>
        <span class="details_submitBtn"
              @click="createAccountSubmit('createForm',true)"
              v-else>确定</span>
      </div>
    </el-dialog>
    <!-- 配置账号权限permission -->
    <SetPermission :detailsdrawershow="detailsShow"
                   ref="SetPermission"
                   :detailsData="detailsData"
                   :moduleData="moduleData"
                   :tenantData="tenantData"
                   @drawerClose="drawerClose" />
  </div>
</template>
<script>
import context from '@/service'
import SetPermission from './components/SetPermission'
window.repeatCode = false
export default {
  name: 'teantAccountSet',
  components: {
    SetPermission
  },
  data () {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[0-9][0-9]\d{8}$/
        console.log(reg.test(value))
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      detailsData: {},
      moduleData: [],
      tenantData: [],
      detailsShow: false,
      addTableData: [],
      title: '新增客户账号',
      createType: 'add', // edit
      createForm: {
        name: '',
        telephone: '',
        projectTenantsDTOS: [],
        jobTitle: ''
      },
      createRulese: {
        name: [
          { required: true, message: '请选择姓名', trigger: 'blur' }
        ],
        telephone: [
          { validator: checkPhone, trigger: 'blur' }
        ],
        jobTitle: [
          { required: true, message: '请输入职位', trigger: 'blur' }
        ]
      },
      getTenantParams: {
        id: '',
        queryWord: ''
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
      projectManagementId: '',
      queryName: '',
      useStatus: '',
      options1: [],
      projectManagements: '', // 账号信息-数据权限
      projectManagementsArr: [], // 编辑选中数据权限ID
      projectManagementsArrData: [], // 处理后的数据
      tableData: [{

      }],
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
      name: '',
      organizeNameStr: '',
      parentOrganizeNameStr: '',
      readonly: true,
      dialogVisible: false,
      editdialogVisible: false,
      loading: false,
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
      disabledPost: false
    }
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
    this.getTenantParams.id = this.options1[0].id
  },
  mounted () {
    this.queryUsers()
  },
  methods: {
    createAccount () {
      this.title = '新增客户账号'
      this.createType = 'add'
      this.dialogVisible = true
      this.createForm = {
        name: '',
        telephone: '',
        projectTenantsDTOS: [],
        jobTitle: ''
      }
      this.getTenantParams = {
        id: '',
        queryWord: ''
      }
      this.getTenant()
    },
    async addTenant (index, row) {
      let result = await context.http.get(`cms/api/tenant/check/business/${row.id}`)
      if (result.data) {
        row.isAdd = true
        this.createForm.projectTenantsDTOS.push(row)
      } else {
        this.$message.error(`新增失败，请先添加${row.teantName}的营业执照`)
      }
    },
    async editAccount (index, row) { // 编辑账号
      let result = await context.http.get(`uaa/api/tenantAccount/${row.id}`)
      this.createForm = result.data
      // this.createForm = row
      this.title = '编辑客户账号'
      this.createType = 'edit'
      this.dialogVisible = true
      this.getTenantParams = {
        id: '',
        queryWord: ''
      }
      this.getTenant()
    },
    deleTenant (item, index) {
      let id = item.tenantId
      this.addTableData.content.forEach((itm, idx) => {
        if (itm.tenantId === id) {
          itm.isAdd = false
        }
      })
      this.createForm.projectTenantsDTOS.splice(index, 1)
    },
    async getTenant () {
      let result = await context.http.get('/cms/api/tenant', {
        page: (this.pager.currentPage - 1),
        size: this.pager.pgSize,
        sort: 'id,desc',
        id: this.getTenantParams.id,
        queryWord: this.getTenantParams.queryWord,
        tenantContractStatus: 'IN_THE_CONTRACT',
        useStatus: 'USING'
      })
      result.data.content.forEach((item, index) => {
        item.isAdd = false
        item.tenantId = item.id
        this.createForm.projectTenantsDTOS.forEach((itm, idx) => {
          if (item.tenantId === itm.tenantId) {
            item.isAdd = true
          }
        })
      })
      this.addTableData = result.data
      this.pager.total = Number(result.data.totalElements)
    },
    createAccountSubmit (formName, isEdit) { // 创建账号
      if (!this.createForm.projectTenantsDTOS.length) {
        this.$message.error('请添加要关联的商户')
        return
      }
      this.createForm.projectTenantsDTOS = this.createForm.projectTenantsDTOS.map((item, index) => {
        let obj = {}
        // obj.tenantId = isEdit ? item.tenantId : item.id
        obj.tenantId = item.tenantId
        obj.projectReferred = item.projectReferred
        obj.referred = item.referred || item.tenantReferred
        return obj
      })
      if (isEdit) {
        context.http.put('uaa/api/tenantAccount', this.createForm).then(res => {
          if (res.status === 200 || res.status === 201) {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.addTenantGoodsClose(formName)
            this.queryUsers()
          }
        })
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            context.http.post('uaa/api/tenantAccount', this.createForm).then(res => {
              if (res.status === 200 || res.status === 201) {
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
                this.addTenantGoodsClose(formName)
                this.queryUsers()
              }
            })
          } else {
            console.log('create account fail!')
            return false
          }
        })
      }
    },
    addTenantGoodsClose (formName) {
      this.$refs[formName].resetFields()
      // this.queryUsers()
      this.dialogVisible = false
    },
    changeUseStatus (id, useStatus) {
      context.http.put(`uaa/api/tenantAccount/useStatus?useStatus=${useStatus}&id=${id}`).then(res => {
        if (res.status === 200 || res.status === 201) {
          if (useStatus === 'USING') {
            this.$message({
              message: '启用成功',
              type: 'success'
            })
          } else {
            this.$message.error('禁用成功')
          }
          this.queryUsers()
        }
      })
    },
    queryUsersbtn () {
      this.currentPage = 1
      this.queryUsers()
    },
    async queryUsers () {
      let result = await context.http.get('uaa/api/tenantAccount', {
        page: (this.currentPage - 1),
        projectManagementId: this.projectManagementId,
        size: this.pgSize,
        sort: 'lastModifiedDate,desc',
        name: this.queryName,
        useStatus: this.useStatus
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      this.tableDataLength = this.tableData.length
    },
    async setPermiss (index, row) {
      let result = await context.http.get('uaa/api/authorities/module', { moduleNames: '客户端', userTag: 'TENANT' })
      let result1 = await context.http.get(`uaa/api/tenantAccount/${row.id}`)
      this.moduleData = result.data[0].authorities
      this.tenantData = result1.data.authorities
      this.detailsData = result1.data
      // console.log(this.moduleData, this.tenantData)
      this.detailsShow = true
    },
    // ---------------------------------------------------------------------------------------
    current_change1 (currentPage) {
      this.pager.currentPage = currentPage
      this.getTenant()
    },
    currentSel1 () {
      this.pager.currentPage = 1
      this.getTenant()
    },
    drawerClose () {
      this.detailsShow = false
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
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    formatName (name) {
      if (name) {
        return name.length > 2 ? name.substring(name.length - 2) : name
      }
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
    // 获取角色
    async getRoleOptions (currentorganizeId) {
      let result = await context.http.get('uaa/api/roles/organize', { organizeId: currentorganizeId })
      this.formatRole(result.data)
    },
    userChange (selectValue) {
      this.userOptions.forEach(item => {
        if (item.value === selectValue) {
          this.telephone = item.telephone
        }
      })
    },
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
      if (row.updateTime) {
        return row.updateTime.replace('T', ' ')
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
    }
  }
}
</script>
<style lang="scss" scoped>
.teantAccountSet {
  .addTenantGoodsDialog {
    .el-form {
      .content {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 100%;
        .baseInfo {
          padding: 15px;
          width: 100%;
          display: flex;
          justify-content: space-between;
          > .item {
            width: 30%;
            font-size: 14px;
            color: #777;
            > p {
              color: #262626;
              margin-top: 8px;
            }
            .el-form-item {
              .el-form-item__content {
                > span {
                  margin-bottom: 5px;
                  display: inline-block;
                  height: 25px;
                  display: -ms-flexbox;
                  display: flex;
                  -ms-flex-align: center;
                  align-items: center;
                  font-size: 14px;
                  color: #777777;
                }
                > p {
                  color: #666666;
                  font-size: 12px;
                  height: 40px;
                  line-height: 40px;
                }
                .tips {
                  font-size: 12px;
                  color: #999999;
                  margin-top: 10px;
                }
              }
            }
          }
        }
        .gooodsList {
          padding: 15px;
          width: 100%;
          > .items {
            display: flex;
            margin-bottom: 15px;
            flex-wrap: wrap;
            .item {
              background: #eef0f7;
              border: 1px solid #bfd3fa;
              border-radius: 10px;
              padding: 2px 5px;
              color: #3575f6;
              margin-right: 15px;
              margin-bottom: 10px;
              > .iconfont {
                color: #3575f6;
                cursor: pointer;
              }
            }
          }
          > .seach {
            margin-bottom: 15px;
          }
          .goodsTable {
            .addTenant {
              color: #3575f6;
              cursor: pointer;
              &:hover {
                text-decoration: underline;
              }
            }
          }
        }
      }
    }
  }
  .ct-content {
    .ctc-table {
      .onlineBtn {
        display: inline-block;
        width: 56px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        border: 1px solid rgba(68, 175, 105, 1);
        border-radius: 3px;
        color: #44af69;
        cursor: pointer;
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
      }
      .setBtn {
        display: inline-block;
        width: 56px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        border: 1px solid #ac8959;
        border-radius: 3px;
        color: #ac8959;
        cursor: pointer;
      }
    }
  }
}
</style>
<style lang="scss">
@import "../../../style/config";
.teantAccountSet {
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
