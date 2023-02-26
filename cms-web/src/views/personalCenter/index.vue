<template>
  <div class="personal-center">
    <span class="page_head_title">个人中心</span>
    <div class="pc-content">
      <div class="half_page_title"
           style="width:100%">
        <div><i></i>基本信息</div>
        <div @click="edit"
             v-if="noedit">
          <i class="iconfont icon-cms_bianji-">编辑</i>
        </div>
        <div class="form_save_btns"
             v-if="!noedit">
          <span @click="noedit=true;openAccount()">取消</span>
          <span @click="saveInfo">保存</span>
        </div>
      </div>
      <div class="main_content">
        <div class="head-portrait">
          <div class="hp-img"
               v-if="userInfo.facialPhoto">
            <img :src="userInfo.facialPhoto">
            <div class="upload"
                 v-if="!noedit"
                 css>
              <span class="uploadbtn">更换头像</span>
              <input type="file"
                     @change="imageChange($event)"
                     accept="image/png, image/jpeg">
            </div>
          </div>
          <div class="hp-img default-hportrait"
               v-else>
            <span class="">{{formatName(userInfo.name)}}</span>
            <div class="upload"
                 v-if="!noedit"
                 css>
              <span class="uploadbtn">更换头像</span>
              <input type="file"
                     @change="imageChange($event)"
                     accept="image/png, image/jpeg">
            </div>
          </div>
        </div>
        <div class="pc-info">
          <div class="">
            <p>姓名</p>
            <p>{{userInfo.name}}</p>
          </div>
          <div class=""
               v-if="noedit">
            <p>英文名</p>
            <p>{{userInfo.englishName}}</p>
          </div>
          <div class="pi-name"
               v-else>
            <span>英文名</span> <span>姓氏</span>
            <p>
              <input type="text"
                     v-model="userInfo.englishName" />
              <input type="text"
                     v-model="userInfo.englishSurname" />
            </p>
          </div>
          <div class="">
            <p>岗位</p>
            <p>
              <span v-if="userInfo.userPostManagements && userInfo.userPostManagements.length">{{userPostNameFormat(userInfo.userPostManagements)}}</span>
            </p>
          </div>
          <div class="">
            <p>组织</p>
            <p>
              <span v-if="userInfo.userPostManagements && userInfo.userPostManagements.length">{{userInfo.userPostManagements[0].organize.name}}</span>
            </p>
          </div>
          <div class="">
            <span>手机号</span><span class="editspan"
                  v-if="!noedit"
                  @click="dialogFormVisible=true">更换手机号</span>
            <p>{{userInfo.telephone}}</p>
          </div>
          <div class="">
            <p>企业邮箱</p>
            <p>{{userInfo.email}}</p>
          </div>
          <div class="">
            <p>直属领导</p>
            <p>{{userInfo.leadershipName}}</p>
          </div>
          <div class="">
            <p>工作地点</p>
            <p>{{userInfo.workPlaceValue}}</p>
          </div>
        </div>
        <!-- <div class="editwrap">
          <div class="edit-btn"
               @click="edit"
               v-if="noedit">
            <span>编辑</span>
          </div>
          <div class="edit-btn"
               @click="saveInfo"
               v-else>
            <span>保存</span>
          </div>
        </div> -->
      </div>
    </div>
    <div class="pc-content">
      <div class="half_page_title"
           style="width:100%">
        <div><i></i>安全设置</div>
      </div>
      <div class="safe_part">
        <div>
          <span>登录密码</span>
          <span @click="openShowDialog('loginPassword')"
                class="underline">修改</span>
        </div>
        <div>
          <span>操作密码</span>
          <span @click="openShowDialog('businessPassword')"
                class="underline">设置</span>
        </div>
      </div>
    </div>
    <el-dialog title="更换手机号"
               :visible.sync="dialogFormVisible">
      <el-form :model="formOpenact"
               :rules="rule1"
               ref="formOpenact">
        <el-form-item :label-width="formLabelWidth"
                      prop="telephone">
          <div>新手机号</div>
          <el-input v-model="formOpenact.telephone"
                    size="small"
                    placeholder="请输入新手机号"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth"
                      prop="verificationCode">
          <div>验证码</div>
          <el-input v-model="formOpenact.verificationCode"
                    size="small"
                    placeholder="请输入验证码"
                    class="codeinput"></el-input>
          <span class="verificationCode"
                style="margin-left: 10px;top:20px"
                @click="getVerificationCode('formOpenact')">{{codeTip}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="replaceTelephone('formOpenact')"
                   class="defaultbtn dialog-confirmBtn">确 认</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="changePasswordTitle"
               class="changePassWordDialog"
               :close-on-click-modal=false
               :close-on-press-escape=false
               :visible.sync="showDialog">
      <changePassword @closeDialog="closeDialog"
                      :telephone="userInfo.telephone"
                      :operationType="operationType"
                      ref="changepwd" />
      <div slot="footer"
           class="slotfooter">
        <span @click="closeDialog"
              class="details_cannelBtn">取消</span>
        <span @click="confirm('ruleForm')"
              class="details_submitBtn">确定</span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
import changePassword from '../home/components/changePassword1'
export default {
  name: 'personalcenter',
  components: {
    changePassword
  },
  data () {
    var validateTel = (rule, value, callback) => {
      let reg = /^1[23456789]\d{9}$/
      let reg2 = /\s+/g
      if (value === '' || value === undefined) {
        callback(new Error('请输入手机号'))
      } else if (!reg.test(value) || reg2.test(value)) {
        callback(new Error('格式错误'))
      } else {
        callback()
      }
    }
    var validateVerificationCode = (rule, value, callback) => {
      let reg = /^\d{6}$/
      let reg2 = /\s+/g
      if (value === '' || value === undefined) {
        callback(new Error('请输入验证码'))
      } else if (!reg.test(value) || reg2.test(value)) {
        callback(new Error('验证码错误'))
      } else {
        callback()
      }
    }
    return {
      operationType: 'loginPassword', // 操作类型 修改登录密码or设置操作密码
      changePasswordTitle: '修改登录密码',
      showDialog: false,
      noedit: true,
      dialogFormVisible: false,
      formOpenact: { telephone: '', userId: '', verificationCode: '' },
      formLabelWidth: '120px',
      errorField: false,
      time: 0,
      codeTip: '获取验证码',
      codeReadonly: false,
      userInfo: {},
      rule1: {
        telephone: [
          { validator: validateTel, trigger: 'blur' }
        ],
        verificationCode: [
          { validator: validateVerificationCode, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.openAccount()
    // this.userInfo = this.$store.state.staffInfo
    // this.formOpenact.userId = this.userInfo.id
  },
  methods: {
    userPostNameFormat (list) {
      const arr = list.map(item => {
        return item.userPostName
      })
      return arr.join('兼')
    },
    confirm (ruleForm) {
      this.$refs.changepwd.changePwd(ruleForm)
    },
    openShowDialog (type) {
      if (type === 'loginPassword') { // 修改登录密码
        this.changePasswordTitle = '修改登录密码'
      } else if (type === 'businessPassword') { // 设置操作密码
        this.changePasswordTitle = '设置操作密码'
      }
      this.operationType = type
      this.showDialog = true
      this.$nextTick(() => {
        this.$refs.changepwd.addDataReset()
      })
    },
    closeDialog () {
      this.showDialog = false
    },
    edit () {
      this.noedit = !this.noedit
    },
    formatName (name) {
      if (name) {
        return name.length > 2 ? name.substring(name.length - 2) : name
      }
    },
    async openAccount () {
      let result = await context.http.get('uaa/api/account/user')
      this.userInfo = result.data
      this.formOpenact.userId = this.userInfo.id
    },
    getVerificationCode (formName) {
      if (this.codeReadonly) {
        return false
      }
      let _this = this
      this.$refs[formName].validateField('telephone', (message) => {
        if (!message.length) {
          context.http.get('mps/api/sms/code', { telephone: this.formOpenact.telephone, smsEnum: 'R' }).then(res => {
            if (res.status === 201) {
              _this.time = 60
              _this.onTimer()
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
    async validateCodeByMps () {
      let validateResult = false
      try {
        let result = await context.http.get('mps/api/sms/verification/code', { telephone: this.formOpenact.telephone, code: this.formOpenact.verificationCode })
        if (result.status === 200 && result.data === true) {
          this.userInfo.telephone = this.formOpenact.telephone
          this.saveInfo()
          validateResult = true
        } else {
          console.info('验证码后台验证不通过！！！！')
        }
      } catch (error) {
        console.info('验证码后台验证不通过：', error.response.data.message)
      }
      return validateResult
    },
    async replaceTelephone (formName) {
      // 表单验证
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          console.info('填写内容验证不通过')
          return false
        }
      })
      // 后台验证
      let ss = await this.validateCodeByMps()
      if (!ss) {
        return false
      }
      this.formOpenact = { telephone: '', userId: '', verificationCode: '' }
      this.dialogFormVisible = false
    },
    async imageChange (event) {
      this.errorField = false
      let path = ''
      let files = event.target.files
      if (files.length > 0) {
        if (files[0].size > (1024 * 1024 * 3) || (files[0].type !== 'image/png' && files[0].type !== 'image/jpeg')) {
          this.errorField = true
          this.errorTip = '上传图片格式不正确'
          return
        }
        let form = new FormData()
        form.append('file', files[0])
        context.http.post('/ywm/api/image-multipart', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          path = res.data
          this.userInfo.facialPhoto = path
        }).catch(error => {
          console.info(error)
        })
      }
    },
    async saveInfo () {
      let putData = {
        id: this.userInfo.id,
        englishName: this.userInfo.englishName,
        englishSurname: this.userInfo.englishSurname,
        facialPhoto: this.userInfo.facialPhoto.length > 250 ? '' : this.userInfo.facialPhoto,
        telephone: this.userInfo.telephone
      }
      context.http.put('uaa/api/users/updateTelephone', putData).then(res => {
        if (res) {
          this.noedit = true
          this.$message({
            duration: 1000,
            message: '保存成功',
            type: 'success'
          })
          this.$emit('getUserInfo')
        }
      }, error => {
        console.log('保存失败：', error.response.data.detail)
        return false
      })
    }
  }
}
</script>
<style lang="scss">
.personal-center {
  background-color: #f9f9f9;
  .title {
    color: #333;
    font-size: 24px;
  }
  .pc-content {
    background-color: #fff;
    margin-bottom: 15px;
    border-radius: 4px;
    -moz-box-shadow: 0px 2px 4px #e5e5e5;
    -webkit-box-shadow: 0px 2px 4px #e5e5e5;
    box-shadow: 0px 2px 4px #e5e5e5;
    .main_content {
      height: 234px;
      display: flex;
      justify-content: flex-start;
    }
    .safe_part {
      display: flex;
      padding: 15px;
      justify-content: flex-start;
      > div {
        width: 50%;
        font-size: 14px;
        color: #777777;
        > span {
          &:last-child {
            cursor: pointer;
            margin-left: 15px;
            color: #3175f6;
          }
        }
      }
    }
  }
  .head-portrait {
    width: 102px;
    margin-left: 40px;
    padding-top: 36px;
    text-align: center;
    .hp-img {
      width: 100px;
      height: 100px;
      // border: 1px dashed #dfdfdf;
      border-radius: 50%;
      position: relative;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
    }
    .upload {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 26px;
      line-height: 0px;
      .uploadbtn {
        display: inline-block;
        width: 100%;
        height: 26px;
        line-height: 26px;
        text-align: center;
        cursor: pointer;
        font-size: 12px;
        background-color: rgba(0, 0, 0, 0.6);
        color: #fff;
      }
      input {
        position: absolute;
        top: 0;
        right: 0px;
        width: 100%;
        height: 26px;
        opacity: 0;
        cursor: pointer;
      }
    }
    .default-hportrait {
      background-color: #409eff;
      line-height: 90px;
      text-align: center;
      color: #fff;
      font-size: 24px;
    }
  }
  .pc-info {
    display: flex;
    justify-content: flex-start;
    align-content: space-between;
    flex-wrap: wrap;
    max-width: 1180px;
    width: 100%;
    height: 150px;
    margin-left: 90px;
    margin-top: 45px;
    div {
      height: 50px;
      width: 25%;
      p {
        font-size: 14px;
        color: #777777;
      }
      p:last-child {
        color: #262626;
        font-size: 14px;
        margin-top: 10px;
      }
    }
    .editspan {
      color: #3577f6;
      font-size: 12px;
      margin-left: 10px;
      cursor: pointer;
    }
    .pi-name {
      span:nth-of-type(2) {
        display: inline-block;
        margin-left: 30%;
      }
      input {
        border: 1px solid #dadada;
        border-radius: 4px;
        width: 45%;
        height: 32px;
        line-height: 32px;
      }
      input:last-child {
        width: 30%;
      }
    }
  }
  .editwrap {
    width: 15%;
    .edit-btn {
      float: right;
      width: 90px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      border: 1px solid #3577f6;
      border-radius: 10px;
      color: #3577f6;
      cursor: pointer;
      margin: 24px 20px 0 0;
      &:hover {
        background-color: #3577f6;
        color: #fff;
      }
    }
  }
  .line {
    display: inline-block;
    width: 36px;
    border-bottom: 1px solid #bbbbbd;
    margin-left: 70px;
    margin-right: 36px;
  }
  .el-dialog {
    width: 624px;
  }
  .el-form-item__content {
    .el-input {
      font-size: 12px;
    }
  }
  .el-dialog__header {
    padding-left: 0;
  }
  .codeinput {
    width: 398px;
  }
  .verificationCode {
    display: inline-block;
    width: 100px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    background-color: #f1f4ff;
    color: #3575f6;
    border-radius: 4px;
    margin-left: 10px;
    cursor: pointer;
    border: 1px solid rgba(159, 191, 255, 1);
    position: absolute;
    right: 0;
    top: 0;
    &.codeReadonly {
      background: rgba(250, 250, 250, 1);
      border: 1px solid rgba(231, 231, 231, 1);
      color: #777777;
    }
  }
  .changePassWordDialog {
    .el-dialog {
      background-color: #faf7fa;
      width: 500px;
      .el-dialog__header {
        padding: 0;
        margin: 0;
        height: 40px;
        line-height: 40px;
        background-color: #ffffff;
        padding-left: 15px;
        font-weight: bold;
        border: none;
        margin-bottom: 15px;
        .el-dialog__title {
          color: #262626;
          font-size: 16px;
        }
        .el-dialog__headerbtn {
          top: 10px;
          right: 15px !important;
        }
      }
      .el-dialog__body {
        margin: 0;
        overflow: auto;
        border: none;
        padding: 15px !important;
        background-color: #ffffff;
        &::-webkit-scrollbar {
          width: 4px !important;
          height: 4px !important;
        }
        &::-webkit-scrollbar-track {
          box-shadow: inset 0 0 6px #fff;
          background-color: #fff;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          box-shadow: inset 0 0 6px #cccccc;
        }
        .el-form-item__content {
          display: flex;
          > div:first-child {
            width: 100px;
            text-align: right;
            line-height: 32px;
            padding-right: 15px;
          }
          .el-form-item__error {
            left: 100px;
          }
        }
      }
      .el-dialog__footer {
        padding: 0;
        background-color: #ffffff;
        margin-top: 15px;
        .dialog-footer {
          height: 56px;
          display: flex;
          flex-direction: row-reverse;
          align-items: center;
        }
      }
    }
  }
}
</style>

