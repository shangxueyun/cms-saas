<template>
  <div class="operationalAudit">
    <span class="page_head_title">操作审计</span>
    <div class="search-bar">
      <div>
        <el-date-picker
          size="small"
          :clearable="false"
          v-model="dateValue"
          class="datePickerRadius"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
        <el-select clearable style="width:200px" v-model="userId" filterable placeholder="请选择姓名">
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <div class="query-btn"
             @click="queryUsersbtn"
             style="margin-top:0">查询</div>
      </div>
    </div>
    <div class="ct-content">
      <div class="ctc-table">
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column :formatter="timeFormatter"
                           label="时间"
                           align="center"
                           width="200">
          </el-table-column>
          <el-table-column :formatter="nameFormatter"
                           label="姓名"
                           align="center"
                           width="200">
                           <template slot-scope="scope">
                            <span>{{nameFormatter(scope.row)}}</span>
                          </template>
          </el-table-column>
          <el-table-column :formatter="operationFormatter"
                           label="操作"
                           align="center"
                           width="200">
          </el-table-column>
          <el-table-column prop="_source.level"
                           label="等级"
                           align="center"
                           width="200">
          </el-table-column>
          <el-table-column :formatter="messageFormatter"
                           label="详情"
                           align="center">
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
  </div>
</template>
<script>
import context from '@/service'
import moment from 'moment'
export default {
  name: 'operationalAudit',
  data () {
    return {
      userId: '',
      dateValue: [new Date(new Date().getTime() - 30 * 60 * 1000), new Date()],
      tableData: [],
      userList: [],
      currentPage: 1,
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
      pickerOptions: {
        shortcuts: [{
          text: '最近半个小时',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 30 * 60 * 1000)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个小时',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 60 * 60 * 1000)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个小时',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3 * 60 * 60 * 1000)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created () {
  },
  mounted () {
    this.getUser()
    this.queryUsers()
  },
  methods: {
    async getUser () {
      let result = await context.http.get('uaa/api/users/all/allStatus')
      this.userList = result.data
    },
    async queryUsers () {
      const tenantKey = localStorage.getItem('tenantKey')
      let [start, end] = []
      if (this.dateValue && this.dateValue.length) {
        [start, end] = this.dateValue
        start = start.getTime()
        end = end.getTime()
      } else {
        [start, end] = ['', '']
      }
      const userId = this.userId
      const INDEX = window.location.href.includes('192.168') || window.location.href.includes('localhost') ? 'syslog-saas-*' : 'syslog-prodsaas-*'
      const paramsObjN1 = {
        'index': [INDEX],
        'ignore_unavailable': true,
        'preference': 1598007615840
      }
      const paramsObjN2 = {
        'version': true,
        'size': this.pgSize,
        'from': this.currentPage - 1,
        'sort': [{
          '@timestamp': {
            'order': 'desc',
            'unmapped_type': 'boolean'
          }
        }],
        '_source': {
          'includes': ['message', 'app_name', 'level', '@timestamp']
        },
        'aggs': {
          '2': {
            'date_histogram': {
              'field': '@timestamp',
              'interval': '30m',
              'time_zone': 'Asia/Shanghai',
              'min_doc_count': 1
            }
          }
        },
        'stored_fields': ['*'],
        'query': {
          'bool': {
            'must': [{
              'query_string': {
                'analyze_wildcard': true,
                'default_field': '*',
                'query': '*'
              }
            }, {
              'match_phrase': {
                'message': {
                  'query': '"direction":"enter"'
                }
              }
            }, {
              'match_phrase': {
                'message': {
                  'query': `"tenantKey":${tenantKey}`
                }
              }
            }, {
              'match_phrase': {
                'message': {
                  'query': `"userId":${userId}`
                }
              }
            }, {
              'range': {
                '@timestamp': {
                  'gte': start,
                  'lte': end,
                  'format': 'epoch_millis'
                }
              }
            }]
          }
        }
      }
      const params = `${JSON.stringify(paramsObjN1)}\n${JSON.stringify(paramsObjN2)}\n`
      let result = await context.http.post('/elasticsearch/_msearch', params)
      this.tableData = result.data.responses[0].hits.hits
      this.total = result.data.responses[0].hits.total
    },
    queryUsersbtn () {
      this.currentPage = 1
      this.queryUsers()
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.queryUsers()
    },
    currentSel () {
      this.currentPage = 1
      this.queryUsers()
    },
    timeFormatter (row) {
      if (row._source) {
        let date = new Date(row._source['@timestamp'])
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    operationFormatter (row) {
      if (row._source) {
        return JSON.parse(row._source.message).operation
      }
    },
    nameFormatter (row) {
      if (row._source) {
        const userId = JSON.parse(row._source.message).userId
        const user = this.userList.filter(item => Number(item.id) === Number(userId))
        const name = user.length ? user[0].name : ''
        return name
      }
    },
    messageFormatter (row) {
      if (row._source) {
        return JSON.parse(row._source.message).msg
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import "../../../style/config";
.operationalAudit {
  font-size: 16px;
  background-color: #f9f9f9;
  .seachDiv {
    height: 80px;
    background-color: #ffffff;
    margin-top: 15px;
    border-radius: 5px;
    box-shadow: 4px 4px 4px 1px #eee;
    display: flex;
    align-items: center;
    padding-left: 20px;
    justify-content: space-between;
    > span {
      margin-right: 40px;
      display: flex;
      align-items: center;
      > div {
        margin-right: 20px;
      }
    }
  }
  .fa-pencil-square-o {
    background: url(../../../assets/edit.png) no-repeat;
    background-size: contain;
  }
  .addbtn {
    margin-top: 0;
    i {
      display: inline-block;
      width: 16px;
      height: 16px;
      font-size: 20px;
      margin-right: 6px;
      vertical-align: middle;
      background: url(../../../assets/editwhite.png) no-repeat;
      background-size: contain;
    }
  }
  .search-bar{
    >div{
      display: flex;
      .datePickerRadius{
        width:380px;
        
      }
    }
  }
  .ct-content {
    .ctc-search {
      height: 88px;
      background-color: #fff;
      margin-top: 20px;
      div {
        float: left;
      }
      .cs-smalldiv {
        font-size: 18px;
        margin: 30px 10px 0 18px;
      }
      .el-input {
        width: 15%;
        margin-top: 22px;
      }
      .el-select {
        width: 15%;
        .el-input {
          width: 100%;
        }
      }
      .yubtn {
        width: 196px;
        height: 46px;
        line-height: 46px;
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
    .openbtn {
      background-color: #65ac69 !important;
      border-color: #65ac69 !important;
      &:hover {
        background-color: #00954d !important;
        border-color: #00954d !important;
      }
    }
    .el-button--stop {
      background-color: #fff;
      color: #ac8959;
      border: 1px solid #ac8959;
      &:hover {
        background-color: #ac8959;
        color: #fff;
      }
    }
  }
  .drawer {
    .el-dialog__body {
      height: 85%;
    }
    .drawer-content {
      width: 848px;
      height: 94%;
      -moz-box-shadow: 0 0 10px #e5e5e5;
      -webkit-box-shadow: 0 0 10px #e5e5e5;
      box-shadow: 0 0 10px #e5e5e5;
      .drawer-title {
        height: 50px;
        line-height: 50px;
        margin-left: 20px;
        font-size: 16px;
        font-weight: bold;
      }
      .permission-list {
        height: 100%;
        .pl-left {
          width: 20%;
          height: 94%;
          border-right: 1px solid #eee;
          p {
            height: 7%;
            background-color: #3577f6;
            color: #fff;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            border-bottom: 1px solid #eee;
            cursor: pointer;
          }
        }
        .pl-right {
          width: 78%;
          height: 94%;
          padding-top: 26px;
          .plr-item:nth-of-type(2) {
            margin-top: 40px;
          }
        }
      }
      .permission-role {
        height: 60%;
        margin: 40px 20px 0 20px;
        p {
          margin-bottom: 20px;
        }
        .el-select {
          width: 100%;
        }
        .pr-bottom {
          margin-top: 25%;
          p {
            margin-bottom: 10px;
          }
          p:last-child {
            color: #898989;
          }
        }
      }
    }
    .checkAll {
      font-size: 16px;
      .el-checkbox__label {
        font-size: 16px;
      }
    }
  }
  .createaccount {
    .el-dialog {
      width: 80%;
      .el-form-item {
        width: 22%;
        display: inline-block;
        margin-right: 33px;
        &:nth-of-type(4n) {
          margin-right: 0;
        }
      }
    }
  }
  .el-cascader {
    width: 100%;
    font-size: 12px;
  }
  .el-dialog__header,
  .el-dialog__body {
    border-bottom: 1px solid #e5e5e5;
    margin: 0 35px;
    padding-left: 0;
    padding-right: 0;
    padding-top: 20px;
  }
  .line {
    display: inline-block;
    width: 36px;
    border-bottom: 1px solid #bbbbbd;
    margin-left: 70px;
    margin-right: 36px;
  }
  .el-dialog {
    width: 700px;
  }
  .el-form-item__content {
    // margin-left: 15px!important;
    .el-input {
      font-size: 12px;
      width: 100%;
    }
  }
  .defaultbtn {
    background-color: #3577f6 !important;
    border-color: #3577f6 !important;
    color: #fff;
    &:hover {
      background-color: #3577f6 !important;
      border-color: #3577f6 !important;
    }
  }
  .el-dialog__header {
    padding-left: 0;
  }
  .required {
    vertical-align: middle;
  }
  .newly {
    .province .el-form-item__content {
      margin-left: 8px !important;
    }
    .el-dialog {
      width: 1029px;
      margin-top: 2vh !important;
    }
    .dl-head {
      display: flex;
      justify-content: space-between;
    }
    .step {
      display: inline-block;
      width: 218px;
      height: 50px;
      line-height: 50px;
      padding-left: 14px;
      font-size: 16px;
      background-color: #f9f9f9;
      color: #777;
      border-radius: 6px;
    }
    .stepActive {
      color: #fff;
      background-color: #5e72e4;
    }
    .stepActivePast {
      color: #fff;
      background-color: #b1bbf1;
    }
    .formdiv {
      border: 1px solid #e7e7e7;
      margin-top: 15px;
    }
    .fd-head {
      background-color: #fafafa;
      height: 40px;
      line-height: 40px;
      padding-left: 12px;
      font-size: 16px;
      margin-bottom: 24px;
    }
    .inlinediv {
      display: inline-block;
      margin-right: 20px;
      height: 91px;
      vertical-align: bottom;
      .dl-subtitle {
        margin-left: 14px;
        font-size: 14px;
        margin-bottom: 8px;
      }
      .el-select {
        width: 100%;
      }
    }
    .longdiv {
      width: 46%;
      .el-form-item {
        width: 100%;
        .el-form-item__content {
          width: 100%;
          .el-select {
            width: 100%;
          }
        }
      }
    }
    .dateline {
      display: inline-block;
      width: 10px;
      border-bottom: 1px solid #bbbbbd;
      position: relative;
      left: 7px;
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 200px;
    }
    .el-form-item__content {
      margin-left: 0;
    }
    .step2 {
      .el-textarea {
        width: 96%;
        font-size: 12px;
      }
    }
    .op-result {
      width: 100%;
      height: 106px;
      line-height: 106px;
      border: 1px solid #62be40;
      color: #62be40;
      margin-top: 18px;
      background-color: #e2fed8;
      img {
        vertical-align: middle;
        margin-left: 22px;
      }
      span {
        margin-left: 20px;
        font-size: 20px;
      }
    }
    .op-fail {
      border: 1px solid #fd2f14;
      color: #fd2f14;
    }
  }
  .see {
    .el-tabs__item {
      width: 160px !important;
      text-align: center;
    }
    .editbtnwarp {
      display: flex;
      justify-content: flex-end;
    }
    .operationtips {
      font-size: 12px;
      padding-top: 10px;
      text-align: left;
      float: left;
    }
    .read-only {
      height: 40px;
      line-height: 40px;
      width: 200px;
      margin-left: 15px;
    }
    .step4 {
      p {
        padding: 10px;
      }
    }
  }
  .el-form-item.is-success .el-input__inner,
  .el-form-item.is-success .el-input__inner:focus,
  .el-form-item.is-success .el-textarea__inner,
  .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #c0c4cc;
  }
  .el-select {
    width: 100%;
  }
  .accountinfo {
    .el-dialog {
      width: 800px;
    }
    .accountinfo-content {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 35px;
      .acleft {
        margin-right: 40px;
        text-align: center;
        .achead {
          border: 1px solid #dadada;
          width: 100px;
          height: 100px;
          margin: 20px 0;
          border-radius: 50%;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .default-hportrait {
          background-color: #409eff;
          line-height: 90px;
          text-align: center;
          color: #fff;
          font-size: 24px;
        }
      }
      div {
        .ac-title {
          font-size: 16px;
          margin: 30px 0 4px 0;
          color: #333;
        }
        .ac-content {
          font-size: 14px;
          color: #666;
          min-height: 30px;
        }
        .input {
          border: 1px solid #dcdfe6;
          border-radius: 3px;
          height: 30px;
        }
      }
    }
  }
  .resdialog {
    .el-dialog__header,
    .el-dialog__body {
      border-bottom: none;
    }
    .el-dialog {
      width: 500px;
      height: 300px;
      border-radius: 8px;
    }
    .success-icon {
      text-align: center;
    }
    .rescontent {
      text-align: center;
      margin-top: 20px;
      h3 {
        color: #333;
      }
      p {
        font-size: 14px;
        margin: 20px 0;
      }
      span {
        display: inline-block;
        width: 140px;
        height: 40px;
        line-height: 40px;
        background-color: #3577f6;
        color: #fff;
        border-radius: 4px;
        margin-bottom: 10px;
        cursor: pointer;
      }
    }
  }
}
</style>
