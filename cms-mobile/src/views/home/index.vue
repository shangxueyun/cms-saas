<template>
  <div class="home">
    <!-- <app-header title="this is title"
                :mode="false"></app-header> -->
    <div class="indexPage">
      <div class="header">
        <span class="greetings">{{greetings}}</span>
      </div>
      <div class="search">
        <input class="searchText" placeholder="搜索" @click="tosearchHistory" type="text" />
        <i class="mintui mintui-search"></i>
      </div>
      <div class="workbench margig">
        <div class="viewTitle">工作台</div>
        <div class="content">
          <div class="item"
               @click="toApprovalCenter">
            <i class="iconfont iconshenpizhongxin icon1 icon"></i>
            <span class="text">审批中心</span>
            <span class="badge"
                  v-if="resData.processTaskNumber + resData.processCcTaskNumber + resData.processDealTaskNumber>0">
              {{resData.processTaskNumber + resData.processCcTaskNumber + resData.processDealTaskNumber}}
            </span>
          </div>
          <div class="item"
               @click="toReportCenter">
            <i class="iconfont iconhuibaozhongxin icon2 icon"></i>
            <span class="text">汇报中心</span>
            <span class="badge"
                  v-if="resData.workReportNumber">
              {{resData.workReportNumber}}
            </span>
          </div>
          <div class="item"
               @click="toMessageCenter">
            <i class="iconfont iconxiaoxizhongxin icon3 icon"></i>
            <span class="text">消息中心</span>
            <span class="badge"
                  v-if="messageNumber">
              {{messageNumber}}
            </span>
          </div>
        </div>
      </div>
      <div class="workbench"
           v-if="hasAuthority('020101') || hasAuthority('02010405') || hasAuthority('09010101') || hasAuthority('09010102') || hasAuthority('09010103') || hasAuthority('090102') || hasAuthority('090103')"
           style="margin-top:20upx">
        <div class="viewTitle">项目管理</div>
        <div class="content">
          <div @click="toProjectManagement"
               v-if="hasAuthority('020101')"
               class="item">
            <i class="iconfont iconxiangmuxinxi icon11 icon"></i>
            <span class="text">项目信息</span>
          </div>
          <div @click="toEngineeringList"
               v-if="hasAuthority('02010405')"
               class="item">
            <i class="iconfont icongongchengtiaojian icon12 icon"></i>
            <span class="text">工程条件</span>
          </div>
          <div class="item"
               v-if="hasAuthority('09010101') || hasAuthority('09010102') || hasAuthority('09010103') || hasAuthority('090102') || hasAuthority('090103')"
               @click="todataSummary">
            <i class="iconfont iconshujuhuizong icon4 icon"></i>
            <span class="text">数据汇总</span>
          </div>
        </div>
      </div>
      <div class="workbench"
           v-if="hasAuthority('02020201') || hasAuthority('02020202') || hasAuthority('02020203')|| hasAuthority('020204')|| hasAuthority('020205')"
           style="margin-top:20upx">
        <div class="viewTitle">招商管理</div>
        <div class="content">
          <div class="item"
               v-if="hasAuthority('02020201') || hasAuthority('02020202') || hasAuthority('02020203') || hasAuthority('02020204') || hasAuthority('02020205')"
               @click="toStore">
            <i class="iconfont iconpuweizhaozu icon5 icon"></i>
            <span class="text">房源招租</span>
          </div>
          <div class="item"
               v-if="hasAuthority('020204')"
               @click="routerTo('interestedList')">
            <i class="iconfont iconyixiangkehu icon6 icon"></i>
            <span class="text">意向客户</span>
          </div>
          <div class="item"
               v-if="hasAuthority('020205')"
               @click="routerTo('contractList')">
            <i class="iconfont iconhetongliebiao icon7 icon"></i>
            <span class="text">合同列表</span>
          </div>
          <!-- <div @click="routerTo('storeChart')"
               v-if="hasAuthority('02020205')"
               class="item">
            <i class="iconfont iconzukongtu icon3 icon"></i>
            <span class="text">租控图</span>
          </div> -->
          <div class="item"
               v-if="hasAuthority('090104')"
               @click="torentalHousing">
            <i class="iconfont iconzulinfangyuan icon11 icon"></i>
            <span class="text">租赁房源</span>
          </div>
        </div>
      </div>
      <div class="workbench"
           v-if="hasAuthority('02030106') || (hasAuthority('020303') && (hasAuthority('02030301') || hasAuthority('02030320')))"
           style="margin-top:20upx">
        <div class="viewTitle">运营管理</div>
        <div class="content">
          <div @click="toCustomerPlan"
               v-if="hasAuthority('02030101') || hasAuthority('02030106') || hasAuthority('02030102')"
               class="item">
            <i class="iconfont iconkehuliebiao icon6 icon"></i>
            <span class="text">客户管理</span>
          </div>
          <!-- <div @click="torentControlChart"
               v-if="hasAuthority('02030106')"
               class="item">
            <i class="iconfont iconzukongtu icon8 icon"></i>
            <span class="text">租控图</span>
          </div> -->
          <div @click="tofeesCollected"
               v-if="hasAuthority('02030301') || hasAuthority('02030320')"
               class="item">
            <i class="iconfont iconfeiyong icon9 icon"></i>
            <span class="text">费用收缴</span>
          </div>
          <div @click="routerTo('repairsInfo')"
               v-if="hasAuthority('02030203')"
               class="item">
            <i class="iconfont iconbaoxiuxinxi  icon"></i>
            <span class="text">报修信息</span>
          </div>
          <div class="item"
               v-if="hasAuthority('090106')"
               @click="toClient">
            <i class="iconfont iconzuhuliebiao  icon"></i>
            <span class="text">客户列表</span>
          </div>
        </div>
      </div>
      <div :class="domHeight.toString().search('false') ? 'workbench height' : 'workbench'"
           v-if="hasAuthority('03050101') || (hasAuthority('03050106')) || (hasAuthority('03050111')) || (hasAuthority('03060101')) || (hasAuthority('03070101')) || (hasAuthority('03070105'))"
           style="margin-top:20upx">
        <div class="viewTitle">物业管理</div>
        <div class="content">
          <div @click="routerTo('Inspection', '巡更巡检')"
               v-if="hasAuthority('03050101')"
               class="item">
            <i class="iconfont iconxungengxunjian icon3 icon"></i>
            <span class="text">巡更巡检</span>
          </div>
          <div @click="routerTo('Inspection', '消防检查')"
               v-if="hasAuthority('03050106')"
               class="item">
            <i class="iconfont iconxiaofangjiancha icon14 icon"
               style="color: #EF6248"></i>
            <span class="text">消防检查</span>
          </div>
          <!-- <div @click="routerTo('emergencyList')"
               v-if="hasAuthority('0302')"
               class="item">
            <i class="iconfont iconyingjishixiang  icon"></i>
            <span class="text">应急事项</span>
          </div> -->
          <div @click="routerTo('maintainList')"
               v-if="hasAuthority('03050111')"
               class="item">
            <i class="iconfont iconbaoyangliebiao icon9 icon"></i>
            <span class="text">保养列表</span>
          </div>
          <div @click="routerTo('repairList')"
               v-if="hasAuthority('03060101')"
               class="item">
            <i class="iconfont iconweixiuguanli icon9 icon"></i>
            <span class="text">维修管理</span>
          </div>

          <div @click="routerTo(hasAuthority('03070101')?'workingSchedule':'personList')"
               v-if="hasAuthority('03070101') || hasAuthority('03070105')"
               class="item">
            <i class="iconfont iconbaoanbaojie  icon"></i>
            <span class="text">保安保洁</span>
          </div>
          <template v-if="hasAuthority('030801')">
            <div @click="routerTo('illuminatingSystem')"
                 v-if="hasAuthority('03080121') || hasAuthority('03080106') || hasAuthority('03080111')"
                 class="item">
              <i class="iconfont iconzhaoming icon8 icon"></i>
              <span class="text">照明系统</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import AppHeader from '@/components/appHead'
