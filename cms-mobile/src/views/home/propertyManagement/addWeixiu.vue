<template>
  <div class="addWeixiu">
    <div>
      <app-header :title="title"
                  @confirmFn="confirmFn"
                  :mode="false">
        <!-- <div @click="baToRepairDetails"
             class="left_btn mintui mintui-back"
             slot="leftBtn"></div> -->
        <div slot="rightBtn">
          <div @click.stop="submit">提交</div>
        </div>
      </app-header>
      <div class="content">
        <div>
          <div class="ct-div title radio">
            <span>状态<i class="required">*</i></span>
            <van-radio-group v-model="addData.repairStatus"
                             direction="horizontal">
              <van-radio name="COMPLETE">已处理</van-radio>
              <van-radio name="NO"
                         style="margin-right:0">处理中</van-radio>
            </van-radio-group>
          </div>
          <div class="ct-div title"
               @click="showDatetime = true">
            时间<i class="required">*</i>
            <span :class="{'gray': !addData.repairDate}"
                  style="flex:1;text-align:right;color:#18191a">
              {{addData.repairDate ? addData.repairDate: '请选择'}}
              <i class="iconfont iconright"></i>
            </span>
          </div>
          <div class="ctent">
            维修记录<i class="required">*</i>
            <div>
              <textarea maxlength="500"
                        placeholder="请输入500字以内"
                        v-model="addData.recordString"></textarea>
              <p class="contentNum">{{addData.recordString.length}}/500</p>
            </div>
          </div>
          <div class="ctent"
               style="padding-top: 0">
            <div class="attachment">
              附件
              <i class="iconfont iconcms_fujiantianjia"
                 v-if="addData.annexes.length<5">添加附件
                <aliUpload class="aliUpload"
                           @setAnnex="setAnnex" />
              </i>
            </div>
            <div class="annexes">
              <div class="item"
                   v-for="(item,index) in addData.annexes"
                   :key="index">
                <div>
                  <svg class="icon"
                       aria-hidden="true">
                    <use :xlink:href="pageGetformat(item.annexName)"></use>
                  </svg>
                </div>
                <div>{{item.annexName}}</div>
                <ailPreview :ailObj="item"
                            :encrypt="true"
                            @setFile="setFile"
                            class="ailPreview" />
                <span @click="delEnclosure(index)"
                      class="delcl"><i class="iconfont iconcms_shanchu-233"></i></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 时间 -->
      <van-popup v-model="showDatetime"
                 position="bottom"
                 :style="{ height: '50%' }">
        <van-datetime-picker v-model="currentDate"
                             type="date"
                             title="选择年月日"
                             @cancel="showDatetime = false"
                             @confirm="confirmSelect" />
      </van-popup>

    </div>
  </div>
</template>

