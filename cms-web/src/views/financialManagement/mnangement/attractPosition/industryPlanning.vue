<!-- 项目规划图 -->
<template>
  <div id="projectId1">
    <span class="page_head_title">项目设计</span>
    <ul class="default_tab_block">
      <li class="active"
          v-if="hasAuthority('02010301')">
        <span>项目规划图</span>
      </li>
      <li @click="changeTab"
          v-if="hasAuthority('02010304')">
        <span>CAD底图</span>
      </li>
    </ul>
    <div class="search-bar">
      <div>
        <el-select v-model="projectManagementId"
                   placeholder="项目"
                   @change="getBuliding(true)">
          <el-option v-for="item in options2"
                     :key="item.id"
                     :label="item.referred"
                     :value="item.id">
          </el-option>
        </el-select>

        <el-select v-model="buildingName"
                   placeholder="层/楼平面图"
                   @change="projectChanged(true)">
          <el-option v-for="item in options1"
                     :key="item.id"
                     :label="item.buildingName"
                     :value="item.id">
          </el-option>
        </el-select>

        <el-select v-model="floorName"
                   placeholder="楼层"
                   @change="checkFun">
          <el-option v-for="item in options3"
                     :key="item.name"
                     :label="item.name"
                     :value="item.name">
          </el-option>
        </el-select>
      </div>
      <span class="upload">
        <el-button @click="isCite"
                   size="small"
                   class="iconfont icon-cms_yinyong isCite"> 引用底图</el-button>
        <el-button class="iconfont icon-bianji-"
                   :class="[isEmpty?'disabled':'editBtn']"
                   :disabled="isEmpty"
                   @click="goSvgEditor">
          编辑</el-button>
        <!-- <el-button class="iconfont icon-shanchu-"
                   :class="[isEmpty?'disabled':'deleteBtn']"
                   :disabled="isEmpty"
                   @click="isDel">
          删除</el-button> -->
      </span>
    </div>
    <div class="content">
      <div class="saclBtn">
        <div class="tips">
          <el-button type="primary"
                     class="engBtn"
                     style="padding:9px 20px;"
                     @click="openEngModel(clickEven)"
                     v-if="hasAuthority('02010302')">工程条件</el-button>
          <div>
            <div v-for="(item, index) in useDTOS"
                 :key="index"
                 class="colorBox">
              <span>{{item.tenantUseDescription}}</span>
              <span v-for="(items, index) in item.value"
                    :key="index"><i :style="`backgroundColor:${items.description}`"></i>{{items.value}}</span>
            </div>
          </div>
        </div>
        <div class="btn-wrap">
          <el-button size="mini"
                     class="iconfont icon-fangda  up"
                     style="margin-left:10px"
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
        <span class="svgHtml"
              id="svgHtml"
              v-html="svgHtml"
              v-show="svgHtmlShow"
              @contextmenu.prevent="editFn($event)"
              @click="editFn($event)"></span>
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
            v-if="svgHtml === '' ? true : false">暂无平面图</span>
    </div>
    <!-- 业态半页 -->
    <bindBusiness :detailsdrawershow="bindBusinessShow"
                  :pevDocmentObj="pevDocment"
                  :defaultScale="defaultScale"
                  :bindParams="bindData"
                  @drawerClose="detailsClose"
                  @bindBindBusinessSuccess="bindBindBusinessSuccess" />
    <el-dialog title="解除关联"
               :visible.sync="centerDialogVisible"
               width="30%"
               center>
      <span>确认解除{{ isAll }}{{ unBindInfo }}关联吗？</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="unBind">确 定</el-button>
      </span>
    </el-dialog>
    <openEngModel :openEngModelShow="openEngModelShow"
                  :engData="engData"
                  :hourList="hourList"
                  :projectConditions="projectConditions"
                  :buildingNameId="buildingNameId"
                  :floorName="floorName"
                  :planeType="planeType"
                  :buildingNameText="buildingNameText"
                  :key="timeKey"
                  @openEngModelClose="openEngModelClose"
                  @refreshGetFloorAndProjcet="refreshGetFloorAndProjcet"
                  @updateTimeKey="updateTimeKey"
                  ref="openEngModel" />
    <!-- 删除提示弹窗 -->
    <el-dialog :visible.sync="deleteDialog"
               width="21%"
               center>
      <div class="deleteDialog">
        <img src="../../../../assets/delete1.png" />
        <div>
          <p>删除</p>
          <span>删除后，将无法恢复平面图！</span>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary"
                   @click="deleteFun">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 引用底图提示弹窗 -->
    <el-dialog :visible.sync="citeDialog"
               width="21%"
               center>
      <div class="deleteDialog">
        <img src="../../../../assets/jiechu1.png" />
        <div>
          <p>引用底图</p>
          <span>确定解除绑定并覆盖当前平面图？</span>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="citeDialog = false">取 消</el-button>
        <el-button type="primary"
                   @click="citeFun">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 操作提示 -->
    <div class="hintBox"
         v-if="hintBox">
      <i class="iconfont icon-cha"
         @click="hintBox = false"></i>
      <div>
        <img src="../../../../assets/delete1.png"
             style="width:28px;height:28px;" />
        <div class="hintBoxContent">
          <p>操作提示</p>
          <span>无对应底图可供引用，请先上传底图</span>
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
        <img src="../../../../assets/jiechu2.png">
        <div>
          <div class="div1">删除</div>
          <div class="div2">确定删除规划说明吗？</div>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <span class="cancel"
              @click="planInfoVisible = false">取消</span>
        <span class="determine"
              @click="delePlanInfo">确定</span>
      </span>
    </el-dialog>
    <!-- 预览 -->
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>

  </div>
