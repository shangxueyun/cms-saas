<template>
  <div class="page">
    <img src="../assets/404.png">
    <div class="error_info">网络无法连接，请检查网络设置</div>
    <div class="btn"><a style="text-decoration:none;" href="javascript:;" @click="onRefresh()">点击刷新</a></div>
</div>
</template>
<script>
export default {
  name: 'NoNetwork',
  methods: {
    onRefresh () {
      const network = JSON.parse(localStorage.getItem('network'))
      if (network) this.$router.back()
    }
  }
}
</script>
<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  border: 0;
}

.page {
  padding-top: 150px;
  text-align: center;
  font-size: 18px;
  color: #8899a6;
  padding-bottom: 40px;
}

img {
  width: 65%;
  height: auto;
  display: block;
  margin: 0 auto;
}

.error_info {
  text-align: center;
  font-size: 16px;
  color: #444547;
  margin-top: 30px;
}

a {
  display: block;
  width: 90px;
  line-height: 30px;
  border: 1px solid #0139A4;
  background-color: #fff;
  color: #0139A4;
  text-align: center;
  font-size: 14px;
  border-radius: 3px;
  margin: 50px auto 0;
}

.btn {
  
}
</style>
