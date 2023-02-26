<template>
  <div id="shopList" >
    <span style="font-size: 16px">订单信息</span>
    <div class="search-header" style="margin-top:15px">
      <span>
        <el-select v-model="mallId" >
          <el-option v-for="item in item1" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </span>
      <span>
        <el-select v-model="orderStatus" placeholder="订单状态" >
          <el-option v-for="item in item2" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </span>
      <span>
        <el-input v-model="search" placeholder="订单号/买家姓名/手机号"></el-input>
      </span>
      <span>
         <el-date-picker
           v-model="timeInterval"
           type="daterange"
           range-separator="-"
           start-placeholder="开始日期"
           end-placeholder="结束日期"
           value-format="yyyy-MM-ddT16:00:00.000Z"
           @change="dataPickFn"
         >
    </el-date-picker>
      </span>
      <span v-if="hasAuthority('06030101')">
        <el-button type="primary" @click="searchFn">搜索</el-button>
      </span>
    </div>
    <div class="content">
      <el-col :span="24">
        <el-table :data="tableData" height="600" border style="width: 100%" >
          <!--<el-table-column type="index" label="序号" :index="indexMethod" width="50" align="center"></el-table-column>-->
          <el-table-column prop="orderNumber" label="订单号" align="center"></el-table-column>
          <el-table-column prop="mallName" label="商圈" align="center"></el-table-column>
          <el-table-column prop="orderType" label="订单类型" align="center" width="100" :formatter="orderTypeFn"></el-table-column>
          <el-table-column prop="orderStatus" label="订单状态" align="center" width="120" :formatter="orderStatusFn"></el-table-column>
          <el-table-column label="下单时间" align="center" :formatter="formatCreateOrderTime"></el-table-column>
          <el-table-column label="配送时间" align="center" :formatter="formatPlanDeliveryTime"></el-table-column>
          <el-table-column label="订单完成时间" align="center" :formatter="formatCompletionTime"></el-table-column>
          <el-table-column prop="buyerInfo" label="买家信息" align="center" :formatter="buyerInfoFn"></el-table-column>
          <!-- <el-table-column label="操作" align="center" width="80" v-if="hasAuthority('06030102')">
            <template slot-scope="scope">
              <el-button type="primary" size="mini"  @click="shopEdit(scope.$index, scope.row)">查看</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </el-col>
    </div>
    <div class="ctc-foot">
      <div class="pagingnum">
        显示 <select v-model="pgSize" @change="pgSizeSelectFn">
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
</template>
<script>
  import context from '@/service'
  export default {
    name: 'shopList',
    components: {

    },
    data () {
      return {
        mallId: '', // 商圈名称
        orderStatus: '', // 订单状态
        search: '', // 订单号/买家姓名/手机号
        timeFrom: '', // 开始时间
        timeTo: '', // 结束时间
        timeInterval: '',
        item1: [{label: '全部', value: ''}],
        item2: [
          {label: '全部', value: ''},
          {label: '待支付', value: 'WAITPAY'},
          {label: '待接单', value: 'WAITORDER'},
          {label: '预备货', value: 'BEFOREPREPAREGOODS'},
          {label: '备货中', value: 'PREPAREGOODS'},
          {label: '配送中', value: 'DISTRIBUTION'},
          {label: '订单完成', value: 'ORDERCOMPLETE'},
          {label: '订单关闭', value: 'ORDERCLOSED'},
          {label: '已接单', value: 'ACCEPTORDER'},
          {label: '未接单', value: 'NOTACCEPTORDER'},
          {label: '到店', value: 'ARRIVED'},
          {label: '出餐', value: 'PREPARECOMPLETE'},
          {label: '骑手已接单', value: 'RIDERACCEPTORDER'}
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
        ]

      }
    },
    created () {
      this.getDataList()
      this.getmallData()
    },
    mounted () {
    },
    methods: {
      hasAuthority (code) {
        return context.user.hasAuthority(code)
      },
      formatCreateOrderTime (row, column) {
        if (row.createOrderTime) {
          return row.createOrderTime.replace('T', '  ')
        } else {
          return ''
        }
      },
      formatCompletionTime (row, column) {
        if (row.completionTime) {
          return row.completionTime.replace('T', '  ')
        } else {
          return ''
        }
      },
      formatPlanDeliveryTime (row, column) {
        if (row.planDeliveryTime) {
          return row.planDeliveryTime.replace('T', '  ')
        } else {
          return ''
        }
      },
      async getmallData () { // 获取商圈
        let result = await context.http.get('rts/api/business-districts', {})
        let data = result.data
        for (var i = 0; i < data.length; i++) {
          this.item1.push({label: data[i].name, value: data[i].id})
        }
      },
      async getDataList () {
        let result = await context.http.get('rts/api/orders', {
          onOld: true,
          page: (this.currentPage - 1),
          size: this.pgSize,
          mallId: this.mallId,
          search: this.search,
          timeFrom: this.timeFrom, // 开始时间
          timeTo: this.timeTo, // 结束时间
          orderStatus: this.orderStatus
        })
        this.tableData = result.data
        this.total = Number(result.headers['x-total-count'])
      },
      orderTypeFn (row, column) {
        return row.orderType === 'ONLINE' ? '线上订单' : '线下订单'
      },
      orderStatusFn (row, column) {
        switch (row.orderStatus) {
          case 'WAITPAY':
            return '待支付'
          case 'WAITORDER':
            return '待接单'
          case 'BEFOREPREPAREGOODS':
            return '预备货'
          case 'PREPAREGOODS':
            return '备货中'
          case 'DISTRIBUTION':
            return '配送中'
          case 'ORDERCOMPLETE':
            return '订单完成'
          case 'ORDERCLOSED':
            return '订单关闭'
          case 'ACCEPTORDER':
            return '已接单'
          case 'NOTACCEPTORDER':
            return '未接单'
          case 'ARRIVED':
            return '到店'
          case 'PREPARECOMPLETE':
            return '出餐'
          case 'RIDERACCEPTORDER':
            return '骑手已接单'
        }
      },
      buyerInfoFn (row, column) {
        return row.contactPerson + '(' + row.contactNumber + ')'
      },
      current_change (currentPage) { // 切换页码
        this.currentPage = currentPage
        this.getDataList()
      },
      pgSizeSelectFn () { // 切换显示条数
        this.currentPage = 1
        this.getDataList()
      },
      dataPickFn (n) {
        if (n) {
          this.timeFrom = n[0]
          this.timeTo = n[1]
        } else {
          this.timeFrom = ''
          this.timeTo = ''
        }
      },
      searchFn () {
        this.currentPage = 1
        this.getDataList()
      },
      shopEdit (index, row) { // 店铺编辑
        console.log(index, row)
      },
      commodityManage (index, row) { // 管理商品
        console.log(index, row)
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
</style>
