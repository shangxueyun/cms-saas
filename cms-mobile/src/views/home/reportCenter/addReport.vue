<template>
  <div id="add-notice">
    <app-header :title="title"
                :mode="false"
                :isconfirm="true"
                @confirmFn="confirmFn">
      <div slot="rightBtn">
        <div @click.stop="submit">提交</div>
      </div>
    </app-header>
    <div class="content">
      <!-- 选择日期 -->
      <div class="ct-div title"
           v-if="addType==='Day'">
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
                      @confirm="onConfirm" />
      </div>
      <!-- 选择周 -->
      <div class="ct-div title"
           v-if="addType==='Week'">
        <i style="font-style: normal;"><i class="required">*</i>日期</i>
        <van-cell is-link
                  :value="weekdate"
                  @click="weelyShow=true" />
      </div>
      <!-- 选择月 -->
      <div class="ct-div title"
           v-if="addType==='Month'">
        <i style="font-style: normal;"><i class="required">*</i>日期</i>
        <van-cell is-link
                  title=""
                  :value="monthdate"
                  @click="popupShow=true" />
      </div>
      <div class="ctent">
        <i class="required">*</i>内容
        <div>
          <textarea placeholder="请输入内容"
                    v-model="subParameData.reportContent"></textarea>
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
               v-for="(item,index) in subParameData.workReportAnnexs"
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
      <div class="ct-div type recipient">
        <i class="required">*</i>
        汇报对谁可见<span class="subtitle">(点击头像可删除)</span>
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
    <!-- 选择年月-------------------------------------- -->
    <van-popup v-model="popupShow"
               position="bottom">
      <van-datetime-picker v-model="currentDate"
                           type="year-month"
                           title="选择年月"
                           :min-date="minDate"
                           :max-date="maxDate"
                           :formatter="formatter"
                           @cancel="datetimeCancel"
                           @confirm="datetimeConfirm" />
    </van-popup>
    <!-- 选择周====================================== -->
    <van-popup v-model="weelyShow"
               position="bottom"
               @close="weelyClose"
               custom-style="height: 20%;">
      <changWeely :defaults="defaults"
                  @cancel="weekCancel"
                  @onConfirm="weekConfirm" />
    </van-popup>
  </div>
