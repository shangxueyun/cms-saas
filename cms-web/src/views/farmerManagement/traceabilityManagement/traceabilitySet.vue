<template>
  <div class="traceabilitySet">
    <span class="page_head_title">溯源管理</span>
    <ul class="default_tab_block">
      <li v-if="hasAuthority('02050405')"
          @click="switchover('warehousing')">
        <span>入库信息上报</span>
      </li>
      <li v-if="hasAuthority('02050406')"
          @click="switchover('sellData')">
        <span>销售数据上报</span>
      </li>
      <li v-if="hasAuthority('02050407')"
          class="active">
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
                     style="width:200px;">
            <el-option v-for="item in options1"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="goodsTypeId"
                     clearable
                     placeholder="大类"
                     style="width:200px;">
            <el-option v-for="item in kindOption"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <div class="query-btn"
               @click="querySearch">查询</div>
        </div>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  class="bill_table"
                  style="width: 100%">
          <el-table-column prop="projectReferred"
                           label="项目简称"
                           align="center"></el-table-column>
          <el-table-column prop="goodsClassification.parent.name"
                           label="大类"
                           align="center"></el-table-column>
          <el-table-column prop="goodsClassification.name"
                           label="小类"
                           align="center"></el-table-column>
          <el-table-column prop="tracedStandard.name"
                           label="食品溯源规范"
                           align="center"></el-table-column>
          <el-table-column label="操作"
                           align="center">
            <template slot-scope="scope">
              <span @click="handleEdit(scope.$index, scope.row)"
                    class="setBtn">配置</span>
            </template>
          </el-table-column>
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
    <!-- 溯源配置 -->
    <el-dialog title="溯源配置"
               :visible.sync="detailsdrawershow"
               class="el_dialog_new"
               width="750px"
               @close="detailsdrawerClose"
               :close-on-click-modal="false">
      <DetailsSet :detailsData="detailsData"
                  :detailsdrawershow="detailsdrawershow"
                  @refresh="querySearch"
                  @detailsSetClose="detailsdrawerClose" />
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import DetailsSet from './components/DetailsSet.vue'
import { toLocaleString, toLocaleFixed } from '@/utils/validate.js'
import * as JSOG from 'jsog'
export default {
  name: 'billList',
  components: {
    DetailsSet
  },
  data () {
    return {
      goodsTypeId: '',
      detailsData: {},
      detailsdrawershow: false,
      projectManagementId: '',
      options1: [],
      kindOption: [],
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
    this.getGoodsTypeList()
    this.query()
  },
  mounted () {

  },
  methods: {
    async query () {
      let result = await context.http.get('gos/api/tracedStandards', {
        projectManagementId: this.projectManagementId,
        goodsType: this.goodsTypeId
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
    },
    async getGoodsTypeList () {
      let result = await context.http.get(`gos/api/goodsClassifications/tree?flag=${false}`)
      this.kindOption = result.data
    },
    detailsdrawerClose () {
      this.detailsdrawershow = false
    },
    async handleEdit (index, row) {
      this.detailsData = row
      this.detailsdrawershow = true
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
.traceabilitySet {
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
      .setBtn {
        display: inline-block;
        width: 56px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        border: 1px solid #ac8959;
        border-radius: 3px;
        color: #ac8959;
        cursor: pointer;
        &:hover {
          color: #fff;
          background-color: #ac8959;
        }
      }
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

