<template>
  <div class="classes"
       @click="addMenu=false">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="onGoBack"></i>
      <div class="headTab">班次信息</div>
      <div class="addBtn widthrightBtn"
           @click="showActionSheet">
        <i class="iconfont iconcms_shaixuan"></i>
      </div>
    </div>
    <div class="seachInput">
      <form @submit.prevent
            action="#">
        <input class="input"
               id="seachInput"
               results="5"
               focus
               placeholder="班次名称"
               type="search"
               v-model="inputValue"
               @input="onKeyInput"
               @keyup.13="onKeyInput"
               @keypress="search" />
      </form>
      <i class="mintui mintui-search"></i>
    </div>
    <div class="title">
      <div @click="showActionSheet">
        <span>{{currentProject.referred}}</span><span>{{currentStatus.label}}</span><span>{{defaultStatus.label}}</span>
      </div>
    </div>
    <div class="container">
      <ul v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loadBottom"
          infinite-scroll-distance="20"
          infinite-scroll-immediate-check="false"
          v-if="tableData.length"
          class="list">
        <li v-for="(item, index) in tableData"
            :key="index">
          <p>
            <span>{{item.projectName}}</span>
          </p>
          <div>
            <p>岗位名称：{{item.postName}}</p>
            <p>班次名称：{{item.planName}}</p>
            <p>工作时间：{{item.startTime}} ~ {{item.endTime}}</p>
            <p>状态：<span>{{item.useStatus}}</span></p>

          </div>
          <!-- <span class="iconfont iconright"></span> -->
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
          <p>岗位名称</p>
          <ul>
            <li v-for="(item, index) in securityType"
                :key="item.value"
                @click="selectRepairStatus(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>状态</p>
          <ul>
            <li v-for="(item, index) in statusList"
                :key="item.value"
                @click="selectStatus(index, item)"
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
import AppHeader from '@/components/appHead'
import changWeely from '@/components/changeWeely.vue'
import moment from 'moment'
import context from '@/service'
import { InfiniteScroll, Toast } from 'mint-ui'
export default {
  name: 'classes',
  components: { AppHeader, InfiniteScroll, changWeely },
  data () {
    return {
      inputValue: '',
      defaults: new Date(),
      weelyShow: false,
      valDate: '',
      weekdate: '',
      title: '保安保洁',
      projectManagementList: [],
      securityType: [
        {
          label: '保安',
          value: 'GUARD'
        },
        {
          label: '保洁',
          value: 'CLEANER'
        }
      ],
      statusList: [
        {
          label: '全部状态',
          value: ''
        }, {
          label: '使用中',
          value: 'USING'
        }, {
          label: '已停用',
          value: 'DISABLE'
        }
      ],
      currentProject: {},
      currentStatus: {
        label: '保安',
        value: 'GUARD'
      },
      defaultStatus: {
        label: '使用中',
        value: 'USING'
      },
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
  created () {
    if (sessionStorage.getItem('currentProject')) {
      this.currentProject = JSON.parse(sessionStorage.getItem('currentProject'))
    }
    if (sessionStorage.getItem('currentStatus')) {
      this.currentStatus = JSON.parse(sessionStorage.getItem('currentStatus'))
    }
    this.queryProjectManagement()
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'index') {
      sessionStorage.removeItem('currentProject')
      sessionStorage.removeItem('currentStatus')
      sessionStorage.removeItem('currentStatus')
    }
    next()
  },
  mounted () {
  },
  methods: {
    onKeyInput (event) { // 输入
      this.tableData = []
      this.$nextTick(() => {
        this.query()
      })
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
    async query () {
      this.dataReady = false
      this.loadAll = false
      let param = {
        projectId: this.currentProject.id,
        post: this.currentStatus.value,
        name: this.inputValue,
        useStatus: this.defaultStatus.value
      }
      let result = await context.http.get(`cms/api/gcplan`, param)
      if (result.status === 200) {
        this.dataReady = true
        this.tableData = result.data
        this.loadAll = true
      }
    },
    onGoBack () {
      // this.$router.go(-1)
      this.$router.replace({ name: 'workingSchedule' })
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
      this.securityType = this.securityType.map(item => {
        item.checked = false
        if (item.value === this.currentStatus.value) item.checked = true
        return item
      })
      this.statusList = this.statusList.map(item => {
        item.checked = false
        if (item.value === this.defaultStatus.value) item.checked = true
        return item
      })
      this.popupShow = !this.popupShow
    },
    selectProject (index, item) {
      this.projectManagementList = this.checkedFormat(index, this.projectManagementList)
    },
    selectRepairStatus (index, item) {
      this.securityType = this.checkedFormat(index, this.securityType)
    },
    selectStatus (index, item) {
      this.statusList = this.checkedFormat(index, this.statusList)
    },
    async submit (state) {
      if (state === 'reset') {
        if (!this.projectManagementList.length) return
        this.projectManagementList = this.checkedFormat(0, this.projectManagementList)
        this.securityType = this.checkedFormat(0, this.securityType)
        this.statusList = this.checkedFormat(1, this.statusList)
      } else {
        if (!this.projectManagementList.length) {
          this.popupShow = false
          return
        }
        this.currentProject = this.projectManagementList.filter(item => item.checked)[0]
        this.currentStatus = this.securityType.filter(item => item.checked)[0]
        this.defaultStatus = this.statusList.filter(item => item.checked)[0]
        this.tableData = []
        this.query()
        this.popupShow = false
      }
      // sessionStorage.setItem('currentProject', JSON.stringify(this.currentProject))
      // sessionStorage.setItem('currentStatus', JSON.stringify(this.currentStatus))
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    loadMore () {
      this.loadBottom = true
      // this.query()
    },
    checkedFormat (i, arr) {
      arr = arr.map(item => {
        item.checked = false
        return item
      })
      arr[i].checked = true
      return arr
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/config";
.classes {
  min-height: 100%;
  // background: #fff;
  .popup_common {
    .weekPicker {
      width: rem(260);
      height: rem(30);
      line-height: rem(30);
      padding-left: rem(15);
      border-bottom: rem(2) solid #0139a4;
      font-size: rem(15);
      color: #0139a4;
    }
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
    z-index: 9;
    box-shadow: 0px 1px 4px 0px rgba(230, 230, 230, 0.5);
    .headTab {
      margin: 0 auto;
      color: #444547;
      font-size: rem(16);
      // width: rem(150);
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
      right: rem(0);
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
    height: rem(40);
    padding: 0 rem(14);
    font-size: rem(13);
    color: #444547;
    z-index: 1;
    background: #f8f9fa;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div {
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
    > .detailsBtn {
      width: rem(68);
      height: rem(22);
      line-height: rem(22);
      background: #eff6ff;
      border-radius: rem(2);
      border: rem(1) solid #3575f6;
      color: #0139a4;
      text-align: center;
    }
  }
  .container {
    padding-top: rem(130);
    // background: #fff;
    .loadAll {
      padding-top: rem(14);
    }
    .list {
      li {
        padding: rem(14);
        position: relative;
        // border-bottom: rem(1) solid #f0f0f0;
        margin-bottom: rem(10);
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
          font-size: rem(14);
          color: #858c94;
          > p:last-child {
            span {
              color: #3575f6;
            }
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
