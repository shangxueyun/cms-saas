<template>
  <div class="approvalProcess">
    <el-form :model="addData" :rules="rules" ref="ruleForm">
      <el-form-item prop="projectManagementId">
        <div class="item-name">选择项目<i class="required">*</i></div>
        <el-select v-model="addData.projectManagementId"
                   placeholder="请选择"
                   >
          <el-option v-for="item in projectManagementList"
                     :key="item.id"
                     :label="item.referred"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="type">
        <div class="item-name">审批类型<i class="required">*</i></div>
        <el-select v-model="addData.type"
                   placeholder="请选择">
          <el-option v-for="item in approvalTypeList"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="name">
        <div class="item-name">审批名称<i class="required">*</i></div>
        <el-input v-model="addData.name"
                  maxlength="20"
                  placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div style="margin: 10px 0;font-size: 14px">审批流程</div>
    <div class="process-content">
      <div class="process-list"
           v-for="(item, index) in processList"
           :key="index">
        <div class="process-item">
          {{item.label}}
          <span class="delete"
                @click="delProcess(index, item)"
                v-if="index === processList.length - 1 && !readOnly">
            <!-- <span class="iconfont icon-cha"></span> -->
          </span>
        </div>
        <div class="arrow">>></div>
      </div>
      <div class="add"
           @click.stop="organizationShow = !organizationShow"
           v-if="!readOnly">
        <div class="organization"
             v-if="organizationShow"
             @click.stop="prevent">
             <el-tree
              :data="orgListCopy"
              show-checkbox
              node-key="userPostId"
              :check-strictly="true"
              :default-checked-keys="checkedKeys"
              @check-change="handleCheckChange"
              :props="defaultProps">
            </el-tree>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import context from '@/service'
