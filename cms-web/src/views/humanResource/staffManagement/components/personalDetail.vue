<template>
  <div class="personalDetail">
    <div class="goBack" @click="goBack">
      <i class="iconfont icon-fanhui"></i>返回
    </div>
    <personal :detailsInfo="detailsInfo" @queryStaffInfo="queryStaffInfo"></personal>
  </div>
</template>
<script>
import context from '@/service'
import personal from './personal'
export default {
  name: 'personalDetail',
  components: {
    personal
  },
  data () {
    return {
      detailsInfo: {
        facialPhoto: '',
        organizeDTO: {
          name: '',
          userPost: '',
          parent: { name: '' }
        },
        userPostManagements: [{
          organizeId: [],
          userPostId: '',
          onMaster: true
        }],
        userDynamics: [{
          user: { workPlace: { name: '' } }
        }]
      }
    }
  },
  created () {
    let userId = this.$route.query.userId
    if (userId) {
      this.queryStaffInfo()
    }
  },
  methods: {
    queryStaffInfo () {
      let userId = this.$route.query.userId
      context.http.get(`uaa/api/users/${userId}`).then(result => {
        if (result.status === 200) {
          this.detailsInfo = result.data
        }
      })
    },
    goBack () {
      this.$router.replace({ name: 'staffManage' })
    }
  }
}
</script>
<style lang="scss">
.personalDetail {
  .goBack {
    cursor: pointer;
    height: 30px;
    line-height: 30px;
    // width: 20px;
    align-self: center;
    margin-bottom: 6px;
    color: #333;
  }
  > .iconfont {
    color: #777;
    display: inline-block;
    width: 30px;
    height: 20px;
  }
  .mainlayout {
    width: 100%;
  }
}
</style>

