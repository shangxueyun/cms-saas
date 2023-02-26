
<template>
  <div class="orderBill">
    <span class="page_head_title">溯源管理</span>
    <div class="pl-content">
      <ul class="default_tab_block">
        <li v-if="hasAuthority('02050405')" class="active">
          <span>入库信息上报</span>
        </li>
        <li v-if="hasAuthority('02050406')" @click="switchover('sellData')">
          <span>销售数据上报</span>
        </li>
        <li
          v-if="hasAuthority('02050407')"
          @click="switchover('traceabilitySet')"
        >
          <span>溯源配置</span>
        </li>
        <li
          v-if="hasAuthority('02050404')"
          @click="switchover('SupplierManagement')"
        >
          <span>供应商管理</span>
        </li>
      </ul>
      <div class="search-bar">
        <div>
          <el-select
            v-model="seachParam.projectManagementId"
            filterable
            @change="changeprojectManagementId"
            placeholder="项目简称"
          >
            <el-option
              v-for="item in tenantOption"
              :key="item.id"
              :label="item.referred"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="seachParam.tenantId"
            size="small"
            @focus="projectChange(seachParam.projectManagementId)"
            @change="$forceUpdate()"
            filterable
            clearable
            placeholder="输入品牌名称搜索"
          >
            <el-option
              v-for="item in tenantList"
              :key="item.id"
              :label="item.referred"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-input
            v-model="seachParam.shopName"
            filterable
            placeholder="商品名称"
          ></el-input>
          <el-date-picker
            type="date"
            class="screen"
            value-format="yyyy-MM-dd"
            v-model="defaultDayBefore"
            clearable
            :picker-options="pickerBeginDayBefore"
            :editable="false"
            placeholder="开始日期"
            style="margin-right: 0"
          >
          </el-date-picker>
          <span style="color: #dadada; padding: 0 4px">—</span>
          <el-date-picker
            type="date"
            class="screen"
            :editable="false"
            clearable
            value-format="yyyy-MM-dd"
            v-model="defaultDayAfter"
            :picker-options="pickerBeginDayAfter"
            placeholder="结束日期"
          >
          </el-date-picker>
          <el-select
            v-model="seachParam.tracedStatus"
            placeholder="上传状态"
            clearable
          >
            <el-option label="未上传" value="NOT_UPLOAD"></el-option>
            <el-option label="成功" value="SUCCESS"></el-option>
            <el-option label="失败" value="FAIL"></el-option>
          </el-select>
          <el-select v-model="recordType" placeholder="来源" clearable>
            <el-option label="自主" value="PURCHASE_ENTER"></el-option>
            <el-option label="刷卡" value="CARD_ENTER"></el-option>
          </el-select>
          <span class="query-btn" @click="queryRules">查询</span>
        </div>
        <div class="btnban" v-if="hasAuthority('02050405')">
          <el-button class="tban tban2" @click="cardReading">读卡</el-button>
          <el-dropdown>
            <el-button class="tban tban2" v-if="hasAuthority('02050405')"
              ><i class="iconfont icon-xiazai1"></i> 仪电数据下载</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="downloadTemplate">下载入库记录</el-dropdown-item>
                <el-dropdown-item @click.native="drawerShow = true">仪电数据备份</el-dropdown-item>
              </el-dropdown-menu>
          </el-dropdown>
          <el-button class="tban tban5" @click="uploadTemp"
            ><i class="iconfont icon-cms_daorushuju-"></i>
            上传至追溯平台</el-button
          >
        </div>
      </div>
      <div class="plc-table">
        <el-table
          :data="tableData"
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="项目简称" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.recordType === 'PURCHASE_ENTER'">
                {{ scope.row.tenantGoods.projectManagementName }}
              </p>
              <p v-else-if="scope.row.recordType === 'CARD_ENTER'">
                {{ scope.row.cardRecord.projectManagementName }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            prop="tenantGoods.tenantName"
            label="品牌名称"
            align="center"
          >
            <template slot-scope="scope">
              <p v-if="scope.row.recordType === 'PURCHASE_ENTER'">
                {{ scope.row.tenantGoods.tenantName }}
              </p>
              <p v-else-if="scope.row.recordType === 'CARD_ENTER'">
                {{ scope.row.cardRecord.tenantName }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="商品名称" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.recordType === 'PURCHASE_ENTER'">
                {{ scope.row.tenantGoods.name }}
              </p>
              <p v-else-if="scope.row.recordType === 'CARD_ENTER'">
                {{ scope.row.cardRecord.saasName }}
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="number" label="采购数量" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.recordType === 'PURCHASE_ENTER'">
                {{ scope.row.number
                }}{{
                  scope.row.tenantGoods ? scope.row.tenantGoods.unitName : null
                }}
              </p>
              <p v-else-if="scope.row.recordType === 'CARD_ENTER'">
                {{ scope.row.cardRecord.dealWeight }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            label="入库时间"
            prop="recordDate"
            :formatter="recordDateFormat"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="supplierName"
            label="供应商"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="userName"
            label="操作人"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="tracedStatus"
            label="上传状态"
            :formatter="tracedStatusFormat"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="tracedStatus"
            label="来源"
            :formatter="tracedFormat"
            align="center"
          ></el-table-column>
          <el-table-column
            v-if="hasAuthority('02050405')"
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                @click="handleEdit(scope.$index, scope.row)"
                class="el-button--primary operation-btn"
                size="mini"
                >查看</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="ctc-foot1" v-if="total > 0">
        <span
          ><span style="margin-right: 10px"
            >{{ currentPage }}/{{ totalPages }}页</span
          >
          共{{ total }}条记录</span
        >
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pgSize"
          :total="total"
          :current-page="currentPage"
          @current-change="current_change"
        >
        </el-pagination>
        <div class="pagingnum">
          显示
          <select v-model="pgSize" @change="currentSel">
            <option
              v-for="item in pgNumoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></option>
          </select>
          条目
        </div>
      </div>
    </div>
    <!-- 客户订单流水详情 -->
    <wareHousingDetails
      :detailsWareHouseshow="detailsShow"
      ref="wareHousingDetails"
      :uploadStatus="uploadStatus"
      :wareHouseItem="detaileItem"
      :projectManagementDate="projectManagementDate"
      @wareHouseClose="wareHouseClose"
    />
      <!-- @changeuploadStatus="changeuploadStatus" -->
      <!-- @queryInfo="query" -->
    <!-- 备份数据记录 -->
    <backupData
      :drawerShow="drawerShow"
      @drawerClose="drawerClose"
    />
  </div>
</template>
<script>
import context from '@/service'
import wareHousingDetails from './components/wareHousingDetails'
import backupData from './components/backupData'
import moment from 'moment-timezone'
import axios from 'axios'
export default {
  name: 'orderBill',
  components: {
    wareHousingDetails,
    backupData
  },
  watch: {
    recordType: {
      handler: function (val, oldVal) {
        if (val === 'PURCHASE_ENTER') {
          this.seachParam.recordType = 'PURCHASE_ENTER'
        } else if (val === 'CARD_ENTER') {
          this.seachParam.recordType = 'CARD_ENTER'
        } else {
          this.seachParam.recordType = 'PURCHASE_ENTER,CARD_ENTER'
        }
      }
    }
  },
  data () {
    return {
      seachParam: {
        projectManagementId: '',
        tenantId: '',
        startTime: null,
        endTime: '',
        shopName: '',
        tracedStatus: '',
        recordType: 'PURCHASE_ENTER,CARD_ENTER'
      },
      recordType: '',
      detailsShow: false,
      detaileData: {
        orderTime: ''
      },
      tenantOption: [],
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
      },
      shopList: [],
      tenantList: [],
      projectManagementDate: {
        tenantGoods: {
          projectManagementName: '',
          tenantName: '',
          name: '',
          costPrice: ''
        },
        tenantId: null
      },
      shopNameloading: false,
      goodsOptions: [],
      detaileItem: [],
      defaultDayBefore: null,
      defaultDayAfter: null,
      selection: [],
      uploadStatus: true,
      drawerShow: false
    }
  },
  created () {
    this.init()
    this.defaultDayBefore = moment().format('YYYY-MM-DD')
    this.defaultDayAfter = moment().format('YYYY-MM-DD')
    this.tenantOption = this.$store.state.projectManagementsList
    this.seachParam.projectManagementId = this.$route.params.projectManagementId ? this.$route.params.projectManagementId : this.tenantOption[0].id
    this.query()
  },
  mounted () {

  },
  methods: {
    changeprojectManagementId () {
      this.seachParam.tenantId = ''
      this.tenantList = []
    },
    async query () {
      let temp1 = ''
      let temp2 = ''
      if (this.defaultDayBefore) {
        temp1 = this.defaultDayBefore + 'T00:00:00'
      }
      if (this.defaultDayAfter) {
        temp2 = this.defaultDayAfter + 'T23:59:59'
      }
      let result = await context.http.get('/gos/api/stockRecords/traced', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        startDate: temp1,
        endDate: temp2,
        shopName: this.seachParam.shopName,
        projectManagementId: this.seachParam.projectManagementId,
        tracedStatus: this.seachParam.tracedStatus,
        recordType: this.seachParam.recordType,
        tenantId: this.seachParam.tenantId,
        sort: 'recordDate,desc'
      })
      if (result.status === 200) {
        this.tableData = result.data
        this.total = Number(result.headers['x-total-count'])
        this.totalPages = Math.ceil(this.total / this.pgSize)
      }
    },
    switchover (name) {
      this.$router.push({ name: name, params: { projectManagementId: this.seachParam.projectManagementId } })
    },
    async handleEdit (index, row) {
      this.projectManagementDate = row
      if (row.tracedStatus === 'SUCCESS' || row.tracedStatus === 'NO') {
        this.uploadStatus = false
      }
      // goodsType 判空处理
      if (row.recordType !== 'CARD_ENTER' && row.tenantGoods && row.tenantGoods.goodsDepot && row.tenantGoods.goodsDepot.goodsType.id) {
        let result = await context.http.get('/gos/api/tracedStandards/type', { goodsType: row.tenantGoods.goodsDepot.goodsType.id, projectId: row.tenantGoods.projectManagementId })
        if (result.status === 200) {
          this.detaileItem = result.data
          this.getSetwareHouseData(row)
        }
      } else if (row.recordType !== 'CARD_ENTER' && row.cardRecord) {
        this.getSetwareHouseData(row)
      } else {
        this.detailsShow = true
      }
    },
    getSetwareHouseData (row) {
      context.http.get('/gos/api/purchaseGoods/query', { orderNumber: row.orderNumber, goodsNumber: row.goodsNumber }).then(res => {
        if (res.status === 200) {
          this.$store.commit('setwareHouseData', res.data)
          this.detailsShow = true
        }
      })
    },
    async projectChange (id) {
      this.seachParam.tenantId = ''
      if (!id) {
        this.tenantList = []
        return
      }
      let result = await context.http.get('/cms/api/tenant', {
        size: 9999,
        id: id,
        tenantContractStatus: 'IN_THE_CONTRACT',
        useStatus: 'USING'
      })
      this.tenantList = result.data.content
    },
    handleSelectionChange (selection) {
      this.selection = selection
    },
    downloadTemplate () {
      let temp1 = ''
      let temp2 = ''
      if (this.defaultDayBefore) {
        temp1 = this.defaultDayBefore + 'T00:00:00'
      }
      if (this.defaultDayAfter) {
        temp2 = this.defaultDayAfter + 'T23:59:59'
      }
      axios({
        method: 'GET',
        url: 'gos/api/stockRecords/report',
        params: {
          startDate: temp1,
          endDate: temp2,
          shopName: this.seachParam.shopName,
          projectManagementId: this.seachParam.projectManagementId,
          tracedStatus: this.seachParam.tracedStatus,
          recordType: this.seachParam.recordType,
          tenantId: this.seachParam.tenantId
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
    },
    tracedStatusFormat (row, colmn) {
      switch (row.tracedStatus) {
        case 'SUCCESS':
          return '成功'
        case 'FAIL':
          return '失败'
        case 'NOT_UPLOAD':
          return '未上传'
        case 'NO':
          return '不需要溯源'
      }
    },
    tracedFormat (row, colmn) {
      switch (row.recordType) {
        case 'PURCHASE_ENTER':
          return '自主'
        case 'CARD_ENTER':
          return '刷卡'
      }
    },
    wareHouseClose () {
      this.detailsShow = false
      this.uploadStatus = true
      this.query()
    },
    drawerClose () {
      this.drawerShow = false
    },
    // changeuploadStatus () {
    //   this.uploadStatus = true
    //   this.query()
    // },
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
    async searchGoodsName (query, callback) {
      this.shopNameloading = true
      if (!query || query === '') {
        return false
      }
      context.http.get('/gos/api/stockRecords/traced', { shopName: query, recordType: 'PURCHASE_ENTER' }).then(res => {
        if (res.status === 200) {
          this.goodsOptions = res.data
          this.shopNameloading = false
        }
      }).catch(error => {
        console.info(error)
        this.shopNameloading = false
        this.$message.error('系统正在处理，请耐心等待')
      })
    },
    init () {
      this.seachParam = {
        recordType: 'PURCHASE_ENTER,CARD_ENTER'
      }
    },
    recordDateFormat (row, column) {
      return row.recordDate.replace('T', ' ')
    },
    async uploadTemp () {
      if (this.selection.length > 0) {
        let temp = []
        this.selection.map(v => {
          temp.push(v.id)
        })
        temp = temp.toString()
        const tip = this.$message({
          message: ' 数据上传中，请耐心等待',
          type: 'warning',
          duration: 10000
        })
        context.http.get(`/gos/api/stockRecords/uploadTraced?id=${temp}`).then(res => {
          tip.close()
          if (res.status === 200) {
            this.$message({
              message: res.data,
              type: 'warning'
            })
            this.query()
          }
        }).catch(error => {
          tip.close()
          console.info(error)
        })
      } else {
        this.$message({
          message: '请选择需要上报的入库数据',
          type: 'error'
        })
      }
    },
    changewareHouseData (val) {
      this.detaileData.productionCode = val.split(',')
    },
    cardReading (event) {
      const code = localStorage.getItem('tenantKey')
      const admin = sessionStorage.getItem('login.username')
      const psd = sessionStorage.getItem('login.password')
      const url = window.location.origin + '/crt/ReadCard.msi'
      window.protocolCheck(`YWshell://${code}/${admin}/${psd}`,
        function () {
          const a = document.createElement('a')
          a.setAttribute('download', '')
          a.setAttribute('href', url)
          a.click()
        })
      event.preventDefault ? event.preventDefault() : event.returnValue = false
    }
  }
}
</script>
<style lang="scss" scoped>
.orderBill {
  .search-bar {
    > div {
      > div {
        width: 140px;
      }
    }
    .btnban {
      // button {
      //   width: 130px;
      // }
      text-align: center;
      // margin-left: 20px;
      display: flex;
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
