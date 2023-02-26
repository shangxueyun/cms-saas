<template>
  <div class="security">
    <span class="page_head_title">保安保洁</span>
    <ul class="default_tab_block">
      <li v-if="hasAuthority('03070101')"
          @click="roterTo('')"
          :class="tabState === '' ? 'active' : ''">
        <span>排班表</span>
      </li>
      <li v-if="hasAuthority('03070105')"
          @click="roterTo('person')"
          :class="tabState === 'person' ? 'active' : ''">
        <span>人员列表</span>
      </li>
    </ul>
    <div class="pl-content">
      <div class="search-bar">
        <div style="display: flex;flex-wrap: wrap;align-items:center">
          <el-select v-show="tabState === ''"
                     @change="tableList"
                     v-model="projectId"
                     style="width:200px;">
            <el-option v-for="(item,index) in projectManagementsList"
                       :key="index"
                       :label="item.referred"
                       :value="item.id"></el-option>
          </el-select>
          <el-select v-show="tabState === ''"
                     @change="tableList"
                     v-model="securityType"
                     style="width:200px;">
            <el-option label="保安"
                       value="GUARD"></el-option>
            <el-option label="保洁"
                       value="CLEANER"></el-option>
          </el-select>
          <el-date-picker v-show="tabState === ''"
                          style="width:200px;"
                          @change="queryDate"
                          v-model="securityDate"
                          :picker-options="{'firstDayOfWeek': 1}"
                          type="week"
                          format="yyyy 第 WW 周"
                          :clearable="false"
                          value-format="yyyy-MM-dd"
                          placeholder="选择周">
          </el-date-picker>
          <el-select v-show="tabState === 'person'"
                     v-model="projectId"
                     style="width:200px;">
            <el-option v-for="(item,index) in projectManagementsList"
                       :key="index"
                       :label="item.referred"
                       :value="item.id"></el-option>
          </el-select>
          <el-select v-show="tabState === 'person'"
                     v-model="securityType"
                     style="width:200px;">
            <el-option label="保安"
                       value="GUARD"></el-option>
            <el-option label="保洁"
                       value="CLEANER"></el-option>
          </el-select>
          <el-input v-show="tabState === 'person'"
                    v-model="securityName"
                    style="width:200px;"
                    placeholder="姓名"></el-input>
          <el-select v-show="tabState === 'person'"
                     v-model="securityState"
                     style="width:200px">
            <el-option label="全部"
                       value=""></el-option>
            <el-option label="在职"
                       value="ONJOB"></el-option>
            <el-option label="离职"
                       value="RESIGNA"></el-option>
          </el-select>
          <span v-show="tabState === 'person'"
                class="query-btn"
                @click="querySeach">查询</span>
        </div>
        <div v-show="tabState === ''"
             class="btnDiv searbar-left">
          <el-button v-if="hasAuthority('03070103')"
                     class="banciInfo"
                     plain
                     @click="bcDrawer = true">
            <i class="el-icon-date"></i>
            班次信息
          </el-button>
          <el-dropdown v-if="hasAuthority('03070102')"
                       class="imageChangeList">
            <el-button plain
                       style="font-size: 14px!important;">
              <i class="el-icon-folder-add"></i>
              批量操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item style="font-size: 12px"><span @click="upLoadModel">上传文件</span></el-dropdown-item>
              <el-dropdown-item style="font-size: 12px"><span @click="downLoadModel">下载模板</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div v-show="tabState === 'person'"
             class="btnDiv searbar-left">
          <el-dropdown v-if="hasAuthority('03070106')"
                       class="imageChangeList">
            <el-button plain
                       style="font-size: 14px!important;">
              <i class="el-icon-folder-add"></i>
              批量操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item style="position:relative;font-size: 12px">
                上传文件
                <input type="file"
                       @change="uploadChange($event)"
                       style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0;">
              </el-dropdown-item>
              <el-dropdown-item style="font-size: 12px"><span @click="downLoadModel">下载模板</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div v-show="tabState === ''"
           class="plc-table borderTable">
        <el-table :data="tableData1"
                  max-height="630"
                  style="width: 100%">
          <el-table-column width="150"
                           fixed
                           prop="name"
                           label="员工"
                           align="center"></el-table-column>
          <el-table-column :render-header="renderHeader"
                           v-for="item in tableHead"
                           :key="item"
                           align="center"
                           :prop="item">
          </el-table-column>
        </el-table>
      </div>
      <div v-show="tabState === 'person'"
           class="plc-table ">
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column prop="code"
                           label="工号"
                           align="center"></el-table-column>
          <el-table-column prop="projectManagement"
                           label="项目简称"
                           align="center"></el-table-column>
          <el-table-column prop="name"
                           label="姓名"
                           align="center"></el-table-column>
          <el-table-column :formatter="positionFormatter"
                           prop="position"
                           label="岗位名称"
                           align="center"></el-table-column>
          <el-table-column prop="telephone"
                           label="联系方式"
                           align="center"></el-table-column>
          <el-table-column :formatter="jobStatusFormatter"
                           prop="jobStatus"
                           label="在职状态"
                           align="center"></el-table-column>
          <el-table-column :formatter="dateFormatter"
                           prop="updateTime"
                           label="更新时间"
                           align="center"></el-table-column>
          <el-table-column v-if="hasAuthority('03070107')"
                           label="操作"
                           align="center">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.$index, scope.row)"
                         class="el-button--primary operation-btn"
                         size="mini">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="tabState === 'person'"
           class="ctc-foot1">
        <span><span style="margin-right:10px">{{currentPage}}/{{Math.ceil(total/pgSize)}}页</span> 共{{total}}条记录</span>
        <el-pagination v-if="total > 0"
                       background
                       layout="prev, pager, next"
                       :page-size=pgSize
                       :total="total"
                       :current-page.sync="currentPage"
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
    <el-drawer title="查看人员信息"
               :visible.sync="personDrawer"
               direction="rtl"
               class="securityDrawer">
      <personInfo ref="personInfo"
                  :detailsData="detailsData">
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="personDrawer = false"
                     class="close-button">关 闭</el-button>
        </div>
      </personInfo>
    </el-drawer>
    <el-drawer title="班次信息"
               :visible.sync="bcDrawer"
               direction="rtl"
               class="securityDrawer2">
      <bcInfo ref="bcInfo"
              :bcDrawer="bcDrawer"
              :projectManagementsList="projectManagementsList"
              :projectId="projectId"
              :securityType="securityType">
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="bcDrawer = false"
                     class="close-button">关 闭</el-button>
        </div>
      </bcInfo>
    </el-drawer>
    <el-dialog title="上传文件"
               :visible.sync="upLoadPromt"
               class="uploadDialog">
      <el-form :model="upLoadData"
               ref="upLoadData">
        <el-form-item>
          <div class="cttitle">项目简称</div>
          <div>
            <el-select v-model="upLoadData.projectId">
              <el-option v-for="(item,index) in projectManagementsList"
                         :key="index"
                         :label="item.referred"
                         :value="item.id"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="cttitle">岗位名称</div>
          <div>
            <el-select v-model="upLoadData.securityType">
              <el-option label="保安"
                         value="GUARD"></el-option>
              <el-option label="保洁"
                         value="CLEANER"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="cttitle">日期</div>
          <div>
            <el-date-picker v-model="upLoadData.securityDate"
                            type="month"
                            value-format="yyyy-MM"
                            :editable="false"
                            :clearable="false"
                            placeholder="选择月">
            </el-date-picker>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button style="position:relative"
                   type="primary">选择文件<input type="file"
                 @change="uploadChange($event)"
                 style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0;"></el-button>
      </span>
    </el-dialog>
    <el-dialog title="错误提示"
               :visible.sync="errorPrompt">
      <el-table :data="gridData"
                style="min-height: 200px;border-left: 1px solid #eee;border-right: 1px solid #eee;">
        <el-table-column prop="fileName"
                         label="导入文件"
                         align="center"></el-table-column>
        <el-table-column label="导入结果"
                         align="center"
                         width="220px">
          <template slot-scope="scope">
            <span style="color: red">{{scope.row.result}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"
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
import personInfo from './components/personInfo.vue'
import bcInfo from './components/bcInfo.vue'
import moment from 'moment'
export default {
  name: 'security',
  components: {
    personInfo,
    bcInfo
  },
  data () {
    return {
      tableData1: [],
      tableData: [],
      currentPage: 1,
      pgNum: 1,
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
      ],
      tabState: '',
      projectId: '',
      projectManagementsList: [],
      securityType: 'GUARD',
      securityDate: '',
      securityState: 'ONJOB',
      securityName: '',
      gridData: [{
        fileName: '',
        result: '',
        id: ''
      }],
      errorPrompt: false,
      upLoadPromt: false,
      upLoadData: {
        projectId: '',
        securityType: '',
        securityDate: ''
      },
      personDrawer: false,
      bcDrawer: false,
      detailsData: {},
      tableHead: [],
      start: '',
      end: ''
    }
  },
  created () {
    if (!this.hasAuthority('03070101')) this.tabState = 'person'
    this.projectManagementsList = this.$store.state.projectManagementsList
    if (this.projectManagementsList.length > 0) {
      this.projectId = this.projectManagementsList[0].id
    }
    this.securityDate = moment().startOf('week').format('YYYY-MM-DD')
    this.getTableHead()
    this.tableList()
  },
  methods: {
    getTableHead () {
      if (this.securityDate) {
        let table = []
        let current = this.securityDate
        console.log(current)
        let currenWeek = new Date(current).getDay()
        // let pre = new Date(current).getTime() - 24 * 60 * 60 * 1000 * currenWeek
        let pre = new Date(current).getTime()
        for (var i = 0; i < 7; i++) {
          let date = new Date(pre + 24 * 60 * 60 * 1000 * i)
          table.push(moment(date).format('YYYY-MM-DD'))
        }
        this.tableHead = table
      }
    },
    renderHeader (h, para) {
      let index = para.$index - 1
      let weekArr = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      return h('div', [
        h('p', {
          domProps: {
            innerHTML: this.tableHead[index],
            style: 'height:25px;line-height:25px;'
          }
        }),
        h('p', {
          domProps: {
            innerHTML: weekArr[index],
            style: 'height:20px;line-height:20px;color:#959595;font-weight:500;font-size:14px'
          }
        })
      ])
    },
    queryDate (val) {
      this.securityDate = moment(val).subtract(1, 'days').format('YYYY-MM-DD')
      // console.log(this.securityDate, val)
      this.getTableHead()
      this.tableList()
    },
    async handleEdit (index, row) {
      context.http.get(`/cms/api/guardCleaner/${row.id}`).then(res => {
        this.detailsData = res.data
        this.personDrawer = true
      })
    },
    async tableList () {
      this.start = this.tableHead[0]
      this.end = this.tableHead[this.tableHead.length - 1]
      let param = {
        projectId: this.projectId,
        post: this.securityType,
        startDate: this.start,
        endDate: this.end
      }
      let result = await context.http.get('/cms/api/gcplanTable', param)
      this.tableData1 = result.data
    },
    async query () {
      let param = {
        page: (this.currentPage - 1),
        size: this.pgSize,
        projectManagementId: this.projectId,
        position: this.securityType,
        name: this.securityName,
        jobStatus: this.securityState,
        sort: 'lastModifiedDate,desc'
      }
      let result = await context.http.get('/cms/api/guardCleaner', param)
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
    },
    roterTo (state) {
      if (state === this.tabState) return
      state === '' ? this.tableList() : this.query()
      this.tabState = state
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    querySeach () {
      this.currentPage = 1
      this.query()
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    upLoadModel () {
      this.upLoadData.projectId = this.projectId
      this.upLoadData.securityType = this.securityType
      let now = new Date()
      let year = now.getFullYear()
      let month = now.getMonth() + 1
      this.upLoadData.securityDate = year + '-' + month
      console.log(this.upLoadData.securityDate)
      this.upLoadPromt = true
    },
    async uploadChange (event, state) {
      let files = event.target.files
      let form = new FormData()
      form.append('file', files[0])
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
        const loading = this.$loading({
          lock: true,
          text: '导入中',
          spinner: 'el-icon-loading el-import-loading',
          customClass: 'loading-icon',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        if (this.tabState === 'person') {
          context.http.post('/cms/api/guardCleaner/file', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
            event.target.value = ''
            loading.close()
            if (res.data.excelResult) {
              this.$message({
                message: '导入成功！',
                type: 'success'
              })
              this.currentPage = 1
              this.query()
            } else {
              this.errorPrompt = true
              this.gridData = [{
                fileName: res.data.name,
                result: res.data.remark,
                filePath: res.data.url
              }]
            }
          }).catch(error => {
            event.target.value = ''
            loading.close()
            console.info(error)
          })
        } else if (this.tabState === '' && state === 'bcInfo') {
          context.http.post('/cms/api/gcplan/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
            event.target.value = ''
            loading.close()
            if (res.data.result) {
              this.$message({
                message: '导入成功！',
                type: 'success'
              })
              this.$refs.bcInfo.query()
            } else {
              this.errorPrompt = true
              this.gridData = [{
                fileName: res.data.fileName,
                result: res.data.message,
                filePath: res.data.filePath
              }]
            }
          }).catch(error => {
            event.target.value = ''
            loading.close()
            console.info(error)
          })
        } else { // TEST
          if (this.upLoadData.securityDate.length === 6) {
            this.upLoadData.securityDate = this.upLoadData.securityDate.slice(0, 5) + '0' + this.upLoadData.securityDate.slice(-1)
          }
          form.append('dateStr', this.upLoadData.securityDate)
          form.append('post', this.upLoadData.securityType)
          form.append('projectId', this.upLoadData.projectId)
          context.http.post('/cms/api/gcplanTable/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
            event.target.value = ''
            this.upLoadPromt = false
            loading.close()
            if (res.data.result) {
              this.$message({
                message: '导入成功！',
                type: 'success'
              })
              this.tableList()
            } else {
              this.errorPrompt = true
              this.gridData = [{
                fileName: res.data.fileName,
                result: res.data.message,
                filePath: res.data.filePath
              }]
            }
          }).catch(error => {
            event.target.value = ''
            this.upLoadPromt = false
            loading.close()
            console.info(error)
          })
        }
      }
    },
    async downLoadModel1 (index, row) { // 下载错误文件
      context.http.get(`/cms/api/file/getUrl?fileName=${row.filePath}`).then(result => {
        window.open(result.data)
      })
    },
    async downLoadModel (state) { // 下载模板
      const infoTable = state === 'bcInfo' ? 'gcplan' : 'gcplanTable'
      const downLoadUrl = this.tabState === '' ? `/cms/api/${infoTable}/template/down` : '/cms/api/guardCleaner/file'
      axios({ method: 'GET', url: downLoadUrl, responseType: 'blob' }).then(res => {
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
    positionFormatter (row, column) {
      let position
      switch (row.position) {
        case 'GUARD':
          position = '保安'
          break
        case 'CLEANER':
          position = '保洁'
          break
      }
      return position
    },
    jobStatusFormatter (row, column) {
      let jobStatus
      switch (row.jobStatus) {
        case 'ONJOB':
          jobStatus = '在职'
          break
        case 'RESIGNA':
          jobStatus = '离职'
          break
      }
      return jobStatus
    },
    dateFormatter (row, column) {
      return row.updateTime.replace('T', ' ')
    }
  }
}
</script>
<style lang="scss">
.securityDrawer .rtl {
  width: 740px !important;
}
.securityDrawer2 .rtl {
  width: 900px !important;
}
.uploadDialog {
  .el-dialog {
    width: 500px;
  }
  .el-dialog__header {
    padding: 20px 20px 10px 0;
  }
}
.security {
  .export-error {
    display: inline-block;
    width: 90px;
    height: 26px;
    line-height: 24px;
    text-align: center;
    border: 1px solid #3577f6;
    color: #3577f6;
    border-radius: 4px;
    cursor: pointer;
  }
  .borderTable {
    border: 0;
    border-right: 1px solid #ebeef5;
    table {
      border-collapse: collapse;
      tr {
        td,
        th {
          border: 1px solid #ebeef5;
        }
      }
      tr {
        th {
          border-bottom: 0;
          &:nth-child(8) {
            border-right: 0;
          }
          &:nth-child(9) {
            border-left: 0;
          }
        }
      }
    }
    // .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
    //   width: 4px!important;
    //   height: 4px!important;
    //   background-color: rgb(25, 38, 70);
    // }
    // .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-track {
    //   -webkit-box-shadow: inset 0 0 6px #fff;
    //   border-radius: 10px;
    //   background-color: #fff;
    // }
    // .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb {
    //   border-radius: 10px;
    //   -webkit-box-shadow: inset 0 0 6px #3175d2;
    // }
  }
}
</style>
<style lang="scss" scoped>
.security {
  font-size: 16px;
  background-color: #f9f9f9;

  .uploadDialog {
    .el-form {
      margin-top: 16px;
    }
    .el-select {
      width: 100%;
    }
    .el-input {
      width: 100%;
    }
  }
  .banciInfo {
    padding: 8px 15px 8px 6px;
    border: 1px solid #d85988;
    color: #d85988;
    font-size: 14px !important;
    margin-right: 10px;
  }
  .el-button.is-plain:focus,
  .el-button.is-plain:hover {
    border: 1px solid #d85988;
    color: #d85988;
  }
  .imageChangeList {
    .el-button {
      padding: 8px 6px;
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
  .menuTab {
    height: 60px;
    margin-top: 15px;
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 4px 4px 4px 1px #eee;
    > span {
      position: relative;
      display: inline-block;
      width: 120px;
      text-align: center;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
      font-size: 14px;
      &.active {
        color: #3577f6;
        border-bottom: 2px solid #3577f6;
      }
      > span {
        display: block;
        position: absolute;
        top: 20px;
        right: 6px;
        min-width: 16px;
        height: 16px;
        line-height: 16px;
        padding: 0 3px;
        font-weight: normal;
        color: white;
        text-align: center;
        text-shadow: 0 1px rgba(0, 0, 0, 0.2);
        border-radius: 16px;
        background: #cb444a;
        font-size: 12px;
      }
    }
  }

  .pl-content {
    width: 100%;
    margin: 0 auto;
    .searchDiv {
      display: flex;
      margin-top: 15px;
      background-color: #fff;
      padding: 0 20px;
      justify-content: space-between;
      flex-wrap: wrap;
      > div {
        > span {
          display: inline-block;
          width: 110px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          cursor: pointer;
          color: #fff;
          border-radius: 3px;
          margin-left: 30px;
          background-color: #3577f6;
          &:hover {
            background-color: #2a6ef0;
          }
        }
      }
    }
    .plc-table {
      position: relative;
      .el-input__inner {
        padding: 10px;
        height: 30px;
      }
      .el-input__icon {
        line-height: 30px;
      }
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
  .el-dialog {
    width: 900px !important;
    .basicInfo {
      border: 1px solid #f1f1f1;
      margin: 15px 0;
      .bi-title {
        height: 40px;
        background: #fafafa;
        line-height: 40px;
        padding: 0 15px;
        font-size: 14px;
        color: #666666;
      }
    }
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
      padding-left: 20px;
    }
    .el-form-item {
      margin: 10px 0 0 0;
      width: 81%;
      .el-input {
        width: 178px;
      }
      .el-select {
        // width: 100%;
      }
    }
  }
  .dev-img {
    display: inline-block;
    width: 80px;
    height: 80px;
    border: 1px dashed #dfdfdf;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .upload {
    display: inline-block;
    width: 100px;
    vertical-align: top;
    position: relative;
    margin-left: 5px;
    input {
      position: absolute;
      top: 34px;
      left: 0;
      width: 88px;
      height: 34px;
      opacity: 0;
      cursor: pointer;
    }
    .uploadbtn {
      display: inline-block;
      width: 88px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      border: 1px solid #5e72e4;
      border-radius: 8px;
      color: #5e72e4;
      margin: 34px 0 10px 0;
      cursor: pointer;
      .icon-upload {
        background: url(../../../assets/upload.png) no-repeat;
        position: relative;
        top: 2px;
      }
    }
    p {
      font-size: 12px;
    }
  }
  .el-form-item__label {
    width: 80px;
  }
  .el-form-item__error {
    margin-left: 80px;
  }
  .dl-warn {
    .el-dialog {
      .el-dialog__header,
      .el-dialog__body {
        border: none;
      }
      .el-dialog__footer {
        padding-top: 20px;
        .el-button {
          width: 100px;
          height: 30px;
          line-height: 0px;
          &:first-child {
            background-color: #a0a0a0;
            color: #fff;
            border-color: #a0a0a0;
          }
          background-color: #3577f6;
          border-color: #3577f6;
        }
      }
    }
    .dl-content {
      text-align: center;
      img {
        width: 60px;
        height: 60px;
        margin-bottom: 10px;
      }
      p {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
