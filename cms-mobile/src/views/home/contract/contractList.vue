<template>
  <div class="contractList"
       :class="{'focus':focus}">
    <app-header v-if="!focus"
                :title="title"
                :onBack="true"
                backRoute="index">
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
               placeholder="请输入地址或客户名称"
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
    <div class="title" @click="showActionSheet">
      <span>
        <span>{{currentEnterprise.name}}</span>
      </span>
      <span>
        <span>{{currentProject.referred}}</span>
      </span>
      <span>
        <span>{{contractType === 'RENT' ? '一手租赁' : contractType === 'SUBLET' ? '转租' : '全部方式'}}</span>
      </span>
      <span v-if="dateContract">
        <span>{{dateContract}}</span>
      </span>
    </div>
    <div class="container">
      <ul v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loadBottom"
          infinite-scroll-distance="20"
          infinite-scroll-immediate-check="false"
          v-if="tableData.length"
          class="list">
        <li @click="toContactsDetail(item)"
            v-for="(item, index) in tableData"
            :key="index">
          <p>
            <span>{{item.tenantName}}</span>
            <span :style="{color: dealOddsFormat(item, 'getColor')}">{{dealOddsFormat(item)}}</span>
          </p>
          <div>
            <p>合同编号：{{item.contractNo}}</p>
            <p>管理企业：{{item.organizeName}}</p>
            <p>合同起止日：{{item.startDate}}至{{item.endDate}}</p>
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
          <p>管理企业</p>
          <ul>
            <li v-for="(item, index) in enterpriseOptions"
                :key="item.id"
                @click="setChecked(item, index)"
                :class="{ selected: item.checked }">
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </div>
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
          <p>租赁方式</p>
          <ul>
            <li v-for="(item, index) in leaseModeList"
                :key="item.id"
                @click="selectleaseMode(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.referred }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>合同到期日</p>
          <div @click="dateContractShow = true" class="contract_date">{{dateContractlable ? dateFormat(dateContractlable) : '请选择日期'}}</div>
        </div>
        <!-- <div class="popup_list">
          <p>合同状态<span>（可多选）</span></p>
          <ul>
            <li v-for="(item, index) in industryList"
                :key="item.value"
                @click="selectIndustry(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.text }}</span>
            </li>
          </ul>
        </div> -->
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
    <van-popup :style="{ height: '50%' }" v-model="dateContractShow"
               position="bottom">
      <van-datetime-picker
                          v-model="dateContractlable"
                          type="date"
                          title="选择年月日"
                          value-format="yyyy-MM-dd"
                          @cancel="dateContractShow = false"
                          @confirm="startMonthConfirm"
                        />
    </van-popup>
  </div>
