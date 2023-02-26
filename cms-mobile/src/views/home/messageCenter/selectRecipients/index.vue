<template>
  <div :class="{'focus':focus}"
       class="selectRecipients">
    <div :class="{'seachInputTop': !formatSelect(selectPerson)}"
         class="seachInput">
      <span class="mintui mintui-back cannelBtn"
            v-show="focus"
            @click="closeSearch"></span>
      <form @submit.prevent
            action="#">
        <input class="input"
               id="seachInput"
               results="5"
               focus
               placeholder="请输入组织名称或员工姓名"
               type="search"
               v-model="inputValue"
               @input="onKeyInput"
               @focus="inputFocus"
               @blur="shadeBox = false"
               @keyup.13="onKeyInput"
               @keypress="search" />
        <i class="mintui mintui-search"></i>
      </form>
      <span class="finishBtn"
            v-show="focus"
            @click="conform">完成<span v-show="formatSelect(selectPerson)">({{formatSelect(selectPerson)}})</span></span>
    </div>
    <div v-show="!focus">
      <app-header :title="title"
                  :mode="false">
        <div @click="cancle"
             class="left_btn"
             slot="leftBtn">取消</div>
        <div class="rightBtn"
             @click="conform"
             slot="rightBtn">完成<span v-show="formatSelect(selectPerson)">({{formatSelect(selectPerson)}})</span></div>
      </app-header>
      <div v-if="formatSelect(selectPerson)"
           class="select_person">
        <span v-if="item.userId"
              @click="deletePerson(item)"
              v-for="(item, index) in selectPerson"
              :key="index">{{formatName(item.userName)}}</span>
      </div>
      <div class="tree_container"
           :class="{'tree_container_top': !formatSelect(selectPerson)}">
        <RecipientsTree ref="RecipientsTree"
                        :focus="focus"
                        :selectPerson="selectPerson"
                        :tree-data="treeData"
                        :flat-tree="flatTree"
                        :changeTreeData="changeTreeData"
                        :getSelectPerson="getSelectPerson" />
      </div>
    </div>
    <div v-show="focus && personData.length"
         class="tree_list">
      <label :for="item.organizeId + '_' + item.postId + '_' + item.userId"
             v-for="(item, index) in personData"
             :key="index">
        <div>
          <div class="common_checkBox">
            <span class="default_check"
                  v-if="!item.checked"></span>
            <img class="active_check"
                 v-else
                 src="../../../../assets/checkBox.png">
            <input :id="item.organizeId + '_' + item.postId + '_' + item.userId"
                   type="checkbox"
                   v-model="item.checked"
                   @change="handleEearchCheck(item)" />
          </div>
        </div>
        <div class="user-right">
          <div class="tree_icon">{{formatName(item.userName)}}</div>
          <div class="tree_user">
            <p>{{item.userName}}</p>
            <p>{{item.postName}}</p>
            <p>{{item.organizeName}}</p>
          </div>
        </div>
      </label>
    </div>
    <div v-show="focus && !personData.length && showNoData"
         class="noData">
      <img src="../../../../assets/nores.png">
      <p>没有找到你想要的</p>
    </div>
    <div v-show="shadeBox"
         @touchmove.prevent
         class="shadeBox"></div>
  </div>
