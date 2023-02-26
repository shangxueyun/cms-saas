<template>
  <div class="detailsGroup">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="routerTo()"></i>
      <div class="headTab">
        <span >群组详情</span>
      </div>
      <!-- <div
        v-if="!isEdit"
        @click="isEdit = true"
        class="addBtn">
        编辑
      </div> -->
      <div
        class="addBtn">
      </div>
    </div>
    <!--  -->
    <div class="content">
      <div class="basic-information">
        <div class="ul-warp">
          <!-- 所以dom渲染按tableType类型区分显示不同的字段不同的name效果减少文件淤积 -->
          <div class="content-ul project">
            <span>项目 <i class="required">*</i></span>
            <span>
              {{ AddDetail.projectManagementName }}
            </span>
            <!-- <span v-if="isEdit" @click="popupShow = true">{{ AddDetail.projectManagementName ? AddDetail.projectManagementName : '请选择' }} <i class="iconfont iconright"></i></span> -->
             <!-- 修改值为空时候 -->
          </div>
          <div class="content-ul">
            <span>群组名称 <i class="required">*</i></span>
            <span v-if="!isEdit">
              {{ AddDetail.name }}
            </span>
            <input v-if="isEdit" v-model="AddDetail.name"
                                type="text"
                                placeholder="请输入"
                                style="text-align: right"
                                input-align="right" />
          </div>
          <div class="content-ul" v-if="isEdit" style="border: none">
            <span>群组说明</span>
            <span class="Working-plan">
              <van-field
              v-model="AddDetail.remark"
              rows="3"
              autosize
              label=""
              type="textarea"
              maxlength="50"
              placeholder="您可输入此群组的备注信息"
              show-word-limit
            /></span>
          </div>
          <div class="content-ul" v-if="!isEdit" style="border: none">
            <span>群组说明</span>
            <span class="Working-plan">
              {{ AddDetail.remark }}
            </span>
          </div>
        </div>
      </div>
      <div class="basic-information" style="margin: 0;">
        <div class="ul-warp">
          <!-- 所以dom渲染按tableType类型区分显示不同的字段不同的name效果减少文件淤积 -->
          <div class="content-ul project" v-if="isEdit || AddDetail.lightingPlan.name">
            <span>照明计划</span>
            <span v-if="!isEdit">
              {{  AddDetail.lightingPlan.name }}
            </span>
            <span v-if="isEdit" @click="planPopupShow = true">{{  AddDetail.lightingPlan.name ? AddDetail.lightingPlan.name : '请选择' }} <i class="iconfont iconright"></i></span>
             <!-- 修改值为空时候 -->
          </div>
          <div class="content-ul" v-if="AddDetail.lightingPlan.name">
            <span>计划说明</span>
            <span class="scroll Working-plan" style="display: block;overflow: scroll;">
              <template v-for="(item, index) in AddDetail.lightingPlan.remarkD">
                <span :key="index" style="display: block;width: max-content;">
                  {{ item.Date }}&nbsp;&nbsp;{{ item.times }}
                </span>
              </template>
            </span>
          </div>
          <div class="content-ul" style="justify-content: left;">
            <span class="loop">回路</span>
            <span class="sapn">（每个回路仅可属于一个群组）</span>
            <span v-if="isEdit" @click="loopPlan = true;projectId = AddDetail.projectManagementId" class="right"><i class="iconfont icontianjia"></i>添加</span>
          </div>
        </div>
      </div>
      <div class="basic-information">
        <div class="ul-warp border" v-for="(item, index) in transferData" :key="index">
          <div class="content-ul noneFlex">
            <div class="left">
              <img :src="item.imgurls ? checkItem(item.imgurls[0]) : defaultImg" alt="">
            </div>
            <div class="content_noneFlex" style="display: block">
              <p>{{ item.name }}</p>
              <p>{{ item.lightingGatewayName }}-{{ item.interfaces }}</p>
            </div>
            <div class="right">
              <i v-if="isEdit" @click="transferData.splice(index, 1)" class="iconfont iconcms_shanchu-233 font"></i>
            </div>
          </div>
          <div style="clear: both"></div>
        </div>
        <div class="noData"
            v-if="transferData.length===0">
          <img :src="NOdata">
          <p>暂无数据</p>
        </div>
      </div>
    </div>

    <!-- 底部 -->
    <div class="footer" >
      <div class="operation-btn reject-btn"
          v-if="hasAuthority('03080115')"
           @click="Delete">删除</div>
      <div class="operation-btn"
          v-if="hasAuthority('03080113')"
           @click="submit">保存</div>
    </div>

    <!-- 项目下拉选择 -->
    <van-popup v-model="popupShow"
               position="bottom">
      <van-picker show-toolbar
                  ref="picker"
                  title="请选择"
                  value-key='referred'
                  @confirm="confirmFn"
                  @cancel='popupShow=false'
                  :columns="ProjectOptions" />
    </van-popup>
    <!-- 照明计划下拉选择 -->
    <van-popup v-model="planPopupShow"
               position="bottom">
      <van-picker show-toolbar
                  ref="picker"
                  title="请选择"
                  value-key='name'
                  @confirm="planConfirmFn"
                  @cancel='planPopupShow=false'
                  :columns="planOptions" />
    </van-popup>

    <van-popup duration="0.3" :lock-scroll="false" v-model="loopPlan"
      class="stylePopup"
      position="bottom">
      <screenPull
        v-if="loopPlan"
        title="选择回路"
        data-type="loop"
        :project-id="projectId"
        :transfer-data="transferData"
        @confirm="screenPullConfirm"
        @cancel="screenPullCancel" />
    </van-popup>
  </div>
