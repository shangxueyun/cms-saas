<template>
  <div class="bill-record">
    <div class="pl-content">
      <div class="navTab">
        <span  @click="actionIndex = 1;cost='';billStatus='';getAllBill();" :class="{'actived': actionIndex === 1}">房源账单</span>
        <span  @click="actionIndex = 2;cost='';billStatus='';getMultipleBill()" :class="{'actived': actionIndex === 2}">多经账单</span>
      </div>
      <div class="plc-search">
        <el-date-picker type="date"  class="screen"
                        value-format="yyyy-MM-dd"
                        v-model="repairTime"
                        placeholder="开始时间">
        </el-date-picker>
        <span style="color: #dadada">—</span>
        <el-date-picker type="date"  class="screen"
                        value-format="yyyy-MM-dd"
                        v-model="endTime"
                        placeholder="结束时间">
        </el-date-picker>
        <el-select :clearable="true" v-model="cost" placeholder="选择费用" class="screen" v-if="actionIndex === 1">
          <el-option
            v-for="item in costTypeOptions"
            :key="item.id"
            :label="item.value"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select :clearable="true" v-model="cost" placeholder="选择费用" class="screen" v-else>
          <el-option
            v-for="item in costTypeOptionsDj"
            :key="item.id"
            :label="item.value"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select :clearable="true" v-model="billStatus" placeholder="选择状态" class="screen" v-if="actionIndex === 1">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select :clearable="true" v-model="billStatus" placeholder="选择状态" class="screen" v-else>
          <el-option
            v-for="item in statusOptions2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div class="query-btn"
             @click="getAllBill()">查询</div>
      </div>
      <div class="plc-table">
        <el-table :data="tableData" :style="{'height': pclTableHeight}"
                  :summary-method="getSummaries"
                  show-summary
                  style="width: 100%">
          <el-table-column prop="finalPaymentDate"
                           label="应收时间"
                           align="center"></el-table-column>
          <el-table-column prop="feeTypeName"
                           label="费用类型"
                           align="center"></el-table-column>
          <el-table-column label="计费周期"
                           width="200px"
                           align="center">
                           <template slot-scope="scope">
                            {{scope.row.startDate}}~{{scope.row.endDate}}
                          </template>
          </el-table-column>
          <el-table-column prop="amount"
                           label="应收金额"
                           align="center"></el-table-column>
          <el-table-column prop="sjAmount"
                           label="已收金额"
                           align="center"
                           ></el-table-column>
          <el-table-column prop="arrearsAmount"
                           label="欠收金额"
                           align="center"
                           ></el-table-column>
          <el-table-column prop="expectedDay" v-if="actionIndex === 1"
                           label="逾期天数"
                           align="center"></el-table-column>
          <el-table-column prop="lateFee" v-if="actionIndex === 1"
                           label="滞纳金"
                           align="center"
                           ></el-table-column>
          <el-table-column prop="billStatus"
                           :formatter="formatterBillStatus"
                           label="账单状态"
                           align="center"
                           ></el-table-column>
          <el-table-column label="操作"
                           align="center"
                           >
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.$index, scope.row)"
                         class="el-button--primary operation-btn"
                         size="mini"
                         >查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="plc-table-bottom" v-if="actionIndex === 3">
        <ul>
          <li style="text-align: center">本页合计</li>
          <li></li>
          <li style="width: 200px"></li>
          <li>11111</li>
          <li>11111</li>
          <li>11111</li>
          <li></li>
          <li>11111</li>
          <li></li>
          <li></li>
        </ul>
        <ul>
          <li style="text-align: center">商户总计</li>
          <li></li>
          <li style="width: 200px"></li>
          <li>11111</li>
          <li>11111</li>
          <li>11111</li>
          <li></li>
          <li>11111</li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <div class="plc-table-bottom plc-bottom" v-if="actionIndex === 3">
        <ul>
          <li style="text-align: center;width: 116px">本页合计</li>
          <li></li>
          <li style="width: 200px!important"></li>
          <li>11111</li>
          <li>11111</li>
          <li>11111</li>
          <li></li>
          <li></li>
        </ul>
        <ul>
          <li style="text-align: center;width: 116px">商户总计</li>
          <li></li>
          <li style="width: 200px!important"></li>
          <li>11111</li>
          <li>11111</li>
          <li>11111</li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <div class="ctc-foot">
        <div class="pagingnum">
          显示 <select v-model="pager.pgSize"
                  @change="currentSel">
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
                       @current-change="current_change">
        </el-pagination>
      </div>
    </div>

    <billDetails v-if="detailsdrawershow" :detailsdrawershow="detailsdrawershow" :detailsData="builddetailsData" :queryBillId="queryBillId" :reductionData="reductionData"
     @drawerClose="drawerClose" @handleEdit="handleEdit" @query='query' ref="billDetail"/>

     <incomeDetails v-if="detailsshow" :detailsdrawershow="detailsshow" :detailsData="detailsData" :queryBillId="queryBillId" :reductionData="reductionData"
     @drawerClose="drawerClose" @handleEdit="handleEdit" @query='query' ref="billDetail"/>
  </div>
