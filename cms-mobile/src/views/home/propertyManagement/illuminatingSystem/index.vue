<template>
  <div class="illuminatingSystem"
       :class="''"
       @click="addMenu=false">
    <div style="background:#fff;position: fixed;width: 100%;z-index: 11;">
      <div class="head">
        <i class="back mintui mintui-back"
           @click="onGoBack"></i>
        <div class="title">照明系统</div>
        <div class="addBtn widthrightBtn"
             @click="showActionSheet">
          <i class="iconfont iconcms_shaixuan"></i>
        </div>
        <div class="addBtn"
             v-if="tableType == 1 && hasAuthority('03080107')"
             @click="addBtn">
          <i class="iconfont iconcms_tianjia"></i>
        </div>
        <div class="addBtn"
             v-if="tableType == 2 && hasAuthority('03080112')"
             @click="addBtn">
          <i class="iconfont iconcms_tianjia"></i>
        </div>
      </div>
      <div class="headTab">
        <span @click="tabSwi(1)"
              v-if="hasAuthority('03080106')"
              :class="tableType == 1 ? 'active' : ''">回路</span>
        <span @click="tabSwi(2)"
              v-if="hasAuthority('03080111')"
              :class="tableType == 2 ? 'active' : ''">群组</span>
        <span @click="tabSwi(3)"
              v-if="hasAuthority('03080121')"
              :class="tableType == 3 ? 'active' : ''">照明计划</span>
      </div>
      <div @click="showActionSheet"
           class="selectResultml">
        <span :style="tableType == 3 ? 'border-right: none' : ''">{{currentProject.projectManagementName}}</span>
        <template v-if="tableType == 1 || tableType == 2">
          <!-- 类型一二字段群组 -->
          <span v-if="tableType == 1">{{currentProject.grouplabel}}</span>
          <!-- 类型二二字段照明计划 -->
          <span v-if="tableType == 2"
                style="border-right: none">{{currentProject.lightingPlanlabel}}</span>
        </template>
        <span v-if="tableType == 1"
              style="border-right: none">{{currentProject.onOfflabel}}</span>
      </div>
    </div>

    <!-- 中间部分切换 -->
    <div v-if="componentBle"
         class="paddingTop">
      <component :is="currentTabComponent"
                 :scrollVal="scrollVal"
                 :config="projectConfig"
                 :filter="currentProject"
                 @RouteParamsC="RouteParamsC"
                 :ref="currentTabComponent" />
    </div>

    <!-- 右侧筛选 -->
    <van-popup v-model="popupShow"
               class="popup_common"
               @closed="popupShowClosed"
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
        <!-- <div v-if="tableType == 1" class="popup_list">
          <p>楼宇</p>
          <ul>
            <li v-for="(item, index) in buildingList"
                :key="item.value"
                @click="selectRepairType(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.buildingName }}</span>
            </li>
          </ul>
        </div> -->
        <div v-if="tableType == 1"
             class="popup_list">
          <p>群组</p>
          <ul>
            <li v-for="(item, index) in GroupList"
                :key="item.value"
                @click="selectGroupList(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </div>
        <div v-if="tableType == 2"
             class="popup_list">
          <p>照明计划</p>
          <ul>
            <li v-for="(item, index) in lightingPlanList"
                :key="item.value"
                @click="selectlightingPlan(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </div>
        <div v-if="tableType == 1"
             class="popup_list">
          <p>开关状态</p>
          <ul>
            <li v-for="(item, index) in onOffList"
                :key="item.value"
                @click="selectonOff(index, item)"
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
import { Loadmore } from 'mint-ui'
import context from '@/service'
import loop from './loop'
import group from './group'
import lightingplan from './lightingPlan'
let roterFrom = null
export default {
  name: 'messageCenter',
  footVisible: true,
  props: ['scrollTop'],
  components: { loop, group, lightingplan, Loadmore },
  watch: {
    scrollTop (val) {
      this.scrollVal = val
      // console.log(val, this.scrollTop)
      // // this.pageTop = val
      this.addMenu = false
      if (val > 0) {
        this.scrolling = true
      } else {
        this.scrolling = false
      }
    }
  },
  data () {
    return {
      scrollVal: 0,
      scrolling: false,
      tableType: 1,
      componentBle: false,
      currentTab: 'loop',
      popupShow: false,
      projectManagementList: [],
      buildingList: [],
      GroupList: [],
      lightingPlanList: [],
      onOffList: [
        { value: '', checked: true, name: '全部' },
        { value: true, name: '开启' },
        { value: false, name: '关闭' }
      ],
      projectConfig: {}, // 增加配置子组件口子
      temporaryMemory: {
        projectManagementId: '',
        projectManagementName: '',
        buildingKey: '',
        buildinglabel: '全部',
        groupKey: '',
        grouplabel: '全部',
        lightingPlanKey: '',
        lightingPlanlabel: '全部',
        onOffKey: '',
        onOfflabel: '全部',
        currentTab: this.currentTab,
        RouteParams: {} // 传路由数据
      },
      currentProject: {
        projectManagementId: '',
        projectManagementName: '',
        buildingKey: '',
        buildinglabel: '全部',
        groupKey: '',
        grouplabel: '全部',
        lightingPlanKey: '',
        lightingPlanlabel: '全部',
        onOffKey: '',
        onOfflabel: '全部',
        currentTab: this.currentTab,
        RouteParams: {} // 传路由数据
      },
      filter: {} // 筛选数据

    }
  },
  computed: {
    currentTabComponent () {
      return this.currentTab.toLowerCase()
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
    this.currentProject.currentTab = this.currentTab
    to.params.filter = this.currentProject
    to.params.config = this.projectConfig
    if (to.name === 'addGroup' || to.name === 'detailsGroup') {
      if (to.name === 'detailsGroup') {
        to.params.DetailsId = this.currentProject.RouteParams.id
      }
    }
    if (to.name === 'detailsLightingPlan') {
      to.params.type = this.currentProject.RouteParams.type
      to.params.RouteParams = this.currentProject.RouteParams
    }
    if (to.name === 'index') {
      window.sessionStorage.removeItem('scrollVal')
    }
    next()
  },
  activated () {
    if (roterFrom === 'detailsLoop' || roterFrom === 'detailsGroup') {
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
    if (this.$route.params.filter) {
      this.currentProject = Object.assign(this.currentProject, this.$route.params.filter)
      this.temporaryMemory = Object.assign(this.temporaryMemory, this.$route.params.filter)
    }
    // this.queryProjectManagement()
    if (this.$route.params.config) {
      this.projectConfig = this.$route.params.config
    }
    if (!this.hasAuthority('03080121')) { // 判断计划
      this.currentTab = 'loop'
      this.tableType = 1
    }
    if (!this.hasAuthority('03080106')) { // 判断回路
      this.currentTab = 'group'
      this.tableType = 2
    }
    // 权限
    if (!this.hasAuthority('03080111')) { // 判断群组
      this.currentTab = 'lightingplan'
      this.tableType = 3
      if (this.hasAuthority('03080106')) {
        this.currentTab = 'loop'
        this.tableType = 1
      }
    }

    this.currentTab = this.$route.params.filter ? this.$route.params.filter.currentTab : this.currentTab
    if (this.currentTab === 'loop') {
      this.tableType = 1
    } else if (this.currentTab === 'group') {
      this.tableType = 2
    } else if (this.currentTab === 'lightingplan') {
      this.tableType = 3
    }

    this.onOffList.forEach(element => {
      if (this.currentProject.onOffKey === element.value) {
        element.checked = true
      } else {
        element.checked = false
      }
    })
  },
  beforeDestroy () {
  },
  mounted () {

  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    async queryProjectManagement () {
      this.projectManagementList = []
      const result = await context.http.get('cms/api/project-managements', { useStatus: 'USING' })
      if (result.status === 200) {
        result.data.map(item => {
          let { id, referred } = item
          if (this.currentProject.projectManagementId === id) {
            this.projectManagementList.push({ id, referred, checked: true })
          } else {
            this.projectManagementList.push({ id, referred, checked: false })
          }
        })
        if (!this.currentProject.projectManagementId) {
          if (this.projectManagementList[0]) {
            this.projectManagementList[0].checked = true
            this.currentProject.projectManagementId = result.data[0].id
            this.currentProject.projectManagementName = result.data[0].referred
            this.temporaryMemory.projectManagementId = result.data[0].id
            this.temporaryMemory.projectManagementName = result.data[0].referred
          }
        }
        // 数据传入
        this.projectConfig.projectManagementList = this.projectManagementList
        // 默认第一个
        this.getbuilding(this.currentProject.projectManagementId) // 楼宇
        this.getGroupList(this.currentProject.projectManagementId) // 群组
        this.getlightingPlanList(this.currentProject.projectManagementId) // 计划配置
      }
      this.componentBle = true
    },
    async getbuilding (id) {
      this.buildingList = []
      let result = await context.http.get('cms/api/buildings', {
        useStatus: 'USING',
        projectId: id
      })
      if (result.status === 200) {
        result.data.buildingListDTOS.map(item => {
          let { id, buildingName } = item
          if (this.currentProject.buildingKey === id) {
            this.buildingList.push({ id, buildingName, checked: true })
          } else {
            this.buildingList.push({ id, buildingName, checked: false })
          }
        })

        if (!this.currentProject.buildingKey) {
          if (this.buildingList[0]) {
            this.buildingList[0].checked = true
            this.currentProject.buildingKey = result.data.buildingListDTOS[0].id
            this.currentProject.buildinglabel = result.data.buildingListDTOS[0].buildingName
          }
        }

        // 群组
      }
    },
    async getGroupList (id) {
      this.GroupList = []
      let result = await context.http.get(`rms/api/lightingGroup/list/${id}`)
      if (result.status === 200) {
        this.GroupList.push({
          id: '',
          name: '全部'
        })
        result.data.map(item => {
          let { id, name } = item
          if (this.currentProject.groupKey === id && this.temporaryMemory.groupKey) {
            this.GroupList.push({ id, name, checked: true })
          } else {
            this.GroupList.push({ id, name, checked: false })
          }
        })

        if (!this.currentProject.groupKey || !this.temporaryMemory.groupKey) {
          this.GroupList[0].checked = true
          if (!this.temporaryMemory.groupKey && !this.currentProject.groupKey) {
            this.currentProject.groupKey = ''
            this.currentProject.grouplabel = this.GroupList[0].name
          }
        }
      }
    },
    async getlightingPlanList (id) {
      this.lightingPlanList = []
      let result = await context.http.get(`rms/api/lightingPlan/all?projectManagementId=${id}`)
      if (result.status === 200) {
        this.lightingPlanList.push({
          id: '',
          name: '全部'
        })
        result.data.map(item => {
          let { id, name } = item
          if (this.currentProject.lightingPlanKey === id && this.temporaryMemory.lightingPlanKey) {
            this.lightingPlanList.push({ id, name, checked: true })
          } else {
            this.lightingPlanList.push({ id, name, checked: false })
          }
        })

        if (!this.currentProject.lightingPlanKey || !this.temporaryMemory.lightingPlanKey) {
          this.lightingPlanList[0].checked = true
          if (!this.temporaryMemory.lightingPlanKey && !this.currentProject.lightingPlanKey) {
            this.currentProject.lightingPlanKey = ''
            this.currentProject.lightingPlanlabel = this.lightingPlanList[0].name
          }
        }
      }
    },
    tabSwi (num) { // 通知
      this.tableType = num
      this.queryProjectManagement()
      if (this.tableType === 1) {
        this.currentTab = 'loop'
      } else if (this.tableType === 2) {
        this.currentTab = 'group'
      } else if (this.tableType === 3) {
        this.currentTab = 'lightingplan'
      }
    },
    addBtn () {
      if (this.tableType === 1) {
        this.$router.push({ name: 'addLoop' })
      } else if (this.tableType === 2) {
        this.$router.push({ name: 'addGroup' })
      } else if (this.tableType === 3) {

      }
    },
    showActionSheet () {
      this.popupShow = true
    },
    selectProject (index, item) {
      this.projectManagementList = this.checkedFormat(index, this.projectManagementList)
      this.temporaryMemory.projectManagementId = item.id
      this.temporaryMemory.projectManagementName = item.referred
      // 清空项目下选项值
      // this.reset(item)
      this.temporaryMemory = Object.assign(this.temporaryMemory, {
        buildingKey: '',
        buildinglabel: '全部',
        groupKey: '',
        grouplabel: '全部',
        lightingPlanKey: '',
        lightingPlanlabel: '全部'
      })

      this.getbuilding(item.id) // 楼宇
      this.getGroupList(item.id) // 群组
      this.getlightingPlanList(item.id) // 计划配置
    },
    selectRepairType (index, item) {
      this.buildingList = this.checkedFormat(index, this.buildingList)
      this.temporaryMemory.buildingKey = item.id
      this.temporaryMemory.buildinglabel = item.buildingName
    },
    selectGroupList (index, item) {
      this.GroupList = this.checkedFormat(index, this.GroupList)
      this.temporaryMemory.groupKey = item.id
      this.temporaryMemory.grouplabel = item.name
    },
    selectlightingPlan (index, item) {
      this.lightingPlanList = this.checkedFormat(index, this.lightingPlanList)
      this.temporaryMemory.lightingPlanKey = item.id
      this.temporaryMemory.lightingPlanlabel = item.name
    },
    selectonOff (index, item) {
      this.onOffList = this.checkedFormat(index, this.onOffList)
      this.temporaryMemory.onOffKey = item.value
      this.temporaryMemory.onOfflabel = item.name
    },
    reset () {
      if (this.tableType === 1) {
        this.temporaryMemory.onOffKey = ''
        this.temporaryMemory.onOfflabel = '全部'
        this.temporaryMemory.groupKey = ''
        this.temporaryMemory.grouplabel = '全部'
        this.onOffList.forEach(element => {
          if (element.value === '') {
            element.checked = true
          } else {
            element.checked = false
          }
        })
      }

      if (this.tableType === 2) {
        this.temporaryMemory.lightingPlanKey = ''
        this.temporaryMemory.lightingPlanlabel = '全部'
      }
      let obj = this.projectManagementList[0]
      this.temporaryMemory.projectManagementId = obj ? obj.id : ''
      this.temporaryMemory.projectManagementName = obj ? obj.referred : ''
      this.projectManagementList.forEach((v, i) => {
        if (i === 0) {
          v.checked = true
        } else {
          v.checked = false
        }
      })
    },
    popupShowClosed () {
      this.temporaryMemory = JSON.parse(JSON.stringify(this.currentProject))
      this.projectManagementList.forEach((v, i) => {
        if (v.id === this.currentProject.projectManagementId) {
          v.checked = true
        } else {
          v.checked = false
        }
      })
      if (this.tableType === 1) {
        this.onOffList.forEach(element => {
          if (element.value === this.temporaryMemory.onOffKey) {
            element.checked = true
          } else {
            element.checked = false
          }
        })
        this.getGroupList(this.currentProject.projectManagementId) // 群组
      }
      if (this.tableType === 2) {
        this.getlightingPlanList(this.currentProject.projectManagementId) // 计划配置
      }
    },
    submit (str) {
      if (str === 'reset') {
        this.reset()
        // 默认第一个
        if (this.tableType === 1) {
          this.getGroupList(this.temporaryMemory.projectManagementId) // 群组
        }
        if (this.tableType === 2) {
          this.getlightingPlanList(this.temporaryMemory.projectManagementId) // 计划配置
        }
      } else {
        this.currentProject = JSON.parse(JSON.stringify(this.temporaryMemory))
        let vm = this
        this.$nextTick(() => {
          vm.$refs[this.currentTab].filterUpdate()
        })
      }
      if (str !== 'reset') this.popupShow = false
    },
    checkedFormat (i, arr) {
      arr = arr.map(item => {
        item.checked = false
        return item
      })
      arr[i].checked = true
      return arr
    },
    RouteParamsC (name, row) {
      this.currentProject.RouteParams = row
      this.$router.push({ name })
    },
    onGoBack () { // 返回首页
      this.$router.push({ name: 'index' })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/config";
$contentTop-height: rem(108);
.illuminatingSystem {
  &.noDataCls {
    height: calc(100% - #{$contentTop-height});
  }
  .paddingTop {
    padding-top: rem(108);
  }
  .headTab {
    color: #444547;
    padding: 0 rem(14);
    font-size: rem(17);
    width: 80%;
    line-height: rem(40);
    height: rem(40);
    display: flex;
    margin-top: rem(40);
    background: #fff;
    justify-content: left;
    > span {
      position: relative;
      margin-right: rem(40);
      &.active {
        color: #0139a4;
        border-bottom: rem(3) solid #0139a4;
        font-weight: bold;
      }
      .badge {
        // min-width: 0.35rem;
        // height: 0.35rem;
        // line-height: 0.35rem;
        // padding: 0 0.05rem;
        // background-color: #fc5159;
        // border-radius: 50%;
        // font-size: 0.3rem;
        // color: #fff;
        font-style: normal;
        // display: inline-block;
        // text-align: center;
        // white-space: nowrap;
        position: absolute;
        top: rem(2);
        left: rem(30);
      }
    }
  }
  .selectResultml {
    width: 100%;
    padding: 0 rem(14);
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
    // box-shadow: 0px 1px 4px 0px rgba(230, 230, 230, 0.5);
    .back {
      width: rem(40);
      height: rem(40);
      font-size: rem(18);
      color: #000000;
      &:first-child {
        float: left;
      }
    }
    .title {
      width: 65%;
      margin-right: rem(72);
    }
    .addBtn {
      width: rem(28);
      height: rem(40);
      font-size: rem(18);
      color: #18191a;
      position: absolute;
      right: 0;
      i {
        font-size: rem(18);
        color: #444547;
        font-size: rem(18);
      }
    }
    .widthrightBtn {
      right: rem(40);
    }
  }
  .tab {
    width: 100%;
    height: rem(58);
    background-color: #fff;
    border-bottom: rem(1) solid #f0f0f0;
    position: fixed;
    left: 0;
    top: rem(50);
    padding: 0 rem(14);
    z-index: 9;
    display: flex;
    align-items: center;
    &.scrolling {
      top: rem(40);
      border-top: rem(1) solid #f0f0f0;
    }
    > span {
      font-size: rem(15);
      color: rgba(68, 69, 71, 1);
      margin-right: rem(30);
      &.active {
        font-size: rem(20);
        font-weight: bold;
        color: rgba(24, 25, 26, 1);
      }
    }
  }
  .content {
    margin-top: rem(108);
    // min-height: rem(200);
    background-color: #fff;
    &.noDataCls {
      height: 100%;
      position: relative;
    }
    &.scrolling {
      margin-top: rem(98);
    }
    .item {
      height: rem(79);
      margin-left: rem(14);
      border-bottom: rem(1) solid #f0f0f0;
      padding: rem(14) rem(15) rem(13) 0;
      > div:first-child {
        display: flex;
        align-items: center;
        justify-content: space-between;
        > span {
          &:first-child {
            font-size: rem(17);
            font-weight: bold;
            color: rgba(24, 25, 26, 1);
            display: flex;
            align-items: center;
            > .read {
              display: block;
              width: rem(7);
              height: rem(7);
              background: rgba(252, 81, 89, 1);
              border-radius: 50%;
              margin-right: rem(5);
            }
          }
          &:last-child {
            font-size: rem(13);
            color: rgba(133, 140, 148, 1);
          }
        }
      }
      > div:last-child {
        margin-top: rem(8);
        font-size: rem(15);
        color: rgba(68, 69, 71, 1);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .addMenu {
    position: absolute;
    width: rem(100);
    max-height: rem(95);
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
      &:first-child {
        border-bottom: rem(1) solid #37393a;
        border-radius: rem(4);
      }
    }
  }
}
</style>
