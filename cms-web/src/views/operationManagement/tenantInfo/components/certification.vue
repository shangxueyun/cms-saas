<template>
  <div class="certification">
    <div class="content">
      <el-form
        :model="detailsData"
        :rules="detailsDataRulese"
        ref="detailsData"
        style="padding: 0"
      >
        <div class="item">
          <div class="info">
            <p class="title">营业执照</p>
            <div class="content">
              <div>
                <span>证件号码<i class="required">*</i></span>
                <div>
                  <span v-if="readOnly">{{
                    detailsData.BUSINESS_LICENSE.iDNumber
                  }}</span>
                  <el-form-item prop="BUSINESS_LICENSE.iDNumber" v-else>
                    <el-input
                      size="small"
                      v-model="detailsData.BUSINESS_LICENSE.iDNumber"
                    ></el-input>
                  </el-form-item>
                </div>
              </div>
              <div>
                <span>证件有效期</span>
                <div>
                  <span v-if="readOnly">{{
                    detailsData.BUSINESS_LICENSE.termValidity
                  }}</span>
                  <el-form-item v-else>
                    <el-date-picker
                      v-model="detailsData.BUSINESS_LICENSE.termValidity"
                      size="small"
                      placeholder="请选择"
                      value-format="yyyy-MM-dd"
                      style="width: 100%"
                      type="date"
                    >
                    </el-date-picker>
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
          <div class="imgDiv">
            <img
              v-if="detailsData.BUSINESS_LICENSE.imgUrl"
              :src="detailsData.BUSINESS_LICENSE.imgUrl"
              @click="showImg(detailsData.BUSINESS_LICENSE.imgUrl)"
              alt=""
            />
            <i
              class="iconfont icon-cms_cuowu"
              v-if="!readOnly && detailsData.BUSINESS_LICENSE.imgUrl"
              @click="deleImg('BUSINESS_LICENSE')"
            ></i>
            <aliUpload
              v-if="!readOnly && !detailsData.BUSINESS_LICENSE.imgUrl"
              class="aliUpload deviceDetails"
              :upLoadText="upLoadText_cost"
              :fileType="fileType_cost"
              :fileSize="fileSize"
              :iconShow="false"
              :iconImg="iconImg"
              :uploadIcon="true"
              @setAnnex="setAnnex1"
            />
          </div>
        </div>
        <div class="item">
          <div class="info">
            <p class="title">食品经营许可证</p>
            <div class="content">
              <div>
                <span>证件号码</span>
                <div>
                  <span v-if="readOnly">{{
                    detailsData.FOOD_BUSINESS_LICENSE.iDNumber
                  }}</span>
                  <!-- <el-form-item prop="FOOD_BUSINESS_LICENSE.iDNumber" -->
                  <el-form-item v-else>
                    <el-input
                      size="small"
                      v-model="detailsData.FOOD_BUSINESS_LICENSE.iDNumber"
                    ></el-input>
                  </el-form-item>
                </div>
              </div>
              <div>
                <span>证件有效期</span>
                <div>
                  <span v-if="readOnly">{{
                    detailsData.FOOD_BUSINESS_LICENSE.termValidity
                  }}</span>
                  <!-- <el-form-item prop="FOOD_BUSINESS_LICENSE.termValidity" -->
                  <el-form-item v-else>
                    <el-date-picker
                      v-model="detailsData.FOOD_BUSINESS_LICENSE.termValidity"
                      size="small"
                      placeholder="请选择"
                      value-format="yyyy-MM-dd"
                      style="width: 100%"
                      type="date"
                    >
                    </el-date-picker>
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
          <div class="imgDiv">
            <img
              v-if="detailsData.FOOD_BUSINESS_LICENSE.imgUrl"
              :src="detailsData.FOOD_BUSINESS_LICENSE.imgUrl"
              @click="showImg(detailsData.FOOD_BUSINESS_LICENSE.imgUrl)"
              alt=""
            />
            <i
              class="iconfont icon-cms_cuowu"
              v-if="!readOnly && detailsData.FOOD_BUSINESS_LICENSE.imgUrl"
              @click="deleImg('FOOD_BUSINESS_LICENSE')"
            ></i>
            <aliUpload
              v-if="!readOnly && !detailsData.FOOD_BUSINESS_LICENSE.imgUrl"
              class="aliUpload deviceDetails"
              :upLoadText="upLoadText_cost"
              :fileType="fileType_cost"
              :fileSize="fileSize"
              :iconShow="false"
              :iconImg="iconImg"
              :uploadIcon="true"
              @setAnnex="setAnnex2"
            />
          </div>
        </div>
        <div class="item">
          <div class="info">
            <p class="title">从业人员健康证</p>
            <div class="content">
              <div>
                <span>证件号码</span>
                <div>
                  <span v-if="readOnly">{{
                    detailsData.HEALTH_CERTIFICATE.iDNumber
                  }}</span>
                  <!-- <el-form-item prop="HEALTH_CERTIFICATE.iDNumber" -->
                  <el-form-item v-else>
                    <el-input
                      size="small"
                      v-model="detailsData.HEALTH_CERTIFICATE.iDNumber"
                    ></el-input>
                  </el-form-item>
                </div>
              </div>
              <div>
                <span>证件有效期</span>
                <div>
                  <span v-if="readOnly">{{
                    detailsData.HEALTH_CERTIFICATE.termValidity
                  }}</span>
                  <!-- <el-form-item prop="HEALTH_CERTIFICATE.termValidity" -->
                  <el-form-item v-else>
                    <el-date-picker
                      v-model="detailsData.HEALTH_CERTIFICATE.termValidity"
                      size="small"
                      placeholder="请选择"
                      value-format="yyyy-MM-dd"
                      style="width: 100%"
                      type="date"
                    >
                    </el-date-picker>
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
          <div class="imgDiv">
            <img
              v-if="detailsData.HEALTH_CERTIFICATE.imgUrl"
              :src="detailsData.HEALTH_CERTIFICATE.imgUrl"
              @click="showImg(detailsData.HEALTH_CERTIFICATE.imgUrl)"
              alt=""
            />
            <i
              class="iconfont icon-cms_cuowu"
              v-if="!readOnly && detailsData.HEALTH_CERTIFICATE.imgUrl"
              @click="deleImg('HEALTH_CERTIFICATE')"
            ></i>
            <aliUpload
              v-if="!readOnly && !detailsData.HEALTH_CERTIFICATE.imgUrl"
              class="aliUpload deviceDetails"
              :upLoadText="upLoadText_cost"
              :fileType="fileType_cost"
              :fileSize="fileSize"
              :iconShow="false"
              :iconImg="iconImg"
              :uploadIcon="true"
              @setAnnex="setAnnex3"
            />
          </div>
        </div>
        <div class="item">
          <div class="info">
            <p class="title">衡器鉴定证书</p>
            <div class="content">
              <div>
                <span>证件号码</span>
                <div>
                  <span v-if="readOnly">{{
                    detailsData.WEIGHING_APPARATUS.iDNumber
                  }}</span>
                  <el-form-item v-else>
                    <el-input
                      size="small"
                      v-model="detailsData.WEIGHING_APPARATUS.iDNumber"
                    ></el-input>
                  </el-form-item>
                </div>
              </div>
              <div>
                <span>证件有效期</span>
                <div>
                  <span v-if="readOnly">{{
                    detailsData.WEIGHING_APPARATUS.termValidity
                  }}</span>
                  <el-form-item v-else>
                    <el-date-picker
                      v-model="detailsData.WEIGHING_APPARATUS.termValidity"
                      size="small"
                      placeholder="请选择"
                      value-format="yyyy-MM-dd"
                      style="width: 100%"
                      type="date"
                    >
                    </el-date-picker>
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="info">
            <p class="title">肉菜流通服务卡号</p>
            <div class="content">
              <div>
                <span>
                  <span v-if="readOnly">
                    <span v-for="(item, index) in numberVal" :key="index">
                      <span class="content_num">{{ item }}</span>
                    </span>
                  </span>
                  <div v-else>
                    <span v-for="(item, index) in numberVal" :key="index">
                      <span>{{ item }}</span>
                      <i
                        class="iconfont icon-cms_cuowu"
                        @click="delnul(index)"
                        v-if="item"
                      ></i>
                    </span>
                  </div>
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div class="form_save_btns" v-if="!readOnly">
      <span @click="cannel">取消</span>
      <span @click="save('detailsData')">保存</span>
    </div>
    <picturePrevie
      v-if="showPicture"
      :imgList="imgArr"
      :num="num"
      @pictureClose="pictureClose"
    ></picturePrevie>
  </div>
