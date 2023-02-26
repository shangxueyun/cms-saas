<template>
  <div class="tenant-details">
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="tenant-details details-content bindStore"
           slot="drawer">
        <span class="creatStore"
              @click="creatStore"
              v-if="(hasAuthority('02010203') || hasAuthority('02010204')) && bindType==='store'">创建房源</span>
        <div v-if="berthPlan === 'device'"
             class="bindType">
          <span :class="{active:bindType==='store'}"
                @click="bindTypeChange('store')">房源</span>
          <span :class="{active:bindType==='device'}"
                @click="bindTypeChange('device')">设备</span>
        </div>
        <div class="main-content"
             style="display: block;">
          <div class="tower">
            <span v-for="(item, index) in tenantDetail"
                  :key="index"
                  :class=" {active:index===tenantIndex}"
                  @click="switchTower(item,index)">{{item.buildingName}}</span>
          </div>
          <div v-if="berthPlan === 'device'"
               class="bindName"> 名称：
            <el-input v-model="bindName"
                      style="width:200px"></el-input>
          </div>
          <div class="floor"
               v-if="bindType==='store' && berthPlan === 'device'">
            <div class="floorName">{{floorNumber}}</div>
            <div class="floorDtl">
              <span v-for="(item,index) in floorDataArr"
                    :key="index"
                    :class="{active:index===floorIndex,binded:item.svgId}"
                    @click="switchFloor(item,index)">
                <div class="innerContent">
                  <i :title="item.referred">{{item.referred}}</i>
                  <i :title="item.shopNumber">{{item.shopNumber}}</i>
                </div>
                <i class="iconCheack"
                   v-if="index===floorIndex"></i>
              </span>
            </div>
          </div>
          <div class="floor"
               v-if="bindType==='store' && berthPlan !== 'device'">
            <div class="floorName">{{floorNumber}}</div>
            <div class="floorDtl">
              <span v-for="(item,index) in floorDataArr"
                    :key="index"
                    :class="{active:item.choose === 'true',binded:item.svgId}"
                    @click="switchFloor(item,index)">
                <div class="innerContent">
                  <i :title="item.referred">{{item.referred}}</i>
                  <i :title="item.shopNumber">{{item.shopNumber}}</i>
                </div>
                <i class="iconCheack"
                   v-if="item.choose === 'true'"></i>
              </span>
            </div>
          </div>
          <div class="tips"
               v-if="bindType==='store'">
            <span></span>
            <span>为已关联房源</span>
          </div>
          <div v-if="bindType==='device'"
               class="deviceList">
            <div class="seachDiv">
              <div>
                <span class="caption">系统选择</span>
                <el-select style="width:210px"
                           v-model="deviceType">
                  <el-option v-for="(item,index) in largeType"
                             :key="index"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </div>
              <div>
                <span class="caption">设备名称</span>
                <el-input style="width:210px"></el-input>
              </div>
              <div>
                <span class="caption">设备编号</span>
                <el-input style="width:210px"></el-input>
              </div>
              <span class="seachBtn">查询</span>
            </div>
            <div class="table"
                 id="table">
              <el-table :data="tableData"
                        style="width: 100%"
                        ref="tableData"
                        :row-class-name="binded">
                <el-table-column width="55"
                                 label="">
                  <template slot-scope="scope">
                    <el-radio :label="scope.row.id"
                              v-model="selectionId"
                              :disabled="scope.row.svgId?true:false"
                              @change.native="getTemplateRow(scope.$index,scope.row)">&nbsp;</el-radio>
                  </template>
                </el-table-column>
                <el-table-column prop="name"
                                 label="设备名称"
                                 align="center"> </el-table-column>
                <el-table-column prop="code"
                                 label="设备编号"
                                 align="center"> </el-table-column>
                <el-table-column prop="brand"
                                 label="设备大类"
                                 align="center"> </el-table-column>
                <el-table-column prop="brand"
                                 label="品牌"
                                 align="center"> </el-table-column>
                <el-table-column prop="address"
                                 label="安装位置"
                                 align="center"> </el-table-column>
              </el-table>
            </div>
            <div class="ctc-foot">
              <el-col :span="24">
                <span class="flex">
                  <el-pagination v-if="total > 0"
                                 background
                                 layout="prev, pager, next"
                                 :page-size=15
                                 :total="total"
                                 :current-page="currentPage"
                                 @current-change="current_change">
                  </el-pagination>
                </span>
              </el-col>
            </div>
          </div>
          <!-- 预期品牌 -->
          <!-- <div class="referredDiv">
            <p>管理品牌</p>
            <el-input v-model="referreName"
                      style="width:300px"
                      placeholder="预期品牌"></el-input>
          </div> -->
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="onHide"
                   class="close-button">关闭</el-button>
        <el-button type="primary"
                   @click="bindFun('false')"
                   class="defaultbtn dialog-confirmBtn">确 定</el-button>
      </div>
    </drawer>
    <el-dialog title="新增房源"
               :visible.sync="creatStoreDialogVisible"
               width="500px"
               id="creatStoreDialog"
               class="addHourse housingList_addShop">
      <div>
        <div class="associatedInfo">
          <div class="title">
            <i></i>
            <span>房源基本信息</span>
          </div>
          <el-form class="form"
                   :model="addData"
                   ref="addData"
                   :rules="addDataRules"
                   style="text-align: center;">
            <el-form-item prop="projectManagement">
              <span>项目<i>*</i></span>
              <el-select value-key="id"
                         v-model="addData.projectManagement"
                         size="small"
                         placeholder="请选择"
                         @change="chooseItem('project', addData.projectManagement)">
                <el-option v-for="item in projectList"
                           :key="item.id"
                           :label="item.referred"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="building">
              <span>选择楼宇<i>*</i></span>
              <el-select value-key="id"
                         v-model="addData.building"
                         :disabled="planeType==='BUILDING'? true : false "
                         size="small"
                         placeholder="请选择"
                         @change="chooseItem('hourse', addData.building)">
                <el-option v-for="item in hourList"
                           :key="item.id"
                           :label="item.buildingName"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="floor">
              <span>选择楼层<i>*</i></span>
              <el-select v-model="addData.floor"
                         size="small"
                         :disabled="true"
                         placeholder="请选择">
                <el-option v-for="item in buildingList"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="shopNumber">
              <span>房源号<i>*</i></span>
              <el-input v-model="addData.shopNumber"
                        size="small"></el-input>
            </el-form-item>
          <el-form-item prop="productionCertificateNo">
            <span>产证号</span>
            <el-input maxlength="50"
                      v-model="addData.productionCertificateNo"
                      size="small"></el-input>
          </el-form-item>
            <el-form-item>
              <span>所属省市区</span>
              <el-input v-model="provinces"
                        size="small"
                        disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item>
              <span>具体地址</span>
              <el-input v-model="addData.address"
                        size="small"></el-input>
            </el-form-item>
            <el-form-item prop="buildingArea">
              <span>建筑面积/㎡<i>*</i></span>
              <el-input v-model="addData.buildingArea"
                        size="small"
                        @input="getHsRate"
                        type="number"></el-input>
            </el-form-item>
            <el-form-item prop="useArea">
              <span>使用面积/㎡</span>
              <el-input v-model="addData.useArea"
                        size="small"
                        @input="getHsRate"
                        type="number"></el-input>
            </el-form-item>
            <el-form-item>
              <span>得房率</span>
              <el-input v-model="hsAcquisitionRate"
                        size="small"
                        disabled="disabled"></el-input>
            </el-form-item>
            <!-- <el-form-item class="guidePrice">
              <span>招商指导价</span>
              <div class="form-box"
                   style="justify-content: flex-start;">
                <el-input v-model="addData.expectedUnitPrice"
                          style="width:53%"
                          size="small"
                          type="number"></el-input>
                <el-select v-model="addData.priceUnit"
                           size="small"
                           style="width:45%"
                           placeholder="请选择">
                  <el-option label="元/㎡天"
                             value="M2DAYS"></el-option>
                  <el-option label="元/月"
                             value="MONTH"></el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item>
              <span>预期业态</span>
              <el-select v-model="addData.industry"
                         size="small"
                         placeholder="请选择">
                <el-option label="生活配套"
                           value="LIFE"></el-option>
                <el-option label="餐饮"
                           value="FOOD"></el-option>
                <el-option label="零售"
                           value="RETAIL"></el-option>
                <el-option label="亲子教育"
                           value="BDUCATION"></el-option>
                <el-option label="娱乐"
                           value="CSE"></el-option>
                <el-option label="金融"
                           value="FINANCIAL"></el-option>
                <el-option label="房地产"
                           value="REALESTATE"></el-option>
                <el-option label="其他"
                           value="SERVICE"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item prop="investmentStatus">
              <span>房源类型<i>*</i></span>
              <el-select v-model="addData.investmentStatus"
                         size="small"
                         placeholder="请选择">
                <el-option label="普通房源"
                           value="OK"></el-option>
                <el-option label="自用"
                           value="NO"></el-option>
                <el-option label="虚拟房源"
                           value="FICTITIOUS"></el-option>
              </el-select>
            </el-form-item>
          <el-form-item prop="roomsUse">
            <span>用途<i>*</i></span>
            <el-select v-model="addData.roomsUse"
                       size="small"
                       placeholder="请选择">
              <el-option v-for="(item, index) in roomsUseOption"
                         :key="index"
                         :label="item.name"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
            <el-form-item style="width:100%">
              <span>房源图片</span>
              <div style="display: flex;margin-top:10px;">
                <aliUpload class="aliUpload deviceDetails"
                           v-if="addData.imgUrls.length < 5"
                           :upLoadText="upLoadText_cost"
                           :fileType="fileType_cost"
                           :fileSize="fileSize"
                           :iconShow="false"
                           :iconImg="iconImg"
                           :uploadIcon="true"
                           @setAnnex="setAnnex" />
                <div v-for="(item, index) in addData.imgUrls"
                     class="imgItem"
                     :key="index">
                  <img :src="item">
                  <i @click="deleFile(item, index)"
                     class="iconfont icon-jinakangbaoicons18"></i>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <span @click="addHourse('addData')"
              v-if="(hasAuthority('02010203') || hasAuthority('02010204'))"
              style="margin-right: 15px"
              class="subBtn">创建并关联</span>
        <span @click="closeDialog('addData')">取 消</span>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
