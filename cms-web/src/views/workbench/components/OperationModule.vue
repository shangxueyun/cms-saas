<template>
  <div class="operation-module">
    <div class="pj-search" v-if="anchorList.includes(9) || anchorList.includes(10) || anchorList.includes(11) || anchorList.includes(12)">
      <el-select v-model="projectId" placeholder="项目"  @change='getProjectId'>
        <el-option
          v-for="item in projectOptions"
          :key="item.id"
          :label="item.referred"
          :value="item.id">
        </el-option>
      </el-select>
      <div style="margin-left:30px;" @click="search"
            class="query-btn">查询</div>
    </div>
    <div class="signing-tenants"  v-if="isOnSubscribe('9')" ref="billMaturity">
      <div class="st-title">
        账单到期/逾期
      </div>
      <el-table :data="tableData" style="border:1px solid #eee" :class="{'table-height': tableHeight}">
        <el-table-column  prop="projectManagement.referred" label="项目" align="center"></el-table-column>
        <el-table-column  prop="tenantName" label="客户名称" align="center"></el-table-column>
        <el-table-column  label="品牌名称" align="center">
          <template slot-scope="scope">
            {{scope.row.referred}}
          </template>
        </el-table-column>
        <el-table-column  label="应收时间" align="center" >
          <template slot-scope="scope">
            {{scope.row.finalPaymentDate}}
          </template>
        </el-table-column>
        <el-table-column label="费用类型" align="center" >
          <template slot-scope="scope">
            {{scope.row.feeTypeName}}
          </template>
        </el-table-column>
        <el-table-column  label="应收金额" align="center" >
          <template slot-scope="scope">
            {{scope.row.amount | toLocaleString}}
          </template>
        </el-table-column>
        <el-table-column  label="核销金额" align="center" >
          <template slot-scope="scope">
            {{scope.row.writeOffAmount}}
          </template>
        </el-table-column>
        <el-table-column  label="欠收金额" align="center" >
          <template slot-scope="scope">
            {{scope.row.arrearsAmount | toLocaleString}}
          </template>
        </el-table-column>
        <el-table-column  label="账单状态" prop="billStatus" align="center" :formatter="formatterBillStatus"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.$index, scope.row)" class="el-button--primary operation-btn" size="mini" >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="st-footer" v-if="tableData && tableData.length > 4">
        <span @click="loadMore" v-if="ckLoadMore">点击加载更多 ></span>
        <span v-else><router-link :to="{ path: 'billMaturity' }">点击浏览更多 ></router-link></span>
      </div>
    </div>
    <section class="rental-rate clearfix"  v-if="isOnSubscribe('10')" ref="followUpTime">
      <span class="section-title">跟进时间</span>
      <span class="datepicker">
        <el-select v-model="buildingId" placeholder="请选择" @change="followRecord">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.buildingName"
            :value="item.id">
          </el-option>
        </el-select>
      </span>
      <div class="chart clearfix" style="width: 100%">
        <div class="follow-up-steps clearfix">
          <div v-for="(item, index) in stepList" :key="index" :class="{'stepactive': activeIndex === index}">
            <i></i>
            <span class="step__line"></span>
            <span @click="selectStep(index)">{{item.name}}</span>
            <span style="color: #3175F6" v-if="activeIndex === index"> >> </span>
          </div>
        </div>
        <div class="steps-content">
          <div v-for="(item, index) in followRecordDataSel" :key="index">
            <p>{{item.name}}层</p>
            <div>
              <span v-for="(item2, index2) in item.graphDTOS" :key="index2" @click="handleDetail(index2, item2)">{{item2.reffered}}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="rental-rate clearfix"  v-if="isOnSubscribe('11')" ref="collectionOfExpenses">
      <span class="section-title">费用收缴（元）</span>
      <span class="datepicker">
        <el-date-picker
          @change="collectionGroupByMonth"
          value-format="yyyy-MM-dd"
          v-model="sjDatepicker"
          type="month"
          placeholder="选择月">
        </el-date-picker>
      </span>
      <div class="chart">
        <div id="collectionOfExpenses" :style="{width: '90%', height: '80%'}"></div>
      </div>
    </section>
    <section class="rental-rate clearfix"  v-if="isOnSubscribe('12')" ref="expirationOfContract">
      <span class="section-title">合同到期日分析</span>
      <div class="chart">
        <div id="expirationOfContract" :style="{width: '100%', height: '100%'}"></div>
        <div class="all-area">合同总数：{{allContract}}</div>
      </div>
    </section>
    <!-- 账单详情 -->
    <bill-details v-if="detailsdrawershow" :detailsdrawershow="detailsdrawershow" :detailsData="builddetailsData"
     @drawerClose="drawerClose" @handleEdit="handleEdit" @query='queryBill' ref="billDetail"></bill-details>
     <!-- 多经账单详情 -->
     <income-details v-if="incdDetailsdrawershow" :detailsdrawershow="incdDetailsdrawershow" :detailsData="builddetailsData"
     @drawerClose="drawerClose" @handleEdit="handleEdit" @query='queryBill' ref="billDetail"></income-details>
     <!-- 客户详情 -->
    <tenant-details :detailsdrawershow="detailsShow"
                   :tenantDetail="detailData"
                   ref="tenantDetails"
                   @affirmDialog="affirmDialog"
                   @drawerClose="detailsClose"
                   @query="queryTenant" 
                   @handleEdit="handleDetail"
                   v-if="detailsShow"></tenant-details>
  </div>
