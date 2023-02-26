<template>
  <div class="workingSchedule"
       @click="addMenu=false">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="onGoBack"></i>
      <div class="headTab">
        <span class="active"
              v-if="hasAuthority('03070101')">排班表</span>
        <span @click="tabChange"
              v-if="hasAuthority('03070105')">人员列表</span>
      </div>
      <div class="addBtn widthrightBtn"
           @click="showActionSheet">
        <i class="iconfont iconcms_shaixuan"></i>
      </div>
    </div>
    <div class="title">
      <div @click="showActionSheet">
        <span>{{currentProject.referred}}</span><span>{{currentStatus.label}}</span><span>{{currentWeek.label}}</span>
      </div>
      <span class="detailsBtn"
            @click="detailsRouter"
            v-if="hasAuthority('03070103')">
        班次信息
      </span>
    </div>
    <div class="container">
      <ul v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loadBottom"
          infinite-scroll-distance="20"
          infinite-scroll-immediate-check="false"
          v-if="tableData.length"
          class="list">
        <li v-for="(item, index) in tableData"
            :key="index"
            :class="{'isToday':isToday(item.date)}">
          <p>
            <span>{{item.date}}</span>
          </p>
          <div>
            <p v-for="(value,key,i) in item"
               v-show="i!==0"
               :key="i">
              {{key}}：{{value}}
            </p>
          </div>
          <!-- <span class="iconfont iconright"></span> -->
        </li>
      </ul>
      <div class="loadAll"
           v-if="loadAll && tableData.length!==0">
        <span>-</span>
        <p>已经到底了</p>
        <span>-</span>
      </div>
      <div class="noData"
           v-if="tableData.length===0 && dataReady">
        <img src="../../../../assets/nores.png">
        <p>暂无数据</p>
      </div>
    </div>
    <!-- 右侧筛选 -->
    <van-popup v-model="popupShow"
               class="popup_common"
               :overlay-style="{'background-color': 'rgba(0,0,0,.4)'}"
               :style="{ height: '100%' }"
               position="right">
      <p class="popup_title">筛选</p>
      <div class="popup_container">
        <div class="popup_list">
          <p>项目</p>
          <ul>
            <li v-for="(item, index) in projectManagementList"
                :key="item.id"
                @click="selectProject(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.referred }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>岗位名称</p>
          <ul>
            <li v-for="(item, index) in securityType"
                :key="item.value"
                @click="selectRepairStatus(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>日期</p>
          <div class="weekPicker"
               @click="weelyShow=true">
            <span>{{weekdate}}</span>
          </div>
        </div>
      </div>
      <div class="popup_buttons">
        <div @click="submit('reset')"
             class="popup_default">重置</div>
        <div @click="submit"
             class="popup_active">确定</div>
      </div>
    </van-popup>
    <!-- 选择周====================================== -->
    <van-popup v-model="weelyShow"
               position="bottom"
               @close="weelyClose"
               custom-style="height: 20%;">
      <changWeely :defaults="defaults"
                  @cancel="weekCancel"
                  @onConfirm="weekConfirm" />
    </van-popup>
  </div>
