<template>
  <div class="repair-details">
    <drawer :show="detailsdrawershow"
          :title="drawerTitle"
          :showEditBtn="showEdBtn"
          @on-edit="onEdit"
          @on-hide="onHide">
      <div class="mainlayout" style="width: 900px;"
          slot="drawer">
        <el-form :model="detailsData"
              :rules="addFlowRules"
              ref="addFlowform">
          <div class="main-content">
            <div class="basicInfo">
              <div class="bi-title">报修信息</div>
              <div class="content-info">
                <div>设备类型</div>
                <div v-if="readonly && detailsData.equirementDTO">{{formatBillType(detailsData.equirementDTO.equirementType)}}</div>
                <div v-else>
                  <el-form-item prop="equirementDTO.equirementType" v-if="detailsData.equirementDTO">
                    <el-select v-model="detailsData.equirementDTO.equirementType"
                            @change="eqTypeChange('')"
                            placeholder="请选择">
                    <el-option v-for="item in equipmentOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                    </el-option>
                  </el-select>
                  </el-form-item>
                </div>
              </div>
              <div class="content-info">
                <div>设备编号</div>
                <div v-if="readonly && detailsData.equirementDTO">{{detailsData.equirementDTO.code}}</div>
                <el-form-item prop="code" v-else>
                  <el-select v-model="detailsData.equirementDTO.code" v-if="detailsData.equirementDTO"
                            placeholder="请选择">
                    <el-option v-for="item in eqNumberOptions"
                              :key="item.code"
                              :label="item.code"
                              :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="content-info">
                <div>设备名称</div>
                <div v-if="detailsData.equirementDTO">{{detailsData.equirementDTO.name}}</div>
              </div>
              <div class="content-info">
                <div>设备型号</div>
                <div v-if="detailsData.equirementDTO">{{detailsData.equirementDTO.model}}</div>
              </div>
              <div class="content-info">
                <div>上报时间</div>
                <div v-if="detailsData.reportTime">{{detailsData.reportTime.replace('T', ' ')}}</div>
              </div>
              <div class="content-info">
                <div>责任人</div>
                <div v-if="readonly">{{detailsData.chargerName}}</div>
                <div v-else>
                  <el-form-item prop="chargerId">
                    <el-select v-model="detailsData.chargerId"
                              @change="chargerChange()"
                              placeholder="请选择">
                      <el-option v-for="item in chargeOption"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
              <div class="content-info" style="vertical-align: top;">
                <div>状态</div>
                <div>{{formatRepairStatus(detailsData.repairStatus)}}</div>
              </div>
              <div class="content-info" style="vertical-align: top;">
                <div>故障图片</div>
                <div v-if="readonly">
                  <img :src="detailsData.faultImage" style="width: 100px;height: 100px" @click="enlarge"/>
                </div>
                <div v-else>
                  <el-form-item prop="faultImage">
                    <div class="dev-img">
                      <img :src="detailsData.faultImage" style="width: 100%;height: 100%"/>
                    </div>
                    <div class="upload">
                      <span class="uploadbtn">
                        <i class="icon icon-upload"></i> 上传
                      </span>
                      <input type="file"
                            @change="imageChange('edit', $event)"
                            accept="image/png, image/jpeg">
                    </div>
                    <p style="font-size: 12px;">(仅可上传一张,建议尺寸：<span style="color: red">100*100</span>像素，支持格式JPG、PNG)</p>
                  </el-form-item>
                </div>
              </div>
              <div class="content-info">
                <div>故障描述</div>
                <div v-if="readonly">{{detailsData.description}}</div>
                <div v-else>
                  <el-form-item prop="description">
                    <el-input type="textarea" v-model="detailsData.description" resize="none"></el-input>
                  </el-form-item>
                </div>
              </div>
            </div>
            <div class="basicInfo" v-if="showHandle">
              <div class="bi-title">维修信息</div>
              <div class="content-info" style="vertical-align: top;">
                <div>故障类型</div>
                <div v-if="repairCompleted">{{formatFaultType(detailsData.faultType)}}</div>
                <div v-else>
                  <el-form-item prop="faultType">
                    <el-select v-model="detailsData.faultType"
                              placeholder="请选择">
                      <el-option v-for="item in faultTypeOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
              <div class="content-info" style="vertical-align: top;">
                <div>维修费用</div>
                <div v-if="repairCompleted">{{detailsData.price}}元</div>
                <div v-else>
                  <el-form-item prop="price">
                    <el-input v-model="detailsData.price" type="number">
                    </el-input> 元
                  </el-form-item>
                </div>
              </div>
              <div class="content-info">
                <div>维修备注</div>
                <div v-if="repairCompleted">{{detailsData.remark}}</div>
                <div v-else>
                  <el-form-item>
                    <el-input  type="textarea" v-model="detailsData.remark" resize="none" maxlength="50">
                    </el-input>
                  </el-form-item>
                </div>
              </div>
              <div class="content-info">
                <div>维修后图片</div>
                <div v-if="repairCompleted">
                  <img :src="detailsData.repairImage" />
                </div>
                <el-form-item prop="repairImage" v-else>
                    <div class="dev-img">
                      <img :src="detailsData.repairImage" v-if="detailsData.repairImage"/>
                    </div>
                    <div class="upload">
                      <span class="uploadbtn">
                        <i class="icon icon-upload"></i> 上传
                      </span>
                      <input type="file"
                            @change="imageChange('repairImage', $event)"
                            accept="image/png, image/jpeg">
                    </div>
                    <p style="font-size: 12px;">(仅可上传一张,建议尺寸：<span style="color: red">100*100</span>像素，支持格式JPG、PNG)</p>
                  </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </div>
      <div slot="footer" v-if="showHandle"
            class="dialog-footer">
        <el-button type="primary"
                style="position: relative;left: 10px;"
                 @click="onHide"
                class="close-button">关闭</el-button>
        <el-button type="primary"
                    @click="deal"
                    class="close-button">保存</el-button>
      </div>
      <div slot="footer" v-if="!readonly"
            class="dialog-footer">
        <el-button type="primary"
                style="position: relative;left: 10px;"
                 @click="saveRepair"
                class="close-button">保存</el-button>
        <el-button type="primary"
                    @click="addRepair"
                    class="close-button">提 交</el-button>
      </div>
    </drawer>
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      class="enlarge"
      width="30%">
      <img :src="detailsData.faultImage" style="width: 100%;height: 100%;padding: 10px"/>
    </el-dialog>
  </div>
