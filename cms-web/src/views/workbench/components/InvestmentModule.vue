<template>
  <div class="investment-module">
    <div class="pj-search"  v-if="anchorList.includes(5) || anchorList.includes(6) || anchorList.includes(7) || anchorList.includes(8)">
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
    <!-- <div class="signing-tenants" v-if="isOnSubscribe('5')" ref="yxTenant">
      <div class="st-title">
        意向客户
      </div>
      <el-table :data="yxTenantData" style="border:1px solid #eee" :class="{'table-height': tableHeightYxTenant}">
        <el-table-column  prop="projectName" label="项目" align="center"></el-table-column>
        <el-table-column  prop="customerType" label="客户类型" align="center" :formatter="customerTypeFormat"></el-table-column>
        <el-table-column  label="客户名称" align="center">
          <template slot-scope="scope">
            {{scope.row.tenantName}}
          </template>
        </el-table-column>
        <el-table-column  label="品牌名称" align="center" >
          <template slot-scope="scope">
            {{scope.row.referred}}
          </template>
        </el-table-column>
        <el-table-column label="业态" align="center" >
          <template slot-scope="scope">
            {{scope.row.industry}}
          </template>
        </el-table-column>
        <el-table-column  label="需求面积" align="center" >
          <template slot-scope="scope">
            {{scope.row.lowArea}} ~ {{scope.row.highArea + 'm²'}}
          </template>
        </el-table-column>
        <el-table-column  label="心理价位" align="center" >
          <template slot-scope="scope">
            {{scope.row.lowPrice}} ~ {{scope.row.highPrice + '元/m²·天'}}
          </template>
        </el-table-column>
        <el-table-column  label="联系人/联系电话" align="center" >
          <template slot-scope="scope">
            {{scope.row.contact}} / {{scope.row.telephone}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleYx(scope.$index, scope.row)" class="el-button--primary operation-btn" size="mini" >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="st-footer" v-if="yxTenantData && yxTenantData.length > 4">
        <span @click="loadMoreYxTenant" v-if="!tableHeightYxTenant">点击加载更多 ></span>
        <span v-else>
          <router-link :to="{ path: 'potlClients', query: {projectId: this.projectId}}">点击浏览更多 ></router-link>
          <span @click="loadMoreYxTenantData">点击浏览更多 ></span>
        </span>
      </div>
    </div> -->
    <div class="signing-tenants" v-if="isOnSubscribe('6')" ref="noRentShop">
      <div class="st-title">
        未租房源
      </div>
      <el-table :data="noRentShopData" style="border:1px solid #eee" :class="{'table-height': tableHeightRentShop}">
        <el-table-column  prop="projectName" label="项目" align="center"></el-table-column>
        <el-table-column  prop="buildingName" label="楼宇" align="center"></el-table-column>
        <el-table-column  label="楼层" align="center">
          <template slot-scope="scope">
            {{scope.row.floorName}}
          </template>
        </el-table-column>
        <el-table-column  label="房源号" align="center" >
          <template slot-scope="scope">
            {{scope.row.roomsNo}}
          </template>
        </el-table-column>
        <el-table-column label="报价" align="center" >
          <template slot-scope="scope">
            {{scope.row.expectedUnitPrice}}
          </template>
        </el-table-column>
        <el-table-column  label="建筑面积" align="center" >
          <template slot-scope="scope">
            {{scope.row.buildingArea}}
          </template>
        </el-table-column>
        <el-table-column  label="使用面积" align="center" >
          <template slot-scope="scope">
            {{scope.row.useArea}}
          </template>
        </el-table-column>
        <el-table-column  label="得房率" align="center" >
          <template slot-scope="scope">
            {{scope.row.areaRate}}
          </template>
        </el-table-column>
        <el-table-column  label="预期业态" align="center" >
          <template slot-scope="scope">
            {{industry(scope.row.industry)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.$index, scope.row)" class="el-button--primary operation-btn" size="mini" >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="st-footer" v-if="noRentShopData && noRentShopData.length > 4">
        <span @click="loadMoreRentShop" v-if="!tableHeightRentShop">点击加载更多 ></span>
        <span v-else @click="loadMoreSigningTenants">点击浏览更多 ></span>
      </div>
    </div>

    <!-- <div class="collection-expenses" v-if="isOnSubscribe('8')" ref="investmentDemand">
      <span>招商需求面积分析</span>
      <div class="chart">
        <div id="investmentDemand" :style="{width: '100%', height: '90%'}"></div>
      </div>
    </div> -->
    <!-- <div class="rental-rate" v-if="isOnSubscribe('7')" ref="berthProportion">
      <span>房源单价占比</span>
      <div class="chart">
        <div id="berthProportion" :style="{width: '100%', height: '100%'}"></div>
        <div class="all-area">合约房源总数：{{allBerth}}</div>
      </div>
    </div> -->
    <!-- <el-dialog title="跟进"  width="1050px" :visible.sync="addProgressFrom" class="addProgressFrom">
      <el-form class="form1" :model="followRecordDTOParams" ref="followRecordDTOParams" :rules="addProgressRules">
        <div class="content">
          <div class="item">
            <span>跟进时间<i>*</i></span>
            <el-form-item prop="followTime">
              <el-date-picker
                v-model="followRecordDTOParams.followTime"
                value-format="yyyy-MM-ddTHH:mm:ss.000Z"
                style="width:300px"
                type="datetime"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="item">
            <span>跟进记录<i>*</i></span>
            <el-form-item prop="followContent">
              <el-input type="textarea" :rows="5" resize="none" style="width:100%" maxlength="200" placeholder="200字以内" v-model="followRecordDTOParams.followContent"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="记录报价" name="1">
                <div class="storeInfo">
                  <span class="title">房源信息</span>
                  <div class="content">
                    <div class="project">
                      <p style="font-size: 16px;font-weight: bold;">{{building.projectManagementName}}</p>
                      <div class="collapse">
                        <el-collapse v-model="activeName" accordion>
                          <el-collapse-item v-for="(item,index) in building.projectRoomsSecondDTOList" :key="index" :title="item.buildingName" :name="index+1">
                            <div>
                              <el-checkbox-group v-model="followRecordDTOParams.rooms">
                                <el-checkbox v-for="(itm,idx) in item.roomsDTOList" :label="itm" :key="idx">
                                  <span v-if="itm.floor">{{itm.floor.name}}层</span>
                                  <span>{{itm.shopNumber}}</span>
                                  <span>{{itm.buildingArea}}m²</span>
                                </el-checkbox>
                              </el-checkbox-group>
                            </div>
                          </el-collapse-item>
                        </el-collapse>
                      </div>
                    </div>
                    <div class="offer">
                      <div class="item">
                        <span>报价</span>
                        <div>
                          <el-input v-model="followRecordDTOParams.price" style="width: 250px;margin-right: 20px;"></el-input>
                          <el-select v-model="followRecordDTOParams.priceUnit" style="width:120px">
                            <el-option v-for="(item,index) in options3" :key="index" :label="item.label" :value="item.value"></el-option>
                          </el-select>
                        </div>
                      </div>
                      <div class="item">
                        <span>租赁年限</span>
                        <div>
                          <el-select style="width: 250px" v-model="followRecordDTOParams.leaseYear">
                            <el-option v-for="(item,index) in yearsList" :key="index" :label="item" :value="item"></el-option>
                          </el-select>
                          <span style="margin:10px 10px">年</span>
                        </div>
                      </div>
                      <div class="item">
                        <span>递增</span>
                        <div>
                          <el-input v-model="followRecordDTOParams.increment" style="width: 250px"></el-input>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div>
            <div class="enclosure" style="width:100%">
              <div class="enclosure-head">附件
                <div class="upload"> 上传附件 <input type="file" @change="imageChange('addFlowList', $event)"></div>
              </div>
              <div class="enclosure-list" v-for="(item, index) in followRecordDTOParams.annexes" :key="index">
                <div class="el-item">
                  <span>{{item.annexName}}</span>
                  <span v-if="item.annexName">
                    <i @click="downloadFile(item, index)" class="iconfont icon-xiazaidaoru" style="margin-right: 10px;"></i>
                    <i @click="deleFile(item, index,'flow')" class="iconfont icon-lajixiang"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div slot="footer" class="dialog-footer" style="display:flex;flex-direction:row-reverse">
            <el-button type="primary" style="margin-left:20px" @click="addFlowList">确 认</el-button>
            <el-button @click="addProgressFrom=false">关 闭</el-button>
          </div>
        </div>
      </el-form>
    </el-dialog> -->
    <!-- 意向客户详情 -->
    <!-- <pot-clien-dtl
        :detailsdrawershow="detailsShow"
        :yxkhFrom="yxkhFrom"
        :options2="projectOptions"
        :pageType="pageType"
        :draweDetaileData ="detaileData"
        :timeLineListData="timeLineListData"
        :isAllYXtenant="isAllYXtenant"
        :project="project"
        ref="potClienDtl"
        @addProgressFn="addProgressFn"
        @refreshList="refreshList"
        @drawerClose="detailsClose"></pot-clien-dtl>  -->
    <!-- 房源详情 -->
    <store-detailis
      :detailsdrawershow="storeDetailisShow"
      :detailData="storeDetailisData"
      :options1="projectOptions"
      ref="storeDetailis"
      @drawerClose="storeDetailisHide"
      @query="queryBerth"></store-detailis>
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
// import potClienDtl from '@/views/financialManagement/mnangement/potlClientsList/components/potClienDtl'
import storeDetailis from '@/views/project/housingList/components/storeDetailis'
export default {
  name: 'InvestmentModule',
  props: ['projectIdSelected', 'anchorList', 'projectOptions'],
  components: {
    potClienDtl,
    storeDetailis
  },
  data () {
    return {
      tableHeightYxTenant: false,
      tableHeightRentShop: false,
      storeDetailisShow: false,
      addProgressFrom: false,
      activeNames: ['1'],
      activeName: 1,
      yearsList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      yearsListId: '',
      options3: [
        {label: '元/m²·天', value: 'M2DAYS'},
        {label: '元/月', value: 'M2MONTH'}
      ],
      storeDetailisData: {
        imgUrls: [],
        projectManagement: {
          projectName: ''
        },
        building: {},
        floor: {}
      },
      building: {}, // 房源房源信息
      allBerth: '',
      projectId: '',
      yxTenantData: [],
      noRentShopData: [],
      datepicker: '',
      detailsShow: false,
      isAllYXtenant: false,
      detaileData: {
        projectManagementDTO: {},
        projectConditions: []
      },
      yxkhFrom: '',
      pageType: 'readOnly',
      timeLineListData: '', // 时间轴数据,
      yxTenantDTOStorage: '', // 意向客户信息
      project: [], // 工程条件列表
      followRecordDTOParams: {// 新增跟进记录入参
        annexes: [],
        followContent: '',
        followTime: '',
        price: '', // 心理价位
        priceUnit: 'M2DAYS', // 价格单位
        leaseYear: '', // 租赁年限
        increment: '', // 递增
        rooms: [],
        yxTenantDTO: ''
      },
      addProgressRules: {
        followTime: [
          { required: true, message: '请填写跟进时间', trigger: 'change' }
        ],
        followContent: [
          { required: true, message: '请填写跟进记录', trigger: 'change' }
        ]
      },
      addParmas: {
        projectManagementDTO: '', // 项目ID
        customerType: 'COMPANY', // 意向客户类型*
        yxTenantName: '', // 企业名称/姓名
        referred: '', // 品牌名称
        industryId: '', // 行业ID
        industryName: '', // 行业名
        lowArea: '', // 需求面积小
        highArea: '',
        lowPrice: '', // 心理价位小
        highPrice: '',
        priceUnit: 'M2DAYS', // 价格单位
        signDate: '', // 预计开店时间
        contact: '', // 联系人
        telephone: '', // 联系电话
        customerSource: '', // 客户来源
        customerSourceId: '', // 客户来源id
        remark: '', // 客户备注
        annexes: [ // 附件
        ],
        projectConditions: [ // 工程条件   projectType工程类型 (KWH用电量, SWWER排污水, WASTE_WATER排废水, FEED_WATER给水, AIR_CONDITION空调, OIL_DIAIN排油, FLUE烟道, CAS燃气)
          // {projectType: '', needValue: ''}
        ]
      }
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
    this.customerSource()
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
    loadMoreSigningTenants () {
      this.$emit('menuActiveIndex', '2-1')
      this.$router.push({name: 'housingList', params: {projectId: this.projectId}})
    },
    loadMoreYxTenantData () {
      this.$emit('menuActiveIndex', '2-2')
      this.$router.push({name: 'potlClients', params: {projectId: this.projectId}})
    },
    queryBerth () {},
    storeDetailisHide () {
      this.storeDetailisShow = false
    },
    async customerSource () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=客户来源')
      this.yxkhFrom = result.data
    },
    loadMoreYxTenant () {
      this.tableHeightYxTenant = true
    },
    loadMoreRentShop () {
      this.tableHeightRentShop = true
    },
    search () {
      if (this.$refs.yxTenant) {
        this.getIntentionalCustomer()
        this.getProjectList()
      }
      if (this.$refs.noRentShop) {
        this.getNoRentShop()
      }
      if (this.$refs.berthProportion) {
        this.contractPrice()
      }
      if (this.$refs.investmentDemand) {
        this.getAreaAnalysis()
      }
    },
    customerTypeFormat (row, column) {
      if (row.customerType === 'PERSONAL') {
        return '个人'
      } else if (row.customerType === 'COMPANY') {
        return '企业'
      }
    },
    industry (state) {
      if (state === 'LIFE') {
        return '生活配套'
      } else if (state === 'FOOD') {
        return '餐饮'
      } else if (state === 'RETAIL') {
        return '零售'
      } else if (state === 'BDUCATION') {
        return '亲子教育'
      } else if (state === 'CSE') {
        return '娱乐'
      } else if (state === 'FINANCIAL') {
        return '金融'
      } else if (state === 'REALESTATE') {
        return '房地产'
      } else if (state === 'SERVICE') {
        return '其他'
      }
    },
    getProjectId () {
      this.$emit('getProject', this.projectId) // 触发事件
    },
    rentalRate () {
      let myChart = this.$echarts.init(document.getElementById('myChart3'))
      myChart.clear()
      let data = [
                {value: 335, name: '已租'},
                {value: 310, name: '未租'}
      ]
      let option = {
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
          right: 150,
          top: 120,
          itemGap: 50,
          data: ['已租', '未租'],
          // formatter: function (name) {
          //   return 'Legend ' + name
          // }
          formatter: function (name) {
            var total = 0
            var target
            for (var i = 0, l = data.length; i < l; i++) {
              total += data[i].value
              if (data[i].name === name) {
                target = data[i].value
              }
            }
            return name + '       ' + target + '  (' + ((target / total) * 100).toFixed(2) + '%' + ')'
          }
        },
        series: [
          {
            name: '出租率',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['35%', '50%'],
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
            data: [
                {value: 335, name: '已租'},
                {value: 310, name: '未租'}
            ]
          }
        ]
      }
      myChart.setOption(option)
    },
    contractPrice () {
      context.http.get(`/cms/api/rooms/contractPrice?projectId=${this.projectId}`).then(res => {
        if (res.status === 200) {
          let allBerth = 0
          res.data.forEach(ele => {
            allBerth += ele
          })
          this.allBerth = allBerth
          let seriesData = [{value: res.data[0], name: '0~2元／m²·天'}, {value: res.data[1], name: '2~3元／m²·天'},
          {value: res.data[2], name: '3~4元／m²·天'}, {value: res.data[3], name: '4~5元／m²·天'}, {value: res.data[4], name: '5~6元／m²·天'},
          {value: res.data[5], name: '6~7元／m²·天'}, {value: res.data[6], name: '7元／m²·天以上'}]
          this.formatAnalysis(seriesData)
        }
      })
    },
    formatAnalysis (data) {
      let myChart = this.$echarts.init(document.getElementById('berthProportion'))
      myChart.clear()
      let option = {
        color: ['#014B42', '#285A14', '#227C1E', '#558A2E', '#7DB244', '#AED581', '#D1F1AC'],
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
            fontSize: 12,
            fontWeight: 'normal',
            color: ['#333'],
            padding: [50, 10]
          },
          subtextStyle: {
            color: '#666',
            fontSize: 12
          }
        },
        legend: {
          orient: 'vertical',
          itemWidth: 20, // 标志图形的长度
          itemHeight: 10, // 标志图形的宽度
          right: '8%',
          top: 50,
          itemGap: 20,
          data: ['0~2元／m²·天', '2~3元／m²·天', '3~4元／m²·天', '4~5元／m²·天', '5~6元／m²·天', '6~7元／m²·天', '7元／m²·天以上'],
          // formatter: function (name) {
          //   return 'Legend ' + name
          // }
          formatter: function (name) {
            var total = 0
            var target
            for (var i = 0, l = data.length; i < l; i++) {
              total += data[i].value
              if (data[i].name === name) {
                target = data[i].value
              }
            }
            let percentage = isNaN(target / total) ? 0 : (target / total)
            return name + '       ' + target + '  (' + ((percentage) * 100).toFixed(2) + '%' + ')'
          }
        },
        series: [
          {
            name: '房源单价占比',
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
                  fontSize: '24',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: data
          }
        ]
      }
      myChart.setOption(option)
    },
    collection (seriesData) {
        // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('investmentDemand'))
      myChart.clear()
        // 绘制图表
      let option = {
        color: ['#568FFF'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['0~50', '50~100', '100~150', '150~200', '200~250', '250~300', '300~400', '400~500', '500~600', '600~700', '700~800', '800~1000', '1000~1200', '1200~1500', '1500以上'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '数量',
            type: 'bar',
            barMaxWidth: '30',
            data: seriesData,
            itemStyle: {
              normal: {
                barBorderRadius: [4, 4, 0, 0]
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    },
    getIntentionalCustomer () {
      context.http.get(`/cms/api/staging/yxTenant/${this.projectId}`).then(res => {
        if (res.status === 200) {
          this.yxTenantData = res.data
        }
      })
    },
    getNoRentShop () {
      context.http.get(`/cms/api/staging/wzRooms/${this.projectId}`).then(res => {
        if (res.status === 200) {
          this.noRentShopData = res.data
        }
      })
    },
    getAreaAnalysis () {
      context.http.get(`/cms/api/staging/yxTenantArea/${this.projectId}`).then(res => {
        if (res.status === 200) {
          let seriesData = [ res.data.zero, res.data.fifty, res.data.onehundred, res.data.onehundredfifty, res.data.twohundred, res.data.twohundredfifty, res.data.threehundred, res.data.fourhundred, res.data.fivehundred, res.data.sixhundred, res.data.sevenhundred, res.data.eighthundred, res.data.onethousand, res.data.onethousandtwohundred, res.data.onethousandfivehundred ]
          this.collection(seriesData)
        }
      })
    },
    handleEdit (index, row) {
      context.http.get('/cms/api/rooms/' + row.id).then(res => {
        this.storeDetailisData = res.data
        this.storeDetailisShow = true
      })
    },
    handleYx (index, row) {
      context.http.get(`cms/api/yxTenant/${row.id}`).then(res => {
        if (res) {
          this.followRecordDTOParams.yxTenantDTO = row
          this.yxTenantDTOStorage = row
          if (row.projectManagementDTO) {
            this.projectId = row.projectManagementDTO.id // 此条记录的项目id
          }
          this.pageType = 'readOnly'
          this.detaileData = res.data
          context.http.get(`cms/api/followRecords/${row.id}`).then(result => {
            this.timeLineListData = result.data
            this.detailsShow = true
          })
        }
      })
    },
    addProgressFn () { // 打开写进度弹窗
      this.getRooms(this.projectId) // 新增更近记录页面项目房源信息
    },
    async getRooms (id) {
      let res = await context.http.get('/cms/api/rooms/projectManagement?projectManagementId=' + id)
      this.building = res.data
      this.addProgressFrom = true
    },
    refreshList () {
      context.http.get(`cms/api/yxTenant/${this.detaileData.id}`).then(res => {
        if (res) {
          this.detaileData = res.data
        }
      })
    },
    detailsClose () {
      this.detailsShow = false
    },
    getProjectList () { // 获取工程条件列表
      context.http.get('uaa/api/paramet-managements/name?name=工程条件').then(res => {
        this.project = res.data
        for (let i = 0; i < this.project.length; i++) {
          this.$set(this.project[i], 'isChecked', false)
          this.$set(this.project[i], 'needValue', null)
        }
        // console.log(this.project)
      }).catch(error => {
        console.info(error)
      })
    },
    addFlowList () { // 新增更近记录
      this.$refs['followRecordDTOParams'].validate((valid) => {
        if (valid) {
          context.http.post('cms/api/followRecord', this.followRecordDTOParams).then(res => {
            context.http.get(`cms/api/followRecords/${this.followRecordDTOParams.yxTenantDTO.id}`).then(result => {
              this.timeLineListData = result.data
              this.$message({
                type: 'success',
                message: '新增成功'
              })
              this.addProgressFrom = false
              this.addProgressFromClose()
              // this.getPotlClientsList()
              context.http.get(`cms/api/yxTenant/${this.yxTenantDTOStorage.id}`).then(res => {
                if (res) {
                  this.detaileData = res.data
                }
              })
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addProgressFromClose () {
      this.followRecordDTOParams = {// 新增跟进记录入参
        annexes: [],
        followContent: '',
        followTime: '',
        price: '', // 心理价位
        priceUnit: 'M2DAYS', // 价格单位
        leaseYear: '', // 租赁年限
        increment: '', // 递增
        rooms: [],
        yxTenantDTO: ''
      }
      this.followRecordDTOParams.yxTenantDTO = this.yxTenantDTOStorage
    },
    imageChange (state, event) {
      let files = event.target.files
      let fileSize = files[0].size
      let form = new FormData()
      form.append('file', files[0])
      let name = files[0].name
      let annexes = this.addParmas.annexes
      if (parseInt(fileSize) > 1024 * 1024 * 20) { // 不大于20M
        this.$message({
          message: '文件大小不超过20M',
          type: 'error'
        })
        return
      }
      for (let i = 0; i < annexes.length; i++) {
        if (annexes[i].annexName === name) {
          return false
        }
      }
      event.target.value = ''
      context.http.post('/ywm/api/image-multipart', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
          // this.$set(this.addParmas, 'annexName', name)
          // this.$set(this.addParmas, 'annexURL', res.data)
        if (state === 'addFlowList') {
          this.followRecordDTOParams.annexes.push({
            'annexName': name,
            'annexURL': res.data
          })
        } else if (state === 'addapp') {
          this.addParmas.annexes.push({
            'annexName': name,
            'annexURL': res.data
          })
        }
      }).catch(error => {
        console.info(error)
      })
        // this.addParmas.annexes = this.annexesList
        // this.$forceUpdate()
    },
    deleFile (item, index, type) {
      if (type === 'yx') {
        this.addParmas.annexes.splice(index, 1)
      } else {
        this.followRecordDTOParams.annexes.splice(index, 1)
      }
    },
    downloadFile (item, index) {
      axios({
        method: 'GET',
        url: '/ywm/api/annex/download',
        params: {
          annexURL: item.annexURL,
          annexName: item.annexName
        },
        responseType: 'blob'
      }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', item.annexName)
        document.body.appendChild(link)
        link.click()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .investment-module{
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
      > span {
        color: #333;
        font-weight: bold;
        font-size: 14px;
      }
      span {
        display: inline-block;
        margin: 20px;
        &:nth-of-type(2) {
          float: right;
        }
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
      // &:nth-last-of-type(2) {
      //   margin-left: 32px;
      // }
    }
    .rental-rate:nth-of-type(2) {
      margin-left: 12px;
    }
    .collection-expenses{
      background-color: #fff;
      margin-top: 10px;
      > span {
        color: #333;
        font-weight: bold;
        font-size: 14px;
      }
      span {
        display: inline-block;
        margin: 20px;
        &:nth-of-type(2) {
          float: right;
        }
      }
      .chart{
        margin-top: 25px;
        width: 100%;
        height: 400px;
        background: #fff;
      }
    }
    .addProgressFrom{
      .form1{
        >.content{
          width: 730px;
          min-height: 850px;
          margin: 20px auto;
          .item{
            display: flex;
            flex-direction:column;
            margin-bottom: 15px;
            >span{
              margin-bottom: 10px;
              >i{
                color: #ff0000;
                font-style: normal;
              }
            }
            .storeInfo{
              min-height: 560px;
              border: 1px solid #eeeeee;
              .title{
                height: 50px;
                line-height: 50px;
                padding: 0 15px;
                background-color: #fafafa;
                display: block;
              }
              .content{
                padding: 10px;
                display: flex;
                justify-content:space-between;
                .project{
                  width: 300px;
                  height: 500px;
                  border: 1px solid #eeeeee;
                  padding: 15px;
                  overflow-y: scroll;
                  .collapse{
                    margin-top: 20px;
                    .el-collapse-item__header{
                      background-color: #fafafa;
                      padding-left: 15px;
                      height: 40px;
                      line-height: 40px;
                    }
                    .el-collapse-item__wrap{
                      padding-left: 25px;
                      .el-checkbox{
                        width: 100%;
                        margin-right: 0;
                        margin-bottom: 5px;
                      }
                    }
                  }
                }
                .offer{
                  width: 400px;
                  height: 500px;
                  padding-left: 20px;
                  >.item{
                    display: flex;
                    flex-direction:column;
                    margin-bottom: 15px;
                    >div{
                      display: flex;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
