
<template>
  <div class="farmerGoods">
    <span class="page_head_title">商品信息</span>
    <div class="pl-content">
      <ul class="default_tab_block">
        <li class="active" v-if="hasAuthority('02050101')">
          <span>商品库</span>
        </li>
        <li @click="changeTab('tenantGoods')" v-if="hasAuthority('02050104')">
          <span>客户商品</span>
        </li>
        <li @click="changeTab('productConfig')" v-if="hasAuthority('02050108')">
          <span>采购商品配置</span>
        </li>
      </ul>
      <div class="search-bar">
        <div>
          <!-- <el-cascader :options="options"
                       style="margin-right:15px"
                       :props="{ checkStrictly: true }"
                       @change="optionsChange"
                       clearable></el-cascader> -->
          <!-- <el-select v-model="seachParam.goodsType" clearable placeholder="商品类型">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> -->

          <!-- demo -->
          <el-cascader
            style="margin-right:15px"
            v-model="seachParam.goodsTypeArr"
            ref="cascadergoodsClassify"
            :options="kindOption"
            clearable
            placeholder="商品类型"
            :props="{ checkStrictly: true }"
            separator="-"
            @change="searchGoodsKindChange">
          </el-cascader>

          <el-input placeholder="商品种类" v-model="seachParam.name" style="width:200px"></el-input>
          <el-select v-model="seachParam.useStatus" clearable placeholder="状态">
            <el-option
              v-for="item in statusList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <span class="query-btn"
                @click="queryRules">查询</span>
        </div>
        <div v-if="hasAuthority('02050102')">
          <el-button class="tban tban1" @click="addGoodsOpen"><i class="iconfont icon-crm_xinzeng-"></i> 新增商品种类</el-button>
        </div>
      </div>
      <div class="plc-table">
        <el-table
          :data="tableData"
          style="width: 100%"
          ref="multipleTable">
          <el-table-column
            label="商品图片"
            align="center">
            <template slot-scope="scope">
              <img :src="scope.row.imgUrl" style="width:30px;height:30px">
            </template>
          </el-table-column>

          <el-table-column
            prop="goodsType.parent.name"
            label="大类"
            align="center" />

          <el-table-column
            prop="goodsType.name"
            label="小类"
            align="center" />

          <el-table-column
            prop="goodsKind"
            label="商品种类"
            align="center" />

          <el-table-column
            prop="shelfLife"
            label="保质期天数"
            align="center" />

          <el-table-column
            prop="useStatus"
            label="状态"
            :formatter="useStatusFormat"
            align="center" />

          <el-table-column
            width="200px"
            label="操作"
            align="left">
            <template slot-scope="scope">
              <!-- <span class="onlineBtn"
                    @click="changeUseStatus(scope.$index, scope.row,'USING')"
                    v-if="scope.row.useStatus==='DISABLE' && hasAuthority('02050103')">启用</span>
              <span class="offlineBtn"
                    @click="changeUseStatus(scope.$index, scope.row,'DISABLE')"
                    v-if="scope.row.useStatus==='USING' && hasAuthority('02050103')">禁用</span> -->
              <el-button
                @click="handleEdit(scope.$index, scope.row)"
                class="el-button--primary operation-btn"
                size="mini">
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="total > 0" class="ctc-foot1" >
        <span>
          <span style="margin-right:10px">{{currentPage}}/{{totalPages}}页</span> 共{{total}}条记录
        </span>
        <el-pagination
          background
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
    <el-dialog
      title="新增商品种类"
      :visible.sync="addGoodsDialogVisible"
      class="addGoodsDialog el_dialog_new "
      width="700px"
      @close="addGoodsDialogClose"
      :close-on-click-modal="false">
        <div class="dialog_content">
          <el-form :model="addData" :rules="addFlowRules" ref="addData">
            <div class="content content2">

              <el-form-item prop="goodsType1">
                <span>大类<i class="required">*</i></span>
                <el-select v-model="addData.goodsType1" @change="formGoodsTypeChange" style="width:100%" size="small">
                  <el-option
                    v-for="(item,index) in optionsBig"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item prop="goodsType">
                <span>小类<i class="required">*</i></span>
                <el-select v-model="addData.goodsType" style="width:100%" size="small">
                  <el-option
                    v-for="(item,index) in optionsChild"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item prop="goodsKind">
                <span>商品种类<i class="required">*</i></span>
                <el-input v-model="addData.goodsKind" size="small"></el-input>
              </el-form-item>
              <el-form-item prop="shelfLife">
                <span>保质期天数<i class="required">*</i></span>
                <el-input type="number" v-model="addData.shelfLife" size="small">
                  <template slot="suffix">天</template>
                </el-input>
              </el-form-item>

              <!-- <el-form-item prop="saleLimit">
                <span>限制超卖<i class="required">*</i></span>
                <el-select v-model="addData.saleLimit" style="width:100%" size="small">
                  <el-option
                    v-for="(item,index) in saleOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item> -->

              <el-form-item prop="imgUrl" style="width:100%">
                <span>商品图片<i class="required">*</i></span>
                <el-input v-model="addData.imgUrl" style="display:none"></el-input>
                <aliUpload
                  class="aliUpload deviceDetails aliUpload_new"
                  style="width:140px;height:120px"
                  :upLoadText="upLoadText_cost"
                  :fileType="fileType_cost"
                  :fileSize="fileSize"
                  :iconShow="false"
                  :iconImg="iconImg"
                  :uploadIcon="true"
                  v-if="addData.imgUrl===''||!addData.imgUrl"
                  @setAnnex="setAnnex" />
                <div v-else style="width:140px;height:120px" class="imgBox imgBoxModel">
                  <img :src="addData.imgUrl" @click="showImg(addData.imgUrl)" class="logoImg">

                  <div @click="showImg(addData.imgUrl)" class="bottomTips">预览图片</div>
                  <div class="iconfont icon-cms_cuowu deleteImg" @click="deleLogo"></div>
                </div>
                <div class="tips">（建议尺寸：<i class="required">800*800</i>像素；支持格式JPG,PNG，大不于2M）</div>
              </el-form-item>
              
              <el-form-item class="checkbox-group">
                <div>超卖配置（勾选后该项目下此商品种类会限制库存超卖）</div>
                <el-checkbox-group v-model="addData.saleLimitList">
                  <el-checkbox :label="item.id" v-for="item in projectOptions" :key="item.id">{{item.referred}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>

            </div>
          </el-form>
        </div>
        <div slot="footer" class="slotfooter">
          <span @click="addGoodsDialogClose" class="details_cannelBtn">取消</span>
          <span class="details_submitBtn" @click="addgoods()">确定</span>
        </div>
    </el-dialog>
    <picturePrevie
      v-if="showPicture"
      :imgList="imgArr"
      :num="num"
      @pictureClose="pictureClose" />

    <!-- 详情 -->
    <farmerGoodsDetails
      :detailsdrawershow="detailsShow"
      ref="farmerGoodsDetails"
      :draweDetaileData="detaileData"
      @drawerClose="drawerClose" />
  </div>
</template>
<script>
import context from '@/service'
import aliUpload from '@/components/aliUpload.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import farmerGoodsDetails from '../components/farmerGoodsDetails'
export default {
  name: 'farmerGoods',
  components: {
    aliUpload,
    picturePrevie,
    farmerGoodsDetails
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
      optionsBig: [], // 大类
      optionsChild: [], // 小类
      addData: {
        goodsKind: '',
        goodsType: '',
        imgUrl: '',
        saleLimit: false,
        saleLimitList: []
      },
      addFlowRules: {
        goodsType1: [
          { required: true, message: '请选择商品大类', trigger: 'blur' }
        ],
        goodsType: [
          { required: true, message: '请选择商品小类', trigger: 'blur' }
        ],
        goodsKind: [
          { required: true, message: '请输入商品种类', trigger: 'blur' }
        ],
        shelfLife: [
          { required: true, message: '请输入保质期天数', trigger: 'blur' }
        ],
        saleLimit: [
          { required: true, message: '请选择', trigger: 'select' }
        ],
        imgUrl: [
          { validator: cheackCoverImg, trigger: 'change' }
        ]
      },
      showPicture: false,
      imgArr: [],
      num: 0,
      seachParam: {
        useStatus: 'USING',
        name: '',
        goodsType: '',
        goodsTypeArr: ''
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
      kindOption: [],
      saleOptions: [
        { label: '是', value: true },
        { label: '否', value: false }
      ],
      projectOptions: []
    }
  },
  created () {
    this.projectOptions = this.$store.state.projectManagementsList
    if (this.$route.params.farmerGoodsFlag) {
      if (window.farmerGoodsFilter) {
        this.seachParam = window.farmerGoodsFilter
      }
    }
    if (!this.hasAuthority('02050101') && this.hasAuthority('02050104') && !this.hasAuthority('02050108')) {
      this.$router.push({
        name: 'tenantGoods',
        params: {}
      })
    }
    if (!this.hasAuthority('02050101') && !this.hasAuthority('02050104') && this.hasAuthority('02050108')) {
      this.$router.push({
        name: 'productConfig',
        params: {}
      })
    }
    this.getOptions()
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
  // 进入
  beforeRouteEnter (to, from, next) {
    if (from.name === 'farmerGoods' || from.name === 'tenantGoods' || from.name === 'productConfig') {
      to.params.farmerGoodsFlag = true
    } else {
      to.params.farmerGoodsFlag = false
    }
    next()
    // ...
  },
  // 离开
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    if (to.name === 'farmerGoods' || to.name === 'tenantGoods' || to.name === 'productConfig') {
      window.farmerGoodsFilter = this.seachParam
    } else {
      window.farmerGoodsFilter = undefined
      window.tenantGoodsFilter = undefined
      window.productConfigFilter = undefined
    }
    next()
  },
  methods: {
    addgoods () {
      this.$refs['addData'].validate((valid) => {
        if (valid) {
          if (Number(this.addData.shelfLife) > 0 && Number(this.addData.shelfLife) && this.addData.shelfLife.indexOf('.') === -1) {
          } else {
            this.$message.error('保质期天数必须是大于0的正整数')
            return
          }

          let parameter = JSON.parse(JSON.stringify(this.addData))
          this.optionsChild.forEach(v => {
            if (parameter.goodsType === v.id) {
              parameter.goodsType = v
            }
          })
          context.http.post(`gos/api/goods-depots`, parameter).then(res => {
            if (res) {
              this.$message.success('新增成功')
              this.getOptions()
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
      let result = await context.http.get('gos/api/goods-depots', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'lastModifiedDate,desc',
        goodsType: this.seachParam.goodsType,
        // goodsKind: this.seachParam.goodsKind,
        name: this.seachParam.name,
        useStatus: this.seachParam.useStatus
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      this.totalPages = Math.ceil(this.total / this.pgSize)
    },
    optionsChange (val) {
      if (val.length === 2) {
        this.seachParam.goodsType = val[0]
        this.seachParam.goodsKind = val[1]
      } else {
        this.seachParam.goodsType = val[0]
        this.seachParam.goodsKind = ''
      }
    },
    async getOptions () { // 商品二级类
      let result = await context.http.get(`gos/api/goodsClassifications/tree?flag=${false}`)
      this.kindOption = result.data
    },
    async getParentId (id) { // 商品大类/小类
      if (!id) {
        id = ''
      }
      let result = await context.http.get(`gos/api/goodsClassifications?parentId=${id}`)
      if (!id) {
        this.optionsBig = JSON.parse(JSON.stringify(result.data))
      } else {
        this.addData.goodsType = ''
        this.optionsChild = JSON.parse(JSON.stringify(result.data))
      }
    },
    changeUseStatus (index, row, useStatus) {
      context.http.put(`gos/api/goods-depots/useStatus?id=${row.id}&useStatus=${useStatus}`).then(res => {
        if (res) {
          if (useStatus === 'USING') {
            this.$message.success('启用成功')
          } else {
            this.$message.error('禁用成功')
          }
          this.queryRules()
        }
      })
    },
    useStatusFormat (row, column) {
      if (row.useStatus === 'USING') {
        return '使用中'
      } else {
        return '已停用'
      }
    },
    // 三级切换value
    searchGoodsKindChange (row, e) {
      this.seachParam.goodsType = row.toString()
      this.seachParam.goodsTypeArr = row
    },
    // 新增大类切换加载小类数据
    formGoodsTypeChange (id) {
      this.getParentId(id)
    },
    pictureClose () {
      this.showPicture = false
    },
    showImg (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
      console.log(this.imgArr)
    },
    deleLogo () {
      this.addData.imgUrl = ''
    },
    drawerClose () {
      this.query()
      this.detailsShow = false
    },
    setAnnex (annexURL, annexName) {
      this.$set(this.addData, 'imgUrl', annexURL)
    },
    addGoodsDialogClose () {
      this.addData = {
        goodsKind: '',
        goodsType: '',
        imgUrl: '',
        saleLimit: false,
        saleLimitList: []
      }
      this.$refs['addData'].resetFields()
      this.addGoodsDialogVisible = false
    },
    addGoodsOpen () {
      this.getParentId()
      this.addGoodsDialogVisible = true
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
    },
    handleEdit (index, row) {
      context.http.get(`gos/api/goods-depots/${row.id}`).then(res => {
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
.farmerGoods,
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
.farmerGoods {
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
<style lang="less">
.farmerGoods .el-input__suffix {
  line-height: 32px;
}
</style>
