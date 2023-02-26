<template>
  <div class="approvalDetails">
    <app-header :title="contractInfo.contractDTO.tenant.referred">
      <div slot="rightBtn"
           class="rightBtn"
           v-if="titleType !== '待审批'"
           @click="routeTo">跟进记录
           <span v-if="showTag" class="spTag"></span>
           </div>
    </app-header>
    <div class="approval-tips"
         v-if="showTips">请在电脑上重新发起审批</div>
    <!-- 导航区域 -->
    <ul class="navs"
        :class="{'hastips-navs': showTips}">
      <li :class="{active: active===0}"
          @click="scrollTo(0)">
        审批流程
        <div class="underline"
             v-show="active===0"></div>
      </li>
      <li :class="{active: active===1}"
          @click="scrollTo(1)">
        退租信息
        <div class="underline"
             v-show="active===1"></div>
      </li>
      <li :class="{active: active===2}"
          @click="scrollTo(2)">
        其他信息
        <div class="underline"
             v-show="active===2"></div>
      </li>
    </ul>
    <!-- 内容区域 -->
    <div class="content"
         ref="content"
         :class="{'hastips-content': showTips}">
      <div class="approval-process">
        <template v-if="historyFlowChartData.length > 0">
          <div class="content-title">
            历史审批流程({{historyFlowChartData.length}})
            <span @click="completeProcess('history')">点击查看完整流程</span>
          </div>
          <div class="history-warp"
               :class="{'completeH': hshowmore}">
            <div v-for="(item1, index1) in historyFlowChartData"
                 :key="index1"
                 class="historyflow-warp">
              <span class="statusSeal"
                    :class="{'approvalAgreed':item1.approvalResult==='AGREED',
                            'approvalReject':item1.approvalResult==='REJECT',
                            'approvalclose':item1.approvalResult==='CLOSE'}">
                <i class="iconfont"
                   :class="{'iconshenpijujue': item1.approvalResult==='REJECT',
                          'iconshenpichehui': item1.approvalResult==='WITHDRAW',
                          'iconshenpitongguo':item1.approvalResult==='AGREED',
                          'iconyiguanbi': item1.approvalResult==='CLOSE'}"></i>
              </span>
              <div class="ul-warp approcess-ul-warp">
                <div class="content-ul">
                  <span>审批流程名称</span>
                  <span>{{row.processDefineName}}</span>
                </div>
                <div class="content-ul">
                  <span>审批标题/品牌</span>
                  <span>{{processInstances.title}}</span>
                </div>
                <div class="content-ul">
                  <span>审批编号</span>
                  <span>{{item1.processTaskVersion}}</span>
                </div>
                <div class="content-ul flow-start">
                  <span>项目</span>
                  <span>{{contractInfo.contractDTO.projectManagement.referred}}</span>
                </div>
                <div class="flow-chart"
                     v-if="hshowmore">
                  <van-steps direction="vertical"
                             :active="0"
                             active-icon="none">
                    <van-step v-for="(item, index) in item1.processFlowNowVMS"
                              :key="index"
                              :class="{
                        'agree': item.processApproval==='AGREED' || item.type === 'START' || item.type === 'PARALLEL_START_OR' || item.type === 'PARALLEL_START_AND', 
                        'reject': item.processApproval==='REJECT',
                        'auto': item.processApproval==='AUTO' && item.type !== 'START',
                        'wait': item.type === 'CC' || !item.processApproval}">
                      <div class="step-content"
                           v-if="item.type === 'START' || item.type === 'APPROVAL' || item.type === 'CC'">
                        <div class="title">
                          <span>{{item.name}}</span>
                          <span v-if="(item.type !== 'START' || item.processApproval === 'WITHDRAW') && item.type !== 'CC'"
                                :class="{
                            'agree':item.processApproval==='AGREED',
                            'reject':item.processApproval==='REJECT' || item.processApproval === 'WITHDRAW',
                            'close':item.processApproval==='CLOSE',
                            'auto':item.processApproval==='AUTO',
                            'wait':!item.processApproval}">
                            {{formatStatus(item.processApproval)}}
                          </span>
                        </div>
                        <p class="content-p">
                          <span>
                            <span :title="formatUserJobPos(item)">{{formatUserJobPos(item)}}</span>
                          </span>
                          <span v-if="item.type !== 'CC'">{{formatExecuteTime(item.executeTime)}}</span>
                        </p>
                        <div class="content-memo"
                             :title="item.memo"
                             v-if="item.type !== 'START' || item.processApproval === 'WITHDRAW'">
                          <span v-if="item.processApproval === 'WITHDRAW'">撤回原因：</span>
                          <span v-else>意见：</span>
                          {{formatMemo(item.memo)}}
                        </div>
                      </div>
                      <div class="step-content"
                           v-else-if="item.type === 'PARALLEL_START_OR' || item.type === 'PARALLEL_START_AND'">
                        <div class="title">
                          <span>{{item.type === 'PARALLEL_START_OR' ? '或签' : '会签'}}</span>
                          <span></span>
                        </div>
                        <div v-for="(item2, index2) in item.childNode"
                             :key="index2">
                          <div v-for="(item3, index3) in item2.childNode"
                               :key="index3">
                            <p class="content-p">
                              <span>
                                <span :title="formatUserJobPos(item3)">{{formatUserJobPos(item3)}}</span>
                                <span style="color: #858C94">({{formatStatus(item3.processApproval)}})</span>
                              </span>
                              <span v-if="item3.type !== 'CC'">{{formatExecuteTime(item3.executeTime)}}</span>
                            </p>
                            <div class="content-memo"
                                 :title="item3.memo"
                                 v-if="item3.type === 'APPROVAL'">
                              <span>意见：</span>
                              {{formatMemo(item3.memo)}}
                            </div>
                          </div>
                        </div>
                      </div>
                    </van-step>
                  </van-steps>
                </div>
              </div>
            </div>
          </div>
          <div class="more-cion"
               :class="{'showmore': hshowmore}"
               @click="hshowmore = !hshowmore">
            <i class="iconfont iconcms_xia"></i>
          </div>
        </template>
        <div class="content-title">
          当前审批流程
          <span @click="completeProcess">点击查看完整流程</span>
        </div>
        <div class="ul-warp approcess-ul-warp">
          <span class="statusSeal"
                :class="{'approvalAgreed':flowChartData.approvalResult==='AGREED',
                      'approvalReject':flowChartData.approvalResult==='REJECT',
                      'approvalclose':flowChartData.approvalResult==='CLOSE'}">
            <i class="iconfont"
               :class="{'iconshenpijujue': flowChartData.approvalResult==='REJECT',
                      'iconshenpichehui': flowChartData.approvalResult==='WITHDRAW',
                      'iconshenpitongguo':flowChartData.approvalResult==='AGREED',
                      'iconyiguanbi': flowChartData.approvalResult==='CLOSE'}"></i>
          </span>
          <div class="content-ul">
            <span>审批流程名称</span>
            <span>{{row.processDefineName}}</span>
          </div>
          <div class="content-ul">
            <span>审批标题/品牌</span>
            <span>{{processInstances.title}}</span>
          </div>
          <div class="content-ul">
            <span>审批编号</span>
            <span>{{flowChartData.processTaskVersion}}</span>
          </div>
          <div class="content-ul flow-start">
            <span>项目</span>
            <span>{{contractInfo.contractDTO.projectManagement.referred}}</span>
          </div>
          <div class="flow-chart"
               v-if="showmore">
            <van-steps direction="vertical"
                       :active="0"
                       active-icon="none">
              <van-step v-for="(item, index) in flowChartData.processFlowNowVMS"
                        :key="index"
                        :class="{
                  'agree': item.processApproval==='AGREED' || item.type === 'START' || item.type === 'PARALLEL_START_OR' || item.type === 'PARALLEL_START_AND', 
                  'reject': item.processApproval==='REJECT',
                  'auto': item.processApproval==='AUTO' && item.type !== 'START',
                  'wait': item.type === 'CC' || !item.processApproval}">
                <div class="step-content"
                     v-if="item.type === 'START' || item.type === 'APPROVAL' || item.type === 'CC'">
                  <div class="title">
                    <span>{{item.name}}</span>
                    <span v-if="item.type !== 'CC' && item.type !== 'START'"
                          :class="{
                      'agree':item.processApproval==='AGREED',
                      'reject':item.processApproval==='REJECT',
                      'close':item.processApproval==='CLOSE',
                      'auto':item.processApproval==='AUTO',
                      'wait':!item.processApproval}">
                      {{formatStatus(item.processApproval)}}
                    </span>
                  </div>
                  <p class="content-p">
                    <span>
                      <span :title="formatUserJobPos(item)">{{formatUserJobPos(item)}}</span>
                    </span>
                    <span v-if="item.type !== 'CC'">{{formatExecuteTime(item.executeTime)}}</span>
                  </p>
                  <div class="content-memo"
                       :title="item.memo"
                       v-if="item.type === 'APPROVAL'">
                    <span>意见：</span>
                    {{formatMemo(item.memo)}}
                  </div>
                </div>
                <div class="step-content"
                     v-else-if="item.type === 'PARALLEL_START_OR' || item.type === 'PARALLEL_START_AND'">
                  <div class="title">
                    <span>{{item.type === 'PARALLEL_START_OR' ? '或签' : '会签'}}</span>
                    <span></span>
                  </div>
                  <div v-for="(item2, index2) in item.childNode"
                       :key="index2">
                    <div v-for="(item3, index3) in item2.childNode"
                         :key="index3">
                      <p class="content-p">
                        <span>
                          <span :title="formatUserJobPos(item3)">{{formatUserJobPos(item3)}}</span>
                          <span style="color: #858C94">({{formatStatus(item3.processApproval)}})</span>
                        </span>
                        <span v-if="item3.type !== 'CC'">{{formatExecuteTime(item3.executeTime)}}</span>
                      </p>
                      <div class="content-memo"
                           :title="item3.memo"
                           v-if="item3.type === 'APPROVAL'">
                        <span>意见：</span>
                        {{formatMemo(item3.memo)}}
                      </div>
                    </div>
                  </div>
                </div>
              </van-step>
            </van-steps>
          </div>
          <div class="more-cion"
               :class="{'showmore': showmore}"
               @click="showmore = !showmore">
            <i class="iconfont iconcms_xia"></i>
          </div>
        </div>
      </div>
      <div class="basic-information">
        <div class="content-title">退租信息</div>
        <div class="ul-warp">
          <div class="sub-title">房源信息</div>
          <template v-for="(item) in shopInformation">
            <div class="content-ul">
              <span>楼宇</span>
              <span>{{item.buildingName}}</span>
            </div>
            <div class="content-ul">
              <span>楼层</span>
              <span>
                <span v-for="(item2, index2) in item.floor"
                      :key="index2">
                  {{item2}}<i v-if="index2 != item.floor.length - 1">、</i>
                </span>
              </span>
            </div>
            <div class="content-ul shop-number">
              <span>房源号</span>
              <span>
                <span v-for="(item3, index3) in item.shopNumber"
                      :key="index3">
                  {{item3}}<i v-if="index3 != item.shopNumber.length - 1">、</i>
                </span>
              </span>
            </div>
          </template>
        </div>
        <div class="ul-warp">
          <div class="sub-title">退租信息</div>
          <div class="content-ul">
            <span>退租类型</span>
            <span>{{formatLeaseType(contractInfo.leaseType)}}</span>
          </div>
          <div class="content-ul">
            <span>客户名称</span>
            <span>{{contractInfo.contractDTO.tenant.teantName}}</span>
          </div>
          <div class="content-ul">
            <span>品牌名称</span>
            <span>{{contractInfo.contractDTO.tenant.referred}}</span>
          </div>
          <div class="content-ul">
            <span>合同编号</span>
            <span>{{contractInfo.contractDTO.contractNo}}</span>
          </div>
          <div class="content-ul">
            <span>退租面积/m²</span>
            <span>{{contractInfo.contractDTO.area}}</span>
          </div>
          <div class="content-ul">
            <span>退租办理日期</span>
            <span>{{contractInfo.handleDate}}</span>
          </div>
          <div class="content-ul">
            <span>退租日期</span>
            <span>{{contractInfo.withdrawalDate}}</span>
          </div>
          <div class="content-ul">
            <span>工商注册地址变更时间</span>
            <span>{{contractInfo.businessUpdateDate}}</span>
          </div>
        </div>
        <div class="ul-warp">
          <div class="sub-title">合同详情</div>
          <div class="content-ul">
            <span>合同起止日</span>
            <span>{{contractInfo.contractDTO.startDate}} ~ {{contractInfo.contractDTO.endDate}}</span>
          </div>
          <div class="content-ul">
            <span>合同签订时间</span>
            <span>{{contractInfo.contractDTO.signtDate}}</span>
          </div>
          <div class="content-ul">
            <span>合同编号</span>
            <span>{{contractInfo.contractDTO.contractNo}}</span>
          </div>
          <div class="content-ul">
            <span>租赁方式</span>
            <span>{{formatRentalMethod(contractInfo.contractDTO.rentalMethod)}}</span>
          </div>
        </div>
      </div>
      <div class="fee-terms-warp">
        <div class="fee-terms">
          <div class="content-title">费用</div>
          <div class="ul-warp billing-details"
               :class="{'details-height': showmore}">
            <div class="sub-title">账单明细</div>
            <div class="content-ul bill-list"
                 v-for="(item, index) in preRentBill.billDTOS"
                 :key="index">
              <div>
                <span>{{item.startDate}}～{{item.endDate}}</span>
                <span>应收：{{item.amount | toLocaleString}}元</span>
              </div>
              <div>
                <span>{{item.feeTypeName}}</span>
                <span>已收：{{item.receivedAmount | toLocaleString}}元</span>
              </div>
              <div>
                <span>{{formatterBillType(item.billType)}}</span>
                <span>待收：{{item.settlementAmount | toLocaleString}}元</span>
              </div>
            </div>
            <div class="content-ul cont-total noborder">
              <div class="total">
                <span>合计：<span>{{preRentBill.totalAmount | toLocaleString}}元</span></span>
              </div>
            </div>
          </div>
          <div class="more-cion"
               v-if="preRentBill.billDTOS && preRentBill.billDTOS.length > 0"
               :class="{'showmore': showmore}"
               @click="showmore = !showmore">
            <i class="iconfont iconcms_xia"></i>
          </div>
        </div>
        <div class="fee-terms">
          <div class="content-title">保证金</div>
          <div class="ul-warp"
               :class="{'details-height': showmore}">
            <div class="content-ul bill-list"
                 v-for="(item, index) in preRentBill.deposits"
                 :key="index">
              <div>
                <span>{{item.feeTypeName}}</span>
                <span>应收：{{item.amount | toLocaleString}}元</span>
              </div>
              <div>
                <span></span>
                <span>已收：{{item.receivedAmount | toLocaleString}}元</span>
              </div>
            </div>
            <div class="content-ul cont-total noborder">
              <div class="total">
                <span>合计：<span>{{preRentBill.depositsTotal | toLocaleString}}元</span></span>
              </div>
            </div>
          </div>
        </div>
        <div class="fee-terms">
          <div class="content-title">其他费用</div>
          <div class="ul-warp">
            <template v-for="(item) in contractInfo.otherFeeDTOS">
              <div class="content-ul">
                <span>账单类型</span>
                <span>{{item.billType==='R'?'收款':'付款'}}</span>
              </div>
              <div class="content-ul">
                <span>费用名称</span>
                <span>{{item.expenseName}}</span>
              </div>
              <div class="content-ul qtfy">
                <span>费用金额</span>
                <span>{{item.amount | toLocaleString}}元</span>
              </div>
            </template>
            <div class="content-ul cont-total"
                 style="margin-top: 0;border-top: none">
              <div class="total">
                <span>合计：<span>{{otherExpenses | toLocaleString}}元</span></span>
              </div>
            </div>
          </div>
        </div>
        <div class="fee-terms">
          <div class="content-title">费用总计</div>
          <div class="ul-warp">
            <div class="content-ul">
              <span>租金结算</span>
              <span>{{preRentBill.totalAmount | toLocaleString}}元</span>
            </div>
            <div class="content-ul">
              <span>保证金结算</span>
              <span>{{preRentBill.depositsTotal | toLocaleString}}元</span>
            </div>
            <div class="content-ul">
              <span>其他费用结算</span>
              <span>{{otherExpenses | toLocaleString}}元</span>
            </div>
            <div class="content-ul cont-total">
              <div class="total">
                <span>总计：<span>{{totalCost | toLocaleString}}元</span></span>
              </div>
            </div>
          </div>
        </div>
        <div class="other-information"
             v-bind:style="{ minHeight: minHeight + 'px' }">
          <div class="content-title">其他资料</div>
          <div class="remarks common">
            <div class="ra-title">
              <span>备注</span>
              <span></span>
            </div>
            <div class="ra-content">
              {{contractInfo.remark}}
            </div>
          </div>
          <div class="annex common">
            <div class="an-title">附件</div>
            <div class="an-item"
                 v-for="(item, index) in contractInfo.annexes"
                 :key="index">
              <div class="image">
                <svg class="icon"
                     aria-hidden="true">
                  <use :xlink:href="getformat(item.annexName)"></use>
                </svg>
              </div>
              <div class="annex-name">{{item.annexName}}</div>
              <ailPreview :ailObj="item"
                          :encrypt="true"
                          class="ailPreview" />
            </div>
          </div>
          <div class="approval-comments common"
               v-if="approvalOperation && !showTips">
            <div class="an-title">审批意见</div>
            <div>
              <textarea v-model="memo"
                        name="pattern"
                        maxlength="500"
                        placeholder="500字以内"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部 -->
    <div class="footer"
         v-if="(this.contractStatus === 'START' && !this.finshed) || approvalOperation"
         :class="{'footer2': this.contractStatus === 'START' && !this.finshed}">
      <div class="closing-btn"
           style="margin-right: 10px;"
           v-if="this.contractStatus === 'START' && !this.finshed">
        <div class="close-button"
             @click="centerDialogVisible">关闭申请</div>
      </div>
      <div class=""
           v-if="approvalOperation && !showTips"
           @click="postTask('REJECT')"
           class="operation-btn reject-btn">驳回</div>
      <div class=""
           v-if="approvalOperation && !showTips"
           @click="postTask('AGREED')"
           class="operation-btn">通过</div>
    </div>
  </div>
