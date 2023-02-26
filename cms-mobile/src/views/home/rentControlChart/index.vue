<template>
  <div class="rentControlChart">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="onGoBack"></i>
      <div class="headTab">
        <!-- <span @click="tabChange(item)"
              v-for="item in tabList"
              :key="item"
              :class="tabActive === item ? 'active' : ''">{{item}}</span> -->
      <span :class="tabActive === '客户平面图' ? 'active' : ''"
              @click="tabChange('客户平面图')"
              v-if="hasAuthority('02030101')"
              >客户平面图</span>
        <span :class="tabActive === '租控图' ? 'active' : ''" 
              @click="tabChange('租控图')"
              v-if="hasAuthority('02030106')"
              >租控图</span>
        <span :class="tabActive === '客户列表' ? 'active' : ''"
              @click="tabChange('客户列表')"
              v-if="hasAuthority('02030102')"
              >客户列表</span>
      </div>
      <div class="addBtn"
           @click="showActionSheet"
           :class="{ selected: openActionsheet }">
        <i class="iconfont iconcms_shaixuan"></i>
      </div>
    </div>
    <div v-if="currentOrganize.name" @click="showActionSheet" class="selectResult">
      <span class="selectName">{{currentOrganize.name}}</span>
      <span class="selectName">{{currentProject.referred}}</span>
      <span class="selectName">{{currentBuilding.buildingName}}</span>
    </div>
    <div class="topInfor">
      <div v-for="(item, index) in useDTOS"
           :key="index"
           class="colorBox">
        <span>行业</span>
        <div>
          <span v-for="(items, index) in item.value"
                :key="index"><i :style="`backgroundColor:${items.description}`"></i>{{items.value}}</span>
        </div>
      </div>
    </div>
    <div class="container">
      <ul class="floor_list">
        <li v-for="(item, index) in floorChartArr"
            :key="index">
          <div class="floorName">{{item.name}}</div>
          <div class="tenInfoItems">
            <div class="tenInfo"
                v-for="(item1,index1) in item.graphDTOS"
                    :style="{borderColor: item1.industryColor, backgroundColor: colorRgba(item1.industryColor) }"
                    :key="index1"
                    @click="goToTenantDetails(item1.id)">
                <div class="roomNb"
                    :title="item1.shopNums">{{item1.shopNums}}</div>
                <div class="tenname">{{item1.reffered}}</div>
                <div class="status">
                  <span v-if="item1.delayDay>=7 && item1.delayDay<15"
                        style="backgroundColor: rgba(44,167,44,0.1); color:#2ca72c">
                    <i style="background:#2ca72c"></i>超过7天未跟进</span>
                  <span v-if="item1.delayDay>=15 && item1.delayDay<30"
                        style="backgroundColor: rgba(249,154,18,0.1); color:#f99a12">
                    <i style="background:#f99a12"></i>超过15天未跟进</span>
                  <span v-if="item1.delayDay>=30"
                        style="backgroundColor: rgba(237,55,83,0.1); color:#ED3753">
                    <i style="background:#ED3753"></i>超过30天未跟进</span>
                  <span v-if="item1.delayDay==-1"
                        style="backgroundColor: rgba(119,119,119,0.1); color:#777777">
                    <i style="background:#777777"></i>暂无跟进记录</span>
                </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="loadAll"
           v-if="floorChartArr.length!==0">
        <span>-</span>
        <p>你碰到我的底线了</p>
        <span>-</span>
      </div>
      <div class="noData"
           v-if="floorChartArr.length===0 && dataReady">
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
          <p>管理企业</p>
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
  </div>
