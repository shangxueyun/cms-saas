<template>
  <drawer :show="approverdrawershow"
          @on-hide="onHide">
    <div class="setup-organization details-content"
         slot="drawer">
      <div style="border-bottom: 1px solid #dadada;padding-bottom: 15px;font-size: 16px;">{{drawerTitle}}</div>
      <div class="main-content">
        <div class="drawer-content">
          <el-form :model="addData"
                   ref="step1"
                   :rules="setp1Rules">
            <el-form-item prop="name">
              <el-input v-model="addData.name"
                        maxlength="30"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item prop="code"
                          style="margin-bottom: 20px;">
              <div class="cttitle">添加{{approverTitle}}<i class="required">*</i></div>
              <div class="process-content">
                <div class="process-list"
                     v-for="(item, index) in processList"
                     :key="index">
                  <div class="process-item" :title="item.label">
                    {{item.label}}
                    <span class="delete"
                          @click="delProcess(index, item)"
                          v-if="index === processList.length - 1">
                      <!-- <span class="iconfont icon-cha"></span> -->
                    </span>
                  </div>
                </div>
              </div>
            </el-form-item>
            <div class="organization">
              <el-input placeholder="请输入组织名称/员工姓名"
                        prefix-icon="el-icon-search"
                        v-model="filterText"
                        class=""></el-input>
              <el-tree :data="orgListCopy"
                       show-checkbox
                       node-key="nodeDateId"
                       :filter-node-method="filterNode"
                       :check-strictly="true"
                       :default-checked-keys="checkedKeys"
                       :default-expanded-keys="checkedKeys"
                       @check-change="handleCheckChange"
                       ref="treeForm"
                       :props="defaultProps">
              </el-tree>
            </div>
            <div class="tips"
                 v-if="noApprover">请选择{{approverTitle}}</div>
            <el-form-item prop="overtime"
                          v-if="detailData.type !== 'CC'">
              <div class="cttitle">约束时间 (小时)</div>
              <el-input v-model="addData.overtime"
                        maxlength="10"
                        type="number"
                        placeholder="请输入约束时间"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="onHide"
                 class="close-button">关 闭</el-button>
      <el-button type="primary"
                 @click="confirm()"
                 class="defaultbtn dialog-confirmBtn">保 存</el-button>
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
    approverdrawershow: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Object
    }
  },
  data () {
    return {
      filterText: '',
      drawerTitle: '审批人设置',
      approverTitle: '审批人',
      options: [],
      newlystep1: true,
      newlystep2: false,
      noApprover: false,
      setp1Rules: {
        name: [
          { required: false, message: '请输入节点名称', trigger: 'blur' }
        ],
        overtime: [
          { required: false, message: '请选择约束时间', trigger: 'blur' }
        ]
      },
      organizationName: '',
      organizationType: '',
      organizesOptions: [],
      ogleaderoptions: [],
      organizeIdList: [],
      organizeIdSelected: [],
      checkedKeys: [],
      orgListCopy: [],
      processList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      addData: {
        name: '',
        overtime: ''
      }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.treeForm.filter(val)
    },
    approverdrawershow: {
      handler: function () {
        if (this.approverdrawershow) {
          this.queryOrganizeList()
          this.processList = []
          this.checkedKeys = []
          if (this.approverdrawershow) {
            this.addData.name = this.detailData.name
            this.addData.overtime = this.detailData.overtime
          }
        }
      }
    },
    detailData: {
      handler: function () {
        if (this.detailData.type === 'APPROVAL') {
          this.drawerTitle = '审批人设置'
          this.approverTitle = '审批人'
        } else if (this.detailData.type === 'CC') {
          this.drawerTitle = '抄送人设置'
          this.approverTitle = '抄送人'
        }
      }
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    onHide () {
      this.$emit('drawerClose', false)
    },
    handleCheckChange (data, checked, indeterminate) {
      if (!checked) {
        this.processList.forEach((ele, index) => {
          if (ele.nodeDateId === data.nodeDateId) {
            this.processList.splice(index, 1)
          }
        })
      } else {
        if (this.detailData.type === 'APPROVAL') {
          this.processList = [data]
          this.$refs.treeForm.setCheckedNodes([data])
        } else {
          this.processList.push(data)
        }
      }
    },
    async queryOrganizeList () {
      this.orgList = []
      this.orgListCopy = []
      context.http.get('/uaa/api/organizes/apply').then(res => {
        this.orgList = res.data.organizeTree
        this.orgListCopy = JSON.parse(JSON.stringify(this.orgList))
        let cascaderData = []
        this.orgListCopy.forEach(item => {
          cascaderData.push(this.parseOrganize(item))
        })
        this.orgListCopy = cascaderData

        // 选择回显
        if (this.detailData.jobPositionId) {
          let checkedKeys = []
          let processList = []
          let detailData = this.detailData
          this.detailData.jobPositionId.forEach((ele, i) => {
            let nodeid = this.getNodeId(this.orgList, ele)
            checkedKeys.push(nodeid)
            processList.push({ nodeDateId: nodeid, userPostId: ele, label: detailData.jobPositionLable ? detailData.jobPositionLable[i] : detailData.jobPosition[i], userPostName: detailData.jobPosition[i] })
          })
          this.checkedKeys = checkedKeys
          this.processList = processList
        }
      })
    },
    getNodeId (treeList, userPostId) {
      for (let i = 0; i < treeList.length; i++) {
        if (treeList[i].data.userPostId && treeList[i].data.userPostId === userPostId) {
          return treeList[i].data.nodeDateId
        } else {
          let result = this.getNodeId(treeList[i].children, userPostId)
          if (result) {
            return result
          }
        }
      }
      return null
    },
    parseOrganize (organizeTree) {
      if (organizeTree.leaf) {
        return {
          nodeDate: organizeTree.data,
          nodeDateId: organizeTree.data.nodeDateId,
          userPostId: organizeTree.data.userPostId,
          userPostName: organizeTree.data.userPostName,
          // label: organizeTree.data.userPostName,
          label: organizeTree.data.name + '(' + (organizeTree.data.userPostName === null ? '' : organizeTree.data.userPostName) + ' ' + (organizeTree.data.userName === null ? '' : organizeTree.data.userName) + ')',
          disabled: organizeTree.data.userPostId === null
        }
      } else {
        return {
          nodeDate: organizeTree.data,
          nodeDateId: organizeTree.data.nodeDateId,
          userPostId: organizeTree.data.userPostId,
          label: organizeTree.data.name + '(' + (organizeTree.data.userPostName === null ? '' : organizeTree.data.userPostName) + ' ' + (organizeTree.data.userName === null ? '' : organizeTree.data.userName) + ')',
          // label: !organizeTree.data.userPostName ? organizeTree.data.name : organizeTree.data.userPostName,
          userPostName: organizeTree.data.userPostName,
          disabled: organizeTree.data.userPostId === null,
          children: organizeTree.children.map(item => {
            return this.parseOrganize(item)
          })
        }
      }
    },
    async confirm () {
      this.noApprover = false
      if (this.processList.length === 0) {
        this.noApprover = true
        return
      }
      let jobPositionArr = []
      let jobPositionIdArr = []
      let jobPositionLableArr = []
      let nodeDateIdArr = []
      if (this.processList.length > 0) {
        this.processList.forEach(ele => {
          jobPositionLableArr.push(ele.label)
          jobPositionArr.push(ele.userPostName)
          jobPositionIdArr.push(ele.userPostId)
          nodeDateIdArr.push(ele.nodeDate)
        })
        this.$set(this.detailData, 'jobPosition', jobPositionArr)
        this.$set(this.detailData, 'jobPositionId', jobPositionIdArr)
        this.$set(this.detailData, 'jobPositionLable', jobPositionLableArr)
        this.$set(this.detailData, 'nodeDateIdArr', nodeDateIdArr)
        this.detailData.name = this.addData.name
        this.detailData.overtime = this.addData.overtime
        this.onHide()
        console.log('detailData', this.detailData)
      }
    }
  }
}
</script>
<style lang="scss">
.setup-organization {
  width: 500px;
  margin: 0 30px 0;
  .main-content {
    margin: 0 auto;
  }
  .el-dialog__header,
  .el-dialog__body {
    border-bottom: none;
  }
  .drawer-content {
  }
  .el-form-item {
    margin-top: 20px;
  }
  .el-select {
    width: 100%;
  }
  .organization {
    border: 1px solid transparent;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  }
  .process-content {
    display: flex;
    flex-wrap: wrap;
  }
  .process-list {
    display: flex;
    min-width: 160px;
    padding-right: 10px;
    padding-bottom: 10px;
    .process-item {
      min-width: 140px;
      min-height: 30px;
      line-height: 30px;
      border-radius: 2px;
      // border: 1px solid rgba(231, 231, 231, 1);
      padding: 0 6px;
      font-size: 14px;
      overflow: hidden;
      background-color: #3577f6;
      border-radius: 4px;
      color: #fff;
      .delete {
        cursor: pointer;
        float: right;
        padding-right: 10px;
        span {
          font-size: 12px;
        }
        &:hover {
          color: #3577f6;
        }
      }
    }
  }
  .tips {
    color: red;
    margin-top: 10px;
  }
  .el-tree {
    overflow-x: scroll;
    min-height: 218px;
  }
  .el-tree-node > .el-tree-node__children {
    overflow: initial;
  }
}
</style>

