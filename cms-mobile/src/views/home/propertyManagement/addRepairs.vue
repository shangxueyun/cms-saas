<template>
  <div class="addRepairs">
    <app-header :title="title"
                :mode="false"
                @confirmFn="confirmFn">
      <div slot="rightBtn">
        <div @click.stop="submit1">提交</div>
      </div>
    </app-header>
    <div class="content">
      <div class="ct-div title"
           v-if="addData.repairType==='ROOMS'">
        房源号
        <i class="required">*</i>
        <span :class="{'gray' : !addData.roomsId}"
              @click="showSelectShop">
          {{ shopNumber||'请选择' }}
          <i class="iconfont iconright"></i>
        </span>
      </div>
      <div class="ct-div title"
           v-if="addData.repairType==='EQUIREMENT'">
        设备编号
        <i class="required">*</i>
        <span :class="{'gray' : addData.equirementNo === '请选择'}"
              @click="toSelectEquirement">
          {{ addData.equirementNo }}
          <i class="iconfont iconright"></i>
        </span>
      </div>
      <div class="ct-div title"
           v-if="addData.repairType==='BUILDING'">
        项目
        <i class="required">*</i>
        <span :class="{'gray' : addData.projectName === ''}"
              @click="popupShowProject = true">
          {{ addData.projectName||'请选择'}}
          <i class="iconfont iconright"></i>
        </span>
      </div>
      <div class="line"></div>
      <div class="ct-div"
           v-if="addData.repairType==='BUILDING'">
        报修位置
        <i class="required">*</i>
        <input type="text"
               placeholder="请输入"
               v-model="addData.repairPosition" />
      </div>
      <div class="ct-div"
           v-if="addData.repairType==='ROOMS'">
        房源名称
        <i class="required">*</i>
        <input type="text"
               placeholder="请输入"
               v-model="addData.name"
               maxlength="20" />
      </div>
      <div class="ct-div"
           v-if="addData.repairType==='EQUIREMENT'">
        设备名称
        <i class="required">*</i>
        <input type="text"
               placeholder="请输入"
               v-model="addData.name"
               maxlength="10" />
      </div>
      <!-- <div class="ct-div"
           v-if="addData.repairType==='BUILDING'">
        楼宇名称
        <i class="required">*</i>
        <span :class="{'gray' : addData.roomsId === '请选择'}"
              @click="showSelectShop">
          {{ addData.roomsId }}
          <i class="iconfont iconright"></i>
        </span>
      </div> -->
      <div class="ctent">
        <div>
          问题简述
          <i class="required">*</i>
          <div>
            <textarea placeholder="请输入"
                      maxlength="10"
                      v-model="addData.title"></textarea>
          </div>
        </div>
        <div>
          报修原因
          <i class="required">*</i>
          <div>
            <textarea placeholder="请输入"
                      maxlength="40"
                      v-model="addData.content"></textarea>
          </div>
        </div>
        <div class="attachment">
          附件
          <i class="iconfont iconcms_fujiantianjia"
             v-if="addData.annexes.length<5">添加附件
            <aliUpload class="aliUpload"
                       @setAnnex="setAnnex" />
          </i>
        </div>
        <div class="annexes">
          <div class="item"
               v-for="(item,index) in addData.annexes"
               :key="index">
            <div>
              <svg class="icon"
                   aria-hidden="true">
                <use :xlink:href="pageGetformat(item.annexName)"></use>
              </svg>
            </div>
            <div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{item.annexName}}</div>
            <ailPreview :ailObj="item"
                        :encrypt="true"
                        @setFile="setFile"
                        class="ailPreview" />
            <span @click="delEnclosure(index)"
                  class="delcl"><i class="iconfont iconcms_shanchu-233"></i></span>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧筛选   选择铺位-->
    <van-popup v-model="popupShow"
               class="popup_common"
               :overlay-style="{'background-color': 'rgba(0,0,0,.4)'}"
               :style="{ height: '100%' }"
               position="right">
      <p class="popup_title">{{addData.repairType==='ROOMS'?'选择房源':'筛选'}}</p>
      <div class="popup_container">
        <!-- <div class="popup_list">
          <p>项目</p>
          <ul>
            <li v-for="(item, index) in projectManagementList"
                :key="index"
                @click="selectProject(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.referred }}</span>
            </li>
          </ul>
        </div> -->
        <div class="popup_list">
          <p>楼宇</p>
          <ul>
            <li v-for="(item, index) in buildingList"
                :key="index"
                @click="selectBuilding(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.buildingName }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list"
             v-if="addData.repairType==='ROOMS'">
          <p>房源</p>
          <ul>
            <li v-for="(item, index) in floorsList"
                :key="index"
                @click="selectfloors(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.shopNumber }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="popup_buttons">
        <div @click="getShopListTree('rest')"
             class="popup_default">重置</div>
        <div @click="submit"
             class="popup_active">确定</div>
      </div>
    </van-popup>

    <!-- 项目下拉选择 -->
    <van-popup v-model="popupShowProject"
               position="bottom">
      <van-picker show-toolbar
                  ref="picker"
                  title="请选择"
                  value-key='referred'
                  @confirm="confirmFnChange"
                  @cancel='popupShowProject=false'
                  :columns="projectManagementOption" />
    </van-popup>
  </div>
