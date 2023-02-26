<template>
  <div id="formatPlan"
       @click="showBox=false">
    <span class="page_head_title">招商指导图</span>
    <div class="search-bar">
      <div>
        <span>
          <el-select v-model="projectManagementId"
                     placeholder="项目"
                     @change='getBuliding'>
            <el-option v-for="item in options2"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
        </span>
        <span>
          <el-select v-model="buildingName"
                     placeholder="层/楼平面图"
                     @change="projectChanged">
            <el-option v-for="item in options1"
                       :key="item.id"
                       :label="item.buildingName"
                       :value="item.id">
            </el-option>
          </el-select>
        </span>
        <span>
          <el-select v-model="floorName"
                     placeholder="楼层">
            <el-option v-for="item in options3"
                       :key="item.name"
                       :label="item.name"
                       :value="item.name">
            </el-option>
          </el-select>
        </span>
        <span class="upload">
          <span @click="checkFun"
                v-if="hasAuthority('02020101')"
                class="query-btn">查询</span>
          <el-button type="info"
                     v-else>暂无查看平面图权限</el-button>
        </span>
      </div>
    </div>
    <!--<div class="menu">
        <span @click="switchover">招商进度</span>
        <span class="active">业态分布</span>
      </div>-->
    <div class="content"
         id="content">
      <div class="saclBtn">
        <div class="tips">
          <div v-for="(item, index) in useDTOS"
               :key="index"
               class="colorBox">
            <span>{{item.tenantUseDescription}}</span>
            <span v-for="(items, index) in item.value"
                  :key="index"><i :style="`backgroundColor:${items.description}`"></i>{{items.value}}</span>
          </div>
          <div class="svgComment">注：带有<div class="svgColor">橙色边框</div>的房源代表该房源可招商 </div>
        </div>
        <div class="btn-wrap">
          <el-button size="mini"
                     class="iconfont icon-fangda  up"
                     style="margin-left:15px"
                     :disabled="defaultScale > 1.5"
                     @click="up"> 放大</el-button>
          <el-button size="mini"
                     class="iconfont icon-suoxiao shrink"
                     :disabled="defaultScale < 0.3"
                     @click="shrink"> 缩小</el-button>
          <el-button size="mini"
                     class="iconfont icon-yuanshidaxiao  up"
                     :disabled="defaultScale===initScale"
                     style="margin-left:10px"
                     @click="resetScal"> 原始大小</el-button>
          <div class="planInfoBtn"
               v-if="!isEmpty && this.svgId && hasAuthority('02010207')"
               @click="planInfoEditFun">规划说明</div>
        </div>
      </div>
      <div id="svgDiv"
           @scroll="handleScroll">
        <!-- 去掉右击事件 -->
        <span class="svgHtml"
              id="svgHtml"
              v-html="svgHtml"
              v-show="svgHtmlShow"
              @contextmenu.prevent="editFn($event)"
              @click.stop="clickFun($event)">
        </span>
        <div class="planInfo"
             v-if="svgHtmlShow && (planInfoEdit || planData.content || planData.annexs.length)">
          <div class="main">
            <!-- <p>项目规划说明</p> -->
            <div class="text">
              <div v-if="!planInfoEdit"
                   style="white-space: break-spaces; word-break: break-all;min-height: 120px;"
                   v-html="textarea"></div>
              <!-- <el-input type="textarea"
                        v-else
                        :rows="8"
                        maxlength="2000"
                        placeholder="请输入内容，2000字以内"
                        v-model="textarea">
              </el-input> -->
              <richTextEditor @setEditor="setEditor"
                              :desc="textarea"
                              :dialogFormVisible="planInfoEdit"
                              ref="richTextEditor" />
            </div>
            <div style="height:10px;background:#fafafa;"></div>
            <div class="annexs">
              <div class="title">
                <div class="half_page_title"
                     style="padding: 0;border:none">
                  <div><i></i>附件</div>
                </div>
                <aliUpload class="aliUpload"
                           v-if="planInfoEdit"
                           upLoadText="上传资料"
                           :fileType="fileType"
                           businessType='project'
                           :encrypt="true"
                           :iconShow="true"
                           @setAnnex="setAnnex" />
              </div>
              <div class="list"
                   style="padding-bottom: 50px;">
                <div class="item"
                     v-for="(item,index) in annexs"
                     :key="index">
                  <span>{{item.annexName}}</span>
                  <span>
                    <ailPreview :ailObj="item"
                                :encrypt="true"
                                @setFile="setFile" />
                    <aliDownLoad :item="item"
                                 v-if="!planInfoEdit"
                                 :encrypt="true" />
                    <i class="iconfont icon-lajixiang"
                       v-if="planInfoEdit"
                       @click="dleAnnexes(item,index)"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="footer"
               v-if="planInfoEdit">
            <span class="del"
                  v-if="textarea&&annexs"
                  @click="planInfoVisible=true">删除说明</span>
            <span v-else></span>
            <div>
              <span class="cannel"
                    @click="planInfoCannel">取消</span>
              <span class="save"
                    @click="savePlanInfo">保存</span>
            </div>
          </div>
        </div>
      </div>
      <span class="noData"
            v-if="svgHtml==='' ? true :false">暂无平面图</span>
      <div class="showBox"
           id="showBox"
           v-show="showBox">
        <!-- <div v-for="item in roomInfo.tenants"
             style="margin-bottom:10px"
             :key="item.id">
          <p>预期品牌：{{roomInfo.name && roomInfo.name!=='null'?roomInfo.name:' '}}</p>
          <p>实际品牌：{{item.referred}}</p>
          <p>房源号：<span v-for="itm in item.roomsList"
                  :key="itm.id">{{itm.shopNumber}}</span></p>
          <p>面积：<span>{{setArea(item.roomsList)}}m²</span></p>
          <p>实时单价：{{formatContractPrice(item.contractPrice, 'M2DAYS')}}</p>
        </div>
        <div v-for="item in roomInfo.noTenantRooms"
             style="margin-bottom:10px"
             :key="item.id">
          <p>房源号：<span>{{item.shopNumber}}</span></p>
          <p>预期品牌：{{roomInfo.name && roomInfo.name!=='null'?roomInfo.name:' '}}</p>
          <p>实际品牌：</p>
          <p>面积：<span>{{item.buildingArea}}m²</span></p>
          <p>招商指导价：{{formatContractPrice(item.expectedUnitPrice, item.priceUnit)}}</p>
        </div> -->
        <div v-for="item in roomInfo.list"
             style="margin-bottom:10px"
             :key="item.id">
          <p>房源号：<span>{{item.shopNumber}}</span></p>
          <p>预期业态：{{item.industryName}}</p>
          <p>预期品牌：{{item.expectReferred}}</p>
          <p>实际品牌：{{item.referred}}</p>
          <p>面积：<span>{{item.buildingArea}}m²</span></p>
          <!-- <p>招商指导价：{{formatContractPrice(item.expectedUnitPrice, item.priceUnit)}}</p> -->
        </div>
      </div>
    </div>

    <el-dialog class="lockDialogClose"
               :visible.sync="planInfoVisible"
               width="400px"
               append-to-body
               center>
      <div class="lockDialogContent"
           style="padding-left: 40px">
        <img src="../../../assets/jiechu2.png">
        <div>
          <div class="div1">删除</div>
          <div class="div2">确定删除规划说明吗？</div>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <span class="cancel"
              @click="planInfoVisible=false">取消</span>
        <span class="determine"
              @click="delePlanInfo">确定</span>
      </span>
    </el-dialog>
    <!-- 预览 -->
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
    <div class="orderBillDetails" v-if="detailsdrawershow">
      <drawer
        class="storeDetailisClass"
        :show="detailsdrawershow"
        @on-edit="onEdit"
        :title="drawerTitle"
        :showEditBtn="showEditBtn"
        @on-hide="onHide"
      >
      <div class="storeDetailis" slot="drawer">
        <el-tabs class="shopList"
                  v-model="activeName"
                  @tab-click="handleClick">
            <el-tab-pane v-for="(item,index) in roomDetail"
                        :key="index"
                        :label="item.shopNumber"
                        :name="'num' + index">
            <div class="main_content" >
              <div class="half_page_title">
                <div><i></i>基本信息</div>
              </div>
              <div class="contentItem" style="">
                <div class="item">
                      <span class="itemName">招商状态</span>
                      <span v-if="readonly"
                            class="itemTxt">{{formatAttractStatus(item.attractStatus)}}</span>
                      <el-select v-model="item.attractStatus"
                                size="small"
                                v-if="!readonly"
                                placeholder="请选择">
                        <el-option label="可招商"
                                  value="OK"></el-option>
                        <el-option label="不可招商"
                                  value="NO"></el-option>
                      </el-select>
                </div>
                <div class="item">
                      <span class="itemName">房源类型</span>
                      <span class="itemTxt">{{formatInvestmentStatus(item.investmentStatus)}}</span>
                </div>
                <div class="item">
                      <span class="itemName">面积(m²)</span>
                      <span class="itemTxt">{{item.buildingArea}}</span>
                      <!-- <el-input v-if="!readonly" size="small" v-model="item.buildingArea"></el-input> -->
                </div>
                <div class="item">
                      <span class="itemName">实际品牌</span>
                      <span class="itemTxt">{{item.referred}}</span>
                </div>
                <div class="item">
                      <span class="itemName">预期品牌</span>
                      <span v-if="readonly"
                            class="itemTxt">{{item.expectReferred}}</span>
                      <el-input v-if="!readonly" size="small" v-model="item.expectReferred"></el-input>
                </div>
                <!-- <div class="item">
                      <span class="itemName">招商指导价（{{formatPriceUnit(item.priceUnit)}}）</span>
                      <span v-if="readonly"
                            class="itemTxt">{{formatRoomContractPrice(item.expectedUnitPrice)}}</span>
                      <el-input v-if="!readonly" size="small"  type="number"
                      oninput="if(value.length>7)value=value.slice(0,7);if(value<0)value=0"
                      v-model="item.expectedUnitPrice"></el-input>
                </div> -->
                <div class="item">
                      <span class="itemName">预期业态</span>
                      <span v-if="readonly"
                            class="itemTxt">{{item.industryName}}</span>
                            <!-- class="itemTxt">{{formatIndustry(item.industry, index)}}</span> -->
                      <div class="itemSelect" v-for="(ite,inde) in item.industryList" :key="inde">
                        <el-select v-model="ite.id"
                                  size="small"
                                  v-if="!readonly"
                                  @change='changeIndustry($event,index, inde)'
                                  placeholder="请选择">
                          <el-option v-for="e in industryTypeList" :disabled='filterNumber(e.id, index, inde)' :key='e.id' :label="e.value"
                                    :value="e.id"></el-option>
                        </el-select>
                        <div class="plusRemve">
                          <i v-if="!readonly && inde === 0" @click="emitIndustry('add', index, inde)" class="el-icon-circle-plus"></i>
                          <i v-else-if="!readonly && inde !== 0" @click="emitIndustry('remove',index,  inde)" class="el-icon-remove"></i>
                        </div>
                      </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
        <div slot="footer" v-if="!readonly" class="dialog-footer">
          <span @click="onHide" class="details_cannelBtn" style="background: none"
            >取消</span
          >
          <span class="saveSubmit" @click="saveSubmit('editData')">保存</span>
        </div>
      </drawer>
    </div>
  </div>
