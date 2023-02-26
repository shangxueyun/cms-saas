<template>
  <div class="followUpRecord">
    <div class="search-condition">
      <div>
        <!-- <el-date-picker v-model="recordDate"
                        type="daterange"
                        value-format="yyyy-MM-ddTHH:mm:ss.000Z"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        style="padding:0"
                        @change="daterangeChange">
        </el-date-picker> -->
        <el-date-picker type="date"
                        class="screen"
                        value-format="yyyy-MM-ddT00:00:00.000Z"
                        v-model="startDate"
                        :clearable="false"
                        placeholder="开始时间">
        </el-date-picker>
        <span style="color: #dadada;padding: 0 4px;">-</span>
        <el-date-picker type="date"
                        class="screen"
                        value-format="yyyy-MM-ddT23:59:59.000Z"
                        v-model="endDate"
                        :clearable="false"
                        placeholder="结束时间">
        </el-date-picker>
        <span @click="queryProgress"
              class="query-btn tenant-btn"
              style="display: inline-block; margin-left: 10px;margin-top: 0px;width:70px;">查询</span>
        <div class="query-criteria">
          <span v-for="(item, index) in ctlist"
                :key="index"
                @click="tabFun(item, index)"
                :class="item.tabActiveValFg ? 'cl-active' : ''">
            {{item.name}}
          </span>
        </div>
      </div>

      <span @click="addProgressFn"
            class="addProgress"
            v-if="hasAuthority('02030105')">
        <i class="iconfont icon-cms_xiegenjin-1"></i>
        写跟进
      </span>
    </div>
    <div class="followUpRecord scroll-bar"
         style="padding-left: 134px;height: 470px;margin-left: 100px;;padding-top: 10px;overflow-y: scroll;overflow-x: hidden;">
      <el-timeline class="timeline"
                   v-if="timeLineListData.length > 0">
        <el-timeline-item placement="top"
                          style="position:relative;"
                          v-for="(item, index) in timeLineListData"
                          :key="index"
                          :color="nodeColorFn1(index)">
          <div class="timeLineTitle">
            <span :style="{'background-color': nodeColorFn(item.followRecordType)}">{{formatTimeLineTitle(item.followRecordType)}}</span>
            <div :class="{'first':index===0}"
                 style="width: max-content;position: absolute;right: 0;padding-top: 6px;">
              {{formatApprovalDate(item.followTime)}}
            </div>
          </div>
          <div class="template"
               style="width: 800px">
            <p style="color: #333;font-size: 14px">
              {{item.followRecordType==='INPUT'?'录入人':'跟进人'}}：{{item.followName}}
              <span v-if="item.followRecordType!=='INPUT' || item.followRecordType!=='PROCESS_RUNING' || item.followRecordType!=='PROCESS_AGREED'"
                    style="margin-left: 10px;">标题：{{item.title}}</span>
            </p>
            <p v-if="item.followRecordType!=='INPUT' || item.followRecordType!=='PROCESS_RUNING' || item.followRecordType!=='PROCESS_AGREED'">内容：{{item.followContent}}</p>
            <div v-if="item.followRecordType!=='INPUT' || item.followRecordType!=='PROCESS_RUNING' || item.followRecordType!=='PROCESS_AGREED' && item.annexes.length!==0"
                 style="display:flex;color: #005CB3">
              <!-- <span>附件：</span> -->
              <div>
                <div class="enclosure-list"
                     v-for="(item1, index1) in item.annexes"
                     :key="index1">
                  <div class="el-item">
                    <span>{{item1.annexName}}</span>
                    <span v-if="item1.annexName">
                      <aliDownLoad :item="item1"
                                   :encrypt="true"
                                   style="display: inline-block;cursor: pointer;margin-bottom: 0;margin-left: 10px;" />
                      <ailPreview :ailObj="item1"
                                  :encrypt="true"
                                  @setFile="setFile"
                                  style="display: inline-block;cursor: pointer;margin-bottom: 0;margin-left: 5px;" />
                      <!-- <i @click="deleFile(item1, index1)" class="iconfont icon-lajixiang" v-if="yxInfoEdit"></i> -->
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
      <div v-else
           class="nodata">暂无数据</div>
      <div class="load-more"
           v-if="timeLineListData.length < this.pager.total">
        <span @click="followRecord('more')">加载更多</span>
      </div>
      <el-dialog title="写跟进"
                 width="500px"
                 :visible.sync="showAddProgress"
                 class="showAddfollowup"
                 append-to-body
                 @close="addProgressClose">
        <el-form class="form1"
                 :model="followRecordDTOParams"
                 ref="followRecordDTOParams"
                 :rules="addProgressRules">
          <div class="content">
            <div class="item">
              <div style="margin-bottom: 10px;">时间<i style="color: #D92E20;">*</i>
                <span style="margin-left: 221px;">类型<i style="color: #D92E20;">*</i></span>
              </div>
              <el-form-item prop="followTime"
                            style="display: inline-block;">
                <el-date-picker v-model="followRecordDTOParams.followTime"
                                value-format="yyyy-MM-ddTHH:mm:ss.000Z"
                                type="datetime"
                                :picker-options="pickerDisabled"
                                style="width:220px"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item prop="followRecordType"
                            style="display: inline-block;margin-left: 32px;">
                <el-select v-model="followRecordDTOParams.followRecordType"
                           placeholder="请选择">
                  <el-option v-for="item in followTypeOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="item">
              <span>标题<i>*</i></span>
              <el-form-item prop="title">
                <el-input v-model="followRecordDTOParams.title"
                          maxlength="20"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <span>内容</span>
              <el-form-item prop="followContent">
                <el-input type="textarea"
                          :rows="3"
                          resize="none"
                          style="width:100%"
                          maxlength="500"
                          placeholder="请输入内容（500字以内）"
                          v-model="followRecordDTOParams.followContent"></el-input>
              </el-form-item>
            </div>
            <div>
              <div class="enclosure"
                   style="width:100%">
                <div class="enclosure-head"
                     style="width: 140px;">附件
                  <aliUpload class="aliUpload"
                             v-if="this.followRecordDTOParams.annexDTOS.length < 5"
                             upLoadText="上传附件"
                             :fileType="fileType"
                             businessType='project'
                             :iconShow="true"
                             :encrypt="true"
                             @setAnnex="setAnnexs" />
                </div>
                <div class="enclosure-list"
                     v-for="(item, index) in followRecordDTOParams.annexDTOS"
                     :key="index">
                  <div class="el-item">
                    <span style="padding-left: 0">{{item.annexName}}</span>
                    <span v-if="item.annexName">
                      <i @click="deleFile(item, index)"
                         class="iconfont icon-lajixiang"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 跟进里的消息推送 -->
            <el-form-item>
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
            <el-form-item v-if="switchTurn">
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
            <div slot="footer"
                 class="dialog-footer"
                 style="text-align: right;">
              <span @click="addProgressClose"
                    class="details_cannelBtn">取消</span>
              <span class="details_submitBtn"
                    @click="addFlowList">确认</span>
            </div>
          </div>
        </el-form>
      </el-dialog>
    </div>
    <!-- 图片预览 -->
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
  </div>
