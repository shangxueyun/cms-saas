<template>
  <div class="branch-wrap branchWrap"> <!--分支-->
    <div class="branch-box-wrap">
      <div class="branch-box" :class="{'branch-box-leadership': !branchData.onFlag, 'toggleClass': this.toggleClass}">
        <span class="add-branch" :class="{'el-icon-circle-plus-outline':branchData.type==='branch_warp'&& this.toggleClass}" @click="addbranch(parentData, branchData)"></span>
        <span class="add-branch" :class="{'el-icon-remove-outline':branchData.type==='branch_warp'&& !this.toggleClass}" @click="addbranch(parentData, branchData)"></span>
        <div class="col-box" v-for="(item, index) in branchData.childNode" :key="index" :class="{'col-box-leadership': !branchData.onFlag}"><!-- 左右分支块包 -->
          <div v-if="index === 0 || index === branchData.childNode.length - 1"   :class="[index === 0 ? 'top-left-cover-line' : 'top-right-cover-line']"></div>
          <div  v-if="index === 0 || index === branchData.childNode.length - 1"  :class="[index === 0 ? 'bottom-left-cover-line' : 'bottom-right-cover-line']"></div>
          <div v-for="(item2, index2) in item.childNode" :key="index2" :class="{'toggleClass': this.toggleClass}">
          <!-- <div :class="{'toggleClass': this.toggleClass}"> -->
            <div class="node-wrap" v-if="item2.type !== 'branch_warp'">
              <div class="node-wrap-box" :class="{'grey': !item2.onDisplay}" @click="getPostDetails(item2.userPostId)">
                <div>{{item2.userPostName}}</div>
                <div  :title="showNameTitle(item2.userName)">{{formatUserName(item2.userName)}}</div>
              </div>
            </div>
            <branchWrap v-if="item2.type === 'branch_warp'" :parentData="item2" :branchData="item2" @getPostDetails="getPostDetails" :routeChildNodeIndex="index2"/>
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
    parentData: {
    },
    routeChildNodeIndex: {
      type: Number
    },
    branchData: {
      type: Object
    }
  },
  data () {
    return {
      toggleClass: false
    }
  },
  created () {},
  methods: {
    formatUserName (userName) {
      let name = ''
      userName.forEach((e, index) => {
        name = name + e + ','
      })
      return name.substring(0, (name.length - 1))
    },
    showNameTitle (userName) {
      let name = `人数：${userName.length}，`
      userName.forEach((e, index) => {
        name = name + e + ','
      })
      // name = name.substring(0, (name.length - 1))
      return name.substring(0, (name.length - 1))
    },
    getPostDetails (postId) {
      this.$emit('getPostDetails', postId)
    },
    addbranch (parentData, branchDataChildNode) {
      // this.$emit('addbranch', parentData, branchDataChildNode)
      this.toggleClass = !this.toggleClass
      this.$emit('addtoggleClass', this.toggleClass, this.routeChildNodeIndex)
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
        return item.userName.length > 0 > 0 ? item.userName.join('、') : ''
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
.box-scale{
    >div{
      &:last-child{
        .add-node-btn-box{
          display: none;
        }
      }
    }
}
.branch-wrap{
  .toggleClass{
    border-top: none!important;
    > div{
      display: none!important;
    }
  }
  .toggleClass + div {
    display: none;
  }
  .col-box-leadership {
      &:before{
        height: 0!important;
      }
      .node-wrap{
        position: relative;
        &:before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          width: 2px;
          height: 55px;
          background-color: #cacaca;
        }
      }
    }
  .branch-box-leadership{
    border-bottom: none!important;
  }
}
.branchWrap{
  .branch-box-wrap{
    .add-branch{
      width: auto!important;
      height: auto!important;
      font-size: 24px;
      top: -25px!important;
      color: #ccc;
      &.el-icon-circle-plus-outline{
        color: #ccc;
      }
      &.el-icon-remove-outline{
        color: #0F75FF
      }
    }
  }
  .node-wrap-box{
    width: 120px;
    min-height: 50px;
    height: 60px;
    font-size:12px;
    border-radius:4px;
    overflow: hidden;
    border:1px solid rgba(49,117,210,1);
    >div{
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #fff;
      padding: 0px 10px;
      &:first-child{
        background-color: #3087FD;
      }
      &:last-child{
        // background-color: #7ab7f5;
        color: #3087FD;
      }
    } 
    &.grey {
      border-color: #dadada;
      >div {
        opacity: 0.6;
      }
    }
  }
}
.branch-box-wrap{
    &:before {
        content: '';
        top: 0;
        left: 50%;
        width: 2px;
        height: 0;
        background-color: #cacaca;
      }
  }
.dingflow-design{
  .add-node-btn-box{
    width: 120px;
    // &:last-of-type{
    //   display: none;
    // }
  }
  .branch-box {
    min-height: 104px;
    margin-top: 2px;
  }
  .branch-box-wrap {
    min-height: 124px;
  }
  .add-node-btn{
    padding: 10px 0 10px;
  }
}
.branch-box{
  .node-wrap{
    padding-top: 20px;
    padding-right: 20px;
    padding-left: 20px;
  }
}
</style>

