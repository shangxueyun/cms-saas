
<template>
  <div class="tenant-details repairDetailsData">
    <drawer :show="detailsdrawershow" :title="drawerTitle" @on-hide="onHide">
      <div class="tenant-details details-content" slot="drawer">
        <!-- v-if="repairDetailsData.maintenanceClassify==='REPAIR'" -->
        <div class="menuTab">
          <span :class="{'active':menuTab==='repairRecord'}" @click="menuTabChange('repairRecord')">维保信息</span>
          <span :class="{'active':menuTab==='repairInfo'}" @click="menuTabChange('repairInfo')">报修单信息</span>       
        </div>
        <div class="main-content" v-if="menuTab==='repairRecord'" style="padding:0 30px;">
          <el-collapse accordion v-if="repairRecords.length>0" v-model="activeName">
            <el-collapse-item v-for="(item,index) in repairRecords" :key="index" :name="index.toString()">
              <template slot="title">维保记录{{repairRecords.length-index}}</template>
                <div class="content">
                  <!-- <p class="title">基本信息</p> -->
                  <div class="itemContent">
                    <div class="item">
                      <p>维保编号</p>
                      <span>{{item.repairRecordCode}}</span>
                    </div>
                    <div class="item">
                      <p>维保类型</p>
                      <span>{{item.repairType==='ROOMS'?'房源':item.repairType==='EQUIREMENT'?'设备':'其他'}}</span>
                    </div>
                    <div class="item">
                      <p>维保方式</p>
                      <span>{{formatmaintenanceClassify(item.maintenanceClassify)}}</span>
                    </div>
                    <div class="item">
                      <p>{{item.repairType==='ROOMS'?'房源号':item.repairType==='EQUIREMENT'?'设备编号':'楼宇'}}</p>
                      <span v-if="item.repairType==='ROOMS'">{{item.roomsName}}</span>
                      <span v-if="item.repairType==='EQUIREMENT'">{{item.equirementNo}}</span>
                      <span v-if="item.repairType==='BUILDING'">{{item.buildingName}}</span>
                    </div>
                    <div class="item">
                      <p>{{item.repairType==='ROOMS'?'房源名称':'设备名称'}}</p>
                      <span>{{item.name}}</span>
                    </div>
                    <div class="item">
                      <p>项目简称</p>
                      <span>{{item.projectName}}</span>
                    </div>
                    <div class="item">
                      <p>楼宇名称</p>
                      <span>{{item.buildingName}}</span>
                    </div>
                    <div class="item">
                      <p>安装位置</p>
                      <span>{{item.installPosition}}</span>
                    </div>
                    <div class="item" v-if="item.maintenanceClassify==='MAINTAIN'">
                      <p>计划保养日期</p>
                      <span>{{item.planMaintenanceTime}}</span>
                    </div>
                    <div class="item">
                      <p>维保人员</p>
                      <span>{{item.repairUserName}}</span>
                    </div>
                    <div class="item">
                      <p>维保日期</p>
                      <span>{{item.repairDate}}</span>
                    </div>
                    <div class="item">
                      <p>维保费用</p>
                      <span>{{item.repairFee}}</span>
                    </div>
                    <div class="item">
                      <p>维保结果</p>
                      <span>{{formatRepairStatus(item.repairStatus)}}</span>
                    </div>
                    <div class="item">
                      <p>维保原因</p>
                      <span>{{item.description}}</span>
                    </div>
                    <div class="item">
                      <p>用材情况</p>
                      <span>{{item.materialUsage}}</span>
                    </div>
                    <div class="item">
                      <p>备注</p>
                      <span>{{item.remake}}</span>
                    </div>
                  </div>
                  <div class="upLoadDiv">
                    <p>发票及维保后图片</p>
                    <div>
                      <div class="imgList" v-for="(item1,index1) in item.imageUrls" :key="index1">
                        <div class="item">
                        <img :src="item1" alt="" @click="showImg1(item1,index1,index)">
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="content" v-if="item.maintenanceClassify==='MAINTAIN'">
                  <p class="title">维保计划</p>
                  <div class="itemContent">
                    <div class="item">
                      <p><i>下次维保日期</i></p>
                      <span>{{item.nextMaintenanceTime ? item.nextMaintenanceTime : '-'}}</span>
                    </div>
                  </div>
                </div>
            </el-collapse-item>
          </el-collapse>
          <p v-else style="padding: 20px 33px;min-height: 400px;border: 1px solid #eee;">暂无维保数据</p>
          <!-- <div class="content" v-if="repairDetailsData.maintenanceClassify==='MAINTAIN'">
            <p class="title">维保计划</p>
            <div class="itemContent">
              <div class="item">
                <p><i>下次维保日期</i></p>
                <span>{{repairDetailsData.nextMaintenanceTime}}</span>
              </div>
            </div>
          </div> -->
        </div>
        <div class="main-content repairInfo" v-if="menuTab==='repairInfo'">
          <!-- <span @click="editFn" style="position: absolute; top: -35px; right: 0;">编辑</span> -->
          <div class="content">
            <p class="title">基本信息</p>
            <div class="itemContent">
              <div class="item">
                  <p>报修编号</p>
                  <span>{{repairDetailsData.repairFormCode}}</span>
                </div>
                <div class="item">
                  <p>报修类型</p>
                  <span>{{repairDetailsData.repairType==='ROOMS'?'房源':repairDetailsData.repairType==='EQUIREMENT'?'设备':'其他'}}</span>
                </div>
                <div class="item" v-if="repairDetailsData.repairType==='ROOMS'">
                  <p>房源号</p>
                  <span>repairDetailsData.roomsName</span>
                </div>
                <div class="item" v-if="repairDetailsData.repairType==='EQUIREMENT'">
                  <p>设备编号</p>
                  <span>{{repairDetailsData.equirementNo}}</span>
                </div>
                <div class="item" v-if="repairDetailsData.repairType==='ROOMS' || repairDetailsData.repairType==='EQUIREMENT'">
                  <p>{{repairDetailsData.repairType==='EQUIREMENT'?'设备名称':'房源名称'}}</p>
                  <span>{{repairDetailsData.name}}</span>
                </div>
                <div class="item" >
                  <p>项目简称</p>
                  <span>{{repairDetailsData.projectName}}</span>
                </div>
                <div class="item" >
                  <p>楼宇名称</p>
                  <span>{{repairDetailsData.buildingName}}</span>
                </div>
                <div class="item" v-if="repairDetailsData.repairType==='EQUIREMENT'">
                  <p>安装位置</p>
                  <span>{{repairDetailsData.installPosition}}</span>
                </div>
                <div class="item">
                  <p>问题简述</p>
                  <span>{{repairDetailsData.title}}</span>
                </div>
                <div class="item">
                  <p>报修原因</p>
                  <span>{{repairDetailsData.content}}</span>
                </div>
            </div>
            <div class="upLoadDiv">
              <p>报修预览图</p>
              <div>
                <div class="imgList" v-for="(item,index) in repairDetailsData.imgs" :key="index" v-show="pageType==='add'">
                  <div class="item">
                    <img :src="item" alt="">
                    <div>
                      <i class="el-icon-view" @click="showImg(item,index)"></i>.addRepair 
                      <i class="el-icon-delete" @click="deleteFn(item,index)"></i>
                    </div>
                  </div>
                </div>
                <div class="imgList" v-for="(item,index) in repairDetailsData.imgs" :key="index" v-show="pageType==='readOnly'">
                  <div class="item">
                    <img :src="item" alt="" @click="showImg(item,index)">
                  </div>
                </div>
                <!-- <div class="upLoadComponents" v-if="repairDetailsData.imgs.length<5 && pageType==='add'">
                  <aliUpload class="aliUpload"
                    :upLoadText="upLoadText"
                    :fileType="fileType"
                    :iconShow="false"
                    @setAnnex="setAnnex"
                  />
                </div> -->
              </div>
              <p v-if="pageType==='add'" style="font-size:12px;">(最多可上传5张,建议尺寸：<i style="color:#F00">100＊100</i>像素；支持格式JPG,PNG)</p>
            </div>
          </div>         
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
          <el-button @click="onHide" class="close-button">关闭</el-button>
          <!-- <el-button type="primary"  class="defaultbtn dialog-confirmBtn" @click="bindFun">确 定</el-button> -->
        </div>
    </drawer>
    <picturePrevie v-if="showPicture" :imgList="imgArr" :num="num"  @pictureClose="pictureClose"></picturePrevie>
  </div>
