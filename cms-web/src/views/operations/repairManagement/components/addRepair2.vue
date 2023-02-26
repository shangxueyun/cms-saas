<template>
  <div class="tenant-details addWeixiu_new">
    <div class="tenant-details details-content repairDetails_content"
         slot="drawer">
      <div class="main-content"
           style="border:none">
        <div class="basInfo">
          <el-form class="form"
                   :model="addData"
                   ref="addData"
                   :rules="addDataRules">
            <el-form-item prop="repairType"
                          style="width:48%">
              <div style="margin-bottom:8px">状态<i class="required">*</i></div>
              <!-- <el-select v-model="addData.repairFormStatus"
                         style="width:100%">
                <el-option label="处理中"
                           value="WAIT"></el-option>
                <el-option label="已处理"
                           value="OVER"></el-option>
              </el-select> -->
              <el-select v-model="addData.repairStatus"
                         style="width:240px">
                <el-option label="已处理"
                           value="COMPLETE"></el-option>
                <el-option label="处理中"
                           value="NO"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="repairDate"
                          style="width:48%">
              <div style="margin-bottom:8px">时间<i class="required">*</i></div>
              <el-date-picker v-model="addData.repairDate"
                              style="width:100%"
                              type="date"
                              placeholder="选择日期"
                              value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item prop="recordString"
                          style="width:100%">
              <div style="margin-bottom:8px">维修记录<i class="required">*</i></div>
              <el-input type="textarea"
                        placeholder="500字以内"
                        :rows="5"
                        maxlength="500"
                        resize="none"
                        v-model="addData.recordString"></el-input>
            </el-form-item>
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
          </el-form>
        </div>
      </div>
    </div>
    <div slot="footer"
         class="slotfooter">
      <span @click="onHide">取消</span>
      <span @click="addRepairSave('addData')">确定</span>
    </div>
    <el-dialog title="选择设备"
               :visible.sync="chosseDevDialogVisible"
               width="900px"
               append-to-body
               id="chosseDevDialogVisible"
               class="chosseDevDialogVisible"
               @close="closeChosseDevDialog">
      <div class="seachDiv"
           style="display: flex; align-items: center; padding: 15px 0;">
        <el-select placeholder="全部"
                   style="width:160px;margin-right:15px"
                   v-model="projectManagementId"
                   clearable>
          <el-option v-for="(item,index) in projectManagementsList"
                     :key="index"
                     :label="item.referred"
                     :value="item.id"></el-option>
        </el-select>
        <el-cascader :options="cascaderList"
                     @change="handleChange1"
                     style="width:160px;margin-right:15px"
                     clearable></el-cascader>
        <el-input placeholder="设备名称"
                  style="width:160px;margin-right:15px"
                  v-model="devName"></el-input>
        <el-input placeholder="设备编号"
                  style="width:160px;margin-right:15px"
                  v-model="devNb"></el-input>
        <div class="query-btn-small"
             @click="this.currentPage=1;getDevice()"
             style="margin-top:0px;margin-left:0">查询</div>
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
        <span @click="selectdDevic">确2定</span>
      </div>
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
    projectId: {

    }
  },
  watch: {
    detailsdrawershow: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          // this.addData.repairStatus = this.repairDetailsData.repairStatus
          this.projectManagementId = this.projectId
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
      iconImg: 'icon-shangchuantupianicon',
      equirementType: '',
      cascaderList: [], // 设备类型二级联选择器
      equirementNo: '',
      devNb: '',
      devName: '',
      chosseDevDialogVisible: false,
      addData: {
        annexes: [],
        recordString: '',
        repairFormStatus: 'WAIT',
        repairStatus: 'NO',
        equirementNo: null,
        equirementId: null,
        name: null,
        repairType: 'EQUIREMENT',
        maintenanceClassify: 'REPAIR',
        imageUrls: [],
        materialUsage: null,
        remake: null,
        description: null,
        repairUserName: null,
        repairFee: null,
        repairDate: null
      },
      selectionArr: [], // 选中
      selectionId: '', // 选中
      projectManagementId: '',
      tableData: [],
      showPicture: false,
      imgArr: [],
      num: 1,
      upLoadText: '上传附件',
      fileType: [],
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
        recordString: [
          { required: true, message: '请输入维修记录', trigger: 'change' }
        ],
        repairFee: [
          { required: true, message: '请输入维保费用', trigger: 'change' }
        ],
        repairStatus: [
          { required: true, message: '请选择维保结果', trigger: 'change' }
        ],
        equirementNo: [
          { required: true, message: '请输入设备编号', trigger: 'change' }
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
    setAnnexs (annexURL, annexName) {
      this.addData.annexes.push({ 'annexURL': annexURL, 'annexName': annexName })
    },
    deleFile (item, index) {
      this.addData.annexes.splice(index, 1)
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
      this.equirementNo = this.selectionArr.code
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
      this.addData.repairType = this.repairDetailsData.repairType
      // this.addData.equirementId = this.equirementId
      this.addData.roomsName = this.repairDetailsData.roomsName
      this.addData.name = this.repairDetailsData.name
      this.addData.projectId = this.repairDetailsData.projectId
      console.log(this.addData)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _this = this
          context.http.post('/cms/api/repair-records', this.addData).then(res => {
            this.addData.annexes = []
            this.addData.recordString = ''
            if (res) {
              this.$message({
                type: 'success',
                message: '维修记录新增成功'
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
<style lang="scss" >
.addWeixiu_new {
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
        color: #777777;
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
  .upLoadComponents {
    width: 150px;
    height: 130px;
    border: 1px solid #d0d0d0ff;
    background-color: #f7f9fd;
    // background: url(../../../../assets/plus.png) no-repeat center;
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
  > div {
    &.vue-drawer {
      .drawer {
        background-color: #faf7fa !important;
        overflow: hidden;
        .wrap {
          min-height: auto;
          height: calc(100% - 80px) !important;
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
            margin-right: 20px;
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
          .main-content {
            .basInfo {
              background-color: #ffffff;
            }
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
</style>
<style lang="scss" scoped>
.addWeixiu_new {
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
      margin-bottom: 15px;
      background-color: #ffffff;
      display: flex;
      align-items: center;
      padding: 0 60px 0 20px;
      justify-content: space-between;
      font-size: 14px;
    }
    .basInfo {
      border: 1px solid #dadada;
      padding: 15px;
      margin-bottom: 20px;
      > form {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .upLoadDiv {
          width: 100%;
          .aliUpload_small {
            width: 100%;
            height: 100%;
          }
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
      }
    }
    .upLoadDiv {
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
              font-size: 14px;
              color: #8e8e8e;
            }
            .seachDeviceIcon {
              display: inline-block;
              width: 20px;
              height: 20px;
              background: url(../../../../assets/seachDeviceIcon.png) no-repeat;
              position: absolute;
              right: 35px;
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
</style>
