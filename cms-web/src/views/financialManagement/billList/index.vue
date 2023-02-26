<template>
  <div class="building-list">
    账单列表
    <div class="pl-content">
      <div class="plc-search">
        <el-input v-model="referred"
                  placeholder="品牌"></el-input>
        <div class="query-btn"
             @click="query">查询</div>
        <div class="export"
             v-if="hasAuthority('02050105')">
          <span @click="exportData">
            <i class="iconfont icon-xiazaidaoru"></i>
            导出</span>
        </div>
      </div>
      <!-- <div class="hourse_tab">
      	<ul class="nav">
      		<li @click="changeNav(index)" v-for="(item, index) in navList" :key="index" :class="item.value ? 'select_active' : ''">{{item.label}}</li>
      	</ul>
        <div class="export">
          <span>导出</span>
        </div>
      </div> -->
      <div class="plc-table">
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column prop="billType"
                           label="账单类型"
                           align="center"
                           :formatter="formatterBillType"></el-table-column>
          <el-table-column prop="feeType"
                           label="费用类型"
                           align="center"
                           :formatter="formatterFeeType"></el-table-column>
          <el-table-column prop="amount"
                           label="账单金额/元"
                           align="center"></el-table-column>
          <el-table-column prop="billStatus"
                           label="账单状态"
                           align="center"
                           :formatter="formatterBillStatus"></el-table-column>
          <el-table-column prop="referred"
                           label="品牌"
                           align="center"></el-table-column>
          <el-table-column prop="finalPaymentDate"
                           label="应收时间"
                           align="center"></el-table-column>
          <el-table-column label="计费周期"
                           align="center">
            <template slot-scope="scope">
              {{scope.row.startDate}}~{{scope.row.endDate}}
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           align="center"
                           v-if="hasAuthority('02050101')">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.$index, scope.row)"
                         class="el-button--primary operation-btn"
                         size="mini">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="ctc-foot">
        <div class="pagingnum">
          显示 <select v-model="pgSize"
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
    <billDetails :detailsdrawershow="detailsdrawershow"
                 :detailsData="builddetailsData"
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
import billDetails from './components/billDetails'
import { toLocaleString, toLocaleFixed } from '@/utils/validate.js'
import * as JSOG from 'jsog'
export default {
  name: 'billList',
  components: {
    billDetails
  },
  data () {
    return {
      navList: [{ label: '本期未结清', value: true }, { label: '逾期未结清', value: false }, { label: '退租未结清', value: false }, { label: '自建未结清', value: false }],
      referred: '',
      checkList: ['USING'],
      adddialogVisible: false,
      addProjectShow: false,
      detailsdrawershow: false,
      tableData: [],
      currentPage: 1,
      pgNum: 1,
      total: 0,
      pgSize: 15,
      builddetailsData: {},
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
      reductionData: {}
    }
  },
  created () {
    this.query()
  },
  mounted () {
    let billId = this.$route.query.billId
    if (billId) {
      context.http.get(`cms/api/bills/${billId}`).then(res => {
        this.builddetailsData = res.data
        this.detailsdrawershow = true
        this.queryBillId = billId.toString()
      })
    }
    let reductionId = this.$route.query.reductionId
    if (reductionId) { // 减免信息
      context.http.get(`/cms/api/reductions/${reductionId}`).then(res => {
        this.reductionData = res.data
        context.http.get(`cms/api/bills/${this.reductionData.billId}`).then(res => {
          if (res.data) {
            this.builddetailsData = res.data
            this.detailsdrawershow = true
          }
        })
        this.$refs.billDetail.exemptionVisible('edit')
      })
    }
  },
  methods: {
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
      } else if (inx === 1) {
        this.onRent = true
      } else {
        this.onRent = null
      }
      this.currentPage = 1
      this.query()
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
    projectDetails () {
      this.addProjectShow = true
    },
    drawerClose () {
      this.detailsdrawershow = false
    },
    dialogHide () {
      this.adddialogVisible = false
    },
    formatStatus () {

    },
    async query () {
      let result = await context.http.get('cms/api/bills', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'id,desc',
        referred: this.referred
      })
      this.tableData = result.data
      this.tableData.forEach(ele => {
        ele.amount = toLocaleString(ele.amount)
      })
      this.total = Number(result.headers['x-total-count'])
    },
    bindCheckBox (value) {
      this.checkList = []
      this.checkList.push(value[1])
      this.currentPage = 1
      this.query()
    },
    async handleEdit (index, row) {
      let result = await context.http.get(`cms/api/bills/${row.id}`)
      this.builddetailsData = JSOG.decode(result.data)
      this.detailsdrawershow = true
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    goCharts (index, row) {
      this.$router.push({ path: '/home/charts', query: { buildingId: row.id } })
    },
    async exportData () {
      axios({ method: 'GET', url: '/cms/api/bills/report', params: { referred: this.referred, page: (this.currentPage - 1), size: this.pgSize, sort: 'id,desc' }, responseType: 'blob' }).then(res => {
        console.log(res)
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
    }
  }
}
</script>
<style lang="scss" scoped>
.building-list {
  font-size: 16px;
  background-color: #f9f9f9;
  .pl-content {
    width: 100%;
    margin: 0 auto;
    .plc-search {
      height: 70px;
      line-height: 70px;
      background-color: #fff;
      margin: 20px 0;
      padding-left: 18px;
      box-shadow: 1px 2px 5px #eee;
      .el-input {
        width: 180px;
        height: 32px;
        input {
          height: 32px;
          line-height: 32px;
        }
      }
      div {
        float: left;
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
      position: relative;
      .export {
        position: absolute;
        right: 20px;
        top: 0;
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
}
</style>
