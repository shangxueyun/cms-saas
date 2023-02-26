
<template>
  <div class="tenant-details patrolPollingRecord repairFromdata1">
    <drawer :show="show"
            title="巡更巡检记录详情"
            @on-hide="onHide">
      <div class="tenant-details details-content repairDetails_content"
           slot="drawer">
        <div>
          <div class="main-content collapse_list"
               style="background-color: #fff;margin-top:15px;">
            <div class="content">
              <p class="title">
                <i></i>
                <span>基本信息</span>
              </p>
              <div class="itemContent">
                <div class="item">
                  <p>项目简称</p>
                  <span v-if="recordDetails.patrolInspection">{{recordDetails.patrolInspection.projectManagementName}}</span>
                </div>
                <div class="item">
                  <p>类型</p>
                  <span>{{patrolTypeFormat(recordDetails.patrolInspection && recordDetails.patrolInspection.patrolType)}}</span>
                </div>
                <div class="item">
                  <p>巡更巡检表名称</p>
                  <span>{{recordDetails.name}}</span>
                </div>
                <div class="item">
                  <p>频次</p>
                  <span>{{numberFormat(recordDetails.patrolInspection)}}</span>
                </div>
                <div class="item">
                  <p>责任人</p>
                  <span>{{recordDetails.person}}</span>
                </div>
                <div class="item">
                  <p>实际完成时间</p>
                  <span v-if="recordDetails.completeTime">{{recordDetails.completeTime.replace('T','  ')}}</span>
                </div>
                <div class="item">
                  <p>附件</p>
                  <div class="annexesList"
                       v-for="(item2, idx2) in recordDetails.annexes"
                       :key="idx2">
                    <span class="annexName"
                          :title="item2.annexName">{{item2.annexName}}</span>
                    <aliDownLoad class="aliDownLoad1"
                                 style="margin-right:15px"
                                 :item="item2"
                                 :encrypt="true" />
                    <ailPreview :ailObj="item2"
                                :encrypt="true"
                                @setFile="setFile" />

                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="content"
               style="min-height: 100px;margin-top:15px;background-color:#ffffff">
            <p class="title">
              <i></i>
              <span>巡更&巡检设备</span>
            </p>
            <div class="itemContent"
                 style="padding:15px">
              <el-table :data="recordDetails.equirementPatrolResults"
                        class="table tableData"
                        max-height="350px"
                        style="width: 100%"
                        ref="multipleTable">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <span style="padding-left:20px">备注：{{props.row.content}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="equirement.name"
                                 label="设备名称"
                                 align="center"> </el-table-column>
                <el-table-column prop="equirement.code"
                                 label="设备编号"
                                 align="center"> </el-table-column>
                <el-table-column prop="equirement.equirementType.parent.name"
                                 label="设备大类"
                                 align="center"> </el-table-column>
                <el-table-column prop="equirement.installPosition"
                                 label="安装位置"
                                 align="center"> </el-table-column>
                <el-table-column label="巡更&巡检结果"
                                 align="center">
                  <template slot-scope="props">
                    <span :class="{'normal' : props.row.checkStatus==='NORMAL'}"
                          v-if="props.row.checkStatus==='NORMAL'">正常</span>
                    <span :class="{'abnormal' : props.row.checkStatus==='ERROR'}"
                          v-else>异常</span>
                  </template>
                </el-table-column>
              </el-table>
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
import aliDownLoad from '@/components/aliDownLoad.vue'
import ailPreview from '@/components/ailPreview.vue'
import addRecord from './addRecord' // 巡更巡检记录
export default {
  components: {
    Drawer,
    aliDownLoad,
    ailPreview,
    picturePrevie,
    addRecord
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    recordDetails: {
      type: Object,
      default: {

      }
    }
  },
  watch: {
    show: {
      handler: function (newValue, oldValue) {
        if (newValue) {
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
      detailsShow: false,
      imgArr: [],
      num: 0,
      showPicture: false,
      currentPage: 1,
      pgSize: 15,
      total: 0,
      navList: [
        {
          label: '巡更巡检表',
          value: true
        }, {
          label: '巡更巡检记录',
          value: false
        }
      ],
      tabIndex: 0,
      tableData: [],
      pgNumoptions: [
        {
          value: 15,
          label: '15'
        },
        {
          value: 30,
          label: '30'
        },
        {
          value: 50,
          label: '50'
        }
      ]
    }
  },
  methods: {
    getAnnexesList () { },
    patrolTypeFormat (patrolType) {
      if (patrolType === 'PATROL') {
        return '巡更'
      } else if (patrolType === 'POLLING') {
        return '巡检'
      }
    },
    numberFormat (row) {
      if (row && row.frequencyUnit === 'ONCE') {
        return row.number + '天/次'
      } else if (row && row.frequencyUnit === 'DAY') {
        return row.number + '次/天'
      }
    },
    async query () { // 根据筛选条件查询报修单列表（分页）
      let param = {
        page: (this.currentPage - 1),
        size: this.pgSize,
        projectManagementId: '',
        name: '',
        patrolType: '',
        startTime: '',
        endTime: '',
        sort: 'completeTime,desc'
      }
      let result = await context.http.get('/cms/api/patrolInspectionRecord', param)
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
    },
    setFile (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
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
    onHide () {
      this.$emit('close', false)
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
      // return true
    }
  }
}
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>
.patrolPollingRecord {
  .table {
    .normal {
      color: #49af61;
    }
    .abnormal {
      color: #ff6665;
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
          > .annexesList {
            display: flex;
            font-size: 14px;
            color: #262626;
            height: 35px;
            line-height: 35px;
            border-bottom: 1px solid #eaeaea;
            > span {
              width: 80%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
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
  .tab {
    // margin: 10px 0;
    // padding: 0 30px;
    display: flex;
    justify-content: space-between;
    span {
      display: inline-block;
      width: 175px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border: 1px solid #3175f6;
      color: #596483;
      cursor: pointer;
      font-size: 16px;
    }
    .active {
      color: #ffffff;
      background-color: #3175f6;
    }
    div:first-child {
      /* display: flex; */
      // :first-child {
      //   border-right: none;
      //   border-top-left-radius: 8px;
      //   border-bottom-left-radius: 8px;
      // }
      // :last-child {
      //   border-left: none;
      //   border-top-right-radius: 8px;
      //   border-bottom-right-radius: 8px;
      // }
    }
    /* div:last-child {
      font-size: 12px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      .icon-edit2 {
        width: 15px;
        height: 20px;
        margin-right: 4px;
        background: url(../../../../assets/edit.png) no-repeat;
        background-size: contain;
      }
    } */
    .info_tab {
      height: 48px;
      width: 100%;
      padding: 0 20px;
      display: -ms-flexbox;
      display: flex;
      background-color: #fff;
      -ms-flex-pack: justify;
      justify-content: space-between;
      -ms-flex-align: center;
      align-items: center;
      border-bottom: 1px solid #ecedef;

      .nav {
        display: -ms-flexbox;
        display: flex;

        li.select_active {
          border-bottom: 2px solid #3175d2;
          color: #3175d2;
          font-weight: bolder;
        }

        li {
          width: 140px;
          text-align: center;
          font-size: 14px;
          color: #666;
          height: 46px;
          line-height: 46px;
          border-bottom: 2px solid #fff;
          cursor: pointer;
        }
      }
    }
  }
  .operation-btn{
    cursor: pointer;
    &:hover {
      background-color: #fff!important;
      color: #3175f6!important;
    }
  }
  .tenant-details {
    .title{
      .tban1 {
        margin-right: 10px;
        border: none;
        &:hover {
          background-color: #fff;
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
