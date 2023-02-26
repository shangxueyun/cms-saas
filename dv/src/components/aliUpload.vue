<template>
  <div>
    <div class="oss_file">
      <i class="iconfont icon-shangchuanfujianicon"
         v-if="iconShow"></i>
      <i class="iconfont"
         :class="iconImg"
         v-if="uploadIcon"></i>
      <span class="upLoadText"
            style="color:#3575F6">{{upLoadText}}</span>
      <input type="file"
             :accept="accepts"
             :multiple="multiple"
             @change="doUpload($event)" />
    </div>
  </div>
</template>

<script>
import context from '@/service'
import OSS from 'ali-oss'
import $ from 'jquery'
export default {
  name: 'aliUpload',
  props: {
    businessType: { // 文件业务类型
      type: String,
      default: ''
    },
    iconImg: { // 上传动态图标
      type: String,
      default: 'icon-shangchuantupianicon'
    },
    iconShow: { // 是否展示上传图标
      type: Boolean,
      default: true
    },
    accepts: { // 上传文件格式
      type: String,
      default: '*'
    },
    upLoadText: { // 上传按钮文案
      type: String,
      default: '上传文件'
    },
    fileType: { // 上传文件格式限制空数组问不限制 如[png,jpg,pdf,]
      type: Array,
      default: () => {
        return []
      }
    },
    fileSize: { // 文件大小限制 單位M
      type: Number,
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      twoWay: false
    },
    url: {
      type: Array,
      twoWay: true
    },
    encrypt: { // 下载是否做加密处理，默认不加密采用阿里oss下载  加密则调用原始axios函数 后台处理加密
      type: Boolean,
      default: false
    },
    uploadIcon: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    }
  },
  created () {

  },
  mounted () {
    // this.appendUploadTips()
  },
  methods: {
    appendUploadTips () {
      let style = 'position: fixed; left: 0; right: 0; top: 0; bottom: 0; margin: auto; display: inline-block; width: 260px; height: 50px; line-height: 50px; text-align: center; background-color: rgba(0, 0, 0, .6); color: #fff; border-radius: 5px;font-size: 16px;'
      let tipDom = `<div id="tipDom" class="tipDom" style="position: fixed; left: 0; right: 0; top: 0; bottom: 0; margin: auto;z-index: 9999999999; "><span class="pulseAni" style="${style}"><i class="el-icon-loading" style="margin-right:15px"></i>上 传 中... 请稍等</span></div>`
      $('body').append(tipDom)
    },
    doUpload (event) {
      if (this.multiple) {
        this.eventTargetFiles = event.target.files
        this.doUploadMultiple(event)
        return
      }
      let files = event.target.files
      let size = files[0].size
      let name = files[0].name
      let index = name.lastIndexOf('.')
      let type = name.substr(index + 1).toLowerCase()
      let url = localStorage.getItem('tenantKey') + '/'
      if (this.businessType) {
        url += this.businessType + '/'
      } else {
        url += 'file/'
      }
      let storeAs = url + this.getUUID() + `.${type}`
      let _this = this
      let ipAddress = ''
      if (this.fileType.length > 0 && this.fileType.indexOf(type) < 0) {
        this.$message({
          message: `格式错误，请上传${this.fileType.join('、')}格式文件`,
          type: 'warning'
        })
        event.target.value = ''
        return
      }
      if (this.fileSize && size > this.fileSize * 1024 * 1024) {
        this.$message({
          message: `上传文件不得大于${this.fileSize}M`,
          type: 'warning'
        })
        event.target.value = ''
        return
      }
      this.appendUploadTips()
      if (!this.encrypt) {  // 根据参数决定是否调用上传是否加密
        ipAddress = '/ywm/api/image-multipart/token'
      } else {
        ipAddress = '/cms/api/image-multipart/token'
      }
      context.http.get(ipAddress).then(res => {  // 获取token
        let result = res.data
        let client = new OSS({
          accessKeyId: result.accessKeyId,
          accessKeySecret: result.accessKeySecret,
          stsToken: result.stsToken,
          endpoint: result.region,
          bucket: result.bucket
        })
        // storeAs表示上传的文件在阿里云上唯一标识, file表示上传的文件
        client.multipartUpload(storeAs, files[0]).then(function (result) { // 上传
          let resultUrl = result.res.requestUrls[0]
          let url = ''
          if (resultUrl.indexOf('?') > -1) {
            url = resultUrl.substring(0, resultUrl.indexOf('?'))
          } else {
            url = resultUrl
          }
          _this.$message({
            message: '上传成功',
            type: 'success'
          })
          $('#tipDom').remove()
          event.target.value = ''
          if (!_this.encrypt) { // 非加密模式则提交阿里云下载链接url 加密模式则提交文件唯一标识storeAs
            _this.$emit('setAnnex', url, name)
          } else {
            _this.$emit('setAnnex', storeAs, name)
          }
        }).catch(function (err) {
          $('#tipDom').remove()
          console.log(err)
        })
      }).catch(error => {
        $('#tipDom').remove()
        console.info(error)
      })
    },
    async doUploadMultiple (event) {
      let files = this.eventTargetFiles
      const filesLen = files.length
      for (let i = 0; i < filesLen; i++) {
        // let size = files[i].size
        let name = files[i].name
        let index = name.lastIndexOf('.')
        let type = name.substr(index + 1).toLowerCase()
        let url = localStorage.getItem('tenantKey') + '/'
        if (this.businessType) {
          url += this.businessType + '/'
        } else {
          url += 'file/'
        }
        let storeAs = url + this.getUUID() + `.${type}`
        let _this = this
        let ipAddress = ''
        if (!this.encrypt) {  // 根据参数决定是否调用上传是否加密
          ipAddress = '/ywm/api/image-multipart/token'
        } else {
          ipAddress = '/cms/api/image-multipart/token'
        }
        let res = await context.http.get(ipAddress)
        if (res.status === 200) {
          let result = res.data
          var client = new OSS({
            accessKeyId: result.accessKeyId,
            accessKeySecret: result.accessKeySecret,
            stsToken: result.stsToken,
            endpoint: result.region,
            bucket: result.bucket

          })
        }
        let result = await client.multipartUpload(storeAs, files[i])
        // storeAs表示上传的文件在阿里云上唯一标识, file表示上传的文件
        if (result.res.status === 200) {
          let resultUrl = result.res.requestUrls[0]
          let url = ''
          if (resultUrl.indexOf('?') > -1) {
            url = resultUrl.substring(0, resultUrl.indexOf('?'))
          } else {
            url = resultUrl
          }
          $('#tipDom').remove()
          if (!_this.encrypt) { // 非加密模式则提交阿里云下载链接url 加密模式则提交文件唯一标识storeAs
            _this.$emit('setAnnex', url, name)
          } else {
            _this.$emit('setAnnex', storeAs, name)
          }
        }
      }
      this.$message({
        message: '上传成功',
        type: 'success'
      })
      event.target.value = ''
    },
    getUUID () {
      function S4 () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
      }
      return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
    }
  }
}
</script>

<style scoped lang="scss">
.oss_file {
  height: 30px;
  width: 100px;
  line-height: 26px;
  border: 1px solid #5e72e4;
  color: #5e72e4;
  text-align: center;
  cursor: pointer;
  position: relative;
  font-size: 12px;
  border-radius: 4px;
  .icon-upload {
    background: url(../assets/upload.png) no-repeat;
    position: relative;
    top: 2px;
    width: 14px;
  }
  .upLoadText {
    width: auto;
    padding-left: 0;
  }
}
.oss_file input {
  right: 0;
  top: 0;
  opacity: 0;
  filter: alpha(opacity=0);
  cursor: pointer;
  width: 100%;
  height: 100%;
  position: absolute;
  font-size: 0; // cursor:pointer失效
}
</style>
