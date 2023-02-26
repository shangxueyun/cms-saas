<template>
  <div class="messageDetails">
    <app-header title="详情"
                :mode="false"
                class="appHeader"></app-header>
    <!-- 收件人信息 -->
    <div class="recipients"
         :class="{'moreAni':more}">
      <div>
        <img :src="detailsData.userImg"
             v-if="detailsData.userImg">
        <div v-else>{{nameFormat(detailsData.createUserName)}}</div>
        <span>{{detailsData.createUserName}}</span>
      </div>
      <div>
        <span>类型：</span>
        <span>{{detailsData.notifyTypeDescription}}</span>
      </div>
      <div>
        <span>时间：</span>
        <span>{{formateData(detailsData.sendTime)}}</span>
      </div>
      <div>
        <span>收件人：</span>
        <div :class="{'moreAni':more}"
             class="andiv">
          <span v-if="detailsData.onSendAll">全体成员</span>
          <span v-if="!detailsData.onSendAl && item.userId"
                v-for="(item,index) in detailsData.users"
                :key="index">{{item.userName}}</span>
        </div>
      </div>
      <div class="more"
           :class="{'moreAni':more}"
           v-if="detailsData.users && detailsData.users.length > 4 && !detailsData.onSendAll"
           @click="more=!more">
        <i class="iconfont iconcms_xia"></i>
      </div>
    </div>
    <div class="content">
      <div class="title">{{detailsData.title}}</div>
      <div class="main"
           v-html="detailsData.content"></div>
    </div>
    <!-- 附件 -->
    <div class="annexes" v-if="detailsData.annexes.length > 0">
      <div class="title">附件</div>
      <div class="item"
           v-for="(item,index) in detailsData.annexes"
           :key="index">
        <div>
          <svg class="icon"
               aria-hidden="true">
            <use :xlink:href="pageGetformat(item.annexName)"></use>
          </svg>
        </div>
        <div class="annex-name">{{item.annexName}}</div>
        <ailPreview :ailObj="item"
                    class="ailPreview" />
      </div>
    </div>
  </div>
</template>

<script>
import context from '@/service'
import AppHeader from '@/components/appHead'
import ailPreview from '@/components/ailPreview.vue'
import common from '@/utils/common.js'
export default {
  name: 'noticeDetails',
  components: {
    AppHeader,
    ailPreview
  },
  computed: {

  },
  data () {
    return {
      iconcms_PDF: '#iconcms_yasuogeshi',
      more: false,
      scrollTop: 0,
      detailsData: {
        annexes: []
      }
    }
  },
  created () {
    // console.log(this.getformat())
    let id = this.$route.query.id
    if (id) {
      this.getDetails(id)
    }
  },
  methods: {
    formateData (val) {
      if (val) {
        return val.replace('T', '  ')
      } else {
        return '-'
      }
    },
    pageGetformat (str) {
      return common.getformat(str)
    },
    getDetails (id) {
      context.http.get(`mps/api/messageCenters/${id}`).then(res => {
        if (res.status === 200) {
          this.detailsData = res.data
          this.createUserName = this.detailsData.createUserName.length > 2
            ? (this.detailsData.createUserName).substring(this.detailsData.createUserName.length - 2) : this.detailsData.createUserName
          // let createUser = sessionStorage.getItem('user')
          // createUser = JSON.parse(createUser)
          // if (this.detailsData.createUserId === createUser.id) {
          //   this.onSend = true
          // }
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
@import "../../../../style/config";
.messageDetails {
  .appHeader {
    box-shadow: 0px 1px 4px 0px rgba(230, 230, 230, 0.5);
  }
  .recipients {
    padding-top: rem(40);
    padding-left: rem(13);
    padding-bottom: rem(5);
    // height: rem(170);
    height: auto;
    background-color: #fff;
    // &.moreAni {
    //   height: auto;
    // }
    > div:first-child {
      display: flex;
      align-items: center;
      margin-top: rem(15);
      > img {
        width: rem(35);
        height: rem(35);
        border-radius: 50%;
        margin-right: rem(10);
      }
      > div {
        width: rem(35);
        height: rem(35);
        line-height: rem(35);
        text-align: center;
        background: rgba(53, 117, 246, 1);
        font-size: rem(12);
        color: rgba(255, 255, 255, 1);
        border-radius: 50%;
        margin-right: rem(10);
      }
      > span {
        font-size: rem(15);
        font-weight: bold;
        color: rgba(68, 69, 71, 1);
      }
    }
    > div:nth-child(2),
    div:nth-child(3) {
      margin-top: rem(7);
      font-size: rem(13);
      color: rgba(133, 140, 148, 1);
    }
    > div:nth-child(4) {
      margin-top: rem(7);
      font-size: rem(13);
      color: rgba(133, 140, 148, 1);
      display: flex;
      > span {
        display: block;
        width: 15%;
      }
      > div {
        width: 85%;
        display: flex;
        flex-wrap: wrap;
        // height: rem(25);
        overflow: hidden;
        transition: height 0.5s;
        &.moreAni {
          max-height: rem(2000);
        }
        > span {
          padding: rem(2) rem(8);
          background: rgba(218, 234, 255, 1);
          border-radius: rem(2);
          font-size: rem(13);
          color: rgba(68, 69, 71, 1);
          margin-right: rem(8);
          margin-bottom: rem(8);
        }
      }
      .andiv {
        max-height: rem(28);
        transition: all 0.5s;
        -moz-transition: all 0.5s; /* Firefox 4 */
        -webkit-transition: all 0.5s; /* Safari 和 Chrome */
        -o-transition: all 0.5s; /* Opera */
      }
    }
    > div:nth-child(5) {
      // margin-top: rem(5);
      // padding-right: rem(13);
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #0139a4;
      &.more {
        transition: transform 0.5s;
        &.moreAni {
          transform: rotate(180deg);
          transform-origin: center center;
        }
      }
    }
  }
  .content {
    background-color: #fff;
    margin-top: rem(10);
    > .title {
      padding: 0 rem(13);
      min-height: rem(50);
      line-height: rem(50);
      font-size: rem(17);
      color: #18191a;
      border-bottom: rem(1) solid #f0f0f0;
    }
    > .main {
      font-size: rem(14);
      color: rgba(68, 69, 71, 1);
      padding: rem(10) rem(13) rem(15);
      border-bottom: rem(1) solid #f0f0f0;
    }
  }
  .annexes {
    background-color: #fff;
    padding-bottom: rem(10);
    .title {
      padding: rem(10) 0 rem(13) rem(12);
      font-size: 15px;
      color: rgba(133, 140, 148, 1);
    }
    .item {
      display: flex;
      align-items: center;
      padding: rem(5) 0 rem(5) rem(17);
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
    .ailPreview {
      flex: 1;
      text-align: right;
    }
    .annex-name {
      width: 80%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .upload {
    width: rem(80);
    height: rem(20);
    position: relative;
    .uploadIcon {
      color: #023c8f;
      font-size: rem(13);
      width: 100%;
      height: 100%;
    }
  }
}
</style>
<style lang="scss">
  .messageDetails .main p img {
    width: 100% !important;
    min-height: 100px !important;
  }
</style>

