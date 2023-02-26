<template>
  <div id="potlClients"
       class="potlClients">
    <!-- <div class="menu">
        <span @click="switchover">我的意向客户</span>
        <span class="active">全部意向客户</span>
      </div> -->
    <div class="seachDiv">
      <span class="item">
        <div>
          <span>项目</span>
          <el-select v-model="seachParams.projectManagement"
                     placeholder="项目">
            <el-option v-for="item in options2"
                       :key="item.id"
                       :label="item.projectName"
                       :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div>
          <span>品牌名称</span>
          <el-input v-model="seachParams.name"
                    placeholder="意向客户名称"
                    style="margin-right:20px;width:200px;"></el-input>
        </div>
        <div>
          <span>业态</span>
          <el-select v-model="seachParams.industryId">
            <el-option v-for="item in industryList"
                       :key="item.id"
                       :label="item.value"
                       :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div>
          <span>联系人</span>
          <el-input v-model="seachParams.contact"
                    style="margin-right:20px;width:200px;"></el-input>
        </div>
      </span>
      <span class="item">
        <div class="seachBtn"
             type="primary"
             size="medium"
             @click="getPotlClientsList()">查询</div>
      </span>
    </div>
    <div class="content">
      <el-table :data="tableData"
                style="border:1px solid #eee"
                @sort-change="sortChange">
        <el-table-column prop="projectManagementDTO.projectName"
                         label="项目"
                         align="center"
                         :sortable='true'></el-table-column>
        <el-table-column label="客户类型"
                         align="center"
                         :formatter="customerTypeFormat"></el-table-column>
        <el-table-column prop="yxTenantName"
                         label="客户名称"
                         align="center"></el-table-column>
        <el-table-column prop="referred"
                         label="品牌名称"
                         align="center"></el-table-column>
        <el-table-column prop="industryName"
                         label="业态"
                         align="center"
                         :sortable='true'></el-table-column>
        <el-table-column label="需求面积/m²"
                         align="center"
                         :formatter="lowAreaAndHighArea"></el-table-column>
        <el-table-column label="心理价位"
                         align="center"
                         :formatter="lowPriceAndHighPrice"></el-table-column>
        <el-table-column label="联系人/联系电话"
                         align="center"
                         :formatter="contactFormat"></el-table-column>
        <el-table-column label="招商进度"
                         align="center"
                         :formatter="dealOddsFormat"></el-table-column>
        <el-table-column label="操作"
                         align="center"
                         width="200"
                         v-if="hasAuthority('02040102')">
          <template slot-scope="scope">
            <el-button type="primary"
                       size="mini"
                       @click="toDetails(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="ctc-foot">
      <el-col>
        <span class="flex">
          <div class="pagingnum">显示
            <select v-model="pgSize"
                    @change="pgSizeSelectFn">
              <option v-for="item in pgNumoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </option>
            </select>
            条目
            <span style="padding-left: 30px">显示从{{pgSize*(currentPage - 1) + 1}}到{{pgSize*currentPage}}项结果，共<span class="style: red">{{total}}</span>条</span>
          </div>
          <el-pagination v-if="total > 0"
                         background
                         layout="prev, pager, next"
                         :page-size=pgSize
                         :total="total"
                         :current-page="currentPage"
                         @current-change="current_change">
          </el-pagination>
        </span>
      </el-col>
    </div>
    <potClienDtl v-if="detailsShow"
                 :detailsdrawershow="detailsShow"
                 :yxkhFrom="yxkhFrom"
                 :options2="options2"
                 :pageType="pageType"
                 :draweDetaileData="detaileData"
                 :timeLineListData="timeLineListData"
                 :isAllYXtenant="true"
                 ref="potClienDtl"
                 @refreshList="getPotlClientsList"
                 @drawerClose="detailsClose" />
    <el-dialog title="客户信息"
               center
               width="80%"
               :visible.sync="dialogFormVisible">
      <el-form class="form"
               :model="TenantDTO"
               ref="TenantDTO"
               :rules="TenantDTORules">
        <div class="item"
             style="width:100%">
          <el-form-item prop="companyIndustry">
            <div class="label"><i class="required">*</i>选择项目</div>
            <el-select style="width:400px"
                       v-model="TenantDTO.projectManagement">
              <el-option v-for="item in projectList"
                         :key="item.id"
                         :label="item.projectName"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item prop="teantName">
            <div class="label"><i class="required">*</i>客户名称</div>
            <el-input v-model="TenantDTO.teantName"></el-input>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item prop="referred">
            <div class="label"><i class="required">*</i>品牌</div>
            <el-input v-model="TenantDTO.referred"></el-input>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item prop="industryId">
            <div class="label"><i class="required">*</i>行业</div>
            <el-select style="width:100%"
                       v-model="TenantDTO.industryId">
              <el-option v-for="item in industryOptions"
                         :key="item.id"
                         :label="item.value"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item>
            <div class="label">联系人</div>
            <el-input v-model="TenantDTO.contact"></el-input>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item>
            <div class="label">证件类型</div>
            <el-select style="width:100%"
                       v-model="TenantDTO.certificate">
              <el-option v-for="item in documentTypeOptions"
                         :key="item.id"
                         :label="item.value"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item>
            <div class="label">证件号码</div>
            <el-input v-model="TenantDTO.iDNumber"></el-input>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item>
            <div class="label">手机号</div>
            <el-input v-model="TenantDTO.telephone"></el-input>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item>
            <div class="label">邮箱</div>
            <el-input v-model="TenantDTO.email"></el-input>
          </el-form-item>
        </div>
        <div class="tenantTips">
          <p class="title">客户标签</p>
          <div></div>
        </div>
        <div class="businessInfo">
          <p class="title"
             style="width:100%">工商信息 <i>同步工商信息</i></p>
          <div class="item"
               style="margin-left:15px;">
            <el-form-item>
              <div class="label">统一社会信用代码</div>
              <el-input v-model="TenantDTO.creditCode"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item>
              <div class="label">注册号</div>
              <el-input v-model="TenantDTO.no"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item>
              <div class="label">组织机构代码</div>
              <el-input v-model="TenantDTO.orgNo"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item>
              <div class="label">法定代表人</div>
              <el-input v-model="TenantDTO.operName"></el-input>
            </el-form-item>
          </div>
          <div class="item"
               style="margin-left:15px;">
            <el-form-item>
              <div class="label">国籍</div>
              <el-select style="width:100%"
                         v-model="TenantDTO.nationality">
                <el-option v-for="item in nationalityOptions"
                           :key="item.id"
                           :label="item.value"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item>
              <div class="label">注册资本/万元</div>
              <el-input v-model="TenantDTO.registCapi" type="number"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item>
              <div class="label">经营状态</div>
              <el-input v-model="TenantDTO.status"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item>
              <div class="label">企业类型</div>
              <el-input v-model="TenantDTO.econKind"></el-input>
            </el-form-item>
          </div>
          <div class="item"
               style="margin-left:15px;">
            <el-form-item>
              <div class="label">人员规模</div>
              <el-input v-model="TenantDTO.staffSize"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item>
              <div class="label">成立日期</div>
              <el-date-picker style="width:100%"
                              v-model="TenantDTO.startDate"
                              type="date"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item>
              <div class="label">营业期限</div>
              <el-date-picker style="width:45%"
                              v-model="TenantDTO.termStart"
                              type="date"
                              placeholder="选择日期">
              </el-date-picker>&nbsp;-&nbsp;
              <el-date-picker style="width:45%"
                              v-model="TenantDTO.teamEnd"
                              type="date"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item>
              <div class="label">核对日期</div>
              <el-date-picker style="width:100%"
                              v-model="TenantDTO.checkDate"
                              type="date"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="item"
               style="margin-left:15px;">
            <el-form-item>
              <div class="label">登记机关</div>
              <el-input v-model="TenantDTO.belongOrg"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item>
              <div class="label">所属地区</div>
              <el-input v-model="TenantDTO.province"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item>
              <div class="label">所属行业</div>
              <el-input v-model="TenantDTO.companyIndustry"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item>
              <div class="label">注册地址</div>
              <el-input v-model="TenantDTO.address"></el-input>
            </el-form-item>
          </div>
          <div class="item"
               style="width:100%;margin-left:15px;">
            <el-form-item>
              <div class="label">经营范围</div>
              <el-input type="textarea"
                        v-model="TenantDTO.scope"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="taxInfo">
          <p class="title"
             style="width:100%">开票信息</p>
          <div class="item"
               style="margin-left:15px;">
            <el-form-item>
              <div class="label">开户银行</div>
              <el-input v-model="TenantDTO.depositBank"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item>
              <div class="label">银行账户</div>
              <el-input v-model="TenantDTO.bankAccount"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item>
              <div class="label">纳税人识别号</div>
              <el-input v-model="TenantDTO.taxNo"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item>
              <div class="label">电话</div>
              <el-input v-model="TenantDTO.phone"></el-input>
            </el-form-item>
          </div>
          <div class="item"
               style="margin-left:15px;">
            <el-form-item>
              <div class="label">开票地址</div>
              <el-input v-model="TenantDTO.taxAddress"></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="resetForm('TenantDTO')">取 消</el-button>
        <el-button type="primary"
                   @click="save('TenantDTO')">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import context from '@/service'
