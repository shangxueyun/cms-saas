<template>
  <div id="shopList" >
    <span style="font-size: 16px">商品信息</span>
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
        <el-select v-model="onSale" placeholder="状态">
          <el-option v-for="item in item3" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </span>
      <span>
        <el-input v-model="goodsName" placeholder="商品名称"></el-input>
      </span>
      <span  v-if="hasAuthority('06020101')">
        <el-button type="primary" @click="searchFn">搜索</el-button>
      </span>
    </div>
    <div class="content">
      <el-col :span="18">
        <el-table :data="tableData" height="600" border style="width: 100%" >
          <el-table-column type="index" label="序号" :index="indexMethod" width="50" align="center"></el-table-column>
          <el-table-column  label="商品图片" align="center">
            <template slot-scope="scope">
              <img :src="getImgUrl(scope.row)" alt="商品图片" style="width: 50px;height: 50px">
            </template>
          </el-table-column>
          <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="shopname" label="所属店铺" align="center"></el-table-column>
          <el-table-column prop="mallName" label="所属商圈" align="center"></el-table-column>
          <el-table-column prop="businessType" label="营业范围" align="center"></el-table-column>
          <el-table-column prop="onSale" label="状态" align="center" :formatter="onSaleFn"></el-table-column>
          <el-table-column prop="description" label="推荐" align="center"></el-table-column>
          <el-table-column prop="number" label="库存" align="center"></el-table-column>
          <el-table-column prop="saleNumber" label="销量" align="center"></el-table-column>
          <!--<el-table-column label="操作" align="center" width="200">-->
            <!--<template slot-scope="scope">-->
              <!--<el-button type="primary" size="mini"  @click="shopEdit(scope.$index, scope.row)">编辑</el-button>-->
              <!--<el-button type="primary" size="mini"  @click="commodityManage(scope.$index, scope.row)" plain>下架</el-button>-->
            <!--</template>-->
          <!--</el-table-column>-->
        </el-table>
      </el-col>
      <el-col :span="6">
        <div class="countStatus">
          <p class="title">商品状态统计</p>
          <div class="tableHeader"><span>商品状态</span><span>数量</span></div>
          <div><span>上架中</span><span>{{getGoodsStatusJson.onSale}}</span></div>
          <div><span>下架中</span><span>{{getGoodsStatusJson.offSale}}</span></div>
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
        onSale: '', // 状态
        goodsName: '', // 商品名称
        item1: [{label: '全部', value: ''}],
        item2: [{label: '全部', value: ''}],
        item3: [
          {label: '全部', value: ''},
          {label: '上架中', value: 'true'},
          {label: '已下架', value: 'false'}
        ],
        tableData: [],
        getGoodsStatusJson: {},
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
      this.getGoodsStatus()
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
        let result = await context.http.get('rts/api/goods', {
          onOld: true,
          page: (this.currentPage - 1),
          size: this.pgSize,
          mallId: this.mallId,
          businessTypeId: this.businessTypeId,
          onSale: this.onSale,
          goodsName: this.goodsName
        })
        this.tableData = result.data
        this.total = Number(result.headers['x-total-count'])
      },
      async getGoodsStatus () { // 获取商品状态统计
        let result = await context.http.get('rts/api/goods/statistics', {})
        this.getGoodsStatusJson = result.data
      },
      indexMethod (index) {
        return this.pgSize * (this.currentPage - 1) + index + 1
      },
      onSaleFn (row, column) {
        return row.onSale ? '上架中' : '已下架'
      },
      searchFn () { // 搜索
        this.currentPage = 1
        this.getDataList()
      },
      current_change (currentPage) { // 切换页码
        this.currentPage = currentPage
        this.getDataList()
      },
      pgSizeSelectFn () { // 切换显示条数
        this.currentPage = 1
        this.getDataList()
      },
      getImgUrl (row) {
        return row.goodsImage[0].imageUrl
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
