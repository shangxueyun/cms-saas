<template>
  <div class="app">
      <div class="imgMask"  @click.stop="close">
      </div>
      <div class="pictruecontent">
          <img class="prev"  @click.stop="prev" src="../assets/iconleft.png" v-if="imgList.length > 1">
          <div class="showImg" >
              <img class="closeIcon" @click="close" src="../assets/close-web.png">
              <img class="bigImg" :src="imgList[num1]">
          </div>
          <img class="next"  @click.stop="next" src="../assets/iconright.png" v-if="imgList.length > 1">
      </div>
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
    }
  },
  created () {
    this.num1 = this.num
  },
  methods: {
    close () {
      this.$emit('pictureClose', false)
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
      width:900px;
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
  .showImg{
      min-height:600px;
      min-width:600px;
      position: absolute;
      left:50%;
      top: 0;
      transform:translate(-50%,-50%);
      z-index: 110;
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
      /* top: -300px; */
      top: 0;
      /* right:140px; */
      right: 0;
      cursor: pointer;
      z-index: 120;
  }
  .pictruecontent{
      position: fixed;
      width: 900px;
      top: 50%;
      left: 50%;
      transform:translate(-50%,-50%);
      z-index: 110;
  }
</style>
