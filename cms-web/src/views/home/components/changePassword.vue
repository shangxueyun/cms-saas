<template>
  <el-form :model="addData"
           :rules="rules"
           autocomplete="off"
           ref="ruleForm">
    <el-form-item :label-width="formLabelWidth"
                  prop="code">
      <p>企业代码</p>
      <el-input @input.native="setCode"
                v-model="addData.code"
                placeholder="企业代码"
                type="text"></el-input>
    </el-form-item>
    <el-form-item :label-width="formLabelWidth"
                  prop="telephone">
      <p>手机号</p>
      <el-input v-model="addData.telephone"
                autocomplete="new-password"
                placeholder="请输入手机号码"></el-input>
    </el-form-item>
    <el-form-item :label-width="formLabelWidth"
                  autocomplete="off"
                  prop="verificationCode">
      <p>验证码</p>
      <el-input v-model="addData.verificationCode"
                type="text"
                readonly
                onfocus="this.removeAttribute('readonly');"
                placeholder="请输入验证码"
                class="codeinput"></el-input>
      <span class="verificationCode"
            @click="getVerificationCode('ruleForm')">{{codeTip}}</span>
    </el-form-item>
    <el-form-item :label-width="formLabelWidth"
                  autocomplete="off"
                  prop="password">
      <p>新密码<span class="tips">  至少8位，包含字母(区分大小写)、字符、数字中至少2种类型</span></p>
      <input type="password"
             name="old_password"
             style="display: none">
      <el-input name="old_password"
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
      <span>密码强度：</span>
      <PasswordStrength :newpsd="modes"
                        ref="pwdstrength" />
    </el-form-item>
    <el-form-item :label-width="formLabelWidth"
                  autocomplete="off"
                  prop="confirmPassword"
                  style="margin-bottom: 22px;">
      <p>新密码确认</p>
      <el-input v-model="addData.confirmPassword"
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
      },
      immediate: true
    }
  },
  data () {
    var validateCfPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.addData.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      addData: {
        code: '',
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
        code: [
          { required: true, message: '请输入企业代码', trigger: 'blur' }
        ],
        telephone: [
          { required: true, pattern: /^1[23456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          // /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8}$
          { required: true, pattern: /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,}$/, message: '密码不符合规则', trigger: 'blur' }
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
    setCode () {
      this.$emit('setLoginCode', this.addData.code)
    },
    closeDialog () {
      this.$emit('closeDialog', false)
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
      this.$refs[formName].validateField('code', (cmessage) => {
        if (!cmessage.length) {
          context.user.corporateCustomers(_this.addData.code).then(res => {
            if (res) {
              _this.$refs[formName].validateField('telephone', (message) => {
                if (!message.length && _this.time === 0) {
                  localStorage.setItem('tenantKey', _this.addData.code.replace(' ', ''))
                  context.http.get('mps/api/sms/code', { telephone: _this.addData.telephone, smsEnum: 'R' }).then(res => {
                    if (res.status === 201) {
                      _this.time = 60
                      _this.onTimer()
                    }
                  })
                } else {
                  return false
                }
              })
            }
          })
        } else {
          return false
        }
      })
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
            telephone: this.addData.telephone,
            code: this.addData.verificationCode
          }
          context.http.post('uaa/api/account/change-password', postData).then(res => {
            if (res.data) {
              this.closeDialog()
            }
          })
        }
      })
    },
    async forgetPwd (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let postData = {
            password: this.addData.password,
            telephone: this.addData.telephone,
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
.verificationCode {
  display: inline-block;
  width: 31%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: #3577f6;
  color: #fff;
  border-radius: 4px;
  margin-left: 2%;
  cursor: pointer;
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
}
.el-form-item{
  p {
    margin-bottom: 8px;
  }
}
</style> 
