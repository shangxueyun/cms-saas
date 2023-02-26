<template>
  <div class="tenant-details groupDetails">
    <div class="tenant-details details-content"
         slot="drawer">
      <div class="main-content"
           id="mainContent"
           style="border:none">
        <el-form :model="detailData"
                 ref="detailData"
                 :rules="addDataRules">
          <div class="basInfo">
            <p class="title"><span class="vertical"></span>基本信息</p>
            <div class="content">
              <div class="form">
                <el-form-item>
                  <span>项目简称<i class="required">*</i></span>
                  <p class="readOnlyTxt">{{detailData.projectManagementName}}</p>
                </el-form-item>
                <el-form-item prop="name">
                  <span>群组名称<i class="required">*</i></span>
                  <p class="readOnlyTxt"
                     v-if="readOnly">{{detailData.name}}</p>
                  <el-input v-model="detailData.name"
                            v-else
                            maxlength="50"
                            style="width:260px"></el-input>
                </el-form-item>
                <el-form-item prop="remark" style="width: 100%">
                  <span>群组说明</span>
                  <p class="readOnlyTxt"
                     v-if="readOnly">{{detailData.remark}}</p>
                  <el-input v-model="detailData.remark"
                            type="textarea"
                            maxlength="50"
                            placeholder="您可输入此群组包含的回路数量，具体位置等信息(50字内）"
                            v-else></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="basInfo other-infor">
            <p class="title"><span class="vertical"></span>其他信息</p>
            <div class="content">
              <div class="plan-selection">
                <div>
                  <p>计划选择</p>
                  <p v-if="readOnly">{{detailData.lightingPlan && detailData.lightingPlan.name}}</p>
                  <el-select placeholder="选择计划"
                             v-else
                             v-model="detailData.lightingPlan.id"
                             style="width:200px;margin-right:10px">
                    <el-option v-for="(item,index) in lightingPlanList"
                               @click.native="planSelect(index)"
                               :key="index"
                               :label="item.name"
                               :value="item.id"></el-option>
                  </el-select>
                </div>
                <div>
                  <p>计划说明</p>
                  <div v-if="readOnly && detailData.lightingPlan" style="width: 100%; font-size: 12px">
                    <p v-for="item in detailData.lightingPlan.dates">
                      <span>{{item.startDate}}~{{item.endDate}}</span>
                      <span style="width: 100%;">
                        <span v-for="item2 in item.times" style="margin-right: 10px">{{item2.startTime}} 至 {{item2.endTime}}</span>
                      </span>
                    </p>
                  </div>
                  <div v-else style="width: 100%; font-size: 12px">
                    <p v-for="item in lightingPlanListDates">
                      <span>{{item.startDate}}~{{item.endDate}}</span>
                      <span style="width: 100%;">
                        <span v-for="item2 in item.times" style="margin-right: 10px">{{item2.startTime}} 至 {{item2.endTime}}</span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="ct-header">
                <p style="color: #4677EE">已添加{{detailData.lightingLoops.length}}条回路</p>
              </div>
              <div class="ct-table" v-if="readOnly">
                <div class="ct-tableheader">
                  <span>回路名称</span>
                  <span>网关</span>
                  <span>TagID</span>
                </div>
                <div class="ct-tablebody">
                  <div class="ct-item"
                       v-for="(item, index) in detailData.lightingLoops">
                    <span class="el-input"
                          style="width: 340px">{{item.name}}</span>
                    <span class="el-input">{{item.lightingGatewayName}}</span>
                    <span class="el-select">{{item.interfaces}}</span>
                  </div>
                </div>
              </div>
              <div class="ct-table edit-table" v-else>
                <el-table :data="loopList"
                          ref="multipleTable"
                          @selection-change="handleSelectionChange"
                          style="width: 100%">
                  <el-table-column type="selection"
                                    width="55">
                  </el-table-column>
                  <el-table-column prop="name"
                                    label="回路名称"
                                    align="center"></el-table-column>
                  <el-table-column prop="lightingGatewayName"
                                    label="网关"
                                    align="center"></el-table-column>
                  <el-table-column prop="interfaces"
                                    label="TagID"
                                    align="center"></el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </el-form>
      </div>
      <div slot="footer"
           style="text-align: right;padding: 10px 20px 20px;position:relative"
           class="dialog-footer"
           v-if="!readOnly">
        <el-button @click="cancelEl"
                   class="close-button">取消</el-button>
        <el-button type="primary"
                   class="defaultbtn dialog-confirmBtn"
                   @click="addRepairSave('detailData')">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import context from '@/service'
