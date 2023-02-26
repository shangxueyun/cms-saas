
<template>
  <div class="orderBillOnline">
    <span class="page_head_title">流水报表</span>
    <div class="pl-content">
      <ul class="default_tab_block">
        <li @click="changeTab('orderBill')"
            v-if="hasAuthority('02050201')">
          <span>客户线下订单流水</span>
        </li>
        <li class="active"
            v-if="hasAuthority('02050205')">
          <span>客户线上订单流水</span>
        </li>
        <li @click="changeTab('tradeBill')"
            v-if="hasAuthority('02050202')">
          <span>商品交易流水</span>
        </li>
        <li @click="changeTab('tradeFrom')"
            v-if="hasAuthority('02050203')">
          <span>客户交易报表</span>
        </li>
        <li @click="changeTab('weighingBill')"
            v-if="hasAuthority('02050204')">
          <span>称重数据报表</span>
        </li>
      </ul>
      <div class="search-bar1">
        <div class="switch-tab">
          <span :class="{'active' : selectedIdx === 0}"
                @click="changeSwitchTab(0)">子订单</span>
          <span :class="{'active' : selectedIdx === 1}"
                @click="changeSwitchTab(1)">总订单</span>
        </div>
      </div>
      <div class="search-bar"
           v-if="selectedIdx === 0"
           key="0">
        <div>
          <el-select v-model="seachParam.projectManagementId"
                     clearable
                     placeholder="项目简称">
            <el-option v-for="item in options1"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-input placeholder="品牌名称/配送员/配送员电话"
                    style="width:250px"
                    v-model="seachParam.tenantReferred"></el-input>
          <el-select v-model="seachParam.orderStatus"
                     placeholder="订单状态"
                     clearable>
            <el-option v-for="(item,index) in options"
                       :key="index"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
          <el-date-picker type="date"
                          class="screen"
                          :editable="false"
                          clearable
                          value-format="yyyy-MM-ddTHH:mm:ss"
                          v-model="seachParam.start"
                          :picker-options="pickerBeginDayBefore"
                          placeholder="下单开始时间"
                          style="margin-right:0">
          </el-date-picker>
          <span style="color: #dadada;padding: 0 4px;">—</span>
          <el-date-picker type="date"
                          class="screen"
                          :editable="false"
                          clearable
                          value-format="yyyy-MM-ddT23:59:59"
                          v-model="seachParam.end"
                          :picker-options="pickerBeginDayAfter"
                          placeholder="结束时间">
          </el-date-picker>
          <span class="query-btn"
                @click="queryRules">查询</span>
        </div>
      </div>
      <div class="search-bar"
           v-else
           key="1">
        <div>
          <el-select v-model="seachParam.projectManagementId"
                     clearable
                     placeholder="项目简称">
            <el-option v-for="item in options1"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-date-picker type="date"
                          class="screen"
                          :editable="false"
                          clearable
                          value-format="yyyy-MM-ddTHH:mm:ss"
                          v-model="seachParam.start"
                          :picker-options="pickerBeginDayBefore"
                          placeholder="下单开始时间"
                          style="margin-right:0">
          </el-date-picker>
          <span style="color: #dadada;padding: 0 4px;">—</span>
          <el-date-picker type="date"
                          class="screen"
                          :editable="false"
                          clearable
                          value-format="yyyy-MM-ddT23:59:59"
                          v-model="seachParam.end"
                          :picker-options="pickerBeginDayAfter"
                          placeholder="结束时间">
          </el-date-picker>
          <span class="query-btn"
                @click="queryRules">查询</span>
        </div>
      </div>
      <div class="plc-table"
           v-if="selectedIdx === 0"
           key="2">
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column prop="projectManagementName"
                           label="项目简称"
                           align="center"></el-table-column>
          <el-table-column prop="tenantReferred"
                           label="品牌名称"
                           align="center"></el-table-column>
          <el-table-column prop="tenantOrderNumber"
                           label="订单号"
                           align="center"></el-table-column>
          <el-table-column prop="orderStatus"
                           label="订单状态"
                           :formatter="orderStatusFormat"
                           align="center"></el-table-column>
          <el-table-column prop="totalFee"
                           label="订单金额/元"
                           align="center"></el-table-column>
          <el-table-column prop="refundAmount"
                           label="退款金额/元"
                           align="center"></el-table-column>
          <el-table-column prop="actualPayment"
                           label="实收金额/元"
                           align="center"></el-table-column>
          <el-table-column prop="distributionPersonName"
                           label="配送员"
                           align="center"></el-table-column>
          <el-table-column prop="distributionTelephone"
                           label="配送员电话"
                           align="center"></el-table-column>
          <el-table-column label="下单时间"
                           :formatter="orderTimeFormat"
                           align="center"></el-table-column>
          <el-table-column label="完成时间"
                           :formatter="corderTimeFormat"
                           align="center"></el-table-column>
          <el-table-column label="操作"
                           align="center">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.$index, scope.row)"
                         class="el-button--primary operation-btn"
                         size="mini">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="plc-table"
           v-else
           key="3">
        <el-table :data="ordertableData"
                  style="width: 100%">
          <el-table-column prop="projectManagementName"
                           label="项目简称"
                           align="center"></el-table-column>
          <el-table-column prop="orderNumber"
                           label="订单号"
                           align="center"></el-table-column>
          <el-table-column prop="totalFee"
                           label="订单金额/元"
                           align="center"></el-table-column>
          <el-table-column prop="tenantOrderCount"
                           label="子订单数"
                           align="center"></el-table-column>
          <el-table-column label="下单时间"
                           :formatter="orderTimeFormat2"
                           align="center"></el-table-column>
          <el-table-column label="操作"
                           align="center">
            <template slot-scope="scope">
              <el-button @click="handleDetail(scope.$index, scope.row)"
                         class="el-button--primary operation-btn"
                         size="mini">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="ctc-foot1"
           v-if="total > 0">
        <span><span style="margin-right:10px">{{currentPage}}/{{totalPages}}页</span> 共{{total}}条记录</span>
        <el-pagination background
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
    <!-- 客户订单流水详情 -->
    <orderBillOnlineDetails :detailsdrawershow="detailsShow"
                            ref="orderBillOnlineDetails"
                            :draweDetaileData="detaileData"
                            @drawerClose="drawerClose" />
    <!-- 总订单详情 -->
    <total-order-details :detailsdrawershow="totalDetailsShow"
                         ref="TotalOrderDetails"
                         :draweDetaileData="totalDetaileData"
                         @drawerClose="drawerClose2" />
  </div>
