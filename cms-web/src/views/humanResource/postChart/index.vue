<template>
  <div class="postChart">
    <span class="page_head_title"
          style="margin-bottom: 12px;">岗位职责</span>
    <div class="tab_block_wrap"
         style="margin: 0 0 10px 0;">
      <ul class="default_tab_block">
        <li class="active"><span>岗位关系图</span></li>
        <li @click="linkTopostList">
          <span>岗位列表</span>
        </li>
      </ul>
      <i class="iconfont icon-cms_xiazai-"
         title="保存到本地"
         @click="domtoimageDownload"></i>
    </div>
    <div class="search-bar">
      <div class="searbar-left">
        <el-select v-model="projectPostId"
                   size="small"
                   placeholder="请选择">
          <el-option v-for="item in projectPostList"
                     :key="item.id"
                     :label="item.name"
                     :value="item.userPost.id">
          </el-option>
        </el-select>
        <div class="query-btn"
             @click="querySeach"
             style="margin-top:0">查询</div>
      </div>
    </div>
    <div class="flowChart"
         style="min-height:500px">
      <div class="dingflow-design">
        <div class="ie-polyfill-container">
          <div class="box-scale"
               style="padding-top: 20px!important"
               id="box-scale"
               ref="box-scale">
            <div v-for="(item,index) in detailsDataList"
                 :key="index"
                 :class="{'toggleClass': toggleIndex === index && toggleclass}">
              <div class="node-wrap"
                   v-if="item.type !== 'branch_warp'">
                <div class="node-wrap-box start-node"
                     :class="{'grey': !item.onDisplay}"
                     @click="getPostDetails(item.userPostId)">
                  <div>{{item.userPostName}}</div>
                  <div :title="showNameTitle(item.userName)">{{formatUserName(item.userName)}}</div>
                </div>
                <div class="add-node-btn-box">
                  <div class="add-node-btn"></div>
                </div>
              </div>
              <branchWrap v-if="item.childNode && item.type === 'branch_warp'"
                          :parentData="detailsDataList"
                          :branchData="item"
                          :routeChildNodeIndex="index"
                          @getPostDetails="getPostDetails"
                          @addtoggleClass="addtoggleClass" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-drawer :visible.sync="drawer"
               :append-to-body="true"
               :wrapperClosable="false"
               size="800px"
               @close="onHide">
      <div slot="title"
           class="drawerTitle">
        <p>查看岗位信息</p>
        <span class="editBtn"
              @click="onEdit"
              v-if="readOnly"> <i class="icon icon-edit2"></i> 编辑 </span>
      </div>
      <div class="drawBody">
        <div>
          <p class="title">基本信息</p>
          <div class="min_content">
            <el-form :model="detailData"
                     :rules="detailDataRules"
                     ref="detailData">
              <div class="item">
                <span>岗位名称<i class="required">*</i></span>
                <el-form-item prop="name">
                  <el-input v-model="detailData.name"
                            style="width:200px"
                            maxlength="20"
                            placeholder="请输入内容"
                            v-if="!readOnly"></el-input>
                  <p class="readOnlyTxt"
                     v-else>{{detailData.name}}</p>
                </el-form-item>
              </div>
              <div class="item">
                <span>岗位代码</span>
                <el-form-item prop="code">
                  <el-input v-model="detailData.code"
                            style="width:200px"
                            maxlength="30"
                            placeholder="请输入内容"
                            v-if="!readOnly"></el-input>
                  <p class="readOnlyTxt"
                     v-else>{{detailData.code}}</p>
                </el-form-item>
              </div>
              <div class="item">
                <span>职级</span>
                <el-form-item prop="rank">
                  <el-select v-model="detailData.rank"
                             placeholder="请选择"
                             style="width:200px"
                             v-if="!readOnly">
                    <el-option v-for="item in rankOptions"
                               :key="item.id"
                               :label="item.value"
                               :value="item.id">
                    </el-option>
                  </el-select>
                  <p class="readOnlyTxt"
                     v-else>{{detailData.rankValue}}</p>
                </el-form-item>
              </div>
              <div class="item">
                <span>所属组织<i class="required">*</i></span>
                <el-form-item prop="organizeId">
                  <el-select v-model="detailData.organizeId"
                             placeholder="请选择"
                             @change="leadership"
                             style="width:200px"
                             v-if="!readOnly">
                    <el-option v-for="item in organizationOptions"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id">
                    </el-option>
                  </el-select>
                  <p class="readOnlyTxt"
                     v-else>{{detailData.organizeName}}</p>
                </el-form-item>
              </div>
              <div class="item">
                <span>直属领导</span>
                <el-form-item prop="parentId">
                  <el-select v-model="detailData.parentIds"
                             placeholder="请选择"
                             style="width:200px"
                             v-if="!readOnly"
                             multiple
                             filterable>
                    <el-option v-for="item in leadershipOptions"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id">
                    </el-option>
                  </el-select>
                  <p class="readOnlyTxt"
                     v-else>{{formatViewLeaderName(detailData.parentName)}}</p>
                </el-form-item>
              </div>
              <div class="item">
                <span>岗位属性<i class="required">*</i></span>
                <el-form-item prop="onOnly">
                  <el-radio-group v-model="detailData.onOnly"
                                  style="width:200px"
                                  v-if="!readOnly">
                    <el-radio :label='true'>单人岗</el-radio>
                    <el-radio :label='false'>多人岗</el-radio>
                  </el-radio-group>
                  <p class="readOnlyTxt"
                     v-else>{{TransAttribute(detailData.onOnly)}}</p>
                </el-form-item>
              </div>
              <div class="item">
                <span>岗位状态</span>
                <el-form-item prop="useStatus">
                  <el-select v-model="detailData.useStatus"
                             placeholder="请选择"
                             style="width:200px"
                             v-if="!readOnly">
                    <el-option v-for="item in stateOptions"
                               :key="item.value"
                               :label="item.name"
                               :value="item.value">
                    </el-option>
                  </el-select>
                  <p class="readOnlyTxt"
                     v-else>{{fromatUseStatus(detailData.useStatus)}}</p>
                </el-form-item>
              </div>
              <div class="item"
                   style="width:60%">
                <span>岗位排序</span>
                <el-form-item prop="sortNumber">
                  <el-input v-model="detailData.sortNumber"
                            maxlength="30"
                            type="number"
                            placeholder="请输入内容"
                            style="width:200px"
                            v-if="!readOnly"></el-input>
                  <p class="readOnlyTxt"
                     v-else>{{detailData.sortNumber}}</p>
                </el-form-item>
              </div>
              <!-- <div class="item" style="width:92%">
                    <span>岗位职责</span>
                    <el-form-item prop="description">
                      <el-input  v-if="!readOnly"
                        type="textarea"
                        resize='none'
                        maxlength="100"
                        placeholder="请输入沟通结果（100字以内）"
                        v-model="detailData.description">
                      </el-input>
                      <div class="readOnlyTxt" v-else style="width:100%;word-wrap: break-word;word-break: normal;">{{detailData.description}}</div>
                    </el-form-item>
                  </div> -->
            </el-form>
          </div>
        </div>
        <div>
          <p class="title">岗位职责</p>
          <div class="min_content min_content1"
               style="padding:15px">
            <el-form :model="detailData"
                     :rules="detailDataRules"
                     ref="detailData">
              <el-form-item prop="description"
                            style="width:100%">
                <el-input v-if="!readOnly"
                          type="textarea"
                          resize='none'
                          maxlength="10000"
                          :rows='8'
                          placeholder="请输入岗位职责（10000字以内）"
                          v-model="detailData.description">
                </el-input>
                <div class="readOnlyTxt readOnlyTxt1"
                     v-else
                     style="width:100%;word-wrap: break-word;word-break: normal;"
                     v-html="formatreplace(detailData.description)"></div>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div>
          <p class="title">员工信息</p>
          <div class="min_content min_content1"
               style="min-height:auto">
            <el-table :data="detailData.users"
                      style="width: 100%">
              <el-table-column label="员工姓名"
                               prop="name"
                               align="center"></el-table-column>
              <el-table-column label="手机号"
                               prop="telephone"
                               align="center"></el-table-column>
              <el-table-column label="操作"
                               align="center">
                <template slot-scope="scope">
                  <el-button @click="handleEdit(scope.row.id)"
                             class="el-button--primary operation-btn"
                             size="mini">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <el-collapse v-model="activeNames"
                     class="postChartAnnexes">
          <el-collapse-item name="1">
            <template slot="title">
              <div class="slotTitle">
                <span>附件</span>
                <el-dropdown v-if="!readOnly">
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
                                   @setAnnex="setAnnex_data" />
                      </span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </template>
            <div class="collapseContent"
                 style="min-height:80px;">
              <div v-for="(item,index) in detailData.annexes"
                   :key="index">
                <span>{{item.annexName}}</span>
                <span>
                  <aliDownLoad :item="item"
                               style="margin-right:10px;display: inline-block;width:auto;height:auto" />
                  <i class="iconfont icon-lajixiang"
                     @click="dataDel(index)"
                     v-if="!readOnly"></i>
                </span>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="btndiv"
           style="margin-top: 50px; display: flex; flex-direction: row-reverse;padding-right: 30px;"
           v-if="!readOnly">
        <el-button type="primary"
                   style="width:100px;margin-left: 25px;"
                   @click="confirm('detailData')">确认</el-button>
        <el-button style="width:100px"
                   @click="onHide">取消</el-button>
      </div>
    </el-drawer>
    <!-- 查看员工   @query="queryOrganizesTree"-->
    <personalInfo :detailsdrawershow="personalDetailsShow"
                  @drawerClose="detailsClose"
                  @refreshPostChart="querySeach"
                  @handleEdit="handleEdit"
                  :detailsInfo="detailsInfo" />
  </div>
