<template>
  <div id="contractTenancy"
       class="customApproval">
    <div class="titlebar">
      <i class="back"
         @click="backToapprovalCenter"></i>
      <span>{{approvalInfo.typeCN}}</span>
    </div>
    <div class="dl-head">
      <span class="step"
            :class="{stepActive: newlystep1,  stepActivePast: newlystep2}"><span style="font-size: 20px;">1</span>. 审批流程</span>
      <span class="step"
            :class="{stepActive: newlystep2}"><span style="font-size: 20px;">2</span>. 审批内容</span>
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
                <div class="contractNum">{{contractNo?'合同编号':'审批流程名称'}}：{{contractNo?contractNo:processDefineName}}</div>
                <div class="contractNum"
                     style="top:40px">审批标题/品牌：{{brandTitle}}</div>
                <div class="number"
                     style="top:60px">审批编号：{{itm.processTaskVersion}}</div>
                <div class="number"
                     style="top:80px"
                     v-if="itm.processDefineNo">流程编号：{{itm.processDefineNo}}</div>
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
                            <i v-if="(item.type !== 'START' || item.processApproval === 'WITHDRAW') && item.type !== 'CC' "
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
        <div style="background-color: #f9f9f9;padding-bottom: 10px;"> 审批内容</div>
        <div class="dl-content clearfix">
          <div class="dc-right float-right"
               style="width: 100%;margin-top:0">
            <div class="dr-head"
                 style="margin-bottom: 0">标题</div>
            <div class="other-info"
                 style="min-height:60px;padding:14px;color:#666"> <span>{{approvalInfo.title}}</span></div>
          </div>
          <div class="dc-right float-right"
               style="width: 100%;margin-top:20px">
            <div class="dr-head"
                 style="margin-bottom: 0">正文</div>
            <div class="other-info"
                 style="min-height:100px;padding:14px;color:#666"> <span>{{approvalInfo.content}}</span></div>
          </div>
          <div class="dc-right float-right"
               style="width: 100%">
            <div class="enclosure">
              <div class="enclosure-head">发起人附件</div>
              <div class="enclosure-head"
                   style="border-bottom: 2px solid #D8DCE3;background-color:#fff">
                <span>文件名</span>
                <span>操作</span>
              </div>
              <div class="enclosure-list"
                   v-if="approvalInfo.annexes">
                <div class="el-item"
                     style="display: flex"
                     v-for="(item, index) in approvalInfo.annexes"
                     :key="index">
                  <span>
                    {{item.annexName}}
                  </span>
                  <span style="display: flex">
                    <ailPreview :ailObj="item"
                                :encrypt="true"
                                :picturePreview="true" />
                    <aliDownLoad :item="item" />
                    <!-- <i @click="downloadFile(item)"
                       class="iconfont icon-xiazaidaoru"
                       style="margin-right: 10px;cursor: pointer;"></i> -->
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="dc-right float-right"
               style="width: 100%;margin-top:20px;margin-bottom: 30px">
            <div class="dr-head"
                 style="margin-bottom: 0">
              审批记录
              <span class=""
                    @click="showRecord = !showRecord"><i class="iconfont icon-right"
                   :class="{'icon-bottom': showRecord}"></i></span>
            </div>
            <div class="other-info derateDetails"
                 v-if="showRecord">
              <div class="derateInfo">
                <span style="width: 15%;padding-left: 50px;">审批人</span>
                <span style="width: 45%;text-align: center">审批意见</span>
                <span style="width: 8%;text-align: center">审批结果</span>
                <span style="width: 10%;text-align: center">审批时间</span>
                <span style="width: 20%;text-align: center">附件</span>
              </div>
              <div class="derateConTENT"
                   v-for="(item, index) in processInfo"
                   :key="index">
                <span style="width: 15%;padding-left: 50px;">{{item.userName}}</span>
                <span style="width: 45%;text-align: center">{{item.memo}}</span>
                <span style="width: 8%;text-align: center"
                      :class="{'red': item.processApproval !== 'AGREED'}">{{item.processApproval === 'AGREED' ? '通过' : item.processApproval === 'CLOSE' ? '关闭' : '驳回'}}</span>
                <span style="width: 10%;text-align: center">{{item.executeTime.replace('T', ' ')}}</span>
                <span style="width: 20%;text-align: center">
                  <span v-for="(item2, index2) in item.annexes"
                        :key="index2"
                        style="display: flex;padding-left: 100px;">
                    {{item2.annexName}}
                    <ailPreview :ailObj="item2"
                                :encrypt="true"
                                :picturePreview="true"
                                style="margin-left: 10px;" />
                    <aliDownLoad :item="item2"
                                 :encrypt="true" />
                    <!-- <i @click="downloadFile(item2)"
                       class="iconfont icon-xiazaidaoru"
                       style="margin-left: 10px;"></i> -->
                  </span>
                </span>
              </div>
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
          <span style="display: inline-block;margin-top: 20px"
                v-if="approvalOperation">填写审批内容</span>
          <div class="dc-right float-right"
               style="width: 100% ;border:none;border: 1px solid #eee;"
               v-if="approvalOperation">
            <div class="dr-head"
                 style="margin-bottom: 0">审批意见</div>
            <div class="textArea"
                 style="background-color:#ffffff">
              <el-input type="textarea"
                        :rows="4"
                        placeholder="500字以内"
                        resize="none"
                        maxlength="500"
                        style="border: none"
                        v-model="memo">
              </el-input>
            </div>
          </div>
          <div class="dc-right float-right"
               style="width: 100%"
               v-if="approvalOperation">
            <div class="enclosure">
              <div class="enclosure-head">我的附件
                <div class="upload">
                  上传附件
                  <input type="file"
                         @change="imageChange($event)">
                </div>
              </div>
              <div class="enclosure-head"
                   style="border-bottom: 1px solid #D8DCE3;background-color:#fff">
                <span>文件名</span>
                <span>操作</span>
              </div>
              <div class="enclosure-list"
                   v-if="annexes">
                <div class="el-item"
                     v-for="(item, index) in annexes"
                     :key="index">
                  <span>{{item.annexName}}</span>
                  <span>
                    <i @click="deleFile(item, index)"
                       class="iconfont icon-lajixiang"
                       style="margin-right: 10px;"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="dc-right float-right"
               style="width: 100%"
               v-if="approvalOperation">
            <div class="dr-head"
                 style="margin-bottom: 0">临时抄送人
              <div class="upload temporary"
                   @click="dialogVisible = true;queryOrganizeList()">添加临时抄送人</div>
            </div>
            <div class="other-info process-content"
                 style="min-height:60px;padding:20px;color:#999999">
              <!-- <span v-for="(item, index) in processList" :key="index" style="margin-right: 10px;">{{item.userName}}</span> -->
              <div class="process-list"
                   v-for="(item, index) in processList"
                   :key="index">
                <div class="process-item"
                     style="padding-left: 6px;">
                  {{item.label}}
                  <span class="delete"
                        @click="delProcess(index, item)">
                    <span class="iconfont icon-cha"></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer"
         class="dialogfooter">
      <div class="closing-btn">
        <!-- <el-button class="close-button" @click="postTask('CLOSE')" v-if="approvalOperation && newlystep2">关闭申请</el-button>
        <el-tooltip class="item" effect="dark" placement="right-start" v-if="approvalOperation && newlystep2">
          <div slot="content">关闭申请<br /></div>
          <i class="icon question-mark-icon" style="position: relative;top: -15px;"></i>
        </el-tooltip> -->
      </div>
      <div>
        <el-button type="primary"
                   @click="previousStep"
                   class="close-button"
                   v-if="newlystep2">上一步</el-button>
        <el-button type="primary"
                   @click="newlystepNoe()"
                   class="defaultbtn dialog-confirmBtn"
                   v-if="newlystep1">下一步</el-button>
        <el-button type="danger"
                   class="dialog-confirmBtn"
                   v-if="newlystep2 && approvalOperation"
                   @click="postTask('REJECT')">驳回</el-button>
        <el-button type="primary"
                   class="defaultbtn dialog-confirmBtn"
                   v-if="newlystep2 && approvalOperation"
                   @click="postTask('AGREED')">通过</el-button>
        <el-button type="primary"
                   class="defaultbtn dialog-confirmBtn"
                   v-if="showOnRent && withdraw && newlystep2 && this.contractStatus !== 'START'"
                   @click="withdrawTask('WITHDRAW')">撤回</el-button>
      </div>
    </div>

    <el-dialog title="添加临时抄送人"
               :visible.sync="dialogVisible"
               width="500px">
      <div class="process-content">
        <div class="process-list"
             v-for="(item, index) in processList"
             :key="index">
          <div class="process-item">
            {{item.label}}
            <!-- <span class="delete"
                  @click="delProcess(index, item)"
                  v-if="index === processList.length - 1">
              <span class="iconfont icon-cha"></span>
            </span> -->
          </div>
        </div>
      </div>
      <!-- <div>
        <el-input v-model="copier" placeholder="姓名/岗位" @input="copierSearch"></el-input>
      </div> -->
      <div class="organization"
           @click.stop="prevent">
        <el-tree :data="orgListCopy"
                 show-checkbox
                 node-key="userId"
                 :check-strictly="true"
                 :default-checked-keys="checkedKeys"
                 @check-change="handleCheckChange"
                 ref="treeForm"
                 :props="defaultProps">
        </el-tree>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="dialogVisible = false">确 定</el-button>
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
import ailPreview from '@/components/ailPreview.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import followDetails from './components/followDetails.vue'
import axios from 'axios'
import domtoimage from 'dom-to-image'
export default {
  name: 'customApproval',
  components: {
    aliDownLoad,
    branchWrap,
    ailPreview,
    followDetails
  },
  data () {
    return {
      withdrawMemo: '',
      followDetails: false,
      followDetailsData: {},
      showRecord: false,
      copier: '',
      dialogVisible: false,
      detailsData: {},
      approvalOperation: true,
      newlystep1: true,
      newlystep2: false,
      contractInfo: {
        contractDTO: {
          projectManagement: null
        }
      },
      checkedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      orgListCopy: [],
      orgList: [],
      processList: [],
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
      approvalInfo: '',
      processInfo: '',
      annexes: [],
      processDefineName: null,
      contractNo: null,
      withdraw: false,
      showOnRent: false,
      brandTitle: '',
      NunOnRent: 0,
      downloading: false
    }
  },
  created () {
    this.getFlowMap()
    this.brandTitle = this.$route.params.brandTitle
    this.approvalOperation = this.$route.params.approvalOperation
    this.finshed = this.$route.params.finshed
    this.processDefineName = this.$route.params.processDefineName
    this.contractNo = this.$route.params.contractNo
    this.getApprovalInfo(this.$route.params.row.businessId)
    this.getProcessTasks(this.$route.params.row.id)
    this.withdraw = this.$route.params.row.processStatus === 'RUNING'
    this.showOnRent = this.$route.params.onRent === 1
    this.NunOnRent = this.$route.params.onRent
    this.followDetailsData = this.$route.params.row
  },
  methods: {
    isShowTab (item, index) { // 是否展示历史流程标签
      if (index === 1 && !item.value > 0) {
        return false
      }
      return true
    },
    getApprovalInfo (id) {
      context.http.get('/cms/api/currency-form/' + id).then(res => { // 审批内容
        this.approvalInfo = res.data
      })
    },
    getProcessTasks (id) {
      context.http.get('/cms/api/process-tasks/processInstance?processInstanceId=' + id).then(res => { // 审批内容
        this.processInfo = res.data
      })
    },
    formatDerateType (reliefType) {
      switch (reliefType) {
        case 'SPECIAL':
          return '特批调整'
        case 'WELFARE':
          return '福利减免'
        case 'COMPENSATE':
          return '补偿减免'
        default:
          return '-'
      }
    },
    getFlowMap () { // 请求流程图
      let row = this.$route.params.row
      if (row.ccTaskId) { // 抄送人
        context.http.get('/cms/api/process-cctask/now/' + row.ccTaskId).then(res => { // 请求流程图
          this.detailsData = res.data
          this.detailsDataList[0] = this.detailsData[0]
          this.historyOrNowTab[1].value = this.detailsData.length - 1
          this.contractStatus = row.processDetailType
        })
      } else {
        context.http.get('/cms/api/process-task-versions/now/' + row.id).then(res => { // 请求流程图
          this.detailsData = res.data
          this.detailsDataList[0] = this.detailsData[0]
          this.historyOrNowTab[1].value = this.detailsData.length - 1
          this.contractStatus = row.processDetailType
        })
      }
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
      }
    },
    newlystepNoe () {
      if (this.newlystep1) {
        this.newlystep1 = false
        this.newlystep2 = true
      }
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
    async postTask (approvalResult) {
      if (this.memo === '' && approvalResult === 'REJECT') {
        this.$message({
          type: 'warning',
          message: '请填写审批意见'
        })
        return
      }
      let userId = this.checkedKeys.join(',')
      await context.http.put('/cms/api/process-task', { taskId: this.$route.params.row.taskId, taskResult: approvalResult, memo: this.memo, userId: userId, annexes: this.annexes })
      this.$message({
        type: 'success',
        message: '操作成功'
      })
      setTimeout(this.$router.push({ name: 'approvalCenter', params: { onRent: this.$route.params.onRent } }), 800)
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
    deleFile (item, index) {
      this.annexes.splice(index, 1)
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
    // closeApprovalDialog () {
    //   this.$emit('approvalDialogClose')
    // },
    trimStr (str) { return str.replace(/(^\s*)|(\s*$)/g, '') },
    copierSearch () { // 抄送人搜素
      context.http.get('/uaa/api/organizes/cc?name=' + this.copier).then(res => {
      })
    },
    async queryOrganizeList () {
      this.orgList = []
      this.orgListCopy = []
      context.http.get('/uaa/api/organizes/cc').then(res => {
        this.orgList = res.data.organizeTree
        this.orgListCopy = JSON.parse(JSON.stringify(this.orgList))
        let cascaderData = []
        this.orgListCopy.forEach(item => {
          cascaderData.push(this.parseOrganize(item))
        })
        this.orgListCopy = cascaderData
      })
    },
    parseOrganize (organizeTree) {
      if (organizeTree.leaf) {
        return {
          userId: organizeTree.data.userId,
          userPostName: organizeTree.data.userPostName,
          userName: organizeTree.data.userName,
          label: organizeTree.data.name ? organizeTree.data.name : (organizeTree.data.userPostName === null ? '' : organizeTree.data.userPostName) + '(' + (organizeTree.data.userName === null ? '' : organizeTree.data.userName) + ')',
          // label: '(' + (organizeTree.data.userPostName === null ? '' : organizeTree.data.userPostName) + ' ' + (organizeTree.data.userName === null ? '' : organizeTree.data.userName) + ')',
          disabled: organizeTree.data.userId === null
        }
      } else {
        return {
          userId: organizeTree.data.userId,
          // label: organizeTree.data.userPostName + '(' + (organizeTree.data.userPostName === null ? '' : organizeTree.data.userPostName) + ' ' + (organizeTree.data.userName === null ? '' : organizeTree.data.userName) + ')',
          label: organizeTree.data.name,
          userPostName: organizeTree.data.userPostName,
          userName: organizeTree.data.userName,
          disabled: organizeTree.data.userId === null,
          children: organizeTree.children.map(item => {
            return this.parseOrganize(item)
          })
        }
      }
    },
    handleCheckChange (data, checked, indeterminate) {
      if (!checked) {
        this.processList.forEach((ele, index) => {
          if (ele.userId === data.userId) {
            this.processList.splice(index, 1)
            this.checkedKeys.splice(index, 1)
          }
        })
      } else {
        this.processList.push(data)
        this.checkedKeys.push(data.userId)
      }
    },
    imageChange (event) {
      let files = event.target.files
      let form = new FormData()
      form.append('file', files[0])
      let name = files[0].name
      let annexes = this.annexes
      for (let i = 0; i < annexes.length; i++) {
        if (annexes[i].annexName === name) {
          return false
        }
      }
      event.target.value = ''
      context.http.post('/ywm/api/image-multipart', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        this.annexes.push({
          'annexName': name,
          'annexURL': res.data
        })
      }).catch(error => {
        console.info(error)
      })
    },
    delProcess (index, item) {
      this.processList.splice(index, 1)
      this.checkedKeys.splice(index, 1)
    },
    drawerClose () {
      this.followDetails = false
    }
  }
}
</script>

<style lang="scss">
@import "../../../style/aflow";
.customApproval {
  .dingflow-design .add-node-btn-box:before {
    margin: 0!important;
    left: 50%!important;
  }
  .dingflow-design .branch-box .col-box:before {
    margin: 0!important;
    left: 50%!important;
  }
  position: relative;
  .dl-head {
    margin-top: 10px;
  }
  .dialogfooter {
    position: fixed;
    width: calc(100% - 285px);
    bottom: 0;
    right: 32px;
    border-top: 1px solid #e5e5e5;
    padding: 20px 0;
    text-align: right;
    margin-top: 20px;
    background-color: #fff;
    opacity: 0.8;
  }
  .dialogfooterss {
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 0;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #e5e5e5;
    padding: 10px 20px;
    text-align: right;
    margin-top: 0;
    background-color: #fff;
    opacity: 0.8;
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
    margin-bottom: 0;
    .enclosure-head {
      background-color: #fafafa;
      height: 40px;
      line-height: 40px;
      padding-left: 12px;
      span {
        display: inline-block;
        padding-left: 40px;
        &:first-child {
          width: 80%;
        }
        &:last-child {
          width: 18%;
          text-align: center;
        }
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
      width: 100%;
      height: 35px;
      line-height: 35px;
      border-bottom: 1px solid #d9dce2;
      &:last-child {
        border: none;
      }
      span {
        display: inline-block;
        padding-left: 40px;
        &:first-child {
          width: 87%;
        }
        &:last-child {
          width: 10%;
          text-align: center;
        }
      }
    }
  }
  .dl-content {
    width: 100%;
    margin-bottom: 20px;
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
        span {
          position: absolute;
          right: 10px;
          cursor: pointer;
        }
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
    }
  }
  .newlystep2 {
    .dl-content {
      width: 100%;
      margin-bottom: 20px;
      .dc-right {
        border: 1px solid #e7e7e7;
        margin-top: 20px;
        font-size: 12px;
        background-color: #fff;
        .dr-head {
          background-color: #fafafa;
          height: 40px;
          line-height: 40px;
          padding-left: 12px;
          font-size: 14px;
          margin-bottom: 20px;
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
  .el-textarea {
    textarea {
      border: none !important;
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
  .derateDetails {
    font-size: 12px;
    > div {
      span {
        display: inline-block;
        line-height: 30px;
        text-align: left;
        vertical-align: top;
        i {
          cursor: pointer;
        }
      }
      &:last-child {
      }
    }
    .derateInfo {
      border-bottom: 1px solid #d9dce2;
    }
    .derateConTENT {
      border-bottom: 1px solid #d9dce2;
      &:last-child {
        border: none;
      }
      .red {
        color: #cb444a;
      }
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
      border: 1px solid rgba(15, 117, 255, 1);
      color: rgba(15, 117, 255, 1);
      border-radius: 4px;
      margin: 8px;
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
  }
  .temporary {
    width: 110px !important;
    height: 28px;
    text-align: center !important;
    background: rgba(255, 255, 255, 1) !important;
    border: 1px solid rgba(208, 208, 208, 1);
    border-radius: 4px;
    color: #666;
    margin: 6px;
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
  .organization {
    height: 200px;
    overflow-y: scroll;
    border: 1px solid transparent;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  }
  .process-content {
    display: flex;
    flex-wrap: wrap;
    min-height: 50px;
    margin-top: 10px;
    .process-list {
      display: flex;
      min-width: 160px;
      padding-right: 10px;
      padding-bottom: 10px;
      .process-item {
        min-width: 140px;
        height: 30px;
        line-height: 30px;
        border-radius: 2px;
        // border: 1px solid rgba(231, 231, 231, 1);
        text-align: center;
        font-size: 14px;
        overflow: hidden;
        background-color: #3577f6;
        border-radius: 4px;
        color: #fff;
        .delete {
          cursor: pointer;
          float: right;
          padding-right: 10px;
          padding-left: 6px;
          span {
            font-size: 12px;
          }
          &:hover {
          }
        }
      }
    }
  }
  .box-scale {
    padding: 120px 0 !important;
    .number {
      left: 10%;
      &:nth-of-type(2) {
        top: 60px;
      }
      &:nth-of-type(3) {
        top: 100px;
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
}
</style>
