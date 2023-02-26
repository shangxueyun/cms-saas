<template>
  <div id="app-foot" v-if="visible">
    <a href="javascript:;" :class="{on:selected===0}" @click="onSelected(0)">首页</a>
    <a href="javascript:;" :class="{on:selected===1}" @click="onSelected(1)">通讯录</a>
    <a href="javascript:;" :class="{on:selected===2}" @click="onSelected(2)">个人中心</a>
  </div>
</template>
<script>
  const NAMES = ['index', 'contact', 'mine']
  import service from '@/service'
  import * as bus from '../service/eventHub.js'
  export default {
    name: 'app-foot',
    data () {
      return {
        workTips: 0
      }
    },
    computed: {
      visible () {
        return service.system.store.footVisible
      },
      selected () {
        return NAMES.indexOf(this.$route.name)
      }
    },
    methods: {
      hasAuthority (code) {
        return service.user.hasAuthority(code)
      },
      onSelected (target) {
        if (this.selected === target) {
          return
        }
        this.$router.push({name: NAMES[target]})
        // this.$router.push({name: 'index'})
      },
      async init () {
        bus.eventHub.$on('workTips', count => {
          this.workTips = count
        })
      }
    },
    mounted () {
      this.init()
      if (this.hasAuthority('50_00_00')) {
        this.onSelected(0)
      } else if (this.hasAuthority('51_00_00')) {
        this.onSelected(1)
      } else if (this.hasAuthority('52_00_00')) {
        this.onSelected(2)
      } else if (this.hasAuthority('53_00_00')) {
        this.onSelected(3)
      } else {
        this.onSelected(4)
      }
    },
    watch: {
      async visible (val) {
        if (val) {
          // this.workTips = await service.activity.loadActivityCount()
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  @import '../style/config';

  #app-foot {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: $foot-height;
    display: flex;
    align-items: center;
    text-align: center;
    color: $text-second-color;
    background-color: $color-white;
    font-size: rem(12);
    box-shadow: 0 -1px 5px $color-shadow-1;
    a {
      flex: 1;
      padding-top: rem(27);
      background-position: top;
      background-repeat: no-repeat;
      background-size: rem(26) rem(25);
      &.on {
        color: $color-blue;
      }
      &:nth-child(1) {
        background-image: url("../assets/home.png");
        &.on {
          background-image: url("../assets/home1.png");
        }
      }
      &:nth-child(2) {
        background-image: url("../assets/txl.png");
        &.on {
          background-image: url("../assets/txl1.png");
        }
      }
      &:nth-child(3) {
        background-image: url("../assets/gerenzhongxin.png");
        &.on {
          background-image: url("../assets/gerenzhongxin1.png");
        }
      }
    }
  }
  i {
    display: block;
    background: #ff7674;
    border-radius: 50%;
    width: rem(16);
    height: rem(16);
    top: rem(-55);
    right: rem(-15);
    position: absolute;
  }
</style>
