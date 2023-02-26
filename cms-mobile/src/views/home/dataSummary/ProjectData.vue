<template>
  <div class="project-data">
    <div class="project-name" @click="toggleActionSheet">
      {{ OprojectName }} - {{ projectName }}
    </div>
    <div class="collection-rate first-child"
         v-if="hasAuthority('090103') && myChartForCZL">
      <div class="title">
        <span>出租率(房源面积)</span>
        <span></span>
      </div>
      <canvas id="myChartForCZL"
              v-if="myChartForCZL"
              class="myChart"></canvas>
    </div>
    <div class="collection-rate"
         v-if="hasAuthority('090103') && myChartForFYSJ">
      <div class="title">
        <span>历年税收</span>
        <span></span>
      </div>
      <canvas id="myChartForFYSJ"
              v-if="myChartForFYSJ"
              class="myChart"></canvas>
    </div>
    <div class="collection-rate format-analysis"
         v-if="hasAuthority('090103') && myChartForYTFX">
      <div class="title">
        <span>行业占比（房源面积）</span>
        <span></span>
      </div>
      <canvas id="myChartForYTFX"
              v-if="myChartForYTFX"
              class="myChart"
              :class="{'chart-height': chartHeight}"></canvas>
    </div>
    <div class="collection-rate"
         v-if="hasAuthority('090103') && myChartForYTFX">
      <div :class="!NothousesData.length ? 'title' : 'title border_Bom'">
        <span>未租房源</span>
        <span></span>
      </div>
      <div
        class="Nothouses"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loadBottom"
        infinite-scroll-distance="20"
        infinite-scroll-immediate-check="false"
        v-if="NothousesData.length">
        <div v-for="(item, index) in NothousesData" :key="index">
          <p>
            <span>{{ item.shopNumber }}</span>
            <span>建筑面积㎡：{{ item.buildingArea }}</span>
          </p>
          <p>{{ item.building.buildingName }}-{{ item.floor.name }}</p>
        </div>
      </div>
      <div class="loadAll" v-if="loadAll && NothousesData.length!==0">
        <span>-</span>
        <p>已经到底了</p>
        <span>-</span>
      </div>
      <div class="noData"
          v-if="NothousesData.length===0 && dataReady">
        <img src="../../../assets/nores.png">
        <p>暂无数据</p>
      </div>
    </div>
    <!-- 日期组件 -->
    <van-popup v-model="showDatetime"
               position="bottom"
               :style="{ height: '50%' }">
      <van-picker show-toolbar
                  :columns="columnsYear"
                  :default-index="5"
                  @confirm="confirmSelect"
                  @cancel="showDatetime = false" />
    </van-popup>
    <van-popup v-model="showcalendar"
               position="bottom"
               :style="{ height: '50%' }">
      <van-picker show-toolbar
                  title="选择时间"
                  :columns="columns"
                  @confirm="onConfirm"
                  @cancel="showcalendar = false" />
    </van-popup>
    <!-- 项目筛选 -->
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
            <li v-for="(item, index) in projectManagementList"
                :key="item.id"
                @click="selectProjectO(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>项目</p>
          <ul>
            <li v-for="(item, index) in projectListData"
                :key="item.id"
                @click="selectProjectList(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.referred }}</span>
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
    <!-- 业态分类 -->
    <van-popup v-model="showBusiness"
               position="bottom"
               :style="{ height: '50%' }">
      <van-picker show-toolbar
                  title=""
                  :columns="columnsBusiness"
                  @confirm="onConfirmBusiness"
                  @cancel="showBusiness = false" />
    </van-popup>
  </div>
