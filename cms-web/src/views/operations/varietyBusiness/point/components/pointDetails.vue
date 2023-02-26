<template>
  <div class="pointDetail">
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            @on-edit="onEdit"
            @on-hide="onHide">
      <div class="tenant-details details-content clearfix"
           slot="drawer"
           style="padding-bottom: 0">
        <div class="pointContent">
          <div class="leftPart">
            <div class="top">
              <div class="imgDIv">
                <span v-if="detailsData.useStatus === 'DISABLE'">已停用</span>
                <img v-if="detailsData.imgs.length<=0"
                     :src="berthImg"
                     alt=""
                     style="width:100%;height:100%">
                <el-carousel :autoplay="detailsData.useStatus === 'DISABLE' ? false : true"
                             v-else
                             height="140px"
                             width="190px">
                  <el-carousel-item v-for="item in detailsData.imgs"
                                    :key="item">
                    <img :src="detailsData.imgs.length>0?item:berthImg"
                         alt=""
                         style="max-width:190px;max-height:140px;">
                  </el-carousel-item>
                </el-carousel>
              </div>
              <div :title="detailsData.pointName"
                   class="actName">{{detailsData.pointName}}</div>
              <div :title="detailsData.pointCode"
                   class="actTime">{{detailsData.pointCode}}</div>
              <div class="projectName">{{detailsData.projectName}}</div>
              <span class="typeTips">{{detailsData.pointTypeName}}</span>
            </div>
          </div>
          <div class="rightPart">
            <div class="main_content">
              <div class="menuTab">
                <span :class="{'active':menuTab===1}"
                      @click="menuTabChange(1)">点位档案</span>
                <span :class="{'active':menuTab===2}"
                      @click="menuTabChange(2)">历史合同</span>
              </div>
              <div class="activityInfo"
                   v-if="menuTab===1">
                <p class="title">
                  <span>点位基本信息</span>
                  <span v-if="readOnly && hasAuthority('02030517')"
                        class="editBtn"
                        @click="onEdit">
                    <i data-v-9c1f67fc=""
                       aria-hidden="true"
                       class="icon icon-edit2"></i>
                    编辑
                  </span>
                </p>
                <el-form :model="detailsData"
                         :rules="addFlowRules"
                         ref="detailsData">
                  <div class="activityInfo_content">
                    <div class="item">
                      <span>项目<i class="required">*</i></span>
                      <el-form-item v-if="!readOnly"
                                    prop="projectId">
                        <el-select v-model="detailsData.projectId"
                                   placeholder="选择项目"
                                   style="width:300px"
                                   clearable>
                          <el-option v-for="item in projectManagement"
                                     :key="item.id"
                                     :label="item.referred"
                                     :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <p v-else
                         class="readOnlyTxt">{{detailsData.projectName}}</p>
                    </div>
                    <div class="item">
                      <span>点位编号<i class="required">*</i></span>
                      <el-form-item prop="pointCode"
                                    v-if="!readOnly">
                        <el-input maxlength="20"
                                  style="width:300px"
                                  v-model="detailsData.pointCode"
                                  type="text"
                                  @input.native="changeCode"></el-input>
                      </el-form-item>
                      <p v-else
                         class="readOnlyTxt">{{detailsData.pointCode}}</p>
                    </div>
                    <div class="item">
                      <span>点位名称<i class="required">*</i></span>
                      <el-form-item prop="pointName"
                                    v-if="!readOnly">
                        <el-input maxlength="20"
                                  style="width:300px"
                                  v-model="detailsData.pointName"></el-input>
                      </el-form-item>
                      <p v-else
                         class="readOnlyTxt">{{detailsData.pointName}}</p>
                    </div>
                    <div class="item">
                      <span>点位类型<i class="required">*</i></span>
                      <el-form-item prop="pointType"
                                    v-if="!readOnly">
                        <el-select v-model="detailsData.pointType"
                                   placeholder="点位类型"
                                   style="width:300px"
                                   clearable>
                          <el-option v-for="item in pointTypeOptions"
                                     :key="item.id"
                                     :label="item.value"
                                     :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <p v-else
                         class="readOnlyTxt">{{detailsData.pointTypeName}}</p>
                    </div>
                    <div class="item">
                      <span>点位描述</span>
                      <el-form-item v-if="!readOnly">
                        <el-input class="point-textarea"
                                  style="width:300px"
                                  v-model="detailsData.description"
                                  resize="none"
                                  maxlength="50"
                                  type="textarea">
                        </el-input>
                      </el-form-item>
                      <p v-else
                         class="readOnlyTxt">{{detailsData.description}}</p>
                    </div>
                    <div class="item">
                      <span>点位状态<i class="required">*</i></span>
                      <el-form-item prop="useStatus"
                                    v-if="!readOnly">
                        <el-select v-model="detailsData.useStatus"
                                   placeholder="点位状态"
                                   style="width:300px"
                                   clearable>
                          <el-option v-for="item in pointStatusOptions"
                                     :key="item.value"
                                     :label="item.label"
                                     :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <p v-else
                         class="readOnlyTxt">{{detailsData.useStatus === 'USING' ? '使用中' : '已停用'}}</p>
                    </div>

                  </div>
                  <div class="upLoadDiv">
                    <p>点位图片<span v-if="!readOnly">（{{detailsData.imgs.length}}/5）</span></p>
                    <div>
                      <div class="imgList"
                           v-for="(item,index) in detailsData.imgs"
                           :key="index"
                           v-if="!readOnly">
                        <div class="item">
                          <img :src="item"
                               alt=""
                               @click="showImg(item,index)">
                          <i class="el-icon-error"
                             @click="deleteFn(item,index)"></i>
                        </div>
                      </div>
                      <div class="imgList"
                           v-for="(item,index) in detailsData.imgs"
                           :key="index"
                           v-if="readOnly">
                        <div class="item">
                          <img :src="item"
                               alt=""
                               @click="showImg(item,index)">
                        </div>
                      </div>
                      <div class="upLoadComponents"
                           v-if="detailsData.imgs.length<5 && !readOnly">
                        <aliUpload class="aliUpload"
                                   :upLoadText="upLoadText"
                                   :fileType="fileType"
                                   :iconShow="false"
                                   @setAnnex="setAnnex" />
                      </div>
                    </div>
                  </div>
                </el-form>
                <div class="pointFooter">
                  <div class="btndiv"
                       style="display: flex; flex-direction: row-reverse;"
                       v-if="!readOnly">
                    <el-button type="primary"
                               style="width:100px;margin-left: 25px;"
                               @click="editSave('detailsData')">确认</el-button>
                    <el-button style="width:100px"
                               @click="onHide">取消</el-button>
                  </div>
                </div>

              </div>
              <div class="activityInfo table-info"
                   v-if="menuTab===2">
                <p class="title"><span>多经历史合同</span></p>
                <el-table :data="tableData"
                          style="width: 100%">
                  <el-table-column prop="contractNo"
                                   label="合同编号"
                                   align="center"></el-table-column>
                  <el-table-column width="200"
                                   label="合同周期"
                                   align="center">
                    <template slot-scope="scope">
                      <span>{{scope.row.startDate+'~'+scope.row.endDate}}</span>
                    </template>>
                  </el-table-column>
                  <el-table-column prop="tenant.referred"
                                   label="租赁人"
                                   align="center"></el-table-column>
                  <el-table-column prop="amount"
                                   label="租赁总额"
                                   align="center"></el-table-column>
                  <el-table-column label="操作"
                                   align="center">
                    <template slot-scope="scope">
                      <el-button @click="handleEdit(scope.$index, scope.row)"
                                 class="el-button--primary operation-btn"
                                 size="mini">查看</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </drawer>
    <!--图片预览-->
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
    <!--合同详情-->
    <contractDetails v-if="contractDetailsshow"
                     :detailsdrawershow="contractDetailsshow"
                     :detailData="builddetailsData"
                     :queryBillId="queryBillId"
                     :reductionData="reductionData"
                     @drawerClose="contractDetailsshow=false"
                     @handleEdit="handleEdit"
                     ref="billDetail" />
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import aliUpload from '@/components/aliUpload.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import contractDetails from '../../contract/components/contractDetails'
import Drawer from '@/components/drawer.vue'
import { error } from 'util'
import OSS from 'ali-oss'
export default {
  components: {
    Drawer,
    picturePrevie,
    aliUpload,
    contractDetails
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    detailsData: {
      type: Object,
      default: {}
    },
    projectManagement: {
      type: Array,
      default: []
    },
    pointTypeOptions: {
      type: Array,
      default: []
    },
    pointStatusOptions: {
      type: Array,
      default: []
    }
  },
  watch: {
  },
  data () {
    return {
      berthImg: require('../../../../../assets/berth-default.png'),
      menuTab: 1,
      showPicture: false,
      imgArr: [],
      num: [],
      fileType: ['png', 'jpg', 'jpeg'],
      upLoadText: '上传图片',
      readOnly: true,
      drawerTitle: '查看点位详情',
      addFlowRules: {
        projectId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        pointCode: [
          { required: true, message: '请填写点位编号', trigger: 'blur' }
        ],
        pointName: [
          { required: true, message: '请填写点位名称', trigger: 'blur' }
        ],
        pointType: [
          { required: true, message: '请选择点位类型', trigger: 'change' }
        ],
        useStatus: [
          { required: true, message: '请选择点位状态', trigger: 'change' }
        ]
      },
      tableData: [],
      builddetailsData: {},
      contractDetailsshow: false,
      queryBillId: '',
      reductionData: {}
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    changeCode () {
      this.$nextTick(() => {
        if (this.detailsData.pointCode) {
          this.detailsData.pointCode = this.detailsData.pointCode.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g, '')
        }
      })
    },
    handleEdit (index, row) {
      context.http.get('/cms/api/management-contracts/' + row.id).then(res => {
        this.builddetailsData = res.data
        this.contractDetailsshow = true
      })
    },
    editSave (formName) { // 编辑提交
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          context.http.put('/cms/api/management-points', this.detailsData).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '保存成功'
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
    menuTabChange (n) {
      if (n === 2) {
        this.getContracts()
      }
      this.menuTab = n
    },
    getContracts () {
      context.http.get('/cms/api/management-contracts/point?pointId=' + this.detailsData.id).then(res => {
        this.tableData = res.data
      })
    },
    deleteFn (item, index) {
      this.detailsData.imgs.splice(index, 1)
    },
    pictureClose () {
      this.showPicture = false
    },
    showImg (item, index) {
      let imgArr = []
      this.detailsData.imgs.forEach(item => {
        imgArr.push(item)
      })
      this.imgArr = imgArr
      this.num = index
      this.showPicture = true
    },
    setAnnex (annexURL) {  // 子组件上传成功返回文件url 和名字
      this.detailsData.imgs.push(annexURL)
    },
    onHide () {
      this.menuTab = 1
      this.readOnly = true
      this.$emit('drawerClose', false)
    },
    onEdit () {
      this.readOnly = false
    }
  }
}
</script>
<style lang="scss">
.pointDetail {
  .showImg {
    text-align: center;
  }
  .bigImg {
    width: auto;
    height: auto;
    max-width: 600px;
    max-height: 600px;
    min-width: 300px;
    min-height: 300px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
  .el-carousel__item {
    text-align: center;
  }
  .el-carousel__button {
    width: 5px;
    height: 5px;
    border-radius: 5px;
  }
  .oss_file {
    border: none !important;
    height: 100px;
    width: 100%;
    line-height: 150px;
    color: #3577f6;
    font-size: 12px;
  }
  .table-info {
    .el-table__header thead tr th {
      background: #fff;
    }
  }
  .point-textarea {
    textarea {
      height: 70px !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.pointDetail {
  width: 100%;
  height: 100%;
  .pointContent {
    width: 1000px;
    padding: 15px 20px;
    display: flex;
    flex-wrap: nowrap;
    position: relative;
    .item {
      flex-direction: column;
      > span {
        display: block;
        margin-bottom: 5px;
      }
      .readOnlyTxt {
        font-size: 12px;
        color: #999;
        height: 40px;
        line-height: 20px;
        width: 300px;
      }
    }
    .rightPart {
      min-height: 700px;
      // border: 1px solid #eee;
      width: 100%;
      padding-left: 220px;
      .main_content {
        .menuTab {
          height: 60px;
          line-height: 60px;
          box-shadow: 1px 1px 10px #eee;
          font-size: 12px;
          > span {
            display: inline-block;
            width: 100px;
            text-align: center;
            cursor: pointer;
            &.active {
              border-bottom: 2px solid #3175f6;
              color: #3175f6;
            }
          }
        }
        .costPart {
          margin-top: 50px;
          border: 1px solid #eeeeee;
          .title {
            height: 40px;
            line-height: 40px;
            padding-left: 15px;
            background-color: #f1f1f1;
            font-size: 14px;
            color: #666;
            justify-content: space-between;
            display: flex;
            padding-right: 15px;
            .addCost {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 88px;
              height: 28px;
              line-height: 28px;
              border: 1px solid #3175f6;
              color: #3175f6;
              border-radius: 5px;
              cursor: pointer;
              margin-top: 6px;
            }
          }
        }
        .planPart {
          margin-top: 50px;
          border: 1px solid #eeeeee;
          .title {
            height: 40px;
            line-height: 40px;
            padding-left: 15px;
            background-color: #f1f1f1;
            font-size: 14px;
            color: #666;
            justify-content: space-between;
            display: flex;
            padding-right: 15px;
            .addPlan {
              display: inline-block;
              width: 88px;
              height: 28px;
              line-height: 28px;
              border: 1px solid #3175f6;
              color: #3175f6;
              border-radius: 5px;
              cursor: pointer;
              margin-top: 6px;
            }
          }
        }
        .assessPart {
          .editBtn {
            cursor: pointer;
            float: right;
            .icon-edit2 {
              width: 15px;
              height: 20px;
              margin-right: 4px;
              background: url(../../../../../assets/edit.png) no-repeat;
              background-size: contain;
            }
          }
          .detailsInfo {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            .item {
              width: 325px;
              height: 100px;
              border: 1px solid #f1f1f1;
              margin-bottom: 25px;
              .title {
                height: 40px;
                line-height: 40px;
                padding-left: 15px;
                background-color: #fafafa;
                font-size: 14px;
              }
              .content {
                height: 60px;
                background-color: #f4f4f4;
                color: #666;
                font-size: 12px;
                padding: 10px;
              }
              .el-textarea {
                .el-textarea__inner {
                  height: 110px !important;
                }
              }
            }
          }
          .summary {
          }
          .participant,
          .summary {
            //评估参与人
            min-height: 150px;
            border: 1px solid #eeeeee;
            padding-top: 1px;
            margin-bottom: 20px;
            .title {
              height: 40px;
              line-height: 40px;
              padding-left: 15px;
              background-color: #fafafa;
              font-size: 14px;
              display: flex;
              justify-content: space-between;
              padding-right: 15px;
              > div {
                font-size: 12px;
                > span {
                  display: inline-block;
                  width: 70px;
                  height: 28px;
                  line-height: 28px;
                  border: 1px solid #3577f6;
                  color: #3577f6;
                  cursor: pointer;
                  border-radius: 5px;
                  text-align: center;
                  > i {
                    margin-right: 5px;
                  }
                }
              }
            }
            .content {
              padding: 10px;
              display: flex;
              flex-wrap: wrap;
              > div {
                padding: 5px 10px;
                font-size: 12px;
                background-color: #f4f4f4;
                border: 1px solid #f1f1f1;
                border-radius: 3px;
                color: #666;
                margin: 0 20px 10px 0;
                > i {
                  margin-left: 5px;
                  cursor: pointer;
                }
              }
            }
          }
        }
        .activityInfo {
          min-height: 800px;
          border: 1px solid #eee;
          margin-top: 20px;
          padding-bottom: 50px;
          position: relative;
          .pointFooter {
            position: absolute;
            width: 100%;
            bottom: 20px;
            left: 0;
            padding: 0 20px;
          }
          .btndiv {
            padding: 20px 0px;
            width: 100%;
            border-top: 1px solid #e5e5e5;
          }
          .upLoadDiv {
            padding-left: 20px;
            > div {
              display: flex;
              flex-wrap: wrap;
              margin: 15px 0;
            }
            .imgList {
              margin-right: 15px;
              margin-bottom: 15px;
              .item {
                width: 128px;
                height: 96px;
                position: relative;
                border: 1px solid #cecdcd;
                text-align: center;
                img {
                  max-width: 126px;
                  max-height: 94px;
                }
                > i {
                  cursor: pointer;
                  font-size: 20px;
                  color: #b7b2b2;
                  position: absolute;
                  right: -10px;
                  top: -10px;
                }
              }
            }
            .upLoadComponents {
              width: 128px;
              height: 96px;
              border: 1px dashed #d0d0d0ff;
              background: url(../../../../../assets/plus.png) no-repeat center;
              .aliUpload {
              }
            }
          }
          .title {
            height: 40px;
            line-height: 40px;
            padding-left: 15px;
            background-color: #fafafa;
            font-size: 14px;
            color: #666;
            justify-content: space-between;
            display: flex;
            padding-right: 15px;
            .editBtn {
              cursor: pointer;
              .icon-edit2 {
                width: 15px;
                height: 20px;
                margin-right: 4px;
                background: url(../../../../../assets/edit.png) no-repeat;
                background-size: contain;
              }
            }
          }
          .activityInfo_content {
            padding: 20px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
          }
        }
        .table-info {
          padding-bottom: 0;
          border-bottom: 0;
          min-height: auto;
          .el-table__header thead tr th {
            background: #fff;
          }
        }
      }
    }
    .leftPart {
      width: 210px;
      height: 880px;
      box-shadow: 0px 0px 11px 0px rgba(0, 0, 0, 0.23);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: absolute;
      top: 15px;
      left: 15px;
      .bottom {
        padding: 10px;
        color: #666;
        font-size: 14px;
        :first-child {
          margin-bottom: 10px;
        }
      }
      .typeTips {
        padding: 5px 10px;
        font-size: 14px;
        background-color: #0e75ff;
        margin-left: 10px;
        color: #fff;
        border-radius: 3px;
      }
      .actName {
        font-size: 18px;
        font-weight: bold;
        padding: 0 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 10px;
      }
      .projectName {
        padding: 0 10px;
        font-size: 14px;
        color: #666;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 10px;
      }
      .actTime {
        padding: 0 10px;
        font-size: 14px;
        color: #666;
        margin-bottom: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .imgDIv {
        width: 210px;
        height: 160px;
        position: relative;
        padding: 10px;
        span {
          display: block;
          background: rgba(0, 0, 0, 0.5);
          font-size: 16px;
          color: #f3f3f3;
          width: 190px;
          height: 140px;
          position: absolute;
          z-index: 9;
          left: 10px;
          top: 10px;
          text-align: center;
          line-height: 140px;
        }
      }
    }
  }
}
</style>
