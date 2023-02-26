<template>
  <div class="mine">
    <div class="mine_user_info">
      <img v-if="userInfo.facialPhoto"
           :src='userInfo.facialPhoto+"?x-oss-process=image/resize,w_"+80+",h_"+80+",m_fixed"' />
      <p v-else
         class="default-hportrait">{{formatName(userInfo.name)}}</p>
      <div>
        <span>{{userInfo.name}}</span>
        <span v-if="userInfo.userPostManagements && userInfo.userPostManagements.length">{{userInfo.userPostManagements[0].userPostName}}</span>
      </div>
    </div>
    <div class="common_list">
      <mt-cell title="个人信息"
               @click.native="toUserInfo"
               is-link>
      </mt-cell>
      <mt-cell @click.native="toPassword"
               title="修改登录密码"
               is-link>
      </mt-cell>
    </div>
    <div @click="logout"
         class="loginOut">退出登录</div>
    <div class="footer">
      <div @click="UserAgreement" class="ft-link">《用户使用协议》</div>
      <div @click="PrivacyPolicy" class="ft-link">《隐私政策》</div>
      <div style="font-family:arial;">Copyright &copy;2020 上海云悟信息科技有限公司</div>
    </div>
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui'
import context from '@/service'
export default {
  name: 'mine',
  data () {
    return {
      userInfo: JSON.parse(JSON.parse(localStorage.getItem('user')).value)
    }
  },
  mounted () {
    this.getUserInfo()
  },
  computed: {
  },
  methods: {
    async getUserInfo () {
      let result = await context.http.get('uaa/api/account/user')
      this.userInfo = result.data
      context.storage.setItem({
        name: 'user',
        value: JSON.stringify(result.data),
        expires: 1000 * 60 * 60 * 24 * 7
      })
    },
    logout: function () {
      let _this = this
      MessageBox.confirm('', {
        message: '确定要退出登录吗？',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        confirmButtonClass: 'confirmButton',
        cancelButtonClass: 'cancelButton'
      }).then(action => {
        if (action === 'confirm') {
          localStorage.removeItem('user')
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          // _this.$router.push('/login')
          context.user.logout()
        }
      })
    },
    formatName (name) {
      if (name) {
        return name.length > 2 ? name.substring(name.length - 2) : name
      }
    },
    toUserInfo () {
      this.$router.push({ name: 'userInfo' })
    },
    toPassword () {
      this.$router.push({ name: 'password', params: { 'type': 'resetPassword' } })
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
<style lang="scss" scoped>
@import "../../style/config";
.mine {
  width: 100%;
  min-height: 100%;
  .mine_user_info {
    width: 100%;
    height: rem(180);
    background: url(../../assets/personalCenterBg.png) no-repeat center;
    background-size: cover;
    display: flex;
    padding: rem(60) rem(14) 0;
    > img {
      display: block;
      width: rem(72);
      height: rem(72);
      border-radius: rem(72);
      margin-right: rem(20);
    }
    > .default-hportrait {
      width: rem(72);
      height: rem(72);
      border-radius: rem(72);
      background-color: #409eff;
      line-height: rem(72);
      text-align: center;
      color: #fff;
      font-size: rem(20);
      margin-right: rem(20);
    }
    > div {
      flex: 1;
      > span {
        display: block;
        &:first-child {
          font-size: rem(25);
          color: #18191a;
          line-height: rem(40);
          font-weight: bold;
        }
        &:last-child {
          font-size: rem(18);
          color: #444547;
          margin-top: rem(6);
        }
      }
    }
  }
  .common_list {
    background-color: #ffffff;
  }
  .loginOut {
    width: 100%;
    height: rem(44);
    background-color: #fff;
    line-height: rem(44);
    text-align: center;
    font-size: rem(17);
    color: #0139a4;
    margin-top: rem(30);
  }
  .footer{
    position: absolute;
    width: 100%;
    bottom: rem(60);
    text-align: center;
    font-size: rem(12);
    div {
      padding: rem(2) 0;
    }
    .ft-link {
      color: #0139A4;
    }
  }
}
</style>

