<template>
  <div>
    <app-header title="审批流程图">
    </app-header>
    <div class="flowChart"
         style="min-height:500px">
      <div class="dingflow-design">
        <div class="ie-polyfill-container">
          <div class="box-scale"
               v-for="(itm, idx) in detailsDataList"
               :key="idx">
            <!-- <div class="contractNum">{{contractNo?'合同编号':'审批流程名称'}}：{{contractNo?contractNo:processDefineName}}</div>
          <div class="number">审批编号：{{itm.processTaskVersion}}</div> -->
            <span class="statusSeal"
                  :class="{'approvalAgreed':itm.approvalResult==='AGREED','approvalReject':itm.approvalResult==='REJECT','approvalclose':itm.approvalResult==='CLOSE'}"></span>
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
                      <!-- <span>
                        <i v-if="(item.type !== 'START' || item.processApproval === 'WITHDRAW') && item.type !== 'CC' "
                           :class="{
                              'agree':item.processApproval==='AGREED',
                              'reject':item.processApproval==='REJECT' || item.processApproval === 'WITHDRAW',
                              'close':item.processApproval==='CLOSE',
                              'auto':item.processApproval==='AUTO',
                              'wait':!item.processApproval}">{{formatStatus(item.processApproval)}}</i>
                      </span> -->
                    </div>
                    <div class="content">
                      <div>
                        <!-- <span>{{item.userName}}({{item.jobPosition[0]}})</span> -->
                        <span :title="formatUserJobPos(item)">{{formatUserJobPos(item)}}</span>
                        <!-- <i v-if="item.type !== 'CC'">{{formatExecuteTime(item.executeTime)}}</i> -->
                      </div>
                      <div>
                        <!-- <span :title="item.memo"
                              v-if="item.type !== 'START' || item.processApproval === 'WITHDRAW'">
                              <span v-if="item.processApproval === 'WITHDRAW'">撤回原因：</span>
                              <span v-else>意见：</span>
                          {{formatMemo(item.memo)}}
                        </span> -->
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
</template>
<script>
import context from '@/service'
import branchWrap from './branchWrap.vue'
import AppHeader from '@/components/appHead'
export default {
  name: 'flowChart',
  components: {
    AppHeader,
    branchWrap
  },
  data () {
    return {
      detailsDataList: []
    }
  },
  created () {
    this.getFlowMap()
  },
  methods: {
    formatExecuteTime (t) { // 流程节点时间
      return t ? t.slice(0, 16).replace('T', ' ') : '-'
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
    formatUserJobPos (item) { // 员工岗位姓名
      if (item.type === 'CC') {
        return item.userName.length > 0 ? item.userName.join('、') : ''
      } else {
        // return `${item.userName[0] ? item.userName[0] : '--'}(${item.jobPosition[0] ? item.jobPosition[0] : '--'})`
        return `${item.userName.length > 0 ? item.userName.join('、') : '--'}(${item.jobPosition[0] ? item.jobPosition[0] : '--'})`
      }
    },
    getFlowMap () { // 请求流程图
      const ccTaskId = this.$route.params.ccTaskId
      const id = this.$route.params.id
      const type = this.$route.params.type
      if (ccTaskId) { // 抄送人
        context.http.get('cms/api/process-cctask/now/' + ccTaskId).then(res => { // 请求流程图
          if (res.status === 200) {
            this.detailsData = res.data
            if (type === 'history') {
              this.detailsDataList = this.detailsData.slice(1)
            } else {
              this.detailsDataList = [this.detailsData[0]]
            }
          }
        })
      } else {
        context.http.get('cms/api/process-task-versions/now/' + id).then(res => { // 请求流程图
          if (res.status === 200) {
            this.detailsData = res.data
            if (type === 'history') {
              this.detailsDataList = this.detailsData.slice(1)
            } else {
              this.detailsDataList = [this.detailsData[0]]
            }
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/config";
@import "../../../../style/aflow.scss";
.flowChart{
  overflow: scroll;
}
.dingflow-design span.add-branch {
  width: rem(95) !important;
  height: rem(57) !important;
  background-color: transparent !important;
  box-shadow: none !important;
  top: rem(-30) !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  &.PARALLEL_START_AND {
    background-image: url(../../../../assets/branchIcon.png) !important;
  }
  &.PARALLEL_START_OR {
    background-image: url(../../../../assets/huoqianw.png) !important;
  }
}
.node-wrap-box {
  width: rem(200);
  box-shadow: rem(1) rem(1) rem(8) #bfbfbf;
  .content {
    padding: 0px rem(10) rem(10);
    font-size: rem(14);
    > div {
      display: flex;
      justify-content: space-between;
      &:first-child {
        > i {
          font-size: rem(12);
          color: #c6c9d1;
        }
      }
      &:last-child {
        margin-top: rem(10);
        > span {
          width: 100%;
          color: #777777;
        }
      }
      > span,
      i {
        display: inline-block;
        width: 100%;
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
    height: rem(40);
    line-height: rem(40);
    background-color: #ffffff !important;
    font-size: rem(14);
    color: #2e2c2c;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: rem(16);
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
      width: rem(30);
      height: rem(40);
      background-image: url(../../../../assets/wait.png);
      background-size: 100% 72%;
      background-repeat: no-repeat;
      background-position: center;
    }
    > i.close {
      display: inline-block;
      width: rem(30);
      height: rem(40);
      background-image: url(../../../../assets/close.png);
      background-size: 100% 72%;
      background-repeat: no-repeat;
      background-position: center;
    }
    .el-icon-success {
      color: #61ab5a;
      font-size: rem(24);
    }
    .el-icon-loading {
      color: #f09851;
      font-size: rem(24);
    }
    .el-icon-error {
      color: #ff0000;
      font-size: rem(24);
    }
    > span > .icon {
      display: inline-block;
      width: rem(17);
      height: rem(17);
      margin-right: rem(10);
      &.approvalStartIcon {
        // background: url(../../../../assets/approvalStartIcon.png) no-repeat;
        // background-size: 100% 100%;
        width: 0;
        height: 0;
        margin-right: 0;
      }
      &.approvalIcon {
        background: url(../../../../assets/approval.png) no-repeat;
      }
      &.notifierIcon {
        background: url(../../../../assets/notifierIcon.png) no-repeat;
      }
    }
  }
}
</style>
