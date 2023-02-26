<template>
  <div :class="[hourseList === 'on' ? 'houring paddingLeft' : 'houring', hourseList === 'off' ? 'houring paddingRight' : 'houring']">
    <span class="page_head_title">房源招租</span>
    <ul class="default_tab_block">
      <li v-if="hasAuthority('02020204')"
          @click="switchover('industryCAD')">
        <span>房源平面图</span>
      </li>
      <li v-if="hasAuthority('02020205')"
          @click="switchover('charts')">
        <span>租控图</span>
      </li>
      <li v-if="hasAuthority('02020201') || hasAuthority('02020202') || hasAuthority('02020203')"
          class="active">
        <span>房源列表</span>
      </li>
    </ul>
    <div class="hourse_container">
      <div class="search-bar">
        <div class="operator">
          <el-select v-model="seachParams.organizeId"
                     clearable
                     @change="organizesChange"
                     placeholder="管理企业">
            <el-option v-for="item in organizesOptions"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="seachParams.projectManagemantId"
                     placeholder="项目"
                     filterable
                     @change='getBuliding'
                     clearable>
            <el-option v-for="item in projectOptions"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="seachParams.buildingId"
                     placeholder="楼宇"
                     @change="getFloorList"
                     clearable>
            <el-option v-for="item in options2"
                       :key="item.id"
                       :label="item.buildingName"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="seachParams.floorId"
                     placeholder="楼层"
                     clearable>
            <el-option v-for="item in options3"
                       :key="item.name"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-input v-model="seachParams.queryShopNumber"
                    style="width:180px"
                    placeholder="房源号"></el-input>
          <el-select v-model="seachParams.useStatus"
                     placeholder="状态"
                     clearable>
            <el-option value="USING"
                       label="使用中"></el-option>
            <el-option value="DISABLE"
                       label="已停用"></el-option>
          </el-select>
          <span @click="search"
                class="query-btn">查询</span>

        </div>
        <div>
          <div v-if="hasAuthority('02020201')">
            <el-button class="tban tban1"
                       @click="addHoursing"><i class="iconfont icon-crm_xinzeng-"></i> 新增房源</el-button>
            <!-- <el-dropdown @command="toLead"
                         trigger="click"
                         style="margin-left: 10px">
              <el-button class="tban toLead"
                         style="background: rgba(255,255,255);border-color: rgba(64,158,255);color: rgba(64,158,255);">导入房源</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="download">下载模板</el-dropdown-item>
                <el-dropdown-item command="toLead">
                  <span style="cursor: pointer;">
                    导入房源
                    <input @change="importModel($event)"
                           type="file"
                           style="position: absolute;opacity: 0;bottom: 17px;left: 0;width: 98px;cursor: pointer;" />
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
          </div>
        </div>
      </div>
      <div class="hourse_statistical">
        <div :class="{ 'active': seachParams.onRent===null }"
             @click="onRentChange(null)">
          <span>全部房源</span>
          <span>{{statisicsData.count}}</span>
          <span>{{statisicsData.buildingAreaSum}}m²</span>
        </div>
        <p></p>
        <div :class="{ 'active': seachParams.onRent===false }"
             @click="onRentChange(false)">
          <span>空置</span>
          <span>{{statisicsData.noRentCount}}</span>
          <span>{{statisicsData.noRentBuildingAreaSum}}m²</span>
        </div>
        <p></p>
        <div :class="{ 'active': seachParams.onRent }"
             @click="onRentChange(true)">
          <span>已租</span>
          <span>{{statisicsData.isRentCount}}</span>
          <span>{{statisicsData.isRentBuildingAreaSum}}m²</span>
        </div>
        <p></p>
      </div>
      <div class="hourse-table">
        <div class="table">
          <el-table :data="tableData"
                    style="width: 100%">
            <el-table-column prop="projectManagement.originalProjectName"
                             label="管理企业"
                             align="center"></el-table-column>
            <el-table-column label="项目名称"
                             align="center">
              <template slot-scope="scope">
                <div>{{scope.row.projectManagement.projectName}}</div>
                <!-- <span v-if="scope.row.contractEndDay>0 && onRent"
                      class="expire"
                      style="background-color: #f3cccb;padding: 2px 5px;border-radius: 4px;color: #EB605B;">合同{{scope.row.contractEndDay}}天后到期</span>
                <span v-if="scope.row.contractEndDay<=0 && onRent && scope.row.contractEndDay!==null"
                      class="expire"
                      style="background-color: #f3cccb;padding: 2px 5px;border-radius: 4px;color: #EB605B;">合同已到期</span> -->
              </template>
            </el-table-column>
            <el-table-column prop="building.buildingName"
                             label="楼宇名称"
                             align="center"></el-table-column>
            <el-table-column prop="floor.name"
                             label="楼层"
                             align="center"></el-table-column>
            <el-table-column prop="shopNumber"
                             label="房源号"
                             align="center"></el-table-column>
            <el-table-column prop="buildingArea"
                             label="建筑面积/㎡"
                             align="center"></el-table-column>
            <el-table-column label="空置/已租"
                             align="center">
              <template slot-scope="scope">
                <div>
                  <div>{{scope.row.onRent?'已租':'空置'}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="状态"
                             align="center">
              <template slot-scope="scope">
                <div>{{scope.row.useStatus==='USING'?'使用中':'已停用'}}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作"
                             align="center">
              <template slot-scope="scope">
                <el-button @click="handleEdit(scope.$index, scope.row)"
                           class="el-button--primary operation-btn"
                           size="mini"
                           v-if="hasAuthority('02020203')">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="ctc-foot1">
          <span><span style="margin-right:10px">{{pager.currentPage}}/{{Math.ceil(pager.total/pager.pgSize)}}页</span> 共{{pager.total}}条记录</span>
          <el-pagination v-if="pager.total > 0"
                         background
                         layout="prev, pager, next"
                         :page-size="pager.pgSize"
                         :total="pager.total"
                         :current-page.sync="pager.currentPage"
                         @current-change="current_change">
          </el-pagination>
          <div class="pagingnum">
            显示 <select v-model="pager.pgSize"
                    @change="pgSizeSelectFn">
              <option v-for="item in pager.pgNumoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </option>
            </select>
            条目
          </div>
        </div>
      </div>
    </div>
    <el-dialog class="addHourse housingList_addShop"
               title="新增房源"
               :visible.sync="hourseVisible"
               :close-on-click-modal="false">
      <div>
        <div class="title">
          <i></i>
          <span>选择资产</span>
        </div>
        <el-form class="form"
                 :model="addData"
                 ref="addData"
                 :rules="addDataRules">
          <div class="content">
            <el-form-item prop="organizeId">
              <span>管理企业<i>*</i></span>
              <el-select v-model="addData.organizeId"
                         @change="organizesChange1"
                         size="small"
                         placeholder="请选择">
                <el-option v-for="item in organizesOptions"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
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
          </div>
          <div class="shadowBox"></div>
          <div class="title"
               style="width:100%">
            <i></i>
            <span>基本信息</span>
          </div>
          <div class="content">
            <el-form-item prop="shopNumber">
              <span>房源号<i>*</i></span>
              <el-input v-model="addData.shopNumber"
                        size="small"></el-input>
            </el-form-item>
            <el-form-item prop="buildingArea">
              <span>建筑面积/㎡<i>*</i></span>
              <el-input v-model="addData.buildingArea"
                        size="small"
                        @input="getHsRate"
                        type="number"></el-input>
            </el-form-item>
            <el-form-item prop="floor">
              <span>选择楼层<i>*</i></span>
              <el-select v-model="addData.floor"
                         size="small"
                         placeholder="请选择">
                <el-option v-for="item in buildingList"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="useArea">
              <span>使用面积/㎡</span>
              <el-input v-model="addData.useArea"
                        size="small"
                        @input="getHsRate"
                        type="number"></el-input>
            </el-form-item>
            <el-form-item prop="address">
              <span>地址</span>
              <el-input v-model="addData.address"
                        size="small"></el-input>
            </el-form-item>
            <el-form-item prop="productionCertificateNo">
              <span>产证号</span>
              <el-input maxlength="50"
                        v-model="addData.productionCertificateNo"
                        size="small"></el-input>
            </el-form-item>
            <el-form-item style="width:100%"
                          prop="imgUrls">
              <span>图片</span>
              <div style="display: flex;margin-top:10px;">

                <div v-for="(item, index) in addData.imgUrls"
                     class="imgItem"
                     :key="index">
                  <img :src="item">
                  <i @click="deleFile(item, index)"
                     class="iconfont icon-jinakangbaoicons18"></i>
                </div>
                <aliUpload class="aliUpload deviceDetails"
                           v-if="addData.imgUrls.length < 5"
                           :upLoadText="upLoadText_cost"
                           :fileType="fileType_cost"
                           :fileSize="fileSize"
                           :iconShow="false"
                           :iconImg="iconImg"
                           :uploadIcon="true"
                           @setAnnex="setAnnex" />
              </div>
            </el-form-item>
          </div>

        </el-form>
      </div>
      <div slot="footer"
           class="slotfooter">
        <span @click="hourseVisible=false">取 消</span>
        <span @click="addHourse('addData')"
              class="subBtn">确 定</span>
      </div>
    </el-dialog>
    <hourseDetails :detailsdrawershow="detailsShow"
                   :detailData="detailData"
                   ref="hourseDetails"
                   @drawerClose="detailsClose"
                   @query="search" />
    <storeDetailis :detailsdrawershow="storeDetailisShow"
                   :detailData="storeDetailisData"
                   :options1="projectOptions"
                   ref="storeDetailis"
                   @shopDetails="shopDetails"
                   @showStoreDetails="showStoreDetails"
                   @handleEdit='handleEdit'
                   @queryList='queryList'
                   @tenantHandleEdit='tenantHandleEdit'
                   @drawerClose="storeDetailisHide" />
    <!-- 客户详情 -->
    <tenantDetails :detailsdrawershow="tenantDetailsShow"
                   :tenantDetail="tenantDetailData"
                   ref="tenantDetails"
                   @affirmDialog="affirmDialog"
                   @drawerClose="tenantDetailsClose"
                   @query="tenantQuery"
                   @riskDetailsShowFn="riskDetailsShowFn"
                   @queryExportResult="queryExportResult"
                   v-if="tenantDetailsShow" />
    <!-- 风险详情 -->
    <riskDetails :detailsdrawershow="riskDetailsShow"
                 :tenantDetail="tenantDetailData"
                 :riskTab="riskTab"
                 @drawerClose="riskDetailsClose" />
    <!-- 合同详情 -->
    <contractsDetails :detailsdrawershow="contractsDetailsShow"
                      :detailData="contractsDetailData"
                      :withdrawalData="withdrawalData"
                      ref="contractsDetails"
                      @openAddDialog="openAddDialog"
                      @drawerClose="contractDrawerClose"
                      @showTenant="showTenant" />
    <!-- 客户详情导入 -->
    <el-dialog title="提示"
               :visible.sync="centerDialogVisible"
               class="turnoverDialog"
               width="30%"
               center>
      <span>该客户目前可能未租赁房源，是否继续导入</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <span class="UpBtn1">
          <i>确 定</i>
          <input type="file"
                 @change="importTenant('addapp', $event)"
                 id="importTenant">
        </span>
      </span>
    </el-dialog>
    <!-- 导入错误 -->
    <el-dialog v-if="errorPrompt"
               title="错误提示"
               :visible.sync="errorPrompt">
      <el-table :data="gridData"
                style="min-height: 200px;border-left: 1px solid #eee;border-right: 1px solid #eee;">
        <el-table-column property="fileName"
                         label="导入文件"
                         align="center"></el-table-column>
        <el-table-column label="导入结果"
                         align="center"
                         width="220px">
          <template slot-scope="scope">
            <span style="color: red">{{scope.row.result}}</span>
          </template>
        </el-table-column>
        <el-table-column property="address"
                         label="操作"
                         align="center"
                         width="140px">
          <template slot-scope="scope">
            <span class="export-error"
                  @click="downLoadModel(scope.$index, scope.row)">导出错误提示</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="errorPrompt = false"
                   class="close-button">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import context from '@/service'
import hourseDetails from './components/hourseDetails'
import storeDetailis from './components/storeDetailis'
import aliUpload from '@/components/aliUpload.vue'
import { toLocaleFixed } from '@/utils/validate.js'
import * as hub from '@/service/eventHub'
import tenantDetails from '@/views/operationManagement/tenantInfo/components/tenantDetails.vue'
import contractsDetails from '@/views/contractManagement/contractsList/components/contractsDetails.vue'
import riskDetails from '@/views/operationManagement/tenantInfo/components/riskDetails'
export default {
  name: 'housingList',
  components: {
    hourseDetails,
    aliUpload,
    storeDetailis,
    tenantDetails,
    contractsDetails,
    riskDetails
  },
  data () {
    var validatorArea = (rule, value, callback) => {
      if (Number(this.addData.useArea) > Number(this.addData.buildingArea)) {
        callback(new Error('使用面积不能大于建筑面积'))
      } else {
        callback()
      }
    }
    return {
      addData: {
        organizeId: '',
        projectManagement: null,
        building: null,
        shopNumber: '',
        buildingArea: '',
        floor: null,
        useArea: '',
        address: '',
        productionCertificateNo: '',
        useStatus: 'USING',
        imgUrls: []
      },
      seachParams: {
        organizeId: '',
        projectManagemantId: '',
        buildingId: '',
        floorId: '',
        queryShopNumber: '',
        useStatus: 'USING',
        onRent: null
      },
      riskDetailsShow: false,
      riskTab: 0,
      fileSize: 3,
      fileType_cost: ['png', 'jpg'],
      iconImg: 'icon-shangchuantupianicon',
      upLoadText_cost: '上传图片',
      storeDetailisShow: false,
      storeDetailisData: {
        imgUrls: [],
        projectManagement: {
          projectName: ''
        },
        building: {},
        floor: {}
      },
      organizesOptions: [],
      options1: [],
      options2: [],
      options3: [],
      checkList: ['USING'],
      pager: {
        currentPage: 1,
        pgNum: 1,
        total: 0,
        pgSize: 15,
        pgNumoptions: [
          {
            value: 15,
            label: '15'
          },
          {
            value: 30,
            label: '30'
          },
          {
            value: 50,
            label: '50'
          }
        ]
      },
      input: '',
      tableData: [],
      addDataRules: {
        organizeId: [
          { required: true, message: '请选择管理企业', trigger: 'change' }
        ],
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
        buildingArea: [
          { required: true, message: '请输入建筑面积', trigger: 'blur' },
          { trigger: 'blur', validator: validatorArea }
        ],
        useArea: [
          { trigger: 'blur', validator: validatorArea }
        ]
      },
      fieldsList: [],
      formLabelWidth: '120px',
      hourseVisible: false,
      selProject: false,
      selHourse: false,
      hourseList: '',
      detailsShow: false,
      detailData: {
        imgUrlss: []
      },
      projectList: [],
      hourList: [],
      buildingList: [],
      onRent: false,
      statisicsData: {
        count: 0,
        buildingAreaSum: 0,
        noRentCount: 0,
        noRentBuildingAreaSum: 0,
        isRentCount: 0,
        isRentBuildingAreaSum: 0
      },
      projectArr: [],
      buildsList: [],
      idsArray: [],
      conditionCheckList: [],
      needValue: {
        KWHVvalue: '',
        SWWERvalue: '',
        WASTE_WATERvalue: '',
        FEED_WATERvalue: '',
        AIR_CONDITIONvalue: '',
        OIL_DIAINvalue: '',
        FLUEvalue: '',
        CASvalue: ''
      },
      hsAcquisitionRate: '',
      errorField: false,
      errorTip: '',
      projectOptions: [],
      tenantDetailsShow: false,
      centerDialogVisible: false,
      contractsDetailsShow: false,
      tenantDetailData: {},
      contractsDetailData: {},
      withdrawalData: {},
      errorPrompt: false,
      gridData: [],
      roomsUseOption: [
        { value: 'SHOP', name: '商铺' },
        { value: 'WORK', name: '办公' },
        { value: 'MARKET', name: '菜场' }
      ]
    }
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
    this.getOrganizes()
  },
  methods: {
    onRentChange (type) {
      this.seachParams.onRent = type
      this.search()
    },
    query () {
      this.seachParams.page = this.pager.currentPage - 1
      this.seachParams.size = this.pager.pgSize
      context.http.get('/cms/api/rooms', this.seachParams).then(res => {
        this.tableData = res.data.list
        this.tableData.forEach(ele => {
          ele.buildingArea = toLocaleFixed(ele.buildingArea)
        })
        this.statisicsData = res.data.statisics
        this.pager.total = Number(res.headers['x-total-count'])
      })
    },
    async getOrganizes () { // 管理企业获取接口
      // 管理企业
      let res = await context.http.get('/uaa/api/organizes/enterprise/user', { useStatus: 'USING', organizeType: 'ENTERPRISE' })
      this.organizesOptions = res.data
      this.seachParams.organizeId = this.$route.params.organizeId ? this.$route.params.organizeId : ''
      if (this.seachParams.organizeId) {
        // 项目
        let res1 = await context.http.get('/cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: this.seachParams.organizeId })
        this.projectOptions = res1.data
        this.seachParams.projectManagemantId = this.$route.params.projectManagementId ? this.$route.params.projectManagementId : ''
        if (this.seachParams.projectManagemantId) {
          // 楼宇
          let res2 = await context.http.get(`cms/api/project/${this.seachParams.projectManagemantId}/buildings`, { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING' })
          this.options2 = res2.data.filter((item, index) => {
            return item.assetsType === 'BUILDING'
          })
          this.seachParams.buildingId = this.$route.params.buildingId ? this.$route.params.buildingId : ''
          if (this.seachParams.buildingId) {
            let res3 = await context.http.get(`cms/api/floors/building/${this.seachParams.buildingId}`)
            this.options3 = res3.data
            if (this.options3.length) {  // 因为房源平面图 楼层采用的是 楼层名称查询 所以拿不到子页面需要的楼层id  故备注传过来的楼层id
              // this.seachParams.floorId = this.options3[0].id
              if (this.$route.params.floorId) {
                this.options3.forEach((item) => {
                  if (item.name === this.$route.params.floorId) {
                    this.seachParams.floorId = item.id
                  }
                })
                this.query()
              } else {
                this.seachParams.floorId = ''
                this.query()
              }
            } else {
              this.seachParams.floorId = ''
              this.query()
            }
          } else {
            this.query()
          }
        } else {
          this.query()
        }
      } else {
        this.query()
      }
    },
    async organizesChange (id) { // 管理企业查名下项目
      this.seachParams.projectManagemantId = ''
      this.seachParams.buildingId = ''
      this.seachParams.floorId = ''
      this.projectOptions = []
      this.options2 = []
      this.options3 = []
      let res = await context.http.get('/cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: this.seachParams.organizeId })
      this.projectOptions = res.data
    },
    async getBuliding () { // 切换项目
      this.seachParams.buildingId = ''
      this.seachParams.floorId = ''
      this.options2 = []
      this.options3 = []
      if (this.seachParams.projectManagemantId === '' || !this.seachParams.projectManagemantId) {
        return
      }
      let result = await context.http.get(`cms/api/project/${this.seachParams.projectManagemantId}/buildings`, { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING' })
      this.options2 = result.data.filter((item, index) => {
        return item.assetsType === 'BUILDING'
      })
    },
    async getFloorList () { // 切换楼宇
      this.seachParams.floorId = ''
      this.options3 = []
      if (this.seachParams.buildingId === '' || !this.seachParams.buildingId) {
        return
      }
      let result = await context.http.get(`cms/api/floors/building/${this.seachParams.buildingId}`)
      this.options3 = result.data
    },
    async organizesChange1 (id) { // 管理企业查名下项目
      this.addData.projectManagement = null
      this.addData.building = null
      this.addData.floor = null
      this.options = []
      this.buildingOptions = []
      let res = await context.http.get('/cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: this.addData.organizeId })
      this.projectList = res.data
    },
    riskDetailsClose () {
      this.riskDetailsShow = false
    },
    riskDetailsShowFn (i) {
      this.riskTab = i
      this.riskDetailsShow = true
    },
    queryExportResult (id, flag) { // flag  true代表经营数据 false税收数据
      this.flag = flag
      const loading = this.$loading({
        lock: true,
        text: '导入中',
        spinner: 'el-icon-loading el-import-loading',
        customClass: 'loading-icon',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let url = ''
      if (flag) {
        url = `/cms/api/tenantBusiness-excel/detail?excelId=${id}`
      } else {
        url = `/cms/api/tenantTax-excel/detail?excelId=${id}`
      }
      context.http.get(url).then(res => {
        if (res.data.excelResult === '审核中') {
          setTimeout(res => {
            this.queryExportResult(id, flag)
          }, 5000)
        } else if (res.data.excelResult === '失败') {
          this.errorPrompt = true
          this.gridData = [{
            fileName: res.data.name,
            result: res.data.remark,
            id: res.data.id
          }]
          loading.close()
        } else {
          this.$message({
            message: '导入成功！',
            type: 'success'
          })
          console.log(this.$refs['tenantDetails'].$refs['dynamicComponent1'])
          this.$refs['tenantDetails'].$refs['dynamicComponent1'].queryFn()
          loading.close()
          // this.query()
        }
      })
    },
    shopDetails (roomId) {
      console.log(roomId)
      context.http.get('/cms/api/rooms/' + roomId).then(res => {
        if (res.status === 200) {
          this.storeDetailisData = res.data
          this.storeDetailisShow = true
        }
      })
    },
    showStoreDetails (storeId) {
      console.log('showStoreDetails')
      this.shopDetails(storeId)
    },
    queryList () {
      this.query(this.idsArray)
    },
    handleEdit (index, row) {
      this.roomsRowId = row.id
      context.http.get('/cms/api/rooms/' + row.id).then(res => {
        if (res.status === 200) {
          this.storeDetailisData = res.data
          this.storeDetailisShow = true
        }
      })
    },
    storeDetailisHide () {
      this.storeDetailisShow = false
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    search () {
      this.pager.currentPage = 1
      this.query(this.idsArray)
    },
    detailsClose () {
      this.detailsShow = false
    },
    bindCheckBox (value) {
      this.checkList = []
      this.checkList.push(value[1])
      this.pager.currentPage = 1
      this.query(this.idsArray)
    },
    current_change (currentPage) {
      this.pager.currentPage = currentPage
      this.query(this.idsArray)
    },
    pgSizeSelectFn () {
      this.pager.currentPage = 1
      this.query(this.idsArray)
    },
    addHoursing () {
      this.hourseVisible = true
      this.$nextTick(() => {
        this.$refs['addData'].resetFields() // 表单验证重置验证
      })
    },
    toLead (row) {
      if (row === 'download') {
        if (!this.seachParams.projectManagemantId) {
          this.$message({
            message: '请先选择项目',
            type: 'error'
          })
          return
        }
        axios({ method: 'GET', url: '/cms/api/rooms-excel/file?projectManagementId=' + this.seachParams.projectManagemantId, responseType: 'blob' }).then(res => {
          let url = window.URL.createObjectURL(new Blob([res.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          let fileName = res.headers['content-disposition'].substring(20)
          fileName = decodeURI(fileName)
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          window.URL.revokeObjectURL(url)
        })
      }
    },
    importModel (event) {
      if (!this.seachParams.projectManagemantId) {
        this.$message({
          message: '请先选择项目',
          type: 'error'
        })
        return
      }
      let files = event.target.files
      let form = new FormData()
      form.append('file', files[0])
      let name = files[0].name
      let index = name.lastIndexOf('.')
      let type = name.substr(index + 1).toLowerCase()
      if (files[0].size > (1024 * 1024 * 20)) {
        this.$message({
          message: '文件大小不能超过20M',
          type: 'error'
        })
        return
      }
      if (index > 0 && type !== 'xlsx' && type !== 'xls') {
        this.$message({
          message: '格式错误，请上传xlsx、xls格式文件',
          type: 'error'
        })
      } else {
        context.http.post('/cms/api/rooms-excel/file?projectManagementId=' + this.seachParams.projectManagemantId, form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          if (res.status === 200) {
            this.queryExportDetail(res.data.id)
            event.target.value = ''
          }
        }).catch(error => {
          event.target.value = ''
          console.info(error)
        })
      }
    },
    queryExportDetail (id) {
      const loading = this.$loading({
        lock: true,
        text: '导入中',
        spinner: 'el-icon-loading el-import-loading',
        customClass: 'loading-icon',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      context.http.get(`/cms/api/rooms-excel/detail?excelId=${id}&projectManagementId=${this.seachParams.projectManagemantId}`).then(res => {
        if (res.data.excelResult === '审核中') {
          setTimeout(res => {
            this.queryExportDetail(id)
          }, 5000)
        } else if (res.data.excelResult === '失败') {
          this.errorPrompt = true
          this.gridData = [{
            fileName: res.data.name,
            result: res.data.remark,
            id: res.data.id
          }]
          loading.close()
        } else {
          this.errorPrompt = false
          this.$message({
            message: '导入成功！',
            type: 'success'
          })
          loading.close()
          this.query()
        }
      })
    },
    async downLoadModel (index, row) {
      let url = ''
      if (row) {
        url = `/cms/api/rooms-excel/upload?excelId=${row.id}&projectManagementId=${this.seachParams.projectManagemantId}`
      }
      axios({ method: 'GET', url: url, responseType: 'blob' }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        let fileName = res.headers['content-disposition'].substring(20)
        fileName = decodeURI(fileName)
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(url)
      })
    },
    choose (state) {
      if (state === 'project') {
        this.selHourse = false
        this.selProject = !this.selProject
      } else {
        this.selProject = false
        this.selHourse = !this.selHourse
      }
    },
    chooseItem (state, item) {
      if (state === 'project') {
        this.selProject = !this.selProject
        this.addData.projectManagement = item
        this.addData.building = {}
        this.buildingList = []
        if (this.addData.floor) {
          this.addData.floor = null
        }
        context.http.get(`/cms/api/project/${item.id}/buildings`, { useStatus: 'USING' }).then(res => {
          this.hourList = res.data.filter((item, index) => {
            return item.assetsType === 'BUILDING'
          })
        })
      } else {
        this.selHourse = !this.selHourse
        this.addData.building = item
        if (this.addData.floor) {
          this.addData.floor = null
        }
        context.http.get('/cms/api/floors/building/' + this.addData.building.id).then(res => {
          this.buildingList = res.data
        })
      }
    },
    addLabel (e) {
      if (!e.target.value) return
      this.addData.label.push(e.target.value)
      e.target.value = ''
    },
    deleteLabel (inx) {
      this.addData.label.splice(inx, 1)
    },
    addHourse (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.projectConditions()
          let addData = JSON.parse(JSON.stringify(this.addData))
          this.buildingList.forEach(item => {
            if (item.id === addData.floor) {
              addData.floor = item
            }
          })
          context.http.post('/cms/api/rooms', addData).then(res => {
            this.$message.success('新增成功')
            this.addDialogClose()
            this.search()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addDialogClose () {
      this.$refs['addData'].resetFields()
      this.hourseVisible = false
    },
    deleBuild (index) {
      this.$refs.projectSidebar.deleBuild(index)
    },
    setpdleft (val) {
      this.hourseList = val
    },
    setBuildsList (val) {
      this.buildsList = val
      let idsArray = []
      this.buildsList.forEach(ele => {
        idsArray.push(ele.id)
      })
      this.idsArray = idsArray
    },
    setAnnex (annexURL, annexName) {
      this.addData.imgUrls.push(annexURL)
    },
    deleFile (item, index) {
      this.addData.imgUrls.splice(index, 1)
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
    handleCheckedCitiesChange (value) {
    },
    projectConditions () {
      let projectConditions = []
      this.conditionCheckList.forEach(ele => {
        switch (ele) {
          case 'KWH':
            projectConditions.push({ 'projectType': 'KWH', 'needValue': this.needValue.KWHVvalue })
            break
          case 'SWWER':
            projectConditions.push({ 'projectType': 'SWWER', 'needValue': this.needValue.SWWERvalue })
            break
          case 'WASTE_WATER':
            projectConditions.push({ 'projectType': 'WASTE_WATER', 'needValue': this.needValue.WASTE_WATERvalue })
            break
          case 'FEED_WATER':
            projectConditions.push({ 'projectType': 'FEED_WATER', 'needValue': this.needValue.FEED_WATERvalue })
            break
          case 'AIR_CONDITION':
            projectConditions.push({ 'projectType': 'AIR_CONDITION', 'needValue': this.needValue.AIR_CONDITIONvalue })
            break
          case 'OIL_DIAIN':
            projectConditions.push({ 'projectType': 'OIL_DIAIN', 'needValue': this.needValue.OIL_DIAINvalue })
            break
          case 'FLUE':
            projectConditions.push({ 'projectType': 'FLUE', 'needValue': this.needValue.FLUEvalue })
            break
          case 'CAS':
            projectConditions.push({ 'projectType': 'CAS', 'needValue': this.needValue.CASvalue })
        }
      })
      this.addData.projectConditions = projectConditions
    },
    getHsRate () {
      if (this.addData.useArea && this.addData.buildingArea) {
        this.hsAcquisitionRate = Number((this.addData.useArea / this.addData.buildingArea) * 100).toFixed(2)
      }
    },
    switchover (state) { // 平面图切换
      let floorName = ''
      if (this.seachParams.floorId) {
        this.options3.forEach((item) => {
          if (item.id === this.seachParams.floorId) {
            floorName = item.name
          }
        })
      }
      let params = {
        organizeId: this.seachParams.organizeId,
        projectManagementId: this.seachParams.projectManagemantId,
        buildingId: this.seachParams.buildingId,
        floorName: floorName
      }
      if (state === 'charts') {
        this.$router.push({ name: 'charts', params: params })
      } else {
        this.$router.push({ name: 'industryCAD', params: params })
      }
    },
    affirmDialog (contractId, tenantId) {
      this.centerDialogVisible = true
      this.contractId = contractId
      this.tenantId = tenantId
      console.log(contractId, tenantId)
    },
    tenantHandleEdit (index, row) {
      console.log(row)
      this.storeDetailisShow = false
      context.http.get('/cms/api/tenant/' + row.id).then(res => {
        this.tenantDetailData = res.data
        this.tenantDetailsShow = true
      })
    },
    contractDrawerClose (state) {
      console.log(state)
      this.contractsDetailsShow = false
      this.tenantDetailsShow = true
    },
    tenantDetailsClose (id) {
      if (!id) {
        this.tenantDetailsShow = false
        context.http.get('/cms/api/rooms/' + this.roomsRowId).then(res => {
          if (res.status === 200) {
            this.storeDetailisData = res.data
            this.storeDetailisShow = true
          }
        })
        return
      }
      context.http.get(`/cms/api/contracts/${id}`).then(res => {
        if (res.status === 200) {
          this.contractsDetailData = res.data
          this.tenantDetailsShow = false
          this.contractsDetailsShow = true
        }
      })
    },
    tenantQuery () { },
    showTenant (index, row) {
      this.tenantHandleEdit(0, row)
      this.contractsDetailsShow = false
    },
    openAddDialog () {
      this.$router.push({ name: 'contractsList', params: { pageFrom: 'TenantInformation' } })
    },
    importTenant (state, event) {
      let files = event.target.files
      let form = new FormData()
      form.append('file', files[0])
      form.append('contractId', this.contractId)
      form.append('tenantId', this.tenantId)
      let name = files[0].name
      let index = name.lastIndexOf('.')
      let type = name.substr(index + 1).toLowerCase()
      if (index > 0 && type !== 'xlsx' && type !== 'xls') {
        this.$message({
          message: '格式错误，请上传xlsx格式文件',
          type: 'error'
        })
      } else {
        context.http.post('/cms/api/tenantTurnover/file', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          this.centerDialogVisible = false
          this.$message({
            message: '导入成功！',
            type: 'success'
          })
          this.$refs.tenantDetails.getTurnoverList()// 调用子组件方法从新请求列表
          document.getElementById('importTenant').value = ''
          // this.getTurnoverList()
        }).catch(error => {
          document.getElementById('importTenant').value = ''
          console.info(error)
        })
      }
    },
    parseOrganize (organizeTree) {
      if (organizeTree.child.length === 0) {
        return { value: organizeTree.id ? organizeTree.id : organizeTree.userPostId ? organizeTree.userPostId : organizeTree.userId, label: organizeTree.name }
      } else {
        return {
          value: organizeTree.id ? organizeTree.id : organizeTree.userPostId ? organizeTree.userPostId : organizeTree.userId,
          label: organizeTree.name,
          children: organizeTree.child.map(item => {
            return this.parseOrganize(item)
          })
        }
      }
    }
  },
  mounted () {

  }
}
</script>
<style lang="scss" scoped>
.hourse_container {
  .seachDiv {
    height: 80px;
    background-color: #ffffff;
    border-radius: 5px;
    box-shadow: 4px 4px 4px 1px #eee;
    display: flex;
    align-items: center;
    padding: 0 20px;
    margin-bottom: 20px;
    position: relative;
    display: flex;
    justify-content: space-between;
    > .operator {
      > div {
        margin-right: 15px;
      }
    }
  }
}
</style>
<style lang="scss">
@import "../../../style/config";
.hourse_container {
  .operator {
    .el-select {
      width: 180px;
    }
  }
}
.housingList_addShop {
  .el-dialog {
    background-color: #faf7fa;
    .el-dialog__header {
      padding: 0;
      margin: 0;
      height: 60px;
      line-height: 60px;
      background-color: #ffffff;
      padding-left: 15px;
      font-weight: bold;
      border: none;
      margin-bottom: 15px;
      .el-dialog__title {
        color: #262626;
        font-size: 16px;
      }
    }
    .el-dialog__body {
      margin: 0;
      overflow: auto;
      background-color: #ffffff;
      padding: 0 !important;
      border: none;
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
        box-shadow: inset 0 0 6px #3577f6;
      }
      form.el-form {
        > div.content {
          padding: 15px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          .el-form-item {
            width: 30%;
            .el-form-item__content {
              .deviceDetails {
                width: 100px;
                height: 100px;
                .oss_file {
                  border-radius: 4px;
                  background-color: #f7f9fd;
                  > i {
                    font-size: 20px;
                    position: absolute;
                    top: -5px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    margin: auto;
                  }
                  > span {
                    position: absolute;
                    top: 18px;
                    left: 0;
                    right: 0;
                    font-size: 12px;
                  }
                }
              }
              .imgItem {
                width: 100px;
                height: 100px;
                margin-right: 10px;
                position: relative;
                > i {
                  color: #409eff;
                  position: absolute;
                  right: -8px;
                  top: -8px;
                  cursor: pointer;
                }
                > img {
                  width: 100px;
                  height: 100px;
                  object-fit: contain;
                }
              }
              > span {
                font-size: 14px;
                color: #777777;
                display: inline-block;
                width: 100%;
                text-align: left;
                margin-bottom: 4px;
                > i {
                  font-style: normal;
                  color: #ff0000;
                }
              }
              .el-select {
                width: 100%;
              }
            }
          }
        }
      }
      .title {
        height: 45px;
        padding-left: 15px;
        font-size: 16px;
        font-weight: bold;
        color: #262626;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #f6f6f6;
        > i {
          display: inline-block;
          width: 4px;
          height: 16px;
          background: rgba(53, 117, 246, 1);
          border-radius: 2px;
          margin-right: 5px;
        }
      }
    }
    .el-dialog__footer {
      padding: 0;
      background-color: #ffffff;
      margin-top: 15px;
      padding: 0 !important;
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
        }
      }
    }
  }
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
      background: url(../../../assets/closed.png) no-repeat;
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
    margin-bottom: 15px !important;
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
  font-size: 14px;
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
      height: 112px;
      background-color: #fff;
      margin: 10px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      display: flex;
      align-items: center;
      padding-left: 15px;
      > p {
        width: 1px;
        height: 46px;
        background-color: #ecedef;
        margin-left: 5px;
      }
      > div {
        width: 200px;
        height: 100px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        font-size: 16px;
        color: #333333;
        cursor: pointer;
        &.active {
          background: #eef4ff;
          border-radius: 1px;
          color: #3175f6;
          > span {
            color: #3175f6 !important;
          }
        }
        > span {
          &:nth-child(1) {
            color: #666666;
          }
          &:nth-child(2) {
            font-size: 24px;
            font-family: PingFang SC;
            font-weight: bold;
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
    .toLead {
      background: #fff;
      border-color: #409eff;
      color: #409eff;
      padding: 9px;
    }
  }
  .addHourse {
    .el-dialog {
      width: 900px;
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
</style>
