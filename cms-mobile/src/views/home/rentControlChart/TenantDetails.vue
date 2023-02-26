<template>
  <div class="TenantDetails">
    <app-header :title="tenantDetail.teantName"
                class="retitle">
      <div slot="rightBtn"
           v-if="tenantDetail.usableContracts.length"
           @click="tenantBill"
           class="postbtn">客户账单</div>
    </app-header>
    <div class="content-warp">
      <!-- <div class="content-head"
           v-show="!isClientListHome">
        <img v-if="tenantDetail.shopPhotos"
             :src="tenantDetail.shopPhotos" />
        <img v-else
             src="../../../assets/berth-default.png" />
        <div class="head-info">
          <p>{{tenantDetail.teantName}}</p>
          <p v-if="tenantDetail.contractStartDate">{{tenantDetail.contractStartDate}} ～ {{tenantDetail.contractEndDate}}</p>
          <p class="contractstatus"
             :class="{
            'EXECUTING' : tenantDetail.contractStatus === 'EXECUTING',
            'MATURITY' : tenantDetail.contractStatus === 'MATURITY',
            'WITHDRAWAL' : tenantDetail.contractStatus === 'WITHDRAWAL'
          }">{{formatterStatus(tenantDetail.contractStatus)}}</p>
        </div>
      </div> -->
      <!-- 导航区域 -->
      <ul class="navs">
        <li v-for="(item, index) in navsList"
            :key="index"
            :class="{active: active===index}"
            @click="scrollTo(index,item,tenantDetail.tenantUse)">
          {{item}}
          <div class="underline"
               v-show="active===index"></div>
        </li>
      </ul>
      <!-- 内容区域 -->
      <div class="content"
           id="content"
           :style="{'height': contentHeight + 'px'}">
        <!-- 租户信息 -->
        <div class="tenant-infor">
          <tenant-infor :tenantDetail="tenantDetail"></tenant-infor>
        </div>
        <!-- 跟进记录 -->
        <div class="followUp-record">
          <follow-record :tenantID="tenantID"
                         :active="active"></follow-record>
        </div>
        <!-- 费用统计 -->
        <!-- <div class="total-expenses">
          <total-expenses :tenantID="tenantID"></total-expenses>
        </div> -->
        <!-- 税收与经营数据 -->
        <div class="total-expenses"
             v-if="tenantDetail.tenantUse === 'WORK'">
          <!-- 税收数据 -->
          <revenue-Data :tenantID="tenantID"></revenue-Data>
          <!-- 经营数据 -->
          <operate-Data :tenantID="tenantID"></operate-Data>
        </div>
        <!-- 营业数据 -->
        <div class="business-data"
             v-if="tenantDetail.tenantUse === 'SHOP'">
          <business-data :tenantID="tenantID"
                         :active="active"
                         :contractDTOS="tenantDetail.contractDTOS"></business-data>
        </div>
        <!-- 营业数据 -->
        <div class="market-data"
             v-if="tenantDetail.tenantUse === 'MARKET'">
          <market-data :tenantID="tenantID"
                       :contractDTOS="tenantDetail.contractDTOS"></market-data>
        </div>
        <!-- 合同列表 -->
        <!-- <div class="contract-list">
          <contract-list :tenantID="tenantID"
                         :active="TabActive"></contract-list>
        </div> -->
        <div class="contract-list">
          <contract-lists :tenantID="tenantID"></contract-lists>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import context from '@/service'
