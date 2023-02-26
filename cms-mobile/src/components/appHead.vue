<template>
  <div id="app-head"
       class="app-head"
       :class="{bg:!mode}">
    <i v-if="backVisible"
       class="back mintui mintui-back"
       href="javascript:;"
       @click="onGoBack"></i>
    <slot name="leftBtn"></slot>
    <div class="title">{{title}}</div>
    <div class="right_btn">
      <slot name="rightBtn"></slot>
    </div>
  </div>
</template>
<script>
//  import service from '@/service'
export default {
  name: 'app-head',
  props: ['title', 'mode', 'onBack', 'isconfirm', 'backRoute', 'onBackCallBack'],
  data () {
    return {
      popupVisible: false,
      temp: null,
      mall: 11 // service.mall.malls[0]
    }
  },
  created () {
  },
  computed: {
    chooseValue () {
      if (this.mall && this.mall.name) {
        return this.mall.name.substr(0, 2)
      }
      return '--'
    },
    backVisible () {
      return true
      //        return !service.system.store.footVisible
    }
  },
  methods: {
    showPicker () {
      if (this.temp === null) {
        //          this.temp = service.mall.malls[0]
      }
      this.popupVisible = true
    },
    onChange (_, item) {
      this.temp = item[0]
    },
    onSelected () {
      this.popupVisible = false
      if (this.mall !== this.temp) {
        this.mall = this.temp
        //          service.mall.changeMall(this.mall)
        this.$emit('change')
      }
    },
    onBackFn () {
      this.$router.replace({ name: this.backRoute })
    },
    onGoBack () {
      if (this.isconfirm) { // 有确认弹窗页面
        this.$emit('confirmFn')
        return
      }
      if (this.onBack) {
        this.onBackFn()
      } else if (this.onBackCallBack) {
        this.onBackCallBack()
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import "../style/config";

#app-head {
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
  box-shadow: 0px 1px 4px 0px rgba(230, 230, 230, 0.5);
  &.bg {
    background-repeat: repeat-x;
    background-size: cover;
    color: $color-white;
  }
  .title {
    // margin: 0 rem(40);
    color: #18191a;
    flex: 1;
    font-size: rem(17);
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
  .choose {
    padding-right: $padding;
    float: right;
    font-size: rem(34);
    color: $color-white;
    i {
      position: relative;
      top: -2px;
      margin-left: rem(10);
    }
  }
  .popup {
    width: 100%;
  }
  .toolbar {
    padding: 0 $padding;
    line-height: rem(40);
    text-align: right;
    border-bottom: $style-border;
    font-size: rem(28);
  }
  .right_btn {
    display: block;
    color: #0139a4;
    width: rem(40);
    font-size: rem(15);
    text-align: left;
  }
}
</style>
