<template>
  <div>
    <input type="file"
           class="aliInput"
           :accept="accepts"
           :multiple="multiple"
           @change="doUpload($event)" />
  </div>
</template>

<script>
import context from '@/service'
import OSS from 'ali-oss'
import { Toast } from 'mint-ui'
export default {
  name: 'aliUpload',
  props: {
    businessType: { // 文件业务类型
      type: String,
      default: ''
    },
    accepts: { // 上传文件格式
      type: String,
      default: '*'
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
      twoWay: true
    },
    encrypt: { // 下载是否做加密处理，默认加密调用原始axios函数 后台处理加密  不加密则采用阿里oss下载
      type: Boolean,
      default: true
    }
  },
  data () {
    return {

    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    doUpload (event) {
      let files = event.target.files
      let size = files[0].size
      let name = files[0].name
      let index = name.lastIndexOf('.')
      let type = name.substr(index + 1).toLowerCase()
      let url = localStorage.getItem('tenantKey') + '/'
      if (this.businessType !== '') {
        url += this.businessType + '/'
      } else {
        url += 'file/'
      }
      let storeAs = url + this.getUUID() + `.${type}`
      let _this = this
      let ipAddress = ''
      if (this.fileType.length > 0 && this.fileType.indexOf(type) < 0) {
        Toast({
          message: `格式错误，请上传${this.fileType.join('、')}格式文件`,
          position: 'top'
        })
        event.target.value = ''
        return
      }
      if (this.fileSize && size > this.fileSize * 1024 * 1024) {
        Toast({
          message: `上传文件不得大于${this.fileSize}M`,
          position: 'top'
        })
        event.target.value = ''
        return
      }
      context.system.startLoading()
      console.log(this.encrypt)
      if (!this.encrypt) {  // 根据参数决定是否调用上传是否加密
        ipAddress = 'ywm/api/image-multipart/token'
      } else {
        ipAddress = 'cms/api/image-multipart/token'
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
        console.log(storeAs)
        // storeAs表示上传的文件在阿里云上唯一标识, file表示上传的文件
        client.multipartUpload(storeAs, files[0]).then(function (result) { // 上传
          let resultUrl = result.res.requestUrls[0]
          let url = ''
          if (resultUrl.indexOf('?') > -1) {
            url = resultUrl.substring(0, resultUrl.indexOf('?'))
          } else {
            url = resultUrl
          }
          Toast({
            message: `上传成功`,
            position: 'top'
          })
          context.system.stopLoading()
          event.target.value = ''
          if (!_this.encrypt) { // 非加密模式则提交阿里云下载链接url 加密模式则提交文件唯一标识storeAs
            _this.$emit('setAnnex', url, name)
          } else {
            _this.$emit('setAnnex', storeAs, name)
          }
        }).catch(function (err) {
          context.system.stopLoading()
          console.log(err)
        })
      }).catch(error => {
        context.system.stopLoading()
        console.info(error)
      })
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
.aliInput {
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
