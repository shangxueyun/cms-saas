<template>
  <div class="tenant-details addRepair1 addbaoxiuModule"
       :class="{'repairFromdata1_add':pageType==='add'}">
    <div class="tenant-details details-content repairDetails_content"
         :class="{'repairDetails_content_add':pageType==='add'}"
         slot="drawer">
      <div class="main-content3 repairInfo">
        <p class="title">
          <i></i>
          <span>基本信息</span>
        </p>
        <div class="content">
          <el-form class="form"
                   :model="addData"
                   ref="addData"
                   :rules="addDataRules">
            <el-form-item v-if="pageType==='readOnly'">
              <span>报修编号<i class="required">*</i></span>
              <p class="readOnlyTxt">{{repairDetails.repairFormCode}}</p>
            </el-form-item>
            <el-form-item prop="repairType">
              <span>报修类型<i class="required">*</i></span>
              <el-radio-group v-model="addData.repairType"
                              style="width:240px;height: 40px;line-height: 55px;"
                              v-if="pageType==='add'"
                              @change="radioChange">
                <el-radio label="ROOMS">房源</el-radio>
                <el-radio label="EQUIREMENT">设备</el-radio>
                <el-radio label="BUILDING">其他</el-radio>
              </el-radio-group>
              <p class="readOnlyTxt"
                 v-else>{{repairDetails.repairType==='ROOMS'?'房源':repairDetails.repairType==='EQUIREMENT'?'设备':'其他'}}</p>
            </el-form-item>
            <el-form-item prop="roomsId"
                          v-if="isShow('ROOMS')">
              <span>房源号<i class="required">*</i></span>
              <el-cascader :options="bulidFloorList"
                           v-model="bulidFloorValue"
                           style="width:240px;margin-right:30px"
                           placeholder="房源号"
                           @change="handleChange"
                           v-if="pageType==='add'"></el-cascader>
              <p class="readOnlyTxt"
                 v-else>{{repairDetails.roomsName}}</p>
            </el-form-item>
            <el-form-item prop="equirementNo"
                          v-if="isShow('EQUIREMENT')">
              <span>设备编号<i class="required">*</i></span>
              <el-input v-if="pageType==='add'"
                        readonly
                        style="width:240px;margin-right:30px"
                        v-model="addData.equirementNo"></el-input>
              <p class="readOnlyTxt"
                 v-else>{{repairDetails.equirementNo}}</p>
              <i class="seachDeviceIcon"
                 @click="showChosseDevDialog"
                 v-if="pageType==='add'"></i>
            </el-form-item>
            <el-form-item prop="name"
                          v-if="isShow('ROOMS')">
              <span>房源名称<i class="required">*</i></span>
              <el-input v-model="addData.name"
                        style="width:240px"
                        v-if="pageType==='add'"></el-input>
              <p class="readOnlyTxt"
                 v-else>{{repairDetails.name}}</p>
            </el-form-item>
            <el-form-item prop="name"
                          v-if="isShow('EQUIREMENT')">
              <span>设备名称<i class="required">*</i></span>
              <el-input v-model="addData.name"
                        style="width:240px"
                        v-if="pageType==='add'"></el-input>
              <p class="readOnlyTxt"
                 v-else>{{repairDetails.name}}</p>
            </el-form-item>
            <el-form-item prop="projectId"
                          v-if="isShow('BUILDING')">
              <span>项目简称<i class="required">*</i></span>
              <el-select placeholder="全部"
                         style="width:240px"
                         v-model="addData.projectId"
                         v-if="pageType==='add'"
                         @change="projectChange()">
                <el-option v-for="(item,index) in projectManagementsList"
                           :key="index"
                           :label="item.referred"
                           :value="item.id"></el-option>
              </el-select>
              <p class="readOnlyTxt"
                 v-else>{{repairDetails.projectName}}</p>
            </el-form-item>
            <el-form-item prop="buildingId"
                          v-if="isShow('BUILDING')">
              <span>楼宇名称<i class="required">*</i></span>
              <el-select placeholder="请选择楼宇"
                         style="width:240px"
                         v-model="addData.buildingId"
                         v-if="pageType==='add'">
                <el-option v-for="(item,index) in buildingsList"
                           :key="index"
                           :label="item.buildingName"
                           :value="item.id"></el-option>
              </el-select>
              <p class="readOnlyTxt"
                 v-else>{{repairDetails.buildingName}}</p>
            </el-form-item>
            <el-form-item prop="name"
                          v-if="isShow('EQUIREMENT') && pageType!=='add'">
              <span>安装位置<i class="required">*</i></span>
              <el-input v-model="addData.name"
                        style="width:240px"
                        v-if="pageType==='add'"></el-input>
              <p class="readOnlyTxt"
                 v-else>{{repairDetails.installPosition}}</p>
            </el-form-item>
            <el-form-item prop="title">
              <span>问题简述<i class="required">*</i></span>
              <el-input v-model="addData.title"
                        style="width:240px"
                        v-if="pageType==='add'"
                        maxlength="10"></el-input>
              <p class="readOnlyTxt"
                 v-else>{{repairDetails.title}}</p>
            </el-form-item>
            <el-form-item prop="content">
              <span style="width:100%">报修原因<i class="required">*</i></span>
              <el-input v-model="addData.content"
                        style="width:510px"
                        v-if="pageType==='add'"
                        maxlength="40"></el-input>
              <p class="readOnlyTxt"
                 v-else>{{repairDetails.content}}</p>
            </el-form-item>
          </el-form>
        </div>
        <div class="upLoadDiv">
          <div style="display:flex">
            <span>附件</span>
            <div class="upload"
                 style="margin-top: 0;width: 80px;margin-left:15px;height: 24px;line-height: 23px;"
                 v-if="addData.annexes.length < 5">
              <aliUpload class="aliUpload  aliUpload_small "
                         :upLoadText="upLoadText"
                         :fileType="fileType"
                         :iconShow="true"
                         @setAnnex="setAnnexs" />
            </div>
          </div>
          <div style="display:block">
            <div class="enclosure-list el-item-preview"
                 style="margin-top:10px"
                 v-for="(item, index) in addData.annexes"
                 :key="index">
              <div class="el-item"
                   style="display: flex; justify-content: space-between;border-bottom: 1px solid #EBEBEB;align-items: center;padding-bottom:5px">
                <span style="padding-left: 0;;width: 90%;overflow: hidden;text-overflow: ellipsis; white-space: nowrap;">{{item.annexName}}</span>
                <i @click="deleFile(item, index)"
                   class="iconfont icon-lajixiang"
                   style="cursor:pointer"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer"
         v-if="pageType==='add'"
         class="slotfooter">
      <span @click="onHide">取消</span>
      <span @click="addReapirSave('addData')">确定</span>
    </div>

    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
    <el-dialog title="选择设备"
               :visible.sync="chosseDevDialogVisible"
               width="900px"
               append-to-body
               id="chosseDevDialogVisible"
               class="chosseDevDialogVisible"
               @close="closeChosseDevDialog">
      <div class="seachDiv"
           style="padding:15px 0">
        <el-select placeholder="全部"
                   style="width:160px"
                   size="small"
                   v-model="projectManagementId"
                   clearable>
          <el-option v-for="(item,index) in projectManagementsList"
                     :key="index"
                     :label="item.referred"
                     :value="item.id"></el-option>
        </el-select>
        <el-cascader v-model="cascaderIds"
                     :options="cascaderList"
                     @change="handleChange1"
                     size="small"
                     style="width:160px"
                     clearable></el-cascader>
        <el-input placeholder="设备名称"
                  style="width:160px"
                  size="small"
                  v-model="devName"></el-input>
        <el-input placeholder="设备编号"
                  style="width:160px"
                  size="small"
                  v-model="devNb"></el-input>
        <el-button class="secrchBtn"
                   type="primary"
                   @click="querySeach">查询</el-button>
      </div>
      <div class="table"
           style="margin-bottom:0"
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
      <div class="ctc-foot1">
        <el-col :span="24">
          <span class="flex"
                style="flex-direction: row-reverse;">
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
      <div class="slotfooter"
           style="margin-bottom:15px;">
        <span @click="closeChosseDevDialog">取消</span>
        <span @click="selectdDevic">确定</span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
