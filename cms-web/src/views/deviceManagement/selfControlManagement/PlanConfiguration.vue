<template>
  <div class="PlanConfiguration">
    <div class="search-bar">
      <div style="display: flex;flex-wrap: wrap;align-items:center">
      </div>
      <div class="btnDiv">
        <el-button class="tban tban1"
                   v-if="hasAuthority('03080117')"
                   @click="addRepFn"><i class="iconfont icon-crm_xinzeng-"></i>新增计划</el-button>
      </div>
    </div>
    <div class="table">
      <el-table :data="tableData"
                style="width: 100%">
        <el-table-column prop="projectManagementName"
                         label="项目简称"
                         align="center"></el-table-column>
        <el-table-column prop="name"
                         label="计划名称"
                         align="center"></el-table-column>
        <el-table-column label="日期时间"
                         align="center">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.dates"
               v-show="index<1"
               style="text-align: left;"
               :key="item.startDate">
              {{item.startDate}}~{{item.endDate}}
              <span v-for="(itm,idx) in item.times"
                    v-show="idx<3"
                    style="margin-left:5px"
                    :key="itm.startTime">
                {{itm.startTime}} 至 {{itm.endTime}}
                <i v-show="idx===2">...</i>
              </span>
              <i v-show="scope.row.dates.length>1">...</i>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         align="center"
                         v-if="hasAuthority('03080119')||hasAuthority('03080120')">
          <template slot-scope="scope">
            <el-button class="el-button--primary operation-btn"
                       size="mini"
                       v-if="hasAuthority('03080119')"
                       @click="handleEdit(scope.$index, scope.row)">查看</el-button>
            <el-button type="danger"
                       size="mini"
                       v-if="hasAuthority('03080120')"
                       @click="delAffirm(scope.$index, scope.row)"
                       plain>删除</el-button>
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
    <!-- 详情、编辑 -->
    <PlanConfigDetails :detailsdrawershow="PlanConfigDetailsShow"
                       ref="PlanConfigDetailsShow"
                       :draweDetaileDataProps="detaileData"
                       @saveSuccess="query"
                       @drawerClose="detailsClose" />
    <!-- 新增计划-->
    <el-dialog class="addRep"
               title="新增计划"
               :visible.sync="detailsShow"
               width="750px"
               :close-on-click-modal="false"
               @close="drawerClose">
      <div class="addFrom">
        <div class="details-content">
          <div class="main-content"
               style="border:none">
            <el-form :model="addData"
                     ref="addData"
                     :rules="addDataRules">
              <div class="basInfo">
                <p class="title"><span class="vertical"></span>基本信息</p>
                <div class="content">
                  <div class="form">
                    <el-form-item prop="projectManagementId">
                      <span>项目简称<i class="required">*</i></span>
                      <el-select v-model="addData.projectManagementId"
                                 style="width:320px"
                                 @change="patrolTypeChange"
                                 size="small"
                                 placeholder="请选择">
                        <el-option v-for="item in projectManagementsList"
                                   :key="item.id"
                                   :label="item.referred"
                                   :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item prop="name">
                      <span>计划名称<i class="required">*</i></span>
                      <el-input v-model="addData.name"
                                style="width:320px"
                                size="small"
                                maxlength="50"></el-input>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="basInfo">
                <div class="half_page_title"
                     style="width:100%">
                  <div><i></i>
                    日期选择
                    <span style="color:#ED0000;font-size: 12px;">提示:日期选择建议覆盖一整年，未覆盖日期系统回路默认为关闭状态</span>
                  </div>
                  <div class="addBtn"
                       @click="addItem"><span class="iconfont icon-crm_xinzeng-"></span><span class="btn">添加日期</span></div>
                </div>
                <div class="planList">
                  <div class="head">
                    <span>日期选择</span>
                    <span>开启时间段</span>
                  </div>
                  <div class="item"
                       v-for="(item,index) in addData.dates"
                       :key="index"
                       :class="{'error':index===errIndex}">
                    <div>
                      <!-- <p>日期选择<span class="required">*</span></p> -->
                      <el-date-picker style="width:220px"
                                      size="small"
                                      v-model="item.dateArr"
                                      type="daterange"
                                      :editable="false"
                                      format="MM-dd"
                                      value-format="timestamp"
                                      :picker-options="pickerOptions"
                                      range-separator="至"
                                      start-placeholder="开始日期"
                                      end-placeholder="结束日期">
                      </el-date-picker>
                    </div>
                    <div>
                      <!-- <p>开启时间段<span class="required">*</span></p> -->
                      <div class="timeArr">
                        <el-button class="time_export"
                                   type="primary"
                                   size="mini">+
                          <el-time-picker is-range
                                          v-model="timeArr"
                                          range-separator="至"
                                          format="HH:mm"
                                          value-format="HH:mm"
                                          @change="(value) => timeChange(value,index)">
                          </el-time-picker>
                        </el-button>
                        <div class="timeItemContent">
                          <div class="timeItem"
                               v-for="(itm,idx) in item.times"
                               :key="idx">
                            <span>{{itm.startTime}} - {{itm.endTime}}</span>
                            <i class="iconfont icon-cms_cuowu"
                               @click="deltimeItem(index,idx)"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="del icon-shanchu- iconfont"
                         @click="delItem(index)"></div>
                  </div>
                </div>
              </div>
            </el-form>
          </div>
        </div>
        <div slot="footer"
             style="text-align: right;padding: 8px 20px 8px;"
             class="dialog-footer">
          <el-button @click="drawerClose"
                     class="close-button">取消</el-button>
          <el-button type="primary"
                     class="defaultbtn dialog-confirmBtn"
                     @click="addFrom('addData')">确定</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 删除提示弹窗 -->
    <el-dialog :visible.sync="deleteDialog"
               class="delaffirm"
               width="21%"
               center>
      <div class="deleteDialog">
        <img src="../../../assets/delete1.png" />
        <div>
          <p>提示</p>
          <span>确认删除？</span>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary"
                   @click="deleteFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
