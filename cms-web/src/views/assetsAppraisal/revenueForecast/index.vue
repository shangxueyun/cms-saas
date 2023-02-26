<template>
  <div class="revenueForecast">
    <span class="page_head_title">资产评估</span>
    <div class="hourse_container">
      <ul class="default_tab_block">
        <li @click="changeNav(index)" v-if="hasAuthority(item.authority)" 
          v-for="(item, index) in navList" :key="index" :class="item.value ? 'active' : ''">
          <span>{{item.label}}</span>
        </li>
      </ul>
      <div v-show="assets">
        <div class="hourse_statistical">
          <div class="search-bar">
            <div>
              <span>
                <el-select v-model="projectManagementId" placeholder="项目" @change='getBuliding'>
                  <el-option
                    v-for="item in projectManagementsList"
                    :key="item.id"
                    :label="item.referred"
                    :value="item.id">
                  </el-option>
                </el-select>
              </span>
              <span>
                <el-select v-model="buildingId" placeholder="楼宇" @change='query'>
                  <el-option
                  v-for="item in options1"
                  :key="item.id"
                  :label="item.buildingName"
                  :value="item.id">
                  </el-option>
                </el-select>
              </span>
              <span>
                选择时间：<el-select v-model="dateValue" placeholder="请选择" @change="selectChange">
                          <el-option
                            v-for="item in dateOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
              </span>  
            </div>         
          </div>
          <div v-if="buildsList.length" class="search-bottom">
            <dl>
              <dt>选择楼宇：</dt>
              <dd v-for="(item, index) in buildsList" :key="index"><span>{{item.buildingName}}</span><span @click="deleBuild(index)" class="iconfont icon-jinakangbaoicons18"></span></dd>
            </dl>
          </div>
          <ul class="statistical_bot">
            <li>
              <p>目标</p>
              <p>{{tableData.revenueTargetAmount | toLocaleString}}</p>
            </li>
            <li>
              <p>应收</p>
              <p>{{tableData.ysAmount | toLocaleString}}</p>
            </li>
            <li>
              <p>已收</p>
              <p>{{tableData.sjAmount | toLocaleString}}</p>
            </li>
            <li>
              <p>预计目标完成率</p>
              <p>{{tableData.revenueRate | toLocaleString}}%</p>
            </li>
            <li>
              <p>目标已完成</p>
              <p>{{tableData.rate | toLocaleString}}%</p>
            </li>
          </ul>
        </div>
        <div class="hourse-table" style="height: 500px;">
          <div id="myChart" :style="{width: '100%', height: '80%'}"></div>
        </div>
      </div>
      <div id="ehContainer">
        <div class="hourse_statistical">
          <div class="search-bar">
            <div>
              选择时间：<el-select v-model="dateValue" placeholder="请选择" @change="selectChange">
                        <el-option
                          v-for="item in dateOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
            </div>
          </div>
          <div v-if="buildsList.length" class="search-bottom">
            <dl>
              <dt>选择楼宇：</dt>
              <dd v-for="(item, index) in buildsList" :key="index"><span>{{item.buildingName}}</span><span @click="deleBuild(index)" class="iconfont icon-jinakangbaoicons18"></span></dd>
            </dl>
          </div>
        </div>
        <div class="hourse-table" style="height: 500px;width: 100%">
          <div id="myRentChart" :style="{width: '100%', height: '80%'}"></div>
          <div class="hourse-table">
            <div class="table">
              <el-table :data="billsTableData" style="width: 100%">
                <el-table-column prop="projectManagement.referred" label="项目" align="center"></el-table-column>
                <el-table-column prop="rooms[0].building.buildingName" label="楼宇" align="center"></el-table-column>
                <el-table-column prop="feeType" label="费用类型" align="center" :formatter="formatterfeeType"></el-table-column>
                <el-table-column prop="amount" label="账单金额/元" align="center"></el-table-column>
                <el-table-column prop="billStatus" label="账单状态" align="center" :formatter="formatterBillStatus"></el-table-column>
                <el-table-column label="应收时间" align="center">
                  <template slot-scope="scope">
                    {{scope.row.finalPaymentDate}}
                  </template>
                </el-table-column>
                <el-table-column label="计费周期" align="center">
                  <template slot-scope="scope">
                    {{scope.row.startDate}}~{{scope.row.endDate}}
                  </template>
                </el-table-column>
                <el-table-column prop="referred" label="品牌" align="center"></el-table-column>
                <el-table-column prop="rooms[0].shopNumber" label="房源号" align="center"></el-table-column>
              </el-table>
            </div>
            <div class="ctc-foot1" v-if="billsTableData.length > 0">
              <span><span style="margin-right:10px">{{pager.currentPage}}/{{Math.ceil(pager.total/pager.pgSize)}}页</span> 共{{pager.total}}条记录</span>
              <el-pagination v-if="pager.total > 0"
                            background
                            layout="prev, pager, next"
                            :page-size="pager.pgSize"
                            :total="pager.total"
                            :current-page.sync="pager.currentPage"
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
        </div>
      </div>
    </div>
    <!-- <projectSidebar @hourseList="setpdleft" @buildsList="setBuildsList" @query="query" ref="projectSidebar"/> -->
  </div>  
