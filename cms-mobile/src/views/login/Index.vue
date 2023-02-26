<template>
  <div id="login">
    <div class="logo">
      <img src="../../assets/logo.png" />
    </div>
    <div class="login-wrap">
      <div class="lw-content"
           @touchend.stop="checkUse()">
        <!-- <mt-field placeholder="请输入企业代码"
                  type="text"
                  v-model="companyCode"
                  :class="{'focus': isfocus}"
                  @input.native="checkUse()"
                  @focus.native.capture="focusHandler(1)"
                  @blur.native.capture="blurHandler(1)"></mt-field> -->
        <mt-field placeholder="请输入用户名"
                  type="text"
                  v-model="login.username"
                  :class="{'focus': isfocus2}"
                  @input.native="checkUse()"
                  @focus.native.capture="focusHandler(2)"
                  @blur.native.capture="blurHandler(2)"></mt-field>
        <mt-field placeholder="请输入密码"
                  :type="pwdType"
                  :class="{'focus': isfocus3}"
                  v-model="login.password"
                  class="eyewp"
                  @input.native="checkUse()"
                  @focus.native.capture="focusHandler(3)"
                  @blur.native.capture="blurHandler(3)">
          <i class="eye-img iconfont"
             v-bind:class="[pwdType === 'text' ? 'iconcms_chakan-' : 'iconcms_biyan']"
             @click="changeConfirmType"></i>
        </mt-field>
        <div class="yw-btn"
             @click="onLogin"
             :class="{'abled': abled}">
          登录
        </div>
        <div class="lw-footer">
          <div class="user_regist">
            <span @click="userRegist">新用户注册</span>
          </div>
          <div class="line"></div>
          <div class="forgot_password">
            <span @click="finPwd">忘记密码</span>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="login-footer" v-show="showFooter">
      登录即代表您已同意<span @click="UserAgreement">《用户使用协议》</span><span @click="PrivacyPolicy">《隐私政策》</span>
    </div> -->
    <van-action-sheet v-model="showPopup" :actions="companyList" @select="onSelect" />
    <!-- 用户协议弹框 -->
    <van-popup v-model="showPopupTip">
      <div class="popupTip">
        <div class="popupScroll">
          <div class="scrollName">温馨提示</div>
          <div class="scrollInfo">
            1.为给您提供发布服务，我们可能会申请手机存储权限、摄像头权限、麦克风权限；<br/>
            2.为了基于您所在的位置向您推荐内容，我们可能会申请您的位置权限；<br/>
            3.为了信息推送和账号安全，我们会申请系统设备权限收集设备信息、日志信息；<br/>
            4.我们会努力采取各种安全技术保护您的个人信息，未经您同意，我们不会从第三方获取、共享或对外提供您的信息；<br/>
            5.您还可以访问、更正、删除您的个人信息，我们也将提供注销、投诉方式。<br/>
            你可阅读<span @click="UserAgreement">《用户使用协议》</span>和<span @click="PrivacyPolicy">《隐私政策》</span>了解详细信息。如你同意，请点击“同意”开始接受我们的服务。<br/>
            <!-- 请你务必阅读、充分理解<span @click="UserAgreement">《用户使用协议》</span>和<span @click="PrivacyPolicy">《隐私政策》</span>各条款，包括但不限于：为了向你提供通讯、内容分享等服务，我们需要收集你的设备信息、操作日志等个人信息。你可以在“隐私设置”中查看、变更、删除你的个人信息并管理你的授权。
            <br/>
            你可阅读<span @click="UserAgreement">《用户使用协议》</span>和<span @click="PrivacyPolicy">《隐私政策》</span>了解详细信息。如你同意，请点击“同意”开始接受我们的服务。 -->
          </div>
        </div>
        <div class="popupButton">
          <div @click="agreeButton('no')">不同意</div>
          <div @click="agreeButton('agree')">同意</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import context from '@/service'
