<template>
  <div class="organizationChart">
    <!-- <div class="search-bar">
      <div class="searbar-left">
        <el-select v-model="projectManagementId"
                   :clearable="onGroupPersonnel"
                   placeholder="项目"
                   size="small">
          <el-option v-for="item in projectOptions"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
        <div class="query-btn"
             @click="queryChart">查询</div>
      </div>
    </div> -->
    <div class="container">
      <div class="tipBtnBox">
        <el-button size="mini"
                   class="iconfont icon-fangda up"
                   style="margin-left:10px"
                   :disabled="defaultScale>1.5"
                   @click="up"> 放大</el-button>
        <el-button style="margin-left:10px"
                   size="mini"
                   class="iconfont icon-suoxiao shrink"
                   :disabled="defaultScale<0.3"
                   @click="shrink"> 缩小</el-button>
        <el-button style="margin-left:10px;margin-right:20px;"
                   size="mini"
                   class="iconfont icon-yuanshidaxiao shrink"
                   @click="recover"> 原始大小</el-button>
      </div>
      <div class="col-md-10 col-md-offset-1 orgTree"
           id="vue2OrgTree">
        <div id="treeCenter"
             class="text-center">
          <vue2-org-tree name="test"
                         v-for="(item, index) in organizesTreeData"
                         :key="index"
                         :data="item"
                         :horizontal="horizontal"
                         :collapsable="collapsable"
                         :label-class-name="labelClassName"
                         :render-content="renderContent"
                         @on-expand="onExpand"
                         @on-node-click="onNodeClick"
                         v-if="laodOrganizesTreeData" />
        </div>
      </div>
    </div>
    <!-- 查看组织 -->
    <setUp ref="setUp"
           :setupdrawershow="stupShow"
           :detailData="detailData"
           :projectManagementId="projectManagementId+''"
           @detail="detail"
           @handleEdit="handleEdit"
           @showUserPosts="showUserPosts"
           @drawerClose="setupClose"
           @query="queryOrganizesTree" />
    <!-- 查看岗位 -->
    <postDetails :detailsdrawershow="postDetailsShow"
                 :detailData="postDetailData"
                 ref="postDetails"
                 @getStaffDetails="handleEdit1"
                 @drawerClose="detailsClose"
                 @updateDetails="updateDetails"
                 @query="refreshOrganization" />
    <!-- 查看员工 -->
    <personalInfo :detailsdrawershow="personalDetailsShow"
                  @drawerClose="detailsClose"
                  :detailsInfo="detailsInfo"
                  @handleEdit="handleEdit"
                  @refreshStaff="refreshStaff" />
  </div>
