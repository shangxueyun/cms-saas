
<template>
  <div class="farmerGoods">
    <span class="page_head_title">库存管理</span>
    <div class="pl-content">
      <ul class="default_tab_block">
        <li class="active"
            v-if="hasAuthority('02050301')">
          <span>库存查询</span>
        </li>
        <li @click="changeTab"
            v-if="hasAuthority('02050302')">
          <span>出入库明细</span>
        </li>
      </ul>
      <div class="search-bar">
        <div>
          <el-select v-model="seachParam.projectManagementId"
                     @change="changeprojectManagementId"
                     clearable
                     placeholder="项目简称">
            <el-option v-for="item in options"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="seachParam.tenantId"
                     style="width:200px"
                     filterable
                     @focus="projectChange(seachParam.projectManagementId)"
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
                    style="width:200px"></el-input> -->
          <el-input placeholder="商品名称"
                    v-model="seachParam.name"
                    style="width:200px"></el-input>
          <span class="query-btn"
                @click="queryRules">查询</span>
        </div>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  style="width: 100%"
                  ref="multipleTable">
          <el-table-column label="项目简称"
                           prop="projectManagementName"
                           align="center" />
          <el-table-column label="品牌名称"
                           prop="tenantName"
                           align="center" />
          <el-table-column label="商品类型"
                           prop="goodTypeName"
                           align="center" />
          <el-table-column label="商品名称"
                           prop="name"
                           align="center" />
          <el-table-column label="单位"
                           prop="unitName"
                           align="center" />
          <el-table-column label="商品库存"
                           prop="stock"
                           align="center" />
          <el-table-column label="单价"
                           prop="unitPrice"
                           align="center" />
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
import { goodTypeName } from '@/utils/validate'
export default {
  name: 'InventoryQuery',
  components: {
  },
  data () {
    return {
      tenantOption: [],
      options: [],
      seachParam: {
        projectManagementId: '',
        tenantId: '',
        name: ''
      },
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
    this.options = this.$store.state.projectManagementsList
    this.query()
  },
  mounted () {

  },
  methods: {
    changeprojectManagementId () {
      this.seachParam.tenantId = ''
      this.tenantOption = []
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
    async query () {
      let result = await context.http.get('gos/api/tenant-goods/stockNew?sort=goodsDepotGoodsType,asc&sort=goodsDepotId,desc&sort=lastModifiedDate,desc', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        projectManagementId: this.seachParam.projectManagementId,
        tenantId: this.seachParam.tenantId,
        name: this.seachParam.name
      })
      result.data.forEach(arr => {
        arr.goodTypeName = goodTypeName(arr) // 回显商品类型
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      this.totalPages = Math.ceil(this.total / this.pgSize)
    },
    async getOptions () {
      let result = await context.http.get('gos/api/goods-depots/goodsType')
      this.options = result.data
    },
    useStatusFormat (row, column) {
      if (row.useStatus === 'USING') {
        return '使用中'
      } else {
        return '已停用'
      }
    },
    changeTab () {
      this.$router.push({
        name: 'WarehouseDetails',
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
.farmerGoods {
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
