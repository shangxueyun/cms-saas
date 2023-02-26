<template>
  <div :class="{'focus':focus}"
       class="selectRecipients">
    <div :class="{'seachInputTop': !formatSelect(selectPost)}"
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
               placeholder="请输入组织名称或岗位名称"
               type="search"
               v-model="inputValue"
               @keyup="onKeyInput"
               @focus="inputFocus"
               @blur="shadeBox = false"
               @keyup.13="onKeyInput"
               @keypress="search" />
        <i class="mintui mintui-search"></i>
      </form>
      <span class="finishBtn"
            v-show="focus"
            @click="conform">完成<span v-show="formatSelect(selectPost)">({{formatSelect(selectPost)}})</span></span>
    </div>
    <div v-show="!focus">
      <app-header :title="title"
                  :mode="false">
        <div @click="cancle"
             class="left_btn"
             slot="leftBtn">取消</div>
        <div class="rightBtn"
             @click="conform"
             slot="rightBtn">完成<span v-show="formatSelect(selectPost)">({{formatSelect(selectPost)}})</span></div>
      </app-header>
      <div v-if="formatSelect(selectPost)"
           class="select_person">
        <span v-if="item.data.userPostId"
              @click="deletePerson(item)"
              v-for="(item, index) in selectPost"
              :key="index">{{item.data.name}}{{'(' + (item.data.userPostName === null ? '' : item.data.userPostName) + ' ' + (item.data.userName === null ? '' : item.data.userName) + ')'}}{{formatName(item.userName)}}</span>
      </div>
      <div class="tree_container"
           :class="{'tree_container_top': !formatSelect(selectPost)}">
        <RecipientsTree ref="RecipientsTree"
                        :personData="personData"
                        :selectType="selectType"
                        :focus="focus"
                        :selectPost="selectPost"
                        :tree-data="treeData"
                        :flat-tree="flatTree"
                        :treeDataDeep="treeDataDeep"
                        :changeTreeData="changeTreeData"
                        :getSelectPerson="getSelectPerson" />
      </div>
    </div>
    <div v-show="focus && personData.length"
         class="tree_list search-results">
      <label :for="item.userPostId"
             v-for="(item, index) in personData"
             :key="index">
        <div>
          <div>
            <div class="common_checkBox">
              <span class="default_check"
                    v-if="!item.checked"
                    :class="{'disabled': item.userPostId === null}"></span>
              <img class="active_check"
                  v-else
                  src="../../assets/checkBox.png">
              <input :id="item.userPostId"
                  type="checkbox"
                  v-model="item.checked"
                  @change="handleEearchCheck(item)" />
            </div>
          </div>
          <div class="right-warp">
            <div class="iconfont iconcms_louyuL"></div>
            <div class="tree_info">
              <p>{{item.userPostName === null ? '' : item.userPostName}}
                {{ '(' }}
                <span v-for="(item2, index2) in item.userAppDTOS">
                  {{ item2.userName }}
                  <span v-if="item.userAppDTOS.length !== index2 + 1">、</span>
                </span>
                {{ ')' }}
                <div>{{item.name}}</div>
              </p>
            </div>
          </div>
        </div>
      </label>
    </div>
    <div v-show="focus && !personData.length && showNoData"
         class="noData">
      <img src="../../assets/nores.png">
      <p>没有找到你想要的</p>
    </div>
    <!-- <div v-show="shadeBox"
         @touchmove.prevent
         class="shadeBox"></div> -->
  </div>
