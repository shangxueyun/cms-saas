<template>
    <div id="enterBrand">
      <div class="seachDiv">
        <el-col :span="12">
     
        </el-col>
        <el-col :span="4" :offset="8">
            <el-button type="success" @click="getbrands">选择品牌</el-button>
        </el-col>
      </div>
      <div class="tableDiv">
        <el-table :data="tableData">
          <!-- <el-table-column prop="storeName" label="门店名称" align="center"></el-table-column> -->
          <el-table-column prop="chineseName" label="品牌名称" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-button type="primary" size="mini"  @click="shopDetails(scope.$index, scope.row)">查看档案</el-button>
                <el-button type="primary" size="mini"  @click="delFn(scope.$index, scope.row)">删除档案</el-button>
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
      <el-dialog
        title="请选择相应的品牌（可多选）"
        :visible.sync="addBrandShow"
        width="40%"
        center>
        <el-table :data="brandsData" @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column prop="chineseName" label="品牌名称" align="center"></el-table-column>
        </el-table>
        <div class="ctc-foot">
          <el-col >
            <span class="flex">
              <!-- <div class="pagingnum">显示
                <select v-model="brandsTabel.pgSize" @change="pgSizeSelectFn1">
                  <option v-for="item in brandsTabel.pgNumoptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                  </option>
                </select>
                条目 -->
                <!-- <span style="padding-left: 30px">显示从{{brandsTabel.pgSize*(brandsTabel.currentPage - 1) + 1}}到{{brandsTabel.pgSize*brandsTabel.currentPage}}项结果，共<span class="style: red">{{brandsTabel.total}}</span>条</span> -->
              <!-- </div> -->
              <el-pagination v-if="brandsTabel.total > 0"
                            background
                            layout="prev, pager, next"
                            :page-size=brandsTabel.pgSize
                            :total="brandsTabel.total"
                            :current-page="brandsTabel.currentPage"
                            @current-change="current_change1">
              </el-pagination>
            </span>
          </el-col>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addBrandShow = false">取 消</el-button>
          <el-button type="primary" @click="addBrandFun">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
    import context from '@/service'
    export default {
      name: 'enterBrand',
      components: {
      },
      data () {
        return {
          brandsData: [], // 品牌表格数据
          addBrandShow: false,
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
          ],
          brandsTabel: {
            cheackedOption: [], // 选中的品牌
            currentPage: 1,
            total: 0,
            pgSize: 10,
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
        }
      },
      created () {
        console.log(this.$route.params)
        this.getstores()
      },
      mounted () {

      },
      methods: {
        handleSelectionChange (val) {
          this.brandsTabel.cheackedOption = []
          for (var i = 0; i < val.length; i++) {
            this.brandsTabel.cheackedOption[i] = {id: val[i].id}
          }
          console.log(this.brandsTabel.cheackedOption)
        },
        async getbrands () { // 获取品牌库
          let result = await context.http.get('ywm/api/projectLibrarys/existsBrand', {page: (this.brandsTabel.currentPage - 1), size: this.brandsTabel.pgSize, projectLibraryId: this.$route.params.id})
          this.addBrandShow = true
          this.brandsData = result.data
          this.brandsTabel.total = Number(result.headers['x-total-count'])
        },
        addBrandFun () { // 选择品牌   （添加品牌）
          context.http.put('ywm/api/projectLibrarys/brands', {id: this.$route.params.id, brands: this.brandsTabel.cheackedOption}).then(res => {
            this.addBrandShow = false
            this.getstores()
            this.$message({
              message: '新增记录成功！',
              type: 'success'
            })
          })
        },
        delFn (index, row) {
          context.http.delete('ywm/api/projectLibrarys/brands', {id: this.$route.params.id, brandId: row.id}).then(res => {
            this.getstores()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          })
        },
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
          let result = await context.http.get('ywm/api/projectLibrarys/brands', {projectLibraryId: this.$route.params.id, page: (this.currentPage - 1), size: this.pgSize})
          this.tableData = result.data
          this.total = Number(result.headers['x-total-count'])
        },
        addShop () { // 增加门店
    
        },
        shopDetails (index, row) { // 品牌档案
          console.log(row)
          this.$router.push({name: 'recordInfo', params: {id: row.id, pageType: 'details', from: 'projectLibrary'}})
        },
        pgSizeSelectFn () { // 切换显示条数
          this.currentPage = 1
          this.getstores()
        },
        current_change (currentPage) { // 切换页码
          this.currentPage = currentPage
          this.getstores()
        },
        pgSizeSelectFn1 () { // 切换显示条数
          this.brandsTabel.currentPage = 1
          this.getbrands()
        },
        current_change1 (currentPage) { // 切换页码
          this.brandsTabel.currentPage = currentPage
          this.getbrands()
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
