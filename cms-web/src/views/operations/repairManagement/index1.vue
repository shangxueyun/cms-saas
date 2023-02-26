<template>
  <div id="repairManagement"
       class="repairManagement weixiuList">
    <span class="page_head_title">维修管理</span>
    <!-- <ul v-if="isestate"
        class="default_tab_block">
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
      <li class="active">
        <div class="tab_badge">
          <span>维修列表</span>
          <span v-if="repairRdNum.repairForm">{{repairRdNum.repairForm}}</span>
        </div>
      </li>
      <li @click="roterTo('maintain')"
          v-if="hasAuthority('03010114')">
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
      <li @click="roterTo('patrolPollingForm')"
          v-if="hasAuthority('03010122')">
        <div class="tab_badge">
          <span>巡更巡检表</span>
        </div>
      </li>
    </ul> -->
    <div class="search-bar">
      <div style="display: flex;flex-wrap: wrap;align-items:center">
        <el-select v-model="projectId "
                   style="width:200px;"
                   @change="projectManagementsChange">
          <el-option v-for="(item,index) in projectManagementsList"
                     :key="index"
                     :label="item.referred"
                     :value="item.id"></el-option>
        </el-select>
        <!-- <el-cascader :props="props" style="width:230px;margin-right:30px" placeholder="房源号"></el-cascader> -->
        <el-cascader :options="bulidFlList"
                     style="width:200px;margin-right:10px"
                     placeholder="房源号"
                     @change="handleChange"
                     clearable></el-cascader>
        <el-input v-model="deviceName"
                  placeholder="设备名称/房源名称"
                  style="width:200px;margin-right:10px"></el-input>
        <el-date-picker style="width:280px;margin-right:10px"
                        size="small"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        start-placeholder="报修开始日期"
                        end-placeholder="报修结束日期"
                        v-model="time"
                        @change="daterangeChange"></el-date-picker>
        <el-select v-model="repairStatus"
                   multiple
                   collapse-tags
                   clearable
                   style="width:200px;margin-right:10px">
          <!-- <el-option label="全部状态"
                     value=""></el-option> -->
          <el-option label="待处理"
                     value="REFERED"></el-option>
          <el-option label="处理中"
                     value="WAIT"></el-option>
          <el-option label="已处理"
                     value="OVER"></el-option>
          <!-- <el-option label="维保完成" value="COMPLETE"></el-option>
          <el-option label="未完成" value="NO"></el-option> -->
        </el-select>
        <span @click="querySeach"
              class="query-btn">查询</span>
      </div>
      <div style="display: flex;align-items: center;">
        <el-button class="tban tban1"
                   v-if="hasAuthority('03060102')"
                   @click="addRepFn"><i class="iconfont icon-crm_xinzeng-"></i> 新增报修</el-button>
      </div>
    </div>
    <div class="table">
      <el-table :data="tableData"
                style="width: 100%">
        <el-table-column label="报修编号"
                         align="center"
                         prop="repairFormCode"></el-table-column>
        <el-table-column prop="title"
                         label="问题简述"
                         align="center"></el-table-column>
        <el-table-column prop="projectName"
                         label="项目简称"
                         align="center"></el-table-column>
        <el-table-column label="房源号/设备号/楼宇号"
                         align="center"
                         :formatter="formatRoomsName"></el-table-column>
        <el-table-column label="房源名称/设备名称"
                         align="center"
                         :formatter="formatterName"></el-table-column>
        <el-table-column prop="createUserName"
                         label="报修人"
                         align="center"></el-table-column>
        <el-table-column label="报修时间"
                         align="center"
                         :formatter="formatReportTime"></el-table-column>
        <el-table-column label="维保日期"
                         align="center"
                         :formatter="formatreportTime"></el-table-column>
        <el-table-column label="状态"
                         align="center"
                         :formatter="formatRepairStatus"></el-table-column>
        <el-table-column label="操作"
                         v-if="hasAuthority('03060103')"
                         align="center">
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
    <addRepair ref="addRepair"
               :detailsdrawershow="detailsShow"
               :repairDetails="repairDetails"
               hasAddBtn="add"
               :drawerTitle="drawerTitle"
               @refreshDetailsData="refreshDetailsData"
               @drawerClose="drawerClose"
               @addweibaoOpen="addweibaoOpen" />
    <!-- 新增报修单-->
    <el-dialog class="addbaoxiu"
               title="新增报修单"
               :close-on-click-modal="false"
               :visible.sync="addbaoxiuShow"
               @close="addbaoxiuClose">
      <addRepair1 ref="addRepair1"
                  :repairDetails="repairDetails"
                  :projectManagementsList="projectManagementsList"
                  :bulidFloorList="bulidFloorList"
                  :pageType="pageType"
                  :menuTab="menuTab"
                  :projectId="projectId"
                  :key="timeKey"
                  :drawerTitle="drawerTitle"
                  @queryUpdate="query"
                  @drawerClose="addbaoxiuClose" />
    </el-dialog>
    <!-- 新增维修单 -->
    <el-dialog class="addweixiu"
               title="新增维修单"
               :visible.sync="addRepairShow"
               @close="addRepairClose">
      <addRepair2 :detailsdrawershow="addRepairShow"
                  :equirementId="equirementId"
                  :repairDetailsData="repairDetailsData"
                  :projectManagementsList="projectManagementsList"
                  :projectId="projectId"
                  pageType="add"
                  @addRecordsSuc="addRecordsSuc"
                  @drawerClose="addRepairClose" />
    </el-dialog>
  </div>
