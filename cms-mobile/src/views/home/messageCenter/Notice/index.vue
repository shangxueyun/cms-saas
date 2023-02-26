<template>
  <div id="notice"
       @click="addMenu=false"
       :class="{'noDataCls':tableData.length===0}">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="onGoBack"></i>
      <div class="headTab">
        <span @click="toMsg">消息
          <i class="badge"
             v-if="msAmount > 0">{{msAmount}}</i>
        </span>
        <span class="active">通知
          <i class="badge"
             v-if="notifyAmount > 0">{{notifyAmount}}</i>
        </span>
      </div>
      <div class="addBtn"
           @click.stop="addMenu = !addMenu">
        <i class="iconfont iconcms_tianjia"></i>
      </div>
      <!-- <i class="addBtn">+</i> -->
    </div>
    <div class="notice-head"
         :class="{'scrolling': scrolling}">
      <span :class="{'active': activeIdx === 1}"
            @click="switchTab(1, false)">收到的</span>
      <span :class="{'active': activeIdx === 2}"
            @click="switchTab(2, true)">发出的</span>
      <div class="filter">
        <div class="filter-div"
             @click="toggleActionSheet"
             :class="{'filter-select': openActionsheet}">
          <span>{{filterText}}</span>
          <i class="iconfont iconzel"
             :class="{'icon-select': openActionsheet}"></i>
        </div>
      </div>
    </div>
    <div class="content"
         :class="{'scrolling':scrolling,'noDataCls':tableData.length===0}">
      <mt-loadmore ref="loadmore"
                   :bottom-method="loadBottom"
                   :autoFill="false"
                   :bottom-all-loaded="allLoaded">
        <div class="notice-list">
          <div class="nl-item"
               v-for="(item,index) in tableData"
               :key="index"
               @click="toNoticeDetails(item.id, index)">
            <div class="ni-head">
              <i v-show="!item.readed && !onSend"></i>
              <div class="name">{{item.createUserName}}</div>
              <div class="time">{{formateData(item.sendTime)}}</div>
            </div>
            <div class="ni-type">{{item.notifyTypeDescription}}</div>
            <div class="ni-title">{{item.title}}</div>
          </div>
        </div>
        <div class="loadAll"
             v-if="allLoaded && tableData.length > 0">
          <span>-</span>
          <p>你碰到我的底线了</p>
          <span>-</span>
        </div>
        <div class="noData"
             v-if="tableData.length===0 && dataReady">
          <img src="../../../../assets/nores.png">
          <p>暂无数据</p>
        </div>
      </mt-loadmore>
    </div>
    <!-- 文件类型 -->
    <action-sheet :open.sync="openActionsheet"
                  :class="{'scrolling': scrolling}">
      <div slot="content">
        <ul>
          <li v-for="(item, index) in actionList"
              :key="index"
              @click="selectLi(item, index)"
              :class="{'selected': index === tabIndex}">
            <span>{{item.name}}</span>
            <i class="iconfont iconcms_gou-227"
               v-show="index === tabIndex"></i>
          </li>
        </ul>
      </div>
    </action-sheet>
    <!-- 新增通知 -->
    <transition name="fade">
      <div class="addMenu"
           v-show="addMenu">
        <p @click="addMenu = false;AddMsg()">新增消息</p>
        <p @click="addMenu = false;AddNotice()"
           v-if="hasAuthority('09010501')">新增通知</p>
      </div>
    </transition>
  </div>
