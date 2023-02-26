<template>
  <div class="bcInfo">
    <div class="searchDiv">
      <div>
        <el-select v-model="projectIdBc"
                   style="width:140px;margin-right:10px">
          <el-option v-for="(item,index) in projectManagementsList"
                     :key="index"
                     :label="item.referred"
                     :value="item.id"></el-option>
        </el-select>
        <el-select v-model="securityTypeBc"
                   style="width:140px;margin-right:10px">
          <el-option label="保安"
                     value="GUARD"></el-option>
          <el-option label="保洁"
                     value="CLEANER"></el-option>
        </el-select>
        <el-select v-model="securityStateBc"
                   style="width:140px;margin-right:10px">
          <el-option label="全部"
                     value=""></el-option>
          <el-option label="使用中"
                     value="USING"></el-option>
          <el-option label="已停用"
                     value="DISABLE"></el-option>
        </el-select>
        <el-input v-model="securityNameBc"
                  style="width:140px;margin-right:10px"
                  placeholder="班次名称"></el-input>
        <span style="font-size:14px;"
              @click="querySeach">查询</span>
      </div>
      <div v-if="hasAuthority('03070104')"
           class="btnDiv">
        <el-dropdown class="imageChangeList">
          <el-button plain
                     style="font-size: 14px!important;">
            <i class="el-icon-folder-add"></i>
            批量操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item style="position:relative;font-size: 12px">
              上传文件
              <input type="file"
                     @change="upLoadChange($event)"
                     style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0;">
            </el-dropdown-item>
            <el-dropdown-item style="font-size: 12px"><span @click="downLoadModel">下载模板</span></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="bcContent">
      <div class="plc-table">
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column prop="projectName"
                           label="项目简称"
                           align="center"></el-table-column>
          <el-table-column prop="postName"
                           label="岗位名称"
                           align="center"></el-table-column>
          <el-table-column prop="planName"
                           label="班次名称"
                           align="center"></el-table-column>
          <el-table-column prop="startTime"
                           label="开始时间"
                           align="center"></el-table-column>
          <el-table-column prop="endTime"
                           label="结束时间"
                           align="center"></el-table-column>
          <el-table-column prop="useStatus"
                           label="状态"
                           align="center"></el-table-column>
          <el-table-column width="140"
                           :formatter="dateFormatter"
                           prop="lastModified"
                           label="更新时间"
                           align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <slot name="footer"></slot>
    <el-dialog title="错误提示"
               :visible.sync="errorPrompt">
      <el-table :data="gridData"
                style="min-height: 200px;border-left: 1px solid #eee;border-right: 1px solid #eee;">
        <el-table-column property="fileName"
                         label="导入文件"
                         align="center"></el-table-column>
        <el-table-column label="导入结果"
                         align="center"
                         width="220px">
          <template slot-scope="scope">
            <span style="color: red">{{scope.row.result}}</span>
          </template>
        </el-table-column>
        <el-table-column property="address"
                         label="操作"
                         align="center"
                         width="140px">
          <template slot-scope="scope">
            <span class="export-error"
                  @click="downLoadModel1(scope.$index, scope.row)">导出错误提示</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="errorPrompt = false"
                   class="close-button">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import * as JSOG from 'jsog'
export default {
  props: {
    projectManagementsList: {
      type: Array,
      default: []
    },
    bcDrawer: {
      type: Boolean,
      default: false
    },
    projectId: {
      type: Number,
      default: -1
    },
    securityType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      gridData: [{
        fileName: '',
        result: '',
        id: ''
      }],
      errorPrompt: false,
      projectIdBc: '',
      securityTypeBc: '',
      securityStateBc: 'USING',
      securityNameBc: '',
      tableData: []
    }
  },
  watch: {
    bcDrawer: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.projectIdBc = this.projectId
          this.securityTypeBc = this.securityType
          this.securityStateBc = 'USING'
          this.securityNameBc = ''
          this.query()
        }
      },
      immediate: true
    }
  },
  created () {
  },
  methods: {
    querySeach () {
      this.query()
    },
    async query () {
      let param = {
        projectId: this.projectIdBc,
        post: this.securityTypeBc,
        name: this.securityNameBc,
        useStatus: this.securityStateBc
      }
      let result = await context.http.get('/cms/api/gcplan', param)
      this.tableData = result.data
    },
    upLoadChange (event) {
      this.$parent.$parent.uploadChange(event, 'bcInfo')
    },
    downLoadModel () {
      this.$parent.$parent.downLoadModel('bcInfo')
    },
    dateFormatter (row, column) {
      return row.lastModified.replace('T', ' ')
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    }
  }
}
</script>
<style scope lang="scss">
.bcInfo {
  .bcContent {
    min-height: 600px;
    .plc-table {
      margin-top: 20px;
    }
  }
  .imageChangeList {
    .el-button {
      padding: 10px 6px;
      border: 1px solid #6683bc;
      color: #6683bc;
      .el-icon--right {
        margin-left: 2px;
      }
      .el-icon-folder-add {
        margin-right: 2px;
      }
    }
    .el-button.is-plain:focus,
    .el-button.is-plain:hover {
      border: 1px solid #6683bc;
      color: #6683bc;
    }
  }
  .searchDiv {
    height: 40px;
    display: flex;
    background-color: #fff;
    align-items: center;
    justify-content: space-between;
    > div {
      > span {
        display: inline-block;
        width: 105px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        cursor: pointer;
        color: #fff;
        border-radius: 3px;
        background-color: #3577f6;
        &:hover {
          background-color: #2a6ef0;
        }
      }
    }
  }
  .dialog-footer {
    padding: 20px 0;
    border-top: 1px solid #e5e5e5;
    margin-top: 70px;
    text-align: right;
  }
  .person-card {
    width: 100%;
    border: 1px solid #e7e7e7;
    margin-bottom: 16px;
    .dr-head {
      background-color: #fafafa;
      height: 40px;
      line-height: 40px;
      padding-left: 12px;
      font-size: 14px !important;
      color: #333333 !important;
      margin-bottom: 24px;
    }
    .form-item {
      display: inline-block;
      width: 29%;
      margin-left: 16px;
      margin-right: 10px;
      margin-bottom: 24px;
      &:nth-of-type(3n) {
        margin-right: 0;
      }
    }
  }
}
</style>
