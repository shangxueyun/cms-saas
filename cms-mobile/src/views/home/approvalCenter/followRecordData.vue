<template>
  <div class="followRecordData">
    <app-header title="跟进记录"></app-header>
    <van-steps direction="vertical"
               :active="0"
               active-icon="none"
               active-color="#18191A"
               v-if="recordData.length > 0">
      <van-step class="van-step"
                v-for="(item, index) in recordData"
                :key="index">
        <div class="step-head">
          <span class="record-type_sapn">跟进
            <span class="iconfont iconnew" v-if="item.onRead === false"></span>
          </span>
          <span>{{item.createdDate}}</span>
        </div>
        <!-- <p>{{item.followName}}</p> -->
        <p>
          <span>跟进人：</span>
          <span>{{item.followName}}</span>
        </p>
        <p>
          <span>跟进时间：</span>
          <span>{{formatApprovalDate(item.followTime)}}</span>
        </p>
        <p>
          <span>标题：</span>
          <span>{{item.title}}</span>
        </p>
        <p>
          <span>内容：</span>
          <span>{{item.followContent}}</span>
        </p>
        <div class="annex-warp"
             v-if="item.annexes.length > 0">
          <div class="an-item"
               v-for="(item2, index2) in item.annexes"
               :key="index2">
            <div class="image">
              <svg class="icon"
                   aria-hidden="true">
                <use :xlink:href="getformat(item2.annexName)"></use>
              </svg>
            </div>
            <div class="annex-name">{{item2.annexName}}</div>
            <ailPreview :ailObj="item2"
                        :encrypt="true"
                        class="ailPreview" />
          </div>
        </div>
      </van-step>
    </van-steps>
    <div class="loadAll"
         v-if="recordData.length !== 0 && allLoaded">
      <span>-</span>
      <p>已经到底了</p>
      <span>-</span>
    </div>
    <div class="noData"
         v-if="!recordData.length">
      <img src="../../../assets/nores.png" />
      <p>暂无数据</p>
    </div>
    <!-- <div class="showMore"
         :class="{'moreAni':more}"
         v-if="timeLineListDataAll && timeLineListDataAll.length > 5"
         @click="showMore">
      <i class="iconfont iconcms_xia"></i>
    </div> -->
    <!-- 写跟进按钮 -->
    <div class="writeBtn"
         @click="writeBtn"></div>
  </div>