</template>
<script>
import AppHeader from '@/components/appHead'
import RecipientsTree from './recipientsTree'
import { MessageBox } from 'mint-ui'
import context from '@/service'
import lodash from 'lodash'
let roterFrom = null
export default {
  name: 'selectApprover',
  footVisible: true,
  components: { AppHeader, RecipientsTree },
  props: ['detailData'],
  data () {
    return {
      title: '',
      inputValue: '',
      shadeBox: false,
      focus: false,
      selectPost: [],
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
    const type = this.$route.query.type
    if (type === 'APPROVAL' || type === 'PARALLEL_START_AND' || type === 'PARALLEL_START_OR') {
      this.title = '选择审批人'
    } else {
      this.title = '选择抄送人'
    }
    this.selectType = type
    if (sessionStorage.getItem('selectPost')) {
      this.selectPost = JSON.parse(sessionStorage.getItem('selectPost'))
      this.selectPersonDeep = JSON.parse(JSON.stringify(this.selectPost))
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
      context.http.get('uaa/api/organizes/apply').then(res => {
        let arr = res.data.organizeTree
        this.treeData = this.compileTreeData(arr)
        this.treeDataDeep = this.compileTreeData(arr)
        this.flatTree = this.compileFlatTree(arr)
        this.$nextTick(() => {
          this.$refs['RecipientsTree'].echo(this.selectPost)
        })
      })
    },
    // 数据初始化(添加某些必要属性)
    compileTreeData (arr) {
      let _this = this
      function newAttr (node, parent) {
        node.checked = false// 是否勾选
        if (!node.leaf) {
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
    // 编制各节点对应关系
    compileFlatTree (arr) {
      var keyCounter = 0
      var childrenKey = 'children'
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
      this.selectPost = arr
      sessionStorage.setItem('selectPost', JSON.stringify(this.selectPost))
    },
    setDetailData (arr) {
      let flag = true
      if ((this.detailData.type === 'PARALLEL_START_AND' || this.detailData.type === 'PARALLEL_START_OR') && arr.length < 2) {
        this.$toast('并行审批节点至少选择两个岗位，请继续添加')
        flag = false
        return flag
      }
      if (arr.length > 0) {
        let jobPositionArr = []
        let jobPositionIdArr = []
        let jobPositionLableArr = []
        let nodeDateIdArr = []
        if (this.detailData.name === 'branch-warp') {
          const len = arr.length
          let childNodeArr = []
          for (let i = 0; i < len; i++) {
            childNodeArr.push({
              'name': 'route',
              'type': 'ROUTE',
              'nodeId': Math.random().toString(36).substr(2),
              'prevId': '',
              'overtime': '',
              'childNode': [{
                'name': '审批节点',
                'type': 'APPROVAL',
                'nodeId': Math.random().toString(36).substr(2),
                'prevId': '',
                'overtime': '',
                'childNode': [],
                'jobPositionId': [],
                'jobPosition': []
              }],
              'jobPositionId': [],
              'jobPosition': []
            })
          }
          this.detailData.childNode = childNodeArr
        }
        arr.forEach((ele, index) => {
          const label = ele.data.name + '(' + (ele.data.userPostName === null ? '' : ele.data.userPostName) + ' ' + (ele.data.userName === null ? '' : ele.data.userName) + ')'
          jobPositionLableArr.push(label)
          jobPositionArr.push(ele.data.userPostName)
          jobPositionIdArr.push(ele.data.userPostId)
          nodeDateIdArr.push(ele.data.nodeDate)
          if (this.detailData.name === 'branch-warp') {
            this.detailData.childNode[index].childNode[0].jobPositionLable = [label]
            this.detailData.childNode[index].childNode[0].jobPosition = [ele.data.userPostName]
            this.detailData.childNode[index].childNode[0].jobPositionId = [ele.data.userPostId]
            this.detailData.childNode[index].childNode[0].nodeDateIdArr = [ele.data.nodeDate]
          }
        })
        this.$set(this.detailData, 'jobPositionLable', jobPositionLableArr)
        this.$set(this.detailData, 'jobPosition', jobPositionArr)
        this.$set(this.detailData, 'jobPositionId', jobPositionIdArr)
        this.$set(this.detailData, 'nodeDateIdArr', nodeDateIdArr)
        this.$set(this.detailData, 'recordSelected', arr)
      } else {
        this.$set(this.detailData, 'jobPosition', [])
        this.$set(this.detailData, 'jobPositionId', [])
        this.$set(this.detailData, 'jobPositionLable', [])
        this.$set(this.detailData, 'nodeDateIdArr', [])
        this.$set(this.detailData, 'recordSelected', [])
      }
      return flag
    },
    // 切换导航改变数据
    changeTreeData (item) {
      if (item.data.id === 'ORZ') {
        this.treeData = this.treeDataDeep
      } else {
        this.treeData = item.children
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
      let result = await context.http.get('uaa/api/user-posts/app?queryName=' + this.inputValue)
      result.data.length ? this.showNoData = false : this.showNoData = true
      this.personData = result.data
      let arr = this.flatTree.filter(item => {
        return item.node.data.nodeDateId
      }).map(item => {
        return item.node
      })
      this.personData.forEach(item => {
        arr.forEach(items => {
          // if (item.data.nodeDateId === items.data.nodeDateId) {
          if (item.userPostId === items.data.userPostId) {
            item.checked = items.checked
            item.nodeKey = items.nodeKey
          }
        })
      })
    },
    handleEearchCheck (item) {
      item.data = {
        ...item
      }
      this.$refs['RecipientsTree'].handleCheck(item, 'search')
      this.$forceUpdate()
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
        if (JSON.stringify(this.selectPost) !== JSON.stringify(this.selectPersonDeep)) {
          MessageBox.confirm('', {
            message: '是否保留此次编辑？',
            confirmButtonText: '保留',
            cancelButtonText: '不保留',
            confirmButtonClass: 'confirmButton',
            cancelButtonClass: 'cancelButton'
          }).then(action => {
            if (action === 'confirm') {
              let flag = this.setDetailData(this.selectPost)
              if (!flag) return
              sessionStorage.setItem('selectPost', JSON.stringify(this.selectPost))
              console.log(this.$route.params)
              this.$router.replace({ name: roterFrom, params: this.$route.params, query: this.$route.query })
            }
          }).catch(error => {
            if (error === 'cancel') {
              sessionStorage.setItem('selectPost', JSON.stringify(this.selectPersonDeep))
              this.$router.replace({ name: roterFrom, params: this.$route.params, query: this.$route.query })
            }
          })
        } else {
          this.$router.replace({ name: roterFrom, params: this.$route.params, query: this.$route.query })
        }
      } else {
        let flag = this.setDetailData(this.selectPost)
        if (!flag) return
        sessionStorage.setItem('selectPost', JSON.stringify(this.selectPost))
        this.$router.replace({ name: roterFrom, params: this.$route.params, query: this.$route.query })
      }
    },
    cancle () {
      if (!this.isIOS) {
        this.showMessage = true
        this.backChange()
      } else {
        if (JSON.stringify(this.selectPost) !== JSON.stringify(this.selectPersonDeep)) {
          MessageBox.confirm('', {
            message: '是否保留此次编辑？',
            confirmButtonText: '保留',
            cancelButtonText: '不保留',
            confirmButtonClass: 'confirmButton',
            cancelButtonClass: 'cancelButton'
          }).then(action => {
            if (action === 'confirm') {
              let flag = this.setDetailData(this.selectPost)
              if (!flag) return
              sessionStorage.setItem('selectPost', JSON.stringify(this.selectPost))
              this.$router.go(-1)
            }
          }).catch(error => {
            if (error === 'cancel') {
              sessionStorage.setItem('selectPost', JSON.stringify(this.selectPersonDeep))
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
        let flag = this.setDetailData(this.selectPost)
        if (!flag) return
        sessionStorage.setItem('selectPost', JSON.stringify(this.selectPost))
        // this.$router.go(-1)
        this.$router.back()
        this.$emit('saveFlowData')
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
    formatSelect (selectPost) {
      let arr = selectPost.filter((item) => item.data.userPostId)
      return arr.length
    }
  }
}
</script>
<style lang="scss">
@import "../../style/config";
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
@import "../../style/config";
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
      display: inline-block;
      color: #444547;
      font-size: rem(13);
      background: #DAEAFF;
      border-radius: rem(2);
      padding: rem(4) rem(6);
      margin-right: rem(10);
      white-space: nowrap;
      flex-basis: 0.85rem;
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
    .disabled{
      background: #c7c7c7;
    }
    .right-warp{
      flex: 1;
      display: flex;
      height: rem(70);
      align-items: center;
      margin-left: rem(14);
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
  .search-results{
    .iconcms_louyuL{
      margin-right: rem(10);
    }
    .tree_info{
      color: #18191A;
      div {
        color: #B3B8BD;
        font-size: rem(13);
      }
    }
    label{
      margin: rem(10) 0;
      height: auto;
      > div {
        &:last-child {
          height: auto;
        }
      }
    }
    .right-warp{
      height: auto;
      margin-bottom: rem(10);
    }
  }
}
</style>
