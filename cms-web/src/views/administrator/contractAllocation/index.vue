<template>
  <div class="contractAllocation">
    <span class="page_head_title">项目设置</span>
    <div class="table">
      <el-table :data="tableData"
                style="width: 100%">
        <el-table-column label="项目简称"
                         prop="referred"
                         align="center"></el-table-column>
        <el-table-column label="最后配置时间"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.lastConfigTime ? scope.row.lastConfigTime.substring(0, 16).replace('T', ' ') : ''}}
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         align="center">
          <template slot-scope="scope">
            <el-button v-if="hasAuthority('01020701')"
                       @click="checkDetails(scope.row)"
                       class="el-button--primary operation-btn"
                       size="mini">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-drawer title="查看项目设置"
               :visible.sync="drawer"
               direction="rtl"
               @close="drawerClose"
               :wrapperClosable="false"
               class="contractDrawers">
      <div class="contract-body">
        <el-form :model="projectDetail"
                 ref="projectDetail">
          <div class="dc-right"
               style="margin-bottom: 20px;">
            <div class="dr-head">
              <span class="vertical"></span>
              基本信息
              <span v-if="hasAuthority('01020702') && readOnly"
                    class="editBtn"
                    @click="readOnly = !readOnly">
                <i aria-hidden="true"
                   class="icon icon-edit2"></i>
                编辑
              </span>
            </div>
            <el-form-item>
              <div class="cttitle">意向合同编号前缀</div>
              <span v-if="readOnly">{{projectDetail.yxNoPrefix}}</span>
              <el-input v-model="projectDetail.yxNoPrefix"
                        v-else
                        maxlength="30"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item style="margin-bottom: 20px;">
              <div class="cttitle">合同编号前缀</div>
              <span v-if="readOnly">{{projectDetail.noPrefix}}</span>
              <el-input v-model="projectDetail.noPrefix"
                        v-else
                        maxlength="30"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item style="margin-bottom: 20px;">
              <div class="cttitle">滞纳金比例</div>
              <span v-if="readOnly">{{projectDetail.proportion}}</span>
              <el-input v-model="projectDetail.proportion"
                        v-else
                        maxlength="30"
                        style="width: 75%;margin-right:10px;"
                        placeholder="请输入内容"></el-input><span v-if="!readOnly">%/天</span>
            </el-form-item>
            <el-form-item style="margin-bottom: 20px;">
              <div class="cttitle">计费类型</div>
              <span v-if="readOnly">{{formaterChargeTypeOptions(projectDetail.billingType)}}</span>
              <el-select style="width: 100%"
                         v-model="projectDetail.billingType"
                         v-else
                         placeholder="请选择">
                <el-option v-for="item in chargeTypeOptions"
                           :key="item.value"
                           :label="item.name"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-bottom: 20px;">
              <div class="cttitle">年天数</div>
              <span v-if="readOnly">{{projectDetail.yearDay}}</span>
              <!-- <el-input v-model="projectDetail.yearDay"
                        v-else
                        maxlength="30"
                        placeholder="请输入内容"></el-input> -->
              <el-select style="width: 100%"
                         v-model="projectDetail.yearDay"
                         v-else
                         placeholder="请选择">
                <el-option key="365"
                           label="365"
                           value=365></el-option>
                <el-option key="360"
                           label="360"
                           value=360></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <div class="cttitle">提前付款时间</div>
              <span v-if="readOnly">{{projectDetail.dayNumber}}</span>
              <el-input v-model="projectDetail.dayNumber"
                        v-else
                        style="width: 75%;margin-right:10px;"
                        maxlength="10"
                        placeholder="请输入内容"></el-input><span v-if="!readOnly">自然日</span>
            </el-form-item>
            <!-- <el-form-item>
              <div class="cttitle">营收目标金额/元</div>
              <span v-if="readOnly">{{projectDetail.revenueTargetAmount}}</span>
              <el-input v-model="projectDetail.revenueTargetAmount"
                        v-else
                        style="margin-right:10px;"
                        type="number"
                        placeholder="请输入内容"></el-input>
            </el-form-item> -->
            <el-form-item style="margin-bottom: 20px;">
              <div class="cttitle">首个免租期是否包含在租金账单内<i class="required">*</i></div>
              <span v-if="readOnly">{{formatReocrd(projectDetail.onBillContainFirstOfferReocrd)}}</span>
              <el-select style="width: 100%"
                         v-model="projectDetail.onBillContainFirstOfferReocrd"
                         v-else
                         placeholder="请选择">
                <el-option v-for="item in offerReocrdOptions"
                           :key="item.value"
                           :label="item.name"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-bottom: 20px;">
              <div class="cttitle">账单推送提前天数</div>
              <span v-if="readOnly">{{projectDetail.expireDays}}</span>
              <el-select style="width: 100%"
                         v-model="projectDetail.expireDays"
                         v-else
                         placeholder="请选择">
                <el-option v-for="item in expireDaysOptions"
                           :key="item.value"
                           :label="item.name"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item style="margin-bottom: 20px;">
              <div class="cttitle">追溯云账号</div>
              <span v-if="readOnly">{{projectDetail.tracedUserName}}</span>
              <el-input v-model="projectDetail.tracedUserName"
                        v-else
                        style="margin-right:10px;"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item style="margin-bottom: 20px;">
              <div class="cttitle">追溯云密码</div>
              <span v-if="readOnly">{{projectDetail.tracedPassWord}}</span>
              <el-input v-model="projectDetail.tracedPassWord"
                        v-else
                        style="margin-right:10px;"
                        placeholder="请输入内容"></el-input>
            </el-form-item> -->
          </div>
        </el-form>
        <!-- 项目营收目标 -->
        <ProjectRevenueTarget :detail="projectDetail" />
        <!-- 招商目标111 -->
        <INVEST :detail="projectDetail"
                ref="INVEST" />
      </div>
      <div class="dialog-footer contract-foot">
        <el-button @click="drawerClose"
                   class="close-button">关 闭</el-button>
        <el-button v-if="!readOnly"
                   type="primary"
                   @click="confirm('projectDetail')"
                   class="defaultbtn dialog-confirmBtn">保 存</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import context from '@/service'
