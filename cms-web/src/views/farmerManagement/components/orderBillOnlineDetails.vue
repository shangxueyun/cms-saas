<template>
  <div class="orderBillOnlineDetails">
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
            <div><i></i>订单进度</div>
          </div>
          <div class="order-progress">
            <el-steps :active="orderProcessLength" align-center>
              <el-step :title="item.remark" 
                       :description="timeFormat(item.orderProcessTime)"
                       :key="index"
                       icon="iconfont icon-biaoti"
                        v-for="(item, index) in draweDetaileData.orderProcess"></el-step>
            </el-steps>
          </div>
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
              <p>{{draweDetaileData.tenantReferred}}</p>
            </div>
            <div class="item">
              <span>当前进度</span>
              <p>{{orderStatusFormat(draweDetaileData.orderStatus)}}</p>
            </div>
            <div class="item">
              <span>取货号</span>
              <p>{{draweDetaileData.pickupNumber}}</p>
            </div>
            <div class="item">
              <span>订单号</span>
              <p>{{draweDetaileData.tenantOrderNumber}}</p>
            </div>
            <div class="item">
              <span>下单时间</span>
              <p>{{timeFormat(draweDetaileData.order && draweDetaileData.order.createOrderTime)}}</p>
            </div>
            <div class="item">
              <span>预计送达时间</span>
              <p>{{timeFormat(draweDetaileData.order && draweDetaileData.order.planLastDeliveryTime)}}</p>
            </div>
            <div class="item">
              <span>客户</span>
              <p>{{draweDetaileData.order && draweDetaileData.order.contactPerson}}</p>
            </div>
            <div class="item">
              <span>客户电话</span>
              <p>{{draweDetaileData.order && draweDetaileData.order.contactNumber}}</p>
            </div>
            <div class="item">
              <span>客户备注</span>
              <p>{{draweDetaileData.remark}}</p>
            </div>
            <div class="item">
              <span>送货地址</span>
              <p>{{draweDetaileData.order && draweDetaileData.order.address}}</p>
            </div>
            <div class="item">
              <span>配送员</span>
              <p>{{draweDetaileData.distributionPersonName}}</p>
            </div>
            <div class="item">
              <span>配送员电话</span>
              <p>{{draweDetaileData.distributionTelephone}}</p>
            </div>
            <div class="item">
              <span>取消原因</span>
              <p>{{draweDetaileData.refundRenson}}</p>
            </div>
            <div class="item">
              <!-- <span>处理结果</span>
              <p>{{applyStatusFormat(draweDetaileData.applyStatus)}}</p> -->
            </div>
            <div class="item"></div>
          </div>
          <div class="half_page_title"
               style="width:100%">
            <div><i></i>商品信息</div>
          </div>
          <div class=""
               style="padding:15px;background: #fff;margin-bottom:15px">
            <el-table :data="draweDetaileData.details"
                      style="width: 100%">
              <el-table-column prop="goodsName"
                               align="center"
                               label="商品名称"></el-table-column>
              <el-table-column prop="goodsSpecificationUnit"
                               :formatter="specificationFormat"
                               align="center"
                               label="规格"></el-table-column>
              <el-table-column prop="number"
                               align="center"
                               label="数量"> </el-table-column>
              <el-table-column prop="goodsPrice"
                               align="center"
                               label="售价/元"></el-table-column>
              <el-table-column align="center"
                               :formatter="priceFormat"
                               label="金额/元"> </el-table-column>
            </el-table>
          </div>
          <div class="half_page_title"
               style="width:100%">
            <div><i></i>支付信息</div>
          </div>
          <div class="contentItem">
            <div class="item">
              <span>客户实付/元</span>
              <p>{{draweDetaileData.actualPayment}}</p>
            </div>
            <div class="item">
              <span>优惠券金额/元</span>
              <p>{{draweDetaileData.couponAmount}}</p>
            </div>
            <div class="item">
              <span>本单预计收入/元</span>
              <p>{{draweDetaileData.estimateAmount}}</p>
            </div>
            <div class="item">
              <span>退款金额/元</span>
              <p>{{draweDetaileData.refundAmount}}</p>
            </div>
            <div class="item">
              <span>平台服务费/元</span>
              <p>{{draweDetaileData.serviceAmount}}</p>
            </div>
          </div>
          <div class="half_page_title"
               v-if="draweDetaileData.applyRefundRecords.length"
               style="width:100%">
            <div><i></i>退款单信息</div>
          </div>
          <div class=""
               v-if="draweDetaileData.applyRefundRecords.length"
               style="padding:15px;background: #fff;margin-bottom:15px">
            <el-table :data="draweDetaileData.applyRefundRecords"
                      style="width: 100%">
              <el-table-column prop="refundOrderNumber"
                               align="center"
                               label="退款单号"></el-table-column>
              <el-table-column prop="orderDetail.goodsName"
                               align="center"
                               label="商品名称"></el-table-column>
              <el-table-column prop="orderDetail.goodsSpecificationUnit"
                               :formatter="specificationFormat3"
                               align="center"
                               label="规格"></el-table-column>
              <el-table-column prop="refundNumber"
                               align="center"
                               label="数量"> </el-table-column>
              <el-table-column prop="orderDetail.goodsPrice"
                               align="center"
                               label="售价/元"></el-table-column>
              <el-table-column :formatter="priceFormat2"
                               align="center"
                               label="金额/元"> </el-table-column>
              <el-table-column prop="createDateTime"
                               width="180"
                               :formatter="createDateTimeFormat"
                               align="center"
                               label="申请退款时间"></el-table-column>
              <el-table-column label="操作"
                               align="center">
                <template slot-scope="scope">
                  <span @click="handleEdit(scope.$index, scope.row)"
                        class="cheackDetails">查看</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <!-- <span @click="onHide"
              class="details_cannelBtn"
              style="background:none">取消</span>
        <span class="saveSubmit"
              @click="addBrand()">保存</span> -->
      </div>
    </drawer>
    <!--  -->
    <refundDetails :detailsdrawershow="refundShow"
                   :projectManagementName="draweDetaileData.projectManagementName"
                   ref="refundDetails"
                   :draweDetaileData="refundData"
                   @drawerClose="refundClose" />
  </div>
