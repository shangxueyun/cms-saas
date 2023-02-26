<template>
  <div class="add-tenant">
    <div class="dl-content clearfix">
      <el-form :model="addData"
               ref="addData"
               :rules="addDataRules">
        <div class="dc-right">
          <div class="dr-head">基础信息</div>
          <div class="basic-item">
            <p>选择项目</p>
            <div class="basic-select">
              <div @click="choose('project')"
                   class="clearfix"
                   :class="selProject ? 'selectInput selectActive' : 'selectInput'">
                <img :src="chooseObj.previewImage" />
                <span>{{chooseObj.projectName}}</span>
                <span class="iconfont icon-xiala-"></span>
              </div>
              <ul v-if="selProject"
                  class="selectBox">
                <li @click="chooseItem('project', item)"
                    v-for="(item, index) in projectList"
                    :key="index">
                  <img :src="item.previewImage" />
                  <span>{{item.projectName}}</span>
                </li>
              </ul>
            </div>
            <!-- <div v-if="errorProject" class="errorpjTip">请选择项目</div> -->
          </div>
          <el-form-item>
            <div class="cttitle">客户类型</div>
            <el-select v-model="addData.customerType"
                       placeholder="请选择">
              <el-option v-for="item in customerOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="teantName">
            <div class="cttitle">客户名称<i class="required">*</i></div>
            <el-autocomplete v-model="addData.teantName"
                             :fetch-suggestions="searchTeantName"
                             placeholder="请输入内容"
                             @select="handleSelect"></el-autocomplete>
          </el-form-item>
          <el-form-item prop="referred"
                        style="margin-bottom: 20px;">
            <div class="cttitle">品牌<i class="required">*</i></div>
            <el-input v-model="addData.referred"
                      maxlength="30"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item prop="industryId"
                        style="margin-bottom: 20px;">
            <div class="cttitle">业态<i class="required">*</i></div>
            <el-select v-model="addData.industryId"
                       placeholder="请选择">
              <el-option v-for="item in industryOptions"
                         :key="item.id"
                         :label="item.value"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="contact"
                        style="margin-bottom: 20px;">
            <div class="cttitle">联系人<i class="required">*</i></div>
            <el-input v-model="addData.contact"
                      maxlength="20"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item prop="areaOptions"
                        style="margin-bottom: 20px;">
            <div class="cttitle">证件类型</div>
            <el-select v-model="addData.certificate"
                       placeholder="请选择">
              <el-option v-for="item in documentTypeOptions"
                         :key="item.id"
                         :label="item.value"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="iDNumber"
                        style="margin-bottom: 20px;">
            <div class="cttitle">证件号码</div>
            <el-input v-model="addData.iDNumber"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item prop="telephone">
            <div class="cttitle">手机号<i class="required">*</i></div>
            <el-input v-model="addData.telephone"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item prop="nowAddress">
            <div class="cttitle">现居住地址<i class="required">*</i></div>
            <el-input v-model="addData.nowAddress"
                      maxlength="100"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item prop="email">
            <div class="cttitle">邮箱</div>
            <el-input v-model="addData.email"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <!-- <el-form-item style="width: 97%">
            <div class="cttitle">客户标签</div>
            <el-input maxlength="50"
                      type="textarea"
                      resize="none"
                      ></el-input>
          </el-form-item> -->
        </div>
        <div class="dc-right">
          <div class="dr-head">工商信息<span @click="synchronization">同步工商信息</span></div>
          <el-form-item>
            <div class="cttitle">统一社会信用代码</div>
            <el-input v-model="addData.creditCode"
                      maxlength="50"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="cttitle">注册号</div>
            <el-input v-model="addData.no"
                      maxlength="50"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="cttitle">组织机构代码</div>
            <el-input v-model="addData.orgNo"
                      maxlength="50"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="cttitle">法定代表人</div>
            <el-input v-model="addData.operName"
                      maxlength="20"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="cttitle">国籍</div>
            <el-input v-model="addData.nationality"
                      maxlength="50"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="cttitle">注册资本/万元</div>
            <el-input v-model="addData.registCapi"
                      type="number"
                      maxlength="50"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="cttitle">经营状态</div>
            <el-input v-model="addData.status"
                      maxlength="50"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="cttitle">企业类型</div>
            <el-input v-model="addData.econKind"
                      maxlength="50"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="cttitle">人员规模</div>
            <el-input v-model="addData.staffSize"
                      maxlength="50"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="cttitle">成立日期</div>
            <el-date-picker v-model="addData.startDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <div class="cttitle">营业期限</div>
            <el-date-picker v-model="addData.teamEnd"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <div class="cttitle">核对日期</div>
            <el-date-picker v-model="addData.checkDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <div class="cttitle">登记机关</div>
            <el-input v-model="addData.belongOrg"
                      maxlength="50"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="cttitle">所属地区</div>
            <el-input v-model="addData.province"
                      maxlength="50"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="cttitle">所属业态</div>
            <el-input v-model="addData.companyIndustry"
                      maxlength="50"></el-input>
          </el-form-item>
          <el-form-item style="vertical-align: top;">
            <div class="cttitle">注册地址</div>
            <el-input v-model="addData.address"
                      maxlength="100"></el-input>
          </el-form-item>
          <el-form-item style="width: 96.5%">
            <div class="cttitle">经营范围</div>
            <el-input v-model="addData.scope"
                      maxlength="1000"
                      type="textarea"
                      resize="none"></el-input>
          </el-form-item>
        </div>
        <div class="dc-right invoice-information"
             style="margin-bottom: 100px;">
          <div class="dr-head">开票信息</div>
          <el-form-item>
            <div class="cttitle">开户银行</div>
            <el-input v-model="addData.depositBank"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item style="margin-bottom: 20px;">
            <div class="cttitle">银行账号</div>
            <el-input v-model="addData.bankAccount"
                      maxlength="50"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item style="margin-bottom: 20px;">
            <div class="cttitle">纳税人识别号</div>
            <el-input v-model="addData.taxNo"
                      maxlength="50"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item style="margin-bottom: 20px;">
            <div class="cttitle">电话</div>
            <el-input v-model="addData.phone"
                      type="tel"
                      maxlength="50"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item style="margin-bottom: 20px;width: 63%">
            <div class="cttitle">开票地址</div>
            <el-input v-model="addData.taxAddress"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <el-dialog title=""
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               width="30%"
               :show-close="false"
               center
               append-to-body>
      <div style="height: 100px;line-height: 100px;text-align: center">
        该项目下已存在此客户，是否继续添加
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addTenant">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
export default {
  props: {
    addDataFromPotClienDtl: { // 来自意向合同页面的数据
      type: Object,
      default: {
        teantName: null,
        referred: null
      }
    }
  },
  data () {
    var _this = this
    var validateIDNumber = (rule, value, callback) => {
      if (_this.addData.certificate === 2) {
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        if (!reg.test(value)) {
          callback(new Error('请输入正确的身份证号码'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      addData: {
        operName: '',
        depositBank: '',
        bankAccount: '',
        taxNo: '',
        phone: '',
        startDate: '',
        teamEnd: '',
        checkDate: ''
      },
      industryOptions: [],
      customerOptions: [
        {label: '请选择', value: ''},
        {label: '企业', value: 'COMPANY'},
        {label: '个人', value: 'PERSONAL'}
      ],
      addDataRules: {
        teantName: [
          { required: true, message: '请输入客户名称', trigger: 'blur' }
        ],
        referred: [
          { required: true, message: '请输入品牌', trigger: 'blur' }
        ],
        industryId: [
          { required: true, message: '请选择业态', trigger: 'change' }
        ],
        iDNumber: [
          { validator: validateIDNumber, trigger: 'blur' }
        ],
        email: [
          { pattern: /^([a-zA-Z]|[0-9])(\w|\/-)+@[a-zA-Z0-9_-]+\.([a-zA-Z]{2,4})$/, message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        telephone: [
          { required: true, pattern: /^1[23456789]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        nowAddress: [
          { required: true, message: '请输入现居住地址', trigger: 'blur' }
        ]
      },
      documentTypeOptions: {},
      center: [],
      selHourse: false,
      selProject: false,
      dialogVisible: false,
      chooseObj: {},
      projectList: [],
      selectItem: {}
    }
  },
  mounted () {
    this.documentType()
    this.industry()
    this.queryProjectList()
  },
  methods: {
    async searchTeantName (queryString, callback) {
      var list = [{}]
      if (!queryString || queryString === '') {
        return false
      }
      let result = await context.http.get('/qichacha/ECIV4/Search', { key: '2f3415aa9d1c4201837f8ca4215b91eb', keyWord: queryString })
      if (result.data.Status === '200') {
        var results = result.data.Result
        for (let i of results) {
          i.value = i.Name  // 将想要展示的数据作为value
        }
        list = result.data.Result
        callback(list)
      }
    },
    async handleSelect (item) {
      let keyWord = ''
      if (!this.addData.teantName || this.addData.teantName === '') {
        return false
      }
      if (!item.Name) {
        keyWord = this.addData.teantName
      } else {
        keyWord = item.Name
      }
      this.selectItem = item
      let result = await context.http.get('/qichacha/ECIV4/GetFullDetailsByName', { key: '2f3415aa9d1c4201837f8ca4215b91eb', keyWord: keyWord })
      if (result.data.Status === '200') {
        let fullDetails = result.data.Result
        this.addData.creditCode = fullDetails.CreditCode
        this.addData.no = fullDetails.No
        this.addData.orgNo = fullDetails.OrgNo
        this.addData.operName = fullDetails.OperName
        this.addData.registCapi = fullDetails.RegistCapi
        this.addData.status = fullDetails.Status
        this.addData.econKind = fullDetails.EconKind
        this.addData.startDate = this.formatDate(fullDetails.StartDate)
        this.addData.teamEnd = this.formatDate(fullDetails.TeamEnd)
        this.addData.checkDate = this.formatDate(fullDetails.CheckDate)
        this.addData.belongOrg = fullDetails.BelongOrg
        this.addData.province = fullDetails.Province
        this.addData.companyIndustry = fullDetails.Industry.Industry
        this.addData.address = fullDetails.Address
        this.addData.scope = fullDetails.Scope
      }
      this.queryECICreditCode()
    },
    async queryECICreditCode () {
      let result = await context.http.get('/qichacha/ECICreditCode/GetCreditCodeNew', { key: '2f3415aa9d1c4201837f8ca4215b91eb', keyWord: this.addData.teantName })
      if (result.data.Status === '200') {
        let fullDetails = result.data.Result
        this.addData.depositBank = fullDetails.Bank
        this.addData.bankAccount = fullDetails.BankAccount
        this.addData.taxNo = fullDetails.CreditCode
        this.addData.phone = fullDetails.Tel
        this.addData.taxAddress = fullDetails.Address
      }
    },
    synchronization () {
      this.handleSelect(this.selectItem)
    },
    async industry () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=行业')
      this.industryOptions = result.data
    },
    async documentType () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=证件类型')
      this.documentTypeOptions = result.data
    },
    async queryProjectList () {
      let result = await context.http.get('cms/api/project-managements/listBar')
      this.projectList = result.data
      this.chooseObj = this.projectList[0]
      if (this.addDataFromPotClienDtl.teantName && this.addDataFromPotClienDtl.referred) { // 处理来自意向合同页面的数据
        this.chooseObj = this.addDataFromPotClienDtl.chooseObj
        this.$set(this.addData, 'telephone', this.addDataFromPotClienDtl.telephone)
        this.$set(this.addData, 'contact', this.addDataFromPotClienDtl.contact)
        this.$set(this.addData, 'industryId', this.addDataFromPotClienDtl.industryId)
        this.$set(this.addData, 'customerType', this.addDataFromPotClienDtl.customerType)
        this.$set(this.addData, 'yxTenantId', this.addDataFromPotClienDtl.yxTenantId)
        this.$set(this.addData, 'referred', this.addDataFromPotClienDtl.referred)
        this.$set(this.addData, 'teantName', this.addDataFromPotClienDtl.teantName)
      }
    },
    choose (state) {
      if (state === 'project') {
        this.selHourse = false
        this.selProject = !this.selProject
      } else {
        this.selProject = false
        this.selHourse = !this.selHourse
      }
    },
    chooseItem (state, item) {
      if (state === 'project') {
        this.selProject = !this.selProject
      } else {
        this.selHourse = !this.selHourse
      }
      this.chooseObj = item
    },
    async checkName () {
      let _this = this
      this.$refs['addData'].validate((valid) => {
        if (valid) {
          context.http.get('/cms/api/tenant/checkName', { id: this.chooseObj.id, name: this.addData.teantName }).then(res => {
            if (res.data) {
              _this.dialogVisible = true
            } else {
              _this.addTenant()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async addTenant () {
      let _this = this
      this.addData.projectManagement = this.chooseObj
      this.addData.checkDate = this.formatDate(this.addData.checkDate)
      this.addData.startDate = this.formatDate(this.addData.startDate)
      this.addData.teamEnd = this.formatDate(this.addData.teamEnd)
      if (this.addData.customerType === '') {
        delete this.addData.customerType
      }
      context.http.post('/cms/api/tenant', this.addData).then(res => {
        if (res) {
          _this.dialogVisible = false
          _this.$emit('dialogClose')
          _this.$emit('query')
          _this.addData = {
            operName: '',
            depositBank: '',
            bankAccount: '',
            taxNo: '',
            phone: '',
            startDate: '',
            teamEnd: '',
            checkDate: ''
          }
        }
      })
    },
    formatDate (date) {
      if (date && typeof (date) === 'string' && date.indexOf('T') === -1) {
        date = date.replace(/\s/g, '')
        return date.slice(0, 10)
      } else {
        return date
      }
    }
  }
}
</script>
<style lang="scss">
.add-tenant {
  .el-autocomplete {
    width: 100%;
  }
  .dc-right {
    width: 100%;
    border: 1px solid #e7e7e7;
    margin-top: 20px;
    .dr-head {
      background-color: #fafafa;
      height: 40px;
      line-height: 40px;
      padding-left: 12px;
      font-size: 14px;
      margin-bottom: 24px;
      font-weight: bold;
      span {
        color: #5364c5;
        font-size: 12px;
        margin-left: 20px;
        font-weight: normal;
        cursor: pointer;
      }
    }
    .el-form-item {
      width: 22%;
      margin-left: 16px;
      margin-right: 10px;
      &:nth-of-type(4n) {
        margin-right: 0;
      }
      margin-bottom: 20px;
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 200px;
    }
  }
  .basic-item {
    width: 97%;
    margin: 0 auto;
    margin-bottom: 16px;
    p {
      font-size: 14px;
      margin-bottom: 6px;
    }
  }
  .basic-select {
    position: relative;
    cursor: pointer;
    .selectInput {
      height: 80px;
      border: 1px solid #e7e7e7;
      border-radius: 5px;
      padding: 0 15px;
      &.selectActive {
        border: 1px solid #6473cb;
      }
      img {
        float: left;
        display: block;
        width: 150px;
        height: 50px;
        margin-right: 10px;
        margin-top: 15px;
      }
      span {
        float: left;
        color: #666666;
        display: block;
        line-height: 80px;
        font-size: 14px;
        &:last-child {
          float: right;
          color: #6473cb;
        }
      }
    }
    .selectBox {
      width: 100%;
      border: 1px solid #e7e7e7;
      border-radius: 3px;
      background: #fff;
      position: absolute;
      left: 0;
      top: 86px;
      z-index: 9;
      padding: 15px 0px;
      box-shadow: 1px 2px 5px #ddd;
      overflow-y: auto;
      li {
        border-bottom: 1px solid #e7e7e7;
        padding: 10px 15px;
        display: flex;
        &:hover {
          background: #eee;
        }
        img {
          display: block;
          width: 50px;
          height: 21.3px;
          margin-right: 20px;
        }
        span {
          display: block;
          line-height: 20px;
          font-size: 14px;
        }
      }
    }
  }
  .invoice-information {
    .el-form-item {
      width: 30%;
    }
  }
  .el-form-item {
    display: inline-block;
  }
  .el-select {
    width: 100%;
  }
  .el-cascader {
    width: 100%;
  }
  .el-textarea__inner {
    height: 70px;
    font-size: 12px;
  }
  .preview-title {
    margin-left: 16px;
  }
  .preview-wrap {
    display: flex;
    justify-content: flex-start;
    margin: 10px 0;
    .preview {
      width: 160px;
      height: 140px;
      border: 1px solid #ddd;
      margin: 0 30px 0 16px;
      position: relative;
      .pw-bottom {
        position: absolute;
        background-color: #4883f6;
        text-align: center;
        color: #fff;
        width: 100%;
        bottom: 0;
        font-size: 14px;
        .upload-icon {
          background: url(../../../../assets/upload-white.png) no-repeat;
          background-size: contain;
          width: 12px;
          height: 12px;
          margin: 6px 6px 6px 0;
        }
      }
      img {
        width: 100%;
        height: 100%;
      }
      input {
        position: absolute;
        top: 0;
        right: 0;
        width: 160px;
        height: 140px;
        opacity: 0;
        cursor: pointer;
      }
    }
    .map {
      width: 684px;
      height: 200px;
      border: 1px solid #ddd;
    }
    .errorTip {
      color: red;
      bottom: -18px;
      position: absolute;
    }
  }
}
</style>
