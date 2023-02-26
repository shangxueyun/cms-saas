<template>
  <div class="interestedList"
       :class="{'focus':focus}">
    <app-header v-if="!focus"
                :title="title"
                :onBack="true"
                backRoute="index">
      <div slot="rightBtn"
           @click="showActionSheet"
           :class="{ selected: popupShow, widthrightBtn: !hasAuthority('02020401') }"
           class="iconfont iconcms_shaixuan selectedBtn"></div>
      <div v-if="hasAuthority('02020401')"
           slot="rightBtn"
           @click="addCustomers"
           class="iconfont iconcms_tianjia"></div>
    </app-header>
    <div class="seachInput">
      <form @submit.prevent
            action="#">
        <input class="input"
               id="seachInput"
               results="5"
               focus
               placeholder="请输入品牌名称或客户名称"
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
    <div class="title"><span>{{currentProject.referred}}</span><span>{{currentIndustry.value}}</span><span>{{usingSelect.label}}</span></div>
    <div class="container">
      <ul v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loadBottom"
          infinite-scroll-distance="20"
          infinite-scroll-immediate-check="false"
          v-if="tableData.length"
          class="list">
        <li v-for="(item, index) in tableData"
            @click="goDetails(item)"
            :key="index">
          <p>
            <span>
              <i>{{item.referred}}</i>
              <span>{{item.industryName}}</span>
            </span>
            <span :style="{color: dealOddsFormat(item, 'getColor')}">{{dealOddsFormat(item)}}</span>
          </p>
          <div>
            <p>{{item.projectManagementDTO.referred}}</p>
            <p>{{item.yxTenantName}}</p>
            <p>心理价位：<span>{{lowPriceAndHighPrice(item)}}</span></p>
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
          <p>业态</p>
          <ul>
            <li v-for="(item, index) in industryList"
                :key="item.id"
                @click="selectIndustry(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.value }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>状态</p>
          <ul>
            <li v-for="(item, index) in usingOptions"
                :key="item.value"
                @click="selectState(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.label }}</span>
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
import context from '@/service'
import { InfiniteScroll, Toast } from 'mint-ui'
const allProjectObj = {
  id: '',
  referred: '全部项目',
  checked: true
}
const industryObj = {
  id: '',
  value: '全部业态',
  checked: true
}
let roterFrom = null
export default {
  name: 'interestedList',
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
      title: '意向客户',
      projectManagementList: [],
      industryList: [],
      currentProject: {},
      currentIndustry: {},
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
      popupShow: false,
      usingSelect: {
        value: true,
        label: '使用中'
      },
      usingOptions: [
        {
          value: '',
          label: '全部'
        },
        {
          value: true,
          label: '使用中',
          checked: true
        },
        {
          value: false,
          label: '已停用'
        }
      ]
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
    if (sessionStorage.getItem('usingSelect')) {
      this.usingSelect = JSON.parse(sessionStorage.getItem('usingSelect'))
    }
    if (roterFrom === 'CustomersDetails') {
      let scrollVal = window.sessionStorage.getItem('scrollVal')
      if (scrollVal) {
        this.$emit('changeScroll', scrollVal)
      }
    } else {
      sessionStorage.removeItem('currentProject')
      sessionStorage.removeItem('currentIndustry')
      this.currentProject = allProjectObj
      this.currentIndustry = industryObj
      this.usingOptions = this.checkedFormat(1, this.usingOptions)
      this.usingSelect = this.usingOptions[1]
      window.sessionStorage.removeItem('scrollVal')
      this.$emit('changeScroll', 0)
      this.queryProjectManagement()
      this.getIndustry()
    }
  },
  created () {
    // this.queryProjectManagement()
    // this.getIndustry()
  },
  mounted () {
  },
  methods: {
    async queryProjectManagement () {
      const res = await context.http.get('cms/api/project-managements', { useStatus: 'USING' })
      res.data.unshift(allProjectObj)
      res.data[0].checked = true
      this.projectManagementList = res.data
      // if (sessionStorage.getItem('currentProject')) {
      //   this.currentProject = JSON.parse(sessionStorage.getItem('currentProject'))
      //   sessionStorage.removeItem('currentProject')
      // } else {
      //   this.currentProject = res.data[0]
      // }
    },
    async getIndustry () {
      let result = await context.http.get(`uaa/api/paramet-managements/name?name=行业`)
      result.data.unshift(industryObj)
      result.data[0].checked = true
      this.industryList = result.data
      // if (sessionStorage.getItem('currentIndustry')) {
      //   this.currentIndustry = JSON.parse(sessionStorage.getItem('currentIndustry'))
      //   sessionStorage.removeItem('currentIndustry')
      // } else {
      //   this.currentIndustry = result.data[0]
      // }
      this.toContacts()
    },
    showActionSheet () {
      this.projectManagementList = this.projectManagementList.map(item => {
        item.checked = false
        if (item.id === this.currentProject.id) item.checked = true
        return item
      })
      if (this.currentIndustry && this.currentIndustry.id) {
        this.industryList = this.industryList.map(item => {
          item.checked = false
          if (item.id === this.currentIndustry.id) item.checked = true
          return item
        })
      }
      this.popupShow = !this.popupShow
    },
    selectProject (index, item) {
      this.projectManagementList = this.checkedFormat(index, this.projectManagementList)
    },
    selectIndustry (index, item) {
      this.industryList = this.checkedFormat(index, this.industryList)
    },
    selectState (index, item) {
      this.usingOptions = this.checkedFormat(index, this.usingOptions)
    },
    async query () {
      this.dataReady = false
      this.loadAll = false
      this.searchTag = true
      let result = await context.http.get(`cms/api/yxTenant/pool?sort=lastModifiedDate,desc`, {
        projectManagement: this.currentProject.id,
        industryId: this.currentIndustry.id,
        name: this.inputValue,
        using: this.usingSelect.value,
        page: this.page,
        size: this.size
      })
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
    async submit (state) {
      if (state === 'reset') {
        if (!this.projectManagementList.length) return
        this.projectManagementList = this.checkedFormat(0, this.projectManagementList)
        this.industryList = this.checkedFormat(0, this.industryList)
        this.usingOptions = this.checkedFormat(1, this.usingOptions)
      } else {
        if (!this.projectManagementList.length) {
          this.popupShow = false
          return
        }
        this.currentProject = this.projectManagementList.filter(item => item.checked)[0]
        this.currentIndustry = this.industryList.filter(item => item.checked)[0]
        this.usingSelect = this.usingOptions.filter(item => item.checked)[0]
        this.page = 0
        this.tableData = []
        this.query()
        this.popupShow = false
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
    loadMore () {
      this.loadBottom = true
      this.query()
    },
    checkedFormat (i, arr) {
      arr = arr.map(item => {
        item.checked = false
        return item
      })
      arr[i].checked = true
      return arr
    },
    dealOddsFormat (row, getColor) {
      switch (row.dealOdds) {
        case 'ZERO':
          return getColor ? '#858C94' : '无意向'
        case 'FIFTY':
          return getColor ? '#3575F6' : '招商跟进中'
        case 'NINETY':
          return getColor ? '#444547' : '签约审批中'
        case 'HUNDRED':
          return getColor ? '#444547' : '合同执行中'
        default:
          return getColor ? '#3575F6' : '-'
      }
    },
    lowPriceAndHighPrice (row) {
      let priceUnit = ''
      if (row.priceUnit === 'M2DAYS') {
        priceUnit = '元/m²·天'
      } else if (row.priceUnit === 'MONTH') {
        priceUnit = '元/月'
      } else if (row.priceUnit === 'YEAR') {
        priceUnit = '元/年'
      }
      if (row.lowArea && row.highPrice) {
        return row.lowPrice + ' ~ ' + row.highPrice + priceUnit
      } else {
        return '-'
      }
    },
    addCustomers () {
      this.$router.push({ name: 'addIntentionCustomers' })
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    goDetails (item) {
      if (!this.hasAuthority('02020402')) {
        Toast({
          message: '你的账号没有查看意向客户信息的权限',
          position: 'top'
        })
        return
      }
      if (this.currentProject.id) {
        sessionStorage.setItem('currentProject', JSON.stringify(this.currentProject))
      }
      if (this.currentIndustry.id) {
        sessionStorage.setItem('currentIndustry', JSON.stringify(this.currentIndustry))
      }
      window.sessionStorage.setItem('scrollVal', this.scrollVal)
      if (this.usingSelect.value) {
        sessionStorage.setItem('usingSelect', JSON.stringify(this.usingSelect))
      }
      this.$router.push({ name: 'CustomersDetails', query: { 'tenantID': item.id } })
    }
  }
}
</script>
<style lang="scss">
@import "../../../style/config";
.interestedList {
  #app-head {
    .title {
      padding-right: rem(40);
    }
    .right_btn {
      width: rem(80);
      display: flex;
      position: fixed;
      right: 0;
      top: 0;
      .iconfont {
        width: rem(40);
        padding-left: rem(8);
        &:last-child {
          color: #444547;
        }
      }
      .widthrightBtn {
        padding-left: rem(48);
      }
    }
  }
}
</style>
<style lang="scss" scoped>
@import "../../../style/config";
.interestedList {
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
    > span {
      border-right: rem(1) solid #d8d8d8;
      margin-left: rem(15);
      padding-right: rem(15);
    }
    > span:last-child {
      border-right: 0;
    }
    > span:first-child {
      margin-left: 0;
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
          > span {
            display: block;
            line-height: rem(20);
            color: #858c94;
            font-size: rem(15);
            width: rem(90);
            text-align: right;
          }
          > span:first-child {
            text-align: left;
            flex: 1;
            // color:#18191A;
            // font-weight: 600;
            // font-size: rem(15);
            // overflow:hidden;
            // text-overflow:ellipsis;
            // white-space:nowrap;
            // margin-right:rem(5);
            display: flex;
            > i {
              text-align: left;
              color: #18191a;
              font-weight: bold;
              font-size: rem(15);
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-style: normal;
              max-width: rem(200);
            }
            > span {
              background: #eff6ff;
              height: rem(17);
              font-weight: 500;
              line-height: rem(17);
              font-size: rem(12);
              color: #0139a4;
              padding: 0 rem(3);
              vertical-align: center;
              margin-left: rem(12);
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
        }
        > span {
          position: absolute;
          right: rem(10);
          top: rem(45);
          font-size: rem(17);
          color: #c6c6c6;
        }
      }
    }
  }
}
</style>
