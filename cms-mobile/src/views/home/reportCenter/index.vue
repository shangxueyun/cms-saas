<template>
  <div class="reportCenter"
       @click="addMenu=false">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="onGoBack"></i>
      <div class="headTab">
        汇报中心
      </div>
      <div class="addBtn"
           @click.stop="addMenu=true">
        <i class="iconfont iconcms_tianjia"></i>
      </div>
      <!-- <i class="addBtn">+</i> -->
    </div>
    <div class="content common_list ">
      <mt-cell title="我的汇报"
               class="myReport"
               @click.native="toReportList('all',true)"
               is-link>
        <!-- <span class="badge">2</span> -->
      </mt-cell>
      <mt-cell title="所有日报"
               @click.native="toReportList('Day',false)"
               class="dayReport"
               is-link>
        <span class="badge"
              v-if="numbers[0]>0">{{numbers[0]>99?'99+':numbers[0]}}</span>
      </mt-cell>
      <mt-cell title="所有周报"
               @click.native="toReportList('Week',false)"
               class="weekReport"
               is-link>
        <span class="badge"
              v-if="numbers[1]>0">{{numbers[1]>99?'99+':numbers[1]}}</span>
      </mt-cell>
      <mt-cell title="所有月报"
               @click.native="toReportList('Month',false)"
               class="allReport"
               is-link>
        <span class="badge"
              v-if="numbers[2]>0">{{numbers[2]>99?'99+':numbers[2]}}</span>
      </mt-cell>
    </div>
    <div class="addList"
         v-if="addMenu">
      <div @click="toAddReport('Day')"><i class="iconfont iconanri1"></i>写日报</div>
      <div @click="toAddReport('Week')"><i class="iconfont iconanzhou1"></i>写周报</div>
      <div @click="toAddReport('Month')"><i class="iconfont iconanyue"></i>写月报</div>
    </div>
  </div>
</template>
<script>
// import AppHeader from '@/components/appHead'
import context from '@/service'
export default {
  name: 'reportCenter',
  footVisible: true,
  components: {},
  watch: {
  },
  data () {
    return {
      addMenu: false,
      numbers: [0, 0, 0]
    }
  },
  created () {
    this.getNumbers()
  },
  beforeDestroy () {
  },
  mounted () {

  },
  methods: {
    getNumbers () { // 汇报数量
      context.http.get('cms/api/workReports/noReadedCount').then(res => {
        this.numbers = res.data
      }).catch(error => {
        console.info(error)
      })
    },
    onGoBack () { // 返回首页
      this.$router.push({ name: 'index' })
    },
    toAddReport (type) { // 新增汇报
      sessionStorage.removeItem('selectPerson')
      this.$router.push({ name: 'addReport', params: { addType: type, pageFrom: 'add' } })
    },
    toReportList (type, onMy) { // 汇报列表
      this.$router.push({ name: 'reportList', params: { reportType: type, onMy: onMy } })
    }
  }
}
</script>
<style scoped lang="scss" >
@import "../../../style/config";
$contentTop-height: rem(50);
.reportCenter {
  height: calc(100% - #{$contentTop-height});
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
    z-index: 9;
    .headTab {
      color: #18191a;
      text-align: center;
      font-size: rem(17);
      width: rem(150);
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
      color: #444547;
      position: relative;
    }
  }
  .content {
    margin-top: rem(50);
    .myReport {
      margin-bottom: rem(10);
      .mint-cell-wrapper {
        border: none;
      }
    }
  }
  .addList {
    width: rem(130);
    background: rgba(77, 80, 84, 1);
    box-shadow: 0px 0px 11px 0px rgba(164, 164, 164, 0.36);
    border-radius: rem(4);
    position: absolute;
    top: rem(40);
    right: rem(16);
    > div {
      color: #fff;
      font-size: rem(15);
      // text-align: center;
      padding-left: rem(15);
      height: rem(50);
      line-height: rem(50);
      > i {
        margin-right: rem(10);
      }
      &:not(:last-child) {
        border-bottom: rem(1) solid #37393a;
      }
    }
  }
}
</style>
