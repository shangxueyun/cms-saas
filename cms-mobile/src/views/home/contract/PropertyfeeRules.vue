<template>
  <div class="PropertyfeeRules">
    <app-header title="物业费规则详情"></app-header>
    <div class="content">
      <div class="basic-information">
        <div class="content-title">计算方式</div>
        <div class="ul-warp">
          <div class="content-ul">
            <span>计租面积类型</span>
            <span>{{areaType(detailDataContracts.areaTypeProperty)}}</span>
          </div>
          <div class="content-ul">
            <span>计租面积</span>
            <span v-if="detailDataContracts.areaTypeProperty === 'BUILDING'">{{detailDataContracts.area}}㎡</span>
            <span v-if="detailDataContracts.areaTypeProperty === 'USING'">{{detailDataContracts.useArea}}㎡</span>
            <span v-if="!detailDataContracts.areaTypeProperty"></span>
          </div>
          <div class="content-ul">
            <span>计算进位方式</span>
            <span>
              {{carryMode(detailDataContracts.carryModeProperty)}}
            </span>
          </div>
        </div>
      </div>
      <div class="basic-information">
        <div class="content-title">物业费条款</div>
        <div class="ul-warp">
          <div class="content-ul">
            <span>开始时间</span>
            <span>{{propertyRulesDetailData.startDate}}</span>
          </div>
          <div class="content-ul">
            <span>结束时间</span>
            <span>{{propertyRulesDetailData.endDate}}</span>
          </div>
          <div class="content-ul">
            <span>物业费保证金金额</span>
            <span>{{propertyRulesDetailData.deposit}}元</span>
          </div>
          <div class="content-ul">
            <span>物业费单价</span>
            <span>
              {{propertyRulesDetailData.price}}{{priceUnitFormat(propertyRulesDetailData.priceUnit)}}
            </span>
          </div>
          <div class="content-ul">
            <span>计费类型</span>
            <span>
              {{formatBillType(propertyRulesDetailData.billingType)}}
            </span>
          </div>
          <div class="content-ul">
            <span>年天数</span>
            <span>{{propertyRulesDetailData.yearDay}}</span>
          </div>
          <div class="content-ul">
            <span>付款周期/月</span>
            <span>
              {{propertyRulesDetailData.month}}
            </span>
          </div>
          <div class="content-ul">
               <span>账单划分方式</span>
            <span>{{ formatbillDivision(propertyRulesDetailData.billDivision)}}</span>
          </div>
          <div class="content-ul">
            <span>物业费的账单日期是否同步租金账单</span>
            <span>
              {{formatonRentBill(propertyRulesDetailData.onRentBill)}}
            </span>
          </div>
          <div class="content-ul">
            <!-- <span>提前付款时间</span> -->
            <span>账单应收日期</span>
            <span v-if="propertyRulesDetailData.dayType === 'TOP'">
              提前{{propertyRulesDetailData.dayNumber}}天
            </span>
            <span v-else>
              固定{{propertyRulesDetailData.dayNumber}}日
            </span>
          </div>
          <div class="content-ul">
            <span>滞纳金比例</span>
            <span v-if="propertyRulesDetailData.lateFeeRate">
              {{propertyRulesDetailData.lateFeeRate}}%/天
            </span>
          </div>
        </div>
      </div>
      <div class="basic-information">
        <div class="content-title">物业费递增</div>
        <div class="ul-warp" v-for="(item, index) in propertyRulesDetailData.incrementRates" :key="index">
          <div class="content-ul">
            <span>递增开始时间</span>
            <span>{{item.startDate}}</span>
          </div>
          <div class="content-ul">
            <span>递增结束时间</span>
            <span>{{item.endDate}}</span>
          </div>
          <div class="content-ul">
            <span>租金单价递增</span>
            <span>
              {{item.number}}{{formatUnit(item.incrementUnit)}}
            </span>
          </div>
        </div>
      </div>
      <div class="basic-information">
        <div class="content-title">物业费优惠</div>
        <div class="ul-warp" v-for="(item, index) in propertyRulesDetailData.offerRecords" :key="index">
          <div class="content-ul">
            <span>优惠类型</span>
            <span>{{formatOfferType(item.offerType)}}</span>
          </div>
          <div class="content-ul">
            <span>优惠开始时间</span>
            <span>{{item.yhStartDate}}</span>
          </div>
          <div class="content-ul">
            <span>优惠结束时间</span>
            <span>
              {{item.yhEndDate}}
            </span>
          </div>
        </div>
      </div>
      <div class="loadAll contractLoadAll">
        <span>-</span>
        <p>已经到底了</p>
        <span>-</span>
      </div>
    </div>
  </div>
