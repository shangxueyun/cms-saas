<template>
  <div class="buildingDetails">
    <app-header title="楼宇详情"
                class="retitle"
                >
    </app-header>
    <div class="content-warp">
      <!-- 导航区域 -->
      <div class="content" v-show="active === 0">
        <div class="basic-information border_type">
          <div class="content-title">基本信息</div>
          <div class="ul-warp">
            <div class="content-ul">
              <span>管理企业</span>
              <span>{{projectDetail.organizeName}}</span>
            </div>
            <div class="content-ul">
              <span>项目</span>
              <span>
                {{projectDetail.projectManagementDTO.projectName}}
              </span>
            </div>
            <div class="content-ul">
              <span>资产坐落</span>
              <span>{{formatAddressType(projectDetail.addressType)}}</span>
            </div>
            <div class="content-ul">
              <span>地址</span>
              <span>
                {{projectDetail.address}}
              </span>
            </div>
            <div class="content-ul">
              <span>投资方</span>
              <span>
                {{projectDetail.investor}}
              </span>
            </div>
            <div class="content-ul">
              <span>投资金额(万元)</span>
              <span>
                {{projectDetail.investorPrice}}
              </span>
            </div>
            <div class="content-ul">
              <span>用地类别</span>
              <span>
                {{formatBuildingUse(projectDetail.buildingUse)}}
              </span>
            </div>
            <div class="content-ul" v-if="projectDetail.assetsType === 'BUILDING'">
              <span>地上建筑面积(㎡)</span>
              <span>
                {{projectDetail.upArea}}
              </span>
            </div>
            <div class="content-ul" v-if="projectDetail.assetsType === 'BUILDING'">
              <span>地上楼层</span>
              <span>
                {{projectDetail.upAmount}}
              </span>
            </div>
            <div class="content-ul" v-if="projectDetail.assetsType === 'BUILDING'">
              <span>地下建筑面积(㎡)</span>
              <span>
                {{projectDetail.downArea}}
              </span>
            </div>
            <div class="content-ul" v-if="projectDetail.assetsType === 'BUILDING'">
              <span>地下楼层</span>
              <span>
                {{projectDetail.downAmount}}
              </span>
            </div>
            <div class="content-ul" v-if="projectDetail.assetsType === 'BUILDING'">
              <span>可租面积(㎡)</span>
              <span>
                {{projectDetail.buildingArea}}
              </span>
            </div>
            <div class="content-ul" v-if="projectDetail.assetsType === 'BUILDING'">
              <span>竣工年份</span>
              <span>
                {{projectDetail.endWorkDate}}
              </span>
            </div>
            <div class="content-ul" v-if="projectDetail.assetsType === 'BUILDING'">
              <span>产权证</span>
              <span>
                {{projectDetail.havaCertificates ? '有证' : '无证'}}
              </span>
            </div>
            <div class="content-ul">
              <span v-if="projectDetail.havaCertificates || projectDetail.assetsType != 'BUILDING'">产权资产类别</span>
              <span v-else>无证资产类别</span>
              <span v-if="projectDetail.assetsType === 'BUILDING'">
                {{projectDetail.certificatesType}}
              </span>
              <span v-else>
                {{filterAssetsType(projectDetail.assetsType)}}
              </span>
            </div>
            <div class="content-ul" v-if="projectDetail.assetsType != 'BUILDING'">
              <span>{{ projectDetail.assetsType === 'LAND' ? '土地' : '场地' }}面积{{  projectDetail.assetsType === 'LAND' ? '(亩)' : '(㎡)' }}</span>
              <span>
                {{projectDetail.buildingArea}}
              </span>
            </div>
            <div class="content-ul" v-if="projectDetail.assetsType === 'BUILDING' && projectDetail.havaCertificates">
              <span>权利人名称</span>
              <span>
                {{projectDetail.obligeeName}}
              </span>
            </div>
            <div class="content-ul" v-if="projectDetail.assetsType === 'BUILDING' && projectDetail.havaCertificates">
              <span>产权证编号</span>
              <span>
                {{projectDetail.cqCode}}
              </span>
            </div>
            <div class="content-ul" v-if="projectDetail.assetsType === 'BUILDING' && !projectDetail.havaCertificates">
              <span>建筑结构</span>
              <span>
                {{projectDetail.buildingStructure}}
              </span>
            </div>
            <div class="content-ul" v-if="projectDetail.assetsType === 'BUILDING' && !projectDetail.havaCertificates">
              <span>经营方式</span>
              <span>
                {{projectDetail.managementMode}}
              </span>
            </div>
            <div class="content-ul" v-if="projectDetail.assetsType === 'BUILDING' && !projectDetail.havaCertificates">
              <span>承租方式</span>
              <span>
                {{projectDetail.leaseMode}}
              </span>
            </div>
            <div class="content-ul">
              <span>项目内排序</span>
              <span>
                {{projectDetail.sortNumber}}
              </span>
            </div>
            <div class="content-ul">
              <span>状态</span>
              <span>{{projectDetail.useStatus === 'USING' ? '使用中' : '停用中'}}</span>
            </div>
          </div>
        </div>
        <div class="basic-information" v-if="projectDetail.assetsType === 'BUILDING'">
          <div class="content-title">其他</div>
          <div class="ul-warp">
            <div class="content-ul">
              <span>标准层高(米)</span>
              <span>
                {{projectDetail.buildingHigh}}
              </span>
            </div>
              <div class="content-ul">
              <span>客梯数</span>
              <span>
                {{projectDetail.elevatorAmount}}
              </span>
            </div>
            <div class="content-ul">
              <span>货梯数</span>
              <span>
                {{projectDetail.cargoLiftAmount}}
              </span>
            </div>
            <div class="content-ul">
              <span>锅炉数量</span>
              <span>
                {{projectDetail.boilerAmount}}
              </span>
            </div>
            <div class="content-ul">
              <span>室内装修</span>
              <span>
                {{projectDetail.interiorDecoration}}
              </span>
            </div>
            <div class="content-ul">
              <span>外立面装修</span>
              <span>
                {{projectDetail.facadeDecoration}}
              </span>
            </div>
          </div>
        </div>
        <div class="basic-information" style="position: relative;">
          <div class="content-title">管理负责人</div>
          <div class="ul-warp" :style="qualityResponsibleData.length === 0 ? 'border: none' : ''">
            <div class="content-ul" v-for="(item, index) in qualityResponsibleData" :key="index">
              <span>{{ item.userName }}/{{ item.telephone }}（{{ item.sex === 'MAN' ? '男' : '女' }}）</span>
              <span>{{ item.positionName }}</span>
            </div>
          </div>
          <!-- <div class="loadAll" v-if="qualityResponsibleData.length !== 0">
            <span>-</span>
            <p>已经到底了</p>
            <span>-</span>
          </div> -->
          <div class="noData"
              v-if="qualityResponsibleData.length===0">
            <img src="../../../assets/nores.png">
            <p>暂无数据</p>
          </div>
        </div>
        <div :class="qualityResponsibleData.length === 0 ? 'basic-information border_bottom margin_' : 'basic-information border_bottom'" :style="contractTenancyData.length === 0 ? 'border: none' : ''">
          <div class="content-title" :style="contractTenancyData.length === 0 ? 'border: none' : ''">租赁合同</div>
          <div class="ul-warp contractTenancy" :style="contractTenancyData.length === 0 ? 'border: none' : ''">
            <div v-for="(item, index) in contractTenancyData" :key="index">
              <p>{{ item.tenant.teantName }}</p>
              <p>租赁面积：{{ item.areaDescription }}</p>
              <p>租期：{{ item.startDate }} ～ {{ item.endDate }}</p>
            </div>
          </div>
          <div class="loadAll" v-if="contractTenancyData.length !== 0">
            <span>-</span>
            <p>已经到底了</p>
            <span>-</span>
          </div>
          <div class="noData"
              v-if="contractTenancyData.length===0">
            <img src="../../../assets/nores.png">
            <p>暂无数据</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import context from '@/service'
