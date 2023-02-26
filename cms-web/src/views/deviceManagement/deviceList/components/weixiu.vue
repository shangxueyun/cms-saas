
<template>
  <div class="tenant-details weixiuModule repairFromdata1">
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="tenant-details details-content repairDetails_content"
           slot="drawer">
        <div class="main-content repairInfo">
          <div class="content"
               v-if="isBaoxiudan">
            <p class="title">
              <i></i>
              <span>报修单信息</span>
            </p>
            <div class="itemContent">
              <div class="item">
                <p>报修编号<i class="required">*</i></p>
                <span>{{repairFromdata.repairFormCode}}</span>
              </div>
              <div class="item">
                <p>报修类型<i class="required">*</i></p>
                <span>{{repairFromdata.repairType==='ROOMS'?'房源':repairFromdata.repairType==='EQUIREMENT'?'设备':'其他'}}</span>
              </div>
              <div class="item"
                   v-if="repairFromdata.repairType==='ROOMS'">
                <p>房源号<i class="required">*</i></p>
                <span>{{repairFromdata.roomsName}}</span>
              </div>
              <div class="item"
                   v-if="repairFromdata.repairType==='EQUIREMENT'">
                <p>设备编号<i class="required">*</i></p>
                <span>{{repairFromdata.equirementNo}}</span>
              </div>
              <div class="item"
                   v-if="repairFromdata.repairType==='ROOMS' || repairFromdata.repairType==='EQUIREMENT'">
                <p>{{repairFromdata.repairType==='EQUIREMENT'?'设备名称':'房源名称'}}<i class="required">*</i></p>
                <span>{{repairFromdata.name}}</span>
              </div>
              <div class="item">
                <p>项目简称<i class="required">*</i></p>
                <span>{{repairFromdata.projectName}}</span>
              </div>
              <div class="item">
                <p>楼宇名称<i class="required">*</i></p>
                <span>{{repairFromdata.buildingName}}</span>
              </div>
              <div class="item"
                   v-if="repairFromdata.repairType==='EQUIREMENT'">
                <p>安装位置<i class="required">*</i></p>
                <span>{{repairFromdata.installPosition}}</span>
              </div>
              <div class="item">
                <p>问题简述<i class="required">*</i></p>
                <span>{{repairFromdata.title}}</span>
              </div>
              <div class="item">
                <p>报修原因<i class="required">*</i></p>
                <span>{{repairFromdata.content}}</span>
              </div>
            </div>
            <div class="upLoadDiv">
              <p>报修预览图</p>
              <div>
                <div class="imgList"
                     v-for="(item,index) in repairFromdata.imgs"
                     :key="index"
                     v-show="pageType==='add'">
                  <div class="item">
                    <img :src="item"
                         alt="">
                    <div>
                      <i class="el-icon-view"
                         @click="showImg1(item,index)"></i>
                      <i class="el-icon-delete"
                         @click="deleteFn(item,index)"></i>
                    </div>
                  </div>
                </div>
                <div class="imgList"
                     v-for="(item,index) in repairFromdata.imgs"
                     :key="item.id"
                     v-show="pageType==='readOnly'">
                  <div class="item">
                    <img :src="item"
                         alt=""
                         @click="showImg1(item,index)">
                    <div @click="showImg1(item,index)"
                         class="bottomTips">预览图片</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="main-content"
             :class="{'isBaoxiudan':!isBaoxiudan}"
             style="background-color: #fff">
          <div class="content">
            <p class="title">
              <i></i>
              <span>{{isBaoxiudan?'维修记录':'基本信息'}}</span>
            </p>
            <div class="itemContent">
              <div class="item">
                <p>维保编号<i class="required">*</i></p>
                <span>{{repairDetailsData.repairRecordCode}}</span>
              </div>
              <div class="item">
                <p>维保类型<i class="required">*</i></p>
                <span>{{repairDetailsData.repairType==='ROOMS'?'房源':repairDetailsData.repairType==='EQUIREMENT'?'设备':'其他'}}</span>
              </div>
              <div class="item">
                <p>维保方式<i class="required">*</i></p>
                <span>{{formatmaintenanceClassify(repairDetailsData.maintenanceClassify)}}</span>
              </div>

              <div class="item"
                   v-if="!isBaoxiudan">
                <p>{{repairDetailsData.repairType==='ROOMS'?'房源号':repairDetailsData.repairType==='EQUIREMENT'?'设备编号':'楼宇'}}<i class="required">*</i></p>
                <span v-if="repairDetailsData.repairType==='ROOMS'">{{repairDetailsData.roomsName}}</span>
                <span v-if="repairDetailsData.repairType==='EQUIREMENT'">{{repairDetailsData.equirementNo}}</span>
                <span v-if="repairDetailsData.repairType==='BUILDING'">{{repairDetailsData.buildingName}}</span>
              </div>
              <div class="item"
                   v-if="!isBaoxiudan">
                <p>{{repairDetailsData.repairType==='ROOMS'?'房源名称':'设备名称'}}<i class="required">*</i></p>
                <span>{{repairDetailsData.name}}</span>
              </div>
              <div class="item"
                   v-if="!isBaoxiudan">
                <p>项目简称<i class="required">*</i></p>
                <span>{{repairDetailsData.projectName}}</span>
              </div>
              <div class="item"
                   v-if="!isBaoxiudan">
                <p>楼宇名称<i class="required">*</i></p>
                <span>{{repairDetailsData.buildingName}}</span>
              </div>
              <div class="item"
                   v-if="!isBaoxiudan">
                <p>安装位置<i class="required">*</i></p>
                <span>{{repairDetailsData.installPosition}}</span>
              </div>

              <div class="item">
                <p>维保人员<i class="required">*</i></p>
                <span>{{repairDetailsData.repairUserName}}</span>
              </div>
              <div class="item">
                <p>维保日期<i class="required">*</i></p>
                <span>{{repairDetailsData.repairDate}}</span>
              </div>
              <div class="item">
                <p>维保费用<i class="required">*</i></p>
                <span>{{repairDetailsData.repairFee}}</span>
              </div>
              <div class="item">
                <p>维保结果<i class="required">*</i></p>
                <span>{{formatRepairStatus(repairDetailsData.repairStatus)}}</span>
              </div>
              <div class="item">
                <p>维保原因</p>
                <span>{{repairDetailsData.description}}</span>
              </div>
              <div class="item">
                <p>用材情况</p>
                <span>{{repairDetailsData.materialUsage}}</span>
              </div>
              <div class="item">
                <p>备注</p>
                <span>{{repairDetailsData.remake}}</span>
              </div>
            </div>
            <div class="upLoadDiv">
              <p style="font-size:14px;color:#777777">发票及维保后图片</p>
              <div>
                <div class="imgList"
                     v-for="(item,index) in repairDetailsData.imageUrls"
                     :key="index">
                  <div class="item">
                    <img :src="item"
                         alt=""
                         @click="showImg(item,index)">
                    <div @click="showImg(item,index)"
                         class="bottomTips">预览图片</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </drawer>
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
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
    drawerTitle: {
      type: String,
      default: ''
    },
    isBaoxiudan: {
      type: Boolean,
      default: false
    },
    maintenanceClassify: {

    },
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    equirementId: {
    },
    detailsType: { // 详情页面类型  报修信息详情repairForms   维保记录详情repairRecords
      type: String,
      default: 'repairForms'
    },
    repairDetailsData: {

    }
  },
  watch: {
    detailsdrawershow: {
      handler: function (newValue, oldValue) {
        if (newValue && this.repairDetailsData.maintenanceClassify === 'REPAIR') {
          context.http.get(`/cms/api/repair-forms/${this.repairDetailsData.repairFormId}`).then(res => { // 维保记录信息
            this.repairFromdata = res.data
          })
        }
      },
      immediate: true
    }
  },
  created () {
  },
  mounted () {
  },
  data () {
    return {
      activeName: '0',
      repairRecordsData: null,
      pageType: 'readOnly',
      repairFromdata: {
        imgs: []
      },
      addData: {
        imgs: []
      },
      imgArr: [],
      num: 0,
      showPicture: false
    }
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
        case 'COMPLETE':
          return '维保完成'
        case 'NO':
          return '维保未完成'
      }
    },
    pictureClose () {
      this.showPicture = false
    },
    showImg (item, index) {
      let imgArr = []
      this.repairDetailsData.imageUrls.forEach(item => {
        imgArr.push(item)
      })
      this.imgArr = imgArr
      this.num = index
      this.showPicture = true
    },
    showImg1 (item, index) {
      let imgArr = []
      this.repairFromdata.imgs.forEach(item => {
        imgArr.push(item)
      })
      this.imgArr = imgArr
      this.num = index
      this.showPicture = true
    },
    handleEdit (row, index) {
      this.$emit('showDevicesDetails')
    },
    current_change (currentPage) { // 切换页码
      this.currentPage = currentPage
      // this.getDataList()
    },
    onHide () {
      this.$emit('drawerClose', false)
    }
  }
}
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>
.weixiuModule {
  .addweibao {
    display: inline-block;
    background-color: #49af61;
    color: #fff;
    width: 120px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    border-radius: 3px;
    position: absolute;
    top: 17px;
    right: 32px;
    cursor: pointer;
  }
  .main-content {
    width: 900px;
    &.isBaoxiudan {
      // height: calc(100% - 100px);
      height: 100%;
    }
    .content {
      .upLoadDiv {
        padding-left: 20px;
        > div {
          display: flex;
          flex-wrap: wrap;
          margin: 15px 0;
        }
        .imgList {
          margin-right: 10px;
          margin-bottom: 10px;
          .item {
            width: 150px;
            height: 130px;
            position: relative;
            border: 1px solid #cecdcd;
            &:hover > .bottomTips {
              height: 25px;
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
              width: 148px;
              height: 128px;
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
        .upLoadComponents {
          width: 150px;
          height: 130px;
          border: 1px dashed #d0d0d0ff;
          background: url(../../../../assets/plus.png) no-repeat center;
          .aliUpload {
            .oss_file {
              border: none !important;
              height: 130px;
              width: 100%;
              line-height: 195px;
              color: #3577f6;
            }
          }
        }
      }
      .itemContent {
        padding: 15px 10px;
        display: flex;
        flex-wrap: wrap;
        .item {
          width: 33%;
          min-height: 70px;
          padding-left: 20px;
          > p {
            font-size: 14px;
            margin-bottom: 10px;
            color: #777777;
          }
          > span {
            display: inline-block;
            width: 100%;
            font-size: 14px;
            color: #262626;
          }
        }
      }
    }
  }
}
</style>
