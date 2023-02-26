<template>
  <div id="provisionalApproval">
    <div class="provisionalApproval" v-show="$route.path === '/provisionalApproval'">
      <app-header :title="title"
                  :mode="false"
                  :isconfirm="true"
                  @confirmFn="confirmFn">
        <div slot="rightBtn">
          <div @click.stop="submit">提交</div>
        </div>
      </app-header>
      <div class="content">
        <div class="ct-div title">
          <i class="required">*</i>
          标题
          <input type="text"
                placeholder="请输入标题"
                maxlength="50"
                v-model="currencyForm.title" />
        </div>
        <div class="ctent text">
          <i class="required">*</i>正文
          <div>
            <textarea maxlength="500" placeholder="请输入500字以内"
                      v-model="currencyForm.content"></textarea>
            <p class="contentNum">{{currencyForm.content.length}}/500</p>
          </div>
          
        </div>
        <div class="ctent project">
          项目
          <div @click="openProjectActionsheet = !openProjectActionsheet" class="graywarp">
            <span :class="{'gray' : projectName === '请选择'}">
              {{ projectName }}
              <i class="iconfont iconright"></i>
            </span>
          </div>
          
        </div>
        <div class="ctent">
          <div class="attachment">
            附件
            <i class="iconfont iconcms_fujiantianjia">添加附件
              <aliUpload class="aliUpload"
                        @setAnnex="setAnnex" />
            </i>
          </div>
          <div class="annexes">
            <div class="item"
                v-for="(item,index) in currencyForm.annexes"
                :key="index">
              <div>
                <svg class="icon"
                    aria-hidden="true">
                  <use :xlink:href="pageGetformat(item.annexName)"></use>
                </svg>
              </div>
              <div>{{item.annexName}}</div>
              <ailPreview :ailObj="item"
                          :encrypt="true"
                          @setFile="setFile"
                          class="ailPreview" />
              <span @click="delEnclosure(index)"
                    class="delcl"><i class="iconfont iconcms_shanchu-233"></i></span>
            </div>
          </div>
        </div>
        <div class="ctent">
          <div class="c-title">非标审批流程</div>
        </div>
        <div class="dingflow-design">
          <div class="node-wrap" v-for="(item, index) in aflowData" :key="index">
            <div class="node-wrap-box">
              <div class="node-title">
                <span class="titleIcon" :class="{'cc-node': item.type === 'CC'}"></span>
                <span class="node-name">{{item.type === 'PARALLEL_START_AND' ? '会签审批节点' : item.type === 'PARALLEL_START_OR' ? '或签审批节点' : item.name}}</span>
                <i class="iconfont iconcms_shanchu-233" @click="deleteNode(aflowData, index, item, index)"></i>
              </div>
              <div class="ds-content">
                <div class="approve-name">
                  <span>{{ item.type === 'CC' ? '抄送人' : '审批人'}}</span>
                  <span @click="selectApprover(item, index)"><i class="iconfont iconcms_fujiantianjia"></i>添加</span>
                </div>
                <div class="jobPosition" v-if="item.jobPositionLable">
                  <span class="jobPositionLable" v-for="(item, index) in item.jobPositionLable">{{item}}</span>
                </div>
              </div>
            </div>
            <div class="add-node-btn-box">
              <span class="vertical-line"></span>
              <div class="add-node-btn" @click="showSheet(item, index)">
                <!-- <i class="iconfont icontianjia"></i> -->
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icontianjia"></use>
                </svg>
              </div>
              <span class="vertical-line" v-if="aflowData.length !== index + 1"></span>
            </div>
          </div>
        </div>
      </div>
      <!--  -->
      <van-action-sheet
        v-model="show"
        :actions="actions"
        cancel-text="取消"
        close-on-click-action
        @select="onSelect"
        @cancel="onCancel"
      />
    </div>
    <router-view :detailData="itemData" @saveFlowData="saveFlowData"></router-view>

    <!-- 项目 -->
    <action-sheet :open="openProjectActionsheet"
                  tsType="slideOutUp">
      <div slot="content">
        <div class="as-title">
          选择项目
          <i class="iconfont iconcms_guanbi"
             @click="openProjectActionsheet = false"></i>
        </div>
        <div slot="content">
          <ul class="pj-ul">
            <li v-for="(item, index) in projectManagementList"
                :key="item.id"
                @click="selectPJLi(item, index)"
                :class="{ selected: index === PJtabIndex }">
              <span>{{ item.referred }}</span>
            </li>
          </ul>
        </div>
      </div>
    </action-sheet>
  </div>
