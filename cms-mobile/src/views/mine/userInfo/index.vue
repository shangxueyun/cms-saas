<template>
  <div class="userInfo">
    <app-header :title="title"
                :mode="false"></app-header>
    <div class="common_list common_list_color">
      <mt-cell title="头像"
               is-link>
        <img v-if="userInfo.facialPhoto"
             :src='userInfo.facialPhoto+"?x-oss-process=image/resize,w_"+40+",h_"+40+",m_fixed"'
             class="headPortrait" />
        <p v-else
           class="default-hportrait">{{formatName(userInfo.name)}}</p>
        <input class="imgInput"
               type="file"
               @change="imageChange($event)"
               accept="image/png, image/jpeg, image/jpg" />
      </mt-cell>
      <mt-cell title="姓名">
        <span>{{userInfo.name}}</span>
      </mt-cell>
      <mt-cell title="英文名"
               @click.native="toSetName"
               is-link>
        <span :style="{color: (userInfo.englishName ? '' : '#D9D9D9')}">{{userInfo.englishName ? userInfo.englishName : '请填写'}}</span>
      </mt-cell>
      <mt-cell title="岗位">
        <span v-if="userInfo.userPostManagements && userInfo.userPostManagements.length" style="margin-left:6upx;">{{userPostNameFormat(userInfo.userPostManagements)}}</span>
      </mt-cell>
      <mt-cell title="组织">
        <span style="margin-left:6upx;">
          <span v-if="userInfo.userPostManagements && userInfo.userPostManagements.length">{{userInfo.userPostManagements[0].organize.name}}</span>
        </span>
      </mt-cell>
      <mt-cell title="手机号"
               @click.native="toSetPhone"
               is-link>
        <span :style="{color: (userInfo.telephone ? '' : '#D9D9D9')}">{{userInfo.telephone ? userInfo.telephone : '请填写'}}</span>
      </mt-cell>
      <mt-cell title="企业邮箱">
        <span>{{userInfo.email}}</span>
      </mt-cell>
      <mt-cell title="直属领导">
        <span>{{userInfo.leadershipName}}</span>
      </mt-cell>
      <mt-cell title="工作地点">
        <span>{{userInfo.workPlaceValue}}</span>
      </mt-cell>
    </div>
  </div>
</template>

<script>
import context from '@/service'
import AppHeader from '@/components/appHead'
export default {
  name: 'userInfo',
  data () {
    return {
      title: '个人信息',
      userInfo: JSON.parse(JSON.parse(localStorage.getItem('user')).value)
    }
  },
  components: { AppHeader },
  methods: {
    userPostNameFormat (list) {
      const arr = list.map(item => {
        return item.userPostName
      })
      return arr.join('兼')
    },
    imageChange (event) {
      let files = event.target.files
      if (files.length > 0) {
        if (files[0].type !== 'image/png' && files[0].type !== 'image/jpeg' && files[0].type !== 'image/jpg') {
          this.$toast({
            message: '上传图片格式不正确',
            position: 'top'
          })

          return
        }
        let form = new FormData()
        form.append('file', files[0])
        context.http.post('ywm/api/image-multipart', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          this.userInfo.facialPhoto = res.data
          this.saveUserInfo()
        }).catch(error => {
          console.log(error)
          this.$toast({
            message: '上传头像失败',
            position: 'top'
          })
        })
      }
    },
    async saveUserInfo () {
      const { userInfo } = this
      await context.user.setCurrentAccount(userInfo)
    },
    formatName (name) {
      if (name) {
        return name.length > 2 ? name.substring(name.length - 2) : name
      }
    },
    toSetName () {
      this.$router.push({ name: 'setName' })
    },
    toSetPhone () {
      this.$router.push({ name: 'setPhone' })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
.userInfo {
  width: 100%;
  min-height: 100%;
  padding-top: rem(50);
  .common_list {
    background-color: #ffffff;
    .headPortrait {
      display: block;
      width: rem(34);
      height: rem(34);
      border-radius: rem(34);
    }
    .imgInput {
      width: 100%;
      height: 100%;
      opacity: 0;
      position: absolute;
      left: 0;
      top: 0;
    }
    .default-hportrait {
      width: rem(34);
      height: rem(34);
      border-radius: rem(34);
      background-color: #409eff;
      line-height: rem(34);
      text-align: center;
      color: #fff;
      font-size: rem(15);
    }
  }
}
</style>
