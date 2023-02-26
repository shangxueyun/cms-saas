<template>
  <div class="project-list">
    <router-link to="/switchScreen">
      <div class="home-button"></div>
    </router-link>
    <div class="switch-classification"
         @click="dialogVisible = true;managementsTypes()"
         v-if="tabIndex === 0">
      {{classification}}
    </div>
    <div class="title">
      <span>{{title}}</span>
    </div>
    <div class="project-list-content">
      <!-- <div class="content-left">
        <div class="project-item" @click="goToScreen(projecCachetList1)">
          <div class="pi-title">{{projecCachetList1.shorName}}</div>
          <div class="pi-img">
            <img :src="projecCachetList1.previewImage"/>
          </div>
          <div class="pi-btn" v-if="!projecCachetList1.hasLimit">
          </div>
          <span v-if="!projecCachetList1.hasLimit">敬请期待</span>
        </div>
      </div> -->
      <div class="content-right">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide"
                 v-for="(item, i) in projecCachetListShow"
                 :key="i">
              <div class="project-item"
                   @click="goToScreen(item)">
                <div class="pi-title">{{item.shorName || item.referred}}</div>
                <div class="pi-img">
                  <img :src="item.previewImage" />
                </div>
                <!-- <div class="pi-btn" v-if="!item.hasLimit">
                </div>
                <span v-if="!item.hasLimit">敬请期待</span> -->
              </div>
            </div>
          </div>
        </div>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
      </div>
    </div>

    <!-- 项目分类 -->
    <el-dialog custom-class="category"
               title="选择项目分类"
               center="center"
               :visible.sync="dialogVisible"
               :before-close="handleClose"
               width="810px">
      <div class="category-content">
        <span v-for="(item, index) in category"
              :key="item.value"
              @click="clickHandle(item, index)"
              :class="{'select': selectIndex === index}">
          {{item.value}}
          <i v-if="selectIndex === index"
             class="selectIcon"></i>
        </span>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <span class="cancel"
              @click="cancel">取 消</span>
        <span class="determine"
              @click="determine">确 定</span>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import $ from 'jquery'
