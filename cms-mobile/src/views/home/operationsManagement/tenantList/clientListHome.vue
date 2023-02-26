<template>
  <div class="tenantList"
       :class="{'focus':focus}">
    <div class="head"
         v-if="!focus">
      <i class="back mintui mintui-back"
         @click="onGoBack"></i>
      <div class="headTab">客户列表</div>
      <div class="addBtn"
           @click="showActionSheet">
        <i class="iconfont iconcms_shaixuan"></i>
      </div>
    </div>
    <div class="seachInput">
      <form @submit.prevent
            action="#">
        <input class="input"
               id="seachInput"
               results="5"
               focus
               placeholder="请输入客户名称"
               type="search"
               v-model="inputValue"
               @input="onKeyInput"
               @focus="inputFocus"
               @compositionstart="compositions(false)"
               @compositionend="compositions(true)"
               @keyup.13="onKeyInput"
               @keypress="search" />
      </form>
      <i class="mintui mintui-search"></i>
      <span class="cannelBtn"
            v-if="focus"
            @click="toContacts">取消</span>
    </div>
    <div class="selectResult"
         @click="showActionSheet">
      <span>{{currentOrganizeObj.name}}</span>
      <span v-if="currentIndustryIdObj.id">{{currentIndustryIdObj.name}}</span>
      <span v-if="currentEmploymentObj.value">{{currentEmploymentObj.label}}</span>
      <span v-if="currentYearTaxObj.value">{{currentYearTaxObj.label}}</span>
      <span v-if="currentOptionsObj1.value">{{currentOptionsObj1.label}}</span>
      <span v-if="currentOptionsObj2.value">{{currentOptionsObj2.label}}</span>
      <span v-if="currentOptionsObj3.value">{{currentOptionsObj3.label}}</span>
      <span v-if="currentOptionsObj4.value">{{currentOptionsObj4.label}}</span>
    </div>
    <div class="content common_list ">
      <mt-loadmore ref="loadmore"
                   :bottom-method="loadBottom"
                   :autoFill="false"
                   :bottom-all-loaded="allLoaded">
        <ul>
          <li v-for="(item,index) in tableData"
              :key="index"
              @click="toTenantDetails(item.id)">
            <div>
              <span class="shopNb">{{item.teantName}}</span>
              <span class="iconfont iconright"></span>
            </div>
            <div>
              <p>
                <span>行业：{{item.standardIndustryName}}</span>
                <span>管理企业：{{item.organizeName}}</span>
                <span>企业资质：{{item.companyQualificationDescription}}</span>
                <span>注册类别：{{item.registerTypeDescription}}</span>
                <span>租赁面积（m²）：{{item.buildingArea}}</span>
              </p>
              <p>
                <span> &nbsp</span>
                <span>就业人数：{{item.employeesNumber}}</span>
                <span>工商注册：{{item.businessRegisterDescription}}</span>
                <span>税务登记：{{taxRegistrationFormated(item.taxRegistration)}}</span>
                <span>当年税收（万元）：{{item.taxAmount}}</span>
              </p>
            </div>
          </li>
        </ul>
      </mt-loadmore>

      <div class="loadAll"
           v-if="allLoaded && tableData.length!==0">
        <span>-</span>
        <p>已经到底了</p>
        <span>-</span>
      </div>
      <div class="noData"
           v-if="tableData.length===0 && dataReady">
        <img src="../../../../assets/nores.png">
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
            <li v-for="(item, index) in organizeList"
                :key="index"
                @click="selectOrganize(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>行业</p>
          <ul>
            <li v-for="(item, index) in industryOptionsTree"
                :key="index"
                @click="selectIndustry(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>就业人数</p>
          <ul>
            <li v-for="(item, index) in employment"
                :key="index"
                @click="selectEmployment(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>当年税收</p>
          <ul>
            <li v-for="(item, index) in currentYearTax"
                :key="index"
                @click="selectCurrentYearTax(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>企业资质</p>
          <ul>
            <li v-for="(item, index) in options1"
                :key="index"
                @click="selectOption1(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>工商注册</p>
          <ul>
            <li v-for="(item, index) in options2"
                :key="index"
                @click="selectOption2(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>注册类型</p>
          <ul>
            <li v-for="(item, index) in options3"
                :key="index"
                @click="selectOption3(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>税务登记</p>
          <ul>
            <li v-for="(item, index) in options4"
                :key="index"
                @click="selectOption4(index, item)"
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
// import AppHeader from '@/components/appHead'
import context from '@/service'
import { toLocaleFixed } from '@/utils/validate.js'
import Vue from 'vue'
import { Popup } from 'vant'
import { Toast } from 'mint-ui'
Vue.use(Popup)
let roterFrom = null
const allorganize = {
  id: '',
  name: '全部企业',
  checked: true
}
export default {
  name: 'tenantList',
  footVisible: true,
  components: {},
  props: ['scrollTop'],
  watch: {
    scrollTop (val) {
      this.scrollVal = val
    }
  },
  data () {
    return {
      stSearchParame: {
        organizeId: '',
        projectManagementId: '',
        industryId: '',
        employeesNumber: '',
        taxNumber: '',
        companyQualification: '',
        businessRegister: '',
        registerType: '',
        taxRegistration: '',
        tenantName: ''
      },
      currentOrganizeObj: { name: '全部企业', id: '', checked: true },
      currentIndustryIdObj: { name: '全部', id: '', checked: true },
      currentEmploymentObj: { label: '全部', value: '', checked: true },
      currentYearTaxObj: { label: '全部', value: '', checked: true },
      currentOptionsObj1: { label: '全部', value: '', checked: true },
      currentOptionsObj2: { label: '全部', value: '', checked: true },
      currentOptionsObj3: { label: '全部', value: '', checked: true },
      currentOptionsObj4: { label: '全部', value: '', checked: true },
      organizeList: [],
      industryOptionsTree: [],
      employment: [
        { label: '全部', value: '', checked: true },
        { label: '10人以下', value: '0' },
        { label: '10~50人', value: '10' },
        { label: '50~100人', value: '50' },
        { label: '100~500人', value: '100' },
        { label: '500人以上', value: '500' }
      ],
      currentYearTax: [
        { label: '全部', value: '', checked: true },
        { label: '1万以下', value: '0' },
        { label: '1~10万', value: '1' },
        { label: '10~100万', value: '10' },
        { label: '100~1000万', value: '100' },
        { label: '1000万以上', value: '1000' }
      ],
      options1: [
        { label: '全部', value: '', checked: true },
        { label: '高新技术', value: 'HIGH_TECH' },
        { label: '科技小巨人', value: 'TECHNOLOGY_GIANT' },
        { label: '上市企业', value: 'LISTED_COMPANY' },
        { label: '其他', value: 'OTHER' }
      ],
      options2: [
        { label: '全部', value: '', checked: true },
        { value: 'BZBC', label: '本镇本村' },
        { value: 'BZWC', label: '本镇外村' },
        { value: 'ZWZC', label: '镇外注册' },
        { value: 'WZC', label: '未注册' }
      ],
      options3: [
        { label: '全部', value: '', checked: true },
        { value: 'ON_THE_SPOT', label: '实地' },
        { value: 'AFFILIATED', label: '挂靠' }
      ],
      options4: [
        { value: '', label: '全部', checked: true },
        { value: 'BZBC', label: '本镇本村' },
        { value: 'BZWC', label: '本镇外村' },
        { value: 'ZWZC', label: '镇外登记' },
        { value: 'WZC', label: '未登记' }
      ],
      scrollVal: 0,
      inputValue: '',
      flag: true,
      shadeBox: false,
      focus: false,
      popupShow: false,
      onRent: null,
      investmentStatus: '',
      dataReady: false,
      allLoaded: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pgSize: 15
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
      this.currentInit()
      // this.$route.meta.keepAlive = false
      window.sessionStorage.removeItem('scrollVal')
    } else {
      this.$route.meta.keepAlive = true
    }
    next()
  },
  activated () {
    if (roterFrom === 'TenantDetails') {
      let scrollVal = window.sessionStorage.getItem('scrollVal')
      if (scrollVal) {
        this.$emit('changeScroll', scrollVal)
      }
    } else {
      this.$emit('changeScroll', 0)
      this.getAllIndustry()
      this.getOrganizeList()
    }
  },
  created () {
    // this.$emit('changeScroll', 0)
    // this.getAllIndustry()
    // this.getOrganizeList()
  },
  beforeDestroy () {
  },
  mounted () {

  },
  methods: {
    inputFocus () { // 获取焦点
      this.focus = true
      this.shadeBox = true
    },
    toContacts () { // 取消
      this.focus = false
      this.shadeBox = false
      this.inputValue = ''
      this.page = 0
      this.tableData = []
      this.query(true)
    },
    currentInit () {
      this.currentOrganizeObj = this.organizeList.filter(item => item.checked)[0]
      this.currentIndustryIdObj = this.industryOptionsTree.filter(item => item.checked)[0]
      this.currentEmploymentObj = this.employment.filter(item => item.checked)[0]
      this.currentYearTaxObj = this.currentYearTax.filter(item => item.checked)[0]
      this.currentOptionsObj1 = this.options1.filter(item => item.checked)[0]
      this.currentOptionsObj2 = this.options2.filter(item => item.checked)[0]
      this.currentOptionsObj3 = this.options3.filter(item => item.checked)[0]
      this.currentOptionsObj4 = this.options4.filter(item => item.checked)[0]
    },
    async submit (state) {
      if (state === 'reset') {
        this.organizeList = this.checkedFormat(0, this.organizeList)
        this.industryOptionsTree = this.checkedFormat(0, this.industryOptionsTree)
        this.employment = this.checkedFormat(0, this.employment)
        this.currentYearTax = this.checkedFormat(0, this.currentYearTax)
        this.options1 = this.checkedFormat(0, this.options1)
        this.options2 = this.checkedFormat(0, this.options2)
        this.options3 = this.checkedFormat(0, this.options3)
        this.options4 = this.checkedFormat(0, this.options4)
      } else {
        this.currentOrganizeObj = this.organizeList.filter(item => item.checked)[0]
        this.currentIndustryIdObj = this.industryOptionsTree.filter(item => item.checked)[0]
        this.currentEmploymentObj = this.employment.filter(item => item.checked)[0]
        this.currentYearTaxObj = this.currentYearTax.filter(item => item.checked)[0]
        this.currentOptionsObj1 = this.options1.filter(item => item.checked)[0]
        this.currentOptionsObj2 = this.options2.filter(item => item.checked)[0]
        this.currentOptionsObj3 = this.options3.filter(item => item.checked)[0]
        this.currentOptionsObj4 = this.options4.filter(item => item.checked)[0]
        this.tableData = []
        this.query(true)
        this.popupShow = false
      }
    },
    showActionSheet () {
      this.organizeList = this.organizeList.map(item => {
        item.checked = false
        if (item.id === this.currentOrganizeObj.id) item.checked = true
        return item
      })
      this.industryOptionsTree = this.industryOptionsTree.map(item => {
        item.checked = false
        if (item.id === this.currentIndustryIdObj.id) item.checked = true
        return item
      })
      this.employment = this.employment.map(item => {
        item.checked = false
        if (item.value === this.currentEmploymentObj.value) item.checked = true
        return item
      })
      this.currentYearTax = this.currentYearTax.map(item => {
        item.checked = false
        if (item.value === this.currentYearTaxObj.value) item.checked = true
        return item
      })
      this.options1 = this.options1.map(item => {
        item.checked = false
        if (item.value === this.currentOptionsObj1.value) item.checked = true
        return item
      })
      this.options2 = this.options2.map(item => {
        item.checked = false
        if (item.value === this.currentOptionsObj2.value) item.checked = true
        return item
      })
      this.options3 = this.options3.map(item => {
        item.checked = false
        if (item.value === this.currentOptionsObj3.value) item.checked = true
        return item
      })
      this.options4 = this.options4.map(item => {
        item.checked = false
        if (item.value === this.currentOptionsObj4.value) item.checked = true
        return item
      })
      this.popupShow = !this.popupShow
    },
    async getOrganizeList () { // 管理企业列表
      let result = await context.http.get('uaa/api/organizes/enterprise/user?organizeType=ENTERPRISE&useStatus=USING')
      result.data.unshift(allorganize)
      this.organizeList = result.data
      // 默认第一个
      this.stSearchParame.organizeId = result.data[0].id
      this.query(true)
    },
    // 行业
    getAllIndustry () {
      context.http.get('cms/api/tenant/standardIndustry/tree').then(res => {
        res.data.unshift({ name: '全部', id: '', checked: true })
        this.industryOptionsTree = res.data
      })
    },
    query (flag) {
      this.dataReady = false
      if (flag) this.currentPage = 1; this.allLoaded = false
      context.http.get('cms/api/tenant/staging',
        {
          organizeId: this.currentOrganizeObj.id,
          industryId: this.currentIndustryIdObj.id,
          employeesNumber: this.currentEmploymentObj.value,
          taxNumber: this.currentYearTaxObj.value,
          companyQualification: this.currentOptionsObj1.value,
          businessRegister: this.currentOptionsObj2.value,
          registerType: this.currentOptionsObj3.value,
          taxRegistration: this.currentOptionsObj4.value,
          tenantName: this.inputValue,
          page: (this.currentPage - 1),
          size: this.pgSize,
          sort: 'desc'
        }).then(res => {
          this.dataReady = true
          if (flag) {
            this.tableData = res.data
          } else {
            this.tableData = this.tableData.concat(res.data)
          }
          this.total = Number(res.headers['x-total-count'])
          // this.total = Number(res.headers['x-total-count'])
          if (this.currentPage === Math.ceil(this.total / this.pgSize) || this.currentPage > Math.ceil(this.total / this.pgSize)) {
            this.allLoaded = true// 若数据已全部获取完毕
            console.log('全部获取完毕')
          }
        })
    },
    toTenantDetails (id) {
      if (this.hasAuthority('02030104')) {
        window.sessionStorage.setItem('scrollVal', this.scrollVal)
        this.$router.push({ name: 'TenantDetails', query: { 'tenantID': id } })
      } else {
        Toast({
          message: '你的账号没有查看客户详情的权限',
          position: 'top'
        })
      }
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    loadBottom () {
      this.currentPage++
      this.query()
      this.$refs.loadmore.onBottomLoaded()
    },
    onKeyInput (event) { // 输入
      if (event.keyCode !== 13 && this.flag) {
        this.shadeBox = false
        this.currentPage = 0
        this.tableData = []
        this.$nextTick(() => {
          this.query(true)
        })
      }
    },
    compositions (flag) {
      this.flag = flag
    },
    search (event) { // 键盘完成事件
      if (event.keyCode === 13) {
        event.preventDefault() // 禁止默认事件（默认是换行）
        this.inputValue = event.target.value
        this.currentPage = 0
        this.tableData = []
        this.query(true)
      }
    },
    async selectOrganize (index, item) {
      this.organizeList = this.checkedFormat(index, this.organizeList)
    },
    selectIndustry (index, item) {
      this.industryOptionsTree = this.checkedFormat(index, this.industryOptionsTree)
    },
    selectEmployment (index, item) {
      this.employment = this.checkedFormat(index, this.employment)
    },
    selectCurrentYearTax (index, item) {
      this.currentYearTax = this.checkedFormat(index, this.currentYearTax)
    },
    selectOption1 (index, item) {
      this.options1 = this.checkedFormat(index, this.options1)
    },
    selectOption2 (index, item) {
      this.options2 = this.checkedFormat(index, this.options2)
    },
    selectOption3 (index, item) {
      this.options3 = this.checkedFormat(index, this.options3)
    },
    selectOption4 (index, item) {
      this.options4 = this.checkedFormat(index, this.options4)
    },
    checkedFormat (i, arr) {
      arr = arr.map(item => {
        item.checked = false
        return item
      })
      arr[i].checked = true
      return arr
    },
    taxRegistrationFormated (val) {
      let obj = {
        'BZBC': '本镇本村',
        'BZWC': '本镇外村',
        'ZWZC': '镇外登记',
        'WZC': '未登记'
      }
      return obj[val]
    },
    onGoBack () { // 返回首页
      this.currentInit()
      // this.$route.meta.keepAlive = false
      this.$router.push({ name: 'index' })
    }
  }
}
</script>
<style scoped lang="scss" >
@import "../../../../style/config";
.tenantList {
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
    .common_list {
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
  .common_list {
    padding-top: rem(118);
    li {
      padding: rem(14);
      background-color: #ffffff;
      margin-bottom: rem(10);
      position: relative;
      > div {
        display: flex;
        flex-wrap: nowrap;
        &:first-child {
          justify-content: space-between;
          margin-bottom: rem(8);
          font-size: rem(15);
          color: #444547;
          .shopNb {
            font-weight: bold;
            color: #18191a;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .shopType {
            &.weizu {
              color: #fc5159;
            }
            &.yizu {
              color: #1cc296;
            }
            &.ziyong {
              color: #444547;
            }
          }
        }
        &:nth-child(2) {
          color: #858c94;
          font-size: rem(14);
          justify-content: space-between;
          > p {
            display: flex;
            flex-direction: column;
            &:first-child {
              width: 45%;
            }
            &:last-child {
              width: 45%;
            }
            > span {
              margin-bottom: rem(8);
              width: 100%;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
        }
      }
      .iconright {
        font-size: rem(14);
        color: #c6c6c6;
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
  .head {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: rem(40);
    line-height: rem(40);
    overflow: hidden;
    text-align: center;
    font-size: rem(16);
    background: #fff;
    display: flex;
    justify-content: space-between;
    z-index: 9;
    box-shadow: 0px 1px 4px 0px rgba(230, 230, 230, 0.5);
    .headTab {
      color: #444547;
      font-size: rem(16);
      width: rem(200);
      display: flex;
      justify-content: center;
      > span {
        position: relative;
        &.active {
          color: #0139a4;
          border-bottom: rem(3) solid #0139a4;
          font-weight: bold;
        }
        &:nth-child(2) {
          margin-left: rem(40);
        }
      }
    }
    .back {
      width: rem(40);
      height: rem(40);
      font-size: rem(18);
      color: #000000;
      &:first-child {
        float: left;
      }
    }
    .addBtn {
      width: rem(40);
      height: rem(40);
      position: relative;
      i {
        font-size: rem(18);
        color: #444547;
        font-size: rem(18);
      }
    }
    .selected {
      color: #0139a4;
    }
  }
  .selectResult {
    width: 100%;
    padding: 0 rem(14);
    position: fixed;
    z-index: 2;
    left: 0;
    top: rem(90);
    background: #f0f1f2;
    font-size: rem(13);
    color: #444547;
    height: rem(28);
    line-height: rem(28);
    overflow-x: auto;
    white-space: nowrap;
    span {
      // margin-right: rem(20);
    }
  }
}
</style>
