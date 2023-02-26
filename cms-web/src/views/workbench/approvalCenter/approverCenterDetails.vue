<template>
  <div id="approverCenterDetails"
       class="approverCenterDetails">
    <div class="titlebar">
      <i class="back"
         @click="backToapprovalCenter"></i>
      <span>{{processInstanceInfo.typeCN==='合同新增' || processInstanceInfo.typeCN==='合同签订'?'合同签订审批':'合同续签审批'}}</span>
    </div>
    <contractApproval :detailsData="detailsData"
                      :processInstanceInfo="processInstanceInfo"
                      :approvalOperation="approvalOperation"
                      :newlystep1="newlystep1"
                      :newlystep2="newlystep2"
                      :newlystep3="newlystep3"
                      :newlystep4="newlystep4"
                      :contractInfo="contractInfo"
                      :billList="billList"
                      :contractStatus="contractStatus"
                      :finshed="finshed"
                      :taskId="taskId"
                      :processDefineName="processDefineName"
                      :contractNo="contractNo"
                      :onRent="this.$route.params.onRent"
                      :processStatus="this.$route.params.row.processStatus"
                      :rowId="this.$route.params.row.id"
                      @changeStepsStaus="changeStepsStaus"
                      v-if="detailsData.length!== 0 " />
    <!-- <div class="menuBar" v-if="stepsNavIndex===0">
        <span class="active">当前审批流程</span>
        <span>历史审批流程(2)</span>
      </div>
      <div class="flowChart" v-if="stepsNavIndex===0">
        <div class="dingflow-design">
          <div class="ie-polyfill-container">
            <div class="box-scale" id="box-scale">
              <div class="node-wrap">
                <div class="node-wrap-box">
                  <div>
                    <div class="title" style="background: rgb(87, 106, 149);"><span class="">发起人</span></div>
                    <div class="content">
                      <div class="text">黄焕明</div>
                    </div>
                  </div>
                </div>
                <div class="add-node-btn-box">
                  <div class="add-node-btn"></div>
                </div>
              </div>
              <div class="branch-wrap">
                <div class="branch-box-wrap" >
                  <div class="branch-box">
                    <div class="col-box">
                      <div class="top-left-cover-line"></div>
                      <div class="bottom-left-cover-line"></div>
                      <div class="condition-node">
                        <div class="condition-node-box">
                          <div class="auto-judge">

                          </div>
                        </div>
                      </div>
                      <div class="condition-node">
                        <div class="condition-node-box">
                          <div class="auto-judge">
  
                          </div>
                        </div>
                      </div>                     
                    </div>
                    <div class="col-box">
                      <div class="condition-node">
                        <div class="condition-node-box">
                          <div class="auto-judge">

                          </div>
                        </div>
                      </div>
                      <div class="condition-node">
                        <div class="condition-node-box">
                          <div class="auto-judge">

                          </div>
                        </div>
                      </div>                      
                      <div class="top-right-cover-line"></div>
                      <div class="bottom-right-cover-line"></div>
                    </div>
                  </div>
                  <div class="add-node-btn-box">
                    <div class="add-node-btn"></div>
                  </div>
                </div>
              </div>
              <div class="end-node">
                <div class="end-node-circle"></div>
                <div class="end-node-text">流程结束</div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
  </div>
</template>

<script>
import context from '@/service'
import contractApproval from './components/contractApproval'
export default {
  name: 'approverCenterDetails',
  components: {
    contractApproval
  },
  data () {
    return {
      formLabelWidth: '',
      rejectDialog: false,
      memo: '',
      detailsData: [],
      processInstanceInfo: {
        startedBy: ''
      },
      contractInfo: {
        projectManagement: {},
        tenant: {}
      },
      approvalOperation: false,
      contractStatus: '',
      billList: [{}],
      finshed: false,
      taskId: null,
      newlystep1: true,
      newlystep2: false,
      newlystep3: false,
      newlystep4: false,
      processDefineName: null,
      contractNo: null
    }
  },
  created () {
    if (!this.$route.params.detailsData) {
      this.$router.push({ name: 'approvalCenter', params: { onRent: this.$route.params.onRent } })
      return
    }
    this.detailsData = this.$route.params.detailsData
    this.processInstanceInfo = this.$route.params.processInstanceInfo
    if (!this.processInstanceInfo.typeCN) this.processInstanceInfo.typeCN = this.$route.params.processInstanceInfo.processDefineTypeName
    this.approvalOperation = this.$route.params.approvalOperation
    this.contractInfo = this.$route.params.contractInfo
    this.billList = this.$route.params.billList
    this.contractStatus = this.$route.params.contractStatus
    this.finshed = this.$route.params.finshed
    this.taskId = this.$route.params.taskId
    this.processDefineName = this.$route.params.processDefineName
    this.contractNo = this.$route.params.contractNo
    if (this.$route.params.newlystep2) {
      this.newlystep1 = false
      this.newlystep2 = this.$route.params.newlystep2
      this.newlystep3 = false
      this.newlystep4 = false
    }
  },
  mounted () {

  },
  methods: {
    backToapprovalCenter () {
      if (this.$route.params.messageHttp) {
        this.$router.push({ name: 'messageCenter', params: this.$route.params })
      } else {
        this.$router.push({ name: 'approvalCenter', params: { onRent: this.$route.params.onRent } })
      }
    },
    changeStepsStaus (obj) {
      this.newlystep1 = obj.newlystep1
      this.newlystep2 = obj.newlystep2
      this.newlystep3 = obj.newlystep3
      this.newlystep4 = obj.newlystep4
    }
  }
}
</script>

<style lang="scss" scoped>
.approverCenterDetails {
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
}
</style>
