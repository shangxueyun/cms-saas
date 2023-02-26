<template>
  <div id="projectId2">
    <span class="page_head_title">平面图编辑</span>
    <ul class="default_tab_block">
      <li v-if="hasAuthority(item.authority)"
          v-for="(item,index) in options4"
          :key="index"
          :class="{active:berthPlan==='ROOM'?berthPlan===item.value:(item.value==='DEVICE'||item.value==='ENERGY_CONSUMPTION'||item.value==='FIRE_CONTROL'||item.value==='WEAK_CURRENT')}"
          @click="changeTab(item,index)">
        <span>{{item.label}}</span>
      </li>
    </ul>
    <div class="search-bar">
      <div>
        <el-select v-model="projectManagementId"
                   placeholder="项目"
                   @change='getBuliding'>
          <el-option v-for="item in options2"
                     :key="item.id"
                     :label="item.referred"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="buildingName"
                   placeholder="层/楼平面图"
                   @change="projectChanged">
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
        <el-select v-model="berthPlan"
                   v-if="berthPlan!=='ROOM'"
                   placeholder="类型"
                   @change="callChangeTab">
          <el-option v-for="item in options5"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="equipmentType "
                   v-if="berthPlan === 'ENERGY_CONSUMPTION'"
                   placeholder="类型"
                   @change="checkFun">
          <el-option v-for="(item,index) in getEquirementTypes25List"
                     :key="index"
                     :value="item.id"
                     :label="item.name"></el-option>
        </el-select>
      </div>
      <span class="upload">
        <el-button class="iconfont icon-cms_yinyong isCite"
                   @click="isCite">引用底图</el-button>
        <el-button class="iconfont icon-bianji-"
                   :class="[isEmpty?'disabled':'editBtn']"
                   :disabled="isEmpty"
                   @click="goSvgEditor"> 编辑</el-button>
      </span>
    </div>
    <div class="content">
      <div class="saclBtn">
        <el-button size="mini"
                   class="iconfont icon-yuanshidaxiao  up"
                   :disabled="defaultScale===initScale"
                   style="margin-left:10px"
                   @click="resetScal"> 原始大小</el-button>
        <el-button size="mini"
                   class="iconfont icon-suoxiao shrink"
                   :disabled="defaultScale<0.3"
                   style="margin-left:10px"
                   @click="shrink"> 缩小</el-button>
        <el-button size="mini"
                   class="iconfont icon-fangda  up"
                   :disabled="defaultScale>1.5"
                   @click="up"> 放大</el-button>

      </div>
      <div id="svgDiv"
           @scroll="handleScroll">
        <span class="svgHtml"
              id="svgHtml"
              v-html="svgHtml"
              v-show="svgHtmlShow"
              @contextmenu.prevent='editFn($event)'
              @click="editFn($event)"></span>
      </div>
      <span class="noData"
            v-if="svgHtml==='' ? true :false">暂无平面图</span>
    </div>
    <div class="svgIcon-label"
         v-if="berthPlan!=='ROOM'">
      <ul class="clearing"
          v-if="berthPlan==='DEVICE'">
        <li v-for="(item, index) in svgIconOptions.equipment"
            :key="index">
          <img :src="item.url">
          <span>{{item.name}}</span>
        </li>
      </ul>
      <ul class="clearing"
          v-if="berthPlan==='ENERGY_CONSUMPTION'&& equipmentType===26">
        <li v-for="(item, index) in svgIconOptions.energy_water"
            :key="index">
          <img :src="item.url">
          <span>{{item.name}}</span>
        </li>
      </ul>
      <ul class="clearing"
          v-if="berthPlan==='ENERGY_CONSUMPTION' && equipmentType===27">
        <li v-for="(item, index) in svgIconOptions.energy_power"
            :key="index">
          <img :src="item.url">
          <span>{{item.name}}</span>
        </li>
      </ul>
      <ul class="clearing"
          v-if="berthPlan==='ENERGY_CONSUMPTION' && equipmentType===28">
        <li v-for="(item, index) in svgIconOptions.energy_fuelGas"
            :key="index">
          <img :src="item.url">
          <span>{{item.name}}</span>
        </li>
      </ul>
      <ul class="clearing"
          v-if="berthPlan==='WEAK_CURRENT'">
        <li v-for="(item, index) in svgIconOptions.weak "
            :key="index">
          <img :src="item.url">
          <span>{{item.name}}</span>
        </li>
      </ul>
      <ul class="clearing"
          v-if="berthPlan==='FIRE_CONTROL'">
        <li v-for="(item, index) in svgIconOptions.fire_control"
            :key="index">
          <img :src="item.url">
          <span>{{item.name}}</span>
        </li>
      </ul>
    </div>
    <!-- 业态半页 -->
    <bindBusiness :detailsdrawershow="bindBusinessShow"
                  :pevDocmentObj="pevDocment"
                  :defaultScale="defaultScale"
                  :bindParams="bindData"
                  @drawerClose="detailsClose"
                  @bindBindBusinessSuccess="bindBindBusinessSuccess" />
    <!-- 房源半页 -->
    <bindStore :detailsdrawershow="detailsShow"
               :tenantDetail="detailData"
               :floorNumber="floorName"
               :bindParams="bindData"
               :pevDocmentObj="pevDocment"
               :offsetProps="offset"
               :floorDataArr="firstTenant"
               :defaultScale="defaultScale"
               :translateX="translateX"
               :translateY="translateY"
               :projectManagementId="projectManagementId"
               :buildingName='buildingName'
               :floorName="floorName"
               :planeType="planeType"
               :floorBuildList="options3"
               :projectManagementList="options2"
               :buildList="options1"
               :berthPlan="berthPlan"
               :bindBindingList="bindBindingList"
               :tenantIndex="tenantIndex1"
               ref="bindStore"
               @floorDataEmit="floorDataFn"
               @svgHtmlEmit="svgHtmlEmitFn"
               @bindSuccess="bindSuccessFun"
               @refreshGetFloors="getFloors"
               @drawerClose="detailsClose"
               @updateKey="updateKey"
               :key="ke" />
    <!-- 客户半页 -->
    <bindTenant :detailsTenantshow="detailsShow2"
                :tenantDetail="detailData"
                :floorNumber="floorName"
                :bindParams="bindData"
                :pevDocmentObj="pevDocment"
                :offsetProps="offset"
                :floorDataArr="firstTenant"
                :defaultScale="defaultScale"
                :translateX="translateX"
                :translateY="translateY"
                :projectManagementId="projectManagementId"
                :buildingName='buildingName'
                :floorName="floorName"
                :planeType="planeType"
                :floorBuildList="options3"
                :projectManagementList="options2"
                :buildList="options1"
                :berthPlan="berthPlan"
                :bindBindingList="bindBindingList"
                @floorDataEmit="floorDataFn"
                @svgHtmlEmit="svgHtmlEmitFn"
                @bindTenantSuccess="bindTenantSuccess"
                @refreshGetFloors="getFloors"
                @drawerClose="detailsClose"
                ref="bindTenant" />
    <!-- 设备半夜            -->
    <bindDevice v-if="detailsShow3"
                ref="bindDevice"
                :key="keys"
                :svgId="svgId"
                :equipmentTypeId="equipmentTypeId"
                :detailsdrawershow="detailsShow3"
                :tenantDetail="detailData"
                :bindParams="bindData"
                :floorDataArr="firstTenant"
                :pevDocmentObj="pevDocment"
                :offsetProps="offset"
                :projectManagementId="projectManagementId"
                :bindBindingList="bindBindingList"
                :bindNameModel="bindName"
                :tenantIndex="tenantIndex1"
                @floorDataEmit="floorDataFn"
                @bindFail="checkFun"
                @svgHtmlEmit="svgHtmlEmitFn"
                @bindSuccess="bindSuccessFun"
                @updataCompents="updataCompents"
                @drawerClose="detailsClose" />
    <!-- 能耗绑定半页 -->
    <bindEnergy v-if="bindEnergyShow"
                :equipmentTypeId="equipmentTypeId"
                :svgId="svgId"
                :bindParams="bindData"
                :defaultScale="defaultScale"
                :getEquirementTypes25List="getEquirementTypes25List"
                :projectManagementId="projectManagementId"
                :detailsdrawershow="bindEnergyShow"
                :pevDocmentObj="pevDocment"
                :bindBindingList="bindBindingList"
                ref="bindEnergy"
                @bindSuccess="bindSuccessFun"
                @bindFail="checkFun"
                @drawerClose="detailsClose" />
    <!-- 消防半页 -->
    <bindFireControl v-if="bindFireControlShow"
                     :detailsdrawershow="bindFireControlShow"
                     :berthPlan="berthPlan"
                     :svgId="svgId"
                     :equipmentTypeId="equipmentTypeId"
                     :pevDocmentObj="pevDocment"
                     :defaultScale="defaultScale"
                     :projectManagementId="projectManagementId"
                     :bindParams="bindData"
                     ref="bindFireControl"
                     @bindSuccess="bindSuccessFun"
                     @bindFail="checkFun"
                     @drawerClose="detailsClose" />
    <el-dialog :visible.sync="centerDialogVisible"
               class="lockDialogClose"
               width="400px"
               center>
      <div class="lockDialogContent"
           style="padding-left: 40px">
        <img src="../../../assets/jiechu2.png">
        <div>
          <div class="div1">解除关联</div>
          <div class="div2">确认解除{{isAll}}{{unBindInfo}}关联吗？</div>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <span class="cancel"
              @click="centerDialogVisible = false">取消</span>
        <span class="determine"
              @click="unBind">确定</span>
      </span>
    </el-dialog>
    <!-- 删除提示弹窗 -->
    <el-dialog :visible.sync="deleteDialog"
               width="21%"
               center>
      <div class="deleteDialog">
        <img src="../../../assets/delete1.png">
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
        <img src="../../../assets/jiechu1.png">
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
         @click="hintBox=false"></i>
      <div>
        <img src="../../../assets/delete1.png"
             style="width:28px;height:28px;">
        <div class="hintBoxContent">
          <p>操作提示</p>
          <span>无对应底图可供引用，请先上传底图</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import EquipmentConfigJSON from '@/utils/global'