import AppHeader from '@/components/appHead'
import myMixin from './TenantComponents/mixin'
import TenantInfor from './TenantComponents/TenantInfor'
import FollowRecord from './TenantComponents/FollowRecord'
import ContractList from './TenantComponents/ContractList'
import ContractLists from './TenantComponents/ContractLists'
import TotalExpenses from './TenantComponents/TotalExpenses'
import BusinessData from './TenantComponents/BusinessData'
import MarketData from './TenantComponents/MarketData'
import RevenueData from './TenantComponents/RevenueData'
import OperateData from './TenantComponents/OperateData'
let roterFrom = null
export default {
  name: 'TenantDetails',
  components: { AppHeader, TenantInfor, FollowRecord, ContractList, ContractLists, TotalExpenses, BusinessData, RevenueData, OperateData, MarketData },
  mixins: [myMixin],
  data () {
    return {
      isClientListHome: false,
      title: '租户名称',
      active: 0,
      TabActive: 2,
      TabActives: 2,
      navsList: [
        '客户信息',
        '跟进记录',
        '税收与经营数据',
        '营业数据',
        '营业数据',
        '合同列表'
      ],
      tenantDetail: {
        projectManagement: {},
        contractDTOS: [],
        usableContracts: [],
        checkData: []
      },
      contentHeight: 0,
      tenantID: this.$route.query.tenantID
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
    next()
  },
  created () {
    if (roterFrom === 'clientListHome') {
      this.isClientListHome = true
    }
    this.tenantID = this.$route.query.tenantID
    this.tenantData(this.tenantID)
  },
  mounted () {
    this.$nextTick(() => {
      // let headH = document.querySelector('#app-head').clientHeight + document.querySelector('.content-head').clientHeight +
      let headH = document.querySelector('#app-head').clientHeight + document.querySelector('.navs').clientHeight + 10
      this.contentHeight = document.body.clientHeight - headH
    })
  },
  methods: {
    navsListInit () { // 根据租户不同类型初始化导航菜单
      if (this.tenantDetail.tenantUse === 'SHOP') {
        this.navsList = ['客户信息', '跟进记录', '营业数据', '合同列表']
      } else if (this.tenantDetail.tenantUse === 'WORK') {
        this.navsList = ['客户信息', '跟进记录', '税收与经营数据', '合同列表']
      } else if (this.tenantDetail.tenantUse === 'MARKET') {
        this.navsList = ['客户信息', '跟进记录', '营业数据', '合同列表']
      }
      // console.log(this.navsList)
    },
    tenantBill () {
      this.$router.push({ name: 'tenantBills', params: { 'id': this.tenantDetail.usableContracts[0].id } })
    },
    tenantData (id) {
      context.http.get('cms/api/tenant/' + id).then(res => {
        context.http.get('cms/api/enterpriseRooms/tenantId/' + id).then(result => {
          if (res.status === 200) {
            this.tenantDetail = res.data
            this.tenantDetail.checkData = result.data
            this.navsListInit()
          }
        })
      })
    },
    formatterStatus (status) {
      let contractStatus
      if (status === 'STORAGE') {
        contractStatus = '暂存'
      } else if (status === 'PENDING') {
        contractStatus = '待执行'
      } else if (status === 'EXECUTING') {
        contractStatus = '执行中'
      } else if (status === 'ZH_APPROVAL') {
        contractStatus = '招商审核中'
      } else if (status === 'TZ_APPROVAL') {
        contractStatus = '退租审核中'
      } else if (status === 'WITHDRAWAL') {
        contractStatus = '已退租'
      } else if (status === 'XQ_APPROVAL') {
        contractStatus = '续签审核中'
      } else if (status === 'NO') {
        contractStatus = '审核未通过'
      } else if (status === 'MATURITY') {
        contractStatus = '到期未处理'
      }
      return contractStatus
    }
  }
}
</script>
<style lang="scss">
@import "../../../style/config";
.TenantDetails {
  .retitle {
    .title {
      padding-left: rem(10);
      width: rem(150);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .right_btn {
      width: rem(74) !important;
    }
  }
}
</style>
<style lang="scss" scoped>
@import "../../../style/config";
.postbtn {
  color: #0139a4;
  font-size: rem(14);
}
.content-warp {
  margin-top: rem(40);
  font-size: rem(15);
}
.content-head {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  padding: rem(16) rem(14) rem(20) rem(14);
  margin-bottom: rem(10);
  img {
    width: rem(90);
    height: rem(90);
    border: 1px solid #fff;
    border-radius: rem(6);
    object-fit: cover;
  }
  .head-info {
    color: #18191a;
    p {
      margin-bottom: rem(14);
      text-align: right;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
/* 导航栏的样式 */
.navs {
  // position: fixed;
  top: rem(40);
  width: 100%;
  height: rem(46);
  background-color: #fff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  z-index: 3;
  white-space: nowrap;
  overflow-x: scroll;
  box-shadow: 0px 1px 4px 0px rgba(230, 230, 230, 0.5);
}
.navs li {
  display: inline-block;
  // width: rem(70);
  margin: rem(0) rem(12) 0 rem(14);
  font-size: rem(15);
  color: #444547;
  &:last-child {
    padding-right: rem(14);
  }
}
/* 当导航被点亮后改变颜色 */
.navs .active {
  color: #0139a4;
  font-size: rem(17);
  font-weight: bold;
}
.underline {
  // width: rem(70);
  width: 100%;
  height: rem(3);
  background: rgba(1, 57, 164, 1);
  border-radius: rem(2);
  position: relative;
  top: rem(6);
}
/* 内容区的样式 */
.content {
  width: 100%;
  height: rem(445);
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}
.content > div {
  width: 100%;
  // max-height: rem(2000);
  margin-bottom: rem(10);
  &:last-child {
    margin: 0;
  }
}
.contractstatus {
  &.EXECUTING {
    color: #1cc296;
  }
  &.MATURITY {
    color: #fc5159;
  }
  &.WITHDRAWAL {
    color: #858c94;
  }
}
</style>
