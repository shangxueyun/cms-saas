<template>
  <div id="customerServiceRecords">
    <div class="title">
      <span style="font-size: 16px">客服记录</span>
      <el-button  icon="fa-pencil-square-o" type="primary" @click="dialogFrom" v-if="hasAuthority('05040101')">新增记录</el-button>
    </div>
    <div class="content">
      <el-table :data="tableData">
        <el-table-column align="center"  prop="nickName" label="用户昵称" ></el-table-column>
        <el-table-column align="center"  prop="telephone" label="手机号"></el-table-column>
        <el-table-column align="center"  prop="content" label="问题描述"></el-table-column>
        <el-table-column align="center"  prop="result" label="处理结果">
          <template slot-scope="scope">
            <span v-if="scope.row.result">已处理</span>
            <span class="red" v-else>未处理</span>
          </template>
        </el-table-column>
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
    <el-dialog :visible.sync="dialogFromIsShow" title="新增记录" :before-close="handleClose">
      <el-form :model="fromData" label-position="top" :rules="rules" ref="fromData">
        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="fromData.nickName" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="telephone">
          <p style="margin-bottom: 15px" >手机号码 <i class="red">*</i></p>
          <el-input v-model="fromData.telephone" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item prop="result">
          <p style="margin-bottom: 15px">处理结果 <i class="red">*</i></p>
          <el-select v-model="fromData.result" style="width: 100%">
            <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题描述" style="margin-bottom: 40px" prop="content">
          <el-input v-model="fromData.content" type="textarea"  :rows="3" resize="none" maxlength="25"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('fromData')">取 消</el-button>
        <el-button type="primary" @click="addRecord('fromData')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import context from '@/service'
  export default {
    name: 'customerServiceRecords',
    component: {},
    data () {
      return {
        tableData: [],
        currentPage: 1,
        total: 1,
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
        dialogFromIsShow: false,
        isClicking: false, // 防止连击重复发送请求
        fromData: {// 新增记录 提交参数
          nickName: '',
          telephone: '',
          result: '',
          content: ''
        },
        option: [
          {label: '已处理', value: true},
          {label: '未处理', value: false}
        ],
        rules: {
          telephone: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { pattern: /^1(3|4|5|7|8)\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
          ],
          result: [
            {required: true, message: '请选择处理结果'}
          ]
        }
      }
    },
    created () {
      this.getDataList()
    },
    mounted () {

    },
    methods: {
      hasAuthority (code) {
        return context.user.hasAuthority(code)
      },
      handleClose () {
        this.fromData.nickName = ''
        this.fromData.telephone = ''
        this.fromData.result = ''
        this.fromData.content = ''
        this.dialogFromIsShow = false
      },
      async getDataList () {
        let result = await context.http.get('crm/api/service-records', {page: (this.currentPage - 1), size: this.pgSize})
        this.tableData = result.data
        this.total = Number(result.headers['x-total-count'])
      },
      isResult (row, column) {
        return row.result ? '已处理' : '未处理'
      },
      addRecord (formName) { // 新增记录
        this.$refs[formName].validate((valid) => {
          if (valid && !this.isClicking) {
            let fromData = this.fromData
            this.isClicking = true
            context.http.post('crm/api/service-records', fromData).then(res => {
              this.isClicking = false
              if (res) {
                this.$message({
                  message: '新增记录成功！',
                  type: 'success'
                })
                this.$refs[formName].resetFields()
                this.dialogFromIsShow = false
                this.getDataList()
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (formName) { // 取消
        this.$refs[formName].resetFields()
        this.dialogFromIsShow = false
      },
      current_change (currentPage) {
        this.currentPage = currentPage
        this.getDataList()
      },
      pgSizeSelectFn () {
        this.currentPage = 1
        this.getDataList()
      },
      dialogFrom () {
        this.dialogFromIsShow = true
      }
    }
  }
</script>
<style lang="scss" scoped>
  .title{
    display: flex;
    padding: 0 20px 0 0;
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
    i{
      font-style: normal;
    }
    .red{
      color: #f00;
    }
  }
  #customerServiceRecords .el-form-item{
    margin-bottom: 22px;
  }
</style>
