<template>
  <div>
      <el-form :model="createForm"
               :rules="createRulese"
               style="margin-top: 20px;"
               ref="createaccount">
        <el-form-item :label-width="formLabelWidth" prop="projectId">
          <div class="itemtitle">项目简称<i class="required">*</i></div>
          <el-select v-model="createForm.projectId"
                     placeholder="请选择"
                     @change="getmemberCard"
                     >
            <el-option v-for="item in options"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="name"
                      style="margin-bottom: 20px;">
          <div class="itemtitle">积分规则名称<i class="required">*</i></div>
          <el-input v-model="createForm.name"
                    maxlength="50"
                    placeholder="请输入内容"></el-input>
          
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="integralRuleMemberCards"
                      style="margin-bottom: 20px;">
          <div class="itemtitle">适用于的会员卡<i class="required">*</i></div>
          <el-select v-model="createForm.integralRuleMemberCards" multiple
                     placeholder="请选择"
                     >
            <el-option v-for="item in memberCardOptions"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth"
                      prop="ruleType"
                      style="margin-bottom: 20px;">
          <div class="itemtitle">积分规则适用范围<i class="required">*</i></div>
          <el-select v-model="createForm.ruleType"
                     placeholder="请选择"
                     @change="ruleTypeChange">
            <el-option v-for="item in ruleTypeOptions"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="amount" v-if="createForm.ruleType === 'Unified'"
                      style="margin-bottom: 20px;">
          <div class="itemtitle">消费金额(元)<i class="required">*</i></div>
          <el-input v-model="createForm.amount"
                    type="number"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="integral" v-if="createForm.ruleType === 'Unified'"
                      style="margin-bottom: 20px;">
          <div class="itemtitle">兑换积分<i class="required">*</i></div>
          <el-input v-model="createForm.integral"
                    type="number"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth"
                      style="margin-bottom: 20px;">
          <div class="itemtitle">单笔消费满多少元时支持积分</div>
          <el-input v-model="createForm.conditionAmount"
                    type="number"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div class="template" v-if="createForm.ruleType !== 'Unified'">
        <div class="tl-head clearfix">{{tlHead}}
          <span class="float-right" style="margin-right: 10px;cursor: pointer;">
            <el-dropdown>
              <span class="el-dropdown-link" style="color: #3575F6">
                导入积分比例<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><span @click="downloadTepl()">下载积分兑换模板</span></el-dropdown-item>
                <el-dropdown-item><span>导入积分兑换模板
                    <input type="file" style="position: absolute;opacity: 0;bottom: 17px;left: 0;width: 123px;" @change="importModel($event)">
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
        <div class="tl-content">
          <el-table :data="merchantData" 
                    style="width: 100%"
                    ref="multipleTable">
            <el-table-column prop="businessId" v-if="createForm.ruleType === 'Shop'"
                            label="品牌id"
                            align="center"></el-table-column>
            <el-table-column prop="businessId" v-else
                            label="业态id"
                            align="center"></el-table-column>
            <el-table-column prop="roomsName" v-if="createForm.ruleType === 'Shop'"
                            label="房源号"
                            align="center"></el-table-column>
            <el-table-column prop="businessName" v-if="createForm.ruleType === 'Shop'"
                            label="品牌"
                            align="center"></el-table-column>
            <el-table-column prop="businessName" v-else
                            label="业态"
                            align="center"></el-table-column>
            <el-table-column prop="amount"
                            label="消费金额(元)"
                            align="center"></el-table-column>
            <el-table-column prop="integral"
                            label="积分兑换"
                            align="center"></el-table-column>
          </el-table>
        </div>
      </div>
  </div>  
