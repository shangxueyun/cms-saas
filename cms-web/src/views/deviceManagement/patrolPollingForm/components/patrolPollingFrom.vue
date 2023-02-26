
<template>
  <div class="patrolPollingModule">
    <drawer :show="show"
            class="drawer_new"
            title="巡更巡检表"
            :showEditBtn="hasAuthority('03010125')&&readOnly"
            @on-edit="onEdit"
            @on-hide="onHide">
      <div class="details_content drawer-body"
           slot="drawer">
        <div class="main-content main_content"
             style="border:none">
          <el-form :model="detailsData"
                   ref="detailsData"
                   :rules="addDataRules">
            <div class="basInfo">
              <p class="title"><span class="vertical"></span>基本信息</p>
              <!-- <span @click="editFn" style="position: absolute; top: -35px; right: 0;">编辑</span> -->
              <div class="content">
                <div class="form">
                  <el-form-item prop="projectManagementId">
                    <span>项目简称<i class="required">*</i></span>
                    <p v-if="readOnly">{{detailsData.projectManagementName}}</p>
                    <el-select v-model="detailsData.projectManagementId"
                               disabled
                               v-else
                               size="small"
                               placeholder="请选择">
                      <el-option v-for="item in projectManagementsList"
                                 :key="item.id"
                                 :label="item.referred"
                                 :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="patrolType">
                    <span>类型<i class="required">*</i></span>
                    <p v-if="readOnly">{{patrolTypeFormat(detailsData.patrolType)}}</p>
                    <el-select v-model="detailsData.patrolType"
                               disabled
                               v-else
                               size="small">
                      <el-option label="巡更"
                                 value="PATROL"></el-option>
                      <el-option label="巡检"
                                 value="POLLING"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="name">
                    <span>巡更巡检表名称<i class="required">*</i></span>
                    <p v-if="readOnly">{{detailsData.name}}</p>
                    <el-input v-model="detailsData.name"
                              v-else
                              size="small"
                              maxlength="20"></el-input>
                  </el-form-item>
                  <el-form-item prop="number">
                    <span>频次<i class="required">*</i></span>
                    <p v-if="readOnly">{{numberFormat(detailsData)}}</p>
                    <div class="frequency"
                         v-else>
                      <el-input v-model="detailsData.number"
                                disabled
                                onkeyup="value=value.replace(/[^0-9]/g,'')"
                                onpaste="value=value.replace(/[^0-9]/g,'')"
                                oncontextmenu="value=value.replace(/[^0-9]/g,'')"
                                size="small"
                                maxlength="5"></el-input>
                      <el-select v-model="detailsData.frequencyUnit"
                                 disabled
                                 size="small">
                        <el-option label="次/天"
                                   value="DAY"></el-option>
                        <el-option label="天/次"
                                   value="ONCE"></el-option>
                      </el-select>
                    </div>
                  </el-form-item>
                  <el-form-item prop="number">
                    <span>状态<i class="required">*</i></span>
                    <p v-if="readOnly">{{useStatusFormat(detailsData.useStatus)}}</p>
                    <el-select v-model="detailsData.useStatus"
                               v-else
                               size="small">
                      <el-option label="使用中"
                                 value="USING"></el-option>
                      <el-option label="已停用"
                                 value="DISABLE"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </div>

            <div class="basInfo"
                 v-if="!readOnly">
              <p class="title"><span class="vertical"></span>设备列表</p>
              <div class="queryParams">
                <el-cascader :options="cascaderList"
                             @change="handleChange"
                             v-model="cascaderVal"
                             placeholder="设备分类"
                             :props="{ checkStrictly: true }"
                             style="width: 200px"></el-cascader>
                <el-input v-model="queryParams.name"
                          style="width: 200px"
                          placeholder="设备名称"></el-input>
                <el-input v-model="queryParams.installPosition"
                          style="width: 200px"
                          placeholder="安装位置"></el-input>
                <div class="query-btn"
                     @click="querySeach">查询</div>
              </div>
              <div class="content">
                <el-table :data="tableData"
                          class="table tableData"
                          max-height="350px"
                          style="width: 100%"
                          empty-text="请先选择设备分类进行查询">
                  <el-table-column prop="name"
                                   label="设备名称"
                                   align="center"> </el-table-column>
                  <el-table-column prop="code"
                                   label="设备编号"
                                   align="center"> </el-table-column>
                  <el-table-column prop="equirementType.parent.name"
                                   label="设备大类"
                                   align="center"> </el-table-column>
                  <el-table-column prop="installPosition"
                                   label="安装位置"
                                   align="center"> </el-table-column>
                  <el-table-column label="是否需要巡更"
                                   :formatter="onPatrolFormat"
                                   align="center"></el-table-column>
                  <el-table-column :formatter="onMaintainFormat"
                                   label="是否需要巡检"
                                   align="center"></el-table-column>
                  <el-table-column label="操作"
                                   align="center">
                    <template slot-scope="scope">
                      <span class="addequipment"
                            v-if="!scope.row.isAdd"
                            @click="addequipment(scope.$index, scope.row)">添加</span>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="ctc-foot"
                     v-if="tableData.length>0">
                  <el-col :span="24">
                    <span class="flex">
                      <el-pagination v-if="total > 0"
                                     background
                                     layout="prev, pager, next"
                                     :page-size="pgSize"
                                     :total="total"
                                     :current-page="currentPage"
                                     @current-change="current_change">
                      </el-pagination>
                    </span>
                  </el-col>
                </div>
              </div>
            </div>
            <div class="basInfo">
              <p class="title">
                <span class="vertical"></span>
                <span v-if="!readOnly">已选中设备{{multipleSelection.length}}项</span>
                <span v-else>巡更&巡检设备{{multipleSelection.length}}项</span>
              </p>
              <div class="content">
                <el-table :data="multipleSelection"
                          class="table tableData"
                          max-height="350px"
                          style="width: 100%">
                  <el-table-column prop="name"
                                   label="设备名称"
                                   align="center"> </el-table-column>
                  <el-table-column prop="code"
                                   label="设备编号"
                                   align="center"> </el-table-column>
                  <el-table-column prop="equirementType.parent.name"
                                   label="设备大类"
                                   align="center"> </el-table-column>
                  <el-table-column prop="installPosition"
                                   label="安装位置"
                                   align="center"> </el-table-column>
                  <el-table-column label="是否需要巡更"
                                   :formatter="onPatrolFormat"
                                   align="center"></el-table-column>
                  <el-table-column :formatter="onMaintainFormat"
                                   label="是否需要巡检"
                                   align="center"></el-table-column>
                  <el-table-column label="操作"
                                   v-if="!readOnly"
                                   align="center">
                    <template slot-scope="scope">
                      <span class="addequipment"
                            v-if="scope.row.isAdd"
                            @click="delequipment(scope.$index, scope.row)">删除</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <div slot="footer"
           v-if="!readOnly"
           class="dialog-footer">
        <el-button @click="onHide"
                   class="close-button">取消</el-button>
        <el-button type="primary"
                   class="defaultbtn dialog-confirmBtn"
                   @click="editFrom('detailsData')">确定</el-button>
      </div>
    </drawer>
  </div>