</template>
<script>
import context from '@/service'
import orderBillOnlineDetails from '../components/orderBillOnlineDetails'
import TotalOrderDetails from '../components/TotalOrderDetails'
export default {
  name: 'orderBillOnline',
  components: {
    orderBillOnlineDetails,
    TotalOrderDetails
  },
  data () {
    return {
      totalDetailsShow: false,
      selectedIdx: 0,
      totalDetaileData: {},
      options: [
        { label: '未支付', value: 'NOT_PAY' },
        { label: '待接单', value: 'NOT_ACCEPTORDER' },
        { label: '已接单', value: 'ACCEPTORDER' },
        // { label: '拣货中', value: '3' },
        { label: '待配送', value: 'NOT_DISTRIBUTION' },
        { label: '配送中', value: 'DISTRIBUTION' },
        { label: '已完成', value: 'COMPLETE' },
        { label: '已取消', value: 'CANCELLED' }
      ],
      addData: {
        typeName: '',
        type: '',
        coverImg: ''
      },
      seachParam: {
        projectManagementId: '',
        tenantReferred: '',
        orderStatus: '',
        start: '',
        end: ''
      },
      detailsShow: false,
      detaileData: {
        order: {},
        details: [],
        applyRefundRecords: [{ orderDetail: {} }]
      },
      addBrandDialogVisible: false,
      options1: [],
      tableData: [],
      ordertableData: [],
      floorList: [],
      currentPage: 1,
      totalPages: 1,
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
      ],
      pickerBeginDayBefore: {
        disabledDate: time => {
          let endDateVal = this.seachParam.endTime
          if (endDateVal) {
            let temp = new Date(endDateVal).getTime() - 365 * 24 * 60 * 60 * 1000
            return time.getTime() < new Date(temp).getTime() || time.getTime() > new Date(endDateVal).getTime()
          }
        }
      },
      pickerBeginDayAfter: {
        disabledDate: time => {
          let beginDateVal = this.seachParam.startTime
          if (beginDateVal) {
            let temp = new Date(beginDateVal).getTime() + 365 * 24 * 60 * 60 * 1000
            return time.getTime() > new Date(temp).getTime() || time.getTime() < new Date(beginDateVal).getTime()
          }
        }
      }

    }
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
    this.seachParam.projectManagementId = this.options1[0].id
    this.query()
  },
  watch: {
    addBrandDialogVisible: {
      handler: function (newVal, oldVal) {
        if (newVal) {

        }
      }
    }
  },
  mounted () {

  },
  methods: {
    async query () {
      let result = await context.http.get('ord/api/tenantOrders?sort=orderCreateOrderTime,desc', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        // sort: 'orderTime,desc',
        projectManagementId: this.seachParam.projectManagementId,
        tenantReferred: this.seachParam.tenantReferred,
        orderStatus: this.seachParam.orderStatus,
        start: this.seachParam.start,
        end: this.seachParam.end
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      this.totalPages = Math.ceil(this.total / this.pgSize)
    },
    async queryOrder () {
      let result = await context.http.get('ord/api/orders', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'createOrderTime,desc',
        projectManagementId: this.seachParam.projectManagementId,
        start: this.seachParam.start,
        end: this.seachParam.end
      })
      this.ordertableData = result.data
      this.total = Number(result.headers['x-total-count'])
      this.totalPages = Math.ceil(this.total / this.pgSize)
    },
    handleEdit (index, row) {
      context.http.get(`ord/api/tenantOrders/detail/${row.id}`).then(res => {
        if (res) {
          this.detaileData = res.data
          this.detailsShow = true
        }
      })
    },
    orderStatusFormat (row, colmn) {
      // 待接单、已接单、拣货中、待配送、配送中、已完成、已取消
      //  'NOT_ACCEPTORDER', 'ACCEPTORDER', 'PREPAREGOODS', 'NOT_DISTRIBUTION', 'DISTRIBUTION', 'CANCELLED', 'COMPLETE'
      if (row.orderStatus === 'CANCELLED') {
        return '已取消'
      } else if (row.orderStatus === 'COMPLETE') {
        return '已完成'
      } else if (row.orderStatus === 'DISTRIBUTION') {
        return '配送中'
      } else if (row.orderStatus === 'NOT_DISTRIBUTION') {
        return '待配送'
      } else if (row.orderStatus === 'ACCEPTORDER') {
        return '已接单'
      } else if (row.orderStatus === 'NOT_ACCEPTORDER') {
        return '待接单'
      } else if (row.orderStatus === 'NOT_PAY') {
        return '未支付'
      }
    },
    orderTimeFormat (row, colmn) {
      if (row.order.createOrderTime) {
        return row.order.createOrderTime.replace('T', ' ')
      } else {
        return ''
      }
    },
    corderTimeFormat (row, colmn) {
      if (row.completionTime) {
        return row.completionTime.replace('T', ' ')
      } else {
        return ''
      }
    },
    orderTimeFormat2 (row, colmn) {
      if (row.createOrderTime) {
        return row.createOrderTime.replace('T', ' ')
      } else {
        return ''
      }
    },
    drawerClose () {
      this.detailsShow = false
    },
    drawerClose2 () {
      this.totalDetailsShow = false
    },
    changeTab (name) {
      this.$router.push({
        name: name,
        params: {}
      })
    },
    queryRules () {
      this.currentPage = 1
      this.pgSize = 15
      this.queryAll()
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.queryAll()
    },
    currentSel () {
      this.currentPage = 1
      this.queryAll()
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    changeSwitchTab (index) {
      this.selectedIdx = index
      this.currentPage = 1
      this.queryAll()
    },
    queryAll () {
      if (this.selectedIdx === 0) {
        this.query()
      } else {
        this.queryOrder()
      }
    },
    handleDetail (index, row) {
      context.http.get(`/ord/api/orders/${row.id}`).then(res => {
        if (res) {
          this.totalDetaileData = res.data
          this.totalDetailsShow = true
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.orderBillOnline {
  .search-bar1 {
    background-color: #fff;
    .switch-tab {
      display: flex;
      padding: 15px 0 15px 20px;
      border-bottom: 1px solid #f9f9f9;
      border-radius: 4px;
      span {
        display: inline-block;
        background-color: #f9f9f9;
        color: #606266;
        width: 150px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        cursor: pointer;
        &.active {
          color: #fff;
          background-color: #2a6ef0;
        }
      }
    }
  }
  .search-bar {
    > div {
      > div {
        width: 160px;
      }
    }
  }
  .plc-table {
    .onlineBtn {
      display: inline-block;
      width: 56px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border: 1px solid rgba(68, 175, 105, 1);
      border-radius: 3px;
      color: #44af69;
      cursor: pointer;
    }
    .offlineBtn {
      display: inline-block;
      width: 56px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border: 1px solid #eb605b;
      border-radius: 3px;
      color: #eb605b;
      cursor: pointer;
    }
  }
  .plc-search {
    min-height: 70px;
    line-height: 0;
    background-color: #fff;
    margin: 20px 0;
    padding-left: 18px;
    padding-right: 18px;
    box-shadow: 1px 2px 5px #eee;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -ms-flex-pack: justify;
    justify-content: space-between;
    align-items: center;
    position: relative;
    > div {
      > div {
        margin-right: 15px;
      }
    }
  }
  .typeTab {
    height: 60px;
    line-height: 60px;
    background-color: #ffffff;
    margin-top: 15px;
    box-shadow: 4px 4px 4px 1px #eee;
    > span {
      display: inline-block;
      width: 120px;
      text-align: center;
      cursor: pointer;
      &.active {
        color: #3175d2;
        border-bottom: 2px solid #3175d2;
      }
    }
  }
}
</style>
