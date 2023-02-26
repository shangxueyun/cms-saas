<template>
  <div class="tenant-details addRepair">
    <drawer :show="detailsdrawershow" :title="drawerTitle" @on-hide="onHide">
      <div class="tenant-details details-content" slot="drawer">
        <div class="main-content">
          <p class="title" style="font-size:14px;">基本信息</p>
          <div class="content">
            <el-form class="form" :model="repairRecordDTO" ref="repairRecordDTO" :rules="addDataRules">
              <el-form-item >
                <span>报修类型<i class="required">*</i></span>
                <p class="readOnlyTxt">{{deviceInfo.repairType==='ROOMS'?'房源':'设备'}}</p>
              </el-form-item>
              <el-form-item>
                <span>{{deviceInfo.repairType==='ROOMS'?'房源号':'设备编号'}}</span>
                <p class="readOnlyTxt" v-if="pageType==='add' && deviceInfo.repairType==='EQUIREMENT'">{{deviceInfo.equirementNo||'-'}}</p>
                <p class="readOnlyTxt" v-if="pageType==='add' && deviceInfo.repairType==='ROOMS'">{{deviceInfo.roomsName||'-'}}</p>
              </el-form-item>
              <el-form-item>
                <span>{{deviceInfo.repairType==='ROOMS'?'房源名称':'设备名称'}}<i class="required">*</i></span>
                <p class="readOnlyTxt" v-if="pageType==='add' && deviceInfo.repairType==='EQUIREMENT'">{{deviceInfo.name}}</p>
                <p class="readOnlyTxt" v-if="pageType==='add' && deviceInfo.repairType==='ROOMS'">{{deviceInfo.name}}</p>
              </el-form-item>
              <el-form-item prop="repairUserName">
                <span>维修人<i class="required">*</i></span>
                <el-input v-model="repairRecordDTO.repairUserName" style="width:240px" v-if="pageType==='add'" maxlength="5"></el-input>
              </el-form-item>
              <el-form-item prop="repairDate">
                <span style="width:100%">维修日期<i class="required">*</i></span>
                <!-- <el-input v-model="repairRecordDTO.cause"  v-if="pageType==='add'"></el-input> -->
                <el-date-picker v-model="repairRecordDTO.repairDate" type="date" placeholder="选择日期" v-if="pageType==='add'" style="width:240px" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
              <el-form-item prop="repairFee">
                <span>维修费用<i class="required">*</i></span>
                <el-input v-model="repairRecordDTO.repairFee" style="width:240px" v-if="pageType==='add'" maxlength="10"></el-input>
              </el-form-item>
              <el-form-item prop="repairStatus">
                <span>维修结果<i class="required">*</i></span>
                <el-select v-model="repairRecordDTO.repairStatus" style="width:240px" v-if="pageType==='add'">
                  <!-- <el-option label="未完成" value="REFERED"></el-option>
                  <el-option label="已完成" value="WAIT"></el-option>
                  <el-option label="已完成" value="OVER"></el-option> -->
                  <el-option label="维保完成" value="COMPLETE"></el-option>
                  <el-option label="维修未完成" value="NO"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="description" style="width:61%">
                <span>故障原因</span>
                <el-input v-model="repairRecordDTO.description" style="width:530px" v-if="pageType==='add'" maxlength="40"></el-input>
              </el-form-item>
              <el-form-item prop="materialUsage">
                <span>用材情况</span>
                <el-input v-model="repairRecordDTO.materialUsage" style="width:240px" v-if="pageType==='add'" maxlength="40"></el-input>
              </el-form-item>
              <el-form-item prop="remake" style="width:61%">
                <span>备注</span>
                <el-input v-model="repairRecordDTO.remake" style="width:530px" v-if="pageType==='add'" maxlength="40"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="upLoadDiv">
            <p style="font-size:14px;">维修后图片</p>
            <div>
              <div class="imgList" v-for="(item,index) in repairRecordDTO.imageUrls" :key="index" v-show="pageType==='add'">
                <div class="item">
                  <img :src="item" alt="">
                  <div>
                    <i class="el-icon-view" @click="showImg(item,index)"></i>
                    <i class="el-icon-delete" @click="delImg(item,index)"></i>
                  </div>
                </div>
              </div>
              <div class="upLoadComponents" v-if="repairRecordDTO.imageUrls.length<5 && pageType==='add'">
                <aliUpload class="aliUpload"
                  :upLoadText="upLoadText"
                  :fileType="fileType"
                  :iconShow="false"
                  @setAnnex="setAnnex"
                />
              </div>
            </div>
            <p v-if="pageType==='add'" style="font-size:12px;">(最多可上传5张,建议尺寸：<i style="color:#F00">100＊100</i>像素；支持格式JPG,PNG)</p>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer"> 
        <el-button @click="onHide" class="close-button">关闭</el-button>
        <el-button type="primary"  class="defaultbtn dialog-confirmBtn" @click="addRepairSave('repairRecordDTO')" v-if="pageType==='add'">确 定</el-button>
      </div>
    </drawer>
    <picturePrevie v-if="showPicture" :imgList="imgArr" :num="num"  @pictureClose="pictureClose"></picturePrevie>
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
    deviceInfo: {
      type: Object
    },
    projectManagementsList: {

    },
    pageType: { // readOnly详情页 add 新增
      type: String,
      default: 'add'
    }
  },
  created () {
    this.getDevice()
  },
  mounted () {

  },
  data () {
    return {
      repairRecordDTO: {
        repairUserName: '',
        repairDate: '',
        repairFee: '',
        repairStatus: '',
        description: '',
        materialUsage: '',
        remake: '',
        imageUrls: []
      },
      selectionArr: [], // 选中
      selectionId: '', // 选中
      projectManagementId: 15,
      tableData: [],
      chosseDevDialogVisible: false,
      showPicture: false,
      imgArr: [],
      num: 1,
      upLoadText: '上传图片',
      fileType: [],
      value: '',
      bulidFloorList: [],
      projectManagementsId: 15,
      addDataRules: {
        repairUserName: [
          { required: true, message: '请输入维修人', trigger: 'blur' }
        ],
        repairDate: [
          { required: true, message: '请选择维修日期', trigger: 'change' }
        ],
        repairFee: [
          { required: true, message: '请输入维修费用', trigger: 'change' }
        ],
        repairStatus: [
          { required: true, message: '请选择维修结果', trigger: 'change' }
        ]
      },
      drawerTitle: '新增维修记录',
      currentPage: 1,
      total: 0,
      pgSize: 15
    }
  },
  computed: {

  },
  methods: {
    delImg (item, index) {
      this.repairRecordDTO.imageUrls.splice(index, 1)
    },
    formatRepairStatus (n) {
      if (n === 'COMPLETE') {
        return '维保完成'
      } else if (n === 'NO') {
        return '未完成'
      }
    },
    setAnnex (annexURL, annexName) {  // 子组件上传成功返回文件url 和名字
      this.repairRecordDTO.imageUrls.push(annexURL)
    },
    addRepairSave (formName) { // 新增维修记录
      let _this = this
      // this.repairRecordDTO.equirementNo = this.deviceInfo.code
      // this.repairRecordDTO.name = this.deviceInfo.name
      this.repairRecordDTO.repairFormId = this.deviceInfo.id
      console.log(this.repairRecordDTO)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _this = this
          context.http.post('/cms/api/repair-records', this.repairRecordDTO).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '维修记录新增成功'
              })
              _this.onHide()
              _this.$emit('repairRecordUpdate', this.deviceInfo)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    closeChosseDevDialog () {
      this.chosseDevDialogVisible = false
    },
    showImg (item, index) {
      let imgArr = []
      if (this.pageType === 'add') {
        this.repairRecordDTO.imageUrls.forEach(item => {
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
      this.repairRecordDTO.imageUrls = []
      this.$refs['repairRecordDTO'].resetFields()
      this.$emit('drawerClose', false)
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.getDevice()
    },
    getDevice () { // 获取设备列表
      context.http.get('cms/api/equirements', {projectManagementId: this.projectManagementId, page: (this.currentPage - 1), size: this.pgSize}).then(res => {
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
  .addRepair{
    .repairRecord{
      .el-collapse-item__header{
        padding-left: 15px;
        background-color: #fafafa;
      }
      .el-collapse-item__wrap{
        .content{
          padding: 15px 10px;
          display: flex;
          flex-wrap: wrap;
          // justify-content: space-between;
          .item{
            width: 33%;
            height: 70px;
            padding-left: 20px;
            >p{
              font-size: 14px;
              margin-bottom: 10px;
            }
            >span{
              display: inline-block;
              width: 100%;
              font-size: 12px;
              color: #8e8e8e;
            }
          }
        }
      }
    }
    .menuTab{
      height: 60px;
      line-height: 60px;
      margin: 10px 30px;
      box-shadow: 0px 1px 5px #eee;
      >span{
        display: inline-block;
        width: 120px;
        text-align: center;
        font-size: 16px;
        cursor: pointer;
        &.active{
          color: #3577F6;
          border-bottom: 2px solid #3577F6;
        }
      }
    }
    .chosseDevDialogVisible{
      .seachDiv{
        height: 80px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .secrchBtn{
          width: 120px;
          height: 32px;
          line-height: 32px;
          padding: 0;
        }
      }
      .table{
        margin-top: 0;
      }
      .ctc-foot{
        padding: 0px 0 30px 20px;
      }
    }
    .main-content{
      border: 1px solid #dadada;
      margin: 0 30px;
      padding: 1px 0;
      min-height: 500px;
      width: 900px;
      margin-bottom: 20px;
      .upLoadDiv{
        padding-left: 20px;
        >div{
          display: flex;
          flex-wrap: wrap;
          margin: 15px 0;
        }
        .imgList{
            margin-right: 10px;
            margin-bottom: 10px;
          .item{
              width: 150px;
              height: 130px;
              position: relative;
              border: 1px solid #cecdcd;
            img{
              width: 148px;
              height: 128px;
            }
            >div{
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
              background-color: rgba(255, 255, 255, .7);
              >span{
                display: inline-block;
                width: 70%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              >i{
                cursor: pointer;
              }
            }
          }
        }
        .upLoadComponents{
          width: 150px;
          height: 130px;
          border: 1px dashed #D0D0D0FF;
          background: url(../../../../assets/plus.png) no-repeat center;
          .aliUpload{
            .oss_file{
              border:none!important;
              height: 130px;
              width: 100%;
              line-height: 195px;
              color: #3577F6;
            }
          }
        }
      }
      .content{
        padding: 15px 0;
        .form{
          display: flex;
          flex-wrap: wrap;
          .el-form-item{
            width: 30%;
            margin-left: 20px;
            .el-form-item__content{
              >span{
                margin-bottom: 5px;
                display: inline-block;
              }
              >.readOnlyTxt{
                height: 40px;
                line-height: 40px;
                font-size: 12px;
                color: #8e8e8e;
              }
              .seachDeviceIcon{
                display: inline-block;
                width: 20px;
                height: 20px;
                background: url(../../../../assets/seachDeviceIcon.png) no-repeat;
                position: absolute;
                right: 16px;
                top: 35px;
                cursor: pointer;
              }                
              .el-textarea__inner{
                resize: none!important;
              }
            }
          } 
        }      
      }
    }
  }
</style>