import moment from 'moment'
import PlanConfigDetails from './components/PlanConfigDetails'
export default {
  name: 'PlanConfiguration',
  components: {
    PlanConfigDetails
  },
  props: {
    projectId: {

    },
    equipmentType: {

    }
  },
  data () {
    return {
      delId: null,
      PlanConfigDetailsShow: false,
      detaileData: {},
      flag: false,
      errIndex: null,
      deleteDialog: false,
      timeArr: [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 23, 59)],
      tableData: [],
      detailsShow: false,
      addData: {
        name: '',
        projectManagementId: '',
        dates: [
          // {
          //   dateArr: [],
          //   endDate: '',
          //   startDate: '',
          //   times: [
          //     {
          //       endTime: '',
          //       startTime: ''
          //     }
          //   ]
          // }
        ]
      },
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
      addDataRules: {
        projectManagementId: [
          { required: true, message: '请选择项目简称', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入计划名称', trigger: 'blue' }
        ]
      },
      pickerOptions: {
        disabledDate: time => {
          let start = moment().startOf('year').valueOf()
          let end = moment().endOf('year').valueOf()
          return time.getTime() < start || time.getTime() > end
        }
      }
    }
  },
  watch: {
    projectId: {
      handler (newValue, oldValue) {
        if (newValue) {
          this.addData.projectManagementId = this.projectId
          this.query()
        }
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    this.projectManagementsList = this.$store.state.projectManagementsList
    this.addData.projectManagementId = this.projectId
    // this.query()
  },
  methods: {
    dataTest () { // 日期校验重复
      this.flag = false
      try {
        let datas = this.addData.dates
        let startArr = []
        let endArr = []
        let result = 0
        datas.forEach((item, index) => {
          item.idnx = index
          item.startDate = item.dateArr[0]
          item.endDate = item.dateArr[1]
          item.times.forEach((itm, idx) => {
            itm.startTime = moment(moment().startOf('year').format('YYYY-MM-DD') + ' ' + itm.startTime + ':00').valueOf()
            itm.endTime = moment(moment().startOf('year').format('YYYY-MM-DD') + ' ' + itm.endTime + ':00').valueOf()
          })
          item.times.sort(function (a, b) {
            return a.startTime - b.startTime
          })
          for (let i = 1; i < item.times.length; i++) {
            if (item.times[i].startTime <= item.times[i - 1].endTime) {
              this.errIndex = index
              result += 1
              break
            }
          }
          item.times.forEach((itm, idx) => {
            itm.startTime = moment(itm.startTime).format('HH:mm')
            itm.endTime = moment(itm.endTime).format('HH:mm')
          })
          if (result) {
            this.flag = true
            throw new Error('LoopTerminates')
          }
        })
        datas.sort(function (a, b) {
          return a.startDate - b.startDate
        })
        for (let k = 1; k < datas.length; k++) {
          if (datas[k].startDate <= datas[k - 1].endDate) {
            this.errIndex = datas[k].idnx
            result += 1
          }
        }
        // console.log(datas, this.errIndex)
        return result > 0
      } catch (e) {
        if (e.message !== 'LoopTerminates') throw e
      }
    },
    addFrom () {
      this.$refs['addData'].validate((valid) => {
        if (valid) {
          let mark = false
          if (!this.addData.dates.length) {
            this.$message.error('日期选择 、开启时间段不能为空')
            return
          }
          this.addData.dates.forEach((item, index) => { // 判断 日期选择 、开启时间段不能为空
            if (item.dateArr.length === 0 || item.times.length === 0) {
              mark = true
            }
          })
          if (mark) {
            this.$message.error(' 日期选择 、开启时间段不能为空')
            return
          }
          if (this.dataTest() || this.flag) {
            this.$message.error('所选时间有重叠，请重新选择')
            return
          }
          this.errIndex = null
          this.addData.dates.forEach((item, index) => {
            item.startDate = moment(item.startDate).format('MM-DD')
            item.endDate = moment(item.endDate).format('MM-DD')
          })
          console.log(this.addData)
          context.http.post(`rms/api/lightingPlan`, this.addData).then(res => {
            if (res) {
              this.$message.success('新增成功')
              this.drawerClose()
              this.queryRules()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addItem () {
      let item = {
        endDate: '',
        dateArr: [],
        startDate: '',
        times: []
      }
      this.addData.dates.push(item)
    },
    delItem (index) {
      if (this.addData.dates.length === 1) {
        let item = {
          endDate: '',
          dateArr: [],
          startDate: '',
          times: []
        }
        this.$set(this.addData.dates, 0, item)
        return
      }
      this.addData.dates.splice(index, 1)
    },
    deltimeItem (index, idx) { // 删除时间
      this.addData.dates[index].times.splice(idx, 1)
    },
    timeChange (value, index) {
      if (value) {
        this.addData.dates[index].times.push({ startTime: value[0], endTime: value[1] })
        this.$nextTick(() => {
          this.timeArr = [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 23, 59)]
        })
      }
    },
    async handleEdit (index, row) {
      context.http.get(`/rms/api/lightingPlan/${row.id}`).then(res => {
        this.detaileData = res.data
        this.detaileData.dates = res.data.dates.map((item, index) => {
          item.dateArr = []
          item.dateArr[0] = moment(moment().startOf('year').format('YYYY') + '-' + item.startDate).valueOf()
          item.dateArr[1] = moment(moment().startOf('year').format('YYYY') + '-' + item.endDate).valueOf()
          // item.times.map((itm, idx) => {
          //   itm.timesArr = []
          //   itm.timesArr[0] = itm.startTime
          //   itm.timesArr[1] = itm.endTime
          // })
          return item
        })
        console.log(this.detaileData)
        this.PlanConfigDetailsShow = true
      })
    },
    delAffirm (index, row) {
      this.delId = row.id
      this.deleteDialog = true
    },
    deleteFun () {
      context.http.delete(`rms/api/lightingPlan/${this.delId}`).then(res => {
        if (res) {
          this.deleteDialog = false
          this.$message.success('删除成功')
          this.queryRules()
        }
      })
    },
    drawerClose () {
      this.addData.dates = []
      this.addData.name = ''
      this.$refs['addData'].resetFields()
      this.detailsShow = false
    },
    detailsClose () {
      this.PlanConfigDetailsShow = false
    },
    async query () {
      let result = await context.http.get('rms/api/lightingPlan', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        // sort: 'recordDate,desc',
        projectManagementId: this.projectId
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      this.totalPages = Math.ceil(this.total / this.pgSize)
    },
    queryRules () {
      this.currentPage = 1
      // this.pgSize = 15
      this.query()
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
      // return true
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    patrolTypeChange () {

    },
    addRepFn () {
      this.detailsShow = true
    }
  }
}
</script>
<style lang="scss">
.PlanConfiguration,
.LightingPlan {
  .el-dialog__body {
    .deleteDialog {
      display: flex;
      div {
        margin-left: 15px;
        display: flex;
        flex-wrap: wrap;
        p {
          color: #666666;
          font-size: 20px;
          font-weight: 600;
          width: 100%;
        }
      }
    }
  }
  .time_export {
    position: relative !important;
    padding: 2px 5px;
    .el-date-editor {
      background-color: darkblue !important;
      width: auto !important;
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      opacity: 0;
      width: 100% !important;
      height: 100%;
      padding: 0;
      .el-range__close-icon {
        display: none;
      }
    }
  }
  .el-date-editor .el-range-separator {
    padding: 0;
    line-height: 24px;
    width: 14%;
    color: #303133;
  }
  .tableData {
    .el-table__body-wrapper {
      &::-webkit-scrollbar {
        width: 4px !important;
        height: 4px !important;
      }

      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px #fff;
        background-color: #fff;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 6px #cccccc;
      }
    }
  }
  .el-dialog {
    // width: 750px !important;
    // margin-top: 3vh !important;
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
.PlanConfiguration {
  .delaffirm {
    .el-dialog__body {
      margin: 0 35px !important;
      border-bottom: none;
      padding: 30px 0 !important;
      background-color: #fff;
    }
    .el-dialog__footer {
      text-align: right !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.PlanConfiguration {
  .planList {
    padding: 15px;
    .head {
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f7f8fa;
      font-size: 14px;
      color: #777777;
      padding: 0 250px 0 50px;
      > span {
        &:first-child {
        }
      }
    }
    .item {
      display: flex;
      padding: 10px;
      justify-content: space-between;
      margin-bottom: 10px;
      border-bottom: 1px solid #f3f3f3;
      &.error {
        border: 1px solid #d01522;
      }
      > div {
        display: flex;
        align-items: center;
        > p {
          margin-right: 10px;
        }
        &.del {
          color: #ed0000;
          cursor: pointer;
          margin-right: 15px;
        }
        .timeArr {
          min-height: 32px;
          border: 1px solid #dcdfe6;
          box-sizing: border-box;
          color: #606266;
          background-color: #fff;
          background-image: none;
          border-radius: 4px;
          display: flex;
          align-items: center;
          padding: 0 10px;
          .timeItemContent {
            width: 280px;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            .timeItem {
              padding: 2px 8px;
              background: rgba(53, 117, 246, 0.2);
              color: #3575f6;
              border-radius: 10px;
              margin: 5px 0px 5px 10px;
              > i {
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
  .half_page_title {
    > div {
      &:first-child {
        > span {
          font-size: 12px;
          font-weight: normal;
          margin-left: 15px;
        }
      }
    }
  }
  .addRep {
    .half_page_title {
      .addBtn {
        color: #00b361;
        font-size: 14px;
        font-weight: normal;
        cursor: pointer;
        > span {
          &.iconfont {
            font-size: 16px;
            margin-right: 5px;
          }
          &.btn {
            text-decoration: underline;
          }
        }
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
  .tenant-details.addFrom {
    .el-input__inner {
      height: 32px;
    }
    .el-input__icon {
      line-height: 32px;
    }
  }
  .addFrom {
    .ctc-foot {
      padding: 20px 20px 30px 20px;
    }
    .frequency {
      display: flex;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      .el-input {
        width: 55%;
      }
      .el-select {
        width: 45% !important;
        .el-input {
          width: 100%;
        }
      }
      .el-input__inner {
        border: none;
      }
    }
    .textarea {
      border: none;
    }
    .el-select {
      width: 100%;
    }
  }
  .addFrom {
    .table {
      .normal {
        color: #49af61;
      }
      .abnormal {
        color: #ff6665;
      }
    }
    .el-select {
      width: 100%;
    }
    .main-content {
      padding-top: 20px;
      margin: 0;
      .vertical {
        display: inline-block;
        width: 4px;
        height: 16px;
        background-color: #3575f6;
        border-radius: 2px;
        vertical-align: middle;
        margin-right: 5px;
      }
      .title {
        padding-left: 20px;
        font-size: 16px;
      }
      .mainInfo {
        height: 60px;
        border: 1px solid #dadada;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        padding: 0 20px;
        justify-content: space-between;
        font-size: 14px;
      }
      .basInfo {
        border: 1px solid #dadada;
        padding: 1px 0;
        // min-height: 500px;
        // width: 900px;
        margin-bottom: 10px;
        .queryParams {
          padding: 10px 0 0 15px;
          .query-btn {
            display: inline-block;
            width: 80px;
            margin: 0;
          }
        }
      }
      .content {
        padding: 15px;
        .addequipment {
          color: #3575f6;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
        .form {
          display: flex;
          flex-wrap: wrap;
          .el-form-item {
            width: 46%;
            margin-left: 15px;
            .el-form-item__content {
              > span {
                margin-bottom: 5px;
                display: inline-block;
              }
              > .readOnlyTxt {
                height: 40px;
                line-height: 40px;
                font-size: 14px;
                color: #262626;
              }
              /* .seachDeviceIcon {
                display: inline-block;
                width: 20px;
                height: 20px;
                background: url(../../../../assets/seachDeviceIcon.png) no-repeat;
                position: absolute;
                right: 10px;
                top: 33px;
                cursor: pointer;
              } */
              .el-textarea__inner {
                resize: none !important;
              }
            }
          }
        }
      }
    }
    .dialog-footer {
      background-color: #fff;
    }
    .close-button {
      color: #666 !important;
      background-color: #fff !important;
      border: none !important;
      &:hover {
        color: #3575f6 !important;
      }
    }
    .defaultbtn {
      width: 90px !important;
      margin-left: 0;
    }
  }
}
</style>
