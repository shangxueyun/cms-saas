<template>
  <div class="tenantBillsList"
       :class="{'focus':focus}">
    <div v-if="!focus"
         class="head">
      <i class="back mintui mintui-back"
         @click="onGoBack"></i>
      <div class="headTab">
        <span @click="tabChange"
              v-if="hasAuthority('02030301')">收缴统计</span>
        <span :class="{'active': hasAuthority('02030301') && hasAuthority('02030320')}"
              v-if="hasAuthority('02030320')">客户账单</span>
      </div>
      <div class="addBtn"
           @click="showActionSheet">
        <i class="iconfont iconcms_shaixuan"></i>
      </div>
    </div>
    <div class="seachInput">
      <form @submit.prevent
            action="#">
        <input class="input"
               id="seachInput"
               results="5"
               focus
               placeholder="请输入客户名称"
               type="search"
               v-model="inputValue"
               @input="onKeyInput"
               @focus="inputFocus"
               @keyup.13="onKeyInput"
               @keypress="search" />
      </form>
      <i class="mintui mintui-search"></i>
      <span class="cannelBtn"
            v-if="focus"
            @click="toContacts">取消</span>
    </div>
    <div v-if="!focus && currentProject.referred" @click="showActionSheet"
         class="title"><span>{{currentOrganize.name}}</span><span>{{currentProject.referred}}</span><span v-if="currentBuilding">{{currentBuilding.buildingName}}</span></div>
    <div v-if="!focus"
         class="container">
      <ul v-if="tableData.length"
          class="list">
        <li v-for="(item, index) in tableData"
            :key="index"
            @click="toTenantBills(item.id)">
          <div class="floor_right">
            <p>
              <span>{{item.brandName}}</span>
              <span>
                <span v-if="item.billStatus?item.billStatus[0]:false"
                      style="color: #1CC296;">待缴({{item.billStatus[0]}})</span>
                <span v-if="item.billStatus?item.billStatus[1]:false"
                      style="color: #FC5159;">逾期({{item.billStatus[1]}})</span>
              </span>
            </p>
            <!-- <p>{{item.floorName}}层：{{item.shopNum}}</p> -->
          </div>
        </li>
      </ul>
      <div class="loadAll"
           v-if="tableData.length!==0">
        <span>-</span>
        <p>你碰到我的底线了</p>
        <span>-</span>
      </div>
      <div class="noData"
           v-if="tableData.length===0 && dataReady">
        <img src="../../../assets/nores.png">
        <p>暂无数据</p>
      </div>
    </div>
    <div v-if="focus"
         class="searchResult">
      <p v-if="currentProject.referred">基于{{currentProject.referred}}展开搜索</p>
      <ul v-if="searchTableData.length"
          class="list">
        <li v-for="(item, index) in searchTableData"
            @click="toTenantBills(item.id)"
            :key="index">
          <div class="floor_right">
            <p class="noShow">
              <span>{{item.brandName}}（{{item.buildings}}）</span>
              <span></span>
            </p>
            <!-- <p>{{item.floors}}层：{{item.shopNum}}</p> -->
          </div>
        </li>
      </ul>
      <div class="loadAll"
           v-if="searchTableData.length!==0">
        <span>-</span>
        <p>你碰到我的底线了</p>
        <span>-</span>
      </div>
      <div class="noData"
           v-if="searchTableData.length===0 && searchDataReady">
        <img src="../../../assets/nores.png">
        <p>暂无数据</p>
      </div>
    </div>
    <!-- 右侧筛选 -->
    <van-popup v-model="popupShow"
               class="popup_common"
               :overlay-style="{'background-color': 'rgba(0,0,0,.4)'}"
               :style="{ height: '100%' }"
               position="right">
      <p class="popup_title">筛选</p>
      <div class="popup_container">
        <div class="popup_list">
          <p>企业</p>
          <ul>
            <li v-for="(item, index) in organizesList"
                :key="item.id"
                @click="selectOrganizes(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>项目</p>
          <ul>
            <li v-for="(item, index) in projectManagementList"
                :key="item.id"
                @click="selectProject(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.referred }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>楼宇</p>
          <ul>
            <li v-for="(item, index) in buildingList"
                :key="item.id"
                @click="selectBuilding(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.buildingName }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="popup_buttons">
        <div @click="submit('reset')"
             class="popup_default">重置</div>
        <div @click="submit"
             class="popup_active">确定</div>
      </div>
    </van-popup>
    <!-- <div v-show="shadeBox"
         @touchmove.prevent
         class="shadeBox"></div> -->
  </div>
