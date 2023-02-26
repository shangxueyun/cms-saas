<template>
  <div class="visualSet">
    <span class="page_head_title">可视化配置</span>
    <div class="pl-content"
         style="padding-bottom:50px">
      <div class="add-bar">
        <div v-if="hasAuthority('02050501')">
          <el-button class="tban tban1"
                     @click="addDisualSet"><i class="iconfont icon-crm_xinzeng-"></i> 新增配置</el-button>
        </div>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  style="width: 100%"
                  ref="visualSet">
          <el-table-column prop="projectManagementName"
                           label="项目简称"
                           align="center"></el-table-column>
          <el-table-column prop="title"
                           label="大屏标题"
                           align="center"></el-table-column>
          <el-table-column prop="templateType"
                           :formatter="templateTypeFormat"
                           label="大屏模板"
                           align="center"></el-table-column>
          <el-table-column width="200px"
                           v-if="hasAuthority('02050502')||hasAuthority('02050503')"
                           label="操作"
                           align="center">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.$index, scope.row)"
                         v-if="hasAuthority('02050502')"
                         class="el-button--primary operation-btn"
                         size="mini">编辑</el-button>
              <span class="offlineBtn"
                    v-if="hasAuthority('02050503')"
                    @click="largeScreen(scope.$index, scope.row)">预览大屏</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 新增客户商品 -->
    <el-dialog :title="title"
               :visible.sync="addTenantGoodsVisible"
               class="addTenantGoodsDialog el_dialog_new "
               width="750px"
               @close="addVisualSetClose"
               :close-on-click-modal="false">
      <div class="menuTab">
        <span :class="{active:tabType===1}"
              @click="changeTab(1)">1. 选择模版</span>
        <span :class="{active:tabType===2}"
              @click="changeTab(2)">2.大屏信息</span>
      </div>
      <div class="shadowBox"></div>
      <div class="dialog_content">
        <el-form :model="addData"
                 :rules="addFlowRules"
                 ref="addData"
                 style="padding:0">
          <div class="content">
            <div class="selectMoudel"
                 v-show="tabType===1">
              <div class="half_page_title"
                   style="width:100%">
                <div><i></i>选择模版</div>
              </div>
              <div class="baseInfo">
                <el-form-item prop="projectManagementId">
                  <span>项目简称<i class="required">*</i></span>
                  <el-select v-model="addData.projectManagementId"
                             @change="projectChange"
                             :disabled="title ==='编辑配置'"
                             style="width:100%"
                             size="small"
                             placeholder="项目简称">
                    <el-option v-for="item in options1"
                               :key="item.id"
                               :label="item.referred"
                               :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="title">
                  <span>大屏标题<i class="required">*</i></span>
                  <el-input v-model="addData.title"
                            size="small"></el-input>
                </el-form-item>
                <el-form-item prop="template">
                  <span>大屏模版<i class="required">*</i></span>
                  <el-select v-model="addData.templateType"
                             style="width:100%"
                             size="small"
                             placeholder="请选择模版">
                    <el-option v-for="item in templateList"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item></el-form-item>
                <div class="preview"
                     v-if="addData.templateType === 'TEMP1'">
                  <img :src="templateImg1"
                       style="width:300px;height:170px"
                       class="templateImg">
                  <div class="pw-bottom"
                       @click="showImg(templateImg1)">
                    <span>预览图片</span>
                  </div>
                </div>
                <div class="preview"
                     v-else-if="addData.templateType === 'TEMP2'">
                  <img :src="templateImg2"
                       style="width:300px;height:170px"
                       class="templateImg">
                  <div class="pw-bottom"
                       @click="showImg(templateImg2)">
                    <span>预览图片</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="info"
                 v-show="tabType===2">
              <div class="half_page_title"
                   style="width:100%">
                <div><i></i>基本信息</div>
              </div>
              <div class="baseInfo">
                <el-form-item prop="startTime"
                              v-if="addTenantGoodsVisible">
                  <span>营业时间<i class="required">*</i></span>
                  <div>
                    <el-time-select placeholder="开始时间"
                                    style="width:120px"
                                    size="small"
                                    v-model="addData.startTime"
                                    :picker-options="{
                                      start: '00:00',
                                      step: '00:15',
                                      end: '23:59',
                                      maxTime: addData.endTime
                                    }">
                    </el-time-select>
                    <span>-</span>
                    <el-time-select placeholder="结束时间"
                                    style="width:120px"
                                    size="small"
                                    v-model="addData.endTime"
                                    :picker-options="{
                                      start: '00:00',
                                      step: '00:15',
                                      end: '23:59',
                                      minTime: addData.startTime
                                    }">
                    </el-time-select>
                  </div>
                </el-form-item>
                <el-form-item prop="passRate">
                  <span>抽检合格率<i class="required">*</i></span>
                  <el-input v-model="addData.passRate"
                            @keyup.native="number($event)"
                            type="number"
                            size="small">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="images"
                              style="width:100%">
                  <span>摊位分布图<i class="required">*</i></span>
                  <div style="display:flex;flex-wrap: wrap;">
                    <!-- <el-input v-model="addData.images"
                              style="display:none"></el-input> -->
                    <template v-if="addData.images.length">
                      <div v-for="(item,index) in addData.images"
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
                               v-if="addData.images.length<6"
                               @setAnnex="setAnnex" />
                  </div>
                  <div class="tips">(建议尺寸：16:9；支持格式JPG,PNG)</div>
                </el-form-item>
              </div>
              <div class="shadowBox"></div>
              <!-- <div class="half_page_title"
                   v-if="addData.templateType === 'TEMP1'"
                   style="width:100%">
                <div><i></i>菜品公示价</div>
              </div>

              <div class="half_page_title add" v-if="addData.templateType === 'TEMP1'">
                <div>添加商品</div>
              </div> -->
              <!--  -->
              <!-- <div class="model"
                   v-if="addData.templateType === 'TEMP1'"
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
                           @click="searchQuery()">查询</el-button>
              </div>
              <div v-if="addData.templateType === 'TEMP1' && searchQueryBle"
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
              </div> -->

              <!--  -->
              <!-- <div class="model"
                   v-if="addData.templateType === 'TEMP1' && addTableData.length > 0"
                   style="height: auto;margin: 0px 16px;padding: 0;">
                <p style="color: #3575F6;margin-top: 16px;">已选中商品 {{ addTableData.length }} 项</p>
              </div>

              <div class="gooodsList" v-if="addData.templateType === 'TEMP1'">
                <div class="goodsTable">
                  <el-table :data="addTableData"
                            style="width: 100%"
                            :row-class-name="tableRowClassName"
                            ref="addTableData">
                    <el-table-column prop="label"
                                     label="商品种类"
                                     align="center"></el-table-column>
                    <el-table-column label="公示价"
                                     align="center">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.publicPrice"
                                  style="width: 50%;"
                                  @keyup.native="if($event.target.value<0) scope.row.publicPrice=''"
                                  onmousewheel="return false;"
                                  type="number"
                                  size="small"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="单位"
                                     prop="unit"
                                     width="120px"
                                     align="center">
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
              </div> -->
            </div>
          </div>
        </el-form>
      </div>
      <div slot="footer"
           class="slotfooter">
        <span @click="addVisualSetClose"
              class="details_cannelBtn">关闭</span>
        <span class="details_submitBtn"
              v-if="tabType===1"
              @click="tabType=2">下一步</span>
        <span v-if="tabType===2"
              @click="tabType=1"
              class="details_cannelBtn">上一步</span>
        <span class="details_submitBtn"
              v-if="tabType===2"
              @click="saveTenantGoods()">确定</span>
      </div>
    </el-dialog>
    <!-- 图片预览 -->
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
  </div>
