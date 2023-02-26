<template>
  <div class="building" :class="{'focus':focus}">
    <app-header v-if="!focus" :title="title">
    </app-header>
    <!-- <div class="seachInput">
      <form @submit.prevent
            action="#">
        <input class="input"
               id="seachInput"
               results="5"
               focus
               placeholder="楼宇名称"
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
    </div> -->
    <div class="title">
      <span v-for="(item, index) in currentIndustry" 
            :key="item.value"
            @click="statusHandler(item, index)"
            :class="{'active': activeIndustry === index}">
      {{item.text}}</span>
    </div>
    <div class="container">
      <div class="building-statistics">
        <div class="bs-head">
          <span class="bsh-title">楼宇统计</span>
        </div>
        <div class="bs-content" :class="{'completeH': showbillmore}">
          <div class="bsc-item">
            <p>楼宇数量</p>
            <p>{{thisProjectZcObj.buildingCount ? thisProjectZcObj.buildingCount : 0}}</p>
          </div>
          <div class="bsc-item">
            <p>管理房源</p>
            <p>{{thisProjectZcObj.roomCount}}</p>
          </div>
          <div class="bsc-item">
            <p>已租房源</p>
            <p>{{thisProjectZcObj.rentRoomCount}}</p>
          </div>
          <div class="bsc-item">
            <p>空置房源</p>
            <p>{{thisProjectZcObj.onRentRoomCount}}</p>
          </div>
          <div class="bsc-item">
            <p>管理房源面积(m²)</p>
            <p>{{thisProjectZcObj.buildingArea}}</p>
          </div>
          <div class="bsc-item">
            <p>已租房源面积(m²)</p>
            <p>{{thisProjectZcObj.rRentAreaB}}</p>
          </div>
          <div class="bsc-item">
            <p>空置房源面积(m²)</p>
            <p>{{thisProjectZcObj.kRentAreaB}}</p>
          </div>
          <div class="bsc-item">
            <p>面积出租率</p>
            <p>{{thisProjectZcObj.rentRate}}%</p>
          </div>
        </div>
        <div class="more-cion"
              style="color: #3575F6"
              :class="{'showmore': showbillmore}"
              @click="showbillmore = !showbillmore">
          <i class="iconfont iconcms_xia"></i>
        </div>
      </div>
      <ul v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loadBottom"
          infinite-scroll-distance="20"
          infinite-scroll-immediate-check="false"
          v-if="tableData.buildingListDTOS.length" 
          class="list">
        <li @click="toBuildingDetails(item)" v-for="(item, index) in tableData.buildingListDTOS" :key="index">
          <div class="project-img">
            <p>{{ item.buildingName }} ({{ filterAssetsType(item.assetsType) }})</p>
            <p>管理负责人：{{ item.user }}</p>
          </div>
          <div class="project-center">
            <p class="pj-title" v-if="item.buildingArea">
              <span></span>
              <span>面积：<span>{{formatArea(item)}}</span></span>
            </p>
            <p class="nav">
              <!-- <span>实时均价 {{item.price | toLocaleFixed}}</span>
              <span class="dividing-line"></span>
              <span>面积出租率 {{item.areaRate}}</span> -->
            </p>
            <p class="nav-bottom">
              <!-- <span>在租合同数 <span>{{item.contractNumber}}</span></span>
              <span class="dividing-line"></span>
              <span>已租面积 <span>{{item.yzArea}}㎡</span></span> -->
            </p>
          </div>
          <span class="iconfont iconright"></span>
        </li>
      </ul>
      <div class="loadAll" v-if="loadAll && tableData.buildingListDTOS.length!==0">
        <span>-</span>
        <p>已经到底了</p>
        <span>-</span>
      </div>
      <div class="noData" v-if="tableData.buildingListDTOS.length===0 && dataReady">
        <img src="../../../assets/nores.png">
        <p>暂无数据</p>
      </div>
    </div>
    <!-- <div v-show="shadeBox"
         @touchmove.prevent
         class="shadeBox"></div> -->
  </div>
