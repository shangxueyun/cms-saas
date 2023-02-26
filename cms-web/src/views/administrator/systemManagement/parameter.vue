<template>
  <div class="parameter">
    <span class="page_head_title">参数配置</span>
    <div class="ct-content">
      <div class="search-bar">
        <div style="display: flex;align-items: center;">
          <div class="pname" style="font-size: 14px;">参数名称： </div>
          <el-input v-model="paraName"
                    size="small"
                    style="width:200px;"
                    v-if="hasAuthority('01020403')"
                    placeholder=""></el-input>
          <div class="query-btn"
               v-if="hasAuthority('01020403')"
               @click="queryPara">查询</div>
        </div>
        <el-button class="tban tban1"
                   v-if="hasAuthority('01020401')"
                   @click="addshowdg"><i class="iconfont icon-crm_xinzeng-"></i> 新增参数</el-button>
      </div>
      <div class="ctc-table">
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column prop="code"
                           label="参数代码"
                           align="center">
          </el-table-column>
          <el-table-column prop="name"
                           label="参数名称"
                           align="center">
          </el-table-column>
          <el-table-column label="参数值/参数说明"
                           align="center">
            <template slot-scope="scope">
              {{scope.row.value}}/{{scope.row.description}}
            </template>
          </el-table-column>
          <el-table-column prop="parameterStatus"
                           label="参数值状态"
                           :formatter="formatStatus"
                           align="center">
          </el-table-column>
          <el-table-column label="操作"
                           width="160"
                           v-if="hasAuthority('01020402')"
                           align="center">
            <template slot-scope="scope">
              <el-button class="el-button--primary operation-btn"
                         size="mini"
                         @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="ctc-foot1">
        <span><span style="margin-right:10px">{{currentPage}}/{{Math.ceil(total/pgSize)}}页</span> 共{{total}}条记录</span>
        <el-pagination v-if="total > 0"
                       background
                       layout="prev, pager, next"
                       :page-size=pgSize
                       :total="total"
                       :current-page="currentPage"
                       @current-change="current_change">
        </el-pagination>
        <div class="pagingnum">
          显示 <select v-model="pgSize"
                  @change="currentSel">
            <option v-for="item in pgNumoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </option>
          </select>
          条目
        </div>
      </div>
    </div>

    <el-dialog title="新增参数"
               :visible.sync="dialogFormVisible">
      <div class="dl-subtitle">参数名称<span class="required">*</span></div>
      <el-form :model="addform"
               :rules="rules"
               ref="addform">
        <el-form-item prop="parameterCode">
          <el-select v-model="addform.parameterCode"
                     placeholder="请选择"
                     @change="selectName">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.name"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="dl-subtitle">参数代码<span class="required">*</span></div>
        <el-form-item>
          <el-input disabled
                    placeholder="参数代码"
                    v-model="addform.parameterCode">
          </el-input>
        </el-form-item>
        <div class="inlinediv">
          <div class="dl-subtitle">参数值<span class="required">*</span></div>
          <el-form-item prop="parameterValue">
            <el-input v-if="addform.parameterCode === 'CS-11'"
                      placeholder="请输入参数值"
                      type="number"
                      v-model="addform.parameterValue">
            </el-input>
            <el-input v-else
                      placeholder="请输入参数值"
                      v-model="addform.parameterValue"></el-input>
          </el-form-item>
        </div>
        <span><i class="fa fa-paperclip"
             aria-hidden="true"></i></span>
        <div class="inlinediv">
          <div class="dl-subtitle">参数值说明</div>
          <el-form-item>
            <el-input v-model="parameterExplain"></el-input>
            <el-color-picker v-model="parameterExplain"
                             color-format="hex"
                             style="position: absolute;top:0;right:-40px"></el-color-picker>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="addPara('addform')"
                   class="defaultbtn dialog-confirmBtn">确 认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑参数"
               :visible.sync="dialogVisible">
      <div class="dl-subtitle">参数名称<span class="required">*</span></div>
      <el-form :model="editParaObj"
               :rules="rules"
               ref="editform">
        <div class="readonly">{{editParaObj.name}}</div>
        <div class="dl-subtitle">参数代码<span class="required">*</span></div>
        <div class="readonly">{{editParaObj.code}}</div>
        <div class="inlinediv">
          <div class="dl-subtitle">参数值<span class="required">*</span></div>
          <el-form-item prop="value">
            <el-input v-if="editParaObj.code === 'CS-11'"
                      placeholder="请输入参数值"
                      type="number"
                      v-model="editParaObj.value">
            </el-input>
            <el-input v-else
                      placeholder="请输入参数值"
                      v-model="editParaObj.value">
            </el-input>
          </el-form-item>
        </div>
        <span><i class="fa fa-paperclip"
             aria-hidden="true"></i></span>
        <div class="inlinediv"
             style="width: 56%">
          <div class="dl-subtitle">参数值说明</div>
          <el-form-item>
            <el-input v-model="editParaObj.description"></el-input>
            <el-color-picker v-model="editParaObj.description"
                             color-format="hex"
                             style="position: absolute;top:0;right:-40px"></el-color-picker>
          </el-form-item>
        </div>
        <div class="dl-subtitle">参数状态<span class="required">*</span></div>
        <el-form-item>
          <el-select v-model="editParaObj.parameterStatus"
                     placeholder="请选择">
            <el-option v-for="item in paraStatusOptions"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogVisible = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="editPara('editform')"
                   class="defaultbtn dialog-confirmBtn">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
