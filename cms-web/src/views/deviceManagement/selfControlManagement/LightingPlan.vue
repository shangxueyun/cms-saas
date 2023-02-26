<template>
  <div class="LightingPlan">
    <div class="tab">
      <span :class="{'active':showModule===1}"
            @click="cutModule(1)">常规照明</span>
      <span :class="{'active':showModule===2}"
            @click="cutModule(2)">节假日/特殊日期</span>
    </div>
    <div class="showBox"></div>
    <div class="btn">
      <div class="save"
           :class="{'noData':groupList.length===0}"
           v-if="showModule===1"
           @click="saveFn1">保存</div>
      <div class="save"
           v-if="showModule===2"
           @click="saveFn2">保存</div>
      <div class="addGroup"
           v-if="showModule===2"
           @click="addPlan">添加群组</div>
    </div>
    <div class="main_content2"
         v-if="showModule===2">
      <div class="addDate">
        <span>添加日期<i class="required">*</i></span>
        <div class="box">
          <div class="list">
            <p v-for="(item,index) in holidaysDates"
               :key="index"
               v-if="holidaysDates.length">
              <span>{{dateFormatter(item.startDate)}} ~ {{dateFormatter(item.endDate)}}</span>
              <i class="iconfont icon-cha"
                 @click="delDates(index)"></i>
            </p>
          </div>
          <!-- <div class="addBtn">添加</div> -->
          <el-button class="time_export addBtn"
                     type="primary"
                     size="mini">添加
            <el-date-picker v-model="value1"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            format="MM-dd"
                            value-format="timestamp"
                            @change="(value) => dateChange(value)">
            </el-date-picker>
          </el-button>
        </div>
      </div>
      <div class="items">
        <div class="item"
             v-for="(item,index) in holidaysItem"
             :key="index">
          <div class="title">
            <i></i>
            {{item.groupName}}
            <span class="icon-cha iconfont"
                  @click="delItem(index)"></span>
          </div>
          <div class="time">
            <span>开启时间段</span>
            <i class="iconfont icon-add-new time_export"> 添加
              <el-time-picker is-range
                              v-model="item.timeArr"
                              range-separator="至"
                              format="HH:mm"
                              value-format="HH:mm"
                              @change="(value) => timeChange(value,index)">
              </el-time-picker>
            </i>
          </div>
          <div class="timeList">
            <div v-if="item.times.length"
                 v-for="(t,i) in item.times"
                 :key="i">
              <span>{{t.startTime}}至{{t.endTime}}
                <i class="iconfont icon-cha"
                   @click="delTimes(index,i)"></i>
              </span>

            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main_content"
         v-if="showModule===1">
      <div class="item"
           v-for="(item,index) in groupList"
           :key="item.id">
        <div class="title"
             :title="item.name">
          <i></i>
          {{nameFormatter(item.name)}}
        </div>
        <div class="select">
          <span>照明计划</span>
          <el-select v-model="item.lightingPlanId"
                     @change="(value) => planChange(value,index)"
                     placeholder="请选择">
            <el-option v-for="itm in options"
                       :key="itm.id"
                       :label="itm.name"
                       :value="itm.id">
            </el-option>
          </el-select>
        </div>
        <span style="padding: 0 10px;color: #666666;"
              v-show="item.dates.length">计划说明</span>
        <div class="scrollDiv">
          <div class="list"
               v-for="(itm,idx) in item.dates"
               :key="idx"
               v-if="item.dates.length">
            <div>
              <span>{{itm.startDate}}～ {{itm.endDate}}</span>
              <div>
                <span v-for="(t,i) in itm.times"
                      :key="i">{{t.startTime}}至{{t.endTime}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 新增群组-->
    <el-dialog class="addRep"
               title="添加群组"
               :visible.sync="detailsShow"
               width="415px"
               :close-on-click-modal="false"
               @close="drawerClose">
      <div class="addFrom">
        <div>
          <el-table :data="groupList1"
                    @selection-change="handleSelectionChange"
                    style="width: 100%">
            <el-table-column type="selection"
                             :selectable="checkSelectable"
                             width="55">
            </el-table-column>
            <el-table-column prop="name"
                             label="群组名称"
                             width="180">
            </el-table-column>
            <el-table-column prop="lightingLoopNumber"
                             label="回路数"
                             width="180">
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer"
             style="text-align: right;padding: 8px 20px 8px;margin-top: 10px;"
             class="dialog-footer">
          <el-button @click="drawerClose"
                     class="close-button">取消</el-button>
          <el-button type="primary"
                     class="defaultbtn dialog-confirmBtn"
                     @click="addFrom">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
import moment from 'moment'
export default {
  name: 'LightingPlan',
  props: {
    projectId: {

    },
    equipmentType: {

    }
  },
  data () {
    return {
      timesFlag: false,
      multipleSelection: [],
      holidaysDates: [],
      holidaysItem: [],
      value1: '',
      projectManagementsList: [],
      groupList: [],
      groupList1: [],
      detailsShow: false,
      showModule: 1,
      value: '',
      timeArr: [],
      options: [],
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
          if (this.showModule === 2) {
            this.getHolidaysDate()
            this.getHolidaysItem()
          } else {
            this.getLightPlan()
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    this.projectManagementsList = this.$store.state.projectManagementsList
  },
  methods: {
    nameFormatter (name) {
      let str = name
      if (name.length > 20) {
        str = name.substring(0, 20) + '...'
      }
      return str
    },
    saveHolidaysItem () { // 节假日提交
      if (!this.holidaysDates.length) {
        this.$message.error('请添加日期')
        return
      }
      if (!this.holidaysItem.length) {
        this.$message.error('请添加群组')
        // this.deleteFun()
        return
      }
      if (this.dataTest()) {
        this.$message.error('您添加的日期与已有日期存在冲突请重新添加')
        return
      }
      if (this.timeTest() || this.timesFlag) {
        if (this.timesFlag) {
          this.$message.error('请选择开启时间段')
          return
        }
        this.$message.error('您添加的时间与已有时间段存在冲突请重新添加')
        return
      }
      // console.log(this.holidaysItem)
      let params = this.holidaysItem.map((item, index) => {
        item.dates = this.holidaysDates.map((itm, idx) => {
          let obj = { startDate: moment(itm.startDate).format('YYYY-MM-DD'), endDate: moment(itm.endDate).format('YYYY-MM-DD') }
          obj.times = item.times
          return obj
        })
        return item
      })
      console.log(params)
      params.reverse()
      context.http.post('rms/api/lightingPlan/list', params).then(res => {
        if (res.status === 200) {
          this.holidaysDates = []
          this.getHolidaysDate()
          this.getHolidaysItem()
          this.$message.success('保存成功')
        }
      })
    },
    deleteFun () {
      context.http.delete(`rms/api/lightingPlan/holidays`, { projectManagementId: this.projectId }).then(res => {
        if (res) {
          this.getHolidaysDate()
          this.getHolidaysItem()
          this.$message.success('保存成功')
        }
      })
    },
    async getHolidaysItem () { // 节假日计划群组列表
      let result = await context.http.get(`rms/api/lightingPlan/holidays`, { projectManagementId: this.projectId })
      this.holidaysItem = result.data.map((item, index) => {
        item.times = item.dates[0].times
        item.timeArr = [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 23, 59)]
        return item
      })
    },
    async getHolidaysDate () { // 节假日日期列表
      let result = await context.http.get(`rms/api/lightingPlan/holidays/dates`, { projectManagementId: this.projectId })
      this.holidaysDates = result.data
    },
    timeTest () {
      let result = 0
      this.timesFlag = false
      this.holidaysItem.forEach((item, index) => {
        item.idnx = index
        if (!item.times.length) {
          this.timesFlag = true
        }
        item.times.forEach((itm, idx) => {
          itm.startTime = moment(moment().startOf('year').format('YYYY-MM-DD') + ' ' + itm.startTime + ':00').valueOf()
          itm.endTime = moment(moment().startOf('year').format('YYYY-MM-DD') + ' ' + itm.endTime + ':00').valueOf()
        })
        item.times.sort(function (a, b) {
          return a.startTime - b.startTime
        })
        for (let i = 1; i < item.times.length; i++) {
          if (item.times[i].startTime <= item.times[i - 1].endTime) {
            result += 1
            break
          }
        }
        item.times.forEach((itm, idx) => {
          itm.startTime = moment(itm.startTime).format('HH:mm')
          itm.endTime = moment(itm.endTime).format('HH:mm')
        })
      })
      return result > 0
    },
    dataTest () { // 日期校验重复
      let datas = this.holidaysDates
      let result = 0
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
    },
    dateFormatter (timestamp) { // timestamp时间戳转日期格式
      return moment(timestamp).format('YYYY-MM-DD')
    },
    delTimes (index, i) {
      this.holidaysItem[index].times.splice(i, 1)
    },
    delDates (i) {
      this.holidaysDates.splice(i, 1)
    },
    delItem (i) {
      this.holidaysItem.splice(i, 1)
    },
    dateChange (value) {
      if (value) {
        this.holidaysDates.push({ startDate: value[0], endDate: value[1] })
        // console.log(this.holidaysDates)
      }
    },
    timeChange (value, index) {
      if (value) {
        this.holidaysItem[index].times.push({ startTime: value[0], endTime: value[1] })
        this.$nextTick(() => {
          this.holidaysItem[index].timeArr = [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 23, 59)]
        })
        // console.log(this.holidaysItem)
      }
    },
    addFrom () {
      if (this.holidaysItem.length) {
        let newArr = []
        this.multipleSelection.forEach((item, index) => {
          let target = this.holidaysItem.find(ee => ee.groupId === item.id)
          if (!target) {
            let obj = {
              dates: [],
              times: [],
              groupName: item.name,
              groupId: item.id,
              projectManagementId: this.projectId
            }
            newArr.push(obj)
          }
        })
        this.holidaysItem = [...this.holidaysItem, ...newArr]
        // console.info(this.holidaysItem)
      } else {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          let obj = {
            dates: [
              // {
              //   endDate: '',
              //   startDate: ''
              // }
            ],
            times: [],
            groupName: this.multipleSelection[i].name,
            groupId: this.multipleSelection[i].id,
            projectManagementId: this.projectId
          }
          this.holidaysItem.push(obj)
        }
        // console.info(this.holidaysItem)
      }
      this.detailsShow = false
    },
    handleSelectionChange (val) {
      // console.log(val)
      this.multipleSelection = val
    },
    checkSelectable (row) {
      return !row.check
    },
    async query () { // 群组item
      let result = await context.http.get(`rms/api/lightingGroup/list/${this.projectId}`)
      this.groupList = result.data.map((item, index) => {
        if (item.lightingPlanId) {
          item.dates = this.options.filter(itm => itm.id === item.lightingPlanId)[0].dates
        } else {
          item.dates = []
        }
        return item
      })
    },
    async addPlan () {
      let result = await context.http.get(`rms/api/lightingGroup/list/${this.projectId}`)
      this.groupList1 = result.data.map((item, index) => {
        item.check = false
        this.holidaysItem.forEach((k, i) => {
          if (item.id === k.groupId) {
            item.check = true
          }
        })
        return item
      })
      // console.log(this.groupList1, this.holidaysItem)
      this.detailsShow = true
    },
    saveFn1 () {
      if (!this.groupList.length) return
      let params = this.groupList.map((item, index) => {
        if (item.lightingPlanId) {
          return { lightingGroupId: item.id, lightingPlanId: item.lightingPlanId }
        }
      }).filter(item => item)
      console.log(params)
      context.http.put(`rms/api/lightingGroup/plan`, params).then(res => {
        if (res) {
          this.query()
          this.$message.success('保存成功')
        }
      })
    },
    saveFn2 () {
      this.saveHolidaysItem()
    },
    planChange (value, index) {
      if (value) {
        let options = this.options.filter(itm => itm.id === value)
        this.groupList[index].dates = options[0].dates
      }
    },
    async getLightPlan () { // 照明计划下拉
      let result = await context.http.get(`rms/api/lightingPlan/all`, { projectManagementId: this.projectId })
      this.options = result.data
      this.query()
    },
    drawerClose () {
      // this.addData.dates = []
      this.detailsShow = false
    },
    cutModule (n) {
      this.showModule = n
      if (n === 2) {
        this.getHolidaysDate()
        this.getHolidaysItem()
      }
    }

  }
}
</script>
<style lang="scss" >
.LightingPlan {
  .dialog-footer {
    background-color: #fff;
  }
  .el-table__header {
    width: 100% !important;
  }
  .el-table__body {
    width: 100% !important;
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
    }
  }
  .el-date-editor .el-range-separator {
    padding: 0;
    line-height: 24px;
    width: 14%;
    color: #303133;
  }
  .main_content {
    .item {
      .el-select {
        .el-input__inner {
          border: none;
          text-align: right;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.LightingPlan {
  .main_content2 {
    .items {
      padding: 0 100px;
      margin-top: 70px;
      display: flex;
      flex-wrap: wrap;
      > .item {
        width: 240px;
        min-height: 135px;
        border: 1px solid #c4d6f8;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.06);
        border-radius: 4px;
        margin-bottom: 15px;
        margin-right: 40px;
        .timeList {
          font-size: 12px;
          color: #3575f6;
          display: flex;
          flex-wrap: wrap;
          padding-left: 15px;
          padding-top: 10px;
          padding-bottom: 10px;
          > div {
            padding: 5px 10px;
            background: rgba(53, 117, 246, 0.1);
            border-radius: 10px;
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            .iconfont {
              font-size: 10px;
              color: #3575f6;
              margin-left: 5px;
              cursor: pointer;
            }
          }
        }
        .time {
          padding: 0 15px 0 20px;
          font-size: 12px;
          display: flex;
          justify-content: space-between;
          > span {
            color: #666666;
          }
          > i {
            font-size: 14px;
            cursor: pointer;
            color: #3575f6;
          }
        }
        .title {
          font-size: 16px;
          font-weight: 500;
          color: #333333;
          display: flex;
          align-items: center;
          padding: 10px;
          position: relative;
          > i {
            display: inline-block;
            width: 4px;
            height: 15px;
            background-color: #3575f6;
            margin-right: 5px;
          }
          > .iconfont {
            position: absolute;
            right: 10px;
            top: 10px;
            cursor: pointer;
          }
        }
      }
    }
    .addDate {
      display: flex;
      align-items: center;
      padding-left: 20px;
      .box {
        width: 820px;
        min-height: 80px;
        border-radius: 2px;
        display: flex;
        justify-content: space-between;
        margin-left: 18px;
        .list {
          width: 830px;
          border: 1px solid #ebebeb;
          min-height: 80px;
          display: flex;
          flex-wrap: wrap;
          padding: 10px;
          > p {
            padding: 0px 15px;
            background-color: rgba(53, 117, 246, 0.2);
            height: 22px;
            margin-right: 10px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            border-radius: 10px;
            color: #3575f6;
            font-size: 14px;
            > .iconfont {
              color: #3575f6;
              font-size: 12px;
              margin-left: 15px;
              cursor: pointer;
            }
          }
        }
        .addBtn {
          border: 1px solid #3575f6;
          background: #3575f6;
          border-radius: 0px 2px 2px 0px;
          width: 80px;
          height: 80px;
          line-height: 80px;
          text-align: center;
          cursor: pointer;
          color: #fff;
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
        }
      }
    }
  }
  .main_content {
    padding: 0 170px 0 60px;
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
    .item {
      width: 240px;
      min-height: 80px;
      background: #ffffff;
      border: 1px solid #c4d6f8;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.06);
      border-radius: 4px;
      font-size: 14px;
      margin-bottom: 15px;
      margin-right: 40px;
      .scrollDiv {
        height: 100px;
        overflow-y: auto;
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
        .list {
          padding: 0 10px;
          margin-bottom: 15px;
          > div {
            padding-left: 10px;
            font-size: 12px;
            color: #999999;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            > div {
              display: flex;
              flex-wrap: wrap;
              flex-direction: column;
            }
          }
        }
      }
      .select {
        display: flex;
        align-items: center;
        padding: 0 10px;
        color: #666666;
        > span {
          flex: none;
        }
      }
      .title {
        font-size: 16px;
        font-weight: 500;
        color: #333333;
        display: flex;
        align-items: center;
        padding: 10px;
        > i {
          display: inline-block;
          width: 4px;
          height: 15px;
          background-color: #3575f6;
          margin-right: 5px;
        }
      }
    }
  }
  .btn {
    height: 60px;
    display: flex;
    flex-direction: row-reverse;
    padding-right: 20px;
    align-items: center;
    margin-bottom: 15px;
    > div {
      cursor: pointer;
      width: 110px;
      height: 35px;
      line-height: 35px;
      text-align: center;
      color: #ffffff;
      border-radius: 4px;
      &.addGroup {
        background: #50b069;
      }
      &.save {
        margin-left: 15px;
        background: #3577f6;
        &.noData {
          background: #cccccc;
        }
      }
    }
  }
  .showBox {
    height: 10px;
    background-color: #f9f9f9;
  }
  .tab {
    height: 60px;
    background: #ffffff;
    box-shadow: 0px 4px 6px 0px rgba(190, 199, 208, 0.2);
    border-radius: 4px;
    display: flex;
    align-items: center;
    > span {
      width: 150px;
      font-size: 16px;
      height: 58px;
      color: #666666;
      line-height: 58px;
      text-align: center;
      cursor: pointer;
      &.active {
        border-bottom: 2px solid #3175f6;
      }
    }
  }
  .btn {
  }
  .contrnt {
  }
}
</style>
