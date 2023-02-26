<template>
  <div>
    <el-form>
      <div class="fire-report">
        <div class="fire-report-content"
             style="margin: 20px 0">
          <p class="title">
            <i></i>
            <span>基本信息</span>
          </p>
          <el-form :model="addData"
                   :rules="addDataRules"
                   ref="ruleForm">
            <el-form-item :label-width="formLabelWidth"
                          prop="projectId"
                          style="margin-bottom: 20px;margin-top: 10px;">
              <div class="cttitle">项目简称<i class="required">*</i></div>
              <p>{{projectIdName}}</p>
              <!-- <el-select v-model="addData.projectId"
                         placeholder="项目"
                         @change="cmsFireControlCheckList(addData.projectId)"
                         style="width: 220px;">
                <el-option v-for="item in projectManagementsList"
                           :key="item.id"
                           :label="item.referred"
                           :value="item.id">
                </el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          prop="projectId"
                          style="margin-bottom: 20px;margin-top: 10px;">
              <div class="cttitle">消防器材检测表<i class="required">*</i></div>
              <p>{{FireEquipmentTestTable}}</p>
            </el-form-item>
            <el-form-item prop="reportName"
                          :label-width="formLabelWidth"
                          style="margin-top: 10px;">
              <div class="cttitle">报告名称<i class="required">*</i></div>
              <el-input v-model="addData.reportName"
                        maxlength="20"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item prop="checkType"
                          :label-width="formLabelWidth">
              <div class="cttitle">检测类型<i class="required">*</i></div>
              <el-select v-model="addData.checkType"
                         placeholder="检查表选择"
                         style="width: 210px;">
                <el-option v-for="item in monitorTypeList"
                           :key="item.value"
                           :label="item.name"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="checkDate"
                          :label-width="formLabelWidth">
              <div class="cttitle">检测时间<i class="required">*</i></div>
              <el-date-picker value-format="yyyy-MM-dd"
                              v-model="addData.checkDate"
                              type="date"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="principal"
                          :label-width="formLabelWidth">
              <div class="cttitle">负责人<i class="required">*</i></div>
              <el-input v-model="addData.principal"
                        maxlength="10"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          v-if="addData.checkType === 'CONNECTION'">
              <div class="cttitle">维保单位</div>
              <el-input v-model="addData.checkDept"
                        maxlength="20"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-form>
          <div class="dc-right"
               style="width: 96%;margin: 0 auto 20px">
            <div class="enclosure"
                 style="margin: 0">
              <div class="enclosure-head">
                <div style="margin-left: 20px;">附件</div>
                <aliUpload :upLoadText="upLoadText"
                           :fileType="fileType"
                           @setAnnex="setAnnex" />
              </div>
              <div class="enclosure-head"
                   style="border-bottom: 1px solid #D8DCE3;background-color:#fff">
                <span>文件名</span>
                <span>操作</span>
              </div>
              <div class="enclosure-list"
                   v-for="(item, index) in addData.annexes"
                   :key="index">
                <div class="el-item">
                  <span>{{item.annexName}}</span>
                  <span v-if="item.annexName"
                        style="padding-left: 60px">
                    <i @click="downloadFile(item, index)"
                       class="iconfont icon-xiazaidaoru"
                       style="margin-right: 10px;"></i>
                    <i @click="deleFile(item, index)"
                       class="iconfont icon-lajixiang"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="fire-report-content"
             style="margin: 10px 0">
          <p class="title">
            <i></i>
            <span>消防检测设备</span>
          </p>
          <div class="dc-right conDetail"
               style="border-left: none;border-right: 0">
            <div class="dr-head">检测设备{{equirementsallList.length}}项</div>
            <div style="display: flex;justify-content: space-around;">
              <div class="item"
                   style="width:240px;display: inline-block;">
                <el-select clearable
                           v-model="equirementTypeId"
                           placeholder="设备小类"
                           @change="queryEquipment('TypeId', equirementTypeId)"
                           style="margin-left: 16px;width: 200px;">
                  <el-option v-for="item in getEquirementTypes25List"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id">
                  </el-option>
                </el-select>
              </div>
              <div class="item"
                   style="width:240px;display: inline-block;">
                <el-form-item>
                  <el-input style="width:200px;"
                            placeholder="设备编号/名称"
                            @input="queryEquipment('code', equirementCode)"
                            v-model="equirementCode"></el-input>
                </el-form-item>
              </div>
              <div class="item"
                   style="width:230px;display: inline-block;">
                <el-form-item>
                  <el-input style="width:200px;"
                            placeholder="安装位置"
                            @input="queryEquipment('installation', equirementInstallation)"
                            v-model="equirementInstallation"></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="equipment-table">
            <ul>
              <li>设备小类</li>
              <li>设备编号</li>
              <li>设备名称</li>
              <li>安装位置</li>
              <li>检查结果</li>
            </ul>
          </div>
          <el-collapse accordion
                       class="el-collapse">
            <el-collapse-item class="collapse-item"
                              v-for="(item, index) in eqsearchList"
                              :key="index">
              <template slot="title">
                <span style="width: 160px;">{{item.equirementType.name}}</span>
                <span style="width: 160px;">{{item.code}}</span>
                <span style="width: 160px;">{{item.name}}</span>
                <span style="width: 160px;">{{item.installPosition}}</span>
                <span>
                  <el-switch style="display: block"
                             v-model="item.checkStatus"
                             active-color="#91CF48"
                             inactive-color="#FF6665"
                             active-text="正常"
                             inactive-text="异常">
                  </el-switch>
                </span>
              </template>
              <el-form label-position="left"
                       inline
                       class="demo-table-expand">
                <el-form-item label="">
                  <el-input type="textarea"
                            maxlength="200"
                            style="width: 695px"
                            :autosize="{ minRows: 3}"
                            placeholder="请输入备注内容"
                            v-model="item.remarks">
                  </el-input>
                </el-form-item>
              </el-form>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="addenergyDataClose1"
                 class="close-button">关 闭</el-button>
      <el-button type="primary"
                 @click="determine"
                 class="defaultbtn dialog-confirmBtn">确 定</el-button>
    </div>

    <!-- 确认新增 -->
    <el-dialog title="生成预览"
               :visible.sync="DELDialogVisible"
               width="520px"
               center
               append-to-body
               class="delDialog">
      <div class="delDialog_content">
        <i class="el-icon-warning-outline"></i>
        <span>确定后设备数量及状态不可变更！</span>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="DELDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addReport">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import aliUpload from '@/components/aliUpload.vue'
