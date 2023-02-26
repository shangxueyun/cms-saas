<template>
  <div id="contractTenancy"
       class="contractTenancy">
    <div class="titlebar">
      <i class="back"
         @click="backToapprovalCenter"></i>
      <span>退租审批</span>
    </div>
    <div class="dl-head">
      <span class="step"
            :class="{stepActive: newlystep1,  stepActivePast: newlystep2||newlystep3}"><span style="font-size: 20px;">1</span>. 审批流程</span>
      <span class="step"
            :class="{stepActive: newlystep2,  stepActivePast: newlystep3}"><span style="font-size: 20px;">2</span>. 退租信息</span>
      <span class="step"
            :class="{stepActive: newlystep3}"><span style="font-size: 20px;">3</span>. 其他资料</span>
      <el-button
        v-if="NunOnRent != 2"
        @click="followDetails = true"
        class="follow"
        size="small">
          查看跟进记录
      </el-button>
    </div>
    <div class="dl-content clearfix">
      <div class=""
           v-if="newlystep1">
        <div class="menuBar">
          <span v-for="(item,index) in historyOrNowTab"
                :key="index"
                :class="{active:index===historyOrNowTabIndex}"
                @click="historyOrNowTabChange(index)"
                v-show="isShowTab(item,index)">{{item.label}}<i v-if="item.value && item.value>0">({{item.value}})</i></span>
        </div>
        <div class="flowChart"
             style="min-height:500px">
          <div class="dingflow-design">
            <div class="ie-polyfill-container">
              <div class="box-scale"
                   :id="'box-scale' + idx"
                   v-for="(itm,idx) in detailsDataList"
                   :key="idx">
                <div class="contractNum">审批流程名称：{{processDefineName}}</div>
                <div class="contractNum"
                     style="top:40px">审批标题/品牌：{{brandTitle}}</div>
                <div class="contractNum"
                     style="top:60px">{{contractNo?'合同编号':'审批流程名称'}}：{{contractNo?contractNo:processDefineName}}</div>
                <div class="number"
                     style="top:80px">审批编号：{{itm.processTaskVersion}}</div>
                <div class="download"
                     style="top:110px" @click="domtoimageDownload(idx)" v-if="!downloading">下载审批</div>
                <span class="statusSeal"
                      :class="{'approvalAgreed':itm.approvalResult==='AGREED','approvalReject':itm.approvalResult==='REJECT','approvalclose':itm.approvalResult==='CLOSE','approvalWithdraw':itm.approvalResult==='WITHDRAW'}"></span>
                <div v-for="(item, index) in itm.processFlowNowVMS"
                     :key="index">
                  <div class="node-wrap"
                       v-if="item.type === 'START' || item.type === 'APPROVAL' || item.type === 'CC'">
                    <div class="node-wrap-box"
                         :class="{'node_sid-startevent start-node': item.type === 'START'}">
                      <div>
                        <div class="title"
                             :class="[item.type === 'START' ? 'approver-start-title': item.type === 'APPROVAL' ? 'approver-title' : 'notifier-title']">
                          <span>
                            <i class="icon"
                               :class="[item.type === 'START' ? 'approvalStartIcon': item.type === 'APPROVAL' ? 'approvalIcon' : 'notifierIcon']"></i>
                            <span class="">{{item.name}}</span>
                          </span>
                          <span>
                            <i v-if="(item.type !== 'START' || item.processApproval === 'WITHDRAW') && item.type !== 'CC'"
                               :class="{
                              'agree':item.processApproval==='AGREED',
                              'reject':item.processApproval==='REJECT' || item.processApproval === 'WITHDRAW',
                              'close':item.processApproval==='CLOSE',
                              'auto':item.processApproval==='AUTO',
                              'wait':!item.processApproval}">{{formatStatus(item.processApproval)}}</i>
                          </span>
                        </div>
                        <div class="content">
                          <div>
                            <!-- <span>{{item.userName}}({{item.jobPosition[0]}})</span> -->
                            <span :title="formatUserJobPos(item)">{{formatUserJobPos(item)}}</span>
                            <i v-if="item.type !== 'CC'">{{formatExecuteTime(item.executeTime)}}</i>
                          </div>
                          <div>
                            <span :title="item.memo"
                                  v-if="item.type !== 'START' || item.processApproval === 'WITHDRAW'">
                              <span v-if="item.processApproval === 'WITHDRAW'">撤回原因：</span>
                              <span v-else>意见：</span>
                              {{formatMemo(item.memo)}}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="add-node-btn-box">
                      <div class="add-node-btn"></div>
                    </div>
                  </div>
                  <branchWrap v-if="item.childNode && (item.type === 'PARALLEL_START_AND'||item.type === 'PARALLEL_START_OR')"
                              :branchData="item" />
                </div>
                <div class="end-node">
                  <div class="end-node-circle"></div>
                  <div class="end-node-text">流程结束</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="newlystep2"
           v-if="newlystep2">
        <div class="dl-content clearfix">
          <div class="dc-left float-left"
               style="display: inline-block;height: 319px">
            <div class="dr-head"
                 style="text-align: left">房源信息</div>
            <div class="basic-select">
              <div class="clearfix selectInput"
                   style="border: none">
                <img :src="contractInfo.contractDTO.projectManagement.previewImage" />
                <span>{{contractInfo.contractDTO.projectManagement.projectName}}</span>
              </div>
              <div class="bd-number">

              </div>
              <div class="layer"
                   v-for="(item, index) in contractInfo.contractDTO.rooms"
                   :key="index">
                <div>
                  <span v-if="item.floor">{{item.floor.name}}层</span>
                  <span>{{item.shopNumber}}室</span>
                  <span>{{item.buildingArea}}m²</span>
                </div>
              </div>
            </div>
          </div>
          <div class="dc-right float-right"
               style="width: 68%;display: inline-block">
            <div class="dr-head">退租信息</div>
            <div class="itemInfoContent">
              <div class="itemInfo">
                <div class="cttitle">退租类型</div>
                <span>{{formatLeaseType(contractInfo.leaseType)}}</span>
              </div>
              <div class="itemInfo">
                <div class="cttitle">客户名称<i class="required">*</i></div>
                <span>{{contractInfo.contractDTO.tenant.teantName}}</span>
              </div>
              <div class="itemInfo">
                <div class="cttitle">合同编号</div>
                <span>{{contractInfo.contractDTO.contractNo}}</span>
              </div>
              <div class="itemInfo">
                <div class="cttitle">退租面积/m²<i class="required">*</i></div>
                <span>{{contractInfo.contractDTO.area}}</span>
              </div>
              <div class="itemInfo">
                <div class="cttitle">退租办理日期<i class="required">*</i></div>
                <span>{{contractInfo.handleDate}}</span>
              </div>
              <div class="itemInfo">
                <div class="cttitle">退租日期<i class="required">*</i></div>
                <span>{{contractInfo.withdrawalDate}}</span>
              </div>
              <div class="itemInfo">
                <div class="cttitle">工商注册地址变更时间</div>
                <span>{{contractInfo.businessUpdateDate}}</span>
              </div>
            </div>
          </div>
          <div style="clear: both"></div>
          <div class="dc-right">
            <div class="dr-head"
                 style="margin-bottom: 0">费用</div>
            <div class="selected-housing bill-details">
              <ul>
                <li>费用类型</li>
                <li>计费周期</li>
                <li>账单类型</li>
                <li>应收金额/元</li>
                <li>已收金额/元</li>
                <li>待收金额/元</li>
              </ul>
              <ul v-for="(item, index) in preRentBill.billDTOS"
                  :key="index">
                <li>{{item.feeTypeName}}</li>
                <li>{{item.startDate}}～{{item.endDate}}</li>
                <li>{{formatterBillType(item.billType)}}</li>
                <li>{{item.amount}}</li>
                <li>{{item.receivedAmount}}</li>
                <li>{{item.settlementAmount}}</li>
              </ul>
              <div class="total">
                <span>合计：<span>{{preRentBill.totalAmount}}元</span></span>
              </div>
            </div>
          </div>
          <div class="dc-right">
            <div class="dr-head"
                 style="margin-bottom: 0">保证金</div>
            <div class="selected-housing bond-details">
              <ul>
                <li>保证金类型</li>
                <li>账单金额/元</li>
                <li>实收金额/元</li>
              </ul>
              <ul v-for="(item, index) in preRentBill.deposits"
                  :key="index">
                <li>{{item.feeTypeName}}</li>
                <li>{{item.amount}}</li>
                <li>{{item.receivedAmount}}</li>
              </ul>
              <div class="total">
                <span>合计：<span>{{preRentBill.depositsTotal}}元</span></span>
              </div>
            </div>
          </div>
          <div class="dc-right">
            <div class="dr-head"
                 style="margin-bottom: 20px;">其他费用</div>
            <div class="other-expense bond-details">
              <div v-for="(item, index) in contractInfo.otherFeeDTOS"
                   :key="index"
                   class="itemInfoContent">
                <div class="itemInfo"
                     style="width:32%;text-align:left;">
                  <div class="cttitle">账单类型</div>
                  <span>{{item.billType==='R'?'收款':'付款'}}</span>
                </div>
                <div class="itemInfo"
                     style="width:32%;text-align:left;">
                  <div class="cttitle">费用名称</div>
                  <span>{{item.expenseName}}</span>
                </div>
                <div class="itemInfo"
                     style="width:32%;text-align:left;">
                  <div class="cttitle">费用金额</div>
                  <span>{{item.amount}}</span>
                </div>
              </div>
              <div class="total"
                   style="height: 40px;">
                <span style="position: relative;top: 10px;">合计：<span>{{otherExpenses}}元</span></span>
              </div>
            </div>
          </div>
          <div class="dc-right">
            <div class="dr-head"
                 style="margin-bottom: 0">费用总计</div>
            <div class="selected-housing total-cost">
              <ul style="border: none">
                <li>租金结算</li>
                <li>{{preRentBill.totalAmount}}元</li>
              </ul>
              <ul>
                <li>保证金结算</li>
                <li>{{preRentBill.depositsTotal}}元</li>
              </ul>
              <ul>
                <li>滞纳金结算</li>
                <li>0元</li>
              </ul>
              <ul>
                <li>其他费用结算</li>
                <li>{{otherExpenses}}元</li>
              </ul>
              <div class="total">
                <span>总计：<span>{{totalCost}}元</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="newlystep3"
           v-if="newlystep3">
        <div class="dl-content clearfix">
          <div class="dc-right float-right"
               style="width: 100%;margin-top:0px">
            <div class="dr-head"
                 style="margin-bottom: 0">备注</div>
            <div class="other-info"
                 style="min-height:100px;padding:10px"> <span>{{contractInfo.remark}}</span></div>
          </div>
          <div class="dc-right float-right"
               style="width: 100%;border: none">
            <div class="enclosure">
              <div class="enclosure-head">附件
                <!-- <div class="upload"> 上传附件
                    <input type="file" @change="imageChange($event)">
                  </div> -->
              </div>
              <div class="enclosure-head"
                   style="border-bottom: 1px solid #D8DCE3;background-color:#fff">
                <span>文件名</span>
                <span>操作</span>
              </div>
              <div class="enclosure-list"
                   v-if="contractInfo.annexes.length > 0">
                <div class="el-item"
                     style="display: flex;"
                     v-for="(item, index) in contractInfo.annexes"
                     :key="index">
                  <span>{{item.annexName}}</span>
                  <span style="display: flex">
                    <ailPreview :ailObj="item"
                                :encrypt="true"
                                :picturePreview="true" />
                    <aliDownLoad class="aliDownLoad1"
                                 style="margin-right:15px"
                                 :item="item"
                                 :encrypt="true" />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="dc-right float-right"
               style="width: 100% ;margin-top:20px;border:none;border: 1px solid #eee;"
               v-if="newlystep3 && approvalOperation">
            <div class="dr-head"
                 style="margin-bottom: 0">审批意见<i style="color:red"> * </i></div>
            <div class="textArea"
                 style="background-color:#ffffff">
              <el-input type="textarea"
                        :rows="4"
                        placeholder="500字以内"
                        resize="none"
                        maxlength="500"
                        v-model="memo">
              </el-input>
            </div>
          </div>
          <div class="dc-right float-right"
               style="width: 100% ;border:none;border: 1px solid #eee;"
               v-if="showOnRent && withdraw && this.contractStatus !== 'START'">
            <div class="dr-head"
                 style="margin-bottom: 0">审批撤回原因</div>
            <div class="textArea"
                 style="background-color:#ffffff">
              <el-input type="textarea"
                        :rows="4"
                        placeholder="500字以内"
                        resize="none"
                        maxlength="500"
                        style="border: none"
                        v-model="withdrawMemo">
              </el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed-footer"
         style="display: flex;justify-content: flex-end;">
      <div class="closing-btn"
           style="margin-right: 10px;">
        <el-button class="close-button"
                   @click="centerDialogVisible = true"
                   v-if="this.contractStatus === 'START' && !this.finshed">关闭申请</el-button>
      </div>
      <div>
        <el-button type="primary"
                   @click="previousStep"
                   class="close-button"
                   v-if="newlystep2 || newlystep3">上一步</el-button>
        <el-button type="primary"
                   @click="newlystepNoe()"
                   class="defaultbtn dialog-confirmBtn"
                   v-if="newlystep1 || newlystep2">下一步</el-button>
        <el-button type="primary"
                   class="defaultbtn dialog-confirmBtn"
                   v-if="newlystep3 && approvalOperation"
                   @click="postTask('REJECT')">驳回</el-button>
        <el-button type="primary"
                   class="defaultbtn dialog-confirmBtn"
                   v-if="newlystep3 && approvalOperation"
                   @click="postTask('AGREED')">通过</el-button>
        <el-button type="primary"
                   class="defaultbtn dialog-confirmBtn"
                   v-if="showOnRent && withdraw && newlystep3 && this.contractStatus !== 'START'"
                   @click="withdrawTask('WITHDRAW')">撤回</el-button>
      </div>
    </div>

    <el-dialog :visible.sync="centerDialogVisible"
               width="400px!important"
               class="dl-warn"
               center>
      <div class="dl-content">
        <img src="../../../assets/warn.png" />
        <p style="font-size: 16px;color: #000">关闭申请</p>
        <p>关闭申请后，该审批流程结束</p>
      </div>
      <span slot="footer"
            class="warn-dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="postTask('CLOSE')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 跟进详情 -->
    <followDetails 
      v-if="followDetails && NunOnRent != 2"
      :details-data="followDetailsData"
      :boolean-flag="followDetails"
      :config-object="{
        title: '跟进记录'
      }"
      @drawerClose="drawerClose"
    />
  </div>
