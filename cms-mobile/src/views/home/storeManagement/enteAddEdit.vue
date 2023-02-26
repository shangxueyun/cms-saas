
<template>
  <div class="enteAddEdit">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="goBack"></i>
      <div class="headTab">{{ titleName }}入驻信息</div>
      <div v-if="hasAuthority('02010406')" @click="submit" class="addBtn">{{readOnly ? '提交' : '保存'}}</div>
    </div>
    <div class="content">
      <div class="basic-information">
        <div class="ul-warp">
          <div class="content-ul">
            <span><i class="required">*</i>企业名称</span>
            <span @click="loopPlan = true">
              <template v-if="details.rzEnterpriseName">
                {{ rzEnterpriseName }} <i class="iconfont iconright"></i>
              </template>
              <template v-else>
                请选择 <i class="iconfont iconright"></i>
              </template>
            </span>
          </div>
          <div class="content-ul">
            <span>类别</span>
            <span @click="popupShowClass = true">
              <template v-if="details.moveIntoType">
                {{ details.moveIntoType }} <i class="iconfont iconright"></i>
              </template>
              <template v-else>
                请选择 <i class="iconfont iconright"></i>
              </template>
            </span>
          </div>
          <div class="content-ul">
            <span>租金单位</span>
            <span @click="popupShowPrice = true">
              <template v-if="details.rentPriceType">
                {{ rentPriceTypeName }} <i class="iconfont iconright"></i>
              </template>
              <template v-else>
                请选择 <i class="iconfont iconright"></i>
              </template>
            </span>
          </div>
          <div class="content-ul">
            <span>租金单价</span>
            <input v-model="details.price"
                          placeholder="请输入"
                          size="small"
                          type="number"
                          maxlength="20">
          </div>
          <div class="content-ul">
            <span>租赁起始日期</span>
            <span @click="popupShowStart = true">
              <template v-if="details.startTime">
                {{ details.startTime }} <i class="iconfont iconright"></i>
              </template>
              <template v-else>
                请选择 <i class="iconfont iconright"></i>
              </template>
            </span>
          </div>
          <div class="content-ul">
            <span>租赁截止日期</span>
            <span @click="popupShowEnd = true">
              <template v-if="details.endTime">
                {{ details.endTime }} <i class="iconfont iconright"></i>
              </template>
              <template v-else>
                请选择 <i class="iconfont iconright"></i>
              </template>
            </span>
          </div>
          
        </div>
      </div>
    </div>
    <!-- 开始时间 -->
    <van-popup v-model="popupShowStart"
               position="bottom">
      <van-datetime-picker
                  v-model="currentDateStart"
                  type="date"
                  title="请选择起始日期"
                  @confirm="confirmDayTimeStart"
                  @cancel="popupShowStart = false" />
    </van-popup>
    <!-- 结束时间 -->
    <van-popup v-model="popupShowEnd"
               position="bottom">
      <van-datetime-picker
                  v-model="currentDateEnd"
                  type="date"
                  title="请选择截止日期"
                  @confirm="confirmDayTimeEnd"
                  @cancel="popupShowEnd = false"/>
    </van-popup>
    <!-- 类别 -->
    <van-popup v-model="popupShowClass"
               position="bottom">
      <van-picker show-toolbar 
                  title="请选择类别" 
                  :columns="columns"
                  value-key="text"
                  @confirm="ConfirmClass"
                  @cancel="popupShowClass = false" />
    </van-popup>
    <!-- 租金单价 -->
    <van-popup v-model="popupShowPrice"
               position="bottom">
      <van-picker show-toolbar 
                  title="请选择租金单位" 
                  :columns="columnsPrice"
                  value-key="text"
                  @confirm="ConfirmPrice"
                  @cancel="popupShowPrice = false" />
    </van-popup>
    <!--  -->
    <van-popup duration="0.3" :lock-scroll="false" v-model="loopPlan"
      class="stylePopup"
      position="bottom">
      <screenPull
        v-if="loopPlan"
        title="选择企业"
        @confirm="screenPullConfirm"
        @cancel="screenPullCancel" />
    </van-popup>
  </div>
