
<template>
  <div class="content"
       @click.stop="closeTpis"
       ref="content">
    <div class="selectResult"
         @click="showVanpopup">
      <span>{{currentOrganize.name}}</span>
      <span>{{currentProject.referred}}</span>
      <span>{{currentBuilding.buildingName}}</span>
      <span>{{currentfloors.name}}</span>
    </div>
    <div class="finger"
         id="svgBox"
         ref="svgBox"
         :style="{transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale3d(${scale}, ${scale}, 1)`}"
         v-finger:pinch="pinchHandler"
         v-finger:press-move="pressMoveHandler"
         v-finger:multipoint-start="multipointStartHandler"
         v-finger:rotate="rotateHandler"
         v-finger:tap="tapHandler"
         v-finger:multipoint-end="multipointEndHandler"
         v-finger:double-tap="doubleTapHandler"
         v-finger:long-tap="longTapHandler"
         v-finger:swipe="swipeHandler"
         v-finger:single-tap="singleTapHandler"
         v-html="svg"
         v-if="svg">
    </div>
    <div class="empty"
         v-else>暂无平面图</div>
    <!-- 房源详情TIPs -->
    <div class="showBox"
         :class="[svgListInfo.noTenantRooms.length?'noTenant':'tenants']"
         id="showBox"
         v-show="showBox">
      <i class="iconfont iconcms_guanbi"
         @click.stop="closeTpis"></i>
      <div v-for="item in svgListInfo.tenants"
           style="margin-bottom:10px"
           :key="item.id">
        <p class="title">{{shopNumberFormatter(item.roomsList)}}</p>
        <p><span>客户：</span><span>{{item.referred}}</span></p>
        <p><span>面积：</span><span>{{setArea(item.roomsList)}}m²</span></p>
        <p><span>实时单价：</span><span>{{formatContractPrice(item.contractPrice, 'M2DAYS')}}</span></p>
        <!-- <p><span>当月营业额：</span><span>{{20000|toLocaleString}}</span></p>
        <p><span>实时租金：</span><span>{{20000|toLocaleString}}</span></p> -->
      </div>

      <div v-for="item in svgListInfo.noTenantRooms"
           style="margin-bottom:10px"
           :key="item.id">
        <i class="iconfont iconcms_guanbi"
           @click.stop="closeTpis"></i>
        <p class="title">{{item.shopNumber}}</p>
        <p><span>面积：</span><span>{{item.buildingArea}}m²</span></p>
        <p><span>招商指导价：</span> <span>{{formatContractPrice(item.expectedUnitPrice, item.priceUnit)}}</span></p>
      </div>
    </div>
    <!-- 右侧筛选 -->
    <van-popup v-model="popupShow"
               class="popup_common"
               :overlay-style="{'background-color': 'rgba(0,0,0,.4)'}"
               :style="{ height: '100%' }"
               position="right">
      <p class="popup_title">筛选</p>
      <div class="popup_container">
        <div class="popup_list">
          <p>管理企业</p>
          <ul>
            <li v-for="(item, index) in organizesList"
                :key="item.id"
                @click="selectOrganizes(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>项目</p>
          <ul>
            <li v-for="(item, index) in projectManagementList"
                :key="item.id"
                @click="selectProject(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.referred }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>楼宇</p>
          <ul>
            <li v-for="(item, index) in buildingList"
                :key="item.id"
                @click="selectBuilding(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.buildingName }}</span>
            </li>
          </ul>
        </div>
        <div class="popup_list">
          <p>楼层</p>
          <ul>
            <li v-for="(item, index) in floorsList"
                :key="item.id"
                @click="selectfloors(index, item)"
                :class="{ selected: item.checked }">
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="popup_buttons">
        <div @click="submit('reset')"
             class="popup_default">重置</div>
        <div @click="submit"
             class="popup_active">确定</div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import context from '@/service'
export default {
  name: 'customerChart',
  components: {

  },
  props: {
    index: {
    }
  },
  watch: {
    index: function () {
      this.$nextTick(() => {
        if (this.index) {
          this.initChart()
          // this.queryProjectManagement()
          this.getOrganizes()
        }
      })
    },
    popupShow: function () {
      this.$emit('headShow', this.popupShow)
      console.log(this.popupShow)
    }
  },
  data () {
    return {
      svgListInfo: {
        tenants: [],
        noTenantRooms: []
      },
      showBox: false,
      popupShow: false,
      projectManagementList: [],
      organizesList: [],
      buildingList: [],
      floorsList: [],
      currentOrganize: {},
      currentProject: {},
      currentBuilding: {},
      currentfloors: {},
      initScale: 1,
      deltaX: 0,
      deltaY: 0,
      scale: 1,
      svg: '',
      svgList: [],
      defaultScale: 1,
      projectManagementId: 13,
      buildingId: {},
      floorId: '1层',
      planeType: 'FLOOR' //  平面图类型
    }
  },
  created () {

  },
  mounted () {
    this.$nextTick(() => {

    })
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/config";
* {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.content {
  margin: rem(40) 0 0 0;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 11;
  .selectResult {
    top: rem(40);
  }
  .empty {
    margin-top: rem(100);
    position: absolute;
    width: 100%;
    text-align: center;
  }
  .test {
    width: 100%;
    min-height: 100px;
    position: fixed;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.65);
    color: #fff;
    height: 200px;
    overflow-y: auto;
  }
  .finger {
  }
  #svgBox {
    width: 100%;
    overflow: auto;
    height: 300px;
    margin-top: rem(100);
    border: 1px solid #eee;
    position: absolute;
  }
  .showBox {
    width: rem(230);
    background: rgba(0, 0, 0, 0.7);
    border-radius: rem(4);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    color: #ffffff;
    &.noTenant {
      height: rem(140);
    }
    &.tenants {
      height: rem(380);
      overflow-y: auto;
    }
    .iconfont {
      position: absolute;
      right: rem(10);
      top: rem(10);
    }
    > div {
      > p {
        height: rem(40);
        line-height: rem(40);
        &:not(.title) {
          display: flex;
          justify-content: space-between;
          padding: 0 rem(10);
        }
        &.title {
          margin: 0 rem(8);
          border-bottom: rem(1) solid #656873;
          font-size: 17px;
          font-weight: bold;
          text-align: center;
        }
      }
    }
  }
}
</style>
