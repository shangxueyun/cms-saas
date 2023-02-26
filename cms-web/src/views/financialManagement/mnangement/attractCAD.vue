<template>
  <div id="attractCAD">
      <!--<p class="title" style="font-weight: normal;color:#333" v-if="!homeReference">平面图</p>-->
      <div class="seachDiv">
        <span>
          <el-select v-model="projectManagementId" placeholder="项目"  @change='getBuliding'>
            <el-option
              v-for="item in options2"
              :key="item.id"
              :label="item.projectName"
              :value="item.id">
            </el-option>
          </el-select>
        </span>
        <span>
          <el-select v-model="buildingName" placeholder="层/楼平面图" @change="projectChanged">
            <el-option
            v-for="item in options1"
            :key="item.id"
            :label="item.buildingName"
            :value="item.id">
            </el-option>
          </el-select>
        </span>
        <span>
          <el-select v-model="floorName" placeholder="楼层" >
            <el-option
              v-for="item in options3"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </span>
        <span class="upload">
          <el-button type="primary" @click="checkFun" v-if="hasAuthority('02020301')">查 找</el-button>
          <el-button type="info" v-else>暂无查看平面图权限</el-button>
        </span>
      </div>
      <!--<div class="menu" v-if="!homeReference">
        <span class="active">招商进度</span>
        <span @click="switchover">业态分布</span>
      </div>-->
      <div class="content">
        <div class="saclBtn">
          <div class="tips">
            <span><i style="background-color:#FEF301"></i>无意向客户</span>
            <span><i style="background-color:#A3FE03"></i>招商跟进中</span>
            <span><i style="background-color:#41FEF5"></i>签约审批中</span>
            <span><i style="background-color:#4882F3"></i>合同执行中</span>
            <!-- <span><i style="background-color:#ffffff;border:1px solid #eee"></i>未关联房源</span> -->
          </div>
          <el-button type="primary" size="mini"  icon="el-icon-zoom-in" style="margin-left:15px" @click="up">放大</el-button>
          <el-button size="mini"  icon="el-icon-zoom-out" @click="shrink">缩小</el-button>
        </div>
        <div id="svgDiv" @scroll="handleScroll">
          <span class="svgHtml" id="svgHtml" v-html="svgHtml"  v-show="svgHtmlShow"  @click="clickFun($event)" @contextmenu.prevent='editFn($event)' ></span>
        </div> 
        <span class="noData" v-if="svgHtml==='' ? true :false">暂无平面图</span>
        <div class="showBox" id="showBox" v-show="showBox">
          <p>{{roomInfo.shopNumber}}&nbsp;&nbsp;&nbsp;{{roomInfo.buildingArea}}m²</p>
          <!-- 优先展示意向客户（意向客户数量） -->
          <p v-if="roomInfo.firstDisplay==='YXTENANT'">【{{roomInfo.yxTenantNumber}}】</p>
          <p v-if="roomInfo.referred">{{roomInfo.referred}}</p>
          <!-- 优先展示合同（合同结束时间） -->
          <p v-if="roomInfo.firstDisplay==='CONTRACT'">{{roomInfo.contractEndDate}}</p>
        </div>
      </div>
      <intentionList
        v-if="roomInvestmentFlag"
        :detailsdrawershow="detailsShow"
        :totalChild="total"
        :yxTenantListChild="yxTenantList"
        :roomInvestmentData="roomInvestment"
        ref="intentionList"
        @drawerClose="detailsClose"/> 
  </div>
</template>