</template>
<script>
import context from '@/service'
import Vue from 'vue'
import common from '@/utils/common.js'
import moment from 'moment-timezone'
import { MessageBox } from 'mint-ui'
import screenPull from '../../../components/screenPull.vue'
import { Dialog, Toast } from 'vant'

Vue.use(Dialog)
export default {
  name: 'detailsGroup',
  components: { screenPull },
  data () {
    return {
      RecordDetail: {},
      NOdata: require('@/assets/nores.png'),
      defaultImg: require('@/assets/berth-default1.png'),
      EditDetail: {},
      AddDetail: {
        // 项目部分
        projectManagementId: '',
        projectManagementName: '',
        // 计划部分
        lightingPlan: {
          id: '',
          name: '',
          remark: ''
        },
        // 群组部分
        name: '',
        remark: '',
        // 回路部分
        lightingLoops: []
      },
      isEdit: true,
      transferData: [],
      popupShow: false,
      loopPlan: false,
      planPopupShow: false,
      ProjectOptions: [],
      planOptions: [],
      currentPage: 0,
      tableTab: 1,
      tableType: '',
      projectId: '',
      returnObj: false
    }
  },
  created () {
    if (!this.hasAuthority('03080113')) {
      this.isEdit = false
    }
    this.getContractDetails(this.$route.params.DetailsId)
  },
  // 离开
  beforeRouteLeave (to, from, next) {
    if (to.name === 'illuminatingSystem') {
      // 默认数据
      to.params.filter = this.$route.params.filter
      to.params.config = this.$route.params.config
    }

    next()
  },
  mounted () {
    this.$parent.$refs['content'].scrollTop = 0
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    getformat (annexName) {
      return common.getformat(annexName)
    },
    routerTo () {
      this.$router.push({ name: 'illuminatingSystem' })
    },
    checkItem (item) {
      const imageRatio = common.imageRatio(375)
      let paramTxt = `?x-oss-process=image/resize,w_${imageRatio.width},m_fixed` // 图片链接参数  防止安卓手机图片旋转
      return item + paramTxt
    },
    async getContractDetails (id) {
      let result = await context.http.get(`rms/api/lightingGroup/${id}/`)

      this.ProjectOptions = this.$route.params.config.projectManagementList
      if (result.status === 200) {
        this.ProjectOptions.forEach(element => {
          if (element.id === result.data.projectManagementId) {
            result.data.projectManagementName = element.referred
          }
        })
        this.AddDetail = Object.assign(this.AddDetail, result.data)
        if (!this.AddDetail.lightingPlan) {
          this.AddDetail.lightingPlan = {
            id: '',
            name: '',
            remarkD: ''
          }
        } else {
          this.planConfirmFn(this.AddDetail.lightingPlan)
        }
        this.transferData = result.data.lightingLoops
        this.getLightingPlan(this.AddDetail.projectManagementId)
      }
    },
    // 获取照明计划
    async getLightingPlan (id) {
      let result = await context.http.get(`rms/api/lightingPlan/all?projectManagementId=${id}`)
      this.planOptions = result.data
    },
    screenPullConfirm (row) {
      // 选择后数据保存
      this.transferData = row
      this.loopPlan = false
    },
    screenPullCancel () {
      this.loopPlan = false
    },
    confirmFn (row) {
      this.AddDetail.projectManagementId = row.id
      this.AddDetail.projectManagementName = row.referred
      this.popupShow = false
    },
    planConfirmFn (item) {
      // 时间格式 Date [{ Date: '01-01 - 02-02', times: '18:00至18:30,18:00至18:30' }]
      // dates
      let DateArr = []
      let dates = item.dates
      dates.forEach((v, i) => {
        DateArr[i] = {
          Date: `${v.startDate} - ${v.endDate}`,
          times: ''
        }
        v.times.forEach((t, key) => {
          if (key !== v.times.length - 1) {
            DateArr[i].times += `${t.startTime}至${t.endTime},`
          } else {
            DateArr[i].times += `${t.startTime}至${t.endTime}`
          }
        })
      })
      let { id, name } = item
      this.AddDetail.lightingPlan = {
        id,
        name,
        remarkD: DateArr
      }
      this.planPopupShow = false
    },
    Delete () {
      MessageBox.confirm('', {
        message: '您确认要删除该群组吗？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonClass: 'confirmButton',
        cancelButtonClass: 'cancelButton'
      }).then(action => {
        // on confirm
        context.http.delete(`rms/api/lightingGroup/${this.AddDetail.id}`).then(res => {
          if (res.status === 200) {
            this.returnObj = true
            Toast({
              message: '删除成功',
              position: 'top'
            })
            this.routerTo()
          }
        })
      }).catch(() => {
        // on cancel
      })
    },
    submit () {
      // AddDetail: {
      //   // 项目部分
      //   projectManagementId: '',
      //   projectManagementName: '',
      //   // 计划部分
      //   LightingPlan: {
      //     id: '',
      //     name: '',
      //     remarkD: ''
      //   },
      //   // 群组部分
      //   name: '',
      //   remark: '',
      //   // 回路部分
      //   lightingLoops: []
      // },
      if (this.AddDetail.name === '') {
        Toast({
          message: '请填写"群组名称"',
          position: 'top'
        })
        return
      }

      this.AddDetail.lightingLoops = this.transferData
      context.http.put('rms/api/lightingGroup', this.AddDetail).then(res => {
        if (res.status === 200) {
          // 成功进行清空
          this.returnObj = true
          this.transferData = []
          Toast({
            message: '保存成功',
            position: 'top'
          })
          this.routerTo()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../../../style/config";
.detailsGroup {
  .noData_text {
    height: rem(80);
    line-height: rem(80);
    text-align: center;
    color: #878a9a;
  }
  .head {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: rem(40);
    line-height: rem(40);
    overflow: hidden;
    text-align: center;
    font-size: rem(16);
    background: #fff;
    display: flex;
    justify-content: space-between;
    z-index: 9;
    box-shadow: 0px 1px 4px 0px rgba(230, 230, 230, 0.5);
    .headTab {
      color: #444547;
      font-size: rem(16);
      width: rem(200);
      display: flex;
      justify-content: center;
      > span {
        position: relative;
        &.active {
          color: #0139a4;
          border-bottom: rem(3) solid #0139a4;
          font-weight: bold;
        }
        &:nth-child(2) {
          margin-left: rem(40);
        }
      }
    }
    .back {
      width: rem(40);
      height: rem(40);
      font-size: rem(18);
      color: #000000;
      &:first-child {
        float: left;
      }
    }
    .addBtn {
      width: rem(60);
      height: rem(40);
      position: relative;
      color: #0139a4;
      font-size: rem(15);
      margin-right: rem(0);
    }
    .selected {
      color: #0139a4;
    }
  }
  .content {
    width: 100%;
    position: relative;
    top: rem(44);
    padding-bottom: rem(60);
  }
  .basic-information {
    margin-bottom: rem(10);
    background: #fff;
    position: relative;
  }
  .content-title {
    color: #18191a;
    font-size: rem(17);
    height: rem(40);
    line-height: rem(40);
    font-weight: bold;
    padding-left: rem(14);
    border-bottom: rem(1) solid #f0f0f0;
  }
  .van-field__label{
    font-size: rem(15);
    color: #858c94;
  }
  .ul-warp {
    border-bottom: rem(1) solid #f0f0f0;
    &:last-child {
      border: none;
    }
    .annex{
      font-size: rem(15);
      color: #858C94;
      .sapn{
        font-size: rem(13);
      }
      .right{
        position: absolute;
        color: #0139A4;
        right: rem(10);
      }
      .icontianjia{
        margin-right: rem(5);
      }
    }
  }
  .tableList{
    position: relative;
    padding-top: rem(8);
    background: #FFFFFF;
    .flex{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .shopNb{
        font-size: rem(15);
        color: #444547;
        font-weight: bolder;
        padding-bottom: rem(10);
      }
      .tab{
        font-size: rem(14);
        color: #858C94;
      }
    }
    .iconright{
      position: absolute;
      right: rem(16);
      top: 50%;
      background: linear-gradient(90deg, #C6C6C6 0%, #C6C6C6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .border{
    clear: both;
  }
  .content-ul {
    display: flex;
    justify-content: space-between;
    font-size: rem(15);
    position: relative;
    min-height: rem(44);
    line-height: rem(44);
    padding: 0 rem(14);
    border-bottom: rem(1) solid #F0F0F0;
    > span {
      color: #18191a;
      &:first-child {
        color: #18191A;
        min-width: rem(64);
        margin-right: rem(10);
        word-wrap: break-word;
      }
    }
    .right{
      position: absolute;
      color: #0139A4;
      right: rem(10);
    }
    .icontianjia{
      margin-right: rem(4);
    }
    .Working-plan{
      min-height: rem(44);
      width: 78%;
      margin-top: rem(28);
      color: #858C94;
      font-size: rem(15);
      line-height: rem(26);
    }
    .scroll{
      min-height: rem(44);
    }
    .open{
      margin-top: 0;
      width: 82%;
      line-height: rem(26);
      display: flex;
      flex-wrap: wrap;
      p{
        line-height: rem(22);
        width: 46%;
        display: flex;
        justify-content: space-between;
        height: rem(22);
        margin: rem(8) 0;
        padding: 0 rem(6);
        background: #DAEAFF;
        border-radius: rem(2);
        float: left;
        margin-right: 10px;
        span{
          color: #444547;
          font-size: rem(13);
        }
        i{
          color: #757B82;
        }
      }
    }
    .flag{
      position: relative;
      margin-left: rem(12);
      i{
        position: absolute;
        top: 43%;
        display: block;
        width: rem(8);
        height: rem(8);
        background: transparent;
        left: rem(-12);
        border-radius: rem(10);
        border: rem(2) solid #0139A4;
      }
    }
    input {
      text-align: right;
    }
    .dingwe{
      color: #858C94;
      font-size: rem(12);
      height: rem(18);
      line-height: rem(18);
      position: absolute;
      top: rem(48);
      right: rem(16);
      max-width: 48%;
      text-align: justify;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .sapn{
      font-size: rem(13);
      color: #858C94;
    }
    .iconfont{
      font-size: rem(15);
    }
    .loop{
      font-size: rem(15);
      min-width: 32px !important;
      margin: 0 !important;
    }
  }
  .height{
    height: rem(86);
  }
  .noneFlex{
    display: flex;
    min-height: auto;
    line-height: inherit;
    padding: rem(14);
    border-bottom: none;
    .left{
      display: block;
      float: left;
      width: 70px;
      margin-right: 6px;
      img{
        width: rem(70);
        height: rem(56);
        border-radius: rem(6);
      }
    }
    .content_noneFlex{
      display: block;
      float: left;
      width: 78%;
      p:first-child{
        font-size: rem(15);
        color: #18191A;
        font-weight: bolder;
        padding-bottom: rem(10);
      }
      p:last-child{
        font-size: 14px;
        color: #858C94;
      }
    }
    .right{
      display: block;
      width: 12%;
      text-align: center;
      line-height: rem(62);
    }
  }
  .content-div {
    padding-top: rem(16) !important;
    font-size: rem(15);
    position: relative;
    > span {
      color: #858c94;
    }
    > div {
      padding-top: rem(10);
      color: #18191a;
    }
    .add-pic {
      position: absolute;
      right: rem(14);
      color: #023c8f;
      i {
        margin-right: rem(2);
      }
    }
    &.long-div {
      input {
        width: 100%;
      }
    }
  }
  .border-top {
    border-top: rem(1) solid #f0f0f0;
    margin-top: rem(12);
  }
  .list {
    padding-left: rem(14);
    li {
      padding: rem(16) rem(14) rem(16) 0;
      position: relative;
      background: #fff;
      border-bottom: rem(1) solid #f0f0f0;
      &:last-child {
        border: 0;
      }
      > p {
        display: flex;
        width: 100%;
        justify-content: space-between;
        margin-bottom: rem(6);
        > span {
          display: block;
          line-height: rem(20);
          color: #858c94;
          font-size: rem(15);
          width: rem(90);
          text-align: right;
        }
        > span:first-child {
          text-align: left;
          flex: 1;
          color: #18191a;
          font-weight: 600;
          font-size: rem(15);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: rem(5);
          > span {
            background: #eff6ff;
            height: rem(17);
            font-weight: 500;
            line-height: rem(17);
            font-size: rem(12);
            color: #0139a4;
            padding: 0 rem(3);
            vertical-align: center;
            margin-left: rem(12);
          }
        }
      }
      > div {
        > p {
          color: #444547;
          font-size: rem(14);
          margin-bottom: rem(8);
          &:last-child {
            margin-bottom: 0;
          }
          span {
            color: #858c94;
          }
        }
        > .momoInfo {
          font-size: rem(15);
          color: #18191a;
        }
        > .momoDate {
          font-size: rem(13);
          color: #858c94;
          text-align: right;
        }
      }
      > span {
        position: absolute;
        right: rem(10);
        top: rem(45);
        font-size: rem(17);
        color: #c6c6c6;
      }
    }
  }
  .contractLoadAll {
    > p {
      // width:rem(80);
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    background: rgba(255, 255, 255, 0.6);
    height: rem(70);
    font-size: rem(17);
    div {
      &:first-child {
        width: rem(160);
        height: rem(50);
        line-height: rem(50);
        text-align: center;
        background: #F3F7FF;
        border-radius: rem(4);
        color: #0139A4;
      }
      &:last-child {
        width: rem(160);
        height: rem(50);
        line-height: rem(50);
        text-align: center;
        background: rgba(1, 57, 164, 1);
        border-radius: rem(4);
        color: #ffffff;
      }
    }
  }
}
</style>
<style lang="scss">
@import "../../../../../../style/config";
  .detailsGroup .van-field__label{
    font-size: rem(15);
    color: #858c94;
  }
  .detailsGroup .van-cell{
    padding: 0
  }
  .detailsGroup .noData {
    position: relative;
  }
  .detailsGroup .stylePopup{
    min-height: 100%;
  }
</style>
