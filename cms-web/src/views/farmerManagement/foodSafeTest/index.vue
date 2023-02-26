/* eslint-disable quotes */
/* eslint-disable quotes */

<template>
  <div class="foodSafeTest">
    <span class="page_head_title">食安检测</span>
    <div class="pl-content">
      <div class="search-bar">
        <div>
          <el-select v-model="seachParam.projectManagementId"
                     style="width:200px"
                     placeholder="项目简称">
            <el-option v-for="item in options1"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-input placeholder="商品名称"
                    v-model="seachParam.goodsName"
                    style="width:170px"></el-input>
          <el-date-picker style="margin-right:0;width:150px"
                          v-model="seachParam.startDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="开始时间"
                          :editable="false"
                          :picker-options="pickerBeginDateBefore">
          </el-date-picker>
          <div class="split"
               style="margin:0 5px;color:#BEC7D0">-</div>
          <el-date-picker v-model="seachParam.endDate"
                          style="width:150px"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="结束时间"
                          :editable="false"
                          :picker-options="pickerBeginDateAfter">
          </el-date-picker>
          <el-select v-model="seachParam.checkResult"
                     style="width:150px"
                     clearable
                     placeholder="检测结果">
            <el-option v-for="item in statusList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id" />
          </el-select>

          <span class="query-btn"
                @click="queryRules">查询</span>
        </div>
        <div v-if="hasAuthority('02050601')">
          <el-button class="tban tban1"
                     @click="addTenantGoods"><i class="iconfont icon-crm_xinzeng-"></i> 新增检测记录</el-button>
        </div>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  style="width: 100%"
                  ref="foodSafeTest">
          <el-table-column label="项目简称"
                           prop="projectManagementName"
                           align="center" />
          <el-table-column label="品牌名称"
                           prop="tenantName"
                           align="center" />
          <el-table-column label="商品名称"
                           prop="goodsName"
                           align="center" />
          <el-table-column label="检测项目"
                           prop="foodCheckTypeDescription"
                           align="center" />
          <el-table-column label="检测值"
                           prop="foodCheckValue"
                           width="180"
                           align="center" />
          <el-table-column label="检测时间"
                           prop="recordDate"
                           align="center" />
          <el-table-column label="检测结果"
                           :formatter="formatstatus"
                           align="center" />
          <el-table-column label="操作人"
                           prop="userName"
                           align="center" />
          <el-table-column width="200px"
                           label="操作"
                           align="center"
                           v-if="hasAuthority('02050602')">
            <template slot-scope="scope">
              <span class="onlineBtn"
                    @click="changeUseStatus(scope.$index, scope.row,'USING')">删除</span>
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
    <!-- 新增客户商品 -->
    <el-dialog title="新增检测记录"
               :visible.sync="addTenantGoodsVisible"
               class="addTenantGoodsDialog el_dialog_new "
               width="800px"
               @close="addTenantGoodsClose"
               :close-on-click-modal="false">
      <div class="dialog_content">
        <el-form :model="addData"
                 ref="addData"
                 style="padding:0">
          <div class="content content2">
            <div class="half_page_title"
                 style="width:100%">
              <div><i></i>基本信息</div>
            </div>
            <div class="baseInfo">
              <div style="margin-right:15px">
                <div>
                  项目简称
                  <span class="required">*</span>
                </div>
                <el-select v-model="addData.projectManagementId"
                           size="small"
                           style="width:180px"
                           placeholder="项目简称"
                           @change="projectChange">
                  <el-option v-for="item in options1"
                             :key="item.id"
                             :label="item.referred"
                             :value="item.id" />
                </el-select>
              </div>
              <div>
                <div>
                  检测时间
                  <span class="required">*</span>
                </div>
                <el-date-picker v-model="addData.startDate"
                                style="width:180px"
                                type="date"
                                size="small"
                                value-format="yyyy-MM-dd"
                                placeholder="开始时间"
                                :editable="false"
                                :clearable="false">
                </el-date-picker>
              </div>
            </div>
            <div class="half_page_title"
                 style="width:100%">
              <div><i></i>新增商品</div>
              <div class="addBtn"
                   @click="addItem"><span class="iconfont icon-crm_xinzeng-"></span><span class="btn">新增商品</span></div>
            </div>
            <div class="gooodsList">
              <div class="goodsTable">
                <el-table :data="addTableData"
                          style="width: 100%"
                          ref="addTableData">
                  <el-table-column label="品牌名称"
                                   align="center">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.tenantId"
                                 filterable
                                 size="small"
                                 placeholder="品牌名称">
                        <el-option v-for="item in tenantOption"
                                   :key="item.id"
                                   :label="item.referred"
                                   :value="item.id" />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column prop="goodsName"
                                   label="商品名称"
                                   align="center">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.goodsName"
                                @onkeyup="scope.row.name = scope.row.name.replace(/\s+/g,'')"
                                size="small" />
                    </template>
                  </el-table-column>
                  <el-table-column label="检测项目"
                                   width="150"
                                   align="center">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.foodCheckType"
                                 size="small">
                        <el-option v-for="(item,index) in testOptions"
                                   :key="index"
                                   :value="item.id"
                                   :label="item.value" />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="检测值"
                                   width="120"
                                   align="center">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.foodCheckValue"
                                @onkeyup="scope.row.name = scope.row.name.replace(/\s+/g,'')"
                                size="small" />
                    </template>
                  </el-table-column>
                  <el-table-column label="检测结果"
                                   width="120px"
                                   align="center">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.checkResult"
                                 size="small">
                        <el-option v-for="(item,index) in resultOptions"
                                   :key="index"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                      </el-select>
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
    <!-- 删除提示弹窗 -->
    <el-dialog :visible.sync="deleteDialog"
               width="21%"
               center>
      <div class="deleteDialog">
        <img src="../../../assets/delete1.png" />
        <div>
          <p>提示</p>
          <span>确认删除该条检测记录吗？</span>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary"
                   @click="deleteFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import img from '@/assets/noBrand.png'
