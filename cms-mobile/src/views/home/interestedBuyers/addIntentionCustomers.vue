<template>
  <div id="addIntentionCustomers">
    <app-header :title="title"
                :mode="false"
                :onBackCallBack="goBack"
                >
      <div slot="rightBtn">
        <div @click="submit" v-if="step1">下一步</div>
        <div v-else @click="save">确定</div>
      </div>
    </app-header>
    <div class="content" v-show="step1">
      <div class="ct-div type"
           @click="openProjectActionsheet = !openProjectActionsheet">
        项目
        <i class="required">*</i>
        <span :class="{'gray' : projectName === '请选择'}">
          {{ projectName }}
          <i class="iconfont iconright"></i>
        </span>
      </div>
      <div class="ctdiv-warp">
        <div class="ct-div title">
          意向客户类型
          <i class="required">*</i>
          <van-radio-group v-model="customerType" direction="horizontal">
            <van-radio name="COMPANY" icon-size="14px">企业</van-radio>
            <van-radio name="PERSONAL" icon-size="14px">个人</van-radio>
          </van-radio-group>
        </div>
        <div class="ct-div title">
          {{customerType==='COMPANY'?'企业名称':'姓名'}}
          <i class="required">*</i>
          <input type="text"
                placeholder="请填写"
                v-model="reportData.yxTenantName"
                maxlength="50" />
        </div>
        <div class="ct-div title">
          品牌名称
          <i class="required">*</i>
          <input type="text"
                placeholder="请填写"
                v-model="reportData.referred"
                maxlength="50" />
        </div>
        <div class="ct-div title" @click="openActionsheet2 = !openActionsheet2">
          用途
          <i class="required">*</i>
          <span>
            {{reportData.tenantUseDescription}}
            <i class="iconfont iconright"></i>
          </span>
        </div>
        <div class="ct-div title" @click="openActionsheet = !openActionsheet">
          行业
          <i class="required">*</i>
          <span>
            {{reportData.industryName}}
            <i class="iconfont iconright"></i>
          </span>
        </div>
      </div>
      <div class="ctdiv-warp">
        <div class="ct-div title">
          需求面积
          <i class="required">*</i>
          <input type="text"
                placeholder="请填写"
                readonly
                @click="areaShow = true"
                v-model="demandArea"
                maxlength="50" />
        </div>
        <div class="ct-div title">
          心理价位
          <i class="required">*</i>
          <input type="text"
                placeholder="请填写"
                readonly
                @click="priceShow = true"
                v-model="psychologicalPrice"
                maxlength="50" />
        </div>
        <div class="ct-div title" @click="showDatetime = true">
          预计开店时间
          <span :class="{'gray': !reportData.signDate}">
            {{reportData.signDate ? reportData.signDate : '请选择'}}
            <i class="iconfont iconright"></i>
          </span>
        </div>
      </div>
      <div class="ctdiv-warp">
        <div class="ct-div title">
          联系人
          <i class="required">*</i>
          <input type="text"
                placeholder="请填写"
                v-model="reportData.contact"
                maxlength="50" />
        </div>
        <div class="ct-div title">
          联系电话
          <i class="required">*</i>
          <input type="tel"
                placeholder="请填写"
                v-model="reportData.telephone"
                maxlength="20" />
        </div>
        <div class="ct-div title" @click="openKHActionsheet = !openKHActionsheet">
          意向客户来源
          <span :class="{'gray': !reportData.customerSource}">
            {{reportData.customerSource ? reportData.customerSource : '请选择'}}
            <i class="iconfont iconright"></i>
          </span>
        </div>
      </div>
    </div>
    <div class="content" v-show="!step1">
      <div class="ct-div title type">
        意向客户网站
        <input type="text"
              placeholder="请填写"
              v-model="reportData.website"
              maxlength="50" />
      </div>
      <div class="ctent">
        意向客户简介
        <div>
          <textarea placeholder="请输入内容"
                    maxlength="200"
                    v-model="reportData.introduction"></textarea>
        </div>
      </div>
      <div class="attachment">
        附件
        <i class="iconfont iconcms_fujiantianjia">添加附件
          <aliUpload class="aliUpload"
                      @setAnnex="setAnnex" />
        </i>
      </div>
      <div class="annexes">
        <div class="item"
              v-for="(item,index) in reportData.annexes"
              :key="index">
          <div>
            <svg class="icon"
                  aria-hidden="true">
              <use :xlink:href="pageGetformat(item.annexName)"></use>
            </svg>
          </div>
          <div class="annex-name">{{item.annexName}}</div>
          <div class="operating">
            <!-- <ailPreview :ailObj="item"
                        :encrypt="true"
                        class="ailPreview" /> -->
            <span @click="delEnclosure(index)"
                  class="delcl"><i class="iconfont iconcms_shanchu-233"></i></span>
          </div>
        </div>
      </div>
    </div>
    <!-- 项目 -->
    <action-sheet :open="openProjectActionsheet"
                  tsType="slideOutUp">
      <div slot="content">
        <div class="as-title">
          选择项目
          <i class="iconfont iconcms_guanbi"
             @click="openProjectActionsheet = false"></i>
        </div>
        <div slot="content">
          <ul class="pj-ul">
            <li v-for="(item, index) in projectManagementList"
                :key="item.id"
                @click="selectPJLi(item, index)"
                :class="{ selected: index === PJtabIndex }">
              <span>{{ item.referred }}</span>
            </li>
          </ul>
        </div>
      </div>
    </action-sheet>
    <!-- 用途 -->
    <action-sheet :open="openActionsheet2"
                  tsType="slideOutUp">
      <div slot="content">
        <div class="as-title">
          选择用途
          <i class="iconfont iconcms_guanbi"
             @click="openActionsheet2 = false"></i>
        </div>
        <ul class="">
          <li v-for="(item, index) in tenantUseList"
              :key="index"
              @click="selectLi2(item, index)"
              :class="{'selected': index === tabIndex2}">
            {{item.label}}
            <i class="iconfont iconcms_gou-227"
               v-show="index === tabIndex2"></i>
          </li>
        </ul>
      </div>
    </action-sheet>
    <!-- 行业 -->
    <action-sheet :open="openActionsheet"
                  tsType="slideOutUp">
      <div slot="content">
        <div class="as-title">
          选择业态
          <i class="iconfont iconcms_guanbi"
             @click="openActionsheet = false"></i>
        </div>
        <ul class="">
          <li v-for="(item, index) in industryList"
              :key="index"
              @click="selectLi(item, index)"
              :class="{'selected': index === tabIndex}">
            {{item.value}}
            <i class="iconfont iconcms_gou-227"
               v-show="index === tabIndex"></i>
          </li>
        </ul>
      </div>
    </action-sheet>
    <!-- 客户来源 -->
    <action-sheet :open="openKHActionsheet"
                  tsType="slideOutUp">
      <div slot="content">
        <div class="as-title">
          选择客户来源
          <i class="iconfont iconcms_guanbi"
             @click="openKHActionsheet = false"></i>
        </div>
        <ul>
          <li v-for="(item, index) in yxkhFrom"
              :key="index"
              @click="selectKHLi(item, index)"
              :class="{'selected': index === KHtabIndex}">
            {{item.value}}
            <i class="iconfont iconcms_gou-227"
               v-show="index === KHtabIndex"></i>
          </li>
        </ul>
      </div>
    </action-sheet>
    <!-- 开店时间 -->
    <van-popup v-model="showDatetime"
               position="bottom"
               :style="{ height: '50%' }">
      <van-datetime-picker v-model="currentDate"
                           type="date"
                           title="选择年月日"
                           :min-date="minDate"
                           :max-date="maxDate"
                           @cancel="showDatetime = false"
                           @confirm="confirmSelect" />
    </van-popup>
    <!-- 需求面积 -->
    <van-action-sheet :round="false" v-model="areaShow" title="需求面积">
      <div class="area_input_warp">
        <div class="area_input" :class="{'inputSelected': lowAreaInput}">
          <span v-if="reportData.lowArea" style="color: #000" @click.stop="lowAreaInput = true">{{reportData.lowArea}}</span>
          <span v-else style="color: #D9D9D9" @click.stop="lowAreaInput = true">请填写</span>㎡
        </div>
        <div class="underline">——</div>
        <div class="area_input" :class="{'inputSelected': !lowAreaInput}">
          <span v-if="reportData.highArea" style="color: #000" @click.stop="lowAreaInput = false">{{reportData.highArea}}</span>
          <span v-else style="color: #D9D9D9" @click.stop="lowAreaInput = false">请填写</span>㎡
        </div>
      </div>
      <!-- <div class="price_unit">
        <span @click="followRecordDTOParams.priceUnit = 'M2DAYS'" :class="followRecordDTOParams.priceUnit === 'M2DAYS' ? 'active' : ''">元/m²天</span>
        <span @click="followRecordDTOParams.priceUnit = 'MONTH'" :class="followRecordDTOParams.priceUnit === 'MONTH' ? 'active' : ''">元/月</span>
      </div> -->
      <van-number-keyboard
        :show="true"
        theme="custom"
        extra-key="."
        close-button-text="完成"
        @input="getArea"
        @delete="deleteArea"
        @close="areaShow=false"
      />
    </van-action-sheet>
    <!-- 心理价位 -->
    <van-action-sheet :round="false" v-model="priceShow" title="心理价位">
      <div class="price_input_warp">
        <div class="price_input" :class="{'inputSelected': lowPriceInput}">
          <p v-if="reportData.lowPrice" style="color: #000" @click.stop="lowPriceInput = true">{{reportData.lowPrice}}</p>
          <p v-else style="color: #D9D9D9" @click.stop="lowPriceInput = true">请填写</p>
        </div>
        <div class="underline">——</div>
        <div class="price_input" :class="{'inputSelected': !lowPriceInput}">
          <p v-if="reportData.highPrice" style="color: #000" @click.stop="lowPriceInput = false">{{reportData.highPrice}}</p>
          <p v-else style="color: #D9D9D9" @click.stop="lowPriceInput = false">请填写</p>
        </div>
      </div>
      <div class="price_unit">
        <span @click="reportData.priceUnit = 'M2DAYS';getPriceUnit()" :class="reportData.priceUnit === 'M2DAYS' ? 'active' : ''">元/m²天</span>
        <span @click="reportData.priceUnit = 'MONTH';getPriceUnit()" :class="reportData.priceUnit === 'MONTH' ? 'active' : ''">元/月</span>
        <span @click="reportData.priceUnit = 'YEAR';getPriceUnit()" :class="reportData.priceUnit === 'YEAR' ? 'active' : ''">元/年</span>
      </div>
      <van-number-keyboard
        :show="true"
        theme="custom"
        extra-key="."
        close-button-text="完成"
        @input="getPrice"
        @delete="deletePrice"
        @close="priceShow=false"
      />
    </van-action-sheet>
  </div>
