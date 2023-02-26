<template>
  <div class="loop"
       :class="{'focus':focus}"
       v-if="hasAuthority('03080106')">
    <div class="seachInput">
      <form @submit.prevent
            action="#">
        <input class="input"
               id="seachInput"
               results="5"
               placeholder="搜索回路名称/说明"
               focus
               type="search"
               @input="onKeyInput"
               @compositionstart="compositions(false)"
               @compositionend="compositions(true)"
               @focus="inputFocus"
               @keyup.13="onKeyInput"
               @keypress="search"
               v-model="searchname" />
        <!-- @focus="inputFocus" -->
      </form>
      <i class="mintui mintui-search"></i>
    </div>
    <div class="container">
      <mt-loadmore ref="loadmore"
                   :bottom-method="loadBottom"
                   :autoFill="false"
                   :bottom-all-loaded="allLoaded">
        <ul class="floor_list">
          <li v-for="item in loopData"
              :key="item.id">
            <div class="floor_left">
              <img v-if='item.imgurls && item.imgurls[0]'
                   :src="checkItem(item.imgurls[0])"
                   @click="showImg(item.imgurls, 0)" />
              <img v-else
                   src="../../../../../assets/berth-default1.png">
            </div>
            <div class="floor_right"
                 @click="toLoopDetails(item.id)">
              <p>
                <span :class="
                  item.loopType == 'NORMAL' ? 'shopNb NORMAL' : 'shopNb Exception'">{{item.name}}</span>
              </p>
              <div>
                <span class="dingwe"><i class="iconfont icondingwei2x font"></i> <span v-if="item.lightingGatewayName">{{item.lightingGatewayName}}</span> <span v-if="item.interfaces && item.lightingGatewayName">-</span> <span v-if="item.interfaces">{{item.interfaces}}</span></span>
                <span class="quyue"
                      v-if="item.lightingGroupName">{{item.lightingGroupName}}</span>
              </div>
            </div>
            <van-switch :value="item.onOff"
                        size="18"
                        active-color="#0139A4"
                        @change="changeOnOff(item, item.onOff)" />
          </li>
        </ul>
      </mt-loadmore>
      <div class="noData"
           v-if="!loopData.length && dataReady">
        <img src="../../../../../assets/nores.png" />
        <p>暂无数据</p>
      </div>
    </div>
    <!-- <div v-show="shadeBox"
         @touchmove.prevent
         class="shadeBox"></div> -->
    <div class="loadAll"
         v-if="loopData.length !== 0 && allLoaded">
      <span>-</span>
      <p>已经到底了</p>
      <span>-</span>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Common from '@/utils/common'
