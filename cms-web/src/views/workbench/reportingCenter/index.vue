<template>
  <div :class="[
      hourseList === 'on' ? 'reportingCenter paddingLeft' : 'reportingCenter',
      hourseList === 'off' ? 'reportingCenter paddingRight' : 'reportingCenter',
    ]">
    <p class="page_head_title">汇报中心</p>
    <div class="hourse_container">
      <div class="tab_block_wrap">
        <ul class="default_tab_block">
          <li @click="changeNav(index)"
              v-for="(item, index) in navList"
              :key="index"
              :class="item.value ? 'active' : ''">
            <span>{{ item.label }}</span>
          </li>
        </ul>
        <!-- <div @click="dailyDialog = true" class="addbtn" style="margin: 0"><i class="iconfont icon-edit"></i>写日报</div> -->
        <el-dropdown trigger="hover">
          <el-button class="tban tban1 el-dropdown-link"><i class="iconfont icon-crm_xinzeng-"></i> 添加汇报</el-button>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item>
                <router-link to="personalCenter">人事变动</router-link>
            </el-dropdown-item> -->
            <el-dropdown-item @click.native="openDialog('Day')">日报</el-dropdown-item>
            <el-dropdown-item @click.native="openDialog('Week')">周报</el-dropdown-item>
            <el-dropdown-item @click.native="openDialog('Month')">月报</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="search-bar">
        <div>
          <el-select v-model="reportType"
                     placeholder="请选择"
                     @change="selectNav"
                     style="margin-right: 10px">
            <el-option v-for="item in typeList"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <el-date-picker v-if="reportType === 'Day'"
                          v-model="queryDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期">
          </el-date-picker>
          <el-date-picker v-if="reportType === 'Week'"
                          v-model="queryDate"
                          type="week"
                          format="yyyy 第 WW 周"
                          placeholder="选择周">
          </el-date-picker>
          <el-date-picker v-if="reportType === 'Month'"
                          v-model="queryDate"
                          type="month"
                          value-format="yyyy-MM-dd"
                          placeholder="选择月">
          </el-date-picker>
          <div style=""
               class="select-wrap select-wrap2"
               v-if="!this.onMy">
            <div class="select-span"
                 style="font-size: 12px">
              <span v-for="(item, index) in selectSpan2"
                    :key="index">{{ item.userName ? item.userName : item.label }}
                <i class="iconfont icon-cha"
                   @click="delSelect2(item)"></i></span>
            </div>
            <i class="iconfont icon-bottom"
               @click="
                organizationShow2 = !organizationShow2;
                filterText2 = '';
              "
               :class="{ 'icon-top': organizationShow2 }"></i>
            <div class="organization organization2"
                 v-if="organizationShow2">
              <el-input placeholder="请输入组织名称"
                        prefix-icon="el-icon-search"
                        v-model="filterText2"
                        class=""></el-input>
              <el-tree :data="organizesOptions"
                       show-checkbox
                       node-key="value"
                       :render-after-expand="false"
                       :default-checked-keys="checkedKeys"
                       :filter-node-method="filterNode"
                       @check-change="handleCheckChange2"
                       ref="treeForm2"
                       :props="defaultProps">
              </el-tree>
            </div>
          </div>
          <div @click="search"
               class="query-btn">查询</div>
        </div>
        <div v-if="!onMy">
          <span @click="readAll"
               class="operation-btn">全部已读</span>
        </div>
        <!-- <span v-for="(item, index) in typeList" :key="index" @click="selectNav(item, index)" :class="{navSelected: index === tabIndex}">{{item.label}}</span>
          <div style="font-size: 14px;margin-top: 20px;"></div> -->
        <!-- <div style="margin-right: 45px;">
          <el-radio-group v-model="radioValue" @change="radiochange">
            <el-radio label="Public">公开</el-radio>
            <el-radio label="Private">私密</el-radio>
          </el-radio-group>
        </div> -->
      </div>
      <div class="report-list"
           v-for="(item, index) in reportListData"
           :key="index">
        <span class="unread" v-if="compareDate(item.visualTime)"></span>
        <div class="rl-content">
          <div class="head-portrait"
               :class="{ 'default-hportrait': !item.facialPhoto }">
            <img v-if="item.facialPhoto"
                 :src="item.facialPhoto"
                 style="width: 100%; height: 100%" />
            <span v-else
                  class="">
              {{
                item.userName.length > 2
                  ? item.userName.substring(item.userName.length - 2)
                  : item.userName
              }}
            </span>
          </div>
          <div class="usinfo">
            <p>{{ item.userOrganizeName }} - {{ item.userPostManagement }}</p>
            <p>{{ item.userName }}</p>
            <p>
              {{ weekFormat(item.startDate, item.reportType)
              }}{{ transReportType(item.reportType) }}报
            </p>
          </div>
          <div class="content">
            <p>{{ transReportType(item.reportType) }}报内容：</p>
            <div class="readOnlyTxt"
                 style="width: 100%; word-wrap: break-word; word-break: normal"
                 v-html="formatreplace(item.reportContent)"></div>
          </div>
          <div class="enclosure"
               v-if="item.workReportAnnexs[0]">
            <p>附件：</p>
            <p v-for="(item2, index2) in item.workReportAnnexs"
               :key="index2"
               style="display: flex; justify-content: space-between">
              <svg class="icon"
                   v-if="item2.annexName"
                   aria-hidden="true">
                <use :xlink:href="getformat2(item2.annexName)"></use>
              </svg>
              {{ item2.annexName }}
              <span v-if="item2.annexName"
                    style="
                  color: #0f75ff;
                  cursor: pointer;
                  display: flex;
                  justify-content: space-between;
                  margin-left: 10px;
                ">
                <ailPreview :ailObj="item2"
                            :encrypt="true"
                            @setFile="setFile" />
                <!-- <span class="iconfont icon-xiazaidaoru icon-download" @click="downloadFile(item2)"></span> -->
                <aliDownLoad :item="item2"
                             :encrypt="true"
                             style="
                    margin-right: 10px;
                    display: inline-block;
                    width: auto;
                    height: auto;
                  " />
              </span>
            </p>
            <!-- <p v-if="item.workReportAnnexs[0].annexName" style="color: #0F75FF;cursor: pointer;"><span @click="downloadFile(item)">下载</span></p> -->
          </div>
          <!-- <div v-if="item.reportImg" class="reportImg" @click="showReportImg(item.reportImg)">
            <img :src="item.reportImg" />
          </div> -->
          <div class="return" v-if="compareDate(item.visualTime)">
            <span @click="reCallWorkReports(item.id)">
              <i class="iconfont icon-chehui"></i>
              撤回
            </span>
          </div>
        </div>
        <div v-if="item.secrecyType === 'Private' && item.visibleUsers"
             style="font-size: 12px">
          谁可见该条汇报：<span v-for="(item2, index2) in item.visibleUsers"
                :key="index2">{{ item2.userName
            }}<i v-if="item.visibleUsers.length !== index2 + 1">、</i></span>
        </div>
        <div class="msg-operation">
          <div>汇报时间：{{ formateData(item.reportingTime) }}</div>
          <div>
            <span @click="QRcode(item.id)"
                  style="margin-right: 50px"><i class="icon qrcode"></i>扫码发送汇报到微信</span>
            <span @click="
                commentDialog = true;
                commentData.workReportId = item.id;
              "><i class="icon pinglun"></i>评论</span>
          </div>
        </div>
        <div class="comment">
          <div v-for="(item3, index3) in item.comments"
               :key="index3">
            {{ formateData(item3.commentTime) }} {{ item3.userName }}：{{
              item3.content
            }}
          </div>
        </div>
      </div>
      <div class="ctc-foot1"
           v-if="reportListData.length > 0">
        <span><span style="margin-right: 10px">{{ pager.currentPage }}/{{
              Math.ceil(pager.total / pager.pgSize)
            }}页</span>
          共{{ pager.total }}条记录</span>
        <el-pagination v-if="pager.total > 0"
                       background
                       layout="prev, pager, next"
                       :page-size="pager.pgSize"
                       :total="pager.total"
                       :current-page.sync="pager.currentPage"
                       @current-change="current_change">
        </el-pagination>
        <div class="pagingnum">
          显示
          <select v-model="pager.pgSize"
                  @change="pgSizeSelectFn">
            <option v-for="item in pager.pgNumoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"></option>
          </select>
          条目
        </div>
      </div>
    </div>
    <el-dialog title="写评论"
               :visible.sync="commentDialog">
      <div style="padding: 30px 0 40px 0">
        <div style="padding-bottom: 10px">
          评论内容<span style="color: red">*</span>
        </div>
        <el-input type="textarea"
                  :rows="4"
                  placeholder="100字以内"
                  resize="none"
                  maxlength="100"
                  v-model="commentData.content">
        </el-input>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="commentDialog = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   class="defaultbtn dialog-confirmBtn"
                   :disabled="!commentData.content"
                   @click="addComment">确 认</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="reportTitle"
               :close-on-click-modal="false"
               :visible.sync="dailyDialog">
      <el-form :model="reportData"
               :rules="rules"
               ref="ruleForm">
        <div style="padding: 10px 0 40px 0"
             class="add-adily">
          <el-form-item prop="startDate">
            <div style="padding: 10px 0">
              日期<span style="color: red">*</span>
            </div>
            <el-date-picker v-if="reportData.reportType === 'Day'"
                            v-model="reportData.startDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
            </el-date-picker>
            <el-date-picker v-else-if="reportData.reportType === 'Week'"
                            v-model="reportData.startDate"
                            :picker-options="{ firstDayOfWeek: 1 }"
                            type="week"
                            format="yyyy 第 WW 周"
                            placeholder="选择周">
            </el-date-picker>
            <el-date-picker v-else
                            v-model="reportData.startDate"
                            type="month"
                            value-format="yyyy-MM-dd"
                            placeholder="选择月">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="reportContent">
            <div style="padding: 10px 0">
              汇报内容<span style="color: red">*</span>
            </div>
            <el-input v-if="reportData.reportType === 'Day'"
                      type="textarea"
                      style="height: 160px"
                      placeholder="2000字以内"
                      resize="none"
                      class="textarea"
                      maxlength="2000"
                      v-model="reportData.reportContent">
            </el-input>
            <el-input v-if="reportData.reportType === 'Week'"
                      type="textarea"
                      class="textarea"
                      style="height: 160px"
                      placeholder="2000字以内"
                      resize="none"
                      maxlength="2000"
                      v-model="reportData.reportContent">
            </el-input>
            <el-input v-if="reportData.reportType === 'Month'"
                      type="textarea"
                      class="textarea"
                      style="height: 160px"
                      placeholder="2000字以内"
                      resize="none"
                      maxlength="2000"
                      v-model="reportData.reportContent">
            </el-input>
          </el-form-item>
          <div style="padding: 10px 0">
            <span>附件：</span><span class="addEnclosure">
              <!-- <input class="flinput" type="file"
                       @change="uploadAttach($event)"> -->
              <aliUpload class="aliUpload"
                         @setAnnex="setAnnex" />
            </span>
          </div>
          <div v-for="(item, index) in reportData.workReportAnnexs"
               :key="index"
               v-if="reportData.workReportAnnexs"
               style="
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            ">
            <span>
              {{ item.annexName }}
            </span>
            <span style="display: flex; justify-content: space-between">
              <ailPreview :ailObj="item"
                          :encrypt="true"
                          @setFile="setFile" />
              <span class="del"
                    style="cursor: pointer"
                    @click="delAnnex(item, index)">
                <i class="iconfont icon-lajixiang"></i>
              </span>
            </span>
            <!-- <span style="vertical-align: top;">图片：</span>
            <span class="addimg">
              <span v-if="reportData.reportImg" class="iconfont icon-shanchu" v-on:click.stop="reportData.reportImg = ''"></span>
              <span v-if="reportData.reportImg" ><img :src="reportData.reportImg" /></span>
              <span v-else>+</span>
              <input class="flinput" type="file"
                       @change="imageChange($event)"
                       accept="image/png, image/jpeg">
            </span>
            <p style="font-size: 12px;margin-top: 10px;">（建议尺寸：<span style="color: #e17577">600*400</span>像素；支持格式JPG,PNG）</p> -->
          </div>
          <div>
            <el-form-item>
              <div style=""
                   class="select-wrap">
                汇报对谁可见<span style="color: red">*</span>
                <div class="select-span">
                  <span v-for="(item, index) in selectSpan"
                        :key="index">{{ item.userName ? item.userName : item.userPostName }}
                    <i class="iconfont icon-cha"
                       @click="delSelect(item)"></i></span>
                </div>
                <i class="iconfont icon-bottom"
                   @click="organizationShow = !organizationShow"
                   :class="{ 'icon-top': organizationShow }"></i>
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
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dailyDialog = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   class="defaultbtn dialog-confirmBtn"
                   @click="addReport">确 认</el-button>
      </div>
    </el-dialog>
    <el-dialog title="扫码发送汇报到微信"
               :visible.sync="weChatDialog">
      <div style="width: 400px; height: 500px; margin: 0 auto">
        <img :src="QRcodeImg"
             style="width: 100%; height: 100%" />
      </div>
    </el-dialog>
    <!--图片预览-->
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
  </div>
