<template>
  <div class="activityNotice">
    <p class="page_head_title">客户通知</p>
    <div class="hourse_container">
      <ul class="default_tab_block">
        <li @click="toProjectNotice" v-if="hasAuthority('02030601')">项目公告</li>
        <li class="active" v-if="hasAuthority('02030604')">活动通知</li>
      </ul>
      <div class="search-bar">
        <div>
          <el-select v-model="seachParam.projectId"
                     style="width:200px;">
            <el-option v-for="(item,index) in projectManagementsList"
                       :key="index"
                       :label="item.referred"
                       :value="item.id"></el-option>
          </el-select>
          <el-input v-model="seachParam.name"
                    size="small"
                    placeholder="请输入活动名称"
                    maxlength="20"></el-input>
          <el-date-picker style="margin-right: 0"
                          size="small"
                          v-model="seachParam.startDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="开始日期">
          </el-date-picker>
          <span style="color: #999;padding: 0 5px">-</span>
          <el-date-picker style="margin-right: 20px;"
                          size="small"
                          v-model="seachParam.endDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="结束日期">
          </el-date-picker>
          <div style="margin-left:0;margin-top: 0;display: inline-block"
               @click="search"
               class="query-btn">查询</div>
        </div>
        <div>
          <el-button class="tban tban1"
                     v-if="hasAuthority('02030605')"
                     @click="openDialog"><i class="iconfont icon-crm_xinzeng-"></i> 新增活动</el-button>
        </div>
      </div>
      <div class="hourse-table">
        <div class="table">
          <el-table :data="tableData"
                    style="width: 100%">
            <el-table-column label="活动图片"
                             align="center">
              <template slot-scope="scope">
                <img :src="scope.row.image"
                     alt=""
                     style="width:40px;height:40px">
              </template>
            </el-table-column>
            <el-table-column label="项目"
                             prop="projectManagementName"
                             align="center">
            </el-table-column>
            <el-table-column prop="activityName"
                             label="活动名称"
                             align="center"></el-table-column>
            <el-table-column label="活动时间"
                             align="center">
              <template slot-scope="scope">
                {{scope.row.startDate}} ~ {{scope.row.endDate}}
              </template>
            </el-table-column>
            <el-table-column label="是否在首页显示"
                             align="center">
              <template slot-scope="scope">
                {{scope.row.topFlg?'是':'否'}}
              </template>
            </el-table-column>
            <el-table-column label="操作"
                             v-if="hasAuthority('02030606')"
                             align="center">
              <template slot-scope="scope">
                <el-button @click="activityNotice(scope.$index, scope.row)"
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
    <!-- 新增 -->
    <el-dialog title="新增活动"
               :visible.sync="dailyDialog"
               class="addGoodsDialog el_dialog_new "
               width="600px"
               @close="dailyDialogClose"
               :close-on-click-modal="false">
      <div class="dialog_content">
        <el-form :model="addData"
                 :rules="addFlowRules"
                 ref="addData">
          <div class="content content2">
            <el-form-item prop="projectManagementId">
              <span>所属项目<i class="required">*</i></span>
              <el-select v-model="addData.projectManagementId"
                         style="width:260px"
                         size="small">
                <el-option v-for="(item,index) in projectManagementsList"
                           :key="index"
                           :label="item.referred"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="activityName">
              <span>活动名称<i class="required">*</i></span>
              <el-input v-model="addData.activityName"
                        style="width:260px"
                        maxlength="20"
                        size="small"></el-input>
            </el-form-item>
            <el-form-item prop="startDate">
              <span>活动时间<i class="required">*</i></span>
              <el-date-picker v-model="timePicker"
                              style="width:260px"
                              type="daterange"
                              size="small"
                              value-format="yyyy-MM-dd"
                              @change="timePickerChange"
                              range-separator="-"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <span>是否在首页显示<i class="required">*</i></span>
              <el-switch v-model="addData.topFlg"
                         active-color="#13ce66"
                         inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item prop="image"
                          style="width:100%">
              <span>宣传图<i class="required">*</i></span>
              <el-input v-model="addData.image"
                        style="display:none"></el-input>
              <aliUpload class="aliUpload deviceDetails aliUpload_new"
                         style="width:140px;height:120px"
                         :upLoadText="upLoadText_cost"
                         :fileType="fileType_cost"
                         :fileSize="fileSize"
                         :iconShow="false"
                         :iconImg="iconImg"
                         :uploadIcon="true"
                         v-if="addData.image===''||!addData.image"
                         @setAnnex="setAnnex" />
              <div v-else
                   style="width:140px;height:120px"
                   class="imgBox imgBoxModel">
                <img :src="addData.image"
                     @click="showImg(addData.image)"
                     class="logoImg">
                <div @click="showImg(addData.image)"
                     class="bottomTips">预览图片</div>
                <div class="iconfont icon-cms_cuowu deleteImg"
                     @click="deleLogo"></div>
              </div>
              <div class="tips">（建议尺寸：<i class="required">694＊270</i>像素；支持格式JPG,PNG，大不于2M）</div>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer"
           class="slotfooter">
        <span @click="dailyDialogClose"
              class="details_cannelBtn">取消</span>
        <span class="details_submitBtn"
              @click="addActivityNotice()">确定</span>
      </div>
    </el-dialog>
    <activityNoticeDetails :showDrawer="showDetails"
                           :detailsData="detailsData"
                           @query="search"
                           @cannel="cannel"
                           @drawerClose='drawHandleClose'>
    </activityNoticeDetails>
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
  </div>
