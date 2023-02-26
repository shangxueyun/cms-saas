<template>
  <div class="reportList"
       :class="{'focus':focus}">
    <app-header :title="title"
                v-if="!focus"
                :mode="false">
      <div slot="rightBtn"
           @click="readAll"
           v-if="title !=='我的汇报'"
           class="iconfont iconqingchu"></div>
    </app-header>
    <div class="seachInput"
         v-if="!this.onMy">
      <form @submit.prevent
            action="#">
        <input class="input"
               id="seachInput"
               results="5"
               focus
               placeholder="请输入组织名称"
               type="search"
               v-model="inputValue"
               @input="onKeyInput"
               @focus="inputFocus"
               @blur="inputBlur"
               @keyup.13="onKeyInput"
               @keypress="search" />
      </form>
      <i class="mintui mintui-search"></i>
      <span class="cannelBtn"
            v-if="focus"
            @click="toContacts">取消</span>
    </div>
    <div v-if="dataLsit.length"
         class="list"
         :class="{'isMy':this.onMy}">
      <mt-loadmore ref="loadmore"
                   :bottom-method="loadBottom"
                   :autoFill="false"
                   :bottom-all-loaded="allLoaded">
        <ul>
          <li class="item"
              v-for="(item,index) in dataLsit"
              :key="index">
            <div class="details">
              <div>
                <div class="userName">{{nameFormat(item.userName)}}</div>
                <!-- <div class="userName"
                     v-if="!item.facialPhoto||item.facialPhoto===''">{{nameFormat(item.userName)}}</div>
                <img :src="item.facialPhoto"
                     class="userImg"
                     v-else> -->
              </div>
              <div>
                <div>
                  <!-- <span>{{nameFormat(item.userName)}}</span> -->
                  <span>{{item.userName}}
                    <span class="not-sent" v-if="compareDate(item.visualTime)">未发送</span>
                  </span>
                  <span>{{weekFormat(item.startDate,item.reportType)}}{{transReportType(item.reportType)}}报</span>
                </div>
                <span class="withdrawwarp">{{item.userOrganizeName}} {{item.userPostManagement}}
                  <span @click="reCallWorkReports(item.id)" v-if="compareDate(item.visualTime)">撤回</span>
                </span>
              </div>
            </div>
            <div class="contentTitle">
              <span class="required"
                    style="margin-right:-3px">*</span>
              <span>内容</span>

            </div>
            <div class="content"
                 style="width:100%;word-wrap: break-word;word-break: normal;"
                 v-html="formatreplace(item.reportContent)">
            </div>
            <div class="annexes"
                 v-if="item.workReportAnnexs.length>0 && item.workReportAnnexs[0].annexURL">
              <div class="title">附件</div>
              <div class="item"
                   v-for="(item1,index) in item.workReportAnnexs"
                   v-if="item1.annexURL"
                   :key="index">
                <div>
                  <svg class="icon"
                       aria-hidden="true">
                    <use :xlink:href="pageGetformat(item1.annexName)"></use>
                  </svg>
                </div>
                <div class="annex-name">{{item1.annexName}}</div>
                <ailPreview :ailObj="item1"
                            :encrypt="true"
                            @setFile="setFile"
                            class="ailPreview" />
              </div>
            </div>
            <div class="reportTime font2">汇报时间：{{item.reportingTime.replace('T',' ')}}</div>
            <div class="review">
              <label for="reviewInput">
                <span @click="addReview(item)">
                  <i class="iconfont iconpinglun"></i>评论
                </span>
              </label>
            </div>
            <div class="reviewContent"
                 v-if="item.comments.length">
              <div class="item"
                   v-for="(itm,i) in item.comments"
                   :key="i">
                <div>
                  <div class="userName">{{nameFormat(itm.userName)}}</div>
                  <div>
                    <span>{{itm.userName}}</span>
                    <span>{{itm.commentTime.replace('T',' ')}}</span>
                  </div>
                </div>
                <div class="font1">{{itm.content}}</div>
              </div>
            </div>
          </li>
        </ul>
        <div class="loadAll"
             v-if="allLoaded">
          <span>-</span>
          <p>你碰到我的底线了</p>
          <span>-</span>
        </div>
      </mt-loadmore>
    </div>
    <div class="noData"
         v-if="dataLsit.length===0 && dataReady">
      <img src="../../../assets/nores.png">
      <p>暂无数据</p>
    </div>
    <div v-show="shadeBox"
         @touchmove.prevent
         class="shadeBox"></div>
    <div class="reviewInput"
         :class="{'Ani':reviewInputShow}">
      <form @submit.prevent
            action="#">
        <input type="text"
               id="reviewInput"
               ref="reviewInput"
               maxlength="100"
               focus
               @blur="reviewInputBlur"
               @keyup.enter="submitFn"
               placeholder="添加评论"
               v-model="commentData.content">
      </form>
      <span class="submitBtn"
            @click="submitFn">发送</span>
    </div>
  </div>
