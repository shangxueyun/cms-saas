<template>
  <div class="tenantBills"
       id="tenantBills"
       :class="{'scrolling':scrolling}">
    <div class="head head1">
      <i class="back mintui mintui-back"
         @click="onGoBack"></i>
      <span @click="popupShowFn">
        <span>{{tenName}}</span>
        <div :class="{'rotate':popupShow}">
          <i class="iconfont iconcms_shaixuan-xia"></i>
        </div>
      </span>
    </div>
    <div v-show="popupShow"
         @click.stop="popupShow=false"
         class="popupShow"
         position="top">
      <div class="list">
        <div v-for="(item,index) in contractsPrevList"
             :key="index"
             @click='contractIdChange(item.value)'>
          <span>{{item.text}}</span>
          <i class="iconfont iconcms_gou-227"
             v-if="item.value===contractId"></i>
        </div>
      </div>
    </div>
    <!-- 内容区域 -->
    <div class="content"
         id="content"
         ref="content">
      <div>
        <div class="moduleTitle">客户信息</div>
        <div class="ul-warp">
          <div class="content-ul">
            <span>合同编号</span>
            <span>{{contractInfo.contractNo}}</span>
          </div>
          <div class="content-ul">
            <span>合同开始时间</span>
            <span>{{contractInfo.startDate}}</span>
          </div>
          <div class="content-ul">
            <span>合同结束时间</span>
            <span>{{contractInfo.endDate}}</span>
          </div>
          <div class="content-ul"
               v-if="hshowmore">
            <span>项目</span>
            <span>{{contractInfo.projectManagement.referred}}</span>
          </div>
          <div class="content-ul"
               v-if="hshowmore">
            <span>楼宇</span>
            <span class="buil">{{formatBuildingName(contractInfo.buildings)}}</span>
          </div>
          <!-- <div class="content-ul"
               v-if="hshowmore">
            <span>房源号</span>
            <span>{{formatshopNumber(contractInfo.rooms)}}</span>
          </div> -->
          <div class="content-ul"
               v-if="hshowmore">
            <span>客户联系人</span>
            <span>{{contractInfo.tenant.contact}}</span>
          </div>
          <div class="content-ul"
               v-if="hshowmore">
            <span>联系电话</span>
            <span>{{contractInfo.tenant.telephone}}</span>
          </div>
          <div class="content-ul"
               v-if="hshowmore">
            <span>开户银行</span>
            <span>{{contractInfo.tenant.depositBank}}</span>
          </div>
          <div class="content-ul"
               v-if="hshowmore">
            <span>银行账号</span>
            <span>{{contractInfo.tenant.bankAccount}}</span>
          </div>
          <div class="content-ul"
               v-if="hshowmore">
            <span>纳税人识别号</span>
            <span>{{contractInfo.tenant.taxNo}}</span>
          </div>
          <div class="content-ul"
               v-if="hshowmore">
            <span>电话</span>
            <span>{{contractInfo.tenant.phone}}</span>
          </div>
          <div class="content-ul"
               v-if="hshowmore">
            <span>开票地址</span>
            <span>{{contractInfo.tenant.taxAddress}}</span>
          </div>
        </div>
        <div class="more-cion"
             :class="{'showmore': hshowmore}"
             @click="hshowmore = !hshowmore">
          <i class="iconfont iconcms_xia"></i>
        </div>
      </div>
      <div>
        <div class="billTab"
             id="billTab">
          <span :class="{'active':billsType==='CURRENT'}"
                @click="billsTypeChange('CURRENT')">当前账单</span>
          <span :class="{'active':billsType==='FUTURE'}"
                @click="billsTypeChange('FUTURE')">预期账单</span>
          <span :class="{'active':billsType==='HISTORY'}"
                @click="billsTypeChange('HISTORY')">历史账单</span>
        </div>
        <mt-loadmore ref="loadmore"
                     :bottom-method="loadBottom"
                     :autoFill="false"
                     :bottom-all-loaded="allLoaded">
          <ul class="ul-warp ul-warp1">
            <li class="tenBill_list"
                @click="toBliiDetails(item.id)"
                v-for="(item,index) in tableData"
                :class="{'noBorder':index===tableData.length-1}"
                :key="index">
              <div>
                <span>{{item.feeTypeName}}</span>
                <span :class="item.billStatus">{{formatBillStatus(item.billStatus)}}</span>
              </div>
              <div>
                <span>账单金额：{{item.amount| toLocaleString }}元</span>
              </div>
              <div>
                <span>{{ item.startDate }}~{{ item.endDate }}</span>
                <span v-if="item.onExpected">已逾期{{item.expectedDay}}天</span>
              </div>
            </li>
            <div class="noData"
                 v-if="tableData.length===0 && dataReady">
              <img src="../../../assets/nores.png">
              <p>暂无数据</p>
            </div>
          </ul>
          <div class="loadAll"
               v-if="allLoaded">
            <span>-</span>
            <p>你碰到我的底线了</p>
            <span>-</span>
          </div>
        </mt-loadmore>
      </div>
    </div>
  </div>
