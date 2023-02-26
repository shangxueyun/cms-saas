<template>
  <div class="aliDownload">
    <i class="iconfont icon-xiazaidaoru icon-download"
       @click="download"></i>
  </div>
</template>

<script>
import context from '@/service'
import axios from 'axios'
import OSS from 'ali-oss'
export default {
  name: 'aliDownLoad',
  props: {
    item: {},
    isCustom: { // 定制下载函数 特殊下载处理
      type: Boolean,
      default: false
    },
    encrypt: { // 下载是否做加密处理，默认不加密采用阿里oss下载  加密则调用原始axios函数 后台处理加密
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
    // console.log(item)
  },
  methods: {
    download () {
      if (!this.encrypt) {
        context.http.get('ywm/api/image-multipart/token').then(res => {  // 获取token
          let result = res.data
          let client = new OSS({
            accessKeyId: result.accessKeyId,
            accessKeySecret: result.accessKeySecret,
            stsToken: result.stsToken,
            endpoint: result.region,
            bucket: result.bucket

          })
          let saveAs = this.item.annexName // 下载文件的中文名字
          let annexURLRight = this.item.annexURL.substring(this.item.annexURL.indexOf('//') + 2)
          let objectKey = annexURLRight.substring(annexURLRight.indexOf('/') + 1)  // 上传存入ali的key（getUUID）
          // console.log(objectKey)
          let downloadUrl = client.signatureUrl(objectKey, { expires: 3600, response: { 'content-disposition': 'attachment; filename="' + saveAs + '"' } })
          // console.log(downloadUrl)
          window.location = downloadUrl
        }).catch(error => {
          console.info(error)
        })
      } else {
        this.downloadFile(this.item)
      }
    },
    downloadFile (item, index) {
      context.http.get(`cms/api/file/getUrl?fileName=${item.annexURL}`).then(result => {
        axios({
          method: 'POST',
          url: '/ywm/api/annex/download',
          params: {
            annexURL: result.data,
            annexName: item.annexName
          },
          responseType: 'blob'
        }).then(res => {
          let url = window.URL.createObjectURL(new Blob([res.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', item.annexName)
          document.body.appendChild(link)
          link.click()
        })
      })
    },
    find (str, cha, num) {
      let x = str.indexOf(cha)
      for (let i = 0; i < num; i++) {
        x = str.indexOf(cha, x + 1)
      }
      return x
    }
  }
}
</script>

<style scoped lang="scss">
.aliDownload {
  width: 16px;
  height: 16px;
  cursor: pointer;
  .icon-download {
  }
}
</style>
