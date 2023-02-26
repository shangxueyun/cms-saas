<template>
    <div class="app" v-show="visible">
      <div class="imgMask">
      </div>
      <div class="pictruecontent">
          <!-- <img class="prev"  @click.stop="prev" src="../assets/iconleft.png" v-if="imgList.length > 1">
          <img class="closeIcon" @click="close" src="../assets/close-web.png"> -->
          <div class="showImg view_bigImg">
            <img class="bigImg view_bigImg" :src="imgUrl" v-show="visible">
          </div>
          <!-- <img class="next"  @click.stop="next" src="../assets/iconright.png" v-if="imgList.length > 1"> -->
      </div>
      <span class="close" @click.stop="close"><i class="iconfont iconcms_guanbi"></i></span>
    </div>
</template>
<script>
export default {
  data () {
    return {
      showBigImg: true,
      num1: ''
    }
  },
  props: {
    imgList: Array,
    num: {
      type: Number,
      default: 0
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    imgUrl () {
      if (this.imgList.length > 0) {
        let openUrl = this.imgList[0]
        return openUrl
      }
    }
  },
  watch: {
    visible (newvalue, oldvalue) {
      if (newvalue) {
        setTimeout(f => {
          $('div.view_bigImg').each(function () {
            return new RTP.PinchZoom($(this), {})
          })
        }, 200)
      }
    }
  },
  created () {
    this.num1 = this.num
  },
  methods: {
    close () {
      this.$emit('update:visible', false)
    },
    prev () {
      if (this.num1 === 0) {
        return
      }
      this.num1--
    },
    next () {
      if (this.num1 === (this.imgList.length - 1)) {
        return
      }
      this.num1++
    }
  }
}
</script>
<style scoped>
  html,body,#app
    {
        height: 100%;
        width:100%;
    }
    *{
        margin: 0;
        padding:0;
        box-sizing:border-box;
    }
    .app{
        position: fixed;
        top: 50%;
        z-index: 99999;
    }
    .imgList{
        margin: 0 auto;
        width: 900px;
        display: flex;
        flex-direction:row;
        flex-wrap:wrap;
    }
    .imgList img{
        width:300px;
    }
    .imgMask{
        position: fixed;
        height: 100%;
        width:100%;
        top:0;
        left:0;
        z-index: 100;
        background:rgba(0,0,0,.6);
        cursor: pointer; 
    }
    .app .close{
      position: fixed;
      top: -0.54rem;
      right: -.52rem;
      width: 1.5rem;
      height: 1.5rem;
      text-align: center;
      line-height: 1rem;
      border-radius: 1rem;
      background: rgba(255,255,255,0.6);
      transform: rotate(90deg);
      padding-left: .44rem;
      padding-top: .44rem;
      z-index: 111;
    }
    .app .close i{
      color: #000
    }
    .pictruecontent .img_close{
      position: absolute;
      height: .8rem;
      width: .8rem;
      top: .4rem;
      right: 42%;
      z-index: 100;
      background: rgba(255 255 255 / 80%);
      cursor: pointer;
      text-align: center;
      line-height: .8rem;
      font-size: .4rem;
      border-radius: 1rem;
      color: rgb(158 158 158);
    }
    .showImg{
        /* height: 50%;
        width: 50%;
        position: absolute;
        left:50%;
        top: 0;
        transform: translate(-50%,-50%);
        z-index: 110;
        display: contents; */
    }
    .bigImg{
        width:100%;
        height:100%;
    }
    .prev{
        position: absolute;
        top:50%;
        left: 0;
        width:60px;
        transform:translate(10px,-50%);
        cursor: pointer;
    }
    .next{
        width:60px;
        transform:translate(10px,-50%);
        position: absolute;
        top:50%;
        right:0;
        cursor: pointer;
    }
    .closeIcon{
        width:30px;
        transform:translate(10px,-50%);
        position: absolute;
        top: -300px;
        right:140px;
        cursor: pointer;
        z-index: 120;
    }
    .pictruecontent{
        position: fixed;
        width: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        z-index: 110;
    }
    .bounce-enter-active {
      animation: bounce-in .3s;
    }
    .bounce-leave-active {
      animation: bounce-in .3s reverse;
    }
    @keyframes bounce-in {
      0% {
        transform: scale(0);
      }
      100% {
        transform: scale(1);
      }
    }
</style>
