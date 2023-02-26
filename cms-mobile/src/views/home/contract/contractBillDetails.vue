<template>
  <div class="contractBillDetails">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="$router.go(-1)"></i>
      <div class="headTab">
        <span @click="$router.replace({name: 'contractBasicInfo', query: {id:contractId}})">基本信息</span>
        <span class="active">账单信息</span>
      </div>
      <div class="addBtn"></div>
    </div>
    <div class="content">
      <!-- <div class="basic-information">
        <div class="content-title">单价</div>
        <div class="ul-warp">
          <div class="content-ul">
            <span>初始单价</span>
             <span v-if="contractDetails.projectManagement">{{contractDetails.cPrice | toLocaleString}}{{priceUnitFormat(contractDetails.cPriceUnit)}}</span>
          </div>
          <div class="content-ul">
            <span>实时单价</span>
            <span v-if="contractDetails.projectManagement">{{contractDetails.sPrice | toLocaleString}}{{priceUnitFormat(contractDetails.sPriceUnit)}}</span>
          </div>
        </div>
      </div> -->
      <div class="basic-information">
        <div class="content-title">账单规则</div>
        <ul v-if="contractRulesData.length" class="list">
          <li v-for="(item, index) in contractRulesData" :key="index" @click="goRules(item)">
            <p>
              <span>{{item.termType === 'PROPERTY' ? '物业费' : '租金'}}</span>
              <span>创建时间：{{item.createdDate ? item.createdDate.substring(0, 10) : ''}}</span>
            </p>
            <div>
              <p>付款周期/月：{{item.month}}</p>
              <!-- <p v-if="item.termType === 'PROPERTY'">初始单价：{{item.price}}{{priceUnitFormat(item.priceUnit)}}</p>
              <p v-if="item.termType === 'RENT' && contractDetails.rentalMethod === 'RENT'">初始单价：{{item.price}}{{priceUnitFormat(item.priceUnit)}}</p>
              <p v-if="item.termType === 'RENT' && contractDetails.rentalMethod === 'POINTS'">初始单价：{{item.point}}%/月</p>
              <p v-if="item.termType === 'RENT' && contractDetails.rentalMethod === 'GUARANTEEPOINT'">初始单价：{{item.point}}%/月或{{item.price}}{{priceUnitFormat(item.priceUnit)}}</p> -->
              <p>{{item.startDate}} 至 {{item.endDate}}</p>
            </div>
            <span class="iconfont iconright"></span>
          </li>
        </ul>
        <div v-else class="noData_text">暂无数据</div>
      </div>
      <div style="margin-bottom:0;" class="basic-information">
        <div class="content-title">账单列表</div>
        <ul v-if="billList.length" v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loadBottom"
          infinite-scroll-distance="20"
          infinite-scroll-immediate-check="false" class="list">
          <li v-for="(item, index) in billList" :key="index">
            <p>
              <span>{{item.feeTypeName}}</span>
              <span>应收时间：{{item.finalPaymentDate}}</span>
            </p>
            <div>
              <p>账单金额（元）：{{ item.amount | toLocaleString }} <span v-if="item.remake && item.feeTypeName === '租金保证金'">{{ item.remake }}</span></p>
              <p>已收金额（元）：{{ item.sjAmount | toLocaleString }}</p>
              <p>计费周期：{{item.startDate}} 至 {{item.endDate}}</p>
            </div>
            <span :style="{color: item.billStatus === 'OK' ? '#1CC296' : '#FC5159'}" class="billStatus">{{formatterBillStatus(item)}}</span>
          </li>
        </ul>
        <div v-else class="noData_text">暂无数据</div>
      </div>
      <div v-if='loadAll' class="loadAll contractLoadAll">
        <span>-</span>
        <p>已经到底了</p>
        <span>-</span>
      </div>
    </div>
  </div>
