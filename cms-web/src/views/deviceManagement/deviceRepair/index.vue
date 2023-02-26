<template>
  <div class="device-repair">
    <span style="font-size: 16px;color:#333">设备设施</span>
    <div class="menuTab">
      <span @click="roterTo('deviceCAD')"
            v-if="hasAuthority('03010103')">设备平面图</span>
      <span @click="roterTo('deviceList')"
            v-if=" 
          hasAuthority('03010105') ||
          hasAuthority('03010101') || 
          hasAuthority('03010102') || 
          hasAuthority('03010103') || 
          hasAuthority('03010105') ||
          hasAuthority('03010106') ||
          hasAuthority('03010107') ||
          hasAuthority('03010108') ||
          hasAuthority('03010109')">设备列表</span>
      <span @click="roterTo('repairManagement1',true)"
            v-if="hasAuthority('03010110')">报修列表<span v-if="repairRdNum.repairForm > 0">{{repairRdNum.repairForm}}</span></span>
      <span @click="roterTo('maintain')"
            v-if="hasAuthority('03010114')">保养列表<span v-if="repairRdNum.maintain > 0">{{repairRdNum.maintain}}</span></span> <!-- 新增-->
      <span class="active">维保列表</span>
    </div>
    <div class="pl-content">
      <div class="searchDiv">
        <div>
          <el-select v-model="projectId "
                     style="width:200px;margin-right:20px"
                     @change="projectManagementsChange">
            <el-option v-for="(item,index) in projectManagementsList"
                       :key="index"
                       :label="item.referred"
                       :value="item.id"></el-option>
          </el-select>
          <!-- <el-cascader :props="props" style="width:230px;margin-right:30px" placeholder="房源号"></el-cascader> -->
          <!-- <el-cascader :options="bulidFloorList" style="width:200px;margin-right:20px" placeholder="房源号" @change="handleChange" clearable></el-cascader> -->
          <el-select v-model="repairType"
                     clearable
                     style="width:200px;margin-right:20px">
            <el-option label="设备"
                       value="EQUIREMENT"></el-option>
            <el-option label="房源"
                       value="ROOMS"></el-option>
            <el-option label="其他"
                       value="BUILDING"></el-option>
          </el-select>
          <el-select v-model="maintenanceClassify"
                     clearable
                     style="width:200px;margin-right:20px">
            <el-option label="维修"
                       value="REPAIR"></el-option>
            <el-option label="保养"
                       value="MAINTAIN"></el-option>
          </el-select>
          <el-input v-model="deviceName"
                    placeholder="设备名称"
                    style="width:200px;margin-right:20px"></el-input>
          <el-date-picker style="width:280px;margin-right:30px"
                          value-format="yyyy-MM-dd"
                          type="daterange"
                          start-placeholder="维保开始日期"
                          end-placeholder="维保结束日期"
                          v-model="time"
                          @change="daterangeChange"></el-date-picker>
          <!-- <el-date-picker
            style="width:200px;margin-right:20px"
            v-model="repairDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="维保日期">
          </el-date-picker> -->
          <el-select v-model="repairStatus"
                     clearable
                     style="margin-right:20px">
            <el-option label="维保未完成"
                       value="NO"></el-option>
            <el-option label="维保完成"
                       value="COMPLETE"></el-option>
          </el-select>
          <div class="btnDiv">
            <span style="margin-right:30px;font-size:14px;"
                  @click="querySeach">查询</span>
          </div>
        </div>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column prop="repairRecordCode"
                           label="维保编号"
                           align="center"></el-table-column>
          <el-table-column prop="projectName"
                           label="项目简称"
                           align="center"></el-table-column>
          <el-table-column prop="repairType"
                           label="维保类型"
                           align="center"
                           :formatter="repairTypeFormat"></el-table-column>
          <el-table-column prop="maintenanceClassify"
                           label="维保方式"
                           align="center"
                           :formatter="maintenanceModeFormat"></el-table-column>
          <el-table-column prop="roomsName"
                           label="房源号/设备号/楼宇号"
                           align="center"
                           :formatter="formatRoomsName"></el-table-column>
          <el-table-column label="房源名称/设备名称"
                           align="center"
                           :formatter="formatName"></el-table-column>
          <el-table-column prop="repairUserName"
                           label="维保人员"
                           align="center"></el-table-column>
          <el-table-column prop="repairDate"
                           label="维保日期"
                           align="center"></el-table-column>
          <el-table-column prop="repairStatus"
                           label="维保结果"
                           align="center"
                           :formatter="maintenanceResultFormat"></el-table-column>
          <el-table-column label="操作"
                           align="center"
                           v-if="hasAuthority('03010111')">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.$index, scope.row, 'see')"
                         class="el-button--primary operation-btn"
                         size="mini">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="ctc-foot">
        <div class="pagingnum">
          显示 <select v-model="pgSize"
                  @change="currentSel">
            <option v-for="item in pgNumoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </option>
          </select>
          条目 <span style="padding-left: 30px">显示从{{pgSize*(currentPage - 1) + 1}}到{{pgSize*currentPage}}项结果，共<span class="style: red">{{total}}</span>条</span>
        </div>
        <el-pagination v-if="total > 0"
                       background
                       layout="prev, pager, next"
                       :page-size=pgSize
                       :total="total"
                       :current-page.sync="currentPage"
                       @current-change="current_change">
        </el-pagination>
      </div>
    </div>
    <!--  详情&维修记录详情-->
    <!-- <addRepair 
      :detailsdrawershow="addRepairShow"
      :projectManagementsList="projectManagementsList"
      :pageType="pageType"
      @addRepairFn="addRepairFn"
      @drawerClose="addRepairClose"
    /> -->
    <!--  详情&维修记录详情-->
    <addRepair ref="mychild"
               :detailsdrawershow="addRepairShow"
               :repairDetails="repairDetails"
               :projectManagementsList="projectManagementsList"
               :bulidFloorList="bulidFloorList"
               :pageType="pageType"
               @queryUpdate="query"
               @addRepairFn="addRepairFn"
               @drawerClose="addRepairClose" />
    <!-- 新增维修记录 -->
    <addRepair1 :detailsdrawershow="addRepairShow1"
                :deviceInfo="deviceInfo"
                :projectManagementsList="projectManagementsList"
                :pageType="pageType1"
                @repairRecordUpdate="repairRecordUpdate"
                @drawerClose="addRepairClose1" />
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import * as JSOG from 'jsog'
import addRepair from './components/addRepair'
import addRepair1 from './components/addRepair1'
export default {
  name: 'device-repair',
  components: {
    addRepair,
    addRepair1
  },
  data () {
    return {
      repairDate: '',
      time: '',
      deviceInfo: {}, // 单条设备信息
      repairDetails: {}, // 根据报修单id查询报修单详情
      projectId: '',
      roomId: '',
      deviceName: '',
      endDate: '',
      startDate: '',
      repairStatus: '',
      addRepairShow: false,
      addRepairShow1: false,
      pageType: 'readOnly', // readOnly详情页 add 新增
      pageType1: 'add',
      value: '',
      bulidFloorList: [],
      projectManagementsList: [],
      // navList: [{ label: '全部', value: true }, { label: '我发起的', value: false }, { label: '待处理', value: false }, { label: '已处理', value: false }],
      flg: 0,
      operation: '',
      projectValue: '',
      reportTime: '',
      chargeOption: [],
      projecOptions: [],
      eqNumberOptions: [],
      equipmentValue: '',
      equipmentState: '',
      equipmentName: '',
      referred: '',
      billTypeOption: [{
        value: 'R',
        name: '收款'
      }, {
        value: 'P',
        name: '付款'
      }],
      accountEntry: true,
      adddialogVisible: false,
      addProjectShow: false,
      detailsdrawershow: false,
      flowExplain: '',
      addform: {},
      tableData: [],
      currentPage: 1,
      pgNum: 1,
      total: 0,
      pgSize: 15,
      flowDetailsData: {},
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
      userName: '',
      userPostId: '',
      repairType: '',
      maintenanceClassify: '',
      repairRdNum: {},
      repairEndDate: '',
      repairStartDate: ''
    }
  },
  created () {
    this.projectManagementsList = this.$store.state.projectManagementsList
    this.projectId = this.$route.params.projectManagementId ? this.$route.params.projectManagementId : this.projectManagementsList[0].id
    this.query()
    this.getShopListTree()
    let user = JSON.parse(sessionStorage.getItem('user'))
    this.userName = user.account
    this.repairRecordNum() // 未完成数量
  },
  methods: {
    async repairRecordNum () {
      let repairRdNum = await context.user.repairRecordNum(this.projectId)
      this.repairRdNum = repairRdNum.data
    },
    projectManagementsChange () { // 项目改变
      // this.repairRecordNum()
    },
    repairRecordUpdate (deviceInfo) {
      context.http.get(`/cms/api/repair-forms/${deviceInfo.id}/repair-records`).then(res => {
        this.$refs.mychild.parentHandleclick(res.data)
      }).catch(error => {
        console.info(error)
      })
    },
    changeStatus (index, row, status) {
      context.http.put(`/cms/api/repair-forms/${row.id}/${status}`).then(res => {
        this.$message({
          type: 'success',
          message: '状态保存成功'
        })
        this.query()
      })
    },
    async handleEdit (index, row) {
      this.pageType = 'readOnly'
      this.deviceInfo = row
      context.http.get(`/cms/api/repair-records/${row.id}`).then(res => {
        this.repairDetails = res.data
        this.$refs.mychild.setMenuTab('repairInfo')
        this.addRepairShow = true
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
          return '维修完成'
        case 'NO':
          return '未完成'
      }
    },
    formatName (row, column) {
      if (row.repairType === 'BUILDING') {
        return '-'
      } else {
        return row.name
      }
    },
    formatRoomsName (row, column) {
      if (row.repairType === 'EQUIREMENT') {
        return row.equirementNo
      } else if (row.repairType === 'ROOMS') {
        return row.roomsName
      } else if (row.repairType === 'BUILDING') {
        return row.buildingName
      }
    },
    maintenanceModeFormat (row, column) {
      let res = ''
      if (row.maintenanceClassify === 'REPAIR') {
        res = '维修'
      } else if (row.maintenanceClassify === 'MAINTAIN') {
        res = '保养'
      } else {
        res = ''
      }
      return res
    },
    repairTypeFormat (row, column) {
      let res = ''
      if (row.repairType === 'ROOMS') {
        res = '房源'
      } else if (row.repairType === 'EQUIREMENT') {
        res = '设备'
      } else {
        res = '其他'
      }
      return res
    },
    maintenanceResultFormat (row, column) {
      let res = ''
      if (row.repairStatus === 'COMPLETE') {
        res = '维保完成'
      } else if (row.repairStatus === 'NO') {
        res = '维保未完成'
      } else {
        res = ''
      }
      return res
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
        // console.log(this.bulidFloorList)
      }).catch(error => {
        console.log(error)
      })
    },
    async query () { // 根据筛选条件查询报修单列表（分页）
      let param = {
        page: (this.currentPage - 1),
        size: this.pgSize,
        projectId: this.projectId,
        roomId: this.roomId,
        name: this.deviceName,
        repairStartDate: this.repairStartDate,
        repairEndDate: this.repairEndDate,
        repairStatus: this.repairStatus,
        maintenanceClassify: this.maintenanceClassify,
        repairType: this.repairType,
        sort: 'repairRecordCode,desc'
      }
      if (param.status === '') {
        delete param.status
      }
      let result = await context.http.get('/cms/api/repair-records', param)
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
    },
    addRepairFn () { // 新增维修数据
      this.addRepairShow1 = true
    },
    addRepairClose () {
      this.addRepairShow = false
    },
    addRepairClose1 () {
      this.addRepairShow1 = false
    },
    addRepair1Close () {
      this.addRepair1Show = false
    },
    handleChange (val) {
      this.roomId = val[val.length - 1]
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
    roterTo (name, isestate) {
      if (name === 'repairManagement1') {
        sessionStorage.setItem('isestate', true)
        this.$router.push({ name: name, params: { projectManagementId: this.projectId } }) // isestate 是否是物业模块报修列表
      } else {
        this.$router.push({ name: name, params: { projectManagementId: this.projectId } })
      }
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
      // return true
    },
    drawerClose () {
      this.detailsdrawershow = false
    },
    dialogHide () {
      this.adddialogVisible = false
    },
    changeNav (inx) {
      this.navList.forEach(item => {
        item.value = false
      })
      this.navList[inx].value = true
      this.flg = inx
      this.currentPage = 1
      this.query()
    },
    formatBillStatus (row, column) {
      let res = ''
      if (row.flowState === 'NO') {
        res = '未匹配'
      } else if (row.flowState === 'OK') {
        res = '完全匹配'
      } else if (row.flowState === 'SECTION') {
        res = '部分匹配'
      }
      return res
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    querySeach () {
      this.currentPage = 1
      this.repairRecordNum()
      this.query()
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    eqTypeChange () {
      context.http.get(`cms/api/equirements/equirementType/${this.addData.equirementType}`).then(res => {
        this.eqNumberOptions = JSOG.decode(res.data)
      })
    },
    getNowTime () {
      var now = new Date()
      var year = now.getFullYear()
      var month = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)
      var day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
      var hour = now.getHours()
      var minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
      var second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()
      var nowdate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      return nowdate
    },
    async imageChange (event) {
      // this.errorField = false
      let path = ''
      let files = event.target.files
      if (files.length > 0) {
        if (files[0].size > (1024 * 1024 * 3) || (files[0].type !== 'image/png' && files[0].type !== 'image/jpeg')) {
          // this.errorField = true
          this.errorTip = '上传图片格式不正确'
          return
        }
        let form = new FormData()
        form.append('file', files[0])
        context.http.post('/ywm/api/image-multipart', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          path = res.data
          this.addData.faultImage = path
        }).catch(error => {
          console.info(error)
        })
      }
    },
    async queryCharge () {
      let result = await context.http.get('uaa/api/user-posts', {
        page: (this.currentPage - 1),
        size: 100,
        sort: 'desc',
        useStatus: 'USING',
        name: this.postCode,
        code: this.postCode
      })
      this.chargeOption = result.data
    }
  }
}
</script>
<style lang="scss" scoped>
.device-repair {
  font-size: 16px;
  background-color: #f9f9f9;
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
      display: -ms-flexbox;
      display: flex;
      margin-top: 20px;
      background-color: #fff;
      padding: 0 15px;
      justify-content: space-between;
      flex-wrap: wrap;
      .btnDiv {
        display: inline-block;
        margin-bottom: 15px;
        > span {
          display: inline-block;
          width: 120px;
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
          // &:last-child{
          //   background-color: #49AF61;
          // }
        }
      }
      > div {
        > div {
          margin-top: 15px;
        }
      }
    }
    .el-date-editor {
      .el-input__prefix,
      .el-input__suffix {
        top: 0 !important;
      }
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
      margin-top: 20px;
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
    }
    .el-textarea {
      width: 178px;
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
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
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
