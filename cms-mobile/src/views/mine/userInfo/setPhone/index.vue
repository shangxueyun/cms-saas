<template>
  <div class="setPhone">
    <app-header :title="title"
                :mode="false">
      <div @click="checkSubmit"
           slot="rightBtn">确定</div>
    </app-header>
    <div class="common_list">
      <mt-field placeholder="请输入新手机号"
                type="number"
                v-model="telephone"></mt-field>
      <mt-field class="codeTip"
                placeholder="请输入验证码"
                type="number"
                v-model="verificationCode">
        <span @click="getVerificationCode"
              class="yzmBtn">{{codeTip}}</span>
      </mt-field>
    </div>
  </div>
</template>

<script>
const reg = /\s+/g
const regPhone = /^1[23456789]\d{9}$/
const regCaptcha = /^\d{6}$/
import context from '@/service'
import AppHeader from '@/components/appHead'
export default {
  name: 'setName',
  components: { AppHeader },
  data () {
    return {
      title: '更换手机号',
      codeTip: '获取验证码',
      time: 60,
      codeReadonly: false,
      telephone: '',
      verificationCode: ''
    }
  },
  computed: {
    userInfo: () => JSON.parse(JSON.parse(localStorage.getItem('user')).value)
  },
  methods: {
    checkSubmit () {
      let { telephone, verificationCode } = this
      if (!regPhone.test(telephone) || reg.test(telephone)) {
        this.$toast({
          message: '请输入正确的手机号',
          position: 'top'
        })
      } else if (!regCaptcha.test(verificationCode) || reg.test(verificationCode)) {
        this.$toast({
          message: '验证码错误',
          position: 'top'
        })
      } else {
        this.replaceTelephone()
      }
    },
    getVerificationCode () {
      if (this.codeReadonly) return
      let { telephone } = this
      if (!regPhone.test(telephone) || reg.test(telephone)) {
        this.$toast({
          message: '请输入正确的手机号',
          position: 'top'
        })
        return
      }
      context.http.get('mps/api/sms/code', { telephone: telephone, smsEnum: 'R' }).then(res => {
        if (res.status === 201) {
          this.time = 60
          this.onTimer()
        }
      })
    },
    replaceTelephone () {
      const { telephone, verificationCode } = this
      context.http.get('mps/api/sms/verification/code', { telephone: telephone, code: verificationCode }).then(res => {
        if (res.status === 200 && res.data === true) {
          this.userInfo.telephone = telephone
          this.saveUserInfo()
        } else {
          this.$toast({
            message: '验证码错误',
            position: 'top'
          })
        }
      })
    },
    async saveUserInfo () {
      const { userInfo } = this
      await context.user.setCurrentAccount(userInfo)
      this.$router.go(-1)
    },
    onTimer () {
      this.time--
      if (this.time > 0) {
        this.codeTip = this.time + 's'
        setTimeout(this.onTimer, 1000)
        this.codeReadonly = true
      } else {
        this.codeTip = '获取验证码'
        this.codeReadonly = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/config";
.setPhone {
  padding-top: rem(50);
  .yzmBtn {
    display: block;
    width: rem(80);
    text-align: center;
    font-size: rem(14);
    color: #0139a4;
  }
}
</style>