</template>
<script>
import context from '@/service'
import ActionSheet from '@/components/Actionsheet'
import Vue from 'vue'
import { Popup } from 'vant'
Vue.use(Popup)
let roterFrom = null
export default {
  name: 'rentControlChart',
  props: ['scrollTop'],
  components: {
    ActionSheet
  },
  watch: {
    scrollTop (val) {
      this.scrollVal = val
    }
  },
  data () {
    return {
      scrollVal: 0,
      tabList: ['客户平面图', '租控图', '客户列表'],
      tabActive: '租控图',
      openActionsheet: false,
      popupShow: false,
      projectManagementList: [],
      buildingList: [],
      organizesList: [],
      current: {},
      currentOrganize: {},
      currentProject: {},
      currentBuilding: {},
      floorChartArr: [],
      currentFloor: {},
      useDTOS: [],
      currentProjectId: '',
      dataReady: false
    }
  },
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
    if (to.name === 'TenantDetails') {
      from.meta.isBack = true
    } else {
      from.meta.isBack = false
    }
    next()
  },
  activated () {
    if (roterFrom === 'TenantDetails') {
      let scrollVal = window.sessionStorage.getItem('scrollVal')
      if (scrollVal) {
        this.$emit('changeScroll', scrollVal)
      }
    } else {
      window.sessionStorage.removeItem('scrollVal')
      this.$emit('changeScroll', 0)
      // this.queryProjectManagement()
      this.getOrganizesInit()
    }
    // if (!this.$route.meta.isBack) {
    //   Object.assign(this.$data, this.$options.data())
    //   this.queryProjectManagement()
    // }
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    async getOrganizesInit (init) { // 管理企业获取接口
      // 管理企业
      let res = await context.http.get('uaa/api/organizes/enterprise/user', { useStatus: 'USING', organizeType: 'ENTERPRISE' })
      this.organizesList = res.data
      if (this.organizesList && this.organizesList[0]) {
        this.organizesList[0].checked = true
        this.currentOrganize = this.organizesList[0]
      }
      if (this.organizesList.length && this.$route.params && this.$route.params.organizeId) {
        let temp
        let id = this.$route.params.organizeId
        this.organizesList.forEach((item, index) => {
          if (item.id === id) {
            temp = index
          }
        })
        if (temp) {
          this.currentOrganize = this.organizesList[temp]
          this.organizesList[0].checked = false
          this.organizesList[temp].checked = true
        }
      }
      // 项目
      this.projectManagementList = []
      this.currentProject = {}
      let id = this.currentOrganize.id ? this.currentOrganize.id : ''
      let res1 = await context.http.get('cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: id })
      this.projectManagementList = res1.data
      if (this.projectManagementList && this.projectManagementList[0]) {
        this.projectManagementList[0].checked = true
        this.currentProject = this.projectManagementList[0]
        this.currentProjectId = this.projectManagementList[0].id
      }
      if (this.projectManagementList.length && this.$route.params && this.$route.params.projectManagementId) {
        let temp
        let id = this.$route.params.projectManagementId
        this.projectManagementList.forEach((item, index) => {
          if (item.id === id) {
            temp = index
          }
        })
        if (temp) {
          this.currentProject = this.projectManagementList[temp]
          this.currentProjectId = this.projectManagementList[temp].id
          this.projectManagementList[0].checked = false
          this.projectManagementList[temp].checked = true
        }
      }
      this.buildingList = []
      // 楼宇
      this.currentBuilding = {}
      let result = await context.http.get(`cms/api/project/${this.currentProject.id}/buildings`, { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING' })
      let listOptions = result.data.filter((item, index) => {
        return item.assetsType === 'BUILDING'
      })
      if (listOptions[0]) listOptions[0].checked = true
      this.buildingList = listOptions
      this.currentBuilding = this.buildingList[0] ? this.buildingList[0] : {}
      if (this.buildingList.length && this.$route.params && this.$route.params.buildingId) {
        let temp
        let id = this.$route.params.buildingId
        this.buildingList.forEach((item, index) => {
          if (item.id === id) {
            temp = index
          }
        })
        if (temp) {
          this.currentBuilding = this.buildingList[temp]
          this.buildingList[0].checked = false
          this.buildingList[temp].checked = true
        }
      }
      this.getContractItemList()
    },
    async getOrganizes (reset) { // 管理企业获取接口
      let res = await context.http.get('uaa/api/organizes/enterprise/user', { useStatus: 'USING', organizeType: 'ENTERPRISE' })
      this.organizesList = res.data
      if (this.organizesList && this.organizesList[0]) {
        this.organizesList[0].checked = true
        this.currentOrganize = this.organizesList[0]
      }
      if (reset === 'init' && this.$route.params && this.$route.params.organizeId) {
        let temp
        this.organizesList.forEach((item, index) => {
          if (item.id === this.$route.params.organizeId) {
            temp = index
          }
        })
        if (temp) {
          this.currentOrganize = this.organizesList[temp]
          this.organizesList[0].checked = false
          this.organizesList[temp].checked = true
        }
      }
      this.organizesChange(reset)
    },
    async organizesChange (id) { // 管理企业查名下项目
      let res = await context.http.get('cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: id })
      if (res.data && res.data.length) {
        this.projectManagementList = res.data
        let proId
        if (this.projectManagementList && this.projectManagementList[0]) {
          this.projectManagementList[0].checked = true
          proId = this.projectManagementList[0].id
        }
        this.getBuliding(proId)
      }
    },
    async selectOrganizes (index, item) {
      this.organizesList = this.checkedFormat(index, this.organizesList)
      this.organizesChange(this.organizesList[index].id)
    },
    async getBuliding (id) { // 楼宇
      let result = await context.http.get(`cms/api/project/${id}/buildings?sort=sortNumber,asc&sort=id,asc`, { page: 0, size: 100, useStatus: 'USING' })
      result.data = result.data.filter((item, index) => {
        return item.assetsType === 'BUILDING'
      })
      var builId = ''
      if (result.data && result.data[0]) {
        result.data[0].checked = true
        builId = result.data[0].id
      }
      this.buildingList = result.data
      // this.getContractItemList(builId)
    },
    async getContractItemList () {
      if (this.tabActive === '租控图') {
        if (this.currentBuilding && this.currentBuilding.id) {
          this.dataReady = false
          let result = await context.http.get(`cms/api/tenant/graph/businessContract?sort=true&buildingId=` + this.currentBuilding.id)
          this.dataReady = true
          this.useDTOS = result.data.useDTOS
          this.floorChartArr = result.data.floorTenantDTOS
          // this.currentFloor = result.data.floorTenantDTOS[0] ? result.data.floorTenantDTOS[0] : {}
        } else {
          this.dataReady = true
          this.floorChartArr = []
          this.useDTOS = []
        }
      }
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
      }
      if (this.currentProject.id) {
        let res2 = await context.http.get(`cms/api/project/${this.currentProject.id}/buildings`, { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING' })
        this.buildingList = res2.data.filter((item, index) => {
          return item.assetsType === 'BUILDING'
        })
        this.buildingList = this.buildingList.map(item => {
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
    selectLi (index, item) {
      this.openActionsheet = false
      this.currentProject = item
      this.getContractItemList()
    },
    async selectProject (index, item) {
      this.projectManagementList = this.checkedFormat(index, this.projectManagementList)
      // this.currentProject = this.projectManagementList[index]
      this.getBuliding(this.projectManagementList[index].id)
    },
    selectBuilding (index, item) {
      this.buildingList = this.checkedFormat(index, this.buildingList)
      // this.getContractItemList()
    },
    async submit (state) {
      if (state === 'reset') {
        this.selectOrganizes(0, this.organizesList[0])
      } else {
        // if (!this.organizesList.length || !this.projectManagementList.length || !this.buildingList.length) {
        //   this.popupShow = false
        //   return
        // }
        this.currentOrganize = this.organizesList.filter(item => item.checked)[0] ? this.organizesList.filter(item => item.checked)[0] : {id: ''}
        this.currentProject = this.projectManagementList.filter(item => item.checked)[0] ? this.projectManagementList.filter(item => item.checked)[0] : {id: ''}
        this.currentBuilding = this.buildingList.filter(item => item.checked)[0] ? this.buildingList.filter(item => item.checked)[0] : {id: ''}
        this.getContractItemList()
        this.popupShow = false
      }
    },
    tabChange (item) {
      let searchObj = {
        organizeId: this.currentOrganize.id,
        projectManagementId: this.currentProject.id,
        buildingId: this.currentBuilding.id,
        floorId: null
      }
      if (item === '客户平面图') {
        this.$router.replace({ name: 'customerPlan', params: searchObj })
        return
      } else if (item === '租控图') {
        return
      } else if (item === '客户列表') {
        this.$router.replace({ name: 'tenantList', params: searchObj })
        return
      }
    },
    // changeFloor (item) {
    //   this.currentFloor = item
    // },
    checkedFormat (i, arr) {
      arr = arr.map(item => {
        item.checked = false
        return item
      })
      arr[i].checked = true
      return arr
    },
    onGoBack () { // 返回
      // this.$router.go(-1)
      this.$router.replace({ name: 'index' })
    },
    goToTenantDetails (id) {
      window.sessionStorage.setItem('scrollVal', this.scrollVal)
      this.$router.push({ name: 'TenantDetails', query: { 'tenantID': id } })
    },
    colorRgba (sHex) {
      // 十六进制颜色值的正则表达式
      var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{4}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/
      /* 16进制颜色转为RGB格式 */
      var sColor = sHex.toLowerCase()
      var alpha = 1
      if (sColor && reg.test(sColor)) {
        if (sColor.length === 4 || sColor.length === 5) {
          var sColorNew = '#'
          for (var i = 1; i < sColor.length; i += 1) {
            sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
          }
          sColor = sColorNew
        }
        // 如果有透明度再执行
        // if (sColor.length === 9) {
        //   alpha = (parseInt('0x' + sColor.slice(7, 9)) / 255).toFixed(2)
        // }
        //  处理六位的颜色值
        var sColorChange = []
        for (var j = 1; j < 7; j += 2) {
          sColorChange.push(parseInt('0x' + sColor.slice(j, j + 2)))
        }
        return 'rgba(' + sColorChange.join(',') + ',' + 0.06 + ')'
      } else {
        return rgba(253, 254, 255, 1)
      }
    }
  }
}
</script>
<style scoped lang="scss" >
@import "../../../style/config";
.rentControlChart {
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
      max-width: rem(230);
      display: flex;
      justify-content: space-between;
      > span {
        margin-right: rem(10);
        position: relative;
        &.active {
          color: #0139a4;
          border-bottom: rem(3) solid #0139a4;
          font-weight: bold;
        }
      }
      >span:last-child {
        margin-right: 0;
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
  .actionsheet_wrapper {
    top: rem(41);
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-start;
      padding-top: rem(10);
    }
    li {
      display: inline-block;
      width: rem(100);
      height: rem(30);
      line-height: rem(30);
      color: #444547;
      font-size: rem(13);
      text-align: center;
      background: rgba(242, 242, 242, 1);
      margin-bottom: rem(10);
      margin-left: rem(18);
      border-radius: rem(3);
      &.selected {
        color: #0139a4;
        background: rgba(239, 246, 255, 1);
      }
      .iconfont {
        display: inline-block;
        margin-right: rem(16);
      }
    }
  }
  .selectResult {
    width: 100%;
    padding: 0 rem(14);
    position: fixed;
    z-index: 9;
    left: 0;
    top: rem(40);
    background: #f0f1f2;
    font-size: rem(13);
    color: #444547;
    height: rem(28);
    line-height: rem(28);
  }
  .buildingTab {
    width: 100%;
    padding: rem(20) 0 rem(10) rem(14);
    position: fixed;
    z-index: 9;
    left: 0;
    top: rem(68);
    background: #fff;
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    li {
      padding: 0 rem(20);
      width: auto;
      line-height: rem(33);
      height: rem(33);
      white-space: nowrap;
      flex-basis: rem(0);
      flex-shrink: 0;
      background: #fff;
      font-size: rem(15);
      color: #444547;
      box-shadow: 0px 1px 4px 0px #d9d9d9;
      border-radius: rem(4);
      margin-right: rem(10);
      &.active {
        font-weight: 600;
        color: #0139a4;
        background: rgba(243, 247, 255, 1);
        box-shadow: 0px rem(1) rem(4) 0px #c7d9ff;
      }
    }
  }
  .topInfor {
    margin-top: rem(68);
    width: 100%;
    height: auto;
    .colorBox {
      display: flex;
      width: 100%;
      height: auto;
      border-bottom: rem(1) #F0F0F0 solid;
      >span {
        min-height: rem(20);
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #444547;
        font-weight: 400;
      }
      >div {
        flex: 6;
        >span {
          height: rem(20);
          line-height: rem(20);
          font-size: rem(12);
          // vertical-align: center;
          word-wrap: break-word;
          >i {
            margin: rem(2) rem(4);
            display: inline-block;
            width: rem(6);
            height: rem(6);
            border-radius: 50%;
          }
        }
      }
    }
  }
  .container {
    // padding-top: rem(138);
    .floor_list {
      padding: 0 rem(14);
      border-bottom: rem(1) solid #f0f0f0;
      li {
        padding: rem(15) 0;
        .floorName {
          font-size: rem(16);
          font-weight: 600;
          color: #18191A;
          height: rem(26);
          line-height: rem(26);
        }
        .tenInfoItems {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          .tenInfo {
            overflow: hidden;
            width: rem(170);
            height: rem(88);
            padding: rem(12) rem(10) rem(10) rem(10);
            border-radius: rem(1);
            border: #0f75fe 1px solid;
            margin-top: rem(4);
            .roomNb {
              font-weight: 500;
              font-size: rem(12);
            }
            .tenname {
              font-size: rem(12);
              margin-top: rem(5);
            }
            .status {
              margin-top: rem(9);
              height: rem(20);
              line-height: rem(20);
              font-size: rem(11);
              >span {
                display: inline-block;
                border-radius: rem(10);
                height: rem(20);
                line-height: rem(20);
                padding: 0 rem(6) 0 rem(2);
                >i {
                  display: inline-block;
                  width: rem(6);
                  height: rem(6);
                  border-radius: 50%;
                  margin: rem(1) rem(4);
                }
              }
            }
            >div {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .tenInfo:nth-child(even) {
            margin-left: rem(4);
          }
        }
      }
      li:last-child {
        border-bottom: 0;
      }
    }
  }
}
</style>
