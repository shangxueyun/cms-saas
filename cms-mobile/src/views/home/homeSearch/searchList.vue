
<template>
  <div class="searchList">
    <div class="head">
      <i class="van-icon van-icon-search"></i>
      <form @submit.prevent
            action="#">
        <input
          ref="search"
          type="search"
          v-model="searchValue"
          @input="inputclear"
          @keyup.enter="onSearch"
          placeholder="请输入关键字搜索"
          autofocus />
      </form>
      <span @click="onCancel">取消</span>
      <i v-if="clearInput" @click="onClear" class="van-icon van-icon-clear clearInput"></i>
    </div>
    <div class="content">
      <template v-if="!activate && dataList.length">
        <div class="typedata" v-for="(item, index) in dataList" :key="index">
          <div class="list">
            <div class="title">{{ item.typeName }}(<span>{{ item.num }}</span>) </div>
            <div class="data" v-for="(child, indexc) in item.children" :key="indexc" @click="toDetails(child, item.typeName)">
              <div :class="child.parantName ? 'data-left' : 'data-left justify'">
                <p class="h3">{{ child.name }}</p>
                <p class="span">{{ child.parantName }}</p>
              </div>
              <div class="data-right">
                <i class="iconfont iconright"></i>
              </div>
            </div>
            <div class="flexd" @click="toList(item.typeName)" v-if="item.num > 5">
              <span >查看更多{{ item.typeName }}</span>
              <i class="iconfont iconright" style="color: #0139A4"></i>
            </div>
          </div>
        </div>
        <div class="noData"
            v-if="dataList.length===0">
          <img src="../../../assets/nores.png">
          <p>暂无数据</p>
        </div>
      </template>
      <!-- 激活单类型 -->
      <template v-if="activateDataList.children.length">
        <div
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loadBottom"
        infinite-scroll-distance="20"
        infinite-scroll-immediate-check="false"
        class="typedata">
          <div class="list">
            <div class="title">{{ activateDataList.typeName }}(<span>{{ activateDataList.num }}</span>) </div>
            <div class="data" v-for="(child, indexc) in activateDataList.children" :key="indexc" @click="toDetails(child, activateDataList.typeName)">
              <div :class="child.parantName ? 'data-left' : 'data-left justify'">
                <p class="h3">{{ child.name }}</p>
                <p class="span">{{ child.parantName }}</p>
              </div>
              <div class="data-right">
                <i class="iconfont iconright"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="loadAll" v-if="activateDataList.children.length === activateDataList.num">
          <span>-</span>
          <p>已经到底了</p>
          <span>-</span>
        </div>
        <div class="noData"
            v-if="activateDataList.length===0">
          <img src="../../../assets/nores.png">
          <p>暂无数据</p>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
