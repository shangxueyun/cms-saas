<template>
  <div class="contact"
       :class="{'focus':focus}">
    <div class="title"
         v-if="!focus">
      通讯录
    </div>
    <div class="seachInput">
      <form @submit.prevent
            action="#">
        <input class="input"
               id="seachInput"
               results="5"
               focus
               placeholder="请输入组织名称或员工姓名"
               type="search"
               v-model="inputValue"
               @input="onKeyInput"
               @focus="inputFocus"
               @blur="inputBlur"
               @keyup.13="onKeyInput"
               @keypress="search" />
      </form>
      <i class="mintui mintui-search"></i>
      <span class="cannelBtn"
            v-if="focus"
            @click="toContacts">取消</span>
    </div>
    <div v-if="dataLsit.length"
         class="list">
      <!-- :class="{list_IOS:isIOS}" -->
      <div class="list_item"
           v-for="(item,index) in dataLsit"
           :key="index"
           :class="{'last':index>0?item.key!==dataLsit[index-1].key:false}">
        <div class="indexes">{{item.key}}</div>
        <div class="item"
             v-for="(t,i) in item.arr"
             :key="i"
             @click="callUp(t)">
          <div class="part1">
            <span class="name"
                  v-if="!t.facialPhoto||t.facialPhoto===''">{{nameFormat(t.name)}}</span>
            <img :src="t.facialPhoto"
                 class="phone"
                 v-else>
          </div>
          <div class="part2">
            <div class="text">
              <span class="name1">{{t.name}}</span>
              <span class="station">{{t.userPostName}}</span>
            </div>
            <div class="phone"
                 v-show="!t.onHidePhone">
              <img src="../../assets/phone.png"
                   class="phone">
            </div>

          </div>
        </div>
      </div>
    </div>
    <div class="noData"
         v-if="dataLsit.length===0 && dataReady">
      <img src="../../assets/nores.png">
      <p>没有找到你想要的</p>
    </div>
    <div v-show="shadeBox"
         @touchmove.prevent
         class="shadeBox"></div>
    <div class="debugTxt"
         v-if="debugTxt.length!==0 && isDebug">
      <p v-for="(item,index) in debugTxt"
         :key="index">{{item}}</p>
    </div>
  </div>
