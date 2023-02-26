<template>
  <div id="app">
    <!-- <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view> -->
    <router-view></router-view>
    <loading></loading>
  </div>
</template>

<script>
  import Loading from '@/components/Loading'
  export default {
    name: 'app',
    components: {
      Loading
    },
    computed: {
    }
  }
</script>
<style scoped lang="scss">
  @import "./style/config.scss";

  #app {
    height: 100%;
  }

</style>
