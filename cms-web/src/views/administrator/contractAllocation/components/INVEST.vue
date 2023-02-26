<template>
  <!-- 项目招商目标 -->
  <div class="ProjectRevenueTarget">
    <div class="dc-right"
         style="margin-bottom: 14px;">
      <div class="dr-head">
        <span class="vertical"></span>
        招商目标
      </div>
    </div>
    <!--  -->
    <div class="content">
      <div class="head">
        <el-date-picker v-model="timeYear"
                        type="year"
                        value-format="yyyy-MM-dd"
                        format="yyyy"
                        :default-value="new Date()"
                        clearable
                        placeholder="请选择年">
        </el-date-picker>
        <el-button style="margin-left: 14px"
                   type="primary"
                   @click="page.count=1;query()">查询</el-button>
        <el-link type="success"
                 @click="dialogVisible = true"
                 class="link"><i class="el-icon-circle-plus-outline el-icon--left"></i> 新增招商目标</el-link>
      </div>
      <!--  -->
      <div class="table"
           style="clear: both">
        <el-table :data="tableData"
                  ref="INVESTTargettable"
                  style="width: 100%"
                  min-height="242">
          <el-table-column prop="targetYear"
                           label="时间"
                           header-align="center"
                           align="center">
            <template slot-scope="scope">
              <div v-if="!scope.row.rowEdit">{{ formatTargetYear(scope.row.targetYear) }}</div>
              <el-date-picker style="width: 86%;"
                              v-else
                              v-model="scope.row.targetYear"
                              type="year"
                              value-format="yyyy-MM-dd"
                              format="yyyy"
                              :default-value="new Date()"
                              clearable>
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column prop="target"
                           label="招商目标/m²"
                           header-align="center"
                           align="center">
            <template slot-scope="scope">
              <div v-if="!scope.row.rowEdit">{{ scope.row.target }}</div>
              <el-input v-else
                        type="number"
                        placeholder="请输入"
                        v-model="scope.row.target"
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
    <el-dialog title="新增招商目标"
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
                      prop="targetYear">
          <el-date-picker style="width: 78%"
                          v-model="addForm.targetYear"
                          type="year"
                          value-format="yyyy-MM-dd"
                          format="yyyy"
                          :default-value="new Date()"
                          clearable
                          placeholder="请选择年">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="招商目标(m²)"
                      prop="target">
          <el-input type="number"
                    style="width: 78%"
                    v-model="addForm.target"></el-input>
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
      tableData: [

      ],
      dialogVisible: false,
      page: {
        size: 5,
        count: 1,
        total: 10
      },
      addForm: {
        targetYear: '',
        target: ''
      },
      rules: {
        targetYear: [{ required: true, message: '请选择时间', trigger: 'blur' }],
        target: [{ required: true, message: '请输入招商目标', trigger: 'blur' }]
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
    }
  },
  created () {
    this.query(this.detail)
  },
  methods: {
    drawerClose () {
      this.page.count = 1
      this.timeYear = ''
    },
    formatTargetYear (yyyy) {
      return yyyy.replace('-01-01', '')
    },
    // 获取列表
    query (row, flag) {
      if (!row) {
        row = this.detail
      }
      let that = this
      if (flag) {
        this.page.count = 1
      }
      let targetYear = this.timeYear ? this.timeYear : ''
      context.http.get('cms/api/attract-targets', {
        projectManagementId: row.id,
        page: this.page.count - 1,
        size: this.page.size,
        targetYear: targetYear
        // sort: 'countDate,desc'
      }).then(res => {
        if (res.data) {
          res.data.forEach(v => {
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
          // if (this.addForm.targetYear.search('01-01') === -1) {
          //   this.addForm.targetYear = this.addForm.targetYear + '-01-01'
          // }
          context.http.post(`cms/api/attract-targets`, this.addForm).then(res => {
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
      let { id, targetYear, target } = JSON.parse(JSON.stringify(row))
      let that = this
      if (targetYear === '' || !targetYear) {
        this.$message.error('请选择时间')
        return
      }
      if (target === '') {
        this.$message.error('请输入招商目标')
        return
      }
      // 编辑按照后台时间格式需要加上-01-01 编辑增加项目ID
      let projectManagementId = this.detail.id
      context.http.put(`cms/api/attract-targets`, {
        id,
        projectManagementId,
        targetYear,
        target
      }).then(res => {
        if (res) {
          that.$message.success('修改成功')
          this.query(this.detail)
          row.rowEdit = false
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
      if (obj.target !== JSON.parse(rowObject).target ||
        obj.targetYear !== JSON.parse(rowObject).targetYear) {
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

<style lang="scss" scoped>
.invest {
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
.ProjectRevenueTarget .el-dialog__body {
  border: none;
}
.el-year-table td.today .cell {
  color: rgb(96 98 102) !important;
  font-weight: 400 !important;
}
.invest .el-dialog__header {
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
.invest .el-dialog__wrapper {
  background: rgb(0 0 0 / 30%) !important;
}
</style>
