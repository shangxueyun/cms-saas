<template>
  <div class="project-list">
    <span class="page_head_title">项目信息</span>
    <div class="pl-content">
      <div class="search-bar">
        <div>
          <el-select v-model="organizeId"
                     collapse-tags
                     multiple
                     placeholder="管理企业">
            <el-option v-for="item in projectNameOptions"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="useStatus"
                     placeholder="状态">
            <el-option v-for="item in useStatusOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <div class="query-btn"
               @click="queryProjectList">查询</div>
        </div>
        <el-button v-if="hasAuthority('02010101')"
                   @click="addProjects"
                   class="tban tban1">
          <i class="iconfont icon-crm_xinzeng-"></i>
          新增项目
        </el-button>
      </div>
      <div class="projectList_content">
        <!-- 一级数据渲染 -->
        <div class="plc-list"
             v-for="(item, index) in projectList"
             :key="index">
          <!-- 项目列表头部 -->
          <div class="list-bar">
            <h3>{{ item.organizeName }}</h3>
            <div class="pList">
              <p class="p1">
                <span>楼宇总数：{{ item.buildingAmount ? item.buildingAmount : '-' }}</span>
                <span>入驻企业数：{{ item.tatolAmount ? item.tatolAmount : '-' }}</span>
                <span>总面积：{{ item.area ? `${item.area} m²` : '-' }}</span>
              </p>
              <p class="p2">
                <span>可租可售面积：{{ item.canRentSellArea ? `${item.canRentSellArea}m²` : '-' }}</span>
                <span>已租已售面积：{{ item.rentSellArea ? `${item.rentSellArea}m²` : '-' }}</span>
                <span>自用面积：{{ item.selfUseArea ? `${item.selfUseArea}m²` : '-' }}</span>
                <span>已租已售及自用面积：{{ item.rentSellSelfUseArea ? `${item.rentSellSelfUseArea}m²` : '-' }}</span>
              </p>
            </div>
          </div>
          <div class="listContent">
            <div :ref="`listItem` + child"
                 class="list-item"
                 v-for="(itemChild, child) in item.projectManagementDTO"
                 :key="child">
              <div :style="'height:'+itemChild.height"
                   class="project-state"
                   v-if="itemChild.useStatus === 'DISABLE'"
                   @click="handleEdit(child, itemChild.id)">
                已停用
              </div>
              <img :style="'height:'+itemChild.height"
                   :src="itemChild.previewImage"
                   @click="handleEdit(child, itemChild.id)">
              <span class="projectInfo"
                    @click="handleEdit(child, itemChild.id)">
                {{itemChild.projectName}}
              </span>
              <div class="pjOperation">
                <span v-if="hasAuthority('02010104')"
                      @click="buildingManagement(itemChild, item.organizeName)"><i class="iconfont icon-cms_louyu-1"></i><span>楼宇</span></span>
                <span v-if="hasAuthority('02010104') && hasAuthority('02010106')"></span>
                <span class="adminUnit"
                      v-if="hasAuthority('02010106')"
                      @click="adminUnit(itemChild.id)"><i class="iconfont icon-cms_zhuguanbumen"></i><span>关联单位</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="新增项目"
               :close-on-click-modal="false"
               :visible.sync="adddialogVisible"
               width="950px"
               class="addProjectdialog">

      <addProject v-if="adddialogVisible"
                  ref="addProject"
                  @query="queryProjectList"
                  @dialogClose="dialogClose"
                  @changeStep="changeStep" />

      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   v-if="step1"
                   @click="adddialogVisible = false"
                   class="close-button">取消</el-button>
        <el-button type="primary"
                   class="defaultbtn dialog-confirmBtn"
                   @click="addProjectConfirm()">确定</el-button>
      </div>
    </el-dialog>
    <projectDetails :addProjectShow="addProjectShow"
                    :isFromSeach="false"
                    :projectDetailData="projectDetail"
                    @handleEdit="handleEdit"
                    @query="queryProjectList"
                    @drawerClose="drawerClose" />
  </div>
