<template>
  <div id="filePreview">
    <app-header :title="title"
                :mode="false"></app-header>
    <div class="content">
      <div class="operating">
        <span @click="scaleFn(1)">放大</span>
        <span @click="scaleFn(2)">缩小</span>
        <span @click="scaleFn(3)">原始大小</span>
      </div>
      <div class="content-scale"
           :style="{width: warpWidth + 'px', height: warpHeight + 'px'}">
        <div class="scale-warp"
             :style="{transform: scaleValue}">
          <iframe :src="pdfSrc"
                  width="100%"
                  height="100%"
                  frameborder=0
                  v-if="text"></iframe>
          <div v-else>
            <p class="arrow">
              <!-- 上一页 -->
              <span @click="changePdfPage(0)"
                    class="turn"
                    :class="{grey: currentPage==1}">上一页</span>
              {{currentPage}} / {{pageCount}}
              <!-- 下一页 -->
              <span @click="changePdfPage(1)"
                    class="turn"
                    :class="{grey: currentPage==pageCount}">下一页</span>
            </p>
            <pdf :src="pdfSrc"
                 :page="currentPage"
                 ref="pdf"
                 @num-pages="pageCount=$event"
                 @page-loaded="loadedHandler($event)"
                 @loaded="loadPdfHandler">
            </pdf>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppHeader from '@/components/appHead'
import pdf from 'vue-pdf'
import { Indicator } from 'mint-ui'
export default {
  name: 'FilePreview',
  metaInfo: {
    title: 'This is the test',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=2,user-scalable=yes' }
    ]
  },
  components: { AppHeader, pdf, Indicator },
  data () {
    return {
      title: '文件预览',
      pdfSrc: '',
      numPages: 1,
      text: true,
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      scaleValue: 'scale(1)',
      multiple: 1,
      warpWidth: '',
      warpHeight: ''
    }
  },
  created () {
    let url = this.$route.params.url
    if (url) {
      this.pdfUrl = url
    }
    const fileType = this.$route.params.fileType
    if (fileType === '.txt') {
      this.text = true
      this.pdfSrc = this.pdfUrl
    } else {
      this.text = false
      let src = pdf.createLoadingTask({
        url: this.pdfUrl,
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.5.207/cmaps/',
        cMapPacked: true
      })
      this.pdfSrc = src
    }
  },
  mounted () {
    if (!this.text) {
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
    }

    // 有时PDF文件地址会出现跨域的情况,这里最好处理一下
    // this.pdfSrc = pdf.createLoadingTask(this.pdfSrc)
    // this.pdfSrc.then(pdf => {
    //   this.numPages = pdf.numPages
    // })
    this.warpWidth = document.querySelector('.content-scale').offsetWidth
    this.warpHeight = document.querySelector('.content-scale').offsetHeight * 3.8
    this.defaultWarpWidth = document.querySelector('.content-scale').offsetWidth
    this.defaultwarpHeight = document.querySelector('.content-scale').offsetHeight * 3.8
  },
  methods: {
    // pdf加载时
    loadPdfHandler (e) {
      this.currentPage = 1 // 加载的时候先加载第一页
    },
    // 加载完成
    loadedHandler (e) {
      this.currentPage = e
      Indicator.close()
    },
    // 改变PDF页码,val传过来区分上一页下一页的值,0上一页,1下一页
    changePdfPage (val) {
      // console.log(val)
      if (val === 0 && this.currentPage > 1) {
        this.currentPage--
        // console.log(this.currentPage)
      }
      if (val === 1 && this.currentPage < this.pageCount) {
        this.currentPage++
        // console.log(this.currentPage)
      }
    },
    scaleFn (type) {
      let warpWidth = document.querySelector('.content-scale').offsetWidth
      let warpHeight = document.querySelector('.content-scale').offsetHeight
      let multiple = this.multiple
      if (type === 1) {
        multiple += 0.1
        this.scaleValue = `scale(${multiple})`
        warpWidth = warpWidth * multiple
        warpHeight = warpHeight * multiple
      } else if (type === 2) {
        if (multiple === 1) return
        warpWidth = warpWidth / multiple
        warpHeight = warpHeight / multiple
        multiple -= 0.1
        this.scaleValue = `scale(${multiple})`
      } else {
        warpWidth = this.defaultWarpWidth
        warpHeight = this.defaultwarpHeight
        this.scaleValue = 'scale(1)'
        multiple = 1
      }
      this.multiple = multiple
      this.warpWidth = warpWidth
      this.warpHeight = warpHeight
      this.$forceUpdate()
    }
  },
  beforeDestroy () {
    Indicator.close()
  }
}
</script>
<style lang="scss" scoped>
@import "../style/config";
#filePreview {
  width: 100%;
  height: 100%;
  .content {
    overflow: scroll;
    width: 100%;
    height: 100%;
    padding-top: rem(80);
  }
  .operating {
    text-align: right;
    position: fixed;
    top: rem(40);
    right: 0;
    z-index: 99;
    background: #fff;
    span {
      display: inline-block;
      border: rem(1) solid #409eff;
      color: #409eff;
      padding: rem(2) rem(4);
      border-radius: rem(2);
    }
  }
  .scale-warp {
    height: 100%;
    position: relative;
    transform: scale(1);
    transform-origin: top left;
  }
}
</style>
