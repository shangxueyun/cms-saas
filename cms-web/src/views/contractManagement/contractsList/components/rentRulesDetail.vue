<template>
  <div class="rent-rules-detail clearfix">
    <div class="dc-right float-right">
      <div class="dr-head">
        计算方式
        <span class="iconfont icon-bottom"
              :class="{'icon-top': !showRentAccount}"
              @click="showRentAccount = !showRentAccount"></span>
      </div>
      <div class="selected-housing"
            v-if="showRentAccount">
        <div class="cttitle">计租面积类型<i class="required">*</i>
          <div>{{areaType(detailDataContracts.areaTypeRent)}}</div>
        </div>
        <div class="cttitle">计租面积/m²<i class="required">*</i>
          <div v-if="detailDataContracts.areaTypeRent === 'BUILDING'">{{detailDataContracts.area}}</div>
          <div v-if="detailDataContracts.areaTypeRent === 'USING'">{{detailDataContracts.useArea}}</div>
          <div v-if="!detailDataContracts.areaTypeRent"></div>
        </div>
        <div class="cttitle">计算进位方式<i class="required">*</i>
          <div>{{carryMode(detailDataContracts.carryModeRent)}}</div>
        </div>
      </div>
    </div>
    <div class="dc-right float-right">
      <div class="dr-head">
        租赁条款
        <span class="iconfont icon-bottom"
              :class="{'icon-top': !showLeaseTerms}"
              @click="showLeaseTerms = !showLeaseTerms"></span>
      </div>
      <div class="selected-housing"
            v-if="showLeaseTerms">
        <div class="cttitle">开始时间<i class="required">*</i>
          <div v-if='detailData.rentClauses[0]'>{{detailData.rentClauses[0].startDate}}</div>
        </div>
        <div class="cttitle">结束时间<i class="required">*</i>
          <div v-if='detailData.rentClauses[0]'>{{detailData.rentClauses[0].endDate}}</div>
        </div>
        <div class="cttitle">租金保证金金额/元<i class="required">*</i>
          <div v-if='detailData.rentClauses[0]'>{{detailData.rentClauses[0].deposit}}</div>
        </div>
        <div v-if="rentalMethod === 'RENT'"
              class="cttitle">初始单价<i class="required">*</i>
          <div v-if='detailData.rentClauses[0]'>{{detailData.rentClauses[0].price}}{{priceUnitFormat(detailData.rentClauses[0].priceUnit)}}</div>
        </div>
        <div v-if="rentalMethod !== 'RENT'"
              class="cttitle">租金抽成比例<i class="required">*</i>
          <div v-if='detailData.rentClauses[0]'>{{detailData.rentClauses[0].point}}%/月</div>
        </div>
        <div v-if="rentalMethod === 'GUARANTEEPOINT'"
              class="cttitle">保底价<i class="required">*</i>
          <div v-if='detailData.rentClauses[0]'>{{detailData.rentClauses[0].price}}{{priceUnitFormat(detailData.rentClauses[0].priceUnit)}}</div>
        </div>
        <div class="cttitle" v-if="rentalMethod !== 'POINTS'">计费类型<i class="required">*</i>
          <div v-if='detailData.rentClauses[0]'>{{formatBillType(detailData.rentClauses[0].billingType)}}</div>
        </div>
        <!-- v-if="rentalMethod !== 'POINTS' && detailData.rentClauses[0].billingType==='MONTH' && detailData.rentClauses[0].priceUnit==='M2DAYS' && detailData.rentClauses[0].priceUnit !== 'YEAR'" 年天数展示判断条件 -->
        <div class="cttitle" v-if="rentalMethod !== 'POINTS'">年天数<i class="required">*</i>
          <div v-if='detailData.rentClauses[0]'>{{detailData.rentClauses[0].yearDay}}</div>
        </div>
        <!-- {{detailData.rentClauses[0].priceUnit !== 'YEAR' ? '/月' : '/年'}} -->
        <div class="cttitle">付款周期/月<i class="required">*</i>
          <div v-if='detailData.rentClauses[0]'>{{detailData.rentClauses[0].month}}</div>
        </div>
        <div class="cttitle">账单划分方式<i class="required">*</i>
          <div v-if='detailData.rentClauses[0]'>{{ formatbillDivision(detailData.rentClauses[0].billDivision)}}</div>
        </div>
        <div class="cttitle">首个免租期是否包含在租金账单内<i class="required">*</i>
          <div v-if='detailData.rentClauses[0]'>{{formatOfferReocrd(detailData.rentClauses[0].onBillContainFirstOfferReocrd)}}</div>
        </div>
        <div v-if="rentalMethod === 'RENT'" class="cttitle">账单应收日期<i class="required">*</i>
          <div v-if='detailData.rentClauses[0]'>
            <span v-if="detailData.rentClauses[0].dayType === 'TOP'" style="width: 100%;padding-left: 0">提前{{detailData.rentClauses[0].dayNumber}}天</span>
            <span v-else style="width: 100%;padding-left: 0">固定{{detailData.rentClauses[0].dayNumber}}日</span>
          </div>
        </div>
        <div v-if="rentalMethod !== 'RENT'"
              class="cttitle">账单应收日期，次月<i class="required">*</i>
          <div v-if='detailData.rentClauses[0]'>{{detailData.rentClauses[0].dayNumber}}日</div>
        </div>
        <div class="cttitle">滞纳金比例
          <div>{{detailData.rentClauses[0].lateFeeRate}}{{detailData.rentClauses[0].lateFeeRate ? '%' : ''}}/天</div>
        </div>
      </div>
    </div>
    <div class="dc-right float-right">
      <div class="dr-head">
        租金递增
        <span class="iconfont icon-bottom"
              :class="{'icon-top': !showRentIncrements}"
              @click="showRentIncrements = !showRentIncrements"></span>
      </div>
      <div class="selected-housing"
            v-if="showRentIncrements"
            v-for="(item, index) in detailData.rentClauses[0].incrementRates"
            :key="index">
        <div class="cttitle">递增开始时间<i class="required">*</i>
          <div>{{item.startDate}}</div>
        </div>
        <div class="cttitle">递增结束时间<i class="required">*</i>
          <div>{{item.endDate}}</div>
        </div>
        <div v-if="rentalMethod === 'RENT'"
              class="cttitle">租金单价递增<i class="required">*</i>
          <div>{{item.number}}{{formatUnit(item.incrementUnit)}}</div>
        </div>
        <div v-if="rentalMethod !== 'RENT'"
              class="cttitle">租金抽成比例<i class="required">*</i>
          <div>{{item.point}}%/月</div>
        </div>
        <div v-if="rentalMethod === 'GUARANTEEPOINT'"
              class="cttitle">保底价<i class="required">*</i>
          <div>{{item.number}}{{priceUnitFormat(detailData.rentClauses[0].priceUnit)}}</div>
        </div>
      </div>
    </div>
    <div class="dc-right float-right" v-if="detailData.rentClauses[0].offerRecords && detailData.rentClauses[0].offerRecords.length > 0">
      <div class="dr-head">
        租金优惠
        <span class="iconfont icon-bottom"
              :class="{'icon-top': !showRentConcessions}"
              @click="showRentConcessions = !showRentConcessions"></span>
      </div>
      <div class="selected-housing"
            v-if="showRentConcessions"
            v-for="(item, index) in detailData.rentClauses[0].offerRecords"
            :key="index">
        <div class="cttitle">优惠类型<i class="required">*</i>
          <div>{{formatOfferType(item.offerType)}}</div>
        </div>
        <div class="cttitle">优惠开始时间<i class="required">*</i>
          <div>{{item.yhStartDate}}</div>
        </div>
        <div class="cttitle">优惠结束时间<i class="required">*</i>
          <div>{{item.yhEndDate}}</div>
        </div>
      </div>
    </div>
    <div v-if="detailDataContracts.startDate===detailData.rentClauses[0].startDate && detailDataContracts.zxDeposit && detailDataContracts.zxEndtDate && detailDataContracts.zxStartDate" class="dc-right float-right">
      <div class="dr-head">
        装修保证金
        <span class="iconfont icon-bottom"
              :class="{'icon-top': !showRentBond}"
              @click="showRentBond = !showRentBond"></span>
      </div>
      <div class="selected-housing"
            v-if="showRentBond">
        <div class="cttitle">开始时间
          <div>{{detailDataContracts.zxStartDate}}</div>
        </div>
        <div class="cttitle">结束时间
          <div>{{detailDataContracts.zxEndtDate}}</div>
        </div>
        <div class="cttitle">装修保证金金额
          <div>{{detailDataContracts.zxDeposit}}</div>
        </div>
        
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
          rooms: [{
            'projectManagement': {
              'previewImage': '',
              'projectManagement': ''
            }
          }],
          rentClauses: [
            {
              startDate: '',
              endDate: '',
              deposit: '',
              proportion: '',
              month: '',
              dayNumber: '',
              billingType: '',
              yearDay: ''
            },
            {
              startDate: '',
              endDate: '',
              deposit: '',
              proportion: '',
              month: '',
              dayNumber: '',
              billingType: '',
              yearDay: ''
            }
          ]
        }
      }
    }
  },
  watch: {
    rulesDetailData: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.detailData.rentClauses[0] = newVal
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
      detailData: {rentClauses: [{}]}
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
    }
  }
}
</script>
<style lang="scss" scoped>
 .rent-rules-detail{
   .dc-right {
      width: 100% !important;
      border: 1px solid #e7e7e7;
      margin-top: 20px;
      .other-info {
        width: 98%;
        margin: 0 auto;
      }
      .dr-head {
          background-color: #fafafa;
          height: 40px;
          line-height: 40px;
          padding-left: 12px;
          font-size: 14px;
          margin-bottom: 24px;
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
			margin-bottom: 15px;
			font-size: 12px;

			span {
				display: inline-block;
				width: 19%;
				padding-left: 40px;
				vertical-align: top;
			}

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
				float: left;
				display: inline-block;
				width: 33%;
				padding-left: 20px;
				margin-bottom: 20px;

				div {
					padding-top: 10px;
				}
			}
			.operation-li{
				span {
					color: #0F75FF;
				}
			}
		}
 }
</style>

