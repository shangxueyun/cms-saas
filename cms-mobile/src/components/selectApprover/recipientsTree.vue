<template>
  <div class="tree_main">
    <ul :class="{'tree_navigation_top': formatSelect(selectPost)}"
        class="tree_navigation">
      <li @click="changeMenu(item, index)"
          v-for="(item, index) in navigationData"
          :key="index"
          :class="{'active': navigationData.length === (index + 1)}">{{item.data.name}}<span class="iconfont iconright"
              v-if="navigationData.length !== (index + 1)"></span></li>
    </ul>
    <div class="tree_list">
      <div v-for="(item, index) in treeData"
           :key="index">
        <div>
          <div class="common_checkBox">
            <span class="default_check"
                  v-if="!item.checked"
                  :class="{'disabled': item.data.userPostId === null}"></span>
            <img class="active_check"
                 v-else
                 src="../../assets/checkBox.png">
            <input type="checkbox"
                   v-model="item.checked"
                   @change="handleCheck(item)" />
          </div>
        </div>
        <div>
          <div class="iconfont iconcms_louyuL"></div>
          <div @click="handleRank(item)"
               class="tree_info">
            <p>{{item.data.name}}{{'(' + (item.data.userPostName === null ? '' : item.data.userPostName) + ' ' + (item.data.userName === null ? '' : item.data.userName) + ')'}}</p>
            <div v-if="item.children.length > 0">
              <p><span>{{formatCount(item, 'checked')}}</span>/{{formatCount(item.children)}}</p>
              <p class="iconfont iconright"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as hub from '@/service/eventHub'
export default {
  props: ['personData', 'selectType', 'treeData', 'flatTree', 'focus', 'selectPost', 'getSelectPerson', 'changeTreeData', 'treeDataDeep'],
  data () {
    return {
      navigationData: [
        {
          data: { name: '组织', id: 'ORZ' }
        }
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
      if (item.children && item.children.length) {
        this.navigationData.push(item)
        this.changeTreeData(item)
      }
    },
    // 节点勾选
    handleCheck (item, type) {
      if (item.data.userPostId === null) {
        item.checked = false
        return
      }
      let nodeKey = item.nodeKey
      // 单选
      if (this.selectType === 'APPROVAL') {
        this.treeDataDeep = this.compileTree(this.treeDataDeep)
        if (type === 'search') {
          this.personData = this.compileTree(this.personData)
        }
        item.checked = true
      }
      let checked = item.checked
      let node = this.flatTree[nodeKey].node
      this.$set(node, 'checked', checked)
      if (type !== 'initSelect') this.getCheckedNodes()
    },
    // 单选
    compileTree (arr) {
      let _this = this
      function newAttr (node, parent) {
        node.checked = false// 是否勾选
        if (node.children && node.children.length > 0) {
          node.children.forEach(child => {
            return newAttr(child, node)
          })
        }
      }
      arr.forEach(item => {
        newAttr(item)
      })
      return arr
    },
    // 回显
    echo (arr, children) {
      const treeDataDeep = children || this.treeDataDeep
      treeDataDeep.forEach(item => {
        this.echoHandler(arr, item)
      })
    },
    echoHandler (arr, item) {
      arr.forEach(items => {
        if (item.data.nodeDateId === items.data.nodeDateId) {
          item.checked = items.checked
          item.nodeKey = items.nodeKey
        }
        if (item.children.length > 0) {
          this.echo(arr, item.children)
        }
      })
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
    getCheckedNodes2 (node) {
      const arr = this.treeDataDeep.filter(item => {
        return item.checked && item.data.userPostId
      }).map(item => {
        return item.data
      })
      this.getSelectPerson(arr)
    },
    getCheckedNodes (node) {
      const treeData = node || this.treeDataDeep
      const arr = []
      function flattenode (item) {
        if (item.checked && item.data.userPostId) {
          arr.push(item)
        }
        if (!item.leaf) {
          item.children.forEach(ele => {
            return flattenode(ele)
          })
        }
      }
      treeData.forEach(item => {
        flattenode(item)
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
      if (checked === 'checked') {
        PersonArry.push(data)
      }
      function newAttr (item) {
        PersonArry.push(item)
        if (item.children && item.children.length > 0) {
          item.children.forEach(child => {
            newAttr(child)
          })
        }
      }
      if (checked === 'checked') {
        if (data && data.children.length) {
          data.children.forEach(item => {
            newAttr(item)
          })
          let personLength = checked === 'checked' ? PersonArry.filter((item) => item.checked).length : PersonArry.length
          return personLength
        } else {
          return 0
        }
      } else {
        if (data && data.length) {
          data.forEach(item => {
            newAttr(item)
          })
          let personLength = checked === 'checked' ? PersonArry.filter((item) => item.checked).length : PersonArry.length
          return personLength
        } else {
          return 0
        }
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
    formatSelect (selectPost) {
      let arr = selectPost.filter((item) => item.data.userPostId)
      return arr.length
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../style/config";
.tree_main {
  .tree_navigation {
    position: fixed;
    left: 0;
    top: rem(90);
    z-index: 2;
    width: 100%;
    display: flex;
    height: rem(18);
    background: #fff;
    padding: 0 rem(15);
    overflow-x: auto;
    overflow-y: hidden;
    li {
      display: flex;
      line-height: rem(18);
      font-size: rem(12);
      color: #858c94;
      white-space: nowrap;
      flex-basis: rem(0);
      flex-shrink: 0;
      span {
        display: block;
        line-height: rem(18);
        font-size: rem(12);
        width: rem(18);
        text-align: center;
      }
    }
    .active {
      color: #515151;
      font-weight: bold;
      padding-right: rem(15);
    }
  }
  .tree_navigation_top {
    top: rem(148);
  }
  .tree_list {
    width: 100%;
    background: #fff;
    padding-left: rem(15);
    > div {
      display: flex;
      height: rem(60);
      align-items: center;
      > div:first-child {
        height: rem(20);
        width: rem(18);
        margin-right: rem(14);
      }
      > div:last-child {
        flex: 1;
        display: flex;
        height: rem(60);
        align-items: center;
        > .iconfont {
          width: rem(20);
          height: rem(20);
          text-align: center;
          line-height: rem(18);
          font-size: rem(20);
          color: #023c8f;
        }
        > .tree_info {
          flex: 1;
          height: rem(60);
          align-items: center;
          display: flex;
          justify-content: space-between;
          padding-left: rem(5);
          border-bottom: rem(1) solid #fafafa;
          > p {
            line-height: rem(20);
            font-size: rem(15);
            color: #18191a;
          }
          > div {
            display: flex;
            p:first-child {
              line-height: rem(20);
              color: #18191a;
              font-size: rem(15);
              margin-right: rem(5);
              span {
                color: #3575f6;
              }
            }
            p:last-child {
              line-height: rem(20);
              font-size: rem(18);
              color: #c7c7c7;
              padding-right: rem(10);
            }
          }
        }
        .tree_icon {
          height: rem(34);
          border-radius: rem(34);
          background-color: #3575f6;
          line-height: rem(34);
          text-align: center;
          color: #fff;
          font-size: rem(12);
          width: rem(34);
          margin-right: rem(7);
        }
        .tree_user {
          p:first-child {
            font-size: rem(15);
            color: #18191a;
          }
          p:last-child {
            font-size: rem(13);
            color: #858c94;
          }
        }
      }
      > .user-right {
        border-bottom: rem(1) solid #fafafa;
      }
    }
  }
  .default_check {
    &.disabled {
      background: #c7c7c7;
    }
  }
}
</style>
