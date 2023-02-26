<template>
  <div id="shopList" >
    <span style="font-size: 16px">店铺信息</span>
    <div class="search-header" style="margin-top:15px">
      <span>
        <el-select v-model="mallId" placeholder="所属商圈">
          <el-option v-for="item in item1" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </span>
      <span>
        <el-select v-model="businessTypeId" placeholder="营业范围">
          <el-option v-for="item in item2" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </span>
      <span>
        <el-select v-model="shopStatus" placeholder="店铺状态">
          <el-option v-for="item in item3" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </span>
      <span>
        <el-input v-model="shopName" placeholder="店铺名称"></el-input>
      </span>
      <span v-if="hasAuthority('06010101')">
        <el-button type="primary" @click="searchFn">搜索</el-button>
      </span>
    </div>
    <div class="content">
      <el-col :span="18">
        <el-table :data="tableData" max-height="600" border style="width: 100%" >
          <el-table-column type="index" label="序号" :index="indexMethod" width="50" align="center"></el-table-column>
          <el-table-column prop="shopName" label="店铺名称" align="center"></el-table-column>
          <el-table-column prop="serviceHotline" label="所属商户" align="center"></el-table-column>
          <el-table-column prop="mallName" label="所属商圈" align="center"></el-table-column>
          <el-table-column prop="bussinessType" label="营业范围-类型" align="center"></el-table-column>
          <el-table-column prop="onlineOrder" label="在线下单" :formatter="isOnlineOrder" align="center"></el-table-column>
          <el-table-column prop="shopStatus" label="店铺状态" align="center" :formatter="shopStatus1"></el-table-column>
          <el-table-column prop="merchantsLabel" label="推荐" align="center"></el-table-column>
          <!--<el-table-column label="操作" align="center" width="200">-->
            <!--<template slot-scope="scope">-->
              <!--<el-button type="primary" size="mini"  @click="shopEdit(scope.$index, scope.row)">店铺编辑</el-button>-->
              <!--<el-button type="primary" size="mini"  @click="commodityManage(scope.$index, scope.row)" plain>管理商品</el-button>-->
            <!--</template>-->
          <!--</el-table-column>-->
        </el-table>
      </el-col>
      <el-col :span="6">
        <div class="countStatus">
          <p class="title">店铺状态统计</p>
          <div class="tableHeader"><span>店铺状态</span><span>数量</span></div>
          <div><span>营业中</span><span>{{getShopStatusObj.open}}家</span></div>
          <div><span>打烊中</span><span>{{getShopStatusObj.closed}}家</span></div>
          <div><span>手动打烊</span><span>{{getShopStatusObj.manualClosed}}家</span></div>
          <div><span>审核中</span><span>{{getShopStatusObj.entering}}家</span></div>
          <div><span>审核未通过</span><span>{{getShopStatusObj.disapproval}}家</span></div>
          <div><span>店铺下线</span><span>{{getShopStatusObj.downline}}家</span></div>
        </div>
      </el-col>

    </div>
    <div class="ctc-foot">
      <el-col :span="18">
        <span class="flex">
          <div class="pagingnum">显示
            <select v-model="pgSize" @change="pgSizeSelectFn">
              <option v-for="item in pgNumoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </option>
            </select>
            条目
            <span style="padding-left: 30px">显示从{{pgSize*(currentPage - 1) + 1}}到{{pgSize*currentPage}}项结果，共<span class="style: red">{{total}}</span>条</span>
          </div>
            <el-pagination v-if="total > 0"
                           background
                           layout="prev, pager, next"
                           :page-size=pgSize
                           :total="total"
                           :current-page="currentPage"
                           @current-change="current_change">
            </el-pagination>
        </span>
      </el-col>
    </div>
  </div>
