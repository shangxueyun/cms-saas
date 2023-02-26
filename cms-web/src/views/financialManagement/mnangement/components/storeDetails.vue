<template>
  <div class="tenant-details">
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            @on-hide="onHide">

      <div class="tenant-details details-content store-details"
           slot="drawer">
        <!--<div class="typeTab">
                  <span v-for="(item,index) in detailsData" :key="index"  :class="{'active':index===currentIndex}" @click="changeTab(item,index)">{{item.shopNumber}}</span>
                </div>-->

        <el-tabs class="elTabs"
                 v-model="activeName"
                 @tab-click="handleClick">
          <el-tab-pane v-for="(item,index) in detailsData"
                       :key="index"
                       :label="item.shopNumber"
                       :name="'num' + index">
            <div class="main-content clearfix">
              <div class="mc-left float-left">
                <div class="part1">
                  <p class="title">房源基础信息</p>
                  <div class="content clearfix">
                    <div class="float-left"
                         style="width: 60%">
                      <div class="wheelplanting"
                           style="position: relative;">
                        <img v-if="selectedImg"
                             :src="selectedImg" />
                        <img src="../../../../assets/berth-default.png"
                             v-else />
                      </div>
                      <div class="wheelp-list">
                        <span class="iconfont icon-right iconRight"
                              @click="selectImg('reduce')"
                              v-if="roomInvestmentData.roomsDTO && roomInvestmentData.roomsDTO.imgUrls && roomInvestmentData.roomsDTO.imgUrls.length > 0"></span>
                        <div v-for="(item, index) in roomInvestmentData.roomsDTO.imgUrls"
                             :key="index">
                          <img :src="item"
                               :class="{'imgborder': index === selectIndex}" />
                        </div>
                        <span class="iconfont icon-right"
                              @click="selectImg('add')"
                              v-if="roomInvestmentData.roomsDTO && roomInvestmentData.roomsDTO.imgUrls && roomInvestmentData.roomsDTO.imgUrls.length > 0"></span>
                      </div>
                    </div>
                    <div class="float-right"
                         style="width: 40%">
                      <p><span>项目：</span> <span v-if="roomInvestmentData.roomsDTO && roomInvestmentData.roomsDTO.projectManagement">{{roomInvestmentData.roomsDTO.projectManagement.projectName}}</span></p>
                      <p><span>所在楼宇：</span> <span v-if="roomInvestmentData.roomsDTO && roomInvestmentData.roomsDTO.building">{{roomInvestmentData.roomsDTO.building.buildingName}}</span></p>
                      <p><span>选择楼层：</span><span>{{roomInvestmentData.roomsDTO.floor.name?roomInvestmentData.roomsDTO.floor.name:'-'}}</span></p>
                      <p><span>房源号：</span><span>{{roomInvestmentData.roomsDTO.shopNumber?roomInvestmentData.roomsDTO.shopNumber:'-'}}</span></p>
                      <p><span>建筑面积／m²：</span><span>{{roomInvestmentData.roomsDTO.buildingArea?roomInvestmentData.roomsDTO.buildingArea:'-'}}</span></p>
                      <p><span>预期业态：</span><span>{{formatIndustry(roomInvestmentData.roomsDTO.industry)}}</span></p>
                      <p><span>装修程度：</span><span>{{roomInvestmentData.roomsDTO.decorationName?roomInvestmentData.roomsDTO.decorationName:'-'}}</span></p>
                      <p><span>招商状态：</span><span>{{formatInvestmentStatus(roomInvestmentData.roomsDTO.investmentStatus)}}</span></p>
                      <p><span>预期单价：</span><span>{{roomInvestmentData.roomsDTO.expectedUnitPrice | toLocaleString}}{{formatPriceUnit(roomInvestmentData.roomsDTO.priceUnit)}}</span></p>
                      <p><span>房源状态：</span><span>{{formatUseStatus(roomInvestmentData.roomsDTO.useStatus)}}</span></p>
                      <p><span>平面图优先展示：</span><span>{{formatFirstDisplay(roomInvestmentData.roomsDTO.firstDisplay)}}</span></p>
                    </div>
                  </div>
                </div>
                <div class="part2">
                  <p class="title">房源工程条件</p>
                  <div class="content"
                       v-if="roomInvestmentData.roomsDTO.projectConditions && roomInvestmentData.roomsDTO.projectConditions.length > 0">
                    <div class="item"
                         v-for="item in EngInfoList"
                         :key="item.id"
                         v-show="item.isChecked">
                      <span>
                        <!-- <el-checkbox disabled></el-checkbox>  -->
                        <el-checkbox style="margin-right:15px"
                                     :checked="item.isChecked"
                                     disabled></el-checkbox>
                        {{item.value}}
                      </span>
                      <span>{{item.needValue===''?'-':item.needValue}} {{item.description}}</span>
                    </div>
                  </div>
                  <div v-else>
                    <div style="padding: 20px;color:#777777">暂无数据</div>
                  </div>
                </div>
                <div class="part3">
                  <p class="title">当前合同</p>
                  <div class="content"
                       v-if="roomInvestmentData.currList && roomInvestmentData.currList.length > 0">
                    <div class="tableTitle"
                         v-for="(item, index) in roomInvestmentData.currList"
                         :key="index">
                      <div class="chakan">
                        <el-button type="primary"
                                   size="mini"
                                   @click="cheackDtl(item)">查看</el-button>
                      </div>
                      <span>合同编号：{{item.contractNo}}</span><span>开始时间：{{item.startDate}}</span><span>结束时间：{{item.endDate}}</span>
                      <span>品牌：{{item.referred}}</span><span>实时单价：{{item.price | toLocaleString}}{{formatPriceUnit(item.priceUnit)}}</span><span>合同状态：{{formatContractStatus(item.contractStatus)}}</span>
                    </div>
                  </div>
                  <div v-else>
                    <div style="padding: 20px;color:#777777">暂无数据</div>
                  </div>
                </div>
                <div class="part3">
                  <p class="title">历史合同</p>
                  <div class="content"
                       v-if="roomInvestmentData.hisList && roomInvestmentData.hisList.length > 0">
                    <div class="tableTitle"
                         v-for="(item, index) in roomInvestmentData.hisList"
                         :key="index">
                      <div class="chakan">
                        <el-button type="primary"
                                   size="mini"
                                   @click="cheackDtl(item)">查看</el-button>
                      </div>
                      <span>合同编号：{{item.contractNo}}</span><span>开始时间：{{item.startDate}}</span><span>结束时间：{{item.endDate}}</span>
                      <span>品牌：{{item.referred}}</span><span>实时单价：{{item.price | toLocaleString}}{{formatPriceUnit(item.priceUnit)}}</span><span>合同状态：{{formatContractStatus(item.contractStatus)}}</span>
                    </div>
                  </div>
                  <div v-else>
                    <div style="padding: 20px;color:#777777">暂无数据</div>
                  </div>
                </div>
              </div>
              <div class="mc-right float-right"
                   style="width: 460px;margin-left: 10px;">
                <div class="part1">
                  <p class="title">意向客户档案</p>
                  <div class="content"
                       v-if="roomInvestmentData.yxTenantInvestmentDTOS && roomInvestmentData.yxTenantInvestmentDTOS.length > 0">
                    <div v-if="roomInvestmentData.yxTenantInvestmentDTOS"
                         class="intentionlist"
                         v-for="(item, index) in roomInvestmentData.yxTenantInvestmentDTOS"
                         :key="index">
                      <span>
                        <el-button type="primary"
                                   size="mini"
                                   @click="cheackYXKH(item)">查看</el-button>
                      </span>
                      <p><span>品牌：</span> <span>{{item.referred}}</span></p>
                      <p><span>业态：</span> <span>{{item.industryName}}</span></p>
                      <p><span>需求面积：</span> <span>{{item.lowArea}}-{{item.highArea}}㎡</span></p>
                      <p><span>报价：</span> <span>{{item.price | toLocaleString}}{{formatPriceUnit(item.priceUnit)}}</span></p>
                      <p><span>跟进人：</span> <span>{{item.followName}}</span></p>
                    </div>
                  </div>
                  <div v-else>
                    <div style="padding: 20px;color:#777777">暂无数据</div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>

      </div>

      <div slot="footer"
           class="dialog-footer">
        <el-button @click="onHide"
                   class="close-button">关闭</el-button>
        <el-button @click="onHide"
                   type="primary"
                   class="defaultbtn dialog-confirmBtn">确 定</el-button>
      </div>
    </drawer>
  </div>
