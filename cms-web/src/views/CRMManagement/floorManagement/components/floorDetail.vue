<template>
  <div>
    <div class="dl-head info_tab">
      <ul class="nav">
        <li @click="changeNav(index)"
            v-for="(item, index) in navList"
            :key="index"
            :class="item.value ? 'select_active' : ''">{{item.label}}</li>
      </ul>
    </div>
    <el-form  :model="createForm" v-show="step1" 
              :rules="createRulese"
              style="margin-top: 20px;"
              ref="createaccount">
        <el-form-item :label-width="formLabelWidth" prop="projectManagementId">
          <div class="itemtitle">项目简称<i class="required">*</i></div>
          <span v-if="readOnly">{{createForm.projectManagementReferred}}</span>
          <el-select v-model="createForm.projectManagementId" v-else
                     placeholder="请选择"
                     @change="getfloor"
                     >
            <el-option v-for="item in options"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="floorName">
          <div class="itemtitle">楼层<i class="required">*</i></div>
          <span v-if="readOnly">{{createForm.floorName}}</span>
          <el-select v-model="createForm.floorName" v-else
                     style="width: 180px"
                     placeholder="楼层"
                     >
            <el-option v-for="item in floorOptions"
                       :key="item.name"
                       :label="item.name"
                       :value="item.name">
            </el-option>
          </el-select> F
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="theme"
                      style="margin-bottom: 20px;margin-right: 0">
          <div class="itemtitle">楼层主题<i class="required">*</i></div>
          <span v-if="readOnly">{{createForm.theme}}</span>
          <el-input v-model="createForm.theme" v-else
                    maxlength="20"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="coverImg"
                      style="margin-bottom: 20px;margin-right: 0;display: block;width: 100%">
          <div class="itemtitle">楼层封面<i class="required">*</i></div>
          <div class="buildingImg" v-if="createForm.coverImg">
            <img :src="createForm.coverImg" />
            <div class="bottomTips">
              <span>楼层封面</span>
              <i class="iconfont icon-cms_chakan-"
                  @click="showImg(createForm.coverImg)"></i>
              <i class="iconfont icon-shanchu-"
                  v-if="!readOnly"
                  @click="deleLogo"></i>
            </div>
          </div>
          <div class="buildingImg" v-if="!readOnly && !createForm.coverImg">
            <p>
              <i class="iconfont icon-shangchuantupianicon"></i>
            </p>
            <span>上传图片</span>
            <input type="file"
              @change="imageChange($event, 'coverImg')"
              accept="image/png, image/jpeg">
          </div>
          <div v-if="!readOnly" style="color: #666;font-size: 12px;margin-top: 10px">（最多可上传1张，尺寸建议为:344*240px，大小不超过3M；支持格式JPG，PNG)</div>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="imgUrls"
                      style="margin-bottom: 20px;margin-right: 0;display: block;width: 100%">
          <div class="itemtitle">楼层介绍图片<i class="required">*</i></div>
          <div class="buildingImg" v-for="(e, i) in createForm.imgUrls" :key="i" v-if='createForm.imgUrls.length > 0'>
            <img :src="e" />
            <div class="bottomTips">
              <span>楼层介绍图片</span>
              <i class="iconfont icon-cms_chakan-"
                  @click="showImg(e)"></i>
              <i class="iconfont icon-shanchu-"
                  v-if="!readOnly"
                  @click="deleteImg(i)"></i>
            </div>
          </div>
          <div class="buildingImg" v-if="!readOnly && createForm.imgUrls.length === 0">
            <p>
              <i class="iconfont icon-shangchuantupianicon"></i>
            </p>
            <span>上传图片</span>
            <input type="file"
              @change="imageChange($event, 'imgUrls')"
              accept="image/png, image/jpeg">
          </div>
          <div v-if="!readOnly" style="color: #666;font-size: 12px;margin-top: 10px">（最多可上传1张，宽度建议为:700px，长度不限，大小不超过3M；支持格式JPG，PNG)</div>
        </el-form-item>
    </el-form>
    <div v-show="!step1" style="margin-left: 30px">
      <!-- <el-timeline class="timeline">
        <el-timeline-item placement="top"
                          style="position:relative;"
                          v-for="(item, index) in timeLineListData"
                          :key="index"
                          :timestamp="item.recordTime ? item.recordTime.replace('T','  ') : ''"
                          :color="nodeColorFn(item.followRecordType)">
          <div class="timeLineTitle">{{item.reviewStepD}}</div>
          <div class="template"
               style="width: 500px">
            <p>
              操作人：{{item.reviewUserName}}
            </p>
            <p v-if="item.reviewResultD">审核结果：{{item.reviewResultD}}</p>
            <p v-if="item.remark">备注：{{item.remark}}</p>
          </div>
        </el-timeline-item>
      </el-timeline> -->
      <div class="timelineBox">
        <el-timeline class="timeline">
          <el-timeline-item placement="top"
                            style="position:relative;min-height: 80px;"
                            v-for="(item, index) in timeLineListData"
                            :key="index"
                            size="normal"
                            :color="nodeColor(index)">
            <!-- :timestamp="item.recordTime.replace('T','  ')" -->
            <div class="statusBox">
              <div :class="{'shangxian':item.reviewStep==='PUBLISH','xiaxian':item.reviewStep==='OFF_SHELVES','shenhe':item.reviewStep==='REVIEW','tjsh':item.reviewStep==='PRODUCE'}">{{item.reviewStepD}}</div>
              <div :class="{'first':index===0}">{{formatApprovalDate(item.recordTime)}}</div>
            </div>
            <div class="template">
              <p v-if="item.reviewUserName"><span>操作人 : </span><span>{{item.reviewUserName}}</span></p>
              <!-- <span v-if="item.reviewStepD"><span>操作类型 : </span><span>{{item.reviewStepD}}</span></p> -->
              <p v-if="item.reviewResultD"><span>审核结果 : </span><span>{{item.reviewResultD}}</span></p>
              <p v-if="item.remark"><span>审核备注 : </span><span>{{item.remark}}</span></p>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
      <div v-if="isToExamine">
        <p style="margin-bottom: 10px">审核备注<span style="color: #E0434E;">*</span></p>
        <el-input
          type="textarea"
          resize="none"
          :rows="4"
          maxlength="50"
          placeholder="请输入内容"
          v-model="textarea">
        </el-input>
      </div>
    </div>
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
  </div>
