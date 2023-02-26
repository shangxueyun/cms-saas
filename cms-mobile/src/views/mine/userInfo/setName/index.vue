<template>
  <div class="setName">
    <app-header :title="title"
                :mode="false">
      <div @click="conform"
           slot="rightBtn">保存</div>
    </app-header>
    <div class="common_list">
      <mt-field placeholder="请输入内容"
                v-model="userInfo.englishName"></mt-field>
    </div>
  </div>
</template>

<script>
import AppHeader from '@/components/appHead'
import context from '@/service'
export default {
  name: 'setName',
  components: { AppHeader },
  data () {
    return {
      title: '英文名'
    }
  },
  computed: {
    userInfo: () => JSON.parse(JSON.parse(localStorage.getItem('user')).value)
  },
  methods: {
    conform () {
      let { englishName } = this.userInfo
      if (englishName.length > 30) {
        this.$toast({
          message: '英文名长度不能大于30个字符',
          position: 'top'
        })
        return
      }
      this.saveUserInfo()
    },
    async saveUserInfo () {
      const { userInfo } = this
      await context.user.setCurrentAccount(userInfo)
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/config";
.setName {
  padding-top: rem(50);
}
</style>
