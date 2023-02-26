<template>
  <div class="tenant-details">
    <drawer :show="detailsdrawershow"
            :title="tenantDetailAame"
            class="new_vue_drawer"
            :wrapperClosable="false"
            @on-hide="onHide('close')">
      <div class="tenant-details details-content"
           slot="drawer"
           id="adminUnit">
        <div class="adminUnit_top">
          <div class="basicInfo">
            <p class="title"><i></i>基本信息</p>
            <div class="dweditbtn"
                 v-if="readOnly"
                 @click="edit"><i class="iconfont icon-edit1"></i>编辑</div>
            <div class="content">
              <el-form>
                <el-form-item prop="deptName">
                  <div class="cttitle" v-if="relationType !== 'OTHER'">{{tenantDetailAame}}</div>
                  <div class="cttitle" v-else>单位名称</div>
                  <span v-if="readOnly"
                        class="txt">{{tenantDetail.name}}</span>
                  <el-input v-else
                            v-model="tenantDetail.name"
                            style="width:300px"
                            maxlength="20"></el-input>
                </el-form-item>
                <el-form-item v-if="relationType === 'CONSTRUCTION_UNIT'">
                  <div class="cttitle">施工内容</div>
                  <span v-if="readOnly"
                        class="txt">{{tenantDetail.content}}</span>
                  <el-input v-else
                            v-model="tenantDetail.content"
                            style="width:300px"
                            maxlength="100"></el-input>
                </el-form-item>
                <el-form-item prop="address">
                  <div class="cttitle">联系人</div>
                  <span v-if="readOnly"
                        class="txt">{{tenantDetail.contacts}}</span>
                  <el-input v-else
                            v-model="tenantDetail.contacts"
                            style="width:300px"
                            maxlength="50"></el-input>
                </el-form-item>
                <el-form-item v-if="relationType !== 'OTHER'">
                  <div class="cttitle">联系人职务</div>
                  <span v-if="readOnly"
                        class="txt">{{tenantDetail.contactsPost}}</span>
                  <el-input v-else
                            v-model="tenantDetail.contactsPost"
                            style="width:300px"></el-input>
                </el-form-item>
                <el-form-item v-if="relationType !== 'OTHER'">
                  <div class="cttitle">手机号</div>
                  
                  <span v-if="readOnly"
                        class="txt">{{tenantDetail.telephone}}</span>
                  <el-input v-else
                            v-model="tenantDetail.telephone"
                            type="number"
                            style="width:300px"></el-input>
                </el-form-item>
                <el-form-item>
                  <div class="cttitle" v-if="relationType !== 'OTHER'">公司固话</div>
                  <div class="cttitle" v-else>联系人电话</div>
                  <span class="txt" v-if="readOnly">{{tenantDetail.fixedTel}}</span>
                  <el-input v-else
                            v-model="tenantDetail.fixedTel"
                            type="tel"
                            style="width:300px"></el-input>
                </el-form-item>

                <el-form-item>
                  <div class="cttitle">备注</div>
                  <span style="word-wrap: break-word;word-break: normal;"
                        v-html="formatreplace(tenantDetail.remark)"
                        v-if="readOnly"
                        class="txt">{{tenantDetail.remark}}</span>
                  <el-input class="adminTextear"
                            v-else-if="!readOnly && relationType !== 'OTHER'"
                            type="textarea"
                            placeholder="请输入500字以内"
                            resize="none"
                            maxlength="500"
                            v-model="tenantDetail.remark"
                            style="width:300px;height:66px;"></el-input>
                  <el-input class="adminTextear"
                            v-else
                            type="textarea"
                            placeholder="请输入100字以内"
                            resize="none"
                            maxlength="100"
                            v-model="tenantDetail.remark"
                            style="width:300px;height:66px;"></el-input>
                </el-form-item>
              </el-form>
              <div style="padding-right:0;"
                   slot="footer"
                   v-if="!readOnly"
                   class="dialog-footer">
                <el-button style="padding:12px 5px;width:60px;background:#ffffff!important;border:0;"
                           @click="onHide('cancel')"
                           class="close-button">取消</el-button>
                <el-button style="padding:12px 5px;width:60px!important;margin-left:0;"
                           type="primary"
                           @click="editTenant('tenantDetail')"
                           class="defaultbtn dialog-confirmBtn">保存</el-button>
              </div>
            </div>
          </div>
          <div class="collapse">
            <p class="title"><i></i>附件</p>
            <span class="iconfont icon-shangchuanfujianicon emergencyAliUpload">
              <aliUpload class="aliUpload"
                         style="display: inline-block;"
                         :upLoadText="upLoadText_data"
                         :fileSize="fileSize"
                         :fileType="fileType_data"
                         :iconShow="false"
                         @setAnnex="setAnnex_data" />
            </span>
            <div class="collapseContent">
              <div class="annexesHead">
                <span style="width:200px;">文件名</span>
                <span style="width:160px;">上传时间</span>
                <span style="width:80px;">操作</span>
              </div>
              <div style="padding:0;"
                   v-for="(item,index) in tenantDetailAnnexes"
                   :key="index">
                <span style="width:200px;"
                      :title="item.annexName">{{item.annexName}}</span>
                <span style="width:160px;"
                      v-if="item.createTime">{{item.createTime.substring(0, 19).replace('T', ' ')}}</span>
                <span style="width:90px;display: inline-flex;justify-content: flex-end;">
                  <aliDownLoad :item="item"
                               style="margin-right:10px;display: inline-block;width:auto;height:auto" />
                  <ailPreview :ailObj="item"
                              :encrypt="true"
                              @setFile="setFile"
                              style="display: inline-block;width:auto;height:auto" />
                  <i class="iconfont icon-lajixiang"
                     @click="dataDel(item.id)"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="recordList">
          <p class="title"><i></i>记录信息 </p>
          <div class="addbtn"
               @click="addflowList"><i class="iconfont icon-cms_xiegenjin-1"></i>新增记录</div>
          <div class="timelineDiv">
            <el-timeline class="timeline"
                         v-if="timeLineListData.length>0">
              <el-timeline-item style="position:relative;min-height: 80px;"
                                v-for="(item, index) in timeLineListData"
                                :key="index"
                                size="normal"
                                :color="nodeColor(index)">
                <div class="timeLineBox">
                  <div class="recodeIcon"
                       v-if="index===0">记录</div>
                  <div :class="{'first':index===0, 'timeLineTip': true}"
                       v-if="item.followTime">{{formatApprovalDate(item.followTime)}}</div>
                </div>
                <div class="template">
                  <p><span>记录人：</span>{{item.followAccount}}</p>
                  <p><span>标题：</span>{{item.title}}</p>
                  <p><span>发生内容：</span><span v-html="formatreplace(item.followContent)"
                          style="color: #777"></span></p>
                  <div class="annexes">
                    <p v-for="(items, i) in item.annexes"
                       :key="i">
                      <span>{{items.annexName}}</span>
                      <aliDownLoad :item="items"
                                   style="margin: 0 5px;display: inline-block;width:auto;height:auto" />
                      <ailPreview :ailObj="items"
                                  :encrypt="true"
                                  @setFile="setFile"
                                  style="display: inline-block;width:auto;height:auto" />
                    </p>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
            <!-- <span v-else>暂无数据</span> -->
          </div>
        </div>
      </div>
    </drawer>

    <el-dialog class="flowListDialoag"
               title="新增记录"
               :visible.sync="flowListDialoagVisible"
               :close-on-click-modal="false"
               width="700px"
               @close="showflowLisClose">
      <div class="content">
        <el-form :model="addList"
                 ref="addList"
                 :rules="addListRules">
          <div class="clearing">
            <el-form-item style="width:300px;float:left;"
                          prop="followTime">
              <div class="cttitle">发生时间<i class="required">*</i></div>
              <el-date-picker style="width:300px"
                              v-model="addList.followTime"
                              type="datetime"
                              value-format="yyyy-MM-ddTHH:mm:ss"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item style="width:300px;float:right;">
              <div class="cttitle">标题</div>
              <el-input v-model="addList.title"
                        style="width:300px"
                        maxlength="20"></el-input>
            </el-form-item>
          </div>
          <el-form-item prop="followContent"
                        style="width: 100%">
            <div class="cttitle">内容<i class="required">*</i></div>
            <el-input class="adminTextarea"
                      v-model="addList.followContent"
                      maxlength="500"
                      placeholder="500字以内"
                      type="textarea"
                      resize="none"></el-input>
          </el-form-item>
          <div style="margin-bottom:25px;"
               class="collapse">
            <div class="collapseTitle">
              <span>附件</span>
              <span class="iconfont icon-shangchuanfujianicon emergencyAliUpload">
                <aliUpload class="aliUpload"
                           style="display: inline-block;"
                           :upLoadText="upLoadText_data"
                           :fileSize="fileSize"
                           :fileType="fileType_data"
                           :iconShow="false"
                           @setAnnex="setAnnex_data2" />
              </span>
            </div>
            <div class="collapseContents">
              <div v-for="(item,index) in addList.annexes"
                   :key="index">
                <span>{{item.annexName}}</span>
                <span>
                  <i class="iconfont icon-lajixiang"
                     @click="dataDel(index, 'flowList')"></i>
                </span>
              </div>
            </div>
          </div>
          <!-- 跟进里的消息推送 -->
          <el-form-item style="width: 100%">
            <div class="cttitle">消息推送</div>
            <span class="sendIfo">不发送</span>
            <el-switch style="margin:0 12px;"
                       v-model="switchTurn"
                       active-color="#91CF48"
                       inactive-color="#EAECF0"
                       @change="changeSwitch">
            </el-switch>
            <span class="sendIfo">发送</span>
          </el-form-item>
          <el-form-item v-if="switchTurn"
                        style="width: 100%">
            <div class="cttitle">收件人<i class="required">*</i></div>
            <div class="select-wrap">
              <div class="select-span">
                <span v-for="(item, index) in selectSpan"
                      :key="index">{{item.userName ? item.userName : item.userPostName}} <i class="iconfont icon-cha"
                     @click="delSelect(item)"></i></span>
              </div>
              <i class="iconfont icon-bottom"
                 @click="organizationShow=!organizationShow"
                 :class="{'icon-top': organizationShow}"></i>
            </div>
            <transition name="sub-comments">
              <div class="organization"
                   v-show="organizationShow">
                <el-input placeholder="请输入组织名称/员工姓名"
                          prefix-icon="el-icon-search"
                          v-model="filterText"
                          class=""></el-input>
                <el-tree :data="orgListCopy"
                         show-checkbox
                         node-key="nodeId"
                         :render-after-expand="false"
                         :default-checked-keys="checkedKeys"
                         :filter-node-method="filterNode"
                         @check-change="handleCheckChange"
                         ref="treeForm"
                         :props="defaultProps">
                </el-tree>
              </div>
            </transition>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="showflowLisClose"
                   class="close-button">取消</el-button>
        <el-button @click="addflowLis('addList')"
                   type="primary"
                   class="defaultbtn dialog-confirmBtn">确定</el-button>
      </div>
    </el-dialog>

    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   @pictureClose="pictureClose"></picturePrevie>
    <!-- 确认删除弹窗 -->
    <el-dialog :visible.sync="DELDialogVisible"
               class="lockDialogClose"
               width="21%">
      <div class="lockDialogContent">
        <img src="../../../../assets/delete1.png">
        <div>
          <p>删除附件</p>
          <span>确定删除该附件吗？</span>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <span @click="DELDialogVisible = false">取 消</span>
        <span @click="delFun">确 定</span>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import Drawer from '@/components/drawer.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import aliUpload from '@/components/aliUpload.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import ailPreview from '@/components/ailPreview.vue'
