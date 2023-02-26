<template>
  <div class="foodMarketDetails">
    <drawer class="drawer_new"
            :show="detailsdrawershow"
            :showEditBtn="readOnly && hasAuthority('02050704')"
            @on-edit="onEdit"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="details_content drawer-body"
           slot="drawer">
        <div class="main_content"
             style="height:100%;padding:0;background-color: #F7F7F7;">
          <el-form :model="draweDetaileData"
                   :rules="addFlowRules"
                   ref="draweDetaileData">
            <div class="half_page_title"
                 style="width:100%">
              <div><i></i>基本信息</div>
            </div>
            <div class="contentItem">
              <el-form-item class="item">
                <span>项目简称<i class="required">*</i></span>
                <p>{{draweDetaileData.projectRef}}</p>
              </el-form-item>
              <el-form-item class="item">
                <span>追溯云账号</span>
                <p v-if="readOnly">{{draweDetaileData.tracedUserName}}</p>
                <el-input v-model="draweDetaileData.tracedUserName"
                          maxlength="20"
                          v-else
                          size="small"></el-input>
              </el-form-item>
              <el-form-item class="item">
                <span>追溯云密码</span>
                <p v-if="readOnly">{{draweDetaileData.tracedPassWord}}</p>
                <el-input v-model="draweDetaileData.tracedPassWord"
                          maxlength="20"
                          v-else
                          size="small"></el-input>
              </el-form-item>
              <el-form-item class="item">
                <span>开通线上售卖</span>
                <p v-if="readOnly">{{draweDetaileData.onLineSell?'是':'否'}}</p>
                <el-select v-model="draweDetaileData.onLineSell"
                           size="small"
                           v-else
                           style="width:100%">
                  <el-option label="是"
                             :value="true"></el-option>
                  <el-option label="否"
                             :value="false"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="width:100%"
                            v-if="draweDetaileData.lockScreenPicture.length||!readOnly"
                            class="item">
                <span>智慧称锁屏图片</span>
                <div style="display:flex;flex-wrap: wrap;">
                  <template v-if="draweDetaileData.lockScreenPicture.length">
                    <div v-for="(item,index) in draweDetaileData.lockScreenPicture"
                         :key="index"
                         style="width:140px;height:120px;margin-bottom:15px"
                         class="imgBox imgBoxModel">
                      <img :src="item"
                           style="object-fit: cover;"
                           @click="showImg(item)"
                           class="logoImg">
                      <div @click="showImg(item)"
                           class="bottomTips">预览图片</div>
                      <div class="iconfont icon-cms_cuowu deleteImg"
                           v-if="!readOnly"
                           @click="deleLogo(index)"></div>
                    </div>
                  </template>

                  <aliUpload class="aliUpload deviceDetails aliUpload_new"
                             style="width:140px;height:120px"
                             :upLoadText="upLoadText_cost"
                             :fileType="fileType_cost"
                             :iconShow="false"
                             :iconImg="iconImg"
                             :uploadIcon="true"
                             v-if="draweDetaileData.lockScreenPicture.length<5 && !readOnly"
                             @setAnnex="setAnnex" />
                </div>
                <div class="tips">（最多可上传5张，建议尺寸：1366*768像素；支持格式JPG,PNG）</div>
              </el-form-item>
            </div>
            <div class="half_page_title"
                 v-if="draweDetaileData.onLineSell"
                 style="width:100%">
              <div><i></i>配送设置</div>
            </div>
            <div class="contentItem"
                 v-if="draweDetaileData.onLineSell">
              <el-form-item prop="name"
                            class="item">
                <span>线上菜场名称<i class="required">*</i></span>
                <p v-if="readOnly">{{draweDetaileData.name}}</p>
                <el-input v-model="draweDetaileData.name"
                          v-else
                          size="small"></el-input>
              </el-form-item>
              <!-- <el-form-item prop="splitAccount"
                            class="item">
                <span>分账接收账号<i class="required">*</i></span>
                <p v-if="readOnly">{{draweDetaileData.splitAccount}}</p>
                <el-input v-model="draweDetaileData.splitAccount"
                          v-else
                          size="small"></el-input>
              </el-form-item> -->
              <el-form-item prop="distributionFee"
                            class="item">
                <span>配送费（元）<i class="required">*</i></span>
                <p v-if="readOnly">{{draweDetaileData.distributionFee}}</p>
                <el-input type="number"
                          v-else
                          @input="clearNoNum('distributionFee')"
                          v-model="draweDetaileData.distributionFee"
                          size="small">
                </el-input>
              </el-form-item>
              <el-form-item prop="maxOrderNumber"
                            class="item">
                <span>每半小时最多接单数量（单）<i class="required">*</i></span>
                <p v-if="readOnly">{{draweDetaileData.maxOrderNumber}}</p>
                <el-input type="number"
                          onkeyup="value=value.replace(/[^0-9]/g,'')"
                          onpaste="value=value.replace(/[^0-9]/g,'')"
                          oncontextmenu="value=value.replace(/[^0-9]/g,'')"
                          v-else
                          v-model="draweDetaileData.maxOrderNumber"
                          size="small">
                  <!-- <template slot="suffix">单</template> -->
                </el-input>
              </el-form-item>
              <el-form-item prop="startEndTime"
                            class="item">
                <span>配送起止时间<i class="required">*</i></span>
                <p v-if="readOnly">{{formarTime(draweDetaileData.distributionStartTime,draweDetaileData.distributionEndTime)}}</p>
                <div style="display: flex; align-items: center;justify-content: space-between;"
                     v-else>
                  <el-time-select v-model="draweDetaileData.startTime"
                                  style="width:130px"
                                  size="small"
                                  :picker-options="{start: '00:00',step: '00:30',end: '23:59'}"
                                  placeholder="选择时间">
                  </el-time-select>
                  <span> - </span>
                  <el-time-select v-model="draweDetaileData.endTime"
                                  style="width:130px"
                                  size="small"
                                  :picker-options="{start: '00:00',step: '00:30',end: '23:59'}"
                                  placeholder="选择时间">
                  </el-time-select>
                </div>
              </el-form-item>
              <el-form-item prop="customerServiceTelphone"
                            class="item">
                <span>客服电话<i class="required">*</i></span>
                <p v-if="readOnly">{{draweDetaileData.customerServiceTelphone}}</p>
                <el-input v-model="draweDetaileData.customerServiceTelphone"
                          v-else
                          size="small"></el-input>
              </el-form-item>
              <el-form-item prop="autoCancelTime"
                            class="item">
                <span>自动取消订单时间（分钟）<i class="required">*</i></span>
                <p v-if="readOnly">{{draweDetaileData.autoCancelTime}}分钟</p>
                <el-input v-else
                          type="number"
                          onkeyup="value=value.replace(/[^0-9]/g,'')"
                          onpaste="value=value.replace(/[^0-9]/g,'')"
                          oncontextmenu="value=value.replace(/[^0-9]/g,'')"
                          v-model="draweDetaileData.autoCancelTime"
                          size="small">
                  <!-- <template slot="suffix">分钟</template> -->
                </el-input>
              </el-form-item>
              <el-form-item prop="startGiveFee"
                            class="item">
                <span>起送费（元）<i class="required">*</i></span>
                <p v-if="readOnly">{{draweDetaileData.startGiveFee}}</p>
                <el-input type="number"
                          v-else
                          @input="clearNoNum('startGiveFee')"
                          v-model="draweDetaileData.startGiveFee"
                          size="small">
                </el-input>
              </el-form-item>
              <el-form-item class="item">
                <span>限时优惠起止时间</span>
                <p v-if="readOnly && detailsdrawershow">{{formarTime1(draweDetaileData.discountStartTime,draweDetaileData.discountEndTime)}}</p>
                <div style="display: flex; align-items: center;justify-content: space-between;"
                     v-else>
                  <el-time-select v-model="draweDetaileData.discountStartTime"
                                  style="width:130px"
                                  size="small"
                                  :picker-options="{start: '00:00',step: '00:30',end: '23:59'}"
                                  placeholder="选择时间">
                  </el-time-select>
                  <span> - </span>
                  <el-time-select v-model="draweDetaileData.discountEndTime"
                                  style="width:130px"
                                  size="small"
                                  :picker-options="{start: '00:00',step: '00:30',end: '23:59'}"
                                  placeholder="选择时间">
                  </el-time-select>
                </div>
              </el-form-item>
              <el-form-item class="item"></el-form-item>
            </div>

            <div class="half_page_title"
                 v-if="draweDetaileData.onLineSell"
                 style="width:100%;margin-top:15px">
              <div><i></i>配送范围</div>
              <span class="addWeixiu"
                    v-if="!readOnly"
                    @click="showAddAddress"
                    style="color: #00b362;cursor: pointer;font-weight: normal;font-size: 14px;">
                <i class="iconfont icon-crm_xinzeng-"></i>
                <a style="text-decoration: underline;">添加小区</a>
              </span>
            </div>
            <div class="addAddressContent"
                 v-if="draweDetaileData.onLineSell">
              <p style="font-size: 14px; color: #777777;">配送小区<i class="required">*</i></p>
              <div class="addressList">
                <el-tag v-for="(item,index) in draweDetaileData.marketDistributionScopes"
                        :key="item.poiaddress"
                        @close="delAddress(item,index)"
                        :closable="!readOnly">
                  {{item.poiname}}
                </el-tag>
              </div>
            </div>
            <div class="half_page_title"
                 v-if="draweDetaileData.onLineSell"
                 style="width:100%">
              <div><i></i>分账配置</div>
            </div>
            <div class="contentItem"
                 v-if="draweDetaileData.onLineSell">
              <div class="ali">
                <div>
                  <svg t="1628148427422"
                       class="icon iconColor"
                       viewBox="0 0 1024 1024"
                       version="1.1"
                       xmlns="http://www.w3.org/2000/svg"
                       p-id="31692"
                       width="200"
                       height="200">
                    <path d="M170.667 831.99966667h682.666v56.89H170.667z m312.889-312.889l-142.223-147.91-39.822 39.822 187.733 193.422 250.312-307.2-45.512-39.822z"
                          fill="#87D068"
                          p-id="31693"></path>
                    <path d="M56.889 92.44466667v682.666H967.11V92.44466667H56.89z m853.333 625.778H113.778v-568.89h796.444v568.89z"
                          fill="#87D068"
                          p-id="31694"></path>
                  </svg>
                  <span>微信电商收付通</span>
                </div>
                <div class="set">
                  <span @click="PaymentApplicationShow = true"
                        v-if="!accountDetails.applymentState">申请</span>
                  <span @click="accountDetailsShow = true"
                        v-else>查看</span>
                  <!-- <el-switch v-model="ONLINE_PAY.useStatus"
                         :disabled="accountDetails.applymentState !== 'FINISH'"
                         @change="useStatusChange('ONLINE_PAY', ONLINE_PAY.useStatus,  ONLINE_PAY.id)"
                         class="switch"
                         active-value="USING"
                         inactive-value="DISABLE"
                         active-color="#91CF48"
                         inactive-color="#EAECF0">
              </el-switch> -->
                </div>
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <div slot="footer"
           v-if="!readOnly"
           class="dialog-footer">
        <span @click="onHide"
              class="details_cannelBtn"
              style="background:none">取消</span>
        <span class="saveSubmit"
              @click="save()">保存</span>
      </div>
    </drawer>

    <!-- 微信收付通申请 -->
    <el-dialog title="电商收付通申请"
               :visible.sync="PaymentApplicationShow"
               :append-to-body="true"
               :close-on-click-modal="false"
               class="paymentApplicationDialog"
               width="900px">
      <payment-application @closePaymentDialog="closePaymentDialog"
                           :projectManagementId="draweDetaileData.projectManagementId"
                           ref="accountDetails"></payment-application>
    </el-dialog>
    <!-- 账户详情 -->
    <drawer class="drawer_new"
            :show="accountDetailsShow"
            title="账户详情"
            @on-hide="accountDetailsShow = false">
      <div class="details_content drawer-body"
           slot="drawer">
        <div class="main_content">
          <el-form class="account-detail-form">
            <div class="item">
              <el-form-item>
                <span>申请进度</span>
                <div>{{applymentStateFormater(accountDetails.applymentState)}}</div>
              </el-form-item>
            </div>
            <div class="item"
                 v-if="accountDetails.applymentState === 'ACCOUNT_NEED_VERIFY'">
              <el-form-item>
                <span>账户验证二维码<i class="required">*</i></span>
                <div>
                  <img :src="'data:img/jpg;base64,' + accountDetails.legalValidationUrl"
                       style="width: 200px;" />
                  <p class="tips">(提示：请使用微信扫码验证)</p>
                </div>
              </el-form-item>
            </div>
            <div class="item"
                 v-if="accountDetails.applymentState === 'NEED_SIGN'">
              <el-form-item>
                <span>签约二维码</span>
                <div>
                  <img :src="'data:img/jpg;base64,' + accountDetails.signUrl"
                       style="width: 200px;" />
                  <p class="tips">(提示：请使用微信扫码验证)</p>
                </div>
              </el-form-item>
            </div>
            <div class="item"
                 v-if="accountDetails.applymentState === 'REJECTED'">
              <el-form-item>
                <span>驳回原因</span>
                <div>{{accountDetails.rejectReason}}</div>
              </el-form-item>
            </div>
            <template v-if="accountDetails.applymentState === 'FINISH'">
              <div class="item">
                <el-form-item>
                  <span>账户类型</span>
                  <div>{{accountDetails.bankAccountType === 'PUBLIC' ? '对公账户' : '对私账户'}}</div>
                </el-form-item>
              </div>
              <div class="item">
                <el-form-item>
                  <span>开户名称</span>
                  <div>{{accountDetails.accountName}}</div>
                </el-form-item>
              </div>
              <div class="item">
                <el-form-item>
                  <span>开户银行</span>
                  <div>{{accountDetails.accountBank}}</div>
                </el-form-item>
              </div>
              <div class="item">
                <el-form-item>
                  <span>开户支行</span>
                  <div>{{accountDetails.bankName}}</div>
                </el-form-item>
              </div>
              <div class="item">
                <el-form-item>
                  <span>银行账号</span>
                  <div>{{accountDetails.accountNumber}}</div>
                </el-form-item>
              </div>
            </template>
          </el-form>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <!-- <span @click="onHide2"
              class="details_cannelBtn">取消</span> -->
        <span class="saveSubmit"
              v-if="accountDetails.applymentState === 'REJECTED'"
              @click="reapply">重新申请</span>
      </div>
    </drawer>
    <!-- 图片预览 -->
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
  </div>
