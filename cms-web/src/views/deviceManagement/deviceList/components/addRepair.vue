<template>
  <div class="tenant-details addRepair">
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="tenant-details details-content"
           slot="drawer">
        <div class="main-content"
             style="border:none">
          <div class="mainInfo">
            <div>
              <span>报修编号： </span>
              <span>{{repairDetailsData.repairFormCode}}</span>
            </div>
            <div>
              <span>报修单状态： </span>
              <el-select v-model="addData.repairFormStatus">
                <!-- <el-option label="待处理" value="REFERED"></el-option>    -->
                <el-option label="处理中"
                           value="WAIT"></el-option>
                <el-option label="已处理"
                           value="OVER"></el-option>
                <!-- <el-option label="维修完成" value="COMPLETE"></el-option>   
                <el-option label="未完成" value="NO"></el-option>    -->
              </el-select>
            </div>
          </div>
          <div class="basInfo">
            <p class="title">基本信息</p>
            <!-- <span @click="editFn" style="position: absolute; top: -35px; right: 0;">编辑</span> -->
            <div class="content">
              <el-form class="form"
                       :model="addData"
                       ref="addData"
                       :rules="addDataRules">
                <el-form-item prop="repairType">
                  <span>维保类型<i class="required">*</i></span>
                  <p class="readOnlyTxt">设备</p>
                  <el-input v-model="addData.repairType"
                            style="width:240px"
                            v-show="false"></el-input>
                </el-form-item>
                <el-form-item prop="maintenanceClassify">
                  <span>维保方式<i class="required">*</i></span>
                  <p class="readOnlyTxt">维修</p>
                  <el-input v-model="addData.maintenanceClassify"
                            style="width:240px"
                            v-show="false"></el-input>
                </el-form-item>
                <el-form-item prop="equirementNo">
                  <span>设备编号</span>
                  <!-- <el-input style="width:200px;margin-right:30px;display:none" v-model="addData.equirementNo"></el-input> -->
                  <el-input v-if="pageType==='add'"
                            style="width:200px;margin-right:30px"
                            v-model="addData.equirementNo"></el-input>
                  <p class="readOnlyTxt"
                     v-else>{{repairDetails.equirementNo}}</p>
                  <i class="seachDeviceIcon"
                     @click="showChosseDevDialog"
                     v-if="pageType==='add'"></i>
                </el-form-item>
                <el-form-item prop="name">
                  <span>设备名称<i class="required">*</i></span>
                  <el-input v-model="addData.name"
                            style="width:240px"
                            v-if="pageType==='add'"></el-input>
                </el-form-item>
                <el-form-item prop="repairUserName">
                  <span>维保人员<i class="required">*</i></span>
                  <el-input v-model="addData.repairUserName"
                            style="width:240px"
                            v-if="pageType==='add'"
                            maxlength="5"></el-input>
                </el-form-item>
                <el-form-item prop="repairDate">
                  <span style="width:100%">维保日期<i class="required">*</i></span>
                  <!-- <el-input v-model="addData.cause"  v-if="pageType==='add'"></el-input> -->
                  <el-date-picker v-model="addData.repairDate"
                                  type="date"
                                  placeholder="选择日期"
                                  v-if="pageType==='add'"
                                  style="width:240px"
                                  value-format="yyyy-MM-dd"></el-date-picker>
                  <p class="readOnlyTxt"
                     v-else>{{repairDetailsData.repairDate}}</p>
                </el-form-item>
                <el-form-item prop="repairFee">
                  <span>维保费用<i class="required">*</i></span>
                  <el-input v-model="addData.repairFee"
                            style="width:240px"
                            v-if="pageType==='add'"
                            maxlength="10"></el-input>
                  <p class="readOnlyTxt"
                     v-else>{{repairDetailsData.repairFee}}</p>
                </el-form-item>
                <el-form-item prop="repairStatus">
                  <span>维保结果<i class="required">*</i></span>
                  <el-select v-model="addData.repairStatus"
                             style="width:240px"
                             v-if="pageType==='add'">
                    <el-option label="维保完成"
                               value="COMPLETE"></el-option>
                    <el-option label="维保未完成"
                               value="NO"></el-option>
                  </el-select>
                  <p class="readOnlyTxt"
                     v-else>{{formatRepairStatus(repairDetailsData.repairStatus)}}</p>
                </el-form-item>
                <el-form-item prop="description">
                  <span>维保原因</span>
                  <el-input v-model="addData.description"
                            style="width:240px"
                            v-if="pageType==='add'"
                            maxlength="40"></el-input>
                  <p class="readOnlyTxt"
                     v-else>{{repairDetailsData.description}}</p>
                </el-form-item>
                <el-form-item prop="materialUsage">
                  <span>用材情况</span>
                  <el-input v-model="addData.materialUsage"
                            style="width:240px"
                            v-if="pageType==='add'"
                            maxlength="40"></el-input>
                  <p class="readOnlyTxt"
                     v-else>{{repairDetailsData.materialUsage}}</p>
                </el-form-item>
                <el-form-item prop="remake"
                              style="width:61%">
                  <span>备注</span>
                  <el-input v-model="addData.remake"
                            style="width:530px"
                            v-if="pageType==='add'"
                            maxlength="40"></el-input>
                  <p class="readOnlyTxt"
                     v-else>{{repairDetailsData.remake}}</p>
                </el-form-item>
              </el-form>
            </div>
            <div class="upLoadDiv">
              <!-- <p>{{pageType==='add'?'报修预览图':'维保后图片'}}</p> -->
              <p>发票及维保后图片</p>
              <div>
                <div class="imgList"
                     v-for="(item,index) in addData.imageUrls"
                     :key="index"
                     v-show="pageType==='add'">
                  <div class="item">
                    <img :src="item"
                         alt="">
                    <div>
                      <span></span>
                      <i class="el-icon-view"
                         @click="showImg(item,index)"></i>
                      <i class="el-icon-delete"
                         @click="delImg(item,index)"></i>
                    </div>
                  </div>
                </div>
                <div class="imgList imgList1"
                     v-for="(item,index) in repairDetailsData.imageUrls"
                     :key="index"
                     v-show="pageType==='readOnly'">
                  <div class="item">
                    <img :src="item"
                         alt="">
                    <div>
                      <span></span>
                      <i class="el-icon-view"
                         @click="showImg(item,index)"></i>
                    </div>
                  </div>
                </div>
                <div class="upLoadComponents"
                     v-if="addData.imageUrls.length<5 && pageType==='add'">
                  <aliUpload class="aliUpload"
                             :upLoadText="upLoadText"
                             :fileType="fileType"
                             :iconShow="false"
                             @setAnnex="setAnnex" />
                </div>
              </div>
              <p v-if="pageType==='add'">（最多可上传5张,建议尺寸：<i style="color:#F00">100＊100</i>像素；支持格式JPG,PNG）</p>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="onHide"
                   class="close-button">关闭</el-button>
        <el-button type="primary"
                   class="defaultbtn dialog-confirmBtn"
                   @click="addRepairSave('addData')"
                   v-if="pageType==='add'">确 定</el-button>
      </div>
    </drawer>
    <el-dialog title="选择设备"
               :visible.sync="chosseDevDialogVisible"
               width="900px"
               id="chosseDevDialogVisible"
               class="chosseDevDialogVisible"
               @close="closeChosseDevDialog">
      <div class="seachDiv">
        <el-select placeholder="全部"
                   style="width:160px"
                   v-model="projectManagementId"
                   clearable>
          <el-option v-for="(item,index) in projectManagementsList"
                     :key="index"
                     :label="item.referred"
                     :value="item.id"></el-option>
        </el-select>
        <el-cascader :options="cascaderList"
                     @change="handleChange1"
                     style="width:160px"
                     clearable></el-cascader>
        <el-input placeholder="设备名称"
                  style="width:160px"
                  v-model="devName"></el-input>
        <el-input placeholder="设备编号"
                  style="width:160px"
                  v-model="devNb"></el-input>
        <el-button class="secrchBtn"
                   type="primary"
                   @click="querySeach">查询</el-button>
      </div>
      <div class="table"
           id="table">
        <el-table :data="tableData"
                  style="width: 100%"
                  ref="tableData">
          <el-table-column width="55"
                           label="">
            <template slot-scope="scope">
              <el-radio :label="scope.row.id"
                        v-model="selectionId"
                        @change.native="getTemplateRow(scope.$index,scope.row)">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="name"
                           label="设备名称"
                           align="center"> </el-table-column>
          <el-table-column prop="code"
                           label="设备编号"
                           align="center"> </el-table-column>
          <el-table-column prop="projectManagement.referred"
                           label="项目简称"
                           align="center"> </el-table-column>
          <el-table-column prop="equirementType.parent.name"
                           label="设备大类"
                           align="center"> </el-table-column>
          <el-table-column prop="brand"
                           label="品牌"
                           align="center"> </el-table-column>
          <el-table-column prop="installPosition"
                           label="安装位置"
                           align="center"> </el-table-column>
        </el-table>
      </div>
      <div class="ctc-foot">
        <el-col :span="24">
          <span class="flex">
            <el-pagination v-if="total > 0"
                           background
                           layout="prev, pager, next"
                           :page-size=15
                           :total="total"
                           :current-page.sync="currentPage"
                           @current-change="current_change">
            </el-pagination>
          </span>
        </el-col>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeChosseDevDialog">返 回</el-button>
        <el-button type="primary"
                   class="defaultbtn dialog-confirmBtn"
                   @click="selectdDevic">确定</el-button>
      </span>
    </el-dialog>
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
  </div>