</template>

<script>
import context from '@/service'
import branchWrap from './components/branchWrap.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import axios from 'axios'
import ailPreview from '@/components/ailPreview.vue'
import followDetails from './components/followDetails.vue'
import domtoimage from 'dom-to-image'
export default {
  name: 'contractTenancy',
  components: {
    branchWrap,
    aliDownLoad,
    ailPreview,
    followDetails
  },
  data () {
    return {
      centerDialogVisible: false,
      followDetails: false,
      followDetailsData: {},
      detailsData: {},
      preRentBill: [], // 租金列表
      approvalOperation: true,
      newlystep1: true,
      newlystep2: false,
      newlystep3: false,
      contractInfo: {
        contractDTO: {
          projectManagement: null
        }
      },
      billList: {},
      contractStatus: '',
      finshed: false,
      taskId: '',
      detailsDataList: [],
      formLabelWidth: '',
      rejectDialog: false,
      memo: '', // 审批意见
      historyOrNowTab: [
        { label: '当前审批流程', value: '0' },
        { label: '历史审批流程', value: '2' }
      ],
      historyOrNowTabIndex: 0,
      processDefineName: null,
      contractNo: null,
      withdraw: false,
      showOnRent: false,
      withdrawMemo: '',
      brandTitle: '',
      NunOnRent: 0,
      downloading: false
    }
  },
  created () {
    this.getFlowMap()
    this.approvalOperation = this.$route.params.approvalOperation
    this.brandTitle = this.$route.params.brandTitle
    this.finshed = this.$route.params.finshed
    this.processDefineName = this.$route.params.processDefineName
    this.contractNo = this.$route.params.contractNo
    this.withdraw = this.$route.params.row.processStatus === 'RUNING'
    this.showOnRent = this.$route.params.onRent === 1
    this.NunOnRent = this.$route.params.onRent
    this.followDetailsData = this.$route.params.row
  },
  methods: {
    formatLeaseType (type) { // 退租类型
      switch (type) {
        case 'MATURITY':
          return '到期退租'
        case 'RELIEVE':
          return '解除合同'
      }
    },
    isShowTab (item, index) { // 是否展示历史流程标签
      if (index === 1 && !item.value > 0) {
        return false
      }
      return true
    },
    getFlowMap () { // 请求流程图
      let row = this.$route.params.row
      if (row.ccTaskId) {
        context.http.get(`/cms/api/process-cctask/now/${row.ccTaskId}`).then(res => { // 请求流程图
          this.detailsData = res.data
          this.detailsDataList[0] = this.detailsData[0]
          this.historyOrNowTab[1].value = this.detailsData.length - 1
          this.surrenderInfo(row.businessId)
          this.contractStatus = row.processDetailType
          // this.taskId = row.taskId // taskId 任务id  用于提交任务（审核通过、驳回 重新发起等）
        })
      } else {
        context.http.get('/cms/api/process-task-versions/now/' + row.id).then(res => { // 请求流程图
          this.detailsData = res.data
          this.detailsDataList[0] = this.detailsData[0]
          this.historyOrNowTab[1].value = this.detailsData.length - 1
          this.surrenderInfo(row.businessId)
          this.contractStatus = row.processDetailType
          // this.taskId = row.taskId // taskId 任务id  用于提交任务（审核通过、驳回 重新发起等）
        })
      }
    },
    async surrenderInfo (id) { // 退租详情
      let result = await context.http.get(`/cms/api/lease-contracts/${id}`)
      this.contractInfo = result.data
      this.rentBill() // 租金列表
    },
    rentBill () {
      let withdrawalDate = this.contractInfo.withdrawalDate
      let d = new Date(withdrawalDate)
      let getMonth = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)
      let getDate = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
      var times = d.getFullYear() + '-' + (getMonth) + '-' + getDate
      context.http.get('/cms/api/history-bills/lease', { contractId: this.contractInfo.contractDTO.id, leaseType: this.contractInfo.leaseType, withdrawalDate: times }).then(res => {
        this.preRentBill = res.data
        this.getOtherExpenses()
      })
    },
    getOtherExpenses () {
      let otherExpenses = 0
      this.contractInfo.otherFeeDTOS.forEach(ele => {
        let amount = ''
        if (ele.billType === 'P') {
          amount = -Number(ele.amount)
        } else {
          amount = Number(ele.amount)
        }
        otherExpenses += Number(amount)
      })
      this.otherExpenses = otherExpenses
      this.getTotalCost()
    },
    getTotalCost () {
      this.totalCost = (this.preRentBill.totalAmount + this.preRentBill.depositsTotal + this.otherExpenses).toFixed(2)
    },
    formatterFeeType (val) {
      let feeType
      switch (val) {
        case 'RENT':
          feeType = '租金'
          break
        case 'RENT_DEPOSIT':
          feeType = '租金保证金'
          break
        case 'PROPERTY':
          feeType = '物业费'
          break
        case 'PROPERTY_DEPOSIT':
          feeType = '物业费保证金'
          break
        case 'INTENTION':
          feeType = '意向金'
          break
        case 'DECORATION':
          feeType = '装修保证金'
          break
        case 'F_INTENTION':
          feeType = '返还意向金'
          break
        case 'F_DECORATION':
          feeType = '返还装修保证金'
          break
        case 'WITHDRAWAL':
          feeType = '退租结算'
          break
        case 'RELEASE':
          feeType = '合同解除结算'
          break
      }
      return feeType
    },
    formatterBillType (val) {
      return val === 'R' ? '收款' : '付款'
    },
    backToapprovalCenter () {
      if (this.$route.params.messageHttp) {
        this.$router.push({ name: 'messageCenter', params: this.$route.params })
      } else {
        this.$router.push({ name: 'approvalCenter', params: { onRent: this.$route.params.onRent } })
      }
    },
    formatUserJobPos (item) { // 员工岗位姓名
      if (item.type === 'CC') {
        return item.userName.length > 0 ? item.userName.join('、') : ''
      } else {
        // return `${item.userName[0] ? item.userName[0] : '--'}(${item.jobPosition[0] ? item.jobPosition[0] : '--'})`
        return `${item.userName.length > 0 ? item.userName.join('、') : '--'}(${item.jobPosition[0] ? item.jobPosition[0] : '--'})`
      }
    },
    formatExecuteTime (t) { // 流程节点时间
      return t ? t.slice(0, 16).replace('T', ' ') : '-'
    },
    historyOrNowTabChange (index) {
      this.historyOrNowTabIndex = index
      this.detailsDataList = []
      if (index === 0) {
        this.detailsDataList[0] = this.detailsData[0]
      } else {
        if (this.detailsData.length > 1) {
          this.detailsDataList = this.curtailArr(this.detailsData)
        } else {
          this.detailsDataList = []
        }
      }
    },
    curtailArr (arr) { // 删除数组第一项，不改变原数组的情况下  生成新数组
      let m = arr.concat()
      m.shift()
      return m
    },
    formatMemo (memo) {
      if (!memo || memo === '') {
        return '无'
      } else {
        return memo
      }
    },
    formatStatus (s) {
      switch (s) {
        case 'REJECT':
          return '已驳回'
        case 'AGREED':
          return '已通过'
        case 'CLOSE':
          return '申请关闭'
        case 'AUTO':
          return '自动处理'
        case 'WITHDRAW':
          return '已撤回'
        case null:
          return '等待审核'
      }
    },
    previousStep () {
      if (this.newlystep2) {
        this.newlystep1 = true
        this.newlystep2 = false
        this.newlystep3 = false
      } else if (this.newlystep3) {
        this.newlystep1 = false
        this.newlystep2 = true
        this.newlystep3 = false
      }
    },
    newlystepNoe () {
      if (this.contractStatus === 'START' && !this.finshed) {
        this.$router.push({ path: '/home/contractsList', query: { contractId: this.contractInfo.id, taskId: this.$route.params.row.taskId, type: 'surrender' } })
      }
      if (this.newlystep1) {
        this.newlystep1 = false
        this.newlystep2 = true
        this.newlystep3 = false
      } else if (this.newlystep2) {
        this.newlystep1 = false
        this.newlystep2 = false
        this.newlystep3 = true
      } else if (this.newlystep3) {
        this.newlystep1 = false
        this.newlystep2 = false
        this.newlystep3 = true
      }
    },
    priceUnitFormat (val) {
      let priceUnit
      if (val === 'M2DAYS') {
        priceUnit = '元/㎡天'
      } else if (val === 'M2MONTH') {
        priceUnit = '元/㎡月'
      } else if (val === 'DAY') {
        priceUnit = '元/天'
      } else if (val === 'MONTH') {
        priceUnit = '元/月'
      } else if (val === 'YEAR') {
        priceUnit = '元/年'
      }
      return priceUnit
    },
    async postTask (approvalResult) {
      if (this.memo === '' && approvalResult === 'REJECT') {
        this.$message({
          type: 'warning',
          message: '请填写审批意见'
        })
        return
      }
      await context.http.put('/cms/api/process-task', { taskId: this.$route.params.row.taskId, taskResult: approvalResult, memo: this.memo })
      this.$message({
        type: 'success',
        message: '操作成功'
      })
      setTimeout(this.$router.push({ name: 'approvalCenter', params: { onRent: this.$route.params.onRent } }), 800)
    },
    async withdrawTask () {
      if (this.withdrawMemo === '') {
        this.$message({
          type: 'warning',
          message: '请填写审批撤回原因'
        })
        return
      }
      await context.http.put('/cms/api/process-instances/withdraw', { processInstanceId: this.$route.params.row.id, memo: this.withdrawMemo })
      this.$message({
        type: 'success',
        message: '操作成功'
      })
      setTimeout(this.$router.push({ name: 'approvalCenter', params: { onRent: 2 } }), 800)
    },
    downloadFile (item) {
      axios({ method: 'GET', url: '/ywm/api/annex/download', params: { annexURL: item.annexURL, annexName: item.annexName }, responseType: 'blob' }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', item.annexName)
        document.body.appendChild(link)
        link.click()
      })
    },
    domtoimageDownload (idx) {
      const _this = this
      this.downloading = true
      this.$nextTick(() => {
        domtoimage.toJpeg(document.getElementById('box-scale' + idx), { quality: 0.95, bgcolor: '#f5f5f7' }).then(function (dataUrl) {
          var link = document.createElement('a')
          link.download = _this.processDefineName
          link.href = dataUrl
          link.click()
          _this.downloading = false
        })
      })
    },
    formatFeeType (feeType) {
      if (feeType === 'RENT') {
        return '租金'
      } else if (feeType === 'RENT_DEPOSIT') {
        return '租金保证金'
      } else if (feeType === 'PROPERTY') {
        return '物业费'
      } else if (feeType === 'PROPERTY_DEPOSIT') {
        return '物业费保证金'
      } else if (feeType === 'INTENTION') {
        return '意向金'
      } else if (feeType === 'F_INTENTION') {
        return '返还意向金'
      } else if (feeType === 'DECORATION') {
        return '装修保证金'
      } else if (feeType === 'F_DECORATION') {
        return '返还装修保证金'
      } else if (feeType === 'WITHDRAWAL') {
        return '退租结算'
      } else if (feeType === 'RELEASE') {
        return '合同解除结算'
      }
    },
    formatPriceUnit (priceUnit) {
      if (priceUnit === 'M2DAYS') {
        return '元/㎡天'
      } else if (priceUnit === 'M2MONTH') {
        return '元/㎡月'
      } else if (priceUnit === 'DAY') {
        return '元/天'
      } else if (priceUnit === 'MONTH') {
        return '元/月'
      }
    },
    formatTermType (termType) {
      if (termType === 'RENT') {
        return '租金'
      } else if (termType === 'PROPERTY') {
        return '物业费'
      }
    },
    formatRentalMethod (val) {
      return val === 'RENT' ? '固定租金' : val === 'POINTS' ? '扣点' : '保底扣点'
    },
    formatBillingType (BillingType) {
      if (BillingType === 'MONTH') {
        return '按月计费'
      } else if (BillingType === 'DAY') {
        return '按天计费'
      } else {
        return '未知'
      }
    },
    formatApprovalResult (result) {
      if (result === 'AGREED') {
        return '通过'
      } else if (result === 'REJECT') {
        return '驳回'
      } else if (result === 'CLOSE') {
        return '关闭'
      } else if (result === 'REPOST') {
        return '再次提交'
      } else {
        return '审批中'
      }
    },
    formatIncrementUnit (incrementUnit) {
      if (incrementUnit === 'P') {
        return '%'
      } else if (incrementUnit === 'Y') {
        return '元'
      } else {
        return ''
      }
    },
    formatOfferType (offerType) {
      if (offerType === 'RENT') {
        return '免租期'
      } else if (offerType === 'DECORATION') {
        return '装修期'
      } else if (offerType === 'PROPERTY') {
        return '物业免租期'
      } else {
        return ''
      }
    },
    // closeApprovalDialog () {
    //   this.$emit('approvalDialogClose')
    // },
    trimStr (str) { return str.replace(/(^\s*)|(\s*$)/g, '') },
    drawerClose () {
      this.followDetails = false
    }
  }
}
</script>
<style lang="scss">
.contractTenancy{
  .dingflow-design .add-node-btn-box:before {
    margin: 0!important;
    left: 50%!important;
  }
  .dingflow-design .branch-box .col-box:before {
    margin: 0!important;
    left: 50%!important;
  }
}
</style>
<style lang="scss" scoped>
@import "../../../style/aflow";
.contractTenancy {
  .basic-select {
    position: relative;
    cursor: pointer;
    width: 95%;
    margin: 0 auto;
    .selectInput {
      height: 40px;
      border: 1px solid #e7e7e7;
      border-radius: 5px;
      padding: 0 15px;
      &.selectActive {
        border: 1px solid #6473cb;
      }
      img {
        float: left;
        display: block;
        width: 30px;
        height: 20px;
        margin-right: 10px;
        margin-top: 10px;
      }
      span {
        float: left;
        color: #666666;
        display: block;
        line-height: 40px;
        font-size: 14px;
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
      top: 45px;
      z-index: 9;
      padding: 15px 0px;
      box-shadow: 1px 2px 5px #ddd;
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
  .newlystep3 {
    background-color: #ffffff;
  }
  .newlystep2 {
    background-color: #ffffff;
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
              //  background: url(../../../assets/upload.png) no-repeat;
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
          margin-bottom: 20px;
        }
        .basic-select {
          width: 100%;
          .bd-number {
            text-align: left;
            height: 20px;
            line-height: 20px;
            padding-left: 32px;
            background: #fafafa;
          }
          .layer {
            font-size: 14px;
            div {
              padding: 12px 0 0 0;
              span {
                display: inline-block;
                width: 32%;
              }
            }
          }
        }
      }
      .tenantinfo {
        .el-form-item {
          width: 29% !important;
          margin-right: 0;
        }
      }
      .cttitle + span {
        display: inline-block;
        height: 40px;
        line-height: 40px;
      }
      .dc-right {
        border: 1px solid #e7e7e7;
        margin-top: 20px;
        .dr-head {
          background-color: #fafafa;
          height: 40px;
          line-height: 40px;
          padding-left: 12px;
          font-size: 14px;
          margin-bottom: 20px;
        }
        .itemInfoContent {
          display: flex;
          flex-wrap: wrap;
          padding: 0 25px;
          .itemInfo {
            width: 48%;
            span {
              color: #999999;
            }
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
  .menuBar {
    height: 70px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    box-shadow: 2px 2px 6px #dad8d8;
    background-color: #ffffff;
    > span {
      height: 68px;
      line-height: 68px;
      margin-right: 20px;
      padding: 0 15px;
      color: #666666;
      cursor: pointer;
      &.active {
        border-bottom: 2px solid #4376cb;
      }
    }
  }
  .titlebar {
    display: flex;
    align-items: center;
    padding-left: 20px;
    .back {
      margin-right: 40px;
      display: inline-block;
      width: 13px;
      height: 19px;
      background-image: url(../../../assets/back.png);
      cursor: pointer;
    }
    span {
      font-size: 18px;
    }
  }
  .dl-head {
    display: flex;
    justify-content: space-start;
    margin: 20px 0;
    height: 70px;
    align-items: center;
    background-color: #ffffff;
    padding-left: 15px;
    box-shadow: 1px 1px 7px #eee;
    position: relative;
  }
  .step {
    display: inline-block;
    width: 200px;
    height: 40px;
    line-height: 40px;
    padding-left: 14px;
    font-size: 16px;
    background-color: #f9f9f9;
    color: #777;
    border-radius: 6px;
    margin-right: 43px;
    &:last-child {
      margin-right: 0;
    }
  }
  .follow {
    position: absolute;
    top: 26%;
    right: 18px;
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
    // margin-bottom: 10px;
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
  .node-wrap-box {
    width: 250px;
    box-shadow: 1px 1px 8px #bfbfbf;
    .content {
      padding: 0px 10px 15px;
      font-size: 14px;
      > div {
        display: flex;
        justify-content: space-between;
        &:first-child {
          > i {
            font-size: 12px;
            color: #c6c9d1;
          }
        }
        &:last-child {
          margin-top: 10px;
          > span {
            width: 100%;
            color: #777777;
          }
        }
        > span,
        i {
          display: inline-block;
          width: 50%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        > i {
          text-align: right;
        }
      }
    }
    .title {
      height: 40px;
      line-height: 40px;
      background-color: #ffffff !important;
      font-size: 14px;
      color: #2e2c2c;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 16px;
      font-weight: normal;
      .agree {
        color: #61ab5a;
      }
      .reject {
        color: #e93223;
      }
      .wait {
        color: #f9a218;
      }
      .auto {
        color: #4376cd;
      }
      .close {
        color: #a7a7a7;
      }
      > i.wait {
        display: inline-block;
        width: 30px;
        height: 40px;
        background-image: url(../../../assets/wait.png);
        background-size: 100% 72%;
        background-repeat: no-repeat;
        background-position: center;
      }
      > i.close {
        display: inline-block;
        width: 30px;
        height: 40px;
        background-image: url(../../../assets/close.png);
        background-size: 100% 72%;
        background-repeat: no-repeat;
        background-position: center;
      }
      .el-icon-success {
        color: #61ab5a;
        font-size: 24px;
      }
      .el-icon-loading {
        color: #f09851;
        font-size: 24px;
      }
      .el-icon-error {
        color: #ff0000;
        font-size: 24px;
      }
      > span > .icon {
        display: inline-block;
        width: 17px;
        height: 17px;
        margin-right: 10px;
        &.approvalStartIcon {
          // background: url(../../../../assets/approvalStartIcon.png) no-repeat;
          // background-size: 100% 100%;
          width: 0;
          height: 0;
          margin-right: 0;
        }
        &.approvalIcon {
          background: url(../../../assets/approval.png) no-repeat;
        }
        &.notifierIcon {
          background: url(../../../assets/notifierIcon.png) no-repeat;
        }
      }
    }
  }
  .dl-warn {
    .el-dialog {
      .el-dialog__header,
      .el-dialog__body {
        border: none;
      }
      .el-dialog__footer {
        padding-top: 20px;
        .el-button {
          width: 100px;
          height: 30px;
          line-height: 0px;
          &:first-child {
            background-color: #a0a0a0;
            color: #fff;
            border-color: #a0a0a0;
          }
          background-color: #3577f6;
          border-color: #3577f6;
        }
      }
    }
    .dl-content {
      text-align: center;
      margin-bottom: 0;
      img {
        width: 60px;
        height: 60px;
        margin-bottom: 10px;
      }
      p {
        margin-bottom: 10px;
      }
    }
  }
}
.dingflow-design span.add-branch {
  width: 95px !important;
  height: 57px !important;
  background-color: transparent !important;
  box-shadow: none !important;
  top: -30px !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  &.PARALLEL_START_AND {
    background-image: url(../../../assets/branchIcon.png) !important;
  }
  &.PARALLEL_START_OR {
    background-image: url(../../../assets/huoqianw.png) !important;
  }
}
.contractTenancy {
  position: relative;
  .dl-head {
    margin-top: 10px;
  }
  .info_tab {
    height: 48px;
    display: -ms-flexbox;
    display: flex;
    background-color: #fff;
    margin: 10px 0 0px 0;
    box-shadow: 1px 2px 5px #eee;
    border-radius: 3px;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -ms-flex-align: center;
    align-items: center;
    padding-right: 44px;
    border-bottom: 1px solid #ecedef;
    .nav {
      display: -ms-flexbox;
      display: flex;
      li.select_active {
        border-bottom: 2px solid #3175d2;
        color: #3175d2;
        font-weight: bolder;
      }
      li {
        width: 140px;
        text-align: center;
        font-size: 14px;
        color: #666;
        height: 46px;
        line-height: 46px;
        border-bottom: 2px solid #fff;
        cursor: pointer;
      }
    }
  }
  .errorpjTip {
    color: red !important;
    font-size: 12px;
    width: 100%;
    float: left;
  }
  .step2 {
    .dc-right {
      width: 100% !important;
      border: 1px solid #e7e7e7;
      .other-info {
        .el-textarea {
          height: 100px;
          width: 100%;
          margin: 0 auto;
          .el-textarea__inner {
            border: none;
            height: 100px;
          }
        }
      }
    }
  }
  .upload {
    position: relative;
    float: right;
    display: inline-block;
    width: 60px;
    height: 24px;
    line-height: 24px;
    background: rgba(222, 235, 254, 1);
    opacity: 0.9;
    border-radius: 2px;
    font-size: 12px;
    text-align: center;
    cursor: pointer;
    input {
      position: absolute;
      right: 0;
      width: 60px;
      height: 24px;
      opacity: 0;
      cursor: pointer;
    }
  }
  .enclosure {
    border: 1px solid #e7e7e7;
    margin-bottom: 20px;
    .enclosure-head {
      background-color: #fafafa;
      height: 40px;
      line-height: 40px;
      padding-left: 12px;
      span {
        display: inline-block;
        width: 48%;
        padding-left: 40px;
      }
      .upload {
        position: relative;
        float: right;
        display: inline-block;
        width: 60px;
        height: 24px;
        line-height: 23px;
        opacity: 0.9;
        border-radius: 2px;
        font-size: 12px;
        text-align: center;
        border: 1px solid #0f75ff;
        color: #0f75ff;
        border-radius: 4px;
        margin: 8px;
        cursor: pointer;
        background: #fff;
      }
    }
    .el-item {
      height: 30px;
      line-height: 30px;
      span {
        display: inline-block;
        width: 48%;
        padding-left: 40px;
      }
      i {
        cursor: pointer;
      }
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
            //  background: url(../../../assets/upload.png) no-repeat;
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
        margin-bottom: 20px;
      }
      .basic-select {
        width: 100%;
        .bd-number {
          text-align: left;
          height: 20px;
          line-height: 20px;
          padding-left: 32px;
          background: #fafafa;
        }
        .layer {
          font-size: 14px;
          div {
            padding: 12px 0 0 0;
            span {
              display: inline-block;
              width: 32%;
            }
          }
        }
      }
    }
    .tenantinfo {
      .el-form-item {
        width: 29% !important;
        margin-right: 0;
      }
    }
    .cttitle + span {
      display: inline-block;
      height: 40px;
      line-height: 40px;
    }
    .dc-right {
      border: 1px solid #e7e7e7;
      margin-top: 20px;
      .dr-head {
        background-color: #fafafa;
        height: 40px;
        line-height: 40px;
        padding-left: 12px;
        font-size: 14px;
        margin-bottom: 20px;
      }
      .el-form-item {
        display: inline-block;
        width: 29%;
        margin-left: 16px;
        margin-right: 10px;
        &:nth-of-type(3n) {
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
  .selected-housing {
    margin-bottom: 15px;
    font-size: 12px;
    span {
      display: inline-block;
      // width: 19%;
      padding-left: 40px;
    }
    ul {
      display: flex;
      &:first-child {
        border-bottom: 1px solid #e7e7e7;
      }
      li {
        width: 20%;
        height: 30px;
        line-height: 30px;
        text-align: center;
      }
    }
    input {
      border: 1px solid rgba(231, 231, 231, 1);
      border-radius: 4px;
    }
    .cttitle {
      display: inline-block;
      width: 30%;
      padding-left: 20px;
      margin-bottom: 20px;
      div {
        padding-top: 10px;
      }
    }
  }
  .total {
    border-top: 1px solid #f6f6f6;
    text-align: right;
    span {
      padding: 10px 46px 0 0;
      span {
        color: #cb444a;
      }
    }
  }
  .bill-details {
    ul {
      &:first-child {
        li {
          height: 40px;
          line-height: 40px;
        }
      }
    }
  }
  .bond-details {
    li {
      width: 30% !important;
      &:first-child {
        padding-left: 40px;
        text-align: left !important;
      }
      &:last-child {
        text-align: right !important;
      }
    }
  }
  .total-cost {
    li {
      &:first-child {
        width: 85% !important;
        padding-left: 40px;
      }
      &:last-child {
        width: 15% !important;
      }
      text-align: left !important;
    }
  }
}
.box-scale {
  padding: 80px 0 !important;
  .number {
    left: 10%;
    &:nth-of-type(2) {
      top: 60px;
    }
  }
}
.download{
  position: absolute;
  left: 10%;
  top: 110px;
  font-size: 14px;
  color: #666;
  width: 100px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  cursor: pointer;
  z-index: 999;
  background: #3575F6;
  border-radius: 2px;
  color: #ffffff;
}
</style>
