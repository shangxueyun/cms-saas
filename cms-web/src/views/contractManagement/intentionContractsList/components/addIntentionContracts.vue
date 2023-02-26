<template>
  <div class="addIntentionContracts">
    <div class="dl-head">
      <span class="step"
            :class="{stepActive: newlystep1, stepActivePast: newlystep2}"><span style="font-size: 20px;">1</span>. 基本资料</span>
      <span class="step"
            :class="{stepActive: newlystep2}"><span style="font-size: 20px;">2</span>. 其他资料</span>
    </div>
    <div class="dl-content clearfix">
      <el-form :model="addData"
               ref="addData"
               :rules="addDataRules">
        <div class="step1"
             v-show="newlystep1">
          <div class="dc-left float-left">
            <div class="dr-head"
                 style="text-align: left">房源信息</div>
            <div class="basic-select">
              <div @click="choose('project')"
                   class="clearfix"
                   :class="selProject ? 'selectInput selectActive' : 'selectInput'">
                <img :src="chooseObj.previewImage" />
                <span>{{chooseObj.projectName}}</span>
                <span class="iconfont icon-xiala-"></span>
              </div>
              <ul v-if="selProject"
                  class="selectBox">
                <li @click="chooseItem('project', item)"
                    v-for="(item, index) in projectList"
                    :key="index">
                  <img :src="item.previewImage" />
                  <span>{{item.projectName}}</span>
                </li>
              </ul>
            </div>
            <div v-if="errorProject"
                 class="errorpjTip">请选择项目</div>
            <ul class="buildList">
              <li v-for="(item, index) in building.projectRoomsSecondDTOList"
                  :key="index">
                <p><span>{{item.buildingName}}</span><span class="iconfont icon-xiala-"></span></p>
                <dl>
                  <dd>
                    <el-checkbox-group v-model="checkList"
                                       class="select"
                                       @change="handleChecked">
                      <el-checkbox v-for="items in item.roomsDTOList"
                                   :key="items.id"
                                   :label="items">
                        <span v-if="items.floor.name">{{items.floor.name}}层</span>
                        <span>{{items.shopNumber}}室</span>
                        <span>{{items.buildingArea}}㎡</span>
                      </el-checkbox>
                    </el-checkbox-group>
                  </dd>
                </dl>
              </li>
            </ul>
          </div>
          <div class="dc-right float-right">
            <div class="dr-head">意向合同信息</div>
            <el-form-item :label-width="formLabelWidth"
                          style="margin-bottom: 20px;"
                          prop="yxContractNo">
              <div class="cttitle">意向合同编号<i class="required">*</i></div>
              <el-input v-model="addData.yxContractNo"
                        @input="queryContractNo()"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          prop="yxUnitPrice">
              <div class="cttitle">意向单价<i class="required">*</i></div>
              <el-input v-model="addData.yxUnitPrice"
                        type="number"
                        style="width: 60%;margin-right: 10px"
                        placeholder="请输入内容"></el-input>
              <span>元/㎡天</span>
              <!-- <el-select v-model="addData.priceUnit"
                           style="width: 35%;"
                           placeholder="请选择">
                  <el-option label="元/㎡天" value="M2DAYS"></el-option>
                  <el-option label="元/㎡月" value="M2MONTH"></el-option>
                  <el-option label="元/天" value="DAY"></el-option>
                  <el-option label="元/月" value="MONTH"></el-option>
                </el-select> -->
            </el-form-item>
            <el-form-item prop="startDate"
                          :label-width="formLabelWidth"
                          style="margin-bottom: 20px;">
              <div class="cttitle">意向合同开始时间<i class="required">*</i></div>
              <el-date-picker v-model="addData.startDate"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          prop="endDate"
                          style="margin-bottom: 20px;">
              <div class="cttitle">意向合同结束时间<i class="required">*</i></div>
              <el-date-picker v-model="addData.endDate"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          prop="area"
                          style="margin-bottom: 20px;position: relative">
              <div class="cttitle">租赁面积<i class="required">*</i></div>
              <el-input v-model="addData.area"
                        :disabled="true"
                        style="width: 91%;margin-right: 10px"
                        placeholder="请输入内容"></el-input>㎡
              <p v-if="areaNull"
                 style="position: absolute;font-size:12px;color:#f56c6c">租赁面积不能为空</p>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          style="margin-bottom: 20px;"
                          prop="yxDeposit">
              <div class="cttitle">意向定金<i class="required">*</i></div>
              <el-input v-model="addData.yxDeposit"
                        type="number"
                        style="width: 91%;margin-right: 10px"
                        placeholder="请输入内容"></el-input>元
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          prop="latestPaymentDate">
              <div class="cttitle">最晚缴纳时间<i class="required">*</i></div>
              <el-date-picker v-model="addData.latestPaymentDate"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="dc-right float-right tenantinfo">
            <div class="dr-head">客户信息</div>
            <el-form-item :label-width="formLabelWidth"
                          style="margin-bottom: 20px;">
              <div class="cttitle">客户名称</div>
              <el-select @change='selectChange'
                         v-model="tenantId"
                         placeholder="请选择">
                <el-option v-for="item in tenant"
                           :key="item.id"
                           :label="item.teantName"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth">
              <div class="cttitle">品牌</div>
              <span>{{addData.tenant ? addData.tenant.referred : ''}}</span>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth">
              <div class="cttitle">法人</div>
              <span>{{addData.tenant ? addData.tenant.operName : ''}}</span>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth">
              <div class="cttitle">行业</div>
              <span>{{addData.tenant ? addData.tenant.industry : ''}}</span>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth">
              <div class="cttitle">签订人</div>
              <el-input v-model="addData.signer"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth">
              <div class="cttitle">签订人联系方式</div>
              <el-input v-model="addData.signerPhone"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="step2 dl-content"
           v-show="newlystep2">
        <div class="dc-right float-right">
          <div class="dr-head">其他信息</div>
          <div class="other-info">
            <div style="margin-bottom: 10px;">备注</div>
            <el-input type="textarea"
                      :rows="2"
                      resize="none"
                      v-model="addData.remark">
            </el-input>
            <div style="margin: 40px 0 10px;">附件
              <span class="upload">
                上传附件
                <input type="file"
                       @change="imageChange('addapp', $event)">
              </span>
            </div>
            <div class="enclosure">
              <div class="enclosure-head">
                <span>文件名</span>
                <span>操作</span>
              </div>
              <div v-if="addData.annexName"
                   class="enclosure-list">
                <div class="el-item">
                  <span>{{addData.annexName}}</span>
                  <span>
                    <i @click="downloadFile"
                       class="iconfont icon-xiazaidaoru"
                       style="margin-right: 10px;"></i>
                    <i @click="deleFile"
                       class="iconfont icon-lajixiang"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="closeAddDialog"
                 class="close-button"
                 v-if="newlystep1">关 闭</el-button>
      <el-button @click="newlystepNoe('addData')"
                 type="primary"
                 class="defaultbtn dialog-confirmBtn"
                 v-if="newlystep1">下一步</el-button>
      <el-button type="primary"
                 @click="previousStep"
                 class="close-button"
                 v-if="newlystep2">上一步</el-button>
      <el-button type="primary"
                 class="defaultbtn dialog-confirmBtn"
                 v-if="newlystep2"
                 @click="addIntentionContracts()">确 认</el-button>
    </div>
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
window.repeatCode = false
export default {
  name: 'addIntentionContracts',
  props: {
    projectList: {
      type: Array,
      default: []
    }
  },
  data () {
    var validateCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入合同编号'))
      } else if (window.repeatCode) {
        callback(new Error('合同编号已存在,请更换'))
      } else {
        callback()
      }
    }
    return {
      addData: {},
      newlystep1: true,
      newlystep2: false,
      formLabelWidth: '',
      documentTypeOptions: [],
      nationalityOptions: [],
      chooseObj: {},
      selHourse: false,
      selProject: false,
      errorProject: false,
      areaNull: false,
      sexOptions: [
        { name: '男', value: 'MAN' },
        { name: '女', value: 'WOMAN' }
      ],
      addDataRules: {
        yxContractNo: [
          { validator: validateCode, trigger: 'blur' }
        ],
        yxUnitPrice: [
          { required: true, message: '请输入意向单价', trigger: 'blur' }
        ],
        priceUnit: [
          { required: true, message: '请选择单位', trigger: 'change' }
        ],
        yxDeposit: [
          { required: true, message: '请输入意向定金', trigger: 'blur' }
        ],
        latestPaymentDate: [
          { required: true, message: '请输入最晚缴纳时间', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '请选择结束时间', trigger: 'blur' }
        ],
        area: [
          { required: false, message: '请输入租赁面积', trigger: 'blur' }
        ]
      },
      building: {},
      checkList: [],
      tenant: [],
      tenantId: ''
    }
  },
  watch: {
    projectList: {
      handler: function () {
        this.chooseObj = this.projectList[0]
        this.newlystep1 = true
        this.newlystep2 = false
        this.tenantId = ''
        this.addData = {}
        this.checkList = []
        this.getRooms(this.chooseObj.id)
      }
    }
  },
  methods: {
    selectChange () {
      this.tenant.forEach(item => {
        if (Number(item.id) === Number(this.tenantId)) {
          this.addData.tenant = item
        }
      })
      console.log(this.addData.tenant)
    },
    getRooms (id) {
      context.http.get('/cms/api/tenant/projectManagement/unbinding/' + id).then(res => {
        console.log(res.data)
        this.tenant = res.data
      })
      context.http.get('/cms/api/rooms/projectManagement?projectManagementId=' + id).then(res => {
        console.log(res.data)
        this.building = res.data
        this.$set(this.addData, 'yxContractNo', res.data.yxNoPrefix)
      })
    },
    choose (state) {
      if (state === 'project') {
        this.selHourse = false
        this.selProject = !this.selProject
      }
    },
    chooseItem (state, item) {
      this.tenantId = ''
      this.addData.tenant = null
      this.addData.rooms = []
      this.checkList = []
      this.addData.area = 0
      if (state === 'project') {
        this.selProject = !this.selProject
      }
      this.chooseObj = item
      this.getRooms(item.id)
      console.log(this.chooseObj)
    },
    handleChecked (val) {
      let buildingArea = 0
      val.forEach(ele => {
        buildingArea += Number(ele.buildingArea)
      })
      this.areaNull = false
      this.$set(this.addData, 'area', buildingArea.toFixed(2))
      this.$forceUpdate()
    },
    async queryContractNo () {
      if (!this.addData.yxContractNo) {
        return false
      }
      let result = await context.http.get(`/cms/api/yx-contracts/isRepeat/${this.addData.yxContractNo}`)
      if (result.data) {
        window.repeatCode = true
        console.log('合同编号重复')
      } else {
        window.repeatCode = false
      }
    },
    newlystepNoe (formName) {
      if (!this.chooseObj) {
        this.errorProject = true
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.addData.area === 0 || !this.addData.area) {
            this.areaNull = true
            console.log('this.areaNull', this.areaNull)
            return false
          }
          this.newlystep1 = false
          this.newlystep2 = true
        } else {
          this.areaNull = true
          console.log('error submit!!')
          return false
        }
      })
    },
    previousStep () {
      this.newlystep1 = true
      this.newlystep2 = false
    },
    imageChange (state, event) {
      if (state === 'addapp') {
        console.log(event)
        let files = event.target.files
        let form = new FormData()
        form.append('file', files[0])
        let name = files[0].name
        event.target.value = ''
        context.http.post('/ywm/api/image-multipart', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          this.$set(this.addData, 'annexName', name)
          this.$set(this.addData, 'annexURL', res.data)
        }).catch(error => {
          console.info(error)
        })
      }
    },
    deleFile () {
      this.addData.annexName = null
      this.addData.annexURL = null
    },
    downloadFile () {
      axios({ method: 'GET', url: '/ywm/api/annex/download', params: { annexURL: this.addData.annexURL, annexName: this.addData.annexName }, responseType: 'blob' }).then(res => {
        console.log(res)
        let url = window.URL.createObjectURL(new Blob([res.data]))
        console.log(url)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', this.addData.annexName)
        document.body.appendChild(link)
        link.click()
      })
    },
    closeAddDialog () {
      this.$emit('addDialogClose')
    },
    addIntentionContracts () {
      console.log(this.tenantId)
      this.addData.rooms = this.checkList
      this.addData.priceUnit = 'M2DAYS'
      context.http.post('/cms/api/yx-contracts', this.addData).then(res => {
        console.log(res.data)
        this.$emit('addDialogClose')
        this.$emit('query', false)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.addIntentionContracts {
  .dialog-footer {
    border-top: 1px solid #e5e5e5;
    padding: 20px 0;
    text-align: right;
  }
  .errorpjTip {
    color: red !important;
    font-size: 12px;
    width: 100%;
    float: left;
  }
  .step2 {
    .dc-right {
      width: 100% !important;
      border: 1px solid #e7e7e7;
      .other-info {
        width: 98%;
        margin: 0 auto;
      }
    }
  }
  .upload {
    position: relative;
    float: right;
    display: inline-block;
    width: 60px;
    height: 24px;
    line-height: 24px;
    background: rgba(222, 235, 254, 1);
    opacity: 0.9;
    border-radius: 2px;
    font-size: 12px;
    text-align: center;
    cursor: pointer;
    input {
      position: absolute;
      right: 0;
      width: 60px;
      height: 24px;
      opacity: 0;
      cursor: pointer;
    }
  }
  .enclosure {
    border: 1px solid #e7e7e7;
    margin-bottom: 20px;
    .enclosure-head {
      background-color: #fafafa;
      height: 30px;
      line-height: 30px;
      span {
        display: inline-block;
        width: 48%;
        padding-left: 40px;
      }
    }
    .el-item {
      height: 30px;
      line-height: 30px;
      span {
        display: inline-block;
        width: 48%;
        padding-left: 40px;
        i {
          cursor: pointer;
        }
      }
    }
  }
  .basic-select {
    .selectInput {
      img {
        width: 40px;
        height: 20px;
        margin-right: 10px;
      }
      span {
        line-height: 40px;
      }
    }
  }
}
</style>
