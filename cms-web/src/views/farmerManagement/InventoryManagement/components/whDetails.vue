<template>
  <div class="orderBillDetails">
    <drawer class="drawer_new"
            :show="detailsdrawershow"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="details_content drawer-body"
           slot="drawer">
        <div class="main_content"
             style="height:100%;padding:0;background-color: #F7F7F7;">
          <div class="half_page_title"
               style="width:100%">
            <div><i></i>基本信息</div>
          </div>
          <div class="contentItem">
            <div class="item">
              <span>项目简称</span>
              <p>{{draweDetaileData.projectManagementName}}</p>
            </div>
            <div class="item">
              <span>品牌名称</span>
              <p>{{draweDetaileData.tenantName}}</p>
            </div>
            <div class="item">
              <span>订单号</span>
              <p>{{draweDetaileData.orderNumber}}</p>
            </div>
            <div class="item"
                 v-if="draweDetaileData.orderType==='REFUND'">
              <span>原订单号</span>
              <p style="color:#3575F6">{{draweDetaileData.oldOrderNumber}}</p>
            </div>
            <div class="item">
              <span>订单类型</span>
              <p>{{orderTypeFormat(draweDetaileData.orderType)}}</p>
            </div>
            <div class="item">
              <span>订单状态</span>
              <p>{{orderResultFormat(draweDetaileData.orderResult)}}</p>
            </div>
            <div class="item">
              <span>订单时间</span>
              <p>{{draweDetaileData.orderTime ? draweDetaileData.orderTime.replace('T',' ') : null}}</p>
            </div>
            <div class="item">
              <span>账户</span>
              <p>{{draweDetaileData.account}}</p>
            </div>
            <div class="item">
            </div>
          </div>
          <div class="half_page_title"
               style="width:100%">
            <div><i></i>商品信息</div>
          </div>
          <div class="contentItem">
            <el-table :data="draweDetaileData.goodsOrderList"
                      style="width: 100%">
              <el-table-column prop="name"
                               align="center"
                               label="商品名称"> </el-table-column>
              <el-table-column prop="number"
                               align="center"
                               label="数量"> </el-table-column>
              <el-table-column prop="unit"
                               align="center"
                               label="单位"></el-table-column>
              <el-table-column prop="unitPrice"
                               align="center"
                               label="单价/元"></el-table-column>
              <el-table-column prop="amount"
                               align="center"
                               label="金额/元"> </el-table-column>
            </el-table>
          </div>
          <div class="half_page_title"
               style="width:100%">
            <div><i></i>支付信息</div>
          </div>
          <div class="contentItem">
            <div class="item">
              <span>订单金额/元</span>
              <p>{{draweDetaileData.orderAmount}}</p>
            </div>
            <div class="item">
              <span>优惠金额/元</span>
              <p>{{draweDetaileData.discount}}</p>
            </div>
            <div class="item">
              <span>实收金额/元</span>
              <p>{{draweDetaileData.sjAmount}}</p>
            </div>
            <div class="item">
              <span>支付方式</span>
              <p>{{payMethodFormat(draweDetaileData.payMethod)}}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- <div slot="footer"
           class="dialog-footer">
        <span @click="onHide"
              class="details_cannelBtn"
              style="background:none">取消</span>
        <span class="saveSubmit"
              @click="addBrand()">保存</span>
      </div> -->
    </drawer>
  </div>
</template>

<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import aliUpload from '@/components/aliUpload.vue'
import axios from 'axios'
import * as JSOG from 'jsog'
export default {
  name: 'whDetails',
  components: {
    Drawer,
    aliUpload
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    draweDetaileData: {
      type: Object,
      default: {
        orderTime: ''
      }
    }
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
  },
  watch: {
    detailsdrawershow: {
      handler (newValue, oldValue) {
        if (newValue) {
        }
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      tableData: [],
      projectManagementId: '',
      value: '',
      options1: [],
      drawerTitle: '订单详情'
    }
  },
  mounted () {

  },
  methods: {
    orderTypeFormat (type) {
      // SALE 销售, REFUND 退货
      if (type === 'SALE') {
        return '销售'
      } else if (type === 'REFUND') {
        return '退货'
      }
    },
    orderResultFormat (type) {
      if (type === 'WAIT') {
        return '处理中'
      } else if (type === 'SUCCESS') {
        return '成功'
      } else if (type === 'FAIL') {
        return '失败'
      }
    },
    payMethodFormat (payMethod) {
      // CRASH 现金, WECHAT 微信, ALIPAY 支付宝, BLANK 网银
      if (payMethod === 'CRASH') {
        return '现金'
      } else if (payMethod === 'WECHAT') {
        return '微信'
      } else if (payMethod === 'ALIPAY') {
        return '支付宝'
      } else if (payMethod === 'BLANK') {
        return '网银'
      }
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    onHide () {
      // this.$refs['draweDetaileData'].resetFields()
      this.$emit('drawerClose', false)
    }
  }
}
</script>
<style lang="scss" >
.orderBillDetails {
  .el-table::before {
    height: 0;
  }
}
</style>
<style lang="scss" scoped>
.orderBillDetails {
  .main_content {
    .contentItem {
      padding: 15px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      background-color: #fff;
      margin-bottom: 15px;
      min-height: 200px;
      overflow-y: auto;
      > .item {
        width: 30%;
        font-size: 14px;
        margin-bottom: 20px;
        > span {
          color: #777777;
        }
        > p {
          color: #262626;
          word-break: break-word;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.orderBillDetails {
  .dialog-footer {
    > span {
      display: inline-block;
      color: #777777;
      height: 34px;
      line-height: 34px;
      text-align: center;
      padding: 0 21px;
      cursor: pointer;
      background: rgba(243, 244, 250, 1);
      border-radius: 4px;
      margin-left: 10px;
      &.closeBtn {
      }
      &.saveBtn {
        border: 1px solid rgba(53, 117, 246, 1);
        color: #3575f6;
      }
      &.saveSubmit,
      &.passBtn {
        background: rgba(53, 117, 246, 1);
        color: #fff;
      }
      &.rejectBtn {
        color: #e0434e;
        background: rgba(253, 235, 237, 1);
        border: 1px solid #c1bdbd;
      }
    }
  }
  .details_content {
    width: 750px;
    height: calc(100% - 80px) !important;
  }
}
</style>
