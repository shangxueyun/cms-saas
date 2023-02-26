<template>
  <div class="repairList"
       @click="addMenu=false">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="onGoBack"></i>
      <div class="headTab">
        报修信息
      </div>
      <div class="addBtn widthrightBtn"
           @click="showActionSheet">
        <i class="iconfont iconcms_shaixuan"></i>
      </div>
      <div class="addBtn"
           v-if="hasAuthority('02030201')"
           @click.stop="addMenu=!addMenu">
        <i class="iconfont iconcms_tianjia"></i>
      </div>
    </div>
    <div class="seachInput">
      <form @submit.prevent
            action="#">
        <input class="input"
               id="seachInput"
               results="5"
               focus
               @compositionstart="compositions(false)"
               @compositionend="compositions(true)"
               placeholder="设备名称/房源名称"
               type="search"
               v-model="inputValue"
               @input="onKeyInput"
               @keyup.13="onKeyInput"
               @keypress="search" />
      </form>
      <i class="mintui mintui-search"></i>
    </div>
    <div class="title"
         @click="showActionSheet"><span>{{currentProject.referred}}</span><span>{{repairStatus.label}}</span></div>
    <div class="container">
      <ul v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loadBottom"
          infinite-scroll-distance="20"
          infinite-scroll-immediate-check="false"
          v-if="tableData.length"
          class="list">
        <li v-for="(item, index) in tableData"
            @click="goDetails(item)"
            :key="index">
          <p>
            <span>{{item.projectName}}</span>
            <span :class="item.repairStatus">{{formatRepairStatus(item.repairStatus)}}</span>
          </p>
          <div>
            <p>{{formatterName(item)}}（{{formatRoomsName(item)}}）</p>
            <p>报修时间：{{item.reportTime.replace('T', ' ')}}</p>
          </div>
          <span class="iconfont iconright"></span>
        </li>
      </ul>
      <div class="loadAll"
           v-if="loadAll && tableData.length!==0">
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
    <!-- 新增 -->
    <div class="addMenu"
         v-if="addMenu">
      <p @click="addRepairs('ROOMS')">房源报修</p>
      <p @click="addRepairs('EQUIREMENT')">设备报修</p>
      <p @click="addRepairs('BUILDING')">其他报修</p>
      <!-- <p @click="addMaintain"
         v-if="hasAuthority('03010115')">设备保养</p> -->
    </div>
  </div>
