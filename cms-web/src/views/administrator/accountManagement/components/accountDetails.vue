<template>
  <div class="tenant_details">
    <drawer :show="editdialogVisible"
            class="new_vue_drawer"
            :title="drawerTitle"
            :wrapperClosable="false"
            :showEditBtn = 'readOnly'
            @on-edit="onEdit"
            @on-hide="onClose">
      <div class="details-content drawer-body" slot="drawer" id='accountUnit'>
        <div class="adminUnit_top">
          <div class="basicInfo">
            <p class="title"><i></i>员工信息</p>
            <div class="content">
              <el-form :model="detailsData">
                <el-form-item prop="organizeId">
                  <div class="cttitle">组织</div>
                  <!-- <span class="txt" v-if='detailsData.userPostManagements[0] && detailsData.userPostManagements[0].organize && detailsData.userPostManagements[0].organize.parent'>{{detailsData.userPostManagements[0].organize.parent.name}}/{{ detailsData.userPostManagements[0].organize.name}}</span> -->
                  <span class="txt" v-if='detailsData.userPostManagements[0] && detailsData.userPostManagements[0].organize'>{{ detailsData.userPostManagements[0].organize.name}}</span>
                </el-form-item>
                <el-form-item prop="id">
                  <div class="cttitle">岗位</div>
                  <span class="txt">{{userPostManagements}}</span>
                </el-form-item>
                <el-form-item prop="">
                  <div class="cttitle">员工</div>
                  <span class="txt">{{detailsData.name}}</span>
                </el-form-item>
                <el-form-item prop="">
                  <div class="cttitle">手机号</div>
                  <span class="txt">{{detailsData.telephone}}</span>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <div class="adminUnit_top">
          <div class="basicInfo">
            <p class="title"><i></i>账号信息</p>
            <div class="content">
              <el-form :model="detailsData">
                <el-form-item prop="">
                  <div class="cttitle">账号</div>
                  <span class="txt">{{detailsData.account}}</span>
                </el-form-item>
                <el-form-item prop="roleSelected">
                  <div class="cttitle">角色<i class="required">*</i></div>
                  <span v-if="readOnly">
                    <span v-for="(item, index) in detailsData.roleDTOS"
                          :key="index">
                      {{item.roleName}}
                    </span>
                  </span>
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
                </el-form-item>
                <el-form-item prop="">
                  <div class="cttitle">集团人事权限</div>
                  <span v-if="readOnly" class="txt">{{formatUseonGP(detailsData.onGroupPersonnel)}}</span>
                  <el-select v-model="detailsData.onGroupPersonnel"
                            placeholder="请选择"
                            v-else>
                    <el-option v-for="item in psjdOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="">
                  <div class="cttitle">状态</div>
                  <span v-if="readOnly" class="txt">{{formatUseStatus(detailsData.useStatus)}}</span>
                  <el-select v-model="detailsData.useStatus"
                            placeholder="请选择"
                            v-else>
                    <el-option v-for="item in stateOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <div class="adminUnit_top">
          <div class="basicInfo">
            <p class="title"><i></i>数据权限</p>
            <div class="content">
              <el-form :model="detailsData">
                <el-form-item prop="organizeId">
                  <!-- <div class="cttitle">{{projectManagementsArr}}<i class="required">*</i></div> -->
                  <el-tree :data="dataAuthorityOptions"
                            show-checkbox
                            node-key="id"
                            :default-checked-keys='projectManagementsArr'
                            :default-expanded-keys='defaultExpandIds'
                            @check="handleCheckChange"
                            :props="treeProps">
                          </el-tree>
                            <!-- v-model="detailsData.dataAuthoritySelected" -->
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <!-- <div slot="footer"
           v-if="!readOnly"
           class="dialog-footer">
        <el-button @click="onHide"
                   class="close-button">取消</el-button>
        <el-button type="primary"
                   style="margin-left: 0"
                   @click="editAccountSave"
                   class="defaultbtn dialog-confirmBtn">确定</el-button>
      </div> -->
      <div slot="footer" v-if="!readOnly" class="dialog-footer">
        <span @click="onHide" class="details_cannelBtn" style="background: none"
          >取消</span
        >
        <span class="saveSubmit" @click="editAccountSave">保存</span>
      </div>
    </drawer>
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import Drawer from '@/components/drawer.vue'
import moment from 'moment'
export default {
  components: {
    Drawer
  },
  props: {
    editdialogVisible: {
      type: Boolean,
      default: false
    },
    userPostManagements: {
      type: String,
      default: ''
    },
    detailsData: {
      type: Object,
      default: { }
    },
    roleOptions: {
      type: Array,
      default: []
    }
  },
  watch: {
  },
  data () {
    return {
      drawerTitle: '账号详情',
      projectManagementsArr: [],
      showEditBtn: true,
      readOnly: true,
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
      defaultExpandIds: [],
      dataAuthorityOptions: [ {child: []} ],
      roleHasSelected: [],
      roleSelected: [],
      treeProps: { label: 'name', children: 'child' },
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted () {
  },
  methods: {
    onClose () {
      this.$emit('drawerClose')
      this.readOnly = true
    },
    onHide () {
      this.$emit('handleEdit', this.detailsData.id)
      this.readOnly = true
    },
    onEdit () {
      this.readOnly = !this.readOnly
      if (!this.readOnly) {
        this.detailsData.roleSelected = []
        this.detailsData.roleDTOS.map(item => {
          this.detailsData.roleSelected.push(item.id)
        })
        this.dataAuthorityOptions[0].disabled = false
        this.dataAuthorityOptions[0].child.forEach(item => {
          if (item.child.length !== 0) {
            item.disabled = false
            item.child.forEach(ite => {
              ite.disabled = false
            })
          }
        })
        let roleSelected = []
        this.detailsData.roleDTOS.map(item => {
          roleSelected.push(item.id)
        })
        this.roleHasSelected = roleSelected
      }
    },
    disabledTreeFn () {
      if (this.readOnly) {
        return true
      } else {
        return false
      }
    },
    handleCheckChange (data, nodeData) {
      let selectedId = []
      nodeData.checkedKeys.forEach(item => {
        let temp = typeof item === 'number' && !isNaN(item)
        if (temp) {
          selectedId.push(item)
        }
      })
      // nodeData.forEach(item => {
      //   if ()
      // })
      // let projectManagementsArr = [...new Set(this.projectManagementsArr)]
      selectedId = [...new Set(selectedId)]
      // if (!checked) {
      //   selectedId.forEach((item, index) => {
      //     projectManagementsArr.forEach((ite, inde) => {
      //       if (item === ite) {
      //         projectManagementsArr.splice(inde, 1)
      //       }
      //     })
      //   })
      // } else {
      //   selectedId.forEach((item) => {
      //     projectManagementsArr.push(item)
      //   })
      // }
      // projectManagementsArr = [...new Set(projectManagementsArr)]
      this.projectManagementsArr = JSON.parse(JSON.stringify(selectedId))
    },
    // handleCheckChange (data, checked, indeterminate) {
    //   console.log(data, checked)
    //   let selectedId = []
    //   if (data.child && data.child.length !== 0) {
    //     data.child.forEach((item) => {
    //       if (item.child && item.child.length !== 0) {

    //       }
    //     })
    //   } else if (!data.child) {
    //     selectedId.push(data.id)
    //   }
    //   let projectManagementsArr = [...new Set(this.projectManagementsArr)]
    //   if (!checked) {
    //     if (data.child) {
    //       if (data.child.child) {
    //         data.child.child.forEach(item => {
    //           projectManagementsArr.forEach((ite, index) => {
    //             if (ite === item.id) {
    //               // let temp = this.projectManagementsArr.slice(index, index + 1)
    //               // projectArr.push(this.projectManagementsArr.splice(index, index + 1))
    //               // console.log(temp)
    //               projectManagementsArr.splice(index, 1)
    //             }
    //           })
    //         })
    //       } else {
    //         data.child.forEach(item => {
    //           projectManagementsArr.forEach((ite, index) => {
    //             if (ite === item.id) {
    //               // let temp = this.projectManagementsArr.slice(index, index + 1)
    //               // projectArr.push(this.projectManagementsArr.splice(index, index + 1))
    //               // console.log(temp)
    //               projectManagementsArr.splice(index, 1)
    //             }
    //           })
    //         })
    //       }
    //     } else {
    //       projectManagementsArr.forEach((ite, index) => {
    //         if (ite === data.id) {
    //           // projectArr.push(this.projectManagementsArr.splice(index, index + 1))
    //           projectManagementsArr.splice(index, 1)
    //         }
    //       })
    //     }
    //     // projectArr = [...new Set(projectArr)]
    //     // console.log(projectArr)
    //     // this.projectManagementsArr = JSON.parse(JSON.stringify(projectArr))
    //   } else {
    //     if (data.child) {
    //       data.child.forEach(item => {
    //         let temp = projectManagementsArr.some(ite => {
    //           return ite === item.id
    //         })
    //         if (!temp) {
    //           projectManagementsArr.push(item.id)
    //         }
    //       })
    //     } else {
    //       let temp = projectManagementsArr.some(ite => {
    //         return ite === data.id
    //       })
    //       if (!temp) {
    //         projectManagementsArr.push(data.id)
    //       }
    //     }
    //   }
    //   this.projectManagementsArr = JSON.parse(JSON.stringify(projectManagementsArr))
    // },
    async editAccountSave () {
      if (this.roleHasSelected.length === 0) {
        this.$message({
          message: '请选择角色',
          type: 'warning'
        })
        return
      }
      let projectManagementsArrData = this.projectManagementsArr.map(item => {
        return { id: item }
      })
      let putData = {
        id: this.detailsData.id,
        roleId: this.roleHasSelected,
        useStatus: this.detailsData.useStatus,
        projectManagementDTOS: projectManagementsArrData,
        onGroupPersonnel: this.detailsData.onGroupPersonnel
      }
      context.http.put('uaa/api/account', putData).then(res => {
        if (res.data) {
          this.onClose()
        }
      })
    },
    async getProjectOpitons () {
      let result = await context.http.get('cms/api/project-managements/organize/tree')
      // 默认展开id
      this.defaultExpandIds = []
      this.defaultExpandIds.push(result.data.id)
      result.data.disabled = true
      result.data.child.forEach(item => {
        item.disabled = true
        item.id = 'a' + '' + item.id
        item.child.forEach(ite => {
          ite.disabled = true
          if (ite.child.length === 0) {
            delete ite.child
          }
        })
      })
      this.dataAuthorityOptions = [result.data]
      // 默认选中id
      this.projectManagementsArr = []
      if (this.detailsData.projectManagements) {
        this.detailsData.projectManagements.forEach(item => {
          // this.projectManagements += item.projectName + '，'
          this.projectManagementsArr.push(item.id)
        })
      }
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
    }
  }
}
</script>
<style lang="scss" scoped>
.tenant_details {
  .details-content{
    display: flex;
    flex-direction: column;
    padding-bottom: 20px!important;
    height: calc(100% - 80px) !important;
    background-color: #f5f5f5;
    &#accountUnit{
      width: 640px!important;
      height: 600px;
      .adminUnit_top{
        width: 640px!important;
        margin-top: 12px!important;
      }
    }
    .title{
      font-size: 16px;
      font-weight: bolder;
      padding-left: 26px;
      height: 40px;
      line-height: 40px;
      background-color: #fff;
      border-bottom: 1px solid #F6F6F6;
      position:relative;
      color:#262626;
      i{
        display: block;
        position: absolute;
        left:15px;
        top:12px;
        width:4px;
        height:16px;
        border-radius:2px;
        background: #3575F6;
      }
    }
    .basicInfo{
      width: 640px!important;
      border-radius: 2px;
      position: relative;
      background: #fff;
      .delAction {
        color: #44AF69!important;
      }
      .content{
        height: auto!important;
        max-height: 420px;
        padding: 15px 15px 0 15px;
        overflow-y: auto;
        .otherTitle {
          margin-bottom: 20px;
          text-align: left;
          color: #262626;
          font-weight: 700;
          >div {
            display: inline-block;
            cursor: pointer;
          }
          >i {
            color: #A2A2A2;
            font-weight: normal;
            cursor: pointer;
          }
        }
        .otherShow {
          height: 120px;
        }
        .el-form{
          text-align: left;
          height: auto;
          overflow-y: auto!important;
          overflow-x: hidden;
          .el-form-item{
            width: 49%!important;
            margin-bottom: 14px;
            display: inline-block;
          }
          .el-form-item__content {
            // margin-left: 15px!important;
            .el-input {
              font-size: 12px;
              height: 32px;
              width: 100%;
            }
          }
          .el-form-item__content{
              display: flex;
              align-items: center;
              .cttitle{
                margin-bottom: 10px;
                width: 170px !important;
                margin-right: 10px;
                text-align: left;
                color:#777777;
              }
              .el-select {
                .el-input {
                  height: 32px;
                  input {
                    height: 32px;
                  }
                }
              }
              .txt{
                display: inline-block;
                width: 300px;
                text-align: left;
                color: #262626;
                font-weight: 400;
              }
              .el-form-item__error{
                width: 100%;
                text-align: center;
              }
          }
        }
        .el-form::-webkit-scrollbar {
          width: 4px!important;
          height: 4px!important;
        }
        .el-form::-webkit-scrollbar-track {
          box-shadow: inset 0 0 6px #fff;
          background-color: #fff;
        }
        .el-form::-webkit-scrollbar-thumb {
          border-radius: 10px;
          box-shadow: inset 0 0 6px #cccccc;
        }
        .head_contacts{
          width:100%;
          background: #F7F8FA;
          height:40px;
          display: flex;
          margin-bottom:5px;
          span{
            display: block;
            width:110px;
            line-height: 40px;
            margin-right:18px;
            color:#777777;
            &:last-child{
              width:148px;
            }
          }
        }
        .body_contacts{
          display: block;
          display: flex;
          border-bottom:1px solid #F6F6F6;
          .el-form-item{
            margin-bottom:5px;
            margin-top: 5px;
            width:110px;
            margin-right:18px;
            position: relative;
            .txt{
              width:110px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              text-align: center;
              height:40px;
              line-height: 40px;
            }
          }
          .el-form-item:last-child{
            width:148px;
            .txt{
              width:148px;
            }
          }
          .el-input__inner{
            padding: 8px;
          }
          .toolContent {
            position: absolute;
            right: -14px;
            top:10px;
            cursor: pointer;
            i {
              font-size: 18px;
              color: #D92E20;
            }
          }
        }
        .addItem{
          text-align: right;
          height:20px;
          display: flex;
          justify-content: flex-end;
          margin-top:5px;
          padding-right:10px;
          box-sizing: border-box;
          span{
            display: flex;
            cursor: pointer;
            span{
              color:#3575F6;
              line-height: 20px;
              font-size: 16px;
              display: block;
              height:20px;
            }
            span:last-child{
              font-size: 12px;
              margin-left:4px;
              line-height: 18px;
              text-decoration: underline;
            }
          }
        }
      }
      
    }
    .recordList{
      width: 640px!important;
      border-radius: 2px;
      margin-left: 0px!important;
      position: relative;
      .annexes{
        color:#005CB3;
        .icon-download{
          cursor: pointer;
        }
        display: flex;
        font-size: 12px;
        color: #005cb3;
        .annexName {
          margin-right: 10px;
          cursor: pointer;
        }
        > div {
          cursor: pointer;
          font-size: 14px;
        }
      }
      .addbtn{
        position: absolute;
        right: 0px;
        top: 40px;
        z-index: 2;
        height:26px;
        background: #EEF4FF;
        border:1px solid #9FBFFF;
        border-radius: 26px;
        line-height: 26px;
        font-size: 12px;
        color:#3575F6;
        padding-left:16px;
        width:82px;
        margin-top:20px;
        margin-right:20px;
        i{
          display: block;
          position: absolute;
          left:9px;
          top:0;
          font-size: 12px;
          line-height: 26px;
        }
      }
      .timelineDiv{
        display: flex;
        padding: 35px 0 20px;
        padding-left:180px;
        width: 100%;
        position: relative;
        left: 0;
        right: 0;
        height:460px!important;
        overflow-y: auto!important;
        background: #fff;
        .timeline {
          .downLoad {
            height: 26px;
            line-height: 26px;
            border: 1px solid #d3dbeb;
            border-radius: 12px;
            padding: 0px 10px;
            width: 150px;
            display: flex;
            justify-content: space-between;
            > i {
              font-size: 14px;
              font-style: normal;
              color: #005cb3;
            }
          }
          p {
            font-size: 14px;
            color:#777777;
            span{
              color: #262626;
            }
          }
          .annexes{
            p{
              color:#005CB3;
              display: flex;
              span{
                color:#005CB3;
              }
            }
          }
          .imgBox {
            width: 40px;
            height: 40px;
            position: absolute;
            left: 30px;
            top: 12px;
            > .userImg {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              cursor: pointer;
            }
            .noImg {
              width: 40px;
              height: 40px;
              line-height: 40px;
              border-radius: 50%;
              background-color: #3575f6;
              color: #ffffff;
              font-size: 12px;
              cursor: pointer;
              padding: 0 5px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              text-align: center;
            }
            .noNameNoImg {
              width: 40px;
              height: 40px;
            }
          }
          .timeLineBox {
            position: absolute;
            left: -160px;
            top: 0;
            width: 150px;
            text-align: center;
            display: flex;
            flex-direction: column;
            font-size: 12px;
            >.recodeIcon{
              background-color: #83BF68!important;
              color: #fff;
              border-radius: 4px;
              display: inline-block;
              width: 60px;
              height: 20px;
              line-height: 20px;
            }
            .timeLineTip {
              top: 30px!important;
            }
            > div {
              position: absolute;
              right: 0;
            }
            >.first {
              color: #3575f6!important;
            }
          }
          p {
            margin-bottom: 5px;
          }
        }
      }
      >.timelineDiv::-webkit-scrollbar {
        width: 4px!important;
        height: 4px!important;
      }
      >.timelineDiv::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px #fff;
        background-color: #fff;
      }
      >.timelineDiv::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 6px #cccccc;
      }
      .recordTable {
        padding: 15px 15px 0 15px!important;
        background-color: #fff;
        max-height: 370px;
      }
    }
  }
  .wrap {
    height: calc(100vh - 80px);
  }
  .dialog-footer{
    margin-top: -50px;
    > span {
      display: inline-block;
      color: #777777;
      height: 34px;
      line-height: 34px;
      text-align: center;
      padding: 0 21px;
      cursor: pointer;
      background: rgba(243, 244, 250, 1);
      border-radius: 4px;
      margin-left: 10px;
      &.closeBtn {
      }
      &.saveBtn {
        border: 1px solid rgba(53, 117, 246, 1);
        color: #3575f6;
      }
      &.saveSubmit,
      &.passBtn {
        background: rgba(53, 117, 246, 1);
        color: #fff;
      }
      &.rejectBtn {
        color: #e0434e;
        background: rgba(253, 235, 237, 1);
        border: 1px solid #c1bdbd;
      }
    }
  }
}
</style>
