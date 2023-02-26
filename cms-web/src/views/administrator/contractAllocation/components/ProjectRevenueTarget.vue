<template>
  <!-- 项目营收目标 -->
  <div class="ProjectRevenueTarget">
    <div class="dc-right"
         style="margin-bottom: 14px;">
      <div class="dr-head">
        <span class="vertical"></span>
        项目营收目标
      </div>
    </div>
    <!--  -->
    <div class="content">
      <div class="head">
        <el-date-picker v-model="timeYear"
                        type="year"
                        value-format="yyyy"
                        :default-value="new Date()"
                        clearable
                        placeholder="请选择年">
        </el-date-picker>
        <el-button style="margin-left: 14px"
                   type="primary"
                   @click="page.count=1;query()">查询</el-button>
        <el-link type="success"
                 @click="dialogVisible = true"
                 class="link"><i class="el-icon-circle-plus-outline el-icon--left"></i> 新增营收目标</el-link>
      </div>
      <!--  -->
      <div class="table"
           style="clear: both">
        <el-table :data="tableData"
                  ref="ProjectRevenueTargettable"
                  style="width: 100%"
                  min-height="242">
          <el-table-column prop="countDate"
                           label="时间"
                           header-align="center"
                           align="center">
            <template slot-scope="scope">
              <div v-if="!scope.row.rowEdit">{{ scope.row.countDate }}</div>
              <el-date-picker style="width: 86%;"
                              v-else
                              v-model="scope.row.countDate"
                              type="year"
                              value-format="yyyy"
                              :default-value="new Date()"
                              clearable
                              placeholder="">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column prop="typeName"
                           label="类型"
                           header-align="center"
                           align="center">
            <template slot-scope="scope">
              <div v-if="!scope.row.rowEdit">{{ scope.row.typeName }}</div>
              <el-select v-else
                         v-model="scope.row.reportUse"
                         clearable
                         placeholder="请选择">
                <el-option v-for="item in options"
                           :key="item.value"
                           :label="item.name"
                           :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="revenueTargetAmount"
                           label="营收目标金额/元"
                           header-align="center"
                           align="center">
            <template slot-scope="scope">
              <div v-if="!scope.row.rowEdit">{{ scope.row.revenueTargetAmount }}</div>
              <el-input v-else
                        type="number"
                        placeholder="请输入"
                        v-model="scope.row.revenueTargetAmount"
                        clearable>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           width="120"
                           header-align="center"
                           align="center">
            <template slot-scope="scope">
              <i class="el-icon-edit-outline"
                 style="font-size: 18px;"
                 v-if="!scope.row.rowEdit"
                 @click="scope.row.rowEdit = true"></i>
              <el-button type="text"
                         size="mini"
                         v-if="scope.row.rowEdit"
                         @click="handleEdit(scope.row)">保存</el-button>
              <el-button type="text"
                         style="color: #909399"
                         v-if="scope.row.rowEdit"
                         size="mini"
                         @click="CANCEL(scope.row)">取消</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top: 10px"
           v-if="tableData.length">
        <el-pagination background
                       @current-change="handleCurrentChange"
                       :page-size="page.size"
                       :current-page="page.count"
                       small
                       layout="prev, pager, next"
                       :total="page.total" />
      </div>
    </div>
    <!--  -->
    <el-dialog title="新增营收目标"
               :modal-append-to-body='false'
               :modal="false"
               :close-on-click-modal="false"
               :visible.sync="dialogVisible"
               width="30%"
               :before-close="handleClose">
      <el-form :model="addForm"
               :rules="rules"
               ref="ruleAddForm"
               label-width="108px">
        <el-form-item label="时间"
                      prop="countDate">
          <el-date-picker style="width: 78%"
                          v-model="addForm.countDate"
                          type="year"
                          value-format="yyyy"
                          :default-value="new Date()"
                          clearable
                          placeholder="请选择年">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="类型"
                      prop="reportUse">
          <el-select style="width: 78%"
                     v-model="addForm.reportUse"
                     clearable
                     placeholder="请选择">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="营收目标金额"
                      prop="revenueTargetAmount">
          <el-input type="number"
                    style="width: 78%"
                    v-model="addForm.revenueTargetAmount"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary"
                   @click="revenueTarget">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
