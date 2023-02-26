<template>
  <div id="attractPosition">
    <span class="page_head_title">项目设计</span>
    <ul class="default_tab_block">
      <li @click="changeTab"
          v-if="hasAuthority('02010301')">
        <span>项目规划图</span>
      </li>
      <li class="active"
          v-if="hasAuthority('02010304')">
        <span>CAD底图</span>
      </li>
    </ul>
    <div class="search-bar">
      <div class="search-left">
        <el-select v-model="chartType"
                   @change='loadSvg'>
          <el-option label="底图"
                     value=""></el-option>
          <el-option label="工程底图"
                     value="CONDITION"></el-option>
        </el-select>
        <el-select v-model="projectManagementId"
                   placeholder="项目"
                   @change='getDataAuthorityOptions2(true)'>
          <el-option v-for="item in options2"
                     :key="item.id"
                     :label="item.referred"
                     :value="item.id">
          </el-option>
        </el-select>

        <el-select v-model="planeType"
                   placeholder="楼栋"
                   @change='getDataAuthorityOptions3(true)'>
          <el-option v-for="item in options1"
                     :key="item.id"
                     :label="item.buildingName"
                     :value="item.id">
          </el-option>
        </el-select>

        <el-select v-model="floorName"
                   placeholder="楼层"
                   @change='loadSvg'>
          <el-option v-for="item in options3"
                     :key="item.name"
                     :label="item.name"
                     :value="item.name">
          </el-option>
        </el-select>

        <span v-if="hasAuthority('02010301')"
              class="upload">
          <el-button type="primary"
                     size="small"> 上 传 </el-button>
          <input type="file"
                 @change="imageChange($event)"
                 id="imageChange">
          <span class="warnTip"
                v-if="svgHtml!==''"
                @click="warnTip"></span>
        </span>
        <i style="font-size:10px;color:#999;height: 50px; line-height: 80px;margin-left:15px">(建议尺寸1920*1080 大小4M以内)</i>
      </div>
      <div class="search-right">
        <span v-if="hasAuthority('02010302')"
              class="upload">
          <el-button class="iconfont icon-bianji-"
                     :class="[isEmpty?'disabled':'editBtn']"
                     :disabled="isEmpty"
                     @click="goSvgEditor"> 编辑</el-button>
        </span>
      </div>
    </div>
    <div class="content">
      <div class="saclBtn">
        <el-button size="mini"
                   class="iconfont icon-yuanshidaxiao  up"
                   :disabled="defaultScale===initScale"
                   style="margin-left:10px"
                   @click="resetScal"> 原始大小</el-button>
        <el-button size="mini"
                   class="iconfont icon-suoxiao shrink"
                   :disabled="defaultScale<0.3"
                   style="margin-left:10px"
                   @click="shrink"> 缩小</el-button>
        <el-button size="mini"
                   class="iconfont icon-fangda  up"
                   :disabled="defaultScale>1.5"
                   @click="up"> 放大</el-button>

      </div>
      <div id="svgDiv">
        <span class="svgHtml"
              id="svgHtml"
              v-html="svgHtml"
              v-show="svgHtmlShow"></span>
      </div>
      <span class="noData"
            v-if="(svgHtml==='' || !svgHtml) ? true :false">暂无平面图</span>
    </div>
    <!-- 删除提示弹窗 -->
    <el-dialog :visible.sync="deleteDialog"
               width="21%"
               center>
      <div class="deleteDialog">
        <img src="../../../../assets/delete1.png" />
        <div>
          <p>警告</p>
          <span>确认后，将替换当前平面图！</span>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="deleteDialog = false">取 消</el-button>
        <span class="footer">
          <el-button type="primary"
                     @click="deleteFun">确 定</el-button>
          <input type="file"
                 @change="imageChange($event)"
                 id="imageChange1">
        </span>

      </span>
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
export default {
  name: 'attractPosition',
  components: {
  },
  watch: {
    svgHtml: {
      handler: function (n, o) {
        this.isEmpty = this.svgHtml === ''
        console.log(this.isEmpty)
      }
    }
  },
  data () {
    return {
      chartType: '',
      initScale: 1,
      defaultScale: '1',
      translateX: '0',
      translateY: '0',
      deleteDialog: false,
      isEmpty: true, // svgHtml是否为空
      options1: [],
      options2: [],
      options3: [],
      svgHtml: '',
      projectManagementId: '',
      planeType: '',
      floorName: '',
      svgHtmlShow: false
    }
  },
  created () {
    this.getDataAuthorityOptions()
  },
  mounted () {
  },
  methods: {
    resetScal () {
      let svgW = parseInt($('#svgHtml svg').attr('width'))
      let svgH = parseInt($('#svgHtml svg').attr('height'))
      this.defaultScale = this.initScale
      $('#svgHtml svg').css({
        'transform': `scale(${this.defaultScale})`,
        'transform-origin': '0 0 0'
      })
      $('#svgDiv').css({
        'overflow': 'inherit',
        'justify-content': 'center'
      })
      $('#svgHtml').width(svgW * this.defaultScale)
      $('#svgHtml').height(svgH * this.defaultScale)
    },
    shrink () {
      // let scaleArr = [this.defaultScale - 0.5, this.defaultScale - 0.25, this.defaultScale, this.defaultScale + 0.25, this.defaultScale + 0.5]
      // let index = scaleArr.indexOf(this.zoom)
      // if (index === 0) {
      //   console.log('return')
      //   return
      // }
      // let scale = scaleArr[index - 1]
      // this.zoom = scale
      // if (scale <= this.defaultScale) {
      //   $('#svgDiv').css('overflow', 'inherit')
      //   $('#svgHtml').css({
      //     margin: 'auto'
      //   })
      // } else {
      //   scale = scale - 0.25
      //   $('#svgDiv').css('overflow', 'scroll')
      // }
      if (this.defaultScale < 0.3) {
        return
      }
      this.defaultScale = this.defaultScale - 0.1
      let DIVw = $('#svgDiv').width()
      let DIVh = $('#svgDiv').height()
      let svgW = parseInt($('#svgHtml svg').attr('width'))
      let svgH = parseInt($('#svgHtml svg').attr('height'))
      // let translateX = (svgW * scale - svgW) / 2 / scale + 'px'
      // let translateY = (svgH * scale - svgH) / 2 / scale + 'px'
      // $('#svgHtml svg').css('transform', `scale(${scale}) translate(${translateX},${translateY})`)
      if (this.defaultScale > this.initScale) { // 如果当前比例大于默认比例则出现滚动条
        $('#svgDiv').css({
          'overflow': 'scroll',
          'justify-content': 'flex-start'
        })
      } else {
        $('#svgDiv').css({
          'overflow': 'inherit',
          'justify-content': 'center'
        })
      }
      $('#svgHtml svg').css({
        'transform': `scale(${this.defaultScale})`,
        'transform-origin': '0 0 0'
      })
      $('#svgHtml').width(svgW * this.defaultScale)
      $('#svgHtml').height(svgH * this.defaultScale)
    },
    up () {
      // let scaleArr = [this.defaultScale - 0.5, this.defaultScale - 0.25, this.defaultScale, this.defaultScale + 0.25, this.defaultScale + 0.5]
      // let index = scaleArr.indexOf(this.zoom)
      // if (index === scaleArr.length - 1) {
      //   console.log('return')
      //   return
      // }
      // let scale = scaleArr[index + 1]
      // this.zoom = scale
      if (this.defaultScale > 1.5) {
        return
      }
      this.defaultScale += 0.1
      let DIVw = $('#svgDiv').width()
      let DIVh = $('#svgDiv').height()
      let svgW = parseInt($('#svgHtml svg').attr('width'))
      let svgH = parseInt($('#svgHtml svg').attr('height'))
      // let translateX = (svgW * scale - svgW) / 2 / scale + 'px'
      // let translateY = (svgH * scale - svgH) / 2 / scale + 'px'
      if (this.defaultScale > this.initScale) { // 如果当前比例大于默认比例则出现滚动条
        $('#svgDiv').css({
          'overflow': 'scroll',
          'justify-content': 'flex-start'
        })
      } else {
        $('#svgDiv').css({
          'overflow': 'inherit',
          'justify-content': 'center'
        })
      }
      // $('#svgHtml svg').css('transform', `scale(${this.defaultScale}) translate(${translateX},${translateY})`)
      $('#svgHtml svg').css({
        'transform': `scale(${this.defaultScale})`,
        'transform-origin': '0 0 0'
      })
      $('#svgHtml').width(svgW * this.defaultScale)
      $('#svgHtml').height(svgH * this.defaultScale)
    },
    deleteDialogFn () {

    },
    deleteFun () {

    },
    warnTip () {
      this.deleteDialog = true
    },
    changeTab () {
      this.$router.push({ name: 'industryPlanning', params: { projectId: this.projectManagementId, buildingId: this.planeType, floorId: this.floorName } })
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    async getDataAuthorityOptions () {
      let result = await context.http.get('cms/api/project-managements', { page: 0, size: 100, sort: 'desc', useStatus: 'USING' })
      this.options2 = result.data
      this.projectManagementId = this.$route.params.projectId ? this.$route.params.projectId : this.options2[0].id
      this.getDataAuthorityOptions2()
    },
    async getDataAuthorityOptions2 (mark) {
      // let result = await context.http.get('cms/api/buildings', { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING', projectId: this.projectManagementId })
      let result = await context.http.get('cms/api/buildings/newList', { page: 0, size: 100, sort: 'sortNumber,asc', useStatus: 'USING', projectId: this.projectManagementId })
      // this.options1 = result.data
      this.options1 = result.data.filter((item, index) => {
        return item.assetsType === 'BUILDING'
      })
      this.options1.unshift({ id: null, buildingName: '层平面图' })
      if (!mark) {
        this.planeType = this.$route.params.buildingId ? this.$route.params.buildingId : this.options1[0].id
        this.getDataAuthorityOptions3()
      } else {
        this.planeType = this.options1[0].id
        this.getDataAuthorityOptions3(true)
      }
    },
    async getDataAuthorityOptions3 (mark) {
      let result = await context.http.get('cms/api/floors/svg', { projectManagementId: this.projectManagementId, buildingId: this.planeType })
      this.options3 = result.data
      let defultFloorName = ''
      this.options3.forEach((item, index) => {
        if (item.name === '1' || item.name === '一层' || item.name === '一' || item.name === '1层') {
          defultFloorName = item.name
        }
      })
      defultFloorName = defultFloorName === '' ? this.options3[0].name : defultFloorName
      if (!mark) {
        this.floorName = this.$route.params.floorId ? this.$route.params.floorId : defultFloorName
      } else {
        this.floorName = defultFloorName
      }

      this.loadSvg()
    },
    async loadSvg () {
      this.svgHtmlShow = false
      let _this = this
      let plType = 'MALL'
      if (this.planeType) {
        plType = 'MALL'
      } else {
        plType = 'MALL_FLOOR'
      }
      let result = await context.http.get('cms/api/plan', { planeStyle: this.chartType, floorName: this.floorName, planeType: plType, projectManagementId: this.projectManagementId, buildingName: this.planeType })
      result.data.svg ? (this.svgHtml = result.data.svg) : (this.svgHtml = '')
      this.svgId = result.data.id
      setTimeout(function () {
        $('#svgDiv svg  title').remove()
        _this.SVGAutoscale()
      }, 500)
      console.log(result)
    },
    imageChange (event) { // 上传SVg
      if (this.projectManagementId === '' || this.planeType === '' || this.floorName === '') {
        this.$message({
          message: '请选择对应项目、楼号、楼层',
          type: 'error'
        })
        return
      }
      let files = event.target.files
      let fileSize = files[0].size
      let name = files[0].name
      let index = name.lastIndexOf('.')
      let type = name.substr(index + 1).toLowerCase()
      if (index > 0 && type !== 'svg') {
        this.$message({
          message: '格式错误，请上传svg格式文件',
          type: 'error'
        })
        return
      }
      if (parseInt(fileSize) > 2097152) { // 不大于2M
        this.$message({
          message: 'svg大于2M',
          type: 'error'
        })
        return
      }
      let _this = this
      let form = new FormData()
      form.append('file', files[0])
      let plType = 'MALL'
      if (this.planeType) {
        plType = 'MALL'
      } else {
        plType = 'MALL_FLOOR'
      }
      form.append('planeStyle', this.chartType)
      form.append('planeType', plType)
      form.append('projectManagementId', this.projectManagementId)
      form.append('floorName', this.floorName)
      form.append('buildingName', this.planeType)
      if (this.svgId) {
        form.append('id', this.svgId)
      }
      context.http.post('/cms/api/plan', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
        this.svgHtmlShow = false
        this.svgHtml = res.data.svg
        this.svgId = res.data.id
        this.$message({
          message: '平面图上传成功！',
          type: 'success'
        })
        this.deleteDialog = false
        document.getElementById('imageChange').value = ''
        document.getElementById('imageChange1').value = ''
        setTimeout(function () {
          $('#svgDiv svg  title').remove()
          _this.SVGAutoscale()
        }, 500)
      }).catch(error => {
        this.$message({
          message: error,
          type: 'error'
        })
      })
    },
    goSvgEditor () {
      if (!this.svgHtml || this.svgHtml === '') return
      let floorName = encodeURI(encodeURI(this.floorName))
      let origin = window.location.origin
      console.log(origin)
      console.log(this.planeType)
      if (this.planeType) {
        window.open(origin + '/svg-editor/index.html?projectManagementId=' + this.projectManagementId + '&planeStyle=' + this.chartType + '&floorName=' + floorName + '&buildingName=' + this.planeType + '&planeType=MALL', '_blank')
      } else {
        window.open(origin + '/svg-editor/index.html?projectManagementId=' + this.projectManagementId + '&planeStyle=' + this.chartType + '&floorName=' + floorName + '&planeType=MALL_FLOOR', '_blank')
      }
    },
    SVGAutoscale () { // sgv自适应页面大小
      // console.log(window.location.origin)
      // let DIVw = $('#svgDiv').width()
      // let DIVh = $('#svgDiv').height()
      // if (!$('#svgHtml svg').attr('width') || !$('#svgHtml svg').attr('height')) {
      //   $('#svgHtml svg').attr('width', '1980')
      //   $('#svgHtml svg').attr('height', '1080')
      // }
      // let svgW = parseInt($('#svgHtml svg').attr('width'))
      // let svgH = parseInt($('#svgHtml svg').attr('height'))
      // let defaultScale = 1
      // let translateX = 0
      // let translateY = 0
      // if (svgW > DIVw) {
      //   defaultScale = DIVw / svgW
      //   translateX = -(svgW - svgW * defaultScale) / 2 / defaultScale + 'px'
      //   translateY = -(svgH - svgH * defaultScale) / 2 / defaultScale + 'px'
      // } else {
      //   translateX = (DIVw - svgW) / 2 + 'px'
      // }
      // this.defaultScale = defaultScale
      // this.translateX = translateX
      // this.translateY = translateY
      // this.zoom = defaultScale
      // $('#svgDiv').height(svgH * defaultScale)
      // $('#svgHtml svg').css('transform', `scale(${defaultScale}) translate(${translateX},${translateY})`)
      // $('#svgHtml').width(svgW * defaultScale)
      // $('#svgHtml').height(svgH * defaultScale)
      // this.svgHtmlShow = true
      // sgv自适应页面大小
      let DIVw = $('#svgDiv').width()
      let DIVh = $('#svgDiv').height()
      if (
        !$('#svgHtml svg').attr('width') ||
        !$('#svgHtml svg').attr('height')
      ) {
        $('#svgHtml svg').attr('width', '1980')
        $('#svgHtml svg').attr('height', '1080')
      }
      let svgW = parseInt($('#svgHtml svg').attr('width'))
      let svgH = parseInt($('#svgHtml svg').attr('height'))
      let defaultScale = 1
      if (svgW > DIVw) {
        defaultScale = DIVw / svgW
      } else {
      }
      this.defaultScale = defaultScale
      this.initScale = defaultScale // 默认缩放比例 =》是否展示滚动条
      $('#svgDiv').css({
        height: svgH * defaultScale,
        overflow: 'inherit'
      })
      $('#svgHtml').width(svgW * defaultScale)
      $('#svgHtml').height(svgH * defaultScale)
      this.svgHtmlShow = true
      this.$nextTick(() => {
        $('#svgHtml svg').css({
          'transform': `scale(${this.defaultScale})`,
          'transform-origin': '0 0 0'
        })
      })
    }
  }
}
</script>
<style lang="scss" >
#attractPosition {
  .el-dialog__body {
    border-bottom: none;
    padding: 30px 0 !important;
  }
  .el-dialog__footer {
    text-align: right;
    .footer {
      display: inline-block;
      position: relative;
      input {
        position: absolute;
        right: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
    }
  }
  // 覆盖element样式
  .el-button {
    &.iconfont {
      padding: 8px 10px;
      background-color: #ffffff;
      font-size: 14px !important;
      &.editBtn {
        border-color: #b3bcfc;
        color: #4155f5;
        &:hover {
          background-color: #f6f7ff;
        }
      }
      &.deleteBtn {
        border-color: #ffabb9;
        color: #ed3753;
        &:hover {
          background-color: #fff7f8;
        }
      }
      &.up {
        padding: 7px 8px;
      }
      &.shrink {
        padding: 7px 8px;
      }
    }
  }
  .el-button--primary {
    background-color: #3577f6;
  }
  .el-button--primary:hover {
    background: #66b1ff;
    border-color: #66b1ff;
    color: #fff;
  }
  .el-dialog__header {
    border: none;
  }
  .el-dialog__body {
    .deleteDialog {
      display: flex;
      div {
        margin-left: 15px;
        display: flex;
        flex-wrap: wrap;
        p {
          color: #666666;
          font-size: 20px;
          font-weight: 600;
          width: 100%;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
svg polygon.bind,
svg path.bind,
svg rect.bind {
  stroke-width: "2px" !important;
  stroke: "#00ff00" !important;
  fill: "rgba(0,0,0,0.2)" !important;
}
.typeTab {
  height: 50px;
  line-height: 50px;
  background-color: #ffffff;
  margin-top: 15px;
  box-shadow: 4px 4px 4px 1px #eee;
  > span {
    display: inline-block;
    width: 120px;
    text-align: center;
    cursor: pointer;
    &.active {
      color: #3175d2;
      border-bottom: 2px solid #3175d2;
    }
  }
}
.search-bar {
  .search-left {
    display: inline-flex;
  }
}
.content {
  min-height: 750px;
  background-color: #ffffff;
  position: relative;
  padding-bottom: 50px;
  .saclBtn {
    display: flex;
    flex-direction: row-reverse;
    padding: 10px 20px 10px 0;
  }
  #svgDiv {
    height: 750px;
    position: relative;
    overflow: auto;
    display: flex;
    justify-content: center;
    &::-webkit-scrollbar {
      width: 4px !important;
      height: 4px !important;
    }
    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px #ffffff;
      background-color: #ffffff;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 6px #cccccc;
    }
  }
  #svgDiv > span {
    display: inline-block;
  }
  .noData {
    background-color: rgba(0, 0, 0, 0.5);
    color: #ffffff;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 150px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-radius: 5px;
  }
}
svg {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
svg path:hover {
  fill: #000;
  fill-opacity: 0.1;
}
svg polygon:hover {
  fill: #000;
  fill-opacity: 0.1;
}
svg rect:hover {
  fill: #000;
  fill-opacity: 0.1;
}
.upload {
  position: relative;
  display: inline-block;
  border-radius: 2px;
  cursor: pointer;
  margin-left: 10px;
  input {
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  .warnTip {
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    margin-right: 0px;
  }
}
.defaultBtn {
  background: #ccc;
  border-color: #ccc;
}
.defaultBtn:hover {
  background: #ccc;
  border-color: #ccc;
}
</style>
<style lang="scss">
#attractPosition {
  // border-bottom: none;
  // padding: 25px 25px 30px !important;
  // 覆盖element样式
  .el-button {
    &.iconfont {
      padding: 8px 10px;
      background-color: #ffffff;
      font-size: 14px !important;
      &.editBtn {
        border-color: #b3bcfc;
        color: #4155f5;
        &:hover {
          background-color: #f6f7ff;
        }
      }
      &.deleteBtn {
        border-color: #ffabb9;
        color: #ed3753;
        &:hover {
          background-color: #fff7f8;
        }
      }
      &.up {
        padding: 7px 8px;
      }
      &.shrink {
        padding: 7px 8px;
      }
    }
  }
  .el-button--primary {
    background-color: #3577f6;
  }
  .el-button--primary:hover {
    background: #66b1ff;
    border-color: #66b1ff;
    color: #fff;
  }
}
</style>

