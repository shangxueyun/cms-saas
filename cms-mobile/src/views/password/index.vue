<template>
  <div id="find-pwd">
    <app-header :title="title" :mode="false" :onBackCallBack="goBack"></app-header>
    <div class="pw-warp" @touchend.stop="checkUse(1)" v-show="setp1">
      <mt-field placeholder="请输入企业代码" 
         v-model="find.code"  
        :disabled="type === 'resetPassword'" 
        @input.native="checkUse(1)" 
        ></mt-field>
      <mt-field placeholder="请输入手机号" 
        type="tel" 
        v-model="find.telephone" 
        :disabled="type === 'resetPassword'" 
        @input.native="checkUse(1)" 
        ></mt-field>
      <mt-field placeholder="请输入验证码" 
        type="number" 
        v-model="find.vCode" 
        @input.native="checkUse(1)" 
        >
        <span class="verificationCode" :class="{'disabled': 'codeReadonly'}" @click="getVerificationCode()">{{codeTip}}</span>
      </mt-field>
      <div class="yw-btn" @click="nextStep" :class="{'abled': abled1}">
        下一步
      </div>
    </div>
    <div class="pw-warp confirm_change" v-show="setp2"  @touchend.stop="checkUse(2)">
      <mt-field placeholder="请输入新密码" :type="pwdType" 
        v-model="find.password" class="eyewp" 
        @input.native="checkUse(2)" 
        >
        <i class="eye-img iconfont" v-bind:class="[pwdType === 'text' ? 'iconcms_chakan-' : 'iconcms_biyan']"  @click="changeConfirmType(0)"></i>
      </mt-field>
      <mt-field placeholder="确认新密码" :type="pwdType1" 
        v-model="confirmPassword" class="eyewp" 
        @input.native="checkUse(2)" 
        >
        <i  class="eye-img iconfont" v-bind:class="[pwdType1 === 'text' ? 'iconcms_chakan-' : 'iconcms_biyan']"  @click="changeConfirmType(1)"></i>
      </mt-field>
      <span class="tips">至少8位，包含字母(区分大小写)、字符、数字中至少2种类型</span>
      <div class="yw-btn" @click="complete" :class="{'abled': abled2}">
        完成
      </div>
    </div>
  </div>
