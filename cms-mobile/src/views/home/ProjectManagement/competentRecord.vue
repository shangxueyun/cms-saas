<template>
  <div class="competentRecord">
    <van-steps direction="vertical"
               :active="0"
               active-icon="none"
               active-color="#18191A"
               v-if="timeLineListData.length > 0">
      <van-step class="van-step"
                v-for="(item, index) in timeLineListDataShowOff"
                :key="index">
        <div class="step-head">
          <span class="record-type_sapn">{{item.writter}}</span>
          <span>{{item.recordDate.replace('T','  ')}}</span>
        </div>
        <p>
          <span>发生事件：</span>
          <span>{{item.title}}</span>
        </p>
        <p>
          <span>发生内容：</span>
          <span>{{item.content}}</span>
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
      <img src="../../../assets/nores.png">
      <p>暂无数据</p>
    </div>
    <div class="showMore"
         :class="{'moreAni':more}"
         v-if="timeLineListDataAll && timeLineListDataAll.length > 5"
         @click="showMore">
      <i class="iconfont iconcms_xia"></i>
    </div>
    <!-- 写跟进按钮 -->
    <div class="writeBtn"
         @click="writeBtn"></div>
  </div>
</template>
<script>
import context from '@/service'
import ailPreview from '@/components/ailPreview.vue'
import common from '@/utils/common.js'
import moment from 'moment-timezone'
export default {
  name: 'competentRecord',
  props: ['tenantDetail'],
  components: { ailPreview },
  data () {
    return {
      timeLineListDataAll: [],
      more: false,
      timeLineListData: [],
      timeLineListDataShowOff: []
    }
  },
  created () {
    this.followRecord()
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    getformat (annexName) {
      return common.getformat(annexName)
    },
    followRecord () {
      if (this.tenantDetail.chargeDeptRecords.length > 5) {
        this.timeLineListData = this.tenantDetail.chargeDeptRecords.slice(0, 5)
      } else {
        this.timeLineListData = this.tenantDetail.chargeDeptRecords
      }
      this.timeLineListDataAll = this.tenantDetail.chargeDeptRecords
      this.timeLineListDataShowOff = this.timeLineListData
    },
    showMore () {
      this.more = !this.more
      if (this.more) {
        this.timeLineListDataShowOff = this.timeLineListDataAll
      } else {
        this.timeLineListDataShowOff = this.timeLineListData
      }
    },
    writeBtn () {
      sessionStorage.removeItem('selectPerson')
      this.$router.push({ name: 'competentWriteFollow', query: { 'id': this.tenantDetail.id } })
    }
  }
}
</script>
<style lang="scss">
@import "../../../style/config";
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
@import "../../../style/config";
.nodata {
  color: #444547;
  padding: rem(40);
  text-align: center;
  font-size: rem(15);
  img {
    width: rem(80);
    height: auto;
    margin-bottom: rem(10);
  }
}
.competentRecord {
  background: #fff;
  .step-head {
    display: flex;
    justify-content: space-between;
    margin-bottom:rem(8);
    span {
      &:first-child {
        color: #18191A;
        font-weight: 600;
        font-size: rem(16);
      }
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
      background-color: #a69848;
    }
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
.competentRecord {
  .writeBtn {
    position: fixed;
    bottom: rem(14);
    right: rem(14);
    width: rem(50);
    height: rem(50);
    background: url("../../../assets/addRepair.png") no-repeat;
    background-size: contain;
  }
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