</template>
<script>
import AppHeader from '@/components/appHead'
import changWeely from '@/components/changeWeely.vue'
import moment from 'moment'
import context from '@/service'
import { InfiniteScroll, Toast } from 'mint-ui'
let roterFrom = null
export default {
  name: 'workingSchedule',
  components: { AppHeader, InfiniteScroll, changWeely },
  props: ['scrollTop'],
  watch: {
    scrollTop (val) {
      this.scrollVal = val
    }
  },
  data () {
    return {
      scrollVal: 0,
      defaults: new Date(),
      weelyShow: false,
      valDate: '',
      weekdate: '',
      title: '保安保洁',
      projectManagementList: [],
      securityType: [
        {
          label: '保安',
          value: 'GUARD'
        },
        {
          label: '保洁',
          value: 'CLEANER'
        }
      ],
      currentProject: {},
      currentStatus: {
        label: '保安',
        value: 'GUARD'
      },
      currentWeek: {
        label: '',
        startDate: '',
        endDate: ''
      },
      currentWeekLabel: '',
      startDate: '', // 筛选待确认时间
      endDate: '',
      loadBottom: false,
      tableData: [],
      dataReady: false,
      loadAll: false,
      popupShow: false,
      addMenu: false
    }
  },
  beforeRouteEnter (to, from, next) {
    roterFrom = from.name
    next()
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'index') {
      window.sessionStorage.removeItem('scrollVal')
      sessionStorage.removeItem('currentProject')
      sessionStorage.removeItem('currentStatus')
      sessionStorage.removeItem('currentWeek')
    }
    next()
  },
  activated () {
    this.weekFormat(new Date(), true)
    if (sessionStorage.getItem('currentProject')) {
      this.currentProject = JSON.parse(sessionStorage.getItem('currentProject'))
    }
    if (sessionStorage.getItem('currentStatus')) {
      this.currentStatus = JSON.parse(sessionStorage.getItem('currentStatus'))
    }
    if (sessionStorage.getItem('currentWeek')) {
      this.currentWeek = JSON.parse(sessionStorage.getItem('currentWeek'))
    }
    if (roterFrom === 'classes') {
      let scrollVal = window.sessionStorage.getItem('scrollVal')
      if (scrollVal) {
        this.$emit('changeScroll', scrollVal)
      }
    } else {
      window.sessionStorage.removeItem('scrollVal')
      this.$emit('changeScroll', 0)
      this.queryProjectManagement()
    }
  },
  created () {
    // this.weekFormat(new Date(), true)
    // if (sessionStorage.getItem('currentProject')) {
    //   this.currentProject = JSON.parse(sessionStorage.getItem('currentProject'))
    // }
    // if (sessionStorage.getItem('currentStatus')) {
    //   this.currentStatus = JSON.parse(sessionStorage.getItem('currentStatus'))
    // }
    // if (sessionStorage.getItem('currentWeek')) {
    //   this.currentWeek = JSON.parse(sessionStorage.getItem('currentWeek'))
    // }
    // this.queryProjectManagement()
  },
  mounted () {
  },
  methods: {
    isToday (date) {
      let today = moment(new Date()).format('YYYY-MM-DD')
      if (date === today) {
        return true
      }
      return false
    },
    detailsRouter () {
      window.sessionStorage.setItem('scrollVal', this.scrollVal)
      this.$router.replace({ name: 'classes' })
    },
    weekCancel () {
      this.weelyShow = false
    },
    weelyClose () {

    },
    weekFormat (a, flag) { // a为任意时间格式 2020-10-21 2020/12/05 "2014-09-08T08:02:17-05:00"
      let w = moment(a).format('w') // 获取当前起始日期是当年的第几周
      let weekStart = moment(a).startOf('week').format('YYYY-MM-DD')    // 设置为本周的第一天上午 12:00
      // let h1 = moment(a).startOf('isoWeek').format('YYYY-MM-DD')
      let weekEnd = moment(weekStart).day(7).format('YYYY-MM-DD')
      let YYYY = moment(a).format('YYYY')

      this.weekdate = `${YYYY} 第${w}周`
      this.currentWeekLabel = `${YYYY} 第${w}周`
      this.startDate = weekStart
      this.endDate = weekEnd
      if (flag) { // 默认写入查询参数时间
        this.currentWeek.label = `${YYYY} 第${w}周`
        this.currentWeek.startDate = weekStart
        this.currentWeek.endDate = weekEnd
      }
      // console.log(this.weekdate)
    },
    weekConfirm (arr) { // 周报时间选择器
      let a = arr[1].value
      this.valDate = a
      this.weekFormat(a)
      this.weelyShow = false
      // sessionStorage.setItem('subParameData', JSON.stringify(this.subParameData))
    },
    async query () {
      this.dataReady = false
      this.loadAll = false
      let param = {
        projectId: this.currentProject.id,
        post: this.currentStatus.value,
        startDate: this.currentWeek.startDate,
        endDate: this.currentWeek.endDate
      }
      let result = await context.http.get(`cms/api/gcplanTable/app`, param)
      if (result.status === 200) {
        this.dataReady = true
        this.tableData = result.data
        this.loadAll = true
      }
    },
    onGoBack () {
      // this.$router.go(-1)
      this.$router.replace({ name: 'index' })
    },
    tabChange () {
      this.$router.replace({ name: 'personList' })
    },
    async queryProjectManagement () {
      const res = await context.http.get('cms/api/project-managements', { useStatus: 'USING' })
      res.data[0].checked = true
      this.projectManagementList = res.data
      if (sessionStorage.getItem('currentProject')) {
        this.currentProject = JSON.parse(sessionStorage.getItem('currentProject'))
        // sessionStorage.removeItem('currentProject')
      } else {
        this.currentProject = res.data[0]
      }
      this.query()
    },
    showActionSheet () {
      this.projectManagementList = this.projectManagementList.map(item => {
        item.checked = false
        if (item.id === this.currentProject.id) item.checked = true
        return item
      })
      this.securityType = this.securityType.map(item => {
        item.checked = false
        if (item.value === this.currentStatus.value) item.checked = true
        return item
      })
      this.weekdate = this.currentWeek.label
      this.popupShow = !this.popupShow
    },
    selectProject (index, item) {
      this.projectManagementList = this.checkedFormat(index, this.projectManagementList)
    },
    selectRepairStatus (index, item) {
      this.securityType = this.checkedFormat(index, this.securityType)
    },
    async submit (state) {
      if (state === 'reset') {
        if (!this.projectManagementList.length) return
        this.projectManagementList = this.checkedFormat(0, this.projectManagementList)
        this.securityType = this.checkedFormat(0, this.securityType)
        this.weekFormat(new Date(), true)
      } else {
        if (!this.projectManagementList.length) {
          this.popupShow = false
          return
        }
        this.currentProject = this.projectManagementList.filter(item => item.checked)[0]
        this.currentStatus = this.securityType.filter(item => item.checked)[0]
        this.currentWeek.label = this.currentWeekLabel
        this.currentWeek.startDate = this.startDate
        this.currentWeek.endDate = this.endDate
        this.tableData = []
        this.query()
        this.popupShow = false
      }
      sessionStorage.setItem('currentProject', JSON.stringify(this.currentProject))
      sessionStorage.setItem('currentStatus', JSON.stringify(this.currentStatus))
      sessionStorage.setItem('currentWeek', JSON.stringify(this.currentWeek))
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    loadMore () {
      this.loadBottom = true
      // this.query()
    },
    checkedFormat (i, arr) {
      arr = arr.map(item => {
        item.checked = false
        return item
      })
      arr[i].checked = true
      return arr
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/config";
.workingSchedule {
  min-height: 100%;
  background: #fff;
  .popup_common {
    .weekPicker {
      width: rem(260);
      height: rem(30);
      line-height: rem(30);
      padding-left: rem(15);
      border-bottom: rem(2) solid #0139a4;
      font-size: rem(15);
      color: #0139a4;
    }
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
    z-index: 9;
    box-shadow: 0px 1px 4px 0px rgba(230, 230, 230, 0.5);
    .headTab {
      margin: 0 auto;
      color: #444547;
      font-size: rem(16);
      // width: rem(150);
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
          margin-left: rem(60);
        }
      }
    }
    .back {
      position: fixed;
      left: 0;
      top: 0;
      width: rem(40);
      height: rem(40);
      font-size: rem(18);
      color: #000000;
      &:first-child {
        float: left;
      }
    }
    .addBtn {
      width: rem(30);
      display: flex;
      position: fixed;
      right: 0;
      top: 0;
      i {
        font-size: rem(18);
        color: #444547;
        font-size: rem(18);
      }
    }
    .widthrightBtn {
      width: rem(30);
      right: rem(0);
    }
    .selected {
      color: #0139a4;
    }
  }
  .addMenu {
    position: absolute;
    width: rem(100);
    background: rgba(77, 80, 84, 1);
    box-shadow: 0px 0px 11px 0px rgba(164, 164, 164, 0.36);
    border-radius: rem(4);
    top: rem(35);
    right: rem(12);
    z-index: 99;
    color: #fff;
    > p {
      height: rem(47);
      line-height: rem(47);
      text-align: center;
      font-size: rem(15);
      border-bottom: rem(1) solid #37393a;
      &:last-child {
        border-bottom: 0;
      }
    }
  }
  .selectedBtn {
    padding-left: rem(8);
    font-size: rem(18);
    color: #444547;
  }
  .selected {
    color: #0139a4;
  }
  .actionsheet_wrapper {
    top: rem(41);
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-start;
      padding-top: rem(10);
    }
    li {
      display: inline-block;
      width: rem(100);
      height: rem(30);
      line-height: rem(30);
      color: #444547;
      font-size: rem(13);
      text-align: center;
      background: rgba(242, 242, 242, 1);
      margin-bottom: rem(10);
      margin-left: rem(18);
      border-radius: rem(3);
      &.selected {
        color: #0139a4;
        background: rgba(239, 246, 255, 1);
      }
      .iconfont {
        display: inline-block;
        margin-right: rem(16);
      }
    }
  }
  .title {
    width: 100%;
    position: fixed;
    left: 0;
    top: rem(40);
    height: rem(38);
    padding: 0 rem(14);
    font-size: rem(13);
    color: #444547;
    z-index: 1;
    background: #f8f9fa;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div {
      > span {
        border-right: rem(1) solid #d8d8d8;
        margin-left: rem(15);
        padding-right: rem(15);
      }
      > span:last-child {
        border-right: 0;
      }
      > span:first-child {
        margin-left: 0;
      }
    }
    > .detailsBtn {
      width: rem(68);
      height: rem(22);
      line-height: rem(22);
      background: #eff6ff;
      border-radius: rem(2);
      border: rem(1) solid #3575f6;
      color: #0139a4;
      text-align: center;
    }
  }
  .container {
    padding-top: rem(68);
    background: #fff;
    .loadAll {
      padding-top: rem(14);
    }
    .list {
      li {
        padding: rem(14) rem(14) rem(14) 0;
        position: relative;
        border-bottom: rem(1) solid #f0f0f0;
        background: #fff;
        padding-left: rem(14);
        &.isToday {
          background: #f6faff;
          box-shadow: 0px 1px 4px 0px #d6e4ff;
          > p {
            > span {
              color: #0139a4 !important;
            }
          }
        }
        > p {
          display: flex;
          width: 100%;
          justify-content: space-between;
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
            font-size: rem(17);
            line-height: rem(24);
            margin-bottom: rem(7);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-right: rem(5);
          }
        }
        > div {
          > p {
            line-height: rem(18);
            color: #858c94;
            font-size: rem(14);
            &:last-child {
              margin-bottom: 0;
            }
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
  }
}
</style>
