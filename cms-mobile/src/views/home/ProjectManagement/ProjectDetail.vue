<template>
  <div class="projectDetail">
    <app-header title="项目详情"
                class="retitle"
                :onBack="true"
                :backRoute="backRoute">
    </app-header>
    <div class="content-warp">
      <!-- 导航区域 -->
      <ul class="navs">
        <li v-for="(item, index) in navsList"
            :key="index"
            :class="{active: active===index}"
            @click="switchTo(index)">
          {{item}}
          <div class="underline"
               v-show="active===index"></div>
        </li>
      </ul>
      <div class="content"
           v-show="active === 0">
        <div class="basic-information">
          <div class="content-title">项目信息</div>
          <div class="ul-warp">
            <div class="content-ul">
              <span>管理企业</span>
              <span>{{projectDetail.originalProjectName}}</span>
            </div>
            <div class="content-ul">
              <span>项目代码</span>
              <span>{{projectDetail.projectCode}}</span>
            </div>
            <div class="content-ul">
              <span>项目名称</span>
              <span>
                {{projectDetail.projectName}}
              </span>
            </div>
            <div class="content-ul">
              <span>对外招租名称</span>
              <span>{{projectDetail.outRentName}}</span>
            </div>
            <div class="content-ul">
              <span>资产投资方式</span>
              <span>{{projectDetail.investType === 'INDEPENDENT' ? '独立' : '合作'}}</span>
            </div>
            <div class="content-ul">
              <span>农方股权比例</span>
              <span>{{projectDetail.ruralEquityRatio}}%</span>
            </div>
            <div class="content-ul">
              <span>省市区</span>
              <span>
                {{address}}
              </span>
            </div>
            <div class="content-ul">
              <span>具体地址</span>
              <span>
                {{projectDetail.address}}
              </span>
            </div>
            <div class="content-ul remark-ul">
              <div class="remark-title">地理位置</div>
              <div class="map"
                   id="container"></div>
            </div>
          </div>
        </div>
        <div class="basic-information">
          <div class="content-title">关联信息</div>
          <ul class="navs navs-Info">
            <li v-for="(item, index) in relatedInfoNavsList"
                :key="index"
                :class="{active: activeInfo===index}"
                @click="switchInfo(index)">
              {{item}}
              <div class="underline"
                   v-show="activeInfo===index"></div>
            </li>
          </ul>
          <div class="ul-warp"
               v-if="activeInfo === 0">
            <div class="content-ul">
              <span>产权人</span>
              <span>{{ projectDetail.propertyOwnerRelation && projectDetail.propertyOwnerRelation.name}}</span>
            </div>
            <div class="content-ul">
              <span>联系人</span>
              <span>
                {{projectDetail.propertyOwnerRelation && projectDetail.propertyOwnerRelation.contacts}}
              </span>
            </div>
            <div class="content-ul">
              <span>联系人职务</span>
              <span>
                {{ projectDetail.propertyOwnerRelation && projectDetail.propertyOwnerRelation.contactsPost}}
              </span>
            </div>
            <div class="content-ul">
              <span>手机号</span>
              <span>
                {{ projectDetail.propertyOwnerRelation && projectDetail.propertyOwnerRelation.telephone}}
              </span>
            </div>
            <div class="content-ul">
              <span>公司固话</span>
              <span>
                {{ projectDetail.propertyOwnerRelation && projectDetail.propertyOwnerRelation.fixedTel}}
              </span>
            </div>
            <div class="content-btn-warp"
                 v-if="projectDetail.propertyOwnerRelation && projectDetail.propertyOwnerRelation.id">
              <div class="content-btn"
                   @click="relationHandler('propertyOwnerRelation', projectDetail.propertyOwnerRelation.id, 0)">查看详情</div>
            </div>
            <!-- <div class="content-ul remark-ul">
              <div class="remark-title">备注</div>
              <span>
                {{projectDetail.propertyOwnerRelation && projectDetail.propertyOwnerRelation.remark}}
              </span>
            </div> -->
          </div>
          <div class="ul-warp"
               v-if="activeInfo === 1">
            <div class="content-ul">
              <span>项目建设单位</span>
              <span>{{ projectDetail.bulidUnitRelation && projectDetail.bulidUnitRelation.name}}</span>
            </div>
            <div class="content-ul">
              <span>联系人</span>
              <span>
                {{projectDetail.bulidUnitRelation && projectDetail.bulidUnitRelation.contacts}}
              </span>
            </div>
            <div class="content-ul">
              <span>联系人职务</span>
              <span>
                {{ projectDetail.bulidUnitRelation && projectDetail.bulidUnitRelation.contactsPost }}
              </span>
            </div>
            <div class="content-ul">
              <span>手机号</span>
              <span>
                {{ projectDetail.bulidUnitRelation && projectDetail.bulidUnitRelation.telephone }}
              </span>
            </div>
            <div class="content-ul">
              <span>公司固话</span>
              <span>
                {{ projectDetail.bulidUnitRelation && projectDetail.bulidUnitRelation.fixedTel}}
              </span>
            </div>
            <div class="content-btn-warp">
              <div class="content-btn"
                   v-if="projectDetail.bulidUnitRelation && projectDetail.bulidUnitRelation.id"
                   @click="relationHandler('bulidUnitRelation', projectDetail.bulidUnitRelation.id, 1)">查看详情</div>
            </div>
            <!-- <div class="content-ul remark-ul">
              <div class="remark-title">备注</div>
              <span>
                {{projectDetail.bulidUnitRelation && projectDetail.bulidUnitRelation.remark}}
              </span>
            </div> -->
          </div>
          <div class="ul-warp"
               v-if="activeInfo === 2">
            <div class="content-ul">
              <span>项目设计单位</span>
              <span>{{ projectDetail.designUnitRelation && projectDetail.designUnitRelation.name }}</span>
            </div>
            <div class="content-ul">
              <span>联系人</span>
              <span>
                {{projectDetail.designUnitRelation && projectDetail.designUnitRelation.contacts}}
              </span>
            </div>
            <div class="content-ul">
              <span>联系人职务</span>
              <span>
                {{ projectDetail.designUnitRelation && projectDetail.designUnitRelation.contactsPost }}
              </span>
            </div>
            <div class="content-ul">
              <span>手机号</span>
              <span>
                {{ projectDetail.designUnitRelation && projectDetail.designUnitRelation.telephone }}
              </span>
            </div>
            <div class="content-ul">
              <span>公司固话</span>
              <span>
                {{ projectDetail.designUnitRelation && projectDetail.designUnitRelation.fixedTel }}
              </span>
            </div>
            <div class="content-btn-warp">
              <div class="content-btn"
                   v-if="projectDetail.designUnitRelation && projectDetail.designUnitRelation.id"
                   @click="relationHandler('designUnitRelation', projectDetail.designUnitRelation.id, 2)">查看详情</div>
            </div>
            <!-- <div class="content-ul remark-ul">
              <div class="remark-title">备注</div>
              <span>
                {{ projectDetail.designUnitRelation && projectDetail.designUnitRelation.remark }}
              </span>
            </div> -->
          </div>
          <div class="ul-warp"
               v-if="activeInfo === 3">
            <div class="content-ul">
              <span>监理单位</span>
              <span>{{ projectDetail.supervisorRelation && projectDetail.supervisorRelation.name }}</span>
            </div>
            <div class="content-ul">
              <span>联系人</span>
              <span>
                {{ projectDetail.supervisorRelation && projectDetail.supervisorRelation.contacts }}
              </span>
            </div>
            <div class="content-ul">
              <span>联系人职务</span>
              <span>
                {{ projectDetail.supervisorRelation && projectDetail.supervisorRelation.contactsPost }}
              </span>
            </div>
            <div class="content-ul">
              <span>手机号</span>
              <span>
                {{ projectDetail.supervisorRelation && projectDetail.supervisorRelation.telephone }}
              </span>
            </div>
            <div class="content-ul">
              <span>公司固话</span>
              <span>
                {{ projectDetail.supervisorRelation && projectDetail.supervisorRelation.fixedTel }}
              </span>
            </div>
            <div class="content-btn-warp">
              <div class="content-btn"
                   v-if="projectDetail.supervisorRelation && projectDetail.supervisorRelation.id"
                   @click="relationHandler('supervisorRelation', projectDetail.supervisorRelation.id, 3)">查看详情</div>
            </div>
            <!-- <div class="content-ul remark-ul">
              <div class="remark-title">备注</div>
              <span>
                {{ projectDetail.supervisorRelation && projectDetail.supervisorRelation.remark }}
              </span>
            </div> -->
          </div>
          <div class="ul-warp"
               v-if="activeInfo === 4">
            <div class="construction-unit"
                 v-for="(item, index) in projectDetail.relations"
                 :key="index">
              <div class="content-ul">
                <span>施工单位</span>
                <span>{{ item && item.name }}</span>
              </div>
              <div class="content-ul">
                <span>施工内容</span>
                <span>{{ item && item.content }}</span>
              </div>
              <div class="content-ul">
                <span>联系人</span>
                <span>
                  {{ item && item.contacts }}
                </span>
              </div>
              <div class="content-ul">
                <span>联系人职务</span>
                <span>
                  {{ item && item.contactsPost }}
                </span>
              </div>
              <div class="content-ul">
                <span>手机号</span>
                <span>
                  {{ item && item.telephone }}
                </span>
              </div>
              <div class="content-ul">
                <span>公司固话</span>
                <span>
                  {{ item && item.fixedTel }}
                </span>
              </div>
              <div class="content-btn-warp">
                <div class="content-btn"
                     v-if="item.id"
                     @click="relationHandler('relations', item.id, 4)">查看详情</div>
              </div>
              <!-- <div class="content-ul remark-ul">
                <div class="remark-title">备注</div>
                <span>
                  {{ item && item.remark }}
                </span>
              </div> -->
            </div>
          </div>
          <div class="ul-warp"
               v-if="activeInfo === 5">
            <div class="construction-unit"
                 v-for="(item, index) in projectDetail.otherRelations"
                 :key="index">
              <div class="content-ul">
                <span>单位名称</span>
                <span>{{ item && item.name }}</span>
              </div>
              <div class="content-ul">
                <span>联系人</span>
                <span>
                  {{ item && item.contacts }}
                </span>
              </div>
              <div class="content-ul">
                <span>联系人电话</span>
                <span>
                  {{ item && item.telephone }}
                </span>
              </div>
              <div class="content-ul">
                <span>备注</span>
                <span>
                  {{ remarkFormat(item.remark) }}
                </span>
              </div>
              <div class="content-btn-warp">
                <div class="content-btn"
                     v-if="item.id"
                     @click="relationHandler('otherRelations', item.id, 5)">查看详情</div>
              </div>
            </div>
          </div>
        </div>
        <div class="basic-information">
          <div class="content-title">设置信息</div>
          <div class="ul-warp">
            <div class="content-ul">
              <span>排序</span>
              <span>{{ projectDetail.sortNumber }}</span>
            </div>
            <div class="content-ul">
              <span>状态</span>
              <span>
                {{formaterUseStatus(projectDetail.useStatus)}}
              </span>
            </div>
            <div class="content-ul remark-ul">
              <div class="remark-title">项目图片<span>（点击可预览）</span></div>
              <span>
                <img :src="projectDetail.previewImage"
                     @click="showImg(projectDetail.previewImage)" />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="content"
           v-show="active === 1"
           style="background: #fff;">
        <div class="ul-warp">
          <div class="content-ul">
            <span>总用地面积/㎡</span>
            <span>{{projectDetail.totalLandArea}}</span>
          </div>
          <div class="content-ul">
            <span>建筑占地面积/㎡</span>
            <span>
              {{projectDetail.newBuildingArea}}
            </span>
          </div>
          <div class="content-ul">
            <span>总计容建筑面积/㎡</span>
            <span>{{projectDetail.totalCapacityBuildingArea}}</span>
          </div>
          <div class="content-ul">
            <span>总建筑面积/㎡</span>
            <span>
              {{projectDetail.totalBuildingArea}}
            </span>
          </div>
          <div class="content-ul">
            <span>地上建筑面积/㎡</span>
            <span>
              {{projectDetail.upBuildingArea}}
            </span>
          </div>
          <div class="content-ul">
            <span>地下建筑面积/㎡</span>
            <span>
              {{projectDetail.downBuildingArea}}
            </span>
          </div>
          <div class="content-ul">
            <span>建筑高度/ｍ</span>
            <span>
              {{projectDetail.buildingHeight}}
            </span>
          </div>
          <div class="content-ul">
            <span>容积率/%</span>
            <span>
              {{projectDetail.plotRatio}}
            </span>
          </div>
          <div class="content-ul">
            <span>绿化率/%</span>
            <span>
              {{projectDetail.greeningRate}}
            </span>
          </div>
          <div class="content-ul">
            <span>汽车停车/个</span>
            <span>
              {{projectDetail.parkingSpace}}
            </span>
          </div>
          <div class="content-ul">
            <span>汽车地上停车/个</span>
            <span>
              {{projectDetail.upParkingSpace}}
            </span>
          </div>
          <div class="content-ul">
            <span>汽车地下停车/个</span>
            <span>
              {{projectDetail.downParkingSpace}}
            </span>
          </div>
          <!-- <div class="content-ul">
            <span>自行车停车/个</span>
            <span>
              {{projectDetail.bikeParkingSpace}}
            </span>
          </div>
          <div class="content-ul">
            <span>自行车地上停车/个</span>
            <span>
              {{projectDetail.upBikeParkingSpace}}
            </span>
          </div>
          <div class="content-ul">
            <span>自行车地下停车/个</span>
            <span>
              {{projectDetail.downBikeParkingSpace}}
            </span>
          </div> -->
        </div>
      </div>
      <div class="content"
           v-if="active === 2">
        <div class="seachInput">
          <form @submit.prevent
                action="#">
            <input class="input"
                   id="seachInput"
                   results="5"
                   focus
                   placeholder="请输入资料编号"
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
          <!-- <span class="cannelBtn"
                v-if="focus"
                @click="toContacts">取消</span> -->
        </div>
        <div class="container">
          <ul v-infinite-scroll="loadMore"
              infinite-scroll-disabled="loadBottom"
              infinite-scroll-distance="20"
              infinite-scroll-immediate-check="false"
              v-if="tableData.length"
              class="list">
            <li @click="toPreview(item)"
                v-for="(item, index) in tableData"
                :key="index">
              <div class="annex-title">
                {{item.annexName}}
              </div>
              <div class="project-center">
                <p class="pj-title">
                  资料类型: {{item.annexNameDescription}}
                </p>
                <p class="pj-title">
                  资料编号: {{item.annexNumber}}
                </p>
                <p class="nav">
                  上传时间: {{createdDateFormat(item.createDateTime)}}
                </p>
              </div>
              <span class="">
                <ailPreview :ailObj="item"
                            text="预览"
                            :encrypt="true"
                            class="ailPreview" />
              </span>
            </li>
          </ul>
          <div class="loadAll"
               v-if="loadAll && tableData.length!==0">
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
      </div>
    </div>

    <!-- 预览 -->
    <picturePrevie :visible.sync="showPicture"
                   :imgList="imgArr"></picturePrevie>
  </div>