</template>
<script>
import context from '@/service'
// import projectSidebar from '@/components/projectSidebar'
export default {
  name: 'housingList',
  components: {
    // projectSidebar
  },
  data () {
    return {
      projectManagementId: '',
      buildingId: '',
      projectManagementsList: [],
      options1: [],
      navList: [{label: '资产收益图', value: true, authority: '02060101'}, {label: '租金收益图', value: false, authority: '02060102'}],
      assets: true,
      dateValue: '',
      pager: {
        currentPage: 1,
        pgNum: 1,
        total: 0,
        pgSize: 15,
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
      dateOptions: [],
      tableData: '',
      billsTableData: [],
      hourseList: '',
      queryShopNumber: '',
      queryShopNumber_: '',
      buildsList: [],
      idsArray: [],
      rentYsAmount: [],
      rentSjAmount: [],
      dateArray: [],
      dateName: '',
      isAccepted: true
    }
  },
  created () {
    // this.projectManagementsList = this.$store.state.projectManagementsList
    this.getProjectOptions()
  },
  mounted () {
    // this.query(this.idsArray)
    let dateOptions = this.dateOptions
    let fullYear = new Date().getFullYear()
    let count = 0
    for (let i = 0; i < 11; i++) {
      dateOptions.push({value: fullYear + count, label: fullYear + count})
      count++
    }
    this.dateValue = dateOptions[0].value
    let dateArray = ['2019.01', '2019.02', '2019.03', '2019.04', '2019.05', '2019.06', '2019.07', '2019.08', '2019.09', '2019.10', '2019.11', '2019.12']
    this.drawLine(dateArray, [], [], [], 50000)
    if (!this.hasAuthority('02060101')) {
      this.changeNav(1)
    }
  },
  methods: {
    getProjectOptions () {
      context.http.get('cms/api/project-managements', { page: 0, size: 100, sort: 'desc', useStatus: 'USING' }).then(res => {
        if (res.status === 200) {
          this.projectManagementsList = res.data
          this.projectManagementId = this.$route.params.projectManagementId ? this.$route.params.projectManagementId : this.projectManagementsList[0].id
          this.getBuliding()
        }
      })
    },
    async getBuliding () { // 楼宇
      let result = await context.http.get('cms/api/buildings?sort=sortNumber,asc&sort=id,asc', { page: 0, size: 100, useStatus: 'USING', projectId: this.projectManagementId })
      if (result.data.buildingListDTOS && result.data.buildingListDTOS.length) {
        this.options1 = result.data.buildingListDTOS
        this.buildingId = this.options1[0].id
        this.query()
      }
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    changeNav (inx) {
      this.navList.forEach(item => {
        item.value = false
      })
      this.navList[inx].value = true
      if (inx === 0) {
        this.assets = true
        document.getElementById('ehContainer').style.display = 'none'
      } else if (inx === 1) {
        this.assets = false
        document.getElementById('ehContainer').style.display = 'block'
        let dateArray = ['2019.01', '2019.02', '2019.03', '2019.04', '2019.05', '2019.06', '2019.07', '2019.08', '2019.09', '2019.10', '2019.11', '2019.12']
        this.myRentChart(dateArray, [], [], 50000)
      }
      this.pager.currentPage = 1
      this.query(this.idsArray)
    },
    selectChange () {
      this.query(this.idsArray)
    },
    drawLine (dateArray, revenueTargetAmount, shishou, shouru, max) {
        // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      myChart.clear()
        // 绘制图表
      var colors = ['#96D050', '#3175D2', '#FF9500']
      let option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          top: '50px',
          left: '6%',
          right: '15px',
          bottom: '50px'
        },
        legend: {
          x: 'center',
          y: 'bottom',
          data: ['已收', '应收', '目标']
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            data: dateArray
            // data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '金额(元)',
            min: 0,
            position: 'left',
            // axisLine: {
            //   lineStyle: {
            //     color: colors[0]
            //   }
            // },
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '已收',
            type: 'bar',
            data: shishou
            // data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
          },
          {
            name: '应收',
            type: 'bar',
            data: shouru
            // data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
          },
          {
            name: '目标',
            type: 'line',
            data: revenueTargetAmount
            // data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          }
        ]
      }
      myChart.setOption(option)
    },
    myRentChart (dateArray, rentYsAmount, rentSjAmount, max) {
      let myChart = this.$echarts.init(document.getElementById('myRentChart'))
       // 1、清除画布
      myChart.clear()
      let option = {
        color: ['#5F627F', '#FF8081'],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          x: 'center',
          y: 'bottom',
          data: ['应收租金', '已收租金']
        },
        grid: {
          top: '50px',
          left: '6%',
          right: '15px',
          bottom: '50px'
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: dateArray
            // data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          }
        ],
        yAxis: [
          {
            min: 0,
            name: '金额(元)',
            type: 'value'
          }
        ],
        series: [
          {
            name: '应收租金',
            type: 'bar',
            triggerEvent: true,
            data: rentYsAmount
            // data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
          },
          {
            name: '已收租金',
            type: 'bar',
            data: rentSjAmount
            // data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
          }
        ]
      }
      myChart.setOption(option)
      // 3、在渲染点击事件之前先清除点击事件
      myChart.off('click')
      window.addEventListener('resize', () => { myChart.resize() })
      let _this = this
      myChart.on('click', function (params) {
        _this.pager.currentPage = 1
        _this.pager.total = 0
        let isAccepted = true
        if (params.seriesName === '应收租金') {
          isAccepted = false
        }
        _this.dateName = params.name
        _this.isAccepted = isAccepted
        _this.paramsName = params.name
        _this.queryBills(_this.idsArray, params.name, isAccepted)
      })
    },
    search () {
      this.pager.currentPage = 1
      this.queryShopNumber_ = this.queryShopNumber
      this.query(this.idsArray)
    },
    current_change (currentPage) {
      this.pager.currentPage = currentPage
      let name = this.dateName
      let isAccepted = this.isAccepted
      this.queryBills(this.idsArray, name, isAccepted)
    },
    deleBuild (index) {
      this.$refs.projectSidebar.deleBuild(index)
    },
    chooseSoread () {
      this.$refs.projectSidebar.chooseSoread(0, 0)
    },
    query (ids) {
      this.billsTableData = [] // 清空账单列表
      this.pager.currentPage = 1
      this.pager.total = 0
      if (!this.dateValue) {
        // this.$message.error('请选择年份')
        return
      }
      // if (!ids || ids.length === 0) {   //去掉侧边筛选栏  改为常规筛选 故备注掉此段代码
      //   return
      // }
      // let idArray = []
      // if (ids && ids.length > 0) {
      //   // this.pager.currentPage = 1
      //   idArray = ids
      // }
      // let typeArr = ''
      // idArray.forEach((item, index) => {
      //   if (index === idArray.length - 1) {
      //     typeArr += 'buildingId=' + item
      //   } else {
      //     typeArr += 'buildingId=' + item + '&'
      //   }
      // })

      // context.http.get(`/cms/api/buildingFinanceCounts/detail?` + typeArr, {year: this.dateValue}).then(res => {
      context.http.get(`/cms/api/buildingFinanceCounts/detail?projectManagementId=${this.projectManagementId}&buildingId=${this.buildingId}`, {year: this.dateValue}).then(res => {
        let dateArray = []
        let revenueTargetAmount = []
        let shishou = []
        let shouru = []
        let rentYsAmount = []
        let rentSjAmount = []
        let max = ''
        let ysmax = ''
        res.data.buildingFinanceCounts.forEach(ele => {
          // dateArray.push(ele.countDate.substring(5))
          dateArray.push((ele.countDate).substring(0, 7).replace('-', '.'))
          revenueTargetAmount.push(ele.revenueTargetAmount)
          shouru.push(ele.ysAmount)
          shishou.push(ele.sjAmount)
          // max = Math.max.apply(null, revenueTargetAmount)
          rentYsAmount.push(ele.rentYsAmount)
          rentSjAmount.push(ele.rentSjAmount)
          ysmax = Math.max.apply(null, rentYsAmount)
        })
        let allAry = [...revenueTargetAmount, ...shishou, ...shouru]
        let totalMax = Math.max.apply(null, allAry)
        if (dateArray.length === 0) {
          dateArray = ['2019.01', '2019.02', '2019.03', '2019.04', '2019.05', '2019.06', '2019.07', '2019.08', '2019.09', '2019.10', '2019.11', '2019.12']
          totalMax = 50000
        }
        this.drawLine(dateArray, revenueTargetAmount, shishou, shouru, totalMax)
        if (!this.assets) {
          if (!ysmax) {
            ysmax = 50000
          }
          this.myRentChart(dateArray, rentYsAmount, rentSjAmount, ysmax)
        }
        this.tableData = res.data
      })
    },
    setpdleft (val) {
      this.hourseList = val
    },
    setBuildsList (val) {
      this.buildsList = val
      let idsArray = []
      this.buildsList.forEach(ele => {
        idsArray.push(ele.id)
      })
      this.idsArray = idsArray
    },
    queryBills (ids, name, isAccepted) {
      let idArray = []
      if (ids && ids.length > 0) {
        // this.pager.currentPage = 1
        idArray = ids
      }
      let typeArr = ''
      idArray.forEach((item, index) => {
        if (index === idArray.length - 1) {
          typeArr += 'buildingId=' + item
        } else {
          typeArr += 'buildingId=' + item + '&'
        }
      })
      name = name.replace('.', '-')
      name = name + '-01'
      context.http.get(`/cms/api/bills/building?` + typeArr, {date: name, isAccepted: isAccepted, page: (this.pager.currentPage - 1), size: this.pager.pgSize, sort: 'desc'}).then(res => {
        this.billsTableData = res.data
        this.pager.total = Number(res.headers['x-total-count'])
      })
    },
    currentSel () {
      this.pager.currentPage = 1
      this.queryBills(this.idsArray, this.dateName, this.isAccepted)
    },
    formatterfeeType () {
      return '租金'
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
    }
  }
}
</script>
<style lang="scss">
@import "../../../style/config";

