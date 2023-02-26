<template>
  <div class="personDetails">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="toRepairList"></i>
      <div class="headTab">人员列表详情</div>
    </div>
    <div class="content">
      <div class="basic-information">
        <div class="content-title">基本信息</div>
        <div class="ul-warp">
          <div class="content-ul">
            <span>工号</span>
            <span>{{personDetails.code}}</span>
          </div>
          <div class="content-ul">
            <span>姓名</span>
            <span>{{personDetails.name}}</span>
          </div>
          <div class="content-ul">
            <span>性别</span>
            <span>{{personDetails.sex==='WOMAN'?'女':'男'}}</span>
          </div>
          <div class="content-ul">
            <span>联系方式</span>
            <span>{{personDetails.telephone}}</span>
          </div>
          <div class="content-ul">
            <span>籍贯</span>
            <span>{{personDetails.nativePlace}}</span>
          </div>
          <div class="content-ul">
            <span>出生日期</span>
            <span>{{personDetails.birth}}</span>
          </div>
          <div class="content-ul">
            <span>身份证号码</span>
            <span>{{personDetails.certificate}}</span>
          </div>
          <div class="content-ul">
            <span>民族</span>
            <span>{{personDetails.national}}</span>
          </div>
          <div class="content-ul">
            <span>健康状况</span>
            <span>{{personDetails.health}}</span>
          </div>
          <div class="content-ul content-ul-wrap">
            <span>现居地址</span>
            <span>{{personDetails.address}}</span>
          </div>
        </div>
      </div>
      <div style="margin-bottom:0;"
           class="basic-information">
        <div class="content-title">在职信息</div>
        <div class="ul-warp">
          <div class="content-ul content-ul-wrap">
            <span>项目简称</span>
            <span>{{personDetails.projectManagement}}</span>
          </div>
          <div class="content-ul content-ul-wrap">
            <span>职务</span>
            <span>{{personDetails.duty}}</span>
          </div>
          <div class="content-ul content-ul-wrap">
            <span>岗位名称</span>
            <span>{{positionFormatter(personDetails.position)}}</span>
          </div>
          <div class="content-ul content-ul-wrap">
            <span>岗位职责</span>
            <span>{{personDetails.responsibility}}</span>
          </div>
          <div class="content-ul content-ul-wrap">
            <span>入职时间</span>
            <span>{{personDetails.entryDate}}</span>
          </div>
          <div class="content-ul content-ul-wrap">
            <span>在职状态</span>
            <span>{{jobStatusFormatter(personDetails.jobStatus)}}</span>
          </div>
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
import common from '@/utils/common.js'
export default {
  name: 'personDetails',
  components: { ailPreview },
  data () {
    return {
      personId: '',
      personDetails: {}
    }
  },
  created () {
    this.personId = this.$route.params.id
    this.getPersonDetails(this.personId)
  },
  mounted () {
    this.$parent.$refs['content'].scrollTop = 0
  },
  methods: {
    jobStatusFormatter (rowJobStatus) {
      let jobStatus
      switch (rowJobStatus) {
        case 'ONJOB':
          jobStatus = '在职'
          break
        case 'RESIGNA':
          jobStatus = '离职'
          break
      }
      return jobStatus
    },
    positionFormatter (rowPosition) {
      let position
      switch (rowPosition) {
        case 'GUARD':
          position = '保安'
          break
        case 'CLEANER':
          position = '保洁'
          break
      }
      return position
    },
    toRepairList () {
      this.$router.replace({ name: 'personList' })
    },
    async getPersonDetails (id) {
      let res = await context.http.get(`cms/api/guardCleaner/${id}`)
      this.personDetails = res.data
    },
    isShow (n) { // 是否展示
      if (n === this.personDetails.repairType) {
        return true
      } else {
        return false
      }
    },
    getformat (annexName) {
      return common.getformat(annexName)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/config";
.personDetails {
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
