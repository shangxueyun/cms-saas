<template>
  <div class="Inspection">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="onGoBack"></i>
      <div class="headTab">
        <span class="">{{ tableType }}</span>
      </div>
      <div class="addBtn widthrightBtn"
           @click="showActionSheet">
        <i class="iconfont iconcms_shaixuan"></i>
      </div>
    </div>
    <div @click="showActionSheet"
         class="selectResultml">
      <span>{{currentProject.projectManagementName}}</span>
      <span v-if="tableType == '巡更巡检'">{{currentProject.patrolTypelabel}}</span>
      <span :style="tableType == '巡更巡检' ? '' : 'border-right: none'">{{currentProject.useStatuslabel}}</span>
    </div>
    <!-- 所以dom渲染按tableType类型区分显示不同的字段不同的name效果减少文件淤积 -->
    <div class="content common_list">
      <mt-loadmore ref="loadmore"
                   :bottom-method="loadBottom"
                   :autoFill="false"
                   :bottom-all-loaded="allLoaded">
        <ul v-if="tableType == '巡更巡检'">
          <li v-for="(item,index) in tableData"
              :key="index"
              @click="toDetails(item.id)">
            <div>
              <span class="shopNb">{{item.name}} {{ item.patrolType == 'POLLING' ? '(巡检)' : '(巡更)' }}</span>
              <span :class="item.useStatus === 'USING' ? 'status_action' : 'status'">{{ item.useStatus === 'USING' ? '使用中' : '已停用' }}</span>
              <span class="iconfont iconright postion"></span>
            </div>
            <div>
              <span class="shopType">频次：{{ item.number }}{{ item.frequencyUnit == 'DAY' ? '次/天' : '天/次' }}</span>
            </div>
            <div class="bottom-div">
              <span>设备数：{{item.equirements.length}}</span>
              <!-- <span><i class="iconfont icondingwei2x"></i>{{item.installPosition}}</span> -->
            </div>
          </li>
        </ul>
        <ul v-if="tableType == '消防检查'">
          <li v-for="(item,index) in tableData"
              :key="index"
              @click="toDetails(item.id)">
            <div>
              <span class="shopNb">{{item.name}}</span>
              <span :class="item.useStatus === 'USING' ? 'status_action postion USING' : 'status postion USING'">{{ item.useStatus === 'USING' ? '使用中' : '已停用' }}</span>
              <span class="iconfont iconright postion"></span>
            </div>
            <div v-if="tableType == '巡更巡检'">
              <span class="shopType">频次：{{ item.number }}{{ item.frequencyUnit == 'DAY' ? '次/天' : '天/次' }}</span>
            </div>
            <div class="bottom-div">
              <span>设备数：{{item.checkAmount}}</span>
              <!-- <span><i class="iconfont icondingwei2x"></i>{{item.installPosition}}</span> -->
            </div>
          </li>
        </ul>
      </mt-loadmore>
      <div class="loadAll"
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
    <!-- 右侧筛选 -->
    <van-popup v-model="popupShow"
               class="popup_common"
               :overlay-style="{'background-color': 'rgba(0,0,0,.4)'}"
               :style="{ height: '100%' }"
               position="right">
      <p class="popup_title">筛选</p>
      <div class="popup_container">
        <div class="popup_list">
          <p>项目</p>
          <ul>
            <li v-for="(item, index) in projectManagementList"
                :key="item.id"
                @click="selectProject(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.referred }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list"
             v-if="tableType == '巡更巡检'">
          <p>类型</p>
          <ul>
            <li v-for="(item, index) in repairTypeList"
                :key="item.value"
                @click="selectRepairType(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>状态</p>
          <ul>
            <li v-for="(item, index) in repairStatusList"
                :key="item.value"
                @click="selectRepairStatus(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="popup_buttons">
        <div @click="submit('reset')"
             class="popup_default">重置</div>
        <div @click="submit"
             class="popup_active">确定</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import context from '@/service'
