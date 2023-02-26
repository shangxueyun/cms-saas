<template>
  <el-form :model="addData"
           :rules="rules"
           class="changePassWordDialog"
           autocomplete="off"
           ref="ruleForm">
    <!-- <el-form-item 
                    prop="code">
        <div>企业代码</div>
        <el-input @input.native="setCode" v-model="addData.code"
                  placeholder="企业代码"
                  type="text"></el-input>
      </el-form-item> -->
    <el-form-item prop="telephone">
      <div>手机号</div>
      <el-input v-model="telephone"
                style="width:370px"
                size="small"
                disabled
                autocomplete="new-password"
                placeholder="请输入新手机号"></el-input>
    </el-form-item>
    <el-form-item autocomplete="off"
                  prop="verificationCode">
      <div>验证码</div>
      <el-input v-model="addData.verificationCode"
                style="width:260px"
                size="small"
                type="text"
                readonly
                onfocus="this.removeAttribute('readonly');"
                placeholder="请输入验证码"
                class="codeinput"></el-input>
      <span class="verificationCode"
            :class="{'codeReadonly':codeReadonly}"
            @click="getVerificationCode('ruleForm')">{{codeTip}}</span>
    </el-form-item>
    <span class="tips" v-if="operationType === 'loginPassword'">至少8位，包含字母(区分大小写)、字符、数字中至少2种类型</span>
    <el-form-item autocomplete="off"
                  prop="password">
      <div>新密码</div>
      <input type="password"
             size="small"
             name="old_password"
             style="display: none">
      <el-input name="old_password"
                size="small"
                style="width:370px"
                v-model="addData.password"
                oninput="value=value.replace(/[\u4e00-\u9fa5]/ig,'')"
                onpaste="return false"
                ondragenter="return false"
                :type="registration_data.pwdType"
                placeholder="请输入新密码"
                @input="checkStrong">
        <template slot="append">
          <i class="el-icon-pwd icon"
             @click="changeType"
             :class="{'el-icon-confirm': registration_data.pwdType === 'text'}"></i>
        </template>
      </el-input>
      <!-- <span>密码强度：</span>
      <PasswordStrength :newpsd="modes"
                        ref="pwdstrength" /> -->
    </el-form-item>
    <el-form-item autocomplete="off"
                  prop="confirmPassword"
                  style="margin-bottom: 22px;">
      <div>新密码确认</div>
      <el-input v-model="addData.confirmPassword"
                style="width:370px"
                size="small"
                oninput="value=value.replace(/[\u4e00-\u9fa5]/ig,'')"
                onpaste="return false"
                ondragenter="return false"
                :type="confirm_data.pwdType"
                placeholder="请再次输入新密码">
        <template slot="append">
          <i class="el-icon-pwd icon"
             @click="changeConfirmType"
             :class="{'el-icon-confirm': confirm_data.pwdType === 'text'}"></i>
        </template>
      </el-input>
    </el-form-item>
  </el-form>
