<template>
  <div class="InspectionDetails">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="routerTo()"></i>
      <div class="headTab">
        <span :class="tableTab == 1 ? 'active title' : 'title'"
              @click="tableTabFunc(1)">{{ tableType === '巡更巡检' ? '巡更巡检表' : '消防器材检测表' }}</span>
        <span :class="tableTab == 2 ? 'active title' : 'title'"
              @click="tableTabFunc(2)">{{ tableType === '巡更巡检' ? '巡更巡检记录' : '消防检测记录' }}</span>
      </div>
      <div class="addBtn"
           v-if="hasAuthority('03050105') && InspectionDetailsData.useStatus === 'USING'"
           @click="addMenu">
        <i class="iconfont iconcms_tianjia"></i>
      </div>
      <div class="addBtn"
           v-if="!hasAuthority('03050105') && InspectionDetailsData.useStatus !== 'USING'"></div>
    </div>
    <!--  -->
    <div class="content"
         v-if="tableTab == 1">
      <div class="basic-information">
        <div class="content-title">基本信息</div>
        <!-- 所以dom渲染按tableType类型区分显示不同的字段不同的name效果减少文件淤积 -->
        <div class="ul-warp">
          <div class="content-ul">
            <span>项目简称</span>
            <span>
              {{ InspectionDetailsData.projectManagementName ? InspectionDetailsData.projectManagementName : InspectionDetailsData.projectName }}
            </span>
          </div>
          <div v-if="tableType == '巡更巡检'"
               class="content-ul">
            <span>类型</span>
            <span>
              {{InspectionDetailsData.patrolType === 'POLLING' ? '巡检' : '巡更'}}
            </span>
          </div>
          <div class="content-ul">
            <span>{{ tableType == '巡更巡检' ? '巡更巡检表名称' : '检查表名称' }}</span>
            <span>
              {{ InspectionDetailsData.name }}
            </span>
          </div>
          <div v-if="tableType == '巡更巡检'"
               class="content-ul">
            <span>频次</span>
            <span>{{ InspectionDetailsData.number }}{{ InspectionDetailsData.frequencyUnit == 'DAY' ? '次/天' : '天/次' }}</span>
          </div>
          <div class="content-ul">
            <span>{{ tableType == '巡更巡检' ? '状态' : '数据状态' }}</span>
            <span>{{ InspectionDetailsData.useStatus === 'USING' ? '使用中' : '已停用' }}</span>
          </div>
        </div>
      </div>
      <div class="basic-information">
        <div class="content-title">{{ tableType == '巡更巡检' ? '巡更巡检设备' : '检测设备' }}</div>
        <div class="ul-warp border"
             v-for="(item, index) in InspectionDetailsData.equirements"
             :key="index">
          <div class="content-ul noneFlex">
            <div class="flex">
              <span class="shopNb">{{ item.name }}（{{ item.code }}）</span>
            </div>
            <div class="flex">
              <span class="tab">{{ tableType == '巡更巡检' ? '设备大类' : '设备小类' }}：{{ tableType == '巡更巡检' ? item.equirementType.parent.name : item.equirementType.name }}</span>
            </div>
            <div v-if="tableType == '巡更巡检'"
                 class="flex">
              <span class="tab">是否需要巡更：{{ item.onPatrol ? '是' : '否' }}</span>
            </div>
            <div class="flex">
              <span class="tab">是否需要巡检：{{ item.onMaintain ? '是' : '否' }}</span>
              <span class="dingwe"><i class="iconfont icondingwei2x font"></i>{{ item.installPosition }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="loadAll">
        <span>-</span>
        <p>已经到底了</p>
        <span>-</span>
      </div>
    </div>
    <!--  -->
    <div class="content"
         v-if="tableTab == 2">
      <div class="common_list">
        <mt-loadmore ref="loadmore"
                     :bottom-method="loadBottom"
                     :autoFill="false"
                     :bottom-all-loaded="allLoaded">
          <ul>
            <li class="ul-warp tableList"
                v-for="(item,index) in tableData"
                :key="index"
                @click="toDetails(item)">
              <div class="flex">
                <span class="shopNb">{{ tableType == '巡更巡检' ? `异常数：${ item.errorNum?item.errorNum:0 }` : `${item.reportName} (${item.checkTypeValue})` }}</span>
              </div>
              <div class="flex">
                <span class="tab">{{ tableType == '巡更巡检' ? '设备数' : '检测设备' }}：{{ tableType == '巡更巡检' ? item.totalNum : item.eqptAmount  }}</span>
              </div>
              <div v-if="tableType != '巡更巡检'"
                   class="flex">
                <span class="tab">异常设备：{{ item.errorAmount ?item.errorAmount :0 }}</span>
              </div>
              <div class="flex">
                <span class="tab">{{ tableType == '巡更巡检' ? '责任人' : '负责人' }}：{{ tableType == '巡更巡检' ? item.person : item.principal }}</span>
              </div>
              <div class="flex">
                <span class="tab">{{ tableType == '巡更巡检' ? '完成时间' : '检测时间' }}：{{ tableType == '巡更巡检' ? item.completeTime.replace(/T/g, ' ') : item.checkDate }}</span>
              </div>
              <span class="iconfont iconright"></span>
            </li>
          </ul>
        </mt-loadmore>
        <div class="loadAll contractLoadAll"
             v-if="allLoaded && tableData.length!==0">
          <span>-</span>
          <p>已经到底了</p>
          <span>-</span>
        </div>
        <div class="noData"
             v-if="tableData.length===0 && dataReady">
          <img src="../../../../assets/nores.png">
          <p>暂无数据</p>
        </div>
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
let roterFrom = null
export default {
  name: 'maintainDetails',
  components: { ailPreview, aliUpload },
  props: ['scrollTop'],
  watch: {
    scrollTop (val) {
      this.scrollVal = val
    }
  },
  data () {
    return {
      scrollVal: 0,
      contractId: '',
      InspectionDetailsData: {},
      address: '',
      detailDataRemarks: {},
      isEdit: false,
      showStartPicker: false,
      fileType: ['jpg', 'png'],
      currentDateStart: new Date(),
      showimageUrls: false,
      tableData: [],
      dataReady: false,
      allLoaded: false,
      currentPage: 1,
      pgSize: 15,
      tableTab: 1,
      tableType: '',
      projectId: null,
      routeParams: {}
    }
  },
  beforeRouteEnter (to, from, next) {
    roterFrom = from.name
    if (from.name === 'RecordDetail') {
      window.beforeRouteEnterType = 2
    } else {
      window.beforeRouteEnterType = 1
    }
    next()
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'Inspection') {
      window.sessionStorage.removeItem('scrollVal1')
    }
    if (to.name === 'Inspection') {
      to.params.type = this.tableType
    }
    next()
  },
  activated () {
    this.contractId = this.$route.query.id
    this.tableType = this.$route.query.type
    this.projectId = this.$route.query.projectId
    this.tableTab = window.beforeRouteEnterType
    if (roterFrom === 'RecordDetail') {
      let scrollVal = window.sessionStorage.getItem('scrollVal1')
      if (scrollVal) {
        this.$emit('changeScroll', scrollVal)
      }
    } else {
      window.sessionStorage.removeItem('scrollVal1')
      this.$emit('changeScroll', 0)
      this.InspectionDetails(this.contractId)
    }
  },
  created () {
    // this.contractId = this.$route.query.id
    // this.tableType = this.$route.query.type
    // this.projectId = this.$route.query.projectId
    // this.tableTab = window.beforeRouteEnterType
    // this.InspectionDetails(this.contractId)
  },
  mounted () {
    this.$parent.$refs['content'].scrollTop = 0
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    tableTabFunc (num) {
      this.tableTab = num
      if (num === 1) {
        this.InspectionDetails(this.contractId, true)
      } else {
        this.getMaintenanceList(true)
      }
    },
    routerTo () {
      this.$router.push({ name: 'Inspection' })
    },
    addMenu () {
      let id = this.contractId
      let type = this.tableType
      let projectId = this.projectId
      this.$router.push({ name: 'addInspection', query: { id, type, projectId } })
    },
    toDetails (row) {
      let id = this.contractId
      let type = this.tableType
      let projectId = this.projectId
      window.sessionStorage.setItem('scrollVal1', this.scrollVal)
      this.$router.push({ name: 'RecordDetail', query: { row, id, type, projectId } })
    },
    //
    loadBottom () {
      this.currentPage++
      this.getMaintenanceList()
      this.$refs.loadmore.onBottomLoaded()
    },
    // 检查数据
    async InspectionDetails (id, flag) {
      let result
      if (this.tableType === '巡更巡检') {
        result = await context.http.get(`cms/api/patrolInspection/${id}/`)
      } else {
        result = await context.http.get(`cms/api/cmsFireControlCheckList/${id}/`)
      }
      this.InspectionDetailsData = result.data
      if (!flag) {
        this.getMaintenanceList()
      }

      // 消防子集判断空处理
      if (this.InspectionDetailsData.equirements.length === 0 && this.tableType !== '巡更巡检') {
        this.fireSubset()
      }
    },
    // 消防子集
    async fireSubset () {
      let param = {
        page: 0,
        size: 9999,
        fireControlCheckListId: this.InspectionDetailsData.id,
        sort: 'desc'
      }
      let result = await context.http.get(`cms/api/cmsFireControlCheckList/equirements`, param)
      this.InspectionDetailsData.equirements = result.data
    },
    // 记录数据
    async getMaintenanceList (flag) {
      let projectManagementId = this.projectId
      this.dataReady = false
      if (flag) this.currentPage = 1; this.allLoaded = false
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
        param = {
          page: (this.currentPage - 1),
          size: this.pgSize,
          projectId: projectManagementId,
          fireControlCheckListId: this.InspectionDetailsData.id,
          sort: 'createdDate,desc'
        }
        result = await context.http.get(`cms/api/fcReports`, param)
      }
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      if (this.currentPage === Math.ceil(this.total / this.pgSize) || this.currentPage > Math.ceil(this.total / this.pgSize)) {
        this.allLoaded = true// 若数据已全部获取完毕
      }
      this.tableFlag = true
      this.dataReady = true
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/config";
.InspectionDetails {
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
      width: rem(308);
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
  }
  .tableList {
    position: relative;
    padding-top: rem(8);
    background: #ffffff;
    .flex {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .shopNb {
        font-size: rem(15);
        color: #444547;
        font-weight: bolder;
        padding-bottom: rem(10);
      }
      .tab {
        font-size: rem(14);
        color: #858c94;
      }
    }
    .iconright {
      position: absolute;
      right: rem(16);
      top: 50%;
      background: linear-gradient(90deg, #c6c6c6 0%, #c6c6c6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .content-ul {
    display: flex;
    justify-content: space-between;
    padding-top: rem(16) !important;
    padding-right: rem(14);
    font-size: rem(15);
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
    // .              <span class="shopNb">建筑电梯（jzdt-0821-01)</span>
    //         </div>
    //         <div class="flex">
    //           <span class="tab">设备大类：建筑系统</span>
    //         </div>
    //         <div class="flex">
    //           <span class="tab">是否需要巡更：是</span>
    //         </div>
    //         <div class="flex">
    //           <span class="tab">是否需要巡检：是</span>
    //           <span><i class="iconfont icondingwei2x"></i>一楼大厅</span>
    .flex {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .shopNb {
        font-size: rem(15);
        color: #444547;
        font-weight: bolder;
        padding-bottom: rem(10);
      }
      .tab {
        font-size: rem(14);
      }
      .font {
        background: linear-gradient(90deg, #858c94 0%, #858c94 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .dingwe {
        color: #858c94;
        font-size: rem(12);
        height: rem(18);
        line-height: rem(18);
        max-width: 48%;
        text-align: justify;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .iconright {
        height: rem(18);
      }
    }
  }
  .noneFlex {
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
    padding-top: rem(20);
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
<style lang="scss">
.InspectionDetails .noData {
  top: 230px;
}
</style>
