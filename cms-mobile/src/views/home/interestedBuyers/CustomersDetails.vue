<template>
  <div class="CustomersDetails">
    <app-header :title="tenantDetail.referred"
                class="retitle"
                :onBack="true"
                backRoute="interestedList">
    </app-header>
    <div class="content-warp">
      <!-- 导航区域 -->
      <ul class="navs">
        <li v-for="(item, index) in navsList"
            :key="index"
            :class="{active: active===index}"
            @click="scrollTo(index)">
          {{item}}
          <div class="underline"
               v-show="active===index"></div>
        </li>
      </ul>
      <!-- 内容区域 -->
      <div class="content"
           id="content">
        <!-- 意向客户档案 -->
        <div class="tenant-infor">
          <div class="basic-information">
            <div class="ul-warp">
              <div class="content-ul">
                <span>项目</span>
                <span>{{tenantDetail.projectManagementDTO.referred}}</span>
              </div>
              <div class="content-ul">
                <span>意向客户类型</span>
                <span>{{tenantDetail.customerType==='COMPANY'?'企业':'个人'}}</span>
              </div>
              <div class="content-ul">
                <span>{{tenantDetail.customerType==='COMPANY'?'企业名称':'姓名'}}</span>
                <span>
                  {{tenantDetail.yxTenantName}}
                </span>
              </div>
              <div class="content-ul">
                <span>品牌名称</span>
                <span>
                  {{tenantDetail.referred}}
                </span>
              </div>
              <div class="content-ul">
                <span>用途</span>
                <span>{{tenantDetail.tenantUseDescription}}</span>
              </div>
              <div class="content-ul">
                <span>行业</span>
                <span>{{tenantDetail.industryName}}</span>
              </div>
              <div class="content-ul">
                <span>需求面积/m²</span>
                <span v-show="tenantDetail.lowArea !== null">{{tenantDetail.lowArea}}-{{tenantDetail.highArea}}㎡</span>
              </div>
              <div class="content-ul">
                <span>心理价位</span>
                <span v-show="tenantDetail.lowPrice !== null">{{tenantDetail.lowPrice}}-{{tenantDetail.highPrice}} {{tenantDetail.priceUnit==='M2DAYS'?'元/m²·天':tenantDetail.priceUnit==='MONTH'?'元/月':'元/年'}}</span>
              </div>
              <div class="content-ul">
                <span>预计开店时间</span>
                <span>{{tenantDetail.signDate}}</span>
              </div>
              <div class="content-ul">
                <span>联系人</span>
                <span>{{tenantDetail.contact}}</span>
              </div>
              <div class="content-ul">
                <span>联系电话</span>
                <span>{{tenantDetail.telephone}}</span>
              </div>
              <div class="content-ul">
                <span>意向客户来源</span>
                <span>{{tenantDetail.customerSource}}</span>
              </div>
              <div class="content-ul">
                <span>状态</span>
                <span>{{tenantDetail.using ? '使用中' : '已停用'}}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 意向客户简介 -->
        <div class="total-expenses">
          <div class="basic-information">
            <div class="content-title">意向客户简介</div>
            <div class="ul-warp">
              <div class="content-ul">
                <span>意向客户网站</span>
                <span>{{tenantDetail.website}}</span>
              </div>
              <div class="content-div">
                <span>意向客户简介</span>
                <div>{{tenantDetail.introduction}}</div>
              </div>
              <div class="annex common">
                <div class="an-title">附件</div>
                <div class="an-item"
                     v-for="(item, index) in tenantDetail.annexes"
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
            </div>
          </div>
        </div>
        <!-- 跟进记录 -->
        <div class="followUp-record"
             v-bind:style="{ minHeight: minHeight + 'px' }">
          <div class="basic-information">
            <div class="content-title">跟进记录</div>
            <follow-record :tenantID="tenantID"
                           :tenantDetail="tenantDetail"
                           :active="active"></follow-record>
          </div>
        </div>
        <div class="loadAll contractLoadAll">
          <span>-</span>
          <p>已经到底了</p>
          <span>-</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import context from '@/service'
