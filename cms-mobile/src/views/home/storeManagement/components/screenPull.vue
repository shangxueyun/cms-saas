<template>
  <!-- 照明计划下拉选择 -->
  <div class="screenPull common_list">
    <div class="head">
      <span class="back" @click="routerTo()">取消</span>
      <div class="headTab">
        <span>{{ title }}</span>
      </div>
      <div
        @click="confirmFn()"
        class="addBtn">
         
      </div>
    </div>
    <div class="Search">
      <form @submit.prevent
        style="width: 100%"
        action="#">
        <input
          type="search"
          v-model="searchValue"
          placeholder="请输入"
          @keyup.enter="Search" />
      </form>
    </div>
    <div
    v-infinite-scroll="loadMore"
    infinite-scroll-disabled="loadBottom"
    infinite-scroll-distance="20"
    infinite-scroll-immediate-check="false"
    :class="tableData.length ? 'ul-warp border' : 'ul-warp border'">
      <p @click="confirmFn(item)" v-for="(item, index) in tableData" :key="index">{{ item.teantName }}</p>
      <div class="loadAll" v-if="tableData.length && tableData.length === total">
        <span>-</span>
        <p style="border-bottom: none;padding: 0 10px;">已经到底了</p>
        <span>-</span>
      </div>
      <div class="noData"
          v-if="tableData.length===0">
        <img src="../../../../assets/nores.png">
        <p>暂无数据</p>
      </div>
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
      searchValue: '',
      popupShow: false,
      ProjectOptions: [],
      confirmLen: [],
      dataReady: false,
      allLoaded: false,
      queryWord: '',
      loadBottom: false,
      total: 0,
      currentPage: 0,
      pgSize: 15
    }
  },
  props: {
    title: {
      type: String,
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
    Search () {
      this.queryWord = this.searchValue
      this.currentPage = 0
      this.tableData = []
      this.getDataLoopGroup()
    },
    async getDataLoopGroup () {
      this.dataReady = false
      this.allLoaded = false
      let param = {
        page: this.currentPage,
        size: 24,
        queryWord: this.queryWord,
        useStatus: 'USING'
      }
      let result = await context.http.get('cms/api/tenant', param)
      this.tableData = this.tableData.concat(result.data.content)
      this.total = result.data.totalElements
      if (this.tableData.length > 0 && this.tableData.length < this.total) {
        this.loadBottom = false
        this.currentPage = this.currentPage + 1
      } else {
        this.currentPage = this.currentPage === 0 ? 0 : this.currentPage - 1
      }
    },
    loadMore (flag) {
      this.loadBottom = true
      this.getDataLoopGroup()
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
    confirmFn (row) {
      this.$emit('confirm', row || {})
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
      border-bottom: rem(1) solid #f0f0f0;
      margin-top: rem(100);
      width: 100%;
      height: 100vh;
      background: #fff;
      overflow: scroll;
      padding-bottom: rem(100);
      position: fixed;
      top: rem(-8);
      p{
        padding: 0 0 0 rem(14);
        line-height: rem(32);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        border-bottom: rem(1) solid #f1f1f1;
      }
    }
    .Search{
      width: auto;
      margin-top: rem(40);
      padding: rem(10);
      background: #fff;
      border-bottom: 1px solid #f1f1f1;
      position: fixed;
      width: 100%;
      z-index: 1;
      left: 0;
      top: 0;
      right: 0;
      input{
        width: 100%;
        height: rem(32);
        padding-left: rem(12);
        border-radius: rem(4);
        background: #f1f1f1;
      }
    }
  .head {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    width: 100%;
    height: rem(40);
    line-height: rem(40);
    overflow: hidden;
    text-align: center;
    font-size: rem(16);
    background: #fff;
    display: flex;
    justify-content: space-between;
    z-index: 11;
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
<style lang="scss">
@import "../../../../style/config";
.screenPull{
  .loadAll{
    padding-bottom: rem(70);
  }
  .loadAll > p {
    line-height: rem(20) !important;
  }
}

</style>