</template>
<script>
import Vue from 'vue'
import AppHeader from '@/components/appHead'
import context from '@/service'
import moment from 'moment'
import { InfiniteScroll, Toast } from 'mint-ui'
import { Popup, DatetimePicker } from 'vant'
Vue.use(Popup)
Vue.use(DatetimePicker)
const allEnterpriseObj = {
  id: '',
  name: '全部企业',
  checked: true
}
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
  name: 'contractList',
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
      title: '合同列表',
      projectManagementList: [],
      industryList: [{ text: '全部状态', value: '', checked: true }, { text: '暂存', value: 'STORAGE' }, { text: '待执行', value: 'PENDING' }, { text: '执行中', value: 'EXECUTING' },
      { text: '招商审核中', value: 'ZH_APPROVAL' }, { text: '退租审核中', value: 'TZ_APPROVAL' }, { text: '已退租', value: 'WITHDRAWAL' },
      { text: '续签审核中', value: 'XQ_APPROVAL' }, { text: '到期未处理', value: 'MATURITY' }],
      currentProject: {},
      currentIndustry: [{ text: '全部状态', value: '' }],
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
      enterpriseOptions: [],
      leaseModeList: [
        {
          referred: '全部方式',
          value: '',
          checked: true
        },
        {
          referred: '一手租赁',
          value: 'RENT',
          checked: false
        },
        {
          referred: '转租',
          value: 'SUBLET',
          checked: false
        }
      ],
      dateContractShow: false,
      dateContract: '',
      dateContractlable: '',
      contractType: '',
      currentEnterprise: {
        name: '全部企业',
        id: ''
      }
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
    if (to.name === 'contractBasicInfo') {
      from.meta.isBack = true
    } else {
      from.meta.isBack = false
    }
    next()
  },
  activated () {
    if (!this.$route.meta.isBack) {
      window.sessionStorage.removeItem('scrollVal')
      this.$emit('changeScroll', 0)
      Object.assign(this.$data, this.$options.data())
      this.queryTreeAll()
    } else {
      let scrollVal = window.sessionStorage.getItem('scrollVal')
      if (scrollVal) {
        this.$emit('changeScroll', scrollVal)
      }
      if (sessionStorage.getItem('loadBottom')) {
        sessionStorage.getItem('loadBottom') === 'false' ? this.loadBottom = false : this.loadBottom = true
      }
      sessionStorage.removeItem('loadBottom')
    }
  },
  deactivated () {
    this.loadBottom = true
  },
  mounted () {
  },
  methods: {
    startMonthConfirm (val) {
      // this.dateContract = val
      this.dateContractlable = val
      this.dateContractShow = false
    },
    setChecked (item, index) {
      this.enterpriseOptions = this.checkedFormat(index, this.enterpriseOptions)
      this.getProject(item, 'select')
    },
    async getProject (item, type) {
      if (!item || !item.id) {
        this.queryProjectManagement()
        return
      }
      this.projectManagementList = []
      this.projectId = ''
      const res = await context.http.get('cms/api/project-managements/byOrganizeId', {
        useStatus: 'USING',
        organizeId: item ? item.id : ''
      })
      if (res.status === 200) {
        res.data.unshift(allProjectObj)
        if (type) {
          res.data[0].checked = true
        }
        this.projectManagementList = res.data
      }
      this.projectId = ''
    },
    queryTreeAll () {
      context.http.get('uaa/api/organizes/enterprise/user', { useStatus: 'USING', organizeType: 'ENTERPRISE' }).then(result => {
        if (result.status === 200 && result.data.length > 0) {
          result.data.unshift(allEnterpriseObj)
          result.data[0].checked = true
          this.enterpriseOptions = result.data
        } else {
          this.enterpriseOptions = []
        }
      })
      this.queryProjectManagement()
    },
    async queryProjectManagement (state) {
      // const res = await context.http.get('cms/api/project-managements', { useStatus: 'USING' })
      const res = {}
      res.data = []
      res.data.unshift(allProjectObj)
      res.data[0].checked = true
      this.projectManagementList = res.data
      if (state) return
      this.currentProject = res.data[0]
      this.query()
    },
    async showActionSheet () {
      this.enterpriseOptions = this.showActionSheetFormat(this.enterpriseOptions, [this.currentEnterprise])
      await this.getProject(this.currentEnterprise)
      this.projectManagementList = this.showActionSheetFormat(this.projectManagementList, [this.currentProject])
      this.leaseModeList = this.showActionSheetFormat2(this.leaseModeList, this.contractType)
      this.dateContractlable = this.dateContract ? this.dateFormat(this.dateContract) : ''
      this.popupShow = !this.popupShow
    },
    showActionSheetFormat (list, currentList) {
      list = list.map(item => {
        item.checked = false
        currentList.forEach(v => {
          if (item.id === v.id) item.checked = true
        })
        return item
      })
      return list
    },
    showActionSheetFormat2 (list, current) {
      list.forEach(ele => {
        ele.checked = false
        if (ele.value === current) {
          ele.checked = true
        }
      })
      return list
    },
    selectleaseMode (index, item) {
      this.leaseModeList = this.checkedFormat(index, this.leaseModeList)
    },
    selectProject (index, item) {
      this.projectManagementList = this.checkedFormat(index, this.projectManagementList)
    },
    selectIndustry (i, item) {
      let list = this.industryList
      if (i === 0) {
        if (!item.checked) {
          list = this.checkedFormat(0, list)
        }
      } else {
        list[i].checked = !list[i].checked
        const checkedLength = list.filter(item => item.checked).length
        list[0].checked = checkedLength === 0
      }
      this.industryList = []
      this.industryList = list
    },
    async query () {
      this.dataReady = false
      this.loadAll = false
      this.searchTag = true
      const currentIndustry = this.currentIndustry.map(item => {
        return item.value
      })
      let result = await context.http.get('cms/api/contracts?sort=projectManagementSortNumber,asc&sort=contractNo,asc&sort=id,asc', {
        projectManagementId: this.currentProject.id,
        contractStatus: currentIndustry.toString(),
        tenantName: this.inputValue,
        contractType: this.contractType,
        endDate: this.dateContract,
        organizeId: this.organizeId,
        page: this.page,
        size: this.size,
        sort: 'desc'
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
        this.leaseModeList = this.checkedFormat(0, this.leaseModeList)
        this.enterpriseOptions = this.checkedFormat(0, this.enterpriseOptions)
        this.queryProjectManagement(state)
        this.dateContractlable = ''
      } else {
        if (!this.projectManagementList.length) {
          this.popupShow = false
          return
        }
        this.currentEnterprise = {
          name: '全部企业',
          id: ''
        }
        this.currentProject = {
          referred: '全部项目',
          id: ''
        }
        this.currentProject = this.projectManagementList.filter(item => item.checked)[0]
        this.currentIndustry = this.industryList.filter(item => item.checked)
        this.contractType = this.leaseModeList.filter(item => item.checked)[0].value
        this.organizeId = this.enterpriseOptions.filter(item => item.checked)[0].id
        this.currentEnterprise = this.enterpriseOptions.filter(item => item.checked)[0]
        this.dateContract = this.dateContractlable ? this.dateFormat(this.dateContractlable) : ''
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
      switch (row.contractStatus) {
        case 'STORAGE':
          return getColor ? '#444547' : '暂存'
        case 'PENDING':
          return getColor ? '#1CC296' : '待执行'
        case 'EXECUTING':
          return getColor ? '#1CC296' : '执行中'
        case 'ZH_APPROVAL':
          return getColor ? '#444547' : '招商审核中'
        case 'TZ_APPROVAL':
          return getColor ? '#444547' : '退租审核中'
        case 'WITHDRAWAL':
          return getColor ? '#858C94' : '已退租'
        case 'XQ_APPROVAL':
          return getColor ? '#444547' : '续签审核中'
        case 'NO':
          return getColor ? '#FC5159' : '审核未通过'
        case 'MATURITY':
          return getColor ? '#FC5159' : '到期未处理'
      }
    },
    dateFormat (date) {
      return moment(date).format('YYYY-MM-DD')
    },
    lowPriceAndHighPrice (row) {
      let priceUnit = ''
      if (row.priceUnit === 'M2DAYS') {
        priceUnit = '元/m²·天'
      } else if (row.priceUnit === 'M2MONTH') {
        priceUnit = '元/月'
      }
      if (row.lowArea && row.highPrice) {
        return row.lowPrice + ' ~ ' + row.highPrice + priceUnit
      } else {
        return '-'
      }
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    toContactsDetail (item) {
      if (!this.hasAuthority('02020503')) {
        Toast({
          message: '你的账号没有查看合同信息的权限',
          position: 'top'
        })
        return
      }
      sessionStorage.setItem('scrollVal', this.scrollVal)
      sessionStorage.setItem('loadBottom', this.loadBottom)
      this.$router.push({ name: 'contractBasicInfo', query: { id: item.id } })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
.contractList {
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
    font-size: rem(13);
    color: #444547;
    z-index: 1;
    background: #f8f9fa;
    display: flex;
    white-space: nowrap;
    flex-basis: rem(0);
    flex-shrink: 0;
    align-items: center;
    overflow-x: auto;
    overflow-y: hidden;
    > span {
      display: block;
      line-height: rem(16);
      height: rem(16);
      border-right: rem(1) solid #d8d8d8;
      margin-left: rem(15);
      > span {
        line-height: rem(16);
        margin-right: rem(20);
      }
      > span:last-child {
        margin-right: rem(15);
      }
    }
    > span:last-child {
      border-right: 0;
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
            color: #18191a;
            font-weight: 600;
            font-size: rem(15);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-right: rem(5);
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
  .contract_date{
    border-bottom: 1px solid #D9D9D9;
    text-align: center;
    padding-bottom: rem(6);
    margin-right: rem(20);
  }
}
</style>
