<template>
  <div>
    <div class="ct-content">
      <div class="search-bar">
        <div style="display: flex;align-items: center">
          <!-- <el-select v-model="projectManagementId"
                     :clearable="onGroupPersonnel"
                     placeholder="项目"
                     size="small">
            <el-option v-for="item in projectOptions"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select> -->
          <el-cascader :options="organizationOptions1"
                       v-if="onGroupPersonnel"
                       change-on-select
                       clearable
                       style="width:300px;margin-right:15px"
                       expand-trigger="hover"
                       v-model="organizeId"
                       @change="handleChange1">
          </el-cascader>
          <el-cascader :options="enterpriseUser"
                       v-else
                       change-on-select
                       clearable
                       style="width:300px;margin-right:15px"
                       expand-trigger="hover"
                       v-model="organizeId">
          </el-cascader>
          <!-- <el-select v-model="enterpriseUserId"
                     v-else
                     clearable
                     placeholder="请选择"
                     size="small">
            <el-option v-for="item in enterpriseUser"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>  -->
          <el-select v-model="useStatus"
                     placeholder="请选择"
                     size="small">
            <el-option v-for="item in statusOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <div class="query-btn"
               @click="queryList">查询</div>
        </div>
        <!-- <el-checkbox-group v-model="checkList"
                           @change="bindCheckBox">
          <el-checkbox label="USING">使用中</el-checkbox>
          <el-checkbox label="DISABLE">已停用</el-checkbox>
          <el-checkbox label="">全部</el-checkbox>
        </el-checkbox-group> -->

        <el-button v-if="hasAuthority('01010101')"
                   @click="release"
                   class="tban tban1"><i class="iconfont icon-crm_xinzeng-"></i> 新增组织</el-button>
      </div>
      <div class="ctc-table">
        <el-table :data="tableData"
                  row-key="id"
                  :expand-row-keys="expands"
                  style="width: 100%">
          <el-table-column label="组织名称"
                           align="left">
            <template slot-scope="scope">
              <span style="padding-left: 10px">{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="code"
                           label="组织代码"
                           align="center">
          </el-table-column>
          <el-table-column prop="organizeType"
                           label="组织类型"
                           :formatter="organizeFormat"
                           align="center">
          </el-table-column>
          <!-- <el-table-column label="上级组织"
                           align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.parent">{{scope.row.parent.name}}</span>
              <span v-else>暂无上级组织</span>
            </template>
          </el-table-column> -->
          <el-table-column label="组织人员/员工编制"
                           align="center">
            <template slot-scope="scope">
              {{scope.row.userNumber}}/{{scope.row.staffing}}
              <span v-if="scope.row.staffing && scope.row.userNumber > scope.row.staffing"
                    style="color: red">(超编{{scope.row.userNumber - scope.row.staffing}}人)</span>
            </template>
          </el-table-column>
          <el-table-column label="负责人岗位/负责人"
                           align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.userPost">{{scope.row.userPost.name}}</span>
              <span v-if="scope.row.userName">/{{scope.row.userName}}</span>
              <span v-else>暂无负责人</span>
            </template>
          </el-table-column>
          <el-table-column prop="useStatus"
                           label="组织状态"
                           :formatter="stateFormat"
                           align="center">
          </el-table-column>
          <el-table-column label="操作"
                           v-if="hasAuthority('01010102')"
                           align="center">
            <template slot-scope="scope">
              <el-button class="el-button--primary operation-btn"
                         size="mini"
                         @click="handleEdit(scope.$index, scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog title="新增组织"
               :visible.sync="editdialogVisible"
               class="createOrganization el_dialog_new">
      <div>
        <div class="half_page_title"
             style="width:100%;margin-bottom:15px">
          <div><i></i>基本信息</div>
        </div>
        <el-form :model="create"
                 ref="createFrom"
                 :rules="createFromRules">
          <el-form-item :label-width="formLabelWidth"
                        prop="name">
            <div class="cttitle">组织名称<i class="required">*</i></div>
            <el-input v-model="create.name"
                      maxlength="30"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth"
                        style="margin-bottom: 20px;"
                        prop="code">
            <div class="cttitle">组织代码</div>
            <el-input v-model="create.code"
                      maxlength="30"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth"
                        style="margin-bottom: 20px;">
            <div class="cttitle">组织类型<i class="required">*</i></div>
            <el-radio-group v-model="create.organizeType">
              <el-radio label='COMPANY'>企业</el-radio>
              <el-radio label='PROJECT'>项目</el-radio>
              <el-radio label='DEPARTMENT'>部门</el-radio>
              <el-radio label='ENTERPRISE'>管理企业</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="projectManagementId"
                        v-if="create.organizeType === 'PROJECT'">
            <div class="cttitle">关联项目</div>
            <el-select v-model="create.projectManagementId"
                       placeholder="请选择">
              <el-option v-for="item in pjOptions"
                         :key="item.id"
                         :label="item.projectName"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth"
                        style="margin-bottom: 20px;">
            <div class="cttitle">上级组织</div>
            <!-- <el-select v-model="create.parent"
                      placeholder="请选择">
            <el-option v-for="item in organizesOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
              </el-option>
            </el-select> -->
            <el-cascader :options="organizesOptions"
                         change-on-select
                         v-model="create.parent"
                         @change="handleChange">
            </el-cascader>
          </el-form-item>
          <el-form-item prop="staffing"
                        :label-width="formLabelWidth"
                        style="margin-bottom: 20px;">
            <div class="cttitle">人员编制</div>
            <el-input v-model="create.staffing"
                      maxlength="30"
                      type="number"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item prop="sortNumber">
            <div class="cttitle">
              组织排序
              <el-tooltip class="item"
                          effect="dark"
                          placement="right-start">
                <div slot="content">组织排序会影响“组织架构图”和“组织列表”中的组织顺序</div>
                <i class="icon question-mark-icon"></i>
              </el-tooltip>
            </div>
            <el-input v-model="create.sortNumber"
                      maxlength="30"
                      type="number"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div style="height:20px;background:#F7F7F7"></div>
      <div style="margin:20px 0;"
           class="el-drawer1">
        <div class="half_page_title"
             style="width:100%;margin-bottom:15px">
          <div><i></i>组织描述</div>
        </div>
        <el-form>
          <el-form-item style="width:100%;margin:0">
            <el-input type="textarea"
                      resize='none'
                      maxlength="500"
                      :rows='5'
                      placeholder="请输入组织描述（500字以内）"
                      v-model="create.description">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- <div slot="footer"
           class="dialog-footer">
        <el-button @click="editdialogVisible = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="createOrganization"
                   class="defaultbtn dialog-confirmBtn">确 认</el-button>
      </div> -->
      <div slot="footer"
           class="slotfooter">
        <span @click="editdialogVisible = false"
              class="details_cannelBtn">取消</span>
        <span class="details_submitBtn"
              @click="createOrganization">确定</span>
      </div>
    </el-dialog>
    <setUp ref="setUp"
           :setupdrawershow="stupShow"
           :detailData="detailData"
           @getOrganization1="getOrganization1"
           @detail="detail"
           @showUserPosts="showUserPosts"
           @handleEdit="handleEdit1"
           @drawerClose="setupClose"
           @query="query" />
    <!-- 查看岗位信息 -->
    <postDetails :detailsdrawershow="postDetailsShow"
                 :detailData="postDetailData"
                 ref="postDetails"
                 @getStaffDetails="handleEdit1"
                 @updateDetails="updateDetails"
                 @drawerClose="detailsClose"
                 @query="refreshOrganization" />
    <!-- 查看员工 -->
    <personalInfo :detailsdrawershow="personalDetailsShow"
                  @drawerClose="detailsClose"
                  :detailsInfo="detailsInfo"
                  @query="query"
                  @handleEdit="handleEdit1"
                  @refreshStaff="refreshStaff" />
  </div>
</template>
<script>
import context from '@/service'
import setUp from './setup'
import postDetails from '@/views/humanResource/postManagement/components/postDetails'
import personalInfo from '@/views/humanResource/staffManagement/components/personalInfo'
import aliUpload from '@/components/aliUpload.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
export default {
  name: 'organizationalList',
  components: {
    setUp,
    postDetails,
    aliUpload,
    aliDownLoad,
    personalInfo
  },
  data () {
    return {
      // 岗位也数据
      postDetailsShow: false,
      postDetailData: {},
      enterpriseUserId: '',
      organizeId: [],
      readOnly: true,
      drawer: false,
      fileType_data: [],
      fileSize: 400,
      upLoadText_data: '上传附件',
      activeNames: ['1'],
      rankOptions: [],
      organizationOptions: [],
      organizationOptions1: [], // 组织树
      leadershipOptions: [],
      stateOptions: [{
        name: '使用中',
        value: 'USING'
      }, {
        name: '已停用',
        value: 'DISABLE'
      }],
      userPostsData: { // 岗位详情
        parentName: [],
        description: '',
        onOnly: false
      },
      userPostsDataRules: {
        name: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' }
        ],
        code: [
          { required: false, message: '请输入岗位代码', trigger: 'blur' }
        ],
        organize: [
          { required: true, message: '请选择所属组织', trigger: 'change' }
        ]
      },
      pjOptions: [],
      projectManagementId: '',
      useStatus: 'USING',
      expands: [],
      detailData: {
        parent: { id: '' },
        userPost: { id: '' }
      },
      stupShow: false,
      checkList: ['USING'],
      statusOptions: [
        {
          value: 'USING',
          label: '使用中'
        },
        {
          value: 'DISABLE',
          label: '已停用'
        },
        {
          value: '',
          label: '全部'
        }
      ],
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
      tableData: [],
      create: {
        name: '',
        code: '',
        organizeType: 'COMPANY',
        parent: null
      },
      organizesOptions: [],
      createFromRules: {
        name: [
          { required: true, message: '请输入组织名称', trigger: 'blur' }
        ],
        code: [
          { required: false, pattern: /^[0-9a-zA-Z]+$/, message: '组织代码必须为数字或字母', trigger: 'blur' }
        ],
        staffing: [
          { pattern: /^[0-9]+$/, message: '人员编制必须为数字', trigger: 'blur' }
        ],
        sortNumber: [
          { pattern: /^[0-9]+$/, message: '组织排序必须为数字', trigger: 'blur' }
        ],
        projectManagementId: [
          { required: true, message: '请选择关联项目', trigger: 'blur' }
        ]
      },
      name: '',
      formLabelWidth: '120px',
      editdialogVisible: false,
      dataLength: 0,
      parentId: '',
      projectOptions: [],
      enterpriseUser: [],
      onGroupPersonnel: false,
      // 员工也数据
      personalDetailsShow: false,
      detailsInfo: {
        facialPhoto: '',
        organizeDTO: {
          name: '',
          userPost: '',
          parent: { name: '' }
        },
        userPostManagements: [{
          organizeId: [],
          userPostId: '',
          onMaster: true
        }],
        userDynamics: [{
          user: { workPlace: { name: '' } }
        }]
      },
      pager: {
        currentPage: 1,
        total: 0,
        pgSize: 5
      },
      isAdd: false
    }
  },
  created () {
    // let user = JSON.parse(sessionStorage.getItem('user'))
    // this.onGroupPersonnel = user.onGroupPersonnel
    this.onGroupPersonnel = true
    // test
    // this.queryProjectManagement()
    if (this.onGroupPersonnel) {
      this.getOrganization1()
    } else {
      this.getEnterpriseuser()
    }
    this.queryList()
    this.getDataAuthorityOptions()
  },
  mounted () {
    setTimeout(() => {
      this.expandAll()
    }, 2000)
  },
  methods: {
    updateDetails (data) {
      this.postDetailData = data
    },
    refreshOrganization () { // 刷新组织详情
      let organizeId = this.detailData.id
      let row = {}
      row.id = organizeId
      this.handleEdit(0, row)
    },
    async queryOrganization () { // 新增时 上级组织树
      if (this.onGroupPersonnel) {
        let result = await context.http.get('uaa/api/organizes/tree', { postFlg: false })
        let organizesOptions = result.data.organizeTree
        organizesOptions.unshift({ leaf: true, data: { id: '', name: '无上级组织' }, children: [] })
        let cascaderData = []
        organizesOptions.forEach(item => {
          cascaderData.push(this.parseOrganize(item))
        })
        this.organizesOptions = cascaderData
      } else {
        let result = await context.http.get('uaa/api/organizes/enterprise/user?onTree=true')
        let organizationOptions = result.data
        organizationOptions.unshift({ id: '', name: '无上级组织', child: [] })
        let cascaderData = []
        organizationOptions.forEach(item => {
          cascaderData.push(this.parseOrganize2(item))
        })
        this.organizesOptions = cascaderData
        // console.log(this.enterpriseUser)
      }
    },
    async getOrganization1 () { // 集团人士账号树
      let result = await context.http.get('uaa/api/organizes/tree', { postFlg: false })
      let organizationOptions1 = result.data.organizeTree
      let cascaderData = []
      organizationOptions1.forEach(item => {
        cascaderData.push(this.parseOrganize(item))
      })
      this.organizationOptions1 = cascaderData
    },
    async getEnterpriseuser () { // 非集团人士账号树
      let result = await context.http.get('uaa/api/organizes/enterprise/user?onTree=true')
      let organizationOptions = result.data
      let cascaderData = []
      organizationOptions.forEach(item => {
        cascaderData.push(this.parseOrganize2(item))
      })
      this.enterpriseUser = cascaderData
    },
    onChange (pageNumber, pageSize) {
      this.tableData = this.allData.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
    },
    current_change (currentPage) {
      this.pager.currentPage = currentPage
      this.getStaffList()
    },
    query () {
      let organizeId = ''
      // if (this.onGroupPersonnel) {
      //   organizeId = this.organizeId.length ? this.organizeId[this.organizeId.length - 1] : ''
      // } else {
      //   organizeId = this.enterpriseUserId
      // }
      organizeId = this.organizeId.length ? this.organizeId[this.organizeId.length - 1] : ''
      context.http.get('uaa/api/organizes/treeAll', { 'useStatus': this.useStatus, organizeId: organizeId }).then(result => {
        if (result.status === 200 && result.data.length > 0) {
          this.tableData = result.data
          this.dataLength = result.data.length
          this.expands.push(this.tableData[0].id)
        } else {
          this.tableData = []
        }
      })
    },
    handleChange1 (val) {
      console.log(val)
    },
    async confirm (formName) { // 编辑提交岗位信息
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.userPostsData.onOnly = JSON.parse(this.userPostsData.onOnly)
          context.http.put('uaa/api/user-posts', this.userPostsData).then(res => {
            if (res.status === 200) {
              _this.$message({
                type: 'success',
                message: '保存成功'
              })
              _this.onHide()
              let row = { id: this.userPostsData.organizeId }
              _this.handleEdit(0, row)
              // _this.query()
              // this.getPostChart(this.projectPostId)
            }
          }).catch(err => {
            if (err) {
              _this.userPostsData.onOnly = 'true'
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async leadership1 () {
      let postId = this.userPostsData.id
      let result = await context.http.get(`uaa/api/user-posts/leadPost?postId=${postId}`, { useStatus: 'USING' })
      this.leadershipOptions = result.data
    },
    async showUserPosts (id) { // 岗位详情
      let result = await context.http.get(`uaa/api/user-posts/${id}`)
      this.postDetailData = result.data
      this.postDetailsShow = true
    },
    async rank () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=对应职级')
      this.rankOptions = result.data
    },
    async getOrganization () {
      let result = await context.http.get('uaa/api/organizes/all/simple')
      this.organizationOptions = result.data
    },
    async leadership (organizeId) {
      let postId = ''
      let result = await context.http.get(`uaa/api/user-posts/leadPost?postId=${postId}`, { useStatus: 'USING' })
      this.leadershipOptions = result.data
    },
    setAnnex_data (annexURL, annexName) { // 资料存档上传
      this.userPostsData.annexes.push({
        annexURL: annexURL,
        annexName: annexName
      })
    },
    formatViewLeaderName (arr) { // 详情接口遍历
      return arr && arr.join(' ，')
    },
    TransAttribute (val) {
      return val === true ? '单人岗' : '多人岗'
    },
    formatreplace (description) {
      if (!description) {
        return
      }
      let html = description.replace(/\n/g, '<br/>')
      return html
    },
    fromatUseStatus (val) {
      return val === 'USING' ? '使用中' : '已停用'
    },
    onEdit () {
      this.readOnly = false
    },
    onHide () {
      this.$refs['userPostsData'].resetFields()
      this.readOnly = true
      this.drawer = false
    },
    refreshStaff () {
      this.$refs['setUp'].getStaffList()
    },
    detail (id) {
      context.http.get(`uaa/api/organizes/${id}`).then(result => {
        this.detailData = result.data
        if (!this.detailData.parent) {
          this.detailData.parent = { id: '' }
        }
        if (!this.detailData.userPost) {
          this.detailData.userPost = { id: '' }
        }
      })
    },
    handleEdit1 (id) {
      context.http.get(`uaa/api/users/${id}`).then(result => {
        if (result.status === 200) {
          this.detailsInfo = result.data
          this.personalDetailsShow = true
          // this.postDetailsShow = false
        }
      })
    },
    detailsClose () {
      this.postDetailsShow = false
      this.personalDetailsShow = false
    },
    async queryProjectManagement () {
      let user = JSON.parse(sessionStorage.getItem('user'))
      this.onGroupPersonnel = user.onGroupPersonnel
      context.http.get('/uaa/api/organizes/userPost?flag=false', { useStatus: 'USING' }).then(res => {
        if (res.status === 200) {
          this.projectOptions = res.data
          if (this.onGroupPersonnel) {
            this.projectManagementId = ''
          } else {
            this.projectManagementId = res.data[0].id
          }
          this.queryList()
        }
      })
    },
    async getDataAuthorityOptions () {
      let result = await context.http.get('cms/api/project-managements', { page: 0, size: 100, sort: 'desc', useStatus: 'USING' })
      this.pjOptions = result.data
    },
    queryList () {
      this.query()
    },
    expandAll () {
      const els = this.$el.getElementsByClassName('el-table__row--level-0')
      for (let i = 0; i < els.length; i++) {
        els[i].getElementsByClassName('el-table__expand-icon')[0].click()
      }
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    changeNav (inx) {
      this.navList.forEach(item => {
        item.value = false
      })
      if (inx === 0) {
        this.navList[inx].value = true
      } else if (inx === 1) {
        this.navList[inx].value = true
      }
    },
    organizeFormat (row, column) {
      var orgType = ''
      if (row.organizeType === 'COMPANY') {
        orgType = '企业'
      } else if (row.organizeType === 'PROJECT') {
        orgType = '项目'
      } else if (row.organizeType === 'DEPARTMENT') {
        orgType = '部门'
      } else if (row.organizeType === 'ENTERPRISE') {
        orgType = '管理企业'
      }
      return orgType
    },
    stateFormat (row, column) {
      return row.useStatus === 'USING' ? '使用中' : '停用'
    },
    bindCheckBox (value) {
      this.checkList = []
      this.checkList.push(value[1])
      this.query()
    },
    setupClose () {
      this.stupShow = false
    },
    async handleEdit (index, row) {
      this.stupShow = true
      let result = await context.http.get(`uaa/api/organizes/${row.id}`)
      this.detailData = result.data
      if (!this.detailData.parent) {
        this.detailData.parent = { id: '' }
      }
      if (!this.detailData.userPost) {
        this.detailData.userPost = { id: '' }
      }
    },
    currentSel () {
      this.query()
    },
    async createOrganization () {
      this.$refs['createFrom'].validate((valid) => {
        if (valid) {
          let postData = JSON.parse(JSON.stringify(this.create))
          if (this.parentId) {
            postData.parent = { id: this.parentId }
          } else {
            postData.parent = null
          }
          context.http.post('uaa/api/organizes', postData).then(res => {
            if (res) {
              this.editdialogVisible = false
              this.query()
              this.getOrganization1()
              this.create = { name: '', code: '', organizeType: 'COMPANY' }
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    TimeTrans (val) {
      if (val) {
        return val.substring(0, 10)
      }
      return ''
    },
    release () {
      this.editdialogVisible = true
      this.queryOrganization()
    },
    handleChange (value) {
      if (value.length === 1 && value[(value.length) - 1] === '') {
        this.parentId = null
      } else {
        this.parentId = value[(value.length) - 1]
      }
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
    }
  }
}
</script>
<style lang="scss">
.ct-content {
  .organization-search {
    .el-input__icon {
      line-height: 70px;
    }
  }
}
</style>
<style lang="scss" scoped>
.drawBody {
  > div {
    .title {
      font-size: 14px;
      color: #666;
      background-color: #fafafa;
      height: 40px;
      line-height: 40px;
      padding-left: 15px;
      border: 1px solid #e7e7e7;
    }
    .min_content {
      padding: 15px;
      &.min_content1 {
        padding: 0;
        .readOnlyTxt1 {
          height: 200px;
          overflow-y: auto;
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
      .el-form {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .item {
          width: 32%;
          flex-direction: column;
          margin-bottom: 22px;
          > span {
            display: block;
            margin-bottom: 5px;
          }
          .readOnlyTxt {
            width: 200px;
            font-size: 12px;
            color: #999;
            padding: 8px;
          }
        }
      }
    }
  }
}
.ct-content {
  width: 100%;
  margin: 0 auto;
  .ctc-search {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
    line-height: 70px;
    background-color: #fff;
    margin: 10px 0 10px 0;
    padding-left: 20px;
    span {
      div {
        display: inline-block;
      }
    }
    .swbtn {
      margin-left: 16px;
      font-size: 18px;
      width: 100px;
      height: 44px;
      line-height: 44px;
      text-align: center;
      font-size: 18px;
      color: #000;
      background-color: #fff;
      margin-left: 16px;
      border-radius: 10px;
      cursor: pointer;
    }
    .btnselect {
      color: #fff;
      background-color: #42506c;
    }
    .addbtn {
      margin-top: 0;
    }
    div {
      cursor: pointer;
    }
  }
  .ctc-list {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    padding-top: 15px;
    .list-item {
      width: 375px;
      height: 190px;
      background-color: #fff;
      border: 1px solid #fff;
      border-radius: 8px;
      margin-bottom: 30px;
      margin-right: 44px;
      -moz-box-shadow: 2px 2px 4px #e5e5e5;
      -webkit-box-shadow: 2px 2px 4px #e5e5e5;
      box-shadow: 2px 2px 4px #e5e5e5;
      &:hover {
        border: 1px solid #5e72e4;
      }
      &:nth-child(4n) {
        margin-right: 0;
      }
    }
    .li-head {
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span:first-child {
        display: inline-block;
        font-size: 18px;
        margin-left: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 250px;
      }
      span:last-child {
        font-size: 18px;
        margin-right: 16px;
        width: 76px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border-radius: 5px;
        font-size: 14px;
        cursor: pointer;
      }
      .apply {
        border: 1px solid #5e72e4;
        color: #5e72e4;
        &:hover {
          background-color: #3349c8;
          border-color: #3349c8;
          color: #fff;
        }
      }
      .install {
        background-color: #92cf48;
        color: #fff;
      }
      .alyinstalled {
        color: #000;
        font-size: 14px;
        margin-right: 16px;
      }
      border-bottom: 1px solid #e5e5e5;
    }
    .li-content {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 14px;
      div:first-child {
        margin: 16px 20px 0 16px;
      }
      div:nth-of-type(2) {
        height: 100px;
        margin-right: 4px;
        position: relative;
        margin-top: 10px;
        span {
          display: inline-block;
          height: 72px;
          line-height: 25px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        p {
          position: absolute;
          bottom: 0;
          span {
            background-color: #3577f6;
            border-color: #3577f6;
            color: #fff;
            width: 76px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border-radius: 5px;
            font-size: 14px;
            position: relative;
            top: 10px;
            cursor: pointer;
          }
        }
      }
      // div:nth-of-type(2)::after {
      //   content:"...";
      //   font-weight:bold;
      //   position:absolute;
      //   bottom:0;
      //   right:0;
      //   padding:0 20px 1px 45px;
      //   background:url(http://lidada.org/wp-content/uploads/2017/11/overflow_bg.png) repeat-y;
      // }
      img {
        width: 100px;
        height: 100px;
        border-radius: 10px;
        border: 1px solid #ddd;
      }
      .operation {
        height: 100px;
        p {
          width: 48px;
          height: 30px;
          line-height: 30px;
          border: 1px solid #99a4b8;
          border-radius: 4px;
          text-align: center;
          position: relative;
          cursor: pointer;
          &:hover {
            background-color: #f6f6f6;
          }
        }
        p:first-child {
          left: 24px;
          top: 5px;
        }
        p:last-child {
          left: 24px;
          bottom: -50px;
        }
      }
    }
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
.el-dialog__header,
.el-dialog__body {
  margin: 0 40px;
  padding-left: 0;
}
.el-dialog__body {
  padding: 10px 0 0 0;
  height: 85%;
}
.el-form-item {
  display: inline-block;
  width: 100%;
}
.line {
  display: inline-block;
  width: 36px;
  border-bottom: 1px solid #bbbbbd;
  margin-left: 36px;
}

.el-form-item {
  margin-bottom: 14px;
}
.el-form-item__content {
  line-height: inherit;
}
.defaultbtn {
  background-color: #3577f6 !important;
  border-color: #5e72e4 !important;
}
.dl-subtitle {
  font-size: 16px;
}
.el-dialog__body {
  color: #000;
}
.required {
  color: #ff0042;
  font-size: 16px;
  position: relative;
  top: 4px;
  left: 1px;
}
.applogo {
  margin-bottom: 10px;
  div {
    display: inline-block;
  }
  .logo {
    width: 100px;
    min-height: 100px;
    border: 1px dashed #cccccc;
    border-radius: 10px;
    img {
      width: 100%;
      height: auto;
    }
  }
  .upload {
    vertical-align: top;
    margin-left: 14px;
    position: relative;
    input {
      position: absolute;
      top: 34px;
      right: 18px;
      width: 88px;
      height: 34px;
      opacity: 0;
      cursor: pointer;
    }
    .uploadbtn {
      display: inline-block;
      width: 88px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      border: 1px solid #5e72e4;
      border-radius: 8px;
      color: #5e72e4;
      margin: 34px 0 10px 0;
      cursor: pointer;
      .icon-upload {
        background: url(../../../../assets/upload.png) no-repeat;
        position: relative;
        top: 2px;
      }
    }
    p {
      font-size: 12px;
    }
  }
}
.el-radio__input.is-checked + .el-radio__label {
  color: #5e72e4;
}
.el-radio__input.is-checked .el-radio__inner {
  border-color: #5e72e4;
  background: #5e72e4;
}
.el-radio__label {
  color: #777;
}
.readonly {
  margin: 10px 0 20px 0;
  color: #666666;
}
.errorTip {
  color: red !important;
  width: 150px !important;
  left: 13px;
  position: relative;
  bottom: -75px;
}
.el-radio__inner {
  width: 18px;
  height: 18px;
}
.el-radio__inner::after {
  width: 8px;
  height: 8px;
}

.resdialog {
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
      font-size: 16px;
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
.createOrganization {
  .el-dialog__body {
    > div {
      margin-top: 20px;
      .title {
        font-size: 14px;
        color: #666;
        background-color: #fafafa;
        height: 40px;
        line-height: 40px;
        padding-left: 15px;
        border-bottom: 1px solid #e7e7e7;
      }
      .el-form {
        padding: 15px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .el-form-item {
          width: 46%;
        }
      }
    }
  }
  .el-select {
    width: 100%;
  }
  .el-form-item {
    margin-bottom: 20px !important;
  }
  .cttitle {
    margin-bottom: 4px;
  }
  .el-dialog__body {
    padding-top: 10px !important;
  }
}
.editbtn {
  color: #409eff;
}
.el-cascader {
  width: 100%;
}
</style>
