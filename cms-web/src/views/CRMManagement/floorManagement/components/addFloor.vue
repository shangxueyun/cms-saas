<template>
  <div>
    <el-form :model="createForm"
               :rules="createRulese"
               style="margin-top: 20px;"
               ref="createaccount">
        <el-form-item :label-width="formLabelWidth" prop="projectManagementId">
          <div class="itemtitle">项目简称<i class="required">*</i></div>
          <el-select v-model="createForm.projectManagementId"
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
          <el-select v-model="createForm.floorName"
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
          <el-input v-model="createForm.theme"
                    maxlength="20"
                    placeholder="请输入内容"></el-input>
          
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="coverImg"
                      style="margin-bottom: 20px;margin-right: 0;display: block">
          <div class="itemtitle">楼层封面<i class="required">*</i></div>
          <div class="buildingImg" v-if="createForm.coverImg">
            <img :src="createForm.coverImg" />
            <div class="bottomTips">
              <span>楼层封面</span>
              <i class="iconfont icon-cms_chakan-"
                  @click="showImg(createForm.coverImg)"></i>
              <i class="iconfont icon-shanchu-"
                  @click="deleLogo"></i>
            </div>
          </div>
          <div class="buildingImg" v-if="!createForm.coverImg">
            <p>
              <i class="iconfont icon-shangchuantupianicon"></i>
            </p>
            <span>上传图片</span>
            <input type="file"
              @change="imageChange($event, 'coverImg')"
              accept="image/png, image/jpeg">
          </div>
          <div style="color: #666;font-size: 12px;margin-top: 10px">（最多可上传1张，尺寸建议为:344*240px，大小不超过3M；支持格式JPG，PNG)</div>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="imgUrls"
                      style="margin-bottom: 20px;margin-right: 0;display: block">
          <div class="itemtitle">楼层介绍图片<i class="required">*</i></div>
          <div class="buildingImg" v-for="(e, i) in createForm.imgUrls" :key="i" v-if='createForm.imgUrls.length > 0'>
            <img :src="e" />
            <div class="bottomTips">
              <span>楼层介绍图片</span>
              <i class="iconfont icon-cms_chakan-"
                  @click="showImg(e)"></i>
              <i class="iconfont icon-shanchu-"
                  @click="deleteImg(i)"></i>
            </div>
          </div>
          <div class="buildingImg" v-if='createForm.imgUrls.length === 0'>
            <p>
              <i class="iconfont icon-shangchuantupianicon"></i>
            </p>
            <span>上传图片</span>
            <input type="file"
              @change="imageChange($event, 'imgUrls')"
              accept="image/png, image/jpeg">
          </div>
          <div style="color: #666;font-size: 12px;margin-top: 10px">（最多可上传1张，宽度建议为:700px，长度不限，大小不超过3M；支持格式JPG，PNG)</div>
        </el-form-item>
    </el-form>

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
  name: 'addFloor',
  components: {
    picturePrevie
  },
  data () {
    return {
      num: 0,
      createForm: {coverImg: '', imgUrls: []},
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
      imgArr: [],
      showPicture: false
    }
  },
  created () {
    this.options = this.$store.state.projectManagementsList
  },
  methods: {
    deleteImg (index) {
      this.createForm.imgUrls.splice(index, 1)
    },
    deleLogo () {
      this.createForm.coverImg = ''
      this.$forceUpdate()
    },
    pictureClose () {
      this.showPicture = false
    },
    showImg (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
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
    confirm (type) {
      this.$refs['createaccount'].validate((valid) => {
        if (valid) {
          if (type === 'storage') {
            this.createForm.approval = false
          } else {
            this.createForm.approval = true
          }
          context.http.post('crm/api/floor', this.createForm).then(res => {
            if (res.status === 201) {
              this.$emit('close')
              this.createForm = {imgUrls: []}
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
<style lang="scss" scoped>
  .itemtitle{
    margin-bottom: 10px; 
  }
  .el-form-item{
    display: inline-block;
    margin-right: 20px;
  }
  .buildingImg{
    display: inline-block;
    margin-top: 10px;
    width: 140px;
    height: 120px;
    text-align: center;
    border: 1px dashed #dfdfdf;
    cursor: pointer;
    position: relative;
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
</style>
