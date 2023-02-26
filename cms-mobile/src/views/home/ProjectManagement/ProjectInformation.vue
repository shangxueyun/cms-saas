<template>
  <div class="projectInformation"
       :class="{'focus':focus}">
    <app-header v-if="!focus"
                :title="title"
                :onBack="true"
                backRoute="index">
      <div slot="rightBtn"
           @click="showActionSheet"
           :class="{ selected: popupShow }"
           class="iconfont iconcms_shaixuan selectedBtn"></div>
    </app-header>
    <div class="title" @click="showActionSheet">
            <!-- searchP: {
        organizeId: '',
        organizeIdName: '',
        industryS: ''
      }, -->
      <span>
        <template v-if="searchP.organizeIdName.length">
          <span v-for="(item, index) in searchP.organizeIdName" :key="index">{{item}}</span>
        </template>
        <template v-else>
          <span>全部企业</span>
        </template>
        <span>{{searchP.industryS.text}}</span>
      </span>
    </div>
    <div class="container">
      <template v-for="(item, index) in tableData">
        <div :key="index">
          <div class="header">
            <div class="headTitle">{{ item.organizeName }}</div>
            <div class="item">楼宇总数：{{ item.buildingAmount }}</div>
            <div class="item" style="text-align: right;">总面积：{{ item.area.toString().replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, '$1,') }} m²</div>
            <div class="item">一手出租率：{{ item.rentRate }}%</div>
            <div class="item" style="text-align: right;">入驻企业数：{{ item.enterprisesAmount }}</div>
          </div>
          <ul class="list">
            <li @click="toContactsDetail(itemC)" v-for="(itemC, indexC) in item.projectManagementDTO" :key="indexC">
              <div class="project-img">
                <img :src="itemC.previewImage" />
              </div>
              <div class="project-center">
                <p class="pj-title">{{itemC.projectName}}</p>
                <p class="nav">
                  <span v-if="hasAuthority('02010104')"
                        @click.stop="$router.push({name: 'building', query: {'projectId': itemC.id, organizeId: itemC.organizeId}})">楼宇</span>
                  <span v-if="hasAuthority('02010106')"
                        @click.stop="$router.push({name: 'competentDepartmentList', query: {'projectMmanagementId': itemC.id, organizeId: itemC.organizeId}})">关联单位</span>
                </p>
              </div>
              <span class="iconfont iconright"></span>
            </li>
          </ul>
        </div>
      </template>
      <div class="loadAll">
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
          <p>管理企业</p>
          <ul>
            <li v-for="(item, index) in projectManagementList"
                :key="item.id"
                @click="selectProject(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>状态</p>
          <ul>
            <li v-for="(item, index) in industryList"
                :key="item.value"
                @click="selectIndustry(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.text }}</span>
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
    <!-- <div v-show="shadeBox"
         @touchmove.prevent
         class="shadeBox"></div> -->
  </div>