</template>
<script>
import context from '@/service'
import picturePrevie from '@/components/picturePrevie.vue'
export default {
  name: 'floorDetail',
  components: {
    picturePrevie
  },
  props: {
    floorData: {
      type: Object
    },
    isToExamine: {
      type: Boolean
    }
  },
  data () {
    return {
      num: 0,
      timeLineListData: [],
      createForm: {},
      createRulese: {
        projectManagementId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        floorName: [
          { required: true, message: '请选择楼层', trigger: 'change' }
        ],
        theme: [
          { required: true, message: '请输入主题', trigger: 'blur' }
        ],
        coverImg: [
          { required: true, message: '请选择图片', trigger: 'change' }
        ],
        imgUrls: [
          { required: true, message: '请选择图片', trigger: 'change' }
        ]
      },
      options: [],
      floorOptions: [],
      formLabelWidth: '',
      readOnly: true,
      step1: true,
      navList: [{
        label: '基本信息',
        value: true
      }, {
        label: '操作记录',
        value: false
      }],
      textarea: '',
      imgArr: [],
      showPicture: false
    }
  },
  created () {
    this.options = this.$store.state.projectManagementsList
    this.createForm = this.floorData
    this.getfloor()
  },
  methods: {
    onClose () {
      this.readOnly = true
    },
    onEdit () {
      this.readOnly = false
    },
    changeNav (inx) {
      this.navList.forEach(item => {
        item.value = false
      })
      this.navList[inx].value = true
      if (inx === 0) {
        this.step1 = true
      } else if (inx === 1) {
        this.step1 = false
        this.getRecords()
      }
      this.$emit('changeStep', inx)
    },
    nodeColor (index) {
      return index === 0 ? '#3575F6' : '#D3DBEB'
    },
    formatApprovalDate (time) {
      if (time) {
        time = time.substr(0, time.lastIndexOf('T'))
        return time
      }
    },
    deleLogo () {
      this.createForm.coverImg = ''
      this.$forceUpdate()
    },
    deleteImg (index) {
      this.createForm.imgUrls.splice(index, 1)
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
    async getfloor () {
      let result = await context.http.get('cms/api/floors/svg', {projectManagementId: this.createForm.projectManagementId})
      this.floorOptions = result.data
    },
    async imageChange (event, type) {
      this.errorField = false
      let path = ''
      let files = event.target.files
      if (files.length > 0) {
        if (files[0].size > (1024 * 1024 * 3)) {
          this.errorField = true
          this.$message({
            showClose: true,
            message: '你上传的图片大小超过3M！',
            type: 'error'
          })
          event.target.value = ''
          return
        }
        if (files[0].type !== 'image/png' && files[0].type !== 'image/jpeg' && files[0].type !== 'image/jpg') {
          this.$message({
            showClose: true,
            message: '你上传的图片格式必须为JPG、PNG！',
            type: 'error'
          })
          event.target.value = ''
          return
        }
        let form = new FormData()
        form.append('file', files[0])
        context.http.post('/ywm/api/image-multipart', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          if (res.status === 201) {
            path = res.data
            if (type === 'coverImg') {
              this.createForm.coverImg = path
            } else {
              this.createForm.imgUrls = [path]
            }
            event.target.value = ''
            this.$forceUpdate()
          }
        }).catch(error => {
          console.info(error)
        })
      }
    },
    nodeColorFn (type) {
      let color = '#3575F6'
      switch (type) {
        case 'FINANCE':
          color = '#F56C6C'
          break
        case 'CONSTRUCTION':
          color = '#56BA8B'
          break
        case 'PATROL':
          color = '#6285F5'
          break
        case 'OTHERS':
          color = '#dd8032'
          break
        default:
          break
      }
      return color
    },
    formatTimeLineTitle (type) { // 时间线头部遍历
      switch (type) {
        case 'INPUT':
          return '录入'
        case 'FOLLOW':
          return '跟进'
        case 'PROCESS_RUNING':
          return '审批中'
        case 'PROCESS_AGREED':
          return '审批通过'
        case 'CONSTRUCTION':
          return '施工'
        case 'FINANCE':
          return '财务'
        case 'PATROL':
          return '巡场'
        case 'OTHERS':
          return '其他'
      }
    },
    async saveEdit (type) {
      this.$refs['createaccount'].validate((valid) => {
        if (valid) {
          if (type === 'storage') {
            this.createForm.approval = false
          } else {
            this.createForm.approval = true
          }
          console.log(this.createForm)
          context.http.put('crm/api/floor', this.createForm).then(res => {
            if (res.status === 200) {
              this.$emit('onHide')
              this.$emit('queryList')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getRecords () {
      context.http.get('crm/api/review/records', {businessId: this.createForm.id, businessType: 'FLOOR'}).then(res => {
        if (res.status === 200) {
          this.timeLineListData = res.data
        }
      })
    },
    nextStep () {
      this.changeNav(1)
    },
    previousStep () {
      this.changeNav(0)
    },
    adopt () {
      if (!this.textarea) {
        this.$message.error('请填写审核备注！')
        return
      }
      context.http.get('/crm/api/review/approval', {
        businessId: this.createForm.id,
        businessType: 'FLOOR',
        remark: this.textarea,
        reviewStatus: this.createForm.reviewStatus,
        reviewType: 'FLOOR'
      }).then(res => {
        if (res.status === 200) {
          this.$emit('onHide')
          this.$emit('queryList', 'toexamine')
        }
      })
    },
    Reject () {
      if (!this.textarea) {
        this.$message.error('请填写审核备注！')
        return
      }
      context.http.get('/crm/api/review/disapproval', {
        businessId: this.createForm.id,
        businessType: 'FLOOR',
        remark: this.textarea,
        reviewStatus: this.createForm.reviewStatus,
        reviewType: 'FLOOR'
      }).then(res => {
        if (res.status === 200) {
          this.$emit('onHide')
          this.$emit('queryList', 'toexamine')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .dl-head {
    margin-bottom: 30px!important;
  }
  .info_tab {
    height: 48px;
    display: -ms-flexbox;
    display: flex;
    background-color: #fff;
    box-shadow: 1px 2px 5px #eee;
    border-radius: 3px;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -ms-flex-align: center;
    align-items: center;
    padding-right: 44px;
    border-bottom: 1px solid #ecedef;
    .nav {
      display: -ms-flexbox;
      display: flex;

      li.select_active {
        border-bottom: 2px solid #3175d2;
        color: #3175d2;
        font-weight: bolder;
      }
      li {
        width: 140px;
        text-align: center;
        font-size: 14px;
        color: #666;
        height: 46px;
        line-height: 46px;
        border-bottom: 2px solid #fff;
        cursor: pointer;
      }
    }
  }
  .itemtitle{
    margin-bottom: 10px; 
  }
  .el-form-item{
    display: inline-block;
    margin-right: 20px;
    width: 30%;
    vertical-align: top;
  }
  .buildingImg{
    margin-top: 10px;
    width: 140px;
    height: 120px;
    text-align: center;
    border: 1px dashed #dfdfdf;
    cursor: pointer;
    position: relative;
    display: inline-block;
    vertical-align: top;
    > div{
      width: 140px;
      height: 120px;
    }
    span{
      color: #3577f6;
    }
    img{
      width: 100%;
      height: 100%;
    }
    input {
      position: absolute;
      top: 0;
      right: 0;
      width: 140px;
      height: 120px;
      opacity: 0;
      cursor: pointer;
    }
    .icon-adds{
      background: url(../../../../assets/plus.png) no-repeat;
      background-size: contain;
      margin-bottom: 6px;
    }
    i {
      color: #0076da;
      font-size: 24px;
    }
    .icon-jinakangbaoicons18 {
      position: absolute;
      top: -8px;
      right: -8px;
      cursor: pointer;
      color: #105cee;
      z-index: 999;
    }
    > p {
      margin-top: 30px;
    }
    .bottomTips {
      height: 25px;
      position: absolute;
      left: 0px;
      bottom: 0px;
      width: 140px;
      background-color: #fdffff;
      display: flex;
      align-items: center;
      font-size: 12px;
      justify-content: space-between;
      padding: 0 5px;
      text-align: left;
      > span {
        display: inline-block;
        width: 60%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #333;
      }
      > i {
        cursor: pointer;
        font-size: 14px;
        color: #333;
      }
    }
  }
  .timeline {
    position: relative;
    .timeLineTitle {
      position: absolute;
      left: -100px;
      top: 0;
      width: 80px;
      text-align: right;
    }
    p {
      margin-bottom: 5px;
      word-break: break-all;
    }
    .template {
      background: rgba(255, 255, 255, 1);
      // box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
      // border-radius: 2px;
      color: #666;
      font-size: 12px;
      p {
        color: #333;font-size: 14px
      }
    }
  }
.timelineBox {
  width: 100%;
  padding-left: 130px;
  padding-top: 30px;
  height: 500px;
  .statusBox {
    position: absolute;
    left: -160px;
    top: 0;
    width: 150px;
    text-align: center;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    font-size: 12px;
    > div {
      position: absolute;
      right: 0;
      &:first-child {
        display: inline-block;
        width: 60px;
        height: 20px;
        line-height: 20px;
        &.shangxian {
          background: #3575f6;
          border-radius: 4px;
          color: #ffffff;
        }
        &.xiaxian {
          background: #f99a12;
          border-radius: 4px;
          color: #ffffff;
        }
        &.shenhe {
          background: #f99a12;
          border-radius: 4px;
          color: #ffffff;
        }
        &.tjsh {
          background: #83bf68;
          border-radius: 4px;
          color: #ffffff;
        }
      }
      &:last-child {
        &.first {
          top: 30px;
          color: #3575f6;
        }
        top: 30px;
        color: #999999;
      }
    }
  }
  .template {
    position: relative;
    top: -13px;
    left: 0px;
    width: 500px;
    > p {
      margin-bottom: 5px;
      > span:first-child {
        font-size: 14px;
        color: #333333;
      }
      > span:last-child {
        font-size: 12px;
        color: #999999;
      }
    }
  }
}
</style>
