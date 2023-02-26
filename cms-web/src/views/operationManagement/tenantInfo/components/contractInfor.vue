<template>
  <div class="contract-infor">
    <!-- <div class="tab">
      <div>
        <span v-for="(item,index) in menuTab"
              :key="index"
              :class="{'active':contentRightTabIndex===index}"
              @click="tabChange(index)">{{item}}</span>
      </div>
    </div> -->
    <div class="contract-div"
         v-if="contentRightTabIndex === 0 && contractsList.length > 0"
         v-for="(item) in contractsList"
         :key="item.id">
      <ul>
        <li>
          <div>楼宇名称</div>
          <div>{{item.shopNo.toString()}}</div>
        </li>
        <li>
          <div>项目名称</div>
          <div>{{item.referred}}</div>
        </li>
        <li>
          <div>管理企业</div>
          <div>{{item.organizeName}}</div>
        </li>
        <li>
          <div>租赁地址</div>
          <div>{{item.address}}</div>
        </li>
        <li>
          <div>租赁面积</div>
          <div>{{item.areaDescription}}</div>
        </li>
        <li>
          <div>合同起止日</div>
          <div>{{item.startDate}} 至 {{item.endDate}}</div>
        </li>
        <!-- --------------------------------- -->
        <!-- <li>
          <div>合同编号</div>
          <div>{{item.contractNo}}</div>
        </li>
        <li>
          <div>合同时间</div>
          <div>{{item.startDate}} 至 {{item.endDate}}</div>
        </li>
        <li>
          <div>租赁方式</div>
          <div>{{formatRentalMethod(item.rentalMethod)}}</div>
        </li>
      </ul>
      <ul>
        <li>
          <div>合同状态</div>
          <div>{{formatterStatus(item.contractStatus)}}</div>
        </li>
        <li>
          <div>租赁房源</div>
          <div>{{item.shopNo.join(',')}}</div>
        </li>
        <li>
          <div>初始单价</div>
          <div>{{item.cPrice | toLocaleString}}{{formatsPriceUnit(item.cPriceUnit)}}</div>
        </li>
      </ul>
      <ul>
        <li>
          <div>合同招商</div>
          <div>{{item.createdBy}}</div>
        </li>
        <li>
          <div>租赁面积</div>
          <div>{{item.area}}㎡</div>
        </li>
        <li>
          <div>实时单价</div>
          <div>{{item.sPrice | toLocaleString}}{{formatsPriceUnit(item.sPriceUnit)}}</div>
        </li> -->
      </ul>
      <!-- <div class="check-button"
            @click="details(item.id)"
            v-if="hasAuthority('02030105')">查看</div> -->
    </div>
    <div class="nodata"
         v-if="contentRightTabIndex === 0 && contractsList.length === 0">
      暂无数据
    </div>
    <div class="contract-div"
         v-if="contentRightTabIndex === 1 && multipleList.length > 0"
         v-for="(item) in multipleList"
         :key="item.id">
      <ul>
        <li>
          <div>合同编号</div>
          <div>{{item.contractNo}}</div>
        </li>
        <li>
          <div>合同时间</div>
          <div>{{item.startDate}} 至 {{item.endDate}}</div>
        </li>
        <li>
          <div>租赁方式</div>
          <div>{{formatRentalMethod(item.rentalMethod)}}</div>
        </li>
      </ul>
      <ul>
        <li>
          <div>合同状态</div>
          <div>{{formatterStatus(item.contractStatus)}}</div>
        </li>
        <li>
          <div>多经点位</div>
          <div v-for="(item2, index2) in item.managementPoints"
               :key="item2.id">{{item2.pointName}} <i v-if="item.managementPoints.length !== index2 + 1">、</i></div>
        </li>
        <li>
          <div>租赁总额</div>
          <div>{{item.amount}} 元</div>
        </li>
      </ul>
      <div class="check-button"
           @click="multipleDetails(item.id)"
           v-if="hasAuthority('02030105')"
           style="top: 30px;">查看</div>
    </div>
    <div class="nodata"
         v-if="contentRightTabIndex === 1 && multipleList.length === 0">
      暂无数据
    </div>
    <!-- <el-tabs v-model="activeName"
             type="card"
             @tab-click="handleClick"
             :style="{'height': pclTableHeight}"
             style="overflow: hidden;">
      <el-tab-pane label="房源合同"
                   name="first">
        <div class="contract-div"
             v-for="(item) in contractsList"
             :key="item.id">
          <ul>
            <li>
              <div>合同编号</div>
              <div>{{item.contractNo}}</div>
            </li>
            <li>
              <div>合同时间</div>
              <div>{{item.startDate}} 至 {{item.endDate}}</div>
            </li>
            <li>
              <div>租赁方式</div>
              <div>{{formatRentalMethod(item.rentalMethod)}}</div>
            </li>
          </ul>
          <ul>
            <li>
              <div>合同状态</div>
              <div>{{formatterStatus(item.contractStatus)}}</div>
            </li>
            <li>
              <div>租赁房源</div>
              <div>{{item.shopNo.join(',')}}</div>
            </li>
            <li>
              <div>初始单价</div>
              <div>{{item.cPrice | toLocaleString}}{{formatsPriceUnit(item.cPriceUnit)}}</div>
            </li>
          </ul>
          <ul>
            <li>
              <div>合同招商</div>
              <div>{{item.createdBy}}</div>
            </li>
            <li>
              <div>租赁面积</div>
              <div>{{item.area}}㎡</div>
            </li>
            <li>
              <div>实时单价</div>
              <div>{{item.sPrice | toLocaleString}}{{formatsPriceUnit(item.sPriceUnit)}}</div>
            </li>
          </ul>
          <div class="check-button"
               @click="details(item.id)"
               v-if="hasAuthority('02030105')">查看</div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="多经合同"
                   name="second">
        <div class="contract-div"
             v-for="(item) in multipleList"
             :key="item.id">
          <ul>
            <li>
              <div>合同编号</div>
              <div>{{item.contractNo}}</div>
            </li>
            <li>
              <div>合同时间</div>
              <div>{{item.startDate}} 至 {{item.endDate}}</div>
            </li>
            <li>
              <div>租赁方式</div>
              <div>{{formatRentalMethod(item.rentalMethod)}}</div>
            </li>
          </ul>
          <ul>
            <li>
              <div>合同状态</div>
              <div>{{formatterStatus(item.contractStatus)}}</div>
            </li>
            <li>
              <div>多经点位</div>
              <div v-for="(item2, index2) in item.managementPoints"
                   :key="item2.id">{{item2.pointName}} <i v-if="item.managementPoints.length !== index2 + 1">、</i></div>
            </li>
            <li>
              <div>租赁总额</div>
              <div>{{item.amount}} 元</div>
            </li>
          </ul>
          <div class="check-button"
               @click="multipleDetails(item.id)"
               v-if="hasAuthority('02030105')"
               style="top: 30px;">查看</div>
        </div>
      </el-tab-pane>
    </el-tabs> -->
    <contractsDetails :detailsdrawershow="detailsShow"
                      :detailData="detailData"
                      :withdrawalData="withdrawalData"
                      ref="contractsDetails"
                      @openAddDialog="openAddDialog"
                      @drawerClose="detailsClose"
                      @handleEdit="handleEdit" />

    <varietyContractDetails v-if="detailsdrawershow"
                            :detailsdrawershow="detailsdrawershow"
                            :detailData="builddetailsData"
                            @drawerClose="detailsClose"
                            @handleEdit="handlevarietyContract"
                            @query='query'
                            ref="billDetail" />
  </div>
