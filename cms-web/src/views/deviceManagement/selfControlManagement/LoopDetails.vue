<template>
  <div class="tenant-details loopDetailData">
    <div class="tenant-details details-content"
         slot="drawer">
      <div class="main-content"
           id="mainContent"
           style="border:none">
        <el-form :model="detailData"
                 ref="detailData"
                 :rules="addDataRules">
          <div class="basInfo">
            <p class="title"><span class="vertical"></span>基本信息</p>
            <div class="content">
              <div class="form">
                <el-form-item>
                  <span>项目简称<i class="required">*</i></span>
                  <p class="readOnlyTxt">{{detailData.projectManagementName}}</p>
                </el-form-item>
                <el-form-item prop="name" style="margin-left: 20px">
                  <span>回路名称<i class="required">*</i></span>
                  <p class="readOnlyTxt"
                     v-if="readOnly">{{detailData.name}}</p>
                  <el-input v-model="detailData.name"
                            v-else
                            maxlength="50"
                            style="width:245px"></el-input>
                </el-form-item>
                <!-- <el-form-item prop="buildingId">
                  <span>楼宇<i class="required">*</i></span>
                  <p class="readOnlyTxt"
                     v-if="readOnly">{{detailData.buildingName}}</p>
                  <el-select placeholder="楼宇"
                             v-else
                             v-model="detailData.buildingId"
                             @change="getFloor"
                             clearable
                             style="width:200px;margin-right:10px">
                    <el-option v-for="(item,index) in bnulidingList"
                               :key="item.id"
                               :label="item.buildingName"
                               :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="floorId" style="margin-left: 20px">
                  <span>楼层<i class="required">*</i></span>
                  <p class="readOnlyTxt"
                     v-if="readOnly">{{detailData.floorName}}</p>
                  <el-select placeholder="楼层"
                             v-else
                             v-model="detailData.floorId"
                             clearable
                             size="small">
                    <el-option v-for="(item,index) in floorList"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id"></el-option>
                  </el-select>
                </el-form-item> -->
              </div>
            </div>
          </div>
          <div class="basInfo other-infor">
            <p class="title"><span class="vertical"></span>关联信息</p>
            <div class="content">
              <div class="form">
                <el-form-item>
                  <span>网关选择<i class="required">*</i></span>
                  <p class="readOnlyTxt"
                     v-if="readOnly">{{detailData.lightingGatewayName}}</p>
                  <el-select v-model="detailData.lightingGatewayId"
                             v-else
                             size="small"
                             placeholder="请选择"
                             style="width:245px">
                    <el-option v-for="(item, index) in gatewaySelectList"
                               @click.native="gatewaySelectIndex = index;"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item prop="lightingControllerId" style="margin-left: 20px">
                  <span>控制器ID<i class="required">*</i></span>
                  <p class="readOnlyTxt"
                     v-if="readOnly">{{detailData.lightingControllerId}}</p>
                  <el-select v-model="detailData.lightingControllerId"
                             v-else
                             @change="interfaceSelect(detailData.lightingControllerId, 'change')"
                             size="small"
                             placeholder="请选择">
                    <el-option v-for="item in gatewaySelectList[gatewaySelectIndex].lightingControllerDTOList"
                               :key="item.id"
                               :label="item.identifier"
                               :value="item.id"></el-option>
                  </el-select>
                </el-form-item> -->
                <el-form-item prop="interfaces" style="margin-left: 20px">
                  <span>TagID<i class="required">*</i></span>
                  <p class="readOnlyTxt"
                     v-if="readOnly">{{detailData.interfaces}}</p>
                  <el-input v-model="detailData.interfaces"
                            v-else
                            style="width:260px"></el-input>
                </el-form-item>
                <el-form-item style="width: 100%">
                  <span>回路说明</span>
                  <p class="readOnlyTxt"
                     v-if="readOnly">{{detailData.remark}}</p>
                  <el-input v-model="detailData.remark"
                            v-else
                            type="textarea"
                            placeholder="您可输入此回路包含的照明设备数量，具体位置等信息"
                            maxlength="50"></el-input>
                </el-form-item>
                <div>
                  <span style="color: #777">回路图片</span>
                  <div class="upLoadDiv">
                    <div>
                      <div class="imgList"
                           v-if="detailData.imgurls"
                           v-for="(item,index) in detailData.imgurls"
                           :key="index">
                        <div class="item">
                          <img :src="item"
                               alt="">
                          <div @click="showImg(item,index)"
                               class="bottomTips">预览图片</div>
                          <i class="deleteBtn iconfont icon-cms_cuowu"
                             v-if="!readOnly"
                             @click="delImg(item,index)"></i>
                        </div>
                      </div>
                      <div class="upLoadComponents"
                           v-if="detailData.imgurls && detailData.imgurls.length<9 && !readOnly || !readOnly && !detailData.imgurls">
                        <i class="iconfont icon-shangchuantupianicon"></i>
                        <aliUpload class="aliUpload"
                                   :upLoadText="upLoadText"
                                   :fileType="fileType"
                                   :iconShow="false"
                                   @setAnnex="setAnnex" />
                      </div>
                    </div>
                    <p>（最多可上传9张,建议尺寸：<span style="color:#F00">200＊300</span>像素；支持格式JPG,PNG，不大于2M）</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-form>
      </div>
      <div slot="footer"
           style="text-align: right;padding: 10px 20px 20px;position:relative"
           class="dialog-footer"
           v-if="!readOnly">
        <el-button @click="cancelEl"
                   class="close-button">取消</el-button>
        <el-button type="primary"
                   class="defaultbtn dialog-confirmBtn"
                   @click="addRepairSave('detailData')">确定</el-button>
      </div>
    </div>

    <!-- 图片预览 -->
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
  </div>
