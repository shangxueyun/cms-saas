<template>
  <div class="StockListDetails">
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
              <p v-if="recordTypeDetail === 'PURCHASE_ENTER'|| recordTypeDetail === 'PURCHASE_OUT'">{{draweDetaileData.projectManagementName}}</p>
              <p v-if="recordTypeDetail === 'STOCK_ENTER'|| recordTypeDetail === 'STOCK_OUT'">{{draweDetaileData.checkStockGoods[0].tenantGoods.projectManagementName}}</p>
            </div>
            <div class="item">
              <span>品牌名称</span>
              <p v-if="recordTypeDetail === 'PURCHASE_ENTER'|| recordTypeDetail === 'PURCHASE_OUT'">{{draweDetaileData.tenantName}}</p>
              <p v-if="recordTypeDetail === 'STOCK_ENTER'|| recordTypeDetail === 'STOCK_OUT'">{{draweDetaileData.checkStockGoods[0].tenantGoods.tenantName}}</p>
            </div>
            <!-- // 采购入库 PURCHASE_ENTER   采购退货出库 PURCHASE_OUT 销售退货入库 ORDER_ENTER  销售出库 ORDER_OUT 盘盈入库  STOCK_ENTER  盘亏出库 STOCK_OUT -->
            <div class="item"
                 v-if="recordTypeDetail === 'PURCHASE_ENTER'">
              <span>单据号</span>
              <p>{{draweDetaileData.orderNumber}}</p>
            </div>
            <div class="item"
                 v-if="recordTypeDetail === 'PURCHASE_OUT'">
              <span>退货出库单号</span>
              <p>{{draweDetaileData.orderNumber}}</p>
            </div>
            <div class="item"
                 v-if="recordTypeDetail === 'PURCHASE_OUT'">
              <span>关联采购单据号</span>
              <p>{{draweDetaileData.oldOrderNumber}}</p>
            </div>
            <div class="item"
                 v-if="recordTypeDetail === 'STOCK_ENTER' || recordTypeDetail === 'STOCK_OUT'">
              <span>盘点单号</span>
              <p>{{draweDetaileData.orderNumber}}</p>
            </div>
            <div class="item"
                 v-if="recordTypeDetail === 'PURCHASE_ENTER'">
              <span>供应商</span>
              <p>{{draweDetaileData.supplierName}}</p>
            </div>
            <div class="item"
                 v-if="recordTypeDetail === 'PURCHASE_OUT'">
              <span>供货商</span>
              <p>{{draweDetaileData.supplierName}}</p>
            </div>
            <div class="item">
              <span>单据类型</span>
              <p>{{formatRecordType(recordTypeDetail)}}</p>
            </div>
            <div class="item"
                 v-if="recordTypeDetail === 'PURCHASE_ENTER'">
              <span>入库时间</span>
              <p>{{draweDetaileData.recordDate.replace('T',' ')}}</p>
            </div>
            <div class="item"
                 v-if="recordTypeDetail === 'PURCHASE_OUT'">
              <span>出库时间</span>
              <p>{{draweDetaileData.recordDate.replace('T',' ')}}</p>
            </div>
            <div class="item"
                 v-if="recordTypeDetail === 'STOCK_ENTER' || recordTypeDetail === 'STOCK_OUT'">
              <span>出入库时间</span>
              <p>{{draweDetaileData.recordDate.replace('T',' ')}}</p>
            </div>
            <div class="item">
              <span>操作人</span>
              <p>{{draweDetaileData.userName}}</p>
            </div>
            <div class="item"></div>
            <div class="item annex"
                 v-if="recordTypeDetail === 'PURCHASE_ENTER'"
                 style="width:100%">
              <span>附件</span>
              <!-- <p v-for="(item,index) in draweDetaileData.annex">
                <span>{{item.annexName}}</span>
                <ailPreview :ailObj="item"
                            :encrypt="true"
                            @setFile="setFile" />
                <aliDownLoad :item="item"
                             :encrypt="true" /> -->
              <div style="display: flex;flex-wrap:wrap;width:700px">
                <i v-for="(item, index) in imageUrl" :key='index' style="display: flex; width: 150px;margin-top:10px">
                  <div class="imgBox imgBoxModel"
                      style="width: 140px; height: 120px;">
                      <!-- <div v-for=""> -->
                      <img :src="item"
                          @click="showImg(item, index)"
                          class="logoImg">
                      <div @click="showImg(item, index)"
                          class="bottomTips">预览图片</div>
                      <!-- <div class="iconfont icon-cms_cuowu deleteImg"
                          v-if="!readOnly"
                          @click="deleLogo(index)"></div> -->
                      <!-- </div> -->
                  </div>
                  <!-- <span class="tips"
                        v-if="showTips"
                        style="color: #e0434e;">请上传商品图片</span> -->
                </i>
                <!-- <div style="margin-top:10px">
                  <aliUpload
                  class="aliUpload deviceDetails aliUpload_new"
                  :upLoadText="upLoadText_cost"
                  :fileType="fileType_cost"
                  :iconShow="false"
                  :fileSize="fileSize"
                  :iconImg="iconImg"
                  :uploadIcon="true"
                  v-if="!readOnly"
                  @setAnnex="setAnnex" >
                  </aliUpload>
                </div> -->
              </div>
            </div>
          </div>
          <div class="half_page_title"
               style="width:100%">
            <div><i></i>商品列表</div>
          </div>
          <p class="commodity-total"
             v-if="recordTypeDetail === 'PURCHASE_ENTER'||recordTypeDetail === 'PURCHASE_OUT'">共{{draweDetaileData.purchaseGoodsDTOS.length}}种商品，合计{{draweDetaileData.amount}}元</p>
          <div class="contentItem"
               v-if="recordTypeDetail === 'PURCHASE_ENTER'">
            <el-table :data="draweDetaileData.purchaseGoodsDTOS"
                      height="400"
                      style="width: 100%">
              <el-table-column label="序号"
                               type="index">
              </el-table-column>
              <el-table-column prop="tenantGoodsName"
                               align="center"
                               label="商品名称"></el-table-column>
              <el-table-column prop="unitName"
                               align="center"
                               label="单位"> </el-table-column>
              <el-table-column prop="number"
                               align="center"
                               label="采购数量"> </el-table-column>
              <el-table-column prop="purchPrice"
                               align="center"
                               label="采购价"> </el-table-column>
              <el-table-column prop="traceabilityCode"
                               align="center"
                               label="追溯码"></el-table-column>
              <el-table-column prop="manufacturer"
                               align="center"
                               label="生产厂商"></el-table-column>
              <el-table-column prop="manufactureDate"
                               align="center"
                               width="100"
                               label="生产日期"> </el-table-column>
              <el-table-column prop="productionBatch"
                               align="center"
                               label="生产批次"> </el-table-column>
              <el-table-column prop="productionNumber"
                               align="center"
                               label="产地证明编号"> </el-table-column>
              <el-table-column prop="testQuarantineNumber"
                               align="center"
                               label="检验检疫证书编号"> </el-table-column>
              <el-table-column prop="qualitySafetyMonitoring"
                               align="center"
                               label="质量安全检测"> </el-table-column>
              <el-table-column prop="production"
                               align="center"
                               label="产地"></el-table-column>
              <el-table-column prop="amount"
                               align="center"
                               label="采购金额"></el-table-column>
            </el-table>
          </div>
          <div class="contentItem"
               v-if="recordTypeDetail === 'PURCHASE_OUT'">
            <el-table :data="draweDetaileData.purchaseGoodsDTOS"
                      height="400"
                      style="width: 100%">
              <el-table-column label="序号"
                               type="index">
              </el-table-column>
              <el-table-column prop="tenantGoodsName"
                               align="center"
                               label="商品名称"> </el-table-column>
              <el-table-column prop="unitName"
                               align="center"
                               label="单位"> </el-table-column>
              <el-table-column prop="number"
                               align="center"
                               label="退货数量"> </el-table-column>
              <el-table-column prop="purchPrice"
                               align="center"
                               label="退货价"> </el-table-column>
              <el-table-column prop="amount"
                               align="center"
                               label="退货金额"></el-table-column>
            </el-table>
          </div>
          <div class="contentItem"
               v-if="recordTypeDetail === 'STOCK_ENTER'||recordTypeDetail === 'STOCK_OUT'">
            <el-table :data="draweDetaileData.checkStockGoods"
                      height="400"
                      style="width: 100%">
              <el-table-column label="序号"
                               type="index">
              </el-table-column>
              <el-table-column prop="tenantGoods.name"
                               align="center"
                               label="商品名称"> </el-table-column>
              <el-table-column prop="tenantGoods.unitName"
                               align="center"
                               label="单位"> </el-table-column>
              <el-table-column prop="stock"
                               align="center"
                               label="实际库存"> </el-table-column>
              <el-table-column prop="checkNumber"
                               align="center"
                               label="盘点数量"> </el-table-column>
              <!-- :formatter="numFormat" -->
              <el-table-column prop="number"
                               align="center"
                               label="盘亏数量"></el-table-column>
              <el-table-column prop="remark"
                               align="center"
                               label="备注"></el-table-column>
            </el-table>
          </div>
          <!-- <div class="half_page_title"
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
          </div> -->
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
    <!-- 预览 -->
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
import ailPreview from '@/components/ailPreview.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import axios from 'axios'
import * as JSOG from 'jsog'
export default {
  name: 'StockListDetails',
  components: {
    Drawer,
    ailPreview,
    aliDownLoad,
    picturePrevie,
    aliUpload
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    recordTypeDetail: {
      type: String,
      default: ''
    },
    draweDetaileData: {
      type: Object,
      default: {
        recordDate: '',
        purchaseGoodsDTOS: [],
        checkStockGoods: [
          { tenantGoods: {} }
        ]
      }
    }
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
  },
  watch: {
    // 采购入库 PURCHASE_ENTER   采购退货出库 PURCHASE_OUT 销售退货入库 ORDER_ENTER  销售出库 ORDER_OUT 盘盈入库  STOCK_ENTER  盘亏出库 STOCK_OUT
    detailsdrawershow: {
      handler (newValue, oldValue) {
        if (newValue) {
          if (this.recordTypeDetail === 'PURCHASE_ENTER') {
            this.drawerTitle = '采购入库单详情'
          } else if (this.recordTypeDetail === 'PURCHASE_OUT') {
            this.drawerTitle = '采购退货出库详情'
          } else if (this.recordTypeDetail === 'STOCK_ENTER' || this.recordTypeDetail === 'STOCK_OUT') {
            this.drawerTitle = '盘点单详情'
          }
          if (this.draweDetaileData.purchaseGoodsDTOS[0].imageUrl) {
            this.imageUrl = this.draweDetaileData.purchaseGoodsDTOS[0].imageUrl.split(',')
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      showPicture: false,
      imgArr: [],
      num: 0,
      tableData: [],
      projectManagementId: '',
      value: '',
      options1: [],
      drawerTitle: '',
      imageUrl: []
    }
  },
  mounted () {

  },
  methods: {
    pictureClose () {
      this.showPicture = false
    },
    numFormat (row, column) {
      return (row.checkNumber * 1000 - row.stock * 1000) / 1000
    },
    showImg (item, index) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(item)
    },
    formatRecordType (recordTypeDetail) {
      switch (recordTypeDetail) {
        case 'PURCHASE_ENTER':
          return '采购入库'
        case 'PURCHASE_OUT':
          return '采购退货出库'
        case 'ORDER_ENTER':
          return '销售退货入库'
        case 'ORDER_OUT':
          return '销售出库'
        case 'STOCK_ENTER':
          return '盘盈入库'
        case 'STOCK_OUT':
          return '盘亏出库'
      }
    },
    orderTypeFormat (type) {
      // SALE 销售, REFUND 退货
      if (type === 'SALE') {
        return '销售'
      } else if (type === 'REFUND') {
        return '退货'
      }
    },
    setFile (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
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
.StockListDetails {
  .el-table::before {
    height: 0;
  }
}
</style>
<style lang="scss" scoped>
.StockListDetails {
  .main_content {
    .contentItem {
      padding: 15px;
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      background-color: #fff;
      margin-bottom: 15px;
      min-height: 200px;
      overflow-y: auto;
      > .item {
        width: 25%;
        font-size: 14px;
        margin-bottom: 20px;
        > span {
          color: #777777;
        }
        > p {
          color: #262626;
          word-break: break-word;
        }
        &.annex {
          > p {
            display: flex;
            > span {
              width: 200px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
  .commodity-total {
    padding-left: 20px;
    background-color: #fff;
  }
}
</style>
<style lang="scss">
.StockListDetails {
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
    width: 850px;
    height: calc(100% - 80px) !important;
  }
}
</style>
