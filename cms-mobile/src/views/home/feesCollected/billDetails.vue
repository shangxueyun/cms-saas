<template>
  <div class="billDetails"
       :class="{'scrolling':scrolling}">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="onGoBack"></i>
      <div class="headTab">{{biilDetailsData.feeTypeName}}</div>
    </div>
    <div class="content content_top">
      <!-- <div class="part part1">
        <img :src="biilDetailsData.projectManagement.previewImage"
             alt="">
        <div>
          <span>{{biilDetailsData.referred}}</span>
          <span>{{biilDetailsData.tenantName}}</span>
          <span>{{biilDetailsData.contractNo}}</span>
        </div>
      </div>
      <div class="part part2"
           :class="{'more':hshowmore}">
        <div class="projectName"
             v-if="hshowmore">{{biilDetailsData.projectManagement.referred}}</div>
        <div class="title"
             v-if="hshowmore">
          <span>楼层</span>
          <span>房源号</span>
          <span>建筑面积</span>
        </div>
        <div class="list"
             v-for="(item,index) in biilDetailsData.rooms"
             :key="index"
             v-if="hshowmore">
          <span>{{item.floor.name}}层</span>
          <span>{{item.shopNumber}}室</span>
          <span v-if="biilDetailsData.areaType === 'USING'">{{item.useArea}}m²</span>
          <span v-else>{{item.buildingArea + 'm²'}}</span>
        </div>
        <div class="more-cion"
             :class="{'showmore': hshowmore}"
             @click="hshowmore = !hshowmore">
          <i class="iconfont iconcms_xia"></i>
        </div>
      </div> -->
      <div>
        <div class="content-title">基本信息</div>
        <div class="ul-warp">
          <div class="content-ul">
            <span>管理企业</span>
            <span>{{ biilDetailsData.projectManagement && biilDetailsData.projectManagement.organizeName }}</span>
          </div>
          <div class="content-ul">
            <span>项目简称</span>
            <span>{{ biilDetailsData.projectManagement && biilDetailsData.projectManagement.referred }}</span>
          </div>
          <div class="content-ul">
            <span>客户名称</span>
            <span>{{biilDetailsData.tenantName}}</span>
          </div>
          <div class="content-ul">
            <span>合同编号</span>
            <span>{{biilDetailsData.contractNo}}</span>
          </div>
          <div class="content-ul">
            <span>租赁面积</span>
            <span>{{biilDetailsData.areaDescription}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 导航区域 -->
    <ul class="navs">
      <li :class="{active: active===0}"
          @click="scrollTo(0)">
        账单信息
        <div class="underline"
             v-show="active===0"></div>
      </li>
      <li :class="{active: active===1}"
          @click="scrollTo(1)">
        账单调整
        <div class="underline"
             v-show="active===1"></div>
      </li>
      <li :class="{active: active===2}"
          @click="scrollTo(2)">
        滞纳金
        <div class="underline"
             v-show="active===2"></div>
      </li>
      <li :class="{active: active===3}"
          @click="scrollTo(3)">
        匹配流水
        <div class="underline"
             v-show="active===3"></div>
      </li>
      <li :class="{active: active===4}"
          @click="scrollTo(4)">
        发送记录
        <div class="underline"
             v-show="active===4"></div>
      </li>
    </ul>
    <!-- 内容区域 -->
    <div class="content"
         ref="content">
      <div>
        <div class="ul-warp">
          <div class="content-ul">
            <span>账单编号</span>
            <span>{{biilDetailsData.code}}</span>
          </div>
          <div class="content-ul">
            <span>租赁方式</span>
            <span>{{formatRentalMethod(biilDetailsData.rentalMethod)}}</span>
          </div>
          <div class="content-ul">
            <span>费用类型</span>
            <span>{{biilDetailsData.feeTypeName}}</span>
          </div>
          <div class="content-ul">
            <span>计费周期</span>
            <span>{{biilDetailsData.startDate}}~{{biilDetailsData.endDate}}</span>
          </div>
          <div class="content-ul">
            <span>账单类型</span>
            <span>{{formatBillType(biilDetailsData.billType)}}</span>
          </div>
          <div class="content-ul">
            <span>账单金额</span>
            <span>{{biilDetailsData.amount | toLocaleString}}</span>
          </div>
          <div class="content-ul">
            <span>账单状态</span>
            <span>{{formatBillStatus(biilDetailsData.billStatus)}}</span>
          </div>
          <div class="content-ul">
            <span>{{biilDetailsData.billType === 'P' ? '应付时间' : '应收时间'}}</span>
            <span>{{biilDetailsData.finalPaymentDate}}</span>
          </div>
          <div class="content-ul">
            <span>账单是否包含滞纳金</span>
            <span>{{biilDetailsData.onContainLafeFee ? '是' : '否'}}</span>
          </div>
          <div class="content-ul">
            <span>备注</span>
            <span>{{biilDetailsData.manualRemake}}</span>
          </div>
        </div>
      </div>
      <div>
        <div class="content-title">账单调整</div>
        <div class="ul-warp">
          <div class="content-ul">
            <span>账单金额</span>
            <span>{{biilDetailsData.amount | toLocaleString}}元</span>
          </div>
          <div class="content-ul">
            <span>滞纳金</span>
            <span>{{biilDetailsData.lateFee | toLocaleString}}元</span>
          </div>
          <div class="content-ul">
            <span>减免总金额</span>
            <span>{{biilDetailsData.reductionAmount | toLocaleString}}元</span>
          </div>
          <div class="content-ul">
            <span>应收金额</span>
            <span>{{biilDetailsData.ysAmount | toLocaleString}}元</span>
          </div>
          <div class="content-ul">
            <span>已收金额</span>
            <span>{{biilDetailsData.writeOffAmount | toLocaleString}}元</span>
          </div>
          <div class="content-ul">
            <span>待收金额</span>
            <span>{{biilDetailsData.arrearsAmount | toLocaleString}}元</span>
          </div>
        </div>
        <div class="annexes">
          <div class="title">附件</div>
          <div v-for="(item,index) in biilDetailsData.reductions"
               :key="index">
            <div class="item"
                 v-for="(itm,idx) in item.annexes"
                 :key="idx">
              <div>
                <svg class="icon"
                     aria-hidden="true">
                  <use :xlink:href="pageGetformat(itm.annexName)"></use>
                </svg>
              </div>
              <div class="annex-name">{{itm.annexName}}</div>
              <ailPreview :ailObj="itm"
                          :encrypt="true"
                          @setFile="setFile"
                          class="ailPreview" />
            </div>
          </div>
          <div class="no_Data"
             v-if="biilDetailsData.reductions.length===0">暂无数据</div>
        </div>
      </div>
      <div>
        <div class="content-title">滞纳金</div>
        <div class="ul-warp">
          <div class="content-ul">
            <span>逾期天数</span>
            <span>{{biilDetailsData.expectedDay ? biilDetailsData.expectedDay : '-'}}</span>
          </div>
          <div class="content-ul">
            <span>滞纳金比例</span>
            <span>{{biilDetailsData.lateFeeRate ? biilDetailsData.lateFeeRate : '-'}}<span v-if="biilDetailsData.lateFeeRate">%/天</span></span>
          </div>
          <div class="content-ul">
            <span>滞纳金</span>
            <span>{{biilDetailsData.lateFee | toLocaleString}}元</span>
          </div>
          <div class="content-ul">
            <span>已收滞纳金</span>
            <span>{{biilDetailsData.sjLateFee | toLocaleString}}元</span>
          </div>
          <div class="content-ul">
            <span>待收滞纳金</span>
            <span>{{biilDetailsData.qsLateFee | toLocaleString}}元</span>
          </div>
        </div>
        <div class="lateFeeRateList">
          <ul class="listTitle">
            <li>周期</li>
            <li>逾期金额</li>
            <li>逾期天数</li>
            <li>滞纳金</li>
          </ul>
          <ul class="list"
              v-for="(item, index) in biilDetailsData.tradeFlowDTOS"
              :key="index">
            <li>
              <div>{{item.startDate}}</div>
              <div>{{item.endDate}}</div>
            </li>
            <li>{{item.yqAmount | toLocaleString}}</li>
            <li><span>{{item.expectedDay}}</span></li>
            <li>{{item.lateFee | toLocaleString}}</li>
          </ul>
          <div class="no_Data"
               v-if="biilDetailsData.tradeFlowDTOS.length===0">暂无数据</div>
        </div>
      </div>
      <div class="empty">
        <div class="content-title">匹配流水</div>
        <div class="billAndFlows">
          <div class="item"
               v-for="(item, index) in biilDetailsData.billAndFlows"
               v-show="index<4||hshowmore2"
               :key="index">
            <div>
              <div>
                <span>流水金额：</span>
                <span class="val">{{item.billFlowAmount | toLocaleString}}</span>
              </div>
              <div :class="item.flowState">{{formatBillStatus1(item.flowState )}}</div>
            </div>
            <div>
              <div>
                <span>匹配金额：</span>
                <span class="val">{{item.amount | toLocaleString}}</span>
              </div>
              <div>{{item.recordDate}}</div>
            </div>
          </div>
        </div>
        <div class="no_Data"
             v-if="biilDetailsData.billAndFlows.length===0">暂无数据</div>
        <div class="more-cion"
             v-if="biilDetailsData.billAndFlows.length>4"
             :class="{'showmore': hshowmore2}"
             @click="hshowmore2 = !hshowmore2">
          <i class="iconfont iconcms_xia"></i>
        </div>
      </div>
      <div style="margin-bottom:0">
        <div class="content-title">通知单发送记录</div>
        <div class="billNoticeRecord">
          <div v-for="(item,index) in billNoticeRecordData"
               :key="index">
            <div>
              <svg class="icon"
                   aria-hidden="true">
                <use xlink:href="#iconcms_PDF"></use>
              </svg>
            </div>
            <div>
              <p>{{item.noticeName}}</p>
              <p>{{item.userDate}}</p>
            </div>
            <ailPreview :ailObj="item"
                        :billNoticeRecord='true'
                        :encrypt="true"
                        @setFile="setFile"
                        class="ailPreview" />
          </div>
        </div>
        <div class="no_Data"
             v-if="billNoticeRecordData.length===0">暂无数据</div>
      </div>
      <div class="empty"></div>
      <div class="loadAll"
           style="min-height: 0;">
        <span>-</span>
        <p>你碰到我的底线了</p>
        <span>-</span>
      </div>
    </div>
  </div>
</template>
<script>
import context from '@/service'
import ailPreview from '@/components/ailPreview.vue'
import myMixin from '../approvalCenter/mixin'
import common from '@/utils/common.js'
export default {
  name: 'billDetails',
  props: ['scrollTop'],
  components: {
    ailPreview
  },
  mixins: [myMixin],
  watch: {
    scrollTop (val) {
      // // this.pageTop = val
      // this.addMenu = false
      let flagTop = this.hshowmore ? '300' : '200'
      if (val > flagTop) {
        this.scrolling = true
        this.hshowmore = false
      } else {
        this.scrolling = false
      }
      // console.log(val, this.scrolling)
    }
  },
  data () {
    return {
      scrolling: false,
      billId: '',
      biilDetailsData: {
        tradeFlowDTOS: [],
        billAndFlows: [],
        projectManagement: {}
      },
      billNoticeRecordData: [],
      hshowmore: false,
      hshowmore2: false
    }
  },
  created () {
    this.billId = this.$route.params.billId
    this.getBillDetails(this.billId)
    this.getBillNoticeRecord(this.billId)
  },
  beforeDestroy () {
  },
  mounted () {
    document.getElementById('app').scrollTo(0, 0)
  },
  methods: {
    getBillNoticeRecord (billId) {
      context.http.get('cms/api/billNoticeRecord/', {
        billId: billId
        // page: (this.currentPage - 1),
        // size: this.pgSize
      }).then(res => {
        this.billNoticeRecordData = res.data
        // this.total = Number(res.headers['x-total-count'])
      }).catch(error => {
        console.info(error)
      })
    },
    getBillDetails (billId) {
      context.http.get(`cms/api/bills/${billId}`).then(res => {
        this.biilDetailsData = res.data
        if (this.biilDetailsData.reductions && this.biilDetailsData.reductions.length > 0) {
          this.biilDetailsData.reductions = this.biilDetailsData.reductions.filter((item, index) => {
            return item.approvalStatus === 'OK'
          })
        }
        // this.builddetailsData = res.data
        // this.billDetailsdrawershow = true
        // this.queryBillId = row.id.toString()
        // this.detailsdrawershow = false
      })
    },
    formatRentalMethod (val) {
      return val === 'RENT' ? '固定租金' : val === 'POINTS' ? '扣点' : '保底扣点'
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
    formatBillStatus1 (val) {
      let res = ''
      if (val === 'OK') {
        res = '完全匹配'
      } else if (val === 'SECTION') {
        res = '部分匹配'
      } else {
        res = '未匹配'
      }
      return res
    },
    pageGetformat (str) {
      return common.getformat(str)
    },
    setFile () {

    },
    onGoBack () { // 返回首页
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped lang="scss" >
@import "../../../style/config";
.billDetails {
  background: #f8f9fa;
  min-height: 100%;
  box-sizing: border-box;
  background: #f8f9fa;
  min-height: 100%;
  box-sizing: border-box;
  .body {
    // position: relative;
    // top: rem(40);
    margin-top: rem(40);
    font-size: rem(14);
    margin-bottom: rem(10);
    .part {
      background-color: #fff;
      &.part1 {
        padding: rem(23) rem(14);
        display: flex;
        justify-content: space-between;
        img {
          width: rem(90);
          height: rem(90);
          border-radius: rem(4);
        }
        > div {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          text-align: right;
          font-size: rem(14);
          color: #262626;
          width: 65%;
          > span {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      &.part2 {
        &.more {
          border-top: rem(1) solid #f0f0f0;
          padding: rem(23) rem(14) 0;
        }
        .projectName {
          color: #262626;
          font-weight: bold;
        }
        .title {
          display: flex;
          justify-content: space-between;
          color: #777;
          margin-top: rem(10);
          > span {
            // width: 30%;
          }
        }
        .list {
          display: flex;
          justify-content: space-between;
          color: #262626;
          margin-top: rem(10);
          > span {
            // width: 30%;
          }
        }
      }
    }
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
      font-size: rem(17);
      display: flex;
      flex: 1;
      justify-content: center;
    }
    .back {
      width: rem(40);
      height: rem(40);
      font-size: rem(18);
      color: #000000;
      position: absolute;
      left: 0;
    }
  }
  &.scrolling {
    .navs {
      position: fixed;
      top: rem(40);
      z-index: 3;
    }
  }
  /* 导航栏的样式 */
  .navs {
    // position: fixed;
    // top: rem(40);
    width: 100%;
    height: rem(40);
    background-color: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    // z-index: 3;
    box-shadow: 0px 1px 4px 0px rgba(230, 230, 230, 0.5);
    overflow-x: auto;
  }
  .navs li {
    font-size: rem(15);
    color: #444547;
  }
  /* 当导航被点亮后改变颜色 */
  .navs .active {
    color: #0139a4;
    font-size: rem(17);
    font-weight: bold;
  }
  .underline {
    width: rem(70);
    height: rem(3);
    background: rgba(1, 57, 164, 1);
    border-radius: rem(2);
    position: relative;
    top: rem(6);
  }
  /* 内容区的样式 */
  .content_top {
    margin-top: rem(40);
  }
  .content {
    width: 100%;
    // position: relative;
    // top: rem(82);
    // padding-bottom: rem(250) !important;
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
      margin: 0 rem(14) 0 rem(14);
      // border-bottom: rem(1) solid #f0f0f0;
      padding-bottom: rem(16);
      &:last-child {
        border: none;
      }
      &.no_Data {
        min-height: rem(500);
      }
      .content-ul {
        display: flex;
        justify-content: space-between;
        padding-top: rem(16) !important;
        font-size: rem(15);
        > span {
          color: #18191a;
          &:first-child {
            color: #858c94;
            white-space: nowrap;
            margin-right: rem(10);
          }
        }
        .total {
          padding-top: rem(14);
          span {
            span {
              color: #cb444a;
            }
          }
        }
      }
      .tenBill_list {
        padding-top: rem(17);
        border-bottom: rem(1) solid #f0f0f0;
        &.noBorder {
          border: none;
        }
        > div {
          display: flex;
          justify-content: space-between;
          color: #777777;
          font-size: rem(14);
          margin-bottom: rem(8);
          &:nth-child(1) {
            > span {
              &:nth-child(1) {
                color: #262626;
                font-weight: bold;
              }
              &:nth-child(2) {
                &.STAY_SETTLE {
                  color: #f99a12;
                }
                &.SECTION,
                &.NO {
                  color: #fc5159;
                }
                &.OK {
                  color: #1cc296;
                }
              }
            }
          }
          &:nth-child(2) {
          }
        }
      }
      .no_Data {
        height: rem(50);
        line-height: rem(50);
        color: #777777;
        text-align: center;
      }
    }
    .lateFeeRateList {
      margin-left: rem(14);
      border-top: rem(1) solid #f0f0f0;
      padding-bottom: rem(20);
      ul {
        display: flex;
        justify-content: space-between;
        font-size: rem(14);
        color: #777777;
        align-items: center;
        margin-top: rem(15);
        &.list {
          color: #262626;
        }
        > li {
          flex: 1;
          text-align: center;
        }
      }
      .list {
      }
    }
    .billAndFlows {
      .item {
        margin-left: rem(15);
        padding: rem(17) rem(14) rem(17) 0;
        border-bottom: rem(1) solid #f0f0f0;
        > div {
          display: flex;
          justify-content: space-between;
          font-size: rem(14);
          color: #777777;
          &:first-child {
            margin-bottom: rem(10);
          }
          .val {
            color: #262626;
          }
          .STAY_SETTLE {
            color: #f99a12;
          }
          .SECTION,
          .NO {
            color: #fc5159;
          }
          .OK {
            color: #1cc296;
          }
        }
      }
    }
    .billNoticeRecord {
      padding-bottom: rem(20);
      > div {
        display: flex;
        align-items: center;
        padding: rem(25) rem(15) 0 rem(15);
        > div {
          &:nth-child(1) {
            margin-right: rem(15);
          }
          &:nth-child(2) {
            width: 80%;
            > p {
              font-size: rem(14);
              color: #262626;

              &:first-child {
                margin-bottom: rem(5);
              }
              &:last-child {
                color: #777777;
              }
            }
          }
        }
      }
    }
    .no_Data {
      height: rem(50);
      line-height: rem(50);
      color: #777777;
      text-align: center;
    }
    .more-cion {
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #0139a4;
      transition: transform 0.5s;
      i {
        margin-top: rem(10);
        padding-bottom: rem(10);
      }
    }
    .showmore {
      transform: rotate(180deg);
      transform-origin: center center;
    }
  }
  .content > div {
    width: 100%;
    // min-height: rem(500);
    background-color: white;
    // &:not(:last-child) {
    //   margin-bottom: rem(10);
    // }
    // &.empty {
    //   min-height: rem(150);
    //   margin-bottom: 0;
    // }
    // min-height: rem(500);
    .annexes {
      background-color: #fff;
      border-top: rem(1) solid #f0f0f0;
      margin-left: rem(12);
      .title {
        padding: rem(10) 0 rem(13) rem(0);
        font-size: 15px;
        color: rgba(133, 140, 148, 1);
      }
      .item {
        display: flex;
        align-items: center;
        padding: rem(5) rem(12) rem(5) rem(0);
        > div {
          &:first-child {
            margin-right: rem(15);
          }
          &:last-child {
            font-size: rem(15);
            color: rgba(24, 25, 26, 1);
          }
        }
        .annex-name {
          width: 80%;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
      .ailPreview {
        flex: 1;
        text-align: right;
      }
    }
  }
  .fee-terms-warp {
    background-color: #f8f9fa !important;
    > div {
      background-color: #fff;
    }
  }
  .fee-terms {
    margin-bottom: rem(10);
  }
  .approval-tips {
    width: 100%;
    height: rem(35);
    line-height: rem(35);
    text-align: center;
    background: rgba(238, 243, 255, 1);
    color: #0139a4;
    font-size: rem(14);
    font-weight: bold;
    position: fixed;
    top: rem(40);
    z-index: 3;
  }
}
</style>
