<template>
  <div class="personList"
       @click="addMenu=false">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="onGoBack"></i>
      <div class="headTab">
        <span @click="tabChange"
              v-if="hasAuthority('03070101')">排班表</span>
        <span class="active"
              v-if="hasAuthority('03070105')">人员列表</span>
      </div>
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
               placeholder="姓名"
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
      <mt-loadmore ref="loadmore"
                   :bottom-method="loadBottom"
                   :autoFill="false"
                   :bottom-all-loaded="allLoaded">
        <ul v-if="tableData.length"
            class="list">
          <li v-for="(item, index) in tableData"
              @click="toDetails(item.id)"
              :key="index">
            <p>
              <span>{{item.name}}</span>
              <span>{{item.jobStatus==='ONJOB'?'在职':'离职'}}</span>
            </p>
            <div>
              <p>工号：{{item.code}}</p>
              <p>岗位名称：{{positionFormatter(item.position)}}</p>
              <p>联系方式：{{item.telephone}}</p>
            </div>
            <span class="iconfont iconright"></span>
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
let roterFrom = null
export default {
  name: 'personList',
  props: ['scrollTop'],
  components: { AppHeader, InfiniteScroll, changWeely },
  watch: {
    scrollTop (val) {
      this.scrollVal = val
    }
  },
  data () {
    return {
      scrollVal: 0,
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
          label: '在职',
          value: 'ONJOB'
        }, {
          label: '离职',
          value: 'RESIGNA'
        }
      ],
      currentProject: {},
      currentStatus: {
        label: '保安',
        value: 'GUARD'
      },
      defaultStatus: {
        label: '在职',
        value: 'ONJOB'
      },
      total: 0,
      currentPage: 1,
      pgSize: 15,
      tableData: [],
      dataReady: false,
      allLoaded: false,
      flag: true,
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
      sessionStorage.removeItem('currentProject')
      sessionStorage.removeItem('currentStatus')
      sessionStorage.removeItem('defaultStatus')
    }
    next()
  },
  activated () {
    if (sessionStorage.getItem('currentProject')) {
      this.currentProject = JSON.parse(sessionStorage.getItem('currentProject'))
    }
    if (sessionStorage.getItem('currentStatus')) {
      this.currentStatus = JSON.parse(sessionStorage.getItem('currentStatus'))
    }
    if (sessionStorage.getItem('defaultStatus')) {
      this.defaultStatus = JSON.parse(sessionStorage.getItem('defaultStatus'))
    }
    if (roterFrom === 'personDetails') {
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
    // }
    // if (sessionStorage.getItem('defaultStatus')) {
    //   this.defaultStatus = JSON.parse(sessionStorage.getItem('defaultStatus'))
    // }
    // this.queryProjectManagement()
  },
  mounted () {
  },
  methods: {
    toDetails (id) {
      if (this.hasAuthority('03070107')) {
        window.sessionStorage.setItem('scrollVal', this.scrollVal)
        this.$router.replace({ name: 'personDetails', params: { 'id': id } })
      } else {
        Toast({
          message: '你的账号没有查看人员详情的权限',
          position: 'top'
        })
      }
    },
    positionFormatter (p) {
      switch (p) {
        case 'GUARD':
          return '保安'
        case 'CLEANER':
          return '保洁'
      }
    },
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
    loadBottom () {
      this.currentPage++
      this.query(true)
      this.$refs.loadmore.onBottomLoaded()
    },
    async query (flag) {
      this.dataReady = false
      let param = {
        page: (this.currentPage - 1),
        size: this.pgSize,
        projectManagementId: this.currentProject.id,
        position: this.currentStatus.value,
        name: this.inputValue,
        jobStatus: this.defaultStatus.value,
        sort: 'lastModifiedDate,desc'
      }
      let result = await context.http.get(`cms/api/guardCleaner`, param)
      if (result.status === 200) {
        this.dataReady = true
        if (!flag) {
          this.tableData = result.data
        } else {
          this.tableData = this.tableData.concat(result.data)
        }
        this.total = Number(result.headers['x-total-count'])
        if (this.currentPage === Math.ceil(this.total / this.pgSize) || this.currentPage > Math.ceil(this.total / this.pgSize)) {
          this.allLoaded = true// 若数据已全部获取完毕
          console.log('全部获取完毕')
        }
      }
    },
    onGoBack () {
      // this.$router.go(-1)
      this.$router.replace({ name: 'index' })
    },
    tabChange () {
      this.$router.replace({ name: 'workingSchedule' })
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
      sessionStorage.setItem('currentProject', JSON.stringify(this.currentProject))
      sessionStorage.setItem('currentStatus', JSON.stringify(this.currentStatus))
      sessionStorage.setItem('defaultStatus', JSON.stringify(this.defaultStatus))
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
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
.personList {
  min-height: 100%;
  background: #fff;
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
          top: rem(55);
          font-size: rem(17);
          color: #c6c6c6;
        }
      }
    }
  }
}
</style>