</template>
<script>
import context from '@/service'
import aliUpload from '@/components/aliUpload.vue'
import picturePrevie from '@/components/picturePrevie.vue'
export default {
  components: {
    aliUpload,
    picturePrevie
  },
  props: {
    detailData: {
      type: Object,
      default: {}
    }
  },
  watch: {
    detailData: {
      handler (newValue, oldValue) {
        if (newValue) {
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      upLoadText: '上传图片',
      fileType: ['jpg', 'png'],
      num: 1,
      imgArr: [],
      showPicture: false,
      gatewaySelectIndex: 0,
      bnulidingList: [],
      floorList: [],
      drawertitle: '',
      projectManagementId: '',
      addDataRules: {
        name: [
          { required: true, message: '请输入回路名称', trigger: 'change' }
        ],
        buildingId: [
          { required: false, message: '请选择楼宇', trigger: 'change' }
        ],
        floorId: [
          { required: false, message: '请选择楼层', trigger: 'change' }
        ],
        lightingGatewayId: [
          { required: true, message: '请选择网关', trigger: 'change' }
        ],
        interfaces: [
          { required: true, pattern: /(^[1-9]\d*$)/, message: '请输入正确的TagID', trigger: 'blur' }
        ],
        lightingControllerId: [
          { required: false, message: '请选择控制器ID', trigger: 'change' }
        ],
        remark: [
          { required: false, message: '请输入回路说明', trigger: 'change' }
        ]
      },
      readOnly: true,
      controllerType: [
        { name: '4', value: 'FOUR' },
        { name: '6', value: 'SIX' },
        { name: '8', value: 'EIGHT' },
        { name: '12', value: 'TWELVE' }
      ],
      gatewaySelectList: [{
        lightingControllerDTOList: []
      }],
      interfacesList: []
    }
  },
  created () {
  },
  mounted () {
    this.drawertitle = this.drawerTitle
    let clientHeight = document.body.clientHeight
    let mainContent = document.getElementById('mainContent')
    mainContent.style.height = clientHeight - 65 + 'px'
  },
  computed: {

  },
  methods: {
    edit () {
      this.readOnly = false
      this.gatewayList()
      // this.interfaceSelect(this.detailData.lightingControllerId)
    },
    close () {
      this.readOnly = true
      this.$refs['detailData'].resetFields()
    },
    setAnnex (annexURL, annexName) {  // 子组件上传成功返回文件url 和名字
      if (!this.detailData.imgurls) this.detailData.imgurls = []
      this.detailData.imgurls.push(annexURL)
    },
    pictureClose () {
      this.showPicture = false
    },
    showImg (item, index) {
      let imgArr = []
      this.detailData.imgurls.forEach(item => {
        imgArr.push(item)
      })

      this.imgArr = imgArr
      this.num = index
      this.showPicture = true
    },
    delImg (item, index) {
      this.detailData.imgurls.splice(index, 1)
    },
    async getBuliding () { // 楼宇
      let result = await context.http.get('cms/api/buildings/newList?sort=sortNumber,asc&sort=id,asc', { page: 0, size: 100, useStatus: 'USING', projectId: this.projectId })
      if (result.data && result.data.length) {
        this.bnulidingList = result.data
        this.getFloor()
      } else {
        this.bnulidingList = []
      }
    },
    async getFloor () { // 楼层
      let result = await context.http.get(`cms/api/floors/building/${this.detailData.buildingId}`)
      this.floorList = result.data
    },
    async gatewayList () {
      let result = await context.http.get(`rms/api/lightingGateway/list/${this.detailData.projectManagementId}`)
      if (result.status === 200) {
        this.gatewaySelectList = result.data
      }
    },
    async interfaceSelect (controllerId, type) {
      if (type) this.detailData.interfaces = ''
      let loopId = this.detailData.id
      let result = await context.http.get(`rms/api/lightingLoop/interfaces?loopId=${loopId}&controllerId=${controllerId}`)
      if (result.data && result.data.length) {
        this.interfacesList = result.data.filter(item => {
          return item.length < 2
        })
      } else {
        this.interfacesList = []
      }
    },
    addRepairSave (formName, state) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          context.http.put('/rms/api/lightingLoop', this.detailData).then(res => {
            if (res) {
              _this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.readOnly = true
              this.$emit('query')
              this.$emit('setreadOnly')
              this.$emit('handleEdit', 0, this.detailData)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancelEl () {
      this.readOnly = true
      this.$refs['detailData'].resetFields()
      this.$emit('setreadOnly')
      this.$emit('handleEdit', 0, this.detailData)
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    addController () {
      this.detailData.lightingControllerDTOList.push({ 'identifier': '', 'controllerType': '' })
    },
    delControl (item, index) {
      this.detailData.lightingControllerDTOList.splice(index, 1)
    },
    controllerTypeFormat (value) {
      let val = ''
      switch (value) {
        case 'FOUR':
          val = 4
          break
        case 'SIX':
          val = 6
          break
        case 'EIGHT':
          val = 8
          break
        case 'TWELVE':
          val = 12
          break
        default:
          break
      }
      return val
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/mixins.scss";
.loopDetailData {
  .drawer-head {
    margin: 20px 20px 10px 20px;
    border-bottom: none;
  }
  .details-content {
    padding: 0;
  }
  .tenant-details {
    background-color: #f7f7f7;
    // padding-bottom: 50px;
    .title {
      padding-left: 20px;
    }
    .vertical {
      display: inline-block;
      width: 4px;
      height: 16px;
      background-color: #3575f6;
      border-radius: 2px;
      vertical-align: middle;
      margin-right: 5px;
    }
  }
  .main-content {
    background-color: #f7f7f7;
    margin: 0;
    overflow-y: scroll;
    overflow-x: hidden;
    @include scrollBarStyle;
    .mainInfo {
      height: 60px;
      border: 1px solid #dadada;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      justify-content: space-between;
      font-size: 14px;
    }
    .basInfo {
      border: 1px solid #dadada;
      padding: 1px 0;
      // min-height: 500px;
      /* width: 900px; */
      margin-bottom: 15px;
      margin-top: 15px;
      &:last-child {
        margin-bottom: 70px;
      }
    }
    .content {
      padding: 15px 0;
      .form {
        display: flex;
        flex-wrap: wrap;
        .el-form-item {
          width: 44%;
          .el-form-item__content {
            > span {
              margin-bottom: 5px;
              display: inline-block;
            }
            > .readOnlyTxt {
              height: 40px;
              line-height: 40px;
              font-size: 14px;
              color: #8e8e8e;
            }
            .seachDeviceIcon {
              display: inline-block;
              width: 20px;
              height: 20px;
              /* background: url(../../../../assets/seachDeviceIcon.png) no-repeat; */
              position: absolute;
              right: 16px;
              top: 35px;
              cursor: pointer;
            }
            .el-textarea__inner {
              resize: none !important;
            }
          }
        }
      }
    }
  }
  .dialog-footer {
    background-color: #fff;
    width: 100%;
    padding: 10px;
    margin-right: 0px;
    height: 50px;
    margin-top: -50px;
  }
  .close-button {
    color: #666 !important;
    background-color: #fff !important;
    border: none !important;
    &:hover {
      color: #3575f6 !important;
    }
  }
  .defaultbtn {
    width: 90px !important;
    margin-left: 0;
  }
  .content {
    font-size: 14px;
    margin: 0 20px 0 20px;
    .ct-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      span {
        &:first-child {
          color: #4677ee;
        }
        color: #44af69;
        cursor: pointer;
        &:last-child {
          border-bottom: 1px solid #fff;
          &:hover {
            border-bottom: 1px solid #44af69;
          }
        }
      }
    }
    .ct-table {
      .ct-tableheader {
        background-color: #f7f8fa;
        color: #777777;
        display: flex;
        span {
          text-align: center;
          height: 40px;
          line-height: 40px;
          &:nth-child(1) {
            width: 50%;
          }
          &:nth-child(2) {
            width: 25%;
          }
          &:nth-child(3) {
            width: 25%;
          }
        }
      }
      .ct-tablebody {
        max-height: 360px;
        overflow-y: scroll;
        @include scrollBarStyle;
        .ct-item {
          display: flex;
          align-items: center;
          .el-input {
            width: 160px;
            margin: 10px 20px 20px 40px;
          }
          .el-select {
            width: 160px;
            margin: 10px 20px 20px 20px;
          }
          span {
            margin: 10px 0 20px 56px;
            cursor: pointer;
            text-align: center;
          }
          .delspan {
            color: #bf2f2d;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.loopDetailData {
  .drawer-head {
    margin: 20px 20px 10px 20px;
    border-bottom: none;
  }
  .el-drawer__body {
    margin: 0;
  }
  .upLoadDiv {
    > div {
      display: flex;
      flex-wrap: wrap;
      margin: 15px 0;
    }
    .imgList {
      margin-right: 10px;
      margin-bottom: 10px;
      .item {
        width: 100px;
        height: 100px;
        position: relative;
        border: none;
        &:hover > .bottomTips {
          height: 25px;
        }
        > i.deleteBtn {
          position: absolute;
          right: -8px;
          top: -8px;
          cursor: pointer;
        }
        .bottomTips {
          display: inline-block;
          height: 0px;
          position: absolute;
          left: 0px;
          bottom: 0px;
          width: 100%;
          text-align: center;
          background: rgba(38, 38, 38, 0.6);
          line-height: 25px;
          font-size: 12px;
          padding: 0 5px;
          cursor: pointer;
          color: #fefefe;
          text-align: center;
          transition: height 0.5s;
          overflow: hidden;
        }
        img {
          width: 100px;
          height: 100px;
        }
        > div {
          height: 30px;
          line-height: 30px;
          display: flex;
          justify-content: space-between;
          padding: 0 10px;
          align-items: center;
          position: absolute;
          width: 100%;
          left: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.7);
          > span {
            display: inline-block;
            width: 70%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          > i {
            cursor: pointer;
          }
        }
      }
    }
  }
  .upLoadComponents {
    width: 100px;
    height: 100px;
    border: 1px solid #d0d0d0ff;
    position: relative;
    background: url(../../../assets/plus.png) no-repeat center;
    > i {
      font-size: 36px;
      color: #3575f6;
      position: absolute;
      top: 25%;
      left: 32%;
    }
    .aliUpload {
      height: 100%;
      background: #f7f9fd;
      .oss_file {
        border: none !important;
        height: 100px !important;
        width: 100%;
        line-height: 195px;
        color: #3577f6;
        .upLoadText {
          position: relative;
          top: -20px;
        }
      }
    }
  }
}
</style>