</template>
<script>
import context from '@/service'
import common from '@/utils/common.js'
import { InfiniteScroll } from 'mint-ui'
export default {
  name: 'contractBillDetails',
  components: { InfiniteScroll },
  data () {
    return {
      contractId: '',
      contractDetails: {},
      contractRulesData: [],
      billList: [],
      page: 0,
      size: 10,
      loadBottom: false,
      loadAll: false
    }
  },
  created () {
    this.contractId = this.$route.query.id
    this.getContractDetails()
  },
  mounted () {
    this.$parent.$refs['content'].scrollTop = 0
  },
  methods: {
    async getContractDetails () {
      let res = await context.http.get('cms/api/contracts/' + this.contractId)
      this.contractDetails = res.data
      this.queryContractRules()
      this.contractBill()
    },
    queryContractRules () {
      context.http.get('cms/api/rent-clauses?sort=termType,desc&sort=createdDate,desc', { contractId: this.contractId }).then(res => {
        this.contractRulesData = res.data
      })
    },
    loadMore () {
      this.loadBottom = true
      this.contractBill()
    },
    contractBill () {
      context.http.get(`cms/api/bills/business/statisics/${this.contractId}?sort=startDate,asc&sort=endDate,asc&sort=finalPaymentDate,asc&sort=feeType,asc`, { page: this.page, size: this.size }).then(res => {
        this.billList = this.billList.concat(res.data.list)
        if (this.billList.length === Number(res.headers['x-total-count'])) this.loadAll = true
        if (res.data.list.length > 0) {
          this.loadBottom = false
          this.page = this.page + 1
        } else {
          this.page = this.page - 1
        }
      })
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
    goRules (item) {
      if (item.termType === 'PROPERTY') {
        this.$router.push({name: 'PropertyfeeRules', query: {'contractsID': this.contractId, 'rulesID': item.id}})
      } else {
        this.$router.push({name: 'RentRules', query: {'contractsID': this.contractId, 'rulesID': item.id}})
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
.contractBillDetails{
  .noData_text {
    height: rem(80);
    line-height: rem(80);
    text-align: center;
    color: #878a9a;
  }
  .head {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: rem(40);
    line-height: rem(40);
    overflow: hidden;
    text-align: center;
    font-size: rem(16);
    background: #fff;
    display: flex;
    justify-content: space-between;
    z-index: 9;
    box-shadow: 0px 1px 4px 0px rgba(230, 230, 230, 0.5);
    .headTab {
      color: #444547;
      font-size: rem(16);
      width: rem(200);
      display: flex;
      justify-content: space-between;
      > span {
        position: relative;
        &.active {
          color: #0139a4;
          border-bottom: rem(3) solid #0139a4;
          font-weight: bold;
        }
        &:nth-child(2) {
          margin-left: rem(40);
        }
      }
    }
    .back {
      width: rem(40);
      height: rem(40);
      font-size: rem(18);
      color: #000000;
      &:first-child {
        float: left;
      }
    }
    .addBtn {
      width: rem(40);
      height: rem(40);
      position: relative;
      i{
        font-size: rem(18);
        color: #444547;
        font-size: rem(18);
      }
    }
    .selected{
      color:#0139A4;
    }
  }
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
    margin: 0 0 0 rem(14);
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
    padding-right:rem(14);
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
  .list{
    padding-left:rem(14);
    li{
      padding: rem(16) rem(14) rem(16) 0;
      position: relative;
      background: #fff;
      border-bottom: rem(1) solid #F0F0F0;
      &:last-child{
        border:0;
      }
      >p{
        display: flex;
        width:100%;
        justify-content: space-between;
        margin-bottom:rem(6);
        >span{
          display: block;
          line-height: rem(20);
          color:#858C94;
          font-size: rem(15);
          width:rem(200);
          text-align: right;
        }
        >span:first-child{
          text-align: left;
          flex: 1;
          color:#18191A;
          font-weight: 600;
          font-size: rem(15);
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          margin-right:rem(5);
          >span{
            background: #EFF6FF;
            height:rem(17);
            font-weight: 500;
            line-height: rem(17);
            font-size: rem(12);
            color:#0139A4;
            padding:0 rem(3);
            vertical-align: center;
            margin-left:rem(12);
          }
        }
      }
      >div{
        >p{
          color:#858C94;
          font-size: rem(14);
          margin-bottom:rem(6);
          &:last-child{
            margin-bottom: 0;
          }
          span{
            color:#858C94;
          }
        }
        >.momoInfo{
          font-size: rem(15);
          color:#18191A;
        }
        >.momoDate{
          font-size: rem(13);
          color:#858C94;
          text-align: right;
        }
      }
      >span{
        position: absolute;
        right:rem(10);
        top:rem(45);
        font-size: rem(17);
        color:#C6C6C6;
      }
      >.billStatus{
        font-size: rem(15);
        color:#FC5159;
        right:rem(14);
      }
    }
  }
  .an-item{
    display: flex;
    align-items: center;
    padding: rem(14) rem(14) 0;
    &:nth-of-type(2){
      margin-top: 0;
    }
    .image {
      margin-right: rem(10);
    }
    .annex-name{
      width: 80%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      margin-bottom: rem(4);
    }
    .operating {
      flex: 1;
      display: flex;
      justify-content: flex-end;
    }
  }
  .contractLoadAll{
    background: #fff;
    padding-top:rem(20);
    >p{
      width:rem(80);
    }
  }
}

</style>
