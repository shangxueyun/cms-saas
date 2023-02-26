<template>
  <div class="building-list">
    <div class="page_head_title"
         style="display: flex;"><i @click="toRouteReturn"
         class="el-icon-arrow-left"
         style=""></i> 楼宇</div>
    <div class="pl-content">
      <div class="plc-search">
        <div class="searchDetail">
          <!-- <el-select class="searchClass" v-model="search.organizeId" filterable clearable placeholder="管理企业" @change='changeSelect'>
            <el-option
              v-for="item in organizeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select class="searchClass" v-model="search.projectId" filterable clearable placeholder="项目名称">
            <el-option
              v-for="item in projectOptions"
              :key="item.id"
              :label="item.projectName"
              :value="item.id">
            </el-option>
          </el-select>
          <el-input  class="searchClass" v-model="search.addressOrName"
                    placeholder="资产名称/地址"></el-input>
          <el-select  class="searchClass" v-model="search.assetsType" clearable placeholder="资产类别">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> -->
          <el-select v-model="search.status"
                     placeholder="状态">
            <el-option v-for="item in statusOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <div class="query-btn"
               style="margin-left:20px"
               @click="initQuery">查询</div>
        </div>
        <el-button style="float:right;margin-top:19px;margin-right:30px;"
                   @click="addProjects"
                   class="tban tban1"><i class="iconfont icon-crm_xinzeng-"></i> 新增楼宇</el-button>
      </div>
      <div class="hourse_statistical">
        <div class="statistical_top">楼宇统计</div>
        <ul class="statistical_bot">
          <li class="totalImg">
            <img :src="projectList.previewImage"
                 mode="" />
            <span class="totalName">
              <span :title="projectList.projectName">
                {{projectList.projectName}}
              </span>
            </span>
          </li>
          <li>
            <p>楼宇数量</p>
            <p>{{buildingDataTotal.buildingCount}}</p>
          </li>
          <li>
            <p>管理房源</p>
            <p>{{buildingDataTotal.roomCount}}</p>
          </li>
          <li>
            <p>已租房源</p>
            <p>{{buildingDataTotal.rentRoomCount}}</p>
          </li>
          <li>
            <p>空置房源</p>
            <p>{{buildingDataTotal.onRentRoomCount}}</p>
          </li>
          <li>
            <p>管理房源面积㎡</p>
            <p>{{buildingDataTotal.buildingArea | toLocaleFixed}}</p>
          </li>
          <li>
            <p>已租房源面积㎡</p>
            <p>{{buildingDataTotal.rRentAreaB | toLocaleFixed}}</p>
          </li>
          <li>
            <p>空置房源面积㎡</p>
            <p>{{buildingDataTotal.kRentAreaB | toLocaleFixed}}</p>
          </li>
          <li>
            <p>面积出租率%</p>
            <p>{{buildingDataTotal.rentRate | toLocaleFixed}}</p>
          </li>
        </ul>
      </div>
      <div class="plc-table">
        <el-table :data="buildingData.buildingListDTOS"
                  style="width: 100%">
          <!-- <el-table-column prop="organizeName"
                           label="管理企业"
                           align="center">
          </el-table-column>
          <el-table-column prop="projectManagementDTO.projectName"
                           label="项目名称"
                           align="center">
          </el-table-column> -->
          <el-table-column prop="buildingName"
                           label="楼宇名称"
                           align="center">
          </el-table-column>
          <el-table-column prop="address"
                           label="地址"
                           align="center">
          </el-table-column>
          <el-table-column label="类型"
                           align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{filterAssetsType(scope.row.assetsType)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="有证/无证"
                           align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{filterHavaCertificates(scope.row.havaCertificates, scope.row.assetsType)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="管理负责人"
                           prop="user"
                           align="center">
            <!-- <template slot-scope="scope">
                          <span style="margin-left: 10px">{{filterHavaCertificates(scope.row.havaCertificates, scope.row.assetsType)}}</span>
                        </template> -->
          </el-table-column>
          <el-table-column prop="contractNumber"
                           label="面积"
                           align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{formatArea(scope.row)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="管理房源面积㎡"
                           align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ formatManagerArea(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="已租房源面积㎡"
                           prop="yzArea"
                           align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ formatYzArea(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="面积出租率%"
                           prop="areaRate"
                           align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ formatAreaRate(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           width="160"
                           align="center">
            <template slot-scope="scope">
              <el-button class="el-button--primary rent-control"
                         size="mini"
                         v-if="filterChart(scope.row)"
                         :disabled="scope.row.useStatus === 'DISABLE'"
                         @click="goCharts(scope.$index, scope.row)">租控图</el-button>
              <span v-else
                    style="display: inline-block;width: 77px;height: 22px;"></span>
              <el-button class="el-button--primary editbtn"
                         size="mini"
                         @click="handleEdit(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-if="total>0"
           class="ctc-foot">
        <span><span style="margin-right:10px">{{currentPage}}/{{totalPages}}页</span> 共{{total}}条记录</span>
        <el-pagination v-if="total > 0"
                       background
                       layout="prev, pager, next"
                       :page-size=pgSize
                       :total="total"
                       :current-page="currentPage"
                       @current-change="current_change">
        </el-pagination>
        <div class="pagingnum">
          显示 <select v-model="pgSize"
                  @change="currentSel">
            <option v-for="item in pgNumoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </option>
          </select>
          条目
        </div>
      </div>
    </div>
    <el-dialog :title="addBuildingTitle"
               :close-on-click-modal="false"
               :visible.sync="adddialogVisible"
               @close="$refs['addBuilding'].dialogHide()"
               class="addProjectdialog">
      <addBuilding ref="addBuilding"
                   @dialogHide="dialogHide"
                   @query='query'
                   @getTenantDetail='getTenantDetail'
                   :buildDetailsShow='buildDetailsShow'
                   :adddialogVisible='adddialogVisible'
                   :searchData="search" />
    </el-dialog>
    <buildingDetails :detailsdrawershow="buildDetailsShow"
                     @showflowListDialoag="showflowListDialoag"
                     @drawerClose="drawerClose"
                     :tenantDetail="tenantDetail"
                     :organizeOptions='organizeOptions'
                     :contractsListData="contractsListData"
                     :buildingListData='buildingListData'
                     @getBuildingListData='getBuildingListData'
                     @getTenantDetail='getTenantDetail'
                     @dialogHide="dialogHide"
                     @showAddProjects='showAddProjects'
                     @query='query'
                     @detail="detail" />
    <!-- :timeLineListData="timeLineListData" 跟进记录数据 -->
    <el-dialog title="写跟进"
               :visible.sync="dialogVisible"
               class="storeDetailisdialog store_flow_new"
               @close="dialogVisibleClose"
               width="500px">
      <div>
        <el-form :model="ruleForm"
                 :rules="rules"
                 ref="ruleForm">
          <el-form-item prop="followTime">
            <span>时间 <i class="required">*</i></span>
            <el-date-picker v-model="ruleForm.followTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            :picker-options="pickerOptions"
                            value-format="yyyy-MM-ddTHH:mm:ss"
                            style="margin-top:15px;width:100%;"></el-date-picker>
          </el-form-item>
          <el-form-item prop="followContent">
            <span>内容 <i class="required">*</i></span>
            <el-input type="textarea"
                      v-model="ruleForm.followContent"
                      style="height:auto;margin-top:15px;"
                      maxlength="200"
                      placeholder="200字以内"></el-input>
          </el-form-item>
          <div>
            <div class="enclosure"
                 style="width:100%">
              <div class="enclosure-head"
                   style="width: 130px;">附件
                <div style="opacity:1;margin-left:0;"
                     class="iconfont icon-shangchuanfujianicon upload"> 上传附件
                  <aliUpload class="aliUpload aliUploadFlow"
                             style="display: inline-block;"
                             :upLoadText="upLoadText"
                             :fileType="fileType_cost"
                             :iconShow="false"
                             @setAnnex="setAnnexs" />
                </div>
              </div>
              <div class="enclosure-list enclosure-list-flow"
                   v-for="(item, index) in ruleForm.annexes"
                   :key="index">
                <div class="el-item">
                  <span style="padding-left: 0">{{item.annexName}}</span>
                  <span v-if="item.annexName">
                    <i style="cursor:pointer"
                       @click="deleFileFlow(item, index)"
                       class="iconfont icon-lajixiang"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <!-- 跟进里的消息推送 -->
          <el-form-item>
            <div class="cttitle">消息推送</div>
            <span class="sendIfo">不发送</span>
            <el-switch style="margin:0 12px;"
                       v-model="switchTurn"
                       active-color="#91CF48"
                       inactive-color="#EAECF0"
                       @change="changeSwitch">
            </el-switch>
            <span class="sendIfo">发送</span>
          </el-form-item>
          <el-form-item v-if="switchTurn">
            <div class="cttitle">收件人<i class="required">*</i></div>
            <div class="select-wrap">
              <div class="select-span">
                <span v-for="(item, index) in selectSpan"
                      :key="index">{{item.userName ? item.userName : item.userPostName}} <i class="iconfont icon-cha"
                     @click="delSelect(item)"></i></span>
              </div>
              <i class="iconfont icon-bottom"
                 @click="organizationShow=!organizationShow"
                 :class="{'icon-top': organizationShow}"></i>
            </div>
            <transition name="sub-comments">
              <div class="organization"
                   v-show="organizationShow">
                <el-input placeholder="请输入组织名称/员工姓名"
                          prefix-icon="el-icon-search"
                          v-model="filterText"
                          class=""></el-input>
                <el-tree :data="orgListCopy"
                         show-checkbox
                         node-key="nodeId"
                         :render-after-expand="false"
                         :default-checked-keys="checkedKeys"
                         :filter-node-method="filterNode"
                         @check-change="handleCheckChange"
                         ref="treeForm"
                         :props="defaultProps">
                </el-tree>
              </div>
            </transition>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <span class="details_cannelBtn"
              @click="dialogVisibleClose">取消</span>
        <span class="details_submitBtn"
              @click="addRecord">确定</span>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import context from '@/service'
import addBuilding from './components/addBuilding'
import buildingDetails from './components/buildingDetails'
import aliUpload from '@/components/aliUpload.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import moment from 'moment'
export default {
  name: 'buildingList',
  components: {
    addBuilding,
    buildingDetails,
    aliUpload,
    aliDownLoad
  },
  data () {
    return {
      buildingName: '',
      assetId: null, // 资产id
      checkList: ['USING', 'DISABLE'],
      statusOptions: [{
        value: 'USING',
        label: '使用中'
      }, {
        value: 'DISABLE',
        label: '已停用'
      }],
      timeLineListData: [],
      contractsListData: [],
      adddialogVisible: false,
      dialogVisible: false,
      addProjectShow: false,
      buildDetailsShow: false,
      buildingData: {},
      tableData: [{
        code: '1',
        bdname: '1号楼'
      }],
      organizeOptions: [],
      tenantDetail: {
        projectManagementDTO: {},
        endWorkDate: null
      },
      currentPage: 1,
      totalPages: 1,
      pgNum: 1,
      total: 0,
      pgSize: 15,
      builddetailsData: {},
      addBuildingTitle: '新增楼宇',
      addList: { // 新增记录信息
        chargeDeptId: null,
        recordDate: '',
        title: '',
        content: '',
        annexes: []
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      addListRules: {
        recordDate: [
          { required: true, message: '请输入发生时间', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      rules: {
        followTime: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        followContent: [
          { required: true, message: '请输入内容', trigger: 'change' }
        ]
      },
      flowListDialoagVisible: false, // 添加记录
      switchTurn: false,
      organizationShow: false,
      categoryOptions: [{
        value: 'BUILDING',
        label: '楼宇'
      }, {
        value: 'FIELD',
        label: '场地'
      }, {
        value: 'LAND',
        label: '土地'
      }],
      landOptions: [{
        value: 1,
        label: '住宅用地'
      }, {
        value: 2,
        label: '工业用地'
      }, {
        value: 3,
        label: '商业用地'
      }, {
        value: 4,
        label: '综合用地'
      }, {
        value: 5,
        label: '公共用地'
      }, {
        value: 6,
        label: '保留用地'
      }, {
        value: 7,
        label: '绿化用地'
      }, {
        value: 8,
        label: '其他用地'
      }],
      category: [],
      upLoadText: '',
      fileType_cost: [],
      search: {
        organizeId: null,
        organizeName: '',
        projectId: null,
        projectName: null,
        addressOrName: '',
        assetsType: '',
        status: 'USING'
      },
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
      ],
      filterText: '',
      orgListCopy: [],
      checkedKeys: [],
      projectManagentId: '',
      ruleForm: {
        followTime: '',
        followContent: '',
        annexes: []
      },
      selectSpan: [],
      projectOptions: [],
      projectList: {},
      buildingDataTotal: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      buildingListData: []
    }
  },
  watch: {
    filterText (val) {
      this.$refs.treeForm.filter(val)
    }
  },
  created () {
    this.initOrganizes()
    // this.loadProject()
  },
  // 进
  beforeRouteEnter (to, from, next) {
    next()
  },
  methods: {
    initQuery () {
      this.currentPage = 1
      this.query()
    },
    toRouteReturn () {
      window.history.back()
    },
    filterAssetsType (type) {
      let value
      if (type === 'BUILDING') {
        value = '楼宇'
      } else if (type === 'FIELD') {
        value = '场地'
      } else if (type === 'LAND') {
        value = '土地'
      }
      return value
    },
    formatManagerArea (row) {
      let temp = null
      let type = row.assetsType
      if (type === 'BUILDING') {
        let managerArea = Number(row.managerArea)
        temp = managerArea.toFixed(2)
      }
      return temp
    },
    formatYzArea (row) {
      let temp = null
      let type = row.assetsType
      if (type === 'BUILDING') {
        let yzArea = Number(row.yzArea)
        temp = yzArea.toFixed(2)
      }
      return temp
    },
    formatAreaRate (row) {
      let temp = null
      let type = row.assetsType
      if (type === 'BUILDING') {
        let areaRate = Number(row.areaRate)
        temp = areaRate.toFixed(2)
      }
      return temp
    },
    formatArea (row) {
      let type = row.assetsType
      let total = 0
      if (type === 'BUILDING' && (row.downArea || row.upArea)) {
        let downArea = Number(row.downArea)
        let upArea = Number(row.upArea)
        total = downArea + upArea
        total = total.toFixed(2) + '㎡'
      } else if (type === 'FIELD') {
        let buildingArea = Number(row.buildingArea)
        total = buildingArea.toFixed(2) + '㎡'
      } else if (type === 'LAND') {
        let buildingArea = Number(row.buildingArea)
        total = buildingArea.toFixed(2) + '亩'
      }
      return total
    },
    formatUseArea (useArea, assetsType, type) {
      if (assetsType === type) {
        useArea = Number(useArea)
        return useArea.toFixed(2)
      } else {
        return ''
      }
    },
    filterChart (row) {
      let value = false
      if (row.assetsType === 'BUILDING') {
        value = true
      }
      return value
    },
    initOrganizes () {
      if (JSON.parse(sessionStorage.getItem('searchList'))) {
        let searchList = JSON.parse(sessionStorage.getItem('searchList'))
        sessionStorage.removeItem('searchList')
        this.search = searchList
        this.projectList = searchList.projectList
      } else {
        this.search.organizeId = this.$route.query.itemChild.organizeId
        this.search.organizeName = this.$route.query.organizeName
        this.search.projectId = this.$route.query.itemChild.id
        this.search.projectName = this.$route.query.itemChild.projectName
        this.search.status = this.checkList[0]
        this.projectList = this.$route.query.itemChild
      }
      this.query()
      // context.http.get('uaa/api/organizes/all/simple', {
      //   useStatus: this.checkList[0],
      //   organizeType: 'ENTERPRISE'
      // }).then(res => {
      //   if (res.status === 200) {
      //     this.organizeOptions = res.data
      //     this.search.organizeId = this.$route.query.organizeId
      //     context.http.get('cms/api/project-managements/byOrganizeId', {
      //       useStatus: this.checkList[0],
      //       organizeId: this.$route.query.organizeId
      //     }).then(res => {
      //       if (res.status === 200) {
      //         this.projectOptions = res.data
      //         this.search.projectId = this.$route.query.projectId
      //         this.query()
      //       }
      //     })
      //   }
      // })
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    dialogVisibleClose () {
      this.filterText = ''
      this.ruleForm.annexes = []
      this.$refs['ruleForm'].resetFields()
      this.dialogVisible = false
    },
    setAnnexs (annexURL, annexName) {
      this.ruleForm.annexes.push({ 'annexURL': annexURL, 'annexName': annexName })
    },
    deleFileFlow (item, index) {
      this.ruleForm.annexes.splice(index, 1)
    },
    getAllOrganizes () {
      context.http.get('uaa/api/organizes/all/simple', {
        useStatus: this.checkList[0],
        organizeType: 'ENTERPRISE'
      }).then(res => {
        if (res.status === 200) {
          this.organizeOptions = res.data
          this.getAllProject()
        }
      })
    },
    changeSelect (e) {
      if (e) {
        this.search.organizeId = e
        this.getAllProject()
      } else {
        this.search.projectId = null
        this.projectOptions = []
      }
    },
    getAllProject () {
      context.http.get('cms/api/project-managements/byOrganizeId', {
        useStatus: this.checkList[0],
        organizeId: this.search.organizeId || this.$route.query.organizeId
      }).then(res => {
        if (res.status === 200) {
          this.projectOptions = res.data
          if (this.projectOptions.length > 0) {
            this.search.projectId = this.projectOptions[0].id
          } else {
            this.search.projectId = null
          }
        }
      })
    },
    async addRecord () { // 新增房源跟进记录
      if (this.selectSpan.length === 0 && this.switchTurn) {
        this.$message.error('请选择收件人！')
        return
      }
      let arr = []
      this.selectSpan.forEach(ele => {
        arr.push(ele.userId)
      })
      arr = [...new Set(arr)]
      this.ruleForm.messageFlg = this.switchTurn
      this.ruleForm.userIds = arr
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.ruleForm.roomsId = this.assetId
          this.ruleForm.zcFollowType = 'BUILDING'
          context.http.post('/cms/api/roomsFollowRecord', this.ruleForm).then(res => {
            this.$message.success('新增成功')
            this.dialogVisibleClose()
            this.$refs['ruleForm'].resetFields()
            this.regetTimeLineListData()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async regetTimeLineListData () {
      let lineListResult = await context.http.get(`/cms/api/roomsFollowRecord/roomId/${this.assetId}`, {
        zcFollowType: 'BUILDING'
      })
      this.timeLineListData = lineListResult.data
    },
    projectDetails () {
      this.addProjectShow = true
    },
    drawerClose () {
      this.buildDetailsShow = false
    },
    dialogHide () {
      this.adddialogVisible = false
    },
    formatStatus () {

    },
    showflowListDialoag (id) {
      this.addList.chargeDeptId = id // 子组件拿到新增记录 主管部门id
      this.dialogVisible = true
      this.switchTurn = false
      this.selectSpan = []
      this.queryOrganizeList()
    },
    dataDel (index) {
      this.addList.annexes.splice(index, 1)
    },
    async queryOrganizeList () {
      this.orgListCopy = []
      context.http.get('/uaa/api/organizes/report').then(res => {
        if (res.status === 200) {
          this.orgList = res.data
          this.orgListCopy = JSON.parse(JSON.stringify(res.data))
          let cascaderData = []
          this.orgListCopy.forEach(item => {
            cascaderData.push(this.parseOrganize(item))
          })
          this.orgListCopy = cascaderData
        }
      })
    },
    parseOrganize (organizeTree) {
      if (organizeTree.reporterDTOList.length === 0) {
        return {
          userPostId: organizeTree.postId,
          userPostName: organizeTree.name,
          userName: organizeTree.userName,
          userId: organizeTree.userId,
          nodeId: organizeTree.nodeId,
          // label: (organizeTree.userName === null ? '' : organizeTree.userName) + '(' + (organizeTree.name === null ? '' : organizeTree.name) + ')',
          label: this.formateName(organizeTree),
          disabled: organizeTree.name === ''
        }
      } else {
        return {
          userPostId: organizeTree.postId,
          label: this.formateName(organizeTree),
          userPostName: organizeTree.name,
          userName: organizeTree.userName,
          userId: organizeTree.userId,
          nodeId: organizeTree.nodeId,
          disabled: organizeTree.name === '',
          children: organizeTree.reporterDTOList.map(item => {
            return this.parseOrganize(item)
          })
        }
      }
    },
    formateName (organizeTree) {
      let str = ''
      if (organizeTree.userName === null) {
        str = ''
      } else {
        str += organizeTree.userName
      }
      if (organizeTree.userName === null && organizeTree.name === null) {
        str += ''
      } else if (organizeTree.userName === null && organizeTree.name !== null) {
        str += organizeTree.name
      } else if (organizeTree.userName !== null && organizeTree.name !== null) {
        str += '(' + organizeTree.name + ')'
      }
      return str
    },
    changeSwitch (val) {
      this.selectSpan = []
      this.$message({
        message: '切换成功',
        type: 'success'
      })
    },
    // 收件人
    delSelect (data) {
      let selectSpan = this.selectSpan
      selectSpan.forEach((ele, index) => {
        if (ele.nodeId === data.nodeId) {
          this.selectSpan.splice(index, 1)
          this.$refs.treeForm.setChecked(ele, false)
        }
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleCheckChange (data, checked, indeterminate) {
      let selectSpan = this.selectSpan
      if (checked && !data.disabled && data.userId !== null) {
        selectSpan.push(data)
      } else {
        selectSpan.forEach((ele, index) => {
          if (ele.nodeId === data.nodeId) {
            selectSpan.splice(index, 1)
          }
        })
      }
      this.selectSpan = JSON.parse(JSON.stringify(selectSpan))
      console.log(this.selectSpan)
    },
    showflowLisClose () {
      this.addList = { // 新增记录信息
        chargeDeptId: null,
        recordDate: '',
        title: '',
        content: '',
        annexes: []
      }
      this.filterText = ''
      this.$refs['addList'].resetFields()
      this.flowListDialoagVisible = false
    },
    addflowLis () {
      if (this.selectSpan.length === 0 && this.switchTurn) {
        this.$message.error('请选择收件人！')
        return
      }
      let arr = []
      this.selectSpan.forEach(ele => {
        arr.push(ele.userId)
      })
      arr = [...new Set(arr)]
      this.addList.messageFlg = this.switchTurn
      this.addList.userIds = arr
      this.$refs['addList'].validate((valid) => {
        if (valid) {
          context.http.post('/cms/api/chargeDept/record', this.addList).then(res => {
            let row = { id: this.addList.chargeDeptId }
            this.showflowLisClose()
            this.handleEdit('', row)
            this.$message({
              type: 'success',
              message: '添加成功'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    filterHavaCertificates (type, assetsType) {
      if (assetsType === 'BUILDING') {
        if (type) {
          return '有'
        } else {
          return '无'
        }
      } else {
        return ''
      }
    },
    async query () {
      let result = await context.http.get('cms/api/buildings', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        // sort: 'sortNumber,asc',
        projectId: this.search.projectId,
        organizeId: this.search.organizeId,
        useStatus: this.search.status,
        next: true,
        // assetsType: this.search.assetsType,
        addressOrName: this.search.addressOrName
      })
      this.buildingData = result.data
      this.total = result.data.buildingListDTOS.length
      this.total = Number(result.headers['x-total-count'])
      console.log(Number(result.data.page.totalPages))
      this.totalPages = Number(result.data.page.totalPages)
      this.queryTotal()
    },
    async queryTotal () {
      let result = await context.http.get('cms/api/stat/thisProjectZc', {
        id: this.search.projectId,
        UseStatus: this.search.status
      })
      this.buildingDataTotal = result.data
    },
    loadProject () {
      context.http.get(`/cms/api/project-managements/${this.search.projectId}`).then(res => {
        this.projectList = res.data
      })
    },
    addProjects () {
      this.addBuildingTitle = '新增楼宇'
      this.adddialogVisible = true
    },
    showAddProjects () {
      this.addBuildingTitle = '编辑楼宇'
      sessionStorage.setItem('tenantDetail', JSON.stringify(this.tenantDetail))
      this.adddialogVisible = true
    },
    bindCheckBox (value) {
      this.checkList = []
      this.checkList.push(value[1])
      this.currentPage = 1
      this.query()
    },
    async handleEdit (row) {
      let result = await context.http.get(`cms/api/buildings/${row.id}`)
      this.tenantDetail = result.data
      if (this.tenantDetail.endWorkDate) {
        this.tenantDetail.endWorkDate = moment(this.tenantDetail.endWorkDate + '').format('YYYY')
      }
      this.assetId = row.id
      this.buildDetailsShow = true

      // 查询跟进记录
      // let lineListResult = await context.http.get(`/cms/api/roomsFollowRecord/roomId/${row.id}`, {
      //   zcFollowType: 'BUILDING'
      // })
      // this.timeLineListData = lineListResult.data

      // 查询合同列表
      let contractsResult = await context.http.get(`/cms/api/contracts/building?buildingId=${row.id}`)
      this.contractsListData = contractsResult.data
      // 查询管理负责人列表
      let buildingResult = await context.http.get(`/cms/api/buildingManageUser/buildingId/${row.id}`)
      this.buildingListData = buildingResult.data
    },
    async getBuildingListData (id) {
      let buildingResult = await context.http.get(`/cms/api/buildingManageUser/buildingId/${id}`)
      this.buildingListData = buildingResult.data
    },
    async getTenantDetail (id) {
      let result = await context.http.get(`cms/api/buildings/${id}`)
      this.tenantDetail = result.data
      if (this.tenantDetail.endWorkDate) {
        this.tenantDetail.endWorkDate = moment(this.tenantDetail.endWorkDate + '').format('YYYY')
      }
    },
    async detail (id) {
      let result = await context.http.get(`cms/api/buildings/${id}`)
      this.builddetailsData = result.data
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    goCharts (index, row) {
      let id = row.id
      let params = {
        organizeId: this.search.organizeId,
        projectManagementId: this.search.projectId,
        buildingId: id
      }
      let searchList = this.search
      searchList.projectList = this.projectList
      sessionStorage.setItem('searchList', JSON.stringify(searchList))
      this.$router.push({ name: 'charts', params: params })
    }
  }
}
</script>
<style lang="scss">
.building-list {
  font-size: 16px;
  background-color: #f9f9f9;
  .page_head_title {
    height: 22px;
    line-height: 22px;
    // margin-bottom: 12px;
    color: rgb(51, 51, 51);
    font-size: 16px;
    display: flex;
    i {
      font-size: 24px;
      padding-right: 6px;
      cursor: pointer;
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
  .pl-content {
    width: 100%;
    margin: 0 auto;
    .plc-search {
      width: 100%;
      height: 60px;
      line-height: 60px;
      background-color: #fff;
      margin: 12px 0;
      padding-left: 18px;
      box-shadow: 1px 2px 5px #eee;
      display: flex;
      justify-content: space-between;
      .searchDetail {
        .searchClass {
          margin-right: 10px;
        }
        .query-btn {
          display: inline-block;
        }
      }
      .el-input {
        width: 180px;
        height: 38px;
        // padding-left: 16rpx;
        input {
          height: 32px;
          line-height: 32px;
        }
      }
    }
    .hourse_statistical {
      background-color: #fff;
      margin: 10px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      .statistical_top {
        padding: 15px 30px;
        font-size: 15px;
        color: #333;
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
          &:nth-child(1) {
            border-right: 0;
          }
          &:nth-child(5) {
            border-right: 0;
            margin-right: 115px;
          }
          p {
            color: #666;
            font-size: 14px;
            line-height: 14px;
            margin-top: -8px;
            &:last-child {
              color: #333;
              font-size: 20px;
              margin-top: 30px;
              font-weight: 400;
            }
          }
          > img {
            width: 150px;
            height: 90px;
            margin-top: -18px;
            position: relative;
          }
          // >span {
          //   position: absolute;
          //   color: #fff;
          //   font-weight: 400;
          //   max-width: 140px;
          //   max-height: 40px;
          // }
          .totalName {
            overflow: hidden; /*超出部分隐藏*/
            text-overflow: ellipsis; /*超出部分文字以...显示*/
            top: -18px;
            left: 0;
            width: 150px;
            height: 80px;
            position: absolute;
            padding: 2px 0 0 2px;
            height: 22px;
            // background: #000000;
            background: linear-gradient(180deg, #000000 0%, #ffffff 100%);
            opacity: 0.7;
            color: #ffffff;
          }
        }
        .totalImg {
          position: relative;
        }
      }
    }
    .bd-statistics {
      background-color: #fff;
      margin-bottom: 10px;
      box-shadow: 1px 2px 5px #eee;
      .statistics-title {
        font-size: 14px;
        height: 30px;
        line-height: 30px;
        color: #333;
        font-weight: bold;
        padding-left: 20px;
        border-bottom: 1px solid #ededef;
      }
      .statistics-content {
        .contentItem {
          display: inline-block;
          padding: 20px 0 20px 20px;
        }
        .bd-number {
          margin-left: 6px;
          padding-right: 20px;
          font-size: 14px;
          font-weight: 400;
          font-family: PingFangSC;
          color: #353b4b;
          display: inline-block;
          min-width: 90px;
          .ci-title {
            font-weight: 400;
            height: 25px;
            line-height: 25px;
            color: #828692;
            font-size: 12px;
          }
          .ci-value {
            display: inline-block;
            font-size: 20px;
            margin-top: 4px;
            min-height: 20px;
          }
        }
        .borderstrip {
          width: 2px;
          height: 35px;
          background-color: #ecedef;
          display: inline-block;
          margin-top: 6px;
        }
      }
    }
    .plc-table {
      margin-top: 12px;
    }
    .rent-control {
      border: 1px solid #f3af3e;
      background-color: #fff;
      color: #f3af3e;
      &:hover {
        background-color: #f3af3e;
        color: #fff;
      }
    }
    .editbtn {
      color: #3175d2;
      &:hover {
        color: #fff;
      }
    }
  }
  // .ctc-foot {
  //   background-color: #ffffff;
  //   display: flex;
  //   justify-content: space-between;
  //   padding: 60px 0 30px 20px;
  //   .el-pagination.is-background .el-pager li:not(.disabled).active {
  //     background-color: #2f3f48;
  //     color: #fff;
  //   }
  //   .el-pagination.is-background .el-pager li:not(.disabled):hover {
  //     color: #999;
  //   }
  // }
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
  .addProjectdialog .el-dialog {
    width: 1000px;
    margin-top: 5vh !important;
    background: #f7f7f7;
    .el-dialog__header {
      background: #fff;
      margin: 0;
      border-bottom: 1px solid #f6f6f6;
      padding: 16px 20px;
      color: #262626;
      .el-dialog__title {
        font-size: 16px;
        font-weight: bolder;
        color: #262626;
      }
    }
    .el-dialog__body {
      margin: 0;
    }
  }
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #d9dce2;
  }
  .el-table__row div {
    white-space: nowrap;

    img {
      width: 97px;
      height: 80px;
    }
    .buildingImage {
      width: 120px;
      margin: 0 auto;
    }
  }
}
.flowListDialoag {
  .el-collapse-item__header {
    height: 40px;
    line-height: 40px;
    background-color: #fafafa;
    font-size: 14px;
  }
  .collapse {
    border-left: 1px solid #eeeeee;
    border-right: 1px solid #eeeeee;
    .collapseTitle {
      padding: 0 15px;
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    .collapseContent {
      > div {
        padding: 0 15px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #eeeeee;
        > span {
          i {
            cursor: pointer;
          }
          &:first-child {
            display: inline-block;
            width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        // &:last-child{
        //   border-bottom:0;
        // }
      }
    }
  }
  .content {
    padding: 20px 0;
    .el-form-item {
      margin-bottom: 25px !important;
    }
  }
}
</style>
