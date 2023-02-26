<template>
  <div class="rIinterestedFollow">
    <app-header title="新增记录"
                :mode="false"
                @confirmFn="confirmFn">
      <div slot="rightBtn">
        <div @click.stop="submit">提交</div>
      </div>
    </app-header>
    <div class="content">
      <div>
        <div class="ct-div title"
             @click="showPicker = true">
          发生时间
          <i class="required">*</i>
          <input type="text"
                 readonly
                 placeholder="请选择时间"
                 maxlength="50"
                 v-model="followRecordDTOParams.followTime" />
        </div>
        <div class="ct-div title">
          标题
          <input type="text"
                 placeholder="请输入标题"
                 maxlength="20"
                 v-model="followRecordDTOParams.title" />
        </div>
        <div class="ctent">
          内容<i class="required">*</i>
          <div>
            <textarea maxlength="500"
                      placeholder="请输入500字以内"
                      v-model="followRecordDTOParams.followContent"></textarea>
            <p class="contentNum">{{followRecordDTOParams.followContent.length}}/500</p>
          </div>
        </div>
        <div class="ctent"
             style="padding-top: 0">
          <div class="attachment">
            附件
            <i class="iconfont iconcms_fujiantianjia">添加附件
              <aliUpload class="aliUpload"
                         @setAnnex="setAnnex" />
            </i>
          </div>
          <div class="annexes">
            <div class="item"
                 v-for="(item,index) in followRecordDTOParams.annexes"
                 :key="index">
              <div>
                <svg class="icon"
                     aria-hidden="true">
                  <use :xlink:href="getformat(item.annexName)"></use>
                </svg>
              </div>
              <div>{{item.annexName}}</div>
              <span @click="delEnclosure(index)"
                    class="delcl"><i class="iconfont iconcms_shanchu-233"></i></span>
            </div>
          </div>
        </div>
        <div class="ct-div title newspush">
          消息推送
          <van-switch v-model="followRecordDTOParams.messageFlg"
                      size="18"
                      active-color="#0139A4" />
        </div>
        <div class="ct-div type recipient"
             v-if="followRecordDTOParams.messageFlg">
          <i class="required">*</i>
          收件人<span class="subtitle">(点击头像可删除)</span>
          <i class="iconfont iconcms_fujiantianjia"
             @click="addRecipient">添加</i>
        </div>
        <div class="recipient-list"
             :class="{'moreSelect': more}"
             v-if="followRecordDTOParams.messageFlg">
          <div v-for="(item, index) in selectPerson"
               :key="item.nodeKey"
               v-if="item.userId"
               @click="delPerson(item, index)">
            {{nameFormat(item.userName)}}
          </div>
        </div>
        <div class="showMore"
             :class="{'moreAni':more}"
             v-if="selectPerson && selectPerson.length > 8"
             @click="more=!more">
          <i class="iconfont iconcms_xia"></i>
        </div>
      </div>
    </div>
    <van-popup v-model="showPicker"
               position="bottom"
               :style="{ height: '50%' }">
      <van-datetime-picker v-model="currentDate"
                           type="datetime"
                           title="选择完整时间"
                           :min-date="minDate"
                           :max-date="maxDate"
                           @confirm="onConfirm"
                           @cancel="showPicker = false" />
    </van-popup>
  </div>