</template>
<script>
import context from '@/service'
import aliUpload from '@/components/aliUpload.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import Drawer from '@/components/drawer.vue'
export default {
  components: {
    Drawer,
    aliUpload,
    picturePrevie
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    repairDetailsData: {
      // type: Object
    },
    projectManagementsList: {

    },
    equirementId: { // 新增维保的设备id

    },
    pageType: { // readOnly详情页 add 新增
      type: String,
      default: 'add'
    },
    drawerTitle: {
      type: String,
      default: '新增维保记录'
    }
  },
  watch: {
    detailsdrawershow: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          // this.addData.repairStatus = this.repairDetailsData.repairStatus
          this.addData.repairFormCode = this.repairDetailsData.repairFormCode
          this.addData.repairFormId = this.repairDetailsData.id
          this.addData.equirementNo = this.repairDetailsData.equirementNo
          this.addData.name = this.repairDetailsData.name
        }
      },
      immediate: true
    }
  },
  created () {
    this.getDevice()
  },
  mounted () {

  },
  data () {
    return {
      equirementType: '',
      cascaderList: [], // 设备类型二级联选择器
      equirementNo: '',
      devNb: '',
      devName: '',
      chosseDevDialogVisible: false,
      addData: {
        repairUserName: null,
        repairDate: null,
        repairFee: null,
        description: null,
        remake: null,
        equirementNo: null,
        equirementId: null,
        materialUsage: null,
        name: null,
        repairFormStatus: 'WAIT',
        repairStatus: 'NO',
        repairType: 'EQUIREMENT',
        maintenanceClassify: 'REPAIR',
        imageUrls: []
      },
      selectionArr: [], // 选中
      selectionId: '', // 选中
      projectManagementId: '',
      tableData: [],
      showPicture: false,
      imgArr: [],
      num: 1,
      upLoadText: '上传图片',
      fileType: ['jpg', 'png'],
      value: '',
      bulidFloorList: [],
      addDataRules: {
        equirementNo: [
          { required: true, message: '请输入设备编号', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入设备名称', trigger: 'change' }
        ],
        repairUserName: [
          { required: true, message: '请输入维保人', trigger: 'change' }
        ],
        repairDate: [
          { required: true, message: '请选择维保日期', trigger: 'change' }
        ],
        repairFee: [
          { required: true, message: '请输入维保费用', trigger: 'change' }
        ],
        repairStatus: [
          { required: true, message: '请选择维保结果', trigger: 'change' }
        ]
      },
      currentPage: 1,
      total: 0,
      pgSize: 15
    }
  },
  computed: {

  },
  methods: {
    showChosseDevDialog () {
      this.getEquirementTypes()
      context.http.get('cms/api/equirements', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'id,desc',
        projectManagementId: this.projectManagementId,
        equirementTypeChildId: this.equirementType,
        name: this.devName,
        code: this.devNb
      }).then(result => {
        this.tableData = JSOG.decode(result.data)
        this.total = Number(result.headers['x-total-count'])
        this.chosseDevDialogVisible = true
      })
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
    },
    handleChange1 (value) { // 设备类型二级联选择器
      this.equirementType = value[value.length - 1]
      console.log(this.equirementType)
    },
    querySeach () {
      this.currentPage = 1
      this.getDevice()
    },
    closeChosseDevDialog () {
      this.chosseDevDialogVisible = false
    },
    selectdDevic () {
      if (this.selectionId === '') {
        this.$notify.error({
          title: '错误',
          duration: 2000,
          message: '请选择设备'
        })
        return
      }
      this.addData.equirementId = this.selectionId
      this.$set(this.addData, 'name', this.selectionArr.name)
      this.addData.equirementNo = this.selectionArr.code
      this.closeChosseDevDialog()
    },
    delImg (item, index) {
      this.addData.imageUrls.splice(index, 1)
    },
    formatRepairStatus (n) {
      if (n === 'COMPLETE') {
        return '维保完成'
      } else if (n === 'NO') {
        return '未完成'
      }
    },
    setAnnex (annexURL, annexName) {  // 子组件上传成功返回文件url 和名字
      this.addData.imageUrls.push(annexURL)
    },
    addRepairSave (formName) { // 新增维保记录
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _this = this
          context.http.post('/cms/api/repair-records', this.addData).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '维保记录新增成功'
              })
              _this.onHide()
              _this.$emit('addRecordsSuc')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getTemplateRow (index, row) {                                 // 获取选中数据
      this.selectionArr = row
      console.log(this.selectionId, this.selectionArr)
    },
    editFn () {
      if (this.pageType === 'add') {
        this.pageType = 'readOnly'
      } else {
        this.pageType = 'add'
      }
    },
    showImg (item, index) {
      let imgArr = []
      if (this.pageType === 'add') {
        this.addData.imageUrls.forEach(item => {
          imgArr.push(item)
        })
      } else {
        this.repairDetailsData.imageUrls.forEach(item => {
          imgArr.push(item)
        })
      }

      this.imgArr = imgArr
      this.num = index
      this.showPicture = true
    },
    pictureClose () {
      this.showPicture = false
    },
    handleChange () {
      this.storeNum = this.value
      console.log(this.value)
    },
    onHide () {
      this.equirementNo = ''
      this.addData.imageUrls = []
      this.$refs['addData'].resetFields()
      this.$emit('drawerClose', false)
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.getDevice()
    },
    getDevice () { // 获取设备列表
      context.http.get('cms/api/equirements', {
        projectManagementId: this.projectManagementId,
        equirementTypeChildId: this.equirementType,
        name: this.devName,
        code: this.devNb,
        page: (this.currentPage - 1),
        size: this.pgSize
      }).then(res => {
        this.tableData = JSOG.decode(res.data)
        this.total = Number(res.headers['x-total-count'])
      }).catch(error => {
        console.info(error)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.addRepair {
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
  .menuTab {
    height: 60px;
    line-height: 60px;
    margin: 10px 30px;
    box-shadow: 0px 1px 5px #eee;
    > span {
      display: inline-block;
      width: 120px;
      text-align: center;
      font-size: 16px;
      cursor: pointer;
      &.active {
        color: #3577f6;
        border-bottom: 2px solid #3577f6;
      }
    }
  }
  .chosseDevDialogVisible {
    .seachDiv {
      height: 80px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .secrchBtn {
        width: 120px;
        height: 32px;
        line-height: 32px;
        padding: 0;
      }
    }
    .table {
      margin-top: 0;
    }
    .ctc-foot {
      padding: 0px 0 30px 20px;
    }
  }
  .main-content {
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
      min-height: 500px;
      width: 900px;
      margin-bottom: 20px;
    }
    .upLoadDiv {
      padding-left: 20px;
      > div {
        display: flex;
        flex-wrap: wrap;
        margin: 15px 0;
      }
      .imgList {
        margin-right: 10px;
        margin-bottom: 10px;
        .item {
          width: 150px;
          height: 130px;
          position: relative;
          border: 1px solid #cecdcd;
          img {
            width: 148px;
            height: 128px;
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
        width: 150px;
        height: 130px;
        border: 1px dashed #d0d0d0ff;
        background: url(../../../../assets/plus.png) no-repeat center;
        .aliUpload {
          .oss_file {
            border: none !important;
            height: 130px;
            width: 100%;
            line-height: 195px;
            color: #3577f6;
          }
        }
      }
    }
    .content {
      padding: 15px 0;
      .form {
        display: flex;
        flex-wrap: wrap;
        .el-form-item {
          width: 30%;
          margin-left: 20px;
          .el-form-item__content {
            > span {
              margin-bottom: 5px;
              display: inline-block;
            }
            > .readOnlyTxt {
              height: 40px;
              line-height: 40px;
              font-size: 12px;
              color: #8e8e8e;
            }
            .seachDeviceIcon {
              display: inline-block;
              width: 20px;
              height: 20px;
              background: url(../../../../assets/seachDeviceIcon.png) no-repeat;
              position: absolute;
              right: 16px;
              top: 35px;
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
</style>