</template>
<script>
import AppHeader from '@/components/appHead'
import { Loadmore, Toast } from 'mint-ui'
import ailPreview from '@/components/ailPreview.vue'
import context from '@/service'
import moment from 'moment'
import common from '@/utils/common.js'
export default {
  name: 'reportList',
  footVisible: true,
  components: {
    AppHeader,
    ailPreview,
    Loadmore
  },
  watch: {
  },
  data () {
    return {
      allLoaded: false,
      title: '所有日报',
      isDebug: false,
      debugTxt: [],
      shadeBox: false,
      focus: false,
      inputValue: '',
      value: '',
      onMy: '',
      reportType: '',
      dataLsit: [],
      currentPage: 1,
      pgNum: 1,
      total: 0,
      pgSize: 15,
      dataReady: false,
      reviewInputShow: false,
      commentData: { workReportId: '', userId: '', userName: '', content: '' }
    }
  },
  created () {
    this.onMy = this.$route.params.onMy
    this.reportType = this.$route.params.reportType === 'all' ? '' : this.$route.params.reportType
    if (this.onMy === 'true' || this.onMy) {
      this.title = '我的汇报'
    } else {
      if (this.reportType === 'Day') {
        this.title = '所有日报'
      } else if (this.reportType === 'Week') {
        this.title = '所有周报'
      } else if (this.reportType === 'Month') {
        this.title = '所有月报'
      }
    }
    // console.log(this.onMy, this.reportType)
    this.query()
  },
  beforeDestroy () {
  },
  mounted () {

  },
  methods: {
    transReportType (val) {
      let str = ''
      if (val === 'Day') {
        str = '日'
      } else if (val === 'Week') {
        str = '周'
      } else {
        str = '月'
      }
      return str
    },
    weekFormat (a, reportType) { // a为任意时间格式 2020-10-21 2020/12/05 "2014-09-08T08:02:17-05:00"
      if (reportType === 'Day') {
        return a
      } else if (reportType === 'Week') {
        let b = moment(a).format('w') // 获取当前起始日期是当年的第几周
        let c = moment(a).format('YYYY')
        let d = moment(a).format('M')
        let e = moment(a).format('D')
        let f = moment(a).day(7).format('M')
        let g = moment(a).day(7).format('D')
        let weekText = `${b}周（${d}月${e}日-${f}月${g}日）`
        // console.log(weekText)
        return weekText
      } else if (reportType === 'Month') {
        return moment(a).format('YYYY-MM')
      }
    },
    submitFn () { // 提交评论
      if (this.commentData.content === '' || !this.commentData.content) {
        Toast({
          message: '请输入评论内容',
          position: 'top'
        })
        return
      }
      // // eslint-disable-next-line no-useless-escape
      // let iconRule1 = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im
      // // 判断是否含有emoji表情
      // // eslint-disable-next-line no-useless-escape
      // let iconRule2 = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig
      // if (iconRule2.test(this.commentData.content) || iconRule1.test(this.commentData.content)) {
      //   Toast({
      //     message: '评论内容不可包含特殊字符、表情符号',
      //     position: 'top'
      //   })
      //   return
      // }
      context.http.post('cms/api/comments', this.commentData).then(res => {
        if (res.status === 201) {
          this.query(true)
          this.reviewInputShow = false
          this.reviewInputBlur()
          this.$nextTick(() => {
            this.$refs.reviewInput.blur()
            this.commentDialog = false
            this.commentData.content = ''
          })
        }
      }).catch(error => {
        this.commentData.content = ''
        console.info(error)
      })
    },
    reviewInputBlur () {
      this.inputBlurOut()
      // this.reviewInputShow = false
    },
    addReview (item) { // 点击评论
      this.commentData.workReportId = item.id
      let user = JSON.parse(localStorage.getItem('user'))
      let userObj = JSON.parse(user.value)
      this.commentData.userId = userObj.id
      this.commentData.userName = userObj.name
      this.$refs.reviewInput.focus()
      this.$nextTick(() => {
        this.reviewInputShow = true
        // document.getElementById('reviewInput').focus()
      })
    },
    query (flag) {
      this.dataReady = false
      if (flag) {
        this.currentPage = 1
      }
      context.http.get('cms/api/workReports', {
        onMy: this.onMy,
        reportType: this.reportType,
        organizeName: this.inputValue,
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'reportingTime,desc'
      }).then(res => {
        this.dataReady = true
        if (res.status === 200) {
          if (flag) {
            this.dataLsit = res.data
          } else {
            this.dataLsit = this.dataLsit.concat(res.data)
          }
          this.total = Number(res.headers['x-total-count'])
          if (this.currentPage === Math.ceil(this.total / this.pgSize) || this.currentPage > Math.ceil(this.total / this.pgSize)) {
            this.allLoaded = true// 若数据已全部获取完毕
            console.log('全部获取完毕')
          }
        }
      })
    },
    setFile (url) {

    },
    reCallWorkReports (id) {
      context.http.get(`cms/api/reCallWorkReports/${id}`).then(res => {
        if (res.status === 200) {
          Toast({
            message: '汇报已撤回',
            position: 'top'
          })
          this.query(true)
        }
      }).catch(error => {
        console.info(error)
        this.query(true)
      })
    },
    readAll () {
      context.http.get('cms/api/readAllWorkReports', {
        onMy: this.onMy,
        reportType: this.reportType,
        organizeName: this.inputValue
      }).then(res => {
        Toast({
          message: '操作成功',
          position: 'top'
        })
        this.query()
      }).catch(error => {
        console.info(error)
      })
    },
    inputBlur () { // 失去焦点
      // this.focus = false
      // this.shadeBox = false
      // context.system.store.footVisible = true
      // this.inputValue = ''
      // this.query()
      // console.log('失去焦点')
    },
    inputFocus () { // 获取焦点
      this.focus = true
      this.shadeBox = true
      // console.log('获取焦点')
    },
    onKeyInput (event) { // 输入
      this.shadeBox = false
      this.inputValue = event.target.value
      this.$nextTick(() => {
        this.query(true)
      })
    },
    loadBottom (id) {
      this.currentPage++
      this.query()
      this.$refs.loadmore.onBottomLoaded()
    },
    toContacts () { // 取消
      this.focus = false
      this.shadeBox = false
      this.inputValue = ''
      this.query(true)
      // this.$router.push({ name: 'contact' })
    },
    search (event) { // 键盘完成事件
      if (event.keyCode === 13) {
        event.preventDefault() // 禁止默认事件（默认是换行）
        this.inputValue = event.target.value
        this.query(true)
      }
    },
    formatreplace (description) {
      if (!description) {
        return
      }
      let html = description.replace(/\n/g, '<br/>')
      return html
    },
    pageGetformat (str) {
      return common.getformat(str)
    },
    compareDate (date) {
      let nowdate = new Date()
      let date1 = new Date(date)
      let showRturnBtn = false
      if (nowdate.getTime() - date1.getTime() > 0) {
        showRturnBtn = false
      } else {
        showRturnBtn = true
      }
      return showRturnBtn
    },
    nameFormat (str) {
      if (/^[a-zA-Z]*$/.test(str)) { // 英文
        return str.substring(0, 3)
      } else if (/^[\u4e00-\u9fa5]*$/.test(str)) { // 中文
        return str.substring(str.length - 2)
      } else {
        return str.substring(0, 3)
      }
    },
    // util.js
    inputBlurOut () { // ios软键盘收起页面无法复原问题
      let u = navigator.userAgent
      let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      if (isIOS) {
        setTimeout(() => {
          const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0
          let app = document.getElementById('app')
          app.scrollTo(0, Math.max(scrollHeight - 1, 0))
        }, 150)
      }
    }
  }
}
</script>
<style scoped lang="scss" >
@import "../../../style/config";
.reportList {
  height: 100%;
  color: #18191a;
  // position: relative;
  &.focus {
    .input {
      width: rem(300) !important;
    }
    .seachInput {
      top: 0 !important;
      border-top: 0;
    }
    .list {
      margin-top: $foot-height;
    }
    .shadeBox {
      // height: calc(100% - rem(46));
      height: calc(100% - #{$foot-height});
      position: fixed;
      left: 0;
      top: $foot-height;
      width: 100%;
      background: rgba(0, 0, 0, 0.2);
      z-index: 2;
    }
  }
  #app-head {
    // &.isMy {
    //   border-bottom: rem(3) solid #f0f1f2;
    // }
    .iconqingchu{
      font-size: rem(20);
      text-align: center;
    }
  }
  .noData {
    > img {
      display: block;
      margin: 0 auto;
      width: rem(140);
      height: rem(140);
    }
    > p {
      color: #444547;
      text-align: center;
      font-weight: bold;
    }
  }
  .list {
    margin-top: rem(90);
    // height: calc(100% - #{$foot-height});
    // padding-bottom: $foot-height;
    // overflow-y: auto;
    position: relative;
    // z-index: 2;
    &.isMy {
      margin-top: rem(40);
    }
    &.list_IOS {
      padding-top: rem(90);
    }
    ul {
      > .item {
        padding: rem(15) 0 rem(15) rem(15);
        margin-bottom: rem(10);
        background-color: #ffffff;
        &:last-child {
          padding-bottom: $foot-height;
        }
        .details {
          display: flex;
          padding-right: rem(15);
          > div {
            &:first-child {
              margin-right: rem(10);
            }
            &:last-child {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              > div {
                display: flex;
                justify-content: space-between;
                > span {
                  &:first-child {
                    font-size: rem(15);
                    color: rgba(24, 25, 26, 1);
                  }
                  &:last-child {
                    font-size: rem(13);
                    color: #858c94;
                  }
                }
              }
              > span {
                font-size: rem(13);
                color: #858c94;
              }
            }
          }
          .userImg {
            width: rem(40);
            height: rem(40);
            border-radius: 50%;
          }
          .userName {
            width: rem(40);
            height: rem(40);
            line-height: rem(40);
            text-align: center;
            border-radius: 50%;
            background: rgba(53, 117, 246, 1);
            color: #ffffff;
            font-size: rem(12);
          }
        }
        .contentTitle {
          font-size: rem(15);
          color: #858c94;
          margin: rem(10) 0;
        }
        .content {
          font-size: rem(15);
          color: #18191a;
          padding-bottom: rem(10);
          padding-right: rem(15);
          border-bottom: rem(1) solid #f0f0f0;
        }
        .annexes {
          padding-right: rem(15);
          .title {
            padding: rem(14) 0 rem(14) rem(0);
            font-size: 15px;
            color: rgba(133, 140, 148, 1);
          }
          .item {
            display: flex;
            align-items: center;
            // padding: rem(5) 0 rem(5) rem(17);
            padding: 0;
            > div {
              &:first-child {
                margin-right: rem(15);
              }
              &:last-child {
                font-size: rem(15);
                color: rgba(24, 25, 26, 1);
              }
            }
            .annex-name {
              width: 80%;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
          .ailPreview {
            flex: 1;
            text-align: right;
          }
        }
        .reportTime {
          margin-top: rem(15);
          padding-left: rem(2);
        }
        .review {
          text-align: right;
          margin-top: rem(10);
          padding-right: rem(15);
          span {
            color: #023c8f;
            > i {
              margin-right: rem(3);
            }
          }
        }
        .reviewContent {
          border-top: rem(1) solid #f0f0f0;
          padding-top: rem(10);
          margin-top: rem(10);
          padding-right: rem(15);
          .item {
            margin-bottom: rem(15);
            > div {
              &:first-child {
                display: flex;
                > div {
                  &.userName {
                    width: rem(34);
                    height: rem(34);
                    line-height: rem(34);
                    text-align: center;
                    border-radius: 50%;
                    background: rgba(53, 117, 246, 1);
                    color: #ffffff;
                    font-size: rem(12);
                    margin-right: rem(5);
                  }
                  &:last-child {
                    display: flex;
                    flex-direction: column;
                    > span {
                      &:first-child {
                        font-size: rem(15);
                        color: rgba(24, 25, 26, 1);
                      }
                      &:last-child {
                        font-size: rem(12);
                        color: rgba(133, 140, 148, 1);
                      }
                    }
                  }
                }
              }
              &:last-child {
                padding-left: rem(39);
                margin-top: rem(5);
                word-break: break-all;
              }
            }
          }
        }
      }
    }
  }
  .seachInput {
    height: $foot-height;
    width: 100%;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    padding: 0 rem(15);
    position: fixed;
    top: rem(40);
    z-index: 2;
    #seachInput::-webkit-search-cancel-button {
      display: none;
    }
    .mintui-search {
      position: absolute;
      left: rem(20);
      top: rem(18);
      color: #666666;
    }
    .input {
      // width: rem(300);
      width: rem(345);
      height: rem(30);
      background: rgba(244, 244, 244, 1);
      border-radius: rem(2);
      padding-left: rem(25);
      font-size: rem(13);
    }
    .cannelBtn {
      color: #0139a4;
      font-size: rem(15);
      margin-left: rem(10);
    }
  }
  > .title {
    height: rem(60);
    line-height: rem(60);
    padding-left: rem(14);
    font-size: rem(25);
    font-weight: bold;
    background-color: #ffffff;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
  }
  .reviewInput {
    width: 100%;
    height: rem(60);
    // line-height: rem(60);
    padding: 0 rem(15);
    background-color: #ffffff;
    position: fixed;
    left: 0;
    bottom: rem(-60);
    // bottom: 0;
    border-top: rem(1) solid #f0f0f0;
    display: flex;
    align-items: center;
    // z-index: 1;
    &.Ani {
      // z-index: 9;
      bottom: 0;
      transition: bottom 0.5s;
    }
    form {
      flex: 1;
      input {
        width: 100%;
        height: rem(36);
        background-color: #f4f4f4;
        border-radius: rem(4);
        padding-left: rem(15);
      }
    }
    .submitBtn {
      display: block;
      width: rem(54);
      height: rem(30);
      line-height: rem(30);
      text-align: center;
      background: rgba(239, 246, 255, 1);
      border-radius: rem(15);
      color: #0139a4;
      font-size: rem(14);
      border: 1px solid rgba(199, 217, 255, 1);
      margin-left: rem(15);
    }
  }
  .not-sent{
    display: inline-block;
    width: rem(50);
    height: rem(18);
    line-height: rem(20);
    text-align: center;
    background-color: #FFF3F3;
    color: #FC5159;
    font-size: rem(12);
  }
  .withdrawwarp{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: rem(6);
    span {
      display: inline-block;
      width: rem(60);
      height: rem(24);
      line-height: rem(24);
      font-size: rem(14);
      text-align: center;
      color: #023C8F;
      border: 1px solid #023C8F;
      border-radius: 2px;
    }
  }
}
</style>
