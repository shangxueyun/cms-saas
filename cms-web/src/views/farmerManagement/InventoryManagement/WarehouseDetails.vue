
<template>
  <div class="tenantGoods">
    <span class="page_head_title">库存管理</span>
    <div class="pl-content">
      <ul class="default_tab_block">
        <li v-if="hasAuthority('02050301')"
            @click="changeTab">
          <span>库存查询</span>
        </li>
        <li class="active"
            v-if="hasAuthority('02050302')">
          <span>出入库明细</span>
        </li>
      </ul>
      <div class="search-bar">
        <div>
          <el-select v-model="seachParam.projectManagementId"
                     @change="changeprojectManagementId"
                     style="width:150px"
                     clearable
                     placeholder="项目简称">
            <el-option v-for="item in options1"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="seachParam.tenantId"
                     style="width:150px"
                     @focus="projectChange(seachParam.projectManagementId)"
                     filterable
                     size="small"
                     placeholder="输入品牌名称搜索">
            <el-option v-for="item in tenantOption"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
          <!-- <el-input placeholder="品牌名称"
                    v-model="seachParam.tenantName"
                    style="width:150px"></el-input> -->
          <el-input placeholder="单据号"
                    v-model="seachParam.orderNumber"
                    style="width:150px"></el-input>
          <el-input placeholder="商品名称"
                    v-model="seachParam.shopName"
                    style="width:150px"></el-input>
          <el-select v-model="seachParam.recordType"
                     clearable
                     style="width:150px"
                     placeholder="全部单据类型">
            <el-option v-for="item in statusList"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <el-date-picker style="width:150px"
                          value-format="yyyy-MM-ddT00:00:00"
                          v-model="seachParam.startDate"
                          type="date"
                          placeholder="出入库日期">
          </el-date-picker>
          -
          <el-date-picker style="width:150px;margin-left: 10px;"
                          value-format="yyyy-MM-ddT23:59:59"
                          v-model="seachParam.endDate"
                          type="date"
                          placeholder="出入库日期">
          </el-date-picker>
          <span class="query-btn"
                @click="queryRules">查询</span>
        </div>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  style="width: 100%"
                  ref="tenantGoods">
          <el-table-column prop="tenantGoods.projectManagementName"
                           label="项目简称"
                           align="center"></el-table-column>
          <el-table-column prop="tenantGoods.tenantName"
                           label="品牌名称"
                           align="center"></el-table-column>
          <el-table-column prop="orderNumber"
                           width="180px"
                           label="单据号"
                           align="center"></el-table-column>
          <el-table-column prop="recordType"
                           :formatter="formatRecordType"
                           label="单据类型"
                           align="center"></el-table-column>
          <el-table-column prop="tenantGoods.name"
                           label="商品名称"
                           align="center"></el-table-column>
          <el-table-column prop="tenantGoods.unitName"
                           label="商品单位"
                           align="center"></el-table-column>
          <el-table-column prop="number"
                           label="变动数量"
                           align="center"></el-table-column>
          <el-table-column label="出入库价"
                           prop="unitPrice"
                           :formatter="unitPriceFormatter"
                           align="center"></el-table-column>
          <el-table-column label="单价"
                           prop="tenantGoods.unitPrice"
                           :formatter="unitPriceFormatter1"
                           align="center"></el-table-column>
          <el-table-column label="出入库时间"
                           width="180px"
                           :formatter="recordDateFormatter"
                           align="center"></el-table-column>
          <el-table-column prop="userName"
                           label="操作人"
                           align="center"></el-table-column>
          <el-table-column label="操作"
                           v-if="hasAuthority('02050303')"
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
    <!-- 销售出库 退货入库详情 -->
    <whDetails :detailsdrawershow="detailsShow"
               ref="whDetails"
               :draweDetaileData="detaileData"
               @drawerClose="drawerClose" />
    <!-- 采购、盘点单详情 -->
    <StockListDetails :detailsdrawershow="detailsShow2"
                      :recordTypeDetail="recordTypeDetail"
                      ref="StockListDetails"
                      :draweDetaileData="detaileData"
                      @drawerClose="drawerClose" />
  </div>
</template>
<script>