.revenueForecast {
  #ehContainer{
    display: none
  }
  ul, li{
    list-style: none;
  }
  .hourse_search .el-input .el-input__inner{
    width:180px;
    height:32px;
    line-height: 32px;
    position: absolute;
    left:0;
    top:0;
  }
  .hourse_statistical {
    .search-bar{
      margin-bottom: 0!important;
      box-shadow: none;
      border-bottom: 1px solid #ecedef;
      >div {
        font-size: 14px;
      }
    }
  }
    font-size: 16px;
    background-color: #f9f9f9;
    .hourse_container{
      background-color: #f9f9f9;
      .hourse_search{
        background-color: #fff;
        margin: 20px 0 0px 0;
        box-shadow:1px 2px 5px #eee;
        border-radius:3px;
        .search-top{
          border-bottom:1px solid #ecedef;
          padding-bottom:18px;
          padding-left:18px;
          .el-input {
            width:180px;
            height:32px;
            display:block;
            margin-top:18px;
          }
          div {
            float: left;
            display: inline-block;
          }
          div {
            cursor: pointer;
          }
        }
      }
      .hourse_statistical{
        background-color: #fff;
        margin: 10px 0 10px 0;
        box-shadow:1px 2px 5px #eee;
        border-radius:3px;
        .statistical_bot{
          padding:32px 30px 40px;
          display: flex;
          li{
            list-style: none;
            padding-right:45px;
            padding-left:20px;
            height:45px;
            border-right:1px solid #ecedef;
            &:first-child{
              padding-left:0;
            }
            &:last-child{
              border-right:0;
            }
            &:nth-child(3){
              border-right: 1px solid #ecedef;
              margin-right: 0;
            }
            p{
              color:#adadad;
              font-size: 14px;
              line-height: 14px;
              margin-top:-8px;
              &:last-child{
                color:#333;
                font-size: 20px;
                margin-top:30px;
              }
            }
          }
        }
      }
      .hourse_tab{
        height:60px;
        display: flex;
        background-color: #fff;
        margin: 10px 0 0px 0;
        box-shadow:1px 2px 5px #eee;
        border-radius:3px;
        justify-content: space-between;
        align-items: center;
        padding-right:44px;
        border-bottom:1px solid #ecedef;
        .nav{
          display: flex;
          li{
            width:160px;
            text-align: center;
            font-size: 14px;
            color:#666;
            height:58px;
            line-height: 58px;
            border-bottom: 2px solid #fff;
            cursor: pointer;
            &.select_active{
              border-bottom: 2px solid #3175d2;
              color:#3175d2;
              font-weight: bolder;
            }
          }
        }
      }
      .hourse-table{
        background-color: #fff;
        margin: 10px 0 0px 0;
        box-shadow:1px 2px 5px #eee;
        border-radius:3px;
        .page{
          background-color: #ffffff;
          display: flex;
          justify-content: space-between;
          padding: 60px 30px 30px 30px;
          .el-pagination.is-background .el-pager li:not(.disabled).active {
            background-color: #2f3f48;
            color: #fff;
          }
          .el-pagination.is-background .el-pager li:not(.disabled):hover {
            color: #999;
          }
          .pagingnum {
            font-size: 14px;
            text-align: center;
            color: #777;
            select {
              width: 70px;
              height: 28px;
              border-radius: 2px;
            }
          }
        }
      }
    }
    .addHourse{
      .el-dialog {
        width: 1000px;
        margin-top: 8vh!important;
      }
      .basicInfo{
        border:1px solid #f1f1f1;
        margin:15px 0;
        h5{
          height:40px;
          background: #fafafa;
          line-height: 40px;
          padding:0 15px;
          font-size: 14px;
          color:#666666;
        }
        .basic-content{
          display: flex;
          justify-content: space-between;
          padding:15px;
          .basic-item{
            width:46%;
            p{
              font-size: 14px;
              color:#333;
              line-height: 14px;
              margin-bottom:15px;
            }
            .basic-select{
              position: relative;
              cursor: pointer;
              .selectInput{
                height:110px;
                border:1px solid #e7e7e7;
                border-radius:5px;
                padding:0 15px;
                &.selectActive{
                  border:1px solid #6473cb;
                }
                img{
                  float: left;
                  display: block;
                  width:150px;
                  height:80px;
                  margin-right:10px;
                  margin-top:15px;
                }
                span{
                  float: left;
                  color:#666666;
                  display: block;
                  line-height: 110px;
                  &.over-hiden{
                    width:180px;
                    white-space: nowrap;
                    word-break: break-all;
                    text-overflow:ellipsis;
                    overflow:hidden;
                  }
                  &:last-child{
                    float: right;
                    color: #6473cb;
                  }
                }
              }
              .selectBox{
                width:100%;
                border:1px solid #e7e7e7;
                border-radius: 3px;
                background: #fff;
                position: absolute;
                left:0;
                top:115px;
                z-index: 9;
                padding:15px 0px;
                box-shadow: 1px 2px 5px #ddd;
                height:210px;
                overflow-y: auto;
                li{
                  border-bottom:1px solid #e7e7e7;
                  padding:10px 15px;
                  display: flex;
                  &:hover{
                    background: #eee;
                  }
                  img{
                    display: block;
                    width:50px;
                    height:21.3px;
                    margin-right:20px;
                  }
                  span{
                    display: block;
                    line-height: 20px;
                    font-size: 14px;
                  }
                }
              }
            }
          }
        }
      }
      .associatedInfo{
        border:1px solid #f1f1f1;
        margin:15px 0;
        h5{
          height:40px;
          background: #fafafa;
          line-height: 40px;
          padding:0 15px;
          font-size: 14px;
          color:#666666;
        }
        .form{
          padding:10px 0px 10px 15px;
          .el-form-item {
            width:265px;
            margin-right:30px;
            margin-bottom:10px;
            display: inline-block;
            &:nth-child(4),&:nth-child(5),&:nth-child(6),&:nth-child(7){
              width:415px;
            }
            &:nth-child(8){
              width:865px;
            }
            .el-form-item__content{
              line-height: 30px;
            }
            .el-select{
              width:100%;
            }
            .form-box{
              display: flex;
              justify-content: space-between;
              .el-input{
                width:300px;
              }
              .el-select{
                width:100px;
                .el-input{
                  width:100px;
                }
              }
            }
          }
          .addLabel{
            border:1px solid #dcdfe6;
            padding:10px;
            border-radius: 4px;
            input{
              width:100px;
              height:25px;
              display: block;
              float: left;
            }
            p{
              float: left;
              margin-right:15px;
              margin-bottom:20px;
              height:25px;
              padding:0 0px 0 6px;
              background: #3577f6;
              color:#fff;
              line-height: 25px;
              display: flex;
              border-radius: 4px;
              span{
                display: block;
                font-size: 12px;
                &:last-child{
                  width:25px;
                  height:25px;
                  text-align: center;
                  cursor: pointer;
                }
              }
            }
          }
        }
      }
    }
  .search-bottom{
    padding-left:18px;
    padding:20px 18px 20px;
    border-bottom: 1px solid #ecedef;
    dl{
      display: flex;
      font-size: 12px;
      line-height: 18px;
      dt{
        color:#333333;
      }
      dd{
        display: flex;
        color:#666;
        margin-right:16px;
        span{
          display: block;
          &:first-child{
            margin-right:5px;
          }
          &:last-child{
            font-size: 18px;
            cursor:pointer;
          }
        }
      }
    }
  }
  @keyframes cloud-in{
      0% {
        padding-right:0;
      }
      100%{
        padding-right:350px;
      }
    }
    @keyframes cloud-in2{
      0%{
        padding-right:350px;
      }
      100%{
        padding-right:0;
      }
    }
  .paddingLeft{
    animation: cloud-in .2s 0s ease-out forwards;
  }
  .paddingRight{
    animation: cloud-in2 .2s 0s ease-out forwards;
  }
}
</style>
