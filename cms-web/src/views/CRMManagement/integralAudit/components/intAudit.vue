<template>
  <div>
    <drawer :show="intAuditShow"
            :title="drawerTitle"
            @on-hide="onHide">
      <div slot="drawer"
           class="intAudit details-content">
        <div class="tick">
          <p class="title">小票信息审核</p>
          <div class="content">
            <div class="item"><span>会员名称：</span><span>{{detailData.memberName}}</span></div>
            <div class="item"><span>手机号：</span><span>{{detailData.telephone}}</span></div>
            <div class="item"><span>会员卡号：</span><span>{{detailData.memberCardNo}} </span></div>
            <div class="item"><span>会员等级：</span><span>{{detailData.memberCardName}} </span></div>
            <div class="item"
                 style="width:100%"><span> 小票上传时间：</span><span>{{uploadTimeFormat(detailData.uploadTime)}}</span></div>
            <div class="item"
                 style="width:100%">上传的小票：</div>
            <div class="">
              <img :src="detailData.imageUrl"
                   @click="showImg(detailData.imageUrl)"
                   class="tickImg">
            </div>
          </div>
        </div>
        <div class="intAuditBox">
          <p class="title"><span></span>积分计算</p>
          <div class="content">
            <el-form :model="addData"
                     ref="addData"
                     :rules="addDataRule">
              <div class="item">
                <span>项目简称<i v-if="!readOnly">*</i></span>
                <el-form-item prop="projectManagementId">
                  <el-select v-model="addData.projectManagementId"
                             prop="projectManagementId"
                             v-if="!readOnly"
                             style="width:280px"
                             placeholder="项目"
                             @change="projectChange">
                    <el-option v-for="item in options1"
                               :key="item.id"
                               :label="item.referred"
                               :value="item.id">
                    </el-option>
                  </el-select>
                  <p v-else>{{detailData.projectName}}</p>
                </el-form-item>
              </div>
              <div class="item">
                <span>品牌<i v-if="!readOnly">*</i></span>
                <el-form-item prop="brandId">
                  <el-select v-model="addData.brandId"
                             prop="brandId"
                             filterable
                             v-if="!readOnly"
                             style="width:280px"
                             placeholder="输入搜索">
                    <el-option v-for="item in brandList"
                               :key="item.id"
                               :label="item.referred"
                               :value="item.id">
                    </el-option>
                  </el-select>
                  <p v-else>{{detailData.tenantName}}</p>
                </el-form-item>
              </div>
              <div class="item">
                <span>小票号码<i v-if="!readOnly">*</i></span>
                <el-form-item prop="tickNb">
                  <el-input v-if="!readOnly"
                            v-model="addData.tickNb"
                            onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9]/g,'')"
                            onpaste="value=value.replace(/[^\a-\z\A-\Z0-9]/g,'')"
                            oncontextmenu ="value=value.replace(/[^\a-\z\A-\Z0-9]/g,'')"
                            style="width:280px"></el-input>
                  <p v-else>{{detailData.receiptNumber}}</p>
                </el-form-item>
              </div>
              <div class="item">
                <span>时间<i v-if="!readOnly">*</i></span>
                <el-form-item prop="time">
                  <el-date-picker v-model="addData.time"
                                  prop="time"
                                  v-if="!readOnly"
                                  :editable="false"
                                  :clearable="false"
                                  style="width:280px"
                                  value-format="yyyy-MM-dd HH:mm"
                                  format="yyyy-MM-dd HH:mm"
                                  type="datetime"
                                  @change="timeChange"
                                  placeholder="选择日期时间">
                  </el-date-picker>
                  <p v-else>{{approvalDateFormat(detailData.approvalDate)}}</p>
                </el-form-item>
              </div>
              <div class="item">
                <span>消费金额(元)<i v-if="!readOnly">*</i></span>
                <el-form-item prop="money">
                  <el-input v-if="!readOnly"
                            v-model="addData.money"
                            prop="money"
                            onkeyup="value=value.replace(/[^\0-9\.]/g,'')"
                            onpaste="value=value.replace(/[^\0-9\.]/g,'')"
                            oncontextmenu ="value=value.replace(/[^\0-9\.]/g,'')"
                            style="width:280px"></el-input>
                  <p v-else>{{detailData.amount}}</p>
                </el-form-item>
              </div>
              <div class="item">
                <span>兑换积分<i v-if="!readOnly">*</i></span>
                <el-form-item>
                  <el-input v-if="!readOnly"
                            disabled
                            v-model="int"
                            style="width:280px"></el-input>
                  <p v-else>{{detailData.integral}}</p>
                </el-form-item>
              </div>
              <div class="item"
                   v-if="readOnly&&detailData.approvalStatus==='NO'">
                <span>审核失败原因</span>
                <div style="margin-bottom: 22px;">
                  <p>{{detailData.memo}}</p>
                </div>
              </div>
              <div class="item"
                   v-if="readOnly">
                <span>审核人<i v-if="!readOnly">*</i></span>
                <div style="margin-bottom: 22px;">
                  <p>{{detailData.approvalUserName}}</p>
                </div>
              </div>
              <div class="item"
                   v-if="errorTxt">
                <p class="errorTxt">{{errorTxt}}</p>
              </div>
              <div class="item"
                   v-if="!readOnly"
                   style="display: flex;flex-direction: row-reverse;padding-right: 13px;">
                <el-button class="bzan bzan2"
                           @click="preCalculate">计 算</el-button>
              </div>
              <div class="resultImg"
                   v-if="readOnly">
                <div class="success"
                     v-if="detailData.approvalStatus==='OK'"></div>
                <div class="fail"
                     v-if="detailData.approvalStatus==='NO'"></div>
              </div>
            </el-form>
          </div>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="onHide"
                   class="close-button"
                   style="padding: 12.5px 30px;height:auto;width:auto">关 闭</el-button>
        <el-button class="bzan bzan9"
                   v-if="!readOnly && hasAuthority('05040102')"
                   @click="failAudit">审核失败</el-button>
        <el-button type="primary"
                   v-if="!readOnly && hasAuthority('05040102')"
                   @click="calculate('OK')"
                   class="defaultbtn dialog-confirmBtn">审核通过</el-button>
      </div>
    </drawer>
    <el-dialog title="审核失败原因"
               :visible.sync="failAuditDialogVisible"
               @close="failAuditDialogClose"
               width="500px">
      <div class="failAuditContent">
        <el-input type="textarea"
                  :rows="4"
                  maxlength="50"
                  placeholder="输入的字数不超过50字"
                  v-model="memo">
        </el-input>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="failAuditDialogClose">取 消</el-button>
        <el-button type="primary"
                   @click="calculate('NO')">确 定</el-button>
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
import picturePrevie from '@/components/picturePrevie.vue'
export default {
  name: 'memberDetailis',
  components: {
    Drawer,
    picturePrevie
  },
  props: {
    options1: {
      type: Array,
      default: {}
    },
    intAuditShow: {
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
        // this.detailData.approvalStatus = 'APPROVAL'
        this.addData.projectManagementId = this.detailData.projectId
        this.errorTxt = null
        if (this.detailData.approvalStatus === 'OK' || this.detailData.approvalStatus === 'NO') {
          this.readOnly = true
        } else if (this.detailData.approvalStatus === 'APPROVAL') {
          this.getTenantlist(this.detailData.projectId) // 根据项目请求品牌列表
          this.readOnly = false
        }
      }
    }
  },
  created () {

  },
  data () {
    return {
      memo: '',
      failAuditDialogVisible: false,
      errorTxt: null,
      int: '',
      addData: {
        projectManagementId: '',
        tickNb: '',
        time: '',
        money: '',
        brandId: ''
      },
      addDataRule: {
        projectManagementId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        tickNb: [
          { required: true, message: '请输入小票号码', trigger: 'change' }
        ],
        time: [
          { required: true, message: '请输入时间', trigger: 'change' }
        ],
        money: [
          { required: true, message: '请输入消费金额', trigger: 'change' }
        ],
        brandId: [
          { required: true, message: '请选择品牌', trigger: 'change' }
        ]
      },
      brandList: [],
      readOnly: false,
      imgArr: [],
      num: 0,
      showPicture: false,
      drawerTitle: '积分审核'
    }
  },
  methods: {
    projectChange (id) {
      this.addData.brandId = ''
      this.getTenantlist(id)
    },
    preCalculate () { // 计算
      this.$refs['addData'].validate((valid) => {
        if (valid) {
          let parems = this.detailData
          parems.projectId = this.addData.projectManagementId
          parems.tenantId = this.addData.brandId
          parems.receiptNumber = this.addData.tickNb
          parems.approvalDate = this.addData.time.replace(' ', 'T') + ':00'
          parems.amount = this.addData.money
          context.http.post(`crm/api/integralApproval/preCalculate`, parems).then(res => {
            if (res) {
              this.errorTxt = null
              if (res.data.message) {
                this.errorTxt = res.data.message
              } else {
                this.int = res.data.integral
                console.log('计算')
              }
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    calculate (status) { // 审核
      this.$refs['addData'].validate((valid) => {
        if (valid) {
          let parems = this.detailData
          parems.projectId = this.addData.projectManagementId
          parems.tenantId = this.addData.brandId
          parems.receiptNumber = this.addData.tickNb
          parems.approvalDate = this.addData.time.replace(' ', 'T') + ':00'
          parems.amount = this.addData.money
          parems.approvalStatus = status
          if (status === 'NO') {
            if (this.memo === '') {
              this.$message.error('请输入失败原因')
              return
            } else {
              parems.memo = this.memo
            }
          }
          context.http.post(`crm/api/integralApproval/approval`, parems).then(res => {
            if (res) {
              this.failAuditDialogClose()
              this.$emit('auditSuccess', res.data)
            } else {
              this.$message.error('审核失败')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getTenantlist (projectId) {
      context.http.get(`cms/api/tenant/projectManagement/${projectId}`).then(res => {
        if (res) {
          this.brandList = res.data
        }
      })
    },
    approvalDateFormat (time) {
      if (time) {
        return time.substring(0, 16).replace('T', '  ')
      }
    },
    uploadTimeFormat (uploadTime) {
      if (uploadTime) {
        return uploadTime.replace('T', '   ')
      }
    },
    failAuditSave () { // 提交失败原因
      this.failAuditDialogClose()
    },
    failAuditDialogClose () {
      this.failAuditDialogVisible = false
    },
    failAudit () { // 审核失败
      this.failAuditDialogVisible = true
    },
    timeChange (val) {
      // console.log(this.time, val)
    },
    showImg (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
      console.log(this.imgArr)
    },
    pictureClose () {
      this.showPicture = false
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    onHide () {
      this.addData = {
        projectManagementId: '',
        tickNb: '',
        time: '',
        money: '',
        brandId: ''
      }
      this.int = ''
      this.$refs['addData'].resetFields()
      this.$emit('drawerClose', false)
    }
  }
}
</script>
<style lang="scss">
.el-textarea textarea {
  height: auto;
}
.clubCardSet .dialog-footer {
  margin-top: -80px;
  clear: both;
  margin-right: 20px;
  text-align: right;
  height: 40px;
  position: relative;
  margin-left: 30px;
  padding-top: 15px;
  border-top: 1px solid #e5e5e5;
}
</style>
<style lang="scss" scoped>
.bzan9 {
  background-color: #ffb300 !important;
}
.failAuditContent {
  padding: 20px 0;
}
.intAudit {
  width: 1000px;
  display: flex;
  justify-content: space-between;
  padding: 15px;
  min-height: 700px;
  height: calc(100% - 120px);
  > div {
    border: 1px solid rgba(242, 242, 242, 1);
    box-shadow: 0px 2px 3px 0px rgba(190, 199, 208, 0.2);
    > p.title {
      padding-left: 15px;
      height: 40px;
      line-height: 40px;
      background: rgba(250, 250, 250, 1);
      border: 1px solid rgba(242, 242, 242, 1);
      display: flex;
      align-items: center;
      > span {
        display: inline-block;
        width: 4px;
        height: 20px;
        background-color: #3577f6;
        margin-right: 8px;
      }
    }
    &.tick {
      width: 550px;
      .content {
        padding: 15px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        > .item {
          width: 50%;
          height: 50px;
          line-height: 50px;
          span {
            &:last-child {
              font-size: 12px;
              color: #999999;
            }
          }
        }
        .tickImg {
          max-width: 160px;
          max-height: 460px;
          cursor: pointer;
        }
      }
    }
    &.intAuditBox {
      width: 450px;
      background-color: #fafafc;
      > .title {
        border: none;
      }
      .content {
        padding: 15px;
        position: relative;
        .item {
          display: flex;
          align-items: center;
          // margin-bottom: 15px;
          // height: 40px;
          .errorTxt {
            font-size: 12px;
            color: #d91616;
            width: 100%;
            text-align: center;
          }
          span {
            margin-right: 10px;
            display: inline-block;
            width: 100px;
            text-align: right;
            margin-bottom: 22px;
            i {
              color: #ff0000;
              font-size: 14px;
              font-style: normal;
            }
          }
          > div {
            > p {
              font-size: 12px;
              color: #999999;
            }
          }
          .el-form-item__content {
            > p {
              font-size: 12px;
              color: #999999;
            }
          }
        }
        .resultImg {
          width: 150px;
          height: 150px;
          position: absolute;
          bottom: 60px;
          right: 60px;
          > div {
            width: 100%;
            height: 100%;
            &.success {
              background-image: url("../../../../assets/auditSuccess.png");
              background-repeat: no-repeat;
              background-size: 100%;
            }
            &.fail {
              background-image: url("../../../../assets/auditFail.png");
              background-repeat: no-repeat;
              background-size: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
