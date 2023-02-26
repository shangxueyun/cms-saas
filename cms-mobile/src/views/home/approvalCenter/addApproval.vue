<template>
  <div class="addApproval">
    <app-header :title="title"
                :mode="false"
                :isconfirm="true"
                @confirmFn="confirmFn">
      <div slot="rightBtn">
        <div @click.stop="submit">提交</div>
      </div>
    </app-header>
    <div class="content">
      <div class="ct-div title">
        <i class="required">*</i>
        标题
        <input type="text"
               placeholder="请输入标题"
               maxlength="50"
               v-model="currencyForm.title" />
      </div>
      <div class="ctent">
        <i class="required">*</i>正文
        <div>
          <textarea maxlength="500" placeholder="请输入500字以内"
                    v-model="currencyForm.content"></textarea>
          <p class="contentNum">{{currencyForm.content.length}}/500</p>
        </div>
        
      </div>
      <div class="ctent">
        <div class="attachment">
          附件
          <i class="iconfont iconcms_fujiantianjia">添加附件
            <aliUpload class="aliUpload"
                       @setAnnex="setAnnex" />
          </i>
        </div>
        <div class="annexes">
          <div class="item"
               v-for="(item,index) in currencyForm.annexes"
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
</template>
<script>
import AppHeader from '@/components/appHead'
import ailPreview from '@/components/ailPreview.vue'
import aliUpload from '@/components/aliUpload.vue'
import { MessageBox, Toast } from 'mint-ui'
import context from '@/service'
import common from '@/utils/common.js'
let roterFrom = null
export default {
  name: 'AddNotice',
  components: {
    AppHeader,
    ailPreview,
    aliUpload
  },
  data () {
    return {
      title: '',
      processDefineId: '',
      currencyForm: {
        annexes: [],
        title: '',
        content: ''
      }
    }
  },
  created () {
    if (sessionStorage.getItem('currencyForm')) {
      this.currencyForm = JSON.parse(sessionStorage.getItem('currencyForm'))
    }
    if (this.$route.query.row) {
      let row = JSON.parse(this.$route.query.row)
      this.title = row.name
      this.processDefineId = row.id
    }
  },
  mounted () {
    if (window.history && window.history.pushState) {
      console.log(window.history)
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', this.confirmFn, false)
    }
  },
  destroyed () {
    MessageBox.close()
    window.removeEventListener('popstate', this.confirmFn, false)
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'addApprovalList') {
      roterFrom = from.name
    }
    next()
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  methods: {
    confirmFn () {
      let _this = this
      if ((!this.currencyForm.title || this.currencyForm.title === '') &&
        (!this.currencyForm.content || this.currencyForm.content === '') &&
        (!this.currencyForm.annexes || this.currencyForm.annexes.length === 0)) {
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
          sessionStorage.removeItem('currencyForm')
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
      this.currencyForm.annexes.push({
        'annexName': annexName,
        'annexURL': annexURL
      })
      sessionStorage.setItem('currencyForm', JSON.stringify(this.currencyForm))
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
          _this.currencyForm.annexes.splice(index, 1)
          sessionStorage.setItem('currencyForm', JSON.stringify(this.currencyForm))
        }
      })
    },
    setFile () { },
    submit () {
      if (!this.currencyForm.title || this.currencyForm.title === '') {
        Toast({
          message: '请输入标题',
          position: 'top'
        })
        return
      } else if (!this.currencyForm.content || this.currencyForm.content === '') {
        Toast({
          message: '请输入正文',
          position: 'top'
        })
        return
      }
      let addData = {
        currencyForm: this.currencyForm,
        processDefineId: this.processDefineId
      }
      context.http.post('cms/api/currency-form', addData).then(res => {
        if (res.status === 201) {
          sessionStorage.removeItem('currencyForm')
          Toast({
            message: '新增成功',
            position: 'top'
          })
          this.$router.replace({ name: roterFrom })
        }
      }).catch(error => {
        sessionStorage.removeItem('currencyForm')
        console.info(error)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
.addApproval {
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
}
</style>
