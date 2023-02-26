<template>
  <div class="messageCenter">
    <p class="page_head_title">消息中心</p>
    <div class="hourse_container">
      <ul class="default_tab_block">
        <li @click="changeNav(index)"
            v-for="(item, index) in navList"
            :key="index"
            :class="item.actived ? 'active' : ''">
          <el-badge :value="item.unReadCount"
                    :max="99"
                    class="item"
                    :hidden="item.unReadCount===0"
                    style="height: 26px;line-height: 26px;">
            {{item.label}}
          </el-badge>
        </li>
      </ul>
      <div class="search-bar">
        <div>
          <el-select v-model="onSend"
                     @change="search"
                     size="small"
                     placeholder="请选择">
            <el-option v-for="item in typeList"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="notifyType"
                     size="small"
                     placeholder="通知类型"
                     v-if="!news">
            <el-option v-for="item in noTypeList"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="title"
                    size="small"
                    placeholder="请输入标题"
                    maxlength="50"></el-input>
          <el-date-picker style="margin-right: 0"
                          size="small"
                          v-model="startDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="开始日期">
          </el-date-picker>
          <span style="color: #999;padding: 0 5px">-</span>
          <el-date-picker style="margin-right: 20px;"
                          size="small"
                          v-model="endDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="结束日期">
          </el-date-picker>
          <div style="margin-left:0;margin-top: 0;display: inline-block"
               @click="search"
               class="query-btn">查询</div>
        </div>
        <div>
          <el-button v-if="news"
                     class="tban tban1"
                     @click="openDialog"><i class="iconfont icon-crm_xinzeng-"></i> 新增消息</el-button>
          <el-button v-if="!news && hasAuthority('09010501')"
                     class="tban tban1"
                     @click="openDialog"><i class="iconfont icon-crm_xinzeng-"></i> 新增通知</el-button>
        </div>
      </div>
      <div class="hourse-table">
        <div class="table">
          <el-table :data="tableData"
                    style="width: 100%">
            <el-table-column label="发件人"
                             align="center">
              <template slot-scope="scope">
                <span v-if="!scope.row.readed && !onSend"
                      :class="{'red-dot':!scope.row.readed && !onSend}"></span>
                {{scope.row.createUserName}}
              </template>
            </el-table-column>
            <el-table-column prop="notifyType"
                             label="通知类型"
                             align="center"
                             v-if="!news"
                             :formatter="formatterNoType"></el-table-column>
            <el-table-column label="收件人"
                             align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.onSendAll">全体成员</span>
                <!-- <span v-else
                      v-for="(item, index) in scope.row.users"
                      :key="item.id"
                      :title="scope.row.userList">
                  {{item.userName}}
                  <span v-if="scope.row.users.length > 1 && index !== scope.row.users.length - 1">、</span>
                </span> -->
                <span v-else
                      :title="scope.row.userList">
                  {{formatUserName(scope.row.users)}}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="title"
                             label="标题"
                             align="center"></el-table-column>
            <el-table-column label="发送时间"
                             align="center">
              <template slot-scope="scope">
                {{formateData(scope.row.sendTime)}}
              </template>
            </el-table-column>
            <el-table-column label="操作"
                             align="center">
              <template slot-scope="scope">
                <el-button @click="newDetails(scope.$index, scope.row)"
                           class="operation-btn"
                           size="mini">
                  <span>查看</span>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="ctc-foot1"
             v-if="tableData.length > 0">
          <span><span style="margin-right:10px">{{pager.currentPage}}/{{Math.ceil(pager.total/pager.pgSize)}}页</span> 共{{pager.total}}条记录</span>
          <el-pagination v-if="pager.total > 0"
                         background
                         layout="prev, pager, next"
                         :page-size="pager.pgSize"
                         :total="pager.total"
                         :current-page.sync="pager.currentPage"
                         @current-change="current_change">
          </el-pagination>
          <div class="pagingnum">
            显示 <select v-model="pager.pgSize"
                    @change="pgSizeSelectFn">
              <option v-for="item in pager.pgNumoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </option>
            </select>
            条目
          </div>
        </div>
      </div>
    </div>
    <el-dialog :title="reportTitle"
               :close-on-click-modal="false"
               :visible.sync="dailyDialog"
               @close="dailyDialogClose"
               width="600px">
      <el-form :model="reportData"
               :rules="rules"
               ref="ruleForm">
        <div style="padding: 10px 0 40px 0;"
             class="add-adily">
          <div>
            <el-form-item prop="notifyType"
                          v-if="!news">
              <div style="padding: 10px 0;">通知类型<span style="color: red">*</span></div>
              <el-select v-model="reportData.notifyType"
                         placeholder="请选择通知类型">
                <el-option v-for="item in noTypeList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-bottom: 0"
                          v-if="!news">
              <div style=""
                   class="select-wrap">
                <div>收件人<span style="color: red">*</span></div>
                <div class="select-span"
                     style="width: 430px;display: inline-block"
                     :class="{'disable': AllMembers}">
                  <span v-for="(item, index) in selectSpan"
                        :key="index">
                    {{item.userName ? item.userName : item.userPostName}}
                    <i class="iconfont icon-cha"
                       @click="delSelect(item)"></i>
                  </span>
                </div>
                <i class="iconfont icon-bottom"
                   v-if="!AllMembers"
                   @click="organizationShow=!organizationShow"
                   :class="{'icon-top': organizationShow}"
                   style="right: 108px"></i>
                <el-checkbox v-model="AllMembers"
                             style="vertical-align: top;top: 16px;margin-left: 15px;"
                             @change="cancelSelect">全体成员</el-checkbox>
              </div>
              <transition name="sub-comments">
                <div class="organization"
                     v-show="organizationShow && !AllMembers">
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
            <el-form-item style="margin-bottom: 0"
                          v-else>
              <div style=""
                   class="select-wrap">收件人<span style="color: red">*</span>
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
          </div>
          <el-form-item prop="title">
            <div style="padding: 10px 0;">标题<span style="color: red">*</span></div>
            <el-input v-model="reportData.title"
                      maxlength="50"
                      placeholder="请输入标题"
                      style="display: inline-block"></el-input>
          </el-form-item>
          <el-form-item prop="reportContent">
            <div style="padding: 10px 0;">内容<span style="color: red"
                    v-if="!news">*</span></div>
            <richTextEditor @setEditor="setEditor"
                            :desc="textarea"
                            :dialogFormVisible="dailyDialog"
                            ref="richTextEditor" />
          </el-form-item>
          <div style="display: inline-block;width: 100%;">
            <span>附件：</span>
            <!-- <span class="addEnclosure">
              添加附件
              <input class="flinput"
                     type="file"
                     @change="uploadAttach($event)">
            </span> -->
            <aliUpload class="aliUpload"
                       style="margin-top:10px;"
                       :encrypt="true"
                       upLoadText="添加附件"
                       :iconShow="false"
                       @setAnnex="setAnnex" />
            <div class="enclosure-list"
                 v-if="reportData.annexes"
                 v-for="(item, index) in reportData.annexes"
                 :key="index">
              <span>{{item.annexName}}</span>
              <span @click="delEnclosure(index)"><i class="iconfont icon-lajixiang"></i></span>
            </div>
          </div>
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dailyDialogClose"
                   class="close-button">取 消</el-button>
        <el-button type="primary"
                   class="defaultbtn dialog-confirmBtn"
                   @click="addReport">确 认</el-button>
      </div>
    </el-dialog>
    <div v-if="showDetails">
      <NewsDetails :showDrawer="showDetails"
                   :onSendParent="onSend"
                   :newsId="newsId"
                   @drawClose='drawHandleClose'>
      </NewsDetails>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import context from '@/service'
