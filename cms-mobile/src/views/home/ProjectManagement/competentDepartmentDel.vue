<template>
  <div class="competentDepartmentDel">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="goBack"></i>
      <div class="headTab">关联单位</div>
      <div @click="submit"
           class="addBtn">{{readOnly ? '编辑' : '保存'}}</div>
    </div>
    <div class="content">
      <div class="basic-information">
        <div class="content-title">基本信息</div>
        <div class="ul-warp"
             :class="!readOnly ? 'border_bot' : ''">
          <div class="content-ul">
            <span>关联单位<span style="color:#FC5159">*</span></span>
            <span v-if="readOnly">{{tenantDetail.deptName}}</span>
            <input v-else
                   type="text"
                   placeholder="请输入"
                   maxlength="20"
                   v-model="tenantDetail.deptName" />
          </div>
          <div class="content-ul">
            <span>办公地址<span style="color:#FC5159">*</span></span>
            <span v-if="readOnly">{{tenantDetail.address}}</span>
            <input v-else
                   type="text"
                   placeholder="请输入"
                   maxlength="50"
                   v-model="tenantDetail.address" />
          </div>
          <div class="content-ul">
            <span>联系电话</span>
            <span v-if="readOnly">{{tenantDetail.deptTel}}</span>
            <input v-else
                   type="text"
                   onkeyup="value=value.replace(/[^0-9]/g,'')"
                   placeholder="请输入"
                   v-model="tenantDetail.deptTel" />
          </div>
          <div style="border:none"
               class="content-ul content-ul-wrap">
            <span>简介</span>
            <span v-if="readOnly"
                  v-html="formatreplace(tenantDetail.introduction)">{{tenantDetail.introduction}}</span>
            <textarea v-else
                      maxlength="500"
                      placeholder="请输入500字以内"
                      v-model="tenantDetail.introduction"></textarea>
          </div>
          <!-- <div style="border:none"
               class="content-ul content-ul-wrap">
            <span>备注</span>
            <span v-if="readOnly"
                  v-html="formatreplace(tenantDetail.remark)"></span>
            <textarea v-else
                      maxlength="200"
                      placeholder="请输入200字以内"
                      v-model="tenantDetail.remark"></textarea>
          </div> -->
          <div class="contractsPerson">
            <div class="p_title">联系人信息</div>
            <div v-for="(item,index) in tenantDetail.contacts"
                 :key="index"
                 class="person-list"
                 :class="index !== 0 && !readOnly ? 'panel' : ''">
              <div v-if="index !== 0 && !readOnly"
                   class="dele_panel"><span @click="subItem(item,index)"
                      class="iconfont iconcms_guanbi">删除该项</span></div>
              <div class="content-ul">
                <span>联系人<span style="color:#FC5159">*</span></span>
                <span v-if="readOnly">{{item.name}}</span>
                <input v-else
                       type="text"
                       placeholder="请输入"
                       maxlength="10"
                       v-model="item.name" />
              </div>
              <div class="content-ul">
                <span>职务</span>
                <span v-if="readOnly">{{item.post}}</span>
                <input v-else
                       type="text"
                       placeholder="请输入"
                       maxlength="10"
                       v-model="item.post" />
              </div>
              <div class="content-ul">
                <span>手机</span>
                <span v-if="readOnly">{{item.telephone}}</span>
                <input v-else
                       type="text"
                       placeholder="请输入"
                       maxlength="20"
                       onkeyup="value=value.replace(/[^0-9]/g,'')"
                       v-model="item.telephone" />
              </div>
            </div>
            <div v-if="!readOnly"
                 @click="addItem"
                 class="add_btn">继续添加</div>
          </div>
        </div>
      </div>
      <div class="basic-information">
        <div class="basic-information">
          <div class="content-title">历史资料档案
            <i class="iconfont iconcms_fujiantianjia">添加附件
              <aliUpload class="aliUpload"
                         @setAnnex="setAnnex" />
            </i>
          </div>
          <div v-if="tenantDetail.annexes && tenantDetail.annexes.length"
               class="an">
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
              <div class="operating">
                <ailPreview :ailObj="item"
                            :encrypt="true"
                            class="ailPreview" />
                <span style="line-height:22px"
                      @click="delEnclosure(index)"
                      class="delcl"><i class="iconfont iconcms_shanchu-233"></i></span>
              </div>
            </div>
          </div>
          <div v-else
               class="noData_text">暂无数据</div>
        </div>
      </div>
      <div style="margin-bottom:0;"
           class="basic-information">
        <div class="content-title">记录信息</div>
        <div>
          <competent-record v-if="tenantDetail.id"
                            :tenantDetail="tenantDetail"></competent-record>
        </div>
      </div>
      <div class="loadAll contractLoadAll">
        <span>-</span>
        <p>已经到底了</p>
        <span>-</span>
      </div>
    </div>
  </div>
