/* eslint-disable eqeqeq */
/* eslint-disable eqeqeq */
<template>
  <div class="switch-screen"
       :class="{'switch-screen-h': showScreenH}">
    <div class="title">
    </div>
    <div class="switch-content">
      <div class="content-right">
        <!-- <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(item, i) in projecCachetListShow" :key="i">
              <div class="project-item" @click="goToScreen(item)">
                <div class="pi-title">{{item.shorName}}</div>
                <div class="pi-img">
                  <img :src="item.previewImage"/>
                </div>
                <div class="pi-btn" v-if="!item.hasLimit">
                </div>
                <span v-if="!item.hasLimit">敬请期待</span>
              </div>
            </div>
          </div>
        </div>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div> -->
        <div class="project-slide">
          <div class="project-item"
               @click="goToScreen1(item)"
               v-for="(item, i) in navigationBar"
               :key="i">
            <div class="pi-title">
              {{item.name}}
              <span class="pi-configure"
                    @click.stop="projectConfig(item)">配置</span>
            </div>
            <div class="pi-img">
              <img :src="item.pictureUrl" />
            </div>
            <!-- <div class="pi-btn" v-if="!item.hasLimit">
            </div>
            <span v-if="!item.hasLimit">敬请期待</span> -->
          </div>
        </div>
      </div>
    </div>

    <!-- 商业经营数据配置 -->
    <el-dialog custom-class="category"
               :title="dialogTitle"
               center="center"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="dialogVisible"
               :before-close="businessHandleClose">
      <div class="category-content">
        <div class="common-head">
          <i class="iconfont icon-biaoti"></i>选择需要展示的项目
        </div>
        <div class="span-warp">
          <span v-for="(item, index) in largeConfigDataList"
                :key="item.id"
                @click="clickHandle(item, index)"
                :class="{'select': item.usingStatus}">
            {{item.shorName || item.name}}
            <i v-if="item.usingStatus"
               class="selectIcon"></i>
          </span>
        </div>
        <div class="common-head">
          <i class="iconfont icon-biaoti"></i>大屏图片配置
        </div>
        <div class="table">
          <ul class="tableHead">
            <li>项目简称</li>
            <li>图片</li>
            <li>操作</li>
          </ul>
          <ul class="tableBody">
            <li v-for="(item,index) in businessTableData"
                :key="index">
              <span>{{item.shorName || item.name}}</span>
              <span>{{item.pictureName}}</span>
              <span class="operation">
                <aliUpload class="switch-upload"
                           :encrypt="false"
                           :upLoadText="upLoadText_cost"
                           :fileType="fileType_cost"
                           :iconShow="false"
                           :uploadIcon="false"
                           @click.native="setAnnexHandler(item, index)"
                           @setAnnex="setAnnex" />
                |
                <span @click="showImg(item.pictureUrl)">预览</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>
    <!-- 办公经营数据配置 -->
    <el-dialog custom-class="category office-operation"
               title="办公经营数据配置"
               center="center"
               :before-close="officeHandleClose"
               :visible.sync="officeOperationDialogVisible">
      <div class="category-content">
        <div class="common-head">
          <i class="iconfont icon-biaoti"></i>大屏图片配置
        </div>
        <el-table :data="officeTableData"
                  style="width: 100%"
                  row-key="id"
                  border
                  :expand-row-keys="expands"
                  :tree-props="{children: 'enterpriseCascadeDtos'}">
          <el-table-column label="企业/项目分类/项目/楼宇">
            <template slot-scope="scope">
              {{scope.row.shorName || scope.row.name}}
            </template>
          </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="scope">
              {{scope.row.pictureName || scope.row.pictureUrl}}
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           align="center">
            <template slot-scope="scope">
              <aliUpload class="switch-upload"
                         :encrypt="false"
                         :upLoadText="upLoadText_cost"
                         :fileType="fileType_cost"
                         :iconShow="false"
                         :uploadIcon="false"
                         @click.native="setAnnexHandler(scope.row, scope.$index, 'office')"
                         @setAnnex="setAnnex" />
              <span style="color: #06E6FA;"> | </span>
              <span @click="showImg(scope.row.pictureUrl)"
                    class="showImg">预览</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 其他屏幕项目展示配置 -->
    <el-dialog custom-class="category"
               :title="dialogTitle"
               center="center"
               :visible.sync="otherDialogVisible"
               :before-close="handleClose">
      <div class="category-content">
        <div class="common-head">
          <i class="iconfont icon-biaoti"></i>选择需要展示的项目
        </div>
        <div class="span-warp">
          <span v-for="(item, index) in largeConfigDataList"
                :key="item.id"
                @click="clickHandle(item, index)"
                :class="{'select': item.usingStatus}">
            {{item.shorName || item.name}}
            <i v-if="item.usingStatus"
               class="selectIcon"></i>
          </span>
        </div>
      </div>
    </el-dialog>

    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   @pictureClose="pictureClose"></picturePrevie>
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
import picturePrevie from '@/components/picturePrevie.vue'
import aliUpload from '@/components/aliUpload.vue'
// eslint-disable-next-line no-unused-vars
window.isBack = false
export default {
  name: 'switchScreen',
  components: {
    picturePrevie,
    aliUpload
  },
  data () {
    return {
      navigationBar: [],
      tabIndex: 0,
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
      businessTableData: [],
      officeOperationDialogVisible: false,
      officeTableData: [],
      showPicture: false,
      imgArr: [],
      upLoadText_cost: '上传',
      fileType_cost: ['png', 'jpg', 'jpeg'],
      dialogTitle: '',
      otherDialogVisible: false,
      largeConfigDataList: [],
      expands: [],
      showScreenH: false
    }
  },
  created () {
    this.getNavigationBar()
    this.getType()
  },
  mounted () {
    this.$nextTick(() => {
      // eslint-disable-next-line no-unused-vars
      // this.swiperInit()
    })
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'park' || from.name === 'projectlist') {
      // eslint-disable-next-line no-undef
      isBack = true
    } else {
      // eslint-disable-next-line no-undef
      isBack = false
    }
    next()
  },
  methods: {
    officeHandleClose (done) {
      this.expandAll()
      done()
    },
    login () {
      sessionStorage.removeItem('token')
      service.user.login('admin', 'admin')
    },
    pictureClose () {
      this.showPicture = false
    },
    showImg (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    setAnnexHandler (item, index, type) {
      this.selectIndex = index
      this.selectType = type
      this.selectItem = item
    },
    setAnnex (annexURL, annexName) {
      if (this.selectType === 'office') {
        this.selectItem.pictureUrl = annexURL
        this.selectItem.pictureName = annexName
        this.largeConfigData(this.selectItem)
      } else {
        this.businessTableData[this.selectIndex].pictureUrl = annexURL
        // this.businessTableData[this.selectIndex].pictureName = annexName
        this.largeConfigData(this.businessTableData[this.selectIndex])
      }
    },
    // 项目分类
    managementsTypes () {
      service.http.get('/cms/api/project-managements/types').then(res => {
        if (res.status === 200) {
          const defaultType = [{ value: '全部', id: '' }]
          this.category = [...defaultType, ...res.data]
          this.category.forEach(ele => {
            ele.selected = false
          })
        }
      })
    },
    async getType () {
      let tenantKey = localStorage.getItem('tenantKey')
      let result = await service.user.corporateCustomers(tenantKey)
      this.businessScreenType = result.data.businessScreenType
    },
    selectNav (index) {
      this.companyName = ''
      this.tabIndex = index
      this.navType = this.navigationBar[index].dataType
      let navigationBarId = this.navigationBar[index].id
      this.queryProjectList(navigationBarId, this.navType)
      // this.queryProjectLimit(navigationBarId, this.navType)
      this.selectIndex = 0
      this.classification = '选择项目分类'
    },
    dataTypeFormat (val) {
      let res = ''
      switch (val) {
        case 'COMPREHENSIVE':
          res = '综合数据'
          break
        case 'BUSINESS':
          res = '商业经营数据'
          break
        case 'SERVICE':
          res = 'O2O业务数据'
          break
        case 'PROPERTY':
          res = '物业管理数据'
          break
        case 'WORK_OFFICE':
          res = '办公经营数据'
          break
        case 'FARM':
          res = '农贸经营数据'
          break
        default:
          break
      }
      return res
    },
    projectConfig (item) {
      service.http.get(`/rts/api/initConfigBylargeId/${item.id}?largeConfigType=${item.largeConfigType}`).then(res => {
        if (res.status === 200) {
          this.dialogTitle = item.name + '配置'
          if (item.largeConfigType === 'NOTCJPANDP') {
            this.officeTableData = [res.data.enterpriseCascadeDto]
            this.officeOperationDialogVisible = true
            // this.$nextTick(() => {
            //   this.expands.push(this.officeTableData[0].id)
            // })
            setTimeout(() => {
              // this.expands.push(this.officeTableData[0].id)
              this.expandAll()
            }, 1000)
          } else {
            if (item.largeConfigType === 'PANDP') {
              this.dialogVisible = true
            } else {
              this.otherDialogVisible = true
            }
            this.largeConfigDataList = res.data.largeConfigDataList
            this.businessTableData = []
            this.largeConfigDataList.forEach(ele => {
              if (ele.usingStatus) {
                this.businessTableData.push(ele)
              }
            })
          }
        }
      })
    },
    expandAll () {
      const els0 = this.$el.getElementsByClassName('el-table__row--level-0')
      const els1 = this.$el.getElementsByClassName('el-table__row--level-1')
      const els2 = this.$el.getElementsByClassName('el-table__row--level-2')
      els0[0].getElementsByClassName('el-table__expand-icon')[0] && els0[0].getElementsByClassName('el-table__expand-icon')[0].click()
      els1[0].getElementsByClassName('el-table__expand-icon')[0] && els1[0].getElementsByClassName('el-table__expand-icon')[0].click()
      els2[0].getElementsByClassName('el-table__expand-icon')[0] && els2[0].getElementsByClassName('el-table__expand-icon')[0].click()
    },
    swiperInit () {
      // eslint-disable-next-line no-unused-vars
      var mySwiper = new Swiper('.swiper-container', {
        slidesPerView: 3,
        loopedSlides: 1,
        slidesPerGroup: 3,
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
    getNavigationBar2 () {
      let tenantKey = localStorage.getItem('tenantKey')
      // let tenantKey = 'chj'
      service.http.get(`/rts/api/company/corporateDatatype?companyCode=${tenantKey}`).then(res => {
        this.navigationBar = res.data
        this.groupImg = this.navigationBar[0].companyImage ? this.navigationBar[0].companyImage : group

        this.navType = this.navigationBar[0].dataType
        this.queryProjectList(this.navigationBar[0].id, this.navigationBar[0].dataType)
      })
    },
    getNavigationBar () {
      service.http.get(`/rts/api/large-data-types/BycompanyCode`).then(res => {
        if (res.status === 200) {
          // eslint-disable-next-line no-undef
          if (res.data.length === 1 && !isBack) {
            this.goToScreen1(res.data[0])
            return
          }
          this.navigationBar = res.data
          if (this.navigationBar.length > 6) {
            this.showScreenH = true
          }
        }
      })
    },
    queryProjectList (navigationBarId, navigationBarType, TypeId) {
      service.http.get('/cms/api/project-managements', { page: 0, size: 50, sort: 'desc', useStatus: 'USING', projectName: '', projectManagementTypeId: TypeId }).then(res => {
        var projectList = res.data
        this.projectList = projectList
        this.projectList.forEach(ele => {
          ele.selected = false
        })
        this.queryProjectLimit(navigationBarId, navigationBarType)
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
    goToScreen1 (item) {
      service.http.get(`/rts/api/checkConfigInfo/${item.id}`).then(res => {
        if (res.status === 200 && res.data.status) {
          // const dataType = this.dataTypeFormat(item.largeConfigType)
          console.log(1, item.largeConfigType)
          console.log(item.largeConfigType === 'NOTCJPANDP', item.largeConfigType === 'NOTCJPNOTP')
          // eslint-disable-next-line eqeqeq
          console.log(item.largeConfigType == 'NOTCJPANDP', item.largeConfigType == 'NOTCJPNOTP')
          // eslint-disable-next-line eqeqeq
          if (item.largeConfigType == 'NOTCJPANDP' || item.largeConfigType == 'NOTCJPNOTP') {
            console.log(2)
            this.$router.push({
              path: '/park',
              query: {
                id: item.id,
                dataType: item.largeConfigType,
                name: item.name
              }
            })
            return
          }
          this.$router.push({
            path: '/projectlist',
            query: {
              id: item.id,
              dataType: item.largeConfigType,
              name: item.name,
              mark: item.mark
            }
          })
          console.log(3)
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    goToScreen (item) {
      if (!item.hasLimit) {
        return
      }
      if (this.navType === 'SERVICE') {
        this.$router.push({
          path: '/O2O',
          query: {
            id: item.id,
            name: item.shorName
          }
        })
      } else if (this.navType === 'BUSINESS') {
        let routePath = ''
        if (this.businessScreenType === 'ONE') {
          routePath = '/businessOperation'
        } else if (this.businessScreenType === 'TWO') {
          routePath = '/businessForChj'
        } else {
          routePath = '/businessForTemplate3'
        }
        this.$router.push({
          path: routePath,
          query: {
            id: item.id,
            name: item.shorName,
            dataType: this.navType,
            TypeId: this.TypeId
          }
        })
      } else if (this.navType === 'WORK_OFFICE') {
        let routePath = '/businessTemplate3Park'
        this.$router.push({
          path: routePath,
          query: {
            id: item.id,
            name: item.shorName,
            dataType: this.navType,
            TypeId: this.TypeId
          }
        })
      } else if (this.navType === 'COMPREHENSIVE') {
        this.$router.push({
          path: '/comprehensive',
          query: {
            id: item.id,
            name: item.shorName,
            dataType: this.navType
          }
        })
      } else if (this.navType === 'PROPERTY') {
        this.wylogin()
        this.$router.push({
          path: '/estateManagement',
          query: {
            id: item.id,
            name: item.shorName
          }
        })
      } else if (this.navType === 'FARM') {
        this.$router.push({
          path: '/agriculturalTrade',
          query: {
            id: item.id,
            name: item.shorName
          }
        })
      }
    },
    wylogin () {
      let user = JSON.parse(window.sessionStorage.getItem('user'))
      service.http.post('/tmg/rest/account/login', { 'account': user.xfUserName, 'password': user.xfPassword }).then(res => {
        if (res.data.ret.success === true) {
          let sessionid = res.data.ret.value.sessionid
          service.local.setCookie('sessionid', sessionid)
        }
      })
    },
    businessHandleClose (done) {
      // service.http.put(`/rts/api/large-config-data`, this.businessTableData).then(res => {
      //   console.log(res.data)
      // })
      done()
    },
    handleClose (done) {
      done()
    },
    clickHandle (item, index) {
      // this.selectIndex = index
      // this.currentSelect = item.value
      // this.TypeId = item.id
      item.usingStatus = !item.usingStatus
      if (item.usingStatus) {
        this.businessTableData.push(item)
      } else {
        const index = this.businessTableData.indexOf(item)
        this.businessTableData.splice(index, 1)
      }
      this.largeConfigData(item)
      this.$forceUpdate()
    },
    largeConfigData (obj) {
      service.http.put(`/rts/api/large-config-data`, obj).then(res => {
        console.log(res.data)
      })
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
.switch-screen-h {
  height: px2rem(1570 * 2) !important;
  background-size: 100% 100% !important;
}
.switch-screen {
  width: 100%;
  height: 100%;
  background: url(../../assets/switch-bg.png) no-repeat;
  background-size: cover;
  position: relative;
  .title {
    background: url(../../assets/switch-title.png) no-repeat;
    background-position: 0 px2rem(50);
    background-size: contain;
    width: 26rem;
    height: 2rem;
    margin: 0 auto;
  }
  .common-head {
    width: 100%;
    color: #e9f0fd;
    font-size: px2rem(32);
    margin: px2rem(30) 0 0 0;
    i {
      color: #06e6fa;
      font-size: px2rem(40);
      vertical-align: middle;
      margin-right: px2rem(20);
    }
    .underline {
      width: 75%;
      height: 1px;
      border-top: 1px solid #7e769a;
      opacity: 0.5;
      margin-bottom: px2rem(10);
      margin-left: px2rem(16);
    }
    span {
      display: inline-block;
    }
  }

  .switch-content {
    width: 90%;
    margin: 0 auto;
    display: flex;
    .content-left {
      width: 30%;
      .project-item {
        width: px2rem(930);
        height: px2rem(1140);
        margin-top: px2rem(170);
        border-radius: 5px;
        position: relative;
        .pi-img {
          border-radius: 5px;
          img {
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
            display: inline-block;
            position: absolute;
            top: 35%;
            left: 38%;
            color: #cecece;
          }
        }
      }
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
    width: px2rem(2200);
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
  .project-slide {
    /* text-align: center; */
    font-size: 18px;
    // background: #fff;
    /* height: calc((100% - 30px) / 2); */
    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: flex-start;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
    flex-wrap: wrap;
    // width: 100%;
    // height: px2rem(1300);
    margin-left: px2rem(60);
    margin-bottom: px2rem(60);
    .project-item {
      display: inline-block;
      width: px2rem(980);
      height: px2rem(656);
      border-radius: 5px;
      margin-top: px2rem(150);
      &:nth-of-type(2) {
        margin-left: px2rem(188);
        margin-right: px2rem(188);
      }
      &:nth-of-type(5) {
        margin-left: px2rem(188);
        margin-right: px2rem(188);
      }
      &:nth-of-type(8) {
        margin-left: px2rem(188);
        margin-right: px2rem(188);
      }
      .pi-title {
        font-size: px2rem(52);
        font-weight: bold;
        padding: px2rem(20) px2rem(20) px2rem(20) px2rem(30);
        text-align: left;
        position: relative;
        .pi-configure {
          position: absolute;
          display: inline-block;
          width: px2rem(100);
          height: px2rem(60);
          line-height: px2rem(55);
          text-align: center;
          color: #0af4ff;
          border: 1px solid #1fe4f0;
          font-size: px2rem(30);
          border-radius: px2rem(4);
          right: px2rem(40);
        }
      }
    }
  }
  .category {
    width: px2rem(1620) !important;
    min-height: px2rem(1000);
    /* background: #354068!important; */
    background-color: transparent !important;
    background-image: url("../../assets/dialog.png") !important;
    background-size: 100% 100%;
    border-radius: 5px !important;
    position: relative;
    .el-dialog__title {
      font-size: px2rem(40);
      font-weight: 400;
      color: #ffffff;
    }
    .el-dialog__close {
      font-size: px2rem(56);
    }
    .el-dialog__header {
      border-bottom: 1px solid rgba(108, 129, 170, 0.7);
      padding-bottom: px2rem(40);
      margin: 0;
    }
    .el-dialog__body {
      border: none;
      margin: 0 px2rem(40);
    }
    .category-content {
      display: flex;
      flex-wrap: wrap;
      /* margin: 50px 0; */
      .span-warp {
        margin-top: px2rem(50);
        span {
          display: inline-block;
          width: px2rem(260);
          height: px2rem(90);
          line-height: px2rem(90);
          text-align: center;
          background: #242e5f;
          border: 1px solid #6c81aa;
          border-radius: 3px;
          color: #fff;
          font-size: px2rem(34);
          font-weight: 400;
          margin-bottom: px2rem(60);
          cursor: pointer;
          position: relative;
          margin-right: px2rem(52);
          &:nth-of-type(5n) {
            margin-right: 0;
          }
          overflow: hidden;
        }
      }
      .select {
        border: 1px solid #06e6fa !important;
        color: #06e6fa !important;
      }
      .selectIcon {
        display: inline-block;
        width: 30px;
        height: 30px;
        position: absolute;
        right: 0;
        bottom: 0;
        background: url("../../assets/selected2.png") right bottom no-repeat;
        background-size: contain;
      }
      .table {
        width: 100%;
        border: none;
        font-size: px2rem(24);
        margin-top: px2rem(30);
        > .tableHead {
          height: px2rem(80);
          line-height: px2rem(80);
          padding-left: px2rem(40);
          display: flex;
          background: #2b2570;
          color: #b1a8d1;
          font-size: px2rem(32);
          li {
            text-align: center;
            &:nth-child(1) {
              width: 20%;
              text-align: left;
            }
            &:nth-child(2) {
              width: 45%;
            }
            &:nth-child(3) {
              width: 35%;
            }
            &:nth-child(4) {
              width: 20%;
            }
            &:nth-child(5) {
              width: 20%;
            }
          }
        }
        > .tableBody {
          color: #e9f0fd;
          min-height: px2rem(366);
          padding-left: px2rem(40);
          font-size: px2rem(28);
          > li {
            height: px2rem(70);
            line-height: px2rem(70);
            display: flex;
            cursor: pointer;
            > span {
              text-align: center;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              &:nth-child(1) {
                width: 20%;
                text-align: left;
              }
              &:nth-child(2) {
                width: 45%;
              }
              &:nth-child(3) {
                width: 35%;
                color: #06e6fa;
              }
              &:nth-child(4) {
                width: 15%;
              }
              &:nth-child(5) {
                width: 20%;
                display: flex;
                align-items: center;
                padding-left: px2rem(20);
              }
            }
          }
          .operation {
            > span {
              margin: 0 px2rem(30);
            }
          }
        }
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
  .office-operation {
    .el-table,
    .el-table__expanded-cell {
      background-color: transparent;
      color: #fff;
    }
    .el-table th,
    .el-table tr {
      background-color: transparent;
    }
    .el-table__header {
      border: none;
    }
    .el-table__expand-icon > .el-icon {
      color: #fff;
    }
    .el-table__header thead {
      color: #b1a8d1 !important;
      background-color: #2b2570;
    }
    .el-table--border,
    .el-table--group {
      border: 1px solid transparent;
    }
    .el-table--border td,
    .el-table--border th,
    .el-table__body-wrapper
      .el-table--border.is-scrolling-left
      ~ .el-table__fixed {
      border: none;
    }
    .el-table::before {
      height: 0;
    }
    .el-table--border::after,
    .el-table--group::after {
      height: 0;
    }
    .el-table td,
    .el-table th.is-leaf {
      border: none;
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td {
      background: transparent;
    }
    .common-head {
      margin-bottom: px2rem(40);
    }
    .showImg {
      color: #06e6fa;
      margin-left: px2rem(40);
      cursor: pointer;
    }
    .el-icon-arrow-right {
      color: #fff;
    }
  }
  .switch-upload {
    width: px2rem(160);
    display: inline-block;
    .oss_file {
      width: px2rem(160) !important;
      border: none !important;
      color: #06e6fa !important;
      font-size: px2rem(28) !important;
      span {
        color: #06e6fa !important;
      }
    }
  }
}
</style>
