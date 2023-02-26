<template>
  <div class="new-approval-process">
    <div class="step_tab">
      <ul class="nav">
        <span class="iconfont icon-right"
              @click="goBack"></span>
        <li @click="changeNav(index)"
            v-for="(item, index) in navList"
            :key="index"
            :class="item.value ? 'select_active' : ''">{{item.label}}</li>
      </ul>
      <div class="btn-warp"
           v-if="!basicsDesign && !readOnly">
        <span @click="getinnerHTML">预览</span>
        <span @click="saveProcess">保存</span>
      </div>
      <div class="btn-warp"
           v-else-if="!basicsDesign && procType !== 'add'">
        <span @click="readOnly = false">编辑</span>
      </div>
    </div>
    <div class="basics-design"
         v-if="basicsDesign">
      <el-form :model="addData"
               :rules="rules"
               ref="ruleForm">
        <el-form-item prop="organizeId"
                      label="组织">
          <span v-if="procType === 'edit'"
                class="textsapn">{{addData.organizeName}}</span>
          <!-- <el-select v-model="addData.projectManagementId"
                     filterable
                     placeholder="请选择"
                     v-else>
            <el-option v-for="item in projectManagementList"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select> -->
          <el-cascader :options="organizationOptions1"
                      change-on-select
                      v-else
                      style="width:100%;margin-right:15px"
                      expand-trigger="hover"
                      :props="props"
                      v-model="addData.organizeId"
                      ref="cascaderAddr"
                      @change="handleChange1">
        </el-cascader>
        </el-form-item>
        <el-form-item prop="processType"
                      label="审批类型">
          <span v-if="procType === 'edit'"
                class="textsapn">{{addData.typeCn}}</span>
          <el-select v-model="addData.processType"
                     placeholder="请选择"
                     v-else>
            <el-option v-for="item in approvalTypeList"
                       :key="item.id"
                       :label="item.value"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="name"
                      label="审批流程名称">
          <span v-if="procType === 'edit'"
                class="textsapn">{{addData.name}}</span>
          <el-input v-model="addData.name"
                    v-else
                    maxlength="30"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="fd-nav-content"
         style="margin-bottom: 50px;"
         v-else>
      <div class="dingflow-design">
        <div class="ie-polyfill-container">
          <div class="box-scale"
               id="box-scale"
               style="transform: scale(1); transform-origin: 50% 0px 0px;padding-right: 200px;">
            <div v-for="(item, index) in aflowData"
                 :key="index">
              <div class="node-wrap"
                   v-if="item.type === 'START' || item.type === 'APPROVAL' || item.type === 'CC'">
                <div class="node-wrap-box"
                     :class="{'node_sid-startevent start-node': item.type === 'START'}">
                  <div>
                    <div class="title"
                         :class="[item.type === 'START' ? 'approver-start-title': item.type === 'APPROVAL' ? 'approver-title' : 'notifier-title']">
                      <span class="iconfont titleIcon"
                            v-if="item.type !== 'START'"></span><span class="">{{item.name}}</span>
                      <i class="iconfont icon-cha close"
                         @click="deleteNode(aflowData, index, item, index)"
                         v-if="item.type !== 'START' && !readOnly"></i>
                    </div>
                    <div class="content"
                         @click="showApprover(item)"
                         v-if="item.type !== 'START'"
                         :class="{'textcenter': item.type === 'APPROVAL'}">
                      <div class="text"
                           v-if="item.jobPositionLable"
                           :class="{'discontinue': item.jobUsable && !item.jobUsable[0] && item.type === 'APPROVAL'}">
                        <span v-for="(item2, index2) in item.jobPositionLable"
                              :key="index2">{{item2}}<span v-if="item.jobPositionLable.length !== index2 + 1">，</span></span>
                      </div>
                      <div class="text"
                           v-else
                           :class="{'discontinue': item.jobUsable && !item.jobUsable[0] && item.type === 'APPROVAL'}">
                        <span v-for="(item2, index2) in item.jobPosition"
                              :key="index2">{{item2}}<span v-if="item.jobPosition.length !== index2 + 1">，</span></span>
                      </div>
                      <i class="anticon-right arrow iconfont icon-right"
                         v-if="!readOnly"></i>
                    </div>
                    <div class="content"
                         style="text-align: center"
                         v-else>
                      <div class="text">
                        <span>{{item.name}}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="add-node-btn-box">
                  <div class="add-node-btn">
                    <button class="btn"
                            type="button"
                            @click="showAddnode(aflowData, item, index, 'nodeMiddle', $event)"
                            v-if="!readOnly"><span class="iconfont icon-add"></span></button>
                  </div>
                </div>
              </div>
              <branchWrap v-if="item.childNode && (item.type === 'PARALLEL_START_AND' || item.type === 'PARALLEL_START_OR')"
                          :readOnly="readOnly"
                          :parentData="aflowData"
                          :branchData="item"
                          :routeChildNodeIndex="index"
                          @deleteNode="deleteNode"
                          @showAddnode="showAddnode"
                          @addbranch="addbranch"
                          @showApprover="showApprover" />
            </div>
            <div class="end-node">
              <div class="end-node-circle"></div>
              <div class="end-node-text">流程结束</div>
            </div>
          </div>
        </div>
        <!-- 添加审批弹框 -->
        <div style="position: absolute; top: 0px; left: 0px; width: 100%;"
             v-if="showAddNodePopover">
          <div>
            <div class="ant-popover ant-popover-placement-rightTop"
                 :style="{left: popover.left + 'px', top: popover.top + 'px'}">
              <div class="ant-popover-content">
                <div class="ant-popover-arrow"></div>
                <div class="ant-popover-inner"
                     role="tooltip">
                  <div>
                    <div class="ant-popover-inner-content">
                      <div class="add-node-popover">
                        <div class="add-node-popover-header"
                             style="height: 20px;">　
                          <i class="add-node-popover-close iconfont icon-cha close"
                             @click="showAddNodePopover = false"
                             style="font-size: 12px;"></i>
                        </div>
                        <div class="add-node-popover-body">
                          <a class="add-node-popover-item approver"
                             @click="addnode('APPROVAL')">
                            <div class="item-wrapper"><span class="iconfont icon-approver"></span></div>
                            <p>审批人</p>
                          </a>
                          <a class="add-node-popover-item condition"
                             @click="addBranchWrap('huiqian')">
                            <div class="item-wrapper"><span class="iconfont icon-huiqian"></span></div>
                            <p>并行会签</p>
                          </a>
                          <a class="add-node-popover-item condition"
                             @click="addBranchWrap('huoqian')">
                            <div class="item-wrapper"><span class="iconfont icon-huoqian"></span></div>
                            <p>并行或签</p>
                          </a>
                          <a class="add-node-popover-item notifier"
                             @click="addnode('CC')">
                            <div class="item-wrapper"><span class="iconfont icon-CC"></span></div>
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
    <approver :approverdrawershow="approverShow"
              :detailData="itemData"
              @drawerClose="approverClose" />

    <el-dialog title="审批流程预览"
               :visible.sync="dialogVisible"
               :close-on-press-escape="false"
               :close-on-click-modal="false"
               :before-close="handleClose"
               width="60%">
      <span class="process-preview">
      </span>
      <span slot="footer"
            class="dialog-footer">
      </span>
    </el-dialog>

    <div class="addpro-footer">
      <el-button type="primary"
                 @click="goBack"
                 class="close-button"
                 v-if="basicsDesign">返回</el-button>
      <el-button type="primary"
                 @click="lastStep"
                 class="close-button"
                 v-if="!basicsDesign">上一步</el-button>
      <el-button type="primary"
                 @click="newlystepNoe()"
                 class="defaultbtn dialog-confirmBtn"
                 v-if="basicsDesign">下一步</el-button>
    </div>
  </div>
