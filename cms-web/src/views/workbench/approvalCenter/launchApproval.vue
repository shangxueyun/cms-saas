<template>
  <div class="launch-approval-process">
    <div class="step_tab">
      <ul class="nav">
        <span class="iconfont icon-right" @click="goBack"></span>
        <li class="select_active">{{approvalName}}</li>
      </ul>
    </div>
    <div class="basics-design">
      <el-form :model="addData" :rules="rules" ref="ruleForm">
        <el-form-item style="margin-top:70px;" prop="currencyForm.title" label="标题">
          <el-input placeholder="请输入内容" v-model="addData.currencyForm.title" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item prop="currencyForm.content" label="正文">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入500字以内"
            maxlength="500"
            resize="none"
            v-model="addData.currencyForm.content">
          </el-input>
        </el-form-item>
        <div class="enclosure">
          <span style="display:block;width:60px;color:#777">附件</span>
          <div style="display: flex;justify-content: space-between;align-items: center;flex:1">
            <aliUpload class="aliUpload deviceDetails"
                        :upLoadText="addData.currencyForm.annexes.length>0?'继续上传':'上传附件'"
                        :fileType="fileType"
                        :iconShow="false"
                        :iconImg="iconImg"
                        :multiple="true"
                        :uploadIcon="true"
                        @setAnnex="setAnnexs" />
            <div class="annexList"
                  style="70%">
              <div v-for="(item, index) in addData.currencyForm.annexes"
                    :key="index">
                <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{item.annexName}}</span>
                <span style="display: flex;">
                  <ailPreview :ailObj="item"
                              :encrypt="true"
                              @setFile="setFile" />
                  <i @click="deleFile(item, index)"
                      class="iconfont icon-lajixiang"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="enclosure">
          <span>附件</span>
          <span class="upload">上传附件
            <input type="file"
                    @change="imageChange($event)">
          </span>
        </div>
        <div style="margin-left: 100px">
          <div v-for="(item, index) in addData.currencyForm.annexes" :key="index" style="margin-bottom: 10px">
            {{item.annexName}}
            <i @click="deleFile(item, index)"
               class="iconfont icon-lajixiang" style="margin-left: 10px;cursor: pointer;"></i>
          </div>
        </div> -->
      </el-form>
    </div>
    <div class="process-bottom">
      <span style="background:none" class="details_cannelBtn" @click="goBack">返回</span>
      <span class="details_submitBtn" @click="launchApproval">发起审批</span>
    </div>

    <!-- 图片预览 -->
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   @pictureClose="pictureClose"></picturePrevie>
  </div>
