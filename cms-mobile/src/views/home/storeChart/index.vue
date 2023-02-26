<template>
  <div class="storeChart"
       :class="{'showMore':showMore}">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="onGoBack"></i>
      <div class="headTab">
        <span @click="cutTab('storeList','0')" v-if="hasAuthority('02020204')">房源平面图</span>
        <span class="active" v-if="hasAuthority('02020205')">租控图</span>
        <span @click="cutTab('storeList',2)"
              v-if="hasAuthority('02020201') ||hasAuthority('02020202') || hasAuthority('02020203')">房源列表</span>
      </div>
      <div class="addBtn"
           @click="showActionSheet">
        <i class="iconfont iconcms_shaixuan"></i>
      </div>
    </div>
    <div v-if="currentProject.referred"
         class="selectResult"
         @click="showActionSheet">
      <span>{{currentOrganizes.name}}</span>
      <span>{{currentProject.referred}}</span>
      <span>{{currentBuilding.buildingName}}</span>
    </div>
    <div class="totalInfo">
      <div class="title">
        <span>统计信息</span>
        <!-- <span>楼宇数量 {{floorData.statisics.buildingCount}}</span> -->
      </div>
      <div class="content">
        <div class="item"><span>楼宇数量</span><span>{{projectZcObj.buildingCount}}</span></div>
        <div class="item"><span>管理房源</span><span>{{projectZcObj.roomCount}}</span></div>
        <div class="item noborder"
             style="width:38%"><span>已租房源</span><span>{{projectZcObj.rentRoomCount}}</span></div>
        <div class="item"
             v-if="showMore"><span>空置房源</span><span>{{projectZcObj.onRentRoomCount}}</span></div>
        <div class="item"
             v-if="showMore"><span>面积出租率</span><span>{{projectZcObj.rentRate | toLocaleFixed}}<i v-if="projectZcObj.rentRate">%</i></span></div>
        <div class="item noborder"
             v-if="showMore"><span>管理房源面积m²</span><span>{{projectZcObj.buildingArea | toLocaleFixed}}</span></div>
        <div class="item"
             v-if="showMore"><span>已租房源面积m²</span><span> {{projectZcObj.rRentAreaB | toLocaleFixed}}</span></div>
        <div class="item"
             v-if="showMore"><span>空置房源面积m²</span><span>{{projectZcObj.kRentAreaB | toLocaleFixed}}</span></div>
      </div>
      <i class="iconfont"
         :class="{'iconcms_shang':showMore,'iconcms_xia':!showMore,}"
         @click="showMore=!showMore"></i>
      <div class="showBox"></div>
    </div>
    <div class="container">
      <div class="listHead">
        <div>
          <div>
            <i style="background: #9CD45A;"></i>
            <span>
              <span>已租房源</span>
              <span>{{floorData.statisics.isRentContractCount}}/{{floorData.statisics.isRentBuildingAreaSum}}m²</span>
            </span>
          </div>
          <div>
            <i style="background: #F2F2F2;"></i>
            <span>
              <span>空置房源</span>
              <span>{{floorData.statisics.noRentCount}}/{{floorData.statisics.noRentBuildingAreaSum}}m²</span>
            </span>
          </div>
        </div>
        <div>
          <div>
            <span>
              <span>全部房源</span>
              <span>{{floorData.statisics.count}}/{{floorData.statisics.buildingAreaSum}}m²</span>
            </span>
          </div>
          <div>
            <span>
              <span>出租率</span>
              <span>{{floorData.statisics.lettingRate}}%</span>
            </span>
          </div>
        </div>
      </div>
      <div class="cont-sub"
           v-if="floorData.list">
        <div class="floorlist"
             v-for="(item, index) in floorData.list"
             :key="index">
          <div class="floor-num">
            <!-- <i class="iconfont icon-cms_paixu"></i> -->
            <p>{{item.name}}<span> ({{item.area}}㎡)</span></p>
          </div>
          <div class="floor-wrap"
               :class="{'flex-wrap': openChar}">
            <!-- :style="{width: + (item2.buildingArea/item.area) * 100 +'%'}" -->
            <div class="floor-item"
                 @click="toStoreDetails(item2.id)"
                 :class="{'rent-zy': item2.investmentStatus === 'NO', 'rent-already': item2.onRent, 'expire': item2.expire, 'open-char': openChar && item.roomsDTOS.length < 5, 'open-char2': openChar && item.roomsDTOS.length >= 5}"
                 v-for="(item2, index2) in item.roomsDTOS"
                 :key="index2"
                 v-show="item2.buildingArea"
                 :style="{width: + (item2.buildingArea/item.area) * 100 + 100 +'px'}">
              <div class="fi-content">
                <p>{{item2.shopNumber}} {{item2.tenantName}}</p>
                <p>{{item2.buildingArea | toLocaleFixed}}㎡</p>
              </div>
            </div>
          </div>
        </div>
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
            <li v-for="(item, index) in organizesOptions"
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
            <li v-for="(item, index) in projectOptions"
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
            <li v-for="(item, index) in options2"
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
  name: 'storeChart',
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
      openChar: false,
      organizesOptions: [],
      projectOptions: [],
      options2: [],
      currentOrganizes: {},
      currentProject: {},
      currentBuilding: {},
      seachParams: {
        organizeId: '',
        projectManagementId: '',
        buildingId: ''
      },
      projectZcObj: {
        buildingCount: 0,
        count: 0,
        roomCount: 0,
        rentRoomCount: 0,
        onRentRoomCount: 0,
        rentRate: 0,
        buildingArea: 0,
        rRentAreaB: 0,
        kRentAreaB: 0
      },
      scrollVal: 0,
      showMore: false,
      floorData: {
        list: [],
        statisics: {}
      },
      tabActive: '铺位',
      popupShow: false,
      projectManagementList: [],
      buildingList: [],
      current: {},
      floorChartArr: [],
      currentFloor: {},
      dataReady: false
    }
  },
  activated () {
    if (roterFrom === 'storeDetails') {
      let scrollVal = window.sessionStorage.getItem('scrollVal')
      if (scrollVal) {
        this.$emit('changeScroll', scrollVal)
      }
    } else {
      window.sessionStorage.removeItem('scrollVal')
      this.$emit('changeScroll', 0)
      this.getOrganizes()
    }
    // if (!this.$route.meta.isBack) {
    //   Object.assign(this.$data, this.$options.data())
    //   this.queryProjectManagement()
    // }
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
      window.sessionStorage.removeItem('currObj')
      window.sessionStorage.removeItem('scrollVal')
    }
    next()
  },
  created () {

  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    async showActionSheet () {
      if (!this.currentOrganizes.id || !this.currentProject.id || !this.currentBuilding.id) {
        this.popupShow = !this.popupShow
        return
      }
      this.organizesOptions = this.organizesOptions.map((item, index) => {
        item.checked = false
        if (item.id === this.currentOrganizes.id) item.checked = true
        return item
      })
      let res1 = await context.http.get('cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: this.currentOrganizes.id })
      this.projectOptions = res1.data.map((item, index) => {
        item.checked = false
        if (item.id === this.currentProject.id) item.checked = true
        return item
      })
      let res2 = await context.http.get(`cms/api/project/${this.currentProject.id}/buildings`, { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING' })
      this.options2 = res2.data.filter((item, index) => {
        return item.assetsType === 'BUILDING'
      })
      this.options2 = this.options2.map(item => {
        item.checked = false
        if (item.id === this.currentBuilding.id) item.checked = true
        return item
      })
      this.popupShow = !this.popupShow
    },
    async getOrganizes () { // 管理企业获取接口
      // 管理企业
      let res = await context.http.get('uaa/api/organizes/enterprise/user', { useStatus: 'USING', organizeType: 'ENTERPRISE' })
      res.data[0].checked = true
      this.organizesOptions = res.data
      this.seachParams.organizeId = this.$route.params.organizeId ? this.$route.params.organizeId : this.organizesOptions[0].id
      this.currentOrganizes = this.organizesOptions.filter((item, index) => {
        return item.id === this.seachParams.organizeId
      })[0]
      // 项目
      let res1 = await context.http.get('cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: this.seachParams.organizeId })
      res1.data[0].checked = true
      this.projectOptions = res1.data
      if (!this.projectOptions.length) return
      this.seachParams.projectManagementId = this.$route.params.projectManagementId ? this.$route.params.projectManagementId : this.projectOptions[0].id
      this.currentProject = this.projectOptions.filter((item, index) => {
        return item.id === this.seachParams.projectManagementId
      })[0]
      // 楼宇
      let res2 = await context.http.get(`cms/api/project/${this.seachParams.projectManagementId}/buildings`, { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING' })
      this.options2 = res2.data.filter((item, index) => {
        return item.assetsType === 'BUILDING'
      })
      if (!this.options2.length) return
      this.options2[0].checked = true
      this.seachParams.buildingId = this.$route.params.buildingId ? this.$route.params.buildingId : this.options2[0].id
      this.currentBuilding = this.options2.filter((item, index) => {
        return item.id === this.seachParams.buildingId
      })[0]
      this.queryChart()
    },
    async submit (state) {
      if (state === 'reset') {
        this.selectOrganizes(0, this.organizesOptions[0])
      } else {
        // if (!this.organizesOptions.length || !this.projectOptions.length || !this.options2.length) return
        this.currentOrganizes = this.organizesOptions.filter(item => item.checked)[0] ? this.organizesOptions.filter(item => item.checked)[0] : {id: ''}
        this.currentProject = this.projectOptions.filter(item => item.checked)[0] ? this.projectOptions.filter(item => item.checked)[0] : {id: ''}
        this.currentBuilding = this.options2.filter(item => item.checked)[0] ? this.options2.filter(item => item.checked)[0] : {id: ''}
        this.queryChart()
        this.popupShow = false
      }
    },
    async queryChart () {
      this.dataReady = false
      let result = await context.http.get('cms/api/rooms/chart?useStatus=USING', {
        organizeId: this.currentOrganizes.id,
        buildingIds: this.currentBuilding.id,
        projectManagemantId: this.currentProject.id
      })
      this.getProjectZc(this.currentProject.id)
      this.dataReady = true
      if (!result.data.list) result.data.list = []
      this.floorData = result.data
    },
    async getProjectZc (id) {
      let res = await context.http.get('cms/api/stat/thisProjectZc', { id: id, UseStatus: 'USING' })
      this.projectZcObj = res.data
    },
    toStoreDetails (id) {
      this.$router.push({ name: 'storeDetails', params: { id: id } })
    },
    cutTab (name, index) {
      let params = {
        organizeId: this.currentOrganizes.id,
        projectManagementId: this.currentProject.id,
        buildingId: this.currentBuilding.id,
        index: index
      }
      this.$router.replace({ name: name, params: params })
    },
    async selectOrganizes (index, item) {
      this.organizesOptions = this.checkedFormat(index, this.organizesOptions)
      let res = await context.http.get('cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: item.id })
      this.projectOptions = res.data
      this.projectOptions = this.checkedFormat(0, this.projectOptions)
      this.getBuliding(this.projectOptions[0].id)
    },
    async selectProject (index, item) {
      this.projectOptions = this.checkedFormat(index, this.projectOptions)
      this.getBuliding(item.id)
    },
    selectBuilding (index, item) {
      this.options2 = this.checkedFormat(index, this.options2)
    },
    async getBuliding (id) { // 是否首次进入页面
      let result = await context.http.get(`cms/api/project/${id}/buildings`, { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING' })
      this.options2 = result.data.filter((item, index) => {
        return item.assetsType === 'BUILDING'
      })
      if (this.options2.length) {
        this.options2 = this.checkedFormat(0, this.options2)
      } else {
        this.seachParams.buildingId = null
      }
    },
    checkedFormat (i, arr) {
      arr = arr.map(item => {
        item.checked = false
        return item
      })
      arr[i].checked = true
      return arr
    },
    formatNull (val) {
      let res = val
      if (!val) {
        res = ''
      }
      return res
    },
    onGoBack () { // 返回
      // this.$router.go(-1)
      this.$router.replace({ name: 'index' })
    }
  }
}
</script>
<style scoped lang="scss" >
@import "../../../style/config";
.storeChart {
  background: #ffffff;
  min-height: 100%;
  box-sizing: border-box;
  &.showMore {
    .totalInfo {
      height: rem(300);
    }
    .buildingTab {
      top: rem(430);
    }
    .container {
      padding-top: rem(370);
    }
  }
  .totalInfo {
    position: fixed;
    left: 0;
    top: rem(70);
    width: 100%;
    height: rem(160);
    background-color: #fff;
    z-index: 9;
    padding: rem(15) 0;
    font-size: rem(13);
    color: #858c94;
    .iconfont {
      font-size: rem(20);
      position: absolute;
      left: 0;
      right: 0;
      bottom: rem(15);
      margin: auto;
      width: rem(100);
      text-align: center;
      color: #3575f6;
    }
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 rem(15);
      > span {
        &:first-child {
          font-size: rem(17);
          font-weight: bold;
          color: #18191a;
        }
        &:last-child {
        }
      }
    }
    .content {
      display: flex;
      flex-wrap: wrap;
      margin-top: rem(20);
      padding: 0 rem(10);
      > .item {
        width: 31%;
        height: rem(40);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-bottom: rem(30);
        border-right: rem(1) solid #eaeaea;
        padding-left: rem(5);
        padding-right: rem(5);
        &.noborder {
          border: none;
        }
        > span {
          &:last-child {
            font-size: rem(14);
            color: #18191a;
          }
        }
      }
    }
    .showBox {
      position: absolute;
      bottom: 0;
      height: rem(10);
      width: 100%;
      background-color: #f0f1f2;
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
      display: flex;
      justify-content: space-between;
      > span {
        margin: 0 rem(10);
        font-size: rem(15);
        &.active {
          font-weight: bolder;
          color: #0139a4;
          border-bottom: rem(2) solid #0139a4;
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
    height: rem(30);
    line-height: rem(30);
    span {
      // margin-right: rem(20);
    }
  }
  .buildingTab {
    width: 100%;
    // padding: rem(20) 0 rem(10) rem(14);
    padding-left: rem(14);
    height: rem(50);
    display: flex;
    align-items: center;
    position: fixed;
    z-index: 9;
    left: 0;
    top: rem(230);
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
  .container {
    padding-top: rem(230);
    .listHead {
      height: rem(60);
      display: flex;
      align-items: center;
      border-bottom: rem(1) solid #f0f0f0;
      > div {
        display: flex;
        height: rem(40);
        padding: 0 rem(10);
        color: #444547;
        font-size: rem(14);
        justify-content: space-between;
        &:first-child {
          width: 60%;
          border-right: rem(1) solid #eaeaea;
        }
        &:last-child {
          width: 40%;
        }
        > div {
          display: flex;
          align-items: center;
          text-align: center;
          i {
            display: block;
            width: rem(10);
            height: rem(10);
            margin-right: rem(8);
          }
          span {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            > span {
              &:last-child {
                font-size: rem(13);
              }
            }
          }
        }
      }
    }
    .floorlist {
      display: flex;
      justify-content: flex-start;
      border-bottom: 1px solid #e3e3e3;
      flex-direction: column;
      position: relative;
      padding: rem(10);
      .floor-num {
        width: 100%;

        display: flex;
        p {
          font-size: rem(15);
          font-weight: bolder;
          color: #18191a;
          height: rem(40);
          line-height: rem(40);
          > span {
            font-size: rem(13);
            font-weight: normal;
            color: #757b82;
          }
        }
      }
    }
    .floor-wrap {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      position: relative;
      flex-wrap: wrap;
      .floor-item {
        position: relative;
        background-color: #f3f5f6;
        margin: 4px 4px 0 0;
        height: rem(50);
        z-index: 1;
        cursor: pointer;
        // border-right: 1px solid #c6c6c6;
        &:last-child {
          margin-right: 0;
          // border-right: none;
        }
        &:hover .tooltip {
          display: block;
        }
        .fi-content {
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-evenly;
          > p {
            width: 90%;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        > p {
          color: #000;
          padding-left: 10px;
          &:first-child {
            margin-top: 20px;
          }
        }
        transition: width 0.5s;
        -moz-transition: width 0.5s; /* Firefox 4 */
        -webkit-transition: width 0.5s; /* Safari 和 Chrome */
        -o-transition: width 0.5s; /* Opera */
      }
      .tooltip {
        display: none;
        position: absolute;
        z-index: 2;
        width: 160px;
        height: 110px;
        background-color: #fff;
        top: 113px;
        left: 10px;
        border-radius: 4px;
        p {
          color: #666 !important;
          &:nth-of-type(1) {
            color: #000 !important;
            padding-top: 10px;
            padding-bottom: 15px;
          }
        }
        #triangle-up {
          width: 0;
          height: 0;
          top: -6px;
          left: 10px;
          border-width: 0 6px 6px;
          border-style: solid;
          border-color: transparent transparent #fff; /*透明 透明  灰*/
          position: relative;
        }
      }
      .rent-already {
        background-color: #96d050;
        p {
          color: #fff;
        }
      }
      .rent-zy {
        background-color: #87b0f1;
        p {
          color: #fff;
        }
      }
      .expire {
        background-color: #ee7873 !important;
        p {
          color: #fff;
        }
      }
      .open-char {
        flex: 1 !important;
      }
      .open-char2 {
        width: 18% !important;
        flex-grow: 1;
        // min-width: 240px;
      }
    }
    .flex-wrap {
      flex-wrap: wrap;
    }
  }
}
</style>
