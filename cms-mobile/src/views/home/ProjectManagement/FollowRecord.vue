<template>
  <div class="FollowRecord">
    <van-steps direction="vertical" :active="0" active-icon="none" active-color="#18191A" v-if="timeLineListData.length > 0">
      <van-step class="van-step" v-for="(item, index) in timeLineListDataShowOff" :key="index">
        <div class="step-head">
          <span class="record-type_sapn">{{item.followAccount}}</span>
          <span>{{item.followTime ? item.followTime.replace('T','  ') : ''}}</span>
        </div>
        <p>标题：<span>{{item.title}}</span></p>
        </p>
        <p>发生内容：<span v-html="formatreplace(item.followContent)"></span></p>
        </p>
        <div class="annex-warp" v-if="item.annexes.length > 0">
          <div class="an-item" v-for="(item2, index2) in item.annexes" :key="index2">
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
    <div class="nodata" v-else>
      暂无数据
    </div>
    <div class="showMore"
          :class="{'moreAni':more}"
          v-if="timeLineListDataAll && timeLineListDataAll.length > 5"
          @click="showMore">
      <i class="iconfont iconcms_xia"></i>
    </div>
    <!-- 写跟进按钮 -->
    <div class="writeBtn" @click="writeBtn" v-if="writeBtnFlg"></div>
  </div>
</template>
<script>
import context from '@/service'
import ailPreview from '@/components/ailPreview.vue'
import common from '@/utils/common.js'
import moment from 'moment-timezone'
export default {
  name: 'FollowRecord',
  props: ['relatedId', 'relateType', 'active', 'projectId'],
  components: {ailPreview},
  watch: {
    'active': function (val) {
      if (val === 1) {
        this.writeBtnFlg = true
      } else {
        this.writeBtnFlg = true
      }
    }
  },
  data () {
    return {
      timeLineListDataAll: [],
      more: false,
      writeBtnFlg: true,
      pager: {
        currentPage: 1,
        pgNum: 1,
        total: 0,
        pgSize: 20
      },
      timeLineListData: [],
      timeLineListDataShowOff: [],
      startDate: moment(new Date()).format('YYYY') + '-01' + '-01' + 'T00:00:00.000Z',
      endDate: moment(new Date()).format('YYYY-MM-DD') + 'T23:59:59.000Z'
    }
  },
  created () {
    this.followRecord()
  },
  methods: {
    formatreplace (description) {
      if (!description) {
        return
      }
      let html = description.replace(/\n/g, '<br/>')
      return html
    },
    getformat (annexName) {
      return common.getformat(annexName)
    },
    followRecord (type) {
      context.http.get(`cms/api/followRecords/${this.relatedId}?followBusinessType=PROJECT_MANAGEMENT_RELATION`).then(res => {
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
    writeBtn () {
      sessionStorage.removeItem('selectPerson')
      this.$router.replace({name: 'rIinterestedFollow', query: {'relatedId': this.relatedId, 'relateType': this.relateType, 'projectId': this.projectId}})
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
  background-color: #3575F6;
  border-radius: 50%;
  transform: scale(.5);
}
</style>
<style lang="scss" scoped>
  @import "../../../style/config";
  .nodata{
    color: #666;
    padding: rem(40);
    text-align: center;
    font-size: rem(14);
  }
  .FollowRecord{
    background: #fff;
    .step-head{
      display: flex;
      justify-content: space-between;
      span {
        &:last-child {
          color: #858C94;
        }
      }
    }
  }
  .van-step{
    color: #18191A;
    p {
      margin-top: rem(8);
      color: #858C94;
      span {
        color: #18191A;
      }
    }
  }
  .record-type{
    text-align: right;
    padding: rem(20) rem(14);
    span {
      &:nth-child(1) {
        background-color: #3575F6;
      }
      &:nth-child(2) {
        background-color: #83BF68;
      }
      &:nth-child(3) {
        background-color: #F99A12;
      }
      &:nth-child(4) {
        background-color: #A69848;
      }
    }
  }
  .record-type_sapn{
    display: inline-block;
    height: rem(22);
    line-height: rem(22);
    font-size: rem(16);
    text-align: center;
    border-radius: rem(2);
    margin: 0 rem(2);
    font-weight: bold;
    &.OTHERS {
      background-color: #A69848;
    }
    &.PATROL {
      background-color: #3575F6;
    }
    &.CONSTRUCTION {
      background-color: #83BF68;
    }
    &.FINANCE {
      background-color: #F99A12;
    }
    &.cl-active{
      background-color: #dedfe0 !important;
    }
  }
  .annex-warp{
    background: #FAFAFA;
    border-radius: rem(4);
    margin-top: rem(8);
    border: rem(1) solid #ebedf0;
  }
  
  .an-item{
    display: flex;
    align-items: center;
    &:nth-of-type(2){
      margin-top: 0;
    }
    .image {
      margin-right: rem(10);
    }
    .annex-name{
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
  .writeBtn{
    position: fixed;
    bottom: rem(14);
    right: rem(14);
    width: rem(50);
    height: rem(50);
    background: url('../../../assets/addRepair.png') no-repeat;
    background-size: contain;
    z-index: 1;
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
