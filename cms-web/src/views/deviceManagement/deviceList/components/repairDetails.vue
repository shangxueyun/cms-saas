
<template>
  <div class="tenant-details repairFromdata repairFromdata1">
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="tenant-details details-content repairDetails_content"
           slot="drawer">
        <!-- <span class="addweibao"
              @click="addweibaoOpen"><i class="iconfont icon-ico-fabu"></i>新增维保</span> -->
        <el-button class="tban tban1 addweibao"
                   v-if="addBtn"
                   @click="addweibaoOpen"><i class="iconfont icon-crm_xinzeng-"></i> 新增维修</el-button>
        <!-- <div class="menuTab">
          <span :class="{'active':menuTab==='repairRecord'}"
                @click="menuTabChange('repairRecord')">维保信息</span>
          <span :class="{'active':menuTab==='repairInfo'}"
                @click="menuTabChange('repairInfo')">报修单信息</span>
        </div> -->
        <div class="main-content repairInfo">
          <!-- <span @click="editFn" style="position: absolute; top: -35px; right: 0;">编辑</span> -->
          <div class="content">
            <p class="title">
              <i></i>
              <span>报修单信息</span>
            </p>
            <div class="itemContent">
              <div class="item">
                <p>报修编号</p>
                <span>{{repairDetailsData.repairFormCode}}</span>
              </div>
              <div class="item">
                <p>报修类型</p>
                <span>{{repairDetailsData.repairType==='ROOMS'?'房源':repairDetailsData.repairType==='EQUIREMENT'?'设备':'其他'}}</span>
              </div>
              <div class="item"
                   v-if="repairDetailsData.repairType==='ROOMS'">
                <p>房源号</p>
                <span>repairDetailsData.roomsName</span>
              </div>
              <div class="item"
                   v-if="repairDetailsData.repairType==='EQUIREMENT'">
                <p>设备编号</p>
                <span>{{repairDetailsData.equirementNo}}</span>
              </div>
              <div class="item"
                   v-if="repairDetailsData.repairType==='ROOMS' || repairDetailsData.repairType==='EQUIREMENT'">
                <p>{{repairDetailsData.repairType==='EQUIREMENT'?'设备名称':'房源名称'}}</p>
                <span>{{repairDetailsData.name}}</span>
              </div>
              <div class="item">
                <p>项目简称</p>
                <span>{{repairDetailsData.projectName}}</span>
              </div>
              <div class="item">
                <p>楼宇名称</p>
                <span>{{repairDetailsData.buildingName}}</span>
              </div>
              <div class="item"
                   v-if="repairDetailsData.repairType==='EQUIREMENT'">
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
                <div class="imgList"
                     v-for="(item,index2) in repairDetailsData.imgs"
                     :key="index2"
                     v-show="pageType==='add'">
                  <div class="item">
                    <img :src="item"
                         alt="">
                    <div>
                      <i class="el-icon-view"
                         @click="showImg(item,index2)"></i>.addRepair
                      <i class="el-icon-delete"
                         @click="deleteFn(item,index2)"></i>
                    </div>
                  </div>
                </div>
                <div class="imgList"
                     v-for="(item,index3) in repairDetailsData.imgs"
                     :key="item.id"
                     v-show="pageType==='readOnly'">
                  <div class="item">
                    <img :src="item"
                         alt=""
                         @click="showImg(item,index3)">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="main-content collapse_list">
          <p class="title">
            <i></i>
            <span>维修记录</span>
          </p>
          <el-collapse accordion
                       class="collapse_repair"
                       v-if="repairRecords.length>0"
                       v-model="activeName">
            <el-collapse-item v-for="(item,index) in repairRecords"
                              :key="item.id"
                              :name="index.toString()">
              <template slot="title"
                        class="collapseTitle">
                <div>
                  <span>维修记录{{repairRecords.length-index}}</span>
                  <span>{{activeName===index+''?'点击收起':'点击展开'}}</span>
                </div>
              </template>
              <div class="content">
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
                  <!-- <div class="item">
                    <p>{{item.repairType==='ROOMS'?'房源名称':'设备名称'}}</p>
                    <span>{{item.name}}</span>
                  </div> -->
                  <!-- <div class="item">
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
                  </div> -->
                  <div class="item"
                       v-if="item.maintenanceClassify==='MAINTAIN'">
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
                  <p style="font-size:14px;color:#777777">发票及维保后图片</p>
                  <div>
                    <div class="imgList"
                         v-for="(item1,index1) in item.imageUrls"
                         :key="index1">
                      <div class="item">
                        <img :src="item1"
                             alt=""
                             @click="showImg1(item1,index1,index)">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="content"
                   v-if="item.maintenanceClassify==='MAINTAIN'">
                <p class="title">维保计划</p>
                <div class="itemContent">
                  <div class="item">
                    <p><i>下次维保日期:</i></p>
                    <span>{{item.nextMaintenanceTime ? item.nextMaintenanceTime : '-'}}</span>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
          <p v-else
             style="padding: 20px 33px;min-height: 400px;border: 1px solid #eee;">暂无维保数据</p>
        </div>
      </div>
      <!-- <div slot="footer"
           class="dialog-footer">
        <el-button @click="onHide"
                   class="close-button">关闭</el-button>
      </div> -->
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
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    detailsType: { // 详情页面类型  报修信息详情repairForms   维保记录详情repairRecords
      type: String,
      default: 'repairForms'
    },
    equirementId: {

    },
    repairDetailsData: {
      type: Object,
      default: {
        imgs: []
      }
    },
    addBtn: {
      type: Boolean,
      default: true
    }
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
  created () {
  },
  mounted () {
  },
  data () {
    return {
      activeName: '0',
      repairRecordsData: null,
      pageType: 'readOnly',
      repairRecords: {
        imgs: []
      },
      addData: {
        imgs: []
      },
      menuTab: 'repairRecord', // repairInfo保修单信息 repairRecord 维保记录
      drawerTitle: '报修单详情',
      imgArr: [],
      num: 0,
      showPicture: false
    }
  },
  methods: {
    getRepair_records () { // 维保记录信息list
      context.http.get(`/cms/api/equirements/${this.equirementId}/repair-records`).then(res => {
        this.repairRecords = res.data
      })
    },
    addweibaoOpen () {
      this.$emit('addweibaoOpen', this.repairDetailsData)
    },
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
    // menuTabChange (type) {
    //   // if (this.detailsType === 'repairRecord') {
    //   //   if (type === 'repairInfo') {
    //   //     context.http.get(`/cms/api/repair-forms/${this.repairDetailsData.repairFormId}`).then(res => {
    //   //       this.repairFromdata = res.data
    //   //       this.menuTab = type
    //   //     })
    //   //   } else {
    //   //     this.menuTab = type
    //   //   }
    //   // } else {
    //   this.menuTab = type
    //   // }
    // },
    onHide () {
      // this.menuTab = 'repairRecord'
      this.$emit('drawerClose', false)
    }
  }
}
</script>
<style lang="scss">
.repairFromdata1 {
  > div {
    &.vue-drawer {
      .drawer {
        background-color: #faf7fa !important;
        overflow: hidden;
        .wrap {
          height: 100%;
        }
        .drawer-head {
          padding: 0;
          margin: 0;
          height: 60px;
          line-height: 60px;
          background-color: #ffffff;
          padding-left: 15px;
          font-weight: bold;
          border: none;
          .el-dialog__close {
            font-size: 24px;
            color: #b9b9b9;
            margin-top: 20px;
          }
          .el-dialog__title {
            color: #262626;
            font-size: 16px;
          }
        }
        .repairDetails_content {
          margin: 0;
          height: calc(100% - 60px);
          overflow-y: auto;
          padding-bottom: 20px;
          margin-top: 15px;
          &::-webkit-scrollbar {
            width: 4px !important;
            height: 4px !important;
          }
          &::-webkit-scrollbar-track {
            box-shadow: inset 0 0 6px #fff;
            background-color: #fff;
          }
          &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            box-shadow: inset 0 0 6px #cccccc;
          }
          .repairInfo {
            background-color: #ffffff;
          }
          .title {
            // height: 45px;
            // line-height: 45px;
            display: flex;
            align-items: center;
          }
          .collapse_repair {
            padding: 0 15px;
            background-color: #ffffff;
            .el-collapse-item__header {
              > div {
                width: 95%;
                display: flex;
                justify-content: space-between;
                > span {
                  &:last-child {
                    font-size: 12px;
                    color: rgba(53, 119, 246, 1);
                  }
                }
              }
            }
            .el-collapse-item__content {
              padding-bottom: 0;
              background-color: #f7f8fa;
            }
          }
        }
        .el-dialog__footer {
          padding: 0;
          background-color: #ffffff;
          margin-top: 15px;
          .dialog-footer {
            height: 80px;
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            > span {
              display: inline-block;
              width: 90px;
              height: 34px;
              line-height: 34px;
              text-align: center;
              cursor: pointer;
              color: #666666;
              &.subBtn {
                background-color: #3577f6;
                color: #ffffff;
                border-radius: 4px;
              }
              &.quxiao_btn {
                &:hover {
                  color: #3577f6;
                }
              }
            }
          }
        }
      }
    }
    .ctc-foot {
      justify-content: normal;
      flex-direction: row-reverse;
      align-items: center;
      color: #3f5fbf;
      font-size: 12px;
      padding: 60px 20px 30px 20px;
      .pagingnum {
        color: #3f5fbf;
        font-size: 12px;
        select {
          width: 65px;
          height: 28px;
          border-radius: 2px;
          border-color: #f6f6f7;
          color: #3577f6;
        }
      }
      .el-pagination.is-background .btn-next,
      .el-pagination.is-background .btn-prev,
      .el-pagination.is-background .el-pager li {
        margin: 0 5px;
        background-color: transparent;
        color: #3f5fbf;
        min-width: 30px;
        border-radius: 2px;
        font-size: 14px;
      }
      .el-pagination.is-background .el-pager li:not(.disabled).active {
        border-radius: 50%;
        background-color: #3f5fbf !important;
        color: #fff !important;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.repairFromdata {
  .addweibao {
    position: absolute;
    top: 17px;
    right: 32px;
    cursor: pointer;
  }
  .menuTab {
    height: 60px;
    line-height: 60px;
    margin: 10px 30px;
    box-shadow: 0px 1px 5px #eee;
    > span {
      display: inline-block;
      width: 120px;
      text-align: center;
      font-size: 14px;
      cursor: pointer;
      &.active {
        color: #3577f6;
        border-bottom: 2px solid #3577f6;
      }
    }
  }
  .main-content {
    width: 900px;
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
