import context from '@/service'
const myMixin = {
  data: function () {
    return {
      chartsList: []
    }
  },
  created () {
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    async getUserSubscribe () {
      const result = await context.http.get('cms/api/userSubscribe')
      this.chartsList = result.data
    },
    // 模块是否订阅
    isOnSubscribe (id) {
      for (var i = 0; i < this.chartsList.length; i++) {
        if (Number(this.chartsList[i].subscribeId) === Number(id)) {
          return this.chartsList[i].onSubscribe
        }
      }
    }
  }
}
export default myMixin
