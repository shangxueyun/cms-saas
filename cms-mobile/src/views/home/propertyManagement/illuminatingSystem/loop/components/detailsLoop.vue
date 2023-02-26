
<template>
  <div class="detailsLoop" v-if="hasAuthority('03080109')">
    <app-header :title="title" @confirmFn="confirmFn" :isconfirm="true" :mode="false">
      <!-- <div slot="rightBtn">
        <div @click.stop="submit">保存</div>
      </div> -->
    </app-header>
    <div class="headTitle" :class="{error : this.addData.loopType === 'ERROR'}">该回路运转{{ state }}</div>
    <div class="basicInfo">
      <div class="content">
        <div class="item">
          <span>项目<i class="required">*</i></span>
          <!-- @click="showProject = true" -->
          <span class="btn">
            <span>{{
              addData.projectManagementName
            }}</span>
            <!-- <span v-else class="selectBtn">请选择</span> -->
            <!-- <i class="iconfont iconright"></i> -->
          </span>
        </div>
        <div class="item">
          <span>回路名称<i class="required">*</i></span>
          <span class="btn" v-if="hasAuthority('03080108')">
            <input
              type="text"
              placeholder="请输入回路名称"
              v-model="addData.name"
              maxlength="50"
            />
          </span>
          <span v-else>{{addData.name}}</span>
        </div>
      </div>
    </div>
    <div class="basicInfo">
      <div class="content">
        <div class="item">
          <span>网关<i class="required">*</i></span>
          <span class="btn" @click="hasAuthority('03080108') ? showNet = true : null">
            <span v-if="addData.lightingGatewayName">{{
              addData.lightingGatewayName
            }}</span>
            <span v-else class="selectBtn">请选择网关</span>
            <i class="iconfont iconright" v-if="hasAuthority('03080108')"></i>
          </span>
        </div>
        <div class="item">
          <span>TagID<i class="required">*</i></span>
          <span class="btn"  v-if="hasAuthority('03080108')">
            <!-- <span v-if="addData.interfaces">{{
              addData.interfaces
            }}</span> -->
              <!-- v-else -->
            <input
              type="number"
              placeholder="请输入TagID"
              v-model="addData.interfaces"
              pattern="^[1-9]\d*$"
              maxlength="20"
            />
          </span>
          <span v-else>{{addData.interfaces}}</span>
        </div>
      </div>
    </div>
    <div class="basicInfo">
      <div class="content">
        <div class="item" style="border-bottom: none">
          <span>回路说明</span>
        </div>
        <div style="padding-bottom: 14px">
          <textarea maxlength="50"
                    cols='42%'
                    :readonly="hasAuthority('03080108') ? false : true"
                    rows=3
                    placeholder="您可输入此回路包含的照明设备数量、具体位置等信息（50字内）"
                    v-model="addData.remark"></textarea>
        </div>
      </div>
    </div>
    <div class="basicInfo">
      <div class="imgTitle">
        回路图片 {{ addData.imgurls ? addData.imgurls.length : 0 }}/9 <span class="yulan">（点击可预览）</span>
      </div>
      <div class="imgList">
        <div class="upLoadModule"
          v-if="hasAuthority('03080108') ? (!addData.imgurls || addData.imgurls.length <= 8) : false">
          <div><i class="iconfont icontianjiazhaopian"></i></div>
          <div class="tupian">添加图片</div>
          <aliUpload
            class="aliUpload"
            :fileType="fileType"
            :encrypt="false"
            @setAnnex="setAnnex"
          />
        
        </div>
        <!-- <div class="image">
          <svg class="icon"
                aria-hidden="true">
            <use :xlink:href="getformat(addData.imgurls)"></use>
          </svg>
        </div> -->
        <div class="imgBox imgBoxModel"
        v-for="(item,index) in addData.imgurls"
        :key="index"
        v-show="addData.imgurls.length"
        >
          <img
            :src="checkItem(item)"
            style="width: 100%; height: 100%"
            @click="showImg(addData.imgurls, index)"
          />
          <div
            v-if="hasAuthority('03080108')"
            class="iconfont iconcms_qingchu-238"
            @click="deleImg(item, index)"
          ></div>
        </div>
      </div>
    </div>
    <!-- 底部 -->
    <div class="footer" >
      <div class="operation-btn reject-btn"
           v-if="hasAuthority('03080110')"
           @click="deleteLoop()">删除</div>
      <div class="operation-btn"
           v-if="hasAuthority('03080108')"
           @click="submit">保存</div>
    </div>
    <!-- 项目 -->
    <van-popup
      v-model="showProject"
      position="bottom"
      :style="{ height: '40%' }"
    >
      <van-picker show-toolbar
                  title="项目" 
                  :columns="projectManagementList"
                  value-key="referred"
                  @confirm="onConfirmProject"
                  @cancel="onCancelProject"
                  :default-index="defaultProjectIndex" />
    </van-popup>
    <!-- 网关 -->
    <van-popup
      v-model="showNet"
      position="bottom"
      :style="{ height: '40%' }"
    >
      <van-picker show-toolbar 
                  title="网关" 
                  :columns="lightingGatewayList"
                  value-key="name"
                  @confirm="onConfirmNet"
                  @cancel="onCancelNet"
                  :default-index="defaultGatewayIndex" />
    </van-popup>
  </div>
