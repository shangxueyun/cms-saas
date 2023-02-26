<template>
  <div class="engineeringList"
       :class="{'focus':focus}">
    <div class="head"
         v-if="!focus">
      <i class="back mintui mintui-back"
         @click="onGoBack"></i>
      <div class="headTab">房源工程</div>
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
               placeholder="请输入房源号"
               type="search"
               v-model="inputValue"
               @input="onKeyInput"
               @compositionstart="compositions(false)"
               @compositionend="compositions(true)"
               @focus="inputFocus"
               @keyup.13="onKeyInput"
               @keypress="search" />
      </form>
      <i class="mintui mintui-search"></i>
      <span class="cannelBtn"
            v-if="focus"
            @click="toContacts">取消</span>
    </div>
    <div v-if="currentProject.referred"
         class="selectResult">
      <span>{{currentProject.referred}}</span>
      <span>{{currentBuilding.buildingName}}</span>
      <span>{{currentfloors.name}}</span>
      <span>{{currentStatus.label}}</span>
    </div>
    <div class="content common_list ">
      <mt-loadmore ref="loadmore"
                   :bottom-method="loadBottom"
                   :autoFill="false"
                   :bottom-all-loaded="allLoaded">
        <ul>
          <li v-for="(item,index) in tableData"
              :key="index"
              @click="toStoreDetails(item)">
            <div>
              <span class="shopNb">{{item.building.buildingName}}</span>
              <span class="shopType"
                    :class="item.useStatus === 'USING' ? '' : 'weizu'">{{item.useStatus === 'USING' ? '使用中' : '已停用'}}</span>
            </div>
            <div>
              <span>楼层：{{item.floor.name}}</span>
              <span>房源号：{{item.shopNumber}}</span>
            </div>
            <span class="iconfont iconright"></span>
          </li>
        </ul>
      </mt-loadmore>

      <div class="loadAll"
           v-if="allLoaded && tableData.length!==0">
        <span>-</span>
        <p>已经到底了</p>
        <span>-</span>
      </div>
      <div class="noData"
           v-if="tableData.length===0 && dataReady">
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
          <p>项目</p>
          <ul>
            <li v-for="(item, index) in projectManagementList"
                :key="index"
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
                :key="index"
                @click="selectBuilding(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.buildingName }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>楼层</p>
          <ul>
            <li v-for="(item, index) in floorsList"
                :key="index"
                @click="selectfloors(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>房源状态</p>
          <ul>
            <li v-for="(item, index) in statusList"
                :key="index"
                @click="selectStatus(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.label }}</span>
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
    <div v-show="shadeBox"
         @touchmove.prevent
         class="shadeBox"></div>
  </div>