</template>

<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import aliUpload from '@/components/aliUpload.vue'
import refundDetails from './refundDetails.vue'
import axios from 'axios'
import * as JSOG from 'jsog'
export default {
  name: 'orderBillOnlineDetails',
  components: {
    Drawer,
    aliUpload,
    refundDetails
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    draweDetaileData: {
      type: Object,
      default: {
        order: {},
        details: [],
        orderProcess: [],
        applyRefundRecords: [{ orderDetail: {} }]
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
          this.orderProcessLength = this.draweDetaileData.orderProcess.length
        }
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      refundShow: false,
      refundData: {
        refundImageUrlArr: [],
        orderDetail: {},
        tenantOrder: {
          order: {}
        },
        tenantOrderDetail: []
      },
      tableData: [],
      projectManagementId: '',
      value: '',
      options1: [],
      drawerTitle: '订单详情',
      currentPage: 1,
      totalPages: 1,
      pgNum: 1,
      total: 1,
      pgSize: 15,
      orderProcessLength: 0
    }
  },
  mounted () {

  },
  methods: {
    createDateTimeFormat (row, cloum) {
      if (row.createDateTime) {
        return row.createDateTime.replace('T', ' ')
      }
    },
    timeFormat (t) {
      if (t) {
        return t.replace('T', ' ')
      }
    },
    specificationFormat (row, cloum) {
      if (row.goodsSpecification && row.goodsSpecification !== '0') {
        return row.goodsSpecification + row.goodsSpecificationUnit
      } else {
        return row.goodsSpecificationUnit
      }
    },
    // specificationFormat2 (row, cloum) {
    //   if (row.goodsSpecification && row.goodsSpecification !== '0') {
    //     return row.number
    //   } else {
    //     return row.number + row.goodsSpecificationUnit
    //   }
    // },
    specificationFormat3 (row, cloum) {
      if (row.orderDetail.goodsSpecification && row.orderDetail.goodsSpecification !== '0') {
        return row.orderDetail.goodsSpecification + row.orderDetail.goodsSpecificationUnit
      } else {
        return row.orderDetail.goodsSpecificationUnit
      }
    },
    // specificationFormat4 (row, cloum) {
    //   if (row.orderDetail.goodsSpecification && row.orderDetail.goodsSpecification !== '0') {
    //     return row.orderDetail.number
    //   } else {
    //     return row.orderDetail.number + row.orderDetail.goodsSpecificationUnit
    //   }
    // },
    priceFormat (row, index) {
      return (row.goodsPrice * row.number).toFixed(2)
    },
    priceFormat2 (row, index) {
      return (row.orderDetail.goodsPrice * row.refundNumber).toFixed(2)
    },
    applyStatusFormat (applyStatus) {
      if (applyStatus === 'INPROCESS') {
        return '处理中'
      } else if (applyStatus === 'SUCCESS') {
        return '退款成功'
      } else if (applyStatus === 'FAIL') {
        return '退款失败'
      }
    },
    orderStatusFormat (orderStatus) {
      // 待接单、已接单、拣货中、待配送、配送中、已完成、已取消
      //  'NOT_ACCEPTORDER', 'ACCEPTORDER', 'PREPAREGOODS', 'NOT_DISTRIBUTION', 'DISTRIBUTION', 'CANCELLED', 'COMPLETE'
      if (orderStatus === 'CANCELLED') {
        return '已取消'
      } else if (orderStatus === 'COMPLETE') {
        return '已完成'
      } else if (orderStatus === 'DISTRIBUTION') {
        return '配送中'
      } else if (orderStatus === 'NOT_DISTRIBUTION') {
        return '待配送'
      } else if (orderStatus === 'ACCEPTORDER') {
        return '已接单'
      } else if (orderStatus === 'NOT_ACCEPTORDER') {
        return '待接单'
      } else if (orderStatus === 'NOT_PAY') {
        return '未支付'
      }
    },
    handleEdit (index, row) { // 查看退款单详情
      context.http.get(`ord/api/applyRefundRecords/${row.id}`).then(res => {
        if (res) {
          this.refundData = res.data
          this.refundShow = true
        }
      })
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
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
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    refundClose () {
      this.refundShow = false
    },
    onHide () {
      // this.$refs['draweDetaileData'].resetFields()
      this.$emit('drawerClose', false)
    }
  }
}
</script>
<style lang="scss" >
.orderBillOnlineDetails {
  .el-table::before {
    height: 0;
  }
  .el-step__title {
    font-size: 14px;
  }
  .is-finish {
    color: #666666!important;
    border-color: #FFAB03!important;
  }
  .el-step__title.is-process {
    color: #FFAB03;
  }
  .iconfont{
    color: #FFAB03;
  }
}
</style>
<style lang="scss" scoped>
.orderBillOnlineDetails {
  .main_content {
    .cheackDetails {
      display: inline-block;
      width: 56px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border-radius: 3px;
      color: #3575f6;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
    .order-progress{
      background-color: #fff;
      padding-top: 15px;
    }
    .contentItem {
      padding: 15px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      background-color: #fff;
      margin-bottom: 15px;
      // min-height: 200px;
      overflow-y: auto;
      > .item {
        width: 24%;
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
.orderBillOnlineDetails {
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
    width: 1100px;
    height: calc(100% - 80px) !important;
  }
}
</style>