</template>

<script>
import context from '@/service'
import aliUpload from '@/components/aliUpload.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import ailPreview from '@/components/ailPreview.vue'
import richTextEditor from '@/components/richTextEditor.vue'
import Drawer from '@/components/drawer.vue'
export default {
  name: 'formatPlan',
  components: {
    richTextEditor,
    picturePrevie,
    ailPreview,
    aliUpload,
    aliDownLoad,
    Drawer
  },
  data () {
    return {
      planInfoVisible: false,
      planData: {
        annexs: [],
        content: ''
      },
      drawerForm: {
        investmentStatus: ''
      },
      activeName: 'num0',
      textarea: '',
      showEditBtn: true,
      annexs: [],
      industryTypeList: [],
      industryList: [],
      fileType: [],
      roomDetail: {},
      planInfoEdit: false,
      showPicture: false,
      isEmpty: true, // svgHtml是否为空
      noTenants: false, // svgList Tenants 字段是否为空数组
      buildingNameId: null, // 传入子组件的楼宇id
      hourList: [], // 楼宇列表
      projectConditions: [], // 工程条件详情
      detailsShow: false, // 侧边弹窗
      detailsdrawershow: false, // 房源配置页面
      drawerTitle: '房源配置',
      readonly: true,
      openEngModelShow: false, // 工程条件侧边弹窗
      engData: [], // 工程条件列表
      planeType: 'FLOOR', // 平面图类型
      projectManagementId: '', // 商圈
      floorName: '', // 楼层
      buildingName: '', // 楼号
      berthPlan: 'CANVASS_BUSINESS', // 房源平面
      options1: [],
      options2: [],
      options3: [],
      svgHtml: '',
      svgHtmlShow: false,
      roomInfo: {
        list: [],
        name: null,
        tenants: []
      }, // 单个房间信息
      showBox: false, // 选中展示详情信息
      maxScale: 1,
      maxScaleX: 1,
      maxScaleY: 1,
      roomContractsList: [],
      lastTag: null,
      defaultScale: 1,
      initScale: 1,
      industryOptions: [],
      roomContractsFlag: false,
      svgList: [],
      useDTOS: [],
      imgArr: [],
      currentIndex: 0,
      num: 0
    }
  },
  watch: {
    svgHtml: {
      handler: function (n, o) {
        this.isEmpty = this.svgHtml === ''
      }
    },
    showBox: {
      handler: function (n, o) {
        if (!n) {
          this.reBorderSVG()
        }
      }
    }
  },
  created () {
    this.industry()
    this.options2 = this.$store.state.projectManagementsList
    this.projectManagementId = this.$route.params.projectManagementId ? this.$route.params.projectManagementId : this.$store.state.projectManagementsList[0].id
    this.floorName = this.$route.params.floorName
    this.getBuliding()
  },
  mounted () {

  },
  computed: {
    ids: function () {
      let newList = []
      this.roomDetail.forEach((ite, inde) => {
        newList[inde] = []
        this.roomDetail[inde].industryList.forEach((item, index) => {
          newList[inde][index] = []
          newList[inde][index].push(item.id)
        })
      })
      return newList
    }
  },
  methods: {
    setEditor (html) {
      this.textarea = html
    },
    planInfoCannel () {
      this.planInfoEdit = false
      this.checkFun()
    },
    planInfoEditFun () { // 编辑新增规划说明
      if (this.planInfoEdit) return
      this.planInfoEdit = true
      this.SVGAutoscale()
    },
    savePlanInfo () {
      let id = this.svgId
      context.http.put('/cms/api/plan/explain', { id: id, content: this.textarea, annexs: this.annexs }).then(res => {
        this.$message({
          message: '保存成功！',
          type: 'success'
        })
        this.checkFun()
        this.planInfoEdit = false
      }).catch(error => {
        console.info(error)
      })
    },
    delePlanInfo () {
      let id = this.svgId
      context.http.put('/cms/api/plan/explain', { id: id, content: '', annexs: [] }).then(res => {
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
        this.checkFun()
        this.planInfoEdit = false
        this.planInfoVisible = false
      }).catch(error => {
        console.info(error)
      })
    },
    dleAnnexes (item, index) {
      this.annexs.splice(index, 1)
    },
    setFile (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    setAnnex (annexURL, annexName) {  // 子组件上传成功返回文件url 和名字
      this.annexs.push({
        'annexName': annexName,
        'annexURL': annexURL
      })
    },
    formatAttractStatus (val) {
      let temp
      if (val === 'OK') {
        temp = '可招商'
      } else if (val === 'NO') {
        temp = '不可招商'
      }
      return temp
    },
    formatInvestmentStatus (val) {
      let temp
      if (val === 'OK') {
        temp = '普通房源'
      } else if (val === 'NO') {
        temp = '自用'
      } else if (val === 'FICTITIOUS') {
        temp = '虚拟房源'
      }
      return temp
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
      priceNum = Number(priceNum)
      return priceNum.toFixed(2) + priceUnit
    },
    formatPriceUnit (val) {
      let priceUnit
      if (val === 'M2DAYS') {
        priceUnit = '元/㎡天'
      } else if (val === 'M2MONTH') {
        priceUnit = '元/㎡月'
      } else if (val === 'DAY') {
        priceUnit = '元/天'
      } else if (val === 'MONTH') {
        priceUnit = '元/月'
      }
      return priceUnit
    },
    formatRoomContractPrice (price) {
      let priceNum = price || 0
      priceNum = Number(priceNum)
      return priceNum.toFixed(2)
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
    async industry () {
      let result = await context.http.get(
        '/uaa/api/paramet-managements/name?name=行业'
      )
      this.industryOptions = result.data
    },
    handleScroll (el) {
      this.showBox = false
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    onHide () {
      this.detailsdrawershow = false
      this.readonly = true
      this.showEditBtn = true
      this.activeName = 'num0'
      this.checkFun()
    },
    onEdit () {
      this.readonly = !this.readonly
      this.showEditBtn = false
    },
    handleClick (tab, event) {
      this.currentIndex = tab.index
      this.getIndustryTypeList(this.roomDetail[tab.index].roomsUse)
    },
    editFn (event) { // 鼠标右键事件
      let self = event.target
      this.svgList.forEach(item => {
        if (self.id === item.svgId) {
          this.detailsdrawershow = true
          this.roomDetail = item.list

          this.getIndustryTypeList(this.roomDetail[0].roomsUse)

          this.roomDetail.forEach((item, index) => {
            item.industryList = []
            let temp = []
            if (item.industry) {
              temp = item.industry.split(',')
            }
            temp.forEach(e => {
              if (e !== '') {
                item.industryList.push({id: Number(e)})
              }
            })
            if (item.industryList.length === 0) {
              item.industryList.push({id: null})
            }
          })
        }
      })
    },
    filterNumber (id, parentIndex, index) {
      let temp = this.roomDetail[parentIndex].industryList.some(e => {
        return e.id === id
      })
      return temp
    },
    async getIndustryTypeList (usetype) {
      let type
      if (usetype === 'SHOP') {
        type = '业态'
      } else if (usetype === 'MARKET') {
        type = '菜场业态'
      } else if (usetype === 'WORK') {
        type = '行业'
      }
      let result = await context.http.get(
        `/uaa/api/paramet-managements/name?name=${type}`
      )
      this.industryTypeList = result.data
    },
    formatIndustry (industry, index) {
      let name = ''
      let industryList1 = []
      this.roomDetail[index].industryList.forEach(item => {
        industryList1.push(item.id)
      })
      let industryTypeList = JSON.parse(JSON.stringify(this.industryTypeList))
      industryList1.forEach(e => {
        industryTypeList.forEach((item, index) => {
          if (e === item.id) {
            name = name + industryTypeList[index].value + '/'
          }
        })
      })
      name = name.substring(0, name.length - 1)
      return name
    },
    emitIndustry (type, parentIndex, index) {
      if (type === 'add') {
        this.roomDetail[parentIndex].industryList.push({id: null})
      } else if (type === 'remove') {
        this.roomDetail[parentIndex].industryList.splice(index, 1)
      }
      let industry = ''
      this.roomDetail[parentIndex].industryList.forEach(e => {
        if (e.id > 0) {
          industry = industry + e.id + ','
        }
      })
      this.roomDetail[parentIndex].industry = industry
      this.roomDetail = JSON.parse(JSON.stringify(this.roomDetail))
    },
    saveSubmit () {
      this.roomDetail.forEach((item, index) => {
        context.http.put('/cms/api/rooms', this.roomDetail[index]).then(res => {
          if (res.status === 200) {
            this.onHide()
          }
        })
      })
    },
    changeIndustry (e, parentIndex, index) {
      let newList = JSON.parse(JSON.stringify(this.roomDetail))
      newList[parentIndex].industryList[index].id = e
      let temp = ''
      newList[parentIndex].industryList.forEach(e => {
        temp = temp + e.id + ','
      })
      temp = temp.substring(0, temp.length - 1)
      newList[parentIndex].industry = temp
      this.roomDetail = newList
    },
    clickFun (event) { // 左键展示房间详情
      let self = event.target
      let _this = this
      let top = parseInt($('#svgHtml').css('marginTop'))
      let left = parseInt($('#svgHtml').css('marginLeft'))
      this.showBox = false
      if (self.tagName === 'path' || self.tagName === 'polygon' || self.tagName === 'rect') {
        if (this.lastTag) {
          // $(this.lastTag).attr({ 'stroke-width': $(self).attr('stroke-width'), 'stroke': '#000000' })
        }
        $(self).attr({ 'stroke-width': '2px', 'stroke': '#00ff00' })
        this.lastTag = self
        this.svgList.forEach(item => {
          if (self.id === item.svgId) {
            this.showBox = true
            $('#showBox').css({ top: event.clientY - $('#content').offset().top, left: event.clientX - $('#content').offset().left }) // 计算tips位置
            this.roomInfo = item
            if (item.tenants.length === 0) {
              this.noTenants = true
            } else {
              this.noTenants = false
            }
          }
        })
      }
    },
    reBorderSVG () { // 重新渲染svg带边框
      this.svgList.forEach(item => {
        let temp = item.list[0].attractStatus
        if (temp === 'OK') {
          $('#' + item.svgId).attr({ 'stroke-width': '3px', 'stroke': '#F28341' })
        }
      })
    },
    async checkFun () { // 查看对应平面图
      this.planInfoEdit = false
      if (this.floorName === '' || this.projectManagementId === '') {
        this.$message({
          type: 'error',
          message: '请选择项目和楼层'
        })
        return
      }
      let _this = this
      if (this.buildingName) {
        this.planeType = 'BUILDING'
      } else {
        this.planeType = 'FLOOR'
      }
      let result = await context.http.get('cms/api/plan', { floorName: this.floorName, planeType: this.planeType, projectManagementId: this.projectManagementId, planeStyle: this.berthPlan, buildingName: this.buildingName })
      this.planData = result.data
      this.textarea = this.planData.content
      this.annexs = this.planData.annexs
      this.svgHtml = result.data.svg
      this.useDTOS = result.data.useDTOS
      this.svgId = result.data.id
      this.svgList = result.data.svgList
      this.svgHtmlShow = false
      setTimeout(function () {
        $('#svgDiv svg  title').remove()
        _this.renderSVG()
      }, 100)
    },
    referredFormat (tenantsArr) {
      let tests = ''
      let textArr = []// 实际品牌名拼接
      tenantsArr.forEach(list => {
        textArr.push(list.referred)
      })
      tests = textArr.join('/')
      if (tests === '') {
        tests = '暂无'
      }
      return tests
    },
    renderSVG () { // 重新渲染svg
      // $("#svgHtml polygon[id^='svg_'],#svgHtml rect[id^='svg_'],#svgHtml path[id^='svg_']").attr('fill', '#ffffff') // 渲染默认填充白色 去掉text
      // $("#svgHtml text[id^='shopTextId_'],#svgHtml text[id^='shopNb_']").remove()
      let svgList = this.svgList
      let eleId, shopTextId, x, y, y1, textArr, texts, shopTextDom, referredText, referredDom, buildingArea
      svgList.forEach(item => {
        eleId = item.svgId
        shopTextId = eleId.replace('svg', 'shopTextId')
        buildingArea = 0
        item.list.forEach(itm => {
          buildingArea += itm.buildingArea
        })
        let color = '#eeeeee'
        // if (item.tenants.length) {
        //   color = item.tenants[0].industryDescription
        // }
        if (item.list.length) {
          color = item.list[0].industryCloor || item.list[0].industryDescription || '#eeeeee'
        }
        $('#' + eleId).attr('fill', color)
        let temp = item.list[0].attractStatus
        if (temp === 'OK') {
          $('#' + eleId).attr({ 'stroke-width': '3px', 'stroke': '#F28341' })
        }
        buildingArea = buildingArea.toFixed(2)
        x = !item.svgx || item.svgx === 'null' ? $('#' + eleId).attr('data-x') : item.svgx
        y = !item.svgy || item.svgy === 'null' ? $('#' + eleId).attr('data-y') : item.svgy
        referredDom = $('<text id="' + shopTextId + '_1"  x="' + x + '"  y="' + y + '" font-size="13px"  font-family="MicrosoftYaHei, Microsoft YaHei">' + buildingArea + '㎡</text>')
        if ($('#' + shopTextId).length === 0) {
          $('#svgHtml svg').find($('#' + eleId)).parent().append(referredDom)
          // this.svgHtml = $('#svgHtml').html()
        }
      })
      this.svgHtml = $('#svgHtml').html()
      this.SVGAutoscale()
    },
    SVGAutoscale () { // sgv自适应页面大小
      let DIVw = $('#svgDiv').width()
      if (this.planData.content || this.planData.annexs.length || this.planInfoEdit) {
        DIVw = DIVw - 400
      }
      let DIVh = $('#svgDiv').height()
      if (!$('#svgHtml svg').attr('width') || !$('#svgHtml svg').attr('height')) {
        $('#svgHtml svg').attr('width', '1980')
        $('#svgHtml svg').attr('height', '1080')
      }
      let svgW = parseInt($('#svgHtml svg').attr('width'))
      let svgH = parseInt($('#svgHtml svg').attr('height'))
      let defaultScale = 1
      if (svgW > DIVw) {
        defaultScale = DIVw / svgW
      }
      this.defaultScale = defaultScale
      this.initScale = defaultScale // 默认缩放比例 =》是否展示滚动条
      $('#svgDiv').css({
        'height': svgH * defaultScale,
        'overflow': 'inherit'
      })
      $('#svgHtml').width(svgW * defaultScale)
      $('#svgHtml').height(svgH * defaultScale)
      this.svgHtmlShow = true
      this.$nextTick(() => {
        $('#svgHtml svg').css({
          'transform': `scale(${this.defaultScale})`,
          'transform-origin': '0 0 0'
        })
      })
    },
    resetScal () {
      let svgW = parseInt($('#svgHtml svg').attr('width'))
      let svgH = parseInt($('#svgHtml svg').attr('height'))
      this.defaultScale = this.initScale
      $('#svgHtml svg').css({
        'transform': `scale(${this.defaultScale})`,
        'transform-origin': '0 0 0'
      })
      $('#svgHtml').css({
        'overflow': 'inherit',
        'justify-content': 'center'
      })
      // $('#svgHtml').width(svgW * this.defaultScale)
      // $('#svgHtml').height(svgH * this.defaultScale)
    },
    shrink () {
      if (this.defaultScale < 0.3) {
        return
      }
      this.defaultScale = this.defaultScale - 0.1
      let DIVw = $('#svgHtml').width()
      let DIVh = $('#svgHtml').height()
      let svgW = parseInt($('#svgHtml svg').attr('width'))
      let svgH = parseInt($('#svgHtml svg').attr('height'))
      if (this.defaultScale > this.initScale) { // 如果当前比例大于默认比例则出现滚动条
        $('#svgHtml').css({
          'overflow': 'scroll',
          'justify-content': 'flex-start'
        })
      } else {
        $('#svgHtml').css({
          'overflow': 'inherit',
          'justify-content': 'center'
        })
      }
      $('#svgHtml svg').css({
        'transform': `scale(${this.defaultScale})`,
        'transform-origin': '0 0 0'
      })
      // $('#svgHtml').width(svgW * this.defaultScale)
      // $('#svgHtml').height(svgH * this.defaultScale)
    },
    up () {
      if (this.defaultScale > 1.5) {
        return
      }
      this.defaultScale += 0.1
      let DIVw = $('#svgHtml').width()
      let DIVh = $('#svgHtml').height()
      let svgW = parseInt($('#svgHtml svg').attr('width'))
      let svgH = parseInt($('#svgHtml svg').attr('height'))
      if (this.defaultScale > this.initScale) { // 如果当前比例大于默认比例则出现滚动条
        $('#svgHtml').css({
          'overflow': 'scroll',
          'justify-content': 'flex-start'
        })
      } else {
        $('#svgHtml').css({
          'overflow': 'inherit',
          'justify-content': 'center'
        })
      }
      $('#svgHtml svg').css({
        'transform': `scale(${this.defaultScale})`,
        'transform-origin': '0 0 0'
      })
      // $('#svgHtml').width(svgW * this.defaultScale)
      // $('#svgHtml').height(svgH * this.defaultScale)
    },
    pictureClose () {
      this.showPicture = false
    },
    async getBuliding () {
      // let result = await context.http.get('cms/api/buildings', { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING', projectId: this.projectManagementId })
      let result = await context.http.get('cms/api/buildings/newList', { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING', projectId: this.projectManagementId })
      if (result.data && result.data.length) {
        this.options1 = result.data
        this.options1.unshift({ id: null, buildingName: '层平面图' })
        this.buildingName = this.options1[0].id
        this.projectChanged()
      }
    },
    async projectChanged () { // 选定商圈请求楼层
      let result = await context.http.get('cms/api/floors/svg', { projectManagementId: this.projectManagementId, buildingId: this.buildingName })
      this.options3 = result.data
      if (this.options3.length > 0) {
        let defultFloorName = ''
        this.options3.forEach((item, index) => {
          if (item.name === '1' || item.name === '一层' || item.name === '一' || item.name === '1层') {
            defultFloorName = item.name
          }
        })
        defultFloorName = defultFloorName === '' ? this.options3[0].name : defultFloorName
        this.floorName = this.$route.params.floorName ? this.$route.params.floorName : defultFloorName
        this.checkFun()
        this.$route.params.floorName = null
      }
    }
  }
}
</script>
<style lang="scss">
// 覆盖element样式
#formatPlan {
  .search-bar {
    > div {
      display: inline-flex;
      align-items: center;
    }
  }
  .el-button {
    &.iconfont {
      padding: 11px 10px;
      background-color: #ffffff;
      font-size: 14px !important;
      &.editBtn {
        border-color: #b3bcfc;
        color: #4155f5;
        &:hover {
          background-color: #f6f7ff;
        }
      }
      &.deleteBtn {
        border-color: #ffabb9;
        color: #ed3753;
        &:hover {
          background-color: #fff7f8;
        }
      }
      &.up {
        padding: 7px 8px;
      }
      &.shrink {
        padding: 7px 8px;
      }
    }
  }
  .tips {
    display: block;
    color: #666666;
    width: 80%;
    align-items: center;
    .colorBox {
      border: none;
      color: #000000;
      padding-left: 0px;
    }
    span {
      display: inline-block;
      // width: 50%;
      height: 32px;
      line-height: 32px;
      padding: 0 10px;
      i {
        margin-right: 10px;
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.tips {
  display: flex;
  color: #666666;
  width: 75%;
  align-items: center;
  .colorBox {
    border: 1px solid #eeeeee;
    color: #666666;
    width: 100%;
  }
  .engBtn {
    display: inline-block;
    width: 120px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    background-color: #3175d2ff;
    color: #ffffff;
    cursor: pointer;
    border-radius: 4px;
  }
  span {
    display: inline-block;
    // width: 50%;
    height: 46px;
    line-height: 46px;
    padding: 0 10px;
    i {
      margin-right: 10px;
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
  }
}
.saclBtn {
  display: flex;
  padding: 10px 20px 20px 20px;
  justify-content: space-between;
  .btn-wrap {
    display: flex;
    button {
      height: 30px;
    }
    .planInfoBtn {
      width: 72px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: #ffffff;
      border: 1px solid #3575f6;
      border-radius: 4px;
      font-size: 12px;
      color: #3575f6;
      cursor: pointer;
      margin-left: 12px;
    }
  }
  .tipBox {
    flex: 1;
    .tips {
      width: 97%;
      display: flex;
      border: 1px solid #eeeeee;
      color: #666666;
      padding-left: 15px;
      border-radius: 3px;
      span {
        display: inline-block;
        // width: 50%;
        height: 46px;
        line-height: 46px;
        padding: 0 10px;
        i {
          margin-right: 10px;
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
      }
    }
  }
  .tipBtnBox {
    padding-top: 10px;
  }
  .svgComment {
    color: #524048;
    font-family: PingFang SC;
    padding: 10px 0 0 10px;
    .svgColor {
      color: #F28341;
      display: inline-block;
    }
  }
}
.seachDiv {
  height: 80px;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 4px 4px 4px 1px #eee;
  display: flex;
  align-items: center;
  padding-left: 20px;
  span {
    margin-right: 40px;
  }
}
.content {
  min-height: 750px;
  background-color: #ffffff;
  position: relative;
  padding-bottom: 50px;
}
#svgDiv {
  height: 750px;
  position: relative;
  overflow: auto;
  display: flex;
  justify-content: center;
  // align-items: center;
  #svgHtml {
    &::-webkit-scrollbar {
      width: 8px !important;
      height: 8px !important;
    }
    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px #ffffff;
      background-color: #ffffff;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 6px #bbbbbb;
    }
  }
}
#svgDiv > span {
  flex: 1;
}
.planInfo {
  width: 400px;
  position: relative;
  box-shadow: -4px 3px 5px 0px rgba(188, 200, 209, 0.17);
  padding: 15px 0;
  > .footer {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 0 15px;
    justify-content: space-between;
    background: #fff;
    span {
      display: inline-block;
      width: 90px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      font-size: 14px;
      cursor: pointer;
      &.del {
        background: rgba(210, 59, 47, 0.1);
        border: 1px solid #d23b2f;
        border-radius: 4px;
        color: #d92e20;
      }
      &.cannel {
        color: #777777;
      }
      &.save {
        background: #3577f6;
        border-radius: 4px;
        color: #ffffff;
      }
    }
  }
  > .main {
    // height: 740px;
    height: 100%;
    overflow: auto;
    background-color: #fff;
    > p {
      background-color: #fff;
      font-size: 16px;
      font-weight: bold;
      color: #262626;
      text-align: center;
      margin-bottom: 28px;
      padding: 0 15px;
    }
    > .text {
      padding: 0 15px;
      margin-bottom: 15px;
    }
    > .annexs {
      padding: 0 15px;
      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #f6f6f6;
      }
      .list {
        .item {
          height: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #f6f6f6;
          > span {
            &:first-child {
              width: 410px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            &:last-child {
              display: flex;
            }
            .iconfont {
              cursor: pointer;
              margin-left: 5px;
            }
          }
        }
      }
    }
    &::-webkit-scrollbar {
      width: 4px !important;
      height: 4px !important;
    }
    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px #ffffff;
      background-color: #ffffff;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 6px #cccccc;
    }
  }
}
.noData {
  background-color: rgba(0, 0, 0, 0.5);
  color: #ffffff;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 150px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  border-radius: 5px;
}
svg {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
.showBox {
  // width: 145px;
  position: absolute;
  top: 0px;
  left: 100px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  color: #fff;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
}
.drawerDetailis {
  width: 600px;
  padding-top: 30px;
  .el-form-item {
    display: inline-block;
    width: 280px;
    padding-left: 10px;
    .itemName {
      width: 30px;
    }
  }
}
.dialog-footer {
    > span {
      display: inline-block;
      color: #777777;
      height: 34px;
      line-height: 34px;
      text-align: center;
      padding: 0 21px;
      cursor: pointer;
      background: rgba(243, 244, 250, 1);
      border-radius: 4px;
      margin-left: 10px;
      &.closeBtn {
      }
      &.saveBtn {
        border: 1px solid rgba(53, 117, 246, 1);
        color: #3575f6;
      }
      &.saveSubmit,
      &.passBtn {
        background: rgba(53, 117, 246, 1);
        color: #fff;
      }
      &.rejectBtn {
        color: #e0434e;
        background: rgba(253, 235, 237, 1);
        border: 1px solid #c1bdbd;
      }
    }
  }
  .main_content {
    height: 100%;
    background-color: #fff;
    padding: 0;
    .contentItem {
      padding: 15px;
      display: flex;
      flex-wrap: wrap;
      background-color: #fff;
      width: 100%;
      .item {
        width: 50%;
        .itemName {
          display: block;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #777;
          line-height: 35px;
        }
        .itemSelect {
          margin-bottom: 10px;
          margin-top: -12px;
          height: 36px;
          line-height: 46px;
          vertical-align: bottom;
          .plusRemve {
            display: inline-block;
            margin-top: 4px;
            margin-left: 4px;
            cursor: pointer;
          }
          .el-icon-circle-plus {
            font-size: 26px;
            color: #79CB54;
            margin-top: 6px;
          }
          .el-icon-remove {
            font-size: 26px;
            color: #E44567;
          }
        }
        .itemTxt {
          display: block;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #333;
          line-height: 35px;
        }
        .el-input {
          width: 190px;
        }
      }
    }
  }
.storeDetailisClass {
  .el-tabs__nav {
    .el-tabs__item {
      height: 26px;
      line-height: 26px;
      font-size: 14px;
      background: #fff;
      border: 1px solid #cccccc;
      border-radius: 4px;
      padding: 0 10px !important;
      margin-right: 10px;
      &.is-active {
        background: #eef4ff;
        border: 1px solid #9fbfff;
        color: #3175f6;
      }
    }
  }
  .el-tabs__active-bar {
    display: none;
  }
  .el-tabs__item:hover {
    color: #3175f6;
  }
  > div {
    &.drawer {
      background-color: #faf7fa !important;
      .wrap {
        height: 100%;
        .drawer-head {
          .dweditbtn {
            display: flex!important;
          }
        }
      }
      .storeDetailis {
        margin: 0;
        height: calc(100% - 60px);
        overflow: hidden;
        width: 800px;
        .shopList {
          padding: 10px 15px;
          border-top: 1px solid #f2f2f2;
          margin: 0;
          background-color: #ffffff;
          height: 80%;
        }
      }
    }
  }

}
.drawer-head .dweditbtn {
  display: flex!important;
}
</style>
