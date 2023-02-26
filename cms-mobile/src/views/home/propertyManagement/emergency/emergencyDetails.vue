<template>
  <div class="emergencyDetails">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="toEmergencyList"></i>
      <div class="headTab">应急事项详情</div>
      <div class="rightBtn"
           v-if="hasAuthority('03020103')"
           @click="editFn">编辑</div>
    </div>
    <div class="content">
      <div class="basic-information">
        <div class="content-title">基本信息</div>
        <div class="ul-warp">
          <div class="content-ul">
            <span>项目简称</span>
            <span>{{emergencyDetails.projectManagementRefferd}}</span>
          </div>
          <div class="content-ul">
            <span>事项简述</span>
            <span>{{emergencyDetails.eventRefferd}}</span>
          </div>
          <div class="content-ul">
            <span>发生时间</span>
            <span>{{emergencyDetails.happenDate}}</span>
          </div>
          <div class="content-ul">
            <span>发生地点</span>
            <span>{{emergencyDetails.happenPlace}}</span>
          </div>
          <div class="content-ul">
            <span>跟进人</span>
            <span>{{emergencyDetails.followUser}}</span>
          </div>
          <div class="content-ul">
            <span>事项状态</span>
            <span>{{formatEventStatus(emergencyDetails.eventStatus)}}</span>
          </div>
          <div class="content-ul">
            <span>事项详情</span>
            <span>{{emergencyDetails.eventContent}}</span>
          </div>
          <div class="content-ul">
            <span>处理结果</span>
            <span>{{emergencyDetails.result}}</span>
          </div>
        </div>
      </div>
      <!-- 附件 -->
      <div class="annexes"
           v-if="emergencyDetails.annexes.length">
        <div class="title">附件</div>
        <div class="item"
             v-for="(item,index) in emergencyDetails.annexes"
             :key="index">
          <div>
            <svg class="icon"
                 aria-hidden="true">
              <use :xlink:href="pageGetformat(item.annexName)"></use>
            </svg>
          </div>
          <div class="annex-name">{{item.annexName}}</div>
          <ailPreview :ailObj="item"
                      :encrypt="true"
                      @setFile="setFile"
                      class="ailPreview" />
        </div>
      </div>
      <div class="loadAll contractLoadAll"
           style="margin-top:15px">
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
import Common from '@/utils/common'
export default {
  name: 'emergencyDetails',
  components: { ailPreview },
  data () {
    return {
      id: '',
      emergencyDetails: {
        annexes: []
      }
    }
  },
  created () {
    this.id = this.$route.params.id
    this.getEmergenDetails(this.id)
  },
  mounted () {
    this.$parent.$refs['content'].scrollTop = 0
  },
  methods: {
    editFn () {
      this.$router.replace({ name: 'emergencyAdd', params: { detailsData: this.emergencyDetails, type: 'edit' } })
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
    toEmergencyList () {
      this.$router.replace({ name: 'emergencyList' })
    },
    pageGetformat (str) {
      return Common.getformat(str)
    },
    setFile (url) {

    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    async getEmergenDetails (id) {
      let res = await context.http.get(`cms/api/emergency/${id}`)
      this.emergencyDetails = res.data
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/config";
.emergencyDetails {
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
    .rightBtn {
      font-size: rem(15);
      color: #0139a4;
      padding-right: rem(15);
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
      position: relative;
      i {
        font-size: rem(18);
        color: #444547;
        font-size: rem(18);
      }
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
    > span {
      color: #18191a;
      &:first-child {
        color: #858c94;
        min-width: rem(64);
        margin-right: rem(10);
      }
    }
  }
  .content-ul-wrap {
    // display: block;
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
}
</style>
