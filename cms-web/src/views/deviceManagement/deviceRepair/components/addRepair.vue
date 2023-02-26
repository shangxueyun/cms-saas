<template>
  <div class="tenant-details addRepair repairFromdata4">
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="tenant-details details-content repairDetails_content"
           slot="drawer">
        <!-- <div class="menuTab"
             v-if="pageType==='readOnly' && repairDetails.maintenanceClassify === 'REPAIR'">
          <span :class="{'active':menuTab==='repairInfo'}"
                @click="menuTabChange('repairInfo')">维保信息</span>
          <span :class="{'active':menuTab==='repairRecord'}"
                @click="menuTabChange('repairRecord')">报修单信息</span>
        </div> -->
        <!-- v-if="menuTab==='repairInfo'" -->
        <div class="main-content repairInfo">
          <!-- <p class="title"
             style="font-size:14px;">{{repairDetails.maintenanceClassify === 'REPAIR' ? '维保记录' : '基本信息' }}</p> -->
          <p class="title">
            <i></i>
            <span>基本信息</span>
          </p>
          <div class="content">
            <el-form class="form"
                     :model="addData"
                     ref="addData"
                     :rules="addDataRules">
              <el-form-item prop="repairType">
                <span>维保编号<i class="required">*</i></span>
                <p class="readOnlyTxt">{{repairDetails.repairRecordCode}}</p>
              </el-form-item>
              <el-form-item prop="repairType">
                <span>维保类型<i class="required">*</i></span>
                <p class="readOnlyTxt">{{repairTypeFormat(repairDetails.repairType)}}</p>
              </el-form-item>
              <el-form-item prop="repairType">
                <span>维保方式<i class="required">*</i></span>
                <p class="readOnlyTxt">{{repairDetails.maintenanceClassify==='REPAIR'?'维修':'保养'}}</p>
              </el-form-item>
              <el-form-item v-if="repairDetails.repairType === 'ROOMS' && repairDetails.maintenanceClassify === 'REPAIR'">
                <span>房源号<i class="required">*</i></span>
                <p class="readOnlyTxt">{{repairDetails.roomsName}}</p>
              </el-form-item>
              <el-form-item v-if="repairDetails.repairType === 'ROOMS' && repairDetails.maintenanceClassify === 'REPAIR'">
                <span>房源名称<i class="required">*</i></span>
                <p class="readOnlyTxt">{{repairDetails.name}}</p>
              </el-form-item>
              <el-form-item prop="equirementNo"
                            v-if="repairDetails.repairType === 'EQUIREMENT'">
                <span>设备编号<i class="required">*</i></span>
                <p class="readOnlyTxt">{{repairDetails.equirementNo}}</p>
              </el-form-item>
              <el-form-item prop="name"
                            v-if="repairDetails.repairType === 'EQUIREMENT'">
                <span>设备名称<i class="required">*</i></span>
                <p class="readOnlyTxt">{{repairDetails.name}}</p>
              </el-form-item>
              <el-form-item prop="name">
                <span>项目简称<i class="required">*</i></span>
                <p class="readOnlyTxt">{{repairDetails.projectName}}</p>
              </el-form-item>
              <el-form-item>
                <span>楼宇名称<i class="required">*</i></span>
                <p class="readOnlyTxt">{{repairDetails.buildingName}}</p>
              </el-form-item>
              <el-form-item v-if="repairDetails.repairType === 'EQUIREMENT'">
                <span>安装位置<i class="required">*</i></span>
                <p class="readOnlyTxt">{{repairDetails.installPosition}}</p>
              </el-form-item>
              <el-form-item v-if="repairDetails.maintenanceClassify === 'MAINTAIN'">
                <span>计划维保日期<i class="required">*</i></span>
                <p class="readOnlyTxt">{{repairDetails.planMaintenanceTime}}</p>
              </el-form-item>
              <el-form-item>
                <span>维保人员<i class="required">*</i></span>
                <p class="readOnlyTxt">{{repairDetails.repairUserName}}</p>
              </el-form-item>
              <el-form-item>
                <span>维保日期<i class="required">*</i></span>
                <p class="readOnlyTxt">{{repairDetails.repairDate}}</p>
              </el-form-item>
              <el-form-item>
                <span>维保费用<i class="required">*</i></span>
                <p class="readOnlyTxt">{{repairDetails.repairFee}}</p>
              </el-form-item>
              <el-form-item>
                <span>维保结果<i class="required">*</i></span>
                <p class="readOnlyTxt">{{formatRepairStatus(repairDetails.repairStatus)}}</p>
              </el-form-item>
              <el-form-item>
                <span>维保原因</span>
                <p class="readOnlyTxt">{{repairDetails.description}}</p>
              </el-form-item>
              <el-form-item>
                <span>用材情况</span>
                <p class="readOnlyTxt">{{repairDetails.materialUsage}}</p>
              </el-form-item>
              <el-form-item>
                <span>备注</span>
                <p class="readOnlyTxt">{{repairDetails.remake}}</p>
              </el-form-item>
            </el-form>
          </div>
          <div class="upLoadDiv">
            <p>发票及维保后图片</p>
            <div>
              <div class="imgList"
                   v-for="(item,index) in repairDetails.imageUrls"
                   :key="index">
                <div class="item">
                  <img :src="item"
                       alt=""
                       @click="showImg(item,index)">
                </div>
              </div>
            </div>
            <p v-if="pageType==='add'">（最多可上传5张,建议尺寸：<i style="color:#F00">100＊100</i>像素；支持格式JPG,PNG）</p>
          </div>
        </div>
        <!-- v-if="repairDetails.maintenanceClassify !== 'REPAIR'" -->
        <div class="main-content collapse_list"
             style="min-height: 100px;margin-top:15px;background-color:#ffffff;margin-bottom:15px">
          <p class="title">
            <i></i>
            <span>维保计划</span>
          </p>
          <div class="content">
            <span style="margin-left: 15px;font-size: 12px;font-style: italic;">下次维保日期：{{repairDetails.nextMaintenanceTime ? repairDetails.nextMaintenanceTime : '-'}}</span>
          </div>
        </div>
        <!-- v-if="menuTab==='repairRecord'" -->
        <div class="main-content repairRecord repairInfo"
             v-if="repairDetails.maintenanceClassify==='REPAIR'">
          <p class="title">
            <i></i>
            <span>报修单信息</span>
          </p>
          <div class="content">
            <el-form class="form"
                     :model="addData"
                     ref="addData"
                     :rules="addDataRules">
              <el-form-item prop="repairType">
                <span>报修编号<i class="required">*</i></span>
                <p class="readOnlyTxt">{{repairRecordsList.repairFormCode}}</p>
              </el-form-item>
              <el-form-item prop="repairType">
                <span>报修类型<i class="required">*</i></span>
                <p class="readOnlyTxt">{{repairTypeFormat(repairRecordsList.repairType)}}</p>
              </el-form-item>
              <el-form-item v-if="repairRecordsList.repairType === 'ROOMS'">
                <span>房源号<i class="required">*</i></span>
                <p class="readOnlyTxt">{{repairRecordsList.roomsName}}</p>
              </el-form-item>
              <el-form-item v-if="repairRecordsList.repairType === 'ROOMS'">
                <span>房源名称<i class="required">*</i></span>
                <p class="readOnlyTxt">{{repairRecordsList.name}}</p>
              </el-form-item>
              <el-form-item prop="equirementNo"
                            v-if="repairRecordsList.repairType === 'EQUIREMENT'">
                <span>设备编号<i class="required">*</i></span>
                <p class="readOnlyTxt">{{repairRecordsList.equirementNo}}</p>
              </el-form-item>
              <el-form-item prop="name"
                            v-if="repairRecordsList.repairType === 'EQUIREMENT'">
                <span>设备名称<i class="required">*</i></span>
                <p class="readOnlyTxt">{{repairRecordsList.name}}</p>
              </el-form-item>
              <!-- <el-form-item prop="name">
                <span>项目简称<i class="required">*</i></span>
                <p class="readOnlyTxt">{{repairRecordsList.projectName}}</p>
              </el-form-item>
              <el-form-item>
                <span>楼宇名称<i class="required">*</i></span>
                <p class="readOnlyTxt">{{repairRecordsList.buildingName}}</p>
              </el-form-item>
              <el-form-item v-if="repairRecordsList.repairType === 'EQUIREMENT'">
                <span>安装位置<i class="required">*</i></span>
                <p class="readOnlyTxt">{{repairRecordsList.installPosition}}</p>
              </el-form-item> -->
              <el-form-item>
                <span>问题简述<i class="required">*</i></span>
                <p class="readOnlyTxt">{{repairRecordsList.title}}</p>
              </el-form-item>
              <el-form-item>
                <span>报修原因<i class="required">*</i></span>
                <p class="readOnlyTxt">{{repairRecordsList.content}}</p>
              </el-form-item>
            </el-form>
          </div>
          <div class="upLoadDiv">
            <p>报修图片</p>
            <div>
              <div class="imgList"
                   v-for="(item,index) in repairRecordsList.imgs"
                   :key="index">
                <div class="item">
                  <img :src="item"
                       alt=""
                       @click="showRepairImgList(item,index)">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div slot="footer"
           class="dialog-footer">
        <el-button @click="onHide"
                   class="close-button">关闭</el-button>
        <el-button type="primary"
                   class="defaultbtn dialog-confirmBtn"
                   @click="addReapirSave('addData')"
                   v-if="pageType==='add'">确 定</el-button>
      </div> -->
    </drawer>
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
    <el-dialog title="选择设备"
               :visible.sync="chosseDevDialogVisible"
               width="900px"
               id="chosseDevDialogVisible"
               class="chosseDevDialogVisible"
               @close="closeChosseDevDialog">
      <div class="seachDiv">
        <el-select placeholder="全部"
                   style="width:160px"
                   v-model="projectManagementId">
          <el-option v-for="(item,index) in projectManagementsList"
                     :key="index"
                     :label="item.projectName"
                     :value="item.id"></el-option>
        </el-select>
        <el-cascader :options="cascaderList"
                     @change="handleChange1"
                     style="width:160px"></el-cascader>
        <el-input placeholder="设备名称"
                  style="width:160px"
                  v-model="devName"></el-input>
        <el-input placeholder="设备编号"
                  style="width:160px"
                  v-model="devNb"></el-input>
        <el-button class="secrchBtn"
                   type="primary"
                   @click="showChosseDevDialog">查询</el-button>
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
                           :current-page="currentPage"
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
    repairDetails: {},
    bulidFloorList: {
    },
    projectManagementsList: {
    },
    pageType: { // readOnly详情页 add 新增
      type: String,
      default: 'add'
    }
  },
  created () {
  },
  mounted () {
  },
  data () {
    return {
      activeName: '1',
      repairRecordsList: '', // 维修记录列表
      equirementNo: '',
      cascaderList: [], // 设备类型二级联选择器
      equirementType: '',
      devName: '',
      devNb: '',
      menuTab: 'repairInfo', // repairInfo保修单信息 repairRecord 维修记录
      selectionArr: [], // 选中
      selectionId: '', // 选中
      projectManagementId: '',
      tableData: [],
      chosseDevDialogVisible: false,
      showPicture: false,
      imgArr: [],
      num: 1,
      upLoadText: '上传图片',
      fileType: [],
      addData: {
        repairType: 'ROOMS',
        roomsId: '',
        name: '',
        title: '',
        content: '',
        imgs: [],
        equirementId: ''
      },
      addDataRules: {
        roomsId: [
          { required: true, message: '请选择房源号', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入房源名称', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'change' }
        ]
      },
      drawerTitle: '保养单详情',
      currentPage: 1,
      total: 0,
      pgSize: 15
    }
  },
  computed: {

  },
  watch: {
    detailsdrawershow: {
      handler: function (newValue, oldValue) {
        if (newValue && this.repairDetails.maintenanceClassify === 'REPAIR') {
          context.http.get(`/cms/api/repair-forms/${this.repairDetails.repairFormId}`).then(res => {
            this.repairRecordsList = res.data
            // this.menuTab = tab
          }).catch(error => {
            console.info(error)
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
      // return true
    },
    setMenuTab () {
      this.menuTab = 'repairInfo'
    },
    repairTypeFormat (type) {
      let res = ''
      if (type === 'ROOMS') {
        res = '房源'
      } else if (type === 'EQUIREMENT') {
        res = '设备'
      } else {
        res = '其他'
      }
      return res
    },
    formatRepairStatus (n) {
      if (n === 'NO') {
        return '维保未完成'
      } else if (n === 'COMPLETE') {
        return '维保完成'
      } else {
        return ''
      }
    },
    parentHandleclick (list) {
      this.repairRecordsList = list
    },
    menuTabChange (tab) {
      if (tab === 'repairRecord') {
        context.http.get(`/cms/api/repair-forms/${this.repairDetails.repairFormId}`).then(res => {
          this.repairRecordsList = res.data
          this.menuTab = tab
        }).catch(error => {
          console.info(error)
        })
      } else {
        this.menuTab = tab
      }
    },
    addRepairFn () { // 新增维修数据
      this.$emit('addRepairFn')
    },
    isShow () { // 是否展示
      if (this.pageType === 'add') {
        if (this.addData.repairType === 'ROOMS') {
          return true
        }
        return false
      } else if (this.pageType === 'readOnly') {
        if (this.repairDetails.repairType === 'ROOMS') {
          return true
        }
        return false
      }
    },
    getTemplateRow (index, row) {                                 // 获取选中数据
      this.selectionArr = row
      // console.log(this.selectionId, this.selectionArr)
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
      this.addData.name = this.selectionArr.name
      this.equirementNo = this.selectionArr.code
      this.closeChosseDevDialog()
    },
    async getEquirementTypes () { // 请求设备大小类
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
    addReapirSave (formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _this = this
          context.http.post('/cms/api/repair-forms', this.addData).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '新增成功'
              })
              _this.onHide()
              _this.$emit('queryUpdate')
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
        this.tableData = result.data
        this.total = Number(result.headers['x-total-count'])
        this.chosseDevDialogVisible = true
      })
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
      if (this.repairDetails.repairFormId !== '') {
        this.repairDetails.imageUrls.forEach(item => {
          imgArr.push(item)
        })
      } else {
        this.repairRecordsList.imgs.forEach(item => {
          imgArr.push(item)
        })
      }
      this.imgArr = imgArr
      this.num = index
      this.showPicture = true
    },
    showRepairImgList (item, index) {
      let imgArr = []
      this.repairRecordsList.imgs.forEach(item => {
        imgArr.push(item)
      })
      this.imgArr = imgArr
      this.num = index
      this.showPicture = true
    },
    showImgList (itm, idx, item, index) {
      let imgArr = []
      this.repairRecordsList[index].imageUrls.forEach(item => {
        imgArr.push(item)
      })
      this.imgArr = imgArr
      this.num = idx
      this.showPicture = true
    },
    pictureClose () {
      this.showPicture = false
    },
    setAnnex (annexURL) {  // 子组件上传成功返回文件url 和名字
      this.addData.imgs.push(annexURL)
    },
    deleteFn (item, index) {
      this.addData.imgs.splice(index, 1)
    },
    handleChange (value) {
      this.addData.roomsId = value[value.length - 1]
      console.log(this.addData.roomsId)
    },
    onHide () {
      // if (this.menuTab === 'repairInfo') {
      //   this.$refs['addData'].resetFields()
      // }
      this.$emit('drawerClose', false)
      // this.menuTab = 'repairInfo'
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.showChosseDevDialog()
    }
  }
}
</script>
<style lang="scss">
.repairFromdata4 {
  > div {
    &.vue-drawer {
      .drawer {
        background-color: #faf7fa !important;
        overflow: hidden;
        .wrap {
          height: 100%;
        }
        .drawer-head {
          padding: 0;
          margin: 0;
          height: 60px;
          line-height: 60px;
          background-color: #ffffff;
          padding-left: 15px;
          font-weight: bold;
          border: none;
          .el-dialog__close {
            font-size: 24px;
            color: #b9b9b9;
            margin-top: 20px;
          }
          .el-dialog__title {
            color: #262626;
            font-size: 16px;
          }
        }
        .repairDetails_content {
          margin: 0;
          height: calc(100% - 60px);
          overflow-y: auto;
          padding-bottom: 20px;
          margin-top: 15px;
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
          .repairInfo {
            background-color: #ffffff;
          }
          .title {
            // height: 45px;
            // line-height: 45px;
            display: flex;
            align-items: center;
          }
          .collapse_repair {
            padding: 0 15px;
            background-color: #ffffff;
            .el-collapse-item__header {
              > div {
                width: 95%;
                display: flex;
                justify-content: space-between;
                > span {
                  &:last-child {
                    font-size: 12px;
                    color: rgba(53, 119, 246, 1);
                  }
                }
              }
            }
            .el-collapse-item__content {
              padding-bottom: 0;
              background-color: #f7f8fa;
            }
          }
        }
        .el-dialog__footer {
          padding: 0;
          background-color: #ffffff;
          margin-top: 15px;
          .dialog-footer {
            height: 80px;
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            > span {
              display: inline-block;
              width: 90px;
              height: 34px;
              line-height: 34px;
              text-align: center;
              cursor: pointer;
              color: #666666;
              &.subBtn {
                background-color: #3577f6;
                color: #ffffff;
                border-radius: 4px;
              }
              &.quxiao_btn {
                &:hover {
                  color: #3577f6;
                }
              }
            }
          }
        }
      }
    }
    .ctc-foot {
      justify-content: normal;
      flex-direction: row-reverse;
      align-items: center;
      color: #3f5fbf;
      font-size: 12px;
      padding: 60px 20px 30px 20px;
      .pagingnum {
        color: #3f5fbf;
        font-size: 12px;
        select {
          width: 65px;
          height: 28px;
          border-radius: 2px;
          border-color: #f6f6f7;
          color: #3577f6;
        }
      }
      .el-pagination.is-background .btn-next,
      .el-pagination.is-background .btn-prev,
      .el-pagination.is-background .el-pager li {
        margin: 0 5px;
        background-color: transparent;
        color: #3f5fbf;
        min-width: 30px;
        border-radius: 2px;
        font-size: 14px;
      }
      .el-pagination.is-background .el-pager li:not(.disabled).active {
        border-radius: 50%;
        background-color: #3f5fbf !important;
        color: #fff !important;
      }
    }
  }
}
.addRepair {
  .addRepairShowFn {
    display: inline-block;
    width: 100px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    background-color: #49af61;
    color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 80px;
    right: 45px;
    cursor: pointer;
    font-size: 14px;
    &:hover {
      background-color: #00954d;
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
      margin-bottom: 20px;
    }
    .ctc-foot {
      padding: 0px 0 30px 20px;
    }
  }
  .main-content {
    width: 900px;
    .upLoadDiv {
      padding-left: 20px;
      font-size: 14px;
      color: #666;
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
            font-size: 14px;
            > span {
              margin-bottom: 5px;
              display: inline-block;
              color: #777777;
            }
            > .readOnlyTxt {
              height: 40px;
              line-height: 40px;
              color: #262626;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
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