</template>

<script>
import Vue from 'vue'
import context from '@/service'
import AppHeader from '@/components/appHead'
import aliUpload from '@/components/aliUpload.vue'
import ailPreview from '@/components/ailPreview.vue'
import Common from '@/utils/common'
import { Toast } from 'vant'
import { MessageBox } from 'mint-ui'
Vue.use(Toast)
let roterFrom = null
export default {
  name: 'addRepairs',
  components: {
    AppHeader,
    ailPreview,
    aliUpload
  },
  computed: {

  },
  data () {
    return {
      roterFrom: null,
      shopNumber: '',
      projectBuildName: '',
      title: '新增报修单',
      addData: {
        repairType: 'BUILDING', // ROOMS 铺位   EQUIREMENT 设备   BUILDING 其他
        roomsId: null,
        equirementId: null,
        equirementNo: '请选择',
        projectId: null,
        projectName: '',
        buildingId: null,
        name: '',
        content: '',
        repairPosition: '',
        title: '',
        annexes: []
      },
      dataList: [], // 项目楼宇铺位号
      popupShow: false,
      popupShowProject: false,
      projectManagementList: [],
      projectManagementOption: [],
      buildingList: [],
      floorsList: [], // 铺位列表
      currentProject: {},
      currentBuilding: {},
      currentfloors: {},
      selectItem: {}
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'repairList' || from.name === 'maintainList' || from.name === 'repairsInfo') {
      sessionStorage.removeItem('selectItem')
      sessionStorage.removeItem('addRepairsData')
      sessionStorage.removeItem('shopNumber')
      sessionStorage.removeItem('projectBuildName')
      roterFrom = from.name
    }
    next()
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  beforeRouteLeave (to, from, next) {
    if (to.name !== 'selectEquirement' || to.name !== 'FilePreview') {
      sessionStorage.removeItem('selectItem')
      sessionStorage.removeItem('addRepairsData')
      sessionStorage.removeItem('shopNumber')
    }
    if (to.name === 'selectEquirement' || to.name === 'FilePreview') {
      sessionStorage.setItem('addRepairsData', JSON.stringify(this.addData))
      sessionStorage.setItem('shopNumber', this.shopNumber)
      sessionStorage.setItem('projectBuildName', this.projectBuildName)
    }
    next()
  },
  created () {
    this.roterFrom = roterFrom
    if (this.addData.repairType !== 'EQUIREMENT') {
      this.getShopListTree()
    }
    let shopNumber = sessionStorage.getItem('shopNumber')
    if (shopNumber) {
      this.shopNumber = shopNumber
    }
    let projectBuildName = sessionStorage.getItem('projectBuildName')
    if (projectBuildName) {
      this.projectBuildName = projectBuildName
    }
    // 拿取预览页返回来保存数据
    let addRepairsData = sessionStorage.getItem('addRepairsData')
    if (addRepairsData) {
      this.addData = JSON.parse(addRepairsData)
    }
    this.selectItem = JSON.parse(sessionStorage.getItem('selectItem'))
    this.addData.repairType = sessionStorage.getItem('addType')
    if (this.selectItem) {
      this.addData.equirementId = this.selectItem.id
      this.addData.equirementNo = this.selectItem.code
      this.addData.name = this.selectItem.name
    }
  },
  mounted () {
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', this.confirmFn, false)
    }
  },
  destroyed () {
    MessageBox.close()
    window.removeEventListener('popstate', this.confirmFn, false)
  },
  methods: {
    toSelectEquirement () {
      this.$router.replace({ name: 'selectEquirement' })
    },
    submit1 () {
      if (this.addData.repairType === 'ROOMS' && (!this.addData.roomsId || this.addData.roomsId === '')) {
        Toast({
          message: '请选择房源',
          position: 'top'
        })
        return
      } else if (this.addData.repairType === 'EQUIREMENT' && (!this.addData.equirementId || this.addData.equirementId === '')) {
        Toast({
          message: '请选择设备',
          position: 'top'
        })
        return
      } else if (this.addData.repairType === 'BUILDING') {
        if (!this.addData.projectId || this.addData.projectId === '') {
          Toast({
            message: '请选择项目',
            position: 'top'
          })
          return
        } else if (this.addData.repairPosition === '') {
          Toast({
            message: '请输入报修位置',
            position: 'top'
          })
          return
        }
      }
      if (this.addData.repairType !== 'BUILDING' && (!this.addData.name || this.addData.name === '')) {
        let text = this.addData.repairType === 'ROOMS' ? '房源名称' : '设备名称'
        Toast({
          message: `请输入${text}`,
          position: 'top'
        })
        return
      }
      if (!this.addData.title || this.addData.title === '') {
        Toast({
          message: '请输入问题简述',
          position: 'top'
        })
        return
      }
      if (!this.addData.content || this.addData.content === '') {
        Toast({
          message: '请输入报修原因',
          position: 'top'
        })
        return
      }
      context.http.post('cms/api/repair-forms', this.addData).then(res => {
        if (res) {
          this.popupShow = false
          Toast({
            message: `新增成功`,
            position: 'top'
          })
          this.$router.push({ name: roterFrom })
        }
      })
    },
    confirmFn () {
      let _this = this
      let test = true
      if (this.addData.repairType === 'ROOMS') {
        test = !!((!this.addData.roomsId || this.addData.roomsId === '') && (!this.addData.name || this.addData.name === ''))
      } else if (this.addData.repairType === 'EQUIREMENT') {
        test = !!((!this.addData.equirementId || this.addData.equirementId === '') && (!this.addData.name || this.addData.name === ''))
      } else if (this.addData.repairType === 'BUILDING') {
        test = !!((!this.addData.projectId || this.addData.projectId === ''))
      }
      if (
        test &&
        (!this.addData.title || this.addData.title === '') &&
        (!this.addData.content || this.addData.content === '') &&
        this.addData.annexes.length === 0
      ) {
        _this.$router.replace({ name: roterFrom })
        return
      }
      MessageBox.confirm('', {
        message: '内容尚未保存，确定退出？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonClass: 'confirmButton',
        cancelButtonClass: 'cancelButton'
      }).then(action => {
        if (action === 'confirm') {
          sessionStorage.removeItem('addData')
          _this.$router.push({ name: roterFrom })
        }
      }).catch(error => {
        if (error === 'cancel') {
          if (window.history && window.history.pushState) {
            history.pushState(null, null, document.URL)
          }
        }
      })
    },
    showSelectShop () {
      this.projectManagementList = this.projectManagementList.map(item => {
        item.checked = false
        if (item.id === this.currentProject.id) item.checked = true
        return item
      })
      this.buildingList = this.buildingList.map(item => {
        item.checked = false
        if (item.id === this.currentBuilding.id) item.checked = true
        return item
      })
      if (this.addData.repairType === 'ROOM') {
        this.floorsList = this.floorsList.map(item => {
          item.checked = false
          if (item.id === this.currentfloors.id) item.checked = true
          return item
        })
      }
      this.popupShow = true
    },
    async submit (state) {
      if (!this.projectManagementList.length) {
        return
      }
      if (!this.buildingList.length) {
        Toast({
          message: '请选择楼宇'
          // position: 'top'
        })
        return
      }
      if (!this.floorsList.length) {
        Toast({
          message: '请选择房源'
          // position: 'top'
        })
        return
      }
      this.currentProject = this.projectManagementList.filter(item => item.checked)[0]
      this.currentBuilding = this.buildingList.filter(item => item.checked)[0]
      this.currentfloors = this.floorsList.filter(item => item.checked)[0]
      if (this.addData.repairType === 'ROOMS') {
        this.addData.roomsId = this.currentfloors.id
      } else { // BUILDING
        this.addData.projectId = this.currentProject.id
        this.addData.buildingId = this.currentBuilding.id
      }
      this.projectBuildName = this.currentProject.referred + ' / ' + this.currentBuilding.buildingName
      this.shopNumber = this.currentProject.referred + ' / ' + this.currentBuilding.buildingName + ' / ' + this.currentfloors.shopNumber
      this.popupShow = false
    },
    getShopListTree (flag) {
      context.http.get('cms/api/project-managements/tree').then(res => {
        this.dataList = res.data
        this.projectManagementList = this.dataList
        res.data.forEach(v => {
          this.projectManagementOption.push({ id: v.id, referred: v.referred })
        })
        // this.projectManagementList[0].checked = true
        this.currentProject = this.projectManagementList[0]
        this.buildingList = this.projectManagementList[0].buildingListDTOSet
        if (this.buildingList.length) {
          this.buildingList[0].checked = true
          this.currentBuilding = this.buildingList[0] ? this.buildingList[0] : {}
          this.floorsList = this.buildingList[0].roomsDTOS
          if (this.floorsList.length) {
            this.floorsList[0].checked = true
            this.currentfloors = this.floorsList[0] ? this.floorsList[0] : {}
          } else {
            this.floorsList = []
          }
          if (flag === 'rest') {
            this.addData.roomsId = this.currentfloors.id
            this.shopNumber = this.currentProject.referred + '  ' + this.currentBuilding.buildingName + '  ' + this.currentfloors.shopNumber
          }
        } else {
          this.buildingList = []
        }
      }).catch(error => {
        console.log(error)
      })
    },
    async selectProject (index, item) {
      // this.projectManagementList = this.checkedFormat(index, this.projectManagementList)
      this.buildingList = this.projectManagementList[index].buildingListDTOSet
      if (this.buildingList.length) {
        this.floorsList = this.buildingList[0].roomsDTOS
        this.buildingList[0].checked = true
        this.floorsList[0].checked = true
      } else {
        this.floorsList = []
      }
    },
    async selectBuilding (index, item) {
      this.buildingList = this.checkedFormat(index, this.buildingList)
      this.floorsList = this.buildingList[index].roomsDTOS
      if (this.floorsList.length) {
        this.floorsList[0].checked = true
      } else {
        this.floorsList = []
      }
    },
    confirmFnChange (row) {
      this.addData.projectId = row.id
      this.addData.projectName = row.referred
      this.popupShowProject = false
    },
    selectfloors (index, item) {
      this.floorsList = this.checkedFormat(index, this.floorsList)
    },
    setAnnex (annexURL, annexName) {
      this.addData.annexes.push({
        'annexName': annexName,
        'annexURL': annexURL
      })
    },
    delEnclosure (index) {
      let _this = this
      MessageBox.confirm('', {
        message: '确定删除附件吗？',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        confirmButtonClass: 'confirmButton',
        cancelButtonClass: 'cancelButton'
      }).then(action => {
        if (action === 'confirm') {
          _this.addData.annexes.splice(index, 1)
        }
      })
      // this.addData.annexes.splice(index, 1)
    },
    checkedFormat (i, arr) {
      arr = arr.map(item => {
        item.checked = false
        return item
      })
      arr[i].checked = true
      return arr
    },
    setFile () {

    },
    pageGetformat (str) {
      return Common.getformat(str)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
.addRepairs {
  .content {
    color: #858c94;
    font-size: rem(15);
    margin-top: rem(40);
    overflow: hidden;
    .required {
      color: #fc5159;
      font-size: rem(15);
      margin-right: rem(4);
    }
    .line {
      border-bottom: 1px solid #f0f0f0;
      margin-left: rem(14);
    }
    .ct-div {
      background-color: #fff;
      height: rem(58);
      display: flex;
      align-items: center;
      padding-left: rem(20);
      span {
        color: #000000;
        flex: 1;
        text-align: right;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &.gray {
          color: #d9d9d9 !important;
        }
        .iconfont {
          text-align: right;
          padding-right: rem(14);
          color: #858c94;
        }
      }
      input {
        color: #18191a;
        flex: 1;
        text-align: right;
        padding: 0 rem(14);
        font-size: 0.375rem;
        line-height: 0.5rem;
      }
    }
    .type {
      margin-top: rem(5);
      .iconfont {
        text-align: right;
        padding-right: rem(12);
        color: #858c94;
      }
    }
    .title {
      margin-top: rem(10);
      input {
        flex: 1;
        text-align: right;
        padding-right: rem(12);
        margin-left: rem(12);
        font-size: rem(15);
        color: rgba(24, 25, 26, 1);
        line-height: rem(20);
      }
    }
    .ctent {
      background-color: #fff;
      padding-left: rem(20);
      margin-top: rem(10);
      padding-top: rem(10);
      textarea {
        width: 100%;
        height: rem(100);
        padding-top: rem(10);
        border-bottom: rem(1) solid #f0f0f0;
        font-size: rem(15);
        color: rgba(24, 25, 26, 1);
      }
    }
    .attachment {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      height: rem(58);
      // padding-left: rem(10);
      .iconfont {
        color: #023c8f;
        font-size: rem(14);
        padding-right: rem(14);
        position: relative;
      }
      .iconcms_fujiantianjia:before {
        padding-right: rem(6);
      }
      .aliUpload {
        width: rem(80);
        height: rem(20);
      }
    }
    .recipient {
      margin-top: rem(10);
      .subtitle {
        font-size: rem(13);
        text-align: left;
        color: #858c94;
      }
      .iconfont {
        color: #023c8f;
        font-size: rem(14);
      }
      .iconcms_fujiantianjia:before {
        padding-right: rem(6);
      }
    }
    .recipient-list {
      height: rem(80);
      background-color: #fff;
      display: flex;
      flex-wrap: wrap;
      padding: 0 rem(15);
      overflow: hidden;
      &.moreSelect {
        height: auto;
      }
      div {
        display: inline-block;
        width: rem(34);
        height: rem(34);
        line-height: rem(34);
        font-size: rem(12);
        text-align: center;
        background: #3575f6;
        color: #fff;
        border-radius: 50%;
        margin: 0 rem(10) rem(8) 0;
        &:nth-of-type(8n) {
          margin-right: 0;
        }
      }
    }
    .showMore {
      padding: rem(10) 0;
      text-align: center;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-align: center;
      align-items: center;
      -ms-flex-pack: center;
      justify-content: center;
      color: #0139a4;
      background: #fff;
      &.moreAni {
        transform: rotate(180deg);
        transform-origin: center center;
      }
    }
    .annexes {
      background-color: #fff;
      padding-left: rem(12);
      .title {
        padding: rem(10) 0 rem(13) rem(12);
        font-size: 15px;
        color: rgba(133, 140, 148, 1);
      }
      .item {
        display: flex;
        align-items: center;
        // padding: rem(4) 0 rem(4) 0;
        > div {
          &:first-child {
            margin-right: rem(15);
          }
          &:last-child {
            font-size: rem(15);
            color: rgba(24, 25, 26, 1);
          }
        }
      }
      .annex-name {
        width: 70%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .operating {
        flex: 1;
        display: flex;
        justify-content: flex-end;
      }
      .delcl {
        text-align: right;
        margin-right: rem(12);
        margin-left: rem(10);
        .iconfont {
          font-size: rem(16);
        }
      }
      .ailPreview {
        text-align: right;
        .iconfont {
          font-size: rem(16);
        }
      }
    }
  }
  input::-webkit-input-placeholder,
  textarea::-webkit-input-placeholder {
    color: #d9d9d9;
  }
}
</style>

