<template>
  <div>
    <div class="ailPreview">
      <i class="iconfont icon-cms_chakan-"
         @click="preview()"></i>
    </div>
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
    <!-- xlsx文件预览 -->
    <el-dialog class="previewDialog"
               title="文件预览"
               :visible.sync="xlsxVisible"
               append-to-body
               width="1000px">
      <div class="fileContent"
           v-html="xlsxData"></div>
      <span slot="footer"
            class="dialog-footer">
        <!-- <el-button @click="xlsxVisible = false">关闭</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
import XLSX from 'xlsx'
import mammoth from 'mammoth'
import picturePrevie from '@/components/picturePrevie.vue'
export default {
  name: 'ailPreview',
  components: {
    picturePrevie
  },
  props: {
    ailObj: '',
    encrypt: { // 下载是否做加密处理，默认不加密采用阿里oss下载  加密则调用原始axios函数 后台处理加密
      type: Boolean,
      default: false
    },
    picturePreview: { // 预览组件内查看图片
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      xlsxVisible: false,
      xlsxData: '',
      imgArr: [],
      showPicture: false,
      num: 0
    }
  },
  methods: {
    pictureClose () {
      this.showPicture = false
    },
    preview () {
      let obj = this.ailObj
      let inx = obj.annexName.lastIndexOf('.')
      let fileType = obj.annexName.substring(inx)
      if (!this.encrypt) {
        if (this.picturePreview) {
          this.imgArr.push(this.ailObj.annexURL)
          this.showPicture = true
        } else {
          this.$emit('setFile', this.ailObj.annexURL)
        }
      } else {
        // 修改文件后缀名为大写JPG支持转小写
        let annexName = this.ailObj.annexName
        fileType = `${annexName.substr(annexName.lastIndexOf('.'), annexName.length)}`.toLocaleLowerCase()
        if (fileType === '.jpg' || fileType === '.png' || fileType === '.jpeg' || fileType === '.pdf' || fileType === '.txt' || fileType === '.doc' || fileType === '.xls' || fileType === '.ppt' ||
          fileType === '.docx' || fileType === '.dotx' || fileType === '.xlsx' || fileType === '.pptx') {
          let url = this.ailObj.annexURL || this.ailObj.annexUrl
          this.getURl(url, fileType)
        } else {
          this.$message({
            message: '暂时不支持此类型文件预览！',
            type: 'error',
            offset: 100
          })
        }
      }
    },
    getURl (annexURL, fileType) {
      this.imgArr = []
      context.http.get(`/cms/api/file/getUrl?fileName=${annexURL}`).then(result => {
        if (result.status === 200) {
          if (fileType === '.pdf' || fileType === '.txt') {
            window.open(result.data)
          } else if (fileType === '.jpg' || fileType === '.png' || fileType === '.jpeg') {
            if (this.picturePreview) {
              this.imgArr.push(result.data)
              this.showPicture = true
            } else {
              this.$emit('setFile', result.data)
            }
          } else if (fileType === '.docx' || fileType === '.dotx' || fileType === '.doc' || fileType === '.xlsx' || fileType === '.xls' || fileType === '.ppt' || fileType === '.pptx') {
            this.getFileBlob(result.data, fileType)
          }
        }
      })
    },
    getFileBlob (annexURL, fileType) {
      const loading = this.$loading({
        lock: true,
        text: '加载中。。。',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      })
      let obj = this.ailObj
      let axURL = annexURL
      context.http.get('/fpv/api/file/preview', {
        annexURL: axURL,
        annexName: obj.annexName
      }).then(res => {
        if (res.status === 200) {
          loading.close()
          window.open(res.data)
        }
      }).catch(err => {
        if (err.message.indexOf('timeout') !== -1 || err.response.status === 408) {
          this.getFileBlob(axURL, obj.annexName)
        } else {
          loading.close()
          this.$message.error('服务器错误，请稍后重试')
        }
      })
    },
    previewXLSX (FileData) {
      var f = FileData
      var reader = new FileReader()
      var _this = this
      reader.onload = function (e) {
        var data = e.target.result
        var wb = XLSX.read(data, {
          type: 'binary'
        })
        var worksheet = wb.Sheets[wb.SheetNames[0]]
        _this.xlsxData = XLSX.utils.sheet_to_html(worksheet)
        _this.xlsxVisible = true
      }
      reader.readAsBinaryString(f)
    },
    previewDocx (FileData) {
      var file = FileData
      console.time()
      var _this = this
      var reader = new FileReader()
      reader.onloadend = function (event) {
        var arrayBuffer = reader.result
        mammoth.convertToHtml({ arrayBuffer: arrayBuffer }).then(function (resultObject) {
          _this.xlsxData = resultObject.value
          _this.xlsxVisible = true
        })
        console.timeEnd()
      }
      reader.readAsArrayBuffer(file)
    },
    previewPPT (FileData) {
      var fileName = FileData
      var reader = new FileReader()
      var _this = this
      reader.onload = (function (theFile) {
        return function (e) {
          // Web Worker
          var worker = new Worker('static/pptx/worker.js')
          var result = ''
          worker.addEventListener('message', function (e) {
            var msg = e.data
            // console.info('Worker: ', msg.data)
            switch (msg.type) {
              case 'progress-update':
                // $('#load-progress').text(msg.data.toFixed(2) + '%')
                // .attr('aria-valuenow', msg.data.toFixed(2))
                // .css('width', msg.data.toFixed(2) + '%')
                break
              case 'slide':
                // $result.append(msg.data)
                result += msg.data
                break
              case 'processMsgQueue':
                _this.processMsgQueue(msg.data)
                break
              case 'pptx-thumb':
                // $('#pptx-thumb').attr('src', 'data:image/jpeg;base64,' + msg.data)
                break
              case 'slideSize':
                if (localStorage) {
                  localStorage.setItem('slideWidth', msg.data.width)
                  localStorage.setItem('slideHeight', msg.data.height)
                } else {
                  alert("Browser don't support Web Storage!")
                }
                break
              case 'globalCSS':
                // $result.append('<style>' + msg.data + '</style>')
                result += '<style>' + msg.data + '</style>'
                break
              case 'ExecutionTime':
                // $('#info_block').html('Execution Time: ' + msg.data + ' (ms)')
                // isDone = true
                _this.xlsxData = result
                _this.xlsxVisible = true
                worker.postMessage({
                  'type': 'getMsgQueue'
                })
                break
              case 'WARN':
                console.warn('Worker: ', msg.data)
                break
              case 'ERROR':
                console.error('Worker: ', msg.data)
                $('#error_block').text(msg.data)
                break
              case 'DEBUG':
                console.debug('Worker: ', msg.data)
                break
              case 'INFO':
              default:
                console.info('Worker: ', msg.data)
            }
          }, false)
          worker.postMessage({
            'type': 'processPPTX',
            'data': e.target.result
          })
        }
      })(fileName)
      reader.readAsArrayBuffer(fileName)
    },
    processMsgQueue (queue) {
      for (var i = 0; i < queue.length; i++) {
        this.processSingleMsg(queue[i].data)
      }
    },
    processSingleMsg (d) {
      var chartID = d.chartID
      var chartType = d.chartType
      var chartData = d.chartData

      var data = []

      var chart = null
      switch (chartType) {
        case 'lineChart':
          data = chartData
          chart = nv.models.lineChart()
            .useInteractiveGuideline(true)
          chart.xAxis.tickFormat(function (d) { return chartData[0].xlabels[d] || d })
          break
        case 'barChart':
          data = chartData
          chart = nv.models.multiBarChart()
          chart.xAxis.tickFormat(function (d) { return chartData[0].xlabels[d] || d })
          break
        case 'pieChart':
        case 'pie3DChart':
          data = chartData[0].values
          chart = nv.models.pieChart()
          break
        case 'areaChart':
          data = chartData
          chart = nv.models.stackedAreaChart()
            .clipEdge(true)
            .useInteractiveGuideline(true)
          chart.xAxis.tickFormat(function (d) { return chartData[0].xlabels[d] || d })
          break
        case 'scatterChart':

          for (var i = 0; i < chartData.length; i++) {
            var arr = []
            for (var j = 0; j < chartData[i].length; j++) {
              arr.push({ x: j, y: chartData[i][j] })
            }
            data.push({ key: 'data' + (i + 1), values: arr })
          }

          // data = chartData;
          chart = nv.models.scatterChart()
            .showDistX(true)
            .showDistY(true)
            .color(d3.scale.category10().range())
          chart.xAxis.axisLabel('X').tickFormat(d3.format('.02f'))
          chart.yAxis.axisLabel('Y').tickFormat(d3.format('.02f'))
          break
        default:
      }

      if (chart !== null) {
        d3.select('#' + chartID)
          .append('svg')
          .datum(data)
          .transition().duration(500)
          .call(chart)

        nv.utils.windowResize(chart.update)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.ailPreview {
  .iconfont {
    margin-right: 10px;
    cursor: pointer;
  }
}
</style>
<style  lang="scss">
@import "../style/mixins.scss";
@import "../../static/pptx/css/pptx2html.scss";
.fileContent {
  height: 600px;
  overflow-y: scroll;
  @include scrollBarStyle;
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
