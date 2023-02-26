
<template>
  <div class="productConfig">
    <span class="page_head_title">商品信息</span>
    <div class="pl-content">
      <ul class="default_tab_block">
        <li v-if="hasAuthority('02050101')"
            @click="changeTab('farmerGoods')">
          <span>商品库</span>
        </li>
        <li @click="changeTab('tenantGoods')"
            v-if="hasAuthority('02050104')">
          <span>客户商品</span>
        </li>
        <li class="active"
            v-if="hasAuthority('02050108')">
          <span>采购商品配置</span>
        </li>
      </ul>
      <div class="search-bar">
        <div>
          <el-select v-model="seachParam.projectManagementId"
                     placeholder="项目简称">
            <el-option v-for="item in options1"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>

          <el-input placeholder="采购商品名称"
                    v-model="seachParam.name"
                    style="width:200px"></el-input>

          <el-input placeholder="对应商品种类"
                    v-model="seachParam.goodsKind"
                    style="width:200px"></el-input>

          <span class="query-btn"
                @click="queryRules">查询</span>
        </div>
        <div v-if="hasAuthority('02050109')">
          <el-button class="tban tban1"
                     @click="addTenantGoods"><i class="iconfont icon-crm_xinzeng-"></i> 新增采购商品</el-button>
        </div>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  style="width: 100%"
                  ref="tenantGoods">
          <el-table-column label="项目简称"
                           prop="projectManagementName"
                           align="center" />
          <el-table-column label="采购商品名称"
                           prop="name"
                           align="center" />
          <el-table-column label="关联SAAS编码"
                           show-overflow-tooltip
                           prop="saasCode"
                           align="center" />
          <el-table-column label="对应商品种类"
                           show-overflow-tooltip
                           prop="goodTypeName"
                           align="center" />
          <el-table-column width="200px"
                           label="操作"
                           v-if="hasAuthority('02050111')"
                           align="center">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.$index, scope.row)"
                         class="el-button--primary"
                         size="mini">
                查看
              </el-button>
              <!-- <span class="onlineBtn"
                    @click="changeUseStatus(scope.$index, scope.row,'USING')"
                    v-if="scope.row.useStatus==='DISABLE' && hasAuthority('02050106')">上架</span>
              <span class="offlineBtn"
                    @click="changeUseStatus(scope.$index, scope.row,'DISABLE')"
                    v-if="scope.row.useStatus==='USING' && hasAuthority('02050106')">下架</span> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="total > 0"
           class="ctc-foot1">
        <span><span style="margin-right:10px">{{currentPage}}/{{totalPages}}页</span> 共{{total}}条记录</span>

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
                    :value="item.value" />
          </select>
          条目
        </div>
      </div>
    </div>
    <!-- 编辑采购商品 -->
    <productConfigDetails
                 :detailsdrawershow="detailsShow"
                 ref="productConfig"
                 :configObject="{
                   projectList: options1,
                   options_using: options_using
                 }"
                 :draweDetaileData="detaileData"
                 @edit="queryRules"
                 @drawerClose="drawerClose" />
    <!-- 新增采购商品 -->
    <el-dialog title="新增采购商品"
               :visible.sync="addTenantGoodsVisible"
               class="addTenantGoodsDialog el_dialog_new drawer_new"
               width="850px"
               @close="addTenantGoodsClose"
               :close-on-click-modal="false">
      <div class="dialog_content details_content drawer-body">
        <el-form :model="addData"
                 :rules="addFlowRules"
                 ref="addData"
                 style="padding:0">
          <div class="content">
            <div class="half_page_title"
                 style="width:100%">
              <div><i></i>基本信息</div>
            </div>
            <div class="baseInfo">
            <el-form-item prop="projectManagementId">
              <span>项目简称<i class="required">*</i></span>
              <el-select v-model="addData.projectManagementId"
                         size="small"
                         placeholder="项目简称"
                         @change="getSAAScodeList">
                <el-option v-for="item in options1"
                           :key="item.id"
                           :label="item.referred"
                           :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item prop="name">
              <span>采购商品名称<i class="required">*</i></span>
              <el-input size="small"
                        v-model="addData.name"
                        ></el-input>
            </el-form-item>
            <el-form-item>
              <span>选择SAAS编码</span>
              <el-cascader ref="cascaderSaasCode"
                           style="width: 100%"
                           :options="SAAScodeList"
                           :show-all-levels="false"
                           v-model="addData.saasCode"
                           placeholder=""
                           collapse-tags
                           :props="{
                            checkStrictly: true,
                            multiple: true
                           }"
                           clearable
                           @change="saasCodeChange"
                           />
            </el-form-item>
              <!-- <el-autocomplete v-model="addData.teantName"
                               :fetch-suggestions="searchTeantName"
                               style="width:200px"
                               size="small"
                               @select="selectTenant"
                               placeholder="输入品牌名称搜索"></el-autocomplete> -->
            </div>
            <div class="half_page_title"
                 style="width:100%">
              <div><i></i>添加商品种类</div>
            </div>
            <!--  -->
            <div class="model"
                 style="height: 38px;margin: 18px 16px;padding: 0;margin-bottom: 4px;">
              <el-cascader ref="cascader"
                           :options="options_using"
                           v-model="goodsType"
                           placeholder="商品类型"
                           :props="{ checkStrictly: true }"
                           separator="-"
                           @change="cascaderChange"
                            />

              <el-button type="primary"
                         @click.stop="searchQuery()">查询</el-button>
            </div>
            <div v-if="searchQueryBle"
                 class="model">
              <el-table :data="searchTableData"
                        height="242px"
                        ref="searchTableData"
                        style="width: 100%">
                <el-table-column label="商品种类"
                                 prop="goodsKind"
                                 align="center" />
                <el-table-column label="大小类"
                                 align="center">
                  <template slot-scope="scope">
                    <span>{{ `${scope.row.goodsType.parent.name}-${scope.row.goodsType.name}` }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作"
                                 align="center">
                  <template slot-scope="scope">
                    <span style="color: #3575F6;cursor: pointer;"
                          @click="addGoodsType(scope.row)">添加</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!--  -->
            <div class="model"
                 v-if="addTableData.length"
                 style="height: auto;margin: 0px 16px;padding: 0;">
              <p style="color: #3575F6">已选择 {{ addTableData.length }} 种商品种类</p>
            </div>

            <div class="gooodsList">
              <div class="goodsTable">
                <el-table :data="addTableData"
                          style="width: 100%"
                          height="242px"
                          :row-class-name="tableRowClassName">
                  <el-table-column label="商品种类"
                                  prop="name"
                                  align="center" />
                  <el-table-column label="大小类"
                                  align="center">
                    <template slot-scope="scope">
                      <span>{{ `${scope.row.groupChildren.goodsType.parent.name}-${scope.row.groupChildren.goodsType.name}` }}</span>
                    </template>
                  </el-table-column>
                    <el-table-column label="操作"
                                    align="center">
                      <template slot-scope="scope">
                        <span class="deleteGoods"
                              @click="deleteGoods(scope.$index, scope.row)">删除</span>
                      </template>
                    </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </el-form>
      </div>
      <div slot="footer"
           class="slotfooter">
        <span @click="addTenantGoodsClose"
              class="details_cannelBtn">取消</span>
        <span class="details_submitBtn"
              @click="saveTenantGoods()">确定</span>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import img from '@/assets/noBrand.png'
import context from '@/service'
import { goodTypeName, ArrayRecursion } from '@/utils/validate'
import productConfigDetails from '../components/productConfigDetails.vue'
export default {
  name: 'tenantGoods',
  components: {
    productConfigDetails
  },
  data () {
    return {
      groupNumberOptions: [], // 自定义分类
      errorIndex: [],
      priceTypeOptions: [], // 计价类型
      unitOptions: [], // 单位
      tenantOption: [],
      goodsType: [11, 1], // 新增级联商品种类
      goodsName: '', // 搜索种类value
      addTableData: [],
      searchTableData: [], // 添加搜索临时数据
      searchQueryBle: false,
      searchTableEle: null,
      searchTableFlag: false,
      addTenantGoodsVisible: false,
      addFlowRules: {
        name: [
          { required: true, message: '请输入采购商品名称', trigger: 'blur' }
        ],
        projectManagementId: [
          { required: true, message: '请选择项目', trigger: 'blur' }
        ]
      },
      addData: {
        projectManagementId: '',
        projectManagementName: '',
        name: '',
        saasCode: '',
        goodsDepots: []
      },
      options: [],
      options_using: [],
      statusList: [
        { id: 'USING', name: '上架中' },
        { id: 'DISABLE', name: '已下架' }
      ],
      seachParam: {
        goodsType: '',
        goodsKind: '',
        projectManagementId: '',
        tenantName: '',
        name: '',
        useStatus: 'USING'
      },
      detailsShow: false,
      detaileData: {
        goodsDepot: {}
      },
      options1: [],
      SAAScodeList: [
      ],
      tableData: [],
      currentPage: 1,
      currentPageClass: 1,
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
      ]
    }
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
    this.seachParam.projectManagementId = this.options1[0].id
    if (this.$route.params.productConfigFlag) {
      if (window.productConfigFilter) {
        this.seachParam = window.productConfigFilter
      }
    }
    if (this.$route.params.Filter) {
      this.seachParam.projectManagementId = this.$route.params.Filter.projectManagementId
    }
    this.getOptions(true)
    this.query()
  },
  // 进入
  beforeRouteEnter (to, from, next) {
    if (from.name === 'farmerGoods' || from.name === 'tenantGoods' || from.name === 'productConfig') {
      to.params.productConfigFlag = true
    } else {
      to.params.productConfigFlag = false
    }
    next()
    // ...
  },
  // 离开
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    if (to.name === 'farmerGoods' || to.name === 'tenantGoods' || to.name === 'productConfig') {
      window.productConfigFilter = this.seachParam
    } else {
      window.farmerGoodsFilter = undefined
      window.tenantGoodsFilter = undefined
      window.productConfigFilter = undefined
    }
    if (to.name === 'tenantGoods') {
      to.params.Filter = Object.assign(this.$route.params.Filter ? this.$route.params.Filter : {}, {})
      to.params.Filter.projectManagementId = this.seachParam.projectManagementId
    }
    next()
  },
  methods: {
    tenantChange (tenantId) {
      this.getGoodsGroup(tenantId)
    },
    async getGoodsGroup (tenantId) { // 自定义分类下拉
      let result = await context.http.get(`gos/api/goodsGroup/list?tenantId=${tenantId}`)
      this.groupNumberOptions = result.data

      // 清空已有的值
      this.addTableData.forEach(v => {
        v.groupNumber = ''
      })
    },
    // 三级切换value
    searchGoodsKindChange (row, e) {
      this.seachParam.goodsType = row.toString()
    },
    async query () {
      let result = await context.http.get('gos/api/purchaseGoodsSetting', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'lastModifiedDate,desc',
        projectManagementId: this.seachParam.projectManagementId,
        name: this.seachParam.name,
        goodsKind: this.seachParam.goodsKind
      })
      result.data.forEach((v, i) => {
        result.data[i].goodTypeName = []
        v.goodsDepots.forEach(o => {
          result.data[i].goodTypeName.push(o.goodsKind)
        })
        // 按照需求只能显示小于等于3
        if (result.data[i].goodTypeName.length <= 3) {
          result.data[i].goodTypeName = result.data[i].goodTypeName.toString().replace(/,/g, '、')
        } else {
          let arr = result.data[i].goodTypeName
          result.data[i].goodTypeName = `${arr[0]}、${arr[1]}、${arr[2]}...`
        }
        result.data[i].saasCode = result.data[i].saasCode.replace(/,/g, '、')
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      this.totalPages = Math.ceil(this.total / this.pgSize)
    },
    tableRowClassName ({ row, rowIndex }) {
      if (this.errorIndex.includes(rowIndex)) {
        return 'warning-row'
      }
      return ''
    },
    saveTenantGoods () {
      if (!this.addTableData.length) {
        this.$message.error('请添加商品种类')
        return
      }
      let goodsDepots = this.addTableData.map((item, index) => {
        return item.groupChildren
      })
      let paramsArr = Object.assign(this.addData, { goodsDepots })
      if (typeof paramsArr.saasCode !== 'string') {
        paramsArr.saasCode.forEach((v, i) => {
          paramsArr.saasCode[i] = v[1]
        })
        paramsArr.saasCode = paramsArr.saasCode.toString()
      }
      console.log(paramsArr)
      this.$refs['addData'].validate((valid) => {
        if (valid) {
          context.http.post(`gos/api/purchaseGoodsSetting`, paramsArr).then(res => {
            if (res.data) {
              this.$message.success('新增成功')
              this.addTenantGoodsClose()
              this.queryRules()
            } else {
              this.$message.error('已有该商品，不能重复添加！')
              this.errorIndex = res.data
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addGoodsType (row) { // 往表格添加商品
      let obj = {
        value: '',
        children: {
          label: row.goodsKind,
          value: row.id
        },
        goodsDepotId: row.id,
        name: row.goodsKind,
        priceType: '',
        unit: '',
        groupNumber: '',
        unitPrice: 0,
        url: row.imgUrl,
        label: row.goodsKind,
        unitOptions: [],
        groupChildren: row
      }
      this.addTableData.push(obj)
      this.searchTableData = this.goodsTypeDataFilter(this.addTableData, this.searchTableData)
    },
    cascaderChange (row) {
      if (row.length) {
        this.goodsType = row
      } else {
        this.goodsType = []
      }
    },
    searchQuery (flag) {
      // 滚动标识拦截
      if (!this.searchTableFlag) {
        this.searchTableFlag = true
      } else {
        return
      }
      // // 条件1 条件2
      if (this.goodsName === '' && this.goodsType.length === 0) {
        this.searchTableFlag = false
        this.searchQueryBle = false
        return
      }
      // 请求接口
      let that = this
      // 每次点击搜索重置
      if (flag) {
        this.currentPageClass++
      } else {
        this.currentPageClass = 1
      }
      context.http.get('gos/api/goods-depots/goodsSettiing', {
        page: (this.currentPageClass - 1),
        size: 9999, // 后续数量修改
        sort: 'lastModifiedDate,desc',
        goodsType: this.goodsType.toString(),
        name: this.goodsName,
        projectManagementId: this.addData.projectManagementId,
        useStatus: 'USING'
      }).then(res => {
        that.searchTableFlag = false
        that.searchQueryBle = true
        if (res.data.length) {
          if (that.currentPageClass > 1) {
            that.searchTableData = that.searchTableData.concat(JSON.parse(JSON.stringify(res.data)))
          } else {
            that.searchTableData = JSON.parse(JSON.stringify(res.data))
          }
          that.searchTableData = that.goodsTypeDataFilter(that.addTableData, that.searchTableData)
          that.$refs.searchTableData.bodyWrapper.scrollTop = 0
        } else {
          if (that.searchTableData.length === 0 || that.currentPageClass === 1) {
            that.searchTableData = []
          }
        }
      })
    },
    goodsTypeDataFilter (searchData, Data) {
      searchData.forEach(o => {
        Data.forEach((v, i) => {
          if (o.goodsDepotId === v.id) {
            Data.splice(i, 1)
          }
        })
      })
      return Data
    },
    addTenantGoodsClose () {
      this.addData.projectManagementId = ''
      this.goodsType = []
      this.goodsName = ''
      this.searchQueryBle = false
      this.groupNumberOptions = []
      this.addTableData = []
      this.errorIndex = []
      this.addTenantGoodsVisible = false
      this.searchTableDataClear()
      let vm = this
      this.$nextTick(() => {
        vm.$refs['addData'].resetFields()
      })
    },
    changeUseStatus (index, row, useStatus) {
      row.useStatus = useStatus
      context.http.put(`gos/api/tenant-goods`, row).then(res => {
        if (res) {
          if (useStatus === 'USING') {
            this.$message.success('上架成功')
          } else {
            this.$message.error('下架成功')
          }
          this.queryRules()
        }
      })
    },
    async getSAAScodeList (id) {
      this.addData.saasCode = ''
      this.addTableData = []
      this.options1.forEach(v => {
        if (id === v.id) {
          this.addData.projectManagementName = v.referred
          this.addData.projectManagementId = v.id
        }
      })
      let result = await context.http.get('/gos/api/saasCodeInfos/tree', {
        projectId: id
      })
      // JSON.parse(JSON.stringify(result.data).replace(/"child":\[],/g, ''))
      this.SAAScodeList = JSON.parse(ArrayRecursion(result.data))
      this.searchQuery()
    },
    async getOptions (flag) { // 商品三级类
      // 列表数据筛选是三级/新增是二级
      if (flag) {
        let result = await context.http.get(`gos/api/goodsClassifications/tree?flag=${flag}`)
        this.options = result.data
      } else {
        let result = await context.http.get(`gos/api/goodsClassifications/tree?flag=${flag}&useStatus=USING`)
        this.options_using = result.data
      }

      this.goodsType = []
      if (this.options_using[0]) {
        this.goodsType.push(this.options_using[0].value)
        if (this.options_using[0].children) {
          this.goodsType.push(this.options_using[0].children[0].value)
          if (this.options_using[0].children[0].children) {
            this.goodsType.push(this.options_using[0].children[0].children[0].value)
          }
        }
      }
      this.searchQuery()
    },
    saasCodeChange (row) {},
    treeChang (row) {},
    deleteGoods (index, row) {
      this.addTableData.splice(index, 1)
      this.goodsType = [row.groupChildren.goodsType.parent.id, row.groupChildren.goodsType.id]
      this.searchQuery()
    },
    // selectTenant (item) {
    //   console.log(item)
    // },
    // async searchTeantName (queryString, callback) {
    //   var list = [{}]
    //   if (!queryString || queryString === '') {
    //     return false
    //   }
    //   let result = await context.http.get('/qichacha/ECIV4/Search', { key: '2f3415aa9d1c4201837f8ca4215b91eb', keyWord: queryString })
    //   if (result.data.Status === '200') {
    //     var results = result.data.Result
    //     for (let i of results) {
    //       i.value = i.Name  // 将想要展示的数据作为value
    //     }
    //     list = result.data.Result
    //     callback(list)
    //   }
    // },
    addTenantGoods () {
      this.addTenantGoodsClose()
      this.addData.projectManagementId = this.seachParam.projectManagementId
      this.getOptions(false)
      this.getSAAScodeList(this.addData.projectManagementId)
      this.addTenantGoodsVisible = true
    },
    searchTableDataClear () {
      this.goodsType = []
      this.searchQueryBle = false
      this.goodsName = ''
      this.searchTableData = []
      this.addData = {
        projectManagementId: '',
        projectManagementName: '',
        name: '',
        saasCode: '',
        goodsDepots: []
      }
    },
    clearNoNum (key, name) {
      this.$nextTick(() => {
        let obj
        this.addTableData.forEach(v => {
          if (v.children.value === key.children.value) {
            obj = v[name]
          }
        })
        obj = obj.replace(/[^\d.]/g, '')  // 清除“数字”和“.”以外的字符
        obj = obj.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        obj = obj.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        // eslint-disable-next-line no-useless-escape
        obj = obj.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')// 只能输入两个小数
        if (obj.indexOf('.') < 0 && obj !== '') { // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          obj = parseFloat(obj)
        }
        // this.addTableData.forEach(v => {
        //   if (v.children.value === key.children.value) {
        //     v[name] = obj
        //   }
        // })
      })

      // this.value = obj
    },
    formatstatus (row, column) {
      switch (row.useStatus) {
        case 'USING':
          return '上架中'
        case 'DISABLE':
          return '已下架'
      }
    },
    formatTime (row, column) {
      if (row.updateTime) {
        return row.updateTime.replace('T', '  ')
      } else {
        return '-'
      }
    },
    drawerClose () {
      this.detailsShow = false
    },
    handleEdit (index, row) {
      // context.http.get(`gos/api/purchaseGoodsSetting/${row.id}`).then(res => {
      //   if (res) {
      //     this.detaileData = res.data
      //     this.detailsShow = true
      //   }
      // })
      this.detaileData = row
      this.detailsShow = true
    },
    changeTab (type) {
      this.$router.push({
        name: type,
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
    }
  }
}
</script>
<style lang="scss">
.productConfig {
  .warning-row {
    color: #606266;
    .el-input__inner {
      border: 1px solid #ff0707;
    }
  }
  .addTenantGoodsDialog {
    .gooodsList {
      .btn {
        border: 1px solid #dcdfe6;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        display: inline-block;
        margin-bottom: 15px;
        > span {
          color: #777777;
          font-size: 14px;
          padding-left: 10px;
          &.addBtn {
            display: inline-block;
            width: 90px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            padding-left: 0;
            cursor: pointer;
            color: #fff;
            background-color: #3575f6;
            border-bottom-right-radius: 4px;
            border-top-right-radius: 4px;
          }
        }
        .el-input__inner {
          border: none;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.productConfig {
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
      border: 1px solid #f3af2c;
      border-radius: 3px;
      color: #f3af2c;
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
  .addTenantGoodsDialog {
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
        .baseInfo {
          padding: 15px;
          width: 100%;
          display: flex;
          .el-form-item {
            margin-right: 20px;
            width: 32%;
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
        .model {
          width: 100%;
          border: none;
          justify-content: end;
          padding: 18px 16px;
        }
        .gooodsList {
          padding: 15px;
          width: 100%;
          .deleteGoods {
            color: #d01522;
            cursor: pointer;
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
}
</style>
<style>
.productConfig .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.08);
  border-radius: 10px;
  background-color: #f2f2f2;
}
.productConfig .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
	width: 6px;
	background-color: #f2f2f2;
}
.productConfig .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb {
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.25);
	background-color: #f5f5f5;
}
.productConfig .el-table::before{
  height: 0px !important
}
.productConfig .baseInfo .el-input__inner{
  height: 40px !important;
  line-height: 40px;
}
</style>
