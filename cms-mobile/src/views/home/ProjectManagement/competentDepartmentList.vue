<template>
  <div class="competentDepartmentList">
    <app-header :title="title" :onBack="true" backRoute="projectInformation">
      <div slot="rightBtn" @click="$router.push({name: 'addCompetentDepartment', params: {projectMmanagementId: projectMmanagementId}})"
           class="iconfont iconcms_tianjia selectedBtn"></div>
    </app-header>
    <div class="container">
      <ul v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loadBottom"
          infinite-scroll-distance="20"
          infinite-scroll-immediate-check="false"
          v-if="tableData.length" 
          class="list">
        <li @click="toContactsDetail(item)" v-for="(item, index) in tableData" :key="index">
          <p>
            <span>{{item.deptName}}</span>
          </p>
          <div>
            <p>联系人：{{item.contacts[0].name}}</p>
            <p>联系电话：{{item.deptTel}}</p>
          </div>
          <span class="iconfont iconright"></span>
        </li>
      </ul>
      <div class="loadAll" v-if="loadAll && tableData.length!==0">
        <span>-</span>
        <p>已经到底了</p>
        <span>-</span>
      </div>
      <div class="noData" v-if="tableData.length===0 && dataReady">
        <img src="../../../assets/nores.png">
        <p>暂无数据</p>
      </div>
    </div>
  </div>
</template>
<script>
import AppHeader from '@/components/appHead'
import context from '@/service'
import { InfiniteScroll } from 'mint-ui'
export default {
  name: 'competentDepartmentList',
  components: { AppHeader, InfiniteScroll },
  data () {
    return {
      title: '关联单位列表',
      page: 0,
      size: 10,
      loadBottom: false,
      tableData: [],
      dataReady: false,
      loadAll: false,
      flag: true,
      projectMmanagementId: '13'
    }
  },
  mounted () {
    if (this.$route.query.projectMmanagementId) {
      this.projectMmanagementId = this.$route.query.projectMmanagementId
    }
    this.query()
  },
  methods: {
    async query () {
      this.dataReady = false
      this.loadAll = false
      let result = await context.http.get(`cms/api/projectManager/${this.projectMmanagementId}/chargeDepts/pages`, { page: this.page, size: this.size })
      if (result.status === 200) {
        this.dataReady = true
        this.tableData = this.tableData.concat(result.data)
        if (this.tableData.length === Number(result.headers['x-total-count'])) this.loadAll = true
        if (result.data.length > 0) {
          this.loadBottom = false
          this.page = this.page + 1
        } else {
          this.page = this.page - 1
        }
      }
    },
    loadMore () {
      this.loadBottom = true
      this.query()
    },
    checkedFormat (i, arr) {
      arr = arr.map(item => {
        item.checked = false
        return item
      })
      arr[i].checked = true
      return arr
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    toContactsDetail (row) {
      this.$router.push({name: 'competentDepartmentDel', query: {id: row.id}})
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
.competentDepartmentList{
  .selectedBtn{
    padding-left:rem(8);
    font-size: rem(16);
    color:#444547;
  }
  .selected{
    color:#0139A4;
  }
  .actionsheet_wrapper {
    top: rem(41);
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-start;
      padding-top: rem(10);
    }
    li {
      display: inline-block;
      width: rem(100);
      height: rem(30);
      line-height: rem(30);
      color: #444547;
      font-size: rem(13);
      text-align: center;
      background: rgba(242, 242, 242, 1);
      margin-bottom: rem(10);
      margin-left: rem(18);
      border-radius: rem(3);
      &.selected {
        color: #0139a4;
        background: rgba(239, 246, 255, 1);
      }
      .iconfont {
        display: inline-block;
        margin-right: rem(16);
      }
    }
  }
  .seachInput {
    height: $foot-height;
    width: 100%;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    padding: 0 rem(15);
    position: fixed;
    top: rem(40);
    z-index: 3;
    #seachInput::-webkit-search-cancel-button {
      display: none;
    }
    .mintui-search {
      position: absolute;
      left: rem(20);
      top: rem(18);
      color: #666666;
    }
    .input {
      // width: rem(300);
      width: rem(345);
      height: rem(30);
      background: rgba(244, 244, 244, 1);
      border-radius: rem(2);
      padding-left: rem(25);
      font-size: rem(13);
    }
    .cannelBtn {
      color: #0139a4;
      font-size: rem(15);
      margin-left: rem(10);
    }
  }
  .title{
    width:100%;
    position: fixed;
    left:0;
    top:rem(90);
    height:rem(28);
    line-height: rem(28);
    font-size: rem(13);
    color:#444547;
    z-index: 1;
    background: #f8f9fa;
    display: flex;
    white-space: nowrap;
    flex-basis: rem(0);
    flex-shrink: 0;
    align-items: center;
    overflow-x: auto;
    overflow-y: hidden;
    >span{
      display: block;
      line-height: rem(16);
      height:rem(16);
      border-right: rem(1) solid #D8D8D8;
      margin-left:rem(15);
      >span{
        line-height: rem(16);
        margin-right:rem(20);
      }
      >span:last-child{
        margin-right:rem(15);
      }
    }
    >span:last-child{
      border-right: 0;
    }
  }
  &.focus {
    .input {
      width: rem(300) !important;
    }
    .seachInput {
      top: 0 !important;
      border-top: 0;
    }
    .title{
      top:rem(50);
    }
    .container {
      padding-top: rem(78);
    }
    .shadeBox {
      height: calc(100% - #{$foot-height});
      position: fixed;
      left: 0;
      top: $foot-height;
      width: 100%;
      background: rgba(0, 0, 0, 0.2);
      z-index: 2;
    }
  }
  .container{
    padding-top:rem(48);
    .list{
      li{
        padding: rem(10) rem(14);
        position: relative;
        margin-bottom:rem(10);
        background: #fff;
        >p{
          display: flex;
          width:100%;
          justify-content: space-between;
          margin-bottom:rem(6);
          >span{
            display: block;
            line-height: rem(20);
            color:#858C94;
            font-size: rem(15);
            width:rem(90);
            text-align: right;
          }
          >span:first-child{
            text-align: left;
            flex: 1;
            color:#18191A;
            font-weight: 600;
            font-size: rem(15);
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            margin-right:rem(5);
            >span{
              background: #EFF6FF;
              height:rem(17);
              font-weight: 500;
              line-height: rem(17);
              font-size: rem(12);
              color:#0139A4;
              padding:0 rem(3);
              vertical-align: center;
              margin-left:rem(12);
            }
          }
        }
        >div{
          >p{
            color:#858C94;
            font-size: rem(14);
            margin-bottom:rem(4);
            &:last-child{
              margin-bottom: 0;
            }
            span{
              color:#858C94;
            }
          }
        }
        >span{
          position: absolute;
          right:rem(10);
          top:rem(35);
          font-size: rem(17);
          color:#C6C6C6;
        }
      }
    }
  }
}
</style>