</template>
<script>
import context from '@/service'
import * as JSOG from 'jsog'
import billDetails from '@/views/operations/costCollection/billList/components/billDetails'
import incomeDetails from '@/views/operations/varietyBusiness/income/components/incomeDetails'
export default {
  name: 'billRecord',
  components: {
    billDetails,
    incomeDetails
  },
  props: {
    tenantDetail: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      pclTableHeight: 'auto',
      queryBillId: '',
      reductionData: {},
      detailsdrawershow: false,
      detailsshow: false,
      tableData: [],
      costTypeOptionsDj: [],
      costTypeOptions: [],
      statusOptions2: [{value: 'NO', label: '未付款'}, {value: 'OK', label: '结清'}, {value: 'SECTION', label: '部分结清'}],
      statusOptions: [{value: 'APPROVAL', label: '减免审核中'}, {value: 'UPDATE', label: '减免驳回待修改'}, {value: 'NO', label: '未付款'}, {value: 'OK', label: '结清'}, {value: 'SECTION', label: '部分结清'}],
      repairTime: '',
      endTime: '',
      cost: '',
      billStatus: '',
      pager: {
        currentPage: 1,
        pgNum: 1,
        total: 0,
        pgSize: 15,
        flowDetailsData: {},
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
      actionIndex: 1,
      billCategory: 'NORMAL',
      detailsData: '',
      builddetailsData: ''
    }
  },
  watch: {
    tenantDetail: {
      handler: function () {
        this.bills()
        this.getFeeType()
      }
    }
  },
  created () {
    this.bills()
    this.getFeeType()
    this.getDjFeeType()
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    drawerClose () {
      this.detailsdrawershow = false
      this.detailsshow = false
      this.pclTableHeight = 'auto'
    },
    query () {},
    async handleEdit (index, row) {
      if (this.actionIndex === 1) {
        let result = await context.http.get(`cms/api/bills/${row.id}`)
        this.builddetailsData = JSOG.decode(result.data)
        this.detailsdrawershow = true
        this.pclTableHeight = '100px'
      } else {
        let result = await context.http.get(`cms/api/bills/${row.id}`)
        this.detailsData = JSOG.decode(result.data)
        this.detailsshow = true
        this.pclTableHeight = '100px'
      }
    },
    current_change (currentPage) {
      this.pager.currentPage = currentPage
      if (this.actionIndex === 1) {
        this.billCategory = 'NORMAL'
      } else {
        this.billCategory = 'DIVERSIFICATION'
      }
      this.bills()
    },
    currentSel () {
      this.pager.currentPage = 1
      if (this.actionIndex === 1) {
        this.billCategory = 'NORMAL'
      } else {
        this.billCategory = 'DIVERSIFICATION'
      }
      this.bills()
    },
    async getDjFeeType () {
      let result1 = await context.http.get('/uaa/api/paramet-managements/name', { name: '多经费用类型' })
      this.costTypeOptionsDj = result1.data
    },
    async getFeeType () {
      let result1 = await context.http.get('/uaa/api/paramet-managements/name', { name: '费用类型' })
      this.costTypeOptions = result1.data
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
    getAllBill () {
      if (this.actionIndex === 1) {
        this.billCategory = 'NORMAL'
      } else {
        this.billCategory = 'DIVERSIFICATION'
      }
      this.pager.currentPage = 1
      this.bills()
    },
    getMultipleBill () {
      this.billCategory = 'DIVERSIFICATION'
      this.pager.currentPage = 1
      this.bills()
    },
    bills () {
      context.http.get('/cms/api/bills/v1?sort=finalPaymentDate,desc&sort=id,desc', {
        tenantId: this.tenantDetail.id,
        billCategory: this.billCategory,
        billStatus: this.billStatus,
        startDate: this.repairTime,
        endDate: this.endTime,
        feeType: this.cost,
        page: (this.pager.currentPage - 1),
        size: this.pager.pgSize
      }).then(res => {
        this.tableData = res.data
        this.pager.total = Number(res.headers['x-total-count'])
      })
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '本页合计'
          return
        }
        let values = []
        if (column.property !== 'expectedDay') {
          values = data.map(item => Number(item[column.property]))
        }
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = sums[index].toFixed(2)
          sums[index] += ''
        } else {
          sums[index] = ''
        }
      })

      return sums
    }
  }
}
</script>
<style lang="scss" scoped>
  .bill-record{
    .pl-content {
      width: 100%;
      margin: 0 auto;
      .navTab{
        width: 206px;
        display: flex;
        span {
          display: inline-block;
          border: 1px solid #3577f6;
          width: 100px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border-radius: 5px;
          color: #333;
          background-color: #fff;
          cursor: pointer;
          &:first-child {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          }
          &:last-child {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
        }
        .actived{
          background-color: #3577f6;
          color: #fff;
        }
      }
      .plc-search {
        height: 70px;
        background-color: #fff;
        margin: 20px 0;
        padding-left: 18px;
        font-size: 14px;
        .el-input {
          width: 120px;
          height: 32px;
          input {
            height: 32px;
            line-height: 32px;
          }
          .el-input__prefix, .el-input__suffix {
            top: 10px;
          }
        }
        .screen{
          width: 140px;
          margin: 0 10px;
        }
        div {
          // float: left;
          display: inline-block;
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
      }
      .el-date-editor {
        .el-input__prefix, .el-input__suffix {
          top: 0!important;
        }
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
        margin-top: 20px;
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
            background: rgba(222, 235, 254, 1);
            color: #5b9af8;
            opacity: 0.9;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
          }
        }
      }
      .plc-bottom{
        li{
          width: 108px!important;
        }
      }
      .plc-table-bottom{
        margin-top: 20px;
        border: 1px solid rgba(238,238,238,1);
        ul {
          height: 35px;
          &:first-child{
            border-bottom: 1px solid rgba(238,238,238,1);
          }
          li{
            display: inline-block;
            width: 82px;
            line-height: 35px;
            text-align: center;
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
      }
      .el-textarea{
        width: 178px;
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
</style>

