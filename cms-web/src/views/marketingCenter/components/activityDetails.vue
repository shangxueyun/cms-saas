<template>
  <div class="activityDetails">
    <drawer class="drawer_new"
            :show="detailsdrawershow"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="details_content drawer-body"
           slot="drawer">
        <div class="main_content"
             style="height:100%;padding:0;background-color: #F7F7F7;">
          <el-form :model="draweDetaileData"
                   ref="draweDetaileData">
            <div class="half_page_title"
                 style="width:100%">
              <div><i></i>基本信息</div>
            </div>
            <div class="contentItem">
              <el-form-item class="item">
                <span>项目<i class="required">*</i></span>
                <p>{{draweDetaileData.projectManagementName}}</p>
              </el-form-item>
              <el-form-item class="item">
                <span>活动类型</span>
                <p>{{draweDetaileData.activityType==='NEW_PEOPLE'?'新人立减':'满减优惠'}}</p>
              </el-form-item>
              <el-form-item class="item">
                <span>活动名称</span>
                <p>{{draweDetaileData.activityName}}</p>
              </el-form-item>
            </div>
            <div class="half_page_title"
                 style="width:100%">
              <div><i></i>优惠券信息</div>
              <span class="addWeixiu"
                    v-if="hasAuthority('02050803')"
                    @click="addGoodsDialogVisible=true"
                    style="color: #00b362;cursor: pointer;font-weight: normal;font-size: 14px;">
                <i class="iconfont icon-crm_xinzeng-"></i>
                <a style="text-decoration: underline;">新增优惠券</a>
              </span>
            </div>
            <div class="contentItem contentItem1">
              <el-table :data="draweDetaileData.couponManagementDTOS"
                        style="width: 100%"
                        ref="multipleTable">
                <el-table-column prop="couponName"
                                 label="优惠券名称"
                                 width="150px"
                                 align="center" />
                <el-table-column prop="denomination"
                                 label="面额"
                                 width="80px"
                                 align="center" />
                <el-table-column prop="requiredAmoun"
                                 label="使用门槛"
                                 width="100px"
                                 align="center" />
                <el-table-column label="优惠券有效期"
                                 width="150px"
                                 align="center">
                  <template slot-scope="scope">
                    <div>{{scope.row.couponStartTime.replace('T',' ')}}</div>
                    <div> ~ </div>
                    <div>{{scope.row.couponEndTime.replace('T',' ')}}</div>

                  </template>
                </el-table-column>
                <el-table-column prop="grantCount"
                                 label="发放数量"
                                 width="100px"
                                 align="center" />
                <el-table-column label="已领取数量"
                                 width="100px"
                                 align="center">
                  <template slot-scope="scope">
                    <div>{{scope.row.grantCount-scope.row.surplusCount}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="usedCount"
                                 label="已使用数量"
                                 width="100px"
                                 align="center" />
                <el-table-column label="领取时间"
                                 width="150px"
                                 align="center">
                  <template slot-scope="scope">
                    <div>{{scope.row.receiveStartTime.replace('T',' ')}}</div>
                    <div> ~ </div>
                    <div>{{scope.row.receiveEndTime.replace('T',' ')}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="receiveNum"
                                 label="限制领取次数"
                                 width="120px"
                                 align="center" />
                <el-table-column prop="lastModifiedDate"
                                 label="优惠券描述"
                                 width="100px"
                                 align="center">
                  <template slot-scope="scope">
                    <div :title="scope.row.describe">{{describeText(scope.row.describe)}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="领取状态"
                                 align="center">
                  <template slot-scope="scope">
                    <div>{{statusFormat(scope.row.using)}}</div>
                  </template>
                </el-table-column>
                <el-table-column width="80px"
                                 align="center"
                                 v-if="hasAuthority('02050804')"
                                 label="操作">
                  <template slot-scope="scope">
                    <span class="stopBtn"
                          v-if="scope.row.using"
                          style="color:#3575F6;text-decoration: underline;cursor: pointer;"
                          @click="stopFn(scope.$index, scope.row)">停用</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form>
        </div>
      </div>
      <!-- <div slot="footer"
           class="dialog-footer">
        <span @click="onHide"
              class="details_cannelBtn"
              style="background:none">取消</span>
        <span class="saveSubmit"
              @click="save()">保存</span>
      </div> -->
    </drawer>

    <!-- 新增 -->
    <el-dialog title="新增优惠券"
               :visible.sync="addGoodsDialogVisible"
               class="addGoodsDialog el_dialog_new "
               width="1100px"
               @close="addGoodsDialogClose"
               :close-on-click-modal="false">
      <div class="dialog_content">
        <el-form :model="addData"
                 :rules="addFlowRules"
                 ref="addData">
          <div class="half_page_title"
               style="width:100%;margin-top:15px">
            <div><i></i>基本信息</div>
          </div>
          <div class="content content2">
            <el-form-item>
              <span>项目<i class="required">*</i></span>
              <p>{{draweDetaileData.projectManagementName}}</p>
            </el-form-item>
            <el-form-item>
              <span>活动类型<i class="required">*</i></span>
              <p>{{draweDetaileData.activityType==='NEW_PEOPLE'?'新人立减':'满减优惠'}}</p>
            </el-form-item>
            <el-form-item>
              <span>活动名称<i class="required">*</i></span>
              <p>{{draweDetaileData.activityName}}</p>
            </el-form-item>
            <el-form-item></el-form-item>
          </div>
          <div style="height:15px;background:#F7F7F7;width: 100%;"></div>
          <div class="half_page_title"
               style="width:100%;margin-top:15px">
            <div><i></i>优惠券信息</div>
            <span class="addWeixiu"
                  v-if="hasAuthority('02050803')"
                  @click="addCoupons"
                  style="color: #00b362;cursor: pointer;font-weight: normal;font-size: 14px;">
              <i class="iconfont icon-crm_xinzeng-"></i>
              <a style="text-decoration: underline;">继续添加</a>
            </span>
          </div>
          <div class="content content2 list"
               v-for="(item,index) in addData.couponManagementDTOS"
               :key="index">
            <div class="delCoupon"
                 @click="delCoupon(index)">X 删除该项</div>
            <el-form-item :prop="`couponManagementDTOS[${index}].couponName`"
                          :rules="{ required: true, message: '请输入优惠券名称', trigger: 'blur' }">
              <span>优惠券名称<i class="required">*</i></span>
              <el-input v-model="item.couponName"
                        maxlength="20"
                        size="small"></el-input>
            </el-form-item>
            <el-form-item :prop="`couponManagementDTOS[${index}].denomination`"
                          :rules="dynamicCheck.denomination">
              <span>面额<i class="required">*</i></span>
              <el-input v-model="item.denomination"
                        @input="clearNoNum('denomination',index)"
                        placeholder="请输入优惠券面额"
                        style="width:100%"
                        :min="0"
                        :controls="false"
                        size="small">
              </el-input>
            </el-form-item>
            <el-form-item :prop="`couponManagementDTOS[${index}].requiredAmoun`"
                          :rules="dynamicCheck.requiredAmoun">
              <span>使用门槛<i class="required">*</i></span>
              <div>
                <span>订单满</span>
                <el-input type="number"
                          style="width:150px"
                          @input="clearNoNum('requiredAmoun',index)"
                          v-model="item.requiredAmoun"
                          :min="0"
                          :controls="false"
                          size="small">
                </el-input>
                <span>元使用</span>
              </div>
            </el-form-item>
            <el-form-item :prop="`couponManagementDTOS[${index}].grantCount`"
                          :rules="{ required: true, message: '请输入发放数量', trigger: 'blur' }">
              <span>发放数量（张）<i class="required">*</i></span>
              <el-input type="number"
                        onkeyup="value=value.replace(/[^0-9]/g,'')"
                        onpaste="value=value.replace(/[^0-9]/g,'')"
                        oncontextmenu="value=value.replace(/[^0-9]/g,'')"
                        v-model="item.grantCount"
                        size="small">
              </el-input>
            </el-form-item>
            <el-form-item :prop="`couponManagementDTOS[${index}].couponStartTime`"
                          style="width:49%">
              <span>优惠券有效期<i class="required">*</i></span>
              <div style="display: flex; align-items: center;justify-content: space-between;">
                <el-date-picker v-model="item.couponStartTime"
                                style="width:48%"
                                type="datetime"
                                value-format="yyyy-MM-ddTHH:mm:ss"
                                size="small"
                                placeholder="开始时间">
                </el-date-picker>
                <span> - </span>
                <el-date-picker v-model="item.couponEndTime"
                                style="width:48%"
                                type="datetime"
                                value-format="yyyy-MM-ddTHH:mm:ss"
                                size="small"
                                placeholder="结束时间">
                </el-date-picker>
              </div>
            </el-form-item>
            <el-form-item :prop="`couponManagementDTOS[${index}].receiveStartTime`"
                          style="width:49%">
              <span>领取时间<i class="required">*</i></span>
              <div style="display: flex; align-items: center;justify-content: space-between;">
                <el-date-picker v-model="item.receiveStartTime"
                                style="width:48%"
                                type="datetime"
                                value-format="yyyy-MM-ddTHH:mm:ss"
                                size="small"
                                placeholder="开始时间">
                </el-date-picker>
                <span> - </span>
                <el-date-picker v-model="item.receiveEndTime"
                                style="width:48%"
                                type="datetime"
                                value-format="yyyy-MM-ddTHH:mm:ss"
                                size="small"
                                placeholder="结束时间">
                </el-date-picker>
              </div>
            </el-form-item>
            <el-form-item :prop="`couponManagementDTOS[${index}].receiveNum`"
                          :rules="{ required: true, message: '请输入领取次数', trigger: 'blur' }">
              <span>领取次数（次）<i class="required">*</i></span>
              <el-input type="number"
                        onkeyup="value=value.replace(/[^0-9]/g,'')"
                        onpaste="value=value.replace(/[^0-9]/g,'')"
                        oncontextmenu="value=value.replace(/[^0-9]/g,'')"
                        v-model="item.receiveNum"
                        size="small">
              </el-input>
            </el-form-item>
            <el-form-item :prop="`couponManagementDTOS[${index}].describe`"
                          style="width:49%">
              <span>优惠券描述</span>
              <el-input v-model="item.describe"
                        maxlength="150"
                        size="small"></el-input>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item :prop="`couponManagementDTOS[${index}].couponEndTime`"
                          style="display:none"></el-form-item>
            <el-form-item :prop="`couponManagementDTOS[${index}].receiveEndTime`"
                          style="display:none">></el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer"
           class="slotfooter">
        <span @click="addGoodsDialogClose"
              class="details_cannelBtn">取消</span>
        <span class="details_submitBtn"
              @click="addActivity()">确定</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import moment from 'moment'
import axios from 'axios'
import * as JSOG from 'jsog'
export default {
  name: 'activityDetails',
  components: {
    Drawer
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
    this.options1 = this.$store.state.projectManagementsList
  },
  watch: {
    detailsdrawershow: {
      handler (newValue, oldValue) {
        if (newValue) {
        }
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    let _this = this
    var denominationRule = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入面额'))
      } else if (value < 0 || value > 50 || !value) {
        return callback(new Error('面额必须大于0且小于50元'))
      } else {
        callback()
      }
    }
    var requiredAmounRule = (rule, value, callback) => {
      let i = rule.fullField.indexOf('[')
      let ii = rule.fullField.indexOf(']')
      let index = rule.fullField.substring(i + 1, ii)
      if (value - _this.addData.couponManagementDTOS[index].denomination < 1) {
        return callback(new Error('使用门槛金额至少比面额多1元'))
      } else {
        callback()
      }
    }
    return {
      addGoodsDialogVisible: false,
      activityType: 1,
      addData: {
        projectManagementId: '',
        activityType: 'NEW_PEOPLE',
        activityName: '',
        couponManagementDTOS: [
          {
            couponName: '', // 优惠券名称
            denomination: '', // 面额
            requiredAmoun: '', // 门槛要求
            couponStartTime: '', // 优惠券使用时间
            couponEndTime: '', // 优惠券结算时间
            grantCount: '', // 发放数量
            receiveNum: 1, // 限制领取次数
            receiveStartTime: '', // 领取开始时间
            receiveEndTime: '', // 领取结束时间
            describe: '' // 描述
          }
        ]
      },
      dynamicCheck: {
        denomination: { validator: denominationRule, trigger: 'blur' },
        requiredAmoun: { validator: requiredAmounRule, trigger: 'blur' }
      },
      accountDetailsShow: false,
      PaymentApplicationShow: false,
      accountDetails: {},
      tableData: [],
      projectManagementId: '',
      options1: [],
      drawerTitle: '活动详情',
      addFlowRules: {
        projectManagementId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        activityName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {

  },
  methods: {
    addActivity () {
      this.$refs['addData'].validate((valid) => {
        if (valid) {
          let arr = this.addData.couponManagementDTOS
          let couponTime = arr.some((item, index) => {
            return !item.couponStartTime || !item.couponEndTime
          })
          if (couponTime) {
            this.$message.error('请选择优惠券有效期')
            return
          }
          let receiveTime = arr.some((item, index) => {
            return !item.receiveStartTime || !item.receiveEndTime
          })
          if (receiveTime) {
            this.$message.error('请选择领取时间')
            return
          }
          let params = this.addData.couponManagementDTOS.map((item, index) => {
            item.projectManagementId = this.draweDetaileData.projectManagementId
            item.activityId = this.draweDetaileData.id
            return item
          })
          console.log(this.addData, params)
          context.http.post(`ord/api/coupon-managements`, params).then(res => {
            if (res) {
              this.$message.success('新增成功')
              this.addGoodsDialogClose()
              this.$emit('refreshDetails', this.draweDetaileData.id)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    delCoupon (index) {
      if (this.addData.couponManagementDTOS.length === 1) {
        this.$message.error('至少保留一种优惠券')
        return
      }
      this.addData.couponManagementDTOS.splice(index, 1)
    },
    addCoupons () { // 活动新增多张优惠券
      let counp = {
        couponName: '', // 优惠券名称
        denomination: '', // 面额
        requiredAmoun: '', // 门槛要求
        couponStartTime: '', // 优惠券使用时间
        couponEndTime: '', // 优惠券结算时间
        grantCount: '', // 发放数量
        receiveNum: 1, // 现在领取次数
        receiveStartTime: '', // 领取开始时间
        receiveEndTime: '', // 领取结束时间
        describe: '' // 描述
      }
      this.addData.couponManagementDTOS.push(counp)
    },
    statusFormat (status) {
      if (status) {
        return '可领取'
      }
      return '不可领取'
      // let before = data.receiveStartTime
      // let after = data.receiveEndTime
      // let time = moment()
      // if (time.isBetween(before, after)) {
      //   return '可领取'
      // } else {
      //   return '不可领取'
      // }
    },
    stopFn (index, row) {
      context.http.get(`ord/api/couponStopOrStart/${row.id}`).then(res => {
        if (res) {
          this.$emit('refreshDetails', this.draweDetaileData.id)
          this.$message.success('停用成功')
        }
      })
    },
    describeText (text) {
      if (text.length > 8) {
        text = text.substring(0, 8) + '...'
      }
      return text
    },
    addGoodsDialogClose () {
      let counp = {
        couponName: '', // 优惠券名称
        denomination: '', // 面额
        requiredAmoun: '', // 门槛要求
        couponStartTime: '', // 优惠券使用时间
        couponEndTime: '', // 优惠券结算时间
        grantCount: '', // 发放数量
        receiveNum: 1, // 限制领取次数
        receiveStartTime: '', // 领取开始时间
        receiveEndTime: '', // 领取结束时间
        describe: '' // 描述
      }
      this.$refs['addData'].resetFields()
      this.addGoodsDialogVisible = false
      this.addData.couponManagementDTOS = [counp]
    },
    clearNoNum (key, index) {
      this.$nextTick(() => {
        let obj = this.addData.couponManagementDTOS[index][key]
        obj = obj.replace(/[^\d.]/g, '')  // 清除“数字”和“.”以外的字符
        obj = obj.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        obj = obj.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        // eslint-disable-next-line no-useless-escape
        obj = obj.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')// 只能输入两个小数
        if (obj.indexOf('.') < 0 && obj !== '') { // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          obj = parseFloat(obj)
        }
        this.addData.couponManagementDTOS[index][key] = obj
      })
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    onHide () {
      this.$emit('drawerClose', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.activityDetails {
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
  .el-form {
    padding: 0 !important;
    .content {
      padding: 15px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 100%;
      &.list {
        background-color: #f7f8fa;
        padding: 30px 10px 0;
        margin: 15px;
        position: relative;
        .delCoupon {
          position: absolute;
          top: 0;
          right: 0;
          cursor: pointer;
          font-size: 12px;
          background-color: rgba(0, 0, 0, 0.5);
          padding: 3px 15px;
          color: #fff;
        }
      }
      .el-form-item {
        width: 24%;
        .el-form-item__content {
          > span {
            margin-bottom: 5px;
            display: inline-block;
            height: 25px;
            display: -ms-flexbox;
            display: flex;
            -ms-flex-align: center;
            align-items: center;
            font-size: 14px;
            color: #777777;
          }
          > p {
            color: #666666;
            font-size: 12px;
            height: 40px;
            line-height: 40px;
          }
          .tips {
            font-size: 12px;
            color: #999999;
            margin-top: 10px;
          }
        }
      }
    }
  }
  .el-form {
    padding: 0 !important;
    .contentItem {
      padding: 15px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      background-color: #fff;
      margin-bottom: 15px;
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
.activityDetails {
  .el-table--scrollable-x .el-table__body-wrapper {
    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    &::-webkit-scrollbar {
      width: 4px;
      height: 10px;
      background-color: rgb(25, 38, 70);
    }
    /*定义滚动条轨道 内阴影+圆角*/
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px #fff;
      border-radius: 10px;
      background-color: #fff;
    }
    /*定义滑块 内阴影+圆角*/
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 10px #3175d2;
      background-color: 3175d2;
    }
  }
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
    width: 1100px;
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