</template>
<script>
import axios from 'axios'
import context from '@/service'
import * as hub from '@/service/eventHub'
import richTextEditor from '@/components/richTextEditor.vue'
import activityNoticeDetails from './components/activityNoticeDetails'
import aliUpload from '@/components/aliUpload.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import { type } from 'os'
export default {
  name: 'activityNotice',
  components: {
    richTextEditor,
    picturePrevie,
    activityNoticeDetails,
    aliUpload
  },
  data () {
    var cheackCoverImg = (rule, value, callback) => {
      if (!value || value === '') {
        return callback(new Error('请上传宣传图片'))
      } else {
        callback()
      }
    }
    return {
      detailsData: {},
      seachParam: {
        projectId: '',
        name: '',
        startDate: '',
        endDate: ''
      },
      tableData: [],
      timePicker: [],
      imgArr: [],
      num: 0,
      addData: {
        topFlg: true,
        projectManagementId: '',
        activityName: '',
        startDate: '',
        endDate: '',
        image: ''
      },
      addFlowRules: {
        projectManagementId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        startDate: [
          { required: true, message: '请选择活动时间', trigger: 'change' }
        ],
        activityName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        image: [
          { validator: cheackCoverImg, trigger: 'change' }
        ]
      },
      iconImg: 'icon-shangchuantupianicon',
      upLoadText_cost: '上传图片',
      fileType_cost: ['png', 'jpg'],
      fileSize: 2,
      projectManagementsList: [],
      showDetails: false,
      showPicture: false,
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
      dailyDialog: false
    }
  },
  watch: {

  },
  created () {
    this.projectManagementsList = this.$store.state.projectManagementsList
  },
  mounted () {
    this.query()
  },
  methods: {
    cannel (id) {
      // console.log(id)
      context.http.get(`/cms/api/activityNotice/${id}`).then(res => {
        if (res.status === 200) {
          this.detailsData = res.data
          // this.showDetails = true
        }
      })
    },
    activityNotice (index, row) {
      context.http.get(`/cms/api/activityNotice/${row.id}`).then(res => {
        if (res.status === 200) {
          this.detailsData = res.data
          this.showDetails = true
        }
      })
    },
    timePickerChange (timeArr) {
      if (timeArr.length) {
        this.addData.startDate = timeArr[0]
        this.addData.endDate = timeArr[1]
      } else {
        this.addData.startDate = ''
        this.addData.endDate = ''
      }
    },
    addActivityNotice () {
      this.$refs['addData'].validate((valid) => {
        if (valid) {
          context.http.post('/cms/api/activityNotice', this.addData).then(res => {
            if (res.status === 201 || res.status === 200) {
              this.dailyDialogClose()
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
    query () {
      context.http.get('/cms/api/activityNotice', {
        projectId: this.seachParam.projectId,
        name: this.seachParam.name,
        startDate: this.seachParam.startDate,
        endDate: this.seachParam.endDate,
        page: (this.pager.currentPage - 1),
        size: this.pager.pgSize,
        sort: 'createdDate,desc'
      }).then(res => {
        if (res.status === 200) {
          this.tableData = res.data
          this.pager.total = Number(res.headers['x-total-count'])
        }
      })
    },
    dailyDialogClose () {
      this.timePicker = []
      this.$refs['addData'].resetFields()
      this.dailyDialog = false
    },
    pictureClose () {
      this.showPicture = false
    },
    showImg (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
      console.log(this.imgArr)
    },
    deleLogo () {
      this.addData.image = ''
    },
    setAnnex (annexURL, annexName) {
      this.$set(this.addData, 'image', annexURL)
    },
    openDialog (type) {
      this.dailyDialog = true
    },
    current_change (currentPage) {
      this.pager.currentPage = currentPage
      this.query()
    },
    pgSizeSelectFn () {
      this.pager.currentPage = 1
      this.query()
    },
    search () {
      this.pager.currentPage = 1
      this.query()
    },
    toProjectNotice () {
      this.$router.replace({ name: 'projectNotice' })
    },
    drawHandleClose () {
      this.showDetails = false
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    }
  }
}
</script>
<style lang="scss">
.activityNotice {
  .el-dialog__wrapper {
    &.addGoodsDialog {
      .el-dialog {
        .el-dialog__header {
          margin-bottom: 0px;
        }
        .el-dialog__body {
          background-color: #faf7fa;
          .steps {
            height: 60px;
            padding: 0 15px;
            border-top: 1px solid #f6f6f6;
            background-color: #ffffff;
            margin-bottom: 15px;
          }
          .dialog_content {
            background-color: #ffffff;
            margin-top: 15px;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
// @import "../../../../style/mixins";
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
.activityNotice {
  font-size: 16px;
  background-color: #f9f9f9;
  .addGoodsDialog {
    .slotfooter {
      .save {
        margin-right: 12px;
        height: 32px;
        line-height: 32px;
        color: #3577f6;
        border: 1px solid #3577f6;
        background: rgba(53, 119, 246, 0.05);
      }
    }
    .el-form {
      .content {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 100%;
        .el-form-item {
          width: 45%;
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
              color: #666666;
              font-size: 12px;
              height: 40px;
              line-height: 40px;
            }
            .tips {
              font-size: 12px;
              color: #999999;
              margin-top: 10px;
            }
            // .imgBox {
            //   width: 140px;
            //   height: 120px;
            //   position: relative;
            //   background: rgba(255, 255, 255, 1);
            //   border: 1px solid rgba(234, 234, 234, 1);
            //   border-radius: 4px;
            //   > .bottomTips {
            //     height: 25px;
            //     position: absolute;
            //     left: 0px;
            //     bottom: 0px;
            //     width: 140px;
            //     background-color: #fdffff;
            //     display: flex;
            //     align-items: center;
            //     font-size: 12px;
            //     justify-content: space-between;
            //     padding: 0 5px;
            //     > span {
            //       display: inline-block;
            //       width: 60%;
            //       overflow: hidden;
            //       text-overflow: ellipsis;
            //       white-space: nowrap;
            //       padding: 0 5px;
            //     }
            //     > i {
            //       cursor: pointer;
            //     }
            //   }
            // }
          }
        }
      }
    }
  }
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
