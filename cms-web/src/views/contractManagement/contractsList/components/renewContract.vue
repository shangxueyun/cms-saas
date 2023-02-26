<template>
  <div class="renew-contract">
      <div class="amount clearfix">
        <div>
          <p>品牌</p>
          <p>{{renewBill.tenantName}}</p>
        </div>
        <div>
          <p>合同时间</p>
          <p>{{renewBill.startDate}}~{{renewBill.endDate}}</p>
        </div>
      </div>
      <div class="dc-right">
        <div class="dr-head" style="margin-bottom: 0">缴费情况</div>
        <div class="selected-housing bill-details">
          <ul>
            <li>费用类型</li>
            <li>账单数量</li>
            <li>逾期次数</li>
            <li>是否结清</li>
          </ul>
          <ul v-for="(item, index) in renewBill.paymentSituationDTOS" :key="index">
            <li>{{item.feeTypeName}}</li>
            <li>{{item.number}}</li>
            <li>{{item.yqNumber}}</li>
            <li style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" :title="item.remark">{{item.remark}}</li>
          </ul>
        </div>
      </div>
      <div class="dl-head info_tab">
        <ul class="nav">
          <li @click="changeNav(index)" v-for="(item, index) in navList" :key="index" :class="item.value ? 'select_active' : ''">{{item.label}}</li>
        </ul>
      </div>
      <el-table
        ref="multipleTable"
        :data="marginBillData"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          prop="feeTypeName"
          label="费用类型"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="账单金额/元"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="sjAmount"
          align="center"
          label="实收金额/元"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="address"
          align="center"
          label="计费周期"
          show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.startDate }} ~ {{ scope.row.endDate }}</template>
        </el-table-column>
        <el-table-column
          prop="finalPaymentDate"
          align="center"
          label="应收时间"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="billStatus"
          align="center"
          label="账单状态"
          :formatter="formatterBillStatus"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="billType"
          align="center"
          label="账单类型"
          :formatter="formatterBillType"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          align="center"
          label="滞纳金金额/元"
          show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.lateFee ? (scope.row.lateFee).toFixed(2) : scope.row.lateFee }}</template>
        </el-table-column>
      </el-table>
  </div>
</template>
<script>
export default {
  name: 'renewContract',
  props: {
    renewBill: {
      type: Object
    },
    marginBill: {
      type: Array,
      defulat: []
    }
  },
  data () {
    return {
      tableData: [],
      rentBill: true,
      marginBillData: [],
      navList: [{label: '租金/保证金账单', value: true}, {label: '物业费/保证金账单', value: false}]
    }
  },
  watch: {
    marginBill: {
      handler: function () {
        this.marginBillData = this.marginBill.filter(function (ele, index) {
          return ele.feeTypeName === '租金保证金' || ele.feeTypeName === '租金'
        })
        this.navList[0].value = true
        this.navList[1].value = false
      }
    }
  },
  mounted () {
  },
  methods: {
    changeNav (inx) {
      this.navList.forEach(item => {
        item.value = false
      })
      this.navList[inx].value = true
      if (inx === 0) {
        this.rentBill = true
        this.marginBillData = this.marginBill.filter(function (ele, index) {
          return ele.feeTypeName === '租金保证金' || ele.feeTypeName === '租金'
        })
      } else if (inx === 1) {
        this.rentBill = false
        this.marginBillData = this.marginBill.filter(function (ele, index) {
          return ele.feeTypeName === '物业费' || ele.feeTypeName === '物业费保证金'
        })
      }
    },
    formatterFeeType (row, column) {
      let feeType
      switch (row.feeType) {
        case 'RENT':
          feeType = '租金'
          break
        case 'RENT_DEPOSIT':
          feeType = '租金保证金'
          break
        case 'PROPERTY':
          feeType = '物业费'
          break
        case 'PROPERTY_DEPOSIT':
          feeType = '物业费保证金'
          break
        case 'INTENTION':
          feeType = '意向金'
          break
        case 'DECORATION':
          feeType = '装修保证金'
          break
        case 'F_INTENTION':
          feeType = '返还意向金'
          break
        case 'F_DECORATION':
          feeType = '返还装修保证金'
          break
        case 'WITHDRAWAL':
          feeType = '退租结算'
          break
        case 'RELEASE':
          feeType = '合同解除结算'
          break
      }
      return feeType
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
    }
  }
}
</script>
<style lang="scss">
  .renew-contract{
    .dc-right{
      width: 100%;
      border: 1px solid #e7e7e7;
      ul {
        display: flex;
        border-bottom:1px solid rgba(246,246,246,1);
        &:first-child {
          border-bottom: 1px solid #e7e7e7;
        }
        &:last-child {
          border-bottom: none;
        }
        li {
          width: 25%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          &:last-child {
            border: none;
          }
        }
      }
    }
    .dr-head{
      background-color: #fafafa;
      height: 40px;
      line-height: 40px;
      padding-left: 12px;
      font-size: 14px;
    }
    .info_tab{
      height: 48px;
      display: -ms-flexbox;
      display: flex;
      background-color: #fff;
      margin: 10px 0 20px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      -ms-flex-pack: justify;
      justify-content: space-between;
      -ms-flex-align: center;
      align-items: center;
      padding-right: 44px;
      border-bottom: 1px solid #ecedef;
      .nav{
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
  }
</style>

