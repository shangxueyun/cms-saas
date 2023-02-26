<template>
  <div class="tenant-details addRepair">
    <div class="tenant-details details-content"
         slot="drawer">
      <div class="main-content"
           style="border:none">
        <el-form :model="addData"
                 ref="addData"
                 :rules="addDataRules">
          <div class="basInfo">
            <p class="title"><span class="vertical"></span>基本信息</p>
            <!-- <span @click="editFn" style="position: absolute; top: -35px; right: 0;">编辑</span> -->
            <div class="content">
              <div class="form"
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
                <el-form-item prop="maintenanceClassify"
                              style="padding-left: 15px;">
                  <span>维保方式<i class="required">*</i></span>
                  <p class="readOnlyTxt">保养</p>
                  <el-input v-model="addData.maintenanceClassify"
                            style="width:240px"
                            v-show="false"></el-input>
                </el-form-item>
                <el-form-item prop="equirementId"
                              style="padding-left: 25px;">
                  <span>设备编号</span>
                  <el-input style="width:240px;margin-right:30px;display:none"
                            v-model="addData.equirementNo"></el-input>
                  <el-input v-if="pageType==='add'"
                            style="width:240px;margin-right:30px"
                            v-model="equirementNo"></el-input>
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
                <el-form-item prop="repairUserName"
                              style="padding-left: 15px;">
                  <span>维保人员<i class="required">*</i></span>
                  <el-input v-model="addData.repairUserName"
                            style="width:240px"
                            v-if="pageType==='add'"
                            maxlength="5"></el-input>
                </el-form-item>
                <el-form-item prop="repairDate"
                              style="padding-left: 25px;">
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
                <el-form-item prop="repairStatus"
                              style="padding-left: 15px;">
                  <span>维保结果<i class="required">*</i></span>
                  <el-select v-model="addData.repairStatus"
                             style="width:240px"
                             v-if="pageType==='add'">
                    <el-option label="维保未完成"
                               value="NO"></el-option>
                    <el-option label="维保完成"
                               value="COMPLETE"></el-option>
                  </el-select>
                  <p class="readOnlyTxt"
                     v-else>{{formatRepairStatus(repairDetailsData.repairStatus)}}</p>
                </el-form-item>
                <el-form-item prop="description"
                              style="padding-left: 25px;">
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
                              style="width:54%;padding-left: 15px;">
                  <span>备注</span>
                  <el-input v-model="addData.remake"
                            style="width:540px"
                            v-if="pageType==='add'"
                            maxlength="40"></el-input>
                  <p class="readOnlyTxt"
                     v-else>{{repairDetailsData.remake}}</p>
                </el-form-item>
              </div>
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
                    <div @click="showImg(item,index)"
                         class="bottomTips">预览图片</div>
                    <i class="deleteBtn iconfont icon-cms_cuowu"
                       @click="delImg(item,index)"></i>
                  </div>
                </div>
                <div class="imgList imgList1"
                     v-for="(item,index) in repairDetailsData.imageUrls"
                     :key="index"
                     v-show="pageType==='readOnly'">
                  <div class="item">
                    <img :src="item"
                         alt="">
                    <div @click="showImg(item,index)"
                         class="bottomTips">预览图片</div>
                  </div>
                </div>
                <div class="upLoadComponents"
                     v-if="addData.imageUrls.length<5 && pageType==='add'">
                  <i class="iconfont icon-shangchuantupianicon"></i>
                  <aliUpload class="aliUpload"
                             :upLoadText="upLoadText"
                             :fileType="fileType"
                             :iconShow="false"
                             @setAnnex="setAnnex" />
                </div>
              </div>
              <p v-if="pageType==='add'">（最多可上传5张,建议尺寸：<span style="color:#F00">160＊120</span>像素；支持格式JPG,PNG）</p>
            </div>
          </div>

          <div class="basInfo">
            <p class="title"><span class="vertical"></span>维保计划</p>
            <div class="content">
              <el-form-item style="margin-left:20px;"
                            prop="nextMaintenanceTime">
                <span style="margin-right:10px;font-size: 14px"><i>下次维保日期:</i></span>
                <el-date-picker v-model="addData.nextMaintenanceTime"
                                :picker-options="contractEnd"
                                type="date"
                                placeholder="选择日期"
                                v-if="pageType==='add'"
                                style="width:240px"
                                value-format="yyyy-MM-dd"></el-date-picker>
                <p class="readOnlyTxt"
                   v-else>{{repairDetailsData.nextMaintenanceTime ? repairDetailsData.nextMaintenanceTime : '-'}}</p>
              </el-form-item>
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
                 @click="addRepairSave('addData')"
                 v-if="pageType==='add'">确定</el-button>
    </div>
    <el-dialog append-to-body
               title="选择设备"
               :visible.sync="chosseDevDialogVisible"
               width="900px"
               id="chosseDevDialogVisible"
               class="chosseDevDialogVisible"
               @close="closeChosseDevDialog">
      <div style="margin:15px 0;"
           class="seachDiv">
        <!-- <el-select placeholder="全部" style="width:160px" v-model="projectManagementId" clearable>
          <el-option v-for="(item,index) in projectManagementsList" :key="index" :label="item.referred" :value="item.id"></el-option>
        </el-select> -->
        <el-cascader :options="cascaderList"
                     @change="handleChange1"
                     style="width:160px"
                     v-model="goodsClassfiyList"
                     clearable
                     size="small"></el-cascader>
        <el-input placeholder="设备名称"
                  style="width:160px"
                  v-model="devName"
                  size="small"></el-input>
        <el-input placeholder="设备编号"
                  style="width:160px"
                  v-model="devNb"
                  size="small"></el-input>
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
          <!-- <el-table-column prop="projectManagement.referred" label="项目简称"  align="center"> </el-table-column> -->
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
      <div class="ctc-foot1">
        <el-col :span="24">
          <span class="flex"
                style="flex-direction: row-reverse;">
            <el-pagination v-if="total > 0"
                           background
                           layout="prev, pager, next"
                           :page-size="pgSize"
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
    projectId: {
      type: Number
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
        equirementId: '',
        repairType: 'EQUIREMENT',
        maintenanceClassify: 'MAINTAIN',
        imageUrls: [],
        description: '',
        materialUsage: '',
        remake: ''
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
        equirementId: [
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
      contractEnd: {
        disabledDate: time => {
          if (this.addData.repairDate) {
            return time.getTime() < new Date(this.addData.repairDate).getTime()
          } else {
            return
          }
        }
      },
      currentPage: 1,
      total: 0,
      pgSize: 15,
      repairDetailsData: {},
      goodsClassfiyList: []
    }
  },
  computed: {

  },
  methods: {
    showChosseDevDialog () {
      this.projectManagementId = this.projectId
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
      this.showChosseDevDialog()
    },
    closeChosseDevDialog () {
      this.chosseDevDialogVisible = false
      this.goodsClassfiyList = []
      this.equirementType = ''
      this.devName = ''
      this.devNb = ''
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
      console.log(this.selectionId)
      this.addData.equirementId = this.selectionId
      this.$set(this.addData, 'name', this.selectionArr.name)
      this.equirementNo = this.selectionArr.code
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
      // this.addData.equirementId = this.equirementId
      console.log(this.addData)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _this = this
          context.http.post('/cms/api/repair-records', this.addData).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '维保记录新增成功'
              })
              this.$emit('repairRecordNum')
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
        this.tableData = res.data
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
<style lang="scss">
.chosseDevDialogVisible {
  .el-dialog__header {
    padding: 20px 20px 10px 0;
  }
  .secrchBtn {
    width: 100px;
    height: 32px;
    line-height: 31px;
    padding: 0;
  }
}
.tenant-details.addRepair {
  .el-input__inner {
    height: 32px;
  }
  .el-input__icon {
    line-height: 32px;
  }
}
</style>
