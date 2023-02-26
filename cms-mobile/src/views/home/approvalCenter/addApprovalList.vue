<template>
  <div class="addApprovalList"
       :class="{'focus':focus}">
    <app-header v-if="!focus"
                :title="title"
                :onBack="true"
                backRoute="approvalCenter">
      <div slot="rightBtn"
           @click="showActionSheet"
           :class="{ selected: popupShow }"
           class="iconfont iconcms_shaixuan selectedBtn"></div>
    </app-header>
    <div class="seachInput">
      <form @submit.prevent
            action="#">
        <input class="input"
               id="seachInput"
               results="5"
               focus
               placeholder="请输入审批流程名称"
               type="search"
               v-model="inputValue"
               @input="onKeyInput"
               @compositionstart="compositions(false)"
               @compositionend="compositions(true)"
               @focus="inputFocus"
               @keyup.13="onKeyInput"
               @keypress="search" />
      </form>
      <i class="mintui mintui-search"></i>
      <span class="cannelBtn"
            v-if="focus"
            @click="toContacts">取消</span>
    </div>
    <div class="container">
      <ul v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loadBottom"
          infinite-scroll-distance="20"
          infinite-scroll-immediate-check="false"
          v-if="tableData.length"
          class="list">
        <li @click="toDetails(item)"
            v-for="(item, index) in tableData">
          <div>
            <p><span>项目：</span>{{item.projectManagementName}}</p>
            <p><span>审批类型：</span>{{item.typeCn}}</p>
            <p><span>审批流程名称：</span><span class="name">{{item.name}}</span></p>
          </div>
          <span class="iconfont iconright"></span>
        </li>
      </ul>
      <div class="loadAll"
           v-if="loadAll && tableData.length!==0">
        <span>-</span>
        <p>你碰到我的底线了</p>
        <span>-</span>
      </div>
      <div class="noData"
           v-if="tableData.length===0 && dataReady">
        <img src="../../../assets/nores.png">
        <p>暂无数据</p>
      </div>
    </div>

    <!-- <div v-show="shadeBox"
         @touchmove.prevent
         class="shadeBox"></div> -->

    <!-- 右侧筛选 -->
    <van-popup v-model="popupShow"
               class="popup_common"
               :overlay-style="{'background-color': 'rgba(0,0,0,.4)'}"
               :style="{ height: '100%' }"
               position="right">
      <p class="popup_title">筛选</p>
      <div class="popup_container">
        <div class="popup_list">
          <p>项目</p>
          <ul>
            <li v-for="(item, index) in projectManagementList"
                :key="item.id"
                @click="selectProject(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.referred }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>审批类型</p>
          <ul>
            <li v-for="(item, index) in industryList"
                :key="item.id"
                @click="selectIndustry(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.value }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="popup_buttons">
        <div @click="submit('reset')"
             class="popup_default">重置</div>
        <div @click="submit"
             class="popup_active">确定</div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import AppHeader from '@/components/appHead'
