<template>
  <div class="messageCenter"
       :class="{'noDataCls':tableData.length===0}"
       @click="addMenu=false">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="onGoBack"></i>
      <div class="headTab">
        <span class="active">消息 <i class="badge"
             v-if="MESSAGE > 0">{{MESSAGE}}</i></span>
        <span @click="toNotice">通知 <i class="badge"
             v-if="NOTIFY > 0">{{NOTIFY}}</i></span>
      </div>
      <div class="addBtn"
           @click.stop="addMenu=true">
        <i class="iconfont iconcms_tianjia"></i>
      </div>
      <!-- <i class="addBtn">+</i> -->
    </div>
    <div class="tab"
         :class="{'scrolling':scrolling}">
      <span :class="{'active':!onSend}"
            @click="typeChange(false)">收到的</span>
      <span :class="{'active':onSend}"
            @click="typeChange(true)">发出的</span>
    </div>
    <div class="content"
         :class="{'scrolling':scrolling,'noDataCls':tableData.length===0}">
      <mt-loadmore ref="loadmore"
                   :bottom-method="loadBottom"
                   :autoFill="false"
                   :bottom-all-loaded="allLoaded">
        <ul>
          <li class="item"
              v-for="(item,index) in tableData"
              :key="index"
              @click="toMessageDetails(item.id, index)">
            <div>
              <span>
                <i class="read"
                   v-if="!item.readed && !onSend"></i>{{item.createUserName}}
              </span>
              <span>{{item.sendTime.replace('T',' ')}}</span>
            </div>
            <div>{{item.title}}</div>
          </li>
        </ul>
        <div class="loadAll"
             v-if="allLoaded && tableData.length!==0">
          <span>-</span>
          <p>你碰到我的底线了</p>
          <span>-</span>
        </div>

      </mt-loadmore>
      <div class="noData"
           v-if="tableData.length===0 && dataReady">
        <img src="../../../assets/nores.png">
        <p>暂无数据</p>
      </div>
    </div>
    <div class="addMenu"
         v-if="addMenu">
      <p @click="toAddMessage">新增消息</p>
      <p @click="toAddNotice"
         v-if="hasAuthority('09010501')">新增通知</p>
    </div>
  </div>
</template>
<script>
import AppHeader from '@/components/appHead'
import { Loadmore } from 'mint-ui'
import context from '@/service'
let roterFrom = null
export default {
  name: 'messageCenter',
  footVisible: true,
  props: ['scrollTop'],
  components: { AppHeader, Loadmore },
  watch: {
    scrollTop (val) {
      // console.log(val, this.scrollTop)
      // // this.pageTop = val
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
      allLoaded: false,
      addMenu: false,
      scrolling: false,
      tableData: [],
      currentPage: 1,
      pgNum: 1,
      total: 0,
      pgSize: 15,
      onSend: false, // 默认发件
      MESSAGE: 0,
      NOTIFY: 0,
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
    if (roterFrom === 'messageDetails') {
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
    console.log('created')
    // this.notReadCount('MESSAGE')
    // this.notReadCount('NOTIFY')
    // this.query()
  },
  beforeDestroy () {
  },
  mounted () {

  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    query () {
      this.dataReady = false
      context.http.get('mps/api/messageCenters', {
        onSend: this.onSend,
        messageCenterType: 'MESSAGE',
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'createdDate,desc'
      }).then(res => {
        this.dataReady = true
        if (res.status === 200) {
          this.tableData = this.tableData.concat(res.data)
          // this.tableData = []
          // console.log(this.tableData)
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
          if (messageCenterType === 'MESSAGE' && res.data !== '0') this.MESSAGE = res.data
          if (messageCenterType === 'NOTIFY' && res.data !== '0') this.NOTIFY = res.data
        }
      }).catch(error => {
        console.info(error)
      })
    },
    loadBottom (id) {
      this.currentPage++
      this.query()
      this.$refs.loadmore.onBottomLoaded()
    },
    toMessageDetails (id, index) {
      this.slectedIndex = index
      window.sessionStorage.setItem('scrollVal', this.scrollVal)
      this.$router.push({ name: 'messageDetails', params: { id: id } })
    },
    typeChange (type) {
      this.currentPage = 1
      this.onSend = type
      this.allLoaded = false
      this.tableData = []
      this.$nextTick(() => {
        this.query()
      })
    },
    toNotice () { // 通知
      this.$router.push({ name: 'Notice' })
    },
    toAddNotice () { // 新增通知
      sessionStorage.removeItem('selectPerson')
      this.$router.push({ name: 'AddNotice' })
    },
    toAddMessage () { // 新增消息
      sessionStorage.removeItem('selectPerson')
      this.$router.push({ name: 'AddMessage' })
    },
    onGoBack () { // 返回首页
      this.$router.push({ name: 'index' })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
$contentTop-height: rem(108);
.messageCenter {
  &.noDataCls {
    height: calc(100% - #{$contentTop-height});
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
    box-shadow: 0px 1px 4px 0px rgba(230, 230, 230, 0.5);
    .headTab {
      color: #444547;
      font-size: rem(17);
      width: rem(150);
      display: flex;
      justify-content: space-between;
      > span {
        position: relative;
        &.active {
          color: #0139a4;
          border-bottom: rem(3) solid #0139a4;
          font-weight: bold;
        }
        .badge {
          // min-width: 0.35rem;
          // height: 0.35rem;
          // line-height: 0.35rem;
          // padding: 0 0.05rem;
          // background-color: #fc5159;
          // border-radius: 50%;
          // font-size: 0.3rem;
          // color: #fff;
          font-style: normal;
          // display: inline-block;
          // text-align: center;
          // white-space: nowrap;
          position: absolute;
          top: rem(2);
          left: rem(30);
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
      width: rem(40);
      height: rem(40);
      font-size: rem(18);
      color: #18191a;
      position: relative;
    }
  }
  .tab {
    width: 100%;
    height: rem(58);
    background-color: #fff;
    border-bottom: rem(1) solid #f0f0f0;
    position: fixed;
    left: 0;
    top: rem(50);
    padding: 0 rem(14);
    z-index: 9;
    display: flex;
    align-items: center;
    &.scrolling {
      top: rem(40);
      border-top: rem(1) solid #f0f0f0;
    }
    > span {
      font-size: rem(15);
      color: rgba(68, 69, 71, 1);
      margin-right: rem(30);
      &.active {
        font-size: rem(20);
        font-weight: bold;
        color: rgba(24, 25, 26, 1);
      }
    }
  }
  .content {
    margin-top: rem(108);
    // min-height: rem(200);
    background-color: #fff;
    &.noDataCls {
      height: 100%;
      position: relative;
    }
    &.scrolling {
      margin-top: rem(98);
    }
    .item {
      height: rem(79);
      margin-left: rem(14);
      border-bottom: rem(1) solid #f0f0f0;
      padding: rem(14) rem(15) rem(13) 0;
      > div:first-child {
        display: flex;
        align-items: center;
        justify-content: space-between;
        > span {
          &:first-child {
            font-size: rem(17);
            font-weight: bold;
            color: rgba(24, 25, 26, 1);
            display: flex;
            align-items: center;
            > .read {
              display: block;
              width: rem(7);
              height: rem(7);
              background: rgba(252, 81, 89, 1);
              border-radius: 50%;
              margin-right: rem(5);
            }
          }
          &:last-child {
            font-size: rem(13);
            color: rgba(133, 140, 148, 1);
          }
        }
      }
      > div:last-child {
        margin-top: rem(8);
        font-size: rem(15);
        color: rgba(68, 69, 71, 1);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
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
}
</style>
