<template>
  <div class="postManage">
    <span class="page_head_title"
          style="margin-bottom: 12px;">岗位职责</span>
    <!-- <div class="tab_block_wrap"
         style="margin: 0 0 10px 0;">
      <ul class="default_tab_block">
        <li @click="linkTopostChart"><span>岗位关系图</span></li>
        <li class="active"><span>岗位列表</span></li>
      </ul>
    </div> -->
    <div class="search-bar">
      <div class="searbar-left">
        <el-cascader :options="organizationOptions1"
                     v-if="onGroupPersonnel"
                     change-on-select
                     clearable
                     style="width:200px;margin-right:15px"
                     expand-trigger="hover"
                     v-model="organizeId">
        </el-cascader>
        <el-cascader :options="enterpriseUser"
                     v-else
                     change-on-select
                     clearable
                     style="width:300px;margin-right:15px"
                     expand-trigger="hover"
                     v-model="organizeId">
        </el-cascader>
        <el-input v-model="postCode"
                  style="width:200px;"
                  placeholder="岗位名称"></el-input>
        <el-select v-model="useStatus"
                   placeholder="请选择"
                   style="width:200px">
          <el-option v-for="item in statusOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
        <div class="query-btn"
             @click="querySeach">查询</div>
      </div>
      <el-button class="tban tban1"
                 v-if="hasAuthority('01010201')"
                 @click="release"><i class="iconfont icon-crm_xinzeng-"></i> 新增岗位</el-button>
    </div>
    <div class="ct-content">
      <!-- <el-checkbox-group v-model="checkList"
                         @change="bindCheckBox">
        <el-checkbox label="USING">使用中</el-checkbox>
        <el-checkbox label="DISABLE">已停用</el-checkbox>
        <el-checkbox label="">全部</el-checkbox>
      </el-checkbox-group> -->
      <div class="ctc-table">
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column prop="companyShortName"
                           label="岗位名称"
                           align="center">
            <template slot-scope="scope">
              {{scope.row.name}}
            </template>
          </el-table-column>
          <el-table-column prop="organizeName"
                           label="所属组织"
                           align="center">
          </el-table-column>
          <el-table-column label="姓名"
                           align="center">
            <template slot-scope="scope">
              <span v-for="(item, index) in scope.row.userPostManagements"
                    :key="index">{{item.userName}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="useStatus"
                           label="岗位状态"
                           :formatter="stateFormat"
                           align="center">
          </el-table-column>
          <el-table-column label="操作"
                           v-if="hasAuthority('01010202')"
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

    <el-dialog title="新增岗位"
               :visible.sync="editdialogVisible"
               :close-on-click-modal="false"
               @close="addClose"
               class="addpostdialog el_dialog_new">
      <div class="drawBody dialog_content">
        <el-form :model="addData"
                 ref="addData"
                 :rules="addDataRules">
          <div class="title">
            <i></i>
            <span>基本信息</span>
          </div>
          <div>
            <div class="min_content">
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;">
                <div class="cttitle">所属组织<i class="required">*</i></div>
                <el-cascader :options="organizationOptions1"
                             v-if="onGroupPersonnel"
                             change-on-select
                             v-model="addData.organizeId"
                             @change="handleChange">
                </el-cascader>
                <el-cascader :options="enterpriseUser"
                             v-else
                             change-on-select
                             clearable
                             expand-trigger="hover"
                             @change="handleChange"
                             v-model="addData.organizeId">
                </el-cascader>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            prop="name">
                <div class="cttitle">岗位名称<i class="required">*</i></div>
                <el-input v-model="addData.name"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            prop="parentIds"
                            style="margin-bottom: 20px;">
                <div class="cttitle">上级岗位</div>
                <el-select v-model="addData.parentIds"
                           placeholder="请选择"
                           @change="showParentId"
                           filterable>
                  <el-option v-for="item in leadershipOptions"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            prop="onOnly"
                            style="margin-bottom: 20px;">
                <div class="cttitle">岗位属性<i class="required">*</i></div>
                <el-radio-group v-model="addData.onOnly">
                  <el-radio label='true'>单人岗</el-radio>
                  <el-radio label='false'>多人岗</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
          <div class="boxshdow"></div>
          <div class="title">
            <i></i>
            <span>岗位职责</span>
          </div>
          <div style="width:100%">
            <div class="min_content min_content1"
                 style="padding:15px;min-height:120px;">
              <el-form-item prop="description"
                            style="width:100%">
                <el-input type="textarea"
                          resize='none'
                          maxlength="10000"
                          :rows='5'
                          placeholder="请输入岗位职责（10000字以内）"
                          v-model="addData.description">
                </el-input>
              </el-form-item>
            </div>
          </div>
          <!-- <el-collapse v-model="activeNames"
                       class="postChartAnnexes">
            <el-collapse-item name="1">
              <template slot="title">
                <div class="slotTitle">
                  <span>附件</span>
                  <el-dropdown>
                    <span class="el-dropdown-link">
                      <span class="iconfont icon-moreif"></span>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <span class="iconfont icon-attachment">
                          <aliUpload class="aliUpload emergencyAliUpload"
                                     style="display: inline-block;"
                                     :upLoadText="upLoadText_data"
                                     :fileSize="fileSize"
                                     :fileType="fileType_data"
                                     :iconShow="false"
                                     @setAnnex="setAnnex_data1" />
                        </span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
              <div class="collapseContent"
                   style="min-height:80px;">
                <div v-for="(item,index) in addData.annexes"
                     :key="index">
                  <span>{{item.annexName}}</span>
                  <span>
                    <aliDownLoad :item="item"
                                 style="margin-right:10px;display: inline-block;width:auto;height:auto" />
                    <i class="iconfont icon-lajixiang"
                       @click="dataDel1(index)"
                       v-if="!readOnly"></i>
                  </span>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse> -->
        </el-form>
      </div>
      <div slot="footer"
           class="slotfooter">
        <span @click="addClose"
              class="details_cannelBtn">关闭</span>
        <span @click="addPost('addData')"
              class="details_submitBtn">确定</span>
      </div>
    </el-dialog>
    <!-- 查看岗位信息 -->
    <postDetails :detailsdrawershow="detailsShow"
                 :detailData="detailData"
                 ref="postDetails"
                 @getStaffDetails="handleEdit1"
                 @drawerClose="detailsClose"
                 @updateDetails="updateDetails"
                 @query="query" />
    <!-- 查看员工   @query="queryOrganizesTree"-->
    <personalInfo :detailsdrawershow="personalDetailsShow"
                  @drawerClose="detailsClose1"
                  @refreshPostChart="querySeach"
                  @handleEdit="handleEdit1"
                  :detailsInfo="detailsInfo" />
  </div>
</template>
<script>
import context from '@/service'
import postDetails from './components/postDetails'
import aliUpload from '@/components/aliUpload.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import personalInfo from '@/views/humanResource/staffManagement/components/personalInfo'
export default {
  name: 'postManage',
  components: {
    postDetails,
    aliUpload,
    aliDownLoad,
    personalInfo
  },
  data () {
    return {
      enterpriseUser: [],
      enterpriseUserId: '',
      stateOptions: [{
        name: '使用中',
        value: 'USING'
      }, {
        name: '已停用',
        value: 'DISABLE'
      }],
      fileType_data: [],
      fileSize: 400,
      upLoadText_data: '上传附件',
      activeNames: ['1'],
      detailsInfo: { // 员工详情
        userPostManagements: [
          { userPostName: '' }
        ]
      },
      personalDetailsShow: false,
      detailDataRules: {
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
      detailData: { // 岗位详情
        parentName: [],
        description: '',
        parentIds: []
      },
      readOnly: true,
      drawer: false,
      projectManagementId: '',
      useStatus: 'USING',
      projectOptions: [],
      postCode: '',
      detailsShow: false,
      checkList: ['USING'],
      isIndeterminate: true,
      loading: false,
      leadershipOptions: [],
      rankOptions: [],
      organizationOptions: [],
      organizationOptions1: [],
      addData: {
        description: '',
        parentIds: [],
        organizeId: [],
        name: '',
        onOnly: 'false',
        annexes: []
      },
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
      addDataRules: {
        name: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' }
        ],
        code: [
          { required: false, message: '请输入岗位代码', trigger: 'blur' }
        ],
        organizeId: [
          { required: true, message: '请选择所属组织', trigger: 'change' }
        ],
        sortNumber: [
          { pattern: /^[0-9]+$/, message: '岗位排序必须为数字', trigger: 'blur' }
        ]
      },
      name: '',
      currentPage: 1,
      pgNum: 1,
      total: 0,
      pgSize: 15,
      formLabelWidth: '120px',
      editdialogVisible: false,
      dataLength: 0,
      organizeId: '',
      addOrganizeId: null,
      onGroupPersonnel: false
    }
  },
  created () {
    // let user = JSON.parse(sessionStorage.getItem('user'))
    this.onGroupPersonnel = true
    if (this.onGroupPersonnel) {
      this.getOrganization1()
    } else {
      this.getEnterpriseuser()
    }
    this.query()
    // this.queryProjectManagement()
  },
  methods: {
    addClose () {
      this.$nextTick(() => {
        this.addData.organizeId = []
        this.addData.parentIds = []
        this.leadershipOptions = []
        this.addData.onOnly = 'false'
        this.$refs['addData'].resetFields()
        this.editdialogVisible = false
      })
    },
    handleChange (value) {
      this.addData.parentIds = []
      if (!value) return
      if (value.length === 1 && value[(value.length) - 1] === '') {
        this.addOrganizeId = null
      } else {
        this.addOrganizeId = value[(value.length) - 1]
      }
      this.leadership(this.addOrganizeId)
    },
    async addPost (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let addData = JSON.parse(JSON.stringify(this.addData))
          addData.organizeId = this.addOrganizeId
          if (addData.parentIds === '' || addData.parentIds.length === 0) {
            addData.parentIds = []
          } else {
            addData.parentIds = [addData.parentIds]
          }
          if (!addData.organizeId) {
            this.$message.error('请选择所属组织')
            return
          }
          context.http.post('uaa/api/user-posts', addData).then(res => {
            if (res) {
              // this.addData = { onOnly: 'false' }
              this.$message.success('新增成功')
              this.query()
              this.addClose()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async query () {
      let organizeId = ''
      // if (this.onGroupPersonnel) {
      //   organizeId = this.organizeId.length ? this.organizeId[this.organizeId.length - 1] : ''
      // } else {
      //   organizeId = this.enterpriseUserId
      // }
      organizeId = this.organizeId.length ? this.organizeId[this.organizeId.length - 1] : ''
      let result = await context.http.get('uaa/api/user-posts', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'desc',
        useStatus: this.useStatus,
        organizeId: organizeId,
        name: this.postCode,
        code: this.postCode
      })
      this.tableData = result.data
      this.dataLength = result.data.length
      this.total = Number(result.headers['x-total-count'])
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
    async getOrganization1 () { // 集团人士权限 组织树
      let result = await context.http.get('uaa/api/organizes/tree', { postFlg: false })
      let organizationOptions1 = result.data.organizeTree
      let cascaderData = []
      organizationOptions1.forEach(item => {
        cascaderData.push(this.parseOrganize(item))
      })
      this.organizationOptions1 = cascaderData
    },
    dataDel (index) {
      this.detailData.annexes.splice(index, 1)
    },
    setAnnex_data (annexURL, annexName) { // 资料存档上传
      this.detailData.annexes.push({
        annexURL: annexURL,
        annexName: annexName
      })
    },
    dataDel1 (index) {
      this.addData.annexes.splice(index, 1)
    },
    setAnnex_data1 (annexURL, annexName) { // 资料存档上传
      this.addData.annexes.push({
        annexURL: annexURL,
        annexName: annexName
      })
    },
    detailsClose1 () {
      this.personalDetailsShow = false
    },
    handleEdit1 (id) { // 员工详情
      context.http.get(`uaa/api/users/${id}`).then(result => {
        if (result.status === 200) {
          this.detailsInfo = result.data
          this.personalDetailsShow = true
          this.drawer = false
        }
      })
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
    TransAttribute (val) {
      return val === 'true' ? '单人岗' : '多人岗'
    },
    formatViewLeaderName (arr) { // 详情接口遍历
      return arr && arr.join(' ，')
    },
    onEdit () {
      this.readOnly = false
    },
    onHide () {
      this.$refs['detailData'].resetFields()
      this.readOnly = true
      this.drawer = false
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
          this.query()
        }
      })
    },
    querySeach () {
      this.currentPage = 1
      this.query()
    },
    showParentId (id) {
      // this.addData.parentIds = []
      // this.addData.parentIds.push(id)
      // console.log(this.addData.parentIds)
    },
    linkTopostChart () {
      this.$router.push({ name: 'postChart' })
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    stateFormat (row, column) {
      return row.useStatus === 'USING' ? '使用中' : '停用'
    },
    bindCheckBox (value) {
      this.checkList = []
      this.checkList.push(value[1])
      this.currentPage = 1
      this.query()
    },
    detailsClose () {
      this.detailsShow = false
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    async rank () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=对应职级')
      this.rankOptions = result.data
    },
    async leadership (organizeId, postId) {
      this.leadershipOptions = []
      let result = await context.http.get('/uaa/api/user-posts/parent', { useStatus: 'USING', organizeId: organizeId, postId: postId })
      this.leadershipOptions = result.data
    },
    // async getOrganization () {
    //   let result = await context.http.get('uaa/api/organizes/all/simple')
    //   this.organizationOptions = result.data
    // },
    parseOrganize (organizeTree) {
      if (organizeTree.leaf) {
        return { value: organizeTree.data.id ? organizeTree.data.id : organizeTree.data.userPostId ? organizeTree.data.userPostId : organizeTree.data.userId, label: organizeTree.data.name }
      } else {
        return {
          value: organizeTree.data.id ? organizeTree.data.id : organizeTree.data.userPostId ? organizeTree.data.userPostId : organizeTree.data.userId,
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
    },
    updateDetails (id) {
      this.handleEdit(id)
    },
    async handleEdit (id) {
      let result = await context.http.get(`uaa/api/user-posts/${id}`)
      this.detailData = result.data
      this.detailsShow = true
      // this.getOrganization()
      // this.rank()
      // ----------------------------------------------------
      // let result = await context.http.get(`uaa/api/user-posts/${row.id}`)
      // this.detailData = result.data
      // this.drawer = true
      // // this.getOrganization()
      // this.rank()
      // // this.getLeaderName() // 直属领导
      // this.leadership(this.detailData.organizeId, this.detailData.id)
    },
    release () {
      this.editdialogVisible = true
      this.getOrganization1()
      this.rank()
    }
  }
}
</script>
<style lang="scss" scoped>
.drawBody {
  .el-form {
    padding: 0 !important;
    > .title {
      width: 100%;
    }
    .boxshdow {
      background-color: rgb(248, 245, 245);
      width: 100%;
      padding: 0;
      height: 15px;
    }
    > div {
      padding: 15px;
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
</style>
<style lang="scss">
@import "../../../style/config";
.postManage {
  font-size: 16px;
  background-color: #f9f9f9;
  .menuTab {
    height: 60px;
    margin-top: 15px;
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 4px 4px 4px 1px #eee;
    > span {
      display: inline-block;
      width: 120px;
      text-align: center;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
      font-size: 14px;
      &.active {
        color: #3577f6;
        border-bottom: 2px solid #3577f6;
      }
    }
  }
  .ct-content {
    width: 100%;
    margin: 0 auto;
    .ctc-table {
      padding-top: 1px;
    }
    .ctc-search {
      height: 70px;
      line-height: 70px;
      background-color: #fff;
      margin: 20px 0 20px 0;
      padding-left: 18px;
      .el-input {
        width: 200px;
        input {
          height: 32px;
          line-height: 32px;
        }
      }
      div {
        float: left;
        display: inline-block;
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
    color: $color-red-1;
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
          background: url(../../../assets/upload.png) no-repeat;
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
  .addpostdialog {
    .el-dialog {
      width: 800px;
    }
    .el-select {
      width: 100%;
    }
    .el-form-item {
      width: 30%;
      margin-bottom: 20px !important;
      margin-right: 30px;
      &:nth-of-type(3n) {
        margin-right: 0;
      }
    }
    .cttitle {
      margin-bottom: 4px;
    }
    .el-dialog__body {
      padding-top: 10px !important;
    }
    .el-textarea__inner {
      height: auto;
    }
  }
  .editbtn {
    color: #409eff;
  }
  .el-cascader {
    width: 100%;
  }
}
</style>