import context from '@/service'
import { InfiniteScroll } from 'mint-ui'
const allProjectObj = {
  id: '',
  referred: '全部项目',
  checked: true
}
const industryObj = {
  id: '',
  value: '全部类型',
  checked: true
}
let roterFrom = null
export default {
  name: 'addApprovalList',
  props: ['scrollTop'],
  components: { AppHeader, InfiniteScroll },
  watch: {
    scrollTop (val) {
      this.scrollVal = val
    }
  },
  data () {
    return {
      scrollVal: 0,
      title: '新建审批',
      page: 0,
      size: 10,
      loadBottom: false,
      tableData: [],
      dataReady: false,
      loadAll: false,
      onBack: false,
      inputValue: '',
      shadeBox: false,
      focus: false,
      flag: true,
      popupShow: false,
      currentProject: {},
      currentIndustry: [{ value: '全部类型', id: '' }],
      projectManagementList: [],
      industryList: []
    }
  },
  beforeRouteEnter (to, from, next) {
    roterFrom = from.name
    next()
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'index') {
      window.sessionStorage.removeItem('scrollVal')
    }
    next()
  },
  activated () {
    if (roterFrom === 'addApproval') {
      if (sessionStorage.getItem('loadBottom')) {
        sessionStorage.getItem('loadBottom') === 'false' ? this.loadBottom = false : this.loadBottom = true
      }
      sessionStorage.removeItem('loadBottom')
      let scrollVal = window.sessionStorage.getItem('scrollVal')
      if (scrollVal) {
        this.$emit('changeScroll', scrollVal)
      }
    } else {
      window.sessionStorage.removeItem('scrollVal')
      this.currentIndustry = [{ value: '全部类型', id: '' }]
      this.$emit('changeScroll', 0)
      this.queryProjectManagement()
      this.getApprovalType()
    }
  },
  created () {
    // this.queryProjectManagement()
    // this.getApprovalType()
  },
  deactivated () {
    this.loadBottom = true
  },
  mounted () {
  },
  methods: {
    toDetails (item) {
      window.sessionStorage.setItem('scrollVal', this.scrollVal)
      this.$router.push({ path: '/addApproval', query: { row: JSON.stringify(item) } })
    },
    loadMore () {
      this.loadBottom = true
      this.query()
    },
    async query () {
      this.searchTag = true
      const currentIndustry = this.currentIndustry.map(item => {
        return item.id
      })
      let result = await context.http.get('cms/api/process-defines'
        , {
          page: this.page,
          size: this.size,
          sort: 'id,desc',
          useStatus: 'USING',
          flag: true,
          name: this.inputValue,
          projectId: this.currentProject.id,
          processType: currentIndustry.toString()
        })
      this.dataReady = true
      this.tableData = this.tableData.concat(result.data)
      if (this.tableData.length === Number(result.headers['x-total-count'])) this.loadAll = true
      if (result.data.length > 0) {
        this.loadBottom = false
        this.page = this.page + 1
      } else {
        this.page = this.page - 1
      }
      this.searchTag = false
    },
    toContacts () { // 取消
      this.focus = false
      this.shadeBox = false
      this.inputValue = ''
      this.page = 0
      this.tableData = []
      this.query()
    },
    search (event) { // 键盘完成事件
      if (event.keyCode === 13) {
        event.preventDefault() // 禁止默认事件（默认是换行）
        this.inputValue = event.target.value
        this.page = 0
        this.tableData = []
        if (!this.searchTag) this.query()
      }
    },
    compositions (flag) {
      this.flag = flag
    },
    onKeyInput (event) { // 输入
      if (event.keyCode !== 13 && this.flag) {
        this.shadeBox = false
        this.page = 0
        this.tableData = []
        this.$nextTick(() => {
          this.query()
        })
      }
    },
    inputFocus () { // 获取焦点
      this.focus = true
      this.shadeBox = true
    },
    async queryProjectManagement () {
      const res = await context.http.get('cms/api/project-managements', { useStatus: 'USING' })
      res.data.unshift(allProjectObj)
      res.data[0].checked = true
      this.projectManagementList = res.data
      this.currentProject = res.data[0]
      this.query()
    },
    async getApprovalType () {
      // let result = await context.http.get('uaa/api/paramet-managements/name?name=审批类型')
      let result = await context.http.get('cms/api/process-defines/processType?flag=true')
      result.data.unshift(industryObj)
      result.data[0].checked = true
      this.industryList = result.data
    },
    showActionSheet () {
      this.projectManagementList = this.projectManagementList.map(item => {
        item.checked = false
        if (item.id === this.currentProject.id) item.checked = true
        return item
      })
      if (this.currentIndustry) {
        this.industryList = this.industryList.map(item => {
          item.checked = false
          this.currentIndustry.forEach(v => {
            if (item.value === v.value) item.checked = true
          })
          return item
        })
      }
      this.popupShow = !this.popupShow
    },
    checkedFormat (i, arr) {
      arr = arr.map(item => {
        item.checked = false
        return item
      })
      arr[i].checked = true
      return arr
    },
    selectProject (index, item) {
      this.projectManagementList = this.checkedFormat(index, this.projectManagementList)
    },
    selectIndustry (index, item) {
      // let list = this.industryList
      // if (i === 0) {
      //   if (!item.checked) {
      //     list = this.checkedFormat(0, list)
      //   }
      // } else {
      //   list[i].checked = !list[i].checked
      //   const checkedLength = list.filter(item => item.checked).length
      //   list[0].checked = checkedLength === 0
      // }
      // this.industryList = []
      // this.industryList = list

      this.industryList = this.checkedFormat(index, this.industryList)
    },
    async submit (state) {
      if (state === 'reset') {
        if (!this.projectManagementList.length) return
        this.projectManagementList = this.checkedFormat(0, this.projectManagementList)
        this.industryList = this.checkedFormat(0, this.industryList)
      } else {
        if (!this.projectManagementList.length) {
          this.popupShow = false
          return
        }
        this.currentProject = this.projectManagementList.filter(item => item.checked)[0]
        this.currentIndustry = this.industryList.filter(item => item.checked)
        this.page = 0
        this.tableData = []
        this.query()
        this.popupShow = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
.addApprovalList {
  .selectedBtn {
    padding-left: rem(8);
    font-size: rem(18);
    color: #444547;
  }
  .container {
    padding-top: rem(80);
    .list {
      li {
        padding: rem(10) rem(14);
        position: relative;
        margin-bottom: rem(10);
        background: #fff;
        > div {
          > p {
            color: #18191a;
            font-size: rem(14);
            margin-bottom: rem(8);
            display: flex;
            &:last-child {
              margin-bottom: 0;
            }
            span {
              width: rem(120);
              display: block;
              color: #858c94;
              &.name {
                width: 300px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }
        }
        > span {
          position: absolute;
          right: rem(10);
          top: rem(36);
          font-size: rem(17);
          color: #c6c6c6;
        }
      }
    }
  }
  .seachInput {
    height: $foot-height;
    width: 100%;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    padding: 0 rem(15);
    position: fixed;
    top: rem(40);
    z-index: 3;
    #seachInput::-webkit-search-cancel-button {
      display: none;
    }
    .mintui-search {
      position: absolute;
      left: rem(20);
      top: rem(18);
      color: #666666;
    }
    .input {
      // width: rem(300);
      width: rem(345);
      height: rem(30);
      background: rgba(244, 244, 244, 1);
      border-radius: rem(2);
      padding-left: rem(25);
      font-size: rem(13);
    }
    .cannelBtn {
      color: #0139a4;
      font-size: rem(15);
      margin-left: rem(10);
    }
  }
  &.focus {
    .input {
      width: rem(300) !important;
    }
    .seachInput {
      top: 0 !important;
      border-top: 0;
    }
    .title {
      top: rem(50);
    }
    .container {
      padding-top: rem(50);
    }
    .shadeBox {
      height: calc(100% - #{$foot-height});
      position: fixed;
      left: 0;
      top: $foot-height;
      width: 100%;
      background: rgba(0, 0, 0, 0.2);
      z-index: 2;
    }
  }
}
</style>
