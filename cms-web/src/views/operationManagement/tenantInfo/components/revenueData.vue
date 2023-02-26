<template>
  <div class="business-data">
    <div class="pl-content">
      <div class="clearfix"
           v-if="tenantDetail.tenantUse !== 'WORK'"
           style="display: flex;align-items: center;justify-content: space-between;">
        <div class="plc-search clearfix"
             style="flex: 1">
          <el-select v-model="parametId"
                     placeholder="征收项目"
                     @change="collectionProjectChange"
                     style="margin-right: 10px;">
            <el-option v-for="item in collectionProjectList"
                       :key="item.id"
                       :label="item.value"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-date-picker type="year"
                          class="screen"
                          value-format="yyyy"
                          :editable="false"
                          v-model="year"
                          @change="collectionProjectChange"
                          :clearable="false"
                          placeholder="时间">
          </el-date-picker>
          <div class="query-btn"
               style="height: 32px;line-height: 32px;width:70px;margin-right: 10px"
               @click="queryFn">查询</div>
          <div class="btnDiv"
               v-if="showType === 1">
            <el-button class="tban tban2"
                       @click="downLoadModel"><i class="iconfont icon-xiazai1"></i> 下载模版</el-button>
            <el-button class="tban tban5"
                       style="position: relative;"><i class="iconfont icon-cms_daorushuju-"></i> 导入税收数据
              <input type="file"
                     style="position: absolute;opacity: 0;left: 0;width: 110px;height: 35px;font-size: 0;top: -3px;cursor: pointer;"
                     @change="importModel($event)">
              <p class="shade"
                 v-if="isImport"
                 @click="affirmFn"></p>
            </el-button>
          </div>
        </div>
        <div class="changeBtnDiv">
          <span class="iconfont icon-liebiao401"
                :class="{'active':showType === 1}"
                title="展示表格"
                @click="changeShowType(1)"></span>
          <span class="iconfont icon-tubiao"
                :class="{'active':showType === 2}"
                title="展示柱状图"
                @click="changeShowType(2)"></span>
        </div>
      </div>
      <div class="clearfix"
           v-else
           style="display: flex;align-items: center;justify-content: space-between;">
        <div class="plc-search clearfix"
             style="flex: 1">
          <el-date-picker type="month"
                          class="screen"
                          value-format="yyyy-MM"
                          :editable="false"
                          v-model="startMonth"
                          :picker-options="pickerBeginDateBefore"
                          :clearable="true"
                          @change="changeStartMonth"
                          placeholder="开始时间">
          </el-date-picker>
          <span style="margin:0 15px; color: #afafaf"> - </span>
          <el-date-picker type="month"
                          class="screen"
                          value-format="yyyy-MM"
                          :editable="false"
                          v-model="endMonth"
                          :picker-options="pickerBeginDateAfter"
                          :clearable="true"
                          @change="changeEndMonth"
                          placeholder="结束时间">
                          <!-- @change="collectionProjectChange" -->
          </el-date-picker>
          <div class="query-btn"
               style="height: 32px;line-height: 32px;width:70px;margin-right: 10px"
               @click="getWorkData">查询</div>
          <div class="btnDiv"
               v-if="showType === 1">
            <el-button class="tban tban2"
                       @click="downLoadModel"><i class="iconfont icon-xiazai1"></i> 下载模版</el-button>
            <el-button class="tban tban5"
                       style="position: relative;"><i class="iconfont icon-cms_daorushuju-"></i> 导入税收数据
              <input type="file"
                     style="position: absolute;opacity: 0;left: 0;width: 110px;height: 35px;font-size: 0;top: -3px;cursor: pointer;"
                     @change="importModel($event)">
              <p class="shade"
                 v-if="isImport"
                 @click="affirmFn"></p>
            </el-button>
          </div>
        </div>
      </div>
      <div label="列表"
           v-if="showType === 1 && tenantDetail.tenantUse !== 'WORK'">
        <div class="plc-table details_table">
          <el-table :data="tableData"
                    style="width: 100%">
            <el-table-column prop="collectionProject"
                             label="征收项目"
                             align="center"></el-table-column>
            <!-- <el-table-column prop="collectionItem"
                             label="征收品目"
                             align="center"></el-table-column>
            <el-table-column label="税率 (%)"
                             align="center">
              <template slot-scope="scope">
                <div>{{scope.row.taxRate}}</div>
              </template>
            </el-table-column> -->
            <el-table-column label="日期"
                             align="center">
              <template slot-scope="scope">
                <div>{{scope.row.year}} - {{scope.row.month}}</div>
              </template>
            </el-table-column>
            <el-table-column label="纳税金额（元）"
                             :formatter="taxAmountFormat"
                             align="center"></el-table-column>
          </el-table>
        </div>
        <div class="ctc-foot"
             v-if="pager.total > 0">
          <span><span style="margin-right:10px">{{pager.currentPage}}/{{pager.totalPages}}页</span> 共{{pager.total}}条记录</span>
          <el-pagination background
                         v-if="pager.total > 0"
                         layout="prev, pager, next"
                         :page-size="pager.pgSize"
                         :total="pager.total"
                         :current-page="pager.currentPage"
                         @current-change="current_change">
          </el-pagination>
          <div class="pagingnum">
            显示 <select v-model="pager.pgSize"
                    @change="currentSel">
              <option v-for="item in pager.pgNumoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </option>
            </select>
            条目
          </div>
        </div>
      </div>
      <div label="图表"
           v-else-if="showType === 2 && tenantDetail.tenantUse !== 'WORK'">
        <div id="charts"
             class="chart"
             style="display:none;">
          <div id="drawLineEnergy"
               :style="{width: '100%', height: '90%'}"></div>
        </div>
        <div class="chart"
             v-show="!hasAmountOfBill">
          <div class="nodata">暂无数据</div>
        </div>
      </div>
      <div label="办公类型图表"
           v-else-if="tenantDetail.tenantUse === 'WORK'">
        <div id="charts2"
             class="chart"
             style="display:none;">
          <div id="drawLineEnergyChart"
               :style="{width: '100%', height: '90%'}"></div>
        </div>
        <div class="chart"
             v-show="!hasAmountOfBill">
          <div class="nodata">暂无数据</div>
        </div>
      </div>
    </div>
    <el-dialog title="提示"
               :visible.sync="centerDialogVisible"
               class="turnoverDialog"
               width="30%"
               center
               append-to-body>
      <span>该客户目前可能未租赁房源，是否继续导入</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <span class="UpBtn1">
          <i>确 定</i>
          <input type="file"
                 @change="importModel($event)"
                 id="imageChange">
        </span>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import * as JSOG from 'jsog'
