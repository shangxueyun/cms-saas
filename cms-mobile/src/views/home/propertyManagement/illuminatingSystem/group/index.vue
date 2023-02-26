<template>
  <div class="group">
    <div class="content common_list">
      <mt-loadmore ref="loadmore"
                   :bottom-method="loadBottom"
                   :autoFill="false"
                   :bottom-all-loaded="allLoaded">
        <ul>
          <li v-for="(item,index) in tableData"
              :key="index"
              @click="toDetails(item.id)">
            <div>
              <span class="shopNb">{{ item.name }}</span>
              <span :class="item.useStatus === 'USING' ? 'status_action postion USING' : 'status postion USING'"></span>
              <span class="iconfont iconright postion"></span>
            </div>
            <div class="bottom-div">
              <span>{{ item.lightingLoopNumber }}回路 {{ item.lightingPlan ? `- ${item.lightingPlan.name}` : '' }}</span>
              <!-- <span><i class="iconfont icondingwei2x"></i>{{item.installPosition}}</span> -->
            </div>
          </li>
        </ul>
      </mt-loadmore>
      <div class="loadAll"
           v-if="allLoaded && tableData.length!==0">
        <span>-</span>
        <p>已经到底了</p>
        <span>-</span>
      </div>
      <div class="noData"
           v-if="tableData.length===0 && dataReady">
        <img :src="NOdata">
        <p>暂无数据</p>
      </div>
    </div>
  </div>
</template>
<script>
import context from '@/service'
import { Toast } from 'vant'
export default {
  name: 'group',
  footVisible: true,
  data () {
    return {
      NOdata: require('@/assets/nores.png'),
      allLoaded: false,
      scrolling: false,
      tableData: [],
      currentPage: 1,
      pgNum: 1,
      total: 0,
      pgSize: 15,
      onSend: false, // 默认发件
      MESSAGE: 0,
      NOTIFY: 0,
      dataReady: false,
      DetailsId: null

    }
  },
  props: {
    scrollVal: {
      type: Number,
      default: 0
    },
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
  },
  mounted () {

  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    // 筛选更新列表方法
    filterUpdate () {
      this.currentPage = 1
      this.query({})
    },
    query (param) {
      this.dataReady = false
      context.http.get('rms/api/lightingGroup', Object.assign({
        lightingPlanId: this.filter.lightingPlanKey || '',
        projectManagementId: this.filter.projectManagementId,
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'createdDate,desc'
      }, param)).then(res => {
        this.dataReady = true
        if (res.status === 200) {
          if (param) {
            this.tableData = res.data
          } else {
            this.tableData = this.tableData.concat(res.data)
          }
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
    loadBottom (id) {
      this.currentPage++
      this.query()
      this.$refs.loadmore.onBottomLoaded()
    },
    toDetails (id) {
      if (!this.hasAuthority('03080114')) {
        this.$toast({
          message: '你的账号没有查看群组详情的权限',
          position: 'top'
        })
        return
      }
      window.sessionStorage.setItem('scrollVal', this.scrollVal)
      this.$emit('RouteParamsC', 'detailsGroup', { id })
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
.group {
  &.noDataCls {
    height: calc(100% - #{$contentTop-height});
  }
  .paddingTop {
    padding-top: rem(108);
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
  .common_list {
    margin-top: 0;
    // ul {

    // }
    li {
      padding: rem(14) rem(14) rem(14) 0;
      padding-left: rem(14);
      background-color: #ffffff;
      padding-bottom: rem(10);
      position: relative;
      border-bottom: rem(1) solid #f0f0f0;
      > div {
        display: flex;
        flex-wrap: wrap;
        &:first-child {
          justify-content: space-between;
          margin-bottom: rem(8);
          font-size: rem(15);
          color: #444547;
          .shopNb {
            font-weight: bold;
            color: #18191a;
            font-size: rem(17);
          }
          .status_action {
            color: #3575f6;
            font-size: rem(15);
          }
          .status {
            color: #858c94;
            font-size: rem(15);
          }
          .shopType {
            &.weizu {
              color: #fc5159;
            }
            &.yizu {
              color: #1cc296;
            }
            &.ziyong {
              color: #444547;
            }
          }
        }
        &:nth-child(2) {
          color: #18191a;
          font-size: rem(15);
          margin-bottom: rem(8);
        }
        &:nth-child(3) {
          color: #858c94;
          font-size: rem(14);
        }
        .shopType {
          color: #858c94;
          font-size: rem(14);
        }
      }
      .postion {
        position: absolute;
        right: rem(14);
        top: 50%;
        margin-top: rem(-10);
        font-size: rem(14);
        color: #c6c6c6;
      }
      .USING {
        right: rem(32);
        top: 46%;
      }
      .bottom-div {
        display: flex;
        justify-content: space-between;
        span {
          color: #858c94;
          font-size: rem(14);
        }
      }
    }
    li:last-child {
      border-bottom: none;
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
<style lang="scss">
@import "../../../../../style/config";
.group {
  .loadAll {
    margin-top: rem(10) !important;
  }
}
</style>