</template>
<script>
// import AppHeader from '@/components/appHead'
import context from '@/service'
import { toLocaleFixed } from '@/utils/validate.js'
import Vue from 'vue'
import { Popup } from 'vant'
import { Toast } from 'mint-ui'
Vue.use(Popup)
const allBuildingsObj = {
  id: '',
  buildingName: '全部楼宇',
  checked: true
}
const allFloorsObj = {
  id: '',
  name: '全部楼层',
  checked: true
}
let roterFrom = null
export default {
  name: 'engineeringList',
  footVisible: true,
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
      inputValue: '',
      flag: true,
      shadeBox: false,
      focus: false,
      popupShow: false,
      projectManagementList: [],
      buildingList: [],
      floorsList: [],
      currentProject: {},
      currentBuilding: {},
      currentfloors: {},
      currentStatus: {
        label: '使用中', value: 'USING', checked: true
      },
      statusList: [
        { label: '全部', value: '', checked: false },
        { label: '使用中', value: 'USING', checked: true },
        { label: '已停用', value: 'DISABLE', checked: false }
      ],
      dataReady: false,
      allLoaded: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pgSize: 15
    }
  },
  beforeRouteEnter (to, from, next) {
    roterFrom = from.name
    next()
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  activated () {
    if (roterFrom === 'engineeringDetails') {
      let scrollVal = window.sessionStorage.getItem('scrollVal')
      if (scrollVal) {
        this.$emit('changeScroll', scrollVal)
      }
    } else {
      this.$emit('changeScroll', 0)
      this.queryProjectManagement()
    }
  },
  created () {
    // this.queryProjectManagement()
    // let currObj = JSON.parse(sessionStorage.getItem('currObj'))
    // if (sessionStorage.getItem('currObj')) {
    //   this.currentProject = currObj.currentProject
    //   this.currentBuilding = currObj.currentBuilding
    //   this.currentfloors = currObj.currentfloors
    //   this.currentStatus = currObj.currentStatus
    // }
  },
  beforeDestroy () {
  },
  mounted () {

  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    toStoreDetails (item) {
      // if (!this.hasAuthority('02020503')) {
      //   Toast({
      //     message: '你的账号没有查看铺位工程的权限',
      //     position: 'top'
      //   })
      //   return
      // }
      let obj = {}
      obj.currentProject = this.currentProject
      obj.currentBuilding = this.currentBuilding
      obj.currentfloors = this.currentfloors
      obj.currentStatus = this.currentStatus
      window.sessionStorage.setItem('currObj', JSON.stringify(obj))
      window.sessionStorage.setItem('scrollVal', this.scrollVal)
      this.$router.push({ name: 'engineeringDetails', params: { item: JSON.stringify(item) } })
    },
    loadBottom () {
      this.currentPage++
      this.query()
      this.$refs.loadmore.onBottomLoaded()
    },
    formatShopType (item) {
      if (item.investmentStatus === 'OK' && !item.onRent) {
        return '未租'
      } else if (item.investmentStatus === 'OK' && item.onRent) {
        return '已租'
      } else if (item.investmentStatus === 'NO' && !item.onRent) {
        return '自用'
      } else if (item.investmentStatus === 'FICTITIOUS') {
        return '虚拟房源'
      }
    },
    onKeyInput (event) { // 输入
      if (event.keyCode !== 13 && this.flag) {
        this.shadeBox = false
        this.currentPage = 0
        this.tableData = []
        this.$nextTick(() => {
          this.query(true)
        })
      }
    },
    compositions (flag) {
      this.flag = flag
    },
    inputFocus () { // 获取焦点
      this.focus = true
      this.shadeBox = true
    },
    search (event) { // 键盘完成事件
      if (event.keyCode === 13) {
        event.preventDefault() // 禁止默认事件（默认是换行）
        this.inputValue = event.target.value
        this.currentPage = 0
        this.tableData = []
        this.query(true)
      }
    },
    toContacts () { // 取消
      this.focus = false
      this.shadeBox = false
      this.inputValue = ''
      this.currentPage = 0
      this.tableData = []
      this.query(true)
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
      this.current = res.data[0]
      this.getBuliding()
    },
    async getBuliding () { // 楼宇
      let result = await context.http.get(`cms/api/project/${this.currentProject.id}/buildings?sort=sortNumber,asc&sort=id,asc`, { page: 0, size: 100, useStatus: 'USING' })
      result.data.unshift(allBuildingsObj)
      if (result.data[0]) result.data[0].checked = true
      this.buildingList = result.data
      this.currentBuilding = result.data[0] ? result.data[0] : {}
      this.getFloorList()
    },
    async getFloorList () {
      if (this.currentBuilding.id === '' || !this.currentBuilding.id) {
        this.floorsList = []
        this.floorsList.push(allFloorsObj)
        this.currentfloors = this.floorsList[0]
      } else {
        let result = await context.http.get(`cms/api/floors/building/${this.currentBuilding.id}`)
        result.data.unshift(allFloorsObj)
        if (result.data[0]) result.data[0].checked = true
        this.floorsList = result.data
        this.currentfloors = result.data[0] ? result.data[0] : {}
      }
      let currObj = JSON.parse(sessionStorage.getItem('currObj'))
      if (sessionStorage.getItem('currObj')) {
        this.currentProject = currObj.currentProject
        this.currentBuilding = currObj.currentBuilding
        this.currentfloors = currObj.currentfloors
        this.currentStatus = currObj.currentStatus
      }
      this.query()
    },
    async selectProject (index, item) {
      this.projectManagementList = this.checkedFormat(index, this.projectManagementList)
      let result = await context.http.get(`cms/api/project/${item.id}/buildings?sort=sortNumber,asc&sort=id,asc`, { page: 0, size: 100, useStatus: 'USING' })
      result.data.unshift(allBuildingsObj)
      if (result.data[0]) result.data[0].checked = true
      this.buildingList = result.data
      this.selectBuilding(0, '')
    },
    async selectBuilding (index, item) {
      if (index === 0) {
        this.buildingList = this.checkedFormat(0, this.buildingList)
        this.floorsList = []
        this.floorsList.push(allFloorsObj)
        this.floorsList[0].checked = true
      } else {
        this.buildingList = this.checkedFormat(index, this.buildingList)
        let result = await context.http.get(`cms/api/floors/building/${item.id}`)
        result.data.unshift(allFloorsObj)
        if (result.data[0]) result.data[0].checked = true
        this.floorsList = result.data
        this.currentfloors = result.data[0] ? result.data[0] : {}
      }
    },
    selectfloors (index, item) {
      this.floorsList = this.checkedFormat(index, this.floorsList)
    },
    selectStatus (index, item) {
      this.statusList.forEach(item => {
        item.checked = false
      })
      this.statusList[index].checked = true
      this.currentStatus = this.statusList[index]
    },
    checkedFormat (i, arr) {
      arr = arr.map(item => {
        item.checked = false
        return item
      })
      arr[i].checked = true
      return arr
    },
    async showActionSheet () {
      if (!this.currentProject.id) {
        this.popupShow = !this.popupShow
        return
      }
      let result = await context.http.get(`cms/api/project/${this.currentProject.id}/buildings?sort=sortNumber,asc&sort=id,asc`, { page: 0, size: 100, useStatus: 'USING' })
      // 项目
      this.projectManagementList = this.projectManagementList.map(item => {
        item.checked = false
        if (item.id === this.currentProject.id) item.checked = true
        return item
      })
      // 楼宇
      let buildingsObj = {
        id: '',
        buildingName: '全部楼宇',
        checked: true
      }
      result.data.unshift(buildingsObj)
      if (this.currentBuilding && this.currentBuilding.id) {
        result.data = result.data.map(item => {
          item.checked = false
          if (item.id === this.currentBuilding.id) item.checked = true
          return item
        })
        // 楼层
        let floorsObj = {
          id: '',
          name: '全部楼层',
          checked: true
        }
        let result1 = await context.http.get(`cms/api/floors/building/${this.currentBuilding.id}`)
        result1.data.unshift(floorsObj)
        if (this.currentfloors && this.currentfloors.id) {
          result1.data = result1.data.map(item => {
            item.checked = false
            if (item.id === this.currentfloors.id) item.checked = true
            return item
          })
        } else {
          result1.data[0].checked = true
        }
        this.floorsList = result1.data
      } else {
        result.data[0].checked = true
      }
      this.buildingList = result.data
      this.statusList = this.statusList.map(item => {
        item.checked = false
        if (item.value === this.currentStatus.value) item.checked = true
        return item
      })
      this.popupShow = !this.popupShow
    },
    async submit (state) {
      if (state === 'reset') {
        if (!this.projectManagementList.length) return
        this.projectManagementList = this.checkedFormat(0, this.projectManagementList)
        let result = await context.http.get(`cms/api/project/${this.projectManagementList[0].id}/buildings?sort=sortNumber,asc&sort=id,asc`, { page: 0, size: 100, useStatus: 'USING' })
        result.data.unshift(allBuildingsObj)
        if (result.data[0]) result.data[0].checked = true
        this.buildingList = result.data
        // -------------
        this.floorsList = []
        this.floorsList.push(allFloorsObj)
        this.floorsList[0].checked = true
        // -------------
        this.statusList = this.checkedFormat(1, this.statusList)
        // this.currentStatus = this.statusList[0]
      } else {
        if (!this.projectManagementList.length) {
          this.popupShow = false
          return
        }
        this.currentProject = this.projectManagementList.filter(item => item.checked)[0]
        this.currentBuilding = this.buildingList.filter(item => item.checked)[0]
        this.currentfloors = this.floorsList.filter(item => item.checked)[0]
        this.currentStatus = this.statusList.filter(item => item.checked)[0]
        this.query(true)
        this.popupShow = false
      }
    },
    query (flag) {
      this.dataReady = false
      if (flag) this.currentPage = 1; this.allLoaded = false
      context.http.get('cms/api/rooms/condition?',
        {
          projectManagemantId: this.currentProject.id,
          buildingId: this.currentBuilding.id,
          floorId: this.currentfloors.id,
          queryShopNumber: this.inputValue,
          useStatus: this.currentStatus.value,
          page: (this.currentPage - 1),
          size: this.pgSize
        }).then(res => {
          this.dataReady = true
          if (flag) {
            this.tableData = res.data
          } else {
            this.tableData = this.tableData.concat(res.data)
          }
          this.total = Number(res.headers['x-total-count'])
          if (this.currentPage === Math.ceil(this.total / this.pgSize) || this.currentPage > Math.ceil(this.total / this.pgSize)) {
            this.allLoaded = true// 若数据已全部获取完毕
            console.log('全部获取完毕')
          }
        })
    },
    onGoBack () { // 返回首页
      window.sessionStorage.removeItem('scrollVal')
      window.sessionStorage.removeItem('currObj')
      this.$router.push({ name: 'index' })
    }
  }
}
</script>
<style scoped lang="scss" >
@import "../../../style/config";
.engineeringList {
  &.focus {
    .input {
      width: rem(300) !important;
    }
    .seachInput {
      top: 0 !important;
      border-top: 0;
    }
    .selectResult {
      top: rem(50);
    }
    .common_list {
      padding-top: rem(78);
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
  .common_list {
    padding-top: rem(118);
    li {
      padding: rem(14);
      background-color: #ffffff;
      border-bottom: rem(1) solid #f0f0f0;
      position: relative;
      > div {
        display: flex;
        flex-wrap: wrap;
        &:first-child {
          justify-content: space-between;
          margin-bottom: rem(8);
          font-size: rem(15);
          color: #444547;
          .shopNb {
            font-weight: bold;
            color: #18191a;
          }
          .shopType {
            position: absolute;
            right: rem(40);
            top: rem(40);
            color: #3575f6;
            &.weizu {
              color: #fc5159;
            }
            &.yizu {
              color: #1cc296;
            }
            &.ziyong {
              color: #444547;
            }
          }
        }
        &:nth-child(2) {
          flex-direction: column;
          color: #858c94;
          font-size: rem(14);
          > span {
            margin-bottom: rem(8);
          }
        }
      }
      .iconright {
        position: absolute;
        right: rem(14);
        top: 50%;
        margin-top: rem(-10);
        font-size: rem(14);
        color: #c6c6c6;
      }
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
  .selectResult {
    width: 100%;
    padding: 0 rem(14);
    position: fixed;
    z-index: 2;
    left: 0;
    top: rem(90);
    background: #f0f1f2;
    font-size: rem(13);
    color: #444547;
    height: rem(28);
    line-height: rem(28);
    overflow-x: auto;
    white-space: nowrap;
    span {
      // margin-right: rem(20);
    }
  }
}
</style>