</template>
<script>
import AppHeader from '@/components/appHead'
import context from '@/service'
import ailPreview from '@/components/ailPreview.vue'
import common from '@/utils/common.js'
import moment from 'moment-timezone'
export default {
  name: 'followRecordData',
  props: ['tenantID', 'active'],
  components: { AppHeader, ailPreview },
  watch: {
  },
  data () {
    return {
      timeLineListDataAll: [],
      more: false,
      followTypes: ['CONSTRUCTION', 'FINANCE', 'PATROL', 'CHECK', 'OTHERS'],
      ctlist: [
        { name: '巡场', value: 'PATROL', tabActiveValFg: false },
        { name: '施工', value: 'CONSTRUCTION', tabActiveValFg: false },
        { name: '财务', value: 'FINANCE', tabActiveValFg: false },
        { name: '检查', value: 'CHECK', tabActiveValFg: false },
        { name: '其他', value: 'OTHERS', tabActiveValFg: false }
      ],
      writeBtnFlg: false,
      contractInfo: {
        annexes: []
      },
      pager: {
        currentPage: 1,
        pgNum: 1,
        total: 0,
        pgSize: 20
      },
      info: {
        id: null,
        taskId: null
      },
      timeLineListData: [],
      recordData: [],
      allLoaded: false,
      followRecordTypes: 'CONSTRUCTION,FINANCE,PATROL,CHECK,OTHERS',
      startDate: moment(new Date()).format('YYYY') + '-01' + '-01' + 'T00:00:00.000Z',
      endDate: moment(new Date()).format('YYYY-MM-DD') + 'T23:59:59.000Z'
    }
  },
  created () {
    this.info = JSON.parse(sessionStorage.getItem('businessInfo'))
    this.followRecord()
  },
  beforeRouteLeave (to, from, next) {
    if (to.name !== 'recordData' && to.name !== 'FilePreview') {
      sessionStorage.getItem('businessInfo') ? sessionStorage.removeItem('businessInfo') : null
    }
    next()
  },
  methods: {
    formatApprovalDate (time) {
      if (time) {
        time = time.substr(0, time.lastIndexOf('T'))
        return time
      }
    },
    getformat (annexName) {
      return common.getformat(annexName)
    },
    tabFun (item, index) {
      item.tabActiveValFg = !item.tabActiveValFg
      let followRecordTypes = this.followTypes
      if (item.tabActiveValFg) {
        let newIdx = followRecordTypes.indexOf(item.value)
        followRecordTypes.splice(newIdx, 1)
      } else {
        followRecordTypes.push(item.value)
      }
      // this.tabActiveVal = item.value
      this.followRecordTypes = followRecordTypes.join(',')
      this.followRecord()
    },
    followRecord () {
      this.allLoaded = false
      context.http.get(`cms/api/queryTaskFollowRecords/${this.info.id}`, {refresh: true}).then(res => {
        if (res.status === 200) {
          this.recordData = res.data
          this.allLoaded = true
        }
      })
    },
    // showMore () {
    //   this.more = !this.more
    //   if (this.more) {
    //     this.timeLineListDataShowOff = this.timeLineListDataAll
    //   } else {
    //     this.timeLineListDataShowOff = this.timeLineListData
    //   }
    // },
    writeBtn () {
      this.$router.push({ name: 'recordData' })
    }
  }
}
</script>
<style lang="scss">
// @import "../../../style/config.scss";
// i.van-step__icon--active {
//   display: block;
//   width: rem(20);
//   height: rem(20);
//   background-color: #3575f6;
//   border-radius: 50%;
//   transform: scale(0.5);
// }
</style>
<style lang="scss" scoped>
@import "../../../style/config.scss";
.nodata {
  color: #666;
  padding: rem(40);
  text-align: center;
  font-size: rem(14);
}
.followRecordData {
  background: #fff;
  .step-head {
    display: flex;
    justify-content: space-between;
    .record-type_sapn {
      text-align: left;
      font-size: rem(18);
      height: rem(18);
      line-height: rem(18);
      font-weight: 700;
      .iconfont {
        vertical-align: text-top;
        color: #FC5159;
      }
    }
    span {
      &:last-child {
        color: #858c94;
      }
    }
  }
  .van-steps--vertical {
    // top: rem(40);
    margin-top: rem(40);
  }
}
.van-step {
  color: #18191a;
  p {
    margin-top: rem(8);
    span {
      &:first-child {
        color: #858c94;
      }
    }
  }
}
.record-type_sapn {
  width: rem(180);
  height: rem(22);
  line-height: rem(22);
  font-size: rem(15);
  text-align: center;
  margin: 0 rem(2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.annex-warp {
  background: #fafafa;
  border-radius: rem(4);
  margin-top: rem(8);
  border: rem(1) solid #ebedf0;
}

.an-item {
  display: flex;
  align-items: center;
  &:nth-of-type(2) {
    margin-top: 0;
  }
  .image {
    margin-right: rem(10);
  }
  .annex-name {
    width: 80%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-bottom: rem(4);
  }
  .ailPreview {
    flex: 1;
    text-align: right;
  }
}
.writeBtn {
  position: fixed;
  bottom: rem(10);
  right: rem(10);
  width: rem(50);
  height: rem(50);
  background: url("../../../assets/xgj.png") no-repeat;
  background-size: contain;
}
.showMore {
  padding: rem(10) 0;
  text-align: center;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: center;
  justify-content: center;
  color: #0139a4;
  background: #fff;
  &.moreAni {
    transform: rotate(180deg);
    transform-origin: center center;
  }
}
</style>
