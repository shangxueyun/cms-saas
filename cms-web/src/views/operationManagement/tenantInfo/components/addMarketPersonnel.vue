<template>
  <div>
    <el-dialog class="addMarketPersonnel el_dialog_new"
               :title="title"
               @close="addDialogClose"
               :visible.sync="addMarketPersonnelShow"
               :modal-append-to-body="false"
               :close-on-click-modal="false">
      <div class="main_content">
        <el-form :model="addData"
                 ref="addData"
                 :rules="addDataRules">
          <div class="half_page_title"
               style="width:100%;margin-bottom:15px">
            <div><i></i>商户信息</div>
          </div>
          <div class="item"><span>商户</span><span>{{tenantDetail.teantName}}</span></div>
          <div class="item"><span>楼宇</span><span>{{enterpriseRooms.buildingName || '-'}}</span></div>
          <div class="item"><span>房源</span><span>{{enterpriseRooms.shopNumber || '-'}}</span></div>
          <div class="half_page_title"
               style="width:100%;margin-bottom:15px">
            <div><i></i>基本信息</div>
          </div>
          <el-form-item prop="name"
                        style="margin-bottom: 20px;">
            <div class="cttitle">姓名<i class="required">*</i></div>
            <el-input v-model="addData.name"
                      maxlength="30"
                      size="small"
                      placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item prop="idCard"
                        style="margin-bottom: 20px;">
            <div class="cttitle">身份证<i class="required">*</i></div>
            <el-input v-model="addData.idCard"
                      maxlength="30"
                      size="small"
                      placeholder="请输入身份证"></el-input>
          </el-form-item>
          <el-form-item prop="sex"
                        style="margin-bottom: 20px;">
            <div class="cttitle">性别<i class="required">*</i></div>
            <el-select v-model="addData.sex"
                       size="small">
              <el-option label="男"
                         value="男"></el-option>
              <el-option label="女"
                         value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="address"
                        style="margin-bottom: 20px;">
            <div class="cttitle">居住地址<i class="required">*</i></div>
            <el-input v-model="addData.address"
                      size="small"
                      placeholder="请输入身份证"></el-input>
          </el-form-item>
          <el-form-item prop="telephone"
                        style="margin-bottom: 20px;">
            <div class="cttitle">联系电话<i class="required">*</i></div>
            <el-input v-model="addData.telephone"
                      size="small"
                      placeholder="请输入身份证"></el-input>
          </el-form-item>
          <el-form-item prop="post"
                        style="margin-bottom: 20px;">
            <div class="cttitle">岗位 / 职务</div>
            <el-input v-model="addData.post"
                      size="small"
                      placeholder="请输入身份证"></el-input>
          </el-form-item>
          <el-form-item prop="remake"
                        style="margin-bottom: 20px;">
            <div class="cttitle">备注</div>
            <el-input v-model="addData.remake"
                      size="small"
                      placeholder="请输入身份证"></el-input>
          </el-form-item>
          <div class="half_page_title"
               v-if="addType==='edit'"
               style="width:100%;margin-bottom:15px">
            <div><i></i>设置</div>
          </div>
          <el-form-item style="margin-bottom: 20px;"
                        v-if="addType==='edit'">
            <div class="cttitle">状态<i class="required">*</i></div>
            <el-select v-model="addData.useStatus"
                       size="small"
                       placeholder="请选择">
              <el-option label="使用中"
                         value="USING"></el-option>
              <el-option label="停用"
                         value="DISABLE"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"
           class="slotfooter">
        <span @click="addDialogClose"
              class="details_cannelBtn">取消</span>
        <span class="details_submitBtn"
              @click="addMarketPerson('addData')">确定</span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Drawer from '@/components/drawer.vue'
import IdentityCodeValid from '@/utils/checkIdent'
import moment from 'moment'
import context from '@/service'
export default {
  name: 'addMarketPersonnel',
  components: {
    Drawer
  },
  props: {
    addMarketPersonnelShow: {
      type: Boolean,
      default: false
    },
    checkData: {
      type: Array,
      default: function () {
        return []
      }
    },
    detailData: {
      type: Object,
      default: {}
    },
    addType: {
      type: String,
      default: 'add'
    },
    tenantDetail: {
      type: Object,
      default: {}
    }
  },
  computed: {
    title () {
      let msg = this.addType === 'add' ? '新增人员' : '编辑人员'
      return msg
    }
  },
  watch: {
    'addMarketPersonnelShow' (newValue, oldValue) {
      if (newValue) {
        this.addData.tenantId = this.tenantDetail.id
        if (this.addType === 'edit') {
          this.addData = JSON.parse(JSON.stringify(this.detailData))
        } else {
          if (this.checkData.length) {
            this.enterpriseRooms = this.checkData[0]
            this.addData.projectManagementId = this.enterpriseRooms.projectManagementId
            this.addData.buildingId = this.enterpriseRooms.buildingId
            this.addData.roomId = this.enterpriseRooms.roomId
          }
        }
      }
    }
  },
  created () {
  },
  mounted () {

  },
  data () {
    var validateIDNumber = (rule, value, callback) => {
      // var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      // if (!reg.test(value)) {
      if (!IdentityCodeValid(value).pass) {
        callback(new Error('请输入正确的身份证号码'))
      } else {
        callback()
      }
    }
    return {
      enterpriseRooms: {},
      addData: {
        name: '',
        idCard: '',
        sex: '男',
        address: '',
        telephone: '',
        post: '',
        remake: '',
        useStatus: 'USING',
        projectManagementId: null,
        tenantId: null,
        buildingId: null,
        roomId: null
      },
      addDataRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入居住地址', trigger: 'blur' }
        ],
        idCard: [
          { validator: validateIDNumber, required: true, trigger: 'blur' }
        ],
        telephone: [
          { required: true, pattern: /^1[23456789]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async addMarketPerson (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          context.http.post('/gos/api/tenantPersonnel', this.addData).then(res => {
            if (res.data) {
              let msg = this.addType === 'add' ? '新增成功' : '修改成功'
              this.$message.success(msg)
              this.addDialogClose()
              this.$emit('query')
              if (this.addType === 'edit') this.$emit('updateDetailsData', res.data)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addDialogClose () {
      this.addData = {
        name: '',
        idCard: '',
        sex: '男',
        address: '',
        telephone: '',
        post: '',
        remake: '',
        useStatus: 'USING',
        projectManagementId: null,
        tenantId: null,
        buildingId: null,
        roomId: null
      }
      this.$refs['addData'].resetFields()
      this.$emit('addDialogClose')
    }
  }
}
</script>
<style lang="scss">
.drawer .addMarketPersonnel .el-dialog {
  width: 700px !important;
  height: auto !important;
  margin-top: 15vh !important;
  float: none !important;
  .main_content {
    .el-form {
      padding: 0px;
      display: flex;
      flex-wrap: wrap;
      > .item {
        width: 28%;
        margin-left: 15px;
        margin-right: 15px;
        margin-bottom: 15px;
        display: flex;
        flex-direction: column;
        > span {
          font-size: 14px;
          color: #262626;
          &:first-child {
            color: #777;
          }
        }
      }
      .el-form-item {
        width: 28%;
        margin-left: 15px;
        margin-right: 15px;
        margin-bottom: 15px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.addMarketPersonnel {
}
</style>