import AppHeader from '@/components/appHead'
import ailPreview from '@/components/ailPreview.vue'
import FollowRecord from './FollowRecord'
import myMixin from '../approvalCenter/mixin.js'
import * as JSOG from 'jsog'
import common from '@/utils/common.js'
export default {
  name: 'CustomersDetails',
  components: { AppHeader, ailPreview, FollowRecord },
  mixins: [myMixin],
  data () {
    return {
      Xiaomi: true,
      title: '租户名称',
      active: 0,
      navsList: [
        '意向客户档案',
        '意向客户简介',
        '跟进记录'
      ],
      tenantDetail: {
        projectManagementDTO: {
          referred: ''
        }
      },
      minHeight: '',
      tenantID: this.$route.query.tenantID
    }
  },
  created () {
    // this.tenantID = 46
    this.getDetails()
  },
  mounted () {
    this.$nextTick(() => {
      let headH = document.querySelector('#app-head').clientHeight + document.querySelector('.navs').clientHeight
      this.minHeight = document.body.clientHeight - headH
    })
  },
  methods: {
    getformat (annexName) {
      return common.getformat(annexName)
    },
    getDetails (id) {
      context.http.get(`cms/api/yxTenant/${this.tenantID}`).then(res => {
        if (res.status === 200) {
          this.tenantDetail = res.data
          context.http.get(`cms/api/followRecords/46`).then(result => {
            this.timeLineListData = result.data
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
@import "../../../style/config";
.CustomersDetails {
  .retitle {
    .title {
      padding-left: rem(30);
    }
    .right_btn {
      width: rem(74) !important;
    }
  }
}
</style>
<style lang="scss" scoped>
@import "../../../style/config";
.postbtn {
  color: #0139a4;
  font-size: rem(14);
}
.content-warp {
  margin-top: rem(40);
  font-size: rem(15);
}
.content-head {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  padding: rem(16) rem(14) rem(20) rem(14);
  margin-bottom: rem(10);
  img {
    width: rem(90);
    height: rem(90);
    border: 1px solid #fff;
    border-radius: rem(6);
  }
  .head-info {
    color: #18191a;
    p {
      margin-bottom: rem(14);
      text-align: right;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
/* 导航栏的样式 */
.navs {
  position: fixed;
  top: rem(40);
  width: 100%;
  height: rem(46);
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 3;
  white-space: nowrap;
  overflow-x: scroll;
  box-shadow: 0px 1px 4px 0px rgba(230, 230, 230, 0.5);
}
.navs li {
  display: inline-block;
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
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  top: rem(48);
}
.content > div {
  width: 100%;
  // max-height: rem(2000);
  margin-bottom: rem(10);
  &:last-child {
    margin: 0;
  }
}
.contractstatus {
  &.EXECUTING {
    color: #1cc296;
  }
  &.MATURITY {
    color: #fc5159;
  }
  &.WITHDRAWAL {
    color: #858c94;
  }
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
.sub-title {
  color: #18191a;
  font-size: rem(15);
  font-weight: bold;
  margin-top: rem(14);
}
.ul-warp {
  margin: 0 rem(14) 0 rem(14);
  border-bottom: rem(1) solid #f0f0f0;
  padding-bottom: rem(16);
  &:last-child {
    border: none;
  }
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
      min-width: rem(64);
      margin-right: rem(10);
    }
  }
}
.content-div {
  padding-top: rem(16) !important;
  font-size: rem(15);
  > span {
    color: #858c94;
  }
  div {
    padding-top: rem(10);
    color: #18191a;
  }
}
.an-item {
  display: flex;
  align-items: center;
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
  .ailPreview {
    flex: 1;
    text-align: right;
  }
}
.an-title {
  color: #858c94;
  display: flex;
  justify-content: space-between;
  padding-bottom: rem(14);
  padding-top: rem(14);
  .iconfont {
    color: #023c8f;
    font-size: rem(14);
    padding-right: rem(12);
    position: relative;
  }
  .iconcms_fujiantianjia:before {
    padding-right: rem(6);
  }
  .aliUpload {
    width: rem(80);
    height: rem(20);
  }
}
</style>