</template>
<script>
import AppHeader from '@/components/appHead'
import context from '@/service'
import { InfiniteScroll, Toast } from 'mint-ui'
let roterFrom = null
export default {
  name: 'repairList',
  props: ['scrollTop'],
  components: { AppHeader, InfiniteScroll },
  watch: {
    scrollTop (val) {
      this.scrollVal = val
    }
  },
  data () {
    return {
      scrollVal: 0,
      inputValue: '',
      projectManagementList: [],
      currentProject: {},
      repairStatusList: [
        {
          label: '全部状态',
          value: ''
        },
        {
          label: '待处理',
          value: 'REFERED'
        },
        {
          label: '处理中',
          value: 'WAIT'
        },
        {
          label: '已处理',
          value: 'OVER'
        }
      ],
      repairStatus: {
        label: '待处理',
        value: 'REFERED'
      },
      flag: true,
      page: 0,
      size: 10,
      loadBottom: false,
      tableData: [],
      dataReady: false,
      loadAll: false,
      popupShow: false,
      addMenu: false
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
      window.sessionStorage.removeItem('repairStatus')
      window.sessionStorage.removeItem('currentStatus')
    }
    next()
  },
  activated () {
    if (sessionStorage.getItem('currentProject')) {
      this.currentProject = JSON.parse(sessionStorage.getItem('currentProject'))
    }
    if (sessionStorage.getItem('repairStatus')) {
      this.repairStatus = JSON.parse(sessionStorage.getItem('repairStatus'))
    }
    if (roterFrom === 'repairDetails') {
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
    // this.queryProjectManagement()
  },
  mounted () {
  },
  methods: {
    formatRepairStatus (repairStatus) {
      switch (repairStatus) {
        case 'REFERED':
          return '待处理'
        case 'WAIT':
          return '处理中'
        case 'OVER':
          return '已处理'
        case 'COMPLETE':
          return '已处理'
        case 'NO':
          return '处理中'
      }
    },
    compositions (flag) {
      this.flag = flag
    },
    onKeyInput (event) { // 输入
      if (event.keyCode !== 13 && this.flag) {
        this.tableData = []
        this.$nextTick(() => {
          this.query()
        })
      }
    },
    search (event) { // 键盘完成事件
      if (event.keyCode === 13) {
        event.preventDefault() // 禁止默认事件（默认是换行）
        this.inputValue = event.target.value
        this.page = 0
        this.tableData = []
        this.query()
      }
    },
    addRepairs (type) {
      sessionStorage.setItem('addType', type)
      sessionStorage.removeItem('addRepairsData')
      this.$router.push({ name: 'addRepairs' })
    },
    addMaintain () {
      this.$router.push({ name: 'addMaintain' })
    },
    onGoBack () {
      // this.$router.go(-1)
      window.sessionStorage.removeItem('scrollVal')
      this.$router.replace({ name: 'index' })
    },
    tabChange () {
      this.$router.replace({ name: 'maintainList' })
    },
    async queryProjectManagement () {
      const res = await context.http.get('cms/api/project-managements', { useStatus: 'USING' })
      res.data[0].checked = true
      this.projectManagementList = res.data
      if (sessionStorage.getItem('currentProject')) {
        this.currentProject = JSON.parse(sessionStorage.getItem('currentProject'))
        // sessionStorage.removeItem('currentProject')
      } else {
        this.currentProject = res.data[0]
      }
      this.query()
    },
    showActionSheet () {
      this.projectManagementList = this.projectManagementList.map(item => {
        item.checked = false
        if (item.id === this.currentProject.id) item.checked = true
        return item
      })
      this.repairStatusList = this.repairStatusList.map(item => {
        item.checked = false
        if (item.value === this.repairStatus.value) item.checked = true
        return item
      })
      this.popupShow = !this.popupShow
    },
    selectProject (index, item) {
      this.projectManagementList = this.checkedFormat(index, this.projectManagementList)
    },
    selectRepairStatus (index, item) {
      this.repairStatusList = this.checkedFormat(index, this.repairStatusList)
    },
    async query (flag) {
      this.dataReady = false
      this.loadAll = false
      if (!flag) {
        this.page = 0
      }
      let param = { projectId: this.currentProject.id, status: this.repairStatus.value, name: this.inputValue, page: this.page, size: this.size, sort: 'repairFormCode,desc' }
      if (param.status === '') delete param.status
      let result = await context.http.get(`cms/api/repair-forms`, param)
      if (result.status === 200) {
        this.dataReady = true
        if (flag) { // 加载更多
          this.tableData = this.tableData.concat(result.data)
        } else {
          this.tableData = result.data
        }
        if (this.tableData.length === Number(result.headers['x-total-count'])) this.loadAll = true
        if (result.data.length > 0) {
          this.loadBottom = false
          this.page = this.page + 1
        } else {
          this.page = this.page - 1
        }
      }
    },
    async submit (state) {
      if (state === 'reset') {
        if (!this.projectManagementList.length) return
        this.projectManagementList = this.checkedFormat(0, this.projectManagementList)
        this.repairStatusList = this.checkedFormat(1, this.repairStatusList)
      } else {
        if (!this.projectManagementList.length) {
          this.popupShow = false
          return
        }
        this.currentProject = this.projectManagementList.filter(item => item.checked)[0]
        this.repairStatus = this.repairStatusList.filter(item => item.checked)[0]
        this.page = 0
        this.tableData = []
        this.query()
        this.popupShow = false
      }
      sessionStorage.setItem('currentProject', JSON.stringify(this.currentProject))
      sessionStorage.setItem('repairStatus', JSON.stringify(this.repairStatus))
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    goDetails (item) {
      if (!this.hasAuthority('02030202')) {
        Toast({
          message: '你的账号没有查看报修详情的权限',
          position: 'top'
        })
        return
      }
      window.sessionStorage.setItem('scrollVal', this.scrollVal)
      window.sessionStorage.setItem('currentProject', JSON.stringify(this.currentProject))
      window.sessionStorage.setItem('repairStatus', JSON.stringify(this.repairStatus))
      this.$router.push({ name: 'repairDetails', query: { 'repairId': item.id } })
    },
    loadMore () {
      this.loadBottom = true
      this.query(true)
    },
    checkedFormat (i, arr) {
      arr = arr.map(item => {
        item.checked = false
        return item
      })
      arr[i].checked = true
      return arr
    },
    formatRoomsName (row) {
      if (row.repairPosition) {
        return row.repairPosition
      } else {
        if (row.roomsName) {
          return row.roomsName
        } else {
          return row.equirementNo
        }
      }
    },
    formatterName (row) {
      if (row.repairType === 'BUILDING') {
        return '其他'
      } else {
        return row.name
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/config";
.repairList {
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
      right: 40px;
    }
    .selected {
      color: #0139a4;
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
  .selectedBtn {
    padding-left: rem(8);
    font-size: rem(18);
    color: #444547;
  }
  .selected {
    color: #0139a4;
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
  .title {
    width: 100%;
    position: fixed;
    left: 0;
    top: rem(90);
    height: rem(30);
    line-height: rem(30);
    padding: 0 rem(14);
    font-size: rem(13);
    color: #444547;
    z-index: 1;
    background: #f8f9fa;
    > span {
      border-right: rem(1) solid #d8d8d8;
      margin-left: rem(15);
      padding-right: rem(15);
    }
    > span:last-child {
      border-right: 0;
    }
    > span:first-child {
      margin-left: 0;
    }
  }
  .container {
    padding-top: rem(120);
    background: #fff;
    .loadAll {
      padding-top: rem(14);
    }
    .list {
      padding-left: rem(14);
      li {
        padding: rem(14) rem(14) rem(14) 0;
        position: relative;
        border-bottom: rem(1) solid #f0f0f0;
        background: #fff;
        > p {
          display: flex;
          width: 100%;
          justify-content: space-between;
          > span {
            display: block;
            line-height: rem(20);
            color: #858c94;
            font-size: rem(15);
            width: rem(90);
            text-align: right;
            &.WAIT {
              color: #1cc296;
            }
            &.REFERED {
              color: #3575f6;
            }
            &.OVER {
              color: #858c94;
            }
            &.COMPLETE {
              color: #858c94;
            }
            &.NO {
              color: #1cc296;
            }
          }
          > span:first-child {
            text-align: left;
            flex: 1;
            color: #18191a;
            font-weight: 600;
            font-size: rem(17);
            line-height: rem(24);
            margin-bottom: rem(7);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-right: rem(5);
          }
        }
        > div {
          > p {
            color: #18191a;
            font-size: rem(15);
            margin-bottom: rem(5);
            line-height: rem(21);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 96%;
            &:last-child {
              margin-bottom: 0;
            }
            span {
              color: #858c94;
            }
          }
          > p:last-child {
            line-height: rem(18);
            color: #858c94;
            font-size: rem(13);
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
  }
}
</style>
