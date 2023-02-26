<template>
  <div class="activityNoticeDetails">
    <drawer class="drawer_new"
            :show="showDrawer"
            :showEditBtn="readOnly && hasAuthority('02030607')"
            :title="drawerTitle"
            @on-edit="onEdit"
            @on-hide="onHide">
      <div class="details_content drawer-body"
           slot="drawer">
        <div class="main_content addGoodsDialog"
             :class="{'readOnly':readOnly}">
          <div class="half_page_title"
               style="width:100%">
            <div><i></i>基本信息</div>
          </div>
          <div>
            <el-form :model="detailsData"
                     :rules="addFlowRules"
                     ref="detailsData">
              <div class="content">
                <el-form-item prop="activityName">
                  <span>活动名称<i class="required">*</i></span>
                  <p v-if="readOnly">{{detailsData.activityName}}</p>
                  <el-input v-model="detailsData.activityName"
                            v-else
                            style="width:100%"
                            maxlength="20"
                            size="small"></el-input>
                </el-form-item>
                <el-form-item prop="startDate">
                  <span>活动时间<i class="required">*</i></span>
                  <p v-if="readOnly">{{detailsData.startDate}} ~ {{detailsData.endDate}}</p>
                  <el-date-picker v-model="timePicker"
                                  v-else
                                  @change="timePickerChange"
                                  style="width:100%"
                                  type="daterange"
                                  size="small"
                                  value-format="yyyy-MM-dd"
                                  range-separator="-"
                                  start-placeholder="开始日期"
                                  end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item prop="projectManagementId">
                  <span>所属项目<i class="required">*</i></span>
                  <p v-if="readOnly">{{detailsData.projectManagementName}}</p>
                  <el-select v-model="detailsData.projectManagementId"
                             v-else
                             style="width:100%"
                             size="small">
                    <el-option v-for="(item,index) in projectManagementsList"
                               :key="index"
                               :label="item.referred"
                               :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <span>是否在首页显示<i class="required">*</i></span>
                  <el-switch v-model="detailsData.topFlg"
                             :disabled="readOnly"
                             active-color="#13ce66"
                             inactive-color="#ff4949">
                  </el-switch>
                </el-form-item>
                <el-form-item prop="image"
                              style="width:100%">
                  <span>宣传图<i class="required">*</i></span>
                  <el-input v-model="detailsData.image"
                            style="display:none"></el-input>
                  <aliUpload class="aliUpload deviceDetails aliUpload_new"
                             style="width:140px;height:120px"
                             :upLoadText="upLoadText_cost"
                             :fileType="fileType_cost"
                             :fileSize="fileSize"
                             :iconShow="false"
                             :iconImg="iconImg"
                             :uploadIcon="true"
                             v-if="!detailsData.image"
                             @setAnnex="setAnnex" />
                  <div v-else
                       style="width:140px;height:120px"
                       class="imgBox imgBoxModel">
                    <img :src="detailsData.image"
                         @click="showImg(detailsData.image)"
                         class="logoImg">
                    <div @click="showImg(detailsData.image)"
                         class="bottomTips">预览图片</div>
                    <div class="iconfont icon-cms_cuowu deleteImg"
                         v-if="!readOnly"
                         @click="deleLogo"></div>
                  </div>
                  <div class="tips">（建议尺寸：<i class="required">694＊270</i>像素；支持格式JPG,PNG，大不于2M）</div>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
      </div>
      <div slot="footer"
           v-if="!readOnly"
           class="dialog-footer">
        <span @click="cannel"
              class="details_cannelBtn"
              style="background:none">取消</span>
        <span class="saveSubmit"
              @click="save()">保存</span>
      </div>
    </drawer>
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
  </div>
</template>

