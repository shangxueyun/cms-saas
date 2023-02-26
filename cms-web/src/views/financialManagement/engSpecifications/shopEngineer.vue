<template>
  <div class="shopEngineer">
    <span class="page_head_title">工程条件</span>
    <ul class="default_tab_block">
      <li @click="changeTab"
          v-if="hasAuthority('02010404')">
        <span>项目工程条件</span>
      </li>
      <li v-if="hasAuthority('02010405')"
          class="active">
        <span>房源工程条件</span>
      </li>
    </ul>
    <div class="seachDiv search-bar">
      <span>
        <el-select v-model="projectManagementId"
                   placeholder="项目"
                   style="width:150px"
                   @change="getBuliding">
          <el-option v-for="item in options1"
                     :key="item.id"
                     :label="item.referred"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="buildingName"
                   clearable
                   style="width:150px"
                   placeholder="楼宇"
                   @change="getFloor">
          <el-option v-for="item in options2"
                     :key="item.id"
                     :label="item.buildingName"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="floorName"
                   clearable
                   style="width:150px"
                   placeholder="层">
          <el-option v-for="item in options3"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-input v-model="queryShopNumber"
                  clearable
                  placeholder="房源号"
                  style="width:150px"></el-input>
        <el-select v-model="useStatus"
                   clearable
                   style="width:150px"
                   placeholder="状态">
          <el-option label="全部"
                     value=""></el-option>
          <el-option label="使用中"
                     value="USING"></el-option>
          <el-option label="已停用"
                     value="DISABLE"></el-option>

        </el-select>
        <div class="index_chaxun_btn"
             @click="pgSizeSelectFn()">查询</div>
      </span>
      <div class="btnDiv">
        <el-button class="tban tban6"
                   @click="downLoadModel()"
                   v-if="hasAuthority('02010407')"><i class="iconfont icon-cms_daochushuju-"></i> 导出数据</el-button>
      </div>
    </div>
    <div class="tips">
      <i class="iconfont icon-cms_ciyaojinggao"></i>
      <span>注意：比如101房源没有空调制冷条件时，请不要输入任何值；有该工程条件但无具体数值时，可输入‘ - ’代替；</span>
    </div>
    <div class="content">
      <el-table :data="tableData"
                style="width: 100%"
                border>
        <el-table-column label="项目简称"
                         width="120"
                         fixed
                         align="center">
          <template slot-scope="scope">
            <div>{{scope.row.projectManagement.referred}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="building.buildingName"
                         fixed
                         show-overflow-tooltip
                         label="楼宇名称"
                         align="center"></el-table-column>
        <el-table-column prop="floor.name"
                         fixed
                         show-overflow-tooltip
                         label="楼层"
                         align="center"></el-table-column>
        <el-table-column prop="shopNumber"
                         fixed
                         label="房源号"
                         show-overflow-tooltip
                         width="120"
                         fit
                         align="center"></el-table-column>
        <el-table-column fixed
                         label="房源状态"
                         align="center"
                         :formatter="userStatusFormat"></el-table-column>
        <el-table-column v-for="(item,index) in header"
                         :key="index"
                         :render-header="labelHead"
                         :label="formatHead(item)"
                         align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.edit">
              <div v-for="(t,i) in scope.row.projectConditions"
                   :key="i">
                <el-input v-if="Number(t.projectType)===Number(item.id)"
                          v-model="t.needValue"
                          size="small"
                          maxlength="20"></el-input>
              </div>
            </span>
            <span v-else
                  :title="formatProjectConditions(scope.row.projectConditions,item.id)">{{formatProjectConditions(scope.row.projectConditions,item.id)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         fixed="right"
                         align="center">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.$index, scope.row)"
                       class="el-button--primary operation-btn"
                       size="mini"
                       v-if="hasAuthority('02010406')&&!scope.row.edit">编辑</el-button>
            <span class="cannel"
                  v-if="scope.row.edit"
                  @click="cannel(scope.$index, scope.row)">取消</span>
            <span class="save"
                  v-if="scope.row.edit"
                  @click="save(scope.$index, scope.row)">保存</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="ctc-foot1"
         v-if="total > 0">
      <span><span style="margin-right:10px">{{currentPage}}/{{Math.ceil(total/pgSize)}}页</span> 共{{total}}条记录</span>
      <el-pagination background
                     layout="prev, pager, next"
                     :page-size="pgSize"
                     :total="total"
                     :current-page.sync="currentPage"
                     @current-change="current_change">
      </el-pagination>
      <div class="pagingnum">
        显示 <select v-model="pgSize"
                @change="pgSizeSelectFn">
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
</template>

<script>
import context from '@/service'
import axios from 'axios'
import { debuglog } from 'util'
export default {
  name: 'shopEngineer',
  data () {
    return {
      spanArr: [],
      position: 0,
      projectManagementId: '',
      buildingName: '',
      floorName: '',
      queryShopNumber: '',
      useStatus: 'USING',
      options1: [],
      options2: [],
      options3: [],
      header: [],
      project: [],
      tableData: [

      ],
      currentPage: 1,
      pgSize: 15,
      total: 0,
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
  watch: {

  },
  created () {
    // this.options1 = this.$store.state.projectManagementsList
    this.getProjectList()
    this.getProjectOptions(true)
  },
  mounted () {
  },
  methods: {
    formatProjectConditions (projectConditions, id) {
      let val = null
      projectConditions.forEach((item, index) => {
        if (Number(item.projectType) === Number(id)) {
          val = item.needValue
          if (item.needValue === '') {
            val = '-'
          }
          return
        }
      })
      return val
    },
    handleEdit (index, row) {
      row.edit = true
      row.projectConditions = row.projectConditions.map((item, index) => {
        if (item.needValue === '') {
          item.needValue = '-'
        }
        return item
      })
    },
    save (index, row) {
      let params = {}
      let projectConditions = row.projectConditions.map((item, index) => {
        // if (item.needValue === '-') {
        //   item.needValue = ''
        // } else
        if (item.needValue && item.needValue.replace(/\s*/g, '') === '') {
          item.needValue = null
        }
        return item
      })
      params.projectConditions = projectConditions
      params.roomId = row.id
      context.http.put('/cms/api/rooms/projectCondition', params).then(res => {
        if (res.status === 200) {
          this.$message.success('保存成功')
          row.edit = false
        }
      })
    },
    cannel (index, row) {
      row.edit = false
      this.query()
    },
    formatHead (item) {
      let html = `${item.value} ${item.description ? '(' : ''}${item.description}${item.description ? ')' : ''}`
      return html
    },
    async query () { // 获取动态表格数据
      context.http.get('/cms/api/rooms/condition?',
        {
          projectManagemantId: this.projectManagementId,
          buildingId: this.buildingName,
          floorId: this.floorName,
          queryShopNumber: this.queryShopNumber,
          useStatus: this.useStatus,
          page: (this.currentPage - 1),
          size: this.pgSize
        }).then(res => {
          let data = res.data.map((item, index) => {
            item.edit = false
            return item
          })
          this.tableData = data
          this.total = Number(res.headers['x-total-count'])
        })
    },
    userStatusFormat (row, column) {
      let text = row.useStatus === 'USING' ? '使用中' : '已停用'
      return text
    },
    pgSizeSelectFn () {
      this.currentPage = 1
      this.query()
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    labelHead: function (h, { column, $index }) {
      let l = column.label.length
      let f = 12
      column.minWidth = f * (l + 2)// 加上一个文字长度
      return h('div', { class: 'table-head', style: { width: '100%' } }, [column.label])
    },
    getProjectList () { // 获取工程条件列表
      context.http.get('uaa/api/paramet-managements/name?name=工程条件').then(res => {
        res.data = res.data.map((item, index) => {
          item.isChecked = false
          item.needValue = null
          return item
        })
        this.header = res.data
      }).catch(error => {
        console.info(error)
      })
    },
    changeTab () {
      this.$router.push({
        name: 'engSpecifications',
        params: {
          projectId: this.projectManagementId
        }
      })
    },
    getProjectOptions (flag) { // 项目
      context.http.get('cms/api/project-managements', { page: 0, size: 100, sort: 'desc', useStatus: 'USING' }).then(res => {
        if (res.status === 200) {
          this.options1 = res.data
          this.projectManagementId = this.$route.params.projectId ? this.$route.params.projectId : this.options1[0].id
          this.getBuliding(flag)
          this.query()
        }
      })
    },
    async getBuliding (flag) { // 楼宇
      let result = await context.http.get('cms/api/buildings/newList?sort=sortNumber,asc&sort=id,asc', { page: 0, size: 100, useStatus: 'USING', projectId: this.projectManagementId })
      if (result.data && result.data.length) {
        this.options2 = result.data
        if (!flag) {
          this.buildingName = this.options2[0].id
          this.getFloor(flag)
        }
      }
    },
    async getFloor (flag) { // 楼层
      if (!this.buildingName) {
        this.options3 = []
        this.floorName = ''
        return
      }
      let result = await context.http.get(`cms/api/floors/building/${this.buildingName}`)
      this.options3 = result.data
      if (this.options3.length > 0) {
        if (!flag) this.floorName = this.options3[0].id
      }
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
    async downLoadModel () {
      axios({
        method: 'GET',
        url: `/cms/api/condition/export?projectManagemantId=${this.projectManagementId}&buildingId=${this.buildingName}&floorId=${this.floorName}&queryShopNumber=${this.queryShopNumber}&useStatus=${this.useStatus}`,
        responseType: 'blob'
      }).then(res => {
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
    }

  }
}
</script>
<style lang="scss">
.shopEngineer {
  .el-table {
    .el-table__body-wrapper {
      // &::-webkit-scrollbar {
      //   width: 4px !important;
      //   height: 4px !important;
      // }
      // &::-webkit-scrollbar-track {
      //   box-shadow: inset 0 0 6px #fff;
      //   background-color: #fff;
      // }
      // &::-webkit-scrollbar-thumb {
      //   border-radius: 10px;
      //   box-shadow: inset 0 0 6px #cccccc;
      // }
    }
  }

  .el-table td,
  .el-table th {
    padding: 0px 0 !important;
  }
  .table-head {
    font-size: 14px !important;
  }
  .el-table .caret-wrapper {
    position: absolute;
    top: 2px;
    right: 0;
  }
  .el-table .cell,
  .el-table th div {
    padding: 0 !important;
  }
  .el-table tr td .cell {
    padding: 2px 2px !important;
    > span {
      width: 100%;
      overflow: hidden;
      display: block;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .el-input__inner {
      text-align: center;
    }
  }
  .el-table .cell,
  .el-table th div,
  .el-table--border td:first-child .cell,
  .el-table--border th:first-child .cell {
    padding-left: 0 !important;
  }
}
</style>
<style  lang="scss" scoped>
.shopEngineer {
  .el-table {
    .save {
      cursor: pointer;
      font-size: 6px;
      color: #3676f6;
    }
    .cannel {
      cursor: pointer;
      font-size: 6px;
      color: #9a9a9a;
    }
  }
  .tips {
    height: 30px;
    line-height: 30px;
    background-color: #fef9ee;
    font-size: 12px;
    color: #ff9634;
    border: 1px solid #ffd0a4;
    margin: 4px 0;
    padding-left: 10px;
  }
  .seachDiv {
    background-color: #fff;
    display: flex;
    align-items: center;
    margin-bottom: 0;
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
