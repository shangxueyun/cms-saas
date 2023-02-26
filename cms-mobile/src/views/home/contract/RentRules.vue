<template>
  <div class="RentRules">
    <app-header title="租金规则详情"></app-header>
    <div class="content">
      <div class="basic-information">
        <div class="content-title">规则起止日期</div>
        <div class="ul-warp">
          <div class="content-ul">
            <span>起始日期</span>
            <span>{{detailDataContracts.startDate}}</span>
          </div>
          <div class="content-ul">
            <span>截止日期</span>
            <span>{{detailDataContracts.endDate}}</span>
          </div>
        </div>
      </div>
      <div class="basic-information">
        <div class="content-title">租金</div>
        <div class="ul-warp"
             v-for="(item, index) in detailDataContracts.rentClauses"
             :key="index">
          <template v-if="item.building">
            <div class="content-ul">
              <span>楼宇：</span>
              <span>{{item.building.buildingName}}</span>
            </div>
            <div class="content-ul">
              <span>地址：</span>
              <span>{{item.building.address}}</span>
            </div>
            <div class="content-ul">
              <span>类型：</span>
              <span>{{assetsTypeFormte(item.building.assetsType)}}</span>
            </div>
            <div class="content-ul">
              <span>总面积：</span>
              <span>{{item.building.buildingArea}}{{item.building.assetsType ==='LAND'? '亩' : 'm²'}}</span>
            </div>
          </template>
          <div class="content-ul">
            <span>租赁面积：</span>
            <span v-if="item.building">
              {{item.area}}{{item.building.assetsType ==='LAND'? '亩' : 'm²'}}
            </span>
          </div>
          <div class="content-ul">
            <span>租金：</span>
            <span>
              {{priceUnitFormat(item.priceUnit)}}
              {{item.price}}元
            </span>
          </div>
          <div class="ct-right">
            <div class='stepsProcess pre'>
              <div class='stepsProcessCon yw-setps'>
                <div class='processItem yw-setp'>
                  <div class='step__head'>
                    <div class="step__line lined"></div>
                    <div class="step__icon circle circle1"></div>
                    <div class="step__icon circle circle2"
                         v-if="item.incrementRates && item.incrementRates.length === 0"></div>
                  </div>
                  <div class='processItemCon step__main'>
                    <div>{{detailDataContracts.startDate}}</div>
                    <div style="margin: 6px 0 15px 0">
                      <span class="date-wrap">
                        {{priceUnitFormat(item.priceUnit)}}：
                        {{item.price}} 元
                      </span>
                    </div>
                    <div v-if="item.incrementRates && item.incrementRates.length === 0">{{detailDataContracts.endDate}}</div>
                  </div>
                </div>
                <div class='processItem yw-setp'
                     v-for="(item2, index2) in item.incrementRates"
                     :key="'index1' + index2">
                  <div class='step__head'>
                    <div class="step__line lined"></div>
                    <div class="step__icon circle circle1"
                         v-if="index2 === 0"></div>
                    <div class="step__icon circle circle2"></div>
                  </div>
                  <div class='processItemCon step__main'>
                    <div>{{item2.startDate}}
                      <!-- <i class="iconfont icon-lajixiang"
                           @click="delStep(item, index2, index)"></i> -->
                    </div>
                    <div style="margin: 6px 0 15px 0">
                      <span class="date-wrap">
                        {{priceUnitFormat(item.priceUnit)}}：
                        <!-- {{item2.number}} -->
                        <!-- {{item2.incrementUnit === 'P' ? '%' : '天'}} -->
                        {{item2.point}}
                        元
                      </span>
                    </div>
                    <div v-if="index2 === (item.incrementRates && item.incrementRates.length - 1)">{{detailDataContracts.endDate}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="basic-information">
        <div class="content-title">付款条件</div>
        <div class="ul-warp">
          <div class="content-ul">
            <span>付款周期</span>
            <span>{{detailDataContracts.rentClauses[0].month}}月</span>
          </div>
          <div class="content-ul">
            <span>账单应收日期</span>
            <span v-if="detailDataContracts.rentClauses[0].dayType === 'TOP'">提前{{detailDataContracts.rentClauses[0].dayNumber}}天</span>
            <span v-else>固定{{detailDataContracts.rentClauses[0].dayNumber}}日</span>
          </div>
          <div class="content-ul">
            <span>滞纳金比例</span>
            <span v-if="detailDataContracts.rentClauses[0].lateFeeRate">{{detailDataContracts.rentClauses[0].lateFeeRate}}%/天</span>
          </div>
        </div>
      </div>
      <div class="basic-information">
        <div class="content-title">免租期</div>
        <div class="ul-warp">
          <div class="content-ul">
            <span>免租期</span>
            <div class="selected-housing"
                 v-for="(item, index) in detailDataContracts.rentClauses[0].offerRecords"
                 :key="index">
              <div class="cttitle">
                <div>{{item.yhStartDate}} ~ {{item.yhEndDate}}</div>
              </div>
            </div>
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
  name: 'RentRules',
  components: { AppHeader },
  data () {
    return {
      rentRulesDetailData: {},
      detailDataContracts: {
        rentClauses: [{
          month: '',
          dayType: '',
          dayNumber: '',
          lateFeeRate: ''
        }]
      }
    }
  },
  created () {
    let contractsID = this.$route.query.contractsID
    let rulesID = this.$route.query.rulesID
    // this.contracts(contractsID)
    this.rulesDetail(rulesID, contractsID)
  },
  methods: {
    assetsTypeFormte (val) {
      const amap = {
        'BUILDING': '楼宇',
        'LAND': '土地',
        'FIELD': '场地'
      }
      return amap[val]
    },
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
    priceUnitFormat1 (val) {
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
    priceUnitFormat (val) {
      const amap = {
        'M2DAYS': '面积单价(每天)',
        'MONTH': '月租金',
        'YEAR': '年租金'
      }
      return amap[val]
    },
    formatOfferReocrd (val) {
      return val === true ? '包括' : '不包括'
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
    rulesDetail (rulesID, contractsID) {
      context.http.get(`cms/api/rent-clauses/${rulesID}`, {
        contractId: contractsID
      }).then(res => {
        if (res.status === 200) {
          this.detailDataContracts = res.data
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
.contractLoadAll {
  background: #fff;
  padding-top: rem(20);
  > p {
    width: rem(80);
  }
}
/* steps start */
.stepsProcess {
  padding: rem(30) 0 rem(20) 0;
  position: relative;
  background: #fff;
}
.pre {
  height: auto;
}
.stepsProcessCon {
  display: flex;
  flex-flow: column;
}
.pre .processItem {
  position: relative;
  display: flex;
  flex-shrink: 1;
}
.lined {
  width: 1px;
  /* height: 50px; */
  background: #eee;
  position: absolute;
  left: rem(6);
  top: rem(18);
}
.step__head {
  flex-grow: 0;
  width: rem(24);
  position: relative;
}
.step__line {
  width: 1px;
  top: 0;
  bottom: 0;
  left: rem(6);
  position: absolute;
  border-color: inherit;
  background-color: #c0c4cc;
}
.step__icon {
  position: relative;
  z-index: 1;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: rem(24);
  height: rem(24);
  font-size: rem(14);
  box-sizing: border-box;
  background: #fff;
  transition: 0.15s ease-out;
  border-radius: 50%;
  border: 2px solid;
  border-color: inherit;
}

.step__main {
  padding-left: rem(10);
  flex-grow: 1;
  white-space: normal;
  text-align: left;
}

.circle {
  width: rem(12);
  height: rem(12);
  border: 3px solid #d3dbeb;
  margin-right: rem(20);
  border-radius: 50%;
}
.circle1 {
  position: absolute;
  top: 0;
}
.circle2 {
  position: absolute;
  bottom: 0;
}
.processItemCon {
  position: relative;
}
.date-wrap {
  display: inline-block;
  width: 100%;
  height: rem(30);
  line-height: rem(30);
  background: #ffffff;
  /* border: 1px solid #ebebeb; */
  border-radius: 4px;
  margin-top: 6px;
  color: #858C94;
}

/* steps end */
</style>
