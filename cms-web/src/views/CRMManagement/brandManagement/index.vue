
<template>
  <div class="brandManagement">
    <span class="page_head_title">品牌管理</span>
    <div class="pl-content">
      <ul class="default_tab_block">
        <li class="active"
            v-if="hasAuthority('050601')">
          <span>品牌信息</span>
        </li>
        <li @click="changeTab"
            v-if="hasAuthority('050602')">
          <span>品牌信息审核</span>
        </li>
      </ul>
      <div class="search-bar">
        <div>
          <el-select v-model="seachParam.projectManagementId"
                     clearable
                     placeholder="项目简称">
            <el-option v-for="item in options1"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-input placeholder="品牌名称"
                    v-model="seachParam.brandName"
                    style="width:200px"></el-input>
          <el-select v-model="seachParam.industry"
                     clearable
                     placeholder="选择行业">
            <el-option v-for="item in industryList"
                       :key="item"
                       :label="item"
                       :value="item">
            </el-option>
          </el-select>
          <el-select v-model="seachParam.recommend"
                     clearable
                     placeholder="首页推荐">
            <el-option label="是"
                       value="true"></el-option>
            <el-option label="否"
                       value="false"></el-option>
          </el-select>
          <el-select v-model="seachParam.reviewStatus"
                     clearable
                     placeholder="状态">
            <el-option v-for="item in statusList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
          <span class="query-btn"
                @click="queryRules">查询</span>
        </div>
        <div v-if="hasAuthority('05060101')">
          <el-button class="tban tban1"
                     @click="addBrandOpen"><i class="iconfont icon-crm_xinzeng-"></i> 新增品牌信息</el-button>
        </div>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  style="width: 100%"
                  ref="multipleTable">
          <el-table-column prop="code"
                           label="品牌编号"
                           align="center"></el-table-column>
          <el-table-column prop="projectManagementReferred"
                           label="项目简称"
                           align="center"></el-table-column>
          <el-table-column prop="floor"
                           label="楼层"
                           align="center"></el-table-column>
          <el-table-column prop="brandName"
                           label="品牌名称"
                           align="center"></el-table-column>
          <el-table-column prop="industry"
                           label="行业"
                           align="center"></el-table-column>
          <el-table-column prop="sortNumber"
                           label="排序"
                           align="center"></el-table-column>
          <el-table-column prop="recommend"
                           label="首页推荐"
                           align="center">
            <template slot-scope="scope">
              <span>{{scope.row.recommend?'是':'否'}}</span>
            </template>
          </el-table-column>
          <el-table-column :formatter="formatTime"
                           label="更新时间"
                           align="center"></el-table-column>
          <el-table-column :formatter="formatstatus"
                           label="状态"
                           align="center"></el-table-column>
          <el-table-column width="200px"
                           v-if="hasAuthority('05060102')"
                           label="操作"
                           align="left">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.$index, scope.row)"
                         v-if="hasAuthority('05060102')"
                         class="el-button--primary operation-btn"
                         size="mini">查看</el-button>
              <span class="onlineBtn"
                    @click="onlineFn(scope.$index, scope.row)"
                    v-if="(scope.row.reviewStatus==='REVIEWED'||scope.row.reviewStatus==='OFFLINE') && hasAuthority('05060103')">上线</span>
              <span class="offlineBtn"
                    @click="offlineFn(scope.$index, scope.row)"
                    v-if="scope.row.reviewStatus==='ONLINE' &&hasAuthority('05060103')">下线</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="ctc-foot1"
           v-if="total > 0">
        <span><span style="margin-right:10px">{{currentPage}}/{{totalPages}}页</span> 共{{total}}条记录</span>
        <el-pagination background
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
    <!-- 新增 -->
    <el-dialog title="新增品牌"
               :visible.sync="addBrandDialogVisible"
               class="addBrandDialog el_dialog_new "
               width="850px"
               @close="addBrandDialogClose"
               :close-on-click-modal="false">
      <div class="steps">
        <div :class="{'active':addSteps===1}">1. 基本信息</div>
        <div :class="{'active':addSteps===2}">2. 其他信息</div>
      </div>
      <div class="dialog_content">
        <el-form :model="addData"
                 :rules="addFlowRules"
                 ref="addData">
          <div class="content content1"
               v-show="addSteps===1">
            <el-form-item>
              <span>品牌编号<i class="required">*</i></span>
              <p v-if="readonly"></p>
              <el-input v-model="addData.number"
                        size="small"
                        disabled
                        v-else
                        placeholder="自动生成"></el-input>
            </el-form-item>
            <el-form-item prop="projectManagementId">
              <span>项目简称<i class="required">*</i></span>
              <p v-if="readonly">漕河泾项目</p>
              <el-select v-model="projectItem"
                         size="small"
                         style="width:100%"
                         @change="projectChange"
                         value-key="id"
                         placeholder="项目简称">
                <el-option v-for="item in options1"
                           :key="item.id"
                           :label="item.referred"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="tenantId">
              <span>客户名称<i class="required">*</i></span>
              <el-select v-model="teantItem"
                         size="small"
                         filterable
                         value-key="id"
                         @change="teantChange"
                         style="width:100%"
                         placeholder="输入搜索">
                <el-option v-for="item in brandList"
                           :key="item.id"
                           :label="item.teantName"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="industry">
              <span>行业<i class="required">*</i></span>
              <p v-if="readonly">餐饮</p>
              <el-input v-model="addData.industry"
                        size="small"
                        v-else></el-input>
            </el-form-item>
            <el-form-item prop="brandName">
              <span>品牌名称<i class="required">*</i></span>
              <p v-if="readonly">星巴克</p>
              <el-input v-model="addData.brandName"
                        size="small"
                        v-else></el-input>
            </el-form-item>
            <el-form-item prop="contactName">
              <span>客户联系人<i class="required">*</i></span>
              <p v-if="readonly">陈瑞堂</p>
              <el-input v-model="addData.contactName"
                        size="small"
                        v-else></el-input>
            </el-form-item>
            <el-form-item prop="contactPhone">
              <span>联系电话<i class="required">*</i></span>
              <p v-if="readonly">182XXX2563</p>
              <el-input v-model="addData.contactPhone"
                        size="small"
                        @input="addData.contactPhone=addData.contactPhone.replace(/[^0-9]/g,'')"
                        v-else></el-input>
            </el-form-item>
            <el-form-item prop="floor">
              <span>楼层<i class="required">*</i></span>
              <el-select v-model="floorItem"
                         style="width:194px"
                         value-key="id"
                         @change="floorChange"
                         size="small">
                <el-option v-for="item in floorList"
                           :key="item.id"
                           :label="item.floorName"
                           :value="item">
                </el-option>
              </el-select>
              <div class="el-input-group__append"
                   style="top: 30px;right: 0;text-align: center; display: inline-block; width: 54px; height: 32px; line-height: 32px;position: absolute;border: 1px solid #DCDFE6;">F</div>
            </el-form-item>
            <el-form-item prop="shopNo">
              <span>房源号<i class="required">*</i></span>
              <p v-if="readonly"></p>
              <el-input v-model="addData.shopNo"
                        size="small"
                        v-else></el-input>
            </el-form-item>
            <div style="width:30%;display: flex;flex-direction: column;padding-top: 3px;">
              <span style="margin-bottom: 10px;">营业时间<i class="required">*</i></span>
              <div class="el_time_select_group">
                <el-form-item prop="startTime">
                  <p v-if="readonly">102-3</p>
                  <el-time-select style="width:100%"
                                  size="small"
                                  :clearable="false"
                                  v-model="addData.startTime"
                                  :picker-options="{ start: '00:00', step: '00:15', end: '24:00'}">
                  </el-time-select>
                </el-form-item>
                <div class="separator">-</div>
                <el-form-item prop="endTime">
                  <el-time-select v-model="addData.endTime"
                                  prefix-icon=" "
                                  size="small"
                                  style="width:100%"
                                  @change="timeSelectChange"
                                  :picker-options="{ start: '00:00', step: '00:15', end: '24:00', minTime: addData.startTime}">
                  </el-time-select>
                </el-form-item>
              </div>
            </div>
            <el-form-item>
              <span>人均消费</span>
              <p v-if="readonly">102-3</p>
              <el-input v-model="addData.avgPrice"
                        size="small"
                        @input="addData.avgPrice=addData.avgPrice.replace(/[^\0-9\.]/g,'')"
                        v-else>
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <span>排序</span>
              <el-input v-model="addData.sortNumber"
                        size="small"
                        @input="addData.sortNumber=addData.sortNumber.replace(/[^0-9]/g,'')">
              </el-input>
            </el-form-item>
            <el-form-item>
              <span>首页推荐</span>
              <el-select v-model="addData.recommend"
                         size="small"
                         style="width:100%">
                <el-option label="是"
                           :value="true"></el-option>
                <el-option label="否"
                           :value="false"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="content content2"
               v-show="addSteps===2">
            <el-form-item prop="coverImg"
                          style="width:100%">
              <span>品牌LOGO<i class="required">*</i></span>
              <el-input v-model="addData.coverImg"
                        style="display:none"></el-input>
              <aliUpload class="aliUpload deviceDetails aliUpload_new"
                         style="width:140px;height:120px"
                         :upLoadText="upLoadText_cost"
                         :fileType="fileType_cost"
                         :fileSize="fileSize"
                         :iconShow="false"
                         :iconImg="iconImg"
                         :uploadIcon="true"
                         v-if="addData.coverImg===''||!addData.coverImg"
                         @setAnnex="setAnnex" />
              <div v-else
                   style="width:140px;height:120px"
                   class="imgBox imgBoxModel">
                <img :src="addData.coverImg"
                     @click="showImg(addData.coverImg)"
                     class="logoImg">
                <div @click="showImg(addData.coverImg)"
                     class="bottomTips">预览图片</div>
                <div class="iconfont icon-cms_cuowu deleteImg"
                     @click="deleLogo"></div>
              </div>
              <div class="tips">（最多可上传1张，尺寸建议为:344*240px，大小不超过3M；支持格式JPG，PNG)</div>
            </el-form-item>
            <el-form-item prop="imgUrls"
                          style="width:100%">
              <span>品牌图片<i class="required">*</i></span>
              <el-checkbox-group v-model="addData.imgUrls"
                                 style="display:none"></el-checkbox-group>
              <div style="display: flex;">
                <div v-for="(item,index) in addData.imgUrls"
                     :key="index"
                     v-if="addData.imgUrls.length>0"
                     style="width:140px;height:120px;margin-right: 10px;"
                     class="imgBox imgBoxModel">
                  <img :src="item"
                       @click="showImg1(item,index)"
                       class="logoImg">
                  <div @click="showImg1(item,index)"
                       class="bottomTips">预览图片</div>
                  <div class="iconfont icon-cms_cuowu deleteImg"
                       @click="deleteImg(index)"></div>
                </div>
                <aliUpload class="aliUpload deviceDetails aliUpload_new"
                           style="width:140px;height:120px"
                           :upLoadText="upLoadText_cost"
                           :fileType="fileType_cost"
                           :fileSize="fileSize"
                           :iconShow="false"
                           :iconImg="iconImg"
                           :uploadIcon="true"
                           v-if="addData.imgUrls.length<5"
                           @setAnnex="setAnnex1" />
              </div>
              <div class="tips">（最多可上传5张，尺寸建议为:750*520px，大小不超过3M；支持格式JPG，PNG)</div>
            </el-form-item>
            <el-form-item prop="description"
                          style="width:100%">
              <span>品牌介绍<i class="required">*</i></span>
              <div style="width:100%;word-wrap: break-word;word-break: normal;"
                   v-if="readonly"
                   v-html="formatreplace(addData.description)"></div>
              <el-input v-else
                        type="textarea"
                        resize='none'
                        maxlength="500"
                        :rows='5'
                        placeholder="请输入内容(500字以内）"
                        v-model="addData.description">
              </el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer"
           class="slotfooter">
        <span @click="addBrandDialogClose"
              class="details_cannelBtn"
              v-if="addSteps===1">取消</span>
        <span class="details_submitBtn"
              v-if="addSteps===1"
              @click="nextStep">下一步</span>
        <span @click="peveStep"
              class="details_cannelBtn"
              v-if="addSteps===2">上一步</span>
        <span class="save"
              @click="addBrand(false)"
              v-if="addSteps===2">暂存</span>
        <span class="details_submitBtn"
              v-if="addSteps===2"
              @click="addBrand(true)">保存并提交</span>
      </div>
    </el-dialog>
    <!-- 品牌详情 -->
    <brandsDetails :detailsdrawershow="detailsShow"
                   ref="brandsDetails"
                   :draweDetaileData="detaileData"
                   @changeSuccess="queryRules"
                   @drawerClose="drawerClose" />
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
  </div>