</template>

<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import moment from 'moment'
import axios from 'axios'
import * as JSOG from 'jsog'
import PaymentApplication from '../../operationManagement/components/PaymentApplication.vue'
import aliUpload from '@/components/aliUpload.vue'
import picturePrevie from '@/components/picturePrevie.vue'
const applymentStateMap = {
  'CHECKING': '资料校验中',
  'ACCOUNT_NEED_VERIFY': '待账户验证',
  'AUDITING': '审核中',
  'REJECTED': '已驳回',
  'NEED_SIGN': '待签约',
  'FINISH': '完成',
  'FROZEN': '已冻结'
}
export default {
  name: 'foodMarketDetails',
  components: {
    Drawer,
    PaymentApplication,
    aliUpload,
    picturePrevie
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    draweDetaileData: {
      type: Object,
      default: {
        lockScreenPicture: []
      }
    }
  },
  created () {
    this.projectOptions = this.$store.state.projectManagementsList
    // console.log(this.projectOptions)
  },
  watch: {
    detailsdrawershow: {
      handler (newValue, oldValue) {
        if (newValue) {
          if (this.draweDetaileData.distributionStartTime && this.draweDetaileData.distributionEndTime) {
            let s = moment(this.draweDetaileData.distributionStartTime).format('HH:mm')
            let e = moment(this.draweDetaileData.distributionEndTime).format('HH:mm')
            this.$set(this.draweDetaileData, 'startTime', s)
            this.$set(this.draweDetaileData, 'endTime', e)
          }
          if (this.draweDetaileData.discountStartTime && this.draweDetaileData.discountStartTime) {
            this.$set(this.draweDetaileData, 'discountStartTime', this.draweDetaileData.discountStartTime.slice(0, 5))
            this.$set(this.draweDetaileData, 'discountEndTime', this.draweDetaileData.discountEndTime.slice(0, 5))
          }
          this.getMerchantApply()
        }
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    var startEndTime = (rule, value, callback) => {
      if (!this.draweDetaileData.startTime || !this.draweDetaileData.endTime) {
        return callback(new Error('请选择配送开始结束时间'))
      } else {
        callback()
      }
    }
    var startGiveFee = (rule, value, callback) => {
      if (this.draweDetaileData.startGiveFee === '' || !this.draweDetaileData.startGiveFee) {
        return callback(new Error('请输入起送费'))
      } else if (this.draweDetaileData.startGiveFee === 0) {
        return callback(new Error('起送费必须大于0'))
      } else {
        callback()
      }
    }
    var discountStartEndTime = (rule, value, callback) => {
      if (!this.draweDetaileData.discountStartTime || !this.draweDetaileData.discountEndTime) {
        return callback(new Error('请选择限时优惠起止时间'))
      } else {
        callback()
      }
    }
    var checkPhone = (rule, value, callback) => {
      let regPone = null
      let mobile = /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/ // 最新16手机正则
      let tel = /^((0\d{2,3}-\d{4,8})|(1[3584]\d{9}))$/ // 座机
      if (value !== null && value.charAt(0) === '0') { // charAt查找第一个字符方法，用来判断输入的是座机还是手机号
        regPone = tel
      } else if (value !== null && value.charAt(0) !== '0') {
        regPone = mobile
      }
      if (regPone === null) {
        return callback(
          new Error('请输入电话')
        )
      } else if (!regPone.test(value)) {
        return callback(
          new Error("输入正确的电话格式,座机格式'区号-座机号码'")
        )
      } else {
        callback()
      }
    }
    return {
      iconImg: 'icon-shangchuantupianicon',
      upLoadText_cost: '上传图片',
      fileType_cost: ['png', 'jpg'],
      showPicture: false,
      imgArr: [],
      num: 0,
      accountDetailsShow: false,
      PaymentApplicationShow: false,
      accountDetails: {},
      showTips: false,
      readOnly: true,
      fileSize: 2,
      tableData: [],
      projectManagementId: '',
      projectOptions: [],
      drawerTitle: '菜场详情',
      addFlowRules: {
        projectManagementId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入线上菜场名称', trigger: 'blur' }
        ],
        // splitAccount: [
        //   { required: true, message: '请输入分账接受账号', trigger: 'blur' }
        // ],
        startEndTime: [
          { validator: startEndTime, trigger: 'change' }
        ],
        distributionStartTime: [
          { validator: startEndTime, trigger: 'change' }
        ],
        discountStartEndTime: [
          { validator: discountStartEndTime, trigger: 'change' }
        ],
        maxOrderNumber: [
          { required: true, message: '请输入半小时最多接单数量', trigger: 'blur' }
        ],
        distributionFee: [
          { required: true, message: '请输入配送费', trigger: 'blur' }
        ],
        startGiveFee: [
          { required: true, validator: startGiveFee, trigger: 'blur' }
        ],
        customerServiceTelphone: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ],
        autoCancelTime: [
          { required: true, message: '请输入自动取消订单时间', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {

  },
  methods: {
    deleLogo (index) {
      this.draweDetaileData.lockScreenPicture.splice(index, 1)
    },
    setAnnex (annexURL, annexName) {
      this.draweDetaileData.lockScreenPicture.push(annexURL)
    },
    delPreviewImage () {
      this.projectDetail.previewImage = ''
    },
    showImg (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    pictureClose () {
      this.showPicture = false
    },
    save () {
      this.$refs['draweDetaileData'].validate((valid) => {
        if (valid) {
          let params = {}
          if (this.draweDetaileData.onLineSell) {
            let curTime = moment().format('YYYY-MM-DD')
            // 配送时间
            this.draweDetaileData.distributionStartTime = curTime + 'T' + this.draweDetaileData.startTime + ':00.000Z'
            this.draweDetaileData.distributionEndTime = curTime + 'T' + this.draweDetaileData.endTime + ':00.000Z'
            let isAfter = moment(this.draweDetaileData.distributionEndTime).isAfter(this.draweDetaileData.distributionStartTime, 'minute')
            // 优惠时间
            let s = curTime + 'T' + this.draweDetaileData.discountStartTime + ':00.000Z'
            let e = curTime + 'T' + this.draweDetaileData.discountEndTime + ':00.000Z'
            let isAfter1 = moment(e).isAfter(s, 'minute')
            if (!isAfter) {
              this.$message.error('配送结束时间必须大于配送开始时间')
              return
            }
            if (this.draweDetaileData.discountStartTime && !this.draweDetaileData.discountEndTime || !this.draweDetaileData.discountStartTime && this.draweDetaileData.discountEndTime) {
              this.$message.error('请选择完整优惠起止时间')
              return
            }
            if (this.draweDetaileData.discountStartTime && this.draweDetaileData.discountEndTime && !isAfter1) {
              this.$message.error('限时优惠结束时间必须大于限时优惠开始时间')
              return
            }
            if (!this.draweDetaileData.marketDistributionScopes.length) {
              this.$message.error('请选择配送小区')
              return
            }
            params = this.draweDetaileData
          } else {
            params.projectManagementId = this.draweDetaileData.projectManagementId
            params.tracedUserName = this.draweDetaileData.tracedUserName
            params.tracedPassWord = this.draweDetaileData.tracedPassWord
            params.lockScreenPicture = this.draweDetaileData.lockScreenPicture
            params.onLineSell = this.draweDetaileData.onLineSell
          }
          context.http.put(`ord/api/marketConfigs`, this.draweDetaileData).then(res => {
            if (res) {
              this.$message.success('修改成功')
              this.$emit('query')
              this.onHide()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showAddAddress () {
      this.$emit('showAddAddress')
    },
    delAddress (item, index) {
      this.draweDetaileData.marketDistributionScopes.splice(index, 1)
    },
    addaddAddressClose () {
      this.addAddressVisible = false
    },
    applymentStateFormater (val) {
      return applymentStateMap[val]
    },
    closePaymentDialog () {
      this.PaymentApplicationShow = false
      this.getMerchantApply()
    },
    async getMerchantApply () {
      let res = await context.http.get('pay/api/merchantApply/detail/project', { projectManagementId: this.draweDetaileData.projectManagementId })
      this.accountDetails = res.data
      // this.accountDetails.applymentState = 'NEED_SIGN'
      // if (this.accountDetails.applymentState === 'NEED_SIGN') {
      //   this.getQRCode(this.accountDetails.signUrl, 'signUrl')
      // } else if (this.accountDetails.applymentState === 'ACCOUNT_NEED_VERIFY') {
      //   this.getQRCode(this.accountDetails.legalValidationUrl, 'legalValidationUrl')
      // }
    },
    reapply () {
      this.PaymentApplicationShow = true
      this.$nextTick(() => {
        this.$refs.accountDetails.REJECTED_handler(this.accountDetails)
      })
    },
    clearNoNum (key) {
      this.$nextTick(() => {
        let obj = this.draweDetaileData[key]
        obj = obj.replace(/[^\d.]/g, '')  // 清除“数字”和“.”以外的字符
        obj = obj.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        obj = obj.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        // eslint-disable-next-line no-useless-escape
        obj = obj.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')// 只能输入两个小数
        if (obj.indexOf('.') < 0 && obj !== '') { // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          obj = parseFloat(obj)
        }
        this.draweDetaileData[key] = obj
      })

      // this.value = obj
    },
    formarTime (startTime, endTime) {
      if (startTime && endTime) {
        let s = moment(startTime).format('HH:mm')
        let e = moment(endTime).format('HH:mm')
        return s + '~' + e
      } else {
        return '-'
      }
    },
    formarTime1 (startTime, endTime) {
      if (startTime && endTime) {
        let s = startTime.slice(0, 5)
        let e = endTime.slice(0, 5)
        return s + '~' + e
      } else {
        return '-'
      }
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    onHide () {
      this.readOnly = true
      this.showTips = false
      this.$emit('drawerClose', false)
      this.$refs['draweDetaileData'].resetFields()
    },
    onEdit () {
      this.readOnly = false
    },
    getQRCode (url, type) {
      axios({ method: 'GET', url: `crm/api/QRcode/download?code=${url}`, responseType: 'blob' }).then(res => {
        let QRCode = window.URL.createObjectURL(new Blob([res.data]))
        if (type === 'signUrl') {
          this.accountDetails.signUrlQRCode = QRCode
        } else {
          this.accountDetails.legalValidationUrlQRCode = QRCode
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.foodMarketDetails {
  .addAddressContent {
    background: #fff;
    padding: 12px 20px;
    margin-bottom: 15px;
    > p {
      margin-bottom: 10px;
    }
    .addressList {
      min-height: 50px;
      .el-tag {
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
  }
  .main_content {
    .el-form {
      .contentItem {
        padding: 15px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        background-color: #fff;
        margin-bottom: 15px;
        min-height: 200px;
        overflow-y: auto;
        .item {
          width: 30%;
          font-size: 14px;
          margin-bottom: 20px;
          margin-right: 14px;
          span {
            display: inline-block;
            color: #777777;
            margin-bottom: 10px;
          }
          > p {
            color: #262626;
            word-break: break-word;
          }
        }
      }
    }
  }
  .drawer_new {
    .details_content {
      .main_content {
        height: 800px;
        .upload {
          display: flex;
          height: 30px;
          line-height: 30px;
          > i {
            margin-right: 10px;
          }
        }
        .aliSet {
          .item {
            margin-bottom: 20px;
            font-size: 14px;
            > span {
              color: #777777;
              margin-bottom: 10px;
            }
            > div {
              margin-top: 10px;
            }
          }
        }
        .wechatSet {
          .item {
            margin-bottom: 20px;
            font-size: 14px;
            > span {
              color: #777777;
              margin-bottom: 10px;
            }
            > div {
              margin-top: 10px;
              &.fileDIV {
                > span {
                  max-width: 300px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  display: inline-block;
                }
                > i {
                  cursor: pointer;
                }
              }
            }
          }
        }
        .upCode {
          margin-top: 20px;
          position: relative;
          > img {
            width: 450px;
          }
          > .deleteImg {
            position: absolute;
            top: -4px;
            right: 4px;
          }
        }
        .account-detail-form {
          .item {
            display: inline-block;
            width: 48%;
            vertical-align: top;
          }
          .el-form-item__content div {
            color: #333333;
            margin-top: 5px;
            min-height: 19px;
          }
        }
      }
    }
  }
  .tips {
    color: #ed0000;
  }
}
</style>
<style lang="scss">
.foodMarketDetails {
  .el-table::before {
    height: 0;
  }
  .dialog-footer {
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
      margin-left: 10px;
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
  .details_content {
    width: 900px;
    height: calc(100% - 80px) !important;
  }
  .item-attribute {
    width: 100%;
    margin-bottom: 20px;
    p {
      margin: 10px 0;
    }
    .el-checkbox {
      margin-top: 8px;
      width: 20%;
    }
  }
  .ali {
    width: 276px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 4px;
    // margin-right: 40px;
    position: relative;
    // margin-top: 20px;
    background-color: #ffffff;
    // margin-left: 15px;
    div:first-child {
      position: absolute;
      top: 20px;
      left: 20px;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-align: center;
      align-items: center;
      span {
        margin-left: 15px;
        color: #262626;
        font-size: 16px;
      }
    }
    .set {
      position: absolute;
      right: 10px;
      bottom: 10px;
      > span {
        padding-right: 15px;
        /* border-right: 1px solid #eee; */
        margin-right: 15px;
        color: #3575f6;
        cursor: pointer;
      }
    }
  }
  .el-dialog__header {
    padding-left: 0;
    margin-left: 20px;
  }
  .el-dialog__body {
    margin: 0;
    background-color: #f7f7f7;
  }
}
</style>
