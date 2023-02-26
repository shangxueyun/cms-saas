<template>
  <div class="SetPermission">
    <drawer class="drawer_new"
            :show="detailsdrawershow"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="details_content drawer-body"
           slot="drawer">
        <div class="main_content"
             style="height:100%;padding:0">
          <div class="title">{{detailsData.jobTitle}}</div>
          <div class="content">
            <!-- <el-checkbox-group v-model="checkedItems"
                               @change="checkboxChnage"> -->
            <el-checkbox v-for="(item,index) in listData"
                         :checked="item.cheacked"
                         :label="item.id"
                         @change="(value) => checkboxChnage(value,item,index)"
                         :key="item.index">{{item.name}}</el-checkbox>
            <!-- </el-checkbox-group> -->
          </div>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <span @click="onHide"
              class="details_cannelBtn"
              style="background:none">取消</span>
        <span class="saveSubmit"
              @click="saveSubmit()">保存</span>
      </div>
    </drawer>
  </div>
</template>

<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
export default {
  name: 'SetPermission',
  components: {
    Drawer
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    detailsData: {
      type: Object,
      default: {}
    },
    moduleData: {
      type: Array,
      default: []
    },
    tenantData: {
      type: Array,
      default: []
    }
  },
  created () {

  },
  watch: {
    detailsdrawershow: {
      handler (newValue, oldValue) {
        if (newValue) {
          this.listData = []
          this.$nextTick(() => {
            this.formatData()
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      checkedItems: [],
      listData: [],
      drawerTitle: '配置账号权限'
    }
  },
  mounted () {

  },
  methods: {
    saveSubmit () { // 提交
      let selected = this.listData.filter(item => item.cheacked)
      let params = this.detailsData
      params.authorities = selected
      console.log(selected, params)
      context.http.put(`uaa/api/tenantAccount/authority`, params).then(res => {
        if (res) {
          this.$message.success('保存成功')
          this.onHide()
        } else {
          console.log('error')
        }
      })
    },
    formatData () {
      let moduleData = this.moduleData
      let tenantData = this.tenantData
      let listData = moduleData.map((item, index) => {
        item.cheacked = false
        tenantData.forEach((val, i) => {
          if (item.id === val.id) {
            item.cheacked = true
          }
        })
        return item
      })
      this.listData = listData
      this.$forceUpdate()
      console.log(listData)
    },
    checkboxChnage (value, item, index) {
      if (!value) {
        this.$set(this.listData[index], 'cheacked', false)
      } else {
        this.$set(this.listData[index], 'cheacked', true)
      }
      // this.$forceUpdate()
      // console.log(this.listData)
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    onHide () {
      // this.$refs['draweDetaileData'].resetFields()
      this.$emit('drawerClose', false)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
.SetPermission {
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
    height: calc(100% - 80px) !important;
    .main_content {
      > .title {
        padding-left: 15px;
        font-size: 16px;
        font-weight: bold;
        color: #262626;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #eeeeee;
      }
      > .content {
        padding: 25px 15px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        label {
          width: 30%;
          margin-right: 0;
          margin-bottom: 25px;
        }
      }
    }
  }
}
</style>
