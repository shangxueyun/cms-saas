<template>
  <div class="productConfigDetails">
    <drawer class="drawer_new addTenantGoodsDialog"
            :show="detailsdrawershow"
            :showEditBtn="readOnly && hasAuthority('02050110')"
            @on-edit="onEdit"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="dialog_content details_content drawer-body" slot="drawer" v-if="editData.id">
        <el-form :model="editData"
                 :rules="editFlowRules"
                 ref="editData"
                 style="padding:0">
          <div class="content">
            <div class="half_page_title"
                 style="width:100%">
              <div><i></i>基本信息</div>
            </div>
            <div class="baseInfo">
              <el-form-item prop="projectManagementId">
                <span>项目简称<i class="required">*</i></span>
                <el-select style="width: 100%" v-if="!readOnly" v-model="editData.projectManagementId"
                          clearable
                          size="small"
                          disabled
                          placeholder="项目简称"
                          @change="getSAAScodeList">
                  <el-option v-for="item in configObject.projectList"
                            :key="item.id"
                            :label="item.referred"
                            :value="item.id" />
                </el-select>
                <span v-if="readOnly" style="color: #262626">{{ editData.projectManagementName }}</span>
              </el-form-item>
              <el-form-item prop="name">
                <span>采购商品名称<i class="required">*</i></span>
                <el-input v-if="!readOnly" size="small"
                          v-model="editData.name"
                          ></el-input>
                <span v-if="readOnly" style="color: #262626">{{ editData.name }}</span>
              </el-form-item>
              <el-form-item>
                <span>选择SAAS编码</span>
                <el-cascader v-if="!readOnly" ref="cascaderSaasCode"
                            style="width: 100%"
                            :options="SAAScodeList"
                            :show-all-levels="false"
                            v-model="editData.saasCode"
                            placeholder=""
                            collapse-tags
                            :props="{
                              checkStrictly: true,
                              multiple: true
                            }"
                            clearable
                            @change="saasCodeChange"
                            />
                <el-tooltip v-if="readOnly && editData.saasCode" effect="dark" :content="editData.saasCode" placement="bottom-start">
                  <span class="saasCode" style="color: #262626;display: block;">{{ editData.saasCode }}</span>
                </el-tooltip>
              </el-form-item>
            </div>
            <div class="half_page_title"
                 style="width:100%">
              <div><i></i>{{ readOnly ? '对应商品种类' : '添加商品种类' }}</div>
            </div>
            <!--  -->
            <div v-if="!readOnly" class="model"
                 style="height: 38px;margin: 18px 16px;padding: 0;margin-bottom: 4px;">
              <el-cascader ref="cascader"
                           :options="configObject.options_using"
                           v-model="goodsType"
                           placeholder="商品类型"
                           :props="{ checkStrictly: true }"
                           separator="-"
                           @change="cascaderChange"
                            />

              <el-button type="primary"
                         @click.stop="searchQuery()">查询</el-button>
            </div>
            <div v-if="searchQueryBle && !readOnly"
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
                 v-if="addTableData.length && !readOnly"
                 style="height: auto;margin: 0px 16px;padding: 0;">
              <p style="color: #3575F6">已选择 {{ addTableData.length }} 种商品种类</p>
            </div>

            <div class="gooodsList">
              <div class="goodsTable">
                <el-table :data="addTableData"
                          style="width: 100%"
                          :height="addTableData.length && readOnly? '564px' : '242px'"
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
                  <el-table-column v-if="!readOnly"  label="操作"
                                  align="center">
                    <template slot-scope="scope">
                      <span class="deleteGoods"
                            v-if="!readOnly"
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
           class="dialog-footer">
        <span @click="onHide"
              v-if="!readOnly"
              class="details_cannelBtn"
              style="background:none">取消</span>
        <span class="saveSubmit"
              v-if="!readOnly"
              @click="save()">保存</span>
      </div>
    </drawer>
  </div>
</template>

