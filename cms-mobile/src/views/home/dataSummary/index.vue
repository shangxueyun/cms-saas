<template>
  <div class="dataSummary">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="onGoBack"></i>
      <div class="headTab">
        <span :class="{ active: index === 1 && Table1 }"
              v-if="hasAuthority('09010101') || hasAuthority('09010102') || hasAuthority('09010103')"
              @click="toRouter(1)">企业对比</span>
        <span :class="{ active: index === 2 && Table2 }"
              v-if="hasAuthority('090102')"
              @click="toRouter(2)">企业数据</span>
        <span :class="{ active: index === 3 && Table3 }"
              v-if="hasAuthority('090103')"
              @click="toRouter(3)">项目数据</span>
      </div>
      <div class="addBtn">
        <i v-if="index === 2 && hasAuthority('090102') || index === 3 && hasAuthority('090103')"
           @click="showActionSheet"
           :class="{ selected: selected }"
           class="iconfont iconcms_shaixuan"></i>
      </div>
    </div>
    <div :class="index > 1 ? 'showActionSheet' : 'content'">
      <router-view ref="ProjectData"
                   @selectIcon="changeSelectIcon"></router-view>
    </div>
  </div>
</template>
<script>
import context from '@/service'
import myMixin from './mixin'
export default {
  name: 'dataSummary',
  mixins: [myMixin],
  data () {
    return {
      index: 1,
      selected: false,
      Table1: true,
      Table2: true,
      Table3: true
    }
  },
  watch: {
    '$route.path': function (val, oldVal) {
      if (val === '/dataSummary/ProjectComparison') {
        this.index = 1
      } else if (val === '/dataSummary/ComparisonData') {
        this.index = 2
      } else {
        this.index = 3
      }
    }
  },
  created () {
    // this.getUserSubscribe().then(res => {
    //   let hasChartsAT = this.isOnSubscribe(13) || this.isOnSubscribe(12) || this.isOnSubscribe(13)
    //   if (hasChartsAT) {
    //     this.hasChartsAT = true
    //   } else {
    //     this.hasChartsAT = false
    //   }
    //   let hasChartsATData = this.isOnSubscribe(2) || this.isOnSubscribe(11) || this.isOnSubscribe(14) || this.isOnSubscribe(15)
    //   if (hasChartsATData) {
    //     this.hasChartsATData = true
    //   } else {
    //     this.hasChartsATData = false
    //   }
    //   if (this.hasAuthority('09010401') && hasChartsAT) {
    //     this.index = 0
    //     this.$router.replace({ name: 'ProjectComparison' })
    //   } else if (this.hasAuthority('09010101') && hasChartsATData) {
    //     this.index = 1
    //     this.$router.replace({ name: 'ProjectData' })
    //   }
    // })
    if (this.hasAuthority('09010101') || this.hasAuthority('09010102') || this.hasAuthority('09010103')) {
      this.$router.replace({ name: 'ProjectComparison' })
    } else if (this.hasAuthority('090102')) {
      this.index = 2
      this.$router.replace({ name: 'ComparisonData' })
    } else if (this.hasAuthority('090103')) {
      this.index = 3
      this.$router.replace({ name: 'ProjectData' })
    }
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    onGoBack () {
      this.$router.replace({ name: 'index' })
    },
    toRouter (num) {
      if (num === 1) {
        this.index = 1
        this.$router.push({ name: 'ProjectComparison' })
      } else if (num === 2) {
        this.index = 2
        this.$router.push({ name: 'ComparisonData' })
      } else if (num === 3) {
        this.index = 3
        this.$router.push({ name: 'ProjectData' })
      }
    },
    showActionSheet () {
      if (this.index === 2) {
        this.selected = !this.selected
        this.$refs.ProjectData.toggleActionSheet()
      } else if (this.index === 3) {
        this.selected = !this.selected
        this.$refs.ProjectData.toggleActionSheet()
      }
    },
    changeSelectIcon () {
      this.selected = false
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
.dataSummary {
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
      color: #444547;
      font-size: rem(16);
      width: rem(280);
      display: flex;
      justify-content: space-evenly;
      > span {
        position: relative;
        &.active {
          color: #0139a4;
          border-bottom: rem(3) solid #0139a4;
          font-weight: bold;
        }
        &:nth-child(2) {
          margin-left: rem(10);
        }
        &:nth-child(3) {
          margin-left: rem(10);
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
      .selected {
        color: #0139a4;
      }
      i {
        font-size: rem(18);
      }
    }
  }
  .content {
    margin-top: rem(40);
  }
  .showActionSheet{
    margin-top: rem(60);
  }
}
</style>
