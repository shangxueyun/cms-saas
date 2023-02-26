<template>
  <div>
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            :showEditBtn="hasAuthority('05010103')"
            @on-edit="onEdit"
            @on-hide="onHide">
      <div class="mainlayout personal-info"
           slot="drawer">
        <div class="main-content">
          <div class="personalInfo membershipFiles">
            <div class="head clearfix">
              <div class="head-portrait float-left"
                   v-if="detailsInfo && detailsInfo.headImage">
                <img :src="detailsInfo.headImage" />
                <input type="file" v-if="!readonly"
                       @change="imageChange($event)"
                       accept="image/png, image/jpeg">
              </div>
              <div v-else class="head-portrait float-left" style="border: none">
                <img src="../../../../assets/touxiang.png" />
                <input type="file" v-if="!readonly"
                       @change="imageChange($event)"
                       accept="image/png, image/jpeg">
              </div>
              <div class="infomation float-left">
                <p>{{detailsInfo.nickName}}
                  <span>{{detailsInfo.level}}</span>
                </p>
                <p style="margin-top: 40px;">
                  标签：<span class="label-item" v-for="(item, index) in detailsInfo.memberLabels" :key="index" style="margin-right: 6px;">
                      {{item.name}}
                     <i v-if="!readonly" @click="deleteLabel(item, index)" class="iconfont icon-cha" style="font-size: 12px;"></i></span>
                </p>
              </div>
            </div>
            <div class="regularTips"
                 v-if="detailsInfo.positiveState === 'PROBATION' && detailsInfo.jobStatus === 'ONJOB'">
              入职时间：{{TimeTrans(detailsInfo.entryTime)}}，{{detailsInfo.trialCycleValue}}，预计转正日期{{detailsInfo.yjPositiveDate}}
              <!-- <span @click="regulardialogVisible = true"
                    v-if="hasAuthority('05010103')">办理转正 >></span> -->
            </div>
            <div class="personal-info">
              <div class="pi-head">
                基本信息
                <!-- <span class="editbtn"
                      @click="readonly=false"
                      v-if="readonly">编辑</span>
                <span class="editbtn"
                      v-else
                      @click="saveInfo('detailsInfo')">保存</span> -->
              </div>
              <el-form :model="detailsInfo"
                        ref="detailsInfo"
                        :rules="detailsRules">
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">关注来源</div>
                  <div class="read-only">{{formatSource(detailsInfo.source)}}</div>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">关注时间</div>
                  <div class="read-only">{{TimeTrans(detailsInfo.followTime)}}</div>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              prop="telephone"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">手机号</div>
                  <div class="read-only" v-if="readonly">{{detailsInfo.telephone}}</div>
                  <el-input v-model="detailsInfo.telephone"
                            placeholder="请输入内容"
                            v-else></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">性别</div>
                  <div v-if="readonly"
                        class="read-only">{{detailsInfo.sex === 'MALE' ? '男' : '女'}}</div>
                  <el-select v-model="detailsInfo.sex"
                              placeholder="请选择"
                              v-else>
                    <el-option v-for="item in sexOptions"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">会员生日</div>
                  <div v-if="readonly"
                        class="read-only">{{TimeTrans(detailsInfo.birthday)}}</div>
                  <el-date-picker v-else
                                  v-model="detailsInfo.birthday"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">当前积分</div>
                  <div v-if="readonly"
                        class="read-only">{{detailsInfo.score}}</div>
                  <el-input v-model="detailsInfo.score"
                            placeholder="请输入内容"
                            v-else></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" prop="totalScore">
                  <div class="cttitle">累计积分</div>
                  <div v-if="readonly"
                        class="read-only">{{detailsInfo.totalScore}}</div>
                  <el-input v-model="detailsInfo.totalScore"
                            placeholder="请输入内容"
                            v-else></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">累计消费</div>
                  <div v-if="readonly"
                        class="read-only">{{detailsInfo.consume}}</div>
                  <el-input v-model="detailsInfo.consume"
                            placeholder="请输入内容"
                            v-else></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">订单完成量</div>
                  <div v-if="readonly"
                        class="read-only">{{detailsInfo.orderNum}}</div>
                  <el-input v-model="detailsInfo.orderNum"
                            placeholder="请输入内容"
                            v-else></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">居住地址</div>
                  <div v-if="readonly"
                        class="read-only">{{detailsInfo.address}}</div>
                  <el-input v-model="detailsInfo.address"
                            placeholder="请输入内容"
                            v-else></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!readonly" slot="footer" class="dialog-footer">
        <el-button @click="onHide" class="close-button">关 闭</el-button>
        <el-button @click="editMember" type="primary" class="defaultbtn dialog-confirmBtn">确 认</el-button>
      </div>
    </drawer>
  </div>
