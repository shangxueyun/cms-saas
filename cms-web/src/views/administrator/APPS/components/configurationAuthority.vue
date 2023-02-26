<template>
  <div class="apps-authority">
    <drawer 
      :show="permissiondrawershow" 
      :title="drawerTitle"
      @on-hide="onHide">
      <div class="mainlayout" slot="drawer">
        <div class="drawer-content">
          <div class="permission-list clearfix">
            <div class="pl-left float-left">
              <p>{{roleObj.moduleName}}</p>
            </div>
            <div class="pl-right float-right">
              <div class="plr-item" v-for="(item, index) in roleList" :key="index">
                <div>
                  <i class="checkbox" :class="{checked: item.checkAll}" @click="handleCheckAllChange(item, index)"></i><span class="item">{{item.name}}</span>
                </div>
                <div style="margin: 15px 0;" class="clearfix">
                  <span v-for="(item2, index2) in item.authorities" :key="index2"  @click="handleCheckedCitiesChange(item2, index2)" style="cursor: pointer;">
                    <i class="checkbox" :class="{checked: item2.checked}" style="float: left;"></i>
                    <span class="item" style="float: left;">{{item2.name}}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="permission-role">
            <p>选择角色<span style="color: red">*</span></p>
              <el-select
                v-model="roleList"
                multiple
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remoteMethod"
                >
                <el-option
                  v-for="item in roleOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            <div class="pr-bottom">
              <p>已添加角色的权限:</p>
              <p>
                <span>产品总监：APPS库（申请安装、安装、配置权限）；角色管理（新增角色、编辑角色、配置角色）</span>
              </p>
            </div>
          </div>
        </div>
        <div class="dialog-footer" slot="footer">
          <el-button @click="drawerShow = false" class="close-button">关 闭</el-button>
          <el-button type="primary" class="defaultbtn dialog-confirmBtn">确 认</el-button>
        </div>
      </div>
    </drawer>
  </div>
</template>
<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
export default {
  components: {
    Drawer
  },
  props: {
    permissiondrawershow: {
      type: Boolean,
      default: false
    },
    roleObj: {
      type: Object
    },
    roleData: {
      type: Array
    },
    existingAuthority: {
      type: Array
    }
  },
  data () {
    return {
      drawerTitle: '配置权限',
      roleList: [],
      authoritiesList: [],
      checkedList: [],
      companyOptions: [],
      roleOptions: []
    }
  },
  watch: {
    roleData: {
      handler: function (newValue, oldValue) {
        this.initLoadRole(this.roleData[0].id, 0)
        // console.log(this.roleData)
        // console.log('existingAuthority', this.existingAuthority)
      }
    }
  },
  methods: {
    onHide () {
      this.$emit('drawerClose', false)
    },
    handleCheckAllChange (item, index) {
      item.checkAll = !item.checkAll
      this.checkedList = item.checkAll ? this.checkedList : []
      let checked = item.checkAll
      item.authorities.forEach(item => {
        item.checked = checked
      })
      if (checked) {
        item.authorities.forEach(item => {
          this.checkedList.push(item)
        })
      } else {
        item.authorities.forEach(item => {
          let delindex = this.checkedList.indexOf(item)
          this.checkedList.splice(delindex, 1)
        })
      }
      // console.log('checkedList', this.checkedList)
      // console.log('roleList', this.roleList)
      this.$forceUpdate()
    },
    handleCheckedCitiesChange (item, index) {
      item.checked = !item.checked
      let authoritiesItem = item
      let roleList = this.roleList
      let rolelenth = this.roleList.length
      let currentAuthList = []
      for (let i = 0; i < rolelenth; i++) {
        for (let j = 0; j < roleList[i].authorities.length; j++) {
          if (roleList[i].authorities[j] === authoritiesItem) {
            currentAuthList = roleList[i]
            if (currentAuthList) {
              let indx = this.checkedList.indexOf(item)
              if (item.checked) {
                roleList[i].checkedLength += 1
                this.checkedList.push(item)
              } else {
                roleList[i].checkedLength -= 1
                this.checkedList.splice(indx, 1)
              }
              roleList[i].checkAll = (roleList[i].checkedLength) === roleList[i].authorities.length
            }
          }
        }
      }
      // console.log('val333', this.checkedList)
      this.$forceUpdate()
    },
    close () {
      this.$emit('drawerClose', false)
    },
    initLoadRole (id, index) {
      this.activeIndex = index
      let roleList = this.roleData.filter(item => item.id === id)
      this.roleList = roleList[0].authorities
      let existingAuthority = this.existingAuthority
      this.roleList.forEach(element => {
        element.checkAll = false
        element.checkedLength = 0
        element.authorities.forEach(ele => {
          ele.checked = false
          // 已配置的权限
          existingAuthority.forEach(ele2 => {
            if (ele.id === ele2.id) {
              ele.checked = true
              element.checkedLength += 1
              this.checkedList.push(ele)
            }
          })
        })
        element.checkAll = (element.checkedLength) === element.authorities.length
      })
    },
    // loadRole (id, index) {
    //   this.activeIndex = index
    //   let roleList = this.roleData.filter(item => item.id === id)
    //   this.roleList = roleList[0].authorities
    // },
    async confirmConfiguration () {
      let postData = {
        authorities: this.checkedList,
        id: this.roleObj.id,
        organizeCode: this.roleObj.organizeCode,
        organizeId: this.roleObj.organizeId,
        organizeName: this.roleObj.organizeName,
        roleName: this.roleObj.roleName,
        useStatus: this.roleObj.useStatus,
        users: this.roleObj.useStatus
      }
      let result = await context.http.put('uaa/api/roles/authority', postData)
      if (result.data) {
        this.close()
      }
    },
    async remoteMethod (query) {
      let result = await context.http.get('/ywm/api/module-authorizations/corporateCustomer'
      , {companyShortName: query, moduleId: this.id})
      if (query !== '') {
        // this.loading = true
        setTimeout(() => {
          // this.loading = false
          this.formatCompany(result.data)
        }, 200)
      } else {
        this.companyOptions = []
      }
    },
    formatCompany (result) {
      this.userId = result[0].customerContacts[0].id
      this.companyOptions = result.map(item => {
        return { value: item.customerContacts[0].id, label: item.companyShortName }
      })
    }
  }
}
</script>
<style lang="scss">
  .apps-authority{

  }
</style>
