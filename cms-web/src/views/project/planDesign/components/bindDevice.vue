<template>
  <div class="tenant-details tenant-details1 repairFromdata5">
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="tenant-details details-content bindStore"
           slot="drawer">
        <div class="bindType">
          <span :class="{active:bindType==='store'}"
                @click="bindTypeChange('store')">房源</span>
          <span :class="{active:bindType==='device'}"
                @click="bindTypeChange('device')">设备</span>
        </div>
        <div class="main-content repairDetails_content"
             style="display: block;">
          <div class="tower"
               v-if="bindType==='store'">
            <span v-for="(item, index) in tenantDetail"
                  :key="index"
                  :class=" {active:index===tenantIndex}"
                  @click="switchTower(item,index)">{{item.buildingName}}</span>
          </div>
          <div class="titleDiv"
               v-if="bindType==='device'">
            <p class="title">
              <i></i>
              <span>设备</span>
            </p>
            <!-- <el-button class="tban tban1"
                       @click="addDeviceFn"><i class="iconfont icon-crm_xinzeng-"></i> 新增设备</el-button> -->
          </div>
          <div class="bindName"> 关联对象：
            <el-input v-model="bindName"
                      size="small"
                      style="width:200px"></el-input>
          </div>
          <div class="floor"
               v-if="bindType==='store'">
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
          <div v-if="bindType==='device'"
               class="deviceList">
            <div class="seachDiv"
                 style="margin-bottom:20px;">
              <div>
                <el-cascader :options="cascaderList"
                             size="small"
                             disabled
                             v-model="equipmentTypeId"
                             @change="handleChange"
                             placeholder="系统选择"
                             style="width:210px"
                             clearable></el-cascader>
              </div>
              <div>
                <el-input style="width:210px"
                          size="small"
                          placeholder="设备名称"
                          v-model="devName"></el-input>
              </div>
              <div>
                <el-input style="width:210px"
                          size="small"
                          placeholder="设备编号"
                          v-model="devCode"></el-input>
              </div>
              <span @click="querySeach"
                    class="details_chaxun_btn">查询</span>
            </div>
            <div class="table"
                 id="table">
              <el-table :data="tableData"
                        style="width: 100%"
                        ref="tableData"
                        :row-class-name="binded"
                        :row-key="getRowKeys"
                        @selection-change="handleSelectionChange">
                <el-table-column type="selection"
                                 :reserve-selection="true"
                                 width="55">
                </el-table-column>
                <el-table-column prop="name"
                                 label="设备名称"
                                 align="center"> </el-table-column>
                <el-table-column prop="code"
                                 label="设备编号"
                                 align="center"> </el-table-column>
                <el-table-column prop="equirementType.parent.name"
                                 label="设备大类"
                                 align="center"> </el-table-column>
                <el-table-column prop="brand"
                                 label="品牌"
                                 align="center"> </el-table-column>
                <el-table-column prop="installPosition"
                                 label="安装位置"
                                 align="center"> </el-table-column>
                <!-- <el-table-column label="操作"
                                 align="center">
                  <template slot-scope="scope">
                    <span @click="handleEdit(scope.$index, scope.row)"
                          class="table_chakan">查看</span>
                  </template>
                </el-table-column> -->
              </el-table>
            </div>
            <div class="ctc-foot">
              <el-col :span="24">
                <span class="flex"
                      style="flex-direction: row-reverse;">
                  <el-pagination v-if="total > 0"
                                 background
                                 layout="prev, pager, next"
                                 :page-size="pgSize"
                                 :total="total"
                                 :current-page="currentPage"
                                 @current-change="current_change">
                  </el-pagination>
                </span>
              </el-col>
            </div>
          </div>
        </div>
        <div class="tips"
             v-if="bindType==='store'">
          <span></span>
          <span>为已关联房源</span>
        </div>
      </div>
      <div slot="footer"
           class="slotfooter">
        <span @click="onHide">取消</span>
        <span @click="bindFun('false')">确定</span>
      </div>
    </drawer>
    <!-- 设备详情 -->
    <deviceDetails ref="deviceDetails"
                   :detailsdrawershow="deviceDetailsshow"
                   :detailsData="flowDetailsData"
                   :equirementTypes="equirementTypes"
                   :projectManagementsList="projectManagementsList"
                   :tenantList="tenantList"
                   @emitOpenbaoxiu="emitOpenbaoxiu1"
                   @emitOpenweixiu="emitOpenweixiu1"
                   @emitOpenbaoyang="emitOpenbaoyang"
                   @cannelFn="cannelFn"
                   @drawerClose="deviceDetailsClose" />
    <!-- 重构后保修单 、维修单详情 -->
    <addRepair ref="addRepair"
               :detailsdrawershow="detailsShow"
               :repairDetails="repairDetails"
               hasAddBtn="none"
               :drawerTitle="drawerTitle"
               @drawerClose="addRepairdrawerClose" />
    <!-- 保养详情 -->
    <baoyang :detailsdrawershow="baoyangShow"
             :drawerTitle="baoyangTitle"
             :equirementId="equirementId"
             :repairDetailsData="repairDetailsData"
             @drawerClose="baoyangClose" />
    <!--  新增设备新增设备新增设备新增设备新增设备新增设备-->
    <el-dialog title="新增设备"
               :visible.sync="addEquipmentShow"
               class="addEquipment_new el_dialog_new"
               width="750px"
               @close="addEquipmentClose"
               :close-on-click-modal="false">
      <addEquipment :projectManagementsList="projectManagementsList"
                    :projectManagementId="projectManagementId"
                    @addEquirementSuccess="addEquirementSuccess"
                    @dialogClose="addEquipmentClose" />
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import addEquipment from './addEquipment.vue'
import addRepair from '../../../operations/repairManagement/components/addRepair'
import deviceDetails from '../../../deviceManagement/deviceList/components/deviceDetails'
import baoyang from '../../../deviceManagement/deviceList/components/baoyang' // 保养详情
import { error, debug } from 'util'
import * as JSOG from 'jsog'
export default {
  components: {
    Drawer,
    addEquipment,
    baoyang,
    deviceDetails,
    addRepair
  },
  props: {
    equipmentTypeId: {
      type: Array,
      default: []
    },
    svgId: {},
    projectManagementList: {

    },
    bindNameModel: {},
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
    this.projectManagementsList = this.$store.state.projectManagementsList
    this.queryProjectList()
    this.getEquirementTypes()
    this.bindName = this.bindNameModel
    this.tenantIndex1 = this.tenantIndex
  },
  mounted () {
  },
  data () {
    return {
      detailsShow: false,
      repairDetails: {}, // 根据报修单id查询报修单详情
      addEquipmentShow: false,
      weixiuTitle: '维修单详情',
      baoyangShow: false,
      baoyangTitle: '保养单详情',
      drawerTitle2: '',
      equirementId: null,
      energyType: '',
      // 获取row的key值
      getRowKeys (row) {
        return row.id
      },
      toolTips: false,
      cascaderList: [], // 设备类型二级联选择器
      deviceType: '',
      currentPage: 1,
      total: 0,
      pgSize: 15,
      selectionArr: [], // 选中
      selectionId: '', // 选中
      tableData: [],
      bindType: 'store',
      bindName: '', // 绑定的名称
      tenantIndex1: 0,
      floorIndex: 0,
      drawerTitle: '关联对象',
      formLabelWidth: '140px',
      projectList: [],
      hourList: [],
      buildingList: [],
      hsAcquisitionRate: '',
      errorField: false,
      errorTip: '',
      newRoomId: '', // 新建商铺的id和房源号
      newShopNbTxt: '', // 新建商铺的id和房源号
      devCode: '',
      devName: '',
      equirementTypeId: '',
      equirementTypeChildId: '',
      equirementTypes: [], // 设备大小类枚举
      equirementTypesChild: [], // 设备小类
      projecOptions: [],
      buildingOption: [],
      bindDeviceIds: [],
      ids: [],
      flowDetailsData: {
        annexes: [],
        imageUrls: [],
        equirementType: {
          name: '',
          id: '',
          parent: {
            id: '',
            name: ''
          }
        },
        projectManagement: {
          projectName: ''
        },
        building: {
          buildingName: ''
        }
      },
      projectManagementsList: [],
      repairDetailsData: {
        imgs: []
      }, // 维修记录详情
      deviceDetailsshow: false,
      repairDetailsShow1: false,
      repairDetailsShow2: false,
      addRepairShow: false,
      tenantList: []
    }
  },
  methods: {
    addRepairdrawerClose () {
      this.detailsShow = false
    },
    emitOpenbaoxiu1 (id) {
      context.http.get(`cms/api/repair-forms/${id}`).then(res => { // 报修信息详情repairForms   维保记录详情repairRecords
        this.drawerTitle = '报修单详情'
        this.repairDetails = res.data
        this.detailsShow = true
      }).catch(error => {
        console.info(error)
      })
    },
    emitOpenweixiu1 (id) {
      context.http.get(`cms/api/repair-forms/${id}`).then(res => { // 报修信息详情repairForms   维保记录详情repairRecords
        this.drawerTitle = '维修单详情'
        this.repairDetails = res.data
        this.detailsShow = true
      }).catch(error => {
        console.info(error)
      })
    },
    addEquirementSuccess () {
      this.query('device')
    },
    addEquipmentClose () {
      this.addEquipmentShow = false
    },
    addDeviceFn () { // 新增设备
      this.addEquipmentShow = true
    },
    deviceDetailsClose () {
      this.deviceDetailsshow = false
    },
    async cannelFn (equirementsId) { // 设备id
      let result = await context.http.get(`cms/api/equirements/${equirementsId}`)
      this.equirementId = equirementsId
      this.deviceDetailsData = result.data
      if (!this.deviceDetailsData.tenant) {
        this.deviceDetailsData.tenant = { id: null }
      }
    },
    emitOpenweixiu (id, baoxiudan) { // 查看 维修 baoxiudan维修详情是否有报修单模块
      context.http.get(`cms/api/repair-records/${id}`).then(res => {
        this.repairDetailsData = res.data
        this.isBaoxiudan = baoxiudan
        this.weixiuShow = true
      }).catch(error => {
        console.info(error)
      })
    },
    emitOpenbaoyang (id) { // 查看 维修 baoxiudan维修详情是否有报修单模块
      context.http.get(`cms/api/repair-records/${id}`).then(res => {
        this.repairDetailsData = res.data
        this.baoyangShow = true
      }).catch(error => {
        console.info(error)
      })
    },
    emitOpenbaoxiu (id) { // 查看报修单信息详情
      context.http.get(`cms/api/repair-forms/${id}`).then(res => { // 报修信息详情repairForms   维保记录详情repairRecords
        this.repairDetailsData = res.data
        this.baoxiuShow = true
      }).catch(error => {
        console.info(error)
      })
    },
    baoyangClose () {
      this.baoyangShow = false
    },
    getTenantList (id) {
      context.http.get(`cms/api/tenant/projectManagement/${id}`, { size: 10000 }).then(res => { // 根据项目id查所有客户
        this.tenantList = res.data
        this.devicesDetailsShow = true
        console.log(this.deviceDetailsData)
      }).catch(error => {
        console.info(error)
      })
    },
    async getEquirementTypes () { // 请求设备大小类
      let result = await context.http.get('/cms/api/equirementTypes/tree?bol=true')
      this.equirementTypes = result.data
      this.equirementTypes.forEach((element, index) => {
        this.cascaderList.push({ value: element.id, label: element.name, children: [] })
        element.child.forEach(item => {
          this.cascaderList[index].children.push({ value: item.id, label: item.name })
        })
      })
    },
    async handleEdit (index, row) { // 查看
      let result = await context.http.get(`cms/api/equirements/${row.id}`)
      this.equirementId = row.id
      this.flowDetailsData = result.data
      if (!this.flowDetailsData.tenant) {
        this.flowDetailsData.tenant = { id: null }
      }
      context.http.get(`cms/api/tenant/projectManagement/${row.projectManagement.id}`, { size: 10000 }).then(res => { // 根据项目id查所有客户
        this.tenantList = res.data
        this.deviceDetailsshow = true
      }).catch(error => {
        console.info(error)
      })
    },
    showRepairDetails_forms (id) { // 查看报修单信息详情
      context.http.get(`cms/api/repair-forms/${id}`).then(res => { // 报修信息详情repairForms   维保记录详情repairRecords
        this.repairDetailsData = res.data
        this.repairDetailsShow1 = true
      }).catch(error => {
        console.info(error)
      })
    },
    showRepairDetails (id, drawerTitle2) { // 查看 维修保养记录详情
      context.http.get(`cms/api/repair-records/${id}`).then(res => {
        this.repairDetailsData = res.data
        this.repairDetailsShow2 = true
        this.drawerTitle2 = drawerTitle2
      }).catch(error => {
        console.info(error)
      })
    },
    repairDetailsClose () {
      this.repairDetailsShow1 = false
    },
    repairDetailsClose1 () {
      this.repairDetailsShow2 = false
    },
    querySeach () {
      this.currentPage = 1
      this.query('device')
    },
    handleSelectionChange (val) {
      this.ids = []
      val.forEach(item => {
        this.ids.push(item.id)
      })
      this.bindDeviceIds = this.ids
      // console.log(val, this.ids)
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query('device')
    },
    dedupe (array) { // 数组去从
      return Array.from(new Set(array))
    },
    bindTypeChange (bindType) {
      this.ids = []
      this.bindName = ''
      if (bindType === 'store') {
        this.bindType = bindType
      } else { // 请求SVG设备平面图
        this.equirementTypeId = this.equipmentTypeId[0]
        this.equirementTypeChildId = this.equipmentTypeId[1]
        this.query(bindType)
      }
    },
    query (bindType) {
      let params = {
        code: this.devCode,
        name: this.devName,
        equirementTypeId: this.equirementTypeId,
        equirementTypeChildId: this.equirementTypeChildId,
        projectManagementId: this.projectManagementId,
        page: (this.currentPage - 1),
        projectPlanId: this.svgId,
        bol: false,
        size: this.pgSize,
        useStatus: 'USING'
      }
      context.http.get('/cms/api/equirements/svg', params).then(res => {
        this.tableData = JSOG.decode(res.data)
        this.bindType = bindType
        this.total = Number(res.headers['x-total-count'])
      }).catch(error => {
        console.log(error)
      })
    },
    queryProjectList () {
      context.http.get('cms/api/project-managements', { page: 0, size: 50, sort: 'desc', useStatus: 'USING' }).then(res => {
        this.projecOptions = res.data
        // this.projecOptions.unshift({projectName: '全部', id: ''})
      })
    },
    handleChange (value) { // 设备类型二级联选择器
      this.equirementTypeId = value[0]
      this.equirementTypeChildId = value[1]
    },
    binded (row, rowIndex) {
      if (row.row.svgId) {
        return 'bindedCLS'
      }
    },
    chooseItem (state, item) {
      if (state === 'project') {
        this.selProject = !this.selProject
        this.addData.projectManagement = item
        this.addData.building = null
        this.buildingList = []
        context.http.get(`/cms/api/buildings/floorAndProjcet?projectManagementId=${item.id}&floorName=${this.floorName}`).then(res => {
          this.hourList = res.data // 楼宇
          if (this.planeType === 'FLOOR') { // 如果首页选择层平面图 则新增时 楼宇不可选
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
      }
    },
    getBuildingList (id) {
      context.http.get('/cms/api/floors/building/' + id).then(res => {
        this.buildingList = res.data // 楼层
      })
    },
    writeInShopName (isCreatAndbind) {
      // 绑定svg区域存入x、y
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
      item.choose === 'true' ? this.$set(this.floorDataArr[index], 'choose', 'false') : this.$set(this.floorDataArr[index], 'choose', 'true')
      this.$emit('updataCompents', this.bindName, this.tenantIndex1)
      // console.log(this.floorDataArr)
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    bindFun (isCreatAndbind) { // 参数判断是否是创建完直接绑定
      let isBinded = null // 该房源是否已经绑定
      if (this.pevDocmentObj.target) { // 绑定前    去掉默认样式
        $(this.pevDocmentObj.target).attr(this.pevDocmentObj.style)
      }
      if (isCreatAndbind === 'true') {
        this.bindParams.roomId = this.newRoomId
        isBinded = false // 新建商铺默认未绑定
      } else {
        if (this.bindType === 'device') {
          // this.bindParams.equirementId = this.bindDeviceIds
          isBinded = false
        } else {
          // console.log(this.bindBindingList) // 已绑定房源id
          if (!this.tenantDetail.length) {
            this.$message({
              message: '暂无可绑定房源',
              type: 'error'
            })
            return
          }
          let roomsDTOS = this.tenantDetail[this.tenantIndex].floorDTOSet[0].roomsDTOS
          // console.log(roomsDTOS) // 房源列表
          let roomIds = []
          roomsDTOS.forEach(item => {
            if (item.choose === 'true') {
              roomIds.push(item.id)
            }
          })
          if (roomIds.length === 0) {
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
          console.log(roomIds)
        }
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
        form.append('name', this.bindName)
        form.append('id', this.bindParams.id)
        if (this.bindType === 'device') {
          if (this.bindDeviceIds.length === 0) {
            this.$message({
              type: 'error',
              message: '请选择设备'
            })
            return
          }
          form.append('equirementId', this.bindDeviceIds)
        } else {
          form.append('roomId', this.bindParams.roomId)
        }
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
          this.$emit('updataCompents', this.bindName, 0, 'saveSuccess')
          this.$emit('bindSuccess', res.data)
        }).catch(error => {
          this.$message({
            type: 'error',
            message: '绑定失败！'
          })
          this.$emit('bindFail')
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
      this.ids = []
      this.$emit('drawerClose', false)
    }
  }
}
</script>
<style lang="scss">
.repairFromdata5 {
  > div {
    &.vue-drawer {
      .drawer {
        background-color: #faf7fa !important;
        overflow: auto;
        .wrap {
          height: calc(100% - 60px);
          min-height: auto;
        }
        .slotfooter {
          height: 45px;
          line-height: 45px;
          text-align: right;
          padding-right: 15px;
          margin-top: 15px;
          background-color: #fff;
          > span {
            display: inline-block;
            width: 90px;
            height: 34px;
            line-height: 34px;
            text-align: center;
            border-radius: 4px;
            cursor: pointer;
            &:first-child {
              color: #777777;
              &:hover {
                color: rgba(53, 119, 246, 1);
              }
            }
            &:last-child {
              background: rgba(53, 119, 246, 1);
              color: #fff;
            }
          }
        }
        .drawer-head {
          padding: 0;
          margin: 0;
          height: 60px;
          line-height: 60px;
          background-color: #ffffff;
          padding-left: 15px;
          font-weight: bold;
          border: none;
          .el-dialog__close {
            font-size: 24px;
            color: #b9b9b9;
            margin-top: 20px;
          }
          .el-dialog__title {
            color: #262626;
            font-size: 16px;
          }
        }
        .bindStore {
          height: calc(100% - 150px);
          padding-bottom: 0;
          .repairDetails_content {
            margin: 0;
            // height: calc(100% - 60px);
            height: 100%;
            overflow-y: auto;
            background-color: #ffffff;
            margin-top: 15px;
            &::-webkit-scrollbar {
              width: 4px !important;
              height: 4px !important;
            }
            &::-webkit-scrollbar-track {
              box-shadow: inset 0 0 6px #fff;
              background-color: #fff;
            }
            &::-webkit-scrollbar-thumb {
              border-radius: 10px;
              box-shadow: inset 0 0 6px #cccccc;
            }
            .repairInfo {
              background-color: #ffffff;
            }
            .title {
              // height: 45px;
              // line-height: 45px;
              display: flex;
              align-items: center;
            }
            .collapse_repair {
              padding: 0 15px;
              background-color: #ffffff;
              .el-collapse-item__header {
                > div {
                  width: 95%;
                  display: flex;
                  justify-content: space-between;
                  > span {
                    &:last-child {
                      font-size: 12px;
                      color: rgba(53, 119, 246, 1);
                    }
                  }
                }
              }
              .el-collapse-item__content {
                padding-bottom: 0;
                background-color: #f7f8fa;
              }
            }
          }
        }
        .el-dialog__footer {
          padding: 0;
          background-color: #ffffff;
          margin-top: 15px;
          .dialog-footer {
            height: 80px;
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            > span {
              display: inline-block;
              width: 90px;
              height: 34px;
              line-height: 34px;
              text-align: center;
              cursor: pointer;
              color: #666666;
              &.subBtn {
                background-color: #3577f6;
                color: #ffffff;
                border-radius: 4px;
              }
              &.quxiao_btn {
                &:hover {
                  color: #3577f6;
                }
              }
            }
          }
        }
      }
    }
    .ctc-foot {
      justify-content: normal;
      flex-direction: row-reverse;
      align-items: center;
      color: #3f5fbf;
      font-size: 12px;
      padding: 60px 20px 30px 20px;
      .pagingnum {
        color: #3f5fbf;
        font-size: 12px;
        select {
          width: 65px;
          height: 28px;
          border-radius: 2px;
          border-color: #f6f6f7;
          color: #3577f6;
        }
      }
      .el-pagination.is-background .btn-next,
      .el-pagination.is-background .btn-prev,
      .el-pagination.is-background .el-pager li {
        margin: 0 5px;
        background-color: transparent;
        color: #3f5fbf;
        min-width: 30px;
        border-radius: 2px;
        font-size: 14px;
      }
      .el-pagination.is-background .el-pager li:not(.disabled).active {
        border-radius: 50%;
        background-color: #3f5fbf !important;
        color: #fff !important;
      }
    }
  }
}
.tenant-details1 {
  .wrap {
    height: auto;
  }
}
</style>
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
            // margin-bottom: 5px;
            display: inline-block;
            height: 35px;
            display: flex;
            align-items: center;
            > .toolTips {
              display: inline-block;
              font-style: normal;
              font-size: 12px;
              padding: 8px 10px;
              background-color: rgba(0, 0, 0, 0.7);
              color: #fff;
              border-radius: 5px;
              margin-left: 15px;
              position: relative;
              top: -5px;
              > .icon {
                width: 0;
                height: 0;
                border-width: 8px;
                border-style: solid;
                border-color: transparent rgba(0, 0, 0, 0.7) transparent
                  transparent;
                position: absolute;
                left: -16px;
                top: 9px;
              }
            }
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
    padding: 0 15px;
  }
  .bindType {
    height: 40px;
    line-height: 40px;
    background-color: #ffffff;
    border-top: 1px solid #eee;
    > span {
      display: inline-block;
      width: 100px;
      text-align: center;
      cursor: pointer;
      &.active {
        color: #3175f6ff;
        border-bottom: 2px solid #3175f6ff;
      }
    }
  }
  .bindName {
    padding: 15px;
  }
  .addDevice {
    width: 100px;
    height: 32px;
    background-color: #49af61ff;
    color: #ffffff;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    position: relative;
    top: -56px;
    right: -720px;
    justify-content: center;
    border-radius: 3px;
    cursor: pointer;
    .addIcon {
      display: inline-block;
      width: 16px;
      height: 16px;
      background: url(../../../../assets/add.png) no-repeat;
      background-size: 100% 100%;
      margin-right: 5px;
    }
  }
  .deviceList {
    min-height: 200px;
    padding: 0 15px;
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
        width: 100px;
        height: 32px;
        line-height: 32px;
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
.tips {
  padding-left: 15px;
  padding-bottom: 10px;
  font-size: 10px;
  background-color: #ffffff;
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
}
.titleDiv {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f6f6f6;
  padding: 0 15px;
}
.tower {
  span {
    display: inline-block;
    width: 100px;
    height: 34px;
    line-height: 34px;
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
  padding: 15px;
  border-bottom: 1px solid #cecece;
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
