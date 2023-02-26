<template>
    <div id="shopInfo">
      <div class="seachDiv">
        <el-col :span="12">
          <div class="item">
            <p>门店名称：</p>
            <el-input v-model="storeName"></el-input>
          </div>
          <div class="item">
            <p>地址搜索：</p>
            <el-input v-model="storeAdress"></el-input>
          </div>
          <div class="item">
            <el-select  v-model="brandStatus"  style="width:120px;margin-right:30px" placeholder="状态">
              <el-option v-for="item in statusArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="4" :offset="8">
            <el-button type="primary" @click="seachBtn">查询</el-button>
            <el-button type="success" @click="addShop">增加门店</el-button>
        </el-col>
      </div>
      <div class="tableDiv">
        <el-table :data="tableData">
          <el-table-column prop="storeName" label="门店名称" align="center"></el-table-column>
          <el-table-column prop="storeAdress" label="门店地址" align="center"></el-table-column>
          <el-table-column  prop="mallName" label="所属商圈" align="center"></el-table-column>
          <el-table-column  prop="storeArea" label="店铺面积" align="center"></el-table-column>
          <el-table-column  prop="perCapitaConsumer" label="人均消费" align="center"></el-table-column>
          <el-table-column  prop="coverageRadius" label="覆盖半径" align="center"></el-table-column>
          <el-table-column  prop="businessLife" label="经营年限" align="center"></el-table-column>
          <el-table-column  prop="brandStatus" label="状态" align="center" :formatter="formatBrandStatus"></el-table-column>
          <el-table-column label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-button type="primary" size="mini"  @click="shopDetails(scope.$index, scope.row)">门店档案</el-button>
              </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="ctc-foot">
        <el-col >
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
    name: 'shopInfo',
    components: {

    },
    data () {
      return {
        storeName: '',
        storeAdress: '',
        brandStatus: '',
        statusArr: [
          {label: '正常', value: 'Normal'},
          {label: '异常', value: 'Abnormal'},
          {label: '停业', value: 'ShutDown'}
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
      console.log(this.$route.params)
      this.getstores()
    },
    mounted () {

    },
    methods: {
      formatBrandStatus (row, column) {
        for (var i = 0; i < this.statusArr.length; i++) {
          if (row.brandStatus === this.statusArr[i].value) {
            return this.statusArr[i].label
          }
        }
      },
      seachBtn () {
        this.getstores()
      },
      async getstores () { // 获取门店列表
        let result = await context.http.get('ywm/api/stores', {storeName: this.storeName, storeAdress: this.storeAdress, brandStatus: this.brandStatus, brandId: this.$route.params.id, page: (this.currentPage - 1), size: this.pgSize})
        this.tableData = result.data
        this.total = Number(result.headers['x-total-count'])
      },
      addShop () { // 增加门店
        this.$route.params.childPageType = 'add'
        this.$router.push({name: 'addShop', params: this.$route.params})
      },
      shopDetails (index, row) { // 门店档案
        this.$route.params.cid = row.id
        this.$route.params.childPageType = 'details'
        this.$router.push({name: 'addShop', params: this.$route.params})
      },
      pgSizeSelectFn () { // 切换显示条数
        this.currentPage = 1
        this.getstores()
      },
      current_change (currentPage) { // 切换页码
        this.currentPage = currentPage
        this.getstores()
      }
    }
  }
</script>
<style lang="scss" scoped>
.seachDiv{
    height: 80px;
    padding: 0 20px;
    display: flex;
    background-color: #fff;
    border: 1px solid #eee;
    align-items: center;
  .el-col{
      display: flex;
      .item{
        display: flex;
        margin-right: 20px;
        align-items:center;
          p{
            width: 100px;
          }
      }
  }
}
.tableDiv{
  border: 1px solid #eeeeee;
  margin-top: 15px;
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
    .flex{
      display: flex;
      justify-content: space-between;
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
