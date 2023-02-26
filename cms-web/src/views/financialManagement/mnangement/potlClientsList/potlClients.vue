<template>
  <div id="potlClients"
       class="potlClients">
    <span class="page_head_title">意向客户</span>
    <div class="search-bar">
      <span class="item">
        <div>
          <!-- <span>项目</span> -->
          <el-select v-model="seachParams.projectManagement"
                     placeholder="项目"
                     @change='projectChanged'>
            <el-option v-for="item in options2"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div>
          <!-- <span>品牌名称</span> -->
          <el-input v-model="seachParams.name"
                    placeholder="意向客户名称/联系人"
                    style="width:200px;"></el-input>
        </div>
        <div>
          <!-- <span>业态</span> -->
          <el-cascader style="width:200px;margin-right:10px;"
                       :options="industry1options"
                       clearable
                       placeholder="行业"
                       @change="handleChange"
                       v-model="industryIdArr"></el-cascader>
          <!-- <el-select v-model="seachParams.industryId"
                     placeholder="业态">
            <el-option v-for="item in industryList"
                       :key="item.id"
                       :label="item.value"
                       :value="item.id">
            </el-option>
          </el-select> -->
        </div>
        <div>
          <!-- <span>联系人</span> -->
          <el-input v-model="seachParams.contact"
                    style="margin-right:20px;width:200px;"
                    placeholder="跟进人"></el-input>
        </div>
        <el-select v-model="seachParams.using"
                   style="width: 150px"
                   clearable
                   placeholder="状态">
          <el-option v-for="item in usingOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
        <div class="index_chaxun_btn"
             @click="pgSizeSelectFn()">查询</div>
      </span>
      <span class="item">
        <!-- <span class="addBtn"
              @click="toAddPotlClients"
              v-if="hasAuthority('02020401')">
          <i class="fa fa-pencil-square-o"></i>
          <span>新增意向客户</span>
        </span> -->
        <el-button class="tban tban1"
                   v-if="hasAuthority('02020401')"
                   @click="toAddPotlClients"><i class="iconfont icon-crm_xinzeng-"></i> 新增意向客户</el-button>
        <el-button class="tban tban6"
                   v-if="hasAuthority('02020407')"
                   @click="exportBill()"><i class="iconfont icon-cms_daochushuju-"></i> 导出</el-button>
      </span>
    </div>
    <div class="dealOddsBar"
         v-if="homeReference">
      <span v-for="(item,index) in dealOddsList"
            :key="index"
            class="dealOddsBtn"
            :class="{active:dealOddsIndex===index}"
            @click="switchDealOdds(item,index)">{{item.label}}({{item.num}})</span>
    </div>
    <div class="content">
      <el-table :data="tableData"
                style="border:1px solid #eee"
                @sort-change="sortChange">
        <el-table-column prop="projectManagementDTO.referred"
                         label="项目"
                         align="center"
                         :sortable='true'></el-table-column>
        <el-table-column label="客户类型"
                         align="center"
                         :formatter="customerTypeFormat"></el-table-column>
        <el-table-column prop="yxTenantName"
                         label="客户名称"
                         align="center"></el-table-column>
        <el-table-column prop="referred"
                         label="品牌名称"
                         align="center"></el-table-column>
        <el-table-column prop="industryName"
                         label="行业"
                         align="center"
                         :sortable='true'></el-table-column>
        <el-table-column label="需求面积/m²"
                         align="center"
                         :formatter="lowAreaAndHighArea"></el-table-column>
        <el-table-column label="心理价位"
                         align="center"
                         :formatter="lowPriceAndHighPrice"></el-table-column>
        <el-table-column label="联系人/联系电话"
                         align="center"
                         :formatter="contactFormat"></el-table-column>
        <el-table-column label="招商进度"
                         align="center"
                         :formatter="dealOddsFormat"></el-table-column>
        <el-table-column prop="followName"
                         label="跟进人"
                         align="center"></el-table-column>
        <el-table-column prop="using"
                         label="状态"
                         :formatter="stateFormat"
                         align="center"></el-table-column>
        <el-table-column label="操作"
                         align="center"
                         width="200"
                         v-if="hasAuthority('02020402')">
          <template slot-scope="scope">
            <el-button class="el-button--primary operation-btn"
                       size="mini"
                       @click="toDetails(scope.$index, scope.row, '')">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="ctc-foot1">
      <span><span style="margin-right:10px">{{currentPage}}/{{Math.ceil(total/pgSize)}}页</span> 共{{total}}条记录</span>
      <el-pagination v-if="total > 0"
                     background
                     layout="prev, pager, next"
                     :page-size="pgSize"
                     :total="total"
                     :current-page.sync="currentPage"
                     @current-change="current_change">
      </el-pagination>
      <div class="pagingnum">
        显示 <select v-model="pgSize"
                @change="pgSizeSelectFn">
          <option v-for="item in pgNumoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
          </option>
        </select>
        条目
      </div>
    </div>
    <potClienDtl v-if="detailsShow"
                 :detailsdrawershow="detailsShow"
                 :yxkhFrom="yxkhFrom"
                 :options2="options2"
                 :pageType="pageType"
                 :draweDetaileData="detaileData"
                 :timeLineListData="timeLineListData"
                 :isAllYXtenant="isAllYXtenant"
                 :project="project"
                 ref="potClienDtl"
                 @shopDetails="shopDetails"
                 @refreshList="refreshList"
                 @addFlowListSuccess="addFlowListSuccess"
                 @drawerClose="detailsClose" />
    <!-- 房源详情 组件 -->
    <storeDetailis :detailsdrawershow="storeDetailisShow"
                   :detailData="storeDetailisData"
                   :options1="options2"
                   @shopDetails="shopDetails"
                   @tenantHandleEdit='tenantHandleEdit'
                   ref="storeDetailis"
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
    <el-dialog title="新增意向客户"
               width="750px"
               class="addClientsDialog"
               :visible.sync="dialogFormVisible"
               :close-on-click-modal="false"
               @close="closeFn">
      <el-form class="form"
               :model="addParmas"
               ref="addParmas"
               :rules="TenantDTORules">
        <div class="addComtent">
          <div class="title">
            <i></i>
            客户档案
          </div>
          <div class="contentDtl">
            <div>
              <div class="item ">
                <div style="width:100%">
                  <span>项目<i>*</i></span>
                  <el-form-item prop="projectManagementDTO">
                    <el-select style="width:100%"
                               value-key="id"
                               size="small"
                               v-model="addParmas.projectManagementDTO">
                      <el-option v-for="item in options2"
                                 :key="item.id"
                                 :label="item.referred"
                                 :value="item">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
              <div class="item ">
                <div>
                  <span>意向客户类型<i>*</i></span>
                  <div style="display:flex;">
                    <el-radio v-model="addParmas.customerType"
                              label="COMPANY"
                              @change="radioChange">企业</el-radio>
                    <el-radio v-model="addParmas.customerType"
                              label="PERSONAL"
                              @change="radioChange">个人</el-radio>
                  </div>
                </div>
              </div>
              <div class="item ">
                <div>
                  <span>{{addParmas.customerType==='COMPANY'?'企业名称':'姓名'}}<i>*</i></span>
                  <el-form-item prop="yxTenantName">
                    <el-input style="width:100%"
                              v-model="addParmas.yxTenantName"
                              placeholder="请输入"
                              size="small"
                              maxlength="50"
                              @change="autoChange"
                              onblur="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"></el-input>
                  </el-form-item>
                </div>
                <div>
                  <span>品牌名称<i>*</i></span>
                  <el-form-item prop="referred">
                    <el-input v-model="addParmas.referred"
                              placeholder="请输入"
                              style="width:100%"
                              size="small"
                              maxlength="20"
                              onblur="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"></el-input>
                  </el-form-item>
                </div>
              </div>
              <div class="item">
                <div>
                  <span>用途<i>*</i></span>
                  <el-form-item prop="tenantUse">
                    <el-select style="width:100%"
                               v-model="addParmas.tenantUse"
                               placeholder="请选择"
                               size="small"
                               @change="industry(addParmas.tenantUse);industryObj = {}"
                               value-key="value">
                      <el-option v-for="item in tenantUseList"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div>
                  <span>行业<i>*</i></span>
                  <el-form-item prop="industryId">
                    <el-select style="width:100%"
                               v-model="industryObj"
                               placeholder="请选择"
                               size="small"
                               value-key="id"
                               @change="industryChange">
                      <el-option v-for="item in industryList"
                                 :key="item.id"
                                 :label="item.value"
                                 :value="item">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>

              </div>
              <div class="item">
                <div class="inputNoborder">
                  <span>需求面积/m²<i>*</i></span>
                  <span style="margin-bottom: 0;border: 1px solid #DCDFE6;border-radius: 4px;">
                    <el-form-item prop="lowArea"
                                  style="display: inline-block;">
                      <el-input v-model="addParmas.lowArea"
                                style="width:150px"
                                size="small"
                                onkeyup="value=value.replace(/[^0-9\.]/g,'')"></el-input>
                    </el-form-item>
                    <span style="margin:0 5px;color:#999;font-weight: bold;">-</span>
                    <el-form-item prop="highArea"
                                  style="display: inline-block;">
                      <el-input v-model="addParmas.highArea"
                                style="width:150px"
                                size="small"
                                onkeyup="value=value.replace(/[^0-9\.]/g,'')"></el-input>
                    </el-form-item>
                  </span>
                </div>
                <div class="inputNoborder">
                  <span>心理价位<i>*</i></span>
                  <span style="margin-bottom: 0;border: 1px solid #DCDFE6;border-radius: 4px;display: flex;align-items: center;">
                    <el-form-item prop="lowPrice"
                                  style="display: inline-block;">
                      <el-input v-model="addParmas.lowPrice"
                                style="width:95px"
                                size="small"
                                onkeyup="value=value.replace(/[^0-9\.]/g,'')"></el-input>
                    </el-form-item>
                    <span style="margin:0 5px;color:#999;font-weight: bold;">-</span>
                    <el-form-item prop="highPrice"
                                  style="display: inline-block;">
                      <el-input v-model="addParmas.highPrice"
                                style="width:95px"
                                size="small"
                                onkeyup="value=value.replace(/[^0-9\.]/g,'')"></el-input>
                    </el-form-item>
                    <el-select v-model="addParmas.priceUnit"
                               size="small"
                               class="priceSelect"
                               style="flex: 1;">
                      <el-option v-for="(item,index) in options3"
                                 :key="index"
                                 :label="item.label"
                                 :value="item.value"></el-option>
                    </el-select>
                  </span>
                </div>

              </div>
              <div class="item">
                <div>
                  <span>预计开店时间</span>
                  <el-date-picker v-model="addParmas.signDate"
                                  size="small"
                                  placeholder="请选择"
                                  value-format="yyyy-MM-dd"
                                  style="width:100%"
                                  type="date">
                  </el-date-picker>
                </div>
                <div>
                  <span>联系人<i>*</i></span>
                  <el-form-item prop="contact">
                    <el-input v-model="addParmas.contact"
                              size="small"
                              placeholder="请输入"
                              style="width:100%"></el-input>
                  </el-form-item>

                </div>

              </div>
              <div class="item">
                <div>
                  <span>联系电话<i>*</i></span>
                  <el-form-item prop="telephone">
                    <el-input v-model="addParmas.telephone"
                              size="small"
                              onkeyup="value=value.replace(/[\u4e00-\u9fa5]/ig,'')"
                              placeholder="请输入"
                              style="width:100%"></el-input>
                  </el-form-item>

                </div>
                <div>
                  <span>意向客户来源</span>
                  <el-select v-model="customerSourceObj"
                             value-key="id"
                             size="small"
                             style="width:100%"
                             @change="customerSourceChange">
                    <el-option v-for="(item,index) in yxkhFrom"
                               :key="index"
                               :label="item.value"
                               :value="item"></el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="addComtent"
             style="margin-top:15px">
          <div class="title">
            <i></i>
            意向客户简介
          </div>
          <div class="contentDtl">
            <div>
              <div class="item ">
                <div style="width:100%">
                  <span>意向客户网站</span>
                  <el-input style="width:100%"
                            size="small"
                            v-model="addParmas.website"
                            placeholder="请输入内容"></el-input>
                </div>
              </div>
              <div class="item"
                   style="flex-direction:column;">
                <span>意向客户简介</span>
                <el-input v-model="addParmas.introduction"
                          type="textarea"
                          :rows="5"
                          resize="none"
                          style="width:100%;margin-top:10px"
                          maxlength="200"
                          placeholder="请输入200字以内"></el-input>
              </div>
              <div class="item ">
                <div style="width:100%">
                  <span>档案文件</span>
                  <div style="display: flex;justify-content: space-between;align-items: center;">
                    <aliUpload class="aliUpload deviceDetails"
                               :upLoadText="addParmas.annexes.length>0?'继续上传':'上传附件'"
                               :fileType="fileType_cost"
                               :iconShow="false"
                               :iconImg="iconImg"
                               :uploadIcon="true"
                               @setAnnex="setAnnex" />
                    <div class="annexList"
                         style="70%">
                      <div v-for="(item, index) in addParmas.annexes"
                           :key="index">
                        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{item.annexName}}</span>
                        <span>
                          <i @click="downloadFile(item, index)"
                             class="iconfont icon-xiazaidaoru"></i>
                          <i @click="deleFile(item, index)"
                             class="iconfont icon-lajixiang"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer"
           style="padding-right:20px;">
        <span @click="save"
              class="subBtn">确 定</span>
        <span @click="closeFn"
              class="quxiao_btn">取 消</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import context from '@/service'
