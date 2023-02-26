<template>
    <div class="actionsheet_wrapper" v-show="open" @click="cancelFunc">
      <transition :name="tsType">
        <div class="actionsheet" 
          v-show="open" 
          :class="[tsType === 'slideOutUp' ? 'slideOutUp' : 'fade']">
          <slot name="content"></slot>
        </div>
      </transition>
    </div>
</template>
<script>
export default {
  name: 'actionsheet',
  data () {
    return {
    }
  },
  props: {
    open: false, // 接收从父组件传过来的控制是否显示的属性
    tsType: {
      type: String,
      default: 'fade'
    }
  },
  methods: {
    cancelFunc () {
      this.$emit('update:open', false)
    }
  }

}
</script>
<style lang="scss">
@import "../style/config";

* {

box-sizing: border-box;

}

.actionsheet_wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%!important;
  background-color: rgba(0, 0, 0, 0.4);
  height: 100%;
  z-index: 99;
}

.actionsheet {
  background-color: #fff;
  min-height: rem(225);
  z-index: 2;
}
.fade {
  top: 0;
  border-bottom-left-radius: rem(10);
  border-bottom-right-radius: rem(10);
}
.slideOutUp{
  bottom: 0;
  bottom: 0;
  position: absolute;
  width: 100%;
  border-top-left-radius: rem(10);
  border-top-right-radius: rem(10);
}

//过渡效果transition使用

// 定义transition的name属性值为fade,定义从底部向上淡入的滑入和滑出,使用translate3d,在移动端会开启硬件加速器,效果很流畅,接近原生效果

.fade-enter-active,
.fade-leave-active {
  transition: all .4s ease;
  // height: rem(225);
}

.fade-enter,
.fade-leave-to {
  // transform: translate3d(0, -100%, 0);
  // height: 0;
  opacity: 0;
}

.slideOutUp-enter-active,
.slideOutUp-leave-active {
  transition: all .4s ease;
}

.slideOutUp-enter,
.slideOutUp-leave-to {
  transform: translate3d(0, 100%, 0);
  opacity: 0;
}
</style>
