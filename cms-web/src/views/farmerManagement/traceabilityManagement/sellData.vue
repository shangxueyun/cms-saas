<template>
  <div class="sellData">
    <span class="page_head_title">溯源管理</span>
    <ul class="default_tab_block">
      <li v-if="hasAuthority('02050405')"
          @click="switchover('warehousing')">
        <span>入库信息上报</span>
      </li>
      <li v-if="hasAuthority('02050406')"
          class="active">
        <span>销售数据上报</span>
      </li>
      <li v-if="hasAuthority('02050407')"
          @click="switchover('traceabilitySet')">
        <span>溯源配置</span>
      </li>
      <li v-if="hasAuthority('02050404')"
          @click="switchover('SupplierManagement')">
        <span>供应商管理</span>
      </li>
    </ul>
    <div class="pl-content">
      <div class="search-bar bill_search_new">
        <div style="display:flex;align-items:center;flex-wrap: wrap;">
          <el-select v-model="projectManagementId"
                     placeholder="选择项目"
                     @change="changeprojectManagementId"
                     style="width:200px;">
            <el-option v-for="item in options1"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
                     <!-- @change="projectChange" -->
          <el-select v-model="tenantId"
                     clearable
                     style="width:200px;"
                     filterable
                     @focus='projectChange'
                     size="small"
                     placeholder="输入品牌名称搜索">
            <el-option v-for="item in tenantOption"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id" />
          </el-select>
          <el-input placeholder="商品名称"
                    v-model="name"
                    style="width:150px"></el-input>
          <!-- <el-date-picker v-model="timeArr"
                          type="daterange"
                          style="width:260px;margin-right:10px;padding: 0 15px;"
                          range-separator="-"
                          value-format="yyyy-MM-dd"
                          @change="timeChange"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker> -->
          <el-date-picker type="date"
                          class="screen"
                          value-format="yyyy-MM-dd"
                          v-model="startDate"
                          clearable
                          :editable="false"
                          placeholder="开始日期"
                          style="margin-right:0;width:150px">
            <!-- :default-value="defaultDayBefore" -->
          </el-date-picker>
          <span style="color: #dadada;padding: 0 4px;">—</span>
          <el-date-picker type="date"
                          class="screen"
                          :editable="false"
                          clearable
                          value-format="yyyy-MM-dd"
                          v-model="endDate"
                          style="width:150px"
                          placeholder="结束日期">
            <!-- :default-value="defaultDayAfter" -->
          </el-date-picker>
          <el-select v-model="tracedStatus"
                     clearable
                     style="width:200px;"
                     placeholder="上传状态">
            <el-option v-for="item in options2"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <div class="query-btn"
               @click="querySearch">查询</div>
          <!-- <el-button class="query-btn" style="padding-top: 0px;"
                     :disabled='queryBtn' 
                      @click="querySearch"
                     type="primary">查询</el-button> -->
        </div>
        <div style="display:flex;align-items:center">
          <el-button style="margin-right:10px;"
                     class="tban tban5"
                     @click="updateFn"><i class="iconfont icon-cms_shangchuan-"></i> 上传至追溯平台</el-button>
        </div>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  class="bill_table"
                  style="width: 100%"
                  :row-key="getRowKeys"
                  @selection-change="handleSelectionChange"
                  ref="multipleTable">
          <el-table-column type="selection"
                           :reserve-selection="true"
                           width="50"></el-table-column>
          <el-table-column prop="tenantGoods.projectManagementName"
                           label="项目简称"
                           align="center"></el-table-column>
          <el-table-column prop="tenantGoods.tenantName"
                           label="品牌名称"
                           align="center"></el-table-column>
          <el-table-column prop="tenantGoods.name"
                           label="商品名称"
                           align="center"></el-table-column>
          <el-table-column :formatter="numberFormat"
                           label="出库数量"
                           align="center"></el-table-column>
          <el-table-column :formatter="formatterRecordDate"
                           label="出库时间"
                           align="center"></el-table-column>
          <el-table-column prop="userName"
                           label="操作人"
                           align="center"></el-table-column>
          <el-table-column :formatter="formatterRecordType"
                           label="上传状态"
                           align="center"></el-table-column>
        </el-table>
      </div>
      <div class="ctc-foot1"
           v-if="total > 0">
        <span><span style="margin-right:10px">{{currentPage}}/{{Math.ceil(total/pgSize)}}页</span> 共{{total}}条记录</span>
        <el-pagination v-if="total > 0"
                       background
                       layout="prev, pager, next"
                       :page-size="pgSize"
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
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import { toLocaleString, toLocaleFixed } from '@/utils/validate.js'
import * as JSOG from 'jsog'
import moment from 'moment'
export default {
  name: 'billList',
  components: {

  },
  data () {
    return {
      startDate: '',
      endDate: '',
      bindIds: [],
      getRowKeys (row) {
        return row.id
      },
      tenantId: '',
      tenantOption: [],
      projectManagementId: '',
      name: '',
      options1: [],
      options2: [{ value: 'NOT_UPLOAD', label: '未上传' }, { value: 'SUCCESS', label: '成功' }, { value: 'FAIL', label: '失败' }],
      tracedStatus: 'NOT_UPLOAD',
      timeArr: [new Date(), new Date()],
      referred: '',
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
      ]
    }
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
    this.projectManagementId = this.$route.params.projectManagementId ? this.$route.params.projectManagementId : this.options1[0].id
    // this.projectChange(this.projectManagementId)
    this.startDate = moment().format('YYYY-MM-DD')
    this.endDate = moment().format('YYYY-MM-DD')
    this.query()
  },
  mounted () {

  },
  methods: {
    changeprojectManagementId () {
      this.tenantId = ''
      this.tenantOption = []
    },
    async query (type, index) {
      if (index) this.currentPage = index
      let result = await context.http.get('gos/api/stockRecords/traced', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        tenantId: this.tenantId,
        shopName: this.name,
        projectManagementId: this.projectManagementId,
        startDate: this.startDate ? this.startDate + 'T00:00:00' : '',
        endDate: this.endDate ? this.endDate + 'T23:59:59' : '',
        tracedStatus: this.tracedStatus,
        recordType: 'ORDER_OUT',
        sort: 'recordDate,desc'
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
    },
    async projectChange (id) {
      this.tenantId = ''
      if (!id) {
        this.tenantOption = []
        return
      }
      let result = await context.http.get('/cms/api/tenant', {
        // page: (this.pager.currentPage - 1),
        size: 9999,
        // sort: 'id,desc',
        id: this.projectManagementId,
        tenantContractStatus: 'IN_THE_CONTRACT',
        useStatus: 'USING'
      })
      this.tenantOption = result.data.content
    },
    timeChange (time) {
      if (time) {
        this.startDate = time[0]
        this.endDate = time[1]
      } else {
        this.startDate = ''
        this.endDate = ''
      }
    },
    numberFormat (row, column) {
      return Math.abs(row.number) + row.tenantGoods.unitName
    },
    formatterRecordDate (row, column) {
      return row.recordDate.replace('T', '  ')
    },
    formatterRecordType (row, column) {
      if (row.tracedStatus === 'NOT_UPLOAD') {
        return '未上传'
      } else if (row.tracedStatus === 'SUCCESS') {
        return '成功'
      } else if (row.tracedStatus === 'FAIL') {
        return '失败'
      }
    },
    updateFn () { // 上传至追溯平台
      if (!this.bindIds.length) {
        this.$message.error('请选择要上报的销售数据')
        return
      }
      let ids = this.bindIds.toString()
      const tip = this.$message({
        message: ' 数据上传中，请耐心等待',
        type: 'warning',
        duration: 10000
      })
      context.http.get(`/gos/api/stockRecords/uploadTraced?id=${ids}`).then(res => {
        tip.close()
        this.$refs.multipleTable.clearSelection()
        if (res.status === 200) {
          this.$message({
            message: res.data,
            type: 'warning'
          })
          this.querySearch()
        }
      }).catch(error => {
        console.info(error)
        tip.close()
        this.$message.error('系统正在处理，请耐心等待')
      })
    },
    handleSelectionChange (val) {
      // let arr = []
      // val.forEach(item => {
      //   arr.push(item.id)
      // })
      // this.bindIds = arr
      this.bindIds = val.map((item, index) => {
        return item.id
      })
    },
    querySearch () {
      this.currentPage = 1
      this.query()
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    switchover (name) {
      this.$router.push({ name: name, params: { projectManagementId: this.projectManagementId } })
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    }
  }
}
</script>
<style lang="scss">
.el-select {
  &.dateType {
    .el-input__inner {
      padding: 0 25px 0 5px;
      background-color: #f5f7fa;
      color: #909399;
    }
  }
}
.bill_search_new {
  .el-date-editor .el-range__icon,
  .el-range-separator {
    line-height: 26px !important;
  }
  .el-dropdown {
    display: block;
  }
  .el-cascader {
    width: 180px;
    height: 32px;
    line-height: 32px;
    margin-right: 10px;
    .el-cascader__tags {
      flex-wrap: nowrap;
      .el-tag:first-child > span {
        width: 60px;
      }
    }
    .el-input__inner {
      height: 32px !important;
    }
  }
}
.bill_table .cell {
  padding: 0 2px !important;
  .el-checkbox {
    margin-left: 5px;
  }
}
</style>
<style lang="scss" scoped>
.sellData {
  font-size: 14px;
  background-color: #f9f9f9;

  .pl-content {
    width: 100%;
    margin: 0 auto;
    .search-bar {
      .morebtn {
        border-radius: 4px;
        background-color: #65ac69;
        color: #f3af2c;
        height: 32px;
        width: 100px;
        line-height: 32px;
        font-size: 14px;
        color: #fff;
        margin-left: 10px;
        .icon-daochu {
          display: inline-block;
          width: 16px;
          height: 16px;
          // background: url(../../../../assets/add.png) no-repeat;
          background-size: contain;
          vertical-align: middle;
          margin-right: 4px;
          margin-left: 6px;
        }
      }
      .morebtn1 {
        border: 1px solid #f3af2c;
        color: #f3af2c;
        height: 30px;
        width: 105px;
        margin-left: 10px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        .icon-daochu {
          display: block;
          width: 16px;
          height: 16px;
          margin-right: 4px;
          // background: url(../../../../assets/daochu1.png) no-repeat;
          background-size: contain;
          margin-right: 4px;
        }
        span {
          display: block;
          line-height: 30px;
        }
        .el-icon-caret-bottom {
          display: block;
          width: 16px;
          height: 30px;
          line-height: 30px;
          font-size: 18px;
          margin-left: 2px;
        }
      }
      .addbtn {
        margin: 0;
        margin-left: 24px;
        float: left;
        margin-top: 15px;
      }
      .createOrder {
        background-color: #169bd5;
        &:hover {
          background-color: #31b4ee;
        }
      }
      .split {
        color: #dcdfe6;
        display: block;
        width: 20px;
        height: 40px;
        line-height: 40px;
        float: left;
        text-align: center;
        margin-top: 15px;
      }
      .el-select,
      .el-input {
        width: 140px;
      }
      .dateType {
        width: 88px !important;
        margin-right: -10px;
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
      position: relative;
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
      margin-top: 10px;
      position: relative;
      .export {
        position: absolute;
        right: 0px;
        top: 5px;
        z-index: 9;
        span {
          display: inline-block;
          width: 60px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          /*background: rgba(222, 235, 254, 1);
            color: #5b9af8;
            opacity:0.9;
            border-radius:4px;*/
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
    .hourse_tab {
      height: 60px;
      display: flex;
      background-color: #fff;
      margin: 10px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      justify-content: space-between;
      align-items: center;
      padding-right: 44px;
      border-bottom: 1px solid #ecedef;
      .nav {
        display: flex;
        li {
          width: 160px;
          text-align: center;
          font-size: 14px;
          color: #666;
          height: 58px;
          line-height: 58px;
          border-bottom: 2px solid #fff;
          cursor: pointer;
          &.select_active {
            border-bottom: 2px solid #3175d2;
            color: #3175d2;
            font-weight: bolder;
          }
        }
      }
      .export {
        span {
          display: inline-block;
          width: 60px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background: rgba(222, 235, 254, 1);
          opacity: 0.9;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
  }
  .ctc-foot {
    background-color: #f9f9f9;
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
  .finalPaymentDate {
    .el-input {
      width: 100%;
    }
  }
  .dateInputBox {
    vertical-align: top;
    .dateInput {
      display: block;
      height: 40px;
      .el-form-item {
        float: left;
        width: 47%;
        .el-input {
          width: 100%;
        }
      }
      .el-form-item:last-child {
        margin-left: 5%;
      }
    }
  }
}
.menu {
  height: 62px;
  line-height: 62px;
  border-bottom: 1px solid #eeeeee;
  margin-top: 15px;
  margin-bottom: 20px;
  background-color: #ffffff;
  // padding-left: 20px;
  span {
    display: inline-block;
    width: 200px;
    height: 62px;
    text-align: center;
    cursor: pointer;
    &.active {
      border-bottom: 3px solid #3577f6;
      color: #3577f6;
    }
  }
}
.plc-table-bottom {
  background: #fff;
  margin-top: 10px;
  border: 1px solid rgba(238, 238, 238, 1);
  overflow-x: auto;
  .ctable {
    width: 100%;
    overflow-x: hidden;
    td {
      font-size: 12px;
      padding: 10px 0;
      border-top: 1px solid rgba(238, 238, 238, 1);
    }
  }
}

.flowDialog1 {
  .dl-subtitle {
    display: inline-block;
    width: 45%;
    margin-bottom: 20px;
    margin-top: 0;
  }
  .el-form-item {
    margin: 10px 0 0 0;
    .el-select {
      width: 100%;
    }
  }
  .aliUpload {
    width: 100%;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    .oss_file {
      border: none;
      width: 100%;
      height: 100%;
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
}
.disBlock {
  display: block;
  width: 100%;
  height: 100%;
}
.unitlateFeeRate {
  .el-input {
    width: 80%;
  }
}
.export-error {
  display: inline-block;
  width: 90px;
  height: 26px;
  line-height: 24px;
  text-align: center;
  border: 1px solid rgba(53, 119, 246, 1);
  color: #3577f6;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: rgba(53, 119, 246, 1);
    color: #fff;
  }
}
.clearing:after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}
.clearing {
  zoom: 1;
}
.el-table th div.export_btn {
  display: flex;
  width: 56px;
  height: 26px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(229, 229, 229, 1);
  border-radius: 3px;
  font-size: 12px;
  cursor: pointer;
  i {
    display: block;
    line-height: 26px;
    font-size: 14px;
    margin-right: 3px;
    color: #262626;
  }
  span {
    display: block;
    line-height: 26px;
    color: #262626;
  }
  &:hover {
    i,
    span {
      color: #3575f6;
    }
  }
}
</style>