import aliUpload from '@/components/aliUpload.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import Drawer from '@/components/drawer.vue'
import * as JSOG from 'jsog'
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
    projectId: {

    },
    pageType: { // readOnly详情页 add 新增
      type: String,
      default: 'add'
    },
    addType: {
      type: String,
      default: ''
    }
  },
  watch: {
    detailsdrawershow: {
      handler: function (newValue, oldValue) {
        if (newValue && this.pageType === 'readOnly') {
          this.menuTabChange('repairRecord')
        }
      },
      immediate: true
    }
  },
  created () {
    this.projectManagementId = this.projectId
  },
  mounted () {
  },
  data () {
    return {
      cascaderIds: [],
      iconImg: 'icon-shangchuantupianicon',
      menuTabs: '',
      activeName: '0',
      bulidFloorValue: [],
      repairRecordsList: [], // 维保记录列表
      cascaderList: [], // 设备类型二级联选择器
      equirementType: '',
      devName: '',
      devNb: '',
      selectionArr: [], // 选中
      selectionId: '', // 选中
      projectManagementId: '',
      tableData: [],
      chosseDevDialogVisible: false,
      showPicture: false,
      imgArr: [],
      num: 1,
      upLoadText: '上传附件',
      fileType: [],
      addData: {
        annexes: [],
        buildingId: null,
        projectId: null,
        equirementNo: null,
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
        projectId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        buildingId: [
          { required: true, message: '请选择楼宇', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入保修原因', trigger: 'change' }
        ],
        equirementNo: [
          { required: true, message: '请输入设备编号', trigger: 'change' }
        ]
      },
      currentPage: 1,
      total: 0,
      pgSize: 15,
      buildingsList: []
    }
  },
  computed: {

  },
  methods: {
    setAnnexs (annexURL, annexName) {
      this.addData.annexes.push({ 'annexURL': annexURL, 'annexName': annexName })
    },
    deleFile (item, index) {
      this.addData.annexes.splice(index, 1)
    },
    radioChange (type) {
      this.$refs['addData'].resetFields()
      this.addData.repairType = type
    },
    addweibaoOpen () {
      this.$emit('addweibaoOpen', this.repairDetails)
    },
    formatmaintenanceClassify (type) {
      if (type === 'REPAIR') {
        return '维修'
      } else if (type === 'MAINTAIN') {
        return '保养'
      } else {
        return '-'
      }
    },
    projectChange () {
      context.http.get(`/cms/api/project/${this.addData.projectId}/buildings`).then(res => {
        if (res) {
          this.buildingsList = res.data
          this.addData.buildingId = null
        }
      })
    },
    querySeach () {
      this.currentPage = 1
      this.showChosseDevDialog()
    },
    formatRepairType (n) {
      if (n === 'EQUIREMENT') {
        return '设备'
      } else if (n === 'ROOMS') {
        return '房源'
      } else if (n === 'BUILDING') {
        return '其他'
      }
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
    formatRepairStatus (n) {
      switch (n) {
        case 'COMPLETE':
          return '维保完成'
        case 'NO':
          return '未完成'
      }
    },
    isShow (n) { // 是否展示
      if (this.pageType === 'add') {
        if (n === this.addData.repairType) {
          return true
        } else {
          return false
        }
      } else if (this.pageType === 'readOnly') {
        if (n === 'BUILDING') {
          return true
        } else if (n === this.repairDetails.repairType) {
          return true
        } else {
          return false
        }
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
      // this.addData.name = this.selectionArr.name
      this.$set(this.addData, 'name', this.selectionArr.name)
      // this.$set(this.addData, 'equirementNo', this.selectionArr.code)
      this.addData.equirementNo = this.selectionArr.code
      this.closeChosseDevDialog()
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
    addReapirSave (formName) {
      let _this = this
      // console.log(this.addData)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.addData)
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
    menuTabChange (tab) {
      if (tab === 'repairRecord') {
        context.http.get(`/cms/api/repair-forms/${this.repairDetails.id}/repair-records`).then(res => {
          this.repairRecordsList = res.data
          this.menuTabs = tab
        }).catch(error => {
          console.info(error)
        })
      } else {
        this.menuTabs = tab
      }
    },
    closeChosseDevDialog () {
      this.projectManagementId = ''
      this.equirementType = ''
      this.devName = ''
      this.devNb = ''
      this.cascaderIds = []
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
        this.tableData = JSOG.decode(result.data)
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
      if (this.pageType === 'add') {
        this.addData.imgs.forEach(item => {
          imgArr.push(item)
        })
      } else {
        this.repairDetails.imgs.forEach(item => {
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
    setAnnex (annexURL) {  // 子组件上传成功返回文件url 和名字
      this.addData.imgs.push(annexURL)
    },
    deleteFn (item, index) {
      this.addData.imgs.splice(index, 1)
    },
    handleChange (value) {
      this.addData.roomsId = value[value.length - 1]
    },
    resetAddData () {
      this.$refs['addData'].resetFields()
      this.bulidFloorValue = []
      this.addData.annexes = []
    },
    onHide () {
      this.resetAddData()
      this.$emit('drawerClose', false)
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.showChosseDevDialog()
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
      // return true
    }
  }
}
</script>
<style lang="scss">
.addbaoxiuModule {
  &.repairFromdata1_add {
    min-height: auto;
    height: calc(100% - 80px) !important;
    .repairDetails_content {
      &.repairDetails_content_add {
        background-color: #fff;
        height: calc(100% - 80px);
        padding-bottom: 10px;
      }
    }
    .slotfooter {
      height: 60px;
      line-height: 60px;
      text-align: right;
      padding-right: 15px;
      margin-top: 15px;
      background-color: #fff;
      > span {
        display: inline-block;
        width: 90px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        border-radius: 4px;
        cursor: pointer;
        &:first-child {
          color: #777;
          &:hover {
            color: rgba(53, 119, 246, 1);
          }
        }
        &:last-child {
          background: rgba(53, 119, 246, 1);
          color: #fff;
        }
      }
    }
    .aliUpload_small {
      width: 100%;
      height: 100%;
    }
  }
  .upLoadComponents {
    width: 150px;
    height: 130px;
    border: 1px solid #d0d0d0ff;
    background-color: #f7f9fd;
    .aliUpload {
      .oss_file {
        border: none !important;
        height: 130px;
        width: 100%;
        line-height: 195px;
        color: #3577f6;

        > .iconfont {
          position: absolute;
          left: 0;
          right: 0;
          margin: auto;
          width: 100%;
          height: 100%;
          top: -45px;
          font-size: 40px;
        }
      }
    }
  }
}
.addRepair1 {
  .el-radio__label {
    font-size: 12px;
  }
  .repairRecord {
    .el-collapse-item__header {
      padding-left: 15px;
      // background-color: #fafafa;
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
            color: #666;
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
  .chosseDevDialogVisible {
    .seachDiv {
      height: 80px;
      display: flex;
      justify-content: space-between;
      background-color: #fff;
      padding: 0 15px;
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
  }
  .main-content3 {
    width: 900px;
    .upLoadDiv {
      padding: 0 20px;
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
              right: 40px;
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
  .addweibao {
    position: absolute;
    top: 17px;
    right: 32px;
    cursor: pointer;
  }
}
</style>
