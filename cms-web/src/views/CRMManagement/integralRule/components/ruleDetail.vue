<template>
  <div>
    <div class="dl-head info_tab" v-if="createForm.ruleType !== 'Unified'">
      <ul class="nav">
        <li @click="changeNav(index)"
            v-for="(item, index) in navList"
            :key="index"
            :class="item.value ? 'select_active' : ''">{{item.label}}</li>
      </ul>
    </div>
    <div> 
      <div v-show="setp1111">
        <el-form :model="createForm"
                :rules="createRulese"
                style="margin-top: 20px;"
                ref="createaccount">
          <el-form-item :label-width="formLabelWidth" prop="projectId">
            <div class="itemtitle">项目简称<i class="required">*</i></div>
            <span v-if="readOnly">{{createForm.referred}}</span>
            <el-select v-model="createForm.projectId" v-else
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
            <span v-if="readOnly">{{createForm.name}}</span>
            <el-input v-model="createForm.name" v-else
                      maxlength="50"
                      placeholder="请输入内容"></el-input>
            
          </el-form-item>
          <el-form-item :label-width="formLabelWidth"
                        style="margin-bottom: 20px;">
            <div class="itemtitle">适用于的会员卡<i class="required">*</i></div>
            <span v-if="readOnly">
              <span v-for="(item, index) in createForm.integralRuleMemberCards" :key="index">
                {{item.memberCardName}}
              </span>
            </span>
            <el-select v-model="createForm.mbCards" multiple v-else
                      @change="forceUpdate()"
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
            <span v-if="readOnly">{{createForm.ruleTypeName}}</span>
            <el-select v-model="createForm.ruleType" v-else
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
            <span v-if="readOnly">{{createForm.amount}}</span>
            <el-input v-model="createForm.amount" v-else
                      type="number"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" prop="integral" v-if="createForm.ruleType === 'Unified'"
                        style="margin-bottom: 20px;">
            <div class="itemtitle">兑换积分<i class="required">*</i></div>
            <span v-if="readOnly">{{createForm.integral}}</span>
            <el-input v-model="createForm.integral" v-else
                      type="number"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth"
                        style="margin-bottom: 20px;">
            <div class="itemtitle">单笔消费满多少元时支持积分</div>
            <span v-if="readOnly">{{createForm.conditionAmount}}</span>
            <el-input v-model="createForm.conditionAmount" v-else
                      type="number"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth"
                        prop="ruleType"
                        style="margin-bottom: 20px;">
            <div class="itemtitle">状态<i class="required">*</i></div>
            <span v-if="readOnly">{{createForm.useStatusName}}</span>
            <el-select v-model="createForm.useStatus" v-else
                      placeholder="请选择">
              <el-option v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="!setp1111">
        <div class="template">
          <div class="tl-head clearfix">
            <div class="pj-search">
              <el-input v-model="searchName" :placeholder="placeholder" style=""></el-input>
              <div style="margin-left:30px;" @click="search"
                    class="query-btn">查询</div>
            </div>
            <span class="float-right" style="margin-right: 10px;cursor: pointer;margin-top: 10px;" v-if="!readOnly">
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
          <div class="tl-content details_table">
            <el-table :data="childRules" 
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
    </div>
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
export default {
  name: '',
  props: {
    cardsData: {
      type: Object
    }
  },
  data () {
    return {
      navList: [{
        label: '积分规则信息',
        value: true
      }, {
        label: '商户积分列表',
        value: false
      }],
      formLabelWidth: '',
      memberCardOptions: [],
      statusOptions: [
        { name: '使用中', value: 'USING' },
        { name: '已停用', value: 'DISABLE' }
      ],
      ruleTypeOptions: [
        {name: '统一积分规则', value: 'Unified'},
        {name: '不同店铺不同积分规则', value: 'Shop'},
        {name: '不同业态不同积分规则', value: 'Industry'}
      ],
      createRulese: {
        projectId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入积分规则名称', trigger: 'blur' }
        ],
        mbCards: [
          { required: true, message: '请选择会员卡', trigger: 'change' }
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
      readOnly: true,
      setp1111: true,
      searchName: '',
      mbCards: [],
      childRules: [],
      createForm: {mbCards: []},
      placeholder: ''
    }
  },
  created () {
    this.options = this.$store.state.projectManagementsList
    this.createForm = this.cardsData
    let mbCards = []
    this.createForm.integralRuleMemberCards.forEach(ele => {
      mbCards.push(ele.memberCardId)
    })
    this.createForm.mbCards = mbCards
    this.childRules = this.createForm.childRules
    this.getmemberCard()
    if (this.createForm.ruleType === 'Shop') {
      this.placeholder = '品牌'
      this.navList[1].label = '商户积分列表'
    } else {
      this.placeholder = '业态'
      this.navList[1].label = '业态积分列表'
    }
  },
  methods: {
    search () {
      if (!this.searchName) { this.childRules = this.createForm.childRules }
      let res = this.createForm.childRules.filter(ele => {
        return ele.businessName.indexOf(this.searchName) > -1
      })
      this.childRules = res
    },
    changeNav (inx) {
      this.navList.forEach(item => {
        item.value = false
      })
      this.navList[inx].value = true
      if (inx === 0) {
        this.setp1111 = true
      } else if (inx === 1) {
        this.setp1111 = false
      }
    },
    onEdit () {
      this.readOnly = false
    },
    onClose () {
      this.readOnly = true
    },
    forceUpdate () {
      this.$forceUpdate()
    },
    async getmemberCard () {
      let result = await context.http.get(`crm/api/integralRules/memberCard?projectId=${this.createForm.projectId}&integralRuleId=${this.createForm.id}`)
      if (result.status !== 200) return
      this.memberCardOptions = result.data
    },
    ruleTypeChange () {
      let ruleType = this.createForm.ruleType
      if (ruleType === 'Shop') {
        this.tlHead = '不同商户不同积分兑换比例'
        this.navList[1].label = '商户积分列表'
        this.placeholder = '品牌'
      } else if (ruleType === 'Industry') {
        this.tlHead = '不同业态不同积分兑换比例'
        this.navList[1].label = '业态积分列表'
        this.placeholder = '业态'
      } else if (ruleType === 'Unified') {

      }
      this.merchantData = []
    },
    downloadTepl () {
      axios({method: 'GET', url: `crm/api/integralRules/report/business?id=${this.createForm.id}&projectId=${this.createForm.projectId}&ruleType=${this.createForm.ruleType}`, responseType: 'blob'}).then(res => {
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
            this.childRules = res.data.business
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
    },
    saveEdit () {
      this.$refs['createaccount'].validate((valid) => {
        if (valid) {
          let cards = this.createForm.mbCards
          if (cards.length === 0) {
            this.$message.error('请选择会员卡')
            return
          }
          let cards2 = []
          cards.forEach(ele => {
            cards2.push({memberCardId: ele})
          })
          let createForm = JSON.parse(JSON.stringify(this.createForm))
          createForm.integralRuleMemberCards = cards2
          createForm.childRules = this.childRules
          context.http.put(`crm/api/integralRules`, createForm).then(res => {
            if (res.status === 200) {
              this.$emit('onHide')
              this.$emit('query')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .dl-head {
    margin-top: 0!important;
  }
  .info_tab {
    height: 48px;
    display: -ms-flexbox;
    display: flex;
    background-color: #fff;
    margin: 10px 0 0px 0;
    box-shadow: 1px 2px 5px #eee;
    border-radius: 3px;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -ms-flex-align: center;
    align-items: center;
    padding-right: 44px;
    border-bottom: 1px solid #ecedef;

    .nav {
      display: -ms-flexbox;
      display: flex;

      li.select_active {
        border-bottom: 2px solid #3175d2;
        color: #3175d2;
        font-weight: bolder;
      }

      li {
        width: 140px;
        text-align: center;
        font-size: 14px;
        color: #666;
        height: 46px;
        line-height: 46px;
        border-bottom: 2px solid #fff;
        cursor: pointer;
      }
    }
  }
  .card-serial{
    border:1px solid rgba(235,235,235,1);
    font-size: 14px;
    margin-bottom: 10px;
    .serial-head{
      padding: 10px 14px;
      margin-bottom: 10px;
      background:rgba(250,250,250,1);
      > span {
        display: inline-block;
        width: 16px;
        height: 16px;
        line-height: 16px;
        border: 1px solid #3575F6;
        border-radius: 2px;
        text-align: center;
        cursor: pointer;
        i {
          color: #3575F6;
          position: relative;
          right: 1px;
        }
      }
    }
  }
  .el-form-item {
    display: inline-block;
    width: 22%;
    margin-left: 16px;
    vertical-align: top;
  }
  .itemtitle{
    margin-bottom: 10px;
    font-size: 14px;
    + span {
      font-size: 12px;
    }
  }
  .buildingImg{
    width: 160px;
    height: 100px;
    text-align: center;
    border: 1px dashed #dfdfdf;
    cursor: pointer;
    position: relative;
    span{
      color: #3577f6;
    }
    img{
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
    .icon-adds{
      background: url(../../../../assets/plus.png) no-repeat;
      background-size: contain;
      margin-bottom: 6px;
    }
    i {
      color: #0076da;
      font-size: 24px;
    }
  }
  .dc-right_div {
    margin-top: 20px;
    .cttitle span:nth-of-type(2) {
      color: #0f75ff;
      font-size: 12px;
      float: right;
      cursor: pointer;
    }
    .psotmaster span {
      color: #666 !important;
    }
    .addbdbtn{
      display: inline-block;
      width: 100px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border: 1px solid #0076da;
      font-size: 12px;
      border-radius: 4px;
      color: #0076da;
      cursor: pointer;
    }
    .underline{
      border-bottom: 1px solid #e5e5e5;
    }
    .floorwrap{
      font-size: 14px;
      .xiala{
        width: 16px;
        border: none;
      }
      .vertical{
        display: inline-block;
        width: 4px;
        height: 16px;
        vertical-align: text-bottom;
        background:rgba(53,119,246,1);
      }
    }
    .fw-content{
      height: 40px;
      margin-bottom: 16px;
      .el-input{
        width: 60%;
      }
      i{
        display: inline-block;
      }
      .fa-move{
        background: url(../../../../assets/move.png) no-repeat;
        background-size: contain;
        cursor: pointer;
      }
      .fa-delete{
        background: url(../../../../assets/delete.png) no-repeat;
        background-size: contain;
      }
    }
    .fw-head{
      margin: 20px 0;
    }
  }
  .template{
    border:1px solid rgba(242,242,242,1);
    .tl-head {
      padding: 10px 0 10px 10px;
      color: #333;
      border-bottom:1px solid #dadada;
    }
  }
  .pj-search {
    width: 50%;
    display: inline-block;
    margin-bottom: 10px;
    .el-select{
      display: inline-block;
      margin: 15px;
    }
    div {
      display: inline-block;
      width: 200px;
    }
    .query-btn{
      width: 100px;
    }
  }
</style>
