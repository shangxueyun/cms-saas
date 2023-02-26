
<template>
  <div class="tenantGoods1">
    <span class="page_head_title">商品信息</span>
    <div class="pl-content">
      <ul class="default_tab_block">
        <li v-if="hasAuthority('02050101')"
            @click="changeTab('farmerGoods')">
          <span>商品库</span>
        </li>
        <li class="active"
            v-if="hasAuthority('02050104')">
          <span>客户商品</span>
        </li>
        <li @click="changeTab('productConfig')"
            v-if="hasAuthority('02050108')">
          <span>采购商品配置</span>
        </li>
      </ul>
      <div class="search-bar">
        <div>
          <el-select v-model="seachParam.projectManagementId"
                     placeholder="项目简称"
                     style="width:170px">
            <el-option v-for="item in options1"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-input placeholder="品牌名称"
                    v-model="seachParam.tenantName"
                    style="width:170px"></el-input>

          <el-cascader :options="options"
                       @change="searchGoodsKindChange"
                       v-model="seachParam.goodsTypeArr"
                       style="margin-right:15px;width:170px"
                       placeholder="商品类型"
                       :props="{ checkStrictly: true }"
                       separator="-"
                       clearable />

          <el-input placeholder="商品名称"
                    v-model="seachParam.name"
                    style="width:170px"></el-input>
          <el-select v-model="seachParam.useStatus"
                     v-if="!seachParam.onLine"
                     clearable
                     placeholder="全部状态"
                     style="width:170px">
            <el-option v-for="item in statusList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id" />
          </el-select>
          <el-select v-model="seachParam.onLine"
                     @change="tableData=[];queryRules()"
                     style="width:170px"
                     placeholder="销售渠道">
            <el-option label="线上"
                       :value="true"></el-option>
            <el-option label="线下"
                       :value="false"></el-option>
          </el-select>
          <el-select v-model="seachParam.havePar"
                     @change="tableData=[];queryRules()"
                     clearable
                     style="width:170px"
                     placeholder="平价菜">
            <el-option label="是"
                       :value="true"></el-option>
            <el-option label="否"
                       :value="false"></el-option>
          </el-select>
          <span class="query-btn"
                @click="queryRules">查询</span>
        </div>
        <div v-if="hasAuthority('02050105')">
          <el-button class="tban tban1"
                     @click="addTenantGoods"><i class="iconfont icon-crm_xinzeng-"></i> 新增客户商品</el-button>
        </div>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  style="width: 100%"
                  key="key"
                  ref="tenantGoodsTable">
          <el-table-column label="项目简称"
                           :key="Math.random()"
                           prop="projectManagementName"
                           align="center" />
          <el-table-column label="品牌名称"
                           :key="Math.random()"
                           prop="tenantName"
                           align="center" />
          <el-table-column label="商品名称"
                           v-if="!seachParam.onLine"
                           :key="Math.random()"
                           prop="name"
                           align="center" />
          <el-table-column label="商品名称"
                           v-if="seachParam.onLine"
                           :key="Math.random()"
                           prop="lineName"
                           align="center" />
          <el-table-column label="产品代码"
                           :key="Math.random()"
                           v-if="!seachParam.onLine"
                           prop="produceNumber"
                           align="center" />
          <el-table-column label="商品类型"
                           :key="Math.random()"
                           prop="goodTypeName"
                           width="180"
                           align="center" />
          <el-table-column label="自定义分类"
                           :key="Math.random()"
                           v-if="!seachParam.onLine"
                           prop="groupName"
                           align="center" />
          <el-table-column label="计价类型"
                           :key="Math.random()"
                           v-if="!seachParam.onLine"
                           prop="priceTypeName"
                           align="center" />
          <el-table-column label="单位"
                           :key="Math.random()"
                           v-if="!seachParam.onLine"
                           prop="unitName"
                           align="center" />
          <el-table-column label="单价/元"
                           :key="Math.random()"
                           v-if="!seachParam.onLine"
                           prop="unitPrice"
                           align="center" />
          <el-table-column label="状态"
                           :key="Math.random()"
                           v-if="!seachParam.onLine"
                           :formatter="formatstatus"
                           align="center" />
          <el-table-column label="规格"
                           :key="Math.random()"
                           prop="specification"
                           :formatter="specificationFormat"
                           v-if="seachParam.onLine"
                           align="center" />
          <el-table-column label="售价/元"
                           :key="Math.random()"
                           prop="price"
                           v-if="seachParam.onLine"
                           align="center" />
          <el-table-column width="200px"
                           label="操作"
                           align="center">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.$index, scope.row)"
                         v-if="hasAuthority('02050106')"
                         class="el-button--primary operation-btn"
                         size="mini">
                编辑
              </el-button>
              <span class="onlineBtn"
                    @click="changeUseStatus(scope.$index, scope.row,'USING')"
                    v-if="scope.row.useStatus==='DISABLE' && hasAuthority('02050106') && !seachParam.onLine">上架</span>
              <span class="offlineBtn"
                    @click="changeUseStatus(scope.$index, scope.row,'DISABLE')"
                    v-if="scope.row.useStatus==='USING' && hasAuthority('02050106') && !seachParam.onLine">下架</span>
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
    <!-- 编辑客户商品 -->
    <TenantGoods :detailsdrawershow="detailsShow"
                 ref="TenantGoods"
                 :draweDetaileData="detaileData"
                 @edit="queryRules"
                 @drawerClose="drawerClose" />
    <!-- 新增客户商品 -->
    <el-dialog title="新增客户商品"
               :visible.sync="addTenantGoodsVisible"
               class="addTenantGoodsDialog el_dialog_new "
               width="960px"
               @close="addTenantGoodsClose"
               :close-on-click-modal="false">
      <div class="dialog_content">
        <el-form :model="addData"
                 :rules="addFlowRules"
                 ref="addData"
                 style="padding:0">
          <div class="content content2">
            <div class="half_page_title"
                 style="width:100%">
              <div><i></i>基本信息</div>
            </div>
            <div class="baseInfo">
              <el-select v-model="addData.projectManagementId"
                         clearable
                         size="small"
                         placeholder="项目简称"
                         @change="projectChange">
                <el-option v-for="item in options1"
                           :key="item.id"
                           :label="item.referred"
                           :value="item.id" />
              </el-select>
              <el-select v-model="addData.tenantId"
                         filterable
                         size="small"
                         @change="tenantChange"
                         placeholder="输入品牌名称搜索">
                <el-option v-for="item in tenantOption"
                           :key="item.id"
                           :label="item.referred"
                           :value="item.id" />
              </el-select>
              <!-- <el-autocomplete v-model="addData.teantName"
                               :fetch-suggestions="searchTeantName"
                               style="width:200px"
                               size="small"
                               @select="selectTenant"
                               placeholder="输入品牌名称搜索"></el-autocomplete> -->
            </div>
            <div class="half_page_title"
                 style="width:100%">
              <div><i></i>添加商品</div>
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
                           clearable />

              <el-input v-model="goodsName"
                        placeholder="商品种类"
                        @keyup.enter.native="searchQuery()"
                        style="width: 22%"></el-input>

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
                 v-if="addTableData.length > 0"
                 style="height: auto;margin: 0px 16px;padding: 0;">
              <p style="color: #3575F6">已选中商品 {{ addTableData.length }} 项</p>
            </div>

            <div class="gooodsList">
              <div class="goodsTable">
                <el-table :data="addTableData"
                          style="width: 100%"
                          :row-class-name="tableRowClassName"
                          ref="addTableData">
                  <el-table-column label="图片"
                                   align="center">
                    <template slot-scope="scope">
                      <img :src="scope.row.url"
                           style="width:30px;height:24px">
                    </template>
                  </el-table-column>
                  <el-table-column label="商品种类"
                                   prop="children.label"
                                   align="center" />
                  <el-table-column prop="name"
                                   label="商品名称"
                                   align="center">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.name"
                                @onkeyup="scope.row.name = scope.row.name.replace(/\s+/g,'')"
                                size="small" />
                    </template>
                  </el-table-column>
                  <el-table-column label="自定义分类"
                                   width="150"
                                   align="center">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.groupNumber"
                                 size="small">
                        <el-option v-for="(item,index) in groupNumberOptions"
                                   :key="index"
                                   :value="item.groupNumber"
                                   :label="item.name" />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="计价类型"
                                   width="120"
                                   align="center">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.priceType"
                                 @change="priceTypeChange($event,scope.row)"
                                 ref="priceTypeSelect"
                                 size="small">
                        <el-option v-for="(item,index) in priceTypeOptions"
                                   :key="index"
                                   :label="item.value"
                                   :value="item.id" />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="单位"
                                   width="120px"
                                   align="center">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.unit"
                                 size="small">
                        <el-option v-for="(item,index) in scope.row.unitOptions"
                                   :key="index"
                                   :label="item.value"
                                   :value="item.id"></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="单价/元"
                                   align="center">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.unitPrice"
                                @input="clearNoNum(scope.row, 'unitPrice')"
                                type="number"
                                size="small"></el-input>
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
import { goodTypeName } from '@/utils/validate'
import TenantGoods from '../components/TenantGoods'
export default {
  name: 'tenantGoods',
  components: {
    TenantGoods
  },
  data () {
    return {
      groupNumberOptions: [], // 自定义分类
      errorIndex: [],
      priceTypeOptions: [], // 计价类型
      unitOptions: [], // 单位
      tenantOption: [],
      goodsType: [], // 新增级联商品种类
      goodsName: '', // 搜索种类value
      addTableData: [],
      searchTableData: [], // 添加搜索临时数据
      searchQueryBle: false,
      searchTableEle: null,
      searchTableFlag: false,
      addTenantGoodsVisible: false,
      addFlowRules: {
        tenantId: [
          { required: true, message: '请选择项目后搜索', trigger: 'blur' }
        ],
        projectManagementId: [
          { required: true, message: '请选择项目', trigger: 'blur' }
        ]
      },
      addData: {
        projectManagementId: '',
        tenantId: ''
      },
      options: [],
      options_using: [],
      statusList: [
        { id: 'USING', name: '上架中' },
        { id: 'DISABLE', name: '已下架' }
      ],
      seachParam: {
        havePar: '',
        onLine: false,
        goodsType: '',
        goodsTypeArr: '',
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
    this.getPriceType()
    this.getOptions(true)
    if (this.$route.params.tenantGoodsFlag) {
      if (window.tenantGoodsFilter) {
        this.seachParam = window.tenantGoodsFilter
      }
    }
    if (this.$route.params.Filter) {
      this.seachParam.projectManagementId = this.$route.params.Filter.projectManagementId
    }
    this.query()
  },
  // 进入
  beforeRouteEnter (to, from, next) {
    if (from.name === 'farmerGoods' || from.name === 'tenantGoods' || from.name === 'productConfig') {
      to.params.tenantGoodsFlag = true
    } else {
      to.params.tenantGoodsFlag = false
    }
    next()
    // ...
  },
  // 离开
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    if (to.name === 'farmerGoods' || to.name === 'tenantGoods' || to.name === 'productConfig') {
      window.tenantGoodsFilter = this.seachParam
    } else {
      window.farmerGoodsFilter = undefined
      window.tenantGoodsFilter = undefined
      window.productConfigFilter = undefined
    }
    if (to.name === 'productConfig') {
      to.params.Filter = Object.assign(this.$route.params.Filter ? this.$route.params.Filter : {}, {})
      to.params.Filter.projectManagementId = this.seachParam.projectManagementId
    }
    next()
  },
  methods: {
    specificationFormat (row, cloum) {
      if (row.specification) {
        return row.specification + 'g'
      } else {
        return ''
      }
    },
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
      let result = await context.http.get('gos/api/tenant-goods', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        // sort: 'lastModifiedDate,desc',
        projectManagementId: this.seachParam.projectManagementId,
        tenantName: this.seachParam.tenantName,
        goodsType: this.seachParam.goodsType,
        sort: 'id,desc',
        name: this.seachParam.name,
        onLine: this.seachParam.onLine,
        havePar: this.seachParam.havePar,
        useStatus: this.seachParam.useStatus
      })
      result.data.forEach(arr => {
        arr.goodTypeName = goodTypeName(arr) // 回显商品类型
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
      if (!this.addData.projectManagementId || !this.addData.tenantId) {
        this.$message.error('请先选择对应的项目和品牌')
        return
      }
      if (!this.addTableData.length) {
        this.$message.error('请添加商品种类')
        return
      }
      let arr = this.addTableData.map((item, index) => {
        if (item.name === '' || item.priceType === '' || item.unit === '' || item.unitPrice === '') {

        } else {
          item.projectManagementId = this.addData.projectManagementId
          item.tenantId = this.addData.tenantId
          item.index = index
          item.imgUrl = item.url
          // item.groupNumber = groupNumber
          return item
        }
      })
      let paramsArr = arr.filter((item) => {
        return item
      })
      if (paramsArr.length !== this.addTableData.length) {
        this.$message.error('请填写商品信息')
        return
      }
      console.log(paramsArr)
      this.$refs['addData'].validate((valid) => {
        if (valid) {
          context.http.post(`gos/api/tenant-goods`, paramsArr).then(res => {
            if (!res.data) {
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
        unitOptions: []
      }
      console.log(obj)
      this.addTableData.push(obj)
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
      context.http.get('gos/api/goods-depots', {
        page: (this.currentPageClass - 1),
        size: 9999, // 后续数量修改
        sort: 'lastModifiedDate,desc',
        goodsType: this.goodsType.toString(),
        name: this.goodsName,
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
          that.$refs.searchTableData.bodyWrapper.scrollTop = 0
          // if (that.currentPageClass === 1 && !flag) {
          //   // 数据
          //   that.$nextTick(() => {
          //     // 获取需要绑定的table
          //     that.searchTableEle = that.$refs.searchTableData.bodyWrapper
          //     that.searchTableEle.removeEventListener('scroll', () => { }, true)
          //     that.searchTableEle.addEventListener('scroll', (e) => {
          //       // 滚动距离
          //       let scrollTop = that.searchTableEle.scrollTop
          //       // 变量windowHeight是可视区的高度
          //       let windowHeight = that.searchTableEle.clientHeight || that.searchTableEle.clientHeight
          //       // 变量scrollHeight是滚动条的总高度
          //       let scrollHeight = that.searchTableEle.scrollHeight || that.searchTableEle.scrollHeight
          //       if (scrollTop + windowHeight === scrollHeight) {
          //         if (!that.searchTableFlag) {
          //           setTimeout(that.searchQuery(true, e), 200)
          //         }
          //         // 获取到的不是全部数据 当滚动到底部 继续获取新的数据
          //         console.log('scrollTop', scrollTop + 'windowHeight', windowHeight + 'scrollHeight', scrollHeight)
          //       }
          //     }, false)
          //   })
          // }
        } else {
          if (that.searchTableData.length === 0 || that.currentPageClass === 1) {
            that.searchTableData = []
          }
        }
      })
    },
    addTenantGoodsClose () {
      this.addData.projectManagementId = ''
      this.addData.tenantId = ''
      this.goodsType = []
      this.goodsName = ''
      this.searchQueryBle = false
      this.groupNumberOptions = []
      this.addTableData = []
      this.errorIndex = []
      this.addTenantGoodsVisible = false
      this.searchTableDataClear()
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
    async projectChange (id) {
      this.addData.tenantId = ''
      if (!id) {
        this.tenantOption = []
        return
      }
      let result = await context.http.get('/cms/api/tenant', {
        // page: (this.pager.currentPage - 1),
        size: 9999,
        // sort: 'id,desc',
        id: this.addData.projectManagementId,
        tenantContractStatus: 'IN_THE_CONTRACT',
        useStatus: 'USING'
      })
      this.tenantOption = result.data.content
    },
    priceTypeChange (val, item) {
      item.unit = ''
      let obj = this.priceTypeOptions.find((item) => {
        return item.id === val
      })
      this.getUnit(obj.value, item)
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
    },
    // async getOptions_using () { // 商品种类
    //   let result = await context.http.get('gos/api/goods-depots/goodsType', { useStatus: 'USING' })
    //   this.options_using = result.data
    // },
    async getPriceType () { // 计价类型
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=计价类型')
      this.priceTypeOptions = result.data
    },
    async getUnit (unit, item) { // 单位
      let result = await context.http.get(`/uaa/api/paramet-managements/name?name=${unit}类型`)
      item.unitOptions = result.data
    },
    deleteGoods (index, row) {
      this.addTableData.splice(index, 1)
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
      this.getOptions(false)
      this.addTenantGoodsVisible = true
    },
    searchTableDataClear () {
      this.goodsType = []
      this.searchQueryBle = false
      this.goodsName = ''
      this.searchTableData = []
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
      context.http.get(`gos/api/tenant-goods/${row.id}`).then(res => {
        if (res) {
          this.detaileData = res.data
          this.detailsShow = true
        }
      })
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
.tenantGoods1 {
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
.tenantGoods1 {
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
.tenantGoods1
  .el-table--scrollable-y
  .el-table__body-wrapper::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  background-color: #f2f2f2;
}
.tenantGoods1
  .el-table--scrollable-y
  .el-table__body-wrapper::-webkit-scrollbar {
  width: 6px;
  background-color: #f2f2f2;
}
.tenantGoods1
  .el-table--scrollable-y
  .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.25);
  background-color: #f5f5f5;
}
.tenantGoods1 .el-table::before {
  height: 0px !important;
}
</style>
