<template>
  <div id="shopList" >
    <span style="font-size: 16px">配送员信息</span>
    <div class="search-header" style="margin-top:15px">
      <span>
        <el-select v-model="mallId" >
          <el-option v-for="item in item1" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </span>
      <span>
        <el-select v-model="hasOnline" placeholder="在线状态" >
          <el-option v-for="item in item2" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </span>
      <span>
        <el-input v-model="namePhone" placeholder="姓名/手机号"></el-input>
      </span>
      <span v-if="hasAuthority('06030101')">
        <el-button type="primary" @click="searchFn">搜索</el-button>
        <!--<el-button type="primary">添加配送人家</el-button>-->
      </span>
    </div>
    <div class="content">
      <el-col :span="24">
        <el-table :data="tableData" height="600" border style="width: 100%" >
          <el-table-column type="index" label="序号" :index="indexMethod"  width="50" align="center"></el-table-column>
          <el-table-column prop="distributionPersonName" label="姓名" align="center"></el-table-column>
          <el-table-column prop="distributionTelephone" label="手机号" align="center"></el-table-column>
          <el-table-column prop="mallName" label="所属商圈" align="center"></el-table-column>
          <el-table-column prop="hasOnline" label="在线状态" align="center" :formatter="hasOnlineFun"></el-table-column>
          <el-table-column label="添加时间" align="center" width="200" :formatter="formatAddTime"></el-table-column>
          <!--<el-table-column label="操作" align="center" width="400">-->
            <!--<template slot-scope="scope">-->
              <!--<el-button type="primary" size="mini"  @click="shopEdit(scope.$index, scope.row)">查看</el-button>-->
              <!--<el-button type="primary" size="mini"  @click="shopEdit(scope.$index, scope.row)">禁用</el-button>-->
              <!--<el-button type="primary" size="mini"  @click="shopEdit(scope.$index, scope.row)">重置密码</el-button>-->
              <!--<el-button type="primary" size="mini"  @click="shopEdit(scope.$index, scope.row)">查看收入</el-button>-->
            <!--</template>-->
          <!--</el-table-column>-->
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
        hasOnline: '', // 是否开工
        namePhone: '', // 姓名/手机号
        item1: [{label: '全部', value: ''}],
        item2: [
          {label: '全部', value: ''},
          {label: '开工', value: 'true'},
          {label: '收工', value: 'false'}
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
      this.getmallData()// 获取商圈
    },
    mounted () {
    },
    methods: {
      hasAuthority (code) {
        return context.user.hasAuthority(code)
      },
      formatAddTime (row, column) {
        if (row.addTime) {
          return row.addTime.replace('T', '  ')
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
        let result = await context.http.get('rts/api/distribution_management', {
          onOld: true,
          page: (this.currentPage - 1),
          size: this.pgSize,
          mallId: this.mallId,
          hasOnline: this.hasOnline,
          search: this.namePhone
        })
        this.tableData = result.data
        this.total = Number(result.headers['x-total-count'])
      },
      hasOnlineFun (row, column) {
        return row.hasOnline ? '开工' : '收工'
      },
      current_change (currentPage) { // 切换页码
        this.currentPage = currentPage
        this.getDataList()
      },
      pgSizeSelectFn () { // 切换显示条数
        this.currentPage = 1
        this.getDataList()
      },
      searchFn () { // 搜索
        this.currentPage = 1
        this.getDataList()
      },
      shopEdit (index, row) { // 店铺编辑
        console.log(index, row)
      },
      commodityManage (index, row) { // 管理商品
        console.log(index, row)
      },
      indexMethod (index) {
        return this.pgSize * (this.currentPage - 1) + index + 1
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
