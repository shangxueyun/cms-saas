<template>
  <div class="tenant-details addRepair">
    <drawer :show="detailsdrawershow"
            :title="drawertitle"
            :showEditBtn="repairDetailsData.repairStatus !== 'COMPLETE' && hasAuthority('03050114') && !isEdit"
            @on-edit="editFn"
            @on-hide="onHide">
      <div class="tenant-details details-content"
           slot="drawer">
        <div class="main-content"
             id="mainContent"
             style="border:none">
          <el-form :model="repairDetailsData"
                   ref="repairDetailsData"
                   :rules="addDataRules">
            <div class="basInfo">
              <p class="title"><span class="vertical"></span>基本信息</p>
              <!-- <span v-if="repairDetailsData.repairStatus !== 'COMPLETE' && hasAuthority('03010117') && !isEdit"  @click="editFn" 
            style="position: absolute; top: -35px; right: 20px;cursor:pointer;color: #3577F6"><i class="iconfont icon-edit1"></i>编辑</span> -->
              <div class="content">
                <div class="form">
                  <el-form-item prop="repairRecordCode">
                    <span>维保编号<i class="required">*</i></span>
                    <p class="readOnlyTxt">{{repairDetailsData.repairRecordCode}}</p>
                  </el-form-item>
                  <el-form-item prop="repairType">
                    <span>维保类型<i class="required">*</i></span>
                    <p class="readOnlyTxt">设备</p>
                    <el-input v-model="repairDetailsData.repairType"
                              style="width:240px"
                              v-show="false"></el-input>
                  </el-form-item>
                  <el-form-item prop="maintenanceClassify">
                    <span>维保方式<i class="required">*</i></span>
                    <p class="readOnlyTxt">保养</p>
                  </el-form-item>
                  <el-form-item prop="equirementNo">
                    <span>设备编号<i class="required">*</i></span>
                    <p class="readOnlyTxt">{{repairDetailsData.equirementNo}}</p>
                  </el-form-item>
                  <el-form-item prop="name">
                    <span>设备名称<i class="required">*</i></span>
                    <p class="readOnlyTxt">{{repairDetailsData.name}}</p>
                  </el-form-item>
                  <el-form-item prop="projectName">
                    <span>项目简称<i class="required">*</i></span>
                    <p class="readOnlyTxt">{{repairDetailsData.projectName}}</p>
                  </el-form-item>
                  <el-form-item prop="buildingName">
                    <span>楼宇名称<i class="required">*</i></span>
                    <p class="readOnlyTxt">{{repairDetailsData.buildingName}}</p>
                  </el-form-item>
                  <el-form-item prop="installPosition">
                    <span>安装位置<i class="required">*</i></span>
                    <p class="readOnlyTxt">{{repairDetailsData.installPosition}}</p>
                  </el-form-item>
                  <el-form-item prop="planMaintenanceTime">
                    <span>计划维保日期<i class="required">*</i></span>
                    <p class="readOnlyTxt">{{repairDetailsData.planMaintenanceTime}}</p>
                  </el-form-item>
                  <el-form-item prop="repairUserName">
                    <span>维保人员<i class="required">*</i></span>
                    <el-input v-if="isEdit"
                              v-model="repairDetailsData.repairUserName"
                              style="width:240px"
                              maxlength="5"></el-input>
                    <p v-else
                       class="readOnlyTxt">{{repairDetailsData.repairUserName}}</p>
                  </el-form-item>
                  <el-form-item prop="repairDate">
                    <span style="width:100%">维保日期<i class="required">*</i></span>
                    <el-date-picker v-model="repairDetailsData.repairDate"
                                    type="date"
                                    placeholder="选择日期"
                                    v-if="isEdit"
                                    style="width:240px"
                                    value-format="yyyy-MM-dd"></el-date-picker>
                    <p class="readOnlyTxt"
                       v-else>{{repairDetailsData.repairDate}}</p>
                  </el-form-item>
                  <el-form-item prop="repairFee">
                    <span>维保费用<i class="required">*</i></span>
                    <el-input v-model="repairDetailsData.repairFee"
                              style="width:240px"
                              v-if="isEdit"
                              maxlength="10"></el-input>
                    <p class="readOnlyTxt"
                       v-else>{{repairDetailsData.repairFee}}</p>
                  </el-form-item>
                  <el-form-item>
                    <span>维保结果<i class="required">*</i></span>
                    <p class="readOnlyTxt">{{formatRepairStatus(repairDetailsData.repairStatus)}}</p>
                  </el-form-item>
                  <el-form-item prop="description">
                    <span>维保原因</span>
                    <el-input v-model="repairDetailsData.description"
                              style="width:240px"
                              v-if="isEdit"
                              maxlength="40"></el-input>
                    <p class="readOnlyTxt"
                       v-else>{{repairDetailsData.description}}</p>
                  </el-form-item>
                  <el-form-item prop="materialUsage">
                    <span>用材情况</span>
                    <el-input v-model="repairDetailsData.materialUsage"
                              style="width:240px"
                              v-if="isEdit"
                              maxlength="40"></el-input>
                    <p class="readOnlyTxt"
                       v-else>{{repairDetailsData.materialUsage}}</p>
                  </el-form-item>
                  <el-form-item prop="remake"
                                style="width:54%">
                    <span>备注</span>
                    <el-input v-model="repairDetailsData.remake"
                              style="width:530px"
                              v-if="isEdit"
                              maxlength="40"></el-input>
                    <p class="readOnlyTxt"
                       v-else>{{repairDetailsData.remake}}</p>
                  </el-form-item>
                </div>
              </div>
              <div class="upLoadDiv">
                <p>发票及维保后图片</p>
                <div>
                  <div v-if="isEdit && repairDetailsData.imageUrls"
                       class="imgList"
                       v-for="(item,index) in repairDetailsData.imageUrls"
                       :key="index">
                    <div class="item">
                      <img :src="item"
                           @click="showImg(item,index)">
                      <div @click="showImg(item,index)"
                           class="bottomTips">预览图片</div>
                      <i class="deleteBtn iconfont icon-cms_cuowu"
                         @click="delImg(item,index)"></i>
                    </div>
                  </div>
                  <div v-if="!isEdit && repairDetailsData.imageUrls"
                       class="imgList imgList1"
                       v-for="(item,index) in repairDetailsData.imageUrls"
                       :key="index">
                    <div class="item">
                      <img :src="item"
                           @click="showImg(item,index)">
                      <div @click="showImg(item,index)"
                           class="bottomTips">预览图片</div>
                    </div>
                  </div>
                  <div class="upLoadComponents"
                       v-if="repairDetailsData.imageUrls && repairDetailsData.imageUrls.length<5 && isEdit">
                    <i class="iconfont icon-shangchuantupianicon"></i>
                    <aliUpload class="aliUpload"
                               :upLoadText="upLoadText"
                               :fileType="fileType"
                               :iconShow="false"
                               @setAnnex="setAnnex" />
                  </div>
                </div>
                <p v-if="isEdit">（最多可上传5张,建议尺寸：<span style="color:#F00">160＊120</span>像素；支持格式JPG,PNG）</p>
              </div>
            </div>

            <div class="basInfo">
              <p class="title"><span class="vertical"></span>维保计划</p>
              <div class="content"
                   style="padding-bottom: 0">
                <el-form-item style="margin-left:20px;"
                              prop="nextMaintenanceTime">
                  <span style="margin-right:10px;font-size: 12px"><i>下次维保日期:</i></span>
                  <el-date-picker v-model="repairDetailsData.nextMaintenanceTime"
                                  :picker-options="contractEnd"
                                  type="date"
                                  placeholder="选择日期"
                                  v-if="isEdit"
                                  style="width:240px"
                                  value-format="yyyy-MM-dd"></el-date-picker>
                  <p style="display:inline-block;font-size: 12px"
                     class="readOnlyTxt"
                     v-else>{{repairDetailsData.nextMaintenanceTime ? repairDetailsData.nextMaintenanceTime : '-'}}</p>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
        <div slot="footer"
             style="text-align: right;padding: 10px 20px 20px;position:relative"
             class="dialog-footer"
             v-if="isEdit">
          <el-button style="position:absolute;left:30px;top:10px;"
                     @click="openTrue('repairDetailsData')"
                     type="warning"
                     plain
                     v-if="isEdit">维保完成</el-button>
          <el-button @click="cancelEl"
                     class="close-button">取消</el-button>
          <el-button type="primary"
                     class="defaultbtn dialog-confirmBtn"
                     @click="addRepairSave('repairDetailsData')"
                     v-if="isEdit">确定</el-button>
        </div>
      </div>
    </drawer>
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
    <el-dialog v-if="centerDialogVisible"
               class="warnDialog"
               title="维保确认"
               :visible.sync="centerDialogVisible"
               width="30%"
               append-to-body
               center>
      <img class="warnIcon"
           src="../../../../assets/tanhao@2x.png" />
      <span class="warnInfo">确定维保完成吗？</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addRepairSave('repairDetailsData', 'repair')">确 定</el-button>
      </span>
    </el-dialog>
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
      type: Object,
      default: {}
    },
    projectManagementsList: {

    },
    pageType: { // readOnly详情页 add 新增
      type: String,
      default: 'add'
    },
    drawerTitle: {
      type: String,
      default: '保养单详情'
    }
  },
  watch: {
  },
  created () {
  },
  mounted () {
    this.drawertitle = this.drawerTitle
    let clientHeight = document.body.clientHeight
    let mainContent = document.getElementById('mainContent')
    mainContent.style.height = clientHeight - 58 + 'px'
  },
  data () {
    return {
      drawertitle: '',
      centerDialogVisible: false,
      equirementType: '',
      cascaderList: [], // 设备类型二级联选择器
      equirementNo: '',
      devNb: '',
      devName: '',
      selectionArr: [], // 选中
      selectionId: '', // 选中
      projectManagementId: '',
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
          if (this.repairDetailsData.repairDate) {
            return time.getTime() < new Date(this.repairDetailsData.repairDate).getTime()
          } else {
            return
          }
        }
      },
      isEdit: false
    }
  },
  computed: {

  },
  methods: {
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
    delImg (item, index) {
      this.repairDetailsData.imageUrls.splice(index, 1)
    },
    formatRepairStatus (n) {
      if (n === 'COMPLETE') {
        return '维保完成'
      } else if (n === 'NO') {
        return '维保未完成'
      }
    },
    setAnnex (annexURL, annexName) {  // 子组件上传成功返回文件url 和名字
      this.repairDetailsData.imageUrls.push(annexURL)
    },
    openTrue (formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.centerDialogVisible = true
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addRepairSave (formName, state) { // 修改维保记录
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (state === 'repair') {
            _this.$set(this.repairDetailsData, 'repairStatus', 'COMPLETE')
            _this.centerDialogVisible = false
          }
          context.http.put('/cms/api/repair-records', _this.repairDetailsData).then(res => {
            if (res) {
              _this.$message({
                type: 'success',
                message: '修改保养记录成功'
              })
              _this.$emit('addRecordsSuc')
              this.isEdit = false
              this.$emit('handleEdit', 0, this.repairDetailsData)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancelEl () {
      this.isEdit = false
      this.$refs['repairDetailsData'].resetFields()
      this.$emit('handleEdit', 0, this.repairDetailsData)
    },
    getTemplateRow (index, row) {                                 // 获取选中数据
      this.selectionArr = row
      console.log(this.selectionId, this.selectionArr)
    },
    editFn () {
      this.isEdit = !this.isEdit
      if (this.isEdit) {
        // this.drawertitle = '编辑保养单'
      } else {
        // this.drawertitle = '保养单'
      }
    },
    showImg (item, index) {
      let imgArr = []
      if (this.pageType === 'add') {
        this.repairDetailsData.imageUrls.forEach(item => {
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
      // this.addData.imageUrls = []
      // this.$refs['addData'].resetFields()
      this.$emit('drawerClose', false)
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
      // return true
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/mixins.scss";
.addRepair {
  .drawer-head {
    margin: 20px 20px 0 20px;
  }
  .details-content {
    padding: 0;
  }
  .tenant-details {
    background-color: #f7f7f7;
    // padding-bottom: 50px;
    .title {
      padding-left: 20px;
    }
    .vertical {
      display: inline-block;
      width: 4px;
      height: 16px;
      background-color: #3575f6;
      border-radius: 2px;
      vertical-align: middle;
      margin-right: 5px;
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
  .main-content {
    background-color: #f7f7f7;
    margin: 0;
    overflow-y: scroll;
    overflow-x: hidden;
    @include scrollBarStyle;
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
      width: 900px;
      margin-bottom: 15px;
      margin-top: 15px;
      &:last-child {
        margin-bottom: 70px;
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
          border: 1px solid #cecdcd;
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
            width: 158px;
            height: 118px;
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
        border: 1px dashed #d0d0d0ff;
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
            height: 120px;
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
  .dialog-footer {
    background-color: #fff;
    width: 100%;
    padding: 10px;
    margin-right: 0px;
    height: 50px;
    margin-top: -50px;
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
.addRepair {
  .drawer-head {
    margin: 20px 20px 0 20px;
  }
}
</style>