</template>

<script>
import context from '@/service'
import aliUpload from '@/components/aliUpload.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import branchWrap from './components/branchWrap.vue'
import domtoimage from 'dom-to-image'
import personalInfo from '@/views/humanResource/staffManagement/components/personalInfo'
export default {
  name: 'postChart',
  components: {
    branchWrap,
    aliUpload,
    aliDownLoad,
    personalInfo
  },
  created () {
    this.getProjectPostList()
    // this.projectList = this.$store.state.projectManagementsList
  },
  mounted () {

  },
  data () {
    return {
      fileType_data: [],
      fileSize: 100,
      upLoadText_data: '上传附件',
      activeNames: ['1'],
      viewLeaderName: '',
      projectPostId: null,
      projectPostList: [],
      detailsInfo: { // 员工详情
        userPostManagements: [
          { userPostName: '' }
        ]
      },
      detailData: { // 岗位详情
        parentName: [],
        description: ''
      },
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
      personalDetailsShow: false,
      tabledata: [],
      stateOptions: [{
        name: '使用中',
        value: 'USING'
      }, {
        name: '已停用',
        value: 'DISABLE'
      }],
      rankOptions: [],
      organizationOptions: [],
      leadershipOptions: [],
      readOnly: true,
      addFlowRules: {
        activityType: [
          { required: true, message: '请选择活动类型', trigger: 'change' }
        ]
      },
      drawer: false,
      projectList: [],
      toggleIndex: '',
      toggleclass: false,
      detailsDataList: []
    }
  },
  methods: {
    dataDel (index) {
      this.detailData.annexes.splice(index, 1)
    },
    setAnnex_data (annexURL, annexName) { // 资料存档上传
      this.detailData.annexes.push({
        annexURL: annexURL,
        annexName: annexName
      })
    },
    formatViewLeaderName (arr) { // 详情接口遍历
      return arr && arr.join(' ，')
    },
    formatreplace (description) {
      if (!description) {
        return
      }
      let html = description.replace(/\n/g, '<br/>')
      return html
    },
    formatUserName (userName) {
      let name = ''
      userName.forEach((e, index) => {
        name = name + e + ','
      })
      return name.substring(0, (name.length - 1))
    },
    showNameTitle (userName) {
      let name = `人数：${userName.length}，`
      userName.forEach((e, index) => {
        name = name + e + ','
      })
      // name = name.substring(0, (name.length - 1))
      return name.substring(0, (name.length - 1))
    },
    async confirm (formName) { // 编辑提交岗位信息
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.detailData.onOnly = JSON.parse(this.detailData.onOnly)
          // this.detailData.description = this.detailData.description.replace(/\n/g, '<br/>')
          context.http.put('uaa/api/user-posts', this.detailData).then(res => {
            if (res) {
              _this.$message({
                type: 'success',
                message: '保存成功'
              })
              _this.onHide()
              this.getPostChart(this.projectPostId)
            }
          }).catch(err => {
            if (err) {
              _this.detailData.onOnly = 'true'
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async getLeaderName () {
      if (!this.detailData.parentIds) {
        this.viewLeaderName = ''
        return false
      }
      let result = await context.http.get(`uaa/api/user-posts/${this.detailData.parentIds}`)
      this.viewLeaderName = result.data.name
    },
    async getPostDetails (id) { // 岗位详情
      let result = await context.http.get(`uaa/api/user-posts/${id}`)
      this.detailData = result.data
      this.drawer = true
      this.getOrganization()
      this.rank()
      // this.getLeaderName() // 直属领导
      this.leadership()
    },
    getPostChart (id) { // 获取岗位关系图
      context.http.get(`/uaa/api/user-posts/tree?userPostId=${id}`).then(res => {
        this.detailsDataList = res.data
        console.log(res.data)
      }).catch(error => {
        console.log(error)
      })
    },
    async getProjectPostList () { // 岗位关系图对应项目列表
      let result = await context.http.get('/uaa/api/organizes/userPost?flag=true')
      this.projectPostList = result.data
      if (this.projectPostList.length === 0) {
        return
      }
      this.projectPostId = this.projectPostList[0].userPost.id
      this.getPostChart(this.projectPostId)
      // console.log(this.projectPostList)
    },
    detailsClose () {
      this.personalDetailsShow = false
    },
    handleEdit (id) {
      context.http.get(`uaa/api/users/${id}`).then(result => {
        if (result.status === 200) {
          this.detailsInfo = result.data
          this.personalDetailsShow = true
          this.drawer = false
        }
      })
    },
    onHide () {
      this.$refs['detailData'].resetFields()
      this.readOnly = true
      this.drawer = false
    },
    onEdit () {
      this.readOnly = false
    },
    fromatUseStatus (val) {
      return val === 'USING' ? '使用中' : '已停用'
    },
    TransAttribute (val) {
      return val ? '单人岗' : '多人岗'
    },
    async getOrganization () {
      let result = await context.http.get('uaa/api/organizes/all/simple')
      this.organizationOptions = result.data
    },
    async leadership () {
      // let organizeId = this.detailData.organizeId
      // let result = await context.http.get('uaa/api/user-posts/parent', { useStatus: 'USING', organizeId: organizeId })
      // this.leadershipOptions = result.data
      let postId = this.detailData.id
      let result = await context.http.get(`uaa/api/user-posts/leadPost?postId=${postId}`, { useStatus: 'USING' })
      this.leadershipOptions = result.data
    },
    async rank () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=对应职级')
      this.rankOptions = result.data
    },
    domtoimageDownload () {
      domtoimage.toJpeg(document.getElementById('box-scale'), { quality: 0.95, bgcolor: '#f5f5f7' }).then(function (dataUrl) {
        var link = document.createElement('a')
        link.download = '岗位关系图.jpeg'
        link.href = dataUrl
        link.click()
      })
    },
    querySeach () {
      if (!this.projectPostId) {
        return
      }
      this.getPostChart(this.projectPostId)
    },
    addtoggleClass (toggleClass, routeChildNodeIndex) {
      this.toggleclass = toggleClass
      console.log(routeChildNodeIndex)
      this.toggleIndex = routeChildNodeIndex
    },
    formatMemo (memo) {
      if (!memo || memo === '') {
        return '无'
      } else {
        return memo
      }
    },
    formatStatus (s) {
      switch (s) {
        case 'REJECT':
          return '已驳回'
        case 'AGREED':
          return '已通过'
        case 'CLOSE':
          return '申请关闭'
        case 'AUTO':
          return '自动处理'
        case null:
          return '等待审核'
      }
    },
    linkTopostList () {
      this.$router.push({ name: 'postManage' })
    }
  }
}
</script>
<style lang="scss">
.postChartAnnexes {
  .el-collapse-item__header {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: #666;
    background-color: #fafafa;
    height: 40px;
    line-height: 40px;
    padding-left: 15px;
    border: 1px solid #e7e7e7;
    .slotTitle {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding-right: 20px;
    }
  }
  .el-collapse-item__wrap {
    border-left: 1px solid #eeeeee;
    border-right: 1px solid #eeeeee;
  }
  .el-collapse-item__content {
    padding-bottom: 0px;
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
    }
  }
}
.el-dropdown-menu {
  // z-index: 3333!important;
}
.el-drawer.ltr,
.el-drawer.rtl,
.el-drawer__container {
  overflow-y: auto;
}
.postChart {
  .vue-drawer {
    // z-index: 3333;
  }
}
.el-drawer {
  .el-textarea textarea {
    height: auto;
  }
  .el-drawer__header {
    text-align: center;
    padding: 0 0 10px 0;
    margin: 20px;
    border-bottom: 1px solid #eee;
    flex-direction: row-reverse;
    .drawerTitle {
      display: flex;
      justify-content: space-between;
      > p {
        width: 100%;
      }
    }
    .editBtn {
      cursor: pointer;
      display: flex;
      align-items: center;
      width: 60px;
      .icon-edit2 {
        width: 15px;
        height: 20px;
        margin-right: 4px;
        margin-top: 4px;
        background: url(../../../assets/edit.png) no-repeat;
        background-size: contain;
      }
    }
  }
  .el-drawer__body {
    padding: 0 20px 50px 20px;
  }
}
.seachDiv {
  .el-select-dropdown__item {
    padding: 0 20px !important;
  }
}
</style>
<style lang="scss" scoped>
@import "../../../style/aflow";
.toggleClass ~ div {
  display: none;
}
// .postChart{
.vue-drawer {
  z-index: 3333;
}
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
      border: 1px solid #e7e7e7;
      min-height: 200px;
      margin-bottom: 20px;
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
.seachDiv {
  background-color: #f5f5f7;
  height: 80px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  .query-btn {
    display: inline-block;
    width: 110px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
    color: #fff;
    border-radius: 3px;
    background-color: #3577f6;
    margin-left: 20px;
  }
  .query-btn:hover {
    background-color: #2a6ef0;
  }
}
.box-scale {
  > div {
    &:last-child {
      .add-node-btn-box {
        display: none;
      }
    }
  }
  .add-node-btn-box {
    .add-node-btn {
      padding: 10px 0 10px;
    }
  }
}
.node-wrap-box {
  width: 120px;
  min-height: 50px;
  height: 60px;
  font-size: 12px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(49, 117, 210, 1);
  > div {
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #fff;
    padding: 0px 10px;
    &:first-child {
      background-color: #3087fd;
    }
    &:last-child {
      // background-color: #7ab7f5;
      color: #3087fd;
    }
  }
  &.grey {
    border-color: #dadada;
    > div {
      opacity: 0.6;
    }
  }
}
.menuTab {
  height: 60px;
  margin-top: 15px;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 4px 4px 4px 1px #eee;
  justify-content: space-between;
  align-items: center;
  padding-right: 30px;
  div {
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
  i {
    font-size: 16px;
    cursor: pointer;
  }
}
// }
</style>