</template>
<script>
import AppHeader from '@/components/appHead'
import context from '@/service'
export default {
  name: 'contact',
  footVisible: true,
  components: { AppHeader },
  watch: {
  },
  data () {
    return {
      isDebug: false,
      debugTxt: [],
      shadeBox: false,
      focus: false,
      inputValue: '',
      value: '',
      dataLsit: [],
      dataReady: false
    }
  },
  created () {
    this.getData()
    // this.isIOS()
  },
  beforeDestroy () {
  },
  mounted () {

  },
  computed: {
    // isIOS () {
    //   if (window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
    //     return window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    //   }
    // }
  },
  methods: {
    inputFocus () { // 获取焦点
      this.focus = true
      // if (!this.inputValue && !this.dataLsit.length) {
      //   this.shadeBox = true
      // }
      if (!this.inputValue) {
        this.shadeBox = true
      }
      context.system.store.footVisible = false
      // console.log('获取焦点')
    },
    inputBlur () { // 失去焦点
      // this.focus = false
      // this.shadeBox = false
      // context.system.store.footVisible = true
      // this.inputValue = ''
      // this.getData()
      // console.log('失去焦点')
    },
    onKeyInput (event) { // 输入
      this.shadeBox = false
      // this.inputValue = event.target.value
      this.$nextTick(() => {
        this.getData()
      })
    },
    toContacts () { // 取消
      this.focus = false
      this.shadeBox = false
      this.inputValue = ''
      this.getData()
      context.system.store.footVisible = true
      // this.$router.push({ name: 'contact' })
    },
    search (event) { // 键盘完成事件
      if (event.keyCode === 13) {
        event.preventDefault() // 禁止默认事件（默认是换行）
        this.inputValue = event.target.value
        this.getData()
      }
    },
    callUp (item) {
      // this.debugTxt.push('点击')
      if (item.onHidePhone) {
        return
      }
      if (this.isIOS()) {
        // this.debugTxt.push('ios')
        window.webkit.messageHandlers.jsbridge.postMessage('tel ' + item.telephone)
      } else {
        // this.debugTxt.push('android')
        window.messageHandlers.postMessage('tel ' + item.telephone)
      }
    },
    isIOS () {
      var u = navigator.userAgent
      if (u.indexOf('iPhone') > -1 || u.indexOf('iOS') > -1) {
        // console.log('ios')
        return true
      }
      // console.log('Android')
      return false
    },
    nameFormat (str) {
      if (/^[a-zA-Z]*$/.test(str)) { // 英文
        return str.substring(0, 3)
      } else if (/^[\u4e00-\u9fa5]*$/.test(str)) { // 中文
        return str.substring(str.length - 2)
      } else {
        return str.substring(0, 3)
      }
    },
    firstLatter (str) {
      return str.charAt(0).toUpperCase()
    },
    dataFormat (arr) {
      let newArr = []
      arr.forEach((item, index) => {
        let obj = { key: '', arr: [] }
        if (index > 0) {
          if (this.firstLatter(item.pinyinName) === this.firstLatter(arr[index - 1].pinyinName)) {
            obj.key = this.firstLatter(item.pinyinName)
            obj.arr.push(item)
            for (let i = 0; i < newArr.length; i++) {
              if (obj.key === newArr[i].key) {
                newArr[i].arr.push(item)
              }
            }
          } else {
            obj.key = this.firstLatter(item.pinyinName)
            obj.arr.push(item)
            newArr.push(obj)
          }
        } else {
          obj.key = this.firstLatter(item.pinyinName)
          obj.arr.push(item)
          newArr.push(obj)
        }
      })
      return newArr
    },
    getData () {
      this.dataReady = false
      context.http.get('uaa/api/userMailLists', { sort: 'pinyinName,asc', name: this.inputValue, size: 2000 }).then(res => {
        if (res.status === 200 || res.status === 201) {
          // this.dataLsit = res.data
          this.dataLsit = this.dataFormat(res.data)
          this.dataReady = true
        }
      }).catch(error => {
        console.log(error)
      })
    },
    toContactsSeach () {
      // this.$router.push({ name: 'contactsSeach', params: { dataLsit: this.dataLsit } })
      console.log(context.system.store.footVisible)
      context.system.store.footVisible = false
      console.log(context.system.store.footVisible)
    },
    sweepCode () {
      if (this.isIOS()) {
        window.webkit.messageHandlers.jsbridge.postMessage('qrcode') // ios
      } else {
        window.messageHandlers.postMessage('qrcode')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../style/config";
.debugTxt {
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
  min-width: rem(100);
  height: rem(100);
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-size: rem(12);
  border-radius: rem(4);
  overflow-y: auto;
}
.contact {
  height: 100%;
  color: #18191a;
  // position: relative;
  &.focus {
    .input {
      width: rem(300) !important;
    }
    .seachInput {
      top: 0 !important;
      height: $foot-height;
      .mintui-search {
        position: absolute;
        left: rem(20);
        top: rem(18);
        color: #666666;
      }
    }
    .list {
      margin-top: $foot-height;
    }
    .shadeBox {
      // height: calc(100% - rem(46));
      height: calc(100% - #{$foot-height});
      position: fixed;
      left: 0;
      top: $foot-height;
      width: 100%;
      background: rgba(0, 0, 0, 0.2);
      z-index: 1;
    }
  }
  .noData {
    // width: 100%;
    // padding-top: rem(200);
    > img {
      display: block;
      margin: 0 auto;
      width: rem(140);
      height: rem(140);
    }
    > p {
      color: #444547;
      text-align: center;
      font-weight: bold;
    }
  }
  .list {
    margin-top: rem(110);
    // height: calc(100% - #{$foot-height});
    padding-bottom: $foot-height;
    // overflow-y: auto;
    position: relative;
    &.list_IOS {
      padding-top: rem(90);
    }
    .list_item {
      background-color: #ffffff;
      // padding-bottom: rem(50);
      &.last {
        margin-top: rem(10);
      }
      .indexes {
        padding-left: rem(17);
        padding-top: rem(10);
        font-size: rem(17);
        font-weight: bold;
        color: rgba(24, 25, 26, 1);
      }
      .item {
        height: rem(60);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: rem(16);
        > .part1 {
          width: 10%;
          height: 100%;
          display: flex;
          align-items: center;
          > .name {
            width: rem(34);
            height: rem(34);
            line-height: rem(34);
            text-align: center;
            border-radius: 50%;
            background: rgba(53, 117, 246, 1);
            color: #ffffff;
            font-size: rem(12);
          }
        }
        > .part2 {
          width: 88%;
          display: flex;
          padding-right: rem(16);
          justify-content: space-between;
          height: 100%;
          align-items: center;
          border-bottom: rem(1) solid #fafafa;
          > .text {
            display: flex;
            flex-direction: column;
            > .name1 {
              color: #18191a;
              font-size: rem(15);
            }
            > .station {
              color: #858c94;
              font-size: rem(13);
            }
          }
        }
        .phone {
          width: rem(34);
          height: rem(34);
          border-radius: 50%;
        }
      }
    }
  }
  .seach_div {
    height: rem(50);
    // padding: 0 rem(15);
    background-color: #ffffff;
    border-bottom: rem(1) solid #f8f9fa;
    position: fixed;
    top: rem(60);
    left: 0;
    width: 100%;
  }
  .seachInput {
    // height: $foot-height;
    height: rem(30);
    width: 100%;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    padding: 0 rem(15);
    position: fixed;
    top: rem(80);
    z-index: 2;
    #seachInput::-webkit-search-cancel-button {
      display: none;
    }
    .mintui-search {
      position: absolute;
      left: rem(20);
      top: rem(10);
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
  > .title {
    height: rem(80);
    // line-height: rem(60);
    // padding-left: rem(14);
    padding: rem(38) 0 0 rem(14);
    font-size: rem(25);
    font-weight: bold;
    background-color: #ffffff;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
    > span {
      // padding: rem(38) 0 0 rem(14);
    }
  }
}
</style>
