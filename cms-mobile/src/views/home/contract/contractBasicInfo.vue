<template>
  <div class="contractBasicInfo">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="$router.go(-1)"></i>
      <div class="headTab">
        <span class="active">基本信息</span>
        <span @click="$router.replace({name: 'contractBillDetails', query: {id: contractId}})">账单信息</span>
      </div>
      <div class="addBtn"></div>
    </div>
    <div class="content">
      <div class="basic-information">
        <div class="content-title">基本信息</div>
        <div class="ul-warp">
          <div class="content-ul">
            <span>管理企业</span>
            <span v-if="contractDetails.projectManagement">{{contractDetails.projectManagement.organizeName}}</span>
          </div>
          <div class="content-ul">
            <span>项目</span>
            <span v-if="contractDetails.projectManagement">{{contractDetails.projectManagement.referred}}</span>
          </div>
        </div>
        <div class="ul-warp building-warp">
          <div class="content-ul"
               v-for="(item, index) in contractDetails.buildings">
            <p style="width: 100%;">{{item.buildingName}}（{{assetsTypeFormte(item.assetsType)}}）</p>
            <span style="width: 50%;">总面积：{{item.buildingArea}} {{item.assetsType === 'LAND' ? '亩' : '㎡'}}</span>
            <span style="width: 50%;">租赁面积：{{item.leaseArea}} {{item.assetsType === 'LAND' ? '亩' : '㎡'}}</span>
            <p>地址：{{item.address}}</p>
          </div>
        </div>
      </div>
      <div class="basic-information contracts-details">
        <div class="content-title">租赁方式</div>
        <div class="ul-warp">
          <div class="content-ul">
            <span>租赁方式</span>
            <span>
              {{contractTypeFormat(contractDetails.parents)}}
            </span>
          </div>
          <div style="margin-bottom: 20px;width: 80%!important;"
               v-if="contractDetails.parents && contractDetails.parents.length > 0">
            <div class='stepsProcess pre'>
              <div class='stepsProcessCon yw-setps'>
                <div class='processItem yw-setp'>
                  <div class='processItemCon step__main'>
                    <div class="organizeName">{{contractDetails.projectManagement.organizeName}}</div>
                  </div>
                </div>
                <div class='processItem yw-setp'
                     v-for="(item2, index2) in contractDetails.parents"
                     :key="'index1' + index2">
                  <div class='step__head'>
                    <div class="step__line lined"></div>
                    <div class="step__icon circle circle1"
                         v-if="index2 === 0"></div>
                    <div class="step__icon circle circle2"></div>
                  </div>
                  <div class='processItemCon step__main'
                       :class="{'active': index2 === contractDetails.parents.length - 1}">
                    <div style="margin: 0 0 15px 0">
                      <div class="contract-info-wrap">
                        <div>
                          <span>租期：</span>
                          <span>{{item2.startDate}} ~ {{item2.endDate}}</span>
                        </div>
                        <div>
                          <span>租赁面积：</span>
                          <span>{{item2.areaDescription}}</span>
                        </div>
                        <div>
                          <span>用途：</span>
                          <span>{{item2.shopName}}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      {{item2.tenant.teantName}}
                      <span v-if="item2.tenant.contact">联系人：{{item2.tenant.contact}} / {{item2.tenant.telephone}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="basic-information">
        <div class="content-title">承租方</div>
        <div class="ul-warp">
          <div class="content-ul">
            <span>名称</span>
            <span v-if="contractDetails.tenant">
              {{contractDetails.tenant.teantName}}
            </span>
          </div>
          <div class="content-ul">
            <span>用途</span>
            <span>
              {{contractDetails.shopName}}
            </span>
          </div>
        </div>
      </div>
      <div class="basic-information">
        <div class="content-title">合同信息</div>
        <div class="ul-warp">
          <div class="content-ul">
            <span>合同签订时间</span>
            <span>{{contractDetails.signtDate}}</span>
          </div>
          <div class="content-ul">
            <span>合同起始日</span>
            <span>{{contractDetails.startDate}}</span>
          </div>
          <div class="content-ul">
            <span>合同终止日</span>
            <span>{{contractDetails.endDate}}</span>
          </div>
          <div class="content-ul">
            <span>合同编号</span>
            <span>{{contractDetails.contractNo}}</span>
          </div>
          <div class="content-ul">
            <span>镇统一合同编号</span>
            <span>{{contractDetails.townContractNo}}</span>
          </div>
          <div class="content-ul">
            <span>合同性质</span>
            <span>{{formatRentalMethod(contractDetails.contractNature)}}</span>
          </div>
          <div class="content-ul">
            <span>合同状态</span>
            <span>{{formatterStatus(contractDetails.contractStatus)}}
              <span v-if="contractDetails.withdrawalDate">（退租日期：{{contractDetails.withdrawalDate}}）</span>
            </span>
          </div>
        </div>
      </div>
      <div class="basic-information">
        <div class="content-title">备注</div>
        <ul v-if="detailDataRemarks.length"
            class="list">
          <li v-for="(item, index) in detailDataRemarks"
              :key="index">
            <p>
              <span style="font-weight: 500">{{item.createUserName}}：</span>
            </p>
            <div>
              <p class="momoInfo">{{item.content}}</p>
              <p class="momoDate">{{item.createTime.substring(0, 10)}}</p>
            </div>
          </li>
        </ul>
        <div v-else
             class="noData_text">暂无数据</div>
      </div>
      <div style="margin-bottom:0;"
           class="basic-information">
        <div class="content-title">附件</div>
        <div v-if="contractDetails.annexes && contractDetails.annexes.length"
             class="an">
          <div class="an-item"
               v-for="(item, index) in contractDetails.annexes"
               :key="index">
            <div class="image">
              <svg class="icon"
                   aria-hidden="true">
                <use :xlink:href="getformat(item.annexName)"></use>
              </svg>
            </div>
            <div class="annex-name">{{item.annexName}}</div>
            <div class="operating">
              <ailPreview :ailObj="item"
                          :encrypt="true"
                          class="ailPreview" />
            </div>
          </div>
        </div>
        <div v-else
             class="noData_text">暂无数据</div>
        <van-collapse v-model="activeNames"
                      v-if="contractDetails.onFileAnnexes && contractDetails.onFileAnnexes.length">
          <van-collapse-item title="归档"
                             name="1">
            <div v-if="contractDetails.onFileAnnexes && contractDetails.onFileAnnexes.length"
                 class="an">
              <div class="an-item"
                   v-for="(item, index) in contractDetails.onFileAnnexes"
                   :key="index">
                <div class="image">
                  <svg class="icon"
                       aria-hidden="true">
                    <use :xlink:href="getformat(item.annexName)"></use>
                  </svg>
                </div>
                <div class="annex-name">{{item.annexName}}</div>
                <div class="operating">
                  <ailPreview :ailObj="item"
                              :encrypt="true"
                              class="ailPreview" />
                </div>
              </div>
            </div>
          </van-collapse-item>
        </van-collapse>
      </div>
      <div class="loadAll contractLoadAll">
        <span>-</span>
        <p>已经到底了</p>
        <span>-</span>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import context from '@/service'
import ailPreview from '@/components/ailPreview.vue'
import { Collapse, CollapseItem } from 'vant'
import common from '@/utils/common.js'
import { ArabiaToSimplifiedChinese } from '@/utils/validate.js'
Vue.use(Collapse)
Vue.use(CollapseItem)
export default {
  name: 'contractBasicInfo',
  components: { ailPreview },
  data () {
    return {
      activeNames: [],
      contractId: '',
      contractDetails: {},
      address: '',
      detailDataRemarks: {}
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
    contractTypeFormat (parents) {
      let res = ''
      if (parents && parents.length > 0) {
        res = ArabiaToSimplifiedChinese(parents.length + 1) + '手租赁'
      } else {
        res = '一手租赁'
      }
      return res
    },
    async getContractDetails () {
      let res = await context.http.get('cms/api/contracts/' + this.contractId)
      let onFileAnnexes = res.data.annexes.filter(item => item.onFile) // 已归档文件
      res.data.annexes = res.data.annexes.filter(item => !item.onFile)
      res.data.onFileAnnexes = onFileAnnexes
      this.contractDetails = res.data
      this.contractDetails.buildings.forEach(ele => {
        this.contractDetails.rentClauses.forEach(ele2 => {
          if (ele.id === ele2.buildingId) {
            ele.leaseArea = ele2.area
          }
        })
      })
      this.formaterAddr()
      this.remarksFormat()
    },
    async formaterAddr () {
      if (this.contractDetails.projectManagement.district !== '') {
        this.address = await this.getAddrByCode(this.contractDetails.projectManagement.district)
      } else if (this.contractDetails.projectManagement.city !== '') {
        this.address = await this.getAddrByCode(this.contractDetails.projectManagement.city)
      } else if (this.contractDetails.projectManagement.province) {
        this.address = await this.getAddrByCode(this.contractDetails.projectManagement.province)
      }
    },
    async getAddrByCode (code) {
      let result = await context.http.get(`ywm/api/district-codes/${code}`)
      return result.data.address
    },
    remarksFormat () {
      let remarks = this.contractDetails.remarks.slice(0)
      remarks.forEach((ele, idx) => {
        if (ele.content === '') {
          remarks.splice(idx, 1)
        }
      })
      this.detailDataRemarks = remarks
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
    formatRentalMethod (val) {
      return val === 'RENT' ? '租赁' : val === 'USE' ? '使用' : ''
    },
    // formatRentalMethod (val) {
    //   return val === 'RENT' ? '固定租金' : val === 'POINTS' ? '扣点' : '保底扣点'
    // },
    assetsTypeFormte (val) {
      const amap = {
        'BUILDING': '楼宇',
        'LAND': '土地',
        'FIELD': '场地'
      }
      return amap[val]
    },
    getformat (annexName) {
      return common.getformat(annexName)
    }
  }
}
</script>
<style lang="scss">
.contractBasicInfo {
  .van-collapse-item__content {
    padding: 0;
  }
}
</style>
<style lang="scss" scoped>
@import "../../../style/config";
.contractBasicInfo {
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
      i {
        font-size: rem(18);
        color: #444547;
        font-size: rem(18);
      }
    }
    .selected {
      color: #0139a4;
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
  .building-warp {
    .content-ul {
      flex-wrap: wrap;
      border-bottom: rem(1) solid #f0f0f0;
      padding-bottom: rem(6);
      font-size: rem(14);
      span {
        margin: rem(10) 0;
        color: #444547;
      }
      p {
        &:first-child {
          font-size: rem(15);
          color: #18191A;
          font-weight: 500;
        }
      }
    }
  }
  .content-ul {
    display: flex;
    justify-content: space-between;
    padding-top: rem(16) !important;
    padding-right: rem(14);
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
  .list {
    padding-left: rem(14);
    li {
      padding: rem(16) rem(14) rem(16) 0;
      position: relative;
      background: #fff;
      border-bottom: rem(1) solid #f0f0f0;
      &:last-child {
        border: 0;
      }
      > p {
        display: flex;
        width: 100%;
        justify-content: space-between;
        margin-bottom: rem(6);
        > span {
          display: block;
          line-height: rem(20);
          color: #858c94;
          font-size: rem(15);
          width: rem(90);
          text-align: right;
        }
        > span:first-child {
          text-align: left;
          flex: 1;
          color: #18191a;
          font-weight: 600;
          font-size: rem(15);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: rem(5);
          > span {
            background: #eff6ff;
            height: rem(17);
            font-weight: 500;
            line-height: rem(17);
            font-size: rem(12);
            color: #0139a4;
            padding: 0 rem(3);
            vertical-align: center;
            margin-left: rem(12);
          }
        }
      }
      > div {
        > p {
          color: #444547;
          font-size: rem(14);
          margin-bottom: rem(8);
          &:last-child {
            margin-bottom: 0;
          }
          span {
            color: #858c94;
          }
        }
        > .momoInfo {
          font-size: rem(15);
          color: #18191a;
        }
        > .momoDate {
          font-size: rem(13);
          color: #858c94;
          text-align: right;
        }
      }
      > span {
        position: absolute;
        right: rem(10);
        top: rem(45);
        font-size: rem(17);
        color: #c6c6c6;
      }
    }
  }
  .an-item {
    display: flex;
    align-items: center;
    padding: rem(14) rem(14) 0;
    &:nth-of-type(2) {
      margin-top: 0;
    }
    .image {
      margin-right: rem(10);
    }
    .annex-name {
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
  .contractLoadAll {
    background: #fff;
    padding-top: rem(20);
    > p {
      // width:rem(80);
    }
  }

  .contracts-details {
    /* steps start */
    .stepsProcess {
      padding-top: rem(20);
      position: relative;
      background: #fff;
    }
    .pre {
      height: auto;
    }
    .stepsProcessCon {
      display: flex;
      flex-flow: column;
    }
    .pre .processItem {
      position: relative;
      display: flex;
      flex-shrink: 1;
    }
    .lined {
      width: 1px;
      /* height: 50px; */
      background: #eee;
      position: absolute;
      left: rem(6);
      top: rem(18);
    }
    .step__head {
      flex-grow: 0;
      width: rem(24);
      position: relative;
    }
    .step__line {
      width: 1px;
      top: 0;
      bottom: 0;
      left: rem(6);
      position: absolute;
      border-color: inherit;
      background-color: #c0c4cc;
    }
    .step__icon {
      position: relative;
      z-index: 1;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: rem(24);
      height: rem(24);
      font-size: rem(14);
      box-sizing: border-box;
      background: #fff;
      transition: 0.15s ease-out;
      border-radius: 50%;
      border: 2px solid;
      border-color: inherit;
    }

    .step__main {
      flex-grow: 1;
      white-space: normal;
      text-align: left;
      .organizeName {
        position: absolute;
        top: rem(-5);
        left: rem(14);
      }
      &.active {
        /* span {
          color: #3575f6;
        }
        div {
          color: #3575f6;
        } */
      }
    }

    .circle {
      width: rem(12);
      height: rem(12);
      border: 3px solid #d3dbeb;
      margin-right: rem(20);
      border-radius: 50%;
    }
    .circle1 {
      position: absolute;
      top: 0;
    }
    .circle2 {
      position: absolute;
      bottom: 0;
    }
    .processItemCon {
      position: relative;
      margin-left: rem(14);
    }
    .contract-info-wrap {
      width: 100%;
      min-height: rem(16);
      /* line-height: 56px; */
      /* background: #f6f9fb; */
      border-radius: 4px;
      margin-top: rem(20);
      color: #858c94;
      padding-bottom: rem(10);
      > div {
        padding: rem(10) rem(10) 0 0;
      }
      > span {
        text-align: center;
        &:first-child {
          width: 35%;
          text-align: left;
        }
        &:nth-child(2) {
          width: 45%;
          text-align: left;
        }
        div {
          min-height: rem(28);
          line-height: rem(28);
          padding-left: rem(10);
        }
      }
    }

    /* steps end */
  }
}
</style>