<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import aliUpload from '@/components/aliUpload.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import { goodTypeName, ArrayRecursion } from '@/utils/validate'
import axios from 'axios'
import * as JSOG from 'jsog'
export default {
  name: 'productConfigDetails',
  components: {
    Drawer,
    picturePrevie,
    aliUpload
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    draweDetaileData: {
      type: Object,
      default: {
        goodsDepot: {

        }
      }
    },
    configObject: {
      type: Object,
      default: {}
    }
  },
  created () {

  },
  watch: {
    detailsdrawershow: {
      handler (newValue, oldValue) {
        if (newValue) {
          this.draweDetaileDataEdit(this.draweDetaileData)
          // 重置
        }
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      groupNumberOptions: [], // 自定义分类
      projectManagementId: '',
      value: '',
      readOnly: true,
      fileSize: 2,
      showPicture: false,
      imgArr: [],
      num: 0,
      errorIndex: [],
      searchTableData: [],
      searchQueryBle: false,
      searchTableEle: null,
      searchTableFlag: false,
      goodsType: [],
      addTableData: [],
      options1: [],
      SAAScodeList: [],
      deleteArr: [],
      editData: {
        projectManagementId: '',
        projectManagementName: '',
        name: '',
        saasCode: '',
        goodsDepots: []
      },
      editFlowRules: {
        name: [
          { required: true, message: '请输入采购商品名称', trigger: 'blur' }
        ],
        projectManagementId: [
          { required: true, message: '请选择项目', trigger: 'blur' }
        ]
      },
      drawerTitle: '采购商品详情'
    }
  },
  mounted () {

  },
  methods: {
    draweDetaileDataEdit (row) {
      this.editData = JSON.parse(JSON.stringify(row))
      this.addTableData = []
      this.editData.goodsDepots.forEach(v => {
        this.addGoodsType(v)
      })
      this.getOptions(false)
    },
    async getOptions (flag) { // 商品三级类
      // 列表数据筛选是三级/新增是二级
      let result = await context.http.get(`gos/api/goodsClassifications/tree?flag=${flag}&useStatus=USING`)
      this.configObject.options_using = result.data
      this.goodsType = []
      if (this.configObject.options_using[0]) {
        this.goodsType.push(this.configObject.options_using[0].value)
        if (this.configObject.options_using[0].children) {
          this.goodsType.push(this.configObject.options_using[0].children[0].value)
          if (this.configObject.options_using[0].children[0].children) {
            this.goodsType.push(this.configObject.options_using[0].children[0].children[0].value)
          }
        }
      }
      this.searchQuery()
    },
    async getSAAScodeList (id) {
      // this.editData.saasCode = ''
      let result = await context.http.get('/gos/api/saasCodeInfos/tree', {
        projectId: id,
        purchaseSettingId: this.editData.id
      })
      // JSON.parse(JSON.stringify(result.data).replace(/"child":\[],/g, ''))
      this.SAAScodeList = JSON.parse(ArrayRecursion(result.data, this.editData.saasCode.split('、')))
      if (window.sassCodeArr) {
        let arr = this.editData.saasCode.split('、')
        this.editData.saasCode = []
        arr.forEach(v => {
          for (let o of window.sassCodeArr) {
            if (v === o[1]) {
              this.editData.saasCode.push(o)
              break
            }
          }
        })
      }
    },
    cascaderChange (row) {
      if (row.length) {
        this.goodsType = row
      } else {
        this.goodsType = []
      }
    },
    searchQuery (flag, delRow) {
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
        projectManagementId: this.editData.projectManagementId,
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
          that.deleteArr.forEach(v => {
            let flag
            that.searchTableData.forEach(o => {
              if (v.id === o.id) {
                flag = true
              }
            })
            if (!flag) {
              let goodsType = [v.goodsType.parent.id, v.goodsType.id]
              if (goodsType.toString() === that.goodsType.toString()) {
                that.searchTableData.unshift(v)
              }
            }
          })
          that.$refs.searchTableData.bodyWrapper.scrollTop = 0
        } else {
          if (that.searchTableData.length === 0 || that.currentPageClass === 1) {
            that.searchTableData = []
          }
          that.deleteArr.forEach(v => {
            let flag
            that.searchTableData.forEach(o => {
              if (v.id === o.id) {
                flag = true
              }
            })
            if (!flag) {
              let goodsType = [v.goodsType.parent.id, v.goodsType.id]
              if (goodsType.toString() === that.goodsType.toString()) {
                that.searchTableData.unshift(v)
              }
            }
          })
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
    addGoodsType (row) { // 往表格添加商品
      this.deleteArr.forEach((v, i) => {
        if (v.id === row.id) {
          this.deleteArr.splice(i, 1)
        }
      })
      let obj = {
        value: '',
        children: {
          label: row.goodsKind,
          value: row.id
        },
        goodsDepotId: row.id,
        name: row.goodsKind,
        url: row.imgUrl,
        label: row.goodsKind,
        unitOptions: [],
        groupChildren: row
      }
      this.addTableData.push(obj)
      this.searchTableData = this.goodsTypeDataFilter(this.addTableData, this.searchTableData)
    },
    deleteGoods (index, row) {
      this.addTableData.splice(index, 1)
      this.goodsType = [row.groupChildren.goodsType.parent.id, row.groupChildren.goodsType.id]
      this.deleteArr.push(row.groupChildren)
      this.searchQuery()
    },
    saasCodeChange (row) {},
    showImg (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    tabChange (n) {
      this.tab = n
    },
    save () {
      if (!this.addTableData.length) {
        this.$message.error('请添加商品种类')
        return
      }
      if (!this.editData.name) {
        this.$message.error('请输入采购商品名称')
        return
      }
      this.editData.goodsDepots = []
      let goodsDepots = this.addTableData.map((item, index) => {
        return item.groupChildren
      })
      let paramsArr = Object.assign(this.editData, { goodsDepots })
      if (typeof paramsArr.saasCode !== 'string') {
        paramsArr.saasCode.forEach((v, i) => {
          paramsArr.saasCode[i] = v[1]
        })
        paramsArr.saasCode = paramsArr.saasCode.toString()
      } else {
        paramsArr.saasCode = paramsArr.saasCode.replace(/、/g, ',')
      }
      console.log(paramsArr)
      context.http.put('/gos/api/purchaseGoodsSetting', paramsArr).then(res => {
        if (res.status === 201 || res.status === 200) {
          this.$message.success('修改成功')
          this.$emit('edit')
          this.onHide()
        }
      }).catch(error => {
        console.info(error)
      })
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    tableRowClassName ({ row, rowIndex }) {
      if (this.errorIndex.includes(rowIndex)) {
        return 'warning-row'
      }
      return ''
    },
    onEdit () {
      this.searchQuery()
      this.getSAAScodeList(this.editData.projectManagementId)
      this.readOnly = false
    },
    onHide () {
      this.readOnly = true
      this.editData = {}
      this.$emit('drawerClose', false)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
.productConfigDetails {
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
    width: 850px;
    height: calc(100% - 80px) !important;
    .el-form {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
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
            color: #262626;
            font-size: 14px;
            height: 40px;
            line-height: 40px;
          }
          .tips {
            font-size: 12px;
            color: #999999;
            margin-top: 10px;
          }
        }
        .deviceDetails {
          width: 140px;
          height: 120px;
          margin-right: 0px !important;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.productConfigDetails {
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
        margin: 10px 0px;
        background: #fff;
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
            .saasCode{
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              width: 100%;
              display: block;
              margin-top: 8px;
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
.productConfigDetails .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.08);
  border-radius: 10px;
  background-color: #f2f2f2;
}
.productConfigDetails .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
	width: 6px;
	background-color: #f2f2f2;
}
.productConfigDetails .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb {
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.25);
	background-color: #f5f5f5;
}
.productConfigDetails .el-table::before{
  height: 0px !important
}
.productConfigDetails .baseInfo .el-input__inner{
  height: 40px !important;
  line-height: 40px;
}
</style>
