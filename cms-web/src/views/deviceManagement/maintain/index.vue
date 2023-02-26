<template>
  <div id="repairManagement"
       class="repairManagement">
    <span class="page_head_title">维护管理</span>
    <ul class="default_tab_block">
      <!-- <li @click="roterTo('deviceCAD')"
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
      </li> -->
      <li @click="roterTo('patrolPollingRecord')"
          v-if="hasAuthority('03050101')">
        <div class="tab_badge">
          <span>巡更巡检</span>
        </div>
      </li>
      <li @click="roterTo('firecontrolChecklist')"
          v-if="hasAuthority('03050106')">
        <span>消防检查</span>
      </li>
      <li class="active">
        <div class="tab_badge">
          <span>保养列表</span>
          <span v-if="repairRdNum.maintain > 0">{{repairRdNum.maintain}}</span>
        </div>
      </li>
      <!-- <li @click="roterTo('patrolPollingRecord')"
          v-if="hasAuthority('03010119')">
        <div class="tab_badge">
          <span>巡更巡检记录</span>
        </div>
      </li>
      <li @click="roterTo('patrolPollingForm')"
          v-if="hasAuthority('03010122')">
        <div class="tab_badge">
          <span>巡更巡检表</span>
        </div>
      </li> -->
    </ul>
    <div class="search-bar">
      <div style="display: flex;flex-wrap: wrap;align-items:center">
        <el-select placeholder="项目"
                   v-model="projectId "
                   style="width:200px;margin-right:10px"
                   @change="projectManagementsChange">
          <el-option v-for="(item,index) in projectManagementsList"
                     :key="index"
                     :label="item.referred"
                     :value="item.id"></el-option>
        </el-select>
        <!-- <el-cascader :props="props" style="width:230px;margin-right:30px" placeholder="房源号"></el-cascader> -->
        <!-- <el-cascader :options="bulidFloorList" style="width:230px;margin-right:10px" placeholder="房源号" @change="handleChange" clearable></el-cascader> -->
        <el-input v-model="deviceName"
                  placeholder="设备名称"
                  size="small"
                  style="width:200px;margin-right:10px"></el-input>
        <el-date-picker style="width:270px;margin-right:10px"
                        size="small"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        start-placeholder="维保开始日期"
                        end-placeholder="维保结束日期"
                        v-model="time"
                        @change="daterangeChange"></el-date-picker>
        <!-- <el-date-picker style="width:200px;margin-right:10px" v-model="repairDate" type="date" placeholder="维保日期" value-format="yyyy-MM-dd"></el-date-picker> -->
        <el-select v-model="repairStatus"
                   size="small">
          <el-option label="全部"
                     value=""></el-option>
          <el-option label="维保未完成"
                     value="NO"></el-option>
          <el-option label="维保完成"
                     value="COMPLETE"></el-option>
        </el-select>
        <span style="background-color:#3575f6"
              @click="querySeach"
              class="query-btn">查询</span>
      </div>
      <div class="btnDiv">

        <el-button class="tban tban1"
                   @click="addRepFn"
                   v-if="hasAuthority('03050112')"><i class="iconfont icon-crm_xinzeng-"></i> 新增保养</el-button>

      </div>
    </div>
    <div class="table">
      <el-table :data="tableData"
                style="width: 100%">
        <el-table-column prop="repairRecordCode"
                         label="维保编号"
                         align="center"></el-table-column>
        <el-table-column prop="projectName"
                         label="项目简称"
                         align="center"></el-table-column>
        <el-table-column prop="equirementNo"
                         label="设备编号"
                         align="center"></el-table-column>
        <el-table-column prop="name"
                         label="设备名称"
                         align="center"></el-table-column>
        <el-table-column prop="planMaintenanceTime"
                         label="计划维保日期"
                         align="center"></el-table-column>
        <el-table-column prop="repairDate"
                         label="维保日期"
                         align="center"></el-table-column>
        <el-table-column prop="repairUserName"
                         label="维保人员"
                         align="center"></el-table-column>
        <el-table-column label="维保结果"
                         align="center"
                         :formatter="formatRepairStatus"></el-table-column>
        <el-table-column prop="nextMaintenanceTime"
                         label="下次维保日期"
                         align="center"></el-table-column>
        <el-table-column label="操作"
                         align="center"
                         v-if="hasAuthority('03050113')">
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
    <!-- 新增保养单 -->
    <el-dialog class="addRep"
               title="新增保养单"
               :visible.sync="detailsShow"
               @close="drawerClose">
      <addRepair :projectId="projectId"
                 pageType="add"
                 @drawerClose="drawerClose"
                 @addRecordsSuc="query"
                 @repairRecordNum="repairRecordNum" />
    </el-dialog>
    <repairDetail ref="repairDetail"
                  v-if="detailsShow1"
                  :detailsdrawershow="detailsShow1"
                  :repairDetailsData="repairDetails"
                  :projectManagementsList="projectManagementsList"
                  pageType="readOnly"
                  @handleEdit='handleEdit'
                  @drawerClose="drawerClose1"
                  @addRecordsSuc="query" />
  </div>
