<template>
  <div class="tenant-details addFrom">
    <div class="tenant-details details-content"
         slot="drawer">
      <div class="main-content"
           style="border:none">
        <el-form :model="addData"
                 ref="addData"
                 :rules="addDataRules">
          <div class="basInfo">
            <p class="title"><span class="vertical"></span>基本信息</p>
            <div class="content">
              <div class="form">
                <el-form-item prop="projectManagementId">
                  <span>项目简称<i class="required">*</i></span>
                  <el-select v-model="addData.projectManagementId"
                             @change="patrolTypeChange"
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
                  <el-select v-model="addData.patrolType"
                             @change="patrolTypeChange"
                             size="small">
                    <el-option label="巡更"
                               value="PATROL"></el-option>
                    <el-option label="巡检"
                               value="POLLING"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="name">
                  <span>巡更巡检表名称<i class="required">*</i></span>
                  <el-input v-model="addData.name"
                            maxlength="20"></el-input>
                </el-form-item>
                <el-form-item prop="number">
                  <span>频次<i class="required">*</i></span>
                  <div class="frequency">
                    <el-input v-model="addData.number"
                              onkeyup="value=value.replace(/[^0-9]/g,'')"
                              onpaste="value=value.replace(/[^0-9]/g,'')"
                              oncontextmenu="value=value.replace(/[^0-9]/g,'')"
                              maxlength="5"></el-input>
                    <el-select v-model="addData.frequencyUnit"
                               size="small">
                      <el-option label="次/天"
                                 value="DAY"></el-option>
                      <el-option label="天/次"
                                 value="ONCE"></el-option>
                    </el-select>
                  </div>
                </el-form-item>
              </div>
            </div>
          </div>

          <div class="basInfo">
            <p class="title"><span class="vertical"></span>设备列表</p>
            <div class="queryParams">
              <el-cascader :options="cascaderList"
                           :key="keyValue"
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
                        ref="multipleTable"
                        empty-text="请先选择设备分类进行查询">
                <!-- <el-table-column :reserve-selection="true"
                                 align="center"
                                 type="selection"
                                 width="55"></el-table-column> -->
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
              <span>已选中设备{{multipleSelection.length}}项</span>
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
         style="text-align: right;padding: 8px 20px 8px;"
         class="dialog-footer">
      <el-button @click="onHide"
                 class="close-button">取消</el-button>
      <el-button type="primary"
                 class="defaultbtn dialog-confirmBtn"
                 @click="addFrom('addData')">确定</el-button>
    </div>
  </div>
</template>
<script>
import context from '@/service'
import aliUpload from '@/components/aliUpload.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import Drawer from '@/components/drawer.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import ailPreview from '@/components/ailPreview.vue'
import * as JSOG from 'jsog'
export default {
  components: {
    Drawer,
    aliUpload,
    aliDownLoad,
    ailPreview,
    picturePrevie
  },
  props: {

  },
  watch: {
    cascaderList (newVal) {
      this.keyValue++ // 只要监听到数据源发生变化 ，改变keyValue的值，达到重新渲染的效果
    }
  },
  created () {
    this.projectManagementsList = this.$store.state.projectManagementsList
    this.addData.projectManagementId = this.projectManagementsList[0].id
    // this.getEquirementTypes()
  },
  mounted () {

  },
  data () {
    return {
      keyValue: 0,
      cascaderVal: [],
      tableData: [],
      multipleSelection: [],
      cascaderList: [], // 设备类型二级联选择器
      queryParams: { // 条件查询入参
        equirementType: '',
        name: '',
        installPosition: ''
      },
      addData: {
        projectManagementId: '',
        equirementIds: [],
        patrolType: '',
        name: '',
        number: '',
        frequencyUnit: 'ONCE'
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
  computed: {

  },
  methods: {
    patrolTypeChange () {
      this.multipleSelection = []
      this.tableData = []
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
    addFrom (formName) { // 新增巡更巡检表
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.multipleSelection.length) {
            this.addData.equirementIds = this.multipleSelection.map((item, index) => {
              return item.id
            })
            console.log(this.addData)
            context.http.post('/cms/api/patrolInspection', this.addData).then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '新增成功'
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
    // handleSelectionChange (val) {
    //   this.multipleSelection = val
    //   console.log(this.multipleSelection)
    // },
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
      this.queryParams.equirementType = result.data[0].id
      this.query()
      // this.handleChange(this.cascaderVal)
    },
    async query () {
      let result = await context.http.get('cms/api/patrolInspection/equirement', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'id,desc',
        projectManagementId: this.addData.projectManagementId,
        patrolType: this.addData.patrolType,
        name: this.queryParams.name,
        equirementTypeId: this.queryParams.equirementType,
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
    onHide () {
      this.multipleSelection = []
      this.tableData = []
      // this.getEquirementTypes()
      this.queryParams = { // 条件查询入参
        name: '',
        installPosition: ''
      }
      this.$refs['addData'].resetFields()
      this.$emit('drawerClose', false)
    },
    closeInit () {
      this.multipleSelection = []
      this.tableData = []
      // this.getEquirementTypes()
      this.queryParams = { // 条件查询入参
        name: '',
        installPosition: ''
      }
      this.$refs['addData'].resetFields()
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    }
  }
}
</script>
<style lang="scss" >
.tenant-details.addFrom {
  .el-input__inner {
    height: 32px;
  }
  .el-input__icon {
    line-height: 32px;
  }
}
.addFrom {
  .ctc-foot {
    padding: 20px 20px 30px 20px;
  }
  .frequency {
    display: flex;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    .el-input {
      width: 55%;
    }
    .el-select {
      width: 45% !important;
      .el-input {
        width: 100%;
      }
    }
    .el-input__inner {
      border: none;
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
<style lang="scss" >
.addFrom {
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
}
</style>
<style lang="scss" scoped>
.addFrom {
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
  .main-content {
    padding-top: 20px;
    margin: 0;
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
      border: 1px solid #dadada;
      padding: 1px 0;
      // min-height: 500px;
      // width: 900px;
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
          width: 23%;
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
              background: url(../../../../assets/seachDeviceIcon.png) no-repeat;
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