</template>
<script>
import AppHeader from '@/components/appHead'
import context from '@/service'
import { InfiniteScroll, Toast } from 'mint-ui'
export default {
  name: 'building',
  components: { AppHeader, InfiniteScroll },
  data () {
    return {
      title: '楼宇',
      projectManagementList: [],
      industryList: [{ text: '全部', value: '' }, { text: '使用中', value: 'USING', checked: true }, { text: '已停用', value: 'DISABLE' }],
      currentIndustry: [{ text: '使用中', value: 'USING' }, { text: '已停用', value: 'DISABLE' }],
      shadeBox: false,
      focus: false,
      inputValue: '',
      page: 0,
      size: 10,
      loadBottom: false,
      tableData: {
        buildingListDTOS: []
      },
      thisProjectZcObj: {},
      dataReady: false,
      loadAll: false,
      flag: true,
      showbillmore: false,
      activeIndustry: 0,
      projectId: null,
      organizeId: null,
      useStatus: 'USING'
    }
  },
  activated () {
    if (!this.$route.meta.isBack) {
      Object.assign(this.$data, this.$options.data())
      this.projectId = this.$route.query.projectId
      this.organizeId = this.$route.query.organizeId
      if (this.$route.query.useStatus) {
        this.useStatus = this.$route.query.useStatus
        this.activeIndustry = this.useStatus === 'USING' ? 0 : 1
      }
      this.query()
      this.thisProjectZc()
    } else {
      if (sessionStorage.getItem('loadBottom')) {
        sessionStorage.getItem('loadBottom') === 'false' ? this.loadBottom = false : this.loadBottom = true
      }
      sessionStorage.removeItem('loadBottom')
    }
  },
  deactivated () {
    this.loadBottom = true
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'buildingDetail') {
      from.meta.isBack = true
    } else {
      from.meta.isBack = false
    }
    next()
  },
  mounted () {
  },
  methods: {
    statusHandler (item, index) {
      this.activeIndustry = index
      this.useStatus = item.value
      this.page = 0
      this.tableData = {
        buildingListDTOS: []
      }
      this.query()
      this.thisProjectZc()
    },
    selectProject (i, item) {
      let list = this.projectManagementList
      list[i].checked = !list[i].checked
      const checkedLength = list.filter(item => item.checked).length
      // this.projectManagementList = this.checkedFormat(i, this.projectManagementList)
    },
    selectIndustry (i, item) {
      let list = this.industryList
      if (!item.checked) {
        list = this.checkedFormat(i, list)
      }
      this.industryList = []
      this.industryList = list
    },
    async query () {
      this.dataReady = false
      this.loadAll = false
      this.searchTag = true
      let result = await context.http.get('cms/api/buildings', {
        useStatus: this.useStatus,
        organizeId: this.organizeId,
        projectId: this.projectId,
        next: true,
        page: this.page,
        size: this.size })
      if (result.status === 200) {
        this.dataReady = true
        this.tableData.buildingListDTOS = this.tableData.buildingListDTOS.concat(result.data.buildingListDTOS)
        if (this.tableData.buildingListDTOS.length === Number(result.headers['x-total-count'])) this.loadAll = true
        if (result.data.buildingListDTOS.length > 0) {
          this.loadBottom = false
          this.page = this.page + 1
        } else {
          this.page = this.page - 1
        }
        this.searchTag = false
      }
    },
    async submit () {
      this.page = 0
      this.tableData = {
        buildingListDTOS: []
      }
      this.query()
    },
    compositions (flag) {
      this.flag = flag
    },
    formatArea (row) {
      let type = row.assetsType
      let total = 0
      if (type === 'BUILDING' && (row.downArea || row.upArea)) {
        let downArea = Number(row.downArea)
        let upArea = Number(row.upArea)
        total = downArea + upArea
        total = total.toFixed(2) + '㎡'
      } else if (type === 'FIELD') {
        let buildingArea = Number(row.buildingArea)
        total = buildingArea.toFixed(2) + '㎡'
      } else if (type === 'LAND') {
        let buildingArea = Number(row.buildingArea)
        total = buildingArea.toFixed(2) + '亩'
      }
      return total
    },
    onKeyInput (event) { // 输入
      if (event.keyCode !== 13 && this.flag) {
        this.shadeBox = false
        this.page = 0
        this.tableData = {
          buildingListDTOS: []
        }
        this.$nextTick(() => {
          this.query()
        })
      }
    },
    inputFocus () { // 获取焦点
      this.focus = true
      this.shadeBox = true
    },
    search (event) { // 键盘完成事件
      if (event.keyCode === 13) {
        event.preventDefault() // 禁止默认事件（默认是换行）
        this.inputValue = event.target.value
        this.page = 0
        this.tableData = {
          buildingListDTOS: []
        }
        if (!this.searchTag) this.query()
      }
    },
    toContacts () { // 取消
      this.focus = false
      this.shadeBox = false
      this.inputValue = ''
      this.page = 0
      this.tableData = {
        buildingListDTOS: []
      }
      this.query()
    },
    loadMore () {
      this.loadBottom = true
      this.query()
    },
    checkedFormat (i, arr) {
      arr = arr.map(item => {
        item.checked = false
        return item
      })
      arr[i].checked = true
      return arr
    },
    checkedFormat2 (arr) {
      arr = arr.map(item => {
        item.checked = false
        return item
      })
      return arr
    },
    filterAssetsType (type) {
      let value
      if (type === 'BUILDING') {
        value = '楼宇'
      } else if (type === 'FIELD') {
        value = '场地'
      } else if (type === 'LAND') {
        value = '土地'
      }
      return value
    },
    async thisProjectZc () {
      let result = await context.http.get('cms/api/stat/thisProjectZc', {
        UseStatus: this.useStatus,
        id: this.projectId })
      if (result.status === 200) {
        this.thisProjectZcObj = result.data
      }
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    toBuildingDetails (item) {
      // if (!this.hasAuthority('02010102')) {
      //   Toast({
      //     message: '你的账号没有查看项目信息的权限',
      //     position: 'top'
      //   })
      //   return
      // }
      sessionStorage.setItem('loadBottom', this.loadBottom)
      this.$router.push({name: 'buildingDetails', query: {id: item.id, useStatus: this.useStatus}})
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
.building{
  .noData{
    position: relative;
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
  .title{
    width:100%;
    position: fixed;
    left:0;
    top:rem(40);
    height:rem(28);
    line-height: rem(28);
    font-size: rem(13);
    color:#444547;
    z-index: 1;
    background: #fff;
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
      margin-left:rem(15);
      padding-right: rem(10);
      >span{
        line-height: rem(16);
        margin-right:rem(20);
      }
      >span:last-child{
        margin-right:rem(15);
      }
      &.active{
        color: #3575F6;
      }
    }
    >span:last-child{
      border-right: 0;
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
    .title{
      top:rem(50);
    }
    .container {
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
  .container{
    padding-top:rem(70);
    .list{
      li{
        padding: rem(10) rem(14);
        position: relative;
        background: #fff;
        display: flex;
        border-bottom: 1px solid #f3f3f3;
        .project-img{
          width: 62%;
          height: rem(50);
          img {
            width: 100%;
            height: 100%;
            border-radius: rem(2);
          }
        }
        .project-center{
          margin-left: rem(14);
          width: 34%;
          .pj-title{
            display: flex;
            justify-content: space-between;
            margin-top: rem(5);
            padding-bottom: 0 !important;
            font-size: rem(14) !important;
            font-weight: 500 !important;
            >span {
              &:first-child {
                color:#18191A;
                font-size: rem(17);
                font-weight: bold;
              }
              // &:last-child {
              //   color: #858C94;
              //   span {
              //     color: #18191A;
              //   }
              // }
            }
          }
        }
        >div{
          >p{
            line-height: rem(15);
            margin-top: rem(5);
            font-size: rem(14);
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &.nav{
              display: flex;
              align-items: center;
              width: rem(230);
              overflow: hidden;
              background: #EFF6FF;
              >span{
                display: inline-block;
                padding: rem(3) rem(6);
                color:#0139A4;
                border-radius: rem(1);
                font-size: rem(13);
                &:first-child{
                  min-width: rem(93);
                }
              }
              .dividing-line {
                margin: 0!important;
              }
            }
            &.nav-bottom{
              display: flex;
              align-items: center;
              width: rem(230);
              overflow: hidden;
              >span{
                display: inline-block;
                color:#858C94;
                border-radius: rem(1);
                font-size: rem(13);
                span {
                  color: #18191A;
                }
              }
              .dividing-line {
                margin: 0 rem(6) 0 rem(16);
                border-right: rem(1) solid #D8D8D8;
              }
            }
            .dividing-line{
              height: rem(12);
              padding: 0!important;
              border-right: rem(1) solid #0139A4;
            }
          }
          >p:first-child{
            padding-bottom: rem(10);
            font-size: rem(15);
            font-weight: bolder;
          }
        }
        >span{
          position: absolute;
          right:rem(10);
          top:rem(40);
          font-size: rem(17);
          color:#C6C6C6;
        }
      }
    }
  }
  .building-statistics{
    background: #FFFFFF;
    padding: rem(16) rem(14) 0;
    margin-bottom: rem(10);
    .bs-head {
      display: flex;
      justify-content: space-between;
      .bsh-title{
        font-size: rem(17);
        font-weight: bold;
      }
      .bsh-quantity{
        font-size: rem(14);
        color: #858C94;
        span{
          color: #18191A;
          font-weight: bold;
        }
      }
    }
  }
  .bs-content{
    display: flex;
    flex-wrap: wrap;
    margin-top: rem(14);
    height: rem(55);
    overflow: hidden;
    .bsc-item{
      width: 29%;
      margin-right: rem(5);
      margin-bottom: rem(20);
      border-right: rem(1) solid #EAEAEA;
      p {
        font-size: rem(14);
        &:first-child{
          color: #858C94;
          margin-bottom: rem(6);
        }
        &:last-child {
          color: #18191A;
          font-weight: bold;
        }
      }
      &:last-child {
        border-right: none;
      }
      &:nth-of-type(3n) {
        width: rem(132);
        border-right: none;
        margin-right: 0;
      }
    }
  }
  .showmore {
    transform: rotate(180deg);
    transform-origin: center center;
  }
  .completeH {
    height: auto;
  }
}
</style>
