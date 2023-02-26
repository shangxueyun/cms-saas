
<template>
  <div class="deliveryman">
    <span class="page_head_title">菜场管理</span>
    <div class="pl-content">
      <ul class="default_tab_block">
        <li @click="changeTab('foodMarket')"
            v-if="hasAuthority('02050701')">
          <span>菜场配置</span>
        </li>
        <li class="active"
            v-if="hasAuthority('02050705')">
          <span>配送员管理</span>
        </li>
        <!-- <li v-if="hasAuthority('02050108')">
          <span>平价菜管理</span>
        </li> -->
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
          <el-select v-model="seachParam.onLine"
                     clearable
                     placeholder="在线情况">
            <el-option label="开工"
                       :value="true"></el-option>
            <el-option label="收工"
                       :value="false"></el-option>
          </el-select>
          <el-input placeholder="姓名/手机号"
                    v-model="seachParam.likeValue"
                    style="width:200px"></el-input>
          <span class="query-btn"
                @click="queryRules">查询</span>
        </div>
        <div v-if="hasAuthority('02050706')">
          <el-button class="tban tban1"
                     @click="addGoodsOpen"><i class="iconfont icon-crm_xinzeng-"></i> 新增配送员</el-button>
        </div>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  style="width: 100%"
                  ref="multipleTable">
          <el-table-column prop="projectManagementName"
                           label="项目简称"
                           align="center" />
          <el-table-column prop="distributionPersonName"
                           label="姓名"
                           align="center" />
          <el-table-column prop="distributionTelephone"
                           label="手机号"
                           align="center" />
          <el-table-column prop="onLine"
                           label="在线情况"
                           :formatter="onlineFormat"
                           align="center" />
          <el-table-column prop="useStatus"
                           :formatter="useStatusFormat"
                           label="状态"
                           align="center" />
          <el-table-column prop="createdDate"
                           label="添加时间"
                           align="center" />
          <el-table-column label="操作"
                           v-if="hasAuthority('02050707')">
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
    <el-dialog title="新增配送员"
               :visible.sync="addGoodsDialogVisible"
               class="addGoodsDialog el_dialog_new "
               width="700px"
               @close="addGoodsDialogClose"
               :close-on-click-modal="false">
      <div class="half_page_title"
           style="width:100%;margin-top:15px">
        <div><i></i>基本信息</div>
      </div>
      <div class="dialog_content">
        <el-form :model="addData"
                 :rules="addFlowRules"
                 ref="addData">
          <div class="content content2">
            <el-form-item prop="distributionPersonName">
              <span>姓名<i class="required">*</i></span>
              <el-input v-model="addData.distributionPersonName"
                        size="small"></el-input>
            </el-form-item>
            <el-form-item prop="distributionTelephone">
              <span>手机号<i class="required">*</i></span>
              <el-input v-model="addData.distributionTelephone"
                        type="tel"
                        size="small"></el-input>
            </el-form-item>
            <el-form-item prop="projectManagementId">
              <span>所属项目<i class="required">*</i></span>
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
            <el-form-item prop="useStatus">
              <span>状态<i class="required">*</i></span>
              <el-select v-model="addData.useStatus"
                         size="small"
                         style="width:100%"
                         placeholder="状态">
                <el-option label="启用"
                           value="USING"></el-option>
                <el-option label="停用"
                           value="DISABLE"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer"
           class="slotfooter">
        <span @click="addGoodsDialogClose"
              class="details_cannelBtn">取消</span>
        <span class="details_submitBtn"
              @click="addgoods()">确定</span>
      </div>
    </el-dialog>

    <!-- 详情 -->
    <deliverymanDetails :detailsdrawershow="detailsShow"
                        ref="deliverymanDetails"
                        :draweDetaileData="detaileData"
                        @drawerClose="drawerClose" />
  </div>
</template>
<script>
import context from '@/service'
import deliverymanDetails from './deliverymanDetails'
export default {
  name: 'deliveryman',
  components: {
    deliverymanDetails
  },
  data () {
    var checkPhone = (rule, value, callback) => {
      let mobile = /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/ // 最新16手机正则
      if (!mobile.test(value)) {
        return callback(
          new Error('请输入正确的手机号格式')
        )
      } else {
        callback()
      }
    }
    return {
      seachParam: {
        projectManagementId: '',
        onLine: '',
        likeValue: ''
      },
      addData: {
        projectManagementId: '',
        distributionPersonName: '',
        distributionTelephone: '',
        useStatus: 'USING'
      },
      addFlowRules: {
        projectManagementId: [
          { required: true, message: '请选择所属项目', trigger: 'change' }
        ],
        useStatus: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        distributionPersonName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        distributionTelephone: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ]
      },
      detailsShow: false,
      readonly: false,
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
      },
      projectOptions: []
    }
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
    let projectManagementId = this.$route.params.projectManagementId
    this.seachParam.projectManagementId = projectManagementId || ''
    this.query()
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
    onlineFormat (row, index) {
      if (row.onLine) {
        return '开工'
      } else {
        return '收工'
      }
    },
    useStatusFormat (row, index) {
      if (row.useStatus === 'USING') {
        return '启用'
      } else {
        return '停用'
      }
    },
    addgoods () {
      this.$refs['addData'].validate((valid) => {
        if (valid) {
          context.http.post(`ord/api/distribution-users`, this.addData).then(res => {
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
      let result = await context.http.get('ord/api/distribution-users?sort=createdDate,desc', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        // sort: 'createdDate,asc',
        projectManagementId: this.seachParam.projectManagementId,
        onLine: this.seachParam.onLine,
        likeValue: this.seachParam.likeValue
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
      this.$refs['addData'].resetFields()
      this.addGoodsDialogVisible = false
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
    },
    handleEdit (index, row) {
      context.http.get(`ord/api/distribution-users/${row.id}`).then(res => {
        if (res) {
          this.detaileData = res.data
          this.detailsShow = true
        }
      })
    }
  }
}
</script>
<style lang="scss">
.deliveryman,
.tenantGoods {
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
.deliveryman {
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
      .content {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 100%;
        .el-form-item {
          width: 45%;
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
.deliveryman .el-input__suffix {
  line-height: 32px;
}
</style>
