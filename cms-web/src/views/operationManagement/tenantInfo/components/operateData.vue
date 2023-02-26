<template>
  <div class="business-data">
    <div class="pl-content">
      <div class="clearfix"
           style="display: flex;align-items: center;justify-content: space-between;">
        <div class="plc-search clearfix"
             style="flex: 1">
          <el-select v-model="quarter"
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
                       style="position: relative;"><i class="iconfont icon-cms_daorushuju-"></i> 导入经营数据
              <input type="file"
                     style="position: absolute;opacity: 0;left: 0;width: 110px;height: 35px;font-size: 0;top: -3px;cursor: pointer;"
                     @change="importModel($event)">
            </el-button>
          </div>
        </div>
      </div>
      <div label="图表">
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
    </div>
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import * as JSOG from 'jsog'
import { toLocaleString } from '@/utils/validate.js'
export default {
  name: 'businessData',
  props: {
    tenantDetail: {
      type: Object,
      default: {}
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
      quarter: 'businessIncome',
      collectionProjectList: [
        { value: '营业收入', id: 'businessIncome' },
        { value: '净利润', id: 'netProfit' },
        { value: '总资产', id: 'totalAssets' },
        { value: '净资产', id: 'netAssets' },
        { value: '净利率', id: 'netRate' },
        { value: '毛利率', id: 'grossRate' }
      ],
      // ---------------------------
      hasAmountOfBill: false,
      showType: 1
    }
  },
  created () {
    // this.getCollectionProject(this.tenantDetail.id)
    this.getBusinessData()
  },
  methods: {
    queryFn () {
      this.getBusinessData()
    },
    formatData (data) {
      if (this.quarter === 'netRate' || this.quarter === 'grossRate') {
        return data
      } else {
        return toLocaleString(data)
      }
    },
    drawLineEnergy (dateArray, dataArray) {
      let _this = this
      const max = Math.max.apply(null, dataArray)
      var yMax = max
      let arr = this.collectionProjectList.filter(item => item.id === this.quarter)
      let legendName = arr[0].value
      let unit = this.quarter === 'netRate' || this.quarter === 'grossRate' ? '%' : '元'
      // console.log(arr, legendName)
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
            return item.axisValue + '<br>' + legendName + ':' + _this.formatData(item.data) + unit
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        // legend: {
        //   x: 'right',
        //   y: 'top',
        //   bottom: '0',
        //   data: [legendName]
        // },
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
            min: 0,
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
      context.http.get('/cms/api/tenantBusiness/chart', {
        tenantId: this.tenantDetail.id,
        year: year
        // quarter: this.quarter
      }).then(res => {
        let charts = document.getElementById('charts')
        if (res.status === 200 && res.data.length > 0) {
          charts.style.display = 'block'
          this.hasAmountOfBill = true
          let dateArray = []
          let dataArray = []
          res.data.forEach(ele => {
            let time = ele.year + '-' + ele.quarter + '季度'
            dateArray.push(time)
            dataArray.push(ele[this.quarter])
          })
          this.drawLineEnergy(dateArray, dataArray)
        } else {
          charts.style.display = 'none'
          this.hasAmountOfBill = false
        }
      })
    },
    async downLoadModel () {
      axios({ method: 'GET', url: '/cms/api/tenantBusiness-excel/file', responseType: 'blob' }).then(res => {
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
        context.http.post('/cms/api/tenantBusiness-excel/file', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          if (res.status === 200) {
            this.$emit('queryExportResult', res.data.id, true) // true代表经营数据 false税收数据
            // this.queryExportResult(res.data.id)
            event.target.value = ''
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
      this.quarter = this.collectionProjectList[0].id
      this.getBusinessData()
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

