<template>
  <div id="login"
       v-bind:style="{backgroundImage: 'url(' + backgroundImg + ')'}">
    <div class="login-wrap"
         v-if="islogin">
      <div class="lw-head">
        <div><img src="../../assets/logo-blue.png"></div>
        <p>{{businessName}}商业资产管理系统</p>
        <p class="small">Elephant Commercial Assets Management System</p>
      </div>
      <el-form :model="login"
               :rules="rules"
               ref="ruleForm">
        <div class="lw-content">
          <p>企业代码</p>
          <el-form-item prop="code">
            <el-input v-model="login.code"
                      disabled
                      type="text"
                      placeholder="企业代码"></el-input>
          </el-form-item>
          <el-form-item prop="username">
            <el-input v-model="login.username"
                      type="text"
                      placeholder="用户名"
                      @focus="errorClear"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="login.password"
                      placeholder="密码"
                      type="password"></el-input>
          </el-form-item>
          <el-checkbox v-model="checked">记住密码</el-checkbox>
          <span class="forget-password"
                @click="forgetPwd">忘记密码？</span>
          <div class="tip">{{tip}}</div>
          <div class="yw-btn"
               @click="onLogin">
            登录
          </div>
          <el-checkbox v-model="readed"
                       class="agreement"><span class="agreement-text">我已认真阅读并接受</span><span class="agreement-link"
                  @click.stop.prevent="UserAgreement">《ecams用户服务协议》</span></el-checkbox>
        </div>
      </el-form>
    </div>
    <div class="login-wrap index-change"
         v-else>
      <div class="forget-head">
        <h2>忘记密码</h2>
      </div>
      <div class="ft-content">
        <changePassword :loginCode="login.code"
                        @setLoginCode="setLoginCode"
                        ref="changepwd"
                        @goback="goback" />
        <div class="confirm-btn"
             @click="confirm('ruleForm')">确定</div>
        <div>
          <span class="back"
                @click="islogin=true">《 返回登录</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import context from '@/service'