import context from '@/service'
import myMixin from '../home/dataSummary/mixin'
export default {
  name: 'index',
  footVisible: true,
  components: {},
  mixins: [myMixin],
  watch: {
  },
  data () {
    return {
      greetings: '上午好！',
      messageNumber: 0,
      resData: { workReportNumber: 0, processTaskNumber: 0, processCcTaskNumber: 0 },
      hasChartsAT: false,
      hasAuthorityDataSum: true,
      domHeight: []
    }
  },
  created () {
    this.greetingsFn()
    this.query()
    this.messageCount()
  },
  beforeDestroy () {
  },
  mounted () {
    this.getUserSubscribe().then(res => {
      let resulte = this.isOnSubscribe(1) || this.isOnSubscribe(12) || this.isOnSubscribe(13) || this.isOnSubscribe(2) || this.isOnSubscribe(11) || this.isOnSubscribe(14) || this.isOnSubscribe(15)
      if (resulte) {
        this.hasChartsAT = true
      } else {
        this.hasChartsAT = false
      }
    })
    this.domHeight.push(this.hasAuthority('03070101'))
    this.domHeight.push(this.hasAuthority('03070105'))
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    query () {
      context.http.get('cms/api/staging').then(res => {
        this.resData = res.data
        // this.$router.push({name: 'jobContent'})
      })
    },
    messageCount () {
      context.http.get('mps/api/messageCenters/notReadCount').then(res => {
        this.messageNumber = res.data
      })
    },
    toStore () {
      if (this.hasAuthority('02020201') || this.hasAuthority('02020202') || this.hasAuthority('02020203') || this.hasAuthority('02020204')) {
        this.$router.push({ name: 'storeList' })
      } else if (this.hasAuthority('02020205')) {
        this.$router.push({ name: 'storeChart' })
      }
    },
    toApprovalCenter () { // 审批中心
      this.$router.push({ name: 'approvalCenter' })
    },
    toReportCenter () { // 审批中心
      this.$router.push({ name: 'reportCenter' })
    },
    toMessageCenter () { // 消息中心
      this.$router.push({ name: 'messageCenter' })
    },
    todataSummary () {
      this.$router.push({ name: 'dataSummary' })
    },
    torentalHousing () {
      this.$router.push({ name: 'housingHome' })
    },
    toClient () {
      this.$router.push({ name: 'clientListHome' })
    },
    torentControlChart () {
      this.$router.push({ name: 'rentControlChart' })
    },
    tofeesCollected () {
      if (this.hasAuthority('02030301')) {
        this.$router.push({ name: 'feesCollected' })
      } else if (this.hasAuthority('02030320')) {
        this.$router.push({ name: 'tenantBillsList' })
      }
    },
    toProjectManagement () {
      this.$router.push({ name: 'projectInformation' })
    },
    toEngineeringList () {
      this.$router.push({ name: 'engineeringList' })
    },
    toCustomerPlan () {
      if (this.hasAuthority('02030101')) {
        this.$router.push({ name: 'customerPlan' })
      } else if (this.hasAuthority('02030106')) {
        this.$router.push({ name: 'rentControlChart' })
      } else if (this.hasAuthority('02030102')) {
        this.$router.push({ name: 'tenantList' })
      }
    },
    tosearchHistory () {
      this.$router.push({ name: 'searchHistory' })
    },
    routerTo (name, key) {
      if (name === 'Inspection') {
        this.$router.push({ name, params: { type: key } })
      } else {
        this.$router.push({ name: name })
      }
    },
    greetingsFn () {
      let timeNow = new Date()
      // 获取当前小时
      let hours = timeNow.getHours()
      // 设置默认文字
      let span = ''
      // 判断当前时间段
      if (hours >= 6 && hours < 8) {
        span = `早上好！`
      } else if (hours >= 8 && hours < 11) {
        span = `上午好！`
      } else if (hours >= 11 && hours < 13) {
        span = `中午好！`
      } else if (hours >= 13 && hours < 18) {
        span = `下午好！`
      } else if (hours >= 18 && hours < 23) {
        span = `晚上好！`
      } else if (hours >= 23 || hours < 5) {
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
    }
  }
}
</script>
<style scoped lang="scss" >
@import "../../style/config";
.home {
  background: #f8f9fa;
  min-height: 100%;
  box-sizing: border-box;
}
.viewTitle {
  font-size: rem(16);
  height: rem(40);
  line-height: rem(40);
  color: #18191a;
  padding-left: rem(14);
  border-bottom: rem(1) solid #f2f2f2;
  font-weight: bold;
}
.indexPage {
  padding-bottom: rem(100);
  .header {
    height: rem(80);
    background: url("../../assets/indexbg.png") #fff no-repeat;
    background-size: 100% 100%;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1;
    .greetings {
      font-size: rem(25);
      font-weight: bold;
      color: #18191a;
      // position: absolute;
      // top: rem(38);
      // left: rem(14);
      padding: rem(38) 0 0 rem(14);
      display: inline-block;
    }
  }
  .search {
    margin-top: rem(80);
    background: #fff;
    padding: rem(8) rem(22);
    position: relative;
    border-bottom: rem(1) solid #f2f2f2;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1;
    .searchText {
      width: 100%;
      height: rem(28);
      border-radius: rem(4);
      text-align: center;
      line-height: rem(28);
      padding-left: rem(16);
      color: #aaaaaa;
      background: #F1F1F1;
    }                 /* Firefox版本4-18 */
    .searchText::-webkit-input-placeholder{
      color: #aaaaaa;
    }    /* 使用webkit内核的浏览器 */
    .searchText::-moz-placeholder{
      color: #aaaaaa;
    }                  /* Firefox版本19+ */
    .searchText:-moz-placeholder{
      color: #aaaaaa;
    } 
    i{
      position: absolute;
      top: 30%;
      left: 43%;
      color: #aaaaaa;
    }
  }
  .margin {
    margin-top: rem(80);
  }
  .margig {
    margin-top: rem(124);
  }
  .workbench {
    height: rem(140);
    background-color: #ffffff;
    margin-bottom: rem(10);
    .content {
      // height: rem(88);
      display: flex;
      padding: 0 rem(20);
      align-items: center;
      flex-wrap: wrap;
      // justify-content: space-between;
      .item {
        // width: rem(65);
        width: 25%;
        // height:130upx;
        margin: rem(16) 0;
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
              rgba(38, 207, 255, 1) 0%,
              rgba(4, 149, 254, 1) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          &.icon2 {
            background: linear-gradient(
              90deg,
              rgba(255, 180, 0, 1) 0%,
              rgba(243, 155, 42, 1) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          &.icon3 {
            background: linear-gradient(
              90deg,
              rgba(168, 224, 99, 1) 0%,
              rgba(86, 171, 47, 1) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          &.icon4 {
            background: linear-gradient(
              90deg,
              rgba(255, 126, 77, 1) 0%,
              rgba(255, 99, 72, 1) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          &.icon5 {
            background: linear-gradient(
              90deg,
              rgba(255, 180, 0, 1) 0%,
              rgba(243, 155, 42, 1) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          &.icon6 {
            background: linear-gradient(
              90deg,
              rgba(38, 207, 255, 1) 0%,
              rgba(4, 149, 254, 1) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          &.icon7 {
            background: linear-gradient(
              90deg,
              rgba(38, 207, 255, 1) 0%,
              rgba(4, 149, 254, 1) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          &.icon8 {
            background: linear-gradient(
              90deg,
              rgba(38, 207, 255, 1) 0%,
              rgba(4, 149, 254, 1) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          &.icon9 {
            background: linear-gradient(
              90deg,
              rgba(255, 180, 0, 1) 0%,
              rgba(243, 155, 42, 1) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          &.icon10 {
            background: linear-gradient(90deg, #a8e063 0%, #56ab2f 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          &.icon11 {
            background: linear-gradient(90deg, #96d558 0%, #68b63a 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          &.icon12 {
            background: linear-gradient(90deg, #20c5fd 0%, #0fa4fd 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          &.icon13 {
            background: linear-gradient(90deg, #ef6248 0%, #ef6248 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          &.icon14 {
            background: linear-gradient(90deg, #ff9b77 0%, #ff7d4c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          &.icon15 {
            background: linear-gradient(90deg, #e89b1f 0%, #e89b1f 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          &.icon16 {
            background: linear-gradient(90deg, #f5b500 0%, #f5b500 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          &.iconyingjishixiang {
            background: linear-gradient(
              90deg,
              rgba(255, 180, 0, 1) 0%,
              rgba(243, 155, 42, 1) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          &.iconbaoanbaojie {
            background: linear-gradient(
              90deg,
              rgba(38, 207, 255, 1) 0%,
              rgba(4, 149, 254, 1) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          &.iconbaoxiuxinxi {
            background: linear-gradient(
              90deg,
              rgba(38, 207, 255, 1) 0%,
              rgba(4, 149, 254, 1) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          &.iconzuhuliebiao {
            background: linear-gradient(90deg, #ff9b77 0%, #ff7d4c 100%);
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
  }
  .height {
    height: rem(220);
  }
}
</style>
