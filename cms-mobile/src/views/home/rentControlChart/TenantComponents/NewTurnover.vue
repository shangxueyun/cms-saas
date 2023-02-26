<template>
  <div id="add-notice">
    <app-header title="新增营业额"
                :mode="false"
                :isconfirm="true"
                @confirmFn="confirmFn">
      <div slot="rightBtn">
        <div @click.stop="submit">提交</div>
      </div>
    </app-header>
    <div class="content">
      <!-- 选择日期 -->
      <div class="ct-div title">
        <i style="font-style: normal;"><i class="required">*</i>日期</i>
        <van-cell is-link
                  title=""
                  :value="date"
                  @click="show = true" />
        <van-calendar v-model="show"
                      title="选择日期"
                      color="#3575F6"
                      :min-date="minDate"
                      :max-date="maxDate"
                      :show-confirm="false"
                      :default-date="defaultDate"
                      @confirm="onConfirm" />
      </div>
      <div class="ct-div title">
        <i style="font-style: normal;"><i class="required">*</i>营业额</i>
          <van-field v-model="addParam.turnoverAmount" placeholder="请输入营业额" type="number" input-align="right"/>
      </div>
    </div>
  </div>
</template>
<script>
import AppHeader from '@/components/appHead'
import ActionSheet from '@/components/Actionsheet'
import changWeely from '@/components/changeWeely.vue'
import { MessageBox, Toast } from 'mint-ui'
import * as hub from '@/service/eventHub'
import context from '@/service'
import Vue from 'vue'
import moment from 'moment'
import { Calendar, Cell, DatetimePicker, Popup, Field } from 'vant'
import common from '@/utils/common.js'
Vue.use(Calendar)
Vue.use(DatetimePicker)
Vue.use(Popup)
Vue.use(Cell)
Vue.use(Field)
export default {
  name: 'addReport',
  components: {
    AppHeader,
    changWeely,
    ActionSheet
  },
  data () {
    return {
      weekdate: '',
      minDate: new Date(new Date().getFullYear() - 10, 0, 1),
      maxDate: new Date(new Date().getFullYear() + 10, 11, 1),
      popupShow: false,
      currentDate: new Date(),
      addType: 'Day',
      date: '',
      show: false,
      defaultDate: '',
      addParam: {
        recordDate: '',
        turnoverAmount: ''
      }
    }
  },
  created () {
    const tenantId = this.$route.query.tenantID
    this.addParam.tenantId = tenantId
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    this.defaultDate = new Date(year, month, day - 1)
  },
  mounted () {
  },
  destroyed () {
    MessageBox.close()
  },
  methods: {
    formatDate (date) {
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    },
    onConfirm (date) {
      this.show = false
      this.addParam.recordDate = moment(date).format('YYYY-MM-DD')
      this.date = this.formatDate(date)
    },
    confirmFn () {
      this.$router.back()
    },
    submit () {
      if (!this.addParam.recordDate) {
        Toast('请选择日期')
        return
      }
      if (!this.addParam.turnoverAmount) {
        Toast('请输入营业额')
        return
      }
      context.http.post(`cms/api/turnovers/app`, this.addParam).then(res => {
        if (res.status === 200) {
          Toast('新增成功')
          this.addParam.turnoverAmount = ''
          this.confirmFn()
        } else {
          Toast(res.message)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/config";
#add-notice {
  .van-cell {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    flex: 1;
    box-sizing: border-box;
    width: 100%;
    padding: rem(10) rem(16);
    overflow: hidden;
    color: #858c94;
    font-size: rem(15);
    line-height: rem(24);
    background-color: #fff;
    &::after {
      border-bottom: none;
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
      padding-left: rem(20);
      span {
        color: #000000;
        flex: 1;
        text-align: right;
      }
      .van-cell__value--alone {
        text-align: right;
      }
    }
    .type {
      margin-top: rem(5);
      .iconfont {
        text-align: right;
        padding-right: rem(12);
        color: #858c94;
      }
    }
    .title {
      margin-top: rem(10);
      input {
        flex: 1;
        text-align: right;
        padding-right: rem(12);
        margin-left: rem(12);
        font-size: rem(15);
        color: rgba(24, 25, 26, 1);
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
        color: rgba(24, 25, 26, 1);
      }
    }
  }
}
</style>
