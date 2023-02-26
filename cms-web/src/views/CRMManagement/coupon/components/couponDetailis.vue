<template>
  <!-- :showEditBtn="showEditBtn" -->
  <div class="couponDetailis">
    <drawer :show="detailisShow"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="details_content"
           slot="drawer">
        <div class="tab">
          <span :class="{'active':tab===1}"
                @click="tabChange(1)">基本信息</span>
          <span :class="{'active':tab===2}"
                @click="tabChange(2)">操作记录</span>
        </div>
        <div class="mainContent">
          <div class="content content1"
               v-show="tab===1">
            <div class="item">
              <div>优惠券名称</div>
              <div>{{detailData.name}}</div>
            </div>
            <div class="item">
              <div>优惠券类型</div>
              <div>{{couponFormatter(detailData.type)}}</div>
            </div>
            <div class="item"
                 v-if="detailData.type === 'MONEY_OFF'">
              <div>消费门槛</div>
              <div>{{detailData.moneyOffLimit}}元</div>
            </div>
            <div class="item"
                 v-if="detailData.type === 'MONEY_OFF'">
              <div>减免金额</div>
              <div>{{detailData.moneyOffAmount}}元</div>
            </div>
            <div class="item"
                 v-if="detailData.type === 'PERCENTAGE_OFF'">
              <div>折扣比例</div>
              <div>{{detailData.percentage}} %</div>
            </div>
            <div class="item">
              <div>卡券是否可分享</div>
              <div>{{detailData.canShare?'是':'否'}}</div>
            </div>
            <div class="item">
              <div>开始时间</div>
              <div>{{timeFormatter(detailData.startTime)}}</div>
            </div>
            <div class="item">
              <div>结束时间</div>
              <div>{{timeFormatter(detailData.endTime)}}</div>
            </div>
            <div class="item">
              <div>优惠券数量</div>
              <div>{{detailData.totalLimit}}</div>
            </div>
            <div class="item">
              <div>每日最大领取数量</div>
              <div>{{detailData.dayLimit}}</div>
            </div>
            <div class="item">
              <div>游客是否可以领取</div>
              <div>{{detailData.canVisitor?'是':'否'}}</div>
            </div>
            <div class="item">
              <div>会员等级限制</div>
              <div>{{memberFormat(detailData.memberLimitDTO)}}</div>
            </div>
            <div class="item">
              <div>优惠券使用有效期</div>
              <div>{{detailData.effectiveTime}}天</div>
            </div>
            <div class="item">
              <div>优惠券状态</div>
              <div>{{statusForMatter(detailData.reviewStatus)}}</div>
            </div>
            <div class="item">
              <div>优惠券说明</div>
              <div>{{detailData.description}}</div>
            </div>
            <div class="item"></div>
            <div class="item"
                 style="width:100%">
              <div>优惠券LOGO</div>
              <div class="imgBox">
                <img :src="imgSrc"
                     style="width:100%;height:100%"
                     class="logoImg">
                <div class="bottomTips">
                  <span>{{detailData.name}}</span>
                  <i class="iconfont icon-cms_chakan-"
                     @click="showImg(imgSrc1)"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="content content2"
               v-show="tab===2">
            <div class="timelineBox">
              <el-timeline class="timeline">
                <el-timeline-item placement="top"
                                  style="position:relative;min-height: 80px;"
                                  v-for="(item, index) in recordsList"
                                  :key="index"
                                  :color="nodeColor(index)"
                                  size="normal">
                  <div class="statusBox">
                    <div :class="{'shangxian':item.reviewStep==='PRODUCE','xiaxian':item.reviewStep==='CANCELED','tjsh':item.reviewStep==='REVIEW','first':index===0}">{{item.reviewStepD}}</div>
                    <div :class="{'first':index===0}">{{formatApprovalDate(item.recordTime)}}</div>
                  </div>
                  <div class="template">
                    <p v-if="item.reviewUserName"><span>操作人 : </span><span>{{item.reviewUserName}}</span></p>
                    <p v-if="item.reviewResultD"><span>审核结果 : </span><span>{{item.reviewResultD}}</span></p>
                    <p v-if="item.remark"><span>备注 : </span><span>{{item.remark}}</span></p>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>
            <div style="width:100%"
                 v-if="(detailData.reviewStatus==='REVIEWING' || detailData.reviewStatus==='APPLY_DISABLE')&&hasAuthority('05070102')">
              <span>审核备注<i class="required">*</i></span>
              <el-input type="textarea"
                        resize='none'
                        maxlength="50"
                        :rows='5'
                        placeholder="请输入内容"
                        v-model="remark">
              </el-input>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <span @click="onHide"
              class="closeBtn">关闭</span>
        <span class="peveBtn"
              v-if="tab!==1 && (detailData.reviewStatus==='REVIEWING' || detailData.reviewStatus==='APPLY_DISABLE')"
              @click="peveBtn">上一步</span>
        <span class="nextBtn"
              v-if="tab!==2 && (detailData.reviewStatus==='REVIEWING' || detailData.reviewStatus==='APPLY_DISABLE')"
              @click="nextBtn">下一步</span>
        <span class="rejectBtn"
              v-if="tab===2 && (detailData.reviewStatus==='REVIEWING' || detailData.reviewStatus==='APPLY_DISABLE') && hasAuthority('05070102')"
              @click="reject">驳回</span>
        <span class="passBtn"
              v-if="tab===2 && (detailData.reviewStatus==='REVIEWING' || detailData.reviewStatus==='APPLY_DISABLE') && hasAuthority('05070102')"
              @click="pass">通过</span>
      </div>
    </drawer>
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
    <!-- 驳回弹窗 -->
    <el-dialog :visible.sync="rejectDialogVisible"
               class="rejectDialog"
               width="21%"
               center>
      <div class="content">
        <div>
          <img :src="deleteIcon"
               class="deleteIcon">
          <div>
            <span>驳回审核</span>
            <span>是否驳回审核该优惠券？</span>
          </div>
        </div>
        <div class="footer">
          <span @click="rejectDialogVisible = false">取 消</span>
          <span @click="rejectFn">确 定</span>
        </div>
      </div>
    </el-dialog>
    <!-- 通过弹窗 -->
    <el-dialog :visible.sync="passDialogVisible"
               class="rejectDialog"
               width="21%"
               center>
      <div class="content">
        <div>
          <img :src="passIcon"
               class="deleteIcon">
          <div>
            <span>通过审核</span>
            <span>是否通过审核该优惠券！</span>
          </div>
        </div>
        <div class="footer">
          <span @click="passDialogVisible = false">取 消</span>
          <span @click="passFn">确 定</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import aliUpload from '@/components/aliUpload.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import deleteIcon from '@/assets/delete2.png'
