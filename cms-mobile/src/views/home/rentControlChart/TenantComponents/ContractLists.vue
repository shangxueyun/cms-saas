<template>
  <div class="ContractLists">
    <div class="content-title" id="tab">合同列表</div>
    <div class="basic-information" :style="{minHeight: minHeight}"  v-if="contractsList.length > 0">
      <div v-for="(item, index) in contractsList" :key="index">
        <div class="ul-warp">
          <div class="content-ul">
            <span>管理企业</span>
            <span>{{item.organizeName}}</span>
          </div>
          <div class="content-ul">
            <span>项目名称</span>
            <span>{{item.referred}}</span>
          </div>
          <div class="content-ul">
            <span>楼宇名称</span>
            <span>{{item.shopNo.toString()}}</span>
          </div>
          <div class="content-ul">
            <span>合同起止日</span>
            <span v-show='item.startDate && item.endDate'>{{item.startDate}} 至 {{item.endDate}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="contract-div" :style="{minHeight: minHeight}"  v-if="contractsList.length > 0">
      <ul v-for="(item, index) in contractsList">
        <li>
          <span class="lease-way">{{formatRentalMethod(item.rentalMethod)}}</span>
          <span class="contractstatus" :class="{
            'EXECUTING' : item.contractStatus === 'EXECUTING',
            'MATURITY' : item.contractStatus === 'MATURITY',
            'WITHDRAWAL' : item.contractStatus === 'WITHDRAWAL'
            }">{{formatterStatus(item.contractStatus)}}</span>
        </li>
        <li>
          实时单价：{{item.sPrice | toLocaleString}}{{formatsPriceUnit(item.sPriceUnit)}}
        </li>
        <li>
          {{item.startDate}} 至 {{item.endDate}}
        </li>
      </ul>
    </div> -->
    <div class="nodata" :style="{minHeight: minHeight}" v-if="contractsList.length === 0">
      暂无数据
    </div>
    <div class="loadAll">
      <span>-</span>
      <p>你碰到我的底线了</p>
      <span>-</span>
    </div>
  </div>
</template>
<script>
import context from '@/service'
export default {
  name: 'ContractLists',
  props: ['tenantID'],
  data () {
    return {
      contractsList: [],
      multipleList: [],
      minHeight: 0
    }
  },
  created () {
    this.queryContracts()
    this.getMultipleList()
  },
  mounted () {
    this.$nextTick(() => {
      let headH = document.querySelector('#app-head').clientHeight + document.querySelector('.content-head').clientHeight +
       document.querySelector('.loadAll').clientHeight + document.querySelector('#tab').clientHeight
      this.minHeight = document.body.clientHeight - headH + 'px'
    })
  },
  methods: {
    queryContracts () {
      context.http.get('cms/api/contracts/tenant', { tenantId: this.tenantID }).then(res => {
        if (res.status === 200) {
          this.contractsList = res.data
        }
      })
    },
    getMultipleList () {
      context.http.get('cms/api/management-contracts/tenant?tenantId=' + this.tenantID).then(res => {
        if (res.status === 200) {
          this.multipleList = res.data
        }
      })
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
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/config";
  .ContractLists{
    background: #fff;
    overflow: hidden;
  }
  .nodata{
    color: #666;
    padding: rem(40);
    text-align: center;
    font-size: rem(14);
  }
  .tab {
    height: rem(34);
    line-height: rem(34);
    display: flex;
    margin: rem(14) 0 rem(14) rem(14);
    span {
      display: inline-block;
      width: rem(80);
      text-align: center;
      height: rem(32);
      line-height: rem(32);
      cursor: pointer;
      background-color: #fff;
      color: #18191A;
      font-size: rem(14);
      border-radius: rem(2);
      border: rem(1) solid #D9D9D9;
      &:last-child {
        margin-left: rem(-1);
      }
    }
    .active {
      color: #0139A4;
      font-weight: bold;
      background-color: #eef4ff;
      border: rem(1) solid #C7D9FF;
    }
  }
  .contract-div{
    color: #444547;
    font-size: rem(14);
    span.lease-way{
      color: #18191A;
      font-size: rem(15);
      font-weight: bold;
    }
    .contractstatus{
      &.EXECUTING{
        color: #1CC296;
      }
      &.MATURITY{
        color: #FC5159;
      }
      &.WITHDRAWAL{
        color: #858C94;
      }
    }
    ul {
      margin-left: rem(14);
      margin-top: rem(14);
      padding-right: rem(14);
      padding-bottom: rem(14);
      border-bottom: rem(1) solid #F0F0F0;
      &:last-child {
        // border: none;
        margin-bottom: rem(10);
      }
      li {
        margin-top: rem(10);
        &:first-child {
          display: flex;
          justify-content: space-between;
        }
      }
    }
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
  .basic-information {
    margin-bottom: rem(10);
    .ul-warp {
      margin: 0 rem(14) 0 rem(14);
      border-bottom: rem(1) solid #f0f0f0;
      padding-bottom: rem(16);
      .content-ul {
        display: flex;
        justify-content: space-between;
        padding-top: rem(16);
        font-size: rem(15);
        >span {
          color: #18191a;
        }
        >span:first-child {
          color: #858C94;
          max-width: rem(76);
          margin-right: rem(10);
        }
      }
      &:last-child {
        border: none;
      }
    }
  }
</style>