</template>

<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
export default {
  components: {
    Drawer
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    detailsData: {
      type: Array,
      default: [{
        building: { projectManagementDTO: { previewImage: '', projectName: '' } }
      }]
    }
  },
  watch: {
    detailsdrawershow: {
      handler (newValue, oldValue) {
        console.log('open')
        this.getRoomContracts()
        this.getRoominvestment()
        //        this.formatProjectConditions()
        // console.log('监听roomInvestmentData')
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      drawerTitle: '房源信息',
      selectIndex: 0,
      selectedImg: '',
      checked2: true,
      EngInfoList: [], // 工程条件列表
      keyVersions: 0,
      currentIndex: 0,
      activeName: 'num0',
      roomContractsList: [],
      roomInvestmentData: {
        'roomsDTO': {
          'building': { 'projectManagementDTO': { 'previewImage': '', 'projectName': '' } },
          'projectManagement': { 'projectName': '' },
          'imgUrls': [],
          'floor': {}
        },
        yxTenantInvestmentDTOS: [],
        currList: []
      }
    }
  },
  created () {
    this.EngInfoList = this.$store.state.projectList // 工程条件列表
    this.EngInfoListInit(this.EngInfoList)
  },
  mounted () {
  },
  methods: {
    async getRoomContracts () { // 单独接口获取房间合同列表
      let result = await context.http.get('cms/api/contracts/rooms', { roomsId: this.detailsData[this.currentIndex].id })
      this.roomContractsList = result.data
    },
    async getRoominvestment () { // 单独接口获取房源详情
      let result = await context.http.get(`cms/api/rooms/investment/${this.detailsData[this.currentIndex].id}`)
      this.roomInvestmentData = result.data
      this.formatProjectConditions()
      if (this.roomInvestmentData.roomsDTO && this.roomInvestmentData.roomsDTO.imgUrls && this.roomInvestmentData.roomsDTO.imgUrls.length > 0) {
        this.selectedImg = this.roomInvestmentData.roomsDTO.imgUrls[0]
      } else {
        this.selectedImg = ''
      }
    },
    changeTab (item, index) {
      this.currentIndex = index
      console.log(this.currentIndex)
      this.getRoomContracts()
      this.getRoominvestment()
    },
    handleClick (tab, event) {
      console.log(tab, event)
      this.currentIndex = tab.index
      console.log(this.currentIndex)
      this.getRoomContracts()
      this.getRoominvestment()
    },
    EngInfoListInit (arr) { // 初始化工程条件列表
      for (let i = 0; i < arr.length; i++) {
        this.$set(arr[i], 'isChecked', false)
        this.$set(arr[i], 'needValue', null)
      }
      // console.log(this.EngInfoList)
    },
    formatProjectConditions () { // 详情参数处理
      let projectData = this.roomInvestmentData.roomsDTO.projectConditions
      for (let i = 0; i < projectData.length; i++) {
        for (let k = 0; k < this.EngInfoList.length; k++) {
          if (Number(projectData[i].projectType) === this.EngInfoList[k].id) {
            this.$set(this.EngInfoList[k], 'needValue', projectData[i].needValue ? projectData[i].needValue : '')
            this.$set(this.EngInfoList[k], 'isChecked', true)
          }
        }
      }
      ++this.keyVersions
    },
    cheackDtl (item) { // 查看合同
      this.$router.push({ name: 'contractsList', params: { pageFrom: 'industryCAD', row: item } })
    },
    cheackYXKH (item) { // 查看意向客户
      let projectManagemenId = this.roomInvestmentData.roomsDTO.projectManagement.id // 项目id
      item.projectManagemenId = projectManagemenId
      this.$router.push({ name: 'potlClients', params: { pageFrom: 'industryCAD', row: item } })
    },
    formatContractStatus (str) { // 合同状态
      switch (str) {
        case 'STORAGE':
          return '暂存'
        case 'PENDING':
          return '待执行'
        case 'EXECUTING':
          return '执行中'
        case 'ZH_APPROVAL':
          return '招商审核中'
        case 'TZ_APPROVAL':
          return '退租审核中'
        case 'WITHDRAWAL':
          return '已退租'
        case 'XQ_APPROVAL':
          return '续签审核中'
        case 'NO':
          return '审核未通过'
        case 'MATURITY':
          return '到期未处理'
        default:
          return '-'
      }
    },
    formatFirstDisplay (str) { // 平面图优先展示
      switch (str) {
        case 'CONTRACT':
          return '合同信息'
        case 'YXTENANT':
          return '意向客户'
        default:
          return '-'
      }
    },
    formatUseStatus (str) { // 房源状态
      switch (str) {
        case 'USING':
          return '使用中'
        case 'DISABLE':
          return '已停用'
        default:
          return '-'
      }
    },
    formatPriceUnit (str) { // 预期单价单位
      switch (str) {
        case 'M2DAYS':
          return '元/㎡天'
        case 'M2MONTH':
          return '元/㎡月'
        case 'DAY':
          return '元/天'
        case 'MONTH':
          return '元/月'
        default:
          return '-'
      }
    },
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
    formatIndustry (str) { // 预期业态
      switch (str) {
        case 'LIFE':
          return '生活配套'
        case 'FOOD':
          return '餐饮'
        case 'RETAIL':
          return '零售'
        case 'BDUCATION':
          return '亲子教育'
        case 'CSE':
          return '娱乐'
        case 'FINANCIAL':
          return '金融'
        case 'REALESTATE':
          return '房地产'
        case 'SERVICE':
          return '其他'
        default:
          return '-'
      }
    },
    formatsPriceUnit (val) { // 实时单价
      let priceUnit = ''
      if (val === 'M2DAYS') {
        priceUnit = '元/㎡天'
      } else if (val === 'M2MONTH') {
        priceUnit = '元/㎡月'
      } else if (val === 'DAY') {
        priceUnit = '元/天'
      } else if (val === 'MONTH') {
        priceUnit = '元/月'
      }
      return priceUnit
    },
    formatProjectTypey (val) { // 工程条件
      switch (val) {
        case 'KWH':
          return '用电量  用电需求'
        case 'SWWER':
          return '排污水  排污水管径需求'
        case 'WASTE_WATER':
          return '排废水  排废水管径需求'
        case 'FEED_WATER':
          return '给水  给水管径需求'
        case 'AIR_CONDITION':
          return '空调  空调制冷量需求'
        case 'OIL_DIAIN':
          return '排油  隔油池容积'
        case 'FLUE':
          return '烟道  排烟量需求'
        case 'CAS':
          return '燃气  燃气流量需求'
        default:
          return '-'
      }
    },
    formatProjectUnit (val) {
      switch (val) {
        case 'KWH':
          return 'kw'
        case 'SWWER':
          return 'w/㎡'
        case 'WASTE_WATER':
          return 'mm'
        case 'FEED_WATER':
          return 'm³'
        case 'AIR_CONDITION':
          return 'mm'
        case 'OIL_DIAIN':
          return 'm³/h'
        case 'FLUE':
          return 'mm'
        case 'CAS':
          return 'm³/h'
        default:
          return '-'
      }
    },
    onHide () {
      this.EngInfoListInit(this.EngInfoList)
      ++this.keyVersions
      this.currentIndex = 0
      this.activeName = 'num0'
      this.$emit('drawerClose', false)
    },
    selectImg (type) {
      if (type === 'add') {
        if (this.selectIndex === this.roomInvestmentData.roomsDTO.imgUrls.length - 1) {
          return
        }
        this.selectIndex += 1
      } else {
        if (this.selectIndex === 0) {
          return
        }
        this.selectIndex -= 1
      }
      this.selectedImg = this.roomInvestmentData.roomsDTO.imgUrls[this.selectIndex]
    }
  }
}
</script>
<style lang="scss">
.elTabs {
  padding: 0 30px;
  .el-tabs__header {
    box-shadow: 1px 1px 8px #eee;
  }
  .el-tabs__item {
    min-width: 100px;
    text-align: center;
    height: 50px;
    line-height: 50px;
  }
  .el-tabs__nav-next {
    line-height: 50px;
    width: 30px;
    font-size: 18px;
    text-align: center;
  }
  .el-tabs__nav-prev {
    line-height: 50px;
    width: 30px;
    font-size: 18px;
    text-align: center;
  }
  .el-tabs__nav-scroll {
    margin: 0 20px;
  }
  .el-tabs__nav-wrap::after {
    height: 0;
  }
}
</style>
<style lang="scss" scoped>
.store-details.details-content {
  width: 1200px !important;
}
.tenant-details {
  width: 1040px;
  .main-content {
    /*padding: 80px 30px 0!important;*/

    > div {
      width: 650px;
    }
    .intentionlist {
      width: 100%;
      position: relative;
      padding: 15px 0;
      border-bottom: 1px solid #eeeeee;
      &:first-child {
        padding-top: 0;
      }
      &:last-child {
        border-bottom: none;
      }
      > span {
        position: absolute;
        right: 10px;
        top: 6px;
      }
    }
    .wheelplanting {
    }
    .wheelp-list {
      position: relative;
      div {
        width: 40px;
        height: 40px;
        display: inline-block;
        margin-right: 4px;
        &:last-of-type {
          margin-right: 0;
        }
        img {
          width: 100%;
          height: 100%;
          border: 1px solid #dadada;
        }
      }
      .iconRight {
        transform: rotate(180deg);
        -ms-transform: rotate(180deg); /* IE 9 */
        -moz-transform: rotate(180deg); /* Firefox */
        -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
        -o-transform: rotate(180deg); /* Opera */
        position: absolute;
        left: -15px;
      }
      .icon-right {
        position: absolute;
        cursor: pointer;
        bottom: 12px;
      }
      .imgborder {
        border: 1px solid #409eff;
      }
    }
  }
}
.dialog-footer {
  margin-top: -80px;
}
.title {
  font-size: 14px;
  color: #666666;
  padding-left: 10px;
  background-color: #fafafa;
  height: 40px;
  line-height: 40px;
  font-weight: bold;
}
.part1 {
  min-height: 250px;
  border: 1px solid #eeeeee;
  .content {
    padding: 15px;
    // display:flex;
    // justify-content: space-between;
    // align-items: center;
    min-height: 208px;
  }
  .content > div {
    div {
      img {
        width: 218px;
        height: 140px;
      }
    }
    p {
      height: 40px;
      line-height: 40px;
      font-size: 12px;
      color: #6e6e6e;
      display: flex;
      align-items: center;
      span {
        &:first-child {
          color: #000;
          display: inline-block;
          width: 110px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: right;
        }
        &:last-child {
          display: inline-block;
          width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
        }
      }
    }
  }
}
.part2 {
  margin-top: 20px;
  height: 220px;
  border: 1px solid #eeeeee;
  .content {
    padding: 15px;
    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;
    height: 200px;
    .item {
      width: 50%;
      display: flex;
      justify-content: flex-start;
      height: 40px;
      span {
        &:first-child {
          font-size: 12px;
          display: inline-block;
          color: #333;
        }
        &:last-child {
          color: #6e6e6e;
          padding-left: 15px;
          font-size: 12px;
        }
      }
    }
  }
}
.part3 {
  margin-top: 20px;
  // height: 215px;
  border: 1px solid #eeeeee;
  padding-bottom: 40px;
  .content {
    padding: 15px;
    div {
      span {
        display: inline-block;
        font-size: 12px;
        color: #333;
        width: 31%;
        margin-bottom: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &:nth-of-type(1),
        &:nth-of-type(4n) {
          width: 26%;
        }
      }
      &.tableTitle {
        font-size: 12px;
        border-bottom: 1px solid #eee;
        position: relative;
        margin-bottom: 10px;
        .chakan {
          position: absolute;
          right: 0;
        }
      }
      &.item {
        height: 60px;
        line-height: 60px;
        border-bottom: 1px solid #eee;
      }
      // display: flex;
      // justify-content: space-between;
    }
  }
}
.typeTab {
  position: absolute;
  left: 0;
  top: 50px;
  width: 1140px;
  z-index: 999999999;
  margin: 0 30px;
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
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    &.active {
      color: #3175d2;
      border-bottom: 2px solid #3175d2;
    }
  }
}
</style>