<script>
import context from '@/service'
import AppHeader from '@/components/appHead'
import aliUpload from '@/components/aliUpload.vue'
import ailPreview from '@/components/ailPreview.vue'
import Common from '@/utils/common'
import Vue from 'vue'
import moment from 'moment-timezone'
import { MessageBox } from 'mint-ui'
import { RadioGroup, Radio, Toast } from 'vant'
Vue.use(Toast)
Vue.use(Radio)
Vue.use(RadioGroup)
let roterFrom = null
export default {
  name: 'addWeixiu',
  components: {
    AppHeader,
    ailPreview,
    aliUpload
  },
  computed: {

  },
  data () {
    return {
      title: '新增维修单',
      showDatetime: false,
      repairDetails: null, // 保修单详情
      currentDate: new Date(),
      addData: {
        repairStatus: 'NO',
        repairDate: null,
        recordString: '',
        annexes: [],
        repairFormStatus: 'WAIT',
        equirementNo: null,
        equirementId: null,
        name: null,
        repairType: 'EQUIREMENT',
        maintenanceClassify: 'REPAIR',
        imageUrls: [],
        materialUsage: null,
        remake: null,
        description: null,
        repairUserName: null,
        repairFee: null
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'repairList' || from.name === 'maintainList') {
      roterFrom = from.name
    }
    next()
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`1
    // 因为当守卫执行前，组件实例还没被创建
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'FilePreview') {
      sessionStorage.setItem('addWeixiuData', JSON.stringify(this.addData))
      sessionStorage.setItem('repairDetails', JSON.stringify(this.repairDetails))
    }
    next()
  },
  created () {
    let addWeixiuData = sessionStorage.getItem('addWeixiuData')
    if (addWeixiuData) {
      this.addData = JSON.parse(addWeixiuData)
    }
    this.repairDetails = this.$route.params.repairDetails || JSON.parse(sessionStorage.getItem('repairDetails'))
    // console.log(this.repairDetails)
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
  methods: {
    setFile () {

    },
    confirmSelect (val) {
      this.showDatetime = false
      this.addData.repairDate = moment(val).format('YYYY-MM-DD')
    },
    submit (formName) { // 新增维保记录
      if (!this.addData.repairDate) {
        Toast({
          message: '请选择时间',
          position: 'top'
        })
        return
      }
      if (!this.addData.recordString) {
        Toast({
          message: '请填写维修记录',
          position: 'top'
        })
        return
      }
      this.addData.repairType = this.repairDetails.repairType
      this.addData.roomsName = this.repairDetails.roomsName
      this.addData.name = this.repairDetails.name
      this.addData.projectId = this.repairDetails.projectId
      this.addData.repairFormCode = this.repairDetails.repairFormCode
      this.addData.repairFormId = this.repairDetails.id
      this.addData.equirementNo = this.repairDetails.equirementNo
      context.http.post('cms/api/repair-records', this.addData).then(res => {
        if (res) {
          Toast({
            message: '维修记录新增成功',
            position: 'top'
          })
          this.$router.replace({ name: 'repairDetails', query: { 'repairId': this.repairDetails.id } })
        }
      })
    },
    confirmFn () {
      let _this = this
      if (
        (!this.addData.repairDate) &&
        (!this.addData.recordString) &&
        (!this.addData.annexes.length)
      ) {
        this.$router.replace({ name: 'repairDetails', query: { 'repairId': this.repairDetails.id } })
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
          _this.$router.replace({ name: 'repairDetails', query: { 'repairId': this.repairDetails.id } })
        }
      }).catch(error => {
        if (error === 'cancel') {
          if (window.history && window.history.pushState) {
            history.pushState(null, null, document.URL)
          }
        }
      })
    },
    baToRepairDetails () {
      this.$router.replace({ name: 'repairDetails', query: { 'repairId': this.repairDetails.id } })
    },
    setAnnex (annexURL, annexName) {
      this.addData.annexes.push({ 'annexURL': annexURL, 'annexName': annexName })
    },
    delEnclosure (index) {
      let _this = this
      MessageBox.confirm('', {
        message: '确定删除附件吗？',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        confirmButtonClass: 'confirmButton',
        cancelButtonClass: 'cancelButton'
      }).then(action => {
        if (action === 'confirm') {
          _this.addData.annexes.splice(index, 1)
        }
      })
      // this.addData.annexes.splice(index, 1)
    },
    pageGetformat (str) {
      return Common.getformat(str)
    }
  }
}
</script>
<style lang="scss">
@import "../../../style/config";
.addWeixiu {
  #app-head {
    .left_btn {
      width: rem(40);
      height: rem(40);
      font-size: rem(18);
      color: #000000;
      &:first-child {
        float: left;
      }
    }
    .right_btn {
      width: rem(80);
      text-align: right;
      padding-right: rem(14);
      position: fixed;
      right: 0;
      top: 0;
    }
    .title {
      padding-right: rem(40);
    }
  }
  .van-overlay {
    background: rgba(0, 0, 0, 0.4);
  }
  .van-action-sheet__close {
    display: none;
  }
  .van-number-keyboard {
    position: static;
  }
  .price_input {
    height: rem(50);
    border-bottom: rem(1) solid #0139a4;
    p {
      display: block;
      line-height: rem(50);
      text-align: center;
      font-size: rem(15);
    }
  }
  .price_unit {
    display: flex;
    padding: rem(8) rem(55);
    justify-content: space-between;
    span {
      display: block;
      height: rem(33);
      padding: 0 rem(15);
      line-height: rem(33);
      font-size: rem(15);
      color: #18191a;
      border: rem(1) solid #d9d9d9;
      border-radius: rem(33);
    }
    .active {
      color: #0139a4;
      background: #f3f7ff;
      border: rem(1) solid #c7d9ff;
    }
  }
}
</style>
<style lang="scss" scoped>
@import "../../../style/config";
.addWeixiu {
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
    .ct-title {
      height: rem(40);
      line-height: rem(40);
      background: #fff;
      padding-left: rem(14);
      color: #18191a;
      font-size: rem(15);
      font-weight: bolder;
      border-bottom: rem(1) solid #f0f0f0;
    }
    .ct-div {
      background-color: #ffffff;
      height: rem(58);
      display: flex;
      align-items: center;
      padding-left: rem(14);
      padding-right: rem(10);
      .ct-list {
        > span {
          color: #000000;
          flex: 1;
          text-align: right;
          margin-right: rem(6);
          > span {
            color: #c6c6c6;
            margin-left: rem(6);
          }
        }
        .noValue {
          color: #d9d9d9;
        }
        .flieds {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-left: rem(20);
          padding-right: rem(22);
        }
      }
      .gray {
        flex: 1;
        text-align: right;
        color: #d9d9d9 !important;
        .iconfont {
          color: #858c94 !important;
        }
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
      &:first-child {
        margin: 0;
      }
      input {
        flex: 1;
        text-align: right;
        padding-right: rem(28);
        margin-left: rem(12);
        font-size: rem(15);
        color: rgba(24, 25, 26, 1);
        line-height: rem(20);
      }
      &.radio {
        display: flex;
        justify-content: space-between;
      }
    }
    .ct-list {
      width: 100%;
      height: rem(58);
      display: flex;
      align-items: center;
      border-bottom: rem(1) solid #f0f0f0;
    }
    .ctent {
      background-color: #fff;
      padding-left: rem(14);
      margin-top: rem(10);
      padding-top: rem(10);
      textarea {
        width: 100%;
        height: rem(100);
        padding-top: rem(10);
        font-size: rem(15);
        color: rgba(24, 25, 26, 1);
      }
      .contentNum {
        width: 100%;
        text-align: right;
        font-size: rem(13);
        color: #858c94;
        margin-top: rem(8);
        padding-right: rem(14);
        padding-bottom: rem(14);
      }
    }
    .attachment {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      height: rem(58);
      .iconfont {
        color: #023c8f;
        font-size: rem(14);
        padding-right: rem(14);
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
        flex: 1;
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
        &:nth-child(2) {
          width: 70%;
          padding-right: rem(10);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        &:last-child {
          font-size: rem(15);
          color: rgba(24, 25, 26, 1);
        }
      }
    }
    .delcl {
      flex: 1;
      text-align: right;
      margin-right: rem(12);
    }
  }
  .newspush {
    display: flex;
    justify-content: space-between;
    padding-right: rem(14);
  }
  .selected_rooms {
    margin-right: rem(14);
    background: #f2f6ff;
    line-height: rem(24);
    color: #444547;
    font-size: rem(12);
    padding: 0 rem(10);
    margin-bottom: rem(18);
  }
  input::-webkit-input-placeholder,
  textarea::-webkit-input-placeholder {
    color: #d9d9d9;
  }
}
</style>

