<template>
  <!-- :showEditBtn="showEditBtn" -->
  <div class="brandsDetails">
    <drawer class="drawer_new"
            :show="detailsdrawershow"
            :title="drawerTitle"
            :showEditBtn="draweDetaileData.reviewStatus==='PENDING'&& readonly && hasAuthority('05060103')"
            @on-edit="onEdit"
            @on-hide="onHide">
      <div class="details_content drawer-body"
           slot="drawer">
        <div class="tab">
          <span :class="{'active':tab===1}"
                @click="tabChange(1)">基本信息</span>
          <span :class="{'active':tab===2}"
                @click="tabChange(2)">其他信息</span>
          <span :class="{'active':tab===3}"
                @click="tabChange(3)">操作记录</span>
        </div>
        <div class="main_content">
          <el-form :model="draweDetaileData"
                   :rules="addFlowRules"
                   ref="draweDetaileData">
            <div class="mainContent">
              <div class="content content1"
                   v-show="tab===1">
                <el-form-item>
                  <span>品牌编号<i class="required">*</i></span>
                  <p v-if="readonly">{{draweDetaileData.code}}</p>
                  <el-input v-model="draweDetaileData.code"
                            disabled
                            size="small"
                            v-else
                            placeholder="自动生成"></el-input>
                </el-form-item>
                <el-form-item prop="projectManagementId">
                  <span>项目简称<i class="required">*</i></span>
                  <p v-if="readonly">{{draweDetaileData.projectManagementReferred}}</p>
                  <el-select v-model="projectItem"
                             disabled
                             @change="projectChange"
                             value-key="id"
                             v-else
                             size="small"
                             style="width:100%"
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
                  <p v-if="readonly">{{draweDetaileData.tenantName}}</p>
                  <el-select v-model="teantItem"
                             disabled
                             size="small"
                             value-key="id"
                             @change="teantChange"
                             filterable
                             v-else
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
                  <p v-if="readonly">{{draweDetaileData.industry}}</p>
                  <el-input v-model="draweDetaileData.industry"
                            size="small"
                            v-else></el-input>
                </el-form-item>
                <el-form-item prop="brandName">
                  <span>品牌名称<i class="required">*</i></span>
                  <p v-if="readonly">{{draweDetaileData.brandName}}</p>
                  <el-input v-model="draweDetaileData.brandName"
                            size="small"
                            v-else></el-input>
                </el-form-item>
                <el-form-item prop="contactName">
                  <span>客户联系人<i class="required">*</i></span>
                  <p v-if="readonly">{{draweDetaileData.contactName}}</p>
                  <el-input v-model="draweDetaileData.contactName"
                            size="small"
                            v-else></el-input>
                </el-form-item>
                <el-form-item prop="contactPhone">
                  <span>联系电话<i class="required">*</i></span>
                  <p v-if="readonly">{{draweDetaileData.contactPhone}}</p>
                  <el-input v-model="draweDetaileData.contactPhone"
                            @input="draweDetaileData.contactPhone=draweDetaileData.contactPhone.replace(/[^0-9]/g,'')"
                            size="small"
                            v-else></el-input>
                </el-form-item>
                <el-form-item prop="floor">
                  <span>楼层<i class="required">*</i></span>
                  <p v-if="readonly">{{draweDetaileData.floor}}</p>
                  <el-select v-model="floorItem"
                             style="width:192px"
                             value-key="id"
                             v-else
                             @change="floorChange"
                             size="small">
                    <el-option v-for="item in floorList"
                               :key="item.id"
                               :label="item.floorName"
                               :value="item">
                    </el-option>
                  </el-select>
                  <div class="el-input-group__append"
                       v-if="!readonly"
                       style="top: 30px;right: 0;text-align: center; display: inline-block; width: 54px; height: 32px; line-height: 32px;position: absolute;border: 1px solid #DCDFE6;">F</div>
                </el-form-item>
                <el-form-item prop="shopNo">
                  <span>房源号<i class="required">*</i></span>
                  <p v-if="readonly">{{draweDetaileData.shopNo}}</p>
                  <el-input v-model="draweDetaileData.shopNo"
                            size="small"
                            v-else></el-input>
                </el-form-item>
                <div style="width:30%;display: flex;flex-direction: column;padding-top: 3px;">
                  <span style="margin-bottom: 10px;">营业时间<i class="required">*</i></span>
                  <div class="el_time_select_group"
                       :class="{'edit':readonly}">
                    <el-form-item prop="startTime">
                      <p v-if="readonly">{{draweDetaileData.startTime}} - {{draweDetaileData.endTime}}</p>
                      <el-time-select style="width:100%"
                                      size="small"
                                      v-if="!readonly"
                                      :clearable="false"
                                      v-model="draweDetaileData.startTime"
                                      :picker-options="{ start: '00:00', step: '00:15', end: '24:00'}">
                      </el-time-select>
                    </el-form-item>
                    <div class="separator"
                         v-if="!readonly">-</div>
                    <el-form-item prop="endTime">
                      <el-time-select v-model="draweDetaileData.endTime"
                                      v-if="!readonly"
                                      prefix-icon=" "
                                      size="small"
                                      style="width:100%"
                                      @change="timeSelectChange"
                                      :picker-options="{ start: '00:00', step: '00:15', end: '24:00', minTime: draweDetaileData.startTime}">
                      </el-time-select>
                    </el-form-item>
                  </div>
                </div>
                <el-form-item prop="avgPrice">
                  <span>人均消费</span>
                  <p v-if="readonly">{{draweDetaileData.avgPrice}}</p>
                  <div v-else>
                    <el-input v-model="draweDetaileData.avgPrice"
                              size="small">
                      <template slot="append">元</template>
                    </el-input>
                  </div>
                </el-form-item>
                <el-form-item>
                  <span>排序</span>
                  <p v-if="readonly">{{draweDetaileData.sortNumber}}</p>
                  <div v-else>
                    <el-input v-model="draweDetaileData.sortNumber"
                              size="small"
                              @input="draweDetaileData.sortNumber=draweDetaileData.sortNumber.replace(/[^0-9]/g,'')"
                              placeholder="请输入内容"></el-input>
                  </div>
                </el-form-item>
                <el-form-item>
                  <span>首页推荐</span>
                  <p v-if="readonly">{{draweDetaileData.recommend?'是':'否'}}</p>
                  <el-select v-model="draweDetaileData.recommend"
                             style="width:100%"
                             v-else
                             size="small">
                    <el-option label="是"
                               :value="true"></el-option>
                    <el-option label="否"
                               :value="false"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="content content2"
                   v-show="tab===2">
                <el-form-item prop="coverImg"
                              style="width:100%">
                  <span>品牌LOGO<i class="required">*</i></span>
                  <el-input v-model="draweDetaileData.coverImg"
                            style="display:none"></el-input>
                  <aliUpload class="aliUpload deviceDetails aliUpload_new"
                             :upLoadText="upLoadText_cost"
                             :fileType="fileType_cost"
                             :iconShow="false"
                             :fileSize="fileSize"
                             :iconImg="iconImg"
                             :uploadIcon="true"
                             v-if="draweDetaileData.coverImg===''||!draweDetaileData.coverImg"
                             @setAnnex="setAnnex" />
                  <div v-else
                       class="imgBox imgBoxModel"
                       style="width: 140px; height: 120px;">
                    <img :src="draweDetaileData.coverImg"
                         @click="showImg(draweDetaileData.coverImg)"
                         class="logoImg">
                    <div @click="showImg(draweDetaileData.coverImg)"
                         class="bottomTips">预览图片</div>
                    <div v-if="!readonly"
                         class="iconfont icon-cms_cuowu deleteImg"
                         @click="deleLogo"></div>
                  </div>
                  <div class="tips"
                       v-if="!readonly">（最多可上传1张，尺寸建议为:344*240px，大小不超过3M；支持格式JPG，PNG)</div>
                </el-form-item>
                <el-form-item prop="imgUrls"
                              style="width:100%">
                  <span>品牌图片<i class="required">*</i></span>
                  <el-checkbox-group v-model="draweDetaileData.imgUrls"
                                     style="display:none"></el-checkbox-group>
                  <div style="display: flex;">
                    <div v-for="(item,index) in draweDetaileData.imgUrls"
                         :key="index"
                         v-if="draweDetaileData.imgUrls.length>0"
                         style="width: 140px; height: 120px;"
                         class="imgBox imgBoxModel">
                      <img :src="item"
                           @click="showImg1(item,index)"
                           class="logoImg">
                      <div @click="showImg1(item,index)"
                           class="bottomTips">预览图片</div>
                      <div v-if="!readonly"
                           class="iconfont icon-cms_cuowu deleteImg"
                           @click="deleteImg(index)"></div>
                    </div>
                    <aliUpload class="aliUpload deviceDetails aliUpload_new"
                               :upLoadText="upLoadText_cost"
                               :fileType="fileType_cost"
                               :iconShow="false"
                               :fileSize="fileSize"
                               :iconImg="iconImg"
                               :uploadIcon="true"
                               v-if="draweDetaileData.imgUrls.length<5 && !readonly"
                               @setAnnex="setAnnex1" />
                  </div>
                  <div class="tips"
                       v-if="!readonly">（最多可上传5张，尺寸建议为:750*520px，大小不超过3M；支持格式JPG，PNG)</div>
                </el-form-item>
                <el-form-item prop="description"
                              style="width:100%">
                  <span>品牌介绍<i class="required">*</i></span>
                  <div style="width:100%;word-wrap: break-word;word-break: normal;font-size: 12px;color: #777;"
                       v-if="readonly"
                       v-html="formatreplace(draweDetaileData.description)"></div>
                  <el-input v-else
                            type="textarea"
                            resize='none'
                            maxlength="500"
                            :rows='8'
                            placeholder="请输入内容(500字以内）"
                            v-model="draweDetaileData.description">
                  </el-input>
                </el-form-item>
              </div>
              <div class="content content3"
                   v-if="tab===3">
                <div class="timelineBox">
                  <el-timeline class="timeline">
                    <el-timeline-item placement="top"
                                      style="position:relative;min-height: 80px;"
                                      v-for="(item, index) in recordsList"
                                      :key="index"
                                      size="normal"
                                      :color="nodeColor(index)">
                      <!-- :timestamp="item.recordTime.replace('T','  ')" -->
                      <div class="statusBox">
                        <div :class="{'shangxian':item.reviewStep==='PUBLISH','xiaxian':item.reviewStep==='OFF_SHELVES','shenhe':item.reviewStep==='REVIEW','tjsh':item.reviewStep==='PRODUCE'}">{{item.reviewStepD}}</div>
                        <div :class="{'first':index===0}">{{formatApprovalDate(item.recordTime)}}</div>
                      </div>
                      <div class="template">
                        <p v-if="item.reviewUserName"><span>操作人 : </span><span>{{item.reviewUserName}}</span></p>
                        <!-- <span v-if="item.reviewStepD"><span>操作类型 : </span><span>{{item.reviewStepD}}</span></p> -->
                        <p v-if="item.reviewResultD"><span>审核结果 : </span><span>{{item.reviewResultD}}</span></p>
                        <p v-if="item.remark"><span>审核备注 : </span><span>{{item.remark}}</span></p>
                      </div>
                    </el-timeline-item>
                  </el-timeline>
                </div>
                <el-form-item prop="number"
                              v-if="isAudit"
                              style="width:100%">
                  <span>审核备注<i class="required">*</i></span>
                  <!-- <div style="width:100%;word-wrap: break-word;word-break: normal;"
                     v-if="readonly"
                     v-html="formatreplace(addData.number)"></div> -->
                  <el-input type="textarea"
                            resize='none'
                            maxlength="50"
                            :rows='5'
                            placeholder="请输入内容"
                            v-model="remark">
                  </el-input>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <span @click="onHide"
              class="details_cannelBtn"
              style="background:none">关闭</span>
        <span class="peveBtn"
              v-if="tab!==1"
              @click="peveBtn">上一步</span>
        <span class="nextBtn"
              v-if="tab!==3"
              @click="nextBtn">下一步</span>
        <span class="saveBtn"
              v-if="draweDetaileData.reviewStatus==='PENDING' && !readonly"
              @click="addBrand(false)">暂存</span>
        <span class="saveSubmit"
              v-if="draweDetaileData.reviewStatus==='PENDING' && !readonly"
              @click="addBrand(true)">保存并提交</span>
        <span class="saveSubmit"
              @click="submit"
              v-if="draweDetaileData.reviewStatus==='PENDING' &&  readonly">提交审核</span>
        <span class="rejectBtn"
              @click="reject"
              v-if="isAudit && tab===3">驳回</span>
        <span class="passBtn"
              @click="pass"
              v-if="isAudit && tab===3">通过</span>
      </div>
    </drawer>
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
  </div>
