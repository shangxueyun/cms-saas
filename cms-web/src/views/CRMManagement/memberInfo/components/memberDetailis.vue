<template>
  <div>
    <drawer :show="memberDetailisShow"
            :title="drawerTitle"
            @on-hide="onHide">
      <div slot="drawer"
           class="memberDetailis details-content">
        <div class="memberInfo">
          <p class="title">基本信息</p>
          <div class="content">
            <div class="item">
              <img class="userImg" :src="detailData.headImage" v-if="detailData.headImage">
              <img class="userImg" src="../../../../assets/login-head.png" v-else>
            </div>
            <div class="item">
              <span>会员名称：</span>
              <span>{{detailData.memberName}}</span>
            </div>
            <div class="item">
              <span>姓名：</span>
              <span>{{detailData.nickname}}</span>
            </div>
            <div class="item">
              <span>会员等级：</span>
              <span v-if="detailData.memberCard">{{detailData.memberCard.name}}</span>
            </div>
            <div class="item">
              <span>当前积分：</span>
              <span>{{detailData.score}}</span>
            </div>
            <div class="item">
              <span>累计积分：</span>
              <span>{{detailData.totalScore}}</span>
            </div>
            <div class="item">
              <span>累计消费次数：</span>
              <span>{{detailData.orderNum}}</span>
            </div>
            <div class="item">
              <span>累计消费(元)：</span>
              <span>{{detailData.consume}} </span>
            </div>
            <div class="item">
              <span>手机号：</span>
              <span>{{detailData.telephone}}</span>
            </div>
            <div class="item">
              <span>会员卡号：</span>
              <span>{{detailData.cradNumber}}</span>
            </div>
            <div class="item">
              <span>会员生日：</span>
              <span>{{detailData.birthday}}</span>
            </div>
            <div class="item">
              <span>性别：</span>
              <span>{{formatSex(detailData.sex)}}</span>
            </div>
            <div class="item">
              <span>注册会员时间：</span>
              <span>{{memberRegisterTimeFormat(detailData.memberRegisterTime)}}</span>
            </div>
            <div class="item">
              <span>状态：</span>
              <span>{{useStatusFormat(detailData.useStatus)}}</span>
            </div>
          </div>
          <div class="buttomBox">
            <el-button class="bzan bzan3"
                       v-if="detailData.useStatus==='DISABLE'"
                       @click="lockUnLock">解 冻</el-button>
            <el-button class="bzan bzan9"
                       v-if="detailData.useStatus==='USING'"
                       @click="lockDialogVisible = true">冻 结</el-button>
          </div>
        </div>
        <div class="record">
          <p class="title">
            <span :class="{'active':recordType==='1'}"
                  @click="recordTypeChange('1')">积分记录</span>
            <span :class="{'active':recordType==='2'}"
                  @click="recordTypeChange('2')">升降级记录</span>
          </p>
          <div class="content">
            <div class="intRecord"
                 v-if="recordType==='1'">
              <el-timeline class="timeline">
                <el-timeline-item placement="top"
                                  style="position:relative;min-height: 80px;"
                                  v-for="(item, index) in timeLineListData"
                                  :key="index"
                                  size="normal"
                                  :color="nodeColor(index)">
                  <!-- :timestamp="item.time1.replace('T','  ')" -->
                  <div class="timeLineBox"
                       :class="{'audit':item.approvalStatus==='APPROVAL','success':item.approvalStatus==='OK','fail':item.approvalStatus==='NO'}">
                    <div>{{formatApprovalStatus(item.approvalStatus)}}</div>
                    <div :class="{'first':index===0}">{{formatApprovalDate(item.approvalDate)}}</div>
                  </div>
                  <div class="imgBox">
                    <el-tooltip class="item"
                                effect="dark"
                                v-if="item.approvalUserHeadImg && item.approvalUserHeadImg!==''"
                                :content="'审核人：'+item.approvalUserName"
                                placement="bottom-end">
                      <img :src="item.approvalUserHeadImg"
                           class="userImg">
                    </el-tooltip>
                    <div class="noImg"
                         v-if="(!item.approvalUserHeadImg ||item.approvalUserHeadImg==='')&& item.approvalUserName && item.approvalUserName!==''">
                      {{formatApprovalUserName(item.approvalUserName)}}
                    </div>
                    <img :src="userImg"
                         class="noNameNoImg"
                         v-if="(!item.approvalUserHeadImg ||item.approvalUserHeadImg==='') && (!item.approvalUserName || item.approvalUserName==='')">
                  </div>
                  <div class="template"
                       style="padding-left:60px">
                    <p class="project"
                       v-if="item.approvalStatus==='OK' || item.approvalStatus==='NO'"><span>项目简称:</span><span>{{item.projectName}}</span></p>
                    <p v-if="item.approvalStatus==='OK' || item.approvalStatus==='NO'"><span>品牌:</span><span>{{item.tenantName}}</span></p>
                    <p v-if="item.approvalStatus==='OK' || item.approvalStatus==='NO'"><span>小票号码:</span><span>{{item.receiptNumber}}</span></p>
                    <p v-if="item.approvalStatus==='OK' || item.approvalStatus==='NO'"><span>时间:</span><span>{{formatApprovalDate(item.uploadTime)}}</span></p>
                    <p v-if="item.approvalStatus==='OK' || item.approvalStatus==='NO'"><span>消费金额(元):</span><span>{{item.amount}}</span></p>
                    <p v-if="item.approvalStatus==='NO'"><span>审核失败原因:</span><span>{{item.memo}}</span></p>
                    <p v-if="item.approvalStatus==='OK'"><span>兑换积分:</span><span>{{item.integral}}</span></p>
                    <div class="downLoad">
                      <i class="iconfont icon-cms_tupiangeshi"
                         style="transform: rotate(180deg);"></i>
                      <i style="font-size:12px;">小票图片</i>
                      <i class="iconfont icon-xiazaidaoru"
                         title="下载"
                         @click="downloadFile(item.imageUrl)"
                         style="cursor: pointer;"></i>
                      <i class="iconfont icon-cms_chakan-"
                         title="预览"
                         @click="showImg(item.imageUrl)"
                         style="cursor: pointer;"></i>
                    </div>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>
            <div class="upDownRecord"
                 v-else>
              <el-timeline class="timeline">
                <el-timeline-item placement="top"
                                  style="position:relative;"
                                  v-for="(item, index) in timeLineListData1"
                                  :key="index"
                                  :color="nodeColor(index)">
                  <!-- :timestamp="item.time1.replace('T','  ')" -->
                  <div class="timeLineBox"
                       :class="{'up':item.liftingType==='RISE','down':item.liftingType==='DROP'}">
                    <div>{{item.liftingType==='RISE'?'升级':'降级'}}</div>
                    <div>{{item.changeDate}}</div>
                  </div>
                  <div class="template">
                    <p class="project"><span>变更前等级: </span><span>{{item.memberCardFrom.name}}</span></p>
                    <p class="project"><span>变更后等级:</span><span>{{item.memberCardTo.name}}</span></p>
                    <p><span>变更原因:</span><span>{{item.memo}}</span></p>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>
          </div>
        </div>
      </div>
    </drawer>
    <!-- 冻结确认弹窗 -->
    <el-dialog :visible.sync="lockDialogVisible"
               @close="lockDialogClose"
               class="lockDialogClose"
               width="21%">
      <div class="lockDialogContent">
        <img src="../../../../assets/delete1.png">
        <div>
          <p>冻结会员卡</p>
          <span>您是否要冻结该会员的会员卡？</span>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="lockDialogClose">取 消</el-button>
        <el-button type="primary"
                   @click="lockUnLock">确 定</el-button>
      </span>
    </el-dialog>
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
  </div>