</template>
<script>
import AppHeader from '@/components/appHead'
import ailPreview from '@/components/ailPreview.vue'
import aliUpload from '@/components/aliUpload.vue'
import Vue from 'vue'
import { ActionSheet, NumberKeyboard, Popup } from 'vant'
Vue.use(ActionSheet)
Vue.use(NumberKeyboard)
Vue.use(Popup)
import { MessageBox, Toast } from 'mint-ui'
import context from '@/service'
import common from '@/utils/common.js'
import moment from 'moment-timezone'
let roterFrom = null
export default {
  name: 'rIinterestedFollow',
  components: {
    AppHeader,
    ailPreview,
    aliUpload
  },
  data () {
    return {
      step: 1,
      processDefineId: '',
      followRecordDTOParams: {
        messageFlg: false,
        annexes: [],
        followContent: '',
        followTime: '',
        title: ''
      },
      showPicker: false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      showPicker2: false,
      typeColumns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      selectPerson: [],
      more: false,
      priceShow: false,
      popupShow: false,
      buildingList: [],
      floorList: [],
      roomList: [],
      tenantDetail: {}
    }
  },
  created () {
    this.selectPerson = JSON.parse(sessionStorage.getItem('selectPerson'))
    if (sessionStorage.getItem('followRecordDTOParams')) {
      this.followRecordDTOParams = JSON.parse(sessionStorage.getItem('followRecordDTOParams'))
    }
    if (sessionStorage.getItem('flowStep')) {
      this.step = Number(sessionStorage.getItem('flowStep'))
      sessionStorage.removeItem('flowStep')
    }
    this.relatedId = this.$route.query.relatedId
    this.relateType = this.$route.query.relateType
    this.projectId = this.$route.query.projectId
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
    if (from.name === 'relatedInformation') {
      roterFrom = from.name
    }
    next()
  },
  methods: {
    delPerson (item, index) {
      this.selectPerson.splice(index, 1)
      sessionStorage.setItem('selectPerson', JSON.stringify(this.selectPerson))
    },
    addRecipient () {
      sessionStorage.setItem('followRecordDTOParams', JSON.stringify(this.followRecordDTOParams))
      sessionStorage.setItem('flowStep', this.step)
      this.$router.replace({ name: 'selectRecipients', params: { selectPerson: '' }, query: this.$route.query })
    },
    onConfirm (date) {
      let date1 = moment(date).format('YYYY-MM-DD HH:mm:ss')
      this.showPicker = false
      this.followRecordDTOParams.followTime = date1
    },
    confirmFn () {
      if (this.isSubmit) {
        this.$router.replace({ name: 'relatedInformation', query: { 'relatedId': this.relatedId, 'relateType': this.relateType, 'projectId': this.projectId } })
        return
      }
      let _this = this
      if ((!this.followRecordDTOParams.followTime || this.followRecordDTOParams.followTime === '') &&
        (!this.followRecordDTOParams.title || this.followRecordDTOParams.title === '') &&
        (!this.followRecordDTOParams.annexes || this.followRecordDTOParams.annexes.length === 0) &&
        (!this.followRecordDTOParams.messageFlg && (!this.selectPerson || this.selectPerson.length === 0)) &&
        (!this.followRecordDTOParams.followContent || this.followRecordDTOParams.followContent.length === 0)) {
        _this.$router.replace({ name: 'relatedInformation', query: { 'relatedId': this.relatedId, 'relateType': this.relateType, 'projectId': this.projectId } })
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
          sessionStorage.removeItem('followRecordDTOParams')
          _this.$router.replace({ name: 'relatedInformation', query: { 'relatedId': this.relatedId, 'relateType': this.relateType, 'projectId': this.projectId } })
        }
      }).catch(error => {
        if (error === 'cancel') {
          if (window.history && window.history.pushState) {
            history.pushState(null, null, document.URL)
          }
        }
      })
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
    getformat (annexName) {
      return common.getformat(annexName)
    },
    setAnnex (annexURL, annexName) {
      this.followRecordDTOParams.annexes.push({
        'annexName': annexName,
        'annexURL': annexURL
      })
      sessionStorage.setItem('followRecordDTOParams', JSON.stringify(this.followRecordDTOParams))
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
          _this.followRecordDTOParams.annexes.splice(index, 1)
          sessionStorage.setItem('followRecordDTOParams', JSON.stringify(this.followRecordDTOParams))
        }
      })
    },
    submit () {
      if (!this.followRecordDTOParams.followTime || this.followRecordDTOParams.followTime === '') {
        Toast({
          message: '请选择时间',
          position: 'top'
        })
        return
      } else if (!this.followRecordDTOParams.followContent || this.followRecordDTOParams.followContent === '') {
        Toast({
          message: '请输入内容',
          position: 'top'
        })
        return
      }
      if (this.followRecordDTOParams.messageFlg && (!this.selectPerson || this.selectPerson.length === 0)) {
        Toast({
          message: '请选择收件人',
          position: 'top'
        })
        return
      }
      let arr = []
      if (this.selectPerson && this.selectPerson.length > 0) {
        this.selectPerson.forEach(ele => {
          arr.push(ele.userId)
        })
      }
      arr = [...new Set(arr)]
      this.followRecordDTOParams.userIds = arr
      this.followRecordDTOParams.businessId = this.relatedId
      this.followRecordDTOParams.followBusinessType = 'PROJECT_MANAGEMENT_RELATION'
      const postData = JSON.parse(JSON.stringify(this.followRecordDTOParams))
      postData.followTime = this.followRecordDTOParams.followTime.replace(' ', 'T') + '.000Z'

      context.http.post('cms/api/followRecord', postData).then(res => {
        if (res.status === 201) {
          this.isSubmit = true
          Toast({
            message: '新增成功',
            position: 'top'
          })
          sessionStorage.removeItem('selectPerson')
          sessionStorage.removeItem('followRecordDTOParams')
          this.$router.replace({ name: 'relatedInformation', query: { 'relatedId': this.relatedId, 'relateType': this.relateType, 'projectId': this.projectId } })
        }
      }).catch(error => {
        sessionStorage.removeItem('followRecordDTOParams')
        console.info(error)
      })
    }
  }
}
</script>
<style lang="scss">
@import "../../../style/config";
.rIinterestedFollow {
  #app-head {
    .back {
      display: block !important;
    }
    .left_btn {
      width: rem(40);
      height: rem(40);
      font-size: rem(18);
      color: #000000;
      &:first-child {
        float: left;
      }
    }
    .title {
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
.rIinterestedFollow {
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
}
</style>
