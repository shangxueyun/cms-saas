
<template>
  <div class="specialActivity">
    <span class="page_head_title">营销管理</span>
    <div class="pl-content">
      <ul class="default_tab_block">
        <li class="active"
            v-if="hasAuthority('02050801')">
          <span>优惠活动管理</span>
        </li>
        <li @click="changeTab('useRecord')"
            v-if="hasAuthority('02050805')">
          <span>优惠券使用记录</span>
        </li>
      </ul>
      <div class="search-bar">
        <div>
          <el-select v-model="seachParam.projectManagementId"
                     clearable
                     placeholder="项目简称">
            <el-option v-for="item in options1"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-input placeholder="活动名称"
                    v-model="seachParam.activityName"
                    style="width:200px"></el-input>
          <span class="query-btn"
                @click="queryRules">查询</span>
        </div>
        <div v-if="hasAuthority('02050803')">
          <el-button class="tban tban1"
                     @click="addGoodsOpen"><i class="iconfont icon-crm_xinzeng-"></i> 新增活动</el-button>
        </div>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  style="width: 100%"
                  ref="multipleTable">
          <el-table-column prop="projectManagementName"
                           label="项目简称"
                           align="center" />
          <el-table-column prop="activityName"
                           label="活动名称"
                           align="center" />
          <el-table-column prop="totalAmount"
                           label="活动总金额/元"
                           align="center" />
          <el-table-column prop="receiveAmount"
                           label="已领取金额/元"
                           align="center" />
          <el-table-column prop="usedAmount"
                           label="已使用金额/元"
                           align="center" />
          <el-table-column width="200px"
                           v-if="hasAuthority('02050802')"
                           label="操作"
                           align="left">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.$index, scope.row)"
                         class="el-button--primary operation-btn"
                         size="mini">
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="total > 0"
           class="ctc-foot1">
        <span>
          <span style="margin-right:10px">{{currentPage}}/{{totalPages}}页</span> 共{{total}}条记录
        </span>
        <el-pagination background
                       layout="prev, pager, next"
                       :page-size=pgSize
                       :total="total"
                       :current-page="currentPage"
                       @current-change="current_change" />

        <div class="pagingnum">
          显示
          <select v-model="pgSize"
                  @change="currentSel">
            <option v-for="item in pgNumoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </option>
          </select>
          条目
        </div>
      </div>
    </div>
    <!-- 新增 -->
    <el-dialog title="新增活动"
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
            <el-form-item prop="projectManagementId">
              <span>项目<i class="required">*</i></span>
              <el-select v-model="addData.projectManagementId"
                         size="small"
                         style="width:100%"
                         placeholder="项目简称">
                <el-option v-for="item in options1"
                           :key="item.id"
                           :label="item.referred"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="activityType">
              <span>活动类型<i class="required">*</i></span>
              <el-select v-model="addData.activityType"
                         size="small"
                         style="width:100%">
                <el-option label="新人立减"
                           value="NEW_PEOPLE"></el-option>
                <el-option label="满减优惠"
                           value="FULL_MINUS"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="activityName">
              <span>活动名称<i class="required">*</i></span>
              <el-input v-model="addData.activityName"
                        placeholder="请输入内容"
                        maxlength="20"
                        size="small"></el-input>
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
    <!-- 详情 -->
    <activityDetails :detailsdrawershow="detailsShow"
                     ref="foodMarketDetails"
                     :draweDetaileData="detaileData"
                     @refreshDetails="refreshDetails"
                     @drawerClose="drawerClose" />
  </div>