</template>
<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import axios from 'axios'
import persondefault from '@/assets/person-default.png'
import picturePrevie from '@/components/picturePrevie.vue'
export default {
  name: 'memberDetailis',
  components: {
    Drawer, picturePrevie
  },
  props: {
    memberDetailisShow: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Object,
      default: {

      }
    }
  },
  watch: {
    detailData: {
      handler: function () {
        this.recordType = '1'
        this.timeLineListData = []
        this.timeLineListData1 = []
        this.getIntRecord(this.detailData.id)
        this.getUpDwonRecord(this.detailData.id)
      }
    }
  },
  created () {

  },
  data () {
    return {
      userImg: persondefault,
      lockDialogVisible: false,
      recordType: '1',
      imgArr: [],
      num: 0,
      showPicture: false,
      timeLineListData: [],
      timeLineListData1: [],
      // nodeColor: '#3575F6',
      drawerTitle: '查看会员资料'
    }
  },
  methods: {
    formatApprovalUserName (name) {
      if (name) {
        if (name.length > 2) {
          return name.substring(name.length - 2)
        } else {
          return name
        }
      }
    },
    nodeColor (index) {
      return index === 0 ? '#3575F6' : '#D3DBEB'
    },
    showImg (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
      console.log(this.imgArr)
    },
    lockDialogClose () {
      this.lockDialogVisible = false
    },
    lockUnLock () {
      context.http.put(`crm/api/member/${this.detailData.id}/freezeOrNot`).then(res => {
        if (res) {
          this.lockDialogVisible = false
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.$emit('lockUnLockSuccess', res.data)
        }
      })
    },
    formatSex (sex) {
      switch (sex) {
        case 'MALE':
          return '男'
        case 'FEMALE':
          return '女'
        default:
          return '-'
      }
    },
    pictureClose () {
      this.showPicture = false
    },
    formatApprovalDate (time) {
      if (time) {
        time = time.substr(0, time.lastIndexOf('T'))
        return time
      }
    },
    formatApprovalStatus (approvalStatus) {
      switch (approvalStatus) {
        case 'APPROVAL':
          return '审核中'
        case 'OK':
          return '审核通过'
        case 'NO':
          return '审核失败'
      }
    },
    async getIntRecord (id) { // 积分记录
      let result = await context.http.get(`crm/api/member/${id}/approvalRecord`)
      this.timeLineListData = result.data
      // console.log(this.timeLineListData)
    },
    async getUpDwonRecord (id) { // 升降级记录
      let result = await context.http.get(`crm/api/member/${id}/cardRecord`)
      this.timeLineListData1 = result.data
      // console.log(this.timeLineListData1)
    },
    useStatusFormat (useStatus) {
      if (useStatus === 'USING') {
        return '使用中'
      } else {
        return '已停用'
      }
    },
    memberRegisterTimeFormat (time) {
      if (time) {
        return time.substring(0, 10)
      } else {
        return '-'
      }
    },
    downloadFile (imgUrl) {
      axios({
        method: 'GET',
        url: '/ywm/api/annex/download',
        params: {
          annexURL: imgUrl,
          annexName: '小票照片.png'
        },
        responseType: 'blob'
      }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '小票照片.png')
        document.body.appendChild(link)
        link.click()
      })
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    recordTypeChange (n) {
      this.recordType = n
    },
    onHide () {
      this.$emit('drawerClose', false)
    }
  }
}
</script>
<style lang="scss" >
.clubCardSet {
  .el-dialog__header {
    border: none;
  }
  .el-dialog__body {
    border-bottom: none;
    padding: 30px 0 !important;
    .lockDialogContent {
      display: -ms-flexbox;
      display: flex;
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
  }
  .lockDialogClose {
    .el-dialog__footer {
      .dialog-footer {
        border: none;
        margin-right: 0;
      }
    }
  }
}
.intRecord .el-timeline-item__node--normal,
.upDownRecord .el-timeline-item__node--normal {
  left: 1px;
  width: 8px;
  height: 8px;
}
.clubCardSet .drawer-head {
  margin: 20px 15px 0 15px;
  border-bottom: 1px solid rgba(229, 229, 229, 1);
}
</style>>
<style lang="scss" scoped>
.lockDialogContent {
  // padding: 20px 0;
}
.memberDetailis {
  width: 1000px;
  display: flex;
  justify-content: space-between;
  padding: 15px;
  min-height: 700px;
  height: calc(100% - 40px);
  // height: calc(100% - 120px);
  > div {
    border: 1px solid rgba(242, 242, 242, 1);
    box-shadow: 0px 2px 3px 0px rgba(190, 199, 208, 0.2);
    > p.title {
      padding-left: 15px;
      height: 40px;
      line-height: 40px;
      background: rgba(250, 250, 250, 1);
      border: 1px solid rgba(242, 242, 242, 1);
    }
    &.memberInfo {
      width: 300px;
      .content {
        padding: 15px;
        .item {
          margin-bottom: 15px;
          > span {
            &:last-child {
              color: #777777;
              font-size: 12px;
            }
          }
          .userImg {
            width: 100px;
            height: 100px;
          }
        }
      }
      .buttomBox {
        margin-top: 205px;
        display: flex;
        flex-direction: row-reverse;
        padding-right: 15px;
        .bzan9 {
          background-color: #ffb300;
        }
      }
    }
    &.record {
      width: 650px;
      > p.title {
        padding: 0;
        > span {
          display: inline-block;
          padding: 0 20px;
          height: 38px;
          line-height: 38px;
          cursor: pointer;
          &.active {
            color: #3577f6;
            border-bottom: 2px solid #3577f6;
          }
        }
      }
      .content {
        padding: 15px;
        height: calc(100% - 70px);
        overflow-y: auto;
        .intRecord {
          padding-left: 150px;
          padding-top: 30px;
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
              font-size: 12px;
              color: #999999;
              &.project {
                font-size: 14px;
                color: #333333;
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
              > .first {
                color: #3575f6 !important;
              }
              &.audit {
                > div {
                  &:first-child {
                    background-color: #3575f6;
                    color: #ffffff;
                    border-radius: 4px;
                  }
                  &:last-child {
                    color: #999999;
                  }
                }
              }
              &.success {
                > div {
                  &:first-child {
                    background-color: #83bf68;
                    color: #ffffff;
                    border-radius: 4px;
                  }
                  &:last-child {
                    color: #999999;
                  }
                }
              }
              &.fail {
                > div {
                  &:first-child {
                    background-color: #f99a12;
                    color: #ffffff;
                    border-radius: 4px;
                  }
                  &:last-child {
                    color: #999999;
                  }
                }
              }
              > div {
                position: absolute;
                right: 0;
                &:first-child {
                  display: inline-block;
                  width: 60px;
                  height: 20px;
                  line-height: 20px;
                }
                &:last-child {
                  top: 30px;
                }
              }
            }
            p {
              margin-bottom: 5px;
            }
          }
        }
        .upDownRecord {
          padding-left: 150px;
          padding-top: 30px;
          .timeline {
            .downLoad {
              height: 26px;
              line-height: 26px;
              border: 1px solid #d3dbeb;
              border-radius: 6px;
              padding: 0px 10px;
              width: 150px;
              display: flex;
              justify-content: space-between;
              > i {
                font-size: 12px;
                font-style: normal;
                color: #005cb3;
              }
            }
            p {
              font-size: 12px;
              color: #999999;
              &.project {
                font-size: 14px;
                color: #333333;
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
              &.up {
                > div {
                  &:first-child {
                    background-color: #3575f6;
                    color: #ffffff;
                    border-radius: 4px;
                  }
                  &:last-child {
                    color: #3575f6;
                  }
                }
              }
              &.down {
                > div {
                  &:first-child {
                    background-color: #f99a12;
                    color: #ffffff;
                    border-radius: 4px;
                  }
                  &:last-child {
                    color: #999999;
                  }
                }
              }
              > div {
                position: absolute;
                right: 0;
                &:first-child {
                  display: inline-block;
                  width: 60px;
                  height: 20px;
                  line-height: 20px;
                }
                &:last-child {
                  top: 30px;
                }
              }
            }
            p {
              margin-bottom: 5px;
            }
          }
        }
      }
    }
  }
}
</style>