// import JSEncrypt from 'jsencrypt/bin/jsencrypt'
import { Toast } from 'mint-ui'
export default {
  name: 'login',
  path: '/login',
  keepAlive: false,
  components: {
  },
  data () {
    return {
      abled: false,
      isfocus: false,
      isfocus2: false,
      isfocus3: false,
      showPopupTip: false,
      pwdType: 'password',
      username: '',
      password: '',
      login: {
        username: '',
        password: '',
        code: ''
      },
      rules: {
        code: [
          { required: true, message: '请输入企业代码', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      tip: '',
      errStatus: '',
      showPopup: false,
      companyList: [],
      selected: ''
      // showFooter: true
    }
  },
  created () {
    // let host = window.location.host
    // let index = host.indexOf('.')
    // host = host.substring(0, index)
    // if (host) {
    //   this.corporateCustomers(host)
    // }
  },
  mounted () {
    localStorage.token = ''
    this.companyCode = localStorage.getItem('companyCode')
    this.login.username = localStorage.getItem('login.username')
    this.login.password = localStorage.getItem('login.password')
    this.checked = true
    this.checkUse()
    this.h = document.body.scrollHeight
    window.addEventListener('resize', this.listenResize, true)
    // 用户协议弹框未点击同意 需弹出
    let agreeProtocol = localStorage.getItem('agreeProtocol')
    if (agreeProtocol === 'no' || !agreeProtocol) {
      this.showPopupTip = true
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.listenResize)
  },
  computed: {
    canSubmit () {
      return this.login.username && this.login.password && this.login.username.length > 0 && this.login.password.length > 0 && this.companyCode.length > 0
    }
  },
  methods: {
    agreeButton (type) {
      localStorage.setItem('agreeProtocol', type)
      if (type === 'no') {
        // 不同意需退出app
        console.log(type)
        this.showPopupTip = false
      } else {
        this.showPopupTip = false
      }
    },
    listenResize () {
      // if (document.body.scrollHeight < this.h) {
      //   this.showFooter = false
      // } else {
      //   this.showFooter = true~
      // }
    },
    checkUse () {
      if (this.login.username && this.login.password) {
        this.abled = true
      } else {
        this.abled = false
      }
    },
    focusHandler (type) {
      if (type === 1) {
        this.isfocus = true
      } else if (type === 2) {
        this.isfocus2 = true
      } else {
        this.isfocus3 = true
      }
    },
    blurHandler (type) {
      if (type === 1) {
        this.isfocus = false
      } else if (type === 2) {
        this.isfocus2 = false
      } else {
        this.isfocus3 = false
      }
    },
    changeConfirmType () {
      this.pwdType = this.pwdType === 'password' ? 'text' : 'password'
    },
    finPwd () {
      this.$router.push({ path: '/password' })
    },
    userRegist () {
      this.$router.push({ path: '/registered' })
    },
    errorClear () {
      this.errStatus = false
      this.tip = ''
    },
    onSelect (item) {
      this.companyCode = item.companyCode
      this.onLogin1()
    },
    async getAccount () {
      let result = await context.http.get(`ywm/api/corporate-customers/account?account=${this.login.username}`)
      if (result.status === 200) {
        this.companyList = result.data
        if (this.companyList.length > 0) {
          this.companyList.forEach(item => {
            item.name = item.companyName
          })
          return this.companyList
        } else if (this.companyList.length === 0) {
          this.$toast('账号不存在')
        }
      }
    },
    async onLogin () {
      if (!this.abled) return
      let agreeProtocol = localStorage.getItem('agreeProtocol')
      if (agreeProtocol === 'no') {
        this.showPopupTip = true
        return
      }
      if (this.login.username === 'admin' || this.login.username === 'ADMIN') {
        Toast('账号不存在')
        return
      }
      let companyList = await this.getAccount()
      if (!companyList) return
      if (companyList.length > 1) {
        this.showPopup = true
      } else {
        this.companyCode = companyList[0].companyCode
        this.onLogin1()
      }
    },
    async onLogin1 () {
      // if (!this.abled) return
      if (this.companyCode) {
        if (!await context.user.corporateCustomers(this.companyCode)) {
          return
        }
      }
      if (this.companyCode && this.login.username && this.login.password) {
        // 密码加密
        let encryptor = new JSEncrypt() // 新建JSEncrypt对象

        let publicKey = localStorage.getItem('publicKey')

        encryptor.setPublicKey(publicKey) // 设置公钥

        let rsaPassWord = encryptor.encrypt(this.login.password) // 对需要加密的数据进行加密
        // 判断企业代码查询企业客户
        localStorage.setItem('tenantKey', this.companyCode.replace(' ', ''))
        this.abled = false
        context.user.login(this.login.username, rsaPassWord).then(({ res, onNotice, err }) => {
          if (res) {
            if (this.checked) {
              localStorage.setItem('companyCode', this.companyCode)
              localStorage.setItem('login.username', this.login.username)
              localStorage.setItem('login.password', this.login.password)
            } else {
              localStorage.setItem('companyCode', this.companyCode)
              localStorage.removeItem('login.password')
              localStorage.removeItem('login.username')
            }
            if (onNotice) {
              this.openNotice()
              return
            }
            this.$router.replace({ name: 'index' })
            this.abled = true
          } else if (err.error_description === 'No value present') {
            Toast('账号不存在')
          } else {
            Toast({
              message: err.error_description,
              position: 'top'
            })
          }
        })
      }
    },
    corporateCustomers (code) {
      context.http.get('ywm/api/corporate-customers/companyCode', { companyCode: code }).then(result => {
        if (result.status === 200) {
          this.companyCode = code
          this.businessName = result.data.companyShortName
        }
      })
    },
    openNotice () {
      this.$dialog.confirm({
        title: '系统提示',
        message: '自动检测到您的账户已经很久没有更换过登录密码，为了安全起见，建议您定期更换登录密码',
        confirmButtonText: '知道了',
        cancelButtonText: '不再提示',
        center: true,
        showClose: false,
        closeOnClickModal: false
      }).then(() => {
        this.$router.replace({ name: 'index' })
      }).catch(() => {
        this.updatePasswordDate()
        this.$router.replace({ name: 'index' })
      })
    },
    updatePasswordDate () {
      context.http.get('uaa/api/account/updatePasswordDate').then(result => {
        console.log(result)
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
#login {
  width: 100%;
  height: 100%;
  background: #fff;
  display: inline-block;
  position: fixed;
  .logo {
    width: rem(200);
    height: rem(50);
    margin: rem(80) auto rem(50) auto;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .login-wrap {
    background-color: #fff;
    border-radius: rem(2);
    margin: 0 auto;
    padding: rem(15);
    // box-sizing: border-box;
    input {
      width: 100%;
      background-color: #fff;
      font-size: rem(14);
      padding: 0 rem(5);
      height: rem(20);
      line-height: rem(20);
      box-sizing: border-box;
      /*去除阴影*/
      box-shadow: none;
      /*聚焦input的蓝色边框*/
      outline: none;
      /*textarea 禁止拖拽*/
      resize: none;
      /*去除边框*/
      border: none;
      /*常用于IOS下移除原生样式*/
      -webkit-appearance: none;
      /*点击高亮的颜色*/
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    .input1,
    .input2,
    .input3 {
      &.underline {
        border-bottom: rem(1) solid #0139a4;
        ~ .eyewp {
          border-bottom: rem(1) solid #0139a4;
        }
      }
    }
    .yw-btn {
      height: rem(44);
      line-height: rem(44);
      color: #eff2f9;
      font-size: rem(17);
      margin-top: rem(50);
      background-color: #d9d9d9;
      text-align: center;
      border-radius: rem(4);
      cursor: pointer;
      &.abled {
        background-color: #0139a4;
      }
    }
    .eye-img {
      width: rem(20);
      height: rem(13);
      font-size: rem(14);
      display: inline-block;
      // background: url('../../assets/openeyes.png') no-repeat center center!important;
      background-size: contain;
      margin-left: rem(16);
    }
    .el-icon-confirm {
      // background: url('../../assets/closeeyes.png') no-repeat center center!important;
      background-size: contain;
    }
    .pwdwarp,
    .uni-form-item {
      display: flex;
      justify-content: space-between;
      > input {
        width: 90%;
      }
      .delwp {
        width: 10%;
        border-bottom: 1 solid #d9d9d9;
      }
      .eyewp {
        width: 10%;
        height: rem(120);
        line-height: rem(120);
        text-align: right;
        border-bottom: 1 solid #d9d9d9;
        i {
          margin-right: rem(12);
        }
      }
    }
  }
  .lw-content .mint-cell-wrapper {
    padding: 0;
    // background-image: none;
    border-bottom: rem(1) solid #d9d9d9;
  }
  .lw-content {
    .mint-cell {
      font-size: rem(15);
      min-height: rem(50) !important;
      .mint-cell-wrapper {
        background-image: none !important;
      }
    }
  }
  .focus {
    .mint-cell-wrapper {
      border-bottom: rem(1) solid #0139a4;
    }
  }
  input {
    font-size: rem(15);
  }
  .popupSelect{
    margin-top: rem(20);
  }
  .popup-bottom{
    margin-top: rem(20);
    display: flex;
    justify-content: space-around;
    span {
      &:last-child {
        color:#0139a4;
      }
    }
  }
  .lw-footer{
    display: flex;
    justify-content: space-around;
    margin-top: rem(30);
    color: #0139a4;
    .line{
      width: rem(1);
      height: rem(18);
      background: #D9D9D9;
    }
  }
  .forgot_password {
    text-align: right;
    color: #0139a4;
    font-size: rem(14);
  }
  .login-footer{
    position: absolute;
    width: 100%;
    text-align: center;
    bottom: rem(20);
    font-size: rem(12);
    span {
      color: #0139A4;
    }
  }
  .popupTip{
    width: rem(270);
    height: rem(520);
    border-radius: rem(60);
    background-color: #fff;
    padding: rem(26);
    .popupScroll {
      height: rem(444);
      // padding: rem(26);
      text-align: center;
      .scrollName {
        font-weight: 600;
      }
      .scrollInfo {
        text-align: left;
        height: rem(390);
        margin-top: rem(8);
        // overflow: hidden;
        overflow: auto;
        >span {
          color: #0139A4;
        }
      }
    }
    .popupButton {
      width: 100%;
      color: #B7B7B7;
      text-align: center;
      display: flex;
      >div {
        width: rem(100);
        height: rem(40);
        line-height: rem(40);
        border-radius: rem(20);
        font-weight: 600;
      }
      >div:first-child {
        border: rem(1) solid #A3A3A3;
      }
      >div:last-child {
        margin-left: rem(10);
        color: #fff;
        background-color: #0139A4;
      }
    }
  }
}
</style>