import changePassword from '../home/components/changePassword'
// import JSEncrypt from 'jsencrypt/bin/jsencrypt'
import backgroundImg from '../../assets/background.png'
export default {
  name: 'login',
  path: '/login',
  keepAlive: false,
  components: {
    changePassword
  },
  data () {
    return {
      businessName: '小象',
      username: '',
      password: '',
      checked: false,
      readed: false,
      login: {
        username: '',
        password: '',
        code: 'qibao'
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
      islogin: true,
      backgroundImg: backgroundImg
    }
  },
  created () {
    let host = window.location.host
    let index = host.indexOf('.')
    host = host.substring(0, index)
    if (host) {
      this.corporateCustomers(host)
    }
  },
  mounted () {
    sessionStorage.token = ''
    this.readed = !!localStorage.getItem('readed')
    this.login.username = localStorage.getItem('login.username')
    this.login.password = localStorage.getItem('login.password')
    if (this.login.username && this.login.password) {
      this.checked = true
    }
    let _this = this
    document.onkeydown = function (e) {
      var ev = document.all ? window.event : e
      if (ev.keyCode === 13) {
        _this.onLogin()
      }
    }
  },
  computed: {
    canSubmit () {
      return this.login.username && this.login.password && this.login.username.length > 0 && this.login.password.length > 0 && this.login.code.length > 0 && this.readed
    }
  },
  methods: {
    setLoginCode (val) {
      this.login.code = val
    },
    goback () {
      this.islogin = true
    },
    showError (msg) {
      this.errStatus = true
      this.tip = msg
    },
    errorClear () {
      this.errStatus = false
      this.tip = ''
    },
    forgetPwd () {
      this.islogin = false
    },
    confirm (ruleForm) {
      this.$refs.changepwd.forgetPwd(ruleForm)
    },
    async onLogin () {
      if (this.login.code) {
        if (!await context.user.corporateCustomers(this.login.code)) {
          return
        }
      }
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (!this.readed) {
            this.$message.error('请阅读《ecams用户服务协议》，同意并勾选')
            return
          }
          // 密码加密
          let encryptor = new JSEncrypt() // 新建JSEncrypt对象

          let publicKey = localStorage.getItem('publicKey')

          encryptor.setPublicKey(publicKey) // 设置公钥

          let rsaPassWord = encryptor.encrypt(this.login.password) // 对需要加密的数据进行加密
          // 判断企业代码查询企业客户
          localStorage.setItem('tenantKey', this.login.code.replace(' ', ''))
          context.user.login(this.login.username, rsaPassWord).then(({ res, onNotice, err }) => {
            if (res) {
              // 给读卡端使用
              sessionStorage.setItem('login.password', this.login.password)
              sessionStorage.setItem('login.username', this.login.username)

              sessionStorage.setItem('companyCode', this.login.code)
              localStorage.setItem('readed', true)
              if (this.checked) {
                localStorage.setItem('login.password', this.login.password)
                localStorage.setItem('login.username', this.login.username)
              } else {
                localStorage.removeItem('login.password')
                localStorage.removeItem('login.username')
              }
              localStorage.navId = 0
              if (onNotice) {
                this.openNotice()
                return
              }
              this.$router.replace({ name: 'workbench' })
            } else if (err.error_description === 'No value present') {
              this.showError('账号不存在')
            } else {
              this.$message.error(err.error_description)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    corporateCustomers (code) {
      context.http.get('/ywm/api/corporate-customers/companyCode', { companyCode: code }).then(result => {
        if (result.status === 200) {
          this.login.code = code
          this.businessName = result.data.companyShortName
          if (result.data.background) {
            this.backgroundImg = result.data.background
          }
        }
      })
    },
    openNotice () {
      this.$confirm('自动检测到您的账户已经很久没有更换过登录密码，为了安全起见，建议您定期更换登录密码', '系统提示', {
        confirmButtonText: '知道了',
        cancelButtonText: '不再提示',
        center: true,
        showClose: false,
        closeOnClickModal: false
      }).then(() => {
        this.$router.replace({ name: 'workbench' })
      }).catch(() => {
        this.updatePasswordDate()
        this.$router.replace({ name: 'workbench' })
      })
    },
    updatePasswordDate () {
      context.http.get('/uaa/api/account/updatePasswordDate').then(result => {
        console.log(result)
      })
    },
    UserAgreement () {
      const domain = window.location.protocol
      if (domain === 'https:') {
        window.open('https://www.ecams.pro/h5/src/UserAgreement.html')
      } else {
        window.open('http://192.168.1.186:81/h5/src/UserAgreement.html')
      }
    }
  }
}
</script>
<style lang="scss">
@import "../../style/config";

#login {
  background: url(../../assets/background.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-color: #2d333d;
  display: flex;
  justify-content: flex-end;
  padding-top: 100px;
  width: 100%;
  // height: 100%;
  .login-wrap {
    width: 410px;
    height: 640px;
    background-color: $color-white;
    opacity: 0.95;
    margin-right: 136px;
    border-radius: 4px;
    .lw-head {
      height: 170px;
      border-bottom: 1px solid #dfe5ee;
      div {
        display: flex;
        align-content: center;
        justify-content: center;
        padding-top: 50px;
        font-size: 30px;
      }
      img {
        margin-right: 20px;
      }
      p {
        font-size: 20px;
        font-weight: bold;
        margin-top: 20px;
        text-align: center;
      }
      p:last-child {
        font-size: 14px;
        font-weight: normal;
        color: #000;
        margin-top: 10px;
      }
    }
    .lw-content {
      width: 90%;
      height: 270px;
      margin: 0 auto;
      margin-top: 40px;
      p {
        margin-bottom: 10px;
      }
      .el-input {
        padding-bottom: 10px;
        .el-input__inner {
          height: 52px !important;
        }
      }
      .yw-btn {
        height: 50px;
        line-height: 50px;
        color: #eff2f9;
        font-size: 16px;
        margin-top: 14px;
        background-color: #edb643;
        text-align: center;
        border-radius: 2px;
        cursor: pointer;
        &:hover {
          background-color: #edc743;
        }
      }
      .tip {
        color: red;
        margin-top: 10px;
      }
      .forget-password {
        float: right;
        color: #edb643;
        cursor: pointer;
      }
      .agreement {
        margin-top: 8px;
      }
      .agreement-text {
        color: #333;
      }
      .agreement-link {
        color: #3575f6;
      }
    }
  }
  .title {
    text-align: center;
    color: $color-blue;
    font-size: rem(72);
    padding-top: rem(150);
    img {
      width: rem(198);
    }
  }
  .input {
    display: flex;
    align-items: center;
    border-bottom: $style-border;
    padding-top: rem(120);
    padding-bottom: rem(10);
    img {
      width: rem(40);
    }
    input {
      flex: 1;
      margin-left: rem(44);
      font-size: rem(30);
    }
  }
  .submit {
    margin-top: rem(110);
    margin-bottom: rem(50);
  }
  .forget {
    text-align: right;
    color: $color-blue-1;
    font-size: rem(24);
  }
  .forget-head {
    height: 88px;
    line-height: 88px;
    text-align: center;
  }
  .ft-content {
    width: 90%;
    margin: 0 auto;
    .el-form-item {
      margin-bottom: 10px !important;
    }
  }
  .confirm-btn {
    width: 33%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background-color: #3577f6;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
    margin: 0 auto;
    margin-top: 40px;
  }
  .back {
    color: #409eff;
    cursor: pointer;
    font-size: 12px;
  }
  .index-change {
    .el-form-item {
      margin-bottom: 20px !important;
    }
  }
}
</style>
