<template>
  <div class="flow-list">
    收支流水
    <div class="pl-content">
      <div class="plc-search">
        <el-input v-model="referred"
                  placeholder="品牌"></el-input>
        <div class="query-btn"
             @click="query">查询</div>
        <div class="addbtn"
             v-if="hasAuthority('02050201')"
             @click="newPipeline"><i class="fa fa-pencil-square-o"
             aria-hidden="true"></i>新增流水</div>
      </div>
      <div class="plc-table">
        <div class="export" v-if="hasAuthority('02040201')">
          <span @click="exportData"><i class="iconfont icon-xiazaidaoru"></i>导出</span>
        </div>
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column prop="billType"
                           label="流水类型"
                           align="center"
                           :formatter="formatBillType"></el-table-column>
          <el-table-column prop="recordDate"
                           label="发生时间"
                           align="center"></el-table-column>
          <el-table-column prop="amount"
                           label="发生额/元"
                           align="center"></el-table-column>
          <el-table-column prop="flowState"
                           label="匹配状态"
                           align="center"
                           :formatter="formatBillStatus"></el-table-column>
          <el-table-column label="操作" v-if="hasAuthority('02050203')"
                           align="center"
                           width="300px">
            <template slot-scope="scope" >
              <el-button @click="handleEdit(scope.$index, scope.row)"
                         class="el-button--primary operation-btn"
                         size="mini"
                         >查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="ctc-foot">
        <div class="pagingnum">
          显示 <select v-model="pgSize"
                  @change="currentSel">
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

    <el-dialog title="新增流水"
               :visible.sync="flowDialogVisible"
               class="flowDialog">
      <el-form :model="addData"
               :rules="addFlowRules"
               ref="addFlowform">
        <div class="dl-subtitle">流水类型<span class="required">*</span>
          <el-form-item prop="billType">
            <el-select v-model="addData.billType"
                       @change="billTypeChange"
                       placeholder="请选择">
              <el-option v-for="item in billTypeOption"
                         :key="item.value"
                         :label="item.name"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="dl-subtitle">发生额/元<span class="required">*</span>
          <el-form-item prop="amount">
            <el-input v-model="addData.amount" type="number">
            </el-input>
          </el-form-item>
        </div>
        <div class="dl-subtitle">客户名称
          <el-form-item prop="tenant">
            <el-select v-model="addData.tenant"
                       value-key="id"
                       placeholder="请选择">
              <el-option value="">请选择</el-option>
              <el-option v-for="item in tenantNameeOptions"
                         :key="item.id"
                         :label="item.teantName"
                         :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="dl-subtitle">
          <!-- <el-form-item v-if="addData.tenant">
            {{addData.tenant.referred}}
          </el-form-item> -->
          <p>品牌</p>
          <span style="display: inline-block;height: 35px;line-height: 60px;">
            <span v-if="addData.tenant">{{addData.tenant.referred}}</span>
          </span>
        </div>
        <div class="dl-subtitle">
          <span v-if="accountEntry">入账时间</span>
          <span v-else>出账时间</span>
          <span class="required">*</span>
          <el-form-item prop="recordDate">
            <el-date-picker type="date"
                            value-format="yyyy-MM-dd"
                            v-model="addData.recordDate"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div>
        <!-- <div class="dl-subtitle">出账时间<span class="required">*</span>
          <el-form-item>
            <el-date-picker
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div> -->
        <div class="inlinediv">
          <div class="dl-subtitle">备注</div>
          <el-form-item style="width: 100%;margin-bottom: 20px;">
            <el-input v-model="addData.remake"
                      resize="none"
                      maxlength="200"
                      type="textarea">
            </el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="flowDialogVisible = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="addPipeline('addFlowform')"
                   class="defaultbtn dialog-confirmBtn">确 定</el-button>
      </div>
    </el-dialog>

    <flowDetails :detailsdrawershow="detailsdrawershow"
                 :detailsData="flowDetailsData"
                 @drawerClose="drawerClose"
                 @query='query' />
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import flowDetails from './components/flowDetails'
import { toLocaleString } from '@/utils/validate.js'
export default {
  name: 'flow',
  components: {
    flowDetails
  },
  data () {
    return {
      navList: [{ label: '本期未结清', value: true }, { label: '逾期未结清', value: false }, { label: '退租未结清', value: false }, { label: '自建未结清', value: false }],
      referred: '',
      billTypeOption: [{
        value: 'R',
        name: '收款'
      }, {
        value: 'P',
        name: '付款'
      }],
      checkList: ['USING'],
      accountEntry: true,
      adddialogVisible: false,
      addProjectShow: false,
      detailsdrawershow: false,
      flowDialogVisible: false,
      flowExplain: '',
      addData: {},
      addform: {},
      addFlowRules: {
        billType: [
          { required: true, message: '请选择流水类型', trigger: 'change' }
        ],
        amount: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ],
        tenant: [
          { required: false, message: '请选择客户', trigger: 'change' }
        ],
        recordDate: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ]
      },
      tableData: [],
      tenantNameeOptions: [],
      currentPage: 1,
      pgNum: 1,
      total: 0,
      pgSize: 15,
      flowDetailsData: {},
      flowTypeOption: [
        {
          code: 15,
          name: '收款'
        },
        {
          code: 15,
          name: '付款'
        }
      ],
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
      onRent: false
    }
  },
  created () {
    this.query()
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    drawerClose () {
      this.detailsdrawershow = false
    },
    dialogHide () {
      this.adddialogVisible = false
    },
    formatBillType (row, column) {
      return row.billType === 'R' ? '收款' : '付款'
    },
    formatBillStatus (row, column) {
      let res = ''
      if (row.flowState === 'NO') {
        res = '未匹配'
      } else if (row.flowState === 'OK') {
        res = '完全匹配'
      } else if (row.flowState === 'SECTION') {
        res = '部分匹配'
      }
      return res
    },
    async newPipeline () {
      this.flowDialogVisible = true
      let result = await context.http.get('/cms/api/tenant/all', { tenantName: '' })
      this.tenantNameeOptions = result.data
    },
    addPipeline (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.flowDialogVisible = true
          console.log('add', this.addData)
          if (!this.addData.tenant) {
            this.addData.tenant = null
          }
          let _this = this
          context.http.post('/cms/api/billFlows', this.addData).then(res => {
            if (res) {
              _this.flowDialogVisible = false
              _this.query()
              _this.addData.tenant = ''
              _this.addData = {}
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    formatStatus () {

    },
    addFlow () {

    },
    async query () {
      let result = await context.http.get('cms/api/billFlows', { page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'id,desc',
        referred: this.referred })
      this.tableData = result.data
      this.tableData.forEach(ele => {
        ele.amount = toLocaleString(ele.amount)
      })
      this.total = Number(result.headers['x-total-count'])
    },
    async exportData () {
      axios({ method: 'GET', url: '/cms/api/billFlows/report', params: { page: (this.currentPage - 1), size: this.pgSize, sort: 'id,desc' }, responseType: 'blob' }).then(res => {
        console.log(res)
        let url = window.URL.createObjectURL(new Blob([res.data]))
        console.log(url)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        let fileName = res.headers['content-disposition'].substring(20)
        fileName = decodeURI(fileName)
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(url)
      })
    },
    bindCheckBox (value) {
      this.checkList = []
      this.checkList.push(value[1])
      this.currentPage = 1
      this.query()
    },
    async handleEdit (index, row) {
      let result = await context.http.get(`cms/api/billFlows/${row.id}`)
      this.flowDetailsData = result.data
      this.detailsdrawershow = true
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    goCharts (index, row) {
      this.$router.push({ path: '/home/charts', query: { buildingId: row.id } })
    },
    billTypeChange () {
      if (this.addData.billType === 'R') {
        this.accountEntry = true
      } else {
        this.accountEntry = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.flow-list {
  font-size: 16px;
  background-color: #f9f9f9;
  .pl-content {
    width: 100%;
    margin: 0 auto;
    .plc-search {
      height: 70px;
      line-height: 70px;
      background-color: #fff;
      margin: 20px 0;
      padding-left: 18px;
      box-shadow: 1px 2px 5px #eee;
      .el-input {
        width: 180px;
        height: 32px;
        input {
          height: 32px;
          line-height: 32px;
        }
      }
      div {
        float: left;
        display: inline-block;
      }
      .swbtn {
        margin-left: 16px;
        font-size: 18px;
        width: 100px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        font-size: 18px;
        color: #000;
        background-color: #fff;
        margin-left: 16px;
        border-radius: 10px;
        cursor: pointer;
      }
      .btnselect {
        color: #fff;
        background-color: #42506c;
      }
      div {
        cursor: pointer;
      }
    }
    .bd-statistics {
      background-color: #fff;
      margin-bottom: 10px;
      box-shadow: 1px 2px 5px #eee;
      .statistics-title {
        font-size: 14px;
        height: 30px;
        line-height: 30px;
        color: #333;
        font-weight: bold;
        padding-left: 20px;
        border-bottom: 1px solid #ededef;
      }
      .statistics-content {
        .contentItem {
          display: inline-block;
          padding: 20px 0 20px 20px;
        }
        .bd-number {
          margin-left: 6px;
          padding-right: 20px;
          font-size: 14px;
          font-weight: 400;
          font-family: PingFangSC;
          color: #353b4b;
          display: inline-block;
          min-width: 90px;
          .ci-title {
            font-weight: 400;
            height: 25px;
            line-height: 25px;
            color: #828692;
            font-size: 12px;
          }
          .ci-value {
            display: inline-block;
            font-size: 20px;
            margin-top: 4px;
          }
        }
        .borderstrip {
          width: 2px;
          height: 35px;
          background-color: #ecedef;
          display: inline-block;
          margin-top: 6px;
        }
      }
    }
    .plc-table {
      margin-top: 20px;
      position: relative;
      .export {
        position: absolute;
        right: 20px;
        top: 5px;
        z-index: 9;
        span {
          display: inline-block;
          width: 60px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background: rgba(222, 235, 254, 1);
          color: #5b9af8;
          opacity: 0.9;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
    .rent-control {
      border: 1px solid #96d050;
      background-color: #fff;
      color: #96d050;
      &:hover {
        background-color: #96d050;
        color: #fff;
      }
    }
    .editbtn {
      color: #3175d2;
      &:hover {
        color: #fff;
      }
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
  .addProjectdialog .el-dialog {
    width: 1000px;
    margin-top: 5vh !important;
  }
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #d9dce2;
  }
  .el-table__row div {
    white-space: nowrap;

    img {
      width: 97px;
      height: 80px;
    }
    .buildingImage {
      width: 120px;
      margin: 0 auto;
    }
  }
  .flowDialog {
    .dl-subtitle {
      display: inline-block;
      width: 49%;
      margin-top: 20px;
    }
    .el-form-item {
      margin: 10px 0 0 0;
      width: 81%;
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>
