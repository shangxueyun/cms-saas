<template>
  <div class="engineeringDetails">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="goBack"></i>
      <div class="headTab">房源工程条件</div>
      <div v-if="hasAuthority('02010406')" @click="submit" class="addBtn">{{readOnly ? '编辑' : '保存'}}</div>
    </div>
    <div class="content">
      <div class="basic-information">
        <div class="content-title">基本信息</div>
        <div class="ul-warp">
          <p v-if="!readOnly" class="ul-tip">注意：比如101房源没有空调制冷条件时，请不要输入任何值；有该工程条件但无具体数值时，可输入‘ - ’代替；</p>
          <div class="content-ul">
            <span>项目简称</span>
            <span>{{details.projectManagement.referred}}</span>
          </div>
          <div class="content-ul">
            <span>楼宇名称</span>
            <span>{{details.building.buildingName}}</span>
          </div>
          <div class="content-ul">
            <span>楼层</span>
            <span>{{details.floor.name}}</span>
          </div>
          <div class="content-ul">
            <span>房源号</span>
            <span>{{details.shopNumber}}</span>
          </div>
          <div class="content-ul">
            <span>房源状态</span>
            <span>{{details.useStatus === 'USING' ? '使用中' : '已停用'}}</span>
          </div>
          <div class="content-ul" v-for="(item,index) in newList" :key="index">
            <span>{{item.key}}</span>
            <span v-if="readOnly">{{item.value.needValue === '' ? '-' : item.value.needValue}}</span>
            <input v-else v-model="item.value.needValue"
                          placeholder="请输入"
                          size="small"
                          maxlength="20">
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import context from '@/service'
import common from '@/utils/common.js'
import { Toast } from 'mint-ui'
export default {
  name: 'engineeringDetails',
  components: { },
  data () {
    return {
      details: {},
      readOnly: true,
      header: [],
      newList: []
    }
  },
  created () {
    this.details = JSON.parse(this.$route.params.item)
    this.getProjectList()
  },
  mounted () {
    this.$parent.$refs['content'].scrollTop = 0
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    submit () {
      if (this.readOnly) {
        this.readOnly = !this.readOnly
      } else {
        let params = {}
        let projectConditions = this.newList.map((item, index) => {
          if (item.value.needValue && item.value.needValue.replace(/\s*/g, '') === '') {
            item.value.needValue = null
          }
          return item.value
        })
        params.projectConditions = projectConditions
        params.roomId = this.details.id
        context.http.put('cms/api/rooms/projectCondition', params).then(res => {
          Toast({
            message: '保存成功',
            position: 'top'
          })
          this.readOnly = !this.readOnly
        })
      }
    },
    compare () {
      let arry = []
      this.header.forEach((v, i) => {
        let obj = {}
        obj.key = this.formatHead(v)
        this.details.projectConditions.forEach((item, index) => {
          if (Number(item.projectType) === Number(v.id)) {
            obj.value = item
          }
        })
        arry.push(obj)
      })
      return arry
    },
    getProjectList () { // 获取工程条件列表
      context.http.get('uaa/api/paramet-managements/name?name=工程条件').then(res => {
        this.header = res.data
        this.newList = this.compare()
        console.log(this.newList)
      })
    },
    formatHead (item) {
      let html = `${item.value} ${item.description ? '(' : ''}${item.description}${item.description ? ')' : ''}`
      return html
    },
    goBack () {
      this.$router.replace({name: 'engineeringList'})
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
.engineeringDetails{
  .noData_text {
    height: rem(80);
    line-height: rem(80);
    text-align: center;
    color: #878a9a;
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
      text-align: center;
      margin: 0 auto;
      color: #444547;
      font-size: rem(16);
      width: rem(200);
    }
    .back {
      position: fixed;
      left: 0;
      top: 0;
      width: rem(40);
      height: rem(40);
      font-size: rem(18);
      color: #000000;
      &:first-child {
        float: left;
      }
    }
    .addBtn {
      width: rem(40);
      height: rem(40);
      position: absolute;
      font-size: rem(15);
      color: #0139A4;
      right:rem(10);
      top:0;
    }
    .selected {
      color: #0139a4;
    }
  }
  .content {
    width: 100%;
    position: relative;
    top: rem(40);
  }
  .basic-information {
    margin-bottom: rem(10);
    background: #fff;
  }
  .content-title {
    color: #18191a;
    font-size: rem(17);
    height: rem(40);
    line-height: rem(40);
    font-weight: bold;
    padding-left: rem(14);
    border-bottom: rem(1) solid #f0f0f0;
  }
  .ul-warp {
    margin: 0 0 0 rem(14);
    border-bottom: rem(1) solid #f0f0f0;
    padding-bottom: rem(16);
    &:last-child {
      border: none;
    }
    .ul-tip{
      padding-top:rem(10);
      font-size: rem(12);
      color:#C81330;
    }
  }
  .content-ul {
    display: flex;
    justify-content: space-between;
    padding-top: rem(16) !important;
    padding-right:rem(14);
    font-size: rem(15);
    > span {
      display: block;
      color: #18191a;
      &:first-child {
        color: #858c94;
        min-width: rem(120);
        margin-right: rem(10);
      }
    }
    input{
      display: block;
      flex: 1;
      text-align: right;
      height:rem(22);
      line-height: rem(22);
    }
  }
  .list{
    padding-left:rem(14);
    li{
      padding: rem(16) rem(14) rem(16) 0;
      position: relative;
      background: #fff;
      border-bottom: rem(1) solid #F0F0F0;
      &:last-child{
        border:0;
      }
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
          width:rem(200);
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
          margin-bottom:rem(6);
          &:last-child{
            margin-bottom: 0;
          }
          span{
            color:#858C94;
          }
        }
        >.momoInfo{
          font-size: rem(15);
          color:#18191A;
        }
        >.momoDate{
          font-size: rem(13);
          color:#858C94;
          text-align: right;
        }
      }
      >span{
        position: absolute;
        right:rem(10);
        top:rem(45);
        font-size: rem(17);
        color:#C6C6C6;
      }
      >.billStatus{
        font-size: rem(15);
        color:#FC5159;
        right:rem(14);
      }
    }
  }
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
      flex: 1;
      display: flex;
      justify-content: flex-end;
    }
  }
  .contractLoadAll{
    background: #fff;
    padding-top:rem(20);
    >p{
      width:rem(80);
    }
  }
}

</style>
