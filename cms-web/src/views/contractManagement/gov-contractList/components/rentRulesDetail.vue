<template>
  <div class="rent-rules-detail">
    <div class="dc-right">
      <div class="dr-head contract-rules"><span class="vertical"></span>规则起止日期</div>
      <div class="selected-housing">
        <div class="cttitle">起始日期<i class="required">*</i>
          <div>{{rulesDetailData.startDate}}</div>
        </div>
        <div class="cttitle">截止日期<i class="required">*</i>
          <div>{{rulesDetailData.endDate}}</div>
        </div>
      </div>
    </div>
    <div class="dc-right">
      <div class="dr-head contract-rules"><span class="vertical"></span>租金</div>
      <div class="selected-housing">
        <div class="form-group"
             v-for="(item, index) in rulesDetailData.rentClauses"
             :key="index">
          <div class="fg-header" v-if="item.building">
            <p><span>楼宇：{{item.building.buildingName}}</span> 地址：{{item.building.address}} </p>
            <p><span>类型：{{assetsTypeFormte(item.building.assetsType)}}</span> 总面积：{{item.building.buildingArea}}
              <span>{{item.building.assetsType ==='LAND'? '亩' : 'm²'}}</span>
            </p>
          </div>
          <div class="fg-content">
            <div class="ct-left">
              <div class="cttitle">租赁面积<i class="required">*</i>
                <div>{{item.area}}{{item.building.assetsType ==='LAND'? '亩' : 'm²'}}</div>
              </div>
              <div class="cttitle">租金<i class="required">*</i>
                <div>{{priceUnitFormat(item.priceUnit)}}
                  {{item.price}}元</div>
              </div>
            </div>
            <div class="ct-right">
              <div class='stepsProcess pre'>
                <div class='stepsProcessCon yw-setps'>
                  <div class='processItem yw-setp'>
                    <div class='step__head'>
                      <div class="step__line lined"></div>
                      <div class="step__icon circle circle1"></div>
                      <div class="step__icon circle circle2"
                           v-if="item.incrementRates.length === 0"></div>
                    </div>
                    <div class='processItemCon step__main'>
                      <div>{{rulesDetailData.startDate}}</div>
                      <div style="margin: 6px 0 15px 0">
                        <span class="date-wrap">
                          {{priceUnitFormat(item.priceUnit)}}：
                          {{item.price}} 元
                        </span>
                      </div>
                      <div v-if="item.incrementRates.length === 0">{{rulesDetailData.endDate}}</div>
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
                      <div v-if="index2 === item.incrementRates.length - 1">{{rulesDetailData.endDate}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="dc-right">
      <div class="dr-head contract-rules"><span class="vertical"></span>付款条件</div>
      <div class="selected-housing">
        <div class="cttitle">付款周期/月<i class="required">*</i>
          <div>{{rulesDetailData.rentClauses[0].month}}</div>
        </div>
        <div class="cttitle">账单应收日期<i class="required">*</i>
          <div v-if="rulesDetailData.rentClauses[0].dayType === 'TOP'">提前{{rulesDetailData.rentClauses[0].dayNumber}}天</div>
          <div v-else >固定{{rulesDetailData.rentClauses[0].dayNumber}}日</div>
        </div>
        <div class="cttitle">滞纳金比例
          <div v-if="rulesDetailData.rentClauses[0].lateFeeRate">{{rulesDetailData.rentClauses[0].lateFeeRate}}%/天</div>
        </div>
      </div>
    </div>
    <div class="dc-right">
      <div class="dr-head contract-rules"><span class="vertical"></span>免租期</div>
      <div class="selected-housing"
           v-if="showRentConcessions"
           v-for="(item, index) in rulesDetailData.rentClauses[0].offerRecords"
           :key="index">
        <div class="cttitle">
          <div>{{item.yhStartDate}} ~ {{item.yhEndDate}}</div>
        </div>
        <!-- <div class="cttitle">优惠结束时间<i class="required">*</i>
          <div>{{item.yhEndDate}}</div>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'rentRulesDetail',
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    rentalMethod: {
      type: String
    },
    detailDataContracts: {
      type: Object,
      default: {}
    },
    rulesDetailData: {
      type: Object,
      default: function () {
        return {
          rentClauses: [
          ]
        }
      }
    }
  },
  watch: {
    rulesDetailData: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          // this.detailData.rentClauses[0] = newVal
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      showRentIncrements: true,
      showLeaseTerms: true,
      showRentConcessions: true,
      showRentBond: true,
      showRentAccount: true,
      detailData: { rentClauses: [{}] },
      multipleSelectionAll: []
    }
  },
  created () {
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
    formatUnit (val) {
      return val === 'P' ? '%' : '元'
    },
    formatBillType (val) {
      return val === 'MONTH' ? '按月计费' : '按天计费'
    },
    formatOfferReocrd (val) {
      return val === true ? '包括' : '不包括'
    },
    formatOfferType (val) {
      return val === 'RENT' ? '免租期' : val === 'DECORATION' ? '装修期' : '物业免租期'
    },
    assetsTypeFormte (val) {
      const amap = {
        'BUILDING': '楼宇',
        'LAND': '土地',
        'FIELD': '场地'
      }
      return amap[val]
    },
    priceUnitFormat (val) {
      const amap = {
        'M2DAYS': '面积单价(每天)',
        'MONTH': '月租金',
        'YEAR': '年租金'
      }
      return amap[val]
    }
  }
}
</script>
<style lang="scss" scoped>
.rent-rules-detail {
  .dc-right {
    width: 100% !important;
    margin-top: 12px;
    .other-info {
      width: 98%;
      margin: 0 auto;
    }
    .dr-head {
      background-color: #ffffff;
      height: 40px;
      line-height: 40px;
      padding-left: 12px;
      font-size: 16px;
      margin-bottom: 12px;
      border-bottom: 1px solid #f6f6f6;
      color: #262626;
      font-weight: bold;
      .iconfont {
        cursor: pointer;
        font-size: 12px;
      }
      .icon-add {
        font-size: 16px;
        color: #0073ff;
        margin-left: 40px;
      }
      .icon-reduce {
        font-size: 16px;
      }
      .right-btn {
        float: right;
        span {
          display: inline-block;
          width: 84px;
          height: 26px;
          line-height: 23px;
          text-align: center;
          color: #0f75ff;
          border: 1px solid rgba(15, 117, 255, 1);
          border-radius: 4px;
          margin-right: 6px;
          font-size: 12px;
          cursor: pointer;
        }
        .icon-cha {
          margin-right: 10px;
        }
      }
    }
    &:last-child {
      margin-bottom: 20px;
    }
  }
  .selected-housing {
    font-size: 12px;

    ul {
      display: flex;

      &:first-child {
        border-bottom: 1px solid #e7e7e7;
      }

      li {
        width: 20%;
        height: 30px;
        line-height: 30px;
        text-align: center;
      }
    }

    input {
      border: 1px solid rgba(231, 231, 231, 1);
      border-radius: 4px;
    }

    .cttitle {
      /* float: left; */
      display: inline-block;
      width: 33%;
      padding-left: 20px;
      margin-bottom: 20px;

      div {
        padding-top: 10px;
        color: #262626;
      }
    }
    .operation-li {
      span {
        color: #0f75ff;
      }
    }
  }
  .form-group {
    .fg-header {
      background-color: #EEF9FB;
      color: #333333;
      padding: 10px 20px;
      p {
        padding: 2px 0;
        span {
          margin-right: 20px;
          padding-left: 0;
          width: auto;
        }
      }
    }
    .fg-content {
      padding-left: 20px;
      display: flex;
      justify-content: space-between;
      .ct-left {
        display: flex;
        flex-direction: column;
        width: 50%;
        margin-top: 10px;
      }
      .ct-right {
        width: 50%;
        position: relative;
        .increase-btn {
          position: absolute;
          left: 50%;
          top: 10px;
          cursor: pointer;
          z-index: 99;
          color: #3575f6;
          &:hover {
            text-decoration: underline;
          }
        }
      }
      .cttitle{
        padding-left: 0 !important;
      }
    }
  }
}
/* steps start */
.stepsProcess {
  padding: 30px 24px 20px 24px;
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
  left: 6px;
  top: 18px;
}
.step__head {
  flex-grow: 0;
  width: 24px;
  position: relative;
}
.step__line {
  width: 1px;
  top: 0;
  bottom: 0;
  left: 6px;
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
  width: 24px;
  height: 24px;
  font-size: 14px;
  box-sizing: border-box;
  background: #fff;
  transition: 0.15s ease-out;
  border-radius: 50%;
  border: 2px solid;
  border-color: inherit;
}

.step__main {
  padding-left: 10px;
  flex-grow: 1;
  white-space: normal;
  text-align: left;
}

.circle {
  width: 12px;
  height: 12px;
  border: 3px solid #d3dbeb;
  margin-right: 20px;
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
  width: 200px;
  height: 30px;
  line-height: 30px;
  background: #ffffff;
  border: 1px solid #ebebeb;
  border-radius: 4px;
  margin-top: 6px;
  padding-left: 4px;
}

/* steps end */
</style>

