<template>
  <div id="app">
    <!-- <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view> -->
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    components: {
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
