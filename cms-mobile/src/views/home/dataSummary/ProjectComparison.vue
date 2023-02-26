<template>
  <div class="project-comparison">
    <div class="collection-rate"
         v-if="hasAuthority('09010101')">
      <div class="title">
        <span>管理面积</span>
        <span></span>
      </div>
      <IntervalCharts :chartsConfig="chartsConfigSJL"></IntervalCharts>
    </div>
    <div class="collection-rate"
         v-if="hasAuthority('09010102')">
      <div class="title">
        <span>一手出租率</span>
        <span></span>
      </div>
      <IntervalCharts :chartsConfig="chartsConfigCZL"></IntervalCharts>
    </div>
    <div class="collection-rate"
         v-if="hasAuthority('09010103')">
      <div class="title">
        <span>当年租金收缴率</span>
        <span>（截止至：2022年1月）</span>
      </div>
      <IntervalCharts :chartsConfig="chartsConfigZJ"></IntervalCharts>
    </div>
    <!-- <div class="noData"
          v-if="showNoData()">
      <img src="../../../assets/nores.png">
      <p>暂无数据</p>
    </div> -->
    <!-- 日期 -->
    <van-popup v-model="showDatetimeSJL"
               position="bottom"
               :style="{ height: '50%' }">
      <div class="switch-warp">
        <div class="switch-tab">
          <span :class="{'active': tabindex === 1}"
                @click="switchTab(1)">按月</span>
          <span :class="{'active': tabindex === 2}"
                @click="switchTab(2)">按年</span>
        </div>
      </div>
      <van-datetime-picker v-if="tabindex === 1"
                           v-model="currentDate"
                           type="year-month"
                           :min-date="minDate"
                           :max-date="maxDate"
                           :formatter="formatter"
                           @cancel="showDatetimeSJL = false"
                           @confirm="onConfirmSJL" />
      <van-picker v-else
                  show-toolbar
                  :columns="columns"
                  :default-index="5"
                  @confirm="onConfirmSJL2"
                  @cancel="showDatetimeSJL = false" />
    </van-popup>
    <van-popup v-model="showDatetime"
               position="bottom"
               :style="{ height: '50%' }">
      <van-datetime-picker v-model="currentDate"
                           type="year-month"
                           title="选择年月"
                           :min-date="minDate"
                           :max-date="maxDate"
                           :formatter="formatter"
                           @cancel="showDatetime = false"
                           @confirm="confirmSelect" />
    </van-popup>
  </div>
