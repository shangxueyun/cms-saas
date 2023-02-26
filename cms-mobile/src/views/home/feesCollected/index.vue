<template>
  <div class="feesCollected">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="onGoBack"></i>
      <div class="headTab">
        <span :class="{'active': hasAuthority('02030301') && hasAuthority('02030320')}" v-if="hasAuthority('02030301')">收缴统计</span>
        <span @click="tabChange" v-if="hasAuthority('02030320')">客户账单</span>
      </div>
      <div class="addBtn"
           @click="showActionSheet">
        <i class="iconfont iconcms_shaixuan"></i>
      </div>
    </div>
    <div class="selectResult" @click="showActionSheet">
      <span>
        <span v-for="item in currentOrganize" :key="item.projectManagementTypeId">{{item.projectManagementTypeName}}</span>
      </span>
      <span>
        <span v-for="item in currentProject" :key="item.id">{{item.referred}}</span>
      </span>
      <span>
        <span v-for="item in currentFeeType" :key="item.id">{{item.value}}</span>
      </span>
      <span>
        <span>{{this.currentDateObj.start}}至{{this.currentDateObj.end}}</span>
      </span>
    </div>
    <div class="container">
      <div class="charts_content">
        <p>总收缴率<span>{{totalData.rate}}</span></p>
        <canvas id="myChartForCZL" class="myChart"></canvas>
        <ul>
          <li>
            <p>总账单金额</p>
            <p>{{totalData.amount}}</p>
          </li>
          <li>
            <p>总已收金额</p>
            <p>{{totalData.sjAmount}}</p>
          </li>
          <li>
            <p>总欠收金额</p>
            <p>{{totalData.qsAmount}}</p>
          </li>
        </ul>
      </div>
      <div class="charts_content charts_padding">
        <canvas ref="myChartForFYSJ" id="myChartForFYSJ"
              class="myChart myChart2"></canvas>
        <div class="tool_tip" ref="toolTip"></div>
      </div>
      <div class="fee_list">
        <p>收缴明细</p>
        <ul>
          <li v-for="(item, index) in tableData" :key="index">
            <div class="left">
              <p>{{item.x}}</p>
              <p>收缴率：<span>{{item.rate}}</span></p>
            </div>
            <div class="right">
              <p>账单：<span>{{formatterAmount(item.amount)}}元</span></p>
              <p>已收：<span>{{formatterAmount(item.sjAmount)}}元</span></p>
              <p>欠收：<span>{{formatterAmount(item.qsAmount)}}元</span></p>
            </div>
          </li>
        </ul>
        <div class="loadAll">
          <span>-</span>
          <p>你碰到我的底线了</p>
          <span>-</span>
        </div>
      </div>
    </div>
    <!-- 右侧筛选 -->
    <van-popup v-model="popupShow" class="popup_common" :overlay-style="{'background-color': 'rgba(0,0,0,.4)'}" :style="{ height: '100%' }" position="right">
      <p class="popup_title">筛选</p>
      <div class="popup_container">
        <div class="popup_list">
          <p>管理企业<span>（可多选）</span></p>
          <ul>
            <li v-for="(item, index) in organizesList"
                :key="item.id"
                @click="selectItemOrg(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.projectManagementTypeName }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>项目<span>（可多选）</span></p>
          <ul>
            <li v-for="(item, index) in projectManagementList"
                :key="item.id"
                @click="selectItem(index, item, 'project')"
                :class="{ selected: item.checked }">
              <span>{{ item.referred }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>费用类型<span>（可多选）</span></p>
          <ul>
            <li v-for="(item, index) in feeTypeList"
                :key="item.id"
                @click="selectItem(index, item, 'feeType')"
                :class="{ selected: item.checked }">
              <span>{{ item.value }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>日期</p>
          <div class="date_select">
            <span :class="dateType === 'MONTH' ? 'active' : ''" @click="dateType = 'MONTH'">月</span>
            <span :class="dateType === 'YEAR' ? 'active' : ''" @click="dateType = 'YEAR'">年</span>
          </div>
          <div v-if="dateType === 'MONTH'" class="time_select">
            <p @click="monthData.startMonth.show = true">{{dateFormat(monthData.startMonth.date)}}</p>
            <span>至</span>
            <p @click="monthData.endMonth.show = true">{{dateFormat(monthData.endMonth.date)}}</p>
          </div>
          <div v-else class="time_select">
            <p @click="openYear('start')">{{yearDate.startYear.date}}</p>
            <span>至</span>
            <p @click="openYear('end')">{{yearDate.endYear.date}}</p>
          </div>
        </div>
      </div>
      <div class="popup_buttons">
        <div @click="submit('reset')" class="popup_default">重置</div>
        <div @click="submit" class="popup_active">确定</div>
      </div>
    </van-popup>
     <!-- 选择年月-------------------------------------- -->
     
    <van-popup :style="{ height: '50%' }" v-model="monthData.startMonth.show"
               position="bottom">
      <van-datetime-picker
                          v-model="currentStart"
                          type="year-month"
                          title="选择年月"
                          :min-date="startMonthMinDate"
                          :max-date="startMonthMaxDate"
                          @cancel="monthData.startMonth.show = false"
                          @confirm="startMonthConfirm"
                        />
    </van-popup>
    <!-- 选择年月-------------------------------------- -->
    
    <van-popup :style="{ height: '50%' }" v-model="monthData.endMonth.show"
               position="bottom">
      <van-datetime-picker
                          v-model="currentEnd"
                          type="year-month"
                          title="选择年月"
                          :min-date="endMonthMinDate"
                          :max-date="endMonthMaxDate"
                          @cancel="monthData.endMonth.show = false"
                          @confirm="endMonthConfirm"
                        />
    </van-popup>
    <!-- 选择年-------------------------------------- -->
    <van-popup :style="{ height: '50%' }" v-model="yearDate.startYear.show"
               position="bottom">
      <van-picker show-toolbar
                  title="选择年份"
                  :columns="yearJson"
                  :default-index="yearDate.startYear.defaultIndex"
                  @confirm="startYearConfirm"
                  @cancel="yearDate.startYear.show = false" />
    </van-popup>
    <!-- 选择年-------------------------------------- -->
    <van-popup :style="{ height: '50%' }" v-model="yearDate.endYear.show"
               position="bottom">
      <van-picker show-toolbar
                  title="选择年份"
                  :columns="yearJson"
                  :default-index="yearDate.endYear.defaultIndex"
                  @confirm="endYearConfirm"
                  @cancel="yearDate.endYear.show = false" />
    </van-popup>
  </div>
</template>
<script>
import context from '@/service'
import Vue from 'vue'
import moment from 'moment'
import { toLocaleString } from '@/utils/validate.js'
import { Popup, DatetimePicker } from 'vant'
Vue.use(Popup)
Vue.use(DatetimePicker)
const allOrganizesObj = {
  id: '',
  projectManagementTypeName: '全部企业',
  checked: true
}
const allProjectObj = {
  id: '',
  referred: '全部项目',
  checked: true
}
const allFeeObj = {
  id: '',
  value: '全部费用',
  checked: true
}
export default {
  name: 'feesCollected',
  components: {},
  watch: {
  },
  data () {
    return {
      popupShow: false,
      projectManagementList: [],
      organizesList: [],
      feeTypeList: [],
      tableData: [],
      totalData: {
        amount: 0,
        sjAmount: 0,
        qsAmount: 0,
        rate: 0,
        sjAmountValue: 0,
        qsAmountValue: 0
      },
      currentOrganize: [],
      currentProject: [],
      currentFeeType: [],
      yearJson: [],
      dateType: 'MONTH',
      currentStart: '',
      currentEnd: '',
      monthData: {
        startMonth: {
          date: '',
          show: false
        },
        endMonth: {
          date: '',
          show: false
        }
      },
      yearDate: {
        startYear: {
          date: '',
          show: false,
          defaultIndex: 0
        },
        endYear: {
          date: '',
          show: false,
          defaultIndex: 0
        }
      },
      currentDateObj: {
        type: 'MONTH',
        start: '',
        end: ''
      }
    }
  },
  created () {
    this.getDefaultDate()
    this.getOrganizes()
    // this.queryProjectManagement()
    this.getFeeType()
    this.query()
  },
  beforeDestroy () {
  },
  mounted () {
    this.$parent.$refs['content'].scrollTop = 0
  },
  computed: {
    startMonthMinDate () {
      return new Date(this.monthData.endMonth.date.getTime() - 365 * 24 * 60 * 60 * 1000)
    },
    startMonthMaxDate () {
      return this.monthData.endMonth.date
    },
    endMonthMinDate () {
      return this.monthData.startMonth.date
    },
    endMonthMaxDate () {
      return new Date(this.monthData.startMonth.date.getTime() + 365 * 24 * 60 * 60 * 1000)
    }
  },
  methods: {
    async getOrganizes () { // 管理企业获取接口
      let result = await context.http.get('cms/api/project-managements/types/tree?useStatus=USING')
      result.data.forEach((ite, ind) => {
        ite.id = ite.projectManagementTypeId
      })
      result.data.unshift(allOrganizesObj)
      this.organizesList = result.data
      this.currentOrganize.unshift(allOrganizesObj)
      this.projectManagementList.unshift(allProjectObj)
      this.currentProject.unshift(allProjectObj)
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    // 获取项目列表
    // async queryProjectManagement () {
    //   let res = await context.http.get('cms/api/project-managements', {useStatus: 'USING'})
    //   res.data = this.checkedFormat(res.data)
    //   res.data.unshift(allProjectObj)
    //   this.currentProject.push(allProjectObj)
    //   this.projectManagementList = res.data
    // },
    // 获取费用列表
    async getFeeType () {
      let result = await context.http.get('uaa/api/paramet-managements/name', { name: '费用类型' })
      let result2 = await context.http.get('uaa/api/paramet-managements/name', { name: '多经费用类型' })
      result.data = result.data.concat(result2.data)
      result.data = this.checkedFormat(result.data)
      result.data.unshift(allFeeObj)
      this.currentFeeType.push(allFeeObj)
      this.feeTypeList = result.data
    },
    selectItemOrg (i, item) {
      let list = this.organizesList
      if (i === 0) {
        if (!item.checked) {
          list = this.checkedFormat(list)
          list[0].checked = true
        }
      } else {
        list[i].checked = !list[i].checked
        const checkedLength = list.filter(item => item.checked).length
        list[0].checked = checkedLength === 0
      }
      this.organizesList = list
      // 处理项目
      // let oldProList = JSON.parse(JSON.stringify(this.projectManagementList))
      // let oldProListId = []
      this.projectManagementList = []
      if (!list[0].checked) {
        // oldProList.forEach((el, ind) => {
        //   if (el.checked) {
        //     oldProListId.push(el.id)
        //   }
        // })
        list.forEach((item, index) => {
          if (item.checked) {
            item.child.forEach((ite, ind) => {
              this.projectManagementList.push(ite)
            })
          }
        })
        // this.projectManagementList.forEach((ele, ine) => {
        //   oldProListId.forEach((e, i) => {
        //     if (ele.id === e) {
        //       ele.checked = true
        //     }
        //   })
        // })
        this.projectManagementList.unshift({
          id: '',
          referred: '全部项目',
          checked: false
        })
        const checkedLengths = this.projectManagementList.filter(item => item.checked).length
        this.projectManagementList[0].checked = checkedLengths === 0
      } else {
        this.projectManagementList.unshift({
          id: '',
          referred: '全部项目',
          checked: true
        })
      }
    },
    // 筛选切换项目获取费用公共方法
    selectItem (i, item, status) {
      let list = status === 'project' ? JSON.parse(JSON.stringify(this.projectManagementList)) : this.feeTypeList
      if (i === 0) {
        if (!item.checked) {
          list = this.checkedFormat(list)
          list[0].checked = true
        }
      } else {
        list[i].checked = !list[i].checked
        const checkedLength = list.filter(item => item.checked).length
        list[0].checked = checkedLength === 0
      }
      status === 'project' ? this.projectManagementList = list : this.feeTypeList = list
    },
    // 月份开始时间确定
    startMonthConfirm (val) {
      this.monthData.startMonth.date = val
      this.monthData.startMonth.show = false
    },
    // 月份结束时间确定
    endMonthConfirm (val) {
      this.monthData.endMonth.date = val
      this.monthData.endMonth.show = false
    },
    // 打开年份控件弹层
    openYear (state) {
      this.checkYearDisabled(state)
      state === 'start' ? this.yearDate.startYear.show = true : this.yearDate.endYear.show = true
    },
    // 年份控件开始时间确定
    startYearConfirm (val, index) {
      this.yearDate.startYear.date = val
      this.yearDate.startYear.defaultIndex = index
      this.yearDate.startYear.show = false
    },
    // 年份控件结束时间确定
    endYearConfirm (val, index) {
      this.yearDate.endYear.date = val
      this.yearDate.endYear.defaultIndex = index
      this.yearDate.endYear.show = false
    },
    // 筛选半页确定/重置
    submit (state) {
      if (state === 'reset') {
        let allProObj = allProjectObj
        allProObj.checked = false
        this.selectItemOrg(0, allProjectObj)
        // this.projectManagementList = this.showActionSheetFormat(this.projectManagementList, [allProjectObj])
        this.feeTypeList = this.showActionSheetFormat(this.feeTypeList, [allFeeObj])
        this.dateType = 'MONTH'
        this.getDefaultDate('reset')
      } else {
        this.currentOrganize = this.organizesList.filter(item => item.checked)
        this.currentProject = this.projectManagementList.filter(item => item.checked)
        this.currentFeeType = this.feeTypeList.filter(item => item.checked)
        this.currentDateObj.type = this.dateType
        this.currentDateObj.start = this.dateFormat(this.monthData.startMonth.date)
        this.currentDateObj.end = this.dateFormat(this.monthData.endMonth.date)
        if (this.dateType === 'MONTH') {
          this.currentDateObj.start = this.dateFormat(this.monthData.startMonth.date)
          this.currentDateObj.end = this.dateFormat(this.monthData.endMonth.date)
        } else {
          this.currentDateObj.start = this.yearDate.startYear.date
          this.currentDateObj.end = this.yearDate.endYear.date
        }
        this.popupShow = false
        this.query()
      }
    },
    // 打开筛选半页
    showActionSheet () {
      this.projectManagementList = this.showActionSheetFormat(this.projectManagementList, this.currentProject)
      this.organizesList = this.showActionSheetFormat(this.organizesList, this.currentOrganize)
      this.feeTypeList = this.showActionSheetFormat(this.feeTypeList, this.currentFeeType)
      this.dateType = this.currentDateObj.type
      if (this.dateType === 'MONTH') {
        this.currentStart = new Date(this.currentDateObj.start)
        this.currentEnd = new Date(this.currentDateObj.end)
        this.monthData.startMonth.date = new Date(this.currentDateObj.start)
        this.monthData.endMonth.date = new Date(this.currentDateObj.end)
      } else {
        this.yearDate.startYear.date = this.currentDateObj.start
        this.yearDate.endYear.date = this.currentDateObj.end
      }
      this.popupShow = !this.popupShow
    },
    // 查询收缴明细
    async query () {
      this.totalData = {
        amount: 0,
        sjAmount: 0,
        qsAmount: 0,
        rate: 0,
        sjAmountValue: 0,
        qsAmountValue: 0
      }
      this.$nextTick(() => {
        const tooltipEl = this.$refs['toolTip']
        tooltipEl.style.left = -9999 + 'px'
        tooltipEl.style.top = -9999 + 'px'
      })
      let projectId = this.currentProject.map(item => {
        return item.id
      })
      let feeTypeId = this.currentFeeType.map(item => {
        return item.id
      })
      let startTime
      let endTime
      if (this.currentDateObj.type === 'MONTH') {
        startTime = moment(this.currentDateObj.start).startOf('month').format('YYYY-MM-DD')
        endTime = moment(this.currentDateObj.end).endOf('month').format('YYYY-MM-DD')
      } else {
        startTime = this.currentDateObj.start
        endTime = this.currentDateObj.end
      }
      let result = await context.http.get('cms/api/reportColl/statistics/byProject', {
        projectId: projectId.toString(),
        feeTypeId: feeTypeId.toString(),
        startDate: startTime,
        endDate: endTime,
        dateType: this.currentDateObj.type
      })
      this.tableData = result.data
      let shishou = []
      let shouru = []
      let rateArr = []
      result.data.forEach((ele, idx) => {
        shishou.push({
          name: '已收金额',
          y: ele.sjAmount,
          x: ele.x,
          rate: ele.rate
        })
        shouru.push({
          name: '账单金额',
          y: ele.amount,
          x: ele.x
        })
      })
      const allAry = [...shouru, ...shishou]
      this.$nextTick(() => {
        this.initChar2(allAry)
      })
      this.totalDataInit()
    },
    // 收缴明细合计计算
    totalDataInit () {
      let reductionAmount = 0
      this.tableData.forEach(item => {
        this.totalData.amount += item.amount
        this.totalData.sjAmount += item.sjAmount
        this.totalData.qsAmount += item.qsAmount
        reductionAmount += item.reductionAmount
      })
      if (this.totalData.sjAmount / this.totalData.amount) {
        this.totalData.rate = ((this.totalData.sjAmount / (this.totalData.amount - reductionAmount)) * 100).toFixed(2) + '%'
      } else {
        this.totalData.rate = '0.00%'
      }
      this.totalData.sjAmountValue = this.totalData.sjAmount.toFixed(2)
      this.totalData.qsAmountValue = this.totalData.qsAmount.toFixed(2)
      this.totalData.amount = toLocaleString(this.totalData.amount)
      this.totalData.sjAmount = toLocaleString(this.totalData.sjAmount)
      this.totalData.qsAmount = toLocaleString(this.totalData.qsAmount)
      this.initChar(this.totalData)
    },
    // 获取当月最后一天
    getCurrentMonthLastDay () {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      var day = new Date(year, month, 0)
      return year + '-' + month + '-' + day.getDate()
    },
    dateFormat (date) {
      return moment(date).format('YYYY-MM')
    },
    tabChange () {
      this.$router.replace({name: 'tenantBillsList'})
    },
    onGoBack () {
      this.$router.go(-1)
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
    checkedFormat (arr) {
      arr = arr.map(item => {
        item.checked = false
        return item
      })
      return arr
    },
    // 获取月份或者年份默认时间
    getDefaultDate (state) {
      this.currentStart = new Date(new Date().getFullYear(), 0, 1)
      this.currentEnd = new Date(this.getCurrentMonthLastDay())
      this.monthData.startMonth.date = new Date(new Date().getFullYear(), 0, 1)
      this.monthData.endMonth.date = new Date(this.getCurrentMonthLastDay())
      this.yearDate.startYear.date = new Date().getFullYear() - 4
      this.yearDate.endYear.date = new Date().getFullYear()
      if (state !== 'reset') {
        this.currentDateObj.type = 'MONTH'
        this.currentDateObj.start = this.dateFormat(this.monthData.startMonth.date)
        this.currentDateObj.end = this.dateFormat(this.monthData.endMonth.date)
      }
    },
    // 匹配年份弹窗数据
    checkYearDisabled (state) {
      let start = this.yearDate.startYear.date
      let end = this.yearDate.endYear.date
      let yearJson = []
      if (state === 'start') {
        for (let i = end - 11; i <= end; i++) {
          yearJson.push(i)
        }
      } else {
        for (let i = start; i <= start + 11; i++) {
          yearJson.push(i)
        }
      }
      this.yearJson = yearJson
      this.yearDate.startYear.defaultIndex = this.yearJson.indexOf(start)
      this.yearDate.endYear.defaultIndex = this.yearJson.indexOf(end)
    },
    numberToMoney (n) {
      return String(Math.floor(n * 100) / 100).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    // 铺位出租率图表
    initChar (resData) {
      resData.sjAmountValue = Number(resData.sjAmountValue)
      resData.qsAmountValue = Number(resData.qsAmountValue)
      const percentage = isNaN(resData.sjAmountValue / (resData.sjAmountValue + resData.qsAmountValue))
        ? 0
        : resData.sjAmountValue / (resData.sjAmountValue + resData.qsAmountValue)
      const percentage2 = isNaN(resData.qsAmountValue / (resData.sjAmountValue + resData.qsAmountValue))
        ? 0
        : resData.qsAmountValue / (resData.sjAmountValue + resData.qsAmountValue)
      const data = [
        {
          name: '已收金额',
          percent: (percentage * 100).toFixed(2),
          value: resData.sjAmountValue,
          a: '1'
        },
        {
          name: '欠收金额',
          percent: (percentage2 * 100).toFixed(2),
          value: resData.qsAmountValue,
          a: '1'
        }
      ]
      const map = {}
      const map2 = {}
      data.forEach(function (obj) {
        map[obj.name] = obj.percent + '%'
      })
      data.forEach(function (obj) {
        map2[obj.name] = toLocaleString(obj.value)
      })
      const chart = new this.$F2.Chart({
        id: 'myChartForCZL',
        pixelRatio: window.devicePixelRatio,
        padding: [20, 'auto']
      })
      chart.source(data, {
        percent: {
          formatter: function formatter (val) {
            return val + '%'
          }
        }
      })
      chart.tooltip(false)
      chart.legend({
        position: 'right',
        itemFormatter: function itemFormatter (val) {
          return val
        }
      })
      chart.coord('polar', {
        transposed: true,
        innerRadius: 0.7,
        radius: 0.85
      })
      chart.axis(false)
      chart
        .interval()
        .position('a*value')
        .color('name', ['#68DF92', '#DE8790'])
        .adjust('stack')
      chart.render()
    },
    // 费用收缴图表
    initChar2 (data) {
      const chart = new this.$F2.Chart({
        id: 'myChartForFYSJ',
        pixelRatio: window.devicePixelRatio
      })
      const _this = this
      chart.source(data, {
        x: {
          // tickCount: 6 // 区间，写几个就有几个区间
        },
        y: {
          formatter: function formatter (val) {
            return _this.numberToMoney(val)
          }
        }
      })
      chart.legend({
        align: 'right',
        itemWidth: null // 图例项按照实际宽度渲染
      })
      chart.tooltip({
        triggerOn: ['touchstart'],
        custom: true, // 是否自定义 tooltip 提示框
        onChange: function onChange (ev) {
          const canvasOffsetTop = _this.$refs['myChartForFYSJ'].getBoundingClientRect().top
          const canvasOffsetLeft = _this.$refs['myChartForFYSJ'].getBoundingClientRect().left
          const tooltipEl = _this.$refs['toolTip']
          const currentData = ev.items[0]
          const labelStyle = 'font-size:12px;color:#444547'
          tooltipEl.innerHTML = `<p style=${labelStyle}>${currentData.title}</p><p style=${labelStyle}>已收金额:${ev.items[1].value}</p><p style=${labelStyle}>账单金额:${currentData.value}</p><p style=${labelStyle}>收缴率:${ev.items[1].origin.rate}</p>`
          let tipLeft = canvasOffsetLeft + currentData.x - tooltipEl.clientWidth / 2
          const maxLeft = document.body.clientWidth - tooltipEl.clientWidth - 20
          tipLeft = tipLeft > maxLeft ? maxLeft : tipLeft
          tooltipEl.style.left = tipLeft + 'px'
          tooltipEl.style.top = 30 + 'px'
        },
        onHide: function onHide () {
          const tooltipEl = _this.$refs['toolTip']
          tooltipEl.style.left = -9999 + 'px'
          tooltipEl.style.top = -9999 + 'px'
        }
      })
      // 辅助标记
      chart.guide().text({
        position: ['min', 'max'],
        content: '单位：元',
        style: {
          fill: '#858C94', // 文本颜色
          textBaseline: 'middle',
          textAlign: 'start'
        },
        offsetY: -30,
        offsetX: -25
      })
      chart
        .interval()
        .position('x*y')
        .style({ radius: [2, 2, 0, 0] })
        .size(10)
        .color('name', ['#3F79F7', '#68DF92'])
        .adjust({
          type: 'dodge',
          marginRatio: 0.4 // 设置分组间柱子的间距
        })
      chart.axis('x', {
        label: {
          rotate: -Math.PI / 5,
          textAlign: 'end',
          textBaseline: 'middle'
        }
      })
      chart.render()
    },
    formatterAmount (amount) {
      return toLocaleString(amount)
    }
  }
}
</script>
<style scoped lang="scss" >
@import "../../../style/config";
.feesCollected {
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
  .tool_tip{
    position: absolute;
    z-index: 2;
    left: -9999px;
    top: -9999px;
    padding: 5px;
    background:rgba(255,255,255,0.7);
    box-shadow:0px rem(1) rem(2) 0px rgba(101,100,100,0.5);
    border:rem(1) solid rgba(242,242,242,1);
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
      i{
        font-size: rem(18);
        color: #444547;
        font-size: rem(18);
      }
    }
    .selected{
      color:#0139A4;
    }
  }
  .selectResult{
    width:100%;
    position: fixed;
    z-index: 9;
    left:0;
    top:rem(40);
    background: #F0F1F2;
    font-size: rem(13);
    color:#444547;
    height:rem(28);
    display: flex;
    white-space: nowrap;
    flex-basis: rem(0);
    flex-shrink: 0;
    align-items: center;
    overflow-x: auto;
    overflow-y: hidden;
    >span{
      display: block;
      line-height: rem(16);
      height:rem(16);
      border-right: rem(1) solid #D8D8D8;
      // margin-left:rem(15);
      >span{
        line-height: rem(16);
        // margin-right:rem(20);
      }
      // >span:last-child{
      //   margin-right:rem(15);
      // }
    }
    >span:last-child{
      border-right: 0;
    }
  }
  .popup_list{
    position: relative;
    >p{
      margin-bottom: rem(25)!important;
    }
    .date_select{
      position: absolute;
      right:rem(14);
      top:0;
      display: flex;
      span{
        display: block;
        width:rem(40);
        height: rem(20);
        line-height: rem(20);
        text-align: center;
        border:rem(1) solid #D9D9D9;
        font-size: rem(13);
        color:#444547;
      }
      span:last-child{
        margin-left:rem(-1);
      }
      .active{
        border:rem(1) solid #C7D9FF;
        background: #F3F7FF;
        color:#0139A4;
      }
    }
    .time_select{
      display: flex;
      padding-right:rem(14);
      p{
        width:rem(125);
        padding-bottom:rem(4);
        line-height: rem(20);
        font-size: rem(15);
        color:#0139A4;
        text-align: center;
        border-bottom: rem(1) solid #0139A4;
      }
      span{
        display: block;
        flex: 1;
        text-align: center;
        font-size: rem(15);
        color:#18191A;
        line-height: rem(30);
      }
    }
  }
  .container{
    padding-top:rem(68);
    .fee_list{
      border-top:rem(10) solid #F0F1F2;
      >p{
        height:rem(44);
        line-height: rem(44);
        padding-left:rem(14);
        font-size: rem(17);
        color: #18191A;
        border-bottom: rem(1) solid #F0F0F0;
      }
      .loadAll{
        margin-top:rem(20);
      }
      >ul{
        padding-left:rem(14);
        li{
          padding: rem(18) rem(14) rem(14) 0;
          border-bottom: rem(1) solid #F0F0F0;
          display: flex;
          justify-content: space-between;
          .left{
            >p{
              color:#858C94;
              font-size: rem(14);
              line-height: rem(20);
              margin-bottom: rem(4);
              span{
                color:#18191A;
                font-weight: 600;
              }
            }
          }
          .right{
            >p{
              color:#858C94;
              font-size: rem(14);
              line-height: rem(20);
              margin-bottom: rem(4);
              span{
                color:#18191A;
                font-weight: 600;
              }
            }
          }
        }
      }
    }
    .charts_content{
      padding: rem(15) rem(14) rem(18);
      border-bottom: rem(1) solid #F0F0F0;
      .myChart {
        width: 100%;
        height: rem(190);
      }
      .myChart2{
        height: rem(220);
      }
      >p{
        color:#18191A;
        font-size: rem(17);
        line-height: rem(24);
        font-weight: 600;
        span{
          color:#3575F6;
          font-size: rem(15);
          line-height: rem(24);
          margin-left:rem(12);
        }
      }
      >ul{
        display: flex;
        justify-content: space-between;
        li{
          p{
            color:#858C94;
            font-size: rem(14);
            text-align: center;
            line-height: rem(20);
          }
          p:last-child{
            color:#18191A;
            margin-top:rem(8);
            font-weight: 600;
          }
        }
      }
    }
    .charts_padding{
      padding: rem(15) rem(0) rem(0);
      position: relative;
    }
  }
}
</style>