</template>

<script>
import context from '@/service'
import AppHeader from '@/components/appHead'
import aliUpload from '@/components/aliUpload.vue'
import ailPreview from '@/components/ailPreview.vue'
import Common from '@/utils/common'
import moment from 'moment-timezone'
import { MessageBox } from 'mint-ui'
import Vue from 'vue'
import { RadioGroup, Radio, Toast, ImagePreview } from 'vant'
Vue.use(Toast)
Vue.use(Radio)
Vue.use(ImagePreview)
Vue.use(RadioGroup)
let roterFrom = null
let roterTo = null
export default {
  name: 'addMaintain',
  components: {
    AppHeader,
    ailPreview,
    aliUpload
  },
  computed: {

  },
  data () {
    return {
      title: '回路详情',
      showProject: false,
      showBuild: false,
      showFloor: false,
      showNet: false,
      showControl: false,
      showInter: false,
      defaultProjectIndex: 0,
      defaultBuildIndex: 0,
      defaultFloorIndex: 0,
      defaultGatewayIndex: 0,
      defaultControllerIndex: 0,
      defaultInterIndex: 0,
      columnsControl: [],
      columnsInter: [],
      showDatetime: false,
      showDatetime1: false,
      fileType: ['jpg', 'png', 'jpeg'],
      projectManagementList: [],
      buildingList: [],
      floorList: [],
      lightingGatewayList: [],
      lightingControllerList: [],
      interfacesList: [],
      addData: {
        buildingId: null,
        buildingName: '',
        floorId: null,
        floorName: '',
        imgurls: [],
        interfaces: '',
        lightingControllerId: null,
        lightingControllerName: '',
        lightingGatewayId: null,
        lightingGatewayName: '',
        lightingGroupId: null,
        lightingGroupName: '',
        loopType: '',
        name: '',
        onOff: false,
        projectManagementId: null,
        projectManagementName: '',
        remark: ''
      },
      oldData: {
        projectManagementId: null,
        projectManagementName: '',
        name: '',
        lightingGatewayId: null,
        lightingGatewayName: '',
        imgurls: [],
        remark: ''
      },
      selectItem: {},
      loopId: null,
      nameExist: false,
      state: '正常',
      changeImage: false
    }
  },
  created () {
    this.loopId = sessionStorage.getItem('loopId')
    sessionStorage.removeItem('loopId')
    this.changeImage = false
    this.query()
  },
  beforeRouteEnter (to, from, next) {
    next()
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  // 离开
  beforeRouteLeave (to, from, next) {
    if (to.name === 'illuminatingSystem') {
      // 默认数据
      to.params.filter = this.$route.params.filter
      to.params.config = this.$route.params.config
    }
    next()
  },
  mounted () {
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    async getNameExist () {
      const res = await context.http.get('rms/api/lightingLoop/nameExist', {
        buildingId: this.addData.buildingId,
        floorId: this.addData.floorId,
        groupFlg: !!this.addData.lightingGroupId,
        interfaces: this.addData.interfaces,
        lightingControllerId: this.addData.lightingControllerId,
        lightingGroupId: this.addData.lightingGroupId,
        loopType: this.addData.loopType,
        name: this.addData.name,
        projectManagementId: this.projectManagementId.name})
      if (res.status === 200) {
        this.nameExist = res.data
      }
    },
    async query () {
      const res = await context.http.get(`rms/api/lightingLoop/${this.loopId}`)
      if (res.status === 200) {
        this.addData = res.data
        this.oldData = JSON.parse(JSON.stringify(res.data))
        if (res.data.loopType !== 'NORMAL') {
          this.state = '异常'
        }
        this.queryProjectManagement()
      }
    },
    async queryProjectManagement () {
      this.projectManagementList = []
      const res = await context.http.get('cms/api/project-managements', {useStatus: 'USING'})
      if (res.status === 200) {
        this.projectManagementList = res.data
        this.defaultProject()
      }
      this.querylightingGateway()
    },
    async queryBuild () {
      if (!this.addData.projectManagementName) {
        Toast({
          message: '请选择"项目"',
          duration: 1.5,
          position: 'top'
        })
        return
      }
      let result = await context.http.get('cms/api/buildings', { useStatus: 'USING',
        projectId: this.addData.projectManagementId })
      if (result.status === 200) {
        this.buildingList = result.data.buildingListDTOS
        this.buildingList.map((item, index) => {
          if (this.addData.buildingId === item.id) {
            this.defaultBuildIndex = index
          }
        })
        this.floorList = this.buildingList[this.defaultBuildIndex].floorDTOSet
        this.floorList.map((item, index) => {
          if (this.addData.floorId === item.id) {
            this.defaultFloorIndex = index
          }
        })
        console.log(result, this.buildingList)
      }
    },
    async querylightingGateway () {
      this.lightingGatewayList = []
      let result = await context.http.get(`rms/api/lightingGateway/list/${this.addData.projectManagementId}`)
      if (result.status === 200) {
        this.lightingGatewayList = result.data
        this.lightingGatewayList.map((item, index) => {
          if (this.addData.lightingGatewayId === item.id) {
            this.defaultGatewayIndex = index
          }
        })
        console.log(result, this.addData)
      }
    },
    defaultProject () {
      this.projectManagementList.map((item, index) => {
        if (item.referred === this.addData.projectManagementName) {
          this.defaultProjectIndex = index
        }
      })
    },
    onConfirmProject (pro, index) {
      if (pro.id !== this.addData.projectManagementId) {
        this.addData.projectManagementName = pro.referred
        this.addData.projectManagementId = pro.id
        // 清空已选值
        this.addData.lightingGatewayId = null
        this.addData.lightingGatewayName = ''
        this.querylightingGateway()
      }
      console.log('确认项目', pro, index, this.addData)
      this.showProject = false
    },
    onCancelProject () {
      console.log('取消确认项目')
      this.showProject = false
    },
    onConfirmNet (net, index) {
      if (net.id !== this.addData.lightingGatewayId) {
        // this.lightingControllerList = []
        this.addData.lightingGatewayName = net.name
        this.addData.lightingGatewayId = net.id
      }
      this.showNet = false
    },
    onCancelNet () {
      console.log('取消确认网关')
      this.showNet = false
    },
    setAnnex (annexURL, annexName) { // 子组件上传成功返回文件url 和名字
      if (!this.addData.imgurls) {
        this.addData.imgurls = []
      }
      this.addData.imgurls.push(annexURL)
    },
    // showImg (imgArr, index) {
    //   let arr = imgArr.map((item, index) => {
    //     let i = item.lastIndexOf('.')
    //     let str = item.substring(i + 1, item.length)
    //     str.toLowerCase()
    //     return item
    //   })
    //   ImagePreview({
    //     images: arr,
    //     startPosition: index
    //   })
    // },
    checkItem (item) {
      const imageRatio = Common.imageRatio(375)
      let paramTxt = `?x-oss-process=image/resize,w_${imageRatio.width},m_fixed` // 图片链接参数  防止安卓手机图片旋转
      // let arrObj = []
      // let arr = []
      // let Type
      // imgArr.forEach((v, i) => {
      //   let index = v.lastIndexOf('.')
      //   let type = v.substr(index + 1).toLowerCase()
      //   if (type === 'jpg' || type === 'jpeg' || type === 'png') {
      //     arrObj.push({ annexURL: v, index: i })
      //   }
      // })
      // arrObj.forEach((v, i) => {
      //   if (index === v.index) {
      //     index = i
      //   }
      //   arr.push(v.annexURL + paramTxt)
      // })
      return item + paramTxt
    },
    showImg (imgArr, index) {
      const imageRatio = Common.imageRatio(375)
      let paramTxt = `?x-oss-process=image/resize,w_${imageRatio.width},m_fixed` // 图片链接参数  防止安卓手机图片旋转
      let arrObj = []
      let arr = []
      let Type
      imgArr.forEach((v, i) => {
        let index = v.lastIndexOf('.')
        let type = v.substr(index + 1).toLowerCase()
        if (type === 'jpg' || type === 'jpeg' || type === 'png') {
          arrObj.push({ annexURL: v, index: i })
        }
        // if (index === i) {
        // if (type === '.jpg' || type === '.jpeg' || type === '.png') { } else {
        //   Type = true
        //   if (type === '.docx' || type === '.dotx' || type === '.doc' || type === '.xlsx' || type === '.xls' || type === '.ppt' || v.fileType === '.pptx') {
        //     this.$router.push({ name: 'FilePreview', params: { url: v.annexURL, fileType: v.fileType } })
        //   } else {
        //     this.$toast({
        //       message: '暂时不支持此类型文件预览！',
        //       position: 'top'
        //     })
        //   }
        // }
        // }
      })
      arrObj.forEach((v, i) => {
        if (index === v.index) {
          index = i
        }
        arr.push(v.annexURL + paramTxt)
      })
      if (!Type) {
        ImagePreview({
          images: arr,
          startPosition: index
        })
      }
    },
    deleImg (item, index) {
      this.addData.imgurls.splice(index, 1)
    },
    deleteLoop () {
      let _this = this
      MessageBox.confirm('', {
        message: '您确认要删除该条回路吗？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonClass: 'confirmButton',
        cancelButtonClass: 'cancelButton'
      }).then(action => {
        if (action === 'confirm') {
          context.http.delete(`rms/api/lightingLoop/${this.loopId}`).then(res => {
            if (res.status === 200) {
              Toast({
                message: '删除成功',
                duration: 1.5,
                position: 'top'
              })
              _this.$router.replace({ name: 'illuminatingSystem' })
            }
          })
        }
      }).catch(error => {
        if (error === 'cancel') {
          if (window.history && window.history.pushState) {
            history.pushState(null, null, document.URL)
          }
        }
      })
    },
    submit () { // 新增回路照明记录
      if (!this.addData.projectManagementName) {
        Toast({
          message: '请选择"项目"',
          duration: 1500,
          position: 'top'
        })
        return
      }
      if (!this.addData.name) {
        Toast({
          message: '请填写"回路名称"',
          duration: 1500,
          position: 'top'
        })
        return
      }
      if (this.nameExist) {
        Toast({
          message: '该回路名称已存在，请重新填写',
          duration: 1500,
          position: 'top'
        })
        return
      }
      if (!this.addData.lightingGatewayName) {
        Toast({
          message: '请选择"网关"',
          duration: 1500,
          position: 'top'
        })
        return
      }
      if (!this.addData.interfaces) {
        Toast({
          message: '请输入"TagID"',
          duration: 1500,
          position: 'top'
        })
        return
      }
      const reg = /^[0-9]*[1-9][0-9]*$/
      if (!reg.test(this.addData.interfaces)) {
        Toast({
          message: '请输入正整数"TagID"',
          duration: 1500,
          position: 'top'
        })
        return
      }
      context.http.put('rms/api/lightingLoop', this.addData).then(res => {
        if (res.status === 200) {
          Toast({
            message: `保存成功`,
            position: 'top'
          })
          this.$router.replace({ name: 'illuminatingSystem' })
        }
      })
    },
    confirmFn () {
      // this.checkImage()
      let _this = this
      // if (
      //   (this.addData.projectManagementId === this.oldData.projectManagementId) &&
      //   (this.addData.name === this.oldData.name) &&
      //   (this.addData.lightingGatewayId === this.oldData.lightingGatewayId) &&
      //   (this.addData.interfaces === this.oldData.interfaces) &&
      //   (!this.changeImage) &&
      //   (this.addData.remark === this.oldData.remark)
      // ) {
      //   this.$router.replace({ name: 'illuminatingSystem' })
      //   return
      // }
      // MessageBox.confirm('', {
      //   message: '内容尚未保存，确定退出？',
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   confirmButtonClass: 'confirmButton',
      //   cancelButtonClass: 'cancelButton'
      // }).then(action => {
      //   if (action === 'confirm') {
      _this.$router.replace({ name: 'illuminatingSystem' })
      //   }
      // }).catch(error => {
      //   if (error === 'cancel') {
      //     if (window.history && window.history.pushState) {
      //       history.pushState(null, null, document.URL)
      //     }
      //   }
      // })
    },
    checkImage () {
      if (this.oldData.imgurls || this.addData.imgurls) {
        if (!this.oldData.imgurls) {
          this.oldData.imgurls = []
        }
        if (!!this.oldData.imgurls.length !== !!this.addData.imgurls.length) {
          this.changeImage = true
          return
        }
        if (this.oldData.imgurls.length && this.addData.imgurls.length) {
          if (this.oldData.imgurls.length !== this.addData.imgurls.length) {
            this.changeImage = true
            return
          }
          this.oldData.imgurls.map((item, index) => {
            if (item !== this.addData.imgurls[index]) {
              this.changeImage = true
              return
            }
          })
        }
      }
    },
    getformat (str) {
      return Common.getformat(str)
    }
  }
}
</script>
<style lang="scss">
@import "../../../../../../style/config.scss";
// @import "../../../style/config";
.detailsLoop {
  #app-head {
    .back {
      // display: none !important;
    }
    .left_btn {
      width: rem(40);
      height: rem(40);
      font-size: rem(18);
      color: #000000;
      &:first-child {
        float: left;
      }
    }
    .right_btn {
      width: rem(80);
      text-align: right;
      padding-right: rem(14);
      position: fixed;
      right: 0;
      top: 0;
    }
    .title {
      padding-right: rem(40);
    }
  }
  .van-overlay {
    background: rgba(0, 0, 0, 0.4);
  }
  .van-action-sheet__close {
    display: none;
  }
  .van-number-keyboard {
    position: static;
  }
  .price_input {
    height: rem(50);
    border-bottom: rem(1) solid #0139a4;
    p {
      display: block;
      line-height: rem(50);
      text-align: center;
      font-size: rem(15);
    }
  }
  .price_unit {
    display: flex;
    padding: rem(8) rem(55);
    justify-content: space-between;
    span {
      display: block;
      height: rem(33);
      padding: 0 rem(15);
      line-height: rem(33);
      font-size: rem(15);
      color: #18191a;
      border: rem(1) solid #d9d9d9;
      border-radius: rem(33);
    }
    .active {
      color: #0139a4;
      background: #f3f7ff;
      border: rem(1) solid #c7d9ff;
    }
  }
}
</style>
<style lang="scss" scoped>
@import "../../../../../../style/config.scss";
.detailsLoop {
  color: #858c94;
  font-size: rem(15);
  margin-top: rem(40);
  .headTitle {
    display: flex;
    justify-content: center;
    width: 100%;
    height: rem(30);
    line-height: rem(30);
    color: #0139a4;
    background-color: #eef3ff;
    font-weight: 500;
    font-size: rem(14);
    &.error {
      background: #fff3f3;
      color: #fc5159;
    }
  }
  > div {
    background-color: #fff;
    .title {
      height: rem(40);
      line-height: rem(40);
      padding-left: rem(14);
      font-weight: bold;
      color: #18191a;
      border-bottom: rem(1) solid #f0f0f0;
    }
    .imgItem {
      height: rem(40);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 rem(14);
    }
    .content {
      margin-left: rem(14);
      border-bottom: rem(1) solid #f0f0f0;
      > .item {
        height: rem(50);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: rem(14);
        border-bottom: rem(1) solid #f0f0f0;
        > span {
          &:nth-child(2) {
            color: #18191a;
            &.btn {
              .selectBtn,
              .iconfont {
                color: #d9d9d9;
              }
            }
            input {
              text-align: right;
            }
          }
        }
      }
      .item:nth-last-child(1) {
        border-bottom: none;
      }
    }
  }
  .basicInfo {
    margin-bottom: rem(10);
    .imgTitle {
      height: rem(40);
      display: flex;
      align-items: center;
      padding: 0 rem(14);
      .yulan {
        font-size: rem(12);
      }
    }
    .imgList {
      // height: rem(200);
      // background-color: #ccc;
      display: flex;
      flex-wrap: wrap;
      margin: 0 rem(15);
      .upLoadModule {
        width: rem(70);
        height: rem(70);
        position: relative;
        margin-right: rem(15);
        margin-bottom: rem(15);
        border: 1px dashed;
        font-size: rem(24);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .tupian {
          // position: absolute;
          font-size: rem(12);
          // top: rem(30);
        }
      }
      .imgBoxModel {
        width: rem(70);
        height: rem(70);
        position: relative;
        margin-right: rem(15);
        margin-bottom: rem(15);
        > img {
          width: 100%;
          height: 100%;
          border-radius: rem(4);
          object-fit: cover;
        }
        > .iconfont {
          position: absolute;
          top: -5px;
          right: -10px;
        }
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    background: rgba(255, 255, 255, 0.6);
    height: rem(70);
    font-size: rem(17);
    div {
      &:first-child {
        width: rem(160);
        height: rem(50);
        line-height: rem(50);
        text-align: center;
        background: #F3F7FF;
        border-radius: rem(4);
        color: #0139A4;
      }
      &:last-child {
        width: rem(160);
        height: rem(50);
        line-height: rem(50);
        text-align: center;
        background: rgba(1, 57, 164, 1);
        border-radius: rem(4);
        color: #ffffff;
      }
    }
  }
  .maintainPlan {
  }
  .annexes {
    background-color: #fff;
    padding-left: rem(14);
    .title {
      padding: rem(10) 0 rem(13) rem(12);
      font-size: 15px;
      color: rgba(133, 140, 148, 1);
    }
    .item {
      display: flex;
      align-items: center;
      // padding: rem(4) 0 rem(4) 0;
      > div {
        &:first-child {
          margin-right: rem(15);
        }
        &:nth-child(2) {
          width: 70%;
          padding-right: rem(10);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        &:last-child {
          font-size: rem(15);
          color: rgba(24, 25, 26, 1);
        }
      }
    }
    .delcl {
      flex: 1;
      text-align: right;
      margin-right: rem(12);
    }
  }
  .newspush {
    display: flex;
    justify-content: space-between;
    padding-right: rem(14);
  }
  .selected_rooms {
    margin-right: rem(14);
    background: #f2f6ff;
    line-height: rem(24);
    color: #444547;
    font-size: rem(12);
    padding: 0 rem(10);
    margin-bottom: rem(18);
  }
  input::-webkit-input-placeholder,
  textarea::-webkit-input-placeholder {
    color: #d9d9d9;
  }
}
</style>

