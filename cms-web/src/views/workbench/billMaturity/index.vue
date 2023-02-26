<template>
  <div :class="[hourseList === 'on' ? 'approvalCenter paddingLeft' : 'approvalCenter', hourseList === 'off' ? 'approvalCenter paddingRight' : 'approvalCenter']">
    <p v-if="!homeReference">账单到期</p>
    <div class="hourse_container">
      <div  class="projectChange" v-if="homeReference">
        <span>项目选择：</span>
        <el-select v-model="projectManagementId" placeholder="项目" @change='projectChanged'>
          <el-option
            v-for="item in options2"
            :key="item.id"
            :label="item.projectName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
    	<div class="hourse_search" v-else>
    	  <div class="search-top clearing" v-if="!homeReference">
    	  	<el-input v-model="queryName" placeholder="品牌"></el-input>
          <div @click="search" class="query-btn">查询</div>
    	  </div>
    		<div v-if="buildsList.length" class="search-bottom">
    			<dl>
    				<dt>选择楼宇：</dt>
    				<dd v-for="(item, index) in buildsList" :key="index"><span>{{item.buildingName}}</span><span @click="deleBuild(index)" class="iconfont icon-jinakangbaoicons18"></span></dd>
    			</dl>
    		</div>
    	</div>
      <div class="hourse_tab">
      	<ul class="nav">
      		<li @click="changeNav(index)" v-for="(item, index) in navList" :key="index" :class="item.value ? 'select_active' : ''">{{item.label}}</li>
      	</ul>
      </div>
      <div class="hourse-table">
      	<div class="table">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="billType" label="账单类型" align="center" :formatter="formatterBillType"></el-table-column>
            <el-table-column prop="feeType" label="费用类型" align="center" :formatter="formatterFeeType"></el-table-column>
            <el-table-column label="账单金额/元" align="center">
              <template slot-scope="scope">
                {{scope.row.amount | toLocaleString}}
              </template>
            </el-table-column>
            <el-table-column prop="billStatus" label="账单状态" align="center" :formatter="formatterBillStatus"></el-table-column>
            <el-table-column prop="referred" label="品牌" align="center"></el-table-column>
            <el-table-column label="应收时间" align="center">
              <template slot-scope="scope">
                {{scope.row.finalPaymentDate}}<span style="color: red" v-if="scope.row.expectedDay">(逾期{{scope.row.expectedDay}}天)</span>
              </template>
            </el-table-column>
            <el-table-column label="计费周期" align="center">
              <template slot-scope="scope">
                {{scope.row.startDate}}~{{scope.row.endDate}}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button @click="handleEdit(scope.$index, scope.row)" class="el-button--primary" size="mini">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page">
          <div class="pagingnum">显示 <select v-model="pager.pgSize"  @change="pgSizeSelectFn">
              <option v-for="item in pager.pgNumoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </option>
            </select>
            条目 <span style="padding-left: 30px">显示从{{pager.pgSize*(pager.currentPage - 1) + 1}}到{{pager.pgSize*pager.currentPage}}项结果，共<span class="style: red">{{pager.total}}</span>条</span>
          </div>
          <el-pagination v-if="pager.total > 0"
                         background
                         layout="prev, pager, next"
                         :page-size=pager.pgSize
                         :total="pager.total"
                         :current-page="pager.currentPage"
                         @current-change="current_change">
          </el-pagination>
        </div>
      </div>
    </div>
    <projectSidebar :isHomeReference="homeReference" @hourseList="setpdleft" @buildsList="setBuildsList" @query="query" ref="projectSidebar"/>
    <!-- <hourseDetails :detailsdrawershow="detailsShow"
                 :detailData="detailData"
                 ref="hourseDetails"
                 @drawerClose="detailsClose"
                 @query="query" /> -->

    <!-- 账单详情 -->
    <bill-details v-if="detailsdrawershow" :detailsdrawershow="detailsdrawershow" :detailsData="builddetailsData"
     @drawerClose="drawerClose" @handleEdit="handleEdit" @query='queryBill' ref="billDetail"></bill-details>
    <!-- 多经账单详情 -->
     <income-details v-if="incdDetailsdrawershow" :detailsdrawershow="incdDetailsdrawershow" :detailsData="builddetailsData"
     @drawerClose="drawerClose" @handleEdit="handleEdit" @query='queryBill' ref="billDetail"></income-details>             
  </div>  
