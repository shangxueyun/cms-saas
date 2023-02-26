<template>
  <div class="addCompetentDepartment">
    <app-header :title="title"
                :mode="false"
                :isconfirm="true"
                @confirmFn="confirmFn">
      <div slot="rightBtn">
        <div @click.stop="submit">提交</div>
      </div>
    </app-header>
    <div class="content">
      <div style="background:#fff">
        <div class="ct-div title">
          关联单位
          <i class="required">*</i>
          <input type="text"
                 placeholder="请输入"
                 maxlength="20"
                 v-model="addData.deptName" />
        </div>
        <div class="ct-div title">
          办公地址
          <i class="required">*</i>
          <input type="text"
                 placeholder="请输入"
                 maxlength="50"
                 v-model="addData.address" />
        </div>
        <div class="ct-div title">
          联系电话
          <input type="text"
                 onkeyup="value=value.replace(/[^0-9]/g,'')"
                 placeholder="请输入"
                 v-model="addData.deptTel" />
        </div>
        <div class="ctent">
          简介
          <div>
            <textarea maxlength="500"
                      placeholder="请输入500字以内"
                      v-model="addData.introduction"></textarea>
            <p class="contentNum">{{addData.introduction.length}}/500</p>
          </div>
        </div>
        <!-- <div class="ctent">
          备注
          <div>
            <textarea maxlength="200"
                      placeholder="请输入200字以内"
                      v-model="addData.remark"></textarea>
            <p class="contentNum">{{addData.remark.length}}/200</p>
          </div>
        </div> -->
      </div>
      <div class="contractsPerson">
        <div class="p_title">联系人信息</div>
        <div v-for="(item,index) in addData.contacts"
             :key="index"
             :class="index !== 0 ? 'panel' : ''">
          <div v-if="index !== 0"
               class="dele_panel"><span @click="subItem(item,index)"
                  class="iconfont iconcms_guanbi">删除该项</span></div>
          <div class="ct-div title">
            联系人
            <i class="required">*</i>
            <input type="text"
                   placeholder="请输入"
                   maxlength="10"
                   v-model="item.name" />
          </div>
          <div class="ct-div title">
            职务
            <input type="text"
                   placeholder="请输入"
                   maxlength="10"
                   v-model="item.post" />
          </div>
          <div class="ct-div title">
            手机
            <input type="text"
                   placeholder="请输入"
                   maxlength="20"
                   onkeyup="value=value.replace(/[^0-9]/g,'')"
                   v-model="item.telephone" />
          </div>
        </div>
        <div @click="addItem"
             class="add_btn">继续添加</div>
      </div>
    </div>
  </div>
</template>
<script>
import AppHeader from '@/components/appHead'
import { MessageBox, Toast } from 'mint-ui'
import context from '@/service'
import common from '@/utils/common.js'
let roterFrom = null
export default {
  name: 'addCompetentDepartment',
  components: {
    AppHeader
  },
  data () {
    return {
      title: '新增关联单位',
      processDefineId: '',
      addData: {
        remark: '',
        projectId: '',
        deptName: '',
        address: '',
        deptTel: '',
        introduction: '',
        contacts: [
          { name: '', post: '', telephone: '' }
        ]
      },
      addDataClone: {
        remark: '',
        projectId: '',
        deptName: '',
        address: '',
        deptTel: '',
        introduction: '',
        contacts: [
          { name: '', post: '', telephone: '' }
        ]
      }
    }
  },
  created () {
    if (sessionStorage.getItem('addData')) {
      this.addData = JSON.parse(sessionStorage.getItem('addData'))
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
    if (from.name === 'competentDepartmentList') {
      roterFrom = from.name
    }
    next()
  },
  methods: {
    addItem (item, index) { // 加减联系人
      this.addData.contacts.push(
        { name: '', post: '', telephone: '' }
      )
    },
    subItem (item, index) {
      this.addData.contacts.splice(index, 1)
    },
    confirmFn () {
      let _this = this
      if (JSON.stringify(this.addData) === JSON.stringify(this.addDataClone)) {
        this.$router.replace({ name: roterFrom, query: { projectMmanagementId: this.$route.params.projectMmanagementId } })
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
          sessionStorage.removeItem('addData')
          _this.$router.replace({ name: roterFrom, query: { projectMmanagementId: this.$route.params.projectMmanagementId } })
        }
      }).catch(error => {
        if (error === 'cancel') {
          if (window.history && window.history.pushState) {
            history.pushState(null, null, document.URL)
          }
        }
      })
    },
    submit () {
      if (!this.addData.deptName || this.addData.title === '') {
        Toast({
          message: '请输入关联单位',
          position: 'top'
        })
        return
      } else if (!this.addData.address || this.addData.address === '') {
        Toast({
          message: '请输入办公地址',
          position: 'top'
        })
        return
      }
      let contactsTurn = false
      this.addData.contacts.forEach(item => {
        if (!item.name) {
          contactsTurn = true
        }
      })
      if (contactsTurn) {
        Toast({
          message: '请完善联系人',
          position: 'top'
        })
        return
      }
      this.addData.projectId = this.$route.params.projectMmanagementId
      console.log(this.addData)
      context.http.post('cms/api/chargeDept', this.addData).then(res => {
        sessionStorage.removeItem('addData')
        Toast({
          message: '新增成功',
          position: 'top'
        })
        this.$router.replace({ name: roterFrom, query: { projectMmanagementId: this.$route.params.projectMmanagementId } })
      }).catch(error => {
        sessionStorage.removeItem('addData')
        console.info(error)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
.addCompetentDepartment {
  .content {
    color: #858c94;
    font-size: rem(15);
    margin-top: rem(40);
    overflow: hidden;
    .contractsPerson {
      background: #fff;
      margin-top: rem(10);
      padding-bottom: rem(20);
      .p_title {
        line-height: rem(40);
        padding-left: rem(10);
        color: #18191a;
        font-weight: 600;
        border-bottom: rem(1) solid #f0f0f0;
      }
      .panel {
        margin: rem(30) rem(8) 0;
        background: #f7f8fa;
        border-radius: rem(4);
        overflow: hidden;
        .dele_panel {
          height: rem(20);
          text-align: right;
          span {
            background: rgba(0, 0, 0, 0.3);
            width: rem(77);
            height: rem(20);
            font-size: rem(13);
            color: #fff;
            text-align: center;
            line-height: rem(20);
            display: inline-block;
          }
        }
      }
      .add_btn {
        width: rem(130);
        height: rem(37);
        background: #ffffff;
        border-radius: rem(4);
        border: rem(1) solid #0139a4;
        margin: rem(20) auto;
        text-align: center;
        line-height: rem(37);
        font-size: rem(16);
        color: #0139a4;
      }
    }
    .required {
      color: #fc5159;
      font-size: rem(15);
      margin-right: rem(4);
    }
    .ct-div {
      height: rem(58);
      display: flex;
      align-items: center;
      padding-left: rem(10);
      border-bottom: rem(1) solid #f0f0f0;
      input {
        background: none;
      }
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
