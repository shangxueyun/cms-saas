<template>
  <div class="FollowRecord">
    <div class="record-type">
      <span v-for="(item, index) in ctlist"
            :key="index"
            @click="tabFun(item, index)"
            class="record-type_sapn"
            :class="item.tabActiveValFg ? 'cl-active' : ''">
        {{item.name}}
      </span>
    </div>
    <van-steps direction="vertical"
               :active="0"
               active-icon="none"
               active-color="#18191A"
               v-if="timeLineListData.length > 0">
      <van-step class="van-step"
                v-for="(item, index) in timeLineListDataShowOff"
                :key="index">
        <div class="step-head">
          <span class="record-type_sapn"
                :class="{
            'PATROL': item.followRecordType === 'PATROL',
            'CONSTRUCTION': item.followRecordType === 'CONSTRUCTION',
            'FINANCE': item.followRecordType === 'FINANCE',
            'CHECK': item.followRecordType === 'CHECK',
            'OTHERS': item.followRecordType === 'OTHERS'
          }">{{formatTimeLineTitle(item.followRecordType)}}</span>
          <span>{{item.followTime ? item.followTime.replace('T','  ') : ''}}</span>
        </div>
        <p>{{item.followName}}</p>
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
    <div class="nodata"
         v-else>
      暂无数据
    </div>
    <div class="showMore"
         :class="{'moreAni':more}"
         v-if="timeLineListDataAll && timeLineListDataAll.length > 5"
         @click="showMore">
      <i class="iconfont iconcms_xia"></i>
    </div>
    <!-- 写跟进按钮 -->
    <div class="writeBtn"
         @click="writeBtn"
         v-if="writeBtnFlg"></div>
  </div>
</template>
<script>
import context from '@/service'
import ailPreview from '@/components/ailPreview.vue'
import common from '@/utils/common.js'
import moment from 'moment-timezone'
export default {
  name: 'FollowRecord',
  props: ['tenantID', 'active'],
  components: { ailPreview },
  watch: {
    'active': function (val) {
      if (val === 1) {
        this.writeBtnFlg = true
      } else {
        this.writeBtnFlg = false
      }
    }
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
      timeLineListData: [],
      timeLineListDataShowOff: [],
      followRecordTypes: 'CONSTRUCTION,FINANCE,PATROL,CHECK,OTHERS',
      startDate: moment(new Date()).format('YYYY') + '-01' + '-01' + 'T00:00:00.000Z',
      endDate: moment(new Date()).format('YYYY-MM-DD') + 'T23:59:59.000Z'
    }
  },
  created () {
    this.followRecord()
  },
  methods: {
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
    followRecord (type) {
      context.http.get('cms/api/followRecord/tenantMap', {
        page: (this.pager.currentPage - 1),
        size: 3,
        sort: 'id,desc',
        startTime: this.startDate,
        endTime: this.endDate,
        followRecordTypes: this.followRecordTypes,
        tenantId: this.tenantID
      }).then(res => {
        if (res.status === 200) {
          if (res.data.length > 5) {
            this.timeLineListData = res.data.slice(0, 5)
          } else {
            this.timeLineListData = res.data
          }
          this.timeLineListDataAll = res.data
          this.timeLineListDataShowOff = this.timeLineListData
        }
      })
    },
    showMore () {
      this.more = !this.more
      if (this.more) {
        this.timeLineListDataShowOff = this.timeLineListDataAll
      } else {
        this.timeLineListDataShowOff = this.timeLineListData
      }
    },
    formatTimeLineTitle (type) { // 时间线头部遍历
      switch (type) {
        case 'INPUT':
          return '录入'
        case 'FOLLOW':
          return '跟进'
        case 'PROCESS_RUNING':
          return '审批中'
        case 'PROCESS_AGREED':
          return '审批通过'
        case 'CONSTRUCTION':
          return '施工'
        case 'FINANCE':
          return '财务'
        case 'PATROL':
          return '巡场'
        case 'CHECK':
          return '检查'
        case 'OTHERS':
          return '其他'
      }
    },
    writeBtn () {
      sessionStorage.removeItem('selectPerson')
      this.$router.replace({ name: 'WriteFollowup', query: { 'tenantID': this.tenantID } })
    }
  }
}
</script>
<style lang="scss">
@import "../../../../style/config";
i.van-step__icon--active {
  display: block;
  width: rem(20);
  height: rem(20);
  background-color: #3575f6;
  border-radius: 50%;
  transform: scale(0.5);
}
</style>
<style lang="scss" scoped>
@import "../../../../style/config";
.nodata {
  color: #666;
  padding: rem(40);
  text-align: center;
  font-size: rem(14);
}
.FollowRecord {
  background: #fff;
  .step-head {
    display: flex;
    justify-content: space-between;
    span {
      &:last-child {
        color: #858c94;
      }
    }
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
.record-type {
  text-align: right;
  padding: rem(20) rem(14);
  span {
    &:nth-child(1) {
      background-color: #3575f6;
    }
    &:nth-child(2) {
      background-color: #83bf68;
    }
    &:nth-child(3) {
      background-color: #f99a12;
    }
    &:nth-child(4) {
      background-color: #44af69;
    }
    &:nth-child(5) {
      background-color: #a69848;
    }
  }
}
.record-type_sapn {
  display: inline-block;
  width: rem(45);
  height: rem(22);
  line-height: rem(22);
  font-size: rem(15);
  text-align: center;
  border-radius: rem(2);
  color: #fff;
  margin: 0 rem(2);
  &.OTHERS {
    background-color: #a69848;
  }
  &.PATROL {
    background-color: #3575f6;
  }
  &.CONSTRUCTION {
    background-color: #83bf68;
  }
  &.FINANCE {
    background-color: #f99a12;
  }
  &.CHECK {
    background-color: #44af69;
  }
  &.cl-active {
    background-color: #dedfe0 !important;
  }
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
  bottom: rem(14);
  right: rem(14);
  width: rem(50);
  height: rem(50);
  background: url("../../../../assets/xgj.png") no-repeat;
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
