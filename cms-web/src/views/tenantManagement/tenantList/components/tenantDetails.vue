<template>
  <div class="tenant-details">
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            :showEditBtn="showEdit"
            @on-edit="onEdit"
            @on-hide="onHide">
      <div class="tenant-details details-content"
           slot="drawer">
        <div class="headTab">
          <!-- <span v-for="(item,index) in headTabItem" :key="index" :class="{'active':index===headTabIndex}" @click="changeTab(index)">{{item}}</span> -->
          <span :class="{'active':headTabIndex===0}"
                @click="changeTab(0)">基本资料</span>
          <span :class="{'active':headTabIndex===1}"
                @click="changeTab(1)"
                v-if="tenantDetail.contractDTOS.length > 0">营业额</span>
        </div>
        <div class="main-content">
          <div class="dl-content clearfix"
               v-if="headTabIndex===0">
            <el-form :model="tenantDetail"
                     ref="tenantDetail"
                     :rules="tenantDetailRules">
              <div class="dc-right float-right">
                <div class="basic-item">
                  <p>选择项目</p>
                  <div class="basic-select">
                    <div @click="choose('project')"
                         class="clearfix"
                         :class="selProject ? 'selectInput selectActive' : 'selectInput'">
                      <img :src="chooseObj.previewImage" />
                      <span>{{chooseObj.projectName}}</span>
                      <span class="iconfont icon-xiala-"
                            v-show="!readOnly"></span>
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
                  <span v-if="readOnly">{{tenantDetail.customerType === 'PERSONAL' ? '个人' : tenantDetail.customerType === 'COMPANY' ? '企业' : '-'}}</span>
                  <el-select v-model="tenantDetail.customerType"
                             v-else
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
                  <span v-if="readOnly">{{tenantDetail.teantName}}</span>
                  <el-autocomplete v-else
                                   v-model="tenantDetail.teantName"
                                   :fetch-suggestions="searchTeantName"
                                   placeholder="请输入内容"
                                   @select="handleSelect"></el-autocomplete>
                </el-form-item>
                <el-form-item prop="referred"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">品牌<i class="required">*</i></div>
                  <span v-if="readOnly">{{tenantDetail.referred}}</span>
                  <el-input v-model="tenantDetail.referred"
                            v-else
                            maxlength="30"
                            placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item prop="industryId"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">业态<i class="required">*</i></div>
                  <span v-if="readOnly">{{tenantDetail.industry}}</span>
                  <el-select v-model="tenantDetail.industryId"
                             v-else
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
                  <span v-if="readOnly">{{tenantDetail.contact}}</span>
                  <el-input v-model="tenantDetail.contact"
                            v-else
                            maxlength="20"
                            placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom: 20px;">
                  <div class="cttitle">证件类型</div>
                  <span v-if="readOnly">{{tenantDetail.certificateValue}}</span>
                  <el-select v-model="tenantDetail.certificate"
                             v-else
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
                  <span v-if="readOnly">{{tenantDetail.iDNumber}}</span>
                  <el-input v-model="tenantDetail.iDNumber"
                            v-else
                            placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item prop="telephone">
                  <div class="cttitle">手机号<i class="required">*</i></div>
                  <span v-if="readOnly">{{tenantDetail.telephone}}</span>
                  <el-input v-model="tenantDetail.telephone"
                            v-else
                            placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item prop="email">
                  <div class="cttitle">现居住地址</div>
                  <span v-if="readOnly">{{tenantDetail.nowAddress}}</span>
                  <el-input v-model="tenantDetail.nowAddress"
                            maxlength="100"
                            v-else
                            placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item prop="email">
                  <div class="cttitle">邮箱</div>
                  <span v-if="readOnly">{{tenantDetail.email}}</span>
                  <el-input v-model="tenantDetail.email"
                            v-else
                            placeholder="请输入内容"></el-input>
                </el-form-item>
                <!-- <el-form-item style="width: 97%">
                  <div class="cttitle">客户标签</div>
                  <span v-if="readOnly">{{tenantDetail.tag}}</span>
                  <el-input v-else
                            type="textarea"
                            resize="none"></el-input>
                </el-form-item> -->
              </div>
              <div class="dc-right float-right">
                <div class="dr-head">工商信息<span @click="synchronization"
                        v-if="!readOnly">同步工商信息</span></div>
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
                            v-else
                            type="number"
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
                  <div class="cttitle">企业类型</div>
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
                            type="textarea"
                            resize="none"></el-input>
                </el-form-item>
              </div>
              <div class="dc-right float-right invoice-information"
                   style="margin-bottom: 100px;">
                <div class="dr-head">开票信息</div>
                <el-form-item prop="projectName">
                  <div class="cttitle">开户银行</div>
                  <span v-if="readOnly">{{tenantDetail.depositBank}}</span>
                  <el-input v-model="tenantDetail.depositBank"
                            v-else
                            placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom: 20px;">
                  <div class="cttitle">银行账号</div>
                  <span v-if="readOnly">{{tenantDetail.bankAccount}}</span>
                  <el-input v-model="tenantDetail.bankAccount"
                            v-else
                            maxlength="50"
                            placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom: 20px;">
                  <div class="cttitle">纳税人识别号</div>
                  <span v-if="readOnly">{{tenantDetail.taxNo}}</span>
                  <el-input v-model="tenantDetail.taxNo"
                            v-else
                            maxlength="50"
                            placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom: 20px;">
                  <div class="cttitle">电话</div>
                  <span v-if="readOnly">{{tenantDetail.phone}}</span>
                  <el-input v-model="tenantDetail.phone"
                            v-else
                            maxlength="30"
                            type="tel"
                            placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom: 20px;width: 63%">
                  <div class="cttitle">开票地址</div>
                  <span v-if="readOnly">{{tenantDetail.taxAddress}}</span>
                  <el-input v-model="tenantDetail.taxAddress"
                            v-else
                            placeholder="请输入内容"></el-input>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="turnoverContent"
               v-else>
            <div class="shopNameTab">
              <span v-for="(item,index) in tenantDetail.contractDTOS"
                    :key="index"
                    :class="{'active':index===shopNameTabIndex}"
                    @click="shopNameTabChange(item,index)">{{item.shopName?item.shopName:item.contractNo}}</span>
            </div>
            <div class="toolDiv">
              <div class="seach">
                <div>
                  <p>开始期限</p>
                  <el-date-picker v-model="startTime"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  placeholder="开始期限">
                  </el-date-picker>
                </div>
                <span class="space"> —— </span>
                <div>
                  <p>截止期限</p>
                  <el-date-picker v-model="endTime"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  placeholder="截止期限">
                  </el-date-picker>
                </div>
                <el-button type="primary"
                           class="queryBtn"
                           @click="getTurnoverList">查询</el-button>
              </div>
              <div class="downUpLoad">
                <span class="downBtn"
                      @click="downLoadModel">下载营业额模版</span>
                <span class="UpBtn">
                  <i>导入营业额</i>
                  <input type="file"
                         @change="imageChange('addapp', $event)">
                  <p class="shade"
                     v-if="isImport"
                     @click="affirmFn"></p>
                </span>
              </div>
            </div>
            <div style="padding-left: 30px;">{{startTime}} ～ {{endTime}} 营业额合计　<i style="color:#f00">{{totalTurnover}}</i>元</div>
            <div class="table">
              <el-table :data="tableData"
                        style="width: 100%">
                <el-table-column prop="recordDate"
                                 label="日期"
                                 align="center"></el-table-column>
                <el-table-column prop="turnoverAmount"
                                 label="营业额/元"
                                 align="center"></el-table-column>
              </el-table>
            </div>
            <div class="ctc-foot">
              <div class="page">
                <div class="pagingnum">显示
                  <select v-model="pgSize"
                          @change="currentSel">
                    <option v-for="item in pgNumoptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </option>
                  </select>
                  条目 <span style="padding-left: 30px">显示从{{pgSize*(currentPage - 1) + 1}}到{{pgSize*currentPage}}项结果，共<span class="style: red">{{total}}</span>条</span>
                </div>
                <el-pagination v-if="total > 0"
                               background
                               layout="prev, pager, next"
                               :page-size=pgSize
                               :total="total"
                               :current-page="currentPage"
                               @current-change="current_change">
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer"
           v-if="!readOnly"
           class="dialog-footer">
        <el-button @click="onHide"
                   class="close-button">关闭</el-button>
        <el-button type="primary"
                   @click="editTenant('tenantDetail')"
                   class="defaultbtn dialog-confirmBtn">确 定</el-button>
      </div>
    </drawer>
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import Drawer from '@/components/drawer.vue'
export default {
  components: {
    Drawer
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    tenantDetail: {
      type: Object,
      default: {}
    }
  },
  watch: {
    tenantDetail: {
      handler: function () {
        this.readOnly = true
        if (this.hasAuthority('02030102')) {
          this.showEdit = true
        }
        this.industry()
        this.documentType()
        this.chooseObj = this.tenantDetail.projectManagement
        // console.log(this.tenantDetail)
      }
    }
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
      //
      isImport: false, // 此条合同能否直接导入数据 false能  ture确认提示
      centerDialogVisible: false,
      currentPage: 1,
      pgNum: 1,
      total: 0,
      pgSize: 20,
      pgNumoptions: [
        {
          value: 20,
          label: '20'
        },
        {
          value: 30,
          label: '30'
        },
        {
          value: 50,
          label: '50'
        }
      ],
      tableData: [
      ],
      startTime: '',
      endTime: '',
      totalTurnover: '2，112，222',
      headTabItem: ['基本资料', '营业额'],
      headTabIndex: 0,
      shopNameTabIndex: 0,
      contractId: null, // 切换店名的合同id
      tenantId: null, // 客户id
      //
      drawerTitle: '查看客户信息',
      readOnly: true,
      showEdit: true,
      industryOptions: [],
      customerOptions: [
        { label: '请选择', value: '' },
        { label: '企业', value: 'COMPANY' },
        { label: '个人', value: 'PERSONAL' }
      ],
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
      documentTypeOptions: {},
      pickerOptions0: {},
      errorField: true,
      errorTip: '',
      center: [],
      selHourse: false,
      selProject: false,
      chooseObj: {},
      projectList: [],
      selectItem: {}
    }
  },
  mounted () {
    this.documentType()
    this.tenantId = this.tenantDetail.id
    if (this.tenantDetail.contractDTOS.length > 0) {
      this.getLastMonthDate()// 获取上一个月的第一天和最后一天
      this.contractId = this.tenantDetail.contractDTOS[0].id // 初始化默认第一个合同id
      this.getTurnoverList()// 营业额列表
      this.isImportFn()// 判断此条合同能否直接导入营业额
    }
    this.chooseObj = this.tenantDetail.projectManagement
  },
  methods: {
    async getTurnoverList () { // 获取营业额
      let result = await context.http.get('cms/api/tenantTurnover', { sort: 'recordDate,asc', startDate: this.startTime, endDate: this.endTime, tenantId: this.tenantId, contractId: this.contractId, page: (this.currentPage - 1), size: this.pgSize })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      this.totalTurnover = Number(result.headers['amount'])
    },
    getLastMonthDate () {
      var nowdays = new Date()
      var year = nowdays.getFullYear()
      var month = nowdays.getMonth()
      if (month === 0) {
        month = 12
        year = year - 1
      }
      if (month < 10) {
        month = '0' + month
      }
      this.startTime = year + '-' + month + '-' + '01'// 上个月的第一天
      var myDate = new Date(year, month, 0)
      this.endTime = year + '-' + month + '-' + myDate.getDate()// 上个月的最后一天
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.getTurnoverList()
    },
    currentSel () {
      this.currentPage = 1
      this.getTurnoverList()
    },
    changeTab (i) {
      this.headTabIndex = i
      if (this.headTabIndex === 1) {
        this.showEdit = false
      } else if (this.headTabIndex === 0 && this.hasAuthority('02030102')) {
        this.showEdit = true
      }
    },
    shopNameTabChange (item, index) {
      this.currentPage = 1
      this.shopNameTabIndex = index
      this.contractId = item.id
      this.getTurnoverList()
      this.isImportFn()
    },
    async isImportFn () {
      let result = await context.http.get('/cms/api/tenantTurnover/isImport', { contractId: this.contractId })
      this.isImport = result.data
      console.log(this.isImport)
    },
    affirmFn () {
      this.$emit('affirmDialog', this.contractId, this.tenantId)
    },
    imageChange (state, event) {
      let files = event.target.files
      let form = new FormData()
      form.append('file', files[0])
      form.append('contractId', this.contractId)
      form.append('tenantId', this.tenantId)
      let name = files[0].name
      let index = name.lastIndexOf('.')
      let type = name.substr(index + 1).toLowerCase()
      if (index > 0 && type !== 'xlsx' && type !== 'xls') {
        this.$message({
          message: '格式错误，请上传xlsx格式文件',
          type: 'error'
        })
      } else {
        context.http.post('/cms/api/tenantTurnover/file', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          this.$message({
            message: '导入成功！',
            type: 'success'
          })
          this.getTurnoverList()
        }).catch(error => {
          console.info(error)
        })
      }
    },
    async downLoadModel () {
      axios({ method: 'GET', url: '/cms/api/tenantTurnover/file', responseType: 'blob' }).then(res => {
        // console.log(res)
        let url = window.URL.createObjectURL(new Blob([res.data]))
        console.log(url)
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
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    async onEdit () {
      this.readOnly = false
      this.industry()
      this.queryProjectList()
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
      this.chooseObj = this.tenantDetail.projectManagement
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
        this.tenantDetail.registCapi = fullDetails.RegistCapi
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
    synchronization () {
      this.handleSelect({ Name: this.tenantDetail.teantName })
    },
    choose (state) {
      if (this.readOnly) {
        return false
      }
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
    async editTenant () {
      let _this = this
      this.$refs['tenantDetail'].validate((valid) => {
        if (valid) {
          this.tenantDetail.projectManagement = this.chooseObj
          this.tenantDetail.checkDate = this.formatDate(this.tenantDetail.checkDate)
          this.tenantDetail.startDate = this.formatDate(this.tenantDetail.startDate)
          this.tenantDetail.teamEnd = this.formatDate(this.tenantDetail.teamEnd)
          context.http.put('/cms/api/tenant', this.tenantDetail).then(res => {
            if (res) {
              _this.$emit('drawerClose')
              _this.$emit('query')
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
    },
    TimeTrans (val) {
      if (val) {
        return val.substring(0, 10)
      }
      return ''
    },
    onHide () {
      this.$emit('drawerClose', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.tenant-details {
  .turnoverContent {
    min-height: 600px;
    margin-top: 25px;
    box-shadow: 3px -1px 5px #eee;
    border: 1px solid #eee;
    .shopNameTab {
      height: 40px;
      background-color: #fafafa;
      border-bottom: 1px solid #eeeeee;
      display: flex;
      justify-content: flex-start;
      span {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        text-align: center;
        padding: 0 8px;
        cursor: pointer;
        &.active {
          color: #ffffff;
          background-color: #3577f6;
        }
      }
    }
  }
  .table {
    padding: 20px;
    border: none;
    .el-table--fit {
      border: 1px solid #eeeeee;
    }
  }
  .toolDiv {
    padding: 30px;
    display: flex;
    .downUpLoad {
      padding-top: 21px;
      span {
        display: inline-block;
        height: 45px;
        line-height: 45px;
        text-align: center;
        border: 1px solid;
        border-radius: 5px;
        cursor: pointer;
        &.downBtn {
          width: 135px;
          border-color: #65ac69;
          color: #65ac69;
        }
        &.UpBtn {
          width: 110px;
          border-color: #4767c7;
          color: #4767c7;
          .shade {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      }
    }
    .seach {
      display: flex;
      align-content: center;
      width: 70%;
      .space {
        display: block;
        height: 66px;
        line-height: 85px;
        color: #999;
        margin: 0 10px;
      }
      div {
        p {
          margin-bottom: 5px;
        }
      }
      .queryBtn {
        width: 125px;
        height: 45px;
        margin: 23px 0 0 35px;
      }
    }
  }
  .headTab {
    box-shadow: 4px 4px 10px #eee;
    padding-left: 15px;
    border-top: 1px solid #eee;
    span {
      display: inline-block;
      width: 150px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      cursor: pointer;
      &.active {
        color: #3577f6;
        border-bottom: 2px solid #3577f6;
      }
    }
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
      vertical-align: top;
      &:nth-of-type(4n) {
        margin-right: 0;
      }
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
  .tenant-details {
    width: 1020px;
    .main-content {
      padding: 0 30px;
    }
  }
  .dialog-footer {
    margin-right: 30px;
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
  .el-form-item__content {
    span {
      display: inline-block;
      color: #7c7c7c;
      font-size: 12px;
    }
  }
}
.page {
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  padding: 60px 30px 30px 30px;
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #2f3f48;
    color: #fff;
  }
  .el-pagination.is-background .el-pager li:not(.disabled):hover {
    color: #999;
  }
  .pagingnum {
    font-size: 14px;
    text-align: center;
    color: #777;
    select {
      width: 70px;
      height: 28px;
      border-radius: 2px;
    }
  }
}
.UpBtn {
  position: relative;
  display: inline-block;
  border-radius: 2px;
  cursor: pointer;
  margin-left: 20px;
  margin-right: 20px;
  input {
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}
</style>