import AppHeader from '@/components/appHead'
import ailPreview from '@/components/ailPreview.vue'
export default {
  name: 'buildingDetails',
  components: {AppHeader, ailPreview},
  data () {
    return {
      navsList: [
        '楼宇信息',
        '楼层信息',
        '设置'
      ],
      active: 0,
      activeInfo: 0,
      projectDetail: {
        projectManagementDTO: {
          previewImage: ''
        }
      },
      size: 10,
      tableData: [],
      qualityResponsibleData: [],
      contractTenancyData: [],
      dataReady: false,
      loadAll: false,
      address: '',
      showPicture: false,
      imgArr: [],
      buildOptions: [
        {label: '商业', value: 'BUSSINESS'},
        {label: '办公', value: 'OFFICE'},
        {label: '厂房', value: 'FACTORY'},
        {label: '仓储', value: 'WAREHOUSE'},
        {label: '交通运输', value: 'TRAFFIC'},
        {label: '教育', value: 'EDUCATION'},
        {label: '其他', value: 'OTHER'}
      ]
    }
  },
  created () {
    const id = this.$route.query.id
    this.queryProjectDetail(id)
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'building') {
      to.query.useStatus = this.$route.query.useStatus
    }
    next()
  },
  methods: {
    async queryProjectDetail (id) {
      let result = await context.http.get(`cms/api/buildings/${id}`)
      this.projectDetail = result.data
      this.qualityResponsible()
      this.contractTenancy()
    },
    switchTo (index) {
      this.active = index
    },
    getbuildingUse (state) {
      if (state) {
        let cur = this.buildOptions.filter(item => item.value === state)
        return cur[0].label
      }
    },
    formatAddressType (type) {
      if (type === 'inTown') {
        return '镇内'
      } else if (type === 'outTown') {
        return '镇外'
      }
    },
    formatBuildingUse (type) {
      if (type === 'RESIDENCE') {
        return '住宅用地'
      } else if (type === 'INDUSTRY') {
        return '工业用地'
      } else if (type === 'BUSSINESS') {
        return '商业用地'
      } else if (type === 'COMPREHENSIVE') {
        return '综合用地'
      } else if (type === 'PUBLIC') {
        return '公共用地'
      } else if (type === 'RETAIN') {
        return '保留用地'
      } else if (type === 'GREEN') {
        return '绿化用地'
      } else if (type === 'OTHER') {
        return '其他用地'
      }
    },
    async contractTenancy () {
      let result = await context.http.get(`cms/api/contracts/building/`, {
        buildingId: this.$route.query.id })
      if (result.status === 200) {
        this.contractTenancyData = result.data
      }
    },
    filterAssetsType (type) {
      let value
      if (type === 'BUILDING') {
        value = '楼宇'
      } else if (type === 'FIELD') {
        value = '场地'
      } else if (type === 'LAND') {
        value = '土地'
      }
      return value
    },
    async qualityResponsible () {
      let result = await context.http.get(`cms/api/buildingManageUser/buildingId/${this.$route.query.id}`)
      if (result.status === 200) {
        this.qualityResponsibleData = result.data
      }
    }
  }
}
</script>
<style lang="scss">
  .buildingDetails {
    .ailPreview{
      text-align: left!important;
    }
  }
