<template>
  <div class="addMaintain">
    <app-header :title="title"
                @confirmFn="confirmFn"
                :mode="false">
      <!-- <div @click="backFn"
           class="left_btn mintui mintui-back"
           slot="leftBtn"></div> -->
      <div slot="rightBtn">
        <div @click.stop="submit">提交</div>
      </div>
    </app-header>
    <div class="basicInfo">
      <div class="title">基本信息</div>
      <div class="content">
        <div class="item">
          <span>维保类型<i class="required">*</i></span>
          <span>设备</span>
        </div>
        <div class="item">
          <span>维保方式<i class="required">*</i></span>
          <span>保养</span>
        </div>
        <div class="item">
          <span>维保结果<i class="required">*</i></span>
          <span>
            <van-radio-group v-model="addData.repairStatus"
                             direction="horizontal">
              <van-radio name="COMPLETE">完成</van-radio>
              <van-radio name="NO"
                         style="margin-right:0">未完成</van-radio>
            </van-radio-group>
          </span>
        </div>
        <div class="item">
          <span>设备编号<i class="required">*</i></span>
          <span class="btn"
                @click="toSelectEquirement">
            <span v-if="addData.equirementNo">{{addData.equirementNo}}</span>
            <span v-else
                  class="selectBtn">请选择</span>
            <i class="iconfont iconright"></i>
          </span>
        </div>
        <div class="item">
          <span>设备名称<i class="required">*</i></span>
          <span>
            <input type="text"
                   placeholder="请输入"
                   v-model="addData.name"
                   maxlength="20" />
          </span>
        </div>
        <div class="item">
          <span>维保人员<i class="required">*</i></span>
          <span>
            <input type="text"
                   placeholder="请输入"
                   v-model="addData.repairUserName"
                   maxlength="20" />
          </span>
        </div>
        <div class="item">
          <span>维保日期<i class="required">*</i></span>
          <span class="btn"
                @click="showDatetime = true">
            <span v-if="addData.repairDate">{{addData.repairDate}}</span>
            <span v-else
                  class="selectBtn">请选择</span>
            <i class="iconfont iconright"></i>
          </span>
        </div>
        <div class="item">
          <span>维保费用<i class="required">*</i></span>
          <span>
            <input type="text"
                   placeholder="请输入"
                   v-model="addData.repairFee"
                   maxlength="20" />
          </span>
        </div>
        <div class="item">
          <span>维保原因</span>
        </div>
        <div style="padding-bottom:14px">
          <input type="text"
                 style="width:100%;color:#18191A;padding-right:14px"
                 placeholder="请输入"
                 v-model="addData.description"
                 maxlength="40" />
        </div>
        <div class="item">
          <span>用材情况</span>
        </div>
        <div style="padding-bottom:14px">
          <input type="text"
                 style="width:100%;color:#18191A;padding-right:14px"
                 placeholder="请输入"
                 v-model="addData.materialUsage"
                 maxlength="40" />
        </div>
        <div class="item">
          <span>备注</span>
        </div>
        <div style="padding-bottom:14px">
          <input type="text"
                 style="width:100%;color:#18191A;padding-right:14px"
                 placeholder="请输入"
                 v-model="addData.remake"
                 maxlength="40" />
        </div>
      </div>
      <div class="imgItem">
        <span>发票及维保后图片</span>
        <span style="color:#023C8F;position: relative;"
              v-if="addData.imageUrls.length<5">
          <i class="iconfont iconcms_fujiantianjia">添加图片
            <aliUpload class="aliUpload"
                       :fileType="fileType"
                       :encrypt="false"
                       @setAnnex="setAnnex" />
          </i>
        </span>
      </div>
      <div class="annexes">
        <div class="item"
             v-for="(item,index) in addData.imageUrls"
             :key="index">
          <div>
            <svg class="icon"
                 aria-hidden="true">
              <use xlink:href="#iconcms_tupiangeshi"></use>
            </svg>
          </div>
          <div>Image0{{index+1}}</div>
          <ailPreview :ailObj="item"
                      :encrypt="true"
                      @setFile="setFile"
                      class="ailPreview" />
          <span @click="delEnclosure(index)"
                class="delcl"><i class="iconfont iconcms_shanchu-233"></i></span>
        </div>
      </div>
    </div>
    <div class="maintainPlan">
      <div class="title">维保计划</div>
      <div class="content">
        <div class="item">
          <span>下次维保日期</span>
          <span class="btn"
                @click="showDatetime1 = true">
            <span v-if="addData.nextMaintenanceTime">{{addData.nextMaintenanceTime}}</span>
            <span v-else
                  class="selectBtn">请选择</span>
            <i class="iconfont iconright"></i>
          </span>
        </div>
      </div>
    </div>
    <!-- 时间 -->
    <van-popup v-model="showDatetime"
               position="bottom"
               :style="{ height: '50%' }">
      <van-datetime-picker v-model="currentDate"
                           type="date"
                           title="选择年月日"
                           @cancel="showDatetime = false"
                           @confirm="confirmSelect" />
    </van-popup>
    <!-- 下次维保日期 -->
    <van-popup v-model="showDatetime1"
               position="bottom"
               :style="{ height: '50%' }">
      <van-datetime-picker v-model="currentDate1"
                           type="date"
                           title="选择年月日"
                           :min-date="minDate"
                           @cancel="showDatetime1 = false"
                           @confirm="confirmSelect1" />
    </van-popup>

  </div>
