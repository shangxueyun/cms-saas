<template>
  <div class="refundDetails">
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
              <p>{{projectManagementName}}</p>
            </div>
            <div class="item">
              <span>品牌名称</span>
              <p>{{draweDetaileData.tenantOrder.tenantReferred}}</p>
            </div>
            <div class="item">
              <span>退款单号</span>
              <p>{{draweDetaileData.refundOrderNumber}}</p>
            </div>
            <div class="item">
              <span>原订单号</span>
              <p>{{draweDetaileData.tenantOrder.tenantOrderNumber}}</p>
            </div>
            <div class="item">
              <span>申请人姓名</span>
              <p>{{draweDetaileData.tenantOrder.order.contactPerson}}</p>
            </div>
            <div class="item">
              <span>申请人电话</span>
              <p>{{draweDetaileData.tenantOrder.order.contactNumber}}</p>
            </div>
            <div class="item">
              <span>申请人地址</span>
              <p>{{draweDetaileData.tenantOrder.order.address}}</p>
            </div>
            <div class="item">
              <span>申请时间</span>
              <p>{{createOrderTimeFormat(draweDetaileData.createDateTime)}}</p>
            </div>
            <div class="item">
              <span>原因</span>
              <p>{{draweDetaileData.refundRenson}}</p>
            </div>
            <div class="item">
              <span>问题描述</span>
              <p>{{draweDetaileData.buyersRemark}}</p>
            </div>
            <div class="item">
              <span>处理结果</span>
              <p>{{applyStatusFormat(draweDetaileData.applyStatus)}}</p>
            </div>
            <div class="item"></div>
            <div class="item item1"
                 v-if="draweDetaileData.refundImageUrlArr.length"
                 style="width:100%">
              <span style="width:100%">申请图片<i style="color:#3575F6;font-style: normal">（点击图片预览）</i></span>
              <div class="imgBox imgBoxModel"
                   v-for="(item,index) in draweDetaileData.refundImageUrlArr"
                   style="width: 140px; height: 120px;">
                <img :src="item"
                     @click="showImg(item)"
                     class="logoImg">
                <div @click="showImg(item)"
                     class="bottomTips">预览图片</div>
              </div>
            </div>
          </div>
          <div class="half_page_title"
               style="width:100%">
            <div><i></i>商品信息</div>
          </div>
          <div class="contentItem">
            <div class="item">
              <span>商品名称</span>
              <p>{{draweDetaileData.orderDetail.goodsName}}</p>
            </div>
            <div class="item">
              <span>规格</span>
              <p>{{specificationFormat(draweDetaileData.orderDetail)}}</p>
            </div>
            <div class="item">
              <span>数量</span>
              <p>{{draweDetaileData.orderDetail.number}}</p>
            </div>
            <div class="item">
              <span>售价/元</span>
              <p>{{draweDetaileData.orderDetail.goodsPrice}}</p>
            </div>
            <div class="item">
              <span>金额/元</span>
              <p>{{(draweDetaileData.refundNumber*draweDetaileData.orderDetail.goodsPrice).toFixed(2)}}</p>
            </div>
          </div>
          <div class="half_page_title"
               style="width:100%">
            <div><i></i>退款信息</div>
          </div>
          <div class="contentItem">
            <div class="item">
              <span>退款金额/元</span>
              <p>{{draweDetaileData.estimateRefundAmount}}</p>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
      </div>
    </drawer>

    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
  </div>
</template>

<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import aliUpload from '@/components/aliUpload.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import axios from 'axios'
import * as JSOG from 'jsog'
export default {
  name: 'refundDetails',
  components: {
    Drawer,
    aliUpload,
    picturePrevie
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    draweDetaileData: {
      type: Object,
      default: {
        refundImageUrlArr: [],
        orderDetail: {},
        tenantOrder: {
          order: {}
        },
        tenantOrderDetail: []
      }
    },
    projectManagementName: {

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
      imgArr: [],
      num: 0,
      showPicture: false,
      tableData: [],
      projectManagementId: '',
      value: '',
      options1: [],
      drawerTitle: '退款单详情'
    }
  },
  mounted () {

  },
  methods: {
    createOrderTimeFormat (time) {
      if (time) {
        return time.replace('T', ' ')
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
    applyStatusFormat (applyStatus) {
      if (applyStatus === 'INPROCESS') {
        return '待审核'
      } else if (applyStatus === 'SUCCESS') {
        return '退款成功'
      } else if (applyStatus === 'FAIL') {
        return '退款失败'
      }
    },
    pictureClose () {
      this.showPicture = false
    },
    showImg (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
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
<style lang="scss" scoped>
.refundDetails {
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
        width: 24%;
        font-size: 14px;
        margin-bottom: 20px;
        &.item1 {
          display: flex;
          flex-wrap: wrap;
        }
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
.refundDetails {
  .el-table::before {
    height: 0;
  }
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
