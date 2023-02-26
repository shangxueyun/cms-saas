<template>
  <div id="registered">
    <div class="rg-head" @click="goLogin">
      <i class="iconfont iconcms_guanbi"></i>
      <div class="title">注册小象商管</div>
    </div>
    <div class="pw-warp" @touchend.stop="checkUse(1)">
      <mt-field placeholder="请输入手机号" 
        type="tel" 
        v-model="find.telephone" 
        @input.native="checkUse(1)" 
        ></mt-field>
      <mt-field placeholder="请输入密码"
                :type="pwdType"
                v-model="find.password"
                class="eyewp"
                @input.native="checkUse(1)"
                >
        <i class="eye-img iconfont"
            v-bind:class="[pwdType === 'text' ? 'iconcms_chakan-' : 'iconcms_biyan']"
            @click="changeConfirmType"></i>
      </mt-field>
      <mt-field placeholder="请输入验证码" 
        type="number" 
        v-model="find.vCode" 
        @input.native="checkUse(1)" 
        >
        <span class="verificationCode" :class="{'disabled': 'codeReadonly'}" @click="getVerificationCode()">{{codeTip}}</span>
      </mt-field>
      <div class="tips">
        密码至少8位，包含字母(区分大小写)、字符、数字中至少2种类型
      </div>

      <div class="yw-btn"
            @click="registeredFn"
            :class="{'abled': abled1}">
        注册
      </div>
    </div>
    <div class="login-footer" v-if="showFooter">
      点击注册表示您已同意<span @click="UserAgreement">《用户使用协议》</span><span @click="PrivacyPolicy">《隐私政策》</span>
    </div>
  </div>
</template>
<script>
import context from '@/service'
import { Toast, MessageBox } from 'mint-ui'
import axios from 'axios'
export default {
  name: 'password',
  data () {
    return {
      find: {
        password: '',
        telephone: '',
        vCode: ''
      },
      codeReadonly: false,
      time: 0,
      codeTip: '获取验证码',
      abled1: false,
      abled2: false,
      pwdType: 'password',
      showFooter: true
    }
  },
  created () {
    this.checkUse(1)
  },
  mounted () {
    this.h = document.body.scrollHeight
    window.addEventListener('resize', this.listenResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.listenResize)
  },
  computed: {
    tenantKey: () => localStorage.getItem('tenantKey')
  },
  methods: {
    goLogin () {
      window.location.href = '/ids/#/ids/login'
    },
    listenResize () {
      if (document.body.scrollHeight < this.h) {
        this.showFooter = false
      } else {
        this.showFooter = true
      }
    },
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
      if (!this.find.telephone) {
        this.$toast({
          message: '请输入手机号',
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
      if (_this.time === 0) {
        localStorage.setItem('tenantKey', 'sim')
        context.http.get('mps/api/sms/code', { telephone: _this.find.telephone, smsEnum: 'R' }).then(res => {
          if (res.status === 201) {
            _this.time = 60
            _this.onTimer()
          }
        })
      } else {
        return false
      }
    },
    checkUse (type) {
      if (this.find.telephone.trim() && this.find.password.trim() && this.find.vCode.trim()) {
        this.abled1 = true
      } else {
        this.abled1 = false
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
      this.pwdType = this.pwdType === 'password' ? 'text' : 'password'
    },
    complete () {
      let reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,}$/
      if (!reg.test(this.find.password.trim())) {
        this.$toast({
          message: '密码不符合规则',
          position: 'top'
        })
        return
      }
    },
    registeredFn () {
      if (!this.abled1) return
      let reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,}$/
      if (!reg.test(this.find.password.trim())) {
        this.$toast({
          message: '密码不符合规则',
          position: 'top'
        })
        return
      }
      let postData = {
        password: this.find.password,
        telephone: this.find.telephone,
        verificationCode: this.find.vCode
      }
      context.http.post('uaa/api/account/create', postData).then(res => {
        if (res.data) {
          MessageBox({
            message: '注册成功',
            title: '',
            confirmButtonText: '好',
            confirmButtonClass: 'confirmButton'
          })
          this.$router.go(-1)
        }
      })
    },
    UserAgreement () {
      this.$router.push({name: 'policyAgreement', query: {'srcType': 'UserAgreement'}})
    },
    PrivacyPolicy () {
      this.$router.push({name: 'policyAgreement', query: {'srcType': 'PrivacyPolicy'}})
    }
  }
}
</script>
<style lang="scss">
@import "../../style/config";
.toast-name{
  width: rem(190);
}
 #registered {
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
  #registered{
    overflow: hidden;
  }
  .pw-warp{
    margin-top: rem(40);
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
  .rg-head{
    i {
      display: inline-block;
      margin: rem(20);
    }
    .title{
      font-size: rem(25);
      margin: rem(20);
      color: #18191A;
    }
  }
  .login-footer{
    position: absolute;
    width: 100%;
    bottom: rem(20);
    text-align: center;
    font-size: rem(12);
    span {
      color: #0139A4;
    }
  }
}
.tips{
  color: #e50000;
  font-size: rem(12);
}
</style>