import aliUpload from '@/components/aliUpload.vue'
import Drawer from '@/components/drawer.vue'
export default {
  components: {
    Drawer,
    aliUpload
  },
  props: {
    projectManagementList: {

    },
    buildList: {},
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    projectManagementId: {

    },
    buildingName: {

    },
    floorName: {
      type: String,
      default: ''
    },
    floorBuildList: { // 层平面图楼层列表

    },
    tenantDetail: {// 几号楼
      type: Array,
      default: [
        {
          floorDTOSet: [{ roomsDTOS: '' }, { roomsDTOS: '' }]
        },
        {
          floorDTOSet: [{ roomsDTOS: '' }]
        }
      ]
    },
    planeType: { // 楼/层平面类型
      type: String,
      default: ''
    },
    floorNumber: {
      type: String,
      default: '1'
    },
    bindParams: {
      type: Object,
      default: {
        id: '', // 平面图id
        svgId: '', // svgId
        roomId: '', // 房源id
        tenantId: '', // 客户id
        file: '' // svg文件
      }
    },
    floorDataArr: {
      type: Array,
      default: [
        { id: 52, shopNumber: '01', buildingArea: 150, station: null, industry: 'FOOD', decorationId: 23 }
      ]
    },
    pevDocmentObj: {
      type: Object,
      default: {
        target: null,
        style: null
      }
    },
    offsetProps: {
      type: Object,
      default: {
        offsetX: null,
        offsetY: null
      }
    },
    defaultScale: {
    },
    translateX: {
    },
    translateY: {
    },
    berthPlan: {
      type: String,
      default: ''
    },
    bindBindingList: {
      type: Array,
      default: []
    },
    tenantIndex: {

    }
  },
  created () {
    this.addDevicData.projectManagementId = this.projectManagementId
    this.addDevicData.buildName = this.buildingName
    this.tenantIndex1 = this.tenantIndex
  },
  mounted () {
  },
  data () {
    return {
      fileSize: 3,
      fileType_cost: ['png', 'jpg'],
      iconImg: 'icon-shangchuantupianicon',
      upLoadText_cost: '上传图片',
      // referreName: null, // 预计品牌
      provinces: null,
      tenantIndex1: 0,
      addDeviStep: 1,
      largeType: [
        { label: '建筑系统', value: '1', littleType: [{ label: '电梯', value: '1' }, { label: '自动扶梯', value: '2' }, { label: '卫生间', value: '3' }] },
        { label: '消防系统', value: '2', littleType: [{ label: '消防泵房', value: '1' }, { label: '消火栓', value: '2' }, { label: '消防控制室', value: '3' }, { label: '排烟机房', value: '4' }] },
        { label: '强电系统', value: '3', littleType: [{ label: '高配间', value: '1' }, { label: '强电间', value: '2' }, { label: '配电柜', value: '3' }] },
        { label: '弱电系统', value: '4', littleType: [{ label: '弱电间', value: '1' }, { label: '弱电机房', value: '2' }, { label: '道闸', value: '3' }, { label: '监控室', value: '4' }] },
        { label: '暖通系统', value: '5', littleType: [{ label: '空调机房', value: '1' }, { label: '空调室外机', value: '2' }, { label: '空调室内机', value: '3' }] },
        { label: '给排水系统', value: '6', littleType: [{ label: '水泵房', value: '1' }, { label: '生活水箱', value: '2' }] }
      ],
      littleType: [],
      addDevicData: {
        largeTypeVal: '',
        littleTypeVal: '',
        number: '',
        devName: '',
        projectManagementId: '',
        buildName: '',
        duty: '',
        dutyPhone: '',
        status: '',
        brand: '',
        manufacturer: '',
        makeAddress: '',
        supplier: '',
        factory: '',
        ASdate: '',
        payDate: '',
        useDtae: '',
        endDate: '',
        insDate: '',
        insAddress: '',
        remark: '',
        isMaintenance: '是',
        maintenancePeriod: 'MONTH',
        maintenanceUnit: '',
        maintenanceContacts: '',
        maintenanceContactsPhone: '',
        maintenanceType: '',
        epibolyType: '',
        startTime: '',
        endTime: '',
        needPolling: '',
        polTime: '',
        firstPOLtime: '',
        isMeter: '',
        deviceCode: '',
        factoryNb: '',
        specification: '',
        skillCode: '',
        voltage: '',
        electricity: '',
        frequency: '',
        totalPower: '',
        digitsNum: '',
        systemNum: '',
        speed: '',
        weight: '',
        stationNum: '',
        doorNum: '',
        floorNum: ''
      },
      addDevicDataRules: {
        largeTypeVal: [
          { required: true, message: '请选择设备大类', trigger: 'change' }
        ],
        littleTypeVal: [
          { required: true, message: '请选择设备大类', trigger: 'change' }
        ],
        number: [
          { required: true, message: '请输入设备编号', trigger: 'blur' }
        ],
        devName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        projectManagementId: [
          { required: true, message: '请选择项目简称', trigger: 'change' }
        ],
        buildName: [
          { required: true, message: '请选择楼宇', trigger: 'change' }
        ],
        duty: [
          { required: true, message: '请输入责任人', trigger: 'blur' }
        ],
        dutyPhone: [
          { required: true, message: '请输入责任人手机号', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择当前状态', trigger: 'change' }
        ],
        isMaintenance: [
          { required: true, message: '请选择是否需要维保', trigger: 'change' }
        ],
        maintenancePeriod: [
          { required: true, message: '请选择维保周期', trigger: 'change' }
        ],
        needPolling: [
          { required: true, message: '请选择是否需要巡检', trigger: 'change' }
        ],
        polTime: [
          { required: true, message: '请选择巡检周期', trigger: 'change' }
        ],
        isMeter: [
          { required: true, message: '请选择是否抄表', trigger: 'change' }
        ]
      },
      deviceType: '',
      currentPage: 1,
      total: 0,
      pgSize: 15,
      selectionArr: [], // 选中
      selectionId: '', // 选中
      tableData: [],
      bindType: 'store',
      bindName: '', // 绑定的名称
      creatStoreDialogVisible: false,
      floorIndex: 0,
      drawerTitle: '管理房源',
      formLabelWidth: '140px',
      projectList: [],
      hourList: [],
      buildingList: [],
      hsAcquisitionRate: '',
      errorField: false,
      errorTip: '',
      newRoomId: '', // 新建商铺的id和房源号
      newShopNbTxt: '', // 新建商铺的id和房源号
      addData: {
        projectManagement: null,
        building: null,
        floor: null,
        // firstDisplay: 'CONTRACT',
        industry: null,
        decorationId: null,
        investmentStatus: 'OK',
        expectedUnitPrice: null,
        priceUnit: 'M2DAYS',
        imgUrls: [],
        roomsUse: ''
      },
      roomsUseOption: [
        {value: 'SHOP', name: '商铺'},
        {value: 'WORK', name: '办公'},
        {value: 'MARKET', name: '菜场'}
      ],
      addDataRules: {
        projectManagement: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        building: [
          { required: true, message: '请选择楼宇', trigger: 'change' }
        ],
        floor: [
          { required: true, message: '请选择楼层', trigger: 'change' }
        ],
        shopNumber: [
          { required: true, message: '请输入房源号', trigger: 'blur' }
        ],
        industry: [
          { required: true, message: '请选择预期业态', trigger: 'change' }
        ],
        buildingArea: [
          { required: true, message: '请输入建筑面积', trigger: 'blur' }
        ],
        investmentStatus: [
          { required: true, message: '请选择房源类型', trigger: 'change' }
        ],
        roomsUse: [
          { required: true, message: '请选择用途', trigger: 'change' }
        ],
        // expectedUnitPrice: [
        //   { required: true, message: '请输入预期单价', trigger: 'blur' }
        // ],
        firstDisplay: [
          { required: true, message: '请选择招商平面图优先展示', trigger: 'change' }
        ]

      }
    }
  },
  computed: {

  },
  methods: {
    setAnnex (annexURL, annexName) {
      this.addData.imgUrls.push(annexURL)
    },
    deleFile (item, index) {
      this.addData.imgUrls.splice(index, 1)
    },
    addDeviSubmit (addDevicData) {
      this.$refs['addDevicData'].validate((valid) => {
        if (valid) {
          context.http.put('/cms/api/chargeDept', this.addDevicData).then(res => {
            this.onHide()
            this.$message({
              type: 'success',
              message: '保存成功'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    closeaddDeviDialog (addDevicData) {
      this.$refs['addDevicData'].resetFields()
      this.addDevicDialogVisible = false
    },
    changeAddDeviStep (step) {
      this.addDeviStep = step
    },
    largeTypeChange () {
      let largeTypeVal = this.addDevicData.largeTypeVal
      for (let i = 0; i < this.largeType.length; i++) {
        if (largeTypeVal === this.largeType[i].value) {
          this.littleType = this.largeType[i].littleType
        }
      }
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.getDevice()
    },
    getDevice () { // 获取设备列表
      context.http.get('cms/api/equirements', {
        projectManagementId: this.projectManagementId,
        equirementType: this.equirementTypeTxt,
        page: (this.currentPage - 1),
        size: this.pgSize
      }).then(res => {
        this.tableData = res.data
        this.total = Number(res.headers['x-total-count'])
      })
    },
    getTemplateRow (index, row) {
      console.log(row)
      this.selectionArr = row
      console.log(this.selectionId, this.selectionArr)
    },
    bindDevice () {
      this.bindParams.roomId = this.selectionId// 选中设备id
      if (this.bindParams.roomId === '' || !this.bindParams.roomId) {
        this.$message({
          message: '请选择设备',
          type: 'error'
        })
        return
      }
      if (!this.selectionArr.svgId) { // 判断此房间是否已经绑定
        $('#svgHtml svg').css('transform', `scale(${this.defaultScale})`)
        // $("#svgHtml polygon[id^='svg_'],#svgHtml rect[id^='svg_'],#svgHtml path[id^='svg_']").attr('fill', '#ffffff') // 渲染默认填充白色 去掉text
        // $("#svgHtml text[id^='shopTextId_'],#svgHtml text[id^='shopNb_']").remove()
        let myFile = new File([$('#svgHtml').html()], 'test.svg', { type: 'image/svg+xml' })
        this.bindParams.file = myFile
        let form = new FormData()
        form.append('file', myFile)
        form.append('id', this.bindParams.id)
        form.append('equirementId', this.bindParams.roomId)
        form.append('svgId', this.bindParams.svgId)
        context.http.post('cms/api/plan/binding', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          this.$message({
            message: '绑定成功',
            type: 'success'
          })
          this.$emit('drawerClose', false)
          this.$emit('bindSuccess', true)
        }).catch(error => {
          console.info(error)
        })
      } else {
        this.$message({
          message: '该设备已经绑定',
          type: 'error'
        })
        this.$emit('drawerClose', false)
      }
    },
    binded (row, rowIndex) {
      if (row.row.svgId) {
        return 'bindedCLS'
      }
    },
    bindTypeChange (bindType) {
      this.bindType = bindType
      this.getDevice()
    },
    closeDialog (formName) {
      this.addData = {
        projectManagement: null,
        building: null,
        floor: null,
        // firstDisplay: 'CONTRACT',
        industry: null,
        decorationId: null,
        investmentStatus: 'OK',
        expectedUnitPrice: null,
        priceUnit: 'M2DAYS',
        imgUrls: []
      }
      this.creatStoreDialogVisible = false
      this.$refs[formName].resetFields()
    },
    addHourse (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.projectConditions()
          let addData = JSON.parse(JSON.stringify(this.addData))
          this.buildingList.forEach(item => {
            if (item.name === addData.floor) {
              addData.floor = item
            }
          })
          context.http.post('/cms/api/rooms', addData).then(res => {
            this.newRoomId = res.data.id
            this.newShopNbTxt = res.data.shopNumber
            console.log('newRoomId' + this.newRoomId)
            this.$emit('refreshGetFloors')
            this.addData = {
              projectManagement: null,
              building: null,
              floor: null,
              industry: null,
              decorationId: null,
              investmentStatus: 'OK',
              expectedUnitPrice: null,
              priceUnit: 'M2DAYS',
              imgUrls: []
            }
            this.$refs[formName].resetFields()
            this.bindFun('true')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async imageChange (event) {
      this.errorField = false
      this.errorTip = ''
      let path = ''
      let files = event.target.files
      let _this = this
      if (files.length > 0) {
        if (files[0].size > (1024 * 1024 * 3)) {
          this.errorField = true
          this.errorTip = '上传图片不能大于3M'
          return
        } else if ((files[0].type !== 'image/png' && files[0].type !== 'image/jpeg')) {
          this.errorField = true
          this.errorTip = '上传图片格式不正确'
          return
        }
        let form = new FormData()
        form.append('file', files[0])
        event.target.value = ''
        context.http.post('/ywm/api/image-multipart', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          path = res.data
          _this.addData.imgUrls.push(path)
        }).catch(error => {
          console.info(error)
        })
      }
    },
    delimg (index) {
      this.addData.imgUrls.splice(index, 1)
    },
    getHsRate () {
      if (this.addData.useArea && this.addData.buildingArea) {
        this.hsAcquisitionRate = (this.addData.useArea / this.addData.buildingArea).toFixed(2)
      } else {
        this.hsAcquisitionRate = ''
      }
    },
    chooseItem (state, item) {
      if (state === 'project') {
        this.selProject = !this.selProject
        this.addData.projectManagement = item
        this.addData.building = null
        this.buildingList = []
        // if (this.addData.floor) {
        //   this.addData.floor = null
        // }
        context.http.get(`/cms/api/buildings/floorAndProjcet?projectManagementId=${item.id}&floorName=${this.floorName}`).then(res => {
          this.hourList = res.data // 楼宇
          if (this.planeType === 'FLOOR') { // 如果首页选择层平面图 则新增时 楼宇不可选
            // this.hourList.push({id: null, buildingName: '层平面图'})
            // this.addData.building = {id: null, buildingName: '层平面图'}
            this.buildingList = this.floorBuildList
          } else {
            console.log(this.buildingName)
            for (let i = 0; i < this.hourList.length; i++) {
              if (this.buildingName === this.hourList[i].id) {
                this.addData.building = this.hourList[i]
                this.getBuildingList(this.addData.building.id)
              }
            }
          }
        })
      } else {
        this.selHourse = !this.selHourse
        this.addData.building = item
        this.buildingList = this.floorBuildList
        // if (this.addData.floor) {
        //   this.addData.floor = null
        // }
        // context.http.get('/cms/api/floors/building/' + this.addData.building.id).then(res => {
        //   this.buildingList = res.data // 楼层
        // })
      }
    },
    getBuildingList (id) {
      context.http.get('/cms/api/floors/building/' + id).then(res => {
        this.buildingList = res.data // 楼层
      })
    },
    creatStore () { // 创建房源
      this.onHide()
      context.http.get('/cms/api/project-managements', { useStatus: 'USING' }).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          if (this.projectManagementId === res.data[i].id) {
            this.addData.projectManagement = res.data[i]
            this.chooseItem('project', this.addData.projectManagement)
            this.addData.floor = this.floorName
          }
        }
        context.http.get(`/ywm/api/district-codes/${this.addData.projectManagement.district}`).then(result => {
          this.provinces = result.data.address
        })
        this.creatStoreDialogVisible = true
        this.projectList = res.data
      })
    },
    writeInShopName (isCreatAndbind) {
      $('#' + this.pevDocmentObj.target.id).attr({
        'data-x': this.offsetProps.offsetX,
        'data-y': this.offsetProps.offsetY
      })
    },
    switchTower (item, index) {
      this.tenantIndex1 = index
      let roomsDTOS = this.tenantDetail[index].floorDTOSet[0].roomsDTOS
      for (let i = 0; i < roomsDTOS.length; i++) {
        roomsDTOS[i].choose = 'false'
      }
      this.$emit('floorDataEmit', roomsDTOS, index)
    },
    switchFloor (item, index) {
      if (this.berthPlan === 'device') {
        this.floorIndex = index
      } else {
        item.choose === 'true' ? this.$set(this.floorDataArr[index], 'choose', 'false') : this.$set(this.floorDataArr[index], 'choose', 'true')
        // this.$emit('updateKey')
        this.$emit('updateKey', this.tenantIndex1)
        // console.log(this.floorDataArr)
      }
    },
    hasAuthority (code) {
      // return context.user.hasAuthority(code)
      return true
    },
    bindFun (isCreatAndbind) { // 参数判断是否是创建完直接绑定
      let isBinded = null // 该房源是否已经绑定
      if (this.pevDocmentObj.target) { // 绑定前    去掉默认样式
        console.log(this.pevDocmentObj.style)
        $(this.pevDocmentObj.target).attr(this.pevDocmentObj.style)
      }
      if (isCreatAndbind === 'true') {
        this.bindParams.roomId = this.newRoomId
        isBinded = false // 新建商铺默认未绑定
      } else {
        if (this.berthPlan === 'device') {
          this.bindParams.roomId = roomsDTOS[this.floorIndex].id
          isBinded = roomsDTOS[this.floorIndex].svgId
        } else {
          if (!this.tenantDetail.length) {
            this.$message({
              message: '暂无可绑定房源',
              type: 'error'
            })
            return
          }
          let roomsDTOS = this.tenantDetail[this.tenantIndex].floorDTOSet[0].roomsDTOS
          let roomIds = []
          roomsDTOS.forEach(item => {
            if (item.choose === 'true') {
              roomIds.push(item.id)
            }
          })
          if (!roomIds.length) {
            this.$message({
              message: '请选择房源',
              type: 'error'
            })
            return
          }
          this.bindParams.roomId = roomIds
          isBinded = false
          this.bindBindingList.forEach(item => {
            roomIds.forEach(items => {
              if (items === item) {
                isBinded = true
              }
            })
          })
          // console.log(roomIds)
        }
        // console.log(roomsDTOS[this.floorIndex])
      }
      if (!isBinded) { // 商铺未绑定
        // if (isCreatAndbind === 'true') {
        //   this.writeInShopName('true')
        // } else {
        //   this.writeInShopName('false')
        // }
        $('#svgHtml svg').css('transform', `scale(${this.defaultScale})`)
        let myFile = new File([$('#svgHtml').html()], 'test.svg', { type: 'image/svg+xml' })
        this.bindParams.file = myFile
        let form = new FormData()
        form.append('svgx', this.offsetProps.offsetX)
        form.append('svgy', this.offsetProps.offsetY)
        form.append('file', myFile)
        // form.append('name', this.referreName) 预期品牌
        form.append('id', this.bindParams.id)
        form.append('roomId', this.bindParams.roomId)
        form.append('svgId', this.bindParams.svgId)
        context.http.post('cms/api/plan/binding', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          if (isCreatAndbind === 'true') {
            this.$message({
              type: 'success',
              message: '创建成功'
            })
            this.creatStoreDialogVisible = false
          } else {
            this.$message({
              message: '绑定成功',
              type: 'success'
            })
          }
          this.$emit('drawerClose', false)
          this.$emit('updateKey', 0, 'saveSuccess')
          this.$emit('bindSuccess', res.data)
        }).catch(error => {
          console.info(error)
        })
      } else {
        this.$message({
          message: '该房源已经绑定',
          type: 'error'
        })
        this.$emit('drawerClose', false)
      }
    },
    onHide () {
      // this.tenantIndex = 0
      // this.referreName = null
      this.$emit('drawerClose', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.addDevicDialog {
  .headTab {
    height: 60px;
    line-height: 60px;
    box-shadow: 0px 1px 5px #eeeeee;
    > span {
      display: inline-block;
      width: 120px;
      text-align: center;
      cursor: pointer;
      &.active {
        color: #3175f6ff;
        border-bottom: 2px solid #3175f6ff;
      }
    }
  }
  .part {
    border: 1px solid #eeeeee;
    min-height: 200px;
    margin: 20px 0;
    .title {
      width: 100%;
      height: 40px;
      line-height: 40px;
      padding-left: 15px;
      background-color: #fafafaff;
      margin-bottom: 20px;
    }
    .content {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 30%;
        margin-left: 20px;
        .el-form-item__content {
          > span {
            margin-bottom: 5px;
            display: inline-block;
          }
          .el-textarea__inner {
            resize: none !important;
          }
        }
      }
    }
  }
}
.bindStore {
  .tower {
    margin-top: 15px;
  }
  .bindType {
    height: 60px;
    line-height: 60px;
    margin: 0 30px;
    box-shadow: 0px 1px 1px #eeeeee;
    padding-left: 15px;
    > span {
      display: inline-block;
      width: 140px;
      text-align: center;
      cursor: pointer;
      &.active {
        color: #3175f6ff;
        border-bottom: 2px solid #3175f6ff;
      }
    }
  }
  .bindName {
    margin: 15px 0;
  }
  .addDevice {
    width: 120px;
    height: 40px;
    background-color: #49af61ff;
    color: #ffffff;
    display: flex;
    align-items: center;
    position: relative;
    top: -56px;
    right: -720px;
    justify-content: center;
    border-radius: 5px;
    cursor: pointer;
    .addIcon {
      display: inline-block;
      width: 26px;
      height: 27px;
      background: url(../../../../assets/add.png) no-repeat;
    }
  }
  .deviceList {
    min-height: 200px;
    .seachDiv {
      display: flex;
      > div {
        margin-right: 15px;
        .caption {
          display: inline-block;
          margin-bottom: 5px;
        }
      }
      .seachBtn {
        display: inline-block;
        width: 120px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background-color: #3175f6ff;
        color: #fff;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 22px;
      }
    }
    .binded {
      color: #f00;
    }
  }
}
.details-content {
  display: block !important;
  margin-top: 0px;
}
.addHourse {
  .upload {
    position: relative;
    .uploadbtn {
      display: inline-block;
      width: 66px;
      height: 24px;
      line-height: 20px;
      text-align: center;
      border: 1px solid #5e72e4;
      border-radius: 4px;
      color: #5e72e4;
      margin-top: 14px;
      cursor: pointer;
      font-size: 12px;
    }
    input {
      position: absolute;
      top: 15px;
      left: 0;
      width: 66px;
      height: 24px;
      opacity: 0;
      cursor: pointer;
    }
  }
  .bl-picture {
    width: 66px;
    height: 66px;
    display: inline-block;
    margin-right: 10px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    .icon-shanchu {
      position: absolute;
      top: -9px;
      right: -10px;
      color: #ccc;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      line-height: 18px;
      text-align: center;
      font-size: 16px;
      z-index: 1;
      background-size: contain;
      border: 1px solid #dadadd;
      cursor: pointer;
      background: url(../../../../assets/closed.png) no-repeat;
      background-size: contain;
    }
  }
  .condition-content {
    .el-checkbox-group {
      margin: 0 auto;
    }
    .el-input {
      margin: 0 10px;
      width: 270px;
    }
    .el-checkbox {
      display: block;
      margin-bottom: 10px;
    }
    .el-checkbox + .el-checkbox {
      margin-left: 0;
    }
  }
  .el-form-item {
    margin-bottom: 20px !important;
  }
}
ul,
li {
  list-style: none;
}
.hourse_search .el-input .el-input__inner {
  width: 180px;
  height: 32px;
  line-height: 32px;
  position: absolute;
  left: 0;
  top: 0;
}
.houring {
  font-size: 16px;
  background-color: #f9f9f9;
  .menu {
    height: 62px;
    line-height: 62px;
    border-bottom: 1px solid #eeeeee;
    margin-top: 15px;
    background-color: #ffffff;
    // padding-left: 20px;
    span {
      display: inline-block;
      width: 200px;
      height: 62px;
      text-align: center;
      cursor: pointer;
      font-size: 14px;
      &.active {
        border-bottom: 3px solid #3577f6;
        color: #3577f6;
      }
    }
  }
  .hourse_container {
    background-color: #f9f9f9;
    .hourse_search {
      background-color: #fff;
      margin: 20px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      .search-top {
        border-bottom: 1px solid #ecedef;
        padding-bottom: 18px;
        padding-left: 18px;
        .el-input {
          width: 180px;
          height: 32px;
          display: block;
          margin-top: 18px;
        }
        div {
          float: left;
          display: inline-block;
        }
        div {
          cursor: pointer;
        }
      }
      .search-bottom {
        padding-left: 18px;
        padding: 20px 18px 20px;
        dl {
          display: flex;
          font-size: 12px;
          line-height: 18px;
          dt {
            color: #333333;
          }
          dd {
            display: flex;
            color: #666;
            margin-right: 16px;
            span {
              display: block;
              &:first-child {
                margin-right: 5px;
              }
              &:last-child {
                font-size: 18px;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
    .hourse_statistical {
      background-color: #fff;
      margin: 15px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      .statistical_top {
        padding: 15px 30px;
        font-size: 15px;
        color: #747474;
        line-height: 15px;
        border-bottom: 1px solid #ecedef;
      }
      .statistical_bot {
        padding: 32px 30px 40px;
        display: flex;
        li {
          list-style: none;
          padding-right: 45px;
          padding-left: 20px;
          height: 45px;
          border-right: 2px solid #ecedef;
          &:first-child {
            padding-left: 0;
          }
          &:last-child {
            border-right: 0;
          }
          &:nth-child(3) {
            border-right: 0;
            margin-right: 115px;
          }
          p {
            color: #adadad;
            font-size: 14px;
            line-height: 14px;
            margin-top: -8px;
            &:last-child {
              color: #333;
              font-size: 20px;
              margin-top: 30px;
            }
          }
        }
      }
    }
    .hourse_tab {
      height: 60px;
      display: flex;
      background-color: #fff;
      margin: 10px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      justify-content: space-between;
      align-items: center;
      padding-right: 44px;
      border-bottom: 1px solid #ecedef;
      .nav {
        display: flex;
        li {
          width: 160px;
          text-align: center;
          font-size: 14px;
          color: #666;
          height: 58px;
          line-height: 58px;
          border-bottom: 2px solid #fff;
          cursor: pointer;
          &.select_active {
            border-bottom: 2px solid #3175d2;
            color: #3175d2;
            font-weight: bolder;
          }
        }
      }
    }
    .hourse-table {
      background-color: #fff;
      margin: 10px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      .page {
        background-color: #ffffff;
        display: flex;
        justify-content: space-between;
        padding: 60px 30px 30px 30px;
        .el-pagination.is-background .el-pager li:not(.disabled).active {
          background-color: #2f3f48;
          color: #fff;
        }
        .el-pagination.is-background .el-pager li:not(.disabled):hover {
          color: #999;
        }
        .pagingnum {
          font-size: 14px;
          text-align: center;
          color: #777;
          select {
            width: 70px;
            height: 28px;
            border-radius: 2px;
          }
        }
      }
    }
  }
  .addHourse {
    .el-dialog {
      width: 700px;
      margin-top: 8vh !important;
    }
    .basicInfo {
      border: 1px solid #f1f1f1;
      margin: 15px 0;
      h5 {
        height: 40px;
        background: #fafafa;
        line-height: 40px;
        padding: 0 15px;
        font-size: 14px;
        color: #666666;
      }
      .basic-content {
        display: flex;
        justify-content: space-between;
        padding: 15px;
        .basic-item {
          width: 46%;
          p {
            font-size: 14px;
            color: #333;
            line-height: 14px;
            margin-bottom: 15px;
          }
          .basic-select {
            position: relative;
            cursor: pointer;
            .selectInput {
              height: 110px;
              border: 1px solid #e7e7e7;
              border-radius: 5px;
              padding: 0 15px;
              &.selectActive {
                border: 1px solid #6473cb;
              }
              img {
                float: left;
                display: block;
                width: 150px;
                height: 80px;
                margin-right: 10px;
                margin-top: 15px;
              }
              span {
                float: left;
                color: #666666;
                display: block;
                line-height: 110px;
                &.over-hiden {
                  width: 180px;
                  white-space: nowrap;
                  word-break: break-all;
                  text-overflow: ellipsis;
                  overflow: hidden;
                }
                &:last-child {
                  float: right;
                  color: #6473cb;
                }
              }
            }
            .selectBox {
              width: 100%;
              border: 1px solid #e7e7e7;
              border-radius: 3px;
              background: #fff;
              position: absolute;
              left: 0;
              top: 115px;
              z-index: 9;
              padding: 15px 0px;
              box-shadow: 1px 2px 5px #ddd;
              height: 210px;
              overflow-y: auto;
              li {
                border-bottom: 1px solid #e7e7e7;
                padding: 10px 15px;
                display: flex;
                &:hover {
                  background: #eee;
                }
                img {
                  display: block;
                  width: 50px;
                  height: 21.3px;
                  margin-right: 20px;
                }
                span {
                  display: block;
                  line-height: 20px;
                  font-size: 14px;
                }
              }
            }
          }
        }
      }
    }
    .associatedInfo {
      border: 1px solid #f1f1f1;
      margin: 15px 0;
      h5 {
        height: 40px;
        background: #fafafa;
        line-height: 40px;
        padding: 0 15px;
        font-size: 14px;
        color: #666666;
      }
      .form {
        padding: 10px 0px 10px 15px;
        .el-form-item {
          width: 385px;
          margin-right: 30px;
          margin-bottom: 10px;
          display: inline-block;
          &:nth-child(4),
          &:nth-child(5),
          &:nth-child(6),
          &:nth-child(7),
          &:nth-child(8),
          &:nth-child(9) {
            // width:415px;
          }
          .el-form-item__content {
            line-height: 30px;
            margin-left: 146px !important;
          }
          .el-form-item__label {
            width: 140px !important;
          }
          .el-select {
            width: 100%;
          }
          .form-box {
            display: flex;
            justify-content: flex-start;
            .el-input {
              width: 300px;
            }
            .el-select {
              width: 100px;
              .el-input {
                width: 100px;
              }
            }
          }
        }
        .addLabel {
          border: 1px solid #dcdfe6;
          padding: 10px;
          border-radius: 4px;
          input {
            width: 100px;
            height: 25px;
            display: block;
            float: left;
          }
          p {
            float: left;
            margin-right: 15px;
            margin-bottom: 20px;
            height: 25px;
            padding: 0 0px 0 6px;
            background: #3577f6;
            color: #fff;
            line-height: 25px;
            display: flex;
            border-radius: 4px;
            span {
              display: block;
              font-size: 12px;
              &:last-child {
                width: 25px;
                height: 25px;
                text-align: center;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
}
@keyframes cloud-in {
  0% {
    padding-right: 0;
  }
  100% {
    padding-right: 350px;
  }
}
@keyframes cloud-in2 {
  0% {
    padding-right: 350px;
  }
  100% {
    padding-right: 0;
  }
}
.paddingLeft {
  animation: cloud-in 0.2s 0s ease-out forwards;
}
.paddingRight {
  animation: cloud-in2 0.2s 0s ease-out forwards;
}
.creatStore {
  width: 110px;
  height: 40px;
  display: inline-block;
  color: #3577f6;
  border: 1px solid #3577f6;
  border-radius: 5px;
  line-height: 40px;
  text-align: center;
  position: absolute;
  top: 8px;
  right: 25px;
  cursor: pointer;
}
.creatStore {
  width: 110px;
  height: 40px;
  display: inline-block;
  color: #3577f6ff;
  border: 1px solid #3577f6ff;
  border-radius: 5px;
  line-height: 40px;
  text-align: center;
  position: absolute;
  top: 8px;
  right: 25px;
  cursor: pointer;
}
.tips {
  font-size: 10px;
  span {
    &:first-child {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #f00;
    }
  }
}
.binded {
  color: #f00;
}
.tenant-details {
  width: 900px;
  .main-content {
    padding: 0 30px 15px;
    border-bottom: 1px solid #cecece;
    .referredDiv {
      padding: 20px 15px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(242, 242, 242, 1);
      box-shadow: 0px 2px 3px 0px rgba(190, 199, 208, 0.2);
      margin-top: 15px;
      p {
        color: rgba(51, 51, 51, 1);
        font-size: 14px;
        margin-bottom: 10px;
        font-weight: bold;
      }
    }
  }
}
.tower {
  span {
    display: inline-block;
    width: 165px;
    height: 45px;
    line-height: 45px;
    text-align: center;
    border: 1px solid #cecece;
    cursor: pointer;
    &.active {
      color: #ffffff;
      background-color: #3175f6;
    }
  }
}
.floor {
  display: flex;
  align-items: center;
  margin-top: 40px;
  .floorName {
    width: 10%;
    font-size: 18px;
    font-weight: 600;
  }
  .floorDtl {
    span {
      display: inline-block;
      width: 90px;
      height: 90px;
      text-align: center;
      border: 1px solid #cecece;
      border-radius: 5px;
      margin-right: 20px;
      margin-bottom: 20px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      .innerContent {
        width: 100%;
        height: 100%;
        i {
          font-style: normal;
          display: inline-block;
          width: 100%;
          height: 20px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          &:first-child {
            margin-top: 20px;
          }
        }
      }
      &.active {
        border: 1px solid #3175f6;
        .iconCheack {
          display: inline-block;
          width: 40px;
          height: 40px;
          background: url(../../../../assets/iconCheack.png) no-repeat;
          position: absolute;
          right: 0;
          bottom: 0;
        }
      }
    }
  }
}
</style>
