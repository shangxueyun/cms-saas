<template>
  <div id="contractTenancy"
       class="relaunchApproval">
    <div class="titlebar">
      <i class="back"
         @click="backToapprovalCenter"></i>
      <span>{{approvalName}}</span>
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
      <div class="newlystep2 basics-design"
           v-if="newlystep2">
        <el-form :model="addData"
                 :rules="rules"
                 ref="ruleForm">
          <el-form-item prop="currencyForm.title"
                        label="标题">
            <el-input v-model="addData.currencyForm.title"
                      maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="currencyForm.content"
                        label="内容">
            <el-input type="textarea"
                      :rows="5"
                      placeholder="500字以内"
                      maxlength="500"
                      resize="none"
                      v-model="addData.currencyForm.content">
            </el-input>
          </el-form-item>
          <el-form-item label="组织">
            <div style="padding-top: 10px">{{addData.currencyForm.organizeName}}</div>
          </el-form-item>
          <div class="enclosure">
            <span style="display:block;width:60px;color:#777">附件</span>
            <div style="display: flex;justify-content: space-between;align-items: center;flex:1">
              <!-- <input type="file"
                     @change="imageChange($event)"> -->
              <aliUpload class="aliUpload deviceDetails"
                         upLoadText="上传附件"
                         :iconShow="false"
                         :iconImg="iconImg"
                         :uploadIcon="true"
                         :multiple="true"
                         @setAnnex="setAnnexs" />
              <div class="annexList"
                   style="70%">
                <div v-for="(item, index) in addData.currencyForm.annexes"
                     :key="index"
                     style="margin-bottom: 10px;display: flex">
                  {{item.annexName}}
                  <span style="display: flex;">
                    <ailPreview :ailObj="item"
                                :encrypt="true"
                                :picturePreview="true" />
                    <i @click="deleFile(item, index)"
                       class="iconfont icon-lajixiang"
                       style="margin-left: 10px;cursor: pointer;"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="dc-right"
         style="width: 100%;margin-top:100px;margin-bottom: 30px"
         v-if="newlystep2">
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
                :class="{'red': item.processApproval !== 'AGREED'}">{{item.processApproval === 'AGREED' ? '通过' : '驳回'}}</span>
          <span style="width: 10%;text-align: center">{{item.executeTime.replace('T', ' ')}}</span>
          <span style="width: 20%;text-align: center">
            <div v-for="(item2, index2) in item.annexes"
                 :key="index2">
              {{item2.annexName}}
              <i @click="downloadFile(item2)"
                 class="iconfont icon-xiazaidaoru"
                 style="margin-left: 10px;"></i>
            </div>
          </span>
        </div>
      </div>
    </div>
    <div slot="footer"
         class="fixed-footer"
         style="display: flex;justify-content: flex-end;">
      <div class="closing-btn"
           style="margin-right: 20px;">
        <el-button class="close-button"
                   @click="centerDialogVisible = true"
                   v-if="approvalOperation">关闭申请</el-button>
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
        <el-button type="primary"
                   class="defaultbtn dialog-confirmBtn"
                   v-if="newlystep2 && approvalOperation"
                   @click="postTask('REJECT')">再次发起审批</el-button>
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
                   @click="postTaskClose('CLOSE')">确 定</el-button>
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
import axios from 'axios'
import ailPreview from '@/components/ailPreview.vue'
import aliUpload from '@/components/aliUpload.vue'
import followDetails from './components/followDetails.vue'
import domtoimage from 'dom-to-image'
export default {
  name: 'derate',
  components: {
    branchWrap,
    ailPreview,
    aliUpload,
    followDetails
  },
  data () {
    return {
      iconImg: 'icon-shangchuanfujianicon',
      centerDialogVisible: false,
      followDetails: false,
      followDetailsData: {},
      approvalName: '',
      showRecord: false,
      addData: {
        currencyForm: {
          title: '',
          content: '',
          annexes: []
        }
      },
      detailsData: {},
      approvalOperation: true,
      newlystep1: true,
      newlystep2: false,
      rules: {
        'currencyForm.title': [
          { required: true, message: '请输入标题', trigger: 'change' }
        ],
        'currencyForm.content': [
          { required: true, message: '请输入内容', trigger: 'change' }
        ]
      },
      contractStatus: '',
      finshed: false,
      taskId: '',
      detailsDataList: [],
      memo: '', // 审批意见
      historyOrNowTab: [
        { label: '当前审批流程', value: '0' },
        { label: '历史审批流程', value: '2' }
      ],
      historyOrNowTabIndex: 0,
      processInfo: '',
      processDefineName: null,
      contractNo: null,
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
    this.getProcessTasks(this.$route.params.row.id)
    this.addData.taskId = this.$route.params.row.taskId
    this.getApprovalInfo(this.$route.params.row.businessId)
    this.NunOnRent = this.$route.params.onRent
    this.followDetailsData = this.$route.params.row
    // this.approvalName = this.$route.params.row.typeCN
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
        this.addData.currencyForm = res.data
      })
    },
    getFlowMap () { // 请求流程图
      let row = this.$route.params.row
      if (row.ccTaskId) {
        context.http.get(`/cms/api/process-cctask/now/${row.ccTaskId}`).then(res => { // 请求流程图
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
    getProcessTasks (id) {
      context.http.get('/cms/api/process-tasks/processInstance?processInstanceId=' + id).then(res => { // 审批内容
        this.processInfo = res.data
      })
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
      }
    },
    newlystepNoe () {
      if (this.newlystep1) {
        this.newlystep1 = false
        this.newlystep2 = true
      }
    },
    async postTask (approvalResult) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          context.http.post('/cms/api/currency-form/repost', this.addData).then(res => {
            if (res.status === 201) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.$router.push({ name: 'approvalCenter', params: { onRent: this.$route.params.onRent } })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async postTaskClose (approvalResult) {
      await context.http.put('/cms/api/process-task', { taskId: this.addData.taskId, taskResult: approvalResult, memo: this.memo })
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
    // closeApprovalDialog () {
    //   this.$emit('approvalDialogClose')
    // },
    trimStr (str) { return str.replace(/(^\s*)|(\s*$)/g, '') },
    deleFile (item, index) {
      this.addData.currencyForm.annexes.splice(index, 1)
    },
    setAnnexs (annexURL, annexName) {  // 子组件上传成功返回文件url 和名字
      this.addData.currencyForm.annexes.push({
        'annexName': annexName,
        'annexURL': annexURL
      })
    },
    imageChange (event) {
      let files = event.target.files
      let form = new FormData()
      form.append('file', files[0])
      let name = files[0].name
      let annexes = this.addData.currencyForm.annexes
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
        this.addData.currencyForm.annexes.push({
          'annexName': name,
          'annexURL': res.data
        })
      }).catch(error => {
        console.info(error)
      })
    },
    drawerClose () {
      this.followDetails = false
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
    }
  }
}
</script>

<style lang="scss">
@import "../../../style/aflow";
.relaunchApproval {
  position: relative;
  .dingflow-design .add-node-btn-box:before {
    margin: 0!important;
    left: 50%!important;
  }
  .dingflow-design .branch-box .col-box:before {
    margin: 0!important;
    left: 50%!important;
  }
  .dl-head {
    margin-top: 10px;
  }
  // .dialog-footer {
  //   display: flex;
  //   justify-content: flex-end;
  //   border-top: 1px solid #e5e5e5;
  //   padding: 20px 0;
  //   text-align: right;
  //   margin-top: 20px;
  //   margin-right: 38px;
  // }
  .warn-dialog-footer {
    margin: 0;
  }
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
    .dr-head {
      background-color: #fafafa;
      height: 40px;
      line-height: 40px;
      padding-left: 12px;
      font-size: 14px;
      margin-bottom: 20px;
      position: relative;
      span {
        position: absolute;
        right: 10px;
        cursor: pointer;
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
      height: 50px;
      line-height: 50px;
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
    }
  }
  .dl-content {
    width: 100%;
    margin-bottom: 20px;
    .dc-right {
      border: 1px solid #e7e7e7;
      margin-top: 100px;
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
  .el-textarea__inner {
    height: 100px;
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
    background-color: #fff;
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
    }
    .derateInfo {
      border-bottom: 1px solid #d9dce2;
    }
    .derateConTENT {
      border-bottom: 1px solid #d9dce2;
      &:last-child {
        border: none;
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
  .basics-design {
    width: 50%;
    margin: 0 auto;
    margin-top: 20px;
    .el-form-item {
      margin: 40px 0;
    }
    .el-select {
      width: 100%;
    }
    .el-form-item__content {
      margin-left: 58px !important;
    }
    .textsapn {
      position: relative;
      top: 10px;
    }
  }
  .enclosure {
    .uploads {
      display: inline-block;
      width: 70px;
      text-align: center;
      height: 20px;
      line-height: 20px;
      margin: 0 auto;
      color: #0f75ff;
      border-radius: 4px;
      background-color: #fff;
      position: relative;
      margin-left: 70px;
    }
    input {
      position: absolute;
      right: 0;
      width: 100%;
      height: 20px;
      opacity: 0;
      cursor: pointer;
    }
  }
  .enclosure {
    display: flex;
    .aliUploads {
      opacity: 0;
      top: -20px;
      position: relative;
    }
    .upload {
      display: inline-block;
      width: 70px;
      text-align: center;
      height: 20px;
      line-height: 20px;
      margin: 0 auto;
      color: #0f75ff;
      border: 1px solid #0f75ff;
      border-radius: 4px;
      background-color: #fff;
      position: relative;
      margin-left: 30px;
      font-size: 12px;
    }
    input {
      position: absolute;
      right: 0;
      width: 100%;
      height: 20px;
      opacity: 0;
      cursor: pointer;
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
      > input {
        right: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
        width: 100%;
        height: 100%;
        position: absolute;
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