</template>

<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import aliUpload from '@/components/aliUpload.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import axios from 'axios'
import * as JSOG from 'jsog'
export default {
  name: 'potClienDtl',
  components: {
    Drawer,
    picturePrevie,
    aliUpload
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    isAudit: { // 品牌信息审核页面
      type: Boolean,
      default: false
    },
    draweDetaileData: {
      type: Object,
      default: function () {
        return {
          projectManagementDTO: {
            projectName: ''
          }
        }
      }
    }
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
  },
  watch: {
    detailsdrawershow: {
      handler (newValue, oldValue) {
        if (newValue) {
          this.getTenantlist(this.draweDetaileData.projectManagementId)
          this.getrecords()
          this.getFloorList(this.draweDetaileData.projectManagementId)
          // if (this.isAudit) {
          //   this.getrecords()
          // }
        }
      },
      deep: true,
      immediate: true
    }
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
      fileSize: 3,
      remark: '',
      recordsList: [],
      showPicture: false,
      imgArr: [],
      num: 0,
      iconImg: 'icon-shangchuantupianicon',
      upLoadText_cost: '上传图片',
      fileType_cost: ['png', 'jpg'],
      projectItem: {},
      teantItem: {},
      brandList: [],
      options1: [],
      floorList: [],
      startTime: '',
      endTime: '',
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
      readonly: true,
      tab: 1,
      showEditBtn: true,
      drawerTitle: '品牌信息'
    }
  },
  mounted () {

  },
  methods: {
    async getFloorList (projectManagementId) { // 获取楼层列表
      let result = await context.http.get(`crm/api/floor/list/${projectManagementId}`)
      this.floorList = result.data
      console.log(this.floorList)
    },
    floorChange (obj) {
      this.draweDetaileData.floor = obj.floorName
      this.draweDetaileData.floorId = obj.id
    },
    timeSelectChange () {
      if (!this.draweDetaileData.endTime) {
        this.draweDetaileData.startTime = null
      }
    },
    formatApprovalDate (time) {
      if (time) {
        time = time.substr(0, time.lastIndexOf('T'))
        return time
      }
    },
    submit () { // 提交审核
      context.http.get(`crm/api/review/approval`, {
        businessId: this.draweDetaileData.id,
        businessType: 'BRAND',
        reviewType: 'BRAND',
        reviewStatus: this.draweDetaileData.reviewStatus
      }).then(res => {
        if (res) {
          this.$message.success('操作成功')
          this.$emit('changeSuccess')
          this.onHide()
        }
      })
    },
    reject () { // 驳回
      if (this.remark === '' || !this.remark) {
        this.$message.error('请填写审核备注')
        return
      }
      context.http.get(`crm/api/review/disapproval`, {
        businessId: this.draweDetaileData.id,
        businessType: 'BRAND',
        reviewType: 'BRAND',
        remark: this.remark,
        reviewStatus: this.draweDetaileData.reviewStatus
      }).then(res => {
        if (res) {
          this.$message.success('操作成功')
          this.$emit('auditSuccess')
          this.onHide()
        }
      })
    },
    pass () { // 通过
      if (this.remark === '' || !this.remark) {
        this.$message.error('请填写审核备注')
        return
      }
      context.http.get(`crm/api/review/approval`, {
        businessId: this.draweDetaileData.id,
        businessType: 'BRAND',
        reviewType: 'BRAND',
        remark: this.remark,
        reviewStatus: this.draweDetaileData.reviewStatus
      }).then(res => {
        if (res) {
          this.$message.success('操作成功')
          this.$emit('auditSuccess')
          this.onHide()
        }
      })
    },
    getrecords () {
      context.http.get(`crm/api/review/records`, { businessId: this.draweDetaileData.id, businessType: 'BRAND' }).then(res => {
        if (res) {
          this.recordsList = res.data
        }
      })
    },
    addBrand (status) {
      this.$refs['draweDetaileData'].validate((valid) => {
        if (valid) {
          this.draweDetaileData.approval = status
          context.http.post(`crm/api/brand`, this.draweDetaileData).then(res => {
            if (res) {
              this.$message.success('操作成功')
              this.$emit('changeSuccess')
              if (status) {
                this.onHide()
              } else {
                this.readonly = true
              }
            }
          })
        } else {
          if (
            this.draweDetaileData.projectManagementId === '' || !this.draweDetaileData.projectManagementId ||
            this.draweDetaileData.tenantId === '' || !this.draweDetaileData.tenantId ||
            this.draweDetaileData.industry === '' || !this.draweDetaileData.industry ||
            this.draweDetaileData.brandName === '' || !this.draweDetaileData.brandName ||
            this.draweDetaileData.contactName === '' || !this.draweDetaileData.contactName ||
            this.draweDetaileData.contactPhone === '' || !this.draweDetaileData.contactPhone ||
            this.draweDetaileData.floor === '' || !this.draweDetaileData.floor ||
            this.draweDetaileData.floorId === '' || !this.draweDetaileData.floorId ||
            this.draweDetaileData.shopNo === '' || !this.draweDetaileData.shopNo ||
            this.draweDetaileData.startTime === '' || !this.draweDetaileData.startTime ||
            this.draweDetaileData.endTime === '' || !this.draweDetaileData.endTime
          ) {
            this.tab = 1
          } else if (
            this.draweDetaileData.coverImg === '' || !this.draweDetaileData.coverImg ||
            this.draweDetaileData.imgUrls.length === 0 || !this.draweDetaileData.imgUrls ||
            this.draweDetaileData.description === '' || !this.draweDetaileData.description
          ) {
            this.tab = 2
          }
          console.log('error submit!!')
          return false
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
      this.draweDetaileData.imgUrls.forEach(item => {
        imgArr.push(item)
      })
      this.imgArr = imgArr
      this.num = index
      this.showPicture = true
    },
    getTenantlist (projectId) {
      context.http.get(`cms/api/tenant/projectManagement/${projectId}`).then(res => {
        if (res) {
          this.brandList = res.data
        }
      })
    },
    projectChange (projectItem) {
      console.log(projectItem)
      this.draweDetaileData.projectManagementId = projectItem.id
      this.draweDetaileData.projectManagementReferred = projectItem.referred
      this.draweDetaileData.tenantId = ''
      this.draweDetaileData.industry = ''
      this.draweDetaileData.brandName = ''
      this.draweDetaileData.contactName = ''
      this.draweDetaileData.contactPhone = ''
      this.getTenantlist(this.draweDetaileData.projectManagementId)
      this.getFloorList(this.draweDetaileData.projectManagementId)
    },
    teantChange (teantItem) { // 选中客户 自动填充信息
      let _this = this
      this.draweDetaileData.tenantId = teantItem.id
      this.draweDetaileData.tenantName = teantItem.teantName
      this.brandList.forEach(function (item, index, arr) {
        if (item.id === teantItem.id) {
          _this.draweDetaileData.industry = item.industry
          _this.draweDetaileData.brandName = item.referred
          _this.draweDetaileData.contactName = item.contact
          _this.draweDetaileData.contactPhone = item.telephone
        }
      })
    },
    deleLogo () {
      this.draweDetaileData.coverImg = ''
    },
    deleteImg (index) {
      this.draweDetaileData.imgUrls.splice(index, 1)
    },
    peveBtn () {
      this.tab = this.tab - 1
    },
    nextBtn () {
      this.tab = this.tab + 1
    },
    nodeColor (index) {
      return index === 0 ? '#3575F6' : '#D3DBEB'
    },
    formatreplace (description) {
      if (!description) {
        return
      }
      let html = description.replace(/\n/g, '<br/>')
      return html
    },
    setAnnex (annexURL, annexName) {
      this.$set(this.draweDetaileData, 'coverImg', annexURL)
    },
    setAnnex1 (annexURL, annexName) {
      this.draweDetaileData.imgUrls.push(annexURL)
    },
    tabChange (n) {
      this.tab = n
    },
    onEdit () {
      this.readonly = false
      this.projectItem.id = this.draweDetaileData.projectManagementId
      this.projectItem.referred = this.draweDetaileData.projectManagementReferred
      this.teantItem.id = this.draweDetaileData.tenantId
      this.teantItem.referred = this.draweDetaileData.tenantName
      this.floorItem.id = this.draweDetaileData.floorId
      this.floorItem.floorName = this.draweDetaileData.floor
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    onHide () {
      this.tab = 1
      this.readonly = true
      this.$refs['draweDetaileData'].resetFields()
      this.$emit('drawerClose', false)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
.brandsDetails {
  .dialog-footer {
    // margin-top: 0px;
    // margin-right: 20px;
    // text-align: right;
    // height: 40px;
    // margin-left: 30px;
    // padding-top: 15px;
    // border-top: 1px solid #e5e5e5;
    // box-sizing: content-box;
    // margin-bottom: 20px;
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
  .details_content {
    width: 850px;
    .tab {
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      background-color: #ffffff;
      border-top: 1px solid #f7f7f7;
      > span {
        color: #666666;
        display: inline-block;
        padding: 0 20px;
        height: 49px;
        line-height: 49px;
        cursor: pointer;
        &.active {
          color: #3175f6;
          border-bottom: 3px solid #3175f6;
        }
      }
    }
    .el-form {
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
              color: #262626;
              font-size: 14px;
              height: 40px;
              line-height: 40px;
            }
            .tips {
              font-size: 12px;
              color: #999999;
              margin-top: 10px;
            }
          }
        }
        &.content3 {
          .timelineBox {
            width: 100%;
            padding-left: 150px;
            padding-top: 30px;
            height: 500px;
            overflow-y: auto;
            .statusBox {
              position: absolute;
              left: -160px;
              top: 0;
              width: 150px;
              text-align: center;
              display: -ms-flexbox;
              display: flex;
              -ms-flex-direction: column;
              flex-direction: column;
              font-size: 12px;
              > div {
                position: absolute;
                right: 0;
                &:first-child {
                  display: inline-block;
                  width: 60px;
                  height: 20px;
                  line-height: 20px;
                  &.shangxian {
                    background: #3575f6;
                    border-radius: 4px;
                    color: #ffffff;
                  }
                  &.xiaxian {
                    background: #f99a12;
                    border-radius: 4px;
                    color: #ffffff;
                  }
                  &.shenhe {
                    background: #f99a12;
                    border-radius: 4px;
                    color: #ffffff;
                  }
                  &.tjsh {
                    background: #83bf68;
                    border-radius: 4px;
                    color: #ffffff;
                  }
                }
                &:last-child {
                  &.first {
                    top: 30px;
                    color: #3575f6;
                  }
                  top: 30px;
                  color: #999999;
                }
              }
            }
            .template {
              position: relative;
              top: -13px;
              left: 0px;
              width: 500px;
              > p {
                margin-bottom: 5px;
                > span:first-child {
                  font-size: 14px;
                  color: #333333;
                }
                > span:last-child {
                  font-size: 12px;
                  color: #999999;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
