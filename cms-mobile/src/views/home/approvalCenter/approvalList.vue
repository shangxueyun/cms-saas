<template>
  <div class="approvalList"
       :class="{'focus':focus}">
    <app-header v-if="!focus"
                :title="title">
      <div slot="rightBtn"
           @click="showActionSheet"
           :class="{ selected: openActionsheet }"
           class="iconfont iconcms_shaixuan selectedBtn"></div>
    </app-header>
    <div class="seachInput">
      <form @submit.prevent
            action="#">
        <input class="input"
               id="seachInput"
               results="5"
               focus
               :placeholder="placeholder"
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
    <!-- <div class="title">{{currentProject.referred}}</div> -->
    <div @click="showActionSheet"
         class="selectResult">
      <span>{{currentProject.referred}}</span>
      <!-- <span v-if="title!=='待审批'">{{currentIndustry.value}}</span> -->
    </div>
    <div class="container">
      <ul v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loadBottom"
          infinite-scroll-distance="20"
          infinite-scroll-immediate-check="false"
          v-if="tableData.length"
          class="list">
        <li v-for="(item, index) in tableData"
            @click="appDetails(item)"
            :key="index">
          <p>
            <span>{{item.content}}</span>
            <span>{{formatterTime(item)}}</span>
          </p>
          <div>
            <p>项目：{{item.projectReffer}}</p>
            <p v-if="title==='已处理1'"><span>审批类型：</span>{{item.typeCN}}</p>
            <p style="position: relative;"><span v-if="showTag && String(item.onRead) === 'false'"
                    class="spTag"></span>审批流程名称：{{item.processDefineName}}</p>
            <p v-if="title !== '待审批'"
               class="followRes">最近跟进记录：{{item.followContent}}</p>
            <p>状态：<span :style="{color: formatStatus(item, 'getColor')}">{{formatStatus(item)}}</span></p>
            <p v-if="title !== '我发起的'">发起人：{{item.startUser}}</p>
          </div>
          <span class="iconfont iconright"></span>
        </li>
      </ul>
      <div class="loadAll"
           v-if="loadAll && tableData.length!==0">
        <span>-</span>
        <p>已经到底了</p>
        <span>-</span>
      </div>
      <div class="noData"
           v-if="tableData.length===0 && dataReady">
        <img src="../../../assets/nores.png">
        <p>暂无数据</p>
      </div>
    </div>
    <!-- 项目筛选 -->
    <!-- <action-sheet :open.sync="openActionsheet">
      <div slot="content">
        <ul>
          <li @click="selectLi(-1, {referred: '全部项目'})"
              :class="{ selected: -1 === tabIndex }">全部项目</li>
          <li v-for="(item, index) in projectManagementList"
              :key="item.id"
              @click="selectLi(index, item)"
              :class="{ selected: index === tabIndex }">
            <span>{{ item.referred }}</span>
          </li>
        </ul>
      </div>
    </action-sheet> -->
    <!-- 右侧筛选 -->
    <van-popup v-model="openActionsheet"
               class="popup_common"
               :overlay-style="{'background-color': 'rgba(0,0,0,.4)'}"
               :style="{ height: '100%' }"
               position="right">
      <p class="popup_title">筛选</p>
      <div class="popup_container">
        <div class="popup_list">
          <p>项目分类</p>
          <ul>
            <li v-for="(item, index) in projectManagementList"
                :key="item.id"
                @click="selectProject(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.referred }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list"
             v-if="title=='已处理1'">
          <p>审批类型</p>
          <ul>
            <li v-for="(item, index) in approvalTypeOptions"
                :key="item.id"
                @click="sleectApprovalType(index,item)"
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
    <!-- <div v-show="shadeBox"
         @touchmove.prevent
         class="shadeBox"></div> -->
  </div>