</template>
<script>
import context from '@/service'
// import hourseDetails from './components/hourseDetails'
import projectSidebar from '@/components/projectSidebar'
import billDetails from '@/views/operations/costCollection/billList/components/billDetails'
import incomeDetails from '@/views/operations/varietyBusiness/income/components/incomeDetails'
export default {
  name: 'billMaturity',
  props: ['homeReference'], // 是否被首页当子组件引用
  components: {
    // hourseDetails,
    projectSidebar,
    billDetails,
    incomeDetails
  },
  data () {
    return {
      detailsdrawershow: false,
      incdDetailsdrawershow: false,
      builddetailsData: {},
      projectManagementId: '',
      options2: [],
      navList: [{label: '本期未结清', value: true}, {label: '逾期未结清', value: false}],
      pager: {
        currentPage: 1,
        pgNum: 1,
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
        ]
      },
      tableData: [],
      addData: {
        projectManagement: {},
        building: {},
        floor: null,
        industry: null,
        decorationId: null,
        investmentStatus: null,
        expectedUnitPrice: null,
        priceUnit: 'M2DAYS'
      },
      addDataRules: {
        floor: [
          { required: true, message: '请选择楼层', trigger: 'change' }
        ],
        shopNumber: [
          { required: true, message: '请输入房源号', trigger: 'blur' }
        ],
        industry: [
          { required: true, message: '请选择预期业态', trigger: 'change' }
        ],
        buildingArea: [
          { required: true, message: '请输入建筑面积', trigger: 'blur' }
        ],
        expectedUnitPrice: [
          { required: true, message: '请输入预期单价', trigger: 'blur' }
        ]
      },
      fieldsList: [],
      formLabelWidth: '120px',
      hourseVisible: false,
      selProject: false,
      selHourse: false,
      hourseList: '',
      detailsShow: false,
      detailData: {},
      projectList: [],
      hourList: [],
      decorate: '',
      buildingList: [],
      onRent: false,
      statisicsData: {},
      queryName: '',
      projectArr: [],
      buildsList: [],
      onExpected: false
    }
  },
  methods: {
    drawerClose () {
      this.detailsdrawershow = false
      this.incdDetailsdrawershow = false
    },
    projectChanged () {
      this.query(this.idsArray)
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    changeNav (inx) {
      this.navList.forEach(item => {
        item.value = false
      })
      this.navList[inx].value = true
      if (inx === 0) {
        this.onRent = false
        this.onExpected = false
      } else if (inx === 1) {
        this.onRent = true
        this.onExpected = true
      } else {
        this.onRent = null
      }
      this.pager.currentPage = 1
      this.query(this.idsArray)
    },
    search () {
      this.pager.currentPage = 1
      this.query(this.idsArray)
    },
    detailsClose () {
      this.detailsShow = false
    },
    queryBill () {
      this.query()
    },
    async handleEdit (index, row) {
      // this.$router.push({path: '/home/billList', query: {billId: row.id}})
      if (row.billCategory === 'DIVERSIFICATION') {
        let result = await context.http.get(`cms/api/bills/${row.id}`)
        this.builddetailsData = JSOG.decode(result.data)
        this.incdDetailsdrawershow = true
      } else {
        let result = await context.http.get(`cms/api/bills/${row.id}`)
        this.builddetailsData = JSOG.decode(result.data)
        this.detailsdrawershow = true
      }
    },
    current_change (currentPage) {
      this.pager.currentPage = currentPage
      this.query(this.idsArray)
    },
    pgSizeSelectFn () {
      this.pager.currentPage = 1
      this.query(this.idsArray)
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
    addLabel (e) {
      if (!e.target.value) return
      this.addData.label.push(e.target.value)
      e.target.value = ''
    },
    deleteLabel (inx) {
      this.addData.label.splice(inx, 1)
    },
    deleBuild (index) {
      this.$refs.projectSidebar.deleBuild(index)
    },
    query (ids) {
      let idArray = []
      if (ids && ids.length > 0) {
        // this.pager.currentPage = 1
        idArray = ids
      }
      let typeArr = ''
      idArray.forEach((item, index) => {
        if (index === idArray.length - 1) {
          typeArr += 'buildingIds=' + item
        } else {
          typeArr += 'buildingIds=' + item + '&'
        }
      })
      context.http.get('/cms/api/bills/expire?' + typeArr, {projectManagementId: this.projectManagementId, referred: this.queryName, onExpected: this.onExpected, page: (this.pager.currentPage - 1), size: this.pager.pgSize, sort: 'desc'}).then(res => {
        this.tableData = res.data
        this.statisicsData = res.data.statisics
        this.pager.total = Number(res.headers['x-total-count'])
      })
    },
    setpdleft (val) {
      this.hourseList = val
    },
    setBuildsList (val) {
      this.buildsList = val
      let idsArray = []
      this.buildsList.forEach(ele => {
        idsArray.push(ele.id)
      })
      this.idsArray = idsArray
      this.pager.currentPage = 1
    },
    formatterBillType (row, column) {
      return row.billType === 'R' ? '收款' : '付款'
    },
    formatterBillStatus (row, column) {
      let res = ''
      if (row.billStatus === 'APPROVAL') {
        res = '减免审核中'
      } else if (row.billStatus === 'UPDATE') {
        res = '减免驳回待修改'
      } else if (row.billStatus === 'NO') {
        res = '未付款'
      } else if (row.billStatus === 'OK') {
        res = '已结清'
      } else if (row.billStatus === 'SECTION') {
        res = '部分结清'
      } else if (row.billStatus === 'STAY_SETTLE') {
        res = '待结清'
      }
      return res
    },
    formatterFeeType (row, column) {
      // let feeType
      // switch (row.feeType) {
      //   case 'RENT':
      //     feeType = '租金'
      //     break
      //   case 'RENT_DEPOSIT':
      //     feeType = '租金保证金'
      //     break
      //   case 'PROPERTY':
      //     feeType = '物业费'
      //     break
      //   case 'PROPERTY_DEPOSIT':
      //     feeType = '物业费保证金'
      //     break
      //   case 'INTENTION':
      //     feeType = '意向金'
      //     break
      //   case 'DECORATION':
      //     feeType = '装修保证金'
      //     break
      //   case 'F_INTENTION':
      //     feeType = '返还意向金'
      //     break
      //   case 'F_DECORATION':
      //     feeType = '返还装修保证金'
      //     break
      //   case 'WITHDRAWAL':
      //     feeType = '退租结算'
      //     break
      //   case 'RELEASE':
      //     feeType = '合同解除结算'
      //     break
      // }
      return row.feeTypeName
    }
  },
  mounted () {
    this.query()
    this.options2 = this.$store.state.projectManagementsList
  }
}
</script>
<style lang="scss">
@import "../../../style/config";
ul, li{
  list-style: none;
}
.hourse_search .el-input .el-input__inner{
  width:180px;
  height:32px;
  line-height: 32px;
  position: absolute;
  left:0;
  top:0;
}
.approvalCenter{
  background-color: #f9f9f9;
  .hourse_container{
    background-color: #f9f9f9;
    .hourse_search{
      background-color: #fff;
      margin: 20px 0 0px 0;
      box-shadow:1px 2px 5px #eee;
      border-radius:3px;
      .search-top{
        border-bottom:1px solid #ecedef;
        padding-bottom:18px;
        padding-left:18px;
        .el-input {
          width:180px;
          height:32px;
          display:block;
          margin-top:18px;
        }
        div {
          float: left;
          display: inline-block;
        }
        div {
          cursor: pointer;
        }
      }
      .search-bottom{
        padding-left:18px;
        padding:20px 18px 20px;
        dl{
          display: flex;
          font-size: 12px;
          line-height: 18px;
          dt{
            color:#333333;
          }
          dd{
            display: flex;
            color:#666;
            margin-right:16px;
            span{
              display: block;
              &:first-child{
                margin-right:5px;
              }
              &:last-child{
                font-size: 18px;
                cursor:pointer;
              }
            }
          }
        }
      }
    }
    .hourse_tab{
      height:60px;
      display: flex;
      background-color: #fff;
      margin: 10px 0 0px 0;
      box-shadow:1px 2px 5px #eee;
      border-radius:3px;
      justify-content: space-between;
      align-items: center;
      padding-right:44px;
      border-bottom:1px solid #ecedef;
      .nav{
        display: flex;
        li{
          width:160px;
          text-align: center;
          font-size: 14px;
          color:#666;
          height:58px;
          line-height: 58px;
          border-bottom: 2px solid #fff;
          cursor: pointer;
          &.select_active{
            border-bottom: 2px solid #3175d2;
            color:#3175d2;
            font-weight: bolder;
          }
        }
      }
    }
    .hourse-table{
      background-color: #fff;
      margin: 10px 0 0px 0;
      box-shadow:1px 2px 5px #eee;
      border-radius:3px;
      .page{
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
    }
  }
}
@keyframes cloud-in{
    0% {
      padding-right:0;
    }
    100%{
      padding-right:350px;
    }
  }
  @keyframes cloud-in2{
    0%{
      padding-right:350px;
    }
    100%{
      padding-right:0;
    }
  }
.paddingLeft{
  animation: cloud-in .2s 0s ease-out forwards;
}
.paddingRight{
  animation: cloud-in2 .2s 0s ease-out forwards;
}
</style>