</style>
<style lang="scss" scoped>
@import "../../../style/config";
.buildingDetails{
  .content-warp {
    margin-top: rem(40);
    font-size: rem(15);
  }
  /* 导航栏的样式 */
  .navs {
    position: fixed;
    top: rem(40);
    width: 100%;
    height: rem(46);
    background-color: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 3;
    white-space: nowrap;
    overflow-x: scroll;
    box-shadow: 0px 1px 4px 0px rgba(230, 230, 230, 0.5);
  }
  .navs li {
    display: inline-block;
    font-size: rem(15);
    color: #444547;
    text-align: center;
  }
  /* 当导航被点亮后改变颜色 */
  .navs .active {
    color: #0139a4;
    font-size: rem(17);
    font-weight: bold;
  }
  .underline {
    width: rem(70);
    height: rem(3);
    background: rgba(1, 57, 164, 1);
    border-radius: rem(2);
    position: relative;
    top: rem(6);
    margin: 0 auto;
  }
  .content {
    width: 100%;
    position: relative;
    top: rem(0);
  }
  .basic-information {
    margin-bottom: rem(10);
    background: #fff;
    .projectinfor{
      display: flex;
      justify-content: space-between;
      padding: rem(20) rem(14) rem(20);
      border-bottom: rem(1) solid #F0F0F0;
      img {
        width: rem(90);
        height: rem(90);
        border-radius: rem(4);
      }
      span {
        color: #18191A;
      }
    }
  }
  .border_type{
    border-bottom: rem(1) solid #f0f0f0;
    margin-bottom: 0
  }
  .content-title {
    color: #18191a;
    font-size: rem(17);
    height: rem(40);
    line-height: rem(40);
    font-weight: bold;
    padding-left: rem(14);
    border-bottom: rem(1) solid #f0f0f0;
    .tips{
      color: #858C94;
      font-size: rem(13);
      font-weight: normal;
    }
  }
  .ul-warp {
    margin: 0 0 0 rem(14);
    border-bottom: rem(1) solid #f0f0f0;
    padding-bottom: rem(16);
    &:last-child {
      border: none;
    }
    .ul-header{
      height: rem(40);
      line-height: rem(40);
      padding-left: rem(14);
      border: 1px dashed #858C94;
      background: #f7f8fa;
      .ring{
        display: inline-block;
        width: rem(8);
        height: rem(8);
        border: 2px solid #3575F6;
        border-radius: 100%;
      }
      span {
        font-weight: bold;
      }
    }
  }
  .ul-warp1{
    margin: 0;
    padding-top: rem(14);
    .content-ul{
      padding-left: rem(14);
    }
  }
  .content-ul {
    display: flex;
    justify-content: space-between;
    padding-top: rem(16) !important;
    padding-right:rem(14);
    font-size: rem(15);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    > span {
      color: #18191a;
      &:first-child {
        color: #858c94;
        min-width: rem(64);
        margin-right: rem(10);
      }
    }
  }
  .remark-ul{
    display: inline-block;
    width: 100%;
    .remark-title{
      color: #858c94;
      margin-bottom: 16px;
    }
    img {
      width: rem(100);
      height: rem(100);
      border-radius: rem(4);
    }
  }
  .container{
    .list{
      li{
        padding: rem(10) rem(14);
        position: relative;
        margin-bottom:rem(10);
        background: #fff;
        .annex-title{
          color:#18191A;
          font-size: rem(17);
          margin-top: rem(10);
          font-weight: bold;
        }
        .project-center{
        }
        >div{
          >p{
            color: #858C94;
            margin-top: rem(10);
            font-size: rem(14);
          }
        }
        >span{
          position: absolute;
          right:rem(10);
          top:rem(45);
          font-size: rem(14);
          color:#0139A4;
        }
      }
    }
  }
  .border_bottom{
    border-bottom: 1px solid #F0F0F0;
    margin-bottom: 0;
    position: relative;
  }
  .margin_{
    margin-top: rem(276);
  }
  .contractTenancy {
    padding-bottom: 0;
    >div{
      padding: rem(17) 0;
      border-bottom: 1px solid #F0F0F0;
    }
    p{
      line-height: rem(26);
      color: #444547;
      font-size: rem(14);
    }
    p:first-child{
      color: #18191A;
      font-weight: 700;
      font-size: rem(15);
      padding-bottom: rem(5);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
    }
    >div:last-child{
      border-bottom:none
    }
  }
  .noData{
    top: rem(340);
  }
  /* .ailPreview{
    opacity: 0;
  } */
  .an-item{
    display: flex;
    align-items: center;
    padding: rem(14) rem(14) 0;
    &:nth-of-type(2){
      margin-top: 0;
    }
    .image {
      margin-right: rem(10);
    }
    .annex-name{
      width: 80%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      margin-bottom: rem(4);
    }
    .operating {
      width: 80%;
    }
  }  
}

</style>
