<template>
  <div>
    <div class="ailPreview" @click="preview()">
      <span class="textfont" v-if="text">{{text}}</span>
      <i class="iconfont iconcms_chakan-"
         v-else></i>
    </div>

    <picturePrevie :visible.sync="showPicture"
                   :imgList="imgArr"
                   :num="num"></picturePrevie>
  </div>
</template>
<script>
import context from '@/service'
import common from '../utils/common.js'
import picturePrevie from '@/components/picturePrevie.vue'
import { Indicator } from 'mint-ui'
export default {
  name: 'ailPreview',
  components: {
    Indicator,
    picturePrevie
  },
  props: {
    text: {
      type: String,
      default: ''
    },
    billNoticeRecord: {
      type: Boolean,
      default: false
    },
    ailObj: '',
    encrypt: { // 下载是否做加密处理，默认不加密采用阿里oss下载  加密则调用原始axios函数 后台处理加密
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      xlsxData: '',
      imgArr: [],
      showPicture: false,
      num: 0
    }
  },
  methods: {
    preview () {
      // 保养详情图片预览
      let fileType
      if (typeof this.ailObj === 'string') {
        let src = this.ailObj + '?x-oss-process=image/auto-orient,1'
        this.imgArr.push(src)
        this.showPicture = true
        return
      }
      if (this.billNoticeRecord) { // 账单通知单页面预览做特殊处理 billDetails.vue
        fileType = '.pdf'
        let url = this.ailObj.noticeUrl
        this.cheackBillNotice(url)
      } else {
        // 修改文件后缀名为大写JPG支持转小写
        let annexName = this.ailObj.annexName
        fileType = `${annexName.substr(annexName.lastIndexOf('.'), annexName.length)}`.toLocaleLowerCase()
        if (fileType === '.jpg' || fileType === '.jpeg' || fileType === '.png' || fileType === '.pdf' || fileType === '.txt' || fileType === '.doc' || fileType === '.xls' || fileType === '.ppt' ||
          fileType === '.docx' || fileType === '.dotx' || fileType === '.xlsx' || fileType === '.pptx') {
          let url = this.ailObj.annexURL || this.ailObj.annexUrl
          this.getURl(url, fileType)
        } else {
          this.$toast({
            message: '暂时不支持此类型文件预览！',
            position: 'top'
          })
        }
      }
    },
    getURl (annexURL, fileType) {
      const imageRatio = common.imageRatio(375)
      let url = ''
      if (fileType === '.jpg' || fileType === '.jpeg' || fileType === '.png') {
        url = `cms/api/file/getUrl?fileName=${annexURL}&process=image/resize,w_${imageRatio.width},m_fixed`
      } else {
        url = `cms/api/file/getUrl?fileName=${annexURL}`
      }
      context.http.get(url).then(result => {
        if (result.status === 200) {
          if (fileType === '.pdf' || fileType === '.txt') {
            this.$router.push({ name: 'FilePreview', params: { url: result.data, fileType: fileType } })
          } else if (fileType === '.jpg' || fileType === '.jpeg' || fileType === '.png') {
            this.imgArr.push(result.data)
            this.showPicture = true
          } else if (fileType === '.docx' || fileType === '.dotx' || fileType === '.doc' || fileType === '.xlsx' || fileType === '.xls' || fileType === '.ppt' || fileType === '.pptx') {
            this.getFileBlob(result.data, fileType)
          }
        }
      })
    },
    getFileBlob (annexURL, fileType) {
      // Indicator.open({
      //   text: '加载中...',
      //   spinnerType: 'fading-circle'
      // })
      let obj = this.ailObj
      let axURL = annexURL
      context.http.get('fpv/api/file/preview', {
        annexURL: axURL,
        annexName: obj.annexName
      }).then(res => {
        if (res.status === 200) {
          // Indicator.close()
          this.$router.push({ name: 'FilePreview', params: { url: res.data, fileType: 'pdf' } })
        }
      }).catch(err => {
        if (err.message.indexOf('timeout') !== -1 || err.response.status === 408) {
          this.getFileBlob(axURL, obj.annexName)
        } else {
          Indicator.close()
          this.$toast({
            message: '服务器错误，请稍后重试',
            position: 'top'
          })
        }
      })
    },
    cheackBillNotice (noticeUrl) {
      context.http.get(`cms/api/file/getUrl?fileName=${noticeUrl}`).then(result => {
        this.$router.push({ name: 'FilePreview', params: { url: result.data, fileType: '.pdf' } })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../style/config";
.ailPreview {
  .iconfont {
    margin-right: 10px;
    font-size: rem(18);
  }
  .textfont{
    font-size: rem(14);
  }
}
</style>
<style  lang="scss">
.fileContent {
  height: 600px;
  overflow-y: scroll;
  table {
    width: 100%;
    border: 0;
    margin: 0;
    border-collapse: collapse;
    border-spacing: 0;
  }
  tbody {
    border-top: 1px solid gray;
    border-left: 1px solid gray;
  }
  tr {
  }
  td {
    padding: 0;
    text-align: center;
    border-bottom: 1px solid gray;
    border-right: 1px solid gray;
  }
  img {
    width: 600px;
  }
  h1 {
    text-align: center;
  }
}
.previewDialog {
  .el-dialog__header {
    border: none;
    background: #fff;
    margin: 0;
    padding: 20px;
    color: #262626;
    .el-dialog__title {
      font-size: 16px;
      font-weight: bold;
    }
  }
  .el-dialog__footer {
    background: #fff;
  }
}
</style>
