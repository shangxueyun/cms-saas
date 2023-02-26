<template>
  <div class="maintainDetails">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="$router.go(-1)"></i>
      <div class="headTab">
        <span>{{repairDetailsData.name}}</span>
      </div>
      <div class="addBtn"
           @click="isEdit = true">
        <span v-if="repairDetailsData.repairStatus === 'NO' && !isEdit && hasAuthority('03050114')">编辑</span>
      </div>
    </div>
    <div class="content">
      <div class="basic-information">
        <div class="content-title">基本信息</div>
        <div class="ul-warp">
          <div class="content-ul">
            <span>维保编号</span>
            <span>
              {{repairDetailsData.repairRecordCode}}
            </span>
          </div>
          <div class="content-ul">
            <span>维保类型</span>
            <span>
              {{repairDetailsData.repairType==='ROOMS'?'房源':repairDetailsData.repairType==='EQUIREMENT'?'设备':'其他'}}
            </span>
          </div>
          <div class="content-ul">
            <span>维保方式</span>
            <span>
              保养
            </span>
          </div>
          <div class="content-ul">
            <span>设备编号</span>
            <span>{{repairDetailsData.equirementNo}}</span>
          </div>
          <div class="content-ul">
            <span>项目简称</span>
            <span>{{repairDetailsData.projectName}}</span>
          </div>
          <div class="content-ul">
            <span>楼宇名称</span>
            <span>{{repairDetailsData.buildingName}}</span>
          </div>
          <div class="content-ul">
            <span>设备名称</span>
            <span>
              {{repairDetailsData.name}}
            </span>
          </div>
          <div class="content-ul">
            <span>安装位置</span>
            <span>{{repairDetailsData.installPosition}}</span>
          </div>
          <div class="content-ul">
            <span>计划维保日期</span>
            <span>
              {{repairDetailsData.planMaintenanceTime}}
            </span>
          </div>
          <div class="content-ul">
            <span>维保人员<i class="required"
                 v-if="isEdit">*</i></span>
            <span v-if="!isEdit">{{repairDetailsData.repairUserName}}</span>
            <span v-else>
              <input placeholder="请输入"
                     v-model="repairDetailsData.repairUserName" />
            </span>
          </div>
          <div class="content-ul">
            <span>维保日期<i class="required"
                 v-if="isEdit">*</i></span>
            <span v-if="!isEdit">
              {{repairDetailsData.repairDate}}
            </span>
            <span v-else
                  @click="showStartPickerFn('repairDate')">
              {{repairDetailsData.repairDate}}
            </span>
          </div>
          <div class="content-ul">
            <span>维保费用<i class="required"
                 v-if="isEdit">*</i></span>
            <span v-if="!isEdit">{{repairDetailsData.repairFee}}</span>
            <span v-else>
              <input placeholder="请输入"
                     v-model="repairDetailsData.repairFee" />
            </span>
          </div>
          <div class="content-ul">
            <span>维保结果</span>
            <span>
              {{formatRepairStatus(repairDetailsData.repairStatus)}}
            </span>
          </div>
          <div class="content-div long-div">
            <span>维保原因</span>
            <div v-if="!isEdit">{{repairDetailsData.description}}</div>
            <div v-else>
              <input placeholder="请输入"
                     maxlength="40"
                     v-model="repairDetailsData.description" />
            </div>
          </div>
          <div class="content-div long-div">
            <span>用材情况</span>
            <div v-if="!isEdit">
              {{repairDetailsData.materialUsage}}
            </div>
            <div v-else>
              <input placeholder="请输入"
                     maxlength="40"
                     v-model="repairDetailsData.materialUsage" />
            </div>
          </div>
          <div class="content-div long-div">
            <span>备注</span>
            <div v-if="!isEdit">{{repairDetailsData.remake}}</div>
            <div v-else>
              <input placeholder="请输入"
                     maxlength="40"
                     v-model="repairDetailsData.remake" />
            </div>
          </div>
          <div class="content-div border-top">
            <span>发票及维保后图片</span>
            <span class="add-pic"
                  v-if="isEdit && showimageUrls">
              <i class="iconfont iconcms_fujiantianjia"></i>添加图片
              <aliUpload class="aliUpload"
                         :fileType="fileType"
                         :encrypt="false"
                         @setAnnex="setAnnex" />
            </span>
            <div v-if="repairDetailsData.imageUrls && repairDetailsData.imageUrls.length"
                 class="an">
              <div class="an-item"
                   v-for="(item, index) in repairDetailsData.imageUrls"
                   :key="index">
                <div class="image">
                  <svg class="icon"
                       aria-hidden="true">
                    <use :xlink:href="getformat('.jpg')"></use>
                  </svg>
                </div>
                <!-- <div class="annex-name">{{getImgName(item)}}</div> -->
                <div class="annex-name">Image0{{index+1}}</div>
                <div class="operating">
                  <ailPreview :ailObj="item"
                              :encrypt="true"
                              class="ailPreview" />
                </div>
                <span @click="delEnclosure(index)"
                      v-if="isEdit"
                      class="delcl"><i class="iconfont iconcms_shanchu-233"></i></span>
              </div>
            </div>
            <div v-else
                 class="noData_text">暂无数据</div>
          </div>
        </div>
      </div>
      <div class="basic-information">
        <div class="content-title">维保计划</div>
        <div class="ul-warp">
          <div class="content-ul">
            <span>下次维保日期</span>
            <span v-if="!isEdit">{{repairDetailsData.nextMaintenanceTime}}</span>
            <span v-else
                  @click="showStartPickerFn('nextMaintenanceTime')">
              {{repairDetailsData.nextMaintenanceTime}}
              <span style="color: #858c94"
                    v-if="!repairDetailsData.nextMaintenanceTime">请选择</span>
              <i style="color: #858c94"
                 class="iconfont iconright"></i>
            </span>
          </div>
        </div>
      </div>
      <div class="loadAll contractLoadAll">
        <span>-</span>
        <p>已经到底了</p>
        <span>-</span>
      </div>
    </div>

    <!-- 底部 -->
    <div class="footer"
         v-if="isEdit">
      <div @click="openTrue()">维保完成</div>
      <div @click="addRepairSave('repairDetailsData')">提交</div>
    </div>

    <!-- 维保日期 -->
    <van-popup v-model="showStartPicker"
               position="bottom"
               :style="{ height: '50%' }">
      <van-datetime-picker v-model="currentDateStart"
                           type="date"
                           title="选择时间"
                           @confirm="onDateStart"
                           @cancel="showStartPicker = false" />
    </van-popup>
  </div>
