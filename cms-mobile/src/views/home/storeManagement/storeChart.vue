
<template>
  <div class="contentChart"
       @click.stop="closeTpis"
       ref="content">
    <div class="selectResult"
         @click="showVanpopup">
      <span>{{currentOrganize.name}}</span>
      <span>{{currentProject.referred}}</span>
      <span>{{currentBuilding.buildingName}}</span>
      <span>{{currentfloors.name}}</span>
    </div>
    <div class="planTip">提示：双击房源进入详情、长按预览租户信息</div>
    <div class="finger"
         id="svgBox"
         ref="svgBox"
         :style="{transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale3d(${scale}, ${scale}, 1)`}"
         v-finger:pinch="pinchHandler"
         v-finger:press-move="pressMoveHandler"
         v-finger:multipoint-start="multipointStartHandler"
         v-finger:rotate="rotateHandler"
         v-finger:tap="tapHandler"
         v-finger:multipoint-end="multipointEndHandler"
         v-finger:double-tap="doubleTapHandler"
         v-finger:long-tap="longTapHandler"
         v-finger:swipe="swipeHandler"
         v-finger:single-tap="singleTapHandler"
         v-html="svg"
         v-if="svg">
      <!-- <img src="../../../assets/logo.png"> -->
    </div>
    <div class="empty"
         v-else>暂无平面图</div>
    <!-- 房源详情TIPs -->
    <div class="showBox"
         :class="[svgListInfo.noTenantRooms.length?'noTenant':'tenants']"
         id="showBox"
         v-show="showBox">
      <i class="iconfont iconcms_guanbi"
         @click.stop="closeTpis"></i>
      <div v-for="item in svgListInfo.tenants"
           style="margin-bottom:10px"
           :key="item.id">
        <p class="title">{{shopNumberFormatter(item.roomsList)}}</p>
        <p><span>客户：</span><span>{{item.referred}}</span></p>
        <p><span>面积：</span><span>{{setArea(item.roomsList)}}m²</span></p>
        <p><span>实时单价：</span><span>{{formatContractPrice(item.contractPrice, 'M2DAYS')}}</span></p>
        <!-- <p><span>当月营业额：</span><span>{{20000|toLocaleString}}</span></p>
        <p><span>实时租金：</span><span>{{20000|toLocaleString}}</span></p> -->
      </div>

      <div v-for="item in svgListInfo.noTenantRooms"
           style="margin-bottom:10px"
           :key="item.id">
        <i class="iconfont iconcms_guanbi"
           @click.stop="closeTpis"></i>
        <p class="title">{{item.shopNumber}}</p>
        <p><span>面积：</span><span>{{item.buildingArea}}m²</span></p>
        <p><span>招商指导价：</span> <span>{{formatContractPrice(item.expectedUnitPrice, item.priceUnit)}}</span></p>
      </div>
    </div>
    <!-- 右侧筛选 -->
    <van-popup v-model="popupShowChart"
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
        <div class="popup_list">
          <p>楼层</p>
          <ul>
            <li v-for="(item, index) in floorsList"
                :key="item.id"
                @click="selectfloors(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="popup_buttons">
        <div @click="submitChart('reset')"
             class="popup_default">重置</div>
        <div @click="submitChart"
             class="popup_active">确定</div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import context from '@/service'