</template>
<script>
import context from '@/service'
import ailPreview from '@/components/ailPreview.vue'
import aliUpload from '@/components/aliUpload.vue'
import common from '@/utils/common.js'
import competentRecord from './competentRecord'
import { MessageBox, Toast } from 'mint-ui'
export default {
  name: 'competentDepartmentDel',
  components: { ailPreview, competentRecord, aliUpload },
  data () {
    return {
      id: '',
      tenantDetail: {},
      readOnly: true
    }
  },
  created () {
    this.id = this.$route.query.id
    this.getDetails()
  },
  mounted () {
    this.$parent.$refs['content'].scrollTop = 0
  },
  methods: {
    submit () {
      if (this.readOnly) {
        this.readOnly = !this.readOnly
      } else {
        if (!this.tenantDetail.deptName || this.tenantDetail.title === '') {
          Toast({
            message: '请输入关联单位',
            position: 'top'
          })
          return
        } else if (!this.tenantDetail.address || this.tenantDetail.address === '') {
          Toast({
            message: '请输入办公地址',
            position: 'top'
          })
          return
        }
        let contactsTurn = false
        this.tenantDetail.contacts.forEach(item => {
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
        context.http.put('cms/api/chargeDept', this.tenantDetail).then(res => {
          Toast({
            message: '保存成功',
            position: 'top'
          })
          this.readOnly = !this.readOnly
        })
      }
    },
    addItem (item, index) { // 加减联系人
      this.tenantDetail.contacts.push(
        { name: '', post: '', telephone: '' }
      )
    },
    subItem (item, index) {
      this.tenantDetail.contacts.splice(index, 1)
    },
    setAnnex (annexURL, annexName) {
      this.tenantDetail.annexes.push({
        'annexName': annexName,
        'annexURL': annexURL
      })
      context.http.put('cms/api/chargeDept', this.tenantDetail)
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
          _this.tenantDetail.annexes.splice(index, 1)
          context.http.put('cms/api/chargeDept', this.tenantDetail)
        }
      })
    },
    setFile () { },
    getDetails () {
      context.http.get(`cms/api/chargeDept/${this.id}`).then(res => {
        this.tenantDetail = res.data
      })
    },
    goBack () {
      this.$router.replace({ name: 'competentDepartmentList', query: { projectMmanagementId: this.tenantDetail.projectId } })
    },
    getformat (annexName) {
      return common.getformat(annexName)
    },
    formatreplace (description) {
      if (!description) {
        return
      }
      let html = description.replace(/\n/g, '<br/>')
      return html
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
.competentDepartmentDel {
  .contractsPerson {
    border-top: rem(1) solid #f0f0f0;
    padding-top: rem(15);
    margin-top: rem(10);
    .p_title {
      line-height: rem(20);
      color: #18191a;
      font-size: rem(15);
      font-weight: 600;
    }
    .person-list {
      border-bottom: rem(1) solid #f0f0f0;
      padding-bottom: rem(15);
    }
    .person-list:last-child {
      border: 0;
    }
    .panel {
      margin: rem(10) rem(10) 0 0;
      background: #f7f8fa;
      border-radius: rem(4);
      overflow: hidden;
      border: 0;
      padding-left: rem(8);
      input {
        background: #f7f8fa;
      }
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
  .noData_text {
    height: rem(80);
    line-height: rem(80);
    text-align: center;
    color: #878a9a;
  }
  .head {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: rem(40);
    line-height: rem(40);
    overflow: hidden;
    text-align: center;
    font-size: rem(16);
    background: #fff;
    display: flex;
    justify-content: space-between;
    z-index: 9;
    box-shadow: 0px 1px 4px 0px rgba(230, 230, 230, 0.5);
    .headTab {
      text-align: center;
      margin: 0 auto;
      color: #444547;
      font-size: rem(16);
      width: rem(200);
    }
    .back {
      position: fixed;
      left: 0;
      top: 0;
      width: rem(40);
      height: rem(40);
      font-size: rem(18);
      color: #000000;
      &:first-child {
        float: left;
      }
    }
    .addBtn {
      width: rem(40);
      height: rem(40);
      position: absolute;
      font-size: rem(15);
      color: #0139a4;
      right: rem(10);
      top: 0;
    }
    .selected {
      color: #0139a4;
    }
  }
  .content {
    width: 100%;
    position: relative;
    top: rem(40);
  }
  .basic-information {
    margin-bottom: rem(10);
    background: #fff;
  }
  .content-title {
    color: #18191a;
    font-size: rem(17);
    height: rem(40);
    line-height: rem(40);
    font-weight: bold;
    padding-left: rem(14);
    border-bottom: rem(1) solid #f0f0f0;
    position: relative;
    > i {
      position: absolute;
      right: rem(10);
      top: 0;
      color: #023c8f;
      font-weight: 500;
      font-size: rem(13);
    }
    .iconcms_fujiantianjia:before {
      padding-right: rem(5);
    }
  }
  .information-new {
    margin: 0;
    margin-top: rem(10);
    padding-bottom: rem(10);
    .content-title {
      color: #858c94;
      font-size: rem(15);
      height: rem(20);
      line-height: rem(20);
      font-weight: 500;
      padding-left: rem(14);
      border-bottom: 0;
      > span {
        font-size: rem(13);
      }
    }
  }
  .content-remark {
    font-size: rem(15);
    line-height: rem(21);
    color: #18191a;
    padding: rem(15) rem(14) rem(40);
  }
  .ul-warp {
    margin: 0 0 0 rem(14);
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
    padding-right: rem(14);
    font-size: rem(15);
    line-height: rem(20);
    input {
      text-align: right;
    }
    textarea {
      width: 100%;
      display: block;
    }
    > span {
      color: #18191a;
      &:first-child {
        color: #858c94;
        min-width: rem(70);
        margin-right: rem(10);
      }
    }
  }
  .content-ul-wrap {
    display: block;
    > span {
      display: block;
      line-height: rem(20);
      &:first-child {
        margin-bottom: rem(8);
      }
    }
  }
  .list {
    padding-left: rem(14);
    li {
      padding: rem(16) rem(14) rem(16) 0;
      position: relative;
      background: #fff;
      border-bottom: rem(1) solid #f0f0f0;
      &:last-child {
        border: 0;
      }
      > p {
        display: flex;
        width: 100%;
        justify-content: space-between;
        margin-bottom: rem(6);
        > span {
          display: block;
          line-height: rem(20);
          color: #858c94;
          font-size: rem(15);
          width: rem(90);
          text-align: right;
        }
        > span:first-child {
          text-align: left;
          flex: 1;
          color: #18191a;
          font-weight: 600;
          font-size: rem(15);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: rem(5);
          > span {
            background: #eff6ff;
            height: rem(17);
            font-weight: 500;
            line-height: rem(17);
            font-size: rem(12);
            color: #0139a4;
            padding: 0 rem(3);
            vertical-align: center;
            margin-left: rem(12);
          }
        }
      }
      > div {
        > p {
          color: #444547;
          font-size: rem(14);
          margin-bottom: rem(8);
          &:last-child {
            margin-bottom: 0;
          }
          span {
            color: #858c94;
          }
        }
        > .momoInfo {
          font-size: rem(15);
          color: #18191a;
        }
        > .momoDate {
          font-size: rem(13);
          color: #858c94;
          text-align: right;
        }
      }
      > span {
        position: absolute;
        right: rem(10);
        top: rem(45);
        font-size: rem(17);
        color: #c6c6c6;
      }
    }
  }
  .an-item {
    display: flex;
    align-items: center;
    padding: rem(14) rem(14) 0;
    position: relative;
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
    .operating {
      flex: 1;
      display: flex;
      justify-content: flex-end;
    }
  }
  .contractLoadAll {
    background: #fff;
    padding-top: rem(20);
    > p {
      // width: rem(80);
    }
  }
  .border_bot {
    > .content-ul {
      border-bottom: rem(1) solid #f0f0f0;
      padding-bottom: rem(10);
    }
  }
}
</style>
