
<template>
  <div class="orderBill">
    <span class="page_head_title">流水报表</span>
    <div class="pl-content">
      <ul class="default_tab_block">
        <li class="active"
            v-if="hasAuthority('02050201')">
          <span>客户线下订单流水</span>
        </li>
        <li @click="changeTab('orderBillOnline')"
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
      <div class="search-bar">
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
          <el-input placeholder="品牌名称"
                    v-model="seachParam.tenantName"></el-input>
          <el-select v-model="seachParam.orderType"
                     placeholder="订单类型"
                     clearable>
            <el-option label="销售"
                       value="SALE"></el-option>
            <el-option label="退货"
                       value="REFUND"></el-option>
          </el-select>
          <el-select v-model="seachParam.orderResult"
                     placeholder="订单状态"
                     clearable>
            <el-option label="处理中"
                       value="WAIT"></el-option>
            <el-option label="成功"
                       value="SUCCESS"></el-option>
            <el-option label="失败"
                       value="FAIL"></el-option>
          </el-select>
          <el-date-picker type="date"
                          class="screen"
                          :editable="false"
                          clearable
                          value-format="yyyy-MM-ddTHH:mm:ss"
                          v-model="seachParam.startTime"
                          :picker-options="pickerBeginDayBefore"
                          placeholder="开始时间"
                          style="margin-right:0">
          </el-date-picker>
          <span style="color: #dadada;padding: 0 4px;">—</span>
          <el-date-picker type="date"
                          class="screen"
                          :editable="false"
                          clearable
                          value-format="yyyy-MM-ddT23:59:59"
                          v-model="seachParam.endTime"
                          :picker-options="pickerBeginDayAfter"
                          placeholder="结束时间">
          </el-date-picker>
          <el-select v-model="seachParam.PayMethod"
                     placeholder="支付方式"
                     clearable>
            <el-option label="现金"
                       value="CRASH"></el-option>
            <el-option label="微信"
                       value="WECHAT"></el-option>
            <el-option label="支付宝"
                       value="ALIPAY"></el-option>
            <!-- <el-option label="网银"
                       value="BLANK"></el-option> -->
          </el-select>
          <span class="query-btn"
                @click="queryRules">查询</span>
        </div>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column prop="projectManagementName"
                           label="项目简称"
                           align="center"></el-table-column>
          <el-table-column prop="tenantName"
                           label="品牌名称"
                           align="center"></el-table-column>
          <el-table-column prop="orderNumber"
                           label="订单号"
                           align="center"></el-table-column>
          <el-table-column prop="orderType"
                           label="订单类型"
                           :formatter="orderTypeFormat"
                           align="center"></el-table-column>
          <el-table-column label="订单状态"
                           :formatter="orderResultFormat"
                           align="center"></el-table-column>
          <el-table-column prop="payMethod"
                           :formatter="payMethodFormat"
                           label="支付方式"
                           align="center"></el-table-column>
          <el-table-column prop="orderAmount"
                           label="订单金额/元"
                           align="center"></el-table-column>
          <el-table-column prop="sjAmount"
                           label="实收金额/元"
                           align="center"></el-table-column>
          <el-table-column prop="orderTime"
                           label="订单时间"
                           :formatter="orderTimeFormat"
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
    <orderBillDetails :detailsdrawershow="detailsShow"
                      ref="orderBillDetails"
                      :draweDetaileData="detaileData"
                      @drawerClose="drawerClose" />
  </div>
</template>
<script>
import context from '@/service'
import orderBillDetails from '../components/orderBillDetails'
export default {
  name: 'orderBill',
  components: {
    orderBillDetails
  },
  data () {
    var cheackCoverImg = (rule, value, callback) => {
      if (!value || value === '') {
        return callback(new Error('请上传品牌LOGO'))
      } else {
        callback()
      }
    }
    var cheackImgUrls = (rule, value, callback) => {
      if (!value || value.length === 0) {
        return callback(new Error('请上传品牌图片'))
      } else {
        callback()
      }
    }
    return {
      addData: {
        typeName: '',
        type: '',
        coverImg: ''
      },
      seachParam: {
        projectManagementId: '',
        tenantName: '',
        orderResult: '',
        orderType: '',
        startTime: '',
        endTime: '',
        PayMethod: ''
      },
      detailsShow: false,
      detaileData: {
        orderTime: ''
      },
      addBrandDialogVisible: false,
      options1: [],
      tableData: [],
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
      let result = await context.http.get('gos/api/tenant-orders', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'orderTime,desc',
        projectManagementId: this.seachParam.projectManagementId,
        tenantName: this.seachParam.tenantName,
        orderType: this.seachParam.orderType,
        orderResult: this.seachParam.orderResult,
        startTime: this.seachParam.startTime,
        endTime: this.seachParam.endTime,
        PayMethod: this.seachParam.PayMethod
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      this.totalPages = Math.ceil(this.total / this.pgSize)
    },
    handleEdit (index, row) {
      context.http.get(`gos/api/tenant-orders/${row.id}`).then(res => {
        if (res) {
          this.detaileData = res.data
          this.detailsShow = true
        }
      })
    },
    orderResultFormat (row, colmn) {
      if (row.orderResult === 'WAIT') {
        return '处理中'
      } else if (row.orderResult === 'SUCCESS') {
        return '成功'
      } else if (row.orderResult === 'FAIL') {
        return '失败'
      }
    },
    orderTypeFormat (row, colmn) {
      // SALE 销售, REFUND 退货
      if (row.orderType === 'SALE') {
        return '销售'
      } else if (row.orderType === 'REFUND') {
        return '退货'
      }
    },
    payMethodFormat (row, colmn) {
      // CRASH 现金, WECHAT 微信, ALIPAY 支付宝, BLANK 网银
      if (row.payMethod === 'CRASH') {
        return '现金'
      } else if (row.payMethod === 'WECHAT') {
        return '微信'
      } else if (row.payMethod === 'ALIPAY') {
        return '支付宝'
      } else if (row.payMethod === 'BLANK') {
        return '网银'
      }
    },
    orderTimeFormat (row, colmn) {
      return row.orderTime.replace('T', ' ')
    },
    drawerClose () {
      this.detailsShow = false
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
      this.query()
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    }
  }
}
</script>
<style lang="scss" scoped>
.orderBill {
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
