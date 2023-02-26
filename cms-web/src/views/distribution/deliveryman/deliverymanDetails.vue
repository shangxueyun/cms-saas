<template>
  <div class="deliverymanDetails">
    <drawer class="drawer_new"
            :show="detailsdrawershow"
            :showEditBtn="readOnly && hasAuthority('02050708')"
            @on-edit="onEdit"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="details_content drawer-body"
           slot="drawer">
        <div class="main_content"
             style="height:100%;padding:0;background-color: #F7F7F7;">
          <div class="half_page_title"
               style="width:100%">
            <div><i></i>基本信息</div>
          </div>
          <div class="contentItem">
            <el-form :model="draweDetaileData"
                     :rules="addFlowRules"
                     ref="draweDetaileData">
              <el-form-item prop="distributionPersonName"
                            class="item">
                <span>姓名<i class="required">*</i></span>
                <p v-if="readOnly">{{draweDetaileData.distributionPersonName}}</p>
                <el-input v-model="draweDetaileData.distributionPersonName"
                          v-else
                          size="small"></el-input>
              </el-form-item>
              <el-form-item prop="distributionTelephone"
                            class="item">
                <span>手机号<i class="required">*</i></span>
                <p v-if="readOnly">{{draweDetaileData.distributionTelephone}}</p>
                <el-input v-model="draweDetaileData.distributionTelephone"
                          v-else
                          size="small"></el-input>
              </el-form-item>
              <el-form-item prop="projectManagementId"
                            class="item">
                <span>所属项目<i class="required">*</i></span>
                <p v-if="readOnly">{{draweDetaileData.projectManagementName}}</p>
                <el-select v-model="draweDetaileData.projectManagementId"
                           v-else
                           size="small"
                           style="width:100%"
                           placeholder="项目简称">
                  <el-option v-for="item in projectOptions"
                             :key="item.id"
                             :label="item.referred"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="useStatus"
                            class="item">
                <span>状态<i class="required">*</i></span>
                <p v-if="readOnly">{{useStatusFormat(draweDetaileData.useStatus)}}</p>
                <el-select v-model="draweDetaileData.useStatus"
                           style="width:100%"
                           size="small"
                           v-else>
                  <el-option label="启用"
                             value="USING"></el-option>
                  <el-option label="停用"
                             value="DISABLE"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div slot="footer"
           v-if="!readOnly"
           class="dialog-footer">
        <span @click="onHide"
              class="details_cannelBtn"
              style="background:none">取消</span>
        <span class="saveSubmit"
              @click="save()">保存</span>
      </div>
    </drawer>
  </div>
</template>

<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import axios from 'axios'
import * as JSOG from 'jsog'
export default {
  name: 'deliverymanDetails',
  components: {
    Drawer
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    draweDetaileData: {
      type: Object,
      default: {

      }
    }
  },
  created () {
    this.projectOptions = this.$store.state.projectManagementsList
  },
  watch: {
    detailsdrawershow: {
      handler (newValue, oldValue) {
        if (newValue) {

        }
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    var checkPhone = (rule, value, callback) => {
      let mobile = /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/ // 最新16手机正则
      if (!mobile.test(value)) {
        return callback(
          new Error('请输入正确的手机号格式')
        )
      } else {
        callback()
      }
    }
    return {
      readOnly: true,
      readOnlyImg: false, // 做编辑图片回显
      fileSize: 2,
      tableData: [],
      projectOptions: [],
      drawerTitle: '配送员详情',
      addFlowRules: {
        projectManagementId: [
          { required: true, message: '请选择所属项目', trigger: 'change' }
        ],
        useStatus: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        distributionPersonName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        distributionTelephone: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {

  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    useStatusFormat (val) {
      if (val === 'USING') {
        return '启用'
      } else {
        return '停用'
      }
    },
    onHide () {
      this.readOnly = true
      this.$emit('drawerClose', false)
      this.$refs['draweDetaileData'].resetFields()
    },
    onEdit () {
      this.readOnly = false
    },
    save () {
      this.$refs['draweDetaileData'].validate((valid) => {
        if (valid) {
          context.http.put(`ord/api/distribution-users`, this.draweDetaileData).then(res => {
            if (res) {
              this.$message.success('修改成功')
              this.$emit('query')
              this.onHide()
            }
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
<style lang="scss" scoped>
.deliverymanDetails {
  .main_content {
    .contentItem {
      .el-form {
        padding: 15px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        background-color: #fff;
        margin-bottom: 15px;
        min-height: 200px;
        overflow-y: auto;
        > .item {
          width: 45%;
          font-size: 14px;
          margin-bottom: 20px;
          margin-right: 14px;
          span {
            display: inline-block;
            color: #777777;
            margin-bottom: 10px;
          }
          > p {
            color: #262626;
            word-break: break-word;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.deliverymanDetails {
  .el-table::before {
    height: 0;
  }
  .dialog-footer {
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
  .details_content {
    width: 750px;
    height: calc(100% - 80px) !important;
  }
  .item-attribute {
    width: 100%;
    margin-bottom: 20px;
    p {
      margin: 10px 0;
    }
    .el-checkbox {
      margin-top: 8px;
      width: 20%;
    }
  }
}
</style>