export default {
  name: 'storeChart',
  components: {

  },
  props: {
    index: {
    }
  },
  watch: {
    index: function () {
      this.$nextTick(() => {
        if (this.index === 0) {
          this.initChart()
          // this.queryProjectManagement()
          this.getOrganizes()
        }
      })
    },
    popupShowChart: function () {
      this.$emit('headShow', this.popupShowChart)
      console.log(this.popupShowChart)
    }
  },
  data () {
    return {
      svgListInfo: {
        tenants: [],
        noTenantRooms: []
      },
      showBox: false,
      popupShowChart: false,
      projectManagementList: [],
      organizesList: [],
      buildingList: [],
      floorsList: [],
      currentOrganize: {},
      currentProject: {},
      currentBuilding: {},
      currentfloors: {},
      initScale: 1,
      deltaX: 0,
      deltaY: 0,
      scale: 1,
      svg: '',
      svgList: [],
      defaultScale: 1,
      projectManagementId: 13,
      buildingId: {},
      floorId: '1层',
      lastTag: null,
      planeType: 'FLOOR' //  平面图类型
    }
  },
  created () {

  },
  mounted () {
    this.$nextTick(() => {

    })
  },
  methods: {
    closeTpis () {
      this.showBox = false
    },
    initStoreChart () {
      this.initChart()
      this.getOrganizes()
    },
    setArea (val) {
      // console.log(val)
      let count = 0
      val.forEach(item => {
        if (item.buildingArea) {
          count += item.buildingArea
        }
      })
      return count.toFixed(2)
    },
    shopNumberFormatter (shopNumList) {
      let str = ''
      shopNumList.forEach((item, index) => {
        str += item.shopNumber + '、'
      })
      return str.substring(0, str.length - 1)
    },
    formatContractPrice (price, val) {
      let priceUnit
      let priceNum = price || 0
      if (val === 'M2DAYS') {
        priceUnit = '元/㎡天'
      } else if (val === 'M2MONTH') {
        priceUnit = '元/㎡月'
      } else if (val === 'DAY') {
        priceUnit = '元/天'
      } else if (val === 'MONTH') {
        priceUnit = '元/月'
      }
      return priceNum.toFixed(2) + priceUnit
      // return priceNum + priceUnit
    },
    async showVanpopup () {
      if (!this.currentProject.id) {
        this.popupShowChart = !this.popupShowChart
        return
      }
      // 项目
      this.projectManagementList = this.projectManagementList.map(item => {
        item.checked = false
        if (item.id === this.currentProject.id) item.checked = true
        return item
      })
      // 楼宇
      if (this.currentBuilding && this.currentBuilding.id) {
        this.buildingList = this.buildingList.map(item => {
          item.checked = false
          if (item.id === this.currentBuilding.id) item.checked = true
          return item
        })
      } else {
        this.buildingList[0].checked = true
      }
      // 楼层
      if (this.currentfloors && this.currentfloors.id) {
        this.floorsList = this.floorsList.map(item => {
          item.checked = false
          if (item.id === this.currentfloors.id) item.checked = true
          return item
        })
      }
      this.popupShowChart = !this.popupShowChart
    },
    async getOrganizes (reset) { // 管理企业获取接口
      let res = await context.http.get('uaa/api/organizes/enterprise/user', { useStatus: 'USING', organizeType: 'ENTERPRISE' })
      this.organizesList = res.data
      if (this.organizesList && this.organizesList[0]) {
        this.organizesList[0].checked = true
        this.currentOrganize = this.organizesList[0]
      }
      if (this.$route.params && this.$route.params.organizeId) {
        let temp
        this.organizesList.map((item, index) => {
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
    async organizesChange (reset) { // 管理企业查名下项目
      let id = this.currentOrganize.id ? this.currentOrganize.id : ''
      let res = await context.http.get('cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: id })
      if (res.data && res.data.length) {
        this.projectManagementList = res.data
        if (this.projectManagementList && this.projectManagementList[0]) {
          this.projectManagementList[0].checked = true
          this.currentProject = this.projectManagementList[0]
        }
        if (this.$route.params && this.$route.params.projectManagementId) {
          let temp
          this.projectManagementList.map((item, index) => {
            if (item.id === this.$route.params.projectManagementId) {
              temp = index
            }
          })
          if (temp) {
            this.currentProject = this.projectManagementList[temp]
            this.projectManagementList[0].checked = false
            this.projectManagementList[temp].checked = true
          }
        }
        this.getBuliding(reset)
      }
    },
    async queryProjectManagement (reset) {
      const res = await context.http.get('cms/api/project-managements', { useStatus: 'USING' })
      res.data[0].checked = true
      this.projectManagementList = res.data
      this.currentProject = res.data[0]
      this.getBuliding(reset)
    },
    async getBuliding (reset) { // 楼宇
      let result = await context.http.get(`cms/api/project/${this.currentProject.id}/buildings`, { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING' })
      result.data.unshift({ id: '', buildingName: '层平面图', checked: true })
      // if (result.data[0]) result.data[0].checked = true
      this.buildingList = result.data
      this.currentBuilding = result.data[0] ? result.data[0] : {}
      this.getFloorList(reset)
    },
    async getFloorList (reset) {
      let result = await context.http.get('cms/api/floors/svg', { projectManagementId: this.currentProject.id, buildingId: this.currentBuilding.id })
      let filterArr = result.data.filter((item, index) => {
        return item.name === '1' || item.name === '一层' || item.name === '一' || item.name === '1层'
      })
      this.currentfloors = filterArr[filterArr.length - 1] || {}
      this.floorsList = result.data.map((item, index) => {
        if (item.name === this.currentfloors.name) {
          item.checked = true
        }
        return item
      })
      this.query(reset)
    },
    async selectOrganizes (index, item) {
      this.organizesList = this.checkedFormat(index, this.organizesList)
      this.currentOrganize = this.organizesList[index]
      this.organizesChange()
    },
    async selectProject (index, item) {
      this.projectManagementList = this.checkedFormat(index, this.projectManagementList)
      this.currentProject = this.projectManagementList[index]
      this.getBuliding()
    },
    async selectBuilding (index, item) {
      this.buildingList = this.checkedFormat(index, this.buildingList)
      let result = await context.http.get('cms/api/floors/svg', { projectManagementId: this.currentProject.id, buildingId: item.id })
      if (result.data[0]) result.data[0].checked = true
      this.floorsList = result.data
    },
    selectfloors (index, item) {
      this.floorsList = this.checkedFormat(index, this.floorsList)
    },
    checkedFormat (i, arr) {
      arr = arr.map(item => {
        item.checked = false
        return item
      })
      arr[i].checked = true
      return arr
    },
    async submitChart (state) {
      if (state === 'reset') {
        if (!this.projectManagementList.length) return
        // this.queryProjectManagement('reset')
        this.getOrganizes('reset')
        // this.projectManagementList = this.checkedFormat(0, this.projectManagementList)
        // this.buildingList = this.checkedFormat(0, this.buildingList)
        // this.floorsList = []
      } else {
        if (!this.projectManagementList.length) {
          this.popupShowChart = false
          return
        }
        this.currentProject = this.projectManagementList.filter(item => item.checked)[0]
        this.currentBuilding = this.buildingList.filter(item => item.checked)[0]
        this.currentfloors = this.floorsList.filter(item => item.checked)[0]
        this.query()
        this.popupShowChart = false
      }
    },
    initChart () {
      this.initScale = 1
      this.deltaX = 1
      this.deltaY = 1
      this.scale = 1
    },
    query (reset) {
      if (reset === 'reset') return
      if (this.currentBuilding.id) {
        this.planeType = 'BUILDING'
      } else {
        this.planeType = 'FLOOR'
      }
      let floorId = null
      if (this.currentfloors) {
        floorId = this.currentfloors.name
      }
      this.showBox = false
      this.svg = ''
      this.svgList = []
      context.http.get(`cms/api/plan`,
        {
          planeType: this.planeType,
          planeStyle: 'ROOM',
          organizeId: this.currentOrganize.organizeId,
          projectManagementId: this.currentProject.id,
          buildingName: this.currentBuilding.id,
          floorName: floorId
        }
      ).then(res => {
        if (res.status === 200) {
          this.svg = res.data.svg
          this.svgList = res.data.svgList
          this.$nextTick(() => {
            this.renderSVG()
          })
        }
      })
    },
    renderSVG () { // 重新渲染svg
      // $("#svgHtml polygon[id^='svg_'],#svgHtml rect[id^='svg_'],#svgHtml path[id^='svg_']").attr('fill', '#ffffff') // 渲染默认填充白色 去掉text
      // $("#svgHtml text[id^='shopTextId_'],#svgHtml text[id^='shopNb_']").remove()
      let arr = this.svgList
      let eleId, shopTextId, x, y, y1, textArr, texts, referreds, shopTextDom, referredArr, referredDom
      arr.forEach(item => {
        eleId = item.svgId
        shopTextId = eleId.replace('svg', 'shopTextId')
        x = !item.svgx || item.svgx === 'null' ? $('#' + eleId).attr('data-x') : item.svgx
        y = !item.svgy || item.svgy === 'null' ? $('#' + eleId).attr('data-y') : item.svgy
        y1 = Number(y) + 15
        textArr = []// 房源名拼接
        referredArr = []// 品牌名拼接
        texts = ''
        referreds = ''
        item.list.forEach(list => {
          textArr.push(list.shopNumber)
          referredArr.push(list.referred)
        })
        texts = textArr.join('/')
        referreds = referredArr.join('/')
        texts = texts.length > 5 ? texts.substring(0, 5) + '...' : texts
        referreds = referreds.length > 5 ? referreds.substring(0, 5) + '...' : referreds
        shopTextDom = $('<text id="' + shopTextId + '"  x="' + x + '"  y="' + y + '" font-size="13px"  font-family="MicrosoftYaHei, Microsoft YaHei">' + texts + '</text>')
        referredDom = $('<text id="' + shopTextId + '_referred"  x="' + x + '"  y="' + y1 + '" font-size="13px"  font-family="MicrosoftYaHei, Microsoft YaHei">' + referreds + '</text>')
        let color = '#eeeeee'
        if (item.tenants.length) {
          color = item.tenants[0].industryDescription
        }
        $('#' + eleId).attr('fill', color)
        if ($('#' + shopTextId).length === 0) {
          $('#svgBox svg').find($('#' + eleId)).parent().append(shopTextDom)
          // $('#svgHtml svg').find($('#' + eleId)).parent().append(referredDom)   //根据测试要求 房源招租-房源平面图上只展示房源号
          // this.svgHtml = $('#svgHtml').html()
        }
      })
      this.svg = $('#svgBox').html()
      this.SVGAutoscale()
    },
    SVGAutoscale () {
      let w = window.screen.width
      let DIVw = w
      let DIVh = 300
      if (!$('#svgBox svg').attr('width') || !$('#svgBox svg').attr('height')) {
        $('#svgBox svg').attr('width', '1980')
        $('#svgBox svg').attr('height', '1080')
      }
      let svgW = parseInt($('#svgBox svg').attr('width'))
      let svgH = parseInt($('#svgBox svg').attr('height'))
      let defaultScale = 1
      if (svgW > DIVw) {
        defaultScale = DIVw / svgW
      }
      this.defaultScale = defaultScale
      $('#svgBox').css({
        'height': svgH * defaultScale,
        'overflow': 'inherit'
      })
      this.$nextTick(() => {
        $('#svgBox svg').css({
          'transform': `scale(${this.defaultScale})`,
          'transform-origin': '0 0 0'
        })
      })
    },
    pointStartHandler (e) {
      // 手指触摸屏幕触发
    },
    multipointStartHandler (e) {
      // 一个手指以上触摸屏幕触发
      this.initScale = this.scale
    },
    rotateHandler (evt) {
      // evt.angle代表两个手指旋转的角度
      console.log(evt.angle)
    },
    pinchHandler (evt) {
      // evt.scale代表两个手指缩放的比例
      if (evt.zoom * this.initScale > 3) {
        this.scale = 3
      } else {
        this.scale = evt.zoom * this.initScale
      }

      // this.defaultScale = this.scale * this.defaultScale
      if (this.scale < 0.8) {
        this.deltaX = 0
        this.deltaY = 0
      }
    },
    multipointEndHandler (e) {
      // 当手指离开，屏幕只剩一个手指或零个手指触发
      if (this.scale < 0.8 || this.scale === 0.8) {
        this.scale = 0.8
        this.deltaX = 0
        this.deltaY = 0
      }
    },
    pressMoveHandler (evt) {
      // evt.deltaX和evtdeltaY代表在屏幕上移动的距离
      this.deltaX += evt.deltaX
      this.deltaY += evt.deltaY
    },
    tapHandler (evt) {
      // 点按触发
    },
    doubleTapHandler (evt) {
      // 双击屏幕触发
      let self = evt.target
      if (self.tagName === 'path' || self.tagName === 'polygon' || self.tagName === 'rect') {
        // if (this.lastTag) {
        //   $(this.lastTag).attr({ 'stroke-width': $(self).attr('stroke-width'), 'stroke': '#000000' })
        // }
        // $(self).attr({ 'stroke-width': '2px', 'stroke': '#00ff00' })
        // this.lastTag = self
        for (var i = 0; i < this.svgList.length; i++) {
          if (self.id === this.svgList[i].svgId) {
            let id = this.svgList[i].list[0].id
            // this.storeDetailisShowFn(this.svgList[i].list[0].id)
            window.sessionStorage.setItem('scrollVal', this.scrollVal)
            this.$router.push({ name: 'storeDetails', params: { id: id } })
          }
        }
      }
    },
    longTapHandler (evt) {
      // 长按屏幕750ms触发
      let self = evt.target
      this.showBox = false
      if (self.tagName === 'path' || self.tagName === 'polygon' || self.tagName === 'rect') {
        // $(self).attr({ 'stroke-width': '2px', 'stroke': '#00ff00' })
        this.svgList.forEach(item => {
          if (self.id === item.svgId) {
            this.showBox = true
            this.svgListInfo = item
            console.log(this.svgListInfo)
          }
        })
      }
    },
    swipeHandler (evt) {
      // evt.direction代表滑动的方向
      // console.log('swipe' + evt.direction)
    },
    singleTapHandler (evt) {
      // 单击
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
* {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.contentChart {
  margin: rem(40) 0 0 0;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 11;
  .selectResult {
    top: rem(40);
  }
  .planTip {
    margin: rem(34) rem(14) rem(0) rem(0);
    float: right;
    color: #0139A4;
    font-size: rem(12);
    font-weight: 400;
  }
  .empty {
    margin-top: rem(100);
    position: absolute;
    width: 100%;
    text-align: center;
  }
  .test {
    width: 100%;
    min-height: 100px;
    position: fixed;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.65);
    color: #fff;
    height: 200px;
    overflow-y: auto;
  }
  .finger {
  }
  #svgBox {
    width: 100%;
    overflow: auto;
    height: 300px;
    margin-top: rem(100);
    border: 1px solid #eee;
    position: absolute;
  }
  .showBox {
    width: rem(230);
    background: rgba(0, 0, 0, 0.7);
    border-radius: rem(4);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    color: #ffffff;
    &.noTenant {
      height: rem(140);
    }
    &.tenants {
      height: rem(380);
      overflow-y: auto;
    }
    .iconfont {
      position: absolute;
      right: rem(10);
      top: rem(10);
    }
    > div {
      > p {
        height: rem(40);
        line-height: rem(40);
        &:not(.title) {
          display: flex;
          justify-content: space-between;
          padding: 0 rem(10);
        }
        &.title {
          margin: 0 rem(8);
          border-bottom: rem(1) solid #656873;
          font-size: 17px;
          font-weight: bold;
          text-align: center;
        }
      }
    }
  }
}
</style>