import context from '@/service'
import { goodTypeName } from '@/utils/validate'
export default {
  name: 'foodSafeTest',
  components: {

  },
  data () {
    return {
      deleteDialog: false,
      deleteId: null,
      addData: {
        startDate: '',
        projectManagementId: ''
      },
      resultOptions: [
        { value: 'OK', label: '合格' },
        { value: 'NO', label: '不合格' }
      ],
      testOptions: [],
      tenantOption: [],
      addTableData: [],
      addTenantGoodsVisible: false,
      statusList: [
        { id: 'OK', name: '合格' },
        { id: 'NO', name: '不合格' }
      ],
      seachParam: {
        projectManagementId: '',
        goodsName: '',
        startDate: '',
        endDate: '',
        checkResult: ''
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
      ],
      pickerBeginDateBefore: {
        disabledDate: time => {
          let endDateVal = this.endDate
          if (endDateVal) {
            let temp = new Date(endDateVal).getTime() - 365 * 24 * 60 * 60 * 1000
            return time.getTime() < new Date(temp).getTime() || time.getTime() > new Date(endDateVal).getTime()
          }
        }
      },
      pickerBeginDateAfter: {
        disabledDate: time => {
          let beginDateVal = this.startDate
          if (beginDateVal) {
            let temp = new Date(beginDateVal).getTime() + 365 * 24 * 60 * 60 * 1000
            return time.getTime() > new Date(temp).getTime() || time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
          }
        }
      }
    }
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
    this.seachParam.projectManagementId = this.options1[0].id
    this.query()
  },
  mounted () {

  },
  methods: {
    addItem () {
      let i
      let preId = ''
      if (this.addTableData.length) {
        i = this.addTableData.length - 1
        preId = this.addTableData[i].tenantId// 上一条客户id
      }
      let item = {
        projectManagementId: this.addData.projectManagementId,
        recordDate: this.addData.startDate,
        tenantId: preId,
        goodsName: '',
        foodCheckType: this.testOptions[0].id,
        foodCheckValue: '',
        checkResult: 'OK'
      }
      this.addTableData.push(item)
    },
    getNowTime () {
      var now = new Date()
      var year = now.getFullYear() // 得到年份
      var month = now.getMonth() // 得到月份
      var date = now.getDate() // 得到日期
      var hour = '00:00:00' // 默认时分秒 如果传给后台的格式为年月日时分秒，就需要加这个，如若不需要，此行可忽略
      month = month + 1
      month = month.toString().padStart(2, '0')
      date = date.toString().padStart(2, '0')
      var defaultDate = `${year}-${month}-${date}`
      console.log(defaultDate)
      return defaultDate
    },
    async getFoodCheckTypeDescription () { // 检测项目
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=食安检测项目')
      this.testOptions = result.data
    },
    async query () {
      let result = await context.http.get('gos/api/foodChecks', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        // sort: 'recordDate,desc',
        projectManagementId: this.seachParam.projectManagementId,
        goodsName: this.seachParam.goodsName,
        startDate: this.seachParam.startDate,
        endDate: this.seachParam.endDate,
        checkResult: this.seachParam.checkResult
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      this.totalPages = Math.ceil(this.total / this.pgSize)
    },
    saveTenantGoods () {
      if (!this.addTableData.length) {
        this.$message.error('请添加商品检测记录')
        return
      }
      let arr = this.addTableData.map((item, index) => {
        if (item.tenantId === '' || item.goodsName === '' || item.foodCheckType === '' || item.checkResult === '') {

        } else {
          item.projectManagementId = this.addData.projectManagementId
          item.recordDate = item.recordDate
          return item
        }
      })
      let paramsArr = arr.filter((item) => {
        return item
      })
      if (paramsArr.length !== this.addTableData.length) {
        this.$message.error('请填写商品检测信息')
        return
      }
      console.log(paramsArr)
      paramsArr = paramsArr.reverse()
      context.http.post(`gos/api/foodChecks`, paramsArr).then(res => {
        this.$message.success('新增成功')
        this.addTenantGoodsClose()
        this.queryRules()
      })
    },
    addTenantGoodsClose () {
      this.addTableData = []
      this.addTenantGoodsVisible = false
    },
    changeUseStatus (index, row) {
      this.deleteId = row.id
      this.deleteDialog = true
    },
    deleteFun () {
      context.http.delete(`gos/api/foodChecks/${this.deleteId}`).then(res => {
        if (res) {
          this.deleteDialog = false
          this.$message.success('删除成功')
          this.queryRules()
        }
      })
    },
    async projectChange (flag) {
      let result = await context.http.get(`/cms/api/tenant/list`, {
        size: 9999,
        id: this.addData.projectManagementId,
        tenantContractStatus: 'IN_THE_CONTRACT',
        useStatus: 'USING'
      })
      this.addTableData = []
      this.tenantOption = result.data
      if (flag) {
        this.addTenantGoodsVisible = true
      }
    },
    deleteGoods (index, row) {
      this.addTableData.splice(index, 1)
    },
    addTenantGoods () {
      this.addData.projectManagementId = this.seachParam.projectManagementId
      this.projectChange(true)
      this.getFoodCheckTypeDescription()
      this.addData.startDate = this.getNowTime()
    },
    formatstatus (row, column) {
      switch (row.checkResult) {
        case 'OK':
          return '合格'
        case 'NO':
          return '不合格'
      }
    },
    queryRules () {
      this.currentPage = 1
      // this.pgSize = 15
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
.foodSafeTest {
  .el-dialog__body {
    border-bottom: none;
    padding: 30px 0 !important;
  }
  .el-dialog__footer {
    text-align: right !important;
  }
  // 覆盖element样式
  .el-button {
    &.iconfont {
      padding: 8px 10px;
      background-color: #ffffff;
      font-size: 14px !important;
      &.editBtn {
        border-color: #b3bcfc;
        color: #4155f5;
        &:hover {
          background-color: #f6f7ff;
        }
      }
      &.deleteBtn {
        border-color: #ffabb9;
        color: #ed3753;
        &:hover {
          background-color: #fff7f8;
        }
      }
      &.isCite {
        border-color: #44af69;
        color: #44af69;
        &:hover {
          background-color: #f0f9f3;
        }
      }
      &.up {
        padding: 7px 8px;
      }
      &.shrink {
        padding: 7px 8px;
      }
      &.icon-yuanshidaxiao {
      }
    }
  }
  .el-button--primary {
    background-color: #3577f6;
  }
  .el-button--primary:hover {
    background: #66b1ff;
    border-color: #66b1ff;
    color: #fff;
  }
  .el-dialog__header {
    border: none;
  }
  .el-dialog__body {
    .deleteDialog {
      display: flex;
      div {
        margin-left: 15px;
        display: flex;
        flex-wrap: wrap;
        p {
          color: #666666;
          font-size: 20px;
          font-weight: 600;
          width: 100%;
        }
      }
    }
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
.foodSafeTest {
  .plc-table {
    .onlineBtn {
      display: inline-block;
      width: 56px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border-radius: 3px;
      color: #3575f6;
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
        .half_page_title {
          .addBtn {
            color: #00b361;
            font-size: 14px;
            font-weight: normal;
            cursor: pointer;
            > span {
              &.iconfont {
                font-size: 16px;
                margin-right: 5px;
              }
              &.btn {
                text-decoration: underline;
              }
            }
          }
        }
        .baseInfo {
          padding: 15px;
          display: flex;
          > div {
            > div {
              margin-bottom: 10px;
            }
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
.foodSafeTest
  .el-table--scrollable-y
  .el-table__body-wrapper::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  background-color: #f2f2f2;
}
.foodSafeTest
  .el-table--scrollable-y
  .el-table__body-wrapper::-webkit-scrollbar {
  width: 6px;
  background-color: #f2f2f2;
}
.foodSafeTest
  .el-table--scrollable-y
  .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.25);
  background-color: #f5f5f5;
}
.foodSafeTest .el-table::before {
  height: 0px !important;
}
</style>