</template>
<script>
import context from '@/service'
import axios from 'axios'
export default {
  name: '',
  data () {
    return {
      createRulese: {
        projectId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入积分规则名称', trigger: 'blur' }
        ],
        integralRuleMemberCards: [
          { required: true, message: '请选择会员卡', trigger: 'change' }
        ],
        ruleType: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        amount: [
          { required: true, message: '请输入消费金额', trigger: 'blur' }
        ],
        integral: [
          { required: true, message: '请输入兑换积分', trigger: 'blur' }
        ]
      },
      createForm: {
        projectId: '',
        name: '',
        integralRuleMemberCards: '',
        ruleType: 'Unified',
        amount: '',
        integral: ''
      },
      ruleTypeOptions: [
        {name: '统一积分规则', value: 'Unified'},
        {name: '不同商户不同积分规则', value: 'Shop'},
        {name: '不同业态不同积分规则', value: 'Industry'}
      ],
      formLabelWidth: '',
      memberCardOptions: [],
      tlHead: '不同商户不同积分兑换比例',
      merchantData: []
    }
  },
  created () {
    this.options = this.$store.state.projectManagementsList
  },
  methods: {
    ruleTypeChange () {
      let ruleType = this.createForm.ruleType
      if (ruleType === 'Shop') {
        this.tlHead = '不同商户不同积分兑换比例'
      } else if (ruleType === 'Industry') {
        this.tlHead = '不同业态不同积分兑换比例'
      } else if (ruleType === 'Unified') {

      }
      this.merchantData = []
    },
    async getmemberCard () {
      let result = await context.http.get(`crm/api/integralRules/memberCard?projectId=${this.createForm.projectId}`)
      if (result.status !== 200) return
      this.memberCardOptions = result.data
    },
    restform () {
      this.createForm = {
        projectId: '',
        name: '',
        integralRuleMemberCards: '',
        ruleType: 'Unified',
        amount: '',
        integral: ''
      }
    },
    confirm () {
      this.$refs['createaccount'].validate((valid) => {
        if (valid) {
          let cards = this.createForm.integralRuleMemberCards
          let cards2 = []
          cards.forEach(ele => {
            cards2.push({memberCardId: ele})
          })
          let createForm = JSON.parse(JSON.stringify(this.createForm))
          createForm.integralRuleMemberCards = cards2
          createForm.childRules = this.merchantData
          context.http.post(`crm/api/integralRules`, createForm).then(res => {
            if (res.status === 201) {
              this.$emit('close')
              this.restform()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    downloadTepl () {
      axios({method: 'GET', url: `crm/api/integralRules/report/business?projectId=${this.createForm.projectId}&ruleType=${this.createForm.ruleType}`, responseType: 'blob'}).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        let fileName = res.headers['content-disposition'].substring(20)
        fileName = decodeURI(fileName)
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(url)
      })
    },
    async importModel (event) {
      let files = event.target.files
      let form = new FormData()
      form.append('file', files[0])
      form.append('ruleType', this.createForm.ruleType)
      form.append('projectId', this.createForm.projectId)
      let name = files[0].name
      let index = name.lastIndexOf('.')
      let type = name.substr(index + 1).toLowerCase()
      if (files[0].size > (1024 * 1024 * 50)) {
        this.$message({
          message: '文件大小不能超过50M',
          type: 'error'
        })
        return
      }
      if (index > 0 && type !== 'xlsx' && type !== 'xls') {
        this.$message({
          message: '格式错误，请上传xlsx、xls格式文件',
          type: 'error'
        })
      } else {
        context.http.post('/crm/api/integralRules/childRule/file', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          event.target.value = ''
          if (res.status === 200) {
            this.merchantData = res.data.business
            if (res.data.countError > 0 && res.data.count !== 0) {
              this.$message({
                message: `成功导入数据${res.data.count}条，${res.data.countError}条数据导入失败`,
                type: 'warning'
              })
            } else if (res.data.count === 0) {
              this.$message.error('数据导入失败，请检查后重新导入')
            } else {
              this.$message({
                message: '数据全部导入成功',
                type: 'success'
              })
            }
          }
        }).catch(error => {
          event.target.value = ''
          console.info(error)
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-form-item {
    width: 24%;
    display: inline-block;
    margin-right: 5px;
  }
  .itemtitle{
    margin-bottom: 10px;
  }
  .el-input{
    width: 200px;
  }
  .template{
    border:1px solid rgba(242,242,242,1);
    .tl-head {
      padding: 10px 0 10px 10px;
      color: #333;
      background:rgba(250,250,250,1);
      border-bottom:1px solid #dadada;
    }
  }
</style>