</template>
<script>
import AppHeader from '@/components/appHead'
import ActionSheet from '@/components/Actionsheet'
import context from '@/service'
import { InfiniteScroll } from 'mint-ui'
import lodash from 'lodash'
export default {
  name: 'approvalList',
  components: { AppHeader, ActionSheet, InfiniteScroll },
  props: ['scrollTop'],
  watch: {
    scrollTop (val) {
      this.scrollVal = val
    }
  },
  data () {
    return {
      scrollVal: 0,
      title: '',
      openActionsheet: false,
      tabIndex: -1,
      currentProject: { referred: '全部项目', id: '' },
      currentIndustry: { id: '', value: '全部类型' },
      projectManagementList: [],
      approvalTypeOptions: [],
      shadeBox: false,
      focus: false,
      inputValue: '',
      page: 0,
      size: 10,
      loadBottom: false,
      tableData: [],
      dataReady: false,
      loadAll: false,
      flag: true,
      showTag: false,
      placeholder: '请输入审批标题/客户名称/发起人'
    }
  },
  activated () {
    // if (!this.$route.meta.isBack || this.$route.query.title !== '待审批') {
    let upDateRecord = window.sessionStorage.getItem('upDateRecord')
    if (!this.$route.meta.isBack || upDateRecord) {
      window.sessionStorage.removeItem('upDateRecord')
      Object.assign(this.$data, this.$options.data())
      this.title = this.$route.query.title
      this.finshed = this.$route.query.finshed
      this.approvalOperation = this.$route.query.approvalOperation
      this.queryProjectManagement()
      this.getApprovalType()
      this.query()
      if (this.title === '我发起的') {
        this.placeholder = '请输入审批标题/客户名称'
      } else {
        this.placeholder = '请输入审批标题/客户名称/发起人'
      }
    }
    let scrollVal = window.sessionStorage.getItem('scrollVal')
    if (scrollVal) {
      this.$emit('changeScroll', scrollVal)
    }
  },
  deactivated () {
    // console.log('deactivated')
  },
  destroyed () {
    // console.log('destroyed')
  },
  beforeRouteEnter (to, from, next) {
    if (from.path === '/index/approvalCenter') {
      to.meta.isBack = false
    } else {
      to.meta.isBack = true
    }
    next()
  },
  created () {
    // console.log('created')
    if (sessionStorage.getItem('approvalProject') && sessionStorage.getItem('tabIndex')) {
      this.currentProject = JSON.parse(sessionStorage.getItem('approvalProject'))
      this.tabIndex = Number(sessionStorage.getItem('tabIndex'))
    }
    sessionStorage.removeItem('approvalProject')
    this.title = this.$route.query.title
    this.finshed = this.$route.query.finshed
    this.approvalOperation = this.$route.query.approvalOperation
  },
  mounted () {

  },
  methods: {
    selectLi (index, item) {
      this.tabIndex = index
      this.openActionsheet = false
      this.currentProject = item
      this.page = 0
      this.tableData = []
      this.query()
    },
    async queryProjectManagement () {
      const res = await context.http.get('cms/api/project-managements', { useStatus: 'USING' })
      res.data.unshift({ id: '', referred: '全部项目', checked: true })
      this.projectManagementList = res.data
    },
    selectProject (index, item) {
      this.projectManagementList = this.checkedFormat(index, this.projectManagementList)
    },
    sleectApprovalType (index, item) {
      this.approvalTypeOptions = this.checkedFormat(index, this.approvalTypeOptions)
    },
    checkedFormat (i, arr) {
      arr = arr.map(item => {
        item.checked = false
        return item
      })
      arr[i].checked = true
      return arr
    },
    async submit (state) {
      if (state === 'reset') {
        if (!this.projectManagementList.length) return
        this.projectManagementList = this.checkedFormat(0, this.projectManagementList)
        this.approvalTypeOptions = this.checkedFormat(0, this.approvalTypeOptions)
      } else {
        if (!this.projectManagementList.length) {
          this.approvalTypeOptions = false
          return
        }
        this.currentProject = this.projectManagementList.filter(item => item.checked)[0]
        this.currentIndustry = this.approvalTypeOptions.filter(item => item.checked)[0]
        this.page = 0
        this.tableData = []
        this.query()
        this.openActionsheet = false
      }
    },
    async getApprovalType () {
      let result = await context.http.get('cms/api/process-defines/processType?flag=false')
      result.data.unshift({ id: '', value: '全部类型', checked: true }, { id: -2, value: '非标审批' })
      this.approvalTypeOptions = result.data
    },
    showActionSheet () {
      // 项目
      this.projectManagementList = this.projectManagementList.map(item => {
        item.checked = false
        if (item.id === this.currentProject.id) item.checked = true
        return item
      })
      this.approvalTypeOptions = this.approvalTypeOptions.map(item => {
        item.checked = false
        if (item.id === this.currentIndustry.id) item.checked = true
        return item
      })
      this.openActionsheet = !this.openActionsheet
    },
    compositions (flag) {
      this.flag = flag
    },
    onKeyInput: lodash.debounce(function (event) {
      if (event.keyCode !== 13 && this.flag) {
        this.shadeBox = false
        this.page = 0
        this.tableData = []
        this.query()
      }
    }, 600),
    inputFocus () { // 获取焦点
      this.focus = true
      this.shadeBox = true
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
    toContacts () { // 取消
      this.focus = false
      this.shadeBox = false
      this.inputValue = ''
      this.page = 0
      this.tableData = []
      this.query()
    },
    async getProcessList (url, type) { // 请求列表封装
      this.dataReady = false
      this.searchTag = true
      let sort = '?sort=lastModifiedDate,desc&sort=id,desc'
      if (type === 'cc') {
        // sort = '?sort=createdDate,desc&sort=id,desc'
        this.showTag = true
      }
      if (type === 'deal') {
        this.showTag = true
      }
      let result = await context.http.get(`cms/api/${url}` + sort, { page: this.page, size: this.size, title: this.inputValue, projectManagementId: this.currentProject.id, processType: this.currentIndustry.id })
      if (result.status === 200) {
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
      }
    },
    loadMore () {
      this.loadBottom = true
      this.query()
    },
    async query () {
      if (this.title === '待审批') {
        this.getProcessList('process-tasks/undeal') // 待处理
      } else if (this.title === '我发起的') {
        this.getProcessList('process-instances/myStart') // 我发起的
      } else if (this.title === '已处理') {
        this.getProcessList('process-tasks/deal', 'deal') // 已处理
      } else if (this.title === '抄送我的') {
        this.getProcessList('process-tasks/cc', 'cc') // 抄送我的
      }
    },
    formatterTime (row) {
      if (row.time) {
        return row.time.substring(0, 10)
      }
    },
    formatStatus (row, getColor) {
      switch (this.title) {
        case '待审批':
          if (!row.processApproval) {
            return getColor ? '#3575F6' : '待处理'
          } else if (row.processApproval === 'REJECT') {
            return getColor ? '#FC5159' : '已驳回'
          } else if (row.processApproval === 'WITHDRAW') {
            return getColor ? '#FC5159' : '已撤回'
          }
          break
        case '我发起的':
          if (row.processStatus === 'RUNING') {
            return getColor ? '#3575F6' : '审核中'
          } else if (row.processStatus === 'REJECT') {
            return getColor ? '#FC5159' : '已驳回'
          } else if (row.processStatus === 'CLOSED') {
            return getColor ? '#858C94' : '已关闭'
          } else if (row.processStatus === 'FINISHED') {
            return getColor ? '#1CC296' : '已通过'
          }
          break
        case '已处理':
          if (row.processApproval === 'AGREED') {
            return getColor ? '#1CC296' : '已通过'
          } else if (row.processApproval === 'REJECT') {
            return getColor ? '#FC5159' : '已驳回'
          } else if (row.processApproval === 'CLOSE') {
            return getColor ? '#858C94' : '已关闭'
          } else if (row.processApproval === 'AUTO') {
            return getColor ? '#F99A12' : '自动处理'
          } else if (row.processApproval === 'REPOST') {
            return getColor ? '#3575F6' : '已提交'
          } else if (row.processApproval === 'WITHDRAW') {
            return getColor ? '#FC5159' : '已撤回'
          }
          break
        case '抄送我的':
          if (!row.processStatus) {
            return getColor ? '#3575F6' : '审核中'
          } else if (row.processStatus === 'REJECT') {
            return getColor ? '#FC5159' : '已驳回'
          } else if (row.processStatus === 'CLOSED') {
            return getColor ? '#858C94' : '已关闭'
          } else if (row.processStatus === 'AGREED') {
            return getColor ? '#1CC296' : '已通过'
          }
      }
    },
    appDetails (item) {
      sessionStorage.setItem('approvalProject', JSON.stringify(this.currentProject))
      sessionStorage.setItem('tabIndex', this.tabIndex)
      sessionStorage.setItem('titleType', this.title)
      sessionStorage.setItem('scrollVal', this.scrollVal)
      if (this.title === '抄送我的') {
        window.sessionStorage.setItem('upDateRecord', true)
      }
      if (item.typeCN === '合同新增' || item.typeCN === '合同签订' || item.typeCN === '合同续签') {
        this.$router.push({ name: 'approvalDetails', query: { row: JSON.stringify(item), finshed: this.finshed, approvalOperation: this.approvalOperation } })
      } else if (item.typeCN === '合同退租') {
        let processDefineName = ''
        let contractNo = ''
        this.$router.push({ name: 'contractTenancy', query: { row: JSON.stringify(item), approvalOperation: this.approvalOperation, finshed: this.finshed, processDefineName: processDefineName, contractNo: contractNo } })
      } else { // 非标审批以及通用审批
        this.$router.push({ name: 'customApproval', query: { row: JSON.stringify(item), approvalOperation: this.approvalOperation, finshed: this.finshed } })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
.approvalList {
  .selectedBtn {
    padding-left: rem(8);
    font-size: rem(18);
    color: #444547;
  }
  .selected {
    color: #0139a4;
  }
  .actionsheet_wrapper {
    top: rem(41);
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-start;
      padding-top: rem(10);
    }
    li {
      display: inline-block;
      width: rem(100);
      height: rem(30);
      line-height: rem(30);
      color: #444547;
      font-size: rem(13);
      text-align: center;
      background: rgba(242, 242, 242, 1);
      margin-bottom: rem(10);
      margin-left: rem(18);
      border-radius: rem(3);
      &.selected {
        color: #0139a4;
        background: rgba(239, 246, 255, 1);
      }
      .iconfont {
        display: inline-block;
        margin-right: rem(16);
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
  .title {
    width: 100%;
    position: fixed;
    left: 0;
    top: rem(90);
    height: rem(28);
    line-height: rem(28);
    padding: 0 rem(14);
    font-size: rem(13);
    color: #444547;
    z-index: 1;
    background: #f8f9fa;
  }
  &.focus {
    .input {
      width: rem(300) !important;
    }
    .seachInput {
      top: 0 !important;
      border-top: 0;
    }
    .selectResult {
      top: rem(50);
    }
    .title {
      top: rem(50);
    }
    .container {
      padding-top: rem(78);
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
  .container {
    padding-top: rem(118);
    .list {
      li {
        padding: rem(10) rem(14);
        position: relative;
        margin-bottom: rem(10);
        background: #fff;
        > p {
          display: flex;
          width: 100%;
          justify-content: space-between;
          margin-bottom: rem(6);
          span {
            display: block;
            line-height: rem(20);
            color: #858c94;
            font-size: rem(13);
            width: rem(90);
            text-align: right;
            &:first-child {
              text-align: left;
              flex: 1;
              color: #18191a;
              font-weight: 600;
              font-size: rem(15);
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin-right: rem(5);
            }
          }
        }
        > div {
          > p {
            color: #858c94;
            font-size: rem(14);
            margin-bottom: rem(4);
            &:last-child {
              margin-bottom: 0;
            }
            span {
              color: #858c94;
            }
          }
          .followRes {
            width: 100%;
            overflow: hidden; /*超出部分隐藏*/
            -webkit-line-clamp: 3;
            text-overflow: ellipsis;
          }
        }
        > span {
          position: absolute;
          right: rem(10);
          top: rem(60);
          font-size: rem(17);
          color: #c6c6c6;
        }
      }
      .spTag {
        display: inline-block;
        width: rem(8);
        height: rem(8);
        border-radius: 50%;
        background-color: $color-red-1;
        position: absolute;
        left: rem(-10);
        top: rem(6);
      }
    }
  }
}
</style>