</template>
<script>
import axios from 'axios'
import context from '@/service'
import picturePrevie from '@/components/picturePrevie.vue'
import ailPreview from '@/components/ailPreview.vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { getformat } from '@/utils/validate.js'
import aliUpload from '@/components/aliUpload.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
moment.locale('zh-cn')
export default {
  name: 'reportingCenter',
  components: {
    picturePrevie,
    ailPreview,
    aliUpload,
    aliDownLoad
  },
  data () {
    return {
      organizationShow: false,
      organizationShow2: false,
      showPicture: false,
      imgArr: [],
      num: 0,
      selectSpan: [],
      selectSpan2: [],
      filterText: '',
      filterText2: '',
      orgListCopy: [],
      orgListCopy2: [],
      organizesOptions: [],
      checkedKeys: [],
      processList: [],
      queryDate: '',
      onMy: false,
      loading: false,
      reportType: 'Day',
      reportTitle: '添加日报',
      reportData: { reportType: 'Day', reportImg: '', workReportAnnexs: [] },
      navList: [{ label: '所有汇报', value: true }, { label: '我的汇报', value: false }],
      typeList: [{ label: '日报', value: 'Day' }, { label: '周报', value: 'Week' }, { label: '月报', value: 'Month' }],
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
      radioValue: 'Public',
      QRcodeImg: '',
      reportListData: '',
      addData: {
        projectManagement: {},
        building: {},
        floor: null,
        industry: null,
        decorationId: null,
        investmentStatus: null,
        expectedUnitPrice: null,
        priceUnit: 'M2DAYS'
      },
      rules: {
        startDate: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        secrecyType: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        reportContent: [
          { required: true, message: '请输入汇报内容', trigger: 'blur' }
        ],
        visibleUsers: [
          { required: true, message: '请选择员工', trigger: 'change' }
        ]
      },
      fieldsList: [],
      visibilityValue: [],
      formLabelWidth: '120px',
      hourseVisible: false,
      selProject: false,
      selHourse: false,
      hourseList: '',
      detailsShow: false,
      onRent: false,
      queryName: '',
      onExpected: false,
      commentDialog: false,
      dailyDialog: false,
      weChatDialog: false,
      cmValue: '',
      options: [{
        value: 'Public',
        label: '公开'
      }, {
        value: 'Private',
        label: '隐私'
      }],
      staffOptions: [],
      commentData: { workReportId: '' },
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.treeForm.filter(val)
    },
    filterText2 (val) {
      this.$refs.treeForm2.filter(val)
    }
  },
  created () {
    this.queryOrganizeList2()
  },
  methods: {
    getformat2 (str) {
      return getformat(str)
    },
    setFile (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    readAll () {
      let organizeId = []
      let selectSpan2 = this.selectSpan2
      selectSpan2.forEach(ele => {
        organizeId.push(ele.value)
      })
      organizeId = organizeId.join(',')
      context.http.get('/cms/api/readAllWorkReports', {
        organizeId: organizeId,
        date: this.queryDate,
        onMy: this.onMy,
        reportType: this.reportType
      }).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.query()
      }).catch(error => {
        console.info(error)
      })
    },
    reCallWorkReports (id) {
      context.http.get(`/cms/api/reCallWorkReports/${id}`).then(res => {
        if (res.status === 200) {
          this.$message({
            message: '汇报已撤回',
            type: 'success'
          })
          this.query()
        }
      }).catch(error => {
        console.info(error)
        this.query()
      })
    },
    weekFormat (a, reportType) { // a为任意时间格式 2020-10-21 2020/12/05 "2014-09-08T08:02:17-05:00"
      if (reportType === 'Day') {
        return a
      } else if (reportType === 'Week') {
        let b = moment(a).format('w') // 获取当前起始日期是当年的第几周
        let c = moment(a).format('YYYY')
        let d = moment(a).format('M')
        let e = moment(a).format('D')
        let f = moment(a).day(7).format('M')
        let g = moment(a).day(7).format('D')
        let weekText = `${b}周（${d}月${e}日-${f}月${g}日）`
        console.log(weekText)
        return weekText
      } else if (reportType === 'Month') {
        return moment(a).format('YYYY-MM')
      }
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    pictureClose () {
      this.showPicture = false
    },
    showReportImg (img) {
      this.imgArr = [img]
      this.showPicture = true
    },
    changeNav (inx) {
      this.navList.forEach(item => {
        item.value = false
      })
      this.navList[inx].value = true
      if (inx === 0) {
        this.onMy = false
      } else if (inx === 1) {
        this.onMy = true
      } else {
        this.onMy = null
      }
      this.pager.currentPage = 1
      this.query()
    },
    selectNav (item, index) {
      // this.tabIndex = index
      // this.reportType = item.value
      this.queryDate = ''
      this.pager.currentPage = 1
      this.query()
    },
    formatreplace (description) {
      if (!description) {
        return
      }
      let html = description.replace(/\n/g, '<br/>')
      return html
    },
    formateData (val) {
      if (val) {
        return val.replace('T', '  ')
      } else {
        return '-'
      }
    },
    transReportType (val) {
      let str = ''
      if (val === 'Day') {
        str = '日'
      } else if (val === 'Week') {
        str = '周'
      } else {
        str = '月'
      }
      return str
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    openDialog (type) {
      this.reportData.workReportAnnexs = []
      if (type === 'Day') {
        this.dailyDialog = true; this.reportData.reportType = 'Day'; this.reportTitle = '添加日报'
      } else if (type === 'Week') {
        this.dailyDialog = true; this.reportData.reportType = 'Week'; this.reportTitle = '添加周报'
      } else {
        this.dailyDialog = true; this.reportData.reportType = 'Month'; this.reportTitle = '添加月报'
      }
      this.queryOrganizeList()
    },
    search () {
      this.pager.currentPage = 1
      this.query()
      this.organizationShow2 = false
      this.filterText2 = ''
    },
    current_change (currentPage) {
      this.pager.currentPage = currentPage
      this.query()
    },
    pgSizeSelectFn () {
      this.pager.currentPage = 1
      this.query()
    },
    choose (state) {
      if (state === 'project') {
        this.selHourse = false
        this.selProject = !this.selProject
      } else {
        this.selProject = false
        this.selHourse = !this.selHourse
      }
    },
    radiochange (val) {
      this.radioValue = val
      this.pager.currentPage = 1
      this.query()
    },
    QRcode (id) {
      axios({ method: 'GET', url: `/cms/api/QRcode/download/${id}`, responseType: 'blob' }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        this.QRcodeImg = url
        this.weChatDialog = true
      })
    },
    downloadFile (item) {
      axios({ method: 'GET', url: '/ywm/api/annex/download', params: { annexURL: item.annexURL, annexName: item.annexName }, responseType: 'blob' }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', item.annexName)
        document.body.appendChild(link)
        link.click()
      })
    },
    query () {
      let organizeId = []
      let selectSpan2 = this.selectSpan2
      selectSpan2.forEach(ele => {
        organizeId.push(ele.value)
      })
      organizeId = organizeId.join(',')
      context.http.get('/cms/api/workReports', {
        organizeId: organizeId,
        date: this.queryDate,
        onMy: this.onMy,
        reportType: this.reportType,
        page: (this.pager.currentPage - 1),
        size: this.pager.pgSize,
        sort: 'reportingTime,desc'
      }).then(res => {
        this.reportListData = res.data
        this.pager.total = Number(res.headers['x-total-count'])
      })
    },
    remoteMethod (query) {
      if (query !== '') {
        // this.loading = true
        this.queryStaff(query)
      } else {
        this.staffOptions = []
      }
    },
    setpdleft (val) {
      this.hourseList = val
    },
    addDaily () {

    },
    addComment () {
      let user = JSON.parse(sessionStorage.getItem('user'))
      this.commentData.userId = user.id
      this.commentData.userName = user.name
      context.http.post('/cms/api/comments', this.commentData).then(res => {
        if (res.status === 201) {
          this.commentDialog = false
          this.commentData.content = ''
          this.query()
        }
      }).catch(error => {
        console.info(error)
      })
    },
    addReport () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let user = JSON.parse(sessionStorage.getItem('user'))
          this.reportData.userId = user.id
          this.reportData.userName = user.name
          if (user.userPostManagements.length === 0) {
            console.error('所属组织为空！')
            return
          } else {
            this.reportData.userOrganizeName = user.userPostManagements[0].organize.name
          }
          if (this.selectSpan.length === 0) {
            this.$message.error('请选择汇报对象！')
            return
          }
          let arr = []
          this.selectSpan.forEach(ele => {
            arr.push({ userId: ele.userId, userName: ele.userName })
          })
          var obj = {}

          arr = arr.reduce(function (item, next) {
            obj[next.userId] ? '' : obj[next.userId] = true && item.push(next)
            return item
          }, [])
          this.reportData.visibleUsers = arr
          context.http.post('/cms/api/workReports', this.reportData).then(res => {
            if (res.status === 201) {
              this.dailyDialog = false
              this.reportData = { reportType: 'Day', reportImg: '', workReportAnnexs: [] }
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
    async imageChange (event) {
      let path = ''
      let files = event.target.files
      if (files.length > 0) {
        if (files[0].size > (1024 * 1024 * 3)) {
          this.$message.error('上传图片不能超过3M')
          return
        } else if ((files[0].type !== 'image/png' && files[0].type !== 'image/jpeg')) {
          this.$message.error('上传图片格式不正确')
          return
        }
        let form = new FormData()
        form.append('file', files[0])
        event.target.value = ''
        context.http.post('/ywm/api/image-multipart', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          path = res.data
          this.reportData.reportImg = path
        }).catch(error => {
          console.info(error)
        })
      }
    },
    delAnnex (item, index) {
      this.reportData.workReportAnnexs.splice(index, 1)
    },
    setAnnex (annexURL, annexName) {
      this.reportData.workReportAnnexs.push({
        'annexName': annexName,
        'annexURL': annexURL
      })
      sessionStorage.setItem('subParameData', JSON.stringify(this.subParameData))
    },
    async uploadAttach () {
      // this.reportData.workReportAnnexs = [{annexName: ''}]
      let files = event.target.files
      let form = new FormData()
      form.append('file', files[0])
      let name = files[0].name
      let index = name.lastIndexOf('.')
      let type = name.substr(index + 1).toLowerCase()
      if (files.length > 0 && files[0].size > (1024 * 1024 * 10)) {
        this.$message.error('附件不能大于10M')
        return
      }
      // if (index > 0 && type !== 'docx' && type !== 'doc' && type !== 'xlsx' && type !== 'xls' && type !== 'pdf') {
      //   this.$message({
      //     message: '格式错误，请上传word、pdf、excel格式文件',
      //     type: 'error'
      //   })
      //   return
      // }
      event.target.value = ''
      context.http.post('/ywm/api/image-multipart', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
        // this.$set(this.reportData, 'annexName', name)
        // this.$set(this.reportData, 'annexURL', res.data)
        this.reportData.workReportAnnexs.push({
          'annexName': name,
          'annexURL': res.data
        })
      }).catch(error => {
        console.info(error)
        this.$message.error('上传失败')
      })
    },
    async queryStaff (query) {
      let result = await context.http.get('uaa/api/users/allOnGroupPersonnel', {
        page: 0,
        size: 20,
        sort: 'desc',
        jobStatus: 'ONJOB',
        queryName: query
      })
      this.staffOptions = result.data.map(item => {
        return { userId: item.id, userName: item.name }
      })
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
    async queryOrganizeList22 () {
      this.orgList = []
      this.orgListCopy2 = []
      context.http.get('/uaa/api/organizes/tree?postFlg=false').then(res => {
        if (res.status === 200) {
          this.orgList = res.data.organizeTree
          this.orgListCopy2 = JSON.parse(JSON.stringify(this.orgList))
          let cascaderData = []
          this.orgListCopy2.forEach(item => {
            cascaderData.push(this.parseOrganize(item))
          })
          this.orgListCopy2 = cascaderData
        }
      })
    },
    async queryOrganizeList2 () {
      let result = await context.http.get('uaa/api/organizes/tree', { postFlg: false })
      let organizesOptions = result.data.organizeTree
      // organizesOptions.unshift({ leaf: true, data: {id: '', name: '无上级组织'}, children: [] })
      let cascaderData = []
      organizesOptions.forEach(item => {
        cascaderData.push(this.parseOrganize2(item))
      })
      this.organizesOptions = cascaderData
    },
    parseOrganize2 (organizeTree) {
      if (organizeTree.leaf) {
        return { value: organizeTree.data.id, label: organizeTree.data.name }
      } else {
        return {
          value: organizeTree.data.id,
          label: organizeTree.data.name,
          children: organizeTree.children.map(item => {
            return this.parseOrganize2(item)
          })
        }
      }
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
          this.queryprevContacts()
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
    delSelect2 (data) {
      let selectSpan = this.selectSpan2
      selectSpan.forEach((ele, index) => {
        if (ele.value === data.value) {
          this.selectSpan2.splice(index, 1)
          this.$refs.treeForm2.setChecked(ele, false)
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
    handleCheckChange2 (data, checked, indeterminate) {
      let selectSpan = this.selectSpan2
      if (checked && !data.disabled && data.value !== null) {
        selectSpan.push(data)
      } else {
        selectSpan.forEach((ele, index) => {
          if (ele.value === data.value) {
            selectSpan.splice(index, 1)
          }
        })
      }
      this.selectSpan2 = selectSpan
    },
    trimStr (str) { return str.replace(/(^\s*)|(\s*$)/g, '') },
    compareDate (date) {
      let nowdate = new Date()
      let date1 = new Date(date)
      let showRturnBtn = false
      if (nowdate.getTime() - date1.getTime() > 0) {
        showRturnBtn = false
      } else {
        showRturnBtn = true
      }
      return showRturnBtn
    }
  },
  mounted () {
    this.query()
    this.queryStaff()
  }
}
</script>
<style lang="scss">
@import "../../../style/mixins";
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
.reportingCenter {
  font-size: 16px;
  background-color: #f9f9f9;
  .hourse_container {
    background-color: #f9f9f9;
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
    .search-bar {
      > div {
        display: flex;
        align-items: center;
      }
      .navSelected {
        background-color: #0f75ff !important;
        color: #fff !important;
      }
      .query-btn {
        margin-left: 10px;
        display: inline-block;
      }
      .operation-btn{
        display: inline-block;
        font-size: 14px;
        cursor: pointer;
        &:hover {
          background-color: #ffffff!important;
          color: #0f75ff!important;
          text-decoration: underline;
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
      .unread {
        display: inline-block;
        width: 60px;
        height: 60px;
        background: url(../../../assets/notSent.png) no-repeat;
        background-size: contain;
        position: absolute;
        left: 0;
        top: 0;
      }
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
        .return {
          flex: 1;
          text-align: right;
          span {
            display: inline-block;
            text-align: center;
            cursor: pointer;
            width: 70px;
            height: 30px;
            line-height: 28px;
            background: #FFFFFF;
            border: 1px solid #3575F6;
            border-radius: 2px;
            color: #3575F6;
            font-size: 14px;
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
          background: url(../../../assets/qrcode.png) no-repeat;
          background-size: contain;
        }
        .pinglun {
          background: url(../../../assets/pinglun.png) no-repeat;
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
      width: 100px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      /* border:1px solid rgba(53,119,246,1);
      color: #3577F6; */
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
        background: url(../../../assets/closed.png) no-repeat;
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
    padding: 10px 0;
    position: relative;
    i.icon-bottom {
      position: absolute;
      right: 10px;
      top: 47px;
      cursor: pointer;
    }
  }
  .select-wrap2 {
    display: inline-block;
    position: relative;
    width: 248px;
    padding: 0;
    margin-left: 10px;
    margin-right: 10px;
    .select-span {
      height: 32px;
      line-height: 32px;
      margin: 0;
      i {
        height: 25px;
        line-height: 25px;
        top: 0 !important;
      }
      span {
        margin: 4px 0 6px 6px;
      }
    }
    i {
      height: 40px;
      line-height: 40px;
      top: -3px !important;
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
      i {
        font-size: 12px;
        float: right;
        cursor: pointer;
      }
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
  .organization2 {
    width: 250px;
    display: inline-block;
    position: absolute;
    top: 40px;
    left: 0;
    background-color: #fff;
    z-index: 99;
    .el-input {
      margin: 10px 0 10px 14px;
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
@keyframes cloud-in {
  0% {
    padding-right: 0;
  }
  100% {
    padding-right: 350px;
  }
}
@keyframes cloud-in2 {
  0% {
    padding-right: 350px;
  }
  100% {
    padding-right: 0;
  }
}
.paddingLeft {
  animation: cloud-in 0.2s 0s ease-out forwards;
}
.paddingRight {
  animation: cloud-in2 0.2s 0s ease-out forwards;
}
.report-type {
  div {
    vertical-align: top;
  }
}
</style>