import aliUpload from '@/components/aliUpload.vue'
import potClienDtl from './components/potClienDtl'
import storeDetailis from '../../../project/housingList/components/storeDetailis'
import axios from 'axios'
import tenantDetails from '@/views/operationManagement/tenantInfo/components/tenantDetails.vue'
import contractsDetails from '@/views/contractManagement/contractsList/components/contractsDetails.vue'
import riskDetails from '@/views/operationManagement/tenantInfo/components/riskDetails'
export default {
  name: 'potlClients',
  props: ['homeReference'], // 是否被首页当子组件引用
  components: {
    storeDetailis,
    aliUpload,
    potClienDtl,
    tenantDetails,
    contractsDetails,
    riskDetails
  },
  data () {
    return {
      riskDetailsShow: false,
      riskTab: 0,
      fileType_cost: [],
      iconImg: 'icon-shangchuanfujianicon',
      storeDetailisData: {
        imgUrls: [],
        projectManagement: {
          projectName: ''
        },
        building: {},
        floor: {}
      },
      storeDetailisShow: false,
      isAllYXtenant: false,
      activeNames: ['1'],
      sort: 'sort=lastModifiedDate,desc',
      projectManagemenId: '', // 此条记录的项目Id
      followRecordDTOParams: {// 新增跟进记录入参
        annexes: [],
        followContent: '',
        followTime: '',
        price: '', // 心理价位
        priceUnit: 'M2DAYS', // 价格单位
        leaseYear: '', // 租赁年限
        increment: '', // 递增
        rooms: [],
        yxTenantDTO: ''
      },
      addProgressFrom: false, // 新增更近记录
      seachParams: {
        name: '',
        projectManagement: '',
        industryId: '',
        contact: '',
        using: true
      },
      industryObj: {}, // 业态选中返回的obj
      customerSourceObj: {}, // 意向客户来源选中返回的obj
      addParmas: {
        tenantUse: 'SHOP',
        projectManagementDTO: {}, // 项目ID
        customerType: 'COMPANY', // 意向客户类型*
        yxTenantName: '', // 企业名称/姓名
        referred: '', // 品牌名称
        industryId: '', // 行业ID
        industryName: '', // 行业名
        lowArea: '', // 需求面积小
        highArea: '',
        lowPrice: '', // 心理价位小
        highPrice: '',
        priceUnit: 'M2DAYS', // 价格单位
        signDate: '', // 预计开店时间
        contact: '', // 联系人
        telephone: '', // 联系电话
        customerSource: '', // 客户来源
        customerSourceId: '', // 客户来源id
        remark: '', // 客户备注
        annexes: [ // 附件
        ],
        projectConditions: [ // 工程条件   projectType工程类型 (KWH用电量, SWWER排污水, WASTE_WATER排废水, FEED_WATER给水, AIR_CONDITION空调, OIL_DIAIN排油, FLUE烟道, CAS燃气)
          // {projectType: '', needValue: ''}
        ]
      },
      TenantDTORules: {
        projectManagementDTO: [
          { required: true, message: '请选择所在项目', trigger: 'change' }
        ],
        yxTenantName: [
          { required: true, message: '请输入企业名称', trigger: 'change' }
        ],
        referred: [
          { required: true, message: '请输入品牌名称', trigger: 'change' }
        ],
        industryId: [
          { required: true, message: '请选择业态', trigger: 'change' }
        ],
        lowArea: [
          { required: true, message: '请填写需求面积', trigger: 'change' }
        ],
        highArea: [
          { required: true, message: '请填写需求面积', trigger: 'change' }
        ],
        lowPrice: [
          { required: true, message: '请填写心理价位', trigger: 'change' }
        ],
        highPrice: [
          { required: true, message: '请填写心理价位', trigger: 'change' }
        ],
        contact: [
          { required: true, message: '请填写联系人', trigger: 'change' }
        ],
        telephone: [
          { required: true, message: '请输入正确的手机号或固定电话', trigger: 'change' }
        ],
        tenantUse: [
          { required: true, message: '请选择用途', trigger: 'change' }
        ]
      },
      tenantUseList: [
        {
          label: '商铺',
          value: 'SHOP'
        },
        {
          label: '办公',
          value: 'WORK'
        },
        {
          label: '菜场',
          value: 'MARKET'
        }
      ],
      addProgressRules: {
        followTime: [
          { required: true, message: '请填写跟进时间', trigger: 'change' }
        ],
        followContent: [
          { required: true, message: '请填写跟进记录', trigger: 'change' }
        ]
      },
      yxkhFrom: [], // 客户来源遍历
      checkList: [],
      activeName: 1,
      building: { // 房源房源信息

      },
      yearsList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      yearsListId: '',
      project: [], // 工程条件列表
      options3: [
        { label: '元/m²·天', value: 'M2DAYS' },
        { label: '元/月', value: 'M2MONTH' },
        { label: '元/年', value: 'YEAR' }
      ],
      industryList: [],
      industryListId: '',
      dealOddsList: [
        { label: '无意向客户', value: 'ZERO', num: 0 },
        { label: '招商跟进中', value: 'FIFTY', num: 0 },
        { label: '签约审批中', value: 'NINETY', num: 0 }
      ],
      dealOddsIndex: 1,
      dealOdds: 'FIFTY',
      projectManagementId: '',
      options2: [],
      projectList: [], // 项目列表
      industryOptions: [], // 行业列表
      pageType: 'add',
      detailsShow: false, // 侧边弹窗
      dialogFormVisible: false,
      tableData: [],
      currentPage: 1,
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
      ],
      detaileData: {
        projectManagementDTO: {}
      },
      documentTypeOptions: [],
      nationalityOptions: [],
      uesrName: [],
      timeLineListData: '', // 时间轴数据,
      yxTenantDTOStorage: '', // 意向客户信息
      switchTurn: false,
      selectSpan: [],
      organizationShow: false,
      filterText: '',
      orgListCopy: [],
      checkedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tenantDetailsShow: false,
      centerDialogVisible: false,
      contractsDetailsShow: false,
      tenantDetailData: {},
      contractsDetailData: {},
      withdrawalData: {},
      industryIdArr: [],
      industry1options: [],
      usingOptions: [{
        value: true,
        label: '使用中'
      }, {
        value: false,
        label: '已停用'
      }]
    }
  },
  watch: {
    filterText (val) {
      this.$refs.treeForm.filter(val)
    }
  },
  created () {
    // 工作台跳转
    let projectId = this.$route.params.projectId
    if (projectId) {
      this.seachParams.projectManagement = projectId
    }
    this.industry1()
    this.documentType()// 国籍
    this.nationality()// 证件类型
    this.getProjectList()
    // this.customerSource()// 客户来源
    this.uesrName = this.$store.state.usersList
    this.options2 = this.$store.state.projectManagementsList
    this.industry(this.addParmas.tenantUse)
    if (this.homeReference) {
      this.getPotlClientsListNew()
    } else {
      this.getPotlClientsList()
    }
  },
  methods: {
    riskDetailsClose () {
      this.riskDetailsShow = false
    },
    riskDetailsShowFn (i) {
      this.riskTab = i
      this.riskDetailsShow = true
    },
    queryExportResult (id, flag) { // flag  true代表经营数据 false税收数据
      this.flag = flag
      console.log(id)
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
    handleChange (arr) {
      this.seachParams.industryId = arr[1]
      console.log(arr)
    },
    async industry1 () {
      let result1 = await context.http.get('/uaa/api/paramet-managements/name?name=业态')
      let result2 = await context.http.get('/uaa/api/paramet-managements/name?name=行业')
      let result3 = await context.http.get('/uaa/api/paramet-managements/name?name=菜场业态')
      let obj1 = {
        value: 'SHOP',
        label: '商铺',
        children: []
      }
      obj1.children = result1.data.map((item, index) => {
        return { value: item.id, label: item.value }
      })
      let obj2 = {
        value: 'WORK',
        label: '办公',
        children: []
      }
      obj2.children = result2.data.map((item, index) => {
        return { value: item.id, label: item.value }
      })
      let obj3 = {
        value: 'MARKET',
        label: '菜场',
        children: []
      }
      obj3.children = result3.data.map((item, index) => {
        return { value: item.id, label: item.value }
      })
      this.industry1options.push(obj1, obj2, obj3)
    },
    async industry (tenantUse) {
      let name = ''
      if (tenantUse === 'SHOP') {
        name = '业态'
      } else if (tenantUse === 'WORK') {
        name = '行业'
      } else {
        name = '菜场业态'
      }
      let result = await context.http.get(`/uaa/api/paramet-managements/name?name=${name}`)
      this.addParmas.industryId = ''
      this.addParmas.industryName = ''
      // this.industryObj.id = ''
      // this.industryObj.value = ''
      this.industryList = result.data
    },
    setAnnex (annexURL, annexName) {
      this.addParmas.annexes.push({
        'annexName': annexName,
        'annexURL': annexURL
      })
    },
    shopDetails (roomId) {
      this.roomsRowId = roomId
      context.http.get('/cms/api/rooms/' + roomId).then(res => {
        if (res.status === 200) {
          this.storeDetailisData = res.data
          this.storeDetailisShow = true
          this.detailsShow = false // 关闭意向客户详情弹窗
        }
      })
    },
    storeDetailisHide () {
      this.detailsShow = true
      this.storeDetailisShow = false
    },
    addProgressClose () {
      this.filterText = ''
      this.addProgressFrom = false
    },
    closeFn () {
      this.dialogFormVisible = false
    },
    addProgressFromClose () {
      this.followRecordDTOParams = {// 新增跟进记录入参
        annexes: [],
        followContent: '',
        followTime: '',
        price: '', // 心理价位
        priceUnit: 'M2DAYS', // 价格单位
        leaseYear: '', // 租赁年限
        increment: '', // 递增
        rooms: [],
        yxTenantDTO: ''
      }
      this.followRecordDTOParams.yxTenantDTO = this.yxTenantDTOStorage
    },
    sortChange (column, prop, order) {
      if (column.prop === 'projectManagementDTO.projectName') {
        if (this.sort !== 'sort=projectManagement') {
          this.sort = 'sort=projectManagement'
        } else {
          this.sort = 'sort=lastModifiedDate,desc'
        }
      } else {
        if (this.sort !== 'sort=industryName') {
          this.sort = 'sort=industryName'
        } else {
          this.sort = 'sort=lastModifiedDate,desc'
        }
      }
      this.getPotlClientsList()
    },
    autoChange () {
      if (this.addParmas.customerType === 'PERSONAL') {
        this.addParmas.contact = this.addParmas.yxTenantName
      }
    },
    customerSourceChange () { // 改变意向客户来源
      // console.log(this.customerSourceObj)
      this.addParmas.customerSourceId = this.customerSourceObj.id
      this.addParmas.customerSource = this.customerSourceObj.value
    },
    industryChange () { // 改变业态
      // console.log(this.industryObj)
      this.addParmas.industryId = this.industryObj.id
      this.addParmas.industryName = this.industryObj.value
    },
    radioChange () {
      console.log(this.addParmas.customerType)
    },
    switchover () { // 平面图切换
      this.$router.push({ name: 'potlClientsList' })
    },
    changeHandler (value, item, index) {
      if (!value) {
        this.$set(this.project[index], 'needValue', null)
        this.$set(this.project[index], 'isChecked', false)
      } else {
        this.$set(this.project[index], 'needValue', '')
        this.$set(this.project[index], 'isChecked', true)
      }
      this.$forceUpdate()
    },
    getProjectList () { // 获取工程条件列表
      context.http.get('uaa/api/paramet-managements/name?name=工程条件').then(res => {
        this.project = res.data
        for (let i = 0; i < this.project.length; i++) {
          this.$set(this.project[i], 'isChecked', false)
          this.$set(this.project[i], 'needValue', null)
        }
        // console.log(this.project)
      }).catch(error => {
        console.info(error)
      })
    },
    getProjectConditions () { // 便利工程条件格式
      let project = this.project
      this.addParmas.projectConditions = []
      for (let i = 0; i < project.length; i++) {
        // if (project[i].value !== '') {
        if (project[i].isChecked) {
          this.addParmas.projectConditions.push({
            projectType: project[i].id,
            needValue: project[i].needValue
          })
        }
      }
      // console.log(this.addParmas.projectConditions)
    },
    save () { // 新增提交
      // this.getProjectConditions()// 便利工程条件格式
      if (!this.addParmas.projectManagementDTO.id) {
        this.$message({
          type: 'error',
          message: '项目不能为空'
        })
        return
      }
      this.addParmas.using = true
      context.http.post('cms/api/yxTenant', this.addParmas).then(res => {
        this.getPotlClientsList()
        this.$message({
          type: 'success',
          message: '新增成功',
          center: true
        })
        this.dialogFormVisible = false
      })
    },
    deleFile (item, index, type) {
      this.addParmas.annexes.splice(index, 1)
    },
    downloadFile (item, index) {
      axios({
        method: 'GET',
        url: '/ywm/api/annex/download',
        params: {
          annexURL: item.annexURL,
          annexName: item.annexName
        },
        responseType: 'blob'
      }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', item.annexName)
        document.body.appendChild(link)
        link.click()
      })
    },
    dealOddsFormat (row, column) { //
      switch (row.dealOdds) {
        case 'ZERO':
          return '无意向'
        case 'FIFTY':
          return '招商跟进中'
        case 'NINETY':
          return '签约审批中'
        case 'HUNDRED':
          return '合同执行中'
        default:
          return '-'
      }
    },
    stateFormat (row, column) {
      return row.using ? '使用中' : '已停用'
    },
    customerTypeFormat (row, column) {
      if (row.customerType === 'PERSONAL') {
        return '个人'
      } else if (row.customerType === 'COMPANY') {
        return '企业'
      }
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    switchDealOdds (item, index) {
      this.dealOddsIndex = index
      this.dealOdds = item.value
      if (this.homeReference) {
        this.getPotlClientsListNew()
      } else {
        this.getPotlClientsList()
      }
    },
    projectChanged () {
      if (this.homeReference) {
        this.getPotlClientsListNew()
      } else {
        this.getPotlClientsList()
      }
    },
    getProject (arr1, arr2) { // 子组件获取项目 、行业列表
      this.projectList = arr1
      this.industryOptions = arr2
    },
    pageTypeChange () {
      this.pageType = 'add'
    },
    toDetails (index, row, type) { // 查看
      if (type === 'autoOpen') {
        this.isAllYXtenant = true
      } else {
        this.isAllYXtenant = false
      }
      context.http.get(`cms/api/yxTenant/${row.id}`).then(res => {
        if (res) {
          this.followRecordDTOParams.yxTenantDTO = row
          this.yxTenantDTOStorage = row
          if (row.projectManagementDTO) {
            this.projectManagemenId = row.projectManagementDTO.id // 此条记录的项目id
          }
          this.pageType = 'readOnly'
          this.detaileData = res.data
          context.http.get(`cms/api/followRecords/${row.id}`).then(result => {
            this.timeLineListData = result.data
            this.detailsShow = true
          })
        }
      })
    },
    addFlowListSuccess (data) { // 新增跟进成功 参数为跟进信息
      this.getPotlClientsList()
      this.timeLineListData = data
    },
    refreshList (data) {
      this.getPotlClientsList()
      context.http.get(`cms/api/yxTenant/${this.yxTenantDTOStorage.id}`).then(res => {
        if (res) {
          this.followRecordDTOParams.yxTenantDTO = data
          this.yxTenantDTOStorage = data
          if (data.projectManagementDTO) {
            this.projectManagemenId = data.projectManagementDTO.id // 此条记录的项目id
          }
          this.pageType = 'readOnly'
          this.detaileData = res.data
          context.http.get(`cms/api/followRecords/${this.yxTenantDTOStorage.id}`).then(result => {
            this.timeLineListData = result.data
            this.detailsShow = true
          })
        }
      })
    },
    dtlAddSuccess () { // 新增成功
      if (this.homeReference) {
        this.getPotlClientsListNew()
      } else {
        this.getPotlClientsList()
      }
    },
    toAddPotlClients () { // 新增意向客户
      this.addParmas = {
        tenantUse: 'SHOP',
        projectManagementDTO: {}, // 项目ID
        customerType: 'COMPANY', // 意向客户类型*
        yxTenantName: '', // 企业名称/姓名
        referred: '', // 品牌名称
        industryId: '', // 行业ID
        industryName: '', // 行业名
        lowArea: '', // 需求面积小
        highArea: '',
        lowPrice: '', // 心理价位小
        highPrice: '',
        priceUnit: 'M2DAYS', // 价格单位
        signDate: '', // 预计开店时间
        contact: '', // 联系人
        telephone: '', // 联系电话
        customerSource: '', // 客户来源
        customerSourceId: '', // 客户来源id
        remark: '', // 客户备注
        annexes: [ // 附件
        ]
        // projectConditions: [ // 工程条件   projectType工程类型 (KWH用电量, SWWER排污水, WASTE_WATER排废水, FEED_WATER给水, AIR_CONDITION空调, OIL_DIAIN排油, FLUE烟道, CAS燃气)
        //   // {projectType: '', needValue: ''}
        // ]
      }
      this.industryObj.id = ''
      this.industryObj.value = ''
      this.customerSourceObj.id = ''
      this.customerSourceObj.value = ''
      this.industry(this.addParmas.tenantUse) // 行业列表被置空   从新请求
      this.customerSource()// 客户来源
      this.getProjectList()// 请求工程条件列表
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addParmas'].resetFields()
      })
    },
    // async industry () {
    //   let result = await context.http.get('/uaa/api/paramet-managements/name?name=行业')
    //   this.industryList = result.data
    // },
    async getPotlClientsList () { // 获取意向客户列表
      let result = await context.http.get(`cms/api/yxTenant/pool?${this.sort}`, {
        name: this.seachParams.name,
        projectManagement: this.seachParams.projectManagement,
        industryId: this.seachParams.industryId,
        contact: this.seachParams.contact,
        using: this.seachParams.using,
        page: (this.currentPage - 1),
        size: this.pgSize })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      // 以下代码 处理  从房源平面图调过来的逻辑处理
      let row = this.$route.params.row
      let pageFrom = this.$route.params.pageFrom
      if (pageFrom === 'industryCAD') { // 如果从指定页面进入自动打开详情页
        this.$route.params.pageFrom = null
        this.projectManagemenId = row.projectManagemenId
        // let yxTenantId = row.id
        // let yxTenantDTO = null
        // for (let i = 0; i < this.tableData.length; i++) {
        //   if (yxTenantId === this.tableData[i].id) {
        //     yxTenantDTO = this.tableData[i]
        //   }
        // }
        // this.toDetails('', yxTenantDTO, 'autoOpen')
        this.toDetails('', row, 'autoOpen')
      }
    },
    async getPotlClientsListNew () {
      let result = await context.http.get('cms/api/yxTenant/statistics', { projectManagementId: this.projectManagementId, dealOdds: this.dealOdds, page: (this.currentPage - 1), size: this.pgSize })
      this.tableData = result.data.yxTenantDTOS.content
      this.total = Number(result.headers['x-total-count'])
      this.dealOddsList[0].num = result.data.zero
      this.dealOddsList[1].num = result.data.fifty
      this.dealOddsList[2].num = result.data.hundred
    },
    lowAreaAndHighArea (row, column) {
      if (row.lowArea && row.highArea) {
        return row.lowArea + ' ~ ' + row.highArea + 'm²'
      } else {
        return '-'
      }
    },
    lowPriceAndHighPrice (row, column) {
      let priceUnit = ''
      if (row.priceUnit === 'M2DAYS') {
        priceUnit = '元/m²·天'
      } else if (row.priceUnit === 'MONTH') {
        priceUnit = '元/月'
      } else if (row.priceUnit === 'YEAR') {
        priceUnit = '元/年'
      }
      if (row.lowArea && row.highPrice) {
        return row.lowPrice + ' ~ ' + row.highPrice + priceUnit
      } else {
        return '-'
      }
    },
    contactFormat (row, column) {
      return `${row.contact}/${row.telephone}`
    },
    pgSizeSelectFn () { // 切换显示条数
      this.currentPage = 1
      if (this.homeReference) {
        this.getPotlClientsListNew()
      } else {
        this.getPotlClientsList()
      }
    },
    current_change (currentPage) { // 切换页码
      this.currentPage = currentPage
      if (this.homeReference) {
        this.getPotlClientsListNew()
      } else {
        this.getPotlClientsList()
      }
    },
    detailsClose () {
      this.detailsShow = false
    },
    async documentType () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=证件类型')
      this.documentTypeOptions = result.data
    },
    async nationality () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=国籍')
      this.nationalityOptions = result.data
    },
    async customerSource () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=客户来源')
      this.yxkhFrom = result.data
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
      this.selectSpan = selectSpan
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
        // context.http.get('/cms/api/rooms/' + this.roomsRowId).then(res => {
        //   if (res.status === 200) {
        //     this.storeDetailisData = res.data
        //     this.storeDetailisShow = true
        //   }
        // })
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
    exportBill () {
      axios({
        method: 'GET',
        url: `/cms/api/yxTenant/download?${this.sort}`,
        params: { name: this.seachParams.name, projectManagement: this.seachParams.projectManagement, industryId: this.seachParams.industryId, contact: this.seachParams.contact, page: (this.currentPage - 1), size: this.pgSize },
        responseType: 'blob'
      }).then(res => {
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
  }
}
</script>
<style lang="scss">
.index_chaxun_btn {
  width: 110px;
  height: 32px;
  display: inline-block;
  line-height: 32px;
  text-align: center;
  font-size: 14px;
  color: #fff;
  background-color: #3577f6;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
}
.details_chaxun_btn {
  width: 70px;
  height: 32px;
  display: inline-block;
  line-height: 32px;
  text-align: center;
  font-size: 14px;
  color: #fff;
  background-color: #3577f6;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
}
.potlClients {
  .caret-wrapper {
    margin-left: 5px;
    display: inline-block;
    width: 19px !important;
    height: 15px !important;
    background-image: url(../../../../assets/sortIcon.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .sort-caret.ascending {
      border-bottom-color: transparent !important;
      border-top-color: transparent !important;
    }
    .sort-caret.descending {
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
    }
    .el-icon-arrow-down {
      display: inline-block;
      width: 19px;
      height: 15px;
      background-image: url(../../../../assets/sortIcon.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
  .addProgressFrom {
    .form1 {
      > .content {
        width: 730px;
        min-height: 850px;
        margin: 20px auto;
        .item {
          display: flex;
          flex-direction: column;
          margin-bottom: 15px;
          > span {
            margin-bottom: 10px;
            > i {
              color: #ff0000;
              font-style: normal;
            }
          }
          .storeInfo {
            min-height: 560px;
            border: 1px solid #eeeeee;
            .title {
              height: 50px;
              line-height: 50px;
              padding: 0 15px;
              background-color: #fafafa;
              display: block;
            }
            .content {
              padding: 10px;
              display: flex;
              justify-content: space-between;
              .project {
                width: 300px;
                height: 500px;
                border: 1px solid #eeeeee;
                padding: 15px;
                overflow-y: scroll;
                .collapse {
                  margin-top: 20px;
                  .el-collapse-item__header {
                    background-color: #fafafa;
                    padding-left: 15px;
                    height: 40px;
                    line-height: 40px;
                  }
                  .el-collapse-item__wrap {
                    padding-left: 25px;
                    .el-checkbox {
                      width: 100%;
                      margin-right: 0;
                      margin-bottom: 5px;
                    }
                  }
                }
              }
              .offer {
                width: 400px;
                height: 500px;
                padding-left: 20px;
                > .item {
                  display: flex;
                  flex-direction: column;
                  margin-bottom: 15px;
                  > div {
                    display: flex;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .addClientsDialog {
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
        height: 750px;
        overflow: auto;
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
          box-shadow: inset 0 0 6px #cccccc;
        }
      }
      .el-dialog__footer {
        padding: 0;
        background-color: #ffffff;
        margin-top: 15px;
        .dialog-footer {
          height: 56px;
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
      .addComtent {
        background-color: #ffffff;
        width: 100%;
        .annexList {
          width: 80%;
          // margin-left: 15px;
          > div {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            border-bottom: 1px solid #eaeaea;
            padding-bottom: 5px;
            i {
              cursor: pointer;
            }
          }
        }
        .deviceDetails {
          width: 100px;
          height: 100px;
          margin-right: 15px !important;
          .oss_file {
            width: 100%;
            height: 100%;
            border: none;
            background-color: rgba(247, 249, 253, 1);
            border: 1px solid rgba(234, 234, 234, 1);
            border-radius: 4px;
            color: #3575f6;
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
        .title {
          height: 45px;
          line-height: 45px;
          font-size: 16px;
          color: #262626;
          background-color: #ffffff;
          padding-left: 15px;
          font-weight: bold;
          border-bottom: 1px solid #f6f6f6;
          display: flex;
          align-items: center;
          > i {
            display: inline-block;
            width: 4px;
            height: 16px;
            background: rgba(53, 117, 246, 1);
            border-radius: 2px;
            margin-right: 8px;
          }
        }
        .contentDtl {
          padding: 15px;
          .item {
            display: flex;
            width: 100%;
            justify-content: space-between;
            > div {
              width: 48%;
              display: flex;
              flex-direction: column;
              margin-bottom: 22px;
              &.inputNoborder {
                .el-input--small {
                  .el-input__inner {
                    border: none !important;
                  }
                }
                .priceSelect {
                  background: #f5f7fa;
                  .el-input--small {
                    background: #f5f7fa;
                    .el-input__inner {
                      background: #f5f7fa;
                      border-top-left-radius: 0;
                      border-bottom-left-radius: 0;
                      border-left: 1px solid #dcdfe6 !important;
                    }
                  }
                }
              }
              > span {
                margin-bottom: 5px;
                font-size: 14px;
                color: #777777;
                > i {
                  color: #ff0000;
                  font-style: normal;
                }
              }
            }
          }
        }
        .addStep2 {
          display: flex;
          flex-direction: column;
          > .item {
            display: flex;
            padding-left: 130px;
            margin-right: 0;
            height: 50px;
            line-height: 50px;
          }
        }
        .el-form-item {
          margin-bottom: 0px;
        }
      }
    }
  }
  .addbtn1 {
    float: right !important;
    width: 165px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    color: #fff;
    background-color: #65ac69;
    border-radius: 4px;
    cursor: pointer;
  }
  .dealOddsBar {
    border: 1px solid #eeeeee;
    height: 57px;
    .dealOddsBtn {
      cursor: pointer;
      display: inline-block;
      width: 190px;
      height: 55px;
      line-height: 55px;
      text-align: center;
      &.active {
        color: #0f75ff;
        border-bottom: 2px solid #0f75ff;
      }
    }
  }
  .form {
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 20%;
      margin-right: 30px;
      .label {
        height: 40px;
        line-height: 40px;
      }
    }
    .tenantTips {
      width: 100%;
      margin-top: 20px;
      min-height: 150px;
      border: 1px solid #eeeeee;
    }
    .businessInfo {
      width: 100%;
      margin-top: 20px;
      min-height: 150px;
      border: 1px solid #eeeeee;
      display: flex;
      flex-wrap: wrap;
      .title {
        i {
          font-size: 12px;
          color: #0f75ff;
          font-weight: 100;
          cursor: pointer;
          padding-left: 10px;
        }
      }
    }
    .taxInfo {
      width: 100%;
      margin-top: 20px;
      min-height: 150px;
      border: 1px solid #eeeeee;
      display: flex;
      flex-wrap: wrap;
    }
  }
  .search-bar {
    .item {
      display: flex;
      align-items: center;
      > div {
        display: flex;
        flex-direction: column;
      }
      .addBtn {
        float: right !important;
        width: 130px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        font-size: 14px;
        color: #fff;
        background-color: #65ac69;
        border-radius: 4px;
        cursor: pointer;
      }
      .seachBtn {
        width: 110px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        font-size: 14px;
        color: #fff;
        background-color: #3577f6;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }
  > .content {
    background-color: #ffffff;
  }
}
.ctc-foot {
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  padding: 60px 0 30px 20px;
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #2f3f48;
    color: #fff;
  }
  .el-pagination.is-background .el-pager li:not(.disabled):hover {
    color: #999;
  }
  .el-col-18 {
    padding: 0 30px;
  }
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
.flex {
  display: flex;
  justify-content: space-between;
}
.enclosure {
  margin-bottom: 20px;
  .enclosure-head {
    height: 40px;
    line-height: 40px;
    span {
      display: inline-block;
      width: 48%;
      padding-left: 40px;
    }
    .upload {
      position: relative;
      float: right;
      display: inline-block;
      width: 80px !important;
      height: 24px;
      line-height: 23px;
      opacity: 0.9;
      border-radius: 2px;
      font-size: 12px;
      text-align: center;
      border: 1px solid rgba(15, 117, 255, 1);
      color: rgba(15, 117, 255, 1);
      border-radius: 4px;
      margin: 8px;
      cursor: pointer;
      input {
        position: absolute;
        right: 0;
        width: 80px !important;
        height: 24px;
        opacity: 0;
        cursor: pointer;
      }
    }
  }
  .el-item {
    height: 30px;
    line-height: 30px;
    span {
      display: inline-block;
      width: 48%;
      padding-left: 40px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
.menu {
  height: 62px;
  line-height: 62px;
  border-bottom: 1px solid #eeeeee;
  margin-top: 15px;
  margin-bottom: 20px;
  background-color: #ffffff;
  // padding-left: 20px;
  span {
    display: inline-block;
    width: 200px;
    height: 62px;
    text-align: center;
    cursor: pointer;
    &.active {
      border-bottom: 3px solid #3577f6;
      color: #3577f6;
    }
  }
}
</style>