</template>

<script>
import context from '@/service'
import AppHeader from '@/components/appHead'
import aliUpload from '@/components/aliUpload.vue'
import ailPreview from '@/components/ailPreview.vue'
import Common from '@/utils/common'
import moment from 'moment-timezone'
import { MessageBox } from 'mint-ui'
import Vue from 'vue'
import { RadioGroup, Radio, Toast } from 'vant'
Vue.use(Toast)
Vue.use(Radio)
Vue.use(RadioGroup)
let roterFrom = null
let roterTo = null
export default {
  name: 'addMaintain',
  components: {
    AppHeader,
    ailPreview,
    aliUpload
  },
  computed: {

  },
  data () {
    return {
      title: '新增保养单',
      showDatetime: false,
      showDatetime1: false,
      currentDate: new Date(),
      currentDate1: new Date(),
      minDate: new Date(2000, 0, 1),
      fileType: ['jpg', 'png'],
      addData: {
        repairType: 'EQUIREMENT',
        maintenanceClassify: 'MAINTAIN',
        repairStatus: 'NO',
        equirementNo: '',
        equirementId: '',
        name: '',
        repairUserName: '',
        repairDate: '',
        repairFee: '',
        description: '',
        materialUsage: '',
        remake: '',
        imageUrls: [],
        nextMaintenanceTime: ''
      },
      selectItem: {}
    }
  },
  created () {
    // 拿取预览页返回来保存数据
    let addMaintainData = sessionStorage.getItem('addMaintainData')
    if (addMaintainData) {
      this.addData = JSON.parse(addMaintainData)
    }
    this.selectItem = JSON.parse(sessionStorage.getItem('selectItem'))
    if (this.selectItem) {
      this.addData.equirementId = this.selectItem.id
      this.addData.equirementNo = this.selectItem.code
      this.addData.name = this.selectItem.name
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'repairList' || from.name === 'maintainList') {
      roterFrom = from.name
    }
    next()
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  beforeRouteLeave (to, from, next) {
    if (to.name !== 'selectEquirement') {
      sessionStorage.removeItem('selectItem')
    }
    if (to.name === 'selectEquirement') {
      sessionStorage.setItem('addMaintainData', JSON.stringify(this.addData))
    }
    next()
  },
  mounted () {
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', this.confirmFn, false)
    }
  },
  destroyed () {
    MessageBox.close()
    window.removeEventListener('popstate', this.confirmFn, false)
  },
  methods: {
    backFn () {
      this.$router.replace({ name: roterFrom })
    },
    toSelectEquirement () {
      this.$router.replace({ name: 'selectEquirement' })
    },
    confirmSelect (val) {
      this.showDatetime = false
      this.addData.repairDate = moment(val).format('YYYY-MM-DD')
    },
    confirmSelect1 (val) {
      this.showDatetime1 = false
      this.addData.nextMaintenanceTime = moment(val).format('YYYY-MM-DD')
    },
    setFile () {

    },
    setAnnex (annexURL, annexName) {  // 子组件上传成功返回文件url 和名字
      this.addData.imageUrls.push(annexURL)
    },
    delEnclosure (index) {
      let _this = this
      MessageBox.confirm('', {
        message: '确定删除图片吗？',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        confirmButtonClass: 'confirmButton',
        cancelButtonClass: 'cancelButton'
      }).then(action => {
        if (action === 'confirm') {
          _this.addData.imageUrls.splice(index, 1)
        }
      })
      // this.addData.imageUrls.splice(index, 1)
    },
    submit (formName) { // 新增维保记录
      if (!this.addData.equirementId || !this.addData.equirementNo) {
        Toast({
          message: '请选择设备',
          position: 'top'
        })
        return
      }
      if (!this.addData.name) {
        Toast({
          message: '请输入设备名称',
          position: 'top'
        })
        return
      }
      if (!this.addData.repairUserName) {
        Toast({
          message: '请输入维保人员',
          position: 'top'
        })
        return
      }
      if (!this.addData.repairDate) {
        Toast({
          message: '请选择维保日期',
          position: 'top'
        })
        return
      }
      if (!this.addData.repairFee) {
        Toast({
          message: '请输入维保费用',
          position: 'top'
        })
        return
      }
      context.http.post('cms/api/repair-records', this.addData).then(res => {
        if (res) {
          Toast({
            message: `保养记录新增成功`,
            position: 'top'
          })
          sessionStorage.removeItem('addMaintainData')
          this.$router.push({ name: roterFrom })
        }
      })
    },
    confirmFn () {
      let _this = this
      if (
        (!this.addData.equirementId || !this.addData.equirementNo) &&
        (!this.addData.name) &&
        (!this.addData.repairUserName) &&
        (!this.addData.repairDate) &&
        (!this.addData.repairFee) &&
        (!this.addData.description) &&
        (!this.addData.materialUsage) &&
        (!this.addData.remake) &&
        (!this.addData.nextMaintenanceTime) &&
        (!this.addData.imageUrls.length)

      ) {
        this.$router.replace({ name: roterFrom })
        return
      }
      MessageBox.confirm('', {
        message: '内容尚未保存，确定退出？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonClass: 'confirmButton',
        cancelButtonClass: 'cancelButton'
      }).then(action => {
        if (action === 'confirm') {
          _this.$router.replace({ name: roterFrom })
        }
      }).catch(error => {
        if (error === 'cancel') {
          if (window.history && window.history.pushState) {
            history.pushState(null, null, document.URL)
          }
        }
      })
    },
    pageGetformat (str) {
      return Common.getformat(str)
    }
  }
}
</script>
<style lang="scss">
@import "../../../style/config";
.addMaintain {
  #app-head {
    .back {
      // display: none !important;
    }
    .left_btn {
      width: rem(40);
      height: rem(40);
      font-size: rem(18);
      color: #000000;
      &:first-child {
        float: left;
      }
    }
    .right_btn {
      width: rem(80);
      text-align: right;
      padding-right: rem(14);
      position: fixed;
      right: 0;
      top: 0;
    }
    .title {
      padding-right: rem(40);
    }
  }
  .van-overlay {
    background: rgba(0, 0, 0, 0.4);
  }
  .van-action-sheet__close {
    display: none;
  }
  .van-number-keyboard {
    position: static;
  }
  .price_input {
    height: rem(50);
    border-bottom: rem(1) solid #0139a4;
    p {
      display: block;
      line-height: rem(50);
      text-align: center;
      font-size: rem(15);
    }
  }
  .price_unit {
    display: flex;
    padding: rem(8) rem(55);
    justify-content: space-between;
    span {
      display: block;
      height: rem(33);
      padding: 0 rem(15);
      line-height: rem(33);
      font-size: rem(15);
      color: #18191a;
      border: rem(1) solid #d9d9d9;
      border-radius: rem(33);
    }
    .active {
      color: #0139a4;
      background: #f3f7ff;
      border: rem(1) solid #c7d9ff;
    }
  }
}
</style>
<style lang="scss" scoped>
@import "../../../style/config";
.addMaintain {
  color: #858c94;
  font-size: rem(15);
  margin-top: rem(40);
  > div {
    background-color: #fff;
    .title {
      height: rem(40);
      line-height: rem(40);
      padding-left: rem(14);
      font-weight: bold;
      color: #18191a;
      border-bottom: rem(1) solid #f0f0f0;
    }
    .imgItem {
      height: rem(40);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 rem(14);
    }
    .content {
      margin-left: rem(14);
      border-bottom: rem(1) solid #f0f0f0;
      > .item {
        height: rem(50);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: rem(14);
        > span {
          &:nth-child(2) {
            color: #18191a;
            &.btn {
              .selectBtn,
              .iconfont {
                color: #d9d9d9;
              }
            }
            input {
              text-align: right;
            }
          }
        }
      }
    }
  }
  .basicInfo {
    margin-bottom: rem(10);
  }
  .maintainPlan {
  }
  .annexes {
    background-color: #fff;
    padding-left: rem(14);
    .title {
      padding: rem(10) 0 rem(13) rem(12);
      font-size: 15px;
      color: rgba(133, 140, 148, 1);
    }
    .item {
      display: flex;
      align-items: center;
      // padding: rem(4) 0 rem(4) 0;
      > div {
        &:first-child {
          margin-right: rem(15);
        }
        &:nth-child(2) {
          width: 70%;
          padding-right: rem(10);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        &:last-child {
          font-size: rem(15);
          color: rgba(24, 25, 26, 1);
        }
      }
    }
    .delcl {
      flex: 1;
      text-align: right;
      margin-right: rem(12);
    }
  }
  .newspush {
    display: flex;
    justify-content: space-between;
    padding-right: rem(14);
  }
  .selected_rooms {
    margin-right: rem(14);
    background: #f2f6ff;
    line-height: rem(24);
    color: #444547;
    font-size: rem(12);
    padding: 0 rem(10);
    margin-bottom: rem(18);
  }
  input::-webkit-input-placeholder,
  textarea::-webkit-input-placeholder {
    color: #d9d9d9;
  }
}
</style>