</template>
<script>
import Drawer from '@/components/drawer.vue'
import context from '@/service'
import * as JSOG from 'jsog'
export default {
  name: 'repairDetails',
  components: {
    Drawer
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    detailsData: {
      type: Object,
      defulat: {
        repairImage: ''
      }
    },
    operation: {
      type: String
    }
  },
  data () {
    return {
      drawerTitle: '报修单',
      readonly: true,
      showEdBtn: false,
      showHandle: false,
      dialogVisible: false,
      repairCompleted: false,
      addform: {},
      tenantNameeOptions: [],
      rpStatusOptions: [
        {label: '待维修', value: 'WAIT'},
        {label: '维修完成', value: 'COMPLETE'}
      ],
      faultTypeOption: [
        {label: '人为造成', value: 'MANMADE'},
        {label: '正常磨损', value: 'ABRASION'},
        {label: '设备/备件缺陷', value: 'DEFECT'}
      ],
      equipmentOptions: [
        {label: '电梯', value: 'ELEVATOR'}, {label: '强电', value: 'STRONGCURRENT'}, {label: '暖通', value: 'HVAC'},
        {label: '给排水', value: 'WATERSUPPLY'}, {label: '停车场管理系统', value: 'PARKINGAREA'}, {label: '多媒体信息发布系统', value: 'MEDIARELEASE'},
        {label: '大屏幕投影系统', value: 'PROJECTION'}, {label: '安防监控系统', value: 'SECURITYMONITOR'}, {label: '楼宇自控系统', value: 'AUTOCONTROL'},
        {label: '消防报警系统', value: 'FIREALARM'}, {label: '电子巡更系统', value: 'PATROL'}, {label: '电话通讯系统', value: 'TELCONTACT'},
        {label: '门禁系统', value: 'ENTRANCEGUARD'}, {label: '闭路电视监控系统', value: 'VIDEOMONITOR'}, {label: '音乐广播系统', value: 'BROADCASTING'}
      ],
      eqNumberOptions: [],
      addFlowRules: {
        'equirementDTO.equirementType': [
          { required: true, message: '请选择设备类型', trigger: 'change' }
        ],
        'equirementDTO.code': [
          { required: true, message: '请选择设备编号', trigger: 'change' }
        ],
        chargerId: [
          { required: true, message: '请选择责任人', trigger: 'change' }
        ],
        faultType: [
          { required: true, message: '请选择故障类型', trigger: 'change' }
        ],
        price: [
          { required: true, message: '请输入维修费用', trigger: 'blur' }
        ],
        repairImage: [
          { required: true, message: '请上传维修后图片', trigger: 'change' }
        ]
      },
      userName: '',
      userPostId: '',
      chargeOption: []
    }
  },
  watch: {
    detailsData: {
      handler: function () {
        this.showEdBtn = false
        this.showHandle = false
        this.repairCompleted = false
        let user = JSON.parse(sessionStorage.getItem('user'))
        this.userName = user.account
        this.userPostId = user.userPostManagements[0].userPostId
        if (this.detailsData.createdBy === this.userName && this.detailsData.chargerId !== this.userPostId && this.detailsData.repairStatus === 'REFERED') {
          this.showEdBtn = true
        }
        if (this.operation === 'see' && this.detailsData.repairStatus !== 'COMPLETE') {
          this.showHandle = false
          return
        }
        if (this.detailsData.chargerId === this.userPostId) {
          this.showHandle = true
        }
        if (this.detailsData.repairStatus === 'COMPLETE') {
          this.repairCompleted = true
          this.showHandle = true
        }
      }
    }
  },
  methods: {
    onHide () {
      this.$emit('drawerClose', false)
      this.$emit('query', false)
      this.readonly = true
    },
    onEdit () {
      this.readonly = false
      this.eqTypeChange('1')
      this.queryCharge()
    },
    handleEdit (id) {
      this.$router.push({path: '/home/billList', query: {billId: id}})
    },
    enlarge () {
      this.dialogVisible = true
    },
    formatFaultType (val) {
      let res = ''
      if (val === 'MANMADE') {
        res = '人为造成'
      } else if (val === 'ABRASION') {
        res = '正常磨损'
      } else if (val === 'DEFECT') {
        res = '设备/备件缺陷'
      }
      return res
    },
    eqTypeChange (type) {
      context.http.get(`cms/api/equirements/equirementType/${this.detailsData.equirementDTO.equirementType}`).then(res => {
        this.eqNumberOptions = JSOG.decode(res.data)
        if (!type) {
          this.detailsData.equirementDTO = this.eqNumberOptions[0]
        }
      })
    },
    chargerChange () {
      let chargeOption = this.chargeOption
      let chargerId = this.detailsData.chargerId
      let chargerName = ''
      chargerName = chargeOption.filter((e, i) => {
        return e.id === chargerId
      })
      this.detailsData.chargerName = chargerName[0].name
    },
    formatFeeType (val) {
      let feeType
      switch (val) {
        case 'RENT':
          feeType = '租金'
          break
        case 'RENT_DEPOSIT':
          feeType = '租金保证金'
          break
        case 'PROPERTY':
          feeType = '物业费'
          break
        case 'PROPERTY_DEPOSIT':
          feeType = '物业费保证金'
          break
        case 'INTENTION':
          feeType = '意向金'
          break
        case 'DECORATION':
          feeType = '装修保证金'
          break
        case 'F_INTENTION':
          feeType = '返还意向金'
          break
        case 'F_DECORATION':
          feeType = '返还装修保证金'
          break
        case 'WITHDRAWAL':
          feeType = '退租结算'
          break
        case 'RELEASE':
          feeType = '合同解除结算'
          break
      }
      return feeType
    },
    formatRepairStatus (val) {
      let res = ''
      if (val === 'WAIT') {
        res = '待维修'
      } else if (val === 'COMPLETE') {
        res = '维修完成'
      } else if (val === 'REFERED') {
        res = '待分配'
      }
      return res
    },
    formatBillType (val) {
      let res = '-'
      let equipmentOptions = this.equipmentOptions
      equipmentOptions.forEach(ele => {
        if (val === ele.value) {
          res = ele.label
        }
      })
      return res
    },
    async imageChange (type, event) {
      // this.errorField = false
      let path = ''
      let files = event.target.files
      if (files.length > 0) {
        if (files[0].size > (1024 * 1024 * 3) || (files[0].type !== 'image/png' && files[0].type !== 'image/jpeg')) {
          // this.errorField = true
          this.errorTip = '上传图片格式不正确'
          return
        }
        let form = new FormData()
        form.append('file', files[0])
        context.http.post('/ywm/api/image-multipart', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          path = res.data
          if (type === 'repairImage') {
            this.detailsData.repairImage = path
          } else {
            this.detailsData.faultImage = path
          }
        }).catch(error => {
          console.info(error)
        })
      }
    },
    deal () {
      this.$refs['addFlowform'].validate((valid) => {
        if (valid) {
          console.log('detailsData', this.detailsData)
          context.http.put('/cms/api/repairs/deal', this.detailsData).then(res => {
            if (res) {
              this.onHide()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    saveRepair () {
      this.$refs['addFlowform'].validate((valid) => {
        if (valid) {
          this.flowDialogVisible = true
          this.detailsData.reportTime = this.detailsData.reportTime.replace(/\s/g, 'T')
          delete this.detailsData.equirementType
          console.log('add', this.detailsData)
          let _this = this
          context.http.put('/cms/api/repairs', this.detailsData).then(res => {
            if (res) {
              _this.onHide()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addRepair (formName) {
      this.$refs['addFlowform'].validate((valid) => {
        if (valid) {
          this.detailsData.reportTime = this.detailsData.reportTime.replace(/\s/g, 'T')
          delete this.detailsData.equirementType
          console.log('add', this.detailsData)
          let _this = this
          context.http.post('/cms/api/repairs', this.detailsData).then(res => {
            if (res) {
              _this.onHide()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async queryCharge () {
      let result = await context.http.get('uaa/api/user-posts', { page: (this.currentPage - 1),
        size: 100,
        sort: 'desc',
        useStatus: 'USING',
        name: this.postCode,
        code: this.postCode })
      this.chargeOption = result.data
    }
  }
}
</script>
<style lang="scss">
.repair-details{
  .drawer-head {
    border-bottom: 1px solid rgba(229,229,229,1);
  }
  .main-content{
    position: relative;
    margin-top: 10px;
    .basicInfo{
      border: 1px solid #e7e7e7;
      margin-bottom: 20px;
      padding-bottom: 20px;
    }
    .bi-title{
      background-color: #fafafa;
      height: 40px;
      line-height: 40px;
      padding-left: 12px;
      font-size: 14px;
      margin-bottom: 20px;
    }
    .content-info{
      display: inline-block;
      width: 32%;
      margin-top: 20px;
      padding-left: 20px;
      vertical-align: top;
      > div{
        font-size: 14px;
        color: #333333;
        &:last-child{
          font-size: 12px;
          color: #666666;
          margin-top: 6px;
        }
      }
      img{
        width: 100px;
        height: 100px;
      }
    }
    .matched-bills{
      margin: 40px 0 20px;
    }
    .bills{
      background:rgba(255,255,255,1);
      border:1px solid rgba(241,241,241,1);
      .bills-head{
        li{
          font-size: 12px;
          width: 11%;
          text-align: center;
          height: 30px;
          line-height: 30px;
          overflow: hidden;
        }
      }
      ul {
        display: flex;
        &:first-child{
          background:rgba(250,250,250,1);
        }
        li{
          font-size: 12px;
          width: 11%;
          text-align: center;
          height: 50px;
          line-height: 50px;
        }
      }
      .ck-btn{
        display: inline-block;
        width: 60px;
        height: 26px;
        line-height: 25px;
        text-align: center;
        border:1px solid rgba(53,119,246,1);
        border-radius:4px;
        color:rgba(53,119,246,1);
        cursor: pointer;
      }
    }
    .el-form-item__error{
      margin-left: 0;
    }
  }
  .el-select{
    // width: 100%;
  }
  .el-date-editor.el-input, .device-list .el-date-editor.el-input__inner{
    // width: 100%;
  }
  .el-input{
    width: 178px;
  }
  .enlarge {
    .el-dialog {
      .el-dialog__header, .el-dialog__body{
        margin: 0!important;
      }
      .el-dialog__header, .el-dialog__body{
        border: none;
      }
    }
  }
}

</style>
