<template>
  <div class="payInfo">
    <div class="content">
      <p class="title"><i></i> 智慧称支付配置</p>
      <div class="cash">
        <div>
          <svg class="iconColor icon"
               aria-hidden="true">
            <use xlink:href="#icon-cms_xianjin"></use>
          </svg>
          <span>现金</span>
        </div>
        <div class="default">
          <span>默认</span>
        </div>
      </div>
      <div class="wechat">
        <div>
          <svg class="iconColor icon"
               aria-hidden="true">
            <use xlink:href="#icon-cms_weixin"></use>
          </svg>
          <span>微信动态收款码</span>
        </div>
        <div class="set">
          <span @click="setWechat">配置</span>
          <el-switch v-model="WECHAT.useStatus"
                     class="switch"
                     @change="useStatusChange('WECHAT', WECHAT.useStatus, WECHAT.id)"
                     active-value="USING"
                     inactive-value="DISABLE"
                     active-color="#91CF48"
                     inactive-color="#EAECF0">
          </el-switch>
        </div>
      </div>
      <div class="ali">
        <div>
          <svg class="iconColor icon"
               aria-hidden="true">
            <use xlink:href="#icon-cms_zhifubao"></use>
          </svg>
          <span>支付宝动态收款码</span>
        </div>
        <div class="set">
          <span @click="aliSet">配置</span>
          <el-switch v-model="ALIPAY.useStatus"
                     @change="useStatusChange('ALIPAY', ALIPAY.useStatus, ALIPAY.id)"
                     class="switch"
                     active-value="USING"
                     inactive-value="DISABLE"
                     active-color="#91CF48"
                     inactive-color="#EAECF0">
          </el-switch>
        </div>
      </div>
      <div class="wechat">
        <div>
          <svg class="iconColor icon"
               aria-hidden="true">
            <use xlink:href="#icon-cms_weixin"></use>
          </svg>
          <span>微信静态收款码</span>
        </div>
        <div class="set">
          <span @click="wxCodeSetShow = true">配置</span>
          <el-switch v-model="WECHAT_CODE.useStatus"
                     class="switch"
                     @change="useStatusChange('WECHAT_CODE',WECHAT_CODE.useStatus,WECHAT_CODE.id)"
                     active-value="USING"
                     inactive-value="DISABLE"
                     active-color="#91CF48"
                     inactive-color="#EAECF0">
          </el-switch>
        </div>
      </div>
      <div class="ali">
        <div>
          <svg class="iconColor icon"
               aria-hidden="true">
            <use xlink:href="#icon-cms_zhifubao"></use>
          </svg>
          <span>支付宝静态收款码</span>
        </div>
        <div class="set">
          <span @click="aliCodeSetShow = true">配置</span>
          <el-switch v-model="ALIPAY_CODE.useStatus"
                     @change="useStatusChange('ALIPAY_CODE',ALIPAY_CODE.useStatus,ALIPAY_CODE.id)"
                     class="switch"
                     active-value="USING"
                     inactive-value="DISABLE"
                     active-color="#91CF48"
                     inactive-color="#EAECF0">
          </el-switch>
        </div>
      </div>
      <p class="title"
         style="margin:20px 0 0 0"><i></i> 线上店铺支付配置</p>
      <div class="ali">
        <div>
          <!-- <svg class="iconColor icon"
               aria-hidden="true">
            <use xlink:href="#icon-u6732"></use>
          </svg> -->
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
          <el-switch v-model="ONLINE_PAY.useStatus"
                     :disabled="accountDetails.applymentState !== 'FINISH'"
                     @change="useStatusChange('ONLINE_PAY', ONLINE_PAY.useStatus,  ONLINE_PAY.id)"
                     class="switch"
                     active-value="USING"
                     inactive-value="DISABLE"
                     active-color="#91CF48"
                     inactive-color="#EAECF0">
          </el-switch>
        </div>
      </div>
      <p class="title"
         v-if="wxFzparams.id"
         style="margin:20px 0 0 0"><i></i>其他配置</p>
      <span v-if="wxFzparams.id">
        <div style="margin:15px 0;color:#666">扣点（%）<i class="required">*</i></div>
        <span v-if="readOnly">{{ONLINE_PAY.remark||'0'}}</span>
        <el-input type="number"
                  v-model="ONLINE_PAY.remark"
                  placeholder="填写0~100"
                  v-else
                  @input="clearNoNum('remark')"
                  size="small">
        </el-input>
      </span>
    </div>
    <div class="dialog-footer"
         v-if="!readOnly">
      <span @click="confirm"
            class="details_submitBtn">保存</span>
      <span @click="cancel"
            class="details_cannelBtn">取消</span>

    </div>
    <!-- 配置微信分账 -->
    <drawer class="drawer_new"
            :show="wechatFzShow"
            title="配置微信分账"
            @on-hide="onHide2">
      <div class="details_content drawer-body"
           slot="drawer">
        <div class="main_content">
          <el-form class="aliSet">
            <div class="item">
              <el-form-item prop="goodsType1">
                <span>商户号<i class="required">*</i></span>
                <el-input v-model="wxFzparams.privateKey"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item prop="goodsType1">
                <span>分账接收账号<i class="required">*</i></span>
                <el-input v-model="wxFzparams.publicKey"
                          type="number"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item prop="goodsType1">
                <span>扣点（%）<i class="required">*</i></span>
                <el-input v-model="wxFzparams.remark"
                          type="number"></el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <span @click="onHide2"
              class="details_cannelBtn">取消</span>
        <span class="details_submitBtn"
              @click="saveWechatFz">确定</span>
      </div>
    </drawer>
    <!-- 配置微信动态支付 -->
    <drawer class="drawer_new"
            :show="setWechatShow"
            title="配置微信支付"
            @on-hide="onHide">
      <div class="details_content drawer-body"
           slot="drawer">
        <div class="main_content">
          <el-form class="wechatSet">
            <div class="item">
              <span>微信号</span>
              <el-input v-model="wxParams.appId"></el-input>
            </div>
            <div class="item">
              <span>商户号</span>
              <el-input v-model="wxParams.app_mch_id"></el-input>
            </div>
            <div class="item">
              <span>子商户号</span>
              <el-input v-model="wxParams.mch_id"></el-input>
            </div>
            <div class="item">
              <span>密钥</span>
              <el-input v-model="wxParams.publicKey"></el-input>
            </div>
            <div class="item">
              <span>微信验证文件</span>
              <div v-if="wxParams.privateKey"
                   class="fileDIV">
                <span>{{ wxParams.remark }}</span>
                <i class="iconfont icon-cms_cuowu"
                   @click="deleFile"></i>
              </div>
              <div class="enclosure-head"
                   v-else
                   style="width: 140px">
                <aliUpload class="aliUpload"
                           upLoadText="上传附件"
                           :fileType="fileType"
                           :iconShow="true"
                           :encrypt="true"
                           @setAnnex="setAnnexs" />
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <span @click="onHide"
              class="details_cannelBtn">取消</span>
        <span class="details_submitBtn"
              @click="saveWXseting">确定</span>
      </div>
    </drawer>
    <!-- 配置支付宝动态支付 -->
    <drawer class="drawer_new"
            :show="aliSetShow"
            title="配置支付宝支付"
            @on-hide="onHide1">
      <div class="details_content drawer-body"
           slot="drawer">
        <div class="main_content">
          <el-form class="aliSet">
            <div class="item">
              <span>APPID</span>
              <el-input v-model="aliParams.appId"></el-input>
            </div>
            <div class="item">
              <span>商户ID</span>
              <el-input v-model="aliParams.mch_id"></el-input>
            </div>
            <div class="item">
              <span>商户私钥</span>
              <el-input v-model="aliParams.privateKey"></el-input>
            </div>
            <div class="item">
              <span>支付宝公钥</span>
              <el-input v-model="aliParams.publicKey"></el-input>
            </div>
          </el-form>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <span @click="onHide1"
              class="details_cannelBtn">取消</span>
        <span class="details_submitBtn"
              @click="saveALIseting">确定</span>
      </div>
    </drawer>
    <!-- 配置微信静态支付 -->
    <drawer class="drawer_new"
            :show="wxCodeSetShow"
            title="配置微信支付"
            @on-hide="onWXCodeHide">
      <div class="details_content drawer-body"
           slot="drawer">
        <div class="main_content">
          <div class="upload">
            收款码<i class="required">*</i>
            <aliUpload v-show="!wxCodeParams.remark"
                       :upLoadText="upLoadText"
                       :fileType="fileType_cost"
                       @setAnnex="setAnneWx" />
          </div>
          <div class="upCode"
               v-show="wxCodeParams.remark">
            <img :src="wxCodeParams.remark"
                 class="logoImg" />
            <div class="iconfont icon-cms_cuowu deleteImg"
                 @click="delWXCode"></div>
          </div>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <span @click="onWXCodeHide"
              class="details_cannelBtn">取消</span>
        <span class="details_submitBtn"
              @click="saveWXCodeseting">确定</span>
      </div>
    </drawer>
    <!-- 配置支付宝静态支付 -->
    <drawer class="drawer_new"
            :show="aliCodeSetShow"
            title="配置支付宝支付"
            @on-hide="onALICodeHide">
      <div class="details_content drawer-body"
           slot="drawer">
        <div class="main_content">
          <div class="upload">
            收款码<i class="required">*</i>
            <aliUpload v-show="!aliCodeParams.remark"
                       :upLoadText="upLoadText"
                       :fileType="fileType_cost"
                       @setAnnex="setAnneAli" />
          </div>
          <div class="upCode"
               v-show="aliCodeParams.remark">
            <img :src="aliCodeParams.remark"
                 class="logoImg" />
            <div class="iconfont icon-cms_cuowu deleteImg"
                 @click="delALICode"></div>
          </div>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <span @click="onALICodeHide"
              class="details_cannelBtn">取消</span>
        <span class="details_submitBtn"
              @click="saveALICodeseting">确定</span>
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
                           :tenantId="tenantDetail.id"
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
                       style="width: 200px" />
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
                       style="width: 200px" />
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
        <span class="details_submitBtn"
              v-if="accountDetails.applymentState === 'REJECTED'"
              @click="reapply">重新申请</span>
      </div>
    </drawer>
  </div>
