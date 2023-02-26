<template>
  <div class="storeDetails"
       ref="storeDetails"
       :class="{'fixedYxTenantTab':fixedYxTenantTab}">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="onGoBack"></i>
      <div class="headTab">{{storeDetailsData.shopNumber}}</div>
      <div class="addBtn"></div>
    </div>
    <div class="img">
      <van-swipe class="my-swipe"
                 v-if="storeDetailsData.imgUrls&&storeDetailsData.imgUrls.length"
                 :loop="false"
                 indicator-color="white">
        <van-swipe-item v-for="(image, index) in storeDetailsData.imgUrls"
                        :key="index">
          <img :src="image"
               v-if="image&&!isVideo(image)"
               @click="showImg(storeDetailsData.imgUrls,index)">
          <img :src="videoPng"
               v-else-if="isVideo(image)"
               @click="videoShowFn(image)">
        </van-swipe-item>
      </van-swipe>
      <img src="../../../assets/berth-default.png"
           style="width: 100%;height: 100%;object-fit: cover;"
           v-else />
    </div>
    <div class="content common_list ">
      <div class="basicInfo">
        <div class="moduleTitle">基本信息</div>
        <div class="ul-warp">
          <div class="content-ul">
            <span>管理企业</span>
            <span>{{storeDetailsData.projectManagement.originalProjectName}}</span>
          </div>
          <div class="content-ul">
            <span>项目</span>
            <span>{{storeDetailsData.projectManagement.referred}}</span>
          </div>
          <div class="content-ul">
            <span>楼宇</span>
            <span>{{storeDetailsData.building.buildingName}}</span>
          </div>
          <div class="content-ul">
            <span>楼层</span>
            <span>{{storeDetailsData.floor.name}}</span>
          </div>
          <div class="content-ul">
            <span>房源号</span>
            <span>{{storeDetailsData.shopNumber}}</span>
          </div>
          <!-- <div class="content-ul">
            <span>房源平面图（点击可预览）</span>
            <span style="color:#3575F6"
                  @click="showRoomsImage(storeDetailsData.roomsImageUrl)">{{urlFormat(storeDetailsData.roomsImageName)}}</span>
          </div> -->
          <!-- <div class="content-ul"
               v-if="hshowmore">
            <span>所属省市区</span>
            <span>{{provinces}}</span>
          </div> -->
          <div class="content-ul"
               v-if="hshowmore">
            <span>建筑面积(m²)</span>
            <span v-if="storeDetailsData.buildingArea">{{storeDetailsData.buildingArea | toLocaleFixed}}</span>
            <span v-else>-</span>
          </div>
          <div class="content-ul"
               v-if="hshowmore">
            <span>使用面积(m²)</span>
            <span v-if="storeDetailsData.useArea">{{storeDetailsData.useArea}}</span>
            <span v-else>-</span>
          </div>
          <div class="content-ul"
               v-if="hshowmore">
            <span>地址</span>
            <span>{{storeDetailsData.address||'-'}}</span>
          </div>
          <div class="content-ul"
               v-if="hshowmore">
            <span>产权证编号</span>
            <span>{{storeDetailsData.productionCertificateNo}}</span>
          </div>
          <div class="content-ul"
               v-if="hshowmore">
            <span>招商指导价(元/m²·天)</span>
            <!-- <span>{{priceUnit(storeDetailsData.expectedUnitPrice, storeDetailsData.priceUnit)}}</span> -->
            <span>{{storeDetailsData.expectedUnitPrice}}</span>
          </div>
          <div class="content-ul"
               v-if="hshowmore">
            <span>联系人</span>
            <span>{{storeDetailsData.contact}}</span>
          </div>
          <div class="content-ul"
               v-if="hshowmore">
            <span>联系人电话</span>
            <span>{{storeDetailsData.telephone}}</span>
          </div>
          <!-- <div class="content-ul"
               v-if="hshowmore">
            <span>得房率</span>
            <span v-if="storeDetailsData.getRoomsRate">{{storeDetailsData.getRoomsRate}}%</span>
            <span v-else>{{storeDetailsData.getRoomsRate}}</span>
          </div> -->
          <!-- <div class="content-ul"
               v-if="hshowmore">
            <span>预期业态</span>
            <span>{{storeDetailsData.industryName}}</span>
          </div>
          <div class="content-ul"
               v-if="hshowmore">
            <span>房源类型</span>
            <span>{{investmentStatus(storeDetailsData.investmentStatus)}}</span>
          </div> -->
          <div class="content-ul"
               v-if="hshowmore">
            <span>状态</span>
            <span>{{useStatus(storeDetailsData.useStatus)}}</span>
          </div>
          <!-- <div class="content-ul"
               v-if="hshowmore">
            <span>客户名称</span>
            <span>{{storeDetailsData.tenantName}}</span>
          </div>
          <div class="content-ul"
               v-if="hshowmore">
            <span>租期</span>
            <span>{{storeDetailsData.contractStartDate}} - {{storeDetailsData.contractEndDate}}</span>
          </div>
          <div class="content-ul"
               v-if="hshowmore">
            <span>用途</span>
            <span>{{roomsUseStatus(storeDetailsData.roomsUse)}}</span>
          </div> -->
        </div>
        <div class="more-cion"
             :class="{'showmore': hshowmore}"
             @click="hshowmore = !hshowmore">
          <i class="iconfont iconcms_xia"></i>
        </div>
      </div>
      <!-- 工程条件 -->
      <div class="projectConditions">
        <div class="moduleTitle">工程条件</div>
        <div class="ul-warp"
             v-if="storeDetailsData.projectConditions.length>0">
          <div class="content-ul"
               v-for="(item,index) in storeDetailsData.projectConditions"
               :key="index">
            <span>{{item.name}}</span>
            <span>{{item.needValue||'-'}}<span v-if="item.needValue">{{item.unit}}</span></span>
          </div>
        </div>
        <div class="noData_text"
             v-if="storeDetailsData.projectConditions.length===0">暂无数据</div>
      </div>
      <!-- 跟进记录 -->
      <div class="records"
           ref="records">
        <!-- <div class="moduleTitle">跟进记录</div> -->
        <div class="moduleTitle">记录信息</div>
        <van-steps direction="vertical"
                   :active="0"
                   active-icon="none"
                   active-color="#18191A"
                   v-if="timeLineListData.length > 0">
          <van-step class="van-step"
                    v-for="(item, index) in timeLineListData"
                    v-show="index<5||hshowmore1"
                    :key="index">
            <div class="step-head">
              <span class="record-type_sapn">{{formatTimeLineTitle(item.followRecordType)}}</span>
              <span>{{item.followTime ? item.followTime.replace('T','  ') : ''}}</span>
            </div>
            <!-- <p>{{item.followName}}</p> -->
            <p class="recordsContent">
              <span>记录人：</span>
              <span>{{item.followName}}</span>
            </p>
            <p class="recordsContent">
              <span>记录内容：</span>
              <span v-html="formatreplace(item.followContent)"></span>
            </p>
            <div class="annex-warp"
                 v-if="item.annexes.length > 0">
              <div class="an-item"
                   v-for="(item2, index2) in item.annexes"
                   :key="index2">
                <div class="image">
                  <svg class="icon"
                       aria-hidden="true">
                    <use :xlink:href="pageGetformat(item2.annexName)"></use>
                  </svg>
                </div>
                <div class="annex-name">{{item2.annexName}}</div>
                <ailPreview :ailObj="item2"
                            :encrypt="true"
                            class="ailPreview" />
              </div>
            </div>
          </van-step>
        </van-steps>
        <div class="noData_text"
             v-else>暂无数据</div>
        <div class="more-cion"
             v-if="timeLineListData.length > 5"
             :class="{'showmore': hshowmore1}"
             @click="hshowmore1 = !hshowmore1">
          <i class="iconfont iconcms_xia"></i>
        </div>
        <!-- 写跟进按钮 -->
        <div class="writeBtn"
             @click="writeBtn"
             v-if="isWriteBtn"></div>
      </div>
      <div class="records"
           ref="records">
        <!-- <div class="moduleTitle">跟进记录</div> -->
        <div class="moduleTitle" style="display: flex;flex-direction: row;justify-content: space-between;">
          入驻信息 
          <span class="enteEditAdd">
            <i class="iconfont iconcms_fujiantianjia" @click="enteEditAdd()"></i>
            新增
          </span>
        </div>
        <div class="ul-warp" v-for="(item, index) in tableDataEnter" :key="index">
          <div class="content-ul">
            <span>企业名称</span>
            <span>{{item.rzEnterpriseName}}</span>
          </div>
          <div class="content-ul">
            <span>类别</span>
            <span>{{item.moveIntoType}}</span>
          </div>
          <div class="content-ul">
            <span>租金单价</span>
            <span>{{priceFomat(item)}}</span>
          </div>
          <div class="content-ul">
            <span>租期</span>
            <span>{{dateFormat(item)}}</span>
          </div>
          <div class="content-ul">
            <span></span>
            <span>
              <span class="edit" @click="enteEditAdd(item)"><i class="iconfont iconbianji bianjiRight iconFontS"></i>编辑</span>
              <span class="delete" @click="enteDelete(item)"><i class="iconfont iconFontS iconcms_shanchu-233"></i>删除</span>
            </span>
          </div>
        </div>
        <div class="noData_text" v-if="(tableDataEnter.length === 0)">暂无数据</div>
        <!-- <div class="more-cion"
             v-if="timeLineListData.length > 5"
             :class="{'showmore': hshowmore1}"
             @click="hshowmore1 = !hshowmore1">
          <i class="iconfont iconcms_xia"></i>
        </div> -->
      </div>
      <!-- 意向客户 -->
      <!-- <div class="yxTenant"
           :class="{'fixedYxTenantTab':fixedYxTenantTab}"
           ref="yxTenant"
           style="margin-bottom:0">
        <div class="yxTenantTab"
             id="yxTenantTab">
          <span :class="{'active':tabType==='curryxTenant'}"
                @click="tabChange('curryxTenant')">当前意向客户</span>
          <span :class="{'active':tabType==='history'}"
                @click="tabChange('history')">历史意向客户</span>
          <span :class="{'active':tabType==='historyTenant'}"
                @click="tabChange('historyTenant')">历史客户</span>
        </div>
        <div class="list">
          <mt-loadmore ref="loadmore"
                       :bottom-method="loadBottom"
                       :autoFill="false"
                       :bottom-all-loaded="allLoaded">
            <ul>
              <li v-for="(item,index) in tableData"
                  :key="index">
                <div v-if="tabType!=='historyTenant'">
                  <div>
                    <span>{{item.referred}}</span>
                    <span>{{item.industryName}}</span>
                  </div>
                  <div>{{formatterlastFollowTime(item.lastFollowTime)}}</div>
                </div>
                <div v-if="tabType!=='historyTenant'">
                  <span>{{storeDetailsData.projectManagement.referred}}</span>
                  <span :class="{'dealOdds_0':item.dealOdds==='无意向','dealOdds_50':item.dealOdds==='招商跟进中','dealOdds_90':item.dealOdds==='签约审批中','dealOdds_100':item.dealOdds==='合同执行中'}">{{item.dealOdds}}</span>
                </div>
                <div v-if="tabType!=='historyTenant'">
                  <p>{{item.yxTenantName}}</p>
                  <p>需求面积：{{item.demandArea}}m²</p>
                  <p>心理价位：{{formatterPrice(item)}}</p>
                </div>

                <div v-if="tabType==='historyTenant'"
                     class="historyTenant">
                  <div>
                    <span>{{item.referred}}</span>
                    <span v-show="item.industry">{{item.industry}}</span>
                  </div>
                  <div>{{formatterPriceUtils(item)}}</div>
                </div>
                <div v-if="tabType==='historyTenant'">
                  <span>{{item.teantName}}</span>
                  <span></span>
                </div>
                <div v-if="tabType==='historyTenant'">
                  <p>租赁面积：{{item.contractArea}}m²</p>
                  <p>{{item.contractStartDate + '~' + item.contractEndDate}}</p>
                </div>
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
      </div> -->
    </div>

    <van-overlay :show="videoShow"
                 :z-index='99'
                 @click="videoClose">
      <div class="wrapper"
           @click.stop>
        <vueMiniPlayer ref="vueMiniPlayer"
                       :video="video"
                       :mutex="true"
                       @fullscreen="handleFullscreen" />
        <span class="iconfont iconcms_qingchu-238"
              @click="videoClose"></span>
      </div>
    </van-overlay>
  </div>
