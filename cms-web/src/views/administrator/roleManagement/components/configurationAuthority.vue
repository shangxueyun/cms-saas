<template>
    <drawer
      :show="permissiondrawershow"
      :title="drawerTitle"
      @on-hide="onHide">
      <div class="jurisdictionlayout details-content" slot="drawer">
        <div class="drawer-content">
          <div class="drawer-title">{{roleObj.roleName}}</div>
          <div class="permission-list clearfix">
            <div class="pl-left">
              <p v-for="(item, index) in roleData" :key="index" :class="{plactivated: activeIndex === index}" @click="initLoadRole(item.id, index)">{{item.name}}</p>
            </div>
            <div class="menu2 float-left">
              <p v-for="(item, index) in roleList" :key="index" :class="{active: mune2Index === index}" @click="menu2Change(item.id, index)">{{item.name}}</p>
            </div>
            <div class="pl-right float-right">
              <div class="menu3" v-for="(item, index) in menu3List" :key="index">
                <p class="item">{{item.name}}<i class="checkbox" :class="{checked: item.checkAll}" @click.stop="handleCheckAllChange(item, index)" style="margin-left:10px;width:15px;height:15px"></i>（全选）</p>
                <div class="menu4 clearfix"  style="margin: 15px 0;">
                  <span v-for="(item2,index2) in item.authorities" :key="index2" style="cursor: pointer;"  @click.stop="handleCheckedCitiesChange(item2, index2)">
                    <i class="checkbox" :class="{checked: item2.checked}" style="float: left;"></i>
                    <span  class="item" style="float: left;" :title="item2.name">{{item2.name}}</span>
                  </span>
                </div>
              </div>

              <!-- <div class="plr-item" v-for="(item, index) in roleList" :key="index">
                <div>
                  <i class="checkbox" :class="{checked: item.checkAll}" @click.stop="handleCheckAllChange(item, index)"></i><span class="item">{{item.name}}</span>
                </div>
                <div style="margin: 15px 0;" class="clearfix">
                  <span v-for="(item2, index2) in item.authorities" :key="index2"  @click.stop="handleCheckedCitiesChange(item2, index2)" style="cursor: pointer;">
                    <i class="checkbox" :class="{checked: item2.checked}" style="float: left;"></i>
                    <span class="item" style="float: left;">{{item2.name}}</span>
                  </span>
                </div>
              </div> -->
            </div>

          </div>
        </div>
      </div>
      <div class="dialog-footer" slot="footer">
        <el-button @click="close" class="close-button">关 闭</el-button>
        <el-button type="primary" @click="confirmConfiguration" class="defaultbtn dialog-confirmBtn">确 认</el-button>
      </div>
    </drawer>