</template>
<script>
import context from '@/service'
import ailPreview from '@/components/ailPreview.vue'
import common from '@/utils/common.js'
import aliUpload from '@/components/aliUpload.vue'
import moment from 'moment-timezone'
import { MessageBox } from 'mint-ui'
export default {
  name: 'maintainDetails',
  components: { ailPreview, aliUpload },
  data () {
    return {
      contractId: '',
      repairDetailsData: {},
      address: '',
      detailDataRemarks: {},
      isEdit: false,
      showStartPicker: false,
      fileType: ['jpg', 'png'],
      currentDateStart: new Date(),
      showimageUrls: false
    }
  },
  created () {
    this.contractId = this.$route.query.id
    this.getContractDetails()
  },
  mounted () {
    this.$parent.$refs['content'].scrollTop = 0
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    showStartPickerFn (type) {
      if (type === 'repairDate') {
        if (!this.repairDetailsData.repairDate) {
          this.currentDateStart = new Date()
        } else {
          this.currentDateStart = new Date(this.repairDetailsData.repairDate)
        }
      } else {
        if (!this.repairDetailsData.nextMaintenanceTime) {
          this.currentDateStart = new Date()
        } else {
          this.currentDateStart = new Date(this.repairDetailsData.nextMaintenanceTime)
        }
      }
      this.Picker = type
      this.showStartPicker = true
    },
    onDateStart (date) {
      if (this.Picker === 'repairDate') {
        this.repairDetailsData.repairDate = moment(date).format('YYYY-MM-DD')
      } else {
        this.repairDetailsData.nextMaintenanceTime = moment(date).format('YYYY-MM-DD')
      }
      this.showStartPicker = false
    },
    async getContractDetails () {
      let res = await context.http.get('cms/api/repair-records/' + this.contractId)
      this.repairDetailsData = res.data
      this.showimageUrlsFn()
    },
    showimageUrlsFn () {
      let showimageUrls = false
      if (!this.repairDetailsData.imageUrls) {
        showimageUrls = true
      } else if (this.repairDetailsData.imageUrls.length < 5) {
        showimageUrls = true
      }
      this.showimageUrls = showimageUrls
    },
    async getAddrByCode (code) {
      let result = await context.http.get(`ywm/api/district-codes/${code}`)
      return result.data.address
    },
    getformat (annexName) {
      return common.getformat(annexName)
    },
    getImgName (item) {
      let index = item.lastIndexOf('/')
      let name = item.substring(index + 1)
      return name
    },
    formatRepairStatus (n) {
      if (n === 'COMPLETE') {
        return '维保完成'
      } else if (n === 'NO') {
        return '维保未完成'
      }
    },
    setAnnex (annexURL, annexName) {
      if (!this.repairDetailsData.imageUrls) {
        this.repairDetailsData.imageUrls = []
      }
      this.repairDetailsData.imageUrls.push(annexURL)
      this.showimageUrlsFn()
    },
    delEnclosure (index) {
      let _this = this
      MessageBox.confirm('', {
        message: '确定删除照片吗？',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        confirmButtonClass: 'confirmButton',
        cancelButtonClass: 'cancelButton'
      }).then(action => {
        if (action === 'confirm') {
          _this.repairDetailsData.imageUrls.splice(index, 1)
          _this.showimageUrlsFn()
        }
      }).catch(e => {
        console.log(e)
      })
    },
    openTrue () {
      let _this = this
      MessageBox.confirm('', {
        message: '确定维保完成吗？',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        confirmButtonClass: 'confirmButton',
        cancelButtonClass: 'cancelButton'
      }).then(action => {
        if (action === 'confirm') {
          _this.addRepairSave('repairDetailsData', 'repair')
        }
      }).catch(e => {
        console.log(e)
      })
    },
    addRepairSave (formName, state) { // 修改维保记录
      if (!this.repairDetailsData.repairUserName) {
        this.$toast('请输入维保人员')
        return
      }
      if (!this.repairDetailsData.repairDate) {
        this.$toast('请选择维保日期')
        return
      }
      if (!this.repairDetailsData.repairFee) {
        this.$toast('请输入维保费用')
        return
      }
      if (state === 'repair') {
        this.$set(this.repairDetailsData, 'repairStatus', 'COMPLETE')
      }
      context.http.put('cms/api/repair-records', this.repairDetailsData).then(res => {
        if (res.status === 201) {
          this.$toast({
            type: 'success',
            message: '修改保养记录成功'
          })
          this.isEdit = false
          this.$router.go(-1)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
.maintainDetails {
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
      width: rem(40);
      height: rem(40);
      position: relative;
      color: #0139a4;
      font-size: rem(15);
      margin-right: rem(14);
    }
    .selected {
      color: #0139a4;
    }
  }
  .content {
    width: 100%;
    position: relative;
    top: rem(40);
  }
  .basic-information {
    margin-bottom: rem(10);
    background: #fff;
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
  .ul-warp {
    margin: 0 0 0 rem(14);
    border-bottom: rem(1) solid #f0f0f0;
    padding-bottom: rem(16);
    &:last-child {
      border: none;
    }
  }
  .content-ul {
    display: flex;
    justify-content: space-between;
    padding-top: rem(16) !important;
    padding-right: rem(14);
    font-size: rem(15);
    > span {
      color: #18191a;
      &:first-child {
        color: #858c94;
        min-width: rem(64);
        margin-right: rem(10);
      }
    }
    input {
      text-align: right;
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
  .an-item {
    display: flex;
    align-items: center;
    padding: rem(14) rem(14) 0 0;
    &:nth-of-type(2) {
      margin-top: 0;
    }
    .image {
      margin-right: rem(10);
    }
    .annex-name {
      width: 80%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      margin-bottom: rem(4);
    }
    .operating {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      margin-right: rem(10);
    }
  }
  .contractLoadAll {
    background: #fff;
    padding-top: rem(20);
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
    /* justify-content: space-evenly; */
    justify-content: space-around;
    background: rgba(255, 255, 255, 0.6);
    height: rem(70);
    &:before,
    &:after {
      content: "";
      display: block;
    }
    div {
      &:first-child {
        width: rem(110);
        height: rem(50);
        line-height: rem(50);
        text-align: center;
        background: rgba(242, 242, 242, 1);
        border-radius: rem(4);
        color: #0139a4;
      }
      &:last-child {
        width: rem(220);
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