import * as hub from '@/service/eventHub'
import richTextEditor from '@/components/richTextEditor.vue'
import NewsDetails from './components/NewsDetails'
import aliUpload from '@/components/aliUpload.vue'
import { type } from 'os'
export default {
  name: 'messageCenter',
  components: {
    richTextEditor,
    aliUpload,
    NewsDetails
  },
  data () {
    return {
      newsId: null,
      onSend: false,
      AllMembers: false,
      tableData: [],
      title: '',
      startDate: '',
      endDate: '',
      notifyType: '',
      showDetails: false,
      organizationShow: false,
      showPicture: false,
      selectSpan: [],
      filterText: '',
      orgListCopy: [],
      checkedKeys: [],
      queryDate: '',
      news: true, // 消息
      reportTitle: '添加日报',
      reportData: { title: '', annexes: [] },
      navList: [
        { label: '消息', value: 'MESSAGE', unReadCount: '', actived: true },
        { label: '通知', value: 'NOTIFY', unReadCount: '', actived: false }
      ],
      typeList: [{ label: '收件', value: false }, { label: '发件', value: true }],
      noTypeList: [{ label: '放假通知', value: 'HOLIDAY_NOTICE' }, { label: '会议通知', value: 'MEETING_NOTICE' }, { label: '红头文件', value: 'RED_HEAD_DOCUMENT' },
      { label: '办文单', value: 'OFFICE_DOCUMENT' }, { label: '其他', value: 'OTHER' }],
      pager: {
        currentPage: 1,
        pgNum: 1,
        total: 0,
        pgSize: 15,
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
      tabIndex: 0,
      rules: {
        notifyType: [
          { required: true, message: '请选择通知类型', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px',
      dailyDialog: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      textarea: '',
      msgCount: '',
      notCount: '',
      messageCenterType: 'MESSAGE',
      selectSpanCache: [] // 缓存发送人名单 用作取消全体成员选中上次选的人员
    }
  },
  watch: {
    filterText (val) {
      this.$refs.treeForm.filter(val)
    }
  },
  created () {
    if (this.$route.params.messageHttp) {
      this.newDetails(0, this.$route.params.messageObject)
    }
    if (this.$route.query.messageCenterType) {
      if (this.$route.query.messageCenterType === 'NOTIFY') {
        this.changeNav(1)
      } else {
        this.changeNav(0)
      }
      if (this.$route.query.changeTab) { // 如果从发版通告tab切换过来则不请求详情
        return
      }
      this.newDetails(0, this.$route.query)
    }
  },
  mounted () {
    this.queryInfo()
    hub.eventHub.$on('messageCome', () => {
      this.queryInfo()
    })
    hub.eventHub.$on('messageCenter_messageCome', obj => {
      if (obj.messageCenterType === 'NOTIFY') {
        this.changeNav(1)
      } else {
        this.changeNav(0)
      }
      this.newDetails(0, obj)
    })
  },
  methods: {
    changeNav (inx) {
      this.navList.forEach(item => {
        item.actived = false
      })
      this.navList[inx].actived = true
      if (inx === 0) {
        this.news = true
        this.messageCenterType = 'MESSAGE'
        this.notReadCount('MESSAGE')
      } else if (inx === 1) {
        this.news = false
        this.messageCenterType = 'NOTIFY'
        this.notReadCount('NOTIFY')
      } else if (inx === 2) {
        this.$router.push({ name: 'messageManagement' })
      }
      this.selectSpan = []
      this.pager.currentPage = 1
      this.query()
    },
    setAnnex (annexURL, annexName) {
      this.reportData.annexes.push({
        'annexName': annexName,
        'annexUrl': annexURL,
        'annexURL': annexURL
      })
    },
    dailyDialogClose () {
      this.reportData = { title: '', annexes: [] }
      this.dailyDialog = false
      this.selectSpan = []
    },
    formatUserName (users) {
      let textArr = []
      users.forEach(item => {
        textArr.push(item.userName)
      })
      let texts = textArr.join('、')
      if (textArr.length > 5) {
        texts = texts.length > 15 ? texts.substring(0, 15) + '...' : texts
      }
      return texts
    },
    drawHandleClose () {
      this.showDetails = false
      // this.queryInfo()
      this.tableData[this.slectedIndex].readed = true
      this.notReadCount('MESSAGE')
      this.notReadCount('NOTIFY')
    },
    formatterNoType (row, column) {
      let res = ''
      switch (row.notifyType) {
        case 'HOLIDAY_NOTICE':
          res = '放假通知'
          break
        case 'MEETING_NOTICE':
          res = '会议通知'
          break
        case 'RED_HEAD_DOCUMENT':
          res = '红头文件'
          break
        case 'OFFICE_DOCUMENT':
          res = '办文单'
          break
        case 'OTHER':
          res = '其他'
          break
      }
      return res
    },
    newDetails (index, row) {
      this.newsId = row.id
      this.showDetails = true
      this.slectedIndex = index
    },
    setEditor (html) {
      this.textarea = html
      this.reportData.content = html
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    selectNav (item, index) {
      this.queryDate = ''
      this.pager.currentPage = 1
      this.query()
    },
    formateData (val) {
      if (val) {
        return val.replace('T', '  ')
      } else {
        return '-'
      }
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    openDialog (type) {
      if (this.news) {
        this.messageCenterType = 'MESSAGE'
        this.reportTitle = '新增消息'
      } else {
        this.messageCenterType = 'NOTIFY'
        this.reportTitle = '新增通知'
      }
      this.dailyDialog = true
      this.queryOrganizeList()
    },
    search () {
      this.pager.currentPage = 1
      this.query()
    },
    current_change (currentPage) {
      this.pager.currentPage = currentPage
      this.query()
    },
    pgSizeSelectFn () {
      this.pager.currentPage = 1
      this.query()
    },
    query () {
      context.http.get('/mps/api/messageCenters', {
        onSend: this.onSend,
        title: this.title,
        startDate: this.startDate,
        endDate: this.endDate,
        messageCenterType: this.messageCenterType,
        notifyType: this.notifyType,
        page: (this.pager.currentPage - 1),
        size: this.pager.pgSize,
        sort: 'createdDate,desc'
      }).then(res => {
        if (res.status === 200) {
          this.tableData = res.data
          this.pager.total = Number(res.headers['x-total-count'])
          let userList = this.tableData
          userList.forEach(item => {
            if (item.users.length > 1) {
              item.userList = []
              item.users.forEach((item2, index) => {
                item.userList.push(item2.userName)
              })
            }
          })
          userList.forEach(item => {
            if (item.userList) {
              item.userList = item.userList.join('、')
            }
          })
        }
      })
    },
    addReport () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          console.log(this.selectSpan.length === 0, !this.news, !this.AllMembers)
          if (this.selectSpan.length === 0 && this.news) {
            this.$message.error('请选择收件人！')
            return
          }
          if (this.selectSpan.length === 0 && !this.news && !this.AllMembers) {
            this.$message.error('请选择收件人！')
            return
          }
          let arr = []
          this.selectSpan.forEach(ele => {
            arr.push({ userId: ele.userId, userName: ele.userName })
          })
          var obj = {}
          // 去重
          arr = arr.reduce(function (item, next) {
            obj[next.userId] ? '' : obj[next.userId] = true && item.push(next)
            return item
          }, [])
          this.reportData.users = arr
          if (!this.news) { // 新增通知，内容为必填
            if (!this.reportData.content) {
              this.$message.error('请输入内容！')
              return
            }
          }
          this.reportData.messageCenterType = this.messageCenterType
          this.reportData.onSendAll = this.AllMembers
          context.http.post('/mps/api/messageCenters/save', this.reportData).then(res => {
            if (res.status === 201) {
              // this.dailyDialog = false
              this.dailyDialogClose()
              this.reportData = { title: '', messageCenterType: 'MESSAGE', content: '', annexes: [] }
              this.textarea = ''
              this.query()
            }
          }).catch(error => {
            console.info(error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async uploadAttach () {
      let files = event.target.files
      let form = new FormData()
      form.append('file', files[0])
      let name = files[0].name
      let index = name.lastIndexOf('.')
      let type = name.substr(index + 1).toLowerCase()
      event.target.value = ''
      let _this = this
      context.http.post('/ywm/api/image-multipart', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
        if (res.status === 201) {
          this.reportData.annexes.push({
            'annexName': name,
            'annexUrl': res.data
          })
          console.log(this.reportData)
        }
      }).catch(error => {
        console.info(error)
        this.$message.error('上传失败')
      })
    },
    delEnclosure (index) {
      this.reportData.annexes.splice(index, 1)
    },
    queryprevContacts () {
      context.http.get('/cms/api/workReports/prevContacts').then(res => {
        if (res.status === 200) {
          this.selectSpan = []
          // 展示上次选择汇报人
          let selectSpan = res.data
          let arr = []
          let idArr = []
          selectSpan.forEach(ele => {
            arr.push({ userId: Number(ele.id), userName: ele.name })
            idArr.push(ele.nodeId)
          })
          // this.selectSpan = arr
          if (idArr.length > 0) {
            this.organizationShow = true
            this.$refs.treeForm.setCheckedKeys(idArr, true)
            this.$nextTick(() => {
              if (this.selectSpan.length === 0) {
                this.selectSpan = arr
              }
            })
          }
        }
      })
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
    getNodeId (treeList, userPostId) {
      for (let i = 0; i < treeList.length; i++) {
        if (treeList[i].data.userPostId && treeList[i].data.userPostId === userPostId) {
          return treeList[i].data.userId
        } else {
          let result = this.getNodeId(treeList[i].children, userPostId)
          if (result) {
            return result
          }
        }
      }
      return null
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
    delSelect (data) {
      let selectSpan = this.selectSpan
      selectSpan.forEach((ele, index) => {
        if (ele.nodeId === data.nodeId) {
          this.selectSpan.splice(index, 1)
          this.$refs.treeForm.setChecked(ele, false)
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
    cancelSelect () {
      // console.log(this.AllMembers, this.selectSpan, this.selectSpanCache)
      if (this.AllMembers) {
        this.selectSpanCache = this.selectSpan // selectSpanCache缓存发送人名单 用作取消全体成员选中上次选的人员
        this.selectSpan = []
        this.$refs.treeForm.setCheckedKeys([])
      } else {
        let ids = []
        this.selectSpanCache.forEach(item => {
          ids.push(item.nodeId)
        })
        this.$refs.treeForm.setCheckedKeys(ids)
      }
    },
    trimStr (str) { return str.replace(/(^\s*)|(\s*$)/g, '') },
    notReadCount (messageCenterType) {
      context.http.get('/mps/api/messageCenters/notReadCount', { messageCenterType: messageCenterType }).then(res => {
        if (res.status === 200) {
          if (messageCenterType === 'MESSAGE' && res.data !== '0') this.navList[0].unReadCount = res.data
          if (messageCenterType === 'NOTIFY' && res.data !== '0') this.navList[1].unReadCount = res.data
        }
      }).catch(error => {
        console.info(error)
      })
    },
    queryInfo () {
      this.query()
      this.notReadCount('MESSAGE')
      this.notReadCount('NOTIFY')
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../style/mixins";
ul,
li {
  list-style: none;
}
.hourse_search .el-input .el-input__inner {
  width: 180px;
  height: 32px;
  line-height: 32px;
  position: absolute;
  left: 0;
  top: 0;
}
.messageCenter {
  font-size: 16px;
  background-color: #f9f9f9;
  .hourse_container {
    background-color: #f9f9f9;
    .default_tab_block {
      font-size: 14px;
    }
    .hourse_search {
      background-color: #fff;
      margin: 20px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      .search-top {
        border-bottom: 1px solid #ecedef;
        padding-bottom: 18px;
        padding-left: 18px;
        .el-input {
          width: 180px;
          height: 32px;
          display: block;
          margin-top: 18px;
        }
        div {
          float: left;
          display: inline-block;
        }
        div {
          cursor: pointer;
        }
      }
      .search-bottom {
        padding-left: 18px;
        padding: 20px 18px 20px;
        dl {
          display: flex;
          font-size: 12px;
          line-height: 18px;
          dt {
            color: #333333;
          }
          dd {
            display: flex;
            color: #666;
            margin-right: 16px;
            span {
              display: block;
              &:first-child {
                margin-right: 5px;
              }
              &:last-child {
                font-size: 18px;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
    .hourse_tab {
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
      }
    }
    .search-bar {
      flex-wrap: wrap;
      background-color: #fff;
      .navSelected {
        background-color: #0f75ff !important;
        color: #fff !important;
      }
      > div {
        display: inline-flex;
        align-items: center;
        .el-input {
          display: inline-block;
          width: 185px;
        }
      }
    }
    .report-list {
      background-color: #fff;
      padding: 30px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(249, 249, 249, 1);
      box-shadow: -3px 0px 6px 0px rgba(184, 184, 184, 0.2);
      border-radius: 0px 4px 4px 4px;
      margin-top: 4px;
      position: relative;
      .label {
        position: absolute;
        top: 0;
        left: 0;
        display: inline-block;
        width: 30px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        border-radius: 0px 2px 2px 0px;
        font-size: 12px;
        color: #fff;
      }
      .public {
        background-color: #65ac69;
      }
      .private {
        background-color: #5e72e4;
      }
      .rl-content {
        display: flex;
        justify-content: flex-start;
        font-size: 14px;
        p {
          margin-bottom: 6px;
        }
        .head-portrait {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 1px solid #dadada;
          img {
            border-radius: 50%;
          }
        }
        .usinfo {
          margin: 4px 0 0 30px;
          p {
            &:first-child {
              font-size: 14px;
            }
            font-size: 12px;
            color: #333;
          }
        }
        .content {
          width: 510px;
          margin: 4px 0 0 140px;
        }
        .enclosure {
          margin: 4px 0 0 20px;
        }
        .reportImg {
          width: 100px;
          height: 100px;
          margin-left: 10px;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .msg-operation {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        margin: 20px 0 20px 0;
        color: #656565;
        font-size: 12px;
        .icon {
          display: inline-block;
          width: 20px;
          height: 20px;
          margin-right: 4px;
          cursor: pointer;
        }
        .qrcode {
          background: url(../../assets/qrcode.png) no-repeat;
          background-size: contain;
        }
        .pinglun {
          background: url(../../assets/pinglun.png) no-repeat;
          background-size: contain;
        }
      }
      .comment {
        border-top: 1px solid #eaeaea;
        font-size: 12px;
        color: #333;
        div {
          padding: 10px 0 10px 10px;
          border-top: 1px solid #f3f3f3;
        }
      }
    }
  }
  .el-dialog {
    width: 520px !important;
    .el-select {
      width: 100%;
    }
  }
  .add-adily {
    .addEnclosure {
      display: inline-block;
      width: 70px;
      height: 24px;
      line-height: 22px;
      text-align: center;
      border: 1px solid rgba(53, 119, 246, 1);
      color: #3577f6;
      border-radius: 4px;
      background-color: #fff;
      font-size: 12px;
      cursor: pointer;
      position: relative;
      .flinput {
        width: 70px;
        height: 24px;
      }
    }
    .enclosure-list {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      border-bottom: 1px solid #ebebeb;
      span {
        margin-bottom: 6px;
      }
      i {
        cursor: pointer;
      }
    }
    .addimg {
      display: inline-block;
      width: 130px;
      height: 102px;
      line-height: 102px;
      text-align: center;
      border: 1px dashed rgba(204, 204, 204, 1);
      border-radius: 6px;
      font-size: 20px;
      color: #0f75ff;
      cursor: pointer;
      position: relative;
      .flinput {
        width: 130px;
        height: 102px;
      }
      img {
        width: 100%;
        height: 100%;
      }
      .icon-shanchu {
        position: absolute;
        top: -9px;
        right: -10px;
        color: #cccccc;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        line-height: 18px;
        text-align: center;
        font-size: 16px;
        z-index: 1;
        background: url(../../assets/closed.png) no-repeat;
        background-size: contain;
        border: 1px solid #dadadd;
      }
    }
    .flinput {
      position: absolute;
      top: 0;
      right: 0;
      opacity: 0;
      cursor: pointer;
    }
  }
  .default-hportrait {
    background-color: #409eff;
    line-height: 80px;
    text-align: center;
    color: #fff;
  }
  .page {
    display: flex;
    justify-content: space-between;
  }
  .select-wrap {
    padding: 10px 0 0 0;
    position: relative;
    i.icon-bottom {
      position: absolute;
      right: 10px;
      top: 47px;
      cursor: pointer;
    }
  }
  .select-span {
    min-height: 33px;
    max-height: 66px;
    overflow-y: scroll;
    margin-bottom: 10px;
    border: 1px solid #e7e7e7;
    border-radius: 4px;
    margin-top: 10px;
    padding-right: 24px;
    @include scrollBarStyle;
    span {
      display: inline-block;
      min-width: 78px;
      height: 25px;
      line-height: 25px;
      background-color: #eaf1fe;
      color: #487ff7;
      border-radius: 8px;
      text-align: center;
      padding: 0 6px;
      margin: 6px 0 6px 6px;
      font-size: 12px;
      i {
        font-size: 12px;
        float: right;
        cursor: pointer;
      }
    }
  }
  .disable {
    background-color: #e7e7e7;
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px #e7e7e7;
      box-shadow: inset 0 0 6px #e7e7e7;
      border-radius: 10px;
      background-color: #e7e7e7;
    }
  }
  .organization {
    border: 1px solid transparent;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
    height: 280px;
    overflow-y: scroll;
    @include scrollBarStyle;
    > .el-input {
      width: 90%;
      margin: 10px 0 10px 25px;
      input {
        border: none;
        background-color: #fafafa;
      }
    }
  }
  .textarea textarea {
    height: 160px;
  }
  .sub-comments-leave-active,
  .sub-comments-enter-active {
    transition: max-height 0.3s;
  }
  .sub-comments-enter,
  .sub-comments-leave-to {
    max-height: 0;
  }
  .sub-comments-enter-to,
  .sub-comments-leave {
    max-height: 280px;
  }
}
.red-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 8px;
  background-color: #eb605b;
  position: relative;
  left: -50px;
}
@media (min-width: 1400px) and (max-width: 1600px) {
  .query-btn {
    margin-top: 0 !important;
  }
}
@media screen and (max-width: 1600px) {
  .add-notice,
  .add-news {
    margin-bottom: 15px !important;
  }
  .el-input__inner {
    line-height: 40px !important;
  }
}
</style>
