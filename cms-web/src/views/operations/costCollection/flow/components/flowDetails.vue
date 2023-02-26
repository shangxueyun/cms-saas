<template>
  <div class="flow-details">
    <drawer :show="detailsdrawershow"
            class="drawer_new"
            :title="drawerTitle"
            :showEditBtn="false"
            @on-hide="onHide"
            @on-edit="onEdit">
      <div class="details_content drawer-body"
           slot="drawer"
           style="width: 900px;">
        <div class="main-content"
             style="padding:0">
          <el-form :model="detailsData"
                   ref="detailsData"
                   :rules="TenantDTORules">
            <div class="half_page_title"
                 style="width:100%">
              <div><i></i>客户流水信息</div>
            </div>
            <div class="part part1"
                 style="margin-bottom:12px">
              <div class="content-info">
                <div>匹配金额</div>
                <div>{{tableRow.amount}}</div>
              </div>
              <div class="content-info">
                <div>匹配时间</div>
                <div>{{tableRow.writeOffDate}}</div>
              </div>
              <div class="content-info">
                <div>付款人</div>
                <div>{{tableRow.drawee}}</div>
              </div>
            </div>
            <div class="half_page_title"
                 style="width:100%">
              <div><i></i>银行流水信息</div>
              <!-- <div class="statementBtn"
                   @click="openFlowBankDetails">
                <span>银行流水</span>
              </div> -->
            </div>
            <div class="part part1">
              <div class="content-info">
                <div>流水类型</div>
                <div>{{formatBillType(detailsData.billType)}}</div>
              </div>
              <div class="content-info">
                <div>匹配状态</div>
                <div>{{formatMatchState(detailsData.flowState)}}</div>
              </div>
              <div class="content-info">
                <div>回单日期</div>
                <div v-if="isEdit">{{detailsData.recordDate}}</div>
                <el-form-item v-else
                              prop="recordDate">
                  <el-date-picker type="date"
                                  size="small"
                                  value-format="yyyy-MM-dd"
                                  v-model="detailsData.recordDate"
                                  placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </div>
              <div class="content-info">
                <div>流水金额/元</div>
                <div v-if="isEdit">{{detailsData.amount+detailsData.serviceCharge | toLocaleString}} <span v-if="detailsData.serviceCharge>0">（含{{detailsData.serviceCharge| toLocaleString}}元手续费）</span></div>
                <el-form-item v-else
                              class="el-input__inner_with100"
                              prop="amount">
                  <el-input v-model="detailsData.amount"
                            style="width:150px"
                            size="small"
                            placeholder="回单金额"
                            title=""
                            type="number">
                  </el-input>
                  <el-input v-model="detailsData.serviceCharge"
                            style="width:80px;margin-right:0"
                            placeholder="手续费"
                            size="small"
                            title=""
                            type="number">
                  </el-input>
                </el-form-item>
              </div>
              <div class="content-info">
                <div>已匹配金额/元</div>
                <div>{{detailsData.ypAmount | toLocaleString}}</div>
              </div>
              <div class="content-info">
                <div>流水编号</div>
                <div>{{tableRow.billFlowCode}}</div>
              </div>
            </div>
          </el-form>
          <div class="half_page_title"
               style="margin: 12px 15px 0;">
            <div><i></i>账单信息</div>
            <!-- <div class="statementBtn"
                 @click="handleEdit(tableRow.billId, tableRow.billCategory)">
              <span>账单详情</span>
            </div> -->
          </div>
          <div class="bills part"
               style="padding: 0 15px 15px 15px">
            <div class="content-info">
              <div>管理企业</div>
              <div>{{tableRow.organizeName}}</div>
            </div>
            <div class="content-info">
              <div>项目简称</div>
              <div>{{tableRow.projectManagementReferred}}</div>
            </div>
            <div class="content-info">
              <div>客户名称</div>
              <div>{{tableRow.tenandName}}</div>
            </div>
            <div class="content-info">
              <div>费用类型</div>
              <div>{{tableRow.feeTypeName}}</div>
            </div>
            <div class="content-info">
              <div>计费周期</div>
              <div>{{tableRow.startDate}} ~ {{tableRow.endDate}}</div>
            </div>
            <div class="content-info">
              <div>账单金额/元</div>
              <div>{{tableRow.billAmount}}</div>
            </div>
            <div class="content-info">
              <div>账单状态</div>
              <div>{{formatBillStatus(tableRow.billStatus)}}</div>
            </div>
            <div class="content-info">
              <div>应收/应付时间</div>
              <div>{{tableRow.finalPaymentDate}}</div>
            </div>
            <div class="content-info">
              <div>出/入账时间</div>
              <div>{{tableRow.accountDate}}</div>
            </div>
          </div>
        </div>
        <el-dialog v-if="centerDialogVisible"
                   title="删除流水"
                   class="warnDialog"
                   append-to-body
                   :visible.sync="centerDialogVisible"
                   width="30%"
                   center>
          <img class="warnIcon"
               src="../../../../../assets/tanhao@2x.png" />
          <span class="warnInfo">确定删除流水？</span>
          <span slot="footer"
                class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary"
                       @click="deleteBillFlows">确 定</el-button>
          </span>
        </el-dialog>
        <picturePrevie v-if="showPicture"
                       :imgList="imgArr"
                       :num="num"
                       @pictureClose="pictureClose"></picturePrevie>
      </div>
    </drawer>
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import aliUpload from '@/components/aliUpload.vue'
import Drawer from '@/components/drawer.vue'
import ailPreview from '@/components/ailPreview.vue'
import picturePrevie from '@/components/picturePrevie.vue'
export default {
  name: 'billDetails',
  components: {
    Drawer,
    aliUpload,
    ailPreview,
    picturePrevie
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    detailsData: {
      type: Object,
      default: {
        annexes: []
      }
    },
    payTypeList: {
      type: Array,
      default: []
    },
    tableRow: {
      type: Object,
      default: {}
    },
    variety: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      drawerTitle: '客户流水详情',
      isEdit: true,
      centerDialogVisible: false,
      TenantDTORules: {
        amount: [
          { required: true, message: '请填写流水金额', trigger: 'blur' }
        ],
        recordDate: [
          { required: true, message: '请选择入账时间', trigger: 'blur' }
        ]
      },
      upLoadText: '上传附件',
      fileType: [],
      billsDialogVisible: false,
      tableData: [],
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
      ],
      payTypeLists: [],
      payUserList: [],
      imgArr: [],
      num: 0,
      showPicture: false
    }
  },
  watch: {
    detailsData: {
      handler: function () {
        this.newPipeline()
      }
    }
  },
  created () {
    this.newPipeline()
  },
  methods: {
    formatBillStatus (val) {
      let res = ''
      if (val === 'APPROVAL') {
        res = '减免审核中'
      } else if (val === 'UPDATE') {
        res = '减免驳回待修改'
      } else if (val === 'NO') {
        res = '未付款'
      } else if (val === 'OK') {
        res = '已结清'
      } else if (val === 'SECTION') {
        res = '部分结清'
      } else if (val === 'STAY_SETTLE') {
        res = '待结清'
      }
      return res
    },
    openFlowBankDetails () {
      this.$emit('openFlowBankDetails')
    },
    async querySearch1 (queryString, cb) { // 收款
      // if (!queryString || queryString === '') {
      //   return false
      // }
      let result = await context.http.get('cms/api/tenantPays/beneficiary?query=' + this.detailsData.beneficiaryName)
      cb(result.data)
    },
    async querySearch2 (queryString, cb) { // fu款
      // if (!queryString || queryString === '') {
      //   return false
      // }
      let result = await context.http.get('cms/api/tenantPays/payment?query=' + this.detailsData.beneficiaryName)
      cb(result.data)
    },
    handleSelect (item) {
      this.detailsData.beneficiaryName = item.name // 收款人户名
      this.detailsData.beneficiaryAccount = item.account // 收款人账号
      this.detailsData.beneficiaryBlank = item.blank // 收款开户行
    },
    handleSelect1 (item) {
      this.detailsData.paymentName = item.name // 收款人户名
      this.detailsData.paymentAccount = item.account // 收款人账号
      this.detailsData.paymentBlank = item.blank // 收款开户行
    },
    setFile (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    getPayUserList () {
      if (this.detailsData.tenant && this.detailsData.tenant.id) {
        context.http.get('cms/api/tenantPays/' + this.detailsData.tenant.id).then(res => {
          this.payUserList = res.data.filter(item => {
            return item.payName !== '' && item.payName !== null
          })
        })
      }
    },
    pictureClose () {
      this.showPicture = false
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    onHide (index) {
      this.$emit('drawerClose', false)
      if (index === 1) {
        this.$emit('query', false, index)
      } else {
        this.$emit('query', false)
      }
      this.isEdit = true
    },
    async newPipeline () {
      let result1 = await context.http.get('/uaa/api/paramet-managements/name', { name: '付款方式' })
      this.payTypeLists = result1.data
    },
    paymentMethodChange () {
      let paymentMethodName = ''
      paymentMethodName = this.payTypeLists.filter(item => {
        return item.id === this.detailsData.paymentMethodId
      })
      this.detailsData.paymentMethodName = paymentMethodName[0].value
    },
    handleSelectionChange (val) {
      let billIds = val
      this.billIds = billIds.map(item => {
        return item.id
      })
      console.log(this.billIds)
    },
    onEdit () {
      if (this.detailsData.billAndFlows && this.detailsData.billAndFlows.length > 0) {
        this.$message({
          message: '该流水已匹配账单，不支持修改',
          type: 'warning'
        })
        return
      }
      this.isEdit = false
    },
    getbillsList (id) {
      let tenantId = this.detailsData.tenant ? this.detailsData.tenant.id : ''
      context.http.get('cms/api/bills/nomate', { page: (this.currentPage - 1), size: this.pgSize, sort: 'finalPaymentDate,asc', flowId: id, tenantId: tenantId, billType: this.detailsData.billType }).then(res => {
        this.tableData = res.data
        this.total = Number(res.headers['x-total-count'])
      })
    },
    editFolw () {
      this.$refs['detailsData'].validate((valid) => {
        if (valid) {
          if (this.detailsData.amount < 0) {
            this.$message({
              type: 'error',
              message: '金额不能为负数'
            })
            return
          }
          let _this = this
          context.http.put('/cms/api/billFlows', this.detailsData).then(res => {
            if (res.status === 200) {
              _this.isEdit = true
              _this.$emit('handleEdit', 0, res.data)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    deleteBillFlows () {
      context.http.delete(`/cms/api/billFlows/${this.detailsData.id}`).then(res => {
        if (res.status === 200) {
          this.centerDialogVisible = false
          this.onHide(1)
        }
      })
    },
    confirmMatching () {
      if (this.billIds.length === 0) {
        return
      }
      context.http.post(`cms/api/billFlows/${this.detailsData.id}/mate`, this.billIds).then(res => {
        if (res.status === 200) {
          this.billsDialogVisible = false
          this.$emit('handleEdit', 0, this.detailsData)
        }
      })
    },
    setAnnexs (annexURL, annexName) {
      this.detailsData.annexes.push({ 'annexURL': annexURL, 'annexName': annexName })
    },
    deleFile (item, index) {
      this.detailsData.annexes.splice(index, 1)
    },
    downloadFile (item, index) {
      axios({
        method: 'GET',
        url: '/ywm/api/annex/download',
        params: {
          annexURL: item.annexURL,
          annexName: item.annexName
        },
        responseType: 'blob'
      }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', item.annexName)
        document.body.appendChild(link)
        link.click()
      })
    },
    handleEdit (id, type) {
      if (type === 'DIVERSIFICATION') {
        this.$router.push({ path: '/home/incomeList', query: { billId: id } })
      } else {
        this.$emit('showBill', id)
        // this.$router.push({path: '/home/billList', query: {billId: id}})
      }
    },
    formatBillType (val) {
      return val === 'R' ? '收款' : '付款'
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.getbillsList(this.detailsData.id)
    },
    currentSel () {
      this.currentPage = 1
      this.getbillsList(this.detailsData.id)
    },
    formatMatchState (val) {
      let res = ''
      if (val === 'OK') {
        res = '完全匹配'
      } else if (val === 'SECTION') {
        res = '部分匹配'
      } else {
        res = '未匹配'
      }
      return res
    },
    formatFeeType (val) {
      let feeType
      switch (val) {
        case 'RENT':
          feeType = '租金'
          break
        case 'RENT_DEPOSIT':
          feeType = '租金保证金'
          break
        case 'PROPERTY':
          feeType = '物业费'
          break
        case 'PROPERTY_DEPOSIT':
          feeType = '物业费保证金'
          break
        case 'INTENTION':
          feeType = '意向金'
          break
        case 'DECORATION':
          feeType = '装修保证金'
          break
        case 'F_INTENTION':
          feeType = '返还意向金'
          break
        case 'F_DECORATION':
          feeType = '返还装修保证金'
          break
        case 'WITHDRAWAL':
          feeType = '退租结算'
          break
        case 'RELEASE':
          feeType = '合同解除结算'
          break
      }
      return feeType
    }
  }
}
</script>
<style lang="scss" scoped>
.flow-details {
  .details_content {
    &.drawer-body {
      height: calc(100% - 56px);
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 4px !important;
        height: 4px !important;
      }

      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px #fff;
        background-color: #fff;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 6px #cccccc;
      }
    }
    .bills_head_new {
      li {
        width: 13% !important;
      }
    }
    .bills {
      .bills_body_new {
        li {
          width: 13%;
        }
      }
    }
  }
  .statementBtn {
    > span {
      display: inline-block;
      width: 62px;
      height: 22px;
      line-height: 22px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(53, 119, 246, 1);
      border-radius: 4px;
      color: #4677ee;
      cursor: pointer;
      text-align: center;
    }
  }
  .delBillBtn {
    display: inline-block;
    width: 90px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    background: rgba(210, 59, 47, 0.1);
    border: 1px solid rgba(210, 59, 47, 1);
    border-radius: 4px;
    color: #d92e20;
    cursor: pointer;
  }
}
</style>
<style lang="scss">
.flow-details {
  .drawer-head {
    border-bottom: 1px solid rgba(229, 229, 229, 1);
  }
  .main-content {
    position: relative;
    margin-top: 10px;
    .el-item-preview {
      margin-top: 0 !important;
      > .el-item {
        margin-top: 0 !important;
        > div {
          display: inline-block;
          cursor: pointer;
          .icon-cms_chakan- {
            // color: rgb(0, 92, 179);
          }
        }
      }
    }
    > .el-form {
      margin: 0 15px 12px;
      .part {
        background-color: #fff;
        padding: 0 15px 15px 15px!important;
        zoom:1
      }
      .part:after{
        display:block;
        content:'';
        clear:both;
        height:0;
        overflow:hidden;
      }
    }
    .half_page_title {
      .matchingBills {
        float: right;
        width: 70px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        font-size: 12px;
        color: #3577f6;
        border: 1px solid #7fafe6;
        cursor: pointer;
        border-radius: 4px;
        font-weight: normal;
      }
    }
    .content-info {
      display: inline-block;
      width: 32%;
      margin-top: 20px;
      vertical-align: top;
      div {
        font-size: 14px;
        color: #777777;
        i.required {
          color: red;
        }
        &:last-child {
          font-size: 14px;
          color: #262626;
          margin-top: 6px;
          min-height: 14px;
        }
      }
      .el-form-item__error {
        color: #f56c6c !important;
      }
      .el-form-item {
        margin-bottom: 0;
      }
      .el-select {
        width: 240px;
        height: 40px;
        margin-top: 0 !important;
      }
      .el-input {
        width: 240px;
        // height: 40px;
        margin-top: 0 !important;
      }
      .el-textarea {
        width: 240px;
        height: 40px;
        margin-top: 0 !important;
      }
      textarea {
        width: 240px;
        height: 32px;
      }
      .el-input__inner {
        width: 240px;
      }
      .el-input__inner_with100 {
        .el-input__inner {
          width: 100%;
        }
      }
      .upload {
        position: relative;
        display: inline-block;
        width: 80px !important;
        height: 24px;
        line-height: 23px;
        opacity: 0.9;
        border-radius: 2px;
        font-size: 12px;
        text-align: center;
        // border: 1px solid #0f75ff;
        color: #0f75ff !important;
        border-radius: 4px;
        cursor: pointer;
        .aliUpload {
          width: 100%;
          height: 100%;
          position: absolute;
          right: 0;
          top: 0;
          margin-top: 0;
          .oss_file {
            border: none;
            width: 100%;
            height: 100%;
            input {
              position: absolute;
              right: 0;
              top: 0;
              width: 100%;
              height: 100%;
              opacity: 0;
              cursor: pointer;
            }
          }
        }
      }
    }
    .matched-bills {
      margin: 40px 0 15px;
      height: 26px;
      span {
        display: block;
        line-height: 26px;
        float: left;
      }
      div {
        float: right;
        width: 70px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        font-size: 12px;
        color: #3577f6;
        border: 1px solid #7fafe6;
        cursor: pointer;
        border-radius: 4px;
      }
    }
    .bills {
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(241, 241, 241, 1);
      &.part {
        margin: 0 15px 12px;
        .header {
          height: 70px;
          padding: 0 15px;
          display: flex;
          align-items: center;
          .line {
            width: 2px;
            height: 35px;
            background-color: #f3f3f3;
            margin-right: 10px;
          }
          .content-info1 {
            width: 150px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            font-size: 14px;
            > div {
              &:first-child {
                color: #777777;
              }
              &:last-child {
                margin-top: 10px;
                color: #262626;
              }
            }
          }
        }
        .noData {
          font-size: 12px;
          color: #262626;
          margin: 0 15px;
          text-align: center;
          height: 40px;
          line-height: 40px;
        }
      }
      .bills-head {
        background-color: #f7f8fa;
        color: #777777;
        font-size: 14px;

        li {
          font-size: 12px;
          width: 11%;
          text-align: center;
          height: 30px;
          line-height: 30px;
          overflow: hidden;
        }
      }
      ul {
        display: flex;
        margin: 0 15px;
        &:first-child {
          background: rgba(250, 250, 250, 1);
        }
        li {
          font-size: 12px;
          width: 11%;
          text-align: center;
          height: 50px;
          line-height: 50px;
          &.code {
            font-size: 12px;
            width: 11%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      .ck-btn {
        display: inline-block;
        width: 60px;
        height: 26px;
        line-height: 25px;
        text-align: center;
        border: 1px solid rgba(53, 119, 246, 1);
        border-radius: 4px;
        color: rgba(53, 119, 246, 1);
        cursor: pointer;
      }
    }
    .dialog-footer {
      border-top: 1px solid #e5e5e5;
      padding: 20px 0;
      text-align: right;
      margin-top: 100px;
    }
  }
}
.warnDialog {
  .warnIcon {
    display: block;
    width: 90px;
    height: 90px;
    margin: 20px auto;
  }
  .warnInfo {
    display: block;
    width: 100%;
    text-align: center;
    margin-bottom: 30px;
  }
}
</style>