import moment from 'moment'
import { toLocaleString } from '@/utils/validate.js'
export default {
  name: 'businessData',
  props: {
    tenantDetail: {
      type: Object,
      default: {
        tenantUse: ''
      }
    },
    tabActive: {
      type: Number,
      default: 0
    }
  },
  watch: {

  },
  data () {
    return {
      year: new Date(),
      totalDataNumber: 0,
      startMonth: moment(new Date()).add(-12, 'M').format('YYYY-MM'),
      endMonth: moment(new Date()).add(-1, 'M').format('YYYY-MM'),
      parametId: '',
      collectionProjectList: [],
      // ---------------------------
      hasAmountOfBill: false,
      showType: 1,
      bsEndDate: '',
      recordDate: [],
      condition: 'DAY',
      activeName: 'first',
      tableData: [],
      costTypeOptions: [],
      statusOptions: [],
      endTime: '',
      startTime: '',
      cost: '',
      billStatus: '',
      pageAmount: '',
      totalTurnover: '',
      pager: {
        currentPage: 1,
        totalPages: 1,
        pgNum: 1,
        total: 0,
        pgSize: 15,
        flowDetailsData: {},
        pgNumoptions: [
          {
            value: 15,
            label: '15'
          },
          {
            value: 30,
            label: '30'
          },
          {
            value: 50,
            label: '50'
          }
        ]
      },
      shopNameTabIndex: 0,
      contractId: '',
      isImport: false,
      centerDialogVisible: false,
      // endMonthTime: '',
      pickerBeginDateBefore: {
        disabledDate: time => {
          let endDateVal = this.endMonth
          if (endDateVal) {
            let temp = new Date(endDateVal).getTime() - 335 * 24 * 60 * 60 * 1000
            // return time.getTime() > new Date(endDateVal).getTime()
            return time.getTime() < new Date(temp).getTime() || time.getTime() > new Date(endDateVal).getTime()
          }
        }
      },
      pickerBeginDateAfter: {
        disabledDate: time => {
          let beginDateVal = this.startMonth
          if (beginDateVal) {
            let temp = new Date(beginDateVal).getTime() + 335 * 24 * 60 * 60 * 1000
            // return time.getTime() < new Date(beginDateVal).getTime()
            return time.getTime() > new Date(temp).getTime() || time.getTime() < new Date(beginDateVal).getTime()
          }
        }
      }
    }
  },
  created () {
    this.getCollectionProject(this.tenantDetail.id)
  },
  methods: {
    taxAmountFormat (row, column) {
      return toLocaleString(row.taxAmount)
    },
    changeStartMonth (e) {
      if (e && this.endMonth) {
        this.getWorkData()
      }
    },
    changeEndMonth (e) {
      if (e && this.startMonth) {
        this.getWorkData()
      }
    },
    queryFn () {
      if (this.showType === 1) {
        this.pager.currentPage = 1
        this.query()
      } else {
        this.getBusinessData()
      }
    },
    async query () {
      let year = this.year
      if (!year.length) {
        year = year.getFullYear()
      }
      let result = await context.http.get('/cms/api/tenantTax',
        {
          page: (this.pager.currentPage - 1),
          size: this.pager.pgSize,
          year: year,
          tenantId: this.tenantDetail.id,
          parametId: this.parametId
        }
      )
      this.tableData = result.data
      this.pager.total = Number(result.headers['x-total-count'])
    },
    current_change (currentPage) {
      this.pager.currentPage = currentPage
      this.query()
    },
    currentSel () {
      this.pager.currentPage = 1
      this.query()
    },
    handleClick (tab, event) {
      if (this.activeName === 'first') {
        this.$nextTick(() => {
        })
      } else if (this.activeName === 'second') {
        this.$nextTick(() => {
          // this.paymentAnalysis()
        })
      }
    },
    changeShowType (n) {
      this.showType = n
      if (n === 1) {
        this.query()
      } else {
        this.getBusinessData()
      }
    },
    getWorkData () {
      if (!this.startMonth || !this.endMonth) {
        this.$message.error('请选择起止时间')
        return
      }
      let parametId = ''
      this.collectionProjectList.forEach((item, index) => {
        parametId = parametId + item.id + ','
      })
      let startLocalDate = this.startMonth + '-01'
      let endLocalDate = this.endMonth + '-01'
      context.http.get('/cms/api/tenantTax/chart12Month', {
        parametIds: parametId.substring(0, parametId.length - 1),
        tenantId: this.tenantDetail.id,
        startLocalDate: startLocalDate,
        endLocalDate: endLocalDate
      }).then(res => {
        let charts2 = document.getElementById('charts2')
        if (res.status === 200 && res.data.length > 0) {
          charts2.style.display = 'block'
          this.hasAmountOfBill = true
          let dateArray = []
          let dataArray = []
          res.data.forEach(ele => {
            dateArray.push(Object.keys(ele)[0].substring(0, 7))
            dataArray.push(Object.values(ele)[0])
          })
          console.log(dateArray, dataArray)
          this.initChart(dateArray, dataArray)
        } else {
          charts2.style.display = 'none'
          this.hasAmountOfBill = false
        }
      })
    },
    initChart (dateArray, dataArray) {
      let totalData = 0
      dataArray.forEach(e => {
        totalData = e + totalData
      })
      this.totalDataNumber = totalData.toFixed(2)
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('drawLineEnergyChart'))
      myChart.clear()
      // 绘制图表
      var colors = ['#DD6243', '#54B0E8', '#62CA6D', '#66CEB5', '#9F88F3']
      let option = {
        title: {
          text: '期间税收合计：' + this.totalDataNumber + '（万元）'
        },
        color: colors,
        // tooltip: {
        //   trigger: 'axis',
        //   axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        //     type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        //   },
        //   formatter: function (params) {
        //     const item = params[0]
        //     // return item.axisValue + '<br>' + legendName + ':' + toLocaleString(item.data) + '元'
        //     return '元'
        //   }
        // },
        grid: {
          left: '1%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          x: 'right',
          y: 'top',
          bottom: '0',
          data: []
        },
        xAxis: [
          {
            type: 'category',
            data: dateArray,
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
              interval: 0,
              // rotate: 40,
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
            nameTextStyle: {
              color: '#666666'
            },
            position: 'left',
            scale: true,
            'axisLine': {       // y轴
              'show': true,
              lineStyle: {
                color: '#DCDCDC', // 颜色
                width: 1 // 粗细
              }
            },
            'axisTick': {       // y轴刻度线
              'show': false
            },
            splitLine: {// 分割线配置
              show: false,
              lineStyle: {
                color: '#DCDCDC'
              }
            },
            axisLabel: {
              show: false,
              textStyle: {
                color: '#666666'
              }
            }
          }
        ],
        series: [
          {
            type: 'bar',
            name: '66',
            barMaxWidth: '18',
            data: dataArray,
            itemStyle: {
              normal: {
                color: '#4C7AF1'
              }
            }
          },
          { // For shadow
            type: 'bar',
            barMaxWidth: '18',
            barGap: '-100%',
            barCategoryGap: '40%',
            data: dataArray,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: function (params) {
                    if (params) {
                      return params.data + '万元'
                    }
                  },
                  // 开启显示
                  position: 'top',
                  // 在上方显示
                  textStyle: { // 数值样式
                    color: '#666666',
                    fontSize: 12
                  }
                },
                color: 'rgba(0,0,0,0.02)'
              }
            },
            animation: false
          }
        ]
      }
      myChart.setOption(option)
    },
    drawLineEnergy (dateArray, dataArray) {
      const max = Math.max.apply(null, dataArray)
      var yMax = max
      var dataShadow = []
      for (var i = 0; i < dataArray.length; i++) {
        dataShadow.push(yMax)
      }
      let arr = this.collectionProjectList.filter(item => item.id === this.parametId)
      let legendName = arr[0].value
      console.log(arr, legendName)
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('drawLineEnergy'))
      myChart.clear()
      // 绘制图表
      var colors = ['#DD6243', '#54B0E8', '#62CA6D', '#66CEB5', '#9F88F3']
      let option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            const item = params[0]
            return item.axisValue + '<br>' + legendName + ':' + toLocaleString(item.data) + '元'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          x: 'right',
          y: 'top',
          bottom: '0',
          data: [legendName]
        },
        xAxis: [
          {
            type: 'category',
            data: dateArray,
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
              interval: 0,
              // rotate: 40,
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
            nameTextStyle: {
              color: '#666666'
            },
            position: 'left',
            scale: true,
            'axisLine': {       // y轴
              'show': true,
              lineStyle: {
                color: '#DCDCDC', // 颜色
                width: 1 // 粗细
              }
            },
            'axisTick': {       // y轴刻度线
              'show': true
            },
            splitLine: {// 分割线配置
              show: true,
              lineStyle: {
                color: '#DCDCDC'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#666666'
              }
            }
          }
        ],
        series: [
          {
            type: 'bar',
            name: legendName,
            barMaxWidth: '18',
            data: dataArray,
            itemStyle: {
              normal: {
                color: '#4C7AF1'
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    },
    getBusinessData () {
      let year = this.year
      if (!year.length) {
        year = year.getFullYear()
      }
      context.http.get('/cms/api/tenantTax/chart', {
        tenantId: this.tenantDetail.id,
        year: year,
        parametId: this.parametId
      }).then(res => {
        let charts = document.getElementById('charts')
        if (res.status === 200 && res.data.length > 0) {
          charts.style.display = 'block'
          this.hasAmountOfBill = true
          let dateArray = []
          let dataArray = []
          res.data.forEach(ele => {
            let time = ele.year + '.' + ele.month
            dateArray.push(time)
            dataArray.push(ele.taxAmount)
          })
          this.drawLineEnergy(dateArray, dataArray)
        } else {
          charts.style.display = 'none'
          this.hasAmountOfBill = false
        }
      })
    },
    async downLoadModel () {
      axios({ method: 'GET', url: '/cms/api/tenantTax-excel/file', responseType: 'blob' }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        let fileName = res.headers['content-disposition'].substring(20)
        fileName = decodeURI(fileName)
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(url)
      })
    },
    importModel (event) {
      let files = event.target.files
      let form = new FormData()
      form.append('file', files[0])
      form.append('tenantId', this.tenantDetail.id)
      let name = files[0].name
      let index = name.lastIndexOf('.')
      let type = name.substr(index + 1).toLowerCase()
      if (files[0].size > (1024 * 1024 * 20)) {
        this.$message({
          message: '文件大小不能超过20M',
          type: 'error'
        })
        return
      }
      if (index > 0 && type !== 'xlsx' && type !== 'xls') {
        this.$message({
          message: '格式错误，请上传xlsx、xls格式文件',
          type: 'error'
        })
      } else {
        context.http.post('/cms/api/tenantTax-excel/file', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          if (res.status === 200) {
            this.$emit('queryExportResult', res.data.id, false) // true代表经营数据 false税收数据
            // this.queryExportResult(res.data.id)
            event.target.value = ''
            if (this.tenantDetail.tenantUse === 'WORK' && this.startMonth && this.endMonth) {
              setTimeout(() => { this.getWorkData() }, 5000)
            }
          }
        }).catch(error => {
          event.target.value = ''
          console.info(error)
        })
      }
    },
    collectionProjectChange () {
      this.queryFn()
    },
    async getCollectionProject (tenantId) {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=征收项目')
      this.collectionProjectList = result.data
      if (this.tenantDetail.tenantUse !== 'WORK') {
        this.parametId = this.collectionProjectList[0].id
        this.query()
      } else {
        this.startMonth = moment(new Date()).add(-12, 'M').format('YYYY-MM')
        this.endMonth = moment(new Date()).add(-1, 'M').format('YYYY-MM')
        this.getWorkData()
      }
    },
    affirmFn () {
      this.centerDialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.business-data {
  .pl-content {
    width: 98%;
    margin: 0 auto;
    .plc-search {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      // height: 100px;
      // line-height: 100px;
      margin-bottom: 20px;
      background-color: #fff;
      padding-left: 5px;
      font-size: 14px;
      .el-input {
        width: 120px;
        input {
          height: 32px;
          line-height: 32px;
        }
        .el-input__prefix,
        .el-input__suffix {
          top: 10px;
        }
      }
      .screen {
        width: 140px;
      }
      div {
        // float: left;
        display: inline-block;
      }
      .swbtn {
        margin-left: 16px;
        font-size: 18px;
        width: 100px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        font-size: 18px;
        color: #000;
        background-color: #fff;
        margin-left: 16px;
        border-radius: 10px;
        cursor: pointer;
      }
      .btnselect {
        color: #fff;
        background-color: #42506c;
      }
      div {
        cursor: pointer;
      }
      .btnDiv {
        float: right;
        margin: 0 10px;
        span {
          display: inline-block;
          width: 90px;
          height: 34px;
          line-height: 34px;
          text-align: center;
          color: #ffffff;
          background-color: #78aa6f;
          margin-right: 15px;
          cursor: pointer;
          border-radius: 4px;
          &:last-child {
            background-color: #3577f6;
          }
        }
        .shade {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
      .switch-btn {
        display: inline-flex;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        margin-right: 10px;
        span {
          display: inline-block;
          width: 42px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          cursor: pointer;
          border-radius: 4px;
          &:first-child {
            border-right: none;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          }
          &:last-child {
            border-left: none;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
        }
      }
      .switch-select {
        background-color: #3577f6;
        color: #fff;
      }
    }
    .el-date-editor {
      .el-input__prefix,
      .el-input__suffix {
        top: 0 !important;
      }
    }
    .bd-statistics {
      background-color: #fff;
      margin-bottom: 10px;
      box-shadow: 1px 2px 5px #eee;
      .statistics-title {
        font-size: 14px;
        height: 30px;
        line-height: 30px;
        color: #333;
        font-weight: bold;
        padding-left: 20px;
        border-bottom: 1px solid #ededef;
      }
      .statistics-content {
        .contentItem {
          display: inline-block;
          padding: 20px 0 20px 20px;
        }
        .bd-number {
          margin-left: 6px;
          padding-right: 20px;
          font-size: 14px;
          font-weight: 400;
          font-family: PingFangSC;
          color: #353b4b;
          display: inline-block;
          min-width: 90px;
          .ci-title {
            font-weight: 400;
            height: 25px;
            line-height: 25px;
            color: #828692;
            font-size: 12px;
          }
          .ci-value {
            display: inline-block;
            font-size: 20px;
            margin-top: 4px;
          }
        }
        .borderstrip {
          width: 2px;
          height: 35px;
          background-color: #ecedef;
          display: inline-block;
          margin-top: 6px;
        }
      }
    }
    .plc-table {
      position: relative;
      border: none;
      .export {
        position: absolute;
        right: 20px;
        top: 5px;
        z-index: 9;
        span {
          display: inline-block;
          width: 60px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background: rgba(222, 235, 254, 1);
          color: #5b9af8;
          opacity: 0.9;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
    .plc-table-bottom {
      ul {
        height: 35px;
        background-color: #eff4fe;
        &:first-child {
          background-color: #fafbff;
        }
        li {
          display: inline-block;
          width: 30%;
          line-height: 35px;
          text-align: center;
          color: #262626;
          font-size: 14px;
          &:first-child {
            text-align: left;
            padding-left: 20px;
          }
        }
      }
    }
    .rent-control {
      border: 1px solid #96d050;
      background-color: #fff;
      color: #96d050;
      &:hover {
        background-color: #96d050;
        color: #fff;
      }
    }
    .editbtn {
      color: #3175d2;
      &:hover {
        color: #fff;
      }
    }
    .hourse_tab {
      height: 60px;
      display: flex;
      background-color: #fff;
      margin: 10px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      justify-content: space-between;
      align-items: center;
      padding-right: 44px;
      border-bottom: 1px solid #ecedef;
      .nav {
        display: flex;
        li {
          width: 160px;
          text-align: center;
          font-size: 14px;
          color: #666;
          height: 58px;
          line-height: 58px;
          border-bottom: 2px solid #fff;
          cursor: pointer;
          &.select_active {
            border-bottom: 2px solid #3175d2;
            color: #3175d2;
            font-weight: bolder;
          }
        }
      }
    }
    .el-textarea {
      width: 178px;
    }
    .shopNameTab {
      height: 40px;
      background-color: #fafafa;
      border: 1px solid #eeeeee;
      display: flex;
      justify-content: flex-start;
      span {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        text-align: center;
        padding: 0 8px;
        cursor: pointer;
        &.active {
          color: #ffffff;
          background-color: #3577f6;
        }
      }
    }
    .changeBtnDiv {
      margin-right: 5px;
      position: relative;
      top: -10px;
      span {
        margin-right: -5px;
        display: inline-block;
        width: 30px;
        height: 25px;
        font-size: 16px;
        background-color: #ffffff;
        border: 1px solid #eee;
        text-align: center;
        line-height: 25px;
        cursor: pointer;
        box-shadow: inset -1px -1px 3px #dadada;
        &:first-child {
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
        }
        &:last-child {
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
        }
        &.active {
          background-color: #f2f2f2ff;
        }
      }
    }
  }
  // .ctc-foot {
  //   background-color: #ffffff;
  //   display: flex;
  //   justify-content: space-between;
  //   padding: 60px 0 30px 20px;
  //   .el-pagination.is-background .el-pager li:not(.disabled).active {
  //     background-color: #2f3f48;
  //     color: #fff;
  //   }
  //   .el-pagination.is-background .el-pager li:not(.disabled):hover {
  //     color: #999;
  //   }
  // }
  // .pagingnum {
  //   font-size: 14px;
  //   text-align: center;
  //   color: #777;
  //   select {
  //     width: 70px;
  //     height: 28px;
  //     border-radius: 2px;
  //   }
  // }
  .query-btn {
    margin-left: 20px;
    margin-top: 0;
  }
  .turnoverDialog {
    .el-dialog--center .el-dialog__body {
      padding: 25px 25px 30px !important;
    }
  }
  .chart {
    width: 100%;
    height: 400px;
    background: #fff;
  }
  .nodata {
    color: #666;
    padding: 30px;
    text-align: center;
  }
  .ctc-foot {
    justify-content: normal;
    flex-direction: row-reverse;
    align-items: center;
    color: #3f5fbf;
    font-size: 12px;
    padding: 60px 20px 30px 20px;
    .pagingnum {
      color: #3f5fbf;
      font-size: 12px;
      select {
        width: 65px;
        height: 28px;
        border-radius: 2px;
        border-color: #f6f6f7;
        color: #3577f6;
      }
    }
    .el-pagination.is-background .btn-next,
    .el-pagination.is-background .btn-prev,
    .el-pagination.is-background .el-pager li {
      margin: 0 5px;
      background-color: transparent;
      color: #3f5fbf;
      min-width: 30px;
      border-radius: 2px;
      font-size: 14px;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      border-radius: 50%;
      background-color: #3f5fbf !important;
      color: #fff !important;
    }
  }
}
</style>
<style lang="scss">
.business-data {
  .cell {
    color: #262626;
  }
}
</style>

