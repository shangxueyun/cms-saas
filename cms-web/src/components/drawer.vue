<template>
  <!-- container -->
  <div class="vue-drawer"
       :class="show ? 'active-drawer' : ''">
    <!-- <div :style="{'transform': 'translate3d('+translateX+'px,0,0)'}"
      class="main">
      <slot></slot>
    </div> -->
    <!-- mask -->
    <div class="mask"
         :class="show ? 'active' : ''"
         ></div>
    <div ref="drawer"
         class="drawer"
         :class="[pos!='left' ? 'drawer-right' : 'drawer-left', show ? 'active' : '']"
         @scroll="woListScroll($event)">
      <!-- drawer -->
      <div class="wrap">
        <div class="drawer-head clearfix">
          <slot name="head">
            <i class="el-dialog__close el-icon el-icon-close"
               @click="hideMask"></i>
            <div class="drawer-title">
              {{title}}
            </div>
            <div class="dweditbtn"
                 v-if="showEditBtn"
                 @click="edit"><i aria-hidden="true"
                 class="iconfont icon-edit2 icon-edit1"></i>编辑</div>
          </slot>
        </div>
        <slot name="drawer"></slot>
      </div>
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script scoped>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    pos: {
      type: String,
      default: 'right'
    },
    tran: {
      type: String,
      default: 'overlay'
    },
    title: {
      type: String
    },
    showEditBtn: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      drawerWidth: 0,
      translateX: 0
    }
  },
  watch: {
    show: function () {
      // listener
      if (!this.show) { this.$emit('on-hide') } else { this.$emit('on-show') }
      // transition
      if (this.tran === 'overlay') return
      if (!this.show) { this.translateX = 0 } else { this.translateX = this.pos === 'left' ? this.drawerWidth : -this.drawerWidth }
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.drawerWidth = this.$refs.drawer.clientWidth
    })
  },
  methods: {
    woListScroll (e) {
      this.$emit('scroll', e)
    },
    hideMask () {
      // this.show = false;
      this.$emit('on-hide', false)
    },
    edit () {
      this.$emit('on-edit', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.active-drawer {
  width: 100%;
}
.vue-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 0;
  height: 100%;
  overflow: auto;
  z-index: 1999;
  transition: opacity ease-in-out 0.38s, visibility ease-in-out 0.38s;
}
.vue-drawer > .main {
  /*max-width: 600px;*/
  height: 100%;
  padding-bottom: 150px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: transform ease-in-out 0.38s, visibility 0.38s;
}
.vue-drawer .mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  visibility: hidden;
  opacity: 0;
  transition: opacity ease-in-out 0.38s, visibility ease-in-out 0.38s;
  background-color: rgba(0, 0, 0, 0.5);
}
.vue-drawer > .active {
  visibility: visible;
  opacity: 1;
}
.vue-drawer > .drawer {
  background-color: #fff;
  position: fixed;
  top: 0;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  pointer-events: none;
  visibility: hidden;
  transition: transform ease-in-out 0.38s, visibility 0.38s;
  will-change: none;
  -webkit-box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
}
.vue-drawer > .drawer-left {
  left: 0;
  transform: translateX(-102%);
}
.vue-drawer > .drawer-right {
  right: 0;
  transform: translateX(102%);
}
.vue-drawer > .active {
  pointer-events: inherit;
  visibility: visible;
  transform: translateX(0%);
}
.wrap {
  min-height: calc(100% - 20px);
}
.drawer-head {
  margin: 20px 30px 0 30px;
  padding-bottom: 15px;
  text-align: center;
  position: relative;
  .el-dialog__close {
    color: #b9b9b9;
    font-size: 16px;
    cursor: pointer;
    float: left;
    margin-top: 5px;
    &:hover {
      color: #3575f6;
      background-color: #f3fbfe;
    }
  }
  .drawer-title {
    font-size: 16px;
    font-weight: bolder;
    color: #262626;
  }
  .dweditbtn {
    font-size: 12px;
    border-radius: 4px;
    cursor: pointer;
    position: absolute;
    right: 2px;
    top: 8px;
    color: #3575F6;
    display: flex;
    .icon-edit2 {
      width: 15px;
      height: 20px;
      margin-right: 4px;
      // background: url(../assets/edit.png) no-repeat;
      // background-size: contain;
      vertical-align: text-top;
      color: #3575F6;
    }
  }
}
.details-content {
  padding-bottom: 100px;
}
.dialog-footer {
  /* footer高度的负值 */
  margin-top: -80px;
  clear: both;
  margin-right: 20px;
  text-align: right;
  height: 40px;
  position: relative;
}
.mainlayout {
  padding-bottom: 100px;
}
</style>