</template>
<script>
import context from '@/service'
import addProject from './components/addproject'
import projectDetails from './components/projectDetails'
export default {
  components: {
    addProject,
    projectDetails
  },
  data () {
    return {
      projectList: {},
      projectDetail: {},
      organizeId: '',
      projectNameOptions: [],
      useStatus: 'USING',
      useStatusOptions: [
        {
          value: 'USING',
          label: '使用中'
        },
        {
          value: 'DISABLE',
          label: '已停用'
        }
      ],
      checkList: ['USING'],
      adddialogVisible: false,
      addProjectShow: false,
      step1: true,
      step2: false,
      step3: false,
      currentPage: 1,
      pgSize: 9999,
      checkClassList: [],
      classList: [],
      onGroupPersonnel: false,
      organizationOptions1: []
    }
  },
  mounted () {
    this.step1 = true
    this.step2 = false
    this.step3 = false
    this.getEnterpriseuser()
    let that = this
    window.onresize = function () {
      that.getImgWidth()
    }
  },
  created () {
    let queryData = JSON.parse(sessionStorage.getItem('queryData'))
    if (queryData) {
      this.organizeId = queryData.organizeId
      this.useStatus = queryData.useStatus
      sessionStorage.removeItem('queryData')
    }
    // let user = JSON.parse(sessionStorage.getItem('user'))
    // this.onGroupPersonnel = user.onGroupPersonnel
    // if (this.onGroupPersonnel) {
    //   this.getEnterpriseuser()
    // } else {
    //   this.getProjectManagementType()
    // }
  },
  // 进
  beforeRouteEnter (to, from, next) {
    next()
  },
  beforeRouteUpdate (to, from, next) {
    next()
  },
  // 走
  beforeRouteLeave (to, from, next) {
    if (to.name === 'buildingList' || to.name === 'adminUnit') {
      let organizeId = this.organizeId
      let useStatus = this.useStatus
      sessionStorage.setItem('queryData', JSON.stringify({ organizeId, useStatus, routeName: from.name }))
    }
    next()
  },
  methods: {
    async getEnterpriseuser () { // 非集团人士权限 组织列表
      let result = await context.http.get('uaa/api/organizes/enterprise/user?onTree=true')
      this.projectNameOptions = result.data
      this.queryProjectList()
    },
    // async getEnterpriseuser () {
    //   let result = await context.http.get('uaa/api/organizes/enterprise/user?organizeType=ENTERPRISE&useStatus=USING')
    //   this.projectNameOptions = result.data
    //   this.queryProjectList()
    // },
    async getProjectManagementType () {
      let result = await context.http.get('uaa/api/organizes/all/simple?organizeType=ENTERPRISE&useStatus=USING')
      this.projectNameOptions = result.data
      this.queryProjectList()
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
    adminUnit (id) { // 关联单位
      this.$router.push({ name: 'adminUnit', params: { projectId: id } })
    },
    planDesign (id) { // 平面图设计
      this.$router.push({ name: 'planDesign', params: { projectId: id } })
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    dialogClose () {
      this.adddialogVisible = false
    },
    projectDetails () {

    },
    getImgWidth () {
      if (this.projectList.length) {
        let width = null
        if (this.$refs['listItem0']) {
          width = this.$refs['listItem0'][0].clientWidth
        }
        let projectList = this.projectList
        projectList.forEach((item, i) => {
          let height = (width * 1.07).toFixed(2) + 'px'
          this.$set(this.projectList[i], 'height', height)
        })
      }
    },
    async queryProjectList () {
      let result = await context.http.get('cms/api/getOrganiz/infoByids', { useStatus: this.useStatus, ids: this.organizeId.toString() })
      this.projectList = result.data
      this.$nextTick(() => {
        this.getImgWidth()
      })
    },
    handleEdit (index, id) {
      if (this.hasAuthority('02010102')) {
        this.queryProjectDetail(id)
        this.addProjectShow = true
      }
    },
    async queryProjectDetail (id) {
      let result = await context.http.get(`cms/api/project-managements/${id}`)
      this.projectDetail = result.data
    },
    drawerClose () {
      this.addProjectShow = false
    },
    buildingManagement (itemChild, organizeName) {
      this.$router.push({ path: '/home/buildingList', query: { itemChild: itemChild, organizeName } })
    },

    addProjects () {
      this.step1 = true
      this.step2 = false
      this.step3 = false
      this.adddialogVisible = true
    },
    bindCheckBox (value) {
      this.checkList = []
      this.checkList.push(value[1])
      this.currentPage = 1
      this.queryProjectList()
    },
    bindCheckBoxClass (value) {
      this.currentPage = 1
      this.queryProjectList()
    },
    addProjectConfirm () {
      this.$refs.addProject.addProject()
      this.queryProjectList()
    },
    changeStep (step) {
      if (step === 'step1') {
        this.step1 = true
      } else if (step === 'step2') {
        this.step1 = false
        this.step2 = true
        this.step3 = false
      } else if (step === 'step3') {
        this.step1 = false
        this.step2 = false
        this.step3 = true
      }
    },
    nextStep () {
      this.$refs.addProject.nextStep()
    },
    previousStep () {
      this.$refs.addProject.previousStep()
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
    }
  }
}
</script>
<style lang="scss" scoped>
.project-list {
  font-size: 16px;
  background-color: #f9f9f9;
  .pl-content {
    width: 100%;
    margin: 0 auto;
    .ctc-table {
      margin-top: 20px;
    }
    .search-bar {
      > div {
        width: 50%;
        .el-input {
          width: 220px;
        }
        > div {
          display: inline-block;
        }
      }
    }
    .projectList_content {
      width: 100%;
    }
  }
  .projectList_content {
    width: 100%;
    margin-bottom: 10px;
    .plc-list {
      width: 100%;
      background-color: #fff;
      margin-bottom: 10px;
      .list-bar {
        display: flex;
        width: 100%;
        justify-content: start;
        line-height: 20px;
        height: 40px;
        padding: 10px;
        border-bottom: 1px solid #ebebeb;
        h3 {
          line-height: 20px;
          position: relative;
          width: 202px;
          padding-left: 10px;
          color: #333;
          font-weight: 700;
          font-size: 16px;
          border-right: 1px solid #ebebeb;
        }
        h3::before {
          content: " ";
          position: absolute;
          width: 4px;
          height: 16px;
          background: #3575f6;
          margin-top: 3px;
          border-radius: 2px;
          left: 0px;
        }
        .pList::-webkit-scrollbar {
          /*滚动条整体样式*/
          // width: 100%; /*高宽分别对应横竖滚动条的尺寸*/
          height: 6px;
        }
        .pList::-webkit-scrollbar-thumb {
          /*滚动条里面小方块*/
          border-radius: 10px;
          box-shadow: inset 0 0 5px rgba(97, 184, 179, 0.1);
          background: #c0c0c0;
        }
        .pList::-webkit-scrollbar-track {
          /*滚动条里面轨道*/
          box-shadow: inset 0 0 5px rgba(87, 175, 187, 0.1);
          border-radius: 10px;
          background: #f1f1f1;
        }
        .pList {
          overflow-x: auto;
          display: flex;
          width: calc(100% - 202px);
          height: 30px;
          line-height: 22rpx;
          // border-right: 1px solid #ebebeb;
          // border-left: 1px solid #ebebeb;
          p {
            line-height: 16px;
            padding: 2px 22px;
            display: flex;
            span {
              display: inline-block;
              font-size: 14px;
              color: #666;
              font-weight: 500;
              margin-right: 44px;
              white-space: nowrap;
            }
            span:last-child {
              margin-right: 0;
            }
          }
          // .p2:last-child {
          //   border-right: 1px solid #ebebeb;
          // }
        }
      }
      .listContent {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        width: 100%;
        padding: 10px;
      }
      .list-item {
        position: relative;
        width: 11.3%;
        min-width: 180px;
        // height: 358px;
        padding-bottom: 15px;
        margin: 0.6%;
        box-shadow: 0 0 0 1px #e5e5e5;
        .projectInfo {
          width: 100%;
          display: block;
          color: #252626;
          font-size: 16px;
          line-height: 16px;
          padding: 14px 15px 0;
          margin-bottom: 22px;
        }
        .project-name-bg {
          width: 100%;
          height: 34px;
          position: absolute;
          background: -webkit-linear-gradient(
            rgba(51, 51, 51, 0.8),
            rgba(255, 255, 255, 0)
          ); /* Safari 5.1 - 6.0 */
          background: -o-linear-gradient(
            rgba(51, 51, 51, 0.8),
            rgba(255, 255, 255, 0)
          ); /* Opera 11.1 - 12.0 */
          background: -moz-linear-gradient(
            rgba(51, 51, 51, 0.8),
            rgba(255, 255, 255, 0)
          ); /* Firefox 3.6 - 15 */
          background: linear-gradient(
            rgba(51, 51, 51, 0.8),
            rgba(255, 255, 255, 0)
          ); /* 标准的语法（必须放在最后） */
        }
        .DISABLE {
          background: none;
        }
        .project-name {
          position: absolute;
          width: 100%;
          color: #fff;
          padding: 6px;
        }
        .project-state {
          width: 100%;
          height: 248px;
          line-height: 248px;
          position: absolute;
          color: #fff;
          text-align: center;
          background: rgba(0, 0, 0, 0.6);
          .project-name {
            top: 0;
            text-align: left;
          }
        }
        img {
          display: block;
          width: 100%;
          cursor: pointer;
          height: 180px;
        }
        .pjOperation {
          display: flex;
          justify-content: space-between;
          padding: 0 14px;
          > span {
            display: block;
            height: 12px;
            line-height: 16px;
            text-align: center;
            font-size: 14px;
            background-color: #fff;
            color: #3575f6;
            cursor: pointer;
            display: flex;
            justify-content: center;
            > i {
              display: block;
              line-height: 16px;
              margin-right: 6px;
              margin-top: -2px;
            }
            > span {
              display: block;
              line-height: 16px;
              margin-top: -2px;
            }
            &:hover {
              > span {
                text-decoration: underline;
              }
            }
            &:nth-child(2) {
              border-right: 1px solid #777777;
            }
          }
          > span:first-child {
            // border-right: 1px solid #777777;
            // padding-right: 14px;
          }
          .build-icon {
            background: url(../../../assets/bianji-hover.png) no-repeat;
            background-size: contain;
            margin-right: 6px;
          }
          .adminUnit-icon {
            background: url(../../../assets/bianji-hover.png) no-repeat;
            background-size: contain;
            margin-right: 6px;
          }
        }
      }
      .list-item:hover {
        box-shadow: 0px 0px 12px 2px rgba(0, 61, 183, 0.15);
      }
    }
  }
  .addProjectdialog .el-dialog {
    width: 1000px;
    margin-top: 5vh !important;
  }
}
</style>
<style lang="scss">
.project-list {
  .el-dialog {
    // background-color: #F7F7F7;
  }
  .el-dialog__header {
    margin: 0 20px !important;
    padding: 20px 0 10px 0 !important;
    border-bottom: none;
  }
  .el-dialog__body {
    margin: 0 !important;
    background-color: #f7f7f7;
    border: none;
  }
  .el-input__inner {
    height: 32px;
  }
  .el-input__icon {
    line-height: 32px;
  }
  .close-button {
    margin-left: 0 !important;
    background-color: #fff !important;
    border: none;
    &:hover {
      background-color: #fff !important;
      color: #3575f6 !important;
    }
  }
  .defaultbtn {
    width: 90px !important;
    margin-left: 0 !important;
  }
  .el-dialog__title {
    font-size: 16px;
    font-weight: bold;
  }
  .checkList_box {
    display: flex;
    width: 100%;
    justify-content: space-between;
    .el-checkbox-group:first-child {
      flex: 1;
      margin-right: 50px;
      .el-checkbox {
        margin-bottom: 10px;
      }
    }
    .el-checkbox-group:last-child {
      width: 250px;
    }
  }
}
</style>
