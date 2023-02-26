<template>
  <div id="emergencyAdd">
    <app-header :title="type==='add'?'新增应急事项':'编辑应急事项'"
                :mode="false"
                @confirmFn="confirmFn">
      <div slot="rightBtn">
        <div @click="submit">提交</div>
      </div>
    </app-header>
    <div class="content">
      <div class="ctdiv-warp">
        <div class="ct-div type"
             @click="openProjectActionsheet = !openProjectActionsheet">
          项目简称
          <i class="required">*</i>
          <span :class="{'gray' : projectName === '请选择'}">
            {{ projectName }}
            <i class="iconfont iconright"></i>
          </span>
        </div>
        <div class="ct-div title">
          事项简述
          <i class="required">*</i>
          <input type="text"
                 placeholder="请输入内容"
                 v-model="addData.eventRefferd"
                 maxlength="30" />
        </div>
        <div class="ct-div title"
             @click="showDatetime = true">
          发生时间<i class="required">*</i>
          <span :class="{'gray': !addData.happenDate}">
            {{addData.happenDate ? addData.happenDate: '请选择'}}
            <i class="iconfont iconright"></i>
          </span>
        </div>
        <div class="ct-div title">
          发生地点
          <i class="required">*</i>
          <input type="text"
                 placeholder="请填写"
                 v-model="addData.happenPlace"
                 maxlength="20" />
        </div>
        <div class="ct-div title">
          跟进人
          <i class="required">*</i>
          <input type="text"
                 placeholder="请填写"
                 v-model="addData.followUser"
                 maxlength="10" />
        </div>
        <div class="ct-div title"
             @click="openActionsheet2 = !openActionsheet2">
          事项状态
          <i class="required">*</i>
          <span>
            {{formatEventStatus(addData.eventStatus)}}
            <i class="iconfont iconright"></i>
          </span>
        </div>
        <div class="ctent">
          事项详情
          <div>
            <textarea placeholder="请输入内容"
                      maxlength="80"
                      v-model="addData.eventContent"></textarea>
          </div>
        </div>
        <div class="ctent">
          处理结果
          <div>
            <textarea placeholder="请输入内容"
                      style="border:none"
                      maxlength="80"
                      v-model="addData.result"></textarea>
          </div>
        </div>
        <!-- ------------------------------------------------------------- -->
      </div>
      <div class="ctdiv-warp">
        <div class="attachment">
          附件
          <i class="iconfont iconcms_fujiantianjia">添加附件
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
    <!-- 事项状态 -->
    <action-sheet :open="openActionsheet2"
                  tsType="slideOutUp">
      <div slot="content">
        <div class="as-title">
          事项状态
          <i class="iconfont iconcms_guanbi"
             @click="openActionsheet2 = false"></i>
        </div>
        <ul class="">
          <li v-for="(item, index) in eventStatusList"
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
import { Toast } from 'vant'
import common from '@/utils/common.js'
import moment from 'moment-timezone'
let roterFrom = null
export default {
  name: 'emergencyAdd',
  components: {
    AppHeader,
    ActionSheet,
    aliUpload,
    ailPreview
  },
  data () {
    return {
      type: 'add',
      addData: {
        projectManagementId: null,
        eventRefferd: null,
        happenDate: null,
        happenPlace: null,
        followUser: null,
        eventStatus: 'WAIT',
        eventContent: null,
        result: null,
        annexes: []
      },
      title: '新增应急事项',
      projectName: '请选择',
      openProjectActionsheet: false,
      openActionsheet2: false,
      PJtabIndex: '',
      tabIndex: '',
      tabIndex2: 0,
      projectManagementList: [],
      showDatetime: false,
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(2030, 11, 31),
      currentDate: new Date(),
      eventStatusList: [
        {
          label: '待处理',
          value: 'WAIT'
        },
        {
          label: '处理中',
          value: 'ONDEAL'
        },
        {
          label: '已处理',
          value: 'DEALED'
        }
      ]
    }
  },
  created () {
    this.queryProjectManagement()
    let addData = sessionStorage.getItem('addData')
    if (addData) {
      this.addData = JSON.parse(addData)
      this.projectName = this.addData.projectName
      this.type = this.addData.type
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
    if (from.name === 'emergencyList') {
      roterFrom = from.name
    }
    next()
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  methods: {
    initFn () {
      let Data = this.$route.params.detailsData || JSON.parse(sessionStorage.getItem('addData'))
      this.type = this.$route.params.type || this.addData.type
      if (this.type === 'edit') {
        this.addData = Data
        this.projectName = this.addData.projectManagementRefferd
        this.PJtabIndex = this.getSelectIndex(this.addData.projectManagementId, this.projectManagementList, 'id') // 默认选中项目
        this.currentDate = new Date(this.addData.happenDate) // 发生时间默认选中
        this.tabIndex2 = this.getSelectIndex(this.addData.eventStatus, this.eventStatusList, 'value') // 事项状态默认选中
        this.addData.type = this.type
        sessionStorage.setItem('addData', JSON.stringify(this.addData))
      }
    },
    getSelectIndex (id, arr, name) {
      let index = arr.findIndex((item) => item[name] === id)
      return index
    },
    formatEventStatus (eventStatus) {
      switch (eventStatus) {
        case 'WAIT':
          return '待处理'
        case 'ONDEAL':
          return '处理中'
        case 'DEALED':
          return '已处理'
      }
    },
    selectPJLi (item, index) { // 选择项目
      this.PJtabIndex = index
      this.openProjectActionsheet = false
      this.projectName = item.referred
      this.addData.projectManagementId = item.id
    },
    async queryProjectManagement () {
      const res = await context.http.get('cms/api/project-managements', {
        useStatus: 'USING'
      })
      if (res.status === 200) {
        this.projectManagementList = res.data
        this.initFn()
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
      this.addData.annexes.push({
        'annexName': annexName,
        'annexURL': annexURL
      })
      this.addData.projectName = this.projectName
      this.addData.type = this.type
      sessionStorage.setItem('addData', JSON.stringify(this.addData))
    },
    confirmFn () {
      let _this = this
      if (
        (!this.addData.projectManagementId || this.addData.projectManagementId === '') &&
        (!this.addData.eventRefferd || this.addData.eventRefferd === '') &&
        (!this.addData.happenDate || this.addData.happenDate === '') &&
        (!this.addData.happenPlace || this.addData.happenPlace === '') &&
        (!this.addData.followUser || this.addData.followUser === '') &&
        // (!this.addData.eventStatus || this.addData.eventStatus === '') &&
        (!this.addData.eventContent || this.addData.eventContent === '') &&
        (!this.addData.result || this.addData.result === '') &&
        (!this.addData.annexes.length)
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
          sessionStorage.removeItem('addData')
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
      this.$router.replace({ name: 'emergencyList' })
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
          this.addData.annexes.splice(index, 1)
          this.addData.projectName = this.projectName
          this.addData.type = this.type
          sessionStorage.setItem('addData', JSON.stringify(this.addData))
        }
      })
    },
    confirmSelect (val) {
      this.showDatetime = false
      this.addData.happenDate = moment(val).format('YYYY-MM-DD')
    },
    selectLi2 (item, index) { // 事项状态
      this.tabIndex2 = index
      this.openActionsheet2 = false
      this.addData.eventStatus = item.value
    },
    submit () {
      console.log(this.addData)
      if (!this.addData.projectManagementId) {
        Toast('请选择项目')
        return
      }
      if (!this.addData.eventRefferd) {
        Toast('请输入事项简述')
        return
      }
      if (!this.addData.happenDate) {
        Toast('请选择发生时间')
        return
      }
      if (!this.addData.happenPlace) {
        Toast('请输入发生地点')
        return
      }
      if (!this.addData.followUser) {
        Toast('请输入跟进人')
        return
      }
      if (!this.addData.eventStatus) {
        Toast('请选择事项状态')
        return
      }
      if (this.addData.projectName) {
        delete this.addData.projectName
      }
      if (this.type === 'add') {
        context.http.post('cms/api/emergency', this.addData).then(res => {
          if (res) {
            Toast('新增成功')
            sessionStorage.removeItem('addData')
            this.$router.replace({ name: 'emergencyList' })
          }
        }).catch(error => {
          sessionStorage.removeItem('addData')
          console.info(error)
        })
      } else {
        context.http.put('cms/api/emergency', this.addData).then(res => {
          if (res) {
            Toast('修改成功')
            sessionStorage.removeItem('addData')
            this.$router.replace({ name: 'emergencyDetails', params: { 'id': this.addData.id } })
          }
        }).catch(error => {
          sessionStorage.removeItem('addData')
          console.info(error)
        })
      }
    }
  }
}
</script>
<style lang="scss">
@import "../../../../style/config";
#emergencyAdd {
  .right_btn {
    width: rem(60) !important;
    text-align: right !important;
    padding-right: rem(12);
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
  .area_input_warp,
  .price_input_warp {
    display: flex;
    justify-content: space-between;
  }
  .inputSelected {
    border-bottom: rem(1) solid #0139a4 !important;
  }
  .area_input,
  .price_input {
    width: 50%;
    height: rem(30);
    line-height: rem(30);
    padding-left: rem(10);
    border-bottom: rem(1) solid #f0f0f0;
    span {
      display: inline-block;
      width: 86%;
    }
  }
  .underline {
    margin: 0 rem(10);
  }
  .price_unit {
    display: flex;
    padding: rem(8) rem(20);
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
  .ct-div {
    input {
      color: #18191a;
    }
  }
}
</style>
<style lang="scss" scoped>
@import "../../../../style/config";
#emergencyAdd {
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
    padding-bottom: rem(100);
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
      margin-top: rem(5) !important;
      .iconfont {
        text-align: right;
        padding-right: rem(12);
        color: #858c94;
      }
    }
    .gray {
      color: #d9d9d9 !important;
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
        color: #18191a;
      }
    }
    .ctdiv-warp {
      background-color: #fff;
      margin-top: rem(10);
      .title {
        margin-top: 0;
      }
      .ct-div {
        padding-left: 0;
        margin-left: rem(15);
        border-bottom: rem(1) solid #f0f0f0;
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
