<template>
  <div class="lightingplan">
    <div class="content common_list">
      <div class="plan">
        <div class="planList" @click="toDetails('常规照明')">
          <div class="top">
            <i class="iconfont iconchanggui"></i>
            </div>
          <div class="buttom">
          <div class="listq">常规照明</div>
          <div class="listw">已配置群组 {{ this.Statisticscount.group }}/{{ this.Statisticscount.all }}</div>
          </div>
        </div>
        <div class="planList" @click="toDetails('节假日照明')">
          <div class="top top1">
            <i class="iconfont iconjiejiari"></i>
          </div>
          <div class="buttom">
          <div class="listq">节假日/特殊日期</div>
          <div class="listw">已选择群组 {{ Statisticscount.groupDate }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import context from '@/service'
import { Toast } from 'vant'
export default {
  name: 'lightingplan',
  footVisible: true,
  data () {
    return {
      NOdata: require('@/assets/nores.png'),
      allLoaded: false,
      scrolling: false,
      Statisticscount: {
        all: '',
        group: '',
        groupDate: ''
      }

    }
  },
  props: {
    config: {
      type: Object,
      default: {}
    },
    filter: {
      type: Object,
      default: {}
    }
  },
  created () {
    this.query()
    this.holidays()
  },
  // 离开
  beforeRouteLeave (to, from, next) {
    if (to.name === 'illuminatingSystem') {
      // 默认数据
      to.params.filter = this.$route.params.filter
      to.params.config = this.$route.params.config
    }

    next()
  },
  mounted () {

  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    // 筛选更新列表方法
    filterUpdate () {
      this.query()
      this.holidays()
    },
    query (param) {
      context.http.get(`rms/api/lightingGroup/list/${this.filter.projectManagementId}/count`).then(res => {
        if (res.status === 200) {
          this.Statisticscount.all = res.data[1]
          this.Statisticscount.group = res.data[0]
        }
      })
    },
    holidays (param) {
      context.http.get(`rms/api/lightingPlan/holidays?projectManagementId=${this.filter.projectManagementId}`).then(res => {
        if (res.status === 200) {
          this.Statisticscount.groupDate = res.data.length
        }
      })
    },
    toDetails (type) {
      let { group, all } = this.Statisticscount
      this.$emit('RouteParamsC', 'detailsLightingPlan', { type, group, all })
    },
    typeChange (type) {
      this.currentPage = 1
      this.onSend = type
      this.allLoaded = false
      this.tableData = []
      this.$nextTick(() => {
        this.query()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../../style/config";
$contentTop-height: rem(108);
.lightingplan {
  height: calc(100vh - #{$contentTop-height});
  background-color: #fff;
  &.noDataCls {
    height: calc(100% - #{$contentTop-height});
  }
  .content {
    // margin-top: rem(108);
    // min-height: rem(200);
    background-color: #fff;
    &.noDataCls {
      height: 100%;
      position: relative;
    }
    &.scrolling {
      margin-top: rem(98);
    }
    .plan {
      display: flex;
      .planList {
        flex: 1;
        height: rem(200);
        margin: rem(10);
        // background-color: pink;
        box-shadow: 0px 0px rem(20) #F0F0F0;
        .top {
          border-radius: rem(8) rem(8) 0 0;
          background-color: #7892CB;
          height: 70%;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          .iconfont {
            font-size: rem(60);
          }
        }
          .top1 {
            background-color: #78CBB4;
          }
        .buttom {
          height: 30%;
          padding: rem(8);
          border-radius: 0 0 rem(8) rem(8);
          // background-color: #ccc;
          .listq {
            color: #444547;
            font-weight: 500;
            font-weight: bolder;
          }
          .listw {
            margin-top: rem(6);
            color: #717171;
            font-size: rem(12);
          }
        }
      }
    }
  }
}
</style>
