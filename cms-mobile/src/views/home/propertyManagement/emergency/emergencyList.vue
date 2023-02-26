<template>
  <div class="personList"
       @click="addMenu=false">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="onGoBack"></i>
      <div class="headTab">
        应急事项
      </div>
      <div class="addBtn widthrightBtn">
        <i class="iconfont iconcms_tianjia"
           v-if="hasAuthority('03020102')"
           @click="toAdd"></i>
        <i class="iconfont iconcms_shaixuan"
           @click="showActionSheet"></i>
      </div>
    </div>
    <div class="title"
         @click="showActionSheet">
      <div>
        <span>{{currentProject.referred}}</span>
        <span>{{currentStatus.label}}</span>
        <span v-if="timeList.startDate&&timeList.endDate">{{timeList.startDate}} ~ {{timeList.endDate}}</span>
      </div>
    </div>
    <div class="container">
      <mt-loadmore ref="loadmore"
                   :bottom-method="loadBottom"
                   :autoFill="false"
                   :bottom-all-loaded="allLoaded">
        <ul v-if="tableData.length"
            class="list">
          <li v-for="(item, index) in tableData"
              @click="toDetails(item.id)"
              :key="index">
            <p>
              <span>{{item.projectManagementRefferd}}</span>
              <span :class="{'dcl':item.eventStatus==='WAIT','clz':item.eventStatus==='ONDEAL','ycl':item.eventStatus==='DEALED'}">{{formatEventStatus(item.eventStatus)}}</span>
            </p>
            <div>
              <p>跟进人：{{item.followUser}}</p>
              <p>发生时间：{{item.happenDate}}</p>
            </div>
            <span class="iconfont iconright"></span>
          </li>
        </ul>
      </mt-loadmore>
      <div class="loadAll"
           v-if="allLoaded && tableData.length!==0">
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
        <div class="popup_list"
             style="padding-bottom:30px">
          <p>发生时间</p>
          <div class="timeList">
            <span :class="{'on':isOn===1}"
                  @click="isOnFn(1)">{{startDate}}</span>
            <i> 至 </i>
            <span :class="{'on':isOn===2}"
                  @click="isOnFn(2)">{{endDate}}</span>
          </div>
        </div>
        <div class="popup_list">
          <p>事项状态</p>
          <ul>
            <li v-for="(item, index) in statusList"
                :key="item.value"
                @click="selectStatus(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="popup_buttons">
        <div @click="submit('reset')"
             class="popup_default">重置</div>
        <div @click="submit"
             class="popup_active">确定</div>
      </div>
    </van-popup>
    <!-- 筛选时间 -->
    <van-popup v-model="showDatetime"
               position="bottom"
               :style="{ height: '50%' }">
      <!-- 按天 -->
      <van-datetime-picker v-model="currentDate1"
                           @change="changeTime"
                           v-show="isOn===1"
                           type="date"
                           :formatter="formatter"
                           :min-date="minDate1"
                           :max-date="maxDate1"
                           @confirm="onConfirm"
                           @cancel="showDatetime = false" />
      <van-datetime-picker v-model="currentDate2"
                           @change="changeTime"
                           v-show="isOn===2"
                           type="date"
                           :formatter="formatter"
                           :min-date="minDate2"
                           :max-date="maxDate2"
                           @confirm="onConfirm"
                           @cancel="showDatetime = false" />
    </van-popup>
  </div>
