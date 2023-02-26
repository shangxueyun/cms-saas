<template>
  <div class="branch-wrap"> <!--分支-->
    <div class="branch-box-wrap">
      <div class="branch-box">
        <button class="add-branch" @click="addbranch(parentData, branchData)" :class="{'branchBg': branchData.type === 'PARALLEL_START_AND'}">
          <p style="height: 12px;"><i :class="[branchData.type === 'PARALLEL_START_AND' ? 'icon-huiqian' : 'icon-huoqian']"></i></p>
          <p v-if="!readOnly">
          {{branchData.type === 'PARALLEL_START_AND' ? '增加会签' : '增加或签'}}
          </p>
          <p v-else>
            {{branchData.type === 'PARALLEL_START_AND' ? '并行会签' : '并行或签'}}
          </p>
        </button>
        <div class="col-box" v-for="(item, index) in branchData.childNode" :key="index"><!-- 左右分支块包 -->
          <div v-if="index === 0 || index === branchData.childNode.length - 1" class="" :class="[index === 0 ? 'top-left-cover-line' : 'top-right-cover-line']"></div>
          <div  v-if="index === 0 || index === branchData.childNode.length - 1" class="" :class="[index === 0 ? 'bottom-left-cover-line' : 'bottom-right-cover-line']"></div>
          <div v-for="(item2, index2) in item.childNode" :key="index2">
            <div class="node-wrap" v-if="item2.type === 'APPROVAL' || item2.type === 'CC'">
              <div class="node-wrap-box node_e428_976a">
                <div>
                  <div class="title" :class="[item2.type === 'APPROVAL' ? 'approver-title' : 'notifier-title']">
                    <span class="iconfont titleIcon"></span><span class="editable-title">{{item2.name}}</span>
                    <i class="iconfont icon-cha close" @click="deleteNode(item, index, item2, index2)" v-if="!readOnly"></i>
                  </div>
                  <div class="content"  @click="showApprover(item2)">
                    <div class="text" v-if="item2.jobPositionLable" :class="{'discontinue': item2.jobUsable && !item2.jobUsable[0] && item2.type === 'APPROVAL'}">
                      <span v-for="(item3, index3) in item2.jobPositionLable" :key="index3">{{item3}}<span v-if="item2.jobPositionLable.length !== index3 + 1">，</span></span>
                    </div>
                    <div class="text" v-else :class="{'discontinue': item2.jobUsable && !item2.jobUsable[0] && item2.type === 'APPROVAL'}">
                      <span v-for="(item3, index3) in item2.jobPosition" :key="index3">{{item3}}<span v-if="item2.jobPosition.length !== index3 + 1">，</span></span>
                    </div>
                    <i class="anticon-right arrow iconfont icon-right" v-if="!readOnly"></i>
                  </div>
                </div>
              </div>
              <div class="add-node-btn-box">
                <div class="add-node-btn">
                  <button class="btn" type="button" v-if="!readOnly" @click="showAddnode(item, item2, index2, 'nodeMiddle', $event)"><span class="iconfont icon-add"></span></button>
                </div>
              </div>
            </div>
            <branchWrap v-if="item2.type === 'PARALLEL_START_AND' || item2.type === 'PARALLEL_START_OR'" :readOnly="readOnly" :parentData="item" :branchData="item2" @deleteNode="deleteNode" :routeChildNodeIndex="index2"
                        @showAddnode="showAddnode" @addbranch="addbranch" @showApprover="showApprover"/>
          </div>
        </div>
      </div>
      <div class="add-node-btn-box">
        <div class="add-node-btn" :class="{'btnBoxhack': this.readOnly}">
          <button class="btn" type="button" v-if="!readOnly" @click="showAddnode(parentData, branchData, routeChildNodeIndex, 'nodeEnd', $event)">
            <span class="iconfont icon-add"></span>
          </button>
        </div>
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
    branchData: {
      type: Object
    },
    routeChildNodeIndex: {
      type: Number
    },
    readOnly: {
      type: Boolean
    }
  },
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
    showAddnode (parent, item, index, type, e) {
      this.$emit('showAddnode', parent, item, index, type, e)
    },
    addbranch (parentData, branchDataChildNode) {
      this.$emit('addbranch', parentData, branchDataChildNode)
    },
    deleteNode (parent, routeChildNodeIndex, item, index) {
      this.$emit('deleteNode', parent, routeChildNodeIndex, item, index)
    },
    showApprover (item) {
      this.$emit('showApprover', item)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/aflow";
.branch-wrap{
  .node-wrap-box{
    border-radius: 6px;
    >div {
      border-radius: 6px;
    }
    &:after {
      border-radius: 6px;
    }
    .title{
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
    }
    .close {
      font-size: 10px;
    }
  }
  .approver-title .titleIcon{
    background: url(../../../../assets/jiedian.png) no-repeat;
  }
  .notifier-title .titleIcon{
    background: url(../../../../assets/chaosong.png) no-repeat;
  }
  .add-branch{
    display: block;
    width: 80px;
    height: 35px;
    i{
      display: inline-block;
      width: 20px;
      height: 20px;
      vertical-align: bottom;
    }
    .icon-huiqian {
      background: url(../../../../assets/tiaojianfenzhismall.png) no-repeat;
    }
    .icon-huoqian{
      background: url(../../../../assets/huoqiansmall.png) no-repeat;
      background-size: contain;
    }
    p:last-child {
     position: relative;
     top: 25px; 
    }
  }
  .branchBg{
    background: url(../../../../assets/diamond.png) no-repeat;
    background-color: transparent;
    border: none;
    box-shadow: none;
    background-color: transparent;
    border: none;
    box-shadow: none;
    background-position: -3px -4px;
    width: 90px;
    height: 50px;
    top: -25px;
  }
  .discontinue{
    color: red;
  }
}
</style>

