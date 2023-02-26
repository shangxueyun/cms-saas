<template>
  <div class="branch-wrap branchWrap"> <!--分支-->
    <div class="branch-box-wrap">
      <div class="branch-box">
        <span class="add-branch" :class="{'PARALLEL_START_AND':branchData.type==='PARALLEL_START_AND','PARALLEL_START_OR':branchData.type==='PARALLEL_START_OR'}"></span>
        <div class="col-box" v-for="(item, index) in branchData.childNode" :key="index"><!-- 左右分支块包 -->
          <div v-if="index === 0 || index === branchData.childNode.length - 1" class="" :class="[index === 0 ? 'top-left-cover-line' : 'top-right-cover-line']"></div>
          <div  v-if="index === 0 || index === branchData.childNode.length - 1" class="" :class="[index === 0 ? 'bottom-left-cover-line' : 'bottom-right-cover-line']"></div>
          <div v-for="(item2, index2) in item.childNode" :key="index2">
            <div class="node-wrap" v-if="item2.type === 'APPROVAL' || item2.type === 'CC'">
              <div class="node-wrap-box">
                <div>
                  <div class="title" :class="[item2.type === 'APPROVAL' ? 'approver-title' : 'notifier-title']">
                    <span>
                      <i class="icon" :class="[item2.type === 'START' ? 'approvalStartIcon': item2.type === 'APPROVAL' ? 'approvalIcon' : 'notifierIcon']"></i>
                      <span>{{item2.name}}</span>
                    </span>
                    <span>
                      <i v-if="item2.type !== 'START' && item2.type !== 'CC' " :class="{
                        'agree':item2.processApproval==='AGREED',
                        'reject':item2.processApproval==='REJECT',
                        'close':item2.processApproval==='CLOSE',
                        'auto':item2.processApproval==='AUTO',
                        'wait':!item2.processApproval}">{{formatStatus(item2.processApproval)}}</i>     
                    </span>
                  </div>
                  <div class="content">
                    <div>
                      <span :title="formatUserJobPos(item2)">{{formatUserJobPos(item2)}}</span>
                      <i v-if="item2.type !== 'CC'">{{formatExecuteTime(item2.executeTime)}}</i>
                    </div>
                    <div>
                      <span :title="item2.memo" v-if="item2.type !== 'START'">意见：{{formatMemo(item2.memo)}}</span>      
                    </div>            
                  </div>
                </div>
              </div>
              <div class="add-node-btn-box">
                <div class="add-node-btn"></div>
              </div>
            </div>
            <branchWrap v-if="item2.childNode && (item2.type === 'PARALLEL_START_AND'||item2.type === 'PARALLEL_START_OR')" :branchData="item2"/>
          </div>
        </div>
      </div>
      <div class="add-node-btn-box">
        <div class="add-node-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'branchWrap',
  props: {
    branchData: {
      type: Object
    }
  },
  data () {
    return {
    }
  },
  created () {},
  methods: {
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
        return `${item.userName.length > 0 ? item.userName.join('、') : '--'}(${item.jobPosition[0] ? item.jobPosition[0] : '--'})`
      }
    },
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
        case null:
          return '等待审核'
      }
    },
    addnode (item, index, e) {
      this.$emit('addnode', item, index, e)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/aflow";
.branchWrap{
  .node-wrap-box {
    width: 250px;
    box-shadow: 1px 1px 8px #bfbfbf;
    .content{
      padding:0px 10px 15px;
      font-size: 14px;
      > div{
        display: flex;
        justify-content:space-between;
        &:first-child{
          >i{
            font-size:12px;
            color: #c6c9d1;
            font-style: normal;
          }
        }
        &:last-child{
          margin-top: 10px;
          >span{
            width: 100%;
            color: #777777;
          }
        }
        >span,i{
          display: inline-block;
          width: 50%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        >i{
          text-align: right;
        }
      }

      .agree{
        color: #61ab5a
      }
      .reject{
        color: #ff0000
      }
      .wait{
        color: #f09851
      }
      .auto{
        color: #5364c5
      }
    }
    .title{
      height: 40px;
      line-height: 40px;
      background-color: #ffffff !important;
      color: #2e2c2c;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 16px;
      .agree{
        color: #61ab5a
      }
      .reject{
        color: #e93223
      }
      .wait{
        color: #f9a218
      }
      .auto{
        color: #4376cd
      }
      .close{
        color: #a7a7a7
      }
      >i.wait{
        display: inline-block;
        width: 30px;
        height: 40px;
        background-image: url(../../../../assets/wait.png);
        background-size: 100% 72%;
        background-repeat: no-repeat;
        background-position: center;
      }
      >i.close{
        display: inline-block;
        width: 30px;
        height: 40px;
        background-image: url(../../../../assets/close.png);
        background-size: 100% 72%;
        background-repeat: no-repeat;
        background-position: center;
      }
      .el-icon-success{
        color: #61ab5a;
        font-size: 24px;
      }
      .el-icon-loading{
        color: #f09851;
        font-size: 24px;
      }
      .el-icon-error{
        color: #ff0000;
        font-size: 24px;
      }
      >span>.icon{
        display: inline-block;
        width: 17px;
        height: 17px;
        margin-right: 10px;
        &.approvalStartIcon{
          background: url(../../../../assets/approvalStartIcon.png) no-repeat;
          background-size: 100% 100%;
        }
        &.approvalIcon{
          background: url(../../../../assets/approval.png) no-repeat;
        }
        &.notifierIcon{
          background: url(../../../../assets/notifierIcon.png) no-repeat;
        }
      }
    }
  }
}
</style>

