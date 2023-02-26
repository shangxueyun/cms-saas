<template>
  <div class="tenant-information">
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            @on-edit="onEdit"
            @on-hide="onHide">
      <div class="tenant-details details-content clearfix" slot="drawer" style="padding-bottom: 0">
        <div class="activityContent">
          <div class="leftPart" :style="{top:topNum,height:leftPartHeight}">
            <div class="top">
              <div class="imgDIv" @mouseenter="showArrow=true" @mouseleave="showArrow=false">
                <img v-if="detailsData.images.length<=0 || detailsData.activityStatus==='CLOSED'" :src="berthImg" alt="" style="width: 100%;height: 100%;">
                <el-carousel v-if="detailsData.images.length>0 && detailsData.activityStatus!=='CLOSED'" height="190px" width="270px" :autoplay="false">
                  <el-carousel-item v-for="item in detailsData.images" :key="item">
                    <img :src="item" alt="" style="max-width:270px;max-height:190px;">
                  </el-carousel-item>
                </el-carousel>
                <div class="shadeBox" v-if="detailsData.activityStatus==='CLOSED'">已关闭</div>
              </div>
              <div class="actName">{{detailsData.name}}</div>
              <div class="actTime">{{detailsData.startDate}} - {{detailsData.endDate}}</div>
              <div class="projectName">{{detailsData.projectRefferd}}</div>
              <!-- <span class="typeTips">{{formatStatus(detailsData.activityStatus)}}</span> -->
              <span class="typeTips">存档</span>
            </div>
            <div class="bottom">
              <div>{{detailsData.tenantName}}</div>
              <div v-if="detailsData.principal"><span style="color:#0E75FF">{{detailsData.principal}}</span>提供运营支持服务</div>
            </div>
          </div>
          <div class="rightPart">
            <div class="main_content">
              <div class="activityInfo" v-if="menuTab===1">
                <p class="title">
                  <span>活动信息</span>
                  <span class="editBtn" @click="onEdit" v-if="hasAuthority('02030408')">
                    <i data-v-9c1f67fc="" aria-hidden="true" class="icon icon-edit2"></i>
                    编辑
                  </span>
                </p> 
                  <el-form :model="detailsData" :rules="addFlowRules" ref="detailsData">
                    <div class="activityInfo_content">
                      <div class="item">
                        <span>活动名称<i class="required">*</i></span>
                        <el-form-item prop="name" v-if="!readOnly">
                          <el-input style="width:300px" v-model="detailsData.name" maxlength="20"></el-input>
                        </el-form-item>
                        <p v-else class="readOnlyTxt">{{detailsData.name}}</p>
                      </div>
                      <div class="item">
                        <span>活动时间<i class="required">*</i></span>
                        <el-form-item prop="startDate">
                          <el-date-picker
                            v-if="!readOnly"
                            style="width:300px"
                            v-model="startEndTime"
                            type="daterange"
                            range-separator="-"
                            value-format="yyyy-MM-dd"
                            :editable="false"
                            @change="startEndTimeChange"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                          </el-date-picker>
                          <p v-else class="readOnlyTxt">{{formatTime(detailsData.startDate,detailsData.endDate)}}</p>
                        </el-form-item>
                      </div>
                      <div class="item">
                        <span>所属项目<i class="required">*</i></span>
                        <el-form-item v-if="!readOnly" prop="projectId">
                          <el-select v-model="detailsData.projectId" placeholder="选择项目" style="width:300px" clearable @change="projectIdChange">
                            <el-option
                              v-for="item in options1"
                              :key="item.id"
                              :label="item.projectName"
                              :value="item.id">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <p v-else class="readOnlyTxt">{{detailsData.projectRefferd}}</p>
                      </div>
                      <div class="item">
                        <span>活动地点<i class="required">*</i></span>
                        <el-form-item prop="place" v-if="!readOnly">
                          <el-input style="width:300px" v-model="detailsData.place" maxlength="20"></el-input>
                        </el-form-item>
                        <p v-else class="readOnlyTxt">{{detailsData.place}}</p>
                      </div>
                      <div class="item">
                        <span>客户名称<i class="required">*</i></span>
                        <el-form-item prop="tenantId" v-if="!readOnly">
                          <el-autocomplete
                            style="width:300px"
                            class="inline-input"
                            v-model="autocompleteText"
                            :fetch-suggestions="querySearch"
                            placeholder="请输入内容"
                            @change="autocompleteChange"
                            @select="handleSelect"
                          ></el-autocomplete>
                        </el-form-item>
                        <p v-else class="readOnlyTxt">{{detailsData.tenantName}}</p>
                      </div>
                      <div class="item">
                        <span>负责人</span>
                        <el-form-item prop="principal" v-if="!readOnly">
                          <el-input style="width:300px" v-model="detailsData.principal" maxlength="20"></el-input>
                        </el-form-item>
                        <p v-else class="readOnlyTxt">{{detailsData.principal}}</p>
                      </div>
                      <div class="item">
                        <span>活动描述</span>
                        <el-form-item prop="description" v-if="!readOnly">
                          <el-input style="width:300px" type="textarea" :rows="2" v-model="detailsData.description" maxlength="500"></el-input>
                        </el-form-item>
                        <p v-else class="readOnlyTxt">{{detailsData.description}}</p>
                      </div>
                    </div>
                    <div class="upLoadDiv">
                      <p>活动图片<span v-if="!readOnly">（{{detailsData.images.length}}/5）</span></p>
                      <div>
                        <div class="imgList" v-for="(item,index) in detailsData.images" :key="index" v-if="!readOnly">
                          <div class="item">
                            <img :src="item" alt="" @click="showImg(item,index)">
                            <i class="el-icon-error" @click="deleteFn(item,index)"></i>
                          </div>
                        </div>
                        <div class="imgList" v-for="(item,index) in detailsData.images" :key="index" v-if="readOnly">
                          <div class="item">
                            <img :src="item" alt="" @click="showImg(item,index)">
                          </div>
                        </div>
                        <div class="upLoadComponents" v-if="detailsData.images.length<5 && !readOnly">
                          <aliUpload class="aliUpload"
                            :upLoadText="upLoadText"
                            :fileType="fileType"
                            :iconShow="false"
                            @setAnnex="setAnnex"
                          />
                        </div>
                      </div>
                    </div>
                  </el-form>
                  <div class="btndiv" style="margin-top: 50px; display: flex; flex-direction: row-reverse;padding-right: 30px;" v-if="!readOnly">
                    <el-button type="primary" style="width:100px;margin-left: 25px;" @click="editSave('detailsData')">确认</el-button>
                    <el-button style="width:100px" @click="onHide">取消</el-button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </drawer>   
    <picturePrevie v-if="showPicture" :imgList="imgArr" :num="num"  @pictureClose="pictureClose"></picturePrevie>
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import aliUpload from '@/components/aliUpload.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import Drawer from '@/components/drawer.vue'
import { error } from 'util'
import OSS from 'ali-oss'
export default {
  components: {
    Drawer,
    picturePrevie,
    aliDownLoad,
    aliUpload
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    detailsData: {
      type: Object,
      default: {}
    }
  },
  watch: {
    // detailsData1: {
    //   handler (oldVal, newVal) {
    //     this.detailsData = newVal
    //     console.log(111)
    //   },
    //   deep: true
    // }
  },
  data () {
    return {
      leftPartHeight: null,
      showArrow: false,
      berthImg: require('../../../../../assets/berth-default.png'),
      imagesIndex: 0,
      startEndTime: [],
      autocompleteText: '',
      menuTab: 1,
      topNum: '20px',
      showPicture: false,
      imgArr: [],
      num: [],
      fileType: ['png', 'jpg'],
      upLoadText: '上传图片',
      readOnly: true,
      drawerTitle: '查看活动详情',
      addFlowRules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'change' }
        ],
        startDate: [
          { required: true, message: '请选择活动时间', trigger: 'change' }
        ],
        projectId: [
          { required: true, message: '请选择活动项目', trigger: 'change' }
        ],
        place: [
          { required: true, message: '请输入活动地点', trigger: 'change' }
        ],
        tenantId: [
          { required: true, message: '请选择客户名称', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
  },
  mounted () {
    let winHeight
    if (window.innerHeight) {
      winHeight = window.innerHeight
    } else if ((document.body) && (document.body.clientHeight)) {
      winHeight = document.body.clientHeight
    }
    this.leftPartHeight = winHeight - 80 + 'px'
    console.log(this.leftPartHeight)
  },
  methods: {
    subImagesIndex () { // -
      if (this.imagesIndex > 0) {
        this.imagesIndex--
      }
    },
    prvImagesIndex () { // +
      if (this.imagesIndex < this.detailsData.images.length - 1) {
        this.imagesIndex++
      }
    },
    startEndTimeChange (time) { // 编辑模式时间修改
      if (time) {
        this.detailsData.startDate = time[0]
        this.detailsData.endDate = time[1]
      } else {
        this.detailsData.startDate = null
        this.detailsData.endDate = null
      }
    },
    editSave (formName) { // 编辑提交
      if (this.autocompleteText === '') {
        this.detailsData.tenantId = ''
      }
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          context.http.put('/cms/api/plan-activities', this.detailsData).then(res => {
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
    formatTime (s, e) {
      return s + ' - ' + e
    },
    formatStatus (type) {
      switch (type) {
        case 'EXECUTING':
          return '筹备执行'
        case 'ASSESS':
          return '评估'
        case 'ARCHIVE':
          return '存档'
        case 'CLOSED':
          return '已关闭'
      }
    },
    querySearch (queryString, callback) {
      var restaurants = this.tenantList
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
        // 调用 callback 返回建议列表的数据
      callback(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect (item) { // 模糊搜索项目下商户
      this.detailsData.tenantId = item.id
      console.log(item, this.autocompleteText)
    },
    projectIdChange (projectId, flag) {
      if (projectId === '') {
        return
      }
      context.http.get(`/cms/api/tenant/projectManagement/${projectId}`).then(res => {
        this.tenantList = []
        this.tenantList = res.data.map(item => {
          return {value: item.teantName, id: item.id}
        })
        if (!flag) {
          this.detailsData.tenantId = null
          this.autocompleteText = ''
        }
      }).catch(error => {
        console.log(error)
      })
    },
    deleteFn (item, index) {
      this.detailsData.images.splice(index, 1)
    },
    pictureClose () {
      this.showPicture = false
    },
    showImg (item, index) {
      let imgArr = []
      this.detailsData.images.forEach(item => {
        imgArr.push(item)
      })
      this.imgArr = imgArr
      this.num = index
      this.showPicture = true
    },
    setAnnex (annexURL) {  // 子组件上传成功返回文件url 和名字
      this.detailsData.images.push(annexURL)
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
      // return true
    },
    onHide () {
      this.menuTab = 1
      this.readOnly = true
      this.$emit('heiahtAuto')
      this.$emit('drawerClose', false)
    },
    autocompleteChange (val) {
      console.log(val)
    },
    onEdit () {
      this.projectIdChange(this.detailsData.projectId, true)
      this.autocompleteText = this.detailsData.tenantName
      if (this.startEndTime.length === 0) {
        this.startEndTime.push(this.detailsData.startDate)
        this.startEndTime.push(this.detailsData.endDate)
      } else {
        this.startEndTime[0] = this.detailsData.startDate
        this.startEndTime[1] = this.detailsData.endDate
      }
      this.readOnly = false
    }
  }
}
</script>
<style lang="scss">
.activityContent  .dataPart{
  .oss_file{
    height: 28px;
    line-height: 28px;
  }
}
.costPart1{
  .aliDownload{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    .icon-xiazaidaoru{
      display: block;
      width: 100%;
      height: 100%;
    }
    .icon-xiazaidaoru::before{
      content: "";
    }
  }
}
.summary{
  .el-textarea,.el-textarea__inner{
    height: auto!important;
  }
}
.participant{ //评估参与人
  .title{
    .el-input__inner{
      height: 28px;
      width: 100px;
    }
    .el-autocomplete{
      width: 100px;
    }
  }
}
.dataPart{
  .aliDownload{
    display: inline-block;
    width: auto;
    height: auto;
    margin-right: 15px;
    cursor: pointer;
    .icon-xiazaidaoru{
      font-family:'微软雅黑'!important;
      font-size: 14px;
    }
    >.icon-xiazaidaoru::before{
      content: '下载'!important;
    }
    color: #0E75FF;
  }
}
.aliUpload_cost{
  position: relative;
  .el-icon-upload2{
    position: absolute;
    top: 15px;
    left: 10px;
  }
  .oss_file{
    height: 40px;
    width: 100%;
    line-height: 40px;
    color: #333;
    font-size: 12px;
    padding: 0 10px 0 30px;
    border: 1px solid #eeeeee;
  }
}
  .delDialog_content{
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    padding: 30px;
    i{
      font-size: 50px;
      color: #E27774;
      margin-bottom: 20px
    }
    span{
      color: #5D6165;
      font-size:16px; 
    }
  }
  .costDialog_content{
      display: flex;
      padding: 20px 0;
      flex-wrap: wrap;
      justify-content: space-between;
    .item{
      >span{
        margin-bottom: 5px;
        display: block;
      }
      .el-textarea textarea{
        height: auto;
      }
    }
    .costFile{
      >span{
        display: inline-block;
        width: 200px;
        margin-right: 15px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      >i{
        font-size: 16px;
        cursor: pointer;
      }
    }
  }
  .planContent{
    >.el-form{
      display: flex;
      padding: 20px 0;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .item{
      >span{
        margin-bottom: 5px;
        display: block;
      }
      .el-textarea textarea{
        height: auto;
      }
    }
  }
  .projectActivities{
    .delDialog{
      .el-dialog__header, .el-dialog__body{
        border: none;
      }
    }
  }
  .activityContent{
    .el-carousel__item{
      text-align: center;
    }
    .el-carousel__button{
      width:5px;
      height:5px;
      border-radius: 5px;
    }
    .btnDiv{      
      .el-button{
        width: 100px;
      }
    }
    .item{
      >.el-date-editor,>.el-select,>.el-textarea{
        margin-bottom: 22px;
      }
      .el-textarea textarea{
        height: auto!important;
      }
    }
    .oss_file{
      border:none!important;
      height: 100px;
      width: 100%;
      line-height: 150px;
      color: #3577F6;
      font-size: 12px;
    }
    .demo-table-expand {
      font-size: 0;
    }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
    padding: 10px;
    display: flex;
    align-items: center;
  }
  }
</style>
<style lang="scss" scoped>
.tenant-information {
  width: 100%;
  height: 100%;
  .activityContent{
    width: 1050px;
    padding: 20px;
    display: flex;
    flex-wrap: nowrap;
    position: relative;
    .item{
        flex-direction:column;
        >span{
          display: block;
          margin-bottom: 5px;
        }
        .readOnlyTxt{
          font-size: 12px;
          color: #999;
          // height: 40px;
          // line-height: 40px;
          width: 300px;
          padding: 8px;
        }
      }
    .rightPart{
      min-height: 700px;
      // border: 1px solid #eee;
      width: 100%;
      padding-left: 330px;
      .main_content{
        .menuTab{
          height: 60px;
          line-height: 60px;
          box-shadow: 1px 1px 10px #eee;
          font-size: 12px;
          >span{
            display: inline-block;
            width: 100px;
            text-align: center;
            cursor: pointer;
            &.active{
              border-bottom:2px solid #3175F6; 
              color:#3175F6;
            }
          }
        }
        .costPart{
          margin-top: 50px;
          border: 1px solid #eeeeee;
          .title{
            height: 40px;
            line-height: 40px;
            padding-left: 15px;
            background-color: #F1F1F1;
            font-size: 14px;
            color:#666;
            justify-content: space-between;
            display: flex;
            padding-right: 15px;
            .addCost{
              display: flex;
              justify-content: center;
              align-items: center;
              width: 88px;
              height: 28px;
              line-height: 28px;
              border: 1px solid #3175F6;
              color: #3175F6;
              border-radius: 5px;
              cursor: pointer;
              margin-top: 6px;
            }
            
          }
        }
        .planPart{
          margin-top: 50px;
          border: 1px solid #eeeeee;
          .title{
            height: 40px;
            line-height: 40px;
            padding-left: 15px;
            background-color: #F1F1F1;
            font-size: 14px;
            color:#666;
            justify-content: space-between;
            display: flex;
            padding-right: 15px;
            .addPlan{
              display: inline-block;
              width: 88px;
              height: 28px;
              line-height: 28px;
              border: 1px solid #3175F6;
              color: #3175F6;
              border-radius: 5px;
              cursor: pointer;
              margin-top: 6px;
            }
            
          }
        }
        .assessPart{
          .editBtn{
            cursor: pointer;
            float: right;
            .icon-edit2{
              width: 15px;
              height: 20px;
              margin-right: 4px;
              background: url(../../../../../assets/edit.png) no-repeat;
              background-size: contain;
            }
          }
          .detailsInfo{
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            .item{
              width: 325px;
              height: 100px;
              border: 1px solid #F1F1F1;
              margin-bottom: 25px;
              .title{
                height: 40px;
                line-height: 40px;
                padding-left: 15px;
                background-color: #FAFAFA;
                font-size: 14px;
              }
              .content{
                height: 60px;
                background-color: #F4F4F4;
                color: #666;
                font-size: 12px;
                padding: 10px;
              }
              .el-textarea{
                .el-textarea__inner{
                  height: 110px!important;
                }
              }
            }
          }
          .summary{

          }
          .participant,.summary{ //评估参与人
            min-height: 150px;
            border: 1px solid #eeeeee;
            padding-top:1px; 
            margin-bottom: 20px;
            .title{
              height: 40px;
              line-height: 40px;
              padding-left: 15px;
              background-color: #FAFAFA;
              font-size: 14px;
              display: flex;
              justify-content: space-between;
              padding-right: 15px;
              >div{
                font-size: 12px;
                >span{
                  display: inline-block;
                  width: 70px;
                  height: 28px;
                  line-height: 28px;
                  border: 1px solid #3577F6;
                  color: #3577F6;
                  cursor: pointer;
                  border-radius:5px;
                  text-align: center;
                  >i{
                    margin-right: 5px;
                  } 
                }
              }
            }
            .content{
              padding: 10px;
              display: flex;
              flex-wrap: wrap;
              >div{
                padding: 5px 10px;
                font-size: 12px;
                background-color: #F4F4F4;
                border: 1px solid #F1F1F1;
                border-radius: 3px;
                color: #666;
                margin: 0 20px 10px 0;
                >i{
                  margin-left: 5px;
                  cursor: pointer;
                }
              }
            }
          }
        }
        .activityInfo{
          // min-height: 800px;
          border: 1px solid #eee;
          margin-top: 20px;
          padding-bottom: 50px;
          .upLoadDiv{
            padding-left: 20px;
            >div{
              display: flex;
              flex-wrap: wrap;
              margin: 15px 0;
            }
            .imgList{
                margin-right: 10px;
                margin-bottom: 10px;
              .item{
                  width: 115px;
                  height: 86px;
                  position: relative;
                  text-align: center;
                  // border: 1px solid #cecdcd;
                img{
                  max-width: 113px;
                  max-height: 84px;
                }
                >i{
                  cursor: pointer;
                  font-size: 20px;
                  color: #B7B2B2;
                  position: absolute;
                  right: -10px;
                  top: -10px;
                }
              }
            }
            .upLoadComponents{
              width: 115px;
              height: 100px;
              border: 1px dashed #D0D0D0FF;
              background: url(../../../../../assets/plus.png) no-repeat center;
              .aliUpload{
                
              }
            }
          }
          .title{
            height: 40px;
            line-height: 40px;
            padding-left: 15px;
            background-color: #F1F1F1;
            font-size: 14px;
            color:#666;
            justify-content: space-between;
            display: flex;
            padding-right: 15px;
            .editBtn{
              cursor: pointer;
              .icon-edit2{
                width: 15px;
                height: 20px;
                margin-right: 4px;
                background: url(../../../../../assets/edit.png) no-repeat;
                background-size: contain;
              }
            }
          }
          .activityInfo_content{
            padding: 20px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
          }
        }
      }
    }
    .leftPart{
      width: 310px;
      // height: 965px;
      height: 65%;
      box-shadow: 1px 1px 10px 0px #ababab;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: absolute;
      top: 20px;
      left: 15px;
      .bottom{
        padding: 20px;
        color: #666;
        font-size: 14px;
        :first-child{
          margin-bottom: 10px;
        }
      }
      .typeTips{
        padding: 5px 10px;
        font-size: 14px;
        background-color: #0E75FF;
        margin-left: 20px;
        color: #fff;
        border-radius: 3px;
      }
      .actName{
        font-size: 18px;
        font-weight: bold;
        padding:0 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 10px;
      }
      .projectName{
        padding:0 20px;
        font-size: 14px;
        color: #666;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 10px;
      }
      .actTime{
        padding:0 20px;
        font-size: 14px;
        color: #666;
        margin-bottom: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .imgDIv{
        width: 310px;
        height: 230px;
        position: relative;
        padding: 20px;
        text-align: center;
        .ICON{
          position: absolute;
          font-size: 36px;
          top: 50%;
          transform:translateY(-50%);
          background-color: rgba(255, 255, 255, .5);
          cursor: pointer;
          &.el-icon-arrow-left{
            left: 20px;
          }
          &.el-icon-arrow-right{
            right: 20px;
          }
        }
      }
    }
  }
}
</style>
