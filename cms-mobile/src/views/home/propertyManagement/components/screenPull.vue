<template>
  <!-- 照明计划下拉选择 -->
  <div class="screenPull common_list">
    <div class="head">
      <span class="back" @click="routerTo()">取消</span>
      <div class="headTab">
        <span>{{ title }}</span>
      </div>
      <div
        @click="confirmFn"
        class="addBtn">
        完成({{ confirmLen.length }})
      </div>
    </div>
    <mt-loadmore class="loadmore" ref="loadmore"
                v-if="DataType == 'loop'"
                :bottom-method="loadBottom"
                :autoFill="false"
                :bottom-all-loaded="allLoaded">
      <div class="ul-warp border" v-for="(item, index) in tableData" :key="index">
        <div class="content-ul noneFlex">
          <div class="checked">
            <van-checkbox checked-color="#1CC296" @change="checkedList" v-model="item.checked"></van-checkbox>
          </div>
          <div class="left">
            <img :src="item.imgurls ? checkItem(item.imgurls[0]) : defaultImg" alt="">
          </div>
          <div class="content_noneFlex" style="display: block">
            <p>{{ item.name }}</p>
            <p>{{ item.lightingGatewayName }}-{{ item.interfaces }}</p>
          </div>
          <div class="right">

          </div>
        </div>
        <div style="clear: both"></div>
      </div>
    </mt-loadmore>
    <mt-loadmore class="loadmore" ref="loadmore"
                v-else-if="DataType == 'group'"
                :bottom-method="loadBottom"
                :autoFill="false"
                :bottom-all-loaded="allLoaded">
      <div class="ul-warp border group" v-for="(item, index) in tableData" :key="index">
        <div class="content-ul noneFlex">
          <div class="checked">
            <van-checkbox checked-color="#1CC296" @change="checkedList" v-model="item.checked"></van-checkbox>
          </div>
          <div class="content_noneFlex" style="display: block">
            <p>{{ item.name }}</p>
            <p><span>回路数：{{ item.lightingLoopNumber }}</span> <span class="remark">{{ item.remark }}</span></p>
          </div>
        </div>
        <div style="clear: both"></div>
      </div>
    </mt-loadmore>
    <div class="loadAll"
        v-if="allLoaded && tableData.length!==0">
      <span>-</span>
      <p>已经到底了</p>
      <span>-</span>
    </div>
    <div class="noData"
        v-if="tableData.length===0 && dataReady">
      <img :src="NOdata">
      <p>暂无数据</p>
    </div>
  </div>
</template>
<script>
import context from '@/service'
import common from '@/utils/common.js'
import Vue from 'vue'
import { Checkbox, CheckboxGroup } from 'vant'