export default {
  components: {

  },
  data () {
    return {
      timeYear: '',
      options: [
        { value: 'SHOP', name: '商铺' },
        { value: 'WORK', name: '办公' },
        { value: 'MARKET', name: '菜场' }
      ],
      tableData: [

      ],
      dialogVisible: false,
      page: {
        size: 5,
        count: 1,
        total: 10
      },
      addForm: {
        countDate: '',
        reportUse: '',
        revenueTargetAmount: ''
      },
      rules: {
        countDate: [{ required: true, message: '请选择时间', trigger: 'blur' }],
        reportUse: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        revenueTargetAmount: [{ required: true, message: '请输入营收目标金额', trigger: 'blur' }]
      },
      projectDetail: this.detail
    }
  },
  props: {
    detail: {
      type: Object,
      default: {}
    }
  },
  watch: {
    detail (n, old) {
      this.query(n)
      // this.handleClose()
      this.page.count = 1
      this.timeYear = ''
    }
  },
  created () {
    this.query(this.detail)
  },
  methods: {
    // 获取列表
    query (row, flag) {
      if (!row) {
        row = this.detail
      }
      let that = this
      if (flag) {
        this.page.count = 1
      }
      context.http.get('cms/api/buildingFinanceCounts/project', {
        projectManagementId: row.id,
        page: this.page.count - 1,
        size: this.page.size,
        year: this.timeYear ? `${this.timeYear}` : '',
        sort: 'countDate,desc'
      }).then(res => {
        if (res.data) {
          res.data.forEach(v => {
            for (let o of that.options) {
              // typeName显示
              if (v.reportUse === o.value) {
                v.typeName = o.name
              }
              if (!v.reportUse) {
                v.typeName = ''
              }
            }
            if (v.countDate) {
              v.countDate = v.countDate.substr(0, v.countDate.indexOf('-'))
            }
            // 表格修改标识
            v.rowEdit = false
            // 原数据
            v.rowObject = JSON.stringify(v)
          })
          this.tableData = res.data
          this.page.total = Number(res.headers['x-total-count'])
        } else {
          this.tableData = []
          this.page.total = 0
        }
      })
    },
    handleClose () {
      this.dialogVisible = false
      for (let i in this.addForm) {
        this.addForm[i] = ''
      }
      this.$refs['ruleAddForm'].resetFields()
    },
    revenueTarget () {
      this.$refs['ruleAddForm'].validate((valid) => {
        if (valid) {
          this.addForm.projectManagementId = this.detail.id
          // 新增按照后台时间格式需要加上-01-01
          if (this.addForm.countDate.search('01-01') === -1) {
            this.addForm.countDate = this.addForm.countDate + '-01-01'
          }
          context.http.post(`cms/api/buildingFinanceCounts/project`, this.addForm).then(res => {
            if (res) {
              this.$message.success('新增成功')
              this.query(this.detail, true)
              this.handleClose()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleEdit (row) {
      let { id, countDate, reportUse, revenueTargetAmount } = JSON.parse(JSON.stringify(row))
      let that = this
      if (countDate === '' || !countDate) {
        this.$message.error('请选择时间')
        return
      }
      if (reportUse === '') {
        this.$message.error('请选择类型')
        return
      }
      if (revenueTargetAmount === '') {
        this.$message.error('请输入营收目标金额')
        return
      }
      // 编辑按照后台时间格式需要加上-01-01 编辑增加项目ID
      let projectManagementId = this.detail.id
      countDate = countDate + '-01-01'
      context.http.post(`cms/api/buildingFinanceCounts/project`, {
        id,
        projectManagementId,
        countDate,
        reportUse,
        revenueTargetAmount
      }).then(res => {
        if (res) {
          that.$message.success('修改成功')
          row.rowEdit = false
          for (let o of that.options) {
            if (row.reportUse === o.value) {
              row.typeName = o.name
            }
          }
        }
      })
    },
    CANCEL (row) {
      row.rowEdit = false
      let obj, flag, rowObject
      this.tableData.forEach((v, i) => {
        if (v.id === row.id) {
          obj = v
          flag = i
        }
      })
      rowObject = JSON.stringify(JSON.parse(row.rowObject))
      if (obj.revenueTargetAmount !== JSON.parse(rowObject).revenueTargetAmount ||
        obj.reportUse !== JSON.parse(rowObject).reportUse ||
        obj.countDate !== JSON.parse(rowObject).countDate) {
        let reset = Object.assign(JSON.parse(rowObject), { rowObject: rowObject })
        this.$set(this.tableData, flag, reset)
      }
    },
    // 页码
    handleCurrentChange (row) {
      this.page.count = row
      this.query(this.detail)
    }
  }
}
</script>

<style lang="scss">
.ProjectRevenueTarget {
  .contract-foot {
    border-top: 1px solid #e5e5e5;
    padding: 20px 0;
    text-align: right;
    margin-top: 100px;
  }
  .contract-body {
    min-height: 600px;
  }
  .rtl {
    width: 900px !important;
  }
  .dc-right {
    width: 100%;
    /* border: 1px solid #e7e7e7; */
    .dr-head {
      background-color: #fff;
      height: 44px;
      line-height: 44px;
      padding-left: 12px;
      padding-right: 12px;
      font-size: 14px;
      margin-bottom: 10px;
      font-weight: bold;
      font-size: 16px;
      color: #262626;
      border-bottom: 1px solid #f6f6f6;
      .editBtn {
        font-size: 12px;
        cursor: pointer;
        float: right;
        font-weight: 500;
        color: #3575f6;
      }
      .vertical {
        display: inline-block;
        width: 4px;
        height: 18px !important;
        background-color: #3575f6;
        border-radius: 2px;
        vertical-align: sub;
        margin-right: 5px;
      }
    }
    .el-form-item {
      display: inline-block;
      width: 30%;
      margin-left: 16px;
      margin-right: 10px;
      vertical-align: top;
      &:nth-of-type(3n) {
        margin-right: 0;
      }
      .el-form-item__content {
        > span {
          display: inline-block;
          line-height: 30px;
          height: 30px;
        }
      }
    }
  }
  .content {
    .head {
      margin-bottom: 14px;
      .link {
        color: #44af69;
        text-decoration: underline;
        float: right;
      }
    }
  }
}
</style>
<style>
.el-year-table td.today .cell {
  color: rgb(96 98 102) !important;
  font-weight: 400 !important;
}
.ProjectRevenueTarget .el-dialog__header {
  border-bottom: none !important;
}
.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label::before {
  display: none;
}
.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label::after {
  content: "*";
  color: rgb(245 108 108);
  margin-left: 4px;
}
.el-pagination.is-background .el-pager li:not(.disabled).active {
  border-radius: 50%;
  background-color: rgb(63 95 191) !important;
  color: rgb(255 255 255) !important;
}
.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  background: none !important;
}
.ProjectRevenueTarget .el-dialog__wrapper {
  background: rgb(0 0 0 / 30%) !important;
}
</style>