</template>
<script>
import context from '@/service'
import common from '@/utils/common.js'
import Vue from 'vue'
import myMixin from '../approvalCenter/mixin'
import { DropdownMenu, DropdownItem } from 'vant'
import { Loadmore } from 'mint-ui'
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
export default {
  name: 'tenantBills',
  components: {},
  mixins: [myMixin],
  props: ['scrollTop'],
  watch: {
    scrollTop (val) {
      // console.log(val)
      let flagTop = this.hshowmore ? '500' : '230'
      if (val > flagTop) {
        this.scrolling = true
        this.hshowmore = false
      } else {
        this.scrolling = false
      }
    }
  },
  data () {
    return {
      popupShow: false,
      scrolling: false,
      dataReady: false,
      allLoaded: false,
      hshowmore: false,
      activeNames: '0',
      contractId: '', // 合同id
      tenName: '', // 当前选中的合同租户名
      contractInfo: '', // 合同详情arr
      contractsPrevList: [], // 续签合同列表
      id: '', // 合同id
      billsType: 'CURRENT',
      tableData: [],
      currentPage: 1,
      total: 0,
      pgSize: 15,
      pageFrom: ''

    }
  },
  created () {
    let pageFrom = sessionStorage.getItem('pageFrom')
    if (pageFrom === 'billDetails') {
      this.id = sessionStorage.getItem('contractId')
      this.billsType = sessionStorage.getItem('billsType')
      this.getContractsPrev(this.id)
    } else {
      this.id = this.$route.params.id
      this.getContractsPrev(this.id)
    }
  },
  beforeDestroy () {

  },
  beforeRouteEnter (to, from, next) {
    sessionStorage.setItem('pageFrom', from.name)
    next()
  },
  mounted () {
    document.getElementById('app').scrollTo(0, 0)
  },
  methods: {
    isScrolled () {
      // scrolling
      let node = document.getElementById('tenantBills')
      if (node.classList.contains('scrolling')) {
        this.scrolling = true
        console.log('包含 test 这个class')
      }
    },
    tenantSelectNamae (id) {
      this.contractsPrevList.forEach((item, index) => {
        if (item.value === id) {
          this.tenName = item.text
        }
      })
    },
    popupShowFn () {
      this.popupShow = !this.popupShow
    },
    billsTypeChange (type) {
      this.billsType = type
      this.currentPage = 1
      this.allLoaded = false
      this.tableData = []
      this.$nextTick(() => {
        this.getBiils()
      })
    },
    loadBottom (id) {
      this.currentPage++
      this.getBiils(this.id, this.billsType)
      this.$refs.loadmore.onBottomLoaded()
    },
    toBliiDetails (billId) {
      sessionStorage.setItem('billsType', this.billsType)
      sessionStorage.setItem('contractId', this.id)
      this.$router.push({ name: 'billDetails', params: { billId: billId } })
    },
    formatBillStatus (billStatus) {
      let res = ''
      if (billStatus === 'APPROVAL') {
        res = '减免审核中'
      } else if (billStatus === 'UPDATE') {
        res = '减免驳回待修改'
      } else if (billStatus === 'NO') {
        res = '未付款'
      } else if (billStatus === 'OK') {
        res = '已结清'
      } else if (billStatus === 'SECTION') {
        res = '部分结清'
      } else if (billStatus === 'STAY_SETTLE') {
        res = '待结清'
      }
      return res
    },
    contractIdChange (id) {
      this.id = id
      this.tableData = []
      this.getContractsPrev(id)
    },
    getContractsPrev (contractsId) { // 根据合同id查询存在续签关系的合同
      context.http.get(`cms/api/contracts/prev`, { contractId: contractsId }).then(res => {
        this.contractsPrevList = []
        console.log(res.data)
        res.data.forEach((item, index) => {
          let xu = item.prevId ? '（续）' : ''
          let obj = { 'text': item.tenant.teantName + xu, 'value': item.id }
          this.contractsPrevList.push(obj)
          if (item.id === Number(contractsId)) {
            this.contractInfo = item
            this.contractId = item.id
            this.tenantSelectNamae(this.contractId)
            this.popupShow = false
            this.getBiils()
          }
        })
        console.log(this.contractsPrevList)
      }).catch(error => {
        console.log(error)
      })
    },
    getBiils () {
      this.dataReady = false
      context.http.get('cms/api/bills/contract', {
        contractId: this.id,
        queryType: this.billsType,
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'finalPaymentDate,asc'
      }).then(res => {
        this.dataReady = true
        if (res.status === 200) {
          this.tableData = this.tableData.concat(res.data)
          // this.tableData = []
          // console.log(this.tableData)
          this.total = Number(res.headers['x-total-count'])
          if (this.currentPage === Math.ceil(this.total / this.pgSize) || this.currentPage > Math.ceil(this.total / this.pgSize)) {
            this.allLoaded = true// 若数据已全部获取完毕
            // console.log('全部获取完毕')
          }
        }
      })
    },
    onConfirm () {
      this.$refs.item.toggle()
    },
    formatBuildingName (buildingNameArr) {
      let arr = []
      let ids = []
      buildingNameArr.forEach(item => {
        if (ids.indexOf(item.id) === -1) {
          arr.push(item.buildingName)
          ids.push(item.id)
        }
      })
      return arr.join('、')
    },
    formatshopNumber (shopNumberArr) {
      let arr = []
      shopNumberArr.forEach(item => {
        arr.push(item.shopNumber)
      })
      this.shopNumber = arr.join('、')
      return arr.join('、')
    },
    onGoBack () { // 返回首页
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss">
.tenantBills {
  .van-dropdown-item {
    &.van-dropdown-item--down {
      z-index: 999;
    }
  }
  .van-dropdown-menu__bar {
    box-shadow: none;
  }
  .van-dropdown-menu__title::after {
    border-color: transparent transparent #0139a4 #0139a4;
  }
  .van-dropdown-menu__title--active,
  .van-dropdown-item__option--active {
    color: #0139a4;
  }
  .van-dropdown-menu__title {
    > .van-ellipsis {
      font-size: 17px !important;
    }
    color: #262626;
  }
}
</style>
<style scoped lang="scss" >
@import "../../../style/config";
$head-height: rem(40);
.tenantBills {
  background: #f8f9fa;
  min-height: 100%;
  box-sizing: border-box;
  &.scrolling {
    .content {
      .billTab {
        position: fixed;
        top: rem(40);
        z-index: 3;
        background-color: #fff;
        border-top: rem(1) solid #f0f0f0;
      }
    }
  }
  .popupShow {
    width: 100%;
    height: 100%;
    position: fixed;
    top: rem(40);
    left: 0;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.5);
    .list {
      padding: rem(15) rem(20);
      background-color: #fff;
      border-bottom-left-radius: rem(8);
      border-bottom-right-radius: rem(8);
      > div {
        height: 40px;
        line-height: 40px;
        position: relative;
        > span {
          display: block;
          width: 100%;
          text-align: center;
        }
        > .iconfont {
          position: absolute;
          color: #3575f6;
          right: 0;
          top: 0;
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
    box-shadow: rem(0) rem(1) rem(4) rem(0) rgba(230, 230, 230, 0.5);
    &.head1 {
      height: rem(40);
      line-height: rem(40);
      display: flex;
      justify-content: center;
      > span {
        display: flex;
        align-items: center;
        > div {
          width: rem(20);
          height: rem(20);
          line-height: rem(20);
          transition: transform 0.2s;
          &.rotate {
            transform: rotate(180deg);
            transform-origin: center center;
          }
        }
      }
      .iconfont {
        color: #0139a4;
      }
    }
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
  /* 导航栏的样式 */
  .navs {
    position: fixed;
    top: rem(40);
    width: 100%;
    height: rem(40);
    background-color: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 3;
    box-shadow: 0px 1px 4px 0px rgba(230, 230, 230, 0.5);
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
  .content {
    width: 100%;
    position: relative;
    top: rem(40);
    // padding-bottom: rem(100) !important;
    .moduleTitle {
      color: #18191a;
      font-size: rem(17);
      font-weight: bold;
      padding: rem(14) 0 rem(0) rem(14);
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
        .buil {
          display: inline-block;
          white-space: nowrap;
          text-overflow:ellipsis;
          overflow: hidden;
          max-width: rem(340);
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
      &.ul-warp1 {
        min-height: rem(800);
        position: relative;
        > .noData {
          top: rem(-150);
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
    .billTab {
      color: #444547;
      font-size: rem(17);
      height: rem(40);
      line-height: rem(40);
      display: flex;
      padding-left: rem(15);
      width: 100%;
      box-shadow: rem(0) rem(1) rem(4) rem(0) rgba(230, 230, 230, 0.5);
      > span {
        margin-right: rem(15);
        &.active {
          color: #0139a4;
          border-bottom: rem(3) solid #0139a4;
          font-weight: bold;
        }
        .badge {
          // min-width: 0.35rem;
          // height: 0.35rem;
          // line-height: 0.35rem;
          // padding: 0 0.05rem;
          // background-color: #fc5159;
          // border-radius: 50%;
          // font-size: 0.3rem;
          // color: #fff;
          font-style: normal;
          // display: inline-block;
          // text-align: center;
          // white-space: nowrap;
          position: absolute;
          top: rem(2);
          left: rem(30);
        }
      }
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
    .content-title {
      color: #18191a;
      font-size: rem(17);
      height: rem(40);
      line-height: rem(40);
      font-weight: bold;
      padding-left: rem(14);
      border-bottom: rem(1) solid #f0f0f0;
    }
  }
  .content > div {
    width: 100%;
    // max-height: rem(2000);
    background-color: white;
    &:not(:last-child) {
      margin-bottom: rem(10);
    }
    // min-height: rem(500);
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
