<template>
  <!-- v-if="visible" -->
  <div id="loading-wrapper"
       v-if="visible">
    <div id="loading">
      <img src="../assets/loading.gif"
           alt="">
      <p>正在加载</p>
    </div>
  </div>
</template>
<script>
import service from '@/service'
export default {
  name: 'loading',
  computed: {
    visible () {
      return service.system.store.loading
    }
  }
}
</script>
<style scoped lang='scss'>
@import "../style/config";
#loading-wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  /*background-color: rgba(0,0,0,.2);*/
  background-color: rgba(0, 0, 0, 0);
  z-index: 99999;
}
#loading {
  color: #858c94;
  font-size: rem(13);
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  margin: auto;
  bottom: 0;
  width: rem(100);
  height: rem(50);
  > img {
    width: rem(21);
    height: rem(21);
  }
}
</style>
