<template>
  <div id="patrolPollingForm"
       class="patrolPollingForm">
    <span class="page_head_title">设施设备</span>
    <ul class="default_tab_block">
      <li @click="roterTo('deviceCAD')"
          v-if="hasAuthority('03010103')">
        <span>设施设备平面图</span>
      </li>
      <li @click="roterTo('deviceList')"
          v-if=" 
          hasAuthority('03010105') ||
          hasAuthority('03010101') || 
          hasAuthority('03010102') || 
          hasAuthority('03010103') || 
          hasAuthority('03010105') ||
          hasAuthority('03010106') ||
          hasAuthority('03010107') ||
          hasAuthority('03010108') ||
          hasAuthority('03010109')">
        <span>设施设备列表</span>
      </li>
      <li @click="roterTo('repairManagement1',true)"
          v-if="hasAuthority('03010110')">
        <div class="tab_badge">
          <span>维修列表</span>
          <span v-if="repairRdNum.repairForm">{{repairRdNum.repairForm}}</span>
        </div>
      </li>
      <li @click="roterTo('maintain')">
        <div class="tab_badge">
          <span>保养列表</span>
          <span v-if="repairRdNum.maintain > 0">{{repairRdNum.maintain}}</span>
        </div>
      </li>
      <li @click="roterTo('patrolPollingRecord')"
          v-if="hasAuthority('03010119')">
        <div class="tab_badge">
          <span>巡更巡检记录</span>
        </div>
      </li>
      <li class="active">
        <div class="tab_badge">
          <span>巡更巡检表</span>
        </div>
      </li>
    </ul>
    <div class="search-bar">
      <div style="display: flex;flex-wrap: wrap;align-items:center">
        <el-select placeholder="项目"
                   v-model="seachParams.projectManagementId "
                   style="width:200px;margin-right:10px">
          <el-option v-for="(item,index) in projectManagementsList"
                     :key="index"
                     :label="item.referred"
                     :value="item.id"></el-option>
        </el-select>
        <el-select v-model="seachParams.patrolType"
                   size="small">
          <el-option label="全部类型"
                     value=""></el-option>
          <el-option label="巡更"
                     value="PATROL"></el-option>
          <el-option label="巡检"
                     value="POLLING"></el-option>
        </el-select>
        <el-select v-model="seachParams.useStatus"
                   size="small">
          <el-option label="全部状态"
                     value=""></el-option>
          <el-option label="使用中"
                     value="USING"></el-option>
          <el-option label="已停用"
                     value="DISABLE"></el-option>
        </el-select>
        <span style="background-color:#3575f6"
              @click="querySeach"
              v-if="hasAuthority('02030203')"
              class="query-btn">查询</span>
      </div>
      <div class="btnDiv">

        <el-button class="tban tban1"
                   @click="addRepFn"
                   v-if="hasAuthority('03010123')"><i class="iconfont icon-crm_xinzeng-"></i> 新增巡更巡检表</el-button>
      </div>
    </div>
    <div class="table">
      <el-table :data="tableData"
                style="width: 100%">
        <el-table-column prop="projectManagementName"
                         label="项目简称"
                         align="center"></el-table-column>
        <el-table-column :formatter="patrolTypeFormat"
                         label="类型"
                         align="center"></el-table-column>
        <el-table-column prop="name"
                         label="巡更巡检表名称"
                         align="center"></el-table-column>
        <el-table-column :formatter="numberFormat"
                         label="频次"
                         align="center"></el-table-column>
        <el-table-column prop="equirementNumber"
                         label="巡更&巡检设备数"
                         align="center"></el-table-column>
        <el-table-column prop="useStatus"
                         :formatter="useStatusFormat"
                         label="状态"
                         align="center"></el-table-column>
        <el-table-column label="操作"
                         align="center"
                         v-if="hasAuthority('03010124')">
          <template slot-scope="scope">
            <el-button class="el-button--primary operation-btn"
                       size="mini"
                       @click="handleEdit(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="ctc-foot">
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
    <!-- 新增巡更巡检表-->
    <el-dialog class="addRep"
               title="新增巡更巡检表"
               :visible.sync="detailsShow"
               @close="drawerClose">
      <addFrom ref="addFrom"
               @drawerClose="drawerClose"
               @query="querySeach" />
    </el-dialog>
    <!-- 巡更巡检表详情 -->
    <patrolPollingFrom :show="recordShow"
                       :detailsData="detailsData"
                       @query="querySeach"
                       @close="recordClose" />
  </div>
</template>