</template>
<script>
import context from '@/service'
import moment from 'moment-timezone'
import { dateYearJson } from './date'
import myMixin from './mixin'
import IntervalCharts from './components/IntervalCharts'
export default {
  name: 'ProjectComparison',
  components: { IntervalCharts },
  mixins: [myMixin],
  data () {
    return {
      tabindex: 1,
      showDatetimeSJL: false,
      pickerVisible: '',
      showDatetime: false,
      minDate: new Date(2000, 0, 1),
      maxDate: new Date(2030, 11, 1),
      currentDate: new Date(),
      dateSJL: moment(new Date()).format('YYYY-MM'),
      dateCZL: moment(new Date()).format('YYYY-MM'),
      dateZJ: moment(new Date()).format('YYYY-MM'),
      columns: dateYearJson,
      chartsAuthority: [],
      chartsConfigSJL: {},
      chartsConfigCZL: {},
      chartsConfigZJ: {}
    }
  },
  created () {
  },
  mounted () {
    this.queryProjectList()
  },
  methods: {
    showNoData () {
      let flag = false
      if ((!this.isOnSubscribe(1) && !this.hasAuthority('09010401')) && (!this.isOnSubscribe(12) && !this.hasAuthority('09010401')) &&
       (!this.isOnSubscribe(13) && !this.hasAuthority('09010401'))) {
        flag = true
      }
      return flag
    },
    onConfirmSJL (date) {
      const value = moment(date).format('YYYY-MM')
      this.dateSJL = value
      this.showDatetimeSJL = false
      this.getCollectionRate()
    },
    onConfirmSJL2 (value, index) {
      this.dateSJL = value
      this.showDatetimeSJL = false
      this.getCollectionRate()
    },
    switchTab (index) {
      this.tabindex = index
      if (index === 1) {
        this.twoCharCondition = 'MONTH'
      } else {
        this.twoCharCondition = 'YEAR'
      }
    },
    formatter (type, val) {
      if (type === 'year') {
        return `${val}年`
      } else if (type === 'month') {
        return `${val}月`
      }
      return val
    },
    openPicker () {
      this.showDatetimeSJL = true
    },
    showDatetimeHandler (type) {
      this.showDatetime = true
      this.pickerType = type
    },
    confirmSelect (val) {
      this.showDatetime = false
      const val2 = moment(val).format('YYYY-MM')
      if (this.pickerType === 'dateCZL') {
        this.dateCZL = val2
        this.getRentalRate()
      } else {
        this.dateZJ = val2
        this.getAverageRent()
      }
    },
    // 管理面积 || 出租率
    async queryProjectList (id) {
      let result = await context.http.get('cms/api/getOrganiz/infoByids/all', { useStatus: 'USING', ids: '' })
      if (result.status === 200) {
        // 出租率
        if (this.hasAuthority('09010102')) {
          let ObjArr1 = this.ObjFor(result.data, 'organizeName', 'rentRate')
          // this.rentalRateChar(ObjArr1.NameArr, ObjArr1.valueArr, 'rentalRate', '出租率', '%')
          this.chartsConfigCZL = {
            id: 'myChartForCZL',
            data: ObjArr1,
            defs: {
              x: {
                // tickCount: 6 // 区间，写几个就有几个区间
              },
              y: {
                alias: '出租率' // x轴说明
              }
            },
            textContent: '%',
            color: ['#FFD52D', '#FF555A']
          }
        }
        // 管理面积
        if (this.hasAuthority('09010101')) {
          let ObjArr2 = this.ObjFor(result.data, 'organizeName', 'area')
          ObjArr2.forEach((v, i) => {
            // 保留真实数据的一位小数
            // let num = Number(v / 10000).toString()
            // ObjArr2.valueArr[i] = num = num.substring(0, num.indexOf('.') + 2)
            // 四舍五入保留一位小数
            ObjArr2[i].y = Number(v.y / 10000).toFixed(1)
          })
          const defs = {
            x: {
              // tickCount: 5 // 区间，写几个就有几个区间
            },
            y: {
              alias: '面积' // x轴说明
            }
          }
          const color = ['#68D0FB', '#1552FF']
          const textContent = '万m²'
          const id = 'myChartForSJL'
          this.chartsConfigSJL = {
            id,
            data: ObjArr2,
            defs,
            textContent,
            color
          }
        }
        // 当年租金收率缴
        if (this.hasAuthority('09010103')) {
          // ['工业公司', '外资公司', '上虹公司', '资产公司', '虹桥村', '虹二村', '虹四村', '虹五村', '虹六村', '红春村', '新桥村', '西郊村', '先锋村', '井亭村', '科技园区', '紫晶公司'],
          // ['92.0', 53.7, 79.2, 109.7, 74.8, 77.3, 48.4, '65.0', '25.0', 106.2, 91.2, 84.2, 153.1, 104.9, 109.7, 53.3]
          this.chartsConfigZJ = {
            id: 'myChartForZJ',
            data: [
              { x: '工业公司', y: '92.0' },
              { x: '外资公司', y: '53.7' },
              { x: '上虹公司', y: '79.2' },
              { x: '资产公司', y: '109.7' },
              { x: '虹桥村', y: '74.8' },
              { x: '虹二村', y: '77.3' },
              { x: '虹四村', y: '48.4' },
              { x: '虹五村', y: '65.0' },
              { x: '虹六村', y: '25.0' },
              { x: '红春村', y: '106.2' },
              { x: '新桥村', y: '91.2' },
              { x: '西郊村', y: '84.2' },
              { x: '先锋村', y: '153.1' },
              { x: '井亭村', y: '104.9' },
              { x: '科技园区', y: '109.7' },
              { x: '紫晶公司', y: '53.3' }
            ],
            defs: {
              x: {
                // tickCount: 6 // 区间，写几个就有几个区间
              },
              y: {
                alias: '收缴率' // x轴说明
              }
            },
            textContent: '%',
            color: ['#A8FF78', '#00CEBF']
          }
        }
      }
    },
    ObjFor (data, key, name) {
      // let valueArr = []
      let dataArr = []
      data.forEach(ele => {
        // if (key === 'Yield') {
        //   // 数据造假
        //   valueArr.push(ele[key] === undefined ? Number(Math.random(100) * 100).toFixed(2) : ele[key])
        // } else {
        //   valueArr.push(ele[key] === null ? '' : ele[key])
        // }
        dataArr.push({ x: ele[key], y: ele[name] })
      })
      return dataArr
    },
    // 两费收缴率
    getCollectionRate () {
      const twoCharCondition = this.twoCharCondition || 'MONTH'
      context.http.get(`cms/api/reportColl/collectionRate/${twoCharCondition}`, { dateStr: this.dateSJL }).then(res => {
        if (res.status === 200) {
          // this.initChar(res.data)
          let data = res.data
          data.forEach(ele => {
            ele.x = ele.projectName
            ele.y = ele.collectionRate
          })
          const defs = {
            x: {
              // tickCount: 5 // 区间，写几个就有几个区间
            },
            y: {
              alias: '收缴率' // x轴说明
            }
          }
          const color = ['#68D0FB', '#1552FF']
          const textContent = '单位：%'
          const id = 'myChartForSJL'
          this.chartsConfigSJL = {
            id,
            data,
            defs,
            textContent,
            color
          }
        }
      })
    },
    // 铺位出租率
    getRentalRate () {
      context.http.get(`cms/api/reportRented/statistics/all`, { date: this.dateCZL }).then(res => {
        if (res.status === 200) {
          // this.initChar2(res.data) // 铺位出租率
          let data = res.data
          data.forEach(ele => {
            ele.x = ele.projectName
            ele.y = ele.rentedRate
          })
          const defs = {
            x: {
              // tickCount: 6 // 区间，写几个就有几个区间
            },
            y: {
              alias: '出租率' // x轴说明
            }
          }
          const color = ['#FFD52D', '#FF555A']
          const textContent = '单位：%'
          const id = 'myChartForCZL'
          this.chartsConfigCZL = {
            id,
            data,
            defs,
            textContent,
            color
          }
        }
      })
    },
    // 平均租金
    getAverageRent () {
      context.http.get(`cms/api/staging/avgPirce`, { date: this.dateZJ + '-01' }).then(res => {
        if (res.status === 200) {
          // this.initChar3(res.data) // 平均租金
          let data = res.data
          data.forEach(ele => {
            ele.x = ele.referred
            ele.y = ele.price
          })
          const defs = {
            x: {
              // tickCount: 6 // 区间，写几个就有几个区间
            },
            y: {
              alias: '平均租金' // x轴说明
            }
          }
          const color = ['#A8FF78', '#00CEBF']
          const textContent = '单位：元/m²天'
          // offsetY: -23,
          // offsetX: -18
          const id = 'myChartForZJ'
          this.chartsConfigZJ = {
            id,
            data,
            defs,
            textContent,
            color
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
.project-comparison {
  > div {
    width: 100%;
    display: inline-block;
    background-color: #fff;
    margin-top: rem(10);
  }
  .myChart {
    width: 100%;
    height: rem(190);
  }
  .collection-rate {
    .title {
      display: flex;
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
  }
  .switch-warp {
    background-color: #f8f8f8;
    padding-top: rem(10);
  }
  .switch-tab {
    display: flex;
    align-items: center;
    justify-content: center;
    width: rem(122);
    margin: 0 auto;
    font-size: rem(12);
    span {
      width: rem(60);
      height: rem(24);
      line-height: rem(22);
      text-align: center;
      border: rem(1) solid #ddd;
      &:first-child {
        border-right: none;
        border-top-left-radius: rem(4);
        border-bottom-left-radius: rem(4);
      }
      &:last-child {
        border-top-right-radius: rem(4);
        border-bottom-right-radius: rem(4);
      }
      &.active {
        background-color: #3575f6;
        border: rem(1) solid #3575f6;
        color: #fff;
      }
    }
  }
  .iconcms_shaixuan-xia {
    position: relative;
    top: rem(2);
    font-size: rem(12);
  }
  .noData {
    width: rem(140);
    height: rem(180);
    position: absolute;
    top: rem(80);
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
