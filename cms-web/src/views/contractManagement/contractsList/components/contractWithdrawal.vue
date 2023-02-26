<template>
  <div class="contractWithdrawal">
    <div class="">
      <div class="dl-head info_tab">
        <ul class="nav">
          <li @click="changeNav(index)"
              v-for="(item, index) in navList"
              :key="index"
              :class="item.value ? 'select_active' : ''">{{item.label}}</li>
        </ul>
      </div>
      <div class="dl-content clearfix">
        <el-form :model="addData"
                 ref="addData"
                 :rules="addDataRules">
          <div class="step1"
               v-show="essentialInformation">
            <div class="dc-left float-left"
                 style="display: inline-block;height: 319px">
              <div class="dr-head"
                   style="text-align: left">房源信息</div>
              <div class="basic-select">
                <div class="clearfix selectInput"
                     style="border: none">
                  <img v-if="detailData.projectManagement"
                       :src="detailData.projectManagement.previewImage" />
                  <span v-if="detailData.projectManagement">{{detailData.projectManagement.projectName}}</span>
                </div>
                <div class="bd-number">

                </div>
                <div class="layer"
                     v-for="(item, index) in detailData.rooms"
                     :key="index">
                  <div>
                    <span v-if="item.floor">{{item.floor.name}}层</span>
                    <span>{{item.shopNumber}}室</span>
                    <span>{{item.buildingArea}}m²</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="dc-right float-right"
                 style="width: 68%;display: inline-block">
              <div class="dr-head">退租信息</div>
              <el-form-item :label-width="formLabelWidth"
                            prop="leaseType">
                <div class="cttitle">退租类型<i class="required">*</i></div>
                <el-select v-model="addData.leaseType"
                           @change="rentBill"
                           placeholder="请选择">
                  <el-option v-for="item in withdrawalOptions"
                             :key="item.value"
                             :label="item.name"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;">
                <div class="cttitle">客户名称<i class="required">*</i></div>
                <span v-if="detailData.tenant">{{detailData.tenant.teantName}}</span>
              </el-form-item>
              <el-form-item prop="startDate"
                            :label-width="formLabelWidth"
                            style="margin-bottom: 20px;">
                <div class="cttitle">合同编号</div>
                <span>{{detailData.contractNo}}</span>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            prop="endDate"
                            style="margin-bottom: 20px;">
                <div class="cttitle">退租面积/m²<i class="required">*</i></div>
                <span>{{detailData.area}}</span>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;"
                            prop="handleDate">
                <div class="cttitle">退租办理日期<i class="required">*</i></div>
                <el-date-picker v-model="addData.handleDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            prop="withdrawalDate">
                <div class="cttitle">退租日期<i class="required">*</i></div>
                <el-date-picker v-model="addData.withdrawalDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                @change="rentBill"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth">
                <div class="cttitle">工商注册地址变更时间</div>
                <el-date-picker v-model="addData.businessUpdateDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
            <div style="clear: both"></div>
            <div class="dc-right">
              <div class="dr-head"
                   style="margin-bottom: 0">费用</div>
              <div class="selected-housing bill-details">
                <ul>
                  <li>费用类型</li>
                  <li>计费周期</li>
                  <li>账单类型</li>
                  <li>应收金额/元</li>
                  <li>已收金额/元</li>
                  <li>待收金额/元</li>
                </ul>
                <ul v-for="(item, index) in preRentBill.billDTOS"
                    :key="index">
                  <li>{{item.feeTypeName}}</li>
                  <li>
                    {{item.startDate}}～{{item.endDate}}
                  </li>
                  <li>{{formatterBillType(item.billType)}}</li>
                  <li>{{item.amount}}</li>
                  <li>{{item.receivedAmount}}</li>
                  <li>
                    {{item.settlementAmount}}
                  </li>
                </ul>
                <div class="total">
                  <span>合计：<span>{{preRentBill.totalAmount}}元</span></span>
                </div>
              </div>
            </div>
            <div class="dc-right">
              <div class="dr-head"
                   style="margin-bottom: 0">保证金</div>
              <div class="selected-housing bond-details">
                <ul>
                  <li>保证金类型</li>
                  <li>账单金额/元</li>
                  <li>实收金额/元</li>
                </ul>
                <ul v-for="(item, index) in preRentBill.deposits"
                    :key="index">
                  <li>{{item.feeTypeName}}</li>
                  <li>{{item.amount}}</li>
                  <li>{{item.receivedAmount}}</li>
                </ul>
                <div class="total">
                  <span>合计：<span>{{preRentBill.depositsTotal}}元</span></span>
                </div>
              </div>
            </div>
            <div class="dc-right">
              <div class="dr-head"
                   style="margin-bottom: 20px;">其他费用
                <span class="iconfont icon-add"
                      @click="addOtherExpenses"
                      style="padding-left: 20px;color: #0F75FF;cursor: pointer;"></span>
                <span class="iconfont icon-reduce"
                      @click="reduceOtherExpenses"
                      v-if="addData.otherFeeDTOS.length > 1"
                      style="padding-left: 20px;color: #0F75FF;cursor: pointer;"></span>
              </div>
              <div class="other-expense bond-details">
                <div v-for="(item, index) in addData.otherFeeDTOS"
                     :key="index">
                  <el-form-item :label-width="formLabelWidth"
                                prop="yxContractNo">
                    <div class="cttitle">账单类型</div>
                    <el-select v-model="item.billType"
                               @change="getOtherExpensesBlur(item)"
                               style="width: 100%"
                               placeholder="请选择">
                      <el-option v-for="item in billTypeOptions"
                                 :key="item.value"
                                 :label="item.name"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">费用名称</div>
                    <el-input v-model="item.expenseName"
                              @blur="getOtherExpensesBlur(item)"
                              placeholder="请输入内容"></el-input>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">费用金额</div>
                    <el-input v-model="item.amount"
                              type="number"
                              @blur="getOtherExpensesBlur(item)"
                              placeholder="请输入内容"></el-input>
                  </el-form-item>
                </div>
                <div class="total"
                     style="height: 40px;">
                  <span style="position: relative;top: 10px;">合计：<span>{{otherExpenses}}元</span></span>
                </div>
              </div>
            </div>
            <div class="dc-right">
              <div class="dr-head"
                   style="margin-bottom: 0">费用总计</div>
              <div class="selected-housing total-cost">
                <ul style="border: none">
                  <li>租金结算</li>
                  <li>{{preRentBill.totalAmount}}元</li>
                </ul>
                <ul>
                  <li>保证金结算</li>
                  <li>{{preRentBill.depositsTotal}}元</li>
                </ul>
                <ul>
                  <li>滞纳金结算</li>
                  <li>0元</li>
                </ul>
                <ul>
                  <li>其他费用结算</li>
                  <li>{{otherExpenses}}元</li>
                </ul>
                <div class="total">
                  <span>总计：<span>{{totalCost}}元</span></span>
                </div>
              </div>
            </div>
          </div>
          <div class="step2 dl-content"
               v-show="!essentialInformation">
            <div class="dc-right float-right"
                 style="width: 100%">
              <div class="dr-head"
                   style="margin-bottom: 0">备注</div>
              <div class="other-info">
                <el-input type="textarea"
                          :rows="2"
                          resize="none"
                          v-model="addData.remark">
                </el-input>
              </div>
            </div>
            <div class="dc-right float-right"
                 style="width: 100%;border: none">
              <div class="enclosure">
                <div class="enclosure-head1">附件
                  <aliUpload class="aliUpload"
                             :encrypt="true"
                             :upLoadText="upLoadText"
                             :fileType="fileType"
                             @setAnnex="setAnnex" />
                </div>
                <div class="enclosure-head"
                     style="border-bottom: 1px solid #D8DCE3;background-color:#fff">
                  <span style="width:70%;padding-left: 15px;">文件名</span>
                  <span style="width:28%">操作</span>
                </div>
                <div class="enclosure-list"
                     v-for="(item, index) in addData.annexes"
                     :key="index">
                  <div class="el-item"
                       style="display: flex;">
                    <span style="width:70%;padding-left: 15px;">{{item.annexName}}</span>
                    <span v-if="item.annexName"
                          style="width:28%;display: flex;">
                      <aliDownLoad class="aliDownLoad1"
                                   style="margin-right:15px"
                                   :item="item"
                                   :encrypt="true" />
                      <i @click="deleFile(item, index)"
                         class="iconfont icon-lajixiang"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import contractWithdrawal from './contractWithdrawal.vue'
