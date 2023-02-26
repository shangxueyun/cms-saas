<template>
  <div class="tree_main">
    <ul :class="{'tree_navigation_top': formatSelect(selectPerson)}" class="tree_navigation">
      <li @click="changeMenu(item, index)" v-for="(item, index) in navigationData" :key="index" :class="{'active': navigationData.length === (index + 1)}">{{item.name}}<span class="iconfont iconright" v-if="navigationData.length !== (index + 1)"></span></li>
    </ul>
    <div class="tree_list">
      <div v-for="(item, index) in treeData" :key="index">
        <div>
          <div class="common_checkBox">
            <span class="default_check" v-if="!item.checked"></span>
            <img class="active_check" v-else src="../../../../../assets/checkBox.png">
            <input type="checkbox" v-model="item.checked" @change="handleCheck(item)"/>
          </div>
        </div>
        <div v-if="!item.userId">
          <div class="iconfont iconcms_louyuL"></div>
          <div @click="handleRank(item)" class="tree_info">
            <p>{{item.name}}</p>
            <div>
              <p><span>{{formatCount(item.reporterDTOList, 'checked')}}</span>/{{formatCount(item.reporterDTOList)}}</p>
              <p class="iconfont iconright"></p>
            </div>
          </div>
        </div>
        <div v-else class="user-right">
          <div class="tree_icon">{{formatName(item.userName)}}</div>
          <div class="tree_user">
            <p>{{item.userName}}</p>
            <p>{{item.name}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import * as hub from '@/service/eventHub'
  export default {
    props: ['treeData', 'flatTree', 'focus', 'selectPerson', 'getSelectPerson', 'changeTreeData'],
    data () {
      return {
        navigationData: [
          {name: '组织', id: 'ORZ'}
        ]
      }
    },
    created () {
      hub.eventHub.$on('handleCheck', item => {
        this.handleCheck(item)
      })
    },
    methods: {
      // 点击进入下一级
      handleRank (item) {
        if (item.reporterDTOList && item.reporterDTOList.length) {
          this.navigationData.push(item)
          this.changeTreeData(item)
        }
      },
    // 节点勾选
      handleCheck (item, type) {
        let checked = item.checked
        let nodeKey = item.nodeKey
        let node = this.flatTree[nodeKey].node
        this.$set(node, 'checked', checked)
        this.updateTreeUp(nodeKey)
        this.updateTreeDown(node, { checked: checked })
        if (type !== 'initSelect') this.getCheckedNodes(node)
      },
    // 判断当前勾选节点的父节点是否需要勾选
      updateTreeUp (nodeKey) {
        let parentKey = this.flatTree[nodeKey].parent
        let childrenKey = 'reporterDTOList'
        if (typeof parentKey === 'undefined') return
        let node = this.flatTree[nodeKey].node
        let parent = this.flatTree[parentKey].node
        if (node.checked === parent.checked) return
        if (node.checked === true) {
          this.$set(parent, 'checked', parent[childrenKey].every(function (node) {
            return node.checked
          }))
        } else {
          this.$set(parent, 'checked', false)
        }
        this.updateTreeUp(parentKey)
      },
    // 判断当前勾选节点的子节点是否勾选
      updateTreeDown (node) {
        let changes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
        let childrenKey = 'reporterDTOList'
        for (let key in changes) {
          this.$set(node, key, changes[key])
        }
        if (node[childrenKey]) {
          node[childrenKey].forEach(function (child) {
            this.updateTreeDown(child, changes)
          }.bind(this))
        }
      },
    // 切换导航链接
      changeMenu (item, index) {
        if (this.navigationData.length - 1 === index) return
        this.navigationData = this.navigationData.slice(0, index + 1)
        this.changeTreeData(item)
      },
    // 获取已勾选节点
      getCheckedNodes (node) {
        let arr = this.flatTree.filter(item => {
          return item.node.checked && item.node.userId
        }).map(item => {
          return item.node
        })
        this.getSelectPerson(arr)
      },
      formatName (str) {
        if (!str) return
        if (/^[a-zA-Z]*$/.test(str)) { // 英文
          return str.substring(0, 3)
        } else if (/^[\u4e00-\u9fa5]*$/.test(str)) { // 中文
          return str.substring(str.length - 2)
        } else {
          return str.substring(0, 3)
        }
      },
      formatCount (data, checked) {
        let PersonArry = []
        function newAttr (item) {
          if (item.userId) PersonArry.push(item)
          if (item.reporterDTOList) {
            item.reporterDTOList.forEach(child => {
              newAttr(child)
            })
          }
        }
        if (data && data.length) {
          data.forEach(item => {
            newAttr(item)
          })
          let personLength = checked === 'checked' ? PersonArry.filter((item) => item.checked).length : PersonArry.length
          return personLength
        } else {
          return 0
        }
      },
      flattenChildren (node, parent) {
        node.nodeKey = keyCounter++
        flatTree[node.nodeKey] = {
          node: node,
          nodeKey: node.nodeKey
        }
        if (typeof parent !== 'undefined') {
          flatTree[node.nodeKey].parent = parent.nodeKey
          flatTree[parent.nodeKey][childrenKey].push(node.nodeKey)
        }
        if (node[childrenKey]) {
          flatTree[node.nodeKey][childrenKey] = []
          node[childrenKey].forEach(function (child) {
            return flattenChildren(child, node)
          })
        }
      },
      formatSelect (selectPerson) {
        let arr = selectPerson.filter((item) => item.userId)
        return arr.length
      }
    }
}
</script>
<style lang="scss" scoped>
@import "../../../../../style/config";
.tree_main{
  .tree_navigation{
    position: fixed;
    left:0;
    top: rem(90);
    z-index: 2;
    width:100%;
    display: flex;
    height:rem(18);
    background: #fff;
    padding:0 rem(15);
    overflow-x: auto;
    overflow-y: hidden;
    li{
      display: flex;
      line-height: rem(18);
      font-size: rem(12);
      color:#858C94;
      white-space: nowrap;
      flex-basis: rem(0);
      flex-shrink: 0;
      span{
        display: block;
        line-height: rem(18);
        font-size: rem(12);
        width:rem(18);
        text-align: center;
      }
    }
    .active{
      color:#515151;
      font-weight: bold;
      padding-right:rem(15);
    }
  }
  .tree_navigation_top{
    top: rem(148);
  }
  .tree_list{
    width:100%;
    background: #fff;
    padding-left:rem(15);
    >div{
      display: flex;
      height:rem(60);
      align-items: center;
      >div:first-child{
        height:rem(20);
        width:rem(18);
        margin-right:rem(14);
        
      }
      >div:last-child{
        flex:1;
        display: flex;
        height:rem(60);
        align-items: center;
        >.iconfont{
          width:rem(20);
          height: rem(20);
          text-align: center;
          line-height: rem(18);
          font-size: rem(20);
          color:#023C8F;
        }
        >.tree_info{
          flex: 1;
          height:rem(60);
          align-items: center;
          display: flex;
          justify-content: space-between;
          padding-left:rem(5);
          border-bottom: rem(1) solid #FAFAFA;
          >p{
            line-height: rem(20);
            font-size: rem(15);
            color:#18191A;
            
          }
          >div{
            display: flex;
            p:first-child{
              line-height: rem(20);
              color:#18191A;
              font-size: rem(15);
              margin-right:rem(5);
              span{
                color:#3575F6;
              }
            }
            p:last-child{
              line-height: rem(20);
              font-size: rem(18);
              color:#C7C7C7;
              padding-right:rem(10);
            }
          }
        }
        .tree_icon{
          height:rem(34);
          border-radius:rem(34);
          background-color: #3575F6;
          line-height: rem(34);
          text-align: center;
          color: #fff;
          font-size: rem(12);
          width: rem(34);
          margin-right:rem(7);
        }
        .tree_user{
          p:first-child{
            font-size: rem(15);
            color:#18191A;
          }
          p:last-child{
            font-size: rem(13);
            color:#858C94;
          }
        }
      }
      >.user-right{
        border-bottom: rem(1) solid #FAFAFA;
      }
    }
  }
}
</style>
