<template>
  <div class="add-tenant-new dialog_content">
    <div class="dl-content clearfix">
      <el-form :model="addData"
               style="padding:0"
               ref="addData"
               :rules="addDataRules">
        <div class="dc-right">
          <div class="half_page_title"
               style="width:100%;margin-bottom:15px">
            <div><i></i>基本信息</div>
          </div>
          <el-form-item prop="teantName">
            <div class="cttitle">客户名称<i class="required">*</i></div>
            <el-autocomplete v-model="addData.teantName"
                             size="small"
                             :fetch-suggestions="searchTeantName"
                             placeholder="请输入内容"></el-autocomplete>
          </el-form-item>
          <el-form-item prop="creditCode"
                        style="margin-bottom: 20px;">
            <div class="cttitle">统一社会信用代码</div>
            <el-input v-model="addData.creditCode"
                      maxlength="30"
                      size="small"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item prop="customerType"
                        style="margin-bottom: 20px;">
            <div class="cttitle">企业类型<i class="required">*</i></div>
            <el-select size="small"
                       v-model="addData.customerType"
                       placeholder="请选择">
              <el-option v-for="item in customerOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-bottom: 20px;"
                        prop="companyNature">
            <div class="cttitle">企业性质<i class="required">*</i></div>
            <el-select v-model="addData.companyNature"
                       size="small"
                       placeholder="请选择">
              <el-option label="内资"
                         value="WITHIN"></el-option>
              <el-option label="外资"
                         value="OUT"></el-option>
              <el-option label="合资"
                         value="JOIN"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="industryIdid"
                        style="margin-bottom: 20px;">
            <div class="cttitle">行业<i class="required">*</i></div>
            <el-cascader v-model="addData.industryIdid"
                       filterable
                       :props="industryPropsTree"
                       popper-class="industry_propsTree_addtenant"
                       :options="industryOptionsTree"
                       size="small"
                       @change="handleIndustryChange"
                       placeholder="请选择">
              <!-- <el-option v-for="item in industryOptions"
                         :key="item.id"
                         :label="item.value"
                         :value="item.id">
              </el-option> -->
            </el-cascader>
          </el-form-item>
          <el-form-item prop="employeesNumber"
                        style="margin-bottom: 20px;">
            <div class="cttitle">就业人数</div>
            <el-input v-model="addData.employeesNumber"
                      type="number"
                      size="small"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item prop="contact"
                        style="margin-bottom: 20px;">
            <div class="cttitle">客户联系人</div>
            <el-input v-model="addData.contact"
                      size="small"
                      maxlength="20"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item style="margin-bottom: 20px;"
                        prop="telephone">
            <div class="cttitle">联系电话</div>
            <el-input v-model="addData.telephone"
                      size="small"
                      type="number"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item style="margin-bottom: 20px;"
                        prop="email">
            <div class="cttitle">电子邮箱</div>
            <el-input v-model="addData.email"
                      size="small"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item style="margin-bottom: 20px;"
                        prop="companyQualification">
            <div class="cttitle">企业资质<i class="required">*</i></div>
            <el-select v-model="addData.companyQualification"
                       size="small"
                       placeholder="请选择">
              <el-option label="高新技术"
                         value="HIGH_TECH"></el-option>
              <el-option label="科技小巨人"
                         value="TECHNOLOGY_GIANT"></el-option>
              <el-option label="上市企业"
                         value="LISTED_COMPANY"></el-option>
              <el-option label="其他"
                         value="OTHER"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="businessRegister"
                        style="margin-bottom: 20px;">
            <div class="cttitle">工商注册<i class="required">*</i></div>
            <el-select v-model="addData.businessRegister"
                       size="small"
                       placeholder="请选择">
              <el-option label="本镇本村"
                         value="BZBC"></el-option>
              <el-option label="本镇外村"
                         value="BZWC"></el-option>
              <el-option label="镇外注册"
                         value="ZWZC"></el-option>
              <el-option label="未注册"
                         value="WZC"></el-option>

            </el-select>
          </el-form-item>
          <el-form-item prop="registerType"
                        style="margin-bottom: 20px;">
            <div class="cttitle">注册类别</div>
            <el-select v-model="addData.registerType"
                       size="small"
                       placeholder="请选择">
              <el-option label="实地"
                         value="ON_THE_SPOT"></el-option>
              <el-option label="挂靠"
                         value="AFFILIATED"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="taxRegistration"
                        style="margin-bottom: 20px;">
            <div class="cttitle">税务登记<i class="required">*</i></div>
            <el-select v-model="addData.taxRegistration"
                       size="small"
                       placeholder="请选择">
              <el-option label="本镇本村"
                         value="BZBC"></el-option>
              <el-option label="本镇外村"
                         value="BZWC"></el-option>
              <el-option label="镇外登记"
                         value="ZWZC"></el-option>
              <el-option label="未登记"
                         value="WZC"></el-option>
            </el-select>
          </el-form-item>
          <!-- <div style="height:15px;width:100%;background: #F7F7F7;"></div>
          <div class="half_page_title"
               style="width:100% ;margin-bottom:15px">
            <div><i></i>入驻信息</div>
          </div> -->
          <!-- <el-form-item prop="organizeId"
                        style="margin-bottom: 20px;">
            <div class="cttitle">管理客户<i class="required">*</i></div>
            <el-select @change="organizesChange"
                       size="small"
                       v-model="addData.organizeId"
                       placeholder="请选择">
              <el-option v-for="item in organizesOptions"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="projectManagement.id"
                        style="margin-bottom: 20px;">
            <div class="cttitle">项目<i class="required">*</i></div>
            <el-select @change="projectChange"
                       size="small"
                       v-model="addData.projectManagement.id"
                       placeholder="请选择">
              <el-option v-for="item in options"
                         :key="item.id"
                         :label="item.projectName"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="building.id"
                        style="margin-bottom: 20px;">
            <div class="cttitle">资产</div>
            <el-select size="small"
                       clearable
                       v-model="addData.building.id"
                       placeholder="请选择">
              <el-option v-for="item in buildingOptions"
                         :key="item.id"
                         :label="item.buildingName"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item> 
          <el-form-item prop="address"
                        style="margin-bottom: 20px;">
            <div class="cttitle">入驻地址<i class="required">*</i></div>
            <el-input v-model="addData.address"
                      size="small"
                      placeholder="请输入内容"></el-input>
          </el-form-item>-->
          <!-- <el-form-item prop="businessRegister"
                        style="margin-bottom: 20px;">
            <div class="cttitle">工商注册<i class="required">*</i></div>
            <el-select v-model="addData.businessRegister"
                       size="small"
                       placeholder="请选择">
              <el-option label="本镇本村"
                         value="BZBC"></el-option>
              <el-option label="本镇外村"
                         value="BZWC"></el-option>
              <el-option label="镇外注册"
                         value="ZWZC"></el-option>
              <el-option label="未注册"
                         value="WZC"></el-option>

            </el-select>
          </el-form-item>
          <el-form-item prop="registerType"
                        style="margin-bottom: 20px;">
            <div class="cttitle">注册类别</div>
            <el-select v-model="addData.registerType"
                       size="small"
                       placeholder="请选择">
              <el-option label="实地"
                         value="ON_THE_SPOT"></el-option>
              <el-option label="挂靠"
                         value="AFFILIATED"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="taxRegistration"
                        style="margin-bottom: 20px;">
            <div class="cttitle">税务登记<i class="required">*</i></div>
            <el-select v-model="addData.taxRegistration"
                       size="small"
                       placeholder="请选择">
              <el-option label="本镇本村"
                         value="BZBC"></el-option>
              <el-option label="本镇外村"
                         value="BZWC"></el-option>
              <el-option label="镇外注册"
                         value="ZWZC"></el-option>
              <el-option label="未注册"
                         value="WZC"></el-option>
            </el-select>
          </el-form-item> -->
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
    seachParams: {
      type: Object,
      default: {
        organizeId: '',
        id: '',
        buildingId: ''
      }
    },
    addDialogShow: {
      type: Boolean,
      default: true
    },
    organizesOptions: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      options: [],
      buildingOptions: [],
      industryPropsTree: {label: 'name', value: 'id', children: 'child', expandTrigger: 'hover', emitPath: true, checkStrictly: true},
      addData: {
        teantName: '',
        creditCode: '',
        customerType: '',
        companyNature: 'WITHIN',
        standardIndustryId: '',
        standardIndustryName: '',
        employeesNumber: '',
        contact: '',
        telephone: '',
        email: '',
        companyQualification: 'OTHER',
        organizeId: null,
        projectManagement: null,
        building: null,
        industryIdid: [],
        // organizeId: '',
        // projectManagement: { id: '' },
        // building: { id: '' },
        address: '',
        businessRegister: '',
        registerType: null,
        taxRegistration: ''
      },
      industryIdid: [],
      industryOptions: [],
      customerOptions: [
        { label: '法人单位', value: 'COMPANY' },
        { label: '个体户', value: 'PERSONAL' },
        { label: '分支机构', value: 'BRANCH' },
        { label: '其他单位', value: 'OTHER' }
      ],
      addDataRules: {
        teantName: [
          { required: true, message: '请输入客户名称', trigger: 'blur' }
        ],
        customerType: [
          { required: true, message: '请选择客户类型', trigger: 'change' }
        ],
        industryIdid: [
          { required: true, message: '请选择行业', trigger: 'change' }
        ],
        telephone: [
          { pattern: /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/, message: '请输入正确的手机号或固定电话', trigger: 'blur' }
        ],
        email: [
          // { pattern: /^([a-zA-Z]|[0-9])(\w|\/-)+@[a-zA-Z0-9_-]+\.([a-zA-Z]{2,4})$/, message: '请输入正确的邮箱地址', trigger: 'blur' }
          { pattern: /^\w{3,}(\.\w+)*@[A-z0-9]+(\.[A-z]{2,5}){1,2}$/gi, message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        companyNature: [
          { required: true, message: '请选择客户性质', trigger: 'change' }
        ],
        companyQualification: [
          { required: true, message: '请选择企业资质', trigger: 'change' }
        ],
        organizeId: [
          { required: true, message: '请选择管理客户', trigger: 'change' }
        ],
        'projectManagement.id': [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        businessRegister: [
          { required: true, message: '请选择工商注册', trigger: 'change' }
        ],
        taxRegistration: [
          { required: true, message: '请选择税务登记', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入入驻地址', trigger: 'blur' }
        ]
      },
      center: [],
      selHourse: false,
      selProject: false,
      dialogVisible: false,
      chooseObj: {},
      projectList: [],
      selectItem: {},
      companyShow: false,
      chooseOperate: {},
      industryOptionsTree: []
    }
  },
  watch: {
    addDialogShow: {
      immediate: true,
      handler: function (val, oldval) {
        if (val) {
          // this.addData.organizeId = this.seachParams.organizeId
          // if (!this.addData.organizeId) return
          // context.http.get('/cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: this.addData.organizeId }).then(res => {
          //   this.options = res.data
          //   this.addData.projectManagement.id = this.seachParams.id
          //   if (!this.addData.projectManagement.id) return
          //   context.http.get('/cms/api/buildings/newList', { useStatus: 'USING', projectId: this.addData.projectManagement.id, page: 0, size: 9999, sort: 'id,asc' }).then(res1 => {
          //     this.buildingOptions = res1.data
          //     this.addData.building.id = this.seachParams.buildingId
          //   })
          // })
          this.getAllIndustry()
        }
      }
    }
  },
  mounted () {
    // this.industry()
  },
  methods: {
    handleIndustryChange (e) {
      let id = e[e.length - 1]
      // if (this.addData.standardIndustryId) {
      //   this.addData.standardIndustryId = this.addData.standardIndustryId + ',' + id
      // } else {
      this.addData.standardIndustryId = id + ''
      // }
      let name
      this.allIndustryName.forEach((item, index) => {
        if (item.id === id) {
          name = item.industryId + '' + item.name
        }
      })
      // if (this.addData.standardIndustryName) {
      //   this.addData.standardIndustryName = this.addData.standardIndustryName + ',' + name
      // } else {
      this.addData.standardIndustryName = name
      // }
      console.log(e, this.addData.standardIndustryId, this.addData.standardIndustryName)
    },
    getAllIndustry () {
      this.allIndustryName = []
      context.http.get('/cms/api/tenant/standardIndustry/tree').then(res => {
        let data = res.data || []
        data.forEach((it, ind) => {
          this.allIndustryName.push(it)
          if (it.child) {
            it.child.forEach((ite, inde) => {
              this.allIndustryName.push(ite)
              if (ite.child) {
                ite.child.forEach((item, index) => {
                  this.allIndustryName.push(item)
                  if (item.child) {
                    item.child.forEach((itemr, indexr) => {
                      this.allIndustryName.push(itemr)
                      delete itemr.child
                    })
                  }
                })
              }
            })
          }
        })
        // console.log(this.allIndustryName)
        this.industryOptionsTree = data
      })
    },
    resetFields () {
      this.$refs['addData'].resetFields()
    },
    async addTenant () {
      console.log(this.addData)
      // debugger
      this.$refs['addData'].validate((valid) => {
        if (valid) {
          this.addData.tenantUse = 'WORK'
          if (!this.addData.building || !this.addData.building.id) {
            this.addData.building = null
          }
          context.http.post('/cms/api/tenant', this.addData).then(res => {
            if (res) {
              this.addData.building = { id: '' }
              this.$message.success('客户新增成功')
              this.$emit('dialogClose')
              this.$emit('query')
            }
          }).catch(error => {
            this.addData.building = { id: '' }
            console.log(error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async organizesChange (id) { // 管理客户查名下项目
      this.addData.projectManagement.id = ''
      this.addData.building.id = ''
      this.options = []
      this.buildingOptions = []
      if (!id) {
        return
      }
      let res = await context.http.get('/cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: id })
      this.options = res.data
    },
    async projectChange (id) { // 项目下资产
      this.addData.building.id = ''
      this.buildingOptions = []
      if (!id) {
        return
      }
      let res = await context.http.get('/cms/api/buildings/newList', { useStatus: 'USING', projectId: id, page: 0, size: 9999, sort: 'id,asc' })
      this.buildingOptions = res.data
    },
    async industry (val) {
      let result = await context.http.get(`/uaa/api/paramet-managements/name?name=行业`)
      this.industryOptions = result.data
    },
    currentSel (val) {
      if (val !== 'COMPANY') {
        this.companyShow = false
        this.addData.creditCode = ''
        this.addData.no = ''
        this.addData.orgNo = ''
        this.addData.operName = ''
        this.addData.registCapi = ''
        this.addData.status = ''
        this.addData.econKind = ''
        this.addData.startDate = ''
        this.addData.teamEnd = ''
        this.addData.checkDate = ''
        this.addData.belongOrg = ''
        this.addData.province = ''
        this.addData.companyIndustry = ''
        this.addData.address = ''
        this.addData.scope = ''
        this.addData.taxAddress = ''
        this.addData.taxNo = ''
      }
    },
    selectOperation (val) {
      this.chooseOperate = val
    },
    async searchOperation (queryString, callback) {
      var list = [{}]
      if (!queryString || queryString === '') {
        return false
      }
      let result = await context.http.get('/uaa/api/users/allOnGroupPersonnel', { queryName: queryString, jobStatus: 'ONJOB' })
      var results = result.data
      for (let i of results) {
        i.value = i.name  // 将想要展示的数据作为value
      }
      list = result.data
      callback(list)
    },
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
      this.companyShow = true
      this.handleSelect(this.selectItem)
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
@font-face {
  font-family: 'ali';
  src: url(../../../../../static/ali/Alibaba-PuHuiTi-Bold.ttf),
       url(../../../../../static/ali/Alibaba-PuHuiTi-Heavy.ttf),
       url(../../../../../static/ali/Alibaba-PuHuiTi-Light.ttf),
       url(../../../../../static/ali/Alibaba-PuHuiTi-Medium.ttf),
       url(../../../../../static/ali/Alibaba-PuHuiTi-Regular.ttf);
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'Font-OPPOSans';
  src: url(../../../../../static/Font-OPPOSans/OPPOSans-B.ttf),
       url(../../../../../static/Font-OPPOSans/OPPOSans-H.ttf),
       url(../../../../../static/Font-OPPOSans/OPPOSans-L.ttf),
       url(../../../../../static/Font-OPPOSans/OPPOSans-M.ttf),
       url(../../../../../static/Font-OPPOSans/OPPOSans-R.ttf);
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'HarmonyOS_Sans';
  src: url(../../../../../static/HarmonyOS_Sans/HarmonyOS_Sans_Black.ttf),
       url(../../../../../static/HarmonyOS_Sans/HarmonyOS_Sans_Bold.ttf),
       url(../../../../../static/HarmonyOS_Sans/HarmonyOS_Sans_Light.ttf),
       url(../../../../../static/HarmonyOS_Sans/HarmonyOS_Sans_Medium.ttf),
       url(../../../../../static/HarmonyOS_Sans/HarmonyOS_Sans_Regular.ttf),
       url(../../../../../static/HarmonyOS_Sans/HarmonyOS_Sans_Thin.ttf);
  font-weight: normal;
  font-style: normal;
}
.industry_propsTree_addtenant {
  .el-cascader-panel {
    .el-cascader-menu:nth-of-type(1) {
      .el-scrollbar__wrap {
        .el-scrollbar__view {
          li {
            >label {
              display: none;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.add-tenant-new {
  .el-autocomplete {
    width: 100%;
  }
  .dc-right {
    width: 100%;
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
      width: 28%;
      margin-left: 15px;
      margin-right: 15px;
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
// .add-tenant-new {
  // .el-cascader__dropdown .el-cascader-menu:nth-of-type(1) .el-cascader-menu__list .el-cascader-node>label {
  //   display: none;
  // }
  // .el-cascader-panel .el-cascader-menu:nth-of-type(2) .el-checkbox{
  //   width: 100%;
  // }
  // .el-cascader-panel .el-cascader-menu:nth-of-type(2) .el-cascader-node__label{
  //   margin-left: -90%;
  // }
// .add-tenant-new {
  // .custom_cascader .el-cascader-panel >.el-cascader-menu:nth-of-type(1) {
  //   // color: #4883f6;
  //   /deep/ .el-cascader-node>label {
  //     display: none;
  //   }
  // }
// } 
.searchInfo {
  color: #5364c5;
  width: 97%;
  margin: 0 auto;
  cursor: pointer;
  margin-bottom: 20px;
}
</style>