// import AppHeader from '@/components/appHead'
import context from '@/service'
import { Search, Dialog } from 'vant'
export default {
  name: 'searchList',
  components: {
    Search,
    [Dialog.Component.name]: Dialog.Component
  },
  data () {
    return {
      searchValue: '',
      dataList: [],
      activateDataList: {
        typeName: '',
        num: '',
        children: []
      },
      clearInput: true,
      activate: false,
      activateType: '',
      loadBottom: false,
      page: {
        page: 0,
        total: 0,
        size: 10
      },
      activateParams: {
        params: []
      },
      params: [
        {
          queryType: 'PROJECT',
          queryWork: '',
          size: 5,
          page: 0
        },
        {
          queryType: 'BUILDING',
          queryWork: '',
          size: 5,
          page: 0
        },
        {
          queryType: 'TENANT',
          queryWork: '',
          size: 5,
          page: 0
        }
      ]
    }
  },
  created () {
    // let searchValue = JSON.parse(window.sessionStorage.getItem('searchValue'))
    // if (searchValue) {
    //   this.searchValue = searchValue.searchValue
    //   if (searchValue.activate) {
    //     this.activateType = searchValue.typeName
    //     this.AquerySearch(this.searchValue)
    //   } else {
    //     this.querySearch(searchValue.searchValue)
    //   }
    //   window.sessionStorage.removeItem('searchValue')
    // } else {
    //   this.searchValue = this.$route.query.value
    //   this.querySearch(this.$route.query.value)
    // }
    this.searchValue = this.$route.params.value
    this.querySearch(this.$route.params.value)
  },
  mounted () {
  },
  activated () {
    if (this.$route.params.value) {
      window.sessionStorage.setItem('searchValue', this.$route.params.value)
      this.clearInput = true
    }
    this.searchValue = window.sessionStorage.getItem('searchValue') || this.$route.params.value
    if (this.searchValue) {
      this.clearInput = true
    }
    this.querySearch(this.searchValue)
  },
  beforeRouteLeave (to, from, next) {
    // if (to.name !== 'searchHistory') {
    //   window.sessionStorage.setItem('searchValue', JSON.stringify({ typeName: this.activateType, activate: this.activate, searchValue: this.searchValue }))
    // }
    next()
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    inputclear (row) {
      if (row.currentTarget.value) {
        this.clearInput = true
      } else {
        this.clearInput = false
      }
    },
    onClear () {
      this.searchValue = ''
      if (this.activate) {
        this.activateParams.params.queryWork = this.searchValue
        this.activateParams.params.page = 0
        this.page.page = 0
        this.activateDataList = {
          typeName: '',
          num: '',
          children: []
        }
        this.AquerySearch(this.searchValue)
      } else {
        this.querySearch(this.searchValue)
      }
      this.clearInput = false
      this.$refs['search'].focus()
    },
    onCancel () {
      if (this.activate) {
        this.activate = false
        this.activateDataList = {
          typeName: '',
          num: '',
          children: []
        }
        this.page.page = 0
        this.searchValue = window.sessionStorage.getItem('searchValue')
        this.querySearch(this.searchValue)
      } else {
        this.$router.push({ name: 'index' })
      }
    },
    onSearch () {
      this.searchValue = this.searchValue.replace(/\s+/g, '')
      if (!this.searchValue) {
        return false
      }
      if (this.activate) {
        this.activateParams.params.queryWork = this.searchValue
        this.activateParams.params.page = 0
        this.page.page = 0
        this.activateDataList = {
          typeName: '',
          num: '',
          children: []
        }
        // this.searchValue = this.$route.query.value
        this.AquerySearch(this.searchValue)
      } else {
        this.querySearch(this.searchValue)
      }
      window.sessionStorage.setItem('searchValue', this.searchValue)
      this.postDeleteSreach(this.searchValue, 'post')
    },
    postDeleteSreach (value, type) {
      if (type === 'post') {
        context.http.post('cms/api/sreach-records', { sreachName: value, retaiCount: 15 })
      } else if (type === 'delete') {
        context.http.delete('cms/api/sreach-records/all')
      }
    },
    loadMore (flag) {
      if (this.activateType) {
        this.loadBottom = true
        this.AquerySearch(this.searchValue, 'loadMore')
      }
    },
    async querySearch (queryString) {
      queryString = queryString.replace(/\s+/g, '') // 去掉空格
      this.params.map((item, index) => {
        this.params[index].queryWork = queryString.replace(/\s+/g, '')
      })
      let result = await context.http.post('cms/api/homePage/query', this.params)
      let data = result.data
      this.dataList = []
      data.forEach((v, i) => {
        let obj = {
          typeName: this.formatName(v.queryType),
          num: v.num,
          children: []
        }
        obj.children = v.page.content
        this.dataList.push(obj)
      })
    },
    async AquerySearch (queryString, flag) {
      if (flag && !this.activateDataList.children) return false

      queryString = queryString.replace(/\s+/g, '') // 去掉空格
      let params = JSON.parse(JSON.stringify(this.params))
      params.map((item, index) => {
        params[index].page = this.page.page
        params[index].size = 14
        params[index].queryWork = queryString
      })
      let result = await context.http.post('cms/api/homePage/query', params)
      let data = result.data
      let obj
      if (this.page.page === 0) {
        this.activateDataList = {
          typeName: '',
          num: '',
          children: []
        }
      }
      data.forEach((v, i) => {
        if (this.activateType === this.formatName(v.queryType)) {
          obj = {
            typeName: this.formatName(v.queryType),
            num: v.num,
            children: []
          }
          let arr = this.activateDataList.children || []
          if (arr.length) {
            obj.children = arr.concat(v.page.content)
          } else {
            obj.children = v.page.content
          }
          this.activateDataList = obj
        }
      })
      if (this.activateDataList.children.length > 0 && this.activateDataList.children.length < this.activateDataList.num) {
        this.loadBottom = false
        this.page.page = this.page.page + 1
      } else {
        this.page.page = this.page.page === 0 ? 0 : this.page.page - 1
      }
    },
    formatName (queryType) {
      // PROJECT("项目"),  BUILDING("楼宇"),TENANT("企业");
      if (queryType === 'PROJECT') {
        return '项目'
      } else if (queryType === 'BUILDING') {
        return '楼宇'
      } else if (queryType === 'TENANT') {
        return '企业'
      }
    },
    toList (name) {
      this.activate = true
      this.activateType = name
      this.activateDataList = {
        typeName: '',
        num: '',
        children: []
      }
      this.AquerySearch(this.searchValue)
    },
    toDetails (row, type) {
      if (type === '项目') {
        this.$router.push({ name: 'projectDetail', query: { id: row.id } })
      } else if (type === '楼宇') {
        this.$router.push({name: 'buildingDetails', query: {id: row.id, useStatus: 'USING'}})
      } else if (type === '企业') {
        this.$router.push({ name: 'TenantDetails', query: { tenantID: row.id } })
      }
    }
  }
}
</script>
<style scoped lang="scss" >
@import "../../../style/config";
.searchList {
  width: 100%;
  .head{
    display: flex;
    position: relative;
    background: #fff;
    position: fixed;
    width: 100%;
    top: 0;
    form{
      width: 82%;
      margin-right: rem(28);
    }
    input{
      width: 100%;
      margin: rem(10) rem(12);
      height: rem(28);
      background: #f1f1f1;
      color: #666;
      border-radius: rem(2);
      padding-left: rem(26);
    }
    input::-webkit-input-placeholder{
      color: #aaaaaa;
    }    /* 使用webkit内核的浏览器 */
    input::-moz-placeholder{
      color: #aaaaaa;
    }                  /* Firefox版本19+ */
    input:-moz-placeholder{
      color: #aaaaaa;
    }
    span{
      margin-top: rem(14);
      color: #0139A4;
      letter-spacing: rem(2);
    }
    .van-search .van-cell{
      padding: rem(4) rem(2) rem(4) 0;
    }
    .van-search--show-action{
      width: 100%;
      height: rem(52);
      background: transparent;
    }
    .van-search__content{
      background: #f1f1f1;
    }
    .clearInput{
      position: absolute;
      top: rem(16);
      right: 16%;
      font-size: rem(16);
      color: #ccc;
    }
    .van-icon-search{
      position: absolute;
      top: 36%;
      left: 5%;
    }
  }
  .xian{
    width: 100%;
    height: rem(6);
    background: #F5F5F9;
  }
  .content{
    border-top: 1px solid #f2f2f2;
    margin-top: rem(52);
    height: 100vh;
    .typedata{
      padding-left: rem(12);
      background: #fff;
      margin-bottom: rem(10);
    }
    .list{
      width: 100%;
      height: 100%;
      overflow: scroll;
      .title{
        color: #858c94;
        font-size: rem(13);
        padding: rem(12) 0;
        border-bottom: rem(1) solid #f0f0f0;
      }
      .data{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: rem(12) 0;
        border-bottom: rem(1) solid #f0f0f0;
        .data-left{
          width: 85%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: rem(44);
          .h3{
            color: #18191a;
            font-size: rem(16);
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          .span{
            color: #858c94;
            font-size: rem(13);
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
        .data-right{
          width: 8%;
          text-align: center;
          padding-top: 4%;
        }
        .justify{
          justify-content: center;
        }
      }
      .flexd{
        width: auto;
        color: #0139A4;
        font-size: rem(13);
        padding: rem(12) 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        span{
          width: auto;
        }
        i{
          padding-right: 2%;
        }
      }
    }
  }
  .van-search__action{
    color: #0139A4;
    letter-spacing: 2px;
  }
}
</style>
<style lang="scss">
@import "../../../style/config";
.searchList{
  .van-field__control{
    font-size: rem(14);
  } 
}
</style>