import context from '@/service'
import { ImagePreview } from 'vant'
Vue.use(ImagePreview)
const allFloorsObj = {
  id: '',
  name: '全部楼',
  checked: true
}
export default {
  name: 'loop',
  footVisible: true,
  data () {
    return {
      shadeBox: false,
      focus: false,
      floorId: null,
      loopType: '',
      searchname: '',
      allLoaded: false,
      allTotal: 0,
      normalTotal: 0,
      errorTotal: 0,
      currentPage: 1,
      pgNum: 1,
      total: 0,
      pgSize: 15,
      dataReady: false,
      loopData: [],
      buildingList: [],
      currentfloors: {},
      projectManagementList: [],
      errorFloorList: [],
      currentProject: {
        projectManagementName: '',
        projectManagementId: null,
        // buildingName: '',
        // buildingId: null,
        onOff: '',
        lightingGroupName: '',
        lightingGroupId: null
      },
      currentBuilding: {},
      floorChartArr: [],
      currentFloor: [],
      flag: true,
      checked: false
    }
  },
  props: {
    scrollVal: {
      type: Number,
      default: 0
    },
    config: {
      type: Object,
      default: {}
    },
    filter: {
      type: Object,
      default: {}
    }
  },
  activated () {
  },
  beforeRouteLeave (to, from, next) {
    next()
  },
  created () {
    if (this.filter.projectManagementId) {
      this.currentProject.projectManagementId = this.filter.projectManagementId
      this.currentProject.lightingGroupId = this.filter.groupKey
      this.currentProject.onOff = this.filter.onOffKey
      this.query()
    } else {
      this.queryProjectManagement()
    }
  },
  mounted () {
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    init () {
      this.currentPage = 1
      this.allLoaded = false
    },
    // 筛选更新列表方法
    filterUpdate () {
      this.currentProject.projectManagementName = this.filter.projectManagementName
      this.currentProject.projectManagementId = this.filter.projectManagementId
      this.currentProject.lightingGroupId = this.filter.groupKey
      this.currentProject.lightingGroupName = this.filter.grouplabel
      this.currentProject.onOff = this.filter.onOffKey
      this.init()
      this.loopData = []
      this.query()
    },
    onKeyInput (event) { // 输入
      if (event.keyCode !== 13 && this.flag) {
        this.init()
        this.loopData = []
        this.$nextTick(() => {
          this.query(true)
        })
      }
    },
    inputFocus () { // 获取焦点
      this.focus = true
    },
    search (event) { // 键盘完成事件
      if (event.keyCode === 13) {
        event.preventDefault() // 禁止默认事件（默认是换行）
        this.searchname = event.target.value
        this.init()
        this.loopData = []
        this.$nextTick(() => {
          this.query(true)
        })
      }
    },
    compositions (flag) {
      this.flag = flag
    },
    query (flag) {
      this.dataReady = false
      // this.searchTag = true
      if (flag) this.currentPage = 1; this.allLoaded = false
      context.http.get('rms/api/lightingLoop', {
        lightingGroupId: this.currentProject.lightingGroupId,
        projectManagementId: this.currentProject.projectManagementId,
        name: this.searchname,
        remark: this.searchname,
        page: (this.currentPage - 1),
        onOff: this.currentProject.onOff,
        sort: 'createdDate,desc',
        size: this.pgSize
      }).then(res => {
        this.dataReady = true
        if (res.status === 200) {
          if (flag) {
            this.loopData = res.data
          } else {
            this.loopData = this.loopData.concat(res.data)
          }
          this.total = Number(res.headers['x-total-count'])
          // this.allTotal = Number(res.headers['lighting-total'])
          // this.normalTotal = Number(res.headers['lighting-normal'])
          // this.errorTotal = Number(res.headers['lighting-error'])
          if (this.currentPage === Math.ceil(this.total / this.pgSize) || this.currentPage > Math.ceil(this.total / this.pgSize)) {
            this.allLoaded = true// 若数据已全部获取完毕
            console.log('全部获取完毕')
          }
          // this.searchTag = false
        }
      })
    },
    loadBottom () {
      this.currentPage++
      this.query()
      this.$refs.loadmore.onBottomLoaded()
    },
    async queryProjectManagement () { // 项目
      context.http.get('cms/api/project-managements', { useStatus: 'USING' }).then(res => {
        if (res.status === 200) {
          this.projectManagementList = res.data
          this.currentProject.projectManagementName = this.projectManagementList[0].referred
          this.currentProject.projectManagementId = this.projectManagementList[0].id
          this.query()
        }
      })
    },
    async getGroup () {
      console.log('获取群组')
    },
    toContacts () { // 取消
      this.focus = false
      this.shadeBox = false
      this.searchname = ''
      this.currentPage = 0
      this.loopData = []
      this.query()
    },
    checkItem (item) {
      const imageRatio = Common.imageRatio(375)
      let paramTxt = `?x-oss-process=image/resize,w_${imageRatio.width},m_fixed` // 图片链接参数  防止安卓手机图片旋转
      // let arrObj = []
      // let arr = []
      // let Type
      // imgArr.forEach((v, i) => {
      //   let index = v.lastIndexOf('.')
      //   let type = v.substr(index + 1).toLowerCase()
      //   if (type === 'jpg' || type === 'jpeg' || type === 'png') {
      //     arrObj.push({ annexURL: v, index: i })
      //   }
      // })
      // arrObj.forEach((v, i) => {
      //   if (index === v.index) {
      //     index = i
      //   }
      //   arr.push(v.annexURL + paramTxt)
      // })
      return item + paramTxt
    },
    // showImg (imgArr, index) {
    //   let arr = imgArr.map((item, index) => {
    //     let i = item.lastIndexOf('.')
    //     let str = item.substring(i + 1, item.length)
    //     str.toLowerCase()
    //     return item
    //   })
    //   ImagePreview({
    //     images: arr,
    //     startPosition: index
    //   })
    // },
    showImg (imgArr, index) {
      const imageRatio = Common.imageRatio(375)
      let paramTxt = `?x-oss-process=image/resize,w_${imageRatio.width},m_fixed` // 图片链接参数  防止安卓手机图片旋转
      let arrObj = []
      let arr = []
      let Type
      imgArr.forEach((v, i) => {
        let index = v.lastIndexOf('.')
        let type = v.substr(index + 1).toLowerCase()
        if (type === 'jpg' || type === 'jpeg' || type === 'png') {
          arrObj.push({ annexURL: v, index: i })
        }
      })
      arrObj.forEach((v, i) => {
        if (index === v.index) {
          index = i
        }
        arr.push(v.annexURL + paramTxt)
      })
      if (!Type) {
        ImagePreview({
          images: arr,
          startPosition: index
        })
      }
    },
    async changeOnOff (item, onOff) {
      item.onOff = !item.onOff
      await context.http.put('rms/api/lightingLoop/onOff', item).then(res => {
        if (res.status === 200) {
          // this.$toast({
          //   message: `回路修改成功`,
          //   duration: 1.5,
          //   position: 'top'
          // })
          // this.init()
          // this.loopData = []
          // this.query()
        }
      }).catch(error => {
        console.log(error)
        item.onOff = !item.onOff
        // this.$toast({
        //   message: `修改失败请重试`,
        //   duration: 1.5,
        //   position: 'top'
        // })
      })
    },
    toLoopDetails (id) {
      if (!this.hasAuthority('03080109')) {
        this.$toast({
          message: '你的账号没有查看回路信息的权限',
          position: 'top'
        })
        return
      }
      window.sessionStorage.setItem('scrollVal', this.scrollVal)
      window.sessionStorage.setItem('loopId', id)
      this.$router.push({ name: 'detailsLoop' })
    },
    changeFloor (index, item) {
      this.currentFloor = this.checkedFormat(index, this.currentFloor)
      // this.floorId = item.id
      this.loopData = []
      this.query()
    },
    filterFloor (id) {
      this.errorFloorList.some(item => {
        return item === id
      })
    },
    checkedFormat (i, arr) {
      arr = arr.map(item => {
        item.checked = false
        return item
      })
      arr[i].checked = true
      return arr
    }
  }
}
</script>
<style scoped lang="scss" >
@import "../../../../../style/config.scss";
.loop {
  &.focus {
    .input {
      // width: rem(300) !important;
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
  // background: #ffffff;
  min-height: 100%;
  box-sizing: border-box;
  &.showMore {
    .totalInfo {
      height: rem(360);
    }
    .buildingTab {
      top: rem(108);
    }
    .container {
      background-color: #fff;
      padding-top: rem(480);
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
      padding: 0 rem(15);
      > .item {
        width: 31%;
        height: rem(40);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-bottom: rem(30);
        border-right: rem(1) solid #eaeaea;
        padding-left: rem(10);
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
      margin-right: rem(20);
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
    top: rem(108);
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
      position: relative;
      &.active {
        font-weight: 600;
        color: #0139a4;
        background: rgba(243, 247, 255, 1);
        box-shadow: 0px rem(1) rem(4) 0px #c7d9ff;
      }
      .error:after {
        content: "";
        background-color: red;
        position: absolute;
        height: rem(6);
        width: rem(6);
        border-radius: 50%;
        top: rem(0);
        right: rem(0);
      }
    }
  }
  .seachInput {
    top: rem(108);
    height: rem(50);
    width: 100%;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    padding: 0 rem(15);
    position: fixed;
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
  .totalTab {
    width: 100%;
    padding: 0 rem(10);
    // padding-left: rem(10);
    height: rem(70);
    display: flex;
    align-items: center;
    position: fixed;
    z-index: 9;
    left: 0;
    top: rem(158);
    background: #fff;
    // overflow-x: auto;
    // overflow-y: hidden;
    li {
      padding: 0 rem(26);
      width: auto;
      line-height: rem(46);
      height: rem(46);
      white-space: nowrap;
      flex-basis: rem(0);
      flex-shrink: 0;
      font-size: rem(15);
      color: #ffffff;
      box-shadow: 0px 1px 4px 0px #d9d9d9;
      border-radius: rem(4);
      margin-right: rem(10);
    }
    li:nth-child(1) {
      background-color: #399cff;
    }
    li:nth-child(2) {
      background-color: #00d694;
    }
    li:nth-child(3) {
      background-color: #ff8a8a;
    }
  }
  .loadAll {
    margin-top: rem(10);
  }
  .container {
    .noData {
      height: calc(100vh - rem(158));
    }
    // top: rem(328);
    padding-top: rem(38);
    .floor_list {
      padding: 0 rem(10);
      position: relative;
      // min-height: rem(300);
      background-color: #fff;
      li {
        display: flex;
        padding: rem(15) 0;
        border-bottom: rem(1) solid #f0f0f0;
        align-items: center;
        position: relative;
        > .iconfont {
          font-size: rem(20);
          color: #c6c6c6;
          position: absolute;
          right: rem(10);
          top: 50%;
          transform: translateY(-50%);
        }
        .floor_left {
          img {
            width: rem(60);
            height: rem(60);
            border-radius: rem(4);
          }
          text-align: center;
          // line-height: rem(60);
          color: #fff;
          font-size: rem(12);
          margin-right: rem(14);
        }
        .floor_right {
          flex: 1;
          position: relative;
          p {
            .NORMAL::after {
              content: "正常";
              margin-left: rem(10);
              background: #effffb;
              padding: rem(3);
              font-size: rem(12);
              color: #1cc296;
            }
            .Exception::after {
              content: "异常";
              margin-left: rem(10);
              background: #fff3f3;
              padding: rem(3);
              font-size: rem(12);
              color: #fc5159;
            }
            &:first-child {
              margin-bottom: rem(7);
              height: rem(20);
              justify-content: space-between;
              display: flex;
              padding-right: rem(15);
              font-weight: bold;
              color: #18191a;
              span {
                display: block;
                width: rem(180);
                line-height: rem(20);
                color: #18191a;
                font-weight: 600;
                font-size: rem(15);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
          > div {
            height: rem(20);
            font-size: rem(14);
            color: #858c94;
            position: relative;
            .icondingwei2x {
              font-size: rem(14);
            }
            .dingwe {
              position: absolute;
              // left: rem(0);
              max-width: rem(148);
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .quyue {
              position: absolute;
              left: rem(150);
              // margin-left: rem(6);
              max-width: rem(90);
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
        .van-switch {
          font-size: rem(18) !important;
          margin-right: rem(6);
        }
      }
      li:last-child {
        border-bottom: 0;
      }
    }
  }
}
</style>
