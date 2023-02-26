<template>
  <div class="followDetails">
    <drawer class="drawer_new"
            :show="BooleanFlag"
            @on-edit="onEdit"
            :title="ConfigObject.title"
            @on-hide="onHide">
      <div class="details_content drawer-body"
           slot="drawer">
        <div class="main_content timeline_content "
             style="height:100%;padding:0;background-color: #fff;">
          <div class="writeRecord">
            <span @click="dialogVisible = true;queryOrganizeList()"><i class="iconfont icon-cms_xiegenjin-1"></i>写跟进</span>
          </div>
          <el-timeline class="timelineBox"
                       v-if="timeLineListData.length"
                       style="padding: 30px 182px 0px 250px;">
            <el-timeline-item placement="top"
                              style="position:relative;"
                              v-for="(item, index) in timeLineListData"
                              :key="index"
                              :color="nodeColor(index)">
              <div class="statusBox">
                <!-- <div :class="{'first':index===0}">{{formatApprovalDate(item.followTime)}}</div> -->
                <div class="icon">跟进</div>
                <div :class="{'first':index===0}"
                     style="top:25px">{{item.createdDate}}</div>
              </div>
              <div class="template">
                <p v-if="item.followRecordType==='FOLLOW'"><span>跟进人：</span><span>{{item.followName}}</span></p>
                <p v-if="item.followRecordType==='FOLLOW'"><span>跟进时间：</span><span>{{formatApprovalDate(item.followTime)}}</span></p>
                <p v-if="item.followRecordType==='FOLLOW'"><span>标题：</span><span v-html="formatreplace(item.title)"></span></p>
                <p v-if="item.followRecordType==='FOLLOW'"><span>内容：</span><span v-html="formatreplace(item.followContent)"></span></p>
                <div class="annexesList"
                     v-for="(item2, idx2) in item.annexes"
                     :key="idx2">
                  <span class="annexName"
                        :title="item2.annexName">{{item2.annexName}}</span>
                  <aliDownLoad class="aliDownLoad1"
                               style="margin-right:15px"
                               :item="item2"
                               :encrypt="true" />
                  <ailPreview :ailObj="item2"
                              :encrypt="true"
                              @setFile="setFile" />

                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
          <div class="noRecord"
               style="padding: 80px 20px;text-align: center;"
               v-else>暂无记录</div>
        </div>
      </div>
    </drawer>

    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>

    <el-dialog title="写跟进"
               :visible.sync="dialogVisible"
               class="storeDetailisdialog store_flow_new"
               @close="dialogVisibleClose"
               width="500px">
      <div>
        <el-form :model="ruleForm"
                 :rules="rules"
                 ref="ruleForm">
          <el-form-item prop="followTime">
            <span>时间 <i class="required">*</i></span>
            <el-date-picker v-model="ruleForm.followTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            :picker-options="pickerOptions"
                            value-format="yyyy-MM-ddTHH:mm:ss"
                            style="margin-top:15px;width:100%;"></el-date-picker>
          </el-form-item>
          <el-form-item prop="title">
            <span>标题 <i class="required">*</i></span>
            <el-input type="textarea"
                      v-model="ruleForm.title"
                      style="height:auto;margin-top:15px;"
                      maxlength="15"
                      placeholder="15字以内"></el-input>
          </el-form-item>
          <el-form-item prop="followContent">
            <span>内容 <i class="required">*</i></span>
            <el-input type="textarea"
                      v-model="ruleForm.followContent"
                      style="height:auto;margin-top:15px;"
                      maxlength="200"
                      placeholder="200字以内"></el-input>
          </el-form-item>
          <div>
            <!-- <div class="followSend">
              <span>消息推送 </span>
              <el-switch v-model="ruleForm.send" active-text="不发送" inactive-text="发送"></el-switch>
            </div> -->
            <div class="enclosure"
                 style="width:100%">
              <div class="enclosure-head"
                   style="width: 130px;border-bottom:none">附件
                <div style="opacity:1;margin-left:0;"
                     class="iconfont icon-shangchuanfujianicon upload"> 上传附件
                  <aliUpload class="aliUpload aliUploadFlow"
                             style="display: inline-block;"
                             :upLoadText="upLoadText"
                             :fileType="fileType_cost"
                             :iconShow="false"
                             @setAnnex="setAnnexs" />
                </div>
              </div>
              <div class="enclosure-list enclosure-list-flow"
                   v-for="(item, index) in ruleForm.annexes"
                   :key="index">
                <div class="el-item">
                  <span style="padding-left: 0">{{item.annexName}}</span>
                  <span style="width: 5%;"
                        v-if="item.annexName">
                    <ailPreview :ailObj="item"
                                :encrypt="true"
                                @setFile="showImg" />
                  </span>
                  <span v-if="item.annexName">
                    <i style="cursor:pointer"
                       @click="deleFileFlow(item, index)"
                       class="iconfont icon-lajixiang"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <!-- 跟进里的消息推送 -->
          <el-form-item>
            <div class="cttitle">消息推送</div>
            <span class="sendIfo"
                  :class="{'red': !ruleForm.send}">不发送</span>
            <el-switch style="margin:0 12px;"
                       v-model="ruleForm.send"
                       active-color="#91CF48"
                       inactive-color="#EAECF0"
                       @change="changeSwitch">
            </el-switch>
            <span class="sendIfo"
                  :class="{'blue': ruleForm.send}">发送</span>
          </el-form-item>
          <el-form-item v-if="ruleForm.send">
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
      <span slot="footer"
            class="dialog-footer">
        <span class="details_cannelBtn"
              @click="dialogVisibleClose">取消</span>
        <span class="details_submitBtn"
              style="background-color: #3575F6;color: #fff;"
              @click="addRecord">确定</span>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import aliUpload from '@/components/aliUpload.vue'