</template>
<script>
import context from '@/service'
import branchWrap from './components/branchWrap.vue'
import approver from './components/approver.vue'
export default {
  name: 'approval',
  components: {
    branchWrap,
    approver
  },
  data () {
    return {
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
      navList: [{ label: '基础信息', value: true }, { label: '流程设置', value: false }],
      basicsDesign: true,
      itemData: {},
      addData: {},
      rules: {
        projectManagementId: [
          { required: false, message: '请选择项目', trigger: 'change' }
        ],
        organizeId: [
          { required: true, message: '请选择组织', trigger: 'change' }
        ],
        processType: [
          { required: true, message: '请选择审批类型', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入审批流程名称', trigger: 'blur' }
        ]
      },
      projectManagementList: [],
      approvalTypeList: [],
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
      organizationOptions1: [], // 组织树
      organizeId: '',
      statusOptions: [
        {
          value: 'USING',
          label: '使用中'
        },
        {
          value: 'DISABLE',
          label: '已停用'
        },
        {
          value: '',
          label: '全部'
        }
      ],
      useStatus: '',
      props: {
        id: 'id',
        name: 'name'
      }
    }
  },
  created () {
    if (this.$route.query.processId) {
      this.queryProcess(this.$route.query.processId)
      this.readOnly = true
      this.procType = 'edit'
    }
  },
  mounted () {
    this.getOrganization1()
    this.queryProjectManagement()
    this.queryApprovalTypeList()
  },
  methods: {
    approverClose () {
      this.approverShow = false
    },
    changeNav (inx) {
    },
    lastStep () {
      this.navList.forEach(item => {
        item.value = false
      })
      this.basicsDesign = true
      this.navList[0].value = true
    },
    handleChange1 (e) {
      this.addData.organizeId = this.addData.organizeId[this.addData.organizeId.length - 1]
      this.$nextTick(() => {
        this.addData.organizeName = this.$refs['cascaderAddr'].presentText
      })
    },
    newlystepNoe () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.navList.forEach(item => {
            item.value = false
          })
          this.navList[1].value = true
          this.basicsDesign = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
    async getOrganization1 () { // 集团人士账号树
      let result = await context.http.get('uaa/api/organizes/tree', { postFlg: false })
      let organizationOptions1 = result.data.organizeTree
      let cascaderData = []
      organizationOptions1.forEach(item => {
        cascaderData.push(this.parseOrganize(item))
      })
      this.organizationOptions1 = cascaderData
    },
    parseOrganize (organizeTree) {
      if (organizeTree.leaf) {
        return { value: organizeTree.data.id, label: organizeTree.data.name }
      } else {
        return {
          value: organizeTree.data.id,
          label: organizeTree.data.name,
          children: organizeTree.children.map(item => {
            return this.parseOrganize(item)
          })
        }
      }
    },
    handleClose () {
      this.dialogVisible = false
      this.readOnly = false
      document.getElementsByClassName('process-preview')[0].innerHTML = ''
    },
    goBack () {
      this.$router.push({ name: 'approvalProcessManagement' })
    },
    queryProcess (id) {
      context.http.get(`/cms/api/process-defines/vm/${id}`).then(res => {
        if (res.data) {
          this.addData = res.data.processDefineDTO
          this.aflowData = res.data.processFlows
        }
      })
    },
    async queryProjectManagement () {
      context.http.get('/cms/api/project-managements', { useStatus: 'USING' }).then(res => {
        this.projectManagementList = res.data
      })
    },
    async queryApprovalTypeList () {
      context.http.get('/uaa/api/paramet-managements/name?name=审批类型').then(res => {
        this.approvalTypeList = res.data
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
    }
  }
}
</script>

<style lang="scss">
@import "../../../style/aflow";
.new-approval-process {
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
          border-bottom: 2px solid #3175d2;
          color: #3175d2;
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
      margin: 40px 0;
    }
    .el-select {
      width: 100%;
    }
    .el-form-item__content {
      margin-left: 130px !important;
    }
    .textsapn {
      position: relative;
      top: 10px;
    }
  }
  .btn-warp {
    span {
      display: inline-block;
      width: 80px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border: 1px solid #3175d2;
      cursor: pointer;
      border-radius: 4px;
      margin-left: 10px;
      color: #3175d2;
      &:hover {
        background-color: #3175d2;
        color: #fff;
      }
    }
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
  .btnBoxhack {
    height: 62px;
  }
  .addpro-footer {
    position: fixed;
    width: calc(100% - 300px);
    bottom: 0;
    right: 32px;
    border-top: 1px solid #e5e5e5;
    background-color: #f5f5f7;
    padding: 20px 0;
    text-align: right;
    margin-top: 20px;
  }
  .discontinue {
    color: red;
  }
}
</style>