</template>
<script>
import context from '@/service'
import AppHeader from '@/components/appHead'
import ailPreview from '@/components/ailPreview.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import AMap from 'AMap'
var map, marker
var geocoder
export default {
  name: 'projectDetail',
  components: { AppHeader, ailPreview, picturePrevie },
  data () {
    return {
      backRoute: '',
      navsList: [
        '项目建设信息',
        '主要经济指标',
        '项目资料库'
      ],
      relatedInfoNavsList: [
        '产权人',
        '项目建设单位',
        '项目设计单位',
        '监理单位',
        '施工单位',
        '其他'
      ],
      active: 0,
      activeInfo: 0,
      projectDetail: {},
      inputValue: '',
      focus: false,
      flag: true,
      page: 0,
      size: 10,
      loadBottom: false,
      tableData: [],
      dataReady: false,
      loadAll: false,
      address: '',
      showPicture: false,
      imgArr: []
    }
  },
  created () {
    this.backRoute = window.sessionStorage.getItem('backRoute')
    const id = this.$route.query.id
    this.projectId = this.$route.query.id
    this.queryProjectDetail(id)
    const tabIndex = localStorage.getItem('tabIndex')
    if (tabIndex) {
      this.switchInfo(Number(tabIndex))
    }
  },
  mounted () {
    this.init()
  },
  beforeRouteEnter (to, from, next) {
    // ...
    if (from.name === 'searchList' || from.name === 'projectInformation') {
      window.sessionStorage.setItem('backRoute', from.name)
    }
    next()
  },
  methods: {
    remarkFormat (str) {
      if (!str) return ''
      if (str.length <= 6) return str
      let tex = str.substr(0, 6) + '...'
      return tex
    },
    relationHandler (type, id, index) {
      window.localStorage.setItem('tabIndex', index)
      window.sessionStorage.removeItem('followRecordDTOParams')
      this.$router.push({ name: 'relatedInformation', query: { 'relatedId': id, 'relateType': type, 'projectId': this.projectId } })
    },
    showImg (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    async queryProjectDetail (id) {
      let result = await context.http.get(`cms/api/project-managements/${id}`)
      this.projectDetail = result.data
      if (this.projectDetail.otherRelations.length === 0) {
        this.projectDetail.otherRelations = [
          {
            'name': '',
            'contacts': '',
            'telephone': '',
            'remark': '',
            'relationType': 'OTHER'
          }
        ]
      }
      this.formaterAddr()
      this.geoAddress()
    },
    // 省市区
    async formaterAddr () {
      if (this.projectDetail.district !== '') {
        this.address = await this.getAddrByCode(this.projectDetail.district)
      } else if (this.projectDetail.city !== '') {
        this.address = await this.getAddrByCode(this.projectDetail.city)
      } else if (this.projectDetail.province) {
        this.address = await this.getAddrByCode(this.projectDetail.province)
      }
    },
    async getAddrByCode (code) {
      let result = await context.http.get(`ywm/api/district-codes/${code}`)
      return result.data.address
    },
    init: function () {
      map = new AMap.Map('container', {
        resizeEnable: true
      })
      if (!geocoder) {
        geocoder = new AMap.Geocoder({
          city: '' // 城市设为北京，默认：“全国”
        })
      }
    },
    geoCode () {
      if (marker) {
        map.remove(marker)
      }
      var _this = this
      let lastIindex = this.provinceAddress.lastIndexOf('区')
      // console.log(this.cascaderData, this.areaOptions)
      var address = this.provinceAddress.substring(0, lastIindex + 1) + this.projectDetail.address
      geocoder.getLocation(address, function (status, result) {
        if (status === 'complete' && result.geocodes.length) {
          var lnglat = result.geocodes[0].location
          _this.projectDetail.lat = result.geocodes[0].location.lat
          _this.projectDetail.lot = result.geocodes[0].location.lng
          marker = new AMap.Marker()
          marker.setLabel({
            offset: new AMap.Pixel(20, -20),
            content: result.geocodes[0].formattedAddress
          })
          map.add(marker)
          marker.setPosition(lnglat)
          map.setFitView(marker)
        } else { console.log(JSON.stringify(result)) }
      })
    },
    geoAddress () {
      if (marker) {
        map.remove(marker)
      }
      let _this = this
      let lnglat = [this.projectDetail.lot, this.projectDetail.lat]
      geocoder.getAddress(lnglat, function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          // result为对应的地理位置详细信息
          _this.provinceAddress = result.regeocode.formattedAddress
          _this.geoCode()
        }
      })
    },
    switchTo (index) {
      this.active = index
      if (index === 2) {
        this.inputValue = ''
        this.page = 0
        this.tableData = []
        this.query()
      }
    },
    switchInfo (index) {
      this.activeInfo = index
    },
    formaterUseStatus (value) {
      if (value === 'USING') {
        return '使用中'
      } else if (value === 'DISABLE') {
        return '已停用'
      } else {
        return value
      }
    },
    compositions (flag) {
      this.flag = flag
    },
    inputFocus () { // 获取焦点
      this.focus = true
    },
    onKeyInput (event) { // 输入
      if (event.keyCode !== 13 && this.flag) {
        this.shadeBox = false
        this.page = 0
        this.tableData = []
        this.$nextTick(() => {
          this.query(true)
        })
      }
    },
    search (event) { // 键盘完成事件
      if (event.keyCode === 13) {
        event.preventDefault() // 禁止默认事件（默认是换行）
        this.inputValue = event.target.value
        this.page = 0
        this.tableData = []
        if (!this.searchTag) this.query(true)
      }
    },
    toContacts () { // 取消
      this.focus = false
      this.shadeBox = false
      this.inputValue = ''
      this.page = 0
      this.tableData = []
      this.query()
    },
    loadMore () {
      this.loadBottom = true
      this.query()
    },
    toPreview () {

    },
    createdDateFormat (val) {
      if (!val) return
      const n = val.replace('T', '  ').replace('Z', '')
      return n
    },
    async query (flag) {
      this.dataReady = false
      this.loadAll = false
      this.searchTag = true
      let result = await context.http.get(`cms/api/project-managements/annexes?projectManagementId=${this.projectDetail.id}`, {
        annexType: '',
        annexNumber: this.inputValue,
        sort: 'createdDate,desc',
        page: this.page,
        size: this.size
      })
      if (result.status === 200) {
        this.dataReady = true
        if (flag) {
          this.tableData = []
        }
        this.tableData = this.tableData.concat(result.data)
        if (this.tableData.length === Number(result.headers['x-total-count'])) this.loadAll = true
        if (result.data.length > 0) {
          this.loadBottom = false
          this.page = this.page + 1
        } else {
          this.page = this.page - 1
        }
        this.searchTag = false
      }
    }
  }
}
</script>
<style lang="scss">
.amap-logo {
  z-index: 1;
}
.amap-copyright {
  display: none !important;
}
</style>
<style lang="scss" scoped>
@import "../../../style/config";
.content-warp {
  margin-top: rem(40);
  font-size: rem(15);
}
/* 导航栏的样式 */
.navs {
  position: fixed;
  top: rem(40);
  width: 100%;
  height: rem(46);
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 3;
  white-space: nowrap;
  overflow-x: scroll;
  box-shadow: 0px 1px 4px 0px rgba(230, 230, 230, 0.5);
}
.navs-Info {
  position: relative;
  overflow-x: scroll;
  justify-content: flex-start;
  top: 0;
  z-index: 0;
  li {
    margin-right: rem(6);
    margin-left: rem(14);
  }
}
.navs li {
  display: inline-block;
  font-size: rem(15);
  color: #444547;
  text-align: center;
}
/* 当导航被点亮后改变颜色 */
.navs .active {
  color: #0139a4;
  font-size: rem(17);
  font-weight: bold;
}
.underline {
  width: rem(94);
  height: rem(3);
  background: rgba(1, 57, 164, 1);
  border-radius: rem(2);
  position: relative;
  top: rem(6);
  margin: 0 auto;
}
.content {
  width: 100%;
  position: relative;
  top: rem(40);
}
.basic-information {
  margin-bottom: rem(10);
  background: #fff;
}
.content-title {
  color: #18191a;
  font-size: rem(17);
  height: rem(40);
  line-height: rem(40);
  font-weight: bold;
  padding-left: rem(14);
  border-bottom: rem(1) solid #f0f0f0;
}
.ul-warp {
  margin: 0 0 0 rem(14);
  border-bottom: rem(1) solid #f0f0f0;
  padding-bottom: rem(16);
  &:last-child {
    border: none;
  }
  .construction-unit {
    border-bottom: rem(1) solid #f0f0f0;
    padding-bottom: rem(10);
    &:last-child {
      border: none;
    }
  }
}
.content-ul {
  display: flex;
  justify-content: space-between;
  padding-top: rem(16) !important;
  padding-right: rem(14);
  font-size: rem(15);
  > span {
    color: #18191a;
    &:first-child {
      color: #858c94;
      min-width: rem(90);
      margin-right: rem(10);
    }
  }
}
.content-btn-warp {
  text-align: center;
  .content-btn {
    display: inline-block;
    width: rem(130);
    height: rem(37);
    line-height: rem(37);
    text-align: center;
    margin-top: rem(20);
    color: #0139a4;
    background: #ffffff;
    border-radius: rem(4);
    border: rem(1) solid #0139a4;
  }
}
.remark-ul {
  display: inline-block;
  width: 100%;
  .remark-title {
    color: #858c94;
    margin-bottom: 16px;
    span {
      font-size: rem(13);
    }
  }
  img {
    width: rem(100);
    height: rem(100);
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
  margin-top: rem(6);
  z-index: 3;
  #seachInput::-webkit-search-cancel-button {
    display: none;
  }
  .mintui-search {
    position: absolute;
    left: rem(20);
    top: rem(22);
    color: #666666;
  }
  .input {
    // width: rem(300);
    width: rem(345);
    height: rem(30);
    background: rgba(244, 244, 244, 1);
    border-radius: rem(2);
    padding-left: rem(25);
    margin-top: rem(10);
    font-size: rem(13);
  }
  .cannelBtn {
    color: #0139a4;
    font-size: rem(15);
    margin-left: rem(10);
  }
}
.container {
  padding-top: rem(50);
  .list {
    li {
      padding: rem(10) rem(14);
      position: relative;
      margin-bottom: rem(10);
      background: #fff;
      .annex-title {
        color: #18191a;
        font-size: rem(17);
        margin-top: rem(10);
        font-weight: bold;
      }
      .project-center {
      }
      > div {
        > p {
          color: #858c94;
          margin-top: rem(10);
          font-size: rem(14);
        }
      }
      > span {
        position: absolute;
        right: rem(10);
        top: rem(45);
        font-size: rem(14);
        color: #0139a4;
      }
    }
  }
}
.noData {
  top: rem(500);
}
.ailPreview {
  /* opacity: 0; */
}
.map {
  width: 100%;
  height: rem(110);
  border: 1px solid #ddd;
}
</style>
