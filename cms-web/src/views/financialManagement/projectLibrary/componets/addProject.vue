<template>
    <div id="addProject">
      <span style="font-size:18px">项目库</span>
      <div class="navigation" v-if="pageType">
        <span @click="toChildPath('projectInfo',$event)" class="active">档案信息</span>
        <span @click="toChildPath('enterBrand',$event)">入驻品牌</span>
        <span @click="toChildPath('projectNews',$event)">资讯浏览</span>
      </div>
      <div class="content">
        <el-col :span="24"  class="content-wrapper">
          <transition name="fade"  mode="out-in">
            <router-view></router-view>
          </transition>
        </el-col>
      </div>
    </div>
</template>

<script>
    import context from '@/service'
    export default {
      name: 'addProject',
      components: {
      },
      data () {
        return {
          id: '',
          test: 'addBrand',
          pageType: true
        }
      },
      created () {
        this.pageType = this.$route.params.pageType !== 'add'
        this.$router.push({name: 'projectInfo', params: this.$route.params})
      },
      mounted () {

      },
      methods: {
        toChildPath (name, e) {
          let selt = e.currentTarget
          $(selt).addClass('active').siblings('span').removeClass('active')
          this.$router.push({name: name, params: this.$route.params})
        }
      }
    }
</script>

<style lang="scss" scoped>
    .navigation{
      height:42px;
      background-color: #ffffff;
      border: 1px solid #eee;
      margin-top: 15px;
    span{
      display: inline-block;
      width: 100px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      cursor: pointer;
      &.active{
              border-bottom: 2px solid #4d67fb;
      }
    }
  }
</style>
