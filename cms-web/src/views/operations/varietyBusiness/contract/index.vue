<template>
  <div class="income-list">
    <span class="page_head_title">多种经营</span>
    <ul class="default_tab_block">
        <li v-if="hasAuthority('02030501')"
            @click="switchover('incomeList')">
          <span>多经账单</span>
        </li>
        <li v-if="hasAuthority('02030510')"
            class="active">
          <span>多经合同</span>
        </li>
        <li v-if="hasAuthority('02030515')"
            @click="switchover('point')">
          <span>多经点位</span>
        </li>
      </ul>
    <div class="pl-content">
      <div class="search-bar">
        <div style="display: flex;flex-wrap: wrap;align-items:center">
          <div class="marginRights">
          <el-select :clearable="true"
                     v-model="projectManagementId"
                     placeholder="项目">
            <el-option v-for="item in projectOptions"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="marginRights">
          <el-select :clearable="true"
                     v-model="contractStatus"
                     placeholder="合同状态">
            <el-option v-for="item in contractStatusOption"
                       :key="item.value"
                       :label="item.text"
                       :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="marginRights">
          <el-input v-model="referred"
                    style="width: 150px!important"
                    placeholder="客户名称/品牌名称"></el-input>
        </div>
        <div class="marginRights">
          <el-input v-model="managementPointName"
                    placeholder="点位名称"></el-input>
        </div>
        <div class="query-btn"
             @click="querySearch">查询</div>
        </div>
        <el-button class="tban tban1"
                         @click="addContracts"
             v-if="hasAuthority('02030511')"><i class="iconfont icon-crm_xinzeng-"></i> 新增合同</el-button>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column prop="projectManagement.referred"
                           label="项目"
                           align="center"></el-table-column>
          <el-table-column prop="contractNo"
                           label="合同编号"
                           align="center"></el-table-column>
          <el-table-column :formatter="formattercontractStatus"
                           prop="contractStatus"
                           label="合同状态"
                           align="center"></el-table-column>
          <el-table-column label="点位名称"
                           align="center">
            <template slot-scope="scope">
              <p v-for="(item, index) in scope.row.managementPoints"
                 :key="index">{{item.pointName}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="tenant.teantName"
                           label="客户名称"
                           align="center"></el-table-column>
          <el-table-column prop="tenant.referred"
                           label="品牌名称"
                           align="center"></el-table-column>
          <el-table-column label="合同时间"
                           align="center"
                           width="180">
            <template slot-scope="scope">
              {{scope.row.startDate}}~{{scope.row.endDate}}
            </template>
          </el-table-column>
          <el-table-column prop="signtDate"
                           label="签订时间"
                           align="center"></el-table-column>
          <el-table-column :formatter="formatterArrearsAmount"
                           prop="amount"
                           label="合同总额"
                           align="center"></el-table-column>
          <el-table-column label="跟进人"
                           prop="createUserName"
                           align="center"></el-table-column>
          <el-table-column label="操作"
                           align="center">
            <template slot-scope="scope">
              <el-button v-if="hasAuthority('02030513')"
                         @click="handleEdit(scope.$index, scope.row)"
                         class="el-button--primary operation-btn"
                         size="mini">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="ctc-foot1">
        <span><span style="margin-right:10px">{{currentPage}}/{{Math.ceil(total/pgSize)}}页</span> 共{{total}}条记录</span>
        <el-pagination v-if="total > 0"
                       background
                       layout="prev, pager, next"
                       :page-size=pgSize
                       :total="total"
                       :current-page="currentPage"
                       @current-change="current_change">
        </el-pagination>
        <div class="pagingnum">
          显示 <select v-model="pgSize"
                  @change="currentSel">
            <option v-for="item in pgNumoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </option>
          </select>
          条目
        </div>
      </div>
    </div>
    <el-dialog class="addintentionContracts"
               width="1000px"
               title="新增多经合同"
               :visible.sync="addVisible"
               :show-close="true"
               :before-close="handleClose"
               :close-on-press-escape="false"
               :close-on-click-modal="false">
      <addContracts :projectList='projectList'
                    :contractState="contractState"
                    :detailData="detailDataIC"
                    :intentionToFormalize="intention"
                    :approvalReject="approval"
                    :queryObj="queryObj"
                    @addDialogClose="addDialogClose"
                    @query="query"
                    ref="addContracts" />
    </el-dialog>

    <contractDetails v-if="detailsdrawershow"
                     :detailsdrawershow="detailsdrawershow"
                     :detailData="builddetailsData"
                     :queryBillId="queryBillId"
                     :reductionData="reductionData"
                     @drawerClose="drawerClose"
                     @handleEdit="handleEdit"
                     @query='query'
                     ref="billDetail" />
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import contractDetails from './components/contractDetails'
import addContracts from './components/addContracts'
import { toLocaleString, toLocaleFixed } from '@/utils/validate.js'
import * as JSOG from 'jsog'
export default {
  name: 'MultipleContract',
  components: {
    contractDetails,
    addContracts
  },
  data () {
    return {
      navList: [{ label: '本期未结清', value: true }, { label: '逾期未结清', value: false }, { label: '退租未结清', value: false }, { label: '自建未结清', value: false }],
      contractStatusOption: [{ text: '待执行', value: 'PENDING' }, { text: '执行中', value: 'EXECUTING' },
      { text: '已退租', value: 'WITHDRAWAL' }, { text: '到期未处理', value: 'MATURITY' }],
      contractStatus: '',
      referred: '',
      managementPointName: '',
      contractState: '',
      intention: '',
      approval: '',
      detailDataIC: {},
      projectList: [],
      checkList: ['USING'],
      addVisible: false,
      detailsdrawershow: false,
      tableData: [],
      currentPage: 1,
      pgNum: 1,
      total: 0,
      pgSize: 15,
      builddetailsData: {
        rentClauses: [{
          startDate: '',
          endDate: '',
          deposit: '',
          proportion: '',
          month: '',
          dayNumber: '',
          billingType: '',
          yearDay: ''
        }, {
          startDate: '',
          endDate: '',
          deposit: '',
          proportion: '',
          month: '',
          dayNumber: '',
          billingType: '',
          yearDay: ''
        }]
      },
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
      onRent: false,
      queryBillId: '',
      reductionData: {},
      projectManagementId: '', // 商圈
      projectOptions: [],
      projectManagement: [],
      feeType: '',
      billStatus: '',
      startDate: '',
      endDate: '',
      addData: {
        billType: '',
        projectManagement: {
          id: ''
        }
      },
      queryObj: {
        projectId: '',
        tenantId: ''
      }
    }
  },
  created () {
    this.getDataAuthorityOptions()
    this.query()
    // 客户信息页发起合同
    let projectObj = this.$route.query.project
    let tenantId = this.$route.query.tenant
    if (projectObj && tenantId) {
      this.queryObj.projectObj = projectObj
      this.queryObj.tenantId = tenantId
      this.addContracts()
    }
  },
  mounted () {
  },
  methods: {
    async getDataAuthorityOptions () {
      let result = await context.http.get('cms/api/project-managements', { page: 0, size: 100, sort: 'desc', useStatus: 'USING' })
      this.projectOptions = result.data
    },
    querySearch () {
      this.currentPage = 1
      this.query()
    },
    handleClose (done) {
      done()
    },
    addDialogClose () {
      this.addVisible = false
      this.contractState = ''
    },
    addContracts () {
      context.http.get('/cms/api/project-managements', { useStatus: 'USING' }).then(res => {
        this.projectList = res.data
      })
      this.addVisible = true
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    switchover (state) {
      if (state === 'incomeList') {
        this.$router.push({ name: 'incomeList' })
      } else if (state === 'point') {
        this.$router.push({ name: 'point' })
      }
    },
    formatterAmount (row, column) {
      return toLocaleString(row.amount)
    },
    formattercontractStatus (row, column) {
      let contractStatus
      if (row.contractStatus === 'STORAGE') {
        contractStatus = '暂存'
      } else if (row.contractStatus === 'PENDING') {
        contractStatus = '待执行'
      } else if (row.contractStatus === 'EXECUTING') {
        contractStatus = '执行中'
      } else if (row.contractStatus === 'ZH_APPROVAL') {
        contractStatus = '招商审核中'
      } else if (row.contractStatus === 'TZ_APPROVAL') {
        contractStatus = '退租审核中'
      } else if (row.contractStatus === 'WITHDRAWAL') {
        contractStatus = '已退租'
      } else if (row.contractStatus === 'XQ_APPROVAL') {
        contractStatus = '续签审核中'
      } else if (row.contractStatus === 'NO') {
        contractStatus = '审核未通过'
      } else if (row.contractStatus === 'MATURITY') {
        contractStatus = '到期未处理'
      }
      return contractStatus
    },
    formatterPoints (row, column) {
      let res = []
      row.managementPoints.forEach(ele => {
        res.push(ele.pointName)
      })
      return res.join('、')
    },
    formatterWriteOffAmount (row, column) {
      return toLocaleString(row.writeOffAmount)
    },
    formatterArrearsAmount (row, column) {
      return toLocaleString(row.amount)
    },
    drawerClose () {
      this.detailsdrawershow = false
    },
    dialogHide () {
      this.addContracts = false
    },
    async query (type, index) {
      if (index) this.currentPage = index
      let result = await context.http.get('cms/api/management-contracts?sort=id,desc', { page: (this.currentPage - 1),
        size: this.pgSize,
        referred: this.referred,
        projectManagementId: this.projectManagementId,
        contractStatus: this.contractStatus,
        managementPointName: this.managementPointName,
        useStatus: 'USING'
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
    },
    async handleEdit (index, row) {
      context.http.get('/cms/api/management-contracts/' + row.id).then(res => {
        this.builddetailsData = res.data
        this.detailsdrawershow = true
      })
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    }
  }
}
</script>
<style lang="scss" scoped>
.addintentionContracts {
  .el-dialog {
    width: 1000px !important;
    margin-top: 3vh !important;
  }
}
.income-list {
  font-size: 14px;
  background-color: #f9f9f9;
  .pl-content {
    width: 100%;
    margin: 0 auto;
    .search-bar {
      .morebtn {
        border-radius: 4px;
        background-color: #65ac69;
        color: #f3af2c;
        height: 32px;
        width: 100px;
        line-height: 32px;
        font-size: 14px;
        color: #fff;
        margin-left: 20px;
        .icon-daochu {
          display: inline-block;
          width: 16px;
          height: 16px;
          background: url(../../../../assets/add.png) no-repeat;
          background-size: contain;
          vertical-align: middle;
          margin-right: 4px;
          margin-left: 6px;
        }
      }
      .morebtn1 {
        border: 1px solid #f3af2c;
        color: #f3af2c;
        height: 30px;
        width: 105px;
        margin-left: 16px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        .icon-daochu {
          display: block;
          width: 16px;
          height: 16px;
          margin-right: 4px;
          background: url(../../../../assets/daochu1.png) no-repeat;
          background-size: contain;
          margin-right: 4px;
        }
        span {
          display: block;
          line-height: 30px;
        }
        .el-icon-caret-bottom {
          display: block;
          width: 16px;
          height: 30px;
          line-height: 30px;
          font-size: 18px;
          margin-left: 2px;
        }
      }
      .marginRights {
        .el-input {
          width: 140px !important;
        }
        .el-select {
          width: 144px !important;
        }
      }
      .marginNone {
        float: left;
        margin-right: 0;
      }
      .split {
        color: #dcdfe6;
        display: block;
        width: 20px;
        height: 70px;
        line-height: 70px;
        float: left;
        text-align: center;
      }
      .swbtn {
        margin-left: 16px;
        font-size: 18px;
        width: 100px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        font-size: 18px;
        color: #000;
        background-color: #fff;
        margin-left: 16px;
        border-radius: 10px;
        cursor: pointer;
      }
      .btnselect {
        color: #fff;
        background-color: #42506c;
      }
      div {
        cursor: pointer;
      }
      position: relative;
    }
    .bd-statistics {
      background-color: #fff;
      margin-bottom: 10px;
      box-shadow: 1px 2px 5px #eee;
      .statistics-title {
        font-size: 14px;
        height: 30px;
        line-height: 30px;
        color: #333;
        font-weight: bold;
        padding-left: 20px;
        border-bottom: 1px solid #ededef;
      }
      .statistics-content {
        .contentItem {
          display: inline-block;
          padding: 20px 0 20px 20px;
        }
        .bd-number {
          margin-left: 6px;
          padding-right: 20px;
          font-size: 14px;
          font-weight: 400;
          font-family: PingFangSC;
          color: #353b4b;
          display: inline-block;
          min-width: 90px;
          .ci-title {
            font-weight: 400;
            height: 25px;
            line-height: 25px;
            color: #828692;
            font-size: 12px;
          }
          .ci-value {
            display: inline-block;
            font-size: 20px;
            margin-top: 4px;
          }
        }
        .borderstrip {
          width: 2px;
          height: 35px;
          background-color: #ecedef;
          display: inline-block;
          margin-top: 6px;
        }
      }
    }
    .plc-table {
      position: relative;
      .export {
        position: absolute;
        right: 20px;
        top: 5px;
        z-index: 9;
        span {
          display: inline-block;
          width: 60px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          /*background: rgba(222, 235, 254, 1);
            color: #5b9af8;
            opacity:0.9;
            border-radius:4px;*/
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
    .rent-control {
      border: 1px solid #96d050;
      background-color: #fff;
      color: #96d050;
      &:hover {
        background-color: #96d050;
        color: #fff;
      }
    }
    .editbtn {
      color: #3175d2;
      &:hover {
        color: #fff;
      }
    }
    .hourse_tab {
      height: 60px;
      display: flex;
      background-color: #fff;
      margin: 10px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      justify-content: space-between;
      align-items: center;
      padding-right: 44px;
      border-bottom: 1px solid #ecedef;
      .nav {
        display: flex;
        li {
          width: 160px;
          text-align: center;
          font-size: 14px;
          color: #666;
          height: 58px;
          line-height: 58px;
          border-bottom: 2px solid #fff;
          cursor: pointer;
          &.select_active {
            border-bottom: 2px solid #3175d2;
            color: #3175d2;
            font-weight: bolder;
          }
        }
      }
      .export {
        span {
          display: inline-block;
          width: 60px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background: rgba(222, 235, 254, 1);
          opacity: 0.9;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
  }
  .ctc-foot {
    background-color: #f9f9f9;
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
  .addProjectdialog .el-dialog {
    width: 1000px;
    margin-top: 5vh !important;
  }
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #d9dce2;
  }
  .el-table__row div {
    white-space: nowrap;

    img {
      width: 97px;
      height: 80px;
    }
    .buildingImage {
      width: 120px;
      margin: 0 auto;
    }
  }
  .finalPaymentDate {
    .el-input {
      width: 100%;
    }
  }
}
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
</style>