</template>
<script>
import AppHeader from '@/components/appHead'
import ailPreview from '@/components/ailPreview.vue'
import ActionSheet from '@/components/Actionsheet'
import aliUpload from '@/components/aliUpload.vue'
import changWeely from '@/components/changeWeely.vue'
import { MessageBox, Toast } from 'mint-ui'
import * as hub from '@/service/eventHub'
import context from '@/service'
import Vue from 'vue'
import moment from 'moment'
import { Calendar, Cell, DatetimePicker, Popup } from 'vant'
import common from '@/utils/common.js'
Vue.use(Calendar)
Vue.use(DatetimePicker)
Vue.use(Popup)
Vue.use(Cell)
export default {
  name: 'addReport',
  components: {
    AppHeader,
    changWeely,
    ailPreview,
    ActionSheet,
    aliUpload
  },
  data () {
    return {
      monthdate: '',
      defaults: new Date(),
      weelyShow: false,
      weekdate: '',
      minDate: new Date(new Date().getFullYear() - 10, 0, 1),
      maxDate: new Date(new Date().getFullYear() + 10, 11, 1),
      popupShow: false,
      currentDate: new Date(),
      addType: null,
      date: '',
      show: false,
      openActionsheet: false,
      tabIndex: '',
      more: false,
      subParameData: {
        workReportAnnexs: [],
        reportContent: '',
        startDate: '',
        reportType: '',
        visibleUsers: [],
        userName: '',
        userId: '',
        userOrganizeName: '',
        pageFrom: ''
      },
      selectPerson: []
    }
  },
  computed: {
    title () {
      if (this.addType === 'Day') {
        return '添加日报'
      } else if (this.addType === 'Week') {
        return '添加周报'
      } else if (this.addType === 'Month') {
        return '添加月报'
      }
    }
    // selectPerson: () => JSON.parse(sessionStorage.getItem('selectPerson'))
  },
  created () {
    this.addType = this.$route.params.addType // 新增类型 日报周报月报
    this.pageFrom = this.$route.params.pageFrom // 页面入口  如果等于'add'就是从新增首页进入
    this.subParameData.reportType = this.$route.params.addType// 赋值新增入参回报类型
    this.selectPerson = JSON.parse(sessionStorage.getItem('selectPerson'))
    let subParameData = sessionStorage.getItem('subParameData')// 新增入参
    if (subParameData) {
      this.subParameData = JSON.parse(subParameData)
      if (this.subParameData.startDate && this.subParameData.startDate !== '') {
        if (this.addType === 'Day') {
          this.date = moment(this.subParameData.startDate).format('YYYY年MM月DD日')
        } else if (this.addType === 'Month') {
          this.currentDate = new Date(this.subParameData.startDate) // currentDate用来年月组件默认选中
          this.monthdate = this.resWeekDate(this.currentDate) // monthdate  cell栏展示  2020年7月
        } else if (this.addType === 'Week') {
          this.weekFormat(this.subParameData.startDate) // monthdate  cell栏展示  2020年7月
        }
      }
    }
    // else {
    //   if (this.addType === 'Month') {
    //     this.monthdate = this.resWeekDate(null)
    //   }
    // }
    if (this.pageFrom === 'add') this.getPrevContacts()
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
    resWeekDate (date) {
      let d = date || new Date()
      return `${d.getFullYear()}年${d.getMonth() + 1}月`
    },
    setAnnex (annexURL, annexName) {
      this.subParameData.workReportAnnexs.push({
        'annexName': annexName,
        'annexURL': annexURL
      })
      sessionStorage.setItem('subParameData', JSON.stringify(this.subParameData))
    },
    weelyClose () {

    },
    weekCancel () {
      this.weelyShow = false
    },
    weekFormat (a) { // a为任意时间格式 2020-10-21 2020/12/05 "2014-09-08T08:02:17-05:00"
      let b = moment(a).format('w') // 获取当前起始日期是当年的第几周
      let c = moment(a).format('YYYY')
      let d = moment(a).format('M')
      let e = moment(a).format('D')
      let f = moment(a).day(7).format('M')
      let g = moment(a).day(7).format('D')
      this.weekdate = `${b}周（${d}月${e}日-${f}月${g}日）`
      console.log(this.weekdate)
    },
    weekConfirm (arr) { // 周报时间选择器
      let a = arr[1].value
      this.subParameData.startDate = a
      this.weekFormat(a)
      this.weelyShow = false
      sessionStorage.setItem('subParameData', JSON.stringify(this.subParameData))
    },
    datetimeCancel () {
      this.popupShow = false
    },
    datetimeConfirm (i) { // 月报选中时间回调
      this.popupShow = false
      this.subParameData.startDate = moment(i).format('YYYY-MM-DD')
      this.monthdate = this.resWeekDate(i)
      sessionStorage.setItem('subParameData', JSON.stringify(this.subParameData))
    },
    formatter (type, val) {
      if (type === 'year') {
        return `${val}年`
      } else if (type === 'month') {
        return `${val}月`
      }
      return val
    },
    formatDate (date) {
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    },
    onConfirm (date) {
      this.show = false
      this.subParameData.startDate = moment(date).format('YYYY-MM-DD')
      this.date = this.formatDate(date)
      sessionStorage.setItem('subParameData', JSON.stringify(this.subParameData))
    },
    confirmFn () {
      let _this = this
      if ((!this.subParameData.startDate || this.subParameData.startDate === '') &&
        (!this.subParameData.reportContent || this.subParameData.reportContent === '') &&
        (!this.selectPerson || this.selectPerson.length === 0 || this.selectPerson.every((item, index, arr) => { return !item.userName })) &&
        (!this.subParameData.workReportAnnexs || this.subParameData.workReportAnnexs.length === 0)) {
        this.$router.replace({ name: 'reportCenter' })
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
          sessionStorage.removeItem('subParameData')
          _this.$router.replace({ name: 'reportCenter' })
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
          _this.subParameData.workReportAnnexs.splice(index, 1)
          sessionStorage.setItem('subParameData', JSON.stringify(_this.subParameData))
        }
      })
    },
    delPerson (item, index) {
      // item.checked = false
      // hub.eventHub.$emit('handleCheck', item)
      this.selectPerson.splice(index, 1)
      sessionStorage.setItem('selectPerson', JSON.stringify(this.selectPerson))
      // this.selectPerson = JSON.parse(sessionStorage.getItem('selectPerson'))
    },
    addRecipient () { // 新增汇报人
      if (this.subParameData.startDate !== '' || this.subParameData.reportContent !== '' || this.subParameData.workReportAnnexs.length) {
        sessionStorage.setItem('subParameData', JSON.stringify(this.subParameData))
      }
      this.$router.push({ name: 'selectRecipients', params: { addType: this.addType, titleText: '汇报对谁可见' } })
    },
    setFile () { },
    submit () {
      let user = JSON.parse(localStorage.getItem('user'))
      let userObj = JSON.parse(user.value)
      this.subParameData.userId = userObj.id
      this.subParameData.userName = userObj.name
      if (userObj.userPostManagements.length === 0) {
        alert('所属组织为空！')
        return
      } else {
        this.subParameData.userOrganizeName = userObj.userPostManagements[0].organize.name
      }
      // (!this.subParameData.startDate || this.subParameData.startDate === '') && (!this.subParameData.reportContent || this.subParameData.reportContent === '') && (!this.selectPerson || this.selectPerson.length === 0)
      if (!this.subParameData.startDate || this.subParameData.startDate === '') {
        Toast({
          message: '请选择日期',
          position: 'top'
        })
        return
      } else if (!this.subParameData.reportContent || this.subParameData.reportContent === '') {
        Toast({
          message: '请输入内容',
          position: 'top'
        })
        return
      } else if (!this.selectPerson || this.selectPerson.length === 0) {
        Toast({
          message: '请选择汇报对谁可见',
          position: 'top'
        })
        return
      }
      // this.subParameData.messageCenterType = 'MESSAGE'
      // this.subParameData.onSendAll = false
      let arr = []
      this.selectPerson.forEach(ele => {
        arr.push({ userId: ele.userId, userName: ele.userName })
      })
      this.subParameData.visibleUsers = arr

      console.log('subParameData', this.subParameData)
      context.http.post('cms/api/workReports', this.subParameData).then(res => {
        if (res.status === 201) {
          Toast({
            message: '添加成功',
            position: 'top'
          })
          this.subParameData = {
            workReportAnnexs: [],
            reportContent: '',
            startDate: '',
            reportType: '',
            visibleUsers: [],
            userName: '',
            userId: '',
            userOrganizeName: ''
          }
          sessionStorage.removeItem('subParameData')
          this.$router.replace({ name: 'reportCenter' })
        }
      }).catch(error => {
        console.info(error)
      })
    },
    async getPrevContacts () {
      let treeData = await context.http.get('uaa/api/organizes/report')
      let flatTree = this.compileFlatTree(treeData.data)
      let result = await context.http.get('cms/api/workReports/prevContacts')
      let arr = flatTree.filter(item => {
        return item.node.userId
      }).map(item => {
        return item.node
      })
      let prevContacts = []
      result.data.forEach(item => {
        arr.forEach(items => {
          if (item.nodeId === items.nodeId) {
            items.checked = true
            prevContacts.push(items)
          }
        })
      })
      this.selectPerson = prevContacts
      sessionStorage.setItem('selectPerson', JSON.stringify(prevContacts))
      console.log(prevContacts)
    },
    // 编制各节点对应关系
    compileFlatTree (arr) {
      var keyCounter = 0
      var childrenKey = 'reporterDTOList'
      var flatTree = []
      function flattenChildren (node, parent) {
        node.nodeKey = keyCounter++
        flatTree[node.nodeKey] = {
          node: node,
          nodeKey: node.nodeKey
        }
        if (typeof parent !== 'undefined') {
          flatTree[node.nodeKey].parent = parent.nodeKey
          flatTree[parent.nodeKey][childrenKey].push(node.nodeKey)
        }
        if (node[childrenKey]) {
          flatTree[node.nodeKey][childrenKey] = []
          node[childrenKey].forEach(function (child) {
            return flattenChildren(child, node)
          })
        }
      }
      arr.forEach(function (rootNode) {
        flattenChildren(rootNode)
      })
      return flatTree
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
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
