<template>
  <div class="recordData">
    <app-header :title="title"
                :mode="false"
                @confirmFn="confirmFn">
      <div slot="rightBtn">
        <div @click.stop="submit">提交</div>
      </div>
    </app-header>
    <div class="content">
      <div class="item">
        <div class="ct-div title"
             @click="showPicker = true">
          时间<i class="required">*</i>
          <input type="text"
                 readonly
                 placeholder="请选择时间"
                 maxlength="50"
                 v-model="followRecordDTOParams.followTime" />
        </div>
      </div>
      <div class="item">
        <div class="ct-div title">
          标题<i class="required">*</i>
          <input type="text"
                 placeholder="请输入标题"
                 maxlength="15"
                 v-model="followRecordDTOParams.title" />
        </div>
      </div>
      <div class="ctent">
        内容<i class="required">*</i>
        <div>
          <textarea maxlength="200"
                    placeholder="请输入200字以内"
                    v-model="followRecordDTOParams.followContent"></textarea>
          <p class="contentNum">{{followRecordDTOParams.followContent.length}}/200</p>
        </div>

      </div>
      <div class="item">
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
              <ailPreview :ailObj="item"
                          :encrypt="true"
                          @setFile="setFile"
                          class="ailPreview" />
              <span @click="delEnclosure(index)"
                    class="delcl"><i class="iconfont iconcms_shanchu-233"></i></span>
              <!-- <div class="operating">
                <i class="iconfont iconcms_chakan-" @click="showImg(followRecordDTOParams.annexes, index)"></i>
                <span @click="delEnclosure(index)"
                  class="delcl"><i class="iconfont iconcms_shanchu-233"></i></span>
              </div> -->
            </div>
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
import { MessageBox, Toast } from 'mint-ui'
import context from '@/service'
import common from '@/utils/common.js'
import moment from 'moment-timezone'
import { ImagePreview } from 'vant'
let roterFrom = null
export default {
  name: 'recordData',
  components: {
    AppHeader,
    ailPreview,
    aliUpload
  },
  data () {
    return {
      title: '写跟进',
      processDefineId: '',
      followRecordDTOParams: {
        followTime: '',
        annexes: [],
        recordTypeLable: '',
        title: '',
        followContent: '',
        businessId: null,
        taskId: null,
        userIds: [],
        messageFlg: false
      },
      // taskId
      showPicker: false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      showPicker2: false,
      selectPerson: [],
      more: false,
      info: {
        id: null,
        taskId: null
      },
      isconfirm: false
    }
  },
  computed: {
    isIOS () {
      return window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    }
  },
  created () {
    this.selectPerson = JSON.parse(sessionStorage.getItem('selectPerson'))
    if (sessionStorage.getItem('followRecordDTOParams')) {
      this.followRecordDTOParams = JSON.parse(sessionStorage.getItem('followRecordDTOParams'))
    }
    if (roterFrom === 'FilePreview' && sessionStorage.getItem('followRecordDTOParams')) {
      this.followRecordDTOParams = JSON.parse(sessionStorage.getItem('followRecordDTOParams'))
      sessionStorage.removeItem('followRecordDTOParams')
    } else {
      this.info = JSON.parse(sessionStorage.getItem('businessInfo'))
      this.followRecordDTOParams.businessId = this.info.id
      this.followRecordDTOParams.taskId = this.info.taskId
    }
    if (roterFrom === 'followRecordData') {
      this.followRecordDTOParams.followTime = ''
      this.followRecordDTOParams.annexes = []
      this.followRecordDTOParams.title = ''
      this.followRecordDTOParams.followContent = ''
      this.followRecordDTOParams.messageFlg = false
      sessionStorage.removeItem('selectPerson')
      this.selectPerson = []
    }
  },
  mounted () {
    // if (window.history && window.history.pushState) {
    //   history.pushState(null, null, document.URL)
    //   window.addEventListener('popstate', this.confirmFn, false)
    // }
  },
  // destroyed () {
  //   MessageBox.close()
  //   window.removeEventListener('popstate', this.confirmFn, false)
  // },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'FilePreview') {
      sessionStorage.setItem('followRecordDTOParams', JSON.stringify(this.followRecordDTOParams))
    } else if (to.name !== 'followRecordData' && to.name !== 'FilePreview') {
      sessionStorage.getItem('businessId') ? sessionStorage.removeItem('businessId') : null
    }
    next()
  },
  beforeRouteEnter (to, from, next) {
    // if (from.name === 'FilePreview') {
    //   roterFrom = from.name
    // } else {
    //   roterFrom = null
    // }
    roterFrom = from.name
    next()
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  methods: {
    delPerson (item, index) {
      this.selectPerson.splice(index, 1)
      sessionStorage.setItem('selectPerson', JSON.stringify(this.selectPerson))
    },
    addRecipient () {
      sessionStorage.setItem('followRecordDTOParams', JSON.stringify(this.followRecordDTOParams))
      this.$router.push({ name: 'selectRecipients', params: { selectPerson: '' }, query: { 'id': this.$route.query.id } })
    },
    onConfirm (date) {
      let date1 = moment(date).format('YYYY-MM-DD HH:mm:ss')
      this.showPicker = false
      this.followRecordDTOParams.followTime = date1
    },
    confirmFn () {
      // if (this.isSubmit) {
      //   this.$router.replace({ name: 'followRecord' })
      //   return
      // }
      let _this = this
      if ((!this.followRecordDTOParams.followTime || this.followRecordDTOParams.followTime === '') &&
        (!this.followRecordDTOParams.title || this.followRecordDTOParams.title === '') &&
        (!this.followRecordDTOParams.annexes || this.followRecordDTOParams.annexes.length === 0) &&
        (!this.followRecordDTOParams.followContent || this.followRecordDTOParams.followContent.length === 0)) {
        _this.$router.replace({ name: 'followRecord', query: { 'tenantID': this.$route.query.tenantID } })
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
          _this.$router.replace({ name: 'followRecord' })
        }
      }).catch(error => {
        if (error === 'cancel') {
          if (window.history && window.history.pushState) {
            history.pushState(null, null, document.URL)
          }
        }
      })
    },
    getformat (annexName) {
      return common.getformat(annexName)
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
        }
      })
    },
    setFile () {
      console.log('附件查看')
    },
    setAnnex (annexURL, annexName) {
      this.followRecordDTOParams.annexes.push({
        'annexName': annexName,
        'annexURL': annexURL
      })
    },
    submit () {
      if (!this.followRecordDTOParams.followTime || this.followRecordDTOParams.followTime === '') {
        Toast({
          message: '请选择时间',
          position: 'top'
        })
        return
      }
      if (!this.followRecordDTOParams.title || this.followRecordDTOParams.title === '') {
        Toast({
          message: '请输入标题',
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

      if (this.followRecordDTOParams && this.followRecordDTOParams.followTime) {
        this.followRecordDTOParams.followTime = this.followRecordDTOParams.followTime.replace(' ', 'T') + '.000Z'
      }
      context.http.put('cms/api/createTaskFollowRecord', this.followRecordDTOParams).then(res => {
        if (res.status === 201) {
          this.isSubmit = true
          window.sessionStorage.setItem('upDateRecord', true)
          window.sessionStorage.removeItem('followRecordDTOParams')
          if (!this.isIOS) {
            window.history.back()
          }
          window.history.back()
          Toast({
            message: '新增成功',
            position: 'top'
          })
        }
      }).catch(error => {
        console.info(error)
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
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config.scss";
.recordData {
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
      padding-left: rem(10);
      span {
        color: #000000;
        flex: 1;
        text-align: right;
        margin-right: rem(14);
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
        padding-right: rem(12);
        margin-left: rem(12);
        font-size: rem(15);
        color: rgba(24, 25, 26, 1);
        line-height: rem(20);
      }
    }
    .ctent {
      background-color: #fff;
      padding-left: rem(10);
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
      > div {
        .delcl {
          margin-left: rem(10);
        }
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
}
</style>