<script>
    import context from '@/service'
    import intentionList from './components/intentionList'
    export default {
      name: 'attractCAD',
      props: ['homeReference'], // 是否被首页当子组件引用
      components: {
        intentionList
      },
      data () {
        return {
          detailsShow: false, // 侧边弹窗
          planeType: 'FLOOR', // 平面图类型
          projectManagementId: '', // 商圈
          floorName: '', // 楼层
          buildingName: '', // 楼号
          berthPlan: 'CANVASS_BUSINESS', // 房源平面
          options1: [],
          options2: [],
          options3: [],
          svgHtml: '',
          svgHtmlShow: false,
          roomList: '', // 所有房间列表信息
          roomInfo: {
            building: {projectManagementDTO: {previewImage: '', projectName: ''}},
            contractDTOS: {startDate: '', endDate: ''},
            floor: {name: ''},
            shopNumber: null,
            buildingArea: null,
            referred: null
          }, // 单个房间信息
          yxTenantList: [], // 意向客户列表
          total: 0,
          showBox: false, // 选中展示详情信息
          maxScale: 1,
          maxScaleX: 1,
          maxScaleY: 1,
          lastTag: null,
          defaultScale: 1,
          zoom: 1,
          roomInvestmentFlag: false,
          roomInvestment: {
            'roomsDTO': {
              'building': {'projectManagementDTO': {'previewImage': '', 'projectName': ''}},
              'projectManagement': {'projectName': ''},
              'imgUrls': []
            }
          }
        }
      },
      created () {
        this.options2 = this.$store.state.projectManagementsList
        this.projectManagementId = this.$route.params.projectManagementId ? this.$route.params.projectManagementId : this.$store.state.projectManagementsList[0].id
        // this.projectManagementId = this.$route.params.projectManagementId
        this.floorName = this.$route.params.floorName
        this.getBuliding()
  },
      mounted () {
      },
      methods: {
        handleScroll (el) {
          this.showBox = false
        },
        hasAuthority (code) {
          return context.user.hasAuthority(code)
        },
        clickFun (event) { // 左键展示房间详情
          let self = event.target
          let _this = this
          let top = parseInt($('#svgHtml').css('marginTop'))
          let left = parseInt($('#svgHtml').css('marginLeft'))
          this.showBox = false
          if (self.tagName === 'path' || self.tagName === 'polygon' || self.tagName === 'rect') {
            if (this.lastTag) {
              $(this.lastTag).attr({'stroke-width': $(self).attr('stroke-width'), 'stroke': '#000000'})
            }
            $(self).attr({'stroke-width': '2px', 'stroke': '#00ff00'})
            this.lastTag = self
            for (var i = 0; i < this.roomList.length; i++) {
              if (self.id === this.roomList[i].svgId) {
                this.showBox = true
                $('#showBox').css({top: event.offsetY * this.zoom + 80 - $('#svgDiv').scrollTop(), left: event.offsetX * this.zoom - $('#svgDiv').scrollLeft()})
                this.roomInfo = this.roomList[i]
              }
            }
          }
        },
        editFn (event) { // 右键查看详情
          this.showBox = false
          let self = event.target
          if (self.tagName === 'path' || self.tagName === 'polygon' || self.tagName === 'rect') {
            if (this.lastTag) {
              $(this.lastTag).attr({'stroke-width': $(self).attr('stroke-width'), 'stroke': '#000000'})
            }
            $(self).attr({'stroke-width': '2px', 'stroke': '#00ff00'})
            this.lastTag = self
            for (var i = 0; i < this.roomList.length; i++) {
              if (self.id === this.roomList[i].svgId) {
                this.roomInfo = this.roomList[i]
                this.yxTenantListFn(this.roomList[i].id)
                this.getRoominvestment(this.roomList[i].id)
              }
            }
          }
        },
        async yxTenantListFn (id) { // 意向客户列表
          let result = await context.http.get('cms/api/yxTenant/rooms', {roomsId: id})
          this.yxTenantList = result.data
          this.total = Number(result.headers['x-total-count'])
        },
        async getRoominvestment (id) { // 单独接口获取房源详情
          let result = await context.http.get(`cms/api/rooms/investment/${id}`)
          this.roomInvestment = result.data
          this.roomInvestmentFlag = true
          this.detailsShow = true
        },
        async checkFun () { // 查看对应平面图
          if (this.floorName === '' || this.projectManagementId === '') {
            this.$message({
              type: 'error',
              message: '请选择项目和楼层'
            })
            return
          }
          let _this = this
          if (this.buildingName) {
            this.planeType = 'BUILDING'
          } else {
            this.planeType = 'FLOOR'
          }
          let result = await context.http.get('cms/api/plan/business', {floorName: this.floorName, planeType: this.planeType, projectManagementId: this.projectManagementId, planeStyle: this.berthPlan, buildingName: this.buildingName})
          this.svgHtml = result.data.svg
          this.svgId = result.data.id
          result.data.roomsDTOS ? this.roomList = result.data.roomsDTOS : this.roomList = []
          this.svgHtmlShow = false
          setTimeout(function () {
            $('#svgDiv svg  title').remove()
            _this.renderSVG()
            _this.SVGAutoscale()
          }, 500)
        },
        SVGAutoscale () { // sgv自适应页面大小
          let DIVw = $('#svgDiv').width()
          let DIVh = $('#svgDiv').height()
          if (!$('#svgHtml svg').attr('width') || !$('#svgHtml svg').attr('height')) {
            $('#svgHtml svg').attr('width', '1980')
            $('#svgHtml svg').attr('height', '1080')
          }
          let svgW = parseInt($('#svgHtml svg').attr('width'))
          let svgH = parseInt($('#svgHtml svg').attr('height'))
          let defaultScale = 1
          let translateX = 0
          let translateY = 0
          if (svgW > DIVw) {
            defaultScale = DIVw / svgW
            translateX = -(svgW - svgW * defaultScale) / 2 / defaultScale + 'px'
            translateY = -(svgH - svgH * defaultScale) / 2 / defaultScale + 'px'
          } else {
            translateX = (DIVw - svgW) / 2 + 'px'
          }
          this.defaultScale = defaultScale
          this.zoom = defaultScale
          $('#svgDiv').height(svgH * defaultScale)
          $('#svgHtml svg').css('transform', `scale(${defaultScale}) translate(${translateX},${translateY})`)
    
          $('#svgHtml').width($('#svgHtml svg').width() * defaultScale)
          $('#svgHtml').height($('#svgHtml svg').height() * defaultScale)
          this.svgHtmlShow = true
        },
        shrink () {
          // $('#svgHtml').css('transform', 'scale(0.85)')
          let scaleArr = [this.defaultScale - 0.5, this.defaultScale - 0.25, this.defaultScale, this.defaultScale + 0.25, this.defaultScale + 0.5]
          let index = scaleArr.indexOf(this.zoom)
          if (index === 0) {
            console.log('return')
            return
          }
          let scale = scaleArr[index - 1]
          this.zoom = scale
          let DIVw = $('#svgDiv').width()
          let DIVh = $('#svgDiv').height()
          let svgW = parseInt($('#svgHtml svg').attr('width'))
          let svgH = parseInt($('#svgHtml svg').attr('height'))
          let translateX = (svgW * scale - svgW) / 2 / scale + 'px'
          let translateY = (svgH * scale - svgH) / 2 / scale + 'px'
          if (scale <= this.defaultScale) {
            $('#svgDiv').css('overflow', 'inherit')
          } else {
            $('#svgDiv').css('overflow', 'scroll')
          }
          $('#svgHtml svg').css('transform', `scale(${scale}) translate(${translateX},${translateY})`)
          $('#svgHtml').width(svgW * scale)
          $('#svgHtml').height(svgH * scale)
        },
        up () {
          let scaleArr = [this.defaultScale - 0.5, this.defaultScale - 0.25, this.defaultScale, this.defaultScale + 0.25, this.defaultScale + 0.5]
          let index = scaleArr.indexOf(this.zoom)
          if (index === scaleArr.length - 1) {
            console.log('return')
            return
          }
          let scale = scaleArr[index + 1]
          this.zoom = scale
          let DIVw = $('#svgDiv').width()
          let DIVh = $('#svgDiv').height()
          let svgW = parseInt($('#svgHtml svg').attr('width'))
          let svgH = parseInt($('#svgHtml svg').attr('height'))
          let translateX = (svgW * scale - svgW) / 2 / scale + 'px'
          let translateY = (svgH * scale - svgH) / 2 / scale + 'px'
          if (scale > this.defaultScale) {
            $('#svgDiv').css('overflow', 'scroll')
          } else {
            $('#svgDiv').css('overflow', 'inherit')
          }
          $('#svgHtml svg').css('transform', `scale(${scale}) translate(${translateX},${translateY})`)
          $('#svgHtml').width(svgW * scale)
          $('#svgHtml').height(svgH * scale)
        },
        // eslint-disable-next-line no-dupe-keys
        renderSVG () { // 重新渲染svg
          let arr = this.roomList
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].svgId) {
              let svgId = arr[i].svgId
              let areaText = arr[i].buildingArea + 'm²'
              let shopNbId = svgId.replace('svg', 'shopNb')
              let areaId = shopNbId.replace('shopNb', 'area')
              let x = $('#' + shopNbId).attr('x')
              let y = Number($('#' + shopNbId).attr('y')) + 14
              let areaNode = $('<text id="' + areaId + '" x="' + x + '" y="' + y + '" font-size="12px" font-family="MicrosoftYaHei, Microsoft YaHei">' + areaText + '</text>')
              if ($('#' + areaId).length === 0) {
                if (arr[i].referred && arr[i].industryDescription) { // 如存在商户简称(存在合同)&&存在意向颜色
                  $('#' + svgId).attr('fill', arr[i].industryDescription)
                } else if (arr[i].firstDisplay === 'CONTRACT' && arr[i].referred) { // 优先展示合同 &&有合同
                  $('#' + svgId).attr('fill', '#4882F3')
                } else {
                  $('#' + svgId).attr('fill', '#FEF301')
                }
                $('#svgDiv svg').find('text').eq(0).after(areaNode)
                this.svgHtml = $('#svgHtml').html()
              }
            }
          }
        },
        async getBuliding () {
          let result = await context.http.get('cms/api/buildings', { page: 0, size: 100, sort: 'desc', useStatus: 'USING', projectId: this.projectManagementId })
          console.log(result)
          if (result.data.buildingListDTOS && result.data.buildingListDTOS.length) {
            this.options1 = result.data.buildingListDTOS
            this.options1.push({id: null, buildingName: '层平面图'})
            this.buildingName = this.options1[0].id
            this.projectChanged()
          }
        },
        async projectChanged () { // 选定商圈请求楼层
          let result = await context.http.get('cms/api/floors/svg', {projectManagementId: this.projectManagementId, buildingId: this.buildingName})
          this.options3 = result.data
          if (this.options3.length > 0) {
            this.floorName = this.$route.params.floorName ? this.$route.params.floorName : this.options3[0].name
            if (this.homeReference || this.$route.params.floorName) { // 如果是首页 或者是页面Tab切换 则直接查询
              this.checkFun()
            }
            this.$route.params.floorName = null
          }
        },
        switchover () { // 平面图切换
          this.$router.push({name: 'industryCAD', params: {projectManagementId: this.projectManagementId, floorName: this.floorName}})
        },
        detailsClose () {
          this.detailsShow = false
        }
      }
    }
