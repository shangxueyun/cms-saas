
<template>
  <div class="tradeFrom">
    <span class="page_head_title">流水报表</span>
    <div class="pl-content">
      <ul class="default_tab_block">
        <li @click="changeTab('orderBill')"
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
        <li class="active"
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
          <div class="switch-btn">
            <span @click="changeCondition('DAY')"
                  :class="{'switch-select': condition === 'DAY'}">日</span>
            <span @click="changeCondition('MONTH')"
                  :class="{'switch-select': condition === 'MONTH'}">月</span>
          </div>
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
          <el-date-picker type="date"
                          v-show="condition === 'DAY'"
                          class="screen"
                          value-format="yyyy-MM-dd"
                          v-model="seachParam.startTime"
                          :clearable="false"
                          :picker-options="pickerBeginDayBefore"
                          placeholder="开始时间"
                          style="margin-right:0">
          </el-date-picker>
          <span style="color: #dadada;padding: 0 4px;"
                v-show="condition === 'DAY'">—</span>
          <el-date-picker type="date"
                          v-show="condition === 'DAY'"
                          class="screen"
                          value-format="yyyy-MM-dd"
                          v-model="seachParam.endTime"
                          :clearable="false"
                          :picker-options="pickerBeginDayAfter"
                          placeholder="结束时间">
          </el-date-picker>
          <el-date-picker :clearable="false"
                          v-show="condition === 'MONTH'"
                          style="display: inline-flex;width: 140px;margin-right:0"
                          v-model="seachParam.startTime"
                          type="month"
                          value-format="yyyy-MM-dd"
                          :picker-options="pickerBeginDayBefore"
                          placeholder="开始月份">
          </el-date-picker>
          <span style="color: #dadada;padding: 0 4px;"
                v-show="condition === 'MONTH'">—</span>
          <el-date-picker :clearable="false"
                          v-show="condition === 'MONTH'"
                          style="display: inline-flex;width: 140px"
                          v-model="seachParam.endTime"
                          type="month"
                          value-format="yyyy-MM-dd"
                          :picker-options="pickerBeginDayAfter"
                          placeholder="结束月份">
          </el-date-picker>
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
          <el-table-column prop="date"
                           label="时间"
                           :formatter="dateFormat"
                           align="center"></el-table-column>
          <el-table-column prop="tenantName"
                           label="品牌名称"
                           align="center"></el-table-column>
          <el-table-column prop="saleNumber"
                           label="销售单数"
                           align="center"></el-table-column>
          <el-table-column prop="saleAmount"
                           label="销售金额/元"
                           align="center"></el-table-column>
          <el-table-column prop="refundNumber"
                           label="退货单数"
                           align="center"></el-table-column>
          <el-table-column prop="refundAmount"
                           label="退货金额/元"
                           align="center"></el-table-column>
          <el-table-column prop="sjAmount"
                           label="实销售额/元"
                           align="center"></el-table-column>
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

  </div>
</template>
<script>
import context from '@/service'

export default {
  name: 'tradeFrom',
  components: {

  },
  data () {
    return {
      condition: 'DAY',
      addData: {
        typeName: '',
        type: '',
        coverImg: ''
      },
      seachParam: {
        projectManagementId: '',
        tenantName: '',
        startTime: '',
        endTime: ''
      },
      detailsShow: false,
      detaileData: {
        imgUrls: []
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
            let oneDay = 24 * 60 * 60 * 1000
            // return time.getTime() < new Date(temp).getTime() || time.getTime() >= new Date(endDateVal).getTime()
            return time.getTime() > new Date(endDateVal).getTime()
          }
        }
      },
      pickerBeginDayAfter: {
        disabledDate: time => {
          let beginDateVal = this.seachParam.startTime
          if (beginDateVal) {
            let temp = new Date(beginDateVal).getTime() + 365 * 24 * 60 * 60 * 1000
            let oneDay = 24 * 60 * 60 * 1000
            // return time.getTime() > new Date(temp).getTime() || time.getTime() <= new Date(beginDateVal).getTime()
            return time.getTime() < new Date(beginDateVal).getTime() - oneDay
          }
        }
      }

    }
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
    this.seachParam.projectManagementId = this.options1[0].id
    this.getNowDate()
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
    dateFormat (row, column) {
      if (this.condition === 'MONTH') {
        return row.date.substring(0, 7)
      } else {
        return row.date
      }
    },
    getNowDate () {
      var now = new Date()
      var myyear = now.getFullYear()
      var mymonth = now.getMonth() + 1
      var day = now.getDate()
      mymonth = mymonth < 10 ? '0' + mymonth : mymonth
      day = day < 10 ? '0' + day : day
      let bsStartDate = myyear + '-' + mymonth
      this.monthTime = bsStartDate
      if (this.condition === 'DAY') {
        this.seachParam.startTime = myyear + '-' + mymonth + '-01'
        this.seachParam.endTime = bsStartDate + '-' + day
      } else {
        this.seachParam.startTime = myyear + '-01' + '-01'
        this.seachParam.endTime = bsStartDate + '-01'
      }
    },
    async query () {
      let type = this.condition.toLowerCase()
      let result = await context.http.get(`gos/api/tenant-order-reports/${type}`, {
        page: (this.currentPage - 1),
        size: this.pgSize,
        projectManagementId: this.seachParam.projectManagementId,
        tenantName: this.seachParam.tenantName,
        startTime: this.seachParam.startTime,
        endTime: this.seachParam.endTime
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      this.totalPages = Math.ceil(this.total / this.pgSize)
    },
    changeCondition (type) {
      this.condition = type
      this.getNowDate()
      this.queryRules()
      // this.seachParam.startTime = ''
      // this.seachParam.endTime = ''
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
<style lang="scss" >
.tradeFrom {
  .search-bar .el-input__inner {
    margin-right: 0px;
  }
}
</style>
<style lang="scss" scoped>
.tradeFrom {
  .search-bar {
    > div {
      .switch-btn {
        display: inline-flex;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        margin-right: 10px;
        span {
          display: inline-block;
          width: 42px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          cursor: pointer;
          border-radius: 4px;
          &:first-child {
            border-right: none;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          }
          &:last-child {
            border-left: none;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
        }
      }
      .switch-select {
        background-color: #3577f6;
        color: #fff;
      }
      > div:not(.switch-btn) {
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