</template>
<script>
import AppHeader from '@/components/appHead'
import RecipientsTree from './components/recipientsTree'
import { MessageBox } from 'mint-ui'
import context from '@/service'
import lodash from 'lodash'
let roterFrom = null
export default {
  name: 'selectRecipients',
  footVisible: true,
  components: { AppHeader, RecipientsTree },
  data () {
    return {
      title: '',
      inputValue: '',
      shadeBox: false,
      focus: false,
      selectPerson: [],
      selectPersonDeep: [],
      treeData: [],
      treeDataDeep: [],
      flatTree: [],
      personData: [],
      showNoData: false,
      showMessage: true
    }
  },
  computed: {
    isIOS: () => !!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  },
  created () {
    if (this.$route.params.titleText) {
      this.title = this.$route.params.titleText
    } else {
      this.title = '选择收件人'
    }
    if (sessionStorage.getItem('selectPerson')) {
      this.selectPerson = JSON.parse(sessionStorage.getItem('selectPerson'))
      this.selectPersonDeep = JSON.parse(JSON.stringify(this.selectPerson))
    }
    this.getTreeData()
  },
  mounted () {
    if (window.history && window.history.pushState && !this.isIOS) {
      // history.pushState(null, null, document.URL)
      window.addEventListener('popstate', this.backChange, false)
      console.log('androaid')
    }
  },
  destroyed () {
    if (!this.isIOS) {
      MessageBox.close()
      window.removeEventListener('popstate', this.backChange, false)
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.name) roterFrom = from.name
    next()
  },
  methods: {
    getTreeData () {
      context.http.get('uaa/api/organizes/report').then(res => {
        let arr = res.data
        this.treeData = this.compileTreeData(arr)
        this.treeDataDeep = this.compileTreeData(arr)
        this.flatTree = this.compileFlatTree(arr)
        console.log('flatTree', this.flatTree)
        this.$nextTick(() => {
          this.selectPerson.forEach(items => {
            this.$refs['RecipientsTree'].handleCheck(items, 'initSelect')
          })
        })
      })
    },
    // 数据初始化(添加某些必要属性)
    compileTreeData (arr) {
      let _this = this
      function newAttr (node, parent) {
        node.checked = false// 是否勾选
        if (node.reporterDTOList) {
          node.reporterDTOList.forEach(child => {
            return newAttr(child, node)
          })
        }
      }
      arr.forEach(item => {
        newAttr(item)
      })
      return arr
    },
    // 编制各节点对应关系
    compileFlatTree (arr) {
      var keyCounter = 0
      var childrenKey = 'reporterDTOList'
      var flatTree = []
      function flattenChildren (node, parent) {
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
      }
      arr.forEach(function (rootNode) {
        flattenChildren(rootNode)
      })
      return flatTree
    },
    // 获取选中的员工
    getSelectPerson (arr) {
      this.selectPerson = arr
      sessionStorage.setItem('selectPerson', JSON.stringify(this.selectPerson))
    },
    // 切换导航改变数据
    changeTreeData (item) {
      if (item.id === 'ORZ') {
        this.treeData = this.treeDataDeep
      } else {
        this.treeData = item.reporterDTOList
      }
    },
    // 删除员工
    deletePerson (item) {
      item.checked = false
      this.$refs['RecipientsTree'].handleCheck(item)
    },
    // 获取查询员工列表
    async getPersonData () {
      this.showNoData = false
      let result = await context.http.get('uaa/api/user-posts/search?queryName=' + this.inputValue)
      result.data.length ? this.showNoData = false : this.showNoData = true
      this.personData = result.data
      let arr = this.flatTree.filter(item => {
        return item.node.userId
      }).map(item => {
        return item.node
      })
      this.personData.forEach(item => {
        arr.forEach(items => {
          if (item.userId === items.userId) {
            item.checked = items.checked
            item.nodeKey = items.nodeKey
          }
        })
      })
    },
    handleEearchCheck (item) {
      this.$refs['RecipientsTree'].handleCheck(item)
    },
    onKeyInput: lodash.debounce(function () {
      this.shadeBox = false
      this.getPersonData()
    }, 1000),
    onKeyInput2 (event) { // 输入
      this.shadeBox = false
      this.$nextTick(() => {
        this.getPersonData()
      })
    },
    inputFocus () { // 获取焦点
      // this.getPersonData()
      this.focus = true
      this.shadeBox = true
    },
    search (event) { // 键盘完成事件
      if (event.keyCode === 13) {
        event.preventDefault()
        this.inputValue = event.target.value
        this.getPersonData()
      }
    },
    closeSearch () { // 取消
      this.focus = false
      this.shadeBox = false
      this.inputValue = ''
      this.personData = []
    },
    backChange () {
      console.log('取消')
      if (this.showMessage) {
        console.log('取消')
        if (JSON.stringify(this.selectPerson) !== JSON.stringify(this.selectPersonDeep)) {
          MessageBox.confirm('', {
            message: '是否保留此次编辑？',
            confirmButtonText: '保留',
            cancelButtonText: '不保留',
            confirmButtonClass: 'confirmButton',
            cancelButtonClass: 'cancelButton'
          }).then(action => {
            if (action === 'confirm') {
              sessionStorage.setItem('selectPerson', JSON.stringify(this.selectPerson))
              console.log(this.$route.params)
              this.$router.replace({ name: roterFrom, params: this.$route.params, query: this.$route.query })
            }
          }).catch(error => {
            if (error === 'cancel') {
              sessionStorage.setItem('selectPerson', JSON.stringify(this.selectPersonDeep))
              this.$router.replace({ name: roterFrom, params: this.$route.params, query: this.$route.query })
            }
          })
        } else {
          this.$router.replace({ name: roterFrom, params: this.$route.params, query: this.$route.query })
        }
      } else {
        sessionStorage.setItem('selectPerson', JSON.stringify(this.selectPerson))
        this.$router.replace({ name: roterFrom, params: this.$route.params, query: this.$route.query })
      }
    },
    cancle () {
      if (!this.isIOS) {
        // debugger
        this.showMessage = true
        this.backChange()
      } else {
        if (JSON.stringify(this.selectPerson) !== JSON.stringify(this.selectPersonDeep)) {
          MessageBox.confirm('', {
            message: '是否保留此次编辑？',
            confirmButtonText: '保留',
            cancelButtonText: '不保留',
            confirmButtonClass: 'confirmButton',
            cancelButtonClass: 'cancelButton'
          }).then(action => {
            if (action === 'confirm') {
              sessionStorage.setItem('selectPerson', JSON.stringify(this.selectPerson))
              this.$router.go(-1)
            }
          }).catch(error => {
            if (error === 'cancel') {
              sessionStorage.setItem('selectPerson', JSON.stringify(this.selectPersonDeep))
              this.$router.go(-1)
            }
          })
        } else {
          this.$router.go(-1)
        }
      }
    },
    conform () {
      if (!this.isIOS) {
        this.showMessage = false
        this.backChange()
      } else {
        sessionStorage.setItem('selectPerson', JSON.stringify(this.selectPerson))
        this.$router.go(-1)
      }
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
    formatSelect (selectPerson) {
      let arr = selectPerson.filter((item) => item.userId)
      return arr.length
    }
  }
}
</script>
<style lang="scss">
@import "../../../../style/config";
.selectRecipients {
  #app-head {
    .back {
      display: none !important;
    }
    .left_btn {
      color: #686868;
      font-size: rem(15);
      line-height: rem(40);
      padding-left: rem(15);
    }
  }
}
</style>
<style lang="scss" scoped>
@import "../../../../style/config";
.selectRecipients {
  .select_person {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    height: rem(58);
    display: flex;
    padding-left: rem(15);
    align-items: center;
    position: fixed;
    top: rem(40);
    z-index: 2;
    background: #fff;
    span {
      display: block;
      margin-right: rem(10);
      height: rem(34);
      border-radius: rem(34);
      background-color: #3575f6;
      line-height: rem(34);
      text-align: center;
      color: #fff;
      font-size: rem(12);
      white-space: nowrap;
      flex-basis: rem(34);
      flex-shrink: 0;
    }
  }
  .rightBtn {
    position: absolute;
    right: rem(15);
    top: 0;
    width: rem(200);
    text-align: right;
  }
  .seachInput {
    height: $foot-height;
    width: 100%;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    padding: 0 rem(15);
    position: fixed;
    top: rem(98);
    z-index: 2;
    #seachInput::-webkit-search-cancel-button {
      display: none;
    }
    .mintui-search {
      position: absolute;
      left: rem(5);
      top: rem(8);
      color: #666666;
    }
    form {
      position: relative;
      flex: 1;
    }
    .input {
      // width: rem(300);
      width: 100%;
      height: rem(30);
      background: rgba(244, 244, 244, 1);
      border-radius: rem(2);
      padding-left: rem(25);
      font-size: rem(13);
    }
    .cannelBtn {
      width: rem(30);
      color: #000000;
      font-size: rem(18);
      display: block;
      height: rem(30);
      line-height: rem(30);
    }
    .finishBtn {
      color: #0139a4;
      font-size: rem(15);
      display: block;
      height: rem(30);
      line-height: rem(30);
      margin-left: rem(10);
    }
  }
  .seachInputTop {
    top: rem(40);
  }
  &.focus {
    .tree_list {
      padding-top: rem(50);
    }
    // .input {
    //   width: rem(240) !important;
    // }
    .seachInput {
      top: 0 !important;
      z-index: 101;
    }
    .list {
      margin-top: $foot-height;
    }
    .shadeBox {
      // height: calc(100% - rem(46));
      height: calc(100% - #{$foot-height});
      position: fixed;
      left: 0;
      top: $foot-height;
      width: 100%;
      background: rgba(0, 0, 0, 0.2);
      z-index: 100;
    }
  }
  .tree_container {
    padding-top: rem(166);
  }
  .tree_container_top {
    padding-top: rem(108);
  }
  .tree_list {
    width: 100%;
    background: #fff;
    padding-left: rem(15);
    > label {
      display: flex;
      height: rem(70);
      align-items: center;
      > div:first-child {
        height: rem(20);
        width: rem(18);
        margin-right: rem(14);
      }
      > div:last-child {
        flex: 1;
        display: flex;
        height: rem(70);
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
          height: rem(70);
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
          p {
            font-size: rem(13);
            color: #858c94;
          }
          p:first-child {
            font-size: rem(15);
            color: #18191a;
          }
          p:last-child {
            font-size: rem(12);
            color: #b3b8bd;
          }
        }
      }
      > .user-right {
        border-bottom: rem(1) solid #fafafa;
      }
    }
  }
  .noData {
    width: 100%;
    > img {
      display: block;
      margin: 0 auto;
      width: rem(140);
      height: rem(140);
    }
    > p {
      color: #444547;
      text-align: center;
      font-weight: bold;
    }
  }
}
</style>