<script>
import context from '@/service'
import { error } from 'util'
import addFrom from './components/addFrom' // 巡更巡检表
import patrolPollingFrom from './components/patrolPollingFrom' // 巡更巡检记录
export default {
  components: {
    addFrom,
    patrolPollingFrom
  },
  data () {
    return {
      seachParams: {
        projectManagementId: '',
        patrolType: '',
        useStatus: ''
      },
      detailsData: {},
      recordShow: false,
      detailsShow: false,
      projectManagementsList: [],
      tableData: [],
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
      repairRdNum: {}
    }
  },
  created () {
    this.projectManagementsList = this.$store.state.projectManagementsList
    this.seachParams.projectManagementId = this.$route.params.projectManagementId ? this.$route.params.projectManagementId : this.projectManagementsList[0].id
    this.query()
    this.repairRecordNum()
  },
  methods: {
    patrolTypeFormat (row, column) {
      if (row.patrolType === 'PATROL') {
        return '巡更'
      } else if (row.patrolType === 'POLLING') {
        return '巡检'
      }
    },
    useStatusFormat (row, column) {
      if (row.useStatus === 'USING') {
        return '使用中'
      } else if (row.useStatus === 'DISABLE') {
        return '已停用'
      }
    },
    numberFormat (row, column) {
      if (row.frequencyUnit === 'ONCE') {
        return row.number + '天/次'
      } else if (row.frequencyUnit === 'DAY') {
        return row.number + '次/天'
      }
    },
    recordClose () {
      this.recordShow = false
    },
    async repairRecordNum () {
      let repairRdNum = await context.user.repairRecordNum(this.seachParams.projectManagementId)
      this.repairRdNum = repairRdNum.data
    },
    roterTo (name, isestate) {
      if (name === 'repairManagement1') {
        sessionStorage.setItem('isestate', true)
        this.$router.push({ name: name, params: { projectManagementId: this.projectManagementId } }) // isestate 是否是物业模块报修列表
      } else {
        this.$router.push({ name: name, params: { projectManagementId: this.projectManagementId } })
      }
    },
    async query () { // 根据筛选条件查询报修单列表（分页）
      let param = {
        page: (this.currentPage - 1),
        size: this.pgSize,
        projectManagementId: this.seachParams.projectManagementId,
        patrolType: this.seachParams.patrolType,
        useStatus: this.seachParams.useStatus,
        sort: 'createdDate,desc'
      }
      let result = await context.http.get('/cms/api/patrolInspection', param)
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
    },
    async handleEdit (index, row) { // 查看详情
      context.http.get(`/cms/api/patrolInspection/${row.id}`).then(res => {
        this.detailsData = res.data
        this.recordShow = true
      })
    },
    addRepFn () {
      this.detailsShow = true
      this.$nextTick(() => {
        this.$refs.addFrom.getEquirementTypes()
      })
    },
    drawerClose () {
      this.$refs.addFrom.closeInit()
      this.detailsShow = false
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    querySeach () {
      this.currentPage = 1
      this.query()
      // this.repairRecordNum()
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
      // return true
    }
  }
}
</script>
<style lang="scss">
.patrolPollingForm {
  .el-dialog {
    width: 900px !important;
    margin-top: 3vh !important;
  }
  .el-dialog__header {
    margin: 0 20px !important;
    padding: 15px 0 15px 0 !important;
    border: none;
  }
  .el-dialog__title {
    font-weight: bold;
    border: none;
    font-size: 16px;
  }
  .el-dialog__body {
    margin: 0 !important;
    background-color: #f7f7f7;
    border: none;
  }
  .basInfo {
    border: none !important;
    background-color: #fff;
  }
  .readOnlyTxt {
    color: #262626 !important;
  }
  .el-form-item__content {
    > span {
      color: #777 !important;
    }
  }
  .el-input__icon {
    line-height: 34px;
  }
  .ctc-foot {
    justify-content: normal;
    flex-direction: row-reverse;
    align-items: center;
    color: #3f5fbf;
    font-size: 12px;
    padding: 60px 20px 30px 20px;
    .pagingnum {
      color: #3f5fbf;
      font-size: 12px;
      select {
        width: 65px;
        height: 28px;
        border-radius: 2px;
        border-color: #f6f6f7;
        color: #3577f6;
      }
    }
    .el-pagination.is-background .btn-next,
    .el-pagination.is-background .btn-prev,
    .el-pagination.is-background .el-pager li {
      margin: 0 5px;
      background-color: transparent;
      color: #3f5fbf;
      min-width: 30px;
      border-radius: 2px;
      font-size: 14px;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      border-radius: 50%;
      background-color: #3f5fbf !important;
      color: #fff !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.patrolPollingForm {
  .menuTab {
    height: 60px;
    margin-top: 15px;
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 4px 4px 4px 1px #eee;
    > span {
      display: inline-block;
      position: relative;
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
  .search-bar {
    > div {
      > span {
        display: inline-block;
        width: 110px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        cursor: pointer;
        // color: #fff;
        border-radius: 3px;
        &:first-child {
          // background-color: #3577f6;
        }
        &:first-child:hover {
          background-color: #2a6ef0;
        }
        &:last-child {
        }
        &:last-child:hover {
          background-color: #f0f9f3;
        }
      }
    }
  }
  .table {
    padding-top: 1px;
    .el-button--primary {
      color: #409eff;
    }
  }
  .btnDiv {
    display: flex;
    align-items: center;
    span {
      border: 1px solid #44af69;
      color: #44af69;
      background-color: #fff;
      line-height: 31px !important;
    }
  }
}
</style>