Vue.use(Checkbox)
Vue.use(CheckboxGroup)
export default {
  name: 'detailsGroup',
  data () {
    return {
      NOdata: require('@/assets/nores.png'),
      defaultImg: require('@/assets/berth-default1.png'),
      tableData: [],
      popupShow: false,
      ProjectOptions: [],
      confirmLen: [],
      dataReady: false,
      allLoaded: false,
      total: 0,
      currentPage: 1,
      pgSize: 15
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    ProjectId: {
      type: Number,
      default: ''
    },
    DataType: {
      type: String,
      default: ''
    },
    TransferData: {
      type: Array,
      default: ''
    }
  },
  mounted () {
    // this.$parent.$refs['content'].scrollTop = 0
  },
  created () {
    this.getDataLoopGroup()
  },
  methods: {
    routerTo () {
      this.$emit('cancel')
    },
    checkItem (item) {
      const imageRatio = common.imageRatio(375)
      let paramTxt = `?x-oss-process=image/resize,w_${imageRatio.width},m_fixed` // 图片链接参数  防止安卓手机图片旋转
      return item + paramTxt
    },
    async getDataLoopGroup () {
      this.dataReady = false
      this.allLoaded = false
      let param = {
        page: (this.currentPage - 1),
        size: 9999,
        projectManagementId: this.ProjectId,
        groupFlg: true, // 空闲回路
        sort: 'createdDate,desc'
      }
      let result
      // 接口区分
      if (this.DataType === 'loop') {
        // 回路
        result = await context.http.get('rms/api/lightingLoop', param)
      } else {
        // 群组
        result = await context.http.get('rms/api/lightingGroup', param)
      }
      let Data
      if (this.currentPage > 1) {
        result.data.forEach(v => { v.checked = false })
        Data = this.tableData.concat(result.data)
      } else {
        Data = result.data
      }
      this.tableData = this.filter(Data)
      this.total = Number(result.headers['x-total-count'])
      this.allLoaded = true// 若数据已全部获取完毕
      this.dataReady = true
    },
    // 选中数据筛选
    filter (arr) {
      this.TransferData.forEach((v, i) => {
        arr.forEach((o, key) => {
          if (v.id === o.id) {
            o.checked = true
            if (v.childTimes) {
              o.childTimes = v.childTimes
            }
            this.confirmLen.push(v)
          }
        })
        v.checked = true
      })
      return arr
    },
    checkedList () {
      let len = []
      let vm = this
      this.tableData.forEach(element => {
        if (element.checked) {
          len.push(element)
        } else {

        }
        vm.TransferData.forEach((v, i) => {
          if (element.id === v.id) {
            vm.TransferData[i].checked = element.checked
          }
        })
      })
      this.confirmLen = len
    },
    loadBottom () {
      this.currentPage++
      this.getDataLoopGroup()
      this.$refs.loadmore.onBottomLoaded()
    },
    confirmFn () {
      let arr = this.confirmLen.concat(this.TransferData)
      let arrids = Array.from(new Set(arr.map((x, index, self) => {
        if (x.checked) {
          return x['id']
        } else {
          return 99999
        }
      })))
      let returnData = []
      arrids.forEach((item, i) => {
        for (let key = 0; key < arr.length; key++) {
          if (item === arr[key].id) {
            returnData.push(arr[key])
            break
          }
        }
      })
      this.$emit('confirm', returnData)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/config";
.screenPull {
    // ul {
      
    // }
    .ul-warp{
      padding: 0 0 0 rem(14);
      border-bottom: rem(1) solid #f0f0f0;
    }
  .head {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: rem(40);
    line-height: rem(40);
    overflow: hidden;
    text-align: center;
    font-size: rem(16);
    background: #fff;
    display: flex;
    justify-content: space-between;
    z-index: 9;
    box-shadow: 0px 1px 4px 0px rgba(230, 230, 230, 0.5);
    .headTab {
      color: #444547;
      font-size: rem(16);
      width: rem(120);
      display: flex;
      justify-content: center;
      > span {
        position: relative;
        &.active {
          color: #0139a4;
          border-bottom: rem(3) solid #0139a4;
          font-weight: bold;
        }
        &:nth-child(2) {
          margin-left: rem(40);
        }
      }
    }
    .back {
      width: rem(40);
      height: rem(40);
      color: #686868;
      &:first-child {
        float: left;
        margin-right: rem(4);
        margin-left: 0.2rem;
      }
    }
    .addBtn {
      height: rem(40);
      position: relative;
      color: #0139A4;
      font-size: rem(15);
      margin-right: .35rem;
    }
    .selected {
      color: #0139a4;
    }
  }
  .loadmore{
    margin-top: rem(44);
  }
  .noneFlex{
    display: flex;
    .left{
      display: block;
      float: left;
      width: rem(70);
      margin-right: rem(6);
      margin: rem(10) auto;
      img{
        width: rem(70);
        height: rem(68);
        border-radius: rem(6);
      }
    }
    .content_noneFlex{
      display: block;
      float: left;
      width: 66%;
      padding: rem(22) 0px;
      margin-left: rem(10);
      p:first-child{
        font-size: rem(15);
        color: #18191A;
        font-weight: bolder;
        padding-bottom: rem(10);
      }
      p:last-child{
        font-size: 14px;
        color: #858C94;
      }
    }
    .right{
      display: block;
      width: 12%;
      text-align: center;
      line-height: rem(62);
    }
    .checked{
      display: flex;
      margin-right: rem(6);
    }
  }
  .group{
    width: auto;
    .content_noneFlex{
      width: 86%;
      .remark {
        display: block;
        width: 65%;
        float: right;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
    li {
      padding: rem(14) rem(14) rem(14) 0;
      padding-left: rem(14);
      background-color: #ffffff;
      margin-bottom: rem(10);
      position: relative;
      border-bottom: rem(1) solid #f0f0f0;
      > div {
        display: flex;
        flex-wrap: wrap;
        &:first-child {
          justify-content: space-between;
          margin-bottom: rem(8);
          font-size: rem(15);
          color: #444547;
          .shopNb {
            font-weight: bold;
            color: #18191a;
            font-size: rem(17);
          }
          .status_action{
            color: #3575F6;
            font-size: rem(15);
          }
          .status{
            color: #858C94;
            font-size: rem(15);
          }
          .shopType {
            &.weizu {
              color: #fc5159;
            }
            &.yizu {
              color: #1cc296;
            }
            &.ziyong {
              color: #444547;
            }
          }
        }
        &:nth-child(2) {
          color: #18191a;
          font-size: rem(15);
          margin-bottom: rem(8);
        }
        &:nth-child(3) {
          color: #858c94;
          font-size: rem(14);
        }
        .shopType {
          color: #858C94;
          font-size: rem(14);
        }
      }
      .postion {
        position: absolute;
        right: rem(14);
        top: 50%;
        margin-top: rem(-10);
        font-size: rem(14);
        color: #c6c6c6;
      }
      .USING{
        right: rem(32);
        top: 46%;
      }
      .bottom-div {
        display: flex;
        justify-content: space-between;
        span{
          color: #858C94;
          font-size: rem(14);
        }
      }
    }
}
</style>