</template>
<script>
import AppHeader from '@/components/appHead'
import ActionSheet from '@/components/Actionsheet'
import aliUpload from '@/components/aliUpload.vue'
import ailPreview from '@/components/ailPreview.vue'
import context from '@/service'
import * as hub from '@/service/eventHub'
import { MessageBox } from 'mint-ui'
import common from '@/utils/common.js'
import moment from 'moment-timezone'
let roterFrom = null
export default {
  name: 'addIntentionCustomers',
  components: {
    AppHeader,
    ActionSheet,
    aliUpload,
    ailPreview
  },
  data () {
    return {
      title: '新增意向客户',
      step1: true,
      stpe2: false,
      projectName: '请选择',
      openProjectActionsheet: false,
      openActionsheet: false,
      openActionsheet2: false,
      openKHActionsheet: false,
      actionList: [
        { name: '红头文件', value: 'RED_HEAD_DOCUMENT' },
        { name: '放假通知', value: 'HOLIDAY_NOTICE' },
        { name: '会议通知', value: 'MEETING_NOTICE' },
        { name: '办文单', value: 'OFFICE_DOCUMENT' },
        { name: '其他', value: 'OTHER' }
      ],
      PJtabIndex: '',
      tabIndex: '',
      tabIndex2: 0,
      KHtabIndex: '',
      more: false,
      reportData: {
        lowArea: '',
        highArea: '',
        priceUnit: 'M2DAYS',
        lowPrice: '',
        highPrice: '',
        yxTenantName: '',
        annexes: [],
        tenantUse: 'SHOP',
        tenantUseDescription: '商铺'
      },
      customerType: 'COMPANY',
      projectManagementList: [],
      industryList: [],
      yxkhFrom: [],
      showDatetime: false,
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(2030, 11, 31),
      currentDate: new Date(),
      areaShow: false,
      demandArea: '',
      lowAreaInput: true,
      priceShow: false,
      psychologicalPrice: '',
      lowPriceInput: true,
      tenantUseList: [
        {
          label: '商铺',
          value: 'SHOP'
        },
        {
          label: '办公',
          value: 'WORK'
        },
        {
          label: '菜场',
          value: 'MARKET'
        }
      ]
    }
  },
  created () {
    this.queryProjectManagement()
    this.industryFn(this.reportData.tenantUse)
    this.customerSource()
  },
  mounted () {
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', this.confirmFn, false)
    }
  },
  destroyed () {
    MessageBox.close()
    window.removeEventListener('popstate', this.confirmFn, false)
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'interestedList') {
      roterFrom = from.name
    }
    next()
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  methods: {
    getArea (val) {
      if (this.lowAreaInput) {
        this.reportData.lowArea = `${this.reportData.lowArea}${val}`
      } else {
        this.reportData.highArea = `${this.reportData.highArea}${val}`
      }
      this.demandArea = `${this.reportData.lowArea} ~ ${this.reportData.highArea} ㎡`
    },
    deleteArea () {
      if (this.lowAreaInput) {
        const value = this.reportData.lowArea.toString()
        if (value.length === 0) {
          this.reportData.lowArea = ''
        } else {
          this.reportData.lowArea = value.slice(0, value.length - 1)
        }
      } else {
        const value = this.reportData.highArea.toString()
        if (value.length === 0) {
          this.reportData.highArea = ''
        } else {
          this.reportData.highArea = value.slice(0, value.length - 1)
        }
      }
      this.demandArea = `${this.reportData.lowArea} ~ ${this.reportData.highArea} ㎡`
    },
    getPrice (val) {
      if (this.lowPriceInput) {
        this.reportData.lowPrice = `${this.reportData.lowPrice}${val}`
      } else {
        this.reportData.highPrice = `${this.reportData.highPrice}${val}`
      }
      this.getPriceUnit()
    },
    deletePrice () {
      if (this.lowPriceInput) {
        const value = this.reportData.lowPrice.toString()
        if (value.length === 0) {
          this.reportData.lowPrice = ''
        } else {
          this.reportData.lowPrice = value.slice(0, value.length - 1)
        }
      } else {
        const value = this.reportData.highPrice.toString()
        if (value.length === 0) {
          this.reportData.highPrice = ''
        } else {
          this.reportData.highPrice = value.slice(0, value.length - 1)
        }
      }
      this.getPriceUnit()
    },
    getPriceUnit () {
      let priceUnit = this.reportData.priceUnit === 'M2DAYS' ? '元/m²天' : '元/月'
      if (this.reportData.priceUnit === 'M2DAYS') {
        priceUnit = '元/m²天'
      } else if (this.reportData.priceUnit === 'MONTH') {
        priceUnit = '元/月'
      } else if (this.reportData.priceUnit === 'YEAR') {
        priceUnit = '元/年'
      }
      this.psychologicalPrice = `${this.reportData.lowPrice} ~ ${this.reportData.highPrice} ${priceUnit}`
    },
    // async industryFn () {
    //   let result = await context.http.get('uaa/api/paramet-managements/name?name=行业')
    //   this.industryList = result.data
    // },
    async industryFn (tenantUse) {
      let name = ''
      if (tenantUse === 'SHOP') {
        name = '业态'
      } else if (tenantUse === 'WORK') {
        name = '行业'
      } else {
        name = '菜场业态'
      }
      let result = await context.http.get(`uaa/api/paramet-managements/name?name=${name}`)
      this.tabIndex = ''
      this.reportData.industryName = ''
      this.reportData.industryId = ''
      this.industryList = result.data
    },
    async customerSource () {
      let result = await context.http.get('uaa/api/paramet-managements/name?name=客户来源')
      this.yxkhFrom = result.data
    },
    selectPJLi (item, index) {
      this.PJtabIndex = index
      this.openProjectActionsheet = false
      this.projectName = item.referred
      this.projectId = item.id
      this.reportData.projectManagementDTO = item
    },
    async queryProjectManagement () {
      const res = await context.http.get('cms/api/project-managements', {
        useStatus: 'USING'
      })
      if (res.status === 200) {
        this.projectManagementList = res.data
      }
    },
    nameFormat (str) {
      if (!str) return
      if (/^[a-zA-Z]*$/.test(str)) { // 英文
        return str.substring(0, 3)
      } else if (/^[\u4e00-\u9fa5]*$/.test(str)) { // 中文
        return str.substring(str.length - 2)
      } else {
        return str.substring(0, 3)
      }
    },
    pageGetformat (str) {
      return common.getformat(str)
    },
    setAnnex (annexURL, annexName) {
      this.reportData.annexes.push({
        'annexName': annexName,
        'annexURL': annexURL
      })
      // localStorage.setItem('noticeData', JSON.stringify(this.reportData))
    },
    confirmFn () {
      let _this = this
      if ((!this.projectId || this.projectId === '') && (!this.reportData.yxTenantName || this.reportData.yxTenantName === '') &&
        (!this.reportData.referred || this.reportData.referred === '') && (!this.reportData.industryId || this.reportData.industryId === '') &&
        (!this.reportData.lowArea || this.reportData.lowArea === '') && (!this.reportData.highArea || this.reportData.highArea === '') &&
        (!this.reportData.lowPrice || this.reportData.lowPrice === '') && (!this.reportData.highPrice || this.reportData.highPrice === '') &&
        (!this.reportData.contact || this.reportData.contact === '') && (!this.reportData.telephone || this.reportData.telephone === '') &&
        (!this.reportData.signDate || this.reportData.signDate === '') && (!this.reportData.customerSource || this.reportData.customerSource === '')
        ) {
        this.$router.replace({ name: roterFrom })
        return
      }
      MessageBox.confirm('', {
        message: '内容尚未保存，确定退出？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonClass: 'confirmButton',
        cancelButtonClass: 'cancelButton'
      }).then(action => {
        if (action === 'confirm') {
          _this.$router.replace({ name: roterFrom })
        }
      }).catch(error => {
        if (error === 'cancel') {
          if (window.history && window.history.pushState) {
            history.pushState(null, null, document.URL)
          }
        }
      })
    },
    goBack () {
      if (!this.step1) {
        this.step1 = true
      } else {
        // localStorage.removeItem('noticeData')
        this.$router.go(-1)
      }
    },
    delEnclosure (index) {
      this.reportData.annexes.splice(index, 1)
      // localStorage.setItem('noticeData', JSON.stringify(this.reportData))
    },
    confirmSelect (val) {
      this.showDatetime = false
      this.reportData.signDate = moment(val).format('YYYY-MM-DD')
    },
    selectLi (item, index) {
      this.tabIndex = index
      this.openActionsheet = false
      this.reportData.industryName = item.value
      this.reportData.industryId = item.id
    },
    selectLi2 (item, index) {
      this.tabIndex2 = index
      this.openActionsheet2 = false
      this.reportData.tenantUse = item.value
      this.reportData.tenantUseDescription = item.label
      this.industryFn(this.reportData.tenantUse)
    },
    selectKHLi (item, index) {
      this.KHtabIndex = index
      this.openKHActionsheet = false
      this.khName = item.value
      this.reportData.customerSource = item.value
      this.reportData.customerSourceId = item.id
    },
    submit () {
      console.log(this.reportData)
      if (!this.projectId) {
        this.$toast({
          message: '请选择项目',
          position: 'top'
        })
        return
      }
      if (!this.reportData.yxTenantName && this.customerType === 'COMPANY') {
        this.$toast({
          message: '请输入企业名称',
          position: 'top'
        })
        return
      }
      if (!this.reportData.yxTenantName && this.customerType === 'PERSONAL') {
        this.$toast({
          message: '请输入姓名',
          position: 'top'
        })
        return
      }
      if (!this.reportData.referred) {
        this.$toast({
          message: '请输入品牌名称',
          position: 'top'
        })
        return
      }
      if (!this.reportData.industryId) {
        this.$toast({
          message: '请选择业态',
          position: 'top'
        })
        return
      }
      if (!this.reportData.lowArea || !this.reportData.highArea) {
        this.$toast({
          message: '请输入需求面积',
          position: 'top'
        })
        return
      }
      if (!this.reportData.lowPrice || !this.reportData.highPrice) {
        this.$toast({
          message: '请输入心理价位',
          position: 'top'
        })
        return
      }
      if (!this.reportData.contact) {
        this.$toast({
          message: '请输入联系人',
          position: 'top'
        })
        return
      }
      if (!this.reportData.telephone) {
        this.$toast({
          message: '请输入联系电话',
          position: 'top'
        })
        return
      }
      this.reportData.customerType = this.customerType
      this.step1 = false
    },
    save () {
      context.http.post('cms/api/yxTenant', this.reportData).then(res => {
        if (res.status === 201) {
          this.$toast({
            message: '新增成功',
            position: 'top'
          })
          // localStorage.removeItem('noticeData')
          this.$router.replace({ name: 'interestedList' })
        }
      }).catch(error => {
        console.info(error)
      })
    }
  }
}
</script>
<style lang="scss">
@import "../../../style/config";
#addIntentionCustomers {
  .right_btn{
    width: rem(60)!important;
    text-align: right!important;
    padding-right: rem(12);
  }
  .van-overlay{
    background: rgba(0,0,0,.4);
  }
  .van-action-sheet__close{
    display: none;
  }
  .van-number-keyboard{
    position: static;
  }
  .area_input_warp,.price_input_warp{
    display: flex;
    justify-content: space-between;
  }
  .inputSelected{
    border-bottom: rem(1) solid #0139A4!important;
  }
  .area_input,.price_input{
    width: 50%;
    height: rem(30);
    line-height: rem(30);
    padding-left: rem(10);
    border-bottom: rem(1) solid #F0F0F0;
    span {
      display: inline-block;
      width: 86%;
    }
  }
  .underline{
    margin: 0 rem(10);
  }
  .price_unit{
    display: flex;
    padding: rem(8) rem(20);
    justify-content: space-between;
    span{
      display: block;
      height:rem(33);
      padding: 0 rem(15);
      line-height: rem(33);
      font-size: rem(15);
      color:#18191A;
      border:rem(1) solid #D9D9D9;
      border-radius: rem(33);
    }
    .active{
      color:#0139A4;
      background: #F3F7FF;
      border:rem(1) solid #C7D9FF;
    }
  }
  .ct-div{
    input {
      color: #18191A;
    }
  }
}
</style>
<style lang="scss" scoped>
@import "../../../style/config";
#addIntentionCustomers {
  .van-radio-group--horizontal {
    flex: 1;
    justify-content: flex-end;
  }
  .actionsheet_wrapper {
    top: rem(40);
    ul.pj-ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-start;
      padding-top: rem(10);
      margin-bottom: rem(40);
      li {
        display: inline-block;
        width: rem(100);
        height: rem(30);
        line-height: rem(30);
        color: #444547;
        font-size: rem(13);
        text-align: center;
        background: rgba(242, 242, 242, 1);
        margin-bottom: rem(10);
        margin-left: rem(18);
        border-radius: rem(3);
        &.selected {
          color: #0139a4;
          background: rgba(239, 246, 255, 1);
        }
        .iconfont {
          display: inline-block;
          margin-right: rem(16);
        }
      }
    }
    ul {
      margin-bottom: rem(40);
    }
  }
  .actionsheet_wrapper {
    // top: rem(58);
    li {
      height: rem(37);
      line-height: rem(37);
      color: #444547;
      font-size: rem(15);
      text-align: center;
      position: relative;
      &.selected {
        color: #0139a4;
      }
      .iconfont {
        display: inline-block;
        position: absolute;
        right: rem(12);
      }
    }
    .as-title {
      height: rem(40);
      line-height: rem(40);
      text-align: center;
      color: #18191a;
      font-size: rem(17);
      position: relative;
      .iconfont {
        position: absolute;
        right: rem(12);
        // font-size: rem(14);
      }
    }
    ul {
      max-height: rem(500);
      overflow: scroll;
    }
  }
  .content {
    color: #858c94;
    font-size: rem(15);
    margin-top: rem(40);
    overflow: hidden;
    .required {
      color: #fc5159;
      font-size: rem(15);
      margin-right: rem(4);
    }
    .ct-div {
      background-color: #fff;
      height: rem(58);
      display: flex;
      align-items: center;
      padding-left: rem(15);
      span {
        color: #000000;
        flex: 1;
        text-align: right;
      }
    }
    .type {
      margin-top: rem(5)!important;
      .iconfont {
        text-align: right;
        padding-right: rem(12);
        color: #858c94;
      }
    }
    .gray {
      color: #D9D9D9!important;
    }
    .title {
      margin-top: rem(10);
      input {
        flex: 1;
        text-align: right;
        padding: 0 rem(12);
        font-size: rem(15);
        line-height: rem(20);
      }
    }
    .ctent {
      background-color: #fff;
      padding-left: rem(20);
      margin-top: rem(10);
      padding-top: rem(10);
      textarea {
        width: 100%;
        height: rem(100);
        padding-top: rem(10);
        border-bottom: rem(1) solid #f0f0f0;
        font-size: rem(15);
        color: #18191A;
      }
    }
    .ctdiv-warp{
      background-color: #fff;
      margin-top: rem(10);
      .title{
        margin-top: 0;
      }
      .ct-div{
        padding-left: 0;
        margin-left: rem(15);
        border-bottom: rem(1) solid #F0F0F0;
        &:last-child {
          border: none;
        }
      }
      .iconright {
        padding-right: rem(12);
        color: #858c94;
      }
    }
    .attachment {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      height: rem(58);
      padding-left: rem(15);
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
    .recipient {
      margin-top: rem(10);
      .subtitle {
        font-size: rem(13);
        text-align: left;
        color: #858c94;
      }
      .iconfont {
        color: #023c8f;
        font-size: rem(14);
      }
      .iconcms_fujiantianjia:before {
        padding-right: rem(6);
      }
    }
    .recipient-list {
      height: rem(80);
      background-color: #fff;
      display: flex;
      flex-wrap: wrap;
      padding: 0 rem(15);
      overflow: hidden;
      &.moreSelect {
        height: auto;
      }
      div {
        display: inline-block;
        width: rem(34);
        height: rem(34);
        line-height: rem(34);
        font-size: rem(12);
        text-align: center;
        background: #3575f6;
        color: #fff;
        border-radius: 50%;
        margin: 0 rem(10) rem(8) 0;
        &:nth-of-type(8n) {
          margin-right: 0;
        }
      }
    }
    .showMore {
      padding: rem(10) 0;
      text-align: center;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-align: center;
      align-items: center;
      -ms-flex-pack: center;
      justify-content: center;
      color: #0139a4;
      background: #fff;
      &.moreAni {
        transform: rotate(180deg);
        transform-origin: center center;
      }
    }
  }
  .annexes {
    background-color: #fff;
    padding-left: rem(12);
    .title {
      padding: rem(10) 0 rem(13) rem(12);
      font-size: 15px;
      color: rgba(133, 140, 148, 1);
    }
    .item {
      display: flex;
      align-items: center;
      // padding: rem(4) 0 rem(4) 0;
      > div {
        &:first-child {
          margin-right: rem(15);
        }
        &:last-child {
          font-size: rem(15);
          color: rgba(24, 25, 26, 1);
        }
      }
    }
    .annex-name {
      width: 70%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .operating {
      flex: 1;
      display: flex;
      justify-content: flex-end;
    }
    .delcl {
      text-align: right;
      margin-right: rem(12);
      margin-left: rem(10);
      .iconfont {
        font-size: rem(16);
      }
    }
    .ailPreview {
      text-align: right;
      .iconfont {
        font-size: rem(16);
      }
    }
  }
}
</style>