</template>
<script>
import AppHeader from '@/components/appHead'
import context from '@/service'
import { InfiniteScroll, Toast } from 'mint-ui'
export default {
  name: 'projectInformation',
  components: { AppHeader, InfiniteScroll },
  data () {
    return {
      title: '项目信息',
      projectManagementList: [],
      searchP: {
        organizeId: [],
        organizeIdName: [],
        industryS: ''
      },
      industryList: [{ text: '使用中', value: 'USING', checked: true }, { text: '已停用', value: 'DISABLE' }],
      currentProject: [],
      currentIndustry: [{ text: '使用中', value: 'USING' }],
      shadeBox: false,
      focus: false,
      inputValue: '',
      page: 0,
      size: 10,
      loadBottom: false,
      tableData: [],
      dataReady: false,
      loadAll: false,
      flag: true,
      popupShow: false
    }
  },
  activated () {
    if (!this.$route.meta.isBack) {
      Object.assign(this.$data, this.$options.data())
      this.queryProjectManagement()
    } else {
      if (sessionStorage.getItem('loadBottom')) {
        sessionStorage.getItem('loadBottom') === 'false' ? this.loadBottom = false : this.loadBottom = true
      }
      sessionStorage.removeItem('loadBottom')
    }
  },
  deactivated () {
    this.loadBottom = true
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'projectDetail' || to.name === 'building' || to.name === 'competentDepartmentList') {
      from.meta.isBack = true
    } else {
      from.meta.isBack = false
    }
    next()
  },
  mounted () {
  },
  methods: {
    async queryProjectManagement () {
      const res = await context.http.get('uaa/api/organizes/enterprise/user?onTree=true')
      res.data = this.checkedFormat2(res.data)
      res.data.unshift({
        id: '',
        name: '全部企业',
        checked: true
      })
      this.projectManagementList = res.data
      this.searchP.industryS = this.industryList[0]

      this.query()
    },
    showActionSheet () {
      this.popupShow = !this.popupShow
      let organize = this.searchP.organizeId
      if (this.searchP.organizeId.length) {
        let data = this.checkedFormat2(this.projectManagementList)
        for (let i = 0; i < organize.length; i++) {
          let le = data.indexOf(data.filter(v => v.id === organize[i])[0])
          this.projectManagementList = this.checkedAction(le, this.projectManagementList)
        }
        this.industryList = this.checkedFormat2(this.industryList)
        this.searchP.industryS.checked = true
      }
    },
    selectProject (i, item) {
      this.projectManagementList = this.checkedAction(i, this.projectManagementList)
      let project = this.projectManagementList.filter(item => item.checked)
      if (!project.length) {
        this.projectManagementList = this.checkedFormat(0, this.projectManagementList)
      }
    },
    selectIndustry (i, item) {
      this.industryList = this.checkedFormat(i, this.industryList)
    },
    async query () {
      let result = await context.http.get('cms/api/getOrganiz/infoByids?', { useStatus: this.searchP.industryS.value, ids: this.searchP.organizeId.toString() })
      if (result.status === 200) {
        this.dataReady = true
        this.tableData = result.data
        this.searchTag = false
      }
    },
    async submit (state) {
      if (state === 'reset') {
        if (!this.projectManagementList.length) return
        this.projectManagementList = this.checkedFormat(0, this.projectManagementList)
        this.industryList = this.checkedFormat(0, this.industryList)
      } else {
        if (!this.projectManagementList.length) {
          this.popupShow = false
          return
        }
        let project = this.projectManagementList.filter(item => item.checked)
        this.searchP.organizeId = []
        this.searchP.organizeIdName = []
        project.forEach(v => {
          this.searchP.organizeId.push(v.id)
          if (!v.id) {
            this.searchP.organizeIdName.push('全部企业')
          } else {
            this.searchP.organizeIdName.push(v.name)
          }
        })

        this.searchP.industryS = this.industryList.filter(item => item.checked)[0]
        this.page = 0
        this.tableData = []
        this.query()
        this.popupShow = false
      }
    },
    showActionSheetFormat (list, currentList) {
      list = list.map(item => {
        item.checked = false
        currentList.forEach(v => {
          if (item.id === v.id) item.checked = true
        })
        return item
      })
      return list
    },
    compositions (flag) {
      this.flag = flag
    },
    onKeyInput (event) { // 输入
      if (event.keyCode !== 13 && this.flag) {
        this.shadeBox = false
        this.page = 0
        this.tableData = []
        this.$nextTick(() => {
          this.query()
        })
      }
    },
    inputFocus () { // 获取焦点
      this.focus = true
      this.shadeBox = true
    },
    search (event) { // 键盘完成事件
      if (event.keyCode === 13) {
        event.preventDefault() // 禁止默认事件（默认是换行）
        this.inputValue = event.target.value
        this.page = 0
        this.tableData = []
        if (!this.searchTag) this.query()
      }
    },
    toContacts () { // 取消
      this.focus = false
      this.shadeBox = false
      this.inputValue = ''
      this.page = 0
      this.tableData = []
      this.query()
    },
    loadMore () {
      this.loadBottom = true
      this.query()
    },
    checkedAction (i, arr) {
      arr = arr.map((item, o) => {
        if (o === i) {
          item.checked = !item.checked
        }
        return item
      })
      if (i === 0) {
        arr = arr.map((item, o) => {
          if (o === 0) {
            item.checked = true
          } else {
            item.checked = false
          }
          return item
        })
      } else {
        arr[0].checked = false
      }
      return arr
    },
    checkedFormat (i, arr) {
      arr = arr.map(item => {
        item.checked = false
        return item
      })
      arr[i].checked = true
      return arr
    },
    checkedFormat2 (arr) {
      arr = arr.map(item => {
        item.checked = false
        return item
      })
      return arr
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    toContactsDetail (item) {
      if (!this.hasAuthority('02010102')) {
        Toast({
          message: '你的账号没有查看项目信息的权限',
          position: 'top'
        })
        return
      }
      localStorage.setItem('tabIndex', 0)
      sessionStorage.setItem('loadBottom', this.loadBottom)
      this.$router.push({ name: 'projectDetail', query: { id: item.id } })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
.projectInformation {
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
      width: rem(345);
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
  .title {
    width: 100%;
    position: fixed;
    left: 0;
    top: rem(40);
    height: rem(28);
    line-height: rem(28);
    font-size: rem(13);
    color: #444547;
    z-index: 1;
    background: #f8f9fa;
    display: flex;
    white-space: nowrap;
    flex-basis: rem(0);
    flex-shrink: 0;
    align-items: center;
    overflow-x: auto;
    overflow-y: hidden;
    > span {
      display: block;
      line-height: rem(16);
      height: rem(16);
      border-right: rem(1) solid #d8d8d8;
      margin-left: rem(15);
      > span {
        line-height: rem(16);
        padding-right: rem(10);
        padding-left: rem(10);
        border-left: 1px solid #D8D8D8;
      }
      > span:first-child{
        border: none;
        padding-left: 0;
      }
      > span:last-child {
        margin-right: rem(15);
      }
    }
    > span:last-child {
      border-right: 0;
    }
  }
  &.focus {
    .input {
      width: rem(300) !important;
    }
    .seachInput {
      top: 0 !important;
      border-top: 0;
    }
    .title {
      top: rem(50);
    }
    .container {
      padding-top: rem(78);
    }
    .shadeBox {
      height: calc(100% - #{$foot-height});
      position: fixed;
      left: 0;
      top: $foot-height;
      width: 100%;
      background: rgba(0, 0, 0, 0.2);
      z-index: 2;
    }
  }
  .container {
    padding-top: rem(72);
    .header{
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      background: #FFFFFF;
      padding: rem(15);
      .headTitle{
        width: 100%;
        color: #18191A;
        font-size: rem(16);
        font-weight: 700;
      }
      .item{
        width: 50%;
        padding-top: rem(10);
        color: #858C94;
        font-size: rem(14);
      }
    }
    .list {
      margin-top: rem(4);
      li {
        padding: rem(10) rem(14);
        position: relative;
        margin-bottom: rem(4);
        background: #fff;
        display: flex;
        .project-img {
          width: rem(84);
          height: rem(90);
          img {
            width: 100%;
            height: 100%;
            border-radius: rem(2);
          }
        }
        .project-center {
          margin-left: rem(14);
        }
        > div {
          > p {
            color: #18191a;
            font-size: rem(17);
            margin-top: rem(10);
            font-weight: bold;
            &:last-child {
              margin-top: rem(20);
            }
            span {
              display: inline-block;
              padding: rem(3) rem(6);
              color: #0139a4;
              background: #eff6ff;
              border-radius: rem(1);
              font-size: rem(13);
              margin-right: rem(8);
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
