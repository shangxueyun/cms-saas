<template>
  <div class="tenant-details">
    <drawer :show="detailsdrawershow"
            class="new_vue_drawer"
            :title="drawerTitle"
            :wrapperClosable="false"
            @on-hide="onHide('close')">
      <div class="tenant-details details-content"
           slot="drawer"
           id="adminUnit">
        <div class="adminUnit_top">
          <div class="basicInfo">
            <p class="title"><i></i>{{tenantDetail.buildingName}}</p>
            <div class="dweditbtn"
                 @click="edit"><i class="iconfont icon-edit1"></i>
              <span>编辑</span>
            </div>
            <div class="content">
              <div class="tenant">
                <div class="tenantBox">
                  <div class="cttitle">管理企业<i class="required">*</i></div>
                  <span class="txt">{{tenantDetail.organizeName || '-'}}</span>
                </div>
                <div class="tenantBox">
                  <div class="cttitle">项目<i class="required">*</i></div>
                  <span class="txt">{{tenantDetail.projectManagementDTO.projectName || '-'}}</span>
                </div>
                <div class="tenantBox">
                  <div class="cttitle">资产坐落</div>
                  <span class="txt">{{formatAddressType(tenantDetail.addressType)}}</span>
                </div>
                <div class="tenantBox">
                  <div class="cttitle">地址</div>
                  <span class="txt">{{tenantDetail.address || '-'}}</span>
                </div>
                <div class="tenantBox">
                  <div class="cttitle">投资方</div>
                  <span class="txt">{{tenantDetail.investor || '-'}}</span>
                </div>
                <div class="tenantBox">
                  <div class="cttitle">投资金额</div>
                  <span v-if="tenantDetail.investorPrice"
                        class="txt">{{tenantDetail.investorPrice}}万元</span>
                  <span v-else
                        class="txt">-</span>
                </div>
                <div class="tenantBox">
                  <div class="cttitle">用地类别</div>
                  <span class="txt txtLeft"
                        >{{formatBuildingUse(tenantDetail.buildingUse)}}</span>
                </div>
                <div class="tenantBox">
                  <div class="cttitle">楼宇类型<i class="required">*</i></div>
                  <span class="txt txtLeft"
                        >{{formatBuildingBusiness(tenantDetail.buildingBusiness)}}</span>
                </div>
                <div class="tenantBox tenantBoxW">
                  <div class="cttitle">资产类别<i class="required">*</i></div>
                  <span class="txt txtLeft"
                        >{{formatAssetsType(tenantDetail.assetsType)}}</span>
                </div>
                <div class="tenantBox tenantBoxW" v-if="tenantDetail.assetsType === 'FIELD'">
                  <div class="cttitle">场地面积<i class="required">*</i></div>
                  <span class="txt"
                        style="margin-left: -20px">{{tenantDetail.buildingArea || '-'}}
                    <span v-if="tenantDetail.buildingArea">㎡</span>
                  </span>
                </div>
                <div class="tenantBox tenantBoxW" v-if="tenantDetail.assetsType === 'LAND'">
                  <div class="cttitle cttitleL"
                       >土地面积<i class="required">*</i></div>
                  <span class="txt txtL"
                        >{{tenantDetail.buildingArea || '-'}}
                    <span v-if="tenantDetail.buildingArea">亩</span>
                  </span>
                </div>
                <div class="tenantBox" v-if="tenantDetail.assetsType === 'BUILDING'">
                  <div class="cttitle">地上建筑面积<i class="required">*</i></div>
                  <span class="txt">{{tenantDetail.upArea || '-'}}
                    <span v-if="tenantDetail.upArea">㎡</span>
                  </span>
                </div>
                <div class="tenantBox" v-if="tenantDetail.assetsType === 'BUILDING'">
                  <div class="cttitle cttitleL"
                       >地上楼层<i class="required">*</i></div>
                  <span class="txt">{{tenantDetail.upAmount || '-'}}</span>
                </div>
                <div class="tenantBox" v-if="tenantDetail.assetsType === 'BUILDING'">
                  <div class="cttitle">地下建筑面积<i class="required">*</i></div>
                  <span class="txt">{{tenantDetail.downArea || '-'}}
                    <span v-if="tenantDetail.downArea">㎡</span>
                  </span>
                </div>
                <div class="tenantBox" v-if="tenantDetail.assetsType === 'BUILDING'">
                  <div class="cttitle cttitleL"
                       >地下楼层<i class="required">*</i></div>
                  <span class="txt">{{tenantDetail.downAmount || '-'}}</span>
                </div>
                <div class="tenantBox"
                     :class=" tenantDetail.buildingBusiness === 'SELF_USE' ? null : 'tenantBoxW'"
                     v-if="tenantDetail.assetsType === 'BUILDING'">
                  <div class="cttitle">可用面积<i class="required">*</i></div>
                  <span class="txt">{{tenantDetail.buildingArea || '-'}}
                    <span v-if="tenantDetail.buildingArea">㎡</span>
                  </span>
                </div>
                <div class="tenantBox" v-if="tenantDetail.assetsType === 'BUILDING' && tenantDetail.buildingBusiness === 'SELF_USE'">
                  <div class="cttitle cttitleL">可出租面积</div>
                  <span class="txt">{{tenantDetail.canRentArea || '-'}}
                    <span v-if="tenantDetail.canRentArea">㎡</span>
                  </span>
                </div>
                <div class="tenantBox tenantBoxW" v-if="tenantDetail.assetsType === 'BUILDING'">
                  <div class="cttitle">可提供所有楼层面积<i class="required">*</i></div>
                  <span class="txt">{{formatFloorArea(tenantDetail.provideFloorArea)}}</span>
                </div>
                <div class="tenantBox tenantBoxW" v-if="tenantDetail.assetsType === 'BUILDING'">
                  <div class="cttitle">竣工年份</div>
                  <span class="txt">{{tenantDetail.endWorkDate || '-'}}</span>
                </div>
                <div class="tenantBox tenantBoxW" v-if="tenantDetail.assetsType === 'BUILDING'">
                  <div class="cttitle">产权证</div>
                  <span class="txt"
                        >{{formateCates(tenantDetail.havaCertificates)}}</span>
                </div>
                <div class="tenantBox tenantBoxW" v-if="tenantDetail.assetsType === 'BUILDING'">
                  <div class="cttitle"
                       v-if="tenantDetail.havaCertificates">产权资产类别</div>
                  <div class="cttitle"
                       v-else-if="!tenantDetail.havaCertificates">无证资产类别</div>
                  <span class="txt"
                        >{{tenantDetail.certificatesType || '-'}}</span>
                </div>
                <div class="tenantBox tenantBoxW" v-if="tenantDetail.assetsType === 'BUILDING' && tenantDetail.havaCertificates">
                  <div class="cttitle">权利人名称</div>
                  <span class="txt"
                        >{{tenantDetail.obligeeName || '-'}}</span>
                </div>
                <div class="tenantBox tenantBoxW" v-if="tenantDetail.assetsType === 'BUILDING' && tenantDetail.havaCertificates">
                  <div class="cttitle">产权证编号</div>
                  <span class="txt"
                        >{{tenantDetail.cqCode || '-'}}</span>
                </div>
                <div class="tenantBox tenantBoxW" v-if="tenantDetail.assetsType === 'BUILDING' && !tenantDetail.havaCertificates">
                  <div class="cttitle cttitleL"
                       >建筑结构</div>
                  <span class="txt"
                        >{{tenantDetail.buildingStructure || '-'}}</span>
                </div>
                <div class="tenantBox tenantBoxW" v-if="tenantDetail.assetsType === 'BUILDING' && !tenantDetail.havaCertificates">
                  <div class="cttitle cttitleL"
                       >经营方式</div>
                  <span class="txt"
                        >{{tenantDetail.managementMode || '-'}}</span>
                </div>
                <div class="tenantBox tenantBoxW" v-if="tenantDetail.assetsType === 'BUILDING' && !tenantDetail.havaCertificates">
                  <div class="cttitle cttitleL"
                       >承租方式</div>
                  <span class="txt"
                        >{{tenantDetail.leaseMode || '-'}}</span>
                </div>
                <div class="otherTitle">
                  <div>其他</div>
                </div>
                <div class="otherShow">
                <div class="tenantBox" v-if="tenantDetail.assetsType === 'BUILDING'">
                    <div class="cttitle">标准层高</div>
                    <span class="txt">{{tenantDetail.buildingHigh || '-'}}
                      <span v-if="tenantDetail.buildingHigh">米</span>
                    </span>
                </div>
                <div class="tenantBox" v-if="tenantDetail.assetsType === 'BUILDING'">
                    <div class="cttitle">锅炉数量</div>
                    <span class="txt">{{tenantDetail.boilerAmount || '-'}}</span>
                </div>
                <div class="tenantBox" v-if="tenantDetail.assetsType === 'BUILDING'">
                    <div class="cttitle">客梯数</div>
                    <span class="txt">{{tenantDetail.elevatorAmount || '-'}}</span>
                </div>
                <div class="tenantBox" v-if="tenantDetail.assetsType === 'BUILDING'">
                    <div class="cttitle">货梯数</div>
                    <span class="txt">{{tenantDetail.cargoLiftAmount || '-'}}</span>
                </div>
                <div class="tenantBox" v-if="tenantDetail.assetsType === 'BUILDING'">
                    <div class="cttitle">室内装修</div>
                    <span class="txt">{{tenantDetail.interiorDecoration || '-'}}</span>
                </div>
                <div class="tenantBox" v-if="tenantDetail.assetsType === 'BUILDING'">
                    <div class="cttitle">外立面装修</div>
                    <span class="txt">{{tenantDetail.facadeDecoration || '-'}}</span>
                     <span></span>
                </div>
                <div class="tenantBox">
                    <div class="cttitle">排序</div>
                    <span class="txt">{{tenantDetail.sortNumber || '-'}}</span>
                </div>
                <div class="tenantBox">
                    <div class="cttitle">状态</div>
                    <span class="txt">{{formatUseStatus(tenantDetail.useStatus)}}</span>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="adminUnit_top"
             style="margin-top: 12px">
          <div class="basicInfo">
            <p class="title"><i></i>管理负责人</p>
            <div class="dweditbtn delAction"
                 @click="addManageUser"><i class="iconfont icon-crm_xinzeng-"></i>
              <span>新增</span>
            </div>
            <div class="content"
                 style="padding: 15px 15px 0 15px!important;">
              <el-table :data="buildingListData"
                        style="width: 100%">
                <el-table-column prop="userName"
                                 label="姓名"
                                 width="100"
                                 align="center"></el-table-column>
                <el-table-column label="性别"
                                 width="100"
                                 align="center">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ formatSex(scope.row.sex) }}</span>
                  </template>
                </el-table-column>
                <!-- :title="`${startDate} - ${endDate}`" -->
                <el-table-column label="岗位"
                                 prop="positionName"
                                 align="center">
                </el-table-column>
                <el-table-column label="手机号"
                                 prop="telephone"
                                 align="center">
                </el-table-column>
                <el-table-column width="60"
                                 label="操作"
                                 align="center">
                  <template slot-scope="scope">
                    <span class="details_cheackBtn"
                          style="color:#D92E20;"
                          @click="delDetails(scope.$index, scope.row)">删除</span>
                  </template>
                </el-table-column>
              </el-table>

            </div>
          </div>
        </div>
        <!-- <div class="recordList">
              <p class="title"><i></i>跟进记录 </p>
              <div class="addbtn" @click="addflowList"><i class="iconfont icon-cms_xiegenjin-1"></i>写跟进</div>
              <div class="timelineDiv">
                <el-timeline class="timeline" v-if="timeLineListData.length">
                  <el-timeline-item
                                    style="position:relative;min-height: 80px;"
                                    v-for="(item, index) in timeLineListData"
                                    :key="index"
                                    size="normal"
                                    :color="nodeColor(index)">
                    <div class="timeLineBox">
                      <div class="recodeIcon">跟进</div>
                      <div :class="{'first':index===0, 'timeLineTip': true}">{{formatApprovalDate(item.followTime)}}</div>
                    </div>
                    <div class="template">
                      <p><span>跟进人：</span>{{item.followName}}</p>
                      <p><span>跟进记录：</span>{{item.followContent}}</p>
                      <div class="annexes">
                        <p v-for="(items, i) in item.annexes" :key="i">
                          <span>{{items.annexName}}</span>
                          <ailPreview :ailObj="items"
                                    :encrypt="true"
                                    @setFile="setFile" />
                          <aliDownLoad :item="items" style="margin-right:10px;display: inline-block;width:auto;height:auto"/>
                        </p>
                      </div>
                    </div>
                  </el-timeline-item>
                </el-timeline>
                <div class="noRecord"
                     style="padding: 20px 50px;"
                     v-else>暂无记录</div>
              </div>
          </div> -->
        <div class="recordList"
             style="margin-top: 12px">
          <p class="title"><i></i>租赁合同 </p>
          <div class="recordTable">
            <el-table :data="contractsListData"
                      style="width: 100%">
              <el-table-column prop="tenant.teantName"
                               label="承租单位"
                               align="center"></el-table-column>
              <!-- <el-table-column label="租赁地址"
                                    align="center">
                                    <template slot-scope="scope">
                                    <span style="margin-left: 10px">{{ formatAddress(scope.row.buildings) }}</span>
                                    </template></el-table-column> -->
              <!-- <el-table-column label="资产类别"
                                    align="center">
                        <template slot-scope="scope">
                                    <span style="margin-left: 10px">{{ formatType(scope.row.buildings) }}</span>
                                    </template>
                                    </el-table-column> -->
              <el-table-column prop="areaDescription"
                               label="租赁面积"
                               align="center">
              </el-table-column>
              <!-- :title="`${startDate} - ${endDate}`" -->
              <el-table-column label="租期"
                               align="center">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.startDate }}-{{ scope.row.endDate }}</span>
                </template>
              </el-table-column>
              <el-table-column width="60"
                               label="操作"
                               align="center">
                <template slot-scope="scope">
                  <span class="details_cheackBtn"
                        @click="toDetails(scope.$index, scope.row)">查看</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </drawer>
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
    <el-dialog title="新增管理负责人"
               :close-on-click-modal="false"
               :visible.sync="dialogVisible"
               width="40%"
               class="addProjectdialog"
               :before-close="handleClose">
      <div class="additem">
        <p class="title"><i></i>楼宇</p>
        <div class="addContent">
          <div class="itemInfo">
            <span>管理企业</span>
            <span>{{tenantDetail.organizeName}}</span>
          </div>
          <div class="itemInfo">
            <span>项目</span>
            <span>{{tenantDetail.projectManagementDTO.projectName}}</span>
          </div>
          <div class="itemInfo">
            <span>资产</span>
            <span>{{tenantDetail.buildingName}}</span>
          </div>
        </div>
      </div>
      <div class="additem">
        <p class="title"><i></i>管理负责人</p>
        <div class="addContent">
          <div class="itemInfo">
            <span>员工<i class="required">*</i></span>
            <el-select v-model="addUserId"
                       placeholder="请选择">
              <el-option v-for="item in buildingManageUserOptions"
                         :key="item.id"
                         :label="item.name"
                         :disabled="filterUserId(item.id)"
                         :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="itemInfo"></div>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button style="background:#fff!important;border:0"
                   @click="handleClose"
                   class="close-button">取消</el-button>
        <el-button style="margin-left:0;width:90px!important"
                   type="primary"
                   class="defaultbtn dialog-confirmBtn"
                   @click="addBuildingManageUser">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-if="centerDialogVisible"
               :visible.sync="centerDialogVisible"
               class="lockDialogClose"
               append-to-body
               width="400px">
      <div class="lockDialogContent"
           style="padding-left: 40px">
        <img src="../../../../../assets/delete2.png">
        <div>
          <div class="div1">删除管理负责人</div>
          <div class="div2">确定删除管理负责人？</div>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <span class="cancel"
              @click="centerDialogVisible = false">取消</span>
        <span class="determine"
              @click="delFun">确定</span>
      </span>
    </el-dialog>
    <!-- 合同详情 -->
    <contractsDetails :detailsdrawershow="detailsShow"
                      :detailData="detailData"
                      ref="contractsDetails"
                      @drawerClose="detailsClose"
                      @handleEdit="toDetails"
                      @query="query" />
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import Drawer from '@/components/drawer.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import aliUpload from '@/components/aliUpload.vue'
import ailPreview from '@/components/ailPreview.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import moment from 'moment'
import contractsDetails from '../../../../contractManagement/gov-contractList/components/contractsDetails'
export default {
  components: {
    Drawer,
    aliDownLoad,
    aliUpload,
    ailPreview,
    picturePrevie,
    contractsDetails
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    tenantDetail: {
      type: Object,
      default: {
        annexes: [],
        projectManagementDTO: {}
      }
    },
    buildingListData: {
      type: Array,
      default: function () {
        return []
      }
    },
    timeLineListData: {
      type: Array,
      default: function () {
        return []
      }
    },
    organizeOptions: {
      type: Array,
      default: function () {
        return []
      }
    },
    contractsListData: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  watch: {
  },
  data () {
    var validateTel = (rule, value, callback) => {
      let reg = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/
      if (value === '' || value === undefined) {
        // callback(new Error('请输入部门电话'))
        callback()
      } else if (!reg.test(value)) {
        callback(new Error('格式错误'))
      } else {
        callback()
      }
    }
    var validateUrl = (rule, value, callback) => {
      let reg = new RegExp(/^[hH][tT][tT][pP]([sS]?):\/\/(\S+\.)+\S{2,}$/)
      if (value === '' || value === undefined) {
        // callback(new Error('请输入官方网址'))
        callback()
      } else if (!reg.test(value)) {
        callback(new Error('格式错误'))
      } else {
        callback()
      }
    }
    var validateInput = (rule, value, callback) => {
      if (value < 0) {
        callback(new Error('大于等于0'))
      } else {
        callback()
      }
    }
    return {
      tenantDetailRules: {
        organizeId: [
          { required: true, message: '请选择管理企业', trigger: 'blur' }
        ],
        id: [
          { required: true, message: '请选择项目', trigger: 'blur' }
        ],
        buildingName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        upArea: [
          { validator: validateInput, trigger: 'blur' }
        ],
        upAmount: [
          { validator: validateInput, trigger: 'blur' }
        ],
        downArea: [
          { validator: validateInput, trigger: 'blur' }
        ],
        downAmount: [
          { validator: validateInput, trigger: 'blur' }
        ],
        buildingArea: [
          { validator: validateInput, trigger: 'blur' }
        ],
        buildingHigh: [
          { validator: validateInput, trigger: 'blur' }
        ],
        elevatorAmount: [
          { validator: validateInput, trigger: 'blur' }
        ],
        cargoLiftAmount: [
          { validator: validateInput, trigger: 'blur' }
        ],
        boilerAmount: [
          { validator: validateInput, trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      centerDialogVisible: false,
      delId: null,
      addUserId: null,
      checkList: ['USING', 'DISABLE'],
      showOther: false,
      drawerTitle: '楼宇详情',
      readOnly: true,
      upLoadText_data: '上传附件',
      fileSize: 100,
      tableData1: [],
      chooseObj: {},
      siteOptions: [{
        value: 'inTown',
        label: '镇内'
      }, {
        value: 'outTown',
        label: '镇外'
      }],
      landOptions: [{
        value: 'RESIDENCE',
        label: '住宅用地'
      }, {
        value: 'INDUSTRY',
        label: '工业用地'
      }, {
        value: 'BUSSINESS',
        label: '商业用地'
      }, {
        value: 'COMPREHENSIVE',
        label: '综合用地'
      }, {
        value: 'PUBLIC',
        label: '公共用地'
      }, {
        value: 'RETAIN',
        label: '保留用地'
      }, {
        value: 'GREEN',
        label: '绿化用地'
      }, {
        value: 'OTHER',
        label: '其他用地'
      }],
      assetsOptions: [{
        value: 'BUILDING',
        label: '楼宇'
      }, {
        value: 'FIELD',
        label: '场地'
      }, {
        value: 'LAND',
        label: '土地'
      }],
      propertyOptions: [{
        value: '楼宇',
        label: ''
      }, {
        value: '厂房',
        label: ''
      }, {
        value: '商铺',
        label: ''
      }, {
        value: '其他',
        label: ''
      }],
      nopropertyOptions: [{
        value: '独立'
      }, {
        value: '加层'
      }, {
        value: '连接体'
      }, {
        value: '夹层'
      }, {
        value: '其他'
      }],
      managementModeoptions: [{
        value: '自用'
      }, {
        value: '转租'
      }],
      // 建筑结构
      buildingStrustOptions: [{
        value: '钢结构'
      }, {
        value: '钢混'
      }, {
        value: '砖墙'
      }, {
        value: '简易房'
      }, {
        value: '内插层'
      }, {
        value: '悬挑'
      }, {
        value: '阳光房'
      }, {
        value: '其他'
      }],
      trimInteriorOpions: [{
        value: '毛胚'
      }, {
        value: '简装'
      }, {
        value: '精装'
      }],
      decorationOptions: [{
        value: '涂料'
      }, {
        value: '幕墙'
      }, {
        value: '砖石'
      }, {
        value: '塑铝'
      }, {
        value: '其他'
      }],
      useStatusOption: [{
        value: 'USING',
        label: '使用'
      }, {
        value: 'DISABLE',
        label: '停用'
      }],
      projectOptions: [],
      showPicture: false,
      num: 0,
      imgArr: [],
      fileType_data: [],
      detailsShow: false,
      detailData: {
        onFileAnnexes: []
      },
      buildingManageUserOptions: []
    }
  },
  mounted () {
  },
  methods: {
    handleClose (done) {
      this.dialogVisible = false
      this.addUserId = null
    },
    delFun () {
      context.http.delete(`/cms/api/buildingManageUser/${this.delId}`).then(res => {
        if (res.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.centerDialogVisible = false
          this.$emit('getBuildingListData', this.tenantDetail.id)
        }
      })
    },
    addBuildingManageUser () {
      if (!this.addUserId) {
        this.$message({
          message: '请选择管理负责人',
          type: 'warning'
        })
        return
      }
      context.http.post(`/cms/api/buildingManageUser`, {
        buildingId: this.tenantDetail.id,
        userId: this.addUserId
      }).then(res => {
        if (res.status === 201) {
          this.$message({
            type: 'success',
            message: '新增成功'
          })
          this.handleClose()
          this.$emit('getBuildingListData', this.tenantDetail.id)
        }
      })
    },
    addManageUser () {
      this.dialogVisible = true
      this.getBuildingManageUser()
    },
    getBuildingManageUser () {
      context.http.get(`/uaa/api/organizes/users`, {
        organizeId: this.tenantDetail.organizeId,
        next: true,
        page: 0,
        size: 9999
      }).then(res => {
        if (res.status === 200) {
          this.buildingManageUserOptions = res.data
        }
      })
    },
    changShowOther () {
      this.showOther = !this.showOther
    },
    filterUserId (id) {
      let temp = this.buildingListData.some(item => {
        return item.userId === id
      })
      return temp
    },
    formatSex (sex) {
      if (sex === 'WOMAN') {
        return '女'
      } else {
        return '男'
      }
    },
    delDetails (index, row) {
      this.centerDialogVisible = true
      this.delId = row.id
      // this.$confirm('确认删除该数据?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   this.delFun(row)
      // }).catch(() => {
      // })
    },
    changeUpArea (e) {
      if (this.tenantDetail.downArea && this.tenantDetail.upArea) {
        this.tenantDetail.upArea = Number(this.tenantDetail.upArea)
        this.tenantDetail.downArea = Number(this.tenantDetail.downArea)
        this.tenantDetail.buildingArea = this.tenantDetail.upArea + this.tenantDetail.downArea
      }
    },
    changeDownArea (e) {
      if (this.tenantDetail.downArea && this.tenantDetail.upArea) {
        this.tenantDetail.upArea = Number(this.tenantDetail.upArea)
        this.tenantDetail.downArea = Number(this.tenantDetail.downArea)
        this.tenantDetail.buildingArea = this.tenantDetail.upArea + this.tenantDetail.downArea
      }
    },
    formatType (buildings) {
      let temp = ''
      buildings.forEach((e, i) => {
        let type = e.assetsType
        if (type === 'BUILDING') {
          temp = temp + '楼宇、'
        } else if (type === 'FIELD') {
          temp = temp + '场地、'
        } else if (type === 'LAND') {
          temp = temp + '土地、'
        }
      })
      temp = temp.substring(0, temp.length - 1)
      return temp
    },
    formatFloorArea (floorAreaOptions) {
      let temp = ''
      if (floorAreaOptions === true) {
        temp = '是'
      } else if (floorAreaOptions === false) {
        temp = '否'
      } else {
        temp = '-'
      }
      return temp
    },
    formatAddress (buildings) {
      let temp = ''
      buildings.forEach((e, i) => {
        if (e.address) {
          temp = e.address + '、'
        }
      })
      temp = temp.substring(0, temp.length - 1)
      return temp
    },
    changdProject (e) {
      this.tenantDetail.projectManagementDTO.id = e
      this.projectOptions.forEach((item, index) => {
        if (item.id === e) {
          this.tenantDetail.projectManagementDTO.projectName = item.projectName
        }
      })
    },
    pictureClose () {
      this.showPicture = false
    },
    changeOrganizeId (e) {
      this.tenantDetail.organizeId = e
      this.organizeOptions.forEach((item, index) => {
        if (item.id === e) {
          this.tenantDetail.organizeName = item.name
        }
      })
      this.getAllProject('edit')
    },
    getAllProject (type) {
      context.http.get('cms/api/project-managements/byOrganizeId', {
        useStatus: this.checkList[0],
        organizeId: this.tenantDetail.organizeId
      }).then(res => {
        if (res.status === 200) {
          this.projectOptions = res.data
          if (type === 'edit') {
            this.tenantDetail.projectManagementDTO.id = this.projectOptions[0].id
            this.tenantDetail.projectManagementDTO.projectName = this.projectOptions[0].projectName
          }
          // this.chooseObj = this.projectOptions[0]
        }
      })
    },
    nodeColor (index) {
      return index === 0 ? '#3575F6' : '#D3DBEB'
    },
    addflowList () {
      this.$emit('showflowListDialoag', this.tenantDetail.id) // 资产id
    },
    formatApprovalDate (time) {
      if (time) {
        time = time.substr(0, time.lastIndexOf('T'))
        return time
      }
    },
    changeAssetsType (e) {
      this.tenantDetail.buildingArea = null
    },
    changeSwitch (e) {
      this.tenantDetail.certificatesType = null
    },
    editTenant () {
      if (this.tenantDetail.assetsType === 'BUILDING') {
        if (this.tenantDetail.upArea !== 0 && !this.tenantDetail.upArea) {
          this.$message({
            message: '请输入地上建筑面积',
            type: 'warning'
          })
          return
        }
        if (this.tenantDetail.upAmount !== 0 && !this.tenantDetail.upAmount) {
          this.$message({
            message: '请输入地上楼层',
            type: 'warning'
          })
          return
        }
        if (this.tenantDetail.downArea !== 0 && !this.tenantDetail.downArea) {
          this.$message({
            message: '请输入地下建筑面积',
            type: 'warning'
          })
          return
        }
        if (this.tenantDetail.downAmount !== 0 && !this.tenantDetail.downAmount) {
          this.$message({
            message: '请输入地下楼层',
            type: 'warning'
          })
          return
        }
        if (this.tenantDetail.buildingArea !== 0 && !this.tenantDetail.buildingArea) {
          this.$message({
            message: '请输入可出租面积',
            type: 'warning'
          })
          return
        }
        this.tenantDetail.endWorkDate ? (this.tenantDetail.endWorkDate = moment(this.tenantDetail.endWorkDate).format('YYYY')) : null
      } else if (this.tenantDetail.assetsType === 'FIELD') {
        if (this.tenantDetail.buildingArea !== 0 && !this.tenantDetail.buildingArea) {
          this.$message({
            message: '请输入场地面积',
            type: 'warning'
          })
          return
        }
        this.tenantDetail.havaCertificates = null
      } else if (this.tenantDetail.assetsType === 'LAND') {
        if (this.tenantDetail.buildingArea !== 0 && !this.tenantDetail.buildingArea) {
          this.$message({
            message: '请输入土地面积',
            type: 'warning'
          })
          return
        }
        this.tenantDetail.havaCertificates = null
      }
      this.$refs['tenantDetail'].validate((valid) => {
        if (valid) {
          context.http.put('/cms/api/buildings', this.tenantDetail).then(res => {
            this.onHide()
            // this.$emit('refreshQuery', this.tenantDetail.projectId)
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.$emit('getTenantDetail', this.tenantDetail.id)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onHide (state) {
      this.readOnly = true
      if (state === 'close') {
        this.$emit('drawerClose', false)
        this.$emit('query')
      }
      this.$emit('getTenantDetail', this.tenantDetail.id)
    },
    edit () {
      // this.readOnly = false
      // this.getAllProject()
      this.$emit('showAddProjects')
    },
    setAnnex_data (annexURL, annexName) { // 资料存档上传
      let tenantDetail = JSON.parse(JSON.stringify(this.tenantDetail))
      tenantDetail.annexes.push({
        annexURL: annexURL,
        annexName: annexName
      })
      context.http.put('/cms/api/chargeDept', tenantDetail).then(res => {
        this.$set(this.tenantDetail, 'annexes', res.data.annexes)
        this.$forceUpdate()
      })
    },
    dataDel (index) {
      this.tenantDetail.annexes.splice(index, 1)
      this.$forceUpdate()
      context.http.put('/cms/api/chargeDept', this.tenantDetail).then(res => {
      })
    },
    subItem (item, index) {
      this.tenantDetail.contacts.splice(index, 1)
    },
    addItem (item, index) { // 加减联系人
      // if (this.tenantDetail.contacts.length === 5) {
      //   this.$message({
      //     type: 'error',
      //     message: '最多添加5名联系人'
      //   })
      //   return
      // }
      this.tenantDetail.contacts.push(
        { name: '', post: '', telephone: '' }
      )
    },
    setFile (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    formatreplace (description) {
      if (!description) {
        return
      }
      let html = description.replace(/\n/g, '<br/>')
      return html
    },
    formatAddressType (type) {
      if (type === 'inTown') {
        return '镇内'
      } else if (type === 'outTown') {
        return '镇外'
      } else {
        return '-'
      }
    },
    formatBuildingUse (type) {
      if (type === 'RESIDENCE') {
        return '住宅用地'
      } else if (type === 'INDUSTRY') {
        return '工业用地'
      } else if (type === 'BUSSINESS') {
        return '商业用地'
      } else if (type === 'COMPREHENSIVE') {
        return '综合用地'
      } else if (type === 'PUBLIC') {
        return '公共用地'
      } else if (type === 'RETAIN') {
        return '保留用地'
      } else if (type === 'GREEN') {
        return '绿化用地'
      } else if (type === 'OTHER') {
        return '其他用地'
      } else {
        return '-'
      }
    },
    formatBuildingBusiness (type) {
      if (type === 'RENT') {
        return '出租'
      } else if (type === 'SELL') {
        return '出售'
      } else if (type === 'SELF_USE') {
        return '自用'
      } else {
        return '-'
      }
    },
    formatAssetsType (type) {
      if (type === 'BUILDING') {
        return '楼宇'
      } else if (type === 'FIELD') {
        return '场地'
      } else if (type === 'LAND') {
        return '土地'
      } else {
        return '-'
      }
    },
    formateCates (type) {
      if (type) {
        return '有证'
      } else {
        return '无证'
      }
    },
    formatUseStatus (type) {
      if (type === 'USING') {
        return '使用'
      } else if (type === 'DISABLE') {
        return '停用'
      } else {
        return '-'
      }
    },
    detailsClose () {
      this.detailsShow = false
    },
    query () { },
    toDetails (index, row) {
      this.recordRow = row
      context.http.get('/cms/api/contracts/' + row.id).then(res => {
        this.detailData = res.data
        this.detailsShow = true
      })
    }
  }
}
</script>
<style lang="scss" scope>
.tenant-details {
  .el-input__inner {
    height: 32px;
  }
  .el-input__icon {
    line-height: 32px;
  }
  .close-button:hover {
    color: #3577f6 !important;
  }
  .details-content {
    display: flex;
    flex-direction: column;
    padding-bottom: 20px !important;
    &#adminUnit {
      width: 640px !important;
      .adminUnit_top {
        width: 640px !important;
      }
    }
    .title {
      font-size: 16px;
      font-weight: bolder;
      padding-left: 26px;
      height: 40px;
      line-height: 40px;
      background-color: #fff;
      border-bottom: 1px solid #f6f6f6;
      position: relative;
      color: #262626;
      i {
        display: block;
        position: absolute;
        left: 15px;
        top: 12px;
        width: 4px;
        height: 16px;
        border-radius: 2px;
        background: #3575f6;
      }
    }
    .basicInfo {
      width: 640px !important;
      border-radius: 2px;
      position: relative;
      background: #fff;
      .dweditbtn {
        font-size: 12px !important;
        border-radius: 4px;
        cursor: pointer;
        position: absolute;
        right: 20px;
        top: 12px;
        color: #3575f6;
        .iconfont {
          // width: 15px;
          // height: 20px;
          margin-right: 4px;
          line-height: 16px;
          // background: url(../../../../assets/bianji-hover.png) no-repeat;
          // background-size: contain;
        }
        > span:hover {
          text-decoration: underline;
        }
      }
      .delAction {
        color: #44af69 !important;
        // >span {
        //   text-decoration: underline;
        // }
      }
      .content {
        // max-height: 880px!important;
        // min-height: 660px!important;
        height: auto !important;
        padding: 15px 15px;
        .otherTitle {
          margin-bottom: 20px;
          text-align: left;
          color: #262626;
          font-weight: 700;
          > div {
            display: inline-block;
            cursor: pointer;
          }
          > i {
            color: #a2a2a2;
            font-weight: normal;
            cursor: pointer;
          }
        }
        .otherShow {
          height: 120px;
        }
        .tenant {
          // text-align: center;
          height: 328px;
          overflow-y: auto !important;
          overflow-x: hidden;
          background-color: #fff;
          // .tenantBox {
          //   width: 49% !important;
          //   margin-bottom: 25px;
          //   display: inline-block;
          // }
          .tenantBox {
            width: 49% !important;
            margin-bottom: 25px;
            display: inline-block;
            // display: flex;
            // align-items: center;
            .cttitle {
              margin-bottom: 0px;
              width: 96px !important;
              margin-right: 10px;
              text-align: left;
              color: #777777;
              display: inline-block;
            }
            .cttitleL {
              margin-left: 20px
            }
            .txt {
              display: inline-block;
              // width: 300px;
              text-align: left;
              color: #262626;
              font-weight: 400;
            }
            .txtLeft {
              // margin-left: -56px
            }
            .txtL {
              // margin-left: -20px
            }
            .el-form-item__error {
              width: 100%;
              text-align: center;
            }
          }
          .tenantBoxW {
            width: 98% !important;
          }
        }
        .el-form::-webkit-scrollbar {
          width: 4px !important;
          height: 4px !important;
        }
        .el-form::-webkit-scrollbar-track {
          box-shadow: inset 0 0 6px #fff;
          background-color: #fff;
        }
        .el-form::-webkit-scrollbar-thumb {
          border-radius: 10px;
          box-shadow: inset 0 0 6px #cccccc;
        }
        .dialog-footer {
          margin-top: 25px;
          height: auto;
        }
        .head_contacts {
          width: 100%;
          background: #f7f8fa;
          height: 40px;
          display: flex;
          margin-bottom: 5px;
          span {
            display: block;
            width: 110px;
            line-height: 40px;
            margin-right: 18px;
            color: #777777;
            &:last-child {
              width: 148px;
            }
          }
        }
        .body_contacts {
          display: block;
          display: flex;
          border-bottom: 1px solid #f6f6f6;
          .el-form-item {
            margin-bottom: 5px;
            margin-top: 5px;
            width: 110px;
            margin-right: 18px;
            position: relative;
            .txt {
              width: 110px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              text-align: center;
              height: 40px;
              line-height: 40px;
            }
          }
          .el-form-item:last-child {
            width: 148px;
            .txt {
              width: 148px;
            }
          }
          .el-input__inner {
            padding: 8px;
          }
          .toolContent {
            position: absolute;
            right: -14px;
            top: 10px;
            cursor: pointer;
            i {
              font-size: 18px;
              color: #d92e20;
            }
          }
        }
        .addItem {
          text-align: right;
          height: 20px;
          display: flex;
          justify-content: flex-end;
          margin-top: 5px;
          padding-right: 10px;
          box-sizing: border-box;
          span {
            display: flex;
            cursor: pointer;
            span {
              color: #3575f6;
              line-height: 20px;
              font-size: 16px;
              display: block;
              height: 20px;
            }
            span:last-child {
              font-size: 12px;
              margin-left: 4px;
              line-height: 18px;
              text-decoration: underline;
            }
          }
        }
      }
    }
    .recordList {
      width: 640px !important;
      border-radius: 2px;
      margin-left: 0px !important;
      position: relative;
      .annexes {
        color: #005cb3;
        .icon-download {
          cursor: pointer;
        }
        display: flex;
        font-size: 12px;
        color: #005cb3;
        .annexName {
          margin-right: 10px;
          cursor: pointer;
        }
        > div {
          cursor: pointer;
          font-size: 14px;
        }
      }
      .addbtn {
        position: absolute;
        right: 0px;
        top: 40px;
        z-index: 2;
        height: 26px;
        background: #eef4ff;
        border: 1px solid #9fbfff;
        border-radius: 26px;
        line-height: 26px;
        font-size: 12px;
        color: #3575f6;
        padding-left: 16px;
        width: 82px;
        margin-top: 20px;
        margin-right: 20px;
        i {
          display: block;
          position: absolute;
          left: 9px;
          top: 0;
          font-size: 12px;
          line-height: 26px;
        }
      }
      .timelineDiv {
        display: flex;
        padding: 35px 0 20px;
        padding-left: 180px;
        width: 100%;
        position: relative;
        left: 0;
        right: 0;
        height: 460px !important;
        overflow-y: auto !important;
        background: #fff;
        .timeline {
          .downLoad {
            height: 26px;
            line-height: 26px;
            border: 1px solid #d3dbeb;
            border-radius: 12px;
            padding: 0px 10px;
            width: 150px;
            display: flex;
            justify-content: space-between;
            > i {
              font-size: 14px;
              font-style: normal;
              color: #005cb3;
            }
          }
          p {
            font-size: 14px;
            color: #777777;
            span {
              color: #262626;
            }
          }
          .annexes {
            p {
              color: #005cb3;
              display: flex;
              span {
                color: #005cb3;
              }
            }
          }
          .imgBox {
            width: 40px;
            height: 40px;
            position: absolute;
            left: 30px;
            top: 12px;
            > .userImg {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              cursor: pointer;
            }
            .noImg {
              width: 40px;
              height: 40px;
              line-height: 40px;
              border-radius: 50%;
              background-color: #3575f6;
              color: #ffffff;
              font-size: 12px;
              cursor: pointer;
              padding: 0 5px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              text-align: center;
            }
            .noNameNoImg {
              width: 40px;
              height: 40px;
            }
          }
          .timeLineBox {
            position: absolute;
            left: -160px;
            top: 0;
            width: 150px;
            text-align: center;
            display: flex;
            flex-direction: column;
            font-size: 12px;
            > .recodeIcon {
              background-color: #83bf68 !important;
              color: #fff;
              border-radius: 4px;
              display: inline-block;
              width: 60px;
              height: 20px;
              line-height: 20px;
            }
            .timeLineTip {
              top: 30px !important;
            }
            > div {
              position: absolute;
              right: 0;
            }
            > .first {
              color: #3575f6 !important;
            }
          }
          p {
            margin-bottom: 5px;
          }
        }
      }
      > .timelineDiv::-webkit-scrollbar {
        width: 4px !important;
        height: 4px !important;
      }
      > .timelineDiv::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px #fff;
        background-color: #fff;
      }
      > .timelineDiv::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 6px #cccccc;
      }
      .recordTable {
        padding: 15px 15px 0 15px !important;
        background-color: #fff;
        max-height: 370px;
      }
    }
  }

  .collapse {
    background: #fff;
    width: 450px;
    margin-top: 15px;
    position: relative;
    > span {
      display: block;
      width: 80px;
      height: 24px;
      border: 1px solid rgba(15, 117, 255, 1);
      border-radius: 4px;
      position: absolute;
      right: 15px;
      top: 8px;
      color: rgba(15, 117, 255, 1);
      line-height: 24px;
      padding-left: 6px;
      > div {
        display: block !important;
        position: absolute;
        right: 0;
        top: 0;
      }
      .oss_file {
        height: 24px;
        line-height: 24px;
        width: 80px;
        cursor: pointer;
        input {
          font-size: 0;
          cursor: pointer;
        }
        span {
          width: 60px;
          display: block;
          position: absolute;
          right: 0;
          top: 0;
          line-height: 24px;
        }
      }
    }
    .collapseTitle {
      padding: 0 15px;
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    .collapseContent {
      width: 100%;
      padding: 15px;
      height: 266px;
      overflow: auto;
      > div {
        width: 100%;
        padding: 0 15px;
        height: 40px;
        display: flex;
        align-items: center;
        > span {
          width: 120px;
          display: block;
          text-align: center;
          i {
            cursor: pointer;
          }
          &:first-child {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        > span:nth-child(2) {
          width: 150px;
        }
      }
      .annexesHead {
        background: #f7f8fa;
        padding: 0;
        color: #777777;
      }
    }
    .collapseContent::-webkit-scrollbar {
      width: 4px !important;
      height: 4px !important;
    }
    .collapseContent::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px #fff;
      background-color: #fff;
    }
    .collapseContent::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 6px #cccccc;
    }
  }
  .new_vue_drawer {
    .drawer-head {
      background: #fff;
      margin: 0;
      padding: 20px 30px 20px 30px;
    }
    .drawer {
      background: #f7f7f7;
    }
    .tenant-details {
      padding-top: 12px !important;
      padding-left: 0px !important;
      padding-right: 0px !important;
      display: flex;
      justify-content: space-between;
    }
  }
  .adminTextear {
    textarea {
      height: 100%;
    }
  }
}
.timelineBox {
  width: 100%;
  padding-left: 150px;
  padding-top: 30px;
  height: 500px;
  overflow-y: auto;
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
      display: flex;
      margin-bottom: 5px;
      span {
        display: block;
      }
      > span:first-child {
        font-size: 14px;
        color: #333333;
        width: 75px;
        font-weight: bolder;
      }
      > span:last-child {
        font-size: 14px;
        flex: 1;
        color: #777777;
      }
    }
    .annexesList {
      display: flex;
      font-size: 12px;
      color: #005cb3;
      .annexName {
        margin-right: 10px;
        cursor: pointer;
      }
      > div {
        cursor: pointer;
        font-size: 14px;
      }
    }
  }
}
.addProjectdialog {
  .el-dialog {
    .el-dialog__body {
      .additem {
        margin-top: 12px;
        background-color: #fff;
        .title {
          font-size: 16px;
          font-weight: bolder;
          padding-left: 26px;
          height: 40px;
          line-height: 40px;
          background-color: #fff;
          border-bottom: 1px solid #f6f6f6;
          position: relative;
          color: #262626;
          i {
            display: block;
            position: absolute;
            left: 15px;
            top: 12px;
            width: 4px;
            height: 16px;
            border-radius: 2px;
            background: #3575f6;
          }
        }
        .addContent {
          display: flex;
          padding: 20px;
          .itemInfo {
            flex: 1;
            display: flex;
            flex-direction: column;
            > span:first-child {
              height: 28px;
              font-size: 14px;
              font-family: PingFang SC;
              font-weight: 400;
              color: #777777;
              line-height: 28px;
            }
            > span:last-child {
              height: 28px;
              font-size: 14px;
              font-family: PingFang SC;
              font-weight: 400;
              color: #333333;
              line-height: 28px;
            }
          }
        }
      }
      .additem:last-child {
        margin-bottom: 12px;
      }
    }
    .el-dialog__footer {
      background-color: #fff;
    }
  }
}
// .dialog-footer{
//   height:65px;
//   background: #fff;
//   text-align: right;
//   margin:0;
//   height:65px;
//   width:100%;
//   display: flex;
//   align-items: center;
//   justify-content: flex-end;
//   padding-right:20px;
//   padding-left: 0!important;
// }
</style>
