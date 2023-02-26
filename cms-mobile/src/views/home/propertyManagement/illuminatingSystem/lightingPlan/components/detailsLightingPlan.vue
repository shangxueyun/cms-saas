<template>
  <div class="detailsLightingPlan">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="routerTo()"></i>
      <div class="headTab">
        <span>{{ settingType == '常规照明' ? '常规照明' : '节假日/特殊日期' }}</span>
      </div>
      <!-- <div
        v-if="!isEdit"
        @click="isEdit = true"
        class="addBtn">
        编辑
      </div> -->
      <div
        @click="submit"
        v-if="settingType == '常规照明' && tableData.length !== 0"
        class="addBtn">
        保存
      </div>
      <div
        v-else
        @click="submit"
        class="addBtn">
        保存
      </div>
    </div>


    <!-- 常规照明 -->
    <div class="content" v-if="settingType == '常规照明'">
      <div class="headTile fixed">
        <span>群组照明设置</span>
        <span>已配置群组 {{ Statisticscount.group }}/{{ Statisticscount.all }}</span>
      </div>
      <mt-loadmore ref="loadmore"
                   :bottom-method="loadBottom"
                   :autoFill="false"
                   :bottom-all-loaded="allLoaded">
        <div class="basic-information" v-for="(item, index) in tableData" :key="index" >
          <div class="ul-warp">
            <div class="content-ul project">
              <span class="flag" > <i></i>{{ item.name }}</span>
            </div>
            <div class="content-ul" :style="item.lightingPlan ? '' : 'border: none'">
              <span>照明计划</span>
              <span v-if="!isEdit">
                {{ item.lightingPlan ? item.lightingPlan.name : '' }}
              </span>
              <span v-if="isEdit" @click="planPopupShow = true;groupListKey = index">{{ item.lightingPlan ? item.lightingPlan.name : '请选择' }} <i class="iconfont iconright"></i></span>
              <!-- 修改值为空时候 -->
            </div>
            <div class="content-ul" v-if="item.lightingPlan" style="border: none">
              <span>计划说明</span>
              <span class="scroll Working-plan" style="display: block;overflow: scroll;">
                <template v-for="(item, index) in item.lightingPlan.remarkD">
                  <span :key="index" style="display: block;width: max-content;">
                    {{ item.Date }}&nbsp;&nbsp;{{ item.times }}
                  </span>
                </template>
              </span>
            </div>
          </div>
        </div>
      </mt-loadmore>
      <div class="loadAll"
           v-if="allLoaded && tableData.length!==0">
        <span>-</span>
        <p>已经到底了</p>
        <span>-</span>
      </div>
      <div class="noData"
           v-if="tableData.length===0 && dataReady">
        <img :src="NOdata">
        <p>暂无数据</p>
      </div>
    </div>


    <!-- 节假日/特殊日期 -->
    <div class="content" v-else>
      <div class="headTile">
        <span>节假日/特殊日期添加（已添加{{ EditTimes.length }}个）</span>
        <span><van-button v-if="isEdit" @click="popupShowStart = true"  color="#0139A4" plain size="mini">添加</van-button></span>
      </div>
      <div class="timeQuantum">
        <!-- 日期添加 -->
        <template v-for="(item, index) in EditTimes">
          <p v-if="item.end" :key="index">
            <span>{{ `${formatDateS(item.start)} ～ ${formatDateS(item.end)}` }}</span>
            <i v-if="isEdit" class="iconfont iconcms_qingchu-238" @click="EditTimeRom(EditTimes, index)"></i> 
          </p>
        </template>
      </div>
      <div class="headTile">
        <span>自定义群组照明设置（已添加{{ groupListData.length }}个）</span>
        <span><van-button v-if="isEdit"  @click="loopPlan = true;projectId = projectManagementId" color="#0139A4" plain size="mini">添加</van-button></span>
      </div>
      <!-- 群组添加时间段 -->
      <div class="basic-information" v-for="(item, index) in groupListData" :key="index">
        <div class="ul-warp">
          <div class="content-ul project">
            <span class="flag" > <i></i>{{ item.groupName }}</span>
            <span><i v-if="isEdit" @click="groupListData.splice(index, 1)" class="iconfont iconcms_shanchu-233 font"></i></span>
          </div>
          <div class="content-ul" style="border: none">
            <span>开启时间段<i class="required" v-if="isEdit">*</i></span>
            <span v-if="isEdit" @click="popupTimeShowStart = true; groupListKey = index" class="right"><i class="iconfont icontianjia"></i>添加</span>
          </div>
          <div class="content-ul" style="border: none">
            <div class="Working-plan open">
              <template v-for="(itemC, indexC) in item.childTimes">
                <p v-if="itemC.end" :key="indexC">
                  <span>{{ `${formatDateTime(itemC.start)} 至 ${formatDateTime(itemC.end)}` }}</span> 
                  <i @click="childTimeRom(groupListData, index, indexC)" v-if="isEdit" class="iconfont iconcms_qingchu-238"></i> 
                </p>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 节假日/特殊日期下拉选择 -->
    <!-- 开始时间 -->
    <van-popup v-model="popupShowStart"
               position="bottom">
      <van-datetime-picker
                  v-model="currentDateStart"
                  type="date"
                  title="请选择开始日期"
                  :min-date="minDate"
                  @confirm="confirmDayTimeStart"
                  @cancel="cancelDate" />
    </van-popup>
    <!-- 结束时间 -->
    <van-popup v-model="popupShowEnd"
               position="bottom">
      <van-datetime-picker
                  v-model="currentDateEnd"
                  type="date"
                  title="请选择结束日期"
                  :min-date="minDate"
                  @confirm="confirmDayTimeEnd"
                  @cancel="popupShowEnd = false; popupShowStart = true" />
    </van-popup>
    <!-- 节假日/特殊时间下拉选择 -->
    <!-- 开始时间 -->
    <van-popup v-model="popupTimeShowStart"
               position="bottom">
      <van-datetime-picker
                  v-model="currentTimeStart"
                  type="time"
                  title="请选择开始时间"
                  @confirm="confirmTimeStart"
                  @cancel="cancelTime" />
    </van-popup>
    <!-- 结束时间 -->
    <van-popup v-model="popupTimeShowEnd"
               position="bottom">
      <van-datetime-picker
                  v-model="currentTimeEnd"
                  type="time"
                  title="请选择结束时间"
                  @confirm="confirmTimeEnd"
                  @cancel="popupTimeShowEnd = false; popupTimeShowStart = true" />
    </van-popup>
    <!-- 照明计划下拉选择 -->
    <van-popup v-model="planPopupShow"
               position="bottom">
      <van-picker show-toolbar
                  ref="picker"
                  title="请选择"
                  value-key='name'
                  @confirm="planConfirmFn"
                  @cancel='planPopupShow=false'
                  :columns="lightingPlanList" />
    </van-popup>

    <van-popup duration="0.3" :lock-scroll="false" v-model="loopPlan"
      class="stylePopup"
      position="bottom">
            <screenPull
        v-if="loopPlan"
        title="选择群组"
        data-type="group"
        :project-id="projectId"
        :transfer-data="groupListData"
        @confirm="screenPullConfirm"
        @cancel="screenPullCancel" />
    </van-popup>
  </div>