// eslint-disable-next-line no-unused-vars
import axios from 'axios'
import service from '@/service'
// import Swiper from 'swiper'
import Swiper from 'swiper/dist/js/swiper.js'
import group from '../../assets/group.png'
export default {
  name: 'projectlist',
  data () {
    return {
      navigationBar: [{ name: '综合数据', val: 'zhsj' }, { name: '商业经营数据', val: 'syjy' }, { name: 'O2O业务数据', val: 'o2o' }, { name: '物业管理数据', val: 'wygl' }],
      tabIndex: '',
      projectList: [],
      projecCachetList: [],
      projecCachetListShow: [],
      projecCachetList1: [],
      navType: '',
      hasJurisdiction: true,
      groupImg: group,
      pjGroup: {},
      Last: 0,
      selectIndex: 0,
      classification: '选择项目分类',
      dialogVisible: false,
      category: [],
      title: ''
    }
  },
  created () {
    this.title = this.$route.query.name
    this.projectConfig(this.$route.query)
    // this.getType()
    this.businessScreenType = this.$route.query.mark
    if (this.title === '商业经营数据') {
      this.tabIndex = 0
    }
  },
  mounted () {
    this.$nextTick(() => {
      // eslint-disable-next-line no-unused-vars
      this.swiperInit()
    })
  },
  methods: {
    login () {
      sessionStorage.removeItem('token')
      service.user.login('admin', 'admin')
    },
    projectConfig (item) {
      service.http.get(`/rts/api/initConfigBylargeId/${item.id}?largeConfigType=${item.dataType}`).then(res => {
        if (res.status === 200) {
          const projecCachetListRes = res.data.largeConfigDataList
          this.projecCachetListRes = projecCachetListRes.filter(ele => {
            return ele.usingStatus
          })
          this.queryProjectListAll()
        }
      })
    },
    queryProjectListAll () {
      service.http.get('/cms/api/project-managements/all').then(res => {
        if (res.status === 200) {
          const projectList = res.data
          const projecCachetListRes = this.projecCachetListRes
          let resArr = []
          projectList.forEach(ele => {
            projecCachetListRes.forEach(ele2 => {
              if (ele.id === ele2.businessId) {
                ele.pictureUrl = ele2.pictureUrl
                resArr.push(ele)
              }
            })
          })
          this.projecCachetListShow = resArr
        }
      })
    },
    // 项目分类
    managementsTypes () {
      service.http.get('/cms/api/project-managements/types').then(res => {
        if (res.status === 200) {
          const defaultType = [{ value: '全部', id: '' }]
          this.category = [...defaultType, ...res.data]
        }
      })
    },
    async getType () {
      let tenantKey = localStorage.getItem('tenantKey')
      let result = await service.user.corporateCustomers(tenantKey)
      this.businessScreenType = result.data.businessScreenType
    },
    swiperInit () {
      // eslint-disable-next-line no-unused-vars
      var mySwiper = new Swiper('.swiper-container', {
        slidesPerView: 4,
        loopedSlides: 1,
        slidesPerGroup: 4,
        // centeredSlides: true,
        spaceBetween: 0,
        // mousewheelControl: true,
        slidesPerColumn: 2,
        // slidesPerColumnFill: 'row',
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        observer: true, // 修改swiper自己或子元素时，自动初始化swiper
        observeParents: false, // 修改swiper的父元素时，自动初始化swiper
        onSlideChangeEnd: function (swiper) {
          swiper.update()
          mySwiper.startAutoplay()
          mySwiper.reLoop()
        }
      })
      // eslint-disable-next-line no-unused-vars
      var _t = setTimeout(function () { mySwiper.slideTo(0, 1000, false) }, 500)
    },
    getNavigationBar () {
      let tenantKey = localStorage.getItem('tenantKey')
      // let tenantKey = 'chj'
      service.http.get(`/rts/api/company/corporateDatatype?companyCode=${tenantKey}`).then(res => {
        this.navigationBar = res.data
        this.groupImg = this.navigationBar[0].companyImage ? this.navigationBar[0].companyImage : group

        this.navType = this.navigationBar[0].dataType
        this.queryProjectList(this.navigationBar[0].id, this.navigationBar[0].dataType)
      })
    },
    queryProjectList (navigationBarId, navigationBarType, TypeId) {
      service.http.get('/cms/api/project-managements', { page: 0, size: 50, sort: 'desc', useStatus: 'USING', projectName: '', projectManagementTypeId: TypeId }).then(res => {
        var projectList = res.data
        this.projectList = projectList
        this.projecCachetListShow = res.data
        // this.queryProjectLimit(navigationBarId, navigationBarType)
      })
    },
    queryProjectLimit (id, navType) {
      let tenantKey = localStorage.getItem('tenantKey')
      // let tenantKey = 'chj'
      let LimitIDArr = []
      service.http.get(`/rts/api/company/distributionMap/limit?companyCode=${tenantKey}&dataType=${navType}`).then(res => {
        if (res.status === 200) {
          let reslist = res.data
          let idArr = []
          let _this = this
          let pjGroup = ''
          reslist.forEach(ele => {
            if (ele.mallId) {
              idArr.push(ele.mallId)
            } else if (ele.mallId === null && this.businessScreenType !== 'THREE') {
              let companyName = this.companyName ? this.companyName : _this.navigationBar[0].companyName
              pjGroup = { shorName: companyName, previewImage: _this.groupImg, id: '', hasLimit: true }
            }
          })
          this.LimitIDArr = idArr
          LimitIDArr = idArr
          this.projectList.forEach(ele => {
            if (LimitIDArr.includes(ele.id)) {
              ele.hasLimit = true
            } else {
              ele.hasLimit = false
            }
          })
          let projectList = this.projectList
          if (pjGroup) {
            this.projecCachetList = [pjGroup, ...projectList]
          } else {
            this.projecCachetList = projectList
          }
          // swiper展示从第二项开始， 截取的第一个放在左边展示
          this.projecCachetListShow = this.projecCachetList.slice(0)
          this.projecCachetListShow = this.projecCachetListShow.filter(item => {
            return item.hasLimit
          })
          this.projecCachetList1 = this.projecCachetListShow.shift()
        }
      })
      // this.swiperInit()
    },
    goToScreen (item) {
      // if (!item.hasLimit) {
      //   return
      // }
      if (this.title === 'O2O业务数据' || this.navType === 'SERVICE') {
        this.$router.push({
          path: '/O2O',
          query: {
            id: item.id,
            name: item.referred
          }
        })
      } else if (this.title === '商业经营数据' || this.navType === 'BUSINESS') {
        let routePath = ''
        if (this.businessScreenType === '模板一') {
          routePath = '/businessOperation'
        } else if (this.businessScreenType === '模板二') {
          routePath = '/businessForChj'
        } else {
          routePath = '/businessForTemplate3'
        }
        this.$router.push({
          path: routePath,
          query: {
            id: item.id,
            name: item.referred,
            dataType: this.navType,
            TypeId: this.TypeId,
            pictureUrl: item.pictureUrl
          }
        })
      } else if (this.navType === 'WORK_OFFICE') {
        let routePath = '/businessTemplate3Park'
        this.$router.push({
          path: routePath,
          query: {
            id: item.id,
            name: item.referred,
            dataType: this.navType,
            TypeId: this.TypeId
          }
        })
      } else if (this.title === '综合数据' || this.navType === 'COMPREHENSIVE') {
        this.$router.push({
          path: '/comprehensive',
          query: {
            id: item.id,
            name: item.referred,
            dataType: this.navType,
            pictureUrl: item.pictureUrl
          }
        })
      } else if (this.title === '物业管理数据' || this.navType === 'PROPERTY') {
        this.wylogin()
        this.$router.push({
          path: '/estateManagement',
          query: {
            id: item.id,
            name: item.referred
          }
        })
      } else if (this.title === '农贸经营数据' || this.navType === 'FARM') {
        this.$router.push({
          path: '/agriculturalTrade',
          query: {
            id: item.id,
            name: item.referred
          }
        })
      }
    },
    wylogin () {
      const user = JSON.parse(window.sessionStorage.getItem('user')) || JSON.parse(window.localStorage.getItem('user'))
      service.http.post('/tmg/rest/account/login', { 'account': user.xfUserName, 'password': user.xfPassword }).then(res => {
        if (res.data.ret.success === true) {
          const sessionid = res.data.ret.value.sessionid
          service.local.setCookie('sessionid', sessionid)
        }
      })
    },
    handleClose (done) {
      this.selectIndex = this.Last
      done()
    },
    clickHandle (item, index) {
      this.selectIndex = index
      this.currentSelect = item.value
      this.TypeId = item.id
    },
    cancel () {
      this.selectIndex = this.Last
      this.dialogVisible = false
    },
    determine () {
      this.Last = this.selectIndex
      this.classification = this.currentSelect
      this.companyName = this.currentSelect
      this.dialogVisible = false
      const navigationBarId = this.navigationBar[0].id
      const navType = this.navigationBar[0].dataType
      this.queryProjectList(navigationBarId, navType, this.TypeId)
    }
  }
}
</script>

