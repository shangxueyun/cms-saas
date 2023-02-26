<template>
  <div class="tenant-details addRecord">
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
              <div class="form" style="padding-top: 15px">
                <el-form-item prop="projectManagementId">
                  <span>项目简称<i class="required">*</i></span>
                  <p v-if="patrolInspection">{{patrolInspection.projectManagementName}}</p>
                  <!-- <el-select v-model="addData.projectManagementId"
                             @change="getFrom"
                             size="small"
                             placeholder="请选择">
                    <el-option v-for="item in projectManagementsList"
                               :key="item.id"
                               :label="item.referred"
                               :value="item.id"></el-option>
                  </el-select> -->
                </el-form-item>
                <el-form-item prop="patrolInspection">
                  <span>巡更巡检表名称<i class="required">*</i></span>
                  <!-- <el-select v-model="addData.patrolInspection"
                             value-key="id"
                             size="small"
                             @change="fromSelect"
                             placeholder="请选择">
                    <el-option v-for="item in fromList"
                               :key="item.id"
                               :label="item.name"
                               :value="item"></el-option>
                  </el-select> -->
                  <p v-if="patrolInspection">{{patrolInspection.name}}</p>
                </el-form-item>
                <el-form-item prop="person">
                  <span>责任人<i class="required">*</i></span>
                  <el-input v-model="addData.person"
                            maxlength="10"></el-input>
                </el-form-item>
                <el-form-item prop="completeTime">
                  <span style="width:100%">实际完成时间<i class="required">*</i></span>
                  <el-date-picker v-model="addData.completeTime"
                                  @change="timeChange"
                                  type="datetime"
                                  placeholder="选择日期"
                                  value-format="yyyy-MM-ddTHH:mm:ss"></el-date-picker>
                </el-form-item>
                <el-form-item prop="repairFee">
                  <div style="display: flex;align-items: center;">
                    <span style="margin-right:15px">附件</span>
                    <aliUpload class="aliUpload  aliUpload_small"
                               style="width:76px;height:22px"
                               :upLoadText="upLoadText"
                               :fileType="fileType"
                               :iconShow="true"
                               v-if="!addData.annexes.length"
                               @setAnnex="setAnnexs" />
                  </div>

                  <div class="annexesList"
                       v-for="(item2, idx2) in addData.annexes"
                       :key="idx2">
                    <span class="annexName"
                          :title="item2.annexName">{{item2.annexName}}</span>
                    <!-- <aliDownLoad class="aliDownLoad1"
                                 style="margin-right:15px"
                                 :item="item2"
                                 :encrypt="true" /> -->
                    <ailPreview :ailObj="item2"
                                :encrypt="true"
                                @setFile="setFile" />
                    <i @click="deleFile(item2, idx2)"
                       class="iconfont icon-lajixiang"
                       style="cursor:pointer"></i>

                  </div>
                </el-form-item>
              </div>
            </div>
          </div>

          <div class="basInfo">
            <p class="title"><span class="vertical"></span>巡更&巡检设备</p>
            <div style="margin:10px 15px">检测设备{{addData.equirementPatrolResults.length}}项</div>
            <div class="content">
              <el-table :data="addData.equirementPatrolResults"
                        class="table tableData"
                        max-height="350px"
                        style="width: 100%"
                        ref="multipleTable">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-input type="textarea"
                              v-model="props.row.content"
                              resize="none"
                              maxlength="200">
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="name"
                                 label="设备名称"
                                 align="center"> </el-table-column>
                <el-table-column prop="code"
                                 label="设备编号"
                                 align="center"> </el-table-column>
                <el-table-column prop="equipmentType"
                                 label="设备大类"
                                 align="center"> </el-table-column>
                <el-table-column prop="installPosition"
                                 label="安装位置"
                                 align="center"> </el-table-column>
                <el-table-column label="巡更&巡检结果"
                                 align="center">
                  <template slot-scope="props">
                    <span :class="{'normal' : props.row.checkStatus==='NORMAL'}">正常</span>
                    <el-switch v-model="props.row.checkStatus"
                               active-value="ERROR"
                               inactive-value="NORMAL"
                               active-color="#ff4949"
                               inactive-color="#13ce66">
                    </el-switch>
                    <span :class="{'abnormal' : props.row.checkStatus==='ERROR'}">异常</span>
                  </template>
                </el-table-column>
              </el-table>
              <!-- <div class="ctc-foot">
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
              </div> -->
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div slot="footer"
         style="text-align: right;padding: 8px 20px 8px;"
         class="dialog-footer">
      <el-button @click="onHide()"
                 class="close-button">取消</el-button>
      <el-button type="primary"
                 class="defaultbtn dialog-confirmBtn"
                 @click="addRecord('addData')">确定</el-button>
    </div>
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
    patrolInspection: {
      type: Object
    },
    detailsShow: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    detailsShow: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.addData.projectManagementId = this.patrolInspection.projectManagementId
          this.addData.patrolInspection = this.patrolInspection
          this.fromSelect(this.patrolInspection)
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
      imgArr: [],
      num: 0,
      showPicture: false,
      fromList: [],
      currentPage: 1,
      total: 1,
      pgSize: 15,
      projectManagementsList: [],
      addData: {
        'projectManagementId': '',
        'patrolInspection': null, // 巡更巡检表对象
        'person': '',
        'completeTime': '',
        'annexes': [],
        'equirementPatrolResults': []
      },
      upLoadText: '上传附件',
      fileType: [],
      iconImg: 'icon-shangchuantupianicon',
      value: '',
      addDataRules: {
        projectManagementId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        patrolInspection: [
          { required: true, message: '请选择巡更巡检表名称', trigger: 'change' }
        ],
        person: [
          { required: true, message: '请输入责任人', trigger: 'change' }
        ],
        completeTime: [
          { required: true, message: '请选择实际完成时间', trigger: 'change' }
        ]
      }
    }
  },
  computed: {

  },
  methods: {
    fromSelect (obj) { // 选择表
      this.addData.equirementPatrolResults = obj.equirements.map((item, index) => {
        let param = {}
        param.equirementId = item.id
        param.checkStatus = 'NORMAL'
        param.content = ''
        // ----------
        param.name = item.name
        param.code = item.code
        param.installPosition = item.installPosition
        param.equipmentType = item.equirementType.parent.name
        return param
      })
      // console.log(this.addData.equirementPatrolResults)
    },
    timeChange (time) {
      console.log(time)
    },
    async getFrom (id) { // 巡更巡检表
      this.fromList = []
      this.addData.patrolInspection = null
      this.addData.equirementPatrolResults = []
      let result = await context.http.get('/cms/api/patrolInspection/list', { projectManagementId: id, useStatus: 'USING' })
      this.fromList = JSOG.decode(result.data)
    },
    setAnnexs (annexURL, annexName) {
      this.addData.annexes.push({ 'annexURL': annexURL, 'annexName': annexName })
    },
    deleFile (item, index) {
      this.addData.annexes.splice(index, 1)
    },
    setFile (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    addRecord (formName) { // 新增维保记录
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // delete this.addData.projectManagementId
          console.log(this.addData)
          context.http.post('/cms/api/patrolInspectionRecord', this.addData).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '巡更巡检记录新增成功'
              })
              this.onHide()
              this.$emit('query')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    editFn () {
      if (this.pageType === 'add') {
        this.pageType = 'readOnly'
      } else {
        this.pageType = 'add'
      }
    },
    onHide () {
      this.addData = {
        'projectManagementId': '',
        'patrolInspection': null, // 巡更巡检表对象
        'person': '',
        'completeTime': '',
        'annexes': [],
        'equirementPatrolResults': []
      }
      this.fromList = []
      this.$refs['addData'].resetFields()
      this.$emit('drawerClose', false)
    },
    onHide_parent () {
      this.addData = {
        'projectManagementId': '',
        'patrolInspection': null, // 巡更巡检表对象
        'person': '',
        'completeTime': '',
        'annexes': [],
        'equirementPatrolResults': []
      }
      this.fromList = []
      this.$refs['addData'].resetFields()
    },
    pictureClose () {
      this.showPicture = false
    },
    current_change (currentPage) {
      this.currentPage = currentPage
    }
  }
}
</script>
<style lang="scss" >
.addRecord {
  .textarea {
    border: none;
  }
  .el-select {
    width: 100%;
  }
}
</style>
<style lang="scss" scoped>
.addRecord {
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
      padding: 0 15px;
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
.tenant-details.addRecord {
  .el-input__inner {
    height: 32px;
  }
  .el-input__icon {
    line-height: 32px;
  }
}
</style>