</template>
<script>
// import AppHeader from '@/components/appHead'
import context from '@/service'
import common from '@/utils/common'
import ailPreview from '@/components/ailPreview.vue'
import { toLocaleString, toLocaleFixed } from '@/utils/validate.js'
import Vue from 'vue'
import { Swipe, SwipeItem, ImagePreview, Overlay, Dialog, Toast } from 'vant'
Vue.use(Swipe)
Vue.use(ImagePreview)
Vue.use(SwipeItem)
Vue.use(Overlay)
let roterFrom = null
export default {
  name: 'storeDetails',
  footVisible: true,
  props: ['scrollTop'],
  components: {
    ailPreview,
    [Dialog.Component.name]: Dialog.Component
  },
  watch: {
    scrollTop (val) {
      this.scrollTopVal = val
      this.elementInView()
      // this.elementInView1()
    }
  },
  computed: {
    $video () {
      return this.$refs.vueMiniPlayer.$video
    }
  },
  data () {
    return {
      video: {
        url: '',
        cover: '',
        muted: false,
        loop: false,
        preload: 'auto',
        poster: '',
        volume: 1,
        autoplay: false
      },
      scrollTopVal: null,
      fixedYxTenantTab: false,
      videoShow: false,
      tabType: 'curryxTenant', // curryxTenant当前意向客户   history历史意向客户 historyTenant历史租户
      isWriteBtn: false,
      hshowmore: false,
      hshowmore1: false,
      videoPng: require('../../../assets/video.png'),
      detailsId: null,
      provinces: '',
      timeLineListData: [],
      storeDetailsData: {
        imgUrls: [],
        projectConditions: [],
        projectManagement: {
          projectName: ''
        },
        building: {},
        floor: {}
      },
      dataReady: false,
      allLoaded: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pgSize: 15,
      tableDataEnter: []
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'housingHome' || from.name === 'storeList' || from.name === 'storeChart') {
      // 防止文件预览后会死循环
      roterFrom = from.name
    } else if (from.name === 'shopFollow') {
      roterFrom = sessionStorage.getItem('roterFrom')
    }
    next()
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  created () {
    this.detailsId = this.$route.params.id || this.$route.query.shopId
    this.shopDetails(this.detailsId) // 铺位详情
    this.getRoomsFollowRecord(this.detailsId)// 铺位跟进记录
    this.getEnterInfo(this.detailsId)// 入驻信息
    this.yxTenantRoomsCurr(this.detailsId)
    // console.log(this.detailsId)
  },
  beforeDestroy () {
  },
  mounted () {
    this.$refs.storeDetails.scrollIntoView()
  },
  methods: {
    roomsUseStatus (state) {
      if (state === 'SHOP') {
        return '商铺'
      } else if (state === 'WORK') {
        return '办公'
      } else if (state === 'MARKET') {
        return '菜场'
      }
    },
    async getEnterInfo (id) { // 入驻信息
      let result = await context.http.get(`cms/api/enterpriseRooms/roomId/${id}`)
      this.tableDataEnter = result.data
    },
    priceFomat (row) {
      let price = row.price
      let rentPriceType = ''
      if (row.rentPriceType === 'MJ_MT') {
        rentPriceType = '元/m²·天'
      } else if (row.rentPriceType === 'MONTH') {
        rentPriceType = '元/月'
      } else if (row.rentPriceType === 'YEAR') {
        rentPriceType = '元/年'
      }
      if (!price) {
        return '-'
      } else {
        return price + rentPriceType
      }
    },
    dateFormat (row) {
      if (!row.startTime || !row.endTime) {
        return '-'
      } else {
        return row.startTime + ' ~ ' + row.endTime
      }
    },
    urlFormat (url) {
      if (!url) return
      let i = url.lastIndexOf('.')
      let str1 = url.substring(0, i)
      let str2 = url.substring(i)
      if (str1.length > 10) {
        str1 = str1.substring(0, 8) + '...'
      }
      return str1 + str2
    },
    writeBtn () {
      sessionStorage.removeItem('selectPerson')
      sessionStorage.setItem('roterFrom', roterFrom)
      this.$router.replace({ name: 'shopFollow', query: { 'shopId': this.detailsId } })
    },
    videoClose () {
      this.$video.pause()
      this.$video.currentTime = 0
      this.videoShow = false
    },
    videoShowFn (videoUrl) {
      this.video.url = videoUrl
      this.video.cover = this.videoPng
      this.$video.play()
      console.log(this.video)
      this.videoShow = true
    },
    handleFullscreen () {

    },
    // elementInView1 () { // 判断当前元素是否在视窗内
    //   let element = this.$refs.yxTenant
    //   const rect = element.getBoundingClientRect()
    //   const yInView = rect.top < window.innerHeight && rect.bottom > 0
    //   if (rect.top < 240) {
    //     this.fixedYxTenantTab = true
    //   } else {
    //     this.fixedYxTenantTab = false
    //   }
    //   // console.log(rect.top)
    // },
    loadBottom () {
      this.currentPage++
      if (this.tabType === 'curryxTenant') {
        this.yxTenantRoomsCurr(this.detailsId)
      } else if (this.tabType === 'history') {
        this.yxTenantRoomsCurrHistory(this.detailsId)
      } else if (this.tabType === 'historyTenant') {
        this.tenantHistory(this.detailsId)
      }
      this.$refs.loadmore.onBottomLoaded()
    },
    tabChange (type) {
      this.tabType = type
      this.dataReady = false
      this.allLoaded = false
      this.tableData = []
      this.currentPage = 1
      // this.$emit('changeScroll', this.scrollTopVal)
      if (type === 'curryxTenant') {
        this.yxTenantRoomsCurr(this.detailsId, true)
      } else if (type === 'history') {
        this.yxTenantRoomsCurrHistory(this.detailsId, true)
      } else if (type === 'historyTenant') {
        this.tenantHistory(this.detailsId, true)
      }
    },
    yxTenantRoomsCurr (id, flag) { // 查询房源下当前意向客户
      let params = {}
      params.page = this.currentPage - 1
      params.size = this.pgSize
      params.roomId = id
      context.http.get('cms/api/yxTenantRooms/page/curr', params).then(res => {
        this.dataReady = true
        if (flag) this.tableData = []
        this.tableData = this.tableData.concat(res.data)
        this.total = Number(res.headers['x-total-count'])
        if (this.currentPage === Math.ceil(this.total / this.pgSize) || this.currentPage > Math.ceil(this.total / this.pgSize)) {
          this.allLoaded = true// 若数据已全部获取完毕
          console.log('全部获取完毕')
        }
      })
    },
    yxTenantRoomsCurrHistory (id, flag) { // 查询房源下历史意向客户
      let params = {}
      params.page = this.currentPage - 1
      params.size = this.pgSize
      params.roomId = id
      params.sort = 'id,desc'
      context.http.get('cms/api/yxTenantRooms/page/history', params).then(res => {
        this.dataReady = true
        if (flag) this.tableData = []
        this.tableData = this.tableData.concat(res.data)
        this.total = Number(res.headers['x-total-count'])
        if (this.currentPage === Math.ceil(this.total / this.pgSize) || this.currentPage > Math.ceil(this.total / this.pgSize)) {
          this.allLoaded = true// 若数据已全部获取完毕
          console.log('全部获取完毕')
        }
      })
    },
    tenantHistory (id, flag) { // 查询历史租户
      let params = {}
      params.page = this.currentPage - 1
      params.size = this.pgSize
      params.roomsId = id
      params.sort = 'startDate,desc'
      context.http.get('cms/api/rooms/historyTenant', params).then(res => {
        this.dataReady = true
        if (flag) this.tableData = []
        this.tableData = this.tableData.concat(res.data)
        this.total = Number(res.headers['x-total-count'])
        if (this.currentPage === Math.ceil(this.total / this.pgSize) || this.currentPage > Math.ceil(this.total / this.pgSize)) {
          this.allLoaded = true// 若数据已全部获取完毕
          console.log('全部获取完毕')
        }
      })
    },
    formatterPriceUtils (row) {
      return toLocaleString(row.contractPrice) + '元/m²天'
    },
    formatterPrice (row) {
      if (row.priceUnit === 'M2DAYS') {
        return row.price + '元/㎡天'
      } else if (row.priceUnit === 'MONTH') {
        return row.price + '元/月'
      } else if (row.priceUnit === 'YEAR') {
        return row.price + '元/年'
      }
    },
    elementInView () { // 判断当前元素是否在视窗内
      let element = this.$refs.records
      const rect = element.getBoundingClientRect()
      const yInView = rect.top + 100 < window.innerHeight && rect.bottom > 0
      const xInView = rect.left < window.innerWidth && rect.right > 0
      this.isWriteBtn = yInView && xInView
      // return yInView && xInView
    },
    showRoomsImage (url) {
      ImagePreview([url])
    },
    showImg (imgArr, index) {
      let arr = imgArr.map((item, index) => {
        let i = item.lastIndexOf('.')
        let str = item.substring(i + 1, item.length)
        str.toLowerCase()
        if (str === 'mp4') {
          return this.videoPng
        } else {
          return item
        }
      })
      ImagePreview({
        images: arr,
        startPosition: index
      })
    },
    isVideo (url) { // 判断链接是否是视频链接
      if (!url) {
        return
      }
      let index = url.lastIndexOf('.')
      let str = url.substring(index + 1, url.length)
      str.toLowerCase()
      // console.log(str)
      if (str === 'mp4') {
        return true
      } else {
        return false
      }
    },
    getRoomsFollowRecord (id) { // 查询铺位跟进记录
      context.http.get(`cms/api/roomsFollowRecord/roomId/${id}`, {zcFollowType: 'ROOM'}).then(res => {
        this.timeLineListData = res.data
      })
    },
    shopDetails (roomId) {
      context.http.get('cms/api/rooms/' + roomId).then(res => {
        if (res.status === 200) {
          this.storeDetailsData = res.data
          context.http.get(`ywm/api/district-codes/${this.storeDetailsData.projectManagement.district}`).then(res => { // 省市区
            this.provinces = res.data.address
          })
        }
      })
    },
    pageGetformat (str) {
      return common.getformat(str)
    },
    useStatus (state) {
      if (state === 'USING') {
        return '使用中'
      } else if (state === 'DISABLE') {
        return '已停用'
      }
    },
    formatterlastFollowTime (time) {
      if (!time) return
      return time.substr(0, 10)
    },
    formatreplace (description) {
      if (!description) {
        return
      }
      let html = description.replace(/\n/g, '<br/>')
      html = html.replace(/↵/g, '<br/>')
      return html
    },
    formatTimeLineTitle (type) { // 时间线头部遍历
      switch (type) {
        case 'INPUT':
          return '录入'
        case 'FOLLOW':
          return '跟进'
        case 'PROCESS_RUNING':
          return '审批中'
        case 'PROCESS_AGREED':
          return '审批通过'
      }
    },
    priceUnit (price, unit) {
      if (unit === 'M2DAYS') {
        return price ? price + '元/㎡天' : '-'
      } else if (unit === 'M2MONTH') {
        return price ? price + '元/㎡月' : '-'
      } else if (unit === 'DAY') {
        return price ? price + '元/天' : '-'
      } else if (unit === 'MONTH') {
        return price ? price + '元/月' : '-'
      }
    },
    investmentStatus (state) {
      if (state === 'OK') {
        // return '可招商'
        return '普通房源'
      } else if (state === 'NO') {
        return '自用'
      } else if (state === 'FICTITIOUS') {
        return '虚拟房源'
      }
    },
    industry (state) {
      if (state === 'LIFE') {
        return '生活配套'
      } else if (state === 'FOOD') {
        return '餐饮'
      } else if (state === 'RETAIL') {
        return '零售'
      } else if (state === 'BDUCATION') {
        return '亲子教育'
      } else if (state === 'CSE') {
        return '娱乐'
      } else if (state === 'FINANCIAL') {
        return '金融'
      } else if (state === 'REALESTATE') {
        return '房地产'
      } else if (state === 'SERVICE') {
        return '其他'
      }
    },
    enteEditAdd (row) {
      // context.http.put('/cms/api/enterpriseRooms', this.addParmasEnterInfo).then(res => {
      //   if (res) {
      //     this.$message.success('修改成功')
      //     this.enterInfoDialogClose()
      //     this.getEnterInfo(this.detailData.id)
      //     this.$emit('queryList')
      //   }
      // }).catch(error => {
      //   console.log(error)
      // })
      if (row) {
        this.$router.replace({ name: 'enteAddEdit', query: { row, titleName: '编辑', id: this.storeDetailsData.id } })
      } else {
        this.$router.replace({ name: 'enteAddEdit', query: { titleName: '新增', id: this.storeDetailsData.id } })
      }
    },
    enteDelete (row) {
      Dialog.confirm({
        confirmButtonText: '确定',
        confirmButtonColor: '#0139a4',
        message: '确定删除吗？'
      })
      .then(() => {
        context.http.delete(`cms/api/enterpriseRooms/${row.id}`).then(res => {
          Toast({
            message: '删除成功',
            position: 'top'
          })
          this.getEnterInfo(this.detailsId)// 入驻信息
        })
      })
      .catch(() => {
        // on cancel
      })
    },

    onGoBack () { // 返回首页
      this.$router.push({ name: roterFrom })
      // this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss">
.storeDetails {
  .van-swipe__indicator--active {
    background-color: #1989fa !important;
  }
  .van-steps {
    margin-top: 20px;
  }
  .van-overlay {
    display: flex;
    align-items: center;
  }
}
</style>
<style scoped lang="scss" >
@import "../../../style/config";
$img-height: rem(135);
$header-height: rem(40);
$yxTenantTab-height: rem(40);
.storeDetails {
  .wrapper {
    // position: absolute;
    // top: 0;
    // left: 0;
    // right: 0;
    // bottom: 0;
    // margin: auto;
    .iconcms_qingchu-238 {
      position: absolute;
      top: 0;
      right: 0;
      color: #fff;
      font-size: rem(30);
    }
  }
  .img {
    width: 100%;
    height: rem(135);
    position: fixed;
    left: 0;
    top: rem(40);
    z-index: 9;
    .my-swipe {
      img {
        width: 100%;
        height: rem(135);
        object-fit: cover;
      }
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
      color: #18191a;
      font-size: rem(17);
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
  .common_list {
    padding-top: rem(175);
    min-height: rem(200);
    .yxTenant {
      &.fixedYxTenantTab {
        .yxTenantTab {
          position: fixed;
          top: rem(175);
        }
      }
      .yxTenantTab {
        background-color: #fff;
        color: #444547;
        font-size: rem(17);
        height: rem(40);
        line-height: rem(40);
        display: flex;
        padding-left: rem(15);
        width: 100%;
        box-shadow: rem(0) rem(1) rem(4) rem(0) rgba(230, 230, 230, 0.5);
        > span {
          margin-right: rem(15);
          &.active {
            color: #0139a4;
            border-bottom: rem(3) solid #0139a4;
            font-weight: bold;
          }
        }
      }
      .list {
        padding-left: rem(14);
        min-height: calc(
          100vh - #{$header-height} - #{$img-height} - #{$yxTenantTab-height}
        );
        // height: calc(100% - #{$out-height});
        li {
          padding: rem(17) rem(14) rem(17) 0;
          border-bottom: rem(1) solid #f0f0f0;
          color: #858c94;
          font-size: rem(14);
          > div {
            &:first-child {
              display: flex;
              justify-content: space-between;
              margin-bottom: rem(7);
              > div {
                &:first-child {
                  > span {
                    &:first-child {
                      color: #18191a;
                      font-size: rem(15);
                      font-weight: bold;
                    }
                    &:last-child {
                      background: #eff6ff;
                      border-radius: 1px;
                      color: #0139a4;
                      padding: rem(2) rem(4);
                    }
                  }
                }
              }
            }
            &:nth-child(2) {
              display: flex;
              justify-content: space-between;
              margin-bottom: rem(7);
              > span {
                &:nth-child(2) {
                  font-size: rem(15);
                  color: #444547;
                  &.dealOdds_0 {
                    color: #858c94;
                  }
                  &.dealOdds_50 {
                    color: #3575f6;
                  }
                  &.dealOdds_90 {
                  }
                  &.dealOdds_100 {
                  }
                }
              }
            }
            &:nth-child(3) {
              > p {
                &:first-child {
                  margin-bottom: rem(7);
                }
              }
            }
          }
        }
        .noData {
          position: inherit;
          margin-top: rem(40);
        }
      }
    }
    .records {
      background: #fff;
      .step-head {
        display: flex;
        justify-content: space-between;
        span {
          &:last-child {
            color: #858c94;
          }
        }
      }
      .recordsContent {
        display: flex;
        span {
          &:last-child {
            flex: 1;
          }
        }
      }
      .van-step {
        color: #18191a;
        p {
          margin-top: rem(8);
          span {
            &:first-child {
              color: #858c94;
            }
          }
        }
      }
      .record-type {
        text-align: right;
        padding: rem(20) rem(14);
        span {
          &:nth-child(1) {
            background-color: #3575f6;
          }
          &:nth-child(2) {
            background-color: #83bf68;
          }
          &:nth-child(3) {
            background-color: #f99a12;
          }
          &:nth-child(4) {
            background-color: #a69848;
          }
        }
      }
      .record-type_sapn {
        display: inline-block;
        // width: rem(45);
        height: rem(22);
        line-height: rem(22);
        font-size: rem(16);
        text-align: center;
        border-radius: rem(2);
        color: #18191a;
        font-weight: bold;
        // margin: 0 rem(2);
        &.OTHERS {
          background-color: #a69848;
        }
        &.PATROL {
          background-color: #3575f6;
        }
        &.CONSTRUCTION {
          background-color: #83bf68;
        }
        &.FINANCE {
          background-color: #f99a12;
        }
        &.cl-active {
          background-color: #dedfe0 !important;
        }
      }
      .annex-warp {
        background: #fafafa;
        border-radius: rem(4);
        margin-top: rem(8);
        border: rem(1) solid #ebedf0;
      }

      .an-item {
        display: flex;
        align-items: center;
        &:nth-of-type(2) {
          margin-top: 0;
        }
        .image {
          margin-right: rem(10);
        }
        .annex-name {
          width: 80%;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          margin-bottom: rem(4);
        }
        .ailPreview {
          flex: 1;
          text-align: right;
        }
      }
      .writeBtn {
        position: fixed;
        bottom: rem(50);
        right: rem(14);
        width: rem(50);
        height: rem(50);
        background: url("../../../assets/xgj.png") no-repeat;
        background-size: contain;
      }
    }
    .basicInfo,
    .projectConditions,
    .records,
    .yxTenant {
      background-color: #fff;
      margin-bottom: rem(14);
      .noData_text {
        height: rem(80);
        line-height: rem(80);
        text-align: center;
        color: #878a9a;
      }
      .moduleTitle {
        color: #18191a;
        font-size: rem(17);
        font-weight: bold;
        padding: rem(14) 0 rem(14) rem(14);
        border-bottom: rem(1) solid #f0f0f0;
      }
      .ul-warp {
        margin: 0 rem(14) 0 rem(14);
        // border-bottom: rem(1) solid #f0f0f0;
        padding-bottom: rem(16);
        &:last-child {
          border: none;
        }
        &.no_Data {
          min-height: rem(500);
        }
        .content-ul {
          display: flex;
          justify-content: space-between;
          padding-top: rem(16) !important;
          font-size: rem(15);
          > span {
            color: #18191a;
            &:first-child {
              color: #858c94;
              white-space: nowrap;
              margin-right: rem(10);
            }
          }
          .total {
            padding-top: rem(14);
            span {
              span {
                color: #cb444a;
              }
            }
          }
        }
        &.ul-warp1 {
          min-height: rem(800);
          position: relative;
          > .noData {
            top: rem(-150);
          }
        }
        .tenBill_list {
          padding-top: rem(17);
          border-bottom: rem(1) solid #f0f0f0;
          &.noBorder {
            border: none;
          }
          > div {
            display: flex;
            justify-content: space-between;
            color: #777777;
            font-size: rem(14);
            margin-bottom: rem(8);
            &:nth-child(1) {
              > span {
                &:nth-child(1) {
                  color: #262626;
                  font-weight: bold;
                }
                &:nth-child(2) {
                  &.STAY_SETTLE {
                    color: #f99a12;
                  }
                  &.SECTION,
                  &.NO {
                    color: #fc5159;
                  }
                  &.OK {
                    color: #1cc296;
                  }
                }
              }
            }
            &:nth-child(2) {
            }
          }
        }
        .no_Data {
          height: rem(50);
          line-height: rem(50);
          color: #777777;
          text-align: center;
        }
      }
      .ul-warp:not(:last-child) {
        border-bottom: 1px solid #F0F0F0;
      }
    }
  }
  .edit{
    font-size: rem(12);
    margin-right: rem(20);
    padding: rem(10) 0;
  }
  .delete{
    font-size: rem(12);
    padding: rem(10) 0;
  }
  .iconFontS{
    font-size: rem(14);
    margin-right: rem(4);
  }
  .enteEditAdd{
    margin-right: rem(16);
    color: #4381F7;
    font-size: rem(14);
    font-weight: 400;
  }
}
</style>
