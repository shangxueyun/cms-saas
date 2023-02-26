<template>
  <div class="approvalCenter">
    <app-header title="审批中心"
                :mode="false"
                :onBack="true"
                backRoute="index"></app-header>
    <div class="workbench"
         style="margin-top:20upx">
      <div class="viewTitle">审批</div>
      <div class="content">
        <div @click="toApprovalList('待审批', false, true)"
             class="item">
          <i class="iconfont icondaishenpi icon1 icon"></i>
          <span class="text">待审批</span>
          <span class="badge"
                v-if="NumData.processTaskNumber>0">{{NumData.processTaskNumber}}</span>
        </div>
        <div @click="toApprovalList('我发起的', true, false)"
             class="item">
          <i class="iconfont iconwofaqi icon2 icon"></i>
          <span class="text">我发起的</span>
        </div>
        <div @click="toApprovalList('已处理', true, false)"
             class="item">
          <i class="iconfont iconyichuli1 icon3 icon"></i>
          <span class="text">已处理</span>
          <span class="badge"
                v-if="NumData.processDealTaskNumber>0">{{NumData.processDealTaskNumber}}</span>
        </div>
        <div @click="toApprovalList('抄送我的', true, false)"
             class="item">
          <i class="iconfont iconchaosongwode icon4 icon"></i>
          <span class="text">抄送我的</span>
          <span class="badge"
                v-if="NumData.processCcTaskNumber>0">{{NumData.processCcTaskNumber}}</span>
        </div>
      </div>
    </div>
    <div class="workbench workbench1">
      <div class="viewTitle">发起审批</div>
      <div class="content">
        <div @click="toAddApprovalList"
             class="item">
          <i class="iconfont iconxinjian icon5 icon"></i>
          <span class="text">新建审批</span>
        </div>
        <div @click="toProvisionalApproval"
             class="item">
          <i class="iconfont iconfeibiao icon6 icon"></i>
          <span class="text">非标审批</span>
        </div>
        <div class="item"></div>
        <div class="item"></div>
      </div>
    </div>
  </div>
</template>
<script>
import AppHeader from '@/components/appHead'
import context from '@/service'
export default {
  name: 'approvalCenter',
  footVisible: true,
  components: { AppHeader },
  watch: {
  },
  data () {
    return {
      NumData: { processTaskNumber: 0, processCcTaskNumber: 0, processDealTaskNumber: 0 }
    }
  },
  created () {
    // this.greetingsFn()
    window.sessionStorage.removeItem('scrollVal')
    this.queryNum()
  },
  beforeDestroy () {
  },
  mounted () {

  },
  methods: {
    queryNum () {
      context.http.get('cms/api/staging').then(res => {
        this.NumData = res.data
      })
    },
    toApprovalCenter () {
      this.$router.push({ name: 'approvalCenter' })
    },
    greetingsFn () {
      let timeNow = new Date()
      // 获取当前小时
      let hours = timeNow.getHours()
      // 设置默认文字
      let span = ''
      // 判断当前时间段
      if (hours >= 6 && hours <= 8) {
        span = `早上好！`
      } else if (hours >= 8 && hours <= 11) {
        span = `上午好！`
      } else if (hours >= 11 && hours <= 13) {
        span = `中午好！`
      } else if (hours >= 13 && hours <= 18) {
        span = `下午好！`
      } else if (hours >= 18 && hours <= 23) {
        span = `晚上好！`
      } else if (hours >= 23 && hours <= 5) {
        span = `夜深了！`
      }
      this.greetings = span
    },
    isIOS () {
      return !!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    },
    sweepCode () {
      if (this.isIOS()) {
        window.webkit.messageHandlers.jsbridge.postMessage('qrcode') // ios
      } else {
        window.messageHandlers.postMessage('qrcode')
      }
    },
    toApprovalList (navigator, finshed, approvalOperation) {
      this.$router.push({ name: 'approvalList', query: { title: navigator, finshed: finshed, approvalOperation: approvalOperation } })
    },
    toAddApprovalList () {
      this.$router.push({ name: 'addApprovalList' })
    },
    toProvisionalApproval () {
      this.$router.push({ name: 'provisionalApproval' })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
.viewTitle {
  font-size: rem(16);
  height: rem(40);
  line-height: rem(40);
  color: #18191a;
  padding-left: rem(14);
  border-bottom: rem(1) solid #f2f2f2;
  font-weight: bold;
}
.approvalCenter {
  padding-top: rem(50);
  .workbench {
    height: rem(140);
    background-color: #ffffff;
    .content {
      height: rem(99);
      display: flex;
      padding: 0 rem(20);
      align-items: center;
      justify-content: space-between;
      .item {
        width: rem(65);
        // height:130upx;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: center;
        position: relative;
        > .icon {
          width: rem(28);
          height: rem(28);
          font-size: rem(28);
          &.icon1 {
            background: linear-gradient(
              90deg,
              rgba(255, 180, 0, 1) 0%,
              rgba(243, 155, 42, 1) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          &.icon2 {
            background: linear-gradient(90deg, #26cfff 0%, #0495fe 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          &.icon3 {
            background: linear-gradient(
              90deg,
              rgba(255, 126, 77, 1) 0%,
              rgba(255, 99, 72, 1) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          &.icon4 {
            background: linear-gradient(90deg, #a8e063 0%, #56ab2f 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-size: rem(24);
          }
          &.icon5 {
            background: linear-gradient(
              90deg,
              rgba(38, 207, 255, 1) 0%,
              rgba(4, 149, 254, 1) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          &.icon6 {
            background: linear-gradient(90deg, #ff7e4d 0%, #ff6348 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
        > .text {
          color: #18191a;
          font-size: rem(13);
          font-weight: bold;
          margin-top: rem(10);
        }
        > .badge {
          // display: block;
          // width: rem(15);
          // height: rem(15);
          // line-height: rem(15);
          // text-align: center;
          // color: #ffffff;
          // border-radius: 50%;
          // font-size: rem(9);
          // background: rgba(252, 81, 89, 1);
          position: absolute;
          top: rem(-5);
          left: rem(45);
        }
      }
    }
    &.workbench1 {
      margin-top: rem(10);
    }
  }
}
</style>
