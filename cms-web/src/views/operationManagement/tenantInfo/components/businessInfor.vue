<template>
  <div class="business-infor scroll-bar">
    <el-form :model="tenantDetail"
             ref="tenantDetail"
             :rules="tenantDetailRules">
      <div class="dc-right float-right"
           style="margin-top: 0"
           v-if="businessCircles">
        <div class="dr-head">
          <!-- <span class="editbtns" v-if="hasAuthority('02030105')&&readOnly">
            <i class="iconfont icon-cms_bianji-"
               style="color:#3575F6;font-weight: normal;cursor:pointer;"
               @click="handlerEdit3"
              > 编辑</i>
          </span> -->

          <!-- <span @click="synchronization"
                v-if="!readOnly"
                style="cursor: pointer;float: right;margin-right: 20px;color: #3577f6;margin-top: 4px;">同步工商信息</span> -->
        </div>
        <el-form-item>
          <div class="cttitle">统一社会信用代码</div>
          <span v-if="readOnly">{{tenantDetail.creditCode}}</span>
          <el-input v-model="tenantDetail.creditCode"
                    v-else
                    maxlength="50"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="cttitle">注册号</div>
          <span v-if="readOnly">{{tenantDetail.no}}</span>
          <el-input v-model="tenantDetail.no"
                    v-else
                    maxlength="50"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="cttitle">组织结构代码</div>
          <span v-if="readOnly">{{tenantDetail.orgNo}}</span>
          <el-input v-model="tenantDetail.orgNo"
                    v-else
                    maxlength="50"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="cttitle">法定代表人</div>
          <span v-if="readOnly">{{tenantDetail.operName}}</span>
          <el-input v-model="tenantDetail.operName"
                    v-else
                    maxlength="20"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="cttitle">国籍</div>
          <span v-if="readOnly">{{tenantDetail.nationality}}</span>
          <el-input v-model="tenantDetail.nationality"
                    v-else
                    maxlength="50"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="cttitle">注册资本/万元</div>
          <span v-if="readOnly">{{tenantDetail.registCapi}}</span>
          <el-input v-model="tenantDetail.registCapi"
                    type="number"
                    v-else
                    maxlength="50"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="cttitle">经营状态</div>
          <span v-if="readOnly">{{tenantDetail.status}}</span>
          <el-input v-model="tenantDetail.status"
                    v-else
                    maxlength="50"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="cttitle">客户类型</div>
          <span v-if="readOnly">{{tenantDetail.econKind}}</span>
          <el-input v-model="tenantDetail.econKind"
                    v-else
                    maxlength="50"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="cttitle">人员规模</div>
          <span v-if="readOnly">{{tenantDetail.staffSize}}</span>
          <el-input v-model="tenantDetail.staffSize"
                    v-else
                    maxlength="50"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="cttitle">成立日期</div>
          <span v-if="readOnly">{{TimeTrans(tenantDetail.startDate)}}</span>
          <el-date-picker v-model="tenantDetail.startDate"
                          v-else
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <div class="cttitle">营业期限</div>
          <span v-if="readOnly">{{TimeTrans(tenantDetail.teamEnd)}}</span>
          <el-date-picker v-model="tenantDetail.teamEnd"
                          v-else
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <div class="cttitle">核对日期</div>
          <span v-if="readOnly">{{TimeTrans(tenantDetail.checkDate)}}</span>
          <el-date-picker v-model="tenantDetail.checkDate"
                          v-else
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <div class="cttitle">登记机关</div>
          <span v-if="readOnly">{{tenantDetail.belongOrg}}</span>
          <el-input v-model="tenantDetail.belongOrg"
                    v-else
                    maxlength="50"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="cttitle">所属地区</div>
          <span v-if="readOnly">{{tenantDetail.province}}</span>
          <el-input v-model="tenantDetail.province"
                    v-else
                    maxlength="50"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="cttitle">所属业态</div>
          <span v-if="readOnly">{{tenantDetail.companyIndustry}}</span>
          <el-input v-model="tenantDetail.companyIndustry"
                    v-else
                    maxlength="50"></el-input>
        </el-form-item>
        <el-form-item style="vertical-align: top;">
          <div class="cttitle">注册地址</div>
          <span v-if="readOnly">{{tenantDetail.address}}</span>
          <el-input v-model="tenantDetail.address"
                    v-else
                    maxlength="100"></el-input>
        </el-form-item>
        <el-form-item style="width: 96.4%">
          <div class="cttitle">经营范围</div>
          <span v-if="readOnly">{{tenantDetail.scope}}</span>
          <el-input v-model="tenantDetail.scope"
                    v-else
                    maxlength="1000"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    type="textarea"
                    resize="resize"></el-input>
        </el-form-item>
      </div>
      <div class="dc-right float-right invoice-information"
           v-else>
        <div class="dr-head">
          <!-- <span class="editbtns">
            <i class="iconfont icon-cms_bianji-"
               style="color:#3575F6;font-weight: normal;cursor:pointer;"
               @click="readOnly2 = false"
               v-if="hasAuthority('02030105')&&readOnly2"> 编辑</i>
          </span> -->

        </div>
        <el-form-item>
          <div class="cttitle">开户银行</div>
          <span v-if="readOnly2">{{tenantDetail.depositBank}}</span>
          <el-input v-model="tenantDetail.depositBank"
                    v-else
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;">
          <div class="cttitle">银行账号</div>
          <span v-if="readOnly2">{{tenantDetail.bankAccount}}</span>
          <el-input v-model="tenantDetail.bankAccount"
                    v-else
                    maxlength="50"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;">
          <div class="cttitle">纳税人识别号</div>
          <span v-if="readOnly2">{{tenantDetail.taxNo}}</span>
          <el-input v-model="tenantDetail.taxNo"
                    v-else
                    maxlength="50"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;">
          <div class="cttitle">电话</div>
          <span v-if="readOnly2">{{tenantDetail.phone}}</span>
          <el-input v-model="tenantDetail.phone"
                    v-else
                    maxlength="30"
                    type="tel"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;width: 63%">
          <div class="cttitle">开票地址</div>
          <span v-if="readOnly2">{{tenantDetail.taxAddress}}</span>
          <el-input v-model="tenantDetail.taxAddress"
                    v-else
                    placeholder="请输入内容"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="bi-footer"
         v-if="!readOnly || !readOnly2">
      <span @click="cancel"
            class="details_cannelBtn">取消</span>
      <span type="primary"
            @click="confirm"
            class="details_submitBtn"
            style="margin-right: 20px;">保存</span>
    </div>
  </div>