export default {
  name: 'approvalProcess',
  data () {
    return {
      rules: {
        projectManagementId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择审批类型', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入审批名称', trigger: 'blur' }
        ]
      },
      readOnly: false,
      addData: {},
      options: {},
      post: '',
      processList: [],
      checkedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      organizationShow: false,
      processDetails: false,
      projectManagementList: [],
      approvalTypeList: [],
      orgList: [],
      orgListCopy: [],
      stateOptions: [{
        value: 'DISABLE',
        label: '已停用'
      }, {
        value: 'USING',
        label: '使用中'
      }]
    }
  },
  created () {

  },
  mounted () {
    this.queryProjectManagement()
    this.queryApprovalTypeList()
    this.queryOrganizeList()
  },
  methods: {
    handleCheckChange (data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
      if (!checked) {
        // var index = this.processList.indexOf(data)
        // if (index > -1) {
        //   this.processList.splice(index, 1)
        // }
        this.processList.forEach((ele, index) => {
          if (ele.userPostId === data.userPostId) {
            this.processList.splice(index, 1)
          }
        })
      } else {
        this.processList.push(data)
      }
    },
    edit () {
      this.readOnly = false
      this.$forceUpdate()
      console.log(this.readOnly)
    },
    listShow (item) {
      item.expanded = !item.expanded
    },
    delProcess (index, item) {
      console.log(item)
      this.processList.splice(index, 1)
      this.orgList.forEach((ele, index) => {
        ele.children.forEach(ele2 => {
          if (ele2.name === item.name) {
            this.orgListCopy[index].children.push(item)
          }
        })
      })
    },
    select (item, index, child) {
      child.splice(index, 1)
      this.processList.push(item)
      this.organizationShow = false
    },
    prevent () {
      console.log('prevent')
    },
    async queryProjectManagement () {
      context.http.get('/cms/api/project-managements', { useStatus: 'USING' }).then(res => {
        this.projectManagementList = res.data
      })
    },
    async queryApprovalTypeList () {
      context.http.get('/cms/api/process-defines/processType').then(res => {
        this.approvalTypeList = Object.keys(res.data).map(item => {
          return { value: item, label: res.data[item] }
        })
      })
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
      })
    },
    parseOrganize (organizeTree) {
      if (organizeTree.leaf) {
        return { userPostId: organizeTree.data.userPostId,
          userPostName: organizeTree.data.userPostName,
          // label: organizeTree.data.userPostName,
          label: organizeTree.data.name + '(' + (organizeTree.data.userPostName === null ? '' : organizeTree.data.userPostName) + ' ' + (organizeTree.data.userName === null ? '' : organizeTree.data.userName) + ')',
          disabled: organizeTree.data.userPostId === null
        }
      } else {
        return {
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
    approvalProcess () {
      this.$refs['ruleForm'].validate((valid) => {
        if (this.processList.length === 0) {
          return
        }
        if (valid) {
          this.processList.forEach(ele => {
            delete ele.label
          })
          this.addData.processDetailList = this.processList
          let _this = this
          context.http.post('/cms/api/process-define', this.addData).then(res => {
            _this.$emit('dialogClose')
            _this.$emit('query')
            _this.addData = {}
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
.approvalProcess {
  margin-top: 20px;
  .el-form-item {
    display: inline-block;
    width: 30%;
    margin-right: 42px;
    &:last-child {
      margin-right: 0;
    }
  }
  .item-name {
    margin-bottom: 10px;
  }
  .process-content {
    display: flex;
    flex-wrap: wrap;
    width: 930px;
    height: 259px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(231, 231, 231, 1);
    margin-bottom: 20px;
    padding: 20px 0 0 20px;
    .arrow {
      position: relative;
      top: 2px;
      padding: 0 10px;
      display: inline-block;
    }
    .add {
      width: 24px;
      height: 24px;
      border: 1px solid rgba(49, 117, 210, 1);
      border-radius: 50%;
      cursor: pointer;
      position: relative;
      top: 4px;
      background: url(../../../../assets/plus.png) no-repeat 4px 4px;
      background-size: 60%;
      .organization {
        position: absolute;
        top: 36px;
        left: -45px;
        min-width: 300px;
        height: 260px;
        z-index: 99;
        // overflow-y: scroll;
        border-radius: 4px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 10px 0px rgba(188, 200, 209, 0.3);
        .search {
          .el-input {
            width: 90%;
            margin: 10px 14px 0;
            input {
              height: 30px;
              line-height: 30px;
              background: rgba(250, 250, 250, 1);
            }
            .el-input__icon {
              line-height: 30px;
            }
          }
        }
        .organization-list {
          overflow-y: scroll;
          margin-top: 10px;
          > div {
            background: rgba(250, 250, 250, 1);
            color: #666;
            div {
              background-color: #fff;
            }
          }
          span {
            display: inline-block;
            height: 30px;
            line-height: 30px;
            padding-left: 20px;
            width: 95%;
          }
          .childList {
            .frame {
              width: 13px;
              height: 13px;
              line-height: 13px;
              border: 1px solid rgba(121, 124, 138, 1);
              border-radius: 2px;
              padding-left: 0;
              float: right;
              position: relative;
              top: 8px;
              right: 14px;
            }
          }
          .iconfont {
            font-size: 12px;
            float: right;
          }
        }
        /*滚动条样式*/
        .organization-list::-webkit-scrollbar {
          /*滚动条整体样式*/
          width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
          height: 4px;
        }
        .organization-list::-webkit-scrollbar-thumb {
          /*滚动条里面小方块*/
          border-radius: 5px;
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          background: rgba(0, 0, 0, 0.2);
        }
        .organization-list::-webkit-scrollbar-track {
          /*滚动条里面轨道*/
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          border-radius: 0;
          background: rgba(0, 0, 0, 0.1);
        }
      }
    }
    .process-list {
      display: flex;
      width: 176px;
      height: 50px;
      .process-item {
        width: 120px;
        height: 30px;
        line-height: 30px;
        border-radius: 2px;
        border: 1px solid rgba(231, 231, 231, 1);
        text-align: center;
        font-size: 14px;
        overflow: hidden;
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
  }
}
</style>