</template>
<script>
import AppHeader from '@/components/appHead'
import ailPreview from '@/components/ailPreview.vue'
import aliUpload from '@/components/aliUpload.vue'
import { MessageBox, Toast } from 'mint-ui'
import ActionSheet from '@/components/Actionsheet'
import context from '@/service'
import common from '@/utils/common.js'
let roterFrom = null
export default {
  name: 'provisionalApproval',
  components: {
    AppHeader,
    ailPreview,
    aliUpload,
    ActionSheet
  },
  data () {
    return {
      title: '发起非标审批',
      currencyForm: {
        annexes: [],
        title: '',
        content: '',
        projectManagementId: ''
      },
      show: false,
      actions: [{ name: '审批人', nodeType: 'APPROVAL' }, { name: '并行会签', nodeType: 'huiqian' }, { name: '并行或签' }, { name: '抄送人', nodeType: 'CC' }],
      aflowData: [
        {
          'name': '审批节点',
          'type': 'APPROVAL',
          'nodeId': 'sid-approval',
          'jobPositionId': []
        },
        {
          'name': '抄送节点',
          'type': 'CC',
          'nodeId': 'sid-cc',
          'jobPositionId': []
        }
      ],
      itemData: '',
      projectManagementList: [],
      projectName: '请选择',
      PJtabIndex: '',
      openProjectActionsheet: false
    }
  },
  watch: {
    '$route.path': function (newVal, oldVal) {
      if (newVal === '/provisionalApproval/selectApprover') {
        window.removeEventListener('popstate', this.confirmFn, false)
      } else {
        this.setPopstateListener()
      }
    }
  },
  created () {
    if (sessionStorage.getItem('currencyForm')) {
      this.currencyForm = JSON.parse(sessionStorage.getItem('currencyForm'))
    }
    if (sessionStorage.getItem('aflowData')) {
      this.aflowData = JSON.parse(sessionStorage.getItem('aflowData'))
    }
  },
  mounted () {
    this.queryProjectManagement()
    this.setPopstateListener()
  },
  destroyed () {
    MessageBox.close()
    window.removeEventListener('popstate', this.confirmFn, false)
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'approvalCenter') {
      roterFrom = from.name
    }
    next()
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  methods: {
    async queryProjectManagement () {
      const res = await context.http.get('cms/api/project-managements', {useStatus: 'USING'})
      this.projectManagementList = res.data
    },
    selectPJLi (item, index) {
      this.PJtabIndex = index
      this.openProjectActionsheet = false
      this.projectName = item.referred
      this.currencyForm.projectManagementId = item.id
    },
    setPopstateListener () {
      if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL)
        window.addEventListener('popstate', this.confirmFn, false)
      }
    },
    saveFlowData () {
      sessionStorage.setItem('aflowData', JSON.stringify(this.aflowData))
    },
    selectApprover (item) {
      this.itemData = item
      if (item.recordSelected && item.recordSelected.length > 0) {
        sessionStorage.setItem('selectPost', JSON.stringify(item.recordSelected))
      } else {
        sessionStorage.removeItem('selectPost')
      }
      this.$router.push({name: 'selectApprover', query: {'type': item.type}})
    },
    showSheet (item, index) {
      this.nodeIndex = index
      this.show = true
    },
    onSelect (item) {
      if (item.nodeType === 'APPROVAL' || item.nodeType === 'CC') {
        this.addnode(item.nodeType)
      } else {
        this.addBranchWrap(item.nodeType)
      }
    },
    onCancel () {
      console.log('取消')
    },
    addnode (nodeType) {
      const index = this.nodeIndex
      let nodeObj = ''
      let nodeObj2 = ''
      if (nodeType === 'APPROVAL') {
        nodeObj = {
          'type': 'APPROVAL',
          'name': `审批节点`,
          'overtime': '',
          'jobPositionId': [],
          'jobPosition': []}
        nodeObj2 = {
          'type': 'APPROVAL',
          'name': `审批节点`,
          'overtime': '',
          // 'prevId': parent.nodeId,
          'nodeId': Math.random().toString(36).substr(2),
          'jobPositionId': [],
          'jobPosition': []}
      } else if (nodeType === 'CC') {
        nodeObj = {'type': 'CC',
          'name': `抄送节点`,
          'overtime': '',
          'jobPositionId': [],
          'jobPosition': []}
        nodeObj2 = {'type': 'CC',
          'name': `抄送节点`,
          'overtime': '',
          // 'prevId': parent.nodeId,
          nodeId: Math.random().toString(36).substr(2),
          'jobPositionId': [],
          'jobPosition': []}
      }
      this.aflowData.splice(index + 1, 0, nodeObj)
    },
    addBranchWrap (nodeType) {
      let index = this.nodeIndex
      let branchNodeObj = {
        'name': 'branch-warp',
        'type': 'PARALLEL_START_AND',
        'nodeId': Math.random().toString(36).substr(2),
        'prevId': '',
        'childNode': [{}, {}],
        'jobPositionId': [],
        'jobPosition': []
      }
      branchNodeObj.childNode[0] = {
        'name': 'route',
        'type': 'ROUTE',
        'nodeId': Math.random().toString(36).substr(2),
        'prevId': branchNodeObj.nodeId,
        'childNode': [],
        'jobPositionId': [],
        'jobPosition': []
      }
      branchNodeObj.childNode[0].childNode[0] = {
        'name': '审批节点',
        'type': 'APPROVAL',
        'nodeId': Math.random().toString(36).substr(2),
        'prevId': branchNodeObj.childNode[0].nodeId,
        'overtime': '',
        'childNode': [],
        'jobPositionId': [],
        'jobPosition': []
      }
      branchNodeObj.childNode[1] = {
        'name': 'route',
        'type': 'ROUTE',
        'nodeId': Math.random().toString(36).substr(2),
        'prevId': branchNodeObj.nodeId,
        'overtime': '',
        'childNode': [],
        'jobPositionId': [],
        'jobPosition': []
      }
      branchNodeObj.childNode[1].childNode[0] = {
        'name': '审批节点',
        'type': 'APPROVAL',
        'nodeId': Math.random().toString(36).substr(2),
        'prevId': branchNodeObj.childNode[1].nodeId,
        'overtime': '',
        'childNode': [],
        'jobPositionId': [],
        'jobPosition': []
      }
      if (nodeType === 'huiqian') {
        branchNodeObj.type = 'PARALLEL_START_AND'
      } else {
        branchNodeObj.type = 'PARALLEL_START_OR'
      }
      branchNodeObj.prevId = null
      this.aflowData.splice(index + 1, 0, branchNodeObj)
    },
    confirmFn () {
      // if (this.backSelectApprover) return
      let _this = this
      if ((!this.currencyForm.title || this.currencyForm.title === '') &&
        (!this.currencyForm.content || this.currencyForm.content === '') &&
        (!this.currencyForm.annexes || this.currencyForm.annexes.length === 0) &&
        (this.aflowData.length === 2) &&
        (this.aflowData[0].jobPositionId.length === 0 && this.aflowData[1].jobPositionId.length === 0)) {
        this.$router.replace({ name: roterFrom })
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
          sessionStorage.removeItem('currencyForm')
          sessionStorage.removeItem('aflowData')
          _this.$router.replace({ name: roterFrom })
        }
      }).catch(error => {
        if (error === 'cancel') {
          if (window.history && window.history.pushState) {
            history.pushState(null, null, document.URL)
          }
        }
      })
    },
    nameFormat (str) {
      if (!str) return
      if (/^[a-zA-Z]*$/.test(str)) { // 英文
        return str.substring(0, 3)
      } else if (/^[\u4e00-\u9fa5]*$/.test(str)) { // 中文
        return str.substring(str.length - 2)
      } else {
        return str.substring(0, 3)
      }
    },
    pageGetformat (str) {
      return common.getformat(str)
    },
    setAnnex (annexURL, annexName) {
      this.currencyForm.annexes.push({
        'annexName': annexName,
        'annexURL': annexURL
      })
      sessionStorage.setItem('currencyForm', JSON.stringify(this.currencyForm))
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
          _this.currencyForm.annexes.splice(index, 1)
          sessionStorage.setItem('currencyForm', JSON.stringify(this.currencyForm))
        }
      })
    },
    setFile () { },
    showAddnode () {},
    deleteNode (parent, routeChildNodeIndex, item, index) {
      let _this = this
      let nodeArr = []
      parent.forEach(ele => {
        if (ele.type !== 'CC') {
          nodeArr.push(ele.name)
        }
      })
      if (nodeArr.length === 1 && item.type !== 'CC') {
        this.$toast('至少保留一个审批节点')
        return
      }
      MessageBox.confirm('', {
        message: '是否删除该节点？',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        confirmButtonClass: 'confirmButton',
        cancelButtonClass: 'cancelButton'
      }).then(action => {
        if (action === 'confirm') {
          _this.deleteNode2(parent, routeChildNodeIndex, item, index)
        }
      })
    },
    deleteNode2 (parent, routeChildNodeIndex, item, index) {
      parent.splice(index, 1)
    },
    submit () {
      if (!this.currencyForm.title || this.currencyForm.title === '') {
        Toast({
          message: '请输入标题',
          position: 'top'
        })
        return
      } else if (!this.currencyForm.content || this.currencyForm.content === '') {
        Toast({
          message: '请输入正文',
          position: 'top'
        })
        return
      }
      let addData = {
        currencyForm: this.currencyForm
      }
      this.addData = addData
      this.launchApproval()
    },
    launchApproval () {
      this.flag = true
      let aflowData = this.aflowData
      let verifres = this.verification(aflowData)
      if (!verifres) {
        return
      }
      let aflowDataCopy = JSON.parse(JSON.stringify(this.aflowData))
      aflowDataCopy.unshift({'name': '发起人', 'type': 'START', 'nodeId': 'sid-startevent'})
      aflowDataCopy.push({'name': '结束节点', 'type': 'END'})
      this.addData.processFlows = aflowDataCopy
      context.http.post('cms/api/currency-form', this.addData).then(res => {
        if (res.status === 201) {
          sessionStorage.removeItem('currencyForm')
          sessionStorage.removeItem('aflowData')
          Toast({
            message: '新增成功',
            position: 'top'
          })
          this.$router.replace({ name: roterFrom })
        }
      }).catch(error => {
        sessionStorage.removeItem('currencyForm')
        sessionStorage.removeItem('aflowData')
        console.info(error)
      })
    },
    verification (aflowData) {
      for (let i = 0; i < aflowData.length; i++) {
        if ((aflowData[i].type === 'APPROVAL' || aflowData[i].type === 'CC')) {
          if (aflowData[i].jobPositionId.length === 0) {
            Toast({
              message: '审批人或者抄送人不能为空',
              position: 'top',
              className: 'ToastClass'
            })
            this.flag = false
            return false
          }
        } else if (aflowData[i].childNode) {
          this.verification(aflowData[i].childNode)
        }
      }
      return this.flag
    }
  }
}
</script>
<style lang="scss">
@import "../../../style/config";
.ToastClass{
  width: rem(200);
}
#provisionalApproval {
  .actionsheet_wrapper {
    top: rem(40);
    ul.pj-ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-start;
      padding-top: rem(10);
      margin-bottom: rem(40);
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
    ul {
      margin-bottom: rem(40);
    }
  }
  .actionsheet_wrapper {
    li {
      height: rem(37);
      line-height: rem(37);
      color: #444547;
      font-size: rem(15);
      text-align: center;
      position: relative;
      &.selected {
        color: #0139a4;
      }
      .iconfont {
        display: inline-block;
        position: absolute;
        right: rem(12);
      }
    }
    .as-title {
      height: rem(40);
      line-height: rem(40);
      text-align: center;
      color: #18191a;
      font-size: rem(17);
      position: relative;
      .iconfont {
        position: absolute;
        right: rem(12);
        // font-size: rem(14);
      }
    }
    ul {
      max-height: rem(500);
      overflow: scroll;
    }
  }
}
</style>
<style lang="scss" scoped>
@import "../../../style/config";
.provisionalApproval {
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
    .ct-div {
      background-color: #fff;
      height: rem(58);
      display: flex;
      align-items: center;
      padding-left: rem(10);
      span {
        color: #000000;
        flex: 1;
        text-align: right;
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
      padding-left: rem(10);
      margin-top: rem(10);
      textarea {
        width: 100%;
        height: rem(100);
        padding-top: rem(10);
        font-size: rem(15);
        color: rgba(24, 25, 26, 1);
      }
      .contentNum{
        width:100%;
        text-align: right;
        font-size: rem(13);
        color:#858C94;
        margin-top:rem(8);
        padding-right:rem(14);
        padding-bottom:rem(14);
      }
      &.text{
        padding-top: rem(10);
      }
    }
    .project{
      display: flex;
      align-items: center;
      height: rem(50);
      .graywarp{
        flex: 1;
        text-align: right;
        .iconright{
          padding-right: rem(10)
        }
      }
    }
    .attachment {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      height: rem(58);
      .iconfont {
        color: #023c8f;
        font-size: rem(14);
        padding-right: rem(12);
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
  }
  .annexes {
    background-color: #fff;
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
        &:nth-child(2) {
          width: 70%;
          padding-right: rem(10);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        &:last-child {
          font-size: rem(15);
          color: rgba(24, 25, 26, 1);
        }
      }
    }
    .delcl {
      flex: 1;
      text-align: right;
      margin-right: rem(12);
    }
  }
  .c-title{
    height: rem(50);
    line-height: rem(50);
    font-size: rem(17);
    font-weight: bold;
    color: #18191A;
  }
  .dingflow-design{
    border-top: rem(1) solid #F0F0F0;
    padding-bottom: rem(20);
    .node-wrap{
      background: #fff;
    }
    .node-title{
      color: #18191A;
      display: flex;
      align-items: center;
      height: rem(45);
      padding-left: rem(8);
      border-bottom: rem(1) solid #F0F0F0;
      .node-name {
        font-size: rem(15);
        font-weight: bold;
      }
      i {
        flex: auto;
        text-align: right;
        padding-right: rem(16);
      }
    }
    .titleIcon{
      display: inline-block;
      width: rem(8);
      height: rem(8);
      margin-right: rem(4);
      border-radius: 50%;
      border: rem(2) solid #1CC296;
      &.cc-node{
        border: rem(2) solid #0139A4;
      }
    }
    .ds-content{
      padding: rem(10) rem(20);
      .approve-name{
        display: flex;
        justify-content: space-between;
        margin-bottom: rem(10);
        span {
          &:first-child {
            color: #18191A;
            font-size: rem(15);
          }
          color: #0139A4;
          i {
            color: #0139A4;
            margin-right: rem(4);
          }
        }
      }
      .jobPosition{
        .jobPositionLable{
          display: inline-block;
          color: #444547;
          font-size: rem(13);
          background: #DAEAFF;
          border-radius: rem(2);
          padding: rem(4) rem(6);
          margin-right: rem(10);
          margin-bottom: rem(6);
        }
      }
    }
    .add-node-btn-box{
      display: flex;
      flex-direction: column;
      /* align-items: center; */
      background: #F0F1F2;
      span {
        display: inline-block;
        width: rem(1);
        height: rem(10);
        border-left: rem(1) solid #3575F6;
        margin-left: rem(40);
      }
      .add-node-btn{
        color: #3575F6;
        margin-left: rem(28);
        height: rem(28);
        i {
          font-size: rem(16);
        }
        .icon{
          height: rem(28);
        }
      }
    }
  }
}
</style>
