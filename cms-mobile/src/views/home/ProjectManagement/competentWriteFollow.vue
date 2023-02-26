<template>
  <div class="competentWriteFollow">
    <app-header :title="title"
                :mode="false"
                @confirmFn="confirmFn">
      <div slot="rightBtn">
        <div @click.stop="submit">提交</div>
      </div>
    </app-header>
    <div class="content">
      <div class="ct-div title" @click="showPicker = true">
        发生时间
        <i class="required">*</i>
        <input type="text"
               readonly
               placeholder="请选择时间"
               maxlength="50"
               v-model="followRecordDTOParams.recordDate" />
      </div>
      <div class="ct-div title">
        标题
        <input type="text"
               placeholder="请输入标题"
               maxlength="20"
               v-model="followRecordDTOParams.title" />
      </div>
      <div class="ctent">
        内容
        <i class="required">*</i>
        <div>
          <textarea maxlength="500" placeholder="请输入500字以内"
                    v-model="followRecordDTOParams.content"></textarea>
          <p class="contentNum">{{followRecordDTOParams.content.length}}/500</p>
        </div>
        
      </div>
      <div class="ctent" style="padding-top: 0">
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
            <!-- <ailPreview :ailObj="item"
                        :encrypt="true"
                        @setFile="setFile"
                        class="ailPreview" /> -->
            <span @click="delEnclosure(index)"
                  class="delcl"><i class="iconfont iconcms_shanchu-233"></i></span>
          </div>
        </div>
      </div>
      <div class="ct-div title newspush">
        消息推送
        <van-switch v-model="followRecordDTOParams.messageFlg" size="18" active-color="#0139A4" />
      </div>
      <div class="ct-div type recipient" v-if="followRecordDTOParams.messageFlg">
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
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        title="选择完整时间"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
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
let roterFrom = null
export default {
  name: 'competentWriteFollow',
  components: {
    AppHeader,
    ailPreview,
    aliUpload
  },
  data () {
    return {
      title: '新增记录',
      processDefineId: '',
      followRecordDTOParams: {
        chargeDeptId: null,
        recordDate: '',
        title: '',
        content: '',
        annexes: [],
        messageFlg: false
      },
      followRecordDTOParamsClone: {
        chargeDeptId: null,
        recordDate: '',
        title: '',
        content: '',
        annexes: [],
        messageFlg: false
      },
      showPicker: false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      selectPerson: [],
      more: false,
      isconfirm: false
    }
  },
  created () {
    this.selectPerson = JSON.parse(sessionStorage.getItem('selectPerson'))
    if (sessionStorage.getItem('followRecordDTOParams')) {
      this.followRecordDTOParams = JSON.parse(sessionStorage.getItem('followRecordDTOParams'))
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
    if (from.name === 'competentDepartmentDel') {
      roterFrom = from.name
    }
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
      this.$router.replace({ name: 'selectRecipients', params: { selectPerson: '' }, query: {'id': this.$route.query.id} })
    },
    onConfirm (date) {
      let date1 = moment(date).format('YYYY-MM-DD HH:mm:ss')
      this.showPicker = false
      this.followRecordDTOParams.recordDate = date1
    },
    confirmFn () {
      if (this.isSubmit) {
        this.$router.replace({name: 'competentDepartmentDel', query: {'id': this.$route.query.id}})
        return
      }
      let _this = this
      if (JSON.stringify(this.followRecordDTOParams) === JSON.stringify(this.followRecordDTOParamsClone)) {
        _this.$router.replace({name: 'competentDepartmentDel', query: {'id': this.$route.query.id}})
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
          _this.$router.replace({name: 'competentDepartmentDel', query: {'id': this.$route.query.id}})
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
    setFile () { },
    submit () {
      if (!this.followRecordDTOParams.recordDate || this.followRecordDTOParams.recordDate === '') {
        Toast({
          message: '请选择发生时间',
          position: 'top'
        })
        return
      }
      if (!this.followRecordDTOParams.content || this.followRecordDTOParams.content === '') {
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
      this.followRecordDTOParams.chargeDeptId = this.$route.query.id
      let addData = {...this.followRecordDTOParams}
      addData.recordDate = addData.recordDate.replace(' ', 'T') + '.000Z'
      context.http.post('cms/api/chargeDept/record', addData).then(res => {
        this.isSubmit = true
        this.$router.back()
        Toast({
          message: '新增成功',
          position: 'top'
        })
        sessionStorage.removeItem('selectPerson')
        sessionStorage.removeItem('followRecordDTOParams')
      }).catch(error => {
        sessionStorage.removeItem('followRecordDTOParams')
        console.info(error)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
.competentWriteFollow {
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
      &:first-child{
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
      .contentNum{
        width:100%;
        text-align: right;
        font-size: rem(13);
        color:#858C94;
        margin-top:rem(8);
        padding-right:rem(14);
        padding-bottom:rem(14);
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
  .newspush{
    display: flex;
    justify-content: space-between;
    padding-right: rem(14);
  }
}
</style>