import AppHeader from '@/components/appHead'
import aliUpload from '@/components/aliUpload.vue'
import ailPreview from '@/components/ailPreview.vue'
import Common from '@/utils/common'
import ActionSheet from '@/components/Actionsheet'
import { Toast } from 'mint-ui'
let roterFrom = null
export default {
  name: 'Inspection',
  components: {
    AppHeader,
    ailPreview,
    aliUpload,
    ActionSheet
  },
  props: ['scrollTop'],
  computed: {

  },
  watch: {
    scrollTop (val) {
      this.scrollVal = val
    }
  },
  data () {
    return {
      tableType: '',
      popupShow: false,
      addMenu: false,
      repairStatusList: [
        { label: '全部状态', value: '', checked: true },
        { label: '使用中', value: 'USING', checked: false },
        { label: '已停用', value: 'DISABLE', checked: false }
      ],
      repairTypeList: [
        { label: '全部类型', value: '', checked: true },
        { label: '巡更', value: 'PATROL', checked: false },
        { label: '巡检', value: 'POLLING', checked: false }
      ],
      projectManagementList: [],
      currentProject: {
        projectManagementId: '',
        projectManagementName: '',
        patrolType: '',
        patrolTypelabel: '全部类型',
        useStatus: '',
        useStatuslabel: '全部状态'
      },
      // 筛选暂存区
      filterObject: {},
      currentStatus: {},
      dataReady: false,
      allLoaded: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pgSize: 15
    }
  },
  beforeRouteEnter (to, from, next) {
    roterFrom = from.name
    next()
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'index') {
      window.sessionStorage.removeItem('scrollVal')
      window.sessionStorage.removeItem('currentProject')
    }
    next()
  },
  activated () {
    this.tableType = this.$route.params.type
    if (this.tableType !== '巡更巡检') {
      this.currentProject.useStatus = 'USING'
      this.currentProject.useStatuslabel = '使用中'
    }
    if (roterFrom === 'InspectionDetails') {
      let scrollVal = window.sessionStorage.getItem('scrollVal')
      if (scrollVal) {
        this.$emit('changeScroll', scrollVal)
      }
    } else {
      window.sessionStorage.removeItem('scrollVal')
      this.$emit('changeScroll', 0)
      this.queryProjectManagement()
    }
  },
  created () {
    // this.tableType = this.$route.params.type
    // if (this.tableType !== '巡更巡检') {
    //   this.currentProject.useStatus = 'USING'
    //   this.currentProject.useStatuslabel = '使用中'
    // }
    // this.queryProjectManagement()
  },
  mounted () {
    this.$parent.$refs['content'].scrollTop = 0
  },
  methods: {
    pageGetformat (str) {
      return Common.getformat(str)
    },
    onGoBack () { // 返回
      // this.$router.go(-1)
      this.$router.replace({ name: 'index' })
    },
    async queryProjectManagement () {
      const res = await context.http.get('cms/api/project-managements', { useStatus: 'USING' })
      if (!res.data.length) {
        this.dataReady = true
        return
      }
      res.data[0].checked = true
      this.projectManagementList = res.data
      if (sessionStorage.getItem('currentProject')) {
        this.currentProject = Object.assign(this.currentProject, JSON.parse(sessionStorage.getItem('currentProject')))
      } else {
        if (res.data.length > 0) {
          this.currentProject.projectManagementId = res.data[0].id
          this.currentProject.projectManagementName = res.data[0].referred
        } else {
          Toast('数据错误')
        }
      }
      this.getMaintenanceList()
    },
    async showActionSheet () {
      this.projectManagementList = this.projectManagementList.map(item => {
        item.checked = false
        if (item.id === this.currentProject.projectManagementId) item.checked = true
        return item
      })
      this.repairStatusList = this.repairStatusList.map(item => {
        item.checked = false
        if (item.value === this.currentProject.useStatus) item.checked = true
        return item
      })
      this.repairTypeList = this.repairTypeList.map(item => {
        item.checked = false
        if (item.value === this.currentProject.patrolType) item.checked = true
        return item
      })
      this.popupShow = !this.popupShow
      this.addMenu = false
    },
    loadBottom () {
      this.currentPage++
      this.getMaintenanceList()
      this.$refs.loadmore.onBottomLoaded()
    },
    async getMaintenanceList (flag) {
      this.dataReady = false
      if (flag) this.currentPage = 1; this.allLoaded = false
      let param = {
        page: (this.currentPage - 1),
        size: this.pgSize,
        projectManagementId: this.currentProject.projectManagementId,
        patrolType: this.currentProject.patrolType,
        useStatus: this.currentProject.useStatus,
        sort: 'createdDate,desc'
      }
      let result
      // 接口区分
      if (this.tableType === '巡更巡检') {
        result = await context.http.get('cms/api/patrolInspection', param)
      } else {
        result = await context.http.get('cms/api/cmsFireControlCheckList', param)
      }
      if (this.currentPage > 1) {
        this.tableData = this.tableData.concat(result.data)
      } else {
        this.tableData = result.data
      }
      this.total = Number(result.headers['x-total-count'])
      if (this.currentPage === Math.ceil(this.total / this.pgSize) || this.currentPage > Math.ceil(this.total / this.pgSize)) {
        this.allLoaded = true// 若数据已全部获取完毕
      }
      this.dataReady = true
    },
    selectRepairStatus (index, item) {
      this.repairStatusList = this.checkedFormat(index, this.repairStatusList)
      this.filterObject.useStatus = item.value
      this.filterObject.useStatuslabel = item.label
    },
    async selectProject (index, item) {
      this.projectManagementList = this.checkedFormat(index, this.projectManagementList)
      this.filterObject.projectManagementId = item.id
      this.filterObject.projectManagementName = item.referred
    },
    selectRepairType (index, item) {
      this.repairTypeList = this.checkedFormat(index, this.repairTypeList)
      this.filterObject.patrolType = item.value
      this.filterObject.patrolTypelabel = item.label
    },
    checkedFormat (i, arr) {
      arr = arr.map(item => {
        item.checked = false
        return item
      })
      arr[i].checked = true
      return arr
    },

    async submit (state) {
      if (state === 'reset') {
        if (!this.projectManagementList.length) return
        this.projectManagementList = this.checkedFormat(0, this.projectManagementList)
        this.repairStatusList = this.checkedFormat(0, this.repairStatusList)
        this.repairTypeList = this.checkedFormat(0, this.repairTypeList)
        this.filterObject = {
          projectManagementId: '',
          projectManagementName: '',
          patrolType: '',
          patrolTypelabel: '全部类型',
          useStatus: '',
          useStatuslabel: '全部状态'
        }
        this.filterObject.projectManagementId = this.projectManagementList[0].id
        this.filterObject.projectManagementName = this.projectManagementList[0].referred
      } else {
        if (!this.projectManagementList.length) {
          this.popupShow = false
          return
        }
        this.popupShow = false
        this.currentProject = Object.assign(this.currentProject, this.filterObject)
        this.getMaintenanceList(true)
      }
      sessionStorage.setItem('currentProject', JSON.stringify(this.currentProject))
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    toDetails (id) {
      let message = `你的账号没有查看${this.tableType}详情的权限`
      if (this.tableType === '巡更巡检') {
        if (!this.hasAuthority('03050104')) {
          Toast({
            message,
            position: 'top'
          })
          return
        }
      }

      if (this.tableType !== '巡更巡检') {
        if (!this.hasAuthority('03050109')) {
          Toast({
            message,
            position: 'top'
          })
          return
        }
      }
      window.sessionStorage.setItem('scrollVal', this.scrollVal)
      window.sessionStorage.setItem('currentProject', JSON.stringify(this.currentProject))
      let type = this.tableType
      let projectId = this.currentProject.projectManagementId
      this.$router.push({ name: 'InspectionDetails', query: { id, type, projectId } })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/config";
.Inspection {
  min-height: 100%;
  background: #fff;
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
    z-index: 9;
    box-shadow: 0px 1px 4px 0px rgba(230, 230, 230, 0.5);
    .headTab {
      margin: 0 auto;
      color: #444547;
      font-size: rem(16);
      width: rem(150);
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
          margin-left: rem(60);
        }
      }
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
      width: rem(30);
      display: flex;
      position: fixed;
      right: 0;
      top: 0;
      i {
        font-size: rem(18);
        color: #444547;
        font-size: rem(18);
      }
    }
    .widthrightBtn {
      width: rem(30);
    }
    .addBtn11 {
      width: rem(80);
      height: rem(40);
      position: relative;
      i {
        font-size: rem(18);
        color: #444547;
        font-size: rem(18);
        &:last-child {
          margin-left: rem(16);
        }
      }
    }
    .selected {
      color: #0139a4;
    }
  }
  .selectResultml {
    width: 100%;
    padding: 0 rem(14);
    position: fixed;
    z-index: 9;
    left: 0;
    top: rem(40);
    background: #f0f1f2;
    font-size: rem(13);
    color: #444547;
    height: rem(28);
    line-height: rem(28);
    span {
      margin-right: rem(10);
      &:first-child {
        padding-right: rem(15);
        border-right: rem(1) solid #d8d8d8;
      }
      &:nth-child(2) {
        padding-right: rem(15);
        border-right: rem(1) solid #d8d8d8;
      }
    }
  }
  .actionsheet_wrapper {
    top: rem(41);
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-start;
      padding-top: rem(10);
    }
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
  .common_list {
    margin-top: rem(68);
    // ul {

    // }
    li {
      padding: rem(14) rem(14) rem(14) 0;
      padding-left: rem(14);
      background-color: #ffffff;
      margin-bottom: rem(10);
      position: relative;
      border-bottom: rem(1) solid #f0f0f0;
      > div {
        display: flex;
        flex-wrap: wrap;
        &:first-child {
          justify-content: space-between;
          margin-bottom: rem(8);
          font-size: rem(15);
          color: #444547;
          .shopNb {
            font-weight: bold;
            color: #18191a;
            font-size: rem(17);
          }
          .status_action {
            color: #3575f6;
            font-size: rem(15);
          }
          .status {
            color: #858c94;
            font-size: rem(15);
          }
          .shopType {
            &.weizu {
              color: #fc5159;
            }
            &.yizu {
              color: #1cc296;
            }
            &.ziyong {
              color: #444547;
            }
          }
        }
        &:nth-child(2) {
          color: #18191a;
          font-size: rem(15);
          margin-bottom: rem(8);
        }
        &:nth-child(3) {
          color: #858c94;
          font-size: rem(14);
        }
        .shopType {
          color: #858c94;
          font-size: rem(14);
        }
      }
      .postion {
        position: absolute;
        right: rem(14);
        top: 50%;
        margin-top: rem(-10);
        font-size: rem(14);
        color: #c6c6c6;
      }
      .USING {
        right: rem(32);
        top: 46%;
      }
      .bottom-div {
        display: flex;
        justify-content: space-between;
      }
    }
  }
  .addMenu {
    position: absolute;
    width: rem(100);
    background: rgba(77, 80, 84, 1);
    box-shadow: 0px 0px 11px 0px rgba(164, 164, 164, 0.36);
    border-radius: rem(4);
    top: rem(35);
    right: rem(12);
    z-index: 99;
    color: #fff;
    > p {
      height: rem(47);
      line-height: rem(47);
      text-align: center;
      font-size: rem(15);
      border-bottom: rem(1) solid #37393a;
      &:last-child {
        border-bottom: 0;
      }
    }
  }
}
</style>