</template>
<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
export default {
  name: 'configurationAuthority',
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
      drawerTitle: '配置角色权限',
      isIndeterminate: false,
      checkedRoles: [],
      checkAll: false,
      drawershow: false,
      jurisdictionShow: false,
      activeIndex: 0,
      roleList: [], // 2级菜单
      menu3List: [], // 3级菜单
      roleOptions: [],
      authoritiesList: [],
      checkedList: [],
      operation: false,
      mune2Index: 0
    }
  },
  watch: {
    roleData: {
      handler: function (newValue, oldValue) {
        this.checkedList = []
        this.checkedList = this.existingAuthority
        this.operation = false
        this.initLoadRole(this.roleData[0].id, 0)
        // console.log(this.roleData)
        // console.log('existingAuthority', this.existingAuthority)
        // console.log('this.checkedList', this.checkedList)
      }
    }
  },
  mounted () {
  },
  methods: {
    async query () {
    },
    onHide () {
      this.$emit('drawerClose', false)
    },
    unique (arr) {
      arr = Array.from(new Set([...arr]))
      return arr
    },
    handleCheckAllChange (item, index) {
      this.operation = true
      item.checkAll = !item.checkAll
      // this.checkedList = item.checkAll ? this.checkedList : []
      let checked = item.checkAll
      item.authorities.forEach(item => {
        item.checked = checked
      })
      if (checked) {
        if (this.checkedList.length === 0) {
          item.authorities.forEach(item => {
            this.checkedList.push(item)
          })
        } else {
          let authoritiesLeng = item.authorities.length
          let checkedListLeng = this.checkedList.length
          for (let i = 0; i < authoritiesLeng; i++) {
            for (let j = 0; j < checkedListLeng; j++) {
              if (item.authorities[i].id !== this.checkedList[j].id) {
                this.checkedList.push(item.authorities[i])
              }
            }
          }
        }
        let checkedList = this.unique(this.checkedList)
        this.checkedList = checkedList
      } else {
        let checkedListIdList = []
        this.checkedList.forEach(ele => {
          checkedListIdList.push(ele.id)
        })
        checkedListIdList.sort(function (a, b) {
          return a - b
        })
        checkedListIdList = checkedListIdList.reverse()
//      console.log('checkedListIdList', checkedListIdList)
        for (let i = 0; i < checkedListIdList.length; i++) {
          for (let j = 0; j < item.authorities.length; j++) {
            if (checkedListIdList[i] === item.authorities[j].id) {
              checkedListIdList.splice(i, 1)
              i = i - 1
            }
          }
        }
//      console.log('checkedListIdList', checkedListIdList)
        let deletionCheckedList = []
        this.checkedList.forEach(ele => {
          checkedListIdList.forEach(ele2 => {
            if (ele.id === ele2) {
              deletionCheckedList.push(ele)
            }
          })
        })
        // console.log('deletionCheckedList', deletionCheckedList)
        this.checkedList = deletionCheckedList
      }
      // console.log('checkedList', this.checkedList)
      // console.log('roleList', this.roleList)
      this.$forceUpdate()
    },
    handleCheckedCitiesChange (item, index) {
      this.operation = true
      item.checked = !item.checked
      let authoritiesItem = item
      let roleList = this.roleList
      let rolelenth = this.roleList.length
      let currentAuthList = []
      for (let i = 0; i < rolelenth; i++) {
        for (let j = 0; j < roleList[i].authorities.length; j++) {
          for (let k = 0; k < roleList[i].authorities[j].authorities.length; k++) {
            if (roleList[i].authorities[j].authorities[k] === authoritiesItem) {
              currentAuthList = roleList[i]
              if (currentAuthList) {
                let checkedListId = []
                this.checkedList.forEach(ele => {
                  checkedListId.push(ele.id)
                })
                let indx = checkedListId.indexOf(item.id)
                if (item.checked) {
                  roleList[i].authorities[j].checkedLength += 1
                  this.checkedList.push(item)
                } else {
                  roleList[i].authorities[j].checkedLength -= 1
                  this.checkedList.splice(indx, 1)
                }
                roleList[i].authorities[j].checkAll = (roleList[i].authorities[j].checkedLength) === roleList[i].authorities[j].authorities.length
              }
            }
          }
        }
      }
      this.$forceUpdate()
    },
    close () {
      this.$emit('drawerClose', false)
    },
    menu2Change (id, index) {
      this.mune2Index = index
      let list = this.roleList.filter(item => item.id === id)
      this.menu3List = list[0].authorities
      let existingAuthority = this.checkedList
      this.menu3List.forEach(element => {
        element.checkAll = false
        element.checkedLength = 0
        // if (element.authorities.length === 0) {
        //   element.authorities.push({
        //     authorities: [],
        //     checked: false,
        //     code: '0304',
        //     codeUrl: '03,0304',
        //     id: 35,
        //     name: '查看',
        //     onValid: true
        //   })
        // }
        element.authorities.forEach(ele => {
          ele.checked = false
          // 已配置的权限
          existingAuthority.forEach(ele2 => {
            if (ele.id === ele2.id) {
              ele.checked = true
              element.checkedLength += 1
            }
          })
        })
        element.checkAll = (element.checkedLength) === element.authorities.length && element.checkedLength !== 0
      })
      this.$forceUpdate()
    },
    initLoadRole (id, index) {
      this.activeIndex = index
      this.mune2Index = 0
      let roleList = this.roleData.filter(item => item.id === id)
      this.roleList = roleList[0].authorities
      if (this.roleList.length > 0) {
        this.menu3List = this.roleList[0].authorities
      } else {
        this.menu3List = []
      }
      let existingAuthority = this.checkedList
      // this.roleList.forEach(element => {
      //   element.checkAll = false
      //   element.checkedLength = 0
      //   if (element.authorities.length === 0) {
      //     element.authorities.push({
      //       authorities: [],
      //       checked: false,
      //       code: '0304',
      //       codeUrl: '03,0304',
      //       id: 35,
      //       name: '查看',
      //       onValid: true
      //     })
      //   }
      //   element.authorities.forEach(ele => {
      //     ele.checked = false
      //     // 已配置的权限
      //     existingAuthority.forEach(ele2 => {
      //       if (ele.id === ele2.id) {
      //         ele.checked = true
      //         element.checkedLength += 1
      //       }
      //     })
      //   })
      //   element.checkAll = (element.checkedLength) === element.authorities.length
      // })
      this.menu3List.forEach(element => {
        element.checkAll = false
        element.checkedLength = 0
        // if (element.authorities.length === 0) {
        //   element.authorities.push({
        //     authorities: [],
        //     checked: false,
        //     code: '0304',
        //     codeUrl: '03,0304',
        //     id: 35,
        //     name: '查看',
        //     onValid: true
        //   })
        // }
        element.authorities.forEach(ele => {
          ele.checked = false
          // 已配置的权限
          existingAuthority.forEach(ele2 => {
            if (ele.id === ele2.id) {
              ele.checked = true
              element.checkedLength += 1
            }
          })
        })
        element.checkAll = (element.checkedLength) === element.authorities.length && element.checkedLength !== 0
      })
      this.$forceUpdate()
    },
    async confirmConfiguration () {
      let postData = {
        authorities: this.checkedList,
        id: this.roleObj.id,
        organizeCode: this.roleObj.organizeCode,
        organizeId: this.roleObj.organizeId,
        organizeName: this.roleObj.organizeName,
        roleName: this.roleObj.roleName,
        useStatus: this.roleObj.useStatus
      }
      let result = await context.http.put('uaa/api/roles/authority', postData)
      if (result.data) {
        this.close()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.jurisdictionlayout{
    width: 900px;
    min-height: 90%;
    margin-bottom: 20px;
    .drawer-content{
      width: 848px;
      min-height: 780px;
      margin: 0 auto;
      -moz-box-shadow:0 0 10px #e5e5e5;
      -webkit-box-shadow:0 0 10px #e5e5e5;
      box-shadow:0 0 10px #e5e5e5;
      .drawer-title{
        height: 50px;
        line-height: 50px;
        margin-left: 20px;
        font-size: 16px;
        font-weight: bold;
      }
      .permission-list{
        height: 100%;
        border-top: 1px solid #eee;
        .plactivated{
          border-bottom:2px solid #409eff;
          color: #409eff!important; 
        }
        .pl-left{
          width: 100%;
          height: 50px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content:space-around;
          p{
            height: 50px;
            line-height: 50px;
            color: #666;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            font-size: 14px;
          }
        }
        .menu2{
          width: 20%;
          min-height: 94%;
          padding-top: 20px;
          border-right: 1px solid #eee;
          p{
            height: 40px;
            line-height: 40px;
            text-align: center;
            cursor: pointer;
          }
          .active{
            background-color: #409eff;
            color:#fff;
          }
        }
        .menu3{
          margin-bottom: 30px;
          padding-left: 15px;
          p{
            height: 40px;
            line-height: 40px;
            border-bottom:1px solid #eee 
          }
          .menu4{
            font-size: 14px;
            color: #999;
            span {
              display: inline-block;
              white-space: nowrap;
              overflow: hidden;
            }
            > span {
              width: 160px;
              margin: 2px 0;
              span {
                width: 140px;
              }
            }
          }
        }
        .pl-right{
          width: 80%;
          min-height: 94%;
          padding-top: 20px;
          .menu3{
            margin-top: 30px;
            &:nth-of-type(1){
              margin-top: 0;
            }
            .checkbox {
              display: inline-block;
              width: 12px;
              height: 12px;
              border: solid 1px #c2c2c2;
              cursor: pointer;
              position: relative;
              top: 4px;
            }
            .checkbox:after{
                box-sizing: content-box;
                content: "";
                border: 1px solid #fff;
                border-left: 0;
                border-top: 0;
                height: 7px;
                left: 4px;
                position: absolute;
                top: 0;
                transform: rotate(45deg) scaleY(0);
                width: 3px;
                transition: transform .15s ease-in .05s;
                transform-origin: center;
            }
            .checked{
              background-color: #409eff;
              border-color: #409eff;
              &:after{
                transform: rotate(45deg) scaleY(1);
              }
            }
            .item{
              margin: 0 0 0 6px;
            }
          }
        }
      }
      .permission-role{
        height: 60%;
        margin: 40px 20px 0 20px;
        p{
          margin-bottom: 20px;
        }
        .el-select{
          width: 100%;
        }
        .pr-bottom{
          margin-top: 25%;
          p{
            margin-bottom: 10px;
          }
          p:last-child{
            color: #898989;
          }
        }
      }
    }
    .checkAll{
      font-size: 16px;
      .el-checkbox__label{
        font-size: 16px;
      }
    }
  }
</style>
