<template>
  <div class="tenant-details getwayDetails">
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
                    <span>网关名称<i class="required">*</i></span>
                    <p class="readOnlyTxt" v-if="readOnly">{{detailData.name}}</p>
                    <el-input v-model="detailData.name"
                              v-else
                              style="width:252px"></el-input>
                  </el-form-item>
                  <el-form-item prop="ipAddress">
                    <span>IP地址<i class="required">*</i></span>
                    <p class="readOnlyTxt" v-if="readOnly">{{detailData.ipAddress}}</p>
                    <el-input v-model="detailData.ipAddress"
                              v-else
                              style="width:266px"></el-input>
                  </el-form-item>
                  <el-form-item prop="port">
                    <span>端口地址<i class="required">*</i></span>
                    <p class="readOnlyTxt" v-if="readOnly">{{detailData.port}}</p>
                    <el-input v-model="detailData.port"
                              v-else
                              style="width:252px"></el-input>
                  </el-form-item>
                </div>
              </div>
            </div>
            <!-- <div class="basInfo other-infor">
              <p class="title"><span class="vertical"></span>其他信息</p>
              <div class="content">
                <div class="ct-header">
                  <p style="color: #4677EE">已添加{{detailData.lightingControllerDTOList.length}}台控制器</p>
                  <span @click="addController" v-if="!readOnly"><i class="iconfont icon-crm_xinzeng-"></i> 新增控制器</span>
                </div>
                <div class="ct-table">
                  <div class="ct-tableheader">
                    <span>控制器ID</span>
                    <span>类型</span>
                    <span v-if="!readOnly">操作</span>
                  </div>
                  <div class="ct-tablebody">
                      <div class="ct-item" v-for="(item, index) in detailData.lightingControllerDTOList">
                        <span v-if="readOnly" class="el-input" style="width: 175px">{{item.identifier}}</span>
                        <el-input v-else v-model="item.identifier" placeholder="请填写控制器ID"></el-input>
                        <span v-if="readOnly" class="el-select">{{controllerTypeFormat(item.controllerType)}}</span>
                        <el-select v-else v-model="item.controllerType" placeholder="选择类型">
                          <el-option :label="item.name" :value="item.value" v-for="(item, index) in controllerType" :key="item.name"></el-option>
                        </el-select>
                        <span @click="delControl(item, index)" v-if="detailData.lightingControllerDTOList.length !== 1 && !readOnly" class="delspan">删除</span>
                      </div>
                  </div>
                </div>
              </div>
            </div> -->
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
          { required: true, message: '请输入网关名称', trigger: 'blur' }
        ],
        ipAddress: [
          { required: true, message: '请输入IP地址', trigger: 'blur' }
        ],
        port: [
          { required: true, pattern: /(^[0-9]\d*$)/, message: '请输入端口地址', trigger: 'blur' }
        ]
      },
      readOnly: true,
      controllerType: [
        {name: '4', value: 'FOUR'},
        {name: '6', value: 'SIX'},
        {name: '8', value: 'EIGHT'},
        {name: '12', value: 'TWELVE'}
      ]
    }
  },
  created () {
  },
  mounted () {
    this.drawertitle = this.drawerTitle
    let clientHeight = document.body.clientHeight
    let mainContent = document.getElementById('mainContent')
    mainContent.style.height = clientHeight - 70 + 'px'
  },
  computed: {

  },
  methods: {
    edit () {
      this.readOnly = false
    },
    close () {
      this.readOnly = true
      this.$refs['detailData'].resetFields()
    },
    addRepairSave (formName, state) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          context.http.put('/rms/api/lightingGateway', _this.detailData).then(res => {
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
      this.detailData.lightingControllerDTOList.push({'identifier': '', 'controllerType': ''})
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
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/mixins.scss";
.getwayDetails {
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
              height: 40px;
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
    .ct-header{
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      span {
        &:first-child{
          color:#4677EE;
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
    .ct-table{
      .ct-tableheader {
        background-color: #F7F8FA;
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
      .ct-tablebody{
        max-height: 360px;
        overflow-y: scroll;
        @include scrollBarStyle;
        .ct-item{
          display: flex;
          align-items: center;
          .el-input{
            width: 160px;
            margin: 10px 20px 20px 40px;
          }
          .el-select{
            width: 160px;
            margin: 10px 20px 20px 20px;
          }
          span {
            margin: 10px 0 20px 56px;
            cursor: pointer;
            text-align: center;
          }
          .delspan {
            color: #BF2F2D;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.getwayDetails {
  .drawer-head {
    margin: 20px 20px 0 20px;
  }
  .el-drawer__body{
    margin: 0;
  }
}
</style>