</template>
<script>
import context from '@/service'
import aliUpload from '@/components/aliUpload.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import { decrypt } from '@/utils/validate'
export default {
  name: 'businessInfor',
  components: {
    aliUpload,
    picturePrevie
  },
  props: {
    tenantDetail: {
      type: Object,
      default: {}
    },
    tabActive: {
      type: Number,
      default: 0
    }
  },
  watch: {
    tabActive: {
      handler: function (val, oldVal) {
        if (this.tenantDetail.qualifiedDTOS.length) {
          this.tenantDetail.qualifiedDTOS.map(val => {
            if (val.qualifiedType === 'BUSINESS_LICENSE') {
              this.detailsData.BUSINESS_LICENSE = val
            }
            if (val.qualifiedType === 'FOOD_BUSINESS_LICENSE') {
              this.detailsData.FOOD_BUSINESS_LICENSE = val
            }
            if (val.qualifiedType === 'HEALTH_CERTIFICATE') {
              this.detailsData.HEALTH_CERTIFICATE = val
            }
            if (val.qualifiedType === 'WEIGHING_APPARATUS') {
              this.detailsData.WEIGHING_APPARATUS = val
            }
            if (val.qualifiedType === 'MEAT_CARD') {
              this.detailsData.MEAT_CARD = val
              let numVal = this.detailsData.MEAT_CARD.iDNumber.split(',')
              this.numberVal = numVal.filter(val => {
                return val !== ''
              })
            }
          })
        }
      },
      immediate: true
    },
    tenantDetail: {
      handler: function (val, oldVal) {
        if (this.tenantDetail.qualifiedDTOS.length) {
          this.tenantDetail.qualifiedDTOS.map(val => {
            if (val.qualifiedType === 'BUSINESS_LICENSE') {
              this.detailsData.BUSINESS_LICENSE = val
            }
            if (val.qualifiedType === 'FOOD_BUSINESS_LICENSE') {
              this.detailsData.FOOD_BUSINESS_LICENSE = val
            }
            if (val.qualifiedType === 'HEALTH_CERTIFICATE') {
              this.detailsData.HEALTH_CERTIFICATE = val
            }
            if (val.qualifiedType === 'WEIGHING_APPARATUS') {
              this.detailsData.WEIGHING_APPARATUS = val
            }
            if (val.qualifiedType === 'MEAT_CARD') {
              this.detailsData.MEAT_CARD = val
              let numVal = this.detailsData.MEAT_CARD.iDNumber.split(',')
              this.numberVal = numVal.filter(val => {
                return val !== ''
              })
            }
          })
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      showPicture: false,
      imgArr: [],
      num: 0,
      readOnly: true,
      detailsData: {
        BUSINESS_LICENSE: { qualifiedType: 'BUSINESS_LICENSE', iDNumber: '', termValidity: '', imgUrl: '' },
        FOOD_BUSINESS_LICENSE: { qualifiedType: 'FOOD_BUSINESS_LICENSE', iDNumber: '', termValidity: '', imgUrl: '' },
        HEALTH_CERTIFICATE: { qualifiedType: 'HEALTH_CERTIFICATE', iDNumber: '', termValidity: '', imgUrl: '' },
        WEIGHING_APPARATUS: { qualifiedType: 'WEIGHING_APPARATUS', iDNumber: '', termValidity: '', imgUrl: '' },
        MEAT_CARD: { qualifiedType: 'MEAT_CARD', iDNumber: '' }
      },
      numberVal: [],
      detailsDataRulese: {
        'BUSINESS_LICENSE.iDNumber': [
          { required: true, message: '请输入证件号码', trigger: 'blur' }
        ],
        'FOOD_BUSINESS_LICENSE.iDNumber': [
          { required: false, message: '请输入证件号码', trigger: 'blur' }
        ],
        'HEALTH_CERTIFICATE.iDNumber': [
          { required: false, message: '请输入证件号码', trigger: 'blur' }
        ],
        'WEIGHING_APPARATUS.iDNumber': [
          { required: true, message: '请输入证件号码', trigger: 'blur' }
        ],
        'BUSINESS_LICENSE.termValidity': [
          { required: true, message: '请选择证件有效期', trigger: 'blur' }
        ],
        'FOOD_BUSINESS_LICENSE.termValidity': [
          { required: false, message: '请选择证件有效期', trigger: 'blur' }
        ],
        'HEALTH_CERTIFICATE.termValidity': [
          { required: false, message: '请选择证件有效期', trigger: 'blur' }
        ],
        'WEIGHING_APPARATUS.termValidity': [
          { required: true, message: '请选择证件有效期', trigger: 'blur' }
        ]
      },
      fileSize: 3,
      fileType_cost: ['png', 'jpg'],
      iconImg: 'icon-shangchuantupianicon',
      upLoadText_cost: '上传图片'
    }
  },

  created () {
    console.log(this.tenantDetail)
  },
  mounted () {

  },
  methods: {
    decryptMsg (val) {
      return decrypt(val)
    },
    pictureClose () {
      this.showPicture = false
    },
    showImg (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
      console.log(this.imgArr)
    },
    save (formName) {
      if (!this.detailsData.BUSINESS_LICENSE.imgUrl) {
        this.$message.error('请上传营业执照')
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = this.tenantDetail
          params.qualifiedDTOS = []
          params.qualifiedDTOS.push(this.detailsData.BUSINESS_LICENSE,
            this.detailsData.FOOD_BUSINESS_LICENSE,
            this.detailsData.HEALTH_CERTIFICATE,
            this.detailsData.WEIGHING_APPARATUS,
            this.detailsData.MEAT_CARD,
          )
          if (this.tenantDetail.iDNumber) {
            params.iDNumber = this.decryptMsg(this.tenantDetail.iDNumber)
          }
          context.http.put('cms/api/tenant', params).then(res => {
            if (res.status === 200 || res.status === 201) {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.readOnly = true
              this.$emit('handleEdit', 0, this.tenantDetail)
            }
          })
        } else {
          console.log('fail!')
          return false
        }
      })
    },
    cannel () {
      this.readOnly = true
      this.$emit('handleEdit', 0, this.tenantDetail)
    },
    handlerEdit5 () {
      this.readOnly = false
    },
    deleImg (type) {
      this.detailsData[type].imgUrl = ''
    },
    setAnnex1 (annexURL, annexName) {
      this.detailsData.BUSINESS_LICENSE.imgUrl = annexURL
    },
    setAnnex2 (annexURL, annexName) {
      this.detailsData.FOOD_BUSINESS_LICENSE.imgUrl = annexURL
    },
    setAnnex3 (annexURL, annexName) {
      this.detailsData.HEALTH_CERTIFICATE.imgUrl = annexURL
    },
    delnul (index) {
      // let _this = this
      // this.$confirm('确认删除已绑定肉菜流通服务卡?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      this.numberVal.splice(index, 1)
      this.detailsData.MEAT_CARD.iDNumber = this.numberVal.toString()
        // this.$message({
        //   type: 'success',
        //   message: '删除成功!'
        // })
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   })
      // })
    }
  }
}
</script>
<style lang="scss">
.certification {
  .deviceDetails .oss_file {
    background-color: #f7f9fd;
    border: 1px solid #eaeaea;
    > span {
      bottom: 0px;
    }
    > .iconfont {
      top: -5px;
    }
  }
}
</style>
<style lang="scss" scoped>
.certification {
  height: calc(100% - 50px);
  overflow: auto;
  .form_save_btns {
    position: absolute;
    right: 15px;
    bottom: 25px;
  }
  > .content {
    padding: 20px 15px;
    .el-form {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .item {
        display: flex;
        width: 45%;
        justify-content: space-between;
        margin-bottom: 80px;
        .info {
          width: 300px;
          .title {
            color: #262626;
            font-size: 16px;
            font-weight: bold;
          }
          .content {
            font-size: 14px;
            color: #777777;
            > div {
              display: flex;
              margin-top: 16px;
              align-items: center;
              > span {
                margin-right: 15px;
                width: 80px;
                > span {
                  width: 120px;
                  > span {
                    ::after {
                      content: ",";
                      margin-left: 1px;
                      font-size: 12px;
                    }
                  }
                  :last-child {
                    ::after {
                      content: "";
                      margin-left: 1px;
                      font-size: 12px;
                    }
                  }
                }
                div {
                  width: 300px;
                  height: 32px;
                  border-radius: 4px;
                  line-height: 32px;
                  border: 1px solid #dcdfe6;
                  > span {
                    position: relative;
                    > span {
                      margin: 0 5px;
                    }
                    > span::after {
                      content: ",";
                    }
                    > span:last-child {
                      // color: red;
                    }
                    i {
                      position: absolute;
                      top: -12px;
                      cursor: pointer;
                      right: -6px;
                    }
                  }
                  > span:last-child {
                    > span::after {
                      content: " ";
                    }
                    i {
                      position: absolute;
                      top: -14px;
                      right: -8px;
                      cursor: pointer;
                    }
                  }
                }
              }
              > div {
                color: #262626;
                width: calc(100% - 100px);
                .el-form-item {
                  margin-bottom: 5px;
                }
                > span {
                  width: 100%;
                  display: inline-block;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
            }
          }
        }
        .imgDiv {
          position: relative;
          > img {
            width: 140px;
            height: 100px;
          }
          > .iconfont {
            position: absolute;
            right: -8px;
            top: -8px;
            cursor: pointer;
          }
          .aliUpload {
            width: 140px;
            height: 100px;
            .upLoadText {
              bottom: -20px;
            }
          }
        }
      }
    }
  }
}
</style>