</template>
<script>
import context from '@/service'
import Vue from 'vue'
import { Popup } from 'vant'
Vue.use(Popup)
let roterFrom = null
export default {
  name: 'tenantBillsList',
  props: ['scrollTop'],
  components: {},
  watch: {
    scrollTop (val) {
      this.scrollVal = val
    }
  },
  data () {
    return {
      scrollVal: 0,
      popupShow: false,
      shadeBox: false,
      focus: false,
      inputValue: '',
      tableData: [],
      dataReady: false,
      organizesList: [],
      projectManagementList: [],
      buildingList: [],
      currentOrganize: {},
      currentProject: {},
      currentBuilding: {},
      searchTableData: [],
      searchDataReady: false
    }
  },
  // created () {
  //   this.queryProjectManagement()
  // },
  beforeRouteEnter (to, from, next) {
    roterFrom = from.name
    next()
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'index') {
      window.sessionStorage.removeItem('scrollVal')
    }
    if (to.name === 'tenantBills') {
      from.meta.isBack = true
    } else {
      from.meta.isBack = false
    }
    next()
  },
  activated () {
    if (roterFrom === 'tenantBills') {
      let scrollVal = window.sessionStorage.getItem('scrollVal')
      if (scrollVal) {
        this.$emit('changeScroll', scrollVal)
      }
    } else {
      window.sessionStorage.removeItem('scrollVal')
      this.$emit('changeScroll', 0)
      // this.queryProjectManagement()
      this.getOrganizes()
    }
    // if (!this.$route.meta.isBack) {
    //   Object.assign(this.$data, this.$options.data())
    //   this.queryProjectManagement()
    // }
  },
  methods: {
    async selectOrganizes (index, item) {
      this.organizesList = this.checkedFormat(index, this.organizesList)
      this.organizesChange(this.organizesList[index].id)
    },
    async getOrganizes (reset) { // 管理企业获取接口
      // 管理企业
      let res = await context.http.get('uaa/api/organizes/enterprise/user', { useStatus: 'USING', organizeType: 'ENTERPRISE' })
      this.organizesList = res.data
      if (this.organizesList && this.organizesList[0]) {
        this.organizesList[0].checked = true
        this.currentOrganize = this.organizesList[0]
      }
      // 项目
      let result = await context.http.get('cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: this.currentOrganize.id })
      if (result.data && result.data.length) {
        this.projectManagementList = result.data
        if (this.projectManagementList && this.projectManagementList[0]) {
          this.projectManagementList[0].checked = true
          this.currentProject = this.projectManagementList[0]
        }
      }
      // 楼宇
      let result1 = await context.http.get(`cms/api/project/${this.currentProject.id}/buildings?sort=sortNumber,asc&sort=id,asc`, { page: 0, size: 100, useStatus: 'USING' })
      // result1.data = result1.data.filter((item, index) => {
      //   return item.assetsType === 'BUILDING'
      // })
      if (result1.data && result1.data[0]) {
        result1.data[0].checked = true
        this.currentBuilding = result1.data[0]
      } else {
        this.currentBuilding = {}
      }
      this.buildingList = result1.data
      this.query()
    },
    async organizesChange (id) { // 管理企业查名下项目
      let res = await context.http.get('cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: id })
      if (res.data && res.data.length) {
        this.projectManagementList = res.data
        if (this.projectManagementList && this.projectManagementList[0]) {
          this.projectManagementList[0].checked = true
        }
        let projId = this.projectManagementList[0].id
        if (this.$route.params && this.$route.params.projectManagementId) {
          let temp = this.projectManagementsList.map((item, index) => {
            if (item.id === this.$route.params.projectManagementId) {
              return index
            }
          })
          if (temp) {
            this.projectManagementList[0].checked = false
            this.projectManagementList[temp].checked = true
            projId = this.projectManagementList[temp].id
          }
        }
        this.getBuliding(projId)
      }
    },
    async getBuliding (id) { // 楼宇
      let result = await context.http.get(`cms/api/project/${id}/buildings?sort=sortNumber,asc&sort=id,asc`, { page: 0, size: 100, useStatus: 'USING' })
      // result.data = result.data.filter((item, index) => {
      //   return item.assetsType === 'BUILDING'
      // })
      if (result.data && result.data[0]) {
        result.data[0].checked = true
      }
      this.buildingList = result.data
      // this.query()
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    toTenantBills (id) {
      window.sessionStorage.setItem('scrollVal', this.scrollVal)
      this.$router.push({ name: 'tenantBills', params: { id: id } })
    },
    async queryProjectManagement () {
      const res = await context.http.get('cms/api/project-managements', { useStatus: 'USING' })
      if (!res.data.length) {
        this.dataReady = true
        return
      }
      res.data[0].checked = true
      this.projectManagementList = res.data
      this.currentProject = res.data[0]
      this.getBuliding()
    },
    // async getBuliding () { // 楼宇
    //   let result = await context.http.get(`cms/api/project/${this.currentProject.id}/buildings?sort=sortNumber,asc&sort=id,asc`, { page: 0, size: 100, useStatus: 'USING' })
    //   if (result.data[0]) result.data[0].checked = true
    //   this.buildingList = result.data
    //   this.currentBuilding = result.data[0] ? result.data[0] : {}
    //   this.query()
    // },
    async selectProject (index, item) {
      this.projectManagementList = this.checkedFormat(index, this.projectManagementList)
      let result = await context.http.get(`cms/api/project/${item.id}/buildings?sort=sortNumber,asc&sort=id,asc`, { page: 0, size: 100, useStatus: 'USING' })
      // result.data = result.data.filter((item, index) => {
      //   return item.assetsType === 'BUILDING'
      // })
      if (result.data[0]) result.data[0].checked = true
      this.buildingList = result.data
    },
    selectBuilding (index, item) {
      this.buildingList = this.checkedFormat(index, this.buildingList)
    },
    async submit (state) {
      if (state === 'reset') {
        if (!this.organizesList.length) return
        this.selectOrganizes(0, this.organizesList[0])
      } else {
        if (!this.organizesList.length && !this.projectManagementList.length && !this.buildingList.length) {
          this.popupShow = false
          return
        }
        this.currentOrganize = this.organizesList.filter(item => item.checked)[0]
        this.currentProject = this.projectManagementList.filter(item => item.checked)[0]
        this.currentBuilding = this.buildingList.filter(item => item.checked)[0]
        this.query()
        this.popupShow = false
      }
    },
    async query () {
      this.tableData = []
      if (this.currentBuilding && this.currentBuilding.id) {
        this.dataReady = false
        let result = await context.http.get(`cms/api/contracts/graph`, { buildId: this.currentBuilding.id, projectId: this.currentProject.id, sort: true })
        this.dataReady = true
        // result.data.forEach(item => {
          // let arry = result.data.graphDTOS.map(v => {
            //   v.floorName = item.brandName
        //   return v
        // })
        this.tableData = this.tableData.concat(result.data.graphDTOS)
        // })
      } else {
        this.dataReady = true
        this.tableData = []
      }
    },
    async querySearch () {
      if (!this.currentProject.id) {
        this.searchDataReady = true
        return
      }
      this.searchDataReady = false
      let result = await context.http.get(`cms/api/contracts/graph/referred`, { projectId: this.currentProject.id, referred: this.inputValue })
      this.searchDataReady = true
      this.searchTableData = result.data
    },
    async showActionSheet () {
      if (this.currentOrganize.id && this.currentOrganize.id !== '') {
        this.organizesList = this.organizesList.map((item, index) => {
          item.checked = false
          if (item.id === this.currentOrganize.id) item.checked = true
          return item
        })
      } else {
        this.organizesList[0].checked = true
      }
      if (this.currentOrganize.id) {
        let res1 = await context.http.get('cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: this.currentOrganize.id })
        this.projectManagementList = res1.data.map((item, index) => {
          item.checked = false
          if (item.id === this.currentProject.id) item.checked = true
          return item
        })
      } else {
        this.projectManagementList = []
        this.projectManagementList.unshift(allProjectObj)
        this.projectManagementList[0].checked = true
      }
      if (this.currentProject.id) {
        let res2 = await context.http.get(`cms/api/project/${this.currentProject.id}/buildings`, { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING' })
        // this.buildingList = res2.data.filter((item, index) => {
        //   return item.assetsType === 'BUILDING'
        // })
        this.buildingList = res2.data.map(item => {
          item.checked = false
          if (item.id === this.currentBuilding.id) item.checked = true
          return item
        })
      } else {
        this.buildingList = []
        this.buildingList[0].checked = true
      }
      this.popupShow = !this.popupShow
    },
    onKeyInput (event) { // 输入
      this.shadeBox = false
      this.$nextTick(() => {
        this.querySearch()
      })
    },
    inputFocus () { // 获取焦点
      this.focus = true
      this.shadeBox = true
    },
    search (event) { // 键盘完成事件
      if (event.keyCode === 13) {
        event.preventDefault() // 禁止默认事件（默认是换行）
        this.inputValue = event.target.value
        this.querySearch()
      }
    },
    toContacts () { // 取消
      this.focus = false
      this.shadeBox = false
      this.searchDataReady = false
      this.inputValue = ''
      this.searchTableData = []
    },
    checkedFormat (i, arr) {
      arr = arr.map(item => {
        item.checked = false
        return item
      })
      arr[i].checked = true
      return arr
    },
    tabChange () {
      this.$router.replace({ name: 'feesCollected' })
    },
    onGoBack () { // 返回
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
.tenantBillsList {
  background: #ffffff;
  min-height: 100%;
  box-sizing: border-box;
  .head {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: rem(40);
    line-height: rem(40);
    overflow: hidden;
    text-align: center;
    font-size: rem(16);
    background: #fff;
    display: flex;
    justify-content: space-between;
    z-index: 9;
    box-shadow: 0px 1px 4px 0px rgba(230, 230, 230, 0.5);
    .headTab {
      color: #444547;
      font-size: rem(16);
      width: rem(200);
      display: flex;
      justify-content: center;
      > span {
        position: relative;
        &.active {
          color: #0139a4;
          border-bottom: rem(3) solid #0139a4;
          font-weight: bold;
        }
        &:nth-child(2) {
          margin-left: rem(40);
        }
      }
    }
    .back {
      width: rem(40);
      height: rem(40);
      font-size: rem(18);
      color: #000000;
      &:first-child {
        float: left;
      }
    }
    .addBtn {
      width: rem(40);
      height: rem(40);
      position: relative;
      i {
        font-size: rem(18);
        color: #444547;
        font-size: rem(18);
      }
    }
    .selected {
      color: #0139a4;
    }
  }
  .seachInput {
    height: $foot-height;
    width: 100%;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    padding: 0 rem(15);
    position: fixed;
    top: rem(40);
    z-index: 3;
    #seachInput::-webkit-search-cancel-button {
      display: none;
    }
    .mintui-search {
      position: absolute;
      left: rem(20);
      top: rem(18);
      color: #666666;
    }
    .input {
      // width: rem(300);
      width: rem(345);
      height: rem(30);
      background: rgba(244, 244, 244, 1);
      border-radius: rem(2);
      padding-left: rem(25);
      font-size: rem(13);
    }
    .cannelBtn {
      color: #0139a4;
      font-size: rem(15);
      margin-left: rem(10);
    }
  }
  .title {
    width: 100%;
    position: fixed;
    left: 0;
    top: rem(90);
    height: rem(28);
    line-height: rem(28);
    padding: 0 rem(14);
    font-size: rem(13);
    color: #444547;
    z-index: 1;
    background: #f8f9fa;
    z-index: 9;
    font-size: rem(13);
    height:rem(28);
    display: flex;
    white-space: nowrap;
    flex-basis: rem(0);
    flex-shrink: 0;
    align-items: center;
    overflow-x: auto;
    overflow-y: hidden;
    >span{
      display: block;
      line-height: rem(16);
      height:rem(16);
      border-right: rem(1) solid #D8D8D8;
      padding: 0 rem(10);
    }
    >span:last-child {
      border-right: none;
    }
  }
  &.focus {
    .input {
      width: rem(300) !important;
    }
    .seachInput {
      top: 0 !important;
      border-top: 0;
    }
    .title {
      top: rem(50);
    }
    .shadeBox {
      height: calc(100% - #{$foot-height});
      position: fixed;
      left: 0;
      top: $foot-height;
      width: 100%;
      background: rgba(0, 0, 0, 0.2);
      z-index: 2;
    }
  }
  .container,
  .searchResult {
    padding-top: rem(118);
    .list {
      padding-left: rem(14);
      li {
        padding: rem(15) 0;
        border-bottom: rem(1) solid #f0f0f0;
        .floor_right {
          flex: 1;
          position: relative;
          p:first-child {
            margin-bottom: rem(7);
            > span:first-child {
              width: rem(200);
              line-height: rem(20);
              color: #18191a;
              font-weight: 600;
              font-size: rem(15);
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            > span:last-child {
              position: absolute;
              right: rem(13);
              top: 0;
              font-size: rem(14);
              line-height: rem(20);
              > span:last-child {
                margin-left: rem(8);
              }
            }
          }
          p:last-child {
            width: rem(350);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: rem(20);
            color: #444547;
            font-size: rem(15);
          }
          .noShow {
            >span {
              font-size: rem(14)!important;
            }
          }
        }
      }
      li:last-child {
        border-bottom: 0;
      }
    }
  }
  .searchResult {
    padding-top: rem(85);
    > p {
      width: 100%;
      padding: rem(10) 0 rem(5);
      position: fixed;
      left: 0;
      top: rem(50);
      z-index: 9;
      background: #fff;
      padding-left: rem(14);
      font-size: rem(15);
      color: #3575f6;
      line-height: rem(20);
    }
  }
}
</style>
