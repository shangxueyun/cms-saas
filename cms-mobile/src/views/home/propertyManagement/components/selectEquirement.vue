<template>
  <div class="selectEquirement">
    <div class="head">
      <span @click="onGoBack(false)">取消</span>
      <div class="headTab">选择设备</div>
      <span class=""
            @click="onGoBack(true)">完成</span>
    </div>
    <div class="seachInput">
      <form @submit.prevent
            action="#">
        <input class="input"
               id="seachInput"
               results="5"
               focus
               placeholder="设备名称/设备编号"
               type="search"
               v-model="inputValue"
               @input="onKeyInput"
               @keyup.13="onKeyInput"
               @keypress="search" />
      </form>
      <i class="mintui mintui-search"></i>
      <div class="addBtn"
           @click="showActionSheet">
        <i class="iconfont iconcms_shaixuan"></i>
      </div>
    </div>
    <div v-if="currentProject.referred"
         class="selectResult">
      <span>{{currentProject.referred}}</span>
      <span>{{currentStatus.name}}</span>
      <span v-if="currentStatus.id">{{currentStatus_child.name}}</span>
    </div>
    <div class="content common_list ">
      <mt-loadmore ref="loadmore"
                   :bottom-method="loadBottom"
                   :autoFill="false"
                   :bottom-all-loaded="allLoaded">
        <ul>
          <li v-for="(item,index) in tableData"
              :key="index">
            <div class="common_checkBox">
              <span class="default_check"
                    v-if="!item.checked"></span>
              <img class="active_check"
                   v-else
                   src="../../../../assets/checkBox.png">
              <input type="checkbox"
                     @change="handleEearchCheck(item,index)" />
            </div>
            <div class="liInfo">
              <p class="name">{{item.name}}</p>
              <div>
                <span>{{item.code}}</span>

              </div>
              <p class="type"
                 v-if="currentProject.referred==='全部项目'">{{item.projectManagement.referred}}/{{item.equirementType.parent.name}}</p>
            </div>
            <span class="installPosition">
              <i class="iconfont icondingwei2x"></i>
              {{item.installPosition}}
            </span>
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
                :key="index"
                @click="selectProject(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.referred }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>设备大类</p>
          <ul>
            <li v-for="(item, index) in equirementTypes"
                :key="index"
                @click="selectStatus(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list"
             v-if="equirementTypes_child.length">
          <p>设备小类</p>
          <ul>
            <li v-for="(item, index) in equirementTypes_child"
                :key="index"
                @click="selectStatus_child(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.name }}</span>
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
// import AppHeader from '@/components/appHead'
import * as JSOG from 'jsog'
import context from '@/service'
import { toLocaleFixed } from '@/utils/validate.js'
import Vue from 'vue'
import { Popup } from 'vant'
import { Toast } from 'mint-ui'
Vue.use(Popup)
let roterFrom = null
export default {
  name: 'selectEquirement',
  footVisible: true,
  components: {},
  watch: {
  },
  data () {
    return {
      inputValue: '',
      flag: true,
      shadeBox: false,
      popupShow: false,
      projectManagementList: [],
      currentProject: {},
      currentStatus: {},
      currentStatus_child: {},
      onRent: null,
      dataReady: false,
      allLoaded: false,
      equirementTypes: [],
      equirementTypes_child: [],
      tableData: [],
      total: 0,
      currentPage: 1,
      pgSize: 15
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'addRepairs' || from.name === 'addMaintain') {
      roterFrom = from.name
    }
    next()
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  created () {
    this.getEquirementTypes()
    this.queryProjectManagement()
  },
  beforeDestroy () {
  },
  mounted () {

  },
  methods: {
    onGoBack (flag) { // 返回新增报修单
      let selectItem = null
      if (flag) {
        selectItem = this.tableData.filter(item => {
          return item.checked
        })[0]
        if (!selectItem) {
          Toast({
            message: '请选择设备',
            position: 'top'
          })
          return
        }
        sessionStorage.setItem('selectItem', JSON.stringify(selectItem))
      } else {

      }
      this.$router.push({ name: roterFrom })
    },
    handleEearchCheck (item, index) {
      this.tableData = this.tableData.map((itm, idx) => {
        if (idx === index) {
          itm.checked = true
        } else {
          itm.checked = false
        }
        return itm
      })
    },
    query (flag) {
      let id = null
      if (this.currentStatus.id) {
        id = this.currentStatus_child.id
      }
      this.dataReady = false
      if (flag) this.currentPage = 1; this.allLoaded = false
      context.http.get('cms/api/equirements', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'id,desc',
        projectManagementId: this.currentProject.id,
        // equirementTypeId: this.currentStatus.id,
        equirementTypeChildId: id,
        title: this.inputValue
      }).then(res => {
        this.dataReady = true
        res.data = JSOG.decode(res.data)
        res.data = res.data.map(item => {
          item.checked = false
          return item
        })
        if (flag) {
          this.tableData = res.data
        } else {
          this.tableData = this.tableData.concat(res.data)
        }
        this.$forceUpdate()
        this.total = Number(res.headers['x-total-count'])
        if (this.currentPage === Math.ceil(this.total / this.pgSize) || this.currentPage > Math.ceil(this.total / this.pgSize)) {
          this.allLoaded = true// 若数据已全部获取完毕
          console.log('全部获取完毕')
        }
      })
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    loadBottom () {
      this.currentPage++
      this.query()
      this.$refs.loadmore.onBottomLoaded()
    },
    onKeyInput (event) { // 输入
      if (event.keyCode !== 13 && this.flag) {
        this.currentPage = 0
        // this.tableData = []
        this.$nextTick(() => {
          this.query(true)
        })
      }
    },
    compositions (flag) {
      this.flag = flag
    },
    search (event) { // 键盘完成事件
      if (event.keyCode === 13) {
        event.preventDefault() // 禁止默认事件（默认是换行）
        this.inputValue = event.target.value
        this.currentPage = 0
        this.tableData = []
        this.query(true)
      }
    },
    toContacts () { // 取消
      this.focus = false
      this.shadeBox = false
      this.inputValue = ''
      this.currentPage = 0
      this.tableData = []
      this.query(true)
    },
    async queryProjectManagement () {
      const res = await context.http.get('cms/api/project-managements', { useStatus: 'USING' })
      if (!res.data.length) {
        this.dataReady = true
        return
      }
      res.data.unshift({ id: null, referred: '全部项目', checked: true })
      this.projectManagementList = res.data
      this.currentProject = res.data[0]
      this.query()
    },
    async getEquirementTypes () { // 请求设备大小类
      let result = await context.http.get('cms/api/equirementTypes/tree')
      result.data.unshift({ id: null, name: '全部', checked: true })
      this.equirementTypes = result.data
      this.currentStatus = result.data[0]
      // debugger
      // this.equirementTypes_child = result.data[0].child
      // this.currentStatus_child = this.equirementTypes_child[0]
    },
    async selectProject (index, item) {
      this.projectManagementList = this.checkedFormat(index, this.projectManagementList)
    },
    selectStatus (index, item) {
      this.equirementTypes = this.checkedFormat(index, this.equirementTypes)
      if (index === 0) {
        // this.buildingList = this.checkedFormat(0, this.buildingList)
        this.equirementTypes_child = []
        // this.equirementTypes_child[0].checked = true
        // this.currentStatus_child = { id: '', name: '' }
      } else {
        this.equirementTypes_child = item.child
        this.equirementTypes_child = this.checkedFormat(0, this.equirementTypes_child)
        // this.equirementTypes_child[0].checked = true
        // this.currentStatus_child = this.equirementTypes_child[0] ? this.equirementTypes_child[0] : {}
      }
      // this.equirementTypes = this.checkedFormat(index, this.equirementTypes)
    },
    selectStatus_child (index, item) {
      this.equirementTypes_child = this.checkedFormat(index, this.equirementTypes_child)
    },
    checkedFormat (i, arr) {
      arr = arr.map(item => {
        item.checked = false
        return item
      })
      arr[i].checked = true
      return arr
    },
    async showActionSheet () {
      if (!this.currentProject.id) {
        this.popupShow = !this.popupShow
        return
      }
      let childEquirementTypes = []
      // 项目
      this.projectManagementList = this.projectManagementList.map(item => {
        item.checked = false
        if (item.id === this.currentProject.id) item.checked = true
        return item
      })
      this.equirementTypes = this.equirementTypes.map(item => {
        item.checked = false
        if (item.id === this.currentStatus.id) {
          item.checked = true
          childEquirementTypes = item.child || []
        }
        return item
      })
      if (childEquirementTypes.length) {
        this.equirementTypes_child = childEquirementTypes.map(item => {
          item.checked = false
          if (item.id === this.currentStatus_child.id) item.checked = true
          return item
        })
      }

      this.popupShow = !this.popupShow
    },
    async submit (state) {
      if (state === 'reset') {
        if (!this.projectManagementList.length) return
        this.projectManagementList = this.checkedFormat(0, this.projectManagementList)
        this.equirementTypes = this.checkedFormat(0, this.equirementTypes)
        this.equirementTypes_child = []
        // this.currentStatus_child = {}
      } else {
        if (!this.projectManagementList.length) {
          this.popupShow = false
          return
        }
        this.currentProject = this.projectManagementList.filter(item => item.checked)[0]
        this.currentStatus = this.equirementTypes.filter(item => item.checked)[0]
        this.currentStatus_child = this.equirementTypes_child.filter(item => item.checked)[0]
        this.query(true)
        this.popupShow = false
      }
    }
  }
}
</script>
<style scoped lang="scss" >
@import "../../../../style/config";
.selectEquirement {
  .common_list {
    padding-top: rem(118);
    li {
      padding: rem(14);
      background-color: #ffffff;
      margin-bottom: rem(10);
      position: relative;
      display: flex;
      align-items: center;
      .liInfo {
        padding-left: rem(15);
        flex: 1;
        > p {
          color: #444547;
          font-size: rem(14);
          &.name {
            font-size: rem(15);
            color: #18191a;
            font-weight: bold;
            margin-bottom: rem(10);
            white-space: nowrap;
            text-overflow: ellipsis;
            width: rem(200);
            overflow: hidden;
          }
          &.type {
          }
        }
        > div {
          display: flex;
          justify-content: space-between;
          margin-bottom: rem(5);
          white-space: nowrap;
          text-overflow: ellipsis;
          width: rem(200);
          overflow: hidden;
        }
      }
      > .installPosition {
        color: #858c94;
        width: rem(120);
        padding-left: rem(14);
        text-align: right;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .iconright {
        position: absolute;
        right: rem(14);
        top: 50%;
        margin-top: rem(-10);
        font-size: rem(14);
        color: #c6c6c6;
      }
    }
  }
  .seachInput {
    height: $foot-height;
    width: 100%;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    padding: 0 rem(15);
    position: fixed;
    top: rem(40);
    z-index: 3;
    justify-content: space-between;
    .addBtn {
      .iconfont {
        font-size: rem(20);
        color: #444547;
      }
    }
    #seachInput::-webkit-search-cancel-button {
      display: none;
    }
    .mintui-search {
      position: absolute;
      left: rem(20);
      top: rem(18);
      color: #666666;
    }
    .input {
      // width: rem(300);
      width: rem(310);
      height: rem(30);
      background: rgba(244, 244, 244, 1);
      border-radius: rem(2);
      padding-left: rem(25);
      font-size: rem(13);
    }
    .cannelBtn {
      color: #0139a4;
      font-size: rem(15);
      margin-left: rem(10);
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
    font-size: rem(15);
    background: #fff;
    display: flex;
    justify-content: space-between;
    z-index: 9;
    padding: 0 rem(14);
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
    > span {
      &:first-child {
        color: #686868;
      }
      &:last-child {
        color: #0139a4;
      }
    }
  }
  .selectResult {
    width: 100%;
    padding: 0 rem(14);
    position: fixed;
    z-index: 2;
    left: 0;
    top: rem(90);
    background: #f0f1f2;
    font-size: rem(13);
    color: #444547;
    height: rem(28);
    line-height: rem(28);
    overflow-x: auto;
    white-space: nowrap;
    span {
      padding-right: rem(15);
      &:not(:last-child) {
        border-right: 0.025rem solid #d8d8d8;
      }
      &:not(:first-child) {
        margin-left: rem(14);
      }
    }
  }
}
</style>
