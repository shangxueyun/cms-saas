<template>
  <div id="filePreview">
    <div>
      <i class="iconfont iconcms_guanbi" @click="goback"></i>
    </div>
    <div class="content">
      <iframe :src="iframeSrc" width="100%" height="100%" frameborder=0></iframe>
    </div>
  </div>
</template>
<script>
let roterFrom = null
import AppHeader from '@/components/appHead'
export default {
  name: 'policyAgreement',
  components: {AppHeader},
  data () {
    return {
      iframeSrc: '',
      title: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    console.log(from.name)
    roterFrom = from.name
    next()
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  created () {
    let srcType = this.$route.query.srcType
    let hostname = window.location.hostname
    if (srcType === 'UserAgreement') {
      if (hostname === 'cmsmobile.ecams.pro') {
        this.iframeSrc = 'https://www.ecams.pro/h5/src/UserAgreement.html'
      } else {
        this.iframeSrc = 'https://cms-dev.yunwutech.com/h5/src/UserAgreement.html'
      }
    } else {
      if (hostname === 'cmsmobile.ecams.pro') {
        this.iframeSrc = 'https://www.ecams.pro/h5/src/PrivacyPolicy.html'
      } else {
        this.iframeSrc = 'https://cms-dev.yunwutech.com/h5/src/PrivacyPolicy.html'
      }
    }
  },
  methods: {
    goback () {
      this.$router.replace(`/${roterFrom}`)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../style/config";
  #filePreview{
    width: 100%;
    height: 100%;
    .content{
      width: 100%;
      height: 94%;
      /* margin-top: rem(40); */
    }
    i {
      display: inline-block;
      margin: rem(20) rem(20) 0 rem(20);
    }
  }
</style>
