<template>
  <div class="flow-details">
    <drawer :show="detailsdrawershow"
          :title="drawerTitle"
          @on-hide="onHide">
      <div class="mainlayout" style="width: 1000px;"
          slot="drawer">
        <div class="main-content">
          <div class="content-info">
            <div>流水类型</div>
            <div>{{formatBillType(detailsData.billType)}}</div>
          </div>
          <div class="content-info">
            <div>发生额/元</div>
            <div>{{detailsData.amount | toLocaleString}}</div>
          </div>
          <div class="content-info">
            <div>匹配状态</div>
            <div>{{formatBillStatus(detailsData.flowState)}}</div>
          </div>
          <div class="content-info">
            <div>已匹配金额</div>
            <div>{{detailsData.ypAmount | toLocaleString}}</div>
          </div>
          <div class="content-info">
            <div>未匹配金额</div>
            <div>{{detailsData.wpAmount | toLocaleString}}</div>
          </div>
          <div class="content-info">
            <div>入账时间</div>
            <div>{{detailsData.recordDate}}</div>
          </div>
          <div class="content-info">
            <div>备注</div>
            <div>{{detailsData.remake}}</div>
          </div>
          <div class="matched-bills">已匹配账单</div>
          <div class="bills">
            <ul class="bills-head">
              <li>账单编号</li>
              <li>品牌</li>
              <li>费用类型</li>
              <li>账单金额/元</li>
              <li>账单状态</li>
              <li>计费周期</li>
              <li>应收时间</li>
              <li>合同编号</li>
              <li>操作</li>
            </ul>
            <ul v-for="(item, index) in detailsData.billAndFlows" :key="index">
              <li class="code" :title="item.code">{{item.code}}</li>
              <li>{{item.referred}}</li>
              <li>{{item.feeTypeName}}</li>
              <li>{{item.billAmount | toLocaleString}}</li>
              <li>{{formatBillStatus(item.billStatus)}}</li>
              <li style="line-height: 22px;">{{item.startDate}} - {{item.endDate}}</li>
              <li>{{item.finalPaymentDate}}</li>
              <li>{{item.contractNo}}</li>
              <li>
                <span class="ck-btn" @click="handleEdit(item.billId)">查看</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </drawer>
  </div>
</template>
<script>
import Drawer from '@/components/drawer.vue'
export default {
  name: 'billDetails',
  components: {
    Drawer
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    detailsData: {
      type: Object
    }
  },
  data () {
    return {
      drawerTitle: '收支流水详情'
    }
  },
  watch: {
    projectList: {
      handler: function () {
      }
    }
  },
  methods: {
    onHide () {
      this.$emit('drawerClose', false)
      this.$emit('query', false)
      this.readonly = true
    },
    handleEdit (id) {
      this.$router.push({path: '/home/billList', query: {billId: id}})
    },
    formatBillType (val) {
      return val === 'R' ? '收款' : '付款'
    },
    formatBillStatus (val) {
      let res = ''
      if (val === 'APPROVAL') {
        res = '减免审核中'
      } else if (val === 'UPDATE') {
        res = '减免驳回待修改'
      } else if (val === 'NO') {
        res = '未付款'
      } else if (val === 'OK') {
        res = '已结清'
      } else if (val === 'SECTION') {
        res = '部分结清'
      } else if (val === 'STAY_SETTLE') {
        res = '待结清'
      }
      return res
    },
    formatFeeType (val) {
      let feeType
      switch (val) {
        case 'RENT':
          feeType = '租金'
          break
        case 'RENT_DEPOSIT':
          feeType = '租金保证金'
          break
        case 'PROPERTY':
          feeType = '物业费'
          break
        case 'PROPERTY_DEPOSIT':
          feeType = '物业费保证金'
          break
        case 'INTENTION':
          feeType = '意向金'
          break
        case 'DECORATION':
          feeType = '装修保证金'
          break
        case 'F_INTENTION':
          feeType = '返还意向金'
          break
        case 'F_DECORATION':
          feeType = '返还装修保证金'
          break
        case 'WITHDRAWAL':
          feeType = '退租结算'
          break
        case 'RELEASE':
          feeType = '合同解除结算'
          break
      }
      return feeType
    }
  }
}
</script>
<style lang="scss">
.flow-details{
  .drawer-head {
    border-bottom: 1px solid rgba(229,229,229,1);
  }
  .main-content{
    position: relative;
    margin-top: 10px;
    .content-info{
      display: inline-block;
      width: 32%;
      margin-top: 20px;
      div{
        font-size: 14px;
        color: #333333;
        &:last-child{
          font-size: 12px;
          color: #666666;
          margin-top: 6px;
          min-height: 14px;
        }
      }
    }
    .matched-bills{
      margin: 40px 0 20px;
    }
    .bills{
      background:rgba(255,255,255,1);
      border:1px solid rgba(241,241,241,1);
      .bills-head{
        li{
          font-size: 12px;
          width: 11%;
          text-align: center;
          height: 30px;
          line-height: 30px;
          overflow: hidden;
        }
      }
      ul {
        display: flex;
        &:first-child{
          background:rgba(250,250,250,1);
        }
        li{
          font-size: 12px;
          width: 11%;
          text-align: center;
          height: 50px;
          line-height: 50px;
          &.code{
            font-size: 12px;
            width: 11%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      .ck-btn{
        display: inline-block;
        width: 60px;
        height: 26px;
        line-height: 25px;
        text-align: center;
        border:1px solid rgba(53,119,246,1);
        border-radius:4px;
        color:rgba(53,119,246,1);
        cursor: pointer;
      }
    }
  }
}

</style>
