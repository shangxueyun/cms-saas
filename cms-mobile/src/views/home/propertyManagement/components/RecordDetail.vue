<template>
  <div class="RecordDetail">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="routerTo()"></i>
      <div class="headTab">
        <span >{{ tableType === '巡更巡检' ? '巡更巡检记录详情' : '消防检测记录详情' }}</span>
      </div>
      <div class="addBtn">
      </div>
    </div>
    <!--  -->
    <div class="content">
      <div class="basic-information">
        <div class="content-title">基本信息</div>
        <div class="ul-warp">
          <!-- 所以dom渲染按tableType类型区分显示不同的字段不同的name效果减少文件淤积 -->
          <div class="content-ul">
            <span>项目简称</span>
            <span>
              {{ RecordDetail.projectManagementName ? RecordDetail.projectManagementName : RecordDetail.projectName }}
            </span>
          </div>
          <div v-if="tableType != '巡更巡检'" class="content-ul">
            <span>报告名称</span>
            <span>
              {{ RecordDetail.reportName }}
            </span>
          </div>
          <div class="content-ul">
            <span>{{ tableType == '巡更巡检' ? '类型' : '检测类型' }}</span>
            <span>
              {{ tableType == '巡更巡检' ? RecordDetail.patrolType == 'POLLING' ? '巡检' : '巡更' : RecordDetail.checkTypeValue  }}
            </span>
          </div>
          <div class="content-ul">
            <span>{{ tableType == '巡更巡检' ? '巡更巡检表名称' : '检测时间' }}</span>
            <span>
              {{ tableType == '巡更巡检' ? RecordDetail.name : RecordDetail.checkDate }}
            </span>
          </div>
          <div v-if="tableType == '巡更巡检'" class="content-ul">
            <span>频次</span>
            <span>{{ RecordDetail.number }}{{ RecordDetail.frequencyUnit == 'DAY' ? '次/天' : '天/次' }}</span>
          </div>
          <!-- <div v-if="tableType == '巡更巡检'" class="content-ul">
            <span>状态</span>
            <span>{{ RecordDetail.useStatus === 'USING' ? '使用中' : '已停用' }}</span>
          </div> -->
          <div class="content-ul">
            <span>{{ tableType == '巡更巡检' ? '责任人' : '负责人' }}</span>
            <span>{{ tableType == '巡更巡检' ? RecordDetail.person : RecordDetail.principal }}</span>
          </div>
          <div v-if="tableType != '巡更巡检' && RecordDetail.checkDept" class="content-ul">
            <span>维保单位</span>
            <span>{{ RecordDetail.checkDept }}</span>
          </div>
          <div class="content-ul">
            <span>{{ tableType == '巡更巡检' ? '实际完成时间' : '创建时间' }}</span>
            <span>{{ tableType == '巡更巡检' ? RecordDetail.completeTime.replace(/T/g, ' ') : RecordDetail.createTime.replace(/T/g, ' ') }}</span>
          </div>
          <div class="annex common">
            <div class="an-title">附件 <span class="sapn">(点击可预览)</span></div>
            <div class="an-item"
                v-for="(item, index) in accessory"
                :key="index">
              <div class="image">
                <svg class="icon"
                    aria-hidden="true">
                  <use :xlink:href="getformat(item.annexName)"></use>
                </svg>
              </div>
              <div class="annex-name">{{item.annexName}}</div>
              <ailPreview :ailObj="item"
                          :encrypt="true"
                          class="ailPreview" />
            </div>
          </div>
        </div>
      </div>
      <div class="basic-information">
        <div class="content-title">{{ tableType == '巡更巡检' ? '巡更巡检设备' : '检测设备' }}</div>
        <div class="ul-warp border" v-for="(item, index) in tableData" :key="index">
          <div class="content-ul noneFlex">
            <div class="flex">
              <span v-if="tableType == '巡更巡检'" :class="item.checkStatus == 'NORMAL'? 'shopNb NORMAL' : 'shopNb Exception'">{{ item.equirement.name }}（{{ item.equirement.code }}）</span>
              <span v-if="tableType != '巡更巡检'" :class="item.checkStatus == 'NORMAL'? 'shopNb NORMAL' : 'shopNb Exception'">{{ item.equipmentName }}（{{ item.equipmentNo }}）</span>
            </div>
            <div class="flex">
              <span class="tab">{{ tableType == '巡更巡检' ? '设备大类' : '设备小类' }}：{{ tableType == '巡更巡检' ? item.equirement.equirementType.parent.name : item.equipmentType }}</span>
            </div>
            <div class="flex" style="display: block">
              <span class="tabName">备注：</span>
              <span class="tabNote">{{ tableType == '巡更巡检' ? item.content : item.comment }}</span>
            </div>
            <div style="clear: both"></div>
            <span class="dingwe"><i class="iconfont icondingwei2x font"></i>{{ tableType == '巡更巡检' ? item.equirement.installPosition : item.installPosition }}</span>
          </div>
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
import common from '@/utils/common.js'
import aliUpload from '@/components/aliUpload.vue'
import moment from 'moment-timezone'
import { MessageBox } from 'mint-ui'
export default {
  name: 'maintainDetails',
  components: { ailPreview, aliUpload },
  data () {
    return {
      contractId: '',
      repairDetailsData: {},
      address: '',
      RecordDetail: {},
      isEdit: false,
      showStartPicker: false,
      fileType: ['jpg', 'png'],
      currentDateStart: new Date(),
      showimageUrls: false,
      tableData: [],
      dataReady: false,
      allLoaded: false,
      accessory: [
        { annexName: 'sadaddada.jpg' }
      ],
      currentPage: 0,
      tableTab: 1,
      tableType: '',
      returnObj: {}
    }
  },
  created () {
    this.tableType = this.$route.query.type
    this.returnObj = typeof this.$route.query.row === 'string'
                      ? JSON.parse(sessionStorage.getItem('routeObj')).returnObj
                      : this.$route.query.row

    // 数据暂存区
    sessionStorage.setItem('routeObj', JSON.stringify({
      type: this.tableType,
      returnObj: this.returnObj,
      id: this.$route.query.id,
      projectId: this.$route.query.projectId
    }))
    this.getContractDetails(this.returnObj.id)
  },
  // 离开
  beforeRouteLeave (to, from, next) {
    if (to.name === 'InspectionDetails') {
      let routeObj = JSON.parse(sessionStorage.getItem('routeObj'))
      let { type, projectId } = routeObj
      let id = this.$route.query.id

      // // 删除暂存区
      // sessionStorage.removeItem('routeObj')
      to.query.id = id
      to.query.type = type
      to.query.projectId = projectId
    }

    next()
  },
  mounted () {
    this.$parent.$refs['content'].scrollTop = 0
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    getformat (annexName) {
      return common.getformat(annexName)
    },
    routerTo () {
      this.$router.push({ name: 'InspectionDetails' })
    },
    async getContractDetails (id) {
      let result
      if (this.tableType === '巡更巡检') {
        result = await context.http.get(`cms/api/patrolInspectionRecord/${id}/`)
        let { person, completeTime, annexes } = result.data
        // 数据优化重构
        this.RecordDetail = Object.assign(result.data.patrolInspection, { person, completeTime })
        // 图片集
        this.accessory = annexes
      } else {
        result = await context.http.get(`cms/api/fcReports/${id}/`)
        this.RecordDetail = result.data
        // 图片集
        this.accessory = result.data.annexes
      }
      if (this.tableType !== '巡更巡检') {
        this.getContractDetailsChild(id)
      } else {
        this.tableData = result.data.equirementPatrolResults
      }
    },
    async getContractDetailsChild (id) {
      let param
      let result
      if (this.tableType === '巡更巡检') {
        param = {
          page: (this.currentPage - 1),
          size: this.pgSize,
          projectManagementId,
          patrolInspectionId: this.InspectionDetailsData.id,
          sort: 'completeTime,desc'
        }
        result = await context.http.get(`cms/api/patrolInspectionRecord`, param)
      } else {
        result = await context.http.get(`cms/api/fcReports/${id}/details`)
      }
      this.tableData = result.data
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/config";
.RecordDetail {
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
      color: #444547;
      font-size: rem(16);
      width: rem(200);
      display: flex;
      justify-content: center;
      > span {
        position: relative;
        &.active {
          color: #0139a4;
          border-bottom: rem(3) solid #0139a4;
          font-weight: bold;
        }
        &:nth-child(2) {
          margin-left: rem(40);
        }
      }
    }
    .back {
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
      color: #0139a4;
      font-size: rem(15);
      margin-right: rem(0);
    }
    .selected {
      color: #0139a4;
    }
  }
  .content {
    width: 100%;
    position: relative;
    top: rem(44);
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
  .ul-warp {
    padding: 0 0 0 rem(14);
    border-bottom: rem(1) solid #f0f0f0;
    padding-bottom: rem(16);
    &:last-child {
      border: none;
    }
    .annex{
      margin-top: rem(10);
      font-size: rem(15);
      color: #858C94;
      .sapn{
        font-size: rem(13);
      }
    }
  }
  .tableList{
    position: relative;
    padding-top: rem(8);
    background: #FFFFFF;
    .flex{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .shopNb{
        font-size: rem(15);
        color: #444547;
        font-weight: bolder;
        padding-bottom: rem(10);
      }
      .tab{
        font-size: rem(14);
        color: #858C94;
      }
    }
    .iconright{
      position: absolute;
      right: rem(16);
      top: 50%;
      background: linear-gradient(90deg, #C6C6C6 0%, #C6C6C6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .border{
    clear: both;
  }
  .content-ul {
    display: flex;
    justify-content: space-between;
    padding-top: rem(16) !important;
    padding-right: rem(14);
    font-size: rem(15);
    position: relative;
    > span {
      color: #18191a;
      &:first-child {
        color: #858c94;
        min-width: rem(64);
        margin-right: rem(10);
      }
    }
    input {
      text-align: right;
    }
    .flex{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .shopNb{
        font-size: rem(15);
        color: #444547;
        font-weight: bolder;
        padding-bottom: rem(10);
      }
      .NORMAL::after{
        content: '正常';
        margin-left: rem(10);
        background: #EFFFFB;
        padding: rem(3);
        font-size: rem(12);
        color: #1CC296;
        font-weight: 500;
      }
      .Exception::after{
        content: '异常';
        margin-left: rem(10);
        background: #FFF3F3;
        padding: rem(3);
        font-size: rem(12);
        color: #FC5159;
        font-weight: 500;
      }
      .tabName{
        font-size: rem(14);
        display: block;
        float: left;
      }
      .tabNote{
        width: 87%;
        font-size: rem(14);
        display: block;
        float: left;
        height: auto;
        word-wrap: break-word;
        text-align: justify;
      }
      .font{
        background: linear-gradient(90deg, #858C94 0%, #858C94 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .iconright{
        height: rem(18);
      }
    }
    .dingwe{
      color: #858C94;
      font-size: rem(12);
      height: rem(18);
      line-height: rem(18);
      position: absolute;
      top: rem(48);
      right: rem(16);
      max-width: 48%;
      text-align: justify;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .sapn{
        font-size: rem(13);
    }
  }
  .noneFlex{
    display: block;
  }
  .content-div {
    padding-top: rem(16) !important;
    font-size: rem(15);
    position: relative;
    > span {
      color: #858c94;
    }
    > div {
      padding-top: rem(10);
      color: #18191a;
    }
    .add-pic {
      position: absolute;
      right: rem(14);
      color: #023c8f;
      i {
        margin-right: rem(2);
      }
    }
    &.long-div {
      input {
        width: 100%;
      }
    }
  }
  .border-top {
    border-top: rem(1) solid #f0f0f0;
    margin-top: rem(12);
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
    padding: rem(14) rem(14) 0 0;
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
      margin-right: rem(10);
    }
  }
  .contractLoadAll {
    > p {
      // width:rem(80);
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    /* justify-content: space-evenly; */
    justify-content: space-around;
    background: rgba(255, 255, 255, 0.6);
    height: rem(70);
    &:before,
    &:after {
      content: "";
      display: block;
    }
    div {
      &:first-child {
        width: rem(110);
        height: rem(50);
        line-height: rem(50);
        text-align: center;
        background: rgba(242, 242, 242, 1);
        border-radius: rem(4);
        color: #0139a4;
      }
      &:last-child {
        width: rem(220);
        height: rem(50);
        line-height: rem(50);
        text-align: center;
        background: rgba(1, 57, 164, 1);
        border-radius: rem(4);
        color: #ffffff;
      }
    }
  }
}
</style>