</template>
<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
export default {
  components: {
    Drawer
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    detailsInfo: {
      type: Object
    }
  },
  data () {
    return {
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      occurTime: '',
      description: '',
      organizeDTO: [],
      drawerTitle: '会员档案',
      activeName: 'first',
      readonly: true,
      secondReadonly: true,
      dynamicdialogVisible: false,
      resignationdialogVisible: false,
      inputDisable: false,
      activeReset: false,
      resignaDate: '',
      value: '',
      formLabelWidth: '',
      detailsInfoName: '',
      formOpenact: {},
      options: [{
        value: '选项1',
        label: '黄金糕'
      }],
      sexOptions: [
        { name: '男', value: 'MALE' },
        { name: '女', value: 'FEMALE' }
      ],
      documentTypeOptions: [],
      natureWorkOptions: [],
      positiveStateOptions: [
        {
          name: '试用期',
          value: 'PROBATION'
        },
        {
          name: '正式',
          value: 'TURNPOSITIVE'
        }
      ],
      trialCycleOptions: [],
      organizationOptions: [],
      postOptions: [],
      locationOptions: [],
      companyOptions: [],
      nationalityOptions: [],
      newCompanyDialog: false,
      newPlaceDialog: false,
      regulardialogVisible: false,
      companyName: '',
      locationName: '',
      resignaOptions: [],
      quitData: {
        resignaId: '',
        resignaDate: '',
        resignaReason: ''
      },
      regularData: {
        regularDate: '',
        regularReason: ''
      },
      detailsRules: {
        totalScore: [
          { required: true, message: '请输入累计积分', trigger: 'blur' }
        ],
        telephone: [
          { required: true, pattern: /^1[23456789]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    detailsdrawershow: {
      handler: function () {
        this.activeReset = false
      }
    },
    detailsInfo: {
      handler: function () {
        if (this.activeReset) {
          this.activeName = 'third'
        } else {
          this.activeName = 'first'
        }
      }
    }
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    onEdit () {
      this.readonly = false
    },
    onHide () {
      this.$emit('drawerClose', false)
      this.$emit('query', false)
      this.readonly = true
    },
    deleteLabel (item, index) {
      this.detailsInfo.memberLabels.splice(index, 1)
    },
    async turnpositive () {
    },
    handleClick () {
    },
    formatSource (val) {
      let res = ''
      if (val === 'MANUAL') {
        res = '手动录入'
      } else if (val === 'WECHATPUBLIC') {
        res = '微信公众号'
      }
      return res
    },
    TimeTrans (val) {
      if (val) {
        return val.substring(0, 10)
      }
      return ''
    },
    async imageChange (event) {
      this.errorField = false
      let path = ''
      let files = event.target.files
      if (files.length > 0) {
        if (files[0].size > (1024 * 1024 * 3) || (files[0].type !== 'image/png' && files[0].type !== 'image/jpeg')) {
          this.errorField = true
          this.errorTip = '上传图片格式不正确'
          return
        }
        let form = new FormData()
        form.append('file', files[0])
        context.http.post('/ywm/api/image-multipart', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          path = res.data
          this.detailsInfo.headImage = path
        }).catch(error => {
          console.info(error)
        })
      }
    },
    async saveInfo (formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let putData = JSON.parse(JSON.stringify(this.detailsInfo))
          putData.userPostManagements.forEach(ele => {
            let organizeId = ele.organizeId[(ele.organizeId.length) - 1]
            delete ele.organizeId
            ele.organize = { id: organizeId }
          })
          context.http.put('uaa/api/users', putData).then(res => {
            if (res.data) {
              _this.onHide()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async resignation (formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let putData = { id: this.detailsInfo.id, resignaDate: this.quitData.resignaDate, resignaId: this.quitData.resignaId, resignaReason: this.quitData.resignaReason }
          context.http.put('uaa/api/users/resignation', putData).then(res => {
            if (res.data) {
              _this.resignationdialogVisible = false
              this.onHide()
              this.quitData = { resignaId: '', resignaDate: '', resignaReason: '' }
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async regular (formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let putData = { id: this.detailsInfo.id, sjPositiveDate: this.regularData.regularDate, positiveReason: this.regularData.regularReason }
          context.http.put('uaa/api/users/turnpositive', putData).then(res => {
            if (res.data) {
              _this.regulardialogVisible = false
              this.onHide()
              this.regularData = { sjPositiveDate: '', positiveReason: '' }
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async documentType () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=证件类型')
      this.documentTypeOptions = result.data
    },
    async nationality () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=国籍')
      this.nationalityOptions = result.data
    },
    async trialCycle () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=试用期')
      this.trialCycleOptions = result.data
    },
    async natureWork () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=工作性质')
      this.natureWorkOptions = result.data
    },
    async resigna () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=离职原因')
      this.resignaOptions = result.data
    },
    editMember () {
      this.$refs['detailsInfo'].validate((valid) => {
        if (valid) {
          context.http.put('/crm/api/members', this.detailsInfo).then(res => {
            if (res.status === 200) {
              this.onHide()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
.mainlayout {
  width: 800px;
  .main-content {
    padding: 0 40px;
    .membershipFiles {
      height: 100%;
      .head {
        border-bottom: 1px solid #f0f2f3;
        background-color: #ffffff;
        border-radius: 4px;
        -moz-box-shadow: 0px 1px 8px #e5e5e5;
        -webkit-box-shadow: 0px 1px 8px #e5e5e5;
        box-shadow: 0px 1px 8px #e5e5e5;
        height: 140px;
        .head-portrait {
          width: 100px;
          height: 100px;
          border: 1px solid #f0f2f3;
          border-radius: 50%;
          margin: 28px 28px 0 40px;
          position: relative;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
          input {
            position: absolute;
            top: 0;
            right: 0;
            width: 100px;
            height: 100px;
            opacity: 0;
            cursor: pointer;
          }
        }
        .default-hportrait {
          background-color: #409eff;
          line-height: 90px;
          text-align: center;
          color: #fff;
        }
        .infomation {
          padding-top: 28px;
          p:nth-of-type(1) {
            font-size: 16px;
            span {
              display: inline-block;
              width: 70px;
              height: 26px;
              line-height: 24px;
              border-radius: 16px;
              text-align: center;
              font-size: 14px;
              background-color: #fff8ef;
              color: #e99a56;
              border: 1px solid #e99a56;
              margin-left: 16px;
            }
          }
          p:nth-of-type(2) {
            margin: 10px 0;
            color: #666;
            font-size: 14px;
            .verticalline {
              display: inline-block;
              width: 1px;
              height: 10px;
              border: 1px solid #cccccc;
              margin: 0 10px;
            }
          }
          p:last-child {
            color: #666;
            font-size: 14px;
            span {
              color: #000;
            }
          }
          .label-item{
            display: inline-block;
            width: 70px;
            height: 30px;
            line-height: 30px;
            background-color: #0074db;
            color: #fff!important;
            text-align: center;
            border-radius: 4px;
            font-size: 12px;
          }
        }
        .morebtn {
          width: 80px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          background-color: #65ac69;
          color: #fff;
          border-radius: 4px;
          margin: 80px 10px 0 0;
          cursor: pointer;
        }
      }
      .el-tabs {
        // background-color: #fff;
        // margin-top: 20px;
      }
      .el-tabs__header {
        background-color: #fff;
        box-shadow: 0px 1px 8px #e5e5e5;
      }
      .el-tabs__item {
        width: 200px;
        text-align: center;
      }
      .el-tab-pane {
        background-color: #fff;
        height: 100%;
      }
      .el-tabs__content {
        height: 80%;
        border-radius: 4px;
        -moz-box-shadow: 0px 1px 8px #e5e5e5;
        -webkit-box-shadow: 0px 1px 8px #e5e5e5;
        box-shadow: 0px 1px 8px #e5e5e5;
      }
      .personal-info {
        margin-top: 20px;
        border: 1px solid #e7e7e7;
        .pi-head {
          font-size: 12px;
          height: 30px;
          line-height: 30px;
          padding-left: 20px;
          background-color: #fafafa;
          border-bottom: none;
        }
        .editbtn {
          display: inline-block;
          width: 60px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          color: #0f75ff;
          background-color: #fff;
          border: 1px solid #0f75ff;
          border-radius: 4px;
          cursor: pointer;
          float: right;
          margin: 10px 10px 0 0;
          font-size: 14px;
          &:hover {
            color: #fff;
          }
        }
        .adddynamicbtn {
          width: auto;
          border: 1px solid #0f75ff;
          border-radius: 4px;
          color: #0f75ff;
          cursor: pointer;
          font-size: 12px;
          padding: 2px 6px;
          margin-left: 20px;
        }
        .el-form {
          padding: 30px;
        }
        .el-form-item {
          width: 30%;
          margin-right: 25px;
          &:nth-of-type(3n) {
            margin-right: 0;
          }
          .cttitle {
            color: #7085a1;
            font-size: 12px;
            margin-bottom: 10px;
            i {
              font-style: normal;
              color: red;
              vertical-align: sub;
            }
            span:nth-of-type(2) {
              float: right;
            }
          }
          .el-select {
            width: 100%;
          }
        }
        .dynamic-content {
          margin: 40px;
          .steps-warp {
            .steps {
              min-height: 70px;
              padding-left: 30px;
              display: flex;
              justify-content: flex-start;
              border-left: 1px solid #eeefef;
              font-size: 14px;
              &:last-child {
                height: auto;
                min-height: auto;
                border: none;
              }
              &:before {
                content: "";
                display: inline-block;
                width: 10px;
                height: 10px;
                background-color: #cbcccd;
                border-radius: 50%;
                position: relative;
                left: -35px;
                top: 1px;
              }
              div:nth-of-type(2) {
                margin-left: 40px;
              }
            }
          }
        }
        .cttitle {
          span {
            color: #0f75ff;
            font-size: 12px;
            float: right;
            cursor: pointer;
          }
          .postTips {
            color: #666;
            float: none;
            margin-left: 6px;
          }
          .el-checkbox {
            margin-left: 6px;
            span {
              float: none !important;
              color: #666;
              margin-left: 0;
            }
          }
        }
      }
    }
  }
  .el-form-item__content {
    width: 100%;
    display: inline-block;
    // height: 91px;
    vertical-align: bottom;
    .read-only {
      height: 40px;
      width: 190px;
    }
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  .regularTips {
    background-color: #ecfafa;
    font-size: 12px;
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    span {
      float: right;
      color: #0f75ff;
      padding-right: 20px;
      cursor: pointer;
    }
  }
}
</style>