</template>
<script>
import context from '@/service'
import moment from 'moment-timezone'
import { dateJson, dateYearJson } from './date'
import { Toast } from 'vant'
import ActionSheet from '@/components/Actionsheet'
import myMixin from './mixin'
import { toLocaleString } from '@/utils/validate.js'
export default {
  name: 'ProjectData',
  components: { ActionSheet },
  mixins: [myMixin],
  data () {
    return {
      showDatetime: false,
      showcalendar: false,
      minDate: new Date(2000, 0, 1),
      maxDate: new Date(2030, 10, 1),
      currentDate: new Date(),
      dateFYSJ: moment(new Date()).format('YYYY'),
      dateZJStart: moment(new Date()).format('YYYY') + '-01',
      dateZJEnd: moment(new Date()).format('YYYY-MM'),
      columns: [],
      columnsYear: dateYearJson,
      projectManagementList: [],
      projectListData: [],
      NothousesData: [],
      loadBottom: false,
      dataReady: false,
      loadAll: false,
      page: 0,
      size: 5,
      openActionsheet: false,
      tabIndex: 0,
      searchP: {
        OprojectId: '',
        OprojectName: '',
        projectId: '',
        projectName: ''
      },
      OprojectName: '',
      projectName: '',
      myChartForYTFX: false,
      myChartForFYSJ: false,
      chartHeight: false,
      myChartWidth: false,
      myChartForZJ: false,
      myChartForCZL: false,
      showBusiness: false,
      columnsBusiness: [],
      currentAreaType: '',
      toggleActionSheetS: false,
      popupShow: false,
      chart3: null
    }
  },
  watch: {
    openActionsheet: function (val, oldVal) {
      if (oldVal) {
        this.changeSelectIcon()
      }
    }
  },
  created () {
    // 获取管理企业数据接口
    this.getManageEnterprise()
  },
  mounted () {
    let _this = this
    this.$nextTick(() => {
      // this.getChartsInit()
    })
  },
  methods: {
    showNoData () {
      let flag = false
      if ((!this.isOnSubscribe(2) && !this.hasAuthority('09010101')) && (!this.isOnSubscribe(11) && !this.hasAuthority('09010101')) &&
        (!this.isOnSubscribe(14) && !this.hasAuthority('09010101')) && (!this.isOnSubscribe(15) && !this.hasAuthority('09010101'))) {
        flag = true
      }
      return flag
    },
    async getManageEnterprise () {
      let result = await context.http.get('uaa/api/organizes/enterprise/user?organizeType=ENTERPRISE&useStatus=USING')
      this.projectManagementList = result.data
      // 默认第一个
      this.searchP.OprojectName = result.data[0].name
      this.searchP.OprojectId = result.data[0].id
      this.OprojectName = result.data[0].name
      this.projectManagementList[0].checked = true
      //
      this.SelectData()
    },
    // 全部模块
    SelectData (flag) {
      // 动态项目
      context.http.get('cms/api/getOrganiz/infoByids?useStatus=USING&ids=' + this.searchP.OprojectId).then(result => {
        if (result.status === 200) {
          // 因为数据多了层数组
          if (result.data[0]) {
            this.projectListData = result.data[0].projectManagementDTO
            let projectIdList = this.projectListData.map(v => {
              return v.id
            })
            if (!this.searchP.projectId || !this.toggleActionSheetS) {
              this.searchP.projectId = result.data[0].projectManagementDTO[0].id
              this.searchP.projectName = result.data[0].projectManagementDTO[0].referred
              this.projectListData[0].checked = true
            }
            if (this.toggleActionSheetS) {
              let data = this.projectListData
              let le = data.indexOf(data.filter(v => v.id === this.searchP.projectId)[0])
              if (le !== -1) {
                this.searchP.projectId = data[le].id
                this.searchP.projectName = data[le].referred
                this.projectListData = this.checkedFormat(le, this.projectListData)
              } else {
                this.searchP.projectId = data[0].id
                this.searchP.projectName = data[0].referred
                this.projectListData[0].checked = true
              }
              this.toggleActionSheetS = false
            }
            // 获取图表数据未处理
            // 铺位出租率数据
            if (!flag) {
              this.projectName = this.searchP.projectName
              // 企业
              this.getShopOccupancyDataAnalyticAcquisition(projectIdList)
              // // 历年税收
              this.getCalendarTaxData()
              // // // 税收报表
              this.NothousesReset()
              this.getNoRentShop()
              // 行业
              this.getCompanyIndustryAccounted()
            }
          }
        }
      })
    },
    // 项目模块
    ProjectModule () {
      this.getShopOccupancyDataAnalyticAcquisition(this.searchP.projectId) // 项目
      // 2
      this.NothousesReset()
      this.getNoRentShop()
      // 3
      this.getCalendarTaxData()
      // 4
      this.getCompanyIndustryAccounted()
    },
    projectIdSelect (id) {
      this.ProjectModule(id)
    },
    // 虹桥项目八个图表
    // 企业-铺位出租率
    async getShopOccupancyDataAnalyticAcquisition (id) {
      let result = await context.http.get(`cms/api/stat/thisProjectZc`, { id: typeof id === 'object' ? id.toString() : id, UseStatus: 'USING' })
      this.CompanyShopOccupancy = result.data
      this.myChartForCZL = true
      this.$nextTick(() => {
        this.initChar({
          rentedArea: result.data.rRentAreaB,
          unRentedArea: result.data.kRentAreaB,
          totalArea: ((result.data.rRentAreaB * 10000) + (result.data.kRentAreaB * 10000)) / 10000
        })
      })
    },
    // 历年税收
    async getCalendarTaxData () {
      let result = await context.http.get(`cms/api/parkRun?time=1641262577543&level=PROJECTTYPE&id=${this.searchP.projectId}&kpiName=LNSS`)
      if (result.status === 200) {
        let valueArr = []
        result.data.forEach(v => {
          valueArr.push({ x: v.time, y: v.value })
        })
        this.myChartForFYSJ = true
        this.$nextTick(() => {
          this.initChar2(valueArr)
        })
        // this.rentalRateChar(timeArr, valueArr, 'rentalCalendarTax', '税收', '万元')
      }
    },
    // 企业-行业占比
    async getCompanyIndustryAccounted () {
      let result = await context.http.get(`cms/api/staging/tenantIndustry/${this.searchP.projectId}/`)
      if (result.status === 200) {
        let arr = []
        let maxArea = 0
        let allArea = result.data.tenantIndustryDTOList
        allArea.forEach(v => {
          maxArea = maxArea + v.area
        })
        result.data.tenantIndustryDTOList.forEach((ele, i) => {
          // 图表高度显示不完
          if (i <= 5) {
            // 限制名称长度
            if (ele.industry.length >= 5) {
              ele.industry = ele.industry.substring(0, 4) + '. . .'
            }
            arr.push({
              name: ele.industry,
              percent: ((ele.area / maxArea) * 100).toFixed(2),
              value: ele.area,
              color: ele.color,
              a: '1'
            })
          }
        })
        if (!result.data.tenantIndustryDTOList.length) {
          arr = [
            {
              value: 0,
              name: '未知行业',
              percent: 0,
              color: '#37C2FF',
              a: '1'
            }
          ]
        }
        this.myChartForYTFX = true
        this.$nextTick(() => {
          this.initChar3(arr, maxArea)
        })
      }
    },
    // 项目-未租房源
    async getNoRentShop () {
      this.dataReady = false
      this.loadAll = false
      let result = await context.http.get('cms/api/rooms', {
        projectManagemantId: this.searchP.projectId,
        page: this.page,
        size: this.size,
        useStatus: 'USING',
        onRent: false,
        sort: 'desc'
      })
      if (result.status === 200) {
        this.dataReady = true
        this.NothousesData = this.NothousesData.concat(result.data.list)
        if (this.NothousesData.length === Number(result.headers['x-total-count'])) this.loadAll = true
        if (result.data.list.length > 0) {
          this.loadBottom = false
          this.page = this.page + 1
        } else {
          this.page = this.page - 1
        }
      }
    },
    NothousesReset () {
      this.page = 0
      this.NothousesData = []
    },
    loadMore () {
      this.loadBottom = true
      this.getNoRentShop()
    },
    // 获取所有图表信息
    async getChartsInit () {
      await this.queryProjectManagement()
      this.getChartsData()
    },
    getChartsData () {
      this.getUserSubscribe().then(res => {
        if (this.isOnSubscribe(2) && this.hasAuthority('09010101')) {
          this.getRentalRate()
        }
        if (this.isOnSubscribe(11) && this.hasAuthority('09010101')) {
          this.collectionGroupByMonth()
        }
        if (this.isOnSubscribe(14) && this.hasAuthority('09010101')) {
          this.getFormatAnalysis()
        }
        if (this.isOnSubscribe(15) && this.hasAuthority('09010101')) {
          this.getAverageRent()
        }
      })
    },
    // 改变父组件选择状态图标展示
    changeSelectIcon () {
      this.$emit('selectIcon')
    },
    toggleActionSheet () {
      this.popupShow = !this.popupShow
      let data = this.projectManagementList
      let le = data.indexOf(data.filter(v => v.id === this.searchP.OprojectId)[0])
      this.projectManagementList = this.checkedFormat(le, this.projectManagementList)
      this.toggleActionSheetS = true
      this.SelectData(true)
    },
    selectLi (item, index) {
      this.tabIndex = index
      this.openActionsheet = false
      this.projectName = item.referred
      this.projectId = item.id
      this.getChartsData()
    },
    showcalendarHandler () {
      this.columns = [
        // 第一列
        {
          values: dateJson,
          defaultIndex: this.getdefaultIndex(this.dateZJStart)
        },
        // 第二列
        {
          values: dateJson,
          defaultIndex: this.getdefaultIndex(this.dateZJEnd)
        }
      ]
      this.showcalendar = true
    },
    getdefaultIndex (val) {
      return dateJson.indexOf(val)
    },
    formatter (type, val) {
      if (type === 'year') {
        return `${val}年`
      } else if (type === 'month') {
        return `${val}月`
      }
      return val
    },
    showDatetimeHandler (type) {
      this.showDatetime = true
    },
    confirmSelect (val) {
      this.showDatetime = false
      const val2 = moment(val).format('YYYY')
      this.dateFYSJ = val2
      this.collectionGroupByMonth()
    },
    onConfirm (date) {
      const [start, end] = date
      const startIdx = dateJson.indexOf(start)
      const endIdx = dateJson.indexOf(end)
      if (startIdx > endIdx) {
        Toast('结束日期不能小于开始日期')
        return
      }
      // let m = moment(end).diff(moment(start), 'months', true) // 限制查询时间跨多不超过12个月
      // if (m > 11) {
      //   Toast('时间跨度不能超过12个月')
      //   return
      // }
      this.dateZJStart = start
      this.dateZJEnd = end
      this.showcalendar = false
      this.getAverageRent()
    },
    // 铺位出租率图表
    initChar (resData) {
      const percentage = isNaN(resData.rentedArea / resData.totalArea)
        ? 0
        : resData.rentedArea / resData.totalArea
      const percentage2 = isNaN(resData.unRentedArea / resData.totalArea)
        ? 0
        : resData.unRentedArea / resData.totalArea
      let data
      if (resData.totalArea === 0) {
        data = [
          {
            name: '已租',
            percent: '0.00',
            value: 50,
            a: '1'
          },
          {
            name: '未租',
            percent: '0.00',
            value: 50,
            a: '1'
          }
        ]
      } else {
        data = [
          {
            name: '已租',
            percent: (percentage * 100).toFixed(2),
            value: resData.rentedArea,
            a: '1'
          },
          {
            name: '未租',
            percent: (percentage2 * 100).toFixed(2),
            value: resData.unRentedArea,
            a: '1'
          }
        ]
      }
      const map = {}
      const map2 = {}
      data.forEach(function (obj) {
        if (resData.totalArea === 0) {
          map[obj.name] = obj.percent + '%'
        } else {
          map[obj.name] = obj.percent + '%'
        }
      })
      data.forEach(function (obj) {
        if (resData.totalArea === 0) {
          map2[obj.name] = 0 + '㎡'
        } else {
          map2[obj.name] = toLocaleString(obj.value) + '㎡'
        }
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
      if (resData.totalArea !== 0) {
        // Tooltip 配置
        chart.tooltip({
          // alwaysShow: true,
          showTitle: true, // 展示  tooltip 的标题
          layout: 'vertical',
          offsetY: 20,
          background: {
            radius: 2,
            fill: '#656464',
            opacity: 0.1,
            padding: [6, 10]
          },
          onShow: function onShow (ev) {
            let items = ev.items
            let { name, title } = ev.items[0]
            items[0].name = '面积'
            items[0].title = name
            items[0].value = items[0].value + '㎡'
          },
          titleStyle: {
            fill: '#656464'
          }, // tooltip 标题的文本样式配置，showTitle 为 false 时不生效
          nameStyle: {
            fill: '#656464'
          }, // tooltip name 项的文本样式配置
          valueStyle: {
            fill: '#656464'
          } // tooltip value 项的文本样式配置
        })
      } else {
        chart.tooltip(false)
      }
      chart.axis(false)
      chart.legend({
        position: 'right',
        itemFormatter: function itemFormatter (val) {
          return val + '      ' + map2[val] + ' ' + '(' + map[val] + ')'
        }
      })
      chart.coord('polar', {
        transposed: true,
        innerRadius: 0.7,
        radius: 0.85
      })
      chart
        .interval()
        .position('a*value')
        .color('name', ['#3985FF', '#37C2FF'])
        .adjust('stack')
      chart.guide().text({
        position: ['50%', '108%'],
        content: `总面积: ${toLocaleString(resData.totalArea)}㎡`,
        style: {
          textBaseline: 'bottom',
          textAlign: 'center',
          fontSize: '12'
        },
        offsetY: -2
      })
      chart.render()
    },
    numberToMoney (n) {
      return String(Math.floor(n * 100) / 100).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    // 费用收缴图表
    initChar2 (data) {
      const chart = new this.$F2.Chart({
        id: 'myChartForFYSJ',
        pixelRatio: window.devicePixelRatio // 指定分辨率
      })
      const defs = {
        x: {
          // tickCount: 6 // 区间，写几个就有几个区间
        },
        y: {
          alias: '税收' // x轴说明
        }
      }
      // Step 2: 载入数据源
      chart.source(data, defs)
      chart.legend({
        align: 'right',
        itemWidth: null // 图例项按照实际宽度渲染
      })
      // Tooltip 配置
      chart.tooltip({
        // alwaysShow: true,
        showTitle: true, // 展示  tooltip 的标题
        layout: 'vertical',
        offsetY: 20,
        background: {
          radius: 2,
          fill: '#656464',
          opacity: 0.1,
          padding: [6, 10]
        },
        onShow: function onShow (ev) {
          let items = ev.items
          // let { name, title } = ev.items[0]
          // items[0].name = title
          // items[0].title = name
          items[0].value = items[0].value + '万元'
        },
        titleStyle: {
          fill: '#656464'
        }, // tooltip 标题的文本样式配置，showTitle 为 false 时不生效
        nameStyle: {
          fill: '#656464'
        }, // tooltip name 项的文本样式配置
        valueStyle: {
          fill: '#656464'
        } // tooltip value 项的文本样式配置
      })
      // 辅助标记
      chart.guide().text({
        position: ['min', 'max'],
        content: '万元', // 标记内容
        style: {
          fill: '#858C94', // 文本颜色
          textBaseline: 'middle',
          textAlign: 'start'
        },
        offsetY: -20,
        offsetX: -25
      })
      chart.axis('x', {
        label: {
          rotate: -Math.PI / 3,
          textAlign: 'end',
          textBaseline: 'middle'
        }
      })
      // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
      chart.interval().position('x*y').style({
        radius: [2, 2, 0, 0]
      }).size(12).color(`l(90) 0:#68D0FB 1:#1552FF`)
      // Step 4: 渲染图表
      chart.render()
    },
    // 业态分析图表
    initChar3 (data, allArea) {
      const resData = [
        {
          name: '未知行业',
          percent: '0.00',
          value: 50,
          a: '1'
        }
      ]
      if (data[0].name === '未知行业') {
        data = resData
        allArea = 0
      }
      const _this = this
      const map = {}
      const map2 = {}
      let colorArr = []
      data.forEach(function (obj) {
        map[obj.name] = obj.percent + '%'
      })
      data.forEach(function (obj) {
        if (data[0].name === '未知行业') {
          map2[obj.name] = 0 + '㎡'
        } else {
          map2[obj.name] = _this.numberToMoney(obj.value) + '㎡'
        }
      })
      data.forEach(ele => {
        colorArr.push(ele.color)
      })
      const chart = new this.$F2.Chart({
        id: 'myChartForYTFX',
        pixelRatio: window.devicePixelRatio,
        padding: [20, 'auto']
      })
      this.chart3 = chart
      chart.source(data, {
        percent: {
          formatter: function formatter (val) {
            return val + '%'
          }
        }
      })
      chart.axis(false)
      if (allArea !== 0) {
        // Tooltip 配置
        chart.tooltip({
          // alwaysShow: true,
          showTitle: true, // 展示  tooltip 的标题
          layout: 'vertical',
          offsetY: 20,
          background: {
            radius: 2,
            fill: '#656464',
            opacity: 0.1,
            padding: [6, 10]
          },
          onShow: function onShow (ev) {
            let items = ev.items
            let { name, title } = ev.items[0]
            items[0].name = '面积'
            items[0].title = name
            items[0].value = items[0].value + '㎡'
          },
          titleStyle: {
            fill: '#656464'
          }, // tooltip 标题的文本样式配置，showTitle 为 false 时不生效
          nameStyle: {
            fill: '#656464'
          }, // tooltip name 项的文本样式配置
          valueStyle: {
            fill: '#656464'
          } // tooltip value 项的文本样式配置
        })
      } else {
        chart.tooltip(false)
      }
      chart.legend({
        position: 'right',
        itemFormatter: function itemFormatter (val) {
          return val + '      ' + map2[val] + ' ' + '(' + map[val] + ')'
        }
      })
      chart.coord('polar', {
        transposed: true,
        innerRadius: 0.7,
        radius: 0.85
      })
      chart
        .interval()
        .position('a*value')
        .color('name', colorArr)
        .adjust('stack')
      chart.guide().text({
        position: ['50%', '105%'],
        content: `总面积: ${_this.numberToMoney(allArea)}㎡`,
        style: {
          textBaseline: 'bottom',
          textAlign: 'center',
          fontSize: '12'
        },
        offsetY: -2
      })
      chart.render()
    },
    // 均租图表
    initChar4 (data) {
      const map = {}
      const map2 = {}
      data.forEach(function (obj) {
        map[obj.name] = 0 + '万元'
      })
      data.forEach(function (obj) {
        map2[obj.name] = 0 + '万元'
      })
      const chart = new this.$F2.Chart({
        id: 'myChartForZJ',
        pixelRatio: window.devicePixelRatio,
        padding: [20, 'auto']
      })
      chart.source(data, {
        percent: {
          formatter: function formatter (val) {
            return val + '万元'
          }
        }
      })
      chart.tooltip(false)
      chart.legend({
        position: 'right',
        itemFormatter: function itemFormatter (val) {
          return val + '      ' + map2[val] + ' ' + '(' + map[val] + ')'
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
        .color('name', ['#3985FF', '#37C2FF'])
        .adjust('stack')
      chart.guide().text({
        position: ['50%', '108%'],
        content: `税收总金额: ${toLocaleString(0)}万元`,
        style: {
          textBaseline: 'bottom',
          textAlign: 'center',
          fontSize: '12'
        },
        offsetY: -2
      })
      chart.render()
    },
    // 铺位出租率
    getRentalRate () {
      if (!this.projectId) return
      context.http
        .get('cms/api/reportRented/statistics/byProject', {
          projectId: this.projectId
        })
        .then(res => {
          if (res.status === 200) {
            this.initChar(res.data)
          }
        })
    },
    // 业态分析
    getFormatAnalysis () {
      if (!this.projectId) return
      context.http
        .get(`cms/api/staging/tenantIndustry/${this.projectId}`)
        .then(res => {
          if (res.status === 200) {
            this.FormatAnalysisData = res.data
            let areaTypeList = []
            res.data.forEach((ele, index) => {
              areaTypeList.push({ text: ele.tenantUseIndustry, index: index })
            })
            this.columnsBusiness = areaTypeList
            this.currentAreaType = this.columnsBusiness[0].text

            const allArea = res.data[0].value.allArea
            this.setFormatAnalysis(res.data, allArea)
          }
        })
    },
    setFormatAnalysis (resData, allArea) {
      this.myChartForYTFX = false
      if (resData.length === 0) return
      let arr = []
      resData[0].value.tenantIndustryDTOList.forEach(ele => {
        arr.push({
          name: ele.industry,
          percent: ((ele.area / allArea) * 100).toFixed(2),
          value: ele.area,
          color: ele.color,
          a: '1'
        })
      })
      if (arr.length >= 7) {
        this.chartHeight = true
      } else {
        this.chartHeight = false
      }
      this.myChartForYTFX = true
      this.$nextTick(() => {
        this.initChar3(arr, allArea)
      })
    },
    // 业态分类确认
    onConfirmBusiness (data) {
      this.chart3.clear()
      const { index, text } = data
      this.currentAreaType = text
      let resData = this.FormatAnalysisData.filter(ele => {
        return text === ele.tenantUseIndustry
      })
      const allArea = resData[0].value.allArea
      this.setFormatAnalysis(resData, allArea)

      this.showBusiness = false
    },
    // 平均租金
    getAverageRent () {
      if (!this.projectId) return
      this.myChartForZJ = false
      context.http
        .get(`cms/api/staging/avgPirce/${this.projectId}`, {
          startDate: this.dateZJStart + '-01',
          endDate: this.dateZJEnd + '-01'
        })
        .then(res => {
          if (res.status === 200) {
            this.myChartForZJ = true
            res.data[0].value.forEach(ele => {
              ele.shotDate = ele.recordDate.substring(0, 7)
            })
            if (res.data.length > 10) {
              this.myChartWidth = true
            } else {
              this.myChartWidth = false
            }
            // 组合不同业态的数据
            let arr = []
            res.data.forEach(ele => {
              ele.value.forEach(ele2 => {
                ele2.type = ele.tenantUseDescription
                ele2.shotDate = ele2.recordDate.substring(0, 7)
                ele2.value = ele2.price
                ele2.tenantUseColor = ele.tenantUseColor
              })
              arr = arr.concat(ele.value)
            })
            this.$nextTick(() => {
              this.initChar4(arr) // 平均租金
            })
          }
        })
    },
    selectProjectO (i, item) {
      this.searchP.OprojectId = item.id
      this.searchP.OprojectName = item.name
      this.projectManagementList = this.checkedFormat(i, this.projectManagementList)
      this.SelectData(true)
    },
    selectProjectList (i, item) {
      this.searchP.projectId = item.id
      this.searchP.projectName = item.referred
      this.projectListData = this.checkedFormat(i, this.projectListData)
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
        // 重置后重新获取项目数据
        context.http.get('cms/api/getOrganiz/infoByids?useStatus=USING&ids=' + this.projectManagementList[0].id).then(result => {
          if (result.status === 200) {
            if (result.data[0]) {
              this.projectListData = result.data[0].projectManagementDTO
              this.projectListData = this.checkedFormat(0, this.projectListData)
            }
          }
        })
      } else {
        this.myChartForYTFX = false
        this.myChartForFYSJ = false
        this.myChartForCZL = false

        if (!this.projectManagementList.length) {
          this.popupShow = false
          return
        }
        this.popupShow = false
        let dataS = {
          data1: this.projectManagementList,
          data2: this.projectListData
        }
        if (dataS.data1[0].checked) {
          this.searchP.OprojectName = dataS.data1[0].name
          this.searchP.OprojectId = dataS.data1[0].id
          this.OprojectName = this.searchP.OprojectName
        } else {
          let { name, id } = dataS.data1.filter(v => v.id === this.searchP.OprojectId)[0]
          this.searchP.OprojectName = name
          this.searchP.OprojectId = id
          this.OprojectName = name
        }
        if (dataS.data2[0].checked) {
          this.searchP.projectName = dataS.data2[0].referred
          this.searchP.projectId = dataS.data2[0].id
          this.projectName = this.searchP.projectName
        } else {
          let { referred, id } = dataS.data2.filter(v => v.id === this.searchP.projectId)[0]
          this.searchP.projectName = referred
          this.searchP.projectId = id
          this.projectName = referred
        }
        this.projectIdSelect(this.searchP.projectId)
      }
    },
    async queryProjectManagement () {
      const res = await context.http.get('cms/api/project-managements', {
        useStatus: 'USING'
      })
      if (res.status === 200 && res.data.length > 0) {
        this.projectManagementList = res.data
        this.projectName = res.data[0].referred
        this.projectId = res.data[0].id
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
.project-data {
  .actionsheet_wrapper {
    top: rem(40);
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
  .myChart {
    width: 100%;
    height: rem(190);
  }
  .myChartWidth {
    width: rem(1000) !important;
  }
  .chart-height {
    height: rem(300);
  }
  .project-name {
    display: inline-block;
    width: 100%;
    position: fixed;
    left: 0;
    top: rem(40);
    font-size: rem(14);
    color: #444547;
    background: #f8f9fa;
    height: rem(28);
    line-height: rem(28);
    padding: 0 rem(14);
  }
  .collection-rate {
    width: 100%;
    display: inline-block;
    background-color: #fff;
    margin-top: rem(10);
  }
  .collection-rate {
    .title {
      display: flex;
      justify-content: space-between;
      padding: rem(10) rem(14);
      span {
        &:first-child {
          color: #18191a;
          font-size: rem(15);
          font-weight: bold;
        }
        &:last-child {
          color: #444547;
          font-size: rem(12);
        }
      }
    }
    .border_Bom {
      border-bottom: 1px solid #F0F0F0;
    }
    .Nothouses{
      width: 100%;
      padding-left: rem(14);
      >div{
        padding: rem(12) 0;
        border-bottom: 1px solid #F0F0F0;
        p{
          line-height: 28px;
          color: #858C94;
          font-size: rem(14);
        }
        p:first-child{
          color: #18191A;
          font-size: rem(15);
          font-weight: 700;
          padding-bottom: rem(4);
          display: flex;
          justify-content: space-between;
          span:last-child{
            margin-right: rem(14);
            color: #858C94;
            font-size: rem(14);
            font-weight: 400;
          }
        }
      }
      >div:last-child{
        border-bottom: none
      }
    }
  }
  .format-analysis {
    .iconcms_shaixuan-xia {
      top: 0;
    }
  }
  .first-child {
    margin-top: rem(5);
  }
  .iconcms_shaixuan-xia {
    position: relative;
    top: rem(2);
    font-size: rem(12);
  }
  .noData {
    width: rem(140);
    height: rem(180);
    position: relative;
    left: 0;
    right: 0;
    margin: auto;
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