</template>
<script>
import context from '@/service'
import AMap from 'AMap'
import moment from 'moment'
import activityDetails from './components/activityDetails'
export default {
  name: 'specialActivity',
  components: {
    activityDetails
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
      addFlowRules: {
        projectManagementId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        activityName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      seachParam: {
        projectManagementId: '',
        activityName: ''
      },
      detailsShow: false,
      addGoodsDialogVisible: false,
      tableData: [],
      currentPage: 1,
      totalPages: 1,
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
      detaileData: {
        couponManagementDTOS: []
      }
    }
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
    let projectManagementId = this.$route.params.projectManagementId
    this.seachParam.projectManagementId = projectManagementId || ''
    this.query()
  },
  mounted () {

  },
  watch: {
    addGoodsDialogVisible: {
      handler: function (newVal, oldVal) {
        if (newVal) {

        }
      }
    }
  },
  methods: {
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
    delCoupon (index) {
      if (this.addData.couponManagementDTOS.length === 1) {
        this.$message.error('至少保留一种优惠券')
        return
      }
      this.addData.couponManagementDTOS.splice(index, 1)
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

      // this.value = obj
    },
    refreshDetails (id) {
      context.http.get(`ord/api/activity-managements/${id}`).then(res => {
        if (res) {
          this.detaileData = res.data
        }
      })
    },
    handleEdit (index, row) {
      context.http.get(`ord/api/activity-managements/${row.id}`).then(res => {
        if (res) {
          this.detaileData = res.data
          this.detailsShow = true
        }
      })
    },
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
          console.log(this.addData)
          context.http.post(`ord/api/activity-managements`, this.addData).then(res => {
            if (res) {
              this.$message.success('新增成功')
              this.addGoodsDialogClose()
              this.queryRules()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async query () {
      let result = await context.http.get('ord/api/activity-managements', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'createdDate,desc',
        activityName: this.seachParam.activityName,
        projectManagementId: this.seachParam.projectManagementId
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      this.totalPages = Math.ceil(this.total / this.pgSize)
    },
    drawerClose () {
      this.query()
      this.detailsShow = false
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
    addGoodsOpen () {
      this.addGoodsDialogVisible = true
    },
    changeTab (type) {
      this.$router.push({
        name: type,
        params: { projectManagementId: this.seachParam.projectManagementId }
      })
    },
    queryRules () {
      this.currentPage = 1
      this.pgSize = 15
      this.query()
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    }
  }
}
</script>
<style lang="scss">
.specialActivity {
  .el-input-number .el-input__inner {
    text-align: left;
  }
  .deviceDetails {
    width: 140px;
    height: 120px;
    margin-right: 0px !important;
    .oss_file {
      width: 100%;
      height: 100%;
      border: none;
      background-color: #eaeaea;
      border: 1px solid rgba(234, 234, 234, 1);
      border-radius: 4px;
      color: #3575f6;
      > i {
        font-size: 32px;
        position: absolute;
        top: 8px;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
      }
      > span {
        position: absolute;
        top: 40px;
        left: 0px;
      }
    }
  }
  .el-dialog__wrapper {
    &.addGoodsDialog {
      .el-dialog {
        .el-dialog__header {
          margin-bottom: 0px;
        }
        .el-dialog__body {
          background-color: #faf7fa;
          .steps {
            height: 60px;
            padding: 0 15px;
            border-top: 1px solid #f6f6f6;
            background-color: #ffffff;
            margin-bottom: 15px;
          }
          .dialog_content {
            background-color: #ffffff;
            margin-top: 0px;
            .checkbox-group {
              width: 100%;
              .el-checkbox {
                width: 20%;
                margin-top: 10px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.specialActivity {
  .addAddressContent {
    padding: 12px 20px;
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
  .editBtn {
    position: absolute;
    right: 5px;
    bottom: 0;
    > span {
      display: inline-block;
      height: 28px;
      line-height: 28px;
      background-color: #0d9bf2;
      color: #fff;
      border: 0;
      outline: none;
      padding-left: 5px;
      padding-right: 5px;
      border-radius: 3px;
      margin-bottom: 4px;
      cursor: pointer;
    }
  }
  #container {
    width: 100%;
    height: 500px;
  }
  .psScope {
    display: inline-block;
    width: 56px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    border: 1px solid #f3af2c;
    border-radius: 3px;
    color: #f3af2c;
    cursor: pointer;
    &:hover {
      background: #f3af2c;
      color: #fff;
    }
  }
  .addGoodsDialog {
    .slotfooter {
      .save {
        margin-right: 12px;
        height: 32px;
        line-height: 32px;
        color: #3577f6;
        border: 1px solid #3577f6;
        background: rgba(53, 119, 246, 0.05);
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
            // .imgBox {
            //   width: 140px;
            //   height: 120px;
            //   position: relative;
            //   background: rgba(255, 255, 255, 1);
            //   border: 1px solid rgba(234, 234, 234, 1);
            //   border-radius: 4px;
            //   > .bottomTips {
            //     height: 25px;
            //     position: absolute;
            //     left: 0px;
            //     bottom: 0px;
            //     width: 140px;
            //     background-color: #fdffff;
            //     display: flex;
            //     align-items: center;
            //     font-size: 12px;
            //     justify-content: space-between;
            //     padding: 0 5px;
            //     > span {
            //       display: inline-block;
            //       width: 60%;
            //       overflow: hidden;
            //       text-overflow: ellipsis;
            //       white-space: nowrap;
            //       padding: 0 5px;
            //     }
            //     > i {
            //       cursor: pointer;
            //     }
            //   }
            // }
          }
        }
      }
    }
  }
  .plc-table {
    .onlineBtn {
      display: inline-block;
      width: 56px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border: 1px solid rgba(68, 175, 105, 1);
      border-radius: 3px;
      color: #44af69;
      cursor: pointer;
    }
    .offlineBtn {
      display: inline-block;
      width: 56px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border: 1px solid #eb605b;
      border-radius: 3px;
      color: #eb605b;
      cursor: pointer;
    }
  }
  .plc-search {
    min-height: 70px;
    line-height: 0;
    background-color: #fff;
    margin: 20px 0;
    padding-left: 18px;
    padding-right: 18px;
    box-shadow: 1px 2px 5px #eee;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -ms-flex-pack: justify;
    justify-content: space-between;
    align-items: center;
    position: relative;
    > div {
      > div {
        margin-right: 15px;
      }
    }
  }
  .typeTab {
    height: 60px;
    line-height: 60px;
    background-color: #ffffff;
    margin-top: 15px;
    box-shadow: 4px 4px 4px 1px #eee;
    > span {
      display: inline-block;
      width: 120px;
      text-align: center;
      cursor: pointer;
      &.active {
        color: #3175d2;
        border-bottom: 2px solid #3175d2;
      }
    }
  }
}
</style>
<style lang="less">
.specialActivity .el-input__suffix {
  line-height: 32px;
}
</style>
