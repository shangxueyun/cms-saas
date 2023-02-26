<template>
  <div id="loading-wrapper" v-if="visible">
    
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
  #loading-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    /*background-color: rgba(0,0,0,.2);*/
    background-color: rgba(0,0,0,0);
    z-index: 99999;
  }
  #loading {
    padding: 20px;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.7);
  }
</style>
