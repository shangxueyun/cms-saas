<template>
  <div class="maintainList">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="onGoBack"></i>
      <div class="headTab">
        <!-- <span @click="tabChange"
              v-if="hasAuthority('03010110')">维修管理</span> -->
        <span class="">保养列表</span>
      </div>
      <div class="addBtn widthrightBtn"
           @click="showActionSheet"
           :style="hasAuthority('03050112') ? '' : 'right: 0px;'">
        <i class="iconfont iconcms_shaixuan"></i>
      </div>
      <div class="addBtn"
           v-if="hasAuthority('03050112')"
           @click="addMaintain">
        <i class="iconfont iconcms_tianjia"></i>
      </div>
      <!-- <div class="addBtn">
        <i class="iconfont iconcms_shaixuan" @click="showActionSheet"></i>
        <i class="iconfont iconcms_tianjia" @click="showActionSheet"></i>
      </div> -->
    </div>
    <div v-if="currentProject.referred"
         @click="showActionSheet"
         class="selectResultml">
      <span>{{currentProject.referred}}</span>
      <span>{{currentStatus.label}}</span>
    </div>
    <div class="content common_list">
      <mt-loadmore ref="loadmore"
                   :bottom-method="loadBottom"
                   :autoFill="false"
                   :bottom-all-loaded="allLoaded">
        <ul>
          <li v-for="(item,index) in tableData"
              :key="index"
              @click="toDetails(item.id)">
            <div>
              <span class="shopNb">{{item.projectName}}</span>
              <span class="iconfont iconright"></span>
            </div>
            <div>
              <span class="shopType">{{item.name}}({{item.buildingName}})</span>
            </div>
            <div class="bottom-div">
              <span>{{item.repairDate}}</span>
              <span><i class="iconfont icondingwei2x"></i>{{item.installPosition}}</span>
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
        <img src="../../../assets/nores.png">
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
        <div class="popup_list">
          <p>处理状态</p>
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
    <!-- 新增 -->
    <!-- <div class="addMenu"
         v-if="addMenu">
      <p @click="addMaintain" >设备保养</p>
    </div> -->
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
  name: 'maintainList',
  props: ['scrollTop'],
  components: {
    AppHeader,
    ailPreview,
    aliUpload,
    ActionSheet
  },
  computed: {

  },
  watch: {
    scrollTop (val) {
      this.scrollVal = val
    }
  },
  data () {
    return {
      scrollVal: 0,
      tabList: ['维修', '保养'],
      tabActive: '保养',
      popupShow: false,
      addMenu: false,
      repairStatusList: [
        { 'label': '全部', value: '', checked: false },
        { 'label': '维保未完成', value: 'NO', checked: true },
        { 'label': '维保完成', value: 'COMPLETE', checked: false }
      ],
      projectManagementList: [],
      currentProject: {},
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
      window.sessionStorage.removeItem('currentProject')
      window.sessionStorage.removeItem('repairStatus')
      window.sessionStorage.removeItem('currentStatus')
      window.sessionStorage.removeItem('scrollVal')
    }
    next()
  },
  activated () {
    if (sessionStorage.getItem('currentProject')) {
      this.currentProject = JSON.parse(sessionStorage.getItem('currentProject'))
    }
    if (sessionStorage.getItem('currentStatus')) {
      this.currentStatus = JSON.parse(sessionStorage.getItem('currentStatus'))
      // sessionStorage.removeItem('currentStatus')
    } else {
      this.currentStatus = this.repairStatusList[1]
    }
    if (roterFrom === 'maintainDetails') {
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
    // if (sessionStorage.getItem('currentProject')) {
    //   this.currentProject = JSON.parse(sessionStorage.getItem('currentProject'))
    // }
    // if (sessionStorage.getItem('currentStatus')) {
    //   this.currentStatus = JSON.parse(sessionStorage.getItem('currentStatus'))
    //   // sessionStorage.removeItem('currentStatus')
    // } else {
    //   this.currentStatus = this.repairStatusList[1]
    // }
    // this.queryProjectManagement()
  },
  methods: {
    addRepairs (type) {
      sessionStorage.setItem('addType', type)
      this.$router.push({ name: 'addRepairs' })
    },
    addMaintain () {
      this.$router.push({ name: 'addMaintain' })
    },
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
        this.currentProject = JSON.parse(sessionStorage.getItem('currentProject'))
        // sessionStorage.removeItem('currentProject')
      } else {
        this.currentProject = res.data[0]
      }
      this.current = res.data[0]
      this.getMaintenanceList()
    },
    tabChange (item) {
      this.$router.replace({ name: 'repairList' })
      this.openActionsheet = false
      this.popupShow = false
      this.tabActive = item
    },
    async showActionSheet () {
      this.projectManagementList = this.projectManagementList.map(item => {
        item.checked = false
        if (item.id === this.currentProject.id) item.checked = true
        return item
      })
      this.repairStatusList = this.repairStatusList.map(item => {
        item.checked = false
        if (item.value === this.currentStatus.value) item.checked = true
        return item
      })
      this.popupShow = !this.popupShow
      this.addMenu = false
    },
    selectLi (index, item) {
      this.openActionsheet = false
      this.currentProject = item
      this.getMaintenanceList()
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
        projectId: this.currentProject.id,
        name: '',
        maintenanceClassify: 'MAINTAIN',
        repairStartDate: '',
        repairEndDate: '',
        repairStatus: this.currentStatus.value,
        sort: 'repairDate,desc'
      }
      let result = await context.http.get('cms/api/repair-records', param)
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      if (this.currentPage === Math.ceil(this.total / this.pgSize) || this.currentPage > Math.ceil(this.total / this.pgSize)) {
        this.allLoaded = true// 若数据已全部获取完毕
      }
      this.dataReady = true
    },
    selectRepairStatus (index, item) {
      this.repairStatusList = this.checkedFormat(index, this.repairStatusList)
    },
    checkedFormat (i, arr) {
      arr = arr.map(item => {
        item.checked = false
        return item
      })
      arr[i].checked = true
      return arr
    },
    async selectProject (index, item) {
      this.projectManagementList = this.checkedFormat(index, this.projectManagementList)
    },
    async submit (state) {
      if (state === 'reset') {
        if (!this.projectManagementList.length) return
        this.projectManagementList = this.checkedFormat(0, this.projectManagementList)
        this.repairStatusList = this.checkedFormat(0, this.repairStatusList)
      } else {
        if (!this.projectManagementList.length) {
          this.popupShow = false
          return
        }
        this.currentProject = this.projectManagementList.filter(item => item.checked)[0]
        this.currentStatus = this.repairStatusList.filter(item => item.checked)[0]
        this.popupShow = false
        this.getMaintenanceList(true)
      }
      window.sessionStorage.setItem('currentProject', JSON.stringify(this.currentProject))
      window.sessionStorage.setItem('currentStatus', JSON.stringify(this.currentStatus))
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    toDetails (id) {
      if (!this.hasAuthority('03050113')) {
        Toast({
          message: '你的账号没有查看保养详情的权限',
          position: 'top'
        })
        return
      }
      window.sessionStorage.setItem('currentProject', JSON.stringify(this.currentProject))
      window.sessionStorage.setItem('currentStatus', JSON.stringify(this.currentStatus))
      window.sessionStorage.setItem('scrollVal', this.scrollVal)
      this.$router.push({ name: 'maintainDetails', query: { 'id': id } })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
.maintainList {
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
      right: rem(40);
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
    padding-top: rem(68);
    ul {
      padding-left: rem(14);
    }
    li {
      padding: rem(14) rem(14) rem(14) 0;
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
          font-size: rem(13);
        }
      }
      .iconright {
        position: absolute;
        right: rem(14);
        top: 50%;
        margin-top: rem(-10);
        font-size: rem(14);
        color: #c6c6c6;
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