</template>
<script>
import axios from 'axios'
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import aliUpload from '@/components/aliUpload.vue'
import PaymentApplication from '../../components/PaymentApplication.vue'
import * as hub from '@/service/eventHub'
import { decrypt } from '@/utils/validate'
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
  name: 'businessInfor',
  components: {
    Drawer,
    aliUpload,
    PaymentApplication
  },
  props: {
    tenantDetail: {
      type: Object,
      default: {}
    },
    tabActive: {
      type: Number,
      default: 0
    }
  },
  watch: {
    tabActive: {
      handler: function (val, oldVal) {
        this.getPayDetails()
        this.getMerchantApply()
      },
      immediate: true
    }
  },
  created () {

  },
  mounted () {

  },
  data () {
    return {
      readOnly: true,
      PaymentApplicationShow: false,
      addData: {},
      ALIPAY: {
        id: '',
        tradeChannel: '',
        useStatus: 'DISABLE'
      },
      WECHAT: {
        id: '',
        tradeChannel: '',
        useStatus: 'DISABLE'
      },
      ALIPAY_CODE: {
        id: '',
        tradeChannel: '',
        useStatus: 'DISABLE'
      },
      WECHAT_CODE: {
        id: '',
        tradeChannel: '',
        useStatus: 'DISABLE'
      },
      ONLINE_PAY: { // 微信分账
        id: '',
        tradeChannel: '',
        useStatus: 'DISABLE',
        remark: ''
      },
      wxParams: {
        appId: '',
        app_mch_id: '',
        publicKey: '',
        remark: '',
        mch_id: '',
        privateKey: '',
        tradeChannel: 'WECHAT',
        userId: '',
        userType: 'TENANT'
      },
      aliParams: {
        appId: '',
        mch_id: '',
        privateKey: '',
        publicKey: '',
        tradeChannel: 'ALIPAY',
        userId: '',
        userType: 'TENANT'
      },
      fileType: [],
      value: true,
      aliSetShow: false,
      setWechatShow: false,
      staticSetShow: false,
      wechatFzShow: false,
      accountDetailsShow: false,
      title: '',
      upLoadText: '上传附件',
      fileType_cost: ['png', 'jpg'],
      wxCodeSetShow: false,
      aliCodeSetShow: false,
      wxCodeParams: {
        appId: '',
        app_mch_id: '',
        publicKey: '',
        remark: '',
        mch_id: '',
        privateKey: '',
        tradeChannel: 'WECHAT_CODE',
        userId: '',
        userType: 'TENANT'
      },
      wxFzparams: {
        userId: '',
        privateKey: '',
        publicKey: '',
        tradeChannel: 'ONLINE_PAY',
        userType: 'TENANT',
        remark: ''
      },
      aliCodeParams: {
        appId: '',
        mch_id: '',
        privateKey: '',
        remark: '',
        publicKey: '',
        tradeChannel: 'ALIPAY_CODE',
        userId: '',
        userType: 'TENANT'
      },
      addFlowRules: {
        goodsType1: [
          { required: true, message: '请选择商品大类', trigger: 'blur' }
        ]
      },
      accountDetails: {
        applymentState: ''
      }
    }
  },
  methods: {
    confirm () {
      if (this.ONLINE_PAY.remark === '') {
        this.$message.error('扣点不能为空')
        return
      }
      if (this.ONLINE_PAY.remark < 0) {
        this.$message.error('扣点不能小于0')
        return
      }
      this.wxFzparams.remark = this.ONLINE_PAY.remark
      context.http.put('pay/api/tradeSeting', this.wxFzparams).then(res => {
        if (res.status === 200) {
          this.readOnly = true
          this.$message.success('保存成功')
          this.getPayDetails()
          this.$emit('handleEdit', 0, this.tenantDetail)
        }
      })
    },
    cancel () {
      this.readOnly = true
      this.getPayDetails()
      this.$emit('handleEdit', 0, this.tenantDetail)
    },
    handlerEdit () {
      this.readOnly = false
    },
    clearNoNum (key) {
      this.$nextTick(() => {
        let obj = this.ONLINE_PAY[key]
        obj = obj.replace(/[^\d.]/g, '')  // 清除“数字”和“.”以外的字符
        obj = obj.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        obj = obj.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        // eslint-disable-next-line no-useless-escape
        obj = obj.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')// 只能输入两个小数
        if (obj.indexOf('.') < 0 && obj !== '') { // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          obj = parseFloat(obj)
        }
        this.ONLINE_PAY[key] = obj
      })
    },
    useStatusChange (type, status, id) {
      let flag = status
      if (flag === 'USING') {
        status = 'DISABLE'
      } else {
        status = 'USING'
      }
      if (type === 'WECHAT') {
        if (this.WECHAT.tradeChannel && this.WECHAT.useStatus && this.WECHAT.id) {
          this.WECHAT.useStatus = flag
          this.changeStatus(this.WECHAT.useStatus, id)
        } else {
          if (flag === 'USING') {
            this.WECHAT.useStatus = 'DISABLE'
          } else {
            this.WECHAT.useStatus = 'USING'
          }
          this.$message.error('请先进行支付配置')
        }
      } else if (type === 'ALIPAY') {
        if (this.ALIPAY.tradeChannel && this.ALIPAY.useStatus && this.ALIPAY.id) {
          this.ALIPAY.useStatus = flag
          this.changeStatus(this.ALIPAY.useStatus, id)
        } else {
          if (flag === 'USING') {
            this.ALIPAY.useStatus = 'DISABLE'
          } else {
            this.ALIPAY.useStatus = 'USING'
          }
          this.$message.error('请先进行支付配置')
        }
      } else if (type === 'ALIPAY_CODE') {
        if (this.ALIPAY_CODE.tradeChannel && this.ALIPAY_CODE.useStatus && this.ALIPAY_CODE.id) {
          this.ALIPAY_CODE.useStatus = flag
          this.changeStatus(this.ALIPAY_CODE.useStatus, id)
        } else {
          if (flag === 'USING') {
            this.ALIPAY_CODE.useStatus = 'DISABLE'
          } else {
            this.ALIPAY_CODE.useStatus = 'USING'
          }
          this.$message.error('请先进行支付配置')
        }
      } else if (type === 'WECHAT_CODE') {
        if (this.WECHAT_CODE.tradeChannel && this.WECHAT_CODE.useStatus && this.WECHAT_CODE.id) {
          this.WECHAT_CODE.useStatus = flag
          this.changeStatus(this.WECHAT_CODE.useStatus, id)
        } else {
          if (flag === 'USING') {
            this.WECHAT_CODE.useStatus = 'DISABLE'
          } else {
            this.WECHAT_CODE.useStatus = 'USING'
          }
          this.$message.error('请先进行支付配置')
        }
      } else if (type === 'ONLINE_PAY') {
        if (this.ONLINE_PAY.tradeChannel && this.ONLINE_PAY.useStatus && this.ONLINE_PAY.id) {
          this.ONLINE_PAY.useStatus = flag
          this.changeStatus(this.ONLINE_PAY.useStatus, id)
        } else {
          if (flag === 'USING') {
            this.ONLINE_PAY.useStatus = 'DISABLE'
          } else {
            this.ONLINE_PAY.useStatus = 'USING'
          }
          this.$message.error('请先进行支付配置')
        }
      }
    },
    changeStatus (useStatus, id) { // 更改支付状态
      context.http.put(`pay/api/tradeSeting/useStatus?useStatus=${useStatus}&id=${id}`).then(result => {
        if (result) {
          this.$message.success('操作成功')
        }
      })
    },
    setWechat () {
      this.setWechatShow = true
    },
    aliSet () {
      this.aliSetShow = true
    },
    async getPayDetails () { // 获取列表
      let result = await context.http.get('pay/api/tradeSeting', { userId: this.tenantDetail.id, userType: 'TENANT', flag: true })
      let Data = result.data
      Data.forEach((item, index) => {
        if (item.tradeChannel === 'ALIPAY') {
          this.ALIPAY.useStatus = item.useStatus
          this.ALIPAY.tradeChannel = item.tradeChannel
          this.ALIPAY.id = item.id
          this.aliParams = item
        } else if (item.tradeChannel === 'WECHAT') {
          this.WECHAT.useStatus = item.useStatus
          this.WECHAT.tradeChannel = item.tradeChannel
          this.WECHAT.id = item.id
          this.wxParams = item
        } else if (item.tradeChannel === 'ALIPAY_CODE') {
          this.ALIPAY_CODE.useStatus = item.useStatus
          this.ALIPAY_CODE.tradeChannel = item.tradeChannel
          this.ALIPAY_CODE.id = item.id
          this.aliCodeParams = item
        } else if (item.tradeChannel === 'WECHAT_CODE') {
          this.WECHAT_CODE.useStatus = item.useStatus
          this.WECHAT_CODE.tradeChannel = item.tradeChannel
          this.WECHAT_CODE.id = item.id
          this.wxCodeParams = item
        } else if (item.tradeChannel === 'ONLINE_PAY') {
          this.ONLINE_PAY.useStatus = item.useStatus
          this.ONLINE_PAY.tradeChannel = item.tradeChannel
          this.ONLINE_PAY.id = item.id
          this.ONLINE_PAY.remark = item.remark
          this.wxFzparams = item
        }
      })
      console.log(this.wxFzparams)
    },
    saveWXseting () { // 设置微信
      this.wxParams.userId = this.tenantDetail.id
      let parems = this.wxParams
      if (!this.wxParams.appId) {
        this.$message.error('请输入微信号')
        return
      }
      if (!this.wxParams.app_mch_id) {
        this.$message.error('请输入商户号')
        return
      }
      if (!this.wxParams.publicKey) {
        this.$message.error('请输入密钥')
        return
      }
      if (!this.wxParams.mch_id) {
        this.$message.error('请输入子商户号')
        return
      }
      if (!this.wxParams.privateKey) {
        this.$message.error('请上传微信验证文件')
        return
      }
      context.http.post('pay/api/tradeSeting', parems).then(result => {
        if (result) {
          this.$message.success('保存成功')
          this.getPayDetails()
          this.setWechatShow = false
        }
      })
    },
    saveWechatFz () { // 提交微信分账
      this.wxFzparams.userId = this.tenantDetail.id
      let parems = this.wxFzparams
      if (!this.wxFzparams.privateKey) {
        this.$message.error('请输入商户号')
        return
      }
      if (!this.wxFzparams.publicKey) {
        this.$message.error('请输入分账接收账号')
        return
      }
      if (!this.wxFzparams.remark) {
        this.$message.error('请输入扣点')
        return
      }
      context.http.post('pay/api/tradeSeting', parems).then(result => {
        if (result) {
          this.$message.success('保存成功')
          this.getPayDetails()
          this.wechatFzShow = false
        }
      })
    },
    saveALIseting () {
      this.aliParams.userId = this.tenantDetail.id
      let parems = this.aliParams
      if (!this.aliParams.appId) {
        this.$message.error('请输入APPID')
        return
      }
      if (!this.aliParams.mch_id) {
        this.$message.error('请输入商户ID')
        return
      }
      if (!this.aliParams.privateKey) {
        this.$message.error('请输入商户私钥')
        return
      }
      if (!this.aliParams.publicKey) {
        this.$message.error('请输入支付宝公钥')
        return
      }
      context.http.post('pay/api/tradeSeting', parems).then(result => {
        if (result) {
          this.$message.success('保存成功')
          this.getPayDetails()
          this.aliSetShow = false
        }
      })
    },
    saveALICodeseting () {
      this.aliCodeParams.userId = this.tenantDetail.id
      let parems = this.aliCodeParams
      if (!this.aliCodeParams.remark) {
        this.$message.error('请上传支付宝静态收款码')
        return
      }
      context.http.post('pay/api/tradeSeting', parems).then(result => {
        if (result) {
          this.$message.success('保存成功')
          this.getPayDetails()
          this.aliCodeSetShow = false
        }
      })
    },
    saveWXCodeseting () {
      this.wxCodeParams.userId = this.tenantDetail.id
      let parems = this.wxCodeParams
      if (!this.wxCodeParams.remark) {
        this.$message.error('请上传微信静态收款码')
        return
      }
      context.http.post('pay/api/tradeSeting', parems).then(result => {
        if (result) {
          this.$message.success('保存成功')
          this.getPayDetails()
          this.wxCodeSetShow = false
        }
      })
    },
    // savePAYseting () {
    // },
    setAnnexs (annexURL, annexName) {
      this.wxParams.privateKey = annexURL
      this.wxParams.remark = annexName
    },
    setAnneWx (annexURL, annexName) {
      this.wxCodeParams.remark = annexURL
    },
    setAnneAli (annexURL, annexName) {
      this.aliCodeParams.remark = annexURL
    },
    delWXCode () {
      // let _this = this
      // this.$confirm('确认删除附件?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      this.wxCodeParams.remark = ''
      //   this.$message({
      //     type: 'success',
      //     message: '删除成功!'
      //   })
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   })
      // })
    },
    delALICode () {
      // let _this = this
      // this.$confirm('确认删除附件?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      this.aliCodeParams.remark = ''
      //   this.$message({
      //     type: 'success',
      //     message: '删除成功!'
      //   })
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   })
      // })
    },
    deleFile () {
      this.wxParams.privateKey = ''
      this.wxParams.remark = ''
    },
    onHide2 () {
      this.wechatFzShow = false
    },
    onHide1 () {
      this.aliParams = {
        appId: '',
        mch_id: '',
        privateKey: '',
        publicKey: '',
        tradeChannel: 'ALIPAY',
        userId: '',
        userType: 'TENANT'
      }
      this.aliSetShow = false
      this.$nextTick(() => {
        this.getPayDetails()
      })
    },
    onHide () {
      this.wxParams = {
        appId: '',
        app_mch_id: '',
        publicKey: '',
        remark: '',
        mch_id: '',
        privateKey: '',
        tradeChannel: 'WECHAT',
        userId: '',
        userType: 'TENANT'
      }
      this.setWechatShow = false
      this.$nextTick(() => {
        this.getPayDetails()
      })
    },
    onWXCodeHide () {
      this.wxCodeParams = {
        appId: '',
        app_mch_id: '',
        publicKey: '',
        remark: '',
        mch_id: '',
        privateKey: '',
        tradeChannel: 'WECHAT_CODE',
        userId: '',
        userType: 'TENANT'
      }
      this.wxCodeSetShow = false
      this.$nextTick(() => {
        this.getPayDetails()
      })
    },
    onALICodeHide () {
      this.aliCodeParams = {
        appId: '',
        mch_id: '',
        privateKey: '',
        remark: '',
        publicKey: '',
        tradeChannel: 'ALIPAY_CODE',
        userId: '',
        userType: 'TENANT'
      }
      this.aliCodeSetShow = false
      this.$nextTick(() => {
        this.getPayDetails()
      })
    },
    closePaymentDialog () {
      this.PaymentApplicationShow = false
      this.getMerchantApply()
    },
    async getMerchantApply () {
      let res = await context.http.get('pay/api/merchantApply/detail', { tenantId: this.tenantDetail.id })
      this.accountDetails = res.data
      // this.accountDetails.applymentState = 'REJECTED'
      // if (this.accountDetails.applymentState === 'NEED_SIGN') {
      //   this.getQRCode(this.accountDetails.signUrl, 'signUrl')
      // } else if (this.accountDetails.applymentState === 'ACCOUNT_NEED_VERIFY') {
      //   this.getQRCode(this.accountDetails.legalValidationUrl, 'legalValidationUrl')
      // }
    },
    applymentStateFormater (val) {
      return applymentStateMap[val]
    },
    reapply () {
      this.PaymentApplicationShow = true
      this.$nextTick(() => {
        this.$refs.accountDetails.REJECTED_handler(this.accountDetails)
      })
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
<style lang="scss">
.paymentApplicationDialog {
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
<style lang="scss" scoped>
.payInfo {
  padding: 5px 20px;
  .dialog-footer {
    background-color: #fff;
    display: flex;
    flex-direction: row-reverse;
    span {
      width: 60px;
      height: 26px;
      line-height: 26px;
    }
    .details_submitBtn {
      margin-right: 20px;
    }
  }
  .content {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    > p {
      &.title {
        width: 100%;
        font-size: 16px;
        font-weight: bold;
        color: #262626;
        display: flex;
        align-items: center;
        > i {
          display: inline-block;
          width: 4px;
          height: 16px;
          background: #3575f6;
          border-radius: 2px;
          margin-right: 5px;
        }
      }
    }
    > div {
      width: 28%;
      height: 130px;
      border: 1px solid #eeeeee;
      border-radius: 4px;
      margin-right: 40px;
      position: relative;
      margin-top: 20px;
      > div {
        &:first-child {
          position: absolute;
          top: 20px;
          left: 20px;
          display: flex;
          align-items: center;
          > span {
            margin-left: 15px;
            color: #262626;
            font-size: 16px;
          }
        }
        &.set {
          position: absolute;
          right: 10px;
          bottom: 10px;
          > span {
            padding-right: 15px;
            border-right: 1px solid #eee;
            margin-right: 15px;
            color: #3575f6;
            cursor: pointer;
          }
          .switch {
          }
        }
      }
      &.cash {
        .default {
          width: 62px;
          height: 48px;
          background-image: url(../../../../assets/sanjiao.png);
          background-repeat: no-repeat;
          position: absolute;
          bottom: 0;
          right: 0;
          > span {
            position: absolute;
            font-size: 12px;
            color: #fff;
            right: 5px;
            bottom: 5px;
          }
        }
      }
    }
  }
  .drawer_new {
    .details_content {
      width: 500px;
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