</template>
<script>
import context from '@/service'
import * as hub from '@/service/eventHub'
import { decrypt } from '@/utils/validate'
export default {
  name: 'businessInfor',
  props: {
    tenantDetail: {
      type: Object,
      default: {}
    },
    tabActive: {
      type: Number,
      default: 0
    }
  },
  watch: {
    tabActive: {
      handler: function (val, oldVal) {
        if (val === 2) {
          this.businessCircles = false
        } else if (val === 3) {
          this.businessCircles = true
        }
        this.readOnly = true
        this.readOnly2 = true
      },
      immediate: true
    }
  },
  mounted () {
    hub.eventHub.$on('teantName', function (msg) {
      this.tenantDetail.teantName = msg
    })
  },
  data () {
    var _this = this
    var validateIDNumber = (rule, value, callback) => {
      if (_this.tenantDetail.certificate === 2) {
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
      tenantDetailRules: {
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
      businessCircles: false,
      readOnly: true,
      readOnly2: true,
      projectOptions: [],
      customerOptions: [
        { label: '请选择', value: '' },
        { label: '企业', value: 'COMPANY' },
        { label: '个人', value: 'PERSONAL' }
      ],
      industryOptions: [],
      documentTypeOptions: []
    }
  },
  methods: {
    decryptMsg (val) {
      return decrypt(val)
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    async handleSelect (item) {
      if (!this.tenantDetail.teantName || this.tenantDetail.teantName === '') {
        return false
      }
      this.selectItem = item
      let result = await context.http.get('/qichacha/ECIV4/GetFullDetailsByName', { key: '2f3415aa9d1c4201837f8ca4215b91eb', keyWord: item.Name })
      if (result.data.Status === '200') {
        let fullDetails = result.data.Result
        this.tenantDetail.creditCode = fullDetails.CreditCode
        this.tenantDetail.no = fullDetails.No
        this.tenantDetail.orgNo = fullDetails.OrgNo
        this.tenantDetail.operName = fullDetails.OperName
        // this.tenantDetail.registCapi = fullDetails.RegistCapi
        this.tenantDetail.status = fullDetails.Status
        this.tenantDetail.econKind = fullDetails.EconKind
        this.tenantDetail.startDate = fullDetails.StartDate
        this.tenantDetail.teamEnd = fullDetails.TeamEnd
        this.tenantDetail.checkDate = fullDetails.CheckDate
        this.tenantDetail.belongOrg = fullDetails.BelongOrg
        this.tenantDetail.province = fullDetails.Province
        this.tenantDetail.companyIndustry = fullDetails.Industry.Industry
        this.tenantDetail.address = fullDetails.Address
        this.tenantDetail.ccope = fullDetails.Scope
        if (fullDetails.RegistCapi) {
          const index = fullDetails.RegistCapi.indexOf('万')
          this.tenantDetail.registCapi = Number(fullDetails.RegistCapi.substring(0, index))
        }
      }
      this.queryECICreditCode()
    },
    async queryECICreditCode () {
      let result = await context.http.get('/qichacha/ECICreditCode/GetCreditCodeNew', { key: '2f3415aa9d1c4201837f8ca4215b91eb', keyWord: this.tenantDetail.teantName })
      if (result.data.Status === '200') {
        let fullDetails = result.data.Result
        this.tenantDetail.depositBank = fullDetails.Bank
        this.tenantDetail.bankAccount = fullDetails.BankAccount
        this.tenantDetail.taxNo = fullDetails.CreditCode
        this.tenantDetail.phone = fullDetails.Tel
        this.tenantDetail.taxAddress = fullDetails.Address
      }
    },
    handlerEdit2 () {
      this.readOnly2 = false
    },
    handlerEdit3 () {
      this.readOnly = false
    },
    synchronization () {
      this.handleSelect({ Name: this.tenantDetail.teantName })
    },
    TimeTrans (val) {
      if (val) {
        return val.substring(0, 10)
      }
      return ''
    },
    confirm () {
      this.tenantDetail.startDate = this.TimeTrans(this.tenantDetail.startDate)
      this.tenantDetail.checkDate = this.TimeTrans(this.tenantDetail.checkDate)
      this.tenantDetail.checkDate = this.TimeTrans(this.tenantDetail.checkDate)
      this.tenantDetail.teamEnd = this.TimeTrans(this.tenantDetail.teamEnd)
      let iDNumber = ''
      if (this.tenantDetail.iDNumber && this.tenantDetail.iDNumber.length > 30) {
        this.tenantDetail.iDNumber = this.decryptMsg(this.tenantDetail.iDNumber)
      }
      if (!this.tenantDetail.building.id) {
        this.tenantDetail.building = null
      }
      context.http.put('cms/api/tenant', this.tenantDetail).then(res => {
        if (res.status === 200) {
          this.readOnly = true
          this.readOnly2 = true
          this.$message.success('保存成功')
          this.$emit('handleEdit', 0, this.tenantDetail)
        }
      })
    },
    cancel () {
      this.readOnly = true
      this.readOnly2 = true
      this.$emit('handleEdit', 0, this.tenantDetail)
    }
  }
}
</script>
<style lang="scss" scoped>
.business-infor {
  .el-form {
    height: 427px;
    overflow-y: auto;
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
  }
  .editbtns {
    display: inline-block;
    width: 60px;
    height: 26px;
    line-height: 26px;
    // background: rgba(49, 117, 246, 1);
    border-radius: 4px;
    float: right;
    margin: 0 20px 0 0;
    font-size: 12px;
    font-weight: 400;
    cursor: pointer;
    color: #fff !important;
    text-align: center;
    i {
      font-size: 14px;
    }
  }
  .bi-footer {
    text-align: right;
    margin-bottom: 10px;
    span {
      width: 60px;
      height: 26px;
      line-height: 26px;
    }
  }
  .el-form-item {
    margin-bottom: 20px;
    width: 22%;
    margin-left: 16px;
    margin-right: 10px;
    vertical-align: top;
    display: inline-block;
  }
  .dc-right {
    width: 100%;
    // border: 1px solid #e7e7e7;
    .dr-head {
      // background-color: #fafafa;
      // height: 40px;
      // line-height: 40px;
      padding-left: 12px;
      font-size: 14px;
      font-weight: 700;
    }
  }
  .invoice-information {
    .cttitle + span {
      width: 240px;
    }
    .el-form-item {
      margin-right: 0;
    }
  }
  .cttitle {
    font-size: 14px;
    color: #777;
  }
  .cttitle + span {
    display: inline-block;
    overflow: hidden;
    font-size: 14px;
    color: #262626;
  }
}
</style>
<style lang="scss">
.business-infor {
  .el-date-editor.el-input {
    width: 225px;
  }
}
</style>
