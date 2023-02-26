<template>
  <div class="intentContracts-info">
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="mainlayout"
           style="width: 1000px;"
           slot="drawer">
        <div class="main-content">
          <div class="addIntentionContracts">
            <div class="head-right">
              <span @click="showRemarks=true,showEnclosure=false">
                <span class="iconfont icon-post"></span>
                备注</span>
              <span @click="showEnclosure=true,showRemarks=false">
                <span class="iconfont icon-attachment"></span>
                附件</span>
            </div>
            <div class="dl-head">
              <span style="color: #3577F6">基本信息</span>
            </div>
            <div class="dl-content clearfix">
              <el-form :model="detailData"
                       ref="detailData"
                       :rules="detailDataRules">
                <div class="step1"
                     v-show="newlystep1">
                  <div class="dc-left float-left">
                    <div class="dr-head">房源信息</div>
                    <div class="basic-select">
                      <div class="clearfix selectInput"
                           style="border: none;margin-bottom: 10px">
                        <img :src="detailData.projectManagement ? detailData.projectManagement.previewImage : ''" />
                        <span style="float: none">{{detailData.projectManagement ? detailData.projectManagement.projectName : ''}}</span>
                      </div>
                      <div class="layer"
                           v-for="(item, index) in detailData.rooms"
                           :key="index">
                        <div>
                          <span v-if="item.floor">{{item.floor.name}}层</span>
                          <span v-if="item.shopNumber">{{item.shopNumber}}室</span>
                          <span v-if="item.buildingArea">{{item.buildingArea}}m²</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="dc-right float-right">
                    <div class="dr-head">意向合同信息</div>
                    <el-form-item :label-width="formLabelWidth"
                                  prop="yxContractNo">
                      <div class="cttitle">意向合同编号<i class="required">*</i></div>
                      <span>{{detailData.yxContractNo}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">意向定金<i class="required">*</i></div>
                      <span>{{detailData.yxDeposit}}</span>
                    </el-form-item>
                    <el-form-item prop="startDate"
                                  :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">意向合同开始时间<i class="required">*</i></div>
                      <span>{{detailData.startDate}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  prop="endDate"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">意向合同结束时间<i class="required">*</i></div>
                      <span>{{detailData.endDate}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  prop="area"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">租赁面积/m²<i class="required">*</i></div>
                      <span>{{detailData.area | toLocaleFixed}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  prop="iDNumber">
                      <div class="cttitle">意向单价<i class="required">*</i></div>
                      <span>{{priceAndUnit(detailData.priceUnit, detailData.yxUnitPrice)}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">最晚缴纳时间<i class="required">*</i></div>
                      <span>{{detailData.latestPaymentDate}}</span>
                    </el-form-item>
                  </div>
                  <div class="dc-right float-right tenantinfo">
                    <div class="dr-head">客户信息</div>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">客户名称<i class="required">*</i></div>
                      <span v-if="detailData.tenant">{{detailData.tenant.teantName}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">品牌</div>
                      <span v-if="detailData.tenant">{{detailData.tenant.referred}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">法人</div>
                      <span v-if="detailData.tenant">{{detailData.tenant.operName}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">行业</div>
                      <span>{{detailData.industry}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">签订人</div>
                      <span>{{detailData.signer}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">签订人联系方式</div>
                      <span>{{detailData.signerPhone}}</span>
                    </el-form-item>
                  </div>
                </div>
              </el-form>
              <div class="step2 dl-content"
                   v-show="newlystep2">
                <div class="dc-right float-right">
                  <div class="dr-head">其他信息</div>
                  <div class="other-info">
                    <div style="margin-bottom: 10px;">备注</div>
                    <el-input type="textarea"
                              :rows="2"
                              resize="none"
                              v-model="detailData.remark">
                    </el-input>
                    <div style="margin: 40px 0 10px;">附件
                      <span class="upload">
                        上传附件
                        <input type="file"
                               @change="imageChange('addapp', $event)">
                      </span>
                    </div>
                    <div class="enclosure">
                      <div class="enclosure-head">
                        <span>文件名</span>
                        <span>操作</span>
                      </div>
                      <div class="enclosure-list">
                        <div class="el-item">
                          <span>意向合同商务条件.word</span>
                          <span>
                            <i>下载</i>
                            <i>删除</i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   v-if="detailData.itContractStatus === 'TO_BE_CONFIRMED'"
                   @click="confirm"
                   class="close-button">确认</el-button>
        <span v-else>
          <el-button type="primary"
                     v-if="detailData.itContractStatus === 'INVALID' && hasAuthority('02040106')"
                     :disabled="(detailData.yxBill.billStatus === 'NO' || detailData.yxBill.billStatus === 'APPROVAL' || detailData.yxBill.billStatus === 'UPDATE') && detailData.yxBill.feeTypeName === '意向金' && detailData.yxBill.billType === 'R'  || detailData.yxBill.feeTypeName === '意向金'  && detailData.yxBill.billType === 'P'"
                     @click="refundDialog = true"
                     class="close-button">退款</el-button>
          <el-button type="primary"
                     v-if="detailData.itContractStatus === 'CONFIRMED' && hasAuthority('02040104')"
                     @click="previousStep"
                     class="close-button">作废</el-button>
          <el-button type="primary"
                     v-if="detailData.itContractStatus !== 'INVALID' && detailData.itContractStatus !== 'TO_CONTRACT' && hasAuthority('02040105')"
                     class="defaultbtn dialog-confirmBtn"
                     @click="conversion()">转为合同</el-button>
        </span>
      </div>
    </drawer>
    <div class="contracts-remarks"
         v-show="showRemarks">
      <div class="rektitle">备注
        <span @click="showRemarks=false">关闭</span>
      </div>
      <!-- <el-input type="textarea"
                :rows="4"
                resize="none"
                placeholder="请输入内容"
                v-model="remarkContent">
      </el-input>
      <div @click="addRemarks"
           class="operation">
        <span>确定</span>
      </div> -->
      <div class="remarks-list">
        <div class="remarks-item">
          <div>备注记录：</div>
          <div>
            <span>{{detailData.remark}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="contracts-enclosure"
         v-show="showEnclosure">
      <div class="rektitle">附件管理
        <span @click="showEnclosure=false">关闭</span>
      </div>
      <!-- <div class="upload">
        <span>
          <i class="icon icon-adds"></i>
          <p style="line-height: 0;position: relative;top: -28px;">上传文件</p>
        </span>
        <input type="file"
               @change="imageChange('addapp', $event)">
      </div> -->
      <div v-if="detailData.annexURL"
           class="enclosure-list">
        <div class="enclosure-item">
          <span>{{detailData.annexName}}</span>
          <i @click="downloadFile()"
                class="iconfont icon-xiazaidaoru"
                style="margin-right: 10px;"></i>
          <!-- <i @click="deleFile()"
              class="iconfont icon-lajixiang"></i> -->
        </div>
      </div>
      <!-- <div @click="addAnnexes"
           class="operation">
        <span>确定</span>
      </div> -->
    </div>

    <el-dialog title="意向金退款确认"
               :visible.sync="refundDialog"
               class="refundDialog">
      <el-form :model="refundform"
               :rules="refundRules"
               ref="refundform">
        <div class="dl-subtitle">账单类型
          <el-form-item>
            付款
          </el-form-item>
        </div>
        <div class="dl-subtitle">账单金额/元<span class="required">*</span>
          <el-form-item prop="amount">
            <el-input v-model="refundform.amount">
            </el-input>
          </el-form-item>
        </div>
        <div class="dl-subtitle"
             style="margin-bottom: 40px;">付款时间<span class="required">*</span>
          <el-form-item prop="billDate">
            <el-date-picker v-model="refundform.billDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="refundDialog = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="refund('refundform')"
                   class="defaultbtn dialog-confirmBtn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import Drawer from '@/components/drawer.vue'
export default {
  name: 'intentionContractsDetails',
  components: {
    Drawer
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Object
    }
  },
  data () {
    return {
      refundDialog: false,
      refundform: {
        amount: '',
        billDate: ''
      },
      refundRules: {
        amount: [
          { required: true, message: '请输入账单金额', trigger: 'blur' }
        ],
        billDate: [
          { required: true, message: '请选择付款时间', trigger: 'change' }
        ]
      },
      remarkContent: '',
      newlystep1: true,
      newlystep2: false,
      drawerTitle: '意向合同信息',
      formLabelWidth: '',
      documentTypeOptions: [],
      nationalityOptions: [],
      chooseObj: {},
      selHourse: false,
      selProject: false,
      errorProject: false,
      sexOptions: [
        { name: '男', value: 'MAN' },
        { name: '女', value: 'WOMAN' }
      ],
      detailDataRules: {
        yxContractNo: [
          { required: true, message: '请输入合同编号', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '请选择结束时间', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请输入租赁面积', trigger: 'blur' }
        ]
      },
      showRemarks: false,
      showEnclosure: false
    }
  },
  watch: {
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    onHide () {
      this.$emit('drawerClose', false)
      this.$emit('query', false)
      this.readonly = true
      this.showRemarks = false
      this.showEnclosure = false
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
    priceAndUnit (priceUnit, yxUnitPrice) {
      if (priceUnit === 'DAY') {
        return yxUnitPrice + '元/天'
      } else if (priceUnit === 'MONTH') {
        return yxUnitPrice + '元/月'
      } else if (priceUnit === 'M2DAYS') {
        return yxUnitPrice + '元/㎡天'
      } else if (priceUnit === 'M2MONTH') {
        return yxUnitPrice + '元/㎡月'
      } else {
        return yxUnitPrice
      }
    },
    chooseItem (state, item) {
      if (state === 'project') {
        this.selProject = !this.selProject
      } else {
        this.selHourse = !this.selHourse
      }
      this.chooseObj = item
    },
    newlystepNoe (formName) {
      if (!this.chooseObj) {
        this.errorProject = true
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.newlystep1 = false
          this.newlystep2 = true
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    previousStep () {
      context.http.put('/cms/api/yx-contracts/invalid/' + this.detailData.id).then(res => {
        this.onHide()
      })
    },
    confirm () {
      context.http.get('/cms/api/yx-contracts/confirmed/' + this.detailData.id).then(res => {
        this.onHide()
      })
    },
    imageChange (state, event) {
      if (state === 'addapp') {
        let files = event.target.files
        let form = new FormData()
        form.append('file', files[0])
        let name = files[0].name
        event.target.value = ''
        context.http.post('/ywm/api/image-multipart', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          this.$set(this.detailData, 'annexName', name)
          this.$set(this.detailData, 'annexURL', res.data)
        }).catch(error => {
          console.info(error)
        })
      }
    },
    downloadFile () {
      axios({ method: 'GET', url: '/ywm/api/annex/download', params: { annexURL: this.detailData.annexURL, annexName: this.detailData.annexName }, responseType: 'blob' }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', this.detailData.annexName)
        document.body.appendChild(link)
        link.click()
      })
    },
    deleFile () {
      this.detailData.annexName = null
      this.detailData.annexURL = null
    },
    addRemarks () {
      if (!this.remarkContent) {
        return
      }
      context.http.post('/cms/api/remarks', {content: this.remarkContent, contractId: this.detailData.id}).then(res => {
        if (res.data) {
          this.$emit('handleEdit', 0, this.detailData)
          this.showRemarks = false
        }
      })
    },
    addAnnexes () {
      if (this.detailData.annexName === '') {
        return
      }
      context.http.post('/cms/api/annexes', {annexName: this.detailData.annexName, annexURL: this.detailData.annexURL, contractId: this.detailData.id}).then(res => {
        if (res.data) {
          this.$emit('handleEdit', 0, this.detailData)
          this.showEnclosure = false
        }
      })
    },
    conversion () {
      localStorage.contractStatus = 'toBeContract'
      this.$router.push({ path: '/home/contractsList', query: { intention: this.detailData.id } })
    },
    refund (formName) {
      this.$refs['refundform'].validate((valid) => {
        if (valid) {
          this.refundform.businessId = this.detailData.id
          this.refundform.businessType = 'YX_CONTRACT'
          this.refundform.feeTypeName = '意向金'
          this.refundform.finalPaymentDate = this.refundform.billDate
          this.refundform.referred = this.detailData.tenant.referred
          this.refundform.tenandId = this.detailData.tenant.id
          this.refundform.projectManagement = this.detailData.projectManagement
          let _this = this
          context.http.post('/cms/api/bills/restore', this.refundform).then(res => {
            _this.refundDialog = false
            _this.showRemarks = false
            _this.showEnclosure = false
            _this.$emit('handleEdit', 0, this.detailData)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
.intentContracts-info {
  position: relative;
  .contracts-remarks {
    position: fixed;
    z-index: 999;
    width: 500px;
    height: 100%;
    right: 0;
    top: 57px;
    background-color: rgba(250, 250, 250, 1);
    .rektitle {
      margin: 20px;
      span {
        float: right;
        font-size: 12px;
        cursor: pointer;
      }
    }
    .el-textarea {
      width: 90%;
      margin-left: 20px;
    }
    .operation {
      text-align: right;
      span {
        display: inline-block;
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background-color: #0f75ff;
        color: #fff;
        border-radius: 4px;
        font-size: 12px;
        margin: 20px 28px 0 0;
        cursor: pointer;
      }
    }
    .remarks-list {
      width: 90%;
      margin: 40px auto 0;
      div {
        &:first-child {
          color: #333;
          font-size: 14px;
          margin-bottom: 10px;
        }
        &:last-child {
          color: #666;
          span {
            display: inline-block;
            font-size: 14px;
            &:first-child {
              width: 70%;
            }
            &:last-child {
              width: 28%;
              text-align: right;
            }
          }
        }
      }
    }
  }
  .contracts-enclosure {
    position: fixed;
    z-index: 999;
    width: 500px;
    height: 100%;
    right: 0;
    top: 57px;
    background-color: rgba(250, 250, 250, 1);
    .rektitle {
      margin: 20px;
      span {
        float: right;
        font-size: 12px;
        cursor: pointer;
      }
    }
    .upload {
      width: 90%;
      text-align: center;
      height: 100px;
      line-height: 100px;
      margin: 0 auto;
      color: rgba(15, 117, 255, 1);
      border: 1px solid rgba(231, 231, 231, 1);
      border-radius: 4px;
      background-color: #fff;
      position: relative;
      input {
        position: absolute;
        right: 0;
        top: 0;
        width: 100%;
        height: 100px;
        opacity: 0;
        cursor: pointer;
      }
      .icon-adds{
        background: url(../../../../assets/plus.png) no-repeat;
        background-size: contain;
        margin-bottom: 6px;
      }
    }
    .enclosure-list {
      width: 90%;
      margin: 0 auto;
      margin-top: 40px;
      .enclosure-item {
        font-size: 14px;
        span {
          display: inline-block;
          width: 10%;
          &:first-child {
            width: 70%;
          }
        }
      }
    }
  }
  .refundDialog {
    .dl-subtitle {
      display: inline-block;
      width: 49%;
      margin-top: 20px;
      .el-form-item {
        margin-top: 10px;
        height: 40px;
        line-height: 40px;
      }
    }
    .el-dialog__title {
      font-size: 16px;
    }
  }
}
.main-content {
  position: relative;
}
.contracts-info .wrap {
  .drawer-head {
    border-bottom: 1px solid #ddd;
  }
}
.addIntentionContracts {
  position: relative;
  .head-right {
    position: absolute;
    top: -40px;
    right: 0;
    font-size: 12px;
    span {
      cursor: pointer;
    }
  }
  .dl-head {
    margin-top: 10px;
  }
  .dialog-footer {
    border-top: 1px solid #e5e5e5;
    padding: 20px 0;
    text-align: right;
  }
  .errorpjTip {
    color: red !important;
    font-size: 12px;
    width: 100%;
    float: left;
  }
  .step2 {
    .dc-right {
      width: 100% !important;
      border: 1px solid #e7e7e7;
      .other-info {
        width: 98%;
        margin: 0 auto;
      }
    }
  }
  .upload {
    position: relative;
    float: right;
    display: inline-block;
    width: 60px;
    height: 24px;
    line-height: 24px;
    background: rgba(222, 235, 254, 1);
    opacity: 0.9;
    border-radius: 2px;
    font-size: 12px;
    text-align: center;
    cursor: pointer;
    input {
      position: absolute;
      right: 0;
      width: 60px;
      height: 24px;
      opacity: 0;
      cursor: pointer;
    }
  }
  .enclosure {
    border: 1px solid #e7e7e7;
    margin-bottom: 20px;
    .enclosure-head {
      background-color: #fafafa;
      height: 30px;
      line-height: 30px;
      span {
        display: inline-block;
        width: 48%;
        padding-left: 40px;
      }
    }
    .el-item {
      height: 30px;
      line-height: 30px;
      span {
        display: inline-block;
        width: 48%;
        padding-left: 40px;
        i {
          cursor: pointer;
        }
      }
    }
  }
  .dl-content {
    width: 100%;
    margin-bottom: 20px;
    .head-portrait {
      padding-top: 36px;
      text-align: center;
      .hp-img {
        width: 100px;
        height: 100px;
        border: 1px dashed #dfdfdf;
        border-radius: 50%;
        margin-left: 22%;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .upload {
        vertical-align: top;
        position: relative;
        .uploadbtn {
          display: inline-block;
          width: 88px;
          height: 34px;
          line-height: 34px;
          text-align: center;
          border: 1px solid #5e72e4;
          border-radius: 8px;
          color: #5e72e4;
          margin-top: 14px;
          cursor: pointer;
          .icon-upload {
            //  background: url(../../../assets/upload.png) no-repeat;
            position: relative;
            top: 2px;
            width: 14px;
          }
        }
        input {
          position: absolute;
          top: 14px;
          right: 41px;
          width: 88px;
          height: 34px;
          opacity: 0;
          cursor: pointer;
        }
      }
      p {
        font-size: 12px;
        margin-top: 10px;
        color: #666;
      }
    }
    .dc-left {
      width: 30%;
      text-align: center;
      border: 1px solid #e7e7e7;
      margin-top: 20px;
      .dr-head {
        background-color: #fafafa;
        height: 40px;
        line-height: 40px;
        padding-left: 12px;
        font-size: 16px;
        margin-bottom: 24px;
      }
    }
    .tenantinfo {
      .el-form-item {
        width: 29% !important;
        margin-right: 0;
      }
      .cttitle + span {
        display: inline-block;
        height: 40px;
        line-height: 40px;
      }
    }
    .dc-right {
      width: 68%;
      border: 1px solid #e7e7e7;
      margin-top: 20px;
      .dr-head {
        background-color: #fafafa;
        height: 40px;
        line-height: 40px;
        padding-left: 12px;
        font-size: 16px;
        margin-bottom: 24px;
      }
      .el-form-item {
        display: inline-block;
        width: 45%;
        margin-left: 16px;
        margin-right: 10px;
        &:nth-of-type(odd) {
          margin-right: 0;
        }
      }
      .dc-right_div {
        border: 1px solid #e7e7e7;
        margin-top: 20px;
        .cttitle span:nth-of-type(2) {
          color: #0f75ff;
          font-size: 12px;
          float: right;
          cursor: pointer;
        }
        .psotmaster span {
          color: #666 !important;
        }
      }
    }
    .cttitle + span {
      font-size: 12px;
    }
  }
}
.operation {
  text-align: right;
  span {
    display: inline-block;
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: #0f75ff;
    color: #fff;
    border-radius: 4px;
    font-size: 12px;
    margin: 20px 28px 0 0;
    cursor: pointer;
  }
}
</style>
