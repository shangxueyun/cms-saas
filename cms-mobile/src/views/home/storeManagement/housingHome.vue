<template>
  <div class="storeList"
       :class="{'focus':focus}">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="onGoBack"></i>
      <div class="headTab">租赁房源</div>
      <div class="addBtn"
           @click="showActionSheet">
        <i class="iconfont iconcms_shaixuan"></i>
      </div>
    </div>
    <div @click="showActionSheet"
         class="selectResult">
      <span>{{currentOrganize.name}}</span>
      <span><i v-for="(item,index) in currentProject"
           :key="index">{{item.referred}}<i v-if="index!==currentProject.length-1&&item.referred!=='全部项目'">、</i></i></span>
      <span v-if="rhSearchParame1.onExpireDay">{{rhSearchParame1.onExpireDay?'包含'+rhSearchParame1.expireDay+'天内到期房源':'全部'}}</span>
      <span v-if="rhSearchParame1.sortBuildingArea">{{rhSearchParame1.sortBuildingArea}}m²</span>
      <span v-if="rhSearchParame1.sortExpectedUnitPrice">{{rhSearchParame1.sortExpectedUnitPrice}}元/m²·天</span>
      <span v-if="rhSearchParame1.sortAddress&&rhSearchParame1.sortAddress!==''">{{rhSearchParame1.sortAddress}}</span>
    </div>
    <div class="content common_list ">
      <mt-loadmore ref="loadmore"
                   :bottom-method="loadBottom"
                   :autoFill="false"
                   :bottom-all-loaded="allLoaded">
        <ul>
          <li v-for="(item,index) in tableData"
              :key="index"
              @click="toStoreDetails(item.id)">
            <div>
              <span class="shopNb">{{item.shopNumber}}</span>
              <span class="shopType"
                    :class="[item.contractEndDay > 0 ? 'yizu': 'weizu']">
                {{item.contractEndDay && item.contractEndDay > 0 ? item.contractEndDay + '天后到期' : formatShopType(item)}}
              </span>
            </div>
            <div>
              <span>{{item.building.projectManagementDTO.referred}} - {{item.building.buildingName}}</span>
              <span>租金（元/㎡·天）：{{item.expectedUnitPrice}}</span>
              <span>建筑面积（m²）：{{item.buildingArea}}</span>
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
          <p>管理企业</p>
          <ul>
            <li v-for="(item, index) in organizeList"
                :key="item.id"
                @click="selectOrganize(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>项目</p>
          <ul :key="key">
            <li v-for="(item, index) in projectManagementList"
                :key="item.id"
                @click="selectProject(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.referred }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>到期房源</p>
          <div class="onExpireDay">
            <van-checkbox v-model="rhSearchParame.onExpireDay"
                          shape="square">包含</van-checkbox>
            <van-dropdown-menu>
              <van-dropdown-item v-model="rhSearchParame.expireDay"
                                 :options="expireDayOption" />
            </van-dropdown-menu>
            <!-- <div>到期房源</div> -->
          </div>
        </div>
        <div class="popup_list">
          <p>建筑面积（m²）</p>
          <ul>
            <input type="text"
                   style="width:100%;height:40px"
                   placeholder="请输入建筑面积"
                   v-model="rhSearchParame.sortBuildingArea">
          </ul>
        </div>
        <div class="popup_list">
          <p>租金单价（元/m²·天）</p>
          <ul>
            <input type="text"
                   style="width:100%;height:40px"
                   placeholder="请输入租金单价"
                   v-model="rhSearchParame.sortExpectedUnitPrice">
          </ul>
        </div>
        <div class="popup_list">
          <p>地址</p>
          <ul>
            <input type="text"
                   placeholder="请输入地址"
                   style="width:100%;height:40px"
                   v-model="rhSearchParame.sortAddress">
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
// import AppHeader from '@/components/appHead'
import context from '@/service'
import { toLocaleFixed } from '@/utils/validate.js'
import storeChart from './storeChart.vue'
import Vue from 'vue'
import { Popup, Checkbox, CheckboxGroup, DropdownMenu, DropdownItem } from 'vant'
import { Toast } from 'mint-ui'
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Popup)
const allorganize = {
  id: '',
  name: '全部企业',
  checked: true
}
const allproject = {
  id: '',
  referred: '全部项目',
  checked: true
}
let roterFrom = null
export default {
  name: 'storeList',
  footVisible: true,
  components: {
    storeChart
  },
  watch: {

  },
  data () {
    return {
      key: new Date().getTime(),
      currentOrganize: {
        id: '',
        name: '全部企业',
        checked: true
      },
      currentProject: [{
        id: '',
        referred: '全部项目',
        checked: true
      }],
      currentAddress: '',
      organizeList: [],
      projectManagementList: [],
      expireDayOption: [
        { text: '30天内', value: 30 },
        { text: '60天内', value: 60 },
        { text: '90天内', value: 90 },
        { text: '180天内', value: 180 },
        { text: '360天内', value: 360 }
      ],
      rhSearchParame: { // 用于双向绑定
        expireDay: 30,
        organizeId: '',
        projectManagemantId: '',
        onExpireDay: false,
        sortBuildingArea: '',
        sortExpectedUnitPrice: '',
        sortAddress: ''
      },
      rhSearchParame1: { // 用于列表页面中展示
        expireDay: 30,
        organizeId: '',
        projectManagemantId: '',
        onExpireDay: false,
        sortBuildingArea: '',
        sortExpectedUnitPrice: '',
        sortAddress: ''
      },
      scrollVal: 0,
      index: 0,
      flag: true,
      shadeBox: false,
      focus: false,
      popupShow: false,
      onRent: null,
      investmentStatus: '',
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
  beforeRouteLeave (to, from, next) {
    if (to.name === 'index') {
      this.currentInit()
      this.$route.meta.keepAlive = false
      window.sessionStorage.removeItem('scrollVal')
    } else {
      this.$route.meta.keepAlive = true
    }
    next()
  },
  activated () {
    if (roterFrom === 'storeDetails') {
      let scrollVal = window.sessionStorage.getItem('scrollVal')
      if (scrollVal) {
        this.$emit('changeScroll', scrollVal)
      }
      this.query(true)
    } else {
      this.$emit('changeScroll', 0)
      this.getOrganizeList()
    }
  },
  created () {
    this.$emit('changeScroll', 0)
    this.getOrganizeList()
  },
  beforeDestroy () {
  },
  mounted () {

  },
  methods: {
    currentInit () {

    },
    async submit (state) {
      if (state === 'reset') {
        if (!this.organizeList.length) return
        this.organizeList = this.checkedFormat(0, this.organizeList)
        // this.currentOrganize = this.organizeList.filter(item => item.checked)[0]
        this.projectManagementList = []
        this.projectManagementList.push({ id: '', referred: '全部项目', checked: true })
        // this.currentProject = this.projectManagementList.filter(item => item.checked)
        this.rhSearchParame = {
          expireDay: 30,
          organizeId: '',
          projectManagemantId: '',
          onExpireDay: false,
          sortBuildingArea: '',
          sortExpectedUnitPrice: '',
          sortAddress: ''
        }
      } else {
        this.rhSearchParame1 = this.deepCopy(this.rhSearchParame)
        this.currentOrganize = this.organizeList.filter(item => item.checked)[0]
        this.currentProject = this.projectManagementList.filter(item => item.checked)
        this.query(true)
        this.popupShow = false
      }
    },
    deepCopy (obj) {
      var a = JSON.stringify(obj)
      var newobj = JSON.parse(a)
      return newobj
    },
    async showActionSheet () {
      this.organizeList = this.organizeList.map(item => {
        item.checked = false
        if (item.id === this.currentOrganize.id) item.checked = true
        return item
      })
      this.rhSearchParame = this.deepCopy(this.rhSearchParame1)
      if (!this.currentOrganize.id) {
        this.popupShow = !this.popupShow
        return
      }
      let result = await context.http.get('cms/api/getOrganiz/infoByids?useStatus=USING&ids=' + this.currentOrganize.id)
      let data = result.data[0].projectManagementDTO
      data.unshift(allproject)
      this.projectManagementList = data
      let ids = this.currentProject.map(item => item.id)
      this.projectManagementList = this.projectManagementList.map(item => {
        item.checked = false
        // if (item.id === this.currentProject.id) item.checked = true
        if (ids.indexOf(item.id) !== -1) item.checked = true
        return item
      })
      this.popupShow = !this.popupShow
    },
    async getOrganizeList () { // 管理企业列表
      let result = await context.http.get('uaa/api/organizes/enterprise/user?organizeType=ENTERPRISE&useStatus=USING')
      result.data.unshift(allorganize)
      this.organizeList = result.data
      // 默认第一个
      this.rhSearchParame.organizeId = result.data[0].id
      this.projectManagementList = []
      this.projectManagementList.push({
        id: '',
        referred: '全部项目',
        checked: true
      })
      this.query(true)
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    toStoreDetails (id) {
      if (this.hasAuthority('02020203')) {
        // let obj = {}
        // obj.currentProject = this.currentProject
        // obj.currentBuilding = this.currentBuilding
        // obj.currentfloors = this.currentfloors
        // obj.currentStatus = this.currentStatus
        // window.sessionStorage.setItem('currObj', JSON.stringify(obj))
        window.sessionStorage.setItem('scrollVal', this.scrollVal)
        this.$router.push({ name: 'storeDetails', params: { id: id } })
      } else {
        Toast({
          message: '你的账号没有查看房源信息的权限',
          position: 'top'
        })
      }
    },
    loadBottom () {
      this.currentPage++
      this.query()
      this.$refs.loadmore.onBottomLoaded()
    },
    async selectOrganize (index, item) {
      if (index === 0) {
        this.organizeList = this.checkedFormat(0, this.organizeList)
        this.projectManagementList = []
        this.projectManagementList.push(allproject)
        this.projectManagementList[0].checked = true
      } else {
        this.organizeList = this.checkedFormat(index, this.organizeList)
        let result = await context.http.get('cms/api/getOrganiz/infoByids?useStatus=USING&ids=' + item.id)
        let data = result.data[0].projectManagementDTO
        data.unshift(allproject)
        data[0].checked = true
        this.projectManagementList = data
        console.log(this.projectManagementList)
        // this.selectProject(0, '')
      }
    },
    async selectProject (index, item) {
      this.key = new Date().getTime()
      if (index === 0) {
        this.projectManagementList = this.checkedFormat(index, this.projectManagementList)
      } else {
        this.projectManagementList[0].checked = false
        this.$set(this.projectManagementList[index], 'checked', !this.projectManagementList[index].checked)
        let isChecked = this.projectManagementList.filter(item => item.checked)
        if (!isChecked.length) {
          this.projectManagementList = this.checkedFormat(0, this.projectManagementList)
        }
      }
    },
    formatShopType (item) {
      if (item.onRent) {
        return '已租'
      } else {
        return '空置'
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
    query (flag) {
      this.dataReady = false
      if (flag) this.currentPage = 1; this.allLoaded = false
      let ids = this.currentProject.map(item => item.id)
      context.http.get('cms/api/rooms/staging',
        {
          organizeId: this.currentOrganize.id,
          projectManagementId: ids.join(),
          onExpireDay: this.rhSearchParame1.onExpireDay,
          expireDay: this.rhSearchParame1.expireDay,
          sortBuildingArea: this.rhSearchParame1.sortBuildingArea,
          sortExpectedUnitPrice: this.rhSearchParame1.sortExpectedUnitPrice,
          sortAddress: this.rhSearchParame1.sortAddress,
          page: (this.currentPage - 1),
          size: this.pgSize,
          sort: 'desc'
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
      // window.sessionStorage.removeItem('scrollVal')
      // window.sessionStorage.removeItem('currObj')
      this.$router.push({ name: 'index' })
    }
  }
}
</script>
<style lang="scss">
.storeList {
  .van-dropdown-menu__title--active,
  .van-dropdown-item__option--active,
  .van-dropdown-item__icon {
    color: #0139a4;
  }
  .onExpireDay {
    display: flex;
    align-items: center;
    color: #323233;
    font-size: 14px;
    .van-checkbox {
      margin-right: 20px;
      .van-checkbox__label {
        font-size: 14px;
      }
    }
    .van-dropdown-menu__bar {
      box-shadow: none;
      .van-ellipsis {
        font-size: 14px;
      }
    }
  }
}
</style>
<style scoped lang="scss" >
@import "../../../style/config";
.storeList {
  .storeChart {
    z-index: 10;
    position: relative;
  }
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
    padding-top: rem(68);
    li {
      padding: rem(14);
      background-color: #ffffff;
      margin-bottom: rem(10);
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
    z-index: 11;
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
    top: rem(40);
    background: #f0f1f2;
    font-size: rem(13);
    color: #444547;
    height: rem(28);
    line-height: rem(28);
    overflow-x: auto;
    white-space: nowrap;
    span {
      &:nth-child(2) {
        i {
          font-style: normal;
        }
      }
      // margin-right: rem(20);
    }
  }
}
</style>