export default {
  name: 'parameter',
  path: '/menu/parameter',
  data () {
    return {
      paraName: '',
      options: [],
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
      paraStatusOptions: [
        {
          value: 'USING',
          name: '启用'
        },
        {
          value: 'DISABLE',
          name: '禁用'
        }
      ],
      state: '',
      tableData: [],
      currentPage: 1,
      total: 0,
      formLabelWidth: '120px',
      dialogFormVisible: false,
      dialogVisible: false,
      rules: {
        parameterCode: [
          { required: true, message: '请选择参数名称', trigger: 'change' }
        ],
        parameterValue: [
          { required: true, message: '请输入参数值', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入参数值', trigger: 'blur' }
        ]
      },
      addform: {
        parameterCode: '',
        parameterValue: ''
      },
      editform: {
        parameterValue: ''
      },
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      date1: '',
      date2: '',
      parameterName: '',
      parameterCode: '',
      parameterValue: '',
      parameterExplain: '',
      parameterState: '',
      pgSize: 15,
      resLength: 0,
      editParaObj: {
        value: ''
      }
    }
  },
  created () {
    this.queryPara()
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    handleEdit (index, row) {
      this.dialogVisible = true
      let id = row.id
      this.queryparamet(id)
    },
    async queryparamet (id) {
      let result = await context.http.get(`/uaa/api/paramet-managements/${id}`)
      this.editParaObj = result.data
    },
    handleDelete (index, row) {
      this.dialogFormVisible = true
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    formatStatus (row, column) {
      return row.parameterStatus === 'USING' ? '启用' : '停用'
    },
    queryPara () {
      this.currentPage = 1
      this.query()
    },
    async query () {
      let result = await context.http.get('/uaa/api/paramet-managements', { page: (this.currentPage - 1), size: this.pgSize, sort: 'desc', name: this.paraName })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      this.resLength = result.data.length
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    async paraGroup () {
      let result = await context.http.get('/uaa/api/paramet-managements/group')
      this.options = result.data
    },
    addshowdg () {
      this.dialogFormVisible = true
      this.paraGroup()
    },
    selectName (selVal) {
      this.addform.parameterValue = ''
      this.addform.parameterCode = selVal
      let obj = {}
      obj = this.options.find((item) => {
        return item.code === selVal
      })
      this.parameterName = obj.name
    },
    async getProjectList () {
      let result = await context.http.get('uaa/api/paramet-managements/name?name=工程条件')
      this.$store.dispatch('projectAction', result.data)
    },
    async addPara (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          context.http.post('/uaa/api/paramet-managements', { name: this.parameterName, code: this.addform.parameterCode, description: this.parameterExplain, value: this.addform.parameterValue }).then(res => {
            if (res.status === 200 || res.status === 201) {
              this.$refs[formName].resetFields()
              this.parameterExplain = ''
              this.dialogFormVisible = false
              this.query()
              this.getProjectList()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async editPara (formName) {
      let editParaObj = this.editParaObj
      this.$refs[formName].validate((valid) => {
        if (valid) {
          context.http.put('/uaa/api/paramet-managements', { id: editParaObj.id, name: editParaObj.name, code: editParaObj.code, description: editParaObj.description, value: editParaObj.value, parameterStatus: editParaObj.parameterStatus }).then(res => {
            if (res.status === 200 || res.status === 201) {
              this.dialogVisible = false
              this.query()
              this.getProjectList() // 如果编辑的是工程条件参数
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
@import "../../../style/config";
.parameter {
  .el-icon-close {
    display: inline-block;
    width: 100%;
    height: 100%;
    background-image: url(../../../assets/color.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .el-icon-close:before {
    content: " ";
  }
  .el-color-picker__color {
    border: none;
    padding: 0;
  }
  .el-color-picker__trigger {
  }
  font-size: 16px;
  background-color: #f9f9f9;
  .ct-content {
    width: 100%;
    margin: 0 auto;
    .ctc-search {
      //   display: flex;
      //   align-items: center;
      //   justify-content: space-between;
      height: 70px;
      line-height: 70px;
      background-color: #fff;
      margin-top: 20px;
      div {
        float: left;
      }
      .pname {
        font-size: 14px;
        margin: 0 10px 0 18px;
      }
      .el-input {
        width: 180px;
        input {
          // height: 32px;
          // line-height: 32px;
        }
      }
      .yubtn {
        width: 200px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        font-size: 14px;
        color: #fff;
        background-color: #5e72e4;
        margin-left: 96px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 22px;
        &:hover {
          background-color: #3349c8;
        }
      }
    }
    .el-button--stop {
      background-color: #7b6b5c;
      color: #fff;
    }
  }
  .el-dialog__header,
  .el-dialog__body {
    border-bottom: 1px solid #e5e5e5;
    margin: 10px 20px;
  }
  .line {
    display: inline-block;
    width: 36px;
    border-bottom: 1px solid #bbbbbd;
    margin-left: 36px;
    margin-right: 6px;
  }
  .el-dialog {
    width: 600px;
  }
  .defaultbtn {
    background-color: #5e72e4 !important;
    border-color: #5e72e4 !important;
  }
  .el-dialog__header,
  .el-dialog__body {
    border-bottom: 1px solid #e5e5e5;
    margin: 10px 40px;
    padding-left: 0;
  }
  .el-dialog__body {
    padding: 10px 0 0 0;
  }
  .el-form-item {
    display: inline-block;
    width: 100%;
    margin-bottom: 18px !important;
  }
  .line {
    display: inline-block;
    width: 36px;
    border-bottom: 1px solid #bbbbbd;
    margin-left: 36px;
  }
  .el-dialog {
    width: 594px;
  }
  .el-form-item__content {
    margin-top: 10px;
  }
  .defaultbtn {
    background-color: #5e72e4 !important;
    border-color: #5e72e4 !important;
  }
  .dl-subtitle {
    font-size: 16px;
  }
  .el-dialog__body {
    color: #000;
  }
  .required {
    color: $color-red-1;
    font-size: 16px;
    position: relative;
    left: 1px;
  }
  .el-select {
    width: 100%;
  }
  .inlinediv {
    display: inline-block;
    &:last-child {
      width: 56%;
    }
  }
  .readonly {
    margin: 10px 0 20px 0;
    color: #666666;
  }
  .el-form i {
    font-size: 20px;
    margin: 0 8px;
  }
}
</style>