</template>
<script>
  import context from '@/service'
  export default {
    name: 'shopList',
    components: {

    },
    data () {
      return {
        mallId: '', // 所属商圈
        businessTypeId: '', // 营业范围
        shopStatus: '', // 店铺状态
        shopName: '', // 店铺名称
        item1: [{label: '全部', value: ''}],
        item2: [{label: '全部', value: ''}],
        item3: [
          {label: '全部', value: ''},
          {label: '营业中', value: 'OPEN'},
          {label: '打烊中', value: 'CLOSED'},
          {label: '手动打烊', value: 'MANUAL_CLOSED'},
          {label: '审核中', value: 'ENTERING'},
          {label: '审核通过', value: 'TOAPPROVAL'},
          {label: '审核未通过', value: 'DISAPPROVAL'},
          {label: '店铺下线', value: 'DOWNLINE'}

        ],
        tableData: [],
        currentPage: 1,
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
        getShopStatusObj: {}
      }
    },
    created () {
      this.getDataList()
      this.getShopStatus()
      this.getmallData()// 获取商圈
      this.getBussinessType()// 获取经营范围
    },
    mounted () {
    },
    methods: {
      hasAuthority (code) {
        return context.user.hasAuthority(code)
      },
      async getmallData () { // 获取商圈
        let result = await context.http.get('rts/api/business-districts', {})
        let data = result.data
        for (var i = 0; i < data.length; i++) {
          this.item1.push({label: data[i].name, value: data[i].id})
        }
      },
      async getBussinessType () { // 获取经营范围
        let result = await context.http.get('rts/api/business-type', {})
        let data = result.data
        for (var i = 0; i < data.length; i++) {
          this.item2.push({label: data[i].name, value: data[i].id})
        }
      },
      async getDataList () {
        let result = await context.http.get('rts/api/shops',
          {
            onOld: true,
            mallId: this.mallId,
            businessTypeId: this.businessTypeId,
            shopStatus: this.shopStatus,
            shopName: this.shopName,
            page: (this.currentPage - 1),
            size: this.pgSize
          })
        this.tableData = result.data
        this.total = Number(result.headers['x-total-count'])
      },
      async getShopStatus () {
        let result = await context.http.get('rts/api/shops/statistics', {})
        this.getShopStatusObj = result.data
        console.log(result)
      },
      isOnlineOrder (row, column) {
        return row.onlineOrder ? '是' : '否'
      },
      shopStatus1 (row, column) {
        switch (row.shopStatus) {
          case 'CLOSED':
            return '打烊中'
          case 'OPEN' :
            return '营业中'
          case 'MANUAL_CLOSED' :
            return '手动打烊中'
          case 'TOAPPROVAL' :
            return '审核通过'
          case 'DISAPPROVAL' :
            return '审核未通过'
          case 'DOWNLINE':
            return '店铺下线'
          case 'ENTERING' :
            return '审核中'
        }
      },
      searchFn () {
        this.currentPage = 1
        this.getDataList()
      },
      indexMethod (index) {
        return this.pgSize * (this.currentPage - 1) + index + 1
      },
      shopEdit (index, row) { // 店铺编辑
        console.log(index, row)
      },
      commodityManage (index, row) { // 管理商品
        console.log(index, row)
      },
      current_change (currentPage) {
        this.currentPage = currentPage
        this.getDataList()
      },
      pgSizeSelectFn () {
        this.currentPage = 1
        this.getDataList()
      }
    }
  }

</script>
<style lang="scss" scoped>
  .search-header{
    height: 80px;
    line-height: 80px;
    border: 1px solid #CCCCCC;
    display: flex;
    align-items:center;
    padding-left: 20px;
    margin-bottom: 30px;
    background: #FFFFFF;
    span{
      margin-right: 35px;
    }
  }
  .content{
    background: #FFFFFF;
    overflow: hidden;
  }
  .countStatus{
    margin-left: 20px;
    border: 1px solid #CCCCCC;
    padding: 20px;
    .title{
      font-size: 20px;
      font-weight: bold;
      border-bottom: 1px solid #CCCCCC;
      padding-bottom: 10px;
    }
    div{
      height: 50px;
      line-height: 50px;
      border: 1px solid #ccc;
      border-bottom: none;
      display: flex;
      span{
        width: 50%;
        text-align: center;
      }
      span:first-child{
        border-right: 1px solid #CCCCCC;
      }
    }
    div:last-child{
      border-bottom: 1px solid #ccc;
    }
    .tableHeader{
      font-size: 16px;
      font-weight: bold;
      margin-top: 20px;
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
    .el-col-18{
      padding: 0 30px;
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
  .flex{
    display: flex;
    justify-content: space-between;
  }
</style>
