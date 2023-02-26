<template>
  <div class="maintainDetails">
    <div class="head">
      <i class="back mintui mintui-back" @click="goBack()"></i>
      <div class="headTab">
        <span class="">{{ listType }}</span>
      </div>
      <div class="addBtn" @click="addSubmit">提交</div>
    </div>
    <!--  -->
    <div class="content">
      <div class="basic-information">
        <div class="content-title">基本信息</div>
        <div class="ul-warp">
          <div class="content-ul">
            <span>项目简称</span>
            <span>
              {{
                isShow
                  ? recordData.projectManagementName
                  : recordData.projectName
              }}
            </span>
          </div>
          <div class="content-ul" v-if="isShow">
            <span>巡更巡检表名称</span>
            <span>
              {{ recordData.name }}
            </span>
          </div>
          <div class="content-ul" v-if="isShow">
            <span>责任人<i class="required">*</i></span>
            <span>
              <input
                v-model.trim="addData.person"
                maxlength="10"
                type="text"
                placeholder="请输入"
              />
            </span>
          </div>
          <div class="content-ul" v-if="isShow">
            <span>实际完成时间<i class="required">*</i></span>
            <span v-if="addData.completeTime1" @click="showDatetime = true"
              >{{ addData.completeTime1 }}<i class="iconfont iconright"></i
            ></span>
            <span v-else @click="showDatetime = true" class="content_span">
              请选择 <i class="iconfont iconright"></i>
            </span>
          </div>

          <div class="content-ul" v-if="!isShow">
            <span>消防器材检测表</span>
            <span>
              {{ recordData.name }}
            </span>
          </div>
          <div class="content-ul" v-if="!isShow">
            <span>报告名称<i class="required">*</i></span>
            <span>
              <input
                type="text"
                placeholder="请输入"
                maxlength="20"
                v-model.trim="addDate.reportName"
              />
            </span>
          </div>
          <div class="content-ul" v-if="!isShow">
            <span>检测类型<i class="required">*</i></span>
            <span v-if="addDate.checkType" @click="showCheckType = true"
              >{{ fliteCheckType(addDate.checkType)
              }}<i class="iconfont iconright"></i
            ></span>
            <span v-else @click="showCheckType = true" class="content_span">
              请选择 <i class="iconfont iconright"></i>
            </span>
          </div>
          <div class="content-ul" v-if="!isShow">
            <span>检测时间<i class="required">*</i></span>
            <span v-if="addDate.checkDate" @click="showDatetime = true"
              >{{ addDate.checkDate }}<i class="iconfont iconright"></i
            ></span>
            <span class="content_span" v-else @click="showDatetime = true">
              请选择 <i class="iconfont iconright"></i>
            </span>
          </div>
          <div class="content-ul" v-if="!isShow">
            <span>负责人<i class="required">*</i></span>
            <span>
              <input
                v-model.trim="addDate.principal"
                type="text"
                maxlength="10"
                placeholder="请输入"
              />
            </span>
          </div>
          <div
            class="content-ul"
            v-if="!isShow && addDate.checkType === 'CONNECTION'"
          >
            <span>维保单位</span>
            <span>
              <input
                v-model.trim="addDate.checkDept"
                type="text"
                maxlength="20"
                placeholder="请输入"
              />
            </span>
          </div>
          <!-- 附件 -->
          <div class="annex common">
            <div class="an-title">
              <span>附件<span class="an-title-look">(点击可预览)</span></span>
              <span
                v-show="
                  isShow
                    ? addData.annexes.length === 0
                    : addDate.annexes.length === 0
                "
              >
                <i class="iconfont iconcms_fujiantianjia"
                  >添加附件
                  <aliUpload
                    class="aliUpload"
                    :encrypt="false"
                    @setAnnex="setAnnex"
                  />
                </i>
              </span>
            </div>
            <div
              class="an-item"
              v-for="(item, index) in isShow
                ? addData.annexes
                : addDate.annexes"
              :key="index"
            >
              <div class="image">
                <svg class="icon" aria-hidden="true">
                  <use :xlink:href="getformat(item.annexName)"></use>
                </svg>
              </div>
              <div class="annex-name">{{ item.annexName }}</div>
              <ailPreview :ailObj="item" class="ailPreview" />
              <span @click="delEnclosure(index)" class="delcl"
                ><i class="iconfont iconcms_shanchu-233"></i
              ></span>
            </div>
          </div>
        </div>
      </div>
      <!-- 设备表 -->
      <div class="basic-information">
        <div class="content-title">{{ infoTitle }}</div>
        <div
          class="ul-warp border"
          v-for="(item, index) in isShow ? recordData.equirements : reportsData"
          :key="item.id"
        >
          <div class="content-ul noneFlex">
            <div class="flex">
              <span
                :class="
                  item.checkStatus == 'NORMAL'
                    ? 'shopNb NORMAL'
                    : 'shopNb Exception'
                "
                >{{ item.name }} ({{ item.code }})</span
              >
            </div>
            <div class="flex">
              <span class="tab"
                >{{ isShow ? "设备大类：" : "设备小类：" }}设备大类：{{
                  item.equirementType.name
                }}</span
              >
            </div>
            <div class="flex">
              <span class="tab">安装位置：{{ item.installPosition }}</span>
              <span class="dingwe" @click="editDialog(item, index)">编辑</span>
            </div>
            <div class="flex">
              <span class="tab">备注：</span>
              <span class="add">{{ isShow ? item.remake : item.remake }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="loadAll">
        <span>-</span>
        <p>已经到底了</p>
        <span>-</span>
      </div>
    </div>
    <!-- 时间选择器 -->
    <van-popup
      v-model="showDatetime"
      position="bottom"
      :style="{ height: '50%' }"
    >
      <van-datetime-picker
        v-if="isShow"
        v-model="currentDate1"
        type="datetime"
        title="选择时间"
        :formatter="formatter1"
        @cancel="showDatetime = false"
        @confirm="confirmSelect"
      />
      <van-datetime-picker
        v-else
        v-model="currentDate1"
        type="date"
        title="选择时间"
        :formatter="formatter1"
        @cancel="showDatetime = false"
        @confirm="confirmSelect"
      />
    </van-popup>
    <!-- 设备编辑弹框 -->
    <van-dialog
      v-model="showDialog"
      title="检查信息"
      show-cancel-button
      className="dialogClass"
      confirmButtonText="确定"
      @confirm="confirmitem"
      @cancel="cancelitem"
    >
      <div class="modal_dialog">
        <div class="mdel_result">
          <div class="mdel_result_text">
            {{ isShow ? "巡更巡检结果：" : "检查结果： " }}
          </div>
          <van-radio-group v-model="radiovalue" direction="horizontal">
            <van-radio name="NORMAL">正常</van-radio>
            <van-radio name="ERROR">异常</van-radio>
          </van-radio-group>
        </div>
        <van-field
          v-model.trim="message"
          rows="4"
          label-class="model_remark"
          label="备注："
          type="textarea"
          placeholder="请输入备注"
          label-width="50"
          maxlength="200"
        />
      </div>
    </van-dialog>
    <!-- 检测类型弹框 -->
    <van-popup
      v-model="showCheckType"
      position="bottom"
      :style="{ height: '50%' }"
    >
      <van-picker
        show-toolbar
        title=""
        value-key="name"
        :columns="monitorTypeList"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
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
import { Toast } from 'vant'
let roterFrom = null
export default {
  name: 'maintainDetails',
  components: { ailPreview, aliUpload },
  data () {
    return {
      infoTitle: '',
      showDatetime: false,
      isShow: null,
      showDialog: false,
      radiovalue: 1,
      accessory: [],
      showCheckType: false,
      monitorTypeList: [{ name: '物业巡检', value: 'PROPERTY' }, { name: '维保单位消防联动检测', value: 'CONNECTION' }, { name: '消防检查', value: 'FIRE' }],
      addData: { // 巡更巡检新增数据
        projectManagementId: null,
        patrolInspection: {
          projectManagementId: '',
          id: '',
          projectManagementName: '',
          name: '',
          equirements: []
        }, // 巡更巡检表对象
        person: '',
        completeTime: '',
        completeTime1: '',
        annexes: [],
        equirementPatrolResults: []
      },
      addDate: { // 消防报告新增数据
        reportName: '',
        checkType: '',
        checkDate: '',
        // checkDate1: '',
        principal: '',
        checkDept: '',
        annexes: [],
        projectId: null,
        fireControlCheckListId: null
      },
      projectId: 61,
      recordDetailsData: {
        patrolInspection: {}
      },
      message: '',
      reportsData: {},
      currentDate1: new Date(),
      dialogDetail: {},
      dialogDetailIndex: null,
      comment: '',
      recordData: {},
      code: false,
      info: {
        detailId: null,
        tableType: '',
        projectId: null,
        edited: false
      }
    }
  },
  created () {
    this.getQuery()
    this.code ? this.handleEdit() : null
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'FilePreview') {
      sessionStorage.setItem('addData', JSON.stringify(this.addData))
      sessionStorage.setItem('addDate', JSON.stringify(this.addDate))
      sessionStorage.setItem('reportsData', JSON.stringify(this.reportsData))
      sessionStorage.setItem('info', JSON.stringify(this.info))
      sessionStorage.setItem('recordData', JSON.stringify(this.recordData))
    }
    next()
  },
  beforeRouteEnter (to, from, next) {
    roterFrom = from.name
    next()
  },
  mounted () {
  },
  methods: {
    addSubmit () {
      this.validate(this.isShow)
    },
    getformat (annexName) {
      return common.getformat(annexName)
    },
    fliteCheckType (e) {
      if (e === 'PROPERTY') {
        return '物业巡检'
      } else if (e === 'CONNECTION') {
        return '维保单位消防联动检测'
      } else if (e === 'FIRE') {
        return '消防检查'
      }
    },
    editDialog (item, index) {
      this.showDialog = true
      this.dialogDetail = item
      this.dialogDetailIndex = index
      this.radiovalue = item.checkStatus
      this.message = item.remake
    },
    delEnclosure (index) {
      MessageBox.confirm('', {
        message: '确定删除附件吗？',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        confirmButtonClass: 'confirmButton',
        cancelButtonClass: 'cancelButton'
      }).then(action => {
        if (action === 'confirm') {
          this.isShow ? this.addData.annexes.splice(index, 1) : this.addDate.annexes.splice(index, 1)
        }
      })
    },
    confirmitem () {
      let val
      if (this.isShow) {
        val = this.recordData.equirements[this.dialogDetailIndex]
      } else if (!this.isShow) {
        val = this.reportsData[this.dialogDetailIndex]
      }
      (((val.remake === null ? '' : val.remake) === this.message) && val.checkStatus === this.radiovalue) ? (this.info.edited = false) : (this.info.edited = true)
      val.remake = this.message
      val.checkStatus = this.radiovalue
    },
    onConfirm (e) {
      this.addDate.checkType = e.value
      this.showCheckType = false
    },
    onCancel () {
      this.showCheckType = false
    },
    cancelitem () {
      this.message = ''
    },
    async submitRecord () {
      this.addData.equirementPatrolResults = this.recordData.equirements.map((item, index) => {
        let param = {}
        param.equirementId = item.id
        param.checkStatus = item.checkStatus
        param.content = item.remake
        param.name = item.name
        param.code = item.code
        param.installPosition = item.installPosition
        param.equipmentType = item.equirementType.parent.name
        return param
      })
      this.addData.patrolInspection.projectManagementId = this.recordData.projectManagementId
      this.addData.patrolInspection.projectManagementName = this.recordData.projectManagementName
      this.addData.patrolInspection.id = this.recordData.id
      this.addData.patrolInspection.name = this.recordData.name
      context.http.post('cms/api/patrolInspectionRecord', this.addData).then(res => {
        if (res.status === 201) {
          this.$toast({
            type: 'success',
            message: '巡更巡检记录新增成功'
          })
          this.routerTo()
        }
      })
    },
    async submitReports () {
      let additionDTOS = []
      this.reportsData.forEach(ele => {
        additionDTOS.push({ checkStatus: ele.checkStatus, comment: ele.remake, id: ele.id })
      })
      this.addDate.additionDTOS = additionDTOS
      context.http.post('cms/api/fcReports', this.addDate).then(res => {
        if (res.status === 201) {
          this.$toast({
            type: 'success',
            message: '消防检测报告新增成功'
          })
          this.routerTo()
        }
      })
    },
    async handleEdit () {
      if (!this.isShow) {
        context.http.get(`cms/api/cmsFireControlCheckList/${this.info.detailId}/`).then(res => {
          if (res.status === 200) {
            // 消防基本信息
            this.recordData = res.data
          }
        })
        context.http.get(`cms/api/cmsFireControlCheckList/equirementsall`, { fireControlCheckListId: this.info.detailId, useStatus: 'USING' }).then(res => {
          if (res.status === 200) {
            // 消防子集
            res.data.forEach(item => {
              item.checkStatus = 'NORMAL'
            })
            this.reportsData = res.data
            this.reportsData.forEach(val => {
              val.remake = ''
            })
          }
        })
      } else {
        context.http.get(`cms/api/patrolInspection/${this.info.detailId}`).then(res => {
          if (res.status === 200) {
            res.data.equirements.forEach(item => {
              item.checkStatus = 'NORMAL'
            })
            this.recordData = res.data
            this.addData.patrolInspection.equirements = res.data.equirements
          }
        })
      }
    },
    validate (isShow) { // isShow true为巡更巡检页面 false为消防检测页面
      if (isShow) {
        if (!this.addData.person) {
          this.$toast({
            message: '请输入责任人',
            position: 'top'
          })
          return
        }
        if (!this.addData.completeTime) {
          this.$toast({
            message: '请选择实际完成时间',
            position: 'top'
          })
          return
        }
        this.submitRecord()
      } else if (!isShow) {
        if (!this.addDate.reportName) {
          this.$toast({
            message: '请输入报告名称',
            position: 'top'
          })
          return
        }
        if (!this.addDate.checkType) {
          this.$toast({
            message: '请选择检测类型',
            position: 'top'
          })
          return
        }
        if (!this.addDate.checkType) {
          this.$toast({
            message: '请选择检测类型',
            position: 'top'
          })
          return
        }
        if (!this.addDate.checkDate) {
          this.$toast({
            message: '请选择检测时间',
            position: 'top'
          })
          return
        }
        if (!this.addDate.principal) {
          this.$toast({
            message: '请输入负责人',
            position: 'top'
          })
          return
        }
        this.submitReports()
      }
    },
    routerTo () {
      let type = this.info.tableType
      let id = this.info.detailId
      let projectId = this.info.projectId
      this.$router.push({ name: 'InspectionDetails', query: { id, type, projectId } })
      this.$router.push({ name: 'InspectionDetails', query: { id, type, projectId } })
    },
    goBack () {
      if (
        (!this.addData.person) &&
        (!this.addData.completeTime) &&
        (!this.addData.annexes.length) &&
        (!this.addDate.reportName) &&
        (!this.addDate.checkType) &&
        (!this.addDate.checkDate) &&
        (!this.addDate.principal) &&
        (!this.addDate.checkDept) &&
        (!this.info.edited) &&
        (!this.addDate.annexes.length)
      ) {
        this.routerTo()
        return
      }
      MessageBox.confirm('', {
        message: '内容尚未保存，确定退出？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonClass: 'confirmButton',
        cancelButtonClass: 'cancelButton'
      }).then(action => {
        if (action === 'confirm') {
          this.routerTo()
          return
        }
      }).catch(error => {
        if (error === 'cancel') {
          if (window.history && window.history.pushState) {
            history.pushState(null, null, document.URL)
          }
        }
      })
    },
    getQuery () {
      if (roterFrom === 'InspectionDetails') {
        this.info.detailId = this.$route.query.id
        this.info.tableType = this.$route.query.type
        this.info.projectId = this.$route.query.projectId
        this.code = true
      } else {
        this.info = JSON.parse(sessionStorage.getItem('info'))
        sessionStorage.removeItem('info')
        if (sessionStorage.getItem('addData')) {
          this.addData = JSON.parse(sessionStorage.getItem('addData'))
          sessionStorage.removeItem('addData')
        }
        if (sessionStorage.getItem('recordData')) {
          this.recordData = JSON.parse(sessionStorage.getItem('recordData'))
          sessionStorage.removeItem('recordData')
        }
        if (sessionStorage.getItem('addDate')) {
          this.addDate = JSON.parse(sessionStorage.getItem('addDate'))
          sessionStorage.removeItem('addDate')
        }
        if (sessionStorage.getItem('reportsData')) {
          this.reportsData = JSON.parse(sessionStorage.getItem('reportsData'))
          sessionStorage.removeItem('reportsData')
        }
      }
      if (this.info.tableType === '巡更巡检') {
        this.listType = '新增巡更巡检记录'
        this.infoTitle = '巡更巡检设备'
        this.isShow = true
      } else if (this.info.tableType === '消防检查') {
        this.listType = '新增消防检测报告'
        this.infoTitle = '消防检测设备'
        this.addDate.projectId = this.info.projectId
        this.addDate.fireControlCheckListId = this.info.detailId
        this.isShow = false
      }
    },
    setAnnex (annexURL, annexName) {
      if (this.isShow) {
        this.addData.annexes.push({
          'annexName': annexName,
          'annexURL': annexURL
        })
      } else {
        this.addDate.annexes.push({
          'annexName': annexName,
          'annexURL': annexURL
        })
      }
    },
    confirmSelect (val) {
      this.showDatetime = false
      const val2 = moment(val).format('YYYY-MM-DD HH:mm:ss')
      const val3 = moment(val).format('YYYY-MM-DD')
      const val4 = moment(val).format('YYYY-MM-DDTHH:mm:ss')
      if (this.isShow) {
        this.addData.completeTime1 = val2
        this.addData.completeTime = val4
      } else if (!this.isShow) {
        this.addDate.checkDate = val3
      }
    },
    formatter1 (type, val) {
      if (type === 'year') {
        return `${val}年`
      } else if (type === 'month') {
        return `${val}月`
      } else if (type === 'day') {
        return `${val}日`
      } else if (type === 'hour') {
        return `${val}时`
      } else if (type === 'minute') {
        return `${val}分`
      }
      return val
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/config";
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
      margin-right: rem(12);
    }
    .selected {
      color: #0139a4;
    }
  }
  .content {
    width: 100%;
    position: relative;
    top: rem(44);
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
    padding: 0 0 0 rem(14);
    border-bottom: rem(1) solid #f0f0f0;
    padding-bottom: rem(16);
    &:last-child {
      border: none;
    }
    .annex {
      margin-top: rem(10);
      font-size: rem(15);
      color: #858c94;
      .an-title {
        position: relative;
        padding-right: rem(14);
        padding-top: rem(6);
        .an-title-look {
          font-size: rem(11);
        }
        .sapn {
          font-size: rem(13);
        }
        i {
          float: right;
          color: #023c8f;
          font-size: rem(14);
          line-height: rem(14);
        }
      }
    }
  }
  .tableList {
    position: relative;
    padding-top: rem(8);
    background: #ffffff;
    .flex {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .shopNb {
        font-size: rem(15);
        color: #444547;
        font-weight: bolder;
        padding-bottom: rem(10);
      }
      .tab {
        font-size: rem(14);
        color: #858c94;
        max-width: 48%;
        text-align: justify;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .addtab {
        overflow: hidden; /*超出部分隐藏*/
        white-space: nowrap; /*不换行*/
        text-overflow: ellipsis; /*超出部分文字以...显示*/
      }
    }
    .iconright {
      position: absolute;
      right: rem(16);
      top: 50%;
      background: linear-gradient(90deg, #c6c6c6 0%, #c6c6c6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
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
    .content_span {
      color: #cfd1de;
      font-size: rem(14);
    }
    .flex {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .shopNb {
        font-size: rem(15);
        color: #444547;
        font-weight: bolder;
        padding-bottom: rem(10);
      }
      .NORMAL::after {
        content: "正常";
        margin-left: rem(10);
        background: #effffb;
        padding: rem(3);
        font-size: rem(12);
        color: #1cc296;
      }
      .Exception::after {
        content: "异常";
        margin-left: rem(10);
        background: #fff3f3;
        padding: rem(3);
        font-size: rem(12);
        color: #fc5159;
      }
      .tab {
        font-size: rem(14);
        display: block;
        float: left;
      }
      .add {
        font-size: rem(14);
        width: 87%;
        display: block;
        float: left;
        height: auto;
        word-wrap: break-word;
        text-align: justify;
      }
      .font {
        background: linear-gradient(90deg, #858c94 0%, #858c94 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .dingwe {
        display: flex;
        color: #0139a4;
        font-size: rem(16);
        height: rem(18);
        line-height: rem(18);
        margin-right: rem(12);
      }
      .iconright {
        height: rem(18);
      }
    }
  }
  .noneFlex {
    display: block;
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
    .delcl {
      flex: 1;
      text-align: right;
      margin-right: rem(12);
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
  .modal_dialog {
    //   margin-left: rem(30);
    margin-top: rem(22);
  }
  .dialogClass {
    .van-dialog__header {
      font-weight: bold !important;
    }
  }
  .mdel_result {
    padding-left: rem(16);
    font-size: rem(14);
    color: #646566;
    display: flex;
    .mdel_result_text {
      margin-right: rem(10);
      font-size: rem(12);
    }
  }
}
</style>
