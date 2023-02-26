<template>
  <div :class="[hourseList === 'on' ? 'contract paddingLeft' : 'contract', hourseList === 'off' ? 'contract paddingRight' : 'contract']">
    <span class="page_head_title">合同列表</span>
    <div class="intention_container">
      <div class="">
        <div class="search-bar">
          <div>
            <el-select clearable
                       v-model="projectId"
                       placeholder="项目"
                       @change='getBuliding'>
              <el-option v-for="item in projectOptions"
                         :key="item.id"
                         :label="item.referred"
                         :value="item.id">
              </el-option>
            </el-select>
            <el-select clearable
                       v-model="buildingName"
                       placeholder="楼宇">
              <el-option v-for="item in options1"
                         :key="item.id"
                         :label="item.buildingName"
                         :value="item.id">
              </el-option>
            </el-select>
            <el-input v-model="queryContract"
                      placeholder="合同编号"></el-input>
            <el-input v-model="tenantName"
                      placeholder="客户名称/品牌名称"></el-input>
            <el-date-picker style="width:150px!important;"
                            clearable
                            v-model="dateContract"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="合同到期日">
            </el-date-picker>
            <el-select clearable
                       multiple
                       collapse-tags
                       v-model="contractStatus"
                       placeholder="合同状态(多选)">
              <el-option v-for="item in options2"
                         :key="item.value"
                         :label="item.text"
                         :value="item.value">
              </el-option>
            </el-select>
            <span @click="search"
                  class="query-btn">查询</span>
          </div>
          <div style="">
            <div>
              <el-button class="tban tban1"
                         v-if="hasAuthority('02020502')"
                         @click="addHoursing"><i class="iconfont icon-crm_xinzeng-"></i> 新增合同</el-button>

              <el-button class="tban tban6"
                         v-if="hasAuthority('02020512')"
                         @click="exportBill()"><i class="iconfont icon-cms_daochushuju-"></i> 导出</el-button>
              <el-button class="tban tban3"
                         v-if="hasAuthority('02020502')"
                         @click="configureOpen"><i class="iconfont icon-bianji-"></i> 合同配置</el-button>
            </div>
            <!-- <div @click="addbill"
               class="batchbtn"
               v-if="hasAuthority('02020506')"><i class="iconfont icon-piliangsc"></i>批量生成账单</div> -->
          </div>
        </div>
        <div v-if="buildsList.length"
             class="search-bottom">
          <dl>
            <dt>选择楼宇：</dt>
            <dd v-for="(item, index) in buildsList"
                :key="index"><span>{{item.buildingName}}</span><span @click="deleBuild(index)"
                    class="iconfont icon-jinakangbaoicons18"></span></dd>
          </dl>
        </div>
      </div>
      <div class="hourse-table">
        <div class="table">
          <el-table :data="tableData"
                    style="width: 100%">
            <el-table-column prop="contractNo"
                             label="合同编号"
                             width="110px;"
                             align="center"></el-table-column>
            <!-- <el-table-column prop="name" label="合同名称" width="110px;" align="center"></el-table-column> -->
            <el-table-column prop="contractStatus"
                             label="合同状态"
                             width="120px;"
                             align="center"
                             :formatter="formatterStatus"></el-table-column>
            <el-table-column prop="address"
                             label="地址"
                             width="300px;"
                             align="center">
            </el-table-column>
            <el-table-column prop="shopNo"
                             label="房源号"
                             width="200px;"
                             align="center">
              <template slot-scope="scope">
                {{toStringShop(scope.row.shopNo)}}
              </template>
            </el-table-column>
            <el-table-column prop="tenantName"
                             label="客户名称"
                             align="center"></el-table-column>
            <el-table-column prop="referred"
                             label="品牌"
                             align="center"></el-table-column>
            <el-table-column label="合同起止日"
                             align="center">
              <template slot-scope="scope">
                {{scope.row.startDate}}~{{scope.row.endDate}}
              </template>
            </el-table-column>
            <el-table-column prop="area"
                             label="租赁面积 m²"
                             align="center"></el-table-column>
            <!-- <el-table-column prop="cPrice"
                             label="初始单价 元/㎡天"
                             align="center"
                             width="140px;">
              <template slot-scope="scope">
                {{scope.row.cPrice | toLocaleString}}
              </template>
            </el-table-column>
            <el-table-column prop="sPrice"
                             label="实时单价 元/㎡天"
                             width="140px;"
                             align="center">
              <template slot-scope="scope">
                {{scope.row.sPrice | toLocaleString}}
              </template>
            </el-table-column>
            <el-table-column prop="name"
                             label="跟进人"
                             width="80px;"
                             align="center"></el-table-column> -->
            <el-table-column label="操作"
                             v-if="hasAuthority('02020503')"
                             align="center">
              <template slot-scope="scope">
                <el-button @click="handleEdit(scope.$index, scope.row)"
                           class="el-button--primary operation-btn"
                           size="mini">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="ctc-foot1"
             style="padding-right:15px;">
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
    <!-- 新增合同 -->
    <el-dialog class="addintentionContracts"
               :title="addDialogTitle"
               :visible.sync="addVisible"
               :show-close="true"
               :before-close="handleClose"
               :close-on-press-escape="false"
               :close-on-click-modal="false">
      <addContracts :projectList='projectList'
                    :contractState="contractState"
                    :detailData="detailDataIC"
                    :intentionToFormalize="intention"
                    :approvalReject="approval"
                    :queryObj="queryObj"
                    v-if="addVisible"
                    @resetParameters="resetParameters"
                    @addDialogClose="addDialogClose"
                    @query="query"
                    ref="addContracts" />
    </el-dialog>

    <el-dialog title="根据合同批量生成账单"
               width="800px"
               :visible.sync="billDialogVisible"
               class="batch-production">
      <div class="query-wrap">
        <el-select v-model="projectManagementId"
                   placeholder="项目">
          <el-option v-for="item in projectOptions"
                     :key="item.id"
                     :label="item.referred"
                     :value="item.id">
          </el-option>
        </el-select>
        <div class="query-btn"
             @click="queryContractList">查询</div>
      </div>
      <el-table ref="multipleTable"
                :data="billTableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column label="项目简称"
                         width="120">
          <template slot-scope="scope">{{ scope.row.projectManagement.referred }}</template>
        </el-table-column>
        <el-table-column label="合同编号">
          <template slot-scope="scope">{{ scope.row.contractNo }}</template>
        </el-table-column>
        <el-table-column label="品牌简称"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.tenant.referred }}</template>
        </el-table-column>
        <el-table-column label="合同起止日"
                         width="200px;"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.startDate }} ~ {{ scope.row.endDate }}</template>
        </el-table-column>
        <el-table-column label="合同状态"
                         prop="contractStatus"
                         :formatter="formatterStatus"
                         show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <div class="page"
           style="margin-bottom: 10px;">
        <el-pagination v-if="billPager.total > 0"
                       background
                       layout="prev, pager, next"
                       :page-size=billPager.pgSize
                       :total="billPager.total"
                       :current-page="billPager.currentPage"
                       @current-change="bill_current_change">
        </el-pagination>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="billDialogVisible = false"
                   class="close-button">取 消</el-button>
        <el-button type="primary"
                   @click="generateBills()"
                   class="defaultbtn dialog-confirmBtn">生成账单</el-button>
      </div>
    </el-dialog>

    <el-dialog title="生成账单时间"
               :visible.sync="billTimeDialog"
               width="40%">
      <div class="bill-time-wrap">
        <el-date-picker v-model="billTime"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="billTimeDialog = false"
                   class="close-button">取 消</el-button>
        <el-button type="primary"
                   @click="confirmGenerate"
                   class="defaultbtn dialog-confirmBtn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 合同详情 -->
    <contractsDetails :detailsdrawershow="detailsShow"
                      :detailData="detailData"
                      :withdrawalData="withdrawalData"
                      ref="contractsDetails"
                      @openAddDialog="openAddDialog"
                      @drawerClose="detailsClose"
                      @handleEdit="handleEdit"
                      @showTenant="showTenant"
                      @query="query" />
    <!-- 客户详情 -->
    <tenantDetails :detailsdrawershow="tenantDetailsShow"
                   :tenantDetail="tenantDetailData"
                   ref="tenantDetails"
                   @riskDetailsShowFn="riskDetailsShowFn"
                   @queryExportResult="queryExportResult"
                   @affirmDialog="affirmDialog"
                   @drawerClose="tDetailsClose"
                   @query="handleEdit"
                   @handleEdit="getTenantDetails"
                   v-if="tenantDetailsShow" />
    <!-- 风险详情 -->
    <riskDetails :detailsdrawershow="riskDetailsShow"
                 :tenantDetail="tenantDetailData"
                 :riskTab="riskTab"
                 @drawerClose="riskDetailsClose" />
    <!-- 合同配置 -->
    <el-dialog title="合同配置"
               width="800px"
               :visible.sync="configureDialog"
               class="configure-dialog">
      <div class="content-wrapper">
        <div class="wrapper1">
          <div class="dr-head">
            <span>
              <span class="vertical"></span>企业信息
            </span>
            <span class="btn-warp">
              <span class="btn edit"
                    v-if="configureReadOnly"
                    @click="configureReadOnly = false">
                <i class="iconfont icon-edit1"
                   style="vertical-align: bottom;"></i>
                编辑
              </span>
              <span class="btn"
                    v-if="!configureReadOnly"
                    @click="configureReadOnly = true;getCorporateCustomers()">取消</span>
              <span class="btn save"
                    v-if="!configureReadOnly"
                    @click="configureBusSave">保存</span>
            </span>
          </div>
          <div class="query-wrap"
               style="padding-bottom: 20px">
            <div class="query-item">
              <div class="query-item-title">企业全称</div>
              <div>{{customersData.companyName}}</div>
            </div>
            <div class="query-item">
              <div class="query-item-title">公司银行账号<span class="required">*</span></div>
              <div v-if="configureReadOnly">{{customersData.bankAccount}}</div>
              <el-input v-model="customersData.bankAccount"
                        type="number"
                        v-else
                        maxlength="50"
                        placeholder="请输入公司银行账号"></el-input>
            </div>
            <div class="query-item">
              <div class="query-item-title">公司账号开户行<span class="required">*</span></div>
              <div v-if="configureReadOnly">{{customersData.bankOfDeposit}}</div>
              <el-input v-model="customersData.bankOfDeposit"
                        v-else
                        maxlength="100"
                        placeholder="请输入公司账号开户行"></el-input>
            </div>
          </div>
        </div>
        <div class="wrapper1">
          <div class="dr-head">
            <span>
              <span class="vertical"></span>模版信息
            </span>
            <span class="btn add"
                  @click="temDialogVisible = true;getBillNoticeKeyword('init')">
              <i class="iconfont icon-crm_xinzeng-"></i>
              新增模版
            </span>
          </div>
          <el-table :data="templateData"
                    tooltip-effect="dark"
                    height="500"
                    :key="templateKey"
                    style="width: 100%">
            <el-table-column label="模版名称"
                             align="center"
                             width="200">
              <template slot-scope="scope">
                <span v-if="scope.row.tdReadOnly">{{ scope.row.name }}</span>
                <span v-else>
                  <el-input v-model="scope.row.name"
                            size="small"
                            placeholder="请输入模版名称"></el-input>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="文件"
                             align="center">
              <template slot-scope="scope">
                <div style="display: flex;justify-content: center;">
                  <span style="padding-right: 10px">{{ scope.row.annexName }}</span>
                  <ailPreview :ailObj="scope.row"
                              :encrypt="true" />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="状态"
                             align="center"
                             width="100"
                             show-overflow-tooltip>
              <template slot-scope="scope">{{ useStatusFormat(scope.row.billNoticeStatus) }}</template>
            </el-table-column>
            <el-table-column label="操作"
                             align="center"
                             width="200px;"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="btn blue"
                      v-if="scope.row.tdReadOnly"
                      @click="tdReadOnlyEdit(scope.row, false)">编辑</span>
                <span class="btn grey"
                      v-if="!scope.row.tdReadOnly"
                      @click="tdReadOnlyEdit(scope.row, true)">取消</span>
                <span class="btn blue"
                      v-if="!scope.row.tdReadOnly"
                      @click="configureTemSave(scope.row)">保存</span>
                <span class="btn red"
                      @click="configureTemSave(scope.row, 'DISABLE')"
                      v-if="scope.row.tdReadOnly && scope.row.billNoticeStatus === 'USING'">停用</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="configureClose"
                   class="close-button">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 新增合同模版 -->
    <el-dialog title="新增合同模版"
               width="800px"
               :close-on-click-modal="false"
               :visible.sync="temDialogVisible"
               class="tem-dialog">
      <div class="tem-wrap">
        <div class="dr-head">
          <span>
            <span class="vertical"></span>基本信息
          </span>
        </div>
        <div class="tw-div">
          <span>模版名称<span class="required">*</span></span>
          <el-input v-model="tempName"
                    size="small"
                    maxlength="50"
                    style="width: 200px"></el-input>
        </div>
        <div class="tw-div">
          <span>模版文件<span class="required">*</span></span>
          <aliUpload class="aliUpload"
                     upLoadText="上传附件"
                     :fileType="fileType"
                     businessType='project'
                     :encrypt="true"
                     :iconShow="true"
                     @setAnnex="setAnnex" />
          <span class="tips">（上传仅支持doc、docx格式文件）</span>
        </div>
        <div class="enclosure-warp"
             v-if="enclosureList[0].annexName">
          <svg class="icon"
               v-if="enclosureList[0].annexName"
               aria-hidden="true">
            <use :xlink:href="getformat2(enclosureList[0].annexName)"></use>
          </svg>
          <span style="margin-left: 6px;">{{enclosureList[0].annexName}}</span>
          <ailPreview :ailObj="enclosureList[0]"
                      :encrypt="true" />
          <span>
            <i @click="deleteAnnex()"
               class="iconfont icon-lajixiang"
               style="margin-left:20px;cursor: pointer;"></i>
          </span>
        </div>
        <div class="keyword">
          <div>关键词复制</div>
          <div class="keywordCOntent keywordCOntent1">
            <input type="text"
                   id="copyInput"
                   class="copyInput">
            <span class="item"
                  @click="copyInputFn(item.name)"
                  v-for="(item,index) in copyList.auto"
                  :key="index">
              {{item.name}}
            </span>
          </div>
        </div>
        <div class="customKeyword">
          <div class="title">
            <span>自定义关键词</span>
          </div>
          <div class="customKeywordContent">
            <div class="newItem noBorder">
              <i class="icon-add iconfont"></i>
              <span>新增关键词</span>
              <span class="sep"></span>
              <el-input style="width:208px"
                        class="newKeyWord"
                        max-length="20"
                        size="small"
                        placeholder="请输入关键词"
                        v-model="newKeyWord"
                        onkeyup="this.value=this.value.replace(/^\s+|\s+$/g,'')"></el-input>
              <div @click="addKeyword"
                   class="addKeyword">添加</div>
            </div>
            <p style="font-size:12px;color:#999;">（文本类型:如‘${客户名称}’则输入‘客户名称’即可）</p>
            <p style="font-size:12px;color:#999;">（图片类型:如‘${image.营业执照}’则输入‘image.营业执照’即可）</p>
            <div class="keywordCOntent">
              <span class="item"
                    v-for="(item,index) in copyList.custom"
                    @click="copyInputFn(item.name)"
                    :key="index"><i class="iconfont icon-cms_cuowu"
                   @click.stop="delKeyword(item.id)"></i>{{item.name}}</span>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="temDialogVisible = false"
                   class="close-button">取 消</el-button>
        <el-button type="primary"
                   @click="saveTemplate()"
                   class="defaultbtn dialog-confirmBtn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import context from '@/service'