</template>
<script>
import context from '@/service'
import setUp from './setup'
import aliUpload from '@/components/aliUpload.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import postDetails from '@/views/humanResource/postManagement/components/postDetails'
import personalInfo from '@/views/humanResource/staffManagement/components/personalInfo'
import domtoimage from 'dom-to-image'
import { setTimeout } from 'timers'
export default {
  name: 'organizationChart',
  components: {
    setUp,
    postDetails,
    aliUpload,
    aliDownLoad,
    personalInfo
  },
  data () {
    return {
      leadershipOptions: [],
      rankOptions: [],
      organizationOptions: [],
      stateOptions: [{
        name: '使用中',
        value: 'USING'
      }, {
        name: '已停用',
        value: 'DISABLE'
      }],
      fileType_data: [],
      fileSize: 100,
      upLoadText_data: '上传附件',
      activeNames: ['1'],
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
      detailData1: { // 岗位详情
        parentName: [],
        description: ''
      },
      readOnly: true,
      drawer: false,
      projectOptions: [],
      projectManagementId: '',
      organizesTreeData: {},
      laodOrganizesTreeData: false,
      horizontal: false,
      collapsable: true,
      expandAll: false,
      labelClassName: 'bg-white',
      // 组织页数据
      stupShow: false,
      detailData: { // 组织详情
        parent: { id: '' },
        userPost: { id: '' }
      },
      // 岗位也数据
      postDetailsShow: false,
      postDetailData: {},
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
      onGroupPersonnel: false,
      defaultScale: '1'
    }
  },
  created () {
    this.queryProjectManagement()
  },
  mounted () {
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
    async showUserPosts (id) { // 岗位详情
      let result = await context.http.get(`uaa/api/user-posts/${id}`)
      this.postDetailData = result.data
      this.postDetailsShow = true
    },
    refreshStaff () {
      this.$refs['setUp'].getStaffList()
    },
    async confirm (formName) { // 编辑提交岗位信息
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.detailData1.onOnly = JSON.parse(this.detailData1.onOnly)
          context.http.put('uaa/api/user-posts', this.detailData1).then(res => {
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
              _this.detailData1.onOnly = 'true'
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    dataDel (index) {
      this.detailData1.annexes.splice(index, 1)
    },
    setAnnex_data (annexURL, annexName) { // 资料存档上传
      this.detailData1.annexes.push({
        annexURL: annexURL,
        annexName: annexName
      })
    },
    detailsClose1 () {
      this.personalDetailsShow = false
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
      return val ? '单人岗' : '多人岗'
    },
    formatViewLeaderName (arr) { // 详情接口遍历
      return arr && arr.join(' ，')
    },
    async leadership1 () {
      // let organizeId = this.detailData.organizeId
      // let result = await context.http.get('uaa/api/user-posts/parent', { useStatus: 'USING', organizeId: organizeId })
      // this.leadershipOptions = result.data
      let postId = this.detailData1.id
      let result = await context.http.get(`uaa/api/user-posts/leadPost?postId=${postId}`, { useStatus: 'USING' })
      this.leadershipOptions = result.data
    },
    onEdit () {
      this.readOnly = false
    },
    onHide () {
      this.$refs['detailData1'].resetFields()
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
          this.queryChart()
        }
      })
    },
    queryChart () {
      this.queryOrganizesTree(this.projectManagementId)
    },
    queryOrganizesTree (pjId) {
      console.log(pjId)
      context.http.get('uaa/api/organizes/tree', { postFlg: false, organizeId: pjId }).then(result => {
        if (result.status === 200) {
          this.organizesTreeData = result.data.organizeTree
          // this.organizesTreeData = result.data.organizeTree[0]
          this.laodOrganizesTreeData = true
          setTimeout(() => {
            this.expandClassA()
          }, 2000)
        }
      })
    },
    expandClassA () {
      const els = this.$el.getElementsByClassName('org-tree-node-btn')
      for (let i = 0; i < els.length; i++) {
        els[i].click()
      }
    },
    query () { },
    renderContent (h, data) {
      console.log('data', data)
      let staffing = data.data.staffing || '-'
      if (data.data.organizeTreeType === 'ORGANIZE') {
        return h('div', {
          'class': { 'custom-tree-node': true, 'ORGANIZE': true }
        }, [
          h('div', {
            'class': { 'custom-tree-node-fdiv': true },
            domProps: {
              innerHTML: data.data.name
            }
          }),
          h({
            template: `
                <div class="tree-node-Popover">
                    <div class="organize-name" :title="data.data.name">{{data.data.name}}</div>
                    <div><span>负责人：</span>{{data.data.userName}}</div>
                    <div><span>人数：</span>{{data.data.number}}</div>
                    <div><span>编制：</span>{{data.data.staffing || '-'}}</div>
                </div>
            `,
            data: function () {
              return {
                data: data
              }
            }
          })
        ])
      } else if (data.data.organizeTreeType === 'POST') {
        return h('div', {
          'class': { 'custom-tree-node': true, 'POST': true }
        }, [
          h('div', {
            'class': { 'custom-tree-node': false },
            domProps: {
              innerHTML: data.data.name
            },
            attrs: {
              title: data.data.name
            }
          }),
          h('span', {
            'class': { 'custom-tree-node': false },
            domProps: {
              innerHTML: data.data.number + '人'
            }
          })
        ])
      } else {
        return h({
          template: `
                <div class="custom-tree-node yuangong">
                    <div>{{data.data.name}}</div>
                </div>
            `,
          data: function () {
            return {
              data: data
            }
          },
          methods: {
          }
        })
      }
    },
    onExpand (e, data) {
      if ('expand' in data) {
        data.expand = !data.expand
        if (!data.expand && data.children) {
          this.collapse(data.children)
        }
      } else {
        this.$set(data, 'expand', true)
      }
      e.stopPropagation()
    },
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
    async getOrganization () {
      // let result = await context.http.get('uaa/api/organizes/tree', {postFlg: false})
      // let organizationOptions = result.data.organizeTree
      // let cascaderData = []
      // organizationOptions.forEach(item => {
      //   cascaderData.push(this.parseOrganize(item))
      // })
      // this.organizationOptions = cascaderData
      let result = await context.http.get('uaa/api/organizes/all/simple')
      this.organizationOptions = result.data
    },
    async rank () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=对应职级')
      this.rankOptions = result.data
    },
    async leadership (organizeId) {
      let postId = ''
      let result = await context.http.get(`uaa/api/user-posts/leadPost?postId=${postId}`, { useStatus: 'USING' })
      this.leadershipOptions = result.data
    },
    onNodeClick (e, data) { // 点击选项执行的方法，可以用于跳转到其他链接，注意一定要写协议头
      console.log(data)
      if (data.data.organizeTreeType === 'ORGANIZE') {
        this.stupShow = true
        context.http.get(`uaa/api/organizes/${data.data.id}`).then(result => {
          this.detailData = result.data
          if (!this.detailData.parent) {
            this.detailData.parent = { id: '' }
          }
          if (!this.detailData.userPost) {
            this.detailData.userPost = { id: '' }
          }
        })
      } else if (data.data.organizeTreeType === 'POST') {
        context.http.get(`uaa/api/user-posts/${data.data.userPostId}`).then(result => {
          if (result.status === 200) {
            this.postDetailData = result.data
            this.postDetailsShow = true
          }
        })
      } else if (data.data.organizeTreeType === 'PERSON') {
        context.http.get(`uaa/api/users/${data.data.userId}`).then(result => {
          if (result.status === 200) {
            this.detailsInfo = result.data
            this.personalDetailsShow = true
          }
        })
      }
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
    collapse (list) {
      var _this = this
      list.forEach(function (child) {
        if (child.expand) {
          child.expand = false
        }
        child.children && _this.collapse(child.children)
      })
    },
    expandChange () {
      this.toggleExpand(this.data, this.expandAll)
    },
    toggleExpand (data, val) {
      var _this = this
      if (Array.isArray(data)) {
        data.forEach(function (item) {
          _this.$set(item, 'expand', val)
          if (item.children) {
            _this.toggleExpand(item.children, val)
          }
        })
      } else {
        this.$set(data, 'expand', val)
        if (data.children) {
          _this.toggleExpand(data.children, val)
        }
      }
    },
    setupClose () {
      this.stupShow = false
    },
    detailsClose () {
      this.postDetailsShow = false
      this.personalDetailsShow = false
    },
    handleEdit (id) {
      console.log(id)
      context.http.get(`uaa/api/users/${id}`).then(result => {
        if (result.status === 200) {
          this.detailsInfo = result.data
          this.personalDetailsShow = true
        }
      })
    },
    resetData (id) {
      console.log(id)
      context.http.get(`uaa/api/users/${id}`).then(result => {
        if (result.status === 200) {
          this.detailsInfo = result.data
          this.personalDetailsShow = true
        }
      })
    },
    domtoimageDownload () {
      domtoimage.toJpeg(document.getElementById('vue2OrgTree'), { quality: 0.95, bgcolor: '#fff' }).then(function (dataUrl) {
        var link = document.createElement('a')
        link.download = '组织架构图.jpeg'
        link.href = dataUrl
        link.click()
      })
    },
    shrink () {
      if (this.defaultScale < 0.3) {
        return
      }
      this.defaultScale = Number(this.defaultScale) - 0.1
      $('#treeCenter').css({
        'transform': `scale(${this.defaultScale})`,
        'transform-origin': '0 0 0'
      })
    },
    up () {
      if (this.defaultScale > 1.5) {
        return
      }
      this.defaultScale = Number(this.defaultScale) + 0.1
      $('#treeCenter').css({
        'transform': `scale(${this.defaultScale})`,
        'transform-origin': '0 0 0'
      })
    },
    recover () {
      this.defaultScale = 1
      $('#treeCenter').css({
        'transform': `scale(${this.defaultScale})`,
        'transform-origin': '0 0 0'
      })
    }
  }
}
</script>
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
      border: 1px solid #e7e7e7;
      min-height: 200px;
      margin-bottom: 20px;
      padding: 15px;
      &.min_content1 {
        padding: 0;
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
.organizationChart {
  background-color: #f5f5f7;
  .tipBtnBox {
    .icon-fangda:before,
    .icon-suoxiao:before,
    .icon-yuanshidaxiao:before {
      font-size: 14px;
    }
    .el-button:hover,
    .el-button:focus {
      border: 1px solid #3575f6;
      color: #3575f6;
      background: #fff;
    }
  }
  .chart-search {
    display: flex;
    align-items: center;
    height: 70px;
    line-height: 70px;
    background-color: #fff;
    margin: 10px 0 10px 0;
    padding-left: 20px;
    .el-input__icon {
      line-height: 70px;
    }
    .query-btn {
      margin: 0;
      margin-left: 30px;
    }
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
  .container {
    background: #fff;
    .tipBtnBox {
      display: flex;
      height: 68px;
      justify-content: flex-end;
      align-items: center;
      .el-button {
        display: block;
        padding: 7px 10px;
      }
    }
    .orgTree {
      height: 630px;
      overflow: auto;
      background: #fff;
    }
  }
  .orgTree::-webkit-scrollbar {
    width: 4px !important;
    height: 4px !important;
  }
  .orgTree::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px #fff;
    background-color: #fff;
  }
  .orgTree::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px #cccccc;
  }
  .org-tree-node-label {
    white-space: nowrap;
    cursor: pointer;
    border-radius: 3px;
    &:hover {
      .org-tree-node-label-inner {
        .ORGANIZE{
          background-color: #3575F6!important;
          .custom-tree-node-fdiv{
            color: #ffffff!important;
          }
          .tree-node-Popover{
            display: block;
          }
        }
      }
    }
    .org-tree-node-label-inner {
      padding: 0;
      border-radius: 3px;
    }
  }
  .bg-white {
    background-color: white;
  }
  .bg-orange {
    background-color: orange;
  }
  .bg-gold {
    background-color: gold;
  }
  .bg-gray {
    background-color: gray;
  }
  .bg-lightpink {
    background-color: lightpink;
  }
  .bg-chocolate {
    background-color: chocolate;
  }
  .bg-tomato {
    background-color: tomato;
  }
  .custom-tree-node {
    // background-color: #3296FA;
    // margin: -10px -15px;
    // padding: 10px 15px;
  }
  .POST {
    margin: -10px -15px;
    text-align: center;
    background-color: #3577f6;
    border-radius: 3px;
    div {
      color: #fff;
      background-color: #3577f6;
      margin: 0 auto;
      height: 80px;
      width: 15px;
      text-align: center;
      white-space: pre-line;
      font-size: 12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      // padding: 10px 0;
    }
    span {
      font-size: 12px;
      color: #3577f6;
      display: inline-block;
      background-color: #fff;
      padding: 6px;
      border-bottom-left-radius: 2px;
      border-bottom-right-radius: 2px;
    }
  }
  .POST div {
    writing-mode: vertical-rl;
  }
  .yuangong {
    margin: -10px -15px;
    text-align: center;
    border-radius: 3px;
    &:hover {
      color: #3577f6;
    }
  }
  .yuangong div {
    writing-mode: vertical-rl;
    background-color: #fff;
    margin: -21px -11px;
    padding: 12px 15px;
    box-shadow: none;
  }
  .text-center {
    text-align: center;
    > div {
      vertical-align: text-top;
    }
  }
  .ORGANIZE {
    width: 38px;
    height: 120px;
    background: #F2F6FF;
    text-align: center;
    border-radius: 3px;
    position: relative;
    .custom-tree-node-fdiv {
      font-size: 12px;
      /* color: #888888; */
      margin-bottom: 5px;
      padding: 0 8px;
      box-sizing: border-box;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #3575f6;
      &:first-child {
        font-size: 14px;
        margin-bottom: 6px;
        text-align: center;
        writing-mode: vertical-rl;
        height: inherit;
        /* border-top-left-radius: 3px;
        border-top-right-radius: 3px; */
        border-radius: 4px;
        padding-top: 10px;
        padding-bottom: 10px;
        border: 1px solid #3575F6;
      }
      &:nth-child(2) {
        font-size: 12px;
        color: #333333;
        margin-bottom: 5px;
        font-weight: bold;
        min-height: 16px;
      }
    }
    .tree-node-Popover{
      position: absolute;
      width: 140px;
      height: 120px;
      background: rgba(255,255,255,0.9000);
      border: 1px solid #F2F2F2;
      box-shadow: 0px 4px 16px 0px rgba(101,100,100,0.3500);
      border-radius: 4px;
      top: 0;
      left: 55px;
      font-size: 14px;
      padding: 15px;
      z-index: 999;
      display: none;
      .organize-name{
        color: #3575F6;
        font-weight: 500;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      div {
        text-align: left;
        margin-bottom: 5px;
        span {
          color: #888A98;
        }
      }
    }
  }
}
.org-tree-node-children {
  // width: 210px;
  margin: 0 auto !important;
}
.org-tree-node-btn:before {
  // top: 48%!important;
}
.org-tree-node-btn:after {
  // left: 48%!important;
}
.org-tree-node-children:before {
  width: 4px !important;
}
.org-tree-node-btn {
  border: 1px solid #aaaaaa !important;
  box-shadow: 0 0 2px #aaaaaa !important;
}
.org-tree-node-btn.expanded:before {
  border-top: 1px solid #3577f6 !important;
}
.org-tree-node-btn.expanded {
  border: 1px solid #3577f6 !important;
  box-shadow: 0 0 2px #3577f6 !important;
}
.org-tree-container {
  background-color: #fff !important;
}
</style>