</script>

<style lang="scss" scoped>
.tips{
  display: flex;
  border: 1px solid #eeeeee;
  color: #666666;
  padding-left: 15px;
  width: 80%;
  span{
    display: inline-block;
    // width: 50%;
    height: 46px;
    line-height: 46px;
    padding: 0 10px;
    i{
      margin-right: 10px;
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius:50%;
    }
  }
}
.saclBtn{
  display: flex;
  padding: 10px 20px 10px 0;
  justify-content: space-around;
}
.menu{
  height: 62px;
  line-height: 62px;
  border-bottom: 1px solid #eeeeee;
  margin-top: 15px;
  background-color: #ffffff;
  // padding-left: 20px;
  span{
    display: inline-block;
    width: 200px;
    height: 62px;
    text-align: center;
    cursor: pointer;
    &.active{
      border-bottom: 3px solid #3577f6;
      color:#3577f6;
    }
  }
}
.seachDiv{
  height: 80px;
  background-color: #ffffff;
  border-radius:5px; 
  box-shadow: 4px 4px 4px 1px #eee;
  display: flex;
  align-items: center;
  padding-left: 20px;
  span{
    margin-right: 40px;
  }
}
.content{
  min-height: 750px;
  background-color: #ffffff;
  margin-top: 15px;
  position: relative;
  padding-bottom: 50px;
}
#svgDiv{
  // display: flex;
  // justify-content:center;
  height: 500px;
  position: relative;
}
.svgHtml{
   width: 100%;
   height: 100%; 
  display: inline-block;
}
.noData{
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
svg{
  position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
}
.showBox{
  width: 145px;
  height: 80px;
  position: absolute;
  top: 0px;
  left: 100px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  color: #fff;
  font-size: 12px;
  display: flex;
  flex-direction:column ;
  justify-content:center;
  padding-left: 10px;
}
</style>