import aliUpload from '@/components/aliUpload.vue'
import ailPreview from '@/components/ailPreview.vue'
import contractsDetails from './components/contractsDetails'
import addContracts from './components/addContracts'
import projectSidebar from '@/components/projectSidebar'
import { toLocaleFixed, getformat } from '@/utils/validate.js'
import { setTimeout } from 'timers'
import tenantDetails from '../../operationManagement/tenantInfo/components/tenantDetails.vue'
import riskDetails from '../../operationManagement/tenantInfo/components/riskDetails.vue'
export default {
  name: 'contractsList',
  components: {
    projectSidebar,
    addContracts,
    contractsDetails,
    riskDetails,
    tenantDetails,
    aliUpload,
    ailPreview
  },
  data () {
    return {
      templateKey: 0,
      newKeyWord: null, // 新增自定义关键词
      copyList: [],
      temDialogVisible: false,
      tempName: '',
      enclosureList: [{
        annexName: '',
        annexURL: ''
      }],
      fileType: ['doc', 'docx'],
      templateData: [],
      customersData: {},
      configureReadOnly: true,
      configureDialog: false,
      riskDetailsShow: false,
      riskTab: 0,
      recordRow: {},
      tenantDetailsShow: false,
      tenantDetailData: {},
      queryObj: {
        projectId: '',
        tenantId: ''
      },
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
      billPager: {
        currentPage: 1,
        pgNum: 1,
        total: 0,
        pgSize: 15
      },
      addDialogTitle: '新增合同',
      billDialogVisible: false,
      billTimeDialog: false,
      billTime: '',
      tableData: [],
      billTableData: [],
      projectOptions: [],
      addVisible: false,
      hourseList: '',
      detailsShow: false,
      detailData: {
        onFileAnnexes: []
      },
      detailDataIC: {},
      projectList: [],
      queryContract: '',
      tenantName: '',
      buildsList: [],
      contractState: '',
      intention: '',
      approval: '',
      withdrawalData: {},
      projectManagementId: '',
      selectData: [],
      select_orderId: [],
      select_order_number: '',
      getRowKeys (row) {
        return row.id
      },
      multipleSelectionAll: [], // 所有选中的数据包含跨页数据
      multipleSelection: [], // 当前页选中的数据
      idKey: 'id', // 标识列表数据中每一行的唯一键的名称(需要按自己的数据改一下)
      dateContract: '',
      projectId: '', // 商圈
      buildingName: '', // 楼号
      contractStatus: ['STORAGE', 'PENDING', 'EXECUTING', 'ZH_APPROVAL', 'TZ_APPROVAL', 'WITHDRAWAL', 'XQ_APPROVAL', 'MATURITY'],
      options1: [],
      options2: [{ text: '暂存', value: 'STORAGE' }, { text: '待执行', value: 'PENDING' }, { text: '执行中', value: 'EXECUTING' },
      { text: '招商审核中', value: 'ZH_APPROVAL' }, { text: '退租审核中', value: 'TZ_APPROVAL' }, { text: '已退租', value: 'WITHDRAWAL' },
      { text: '续签审核中', value: 'XQ_APPROVAL' }, { text: '到期未处理', value: 'MATURITY' }]
    }
  },
  created () {
    if (localStorage.contractStatusList) {
      this.contractStatus = JSON.parse(localStorage.contractStatusList)
      console.log(this.contractStatus)
    }
    let pageFrom = this.$route.params.pageFrom
    let row = this.$route.params.row
    if (pageFrom === 'industryCAD') { // 如果从指定页面进入自动打开合同详情
      this.handleEdit('', row)
    }
    if (pageFrom === 'TenantInformation') {
      this.openAddDialog2()
    }
    this.getDataAuthorityOptions()

    // 客户信息页发起合同
    let projectObj = this.$route.query.project
    let tenantId = this.$route.query.tenant
    if (projectObj && tenantId) {
      this.queryObj.projectObj = projectObj
      this.queryObj.tenantId = tenantId
      this.addHoursing()
    }
  },
  mounted () {
    this.query(this.idsArray)
    let intention = this.$route.query.intention
    if (intention) {
      context.http.get(`/cms/api/yx-contracts/toBeContract/${intention}`).then(res => {
        this.detailDataIC = res.data
        // console.log('intentionData', this.detailData)
        this.intention = 'intentionToFormalize'
        this.addVisible = true
      })
    }
    // 工作台合同到期跳转
    let contractDetails = this.$route.query.contractIdForDetails
    if (contractDetails) {
      context.http.get(`/cms/api/contracts/${contractDetails}`).then(res => {
        this.detailData = res.data
        // this.detailDataIC = res.data
        this.detailsShow = true
      })
    }
    let contractId = this.$route.query.contractId
    let rejectedType = this.$route.query.type
    if (contractId && rejectedType === 'surrender') { // 合同退租驳回
      context.http.get(`/cms/api/lease-contracts/${contractId}`).then(res => {
        this.detailsShow = true
        this.detailData = res.data.contractDTO
        this.withdrawalData = res.data
        this.$refs.contractsDetails.contractWithdrawal('edit')
      })
    }
    if (contractId && rejectedType === 'contractSign') { // 合同签订驳回
      context.http.get(`/cms/api/contracts/${contractId}`).then(res => {
        if (res.status === 200) {
          this.approval = 'approvalReject'
          this.addVisible = true
          this.detailData = res.data
        }
      })
    }
  },
  methods: {
    getformat2 (str) {
      return getformat(str)
    },
    addKeyword () {
      if (!this.newKeyWord || this.newKeyWord === '' || this.newKeyWord === ' ') {
        this.$message({
          type: 'error',
          message: '请输入关键词'
        })
        return
      }
      let keywordAtribute = 'TEXT'
      if (this.newKeyWord.indexOf('image.') >= 0) {
        keywordAtribute = 'IMG'
      }
      console.log(this.newKeyWord, keywordAtribute)
      context.http.post('/cms/api/billNoticeKeyword', {
        name: '${' + this.newKeyWord + '}',
        keyWordType: 'CUSTOM',
        keywordBusinessType: 'CONTRACT',
        keywordAtribute: keywordAtribute
      }).then(res => {
        this.$message({
          type: 'success',
          message: '关键词新增成功'
        })
        this.newKeyWord = null
        this.getBillNoticeKeyword()
      })
    },
    delKeyword (id) {
      context.http.delete(`/cms/api/billNoticeKeyword/${id}`).then(res => {
        if (res.status === 200) {
          this.getBillNoticeKeyword()
        }
      })
    },
    saveTemplate () {
      if (!this.tempName) {
        this.$message.error('请输入模版名称')
        return
      }
      if (this.enclosureList.length === 0 || !this.enclosureList[0].annexName) {
        this.$message.error('请上传模版文件')
        return
      }
      context.http.post(`/cms/api/billNoticeTemp`, {
        name: this.tempName,
        annexName: this.enclosureList[0].annexName,
        annexURL: this.enclosureList[0].annexURL,
        billNoticeStatus: 'USING',
        keywordBusinessType: 'CONTRACT'
      }).then(res => {
        if (res.status === 201) {
          this.$message.success('新增成功')
          this.getBillNoticeTemp()
          this.temDialogVisible = false
          this.tempName = ''
          this.enclosureList = [{
            annexName: '',
            annexURL: ''
          }]
        }
      })
    },
    // 获取关键词
    getBillNoticeKeyword (type) {
      if (type) {
        this.tempName = ''
        this.enclosureList = [{
          annexName: '',
          annexURL: ''
        }]
      }
      context.http.get(`cms/api/billNoticeKeyword`, { keywordBusinessType: 'CONTRACT' }).then(res => {
        this.copyList = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    copyInputFn (text) {
      var input = document.getElementById('copyInput')
      input.value = text
      input.select()
      document.execCommand('copy')
      this.$notify({
        title: '成功',
        duration: 1000,
        message: '复制成功',
        type: 'success'
      })
    },
    deleteAnnex () {
      this.enclosureList = [{
        annexName: '',
        annexURL: ''
      }]
    },
    configureOpen () {
      this.getCorporateCustomers()
      this.getBillNoticeTemp()
      this.configureDialog = true
      this.configureReadOnly = true
    },
    configureClose () {
      this.configureDialog = false
    },
    configureBusSave () {
      if (!this.customersData.bankAccount) {
        this.$message.error('请输入公司银行账号')
        return
      }
      if (!this.customersData.bankOfDeposit) {
        this.$message.error('请输入公司账号开户行')
        return
      }
      context.http.put(`ywm/api/corporate-customers/bank`, {
        id: this.customersData.id,
        bankAccount: this.customersData.bankAccount,
        bankOfDeposit: this.customersData.bankOfDeposit
      }).then(res => {
        this.configureReadOnly = true
      })
    },
    configureTemSave (row, type) {
      if (!row.name) {
        this.$message.error('请输入模版名称')
        return
      }
      if (type) row.billNoticeStatus = type
      this.billNoticeTempEdit(row)
      this.$set(row, 'tdReadOnly', true)
      this.templateKey++
    },
    billNoticeTempEdit (row) {
      context.http.put(`/cms/api/billNoticeTemp`, row).then(res => {
        console.log(res)
      })
    },
    // 企业信息
    getCorporateCustomers () {
      const companyCode = sessionStorage.getItem('companyCode')
      context.http.get(`/ywm/api/corporate-customers/companyCode?companyCode=${companyCode}`).then(res => {
        if (res.status === 200) {
          this.customersData = res.data
        }
      })
    },
    // 模版列表
    getBillNoticeTemp () {
      context.http.get(`/cms/api/billNoticeTemp`, {
        keywordBusinessType: 'CONTRACT',
        // sort: 'projectManagement,asc,createdDate,desc',
        page: 0,
        size: 10000
      }).then(res => {
        if (res.status === 200) {
          this.templateData = res.data
          if (this.templateData.length > 0) {
            this.templateData.forEach(ele => {
              ele.tdReadOnly = true
            })
          }
        }
      })
    },
    tdReadOnlyEdit (row, type) {
      this.$set(row, 'tdReadOnly', type)
      this.templateKey++
      if (type) this.getBillNoticeTemp()
    },
    getTemplateDetails (id) {
      context.http.get(`/cms/api/billNoticeTemp/${id}`).then(res => {
        this.templateDetail = res.data
      })
    },
    useStatusFormat (state) {
      let res = ''
      res = state === 'USING' ? '使用中' : '已停用'
      return res
    },
    setAnnex (annexURL, annexName) {  // 子组件上传成功返回文件url 和名字
      this.enclosureList = [{
        'annexName': annexName,
        'annexURL': annexURL
      }]
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
    showTenant (index, row) {
      this.getTenantDetails(0, row)
      this.detailsShow = false
    },
    getTenantDetails (index, row) {
      context.http.get('/cms/api/tenant/' + row.id).then(res => {
        this.tenantDetailData = res.data
        this.tenantDetailsShow = true
      })
    },
    tDetailsClose (id) {
      this.tenantDetailsShow = false
      let recordRow
      if (id) {
        recordRow = {}
        recordRow.id = id
      } else {
        recordRow = this.recordRow
      }
      this.handleEdit(0, recordRow)
    },
    affirmDialog (contractId, tenantId) {
      console.log(contractId, tenantId)
    },
    async getBuliding () {
      if (!this.projectId) {
        this.options1 = []
        this.buildingName = null
        return
      }
      let result = await context.http.get('cms/api/buildings/newList', { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING', projectId: this.projectId })
      if (result.data.length === 0) {
        this.options1 = []
        this.buildingName = null
        return
      }
      this.options1 = result.data
      this.buildingName = null
    },
    toStringShop (val) {
      if (val) {
        let stringVal = ''
        val.forEach((item, index) => {
          if ((index + 1) === val.length) {
            stringVal = stringVal + item
          } else {
            stringVal = stringVal + (item + '、')
          }
        })
        return stringVal
      }
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    async getDataAuthorityOptions () {
      let result = await context.http.get('cms/api/project-managements', { page: 0, size: 100, sort: 'desc', useStatus: 'USING' })
      this.projectOptions = result.data
      this.projectManagementId = this.projectOptions[0].id
    },
    queryContractList () {
      context.http.get('/cms/api/contracts/pending', { projectManagementId: this.projectManagementId, page: (this.billPager.currentPage - 1), size: this.billPager.pgSize, sort: 'id,desc' }).then(res => {
        this.billTableData = res.data
        this.billPager.total = Number(res.headers['x-total-count'])
        setTimeout(() => {
          this.setSelectRow()
        }, 20)
      })
    },
    generateBills () {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择合同',
          type: 'warning'
        })
        return
      }
      this.billTimeDialog = true
    },
    handleClose (done) {
      localStorage.contractStatus = ''
      done()
    },
    search () {
      this.pager.currentPage = 1
      localStorage.contractStatusList = JSON.stringify(this.contractStatus)
      this.query(this.idsArray)
    },
    filterHandler (value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    detailsClose () {
      this.detailsShow = false
    },
    resetParameters () {
    },
    openAddDialog () {
      localStorage.STORAGE = 'false'
      if (localStorage.contractStatus === 'renewal') {
        this.addDialogTitle = '合同续签'
        this.contractState = 'renewal'
      } else {
        this.addDialogTitle = '新增合同'
        this.contractState = ''
      }
      context.http.get('/cms/api/project-managements', { useStatus: 'USING' }).then(res => {
        if (res.status === 200) {
          this.projectList = res.data
          this.addVisible = true
        }
      })
      this.detailData = JSON.parse(localStorage.contract)
      this.detailDataIC = JSON.parse(localStorage.contract)
    },
    openAddDialog2 () {
      localStorage.STORAGE = 'false'
      this.addDialogTitle = '合同续签'
      this.contractState = 'renewal'
      this.detailDataIC = JSON.parse(localStorage.contract)
      this.addVisible = true
    },
    handleEdit (index, row) {
      this.recordRow = row
      context.http.get('/cms/api/contracts/' + row.id).then(res => {
        this.detailData = res.data
        this.detailDataIC = res.data
        if (row.contractStatus === 'STORAGE') {
          localStorage.STORAGE = 'true'
          context.http.get('/cms/api/project-managements', { useStatus: 'USING' }).then(res => {
            if (res.status === 200) {
              this.projectList = res.data
              this.addVisible = true
            }
          })
        } else {
          this.detailsShow = true
        }
      })
      this.addDialogTitle = '新增合同'
    },
    current_change (currentPage) {
      this.pager.currentPage = currentPage
      this.query(this.idsArray)
    },
    bill_current_change (currentPage) {
      // 改变页的时候调用一次
      this.changePageCoreRecordData()
      this.billPager.currentPage = currentPage
      this.queryContractList()
    },
    sidebarQuery (ids) {
      this.pager.currentPage = 1
      this.query(ids)
    },
    pgSizeSelectFn () { // 切换显示条数
      this.pager.currentPage = 1
      this.query(this.idsArray)
    },
    addHoursing () {
      this.detailDataIC = {}
      localStorage.STORAGE = 'false'
      localStorage.contractStatus = ''
      this.contractState = ''
      this.addDialogTitle = '新增合同'
      context.http.get('/cms/api/project-managements', { useStatus: 'USING' }).then(res => {
        if (res.status === 200) {
          this.projectList = res.data
          this.addVisible = true
        }
      })
    },
    deleBuild (index) {
      this.$refs.projectSidebar.deleBuild(index)
    },
    query (ids) {
      // let idArray = []
      // if (ids && ids.length > 0) {
      //   idArray = ids
      // }
      // let typeArr = ''
      // idArray.forEach((item, index) => {
      //   if (index === idArray.length - 1) {
      //     typeArr += 'buildingId=' + item
      //   } else {
      //     typeArr += 'buildingId=' + item + '&'
      //   }
      // })
      // let contractStatus = JSON.parse(JSON.stringify(this.contractStatus))
      context.http.get('/cms/api/contracts?sort=projectManagementSortNumber,asc&sort=contractNo,asc&sort=id,asc', {
        name: this.queryContract,
        tenantName: this.tenantName,
        projectManagementId: this.projectId,
        buildingId: this.buildingName,
        contractStatus: this.contractStatus.toString(),
        endDate: this.dateContract,
        page: (this.pager.currentPage - 1),
        size: this.pager.pgSize
      }).then(res => {
        this.tableData = res.data
        this.tableData.forEach(ele => {
          ele.area = toLocaleFixed(ele.area)
        })
        this.pager.total = Number(res.headers['x-total-count'])
      })
    },
    formatterStatus (row, column) {
      let contractStatus
      if (row.contractStatus === 'STORAGE') {
        contractStatus = '暂存'
      } else if (row.contractStatus === 'PENDING') {
        contractStatus = '待执行'
      } else if (row.contractStatus === 'EXECUTING') {
        contractStatus = '执行中'
      } else if (row.contractStatus === 'ZH_APPROVAL') {
        contractStatus = '招商审核中'
      } else if (row.contractStatus === 'TZ_APPROVAL') {
        contractStatus = '退租审核中'
      } else if (row.contractStatus === 'WITHDRAWAL') {
        contractStatus = '已退租'
      } else if (row.contractStatus === 'XQ_APPROVAL') {
        contractStatus = '续签审核中'
      } else if (row.contractStatus === 'NO') {
        contractStatus = '审核未通过'
      } else if (row.contractStatus === 'MATURITY') {
        contractStatus = '到期未处理'
      }
      return contractStatus
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
    addDialogClose () {
      this.addVisible = false
      this.contractState = ''
      localStorage.contractStatus = ''
    },
    addbill () {
      this.billTableData = []
      this.billPager = {
        currentPage: 1,
        pgNum: 1,
        total: 0,
        pgSize: 15
      }
      this.getDataAuthorityOptions()
      this.billDialogVisible = true
    },
    handleSelectionChange (val) {
      // table组件选中事件,记得加上@selection-change="handleSelectionChange"
      this.multipleSelection = val
    },
    // 设置选中的方法
    setSelectRow () {
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
        return
      }
      // 标识当前行的唯一键的名称
      let idKey = this.idKey
      let selectAllIds = []
      let that = this
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey])
      })
      this.$refs.multipleTable.clearSelection()
      for (var i = 0; i < this.billTableData.length; i++) {
        if (selectAllIds.indexOf(this.billTableData[i][idKey]) >= 0) {
          // 设置选中，记住table组件需要使用ref="table"
          this.$refs.multipleTable.toggleRowSelection(this.billTableData[i], true)
        }
      }
    },
    // 记忆选择核心方法
    changePageCoreRecordData () {
      // 标识当前行的唯一键的名称
      let idKey = this.idKey
      let that = this
      // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
      if (this.multipleSelectionAll.length <= 0) {
        this.multipleSelectionAll = this.multipleSelection
        return
      }
      // 总选择里面的key集合
      let selectAllIds = []
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey])
      })
      let selectIds = []
      // 获取当前页选中的id
      this.multipleSelection.forEach(row => {
        selectIds.push(row[idKey])
        // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
        if (selectAllIds.indexOf(row[idKey]) < 0) {
          that.multipleSelectionAll.push(row)
        }
      })
      let noSelectIds = []
      // 得到当前页没有选中的id
      this.billTableData.forEach(row => {
        if (selectIds.indexOf(row[idKey]) < 0) {
          noSelectIds.push(row[idKey])
        }
      })
      noSelectIds.forEach(id => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < that.multipleSelectionAll.length; i++) {
            if (that.multipleSelectionAll[i][idKey] === id) {
              // 如果总选择中有未被选中的，那么就删除这条
              that.multipleSelectionAll.splice(i, 1)
              break
            }
          }
        }
      })
    },
    confirmGenerate () {
      if (this.billTime.length < 1) {
        this.$message({
          message: '请选择时间',
          type: 'warning'
        })
        return
      }
      // console.log(this.multipleSelection)
      let multipleSelectionAll = this.multipleSelectionAll.concat(this.multipleSelection)
      let newArr = multipleSelectionAll.map((item, index, arr) => {
        return item.id
      })
      let ids = newArr.filter((x, index, self) => self.indexOf(x) === index)
      context.http.post('/cms/api/rent-clauses/business/contract', { contractId: ids, startDate: this.billTime[0], endDate: this.billTime[1] }).then(res => {
        if (res.status === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.billTime = []
          this.billTableData = []
          this.billTimeDialog = false
          this.billPager = {
            currentPage: 1,
            pgNum: 1,
            total: 0,
            pgSize: 15
          }
        }
      })
    },
    exportBill () {
      axios({
        method: 'GET',
        url: '/cms/api/contracts/report?sort=projectManagementSortNumber,asc&sort=contractNo,asc&sort=id,asc',
        params: {
          name: this.queryContract,
          tenantName: this.tenantName,
          projectManagementId: this.projectId,
          buildingId: this.buildingName,
          contractStatus: this.contractStatus.toString(),
          endDate: this.dateContract,
          page: (this.pager.currentPage - 1),
          size: this.pager.pgSize
        },
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
@import "../../../style/config";
ul,
li {
  list-style: none;
}
.contract_search .el-input .el-input__inner {
  width: 150px;
  height: 32px;
  line-height: 32px;
  position: absolute;
  left: 0;
  top: 0;
}
.contract {
  font-size: 16px;
  background-color: #f9f9f9;
  .intention_container {
    background-color: #f9f9f9;
    .search-bar {
      > div {
        display: inline-flex;
        align-items: center;
      }
      .el-input,
      .el-input__inner {
        width: 150px;
      }
      .el-select {
        margin-right: 0;
      }
    }
    .contract_search {
      background-color: #fff;
      margin: 20px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      .search-top {
        border-bottom: 1px solid #ecedef;
        padding-bottom: 18px;
        padding-left: 18px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .el-input__icon {
          line-height: 32px;
        }
        .el-input {
          width: 150px;
          height: 32px;
          display: block;
          margin-top: 18px;
        }
        > div {
          display: inline-block;
          &:first-child {
            display: flex;
            flex-wrap: wrap;
          }
        }
        .batchbtn {
          float: right;
          width: 128px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          font-size: 14px;
          color: #6b6b6b;
          background-color: #eaf1fa;
          border-radius: 4px;
          cursor: pointer;
          margin: 18px 30px 0 0px;
          i {
            display: inline-block;
            width: 24px;
            height: 16px;
            background: url(../../../assets/piliangsc.png) no-repeat;
            background-size: contain;
            vertical-align: middle;
          }
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
  .addintentionContracts {
    .el-dialog {
      width: 1000px !important;
      margin-top: 3vh !important;
    }
    .dl-head {
      display: flex;
      justify-content: space-start;
      margin-top: 20px;
    }
    .step {
      display: inline-block;
      width: 49%;
      height: 40px;
      line-height: 40px;
      padding-left: 14px;
      font-size: 16px;
      background-color: #f9f9f9;
      color: #777;
      border-radius: 6px;
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
    }
    .stepActive {
      color: #fff;
      background-color: #3175d2;
    }
    .stepActivePast {
      color: #fff;
      background-color: #789ed2;
    }
    .drawer-content {
      margin-top: 10px;
    }
    .el-textarea__inner {
      height: 100px;
    }
    .checkAll {
      font-size: 16px;
      .el-checkbox__label {
        font-size: 16px;
      }
    }
    .cttitle {
      margin-bottom: 10px;
    }
    .el-select {
      width: 100%;
    }
    .el-form-item__content {
      .el-cascader {
        width: 100%;
      }
      span {
        color: #666;
      }
    }
    .dl-content {
      width: 100%;
      margin-bottom: 20px;
      .head-portrait {
        padding-top: 36px;
        text-align: center;
        .hp-img {
          width: 100px;
          height: 100px;
          border: 1px dashed #dfdfdf;
          border-radius: 50%;
          margin-left: 22%;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .upload {
          vertical-align: top;
          position: relative;
          .uploadbtn {
            display: inline-block;
            width: 88px;
            height: 34px;
            line-height: 34px;
            text-align: center;
            border: 1px solid #5e72e4;
            border-radius: 8px;
            color: #5e72e4;
            margin-top: 14px;
            cursor: pointer;
            .icon-upload {
              background: url(../../../assets/upload.png) no-repeat;
              position: relative;
              top: 2px;
              width: 14px;
            }
          }
          input {
            position: absolute;
            top: 14px;
            right: 41px;
            width: 88px;
            height: 34px;
            opacity: 0;
            cursor: pointer;
          }
        }
        p {
          font-size: 12px;
          margin-top: 10px;
          color: #666;
        }
      }
      .dc-left {
        width: 30%;
        text-align: center;
        border: 1px solid #e7e7e7;
        margin-top: 20px;
        .dr-head {
          background-color: #fafafa;
          height: 40px;
          line-height: 40px;
          padding-left: 12px;
          font-size: 14px;
          margin-bottom: 24px;
        }
      }
      .dc-right {
        width: 68%;
        border: 1px solid #e7e7e7;
        margin-top: 20px;
        .dr-head {
          background-color: #fafafa;
          height: 40px;
          line-height: 40px;
          padding-left: 12px;
          font-size: 14px;
          margin-bottom: 24px;
        }
        .el-form-item {
          display: inline-block;
          width: 45%;
          margin-left: 16px;
          margin-right: 10px;
          &:nth-of-type(odd) {
            margin-right: 0;
          }
        }
        .dc-right_div {
          border: 1px solid #e7e7e7;
          margin-top: 20px;
          .cttitle span:nth-of-type(2) {
            color: #0f75ff;
            font-size: 12px;
            float: right;
            cursor: pointer;
          }
          .psotmaster span {
            color: #666 !important;
          }
        }
      }
    }
  }
  .el-dialog__body {
    color: #333;
  }
  .addContracts {
    .el-date-editor {
      width: 100% !important;
    }
  }
  .batch-production {
    .query-wrap {
      display: flex;
      .el-select {
        margin: 18px 0 20px 0;
      }
      .query-btn {
        height: 38px;
        line-height: 38px;
        margin-top: 18px;
        margin-left: 20px;
      }
    }
  }
  .bill-time-wrap {
    display: flex;
    align-items: center;
    > div {
      margin: 20px 10px 20px 0;
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

.configure-dialog {
  .el-dialog__header {
    margin: 0 20px !important;
    padding: 20px 0 10px !important;
    border: none !important;
  }
  .el-dialog__body {
    margin: 0 !important;
    background-color: #f7f7f7;
    border: none;
    overflow: hidden;
  }
  .content-wrapper {
    width: 100%;
    margin-bottom: 15px;
    .query-wrap {
      padding: 0 20px;
      display: flex;
      justify-content: flex-start;
      .query-item {
        margin-right: 40px;
        width: 246px;
        &:last-child {
          margin-right: 0;
        }
      }
      .query-item-title {
        margin-bottom: 10px;
      }
      .required {
        color: red;
      }
    }
    .edit {
      color: #3575f6;
      font-size: 12px;
    }
    .save {
      background-color: #2a6ef0;
      color: #fff;
    }
    .add {
      color: #44af69;
      background-color: transparent;
      font-weight: normal;
      &:hover {
        text-decoration: underline;
      }
    }
    .wrapper1 {
      margin-top: 15px;
      background-color: #fff;
    }
  }
  .dr-head {
    background-color: #fff;
    color: #262626;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    font-size: 14px;
    margin-bottom: 10px;
    font-weight: bold;
    border-bottom: 1px solid #f6f6f6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .vertical {
      display: inline-block;
      width: 4px;
      height: 16px;
      background-color: #3575f6;
      border-radius: 2px;
      vertical-align: sub;
      margin-right: 5px;
    }
  }
  .btn {
    display: inline-block;
    padding: 0 10px;
    height: 30px;
    line-height: 28px;
    text-align: center;
    cursor: pointer;
    border-radius: 4px;
    font-weight: normal;
    &.blue {
      color: #4677ee;
    }
    &.grey {
      color: #777777;
    }
    &.red {
      color: #e91515;
    }
  }
}
.tem-dialog {
  .el-dialog__header {
    margin: 0 20px !important;
    padding: 12px 0 10px !important;
    border: none !important;
    font-weight: bold;
  }
  .el-dialog__body {
    margin: 0 !important;
    background-color: #f7f7f7;
    border: none;
    overflow: hidden;
  }
  .dr-head {
    background-color: #fff;
    color: #262626;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    margin-bottom: 10px;
    font-weight: bold;
    border-bottom: 1px solid #f6f6f6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .vertical {
      display: inline-block;
      width: 4px;
      height: 16px;
      background-color: #3575f6;
      border-radius: 2px;
      vertical-align: sub;
      margin-right: 5px;
    }
  }
  .tem-wrap {
    background: #ffffff;
    padding: 0 15px;
    margin: 11px 0;
    .tw-div {
      display: flex;
      align-items: center;
      margin: 16px 0;
      > span {
        width: 100px;
      }
      .tips {
        width: 200px;
        color: red;
        font-size: 12px;
      }
    }
    .enclosure-warp {
      display: flex;
      align-items: center;
      padding-left: 100px;
      margin: 10px 0;
      color: #333333;
      > div {
        margin-left: 20px;
      }
    }
  }
  .keywordCOntent {
    background-color: #f7f8fa;
    margin-top: 10px;
    padding: 15px;
    .copyInput {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      z-index: -10;
    }
    > span.item {
      position: relative;
      border: 1px solid #d7d7d7;
      display: inline-block;
      height: 40px;
      line-height: 40px;
      font-size: 12px;
      text-align: center;
      padding: 0 10px;
      cursor: pointer;
      background-color: #fff;
      margin-right: 15px;
      margin-bottom: 10px;
      color: #262626;
      &:hover {
        i {
          display: inline-block;
        }
      }
      i {
        position: absolute;
        right: -8px;
        top: -20px;
        display: none;
      }
    }
  }
  .keywordCOntent1 {
    > span.item {
      &:hover {
        color: #0066ff;
        border: 1px solid #0066ff;
      }
    }
  }
  .customKeyword {
    margin-top: 20px;
    .title {
      height: 40px;
      line-height: 40px;
      display: flex;
      align-items: center;
      i {
        margin-left: 30px;
        font-size: 30px;
        color: #999;
        cursor: pointer;
      }
    }
    .customKeywordContent {
      padding: 10px 0;
      .newItem {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        width: 350px;
        padding-left: 8px;
        > span {
          font-size: 12px;
          color: #777777;
          &:not(.sep) {
            margin: 0 5px;
          }
          &.sep {
            display: inline-block;
            width: 1px;
            height: 20px;
            background-color: #eeeeee;
          }
        }
        .addKeyword {
          height: 32px;
          line-height: 32px;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
          background-color: #3575f6;
          color: #ffffff;
          width: 45px;
          cursor: pointer;
          text-align: center;
        }
      }
    }
  }
}
</style>