</template>
<script>
import context from '@/service'
import PasswordStrength from '@/components/passwordStrength'
export default {
  components: {
    PasswordStrength
  },
  props: {
    dialogShow: {
      type: Boolean,
      default: false
    },
    operationType: { // 操作类型 修改登录密码or设置操作密码
      type: String,
      default: 'loginPassword'
    },
    telephone: {
      type: String,
      default: ''
    },
    loginCode: {
      type: String,
      default: ''
    }
  },
  watch: {
    dialogShow: {
      handler: function (newValue, oldValue) {
        console.log(this.loginCode)
        this.addData.code = this.loginCode
        // this.addData.telephone = this.$store.state.staffInfo.telephone
      },
      immediate: true
    }
  },
  data () {
    let _this = this
    var validpassword = (rule, value, callback) => {
      if (_this.operationType === 'businessPassword') {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          callback()
        }
      } else {
        let reg = rule.pattern
        if (!reg.test(value)) {
          callback(new Error('密码不符合规则'))
        } else {
          callback()
        }
      }
    }
    var validateCfPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value !== this.addData.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      addData: {
        // code: '',
        telephone: '',
        password: '',
        verificationCode: '',
        confirmPassword: ''
      },
      time: 0,
      modes: 0,
      codeTip: '获取验证码',
      codeReadonly: false,
      rules: {
        // code: [
        //   { required: true, message: '请输入企业代码', trigger: 'blur' }
        // ],
        // telephone: [
        //   { required: true, pattern: /^1[23456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        // ],
        password: [
          // { required: true, pattern: /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,}$/, message: '密码不符合规则', trigger: 'blur' }
          { validator: validpassword, pattern: /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,}$/, trigger: 'blur' }
        ],
        verificationCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        confirmPassword: [
          { validator: validateCfPass, trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px',
      registration_data: {
        pwdType: 'password'
      },
      confirm_data: {
        pwdType: 'password'
      }
    }
  },
  methods: {
    upDateTelephone (telNum) {

    },
    setCode () {
      this.$emit('setLoginCode', this.addData.code)
    },
    closeDialog () {
      this.$emit('closeDialog', false)
    },
    addDataReset () {
      this.addData = {
        telephone: '',
        password: '',
        verificationCode: '',
        confirmPassword: ''
      }
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields()
      })
    },
    checkStrong () {
      this.modes = this.addData.password
    },
    changeType () {
      this.registration_data.pwdType = this.registration_data.pwdType === 'password' ? 'text' : 'password'
    },
    changeConfirmType () {
      this.confirm_data.pwdType = this.confirm_data.pwdType === 'password' ? 'text' : 'password'
    },
    getVerificationCode (formName) {
      if (this.codeReadonly) {
        return false
      }
      let _this = this
      if (_this.time === 0) {
        context.http.get('mps/api/sms/code', { telephone: _this.telephone, smsEnum: 'R' }).then(res => {
          if (res.status === 201) {
            _this.time = 60
            _this.onTimer()
          }
        })
      } else {
        return false
      }
    },
    onTimer () {
      this.time--
      if (this.time > 0) {
        this.codeTip = this.time + 's后重新获取'
        setTimeout(this.onTimer, 1000)
        this.codeReadonly = true
      } else {
        this.codeTip = '获取验证码'
        this.codeReadonly = false
      }
    },
    async changePwd (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let postData = {
            password: this.addData.password,
            telephone: this.telephone,
            code: this.addData.verificationCode
          }
          let url = ''
          if (this.operationType === 'loginPassword') { // 修改登录密码
            url = 'uaa/api/account/change-password'
          } else if (this.operationType === 'businessPassword') {  // 设置操作密码
            url = 'uaa/api/account/change-operatePassword'
          }
          context.http.post(url, postData).then(res => {
            // if (res.status === 200) {
            this.closeDialog()
            this.$message({
              duration: 1000,
              message: '密码修改成功',
              type: 'success'
            })
            // } else {
            //   this.$message({
            //     duration: 1000,
            //     message: res.data,
            //     type: 'error'
            //   })
            // }
          }).catch(error => {
            this.$message({
              duration: 1000,
              message: error.response.data,
              type: 'error'
            })
          })
        }
      })
    },
    async forgetPwd (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let postData = {
            password: this.addData.password,
            telephone: this.telephone,
            verificationCode: this.addData.verificationCode
          }
          context.http.post('uaa/api/account/forget_password', postData).then(res => {
            if (res.data) {
              this.$emit('goback', false)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.codeinput {
  width: 65%;
}
.el-icon-pwd {
  background: url(../../../assets/closeeyes.png) no-repeat;
  background-size: contain;
  vertical-align: -webkit-baseline-middle;
  background-position: 1px;
  cursor: pointer;
}
.el-icon-confirm {
  background: url(../../../assets/openeyes.png) no-repeat;
  background-size: contain;
  background-position: 1px;
  cursor: pointer;
}
.tips{
  color: #E50000;
  font-size: 12px;
  padding-left: 100px;
}
</style>