</template>

<script>
import addRepair from './components/addRepair'
import repairDetail from './components/repairDetail'
import context from '@/service'
import { error } from 'util'
export default {
  name: 'maintain',
  components: {
    addRepair,
    repairDetail
  },
  data () {
    return {
      timeKey: 0,
      time: '',
      repairDetails: {}, // 根据报修单id查询报修单详情
      pageType: 'add', // 子组件是添加还是详情  // readOnly详情页 add 新增
      drawerTitle: '新增维保',
      showPicture: false,
      imgArr: [],
      num: '',
      detailsShow: false,
      detailsShow1: false,
      projectManagementsList: [],
      projectId: '',
      roomId: '',
      deviceName: '',
      repairDate: '',
      repairStatus: 'NO',
      bulidFloorList: [],
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
      repairRdNum: {},
      repairEndDate: '',
      repairStartDate: ''
    }
  },
  created () {
    this.projectManagementsList = this.$store.state.projectManagementsList
    this.projectId = this.$route.params.projectManagementId ? this.$route.params.projectManagementId : this.projectManagementsList[0].id
    this.getShopListTree()
    this.query()
    this.repairRecordNum()
  },
  methods: {
    async repairRecordNum () {
      let repairRdNum = await context.user.repairRecordNum(this.projectId)
      this.repairRdNum = repairRdNum.data
    },
    roterTo (name, isestate) {
      if (name === 'repairManagement1') {
        sessionStorage.setItem('isestate', true)
        this.$router.push({ name: name, params: { projectManagementId: this.projectId } }) // isestate 是否是物业模块报修列表
      } else {
        this.$router.push({ name: name, params: { projectManagementId: this.projectId } })
      }
    },
    async query () { // 根据筛选条件查询报修单列表（分页）
      let param = {
        page: (this.currentPage - 1),
        size: this.pgSize,
        projectId: this.projectId,
        name: this.deviceName,
        maintenanceClassify: 'MAINTAIN',
        repairStartDate: this.repairStartDate,
        repairEndDate: this.repairEndDate,
        repairStatus: this.repairStatus,
        sort: 'repairRecordCode,desc'
      }
      if (param.status === '') {
        delete param.status
      }
      let result = await context.http.get('/cms/api/repair-records', param)
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
    },
    daterangeChange (d) {
      if (!d) {
        this.repairStartDate = ''
        this.repairEndDate = ''
      } else {
        this.repairStartDate = d[0]
        this.repairEndDate = d[1]
      }
    },
    handleChange (val) {
      this.roomId = val[val.length - 1]
    },
    async handleEdit (index, row) {
      context.http.get(`/cms/api/repair-records/${row.id}`).then(res => {
        this.repairDetails = res.data
        if (!this.repairDetails.imageUrls) {
          this.repairDetails.imageUrls = []
        }
        this.detailsShow1 = true
        console.log(this.repairDetails)
      })
    },
    addRepFn () {
      this.detailsShow = true
    },
    formatRepairStatus (row, column) {
      switch (row.repairStatus) {
        case 'REFERED':
          return '待处理'
        case 'WAIT':
          return '处理中'
        case 'OVER':
          return '已处理'
        case 'COMPLETE':
          return '维保完成'
        case 'NO':
          return '维保未完成'
      }
    },
    formatRoomsName (row, column) {
      if (row.roomsName) {
        return row.roomsName
      } else {
        return row.equirementNo
      }
    },
    formatreportTime (row, column) {
      return row.reportTime.replace('T', ' ')
    },
    getShopListTree () {
      context.http.get('cms/api/project-managements/tree').then(res => {
        let data = res.data
        this.bulidFloorList = []
        data.forEach((element, index) => {
          this.bulidFloorList.push({ value: element.id, label: element.projectName, children: [] })
          element.buildingListDTOSet.forEach((ele, idx) => {
            this.bulidFloorList[index].children.push({ value: ele.id, label: ele.buildingName, children: [] })
            ele.roomsDTOS.forEach((e, i) => {
              this.bulidFloorList[index].children[idx].children.push({ value: e.id, label: e.shopNumber })
            })
          })
        })
        console.log(this.bulidFloorList)
      }).catch(error => {
        console.log(error)
      })
    },
    drawerClose () {
      this.detailsShow = false
    },
    drawerClose1 () {
      this.detailsShow1 = false
    },
    pictureClose () {

    },
    projectManagementsChange () { // 项目改变
      // this.getBuliding()
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
      this.repairRecordNum()
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
      // return true
    }
  }
}
</script>
<style lang="scss">
.repairManagement {
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
.repairManagement {
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