import bindStore from './components/bindStore'
import bindTenant from './components/bindTenant'
import bindDevice from './components/bindDevice'
import bindEnergy from './components/bindEnergy'
import bindFireControl from './components/bindFireControl'
import bindBusiness from './components/bindBusiness'
import context from '@/service'
export default {
  name: 'planDesign',
  components: {
    bindStore,
    bindTenant,
    bindEnergy,
    bindDevice,
    bindBusiness,
    bindFireControl
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
      equipmentTypeId: [], // 绑定半页设备列表查询id
      isEmpty: true, // svgHtml是否为空
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
      berthPlan: 'ROOM', // 平面图类型
      firstTenant: null, // 默认第一栋楼数据
      svgId: null, // 当前楼层整张svg图的id
      options1: [],
      options2: [],
      options3: [],
      options4: [
        { label: '房源关联', value: 'ROOM', authority: '02010202' },
        // { label: '客户关联', value: 'TENANT', authority: '02010203' },
        { label: '设备关联', value: 'DEVICE', authority: '02010204' }
        // { label: '能耗系统', value: 'ENERGY_CONSUMPTION', authority: '02010205' },
        // { label: '消防系统', value: 'FIRE_CONTROL', authority: '02010206' },
        // { label: '弱电系统', value: 'WEAK_CURRENT', authority: '02010206' }
      ],
      options5: [
        { label: '设施设备', value: 'DEVICE', authority: '02010204' },
        { label: '能耗系统', value: 'ENERGY_CONSUMPTION', authority: '02010205' },
        { label: '消防系统', value: 'FIRE_CONTROL', authority: '02010206' },
        { label: '弱电系统', value: 'WEAK_CURRENT', authority: '02010206' }
      ],
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
      bindData: {// 绑定入参
        id: '', // 平面图id
        svgId: '', // 单块区域svgId
        roomId: '', // 房源id
        tenantId: '', // 客户id
        file: '' // svg文件
      },
      pevDocment: { // 选中的DOm 和之前的样式
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
      unBindInfo: '房源',
      bindName: '',
      equipmentType: '26',
      bindFireControlShow: false,
      hintBox: false,
      citeDialog: false,
      deleteDialog: false,
      svgIconOptions: {
        equipment: [ // 设备设施图标
          {
            url: require('../../../assets/equipmentIcon/cms_1113.png'),
            parentid: 1,
            id: 7,
            name: '电梯'
          },
          {
            url: require('../../../assets/equipmentIcon/cms_116.png'),
            parentid: 1,
            id: 8,
            name: '自动扶梯'
          },
          {
            url: require('../../../assets/equipmentIcon/cms_1131.png'),
            parentid: 1,
            id: 9,
            name: '卫生间'
          },
          {
            url: require('../../../assets/equipmentIcon/cms_机械车位.png'),
            parentid: 1,
            id: 10,
            name: '机械车位'
          }
        ],
        energy_water: [ // 能耗水
          {
            url: require('../../../assets/equipmentIcon/cms_1122.png'),
            name: '水表',
            id: 26
          },
          {
            url: require('../../../assets/equipmentIcon/cms_1121.png'),
            name: '水阀门开关',
            id: 26
          },
          {
            url: require('../../../assets/equipmentIcon/cms_1114.png'),
            name: '生活水箱',
            id: 26
          },
          {
            url: require('../../../assets/equipmentIcon/cms_1123.png'),
            name: '水泵房',
            id: 26
          }
        ],
        energy_power: [// 能耗电
          {
            url: require('../../../assets/equipmentIcon/cms_1111.png'),
            name: '电表',
            id: 27
          },
          {
            url: require('../../../assets/equipmentIcon/cms_1112.png'),
            name: '电箱控制柜',
            id: 27
          },
          {
            url: require('../../../assets/equipmentIcon/cms_111.png'),
            name: '高配间',
            id: 27
          },
          {
            url: require('../../../assets/equipmentIcon/cms_1126.png'),
            name: '强电间',
            id: 27
          },
          {
            url: require('../../../assets/equipmentIcon/cms_114.png'),
            name: '配电柜',
            id: 27
          },
          {
            url: require('../../../assets/equipmentIcon/cms_照明设备.png'),
            name: '照明设备',
            id: 27
          },
          {
            url: require('../../../assets/equipmentIcon/cms_117.png'),
            name: '空调机房',
            id: 27
          },
          {
            url: require('../../../assets/equipmentIcon/cms_118.png'),
            name: '空调室外机',
            id: 27
          },
          {
            url: require('../../../assets/equipmentIcon/cms_119.png'),
            name: '空调室内机',
            id: 27
          }
        ],
        energy_fuelGas: [// 能耗燃气
          {
            url: require('../../../assets/equipmentIcon/cms_燃气阀门.png'),
            name: '燃气阀门',
            id: 28
          },
          {
            url: require('../../../assets/equipmentIcon/cms_燃气表.png'),
            name: '燃气表',
            id: 28
          },
          {
            url: require('../../../assets/equipmentIcon/cms_燃气设备.png'),
            name: '燃气设备',
            id: 28
          }
        ],
        fire_control: [// 消防设备
          {
            url: require('../../../assets/equipmentIcon/cms_1118.png'),
            id: 11,
            name: '消防泵房'
          },
          {
            url: require('../../../assets/equipmentIcon/cms_1129.png'),
            id: 11,
            name: '室内消火栓箱'
          },
          {
            url: require('../../../assets/equipmentIcon/cms_1125.png'),
            id: 11,
            name: '手提式灭火器'
          },
          {
            url: require('../../../assets/equipmentIcon/cms_113.png'),
            id: 11,
            name: '阀门'
          },
          {
            url: require('../../../assets/equipmentIcon/cms_1130.png'),
            id: 11,
            name: '喷淋'
          },
          {
            url: require('../../../assets/equipmentIcon/cms_1124.png'),
            id: 11,
            name: '排烟机房'
          },
          {
            url: require('../../../assets/equipmentIcon/cms_1119.png'),
            id: 11,
            name: '消火栓'
          },
          {
            url: require('../../../assets/equipmentIcon/cms_1120.png'),
            id: 13,
            name: '消防控制室'
          },
          {
            url: require('../../../assets/equipmentIcon/cms_112.png'),
            id: 13,
            name: '防火卷帘门'
          },
          {
            url: require('../../../assets/equipmentIcon/cms_1115.png'),
            id: 12,
            name: '烟感探测器'
          },
          {
            url: require('../../../assets/equipmentIcon/cms_1117.png'),
            id: 12,
            name: '火警报警按钮'
          },
          {
            url: require('../../../assets/equipmentIcon/cms_1116.png'),
            id: 12,
            name: '火警报警装置'
          }
        ],
        weak: [
          {
            url: require('../../../assets/equipmentIcon/cms_1110.png'),
            id: 4,
            name: '监控室'
          },
          {
            url: require('../../../assets/equipmentIcon/cms_车辆管理设备.png'),
            id: 4,
            name: '车辆管理设备'
          },
          {
            url: require('../../../assets/equipmentIcon/cms_115.png'),
            id: 4,
            name: '道闸'
          },
          {
            url: require('../../../assets/equipmentIcon/cms_网络机房.png'),
            id: 4,
            name: '网络机房'
          },
          {
            url: require('../../../assets/equipmentIcon/cms_音乐设备.png'),
            id: 4,
            name: '音乐设备'
          },
          {
            url: require('../../../assets/equipmentIcon/cms_1127.png'),
            id: 4,
            name: '弱电间'
          },
          {
            url: require('../../../assets/equipmentIcon/cms_1128.png'),
            id: 4,
            name: '弱电机房'
          }
        ]
      }
    }
  },
  created () {
    this.getDataAuthorityOptions()// 商圈列表
    this.isTabhasAuthority()
  },
  mounted () {
  },
  methods: {
    resetScal () {
      let svgW = parseInt($('#svgHtml svg').attr('width'))
      let svgH = parseInt($('#svgHtml svg').attr('height'))
      this.defaultScale = this.initScale
      $('#svgHtml svg').css({
        'transform': `scale(${this.defaultScale})`,
        'transform-origin': '0 0 0'
      })
      $('#svgDiv').css({
        'overflow': 'inherit',
        'justify-content': 'center'
      })
      $('#svgHtml').width(svgW * this.defaultScale)
      $('#svgHtml').height(svgH * this.defaultScale)
    },
    isCite () { // 引用
      this.citeDialog = true
    },
    citeFun () { // 确认引用
      let equipmentType = ''
      if (this.berthPlan !== 'ENERGY_CONSUMPTION') {
        equipmentType = null
      } else {
        equipmentType = this.equipmentType
      }
      context.http.get('cms/api/plan/copy?', {
        floorName: this.floorName,
        planeType: this.planeType,
        projectManagementId: this.projectManagementId,
        planeStyle: this.berthPlan,
        buildingName: this.buildingName,
        equirementTypeChildId: equipmentType
      }).then(res => {
        this.citeDialog = false
        this.checkFun()
      }).catch(error => {
        this.citeDialog = false
        if (error.request.status === 400 && error.response.data === '无对应底图可供引用，请先上传底图！') {
          this.hintBox = true
          setTimeout(() => {
            this.hintBox = false
          }, 2000)
        }
        console.info(error)
      })
    },
    isDel () { // 删除
      if (this.svgHtml !== '') {
        this.deleteDialog = true
      }
    },
    deleteFun () { // 确认删除
      context.http.delete(`cms/api/plan/${this.svgId}`).then(res => {
        this.deleteDialog = false
        this.checkFun()
      }).catch(error => {
        console.info(error)
      })
    },
    isTabhasAuthority () { // 是否有 业态平面图、房源平面图、客户平面图、设备平面图Tab 的权限 默认设置第一个有权限的Tab
      for (let i = 0; i < this.options4.length; i++) {
        if (this.hasAuthority(this.options4[i].authority)) {
          this.berthPlan = this.options4[i].value
          return
        }
      }
    },
    getEquirementTypes25 () {
      context.http.get('/cms/api/equirementTypes/25').then(res => {
        this.getEquirementTypes25List = res.data
        this.equipmentType = res.data[0].id
      })
    },
    //   跳转svg编辑器
    goSvgEditor () {
      if (!this.svgHtml || this.svgHtml === '') return
      let floorName = encodeURI(encodeURI(this.floorName))
      let origin = window.location.origin
      let equipmentType = ''
      if (this.berthPlan !== 'ENERGY_CONSUMPTION') {
        equipmentType = null
      } else {
        equipmentType = this.equipmentType
      }
      window.open(origin + '/svg-editor/index.html?projectManagementId=' +
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
        '_blank')
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
    callChangeTab (value) {
      let item = {}
      item.value = value
      this.changeTab(item)
    },
    changeTab (item, index) {
      this.berthPlan = item.value
      // 解绑提示文案处理
      switch (this.berthPlan) {
        case 'BUSINESS_FORMAT':
          this.unBindInfo = '业态'
          break
        case 'ROOM':
          this.unBindInfo = '房源'
          break
        case 'TENANT':
          this.unBindInfo = '客户'
          break
        case 'DEVICE':
          this.unBindInfo = '设备'
          break
        case 'ENERGY_CONSUMPTION':
          this.unBindInfo = '能耗设备'
          break
        case 'FIRE_CONTROL':
          this.unBindInfo = '消防设备'
          break
      }
      this.equipmentType = '26' // 切换tab再切回来默认选中水1
      if (this.options1[0].id) {
        this.options1.unshift({ id: null, buildingName: '层平面图' })
      }
      if (this.berthPlan === 'DEVICE') {
        this.isAll = '全部'
        this.checkFun()
      } else if (this.berthPlan === 'ENERGY_CONSUMPTION') {
        this.isAll = '该'
        if (!this.options1[0].id) { // 能耗管线图则去掉层平面图选项
          this.options1.shift()
        }
        this.buildingName = this.options1[0].id
        this.projectChanged()
        this.getEquirementTypes25()
      } else if (this.berthPlan === 'FIRE_CONTROL' || this.berthPlan === 'WEAK_CURRENT') {
        this.isAll = '该'
        if (!this.options1[0].id) { // 消防弱电图则去掉层平面图选项
          this.options1.shift()
        }
        this.buildingName = this.options1[0].id
        this.projectChanged()
      } else {
        this.isAll = '该'
        this.checkFun()
      }
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    handleScroll (el) {
      this.showBox = false
    },
    bindSuccessFun (arr) { // 参数：绑定成功后绑定列表
      this.bindRoomsList = arr.svgList
      this.bindBindingList = arr.bindingList
      this.pevDocment.target = null // 如绑定成功则清除上一次右键选中svg样式
      this.svgHtml = arr.svg
      this.$nextTick(() => {
        this.renderSVG()
      })
      this.getFloors()
    },
    bindTenantSuccess (arr) { // 参数：绑定成功后绑定列表
      this.bindRoomsList = arr.svgList
      this.bindBindingList = arr.bindingList
    },
    bindBindBusinessSuccess (arr) { // 参数：绑定成功后绑定列表
      // this.checkFun()
      this.svgHtml = arr.svg// 跟新解绑后的SVG图
      this.svgId = arr.id
      this.bindData.id = arr.id // svg图Id
      this.bindRoomsList = arr.svgList // 已绑定房源列表
      this.bindBindingList = arr.bindingList // 已绑定房源id
      let _this = this
      setTimeout(function () {
        _this.renderSVG()
        // _this.SVGAutoscale()
      }, 100)
    },
    svgHtmlEmitFn (str) {
      this.svgHtml = str
    },
    floorDataFn (n, i) {
      this.firstTenant = n
      this.tenantIndex1 = i
    },
    async getDataAuthorityOptions (searchKey) { // 项目
      let result = await context.http.get('cms/api/project-managements', { page: 0, size: 100, sort: 'desc', useStatus: 'USING' })
      this.options2 = result.data
      this.projectManagementId = this.options2[0].id
      this.getBuliding()
    },
    async getBuliding () { // 楼宇
      let result = await context.http.get('cms/api/buildings/newList?sort=sortNumber,asc&sort=id,asc', { page: 0, size: 100, useStatus: 'USING', projectId: this.projectManagementId })
      if (result.data && result.data.length) {
        this.options1 = result.data.filter((item, index) => {
          return item.assetsType === 'BUILDING'
        })
        if (this.berthPlan !== 'ENERGY_CONSUMPTION' && this.berthPlan !== 'FIRE_CONTROL') {
          this.options1.unshift({ id: null, buildingName: '层平面图' })
        }
        this.buildingName = this.options1[0].id
        this.projectChanged()
      }
    },
    async projectChanged () { // 楼层
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
        this.floorName = defultFloorName
        this.checkFun()
      }
    },
    async checkFun () { // 查看对应平面图
      this.svgHtmlShow = false
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
      let result = await context.http.get('cms/api/plan', {
        floorName: this.floorName,
        planeType: this.planeType,
        projectManagementId: this.projectManagementId,
        planeStyle: this.berthPlan,
        buildingName: this.buildingName,
        equirementTypeChildId: equipmentType
      })
      if (result.data === '') {
        this.svgHtml = ''
        this.svgId = ''
        return
      }
      this.svgHtml = result.data.svg ? result.data.svg : this.svgHtml = ''
      this.svgId = result.data.id
      this.bindData.id = result.data.id // svg图Id
      this.bindRoomsList = result.data.svgList // 已绑定房源列表
      this.bindBindingList = result.data.bindingList // 已绑定房源id
      if (this.berthPlan !== 'TENANT') {
        this.getFloors()
      }
      this.$nextTick(() => {
        _this.renderSVG()
        // _this.SVGAutoscale()
      })
    },
    renderSVG () { // 根据返回数据从新渲染svg图
      $('#svgDiv svg  title').remove()
      let bindRoomsList = this.bindRoomsList
      let eleId, shopTextId, x, y, textArr, texts, shopTextDom
      $('#svgHtml image').each(function () {
        if ($(this).attr('class') && $(this).attr('class').includes('cms_')) {
          let url = $(this).attr('xlink:href')
          $(this).attr('xlink:href', url + '.png')
        }
      })
      bindRoomsList.forEach(item => {
        eleId = item.svgId
        if (item.planeStyle === 'ROOM') { // 房源关联
          shopTextId = eleId.replace('svg', 'shopTextId')
          x = !item.svgx || item.svgx === 'null' ? $('#' + eleId).attr('data-x') : item.svgx
          y = !item.svgy || item.svgy === 'null' ? $('#' + eleId).attr('data-y') : item.svgy
          textArr = []// 房源名拼接
          texts = ''
          item.list.forEach(list => {
            textArr.push(list.shopNumber)
          })
          texts = textArr.join('、')
          texts = texts.length > 10 ? texts.substring(0, 10) + '...' : texts
          shopTextDom = $('<text id="' + shopTextId + '"  x="' + x + '"  y="' + y + '" font-size="13px"  font-family="MicrosoftYaHei, Microsoft YaHei">' + texts + '</text>')
          if ($('#' + shopTextId).length === 0) {
            $('#svgHtml svg').find($('#' + eleId)).parent().append(shopTextDom)
          }
        } else if (item.planeStyle === 'TENANT') { // 客户关联
          shopTextId = eleId.replace('svg', 'shopTextId')
          x = !item.svgx || item.svgx === 'null' ? $('#' + eleId).attr('data-x') : item.svgx
          y = !item.svgy || item.svgy === 'null' ? $('#' + eleId).attr('data-y') : item.svgy
          textArr = []// 房源名拼接
          item.list.forEach((list, index) => {
            textArr.push(list.teantName)
            y = Number(y) + Number(16 * index)
            shopTextDom = $('<text id="' + shopTextId + '_' + index + '"  x="' + x + '"  y="' + y + '" font-size="16px"  font-family="MicrosoftYaHei, Microsoft YaHei">' + textArr[index] + '</text>')
            if ($('#' + shopTextId).length === 0) {
              $('#svgHtml svg').find($('#' + eleId)).parent().append(shopTextDom)
              // this.svgHtml = $('#svgHtml').html()
            }
          })
        } else if (item.planeStyle === 'DEVICE') { // 设备
          let url = $('#' + eleId).attr('xlink:href')
          if ($('#' + eleId).attr('class') && $('#' + eleId).attr('class').includes('cms_')) {
            $('#' + eleId).attr('xlink:href', url.substring(0, url.lastIndexOf('.png')))
          }
          // $('#' + eleId).attr({ 'style': 'opacity:1' })
        } else if (item.planeStyle === 'BUSINESS_FORMAT') { // 业态
          eleId = item.svgId
          $('#' + eleId).attr({
            'fill': item.list[0].description
          })
        }
      })
      this.svgHtml = $('#svgHtml').html()
      this.SVGAutoscale()
    },
    SVGAutoscale () { // sgv自适应页面大小
      let DIVw = $('#svgDiv').width()
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
    shrink () {
      if (this.defaultScale < 0.3) {
        return
      }
      this.defaultScale = this.defaultScale - 0.1
      let DIVw = $('#svgDiv').width()
      let DIVh = $('#svgDiv').height()
      let svgW = parseInt($('#svgHtml svg').attr('width'))
      let svgH = parseInt($('#svgHtml svg').attr('height'))
      if (this.defaultScale > this.initScale) { // 如果当前比例大于默认比例则出现滚动条
        $('#svgDiv').css({
          'overflow': 'scroll',
          'justify-content': 'flex-start'
        })
      } else {
        $('#svgDiv').css({
          'overflow': 'inherit',
          'justify-content': 'center'
        })
      }
      $('#svgHtml svg').css({
        'transform': `scale(${this.defaultScale})`,
        'transform-origin': '0 0 0'
      })
      $('#svgHtml').width(svgW * this.defaultScale)
      $('#svgHtml').height(svgH * this.defaultScale)
    },
    up () {
      if (this.defaultScale > 1.5) {
        return
      }
      this.defaultScale += 0.1
      let DIVw = $('#svgDiv').width()
      let DIVh = $('#svgDiv').height()
      let svgW = parseInt($('#svgHtml svg').attr('width'))
      let svgH = parseInt($('#svgHtml svg').attr('height'))
      // let translateX = (svgW * scale - svgW) / 2 / scale + 'px'
      // let translateY = (svgH * scale - svgH) / 2 / scale + 'px'
      if (this.defaultScale > this.initScale) { // 如果当前比例大于默认比例则出现滚动条
        $('#svgDiv').css({
          'overflow': 'scroll',
          'justify-content': 'flex-start'
        })
      } else {
        $('#svgDiv').css({
          'overflow': 'inherit',
          'justify-content': 'center'
        })
      }
      // $('#svgHtml svg').css('transform', `scale(${this.defaultScale}) translate(${translateX},${translateY})`)
      $('#svgHtml svg').css({
        'transform': `scale(${this.defaultScale})`,
        'transform-origin': '0 0 0'
      })
      $('#svgHtml').width(svgW * this.defaultScale)
      $('#svgHtml').height(svgH * this.defaultScale)
    },
    editFn (event) { // 右键编辑事件
      if (this.svgHtml !== '') {
        let self = event.target || event.srcElement
        this.selfTarget = self
        this.bindData.svgId = self.id
        this.offset.offsetX = event.offsetX
        this.offset.offsetY = event.offsetY + 10
        let turn = false
        if (this.berthPlan === 'ROOM') { // 房源
          turn = self.tagName === 'path' || self.tagName === 'polygon' || self.tagName === 'rect'
        } else if (this.berthPlan === 'DEVICE') { // 设施设备
          turn = self.tagName === 'path' || self.tagName === 'polygon' || self.tagName === 'rect' || self.tagName === 'image'
        } else {
          let flag = false
          if ($(self).attr('class')) {
            flag = $(self).attr('class').includes('cms_') // class 包含cms_ image标签才可以点击
          }
          turn = self.tagName === 'image' && flag
        }
        if (turn) {
          if (this.isBind(self.id)) { // 解绑
            if (this.berthPlan === 'TENANT') { // 客户
              for (var j = 0; j < this.bindRoomsList.length; j++) {
                if (self.id === this.bindRoomsList[j].svgId) {
                  this.bindData.tenantId = this.bindRoomsList[j].list[0].id
                }
              }
            } else if (this.berthPlan === 'BUSINESS_FORMAT') { // 项目规划图
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
          } else { // 绑定
            if (this.pevDocment.target) { // 上一个选中的DOM和样式
              $(this.pevDocment.target).attr(this.pevDocment.style)
            }
            this.pevDocment.target = self
            this.pevDocment.style = {
              'stroke-width': $(self).attr('stroke-width'),
              'stroke': $(self).attr('stroke'),
              'fill': $(self).attr('fill')
            }
            $(self).attr({
              'stroke-width': '1px',
              'stroke': '#00ff00',
              'fill': 'rgba(0,0,0,0.2)'
            })
            if (this.berthPlan === 'TENANT') { // 客户
              this.detailsShow2 = true
            } else if (this.berthPlan === 'DEVICE') { // 设备
              this.getEquipmentTypeId($(self).attr('class'))
              this.detailsShow3 = true
            } else if (this.berthPlan === 'ENERGY_CONSUMPTION') { // 能耗管线图
              this.getEquipmentTypeId($(self).attr('class'))
              this.bindEnergyShow = true
            } else if (this.berthPlan === 'FIRE_CONTROL' || this.berthPlan === 'WEAK_CURRENT') { // 消防管理图
              this.getEquipmentTypeId($(self).attr('class'))
              this.bindFireControlShow = true
            } else if (this.berthPlan === 'BUSINESS_FORMAT') { // 业态.
              this.bindBusinessShow = true
            } else {
              this.detailsShow = true
            }
          }
        }
      }
    },
    getEquipmentTypeId (str) { // 获取点击图标所属大小类[1,7]
      if (str) {
        let name = str.replace('cms_', '')
        EquipmentConfigJSON.forEach((t, i) => {
          t.children.forEach((item, index) => {
            if (item.key.includes(name)) {
              this.equipmentTypeId = [t.value, item.value]
            }
          })
        })
      } else {
        this.equipmentTypeId = []
      }
      // console.log(this.equipmentTypeId)
    },
    isBind (svgid) { // 右键选中 判断该房源是否已经绑定
      if (!this.bindRoomsList) return false
      let isBind = this.bindRoomsList.some((item, index) => {
        return item.svgId === svgid
      })
      return isBind
    },
    unBind () { // 解绑
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
      let myFile = new File([$('#svgHtml').html()], 'test.svg', { type: 'image/svg+xml' })
      form.append('file', myFile)
      form.append('svgId', this.bindData.svgId)
      context.http.post('cms/api/plan/untying', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
        this.$message({
          message: ' 解绑成功',
          type: 'success'
        })
        if (this.berthPlan !== 'TENANT' || this.berthPlan !== 'BUSINESS_FORMAT') {
          this.getFloors()
        }
        this.checkFun()
        this.centerDialogVisible = false
        this.tenantIndex1 = 0
      }).catch(error => {
        console.info(error)
      })
    },
    getFloors () { // 获取房间列表信息
      context.http.get('cms/api/rooms/svg/floors', { floorName: this.floorName, projectManagementId: this.projectManagementId, projectPlanId: this.svgId, bulidingName: this.buildingName }).then(res => {
        this.detailData = res.data
        this.firstTenant = res.data.length > 0 ? res.data[0].floorDTOSet[0].roomsDTOS : []
        this.firstTenant.forEach((item, index) => {
          item.choose = 'false'
        })
        this.roomList = []
        for (var i = 0; i < this.detailData.length; i++) { // 拿到后台所有房间信息
          for (var k = 0; k < this.detailData[i].floorDTOSet[0].roomsDTOS.length; k++) {
            this.roomList.push(this.detailData[i].floorDTOSet[0].roomsDTOS[k])
          }
        }
      }).catch(error => {
        console.info(error)
      })
    },
    imageChange (state, event) { // 上传SVg
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
      if (parseInt(fileSize) > 1024 * 1024 * 4) { // 不大于2M
        this.$message({
          message: 'svg大于4M',
          type: 'error'
        })
        return
      }
      let form = new FormData()
      form.append('file', files[0])
      form.append('planeType', this.planeType) // 楼or层
      form.append('planeStyle', this.berthPlan)// 业态 房源 客户 设备 能耗 平面图类型
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
      context.http.post('/cms/api/plan', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
        this.svgHtmlShow = false
        this.svgHtml = res.data.svg
        this.svgId = res.data.id
        this.$message({
          message: '平面图上传成功！',
          type: 'success'
        })
        document.getElementById('imageChange').value = ''
        this.checkFun()
      }).catch(error => {
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
      // this.tenantIndex1 = 0
      if (this.pevDocment.target) {
        $(this.pevDocment.target).attr(this.pevDocment.style)
      }
    },
    handleClose () {
      this.dialogFromIsShow = false
    }
  }
}
</script>
<style lang="scss">
#projectId2 {
  .el-dialog__body {
    border-bottom: none;
    padding: 15px 0 !important;
  }
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
    }
  }
}
</style>
<style lang="scss" scoped>
#projectId2 {
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
    flex-direction: row-reverse;
    padding: 10px 20px 10px 0;
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
  }

  #svgDiv {
    height: 750px;
    position: relative;
    overflow: auto;
    display: flex;
    justify-content: center;
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
  #svgDiv > span {
    display: inline-block;
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
