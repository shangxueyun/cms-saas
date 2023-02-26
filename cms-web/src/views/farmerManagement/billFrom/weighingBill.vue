
<template>
  <div class="weighingBill">
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
        <li @click="changeTab('tradeFrom')"
            v-if="hasAuthority('02050203')">
          <span>客户交易报表</span>
        </li>
        <li class="active"
            v-if="hasAuthority('02050204')">
          <span>称重数据报表</span>
        </li>
      </ul>
      <div class="search-bar">
        <div>
          <el-select v-model="seachParam.projectManagementId"
                     placeholder="项目简称">
            <el-option v-for="item in options1"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-input placeholder="品牌名称"
                    v-model="seachParam.tenantName"></el-input>
          <el-cascader :options="options"
                       v-model="seachParam.goodsType"
                       style="margin-right: 15px; width: 200px"
                       placeholder="商品类型"
                       :props="{ checkStrictly: true }"
                       separator="-"
                       clearable></el-cascader>
          <el-input placeholder="商品名称"
                    v-model="seachParam.name"></el-input>
          <el-date-picker type="date"
                          class="screen"
                          value-format="yyyy-MM-ddTHH:mm:ss"
                          v-model="seachParam.startTime"
                          :clearable="false"
                          :picker-options="pickerBeginDayBefore"
                          placeholder="开始时间"
                          style="margin-right: 0" />
          <span style="color: #dadada; padding: 0 4px">—</span>
          <el-date-picker type="date"
                          class="screen"
                          value-format="yyyy-MM-ddT23:59:59"
                          v-model="seachParam.endTime"
                          :clearable="false"
                          :picker-options="pickerBeginDayAfter"
                          placeholder="结束时间">
          </el-date-picker>
          <span class="query-btn"
                @click="queryRules">查询</span>
        </div>
        <div style="">
          <el-button class="tban tban6"
                     @click="exportWeighingBill()"><i class="iconfont icon-cms_daochushuju-"></i> 导出</el-button>
        </div>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column label="项目简称"
                           prop="projectManagementName"
                           align="center" />
          <el-table-column label="品牌名称"
                           prop="tenantName"
                           align="center" />
          <el-table-column label="商品类型"
                           prop="goodsDepotType"
                           width="180"
                           align="center" />
          <el-table-column label="商品名称"
                           prop="name"
                           align="center" />
          <el-table-column label="计价类型"
                           prop="priceType"
                           align="center" />
          <el-table-column label="单价/元"
                           prop="unitPrice"
                           align="center" />
          <el-table-column label="数量"
                           align="center">
            <template slot-scope="scope">
              {{ scope.row.number }}{{ scope.row.unit }}
            </template>
          </el-table-column>
          <el-table-column label="总价/元"
                           prop="amount"
                           align="center" />
          <el-table-column label="称重时间"
                           prop="weighingDate"
                           :formatter="weighingDateFormat"
                           align="center"></el-table-column>
        </el-table>
      </div>
      <div class="ctc-foot1"
           v-if="total > 0">
        <span><span style="margin-right: 10px">{{ currentPage }}/{{ totalPages }}页</span>
          共{{ total }}条记录</span>
        <el-pagination background
                       layout="prev, pager, next"
                       :page-size="pgSize"
                       :total="total"
                       :current-page="currentPage"
                       @current-change="current_change">
        </el-pagination>
        <div class="pagingnum">
          显示
          <select v-model="pgSize"
                  @change="currentSel">
            <option v-for="item in pgNumoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"></option>
          </select>
          条目
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import context from '@/service'
import { goodTypeName } from '@/utils/validate'
export default {
  name: 'weighingBill',
  components: {
  },
  data () {
    return {
      seachParam: {
        projectManagementId: '',
        tenantName: '',
        name: '',
        startTime: '',
        endTime: '',
        goodsType: []
      },
      options: [],
      addBrandDialogVisible: false,
      options1: [],
      tableData: [],
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
    this.getOptions()
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
      let result = await context.http.get('gos/api/weigh-records', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'weighingDate,desc',
        projectManagementId: this.seachParam.projectManagementId,
        tenantName: this.seachParam.tenantName,
        name: this.seachParam.name,
        weighingStartTime: this.seachParam.startTime,
        weighingEndTime: this.seachParam.endTime,
        goodsType: this.seachParam.goodsType.toString()
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      this.totalPages = Math.ceil(this.total / this.pgSize)
    },
    async getOptions () { // 商品三级类
      let result = await context.http.get(`gos/api/goodsClassifications/tree?flag=${true}`)
      this.options = result.data
    },
    weighingDateFormat (row, colmn) {
      return row.weighingDate.replace('T', ' ')
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
    },
    exportWeighingBill () {
      axios({
        method: 'GET',
        url: '/gos/api/weigh-records/report?sort=weighingDate,desc',
        params: {
          projectManagementId: this.seachParam.projectManagementId,
          tenantName: this.seachParam.tenantName,
          name: this.seachParam.name,
          weighingStartTime: this.seachParam.startTime,
          weighingEndTime: this.seachParam.endTime,
          goodsType: this.seachParam.goodsType.toString()
        },
        responseType: 'blob'
      }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
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
.weighingBill {
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