</template>
<script>
import AppHeader from '@/components/appHead'
import context from '@/service'
export default {
  name: 'PropertyfeeRules',
  components: { AppHeader },
  data () {
    return {
      propertyRulesDetailData: {},
      detailDataContracts: {}
    }
  },
  created () {
    let contractsID = this.$route.query.contractsID
    let rulesID = this.$route.query.rulesID
    this.contracts(contractsID)
    this.rulesDetail(rulesID)
  },
  methods: {
    formatbillDivision (billDivision) {
      if (billDivision === 'NO') {
        return '首期开始，按付款周期划分'
      } else if (billDivision === 'QUARTER') {
        return '首期三个月，第三笔开始按季度划分'
      } else if (billDivision === 'QUARTER_TWO') {
        return '第二笔开始，按季度划分'
      }
    },
    areaType (val) {
      if (val) {
        return val === 'BUILDING' ? '建筑面积' : '使用面积'
      }
    },
    carryMode (val) {
      if (val) {
        return val === 'ROUNDING' ? '四舍五入' : '无条件进位'
      }
    },
    formatBillType (val) {
      return val === 'MONTH' ? '按月计费' : '按天计费'
    },
    priceUnitFormat (val) {
      let priceUnit
      if (val === 'M2DAYS') {
        priceUnit = '元/㎡天'
      } else if (val === 'M2MONTH') {
        priceUnit = '元/㎡月'
      } else if (val === 'DAY') {
        priceUnit = '元/天'
      } else if (val === 'MONTH') {
        priceUnit = '元/月'
      } else if (val === 'YEAR') {
        priceUnit = '元/年'
      }
      return priceUnit
    },
    formatonRentBill (val) {
      return val === false ? '不同步' : '同步'
    },
    formatUnit (val) {
      return val === 'P' ? '%' : '元'
    },
    formatOfferType (val) {
      return val === 'RENT' ? '免租期' : val === 'DECORATION' ? '装修期' : '物业免租期'
    },
    contracts (id) {
      context.http.get(`cms/api/contracts/${id}`).then(res => {
        if (res.status === 200) {
          this.detailDataContracts = res.data
        }
      })
    },
    rulesDetail (id) {
      context.http.get(`cms/api/rent-clauses/${id}`).then(res => {
        if (res.status === 200) {
          this.propertyRulesDetailData = res.data
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
.content {
  width: 100%;
  position: relative;
  top: rem(40);
}
.basic-information {
  margin-bottom: rem(10);
  background: #fff;
}
.content-title {
  color: #18191a;
  font-size: rem(17);
  height: rem(40);
  line-height: rem(40);
  font-weight: bold;
  padding-left: rem(14);
  border-bottom: rem(1) solid #f0f0f0;
}
.ul-warp {
  margin: 0 rem(14) 0 rem(14);
  border-bottom: rem(1) solid #f0f0f0;
  padding-bottom: rem(16);
  &:last-child {
    border: none;
  }
}
.content-ul {
  display: flex;
  justify-content: space-between;
  padding-top: rem(16) !important;
  font-size: rem(15);
  > span {
    color: #18191a;
    &:first-child {
      color: #858c94;
      min-width: rem(64);
      margin-right: rem(10);
    }
  }
}
.contractLoadAll{
  background: #fff;
  padding-top:rem(20);
  >p{
    width:rem(80);
  }
}
</style>
