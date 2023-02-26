<template>
  <div class="tenant-files">
    <el-form :model="tenantDetail"
             ref="tenantDetail"
             :rules="tenantDetailRules">
      <div class="tf-left float-left">
        <el-form-item prop="teantName">
          <div class="cttitle">客户名称<i class="required">*</i></div>
          <span v-if="readOnly">{{tenantDetail.teantName}}</span>
          <el-autocomplete v-else
                           v-model="tenantDetail.teantName"
                           :fetch-suggestions="searchTeantName"
                           placeholder="请输入内容"
                           @select="handleSelect"></el-autocomplete>
        </el-form-item>
        <el-form-item>
          <div class="cttitle">统一社会信用代码</div>
          <span v-if="readOnly">{{tenantDetail.creditCode}}</span>
          <el-input v-model="tenantDetail.creditCode"
                    v-else
                    maxlength="30"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item prop="customerType">
          <div class="cttitle">企业类型<i class="required">*</i></div>
          <span v-if="readOnly">{{customerTypeState(tenantDetail.customerType)}}</span>
          <el-select size="small"
                     v-else
                     v-model="tenantDetail.customerType"
                     placeholder="请选择">
            <el-option v-for="item in customerOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="companyNature">
          <div class="cttitle">企业性质<i class="required">*</i></div>
          <span v-if="readOnly">{{tenantDetail.companyNatureDescription}}</span>
          <el-select v-model="tenantDetail.companyNature"
                     v-else
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
        <el-form-item prop="industryIdid">
          <!-- :rules="[ { required: true, message: '请输入行业', trigger: 'change' }]" -->
          <div class="cttitle">行业<i class="required">*</i></div>
          <span v-if="readOnly">{{tenantDetail.standardIndustryName}}</span>
          <el-cascader v-model="industryIdid"
                       class="industryCascader"
                       v-else
                       filterable
                       :props="industryPropsTree"
                       popper-class="industry_propsTree_addtenant"
                       :options="industryOptionsTree"
                       size="small"
                       @change="handleIndustryChange"
                       placeholder="请选择">
          </el-cascader>
        </el-form-item>
        <el-form-item>
          <div class="cttitle">就业人数</div>
          <span v-if="readOnly">{{tenantDetail.employeesNumber}}</span>
          <el-input v-else
                    v-model="tenantDetail.employeesNumber"
                    type="number"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="cttitle">客户联系人</div>
          <span v-if="readOnly">{{tenantDetail.contact}}</span>
          <el-input v-model="tenantDetail.contact"
                    v-else
                    maxlength="20"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item prop="telephone">
          <div class="cttitle">联系电话</div>
          <span v-if="readOnly">{{tenantDetail.telephone}}</span>
          <el-input v-model="tenantDetail.telephone"
                    v-else
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <div class="cttitle">电子邮箱</div>
          <span v-if="readOnly">{{tenantDetail.email}}</span>
          <el-input v-model="tenantDetail.email"
                    v-else
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item prop="companyQualification">
          <div class="cttitle">企业资质<i class="required">*</i></div>
          <span v-if="readOnly">{{tenantDetail.companyQualificationDescription}}</span>
          <el-select v-model="tenantDetail.companyQualification"
                     v-else
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

        <!-- <div style="width:100%;border: 1px solid #F8F8F8;margin-bottom: 15px;"></div> -->
        <!-- ------------------------------------------------------------------------------------------------------------------------------- -->
        <!-- ------------------------------------------------------------------------------------------------------------------------------- -->
        <!-- <el-form-item prop="organizeId">
          <div class="cttitle">管理客户<i class="required">*</i></div>
          <span v-if="readOnly">{{tenantDetail.projectManagement.originalProjectName}}</span>
          <el-select @change="organizesChange"
                     size="small"
                     v-else
                     v-model="tenantDetail.organizeId"
                     placeholder="请选择">
            <el-option v-for="item in organizesOptions"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="projectManagement.id">
          <div class="cttitle">
            项目<i class="required">*</i></div>
          <span v-if="readOnly">{{tenantDetail.projectManagement.projectName}}</span>
          <el-select v-model="tenantDetail.projectManagement.id"
                     @change="projectChange"
                     placeholder="项目"
                     v-else>
            <el-option v-for="item in options"
                       :key="item.id"
                       :label="item.projectName"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="building.id">
          <div class="cttitle">资产</div>
          <span v-if="readOnly">{{tenantDetail.building?tenantDetail.building.buildingName:''}}</span>
          <el-select size="small"
                     v-if="!readOnly"
                     clearable
                     v-model="tenantDetail.building.id"
                     placeholder="请选择">
            <el-option v-for="item in buildingOptions"
                       :key="item.id"
                       :label="item.buildingName"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="address">
          <div class="cttitle">入驻地址<i class="required">*</i></div>
          <span v-if="readOnly">{{tenantDetail.address}}</span>
          <el-input v-model="tenantDetail.address"
                    maxlength="100"
                    v-else
                    placeholder="请输入内容"></el-input>
        </el-form-item> -->
        <el-form-item prop="businessRegister">
          <div class="cttitle">工商注册<i class="required">*</i></div>
          <span v-if="readOnly">{{tenantDetail.businessRegisterDescription}}</span>
          <el-select v-model="tenantDetail.businessRegister"
                     v-else
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
        <el-form-item>
          <div class="cttitle">注册类别</div>
          <span v-if="readOnly">{{tenantDetail.registerTypeDescription||'-'}}</span>
          <el-select v-model="tenantDetail.registerType"
                     v-else
                     placeholder="请选择">
            <el-option label="实地"
                       value="ON_THE_SPOT"></el-option>
            <el-option label="挂靠"
                       value="AFFILIATED"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="taxRegistration">
          <div class="cttitle">税务登记<i class="required">*</i></div>
          <span v-if="readOnly">{{taxRegistrationFormated(tenantDetail.taxRegistration)}}</span>
          <el-select v-model="tenantDetail.taxRegistration"
                     v-else
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
        <el-form-item>
          <div class="cttitle">状态</div>
          <span v-if="readOnly">{{tenantDetail.useStatus === 'DISABLE' ? '已停用' : '使用中'}}</span>
          <el-select v-model="tenantDetail.useStatus"
                     placeholder="请选择"
                     v-else>
            <el-option v-for="item in useStatusOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <!-- <div class="tf-right float-left">
        <div style="color:#777;text-align: left;">客户商铺图片</div>
        <div class="preview-wrap">
          <img v-if="!tenantDetail.shopPhotos && readOnly"
               src="../../../../assets/berth-default.png" />
          <img v-else-if="tenantDetail.shopPhotos && readOnly"
               :src="tenantDetail.shopPhotos" />
          <div class="preview"
               v-else>
            <i class="iconfont icon-cms_cuowu"
               v-if="tenantDetail.shopPhotos"
               @click="delPreviewImage()"></i>
            <img :src="tenantDetail.shopPhotos"
                 v-if="tenantDetail.shopPhotos" />
            <div class="tips1"
                 v-else>
              <i class="iconfont icon-shangchuantupianicon"></i>
              <p>上传图片</p>
            </div>
            <aliUpload class="aliUpload"
                       :upLoadText="upLoadText"
                       :fileType="fileType"
                       :iconShow="false"
                       @setAnnex="setAnnexs" />
          </div>
        </div>
      </div> -->
    </el-form>

    <div class="dialog-footer"
         v-if="!readOnly">
      <span @click="confirm"
            class="details_submitBtn">保存</span>
      <span @click="cancel"
            class="details_cannelBtn">取消</span>

    </div>
  </div>
