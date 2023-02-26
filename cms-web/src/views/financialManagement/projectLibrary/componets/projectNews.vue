<template>
    <div id="projectNews">
      <div class="seachDiv">
        <p style="width:100px">关键词：</p>
        <el-input v-model="keys" placeholder="中文/英文" style="width:200px;margin-right:50px"></el-input>
        <el-button type="primary" @click="brandNews">查询</el-button>
      </div>
      <div class="tableDiv">
        <el-table
          :data="tableData"
          :default-expand-all="true"
          style="width: 100%">
          <el-table-column type="expand" >
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="内容简介">
                  <span>{{ props.row.viceTitle }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="上传时间" :formatter="formatUploadTime"></el-table-column>
          <el-table-column label="资讯标题" prop="title"></el-table-column>
          <el-table-column label="原文链接"  >
            <template slot-scope="props">
              <a :href="props.row.originalLink" target="_blank">{{props.row.originalLink}}</a>
            </template>  
          </el-table-column>
          <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini"  @click="deleteFn(scope.$index, scope.row)">删除</el-button>
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
      name: 'projectNews',
      components: {
      },
      data () {
        return {
          id: '',
          keys: '',
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
        this.id = this.$route.params.id
        this.brandNews()
      },
      mounted () {

      },
      methods: {
        formatUploadTime (row, column) {
          return row.uploadTime.replace('T', '  ')
        },
        async brandNews () { // 详情数据
          let result = await context.http.get('ywm/api/brandNews/', { projectLibraryId: this.id, title: this.keys, page: (this.currentPage - 1), size: this.pgSize })
          this.tableData = result.data
          this.total = Number(result.headers['x-total-count'])
        },
        async deleteFn (index, row) {
          let self = this
          // this.addParm.brand.id = this.$route.params.id
          let result = await context.http.delete('ywm/api/brandNews/' + row.id)
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
          this.brandNews()
        },
        pgSizeSelectFn () { // 切换显示条数
          this.currentPage = 1
          this.brandNews()
        },
        current_change (currentPage) { // 切换页码
          this.currentPage = currentPage
          this.brandNews()
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
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    padding: 10px 30px;
    display: flex;
    align-items:center;
    color: #076fff;
    font-size:10px 
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