import potClienDtl from './components/potClienDtl'
export default {
  name: 'potlClients',
  components: {
    potClienDtl
  },
  data () {
    return {
      industryList: [],
      seachParams: {
        name: '',
        projectManagement: '',
        industryId: '',
        contact: ''
      },
      timeLineListData: '', // 时间轴数据
      pool: true,
      TenantDTO: {// 转为客户入参
      },
      TenantDTORules: {
        teantName: [
          { required: true, message: '请输入客户名称', trigger: 'change' }
        ],
        referred: [
          { required: true, message: '请输入品牌', trigger: 'change' }
        ],
        industryId: [
          { required: true, message: '请选择所属行业', trigger: 'change' }
        ]
      },
      projectList: [], // 项目列表
      industryOptions: [], // 行业列表
      pageType: 'add',
      detailsShow: false, // 侧边弹窗
      dialogFormVisible: false,
      tableData: [],
      currentPage: 1,
      total: 0,
      pgSize: 15,
      pgNumoptions: [
        {
          value: 15,
          label: '15'
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
      detaileData: {},
      documentTypeOptions: [],
      nationalityOptions: [],
      uesrName: [],
      sort: 'sort=createdDate,desc'
    }
  },
  created () {
    this.getPotlClientsList()
    this.industryList = this.$store.state.industryList
    this.documentType()// 国籍
    this.nationality()// 证件类型
    this.customerSource()// 客户来源
    this.options2 = this.$store.state.projectManagementsList
    // this.getUserList()
    this.uesrName = this.$store.state.usersList
  },
  mounted () {

  },
  methods: {
    sortChange (column, prop, order) {
      if (column.prop === 'projectManagementDTO.projectName') {
        this.sort = 'sort=projectManagement'
      } else {
        this.sort = 'sort=industryName'
      }
      this.getPotlClientsList()
    },
    async customerSource () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=客户来源')
      this.yxkhFrom = result.data
    },
    contactFormat (row, column) {
      return `${row.contact}/${row.telephone}`
    },
    lowPriceAndHighPrice (row, column) {
      let priceUnit = ''
      if (row.priceUnit === 'M2DAYS') {
        priceUnit = '元/m²·天'
      } else if (row.priceUnit === 'M2MONTH') {
        priceUnit = '元/月'
      }
      if (row.lowArea && row.highPrice) {
        return row.lowPrice + ' ~ ' + row.highPrice + priceUnit
      } else {
        return '-'
      }
    },
    customerTypeFormat (row, column) {
      if (row.customerType === 'PERSONAL') {
        return '个人'
      } else if (row.customerType === 'COMPANY') {
        return '企业'
      }
    },
    switchover () { // 平面图切换
      this.$router.push({ name: 'potlClients' })
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    getProject (arr1, arr2) { // 子组件获取项目 、行业列表
      this.projectList = arr1
      this.industryOptions = arr2
    },
    switchProjectManagement () { // 将选中项目Id 转化项目对象
      for (var i = 0; i < this.projectList.length; i++) {
        if (this.TenantDTO.projectManagement === this.projectList[i].id) {
          this.TenantDTO.projectManagement = this.projectList[i]
        }
      }
    },
    save (formName) {
      this.switchProjectManagement()
      this.$refs[formName].validate((valid) => {
        if (valid) {
          context.http.post('cms/api/tenant', this.TenantDTO).then(res => {
            if (res) {
              this.$message({
                message: '操作成功！',
                type: 'success'
              })
              this.$refs[formName].resetFields()
              this.dialogFormVisible = false
              this.getPotlClientsList()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.dialogFormVisible = false
    },
    changeTenementFn () {
      this.dialogFormVisible = true
    },
    pageTypeChange () {
      this.pageType = 'add'
    },
    toDetails (index, row) { // 查看
      context.http.get(`cms/api/yxTenant/${row.id}`).then(res => {
        if (res) {
          // this.followRecordDTOParams.yxTenantDTO = row
          this.projectManagemenId = row.projectManagementDTO.id // 此条记录的项目id
          this.pageType = 'readOnly'
          this.detaileData = res.data
          context.http.get(`cms/api/followRecords/${row.id}`).then(result => {
            this.timeLineListData = result.data
            this.detailsShow = true
          })
        }
      })
    },
    dtlAddSuccess () { // 新增成功
      this.getPotlClientsList()
    },
    async getPotlClientsList () { // 获取意向客户列表
      let result = await context.http.get(`cms/api/yxTenant/pool?${this.sort}`, { name: this.seachParams.name, projectManagement: this.seachParams.projectManagement, industryId: this.seachParams.industryId, contact: this.seachParams.contact, page: (this.currentPage - 1), size: this.pgSize })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
    },
    lowAreaAndHighArea (row, column) {
      if (row.lowArea && row.highArea) {
        return row.lowArea + ' ~ ' + row.highArea + 'm²'
      } else {
        return '-'
      }
    },
    dealOddsFormat (row, column) { //
      switch (row.dealOdds) {
        case 'ZERO':
          return '无意向'
        case 'FIFTY':
          return '招商跟进中'
        case 'NINETY':
          return '签约审批中'
        case 'HUNDRED':
          return '审批通过'
        default:
          return '-'
      }
    },
    formatShopNumber (row, column) {
      var str = ''
      for (var i = 0; i < row.rooms.length; i++) {
        str += row.rooms[i].shopNumber + '、'
      }
      return str.substring(0, str.length - 1)
    },
    followNameFormat (row, column) {
      for (var i = 0; i < this.uesrName.length; i++) {
        if (row.followId === this.uesrName[i].id) {
          return this.uesrName[i].name
        }
      }
    },
    // async getUserList () {
    //   let result = await context.http.get('uaa/api/users', { page: 0,
    //     size: 200
    //   })
    //   this.uesrName = result.data
    // },
    pgSizeSelectFn () { // 切换显示条数
      this.currentPage = 1
      this.getPotlClientsList()
    },
    current_change (currentPage) { // 切换页码
      this.currentPage = currentPage
      this.getPotlClientsList()
    },
    detailsClose () {
      this.detailsShow = false
    },
    async documentType () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=证件类型')
      this.documentTypeOptions = result.data
    },
    async nationality () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=国籍')
      this.nationalityOptions = result.data
    }
  }
}
</script>

<style lang="scss" scoped>
.potlClients {
  .menu {
    height: 62px;
    line-height: 62px;
    border-bottom: 1px solid #eeeeee;
    margin-top: 15px;
    margin-bottom: 20px;
    background-color: #ffffff;
    // padding-left: 20px;
    span {
      display: inline-block;
      width: 200px;
      height: 62px;
      text-align: center;
      cursor: pointer;
      &.active {
        border-bottom: 3px solid #3577f6;
        color: #3577f6;
      }
    }
  }
  .form {
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 20%;
      margin-right: 30px;
      .label {
        height: 40px;
        line-height: 40px;
      }
    }
    .tenantTips {
      width: 100%;
      margin-top: 20px;
      min-height: 150px;
      border: 1px solid #eeeeee;
    }
    .businessInfo {
      width: 100%;
      margin-top: 20px;
      min-height: 150px;
      border: 1px solid #eeeeee;
      display: flex;
      flex-wrap: wrap;
      .title {
        i {
          font-size: 12px;
          color: #0f75ff;
          font-weight: 100;
          cursor: pointer;
          padding-left: 10px;
        }
      }
    }
    .taxInfo {
      width: 100%;
      margin-top: 20px;
      min-height: 150px;
      border: 1px solid #eeeeee;
      display: flex;
      flex-wrap: wrap;
    }
  }
  .seachDiv {
    height: 100px;
    background-color: #fff;
    display: flex;
    align-items: center;
    border: 1px solid #eee;
    padding: 0 20px;
    justify-content: space-between;
    .item {
      display: flex;
      align-items: center;
    }
  }
  .content {
    background-color: #ffffff;
  }
}
.ctc-foot {
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  padding: 60px 0 30px 20px;
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #2f3f48;
    color: #fff;
  }
  .el-pagination.is-background .el-pager li:not(.disabled):hover {
    color: #999;
  }
  .el-col-18 {
    padding: 0 30px;
  }
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
.flex {
  display: flex;
  justify-content: space-between;
}
</style>