</template>
<script>
import axios from 'axios'
import context from '@/service'
import aliUpload from '@/components/aliUpload.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import ailPreview from '@/components/ailPreview.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
export default {
  name: 'followUpRecord',
  components: {
    aliUpload,
    picturePrevie,
    ailPreview,
    aliDownLoad
  },
  props: {
    tenantDetail: {
      type: Object,
      default: {}
    },
    tabActive: {
      type: Number
    }
  },
  watch: {
    tenantDetail: {
      handler: function (val, oldval) {
        if (val) {
          this.followRecordDTOParams.tenantId = this.tenantDetail.id
          this.restVal()
          this.followRecord()
        }
      }
    },
    tabActive: {
      handler: function (val, oldval) {
        if (val === 0) {
          this.restVal()
          this.followRecord()
        }
      }
    },
    filterText (val) {
      this.$refs.treeForm.filter(val)
    }
  },
  data () {
    return {
      num: 0,
      imgArr: [],
      showPicture: false,
      recordDate: '',
      upLoadText: '',
      fileType: [],
      showAddProgress: false,
      pickerDisabled: {
        disabledDate (time) {
          // return time.getTime() > Date.now() - 8.64e6 // ‘此刻’按钮失效
          return time.getTime() > new Date() * 1 + 600 * 1000
        }
      },
      ctlist: [
        { name: '巡场', value: 'PATROL', tabActiveValFg: false },
        { name: '施工', value: 'CONSTRUCTION', tabActiveValFg: false },
        { name: '财务', value: 'FINANCE', tabActiveValFg: false },
        { name: '检查', value: 'CHECK', tabActiveValFg: false },
        { name: '其他', value: 'OTHERS', tabActiveValFg: false }
      ],
      followRecordDTOParams: {
        followTime: '',
        followRecordType: '',
        title: '',
        followContent: '',
        annexDTOS: []
      },
      timeLineListData: [],
      followTypeOptions: [
        {
          value: 'CONSTRUCTION',
          label: '施工'
        },
        {
          value: 'FINANCE',
          label: '财务'
        },
        {
          value: 'PATROL',
          label: '巡场'
        },
        {
          value: 'CHECK',
          label: '检查'
        },
        {
          value: 'OTHERS',
          label: '其他'
        }
      ],
      addProgressRules: {
        followTime: [
          { required: true, message: '请填写跟进时间', trigger: 'change' }
        ],
        followRecordType: [
          { required: true, message: '请选择跟进类型', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请填写跟进标题', trigger: 'blur' }
        ],
        followContent: [
          { required: false, message: '请填写跟进记录', trigger: 'change' }
        ]
      },
      nodeColor: '#DD8032',
      pager: {
        currentPage: 1,
        pgNum: 1,
        total: 0,
        pgSize: 20,
        pgNumoptions: [
          {
            value: 15,
            label: '15'
          },
          {
            value: 30,
            label: '30'
          },
          {
            value: 50,
            label: '50'
          }
        ]
      },
      startDate: '',
      endDate: '',
      tabActiveVal: '',
      followTypes: ['CONSTRUCTION', 'FINANCE', 'PATROL', 'CHECK', 'OTHERS'],
      followRecordTypes: 'CONSTRUCTION,FINANCE,PATROL,CHECK,OTHERS',
      myPlayer: null,
      switchTurn: false,
      selectSpan: [],
      organizationShow: false,
      filterText: '',
      orgListCopy: [],
      checkedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created () {
    this.followRecordDTOParams.tenantId = this.tenantDetail.id
    this.restVal()
    this.followRecord()
    this.queryOrganizeList()
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
    addProgressClose () {
      this.filterText = ''
      this.$refs['followRecordDTOParams'].resetFields()
      this.showAddProgress = false
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    restVal () {
      this.followTypes = ['CONSTRUCTION', 'FINANCE', 'PATROL', 'CHECK', 'OTHERS']
      this.followRecordTypes = 'CONSTRUCTION,FINANCE,PATROL,CHECK,OTHERS'
      this.ctlist = [
        { name: '巡场', value: 'PATROL', tabActiveValFg: false },
        { name: '施工', value: 'CONSTRUCTION', tabActiveValFg: false },
        { name: '财务', value: 'FINANCE', tabActiveValFg: false },
        { name: '检查', value: 'CHECK', tabActiveValFg: false },
        { name: '其他', value: 'OTHERS', tabActiveValFg: false }
      ]
      let date = new Date()
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      let d = date.getDate()
      m = m < 10 ? '0' + m : m
      d = d < 10 ? '0' + d : d
      let startDate = y + '-' + '01' + '-' + '01' + 'T00:00:00.000Z'
      let endDate = y + '-' + m + '-' + d + 'T23:59:59.000Z'
      this.recordDate = [startDate, endDate]
      this.startDate = startDate
      this.endDate = endDate
    },
    setAnnexs (annexURL, annexName) {
      this.followRecordDTOParams.annexDTOS.push({ 'annexURL': annexURL, 'annexName': annexName })
    },
    addProgressFn () {
      this.showAddProgress = true
      this.switchTurn = false
      this.selectSpan = []
      this.followRecordDTOParams.annexDTOS = []
    },
    nodeColorFn1 (index) {
      return index === 0 ? '#3575F6' : '#D3DBEB'
    },
    nodeColorFn (type) {
      let color = '#DD8032'
      switch (type) {
        case 'FINANCE':
          color = '#F99A12'
          break
        case 'CONSTRUCTION':
          color = '#83BF68'
          break
        case 'PATROL':
          color = '#3575F6'
          break
        case 'OTHERS':
          color = '#A69848'
          break
        case 'CHECK':
          color = '#44AF69'
          break
        default:
          break
      }
      return color
    },
    queryProgress () {
      this.followRecord()
    },
    deleFile (item, index) {
      this.followRecordDTOParams.annexDTOS.splice(index, 1)
    },
    formatApprovalDate (time) {
      if (time) {
        time = time.substr(0, time.lastIndexOf('T'))
        return time
      }
    },
    daterangeChange (d) {
      if (!d) {
        this.startDate = ''
        this.endDate = ''
      } else {
        this.startDate = d[0]
        this.endDate = d[1]
      }
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
        case 'CONSTRUCTION':
          return '施工'
        case 'FINANCE':
          return '财务'
        case 'PATROL':
          return '巡场'
        case 'CHECK':
          return '检查'
        case 'OTHERS':
          return '其他'
      }
    },
    addFlowList () {
      if (this.selectSpan.length === 0 && this.switchTurn) {
        this.$message.error('请选择收件人！')
        return
      }
      let arr = []
      this.selectSpan.forEach(ele => {
        arr.push(ele.userId)
      })
      arr = [...new Set(arr)]
      this.followRecordDTOParams.messageFlg = this.switchTurn
      this.followRecordDTOParams.userIds = arr
      this.$refs['followRecordDTOParams'].validate((valid) => {
        if (valid) {
          context.http.post('cms/api/followRecord/tenantMap', this.followRecordDTOParams).then(res => {
            if (res.status === 201) {
              this.showAddProgress = false
              this.pager.currentPage = 1
              this.followRecord()
              this.followRecordDTOParams = {
                followTime: '',
                followRecordType: '',
                title: '',
                followContent: '',
                annexDTOS: [],
                tenantId: this.tenantDetail.id
              }
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    downloadFile (item, index) {
      axios({
        method: 'GET',
        url: '/ywm/api/annex/download',
        params: {
          annexURL: item.annexURL,
          annexName: item.annexName
        },
        responseType: 'blob'
      }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', item.annexName)
        document.body.appendChild(link)
        link.click()
      })
    },
    followRecord (type) {
      if (type === 'more') {
        this.pager.currentPage += 1
      }
      context.http.get('cms/api/followRecord/tenantMap', {
        page: (this.pager.currentPage - 1),
        size: this.pager.pgSize,
        sort: 'id,desc',
        startTime: this.startDate,
        endTime: this.endDate.replace('T00:00:00.000Z', 'T23:59:59.000Z'),
        followRecordTypes: this.followRecordTypes,
        tenantId: this.tenantDetail.id
      }).then(res => {
        if (type === 'more') {
          this.timeLineListData = this.timeLineListData.concat(res.data)
        } else {
          this.timeLineListData = res.data
        }
        this.pager.total = Number(res.headers['x-total-count'])
      })
    },
    tabFun (item, index) {
      item.tabActiveValFg = !item.tabActiveValFg
      let followRecordTypes = this.followTypes
      if (item.tabActiveValFg) {
        let newIdx = followRecordTypes.indexOf(item.value)
        followRecordTypes.splice(newIdx, 1)
      } else {
        followRecordTypes.push(item.value)
      }
      this.tabActiveVal = item.value
      this.followRecordTypes = followRecordTypes.join(',')
      this.followRecord()
    },
    changeSwitch (val) {
      this.selectSpan = []
      this.$message({
        message: '切换成功',
        type: 'success'
      })
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
    }
  }
}
</script>

<style lang="scss" scoped>
.followUpRecord {
  .el-dialog__header {
    padding-left: 0;
  }
  .addProgress {
    // display: inline-block;
    // margin-left: 10px;
    // color: #fff;
    // background-color: #65ac69 !important;
    display: inline-block;
    width: 82px;
    color: #3575f6;
    height: 26px;
    line-height: 26px;
    text-align: center;
    background: #eef4ff;
    border: 1px solid #9fbfff;
    border-radius: 14px;
    cursor: pointer;
  }
  .timeline {
    .timeLineTitle {
      position: absolute;
      left: -94px;
      top: 0;
      width: 80px;
      text-align: right;
      span {
        display: inline-block;
        width: 40px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #fff;
        border-radius: 4px;
        font-size: 12px;
      }
      div {
        color: #999;
        font-size: 12px;
        &.first {
          color: #3575f6;
        }
      }
    }
    p {
      margin-bottom: 5px;
      word-break: break-all;
    }
    .template {
      position: relative;
      top: -13px;
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
      padding: 6px;
      color: #666;
      font-size: 12px;
      p {
        width: 94%;
      }
    }
  }
  .nodata {
    color: #777;
    font-size: 14px;
    padding: 50px 0 0 100px;
  }
  .load-more {
    text-align: center;
    span {
      display: inline-block;
      width: 100px;
      height: 35px;
      line-height: 35px;
      border: 1px solid #dadada;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
    }
  }
  .search-condition {
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
    align-items: center;
    margin-bottom: 20px;
    div {
      &:first-child {
        // margin: 0 20px 20px 20px;
      }
    }
  }
  .query-criteria {
    margin: 20px 0 0 30px;
    display: inline-block;
    span {
      display: inline-block;
      width: 40px;
      height: 20px;
      line-height: 20px;
      border-radius: 4px;
      margin: 0 10px;
      text-align: center;
      cursor: pointer;
      color: #fff;
      font-size: 12px;
      &:nth-child(1) {
        background-color: #3575f6;
      }
      &:nth-child(2) {
        background-color: #83bf68;
      }
      &:nth-child(3) {
        background-color: #f99a12;
      }
      &:nth-child(4) {
        background-color: #44af69;
      }
      &:nth-child(5) {
        background-color: #a69848;
      }
    }
    i {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      position: relative;
      top: 1px;
      margin-right: 6px;
    }
  }
  .cl-active {
    // background-color: #858585!important;
    background-color: #dedfe0 !important;
    i {
      background-color: #dedfe0 !important;
    }
  }
  .enclosure {
    .aliUpload {
      display: inline-block;
      margin-left: 10px;
    }
  }
}
</style>
<style lang="scss" >
.showAddfollowup {
  .el-dialog__header {
    padding: 12px 20px 13px 20px !important;
    margin: 0;
  }
  .el-dialog__body {
    margin: 0 20px;
  }
  .content {
    margin-top: 10px;
  }
  .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .el-input__icon {
    line-height: 32px;
  }

  .dialog-footer {
    margin-bottom: 20px;
  }

  .item {
    > span {
      display: inline-block;
      margin-bottom: 10px;

      i {
        color: #d92e20;
      }
    }
  }
  .oss_file {
    width: 76px;
    height: 22px;
    line-height: 18px;
  }
  .aliUpload {
    display: inline-block;
    margin-left: 10px;
  }
  .enclosure {
    .el-item {
      border-bottom: 1px solid #f6f6f6;
      span {
        &:last-child {
          text-align: right;
        }
        i {
          cursor: pointer;
        }
      }
    }
  }
  .el-form-item {
    margin-bottom: 15px;
  }
}
.followUpRecord {
  .ailPreview {
    .iconfont {
      margin-right: 0 !important;
    }
  }
}
</style>

