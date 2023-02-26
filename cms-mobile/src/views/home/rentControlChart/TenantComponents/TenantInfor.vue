<template>
  <div class="TenantInfor">
    <div class="basic-information">
      <div class="content-title">客户档案</div>
      <div class="ul-warp">
        <div class="content-ul">
          <span>客户名称</span>
          <span>{{tenantDetail.teantName}}</span>
        </div>
        <div class="content-ul">
          <span>统一社会信用代码</span>
          <span>{{tenantDetail.creditCode}}</span>
        </div>
        <div class="content-ul">
          <span>企业类型</span>
          <span>{{customerTypeState(tenantDetail.customerType)}}</span>
        </div>
        <div class="content-ul">
          <span>企业性质</span>
          <span>{{tenantDetail.companyNatureDescription}}</span>
        </div>
        <div class="content-ul">
          <span>行业</span>
          <span>{{tenantDetail.standardIndustryName}}</span>
        </div>
        <div class="content-ul">
          <span>就业人数</span>
          <span>{{tenantDetail.employeesNumber}}</span>
        </div>
        <div class="content-ul">
          <span>客户联系人</span>
          <span>{{tenantDetail.contact}}</span>
        </div>
        <div class="content-ul">
          <span>联系电话</span>
          <span>{{tenantDetail.telephone}}</span>
        </div>
        <div class="content-ul">
          <span>联系邮箱</span>
          <span>{{tenantDetail.email}}</span>
        </div>
        <div class="content-ul">
          <span>企业资质</span>
          <span>{{tenantDetail.companyQualificationDescription}}</span>
        </div>
        <div class="content-ul">
          <span>工商注册</span>
          <span>{{tenantDetail.businessRegisterDescription}}</span>
        </div>
        <div class="content-ul">
          <span>注册类别</span>
          <span>{{tenantDetail.registerTypeDescription||'-'}}</span>
        </div>
        <div class="content-ul">
          <span>税务登记</span>
          <span>{{formatTax(tenantDetail.taxRegistrationDescription)||'-'}}</span>
        </div>
        <div class="content-ul">
          <span>状态</span>
          <span>{{tenantDetail.useStatus === 'DISABLE' ? '已停用' : '使用中'}}</span>
        </div>
        <!-- <div class="content-ul">
          <span>项目</span>
          <span>{{tenantDetail.projectManagement.referred}}</span>
        </div>
        <div class="content-ul">
          <span>品牌名</span>
          <span>{{tenantDetail.referred}}</span>
        </div>
        <div class="content-ul">
          <span>房源号</span>
          <span :title="shopNumber">
            {{formatshopNumber(tenantDetail.roomsList)}}
          </span>
        </div>
        <div class="content-ul">
          <span>类型</span>
          <span>{{tenantDetail.customerType === 'PERSONAL' ? '个人' : tenantDetail.customerType === 'COMPANY' ? '企业' : '-'}}</span>
        </div>
        <div class="content-ul">
          <span>用途</span>
          <span>{{tenantDetail.tenantUseDescription}}</span>
        </div>
        <div class="content-ul">
          <span>行业</span>
          <span>{{tenantDetail.industry}}</span>
        </div>
        <div class="content-ul">
          <span>租赁面积</span>
          <span v-show="tenantDetail.contractArea">{{tenantDetail.contractArea}}㎡</span>
        </div>
        <div class="content-ul">
          <span>实时单价</span>
          <span v-show="tenantDetail.contractPrice !== null">{{tenantDetail.contractPrice | toLocaleString}}元/㎡天</span>
        </div>
        <div class="content-ul">
          <span>运营支持服务</span>
          <span>{{tenantDetail.operateUserName}}</span>
        </div>
        <div class="content-ul">
          <span>证件类型</span>
          <span>{{tenantDetail.certificateValue}}</span>
        </div>
        <div class="content-ul">
          <span>证件号码</span>
          <span>{{decryptMsg(tenantDetail.iDNumber)}}</span>
        </div>
        <div class="content-ul">
          <span>居住地址(发涵用)</span>
          <span>{{tenantDetail.nowAddress}}</span>
        </div>
        <div class="content-ul">
          <span>店长姓名</span>
          <span>{{tenantDetail.shopManagerName}}</span>
        </div>
        <div class="content-ul">
          <span>店长联系人电话</span>
          <span>{{tenantDetail.shopManagerTelephone}}</span>
        </div> -->
      </div>
    </div>
    <div class="basic-information">
      <div class="content-title">开票信息</div>
      <div class="ul-warp">
        <div class="content-ul">
          <span>开户银行</span>
          <span>{{tenantDetail.depositBank}}</span>
        </div>
        <div class="content-ul">
          <span>银行账号</span>
          <span>{{tenantDetail.bankAccount}}</span>
        </div>
        <div class="content-ul">
          <span>纳税人识别号</span>
          <span>{{tenantDetail.taxNo}}</span>
        </div>
        <div class="content-ul">
          <span>电话</span>
          <span>{{tenantDetail.phone}}</span>
        </div>
        <div class="content-ul">
          <span>开票地址</span>
          <span>{{tenantDetail.taxAddress}}</span>
        </div>
      </div>
    </div>
    <div class="basic-information">
      <div class="content-title">工商信息</div>
      <div class="ul-warp">
        <div class="content-ul">
          <span>统一社会信用代码</span>
          <span>{{tenantDetail.creditCode}}</span>
        </div>
        <div class="content-ul">
          <span>注册号</span>
          <span>{{tenantDetail.no}}</span>
        </div>
        <div class="content-ul">
          <span>组织结构代码</span>
          <span>{{tenantDetail.orgNo}}</span>
        </div>
        <!-- <div class="content-ul">
          <span>法定代表人</span>
          <span>{{tenantDetail.operName}}</span>
        </div> -->
        <div class="content-ul">
          <span>国籍</span>
          <span>{{tenantDetail.nationality}}</span>
        </div>
        <div class="content-ul">
          <span>注册资本</span>
          <span>{{tenantDetail.registCapi}}</span>
        </div>
        <div class="content-ul">
          <span>经营状态</span>
          <span>{{tenantDetail.status}}</span>
        </div>
        <!-- <div class="content-ul">
          <span>企业类型</span>
          <span>{{tenantDetail.econKind}}</span>
        </div> -->
        <div class="content-ul">
          <span>人员规模</span>
          <span>{{tenantDetail.staffSize}}</span>
        </div>
        <div class="content-ul">
          <span>成立日期</span>
          <span>{{TimeTrans(tenantDetail.startDate)}}</span>
        </div>
        <div class="content-ul">
          <span>营业期限</span>
          <span>{{TimeTrans(tenantDetail.teamEnd)}}</span>
        </div>
        <!-- <div class="content-ul">
          <span>核对日期</span>
          <span>{{TimeTrans(tenantDetail.checkDate)}}</span>
        </div> -->
        <div class="content-ul">
          <span>登记机关</span>
          <span>{{tenantDetail.belongOrg}}</span>
        </div>
        <div class="content-ul">
          <span>所属地区</span>
          <span>{{tenantDetail.province}}</span>
        </div>
        <div class="content-ul">
          <span>所属业态</span>
          <span>{{tenantDetail.companyIndustry}}</span>
        </div>
        <!-- <div class="content-ul">
          <span>注册地址</span>
          <span>{{tenantDetail.address}}</span>
        </div> -->
        <div class="content-div">
          <span>经营范围</span>
          <div>{{tenantDetail.scope}}</div>
        </div>
      </div>
    </div>
    <div class="basic-information riskAssessment">
      <div class="content-title">风险扫描</div>
      <div class="ul-warp">
        <div class="item"
             :class="{'cont':item.value}"
             v-for="(item,index) in listData"
             @click="riskDetails(item.value,item.dataType)"
             :key="index">
          <i class="iconfont"
             :class="item.class"></i>
          <span class="num">{{item.value}}</span>
          <p class="label">{{item.label}}</p>
        </div>
      </div>
    </div>
    <div class="basic-information certification"
         v-if="tenantDetail.tenantUse==='MARKET'">
      <div class="content-title">相关资质</div>
      <div class="ul-warp">
        <div class="menuTab">
          <span v-for="(item,index) in menuTabList"
                :key="index"
                :class="{'active':index === menuTabActive}"
                @click="menuTabChange(index)">{{item.label}}</span>
        </div>
        <div class="content">
          <div class="item"
               v-if="menuTabActive===0">
            <div class="content-ul">
              <span>证件号码</span>
              <span>{{tenantDetail.BUSINESS_LICENSE.iDNumber}}</span>
            </div>
            <div class="content-ul">
              <span>证件有效期</span>
              <span>{{tenantDetail.BUSINESS_LICENSE.termValidity}}</span>
            </div>
            <div class="content-div">
              <span>证件图片（点击可预览）</span>
              <div>
                <img v-if="tenantDetail.BUSINESS_LICENSE.imgUrl"
                     :src="tenantDetail.BUSINESS_LICENSE.imgUrl"
                     @click="showImg(tenantDetail.BUSINESS_LICENSE.imgUrl,0)">
              </div>
            </div>
          </div>
          <div class="item"
               v-if="menuTabActive===1">
            <div class="content-ul">
              <span>证件号码</span>
              <span>{{tenantDetail.FOOD_BUSINESS_LICENSE.iDNumber}}</span>
            </div>
            <div class="content-ul">
              <span>证件有效期</span>
              <span>{{tenantDetail.FOOD_BUSINESS_LICENSE.termValidity}}</span>
            </div>
            <div class="content-div">
              <span>证件图片（点击可预览）</span>
              <div>
                <img v-if="tenantDetail.FOOD_BUSINESS_LICENSE.imgUrl"
                     :src="tenantDetail.FOOD_BUSINESS_LICENSE.imgUrl"
                     @click="showImg(tenantDetail.FOOD_BUSINESS_LICENSE.imgUrl,0)">
              </div>
            </div>
          </div>
          <div class="item"
               v-if="menuTabActive===2">
            <div class="content-ul">
              <span>证件号码</span>
              <span>{{tenantDetail.HEALTH_CERTIFICATE.iDNumber}}</span>
            </div>
            <div class="content-ul">
              <span>证件有效期</span>
              <span>{{tenantDetail.HEALTH_CERTIFICATE.termValidity}}</span>
            </div>
            <div class="content-div">
              <span>证件图片（点击可预览）</span>
              <div>
                <img v-if="tenantDetail.HEALTH_CERTIFICATE.imgUrl"
                     :src="tenantDetail.HEALTH_CERTIFICATE.imgUrl"
                     @click="showImg(tenantDetail.HEALTH_CERTIFICATE.imgUrl,0)">
              </div>
            </div>
          </div>
          <div class="item"
               v-if="menuTabActive===3">
            <div class="content-ul">
              <span>证件号码</span>
              <span>{{tenantDetail.WEIGHING_APPARATUS.iDNumber}}</span>
            </div>
            <div class="content-ul">
              <span>证件有效期</span>
              <span>{{tenantDetail.WEIGHING_APPARATUS.termValidity}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="basic-information">
      <div class="content-title">客户简介</div>
      <div class="ul-warp">
        <div class="content-ul">
          <span>客户网站</span>
          <span>{{tenantDetail.website}}</span>
        </div>
        <div class="content-div">
          <span>客户简介</span>
          <div v-html="formatreplace(tenantDetail.introduction)"></div>
        </div>
        <div class="content-div">
          <span>档案文件</span>
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
            <ailPreview :ailObj="item"
                        :encrypt="true"
                        class="ailPreview" />
          </div>
        </div>
      </div>
    </div>
    <div class="basic-information">
      <div class="content-title">入驻信息</div>
      <div v-for="(item, index) in tenantDetail.checkData" :key="index">
        <div class="ul-warp">
          <div class="content-ul">
            <span>管理企业</span>
            <span>{{item.enterpriseName}}</span>
          </div>
          <div class="content-ul">
            <span>项目</span>
            <span>{{item.projectName}}</span>
          </div>
          <div class="content-ul">
            <span>楼宇</span>
            <span>{{item.buildingName}}</span>
          </div>
          <div class="content-ul">
            <span>房源号</span>
            <span>{{item.shopNumber}}</span>
          </div>
          <div class="content-ul">
            <span>房源面积(m²)</span>
            <span>{{item.buildingArea}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ailPreview from '@/components/ailPreview.vue'
import common from '@/utils/common.js'
import context from '@/service'
import { decrypt } from '@/utils/validate'
import { Toast, ImagePreview } from 'vant'
export default {
  name: 'TenantInfor',
  components: { ailPreview },
  props: {
    tenantDetail: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      menuTabActive: 0,
      menuTabList: [{ label: '营业执照' }, { label: '食品经营许可证' }, { label: '从业人员健康证' }, { label: '衡器鉴定证书' }],
      shopNumber: '',
      listData: []
    }
  },
  watch: {
    tenantDetail: {
      handler: function () {
        this.getCountData()
        // this.tenantDetail.iDNumber = this.decryptMsg(this.tenantDetail.iDNumber)
        if (this.tenantDetail.qualifiedDTOS.length) { // 相关资质
          this.tenantDetail.BUSINESS_LICENSE = this.tenantDetail.qualifiedDTOS[0]
          this.tenantDetail.FOOD_BUSINESS_LICENSE = this.tenantDetail.qualifiedDTOS[1]
          this.tenantDetail.HEALTH_CERTIFICATE = this.tenantDetail.qualifiedDTOS[2]
          this.tenantDetail.WEIGHING_APPARATUS = this.tenantDetail.qualifiedDTOS[3]
        }
      }
    }
  },
  created () {

  },
  methods: {
    formatTax (tax) {
      if (tax === '未注册') {
        tax = '未登记'
      } else if (tax === '镇外注册') {
        tax = '镇外登记'
      }
      return tax
    },
    customerTypeState (val) {
      if (val) {
        if (val === 'COMPANY') {
          return '法人单位'
        } else if (val === 'PERSONAL') {
          return '个体户'
        } else if (val === 'BRANCH') {
          return '分支机构'
        } else if (val === 'OTHER') {
          return '其他单位'
        } else {
          return ''
        }
      }
    },
    showImg (imgUrl, index) {
      const imageRatio = common.imageRatio(375)
      let paramTxt = `?x-oss-process=image/resize,w_${imageRatio.width},m_fixed` // 图片链接参数  防止安卓手机图片旋转
      let url = imgUrl + paramTxt
      let arr = []
      arr.push(url)
      ImagePreview({
        images: arr,
        startPosition: index
      })
    },
    menuTabChange (i) {
      this.menuTabActive = i
    },
    riskDetails (val, type) {
      if (val) {
        this.$router.push({ name: 'riskDetails', params: { 'tenantDetail': this.tenantDetail, 'dataType': type } })
      } else {
        this.$toast('暂无数据')
      }
    },
    getCountData () {
      let params = {
        tenantId: this.tenantDetail.id,
        tenantName: this.tenantDetail.teantName
      }
      context.http.get('cms/api/tenantRisk/count', params).then(res => {
        if (res.status === 200) {
          let data = res.data
          let arr = [
            { label: '失信数据', class: 'iconshixinxinxi', value: data.DISHONESTY, dataType: 'DISHONESTY' },
            { label: '被执行数据', class: 'iconbeizhihangshuju', value: data.EXECUTED, dataType: 'EXECUTED' },
            { label: '裁判文书', class: 'iconcaipanwenshu', value: data.REFEREE, dataType: 'REFEREE' },
            { label: '经营异常', class: 'iconjingyingyichang', value: data.MANAGEMENT, dataType: 'MANAGEMENT' },
            { label: '行政处罚', class: 'iconhangzhengchufa', value: data.ADMINISTRATION, dataType: 'ADMINISTRATION' },
            { label: '环保处罚', class: 'iconhuanbaochufa', value: data.ENVIRONMENT, dataType: 'ENVIRONMENT' },
            { label: '欠税公告', class: 'iconqianshuigonggao', value: data.TAXARREARS, dataType: 'TAXARREARS' },
            { label: '税收违法', class: 'iconshuishouweifa', value: data.TAXVIOLATION, dataType: 'TAXVIOLATION' }
          ]
          this.listData = arr
        }
      })
    },
    decryptMsg (val) {
      if (!val) return
      return decrypt(val)
    },
    formatreplace (description) {
      if (!description) {
        return
      }
      let html = description.replace(/\n/g, '<br/>')
      return html
    },
    TimeTrans (val) {
      if (val) {
        return val.substring(0, 10)
      }
      return ''
    },
    formatshopNumber (shopNumberArr) {
      if (!shopNumberArr) return
      let arr = []
      shopNumberArr.forEach(item => {
        arr.push(item.shopNumber)
      })
      this.shopNumber = arr.join('、')
      return arr.join('、')
    },
    getformat (annexName) {
      return common.getformat(annexName)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/config";
.TenantInfor {
  background-color: #f0f1f2;
  > div {
    background-color: #fff;
  }
}
.basic-information {
  margin-bottom: rem(10);
  &.certification {
    .ul-warp {
      margin: 0;
      .menuTab {
        padding-left: rem(10);
        height: rem(30);
        display: flex;
        align-items: center;
        border-bottom: 1px solid #f0f0f0;
        span {
          font-size: rem(13);
          margin-right: rem(10);
          height: rem(28);
          line-height: rem(28);
          &.active {
            color: #0139a4;
            border-bottom: rem(2) solid #0139a4;
          }
        }
      }
      .content {
        margin: 0 rem(14) 0 rem(14);
        img {
          width: rem(150);
          height: rem(80);
        }
      }
    }
  }
  &.riskAssessment {
    .ul-warp {
      display: flex;
      flex-wrap: wrap;
      padding: 0;
      margin: 0;
      .item {
        width: 25%;
        position: relative;
        color: #858c94;
        font-size: rem(12);
        text-align: center;
        height: rem(90);
        border-right: 1px solid #f0f0f0;
        border-bottom: 1px solid #f0f0f0;
        &.cont {
          .iconfont,
          .num {
            color: #f00;
          }
          .label {
            color: #333;
          }
        }
        &:not(:nth-child(5)):not(:nth-child(6)):not(:nth-child(7)):not(:nth-child(8)) {
          // box-shadow: 0px 2px 2px 0px #f0f0f0;
        }
        .num {
          position: absolute;
          top: rem(10);
          right: rem(10);
        }
        .iconfont {
          position: absolute;
          top: rem(30);
          left: 0;
          right: 0;
          margin: auto;
          font-size: rem(18);
        }
        .label {
          position: absolute;
          top: rem(55);
          left: 0;
          right: 0;
          margin: auto;
        }
        // .line {
        //   width: rem(1);
        //   background: #f0f0f0;
        //   height: 60%;
        //   position: absolute;
        //   top: rem(20);
        //   right: 0;
        // }
      }
    }
  }
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
</style>