</template>
<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import ailPreview from '@/components/ailPreview.vue'
import * as JSOG from 'jsog'
export default {
  components: {
    Drawer,
    aliDownLoad,
    ailPreview
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    detailsData: {
      type: Object,
      default: {}
    }
  },
  watch: {
    show: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.detailsData.equirements.forEach((item, index) => {
            item.isAdd = true
          })
          this.multipleSelection = this.detailsData.equirements
        }
      },
      immediate: true
    }
  },
  created () {
    this.projectManagementsList = this.$store.state.projectManagementsList
  },
  mounted () {
  },
  data () {
    return {
      cascaderVal: [],
      readOnly: true,
      tableData: [],
      multipleSelection: [],
      cascaderList: [], // 设备类型二级联选择器
      queryParams: { // 条件查询入参
        equirementType: '',
        name: '',
        installPosition: ''
      },
      currentPage: 1,
      total: 1,
      pgSize: 5,
      projectManagementsList: [],
      projectManagementId: '',
      addDataRules: {
        patrolType: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入巡更巡检表名称', trigger: 'change' }
        ],
        number: [
          { required: true, message: '请输入频次', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    useStatusFormat (useStatus) {
      if (useStatus === 'USING') {
        return '使用中'
      } else if (useStatus === 'DISABLE') {
        return '已停用'
      }
    },
    numberFormat (row, column) {
      if (row.frequencyUnit === 'ONCE') {
        return row.number + '天/次'
      } else if (row.frequencyUnit === 'DAY') {
        return row.number + '次/天'
      }
    },
    onPatrolFormat (row, column) {
      if (row.onPatrol) {
        return '是'
      } else {
        return '否'
      }
    },
    onMaintainFormat (row, column) {
      if (row.onMaintain) {
        return '是'
      } else {
        return '否'
      }
    },
    patrolTypeFormat (patrolType) {
      if (patrolType === 'PATROL') {
        return '巡更'
      } else if (patrolType === 'POLLING') {
        return '巡检'
      }
    },
    onEdit () {
      this.readOnly = false
      this.getEquirementTypes()
    },
    editFrom (formName) { // 编辑巡更巡检表
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.multipleSelection.length) {
            this.detailsData.equirementIds = this.multipleSelection.map((item, index) => {
              return item.id
            })
            delete this.detailsData.equirements
            console.log(this.detailsData)
            context.http.put('/cms/api/patrolInspection', this.detailsData).then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
                this.onHide()
                this.$emit('query')
              }
            })
          } else {
            this.$message.error('请选择设备')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    querySeach () {
      if (!this.queryParams.equirementType) {
        this.$message.error('请先选择设备分类')
        return
      }
      this.query()
    },
    getRowKey (row) {
      return row.id
    },
    handleChange (value) { // 设备类型二级联选择器
      this.queryParams.equirementType = value[value.length - 1]
      console.log(this.queryParams.equirementType)
    },
    async getEquirementTypes () { // 请求设备大小类
      this.cascaderList = []
      let result = await context.http.get('/cms/api/equirementTypes/tree')
      this.equirementTypes = result.data
      this.equirementTypes.forEach((element, index) => {
        this.cascaderList.push({ value: element.id, label: element.name, children: [] })
        element.child.forEach(item => {
          this.cascaderList[index].children.push({ value: item.id, label: item.name })
        })
      })
      this.cascaderVal = [result.data[0].id]
      // this.handleChange(this.cascaderVal)
      this.queryParams.equirementType = result.data[0].id
      this.query()
    },
    addequipment (index, row) {
      row.isAdd = true
      this.multipleSelection.push(row)
      console.log(this.multipleSelection)
      this.$forceUpdate()
    },
    delequipment (index, row) {
      let id = row.id
      this.tableData.forEach((itm, idx) => {
        if (itm.id === id) {
          itm.isAdd = false
        }
      })
      this.multipleSelection.splice(index, 1)
      this.$forceUpdate()
    },
    async query () {
      let result = await context.http.get('cms/api/patrolInspection/equirement', {
        // page: (this.currentPage - 1),
        // size: this.pgSize,
        sort: 'id,desc',
        projectManagementId: this.detailsData.projectManagementId,
        equirementTypeId: this.queryParams.equirementType,
        patrolType: this.detailsData.patrolType,
        name: this.queryParams.name,
        installPosition: this.queryParams.installPosition
      })
      result.data = JSOG.decode(result.data)
      result.data.forEach((item, index) => {
        item.isAdd = false
        this.multipleSelection.forEach((itm, idx) => {
          if (item.id === itm.id) {
            item.isAdd = true
          }
        })
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      this.totalPages = Math.ceil(this.total / this.pgSize)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    onHide () {
      this.multipleSelection = []
      this.tableData = []
      this.currentPage = 1
      this.total = 1
      this.readOnly = true
      this.queryParams = { // 条件查询入参
        equirementType: '',
        name: '',
        installPosition: ''
      }
      this.$refs['detailsData'].resetFields()
      this.$emit('close', false)
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    }
  }
}
</script>
<style lang="scss" >
.patrolPollingModule {
  .tableData {
    .el-table__body-wrapper {
      &::-webkit-scrollbar {
        width: 4px !important;
        height: 4px !important;
      }

      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px #fff;
        background-color: #fff;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 6px #cccccc;
      }
    }
  }
  .el-input__inner {
    height: 32px;
  }
  .el-input__icon {
    line-height: 32px;
  }
  .ctc-foot {
    padding: 20px 20px 30px 20px;
  }
  .el-form-item {
    .frequency {
      display: flex;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      .el-input {
        width: 65%;
      }
      .el-select {
        width: 35% !important;
        .el-input {
          width: 100%;
        }
      }
      .el-input__inner {
        border: none !important;
      }
    }
  }
  .textarea {
    border: none;
  }
  .el-select {
    width: 100%;
  }
}
</style>
<style lang="scss" scoped>
.patrolPollingModule {
  .table {
    .normal {
      color: #49af61;
    }
    .abnormal {
      color: #ff6665;
    }
  }
  .el-select {
    width: 100%;
  }
  .annexesList {
    display: flex;
    font-size: 14px;
    color: #262626;
    height: 35px;
    line-height: 35px;
    border-bottom: 1px solid #eaeaea;
    > span {
      width: 80%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .repairRecord {
    .el-collapse-item__header {
      padding-left: 15px;
      background-color: #fafafa;
    }
    .el-collapse-item__wrap {
      .content {
        padding: 15px 10px;
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
        .item {
          width: 33%;
          height: 70px;
          padding-left: 20px;
          > p {
            font-size: 14px;
            margin-bottom: 10px;
          }
          > span {
            display: inline-block;
            width: 100%;
            font-size: 12px;
            color: #8e8e8e;
          }
        }
      }
    }
  }
  .details_content {
    height: 100%;
    .main_content {
      padding: 0 !important;
      margin: 0;
      width: 900px;
      height: calc(100% - 80px);
      .vertical {
        display: inline-block;
        width: 4px;
        height: 16px;
        background-color: #3575f6;
        border-radius: 2px;
        vertical-align: middle;
        margin-right: 5px;
      }
      .title {
        padding-left: 20px;
        font-size: 16px;
        font-weight: bolder;
        padding-left: 26px;
        height: 40px;
        line-height: 40px;
        background-color: #fff;
        border-bottom: 1px solid #f6f6f6;
        position: relative;
        color: #262626;
      }
      .mainInfo {
        height: 60px;
        border: 1px solid #dadada;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        padding: 0 20px;
        justify-content: space-between;
        font-size: 14px;
      }
      .basInfo {
        padding: 10px 0 0 0;
        margin-bottom: 20px;
        .queryParams {
          padding: 10px 0 0 15px;
          .query-btn {
            display: inline-block;
            width: 80px;
            margin: 0;
          }
        }
      }
      .upLoadDiv {
        padding-left: 20px;
        padding-bottom: 20px;
        > div {
          display: flex;
          flex-wrap: wrap;
          margin: 15px 0;
        }
        .imgList {
          margin-right: 10px;
          margin-bottom: 10px;
          .item {
            width: 160px;
            height: 120px;
            position: relative;
            border: none;
            &:hover > .bottomTips {
              height: 25px;
            }
            > i.deleteBtn {
              position: absolute;
              right: -8px;
              top: -8px;
              cursor: pointer;
            }
            .bottomTips {
              display: inline-block;
              height: 0px;
              position: absolute;
              left: 0px;
              bottom: 0px;
              width: 100%;
              text-align: center;
              background: rgba(38, 38, 38, 0.6);
              line-height: 25px;
              font-size: 12px;
              padding: 0 5px;
              cursor: pointer;
              color: #fefefe;
              text-align: center;
              transition: height 0.5s;
              overflow: hidden;
            }
            img {
              width: 160px;
              height: 120px;
            }
            > div {
              height: 30px;
              line-height: 30px;
              display: flex;
              justify-content: space-between;
              padding: 0 10px;
              align-items: center;
              position: absolute;
              width: 100%;
              left: 0;
              bottom: 0;
              background-color: rgba(255, 255, 255, 0.7);
              > span {
                display: inline-block;
                width: 70%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              > i {
                cursor: pointer;
              }
            }
          }
        }
        .upLoadComponents {
          width: 160px;
          height: 120px;
          border: 1px solid #d0d0d0ff;
          position: relative;
          // background: url(../../../../assets/plus.png) no-repeat center;
          > i {
            font-size: 36px;
            color: #3575f6;
            position: absolute;
            top: 30%;
            left: 40%;
          }
          .aliUpload {
            height: 100%;
            background: #f7f9fd;
            .oss_file {
              border: none !important;
              height: 120px !important;
              width: 100%;
              line-height: 195px;
              color: #3577f6;
            }
          }
        }
      }
      .content {
        padding: 15px;
        .addequipment {
          color: #3575f6;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
        .form {
          display: flex;
          flex-wrap: wrap;
          .el-form-item {
            width: 30%;
            margin-left: 15px;
            .el-form-item__content {
              > span {
                margin-bottom: 5px;
                display: inline-block;
              }
              > .readOnlyTxt {
                height: 40px;
                line-height: 40px;
                font-size: 14px;
                color: #262626;
              }
              .seachDeviceIcon {
                display: inline-block;
                width: 20px;
                height: 20px;
                background: url(../../../../assets/seachDeviceIcon.png)
                  no-repeat;
                position: absolute;
                right: 10px;
                top: 33px;
                cursor: pointer;
              }
              .el-textarea__inner {
                resize: none !important;
              }
            }
          }
        }
      }
    }
  }

  .dialog-footer {
    background-color: #fff;
  }
  .close-button {
    color: #666 !important;
    background-color: #fff !important;
    border: none !important;
    &:hover {
      color: #3575f6 !important;
    }
  }
  .defaultbtn {
    width: 90px !important;
    margin-left: 0;
  }
}
</style>