</template>
<script>
import bindBusiness from '../../../project/planDesign/components/bindBusiness'
import openEngModel from '../components/openEngModel'
import aliUpload from '@/components/aliUpload.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import ailPreview from '@/components/ailPreview.vue'
import context from '@/service'
import richTextEditor from '@/components/richTextEditor.vue'
export default {
  name: 'industryPlanning',
  components: {
    richTextEditor,
    picturePrevie,
    ailPreview,
    aliUpload,
    aliDownLoad,
    openEngModel,
    bindBusiness
  },
  watch: {
    svgHtml: {
      handler: function (n, o) {
        this.isEmpty = this.svgHtml === ''
      }
    }
  },
  data () {
    return {
      planInfoVisible: false,
      planData: {
        annexs: [],
        content: ''
      },
      textarea: '',
      annexs: [],
      fileType: [],
      planInfoEdit: false,
      showPicture: false,
      isEmpty: true, // svgHtml是否为空
      hintBox: false,
      citeDialog: false,
      deleteDialog: false,
      bindBusinessShow: false,
      getEquirementTypes25List: [],
      bindEnergyShow: false,
      tenantIndex1: 0,
      isAll: '该', // 该or所有
      detailsShow3: false,
      ke: 0,
      keys: 1,
      isActive: true,
      centerDialogVisible: false, // 弹窗
      detailsShow: false,
      detailData: [],
      roomList: [], // 房间列表
      planeType: 'FLOOR', // 平面图类型 BUILDING楼平面图 FLOOR层平面图
      projectManagementId: '', // 商圈
      floorName: '', // 楼层
      buildingName: '', // 楼号
      berthPlan: 'BUSINESS_FORMAT', // 平面图类型
      firstTenant: null, // 默认第一栋楼数据
      svgId: null, // 当前楼层整张svg图的id
      options1: [],
      options2: [],
      options3: [],
      svgHtml: '',
      color: '',
      selfTarget: '',
      event: '',
      dialogFromIsShow: false,
      shopInfo: {
        shopName: '',
        id: '',
        shopNum: ''
      },
      bindData: {
        // 绑定入参
        id: '', // 平面图id
        svgId: '', // 单块区域svgId
        roomId: '', // 房源id
        tenantId: '', // 客户id
        file: '' // svg文件
      },
      pevDocment: {
        // 选中的DOm 和之前的样式
        target: null,
        style: null
      },
      offset: {
        offsetX: null,
        offsetY: null
      },
      floorsItem: null,
      maxScale: 1,
      maxScaleX: 1,
      maxScaleY: 1,
      svgHtmlShow: false,
      bindRoomsList: [],
      defaultScale: '1',
      translateX: '0',
      translateY: '0',
      initScale: 1,
      detailsShow2: false,
      bindBindingList: [],
      unBindInfo: '业态',
      bindName: '',
      equipmentType: '26',
      bindFireControlShow: false,
      industryOptions: [],
      engData: [], // 工程条件列表
      timeKey: 0,
      hourList: [], // 楼宇列表
      buildingNameId: null, // 传入子组件的楼宇id
      openEngModelShow: false, // 工程条件侧边弹窗
      projectConditions: [], // 工程条件详情
      buildingNameText: '', // 传入子组件的楼宇名字
      clickEven: null,
      useDTOS: [],
      imgArr: [],
      num: 0
    }
  },
  created () {
    this.industry()
    this.getDataAuthorityOptions() // 商圈列表
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
      let id = this.bindData.id
      if (this.textarea === '' && !this.annexs.length) {
        this.$message.error('保存内容不可为空')
        return
      }
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
      let id = this.bindData.id
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
    isCite () {
      // 引用
      if (this.svgHtml !== '') {
        this.citeDialog = true
      } else {
        this.citeFun()
      }
    },
    citeFun () {
      // 确认引用
      context.http
        .get('cms/api/plan/copy?', {
          floorName: this.floorName,
          planeType: this.planeType,
          projectManagementId: this.projectManagementId,
          planeStyle: this.berthPlan,
          buildingName: this.buildingName
        })
        .then(res => {
          this.citeDialog = false
          this.checkFun()
        })
        .catch(error => {
          this.citeDialog = false
          if (
            error.request.status === 400 &&
            error.response.data === '无对应底图可供引用，请先上传底图！'
          ) {
            this.hintBox = true
            // setTimeout(() => {
            //   this.hintBox = false
            // }, 2000)
          }
          console.info(error)
        })
    },
    isDel () {
      // 删除
      if (this.svgHtml !== '') {
        this.deleteDialog = true
      }
    },
    deleteFun () {
      // 确认删除
      context.http
        .delete(`cms/api/plan/${this.svgId}`)
        .then(res => {
          this.deleteDialog = false
          this.checkFun()
        })
        .catch(error => {
          console.info(error)
        })
    },
    updateTimeKey () {
      ++this.timeKey
    },
    refreshGetFloorAndProjcet (buildingNameId) {
      this.openEngModel(buildingNameId)
    },
    openEngModelClose () {
      this.openEngModelShow = false
    },
    openEngModel (id) {
      // 打开工程条件编辑页
      context.http
        .get('uaa/api/paramet-managements/name?name=工程条件')
        .then(res => {
          this.engData = res.data
          if (this.buildingName) {
            // 楼
            this.planeType = 'BUILDING'
            this.buildingNameId = this.buildingName
            this.getFloorCondition()
          } else {
            // 层
            this.planeType = 'FLOOR'
            this.getFloorAndProjcet(id)
          }
        })
        .catch(error => {
          console.info(error)
        })
    },
    getFloorCondition (id) {
      // 根据楼的id（区别哪栋楼、或者是整层）楼的名称查 当前条件下楼层的工程条件
      context.http
        .get(
          `cms/api/floors/condition?buildingId=${id ||
          this.buildingName}&floorName=${this.floorName}`
        )
        .then(res => {
          if (res.status === 200) {
            this.projectConditions = res.data.projectConditions
            for (let i = 0; i < this.options1.length; i++) {
              if (this.buildingName === this.options1[i].id) {
                this.buildingNameText =
                  this.options1[i].buildingName + `  —— ${this.floorName}`
              }
            }
            this.openEngModelShow = true
            // this.$refs.openEngModel.updateData()
            // console.log('updateData')
          }
        })
        .catch(error => {
          console.info(error)
        })
    },
    getFloorAndProjcet (id) {
      // 根据项目id 、层 请求楼宇列表
      context.http
        .get(
          `/cms/api/buildings/floorAndProjcet?projectManagementId=${this.projectManagementId}&floorName=${this.floorName}`
        )
        .then(res => {
          this.hourList = res.data // 楼宇
          for (let i = 0; i < this.hourList.length; i++) {
            this.hourList[i].buildingName += `   ——  ${this.floorName}`
          }
          if (id) {
            this.buildingNameId = id
          } else {
            this.buildingNameId = res.data[0].id
          }
          ++this.timeKey
          this.getFloorCondition(this.buildingNameId)
        })
        .catch(error => {
          console.info(error)
        })
    },
    async industry () {
      let result = await context.http.get(
        '/uaa/api/paramet-managements/name?name=行业'
      )
      this.industryOptions = result.data
    },
    changeTab () {
      this.$router.push({
        name: 'attractPosition',
        params: {
          projectId: this.projectManagementId,
          buildingId: this.buildingName,
          floorId: this.floorName
        }
      })
    },
    //   跳转svg编辑器
    goSvgEditor () {
      let floorName = encodeURI(encodeURI(this.floorName))
      console.log(floorName)
      if (!this.svgHtml || this.svgHtml === '') return
      let origin = window.location.origin
      console.log(this.projectManagementId)
      console.log(this.floorName)
      console.log(this.planeType)
      let equipmentType = ''
      if (this.berthPlan !== 'ENERGY_CONSUMPTION') {
        equipmentType = null
      } else {
        equipmentType = this.equipmentType
      }
      window.open(
        origin +
        '/svg-editor/index.html?projectManagementId=' +
        this.projectManagementId +
        '&floorName=' +
        floorName +
        '&buildingName=' +
        this.buildingName +
        '&planeType=' +
        this.planeType +
        '&planeStyle=' +
        this.berthPlan +
        '&equirementTypeChildId=' +
        equipmentType,
        '_blank'
      )
    },
    updateKey (tenantIndex1, saveSuccess) {
      if (saveSuccess === 'saveSuccess') {
        this.tenantIndex1 = tenantIndex1
      } else {
        ++this.ke
      }
    },
    updataCompents (bindName, tenantIndex1, saveSuccess) {
      if (saveSuccess === 'saveSuccess') {
        this.tenantIndex1 = tenantIndex1
      } else {
        this.tenantIndex1 = tenantIndex1
        this.bindName = bindName
        ++this.keys
      }
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    handleScroll (el) {
      this.showBox = false
    },
    bindSuccessFun (arr) {
      // 参数：绑定成功后绑定列表
      this.bindRoomsList = arr.svgList
      this.bindBindingList = arr.bindingList
      this.pevDocment.target = null // 如绑定成功则清除上一次右键选中svg样式
      this.renderSVG()
      this.getFloors()
    },
    bindTenantSuccess (arr) {
      // 参数：绑定成功后绑定列表
      this.bindRoomsList = arr.svgList
      this.bindBindingList = arr.bindingList
    },
    bindBindBusinessSuccess (arr) {
      // 参数：绑定成功后绑定列表
      // this.checkFun()
      this.svgHtml = arr.svg // 跟新解绑后的SVG图
      this.useDTOS = arr.useDTOS
      this.svgId = arr.id
      this.bindData.id = arr.id // svg图Id
      this.bindRoomsList = arr.svgList // 已绑定房源列表
      this.bindBindingList = arr.bindingList // 已绑定房源id
      this.pevDocment.target = null
      let _this = this
      setTimeout(function () {
        _this.renderSVG()
        _this.SVGAutoscale()
      }, 100)
    },
    svgHtmlEmitFn (str) {
      this.svgHtml = str
    },
    floorDataFn (n, i) {
      this.firstTenant = n
      this.tenantIndex1 = i
    },
    async getDataAuthorityOptions (searchKey) {
      // 项目
      let result = await context.http.get('cms/api/project-managements', {
        page: 0,
        size: 100,
        sort: 'desc',
        useStatus: 'USING'
      })
      this.options2 = result.data
      this.projectManagementId = this.$route.params.projectId ? this.$route.params.projectId : this.options2[0].id
      this.getBuliding()
    },
    async getBuliding (mark) {
      // 楼宇
      let result = await context.http.get(
        'cms/api/buildings/newList?sort=sortNumber,asc&sort=id,asc',
        {
          page: 0,
          size: 100,
          useStatus: 'USING',
          projectId: this.projectManagementId
        }
      )
      if (result.data && result.data.length) {
        this.options1 = result.data.filter((item, index) => {
          return item.assetsType === 'BUILDING'
        })
        // this.options1 = result.data
        this.options1.unshift({ id: null, buildingName: '层平面图' })
        if (!mark) {
          this.buildingName = this.$route.params.buildingId ? this.$route.params.buildingId : this.options1[0].id
          this.projectChanged()
        } else {
          this.buildingName = this.options1[0].id
          this.projectChanged(true)
        }
      }
    },
    async projectChanged (mark) {
      // 楼层
      let result = await context.http.get('cms/api/floors/svg', {
        projectManagementId: this.projectManagementId,
        buildingId: this.buildingName
      })
      this.options3 = result.data
      if (this.options3.length > 0) {
        let defultFloorName = ''
        this.options3.forEach((item, index) => {
          if (item.name === '1' || item.name === '一层' || item.name === '一' || item.name === '1层') {
            defultFloorName = item.name
          }
        })
        defultFloorName = defultFloorName === '' ? this.options3[0].name : defultFloorName
        if (!mark) {
          this.floorName = this.$route.params.floorId ? this.$route.params.floorId : defultFloorName
        } else {
          this.floorName = defultFloorName
        }
        this.checkFun()
      }
    },
    async checkFun () {
      this.svgHtml = ''
      // 查看对应平面图
      this.svgHtmlShow = false
      this.planInfoEdit = false
      let _this = this
      if (this.buildingName) {
        this.planeType = 'BUILDING'
      } else {
        this.planeType = 'FLOOR'
      }
      let equipmentType = ''
      if (this.berthPlan !== 'ENERGY_CONSUMPTION') {
        equipmentType = null
      } else {
        equipmentType = this.equipmentType
      }
      context.http.get('cms/api/plan', {
        floorName: this.floorName,
        planeType: this.planeType,
        projectManagementId: this.projectManagementId,
        planeStyle: this.berthPlan,
        buildingName: this.buildingName
      }).then(result => {
        if (result) {
          if (result.data === '') {
            this.svgHtml = ''
            this.svgId = ''
            this.useDTOS = []
            return
          }
          this.planData = result.data
          this.textarea = this.planData.content
          this.annexs = this.planData.annexs
          this.useDTOS = result.data.useDTOS
          this.svgHtml = result.data.svg ? result.data.svg : ''
          this.$forceUpdate()
          this.svgId = result.data.id
          this.bindData.id = result.data.id // svg图Id
          this.bindRoomsList = result.data.svgList // 已绑定房源列表
          this.bindBindingList = result.data.bindingList // 已绑定房源id
          if (this.berthPlan !== 'TENANT') {
            this.getFloors()
          }
          this.$nextTick(() => {
            _this.renderSVG()
            _this.SVGAutoscale()
          })
        }
      })
    },
    renderSVG () {
      // 根据返回数据从新渲染svg图
      let bindRoomsList = this.bindRoomsList
      bindRoomsList.forEach(item => {
        if (item.planeStyle === 'DEVICE') {
          // 设备
          let eleId = item.svgId
          if (this.berthPlan === 'FIRE_CONTROL') {
            let dataType = $('#' + eleId).attr('data-type')
            let fireIcon =
              dataType === '室内消火栓' ||
              dataType === '室外消火栓' ||
              dataType === '室内消火栓箱' ||
              dataType === '手提式灭火器' ||
              dataType === '火警报警装置' ||
              dataType === '烟感探测器' ||
              dataType === '火警报警按钮'
            if (item.list[0].equirementType.name === '灭火系统') {
              if (fireIcon) {
                $('#' + eleId).attr({
                  stroke: '#3F5FBF',
                  fill: '#3F5FBF'
                })
              } else {
                $('#' + eleId).attr({
                  stroke: '#3F5FBF'
                })
              }
            } else if (item.list[0].equirementType.name === '报警系统') {
              if (fireIcon) {
                $('#' + eleId).attr({
                  stroke: '#E0250F',
                  fill: '#E0250F'
                })
              } else {
                $('#' + eleId).attr({
                  stroke: '#E0250F'
                })
              }
            } else if (item.list[0].equirementType.name === '联动分区系统') {
              if (fireIcon) {
                $('#' + eleId).attr({
                  stroke: '#F3AF2C',
                  fill: '#F3AF2C'
                })
              } else {
                $('#' + eleId).attr({
                  stroke: '#F3AF2C'
                })
              }
            }
          } else {
            $('#' + eleId).attr({
              'stroke-width': '2px',
              stroke: '#00ff00'
            })
          }
        } else if (item.planeStyle === 'BUSINESS_FORMAT') {
          // 业态
          let eleId = item.svgId
          $('#' + eleId).attr({
            fill: item.list[0].description
          })
        }
      })
    },
    SVGAutoscale () {
      // sgv自适应页面大小
      let DIVw = $('#svgDiv').width()
      if (this.planData.content || this.planData.annexs.length || this.planInfoEdit) {
        DIVw = DIVw - 400
      }
      let DIVh = $('#svgDiv').height()
      if (
        !$('#svgHtml svg').attr('width') ||
        !$('#svgHtml svg').attr('height')
      ) {
        $('#svgHtml svg').attr('width', '1980')
        $('#svgHtml svg').attr('height', '1080')
      }
      let svgW = parseInt($('#svgHtml svg').attr('width'))
      let svgH = parseInt($('#svgHtml svg').attr('height'))
      let defaultScale = 1
      if (svgW > DIVw) {
        defaultScale = DIVw / svgW
      } else {
      }
      this.defaultScale = defaultScale
      this.initScale = defaultScale // 默认缩放比例 =》是否展示滚动条
      $('#svgDiv').css({
        height: svgH * defaultScale,
        overflow: 'inherit'
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
      if (this.defaultScale > this.initScale) {
        // 如果当前比例大于默认比例则出现滚动条
        $('#svgHtml').css({
          overflow: 'scroll',
          'justify-content': 'flex-start'
        })
      } else {
        $('#svgHtml').css({
          overflow: 'inherit',
          'justify-content': 'center'
        })
      }
      $('#svgHtml svg').css({
        transform: `scale(${this.defaultScale})`,
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
      if (this.defaultScale > this.initScale) {
        // 如果当前比例大于默认比例则出现滚动条
        $('#svgHtml').css({
          overflow: 'scroll',
          'justify-content': 'flex-start'
        })
      } else {
        $('#svgHtml').css({
          overflow: 'inherit',
          'justify-content': 'center'
        })
      }
      $('#svgHtml svg').css({
        transform: `scale(${this.defaultScale})`,
        'transform-origin': '0 0 0'
      })
      // $('#svgHtml').width(svgW * this.defaultScale)
      // $('#svgHtml').height(svgH * this.defaultScale)
    },
    editFn (event) {
      // 右键编辑事件
      if (this.svgHtml !== '') {
        let self = event.target || event.srcElement
        this.selfTarget = self
        this.bindData.svgId = self.id
        this.offset.offsetX = event.offsetX
        this.offset.offsetY = event.offsetY + 10
        if (
          self.tagName === 'path' ||
          self.tagName === 'polygon' ||
          self.tagName === 'rect'
        ) {
          if (this.isBind(self.id)) {
            // 解绑
            if (this.berthPlan === 'TENANT') {
              // 客户
              for (var j = 0; j < this.bindRoomsList.length; j++) {
                if (self.id === this.bindRoomsList[j].svgId) {
                  this.bindData.tenantId = this.bindRoomsList[j].list[0].id
                }
              }
            } else if (this.berthPlan === 'BUSINESS_FORMAT') {
              // 项目规划图
              this.bindRoomsList.forEach(item => {
                this.bindData.industryId = item.list[0].id
              })
            } else {
              // this.unBindInfo = '房源'
              for (var i = 0; i < this.roomList.length; i++) {
                if (self.id === this.roomList[i].svgId) {
                  this.bindData.roomId = this.roomList[i].id
                }
              }
            }
            this.centerDialogVisible = true
          } else {
            // 绑定
            if (this.pevDocment.target) {
              // 上一个选中的DOM和样式
              $(this.pevDocment.target).attr(this.pevDocment.style)
            }
            this.pevDocment.target = self
            this.pevDocment.style = {
              'stroke-width': $(self).attr('stroke-width'),
              stroke: $(self).attr('stroke'),
              fill: $(self).attr('fill')
            }
            $(self).attr({
              // 'stroke-width': '1px',
              stroke: '#00ff00',
              fill: 'rgba(0,0,0,0.2)'
            })
            if (this.berthPlan === 'TENANT') {
              // 客户
              this.detailsShow2 = true
            } else if (this.berthPlan === 'DEVICE') {
              // 设备
              this.detailsShow3 = true
            } else if (this.berthPlan === 'ENERGY_CONSUMPTION') {
              // 能耗管线图
              this.bindEnergyShow = true
            } else if (this.berthPlan === 'FIRE_CONTROL') {
              // 消防管理图
              this.bindFireControlShow = true
            } else if (this.berthPlan === 'BUSINESS_FORMAT') {
              // 业态
              this.bindBusinessShow = true
            } else {
              this.detailsShow = true
            }
          }
        }
      }
    },
    isBind (svgid) {
      // 右键选中 判断该房源是否已经绑定
      if (!this.bindRoomsList) return false
      let isBind = this.bindRoomsList.some((item, index) => {
        return item.svgId === svgid
      })
      return isBind
    },
    unBind () {
      // 解绑
      let shopNbId = this.selfTarget.id.replace('svg', 'shopNb')
      let textId = this.selfTarget.id.replace('svg', 'text')
      let shopAeraId = this.selfTarget.id.replace('svg', 'shopAera')
      let dataType = $('#' + this.selfTarget.id).attr('data-type')
      if (
        dataType === '室内消火栓' ||
        dataType === '室外消火栓' ||
        dataType === '室内消火栓箱' ||
        dataType === '手提式灭火器' ||
        dataType === '火警报警装置' ||
        dataType === '烟感探测器' ||
        dataType === '火警报警按钮'
      ) {
        $('#' + this.selfTarget.id).attr({
          stroke: '#000000',
          fill: '#000000'
        })
      } else {
        $('#' + this.selfTarget.id).attr({
          stroke: '#000000'
        })
      }
      // console.log(textId)
      $('#' + shopNbId).remove()
      $('#' + textId).remove()
      $('#' + shopAeraId).remove()
      $('#svgHtml svg').css('transform', `scale(${this.defaultScale})`)
      let form = new FormData()
      form.append('id', this.bindData.id)
      if (this.berthPlan === 'service') {
        form.append('roomId', this.bindData.roomId)
      } else if (this.berthPlan === 'BUSINESS_FORMAT') {
        form.append('industryId', this.bindData.industryId)
        $('#' + this.selfTarget.id).attr('fill', '#ffffff')
      } else if (this.berthPlan === 'TENANT') {
        form.append('tenantId', this.bindData.tenantId)
      } else {
        let roomIds = []
        // this.firstTenant.forEach(item => {
        //   roomIds.push(item.id)
        // })
        // console.log(roomIds)
        let currentRooms = []
        this.bindRoomsList.forEach(item => {
          if (item.svgId === this.bindData.svgId) {
            currentRooms = item.list
          }
        })
        currentRooms.forEach(item => {
          roomIds.push(item.id)
        })
        form.append('roomId', roomIds)
      }
      let myFile = new File([$('#svgHtml').html()], 'test.svg', {
        type: 'image/svg+xml'
      })
      form.append('file', myFile)
      form.append('svgId', this.bindData.svgId)
      context.http
        .post('cms/api/plan/untying', form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(res => {
          this.$message({
            message: ' 解绑成功',
            type: 'success'
          })
          if (
            this.berthPlan !== 'TENANT' ||
            this.berthPlan !== 'BUSINESS_FORMAT'
          ) {
            this.getFloors()
          }
          this.svgHtml = res.data.svg // 跟新解绑后的SVG图
          this.useDTOS = res.data.useDTOS
          this.bindRoomsList = res.data.svgList
          this.bindBindingList = res.data.bindingList
          this.centerDialogVisible = false
          this.tenantIndex1 = 0
        })
        .catch(error => {
          console.info(error)
        })
    },
    getFloors () {
      // 获取房间列表信息
      context.http
        .get('cms/api/rooms/svg/floors', {
          floorName: this.floorName,
          projectManagementId: this.projectManagementId,
          projectPlanId: this.svgId,
          bulidingName: this.buildingName
        })
        .then(res => {
          this.detailData = res.data
          this.firstTenant =
            res.data.length > 0 ? res.data[0].floorDTOSet[0].roomsDTOS : []
          this.firstTenant.forEach((item, index) => {
            item.choose = 'false'
          })
          this.roomList = []
          for (var i = 0; i < this.detailData.length; i++) {
            // 拿到后台所有房间信息
            for (
              var k = 0;
              k < this.detailData[i].floorDTOSet[0].roomsDTOS.length;
              k++
            ) {
              this.roomList.push(
                this.detailData[i].floorDTOSet[0].roomsDTOS[k]
              )
            }
          }
        })
        .catch(error => {
          console.info(error)
        })
    },
    imageChange (state, event) {
      // 上传SVg
      if (this.projectManagementId === '' || this.floorName === '') {
        this.$message({
          message: '请选择对应项目、楼层',
          type: 'error'
        })
        return
      }
      let files = event.target.files
      let fileSize = files[0].size
      let name = files[0].name
      let index = name.lastIndexOf('.')
      let type = name.substr(index + 1).toLowerCase()
      if (index > 0 && type !== 'svg') {
        this.$message({
          message: '格式错误，请上传svg格式文件',
          type: 'error'
        })
        return
      }
      if (parseInt(fileSize) > 1024 * 1024 * 4) {
        // 不大于2M
        this.$message({
          message: 'svg大于4M',
          type: 'error'
        })
        return
      }
      let form = new FormData()
      form.append('file', files[0])
      form.append('planeType', this.planeType) // 楼or层
      form.append('planeStyle', this.berthPlan) // 业态 房源 客户 设备 能耗 平面图类型
      form.append('projectManagementId', this.projectManagementId)
      form.append('floorName', this.floorName)
      form.append('buildingName', this.buildingName)
      if (this.berthPlan === 'ENERGY_CONSUMPTION') {
        form.append('equirementTypeChildId', this.equipmentType)
      }
      // console.log(files[0])
      if (this.svgId) {
        form.append('id', this.svgId)
      }
      context.http
        .post('/cms/api/plan', form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(res => {
          this.svgHtmlShow = false
          this.svgHtml = res.data.svg
          this.svgId = res.data.id
          this.$message({
            message: '平面图上传成功！',
            type: 'success'
          })
          document.getElementById('imageChange').value = ''
          this.checkFun()
        })
        .catch(error => {
          document.getElementById('imageChange').value = ''
          this.$message({
            message: error,
            type: 'error'
          })
        })
    },
    detailsClose () {
      this.detailsShow = false
      this.detailsShow2 = false
      this.detailsShow3 = false
      this.bindEnergyShow = false
      this.bindFireControlShow = false
      this.bindBusinessShow = false
      if (this.pevDocment.target) {
        $(this.pevDocment.target).attr(this.pevDocment.style)
      }
    },
    pictureClose () {
      this.showPicture = false
    },
    handleClose () {
      this.dialogFromIsShow = false
    }
  }
}
</script>
<style lang="scss">
#projectId1,
.storeDetailisClass1 {
  .el-dialog__body {
    border-bottom: none;
    padding: 30px 0 !important;
  }
  .el-dialog__footer {
    text-align: right;
  }
  // 覆盖element样式
  .el-button {
    &.iconfont {
      padding: 8px 10px;
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
      &.isCite {
        border-color: #44af69;
        color: #44af69;
        &:hover {
          background-color: #f0f9f3;
        }
      }
      &.up {
        padding: 7px 8px;
      }
      &.shrink {
        padding: 7px 8px;
      }
      &.icon-yuanshidaxiao {
      }
    }
  }
  .el-button--primary {
    background-color: #3577f6;
  }
  .el-button--primary:hover {
    background: #66b1ff;
    border-color: #66b1ff;
    color: #fff;
  }
  .el-dialog__header {
    border: none;
  }
  .el-dialog__body {
    .deleteDialog {
      display: flex;
      div {
        margin-left: 15px;
        display: flex;
        flex-wrap: wrap;
        p {
          color: #666666;
          font-size: 20px;
          font-weight: 600;
          width: 100%;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
#projectId1 {
  .hintBox {
    width: 400px;
    height: 100px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 4px 0px rgba(181, 181, 181, 0.72);
    border-radius: 5px;
    > i {
      position: absolute;
      right: 10px;
      top: 10px;
      cursor: pointer;
    }
    > div {
      margin-top: 35px;
      padding: 0 20px;
      > div {
        float: left;
        margin-left: 15px;
        p {
          color: rgba(102, 102, 102, 1);
          font-weight: 600;
          font-size: 14px;
        }
        span {
          color: rgba(153, 153, 153, 1);
          font-size: 12px;
        }
      }
      > img {
        float: left;
      }
    }
  }
  .typeTab {
    height: 50px;
    line-height: 50px;
    background-color: #ffffff;
    margin-top: 15px;
    box-shadow: 4px 4px 4px 1px #eee;
    > span {
      display: inline-block;
      width: 120px;
      text-align: center;
      cursor: pointer;
      &.active {
        color: #3175d2;
        border-bottom: 2px solid #3175d2;
      }
    }
  }
  .tips {
    display: flex;
    color: #666666;
    width: 80%;
    align-items: center;
    .colorBox {
      border: none;
      color: #000000;
      margin-left: 25px;
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
svg polygon.bind,
svg path.bind,
svg rect.bind {
  stroke-width: "2px" !important;
  stroke: "#00ff00" !important;
  fill: "rgba(0,0,0,0.2)" !important;
}
.seachDiv {
  background-color: #ffffff;
  margin-top: 15px;
  border-radius: 5px;
  box-shadow: 4px 4px 4px 1px #eee;
  display: flex;
  align-items: center;
  position: relative;
  flex-wrap: wrap;
  padding: 20px 15px;
  justify-content: space-between;
  div {
    margin-right: 10px;
  }
}
.content {
  min-height: 750px;
  background-color: #ffffff;
  position: relative;
  padding-bottom: 50px;
  .saclBtn {
    display: flex;
    padding: 10px 20px 20px 20px;
    justify-content: space-between;
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
    .tipBtnBox {
      padding-top: 10px;
    }
  }

  #svgDiv {
    height: 750px;
    position: relative;
    overflow: auto;
    display: flex;
    justify-content: center;
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
    #svgHtml > span {
      // display: inline-block;
      flex: 1;
    }
    > .planInfo {
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
}
svg {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
svg path:hover {
  fill: #000;
  fill-opacity: 0.1;
}
svg polygon:hover {
  fill: #000;
  fill-opacity: 0.1;
}
svg rect:hover {
  fill: #000;
  fill-opacity: 0.1;
}
.upload {
  position: relative;
  display: inline-block;
  border-radius: 2px;
  cursor: pointer;
  margin-left: 20px;
  input {
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}
.defaultBtn {
  background: #ccc;
  border-color: #ccc;
}
.defaultBtn:hover {
  background: #ccc;
  border-color: #ccc;
}
</style>
