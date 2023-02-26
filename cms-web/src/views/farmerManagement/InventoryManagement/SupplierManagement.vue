
<template>
  <div class="SupplierManagement">
    <span class="page_head_title">溯源管理</span>
    <ul class="default_tab_block">
      <li v-if="hasAuthority('02050405')"
          @click="switchover('warehousing')">
        <span>入库信息上报</span>
      </li>
      <li v-if="hasAuthority('02050406')"
          @click="switchover('sellData')">
        <span>销售数据上报</span>
      </li>
      <li v-if="hasAuthority('02050407')"
          @click="switchover('traceabilitySet')">
        <span>溯源配置</span>
      </li>
      <li v-if="hasAuthority('02050404')"
          class="active">
        <span>供应商管理</span>
      </li>
    </ul>
    <div class="pl-content">
      <div class="search-bar">
        <div>
          <el-select v-model="seachParam.projectId"
                     style="width:150px"
                     clearable
                     @change="changeProjectId"
                     placeholder="项目简称">
            <el-option v-for="item in options1"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="seachParam.tenantId"
                     clearable
                     @focus="projectChange(seachParam.projectId, 'seach')"
                     style="width:150px"
                     filterable
                     size="small"
                     placeholder="输入品牌名称搜索">
            <el-option v-for="item in tenantOption"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-input placeholder="供应商"
                    v-model="seachParam.name"
                    style="width:150px"></el-input>
          <el-select v-model="seachParam.useStatus"
                     style="width:150px"
                     clearable
                     placeholder="状态">
            <el-option v-for="item in statusList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
          <span class="query-btn"
                @click="queryRules">查询</span>
          <!-- <el-button class="query-btn" style="padding-top: 0px;"
               :disabled='queryBtn' 
               @click="queryRules"
               type="primary">查询</el-button> -->
        </div>
        <div v-if="hasAuthority('02050401')">
          <el-button class="tban tban1"
                     @click="addGoodsOpen"><i class="iconfont icon-crm_xinzeng-"></i> 新增供应商</el-button>
        </div>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  style="width: 100%"
                  ref="multipleTable">
          <el-table-column prop="projectName"
                           label="项目简称"
                           align="center">
          </el-table-column>
          <el-table-column prop="tenantName"
                           label="品牌名称"
                           align="center"></el-table-column>
          <el-table-column prop="name"
                           label="供应商名称"
                           align="center"></el-table-column>
          <el-table-column prop="contacts"
                           label="联系人"
                           align="center"></el-table-column>
          <el-table-column prop="telphone"
                           label="联系电话"
                           align="center"></el-table-column>
          <el-table-column prop="useStatus"
                           label="状态"
                           :formatter="useStatusFormat"
                           align="center"></el-table-column>
          <el-table-column width="200px"
                           v-if="hasAuthority('02050402')"
                           label="操作"
                           align="left">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.$index, scope.row)"
                         class="el-button--primary operation-btn"
                         size="mini">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="ctc-foot1"
           v-if="total > 0">
        <span><span style="margin-right:10px">{{currentPage}}/{{totalPages}}页</span> 共{{total}}条记录</span>
        <el-pagination background
                       layout="prev, pager, next"
                       :page-size=pgSize
                       :total="total"
                       :current-page="currentPage"
                       @current-change="current_change">
        </el-pagination>
        <div class="pagingnum">
          显示 <select v-model="pgSize"
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
    <el-dialog title="新增供应商"
               :visible.sync="addGoodsDialogVisible"
               class="addGoodsDialog el_dialog_new "
               width="700px"
               @close="addGoodsDialogClose"
               :close-on-click-modal="false">
      <div class="dialog_content">
        <el-form :model="addData"
                 :rules="addFlowRules"
                 style="padding-top: 0"
                 ref="addData">
          <div class="content content2">
            <div class="half_page_title"
                 style="width:100%;padding: 0;margin-bottom: 10px">
              <div><i></i>基本信息</div>
            </div>
            <el-form-item prop="projectId">
              <span>项目简称<i class="required">*</i></span>
              <el-select v-model="addData.projectId"
                         style="width:100%"
                         @change="projectChange(addData.projectId, 'add');"
                         size="small">
                <el-option v-for="(item,index) in options1"
                           :key="item.id"
                           :label="item.referred"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="tenantId">
              <span>品牌名称<i class="required">*</i></span>
              <el-select v-model="addData.tenantId"
                         filterable
                         style="width:100%"
                         size="small">
                <el-option v-for="(item,index) in tenantOptionAdd"
                           :key="item.id"
                           :label="item.referred"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="name">
              <span>供应商名称<i class="required">*</i></span>
              <el-input v-model.trim="addData.name"
                        size="small"></el-input>
            </el-form-item>
            <el-form-item prop="contacts">
              <span>联系人<i class="required">*</i></span>
              <el-input v-model.trim="addData.contacts"
                        size="small"></el-input>
            </el-form-item>
            <el-form-item prop="telphone">
              <span>联系电话<i class="required">*</i></span>
              <el-input v-model.trim="addData.telphone"
                        type="tel"
                        size="small"></el-input>
            </el-form-item>
            <el-form-item prop="address">
              <span>联系地址<i class="required">*</i></span>
              <el-input v-model.trim="addData.address"
                        size="small"></el-input>
            </el-form-item>
            <el-form-item prop="supplierType">
              <span>节点类型<i class="required">*</i></span>
              <el-select v-model="addData.supplierType"
                         filterable
                         style="width:100%"
                         size="small">
                <el-option v-for="(item,index) in supplierTypeList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <div class="half_page_title"
                 style="width:100%;padding: 0;margin-bottom: 10px">
              <div><i></i>企业信息</div>
            </div>
            <el-form-item>
              <span>统一社会信用代码</span>
              <el-input v-model="addData.creditCode"
                        size="small"></el-input>
            </el-form-item>
            <el-form-item>
              <span>企业名称</span>
              <el-input v-model="addData.companyName"
                        size="small"></el-input>
            </el-form-item>
            <el-form-item>
              <span>公司地址</span>
              <el-input v-model="addData.companyAddress"
                        size="small"></el-input>
            </el-form-item>
            <el-form-item>
              <span>法人名字</span>
              <el-input v-model="addData.operName"
                        size="small"></el-input>
            </el-form-item>
            <el-form-item>
              <span>法人身份证</span>
              <el-input v-model="addData.iDNumber"
                        size="small"></el-input>
            </el-form-item>
            <el-form-item>
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
    <SupplierDetails :detailsdrawershow="detailsShow"
                     ref="SupplierDetails"
                     :draweDetaileData="detaileData"
                     @drawerClose="drawerClose" />
  </div>
