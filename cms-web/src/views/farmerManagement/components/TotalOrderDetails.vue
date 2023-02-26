<template>
  <div class="totalOrderDetails">
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
              <span>订单号</span>
              <p>{{draweDetaileData.orderNumber}}</p>
            </div>
            <div class="item">
              <span>订单金额/元</span>
              <p>{{draweDetaileData.totalFee}}</p>
            </div>
            <div class="item">
              <span>优惠券金额/元</span>
              <p>{{draweDetaileData.couponAmount}}</p>
            </div>
            <div class="item">
              <span>配送费/元</span>
              <p>{{draweDetaileData.freigh}}</p>
            </div>
            <div class="item">
              <span>下单时间</span>
              <p>{{draweDetaileData.createOrderTime?draweDetaileData.createOrderTime.replace('T',' '):''}}</p>
            </div>
            <div class="item"></div>
            <div class="item"></div>
          </div>
          <div class="half_page_title"
               style="width:100%">
            <div><i></i>子订单信息</div>
          </div>
          <div class=""
               style="padding:15px;background: #fff;margin-bottom:15px">
            <el-table :data="draweDetaileData.tenantOrders"
                      style="width: 100%">
              <el-table-column prop="tenantReferred"
                               align="center"
                               label="名牌名称"></el-table-column>
              <el-table-column prop="tenantOrderNumber"
                               align="center"
                               label="订单号"> </el-table-column>
              <el-table-column align="center"
                               :formatter="orderStatusFormat"
                               label="订单状态"> </el-table-column>
              <el-table-column prop="totalFee"
                               align="center"
                               label="订单金额/元"></el-table-column>
              <el-table-column prop="refundAmount"
                               align="center"
                               label="退款金额/元"></el-table-column>
              <el-table-column prop="actualPayment"
                               align="center"
                               label="实收金额/元"> </el-table-column>
              <el-table-column align="center"
                               :formatter="orderTimeFormat"
                               label="下单时间"> </el-table-column>
              <el-table-column label="操作"
                               align="center">
                <template slot-scope="scope">
                  <el-button @click="handleEdit(scope.$index, scope.row)"
                             class="el-button--primary operation-btn"
                             size="mini">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!-- <div class="ctc-foot1"
           v-if="total > 0">
        <span><span style="margin-right:10px">{{currentPage}}/{{totalPages}}页</span> 共{{total}}条记录</span>
        <el-pagination background
                       layout="prev, pager, next"
                       :page-size=pgSize
                       :total="total"
                       :current-page="currentPage"
                       @current-change="current_change">
        </el-pagination>
      </div> -->
      <div slot="footer"
           class="dialog-footer">
      </div>
    </drawer>
   <!-- 子订单详情 -->
  <orderBillOnlineDetails :detailsdrawershow="detailsShow"
                          ref="orderBillOnlineDetails"
                          :draweDetaileData="detaileData"
                          @drawerClose="drawerClose" />
  </div>
</template>

<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import aliUpload from '@/components/aliUpload.vue'
import refundDetails from './refundDetails.vue'
import orderBillOnlineDetails from './orderBillOnlineDetails'
import axios from 'axios'
import * as JSOG from 'jsog'
export default {
  name: 'TotalOrderDetails',
  components: {
    Drawer,
    aliUpload,
    refundDetails,
    orderBillOnlineDetails
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

        }
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      detaileData: {},
      detailsShow: false,
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
      pgSize: 15
    }
  },
  mounted () {

  },
  methods: {
    orderTimeFormat (row, colmn) {
      if (row.order.createOrderTime) {
        return row.order.createOrderTime.replace('T', ' ')
      } else {
        return ''
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
    orderStatusFormat (row, colmn) {
      // 待接单、已接单、拣货中、待配送、配送中、已完成、已取消
      //  'NOT_ACCEPTORDER', 'ACCEPTORDER', 'PREPAREGOODS', 'NOT_DISTRIBUTION', 'DISTRIBUTION', 'CANCELLED', 'COMPLETE'
      if (row.orderStatus === 'CANCELLED') {
        return '已取消'
      } else if (row.orderStatus === 'COMPLETE') {
        return '已完成'
      } else if (row.orderStatus === 'DISTRIBUTION') {
        return '配送中'
      } else if (row.orderStatus === 'NOT_DISTRIBUTION') {
        return '待配送'
      } else if (row.orderStatus === 'ACCEPTORDER') {
        return '已接单'
      } else if (row.orderStatus === 'NOT_ACCEPTORDER') {
        return '待接单'
      } else if (row.orderStatus === 'NOT_PAY') {
        return '未支付'
      }
    },
    handleEdit (index, row) {
      context.http.get(`ord/api/tenantOrders/detail/${row.id}`).then(res => {
        if (res) {
          this.detaileData = res.data
          this.detailsShow = true
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
    },
    drawerClose () {
      this.detailsShow = false
    }
  }
}
</script>
<style lang="scss" >
.totalOrderDetails {
  .el-table::before {
    height: 0;
  }
}
</style>
<style lang="scss" scoped>
.totalOrderDetails {
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
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.totalOrderDetails {
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