</template>
<script>
import context from '@/service'
import Vue from 'vue'
import common from '@/utils/common.js'
import { formatDate } from '@/utils/validate.js'
import moment from 'moment-timezone'
import { MessageBox } from 'mint-ui'
import screenPull from '../../../components/screenPull.vue'

import { Button, DatetimePicker, Toast } from 'vant'
Vue.use(Button)
Vue.use(DatetimePicker)
Vue.use(Toast)

export default {
  name: 'detailsGroup',
  components: { screenPull },
  data () {
    return {
      RecordDetail: {},
      NOdata: require('@/assets/nores.png'),
      isEdit: true,
      tableData: [],

      popupShowStart: false,
      currentDateStart: '',
      popupShowEnd: false,
      currentDateEnd: '',

      groupListKey: '', // 记录父级key
      popupTimeShowStart: false,
      popupTimeShowEnd: false,
      currentTimeStart: '00:00',
      currentTimeEnd: '00:00',

      groupListData: [],
      loopPlan: false,
      planPopupShow: false,
      ProjectOptions: [],
      lightingPlanList: [],
      minDate: new Date(2020, 0, 1),
      planOptions: [],
      EditTimes: [],
      currentPage: 1,
      pgNum: 1,
      total: 0,
      pgSize: 15,
      dataReady: false,
      allLoaded: false,
      settingType: '',
      projectId: '',
      projectManagementId: '',
      Statisticscount: {
        all: '',
        group: ''
      },
      returnObj: false
    }
  },
  created () {
    this.settingType = this.$route.params.type
    this.Statisticscount = this.$route.params.RouteParams
    this.projectManagementId = this.$route.params.filter.projectManagementId
    if (this.settingType === '常规照明') {
      this.getlightingPlanList(this.$route.params.filter.projectManagementId)
    } else {
      this.getGroupHolidaysList(this.$route.params.filter.projectManagementId)
      this.EditTimesList(this.$route.params.filter.projectManagementId)
    }
  },
  // 离开
  beforeRouteLeave (to, from, next) {
    if (to.name === 'illuminatingSystem') {
      // 默认数据
      to.params.filter = this.$route.params.filter
      to.params.config = this.$route.params.config
    }

    next()
  },
  mounted () {
    this.$parent.$refs['content'].scrollTop = 0
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    formatDateS (time) {
      return formatDate(time)
    },
    formatDateTime (time) {
      let times = new Date(time)
      return `${times.getHours().toString().length === 2 ? times.getHours() : '0' + times.getHours()}:${times.getMinutes().toString().length === 2 ? times.getMinutes() : '0' + times.getMinutes()}`
    },
    routerTo () {
      this.$router.push({ name: 'illuminatingSystem' })
    },
    async getGroupList (id) {
      this.dataReady = false
      context.http.get(`rms/api/lightingGroup/list/${id}`).then(res => {
        this.dataReady = true
        if (res.status === 200) {
          this.tableData = this.tableData.concat(res.data)
          let arr = this.lightingPlanList
          let vm = this
          res.data.forEach((v, i) => {
            arr.forEach(o => {
              if (v.lightingPlanId === o.id) {
                vm.groupListKey = i
                vm.planConfirmFn(o)
              }
            })
          })
          this.total = Number(res.headers['x-total-count'] ? res.headers['x-total-count'] : res.data.length)
          this.allLoaded = true// 若数据已全部获取完毕
          console.log('全部获取完毕')
        }
      })
    },
    async getGroupHolidaysList (id) {
      context.http.get(`rms/api/lightingPlan/holidays?projectManagementId=${id}`).then(res => {
        this.dataReady = true
        if (res.status === 200) {
          this.groupListData = []
          res.data.forEach(v => {
            let times = v.dates[0].times
            let arr = []
            times.forEach(t => {
              arr.push({
                start: new Date(`2020/01/01 ${t.startTime}:00`),
                end: new Date(`2020/01/01 ${t.endTime}:00`)
              })
            })
            this.groupListData.push({
              groupId: v.groupId,
              id: v.groupId,
              groupName: v.groupName,
              childTimes: arr
            })
          })
        }
      })
    },
    async EditTimesList (id) {
      context.http.get(`rms/api/lightingPlan/holidays/dates?projectManagementId=${id}`).then(res => {
        this.dataReady = true
        if (res.status === 200) {
          this.EditTimes = []
          res.data.forEach(v => {
            this.EditTimes.push({
              start: new Date(`${v.startDate.replace(/-/g, '/')} 00:00:00`),
              end: new Date(`${v.endDate.replace(/-/g, '/')} 00:00:00`)
            })
          })
        }
      })
    },
    loadBottom (id) {
      this.currentPage++
      this.getGroupList(this.$route.params.filter.projectManagementId)
      this.$refs.loadmore.onBottomLoaded()
    },
    // 获取项目下的计划配置列表
    async getlightingPlanList (id) {
      this.lightingPlanList = []
      let result = await context.http.get(`rms/api/lightingPlan/all?projectManagementId=${id}`)
      if (result.status === 200) {
        this.lightingPlanList = result.data
      }
      this.getGroupList(id)
    },
    planConfirmFn (item) {
      // 时间格式 Date [{ Date: '01-01 - 02-02', times: '18:00至18:30,18:00至18:30' }]
      // dates
      let DateArr = []
      let dates = item.dates
      dates.forEach((v, i) => {
        DateArr[i] = {
          Date: `${v.startDate} - ${v.endDate}`,
          times: ''
        }
        v.times.forEach((t, key) => {
          if (key !== v.times.length - 1) {
            DateArr[i].times += `${t.startTime}至${t.endTime},`
          } else {
            DateArr[i].times += `${t.startTime}至${t.endTime}`
          }
        })
      })
      let { id, name } = item
      this.tableData[this.groupListKey].lightingPlan = {
        id,
        name,
        remarkD: DateArr
      }
      this.planPopupShow = false
    },
    screenPullConfirm (row) {
      // 选择后数据保存
      let arr = []
      row.forEach(v => {
        arr.push({
          groupId: v.id || v.groupId,
          id: v.id,
          groupName: v.groupName ? v.groupName : v.name,
          childTimes: v.childTimes ? v.childTimes : []
        })
      })
      this.groupListData = arr
      this.loopPlan = false
    },
    screenPullCancel () {
      this.loopPlan = false
    },
    // 日期添加开始
    confirmDayTimeStart (time) {
      if (this.EditTimes.length !== 0) {
        if (!this.EditTimes[this.EditTimes.length - 1].end) {
          this.EditTimes[this.EditTimes.length - 1].start = time
        } else {
          this.EditTimes.push({
            start: time,
            end: ''
          })
        }
      }
      if (this.EditTimes.length === 0) {
        this.EditTimes.push({
          start: time,
          end: ''
        })
      }

      this.popupShowStart = false
      this.popupShowEnd = true
    },
    confirmDayTimeEnd (time) {
      let row = this.EditTimes[this.EditTimes.length - 1]
      row.end = time
      this.EditTimes[this.EditTimes.length - 1] = row
      if (this.EditTimes.length > 1) {
        // 判断单个日期段是否合法
        if (row.end - row.start < 0) {
          this.EditTimes.splice((this.EditTimes.length - 1), 1)
          Toast({
            message: '结束日期不得小于开始日期，请重新添加',
            position: 'top'
          })

          this.popupShowEnd = false
          this.currentDateStart = this.minDate
          this.currentDateEnd = this.minDate
          return
        }
        // 判断去重 函数结构  EditTimes 当前时间数组 undefined 递归下标 函数1成功 函数2失败
        this.Recursive(this.EditTimes, undefined, (vm) => {
          vm.popupShowEnd = false
        }, (vm) => {
          vm.EditTimes.splice((vm.EditTimes.length - 1), 1)
          Toast({
            message: '您添加的日期与已有日期存在冲突',
            position: 'top'
          })
          vm.popupShowEnd = false
        })
      } else {
        // 判断单个日期段是否合法
        if (row.end - row.start < 0) {
          this.EditTimes = []
          Toast({
            message: '结束日期不得小于开始日期，请重新添加',
            position: 'top'
          })
        }
        this.popupShowEnd = false
      }
      this.currentDateStart = this.minDate
      this.currentDateEnd = this.minDate
    },
    EditTimeRom (Data, key) {
      this.EditTimes.splice(key, 1)
    },
    cancelDate () {
      this.popupShowStart = false
      this.currentDateStart = this.minDate
      if (!this.EditTimes[this.EditTimes.length - 1].end) {
        this.EditTimes.splice((this.EditTimes.length - 1), 1)
      }
    },
    // end 日期添加结束
    // 时间添加开始
    confirmTimeStart (time) {
      let arr = this.groupListData[this.groupListKey].childTimes
      if (arr.length !== 0) {
        if (!arr[arr.length - 1].end) {
          arr[arr.length - 1].start = new Date(`2020/01/01 ${time}`)
        } else {
          arr.push({
            start: new Date(`2020/01/01 ${time}`), // 默认添加年月日为筛选做的准备
            end: ''
          })
        }
      }
      if (arr.length === 0) {
        arr.push({
          start: new Date(`2020/01/01 ${time}`),
          end: ''
        })
      }
      this.groupListData[this.groupListKey].childTimes = arr

      this.popupTimeShowStart = false
      this.popupTimeShowEnd = true
    },
    confirmTimeEnd (time) {
      let arr = this.groupListData[this.groupListKey].childTimes
      let row = arr[arr.length - 1]
      row.end = new Date(`2020/01/01 ${time}`)
      arr[arr.length - 1] = row
      if (arr.length > 1) {
        // 判断单个日期段是否合法
        if (row.end - row.start < 0) {
          arr.splice((arr.length - 1), 1)
          Toast({
            message: '结束时间不得小于开始时间，请重新添加',
            position: 'top'
          })

          this.popupTimeShowEnd = false
          this.currentTimeStart = '00:00'
          this.currentTimeEnd = '00:00'
          this.groupListData[this.groupListKey].childTimes = arr
          return
        }
        // 判断去重 函数结构  EditTimes 当前时间数组 undefined 递归下标 函数1成功 函数2失败
        this.Recursive(arr, undefined, (vm) => {
          vm.popupTimeShowEnd = false
        }, (vm) => {
          vm.groupListData[vm.groupListKey].childTimes.splice((vm.groupListData[vm.groupListKey].childTimes.length - 1), 1)
          Toast({
            message: '您添加的时间段与现有时间段存在冲突',
            position: 'top'
          })
          vm.popupTimeShowEnd = false
        })
      } else {
        // 判断单个日期段是否合法
        if (row.end - row.start < 0) {
          arr = []
          Toast({
            message: '结束时间不得小于开始时间，请重新添加',
            position: 'top'
          })
          this.groupListData[this.groupListKey].childTimes = arr
        }
        this.popupTimeShowEnd = false
      }
      this.currentTimeStart = '00:00'
      this.currentTimeEnd = '00:00'
    },
    childTimeRom (groupListData, index, indexC) {
      this.groupListData[index].childTimes.splice(indexC, 1)
    },
    cancelTime () {
      this.popupShowStart = false
      this.currentDateStart = this.minDate
      if (!this.EditTimes[this.EditTimes.length - 1].end) {
        this.EditTimes.splice((this.EditTimes.length - 1), 1)
      }
      this.popupTimeShowStart = false
      this.currentTimeStart = '00:00'
      if (!this.groupListData[this.groupListKey].childTimes[this.groupListData[this.groupListKey].childTimes.length - 1].end) {
        this.groupListData[this.groupListKey].childTimes.splice((this.groupListData[this.groupListKey].childTimes.length - 1), 1)
      }
    },
    submit () {
      let url
      let params
      let type
      if (this.settingType === '常规照明') {
        params = []
        this.tableData.forEach(v => {
          if (v.lightingPlan) {
            params.push({
              lightingGroupId: v.id,
              lightingPlanId: v.lightingPlan.id
            })
          }
        })
        type = 'put'
        url = 'rms/api/lightingGroup/plan'
      } else {
        let EditTimes = []
        if (!this.EditTimes.length) {
          Toast({
            message: '请选择节假日特殊日期',
            position: 'top'
          })
          return
        }

        this.EditTimes.forEach((v, i) => {
          EditTimes.push({
            startDate: this.formatDateS(v.start),
            endDate: this.formatDateS(v.end)
          })
        })

        if (!this.groupListData.length) {
          Toast({
            message: '请添加群组',
            position: 'top'
          })
          return
        }

        let flagO
        params = []
        this.groupListData.forEach((v, i) => {
          if (!v.childTimes.length) {
            flagO = {
              flag: true,
              name: v.groupName
            }
          }
          let time = []
          v.childTimes.forEach(t => {
            time.push({
              startTime: this.formatDateTime(t.start),
              endTime: this.formatDateTime(t.end)
            })
          })
          EditTimes.forEach(c => {
            c.times = time
          })
          params.push(Object.assign({
            groupId: v.groupId,
            groupName: v.groupName,
            projectManagementId: this.$route.params.filter.projectManagementId
          }, {
            dates: JSON.parse(JSON.stringify(EditTimes))
          }))
        })

        if (flagO) {
          Toast({
            message: `请添加${flagO.name}群组的开启时段`,
            position: 'top'
          })
          return
        }

        if (!params.length) {
          params = this.$route.params.filter.projectManagementId
          url = 'rms/api/lightingPlan/holidays'
          type = 'delete'
        } else {
          params.reverse()
          url = 'rms/api/lightingPlan/list'
          type = 'post'
        }
      }
      context.http[type](url, params).then(res => {
        if (res.status === 200) {
          // 成功进行清空
          this.returnObj = true
          this.transferData = []
          Toast({
            message: '保存成功',
            position: 'top'
          })
          this.routerTo()
        }
      })
    },
    // 递归循环
    Recursive (Data, len, succee, fail) {
      if (Data === null) {
        return
      }
      let index = Data[len]
      if (!index) {
        index = Data[0]
        len = 0
      }
      if (len === Data.length - 1) {
        succee(this)
        Data = []
        return
      } else {
        let vm = this
        let flag = false
        Data.forEach((v, i) => {
          if (i !== len) {
            if (vm.IsDateIntersection(index.start, index.end, v.start, v.end)) {
              flag = true
            }
          }
        })
        if (flag) {
          fail(vm)
          return
        } else {
          len++
          this.Recursive(Data, len, succee, fail)
        }
      }
    },
    // 日期交集判断
    IsDateIntersection (start, end, start1, end1) {
      if (start >= start1 && start <= end1) {
        return true
      }
      if (end >= start1 && end <= end1) {
        return true
      }
      if (start <= start1 && end >= end1) {
        return true
      }
      // 没有交集
      return false
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../../../style/config";
.detailsLightingPlan {
  .noData_text {
    height: rem(80);
    line-height: rem(80);
    text-align: center;
    color: #878a9a;
  }
  .head {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: rem(40);
    line-height: rem(40);
    overflow: hidden;
    text-align: center;
    font-size: rem(16);
    background: #fff;
    display: flex;
    justify-content: space-between;
    z-index: 9;
    .headTab {
      color: #444547;
      font-size: rem(16);
      width: rem(200);
      display: flex;
      justify-content: center;
      > span {
        position: relative;
        &.active {
          color: #0139a4;
          border-bottom: rem(3) solid #0139a4;
          font-weight: bold;
        }
        &:nth-child(2) {
          margin-left: rem(40);
        }
      }
    }
    .back {
      width: rem(40);
      height: rem(40);
      font-size: rem(18);
      color: #000000;
      &:first-child {
        float: left;
      }
    }
    .addBtn {
      width: rem(60);
      height: rem(40);
      position: relative;
      color: #0139a4;
      font-size: rem(15);
      margin-right: rem(0);
    }
    .selected {
      color: #0139a4;
    }
  }
  .content {
    width: 100%;
    position: relative;
    top: rem(40);
  }
  .headTile{
    padding: 0 rem(14);
    display: flex;
    justify-content: space-between;
    height: rem(40);
    line-height: rem(40);
    background: #F0F1F2;
    color: #858C94;
    font-size: rem(15);
  }
  .fixed{
    position: fixed;
    width: 100%;
    z-index: 11;
  }
  // <p><span>2021-01-01 ～ 2021-01-03</span> <i class="iconfont iconcms_qingchu-238"></i> </p>
  .timeQuantum{
    padding: 0 rem(14);
    p{
      line-height: rem(22);
      width: 80%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      height: rem(22);
      margin: rem(8) auto;
      padding: 0 rem(14);
      background: #DAEAFF;
      border-radius: rem(2);
      span{
        color: #444547;
        font-size: rem(13);
      }
      i{
        color: #757B82;
      }
    }
  }
  .basic-information {
    margin-bottom: rem(10);
    background: #fff;
  }
  .content-title {
    color: #18191a;
    font-size: rem(17);
    height: rem(40);
    line-height: rem(40);
    font-weight: bold;
    padding-left: rem(14);
    border-bottom: rem(1) solid #f0f0f0;
  }
  .van-field__label{
    font-size: rem(15);
    color: #858c94;
  }
  .ul-warp {
    border-bottom: rem(1) solid #f0f0f0;
    padding-bottom: rem(16);
    &:last-child {
      border: none;
    }
    .annex{
      margin-top: rem(10);
      font-size: rem(15);
      color: #858C94;
      .sapn{
        font-size: rem(13);
      }
      .right{
        position: absolute;
        color: #0139A4;
        right: rem(10);
      }
      .icontianjia{
        margin-right: rem(5);
      }
    }
  }
  .tableList{
    position: relative;
    padding-top: rem(8);
    background: #FFFFFF;
    .flex{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .shopNb{
        font-size: rem(15);
        color: #444547;
        font-weight: bolder;
        padding-bottom: rem(10);
      }
      .tab{
        font-size: rem(14);
        color: #858C94;
      }
    }
    .iconright{
      position: absolute;
      right: rem(16);
      top: 50%;
      background: linear-gradient(90deg, #C6C6C6 0%, #C6C6C6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .border{
    clear: both;
  }
  .content-ul {
    display: flex;
    justify-content: space-between;
    font-size: rem(15);
    position: relative;
    min-height: rem(44);
    line-height: rem(44);
    padding: 0 rem(14);
    border-bottom: rem(1) solid #F0F0F0;
    > span {
      color: #18191a;
      &:first-child {
        color: #18191A;
        min-width: rem(64);
        margin-right: rem(10);
        word-wrap: break-word;
      }
    }
    .right{
      position: absolute;
      color: #0139A4;
      right: rem(10);
    }
    .icontianjia{
      margin-right: rem(4);
    }
    .Working-plan{
      min-height: rem(44);
      width: 78%;
      margin-top: rem(28);
      color: #858C94;
      font-size: rem(15);
      line-height: rem(26);
    }
    .scroll{
      min-height: rem(44);
    }
    .open{
      margin-top: 0;
      width: 82%;
      line-height: rem(26);
      display: flex;
      flex-wrap: wrap;
      p{
        line-height: rem(22);
        width: 46%;
        display: flex;
        justify-content: space-between;
        height: rem(22);
        margin: rem(8) 0;
        padding: 0 rem(6);
        background: #DAEAFF;
        border-radius: rem(2);
        float: left;
        margin-right: 10px;
        span{
          color: #444547;
          font-size: rem(13);
        }
        i{
          color: #757B82;
        }
      }
    }
    .flag{
      position: relative;
      margin-left: rem(12);
      i{
        position: absolute;
        top: 43%;
        display: block;
        width: rem(8);
        height: rem(8);
        background: transparent;
        left: rem(-12);
        border-radius: rem(10);
        border: rem(2) solid #0139A4;
      }
    }
    input {
      text-align: right;
    }
    .dingwe{
      color: #858C94;
      font-size: rem(12);
      height: rem(18);
      line-height: rem(18);
      position: absolute;
      top: rem(48);
      right: rem(16);
      max-width: 48%;
      text-align: justify;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .sapn{
        font-size: rem(13);
    }
    .iconfont{
      font-size: rem(15);
    }
  }
  .height{
    height: rem(86);
  }
  .noneFlex{
    display: flex;
    .left{
      display: block;
      float: left;
      width: 70px;
      margin-right: 6px;
      img{
        width: rem(70);
        height: rem(54);
      }
    }
    .content_noneFlex{
      display: block;
      float: left;
      width: 66%;
      p{
        line-height: rem(32);
      }
      p:first-child{
        font-size: rem(15);
        color: #18191A;
        font-weight: bolder;
      }
      p:last-child{
        font-size: 14px;
        color: #858C94;
      }
    }
    .right{
      display: block;
      width: 12%;
      text-align: center;
      line-height: rem(62);
    }
  }
  .content-div {
    padding-top: rem(16) !important;
    font-size: rem(15);
    position: relative;
    > span {
      color: #858c94;
    }
    > div {
      padding-top: rem(10);
      color: #18191a;
    }
    .add-pic {
      position: absolute;
      right: rem(14);
      color: #023c8f;
      i {
        margin-right: rem(2);
      }
    }
    &.long-div {
      input {
        width: 100%;
      }
    }
  }
  .border-top {
    border-top: rem(1) solid #f0f0f0;
    margin-top: rem(12);
  }
  .list {
    padding-left: rem(14);
    li {
      padding: rem(16) rem(14) rem(16) 0;
      position: relative;
      background: #fff;
      border-bottom: rem(1) solid #f0f0f0;
      &:last-child {
        border: 0;
      }
      > p {
        display: flex;
        width: 100%;
        justify-content: space-between;
        margin-bottom: rem(6);
        > span {
          display: block;
          line-height: rem(20);
          color: #858c94;
          font-size: rem(15);
          width: rem(90);
          text-align: right;
        }
        > span:first-child {
          text-align: left;
          flex: 1;
          color: #18191a;
          font-weight: 600;
          font-size: rem(15);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: rem(5);
          > span {
            background: #eff6ff;
            height: rem(17);
            font-weight: 500;
            line-height: rem(17);
            font-size: rem(12);
            color: #0139a4;
            padding: 0 rem(3);
            vertical-align: center;
            margin-left: rem(12);
          }
        }
      }
      > div {
        > p {
          color: #444547;
          font-size: rem(14);
          margin-bottom: rem(8);
          &:last-child {
            margin-bottom: 0;
          }
          span {
            color: #858c94;
          }
        }
        > .momoInfo {
          font-size: rem(15);
          color: #18191a;
        }
        > .momoDate {
          font-size: rem(13);
          color: #858c94;
          text-align: right;
        }
      }
      > span {
        position: absolute;
        right: rem(10);
        top: rem(45);
        font-size: rem(17);
        color: #c6c6c6;
      }
    }
  }
  .contractLoadAll {
    > p {
      // width:rem(80);
    }
  }
}
</style>
<style lang="scss">
@import "../../../../../../style/config";
  .detailsLightingPlan .van-button--mini{
    border-radius: rem(4);
    width: rem(44);
  }
  .detailsLightingPlan .content .mint-loadmore-content {
    padding-top: 1rem;
  }
  .detailsLightingPlan .noData {
    position: relative;
    top: rem(80);
  }
  .detailsLightingPlan .stylePopup{
    min-height: 100%;
  }
</style>