</template>
<script>
import context from '@/service'
import { Toast, MessageBox } from 'mint-ui'
import AppHeader from '@/components/appHead'
export default {
  name: 'password',
  components: { AppHeader },
  data () {
    return {
      find: {
        code: '',
        telephone: '',
        vCode: ''
      },
      codeReadonly: false,
      time: 0,
      codeTip: '获取验证码',
      abled1: false,
      abled2: false,
      setp1: true,
      setp2: false,
      title: '找回密码',
      type: '',
      confirmPassword: '',
      pwdType: 'password',
      pwdType1: 'password'
    }
  },
  created () {
    this.checkUse(1)
    if (this.$route.params.type) {
      this.type = this.$route.params.type
    }
    if (this.type === 'resetPassword') {
      this.title = '修改登录密码'
      this.find.code = this.tenantKey
      let user = JSON.parse(this.user)
      let userValue = JSON.parse(user.value)
      this.find.telephone = userValue.telephone
    }
  },
  computed: {
    tenantKey: () => localStorage.getItem('tenantKey'),
    user: () => localStorage.getItem('user')
  },
  methods: {
    onTimer () {
      this.time--
      if (this.time > 0) {
        this.codeTip = this.time + 's后重发'
        setTimeout(this.onTimer, 1000)
        this.codeReadonly = true
      } else {
        this.codeTip = '获取验证码'
        this.codeReadonly = false
      }
    },
    getVerificationCode () {
      if (this.codeReadonly) return
      if (!this.find.code || !this.find.telephone) {
        this.$toast({
          message: '信息请输入完整',
          position: 'top'
        })
        return false
      }
      const regPhone = /^1[23456789]\d{9}$/
      const reg = /\s+/g
      if (!regPhone.test(this.find.telephone) || reg.test(this.find.telephone)) {
        this.$toast({
          message: '请输入正确的手机号',
          position: 'top'
        })
        return
      }
      let _this = this
      context.user.corporateCustomers(_this.find.code).then(res => {
        if (res) {
          console.log('_this.time', _this.time)
          if (_this.time === 0) {
            localStorage.setItem('tenantKey', _this.find.code.replace(' ', ''))
            context.http.get('mps/api/sms/code', { telephone: _this.find.telephone, smsEnum: 'R' }).then(res => {
              if (res.status === 201) {
                _this.time = 60
                _this.onTimer()
              }
            })
          } else {
            return false
          }
        }
      })
    },
    checkUse (type) {
      if (type === 1) {
        if (this.find.code.trim() && this.find.telephone.trim() && this.find.vCode.trim()) {
          this.abled1 = true
        } else {
          this.abled1 = false
        }
      } else {
        if (this.find.password.trim() && this.confirmPassword.trim()) {
          this.abled2 = true
        } else {
          this.abled2 = false
        }
      }
    },
    async nextStep () {
      if (!this.abled1) return
      const tel = await this.replaceTelephone()
      if (!tel) return
      this.setp1 = false
      this.setp2 = true
      this.title = '设置新密码'
    },
    goBack () {
      if (this.setp2) {
        this.setp1 = true
        this.setp2 = false
        this.title = '修改登录密码'
      } else {
        this.$router.go(-1)
      }
    },
    async replaceTelephone () {
      const {telephone, vCode} = this.find
      let res = await context.http.get('mps/api/sms/verification/app', { telephone: telephone, code: vCode })
      if (res.status === 200 && res.data) {
        res = true
      } else {
        this.$toast({
          message: '验证码错误',
          position: 'top'
        })
        res = false
      }
      return res
    },
    changeConfirmType (type) {
      if (type === 0) {
        this.pwdType = this.pwdType === 'password' ? 'text' : 'password'
      } else {
        this.pwdType1 = this.pwdType1 === 'password' ? 'text' : 'password'
      }
    },
    complete () {
      if (!this.abled2) return
      let reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,}$/
      if (!reg.test(this.find.password.trim())) {
        this.$toast({
          message: '密码不符合规则',
          position: 'top'
        })
        return
      }
      if (this.confirmPassword !== this.find.password) {
        this.$toast({
          message: '两次密码不一致',
          position: 'top'
        })
        return
      }
      if (this.type === 'resetPassword') {
        this.changePwd()
      } else {
        this.forgetPwd()
      }
    },
    changePwd () {
      let postData = {
        password: this.find.password,
        telephone: this.find.telephone,
        code: this.find.vCode
      }
      context.http.post('uaa/api/account/change-password', postData).then(res => {
        if (res.data) {
          MessageBox({
            message: '重置密码成功',
            title: '',
            confirmButtonText: '好',
            confirmButtonClass: 'confirmButton'
          })
          // this.$router.push('/login')
          // window.location.href = '/ids/#/ids/login'
          context.user.logout()
        }
      })
    },
    forgetPwd () {
      let postData = {
        password: this.find.password,
        telephone: this.find.telephone,
        verificationCode: this.find.vCode
      }
      context.http.post('uaa/api/account/forget_password', postData).then(res => {
        if (res.data) {
          MessageBox({
            message: '重置密码成功',
            title: '',
            confirmButtonText: '好',
            confirmButtonClass: 'confirmButton'
          })
          // this.$router.push('/login')
          // window.location.href = '/ids/#/ids/login'
          context.user.logout()
        }
      })
    }
  }
}
</script>
<style lang="scss">
@import "../../style/config";
 #find-pwd {
    width: 100%;
    height: 100%;
    background: #fff;
    display: inline-block;
    position: fixed;
   .pw-warp .mint-cell-wrapper{
    padding: 0;
    background-image: none;
    border-bottom: rem(1) solid #D9D9D9;
    input {
      background-color: #fff;
    }
  }
  .mint-cell{
    padding-left: 0;
    min-height: rem(50)!important;
  }
  #find-pwd{
    overflow: hidden;
  }
  .pw-warp{
    margin-top: rem(60);
    padding: rem(14);
  }
  .yw-btn {
    height: rem(44);
    line-height: rem(44);
    color: #eff2f9;
    font-size: rem(17);
    margin-top: rem(80);
    background-color: #D9D9D9;
    text-align: center;
    border-radius: rem(4);
    cursor: pointer;
    &.abled{
      background-color: #0139A4;
    }
  }
  .verificationCode {
    color: #0139A4;
    font-size: rem(14);
    display: inline-block;
    border-left: rem(1) solid #D8D8D8;
    padding-left: rem(10);
    margin-left: rem(10);
    &.disabled{
      color: #023C8F;
    }
  }
  input {
    font-size: rem(15);
  }
  .eye-img{
    width: rem(20);
    height: rem(13);
    font-size: rem(14);
    display: inline-block;
    background-size: contain;
    margin-left: rem(16);
  }
  .el-icon-confirm{
    background-size: contain;
  }
  .tips{
    display: inline-block;
    color: #E50000;
    font-size: rem(12);
    margin-top: rem(10);
  }
}
</style>
