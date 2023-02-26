<template>
  <div class="tenant-details relevanDetails">
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="tenant-details details-content repairDetails_content"
           slot="drawer">
        <div class="main-content repairInfo">
          <!-- <div class="deviceName"></div> -->
          <p class="title">
            <i></i>
            <span>关联对象 - {{detailsName||'暂无'}}</span>
          </p>
          <div class="menuTab"
               v-if="detailType==='ROOM'">
            <!-- <span :class="{'active':menuTab==='DEVICE'}"
                  @click="menuTabChange('DEVICE')"
                  v-if="detailType==='DEVICE'">设施设备列表</span> -->
            <span :class="{'active':menuTab==='ROOM'}"
                  @click="menuTabChange('ROOM')"
                  v-if="detailType==='ROOM'">房源信息</span>
            <span :class="{'active':menuTab==='repairInfo'}"
                  v-if="detailType==='ROOM'"
                  @click="menuTabChange('repairInfo')">维保记录</span>
          </div>
          <div v-if="menuTab==='DEVICE'">
            <div class="table details_table">
              <el-table :data="detailsList"
                        key="1"
                        style="width: 100%">
                <el-table-column prop="name"
                                 label="设备名称"
                                 align="center"> </el-table-column>
                <el-table-column prop="code"
                                 label="设备编号"
                                 align="center"> </el-table-column>
                <el-table-column prop="equirementType.parent.name"
                                 label="设备大类"
                                 align="center"> </el-table-column>
                <el-table-column prop="brand"
                                 label="品牌"
                                 align="center"> </el-table-column>
                <el-table-column prop="installPosition"
                                 label="安装位置"
                                 align="center"> </el-table-column>
                <el-table-column label="操作"
                                 align="center">
                  <template slot-scope="scope">
                    <!-- <el-button class="el-button--primary editbtn"
                               size="mini"
                               @click="handleEdit(scope.$index, scope.row)">查看</el-button> -->
                    <span @click="handleEdit(scope.$index, scope.row)"
                          class="table_chakan">查看</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="ctc-foot">
              <el-col :span="24">
                <span class="flex">
                  <el-pagination v-if="total > 0"
                                 background
                                 layout="prev, pager, next"
                                 :page-size=15
                                 :total="total"
                                 :current-page="currentPage"
                                 @current-change="current_change">
                  </el-pagination>
                </span>
              </el-col>
            </div>
          </div>
          <div v-if="menuTab==='ROOM'"
               class="storeInfo">
            <div class="content">
              <el-collapse v-model="activeName"
                           accordion>
                <el-collapse-item v-for="(item,index) in detailsList"
                                  :key="index"
                                  :name="index+1+''">
                  <template slot="title">
                    <p style="padding-left:15px">房源基本信息{{index+1}}</p>
                  </template>
                  <div class="content_main">
                    <div class="storeImg">
                      <img :src="item.imgUrls"
                           alt="">
                    </div>
                    <div class="itemTxt">
                      <div>
                        <p>项目：</p>
                        <p>{{item.projectManagement.projectName}}</p>
                      </div>
                      <div>
                        <p>选择楼宇：</p>
                        <p>{{item.building.buildingName}}</p>
                      </div>
                      <div>
                        <p>选择楼层：</p>
                        <p>{{item.floor.name}}</p>
                      </div>
                      <div>
                        <p>房源号：</p>
                        <p>{{item.shopNumber}}</p>
                      </div>
                      <div>
                        <p>建筑面积/㎡：</p>
                        <p>{{item.buildingArea}}</p>
                      </div>
                      <div>
                        <p>预期业态：</p>
                        <p>{{formatIndustry(item.industry)}}</p>
                      </div>
                      <div>
                        <p>装修程度：</p>
                        <p>{{item.decorationName||'-'}}</p>
                      </div>
                      <div>
                        <p>招商状态：</p>
                        <p>{{formatInvestmentStatus(item.investmentStatus)}}</p>
                      </div>
                      <div>
                        <p>预期单价：</p>
                        <p>{{item.expectedUnitPrice}} {{formatPriceUnit(item.priceUnit)}}</p>
                      </div>
                      <div>
                        <p>房源状态：</p>
                        <p>{{item.useStatus==='USING'?'使用中':'不可用'}}</p>
                      </div>
                      <!-- <div>
                        <p>平面图优先展示：</p>
                        <p>合同信息</p>
                      </div> -->
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
          <div v-if="menuTab==='repairInfo'">
            <div class="table details_table">
              <el-table :data="tableData"
                        key="2"
                        style="width: 100%">
                <el-table-column prop="repairRecordCode"
                                 label="维保编号"
                                 align="center"> </el-table-column>
                <el-table-column prop="roomsName"
                                 label="房源号"
                                 align="center"
                                 :formatter="formatRoomsName"> </el-table-column>
                <el-table-column prop="name"
                                 label="设备名称"
                                 align="center"> </el-table-column>
                <el-table-column label="维保方式"
                                 align="center"
                                 :formatter="formatmaintenanceClassify"> </el-table-column>
                <el-table-column prop="repairUserName"
                                 label="维保人员"
                                 align="center"> </el-table-column>
                <el-table-column prop="repairDate"
                                 label="维保日期"
                                 align="center"></el-table-column>
                <el-table-column label="维保结果"
                                 align="center"
                                 :formatter="formatRepairStatus"> </el-table-column>
                <el-table-column label="操作"
                                 align="center">
                  <template slot-scope="scope">
                    <span @click="handleEdit1(scope.$index, scope.row)"
                          class="table_chakan">查看</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="ctc-foot">
              <el-col>
                <span class="flex">
                  <el-pagination v-if="total1 > 0"
                                 background
                                 layout="prev, pager, next"
                                 :page-size='pgSize1'
                                 :total="total1"
                                 :current-page="currentPage1"
                                 @current-change="current_change1">
                  </el-pagination>
                </span>
              </el-col>
            </div>
          </div>
        </div>
      </div>
      <!-- <div slot="footer"
           class="dialog-footer">
        <el-button @click="onHide"
                   class="close-button">关闭</el-button>
      </div> -->
    </drawer>
  </div>