</template>
<script>
import context from '@/service'
import brandsDetails from './components/brandsDetails'
import aliUpload from '@/components/aliUpload.vue'
import picturePrevie from '@/components/picturePrevie.vue'
export default {
  name: 'brandManagement',
  components: {
    aliUpload,
    picturePrevie,
    brandsDetails
  },
  data () {
    var cheackCoverImg = (rule, value, callback) => {
      if (!value || value === '') {
        return callback(new Error('请上传品牌LOGO'))
      } else {
        callback()
      }
    }
    var cheackImgUrls = (rule, value, callback) => {
      if (!value || value.length === 0) {
        return callback(new Error('请上传品牌图片'))
      } else {
        callback()
      }
    }
    return {
      floorItem: {},
      startEndTime: [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 23, 59)],
      showPicture: false,
      imgArr: [],
      num: 0,
      seachParam: {
        projectManagementId: '',
        brandName: '',
        industry: '',
        recommend: '',
        reviewStatus: ''
      },
      projectItem: {},
      teantItem: {},
      addData: {
        projectManagementId: '',
        projectManagementReferred: '',
        tenantId: '',
        brandName: '',
        tenantName: '',
        industry: '',
        referred: '',
        contactName: '',
        contactPhone: '',
        floor: '',
        floorId: '',
        shopNo: '',
        startTime: null,
        endTime: null,
        coverImg: '',
        imgUrls: [],
        description: '',
        sortNumber: '',
        recommend: false
      },
      addFlowRules: {
        projectManagementId: [
          { required: true, message: '请选择项目简称', trigger: 'change' }
        ],
        tenantId: [
          { required: true, message: '请选择客户名称', trigger: 'change' }
        ],
        industry: [
          { required: true, message: '请输入行业', trigger: 'change' }
        ],
        brandName: [
          { required: true, message: '请输入品牌名称', trigger: 'change' }
        ],
        contactName: [
          { required: true, message: '请输入客户联系人', trigger: 'change' }
        ],
        contactPhone: [
          { required: true, message: '请输入联系电话', trigger: 'change' }
        ],
        floor: [
          { required: true, message: '请选择楼层', trigger: 'change' }
        ],
        shopNo: [
          { required: true, message: '请输入房源号', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        coverImg: [
          { validator: cheackCoverImg, trigger: 'change' }
        ],
        imgUrls: [
          { validator: cheackImgUrls, trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入品牌介绍', trigger: 'change' }
        ]
      },
      detailsShow: false,
      detaileData: {
        imgUrls: []
      },
      iconImg: 'icon-shangchuantupianicon',
      upLoadText_cost: '上传图片',
      fileType_cost: ['png', 'jpg'],
      fileSize: 3,
      brandList: [],
      readonly: false,
      addSteps: 1,
      addBrandDialogVisible: false,
      statusList: [
        { id: 'PENDING', name: '暂存' },
        { id: 'REVIEWING', name: '待审核' },
        { id: 'REVIEWED', name: '已审核' },
        { id: 'ONLINE', name: '上线' },
        { id: 'OFFLINE', name: '下线' }
      ],
      industryList: [],
      options1: [],
      tableData: [],
      floorList: [],
      currentPage: 1,
      totalPages: 1,
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

    }
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
    // this.industryList = this.$store.state.industryList
    this.query()
    this.getindustryList() // 请求行业
  },
  watch: {
    addBrandDialogVisible: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.projectItem = this.options1[0]
          this.addData.projectManagementId = this.projectItem.id
          this.addData.projectManagementReferred = this.projectItem.referred
          this.getTenantlist(this.addData.projectManagementId)
          this.getFloorList(this.addData.projectManagementId)
        }
      }
    }
  },
  mounted () {

  },
  methods: {
    floorChange (obj) {
      this.addData.floor = obj.floorName
      this.addData.floorId = obj.id
    },
    projectChange (projectItem) {
      // console.log(projectItem)
      this.addData.projectManagementId = projectItem.id
      this.addData.projectManagementReferred = projectItem.referred
      this.addData.tenantId = ''
      this.addData.industry = ''
      this.addData.brandName = ''
      this.addData.contactName = ''
      this.addData.contactPhone = ''
      this.getTenantlist(this.addData.projectManagementId)
      this.getFloorList(this.addData.projectManagementId)
    },
    teantChange (teantItem) { // 选中客户 自动填充信息
      let _this = this
      this.addData.tenantId = teantItem.id
      this.addData.tenantName = teantItem.teantName
      this.brandList.forEach(function (item, index, arr) {
        if (item.id === teantItem.id) {
          _this.addData.industry = item.industry
          _this.addData.contactName = item.contact
          _this.addData.brandName = item.referred
          _this.addData.contactPhone = item.telephone
        }
      })
    },
    async getFloorList (projectManagementId) { // 获取楼层列表
      let result = await context.http.get(`crm/api/floor/list/${projectManagementId}`)
      this.floorList = result.data
      console.log(this.floorList)
    },
    timeSelectChange () {
      if (!this.addData.endTime) {
        this.addData.startTime = null
      }
    },
    startEndTimeChange (timeArr) {
      if (timeArr) {
        this.addData.startTime = timeArr[0]
        this.addData.endTime = timeArr[1]
      } else {
        this.addData.startTime = ''
        this.addData.endTime = ''
      }
    },
    offlineFn (index, row) {
      context.http.get(`crm/api/review/cancel`, {
        businessId: row.id,
        businessType: 'BRAND',
        reviewType: 'BRAND',
        reviewStatus: row.reviewStatus
      }).then(res => {
        if (res) {
          this.$message.success('下线成功')
          this.queryRules()
        }
      })
    },
    onlineFn (index, row) {
      context.http.get(`crm/api/review/approval`, {
        businessId: row.id,
        businessType: 'BRAND',
        reviewType: 'BRAND',
        reviewStatus: row.reviewStatus
      }).then(res => {
        if (res) {
          this.$message.success('上线成功')
          this.queryRules()
        }
      })
    },
    pictureClose () {
      this.showPicture = false
    },
    showImg (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
      console.log(this.imgArr)
    },
    showImg1 (item, index) {
      let imgArr = []
      this.addData.imgUrls.forEach(item => {
        imgArr.push(item)
      })
      this.imgArr = imgArr
      this.num = index
      this.showPicture = true
    },
    formatstatus (row, column) {
      switch (row.reviewStatus) {
        case 'PENDING':
          return '暂存'
        case 'REVIEWING':
          return '待审核'
        case 'REVIEWED':
          return '已审核'
        case 'ONLINE':
          return '上线'
        case 'OFFLINE':
          return '下线'
      }
    },
    getindustryList () {
      context.http.get(`crm/api/brand/industry`).then(res => {
        if (res) {
          this.industryList = []
          this.industryList = res.data
          // this.industryList.unshift('全部')
          // console.log(res)
        }
      })
    },
    addBrand (status) {
      console.log(this.addData)
      this.$refs['addData'].validate((valid) => {
        if (valid) {
          this.addData.approval = status
          context.http.post(`crm/api/brand`, this.addData).then(res => {
            if (res) {
              this.$message.success('新增成功')
              this.addBrandDialogClose()
              this.getindustryList()
              this.queryRules()
            }
          })
        } else {
          if (
            this.addData.projectManagementId === '' || !this.addData.projectManagementId ||
            this.addData.tenantId === '' || !this.addData.tenantId ||
            this.addData.industry === '' || !this.addData.industry ||
            this.addData.brandName === '' || !this.addData.brandName ||
            this.addData.contactName === '' || !this.addData.contactName ||
            this.addData.contactPhone === '' || !this.addData.contactPhone ||
            this.addData.floor === '' || !this.addData.floor ||
            this.addData.floorId === '' || !this.addData.floorId ||
            this.addData.shopNo === '' || !this.addData.shopNo ||
            this.addData.startTime === '' || !this.addData.startTime ||
            this.addData.endTime === '' || !this.addData.endTime
          ) {
            this.addSteps = 1
          } else if (
            this.addData.coverImg === '' || !this.addData.coverImg ||
            this.addData.imgUrls.length === 0 || !this.addData.imgUrls ||
            this.addData.description === '' || !this.addData.description
          ) {
            this.addSteps = 2
          }
          console.log('error submit!!')
          return false
        }
      })
    },
    deleLogo () {
      this.addData.coverImg = ''
    },
    formatTime (row, column) {
      if (row.updateTime) {
        return row.updateTime.replace('T', '  ')
      } else {
        return '-'
      }
    },
    drawerClose () {
      this.detailsShow = false
    },
    formatreplace (description) {
      if (!description) {
        return
      }
      let html = description.replace(/\n/g, '<br/>')
      return html
    },
    deleteImg (index) {
      this.addData.imgUrls.splice(index, 1)
    },
    setAnnex (annexURL, annexName) {
      this.$set(this.addData, 'coverImg', annexURL)
    },
    setAnnex1 (annexURL, annexName) {
      this.addData.imgUrls.push(annexURL)
    },
    peveStep () {
      this.addSteps = 1
    },
    nextStep () {
      this.addSteps = 2
    },
    getTenantlist (projectId) {
      context.http.get(`cms/api/tenant/projectManagement/${projectId}`).then(res => {
        if (res) {
          this.brandList = res.data
        }
      })
    },
    addBrandDialogClose () {
      this.addData = {
        projectManagementId: '',
        projectManagementReferred: '',
        tenantId: '',
        brandName: '',
        tenantName: '',
        industry: '',
        referred: '',
        contactName: '',
        contactPhone: '',
        floor: '',
        floorId: '',
        shopNo: '',
        startTime: '',
        endTime: '',
        coverImg: '',
        imgUrls: [],
        description: ''
      }
      this.projectItem = {}
      this.teantItem = {}
      this.floorItem = {}
      this.$refs['addData'].resetFields()
      this.addBrandDialogVisible = false
      this.addSteps = 1
    },
    handleEdit (index, row) {
      context.http.get(`crm/api/brand/${row.id}`).then(res => {
        if (res) {
          this.detaileData = res.data
          this.detailsShow = true
        }
      })
    },
    addBrandOpen () {
      this.addBrandDialogVisible = true
    },
    changeTab () {
      this.$router.push({
        name: 'brandAudit',
        params: {}
      })
    },
    queryRules () {
      this.currentPage = 1
      this.pgSize = 15
      this.query()
    },
    async query () {
      let result = await context.http.get('crm/api/brand', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'lastModifiedDate,desc',
        projectManagementId: this.seachParam.projectManagementId,
        brandName: this.seachParam.brandName,
        industry: this.seachParam.industry,
        recommend: this.seachParam.recommend,
        reviewStatus: this.seachParam.reviewStatus
        // reviewStatus: 'REVIEWING'
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      this.totalPages = Math.ceil(this.total / this.pgSize)
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    }
  }
}
</script>
<style lang="scss">
.brandManagement,
.brandAudit {
  .deviceDetails {
    width: 140px;
    height: 120px;
    margin-right: 0px !important;
    .oss_file {
      width: 100%;
      height: 100%;
      border: none;
      background-color: #eaeaea;
      border: 1px solid rgba(234, 234, 234, 1);
      border-radius: 4px;
      color: #3575f6;
      > i {
        font-size: 32px;
        position: absolute;
        top: 8px;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
      }
      > span {
        position: absolute;
        top: 40px;
        left: 0px;
      }
    }
  }
  .el-dialog__wrapper {
    &.addBrandDialog {
      .el-dialog {
        .el-dialog__header {
          margin-bottom: 0px;
        }
        .el-dialog__body {
          background-color: #faf7fa;
          .steps {
            height: 60px;
            padding: 0 15px;
            border-top: 1px solid #f6f6f6;
            background-color: #ffffff;
            margin-bottom: 15px;
          }
          .dialog_content {
            background-color: #ffffff;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.brandManagement {
  .addBrandDialog {
    .slotfooter {
      .save {
        margin-right: 12px;
        height: 32px;
        line-height: 32px;
        color: #3577f6;
        border: 1px solid #3577f6;
        background: rgba(53, 119, 246, 0.05);
      }
    }
    //新增
    .steps {
      display: flex;
      align-items: center;
      justify-content: space-between;
      > div {
        width: 400px;
        height: 35px;
        line-height: 35px;
        background: rgba(249, 249, 249, 1);
        border-radius: 6px;
        padding-left: 10px;
        color: #777;
        font-size: 14px;
        cursor: pointer;
        &.active {
          background-color: #3175d2;
          color: #ffffff;
        }
      }
    }
    .el-form {
      margin-top: 15px;
      .content {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .el-form-item {
          width: 30%;
          .el-form-item__content {
            > span {
              margin-bottom: 5px;
              display: inline-block;
              height: 25px;
              display: -ms-flexbox;
              display: flex;
              -ms-flex-align: center;
              align-items: center;
              font-size: 14px;
              color: #777777;
            }
            > p {
              color: #666666;
              font-size: 12px;
              height: 40px;
              line-height: 40px;
            }
            .tips {
              font-size: 12px;
              color: #999999;
              margin-top: 10px;
            }
            // .imgBox {
            //   width: 140px;
            //   height: 120px;
            //   position: relative;
            //   background: rgba(255, 255, 255, 1);
            //   border: 1px solid rgba(234, 234, 234, 1);
            //   border-radius: 4px;
            //   > .bottomTips {
            //     height: 25px;
            //     position: absolute;
            //     left: 0px;
            //     bottom: 0px;
            //     width: 140px;
            //     background-color: #fdffff;
            //     display: flex;
            //     align-items: center;
            //     font-size: 12px;
            //     justify-content: space-between;
            //     padding: 0 5px;
            //     > span {
            //       display: inline-block;
            //       width: 60%;
            //       overflow: hidden;
            //       text-overflow: ellipsis;
            //       white-space: nowrap;
            //       padding: 0 5px;
            //     }
            //     > i {
            //       cursor: pointer;
            //     }
            //   }
            // }
          }
        }
      }
    }
  }
  .plc-table {
    .onlineBtn {
      display: inline-block;
      width: 56px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border: 1px solid rgba(68, 175, 105, 1);
      border-radius: 3px;
      color: #44af69;
      cursor: pointer;
    }
    .offlineBtn {
      display: inline-block;
      width: 56px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border: 1px solid #f3af2c;
      border-radius: 3px;
      color: #f3af2c;
      cursor: pointer;
    }
  }
  .plc-search {
    min-height: 70px;
    line-height: 0;
    background-color: #fff;
    margin: 20px 0;
    padding-left: 18px;
    padding-right: 18px;
    box-shadow: 1px 2px 5px #eee;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -ms-flex-pack: justify;
    justify-content: space-between;
    align-items: center;
    position: relative;
    > div {
      > div {
        margin-right: 15px;
      }
    }
  }
  .typeTab {
    height: 60px;
    line-height: 60px;
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
</style>