</template>
<script>

import aliUpload from '@/components/aliUpload.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import context from '@/service'
export default {
  name: 'visualSet',
  components: {
    aliUpload,
    picturePrevie
  },
  data () {
    return {
      title: '新增配置',
      addData: {
        'projectManagementId': '',
        'title': '',
        'templateType': 'TEMP1',
        'startTime': '',
        'endTime': '',
        'passRate': '',
        'images': [],
        'visualGoods': [
          // { 'goodsDepotId': '', 'publicPrice': '' }
        ]
      },
      templateImg1: require('../../../assets/moban1.png'),
      templateImg2: require('../../../assets/moban2.png'),
      addFlowRules: {
        projectManagementId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入大屏标题', trigger: 'change' }
        ],
        startTime: [
          {
            required: true,
            validator: (rules, value, cb) => {
              let { endTime } = this.addData
              if (!value || !endTime) {
                return cb(new Error('固定时间段不能为空!'))
              }
              return cb()
            },
            trigger: 'change'
          }
        ],
        passRate: [
          { required: true, message: '请输入抽检合格率', trigger: 'change' }
        ],
        images: [
          {
            required: true,
            validator: (rules, value, cb) => {
              let { images } = this.addData
              if (!images.length) {
                return cb(new Error('请上传摊位分布图!'))
              }
              return cb()
            },
            trigger: 'change'
          }
        ]
      },
      iconImg: 'icon-shangchuantupianicon',
      upLoadText_cost: '上传图片',
      fileType_cost: ['png', 'jpg'],
      showPicture: false,
      imgArr: [],
      num: 0,
      templateList: [
        { name: '模板一', id: 'TEMP1' },
        { name: '模板二', id: 'TEMP2' }
      ],
      tabType: 1,
      errorIndex: [],
      goodsType: [], // 新增级联商品种类
      goodsName: '', // 搜索种类value
      searchTableData: [], // 添加搜索临时数据
      searchQueryBle: false,
      searchTableEle: null,
      searchTableFlag: false,
      currentPageClass: 1,
      addTableData: [],
      editTableDatalength: null, // 存储数据
      addTenantGoodsVisible: false,
      options_using: [],
      options1: [],
      tableData: []
    }
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
    this.query()
  },
  mounted () {

  },
  methods: {
    number (e) {
      if (Number(e.target.value) < 0 || Number(e.target.value) === 0) {
        this.addData.passRate = ''
      }
    },
    templateTypeFormat (row, column) {
      if (row.templateType === 'TEMP1') {
        return '模板一'
      } else if (row.templateType === 'TEMP2') {
        return '模板二'
      }
    },
    projectChange (id) {
      if (id) {
        let text = ''
        this.options1.forEach((item, index) => {
          console.log(id)
          if (item.id === id) {
            text = item.referred
          }
        })
        this.addData.title = text + '数据中心'
      } else {
        this.addData.title = ''
      }
    },
    saveTenantGoods () {
      this.$refs['addData'].validate((valid) => {
        if (valid) {
          let arr = this.addTableData.map((item, index) => {
            if (item.publicPrice !== '' || item.publicPrice === 0) {
              let obj = {}
              obj.goodsDepotId = item.value
              obj.publicPrice = item.publicPrice
              return obj
            }
          })
          let visualGoods = arr.filter((item) => {
            return item
          })
          this.addData.visualGoods = visualGoods
          console.log(this.addData)
          if (this.title === '新增配置') {
            context.http.post(`gos/api/visualConfig`, this.addData).then(res => {
              if (res) {
                this.$message.success('新增成功')
                this.addVisualSetClose()
                this.queryRules()
              }
            })
          } else if (this.title === '编辑配置') {
            context.http.put(`gos/api/visualConfig`, this.addData).then(res => {
              if (res) {
                this.$message.success('修改成功')
                this.addVisualSetClose()
                this.queryRules()
              }
            })
          }
        } else {
          if (!this.addData.projectManagementId || !this.addData.title) {
            this.tabType = 1
          } else {
            this.tabType = 2
          }
          return false
        }
      })
    },
    addGoodsType (row) { // 往表格添加商品
      let obj = {
        label: '',
        value: '',
        parent: {}
      }
      obj.parent.value = row.goodsType.id
      obj.parent.label = row.goodsType.name
      obj.label = row.goodsKind
      obj.value = row.id
      obj.publicPrice = ''
      obj.unit = '元/kg'
      let id = obj.value
      let same = this.addTableData.some((item, index) => {
        return id === item.value
      })
      if (!same) {
        this.addTableData.push(obj)
      } else {
        this.$message.error('商品种类已存在')
      }
      // console.log(this.addTableData)
    },
    handleEdit (index, row) {
      this.getOptions_using()
      context.http.get(`gos/api/visualConfig/${row.id}`).then(res => {
        if (res) {
          this.title = '编辑配置'
          this.addTableData = res.data.visualGoods.map((item, index) => {
            let obj = {
              label: '',
              value: '',
              parent: {}
            }
            obj.parent.value = item.goodsDepot.goodsType
            obj.parent.label = item.goodsDepot.goodsTypeName
            obj.label = item.goodsDepot.goodsKind
            obj.value = item.goodsDepotId
            obj.publicPrice = item.publicPrice
            obj.unit = '元/kg'
            return obj
          })
          this.addData = res.data
          this.editTableDatalength = this.addTableData.length
          this.tabType = 2
          // console.log(this.addData, this.addTableData)
          this.addTenantGoodsVisible = true
        }
      })
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
    deleLogo (index) {
      this.addData.images.splice(index, 1)
    },
    setAnnex (annexURL, annexName) {
      this.addData.images.push(annexURL)
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
    changeTab (n) {
      this.tabType = n
    },
    async query () {
      let result = await context.http.get('gos/api/visualConfig/list', {
        sort: 'lastModifiedDate,desc'
      })
      this.tableData = result.data
      // this.total = Number(result.headers['x-total-count'])
      // this.totalPages = Math.ceil(this.total / this.pgSize)
    },
    tableRowClassName ({ row, rowIndex }) {
      if (this.errorIndex.includes(rowIndex)) {
        return 'warning-row'
      }
      return ''
    },
    addVisualSetClose () {
      this.tabType = 1
      this.addTableData = []
      this.goodsType = []
      this.addData = {
        'projectManagementId': '',
        'title': '',
        'templateType': 'TEMP1',
        'startTime': '',
        'endTime': '',
        'passRate': '',
        'images': [],
        'visualGoods': []
      }
      this.$refs['addData'].resetFields()
      this.addTenantGoodsVisible = false
      this.searchTableDataClear()
    },
    largeScreen (index, row) {
      let origin = window.location.origin
      window.open(origin + `/dv/#/VegetableMarket?projectManagementId=${row.projectManagementId}&id=${row.id}&templateType=${row.templateType}`, '_blank')
    },
    async getOptions_using () { // 商品二级类
      let result = await context.http.get(`gos/api/goodsClassifications/tree?flag=${false}&useStatus=USING`)
      this.options_using = result.data
    },
    searchTableDataClear () {
      this.goodsType = []
      this.searchQueryBle = false
      this.goodsName = ''
      this.searchTableData = []
    },
    deleteGoods (index, row) {
      this.addTableData.splice(index, 1)
    },
    addDisualSet () {
      this.title = '新增配置'
      this.getOptions_using()
      this.addTenantGoodsVisible = true
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
.visualSet {
  .el-dialog__wrapper.el_dialog_new .el-dialog .el-dialog__header {
    margin-bottom: 0;
  }
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
.visualSet {
  .shadowBox {
    height: 12px;
    background-color: #f7f7f7;
  }
  .menuTab {
    height: 60px;
    display: flex;
    padding: 0 20px;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #f6f6f6;
    > span {
      width: 340px;
      height: 40px;
      line-height: 40px;
      border-radius: 6px;
      padding-left: 15px;
      background-color: #f9f9f9;
      cursor: pointer;
      &.active {
        background-color: #3175d2;
        color: #fff;
      }
    }
  }
  .add-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: transparent;
    padding: 15px 20px;
    justify-content: flex-end;
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
        > div {
          width: 100%;
        }
        .baseInfo {
          padding: 15px;
          padding: 15px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          .preview {
            width: 300px;
            height: 170px;
            cursor: pointer;
            position: relative;
            &:hover {
              .pw-bottom {
                background-color: #262626;
                display: block;
                span {
                  position: absolute;
                  bottom: 3px;
                  color: #fff !important;
                  left: 36%;
                }
              }
            }
            .pw-bottom {
              display: none;
              position: absolute;
              background-color: #262626;
              opacity: 0.7;
              text-align: center;
              color: #fff;
              width: 100%;
              height: 30px;
              line-height: 30px;
              bottom: 0;
              font-size: 14px;
              .upload-icon {
                // background: url(../../../../assets/upload-white.png) no-repeat;
                background-size: contain;
                width: 12px;
                height: 12px;
                margin: 6px 6px 6px 0;
              }
            }
            img {
              width: 100%;
              height: 100%;
            }
            .map {
              width: 684px;
              height: 200px;
              border: 1px solid #ddd;
            }
            .iconfont {
              position: absolute;
              top: -10px;
              right: -10px;
            }
          }
          + p {
            font-size: 12px;
            color: #777;
            margin: 0 0 10px 0;
          }
          .el-form-item {
            width: 45%;
          }
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
        .model {
          width: 100%;
          border: none;
          justify-content: end;
          padding: 18px 16px;
        }
        .add {
          width: 100%;
          height: auto;
          padding-top: 8px;
          border: none;
          div {
            color: #777;
            font-size: 14px;
            font-weight: 400;
          }
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
.visualSet
  .el-table--scrollable-y
  .el-table__body-wrapper::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  background-color: #f2f2f2;
}
.visualSet .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
  width: 6px;
  background-color: #f2f2f2;
}
.visualSet
  .el-table--scrollable-y
  .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.25);
  background-color: #f5f5f5;
}
.visualSet .el-table::before {
  height: 0px !important;
}
</style>