</template>
<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import picturePrevie from '@/components/picturePrevie.vue'
export default {
  components: {
    Drawer,
    picturePrevie
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    equirementId: {

    },
    repairDetailsData: {

    }
  },
  created () {

  },
  mounted () {
  },
  watch: {
    detailsdrawershow: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          context.http.get(`/cms/api/repair-forms/${this.repairDetailsData.id}/repair-records`).then(res => { // 维保记录信息
          // context.http.get(`/cms/api/equirements/${this.equirementId}/repair-records`).then(res => { // 维保记录信息
            this.repairRecords = res.data
          })
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      activeName: '0',
      repairRecords: [],
      pageType: 'readOnly',
      addData: {
        imgs: []
      },
      menuTab: 'repairRecord', // repairInfo保修单信息 repairRecord 维保记录
      drawerTitle: '维保详情',
      imgArr: [],
      num: 0,
      showPicture: false
    }
  },
  computed: {

  },
  methods: {
    formatRepairType (n) {
      if (n === 'EQUIREMENT') {
        return '设备'
      } else if (n === 'ROOMS') {
        return '房源'
      } else if (n === 'BUILDING') {
        return '其他'
      }
    },
    formatmaintenanceClassify (type) {
      if (type === 'REPAIR') {
        return '维修'
      } else if (type === 'MAINTAIN') {
        return '保养'
      } else {
        return '-'
      }
    },
    formatRepairStatus (n) {
      switch (n) {
        case 'NO':
          return '维保未完成'
        case 'COMPLETE':
          return '维保完成'
        default:
          return '-'
      }
    },
    pictureClose () {
      this.showPicture = false
    },
    showImg (item, index) {
      let imgArr = []
      this.repairDetailsData.imgs.forEach(item => {
        imgArr.push(item)
      })
      this.imgArr = imgArr
      this.num = index
      this.showPicture = true
    },
    showImg1 (item1, index1, index) {
      let imgArr = []
      this.repairRecords[index].imageUrls.forEach(item => {
        imgArr.push(item)
      })
      this.imgArr = imgArr
      this.num = index1
      this.showPicture = true
    },
    handleEdit (row, index) {
      this.$emit('showDevicesDetails')
    },
    current_change (currentPage) { // 切换页码
      this.currentPage = currentPage
      // this.getDataList()
    },
    menuTabChange (type) {
      // if (type === 'repairInfo') {
      //   context.http.get(`/cms/api/repair-forms/${this.repairDetailsData.repairFormId}`).then(res => {
      //     this.repairDetailsData = res.data
      //     this.menuTab = type
      //   })
      //   this.menuTab = type
      // } else {
      //   this.menuTab = type
      // }
      this.menuTab = type
    },
    onHide () {
      this.menuTab = 'repairRecord'
      this.$emit('drawerClose', false)
    }
  }
}
</script>
<style lang="scss">
.repairDetailsData{
  .el-collapse-item__header{
    padding-left: 20px;
    border-left:1px solid #EBEEF5; 
    border-right:1px solid #EBEEF5; 
    background-color: #FAFAFA;
    &.is-active{
      // border-bottom:1px solid #EBEEF5; 
    }
  }
  .el-collapse-item__wrap{
    border:1px solid #EBEEF5; 
  }
}
</style>
<style lang="scss" scoped>
  .repairDetailsData{
    .menuTab{
      height: 60px;
      line-height: 60px;
      margin: 10px 30px;
      box-shadow: 0px 1px 5px #eee;
      >span{
        display: inline-block;
        width: 120px;
        text-align: center;
        font-size: 14px;
        cursor: pointer;
        &.active{
          color: #3577F6;
          border-bottom: 2px solid #3577F6;
        }
      }
    }
    .main-content{
      width: 900px;
      .content{
        padding-top:1px; 
        // border: 1px solid #eeeeee;
        margin: 15px 30px;
        min-height: 200px;
        .upLoadDiv{
          padding-left: 20px;
          >div{
            display: flex;
            flex-wrap: wrap;
            margin: 15px 0;
          }
          .imgList{
              margin-right: 10px;
              margin-bottom: 10px;
            .item{
                width: 150px;
                height: 130px;
                position: relative;
                border: 1px solid #cecdcd;
              img{
                width: 148px;
                height: 128px;
              }
              >div{
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
                background-color: rgba(255, 255, 255, .7);
                >span{
                  display: inline-block;
                  width: 70%;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                >i{
                  cursor: pointer;
                }
              }
            }
          }
          .upLoadComponents{
            width: 150px;
            height: 130px;
            border: 1px dashed #D0D0D0FF;
            background: url(../../../../assets/plus.png) no-repeat center;
            .aliUpload{
              .oss_file{
                border:none!important;
                height: 130px;
                width: 100%;
                line-height: 195px;
                color: #3577F6;
              }
            }
          }
        }
        .title{
          padding-left: 15px;
        }
        .itemContent{
            padding: 15px 10px;
            display: flex;
            flex-wrap: wrap;
          .item{
            width: 33%;
            min-height: 70px;
            padding-left: 20px;
            >p{
              font-size: 14px;
              margin-bottom: 10px;
            }
            >span{
              display: inline-block;
              width: 100%;
              font-size: 12px;
              color: #8e8e8e;
            }
          }
        }
      }
    }
  }
</style>