import img from '@/assets/noBrand.png'
import context from '@/service'
import whDetails from './components/whDetails'
import StockListDetails from './components/StockListDetails'
export default {
  name: 'WarehouseDetails',
  components: {
    whDetails,
    StockListDetails
  },
  data () {
    return {
      tenantOption: [],
      goodsType: [], // 新增级联商品种类
      options: [],
      statusList: [
        { label: '采购入库', value: 'PURCHASE_ENTER', checked: false },
        { label: '采购退货出库', value: 'PURCHASE_OUT', checked: false },
        { label: '销售退货入库', value: 'ORDER_ENTER', checked: false },
        { label: '销售出库', value: 'ORDER_OUT', checked: false },
        { label: '盘盈入库', value: 'STOCK_ENTER', checked: false },
        { label: '盘亏出库', value: 'STOCK_OUT', checked: false }
      ],
      seachParam: {
        projectManagementId: '',
        tenantId: '',
        orderNumber: '',
        recordType: '',
        shopName: '',
        startDate: '',
        endDate: ''
      },
      detailsShow: false,
      detailsShow2: false,
      recordTypeDetail: '',
      detaileData: {
        orderTime: '',
        recordDate: '',
        purchaseGoodsDTOS: [],
        checkStockGoods: [
          { tenantGoods: {} }
        ]
      },
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
      ]
    }
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
    this.query()
  },
  mounted () {

  },
  methods: {
    changeprojectManagementId () {
      this.seachParam.tenantId = ''
      this.tenantOption = []
    },
    unitPriceFormatter (row, column) {
      if (row.recordType === 'PURCHASE_ENTER' || row.recordType === 'PURCHASE_OUT') {
        return row.unitPrice
      } else {
        return '-'
      }
    },
    unitPriceFormatter1 (row, column) {
      if (row.recordType === 'ORDER_ENTER' || row.recordType === 'ORDER_OUT') {
        return row.tenantGoods.unitPrice
      } else {
        return '-'
      }
    },
    async projectChange (id) {
      this.seachParam.tenantId = ''
      if (!id) {
        this.tenantOption = []
        return
      }
      let result = await context.http.get('/cms/api/tenant', {
        // page: (this.pager.currentPage - 1),
        size: 9999,
        // sort: 'id,desc',
        id: id,
        tenantContractStatus: 'IN_THE_CONTRACT',
        useStatus: 'USING'
      })
      this.tenantOption = result.data.content
    },
    recordDateFormatter (row, column) {
      if (row.recordDate) {
        return row.recordDate.replace('T', ' ')
      }
    },
    formatRecordType (row, column) {
      switch (row.recordType) {
        case 'PURCHASE_ENTER':
          return '采购入库'
        case 'PURCHASE_OUT':
          return '采购退货出库'
        case 'ORDER_ENTER':
          return '销售退货入库'
        case 'ORDER_OUT':
          return '销售出库'
        case 'STOCK_ENTER':
          return '盘盈入库'
        case 'STOCK_OUT':
          return '盘亏出库'
      }
    },
    async query () {
      let result = await context.http.get('gos/api/stockRecords', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        // sort: 'lastModifiedDate,desc',
        projectManagementId: this.seachParam.projectManagementId,
        tenantId: this.seachParam.tenantId,
        orderNumber: this.seachParam.orderNumber,
        recordType: this.seachParam.recordType,
        shopName: this.seachParam.shopName,
        startDate: this.seachParam.startDate,
        endDate: this.seachParam.endDate,
        sort: 'lastModifiedDate,desc'
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      this.totalPages = Math.ceil(this.total / this.pgSize)
    },
    async getOptions () { // 商品种类
      let result = await context.http.get('gos/api/goods-depots/goodsType')
      this.options = result.data
    },
    formatTime (row, column) {
      if (row.updateTime) {
        return row.updateTime.replace('T', '  ')
      } else {
        return '-'
      }
    },
    drawerClose () {
      this.detailsShow = false
      this.detailsShow2 = false
    },
    handleEdit (index, row) {
      // 采购入库 PURCHASE_ENTER   采购退货出库 PURCHASE_OUT 销售退货入库 ORDER_ENTER  销售出库 ORDER_OUT 盘盈入库  STOCK_ENTER  盘亏出库 STOCK_OUT
      if (row.recordType === 'ORDER_ENTER' || row.recordType === 'ORDER_OUT') { // 销售出库 销售退货入库
        context.http.get(`gos/api/tenant-orders/${row.businessId}`).then(res => {
          if (res) {
            this.detaileData = res.data
            this.detailsShow = true
          }
        })
      } else if (row.recordType === 'PURCHASE_ENTER' || row.recordType === 'PURCHASE_OUT') { // 采购入库 //采购退货出库
        this.recordTypeDetail = row.recordType
        context.http.get(`gos/api/purchaseOrder/${row.businessId}`).then(res => {
          if (res) {
            this.detaileData = res.data
            this.detailsShow2 = true
          }
        })
      } else if (row.recordType === 'STOCK_ENTER' || row.recordType === 'STOCK_OUT') { // 盘盈入库 盘亏出库
        this.recordTypeDetail = row.recordType
        context.http.get(`gos/api/checkStocks/${row.businessId}`).then(res => {
          if (res) {
            this.detaileData = res.data
            this.detailsShow2 = true
          }
        })
      }
    },
    changeTab () {
      this.$router.push({
        name: 'InventoryQuery',
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
<style lang="scss">
.tenantGoods {
  .warning-row {
    color: #606266;
    .el-input__inner {
      border: 1px solid #ff0707;
    }
  }
  .addTenantGoodsDialog {
    .gooodsList {
      .btn {
        border: 1px solid #dcdfe6;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        display: inline-block;
        margin-bottom: 15px;
        > span {
          color: #777777;
          font-size: 14px;
          padding-left: 10px;
          &.addBtn {
            display: inline-block;
            width: 90px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            padding-left: 0;
            cursor: pointer;
            color: #fff;
            background-color: #3575f6;
            border-bottom-right-radius: 4px;
            border-top-right-radius: 4px;
          }
        }
        .el-input__inner {
          border: none;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.tenantGoods {
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
      border: 1px solid #f3af2c;
      border-radius: 3px;
      color: #f3af2c;
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
  .addTenantGoodsDialog {
    .slotfooter {
      .save {
        margin-right: 12px;
        height: 32px;
        line-height: 32px;
        color: #3577f6;
        border: 1px solid #3577f6;
        background: rgba(53, 119, 246, 0.05);
      }
    }
    .el-form {
      .content {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 100%;
        .baseInfo {
          padding: 15px;
          .el-form-item {
            width: 45%;
            .el-form-item__content {
              > span {
                margin-bottom: 5px;
                display: inline-block;
                height: 25px;
                display: -ms-flexbox;
                display: flex;
                -ms-flex-align: center;
                align-items: center;
                font-size: 14px;
                color: #777777;
              }
              > p {
                color: #666666;
                font-size: 12px;
                height: 40px;
                line-height: 40px;
              }
              .tips {
                font-size: 12px;
                color: #999999;
                margin-top: 10px;
              }
            }
          }
        }
        .gooodsList {
          padding: 15px;
          width: 100%;
          .goodsTable {
          }
          .deleteGoods {
            color: #d01522;
            cursor: pointer;
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
}
</style>