<style lang="scss">
$base-size: 100;
@function px2rem($px) {
  @return $px * 1rem / $base-size;
}
.project-list {
  width: 100%;
  height: 100%;
  background: url(../../assets/switch-bg.png) no-repeat;
  background-size: cover;
  position: relative;
  .switch-classification {
    position: absolute;
    right: 40px;
    top: 50px;
    width: 110px;
    height: 35px;
    line-height: 32px;
    text-align: center;
    background: #24315d;
    border: 1px solid #8187e5;
    border-radius: 4px;
    color: #c0cde2;
    cursor: pointer;
  }
  .title {
    /* background: url(../../assets/switch-title.png) no-repeat; */
    background-position: 0 px2rem(50);
    background-size: contain;
    width: 26rem;
    height: 2.4rem;
    margin: 0 auto;
    position: relative;
    span {
      position: absolute;
      font-family: MicrosoftYaHei-Bold;
      font-weight: 700;
      color: hsla(0, 0%, 100%, 0);
      line-height: px2rem(56);
      -webkit-text-stroke: 1px #fff;
      color: #e7f0ff;
      left: px2rem(1000);
      top: px2rem(66);
    }
  }
  .navbar {
    /* width: px2rem(2200); */
    margin: 0 auto;
    margin-top: px2rem(60);
    display: flex;
    justify-content: center;
    div {
      margin: 0 px2rem(100);
      width: px2rem(328);
      height: px2rem(126);
      line-height: px2rem(120);
      border: 1px solid #078cdf;
      font-size: px2rem(40);
      color: #c0cde2;
      text-align: center;
      box-shadow: inset 0 0 px2rem(100) #0b5a95;
      cursor: pointer;
      &:first-child {
        margin-left: 0;
      }
      &:last-child {
        margin-right: 0;
      }
    }
    .navSelected {
      color: #00ddcb;
    }
  }
  .home-button {
      // margin: px2rem(100) 0 0 px2rem(100);
      // color: #cfcbdd;
      // font-size: px2rem(36);
      // i {
      //   color: #fff;
      //   font-size: px2rem(42);
      //   margin-right: px2rem(10);
      // }
      position: absolute;
      background: url("../../assets/tgbtn.png") no-repeat;
      background-size: 100% 100%;
      width: px2rem(100);
      height: px2rem(100);
      margin: px2rem(110) 0 0 px2rem(80);
    }
  .project-list-content {
    width: 90%;
    margin: 0 auto;
    display: flex;
    .content-left {
      width: 30%;
      /* .project-item{
        width: px2rem(930);
        height: px2rem(1140);
        margin-top: px2rem(170);
        border-radius: 5px;
        position: relative;
        .pi-img{
          border-radius: 5px;
          img {
            border-radius: 5px;
          }
        }
        .pi-btn{
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #000;
          opacity: 0.5;
          border-radius: 5px;
          + span {
            display: inline-block;
            position: absolute;
            top: 35%;
            left: 38%;
            color: #CECECE;
          }
        }
      } */
    }
    .content-right {
      flex: 1;
      position: relative;
    }
    .project-item {
      font-size: px2rem(80);
      width: px2rem(465);
      height: px2rem(570);
      background: url(../../assets/projectbg.png) no-repeat;
      background-size: cover;
      cursor: pointer;
      position: relative;
      &:hover {
        box-shadow: 0px 0px px2rem(20) px2rem(10) #27aebd;
      }
      .pi-title {
        font-size: inherit;
        color: #fff;
        padding: px2rem(50);
        font-weight: bold;
      }
      .pi-img {
        width: 90%;
        height: 78%;
        border-radius: 5px;
        margin: 0 auto;
        img {
          width: 100%;
          height: 100%;
          border-radius: 5px;
        }
      }
      .pi-btn {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        opacity: 0.5;
        border-radius: 5px;
        + span {
          position: absolute;
          top: 45%;
          left: 30%;
          color: #cecece;
          font-size: px2rem(60);
        }
      }
    }
  }
  .swiper-container {
    width: px2rem(3000);
    height: px2rem(1200);
    margin-top: px2rem(145) !important;
    position: relative;
    .swiper-slide {
      text-align: center;
      font-size: 18px;
      // background: #fff;
      height: calc((100% - 30px) / 2);
      /* Center slide text vertically */
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;
      // width: 100%;
      // height: px2rem(1300);
      .project-item {
        display: inline-block;
        width: px2rem(650);
        height: px2rem(520);
        border-radius: 5px;
        .pi-title {
          font-size: px2rem(32);
          font-weight: bold;
          padding: px2rem(20) px2rem(20) px2rem(20) px2rem(30);
          text-align: left;
        }
      }
    }
    .swiper-wrapper {
      padding: 0 px2rem(10);
    }
    .swiper-slide-next {
      .project-item {
        //  box-shadow:0px 0px px2rem(30) px2rem(10) #27aebd;
      }
    }
  }
  .swiper-button-prev,
  .swiper-container-rtl .swiper-button-next {
    width: px2rem(130) !important;
    height: px2rem(200) !important;
    left: px2rem(-30) !important;
    background: url(../../assets/arrow-left.png) no-repeat !important;
    background-size: cover !important;
  }
  .swiper-button-next,
  .swiper-container-rtl .swiper-button-prev {
    width: px2rem(130) !important;
    height: px2rem(200) !important;
    right: px2rem(-50) !important;
    background: url(../../assets/arrow-right.png) no-repeat !important;
    background-size: cover !important;
  }
  .category {
    height: 620px;
    background: #354068 !important;
    border-radius: 5px !important;
    position: relative;
    .el-dialog__title {
      font-size: 20px;
      font-weight: 400;
      color: #ffffff;
    }
    .el-dialog__close {
      font-size: 28px;
    }
    .el-dialog__header {
      border-bottom: 1px solid #6c81aa;
      padding-bottom: 20px;
    }
    .el-dialog__body {
      border: none;
    }
    .category-content {
      display: flex;
      flex-wrap: wrap;
      margin: 50px 0;
      span {
        display: inline-block;
        width: 165px;
        height: 60px;
        line-height: 56px;
        text-align: center;
        background: #354068;
        border: 1px solid #6c81aa;
        border-radius: 3px;
        color: #fff;
        font-size: 20px;
        font-weight: 400;
        margin-bottom: 30px;
        cursor: pointer;
        position: relative;
        margin-right: 26px;
        &:nth-of-type(4n) {
          margin-right: 0;
        }
      }
      .select {
        border: 1px solid #00ddcb;
      }
      .selectIcon {
        display: inline-block;
        width: 30px;
        height: 30px;
        position: absolute;
        right: 0;
        bottom: 0;
        background: url("../../assets/Selected.png") right bottom no-repeat;
        background-size: contain;
      }
    }
    .el-dialog__footer {
      width: 100%;
      position: absolute;
      bottom: 0;
      text-align: right !important;
    }
    .cancel {
      display: inline-block;
      width: 120px;
      height: 45px;
      line-height: 42px;
      text-align: center;
      background: rgba(36, 49, 93, 0.66);
      border: 1px solid #8187e5;
      border-radius: 5px;
      color: #c0cde2;
      cursor: pointer;
      margin-right: 10px;
    }
    .determine {
      display: inline-block;
      width: 120px;
      height: 45px;
      line-height: 42px;
      text-align: center;
      background: rgba(0, 221, 203, 0.66);
      border: 1px solid #8187e5;
      border-radius: 5px;
      color: #fff;
      cursor: pointer;
    }
  }
}
</style>