import aliUpload from '@/components/aliUpload.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
export default {
  name: 'contractWithdrawal',
  components: {
    Drawer,
    aliDownLoad,
    contractWithdrawal,
    aliUpload
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Object,
      default: {
        rooms: [{ 'projectManagement': { 'previewImage': '', 'projectManagement': '' } }],
        rentClauses: [{
          startDate: '',
          endDate: '',
          deposit: '',
          proportion: '',
          month: '',
          dayNumber: '',
          billingType: '',
          yearDay: ''
        }, {
          startDate: '',
          endDate: '',
          deposit: '',
          proportion: '',
          month: '',
          dayNumber: '',
          billingType: '',
          yearDay: ''
        }]
      }
    },
    withdrawalData: {
      type: Object
    },
    withdrawalType: {
    },
    withdrawalVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      upLoadText: '上传附件',
      fileType: [],
      addData: {
        annexes: [],
        otherFeeDTOS: [{ billType: '', expenseName: '', amount: '' }]
      },
      tableData: [{
        name: '123'
      }],
      otherExpenses: 0,
      totalCost: '',
      withdrawalOptions: [{ name: '到期退租', value: 'MATURITY' }, { name: '解除合同', value: 'RELIEVE' }],
      billTypeOptions: [{ name: '收款', value: 'R' }, { name: '付款', value: 'P' }],
      newlystep1: true,
      newlystep2: false,
      essentialInformation: true,
      showLeaseTerms: true,
      showRentIncrements: true,
      showRentConcessions: true,
      showProperty: true,
      withdrawalDialogVisible: false,
      contractBillDialogVisible: false,
      drawerTitle: '合同信息',
      navList: [{ label: '基本信息', value: true }, { label: '其他资料', value: false }],
      formLabelWidth: '',
      documentTypeOptions: [],
      nationalityOptions: [],
      projectList: [],
      selHourse: false,
      selProject: false,
      errorProject: false,
      sexOptions: [
        { name: '男', value: 'MAN' },
        { name: '女', value: 'WOMAN' }
      ],
      addDataRules: {
        leaseType: [
          { required: true, message: '请选择退租类型', trigger: 'change' }
        ],
        handleDate: [
          { required: true, message: '请选择退租办理日期', trigger: 'blur' }
        ],
        withdrawalDate: [
          { required: true, message: '请选择退租日期', trigger: 'blur' }
        ]
      },
      showRemarks: false,
      showEnclosure: false,
      preRentBill: {}
    }
  },
  watch: {
    detailData: {
      handler: function () {
      }
    },
    withdrawalVisible: {
      handler: function () {
        if (this.withdrawalVisible) {
          let withdrawalType = this.withdrawalType
          if (withdrawalType === 'add') {
            this.addData = {
              annexes: [],
              otherFeeDTOS: [{ billType: '', expenseName: '', amount: '' }]
            }
            this.preRentBill = {}
            this.totalCost = 0
            this.otherExpenses = 0
          }
        }
      }
    },
    withdrawalType: {
      handler: function () {
        let taskId = this.$route.query.taskId
        let withdrawalType = this.withdrawalType
        if (taskId && withdrawalType === 'edit') {
          this.addData = this.withdrawalData
          this.rentBill()
        } else {
          this.addData = {
            annexes: [],
            otherFeeDTOS: [{ billType: '', expenseName: '', amount: '' }]
          }
          this.preRentBill = {}
          this.totalCost = 0
          this.otherExpenses = 0
        }
      }
    }
  },
  mounted () {
    let taskId = this.$route.query.taskId
    let withdrawalType = this.withdrawalType
    if (taskId && withdrawalType === 'edit') {
      this.addData = this.withdrawalData
      this.rentBill()
    }
  },
  methods: {
    onHide () {
      this.$emit('drawerClose', false)
      this.$emit('query', false)
      this.readonly = true
    },
    changeNav (inx) {
      this.navList.forEach(item => {
        item.value = false
      })
      this.navList[inx].value = true
      if (inx === 0) {
        this.essentialInformation = true
      } else if (inx === 1) {
        this.essentialInformation = false
      }
    },
    getOtherExpensesBlur (item) {
      if (item.billType && item.amount && item.expenseName) {
        this.getOtherExpenses()
      }
    },
    getOtherExpenses () {
      let otherExpenses = 0
      this.addData.otherFeeDTOS.forEach(ele => {
        let amount = ''
        if (ele.billType === 'P') {
          amount = -Number(ele.amount)
        } else {
          amount = Number(ele.amount)
        }
        otherExpenses += Number(amount)
      })
      this.otherExpenses = otherExpenses
      this.getTotalCost()
    },
    setAnnex (annexURL, annexName) {  // 子组件上传成功返回文件url 和名字
      this.addData.annexes.push({
        'annexName': annexName,
        'annexURL': annexURL
      })
    },
    imageChange (event) {
      let files = event.target.files
      let form = new FormData()
      form.append('file', files[0])
      let name = files[0].name
      event.target.value = ''
      context.http.post('/ywm/api/image-multipart', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
        this.$set(this.addData, 'annexName', name)
        this.$set(this.addData, 'annexURL', res.data)
      }).catch(error => {
        console.info(error)
      })
    },
    addIntentionContracts () {
    },
    addOtherExpenses () {
      this.addData.otherFeeDTOS.push({ billType: '', expenseName: '', amount: '' })
    },
    reduceOtherExpenses () {
      this.addData.otherFeeDTOS.pop()
      this.getOtherExpenses(this.addData.otherFeeDTOS[this.addData.otherFeeDTOS.length - 1])
      // this.getTotalCost()
    },
    getTotalCost () {
      let totalCost = (this.preRentBill.totalAmount ? this.preRentBill.totalAmount : 0) + (this.preRentBill.depositsTotal ? this.preRentBill.depositsTotal : 0) + this.otherExpenses
      this.totalCost = totalCost.toFixed(2)
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
    deleFile (item, index) {
      this.addData.annexes.splice(index, 1)
    },
    rentBill () {
      if (!this.addData.leaseType || !this.addData.withdrawalDate) {
        return
      }
      let withdrawalDate = this.addData.withdrawalDate
      let d = new Date(withdrawalDate)
      let getMonth = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)
      let getDate = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
      var times = d.getFullYear() + '-' + (getMonth) + '-' + getDate
      context.http.get('/cms/api/history-bills/lease', { contractId: this.detailData.id, leaseType: this.addData.leaseType, withdrawalDate: times }).then(res => {
        this.preRentBill = res.data
        this.getOtherExpenses()
      })
    },
    initiateApproval () {
      let taskId = this.$route.query.taskId
      this.$refs['addData'].validate((valid) => {
        if (valid) {
          let contractDTO = this.detailData
          this.addData.contractDTO = contractDTO
          this.addData.handleDate = this.DateFormat(this.addData.handleDate)
          this.addData.withdrawalDate = this.DateFormat(this.addData.withdrawalDate)
          if (this.addData.otherFeeDTOS && this.addData.otherFeeDTOS.lenght > 0 && this.addData.otherFeeDTOS[0].amount === '') {
            this.addData.otherFeeDTOS = null
          }
          let otherFeeDTOS = this.addData.otherFeeDTOS
          for (let index = 0; index < otherFeeDTOS.length; index++) {
            if (otherFeeDTOS[index].billType === '' || otherFeeDTOS[index].expenseName === '' || otherFeeDTOS[index].billType.amount === '') {
              otherFeeDTOS.splice(index, 1)
            }
          }
          let _this = this
          let taskId = this.$route.query.taskId
          let withdrawalType = this.withdrawalType
          if (taskId && withdrawalType === 'edit') {
            this.addData.taskId = taskId
            context.http.put('/cms/api/lease-contracts', this.addData).then(res => {
              if (res.status === 200) {
                _this.$emit('withdrawalClose')
                _this.$emit('onHide')
              }
            })
          } else {
            this.addData.withdrawalDate = this.addData.withdrawalDate.substring(0, 10)
            context.http.post('/cms/api/lease-contracts', this.addData).then(res => {
              if (res.status === 201) {
                _this.$emit('withdrawalClose')
                _this.$emit('onHide')
              }
            })
          }
        } else {
          this.changeNav(0)
          console.log('error submit!!')
          return false
        }
      })
    },
    formatterBillType (val) {
      return val === 'R' ? '收款' : '付款'
    },
    DateFormat (time) {
      var d = new Date(time)
      let getMonth = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)
      let getDate = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
      var times = d.getFullYear() + '-' + (getMonth) + '-' + getDate
      return times
    },
    formatterFeeType (val) {
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
<style lang="scss">
.contractWithdrawal {
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
      margin: 20px auto 0;
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
  .enclosure-list {
    i {
      cursor: pointer;
    }
  }
  .contract-bill {
    .el-dialog {
      width: 1000px;
    }
    .el-dialog__body {
      border-bottom: none;
    }
    .el-table {
      border: 1px solid rgba(241, 241, 241, 1);
    }
    .amount {
      > div {
        display: inline-block;
        margin: 20px 60px 20px 0;
        p {
          &:first-child {
            margin-bottom: 10px;
            color: #7085a1;
          }
        }
      }
    }
    .export {
      position: absolute;
      right: 35px;
      top: 23px;
      color: #0f75ff;
      cursor: pointer;
      span {
        color: #0f75ff;
      }
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
.contractWithdrawal {
  position: relative;
  .dl-head {
    margin-top: 10px;
  }
  .info_tab {
    height: 48px;
    display: -ms-flexbox;
    display: flex;
    background-color: #fff;
    margin: 10px 0 0px 0;
    box-shadow: 1px 2px 5px #eee;
    border-radius: 3px;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -ms-flex-align: center;
    align-items: center;
    padding-right: 44px;
    border-bottom: 1px solid #ecedef;
    .nav {
      display: -ms-flexbox;
      display: flex;
      li.select_active {
        border-bottom: 2px solid #3175d2;
        color: #3175d2;
        font-weight: bolder;
      }
      li {
        width: 140px;
        text-align: center;
        font-size: 14px;
        color: #666;
        height: 46px;
        line-height: 46px;
        border-bottom: 2px solid #fff;
        cursor: pointer;
      }
    }
  }
  .dialog-footer {
    border-top: 1px solid #e5e5e5;
    padding: 20px 0;
    text-align: right;
    margin-top: 0;
    margin-right: 38px;
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
        .el-textarea {
          height: 100px;
          width: 100%;
          margin: 0 auto;
          .el-textarea__inner {
            border: none;
            height: 100px;
          }
        }
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
    .enclosure-head1 {
      position: relative;
      background-color: #fafafa;
      height: 40px;
      line-height: 40px;
      padding-left: 12px;
      .aliUpload {
        position: absolute;
        right: 8px;
        top: 5px;
      }
    }
    .enclosure-head {
      position: relative;
      background-color: #fafafa;
      height: 40px;
      line-height: 40px;
      padding-left: 12px;
      span {
        display: inline-block;
        width: 48%;
        padding-left: 40px;
      }
      .upload {
        position: relative;
        float: right;
        display: inline-block;
        width: 60px;
        height: 24px;
        line-height: 23px;
        opacity: 0.9;
        border-radius: 2px;
        font-size: 12px;
        text-align: center;
        border: 1px solid #0f75ff;
        color: #0f75ff;
        border-radius: 4px;
        margin: 8px;
        cursor: pointer;
        background: #fff;
      }
    }
    .el-item {
      height: 30px;
      line-height: 30px;
      span {
        display: inline-block;
        width: 48%;
        padding-left: 40px;
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
        font-size: 14px;
        margin-bottom: 20px;
      }
      .basic-select {
        width: 100%;
        .bd-number {
          text-align: left;
          height: 20px;
          line-height: 20px;
          padding-left: 32px;
          background: #fafafa;
        }
        .layer {
          font-size: 14px;
          div {
            padding: 12px 0 0 0;
            span {
              display: inline-block;
              width: 32%;
              vertical-align: top;
            }
          }
        }
      }
    }
    .tenantinfo {
      .el-form-item {
        width: 29% !important;
        margin-right: 0;
      }
    }
    .cttitle + span {
      display: inline-block;
      height: 40px;
      line-height: 40px;
    }
    .dc-right {
      border: 1px solid #e7e7e7;
      margin-top: 20px;
      .dr-head {
        background-color: #fafafa;
        height: 40px;
        line-height: 40px;
        padding-left: 12px;
        font-size: 14px;
        margin-bottom: 20px;
      }
      .el-form-item {
        display: inline-block;
        width: 29%;
        margin-left: 16px;
        margin-right: 10px;
        &:nth-of-type(3n) {
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
  }
  .selected-housing {
    margin-bottom: 15px;
    font-size: 12px;
    span {
      display: inline-block;
      // width: 19%;
      padding-left: 40px;
    }
    ul {
      display: flex;
      &:first-child {
        border-bottom: 1px solid #e7e7e7;
      }
      li {
        width: 20%;
        height: 30px;
        line-height: 30px;
        text-align: center;
      }
    }
    input {
      border: 1px solid rgba(231, 231, 231, 1);
      border-radius: 4px;
    }
    .cttitle {
      display: inline-block;
      width: 30%;
      padding-left: 20px;
      margin-bottom: 20px;
      div {
        padding-top: 10px;
      }
    }
  }
  .total {
    border-top: 1px solid #f6f6f6;
    text-align: right;
    span {
      padding: 10px 46px 0 0;
      span {
        color: #cb444a;
      }
    }
  }
  .bill-details {
    ul {
      &:first-child {
        li {
          height: 40px;
          line-height: 40px;
        }
      }
    }
  }
  .bond-details {
    li {
      width: 30% !important;
      &:first-child {
        padding-left: 40px;
        text-align: left !important;
      }
      &:last-child {
        text-align: right !important;
      }
    }
  }
  .total-cost {
    li {
      &:first-child {
        width: 85% !important;
        padding-left: 40px;
      }
      &:last-child {
        width: 15% !important;
      }
      text-align: left !important;
    }
  }
}
</style>