import ailPreview from '@/components/ailPreview.vue'
import picturePrevie from '@/components/picturePrevie.vue'
export default {
  name: 'followDetails',
  components: {
    Drawer,
    ailPreview,
    aliDownLoad,
    aliUpload,
    picturePrevie
  },
  props: {
    BooleanFlag: {
      type: Boolean,
      default: false
    },
    ConfigObject: {
      type: Object,
      default: {}
    },
    DetailsData: {
      type: Object,
      default: {}
    }
  },
  created () {
    this.projectOptions
    this.getRoomsFollowRecord()
  },
  watch: {
    BooleanFlag: {
      handler (newValue, oldValue) {
        if (newValue) {
          this.getRoomsFollowRecord()
        }
      }
    },
    filterText (val) {
      this.$refs.treeForm.filter(val)
    }
  },
  data () {
    return {
      showTips: false,
      readOnly: true,
      timeLineListData: [],
      dialogVisible: false,
      upLoadText: '',
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      ruleForm: {
        followTime: '',
        followContent: '',
        title: '',
        send: false,
        annexes: []
      },
      rules: {
        followTime: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        followContent: [
          { required: true, message: '请输入内容', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'change' }
        ]
      },
      readOnlyImg: false, // 做编辑图片回显
      fileSize: 2,
      tableData: [],
      projectManagementId: '',
      value: '',
      projectOptions: [],
      drawerTitle: '商品种类详情',
      iconImg: 'icon-shangchuantupianicon',
      upLoadText_cost: '上传图片',
      fileType_cost: [],
      imgArr: [],
      num: 0,
      showPicture: false,
      showshelfLife: false,
      statusSList: [
        { referred: '启用', value: 'USING' },
        { referred: '禁用', value: 'DISABLE' }
      ],
      saleOptions: [
        { label: '是', value: true },
        { label: '否', value: false }
      ],
      checkList: [],
      switchTurn: false,
      selectSpan: [],
      organizationShow: false,
      filterText: '',
      orgListCopy: [],
      checkedKeys: [],
      activeNames: ['1'],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted () {

  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    getRoomsFollowRecord () { // 查询房源跟进记录
      context.http.get(`/cms/api/queryTaskFollowRecords/${this.DetailsData.id}`).then(res => {
        this.timeLineListData = res.data
      })
    },
    formatTimeLineTitle (type) { // 时间线头部遍历
      switch (type) {
        case 'INPUT':
          return '录入'
        case 'FOLLOW':
          return '跟进'
        case 'PROCESS_RUNING':
          return '审批中'
        case 'PROCESS_AGREED':
          return '审批通过'
      }
    },
    formatreplace (description) {
      if (!description) {
        return
      }
      let html = description.replace(/\n/g, '<br/>')
      html = html.replace(/↵/g, '<br/>')
      return html
    },
    formatApprovalDate (time) {
      if (time) {
        time = time.substr(0, time.lastIndexOf('T'))
        return time
      }
    },
    nodeColor (index) {
      return index === 0 ? '#3575F6' : '#D3DBEB'
    },
    setFile (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    dialogVisibleClose () {
      this.filterText = ''
      this.ruleForm.annexes = []
      this.$refs['ruleForm'].resetFields()
      this.dialogVisible = false
    },
    setAnnexs (annexURL, annexName) {
      this.ruleForm.annexes.push({ 'annexURL': annexURL, 'annexName': annexName })
    },
    deleFileFlow (item, index) {
      this.ruleForm.annexes.splice(index, 1)
    },
    addRecord () {
      if (this.selectSpan.length === 0 && this.ruleForm.send) {
        this.$message.error('请选择收件人！')
        return
      }
      let arr = []
      this.selectSpan.forEach(ele => {
        arr.push(ele.userId)
      })
      arr = [...new Set(arr)]
      const userIds = arr
      let vm = this
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.ruleForm.annexes.forEach(v => {
            v = v.annexURL
          })
          let { id, taskId } = this.DetailsData
          if (vm.ruleForm.followTime.indexOf('.000Z') === -1) {
            vm.ruleForm.followTime = vm.ruleForm.followTime + '.000Z'
          }
          vm.ruleForm = Object.assign(vm.ruleForm, { businessId: id, taskId, messageFlg: true, userIds: userIds })
          context.http.put('/cms/api/createTaskFollowRecord', vm.ruleForm).then(res => {
            if (res.status === 201 || res.status === 200) {
              this.$message.success('添加成功')
              this.dialogVisibleClose()
              this.getRoomsFollowRecord()
              this.ruleForm.send = false
            }
          }).catch(error => {
            console.info(error)
          })
        }
      })
    },
    onHide () {
      this.readOnly = true
      this.showshelfLife = false
      this.showTips = false
      this.$emit('drawerClose', false)
    },
    pictureClose () {
      this.showPicture = false
    },
    showImg (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    onEdit () {
      this.readOnly = false
    },
    changeSwitch (val) {
      this.selectSpan = []
      // this.$message({
      //   message: '切换成功',
      //   type: 'success'
      // })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
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
    async queryOrganizeList () {
      this.orgList = []
      this.orgListCopy = []
      context.http.get('/uaa/api/organizes/report').then(res => {
        if (res.status === 200) {
          this.orgList = res.data
          this.orgListCopy = JSON.parse(JSON.stringify(this.orgList))
          let cascaderData = []
          this.orgListCopy.forEach(item => {
            cascaderData.push(this.parseOrganize(item))
          })
          this.orgListCopy = cascaderData
        }
      })
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
    delSelect (data) {
      let selectSpan = this.selectSpan
      selectSpan.forEach((ele, index) => {
        if (ele.nodeId === data.nodeId) {
          this.selectSpan.splice(index, 1)
          this.$refs.treeForm.setChecked(ele, false)
        }
      })
    }
  }
}
</script>
<style lang="scss" >
.followDetails {
  .el-table::before {
    height: 0;
  }
}
</style>
<style lang="scss" scoped>
.followDetails {
  .main_content {
    .contentItem {
      padding: 15px;
      display: flex;
      flex-wrap: wrap;
      justify-content: end;
      background-color: #fff;
      margin-bottom: 15px;
      min-height: 200px;
      overflow-y: auto;
      > .item {
        width: 30%;
        font-size: 14px;
        margin-bottom: 20px;
        margin-right: 14px;
        > span {
          display: inline-block;
          color: #777777;
          margin-bottom: 10px;
        }
        > p {
          color: #262626;
          word-break: break-word;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.followDetails {
  .dialog-footer {
    > span {
      display: inline-block;
      color: #777777;
      height: 34px;
      line-height: 34px;
      text-align: center;
      padding: 0 21px;
      cursor: pointer;
      background: rgba(243, 244, 250, 1);
      border-radius: 4px;
      margin-left: 10px;
      &.saveBtn {
        border: 1px solid rgba(53, 117, 246, 1);
        color: #3575f6;
      }
      &.saveSubmit,
      &.passBtn {
        background: rgba(53, 117, 246, 1);
        color: #fff;
      }
      &.rejectBtn {
        color: #e0434e;
        background: rgba(253, 235, 237, 1);
        border: 1px solid #c1bdbd;
      }
    }
  }
  .details_content {
    width: 750px;
    height: 100%;
    .el-form {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .el-form-item {
        width: 30%;
        .el-form-item__content {
          > span {
            margin-bottom: 5px;
            display: inline-block;
            height: 25px;
            display: -ms-flexbox;
            display: flex;
            -ms-flex-align: center;
            align-items: center;
            font-size: 14px;
            color: #777777;
          }
          > p {
            color: #262626;
            font-size: 14px;
            height: 40px;
            line-height: 40px;
          }
          .tips {
            font-size: 12px;
            color: #999999;
            margin-top: 10px;
          }
        }
        .deviceDetails {
          width: 140px;
          height: 120px;
          margin-right: 0px !important;
        }
      }
    }
    .timeline_content {
      // height: 350px;
      // overflow-y: auto;
      .writeRecord {
        height: 35px;
        line-height: 35px;
        margin-top: 20px;
        text-align: right;
        padding-right: 20px;
        color: #3575f6;
        > span {
          display: inline-block;
          width: 82px;
          height: 26px;
          line-height: 26px;
          text-align: center;
          background: rgba(238, 244, 255, 1);
          border: 1px solid rgba(159, 191, 255, 1);
          border-radius: 14px;
          cursor: pointer;
        }
      }
      .timelineBox {
        width: 100%;
        padding-left: 150px;
        padding-top: 30px;
        height: auto;
        overflow-y: auto;
        margin-top: 60px;
        &::-webkit-scrollbar {
          width: 4px !important;
          height: 4px !important;
        }
        &::-webkit-scrollbar-track {
          box-shadow: inset 0 0 6px #fff;
          background-color: #fff;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          box-shadow: inset 0 0 6px #cccccc;
        }
        .statusBox {
          position: absolute;
          left: -136px;
          top: 0;
          width: 122px;
          text-align: center;
          display: -ms-flexbox;
          display: flex;
          -ms-flex-direction: column;
          flex-direction: column;
          font-size: 12px;
          > div {
            position: absolute;
            right: 0;
            &:first-child {
              display: inline-block;
              width: 40px;
              height: 20px;
              line-height: 20px;
              background: #83bf68;
              border-radius: 4px;
              font-size: 12px;
              color: #ffffff;
              &.shangxian {
                background: #3575f6;
                border-radius: 4px;
                color: #ffffff;
              }
              &.xiaxian {
                background: #f99a12;
                border-radius: 4px;
                color: #ffffff;
              }
              &.shenhe {
                background: #f99a12;
                border-radius: 4px;
                color: #ffffff;
              }
              &.tjsh {
                background: #83bf68;
                border-radius: 4px;
                color: #ffffff;
              }
            }
            &:last-child {
              &.first {
                top: 0;
                width: auto;
                color: #3575f6;
              }
              top: 0;
              width: auto;
              color: #999999;
            }
          }
        }
        .template {
          position: relative;
          top: -13px;
          left: 0px;
          width: 300px;
          > p {
            display: flex;
            margin-bottom: 5px;
            span {
              display: block;
            }
            > span:first-child {
              font-size: 14px;
              color: #333333;
              width: auto;
              font-weight: bolder;
            }
            > span:last-child {
              font-size: 14px;
              flex: 1;
              color: #777777;
            }
          }
          .annexesList {
            display: flex;
            font-size: 12px;
            color: #3575f6;
            border: 1px solid #d3dbeb;
            border-radius: 12px;
            padding: 2px 15px;
            .annexName {
              margin-right: 10px;
              cursor: pointer;
              display: block;
              width: 232px;
            }
            > div {
              cursor: pointer;
              font-size: 14px;
            }
          }
        }
      }
    }
  }
  .item-attribute {
    width: 100%;
    margin-bottom: 20px;
    p {
      margin: 10px 0;
    }
    .el-checkbox {
      margin-top: 8px;
      width: 20%;
    }
  }
  .store_flow_new {
    .el-input__inner {
      height: 32px;
    }
    .el-input__icon {
      line-height: 32px;
    }
    .el-dialog__header {
      padding: 0 20px;
      height: 50px;
      margin: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      font-weight: bolder;
      .el-dialog__headerbtn {
        position: static;
      }
    }
    .el-dialog__body {
      margin: 0;
      padding: 0 20px !important;
      border: 0;
    }
    .el-dialog__footer {
      padding: 12px 20px !important;
    }
    .aliUploadFlow {
      position: absolute;
      left: 0;
      top: 0;
      .oss_file {
        width: 80px;
        height: 24px;
        border: 0;
      }
    }
    .enclosure-list-flow {
      .el-item {
        display: flex;
        justify-content: space-between;
        span {
          display: block !important;
          padding-left: 0px;
          width: 87%;
        }
        span:last-child {
          width: auto;
        }
      }
    }
  }
  .storeDetailisdialog {
    .el-textarea textarea {
      height: auto;
      border: 1px solid #dcdfe6 !important;
    }
    .el-dialog__body {
      margin-top: 15px;
    }
    .sendIfo {
      &.red {
        /* color: #ff6665; */
      }
      &.blue {
        color: #91cf48;
      }
    }
    .el-tree-node__expand-icon.is-leaf {
      color: transparent !important;
    }
    .el-dialog {
      background-color: #faf7fa;
    }
    .el-dialog__header {
      padding: 0 20px;
      margin: 0;
      height: 50px;
      line-height: 50px;
      background-color: #ffffff;
      font-weight: bold;
      border: none;
      margin-bottom: 10px;
    }
    .el-dialog__body {
      margin: 0;
      background-color: #ffffff;
      padding: 0 !important;
      border: none;
      .el-form {
        padding: 15px;
      }
    }
    .el-dialog__footer {
      background-color: #ffffff;
      margin-top: 10px;
      padding: 0 !important;
    }
    .dialog-footer{
      height: 56px;
      line-height: 56px;
      text-align: right;
      padding-right: 15px;
      margin-top: 15px;
      background-color: #fff;
      font-size: 14px;
    }
  }
}
</style>
<style>
.followDetails .storeDetailisdialog .el-dialog {
  width: 500px !important;
  margin-top: 15vh !important;
}
.followDetails .enclosure {
  display: block !important;
}
.followSend {
  margin-bottom: 22px;
}
</style>
