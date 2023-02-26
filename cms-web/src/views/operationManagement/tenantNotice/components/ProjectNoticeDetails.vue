<template>
  <div class="ProjectNoticeDetails">
    <drawer class="drawer_new"
            :show="showDrawer"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="details_content drawer-body"
           slot="drawer">
        <div class="main_content">
          <h4 class="title">{{detailsData.title}}</h4>
          <div class="content"
               v-html="detailsData.content">

          </div>
        </div>
      </div>
      <!-- <div slot="footer"
           class="dialog-footer">
        <span @click="onHide"
              class="details_cannelBtn"
              style="background:none">取消</span>
        <span class="saveSubmit"
              @click="addBrand()">保存</span>
      </div> -->
    </drawer>
  </div>
</template>

<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import aliUpload from '@/components/aliUpload.vue'
import axios from 'axios'
import * as JSOG from 'jsog'
export default {
  name: 'ProjectNoticeDetails',
  components: {
    Drawer,
    aliUpload
  },
  props: {
    showDrawer: {
      type: Boolean,
      default: false
    },
    detailsData: {
      type: Object,
      default: {}
    }
  },
  created () {
    this.options = this.$store.state.projectManagementsList
  },
  watch: {
    showDrawer: {
      handler (newValue, oldValue) {
        if (newValue) {

        }
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {

      options: [],
      drawerTitle: '查看公告'
    }
  },
  mounted () {

  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    onHide () {
      // this.$refs['detaileData'].resetFields()
      this.$emit('drawerClose')
    }
  }
}
</script>
<style lang="scss" >
.ProjectNoticeDetails {
  .el-table::before {
    height: 0;
  }
}
</style>
<style lang="scss" scoped>
.ProjectNoticeDetails {
  .main_content {
    height: 100%;
    padding: 0;
    background-color: #fff;
    .title {
      text-align: center;
      font-size: 16px;
      color: #333333;
    }
    .content {
    }
  }
}
</style>
<style lang="scss">
.ProjectNoticeDetails {
  .dialog-footer {
    > span {
      display: inline-block;
      color: #777777;
      height: 34px;
      line-height: 34px;
      text-align: center;
      padding: 0 21px;
      cursor: pointer;
      background: rgba(243, 244, 250, 1);
      border-radius: 4px;
      margin-left: 10px;
      &.closeBtn {
      }
      &.saveBtn {
        border: 1px solid rgba(53, 117, 246, 1);
        color: #3575f6;
      }
      &.saveSubmit,
      &.passBtn {
        background: rgba(53, 117, 246, 1);
        color: #fff;
      }
      &.rejectBtn {
        color: #e0434e;
        background: rgba(253, 235, 237, 1);
        border: 1px solid #c1bdbd;
      }
    }
  }
  .details_content {
    width: 750px;
    // height: calc(100% - 80px) !important;
    height: 100%;
  }
}
</style>