import passIcon from '@/assets/success1.png'
import axios from 'axios'
import * as JSOG from 'jsog'
export default {
  name: 'couponDetailis',
  components: {
    Drawer,
    picturePrevie,
    aliUpload
  },
  props: {
    detailisShow: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Object,
      default: {}
    },
    statusList: {
      type: Array,
      default: []
    }
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
  },
  watch: {
    detailisShow: {
      handler (newValue, oldValue) {
        if (newValue) {
          this.getrecords()
          this.imgSrc = this.detailData.logoImg + '?x-oss-process=image/resize,w_' + 140 + ',h_' + 140 + ',m_fixed'
          this.imgSrc1 = this.detailData.logoImg + '?x-oss-process=image/resize,w_' + 600 + ',h_' + 600 + ',m_fixed'
        }
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      imgSrc: '',
      imgSrc1: '',
      deleteIcon: deleteIcon,
      passIcon: passIcon,
      passDialogVisible: false,
      rejectDialogVisible: false,
      remark: '',
      recordsList: [
        // {
        //   type: 'primary',
        //   icon: 'el-icon-circle-check',
        //   createdDate: '2020-03-13T03:49:32Z',
        //   recordTime: '2020-03-13T11:49:32',
        //   remark: null,
        //   reviewResultD: null,
        //   reviewStep: 'PUBLISH',
        //   reviewStepD: '上线',
        //   reviewTypeD: '新增',
        //   reviewUserId: 87,
        //   reviewUserName: 'test_f'
        // },
        // {
        //   type: 'danger',
        //   icon: 'el-icon-warning-outline',
        //   createdDate: '2020-03-13T03:49:27Z',
        //   recordTime: '2020-03-13T11:49:27',
        //   remark: '审核通过',
        //   reviewResultD: '审核通过',
        //   reviewStep: 'REVIEW',
        //   reviewStepD: '审核-新增',
        //   reviewTypeD: '新增',
        //   reviewUserId: 87,
        //   reviewUserName: 'test_f'
        // },
        // {
        //   createdDate: '2020-03-13T03:49:08Z',
        //   recordTime: '2020-03-13T11:49:08',
        //   remark: null,
        //   reviewResultD: null,
        //   reviewStep: 'PRODUCE',
        //   reviewStepD: '申请-新增',
        //   reviewTypeD: '新增',
        //   reviewUserId: 87,
        //   reviewUserName: 'test_f'
        // }
      ],
      showPicture: false,
      imgArr: [],
      num: 0,
      tab: 1,
      drawerTitle: '审核优惠券'
    }
  },
  mounted () {

  },
  methods: {
    getrecords () {
      context.http.get(`crm/api/review/records`, { businessId: this.detailData.id, businessType: 'COUPON' }).then(res => {
        if (res) {
          this.recordsList = res.data
        }
      })
    },
    statusForMatter (status) {
      for (var i = 0; i < this.statusList.length; i++) {
        if (status === this.statusList[i].value) {
          return this.statusList[i].name
        }
      }
    },
    memberFormat (arr) {
      let name = ''
      if (arr) {
        arr.forEach((item, index) => {
          name += item.name + '、'
        })
      }
      return name.substring(0, name.length - 1)
    },
    timeFormatter (time) {
      if (time) {
        return time.substring(0, 16).replace('T', '  ')
      }
    },
    couponFormatter (type) {
      switch (type) {
        case 'MONEY_OFF':
          return '代金券'
        case 'PERCENTAGE_OFF':
          return '折扣券'
      }
    },
    reject () { // 驳回
      if (this.remark === '' || !this.remark) {
        this.$message.error('请填写审核备注')
        return
      }
      this.rejectDialogVisible = true
    },
    pass () { // 通过
      if (this.remark === '' || !this.remark) {
        this.$message.error('请填写审核备注')
        return
      }
      this.passDialogVisible = true
    },
    rejectFn () {
      context.http.get(`crm/api/review/disapproval`, {
        businessId: this.detailData.id,
        businessType: 'COUPON',
        reviewType: this.detailData.reviewType,
        remark: this.remark,
        reviewStatus: this.detailData.reviewStatus
      }).then(res => {
        if (res) {
          this.rejectDialogVisible = false
          this.$message.success('操作成功')
          this.$emit('auditSuccess')
          this.onHide()
        }
      })
    },
    passFn () {
      context.http.get(`crm/api/review/approval`, {
        businessId: this.detailData.id,
        businessType: 'COUPON',
        reviewType: this.detailData.reviewType,
        remark: this.remark,
        reviewStatus: this.detailData.reviewStatus
      }).then(res => {
        if (res) {
          this.passDialogVisible = false
          this.$message.success('操作成功')
          this.$emit('auditSuccess')
          this.onHide()
        }
      })
    },
    formatApprovalDate (time) {
      if (time) {
        time = time.substr(0, time.lastIndexOf('T'))
        return time
      }
    },
    submit () { // 提交审核
      context.http.get(`crm/api/review/approval`, {
        businessId: this.draweDetaileData.id,
        businessType: 'BRAND',
        reviewType: 'BRAND',
        reviewStatus: this.draweDetaileData.reviewStatus
      }).then(res => {
        if (res) {
          this.$message.success('操作成功')
          this.$emit('changeSuccess')
          this.onHide()
        }
      })
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
    peveBtn () {
      this.tab = this.tab - 1
    },
    nextBtn () {
      this.tab = this.tab + 1
    },
    nodeColor (index) {
      return index === 0 ? '#3575F6' : '#D3DBEB'
    },
    formatreplace (description) {
      if (!description) {
        return
      }
      let html = description.replace(/\n/g, '<br/>')
      return html
    },
    tabChange (n) {
      if (this.detailData.reviewStatus === 'REVIEWING' || this.detailData.reviewStatus === 'APPLY_DISABLE') {
        return
      }
      this.tab = n
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    onHide () {
      this.remark = ''
      this.tab = 1
      this.$emit('drawerClose', false)
    }
  }
}
</script>
<style lang="scss" >
// .couponDetailis {
//   .timelineBox {
//     .el-timeline-item {
//       .el-icon-success {
//         color: rgb(53, 117, 246);
//       }
//     }
//   }
// }
.couponDetailis {
  .rejectDialog {
    .el-dialog__header {
      padding-top: 10px;
    }
    .el-dialog {
      border-radius: 6px;
    }
  }
}
</style>
<style lang="scss" scoped>
.couponDetailis {
  .rejectDialog {
    .el-dialog {
      border-radius: 8px;
    }
    .content {
      > div {
        &:first-child {
          display: flex;
          align-items: center;
          justify-content: center;
          > img {
            width: 64px;
            height: 64px;
          }
          > div {
            display: flex;
            flex-direction: column;
            margin-left: 25px;
            height: 64px;
            justify-content: space-around;
            > span {
              &:first-child {
                font-size: 18px;
                color: #666666;
              }
              &:last-child {
                font-size: 14px;
                color: #999999;
              }
            }
          }
        }
        &:last-child {
        }
      }
      .footer {
        display: flex;
        margin-top: 20px;
        justify-content: center;
        > span {
          display: inline-block;
          width: 110px;
          height: 34px;
          line-height: 34px;
          color: #ffffff;
          text-align: center;
          cursor: pointer;
          &:first-child {
            background: rgba(177, 182, 196, 1);
            border-radius: 4px;
            margin-right: 25px;
          }
          &:last-child {
            background: linear-gradient(
              90deg,
              rgba(53, 119, 246, 1),
              rgba(108, 153, 255, 1)
            );
            border-radius: 2px;
          }
        }
      }
    }
  }
  .details_content {
    width: 850px;
    padding: 0 20px;
    .tab {
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      box-shadow: 0px 2px 3px 0px rgba(190, 199, 208, 0.2);
      > span {
        color: #666666;
        display: inline-block;
        padding: 0 10px;
        height: 49px;
        line-height: 49px;
        cursor: pointer;
        &.active {
          color: #3175f6;
          border-bottom: 2px solid #3175f6;
        }
      }
    }
    margin-top: 15px;
    .mainContent {
      padding: 15px 0;
      .content1 {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        > .item {
          width: 33%;
          margin-bottom: 20px;
          > div {
            &:first-child {
              font-size: 14px;
              color: #333333;
              margin-bottom: 10px;
            }
            &:nth-child(2) {
              color: #666666;
              font-size: 12px;
              width: 90%;
            }
          }
          .imgBox {
            width: 140px !important;
            height: 120px;
            position: relative;
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(234, 234, 234, 1);
            border-radius: 4px;
            > .bottomTips {
              height: 25px;
              position: absolute;
              left: 0px;
              bottom: 0px;
              width: 140px;
              background-color: #fdffff;
              display: flex;
              align-items: center;
              font-size: 12px;
              justify-content: space-between;
              padding: 0 5px;
              > span {
                display: inline-block;
                width: 85%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding: 0 5px;
              }
              > i {
                cursor: pointer;
              }
            }
          }
        }
      }
      .content2 {
        .timelineBox {
          width: 100%;
          padding-left: 150px;
          padding-top: 30px;
          height: 500px;
          overflow-y: auto;
          .statusBox {
            position: absolute;
            left: -160px;
            top: 0;
            width: 150px;
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
                // width: 60px;
                height: 20px;
                line-height: 20px;
                padding: 0 5px;
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
                  top: 30px;
                  color: #3575f6;
                }
                top: 30px;
                color: #999999;
              }
            }
          }
          .template {
            position: relative;
            top: -13px;
            left: 0px;
            width: 500px;
            > p {
              margin-bottom: 5px;
              > span:first-child {
                font-size: 14px;
                color: #333333;
              }
              > span:last-child {
                font-size: 12px;
                color: #999999;
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.couponDetailis {
  .drawer {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .wrap {
      height: auto;
    }
  }
  .dialog-footer {
    margin-top: 0px;
    margin-right: 20px;
    text-align: right;
    height: 40px;
    margin-left: 30px;
    padding-top: 15px;
    border-top: 1px solid #e5e5e5;
    box-sizing: content-box;
    margin-bottom: 20px;
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
      &.closeBtn {
      }
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
  .drawer-head {
    border-bottom: 1px solid #eee;
    margin: 20px 20px 0 20px;
  }
}
</style>