</template>
<script>
import context from '@/service'
import * as JSOG from 'jsog'
import billDetails from '@/views/operations/costCollection/billList/components/billDetails'
import tenantDetails from '@/views/operationManagement/tenantInfo/components/tenantDetails'
import incomeDetails from '@/views/operations/varietyBusiness/income/components/incomeDetails'
export default {
  name: 'OperationModule',
  props: ['projectIdSelected', 'anchorList', 'projectOptions'],
  components: {
    billDetails,
    tenantDetails,
    incomeDetails
  },
  data () {
    return {
      ckLoadMore: true,
      tableHeight: false,
      detailsShow: false,
      detailsdrawershow: false,
      incdDetailsdrawershow: false,
      detailData: {},
      builddetailsData: {},
      allContract: '',
      queryBillId: '',
      buildingId: '',
      sjDatepicker: '',
      projectId: '',
      tableData: [],
      datepicker: '',
      activeIndex: 0,
      options: [],
      followRecordDataSel: [],
      followRecordData: [],
      stepList: [{name: '暂无跟进'}, {name: '7天未跟进'}, {name: '15天未跟进'}, {name: '30天未跟进'}]
    }
  },
  watch: {
    projectIdSelected: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.projectId = this.projectIdSelected
        } else {
          this.projectId = this.projectOptions[0].id
        }
      },
      immediate: true
    },
    anchorList: {
      handler: function () {
        this.$nextTick(() => {
          this.search()
        })
      }
    }
  },
  created () {
    var now = new Date()
    var myyear = now.getFullYear()
    var mymonth = now.getMonth() + 1
    mymonth = mymonth < 10 ? '0' + mymonth : mymonth
    this.sjDatepicker = myyear + '-' + mymonth
  },
  mounted () {
    this.search()
  },
  methods: {
    isOnSubscribe (id) { // 模块是否订阅
      for (var i = 0; i < this.anchorList.length; i++) {
        if (Number(this.anchorList[i]) === Number(id)) {
          return true
        }
      }
    },
    queryBill () {
      this.billsNow()
    },
    query () {},
    queryTenant () {
      this.followRecord()
    },
    search () {
      if (this.$refs.billMaturity) {
        this.billsNow()
      }
      if (this.$refs.followUpTime) {
        this.getProjectId()
      }
      if (this.$refs.collectionOfExpenses) {
        this.collectionGroupByMonth()
      }
      if (this.$refs.expirationOfContract) {
        this.expireDay()
      }
    },
    async getProjectId () {
      this.$emit('getProject', this.projectId)
      this.buildingId = ''
      this.followRecordDataSel = []
      this.followRecordData = {}
      let budid = await this.getBuliding()
      return budid
    },
    drawerClose () {
      this.detailsdrawershow = false
      this.incdDetailsdrawershow = false
    },
    loadMore () {
      this.tableHeight = true
      this.ckLoadMore = false
    },
    handleDetail (index, row) {
      context.http.get('/cms/api/tenant/' + row.id).then(res => {
        this.detailData = res.data
        this.detailsShow = true
      })
    },
    async handleEdit (index, row) {
      if (row.billCategory === 'DIVERSIFICATION') {
        let result = await context.http.get(`cms/api/bills/${row.id}`)
        this.builddetailsData = JSOG.decode(result.data)
        this.incdDetailsdrawershow = true
      } else {
        let result = await context.http.get(`cms/api/bills/${row.id}`)
        this.builddetailsData = JSOG.decode(result.data)
        this.detailsdrawershow = true
      }
    },
    async getBuliding () {
      if (!this.projectId) {
        this.options = []
        return
      }
      let result = await context.http.get('cms/api/buildings/newList', { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING', projectId: this.projectId })
      if (result.data.length === 0) {
        this.options = []
        return
      }
      this.options = result.data
      this.buildingId = this.options[0].id
      this.followRecord()
      return this.options[0].id
    },
    selectStep (index) {
      this.activeIndex = index
      if (index === 0) {
        this.followRecordDataSel = this.followRecordData[-1]
      } else if (index === 1) {
        this.followRecordDataSel = this.followRecordData[7]
      } else if (index === 2) {
        this.followRecordDataSel = this.followRecordData[15]
      } else {
        this.followRecordDataSel = this.followRecordData[30]
      }
    },
    rentalRate (seriesData) {
      let myChart = this.$echarts.init(document.getElementById('expirationOfContract'))
      myChart.clear()
      let option = {
        color: ['#860E50', '#D51C60', '#F06192', '#FFA8C6'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        title: {
          show: false,
          text: '总面积',
          subtext: '100000',
          x: '30%',
          y: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal',
            color: ['#333'],
            padding: [50, 10]
          },
          subtextStyle: {
            color: '#666',
            fontSize: 16
          }
        },
        legend: {
          orient: 'vertical',
          itemWidth: 20, // 标志图形的长度
          itemHeight: 10, // 标志图形的宽度
          right: '10%',
          top: 50,
          itemGap: 50,
          data: ['0～30天', '31～90天', '91～180天', '181～365天'],
          // formatter: function (name) {
          //   return 'Legend ' + name
          // }
          formatter: function (name) {
            var total = 0
            var target
            for (var i = 0, l = seriesData.length; i < l; i++) {
              total += seriesData[i].value
              if (seriesData[i].name === name) {
                target = seriesData[i].value
              }
            }
            let percentage = isNaN(target / total) ? 0 : (target / total)
            return name + '       ' + target + '  (' + ((percentage) * 100).toFixed(2) + '%' + ')'
          }
        },
        series: [
          {
            name: '合同到期日分析',
            type: 'pie',
            radius: ['50%', '65%'],
            center: ['35%', '45%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: seriesData
          }
        ]
      }
      myChart.setOption(option)
    },
    collection (seriesData) {
        // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('collectionOfExpenses'))
      myChart.clear()
        // 绘制图表
      var colors = ['#DD6243', '#54B0E8', '#62CA6D', '#66CEB5', '#9F88F3']
      let option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '10%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['应收金额', '已收金额', '欠收金额'],
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: '#DCDCDC', // 颜色
                width: 1 // 粗细
              }
            },
            axisLabel: {// x轴文字的配置
              show: true,
              textStyle: {
                color: '#666666'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            'axisLine': {       // y轴
              'show': false
            },
            'axisTick': {       // y轴刻度线
              'show': false
            },
            splitLine: {// 分割线配置
              show: true,
              lineStyle: {
                color: '#DCDCDC'
              }
            }
          }
        ],
        series: [
          {
            name: '',
            type: 'bar',
            barMaxWidth: '30',
            data: seriesData,
            itemStyle: {
              normal: {
                barBorderRadius: [4, 4, 0, 0],
                color: function (params) {
                  var colorList = ['#1A7BFF', '#56AAFF', '#56D9FF']
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    },
    collectionGroupByMonth () {
      let sjDatepicker = this.sjDatepicker ? this.sjDatepicker.substring(0, 7) : ''
      context.http.get(`/cms/api/reportColl/collectionGroupByMonth`, {projectId: this.projectId, dateStr: sjDatepicker}).then(res => {
        if (res.status === 200) {
          let collectionRate = [res.data.accountReceivable, res.data.accountActual, res.data.accountNoPay]
          this.collection(collectionRate)
        }
      })
    },
    expireDay () {
      context.http.get(`/cms/api/contracts/expireDay`, {projectId: this.projectId}).then(res => {
        if (res.status === 200) {
          let allContract = 0
          res.data.forEach(ele => {
            allContract += ele
          })
          this.allContract = allContract
          let seriesData = [{value: res.data[0], name: '0～30天'}, {value: res.data[1], name: '31～90天'}, {value: res.data[2], name: '91～180天'}, {value: res.data[3], name: '181～365天'}]
          this.rentalRate(seriesData)
        }
      })
    },
    followRecord () {
      context.http.get(`/cms/api/tenant/graph/followRecord`, {buildingId: this.buildingId}).then(res => {
        if (res.status === 200) {
          this.followRecordData = res.data
          this.followRecordDataSel = res.data[-1]
          this.activeIndex = 0
        }
      })
    },
    billsNow () {
      context.http.get(`/cms/api/bills/now`, {projectId: this.projectId, page: 0, size: 15, sort: 'finalPaymentDate,desc'}).then(res => {
        if (res.status === 200) {
          this.tableData = res.data
        }
      })
    },
    formatterBillStatus (row, column) {
      let res = ''
      if (row.billStatus === 'APPROVAL') {
        res = '减免审核中'
      } else if (row.billStatus === 'UPDATE') {
        res = '减免驳回待修改'
      } else if (row.billStatus === 'NO') {
        res = '未付款'
      } else if (row.billStatus === 'OK') {
        res = '已结清'
      } else if (row.billStatus === 'SECTION') {
        res = '部分结清'
      } else if (row.billStatus === 'STAY_SETTLE') {
        res = '待结清'
      }
      return res
    },
    affirmDialog (contractId, tenantId) {
      this.centerDialogVisible = true
      this.contractId = contractId
      this.tenantId = tenantId
    },
    detailsClose () {
      this.detailsShow = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .operation-module{
    display: flex;
    flex-wrap: wrap;
    >div {
      width: 100%;
    }
    .pj-search {
      background-color: #fff;
      margin: 10px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      .el-select{
        margin: 15px;
      }
      div {
        display: inline-block;
      }
    }
    .signing-tenants{
      margin-top: 10px;
      background-color: #fff;
      .table-height{
        height: auto!important;
      }
      .el-table{
        height: 223px;
        overflow: hidden;
      }
      .st-title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
        color: #333;
        font-weight: bold;
        font-size: 14px;
      }
      .st-footer{
        height: 50px;
        line-height: 50px;
        color: #3175F6;
        font-size: 14px;
        text-align: center;
        span {
          cursor: pointer;
        }
      }
    }
    .rental-rate{
      background-color: #fff;
      width: 49.6%;
      height: 400px;
      margin-top: 10px;
      span {
        display: inline-block;
        margin: 20px;
      }
      .datepicker{
        float: right;
      }
      .chart{
        height: 360px;
        position: relative;
        .all-area {
          position: absolute;
          bottom: 40px;
          left: 30%;
        }
      }
    }
    section:nth-of-type(2) {
      margin-left: 0.8%;
    }
    .follow-up-steps{
      float: left;
      width: 160px;
      margin: 40px 0 0 50px;
      position: relative;
      .stepactive{
        i {
          width: 10px;
          height: 10px;
          background:rgba(49,117,246,1);
          border: #3175F6;
          border-radius:50%;
        }
        span {
          color: #3175F6;
        }
      }
      .step__line{
        height: 50px;
        border-left: 1px solid #ccc;
        margin: 0;
        position: absolute;
        left: 4px;
        top: 16px;
      }
      > div {
        position: relative;
        height: 60px;
        i {
          display: inline-block;
          width: 10px;
          height: 10px;
          border: 1px solid #CCCCCC;
          border-radius: 50%;
        }
        span {
          cursor: pointer;
          margin: 0 0 0 20px;
        }
        &:last-child {
          .step__line {
            display: none;
          }
        }
      }
    }
    .section-title{
      color: #333;
      font-weight: bold;
      font-size: 14px;
    }
    .steps-content{
      float: left;
      margin-top: 20px;
      width: 60%;
      height: 300px;
      overflow-y: scroll;
      > div {
        margin-bottom: 20px;
        width: 100%;
        min-height: 100px;
        border:1px solid rgba(238,238,238,1);
        box-shadow:0px 2px 3px 0px rgba(190,199,208,0.2);
        border-radius:2px;
        p {
          border-left: 3px solid #3175F6;
          padding-left: 4px;
        }
        span {
          margin: 15px 20px 15px 10px;
          cursor: pointer;
          &:hover {
            color: #3175F6;
          }
        }
      }
    }
    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    .steps-content::-webkit-scrollbar {
      width: 4px;
      height: 4px;
      background-color: rgb(25, 38, 70);
    }
    /*定义滚动条轨道 内阴影+圆角*/
    .steps-content::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px #fff;
      border-radius: 10px;
      background-color: #fff;
    }
    /*定义滑块 内阴影+圆角*/
    .steps-content::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px #3175d2;
      background-color: 3175d2;
    }
  }
</style>