</template>

<script>
import AppHeader from '@/components/appHead'
import ailPreview from '@/components/ailPreview.vue'
import common from '@/utils/common.js'
import context from '@/service'
import myMixin from './mixin'
let roterFrom = null
export default {
  name: 'approvalDetails',
  components: { AppHeader, ailPreview },
  mixins: [myMixin],
  data () {
    return {
      memo: '',
      title: '审批详情',
      hshowmore: false,
      showmore: true,
      contractInfo: {
        contractDTO: {
          projectManagement: {
            referred: ''
          },
          tenant: {
            referred: '',
            teantName: ''
          }
        }
      },
      shopInformation: [],
      flowChartData: [{
        processTaskVersion: ''
      }],
      showTag: false,
      contractStatus: '',
      finshed: '',
      approvalOperation: false,
      preRentBill: [],
      otherExpenses: '',
      showTips: false,
      minHeight: '',
      historyFlowChartData: [],
      totalCost: '',
      titleType: '',
      processInstances: {}
    }
  },
  created () {
    let row = this.$route.query.row
    row = JSON.parse(row)
    this.row = row
    if (sessionStorage.getItem('titleType')) {
      this.titleType = sessionStorage.getItem('titleType')
      sessionStorage.removeItem('titleType')
    } else if (roterFrom === 'messageDetails') {
      // 消息中心跳转默认已处理
      this.titleType = '已处理'
    }
    this.getFlowMap()
    this.initQuery(row)
    this.followRecord()
    this.approvalOperation = JSON.parse(this.$route.query.approvalOperation)
    this.finshed = JSON.parse(this.$route.query.finshed)
    this.processDefineName = this.$route.query.processDefineName
    this.contractNo = this.$route.query.contractNo
    if ((row.processApproval === 'REJECT' || row.processApproval === 'WITHDRAW') && row.processDetailType === 'START') {
      this.showTips = true
    }
    if (this.showTips) {
      this.hshowmore = true
      this.showmore = false
    } else {
      this.hshowmore = false
      this.showmore = true
    }
  },
  beforeRouteEnter (to, from, next) {
    roterFrom = from.name
    next()
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  beforeRouteLeave (to, from, next) {
    if (to.name !== 'followRecordData') {
      sessionStorage.getItem('businessInfo') ? sessionStorage.removeItem('businessInfo') : null
    }
    next()
  },
  mounted () {
    this.$nextTick(() => {
      if (roterFrom === 'approvalList') {
        this.$emit('changeScroll', 0)
      }
      let headH = document.querySelector('#app-head').clientHeight + document.querySelector('.navs').clientHeight
      this.minHeight = document.body.clientHeight - headH
    })
  },
  methods: {
    completeProcess (type) {
      this.$router.push({ name: 'flowChart', params: { ccTaskId: this.row.ccTaskId, id: this.row.id, type: type } })
    },
    initQuery (row) {
      context.http.get(`cms/api/process-instances/${row.id}`).then(result => { // 请求合同号和流程名称
        if (result.status === 200) {
          this.processInstances = result.data
        }
      })
    },
    getFlowMap () { // 请求流程图
      let row = this.row
      if (row.ccTaskId) {
        context.http.get('cms/api/process-cctask/now/app/' + row.ccTaskId).then(res => { // 请求流程图
          let flowChartData = res.data
          this.flowChartData = flowChartData[0]
          // 历史审批流程
          let historyFlowChartData = flowChartData.slice(0)
          historyFlowChartData.shift()
          this.historyFlowChartData = historyFlowChartData
          this.surrenderInfo(row.businessId)
          this.contractStatus = row.processDetailType
          this.taskId = row.taskId // taskId 任务id  用于提交任务（审核通过、驳回 重新发起等）
        })
      } else {
        context.http.get('cms/api/process-task-versions/now/app/' + row.id).then(res => { // 请求流程图
          let flowChartData = res.data
          this.flowChartData = flowChartData[0]
          // 历史审批流程
          let historyFlowChartData = flowChartData.slice(0)
          historyFlowChartData.shift()
          this.historyFlowChartData = historyFlowChartData
          this.surrenderInfo(row.businessId)
          this.contractStatus = row.processDetailType
          this.taskId = row.taskId // taskId 任务id  用于提交任务（审核通过、驳回 重新发起等）
        })
      }
    },
    async surrenderInfo (id) { // 退租详情
      let result = await context.http.get(`cms/api/lease-contracts/${id}`)
      let contractInfo = result.data
      let newList = []
      contractInfo.contractDTO.rooms.forEach(item => {
        let newItem = newList.find((i) => i.buildingName === item.building.buildingName)
        if (!newItem) {
          newList.push({
            buildingName: item.building.buildingName,
            shopNumber: [item.shopNumber],
            floor: [item.floor.name]
          })
        } else {
          newItem.shopNumber.push(item.shopNumber)
          newItem.floor.push(item.floor.name)
        }
      })
      newList.forEach(ele => {
        ele.floor = Array.from(new Set(ele.floor))
      })
      this.shopInformation = newList
      this.contractInfo = contractInfo
      this.rentBill() // 租金列表
    },
    rentBill () {
      let withdrawalDate = this.contractInfo.withdrawalDate
      let d = new Date(withdrawalDate)
      let getMonth = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)
      let getDate = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
      var times = d.getFullYear() + '-' + (getMonth) + '-' + getDate
      context.http.get('cms/api/history-bills/lease', { contractId: this.contractInfo.contractDTO.id, leaseType: this.contractInfo.leaseType, withdrawalDate: times }).then(res => {
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
    formatLeaseType (type) { // 退租类型
      switch (type) {
        case 'MATURITY':
          return '到期退租'
        case 'RELIEVE':
          return '解除合同'
      }
    },
    formatterBillType (val) {
      return val === 'R' ? '收款' : '付款'
    },
    getformat (annexName) {
      return common.getformat(annexName)
    },
    centerDialogVisible () {
      this.$dialog.confirm({
        title: '关闭申请',
        message: '关闭申请后，该审批流程结束'
      })
        .then(() => {
          this.postTaskHd('CLOSE')
        })
        .catch(() => {
          // on cancel
        })
    },
    routeTo () {
      let info = {}
      info.id = this.row.id
      info.taskId = this.row.taskId
      sessionStorage.setItem('businessInfo', JSON.stringify(info))
      window.sessionStorage.setItem('upDateRecord', true)
      this.$router.push({ name: 'followRecordData' })
    },
    followRecord () {
      context.http.get(`cms/api/queryTaskFollowRecords/${this.row.id}`, {refresh: false}).then(res => {
        if (res.status === 200) {
          let temp = false
          temp = res.data.some(item => {
            return item.onRead === false
          })
          this.showTag = temp
        }
      })
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
    formatMemo (memo) {
      if (!memo || memo === '') {
        return '无'
      } else {
        return memo
      }
    },
    formatExecuteTime (t) { // 流程节点时间
      return t ? t.slice(0, 16).replace('T', ' ') : '-'
    },
    formatUserJobPos (item) { // 员工岗位姓名
      if (item.type === 'CC') {
        return item.userName.length > 0 ? item.userName.join('、') : ''
      } else {
        return `${item.userName.length > 0 ? item.userName.join('、') : '--'}(${item.jobPosition[0] ? item.jobPosition[0] : '--'})`
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
    formatRentalMethod (val) {
      return val === 'RENT' ? '固定租金' : val === 'POINTS' ? '扣点' : '保底扣点'
    },
    async postTask (approvalResult) {
      if (this.memo === '' && approvalResult === 'REJECT') {
        this.$toast('请填写审批意见')
        return
      }
      if (this.memo !== '' && approvalResult === 'REJECT') {
        this.$dialog.confirm({
          message: '确定驳回吗？',
          className: 'dialogTitle'
        })
          .then(() => {
            this.postTaskHd(approvalResult)
          })
          .catch(() => {
            // on cancel
          })
      }
      if (approvalResult === 'AGREED') {
        this.$dialog.confirm({
          message: '确定通过吗？',
          className: 'dialogTitle'
        })
          .then(() => {
            this.postTaskHd(approvalResult)
          })
          .catch(() => {
            // on cancel
          })
      }
    },
    async postTaskHd (approvalResult) {
      await context.http.put('cms/api/process-task', { taskId: this.taskId, taskResult: approvalResult, memo: this.memo })
      this.$toast('操作成功')
      setTimeout(this.$router.replace({ name: 'approvalCenter' }), 800)
    }
  }
}
</script>

<style lang="scss">
@import "../../../style/config";
.approvalDetails {
  .agree {
    i {
      display: block;
      width: rem(20);
      height: rem(20);
      transform: scale(0.5);
      background-color: #3575f6;
      border-radius: 50%;
    }
  }
  .rightBtn {
    position: relative;
    .spTag {
      display: inline-block;
      width: rem(8);
      height: rem(8);
      border-radius: 50%;
      background-color: $color-red-1;
      position: absolute;
      right: rem(10);
      top: rem(6);
    }
  }
  .reject {
    i {
      width: rem(20);
      height: rem(20);
      transform: scale(0.5);
      background-color: #fc5159;
    }
  }
  .wait {
    i {
      width: rem(20);
      height: rem(20);
      transform: scale(0.5);
      background-color: #d9d9d9 !important;
    }
  }
  .auto {
    i {
      display: block;
      width: rem(20);
      height: rem(20);
      transform: scale(0.5);
      background-color: #d9d9d9;
      border-radius: 50%;
    }
  }
  .step-content {
    > div {
      margin-bottom: rem(10);
    }
    .title {
      display: flex;
      justify-content: space-between;
      span {
        &:first-child {
          color: #18191a;
          font-size: rem(16);
          font-weight: bold;
        }
        &:last-child {
          font-size: rem(15);
        }
      }
      .agree {
        color: rgb(28, 194, 150);
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
    }
    .content-p {
      display: flex;
      justify-content: space-between;
      font-size: rem(14);
      > span {
        color: #18191a;
        &:last-child {
          color: #858c94;
          white-space: nowrap;
        }
      }
    }
    .content-memo {
      color: #18191a;
      margin-top: rem(10);
      span {
        color: #858c94;
      }
    }
  }
}
.dialogTitle {
  .van-dialog__message {
    font-size: rem(16);
    font-weight: bold;
  }
}
</style>
<style lang="scss" scoped>
@import "../../../style/config";
/* 导航栏的样式 */
.navs {
  position: fixed;
  top: rem(40);
  width: 100%;
  height: rem(40);
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 3;
  box-shadow: 0px 1px 4px 0px rgba(230, 230, 230, 0.5);
}
.navs li {
  font-size: rem(15);
  color: #444547;
}
/* 当导航被点亮后改变颜色 */
.navs .active {
  color: #0139a4;
  font-size: rem(17);
  font-weight: bold;
}
.underline {
  width: rem(70);
  height: rem(3);
  background: rgba(1, 57, 164, 1);
  border-radius: rem(2);
  position: relative;
  top: rem(6);
}
/* 内容区的样式 */
.content {
  width: 100%;
  position: relative;
  top: rem(82);
  padding-bottom: rem(100) !important;
}
.content > div {
  width: 100%;
  // max-height: rem(2000);
  margin-bottom: rem(10);
  background-color: white;
}
.fee-terms-warp {
  background-color: #f8f9fa !important;
  > div {
    background-color: #fff;
  }
}
.fee-terms {
  margin-bottom: rem(10);
}
.qtfy {
  padding-bottom: rem(10);
  border-bottom: rem(1) solid #f0f0f0;
}
.approval-tips {
  width: 100%;
  height: rem(35);
  line-height: rem(35);
  text-align: center;
  background: rgba(238, 243, 255, 1);
  color: #0139a4;
  font-size: rem(14);
  font-weight: bold;
  position: fixed;
  top: rem(40);
  z-index: 3;
}
.hastips-navs {
  top: rem(74);
}
.hastips-content {
  top: rem(120);
}
.approval-process {
  min-height: rem(160);
  position: relative;
  position: relative;
  .statusSeal {
    position: absolute;
    display: inline-block;
    width: rem(104);
    height: rem(50);
    top: rem(10);
    right: 0;
    &.approvalAgreed {
      // background-image: url(../../../../assets/agree.png);
    }
    &.approvalReject {
      // background-image: url(../../../../assets/reject.png);
    }
    &.approvalclose {
      // background-image: url(../../../../assets/closeIcon.png);
    }
    i {
      font-size: rem(48);
      &.iconshenpitongguo {
        color: #1cc296;
      }
      &.iconshenpijujue {
        color: #fc5159;
      }
    }
  }
  .flow-chart {
    padding-top: rem(14);
    .wait {
      i {
        background-color: #d9d9d9;
      }
    }
    .agree {
      i {
        display: block;
        width: 5px;
        height: 5px;
        background-color: #3575f6;
        border-radius: 50%;
      }
    }
    .reject {
      i {
        background-color: #fc5159;
      }
    }
  }
}
.more-cion {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0139a4;
  transition: transform 0.5s;
  i {
    margin-top: rem(10);
    padding-bottom: rem(10);
  }
}
.showmore {
  transform: rotate(180deg);
  transform-origin: center center;
}
.content-title {
  color: #18191a;
  font-size: rem(17);
  height: rem(40);
  line-height: rem(40);
  font-weight: bold;
  padding-left: rem(14);
  border-bottom: rem(1) solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  span {
    font-size: rem(12);
    color: #0139a4;
    padding-right: rem(14);
  }
}
.history-warp {
  height: rem(83);
  overflow: hidden;
}
.completeH {
  height: auto;
}
.historyflow-warp {
  position: relative;
  border-top: rem(1) solid #f0f0f0;
  &:nth-of-type(1) {
    border: none;
  }
}
.sub-title {
  color: #18191a;
  font-size: rem(15);
  font-weight: bold;
  margin-top: rem(14);
}
.ul-warp {
  margin: 0 rem(14) 0 rem(14);
  border-bottom: rem(1) solid #f0f0f0;
  padding-bottom: rem(16);
  &:last-child {
    border: none;
  }
}
.approcess-ul-warp {
  position: relative;
  padding-bottom: 0;
}
.content-ul {
  display: flex;
  justify-content: space-between;
  padding-top: rem(16) !important;
  font-size: rem(15);
  > span {
    color: #18191a;
    &:first-child {
      color: #858c94;
    }
  }
  .total {
    padding-top: rem(14);
    span {
      span {
        color: #cb444a;
      }
    }
  }
}
.cont-total {
  justify-content: flex-end;
  border-top: rem(1) solid #f0f0f0;
  padding-top: 0 !important;
  margin-top: rem(14);
}
.noborder {
  border: none !important;
  margin-top: 0;
}
.flow-start {
  border-bottom: rem(1) solid #f0f0f0;
  padding-bottom: rem(10);
}
.billing-details {
  height: rem(140);
  overflow: hidden;
  border: none;
  padding: 0;
}
.margin-details {
  padding-bottom: 0;
  > div {
    &:last-child {
      border: none;
    }
  }
}
.details-height {
  height: auto;
}
.bill-list {
  display: inline-block !important;
  width: 100%;
  color: #18191a;
  font-size: rem(15);
  border-bottom: rem(1) solid #f0f0f0;
  padding-bottom: rem(8);
  > div {
    display: flex;
    justify-content: space-between;
    padding-top: rem(10);
    &:first-child {
      padding-top: 0;
    }
    span {
      &:first-child {
        color: #858c94;
      }
    }
    .feeTypeName {
      color: #18191a !important;
    }
  }
}
.shop-number {
  > span {
    &:last-child {
      display: inline-block;
      width: 75%;
      overflow: hidden;
      text-align: right;
    }
  }
}
.other-information {
  .common {
    margin: 0 rem(14) 0 rem(14);
    font-size: rem(15);
    color: #18191a;
    border-bottom: rem(1) solid #f0f0f0;
    > div {
      margin-top: rem(14);
    }
    &:last-child {
      border: none;
    }
    textarea {
      width: 100%;
      height: rem(300);
    }
  }
  .ra-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: rem(14);
    span {
      &:first-child {
        color: #858c94;
      }
    }
  }
  .an-title {
    color: #858c94;
    padding-bottom: rem(14);
  }
  .ra-content {
    margin-bottom: rem(14);
  }
  .an-item {
    display: flex;
    align-items: center;
    &:nth-of-type(2) {
      margin-top: 0;
    }
    .image {
      margin-right: rem(10);
    }
    .annex-name {
      width: 80%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      margin-bottom: rem(4);
    }
    .ailPreview {
      flex: 1;
      text-align: right;
    }
  }
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background: rgba(255, 255, 255, 0.6);
  height: rem(70);
  font-size: rem(17);
  div {
    &:first-child {
      width: rem(160);
      height: rem(50);
      line-height: rem(50);
      text-align: center;
      background: #fd8b8d;
      border-radius: rem(4);
      color: #fff;
    }
    &:last-child {
      width: rem(160);
      height: rem(50);
      line-height: rem(50);
      text-align: center;
      background: rgba(1, 57, 164, 1);
      border-radius: rem(4);
      color: #ffffff;
    }
  }
}
.footer2 {
  .closing-btn,
  .close-button {
    width: rem(100) !important;
  }
  .operation-btn {
    width: rem(100) !important;
  }
  .reject-btn {
    width: rem(100) !important;
    height: rem(50);
    line-height: rem(50);
    text-align: center;
    background: #fd8b8d;
    border-radius: 0.1rem;
    color: #fff;
  }
}
</style>
