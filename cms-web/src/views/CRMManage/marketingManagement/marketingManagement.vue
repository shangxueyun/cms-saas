<template>
  <div id="marketingManagement">
    <span style="font-size: 16px">营销信息</span>
    <div class="head">
      <span>
        <el-date-picker
          v-model="birthday"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
        <el-button  type="primary" style="margin-left: 15px" @click="searchFn">查询</el-button>
      </span>
      <span v-if="hasAuthority('05030101')"><el-button type="success" icon="el-icon-message" @click="snedMessage">发送短信</el-button></span>
    </div>
    <div class="content">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column align="center"  type="selection"></el-table-column>
        <el-table-column align="center"  label="会员昵称" prop="nickName"></el-table-column>
        <el-table-column align="center"  prop="birthday" label="生日日期"></el-table-column>
        <el-table-column align="center"  prop="telephone" label="手机号"></el-table-column>
      </el-table>
    </div>
    <div class="ctc-foot">
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
    </div>
  </div>
</template>
<script>
  import context from '@/service'
  export default {
    name: 'marketingManagement',
    component: {},
    data () {
      return {
        birthday: '',
        tableData: [],
        multipleSelection: [],
        currentPage: 1,
        total: 0,
        pgSize: 20,
        pgNumoptions: [
          {
            value: 20,
            label: '20'
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
        fromData: {

        }
      }
    },
    created () {
    },
    mounted () {
      this.getDataList()
    },
    methods: {
      hasAuthority (code) {
        return context.user.hasAuthority(code)
      },
      async getDataList () {
        let result = await context.http.get('crm/api/members/birthday', {page: (this.currentPage - 1), size: this.pgSize, nowDate: this.birthday})
        this.tableData = result.data
        this.total = Number(result.headers['x-total-count'])
      },
      snedMessage () {
        if (this.multipleSelection.length === 0) {
          this.$message({
            message: '最少选择一个会员！',
            type: 'error'
          })
        } else {
          let arr = ''
          for (var i = 0; i < this.multipleSelection.length; i++) {
            arr += this.multipleSelection[i].id + ','
          }
          arr = arr.substring(0, arr.length - 1)
          console.log(arr)
          context.http.get('crm/api/members/birthday/push', {memberId: arr}).then(res => {
            if (res) {
              this.$message({
                message: '短信发送成功！',
                type: 'success'
              })
            }
          })
        }
      },
      searchFn () {
        this.currentPage = 1
        this.getDataList()
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
        console.log(this.multipleSelection)
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
  .head{
    height: 70px;
    line-height: 70px;
    background: #FFFFFF;
    margin-top: 15px;
    padding: 0 15px;
    display: flex;
    justify-content: space-between;
  }
  .content{
    background: #FFFFFF;
    margin-top: 15px;
    border: 1px solid #eee;
    min-height: 500px;
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
</style>