</template>
<script>
import context from '@/service'
import contractsDetails from '@/views/contractManagement/contractsList/components/contractsDetails'
import varietyContractDetails from '@/views/operations/varietyBusiness/contract/components/contractDetails'
export default {
  name: 'contractInfor',
  components: {
    contractsDetails,
    varietyContractDetails
  },
  props: {
    tenantDetail: {
      type: Object,
      default: {}
    }
  },
  watch: {
    tabActive: {
      handler: function () {
        this.activeName = 'first'
        this.contentRightTabIndex = 0
        this.queryContracts()
      },
      immediate: true
    }
  },
  data () {
    return {
      menuTab: ['房源合同', '多经合同'],
      contentRightTabIndex: 0,
      pclTableHeight: 'auto',
      activeName: 'first',
      actionIndex: 1,
      contractsList: [],
      multipleList: [],
      detailsShow: false,
      detailsdrawershow: false,
      detailData: {},
      withdrawalData: {}
    }
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    formatsPriceUnit (val) { // 实时单价
      let priceUnit = ''
      if (val === 'M2DAYS') {
        priceUnit = '元/㎡天'
      } else if (val === 'M2MONTH') {
        priceUnit = '元/㎡月'
      } else if (val === 'DAY') {
        priceUnit = '元/天'
      } else if (val === 'MONTH') {
        priceUnit = '元/月'
      }
      return priceUnit
    },
    formatRentalMethod (val) {
      return val === 'RENT' ? '固定租金' : val === 'POINTS' ? '扣点' : '保底扣点'
    },
    formatterStatus (val) {
      let contractStatus
      if (val === 'STORAGE') {
        contractStatus = '暂存'
      } else if (val === 'PENDING') {
        contractStatus = '待执行'
      } else if (val === 'EXECUTING') {
        contractStatus = '执行中'
      } else if (val === 'ZH_APPROVAL') {
        contractStatus = '招商审核中'
      } else if (val === 'TZ_APPROVAL') {
        contractStatus = '退租审核中'
      } else if (val === 'WITHDRAWAL') {
        contractStatus = '已退租'
      } else if (val === 'XQ_APPROVAL') {
        contractStatus = '续签审核中'
      } else if (val === 'NO') {
        contractStatus = '审核未通过'
      } else if (val === 'MATURITY') {
        contractStatus = '到期未处理'
      }
      return contractStatus
    },
    handleClick (tab, event) {
      if (this.activeName === 'first') {
        this.queryContracts()
      } else {
        this.getMultipleList()
      }
    },
    query () { },
    getMultipleList () {
      context.http.get('cms/api/management-contracts/tenant?tenantId=' + this.tenantDetail.id).then(res => {
        if (res.status === 200) {
          this.multipleList = res.data
        }
      })
    },
    queryContracts () {
      context.http.get('cms/api/contracts/tenant', { tenantId: this.tenantDetail.id }).then(res => {
        if (res.status === 200) {
          this.contractsList = res.data
        }
      })
    },
    details (id) {
      context.http.get(`/cms/api/contracts/${id}`).then(res => {
        this.pclTableHeight = '160px'
        // this.detailsShow = true
        this.detailData = res.data
        this.$emit('onHide', id)
      })
    },
    multipleDetails (id) {
      context.http.get(`/cms/api/management-contracts/${id}`).then(res => {
        this.pclTableHeight = '160px'
        this.detailsdrawershow = true
        this.builddetailsData = res.data
      })
    },
    tabChange (index) {
      this.contentRightTabIndex = index
      if (index === 0) {
        this.queryContracts()
      } else {
        this.contentRightTabIndex = index
        this.getMultipleList()
      }
    },
    openAddDialog () {
      this.$router.push({ name: 'contractsList', params: { pageFrom: 'TenantInformation' } })
    },
    detailsClose () {
      this.detailsShow = false
      this.detailsdrawershow = false
      this.pclTableHeight = 'auto'
    },
    handleEdit (index, detailData) {
      this.pclTableHeight = '160px'
      this.details(detailData.id)
    },
    handlevarietyContract (index, detailData) {
      this.multipleDetails(detailData.id)
    }
  }
}
</script>
<style lang="scss">
.contract-infor {
  margin-bottom: 20px;
  width: 98%;
  margin: 0 auto;
  .contract-div {
    border-bottom: 1px solid rgba(241, 241, 241, 1);
    position: relative;
    margin-bottom: 20px;
    ul {
      min-height: 45px;
      li {
        vertical-align: top;
        display: inline-block;
        width: 25%;
        padding: 0 20px 0 20px;
        line-height: 45px;
        margin-bottom: 15px;
        div {
          line-height: 16px;
          &:first-child {
            font-size: 14px;
            color: #777777;
            margin-bottom: 10px;
          }
          &:last-child {
            font-size: 14px;
            color: #262626;
          }
        }
        &:nth-of-type(2n) {
          // width: 35%;
        }
        &:last-child {
          padding-bottom: 20px;
        }
        span {
          margin-right: 20px;
          word-break: break-all;
        }
      }
    }
    .check-button {
      position: absolute;
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      background: #3575f6;
      border: 1px solid #3575f6;
      color: #fff;
      -webkit-appearance: none;
      text-align: center;
      box-sizing: border-box;
      outline: 0;
      margin: 0;
      -webkit-transition: 0.1s;
      transition: 0.1s;
      font-weight: 500;
      -moz-user-select: none;
      padding: 6px 10px;
      font-size: 12px;
      border-radius: 4px;
      right: 20px;
      top: 30px;
    }
  }
  .nodata {
    padding: 20px 0 190px 0;
    text-align: center;
    color: #777;
    font-size: 14px;
  }
  .navTab {
    width: 206px;
    margin-bottom: 20px;
    display: flex;
    span {
      display: inline-block;
      width: 100px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 5px;
      color: #333;
      background-color: #fff;
      border: 1px solid #3577f6;
      cursor: pointer;
      &:first-child {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      &:last-child {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
    .actived {
      background-color: #3577f6;
      color: #fff;
    }
  }
  .el-tabs__item {
    color: #666 !important;
  }
  .el-tabs__item.is-active {
    color: #3577f6 !important;
  }
  .tab {
    height: 34px;
    line-height: 34px;
    display: flex;
    justify-content: space-between;
    margin: 15px 0 15px 5px;
    // border-bottom: 1px solid #eeeeee;
    > div {
      > span {
        display: inline-block;
        width: 80px;
        text-align: center;
        height: 32px;
        line-height: 32px;
        cursor: pointer;
        background-color: #f8f8f8;
        color: #777777;
        font-size: 14px;
        border-radius: 2px;
        &.active {
          // border-bottom: 2px solid #3175f6;
          color: #3575f6;
          background-color: #eef4ff;
        }
      }
    }
    i {
      font-style: normal;
      cursor: pointer;
      color: #6eaeeb;
    }
  }
}
</style>