export default {
  components: {
    Drawer,
    aliDownLoad,
    aliUpload,
    picturePrevie,
    ailPreview
  },
  props: {
    projectManagementId: {},
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number
    },
    relateType: {
      type: String
    }
  },
  watch: {
    filterText (val) {
      this.$refs.treeForm.filter(val)
    }
  },
  data () {
    var validateTel = (rule, value, callback) => {
      let reg = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/
      if (value === '' || value === undefined) {
        // callback(new Error('请输入部门电话'))
        callback()
      } else if (!reg.test(value)) {
        callback(new Error('格式错误'))
      } else {
        callback()
      }
    }
    var validateUrl = (rule, value, callback) => {
      let reg = new RegExp(/^[hH][tT][tT][pP]([sS]?):\/\/(\S+\.)+\S{2,}$/)
      if (value === '' || value === undefined) {
        // callback(new Error('请输入官方网址'))
        callback()
      } else if (!reg.test(value)) {
        callback(new Error('格式错误'))
      } else {
        callback()
      }
    }
    return {
      relationType: '',
      DELDialogVisible: false,
      showPicture: false,
      imgArr: [],
      tenantDetailRules: {
        officialUrl: [
          { validator: validateUrl, trigger: 'blur' }
        ],
        deptTel: [
          { validator: validateTel, trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '请输入主管部门', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入办公地址', trigger: 'blur' }
        ]
      },
      addListRules: {
        followTime: [
          { required: true, message: '请输入发生时间', trigger: 'blur' }
        ],
        followContent: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      drawerTitle: '',
      readOnly: true,
      upLoadText_data: '上传附件',
      fileSize: 100,
      fileType_data: [],
      timeLineListData: [],
      tenantDetail: {},
      tenantDetailAnnexes: [],
      flowListDialoagVisible: false,
      switchTurn: false,
      selectSpan: [],
      organizationShow: false,
      filterText: '',
      orgListCopy: [],
      checkedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      activeNames: '1',
      addList: { // 新增记录信息
        followTime: '',
        title: '',
        followContent: '',
        annexes: []
      }
    }
  },
  created () {
    console.log(this.projectManagementId, this.relateType, this.id)
    if (this.relateType === 'propertyOwnerRelation') {
      this.relationType = 'PROPERTY_OWNER'
      this.tenantDetailAame = '产权人'
    } else if (this.relateType === 'bulidUnitRelation') {
      this.relationType = 'BULID_UNIT'
      this.tenantDetailAame = '项目建设单位'
    } else if (this.relateType === 'designUnitRelation') {
      this.relationType = 'DESIGN_UNIT'
      this.tenantDetailAame = '项目设计单位'
    } else if (this.relateType === 'supervisorRelation') {
      this.relationType = 'SUPERVISOR_UNIT'
      this.tenantDetailAame = '监理单位'
    } else if (this.relateType === 'relations') {
      this.relationType = 'CONSTRUCTION_UNIT'
      this.tenantDetailAame = '施工单位'
    } else if (this.relateType === 'otherRelations') {
      this.relationType = 'OTHER'
      this.tenantDetailAame = '其他'
    }
    if (!this.id) return
    this.relationDetail()
    this.queryOrganizeList()
  },
  mounted () {

  },
  methods: {
    pictureClose () {
      this.showPicture = false
    },
    setFile (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    formatApprovalDate (time) {
      if (time) {
        time = time.substr(0, time.lastIndexOf('T'))
        return time
      }
    },
    relationDetail () {
      context.http.get(`/cms/api/project-managements/relation/${this.id}`).then(res => {
        if (res.status === 200) {
          this.tenantDetail = res.data
          // this.timeLineListData = res.data.chargeDeptRecords
        }
      })
      this.getTenantDetailAnnexes()
      this.getTimeLineListData()
    },
    getTenantDetailAnnexes () {
      context.http.get(`/cms/api/annexes?projectManagementRelationId=${this.id}`).then(res => {
        if (res.status === 200) {
          this.tenantDetailAnnexes = res.data
        }
      })
    },
    getTimeLineListData () {
      context.http.get(`/cms/api/followRecords/${this.id}?followBusinessType=PROJECT_MANAGEMENT_RELATION
      `).then(res => {
        if (res.status === 200) {
          this.timeLineListData = res.data
        }
      })
    },
    nodeColor (index) {
      return index === 0 ? '#3575F6' : '#D3DBEB'
    },
    addflowList () {
      // 参数为主管部门id
      this.flowListDialoagVisible = true
    },
    editTenant () {
      const reg = /^1(3|4|5|7|8)\d{9}$/
      if (this.relations && this.relations.telephone && this.tenantDetail.telephone.length !== 0 && !reg.test(this.tenantDetail.telephone)) {
        this.$message.error('请输入正确的手机号！')
        return
      }
      this.tenantDetail.projectManagementId = this.projectManagementId
      this.tenantDetail.relationType = this.relationType
      context.http.post('/cms/api/project-managements/relation', this.tenantDetail).then(res => {
        if (res.status === 200) {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          if (!this.id) {
            this.id = res.data.id
          }
          this.$nextTick(() => {
            this.onHide('cancel')
            // this.relationDetail()
          })
        }
      })
    },
    onHide (state) {
      if (state === 'cancel') {
        this.readOnly = true
        this.relationDetail()
        return
      }
      this.$emit('update:detailsdrawershow', false)
      this.$emit('handleEdit')
    },
    edit () {
      this.readOnly = false
    },
    setAnnex_data (annexURL, annexName) { // 资料存档上传
      const annexes = {
        projectManagementRelationId: this.id,
        annexURL: annexURL,
        annexName: annexName
      }
      context.http.post(`/cms/api/annexes`, annexes).then(res => {
        if (res.status === 201) {
          this.getTenantDetailAnnexes()
          this.$forceUpdate()
        }
      })
    },
    dataDel (index, type) {
      if (type === 'flowList') {
        this.addList.annexes.splice(index, 1)
        return
      }
      this.delId = index
      this.DELDialogVisible = true
    },
    delFun () {
      context.http.delete(`/cms/api/annexes/${this.delId}`).then(res => {
        if (res.status === 200) {
          this.DELDialogVisible = false
          this.getTenantDetailAnnexes()
        }
      })
    },
    formatreplace (description) {
      if (!description) {
        return
      }
      let html = description.replace(/\n/g, '<br/>')
      return html
    },
    setAnnex_data2 (annexURL, annexName) {
      this.addList.annexes.push({
        annexURL: annexURL,
        annexName: annexName
      })
    },
    showflowLisClose () {
      this.addList = { // 新增记录信息
        followTime: '',
        title: '',
        followContent: '',
        annexes: []
      }
      this.selectSpan = []
      this.switchTurn = false
      this.filterText = ''
      this.$refs['addList'].resetFields()
      this.flowListDialoagVisible = false
    },
    changeSwitch (val) {
      this.selectSpan = []
      this.$message({
        message: '切换成功',
        type: 'success'
      })
    },
    async queryOrganizeList () {
      this.orgListCopy = []
      context.http.get('/uaa/api/organizes/report').then(res => {
        if (res.status === 200) {
          this.orgList = res.data
          this.orgListCopy = JSON.parse(JSON.stringify(res.data))
          let cascaderData = []
          this.orgListCopy.forEach(item => {
            cascaderData.push(this.parseOrganize(item))
          })
          this.orgListCopy = cascaderData
        }
      })
    },
    handleCheckChange (data, checked, indeterminate) {
      let selectSpan = this.selectSpan
      if (checked && !data.disabled && data.userId !== null) {
        selectSpan.push(data)
      } else {
        selectSpan.forEach((ele, index) => {
          if (ele.nodeId === data.nodeId) {
            selectSpan.splice(index, 1)
          }
        })
      }
      this.selectSpan = selectSpan
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    parseOrganize (organizeTree) {
      if (organizeTree.reporterDTOList.length === 0) {
        return {
          userPostId: organizeTree.postId,
          userPostName: organizeTree.name,
          userName: organizeTree.userName,
          userId: organizeTree.userId,
          nodeId: organizeTree.nodeId,
          // label: (organizeTree.userName === null ? '' : organizeTree.userName) + '(' + (organizeTree.name === null ? '' : organizeTree.name) + ')',
          label: this.formateName(organizeTree),
          disabled: organizeTree.name === ''
        }
      } else {
        return {
          userPostId: organizeTree.postId,
          label: this.formateName(organizeTree),
          userPostName: organizeTree.name,
          userName: organizeTree.userName,
          userId: organizeTree.userId,
          nodeId: organizeTree.nodeId,
          disabled: organizeTree.name === '',
          children: organizeTree.reporterDTOList.map(item => {
            return this.parseOrganize(item)
          })
        }
      }
    },
    formateName (organizeTree) {
      let str = ''
      if (organizeTree.userName === null) {
        str = ''
      } else {
        str += organizeTree.userName
      }
      if (organizeTree.userName === null && organizeTree.name === null) {
        str += ''
      } else if (organizeTree.userName === null && organizeTree.name !== null) {
        str += organizeTree.name
      } else if (organizeTree.userName !== null && organizeTree.name !== null) {
        str += '(' + organizeTree.name + ')'
      }
      return str
    },
    // 收件人
    delSelect (data) {
      let selectSpan = this.selectSpan
      selectSpan.forEach((ele, index) => {
        if (ele.nodeId === data.nodeId) {
          this.selectSpan.splice(index, 1)
          this.$refs.treeForm.setChecked(ele, false)
        }
      })
    },
    addflowLis () {
      if (this.selectSpan.length === 0 && this.switchTurn) {
        this.$message.error('请选择收件人！')
        return
      }
      let arr = []
      this.selectSpan.forEach(ele => {
        arr.push(ele.userId)
      })
      arr = [...new Set(arr)]
      this.addList.messageFlg = this.switchTurn
      this.addList.userIds = arr
      this.addList.businessId = this.id
      this.addList.followBusinessType = 'PROJECT_MANAGEMENT_RELATION'
      this.$refs['addList'].validate((valid) => {
        if (valid) {
          this.addList.followTime = this.addList.followTime.replace(' ', 'T') + '.000Z'
          context.http.post('/cms/api/followRecord', this.addList).then(res => {
            if (res.status === 201) {
              this.showflowLisClose()
              this.getTimeLineListData()
              this.$message({
                type: 'success',
                message: '添加成功'
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scope>
.tenant-details {
  .el-input__inner {
    height: 32px;
  }
  .el-input__icon {
    line-height: 32px;
  }
  .close-button:hover {
    color: #3577f6 !important;
  }
  .details-content {
    &#adminUnit {
      width: 1110px;
      .adminUnit_top {
        width: 450px;
      }
    }
    .title {
      font-size: 16px;
      font-weight: bolder;
      padding-left: 26px;
      height: 40px;
      line-height: 40px;
      background-color: #fff;
      border-bottom: 1px solid #f6f6f6;
      position: relative;
      color: #262626;
      i {
        display: block;
        position: absolute;
        left: 15px;
        top: 12px;
        width: 4px;
        height: 16px;
        border-radius: 2px;
        background: #3575f6;
      }
    }
    .basicInfo {
      width: 450px;
      border-radius: 2px;
      position: relative;
      background: #fff;
      .dweditbtn {
        font-size: 12px;
        border-radius: 4px;
        cursor: pointer;
        position: absolute;
        right: 20px;
        top: 12px;
        color: #3575f6;
        .icon-edit1 {
          // width: 15px;
          // height: 20px;
          margin-right: 4px;
          line-height: 16px;
          // background: url(../../../../assets/bianji-hover.png) no-repeat;
          // background-size: contain;
        }
      }
      .content {
        padding: 15px 15px;
        height: 420px;
        .el-form {
          text-align: center;
          height: 328px;
          overflow-y: auto !important;
          overflow-x: hidden;
          .el-form-item {
            width: 100%;
            margin-bottom: 25px;
          }
          .el-form-item__content {
            display: flex;
            align-items: unset !important;
            .cttitle {
              margin-bottom: 0px;
              width: 84px !important;
              margin-right: 10px;
              text-align: left;
              color: #777777;
            }
            .txt {
              display: inline-block;
              width: 300px;
              text-align: left;
            }
            .el-form-item__error {
              width: 100%;
              text-align: center;
            }
          }
        }
        .el-form::-webkit-scrollbar {
          width: 4px !important;
          height: 4px !important;
        }
        .el-form::-webkit-scrollbar-track {
          box-shadow: inset 0 0 6px #fff;
          background-color: #fff;
        }
        .el-form::-webkit-scrollbar-thumb {
          border-radius: 10px;
          box-shadow: inset 0 0 6px #cccccc;
        }
        .dialog-footer {
          margin-top: 25px;
          height: auto;
        }
        .head_contacts {
          width: 100%;
          background: #f7f8fa;
          height: 40px;
          display: flex;
          margin-bottom: 5px;
          span {
            display: block;
            width: 110px;
            line-height: 40px;
            margin-right: 18px;
            color: #777777;
            &:last-child {
              width: 148px;
            }
          }
        }
        .body_contacts {
          display: block;
          display: flex;
          border-bottom: 1px solid #f6f6f6;
          .el-form-item {
            margin-bottom: 5px;
            margin-top: 5px;
            width: 110px;
            margin-right: 18px;
            position: relative;
            .txt {
              width: 110px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              text-align: center;
              height: 40px;
              line-height: 40px;
            }
          }
          .el-form-item:last-child {
            width: 148px;
            .txt {
              width: 148px;
            }
          }
          .el-input__inner {
            padding: 8px;
          }
          .toolContent {
            position: absolute;
            right: -14px;
            top: 10px;
            cursor: pointer;
            i {
              font-size: 18px;
              color: #d92e20;
            }
          }
        }
        .addItem {
          text-align: right;
          height: 20px;
          display: flex;
          justify-content: flex-end;
          margin-top: 5px;
          padding-right: 10px;
          box-sizing: border-box;
          span {
            display: flex;
            cursor: pointer;
            span {
              color: #3575f6;
              line-height: 20px;
              font-size: 16px;
              display: block;
              height: 20px;
            }
            span:last-child {
              font-size: 12px;
              margin-left: 4px;
              line-height: 18px;
              text-decoration: underline;
            }
          }
        }
      }
    }
    .recordList {
      width: 610px;
      border-radius: 2px;
      margin-left: 15px;
      position: relative;
      .annexes {
        color: #005cb3;
        .icon-download {
          cursor: pointer;
        }
      }
      .addbtn {
        position: absolute;
        right: 0px;
        top: 40px;
        z-index: 2;
        height: 26px;
        background: #eef4ff;
        border: 1px solid #9fbfff;
        border-radius: 26px;
        line-height: 26px;
        font-size: 12px;
        color: #3575f6;
        padding-left: 16px;
        width: 82px;
        margin-top: 20px;
        margin-right: 20px;
        i {
          display: block;
          position: absolute;
          left: 9px;
          top: 0;
          font-size: 12px;
          line-height: 26px;
        }
      }
      .timelineDiv {
        display: flex;
        padding: 35px 0 20px;
        padding-left: 180px;
        width: 100%;
        position: relative;
        left: 0;
        right: 0;
        height: 740px;
        overflow-y: auto !important;
        background: #fff;
        .timeline {
          .downLoad {
            height: 26px;
            line-height: 26px;
            border: 1px solid #d3dbeb;
            border-radius: 12px;
            padding: 0px 10px;
            width: 150px;
            display: flex;
            justify-content: space-between;
            > i {
              font-size: 14px;
              font-style: normal;
              color: #005cb3;
            }
          }
          p {
            font-size: 14px;
            color: #777777;
            span {
              color: #262626;
            }
          }
          .annexes {
            p {
              color: #005cb3;
              span {
                color: #005cb3;
              }
            }
          }
          .imgBox {
            width: 40px;
            height: 40px;
            position: absolute;
            left: 30px;
            top: 12px;
            > .userImg {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              cursor: pointer;
            }
            .noImg {
              width: 40px;
              height: 40px;
              line-height: 40px;
              border-radius: 50%;
              background-color: #3575f6;
              color: #ffffff;
              font-size: 12px;
              cursor: pointer;
              padding: 0 5px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              text-align: center;
            }
            .noNameNoImg {
              width: 40px;
              height: 40px;
            }
          }
          .timeLineBox {
            position: absolute;
            left: -160px;
            top: 0;
            width: 150px;
            text-align: center;
            display: flex;
            flex-direction: column;
            font-size: 12px;
            > .recodeIcon {
              background-color: #3575f6;
              color: #fff;
              border-radius: 4px;
              display: inline-block;
              width: 60px;
              height: 20px;
              line-height: 20px;
            }
            .timeLineTip {
              top: 0px;
            }
            > div {
              position: absolute;
              right: 0;
            }
            > .first {
              color: #3575f6 !important;
              top: 30px;
            }
          }
          p {
            margin-bottom: 5px;
          }
        }
      }
      > .timelineDiv::-webkit-scrollbar {
        width: 4px !important;
        height: 4px !important;
      }
      > .timelineDiv::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px #fff;
        background-color: #fff;
      }
      > .timelineDiv::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 6px #cccccc;
      }
    }
  }

  .collapse {
    background: #fff;
    width: 450px;
    margin-top: 15px;
    position: relative;
    > span {
      display: block;
      width: 80px;
      height: 24px;
      border: 1px solid rgba(15, 117, 255, 1);
      border-radius: 4px;
      position: absolute;
      right: 15px;
      top: 8px;
      color: rgba(15, 117, 255, 1);
      line-height: 24px;
      padding-left: 6px;
      > div {
        display: block !important;
        position: absolute;
        right: 0;
        top: 0;
      }
      .oss_file {
        height: 24px;
        line-height: 24px;
        width: 80px;
        cursor: pointer;
        input {
          font-size: 0;
          cursor: pointer;
        }
        span {
          width: 60px;
          display: block;
          position: absolute;
          right: 0;
          top: 0;
          line-height: 24px;
        }
      }
    }
    .collapseTitle {
      width: 100%;
      display: flex;
      justify-content: flex-start;
    }
    .collapseContent {
      font-size: 12px;
      width: 100%;
      padding: 15px;
      height: 266px;
      overflow: auto;
      > div {
        width: 100%;
        padding: 0 15px;
        height: 40px;
        display: flex;
        align-items: center;
        > span {
          width: 120px;
          display: block;
          text-align: center;
          i {
            cursor: pointer;
          }
          &:first-child {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        > span:nth-child(2) {
          width: 150px;
        }
      }
      .annexesHead {
        background: #f7f8fa;
        padding: 0;
        color: #777777;
      }
    }
    .collapseContents {
    }
  }
  .new_vue_drawer {
    .drawer-head {
      background: #fff;
      margin: 0;
      padding: 20px 30px 20px 30px;
    }
    .drawer {
      background: #f7f7f7;
    }
    .tenant-details {
      padding-top: 15px;
      padding-left: 20px;
      padding-right: 20px;
      display: flex;
      justify-content: space-between;
    }
  }
  .adminTextear {
    textarea {
      height: 100px !important;
    }
  }
  .flowListDialoag {
    .el-dialog__body {
      margin: 0 35px !important;
      background-color: #fff;
    }
    .el-textarea textarea {
      width: 100%;
      height: 100px !important;
    }
    .el-collapse-item__header {
      height: 40px;
      line-height: 40px;
      background-color: #fafafa;
      font-size: 14px;
    }
    .collapse {
      width: 100%;
      .collapseTitle {
        padding: 0;
        width: 100%;
        display: flex;
        justify-content: flex-start;
      }
      .collapseContents {
        > div {
          padding: 0 15px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #eeeeee;
          > span {
            i {
              cursor: pointer;
            }
            &:first-child {
              display: inline-block;
              width: 300px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          // &:last-child{
          //   border-bottom:0;
          // }
        }
      }
      .emergencyAliUpload {
        display: block;
        width: 90px;
        height: 26px;
        border: 1px solid #0f75ff;
        border-radius: 4px;
        color: #0f75ff;
        line-height: 25px;
        padding-left: 6px;
        margin-left: 10px;
      }
    }
    .content {
      padding: 20px 0;
      .el-form-item {
        margin-bottom: 25px !important;
      }
    }
  }
  .lockDialogClose {
    .el-dialog__body {
      background: #fff;
    }
    .lockDialogContent {
      display: -ms-flexbox;
      display: flex;
      justify-content: center;
      div {
        margin-left: 15px;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        flex-direction: column;
        justify-content: space-evenly;
        p {
          color: #666666;
          font-size: 20px;
          font-weight: 600;
          width: 100%;
        }
      }
    }
    .el-dialog__footer {
      .dialog-footer {
        border: none;
        margin-right: 0;
      }
    }
  }
}
</style>
