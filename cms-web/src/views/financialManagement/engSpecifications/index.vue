<template>
  <div class="engSpecifications">
    <span class="page_head_title">工程条件</span>
    <ul class="default_tab_block">
      <li class="active"
          v-if="hasAuthority('02010404')">
        <span>项目工程条件</span>
      </li>
      <li @click="changeTab"
          v-if="hasAuthority('02010405')">
        <span>房源工程条件</span>
      </li>
    </ul>
    <div class="seachDiv search-bar">
      <div>
        <span>
          <el-select v-model="projectManagementId"
                     placeholder="项目"
                     style="width:220px"
                     @change="getTableList">
            <el-option v-for="item in options2"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
        </span>
        <div class="btnDiv">
          <el-button class="tban tban2"
                     @click="downLoadModel('template')"
                     v-if="hasAuthority('02010401')"><i class="iconfont icon-xiazai1"></i> 下载模版</el-button>
          <el-button class="tban tban5"
                     v-if="hasAuthority('02010402')"><i class="iconfont icon-cms_daorushuju-"></i> 导入数据
            <input type="file"
                   @change="imageChange('addapp', $event)">
          </el-button>
          <el-button class="tban tban6"
                     @click="downLoadModel('id')"
                     v-if="hasAuthority('02010403')"><i class="iconfont icon-cms_daochushuju-"></i> 导出数据</el-button>
        </div>
      </div>
    </div>
    <div class="content">
      <el-table :data="tableData"
                :span-method="objectSpanMethod"
                border
                style="width: 100%;">
        <el-table-column v-for="(item,index) in header"
                         :key="index"
                         :label="item"
                         align="center">
          <template slot-scope="scope">
            {{tableData[scope.$index][index]}}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import context from '@/service'
import axios from 'axios'
import { debuglog } from 'util'
export default {
  name: 'engSpecifications',
  data () {
    return {
      spanArr: [],
      position: 0,
      projectManagementId: '',
      options2: [],
      header: [],
      tableData: []
    }
  },
  watch: {

  },
  created () {
    // this.options2 = this.$store.state.projectManagementsList
    // this.projectManagementId = this.options2[0].id
    this.getProjectOptions()
  },
  mounted () {
  },
  methods: {
    changeTab () {
      this.$router.push({
        name: 'shopEngineer',
        params: {
          projectId: this.projectManagementId
        }
      })
    },
    getProjectOptions () {
      context.http.get('cms/api/project-managements', { page: 0, size: 100, sort: 'desc', useStatus: 'USING' }).then(res => {
        if (res.status === 200) {
          this.options2 = res.data
          this.projectManagementId = this.options2[0].id
          this.getTableList()
        }
      })
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    rowspan () {
      this.tableData.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1)
          this.position = 0
        } else {
          if (this.tableData[index][0] === this.tableData[index - 1][0]) {
            this.spanArr[this.position] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.position = index
          }
        }
      })
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      // console.log('objectSpanMethod')
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    async downLoadModel (type) {
      let url = ''
      if (type === 'template') {
        url = '/cms/api/condition/template'
      } else {
        url = `/cms/api/condition/export/${this.projectManagementId}`
      }
      axios({ method: 'GET', url: url, responseType: 'blob' }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
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
    imageChange (state, event) {
      let files = event.target.files
      let form = new FormData()
      form.append('file', files[0])
      form.append('projectId', this.projectManagementId)
      let name = files[0].name
      let index = name.lastIndexOf('.')
      let type = name.substr(index + 1).toLowerCase()
      if (files[0].size > (1024 * 1024 * 20)) {
        this.$message({
          message: '文件大小不能超过20M',
          type: 'error'
        })
        return
      }
      if (index > 0 && type !== 'xlsx' && type !== 'xls') {
        this.$message({
          message: '格式错误，请上传xlsx、xls格式文件',
          type: 'error'
        })
      } else {
        context.http.post('/cms/api/condition/import', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          this.getTableList()
          this.$message({
            message: '导入成功！',
            type: 'success'
          })
          event.target.value = ''
        }).catch(error => {
          event.target.value = ''
          console.info(error)
        })
      }
    },
    async getTableList () { // 获取动态表格数据
      let result = await context.http.get(`/cms/api/condition/table/${this.projectManagementId}`)
      this.header = result.data[0]
      result.data.shift()
      this.tableData = result.data
      this.spanArr = []
      this.rowspan()
      this.tableKey++
    }
  }
}
</script>

<style  lang="scss" scoped>
.engSpecifications {
  .seachDiv {
    background-color: #fff;
    display: flex;
    align-items: center;
    > div {
      display: inline-flex;
    }
    .btnDiv {
      margin-left: 10px;
      display: flex;
      align-items: center;
      span {
        display: inline-block;
        width: 110px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        color: #ffffff;
        background-color: #8bcb3d;
        margin-right: 10px;
        cursor: pointer;
        border-radius: 2px;
        &:nth-child(1) {
          background-color: #3577f6;
        }
        &:nth-child(2) {
          position: relative;
          input {
            position: absolute;
            right: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
          }
        }
      }
      .tban2 {
        padding: 0px 16px;
      }
      .tban5 {
        width: 110px;
        position: relative;
        input {
          position: absolute;
          right: 0;
          top: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
      }
    }

    .item {
      display: flex;
      align-items: center;
      > div {
        display: flex;
        flex-direction: column;
        margin-right: 20px;
        > span {
          margin-bottom: 10px;
        }
      }
      .addBtn {
        float: right !important;
        width: 130px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        font-size: 14px;
        color: #fff;
        background-color: #65ac69;
        border-radius: 4px;
        cursor: pointer;
      }
      .seachBtn {
        width: 120px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        font-size: 14px;
        color: #fff;
        background-color: #3175d2;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }
}
</style>
