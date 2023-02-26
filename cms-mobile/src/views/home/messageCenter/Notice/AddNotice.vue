<template>
  <div id="add-notice">
    <app-header :title="title"
                :mode="false"
                :isconfirm="true"
                @confirmFn="confirmFn">
      <div slot="rightBtn">
        <div @click="submit">提交</div>
      </div>
    </app-header>
    <div class="content">
      <div class="ct-div type"
           @click="toggleActionSheet">
        <i class="required">*</i>
        通知类型
        <span>
          {{reportData.filterText}}
          <i class="iconfont iconright"></i>
        </span>
      </div>
      <div class="ct-div title">
        <i class="required">*</i>
        标题
        <input type="text"
               placeholder="请输入标题"
               v-model="reportData.title"
               maxlength="50" />
      </div>
      <div class="ctent">
        <i class="required">*</i>内容
        <div>
          <textarea placeholder="请输入内容"
                    v-model="reportData.content"></textarea>
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
              <ailPreview :ailObj="item"
                          :encrypt="true"
                          class="ailPreview" />
              <span @click="delEnclosure(index)"
                    class="delcl"><i class="iconfont iconcms_shanchu-233"></i></span>
            </div>
          </div>
        </div>
      </div>
      <div class="ct-div type recipient">
        <i class="required">*</i>
        收件人<span class="subtitle">(点击头像可删除)</span>
        <i class="iconfont iconcms_fujiantianjia"
           @click="addRecipient">添加</i>
      </div>
      <div class="recipient-list"
           :class="{'moreSelect': more}">
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

    <action-sheet :open="openActionsheet"
                  tsType="slideOutUp">
      <div slot="content">
        <div class="as-title">
          选择通知类型
          <i class="iconfont iconcms_guanbi"
             @click="openActionsheet = false"></i>
        </div>
        <ul>
          <li v-for="(item, index) in actionList"
              :key="index"
              @click="selectLi(item, index)"
              :class="{'selected': index === tabIndex}">
            {{item.name}}
            <i class="iconfont iconcms_gou-227"
               v-show="index === tabIndex"></i>
          </li>
        </ul>
      </div>
    </action-sheet>
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
let roterFrom = null
export default {
  name: 'AddNotice',
  components: {
    AppHeader,
    ActionSheet,
    aliUpload,
    ailPreview
  },
  data () {
    return {
      title: '新增通知',
      openActionsheet: false,
      actionList: [
        { name: '红头文件', value: 'RED_HEAD_DOCUMENT' },
        { name: '放假通知', value: 'HOLIDAY_NOTICE' },
        { name: '会议通知', value: 'MEETING_NOTICE' },
        { name: '办文单', value: 'OFFICE_DOCUMENT' },
        { name: '其他', value: 'OTHER' }
      ],
      tabIndex: '',
      more: false,
      reportData: {
        annexes: [
          // { annexName: 'SDSAD.mp4', annexURL: 'http://dev-img.yunwutech.com/6z78P7romgV0iorX2M1o' },
          // { annexName: '合同审批列表.pdf', annexURL: 'http://dev-img.yunwutech.com/6z78P7romgV0iorX2M1o' }
        ]
      },
      selectPerson: []
    }
  },
  created () {
    this.selectPerson = JSON.parse(sessionStorage.getItem('selectPerson'))
    if (localStorage.getItem('noticeData')) {
      this.reportData = JSON.parse(localStorage.getItem('noticeData'))
    }
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
    if (from.name === 'Notice' || from.name === 'messageCenter') {
      roterFrom = from.name
    }
    next()
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  methods: {
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
        'annexUrl': annexURL
      })
      localStorage.setItem('noticeData', JSON.stringify(this.reportData))
    },
    confirmFn () {
      let _this = this
      if ((!this.reportData.filterText || this.reportData.filterText === '') && (!this.reportData.title || this.reportData.title === '') &&
        (!this.reportData.content || this.reportData.content === '') && (!this.reportData.annexes || this.reportData.annexes.length === 0) &&
        (!this.selectPerson || this.selectPerson.length === 0 || this.selectPerson.every((item, index, arr) => { return !item.userName }))) {
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
          localStorage.removeItem('noticeData')
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
    delEnclosure (index) {
      this.reportData.annexes.splice(index, 1)
      localStorage.setItem('noticeData', JSON.stringify(this.reportData))
    },
    delPerson (item, index) {
      // item.checked = false
      // hub.eventHub.$emit('handleCheck', item)
      // this.selectPerson = JSON.parse(sessionStorage.getItem('selectPerson'))
      this.selectPerson.splice(index, 1)
      sessionStorage.setItem('selectPerson', JSON.stringify(this.selectPerson))
    },
    toggleActionSheet () {
      this.openActionsheet = !this.openActionsheet
    },
    selectLi (item, index) {
      this.tabIndex = index
      this.openActionsheet = false
      this.reportData.filterText = item.name
      this.reportData.notifyType = item.value
    },
    addRecipient () {
      this.$router.push({ name: 'selectRecipients' })
      localStorage.setItem('noticeData', JSON.stringify(this.reportData))
    },
    submit () {
      if (!this.reportData.notifyType) {
        this.$toast({
          message: '请选择通知类型',
          position: 'top'
        })
        return
      }
      if (!this.reportData.title) {
        this.$toast({
          message: '请输入标题',
          position: 'top'
        })
        return
      }
      if (!this.reportData.content) {
        this.$toast({
          message: '请输入内容',
          position: 'top'
        })
        return
      }
      this.reportData.messageCenterType = 'NOTIFY'
      this.reportData.onSendAll = false
      let arr = []
      if (this.selectPerson && this.selectPerson.length > 0) {
        this.selectPerson.forEach(ele => {
          if (ele.userId) {
            arr.push({ userId: ele.userId, userName: ele.userName })
          }
        })
      }
      this.reportData.users = arr
      if (this.reportData.users.length === 0) {
        this.$toast({
          message: '请选择收件人',
          position: 'top'
        })
        return
      }
      console.log('reportData', this.reportData)
      context.http.post('mps/api/messageCenters/save', this.reportData).then(res => {
        if (res.status === 201) {
          this.$toast({
            message: '新增成功',
            position: 'top'
          })
          localStorage.removeItem('noticeData')
          this.$router.replace({ name: roterFrom })
        }
      }).catch(error => {
        console.info(error)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/config";
#add-notice {
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
        padding-left: rem(10);
        border-bottom: rem(1) solid #f0f0f0;
        font-size: rem(15);
      }
    }
    .attachment {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      height: rem(58);
      padding-left: rem(10);
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