export default {
  name: 'NewReport',
  components: {
    aliUpload
  },
  props: {
    detailData: {
      type: Object
    },
    addenergyDataShow1: {
      type: Boolean
    }
  },
  watch: {
    addenergyDataShow1: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.projectIdName = this.detailData.projectName
          this.FireEquipmentTestTable = this.detailData.name
          this.addData.projectId = this.detailData.projectId
          this.checkListId = this.detailData.id
          this.equirementsall()
          this.getEquirementTypes25()
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      projectIdName: '',
      FireEquipmentTestTable: '',
      DELDialogVisible: false,
      eqAllList: [],
      eqsearchList: [],
      equirementInstallation: '',
      equirementCode: '',
      getEquirementTypes25List: [],
      equirementTypeId: '',
      checkListId: '',
      upLoadText: '上传附件',
      fileType: [],
      newlystep1: true,
      newlystep2: false,
      newlystep3: false,
      formLabelWidth: '',
      checkList: [],
      equirementsallList: [],
      monitorTypeList: [{ name: '物业巡检', value: 'PROPERTY' }, { name: '维保单位消防联动检测', value: 'CONNECTION' }, { name: '消防检查', value: 'FIRE' }],
      addData: {
        annexes: []
      },
      addDataRules: {
        // projectId: [
        //   { required: true, message: '请选择项目', trigger: 'change' }
        // ],
        reportName: [
          { required: true, message: '请输入报告名称', trigger: 'blur' }
        ],
        checkType: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        checkDate: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        checkDept: [
          { required: true, message: '请输入维保单位', trigger: 'blur' }
        ],
        principal: [
          { required: true, message: '请输入负责人', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    setAnnex (annexURL, annexName) {  // 子组件上传成功返回文件url 和名字
      this.addData.annexes.push({
        'annexName': annexName,
        'annexURL': annexURL
      })
    },
    getEquirementTypes25 () {
      context.http.get('/cms/api/equirementTypes/2').then(res => {
        this.getEquirementTypes25List = res.data
      })
    },
    queryEquipment (type, val) {
      if (val === '') {
        this.eqsearchList = this.equirementsallList
        return
      }
      let eqsearchList = this.equirementsallList
      if (type === 'TypeId') {
        var searchList = eqsearchList.filter(item => {
          return item.equirementType.id === val
        })
        this.eqsearchList = searchList
      } else if (type === 'code') {
        let searchList2 = []
        eqsearchList.forEach(ele => {
          if (ele.code.indexOf(val) >= 0 || ele.name.indexOf(val) >= 0) {
            searchList2.push(ele)
          }
        })
        this.eqsearchList = searchList2
      } else if (type === 'installation') {
        let searchList3 = []
        eqsearchList.forEach(ele => {
          if (ele.installPosition.indexOf(val) >= 0) {
            searchList3.push(ele)
          }
        })
        this.eqsearchList = searchList3
      }
    },
    equirementsall () {
      this.equirementTypeId = ''
      context.http.get('/cms/api/cmsFireControlCheckList/equirementsall', { fireControlCheckListId: this.checkListId, useStatus: 'USING' }).then(res => {
        res.data.forEach(ele => {
          ele.checkStatus = true
        })
        this.equirementsallList = res.data
        this.eqsearchList = res.data
      })
    },
    downloadFile (item, index) {
      axios({
        method: 'GET',
        url: '/ywm/api/annex/download',
        params: {
          annexURL: item.annexURL,
          annexName: item.annexName
        },
        responseType: 'blob'
      }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', item.annexName)
        document.body.appendChild(link)
        link.click()
      })
    },
    deleFile (item, index) {
      this.addData.annexes.splice(index, 1)
    },
    addenergyDataClose1 () { // 关闭新增弹窗
      // this.restData()
      this.equirementCode = ''
      this.equirementInstallation = ''
      this.addenergyDataShow = false
      this.$emit('addenergyClose')
    },
    newlystepNoe (formName) {
      if (this.newlystep1) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.newlystep1 = false
            this.newlystep2 = true
            this.newlystep3 = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        if (this.equirementsallList.length === 0) {
          this.$message.error('请选择检测设备')
          return
        }
        let equirementsallList = this.equirementsallList
        let left = []
        let right = []
        let result = []
        equirementsallList.forEach(ele => {
          if (ele.checkStatus) {
            right.push(ele)
          } else {
            left.push(ele)
          }
        })
        result = left.concat(right)

        this.eqAllList = result
        this.newlystep1 = false
        this.newlystep2 = false
        this.newlystep3 = true
      }
    },
    previousStep () {
      if (this.newlystep2) {
        this.newlystep1 = true
        this.newlystep2 = false
        this.newlystep3 = false
      } else {
        this.newlystep1 = false
        this.newlystep2 = true
        this.newlystep3 = false
      }
    },
    restData () {
      this.addData = {
        annexes: []
      }
      this.$refs['ruleForm'].resetFields()
      this.equirementsallList = []
      this.eqAllList = []
      this.checkListId = ''
      this.equirementTypeId = ''
      this.eqsearchList = []
    },
    determine () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.DELDialogVisible = true
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addReport () {
      let additionDTOS = []
      this.equirementsallList.forEach(ele => {
        additionDTOS.push({ checkStatus: ele.checkStatus ? 'NORMAL' : 'ERROR', comment: ele.remarks, id: ele.id })
      })
      this.addData.additionDTOS = additionDTOS
      this.addData.fireControlCheckListId = this.detailData.id
      context.http.post('/cms/api/fcReports', this.addData).then(res => {
        if (res.status === 201) {
          this.addenergyDataShow = false
          this.DELDialogVisible = false
          this.$message({
            type: 'success',
            message: '新增成功'
          })
          this.addenergyDataClose1()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.fire-report {
  .dl-head {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: space-start;
    justify-content: space-start;
    margin-top: 20px;
  }
  .step {
    display: inline-block;
    width: 49%;
    height: 40px;
    line-height: 40px;
    padding-left: 14px;
    font-size: 16px;
    background-color: #f9f9f9;
    color: #777;
    border-radius: 6px;
    margin-right: 20px;
  }
  .stepActive {
    color: #fff;
    background-color: #3175d2;
  }
  .el-form-item {
    display: inline-block;
    width: 29%;
    margin-left: 16px;
    margin-right: 10px;
    vertical-align: top;
  }
  .enclosure-head {
    background-color: #fafafa;
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -ms-flex-align: center;
    align-items: center;
  }
  .determine-btn {
    display: inline-block;
    width: 80px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
    color: #fff;
    border-radius: 3px;
    background-color: #3577f6;
  }
}
.dc-right {
  width: 100%;
  margin-top: 20px;
  .dr-head {
    background-color: #fafafa;
    height: 40px;
    line-height: 40px;
    padding-left: 12px;
    font-size: 14px;
    margin-bottom: 20px;
    border-bottom: 1px solid #ebebeb;
  }
  .el-form-item {
    display: inline-block;
    width: 29%;
    margin-left: 16px;
    margin-right: 10px;

    &:nth-of-type(2n) {
      margin-right: 0;
    }
  }
}
.equipment-table {
  ul {
    display: flex;
    background: #fafafa;
    li {
      width: 20%;
      font-size: 12px;
      font-weight: bold;
      text-align: center;
      height: 35px;
      line-height: 35px;
    }
  }
}
.dialog-footer {
  text-align: right;
  padding: 10px 20px 10px 0;
  background-color: #fff;
}
.fire-report-content {
  background-color: #fff;
  .title {
    font-size: 16px;
    font-weight: bolder;
    padding-left: 26px;
    height: 40px;
    line-height: 40px;
    background-color: #fff;
    border-bottom: 1px solid #f6f6f6;
    position: relative;
    color: #262626;
    display: flex;
    align-items: center;
    -ms-flex-pack: justify;
    i {
      display: block;
      position: absolute;
      left: 15px;
      top: 12px;
      width: 4px;
      height: 16px;
      border-radius: 2px;
      background: #3575f6;
    }
  }
}
.el-collapse {
  max-height: 300px;
  overflow-y: scroll;
  border-bottom: none;
}
.el-collapse::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  background-color: rgb(25, 38, 70);
}
/*定义滚动条轨道 内阴影+圆角*/
.el-collapse::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px #fff;
  border-radius: 10px;
  background-color: #fff;
}
/*定义滑块 内阴影+圆角*/
.el-collapse::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px #3175d2;
  background-color: #3175d2;
}
.collapse-item {
  span {
    display: inline-block;
    text-align: center;
    font-size: 12px;
  }
}
</style>
<style lang="scss">
.fire-report {
  .el-collapse-item__arrow{
    margin-left: 0;
  }
  .el-collapse-item__header {
    line-height: inherit;
  }
}
</style>