</template>
<script>
import context from '@/service'
import * as hub from '@/service/eventHub'
import aliUpload from '@/components/aliUpload.vue'
import { decrypt } from '@/utils/validate'
export default {
  name: 'tenantFiles',
  components: {
    aliUpload
  },
  props: {
    tenantDetail: {
      type: Object,
      default: {}
    }
  },
  watch: {
    tenantDetail: {
      handler: function (value, oldVal) {
        this.tenantDetailIDNumber = this.decryptMsg(this.tenantDetail.iDNumber)
      }
    }
  },
  data () {
    return {
      upLoadText: '',
      industryOptionsTree: [],
      industryIdid: [],
      industryPropsTree: { label: 'name', value: 'id', children: 'child', expandTrigger: 'hover', emitPath: true, checkStrictly: true },
      fileType: ['png', 'jpeg', 'jpg'],
      tenantDetailRules: {
        teantName: [
          { required: true, message: '请输入客户名称', trigger: 'blur' }
        ],
        customerType: [
          { required: true, message: '请选择客户类型', trigger: 'change' }
        ],
        // industryIdid: [
        //   { required: true, message: '请选择行业', trigger: 'change' }
        // ],
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
          { required: true, message: '请选择客户资质', trigger: 'change' }
        ],
        organizeId: [
          { required: true, message: '请选择管理客户', trigger: 'change' }
        ],
        'projectManagement.id': [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        // 'building.id': [
        //   { required: true, message: '请选择资产', trigger: 'change' }
        // ],
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
      operateUserOptions: [],
      readOnly: true,
      loading: false,
      customerOptions: [
        { label: '法人单位', value: 'COMPANY' },
        { label: '个体户', value: 'PERSONAL' },
        { label: '分支机构', value: 'BRANCH' },
        { label: '其他单位', value: 'OTHER' }
      ],
      industryOptions: [],
      documentTypeOptions: [],
      useStatusOptions: [
        {
          value: 'DISABLE',
          label: '已停用'
        }, {
          value: 'USING',
          label: '使用中'
        }],
      tenantDetailIDNumber: '',
      organizesOptions: [],
      options: [],
      buildingOptions: []
    }
  },
  created () {
    this.tenantUseChange(this.tenantDetail.tenantUse, true)
    // this.documentType()
    // this.getDataAuthorityOptions()
    // this.getOrganizes()
  },
  mounted () {
    if (this.tenantDetail.iDNumber && this.tenantDetail.iDNumber.length < 20) {
      this.tenantDetailIDNumber = this.tenantDetail.iDNumber
    } else {
      this.tenantDetailIDNumber = this.decryptMsg(this.tenantDetail.iDNumber)
    }
  },
  methods: {
    handlerEdit1 () { // 编辑
      this.readOnly = false
      // this.queryOperateUser()
      // this.organizesChange(this.tenantDetail.organizeId, true)
      // this.projectChange(this.tenantDetail.projectManagement.id, true)
      this.getAllIndustry()
    },
    handleIndustryChange (e) {
      let id = e[e.length - 1]
      this.tenantDetail.standardIndustryId = id + ''
      let name
      this.allIndustryName.forEach((item, index) => {
        if (item.id === id) {
          name = item.industryId + '' + item.name
        }
      })
      this.tenantDetail.standardIndustryName = name
    },
    getAllIndustry () {
      this.allIndustryName = []
      let standardIndustryId = null
      if (this.tenantDetail.standardIndustryId) {
        standardIndustryId = Number(this.tenantDetail.standardIndustryId)
        let index = []
        let industryId = []
        context.http.get('/cms/api/tenant/standardIndustry/tree').then(res => {
          let data = res.data || []
          data.forEach((it, ind) => {
            this.allIndustryName.push(it)
            if (standardIndustryId === it.id) {
              industryId = [it.id]
            }
            if (it.child) {
              it.child.forEach((ite, inde) => {
                if (standardIndustryId === ite.id) {
                  industryId = [it.id, ite.id]
                }
                this.allIndustryName.push(ite)
                if (ite.child) {
                  ite.child.forEach((item, index1) => {
                    if (standardIndustryId === item.id) {
                      industryId = [it.id, ite.id, item.id]
                    }
                    this.allIndustryName.push(item)
                    if (item.child) {
                      item.child.forEach((itemr, index) => {
                        if (standardIndustryId === itemr.id) {
                          industryId = [it.id, ite.id, item.id, itemr.id]
                        }
                        delete itemr.child
                        this.allIndustryName.push(itemr)
                      })
                    }
                  })
                }
              })
            }
          })
          this.industryOptionsTree = data
          this.industryIdid = industryId
        })
      } else {
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
          console.log(this.allIndustryName)
          this.industryOptionsTree = data
        })
      }
    },
    async getOrganizes () { // 管理客户获取接口
      let res = await context.http.get('/uaa/api/organizes/all/simple', { useStatus: 'USING', organizeType: 'ENTERPRISE' })
      this.organizesOptions = res.data
    },
    async organizesChange (id, flag) { // 管理客户查名下项目
      if (!flag) {
        this.tenantDetail.projectManagement.id = ''
        this.tenantDetail.building.id = ''
        this.options = []
        this.buildingOptions = []
      }
      let res = await context.http.get('/cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: id })
      this.options = res.data
    },
    async projectChange (id, flag) { // 项目下资产
      if (!flag) {
        this.tenantDetail.building.id = ''
        this.buildingOptions = []
      }
      let res = await context.http.get('/cms/api/buildings/newList', { useStatus: 'USING', projectId: id, page: 0, size: 9999, sort: 'id,asc' })
      this.buildingOptions = res.data
    },
    customerTypeState (val) {
      if (val) {
        if (val === 'COMPANY') {
          return '法人单位'
        } else if (val === 'PERSONAL') {
          return '个体户'
        } else if (val === 'BRANCH') {
          return '分支机构'
        } else if (val === 'OTHER') {
          return '其他单位'
        } else {
          return ''
        }
      }
    },
    tenantUseChange (val, flag) {
      if (!flag) {
        this.tenantDetail.industryId = ''
      }
      if (val === 'SHOP') {
        this.industry('业态')
      } else if (val === 'WORK') {
        this.industry('行业')
      } else if (val === 'MARKET') {
        this.industry('菜场业态')
      }
    },
    async industry (val) {
      let result = await context.http.get(`/uaa/api/paramet-managements/name?name=${val}`)
      this.industryOptions = result.data
    },
    decryptMsg (val) {
      return decrypt(val)
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    delPreviewImage () {
      this.tenantDetail.shopPhotos = ''
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        context.http.get('/uaa/api/users/allOnGroupPersonnel', { page: 0, size: 20000, sort: 'id,desc', jobStatus: 'ONJOB', queryName: query }).then(res => {
          if (res.status === 200) {
            this.loading = false
            this.operateUserOptions = res.data
            this.operateUserOptions = this.operateUserOptions.map(item => {
              return { value: item.id, label: item.name }
            })
          }
        })
      }
    },
    queryOperateUser () {
      this.remoteMethod(this.tenantDetail.operateUserName)
    },
    setAnnexs (annexURL, annexName) {
      this.tenantDetail.shopPhotos = annexURL
    },
    async documentType () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=证件类型')
      this.documentTypeOptions = result.data
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
    handleSelect () {
      hub.eventHub.$emit('teantName', this.tenantDetail.teantName)
    },
    confirm () {
      this.$refs['tenantDetail'].validate((valid) => {
        if (valid) {
          if (!this.industryIdid || !this.industryIdid.length) {
            this.$message({
              message: '请输入行业',
              type: 'warning'
            })
            return
          }
          this.tenantDetail.iDNumber = this.tenantDetailIDNumber
          if (!this.tenantDetail.building || !this.tenantDetail.building.id) {
            this.tenantDetail.building = null
          }
          context.http.put('cms/api/tenant', this.tenantDetail).then(res => {
            if (res.status === 200) {
              this.tenantDetail.building = { id: '' }
              this.readOnly = true
              this.$message.success('保存成功')
              this.$emit('handleEdit', 0, this.tenantDetail)
            }
          }).catch(error => {
            this.tenantDetail.building = { id: '' }
            console.log(error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancel () {
      this.$refs['tenantDetail'].resetFields()
      this.readOnly = true
      this.$emit('handleEdit', 0, this.tenantDetail)
    },
    taxRegistrationFormated (val) {
      let obj = {
        'BZBC': '本镇本村',
        'BZWC': '本镇外村',
        'ZWZC': '镇外登记',
        'WZC': '未登记'
      }
      return obj[val]
    }
  }
}
</script>
<style lang="scss">
.industry_propsTree_addtenant {
  .el-cascader-panel {
    .el-cascader-menu:nth-of-type(1) {
      .el-scrollbar__wrap {
        .el-scrollbar__view {
          li {
            > label {
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
.tenant-files {
  .el-form {
    height: 485px;
    overflow-y: auto;
    // position: relative;
    // padding-top: 20px;
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
  .el-form-item {
    width: 28%;
    margin-left: 16px;
    margin-right: 10px;
    margin-bottom: 20px;
    vertical-align: top;
    display: inline-block;
  }
  .tf-left {
    width: 100%;
  }
  .tf-right {
    text-align: center;
    .imgwarp {
      margin-top: 20px;
      width: 180px;
      height: 160px;
      text-align: center;
      img {
        max-width: 180px;
        max-height: 100%;
      }
    }
    .preview-wrap {
      display: flex;
      justify-content: flex-start;
      margin: 10px 0;
      .preview {
        width: 248px;
        height: 140px;
        border: 1px solid #f7f9fd;
        margin: 0 30px 0 0;
        position: relative;
        background: #f7f9fd;
        &:hover {
          .pw-bottom {
            background-color: #4893fc;
          }
        }
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
          height: 198px;
          opacity: 0;
          cursor: pointer;
        }
        .tips1 {
          color: #3575f6 !important;
          text-align: center;
          margin-top: 40px;
          padding-left: 0 !important;
          i {
            font-size: 32px;
          }
        }
        .icon-cms_cuowu {
          cursor: pointer;
          position: absolute;
          top: -10px;
          right: -10px;
        }
      }

      .map {
        width: 910px;
        height: 200px;
        border: 1px solid #ddd;
      }

      .errorTip {
        color: red;
        bottom: -18px;
        position: absolute;
      }
      + p {
        font-size: 12px;
        color: #777;
        margin: 0 0 10px 0;
      }
      img {
        width: 248px;
        height: 140px;
      }
    }
  }
  .editbtns {
    width: 60px;
    height: 26px;
    line-height: 26px;
    // background: rgba(49, 117, 246, 1);
    border-radius: 4px;
    text-align: center;
    float: right;
    margin: 0 16px 0 0;
    font-size: 14px;
    cursor: pointer;
    color: #fff !important;
    i {
      font-size: 14px;
      vertical-align: top;
    }
  }
  .adddynamicbtn {
    width: auto;
    border: 1px solid #0f75ff;
    border-radius: 4px;
    color: #0f75ff;
    cursor: pointer;
    font-size: 12px;
    padding: 2px 6px;
    margin: 20px auto;
    height: 22px;
    line-height: 17px;
    input {
      position: absolute;
      right: 0;
      width: 100%;
      height: 20px;
      opacity: 0;
      cursor: pointer;
    }
  }
  .aliUpload {
    opacity: 0;
    position: relative;
    top: -92px;
    width: 100%;
    height: 100%;
    input {
      font-size: 12px;
    }
  }
  .dialog-footer {
    background-color: #fff;
    display: flex;
    flex-direction: row-reverse;
    span {
      width: 60px;
      height: 26px;
      line-height: 26px;
    }
    .details_submitBtn {
      margin-right: 20px;
    }
  }
  .cttitle {
    font-size: 14px;
    color: #777;
  }
  .cttitle + span {
    display: inline-block;
    font-size: 14px;
    width: 185px;
    overflow: hidden;
    color: #262626;
  }
  // .industryCascader {
  //   // height: 36px;
  //   // width: 280px;
  //   // overflow-y: auto;
  //   .el-input {
  //     width: 286px!important;
  //   }
  // }
  .el-cascader--small {
    width: 100%;
  }
}
</style>
<style lang="scss">
.tenant-files {
  .oss_file {
    width: 100%;
    height: 100%;
    top: -49px;
  }
}
</style>