</template>
<script>
// import AppHeader from '@/components/appHead'
import context from '@/service'
import screenPull from './components/screenPull.vue'
import { Dialog, Picker, Toast } from 'vant'
export default {
  name: 'searchList',
  components: {
    Picker,
    screenPull,
    [Dialog.Component.name]: Dialog.Component
  },
  data () {
    return {
      titleName: '',
      readOnly: false,
      details: {
        roomId: ''
      },
      copydetails: {},
      popupShowStart: false,
      loopPlan: false,
      popupShowEnd: false,
      popupShowClass: false,
      popupShowPrice: false,
      currentDateEnd: '',
      currentDateStart: '',
      rentPriceTypeName: '',
      columns: [
        { text: '一手', value: '一手' },
        { text: '二手', value: '二手' },
        { text: '三手', value: '三手' },
        { text: '四手', value: '四手' },
        { text: '五手', value: '五手' },
        { text: '挂靠', value: '挂靠' }
      ],
      columnsPrice: [
        { text: '元/m²·天', value: 'MJ_MT' },
        { text: '元/月', value: 'MONTH' },
        { text: '元/年', value: 'YEAR' }
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
    this.titleName = this.$route.query.titleName
    this.details = this.$route.query.row || {}
    if (this.$route.query.titleName === '新增') {
      this.readOnly = true
      this.details.roomId = this.$route.query.id
    } else {
      this.readOnly = false
      this.columnsPrice.forEach(v => {
        if (v.value === this.details.rentPriceType) {
          this.rentPriceTypeName = v.text
        }
      })
      if (this.details.rzEnterpriseName.length > 13) {
        this.rzEnterpriseName = this.details.rzEnterpriseName.substr(0, 12) + '...'
      } else {
        this.rzEnterpriseName = this.details.rzEnterpriseName
      }
    }
    this.currentDateEnd = this.details.endTime ? new Date(this.details.endTime) : new Date()
    this.currentDateStart = this.details.startTime ? new Date(this.details.startTime) : new Date()
    this.copydetails = JSON.parse(JSON.stringify(this.details))
  },
  mounted () {
  },
  activated () {

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
    goBack () {
      if (JSON.stringify(this.copydetails) !== JSON.stringify(this.details)) {
        Dialog.confirm({
          confirmButtonText: '确定',
          confirmButtonColor: '#0139a4',
          message: '内容尚未保存，确定退出?'
        })
        .then(() => {
          this.$router.replace({ path: `/storeDetails/${this.$route.query.id}` })
        })
        .catch(() => {
          // on cancel
        })
      } else {
        this.$router.replace({ path: `/storeDetails/${this.$route.query.id}` })
      }
    },
    screenPullConfirm (row) {
      if (row.id) {
        this.details.rzEnterpriseName = row.teantName
        this.details.rzEnterpriseId = row.id
        if (row.teantName.length > 13) {
          this.rzEnterpriseName = row.teantName.substr(0, 12) + '...'
        } else {
          this.rzEnterpriseName = row.teantName
        }
      }
      this.loopPlan = false
    },
    screenPullCancel () {
      this.loopPlan = false
    },
    confirmDayTimeStart (row) {
      this.popupShowStart = false
      if (this.details.endTime) {
        let endTime = new Date(this.details.endTime)
        let startTime = new Date(this.times(row))
        if ((startTime.getTime() - endTime.getTime()) > 0) {
          Toast({
            message: '起始日期不能大于截止日期',
            position: 'top'
          })
          return false
        }
      }
      this.details.startTime = this.times(row)
    },
    confirmDayTimeEnd (row) {
      this.popupShowEnd = false
      if (this.details.startTime) {
        let endTime = new Date(this.times(row))
        let startTime = new Date(this.details.startTime)
        if ((startTime.getTime() - endTime.getTime()) > 0) {
          Toast({
            message: '截止日期不能小于起始日期',
            position: 'top'
          })
          return false
        }
      }
      this.details.endTime = this.times(row)
    },
    ConfirmClass (row) {
      this.details.moveIntoType = row.value
      this.popupShowClass = false
    },
    ConfirmPrice (row) {
      this.details.rentPriceType = row.value
      this.rentPriceTypeName = row.text
      this.popupShowPrice = false
    },
    times (time) {
      let date = new Date(time)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      let d = date.getDate()
      m = m.toString().length === 2 ? m : `0${m}`
      d = d.toString().length === 2 ? d : `0${d}`
      return `${y}-${m}-${d}`
    },
    submit () {
      if (!this.details.rzEnterpriseName) {
        Toast({
          message: '请选择企业名称',
          position: 'top'
        })
        return false
      }
      if (this.details.id) {
        context.http.put('cms/api/enterpriseRooms', this.details).then(res => {
          if (res) {
            Toast({
              message: '编辑成功',
              position: 'top'
            })
            this.$router.replace({ path: `/storeDetails/${res.data.roomId}` })
          }
        }).catch(error => {
          console.log(error)
        })
      } else {
        context.http.post('cms/api/enterpriseRooms', this.details).then(res => {
          if (res) {
            Toast({
              message: '新增成功',
              position: 'top'
            })
            this.$router.replace({ path: `/storeDetails/${res.data.roomId}` })
          }
        }).catch(error => {
          console.log(error)
        })
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
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
.enteAddEdit{
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
<style lang="scss">
.enteAddEdit{
  .stylePopup{
    z-index: 11111 !important;
    height: 100vh;
    bottom: 0;
    top: 0;
    left: 0;
  }  
}
</style>