</template>
<script>
import context from '@/service'
import aliUpload from '@/components/aliUpload.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import ailPreview from '@/components/ailPreview.vue'
export default {
  name: 'approval',
  components: {
    aliUpload,
    picturePrevie,
    ailPreview
  },
  data () {
    return {
      iconImg: 'icon-shangchuanfujianicon',
      upLoadText: '',
      fileType: [],
      approvalName: '',
      approverShow: false,
      navList: [{label: '基础设计', value: true}, {label: '流程设计', value: false}],
      basicsDesign: true,
      addData: {
        currencyForm: {
          title: '',
          content: '',
          annexes: []
        }
      },
      rules: {
        'currencyForm.title': [
          { required: true, message: '请输入标题', trigger: 'change' }
        ],
        'currencyForm.content': [
          { required: true, message: '请输入正文', trigger: 'change' }
        ]
      },
      projectManagementList: [],
      approvalTypeList: [],
      flag: true,
      imgArr: [],
      showPicture: false
    }
  },
  created () {
    if (this.$route.params.row) {
      let row = this.$route.params.row
      this.approvalName = row.name
      this.addData.processDefineId = row.id
    }
  },
  mounted () {
    this.queryProjectManagement()
    this.queryApprovalTypeList()
  },
  methods: {
    setFile (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    pictureClose () {
      this.showPicture = false
    },
    approverClose () {
      this.approverShow = false
    },
    changeNav (inx) {
      if (inx === 0) {
        this.navList.forEach(item => {
          item.value = false
        })
        this.basicsDesign = true
        this.navList[inx].value = true
      } else if (inx === 1) {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.navList.forEach(item => {
              item.value = false
            })
            this.navList[inx].value = true
            this.basicsDesign = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    goBack () {
      console.log(this.$route.params.onRent)
      this.$router.push({name: 'approvalCenter', params: {onRent: this.$route.params.onRent}})
    },
    async queryProjectManagement () {
      context.http.get('/cms/api/project-managements', { useStatus: 'USING' }).then(res => {
        this.projectManagementList = res.data
      })
    },
    async queryApprovalTypeList () {
      context.http.get('/cms/api/process-defines/processType').then(res => {
        this.approvalTypeList = Object.keys(res.data).map(item => {
          return { value: item, label: res.data[item] }
        })
      })
    },
    // imageChange (event) {
    //   let files = event.target.files
    //   let form = new FormData()
    //   form.append('file', files[0])
    //   let name = files[0].name
    //   let annexes = this.addData.currencyForm.annexes
    //   for (let i = 0; i < annexes.length; i++) {
    //     if (annexes[i].annexName === name) {
    //       return false
    //     }
    //   }
    //   event.target.value = ''
    //   context.http.post('/ywm/api/image-multipart', form, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data'
    //     }
    //   }).then(res => {
    //     this.addData.currencyForm.annexes.push({
    //       'annexName': name,
    //       'annexURL': res.data
    //     })
    //   }).catch(error => {
    //     console.info(error)
    //   })
    // },
    setAnnexs (annexURL, annexName) {  // 子组件上传成功返回文件url 和名字
      this.addData.currencyForm.annexes.push({
        'annexName': annexName,
        'annexURL': annexURL
      })
    },
    deleFile (item, index) {
      this.addData.currencyForm.annexes.splice(index, 1)
    },
    launchApproval () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          context.http.post('/cms/api/currency-form', this.addData).then(res => {
            this.goBack()
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
@import "../../../style/aflow";
.launch-approval-process{
  height: 100%;
  .step_tab{
    height:60px;
    display: flex;
    background-color: #fff;
    margin: 10px 0 0px 0;
    box-shadow:1px 2px 5px #eee;
    border-radius:3px;
    justify-content: space-between;
    align-items: center;
    padding-right:44px;
    border-bottom:1px solid #ecedef;
    .nav{
      display: flex;
      li{
        text-align: center;
        font-size: 14px;
        color:#666;
        height:58px;
        line-height: 58px;
        border-bottom: 2px solid #fff;
        cursor: pointer;
        &.select_active{
          border-bottom: 3px solid #3575F6;
          color:#3575F6;
          font-weight: bolder;
        }
      }
      .icon-right{
        -webkit-transform: rotate(180deg);
        -moz-transform: rotate(180deg);
        -o-transform: rotate(180deg);
        -ms-transform: rotate(180deg);
        transform: rotate(180deg);
        line-height: 58px;
        width: 50px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
  .basics-design{
    width: 50%;
    margin: 0 auto;
    margin-top: 20px;
    .el-form-item{
      margin: 30px 0;
    }
    .el-select{
      width: 100%;
    }
    .el-form-item__content {
      margin-left: 60px!important;
    }
    .el-form-item__label{
      color:#777;
    }
    .el-form-item__label:before{
      content: ''!important;
      margin:0!important;
    }
    .el-form-item__label:after{
      content: '*';
      color:red;
    }
    .textsapn {
      position: relative;
      top: 10px;
    }
  }
  .process-bottom{
    position: fixed;
    width: calc(100% - 300px);
    right: 32px;
    bottom: 0px;
    padding: 20px 0;
    background-color: #f9f9f9;
    text-align: right;
    // span{
    //   margin-top: 20px;
    //   display: inline-block;
    //   margin-right: 10px;
    //   line-height: 40px;
    //   text-align: center;
    //   cursor: pointer;
    //   &:first-child{
    //     width:100px;
    //     height:40px;
    //     background:rgba(243,244,250,1);
    //     border-radius:4px;
    //     color: #777;
    //   }
    //   &:last-child{
    //     width:130px;
    //     height:40px;
    //     background:rgba(53,119,246,1);
    //     border-radius:4px;
    //     color: #fff;
    //   }
    // }
  }
  .btn-warp{
    span {
      display: inline-block;
      width: 80px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border: 1px solid #3175d2;
      cursor: pointer;
      border-radius: 4px;
      margin-left: 10px;
      color: #3175d2;
      &:hover{
        background-color: #3175d2;
        color: #fff;
      }
    }
  }
  .node-wrap-box{
    border-radius: 6px;
    >div {
      border-radius: 6px;
    }
    &:after {
      border-radius: 6px;
    }
    .title{
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
    }
    .close {
      font-size: 10px;
    }
  }
  .add-node-btn .btn{
    background-color: #3175d2!important;
    width: 26px!important;
    height: 26px!important;
    line-height: 26px!important;
  }
  .approver-title .titleIcon{
    background: url(../../../assets/jiedian.png) no-repeat;
  }
  .notifier-title .titleIcon{
    background: url(../../../assets/chaosong.png) no-repeat;
  }
  .item-wrapper {
    >span {
      display: inline-block;
      width: 40px;
      height: 40px;
    }
    .icon-approver{
      background: url(../../../assets/custom-chapter.png) no-repeat;
    }
    .icon-huiqian {
      background: url(../../../assets/tiaojianfenzhi.png) no-repeat;
    }
    .icon-huoqian {
      background: url(../../../assets/huoqian.png) no-repeat;
    }
    .icon-CC {
      background: url(../../../assets/chaosong2.png) no-repeat;
    }
  }
  .btnBoxhack{
    height: 62px;
  }
  .upload {
    display: inline-block;
    width: 70px;
    text-align: center;
    height: 20px;
    line-height: 20px;
    margin: 0 auto;
    color: rgba(15, 117, 255, 1);
    border: 1px solid rgba(15, 117, 255, 1);
    border-radius: 4px;
    background-color: #fff;
    position: relative;
    font-size: 12px;
    input {
      position: absolute;
      right: 0;
      width: 100%;
      height: 20px;
      opacity: 0;
      cursor: pointer;
    }
  }
  // .enclosure{
  //   span{
  //     &:first-child{
  //       display: inline-block;
  //       width: 98px;
  //       padding-left: 10px;
  //     }
  //   }
  // }
  .enclosure{
      display: flex;
      .aliUploads{
        opacity: 0;
        top: -20px;
        position: relative;
      }
      .upload {
        display: inline-block;
        width: 70px;
        text-align: center;
        height: 20px;
        line-height: 20px;
        margin: 0 auto;
        color: #0f75ff;
        border: 1px solid #0f75ff;
        border-radius: 4px;
        background-color: #fff;
        position: relative;
        margin-left: 30px;
        font-size: 12px;
      }
      input {
        position: absolute;
        right: 0;
        width: 100%;
        height: 20px;
        opacity: 0;
        cursor: pointer;
      }
    }
  .annexList {
    width: 80%;
    // margin-left: 15px;
    > div {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      border-bottom: 1px solid #eaeaea;
      padding-bottom: 5px;
      i {
        cursor: pointer;
      }
    }
  }
  .deviceDetails {
    width: 100px;
    height: 100px;
    margin-right: 15px !important;
    .oss_file {
      width: 100%;
      height: 100%;
      border: none;
      background-color: rgba(247, 249, 253, 1);
      border: 1px solid rgba(234, 234, 234, 1);
      border-radius: 4px;
      color: #3575f6;
      > i {
        font-size: 20px;
        position: absolute;
        top: -5px;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
      }
      > span {
        position: absolute;
        top: 18px;
        left: 0;
        right: 0;
        font-size: 12px;
      }
      >input{
        right: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
        width: 100%;
        height: 100%;
        position: absolute;
      }
    }
  }
}
</style>
