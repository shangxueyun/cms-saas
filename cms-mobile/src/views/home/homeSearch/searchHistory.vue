
<template>
  <div class="searchHistory">
    <div class="head">
      <i class="van-icon van-icon-search"></i>
      <form @submit.prevent
            action="#">
        <input
          ref="search"
          type="search"
          @focus="clearInput = true"
          @blur="clearInput = false"
          v-model="searchValue"
          @keyup.enter="toSearchList"
          placeholder="请输入关键字搜索"
          autofocus />
      </form>
      <span @click="onCancel">取消</span>
      <!-- <i v-if="clearInput" @click="onClear" class="van-icon van-icon-clear clearInput"></i> -->
    </div>
    <div class="xian"></div>
    <div class="history">
      <div class="title">历史搜索</div>
      <div class="list">
        <span v-for="(item, index) in historyList" :key="index" @click="clickSearchList(item.value)">{{ item.text }}</span>
      </div>
      <i v-if="historyList.length" class="iconfont iconcms_shanchu-233 flex" @click="clearA"></i>
    </div>
  </div>
</template>
<script>
// import AppHeader from '@/components/appHead'
import context from '@/service'
import { Search, Dialog } from 'vant'
export default {
  name: 'searchHistory',
  components: {
    Search,
    [Dialog.Component.name]: Dialog.Component
  },
  data () {
    return {
      searchValue: '',
      historyList: []
    }
  },
  created () {
    this.historyData()
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.search.focus()
    })
  },
  activated () {
    this.historyData()
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    onCancel () {
      this.$router.push({ name: 'index' })
    },
    clearA () {
      Dialog.confirm({
        confirmButtonText: '确定',
        confirmButtonColor: '#0139a4',
        message: '确定清空历史记录吗？'
      })
      .then(() => {
        this.historyList = []
        this.postDeleteSreach('', 'delete')
      })
      .catch(() => {
        // on cancel
      })
    },
    clickSearchList (value, flag1) {
      this.searchValue = value
      // let flag
      // if (!value) {
      //   return false
      // }
      // this.historyList.forEach((v, i) => {
      //   if (v.value === value) {
      //     flag = i
      //   }
      // })
      // if (flag !== undefined) {
      //   this.historyList.splice(flag, 1)
      // }
      // this.historyList.unshift({
      //   text: '',
      //   value
      // })
      // window.localStorage.setItem('historyData', JSON.stringify(this.historyList))
      // if (flag1) {
      //   return false
      // }
      this.toSearchList()
    },
    toSearchList () {
      this.searchValue = this.searchValue.replace(/\s+/g, '')
      if (!this.searchValue) {
        return false
      }
      // this.clickSearchList(this.searchValue, true)
      this.postDeleteSreach(this.searchValue, 'post')
      this.historyData()
      // 跳转
      this.$router.push({
        name: 'searchList',
        params: {
          value: this.searchValue
        }
      })
    },
    postDeleteSreach (value, type) {
      if (type === 'post') {
        context.http.post('cms/api/sreach-records', { sreachName: value, retaiCount: 15 })
      } else if (type === 'delete') {
        context.http.delete('cms/api/sreach-records/all')
      }
    },
    async historyData () {
      // this.postDeleteSreach('虹桥', 'post')
      let request = await context.http.get('cms/api/sreach-records/all')
      let historyData = request.data
      if (historyData) {
        if (historyData.length > 15) {
          historyData.splice(15, 1)
        }
        historyData.forEach((v, i) => {
          // 显示最大字数
          historyData[i] = {
            value: v.sreachName,
            text: ''
          }
          let str = v.sreachName.substr(0, 13) + '...'
          if (v.sreachName.length > 16) {
            historyData[i].text = str
          } else {
            historyData[i].text = v.sreachName
          }
        })
        this.historyList = historyData
      }
    }
  }
}
</script>
<style scoped lang="scss" >
@import "../../../style/config";
.searchHistory {
  width: 100%;
  height: 100%;
  background: #fff;
  .head{
    display: flex;
    position: relative;
    background: #fff;
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
  .history{
    padding: rem(12);
    position: relative;
    .title{
      width: auto;
      font-size: rem(14);
      font-weight: bolder;
      padding-bottom: rem(8);
    }
    .list{
      display: flex;
      flex-flow: wrap;
      justify-content: start;
      span{
        min-width: 20%;
        height: rem(24);
        text-align: center;
        line-height: rem(24);
        background: #f1f1f1;
        margin-right: rem(10);
        margin-bottom: rem(10);
        color: #666666;
        font-size: rem(13);
        padding: 0 rem(10);
      }
    }
    .flex{
      position: absolute;
      top: 6%;
      right: 3%;
    }
  }
}
</style>