</template>
<script>
import context from '@/service'
import SupplierDetails from './components/SupplierDetails'
export default {
  name: 'SupplierManagement',
  components: {
    SupplierDetails
  },
  data () {
    var cheackCoverImg = (rule, value, callback) => {
      if (!value || value === '') {
        return callback(new Error('请上传商品图片'))
      } else {
        callback()
      }
    }
    return {
      tenantOption: [],
      tenantOptionAdd: [],
      options1: [],
      addData: {
        tenantId: '',
        supplierType: ''
      },
      supplierTypeList: [
        { label: '屠宰场', value: 'SLAUGHTERHOUSE' },
        { label: '批发市场', value: 'WHOLESALE_MARKET' },
        { label: '标准化菜市场', value: 'STANDARDIZATION_FOOD' },
        { label: '标准化超市', value: 'SUPERMARKET_STORE' },
        { label: '配送中心', value: 'Distribution_Centre' },
        { label: '加工企业', value: 'PROCESSING_ENTERPRISES' },
        { label: '种植企业', value: 'PLANTING_ENTERPRISES' },
        { label: '团体采购', value: 'CATERING_GROUPS' },
        { label: '大卖场', value: 'HYPERMARKET' },
        { label: '养殖企业', value: 'BREEDING_ENTERPRISES' },
        { label: '餐饮企业', value: 'CATERING_ENTERPRISES' },
        { label: '其他', value: 'OTHER' }
      ],
      addFlowRules: {
        projectId: [
          { required: true, message: '请选择项目', trigger: 'select' }
        ],
        tenantId: [
          { required: true, message: '请选择品牌名称', trigger: 'select' }
        ],
        name: [
          { required: true, message: '请输入供应商名称', trigger: 'change' }
        ],
        contacts: [
          { required: true, message: '请输入联系人', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入联系地址', trigger: 'change' }
        ],
        supplierType: [
          { required: true, message: '请选择节点类型', trigger: 'change' }
        ],
        telphone: [
          { required: true, pattern: /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/, message: '请输入联系电话', trigger: 'change' }
        ]
      },
      seachParam: {
        useStatus: 'USING',
        projectId: '',
        name: '',
        tenantId: ''
      },
      detailsShow: false,
      iconImg: 'icon-shangchuantupianicon',
      upLoadText_cost: '上传图片',
      fileType_cost: ['png', 'jpg'],
      fileSize: 2,
      readonly: false,
      addGoodsDialogVisible: false,
      statusList: [
        { id: 'USING', name: '使用中' },
        { id: 'DISABLE', name: '已停用' }
      ],
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
        orderTime: ''
      },
      checkList: [],
      saleOptions: [
        { label: '是', value: '1' },
        { label: '否', value: '2' }
      ]
    }
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
    this.seachParam.projectId = this.$route.params.projectManagementId ? this.$route.params.projectManagementId : this.options1[0].id
    // this.projectChange(this.seachParam.projectId)
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
  mounted () {

  },
  methods: {
    changeProjectId () {
      this.tenantOption = []
      this.seachParam.tenantId = ''
    },
    addgoods () {
      this.$refs['addData'].validate((valid) => {
        if (valid) {
          context.http.post(`gos/api/supplier`, this.addData).then(res => {
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
      let result = await context.http.get('gos/api/supplier', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        projectId: this.seachParam.projectId,
        tenantId: this.seachParam.tenantId,
        name: this.seachParam.name,
        useStatus: this.seachParam.useStatus
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      this.totalPages = Math.ceil(this.total / this.pgSize)
    },
    useStatusFormat (row, column) {
      if (row.useStatus === 'USING') {
        return '使用中'
      } else {
        return '已停用'
      }
    },
    drawerClose () {
      this.query()
      this.detailsShow = false
    },
    setAnnex (annexURL, annexName) {
      this.$set(this.addData, 'imgUrl', annexURL)
    },
    addGoodsDialogClose () {
      this.addData = { tenantId: '' }
      this.$refs['addData'].resetFields()
      this.addGoodsDialogVisible = false
    },
    addGoodsOpen () {
      this.addGoodsDialogVisible = true
    },
    changeTab () {
      this.$router.push({
        name: 'tenantGoods',
        params: {}
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
      context.http.get(`gos/api/supplier/${row.id}`).then(res => {
        if (res) {
          this.detaileData = res.data
          this.detailsShow = true
        }
      })
    },
    switchover (name) {
      this.$router.push({ name: name, params: { projectManagementId: this.seachParam.projectId } })
    },
    async projectChange (id, type) {
      if (type === 'add') {
        this.tenantOptionAdd = []
        this.addData.tenantId = ''
      } else if (type === 'seach') {
        this.tenantOption = []
        this.seachParam.tenantId = ''
      }
      if (!id && type === 'add') {
        this.tenantOptionAdd = []
        this.addData.tenantId = ''
        return
      } else if (!id && type === 'seach') {
        this.tenantOption = []
        this.seachParam.tenantId = ''
        return
      }
      let result = await context.http.get('/cms/api/tenant', {
        // page: (this.pager.currentPage - 1),
        size: 9999,
        // sort: 'id,desc',
        id: id,
        tenantContractStatus: 'IN_THE_CONTRACT',
        useStatus: 'USING'
      })
      if (type === 'add') {
        this.tenantOptionAdd = result.data.content
      } else {
        this.tenantOption = result.data.content
      }
    }
  }
}
</script>
<style lang="scss">
.SupplierManagement,
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
            margin-top: 15px;
            .checkbox-group {
              width: 100%;
              .el-checkbox {
                width: 26%;
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
.SupplierManagement {
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
          width: 30%;
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