</template>
<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import { error } from 'util'
export default {
  components: {
    Drawer
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    detailType: { // 详情类型 店铺详情storeInfo  设备详情deviceInfo
      type: String,
      default: 'ROOM'
    },
    detailsList: {},
    detailsName: {},
    menuTab: {
      type: String,
      default: 'ROOM'
    } // deviceInfo设备信息  repairInfo 维保记录
  },
  created () {

  },
  mounted () {
  },
  data () {
    return {
      activeName: '1',
      drawerTitle: '详细信息',
      tableData: [],
      tableDeviceData: [],
      currentPage: 1,
      total: 1,
      pgSize: 15,
      currentPage1: 1,
      total1: 1,
      pgSize1: 15
    }
  },
  computed: {

  },
  methods: {
    formatInvestmentStatus (str) { // 招商状态
      switch (str) {
        case 'OK':
          return '可招商'
        case 'NO':
          return '自用'
        case 'FICTITIOUS':
          return '虚拟房源'
        default:
          return '-'
      }
    },
    formatRoomsName (row, column) {
      if (row.roomsName) {
        return row.roomsName
      } else {
        return '-'
      }
    },
    formatmaintenanceClassify (row, column) {
      if (row.maintenanceClassify === 'REPAIR') {
        return '维修'
      } else if (row.maintenanceClassify === 'MAINTAIN') {
        return '保养'
      } else {
        return '-'
      }
    },
    formatRepairStatus (row, column) {
      switch (row.repairStatus) {
        case 'NO':
          return '维保未完成'
        case 'COMPLETE':
          return '维保完成'
        default:
          return '-'
      }
    },
    menuTabChange (type) {
      if (type === 'repairInfo') {
        let arr = []
        this.detailsList.forEach(element => {
          arr.push(element.id)
        })
        let ids = arr.join(',')
        context.http.get(`cms/api/repair-records/svg/`, { id: ids, planeStyle: this.detailType, page: (this.currentPage1 - 1), size: this.pgSize1, sort: 'createdDate,desc' }).then(res => {
          this.tableData = res.data
          this.total1 = Number(res.headers['x-total-count'])
          this.$emit('menuTab', type)
          this.$forceUpdate()
        }).catch(error => {
          console.log(error)
        })
      } else {
        this.$emit('menuTab', type)
      }
    },
    formatPriceUnit (n) {
      switch (n) {
        case 'M2DAYS':
          return '元/㎡天'
        case 'M2MONTH':
          return '元/㎡月'
        case 'DAY':
          return '元/天'
        case 'MONTH':
          return '元/月'

      }
    },
    formatIndustry (n) {
      switch (n) {
        case 'LIFE':
          return '生活配套'
        case 'FINANCIAL':
          return '金融'
        case 'RETAIL':
          return '零售'
        case 'FOOD':
          return '餐饮'
        case 'BDUCATION':
          return '亲子教育'
        case 'SERVICE':
          return '其他'
        case 'CSE':
          return '娱乐'
        case 'REALESTATE':
          return '房地产'
      }
    },
    handleEdit (index, row) { // 查看设备详情
      this.$emit('showDevicesDetails', row.id)
    },
    handleEdit1 (index, row) { // 下table入口
      let id = row.id
      if (row.maintenanceClassify === 'REPAIR') { // 维修 true表示维修单里有报修信息
        this.$emit('emitOpenweixiu', id, true)
      } else if (row.maintenanceClassify === 'MAINTAIN') { //  保养
        this.$emit('emitOpenbaoyang', id)
      }
    },
    current_change1 (currentPage) { // 切换页码
      this.currentPage1 = currentPage
      this.menuTabChange('repairInfo')
    },
    current_change (currentPage) { // 切换页码
      this.currentPage = currentPage
    },
    onHide () {
      this.$emit('drawerClose', false)
    }
  }
}
</script>
<style lang="scss" >
.table_chakan {
  color: #3575f6;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
.relevanDetails {
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
      .flex {
        display: flex;
        justify-content: space-between;
        flex-direction: row-reverse;
      }
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
.relevanDetails {
  .main-content {
    width: 900px;
    .storeInfo {
      height: 757px;
      overflow-y: auto;
      .content {
        .content_main {
          display: flex;
          margin: 15px;
          background-color: #f7f8fa;
          padding: 15px;
          .storeImg {
            width: 230px;
            height: 170px;
            background: url(../../../../assets/berth-default.png) no-repeat;
            > img {
              width: 100%;
              height: 100%;
            }
          }
          .itemTxt {
            width: 400px;
            margin-left: 100px;
            > div {
              display: flex;
              margin-bottom: 20px;
              p {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                &:first-child {
                  width: 120px;
                  margin-right: 15px;
                  text-align: right;
                  font-size: 14px;
                  color: #777777;
                }
                &:last-child {
                  width: 280px;
                  font-size: 14px;
                  color: #262626;
                }
              }
            }
          }
        }
      }
    }

    .table {
      margin: 15px 30px;
      border: none;
      // height: 600px;
      overflow-y: auto;
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
      .el-button--primary {
        color: #3175f6ff;
      }
      .editbtn:hover {
        color: #fff;
      }
    }
    .deviceName {
      height: 80px;
      line-height: 80px;
      border-top: 1px solid #eee;
      padding-left: 15px;
    }
    .menuTab {
      height: 60px;
      align-items: center;
      display: flex;
      padding: 0 30px;
      > span {
        display: inline-block;
        width: 120px;
        text-align: center;
        cursor: pointer;
        height: 34px;
        line-height: 34px;
        background: rgba(248, 248, 248, 1);
        border-radius: 2px;
        font-size: 14px;
        color: #777777;
        &.active {
          background: rgba(238, 244, 255, 1);
          color: #3175f6ff;
          // border-bottom: 2px solid #3175f6ff;
        }
      }
    }
  }
}
</style>
