<template>
  <div class="personal-info">
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            @on-hide="onHide">
      <personal :detailsInfo="detailsInfo" slot="drawer" @updateData="updateData" @resetData="resetData" ref="mychild"></personal>
    </drawer>
  </div>

</template>
<script>
import personal from './personal'
import context from '@/service'
import Drawer from '@/components/drawer.vue'
export default {
  components: {
    Drawer,
    personal
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    detailsInfo: {
      type: Object
    }
  },
  data () {
    return {
      drawerTitle: '员工详情信息'
    }
  },
  watch: {
    detailsdrawershow: {
      handler: function () {
      }
    },
    detailsInfo: {
      handler: function () {
      }
    }
  },
  methods: {
    updateData () {
      this.$emit('refreshPostChart') // 编辑成功刷新岗位图
      this.$emit('refreshStaff')
      this.$emit('handleEdit', this.detailsInfo.id)
    },
    resetData () {
      this.$emit('handleEdit', this.detailsInfo.id)
    },
    onHide () {
      this.$emit('drawerClose', false)
      this.$refs.mychild.onHide()
    }
  }
}
</script>
<style lang="scss">
.personal-info{
  .wrap{
    height:100%;
    min-height:0;
    .drawer-head{
      margin:0;
      padding:20px;
    }
  }
  .mainlayout{
    width: 1090px;
    .el-tab-pane{

    }
  }
}
</style>