</template>
<script>
import addRepair from './components/addRepair'
import addRepair1 from './components/addRepair1'
import addRepair2 from './components/addRepair2'
import context from '@/service'
import { error } from 'util'
export default {
  name: 'repairManagement',
  components: {
    addRepair,
    addRepair1,
    addRepair2
  },
  data () {
    return {
      addbaoxiuShow: false,
      repairDetailsData: {}, // 维修记录详情
      addRepairShow: false,
      equirementId: null,
      menuTab: null,
      isestate: false, // isestate 是否是物业模块报修列表1
      timeKey: 0,
      time: '',
      repairDetails: {}, // 根据报修单id查询报修单详情
      pageType: 'add', // 子组件是添加还是详情  // readOnly详情页 add 新增
      drawerTitle: '新增报修单',
      drawerTitle1: '',
      showPicture: false,
      imgArr: [],
      num: '',
      detailsShow: false,
      projectManagementsList: [],
      projectId: '',
      roomId: '',
      deviceName: '',
      endDate: '',
      startDate: '',
      repairStatus: ['REFERED'],
      bulidFloorList: [],
      bulidFlList: [],
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
    const repairStatus = localStorage.getItem('repairStatus')
    if (repairStatus === '') {
      this.repairStatus = []
    } else {
      this.repairStatus = repairStatus.split(',')
    }
  },
  mounted () {
    this.isestate = sessionStorage.getItem('isestate')
    this.projectManagementsList = this.$store.state.projectManagementsList
    this.projectId = this.$route.params.projectManagementId ? this.$route.params.projectManagementId : this.projectManagementsList[0].id
    this.getShopListTree()
    this.query()
    if (this.isestate) {
      this.repairRecordNum()
    }
  },
  destroyed () {
    sessionStorage.removeItem('isestate')
  },
  methods: {
    refreshDetailsData (data) {
      this.repairDetails = data
    },
    addRepFn () { // 新增报修
      this.pageType = 'add'
      this.menuTab = 'repairInfo'
      this.drawerTitle = '新增报修单'
      // ++this.timeKey
      this.addbaoxiuShow = true
    },
    addbaoxiuClose () {
      this.$refs.addRepair1.resetAddData()
      this.addbaoxiuShow = false
    },
    addweixiuClose () {
      this.addRepairShow = false
    },
    addweibaoOpen (repairDetailsData) { // 新增维修单
      this.repairDetailsData = repairDetailsData
      this.drawerTitle1 = '新增维修记录'
      this.addRepairShow = true
    },
    addRepairClose () {
      this.addRepairShow = false
    },
    addRecordsSuc () {
      this.$refs.addRepair.menuTabChange('repairRecord')
      this.query()
      if (this.isestate) {
        this.repairRecordNum()
      }
    },
    async repairRecordNum () {
      let repairRdNum = await context.user.repairRecordNum(this.projectId)
      this.repairRdNum = repairRdNum.data
    },
    formatReportTime (row, column) {
      return row.reportTime.replace('T', ' ')
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
      localStorage.setItem('repairStatus', this.repairStatus)
      let param = {
        page: (this.currentPage - 1),
        size: this.pgSize,
        projectId: this.projectId,
        roomId: this.roomId,
        name: this.deviceName,
        startDate: this.startDate,

        endDate: this.endDate,
        status: this.repairStatus.toString(),
        sort: 'repairFormCode,desc'
      }
      if (param.status === '') {
        delete param.status
      }
      let result = await context.http.get('/cms/api/repair-forms', param)
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
    },
    daterangeChange (d) {
      if (!d) {
        this.startDate = ''
        this.endDate = ''
      } else {
        this.startDate = d[0]
        this.endDate = d[1]
      }
    },
    handleChange (val) {
      this.roomId = val[val.length - 1]
    },
    async handleEdit (index, row) {
      this.drawerTitle = '维修单详情'
      context.http.get(`/cms/api/repair-forms/${row.id}`,
        {
          // page: (this.currentPage - 1),
          // size: this.pgSize
        }).then(res => {
          this.repairDetails = res.data
          ++this.timeKey
          this.detailsShow = true
        })
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
          return '已处理'
        case 'NO':
          return '处理中'
      }
    },
    formatRoomsName (row, column) {
      if (row.roomsName) {
        return row.roomsName
      } else {
        return row.equirementNo
      }
    },
    formatterName (row, column) {
      if (row.repairType === 'BUILDING') {
        return '-'
      } else {
        return row.name
      }
    },
    formatreportTime (row, column) {
      if (row.repairDate) {
        return row.repairDate.replace('T', ' ')
      }
    },
    getShopListTree () {
      context.http.get('cms/api/project-managements/tree').then(res => {
        let data = res.data
        this.bulidFloorList = []
        data.forEach((element, index) => {
          this.bulidFloorList.push({ value: element.id, label: element.referred, children: [] })
          element.buildingListDTOSet.forEach((ele, idx) => {
            this.bulidFloorList[index].children.push({ value: ele.id, label: ele.buildingName, children: [] })
            ele.roomsDTOS.forEach((e, i) => {
              this.bulidFloorList[index].children[idx].children.push({ value: e.id, label: e.shopNumber })
            })
          })
        })
        this.getbulidFloorList()
        // console.log(this.bulidFloorList)
      }).catch(error => {
        console.log(error)
      })
    },
    // async getBuliding () {
    //   let result = await context.http.get('cms/api/buildings?sort=sortNumber,asc&sort=id,asc', { page: 0, size: 100, useStatus: 'USING', projectId: this.projectId })
    //   // this.options1 = result.data.buildingListDTOS
    //   // this.options1.unshift({id: null, buildingName: '层平面图'})
    //   let data = result.data.buildingListDTOS
    //   this.bulidFloorList = []
    //   data.forEach((element, index) => {
    //     this.bulidFloorList.push({value: element.id, label: element.buildingName, children: []})
    //     let floorArr = element.floorDTOSet
    //     floorArr.forEach(item => {
    //       this.bulidFloorList[index].children.push({value: item.id, label: item.name})
    //     })
    //   })
    //   console.log(this.bulidFloorList)
    // },
    drawerClose () {
      this.detailsShow = false
    },
    pictureClose () {

    },
    projectManagementsChange () { // 项目改变
      // this.getBuliding()
      this.getbulidFloorList()
    },
    getbulidFloorList () {
      if (this.projectId) {
        let bulidFloorList = this.bulidFloorList.filter(ele => {
          return ele.value === this.projectId
        })
        this.bulidFlList = bulidFloorList
      }
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
      if (this.isestate) {
        this.repairRecordNum()
      }
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
      // return true
    }
  }
}
</script>
<style lang="scss" >
.repairManagement {
  .addweixiu {
    .el-dialog {
      width: 500px !important;
    }
  }
}

.weixiuList {
  .addweixiu {
    .el-dialog {
      background-color: #f7f7f7;
      .el-dialog__header {
        background-color: #fff;
        margin: 0 0 15px !important;
        padding: 15px 0 15px 15px !important;
      }
    }
  }
}
.addbaoxiu {
  .el-dialog__body {
    padding-top: 15px !important;
  }
}
</style>
<style lang="scss" scoped>
.weixiuList {
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
  .searchDiv {
    display: -ms-flexbox;
    display: flex;
    margin-top: 20px;
    background-color: #fff;
    padding: 0 15px;
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
        &:first-child {
          background-color: #3577f6;
        }
        &:first-child:hover {
          background-color: #2a6ef0;
        }
        &:last-child {
          background-color: #49af61;
        }
        &:last-child:hover {
          background-color: #00954d;
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
}
</style>
