<template>
  <div id="app"
       :class="{ios:isIOS}"
       @scroll="handleScroll"
       ref="content">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"
                   :scrollTop="scrollTop"
                   @changeScroll="changeScroll"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"
                 :scrollTop="scrollTop"
                 @changeScroll="changeScroll"></router-view>
    <loading></loading>
    <app-foot></app-foot>
  </div>
</template>

<script>
import context from '@/service'
import Loading from '@/components/Loading'
import AppFoot from '@/components/AppFoot'
export default {
  name: 'app',
  components: {
    Loading,
    AppFoot
  },
  computed: {
    isIOS () {
      // if (window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) document.body.className = 'iosBox'
      return window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    }
  },
  data () {
    return {
      scrollTop: 0
    }
  },
  created () {
    // 7天过期跳转登录页
    let value = context.storage.getItem('user')
    if (value && this.$route.path !== '/login') {
      this.$router.push(this.$route.path)
    } else if (value) {
      this.$router.push('/index')
    } else {
      // this.$router.push('/login')
      window.location.href = '/ids/#/ids/login'
    }
  },
  mounted () {
    // 检测断网
    window.addEventListener('offline', () => {
      console.log('已断网')
      const network = false
      localStorage.setItem('network', network)
      this.$router.push('/networkError')
    })
    window.addEventListener('online', () => {
      console.log('网络已连接')
      const network = true
      localStorage.setItem('network', network)
    })
    // setTimeout(() => {
    //   document.getElementById('splash').style = 'display:none'
    // }, 1500)
    this.$refs.content.scrollTop = 0
  },
  methods: {
    handleScroll (el) {
      this.scrollTop = this.$refs.content.scrollTop
    },
    changeScroll (scrollTop) {
      this.$refs.content.scrollTop = scrollTop
    }
  }
}
</script>
<style scoped lang="scss">
@import "style/config.scss";

#app {
  min-height: 100%;
  background-color: #f8f9fa;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
