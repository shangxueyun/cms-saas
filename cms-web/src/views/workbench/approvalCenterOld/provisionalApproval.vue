<template>
  <div class="provisional-approval-process">
    <div class="step_tab">
      <ul class="nav">
        <span class="iconfont icon-right" @click="goBack"></span>
        <li
          @click="changeNav(index)"
          v-for="(item, index) in navList"
          :key="index"
          :class="item.value ? 'select_active' : ''"
        >
          {{ item.label }}
        </li>
      </ul>
    </div>
    <div class="basics-design" v-if="basicsDesign">
      <el-form :model="addData" :rules="rules" ref="ruleForm">
        <el-form-item
          style="margin-top: 70px"
          prop="currencyForm.title"
          label="标题"
        >
          <el-input
            placeholder="请输入内容"
            v-model="addData.currencyForm.title"
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item prop="currencyForm.content" label="正文">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入500字以内"
            maxlength="500"
            resize="none"
            v-model="addData.currencyForm.content"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="项目" class="notrequired">
          <el-select
            v-model="addData.currencyForm.projectManagementId"
            placeholder="请选择项目"
            clearable
          >
            <el-option
              v-for="item in projectManagementsList"
              :key="item.id"
              :label="item.referred"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <div class="enclosure">
          <span style="display: block; width: 60px; color: #777">附件</span>
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex: 1;
            "
          >
            <aliUpload
              class="aliUpload deviceDetails"
              :upLoadText="
                addData.currencyForm.annexes.length > 0
                  ? '继续上传'
                  : '上传附件'
              "
              :fileType="fileType"
              :iconShow="false"
              :iconImg="iconImg"
              :uploadIcon="true"
              :multiple="true"
              @setAnnex="setAnnexs"
            />
            <div class="annexList" style="70%">
              <div
                v-for="(item, index) in addData.currencyForm.annexes"
                :key="index"
              >
                <span
                  style="
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  "
                  >{{ item.annexName }}</span
                >
                <span style="display: flex">
                  <ailPreview
                    :ailObj="item"
                    :encrypt="true"
                    @setFile="setFile"
                  />
                  <i
                    @click="deleFile(item, index)"
                    class="iconfont icon-lajixiang"
                  ></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div class="fd-nav-content" style="margin-bottom: 50px" v-else>
      <div class="dingflow-design">
        <div class="ie-polyfill-container">
          <div
            class="box-scale"
            id="box-scale"
            style="
              transform: scale(1);
              transform-origin: 50% 0px 0px;
              padding-right: 200px;
            "
          >
            <div v-for="(item, index) in aflowData" :key="index">
              <div
                class="node-wrap"
                v-if="
                  item.type === 'START' ||
                  item.type === 'APPROVAL' ||
                  item.type === 'CC'
                "
              >
                <div
                  class="node-wrap-box"
                  :class="{
                    'node_sid-startevent start-node': item.type === 'START',
                  }"
                >
                  <div>
                    <div
                      class="title"
                      :class="[
                        item.type === 'START'
                          ? 'approver-start-title'
                          : item.type === 'APPROVAL'
                          ? 'approver-title'
                          : 'notifier-title',
                      ]"
                    >
                      <span
                        class="iconfont titleIcon"
                        v-if="item.type !== 'START'"
                      ></span
                      ><span class="">{{ item.name }}</span>
                      <i
                        class="iconfont icon-cha close"
                        @click="deleteNode(aflowData, index, item, index)"
                        v-if="item.type !== 'START' && !readOnly"
                      ></i>
                    </div>
                    <div
                      class="content"
                      @click="showApprover(item)"
                      v-if="item.type !== 'START'"
                      :class="{ textcenter: item.type === 'APPROVAL' }"
                    >
                      <div
                        class="text"
                        v-if="item.jobPositionLable"
                        :class="{
                          discontinue:
                            item.jobUsable &&
                            !item.jobUsable[0] &&
                            item.type === 'APPROVAL',
                        }"
                      >
                        <span
                          v-for="(item2, index2) in item.jobPositionLable"
                          :key="index2"
                          >{{ item2
                          }}<span
                            v-if="item.jobPositionLable.length !== index2 + 1"
                            >，</span
                          ></span
                        >
                      </div>
                      <div
                        class="text"
                        v-else
                        :class="{
                          discontinue:
                            item.jobUsable &&
                            !item.jobUsable[0] &&
                            item.type === 'APPROVAL',
                        }"
                      >
                        <span
                          v-for="(item2, index2) in item.jobPosition"
                          :key="index2"
                          >{{ item2
                          }}<span v-if="item.jobPosition.length !== index2 + 1"
                            >，</span
                          ></span
                        >
                      </div>
                      <i
                        class="anticon-right arrow iconfont icon-right"
                        v-if="!readOnly"
                      ></i>
                    </div>
                    <div class="content" style="text-align: center" v-else>
                      <div class="text">
                        <span>{{ item.name }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="add-node-btn-box">
                  <div class="add-node-btn">
                    <button
                      class="btn"
                      type="button"
                      @click="
                        showAddnode(
                          aflowData,
                          item,
                          index,
                          'nodeMiddle',
                          $event
                        )
                      "
                      v-if="!readOnly"
                    >
                      <span class="iconfont icon-add"></span>
                    </button>
                  </div>
                </div>
              </div>
              <branchWrap
                v-if="
                  item.childNode &&
                  (item.type === 'PARALLEL_START_AND' ||
                    item.type === 'PARALLEL_START_OR')
                "
                :readOnly="readOnly"
                :parentData="aflowData"
                :branchData="item"
                :routeChildNodeIndex="index"
                @deleteNode="deleteNode"
                @showAddnode="showAddnode"
                @addbranch="addbranch"
                @showApprover="showApprover"
              />
            </div>
            <div class="end-node">
              <div class="end-node-circle"></div>
              <div class="end-node-text">流程结束</div>
            </div>
          </div>
        </div>
        <!-- 添加审批弹框 -->
        <div
          style="position: absolute; top: 0px; left: 0px; width: 100%"
          v-if="showAddNodePopover"
        >
          <div>
            <div
              class="ant-popover ant-popover-placement-rightTop"
              :style="{ left: popover.left + 'px', top: popover.top + 'px' }"
            >
              <div class="ant-popover-content">
                <div class="ant-popover-arrow"></div>
                <div class="ant-popover-inner" role="tooltip">
                  <div>
                    <div class="ant-popover-inner-content">
                      <div class="add-node-popover">
                        <div
                          class="add-node-popover-header"
                          style="height: 20px"
                        >
                          　
                          <i
                            class="
                              add-node-popover-close
                              iconfont
                              icon-cha
                              close
                            "
                            @click="showAddNodePopover = false"
                            style="font-size: 12px"
                          ></i>
                        </div>
                        <div class="add-node-popover-body">
                          <a
                            class="add-node-popover-item approver"
                            @click="addnode('APPROVAL')"
                          >
                            <div class="item-wrapper">
                              <span class="iconfont icon-approver"></span>
                            </div>
                            <p>审批人</p>
                          </a>
                          <a
                            class="add-node-popover-item condition"
                            @click="addBranchWrap('huiqian')"
                          >
                            <div class="item-wrapper">
                              <span class="iconfont icon-huiqian"></span>
                            </div>
                            <p>并行会签</p>
                          </a>
                          <a
                            class="add-node-popover-item condition"
                            @click="addBranchWrap('huoqian')"
                          >
                            <div class="item-wrapper">
                              <span class="iconfont icon-huoqian"></span>
                            </div>
                            <p>并行或签</p>
                          </a>
                          <a
                            class="add-node-popover-item notifier"
                            @click="addnode('CC')"
                          >
                            <div class="item-wrapper">
                              <span class="iconfont icon-CC"></span>
                            </div>
                            <p>抄送人</p>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="process-bottom" v-if="basicsDesign">
      <span style="background: none" class="details_cannelBtn" @click="goBack"
        >返回</span
      >
      <span class="details_submitBtn" @click="changeNav(1)">下一步</span>
    </div>
    <div class="process-bottom" v-else>
      <span
        style="background: none"
        class="details_cannelBtn"
        @click="changeNav(0)"
        >上一步</span
      >
      <span class="details_submitBtn" @click="launchApproval">发起审批</span>
    </div>
    <approver
      :approverdrawershow="approverShow"
      :detailData="itemData"
      @drawerClose="approverClose"
    />

    <!-- 图片预览 -->
    <picturePrevie
      v-if="showPicture"
      :imgList="imgArr"
      @pictureClose="pictureClose"
    ></picturePrevie>
  </div>
</template>
<script>
import context from '@/service'
import aliUpload from '@/components/aliUpload.vue'
import branchWrap from '@/views/administrator/approvalProcessManagement/components/branchWrap.vue'
import approver from '@/views/administrator/approvalProcessManagement/components/approver.vue'
import ailPreview from '@/components/ailPreview.vue'
import picturePrevie from '@/components/picturePrevie.vue'
export default {
  name: 'approval',
  components: {
    branchWrap,
    approver,
    aliUpload,
    ailPreview,
    picturePrevie
  },
  data () {
    return {
      iconImg: 'icon-shangchuanfujianicon',
      upLoadText: '',
      fileType: [],
      procType: 'add',
      readOnly: false,
      dialogVisible: false,
      approverShow: false,
      showAddNodePopover: false,
      popover: { left: 0, top: 0 },
      selectedObj: '',
      selectedIdx: '',
      selectedNodeParams: {},
      selectedBranchParams: {},
      navList: [{ label: '填写待审批内容', value: true }, { label: '配置临时审批流程', value: false }],
      basicsDesign: true,
      itemData: {},
      addData: {
        currencyForm: {
          title: '',
          content: '',
          projectManagementId: null,
          annexes: []
        }
      },
      projectManagementsList: [],
      rules: {
        'currencyForm.title': [
          { required: true, message: '请输入标题', trigger: 'change' }
        ],
        'currencyForm.content': [
          { required: true, message: '请输入正文', trigger: 'change' }
        ]
      },
      aflowData: [
        {
          'name': '发起人',
          'type': 'START',
          'nodeId': 'sid-startevent'
        },
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
      flag: true,
      imgArr: [],
      showPicture: false
    }
  },
  created () {
    if (this.$route.query.processId) {
      this.queryProcess(this.$route.query.processId)
      this.readOnly = true
      this.procType = 'edit'
    }
    this.projectManagementsList = this.$store.state.projectManagementsList
  },
  mounted () {
  },
  methods: {
    setFile (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    pictureClose () {
      this.showPicture = false
    },
    setAnnexs (annexURL, annexName) {  // 子组件上传成功返回文件url 和名字
      this.addData.currencyForm.annexes.push({
        'annexName': annexName,
        'annexURL': annexURL
      })
    },
    approverClose () {
      this.approverShow = false
    },
    changeNav (inx) {
      if (inx === 0) {
        this.navList.forEach(item => {
          item.value = false
        })
        this.basicsDesign = true
        this.navList[inx].value = true
      } else if (inx === 1) {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.navList.forEach(item => {
              item.value = false
            })
            this.navList[inx].value = true
            this.basicsDesign = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    showApprover (item) {
      if (this.readOnly) {
        return
      }
      // console.log(item)
      this.itemData = item
      this.approverShow = true
      this.showAddNodePopover = false
    },
    getinnerHTML () {
      this.dialogVisible = true
      this.readOnly = true
      setTimeout(function () {
        var test = document.getElementsByClassName('fd-nav-content')[0].innerHTML
        document.getElementsByClassName('process-preview')[0].innerHTML = test
      }, 100)
    },
    handleClose () {
      this.dialogVisible = false
      this.readOnly = false
      document.getElementsByClassName('process-preview')[0].innerHTML = ''
    },
    goBack () {
      this.$router.push({ name: 'approvalCenter', params: { onRent: this.$route.params.onRent } })
    },
    queryProcess (id) {
      context.http.get(`/cms/api/process-defines/vm/${id}`).then(res => {
        // console.log(res.data)
        if (res.data) {
          this.addData = res.data.processDefineDTO
          this.aflowData = res.data.processFlows
        }
      })
    },
    saveProcess () {
      this.flag = true
      let aflowData = this.aflowData
      if (aflowData.length === 1) {
        return
      }
      let verifres = this.verification(aflowData)
      // console.log('verifres', verifres)
      if (!verifres) {
        return
      }
      if (this.procType === 'edit') {
        let postData = {}
        postData.processDefineDTO = this.addData
        postData.processFlows = this.aflowData
        // console.log('postData', postData)
        context.http.put('/cms/api/process-defines', postData).then(res => {
          if (res.data) {
            this.goBack()
          }
        })
      } else {
        this.aflowData.push({ 'name': '结束节点', 'type': 'END' })
        // console.log('addData', this.addData)
        // console.log('aflowData', this.aflowData)
        let postData = {}
        postData.processDefineDTO = this.addData
        postData.processFlows = this.aflowData
        // console.log('postData', postData)
        context.http.post('/cms/api/process-defines', postData).then(res => {
          if (res.data) {
            this.goBack()
          }
        })
      }
    },
    showAddnode (parent, item, index, type, e) {
      this.popover.left = e.clientX + 20
      this.popover.top = e.clientY - 65 + document.querySelectorAll('.fd-nav-content')[0].scrollTop
      this.showAddNodePopover = true
      this.selectedNodeParams.parent = parent
      this.selectedNodeParams.item = item
      this.selectedNodeParams.index = index
      this.selectedNodeParams.type = type
    },
    addnode (nodeType) {
      let parent = this.selectedNodeParams.parent
      let item = this.selectedNodeParams.item
      let index = this.selectedNodeParams.index
      let type = this.selectedNodeParams.type
      // console.log(item, type, index)
      // console.log('parent', parent)
      let nodeObj = ''
      let nodeObj2 = ''
      if (nodeType === 'APPROVAL') {
        nodeObj = {
          'type': 'APPROVAL',
          'name': `审批节点`,
          'overtime': '',
          'jobPositionId': [],
          'jobPosition': []
        }
        nodeObj2 = {
          'type': 'APPROVAL',
          'name': `审批节点`,
          'overtime': '',
          'prevId': parent.nodeId,
          'nodeId': Math.random().toString(36).substr(2),
          'jobPositionId': [],
          'jobPosition': []
        }
      } else if (nodeType === 'CC') {
        nodeObj = {
          'type': 'CC',
          'name': `抄送节点`,
          'overtime': '',
          'jobPositionId': [],
          'jobPosition': []
        }
        nodeObj2 = {
          'type': 'CC',
          'name': `抄送节点`,
          'overtime': '',
          'prevId': parent.nodeId,
          nodeId: Math.random().toString(36).substr(2),
          'jobPositionId': [],
          'jobPosition': []
        }
      }
      let aflowData = this.aflowData
      if (!item.prevId && type !== 'nodeEnd') { // 没有prevId的数据添加(主流程)
        this.aflowData.splice(index + 1, 0, nodeObj)
      } else if (!item.prevId && type === 'nodeEnd') { // 主流程分支合并后的添加(主流程结束)
        parent.splice(index + 1, 0, nodeObj)
      } else if (item.prevId && type === 'nodeEnd') { // 分支合并后的添加
        parent.childNode.splice(index + 1, 0, nodeObj2)
      } else if (item.prevId && type !== 'nodeEnd') {
        parent.childNode.splice(index + 1, 0, nodeObj2)
      }
      this.showAddNodePopover = false
    },
    addbranch (parentData, item) {
      if (this.readOnly) {
        return
      }
      // console.log('item', item)
      let obj = {
        'name': '并行分支',
        'type': 'ROUTE',
        'prevId': item.nodeId,
        'nodeId': Math.random().toString(36).substr(2),
        'jobPositionId': [],
        'jobPosition': []
      }
      let childNode = [{
        'name': '审批节点',
        'type': 'APPROVAL',
        'prevId': '',
        'overtime': '',
        'nodeId': Math.random().toString(36).substr(2),
        'jobPositionId': [],
        'jobPosition': []
      }]
      let objnodeId = obj.nodeId
      childNode[0].prevId = objnodeId
      obj.childNode = childNode
      item.childNode.push(obj)
      // console.log('aflowData', this.aflowData)
      this.showAddNodePopover = false
    },
    addBranchWrap (nodeType) {
      let parent = this.selectedNodeParams.parent
      let item = this.selectedNodeParams.item
      let index = this.selectedNodeParams.index
      let type = this.selectedNodeParams.type
      // console.log(item, type, index)
      // console.log('parent', parent)
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
      if (parent.childNode && parent.childNode.length > 0) {
        branchNodeObj.prevId = parent.nodeId
        parent.childNode.splice(index + 1, 0, branchNodeObj)
      } else {
        branchNodeObj.prevId = null
        parent.splice(index + 1, 0, branchNodeObj)
      }
      this.showAddNodePopover = false
    },
    deleteNode (parent, routeChildNodeIndex, item, index) {
      // console.log(item, index)
      // console.log('parent', parent, routeChildNodeIndex)
      if (parent.type && parent.type === 'ROUTE' && index === 0) { // 并行开始的第一节点删除则删除整个父对象
        let selectedObj = this.findParentArr(this.aflowData, parent)
        let selectedObj1 = this.selectedObj
        let selectIndex1 = this.selectedIdx // 所在父级数组中的位置
        // console.log('selectedObj1', selectedObj1, selectIndex1)
        // 父级的父级，用来删除父级对象
        let selectedObj2 = this.findParentArr(this.aflowData, this.selectedObj)
        let selectedObj21 = this.selectedObj
        let selectIndex2 = this.selectedIdx
        // console.log('selectedObj2', selectedObj21, selectIndex2)
        // 如果并行条件只有两条则删除整个并行分支，否则删除当前分支
        if (selectedObj1.childNode.length === 2 && selectedObj21.childNode) {
          selectedObj21.childNode.splice(selectIndex1, 1)
        } else if (selectedObj1.childNode.length === 2) {
          selectedObj21.splice(selectIndex1, 1) // 最外层json
        } else if (selectedObj1.childNode.length > 2) {
          selectedObj1.childNode.splice(routeChildNodeIndex, 1)
        }
      } else if (parent.childNode && parent.childNode.length >= 2) {
        parent.childNode.splice(index, 1)
      } else if (parent.childNode && parent.childNode.length <= 2) {

      } else if (!parent.childNode) {
        parent.splice(index, 1)
      }
    },
    findParentArr (aflowData, item) { // 查找父级对象
      if (!item) {
        return
      }
      let items = item
      let selectedObj = ''
      let selectedIdx = ''
      if (!items.prevId) {
        this.selectedObj = aflowData
        return this.selectedObj
      }
      for (let i = 0; i < aflowData.length; i++) {
        if (aflowData[i].nodeId === (items.prevId ? items.prevId : items.nodeId)) {
          selectedObj = aflowData[i]
          selectedIdx = i
          this.selectedObj = selectedObj
          this.selectedIdx = selectedIdx
          // console.log('aa', selectedObj, selectedIdx)
          return // 跳出循环（）
        } else if (aflowData[i].childNode && aflowData[i].childNode.length > 0) {
          this.findParentArr(aflowData[i].childNode, items)
        }
      }
    },
    verification (aflowData) {
      for (let i = 0; i < aflowData.length; i++) {
        if ((aflowData[i].type === 'APPROVAL' || aflowData[i].type === 'CC')) {
          if (aflowData[i].jobPositionId.length === 0) {
            this.$message.error('审批人或者抄送人不能为空')
            this.flag = false
            return false
          }
        } else if (aflowData[i].childNode) {
          this.verification(aflowData[i].childNode)
        }
      }
      return this.flag
    },
    deleFile (item, index) {
      this.addData.currencyForm.annexes.splice(index, 1)
    },
    launchApproval () {
      this.flag = true
      let aflowData = this.aflowData
      let verifres = this.verification(aflowData)
      if (!verifres) {
        return
      }
      this.aflowData.push({ 'name': '结束节点', 'type': 'END' })
      this.addData.processFlows = this.aflowData
      context.http.post('/cms/api/currency-form', this.addData).then(res => {
        if (res.data) {
          this.goBack()
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import "../../../style/aflow";
.provisional-approval-process {
  .step_tab {
    height: 60px;
    display: flex;
    background-color: #fff;
    margin: 10px 0 0px 0;
    box-shadow: 1px 2px 5px #eee;
    border-radius: 3px;
    justify-content: space-between;
    align-items: center;
    padding-right: 44px;
    border-bottom: 1px solid #ecedef;
    .nav {
      display: flex;
      li {
        width: 160px;
        text-align: center;
        font-size: 14px;
        color: #666;
        height: 58px;
        line-height: 58px;
        border-bottom: 2px solid #fff;
        cursor: pointer;
        &.select_active {
          border-bottom: 3px solid #3575f6;
          color: #3575f6;
          font-weight: bolder;
        }
      }
      .icon-right {
        -webkit-transform: rotate(180deg);
        -moz-transform: rotate(180deg);
        -o-transform: rotate(180deg);
        -ms-transform: rotate(180deg);
        transform: rotate(180deg);
        line-height: 58px;
        width: 50px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
  .basics-design {
    width: 50%;
    margin: 0 auto;
    margin-top: 20px;
    .el-form-item {
      margin: 30px 0;
    }
    .el-select {
      width: 100%;
    }
    .el-form-item__content {
      margin-left: 60px !important;
    }
    .el-form-item__label {
      color: #777;
    }
    .el-form-item__label:before {
      content: "" !important;
      margin: 0 !important;
    }
    .is-required{
      .el-form-item__label:after {
        content: "*";
        color: red;
      }
    }
    .textsapn {
      position: relative;
      top: 10px;
    }
    .enclosure {
      display: flex;
      .aliUploads {
        opacity: 0;
        top: -20px;
        position: relative;
      }
      .upload {
        display: inline-block;
        width: 70px;
        text-align: center;
        height: 20px;
        line-height: 20px;
        margin: 0 auto;
        color: #0f75ff;
        border: 1px solid #0f75ff;
        border-radius: 4px;
        background-color: #fff;
        position: relative;
        margin-left: 30px;
        font-size: 12px;
      }
      input {
        position: absolute;
        right: 0;
        width: 100%;
        height: 20px;
        opacity: 0;
        cursor: pointer;
      }
    }
  }
  .process-bottom {
    position: fixed;
    width: calc(100% - 300px);
    bottom: 0;
    right: 32px;
    background-color: #f9f9f9;
    padding: 20px 0;
    text-align: right;
    // span{
    //   display: inline-block;
    //   margin-right: 10px;
    //   line-height: 40px;
    //   text-align: center;
    //   cursor: pointer;
    //   &:first-child{
    //     width:100px;
    //     height:40px;
    //     background:rgba(243,244,250,1);
    //     border-radius:4px;
    //     color: #777;
    //   }
    //   &:last-child{
    //     width:130px;
    //     height:40px;
    //     background:rgba(53,119,246,1);
    //     border-radius:4px;
    //     color: #fff;
    //   }
    // }
  }
  .node-wrap-box {
    border-radius: 6px;
    > div {
      border-radius: 6px;
    }
    &:after {
      border-radius: 6px;
    }
    .title {
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
    }
    .close {
      font-size: 10px;
    }
  }
  .add-node-btn .btn {
    background-color: #3175d2 !important;
    width: 26px !important;
    height: 26px !important;
    line-height: 26px !important;
  }
  .approver-title .titleIcon {
    background: url(../../../assets/jiedian.png) no-repeat;
  }
  .notifier-title .titleIcon {
    background: url(../../../assets/chaosong.png) no-repeat;
  }
  .item-wrapper {
    > span {
      display: inline-block;
      width: 40px;
      height: 40px;
    }
    .icon-approver {
      background: url(../../../assets/custom-chapter.png) no-repeat;
    }
    .icon-huiqian {
      background: url(../../../assets/tiaojianfenzhi.png) no-repeat;
    }
    .icon-huoqian {
      background: url(../../../assets/huoqian.png) no-repeat;
    }
    .icon-CC {
      background: url(../../../assets/chaosong2.png) no-repeat;
    }
  }
  .discontinue {
    color: red;
  }
  .annexList {
    width: 80%;
    // margin-left: 15px;
    > div {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      border-bottom: 1px solid #eaeaea;
      padding-bottom: 5px;
      i {
        cursor: pointer;
      }
    }
  }
  .deviceDetails {
    width: 100px;
    height: 100px;
    margin-right: 15px !important;
    .oss_file {
      width: 100%;
      height: 100%;
      border: none;
      background-color: rgba(247, 249, 253, 1);
      border: 1px solid rgba(234, 234, 234, 1);
      border-radius: 4px;
      color: #3575f6;
      > i {
        font-size: 20px;
        position: absolute;
        top: -5px;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
      }
      > span {
        position: absolute;
        top: 18px;
        left: 0;
        right: 0;
        font-size: 12px;
      }
      > input {
        right: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
        width: 100%;
        height: 100%;
        position: absolute;
      }
    }
  }
}
</style>