</template>
<script>
import AppHeader from '@/components/appHead'
import changWeely from '@/components/changeWeely.vue'
import moment from 'moment'
import context from '@/service'
import { Toast } from 'vant'
export default {
  name: 'personList',
  components: { AppHeader, changWeely },
  data () {
    return {
      showDatetime: false,
      currentDate1: new Date(),
      currentDate2: new Date(),
      minDate1: new Date(moment().add(-10, 'Y').format('YYYY-MM-DD')), // 10年前
      maxDate1: new Date(2030, 11, 1),
      minDate2: new Date(2000, 0, 1),
      maxDate2: new Date(moment().add(10, 'Y').format('YYYY-MM-DD')), // 10年后
      startDate: '',
      endDate: '',
      isOn: 1,
      inputValue: '',
      weelyShow: false,
      valDate: '',
      weekdate: '',
      projectManagementList: [],
      timeList: {
        startDate: '',
        endDate: ''
      },
      statusList: [
        {
          label: '全部状态',
          value: ''
        }, {
          label: '待处理',
          value: 'WAIT'
        }, {
          label: '处理中',
          value: 'ONDEAL'
        }, {
          label: '已处理',
          value: 'DEALED'
        }
      ],
      currentProject: {},
      currentStatus: {
        label: '全部状态',
        value: ''
      },
      total: 0,
      currentPage: 1,
      pgSize: 15,
      tableData: [],
      dataReady: false,
      allLoaded: false,
      flag: true,
      popupShow: false,
      addMenu: false
    }
  },
  created () {
    if (sessionStorage.getItem('currentProject')) {
      this.currentProject = JSON.parse(sessionStorage.getItem('currentProject'))
    }
    if (sessionStorage.getItem('currentStatus')) {
      this.currentStatus = JSON.parse(sessionStorage.getItem('currentStatus'))
    }
    if (sessionStorage.getItem('timeList')) {
      this.timeList = JSON.parse(sessionStorage.getItem('timeList'))
    }
    this.queryProjectManagement()
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'index') {
      sessionStorage.removeItem('currentProject')
      sessionStorage.removeItem('currentStatus')
      sessionStorage.removeItem('timeList')
    }
    next()
  },
  mounted () {
  },
  methods: {
    onConfirm (date) {
      const value = moment(date).format('YYYY-MM-DD')
      if (this.isOn === 1) {
        this.startDate = value
      } else {
        this.endDate = value
      }
      // this.goodsTime = this.startTime + '  ~  ' + this.endTime
      this.showDatetime = false
      this.currentPage = 1
      this.query()
    },
    changeTime (picker) {
      let startTime = picker.getValues()
      let str = (startTime[0] + startTime[1] + startTime[2]).replace(/[\u4e00-\u9fa5]/g, '-')
      str = str.substr(0, str.length - 1)
      if (this.isOn === 1) {
        this.minDate2 = new Date(str)
      } else {
        this.maxDate1 = new Date(str)
      }
      // console.log(str)
    },
    isOnFn (n) {
      this.isOn = n
      this.showDatetime = true
    },
    formatEventStatus (eventStatus) {
      switch (eventStatus) {
        case 'WAIT':
          return '待处理'
        case 'ONDEAL':
          return '处理中'
        case 'DEALED':
          return '已处理'
      }
    },
    toDetails (id) {
      if (this.hasAuthority('03020101')) {
        this.$router.replace({ name: 'emergencyDetails', params: { 'id': id } })
      } else {
        Toast({
          message: '你的账号没有查看应急事项详情的权限',
          position: 'top'
        })
      }
    },
    toAdd () {
      this.$router.replace({ name: 'emergencyAdd', params: { detailsData: null, type: 'add' } })
    },
    onKeyInput (event) { // 输入
      this.tableData = []
      this.$nextTick(() => {
        this.query()
      })
    },
    search (event) { // 键盘完成事件
      if (event.keyCode === 13) {
        event.preventDefault() // 禁止默认事件（默认是换行）
        this.inputValue = event.target.value
        this.page = 0
        this.tableData = []
        this.query()
      }
    },
    loadBottom () {
      this.currentPage++
      this.query(true)
      this.$refs.loadmore.onBottomLoaded()
    },
    async query (flag) {
      this.dataReady = false
      let param = {
        page: (this.currentPage - 1),
        size: this.pgSize,
        projectManagementId: this.currentProject.id,
        eventStatus: this.currentStatus.value,
        endDate: this.timeList.endDate,
        startDate: this.timeList.startDate
      }
      let result = await context.http.get(`cms/api/emergency`, param)
      if (result.status === 200) {
        this.dataReady = true
        if (!flag) {
          this.tableData = result.data
        } else {
          this.tableData = this.tableData.concat(result.data)
        }
        this.total = Number(result.headers['x-total-count'])
        if (this.currentPage === Math.ceil(this.total / this.pgSize) || this.currentPage > Math.ceil(this.total / this.pgSize)) {
          this.allLoaded = true// 若数据已全部获取完毕
          console.log('全部获取完毕')
        }
      }
    },
    onGoBack () {
      // this.$router.go(-1)
      this.$router.replace({ name: 'index' })
    },
    async queryProjectManagement () {
      const res = await context.http.get('cms/api/project-managements', { useStatus: 'USING' })
      res.data.unshift({ id: '', referred: '全部项目' })
      res.data[0].checked = true
      this.projectManagementList = res.data
      if (sessionStorage.getItem('currentProject')) {
        this.currentProject = JSON.parse(sessionStorage.getItem('currentProject'))
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
      this.statusList = this.statusList.map(item => {
        item.checked = false
        if (item.value === this.currentStatus.value) item.checked = true
        return item
      })
      this.popupShow = !this.popupShow
    },
    selectProject (index, item) {
      this.projectManagementList = this.checkedFormat(index, this.projectManagementList)
    },
    selectStatus (index, item) {
      this.statusList = this.checkedFormat(index, this.statusList)
    },
    async submit (state) {
      if (state === 'reset') {
        if (!this.projectManagementList.length) return
        this.projectManagementList = this.checkedFormat(0, this.projectManagementList)
        this.statusList = this.checkedFormat(0, this.statusList)
        this.timeList.startDate = ''
        this.timeList.endDate = ''
        this.startDate = ''
        this.endDate = ''
      } else {
        if (!this.projectManagementList.length) {
          this.popupShow = false
          return
        }
        this.currentProject = this.projectManagementList.filter(item => item.checked)[0]
        this.currentStatus = this.statusList.filter(item => item.checked)[0]
        if ((this.startDate && !this.endDate) || (!this.startDate && this.endDate)) {
          Toast('请选择完整时间区间')
          return
        }
        this.timeList.startDate = this.startDate
        this.timeList.endDate = this.endDate
        this.tableData = []
        this.query()
        this.popupShow = false
      }
      sessionStorage.setItem('currentProject', JSON.stringify(this.currentProject))
      sessionStorage.setItem('currentStatus', JSON.stringify(this.currentStatus))
      sessionStorage.setItem('timeList', JSON.stringify(this.timeList))
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    formatter (type, val) {
      if (type === 'year') {
        return `${val}年`
      } else if (type === 'month') {
        return `${val}月`
      } else if (type === 'day') {
        return `${val}日`
      }
      return val
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
.personList {
  min-height: 100%;
  background: #fff;
  .popup_common {
    .timeList {
      display: flex;
      > i {
        font-style: normal;
        margin: 0 rem(15);
      }
      > span {
        width: rem(120);
        height: rem(30);
        line-height: rem(30);
        padding-left: rem(15);
        font-size: rem(15);
        border-bottom: rem(2) solid #d9d9d9;
        color: #d9d9d9;
        &.on {
          border-bottom: rem(2) solid #0139a4;
          color: #0139a4;
        }
      }
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
      width: rem(70);
      padding-right: rem(15);
      display: flex;
      justify-content: space-between;
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
    height: rem(40);
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
    padding-top: rem(80);
    background: #fff;
    .loadAll {
      padding-top: rem(14);
    }
    .list {
      padding-left: rem(14);
      li {
        padding: rem(14) rem(14) rem(14) 0;
        position: relative;
        border-bottom: rem(1) solid #f0f0f0;
        background: #fff;
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
            &:last-child {
              &.dcl {
                color: #3575f6;
              }
              &.clz {
                color: #1cc296;
              }
              &.ycl {
                color: #858c94;
              }
            }
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
          font-size: rem(14);
          color: #858c94;
          > p:first-child {
            font-size: rem(15);
            color: #18191a;
          }
        }
        > span {
          position: absolute;
          right: rem(10);
          top: rem(55);
          font-size: rem(17);
          color: #c6c6c6;
        }
      }
    }
  }
}
</style>