export default {
  props: {
    detailData: {
      type: Object,
      default: {}
    }
  },
  watch: {
    detailData: {
      handler (newValue, oldValue) {
        if (newValue) {
          if (!newValue.lightingPlan) {
            newValue.lightingPlan = {id: ''}
          }
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      drawertitle: '',
      projectManagementId: '',
      addDataRules: {
        projectManagementId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入群组名称', trigger: 'blur' }
        ],
        remark: [
          { required: false, message: '请输入群组说明', trigger: 'blur' }
        ]
      },
      readOnly: true,
      controllerType: [
        { name: '4', value: 'FOUR' },
        { name: '6', value: 'SIX' },
        { name: '8', value: 'EIGHT' },
        { name: '12', value: 'TWELVE' }
      ],
      planIndex: 0,
      lightingPlanList: [],
      lightingPlanListDates: [],
      loopList: []
    }
  },
  created () {
  },
  mounted () {
    this.drawertitle = this.drawerTitle
    let clientHeight = document.body.clientHeight
    let mainContent = document.getElementById('mainContent')
    mainContent.style.height = clientHeight - 65 + 'px'
  },
  computed: {

  },
  methods: {
    edit () {
      this.readOnly = false
      this.getLightingPlanList()
      this.getLoopList()
    },
    close () {
      this.readOnly = true
      this.$refs['detailData'].resetFields()
    },
    planSelect (index) {
      this.planIndex = index
      this.lightingPlanListDates = this.lightingPlanList[index].dates
    },
    addRepairSave (formName, state) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          context.http.put('/rms/api/lightingGroup', _this.detailData).then(res => {
            if (res) {
              _this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.readOnly = true
              this.$emit('query')
              this.$emit('setreadOnly')
              this.$emit('handleEdit', 0, this.detailData)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancelEl () {
      this.readOnly = true
      this.$refs['detailData'].resetFields()
      this.$emit('setreadOnly')
      this.$emit('handleEdit', 0, this.detailData)
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    addController () {
      this.detailData.lightingControllerDTOList.push({ 'identifier': '', 'controllerType': '' })
    },
    delControl (item, index) {
      this.detailData.lightingControllerDTOList.splice(index, 1)
    },
    controllerTypeFormat (value) {
      let val = ''
      switch (value) {
        case 'FOUR':
          val = 4
          break
        case 'SIX':
          val = 6
          break
        case 'EIGHT':
          val = 8
          break
        case 'TWELVE':
          val = 12
          break
        default:
          break
      }
      return val
    },
    async getLightingPlanList (index, row) {
      context.http.get(`/rms/api/lightingPlan/all`, { projectManagementId: this.detailData.projectManagementId }).then(res => {
        if (res.status === 200) {
          this.lightingPlanList = res.data
          let index = 0
          if (res.data.length > 0 && this.detailData.lightingPlan.id) {
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].id === this.detailData.lightingPlan.id) {
                index = i
                break
              }
            }
            this.planSelect(index)
          }
        }
      })
    },
    async getLoopList () {
      context.http.get(`/rms/api/lightingLoop/all`, { groupFlg: true, projectManagementId: this.detailData.projectManagementId, sort: 'createdDate,desc' }).then(res => {
        this.loopList = res.data
        this.loopList = [...this.loopList, ...this.detailData.lightingLoops]
        const lightingLoops = this.detailData.lightingLoops
        this.$nextTick(() => {
          if (lightingLoops) {
            lightingLoops.forEach(row => {
              this.$refs.multipleTable.toggleRowSelection(row)
            })
          } else {
            this.$refs.multipleTable.clearSelection()
          }
        })
      })
    },
    handleSelectionChange (val) {
      this.detailData.lightingLoops = val
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/mixins.scss";
.groupDetails {
  .drawer-head {
    margin: 20px 20px 0 20px;
  }
  .details-content {
    padding: 0;
  }
  .tenant-details {
    background-color: #f7f7f7;
    // padding-bottom: 50px;
    .title {
      padding-left: 20px;
    }
    .vertical {
      display: inline-block;
      width: 4px;
      height: 16px;
      background-color: #3575f6;
      border-radius: 2px;
      vertical-align: middle;
      margin-right: 5px;
    }
  }
  .main-content {
    background-color: #f7f7f7;
    margin: 0;
    overflow-y: scroll;
    overflow-x: hidden;
    @include scrollBarStyle;
    .mainInfo {
      height: 60px;
      border: 1px solid #dadada;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      justify-content: space-between;
      font-size: 14px;
    }
    .basInfo {
      border: 1px solid #dadada;
      padding: 1px 0;
      // min-height: 500px;
      /* width: 900px; */
      margin-bottom: 15px;
      margin-top: 15px;
      &:last-child {
        margin-bottom: 70px;
      }
    }
    .content {
      padding: 15px 0;
      .form {
        display: flex;
        flex-wrap: wrap;
        .el-form-item {
          width: 45%;
          margin-left: 20px;
          .el-form-item__content {
            > span {
              margin-bottom: 5px;
              display: inline-block;
            }
            > .readOnlyTxt {
              min-height: 40px;
              line-height: 40px;
              font-size: 14px;
              color: #8e8e8e;
            }
            .seachDeviceIcon {
              display: inline-block;
              width: 20px;
              height: 20px;
              /* background: url(../../../../assets/seachDeviceIcon.png) no-repeat; */
              position: absolute;
              right: 16px;
              top: 35px;
              cursor: pointer;
            }
            .el-textarea__inner {
              resize: none !important;
            }
          }
        }
      }
    }
  }
  .dialog-footer {
    background-color: #fff;
    width: 100%;
    padding: 10px;
    margin-right: 0px;
    height: 50px;
    margin-top: -50px;
  }
  .close-button {
    color: #666 !important;
    background-color: #fff !important;
    border: none !important;
    &:hover {
      color: #3575f6 !important;
    }
  }
  .defaultbtn {
    width: 90px !important;
    margin-left: 0;
  }
  .content {
    font-size: 14px;
    margin: 0 20px 0 20px;
    .ct-header {
      display: flex;
      justify-content: space-between;
      margin: 20px 0 10px 0;
      span {
        &:first-child {
          color: #4677ee;
        }
        color: #44af69;
        cursor: pointer;
        &:last-child {
          border-bottom: 1px solid #fff;
          &:hover {
            border-bottom: 1px solid #44af69;
          }
        }
      }
    }
    .edit-table{
      height: 340px;
      overflow-y: scroll;
      @include scrollBarStyle;
    }
    .ct-table {
      .ct-tableheader {
        background-color: #f7f8fa;
        color: #777777;
        display: flex;
        span {
          text-align: center;
          height: 40px;
          line-height: 40px;
          &:nth-child(1) {
            width: 50%;
          }
          &:nth-child(2) {
            width: 25%;
          }
          &:nth-child(3) {
            width: 25%;
          }
        }
      }
      .ct-tablebody {
        max-height: 360px;
        overflow-y: scroll;
        @include scrollBarStyle;
        .ct-item {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #EEEEEE;
          .el-input {
            width: 160px;
            margin: 10px 20px 20px 40px;
          }
          .el-select {
            width: 160px;
            margin: 10px 20px 20px 20px;
          }
          span {
            margin: 10px 0 20px 56px;
            cursor: pointer;
            text-align: center;
            font-size: 12px;
          }
          .delspan {
            color: #bf2f2d;
          }
        }
      }
    }
  }
  .other-infor {
    .plan-selection {
      display: flex;
      justify-content: space-between;
      div {
        width: 50%;
      }
      p {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
<style lang="scss">
.groupDetails {
  .drawer-head {
    margin: 20px 20px 0 20px;
  }
  .el-drawer__body {
    margin: 0;
  }
}
</style>