<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import aliUpload from '@/components/aliUpload.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import axios from 'axios'
import * as JSOG from 'jsog'
export default {
  name: 'activityNoticeDetails',
  components: {
    Drawer,
    picturePrevie,
    aliUpload
  },
  props: {
    showDrawer: {
      type: Boolean,
      default: false
    },
    detailsData: {
      type: Object,
      default: {}
    }
  },
  created () {
    this.projectManagementsList = this.$store.state.projectManagementsList
  },
  watch: {
    showDrawer: {
      handler (newValue, oldValue) {
        if (newValue) {

        }
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    var cheackCoverImg = (rule, value, callback) => {
      if (!value || value === '') {
        return callback(new Error('请上传宣传图片'))
      } else {
        callback()
      }
    }
    return {
      timePicker: [],
      projectManagementsList: [],
      iconImg: 'icon-shangchuantupianicon',
      upLoadText_cost: '上传图片',
      fileType_cost: ['png', 'jpg'],
      fileSize: 2,
      showDetails: false,
      showPicture: false,
      imgArr: [],
      num: 0,
      addFlowRules: {
        activityName: [
          { required: true, message: '请输入活动名称', trigger: 'blue' }
        ],
        startDate: [
          { required: true, message: '请选择活动时间', trigger: 'change' }
        ],
        projectManagementId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        image: [
          { validator: cheackCoverImg, trigger: 'change' }
        ]
      },
      readOnly: true,
      projectManagementId: '',
      value: '',
      drawerTitle: '活动详情'
    }
  },
  mounted () {

  },
  methods: {
    pictureClose () {
      this.showPicture = false
    },
    timePickerChange (timeArr) {
      if (timeArr.length) {
        this.detailsData.startDate = timeArr[0]
        this.detailsData.endDate = timeArr[1]
      } else {
        this.detailsData.startDate = ''
        this.detailsData.endDate = ''
      }
    },
    cannel () {
      this.readOnly = true
      this.$emit('cannel', this.detailsData.id)
    },
    deleLogo () {
      this.detailsData.image = ''
    },
    setAnnex (annexURL, annexName) {
      this.$set(this.detailsData, 'image', annexURL)
    },
    onEdit () {
      this.readOnly = false
      this.timePicker = [new Date(this.detailsData.startDate), new Date(this.detailsData.endDate)]
    },
    save () {
      this.$refs['detailsData'].validate((valid) => {
        if (valid) {
          context.http.put('/cms/api/activityNotice', this.detailsData).then(res => {
            if (res.status === 201 || res.status === 200) {
              this.$message.success('修改成功')
              this.$emit('query')
              this.onHide()
            }
          }).catch(error => {
            console.info(error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showImg (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    onHide () {
      this.$refs['detailsData'].resetFields()
      this.readOnly = true
      this.$emit('drawerClose')
    }
  }
}
</script>
<style lang="scss" scoped>
.activityNoticeDetails {
  .main_content {
    height: calc(100% - 80px); //根据实际页面需求设置高度 实现内容滚动
    padding: 0 !important;
    &.readOnly {
      height: 100%;
    }
    &.addGoodsDialog {
      .slotfooter {
        .save {
          margin-right: 12px;
          height: 32px;
          line-height: 32px;
          color: #3577f6;
          border: 1px solid #3577f6;
          background: rgba(53, 119, 246, 0.05);
        }
      }
      .el-form {
        .content {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          padding: 15px;
          width: 100%;
          .el-form-item {
            width: 30%;
            .el-form-item__content {
              > span {
                margin-bottom: 5px;
                display: inline-block;
                height: 25px;
                display: -ms-flexbox;
                display: flex;
                -ms-flex-align: center;
                align-items: center;
                font-size: 14px;
                color: #777777;
              }
              > p {
                color: #262626;
                font-size: 12px;
                height: 40px;
                line-height: 40px;
              }
              .tips {
                font-size: 12px;
                color: #999999;
                margin-top: 10px;
              }
              // .imgBox {
              //   width: 140px;
              //   height: 120px;
              //   position: relative;
              //   background: rgba(255, 255, 255, 1);
              //   border: 1px solid rgba(234, 234, 234, 1);
              //   border-radius: 4px;
              //   > .bottomTips {
              //     height: 25px;
              //     position: absolute;
              //     left: 0px;
              //     bottom: 0px;
              //     width: 140px;
              //     background-color: #fdffff;
              //     display: flex;
              //     align-items: center;
              //     font-size: 12px;
              //     justify-content: space-between;
              //     padding: 0 5px;
              //     > span {
              //       display: inline-block;
              //       width: 60%;
              //       overflow: hidden;
              //       text-overflow: ellipsis;
              //       white-space: nowrap;
              //       padding: 0 5px;
              //     }
              //     > i {
              //       cursor: pointer;
              //     }
              //   }
              // }
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.activityNoticeDetails {
  .dialog-footer {
    > span {
      display: inline-block;
      color: #777777;
      height: 34px;
      line-height: 34px;
      text-align: center;
      padding: 0 21px;
      cursor: pointer;
      background: rgba(243, 244, 250, 1);
      border-radius: 4px;
      margin-left: 10px;
      &.closeBtn {
      }
      &.saveBtn {
        border: 1px solid rgba(53, 117, 246, 1);
        color: #3575f6;
      }
      &.saveSubmit,
      &.passBtn {
        background: rgba(53, 117, 246, 1);
        color: #fff;
      }
      &.rejectBtn {
        color: #e0434e;
        background: rgba(253, 235, 237, 1);
        border: 1px solid #c1bdbd;
      }
    }
  }
  .details_content {
    width: 830px;
    // height: calc(100% - 80px) !important;
    height: 100%;
  }
}
</style>