import ProjectRevenueTarget from './components/ProjectRevenueTarget.vue'
import INVEST from './components/INVEST.vue'
export default {
  name: 'contractAllocation',
  components: {
    ProjectRevenueTarget,
    INVEST
  },
  data () {
    return {
      tableData: [],
      drawer: false,
      projectDetail: {},
      readOnly: true,
      chargeTypeOptions: [
        { name: '按月计费', value: 'MONTH' },
        { name: '按实际天数计费', value: 'DAY' }
      ],
      offerReocrdOptions: [
        { name: '不包括', value: false },
        { name: '包括', value: true }
      ],
      expireDaysOptions: [
        { name: '1', value: 1 },
        { name: '2', value: 2 },
        { name: '3', value: 3 },
        { name: '4', value: 4 },
        { name: '5', value: 5 }
      ]
    }
  },
  created () {
    this.query()
  },
  mounted () {

  },
  methods: {
    drawerClose () {
      this.drawer = false
      this.$refs.INVEST.drawerClose()
    },
    query () {
      context.http.get('cms/api/project-managements', { page: 0, size: 1000, useStatus: 'USING' }).then(res => {
        this.tableData = res.data
        this.total = Number(res.headers['x-total-count'])
      })
    },
    confirm (formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          context.http.put('cms/api/project-managements/config', this.projectDetail).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
              this.drawer = false
              _this.query()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async checkDetails (row) {
      let result = await context.http.get(`cms/api/project-managements/${row.id}`)
      this.projectDetail = result.data
      this.drawer = true
      this.readOnly = true
    },
    formaterChargeTypeOptions (value) {
      let result = this.chargeTypeOptions.filter(item => item.value === value)
      if (result && result.length > 0) {
        return result[0].name
      } else {
        return ''
      }
    },
    formatReocrd (value) {
      if (value === false) {
        return '不包括'
      } else if (value === true) {
        return '包括'
      } else {
        return value
      }
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    }
  }
}
</script>
<style lang="scss">
.contractDrawers {
  .contract-foot {
    border-top: 1px solid #e5e5e5;
    padding: 20px 0;
    text-align: right;
    margin-top: 100px;
  }
  .contract-body {
    min-height: 600px;
  }
  .rtl {
    width: 900px !important;
  }
  .dc-right {
    width: 100%;
    /* border: 1px solid #e7e7e7; */
    .dr-head {
      background-color: #fff;
      height: 40px;
      line-height: 40px;
      padding-left: 12px;
      padding-right: 12px;
      font-size: 14px;
      margin-bottom: 10px;
      font-weight: bold;
      font-size: 16px;
      color: #262626;
      border-bottom: 1px solid #f6f6f6;
      .editBtn {
        font-size: 12px;
        cursor: pointer;
        float: right;
        font-weight: 500;
        color: #3575f6;
        .icon-edit2 {
          width: 15px;
          height: 20px;
          margin-right: 4px;
          background: url(../../../assets/bianji-hover.png) no-repeat;
          background-size: contain;
        }
      }
      .vertical {
        display: inline-block;
        width: 4px;
        height: 18px !important;
        background-color: #3575f6;
        border-radius: 2px;
        vertical-align: sub;
        margin-right: 5px;
      }
    }
    .el-form-item {
      display: inline-block;
      width: 30%;
      margin-left: 16px;
      margin-right: 10px;
      vertical-align: top;
      &:nth-of-type(3n) {
        margin-right: 0;
      }
      .el-form-item__content {
        > span {
          display: inline-block;
          line-height: 30px;
          height: 30px;
        }
      }
    }
  }
}
</style>