</template>
<script>
import ActionSheet from '@/components/Actionsheet'
import context from '@/service'
import { Loadmore } from 'mint-ui'
let roterFrom = null
export default {
  name: 'notice',
  components: { ActionSheet, Loadmore },
  props: ['scrollTop'],
  watch: {
    scrollTop (val) {
      this.scrollVal = val
      this.addMenu = false
      if (val > 0) {
        this.scrolling = true
      } else {
        this.scrolling = false
      }
    }
  },
  data () {
    return {
      scrollVal: 0,
      msAmount: 0,
      notifyAmount: 0,
      onSend: false,
      scrolling: false,
      allLoaded: false,
      tableData: [],
      currentPage: 1,
      pgNum: 1,
      total: 0,
      pgSize: 15,
      addMenu: false,
      openActionsheet: false,
      activeIdx: 1,
      actionList: [
        { name: '全部', value: '' },
        { name: '红头文件', value: 'RED_HEAD_DOCUMENT' },
        { name: '放假通知', value: 'HOLIDAY_NOTICE' },
        { name: '会议通知', value: 'MEETING_NOTICE' },
        { name: '办文单', value: 'OFFICE_DOCUMENT' },
        { name: '其他', value: 'OTHER' }
      ],
      filterText: '全部',
      tabIndex: 0,
      memberLimitDTOArr: [],
      couponDTO: {
        memberLimitDTO: []
      },
      dataReady: false
    }
  },
  beforeRouteEnter (to, from, next) {
    roterFrom = from.name
    next()
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  activated () {
    if (roterFrom === 'noticeDetails') {
      let scrollVal = window.sessionStorage.getItem('scrollVal')
      if (scrollVal) {
        this.$emit('changeScroll', scrollVal)
      }
      this.tableData[this.slectedIndex].readed = true
      this.notReadCount('MESSAGE')
      this.notReadCount('NOTIFY')
    } else {
      window.sessionStorage.removeItem('scrollVal')
      this.$emit('changeScroll', 0)
      this.notReadCount('MESSAGE')
      this.notReadCount('NOTIFY')
      this.tableData = []
      this.query()
    }
    console.log('activated')
  },
  created () {
    // this.notReadCount('MESSAGE')
    // this.notReadCount('NOTIFY')
    // this.query()
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    formateData (val) {
      if (val) {
        return val.replace('T', '  ')
      } else {
        return '-'
      }
    },
    query (type) {
      this.dataReady = false
      context.http.get('mps/api/messageCenters', {
        onSend: this.onSend,
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'createdDate,desc',
        messageCenterType: 'NOTIFY',
        notifyType: this.notifyType
      }).then(res => {
        this.dataReady = true
        if (res.status === 200) {
          if (type === 'selectType') {
            this.tableData = res.data
          } else {
            this.tableData = this.tableData.concat(res.data)
          }
          this.total = Number(res.headers['x-total-count'])
          if (this.currentPage === Math.ceil(this.total / this.pgSize) || this.currentPage > Math.ceil(this.total / this.pgSize)) {
            this.allLoaded = true// 若数据已全部获取完毕
            console.log('全部获取完毕')
          }
        }
      })
    },
    notReadCount (messageCenterType) {
      context.http.get('mps/api/messageCenters/notReadCount', { messageCenterType: messageCenterType }).then(res => {
        if (res.status === 200) {
          if (messageCenterType === 'MESSAGE' && res.data !== '0') this.msAmount = res.data
          if (messageCenterType === 'NOTIFY' && res.data !== '0') this.notifyAmount = res.data
        }
      }).catch(error => {
        console.info(error)
      })
    },
    switchTab (type, isOnSend) {
      this.activeIdx = type
      this.onSend = isOnSend
      this.currentPage = 1
      this.allLoaded = false
      this.tableData = []
      this.filterText = '全部'
      this.notifyType = ''
      this.tabIndex = 0
      this.query('selectType')
    },
    toggleActionSheet () {
      this.openActionsheet = !this.openActionsheet
    },
    toMsg () {
      this.$router.push({ name: 'messageCenter' })
    },
    selectLi (item, index) {
      this.tabIndex = index
      this.openActionsheet = false
      this.filterText = item.name
      this.notifyType = item.value
      this.currentPage = 1
      this.allLoaded = false
      this.query('selectType')
    },
    onGoBack () {
      this.$router.push({ name: 'index' })
    },
    toNoticeDetails (id, index) {
      this.slectedIndex = index
      window.sessionStorage.setItem('scrollVal', this.scrollVal)
      this.$router.push({ name: 'noticeDetails', query: { id: id } })
    },
    AddNotice () {
      sessionStorage.removeItem('selectPerson')
      this.$router.push({ name: 'AddNotice' })
    },
    AddMsg () {
      sessionStorage.removeItem('selectPerson')
      this.$router.push({ name: 'AddMessage' })
    },
    loadBottom (id) {
      this.currentPage++
      this.query()
      this.$refs.loadmore.onBottomLoaded()
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/config";
$contentTop-height: rem(108);
#notice {
  background-color: #fff;
  &.noDataCls {
    height: calc(100% - #{$contentTop-height});
  }
  .actionsheet_wrapper {
    top: rem(108);
    &.scrolling {
      top: rem(98);
    }
    li {
      height: rem(37);
      line-height: rem(37);
      color: #444547;
      font-size: rem(15);
      text-align: left;
      padding-left: rem(20);
      display: flex;
      justify-content: space-between;
      &.selected {
        color: #0139a4;
      }
      .iconfont {
        display: inline-block;
        margin-right: rem(16);
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
    z-index: 99;
    background: #fff;
    display: flex;
    justify-content: space-between;
    .headTab {
      color: #444547;
      font-size: rem(17);
      width: rem(150);
      display: flex;
      justify-content: space-between;
      > span {
        &.active {
          color: #0139a4;
          border-bottom: rem(3) solid #0139a4;
          font-weight: bold;
        }
        position: relative;
      }
      .badge {
        position: absolute;
        top: rem(2);
        left: rem(30);
        font-style: normal;
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
      width: rem(40);
      height: rem(40);
      font-size: rem(18);
      color: #18191a;
      position: relative;
    }
  }
}
.notice-head {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: rem(58);
  border-bottom: rem(1) solid #f0f0f0;
  // margin-top: rem(50);
  position: fixed;
  left: 0;
  top: rem(50);
  z-index: 9;
  width: 100%;
  background: #fff;
  padding: 0 rem(14);
  &.scrolling {
    top: rem(40);
    border-top: rem(1) solid #f0f0f0;
  }
  > span {
    font-size: rem(15);
    margin-right: rem(30);
  }
  div {
    width: rem(80);
    text-align: center;
    font-size: rem(15);
    color: #444547;
  }
  .filter {
    flex: 1;
    font-size: rem(13);
    position: relative;
    display: flex;
    justify-content: flex-end;
    &.filter-select {
      color: #0139a4;
    }
    .filter-div {
      text-align: right;
      margin-right: rem(14);
    }
    i {
      display: inline-block;
      font-size: rem(12);
    }
    .icon-select {
      transform: rotate(180deg) translateY(2px);
    }
    span {
      color: #0139a4;
    }
  }
  .active {
    font-size: rem(20);
    color: #18191a;
    font-weight: bold;
  }
  i {
    display: inline-block;
    width: rem(12);
    height: rem(6);
    &.iconzel {
      background: url("../../../../assets/trianglehs.png") no-repeat;
      background-size: contain;
    }
    &.icon-select {
      background: url("../../../../assets/triangle.png") no-repeat;
      background-size: contain;
    }
  }
}
.content {
  margin-top: rem(108);
  background-color: #fff;
  overflow: scroll;
  &.noDataCls {
    height: 100%;
    position: relative;
    .noData {
      width: rem(140);
      height: rem(180);
      position: absolute;
      /* top: rem(80); */
      left: 0;
      right: 0;
      margin: auto;
      > img {
        display: block;
        margin: 0 auto;
        width: rem(140);
        height: rem(140);
      }
      > p {
        color: #444547;
        text-align: center;
        font-weight: bold;
      }
    }
  }
  &.scrolling {
    margin-top: rem(98);
  }
}
.notice-list {
  .nl-item {
    min-height: rem(100);
    margin-left: rem(14);
    border-bottom: rem(1) solid #f0f0f0;
    &:last-child {
      border: none;
    }
  }
  .ni-head {
    display: flex;
    align-items: center;
    padding-top: rem(15);
    .name {
      font-size: rem(17);
      color: #18191a;
      font-weight: bold;
    }
    .time {
      flex: 1;
      text-align: right;
      margin-right: rem(15);
      color: #858c94;
      font-size: rem(13);
    }
    i {
      background: #fc5159;
      display: inline-block;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      margin-right: rem(10);
    }
  }
  .ni-type {
    font-size: rem(15);
    color: #18191a;
    padding: rem(6) 0 rem(4) 0;
  }
  .ni-title {
    font-size: rem(15);
    color: #858c94;
  }
}
.addMenu {
  position: absolute;
  width: rem(100);
  max-height: rem(95);
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
    &:first-child {
      border-bottom: rem(1) solid #37393a;
      border-radius: rem(4);
    }
  }
}
</style>
