<template>
  <div class="organizationManage">
    <span class="page_head_title">组织架构</span>
    <div class="tab_block_wrap">
      <ul class="default_tab_block">
        <li @click="changeNav(index)"
            v-for="(item, index) in navList"
            :key="index"
            :class="item.value ? 'active' : ''"><span>{{item.label}}</span></li>
      </ul>
      <div class="btn-warp"
           v-if="selectComp === 'organizationChart'">
        <span @click="domtoimageDownload">
          <i class="iconfont icon-cms_xiazai-"></i>
        </span>
      </div>
    </div>
    <component :is="selectComp"
               ref="organizationChart"></component>
  </div>
</template>
<script>
import context from '@/service'
import organizationalList from './components/organizationalList'
import organizationChart from './components/organizationChart'
export default {
  name: 'organizationManage',
  components: {
    organizationChart,
    organizationalList
  },
  data () {
    return {
      navList: [{ label: '组织架构图', value: true }, { label: '组织列表', value: false }],
      selectComp: 'organizationChart'
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    changeNav (inx) {
      this.navList.forEach(item => {
        item.value = false
      })
      if (inx === 0) {
        this.navList[inx].value = true
        this.selectComp = 'organizationChart'
      } else if (inx === 1) {
        this.navList[inx].value = true
        this.selectComp = 'organizationalList'
      }
    },
    domtoimageDownload () {
      this.$refs.organizationChart.domtoimageDownload()
    }
  }
}
</script>
<style lang="scss">
@import "../../../style/config";
.organizationManage {
  font-size: 16px;
  background-color: #f9f9f9;
  .step_tab {
    height: 60px;
    display: flex;
    background-color: #fff;
    margin: 10px 0 0px 0;
    box-shadow: 1px 2px 5px #eee;
    border-radius: 3px;
    justify-content: space-between;
    align-items: center;
    padding-right: 20px;
    border-bottom: 1px solid #ecedef;
    .nav {
      display: flex;
      li {
        width: 160px;
        text-align: center;
        font-size: 14px;
        color: #666;
        height: 58px;
        line-height: 58px;
        border-bottom: 2px solid #fff;
        cursor: pointer;
        &.select_active {
          border-bottom: 2px solid #3175fb;
          color: #3175fb;
          font-weight: bolder;
        }
      }
      .icon-right {
        -webkit-transform: rotate(180deg);
        -moz-transform: rotate(180deg);
        -o-transform: rotate(180deg);
        -ms-transform: rotate(180deg);
        transform: rotate(180deg);
        line-height: 58px;
        width: 50px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
  .btn-warp {
    span {
      cursor: pointer;
    }
  }
}
</style>
